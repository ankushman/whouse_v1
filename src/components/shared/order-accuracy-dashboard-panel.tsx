"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  CheckCircle, AlertTriangle, ClipboardList, TrendingUp
} from "lucide-react"

const raw = [
  { id: "OAC-01", order: "ORD-2026-88421", customer: "Reliance Fresh", hub: "MUM-HUB1", type: "Standard", channel: "B2B", lines: 12, picked: 12, shipped: 12, accuracy: 100.0, wrongItem: 0, wrongQty: 0, damaged: 0, missing: 0, picker: "Rajesh Kumar", packer: "Amit Shah", slaHrs: 24, actualHrs: 18, value: 48500, status: "Perfect", region: "West" },
  { id: "OAC-02", order: "ORD-2026-88435", customer: "PharmEasy", hub: "DEL-HUB2", type: "Express", channel: "D2C", lines: 8, picked: 8, shipped: 7, accuracy: 87.5, wrongItem: 1, wrongQty: 0, damaged: 0, missing: 0, picker: "Suresh Yadav", packer: "Ravi Kumar", slaHrs: 12, actualHrs: 14, value: 32200, status: "Error Detected", region: "North" },
  { id: "OAC-03", order: "ORD-2026-88448", customer: "Bosch Ltd", hub: "BLR-HUB3", type: "Bulk", channel: "B2B", lines: 45, picked: 45, shipped: 45, accuracy: 100.0, wrongItem: 0, wrongQty: 0, damaged: 0, missing: 0, picker: "Priya Patel", packer: "Kiran Reddy", slaHrs: 48, actualHrs: 38, value: 285000, status: "Perfect", region: "South" },
  { id: "OAC-04", order: "ORD-2026-88452", customer: "JioMart", hub: "MUM-HUB1", type: "Standard", channel: "D2C", lines: 18, picked: 18, shipped: 16, accuracy: 88.9, wrongItem: 0, wrongQty: 2, damaged: 0, missing: 0, picker: "Vikram Singh", packer: "Nitin Patil", slaHrs: 24, actualHrs: 22, value: 15600, status: "Qty Mismatch", region: "West" },
  { id: "OAC-05", order: "ORD-2026-88461", customer: "Adani Wilmar", hub: "AMD-HUB9", type: "Bulk", channel: "B2B", lines: 32, picked: 32, shipped: 31, accuracy: 96.9, wrongItem: 0, wrongQty: 0, damaged: 1, missing: 0, picker: "Deepak Joshi", packer: "Hemant Desai", slaHrs: 36, actualHrs: 35, value: 142800, status: "Damage Reported", region: "West" },
  { id: "OAC-06", order: "ORD-2026-88472", customer: "Metro Dairy", hub: "CCU-HUB7", type: "Cold Chain", channel: "B2B", lines: 6, picked: 6, shipped: 6, accuracy: 100.0, wrongItem: 0, wrongQty: 0, damaged: 0, missing: 0, picker: "Meena Kumari", packer: "Ranjan Das", slaHrs: 8, actualHrs: 7, value: 89400, status: "Perfect", region: "East" },
  { id: "OAC-07", order: "ORD-2026-88485", customer: "Dabur India", hub: "DEL-HUB2", type: "Standard", channel: "B2B", lines: 22, picked: 22, shipped: 20, accuracy: 90.9, wrongItem: 1, wrongQty: 0, damaged: 0, missing: 1, picker: "Rahul Verma", packer: "Sunil Gupta", slaHrs: 24, actualHrs: 28, value: 67500, status: "Error Detected", region: "North" },
  { id: "OAC-08", order: "ORD-2026-88493", customer: "Serum Institute", hub: "PNQ-HUB6", type: "Cold Chain", channel: "B2B", lines: 4, picked: 4, shipped: 4, accuracy: 100.0, wrongItem: 0, wrongQty: 0, damaged: 0, missing: 0, picker: "Anita Devi", packer: "Prashant Joshi", slaHrs: 6, actualHrs: 5, value: 450000, status: "Perfect", region: "West" },
  { id: "OAC-09", order: "ORD-2026-88501", customer: "BigBasket", hub: "HYD-HUB5", type: "Express", channel: "D2C", lines: 15, picked: 15, shipped: 13, accuracy: 86.7, wrongItem: 0, wrongQty: 1, damaged: 1, missing: 0, picker: "Karan Mehta", packer: "Rajesh Reddy", slaHrs: 12, actualHrs: 15, value: 12800, status: "Multiple Issues", region: "South" },
  { id: "OAC-10", order: "ORD-2026-88512", customer: "Royal Dutch", hub: "MAA-HUB4", type: "Standard", channel: "B2B", lines: 28, picked: 28, shipped: 28, accuracy: 100.0, wrongItem: 0, wrongQty: 0, damaged: 0, missing: 0, picker: "Priya Patel", packer: "Mohan Raj", slaHrs: 48, actualHrs: 42, value: 198000, status: "Perfect", region: "South" },
]

interface OACItem {
  id: string; order: string; customer: string; hub: string; type: string
  channel: string; lines: number; picked: number; shipped: number; accuracy: number
  wrongItem: number; wrongQty: number; damaged: number; missing: number
  picker: string; packer: string; slaHrs: number; actualHrs: number
  value: number; status: string; region: string
}

type Rec = any
const items: OACItem[] = raw.map((r: Rec) => ({
  id: r.id, order: r.order, customer: r.customer, hub: r.hub, type: r.type,
  channel: r.channel, lines: r.lines, picked: r.picked, shipped: r.shipped, accuracy: r.accuracy,
  wrongItem: r.wrongItem, wrongQty: r.wrongQty, damaged: r.damaged, missing: r.missing,
  picker: r.picker, packer: r.packer, slaHrs: r.slaHrs, actualHrs: r.actualHrs,
  value: r.value, status: r.status, region: r.region,
}))

const typeColors: Record<string, string> = {
  "Standard": "bg-blue-100 text-blue-700", "Express": "bg-violet-100 text-violet-700",
  "Bulk": "bg-amber-100 text-amber-700", "Cold Chain": "bg-cyan-100 text-cyan-700",
}

const chanColors: Record<string, string> = {
  "B2B": "bg-emerald-100 text-emerald-700", "D2C": "bg-orange-100 text-orange-700",
}

const statusColors: Record<string, string> = {
  "Perfect": "text-emerald-600 font-semibold", "Qty Mismatch": "text-amber-600 font-semibold",
  "Damage Reported": "text-amber-600 font-semibold", "Error Detected": "text-red-600 font-semibold",
  "Multiple Issues": "text-red-600 font-semibold",
}

const accColor = (v: number) => v >= 99 ? "text-emerald-600" : v >= 95 ? "text-blue-600" : v >= 90 ? "text-amber-600" : "text-red-600"
const slaColor = (a: number, s: number) => a <= s ? "text-emerald-600" : a <= s * 1.15 ? "text-amber-600" : "text-red-600"

const fmtVal = (v: number) => {
  if (v >= 10000000) return `\u20b9${(v / 10000000).toFixed(1)}Cr`
  if (v >= 100000) return `\u20b9${(v / 100000).toFixed(1)}L`
  if (v >= 1000) return `\u20b9${(v / 1000).toFixed(1)}K`
  return `\u20b9${v}`
}

const OrderAccuracyDashboardPanel: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [view, setView] = useState<"orders" | "errors" | "sla">("orders")
  const filters = [
    { key: "type", label: "Type", options: ["Standard", "Express", "Bulk", "Cold Chain"] },
    { key: "status", label: "Status", options: ["Perfect", "Qty Mismatch", "Damage Reported", "Error Detected", "Multiple Issues"] },
    { key: "channel", label: "Channel", options: ["B2B", "D2C"] },
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

  const totalOrders = filtered.length
  const perfectRate = totalOrders ? Math.round(filtered.filter(r => r.accuracy === 100).length / totalOrders * 1000) / 10 : 0
  const totalErrors = filtered.reduce((s, r) => s + r.wrongItem + r.wrongQty + r.damaged + r.missing, 0)
  const avgAcc = totalOrders ? Math.round(filtered.reduce((s, r) => s + r.accuracy, 0) / totalOrders * 10) / 10 : 0

  const insights = [
    { label: "Total Orders", value: totalOrders, icon: ClipboardList, bg: "bg-blue-50" },
    { label: "Perfect Rate", value: `${perfectRate}%`, icon: CheckCircle, bg: "bg-emerald-50" },
    { label: "Avg Accuracy", value: `${avgAcc}%`, icon: TrendingUp, bg: "bg-violet-50" },
    { label: "Total Errors", value: totalErrors, icon: AlertTriangle, bg: "bg-amber-50" },
  ]

  const isCritical = (r: OACItem) => r.status === "Multiple Issues" || r.accuracy < 90 || r.actualHrs > r.slaHrs * 1.15
  const isWarning = (r: OACItem) => r.status === "Error Detected" || r.status === "Qty Mismatch" || r.status === "Damage Reported"

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
                className={`oac-filter-pill text-xs px-2 py-0.5 rounded-full border ${activeFilters[f.key] === o ? "bg-primary text-primary-foreground border-primary" : "bg-background border-muted-foreground/20"}`}>{o}</button>
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {(["orders", "errors", "sla"] as const).map(v => (
          <Button key={v} variant={view === v ? "default" : "outline"} size="sm" onClick={() => setView(v)} className="text-xs">{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
        ))}
      </div>

      {view === "orders" && (
        <div className="oac-card-grid space-y-2">
          {filtered.map(r => (
            <div key={r.id} className={`oac-item-card p-3 rounded-lg border ${isCritical(r) ? "oac-critical" : isWarning(r) ? "oac-warning" : "bg-card"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.customer}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${typeColors[r.type]}`}>{r.type}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${chanColors[r.channel]}`}>{r.channel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${statusColors[r.status]}`}>{r.status}</span>
                  <span className="text-xs text-muted-foreground">{r.order}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>Lines: <span className="font-medium">{r.lines}</span> | Picked: <span className="font-medium">{r.picked}</span> | Shipped: <span className="font-medium">{r.shipped}</span></div>
                <div>Accuracy: <span className={`font-medium ${accColor(r.accuracy)}`}>{r.accuracy}%</span> | Value: <span className="font-medium">{fmtVal(r.value)}</span></div>
                <div>Wrong Item: <span className="font-medium">{r.wrongItem}</span> | Wrong Qty: <span className="font-medium">{r.wrongQty}</span> | Damaged: <span className="font-medium">{r.damaged}</span></div>
                <div>Picker: <span className="font-medium">{r.picker}</span> | Packer: <span className="font-medium">{r.packer}</span></div>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>{r.hub} | {r.region}</span>
                <span>SLA: <span className={`font-medium ${slaColor(r.actualHrs, r.slaHrs)}`}>{r.actualHrs}h</span> / {r.slaHrs}h</span>
              </div>
              {isCritical(r) && <div className="oac-alert-text text-xs mt-2">Order critical — accuracy {r.accuracy}%, {r.wrongItem + r.wrongQty + r.damaged + r.missing} errors, SLA {r.actualHrs}h / {r.slaHrs}h</div>}
            </div>
          ))}
        </div>
      )}

      {view === "errors" && (
        <div className="space-y-2">
          {[...filtered].filter(r => r.wrongItem + r.wrongQty + r.damaged + r.missing > 0).sort((a, b) => (b.wrongItem + b.wrongQty + b.damaged + b.missing) - (a.wrongItem + a.wrongQty + a.damaged + a.missing)).map(r => (
            <div key={r.id} className="oac-err-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.customer}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${typeColors[r.type]}`}>{r.type}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-red-600">{r.wrongItem + r.wrongQty + r.damaged + r.missing}</span>
                  <span className="text-xs text-muted-foreground">errors</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2"><div className="oac-err-bar h-2 rounded-full" style={{ width: `${Math.min((r.wrongItem + r.wrongQty + r.damaged + r.missing) / 4 * 100, 100)}%` }} /></div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>Wrong Item: <span className="font-medium">{r.wrongItem}</span></div>
                <div>Wrong Qty: <span className="font-medium">{r.wrongQty}</span></div>
                <div>Damaged: <span className="font-medium">{r.damaged}</span></div>
                <div>Missing: <span className="font-medium">{r.missing}</span></div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className="font-medium">Accuracy: <span className={accColor(r.accuracy)}>{r.accuracy}%</span></span>
                <span className="text-muted-foreground">{r.hub} | {r.picker} picked | {r.order}</span>
              </div>
            </div>
          ))}
          {filtered.filter(r => r.wrongItem + r.wrongQty + r.damaged + r.missing === 0).length === 0 && (
            <div className="oac-empty-state text-center p-6 text-muted-foreground text-sm">No errors in filtered orders</div>
          )}
        </div>
      )}

      {view === "sla" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => (b.actualHrs - b.slaHrs) - (a.actualHrs - a.slaHrs)).map(r => {
            const breach = r.actualHrs - r.slaHrs
            return (
              <div key={r.id} className="oac-sla-card p-3 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                    <span className="font-semibold text-sm">{r.customer}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${typeColors[r.type]}`}>{r.type}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-lg font-bold ${slaColor(r.actualHrs, r.slaHrs)}`}>{r.actualHrs}h</span>
                    <span className="text-xs text-muted-foreground">/ {r.slaHrs}h</span>
                    {breach > 0 && <span className="text-xs text-red-600 font-medium">+{breach}h</span>}
                    {breach <= 0 && <span className="text-xs text-emerald-600 font-medium">{breach}h</span>}
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mb-2"><div className={`oac-sla-bar h-2 rounded-full ${breach > 0 ? "oac-sla-breach" : ""}`} style={{ width: `${Math.min(r.actualHrs / r.slaHrs * 100, 120) / 1.2}%` }} /></div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div>Accuracy: <span className={`font-medium ${accColor(r.accuracy)}`}>{r.accuracy}%</span></div>
                  <div>Lines: <span className="font-medium">{r.lines}</span></div>
                  <div>Value: <span className="font-medium">{fmtVal(r.value)}</span></div>
                  <div>Errors: <span className="font-medium">{r.wrongItem + r.wrongQty + r.damaged + r.missing}</span></div>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className={`text-xs ${statusColors[r.status]}`}>{r.status}</span>
                  <span className="text-muted-foreground">{r.hub} | {r.packer} packed | {r.region}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export { OrderAccuracyDashboardPanel }
