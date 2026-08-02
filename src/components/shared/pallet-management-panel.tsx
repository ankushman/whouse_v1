"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Package, AlertTriangle, CheckCircle, XCircle, TrendingUp, Clock, RotateCcw, Layers, Box, Tag, MapPin
} from "lucide-react"

const raw = [
  { id: "PMT-01", pool: "CHEP Blue", loc: "Mumbai DC1", type: "Standard EPAL", cond: "A", qty: 2450, cap: 3000, inTransit: 180, damage: 12, repair: 8, age: "2-3yr", weight: 25, turns: 8.5, vendor: "CHEP India", city: "Mumbai", region: "West", status: "Optimal" },
  { id: "PMT-02", pool: "Local Wood", loc: "Delhi DC2", type: "Wooden Block", cond: "C", qty: 1800, cap: 2000, inTransit: 95, damage: 45, repair: 32, age: "4-5yr", weight: 22, turns: 4.2, vendor: "Indian Pallet Co", city: "Delhi", region: "North", status: "At Risk" },
  { id: "PMT-03", pool: "Plastic CRM", loc: "Bengaluru DC3", type: "Plastic Rack", cond: "A", qty: 1200, cap: 1500, inTransit: 60, damage: 2, repair: 0, age: "1-2yr", weight: 15, turns: 12.8, vendor: "Nilkamal", city: "Bengaluru", region: "South", status: "Optimal" },
  { id: "PMT-04", pool: "Metal Cage", loc: "Kolkata DC7", type: "Stillage Cage", cond: "B", qty: 320, cap: 400, inTransit: 45, damage: 18, repair: 12, age: "3-4yr", weight: 45, turns: 3.1, vendor: "Godrej Storage", city: "Kolkata", region: "East", status: "Warning" },
  { id: "PMT-05", pool: "Export ISPM", loc: "Nhava Sheva", type: "ISPM 15 Heat", cond: "A", qty: 800, cap: 1000, inTransit: 320, damage: 5, repair: 3, age: "0-1yr", weight: 28, turns: 6.8, vendor: "Woodkraft India", city: "Mumbai", region: "West", status: "Optimal" },
  { id: "PMT-06", pool: "Cold Chain", loc: "Chennai DC4", type: "Hygienic Plastic", cond: "B", qty: 650, cap: 800, inTransit: 110, damage: 8, repair: 5, age: "2-3yr", weight: 18, turns: 9.2, vendor: "Bramha Plastics", city: "Chennai", region: "South", status: "Optimal" },
  { id: "PMT-07", pool: "Retail Display", loc: "Pune DC6", type: "Half Pallet", cond: "C", qty: 420, cap: 600, inTransit: 15, damage: 22, repair: 18, age: "5-6yr", weight: 12, turns: 2.1, vendor: "Display Solutions", city: "Pune", region: "West", status: "Critical" },
  { id: "PMT-08", pool: "Heavy Duty", loc: "Ahmedabad DC8", type: "Steel Drum", cond: "A", qty: 280, cap: 350, inTransit: 40, damage: 3, repair: 2, age: "1-2yr", weight: 65, turns: 5.5, vendor: "Tata Steel Products", city: "Ahmedabad", region: "West", status: "Optimal" },
  { id: "PMT-09", pool: "FMCG Slim", loc: "Hyderabad DC5", type: "Slim Profile", cond: "B", qty: 1100, cap: 1200, inTransit: 85, damage: 15, repair: 10, age: "3-4yr", weight: 20, turns: 7.4, vendor: "Visaka Industries", city: "Hyderabad", region: "South", status: "Warning" },
  { id: "PMT-10", pool: "Auto Parts", loc: "Lucknow DC10", type: "Custom Nestable", cond: "A", qty: 560, cap: 700, inTransit: 30, damage: 1, repair: 0, age: "0-1yr", weight: 35, turns: 10.2, vendor: "Mold-Tek Packaging", city: "Lucknow", region: "North", status: "Optimal" },
]

interface PMTItem {
  id: string; pool: string; loc: string; type: string; cond: string
  qty: number; cap: number; inTransit: number; damage: number; repair: number
  age: string; weight: number; turns: number; vendor: string
  city: string; region: string; status: string
}

const items: PMTItem[] = raw.map((r: any) => ({
  id: r.id, pool: r.pool, loc: r.loc, type: r.type, cond: r.cond,
  qty: r.qty, cap: r.cap, inTransit: r.inTransit, damage: r.damage, repair: r.repair,
  age: r.age, weight: r.weight, turns: r.turns, vendor: r.vendor,
  city: r.city, region: r.region, status: r.status,
}))

const statusColors: Record<string, string> = {
  "Optimal": "text-emerald-600 font-semibold", "Warning": "text-amber-600 font-semibold",
  "At Risk": "text-orange-600 font-semibold", "Critical": "text-red-600 font-semibold",
}
const condColors: Record<string, string> = {
  "A": "bg-emerald-100 text-emerald-700", "B": "bg-amber-100 text-amber-700",
  "C": "bg-red-100 text-red-700", "D": "bg-gray-100 text-gray-600",
}
const ageColors: Record<string, string> = {
  "0-1yr": "bg-emerald-100 text-emerald-700", "1-2yr": "bg-blue-100 text-blue-700",
  "2-3yr": "bg-amber-100 text-amber-700", "3-4yr": "bg-orange-100 text-orange-700",
  "4-5yr": "bg-red-100 text-red-700", "5-6yr": "bg-red-100 text-red-800",
}
const regions = [...new Set(items.map(i => i.region))]
const totalQty = items.reduce((s, i) => s + i.qty, 0)
const totalCap = items.reduce((s, i) => s + i.cap, 0)
const avgTurns = Math.round(items.reduce((s, i) => s + i.turns, 0) / items.length * 10) / 10
const totalDamage = items.reduce((s, i) => s + i.damage, 0)

type Rec = any
type FV = Record<string, string>
type VT = "pools" | "condition" | "performance"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`pmt-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function PalletManagementPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("pools")

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
    ...items.filter(i => i.status === "Critical").map(i => ({ id: i.id, msg: `${i.pool}: CRITICAL \u2014 ${i.damage} damaged, ${i.repair} in repair, condition ${i.cond}, turns ${i.turns}/yr at ${i.loc}`, severity: "critical" as const })),
    ...items.filter(i => i.status === "At Risk").map(i => ({ id: i.id, msg: `${i.pool}: AT RISK \u2014 condition ${i.cond}, ${i.damage} damaged pallets, ${Math.round(i.qty / i.cap * 100)}% capacity`, severity: "warning" as const })),
    ...items.filter(i => i.turns < 3).map(i => ({ id: i.id, msg: `${i.pool}: Low turns ${i.turns}/yr \u2014 pool underutilized, ${i.inTransit} in transit, vendor ${i.vendor}`, severity: "info" as const })),
  ].slice(0, 5)

  const insights = [
    { icon: Layers, title: "Pool Util", desc: `${Math.round(totalQty / totalCap * 100)}% across ${items.length} pools | ${(totalQty / 1000).toFixed(1)}K pallets`, accent: totalQty / totalCap > 0.85 ? "text-emerald-500" : "text-amber-500" },
    { icon: TrendingUp, title: "Avg Turns", desc: `${avgTurns} turns/yr avg | ${items.filter(i => i.turns >= 8).length} pools above 8`, accent: avgTurns >= 8 ? "text-emerald-500" : "text-amber-500" },
    { icon: AlertTriangle, title: "Damage Rate", desc: `${totalDamage} total damaged | ${(totalDamage / totalQty * 100).toFixed(1)}% damage rate`, accent: totalDamage > 80 ? "text-red-500" : "text-blue-500" },
  ]

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center"><Box className="h-4 w-4 text-amber-600" /></div>
            <div><h3 className="text-sm font-bold">Pallet Management</h3><p className="text-xs opacity-60">{items.length} pools | {regions.length} regions</p></div>
          </div>
          <div className="flex gap-1">
            {(["pools", "condition", "performance"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "pools" ? "Pools" : v === "condition" ? "Condition" : "Performance"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Total Pallets", `${(totalQty / 1000).toFixed(1)}K`, Package, "bg-amber-50/50")}
          {statCard("Utilization", `${Math.round(totalQty / totalCap * 100)}%`, Layers, "bg-blue-50/50")}
          {statCard("Avg Turns", `${avgTurns}/yr`, TrendingUp, "bg-emerald-50/50")}
          {statCard("Damaged", `${totalDamage}`, AlertTriangle, "bg-red-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {regions.map(t => {
            const active = activeFilters.region === t
            return <span key={t} onClick={() => toggle("region", active ? undefined : t)} className={`pmt-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{t}</span>
          })}
          {Object.keys(activeFilters).length > 0 && <span onClick={() => setActiveFilters({})} className="pmt-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="pmt-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="pmt-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Pallet Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`pmt-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "pools" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isCritical = item.status === "Critical"
              const isWarning = item.status === "Warning" || item.status === "At Risk"
              const utilPct = Math.round(item.qty / item.cap * 100)
              return (
                <div key={item.id} className={`pmt-pool-card rounded-lg border p-2.5 bg-card ${isCritical ? "pmt-critical-pulse" : isWarning ? "pmt-warning-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="pmt-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">{item.id}</span>
                      <span className="text-xs font-semibold">{item.pool}</span>
                      <span className={`pmt-cond-tag text-[10px] px-1.5 py-0.5 rounded ${condColors[item.cond] || "bg-slate-100"}`}>Cond {item.cond}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                      {isCritical ? <XCircle className="h-3 w-3 text-red-500" /> : item.status === "Optimal" ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3 opacity-40" />{item.loc} | {item.city}, {item.region}</div>
                    <div className="flex items-center gap-1"><Tag className="h-3 w-3 opacity-40" />{item.type} | {item.vendor}</div>
                    <div className="flex items-center gap-1"><Package className="h-3 w-3 opacity-40" />{item.qty.toLocaleString()} / {item.cap.toLocaleString()} | <span className={utilPct > 90 ? "text-red-600 font-semibold" : "text-foreground"}>{utilPct}%</span></div>
                    <div className="flex items-center gap-1"><RotateCcw className="h-3 w-3 opacity-40" />{item.turns} turns/yr | {item.weight}kg | Age: <span className={`pmt-age-tag text-[10px] px-1 py-0 rounded ${ageColors[item.age] || "bg-slate-100"}`}>{item.age}</span></div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>In Transit: <span className="font-medium">{item.inTransit}</span></div>
                    <div>Damaged: <span className={`font-medium ${item.damage > 20 ? "text-red-600" : "text-foreground"}`}>{item.damage}</span></div>
                    <div>In Repair: <span className={`font-medium ${item.repair > 15 ? "text-amber-600" : "text-foreground"}`}>{item.repair}</span></div>
                    <div>Vendor: <span className="font-medium">{item.vendor.split(" ")[0]}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "condition" && (
          <div className="space-y-2">
            <div className="pmt-cond-header rounded-lg border p-2 bg-emerald-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{items.filter(i => i.cond === "A").length}</div><div className="text-[10px] opacity-50">Grade A</div></div>
                <div><div className="text-lg font-bold text-amber-600">{items.filter(i => i.cond === "B").length}</div><div className="text-[10px] opacity-50">Grade B</div></div>
                <div><div className="text-lg font-bold text-red-600">{items.filter(i => i.cond === "C").length}</div><div className="text-[10px] opacity-50">Grade C</div></div>
                <div><div className="text-lg font-bold text-blue-600">{items.reduce((s, i) => s + i.damage + i.repair, 0)}</div><div className="text-[10px] opacity-50">Total Issues</div></div>
              </div>
            </div>
            {items.sort((a, b) => a.cond.localeCompare(b.cond)).map(item => {
              const healthPct = item.cond === "A" ? 100 : item.cond === "B" ? 70 : item.cond === "C" ? 40 : 20
              return (
              <div key={item.id} className={`pmt-cond-row rounded-lg border p-2 bg-card ${item.cond === "C" ? "pmt-critical-pulse" : item.cond === "B" ? "pmt-warning-border" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.pool}</span>
                    <span className={`pmt-cond-tag text-[10px] px-1.5 py-0.5 rounded ${condColors[item.cond] || "bg-slate-100"}`}>{item.cond}</span>
                  </div>
                  <span className="text-xs font-bold">{item.damage + item.repair} issues</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${healthPct >= 80 ? "bg-emerald-500" : healthPct >= 60 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${healthPct}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Location: <span className="font-medium">{item.loc}</span></div>
                  <div>Damaged: <span className={`font-medium ${item.damage > 20 ? "text-red-600" : "text-foreground"}`}>{item.damage}</span></div>
                  <div>Repair: <span className="font-medium">{item.repair}</span></div>
                  <div>Age: <span className="font-medium">{item.age}</span></div>
                </div>
              </div>
            )})}
          </div>
        )}

        {view === "performance" && (
          <div className="space-y-2">
            <div className="pmt-perf-header rounded-lg border p-2 bg-blue-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-blue-600">{avgTurns}</div><div className="text-[10px] opacity-50">Avg Turns/yr</div></div>
                <div><div className="text-lg font-bold text-emerald-600">{(totalQty / 1000).toFixed(1)}K</div><div className="text-[10px] opacity-50">Total Pallets</div></div>
                <div><div className="text-lg font-bold text-amber-600">{Math.round(items.reduce((s, i) => s + i.inTransit, 0) / items.length)}</div><div className="text-[10px] opacity-50">Avg In Transit</div></div>
                <div><div className="text-lg font-bold text-red-600">{totalDamage}</div><div className="text-[10px] opacity-50">Total Damaged</div></div>
              </div>
            </div>
            {items.sort((a, b) => b.turns - a.turns).map(item => {
              const turnPct = Math.min(Math.round(item.turns / 15 * 100), 100)
              return (
              <div key={item.id} className={`pmt-perf-row rounded-lg border p-2 bg-card ${item.turns < 3 ? "pmt-warning-border" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.pool}</span>
                    <span className={`pmt-cond-tag text-[10px] px-1.5 py-0.5 rounded ${condColors[item.cond] || "bg-slate-100"}`}>{item.cond}</span>
                  </div>
                  <span className={`text-xs font-bold ${item.turns >= 8 ? "text-emerald-600" : item.turns >= 5 ? "text-amber-600" : "text-red-600"}`}>{item.turns} turns/yr</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${turnPct >= 60 ? "bg-emerald-500" : turnPct >= 40 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${turnPct}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Qty: <span className="font-medium">{item.qty.toLocaleString()}</span></div>
                  <div>In Transit: <span className="font-medium">{item.inTransit}</span></div>
                  <div>Weight: <span className="font-medium">{item.weight}kg</span></div>
                  <div>Status: <span className={`font-medium ${statusColors[item.status] || "text-foreground"}`}>{item.status}</span></div>
                </div>
              </div>
            )})}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
