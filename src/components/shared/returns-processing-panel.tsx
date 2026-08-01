"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  RotateCcw, Search, ChevronDown, ChevronUp, BarChart3, Activity,
  MapPin, Timer, AlertTriangle, CheckCircle2, Clock, Package,
  Truck, ArrowRight, BoxSelect, Tag, User, IndianRupee, Ban, Undo2,
  ClipboardCheck, XCircle, RefreshCw
} from "lucide-react"

type Rec = any

interface ReturnRecord {
  id: string; orderId: string; customer: string; dc: string; returnReason: string
  category: string; itemValue: string; carrier: string; status: string
  initiatedDate: string; receivedDate: string; inspectedBy: string
  disposition: string; refundStatus: string; expanded: boolean
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
  received: { label: "Received", color: "bg-blue-500", textColor: "text-blue-700 dark:text-blue-400", bgColor: "bg-blue-50 dark:bg-blue-950/30", borderColor: "border-l-blue-500", icon: Package },
  inspecting: { label: "Inspecting", color: "bg-violet-500", textColor: "text-violet-700 dark:text-violet-400", bgColor: "bg-violet-50 dark:bg-violet-950/30", borderColor: "border-l-violet-500", icon: ClipboardCheck },
  approved: { label: "Approved", color: "bg-emerald-500", textColor: "text-emerald-700 dark:text-emerald-400", bgColor: "bg-emerald-50 dark:bg-emerald-950/30", borderColor: "border-l-emerald-500", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "bg-red-500", textColor: "text-red-700 dark:text-red-400", bgColor: "bg-red-50 dark:bg-red-950/30", borderColor: "border-l-red-500", icon: XCircle },
  refunded: { label: "Refunded", color: "bg-slate-500", textColor: "text-slate-700 dark:text-slate-400", bgColor: "bg-slate-50 dark:bg-slate-950/30", borderColor: "border-l-slate-500", icon: RefreshCw }
}

const reasonCfg: Record<string, Rec> = {
  defective: { label: "Defective", color: "bg-red-500" },
  wrong: { label: "Wrong Item", color: "bg-amber-500" },
  damaged: { label: "Damaged", color: "bg-orange-500" },
  size: { label: "Size Issue", color: "bg-blue-500" },
  nolonger: { label: "No Longer Need", color: "bg-slate-500" }
}

const disCfg: Record<string, Rec> = {
  restock: { label: "Restock", color: "bg-emerald-500" },
  refurbish: { label: "Refurbish", color: "bg-amber-500" },
  dispose: { label: "Dispose", color: "bg-red-500" },
  vendor: { label: "Return to Vendor", color: "bg-violet-500" },
  pending: { label: "Pending", color: "bg-slate-500" }
}

const rawReturns: Rec[] = [
  { id: "RTN-01", or: "ORD-2024-78901", cu: "Priya Sharma", dc: "dc1", rr: "defective", ct: "Electronics", iv: "\u20b94,599", cr: "BlueDart", st: "received", id2: "01 Aug 2026", rd: "02 Aug 2026", ib: "Vikram M", di: "pending", rs: "Pending", ex: false },
  { id: "RTN-02", or: "ORD-2024-78234", cu: "Amit Patel", dc: "dc2", rr: "wrong", ct: "Apparel", iv: "\u20b91,299", cr: "Delhivery", st: "inspecting", id2: "31 Jul 2026", rd: "01 Aug 2026", ib: "Sneha K", di: "pending", rs: "Pending", ex: false },
  { id: "RTN-03", or: "ORD-2024-77556", cu: "Rahul Desai", dc: "dc3", rr: "damaged", ct: "Home Decor", iv: "\u20b92,899", cr: "Ekart", st: "approved", id2: "30 Jul 2026", rd: "31 Jul 2026", ib: "Anita R", di: "restock", rs: "Processing", ex: false },
  { id: "RTN-04", or: "ORD-2024-76890", cu: "Neha Gupta", dc: "dc4", rr: "size", ct: "Footwear", iv: "\u20b93,499", cr: "DTDC", st: "rejected", id2: "29 Jul 2026", rd: "30 Jul 2026", ib: "Kumar S", di: "vendor", rs: "Rejected", ex: false },
  { id: "RTN-05", or: "ORD-2024-76123", cu: "Suresh Nair", dc: "dc5", rr: "nolonger", ct: "Books", iv: "\u20b9699", cr: "India Post", st: "refunded", id2: "28 Jul 2026", rd: "29 Jul 2026", ib: "Meera J", di: "restock", rs: "Refunded", ex: false },
  { id: "RTN-06", or: "ORD-2024-75456", cu: "Kavitha R", dc: "dc6", rr: "defective", ct: "Electronics", iv: "\u20b912,999", cr: "DHL Express", st: "received", id2: "01 Aug 2026", rd: "02 Aug 2026", ib: "Rajesh T", di: "pending", rs: "Pending", ex: false },
  { id: "RTN-07", or: "ORD-2024-74789", cu: "Manoj Singh", dc: "dc1", rr: "damaged", ct: "FMCG", iv: "\u20b9450", cr: "Rivigo", st: "inspecting", id2: "01 Aug 2026", rd: "02 Aug 2026", ib: "Pooja D", di: "pending", rs: "Pending", ex: false },
  { id: "RTN-08", or: "ORD-2024-74112", cu: "Deepa Menon", dc: "dc2", rr: "wrong", ct: "Cosmetics", iv: "\u20b91,899", cr: "Safexpress", st: "approved", id2: "30 Jul 2026", rd: "31 Jul 2026", ib: "Sunil V", di: "refurbish", rs: "Processing", ex: false },
  { id: "RTN-09", or: "ORD-2024-73445", cu: "Arun Kumar", dc: "dc3", rr: "defective", ct: "Sports", iv: "\u20b95,499", cr: "TCI Express", st: "rejected", id2: "29 Jul 2026", rd: "30 Jul 2026", ib: "Geeta M", di: "dispose", rs: "Rejected", ex: false },
  { id: "RTN-10", or: "ORD-2024-72778", cu: "Swati Joshi", dc: "dc4", rr: "size", ct: "Jewellery", iv: "\u20b98,999", cr: "BlueDart", st: "refunded", id2: "27 Jul 2026", rd: "28 Jul 2026", ib: "Anand P", di: "restock", rs: "Refunded", ex: false }
]

const returns: ReturnRecord[] = rawReturns.map((r: Rec) => ({
  id: r.id, orderId: r.or, customer: r.cu, dc: r.dc, returnReason: r.rr,
  category: r.ct, itemValue: r.iv, carrier: r.cr, status: r.st,
  initiatedDate: r.id2, receivedDate: r.rd, inspectedBy: r.ib,
  disposition: r.di, refundStatus: r.rs, expanded: r.ex
}))

const viewTabs = [
  { key: "returns", label: "Return Orders", icon: RotateCcw },
  { key: "reasons", label: "Reason Analysis", icon: BarChart3 },
  { key: "financial", label: "Financial Impact", icon: IndianRupee }
]

export function ReturnsProcessingPanel() {
  const [search, setSearch] = React.useState("")
  const [view, setView] = React.useState("returns")
  const [activeFilters, setActiveFilters] = React.useState<Record<string, string>>({})
  const [data, setData] = React.useState<ReturnRecord[]>(returns)

  const toggleExpand = (id: string) => {
    setData(prev => prev.map((r: ReturnRecord) => r.id === id ? { ...r, expanded: !r.expanded } : r))
  }

  const handleFilter = (key: string, value: string) => {
    setActiveFilters(prev => {
      const n: Record<string, string> = Object.assign({}, prev)
      const nv = prev[key] === value ? undefined : value
      if (nv === undefined) { delete n[key] } else { n[key] = nv }
      return n
    })
  }

  const filtered = data.filter((r: ReturnRecord) => {
    if (search && !r.id.toLowerCase().includes(search.toLowerCase()) && !r.orderId.toLowerCase().includes(search.toLowerCase()) && !r.customer.toLowerCase().includes(search.toLowerCase())) return false
    if (activeFilters.status && r.status !== activeFilters.status) return false
    if (activeFilters.returnReason && r.returnReason !== activeFilters.returnReason) return false
    return true
  })

  const stats = React.useMemo(() => {
    const total = data.length
    const pending = data.filter(r => r.status === "received" || r.status === "inspecting").length
    const rejected = data.filter(r => r.status === "rejected").length
    const refunded = data.filter(r => r.status === "refunded").length
    const totalValue = data.reduce((s: number, r: ReturnRecord) => s + parseInt(r.itemValue.replace(/[^\d]/g, ""), 10), 0)
    const avgTAT = "2.4 days"
    return { total, pending, rejected, refunded, totalValue, avgTAT }
  }, [data])

  return (
    <div className="rpn-root">
      <div className="rpn-header">
        <div className="rpn-header-left">
          <div className="rpn-icon-wrap"><RotateCcw className="h-5 w-5 text-rose-600" /></div>
          <div>
            <h3 className="rpn-title">Returns Processing</h3>
            <p className="rpn-subtitle">Reverse logistics, quality inspection &amp; refund management for Indian e-commerce</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="rpn-live-count">{stats.pending} Pending</span>
        </div>
      </div>
      <div className="rpn-stats-grid">
        {[
          { label: "Total Returns", value: String(stats.total), icon: RotateCcw, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-950/40" },
          { label: "Pending", value: String(stats.pending), icon: Clock, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/40" },
          { label: "Rejected", value: String(stats.rejected), icon: XCircle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/40" },
          { label: "Refunded", value: String(stats.refunded), icon: RefreshCw, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
          { label: "Total Value", value: "\u20b9" + (stats.totalValue / 1000).toFixed(1) + "K", icon: IndianRupee, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40" },
          { label: "Avg TAT", value: stats.avgTAT, icon: Timer, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/40" }
        ].map(s => (
          <div key={s.label} className="rpn-stat-card">
            <div className={cn("rpn-stat-icon", s.bg)}><s.icon className={cn("h-4 w-4", s.color)} /></div>
            <div className="rpn-stat-info"><span className="rpn-stat-value">{s.value}</span><span className="rpn-stat-label">{s.label}</span></div>
          </div>
        ))}
      </div>
      <div className="rpn-controls">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search return ID, order, customer..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-sm" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(statusCfg).map(([k, v]: [string, Rec]) => (
            <button key={k} onClick={() => handleFilter("status", k)} className={cn("rpn-filter-chip", activeFilters.status === k && "rpn-filter-active")}>
              <v.icon className="h-3 w-3" />
              <span>{v.label}</span>
              <span className="rpn-chip-count">{data.filter(r => r.status === k).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="rpn-secondary-filters">
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(reasonCfg).map(([k, v]: [string, Rec]) => (
            <button key={k} onClick={() => handleFilter("returnReason", k)} className={cn("rpn-type-chip", activeFilters.returnReason === k && "rpn-type-active")}>
              <span className="rpn-type-dot" style={{ backgroundColor: v.color }} />
              <span>{v.label}</span>
              <span className="rpn-chip-count">{data.filter(r => r.returnReason === k).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="rpn-view-tabs">
        {viewTabs.map(t => (
          <button key={t.key} onClick={() => setView(t.key)} className={cn("rpn-view-tab", view === t.key && "rpn-view-tab-active")}>
            <t.icon className="h-3.5 w-3.5" /><span>{t.label}</span>
          </button>
        ))}
      </div>

      {view === "returns" && (
        <div className="rpn-grid">
          {filtered.map(r => {
            const sc = statusCfg[r.status] as Rec
            const dc = dcCfg[r.dc] as Rec
            const rc = reasonCfg[r.returnReason] as Rec
            const di = disCfg[r.disposition] as Rec
            const SIcon = (sc.icon as React.ElementType) || CheckCircle2
            const isRejected = r.status === "rejected"
            return (
              <div key={r.id} className={cn("rpn-card", `border-l-4 ${sc.borderColor || ""}`, isRejected && "rpn-card-rejected")}>
                <div className="rpn-card-top">
                  <div className="flex items-center gap-2">
                    <span className="rpn-card-id">{r.id}</span>
                    <span className={cn("rpn-status-badge", sc.bgColor, sc.textColor)}><SIcon className="h-3 w-3" />{sc.label}</span>
                    <span className="rpn-reason-badge" style={{ backgroundColor: rc.color + "18", color: rc.color }}>{rc.label}</span>
                  </div>
                  <span className="rpn-value-badge"><IndianRupee className="h-3 w-3" />{r.itemValue}</span>
                </div>
                <div className="rpn-order-row">
                  <span className="rpn-order"><Tag className="h-3 w-3" />{r.orderId}</span>
                  <span className="rpn-customer"><User className="h-3 w-3" />{r.customer}</span>
                </div>
                <div className="rpn-dc-row">
                  <span className="rpn-dc" style={{ color: dc.color }}>{dc.label}</span>
                  <span className="rpn-category">{r.category}</span>
                  <span className="rpn-carrier"><Truck className="h-3 w-3" />{r.carrier}</span>
                </div>
                <div className="rpn-metrics-row">
                  <span className="rpn-metric"><Clock className="h-3 w-3" />Init: {r.initiatedDate}</span>
                  <span className="rpn-metric"><Package className="h-3 w-3" />Recv: {r.receivedDate}</span>
                  <span className="rpn-metric"><ClipboardCheck className="h-3 w-3" />{r.inspectedBy}</span>
                </div>
                <div className="rpn-disposition-row">
                  <span className="rpn-disp-label">Disposition:</span>
                  <span className="rpn-disp-badge" style={{ backgroundColor: di.color + "18", color: di.color }}>{di.label}</span>
                  <span className="rpn-disp-divider">|</span>
                  <span className="rpn-disp-label">Refund:</span>
                  <span className={cn("rpn-refund-text", r.refundStatus === "Refunded" ? "text-emerald-600" : r.refundStatus === "Rejected" ? "text-red-600" : "text-amber-600")}>{r.refundStatus}</span>
                </div>
                <button onClick={() => toggleExpand(r.id)} className="rpn-expand-btn">
                  {r.expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  <span>{r.expanded ? "Hide" : "Details"}</span>
                </button>
                {r.expanded && (
                  <div className="rpn-expanded"><div className="rpn-detail-grid">
                    {[
                      { l: "ID", v: r.id }, { l: "Order", v: r.orderId }, { l: "Customer", v: r.customer },
                      { l: "DC", v: dc.label }, { l: "Category", v: r.category }, { l: "Value", v: r.itemValue },
                      { l: "Carrier", v: r.carrier }, { l: "Inspector", v: r.inspectedBy }
                    ].map(dd => (
                      <div key={dd.l} className="rpn-detail-item"><span className="rpn-detail-label">{dd.l}</span><span className="rpn-detail-value">{dd.v}</span></div>
                    ))}
                  </div></div>
                )}
              </div>
            )
          })}
          {filtered.length === 0 && <div className="rpn-empty">No returns match your filters</div>}
        </div>
      )}

      {view === "reasons" && (
        <div className="rpn-anal-view">
          <div className="rpn-anal-col">
            <h4 className="rpn-anal-title">Returns by Reason</h4>
            {Object.entries(reasonCfg).map(([k, v]: [string, Rec]) => {
              const rd = data.filter(r => r.returnReason === k)
              const totalVal = rd.reduce((s: number, r: ReturnRecord) => s + parseInt(r.itemValue.replace(/[^\d]/g, ""), 10), 0)
              return (
                <div key={k} className="rpn-band-card">
                  <div className="flex items-center gap-2 mb-2"><Undo2 className="h-4 w-4" style={{ color: v.color }} /><span className="rpn-band-name">{v.label}</span><span className="rpn-band-sub">{rd.length} return(s)</span></div>
                  <div className="rpn-band-stats">
                    <div className="rpn-band-stat"><span className="rpn-band-val text-rose-600">\u20b9{(totalVal / 1000).toFixed(1)}K</span><span className="rpn-band-lbl">Total Value</span></div>
                    <div className="rpn-band-stat"><span className="rpn-band-val text-blue-600">{rd.filter(r => r.status === "inspecting").length}</span><span className="rpn-band-lbl">In Inspect</span></div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="rpn-anal-col">
            <h4 className="rpn-anal-title">Disposition Summary</h4>
            {Object.entries(disCfg).map(([k, v]: [string, Rec]) => {
              const dd = data.filter(r => r.disposition === k)
              if (dd.length === 0) return null
              return (
                <div key={k} className="rpn-band-card">
                  <div className="flex items-center gap-2 mb-2"><BoxSelect className="h-4 w-4" style={{ color: v.color }} /><span className="rpn-band-name">{v.label}</span><span className="rpn-band-sub">{dd.length} item(s)</span></div>
                  <div className="rpn-band-stats">
                    <div className="rpn-band-stat"><span className="rpn-band-val text-emerald-600">{dd.filter(r => r.status === "refunded" || r.status === "approved").length}</span><span className="rpn-band-lbl">Completed</span></div>
                    <div className="rpn-band-stat"><span className="rpn-band-val text-amber-600">{dd.filter(r => r.status === "received" || r.status === "inspecting").length}</span><span className="rpn-band-lbl">Pending</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {view === "financial" && (
        <div className="rpn-anal-view">
          <div className="rpn-anal-col">
            <h4 className="rpn-anal-title">Value by DC</h4>
            {Object.entries(dcCfg).map(([k, v]: [string, Rec]) => {
              const dd = data.filter(r => r.dc === k)
              if (dd.length === 0) return null
              const totalVal = dd.reduce((s: number, r: ReturnRecord) => s + parseInt(r.itemValue.replace(/[^\d]/g, ""), 10), 0)
              const refunded = dd.filter(r => r.status === "refunded").length
              return (
                <div key={k} className="rpn-band-card">
                  <div className="flex items-center gap-2 mb-2"><MapPin className="h-4 w-4" style={{ color: v.color }} /><span className="rpn-band-name">{v.label}</span><span className="rpn-band-sub">{dd.length} returns</span></div>
                  <div className="rpn-band-stats">
                    <div className="rpn-band-stat"><span className="rpn-band-val text-amber-600">\u20b9{(totalVal / 1000).toFixed(1)}K</span><span className="rpn-band-lbl">Total Value</span></div>
                    <div className="rpn-band-stat"><span className="rpn-band-val text-emerald-600">{refunded}</span><span className="rpn-band-lbl">Refunded</span></div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="rpn-anal-col">
            <h4 className="rpn-anal-title">High-Value Rejected Returns</h4>
            {data.filter(r => r.status === "rejected").sort((a: ReturnRecord, b: ReturnRecord) => parseInt(b.itemValue.replace(/[^\d]/g, ""), 10) - parseInt(a.itemValue.replace(/[^\d]/g, ""), 10)).map(r => {
              const dc = dcCfg[r.dc] as Rec
              const rc = reasonCfg[r.returnReason] as Rec
              return (
                <div key={r.id} className="rpn-alert-row">
                  <XCircle className="h-3 w-3 text-red-500" />
                  <span className="rpn-alert-name">{r.id} {r.customer}</span>
                  <span className="rpn-alert-stat">{r.itemValue}</span>
                  <span className="rpn-alert-rooms">{rc.label} | {dc.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
