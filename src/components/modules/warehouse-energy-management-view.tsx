"use client"

import { useState, useMemo, useEffect } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import {
  Zap, Sun, Thermometer, DollarSign, TrendingUp, Activity, Target,
  AlertTriangle, CheckCircle, ArrowUpRight, ArrowDownRight,
  BarChart3, Wind, Battery, Power, Clock, Gauge, Lightbulb,
} from "lucide-react"
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast-helper"
import { ExportButton } from "@/components/shared/export-button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const CC = { emerald: "#059669", amber: "#d97706", sky: "#0284c7", green: "#16a34a", rose: "#e11d48", orange: "#ea580c", teal: "#0d9488", slate: "#475569", purple: "#7c3aed", blue: "#1e40af", cyan: "#06b6d4" }
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const WAREHOUSES = ["Mumbai", "Delhi NCR", "Bangalore", "Chennai", "Hyderabad", "Kolkata"]

function seededRandom(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 12345) % 2147483647; return (s & 0x7fffffff) / 0x7fffffff }
}

function generateData() {
  const r = seededRandom(190190190)
  const pick = <T,>(arr: T[]): T => arr[Math.floor(r() * arr.length)]
  const ri = (min: number, max: number) => Math.floor(r() * (max - min + 1)) + min

  const EQ_TYPES = ["HVAC System", "Cold Storage Unit", "Conveyor Belt", "Forklift Charger", "Lighting System", "Compressor", "EV Charger", "Diesel Generator"]
  const EQ_STATUSES = ["Running", "Standby", "Maintenance", "Fault/Alarm", "Offline"]
  const POWER_TIERS = ["Low", "Medium", "High"]
  const EFFICIENCY_GRADES = ["A", "B", "C", "D", "E", "F"]
  const PANEL_TYPES = ["Monocrystalline", "Polycrystalline", "Thin Film", "Bifacial"]
  const SOLAR_STATUSES = ["Active", "Degraded", "Under Maintenance", "Offline"]
  const COST_CATS = ["Grid Power", "Diesel", "Solar OPEX", "Maintenance", "Demand Charges"]
  const ZONE_TYPES = ["Cold Storage (-18\u00b0C)", "Chiller Room (4\u00b0C)", "Ambient Warehouse (25\u00b0C)", "Office Space (22\u00b0C)", "Loading Dock (30\u00b0C)"]
  const ALERT_SEVERITIES = ["Critical", "Warning", "Info", "Success"]
  const OPT_STATUSES = ["Pending", "In Progress", "Completed", "Rejected"]

  const equipment = Array.from({ length: 70 }, (_, i) => ({
    id: `EQ-${String(i + 1).padStart(4, "0")}`, name: `${pick(EQ_TYPES)} ${String.fromCharCode(65 + (i % 26))}${ri(1, 99)}`,
    warehouse: pick(WAREHOUSES), type: pick(EQ_TYPES), status: pick(EQ_STATUSES),
    powerKW: ri(2, 120), efficiency: pick(EFFICIENCY_GRADES), operatingHrs: ri(0, 8760),
    lastMaint: `${ri(1, 28)}/${pick(MONTHS)}/2024`, annualCost: ri(50000, 500000),
  }))

  const solar = Array.from({ length: 40 }, (_, i) => {
    const cap = ri(100, 500), gen = ri(Math.floor(cap * 0.5), cap)
    return {
      id: `SOL-${String(i + 1).padStart(4, "0")}`, warehouse: pick(WAREHOUSES), panelType: pick(PANEL_TYPES),
      capacityKW: cap, generationKWh: gen, performancePct: Math.round(gen / cap * 100),
      selfSufficiencyPct: ri(15, 85), status: pick(SOLAR_STATUSES), area: ri(500, 5000),
      installedDate: `${ri(1, 28)}/${pick(MONTHS)}/${ri(2020, 2024)}`, annualSavings: ri(200000, 2000000),
    }
  })

  const costs = Array.from({ length: 50 }, (_, i) => ({
    id: `CST-${String(i + 1).padStart(4, "0")}`, warehouse: pick(WAREHOUSES), category: pick(COST_CATS),
    consumptionKWh: ri(5000, 200000), ratePerKWh: +(r() * 12 + 3).toFixed(2),
    totalCost: 0, period: `${pick(MONTHS)} 2024`, demandCharge: ri(10000, 80000),
    fixedCharge: ri(5000, 30000),
  })).map(c => ({ ...c, totalCost: +(c.consumptionKWh * c.ratePerKWh + c.demandCharge + c.fixedCharge).toFixed(0) }))

  const hvac = Array.from({ length: 50 }, (_, i) => {
    const zt = pick(ZONE_TYPES)
    const setP = zt.includes("-18") ? -18 : zt.includes("4") ? 4 : zt.includes("25") ? 25 : zt.includes("22") ? 22 : 30
    const deviation = +(r() * 5).toFixed(1)
    const actual = +(setP + (r() > 0.5 ? deviation : -deviation)).toFixed(1)
    return {
      id: `HVAC-${String(i + 1).padStart(4, "0")}`, zone: `Zone ${String.fromCharCode(65 + (i % 26))}${ri(1, 12)}`,
      warehouse: pick(WAREHOUSES), type: zt, setPoint: setP, actualTemp: actual,
      deviation: Math.abs(actual - setP), humidity: ri(30, 85), energyKWh: ri(2000, 50000),
      status: Math.abs(actual - setP) < 1 ? "Optimal" : Math.abs(actual - setP) <= 3 ? "Acceptable" : "Critical",
    }
  })

  const alerts = Array.from({ length: 20 }, (_, i) => ({
    id: `ALT-${String(i + 1).padStart(3, "0")}`, severity: pick(ALERT_SEVERITIES),
    title: pick(["HVAC Unit Overload", "Solar Panel Degradation", "Peak Demand Exceeded", "Power Factor Low", "Equipment Fault Detected", "Temperature Deviation", "Generator Fuel Low", "Battery SOC Warning", "Lighting Schedule Mismatch", "Meter Reading Anomaly"]),
    warehouse: pick(WAREHOUSES), message: `Alert detected at ${pick(WAREHOUSES)} facility`,
    time: `${ri(1, 48)}h ago`, acknowledged: r() > 0.5,
  }))

  const optimizations = Array.from({ length: 25 }, (_, i) => ({
    id: `OPT-${String(i + 1).padStart(3, "0")}`,
    title: pick(["Install LED Lighting", "Optimize HVAC Scheduling", "Add Solar Panels", "Upgrade to VFD Motors", "Implement Smart Metering", "Shift Loads to Off-Peak", "Replace Old Compressors", "Add Battery Storage", "Improve Insulation", "Implement Demand Response"]),
    impact: pick(["High", "Medium", "Low"]), effort: pick(["Low", "Medium", "High"]), status: pick(OPT_STATUSES),
    savingsPotential: ri(50000, 1000000), warehouse: pick(WAREHOUSES),
  }))

  const monthlyConsumption = MONTHS.map(m => ({ month: m, gridKWh: ri(150000, 400000), solarKWh: ri(30000, 120000), netKWh: 0 }))
  monthlyConsumption.forEach(m => { m.netKWh = m.gridKWh - m.solarKWh })

  const energySourceData = [{ name: "Grid Power", value: 55 }, { name: "Solar Rooftop", value: 22 }, { name: "Diesel Gen.", value: 12 }, { name: "Wind", value: 6 }, { name: "Battery Storage", value: 5 }]
  const warehouseComparison = WAREHOUSES.map(w => ({ warehouse: w, consumption: ri(80000, 350000), solar: ri(20000, 80000), efficiency: ri(65, 98) }))
  const pueTrend = MONTHS.map(m => ({ month: m, actual: +(r() * 0.8 + 1.2).toFixed(2), target: 1.4 }))
  const costTrend = MONTHS.map(m => ({ month: m, grid: ri(150000, 400000), solar: ri(20000, 80000), diesel: ri(30000, 80000) }))
  const costBreakdown = COST_CATS.map(c => ({ name: c, value: c === "Grid Power" ? 45 : c === "Diesel" ? 20 : c === "Solar OPEX" ? 12 : c === "Maintenance" ? 10 : 13 }))
  const solarGenTrend = MONTHS.map(m => ({ month: m, actual: ri(60000, 150000), capacity: 120000 }))
  const tempTrend = MONTHS.map(m => ({ month: m, setPoint: 25, actual: +(25 + (r() - 0.5) * 6).toFixed(1) }))
  const energyIntensityTrend = MONTHS.map(m => ({ month: m, intensity: +(r() * 20 + 15).toFixed(1) }))

  return {
    equipment, solar, costs, hvac, alerts, optimizations,
    monthlyConsumption, energySourceData, warehouseComparison, pueTrend,
    costTrend, costBreakdown, solarGenTrend, tempTrend, energyIntensityTrend,
    EQ_TYPES, EQ_STATUSES, POWER_TIERS, EFFICIENCY_GRADES, PANEL_TYPES, SOLAR_STATUSES,
    COST_CATS, ZONE_TYPES, ALERT_SEVERITIES, OPT_STATUSES, WAREHOUSES,
  }
}

// ── Unique Visual Components ──
function EfficiencyBadge({ grade }: { grade: string }) {
  const m: Record<string, string> = { A: "bg-emerald-500 text-white", B: "bg-sky-500 text-white", C: "bg-amber-500 text-white", D: "bg-orange-500 text-white", E: "bg-rose-500 text-white", F: "bg-slate-800 text-white" }
  return <Badge className={cn("wem-eff-badge text-[10px] font-bold px-2", m[grade] || "")}>{grade}</Badge>
}

function PowerBadge({ power }: { power: number }) {
  const tier = power < 10 ? "Low" : power <= 50 ? "Medium" : "High"
  const m: Record<string, string> = { Low: "bg-emerald-100 text-emerald-700", Medium: "bg-amber-100 text-amber-700", High: "bg-rose-100 text-rose-700" }
  return <Badge className={cn("wem-power-badge text-[10px] px-2", m[tier])}>{tier} {power}kW</Badge>
}

function SBadge({ status }: { status: string }) {
  const m: Record<string, string> = {
    Running: "bg-emerald-100 text-emerald-700", Standby: "bg-amber-100 text-amber-700",
    Maintenance: "bg-blue-100 text-blue-700", "Fault/Alarm": "bg-slate-800 text-white",
    Offline: "bg-slate-200 text-slate-600", Active: "bg-emerald-100 text-emerald-700",
    Degraded: "bg-amber-100 text-amber-700", "Under Maintenance": "bg-blue-100 text-blue-700",
    Optimal: "bg-emerald-100 text-emerald-700", Acceptable: "bg-amber-100 text-amber-700",
    Critical: "bg-rose-100 text-rose-700",
    Pending: "bg-slate-200 text-slate-600", "In Progress": "bg-blue-100 text-blue-700",
    Completed: "bg-emerald-100 text-emerald-700", Rejected: "bg-rose-100 text-rose-700",
  }
  return <Badge variant="outline" className={cn("wem-sbadge text-[10px] px-2 py-0.5", m[status] || "")}>{status}</Badge>
}

function AlertBadge({ severity }: { severity: string }) {
  const m: Record<string, string> = { Critical: "bg-slate-800 text-white", Warning: "bg-amber-100 text-amber-700", Info: "bg-sky-100 text-sky-700", Success: "bg-emerald-100 text-emerald-700" }
  return <Badge className={cn("wem-alert-badge text-[10px] px-2 font-medium", m[severity] || "")}>{severity}</Badge>
}

function TemperatureGauge({ setPoint, actual, unit = "\u00b0C" }: { setPoint: number; actual: number; unit?: string }) {
  const dev = Math.abs(actual - setPoint)
  const color = dev < 1 ? CC.emerald : dev <= 3 ? CC.amber : CC.rose
  const pct = Math.min(Math.max((actual - (setPoint - 10)) / 20 * 100, 5), 95)
  return (
    <div className="wem-temp-gauge space-y-1 px-2">
      <div className="flex justify-between text-[10px] text-muted-foreground"><span>Set Point: {setPoint}{unit}</span><span>Actual: {actual}{unit}</span></div>
      <div className="relative w-full h-4 rounded bg-muted overflow-hidden">
        <div className="absolute left-[40%] top-0 bottom-0 w-0.5 bg-foreground/30 z-10" />
        <div className="h-full rounded transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="text-center text-[10px]"><span className={cn("font-medium", dev < 1 ? "text-emerald-600" : dev <= 3 ? "text-amber-600" : "text-rose-600")}>Deviation: {dev.toFixed(1)}{unit}</span></div>
    </div>
  )
}

function SolarProgressBar({ capacity, generation }: { capacity: number; generation: number }) {
  const pct = Math.round(generation / capacity * 100)
  return (
    <div className="wem-solar-bar space-y-1 px-2">
      <div className="flex justify-between text-[10px] text-muted-foreground"><span>Generation</span><span className="font-medium text-emerald-600">{pct}%</span></div>
      <div className="w-full h-3 rounded bg-muted overflow-hidden"><div className="h-full rounded bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all" style={{ width: `${Math.min(pct, 100)}%` }} /></div>
      <div className="text-[10px] text-muted-foreground">{generation.toLocaleString()} / {capacity.toLocaleString()} kWh</div>
    </div>
  )
}

function CostBreakdownVisual({ energy, demand, fixed, total }: { energy: number; demand: number; fixed: number; total: number }) {
  const items = [
    { label: "Energy", value: energy, color: "bg-amber-500", pct: Math.round(energy / (total || 1) * 100) },
    { label: "Demand", value: demand, color: "bg-sky-500", pct: Math.round(demand / (total || 1) * 100) },
    { label: "Fixed", value: fixed, color: "bg-emerald-500", pct: Math.round(fixed / (total || 1) * 100) },
  ]
  return (
    <div className="wem-cost-vis space-y-2 px-2">
      {items.map(it => (
        <div key={it.label} className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground w-12 shrink-0">{it.label}</span>
          <div className="flex-1 h-3 rounded bg-muted overflow-hidden"><div className={cn("h-full rounded", it.color)} style={{ width: `${Math.min(it.pct, 100)}%` }} /></div>
          <span className="text-[10px] font-medium w-10 text-right">{it.pct}%</span>
        </div>
      ))}
    </div>
  )
}

function HealthTile({ label, value, target, unit, color }: { label: string; value: number; target: number; unit: string; color: string }) {
  const pct = Math.min(Math.round(value / target * 100), 100)
  return (
    <Card className="wem-health-tile border-border/60"><CardContent className="p-4">
      <div className="flex justify-between items-center mb-2"><span className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</span><span className={cn("text-xs font-bold", color)}>{value}{unit}</span></div>
      <div className="w-full h-2 rounded bg-muted overflow-hidden"><div className="h-full rounded transition-all" style={{ width: `${pct}%`, backgroundColor: color }} /></div>
      <p className="text-[10px] text-muted-foreground mt-1">Target: {target}{unit}</p>
    </CardContent></Card>
  )
}

const sheetGrad = "bg-gradient-to-r from-[#059669] to-[#d97706] text-white"
const fmtINR = (v: number) => `\u20b9${(v / 100000).toFixed(1)}L`
const fmtNum = (v: number) => v.toLocaleString()

export default function WarehouseEnergyManagementView() {
  const data = useMemo(() => generateData(), [])
  const [tab, setTab] = useState("0")
  const [drawerData, setDrawerData] = useState<any>(null)
  const [drawerType, setDrawerType] = useState("")
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState<any>("id")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const { toast } = useToast()

  const sortFn = <T extends Record<string, any>>(items: T[], key: any) => {
    const s = [...items].sort((a, b) => { const va = a[key], vb = b[key]; return va < vb ? -1 : va > vb ? 1 : 0 })
    return sortDir === "asc" ? s : s.reverse()
  }

  const SH = ({ label, field }: { label: string; field: any }) => (
    <TableHead className="cursor-pointer select-none text-[11px]" onClick={() => { if (sortBy === field) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortBy(field); setSortDir("asc") } }}>
      <span className="wem-sort-head flex items-center gap-1">{label} {sortBy === field && (sortDir === "asc" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />)}</span>
    </TableHead>
  )

  const ActBtn = ({ d, t }: { d: any; t: string }) => (
    <Button variant="ghost" size="sm" className="wem-view-btn h-6 text-[10px]" onClick={() => { setDrawerData(d); setDrawerType(t) }}><Activity className="h-3 w-3 mr-1" />View</Button>
  )

  const DrawerActions = ({ id, name }: { id: string; name: string }) => (
    <div className="flex gap-2 pt-2">
      {[{ label: "Edit", icon: Zap }, { label: "Details", icon: Target }, { label: "Report", icon: BarChart3 }].map(a => (
        <Button key={a.label} variant="outline" size="sm" className="wem-action-btn flex-1 text-xs h-8" onClick={() => toast.success(a.label, `${id} ${a.label.toLowerCase()} action triggered`)}><a.icon className="h-3 w-3 mr-1" />{a.label}</Button>
      ))}
    </div>
  )

  const DrawerHeader = ({ title, desc, children }: { title: string; desc?: string; children?: React.ReactNode }) => (
    <SheetHeader className={cn("wem-drawer-header rounded-lg p-4 -mx-6 -mt-6 mb-4", sheetGrad)}>
      <SheetTitle className="text-white text-sm">{title}</SheetTitle>
      {desc && <SheetDescription className="text-amber-100 mt-1">{desc}</SheetDescription>}
      {children && <SheetDescription className="text-amber-100 flex flex-wrap gap-1.5 mt-1">{children}</SheetDescription>}
    </SheetHeader>
  )

  const InfoGrid = ({ items }: { items: [string, string][] }) => (
    <div className="grid grid-cols-2 gap-2 text-xs">
      {items.map(([l, v]) => (<div key={l} className="flex justify-between p-1.5 rounded bg-muted/50"><span className="text-muted-foreground">{l}</span><span className="font-medium">{v}</span></div>))}
    </div>
  )

  // Tab 0: Dashboard
  const DashboardTab = () => {
    const totalConsumption = data.monthlyConsumption.reduce((a, m) => a + m.gridKWh, 0)
    const totalCost = data.costs.reduce((a, c) => a + c.totalCost, 0)
    const totalSolar = data.solar.reduce((a, s) => a + s.generationKWh, 0)
    const avgPue = +(data.pueTrend.reduce((a, p) => a + p.actual, 0) / 12).toFixed(2)
    const peakDemand = Math.max(...data.equipment.map(e => e.powerKW)) * 8
    const carbonReduced = +(totalSolar * 0.0007).toFixed(0)
    const kpis = [
      { label: "Total Consumption", value: `${(totalConsumption / 1000).toFixed(0)} MWh`, icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Monthly Cost", value: fmtINR(totalCost), icon: DollarSign, color: "text-sky-600", bg: "bg-sky-50" },
      { label: "Solar Generation", value: `${(totalSolar / 1000).toFixed(0)} MWh`, icon: Sun, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Avg PUE", value: avgPue.toString(), icon: Gauge, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Peak Demand", value: `${peakDemand} kW`, icon: Power, color: "text-orange-600", bg: "bg-orange-50" },
      { label: "CO\u2082 Reduced", value: `${carbonReduced}t`, icon: Wind, color: "text-teal-600", bg: "bg-teal-50" },
    ]
    return (
      <div className="wem-dashboard space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {kpis.map(k => (
            <Card key={k.label} className="wem-kpi-card border-border/60"><CardContent className="p-4 flex items-center gap-3">
              <div className={cn("wem-kpi-icon p-2 rounded-lg", k.bg)}><k.icon className={cn("h-4 w-4", k.color)} /></div>
              <div><p className="text-[10px] text-muted-foreground uppercase tracking-wide">{k.label}</p><p className={cn("text-lg font-bold", k.color)}>{k.value}</p></div>
            </CardContent></Card>
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="wem-chart-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Consumption (kWh)</CardTitle></CardHeader><CardContent>
            <ResponsiveContainer width="100%" height={220}><AreaChart data={data.monthlyConsumption}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip contentStyle={{ fontSize: 11 }} /><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
              <Area type="monotone" dataKey="gridKWh" stackId="1" stroke={CC.amber} fill={CC.amber} fillOpacity={0.5} name="Grid" />
              <Area type="monotone" dataKey="solarKWh" stackId="1" stroke={CC.emerald} fill={CC.emerald} fillOpacity={0.5} name="Solar" />
            </AreaChart></ResponsiveContainer>
          </CardContent></Card>
          <Card className="wem-chart-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Energy Source Mix</CardTitle></CardHeader><CardContent>
            <ResponsiveContainer width="100%" height={220}><PieChart>
              <Pie data={data.energySourceData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {[CC.amber, CC.emerald, CC.rose, CC.sky, CC.teal].map((c, i) => <Cell key={i} fill={c} />)}
              </Pie><Tooltip contentStyle={{ fontSize: 11 }} /><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
            </PieChart></ResponsiveContainer>
          </CardContent></Card>
          <Card className="wem-chart-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Warehouse Comparison</CardTitle></CardHeader><CardContent>
            <ResponsiveContainer width="100%" height={220}><BarChart data={data.warehouseComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="warehouse" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip contentStyle={{ fontSize: 11 }} /><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="consumption" fill={CC.amber} radius={[4, 4, 0, 0]} name="Grid kWh" />
            </BarChart></ResponsiveContainer>
          </CardContent></Card>
        </div>
        <Card className="wem-chart-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">PUE Trend (Power Usage Effectiveness)</CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={220}><LineChart data={data.pueTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis domain={[1, 2.2]} tick={{ fontSize: 10 }} /><Tooltip contentStyle={{ fontSize: 11 }} /><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
            <Line type="monotone" dataKey="actual" stroke={CC.emerald} strokeWidth={2} dot={{ r: 3 }} name="Actual PUE" />
            <Line type="monotone" dataKey="target" stroke={CC.rose} strokeDasharray="5 5" strokeWidth={2} name="Target (1.4)" />
          </LineChart></ResponsiveContainer>
        </CardContent></Card>
      </div>
    )
  }

  // Tab 1: Equipment
  const EquipmentTab = () => {
    const rows = sortFn(data.equipment.filter(e => {
      if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.id.toLowerCase().includes(search.toLowerCase())) return false
      if (filterType !== "all" && e.type !== filterType) return false
      if (filterStatus !== "all" && e.status !== filterStatus) return false
      return true
    }), sortBy)
    return (
      <div className="wem-eq-tab space-y-4">
        <div className="flex flex-wrap gap-2">
          <Input placeholder="Search equipment..." value={search} onChange={e => setSearch(e.target.value)} className="wem-search h-8 text-xs w-60" />
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="wem-filter h-8 text-xs border rounded-md px-2 bg-background"><option value="all">All Types</option>{data.EQ_TYPES.map(t => <option key={t}>{t}</option>)}</select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="wem-filter h-8 text-xs border rounded-md px-2 bg-background"><option value="all">All Status</option>{data.EQ_STATUSES.map(s => <option key={s}>{s}</option>)}</select>
        </div>
        <div className="rounded-lg border overflow-x-auto max-h-[480px] overflow-y-auto"><Table><TableHeader><TableRow>
          <SH label="ID" field="id" /><SH label="Name" field="name" /><TableHead className="text-[11px]">Warehouse</TableHead><TableHead className="text-[11px]">Type</TableHead><TableHead className="text-[11px]">Status</TableHead><TableHead className="text-[11px]">Power</TableHead><TableHead className="text-[11px]">Efficiency</TableHead><SH label="Op. Hours" field="operatingHrs" /><TableHead className="text-[11px]">Last Maint.</TableHead><TableHead className="text-[11px]">Actions</TableHead>
        </TableRow></TableHeader><TableBody>{rows.slice(0, 20).map(e => (
          <TableRow key={e.id} className="wem-eq-row">
            <TableCell className="text-xs font-mono">{e.id}</TableCell><TableCell className="text-xs font-medium max-w-[140px] truncate">{e.name}</TableCell>
            <TableCell className="text-[10px]">{e.warehouse}</TableCell><TableCell className="text-[10px]">{e.type}</TableCell>
            <TableCell><SBadge status={e.status} /></TableCell><TableCell><PowerBadge power={e.powerKW} /></TableCell>
            <TableCell><EfficiencyBadge grade={e.efficiency} /></TableCell><TableCell className="text-xs">{e.operatingHrs.toLocaleString()}h</TableCell>
            <TableCell className="text-[10px]">{e.lastMaint}</TableCell><TableCell><ActBtn d={e} t="equipment" /></TableCell>
          </TableRow>
        ))}</TableBody></Table></div>
        <p className="text-xs text-muted-foreground">Showing {Math.min(rows.length, 20)} of {rows.length} equipment</p>
      </div>
    )
  }

  // Tab 2: Solar
  const SolarTab = () => {
    const rows = sortFn(data.solar.filter(s => {
      if (search && !s.id.toLowerCase().includes(search.toLowerCase()) && !s.warehouse.toLowerCase().includes(search.toLowerCase())) return false
      if (filterType !== "all" && s.panelType !== filterType) return false
      if (filterStatus !== "all" && s.status !== filterStatus) return false
      return true
    }), sortBy)
    return (
      <div className="wem-solar-tab space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="wem-chart-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Solar Generation Trend</CardTitle></CardHeader><CardContent>
            <ResponsiveContainer width="100%" height={200}><LineChart data={data.solarGenTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip contentStyle={{ fontSize: 11 }} /><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="actual" stroke={CC.emerald} strokeWidth={2} dot={{ r: 3 }} name="Actual kWh" />
              <Line type="monotone" dataKey="capacity" stroke={CC.amber} strokeDasharray="5 5" name="Capacity" />
            </LineChart></ResponsiveContainer>
          </CardContent></Card>
          <div className="grid grid-cols-2 gap-3">{WAREHOUSES.map(w => {
            const wh = data.solar.filter(s => s.warehouse === w)
            const totalCap = wh.reduce((a, s) => a + s.capacityKW, 0)
            const totalGen = wh.reduce((a, s) => a + s.generationKWh, 0)
            const selfSuff = wh.length ? Math.round(wh.reduce((a, s) => a + s.selfSufficiencyPct, 0) / wh.length) : 0
            return (
              <Card key={w} className="wem-wh-solar-card border-border/60"><CardContent className="p-3">
                <p className="text-[10px] text-muted-foreground mb-1">{w}</p>
                <p className="text-sm font-bold text-emerald-700">{totalCap} kW</p>
                <div className="w-full h-1.5 rounded bg-muted mt-1 mb-1"><div className="h-full rounded bg-emerald-500" style={{ width: `${Math.min(totalCap / 1500 * 100, 100)}%` }} /></div>
                <div className="flex justify-between text-[10px] text-muted-foreground"><span>Gen: {totalGen.toLocaleString()} kWh</span><span>Self: {selfSuff}%</span></div>
              </CardContent></Card>
            )
          })}</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Input placeholder="Search solar..." value={search} onChange={e => setSearch(e.target.value)} className="wem-search h-8 text-xs w-60" />
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="wem-filter h-8 text-xs border rounded-md px-2 bg-background"><option value="all">All Panels</option>{data.PANEL_TYPES.map(t => <option key={t}>{t}</option>)}</select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="wem-filter h-8 text-xs border rounded-md px-2 bg-background"><option value="all">All Status</option>{data.SOLAR_STATUSES.map(s => <option key={s}>{s}</option>)}</select>
        </div>
        <div className="rounded-lg border overflow-x-auto max-h-96 overflow-y-auto"><Table><TableHeader><TableRow>
          <SH label="ID" field="id" /><TableHead className="text-[11px]">Warehouse</TableHead><TableHead className="text-[11px]">Panel Type</TableHead><SH label="Capacity kW" field="capacityKW" /><SH label="Generation" field="generationKWh" />
          <SH label="Perf. %" field="performancePct" /><SH label="Self-Suff. %" field="selfSufficiencyPct" /><TableHead className="text-[11px]">Status</TableHead><TableHead className="text-[11px]">Actions</TableHead>
        </TableRow></TableHeader><TableBody>{rows.slice(0, 15).map(s => (
          <TableRow key={s.id} className="wem-solar-row">
            <TableCell className="text-xs font-mono">{s.id}</TableCell><TableCell className="text-[10px]">{s.warehouse}</TableCell>
            <TableCell><Badge variant="outline" className="text-[10px]">{s.panelType}</Badge></TableCell>
            <TableCell className="text-xs">{s.capacityKW} kW</TableCell><TableCell className="text-xs">{s.generationKWh.toLocaleString()} kWh</TableCell>
            <TableCell><Badge className={cn("text-[10px]", s.performancePct >= 80 ? "bg-emerald-100 text-emerald-700" : s.performancePct >= 60 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700")}>{s.performancePct}%</Badge></TableCell>
            <TableCell><Badge className={cn("text-[10px]", s.selfSufficiencyPct >= 50 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>{s.selfSufficiencyPct}%</Badge></TableCell>
            <TableCell><SBadge status={s.status} /></TableCell><TableCell><ActBtn d={s} t="solar" /></TableCell>
          </TableRow>
        ))}</TableBody></Table></div>
      </div>
    )
  }

  // Tab 3: Cost
  const CostTab = () => {
    const [fm, setFm] = useState("all")
    const rows = sortFn(data.costs.filter(c => {
      if (search && !c.warehouse.toLowerCase().includes(search.toLowerCase())) return false
      if (fm !== "all" && c.category !== fm) return false
      return true
    }), sortBy)
    return (
      <div className="wem-cost-tab space-y-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="wem-chart-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Cost Breakdown</CardTitle></CardHeader><CardContent>
            <ResponsiveContainer width="100%" height={200}><BarChart data={data.costTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip contentStyle={{ fontSize: 11 }} /><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="grid" fill={CC.amber} radius={[2, 2, 0, 0]} name="Grid" /><Bar dataKey="solar" fill={CC.emerald} radius={[2, 2, 0, 0]} name="Solar" /><Bar dataKey="diesel" fill={CC.rose} radius={[2, 2, 0, 0]} name="Diesel" />
            </BarChart></ResponsiveContainer>
          </CardContent></Card>
          <Card className="wem-chart-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Cost Distribution</CardTitle></CardHeader><CardContent>
            <ResponsiveContainer width="100%" height={200}><PieChart>
              <Pie data={data.costBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={3}>
                {[CC.amber, CC.rose, CC.emerald, CC.sky, CC.teal].map((c, i) => <Cell key={i} fill={c} />)}
              </Pie><Tooltip contentStyle={{ fontSize: 11 }} /><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
            </PieChart></ResponsiveContainer>
          </CardContent></Card>
          <Card className="wem-savings-card border-border/60"><CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-emerald-600" /><span className="text-sm font-medium">Total Annual Savings</span></div>
            <p className="text-2xl font-bold text-emerald-600">{fmtINR(data.costs.reduce((a, c) => a + c.totalCost, 0) * 0.12)}</p>
            <p className="text-xs text-muted-foreground">Estimated 12% reduction via optimization</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {[{ l: "Grid Reduction", v: "8.2%" }, { l: "Solar Uptake", v: "+15%" }, { l: "Peak Shaving", v: "22%" }, { l: "Diesel Offset", v: "18%" }].map(s => (
                <div key={s.l} className="p-2 rounded bg-muted/50 text-xs"><span className="text-muted-foreground">{s.l}</span><p className="font-medium text-emerald-600">{s.v}</p></div>
              ))}
            </div>
          </CardContent></Card>
        </div>
        <div className="flex flex-wrap gap-2">
          <Input placeholder="Search costs..." value={search} onChange={e => setSearch(e.target.value)} className="wem-search h-8 text-xs w-60" />
          <select value={fm} onChange={e => setFm(e.target.value)} className="wem-filter h-8 text-xs border rounded-md px-2 bg-background"><option value="all">All Categories</option>{data.COST_CATS.map(c => <option key={c}>{c}</option>)}</select>
        </div>
        <div className="rounded-lg border overflow-x-auto max-h-96 overflow-y-auto"><Table><TableHeader><TableRow>
          <SH label="ID" field="id" /><TableHead className="text-[11px]">Warehouse</TableHead><TableHead className="text-[11px]">Category</TableHead><SH label="kWh" field="consumptionKWh" /><SH label="Rate" field="ratePerKWh" />
          <SH label="Total Cost" field="totalCost" /><TableHead className="text-[11px]">Period</TableHead><TableHead className="text-[11px]">Actions</TableHead>
        </TableRow></TableHeader><TableBody>{rows.slice(0, 15).map(c => (
          <TableRow key={c.id} className="wem-cost-row">
            <TableCell className="text-xs font-mono">{c.id}</TableCell><TableCell className="text-[10px]">{c.warehouse}</TableCell>
            <TableCell><Badge variant="outline" className="text-[10px]">{c.category}</Badge></TableCell>
            <TableCell className="text-xs">{c.consumptionKWh.toLocaleString()}</TableCell><TableCell className="text-xs">\u20b9{c.ratePerKWh}/kWh</TableCell>
            <TableCell className="text-xs font-medium">{fmtINR(c.totalCost)}</TableCell><TableCell className="text-[10px]">{c.period}</TableCell><ActBtn d={c} t="cost" />
          </TableRow>
        ))}</TableBody></Table></div>
      </div>
    )
  }

  // Tab 4: HVAC
  const HvacTab = () => {
    const rows = sortFn(data.hvac.filter(h => {
      if (search && !h.zone.toLowerCase().includes(search.toLowerCase()) && !h.warehouse.toLowerCase().includes(search.toLowerCase())) return false
      if (filterType !== "all" && !h.type.includes(filterType) && filterType !== "all") return false
      if (filterStatus !== "all" && h.status !== filterStatus) return false
      return true
    }), sortBy)
    return (
      <div className="wem-hvac-tab space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="wem-chart-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Temperature Trend</CardTitle></CardHeader><CardContent>
            <ResponsiveContainer width="100%" height={200}><AreaChart data={data.tempTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip contentStyle={{ fontSize: 11 }} /><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
              <Area type="monotone" dataKey="setPoint" stroke={CC.sky} strokeDasharray="5 5" fill={CC.sky} fillOpacity={0.1} name="Set Point" />
              <Area type="monotone" dataKey="actual" stroke={CC.rose} fill={CC.rose} fillOpacity={0.15} name="Actual" />
            </AreaChart></ResponsiveContainer>
          </CardContent></Card>
          <Card className="wem-chart-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Energy by Zone Type</CardTitle></CardHeader><CardContent>
            <ResponsiveContainer width="100%" height={200}><BarChart data={data.ZONE_TYPES.map((z, i) => ({ type: z.split("(")[0].trim(), energy: [35000, 28000, 15000, 8000, 22000][i % 5] }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="type" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip contentStyle={{ fontSize: 11 }} />
              <Bar dataKey="energy" radius={[4, 4, 0, 0]}>{[CC.rose, CC.sky, CC.amber, CC.emerald, CC.orange].map((c, i) => <Cell key={i} fill={c} />)}</Bar>
            </BarChart></ResponsiveContainer>
          </CardContent></Card>
        </div>
        <div className="flex flex-wrap gap-2">
          <Input placeholder="Search HVAC..." value={search} onChange={e => setSearch(e.target.value)} className="wem-search h-8 text-xs w-60" />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="wem-filter h-8 text-xs border rounded-md px-2 bg-background"><option value="all">All Status</option>{["Optimal", "Acceptable", "Critical"].map(s => <option key={s}>{s}</option>)}</select>
        </div>
        <div className="rounded-lg border overflow-x-auto max-h-96 overflow-y-auto"><Table><TableHeader><TableRow>
          <SH label="ID" field="id" /><TableHead className="text-[11px]">Zone</TableHead><TableHead className="text-[11px]">Warehouse</TableHead><TableHead className="text-[11px]">Type</TableHead>
          <TableHead className="text-[11px]">Set Point</TableHead><SH label="Actual" field="actualTemp" /><TableHead className="text-[11px]">Humidity</TableHead><SH label="Energy" field="energyKWh" /><TableHead className="text-[11px]">Status</TableHead><TableHead className="text-[11px]">Actions</TableHead>
        </TableRow></TableHeader><TableBody>{rows.slice(0, 15).map(h => (
          <TableRow key={h.id} className="wem-hvac-row">
            <TableCell className="text-xs font-mono">{h.id}</TableCell><TableCell className="text-xs font-medium">{h.zone}</TableCell><TableCell className="text-[10px]">{h.warehouse}</TableCell>
            <TableCell className="text-[10px]">{h.type}</TableCell><TableCell className="text-xs">{h.setPoint}\u00b0C</TableCell>
            <TableCell><Badge className={cn("text-[10px]", h.status === "Optimal" ? "bg-emerald-100 text-emerald-700" : h.status === "Acceptable" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700")}>{h.actualTemp}\u00b0C</Badge></TableCell>
            <TableCell className="text-xs">{h.humidity}%</TableCell><TableCell className="text-xs">{h.energyKWh.toLocaleString()} kWh</TableCell>
            <TableCell><SBadge status={h.status} /></TableCell><TableCell><ActBtn d={h} t="hvac" /></TableCell>
          </TableRow>
        ))}</TableBody></Table></div>
      </div>
    )
  }

  // Tab 5: Alerts & Optimization
  const AlertsTab = () => {
    const [filterSev, setFilterSev] = useState("all")
    const filteredAlerts = data.alerts.filter(a => filterSev === "all" || a.severity === filterSev)
    const filteredOpts = data.optimizations.filter(o => search === "" || o.title.toLowerCase().includes(search.toLowerCase()))
    return (
      <div className="wem-alerts-tab space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <HealthTile label="PUE Score" value={+(data.pueTrend.reduce((a, p) => a + p.actual, 0) / 12).toFixed(2)} target={1.4} unit="" color="#059669" />
          <HealthTile label="Solar Util." value={72} target={80} unit="%" color="#d97706" />
          <HealthTile label="Peak Demand" value={85} target={100} unit="%" color="#0284c7" />
          <HealthTile label="HVAC Eff." value={78} target={85} unit="%" color="#16a34a" />
          <HealthTile label="Equip. Uptime" value={94} target={98} unit="%" color="#059669" />
          <HealthTile label="Cost Budget" value={88} target={100} unit="%" color="#ea580c" />
        </div>
        <Card className="wem-chart-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Energy Intensity Trend (kWh/sqft)</CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={180}><LineChart data={data.energyIntensityTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip contentStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="intensity" stroke={CC.amber} strokeWidth={2} dot={{ r: 3, fill: CC.amber }} name="kWh/sqft" />
          </LineChart></ResponsiveContainer>
        </CardContent></Card>
        <div className="flex flex-wrap gap-2">
          <select value={filterSev} onChange={e => setFilterSev(e.target.value)} className="wem-filter h-8 text-xs border rounded-md px-2 bg-background"><option value="all">All Severities</option>{data.ALERT_SEVERITIES.map(s => <option key={s}>{s}</option>)}</select>
          <Input placeholder="Search optimizations..." value={search} onChange={e => setSearch(e.target.value)} className="wem-search h-8 text-xs w-60" />
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <Card className="wem-alerts-list border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Energy Alerts</CardTitle></CardHeader><CardContent className="space-y-2 max-h-80 overflow-y-auto">
            {filteredAlerts.slice(0, 12).map(a => (
              <div key={a.id} className={cn("wem-alert-item flex items-start gap-3 p-2.5 rounded-lg border-l-4", a.severity === "Critical" ? "border-l-rose-600 bg-rose-50 dark:bg-rose-950/20" : a.severity === "Warning" ? "border-l-amber-500 bg-amber-50 dark:bg-amber-950/20" : a.severity === "Info" ? "border-l-sky-500 bg-sky-50 dark:bg-sky-950/20" : "border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950/20")}>
                <AlertBadge severity={a.severity} />
                <div className="flex-1 min-w-0"><p className="text-xs font-medium">{a.title}</p><p className="text-[10px] text-muted-foreground">{a.warehouse} \u2022 {a.time}</p></div>
                {!a.acknowledged && <Button variant="ghost" size="sm" className="text-[10px] h-6" onClick={() => toast.success("Acknowledged", `Alert ${a.id} acknowledged`)}>Ack</Button>}
              </div>
            ))}
          </CardContent></Card>
          <Card className="wem-opts-list border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Optimization Recommendations</CardTitle></CardHeader><CardContent className="space-y-2 max-h-80 overflow-y-auto">
            {filteredOpts.slice(0, 12).map(o => (
              <div key={o.id} className="wem-opt-item flex items-start gap-3 p-2.5 rounded-lg border border-border/60 hover:bg-muted/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium">{o.title}</p>
                  <div className="flex gap-1.5 mt-1">
                    <Badge className={cn("text-[9px]", o.impact === "High" ? "bg-emerald-100 text-emerald-700" : o.impact === "Medium" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600")}>{o.impact}</Badge>
                    <Badge className={cn("text-[9px]", o.effort === "Low" ? "bg-sky-100 text-sky-700" : o.effort === "Medium" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700")}>{o.effort}</Badge>
                    <SBadge status={o.status} />
                  </div>
                  <p className="text-[10px] text-emerald-600 mt-1">Savings: {fmtINR(o.savingsPotential)}</p>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">{o.warehouse}</span>
              </div>
            ))}
          </CardContent></Card>
        </div>
      </div>
    )
  }

  const open = !!drawerData
  const close = () => setDrawerData(null)

  return (
    <div className="wem-root space-y-6">
      <PageHeader title="Warehouse Energy Management" description="Monitor and optimize energy consumption, solar generation, and HVAC efficiency across all warehouses" actions={<ExportButton data={data.equipment.map(e => ({ ID: e.id, Name: e.name, Warehouse: e.warehouse, Type: e.type, Status: e.status, "Power kW": e.powerKW, Efficiency: e.efficiency }))} filename="energy-equipment" />} />
      <Tabs value={tab} onValueChange={v => { setTab(v); setSearch(""); setFilterType("all"); setFilterStatus("all") }}>
        <TabsList className="flex-wrap h-auto gap-1">
          {[{ v: "0", l: "Energy Dashboard" }, { v: "1", l: "Equipment Tracking" }, { v: "2", l: "Solar Generation" }, { v: "3", l: "Cost Management" }, { v: "4", l: "HVAC & Climate" }, { v: "5", l: "Alerts & Optimize" }].map(t => <TabsTrigger key={t.v} value={t.v} className="wem-tab-trigger text-xs h-7 px-3">{t.l}</TabsTrigger>)}
        </TabsList>
      </Tabs>
      {tab === "0" && <DashboardTab />}
      {tab === "1" && <EquipmentTab />}
      {tab === "2" && <SolarTab />}
      {tab === "3" && <CostTab />}
      {tab === "4" && <HvacTab />}
      {tab === "5" && <AlertsTab />}

      {/* Equipment Drawer */}
      <Sheet open={open && drawerType === "equipment"} onOpenChange={close}><SheetContent className="wem-eq-drawer w-full sm:max-w-md overflow-y-auto">
        {drawerData && <><DrawerHeader title={`${drawerData.name} ${drawerData.id}`} >
          <Badge className="bg-white/20 text-white text-[10px] border-0">{drawerData.type}</Badge><SBadge status={drawerData.status} />
        </DrawerHeader>
        <div className="space-y-4 px-1">
          <div className="grid grid-cols-3 gap-3">{[
            { label: "Power", value: `${drawerData.powerKW} kW` },
            { label: "Op. Hours", value: `${drawerData.operatingHrs.toLocaleString()}h` },
            { label: "Annual Cost", value: fmtINR(drawerData.annualCost) },
          ].map(m => (<Card key={m.label} className="border-border/60"><CardContent className="p-3 text-center"><p className="text-[10px] text-muted-foreground">{m.label}</p><p className="text-sm font-bold text-emerald-700">{m.value}</p></CardContent></Card>))}</div>
          <div className="flex items-center gap-3"><span className="text-xs text-muted-foreground">Efficiency:</span><EfficiencyBadge grade={drawerData.efficiency} /><span className="text-xs text-muted-foreground">Power:</span><PowerBadge power={drawerData.powerKW} /></div>
          <InfoGrid items={[["Warehouse", drawerData.warehouse], ["Type", drawerData.type], ["Status", drawerData.status], ["Last Maint.", drawerData.lastMaint], ["ID", drawerData.id], ["Efficiency", drawerData.efficiency]]} />
          <DrawerActions id={drawerData.id} name={drawerData.name} />
        </div></>}
      </SheetContent></Sheet>

      {/* Solar Drawer */}
      <Sheet open={open && drawerType === "solar"} onOpenChange={close}><SheetContent className="wem-solar-drawer w-full sm:max-w-md overflow-y-auto">
        {drawerData && <><DrawerHeader title={`${drawerData.warehouse} Solar ${drawerData.id}`} >
          <Badge className="bg-white/20 text-white text-[10px] border-0">{drawerData.panelType}</Badge><SBadge status={drawerData.status} />
        </DrawerHeader>
        <div className="space-y-4 px-1">
          <Card className="border-border/60"><CardContent className="p-3"><p className="text-[10px] text-muted-foreground mb-1">Generation vs Capacity</p><SolarProgressBar capacity={drawerData.capacityKW} generation={drawerData.generationKWh} /></CardContent></Card>
          <div className="grid grid-cols-3 gap-3">{[
            { label: "Capacity", value: `${drawerData.capacityKW} kW` },
            { label: "Self-Suff.", value: `${drawerData.selfSufficiencyPct}%` },
            { label: "Savings", value: fmtINR(drawerData.annualSavings) },
          ].map(m => (<Card key={m.label} className="border-border/60"><CardContent className="p-3 text-center"><p className="text-[10px] text-muted-foreground">{m.label}</p><p className="text-sm font-bold text-emerald-700">{m.value}</p></CardContent></Card>))}</div>
          <InfoGrid items={[["Warehouse", drawerData.warehouse], ["Panel Type", drawerData.panelType], ["Status", drawerData.status], ["Performance", `${drawerData.performancePct}%`], ["Area", `${drawerData.area} sqft`], ["Installed", drawerData.installedDate]]} />
          <DrawerActions id={drawerData.id} name={drawerData.warehouse} />
        </div></>}
      </SheetContent></Sheet>

      {/* Cost Drawer */}
      <Sheet open={open && drawerType === "cost"} onOpenChange={close}><SheetContent className="wem-cost-drawer w-full sm:max-w-md overflow-y-auto">
        {drawerData && <><DrawerHeader title={`${drawerData.id} — ${drawerData.warehouse}`} >
          <Badge className="bg-white/20 text-white text-[10px] border-0">{drawerData.category}</Badge>
        </DrawerHeader>
        <div className="space-y-4 px-1">
          <Card className="border-border/60"><CardHeader className="pb-1"><CardTitle className="text-xs">Cost Breakdown</CardTitle></CardHeader><CardContent><CostBreakdownVisual energy={drawerData.consumptionKWh * drawerData.ratePerKWh} demand={drawerData.demandCharge} fixed={drawerData.fixedCharge} total={drawerData.totalCost} /></CardContent></Card>
          <div className="grid grid-cols-3 gap-3">{[
            { label: "Total Cost", value: fmtINR(drawerData.totalCost) },
            { label: "Rate", value: `\u20b9${drawerData.ratePerKWh}/kWh` },
            { label: "Period", value: drawerData.period },
          ].map(m => (<Card key={m.label} className="border-border/60"><CardContent className="p-3 text-center"><p className="text-[10px] text-muted-foreground">{m.label}</p><p className="text-sm font-bold text-amber-700">{m.value}</p></CardContent></Card>))}</div>
          <DrawerActions id={drawerData.id} name={drawerData.warehouse} />
        </div></>}
      </SheetContent></Sheet>

      {/* HVAC Drawer */}
      <Sheet open={open && drawerType === "hvac"} onOpenChange={close}><SheetContent className="wem-hvac-drawer w-full sm:max-w-md overflow-y-auto">
        {drawerData && <><DrawerHeader title={`${drawerData.zone} ${drawerData.id}`} >
          <Badge className="bg-white/20 text-white text-[10px] border-0">{drawerData.type}</Badge><SBadge status={drawerData.status} />
        </DrawerHeader>
        <div className="space-y-4 px-1">
          <Card className="border-border/60"><CardContent className="p-3"><p className="text-[10px] text-muted-foreground mb-1">Temperature Control</p><TemperatureGauge setPoint={drawerData.setPoint} actual={drawerData.actualTemp} /></CardContent></Card>
          <div className="grid grid-cols-3 gap-3">{[
            { label: "Humidity", value: `${drawerData.humidity}%` },
            { label: "Energy", value: `${(drawerData.energyKWh / 1000).toFixed(1)} MWh` },
            { label: "Deviation", value: `${drawerData.deviation.toFixed(1)}\u00b0C` },
          ].map(m => (<Card key={m.label} className="border-border/60"><CardContent className="p-3 text-center"><p className="text-[10px] text-muted-foreground">{m.label}</p><p className="text-sm font-bold text-sky-700">{m.value}</p></CardContent></Card>))}</div>
          <InfoGrid items={[["Zone", drawerData.zone], ["Warehouse", drawerData.warehouse], ["Type", drawerData.type], ["Set Point", `${drawerData.setPoint}\u00b0C`], ["Actual", `${drawerData.actualTemp}\u00b0C`], ["Energy", `${drawerData.energyKWh.toLocaleString()} kWh`]]} />
          <DrawerActions id={drawerData.id} name={drawerData.zone} />
        </div></>}
      </SheetContent></Sheet>
    </div>
  )
}
