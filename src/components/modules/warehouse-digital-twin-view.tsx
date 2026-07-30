"use client"
import { useState, useMemo } from "react"
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Search, Eye, ArrowUpDown, Activity, BrainCircuit, Cpu, Radio, ShieldAlert, Gauge, Timer, Database, IndianRupee, RefreshCw } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { useToast } from "@/hooks/use-toast-helper"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297 + 233280) * 10000; return x - Math.floor(x) }
function ri(min: number, max: number, seed: number): number { return Math.floor(seededRandom(seed) * (max - min + 1)) + min }
function fmtINR(n: number): string { const s = n < 0 ? "-" : "", a = Math.abs(n); if (a >= 1e7) return `₹${s}${(a / 1e7).toFixed(2)}Cr`; if (a >= 1e5) return `₹${s}${(a / 1e5).toFixed(2)}L`; if (a >= 1e3) return `₹${s}${(a / 1e3).toFixed(1)}K`; return `₹${s}${a.toLocaleString("en-IN")}` }
function filterData<T,>(data: T[], q: string): T[] { if (!q) return data; const l = q.toLowerCase(); return data.filter(i => Object.values(i as unknown as Record<string, string | number>).some(v => String(v).toLowerCase().includes(l))) }
function sortedData<T,>(data: T[], field: string, dir: "asc" | "desc"): T[] { return [...data].sort((a, b) => { const av = (a as unknown as Record<string, string | number>)[field], bv = (b as unknown as Record<string, string | number>)[field]; if (typeof av === "number" && typeof bv === "number") return dir === "asc" ? av - bv : bv - av; return dir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av)) }) }

const SENSOR_TYPES = ["Temperature 🌡️", "Humidity 💧", "Motion 🏃", "Weight ⚖️", "Light 💡", "Gas 🫧", "Vibration 🔊", "RFID 📡"] as const
const SENSOR_STS = ["Online", "Warning", "Offline", "Calibrating", "Faulty", "Replaced"] as const
const SIM_TYPES = ["Layout Optimization", "Throughput Max", "Storage Rearrange", "Staff Reallocate", "Automation ROI", "Energy Analysis", "Expansion Plan", "Disaster Recovery"] as const
const SIM_STS = ["Running", "Completed", "Queued", "Failed", "Paused", "Archived"] as const
const VIEW_TYPES = ["Floor Plan 🏗️", "Rack Layout 📦", "Traffic Flow 🔄", "Heat Map 🌡️", "Stock Map 📊", "Equipment Map ⚙️", "Safety Zones 🚨", "Energy Map ⚡"] as const
const VIEW_STS = ["Active", "Rendering", "Cached", "Updated", "Processing", "Error"] as const
const ANOM_TYPES = ["Temperature Spike 🌡️", "Humidity Drift 💧", "Unauthorized Motion 🏃", "Weight Mismatch ⚖️", "Equipment Failure ⚙️", "Zone Intrusion 🚨", "Power Fluctuation ⚡", "Data Gap 📉"] as const
const ANOM_SEV = ["Critical", "High", "Medium", "Low", "Info"] as const
const ANOM_RES = ["Open", "Investigating", "Resolved", "False Positive"] as const
const ZONES = ["Receiving", "Storage-A", "Storage-B", "Cold Room", "Packing", "Dispatch", "Returns", "Staging"] as const
const WHS = ["Mumbai WH", "Delhi NCR WH", "Bangalore WH", "Chennai WH", "Hyderabad WH", "Kolkata WH"] as const
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const
const TH = { blue: "#3b82f6", cyan: "#0891b2", violet: "#7c3aed", emerald: "#059669", amber: "#d97706", rose: "#e11d48" }
const PC = [TH.blue, TH.cyan, TH.violet, TH.emerald, TH.amber, TH.rose, "#6366f1", "#f97316"]

/* ═════════════ 16 Unique Visual Components ═════════════ */
function SensorTypeBadge({ type }: { type: string }) {
  const c: Record<string, string> = { "Temperature 🌡️": "bg-red-100 text-red-700", "Humidity 💧": "bg-blue-100 text-blue-700", "Motion 🏃": "bg-emerald-100 text-emerald-700", "Weight ⚖️": "bg-amber-100 text-amber-700", "Light 💡": "bg-yellow-100 text-yellow-800", "Gas 🫧": "bg-cyan-100 text-cyan-700", "Vibration 🔊": "bg-violet-100 text-violet-700", "RFID 📡": "bg-indigo-100 text-indigo-700" }
  return <span className={cn("wdt-sensor-type inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium", c[type] || "bg-gray-100")}>{type}</span>
}
function SensorStatusBadge({ status }: { status: string }) {
  const c: Record<string, string> = { Online: "bg-emerald-100 text-emerald-700", Warning: "bg-amber-100 text-amber-700", Offline: "bg-gray-200 text-gray-500", Calibrating: "bg-blue-100 text-blue-700", Faulty: "bg-red-100 text-red-700", Replaced: "bg-slate-100 text-slate-500" }
  return <span className={cn("wdt-sensor-sts inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold", c[status] || "")}>{status === "Online" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}{status}</span>
}
function BatteryBar({ pct }: { pct: number }) { const c = pct > 60 ? TH.emerald : pct > 20 ? TH.amber : TH.rose; return <div className="wdt-batt-bar w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: c }} /></div> }
function SignalBar({ strength }: { strength: number }) { const c = strength > 75 ? TH.emerald : strength > 50 ? TH.blue : strength > 25 ? TH.amber : TH.rose; return <div className="wdt-signal-bar w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${Math.min(strength, 100)}%`, background: c }} /></div> }
function ThresholdAlert({ exceeded }: { exceeded: boolean }) { return <span className={cn("wdt-thresh-alert inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold", exceeded ? "bg-red-100 text-red-700 shadow-sm shadow-red-300" : "bg-gray-50 text-gray-400")}>{exceeded ? "⚠ ALERT" : "Normal"}</span> }
function SimTypeBadge({ type }: { type: string }) {
  const c: Record<string, string> = { "Layout Optimization": "bg-blue-100 text-blue-700", "Throughput Max": "bg-emerald-100 text-emerald-700", "Storage Rearrange": "bg-amber-100 text-amber-700", "Staff Reallocate": "bg-violet-100 text-violet-700", "Automation ROI": "bg-cyan-100 text-cyan-700", "Energy Analysis": "bg-yellow-100 text-yellow-800", "Expansion Plan": "bg-indigo-100 text-indigo-700", "Disaster Recovery": "bg-rose-100 text-rose-700" }
  return <span className={cn("wdt-sim-type inline-flex px-1.5 py-0.5 rounded-full text-[10px] font-medium", c[type] || "bg-gray-100")}>{type}</span>
}
function SimStatusBadge({ status }: { status: string }) {
  const c: Record<string, string> = { Running: "bg-emerald-100 text-emerald-700", Completed: "bg-blue-100 text-blue-700", Queued: "bg-amber-100 text-amber-700", Failed: "bg-red-100 text-red-700", Paused: "bg-violet-100 text-violet-700", Archived: "bg-gray-200 text-gray-500" }
  return <span className={cn("wdt-sim-sts inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold", c[status] || "")}>{status === "Running" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}{status}</span>
}
function AccuracyBar({ pct }: { pct: number }) { const c = pct > 90 ? TH.emerald : pct > 70 ? TH.blue : pct > 50 ? TH.amber : TH.rose; return <div className="wdt-acc-bar w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: c }} /></div> }
function SavingsTile({ amount }: { amount: number }) { return <span className="wdt-savings inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600">{fmtINR(amount)}</span> }
function ResultBadge({ result }: { result: string }) { const c: Record<string, string> = { Improved: "bg-emerald-100 text-emerald-700", Degraded: "bg-red-100 text-red-700", Neutral: "bg-gray-200 text-gray-500" }; return <span className={cn("wdt-result inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold", c[result] || "bg-gray-100")}>{result}</span> }
function ViewTypeBadge({ type }: { type: string }) {
  const c: Record<string, string> = { "Floor Plan 🏗️": "bg-amber-100 text-amber-700", "Rack Layout 📦": "bg-blue-100 text-blue-700", "Traffic Flow 🔄": "bg-cyan-100 text-cyan-700", "Heat Map 🌡️": "bg-red-100 text-red-700", "Stock Map 📊": "bg-emerald-100 text-emerald-700", "Equipment Map ⚙️": "bg-violet-100 text-violet-700", "Safety Zones 🚨": "bg-rose-100 text-rose-700", "Energy Map ⚡": "bg-yellow-100 text-yellow-800" }
  return <span className={cn("wdt-view-type inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium", c[type] || "bg-gray-100")}>{type}</span>
}
function ResolutionBadge({ res }: { res: string }) { const c: Record<string, string> = { HD: "bg-blue-100 text-blue-700", SD: "bg-gray-100 text-gray-600", "3D": "bg-violet-100 text-violet-700", AR: "bg-cyan-100 text-cyan-700" }; return <span className={cn("wdt-res-badge inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold", c[res] || "bg-gray-100")}>{res}</span> }
function FramerateTile({ fps }: { fps: number }) { const c = fps >= 60 ? "text-emerald-600" : fps >= 30 ? "text-amber-600" : "text-red-600"; return <span className={cn("wdt-fps inline-flex items-center gap-0.5 text-[10px] font-bold tabular-nums", c)}>{fps} fps</span> }
function AnomalyTypeBadge({ type }: { type: string }) {
  const c: Record<string, string> = { "Temperature Spike 🌡️": "bg-red-100 text-red-700", "Humidity Drift 💧": "bg-blue-100 text-blue-700", "Unauthorized Motion 🏃": "bg-amber-100 text-amber-700", "Weight Mismatch ⚖️": "bg-orange-100 text-orange-700", "Equipment Failure ⚙️": "bg-rose-100 text-rose-700", "Zone Intrusion 🚨": "bg-violet-100 text-violet-700", "Power Fluctuation ⚡": "bg-yellow-100 text-yellow-800", "Data Gap 📉": "bg-gray-200 text-gray-600" }
  return <span className={cn("wdt-anom-type inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium", c[type] || "bg-gray-100")}>{type}</span>
}
function AnomalySeverityBadge({ severity }: { severity: string }) {
  const c: Record<string, string> = { Critical: "bg-red-600 text-white shadow-sm shadow-red-400", High: "bg-red-100 text-red-700", Medium: "bg-amber-100 text-amber-700", Low: "bg-blue-100 text-blue-700", Info: "bg-gray-100 text-gray-500" }
  return <span className={cn("wdt-anom-sev inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold", c[severity] || "")}>{severity === "Critical" && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse mr-1" />}{severity}</span>
}
function ResponseTimeTile({ mins }: { mins: number }) { const c = mins > 120 ? "text-red-600" : mins > 60 ? "text-amber-600" : "text-emerald-600"; return <span className={cn("wdt-resp-time inline-flex items-center gap-0.5 text-[10px] font-bold tabular-nums", c)}><Timer className="h-3 w-3" />{mins} min</span> }

/* ═════════════ Data Generation (265 records) ═════════════ */
function generateData() {
  const sensors = Array.from({ length: 75 }, (_, i) => {
    const st = SENSOR_TYPES[ri(0, 7, i * 3)]; const batt = ri(5, 100, i * 3 + 1); const sig = ri(10, 100, i * 3 + 2)
    const units: Record<string, string> = { "Temperature 🌡️": "°C", "Humidity 💧": "%", "Motion 🏃": "events", "Weight ⚖️": "kg", "Light 💡": "lux", "Gas 🫧": "ppm", "Vibration 🔊": "mm/s", "RFID 📡": "tags" }
    const thresholds: Record<string, number> = { "Temperature 🌡️": 40, "Humidity 💧": 80, "Motion 🏃": 500, "Weight ⚖️": 2000, "Light 💡": 1000, "Gas 🫧": 300, "Vibration 🔊": 25, "RFID 📡": 100 }
    const reading = ri(1, thresholds[st] + 20, i * 3 + 10); const thresh = thresholds[st]
    return {
      id: `SNS-${String(i + 1).padStart(4, "0")}`, type: st, status: SENSOR_STS[ri(0, 5, i * 3 + 3)],
      battery: batt, signal: sig, location: ZONES[ri(0, 7, i * 3 + 4)], warehouse: WHS[ri(0, 5, i * 3 + 12)],
      firmware: `v${ri(1, 5, i * 3 + 13)}.${ri(0, 9, i * 3 + 14)}.${ri(0, 20, i * 3 + 15)}`,
      installed: `${ri(1, 28, i * 3 + 16)}/${ri(1, 12, i * 3 + 17)}/2024`,
      lastReading: `${ri(1, 59, i * 3 + 11)}m ago`, threshold: thresh, reading,
      unit: units[st], exceeded: reading > thresh,
    }
  })
  const simulations = Array.from({ length: 70 }, (_, i) => {
    const acc = ri(30, 99, i * 4 + 2); const savings = ri(10000, 5000000, i * 4 + 3)
    const result = acc > 70 ? "Improved" : acc > 50 ? "Neutral" : "Degraded"
    return {
      id: `SIM-${String(i + 1).padStart(4, "0")}`, type: SIM_TYPES[ri(0, 7, i * 4)],
      status: SIM_STS[ri(0, 5, i * 4 + 1)],
      durationHrs: +(ri(1, 120, i * 4 + 4) + seededRandom(i * 4 + 5) * 0.9).toFixed(1),
      accuracy: acc, costSavings: savings, params: ri(3, 25, i * 4 + 6),
      iterations: ri(10, 500, i * 4 + 9),
      warehouse: WHS[ri(0, 5, i * 4 + 7)], engineer: `Eng-${ri(1, 20, i * 4 + 8)}`, result,
    }
  })
  const visualizations = Array.from({ length: 55 }, (_, i) => {
    const res = ["HD", "SD", "3D", "AR"][ri(0, 3, i * 5)]
    const fps = res === "HD" ? ri(45, 60, i * 5 + 1) : res === "3D" ? ri(24, 45, i * 5 + 2) : res === "AR" ? ri(15, 30, i * 5 + 3) : ri(15, 25, i * 5 + 4)
    return {
      id: `VIS-${String(i + 1).padStart(4, "0")}`, type: VIEW_TYPES[ri(0, 7, i * 5)],
      status: VIEW_STS[ri(0, 5, i * 5 + 1)], resolution: res, frameRate: fps,
      polygons: ri(10000, 500000, i * 5 + 2),
      loadTime: +(seededRandom(i * 5 + 3) * 15 + 0.5).toFixed(1),
      fileSize: +(seededRandom(i * 5 + 4) * 450 + 10).toFixed(1),
      warehouse: WHS[ri(0, 5, i * 5 + 8)],
      camera: `CAM-${ri(1, 12, i * 5 + 9)}`,
      lastRendered: `${ri(1, 28, i * 5 + 6)}/${ri(1, 12, i * 5 + 7)}/2024`,
    }
  })
  const anomalies = Array.from({ length: 65 }, (_, i) => {
    const sev = ANOM_SEV[ri(0, 4, i * 6)]
    const respTime = sev === "Critical" ? ri(5, 30, i * 6 + 1) : sev === "High" ? ri(15, 90, i * 6 + 2) : sev === "Medium" ? ri(30, 180, i * 6 + 3) : ri(60, 480, i * 6 + 4)
    const impacts = ["Minimal", "Moderate", "Significant", "Critical"]
    return {
      id: `ANM-${String(i + 1).padStart(4, "0")}`, type: ANOM_TYPES[ri(0, 7, i * 6)], severity: sev,
      sensorId: `SNS-${String(ri(1, 75, i * 6 + 1)).padStart(4, "0")}`,
      location: ZONES[ri(0, 7, i * 6 + 5)],
      detectedAt: `${ri(1, 28, i * 6 + 6)}/${ri(1, 12, i * 6 + 7)}/2024 ${String(ri(0, 23, i * 6 + 8)).padStart(2, "0")}:${String(ri(0, 59, i * 6 + 9)).padStart(2, "0")}`,
      resolved: ANOM_RES[ri(0, 3, i * 6 + 3)], responseTime: respTime,
      assignedTo: `Team-${ri(1, 8, i * 6 + 10)}`,
      impact: sev === "Critical" ? "Critical" : impacts[ri(0, 2, i * 6 + 4)],
    }
  })
  const kpis = [
    { label: "Active Twins", value: "24", icon: BrainCircuit, color: TH.blue, trend: "+3" },
    { label: "Sync Rate", value: "99.2%", icon: Activity, color: TH.cyan, trend: "+0.4%" },
    { label: "IoT Sensors", value: "1,847", icon: Radio, color: TH.emerald, trend: "+124" },
    { label: "Anomalies Detected", value: "156", icon: ShieldAlert, color: TH.rose, trend: "-12" },
    { label: "Prediction Accuracy", value: "94.7%", icon: Gauge, color: TH.violet, trend: "+1.2%" },
    { label: "Simulations Run", value: "892", icon: Cpu, color: TH.amber, trend: "+67" },
    { label: "Cost Savings", value: fmtINR(47500000), icon: IndianRupee, color: TH.emerald, trend: "+₹8.5L" },
    { label: "Data Points/sec", value: "24.5K", icon: Database, color: TH.cyan, trend: "+3.2K" },
  ]
  const sensorFlow = Array.from({ length: 24 }, (_, i) => ({ time: `${String(i).padStart(2, "0")}:00`, Temperature: ri(18, 42, i * 11 + 1), Humidity: ri(30, 85, i * 11 + 2), Motion: ri(50, 500, i * 11 + 3) }))
  const anomalyPie = ANOM_TYPES.map((t, i) => ({ name: t.split(" ")[0], value: ri(5, 30, i * 13 + 1) }))
  const zoneUtil = ZONES.map((z, i) => ({ zone: z, utilization: ri(40, 98, i * 17 + 1) }))
  const predTrend = MONTHS.map((m, i) => ({ month: m, accuracy: ri(85, 99, i * 19 + 1) }))
  const sensorHealth = [{ name: "Online", value: ri(800, 1200, 1) }, { name: "Warning", value: ri(100, 300, 2) }, { name: "Offline", value: ri(50, 150, 3) }]
  const simROI = SIM_TYPES.map((t, i) => ({ name: t.split(" ")[0], roi: ri(20, 350, i * 23 + 1) }))
  const anomFreq = MONTHS.map((m, i) => ({ month: m, anomalies: ri(8, 45, i * 29 + 1) }))
  const warehouseTwinCount = WHS.map((w, i) => ({ warehouse: w, twins: ri(2, 8, i * 31 + 1), sensors: ri(200, 500, i * 31 + 2) }))
  return { sensors, simulations, visualizations, anomalies, kpis, sensorFlow, anomalyPie, zoneUtil, predTrend, sensorHealth, simROI, anomFreq, warehouseTwinCount }
}

export default function WarehouseDigitalTwinView() {
  const [activeTab, setActiveTab] = useState("0")
  const [searchQ, setSearchQ] = useState("")
  const [sortField, setSortField] = useState("")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<Record<string, unknown> | null>(null)
  const { toast } = useToast()
  const data = useMemo(() => generateData(), [])
  const openSheet = (row: Record<string, unknown>) => {
    setSelectedRow(row); setSheetOpen(true)
    toast.success("Record Opened", `${row.id} details loaded`)
  }
  const filtered = useMemo(() => {
    const tab = parseInt(activeTab)
    const src = tab === 1 ? data.sensors : tab === 2 ? data.simulations : tab === 3 ? data.visualizations : tab === 4 ? data.anomalies : []
    return sortedData(filterData(src as unknown as Record<string, string | number>[], searchQ) as unknown as Record<string, string | number>[], sortField, sortDir)
  }, [activeTab, searchQ, sortField, sortDir, data])
  const toggleSort = (f: string) => { if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortField(f); setSortDir("asc") } }
  const tabLabel = activeTab === "1" ? "Sensors" : activeTab === "2" ? "Simulations" : activeTab === "3" ? "Visualizations" : "Anomalies"

  return (
    <div className="space-y-4">
      <PageHeader title="Warehouse Digital Twin" description="Real-time digital twin platform for warehouse simulation, IoT monitoring, and predictive analytics across Indian logistics hubs" />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="wdt-tabs-list">
          {["Digital Twin Dashboard", "IoT Sensor Network", "Simulation Engine", "3D Visualization", "Anomaly Detection", "Twin Analytics"].map((t, i) => (
            <TabsTrigger key={i} value={String(i)} className="wdt-tab-trigger">{t}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* ── Tab 0: Digital Twin Dashboard ── */}
      {activeTab === "0" && (
        <div className="space-y-4">
          <div className="wdt-kpi-grid grid grid-cols-2 md:grid-cols-4 gap-3">
            {data.kpis.map((k, i) => (
              <Card key={i} className="wdt-kpi-card"><CardContent className="p-3">
                <div className="flex items-center gap-2"><k.icon className="h-4 w-4" style={{ color: k.color }} /><span className="text-[10px] text-gray-500">{k.label}</span></div>
                <p className="text-lg font-bold mt-1">{k.value}</p>
                <span className="text-[10px] text-emerald-600">{k.trend}</span>
              </CardContent></Card>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="wdt-chart-card"><CardHeader className="pb-1"><CardTitle className="text-xs">Sensor Data Flow (24h)</CardTitle></CardHeader><CardContent>
              <AreaChart data={data.sensorFlow}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="time" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip />
                <Area type="monotone" dataKey="Temperature" stroke={TH.rose} fill="rgba(225,29,72,0.15)" />
                <Area type="monotone" dataKey="Humidity" stroke={TH.blue} fill="rgba(59,130,246,0.15)" />
                <Area type="monotone" dataKey="Motion" stroke={TH.emerald} fill="rgba(5,150,105,0.15)" />
              </AreaChart>
            </CardContent></Card>
            <Card className="wdt-chart-card"><CardHeader className="pb-1"><CardTitle className="text-xs">Anomaly Type Distribution</CardTitle></CardHeader><CardContent>
              <PieChart><Pie data={data.anomalyPie} cx="50%" cy="50%" innerRadius={35} outerRadius={65} dataKey="value" nameKey="name">
                {data.anomalyPie.map((_, i) => <Cell key={i} fill={PC[i % PC.length]} />)}
              </Pie><Tooltip /></PieChart>
            </CardContent></Card>
            <Card className="wdt-chart-card"><CardHeader className="pb-1"><CardTitle className="text-xs">Zone Utilization %</CardTitle></CardHeader><CardContent>
              <BarChart data={data.zoneUtil}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="zone" tick={{ fontSize: 8 }} angle={-35} /><YAxis tick={{ fontSize: 10 }} /><Tooltip />
                <Bar dataKey="utilization" fill={TH.blue} radius={[4, 4, 0, 0]} />
              </BarChart>
            </CardContent></Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="wdt-chart-card"><CardHeader className="pb-1"><CardTitle className="text-xs">Warehouse Twin Distribution</CardTitle></CardHeader><CardContent>
              <BarChart data={data.warehouseTwinCount} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" tick={{ fontSize: 10 }} /><YAxis dataKey="warehouse" type="category" tick={{ fontSize: 9 }} width={80} /><Tooltip />
                <Bar dataKey="twins" fill={TH.violet} radius={[0, 4, 4, 0]} /><Bar dataKey="sensors" fill={TH.cyan} radius={[0, 4, 4, 0]} />
              </BarChart>
            </CardContent></Card>
            <Card className="wdt-summary-card"><CardHeader className="pb-1"><CardTitle className="text-xs">Platform Summary</CardTitle></CardHeader><CardContent className="space-y-2">
              <div className="wdt-stat-row flex justify-between text-xs"><span className="text-gray-500">Total Records</span><span className="font-bold">265</span></div>
              <div className="wdt-stat-row flex justify-between text-xs"><span className="text-gray-500">Active Sensors</span><span className="font-bold text-emerald-600">{data.sensors.filter(s => s.status === "Online").length}/75</span></div>
              <div className="wdt-stat-row flex justify-between text-xs"><span className="text-gray-500">Running Sims</span><span className="font-bold text-blue-600">{data.simulations.filter(s => s.status === "Running").length}/70</span></div>
              <div className="wdt-stat-row flex justify-between text-xs"><span className="text-gray-500">Critical Anomalies</span><span className="font-bold text-red-600">{data.anomalies.filter(a => a.severity === "Critical").length}/65</span></div>
              <div className="wdt-stat-row flex justify-between text-xs"><span className="text-gray-500">Active Visuals</span><span className="font-bold text-violet-600">{data.visualizations.filter(v => v.status === "Active").length}/55</span></div>
              <div className="wdt-stat-row flex justify-between text-xs"><span className="text-gray-500">Total Savings</span><span className="font-bold text-emerald-600">{fmtINR(data.simulations.reduce((a, s) => a + s.costSavings, 0))}</span></div>
            </CardContent></Card>
          </div>
        </div>
      )}

      {/* ── Tabs 1-4: Data Tables with Search & Sort ── */}
      {activeTab !== "0" && activeTab !== "5" && (
        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <Search className="h-4 w-4 text-gray-400" />
            <Input placeholder="Search records..." value={searchQ} onChange={e => setSearchQ(e.target.value)} className="max-w-xs h-8 text-xs" />
            <Button variant="outline" size="sm" className="wdt-btn-sync h-8 text-xs" onClick={() => toast.info("Sync", "Data refresh initiated")}><RefreshCw className="h-3 w-3 mr-1" />Sync</Button>
            <span className="text-[10px] text-gray-400 ml-auto">{filtered.length} {tabLabel}</span>
          </div>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-[11px]">
              <thead><tr className="bg-gray-50 dark:bg-gray-900">
                {activeTab === "1" && <><th className="wdt-th p-2 text-left cursor-pointer" onClick={() => toggleSort("id")}>ID <ArrowUpDown className="h-3 w-3 inline" /></th><th className="p-2 text-left">Type</th><th className="p-2 text-left">Status</th><th className="p-2 text-left">Battery</th><th className="p-2 text-left">Signal</th><th className="p-2 text-left">Location</th><th className="p-2 text-left">Reading</th><th className="p-2 text-left">Threshold</th></>}
                {activeTab === "2" && <><th className="wdt-th p-2 text-left cursor-pointer" onClick={() => toggleSort("id")}>ID <ArrowUpDown className="h-3 w-3 inline" /></th><th className="p-2 text-left">Type</th><th className="p-2 text-left">Status</th><th className="p-2 text-left">Accuracy</th><th className="p-2 text-left">Savings</th><th className="p-2 text-left">Duration</th><th className="p-2 text-left">Warehouse</th><th className="p-2 text-left">Result</th></>}
                {activeTab === "3" && <><th className="wdt-th p-2 text-left cursor-pointer" onClick={() => toggleSort("id")}>ID <ArrowUpDown className="h-3 w-3 inline" /></th><th className="p-2 text-left">Type</th><th className="p-2 text-left">Status</th><th className="p-2 text-left">Resolution</th><th className="p-2 text-left">FPS</th><th className="p-2 text-left">Polygons</th><th className="p-2 text-left">Size</th><th className="p-2 text-left">Rendered</th></>}
                {activeTab === "4" && <><th className="wdt-th p-2 text-left cursor-pointer" onClick={() => toggleSort("id")}>ID <ArrowUpDown className="h-3 w-3 inline" /></th><th className="p-2 text-left">Type</th><th className="p-2 text-left">Severity</th><th className="p-2 text-left">Location</th><th className="p-2 text-left">Resolved</th><th className="p-2 text-left">Response</th><th className="p-2 text-left">Impact</th><th className="p-2 text-left">Detected</th></>}
                <th className="p-2">Action</th>
              </tr></thead>
              <tbody>{filtered.map((row, idx) => {
                const r = row as unknown as Record<string, string | number>
                return <tr key={idx} className="wdt-table-row border-t cursor-pointer hover:bg-blue-50/50" onClick={() => openSheet(row as unknown as Record<string, unknown>)}>
                  {activeTab === "1" && <><td className="p-2 font-mono">{String(r.id)}</td><td className="p-2"><SensorTypeBadge type={String(r.type)} /></td><td className="p-2"><SensorStatusBadge status={String(r.status)} /></td><td className="p-2 w-20"><BatteryBar pct={Number(r.battery)} /><span className="text-[9px] ml-1">{r.battery}%</span></td><td className="p-2 w-20"><SignalBar strength={Number(r.signal)} /><span className="text-[9px] ml-1">{r.signal}%</span></td><td className="p-2">{String(r.location)}</td><td className="p-2">{r.reading}{r.unit}</td><td className="p-2"><ThresholdAlert exceeded={r.exceeded as unknown as boolean} /></td></>}
                  {activeTab === "2" && <><td className="p-2 font-mono">{String(r.id)}</td><td className="p-2"><SimTypeBadge type={String(r.type)} /></td><td className="p-2"><SimStatusBadge status={String(r.status)} /></td><td className="p-2 w-20"><AccuracyBar pct={Number(r.accuracy)} /><span className="text-[9px] ml-1">{r.accuracy}%</span></td><td className="p-2"><SavingsTile amount={Number(r.costSavings)} /></td><td className="p-2">{r.durationHrs}h</td><td className="p-2">{String(r.warehouse)}</td><td className="p-2"><ResultBadge result={String(r.result)} /></td></>}
                  {activeTab === "3" && <><td className="p-2 font-mono">{String(r.id)}</td><td className="p-2"><ViewTypeBadge type={String(r.type)} /></td><td className="p-2"><SimStatusBadge status={String(r.status)} /></td><td className="p-2"><ResolutionBadge res={String(r.resolution)} /></td><td className="p-2"><FramerateTile fps={Number(r.frameRate)} /></td><td className="p-2">{Number(r.polygons).toLocaleString()}</td><td className="p-2">{r.fileSize}MB</td><td className="p-2">{String(r.lastRendered)}</td></>}
                  {activeTab === "4" && <><td className="p-2 font-mono">{String(r.id)}</td><td className="p-2"><AnomalyTypeBadge type={String(r.type)} /></td><td className="p-2"><AnomalySeverityBadge severity={String(r.severity)} /></td><td className="p-2">{String(r.location)}</td><td className="p-2">{String(r.resolved)}</td><td className="p-2"><ResponseTimeTile mins={Number(r.responseTime)} /></td><td className="p-2"><AnomalySeverityBadge severity={String(r.impact)} /></td><td className="p-2 text-[9px]">{String(r.detectedAt)}</td></>}
                  <td className="p-2"><Eye className="h-3.5 w-3.5 text-gray-400 hover:text-blue-600" /></td>
                </tr>
              })}</tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tab 5: Twin Analytics ── */}
      {activeTab === "5" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="wdt-chart-card"><CardHeader className="pb-1"><CardTitle className="text-xs">Prediction Accuracy Trend (12 months)</CardTitle></CardHeader><CardContent>
            <LineChart data={data.predTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} domain={[80, 100]} /><Tooltip />
              <Line type="monotone" dataKey="accuracy" stroke={TH.violet} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </CardContent></Card>
          <Card className="wdt-chart-card"><CardHeader className="pb-1"><CardTitle className="text-xs">Sensor Health Distribution</CardTitle></CardHeader><CardContent>
            <PieChart><Pie data={data.sensorHealth} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" nameKey="name">
              {data.sensorHealth.map((_, i) => <Cell key={i} fill={[TH.emerald, TH.amber, TH.rose][i]} />)}
            </Pie><Tooltip /></PieChart>
          </CardContent></Card>
          <Card className="wdt-chart-card"><CardHeader className="pb-1"><CardTitle className="text-xs">Simulation ROI %</CardTitle></CardHeader><CardContent>
            <BarChart data={data.simROI}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 8 }} angle={-30} /><YAxis tick={{ fontSize: 10 }} /><Tooltip />
              <Bar dataKey="roi" fill={TH.cyan} radius={[4, 4, 0, 0]} />
            </BarChart>
          </CardContent></Card>
          <Card className="wdt-chart-card"><CardHeader className="pb-1"><CardTitle className="text-xs">Anomaly Frequency (Monthly)</CardTitle></CardHeader><CardContent>
            <AreaChart data={data.anomFreq}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip />
              <Area type="monotone" dataKey="anomalies" stroke={TH.rose} fill="rgba(225,29,72,0.15)" />
            </AreaChart>
          </CardContent></Card>
        </div>
      )}

      {/* ── Detail Sheet with Gradient Header ── */}
      <Sheet open={!!(sheetOpen && selectedRow)} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[420px] overflow-y-auto">
          <SheetHeader>
            <div className="wdt-sheet-header bg-gradient-to-r from-blue-600 via-cyan-600 to-violet-600 text-white p-4 -mx-6 -mt-6 mb-4 rounded-t-lg">
              <SheetTitle className="text-white text-sm">{String(selectedRow?.id || "Details")}</SheetTitle>
            </div>
          </SheetHeader>
          {selectedRow && Object.entries(selectedRow).filter(([k]) => k !== "id").map(([key, val]) => (
            <div key={key} className="wdt-detail-row flex justify-between py-2 px-2 border-b border-gray-100 text-xs">
              <span className="text-gray-500 capitalize">{key}</span><span className="font-medium">{String(val)}</span>
            </div>
          ))}
        </SheetContent>
      </Sheet>
    </div>
  )
}
