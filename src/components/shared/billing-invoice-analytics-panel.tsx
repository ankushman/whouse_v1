"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  FileText, DollarSign, AlertTriangle, Clock, CheckCircle
} from "lucide-react"

const raw = [
  { id: "BIA-01", invoice: "INV-2026-08451", customer: "Reliance Fresh", entity: "Mumbai DC", amount: 485000, due: "05 Aug 2026", paid: "—", status: "Pending", type: "Storage", daysOut: 0, tax: 87100, total: 572100, region: "West", po: "PO-8234", method: "NEFT", notes: "" },
  { id: "BIA-02", invoice: "INV-2026-08452", customer: "PharmEasy", entity: "Delhi DC", amount: 320000, due: "02 Aug 2026", paid: "—", status: "Overdue", type: "Fulfillment", daysOut: 2, tax: 57600, total: 377600, region: "North", po: "PO-8235", method: "UPI", notes: "Payment reminder sent" },
  { id: "BIA-03", invoice: "INV-2026-08448", customer: "Bosch GmbH", entity: "Bengaluru DC", amount: 1250000, due: "28 Jul 2026", paid: "29 Jul 2026", status: "Paid", type: "Transport", daysOut: 0, tax: 225000, total: 1475000, region: "South", po: "PO-8230", method: "Wire Transfer", notes: "" },
  { id: "BIA-04", invoice: "INV-2026-08449", customer: "JioMart", entity: "Hyderabad DC", amount: 215000, due: "10 Aug 2026", paid: "—", status: "Pending", type: "Value Added", daysOut: 0, tax: 38700, total: 253700, region: "South", po: "PO-8231", method: "NEFT", notes: "Partial credit note" },
  { id: "BIA-05", invoice: "INV-2026-08450", customer: "Adani Wilmar", entity: "Kolkata DC", amount: 890000, due: "01 Aug 2026", paid: "—", status: "Overdue", type: "Cold Chain", daysOut: 3, tax: 160200, total: 1050200, region: "East", po: "PO-8232", method: "Cheque", notes: "Escalated to accounts" },
  { id: "BIA-06", invoice: "INV-2026-08453", customer: "Metro Dairy Ltd", entity: "Chennai DC", amount: 562000, due: "15 Aug 2026", paid: "—", status: "Pending", type: "Cold Chain", daysOut: 0, tax: 101160, total: 663160, region: "South", po: "PO-8236", method: "NEFT", notes: "" },
  { id: "BIA-07", invoice: "INV-2026-08444", customer: "Dabur India", entity: "Delhi DC", amount: 780000, due: "25 Jul 2026", paid: "25 Jul 2026", status: "Paid", type: "Storage", daysOut: 0, tax: 140400, total: 920400, region: "North", po: "PO-8228", method: "NEFT", notes: "" },
  { id: "BIA-08", invoice: "INV-2026-08454", customer: "Serum Institute", entity: "Pune DC", amount: 2100000, due: "20 Aug 2026", paid: "—", status: "Approved", type: "Fulfillment", daysOut: 0, tax: 378000, total: 2478000, region: "West", po: "PO-8237", method: "Wire Transfer", notes: "Govt contract — priority" },
  { id: "BIA-09", invoice: "INV-2026-08443", customer: "Royal Dutch Retail", entity: "Nhava Sheva", amount: 1850000, due: "20 Jul 2026", paid: "22 Jul 2026", status: "Paid", type: "Freight", daysOut: 0, tax: 333000, total: 2183000, region: "West", po: "PO-8227", method: "LC", notes: "FOB shipment" },
  { id: "BIA-10", invoice: "INV-2026-08455", customer: "Al Mulla Electronics", entity: "IGI Airport", amount: 420000, due: "12 Aug 2026", paid: "—", status: "Disputed", type: "Freight", daysOut: 0, tax: 75600, total: 495600, region: "North", po: "PO-8238", method: "Wire Transfer", notes: "Quantity mismatch under review" },
]

interface BIAItem {
  id: string; invoice: string; customer: string; entity: string; amount: number
  due: string; paid: string; status: string; type: string; daysOut: number
  tax: number; total: number; region: string; po: string; method: string; notes: string
}

type Rec = any
const items: BIAItem[] = raw.map((r: Rec) => ({
  id: r.id, invoice: r.invoice, customer: r.customer, entity: r.entity, amount: r.amount,
  due: r.due, paid: r.paid, status: r.status, type: r.type, daysOut: r.daysOut,
  tax: r.tax, total: r.total, region: r.region, po: r.po, method: r.method, notes: r.notes,
}))

const typeColors: Record<string, string> = {
  "Storage": "bg-blue-100 text-blue-700", "Fulfillment": "bg-emerald-100 text-emerald-700",
  "Transport": "bg-orange-100 text-orange-700", "Cold Chain": "bg-cyan-100 text-cyan-700",
  "Value Added": "bg-violet-100 text-violet-700", "Freight": "bg-amber-100 text-amber-700",
}

const statusColors: Record<string, string> = {
  "Paid": "text-emerald-600 font-semibold", "Pending": "text-amber-600 font-semibold",
  "Overdue": "text-red-600 font-semibold", "Approved": "text-blue-600 font-semibold", "Disputed": "text-orange-700 font-semibold",
}

const formatINR = (v: number) => v >= 10000000 ? `\u20b9${(v / 10000000).toFixed(1)}Cr` : v >= 100000 ? `\u20b9${(v / 100000).toFixed(1)}L` : `\u20b9${(v / 1000).toFixed(0)}K`

const BillingInvoiceAnalyticsPanel: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [view, setView] = useState<"invoices" | "aging" | "collections">("invoices")
  const filters = [
    { key: "type", label: "Type", options: ["Storage", "Fulfillment", "Transport", "Cold Chain", "Value Added", "Freight"] },
    { key: "status", label: "Status", options: ["Paid", "Pending", "Overdue", "Approved", "Disputed"] },
    { key: "region", label: "Region", options: ["West", "North", "South", "East"] },
  ]

  const toggleFilter = (key: string, value: string) => {
    setActiveFilters(prev => {
      const n = Object.assign({}, prev)
      if (n[key] === value) { delete n[key] } else { n[key] = value }
      return n
    })
  }

  const filtered = items.filter((r: Rec) =>
    Object.entries(activeFilters).every(([k, v]) => r[k as keyof Rec] === v)
  )

  const totalInv = filtered.length
  const totalRevenue = filtered.filter(r => r.status === "Paid").reduce((s, r) => s + r.total, 0)
  const overdueAmt = filtered.filter(r => r.status === "Overdue").reduce((s, r) => s + r.total, 0)
  const pendingAmt = filtered.filter(r => r.status === "Pending").reduce((s, r) => s + r.total, 0)

  const insights = [
    { label: "Total Invoices", value: totalInv, icon: FileText, bg: "bg-blue-50" },
    { label: "Collected", value: formatINR(totalRevenue), icon: DollarSign, bg: "bg-emerald-50" },
    { label: "Overdue", value: formatINR(overdueAmt), icon: AlertTriangle, bg: "bg-red-50" },
    { label: "Pending", value: formatINR(pendingAmt), icon: Clock, bg: "bg-amber-50" },
  ]

  const isCritical = (r: BIAItem) => r.status === "Overdue" || r.status === "Disputed"
  const isWarning = (r: BIAItem) => r.status === "Pending"

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-3">
        {insights.map(sc => {
          const SIcon = sc.icon as React.ElementType
          return (
            <div key={sc.label} className={`${sc.bg} rounded-lg p-3`}>
              <div className="flex items-center gap-2 mb-1"><SIcon className="w-4 h-4 text-muted-foreground" /><span className="text-xs text-muted-foreground">{sc.label}</span></div>
              <div className="text-lg font-bold">{sc.value}</div>
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map(f => (
          <div key={f.key} className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground mr-1">{f.label}:</span>
            {f.options.map(o => (
              <button key={o} onClick={() => toggleFilter(f.key, o)}
                className={`bia-filter-pill text-xs px-2 py-0.5 rounded-full border ${activeFilters[f.key] === o ? "bg-primary text-primary-foreground border-primary" : "bg-background border-muted-foreground/20"}`}>{o}</button>
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {(["invoices", "aging", "collections"] as const).map(v => (
          <Button key={v} variant={view === v ? "default" : "outline"} size="sm" onClick={() => setView(v)} className="text-xs">{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
        ))}
      </div>

      {view === "invoices" && (
        <div className="bia-card-grid space-y-2">
          {filtered.map(r => (
            <div key={r.id} className={`bia-item-card p-3 rounded-lg border ${isCritical(r) ? "bia-critical" : isWarning(r) ? "bia-warning" : "bg-card"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.customer}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${typeColors[r.type] || "bg-gray-100 text-gray-600"}`}>{r.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${statusColors[r.status] || "text-gray-600"}`}>{r.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>Invoice: <span className="font-medium">{r.invoice}</span></div>
                <div>PO: <span className="font-medium">{r.po}</span></div>
                <div>Amount: <span className="font-medium">{formatINR(r.amount)}</span></div>
                <div>Tax: <span className="font-medium">{formatINR(r.tax)}</span></div>
                <div>Total: <span className="font-bold">{formatINR(r.total)}</span></div>
                <div>Due: <span className="font-medium">{r.due}</span></div>
                <div>Entity: <span className="font-medium">{r.entity}</span></div>
                <div>Method: <span className="font-medium">{r.method}</span></div>
              </div>
              {r.paid !== "\u2014" && <div className="text-xs text-emerald-600 mt-1">Paid: {r.paid}</div>}
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>{r.region}</span>
                <span>{r.notes || "\u2014"}</span>
              </div>
              {isCritical(r) && r.status === "Overdue" && <div className="bia-alert-text text-xs mt-2">Overdue {r.daysOut}d — {formatINR(r.total)} outstanding</div>}
              {isCritical(r) && r.status === "Disputed" && <div className="bia-alert-text text-xs mt-2">Dispute under review — {r.notes}</div>}
            </div>
          ))}
        </div>
      )}

      {view === "aging" && (
        <div className="space-y-2">
          {[...filtered].filter(r => r.status !== "Paid").sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime()).map(r => {
            const daysUntil = Math.max(0, Math.ceil((new Date(r.due).getTime() - Date.now()) / 86400000))
            return (
              <div key={r.id} className="bia-aging-card p-3 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{r.invoice}</span>
                    <span className="font-semibold text-sm">{r.customer}</span>
                  </div>
                  <span className="text-lg font-bold">{formatINR(r.total)}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mb-2">
                  <div className="bia-aging-bar h-2 rounded-full" style={{ width: `${Math.max(5, 100 - daysUntil * 5)}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div>Due: <span className={`font-medium ${daysUntil === 0 && r.status === "Overdue" ? "text-red-600" : daysUntil <= 3 ? "text-amber-600" : "text-gray-600"}`}>{r.due}</span></div>
                  <div>Status: <span className={`font-medium ${statusColors[r.status] || "text-gray-600"}`}>{r.status}</span></div>
                  <div>Type: <span className={`px-1.5 py-0.5 rounded-full ${typeColors[r.type]}`}>{r.type}</span></div>
                  <div>Method: <span className="font-medium">{r.method}</span></div>
                </div>
                <div className="text-xs text-muted-foreground mt-2">{r.entity}, {r.region} | {r.notes || "\u2014"}</div>
              </div>
            )
          })}
        </div>
      )}

      {view === "collections" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => b.total - a.total).map(r => (
            <div key={r.id} className="bia-coll-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.customer}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${typeColors[r.type] || "bg-gray-100 text-gray-600"}`}>{r.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">{formatINR(r.total)}</span>
                  {r.status === "Paid" && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>Invoice: <span className="font-medium">{r.invoice}</span></div>
                <div>Entity: <span className="font-medium">{r.entity}</span></div>
                <div>Due Date: <span className="font-medium">{r.due}</span></div>
                <div>Payment: <span className="font-medium">{r.method}</span></div>
                <div>PO: <span className="font-medium">{r.po}</span></div>
                <div>Status: <span className={`font-medium ${statusColors[r.status] || "text-gray-600"}`}>{r.status}</span></div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">{r.notes || "\u2014"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { BillingInvoiceAnalyticsPanel }
