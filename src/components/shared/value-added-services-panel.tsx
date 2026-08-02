"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Layers,
  CheckCircle, AlertTriangle, Timer,
  RefreshCw, BarChart3, Star, IndianRupee,
  Activity
} from "lucide-react"

const raw = [
  { id: "VAS-01", service: "Kitting", dc: "Mumbai DC-1", sku: "Parle-G Combo 6-Pack", qty: 5000, completed: 4850, target: 5000, cost: 12500, revenue: 24000, sla: "02:00 PM", status: "In Progress", operator: "Team Alpha", priority: "High", started: "09:30 AM", eta: "01:45 PM", method: "Manual", defectRate: 0.2 },
  { id: "VAS-02", service: "Labeling", dc: "Delhi DC-2", sku: "Samsung M14 IMEI", qty: 3000, completed: 3000, target: 3000, cost: 4500, revenue: 12000, sla: "11:00 AM", status: "Completed", operator: "Team Beta", priority: "Critical", started: "07:00 AM", eta: "\u2014", method: "Auto-Semi", defectRate: 0.1 },
  { id: "VAS-03", service: "Gift Wrapping", dc: "Bengaluru DC-3", sku: "Diwali Gift Box", qty: 2000, completed: 1400, target: 2000, cost: 18000, revenue: 45000, sla: "04:00 PM", status: "In Progress", operator: "Team Gamma", priority: "Medium", started: "10:00 AM", eta: "03:30 PM", method: "Manual", defectRate: 0.5 },
  { id: "VAS-04", service: "Price Tagging", dc: "Kolkata DC-5", sku: "Levi's 501 MRP", qty: 800, completed: 800, target: 800, cost: 1200, revenue: 3200, sla: "12:00 PM", status: "Completed", operator: "Team Delta", priority: "Low", started: "08:00 AM", eta: "\u2014", method: "Auto", defectRate: 0 },
  { id: "VAS-05", service: "Quality Rework", dc: "Chennai DC-6", sku: "Nike Air Max QC", qty: 350, completed: 120, target: 350, cost: 8750, revenue: 14000, sla: "05:00 PM", status: "Delayed", operator: "Team Alpha", priority: "High", started: "09:00 AM", eta: "06:15 PM", method: "Manual", defectRate: 1.8 },
  { id: "VAS-06", service: "Shrink Wrapping", dc: "Hyderabad DC-4", sku: "boAt Airdopes 3-Pack", qty: 6000, completed: 6000, target: 6000, cost: 6000, revenue: 18000, sla: "10:00 AM", status: "Completed", operator: "Team Epsilon", priority: "Medium", started: "06:30 AM", eta: "\u2014", method: "Auto", defectRate: 0.05 },
  { id: "VAS-07", service: "Returns Refurbishment", dc: "Mumbai DC-1", sku: "IKEA KALLAX Re-pack", qty: 450, completed: 0, target: 450, cost: 15750, revenue: 27000, sla: "03:00 PM", status: "Queued", operator: "Team Beta", priority: "High", started: "\u2014", eta: "02:30 PM", method: "Manual", defectRate: 0 },
  { id: "VAS-08", service: "Palletization", dc: "Delhi DC-2", sku: "Tata Salt 48-Case", qty: 1200, completed: 980, target: 1200, cost: 3600, revenue: 8400, sla: "01:00 PM", status: "In Progress", operator: "Team Gamma", priority: "Medium", started: "08:15 AM", eta: "12:45 PM", method: "Semi-Auto", defectRate: 0.3 },
  { id: "VAS-09", service: "Custom Packaging", dc: "Bengaluru DC-3", sku: "Dabur Premium Box", qty: 1500, completed: 1500, target: 1500, cost: 10500, revenue: 30000, sla: "11:30 AM", status: "Completed", operator: "Team Delta", priority: "High", started: "07:15 AM", eta: "\u2014", method: "Manual", defectRate: 0.1 },
  { id: "VAS-10", service: "Serial Stamping", dc: "Kolkata DC-5", sku: "Noise ColorFit S/N", qty: 4000, completed: 2800, target: 4000, cost: 5200, revenue: 16000, sla: "02:30 PM", status: "In Progress", operator: "Team Epsilon", priority: "Critical", started: "09:45 AM", eta: "02:00 PM", method: "Auto-Semi", defectRate: 0.08 },
]

interface VASItem {
  id: string; service: string; dc: string; sku: string; qty: number
  completed: number; target: number; cost: number; revenue: number
  sla: string; status: string; operator: string; priority: string
  started: string; eta: string; method: string; defectRate: number
}

const items: VASItem[] = raw.map((r: any) => ({
  id: r.id, service: r.service, dc: r.dc, sku: r.sku, qty: r.qty,
  completed: r.completed, target: r.target, cost: r.cost, revenue: r.revenue,
  sla: r.sla, status: r.status, operator: r.operator, priority: r.priority,
  started: r.started, eta: r.eta, method: r.method, defectRate: r.defectRate,
}))

const statusColors: Record<string, string> = {
  "Completed": "text-emerald-600", "In Progress": "text-blue-600",
  "Queued": "text-muted-foreground", "Delayed": "text-red-600 font-semibold",
}
const priorityColors: Record<string, string> = {
  "Critical": "bg-red-100 text-red-700", "High": "bg-amber-100 text-amber-700",
  "Medium": "bg-blue-100 text-blue-700", "Low": "bg-slate-100 text-slate-600",
}
const serviceNames = [...new Set(items.map(i => i.service))]
const dcNames = [...new Set(items.map(i => i.dc))]

type Rec = any
type FV = Record<string, string>
type VT = "services" | "operators" | "profitability"

function fmtINR(n: number) { if (n >= 10000000) return `\u20b9${(n / 10000000).toFixed(1)}Cr`; if (n >= 100000) return `\u20b9${(n / 100000).toFixed(1)}L`; return `\u20b9${(n / 1000).toFixed(1)}K` }

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`vas-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function ValueAddedServicesPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("services")

  const filtered = items.filter((r) => {
    type Rec = any
    const p: FV = Object.assign({}, activeFilters)
    return Object.entries(p).every(([k, v]) => r[k as keyof Rec] === v)
  })

  const completed = items.filter(i => i.status === "Completed").length
  const inProgress = items.filter(i => i.status === "In Progress").length
  const delayed = items.filter(i => i.status === "Delayed").length
  const totalRevenue = items.reduce((s, i) => s + i.revenue, 0)
  const totalCost = items.reduce((s, i) => s + i.cost, 0)
  const margin = (((totalRevenue - totalCost) / totalRevenue) * 100).toFixed(1)
  const totalCompleted = items.reduce((s, i) => s + i.completed, 0)
  const totalQty = items.reduce((s, i) => s + i.qty, 0)
  const overallProgress = ((totalCompleted / totalQty) * 100).toFixed(0)

  const toggle = (k: string, nv: string | undefined) => {
    const n = Object.assign({}, activeFilters)
    if (nv === undefined) { delete n[k] } else { n[k] = nv }
    setActiveFilters(n)
  }

  const insights = [
    { icon: Star, title: "Margin", desc: `${margin}% profit margin overall`, accent: "text-emerald-500" },
    { icon: Activity, title: "Progress", desc: `${overallProgress}% across all tasks`, accent: "text-blue-500" },
    { icon: IndianRupee, title: "Revenue", desc: `${fmtINR(totalRevenue)} total value-add`, accent: "text-amber-500" },
  ]

  const alerts = [
    ...items.filter(i => i.status === "Delayed").map(i => ({ id: i.id, msg: `${i.service} (${i.sku}) delayed — ETA ${i.eta}`, severity: "critical" as const })),
    ...items.filter(i => i.defectRate > 1).map(i => ({ id: i.id, msg: `${i.service} ${i.id}: Defect rate ${i.defectRate}% exceeds 1% threshold`, severity: "warning" as const })),
    ...items.filter(i => i.status === "Queued").map(i => ({ id: i.id, msg: `${i.service} (${i.sku}) queued — awaiting operator`, severity: "info" as const })),
  ].slice(0, 5)

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-violet-100 flex items-center justify-center"><Layers className="h-4 w-4 text-violet-600" /></div>
            <div><h3 className="text-sm font-bold">Value-Added Services</h3><p className="text-xs opacity-60">{items.length} tasks | {serviceNames.length} service types</p></div>
          </div>
          <div className="flex gap-1">
            {(["services", "operators", "profitability"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "services" ? "Services" : v === "operators" ? "Operators" : "Profit"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Completed", String(completed), CheckCircle, "bg-emerald-50/50")}
          {statCard("In Progress", String(inProgress), RefreshCw, "bg-blue-50/50")}
          {statCard("Delayed", String(delayed), AlertTriangle, "bg-red-50/50")}
          {statCard("Progress", `${overallProgress}%`, BarChart3, "bg-violet-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {serviceNames.map(s => {
            const active = activeFilters.service === s
            return <span key={s} onClick={() => toggle("service", active ? undefined : s)} className={`vas-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{s}</span>
          })}
          {dcNames.map(d => {
            const active = activeFilters.dc === d
            return <span key={d} onClick={() => toggle("dc", active ? undefined : d)} className={`vas-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{d.split(" ")[0]}</span>
          })}
          {(activeFilters.service || activeFilters.dc) && <span onClick={() => setActiveFilters({})} className="vas-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="vas-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="vas-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />VAS Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`vas-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "services" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isDelayed = item.status === "Delayed"
              const progress = ((item.completed / item.target) * 100).toFixed(0)
              const profit = item.revenue - item.cost
              return (
                <div key={item.id} className={`vas-service-card rounded-lg border p-2.5 bg-card ${isDelayed ? "vas-delayed-pulse" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="vas-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-100 text-violet-700">{item.id}</span>
                      <span className="text-xs font-semibold">{item.service}</span>
                      <span className={`vas-priority-tag text-[10px] px-1.5 py-0.5 rounded ${priorityColors[item.priority] || "bg-slate-100"}`}>{item.priority}</span>
                    </div>
                    <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                  </div>
                  <div className="text-[11px] opacity-70 mb-1">{item.sku} | {item.dc}</div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div className={`vas-progress-bar h-full rounded-full transition-all ${Number(progress) >= 100 ? "bg-emerald-500" : Number(progress) >= 50 ? "bg-blue-500" : "bg-amber-500"}`} style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-[10px] font-mono font-medium w-8 text-right">{progress}%</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div>{item.completed}/{item.target}</div>
                    <div>Cost: <span className="font-medium text-foreground">{fmtINR(item.cost)}</span></div>
                    <div>Rev: <span className="font-medium text-emerald-600">{fmtINR(item.revenue)}</span></div>
                    <div>Profit: <span className={`font-medium ${profit > 0 ? "text-emerald-600" : "text-red-600"}`}>{fmtINR(profit)}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "operators" && (
          <div className="space-y-2">
            {[...new Set(items.map(i => i.operator))].map(op => {
              const opItems = items.filter(i => i.operator === op)
              const opCompleted = opItems.filter(i => i.status === "Completed").length
              const opTotal = opItems.reduce((s, i) => s + i.completed, 0)
              const opTarget = opItems.reduce((s, i) => s + i.target, 0)
              const opRevenue = opItems.reduce((s, i) => s + i.revenue, 0)
              const opCost = opItems.reduce((s, i) => s + i.cost, 0)
              const opProgress = ((opTotal / opTarget) * 100).toFixed(0)
              const avgDefect = (opItems.reduce((s, i) => s + i.defectRate, 0) / opItems.length).toFixed(2)
              return (
                <div key={op} className="vas-operator-card rounded-lg border p-2.5 bg-card">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2"><span className="text-xs font-semibold">{op}</span></div>
                    <div className="flex gap-2 text-[10px]">
                      <span className="text-emerald-600">{opCompleted} done</span>
                      <span className="text-blue-600">{opItems.length} tasks</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="vas-progress-bar h-full rounded-full bg-violet-500" style={{ width: `${opProgress}%` }} />
                    </div>
                    <span className="text-[10px] font-mono font-medium w-8 text-right">{opProgress}%</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground">
                    <div>Revenue: <span className="font-medium text-foreground">{fmtINR(opRevenue)}</span></div>
                    <div>Cost: <span className="font-medium text-foreground">{fmtINR(opCost)}</span></div>
                    <div>Defect: <span className={`font-medium ${Number(avgDefect) > 1 ? "text-red-600" : "text-foreground"}`}>{avgDefect}%</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "profitability" && (
          <div className="space-y-2">
            <div className="vas-profit-header rounded-lg border p-2 bg-violet-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{fmtINR(totalRevenue)}</div><div className="text-[10px] opacity-50">Total Revenue</div></div>
                <div><div className="text-lg font-bold text-red-500">{fmtINR(totalCost)}</div><div className="text-[10px] opacity-50">Total Cost</div></div>
                <div><div className="text-lg font-bold text-violet-600">{fmtINR(totalRevenue - totalCost)}</div><div className="text-[10px] opacity-50">Net Profit</div></div>
                <div><div className="text-lg font-bold text-amber-600">{margin}%</div><div className="text-[10px] opacity-50">Margin</div></div>
              </div>
            </div>
            {items.sort((a, b) => (b.revenue - b.cost) - (a.revenue - a.cost)).map(item => {
              const profit = item.revenue - item.cost
              const pm = ((profit / item.revenue) * 100).toFixed(1)
              return (
                <div key={item.id} className="vas-profit-row rounded-lg border p-2 bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                      <span className="text-xs font-semibold">{item.service}</span>
                      <span className="text-[10px] opacity-50">{item.sku}</span>
                    </div>
                    <span className={`text-xs font-mono font-bold ${profit > 0 ? "text-emerald-600" : "text-red-600"}`}>{fmtINR(profit)}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground">
                    <div>Rev: <span className="font-medium text-foreground">{fmtINR(item.revenue)}</span></div>
                    <div>Cost: <span className="font-medium text-foreground">{fmtINR(item.cost)}</span></div>
                    <div>Margin: <span className="font-medium">{pm}%</span></div>
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
