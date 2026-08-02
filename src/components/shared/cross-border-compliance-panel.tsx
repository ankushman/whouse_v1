"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Shield, AlertTriangle, FileText, Globe2
} from "lucide-react"

const raw = [
  { id: "CBC-01", shipment: "SHP-IN-2026-4281", dest: "Dubai, UAE", market: "Middle East", hub: "MUM-HUB1", carrier: "Emirates SkyCargo", docType: "Export", hsCode: "84719000", commodity: "IT Equipment", value: 2850000, currency: "AED", customsStatus: "Cleared", duty: 142500, gstRefund: 185000, compliance: 100, iec: "IEC-MUM-28451", certExpiry: "2027-03-15", riskScore: 12, issues: 0, transitDays: 5, mode: "Air", region: "West" },
  { id: "CBC-02", shipment: "SHP-IN-2026-4295", dest: "London, UK", market: "Europe", hub: "DEL-HUB2", carrier: "British Airways Cargo", docType: "Export", hsCode: "30049099", commodity: "Pharmaceuticals", value: 12400000, currency: "GBP", customsStatus: "Held", duty: 620000, gstRefund: 980000, compliance: 72, iec: "IEC-DEL-15238", certExpiry: "2026-08-10", riskScore: 68, issues: 3, transitDays: 8, mode: "Air", region: "North" },
  { id: "CBC-03", shipment: "SHP-IN-2026-4301", dest: "Dhaka, Bangladesh", market: "SAARC", hub: "CCU-HUB7", carrier: "Biman Bangladesh", docType: "Export", hsCode: "10063020", commodity: "Basmati Rice", value: 4500000, currency: "BDT", customsStatus: "Cleared", duty: 112500, gstRefund: 350000, compliance: 95, iec: "IEC-CCU-09812", certExpiry: "2027-06-20", riskScore: 22, issues: 1, transitDays: 3, mode: "Sea", region: "East" },
  { id: "CBC-04", shipment: "SHP-IN-2026-4318", dest: "Singapore", market: "ASEAN", hub: "BLR-HUB3", carrier: "Singapore Airlines", docType: "Export", hsCode: "85176200", commodity: "Electronics", value: 8200000, currency: "SGD", customsStatus: "Pending", duty: 0, gstRefund: 2450000, compliance: 85, iec: "IEC-BLR-58421", certExpiry: "2026-09-05", riskScore: 35, issues: 1, transitDays: 6, mode: "Air", region: "South" },
  { id: "CBC-05", shipment: "SHP-IN-2026-4325", dest: "Kathmandu, Nepal", market: "SAARC", hub: "DEL-HUB2", carrier: "Rivigo Cross Border", docType: "Re-Export", hsCode: "34022000", commodity: "FMCG Products", value: 1800000, currency: "NPR", customsStatus: "Rejected", duty: 90000, gstRefund: 120000, compliance: 42, iec: "IEC-DEL-78432", certExpiry: "2026-07-28", riskScore: 82, issues: 4, transitDays: 4, mode: "Road", region: "North" },
  { id: "CBC-06", shipment: "SHP-IN-2026-4332", dest: "Colombo, Sri Lanka", market: "SAARC", hub: "MAA-HUB4", carrier: "Maersk Line", docType: "Export", hsCode: "61102090", commodity: "Apparel", value: 5200000, currency: "LKR", customsStatus: "Cleared", duty: 260000, gstRefund: 780000, compliance: 98, iec: "IEC-MAA-32145", certExpiry: "2027-11-30", riskScore: 8, issues: 0, transitDays: 4, mode: "Sea", region: "South" },
  { id: "CBC-07", shipment: "SHP-IN-2026-4341", dest: "Frankfurt, Germany", market: "Europe", hub: "PNQ-HUB6", carrier: "Lufthansa Cargo", docType: "Export", hsCode: "84818099", commodity: "Auto Parts", value: 15600000, currency: "EUR", customsStatus: "Held", duty: 780000, gstRefund: 1200000, compliance: 65, iec: "IEC-PNQ-21458", certExpiry: "2026-08-15", riskScore: 58, issues: 2, transitDays: 9, mode: "Air", region: "West" },
  { id: "CBC-08", shipment: "SHP-IN-2026-4350", dest: "Male, Maldives", market: "SAARC", hub: "HYD-HUB5", carrier: "Cargo King", docType: "Export", hsCode: "21011190", commodity: "Food Products", value: 980000, currency: "MVR", customsStatus: "Cleared", duty: 49000, gstRefund: 145000, compliance: 100, iec: "IEC-HYD-87214", certExpiry: "2027-08-12", riskScore: 5, issues: 0, transitDays: 2, mode: "Sea", region: "South" },
  { id: "CBC-09", shipment: "SHP-IN-2026-4358", dest: "Abu Dhabi, UAE", market: "Middle East", hub: "MUM-HUB1", carrier: "Etihad Cargo", docType: "Export", hsCode: "27101992", commodity: "Petrochemicals", value: 32000000, currency: "AED", customsStatus: "Under Review", duty: 1600000, gstRefund: 4800000, compliance: 78, iec: "IEC-MUM-45123", certExpiry: "2026-08-30", riskScore: 42, issues: 1, transitDays: 5, mode: "Sea", region: "West" },
  { id: "CBC-10", shipment: "SHP-IN-2026-4365", dest: "Toronto, Canada", market: "Americas", hub: "DEL-HUB2", carrier: "Air Canada Cargo", docType: "Export", hsCode: "63079090", commodity: "Textile Products", value: 6800000, currency: "CAD", customsStatus: "Cleared", duty: 340000, gstRefund: 1020000, compliance: 92, iec: "IEC-DEL-63891", certExpiry: "2027-04-18", riskScore: 15, issues: 0, transitDays: 12, mode: "Air", region: "North" },
]

interface CBCItem {
  id: string; shipment: string; dest: string; market: string; hub: string
  carrier: string; docType: string; hsCode: string; commodity: string
  value: number; currency: string; customsStatus: string; duty: number
  gstRefund: number; compliance: number; iec: string; certExpiry: string
  riskScore: number; issues: number; transitDays: number; mode: string; region: string
}

type Rec = any
const items: CBCItem[] = raw.map((r: Rec) => ({
  id: r.id, shipment: r.shipment, dest: r.dest, market: r.market, hub: r.hub,
  carrier: r.carrier, docType: r.docType, hsCode: r.hsCode, commodity: r.commodity,
  value: r.value, currency: r.currency, customsStatus: r.customsStatus, duty: r.duty,
  gstRefund: r.gstRefund, compliance: r.compliance, iec: r.iec, certExpiry: r.certExpiry,
  riskScore: r.riskScore, issues: r.issues, transitDays: r.transitDays, mode: r.mode, region: r.region,
}))

const marketColors: Record<string, string> = {
  "Middle East": "bg-amber-100 text-amber-700", "Europe": "bg-blue-100 text-blue-700",
  "SAARC": "bg-emerald-100 text-emerald-700", "ASEAN": "bg-violet-100 text-violet-700",
  "Americas": "bg-orange-100 text-orange-700",
}

const statusColors: Record<string, string> = {
  "Cleared": "text-emerald-600 font-semibold", "Pending": "text-amber-600 font-semibold",
  "Under Review": "text-amber-600 font-semibold", "Held": "text-red-600 font-semibold",
  "Rejected": "text-red-600 font-semibold",
}

const riskColor = (v: number) => v >= 60 ? "text-red-600" : v >= 30 ? "text-amber-600" : "text-emerald-600"
const compColor = (v: number) => v >= 90 ? "text-emerald-600" : v >= 70 ? "text-amber-600" : "text-red-600"

const fmtVal = (v: number) => {
  if (v >= 10000000) return `\u20b9${(v / 10000000).toFixed(1)}Cr`
  if (v >= 100000) return `\u20b9${(v / 100000).toFixed(1)}L`
  return `\u20b9${(v / 1000).toFixed(0)}K`
}

const CrossBorderCompliancePanel: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [view, setView] = useState<"shipments" | "risk" | "documents">("shipments")
  const filters = [
    { key: "market", label: "Market", options: ["Middle East", "Europe", "SAARC", "ASEAN", "Americas"] },
    { key: "customsStatus", label: "Status", options: ["Cleared", "Pending", "Under Review", "Held", "Rejected"] },
    { key: "mode", label: "Mode", options: ["Air", "Sea", "Road"] },
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

  const totalShipments = filtered.length
  const avgComp = totalShipments ? Math.round(filtered.reduce((s, r) => s + r.compliance, 0) / totalShipments) : 0
  const heldCount = filtered.filter(r => r.customsStatus === "Held" || r.customsStatus === "Rejected").length
  const totalValue = filtered.reduce((s, r) => s + r.value, 0)

  const insights = [
    { label: "Shipments", value: totalShipments, icon: Globe2, bg: "bg-blue-50" },
    { label: "Compliance", value: `${avgComp}%`, icon: Shield, bg: "bg-emerald-50" },
    { label: "Held/Rejected", value: heldCount, icon: AlertTriangle, bg: "bg-amber-50" },
    { label: "Total Value", value: fmtVal(totalValue), icon: FileText, bg: "bg-violet-50" },
  ]

  const isCritical = (r: CBCItem) => r.customsStatus === "Rejected" || r.customsStatus === "Held" || r.compliance < 70
  const isWarning = (r: CBCItem) => r.customsStatus === "Under Review" || r.customsStatus === "Pending" || r.riskScore >= 40

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
                className={`cbc-filter-pill text-xs px-2 py-0.5 rounded-full border ${activeFilters[f.key] === o ? "bg-primary text-primary-foreground border-primary" : "bg-background border-muted-foreground/20"}`}>{o}</button>
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {(["shipments", "risk", "documents"] as const).map(v => (
          <Button key={v} variant={view === v ? "default" : "outline"} size="sm" onClick={() => setView(v)} className="text-xs">{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
        ))}
      </div>

      {view === "shipments" && (
        <div className="cbc-card-grid space-y-2">
          {filtered.map(r => (
            <div key={r.id} className={`cbc-item-card p-3 rounded-lg border ${isCritical(r) ? "cbc-critical" : isWarning(r) ? "cbc-warning" : "bg-card"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.dest}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${marketColors[r.market]}`}>{r.market}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${statusColors[r.customsStatus]}`}>{r.customsStatus}</span>
                  <span className="text-xs text-muted-foreground">{r.mode}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>Commodity: <span className="font-medium">{r.commodity}</span> ({r.hsCode})</div>
                <div>Value: <span className="font-medium">{fmtVal(r.value)}</span> | {r.currency}</div>
                <div>Carrier: <span className="font-medium">{r.carrier}</span></div>
                <div>Compliance: <span className={`font-medium ${compColor(r.compliance)}`}>{r.compliance}%</span> | Risk: <span className={`font-medium ${riskColor(r.riskScore)}`}>{r.riskScore}</span></div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                <div>Duty: <span className="font-medium">{fmtVal(r.duty)}</span></div>
                <div>GST Refund: <span className="font-medium">{fmtVal(r.gstRefund)}</span></div>
                <div>Issues: <span className="font-medium">{r.issues}</span></div>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>{r.hub} | {r.iec} | {r.docType}</span>
                <span>Transit: {r.transitDays}d | Cert: {r.certExpiry}</span>
              </div>
              {isCritical(r) && <div className="cbc-alert-text text-xs mt-2">Shipment critical — {r.customsStatus}, compliance {r.compliance}%, {r.issues} issues, risk {r.riskScore}</div>}
            </div>
          ))}
        </div>
      )}

      {view === "risk" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => b.riskScore - a.riskScore).map(r => (
            <div key={r.id} className="cbc-risk-card p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="font-semibold text-sm">{r.dest}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${marketColors[r.market]}`}>{r.market}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${riskColor(r.riskScore)}`}>{r.riskScore}</span>
                  <span className="text-xs text-muted-foreground">risk score</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2"><div className={`cbc-risk-bar h-2 rounded-full ${r.riskScore >= 50 ? "cbc-risk-high" : r.riskScore >= 30 ? "cbc-risk-med" : ""}`} style={{ width: `${Math.min(r.riskScore / 100 * 100, 100)}%` }} /></div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>Compliance: <span className={`font-medium ${compColor(r.compliance)}`}>{r.compliance}%</span></div>
                <div>Issues: <span className="font-medium">{r.issues}</span></div>
                <div>Value: <span className="font-medium">{fmtVal(r.value)}</span></div>
                <div>Status: <span className={`font-medium ${statusColors[r.customsStatus]}`}>{r.customsStatus}</span></div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className="text-muted-foreground">{r.hub} | {r.carrier} | {r.commodity} | IEC: {r.iec}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "documents" && (
        <div className="space-y-2">
          {[...filtered].sort((a, b) => new Date(a.certExpiry).getTime() - new Date(b.certExpiry).getTime()).map(r => {
            const daysLeft = Math.ceil((new Date(r.certExpiry).getTime() - Date.now()) / 86400000)
            return (
              <div key={r.id} className="cbc-doc-card p-3 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                    <span className="font-semibold text-sm">{r.shipment}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${marketColors[r.market]}`}>{r.market}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-lg font-bold ${daysLeft <= 30 ? "text-red-600" : daysLeft <= 90 ? "text-amber-600" : "text-emerald-600"}`}>{daysLeft}d</span>
                    <span className="text-xs text-muted-foreground">cert left</span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mb-2"><div className={`cbc-doc-bar h-2 rounded-full ${daysLeft <= 30 ? "cbc-doc-expiring" : ""}`} style={{ width: `${Math.min(Math.max(daysLeft / 365 * 100, 5), 100)}%` }} /></div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div>IEC: <span className="font-medium">{r.iec}</span></div>
                  <div>HS Code: <span className="font-medium">{r.hsCode}</span></div>
                  <div>Type: <span className="font-medium">{r.docType}</span></div>
                  <div>Mode: <span className="font-medium">{r.mode}</span></div>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className={`text-xs ${statusColors[r.customsStatus]}`}>{r.customsStatus}</span>
                  <span className="text-muted-foreground">{r.hub} | {r.carrier} | {r.commodity} | Cert: {r.certExpiry}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export { CrossBorderCompliancePanel }
