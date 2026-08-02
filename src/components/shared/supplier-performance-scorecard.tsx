"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Star, AlertTriangle, TrendingUp, Shield
} from "lucide-react"

const raw = [
  { id: "SPS-01", supplier: "Tata Steel Ltd", category: "Raw Materials", region: "East", city: "Jamshedpur", rating: 4.8, onTime: 98.5, quality: 99.2, cost: 4.2, leadTime: 5, orders: 142, defects: 3, value: 12500000, status: "Strategic", cert: "ISO 9001", contract: "2027-03", payment: "Net 30", escalations: 0, capacity: 92 },
  { id: "SPS-02", supplier: "Reliance Packaging", category: "Packaging", region: "West", city: "Mumbai", rating: 4.5, onTime: 95.2, quality: 97.8, cost: 3.8, leadTime: 3, orders: 210, defects: 8, value: 4500000, status: "Preferred", cert: "FSC", contract: "2026-12", payment: "Net 45", escalations: 1, capacity: 88 },
  { id: "SPS-03", supplier: "Godrej Storage", category: "Equipment", region: "West", city: "Mumbai", rating: 4.6, onTime: 96.8, quality: 98.5, cost: 4.5, leadTime: 7, orders: 48, defects: 2, value: 8200000, status: "Strategic", cert: "ISO 14001", contract: "2027-06", payment: "Net 30", escalations: 0, capacity: 75 },
  { id: "SPS-04", supplier: "Nilkamal Ltd", category: "Material Handling", region: "West", city: "Nashik", rating: 3.8, onTime: 82.4, quality: 88.2, cost: 3.2, leadTime: 10, orders: 95, defects: 18, value: 3200000, status: "Under Review", cert: "ISO 9001", contract: "2026-09", payment: "Net 60", escalations: 4, capacity: 68 },
  { id: "SPS-05", supplier: "PharmEasy Supply", category: "Pharma", region: "North", city: "Gurugram", rating: 4.2, onTime: 91.5, quality: 96.0, cost: 4.0, leadTime: 4, orders: 178, defects: 7, value: 9800000, status: "Preferred", cert: "WHO-GMP", contract: "2027-01", payment: "Net 30", escalations: 2, capacity: 85 },
  { id: "SPS-06", supplier: "Adani Logistics", category: "3PL Services", region: "West", city: "Ahmedabad", rating: 4.7, onTime: 97.8, quality: 99.0, cost: 4.6, leadTime: 2, orders: 320, defects: 5, value: 18500000, status: "Strategic", cert: "ISO 28000", contract: "2027-12", payment: "Net 15", escalations: 0, capacity: 95 },
  { id: "SPS-07", supplier: "BlueStar HVAC", category: "Cold Chain", region: "North", city: "Noida", rating: 3.2, onTime: 72.1, quality: 80.5, cost: 2.8, leadTime: 14, orders: 22, defects: 12, value: 2100000, status: "Probationary", cert: "None", contract: "2026-08", payment: "Net 90", escalations: 7, capacity: 45 },
  { id: "SPS-08", supplier: "Mahindra Logistics", category: "Transport", region: "West", city: "Pune", rating: 4.4, onTime: 94.2, quality: 97.5, cost: 4.1, leadTime: 3, orders: 265, defects: 6, value: 15200000, status: "Preferred", cert: "ISO 9001", contract: "2027-04", payment: "Net 30", escalations: 1, capacity: 90 },
  { id: "SPS-09", supplier: "Snowman Logistics", category: "Cold Chain", region: "South", city: "Chennai", rating: 4.1, onTime: 89.8, quality: 94.2, cost: 3.9, leadTime: 6, orders: 88, defects: 10, value: 6800000, status: "Under Review", cert: "HACCP", contract: "2026-10", payment: "Net 45", escalations: 3, capacity: 72 },
  { id: "SPS-10", supplier: "Delhivery Express", category: "Last Mile", region: "North", city: "Delhi", rating: 4.3, onTime: 93.5, quality: 95.8, cost: 3.5, leadTime: 1, orders: 480, defects: 15, value: 7200000, status: "Preferred", cert: "ISO 27001", contract: "2027-09", payment: "Net 30", escalations: 2, capacity: 98 },
]

interface SPSItem {
  id: string; supplier: string; category: string; region: string; city: string
  rating: number; onTime: number; quality: number; cost: number; leadTime: number
  orders: number; defects: number; value: number; status: string; cert: string
  contract: string; payment: string; escalations: number; capacity: number
}

type Rec = any
const items: SPSItem[] = raw.map((r: Rec) => ({
  id: r.id, supplier: r.supplier, category: r.category, region: r.region, city: r.city,
  rating: r.rating, onTime: r.onTime, quality: r.quality, cost: r.cost, leadTime: r.leadTime,
  orders: r.orders, defects: r.defects, value: r.value, status: r.status, cert: r.cert,
  contract: r.contract, payment: r.payment, escalations: r.escalations, capacity: r.capacity,
}))

const statusColors: Record<string, string> = {
  "Strategic": "bg-emerald-100 text-emerald-700", "Preferred": "bg-blue-100 text-blue-700",
  "Under Review": "bg-amber-100 text-amber-700", "Probationary": "bg-red-100 text-red-700",
}

const catColors: Record<string, string> = {
  "Raw Materials": "bg-orange-100 text-orange-700", "Packaging": "bg-lime-100 text-lime-700",
  "Equipment": "bg-violet-100 text-violet-700", "Material Handling": "bg-sky-100 text-sky-700",
  "Pharma": "bg-rose-100 text-rose-700", "3PL Services": "bg-indigo-100 text-indigo-700",
  "Cold Chain": "bg-cyan-100 text-cyan-700", "Transport": "bg-amber-100 text-amber-700",
  "Last Mile": "bg-teal-100 text-teal-700",
}

const otpPct = (v: number) => v >= 95 ? "text-emerald-600" : v >= 85 ? "text-amber-600" : "text-red-600"
const qualPct = (v: number) => v >= 95 ? "text-emerald-600" : v >= 85 ? "text-amber-600" : "text-red-600"
const capPct = (v: number) => v >= 85 ? "text-emerald-600" : v >= 60 ? "text-amber-600" : "text-red-600"
const escColor = (v: number) => v === 0 ? "text-emerald-600" : v <= 2 ? "text-amber-600" : "text-red-600"
const formatINR = (v: number) => v >= 10000000 ? `\u20b9${(v / 10000000).toFixed(1)}Cr` : v >= 100000 ? `\u20b9${(v / 100000).toFixed(1)}L` : `\u20b9${(v / 1000).toFixed(0)}K`

const SupplierPerformanceScorecard: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [view, setView] = useState<"suppliers" | "quality" | "financials">("suppliers")
  const filters = [
    { key: "category", label: "Category", options: ["Raw Materials", "Packaging", "Equipment", "Material Handling", "Pharma", "3PL Services", "Cold Chain", "Transport", "Last Mile"] },
    { key: "status", label: "Status", options: ["Strategic", "Preferred", "Under Review", "Probationary"] },
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

  const totalSuppliers = filtered.length
  const avgRating = totalSuppliers ? Math.round(filtered.reduce((s, r) => s + r.rating, 0) / totalSuppliers * 10) / 10 : 0
  const avgOtp = totalSuppliers ? Math.round(filtered.reduce((s, r) => s + r.onTime, 0) / totalSuppliers * 10) / 10 : 0
  const totalEsc = filtered.reduce((s, r) => s + r.escalations, 0)

  const insights = [
    { label: "Total Suppliers", value: totalSuppliers, icon: Shield, bg: "bg-blue-50" },
    { label: "Avg Rating", value: `${avgRating}/5`, icon: Star, bg: "bg-amber-50" },
    { label: "Avg OTP", value: `${avgOtp}%`, icon: TrendingUp, bg: "bg-emerald-50" },
    { label: "Escalations", value: totalEsc, icon: AlertTriangle, bg: "bg-red-50" },
  ]

  const isCritical = (r: SPSItem) => r.status === "Probationary" || r.escalations >= 5
  const isWarning = (r: SPSItem) => r.status === "Under Review" || r.onTime < 85 || r.escalations >= 3

  const starDisplay = (rating: number) => (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} className={`w-3 h-3 ${s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-300"}`} />
      ))}
      <span className="text-xs text-muted-foreground ml-1">{rating}</span>
    </span>
  )

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
                className={`sps-filter-pill text-xs px-2 py-0.5 rounded-full border ${activeFilters[f.key] === o ? "bg-primary text-primary-foreground border-primary" : "bg-background border-muted-foreground/20"}`}>{o}</button>
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {(["suppliers", "quality", "financials"] as const).map(v => (
          <Button key={v} variant={view === v ? "default" : "outline"} size="sm" onClick={() => setView(v)} className="text-xs">{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
        ))}
      </div>

      {view === "suppliers" && (
        <div className="sps-card-grid space-y-2">
          {filtered.map(r => (
            <div key={r.id} className={`sps-item-card p-3 rounded-lg border ${isCritical(r) ? "sps-critical" : isWarning(r) ? "sps-warning" : "bg-card"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.supplier}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${catColors[r.category] || "bg-gray-100 text-gray-600"}`}>{r.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusColors[r.status]}`}>{r.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>{starDisplay(r.rating)}</div>
                <div>OTP: <span className={`font-medium ${otpPct(r.onTime)}`}>{r.onTime}%</span></div>
                <div>Quality: <span className={`font-medium ${qualPct(r.quality)}`}>{r.quality}%</span></div>
                <div>Lead Time: <span className="font-medium">{r.leadTime}d</span></div>
                <div>Orders: <span className="font-medium">{r.orders}</span></div>
                <div>Defects: <span className={`font-medium ${r.defects >= 10 ? "text-red-600" : "text-gray-600"}`}>{r.defects}</span></div>
                <div>Capacity: <span className={`font-medium ${capPct(r.capacity)}`}>{r.capacity}%</span></div>
                <div>Escalations: <span className={`font-medium ${escColor(r.escalations)}`}>{r.escalations}</span></div>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>{r.city}, {r.region}</span>
                  {r.cert !== "None" && <span className="sps-cert-badge">{r.cert}</span>}
                </div>
                <span>Contract: {r.contract} | {r.payment}</span>
              </div>
              {isCritical(r) && <div className="sps-alert-text text-xs mt-2">High-risk supplier — {r.escalations} open escalations, OTP {r.onTime}%</div>}
            </div>
          ))}
        </div>
      )}

      {view === "quality" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => a.quality - b.quality).map(r => (
            <div key={r.id} className="sps-quality-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.supplier}</span>
                </div>
                <span className={`text-lg font-bold ${qualPct(r.quality)}`}>{r.quality}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2"><div className="sps-quality-bar h-2 rounded-full" style={{ width: `${r.quality}%` }} /></div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>OTP: <span className={`font-medium ${otpPct(r.onTime)}`}>{r.onTime}%</span></div>
                <div>Defects: <span className={`font-medium ${r.defects >= 10 ? "text-red-600" : "text-gray-600"}`}>{r.defects}</span></div>
                <div>Escalations: <span className={`font-medium ${escColor(r.escalations)}`}>{r.escalations}</span></div>
                <div>Orders: <span className="font-medium">{r.orders}</span></div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className={`px-1.5 py-0.5 rounded-full ${catColors[r.category] || "bg-gray-100 text-gray-600"}`}>{r.category}</span>
                <span className={`px-1.5 py-0.5 rounded-full ${statusColors[r.status]}`}>{r.status}</span>
                {r.cert !== "None" && <span className="sps-cert-badge">{r.cert}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "financials" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => b.value - a.value).map(r => (
            <div key={r.id} className="sps-fin-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.supplier}</span>
                </div>
                <span className="text-lg font-bold">{formatINR(r.value)}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2"><div className="sps-value-bar h-2 rounded-full" style={{ width: `${Math.min(r.capacity, 100)}%` }} /></div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>Cost Score: <span className="font-medium">{r.cost}/5</span></div>
                <div>Capacity: <span className={`font-medium ${capPct(r.capacity)}`}>{r.capacity}%</span></div>
                <div>Payment: <span className="font-medium">{r.payment}</span></div>
                <div>Contract: <span className="font-medium">{r.contract}</span></div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className={`px-1.5 py-0.5 rounded-full ${statusColors[r.status]}`}>{r.status}</span>
                <span className="text-muted-foreground">Lead: {r.leadTime}d</span>
                <span className="text-muted-foreground">Rating: {r.rating}/5</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { SupplierPerformanceScorecard }
