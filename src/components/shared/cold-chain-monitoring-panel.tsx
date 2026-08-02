"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Thermometer, Snowflake, AlertTriangle, CheckCircle, TrendingDown, Activity, Zap, MapPin
} from "lucide-react"

const raw = [
  { id: "CCM-01", product: "Covid-19 Vaccines (Covaxin)", category: "Vaccines", origin: "Serum Institute Pune", dest: "Delhi Govt Depot", carrier: "Snowman Logistics", tempTarget: -20, tempActual: -18.5, humidity: 45, sensor: "Active", battery: 92, lastPing: "2 min ago", shelfLife: "6 months", qty: 50000, dose: "0.5ml", who: true, fssai: true, status: "Optimal", excursion: 0, transit: 4.2, total: 12, bl: "SNW-VR-4812" },
  { id: "CCM-02", product: "Insulin Glargine 100U/ml", category: "Biologics", origin: "Biocon Bengaluru", dest: "Apollo Chennai", carrier: "ColdStar Express", tempTarget: 4, tempActual: 5.2, humidity: 52, sensor: "Active", battery: 78, lastPing: "5 min ago", shelfLife: "24 months", qty: 12000, dose: "10ml", who: false, fssai: true, status: "At Risk", excursion: 1, transit: 6.1, total: 10, bl: "CSE-BIO-2210" },
  { id: "CCM-03", product: "Fresh Alphonso Mangoes", category: "Perishable", origin: "Ratnagiri Farms", dest: "DMart Mumbai Hub", carrier: "ColdChain India", tempTarget: 5, tempActual: 4.8, humidity: 88, sensor: "Active", battery: 95, lastPing: "1 min ago", shelfLife: "14 days", qty: 8000, dose: "N/A", who: false, fssai: true, status: "Optimal", excursion: 0, transit: 2.1, total: 6, bl: "CCI-MNG-1190" },
  { id: "CCM-04", product: "Oncology Drug (Cisplatin)", category: "Pharma", origin: "Cipla Goa", dest: "Tata Memorial Mumbai", carrier: "BlueDart Cold", tempTarget: 8, tempActual: 22.4, humidity: 68, sensor: "Alarm", battery: 45, lastPing: "15 min ago", shelfLife: "18 months", qty: 2400, dose: "50ml", who: true, fssai: true, status: "Critical", excursion: 4, transit: 5.8, total: 8, bl: "BDC-ONC-5521" },
  { id: "CCM-05", product: "Butter Amul 500g", category: "Dairy", origin: "Amul Anand GC", dest: "Spencer Hyderabad", carrier: "Adani Cold", tempTarget: 4, tempActual: 3.9, humidity: 42, sensor: "Active", battery: 88, lastPing: "3 min ago", shelfLife: "6 months", qty: 25000, dose: "N/A", who: false, fssai: true, status: "Optimal", excursion: 0, transit: 8.4, total: 16, bl: "ADC-BTR-3321" },
  { id: "CCM-06", product: "HPV Vaccine (Cervarix)", category: "Vaccines", origin: "GSK Barnala", dest: " Karnataka PHC", carrier: "Zipline Cold", tempTarget: 2, tempActual: 2.1, humidity: 50, sensor: "Active", battery: 71, lastPing: "8 min ago", shelfLife: "24 months", qty: 18000, dose: "0.5ml", who: true, fssai: true, status: "Optimal", excursion: 0, transit: 1.2, total: 4, bl: "ZPC-HPV-7712" },
  { id: "CCM-07", product: "Atlantic Salmon Fillet", category: "Seafood", origin: "Kochi Port", dest: "ITC Grand Chola Chennai", carrier: "ColdChain India", tempTarget: -2, tempActual: -1.2, humidity: 92, sensor: "Active", battery: 62, lastPing: "4 min ago", shelfLife: "5 days", qty: 3200, dose: "N/A", who: false, fssai: true, status: "At Risk", excursion: 1, transit: 3.5, total: 10, bl: "CCI-SAL-2291" },
  { id: "CCM-08", product: "mRNA Covid Booster (mRNA-1273)", category: "Vaccines", origin: "Biological E Hyd", dest: "AIIMS Delhi", carrier: "Snowman Logistics", tempTarget: -20, tempActual: -19.8, humidity: 40, sensor: "Active", battery: 98, lastPing: "1 min ago", shelfLife: "9 months", qty: 80000, dose: "0.5ml", who: true, fssai: true, status: "Optimal", excursion: 0, transit: 0.5, total: 8, bl: "SNW-MRNA-4471" },
  { id: "CCM-09", product: "Red Blood Cells (Packed)", category: "Blood Bank", origin: "Rotary Tissue Bank Kochi", dest: "AIIMS Jodhpur", carrier: "BlueDart Cold", tempTarget: 4, tempActual: 9.5, humidity: 55, sensor: "Alarm", battery: 32, lastPing: "22 min ago", shelfLife: "42 days", qty: 500, dose: "350ml", who: false, fssai: true, status: "Critical", excursion: 2, transit: 3.0, total: 12, bl: "BDC-BLD-8816" },
  { id: "CCM-10", product: "Organic Milk Amul 1L", category: "Dairy", origin: "Mother Dairy Delhi", dest: "BigBasket Noida", carrier: "Delhivery Cold", tempTarget: 4, tempActual: 4.1, humidity: 38, sensor: "Active", battery: 85, lastPing: "2 min ago", shelfLife: "5 days", qty: 15000, dose: "N/A", who: false, fssai: true, status: "Optimal", excursion: 0, transit: 1.8, total: 3, bl: "DHC-MLK-1184" },
]

interface CCMItem {
  id: string; product: string; category: string; origin: string; dest: string; carrier: string
  tempTarget: number; tempActual: number; humidity: number; sensor: string; battery: number
  lastPing: string; shelfLife: string; qty: number; dose: string; who: boolean; fssai: boolean
  status: string; excursion: number; transit: number; total: number; bl: string
}

type Rec = any
const items: CCMItem[] = raw.map((r: Rec) => ({
  id: r.id, product: r.product, category: r.category, origin: r.origin, dest: r.dest, carrier: r.carrier,
  tempTarget: r.tempTarget, tempActual: r.tempActual, humidity: r.humidity, sensor: r.sensor, battery: r.battery,
  lastPing: r.lastPing, shelfLife: r.shelfLife, qty: r.qty, dose: r.dose, who: r.who, fssai: r.fssai,
  status: r.status, excursion: r.excursion, transit: r.transit, total: r.total, bl: r.bl,
}))

const catColors: Record<string, string> = {
  "Vaccines": "bg-violet-100 text-violet-700", "Biologics": "bg-pink-100 text-pink-700",
  "Perishable": "bg-lime-100 text-lime-700", "Pharma": "bg-blue-100 text-blue-700",
  "Dairy": "bg-amber-100 text-amber-700", "Seafood": "bg-cyan-100 text-cyan-700",
  "Blood Bank": "bg-red-100 text-red-700",
}

const statusColors: Record<string, string> = {
  "Optimal": "text-emerald-600 font-semibold", "At Risk": "text-orange-600 font-semibold", "Critical": "text-red-600 font-semibold",
}

const fmtQty = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v.toString()

const ColdChainMonitoringPanel: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [view, setView] = useState<"shipments" | "compliance" | "sensors">("shipments")
  const filters = [
    { key: "category", label: "Category", options: ["Vaccines", "Biologics", "Perishable", "Pharma", "Dairy", "Seafood", "Blood Bank"] },
    { key: "status", label: "Status", options: ["Optimal", "At Risk", "Critical"] },
    { key: "sensor", label: "Sensor", options: ["Active", "Alarm"] },
  ]

  const toggleFilter = (k: string, v: string) => setActiveFilters((p: Record<string, string>) => {
    const n = Object.assign({}, p)
    if (n[k] === v) { delete n[k] } else { n[k] = v }
    return n
  })

  const filtered = items.filter((r: Rec) => Object.entries(activeFilters).every(([k, v]) => r[k as keyof Rec] === v))

  const stats = [
    { label: "Active Sensors", value: items.filter(i => i.sensor === "Active").length.toString(), icon: Activity, color: "bg-emerald-50 text-emerald-600" },
    { label: "Temp Excursions", value: items.filter(i => i.excursion > 0).length.toString(), icon: Thermometer, color: "bg-red-50 text-red-600" },
    { label: "Critical Alarms", value: items.filter(i => i.status === "Critical").length.toString(), icon: Zap, color: "bg-amber-50 text-amber-600" },
    { label: "WHO Certified", value: items.filter(i => i.who).length.toString(), icon: CheckCircle, color: "bg-blue-50 text-blue-600" },
  ]

  const insights = [
    { icon: AlertTriangle, title: "Critical: CCM-04 Cisplatin", desc: "Temperature at 22.4\u00b0C vs 8\u00b0C target. 4 excursions logged. Battery at 45%. Sensor alarm active 15min ago. Oncology drug shipment for Tata Memorial at risk.", color: "text-red-500" },
    { icon: Snowflake, title: "Battery Alert: CCM-09 Blood", desc: "Packed RBC unit at 9.5\u00b0C (target 4\u00b0C). Battery critically low at 32%. Last ping 22min ago. 42-day shelf life, transit 3/12h.", color: "text-orange-500" },
    { icon: TrendingDown, title: "At Risk: CCM-02 Insulin", desc: "Biocon Insulin Glargine at 5.2\u00b0C vs 4\u00b0C target. 1 excursion today. Humidity 52% within range. Apollo Chennai delivery in 4h.", color: "text-amber-500" },
  ]

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        {stats.map((sc) => { const SIcon = sc.icon as React.ElementType; return (
          <div key={sc.label} className={`ccm-stat-card rounded-lg border p-3 ${sc.color.split(" ")[0]}`}>
            <div className="flex items-center gap-2 mb-1">
              <SIcon className="h-4 w-4" />
              <span className="text-xs font-medium opacity-70">{sc.label}</span>
            </div>
            <p className={`text-lg font-bold ${sc.color.split(" ")[1]}`}>{sc.value}</p>
          </div>
        )})}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {filters.map(f => f.options.map(opt => {
          const active = activeFilters[f.key] === opt
          return <button key={`${f.key}-${opt}`} onClick={() => toggleFilter(f.key, opt)}
            className={`ccm-filter-pill px-2 py-0.5 rounded-full text-xs border ${active ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted border-muted-foreground/20"}`}>{opt}</button>
        }))}
        {Object.keys(activeFilters).length > 0 && <button onClick={() => setActiveFilters({})}
          className="px-2 py-0.5 rounded-full text-xs border border-red-200 text-red-500 hover:bg-red-50">Clear</button>}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {insights.map(ins => { const IIcon = ins.icon as React.ElementType; return (
          <div key={ins.title} className="rounded-lg border p-2.5 flex items-start gap-2">
            <IIcon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${ins.color}`} />
            <div><p className="text-xs font-semibold">{ins.title}</p><p className="text-[11px] text-muted-foreground mt-0.5">{ins.desc}</p></div>
          </div>
        )})}
      </div>

      <div className="flex gap-1.5">
        {(["shipments", "compliance", "sensors"] as const).map(v => (
          <Button key={v} size="sm" variant={view === v ? "default" : "outline"} onClick={() => setView(v)}
            className="text-xs h-7 capitalize">{v}</Button>
        ))}
      </div>

      {view === "shipments" && filtered.map(item => {
        const isCritical = item.status === "Critical"
        const isAtRisk = item.status === "At Risk"
        const tempOk = Math.abs(item.tempActual - item.tempTarget) <= 1
        const transitPct = Math.round((item.transit / item.total) * 100)
        return (
          <div key={item.id} className={`ccm-shipment-card rounded-lg border p-3 ${isCritical ? "ccm-critical-pulse" : ""} ${isAtRisk ? "ccm-warning-border" : ""}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold">{item.id}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${catColors[item.category] || "bg-gray-100 text-gray-600"}`}>{item.category}</span>
                {isCritical && <span className="ccm-alert-dot h-2 w-2 rounded-full bg-red-500 inline-block" />}
              </div>
              <span className={statusColors[item.status]}>{item.status}</span>
            </div>
            <div className="text-[11px] font-medium mb-1.5">{item.product}</div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1.5">
              <MapPin className="h-3 w-3" /><span>{item.origin}</span>
              <span className="text-xs">&rarr;</span><span>{item.dest}</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] mb-2">
              <span className={tempOk ? "text-emerald-600 font-medium" : "text-red-600 font-medium"}>
                <Thermometer className="h-3 w-3 inline mr-0.5" />{item.tempActual}\u00b0C / {item.tempTarget}\u00b0C
              </span>
              <span>Humidity: {item.humidity}%</span>
              <span>Shelf: {item.shelfLife}</span>
              <span>Qty: {fmtQty(item.qty)} {item.dose !== "N/A" ? `x ${item.dose}` : "units"}</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] mb-2">
              <span className="text-muted-foreground">{item.carrier}</span>
              <span>{item.bl}</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] mb-2">
              <span className={`flex items-center gap-1 ${item.sensor === "Alarm" ? "text-red-500 font-medium" : "text-emerald-500"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${item.sensor === "Alarm" ? "bg-red-500" : "bg-emerald-500"}`} />
                {item.sensor}
              </span>
              <span>Signal: {item.lastPing}</span>
              <span>Battery: {item.battery}%</span>
              <span>Excursions: {item.excursion}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 mb-1">
              <div className={`h-1.5 rounded-full transition-all ${isCritical ? "bg-red-500" : isAtRisk ? "bg-amber-500" : "bg-primary"}`} style={{ width: `${transitPct}%` }} />
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Transit: {item.transit}h / {item.total}h ({transitPct}%)</span>
              <div className="flex gap-2">
                {item.who && <span className="px-1 py-0.5 rounded text-[9px] bg-blue-100 text-blue-600">WHO</span>}
                {item.fssai && <span className="px-1 py-0.5 rounded text-[9px] bg-green-100 text-green-600">FSSAI</span>}
              </div>
            </div>
          </div>
        )
      })}

      {view === "compliance" && filtered.map(item => {
        const tempDev = item.tempActual - item.tempTarget
        const isCritical = item.status === "Critical"
        return (
          <div key={item.id} className={`ccm-compliance-row rounded-lg border p-3 ${isCritical ? "ccm-critical-pulse" : "ccm-compliance-row"}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold">{item.id}</span>
                <span className="text-[11px] font-medium">{item.product}</span>
              </div>
              <span className={statusColors[item.status]}>{item.status}</span>
            </div>
            <div className="grid grid-cols-4 gap-3 text-[11px]">
              <div>
                <span className="text-muted-foreground block text-[10px]">Temperature</span>
                <span className={Math.abs(tempDev) <= 1 ? "text-emerald-600" : "text-red-600"}>
                  {item.tempActual}\u00b0C ({tempDev > 0 ? "+" : ""}{tempDev.toFixed(1)}\u00b0C)
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Humidity</span>
                <span className={item.humidity >= 40 && item.humidity <= 70 ? "text-emerald-600" : "text-amber-600"}>{item.humidity}%</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Sensor / Battery</span>
                <span>{item.sensor} / {item.battery}%</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Certifications</span>
                <div className="flex gap-1">
                  {item.who && <span className="px-1 py-0.5 rounded text-[9px] bg-blue-100 text-blue-600">WHO</span>}
                  {item.fssai && <span className="px-1 py-0.5 rounded text-[9px] bg-green-100 text-green-600">FSSAI</span>}
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {view === "sensors" && filtered.map(item => {
        const battPct = item.battery
        const isCritical = item.status === "Critical"
        return (
          <div key={item.id} className={`ccm-sensor-row rounded-lg border p-3 ${isCritical ? "ccm-critical-pulse" : ""}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-xs font-bold">{item.id}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${item.sensor === "Alarm" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>{item.sensor}</span>
              </div>
              <span className="text-[11px] text-muted-foreground">{item.lastPing}</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] mb-2">
              <span className="font-medium">{item.product}</span>
              <span className={battPct > 60 ? "text-emerald-600" : battPct > 30 ? "text-amber-600" : "text-red-600"}>
                Battery: {battPct}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 mb-1">
              <div className={`h-1.5 rounded-full transition-all ${battPct > 60 ? "bg-emerald-500" : battPct > 30 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${battPct}%` }} />
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>{item.carrier} &middot; {item.bl}</span>
              <span>Temp: {item.tempActual}\u00b0C / {item.tempTarget}\u00b0C &middot; Humidity: {item.humidity}%</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { ColdChainMonitoringPanel }
