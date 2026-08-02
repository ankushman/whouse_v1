"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ScanBarcode, ArrowDown, CheckCircle,
  AlertTriangle, Layers, MapPin, Timer,
  RotateCcw, BarChart3, PackageSearch, BoxSelect
} from "lucide-react"

const raw = [
  { id: "APU-01", pallet: "PAL-4281", sku: "Parle-G 500g", qty: 500, zone: "Zone A-A1", aisle: "A-12", rack: "R3-L4", dc: "Mumbai DC-1", priority: "High", status: "Completed", method: "Directed", operator: "Rajesh K.", scanPct: 100, startTime: "08:12", endTime: "08:28", weight: 120, height: 1.8, cubeUtil: 92 },
  { id: "APU-02", pallet: "PAL-4282", sku: "Samsung M14 128GB", qty: 50, zone: "Zone B-B3", aisle: "B-07", rack: "R1-L2", dc: "Delhi DC-2", priority: "Critical", status: "In Progress", method: "Wave-Based", operator: "Amit S.", scanPct: 65, startTime: "08:45", endTime: "—", weight: 85, height: 1.2, cubeUtil: 78 },
  { id: "APU-03", pallet: "PAL-4283", sku: "Amul Butter 500g", qty: 300, zone: "Zone C-C2", aisle: "C-15", rack: "R5-L1", dc: "Bengaluru DC-3", priority: "Medium", status: "Queued", method: "System-Directed", operator: "Pending", scanPct: 0, startTime: "—", endTime: "—", weight: 200, height: 2.1, cubeUtil: 0 },
  { id: "APU-04", pallet: "PAL-4284", sku: "Nike Air Max 42", qty: 80, zone: "Zone D-D1", aisle: "D-03", rack: "R2-L3", dc: "Hyderabad DC-4", priority: "Low", status: "Failed", method: "Random", operator: "Sunil M.", scanPct: 30, startTime: "09:10", endTime: "09:22", weight: 45, height: 0.8, cubeUtil: 35 },
  { id: "APU-05", pallet: "PAL-4285", sku: "Dabur Chyawanprash 1kg", qty: 200, zone: "Zone A-A2", aisle: "A-09", rack: "R4-L2", dc: "Kolkata DC-5", priority: "High", status: "Completed", method: "Directed", operator: "Priya D.", scanPct: 100, startTime: "07:50", endTime: "08:05", weight: 180, height: 1.5, cubeUtil: 88 },
  { id: "APU-06", pallet: "PAL-4286", sku: "boAt Airdopes 141", qty: 120, zone: "Zone B-B1", aisle: "B-11", rack: "R6-L1", dc: "Chennai DC-6", priority: "Critical", status: "In Progress", method: "Wave-Based", operator: "Kumar V.", scanPct: 42, startTime: "09:30", endTime: "—", weight: 32, height: 0.6, cubeUtil: 42 },
  { id: "APU-07", pallet: "PAL-4287", sku: "Tata Salt 1kg", qty: 800, zone: "Zone E-E3", aisle: "E-06", rack: "R8-L3", dc: "Mumbai DC-1", priority: "Medium", status: "Completed", method: "System-Directed", operator: "Deepak R.", scanPct: 100, startTime: "06:30", endTime: "07:10", weight: 800, height: 2.4, cubeUtil: 95 },
  { id: "APU-08", pallet: "PAL-4288", sku: "Levi's 501 Jeans", qty: 40, zone: "Zone D-D2", aisle: "D-18", rack: "R1-L4", dc: "Delhi DC-2", priority: "Low", status: "On Hold", method: "Random", operator: "Pending", scanPct: 0, startTime: "—", endTime: "—", weight: 60, height: 1.0, cubeUtil: 0 },
  { id: "APU-09", pallet: "PAL-4289", sku: "IKEA KALLAX Shelf", qty: 15, zone: "Zone F-F1", aisle: "F-02", rack: "R2-L1", dc: "Bengaluru DC-3", priority: "High", status: "In Progress", method: "Directed", operator: "Manoj T.", scanPct: 88, startTime: "10:00", endTime: "—", weight: 350, height: 3.2, cubeUtil: 88 },
  { id: "APU-10", pallet: "PAL-4290", sku: "Noise ColorFit Pro", qty: 150, zone: "Zone B-B2", aisle: "B-04", rack: "R3-L2", dc: "Hyderabad DC-4", priority: "Medium", status: "Completed", method: "Wave-Based", operator: "Rahul G.", scanPct: 100, startTime: "09:00", endTime: "09:25", weight: 28, height: 0.5, cubeUtil: 90 },
]

interface PutawayItem {
  id: string; pallet: string; sku: string; qty: number; zone: string
  aisle: string; rack: string; dc: string; priority: string; status: string
  method: string; operator: string; scanPct: number; startTime: string
  endTime: string; weight: number; height: number; cubeUtil: number
}

const items: PutawayItem[] = raw.map((r: any) => ({
  id: r.id, pallet: r.pallet, sku: r.sku, qty: r.qty, zone: r.zone,
  aisle: r.aisle, rack: r.rack, dc: r.dc, priority: r.priority, status: r.status,
  method: r.method, operator: r.operator, scanPct: r.scanPct,
  startTime: r.startTime, endTime: r.endTime, weight: r.weight,
  height: r.height, cubeUtil: r.cubeUtil,
}))

const statusColors: Record<string, string> = {
  "Completed": "text-emerald-600", "In Progress": "text-blue-600",
  "Queued": "text-muted-foreground", "Failed": "text-red-600 font-semibold",
  "On Hold": "text-amber-600",
}
const priorityColors: Record<string, string> = {
  "Critical": "bg-red-100 text-red-700", "High": "bg-orange-100 text-orange-700",
  "Medium": "bg-blue-100 text-blue-700", "Low": "bg-gray-100 text-gray-600",
}

const methods = [...new Set(items.map(i => i.method))]
const dcs = [...new Set(items.map(i => i.dc))]

type Rec = any
type FV = Record<string, string>
type VT = "tasks" | "zones" | "operators"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`apu-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function AutomatedPutawayPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("tasks")

  const filtered = items.filter((r) => {
    type Rec = any
    const p: FV = Object.assign({}, activeFilters)
    return Object.entries(p).every(([k, v]) => r[k as keyof Rec] === v)
  })

  const completedCount = items.filter(i => i.status === "Completed").length
  const inProgressCount = items.filter(i => i.status === "In Progress").length
  const failedCount = items.filter(i => i.status === "Failed").length
  const avgCubeUtil = (items.filter(i => i.status === "Completed").reduce((s, i) => s + i.cubeUtil, 0) / Math.max(1, completedCount)).toFixed(0)
  const totalWeight = items.filter(i => i.status === "Completed").reduce((s, i) => s + i.weight, 0)
  const avgScanPct = (items.filter(i => i.scanPct > 0).reduce((s, i) => s + i.scanPct, 0) / Math.max(1, items.filter(i => i.scanPct > 0).length)).toFixed(0)

  const toggle = (k: string, nv: string | undefined) => {
    const n = Object.assign({}, activeFilters)
    if (nv === undefined) { delete n[k] } else { n[k] = nv }
    setActiveFilters(n)
  }

  const insights = [
    { icon: CheckCircle, title: "Completed", desc: `${completedCount}/${items.length} tasks done today`, accent: "text-emerald-500" },
    { icon: AlertTriangle, title: "Failed", desc: `${failedCount} tasks need attention`, accent: "text-red-500" },
    { icon: BarChart3, title: "Cube Util", desc: `${avgCubeUtil}% avg for completed`, accent: "text-blue-500" },
  ]

  const holdItems = items.filter(i => i.status === "On Hold")
  const failedItems = items.filter(i => i.status === "Failed")

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-teal-100 flex items-center justify-center"><ArrowDown className="h-4 w-4 text-teal-600" /></div>
            <div><h3 className="text-sm font-bold">Automated Putaway</h3><p className="text-xs opacity-60">{items.length} tasks across {dcs.length} DCs</p></div>
          </div>
          <div className="flex gap-1">
            {(["tasks", "zones", "operators"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "tasks" ? "Tasks" : v === "zones" ? "Zones" : "Operators"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Total Tasks", String(items.length), PackageSearch, "bg-teal-50/50")}
          {statCard("In Progress", String(inProgressCount), RotateCcw, "bg-blue-50/50")}
          {statCard("Avg Scan", `${avgScanPct}%`, ScanBarcode, "bg-amber-50/50")}
          {statCard("Cube Util", `${avgCubeUtil}%`, BoxSelect, "bg-emerald-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {methods.map(m => {
            const active = activeFilters.method === m
            return <span key={m} onClick={() => toggle("method", active ? undefined : m)} className={`apu-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{m}</span>
          })}
          {activeFilters.method && <span onClick={() => toggle("method", undefined)} className="apu-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="apu-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {(failedItems.length > 0 || holdItems.length > 0) && (
          <div className="apu-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Exceptions ({failedItems.length + holdItems.length})</div>
            {failedItems.map(fi => (
              <div key={fi.id} className="flex items-start gap-1.5 text-[10px]">
                <span className="apu-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 bg-red-500" />
                <span><span className="font-mono opacity-60">{fi.id}</span> {fi.sku} — failed at {fi.scanPct}% scan ({fi.zone})</span>
              </div>
            ))}
            {holdItems.map(hi => (
              <div key={hi.id} className="flex items-start gap-1.5 text-[10px]">
                <span className="apu-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 bg-amber-500" />
                <span><span className="font-mono opacity-60">{hi.id}</span> {hi.sku} — on hold, awaiting slot confirmation</span>
              </div>
            ))}
          </div>
        )}

        {view === "tasks" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isFailed = item.status === "Failed"
              const isProgress = item.status === "In Progress"
              const isHold = item.status === "On Hold"
              return (
                <div key={item.id} className={`apu-task-card rounded-lg border p-2.5 bg-card ${isFailed ? "apu-failed-pulse" : isHold ? "apu-hold-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="apu-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted">{item.id}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold">{item.pallet}</span>
                        <span className="text-[10px] opacity-50">{item.sku}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`apu-priority text-[10px] px-1.5 py-0.5 rounded font-medium ${priorityColors[item.priority] || "bg-muted"}`}>{item.priority}</span>
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3 opacity-40" />{item.zone} / {item.aisle}</div>
                    <div className="flex items-center gap-1"><Layers className="h-3 w-3 opacity-40" />{item.rack} ({item.method})</div>
                    <div className="flex items-center gap-1"><PackageSearch className="h-3 w-3 opacity-40" />Qty: {item.qty} units</div>
                    <div className="flex items-center gap-1"><Timer className="h-3 w-3 opacity-40" />{item.startTime} {item.endTime !== "\u2014" ? `\u2192 ${item.endTime}` : ""}</div>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] w-12">Scan</span>
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden"><div className={`h-full rounded-full transition-all ${item.scanPct === 100 ? "bg-emerald-500" : isProgress ? "bg-blue-500 apu-bar-progress" : item.scanPct > 0 ? "bg-amber-500" : "bg-muted-foreground/20"}`} style={{ width: `${item.scanPct}%` }} /></div>
                    <span className="text-[10px] font-mono w-10 text-right">{item.scanPct}%</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] w-12">Cube</span>
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden"><div className={`h-full rounded-full transition-all ${item.cubeUtil > 85 ? "bg-emerald-500" : item.cubeUtil > 50 ? "bg-amber-500" : "bg-muted-foreground/20"}`} style={{ width: `${item.cubeUtil}%` }} /></div>
                    <span className="text-[10px] font-mono w-10 text-right">{item.cubeUtil}%</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[10px] text-muted-foreground">
                    <div>Operator: <span className="font-medium text-foreground">{item.operator}</span></div>
                    <div>Weight: <span className="font-medium text-foreground">{item.weight}kg</span></div>
                    <div>Height: <span className="font-medium text-foreground">{item.height}m</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "zones" && (
          <div className="space-y-2">
            {[...new Set(items.map(i => i.zone))].sort().map(zone => {
              const zoneItems = items.filter(i => i.zone === zone)
              const zoneCompleted = zoneItems.filter(i => i.status === "Completed").length
              const zoneUtil = zoneItems.reduce((s, i) => s + i.cubeUtil, 0) / Math.max(1, zoneItems.length)
              return (
                <div key={zone} className="apu-zone-card rounded-lg border p-2.5 bg-card">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="apu-zone-dot h-2 w-2 rounded-full" style={{ backgroundColor: zoneUtil > 80 ? "#10b981" : zoneUtil > 50 ? "#f59e0b" : "#94a3b8" }} />
                      <span className="text-xs font-semibold">{zone}</span>
                      <span className="text-[10px] opacity-50">({zoneItems.length} tasks)</span>
                    </div>
                    <span className="text-[10px]">{zoneCompleted}/{zoneItems.length} done</span>
                  </div>
                  <div className="space-y-0.5 mb-1">
                    {zoneItems.map(zi => (
                      <div key={zi.id} className="flex items-center justify-between text-[10px]">
                        <span className="flex items-center gap-1.5"><span className="font-mono opacity-50">{zi.id}</span>{zi.pallet}</span>
                        <span className={statusColors[zi.status] || ""}>{zi.status}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">Cube Util</span>
                    <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(100, zoneUtil)}%` }} /></div>
                    <span className="text-[10px] font-mono">{zoneUtil.toFixed(0)}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "operators" && (
          <div className="space-y-2">
            {[...new Set(items.filter(i => i.operator !== "Pending").map(i => i.operator))].sort().map(op => {
              const opItems = items.filter(i => i.operator === op)
              const opCompleted = opItems.filter(i => i.status === "Completed").length
              const opAvgScan = opItems.reduce((s, i) => s + i.scanPct, 0) / Math.max(1, opItems.length)
              const opWeight = opItems.reduce((s, i) => s + i.weight, 0)
              return (
                <div key={op} className="apu-op-card rounded-lg border p-2.5 bg-card">
                  <div className="flex items-center justify-between mb-1.5">
                    <div><span className="text-xs font-semibold">{op}</span><span className="text-[10px] opacity-50 ml-1.5">{opItems.length} tasks</span></div>
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="text-emerald-600">{opCompleted} done</span>
                      <span className="opacity-50">|</span>
                      <span>\u20b9{opWeight}kg</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div className="apu-op-metric rounded-md bg-muted/30 p-1.5 text-center"><div className="font-bold text-sm">{opCompleted}/{opItems.length}</div><div className="opacity-50">Completed</div></div>
                    <div className="apu-op-metric rounded-md bg-muted/30 p-1.5 text-center"><div className="font-bold text-sm">{opAvgScan.toFixed(0)}%</div><div className="opacity-50">Avg Scan</div></div>
                    <div className="apu-op-metric rounded-md bg-muted/30 p-1.5 text-center"><div className="font-bold text-sm">{(opWeight / opItems.length).toFixed(0)}kg</div><div className="opacity-50">Avg Weight</div></div>
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {opItems.map(oi => (
                      <div key={oi.id} className="flex items-center justify-between text-[10px]">
                        <span><span className="font-mono opacity-50">{oi.id}</span> {oi.sku}</span>
                        <span className={statusColors[oi.status] || ""}>{oi.status}</span>
                      </div>
                    ))}
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
