"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Waypoints, Route, MapPin, Target,
  Timer, Clock, AlertTriangle, CheckCircle,
  TrendingUp, Activity, PackageSearch,
  Package, Footprints, GitBranch
} from "lucide-react"

const raw = [
  { id: "PPO-01", batch: "BTH-2101", picker: "Vikram J.", dc: "Mumbai DC-1", zone: "Zone A", picks: 45, items: 120, distance: 340, time: 38, optimDist: 280, savedDist: 60, pathStatus: "Optimized", pickRate: 3.2, accuracy: 99.2, method: "S-Shape", startTime: "08:00", endTime: "08:38", routeComplexity: "High" },
  { id: "PPO-02", batch: "BTH-2102", picker: "Suresh P.", dc: "Delhi DC-2", zone: "Zone B", picks: 62, items: 180, distance: 520, time: 55, optimDist: 390, savedDist: 130, pathStatus: "Optimized", pickRate: 3.3, accuracy: 98.8, method: "Largest Gap", startTime: "08:15", endTime: "09:10", routeComplexity: "Very High" },
  { id: "PPO-03", batch: "BTH-2103", picker: "Kavitha R.", dc: "Bengaluru DC-3", zone: "Zone C", picks: 28, items: 65, distance: 180, time: 22, optimDist: 150, savedDist: 30, pathStatus: "In Progress", pickRate: 3.0, accuracy: 99.5, method: "Midpoint", startTime: "08:30", endTime: "\u2014", routeComplexity: "Medium" },
  { id: "PPO-04", batch: "BTH-2104", picker: "Arjun M.", dc: "Hyderabad DC-4", zone: "Zone D", picks: 55, items: 145, distance: 480, time: 50, optimDist: 480, savedDist: 0, pathStatus: "Not Optimized", pickRate: 2.9, accuracy: 97.5, method: "Traverse", startTime: "08:45", endTime: "09:35", routeComplexity: "High" },
  { id: "PPO-05", batch: "BTH-2105", picker: "Divya S.", dc: "Kolkata DC-5", zone: "Zone E", picks: 38, items: 95, distance: 260, time: 30, optimDist: 210, savedDist: 50, pathStatus: "Optimized", pickRate: 3.2, accuracy: 99.8, method: "S-Shape", startTime: "09:00", endTime: "09:30", routeComplexity: "Low" },
  { id: "PPO-06", batch: "BTH-2106", picker: "Ramesh K.", dc: "Chennai DC-6", zone: "Zone A", picks: 70, items: 210, distance: 600, time: 68, optimDist: 420, savedDist: 180, pathStatus: "Optimized", pickRate: 3.1, accuracy: 98.2, method: "Combined", startTime: "09:15", endTime: "10:23", routeComplexity: "Very High" },
  { id: "PPO-07", batch: "BTH-2107", picker: "Anita D.", dc: "Mumbai DC-1", zone: "Zone F", picks: 15, items: 40, distance: 90, time: 12, optimDist: 90, savedDist: 0, pathStatus: "Failed", pickRate: 1.3, accuracy: 92.0, method: "S-Shape", startTime: "09:30", endTime: "09:42", routeComplexity: "Low" },
  { id: "PPO-08", batch: "BTH-2108", picker: "Nitin T.", dc: "Delhi DC-2", zone: "Zone B", picks: 50, items: 130, distance: 400, time: 42, optimDist: 340, savedDist: 60, pathStatus: "Optimized", pickRate: 3.1, accuracy: 99.0, method: "Largest Gap", startTime: "09:45", endTime: "10:27", routeComplexity: "Medium" },
  { id: "PPO-09", batch: "BTH-2109", picker: "Pooja V.", dc: "Bengaluru DC-3", zone: "Zone D", picks: 42, items: 110, distance: 350, time: 38, optimDist: 260, savedDist: 90, pathStatus: "In Progress", pickRate: 2.9, accuracy: 99.3, method: "Midpoint", startTime: "10:00", endTime: "\u2014", routeComplexity: "High" },
  { id: "PPO-10", batch: "BTH-2110", picker: "Sanjay G.", dc: "Hyderabad DC-4", zone: "Zone E", picks: 33, items: 85, distance: 220, time: 25, optimDist: 180, savedDist: 40, pathStatus: "Optimized", pickRate: 3.4, accuracy: 99.7, method: "Combined", startTime: "10:15", endTime: "10:40", routeComplexity: "Medium" },
]

interface PickPathItem {
  id: string; batch: string; picker: string; dc: string; zone: string
  picks: number; items: number; distance: number; time: number
  optimDist: number; savedDist: number; pathStatus: string; pickRate: number
  accuracy: number; method: string; startTime: string; endTime: string
  routeComplexity: string
}

const paths: PickPathItem[] = raw.map((r: any) => ({
  id: r.id, batch: r.batch, picker: r.picker, dc: r.dc, zone: r.zone,
  picks: r.picks, items: r.items, distance: r.distance, time: r.time,
  optimDist: r.optimDist, savedDist: r.savedDist, pathStatus: r.pathStatus,
  pickRate: r.pickRate, accuracy: r.accuracy, method: r.method,
  startTime: r.startTime, endTime: r.endTime, routeComplexity: r.routeComplexity,
}))

const statusColors: Record<string, string> = {
  "Optimized": "text-emerald-600", "In Progress": "text-blue-600",
  "Not Optimized": "text-amber-600 font-semibold", "Failed": "text-red-600 font-semibold",
}
const complexityColors: Record<string, string> = {
  "Very High": "bg-red-100 text-red-700", "High": "bg-orange-100 text-orange-700",
  "Medium": "bg-blue-100 text-blue-700", "Low": "bg-gray-100 text-gray-600",
}

const methods = [...new Set(paths.map(p => p.method))]
const zones = [...new Set(paths.map(p => p.zone))]
const dcs = [...new Set(paths.map(p => p.dc))]

type Rec = any
type FV = Record<string, string>
type VT = "paths" | "methods" | "efficiency"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`ppo-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function PickPathOptimizerPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("paths")

  const filtered = paths.filter((r) => {
    type Rec = any
    const p: FV = Object.assign({}, activeFilters)
    return Object.entries(p).every(([k, v]) => r[k as keyof Rec] === v)
  })

  const optimizedCount = paths.filter(p => p.pathStatus === "Optimized").length
  const totalSaved = paths.reduce((s, p) => s + p.savedDist, 0)
  const avgPickRate = (paths.reduce((s, p) => s + p.pickRate, 0) / paths.length).toFixed(1)
  const avgAccuracy = (paths.reduce((s, p) => s + p.accuracy, 0) / paths.length).toFixed(1)
  const failedPaths = paths.filter(p => p.pathStatus === "Failed")
  const notOptPaths = paths.filter(p => p.pathStatus === "Not Optimized")

  const toggle = (k: string, nv: string | undefined) => {
    const n = Object.assign({}, activeFilters)
    if (nv === undefined) { delete n[k] } else { n[k] = nv }
    setActiveFilters(n)
  }

  const insights = [
    { icon: TrendingUp, title: "Distance Saved", desc: `${totalSaved}m saved across ${optimizedCount} optimized`, accent: "text-emerald-500" },
    { icon: Activity, title: "Avg Pick Rate", desc: `${avgPickRate} picks/min across all batches`, accent: "text-blue-500" },
    { icon: Target, title: "Accuracy", desc: `${avgAccuracy}% avg scan accuracy`, accent: "text-violet-500" },
  ]

  const alerts = [
    ...failedPaths.map(p => ({ id: p.id, msg: `${p.batch} by ${p.picker} failed — accuracy ${p.accuracy}%`, severity: "critical" as const })),
    ...notOptPaths.map(p => ({ id: p.id, msg: `${p.batch} not yet optimized — ${p.savedDist}m potential savings`, severity: "warning" as const })),
  ].slice(0, 5)

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center"><Waypoints className="h-4 w-4 text-indigo-600" /></div>
            <div><h3 className="text-sm font-bold">Pick Path Optimizer</h3><p className="text-xs opacity-60">{paths.length} batches across {dcs.length} DCs</p></div>
          </div>
          <div className="flex gap-1">
            {(["paths", "methods", "efficiency"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "paths" ? "Paths" : v === "methods" ? "Methods" : "Efficiency"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Batches", String(paths.length), PackageSearch, "bg-indigo-50/50")}
          {statCard("Optimized", String(optimizedCount), CheckCircle, "bg-emerald-50/50")}
          {statCard("Saved", `${totalSaved}m`, Route, "bg-blue-50/50")}
          {statCard("Avg Rate", `${avgPickRate}/m`, Timer, "bg-amber-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {methods.map(m => {
            const active = activeFilters.method === m
            return <span key={m} onClick={() => toggle("method", active ? undefined : m)} className={`ppo-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{m}</span>
          })}
          {activeFilters.method && <span onClick={() => toggle("method", undefined)} className="ppo-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="ppo-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="ppo-alerts-list rounded-lg border border-amber-200/50 bg-amber-50/20 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-amber-700 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Path Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`ppo-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : "bg-amber-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "paths" && (
          <div className="space-y-1.5">
            {filtered.map(path => {
              const distSavedPct = path.distance > 0 ? (path.savedDist / path.distance * 100) : 0
              const isFailed = path.pathStatus === "Failed"
              const isNotOpt = path.pathStatus === "Not Optimized"
              const isInProgress = path.pathStatus === "In Progress"
              return (
                <div key={path.id} className={`ppo-path-card rounded-lg border p-2.5 bg-card ${isFailed ? "ppo-failed-pulse" : isNotOpt ? "ppo-notopt-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="ppo-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted">{path.id}</span>
                      <div className="flex items-center gap-1.5">
                        <Footprints className={`h-3.5 w-3.5 ${path.pathStatus === "Optimized" ? "text-emerald-500" : path.pathStatus === "In Progress" ? "text-blue-500" : "text-amber-500"}`} />
                        <span className="text-xs font-semibold">{path.batch}</span>
                        <span className="text-[10px] opacity-50">{path.picker}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`ppo-complexity text-[10px] px-1.5 py-0.5 rounded font-medium ${complexityColors[path.routeComplexity] || "bg-muted"}`}>{path.routeComplexity}</span>
                      <span className={`text-[10px] ${statusColors[path.pathStatus] || "text-muted-foreground"}`}>{path.pathStatus}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3 opacity-40" />{path.zone}, {path.dc}</div>
                    <div className="flex items-center gap-1"><GitBranch className="h-3 w-3 opacity-40" />{path.method} Strategy</div>
                    <div className="flex items-center gap-1"><Package className="h-3 w-3 opacity-40" />{path.picks} picks / {path.items} items</div>
                    <div className="flex items-center gap-1"><Clock className="h-3 w-3 opacity-40" />{path.startTime} {path.endTime !== "\u2014" ? `\u2192 ${path.endTime}` : ""}</div>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] w-14">Distance</span>
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${path.optimDist > 0 ? Math.min(100, (path.optimDist / path.distance) * 100) : 100}%` }} />
                    </div>
                    <span className="text-[10px] font-mono w-16 text-right">{path.optimDist}m/{path.distance}m</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] w-14">Accuracy</span>
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden"><div className={`h-full rounded-full transition-all ${path.accuracy > 99 ? "bg-emerald-500" : path.accuracy > 97 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${path.accuracy}%` }} /></div>
                    <span className="text-[10px] font-mono w-10 text-right">{path.accuracy}%</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-[10px] text-muted-foreground">
                    <div>Saved: <span className={`font-medium ${distSavedPct > 15 ? "text-emerald-500" : distSavedPct > 0 ? "text-amber-500" : "text-muted-foreground"}`}>{path.savedDist}m</span></div>
                    <div>Rate: <span className="font-medium text-foreground">{path.pickRate}/m</span></div>
                    <div>Time: <span className="font-medium text-foreground">{path.time}min</span></div>
                    <div>Pick/m: <span className="font-medium text-foreground">{(path.picks / Math.max(1, path.time)).toFixed(1)}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "methods" && (
          <div className="space-y-2">
            {methods.map(meth => {
              const methPaths = paths.filter(p => p.method === meth)
              const methAvgSaved = methPaths.reduce((s, p) => s + p.savedDist, 0)
              const methAvgRate = methPaths.reduce((s, p) => s + p.pickRate, 0) / methPaths.length
              const methAvgAcc = methPaths.reduce((s, p) => s + p.accuracy, 0) / methPaths.length
              return (
                <div key={meth} className="ppo-method-card rounded-lg border p-2.5 bg-card">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4 text-indigo-500" />
                      <span className="text-xs font-semibold">{meth}</span>
                    </div>
                    <span className="text-[10px] opacity-50">{methPaths.length} batches</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px]">
                    <div className="ppo-method-metric rounded-md bg-muted/30 p-1.5 text-center"><div className="font-bold text-sm">{methAvgSaved}m</div><div className="opacity-50">Saved</div></div>
                    <div className="ppo-method-metric rounded-md bg-muted/30 p-1.5 text-center"><div className="font-bold text-sm">{methAvgRate.toFixed(1)}</div><div className="opacity-50">Pick/m</div></div>
                    <div className="ppo-method-metric rounded-md bg-muted/30 p-1.5 text-center"><div className="font-bold text-sm">{methAvgAcc.toFixed(1)}%</div><div className="opacity-50">Accuracy</div></div>
                    <div className="ppo-method-metric rounded-md bg-muted/30 p-1.5 text-center"><div className="font-bold text-sm">{methPaths.reduce((s, p) => s + p.picks, 0)}</div><div className="opacity-50">Total Picks</div></div>
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {methPaths.map(mp => (
                      <div key={mp.id} className="flex items-center justify-between text-[10px]">
                        <span className="flex items-center gap-1.5"><span className="font-mono opacity-50">{mp.id}</span>{mp.batch} <span className="opacity-40">({mp.zone})</span></span>
                        <span className={statusColors[mp.pathStatus] || ""}>{mp.pathStatus}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "efficiency" && (
          <div className="space-y-2">
            <div className="ppo-eff-header rounded-lg border p-2 bg-muted/20">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{totalSaved}m</div><div className="text-[10px] opacity-50">Total Distance Saved</div></div>
                <div><div className="text-lg font-bold text-blue-600">{avgPickRate}/m</div><div className="text-[10px] opacity-50">Avg Pick Rate</div></div>
                <div><div className="text-lg font-bold text-violet-600">{avgAccuracy}%</div><div className="text-[10px] opacity-50">Avg Accuracy</div></div>
              </div>
            </div>
            {paths.filter(p => p.pathStatus === "Optimized").sort((a, b) => b.savedDist - a.savedDist).map(path => (
              <div key={path.id} className="ppo-eff-row rounded-lg border p-2 bg-card">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{path.id}</span>
                    <span className="text-xs font-semibold">{path.batch}</span>
                    <span className="text-[10px] opacity-50">{path.picker}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-600">-{path.savedDist}m ({(path.savedDist / path.distance * 100).toFixed(0)}%)</span>
                </div>
                <div className="grid grid-cols-4 gap-1 text-[10px] text-muted-foreground">
                  <div>Original: <span className="font-medium text-foreground">{path.distance}m</span></div>
                  <div>Optimized: <span className="font-medium text-foreground">{path.optimDist}m</span></div>
                  <div>Time: <span className="font-medium text-foreground">{path.time}min</span></div>
                  <div>Method: <span className="font-medium text-foreground">{path.method}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
