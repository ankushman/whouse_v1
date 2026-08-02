"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Snowflake, ThermometerSnowflake, AlertTriangle,
  CheckCircle, XCircle, Target, Zap, MapPin, Package, Shield, FileText
} from "lucide-react"

const raw = [
  { id: "CCA-01", room: "Cold Room A1", warehouse: "Mumbai DC1", product: "Vaccines (Covaxin)", category: "Pharma", setTemp: -20, currentTemp: -18, minTemp: -22, maxTemp: -15, humidity: 45, compliance: "FSSAI", excursions: 0, spoilageRisk: 2, shelfLife: 180, energy: 4200, occupancy: 78, status: "Optimal", city: "Mumbai", lastAudit: "2026-07-28", cost: 285000 },
  { id: "CCA-02", room: "Blast Freezer B2", warehouse: "Delhi DC2", product: "Frozen Parathas", category: "Frozen Food", setTemp: -35, currentTemp: -32, minTemp: -38, maxTemp: -28, humidity: 30, compliance: "FSSAI", excursions: 1, spoilageRisk: 5, shelfLife: 90, energy: 6800, occupancy: 92, status: "At Risk", city: "Delhi", lastAudit: "2026-07-25", cost: 420000 },
  { id: "CCA-03", room: "Chiller C3", warehouse: "Bengaluru DC3", product: "Fresh Dairy (Amul)", category: "Dairy", setTemp: 4, currentTemp: 3, minTemp: 1, maxTemp: 8, humidity: 65, compliance: "FSSAI", excursions: 0, spoilageRisk: 8, shelfLife: 14, energy: 2200, occupancy: 65, status: "Optimal", city: "Bengaluru", lastAudit: "2026-07-30", cost: 165000 },
  { id: "CCA-04", room: "Pharma Vault D4", warehouse: "Hyderabad DC5", product: "Insulin Pens", category: "Pharma", setTemp: 8, currentTemp: 12, minTemp: 2, maxTemp: 8, humidity: 55, compliance: "WHO-GMP", excursions: 3, spoilageRisk: 42, shelfLife: 365, energy: 1800, occupancy: 85, status: "Excursion", city: "Hyderabad", lastAudit: "2026-07-20", cost: 520000 },
  { id: "CCA-05", room: "Cold Room E5", warehouse: "Chennai DC4", product: "Seafood (Prawns)", category: "Seafood", setTemp: -25, currentTemp: -24, minTemp: -28, maxTemp: -18, humidity: 40, compliance: "FSSAI", excursions: 0, spoilageRisk: 12, shelfLife: 60, energy: 5500, occupancy: 88, status: "Optimal", city: "Chennai", lastAudit: "2026-07-29", cost: 340000 },
  { id: "CCA-06", room: "Ripening Chamber F6", warehouse: "Pune DC6", product: "Alphonso Mangoes", category: "Fruits", setTemp: 12, currentTemp: 13, minTemp: 10, maxTemp: 15, humidity: 85, compliance: "APEDA", excursions: 1, spoilageRisk: 18, shelfLife: 7, energy: 1200, occupancy: 55, status: "Warning", city: "Pune", lastAudit: "2026-07-22", cost: 95000 },
  { id: "CCA-07", room: "Deep Freeze G7", warehouse: "Kolkata DC7", product: "Ice Cream (Amul)", category: "Frozen Food", setTemp: -30, currentTemp: -29, minTemp: -35, maxTemp: -25, humidity: 25, compliance: "FSSAI", excursions: 0, spoilageRisk: 3, shelfLife: 120, energy: 7200, occupancy: 95, status: "Optimal", city: "Kolkata", lastAudit: "2026-07-31", cost: 380000 },
  { id: "CCA-08", room: "Vaccine Hub H8", warehouse: "Jaipur DC9", product: "BCG Vaccine", category: "Pharma", setTemp: 2, currentTemp: 8, minTemp: 0, maxTemp: 8, humidity: 50, compliance: "WHO-GMP", excursions: 5, spoilageRisk: 68, shelfLife: 270, energy: 1500, occupancy: 72, status: "Critical", city: "Jaipur", lastAudit: "2026-07-15", cost: 610000 },
  { id: "CCA-09", room: "Cool Storage I9", warehouse: "Ahmedabad DC8", product: "Fresh Vegetables", category: "Produce", setTemp: 6, currentTemp: 5, minTemp: 2, maxTemp: 10, humidity: 75, compliance: "FSSAI", excursions: 0, spoilageRisk: 22, shelfLife: 5, energy: 2000, occupancy: 48, status: "Optimal", city: "Ahmedabad", lastAudit: "2026-07-27", cost: 110000 },
  { id: "CCA-10", room: "Ultra-Cold J10", warehouse: "Mumbai DC1", product: "mRNA Vaccine (Pfizer)", category: "Pharma", setTemp: -70, currentTemp: -68, minTemp: -75, maxTemp: -60, humidity: 20, compliance: "WHO-GMP", excursions: 0, spoilageRisk: 1, shelfLife: 30, energy: 12000, occupancy: 35, status: "Optimal", city: "Mumbai", lastAudit: "2026-08-01", cost: 890000 },
]

interface CCAItem {
  id: string; room: string; warehouse: string; product: string; category: string
  setTemp: number; currentTemp: number; minTemp: number; maxTemp: number
  humidity: number; compliance: string; excursions: number; spoilageRisk: number
  shelfLife: number; energy: number; occupancy: number; status: string
  city: string; lastAudit: string; cost: number
}

const items: CCAItem[] = raw.map((r: any) => ({
  id: r.id, room: r.room, warehouse: r.warehouse, product: r.product, category: r.category,
  setTemp: r.setTemp, currentTemp: r.currentTemp, minTemp: r.minTemp, maxTemp: r.maxTemp,
  humidity: r.humidity, compliance: r.compliance, excursions: r.excursions,
  spoilageRisk: r.spoilageRisk, shelfLife: r.shelfLife, energy: r.energy,
  occupancy: r.occupancy, status: r.status, city: r.city, lastAudit: r.lastAudit, cost: r.cost,
}))

const statusColors: Record<string, string> = {
  "Optimal": "text-emerald-600 font-semibold", "At Risk": "text-amber-600 font-semibold",
  "Excursion": "text-red-600 font-semibold", "Warning": "text-orange-600 font-semibold",
  "Critical": "text-red-600 font-semibold",
}
const catColors: Record<string, string> = {
  "Pharma": "bg-purple-100 text-purple-700", "Frozen Food": "bg-cyan-100 text-cyan-700",
  "Dairy": "bg-blue-100 text-blue-700", "Seafood": "bg-teal-100 text-teal-700",
  "Fruits": "bg-amber-100 text-amber-700", "Produce": "bg-green-100 text-green-700",
}
const categories = [...new Set(items.map(i => i.category))]
const totalEnergy = items.reduce((s, i) => s + i.energy, 0)
const avgRisk = Math.round(items.reduce((s, i) => s + i.spoilageRisk, 0) / items.length)
const critical = items.filter(i => i.status === "Critical" || i.status === "Excursion").length

type Rec = any
type FV = Record<string, string>
type VT = "rooms" | "risk" | "energy"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`cca-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

function formatINR(amount: number) {
  if (amount >= 10000000) return `\u20b9${(amount / 10000000).toFixed(1)}Cr`
  if (amount >= 100000) return `\u20b9${(amount / 100000).toFixed(1)}L`
  return `\u20b9${(amount / 1000).toFixed(0)}K`
}

function tempLabel(t: number) { return `${t > 0 ? "+" : ""}${t}\u00b0C` }

export function ColdChainAnalyticsPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("rooms")

  const filtered = items.filter((r) => {
    type Rec = any
    const p: FV = Object.assign({}, activeFilters)
    return Object.entries(p).every(([k, v]) => r[k as keyof Rec] === v)
  })

  const toggle = (k: string, nv: string | undefined) => {
    const n = Object.assign({}, activeFilters)
    if (nv === undefined) { delete n[k] } else { n[k] = nv }
    setActiveFilters(n)
  }

  const alerts = [
    ...items.filter(i => i.status === "Critical").map(i => ({ id: i.id, msg: `${i.room}: ${i.product} at ${tempLabel(i.currentTemp)} vs set ${tempLabel(i.setTemp)} \u2014 risk ${i.spoilageRisk}%, ${i.excursions} excursions`, severity: "critical" as const })),
    ...items.filter(i => i.status === "Excursion").map(i => ({ id: i.id, msg: `${i.room}: Temp excursion! ${tempLabel(i.currentTemp)} exceeds max ${tempLabel(i.maxTemp)} \u2014 ${i.compliance}, ${i.city}`, severity: "critical" as const })),
    ...items.filter(i => i.spoilageRisk > 20 && i.status !== "Critical").map(i => ({ id: i.id, msg: `${i.room}: High spoilage risk ${i.spoilageRisk}% \u2014 ${i.product}, shelf life ${i.shelfLife}d`, severity: "warning" as const })),
    ...items.filter(i => i.occupancy > 90).map(i => ({ id: i.id, msg: `${i.room}: Occupancy at ${i.occupancy}% \u2014 ${i.warehouse}, capacity near limit`, severity: "info" as const })),
  ].slice(0, 5)

  const insights = [
    { icon: ThermometerSnowflake, title: "Avg Risk", desc: `${avgRisk}% avg spoilage risk across ${items.length} rooms`, accent: "text-cyan-500" },
    { icon: Shield, title: "Compliance", desc: `${items.filter(i => i.compliance === "FSSAI").length} FSSAI, ${items.filter(i => i.compliance === "WHO-GMP").length} WHO-GMP`, accent: "text-purple-500" },
    { icon: Zap, title: "Energy Cost", desc: `${formatINR(totalEnergy * 8)}/mo at \u20b98/unit`, accent: "text-amber-500" },
  ]

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-cyan-100 flex items-center justify-center"><Snowflake className="h-4 w-4 text-cyan-600" /></div>
            <div><h3 className="text-sm font-bold">Cold Chain Analytics</h3><p className="text-xs opacity-60">{items.length} rooms | {categories.length} categories</p></div>
          </div>
          <div className="flex gap-1">
            {(["rooms", "risk", "energy"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "rooms" ? "Rooms" : v === "risk" ? "Risk" : "Energy"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Rooms", items.length.toString(), Thermometer, "bg-cyan-50/50")}
          {statCard("Critical", `${critical}/${items.length}`, AlertTriangle, "bg-red-50/50")}
          {statCard("Avg Risk", `${avgRisk}%`, Target, "bg-amber-50/50")}
          {statCard("Energy", `${(totalEnergy / 1000).toFixed(0)}KW`, Zap, "bg-purple-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {categories.map(c => {
            const active = activeFilters.category === c
            return <span key={c} onClick={() => toggle("category", active ? undefined : c)} className={`cca-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{c}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="cca-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="cca-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="cca-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Cold Chain Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`cca-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "rooms" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isCritical = item.status === "Critical" || item.status === "Excursion"
              const isWarning = item.status === "Warning" || item.status === "At Risk"
              const tempOk = item.currentTemp >= item.minTemp && item.currentTemp <= item.maxTemp
              return (
                <div key={item.id} className={`cca-room-card rounded-lg border p-2.5 bg-card ${isCritical ? "cca-critical-pulse" : isWarning ? "cca-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="cca-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-700">{item.id}</span>
                      <span className={`cca-cat-tag text-[10px] px-1.5 py-0.5 rounded font-semibold ${catColors[item.category] || "bg-slate-100"}`}>{item.category}</span>
                      <span className="cca-compliance-tag text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-700">{item.compliance}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                      {isCritical ? <XCircle className="h-3 w-3 text-red-500" /> : tempOk ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Snowflake className="h-3 w-3 opacity-40" />{item.room} | {item.warehouse}</div>
                    <div className="flex items-center gap-1"><Package className="h-3 w-3 opacity-40" />{item.product}</div>
                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3 opacity-40" />{item.city} | Audit: {item.lastAudit}</div>
                    <div className="flex items-center gap-1"><FileText className="h-3 w-3 opacity-40" />Shelf: {item.shelfLife}d | Occ: {item.occupancy}%</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Temp: <span className={`font-bold ${tempOk ? "text-emerald-600" : "text-red-600"}`}>{tempLabel(item.currentTemp)}</span></div>
                    <div>Set: <span className="font-medium">{tempLabel(item.setTemp)}</span></div>
                    <div>Risk: <span className={`font-bold ${item.spoilageRisk > 20 ? "text-red-600" : item.spoilageRisk > 10 ? "text-amber-600" : "text-emerald-600"}`}>{item.spoilageRisk}%</span></div>
                    <div>Excursions: <span className={`font-medium ${item.excursions > 0 ? "text-red-600" : "text-foreground"}`}>{item.excursions}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "risk" && (
          <div className="space-y-2">
            <div className="cca-risk-header rounded-lg border p-2 bg-red-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-red-600">{items.filter(i => i.spoilageRisk > 20).length}</div><div className="text-[10px] opacity-50">High Risk</div></div>
                <div><div className="text-lg font-bold text-amber-600">{items.filter(i => i.spoilageRisk > 5 && i.spoilageRisk <= 20).length}</div><div className="text-[10px] opacity-50">Medium Risk</div></div>
                <div><div className="text-lg font-bold text-emerald-600">{items.filter(i => i.spoilageRisk <= 5).length}</div><div className="text-[10px] opacity-50">Low Risk</div></div>
                <div><div className="text-lg font-bold text-indigo-600">{items.reduce((s, i) => s + i.excursions, 0)}</div><div className="text-[10px] opacity-50">Total Excursions</div></div>
              </div>
            </div>
            {items.sort((a, b) => b.spoilageRisk - a.spoilageRisk).map(item => (
              <div key={item.id} className={`cca-risk-row rounded-lg border p-2 bg-card ${item.spoilageRisk > 20 ? "cca-critical-pulse" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.room}</span>
                    <span className={`cca-cat-tag text-[10px] px-1.5 py-0.5 rounded ${catColors[item.category] || "bg-slate-100"}`}>{item.category}</span>
                  </div>
                  <span className={`text-xs font-bold ${item.spoilageRisk > 20 ? "text-red-600" : item.spoilageRisk > 5 ? "text-amber-600" : "text-emerald-600"}`}>{item.spoilageRisk}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${item.spoilageRisk > 20 ? "bg-red-500" : item.spoilageRisk > 5 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${Math.min(item.spoilageRisk, 100)}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Product: <span className="font-medium">{item.product}</span></div>
                  <div>Temp: <span className="font-medium">{tempLabel(item.currentTemp)}/{tempLabel(item.setTemp)}</span></div>
                  <div>Shelf: <span className="font-medium">{item.shelfLife}d</span></div>
                  <div>Excursions: <span className={`font-medium ${item.excursions > 0 ? "text-red-600" : "text-foreground"}`}>{item.excursions}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === "energy" && (
          <div className="space-y-2">
            <div className="cca-energy-header rounded-lg border p-2 bg-purple-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-purple-600">{(totalEnergy / 1000).toFixed(0)}KW</div><div className="text-[10px] opacity-50">Total Power</div></div>
                <div><div className="text-lg font-bold text-amber-600">{formatINR(totalEnergy * 8)}/mo</div><div className="text-[10px] opacity-50">Energy Cost</div></div>
                <div><div className="text-lg font-bold text-emerald-600">{Math.round(items.reduce((s, i) => s + i.occupancy, 0) / items.length)}%</div><div className="text-[10px] opacity-50">Avg Occupancy</div></div>
                <div><div className="text-lg font-bold text-blue-600">{items.filter(i => i.occupancy > 90).length}</div><div className="text-[10px] opacity-50">Near Capacity</div></div>
              </div>
            </div>
            {items.sort((a, b) => b.energy - a.energy).map(item => {
              const costMo = item.energy * 8
              return (
                <div key={item.id} className="cca-energy-row rounded-lg border p-2 bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                      <span className="text-xs font-semibold">{item.room}</span>
                      <span className="text-[10px] opacity-50">{item.warehouse}</span>
                    </div>
                    <span className="text-xs font-bold text-foreground">{item.energy}KW | {formatINR(costMo)}/mo</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                    <div className={`h-full rounded-full ${item.occupancy > 90 ? "bg-red-500" : item.occupancy > 75 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${item.occupancy}%` }} />
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>Product: <span className="font-medium">{item.product}</span></div>
                    <div>Temp: <span className="font-medium">{tempLabel(item.currentTemp)}</span></div>
                    <div>Occupancy: <span className={`font-medium ${item.occupancy > 90 ? "text-red-600" : "text-foreground"}`}>{item.occupancy}%</span></div>
                    <div>Audit: <span className="font-medium">{item.lastAudit}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
