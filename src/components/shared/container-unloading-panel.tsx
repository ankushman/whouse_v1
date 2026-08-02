"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Container, PackageMinus, PackageOpen, AlertTriangle,
  MapPin, Activity, PackageSearch,
  ArrowDown, Layers, Scale, ThermometerSun
} from "lucide-react"

const raw = [
  { id: "CUL-01", container: "MSKU-7294815", vessel: "MSC Isabella", origin: "Shanghai", dc: "Nhava Sheva DC", type: "40ft HQ", status: "Unloading", eta: "28 Jul", startUnl: "29 Jul 06:00", estEnd: "29 Jul 10:30", unloaded: 65, totalPkgs: 2400, weight: 18500, temp: 22, hazmat: false, team: "Team A", crane: "Crane-03", damage: 0, progress: 27 },
  { id: "CUL-02", container: "TCLU-4182330", vessel: "CMA CGM Marco Polo", origin: "Rotterdam", dc: "Mundra DC", type: "20ft", status: "Completed", eta: "27 Jul", startUnl: "27 Jul 14:00", estEnd: "27 Jul 16:30", unloaded: 100, totalPkgs: 800, weight: 6200, temp: 18, hazmat: true, team: "Team B", crane: "Crane-01", damage: 2, progress: 100 },
  { id: "CUL-03", container: "HLXU-6520198", vessel: "Ever Given", origin: "Singapore", dc: "Chennai DC", type: "40ft", status: "Queued", eta: "30 Jul", startUnl: "\u2014", estEnd: "\u2014", unloaded: 0, totalPkgs: 3200, weight: 24000, temp: 25, hazmat: false, team: "Pending", crane: "Pending", damage: 0, progress: 0 },
  { id: "CUL-04", container: "BMOU-9014422", vessel: "Maersk Elba", origin: "Jebel Ali", dc: "Kandla DC", type: "20ft", status: "Delayed", eta: "29 Jul", startUnl: "\u2014", estEnd: "\u2014", unloaded: 0, totalPkgs: 650, weight: 4800, temp: 35, hazmat: false, team: "Team C", crane: "Crane-02", damage: 0, progress: 0 },
  { id: "CUL-05", container: "TEMU-3847561", vessel: "Cosco Pride", origin: "Busan", dc: "Visakhapatnam DC", type: "40ft HQ", status: "Unloading", eta: "28 Jul", startUnl: "29 Jul 07:30", estEnd: "29 Jul 12:00", unloaded: 42, totalPkgs: 1800, weight: 12000, temp: 20, hazmat: true, team: "Team A", crane: "Crane-04", damage: 0, progress: 23 },
  { id: "CUL-06", container: "FCIU-7723190", vessel: "Yang Ming Unity", origin: "Colombo", dc: "Nhava Sheva DC", type: "20ft", status: "Completed", eta: "26 Jul", startUnl: "26 Jul 09:00", estEnd: "26 Jul 11:15", unloaded: 100, totalPkgs: 920, weight: 7100, temp: 28, hazmat: false, team: "Team B", crane: "Crane-01", damage: 0, progress: 100 },
  { id: "CUL-07", container: "TRHU-2268437", vessel: "Hapag-Lloyd Express", origin: "Hamburg", dc: "Mundra DC", type: "40ft", status: "Inspection", eta: "28 Jul", startUnl: "29 Jul 08:00", estEnd: "\u2014", unloaded: 18, totalPkgs: 1500, weight: 11000, temp: 19, hazmat: false, team: "Team D", crane: "Crane-03", damage: 5, progress: 12 },
  { id: "CUL-08", container: "OOLU-5591284", vessel: "OOCL Japan", origin: "Tokyo", dc: "Chennai DC", type: "20ft", status: "Completed", eta: "25 Jul", startUnl: "25 Jul 11:00", estEnd: "25 Jul 13:45", unloaded: 100, totalPkgs: 740, weight: 5500, temp: 21, hazmat: true, team: "Team C", crane: "Crane-02", damage: 1, progress: 100 },
  { id: "CUL-09", container: "MSCU-8036952", vessel: "MSC Sveva", origin: "Felixstowe", dc: "Kolkata DC", type: "40ft HQ", status: "Unloading", eta: "29 Jul", startUnl: "29 Jul 09:00", estEnd: "29 Jul 14:30", unloaded: 55, totalPkgs: 2800, weight: 20000, temp: 24, hazmat: false, team: "Team D", crane: "Crane-04", damage: 0, progress: 20 },
  { id: "CUL-10", container: "CMAU-1472806", vessel: "CMA CGM Tigris", origin: "Port Klang", dc: "Tuticorin DC", type: "20ft", status: "Damage Report", eta: "27 Jul", startUnl: "28 Jul 06:30", estEnd: "28 Jul 09:00", unloaded: 100, totalPkgs: 580, weight: 4200, temp: 32, hazmat: false, team: "Team A", crane: "Crane-01", damage: 12, progress: 100 },
]

interface ContainerItem {
  id: string; container: string; vessel: string; origin: string; dc: string
  type: string; status: string; eta: string; startUnl: string; estEnd: string
  unloaded: number; totalPkgs: number; weight: number; temp: number
  hazmat: boolean; team: string; crane: string; damage: number; progress: number
}

const items: ContainerItem[] = raw.map((r: any) => ({
  id: r.id, container: r.container, vessel: r.vessel, origin: r.origin,
  dc: r.dc, type: r.type, status: r.status, eta: r.eta, startUnl: r.startUnl,
  estEnd: r.estEnd, unloaded: r.unloaded, totalPkgs: r.totalPkgs,
  weight: r.weight, temp: r.temp, hazmat: r.hazmat, team: r.team,
  crane: r.crane, damage: r.damage, progress: r.progress,
}))

const statusColors: Record<string, string> = {
  "Completed": "text-emerald-600", "Unloading": "text-blue-600",
  "Queued": "text-muted-foreground", "Delayed": "text-orange-600 font-semibold",
  "Inspection": "text-amber-600", "Damage Report": "text-red-600 font-semibold",
}

const types = [...new Set(items.map(i => i.type))]
const dcs = [...new Set(items.map(i => i.dc))]

type Rec = any
type FV = Record<string, string>
type VT = "containers" | "teams" | "damage"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`cul-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function ContainerUnloadingPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("containers")

  const filtered = items.filter((r) => {
    type Rec = any
    const p: FV = Object.assign({}, activeFilters)
    return Object.entries(p).every(([k, v]) => r[k as keyof Rec] === v)
  })

  const completedCount = items.filter(i => i.status === "Completed").length
  const activeCount = items.filter(i => i.status === "Unloading").length
  const totalPkgs = items.reduce((s, i) => s + i.totalPkgs, 0)
  const totalWeight = items.reduce((s, i) => s + i.weight, 0)
  const damageItems = items.filter(i => i.damage > 0)
  const totalDamage = items.reduce((s, i) => s + i.damage, 0)
  const avgProgress = (items.filter(i => i.progress > 0 && i.progress < 100).reduce((s, i) => s + i.progress, 0) / Math.max(1, items.filter(i => i.progress > 0 && i.progress < 100).length)).toFixed(0)

  const toggle = (k: string, nv: string | undefined) => {
    const n = Object.assign({}, activeFilters)
    if (nv === undefined) { delete n[k] } else { n[k] = nv }
    setActiveFilters(n)
  }

  const insights = [
    { icon: PackageMinus, title: "Unloaded", desc: `${completedCount}/${items.length} containers done`, accent: "text-emerald-500" },
    { icon: AlertTriangle, title: "Damage", desc: `${totalDamage} packages across ${damageItems.length} containers`, accent: "text-red-500" },
    { icon: Activity, title: "Active", desc: `${activeCount} containers unloading now`, accent: "text-blue-500" },
  ]

  const alerts = [
    ...items.filter(i => i.status === "Damage Report").map(i => ({ id: i.id, msg: `${i.container}: ${i.damage} damaged pkgs — inspection required`, severity: "critical" as const })),
    ...items.filter(i => i.status === "Delayed").map(i => ({ id: i.id, msg: `${i.container} from ${i.origin} — ETA delayed`, severity: "warning" as const })),
    ...items.filter(i => i.hazmat && i.status === "Unloading").map(i => ({ id: i.id, msg: `${i.container}: Hazmat cargo — safety protocols active`, severity: "info" as const })),
  ].slice(0, 5)

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-cyan-100 flex items-center justify-center"><Container className="h-4 w-4 text-cyan-600" /></div>
            <div><h3 className="text-sm font-bold">Container Unloading</h3><p className="text-xs opacity-60">{items.length} containers across {dcs.length} DCs</p></div>
          </div>
          <div className="flex gap-1">
            {(["containers", "teams", "damage"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "containers" ? "Containers" : v === "teams" ? "Teams" : "Damage"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Containers", String(items.length), Container, "bg-cyan-50/50")}
          {statCard("Total Pkgs", (totalPkgs / 1000).toFixed(1) + "K", PackageSearch, "bg-blue-50/50")}
          {statCard("Total Wt", (totalWeight / 1000).toFixed(1) + "T", Scale, "bg-amber-50/50")}
          {statCard("Active", String(activeCount), ArrowDown, "bg-emerald-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {types.map(t => {
            const active = activeFilters.type === t
            return <span key={t} onClick={() => toggle("type", active ? undefined : t)} className={`cul-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{t}</span>
          })}
          {activeFilters.type && <span onClick={() => toggle("type", undefined)} className="cul-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="cul-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="cul-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Active Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`cul-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "containers" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isDmg = item.status === "Damage Report"
              const isDelayed = item.status === "Delayed"
              const isInspection = item.status === "Inspection"
              return (
                <div key={item.id} className={`cul-item-card rounded-lg border p-2.5 bg-card ${isDmg ? "cul-dmg-pulse" : isDelayed ? "cul-delayed-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="cul-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted">{item.id}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold">{item.container}</span>
                        {item.hazmat && <span className="cul-hazmat text-[10px] px-1 py-0.5 rounded bg-orange-100 text-orange-700 font-medium">HAZ</span>}
                      </div>
                    </div>
                    <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><PackageOpen className="h-3 w-3 opacity-40" />{item.vessel}</div>
                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3 opacity-40" />{item.dc}</div>
                    <div className="flex items-center gap-1"><Layers className="h-3 w-3 opacity-40" />{item.type} from {item.origin}</div>
                    <div className="flex items-center gap-1"><ThermometerSun className="h-3 w-3 opacity-40" />{item.temp}\u00b0C ETA {item.eta}</div>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] w-14">Progress</span>
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden"><div className={`h-full rounded-full transition-all ${item.progress === 100 ? "bg-emerald-500" : item.progress > 50 ? "bg-blue-500" : item.progress > 0 ? "bg-amber-500" : "bg-muted-foreground/20"} ${item.progress > 0 && item.progress < 100 ? "cul-bar-progress" : ""}`} style={{ width: `${item.progress}%` }} /></div>
                    <span className="text-[10px] font-mono w-10 text-right">{item.progress}%</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-[10px] text-muted-foreground">
                    <div>Pkgs: <span className="font-medium text-foreground">{item.unloaded}/{item.totalPkgs}</span></div>
                    <div>Wt: <span className="font-medium text-foreground">{(item.weight / 1000).toFixed(1)}T</span></div>
                    <div>Team: <span className="font-medium text-foreground">{item.team}</span></div>
                    <div>Damage: <span className={`font-medium ${item.damage > 5 ? "text-red-500" : item.damage > 0 ? "text-amber-500" : "text-foreground"}`}>{item.damage}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "teams" && (
          <div className="space-y-2">
            {[...new Set(items.filter(i => i.team !== "Pending").map(i => i.team))].sort().map(team => {
              const teamItems = items.filter(i => i.team === team)
              const completed = teamItems.filter(i => i.status === "Completed").length
              const totalWt = teamItems.reduce((s, i) => s + i.weight, 0)
              const totalDmg = teamItems.reduce((s, i) => s + i.damage, 0)
              return (
                <div key={team} className="cul-team-card rounded-lg border p-2.5 bg-card">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold">{team}</span>
                    <span className="text-[10px] opacity-50">{teamItems.length} containers</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div className="cul-team-metric rounded-md bg-muted/30 p-1.5 text-center"><div className="font-bold text-sm">{completed}/{teamItems.length}</div><div className="opacity-50">Done</div></div>
                    <div className="cul-team-metric rounded-md bg-muted/30 p-1.5 text-center"><div className="font-bold text-sm">{(totalWt / 1000).toFixed(1)}T</div><div className="opacity-50">Weight</div></div>
                    <div className="cul-team-metric rounded-md bg-muted/30 p-1.5 text-center"><div className={`font-bold text-sm ${totalDmg > 0 ? "text-red-500" : "text-foreground"}`}>{totalDmg}</div><div className="opacity-50">Damage</div></div>
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {teamItems.map(ti => (
                      <div key={ti.id} className="flex items-center justify-between text-[10px]">
                        <span><span className="font-mono opacity-50">{ti.id}</span> {ti.container} <span className="opacity-40">({ti.type})</span></span>
                        <span className={statusColors[ti.status] || ""}>{ti.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "damage" && (
          <div className="space-y-2">
            <div className="cul-dmg-header rounded-lg border p-2 bg-red-50/30">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div><div className="text-lg font-bold text-red-600">{totalDamage}</div><div className="text-[10px] opacity-50">Total Damaged Pkgs</div></div>
                <div><div className="text-lg font-bold text-amber-600">{damageItems.length}</div><div className="text-[10px] opacity-50">Affected Containers</div></div>
              </div>
            </div>
            {items.filter(i => i.damage > 0).sort((a, b) => b.damage - a.damage).map(item => (
              <div key={item.id} className="cul-dmg-row rounded-lg border p-2 bg-card">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.container}</span>
                    <span className="text-[10px] opacity-50">{item.vessel}</span>
                  </div>
                  <span className={`text-xs font-mono font-bold ${item.damage > 10 ? "text-red-600" : "text-amber-600"}`}>{item.damage} pkgs</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-[10px] text-muted-foreground">
                  <div>DC: <span className="font-medium text-foreground">{item.dc}</span></div>
                  <div>Total: <span className="font-medium text-foreground">{item.totalPkgs} pkgs</span></div>
                  <div>Rate: <span className={`font-medium ${(item.damage / item.totalPkgs * 100) > 0.5 ? "text-red-500" : "text-amber-500"}`}>{(item.damage / item.totalPkgs * 100).toFixed(1)}%</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
