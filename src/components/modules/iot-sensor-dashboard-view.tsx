"use client"

import React, { useState, useMemo } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { useToast } from "@/hooks/use-toast-helper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Eye, Search, Filter, Activity } from "lucide-react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts"
import { ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

/* ═══════ Constants & Enums ═══════ */
const C = { teal: "#0d9488", amber: "#d97706", blue: "#3b82f6", rose: "#e11d48", violet: "#7c3aed", emerald: "#059669" }
const CC = [C.teal, C.amber, C.blue, C.rose, C.violet, C.emerald, "#475569", "#ea580c"]

const SENSOR_TYPES = ["Temperature", "Humidity", "Motion", "Proximity", "Pressure", "Light", "Gas/CO2", "Vibration"] as const
const SENSOR_MODELS = ["DHT-22 Pro", "HC-SR501", "VL53L0X", "BME-280", "MQ-135", "MPU-6050", "BH-1750", "PIR-325"] as const
const SENSOR_STATUSES = ["Online", "Offline", "Low Battery", "Calibrating", "Error", "Maintenance", "Idle", "Deprecated"] as const
const READING_METRICS = ["Temperature °C", "Humidity %", "Motion Count", "Distance cm", "Pressure hPa", "Light Lux", "CO2 ppm", "Vibration Hz"] as const
const ALERT_TYPES = ["Threshold Breach", "Connection Lost", "Battery Low", "Calibration Drift", "Hardware Failure", "Data Gap", "Environmental", "Security"] as const
const ALERT_SEVERITIES = ["Critical", "High", "Medium", "Low"] as const
const ALERT_STATUSES = ["New", "Acknowledged", "Investigating", "Resolved", "Escalated", "False Positive"] as const
const MAINT_TYPES = ["Preventive", "Corrective", "Calibration", "Firmware Update", "Battery Replace", "Deep Clean", "Sensor Replace", "Network Repair"] as const
const MAINT_STATUSES = ["Scheduled", "In Progress", "Completed", "Overdue", "Cancelled", "Deferred"] as const
const INDIAN_WAREHOUSES = ["Mumbai Central WH", "Delhi NCR Hub", "Bangalore South", "Chennai Port WH", "Hyderabad HITEC", "Pune Industrial", "Kolkata East", "Ahmedabad West", "Jaipur North", "Lucknow Central", "Nagpur MIDC", "Indore Pithampur"] as const
const INDIAN_ZONES = ["Zone A - Receiving", "Zone B - Storage", "Zone C - Cold Storage", "Zone D - Picking", "Zone E - Packing", "Zone F - Dispatch", "Zone G - Returns", "Zone H - QC Lab"] as const

const ST_EMOJI: Record<string, string> = { Temperature: "🌡️", Humidity: "💧", Motion: "🔄", Proximity: "📏", Pressure: "💨", Light: "💡", "Gas/CO2": "💨", Vibration: "📳" }
const SEV_COL: Record<string, string> = { Critical: C.rose, High: C.amber, Medium: C.blue, Low: C.emerald }
const SSTATUS_COL: Record<string, string> = { Online: C.emerald, Offline: "#475569", "Low Battery": C.amber, Calibrating: C.blue, Error: C.rose, Maintenance: C.violet, Idle: "#6b7280", Deprecated: "#9ca3af" }
const ASTATUS_COL: Record<string, string> = { New: C.rose, Acknowledged: C.amber, Investigating: C.blue, Resolved: C.emerald, Escalated: C.violet, "False Positive": "#6b7280" }
const MSTATUS_COL: Record<string, string> = { Scheduled: C.blue, "In Progress": C.amber, Completed: C.emerald, Overdue: C.rose, Cancelled: "#475569", Deferred: C.violet }
const SIGNAL_COL: Record<string, string> = { Excellent: C.emerald, Good: C.blue, Fair: C.amber, Poor: C.rose }

/* ═══════ Helpers ═══════ */
function seededRandom(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 12345) % 2147483647; return (s & 0x7fffffff) / 0x7fffffff }
}
function ri(min: number, max: number, seed: number) {
  const r = seededRandom(seed)
  return Math.floor(r() * (max - min + 1)) + min
}
function formatINR(v: number) {
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)} Cr`
  if (v >= 100000) return `₹${(v / 100000).toFixed(2)} L`
  return `₹${v.toLocaleString("en-IN")}`
}

/* ═══════ Data Generation ═══════ */
function generateData() {
  const s = seededRandom(2150)
  const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(s() * arr.length)]
  const ri2 = (min: number, max: number) => Math.floor(s() * (max - min + 1)) + min

  const sensors = Array.from({ length: 75 }, (_, i) => {
    const st = pick(SENSOR_STATUSES)
    return {
      id: `IOT-${String(i + 1).padStart(4, "0")}`, type: pick(SENSOR_TYPES), model: pick(SENSOR_MODELS),
      warehouse: pick(INDIAN_WAREHOUSES), zone: pick(INDIAN_ZONES), status: st,
      battery: st === "Low Battery" ? ri2(5, 18) : ri2(30, 100),
      signal: pick(["Excellent", "Good", "Fair", "Poor"]),
      lastReading: `2026-07-28 ${String(ri2(0, 23)).padStart(2, "0")}:${String(ri2(0, 59)).padStart(2, "0")}`,
      installDate: `2024-${String(ri2(1, 12)).padStart(2, "0")}-${String(ri2(1, 28)).padStart(2, "0")}`,
      firmware: `v${ri2(1, 5)}.${ri2(0, 9)}.${ri2(0, 30)}`, mac: Array.from({ length: 6 }, () => ri2(0, 255).toString(16).padStart(2, "0")).join(":"),
    }
  })

  const readings = Array.from({ length: 70 }, (_, i) => {
    const m = pick(READING_METRICS)
    const unit = m.includes("°C") ? "°C" : m.includes("%") ? "%" : m.includes("cm") ? "cm" : m.includes("hPa") ? "hPa" : m.includes("Lux") ? "Lux" : m.includes("ppm") ? "ppm" : m.includes("Hz") ? "Hz" : ""
    const rawVal = +(s() * 100).toFixed(1)
    const threshold = +(rawVal * (0.6 + s() * 0.3)).toFixed(1)
    const status = rawVal > threshold * 1.2 ? "Critical" : rawVal > threshold ? "Warning" : "Normal"
    return {
      id: `RDG-${String(i + 1).padStart(4, "0")}`, sensorId: pick(sensors).id, sensorType: pick(SENSOR_TYPES),
      warehouse: pick(INDIAN_WAREHOUSES), zone: pick(INDIAN_ZONES), metric: m,
      value: rawVal, unit, min: +(rawVal * 0.7).toFixed(1), max: +(rawVal * 1.3).toFixed(1),
      threshold, status, timestamp: `2026-07-28 ${String(ri2(0, 23)).padStart(2, "0")}:${String(ri2(0, 59)).padStart(2, "0")}`,
      quality: +(s() * 5 + 95).toFixed(1),
    }
  })

  const alerts = Array.from({ length: 65 }, (_, i) => {
    const sev = pick(ALERT_SEVERITIES)
    return {
      id: `ALT-${String(i + 1).padStart(4, "0")}`, type: pick(ALERT_TYPES), severity: sev,
      status: pick(ALERT_STATUSES), sensorId: pick(sensors).id, sensorType: pick(SENSOR_TYPES),
      warehouse: pick(INDIAN_WAREHOUSES), zone: pick(INDIAN_ZONES),
      message: `${pick(ALERT_TYPES)} detected at sensor in ${pick(INDIAN_ZONES)} area of ${pick(INDIAN_WAREHOUSES)}`,
      value: +(s() * 50).toFixed(1), thresholdVal: +(s() * 30 + 10).toFixed(1),
      duration: `${ri2(1, 120)}m ${ri2(0, 59)}s`,
      timestamp: `2026-07-28 ${String(ri2(0, 23)).padStart(2, "0")}:${String(ri2(0, 59)).padStart(2, "0")}`,
      acknowledged: s() > 0.4, resolved: s() > 0.5,
      impact: formatINR(ri(1000, 50000, 2150 + i)),
    }
  })

  const technicians = ["Rajesh Kumar", "Suresh Patel", "Amit Singh", "Vikram Sharma", "Ravi Gupta", "Manoj Joshi", "Anil Deshmukh", "Pradeep Rao", "Sanjay Verma", "Deepak Mishra", "Kiran Nair", "Arun Reddy"]
  const maintenance = Array.from({ length: 55 }, (_, i) => {
    const ms = pick(MAINT_STATUSES)
    return {
      id: `MNT-${String(i + 1).padStart(4, "0")}`, type: pick(MAINT_TYPES), sensorId: pick(sensors).id,
      sensorType: pick(SENSOR_TYPES), warehouse: pick(INDIAN_WAREHOUSES), zone: pick(INDIAN_ZONES),
      status: ms, priority: pick(["Critical", "High", "Medium", "Low"]),
      technician: pick(technicians),
      scheduledDate: `2026-07-${String(ri2(1, 28)).padStart(2, "0")}`,
      completedDate: ms === "Completed" ? `2026-07-${String(ri2(1, 28)).padStart(2, "0")}` : ms === "In Progress" ? "—" : "—",
      cost: ri2(500, 50000), notes: `${pick(MAINT_TYPES)} scheduled for sensor ${pick(sensors).id}. ${pick(["Routine check", "Escalation from alert", "Firmware upgrade needed", "Physical inspection required", "Network connectivity fix"])}`,
      estimatedHours: ri2(1, 8),
    }
  })

  const hourLabels = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`)
  const hourlyData = hourLabels.map(h => ({
    hour: h.substring(0, 5), temp: +(s() * 15 + 20).toFixed(1), humidity: +(s() * 30 + 40).toFixed(1), co2: Math.floor(s() * 200 + 400),
  }))

  return { sensors, readings, alerts, maintenance, hourlyData }
}

/* ═══════ Visual Badge Components ═══════ */
function SensorTypeBadge({ type }: { type: string }) {
  const idx = SENSOR_TYPES.indexOf(type as typeof SENSOR_TYPES[number])
  return <Badge className="badge-interactive isd-sensor-type-badge" style={{ background: CC[idx] ?? CC[0], color: "#fff" }}>{ST_EMOJI[type] ?? "📡"} {type}</Badge>
}

function SensorStatusBadge({ status }: { status: string }) {
  const pulse = status === "Online" || status === "Calibrating" || status === "Error" || status === "Low Battery"
  return <Badge className={cn("isd-status-badge", pulse && "isd-pulse")} style={{ background: SSTATUS_COL[status] ?? "#475569", color: "#fff" }}>{status}</Badge>
}

function BatteryLevelBar({ level }: { level: number }) {
  const col = level > 60 ? C.emerald : level > 20 ? C.amber : C.rose
  const icon = level > 60 ? "🟢" : level > 20 ? "🟡" : "🔴"
  return (
    <div className="isd-battery-bar-wrap">
      <div className="isd-battery-track"><div className="isd-battery-fill" style={{ width: `${Math.max(level, 2)}%`, background: col }} /></div>
      <span className="isd-battery-label">{icon} {level}%</span>
    </div>
  )
}

function SignalBadge({ signal }: { signal: string }) {
  return <Badge variant="outline" className="badge-interactive isd-signal-badge" style={{ borderColor: SIGNAL_COL[signal] ?? "#475569", color: SIGNAL_COL[signal] ?? "#475569" }}>📶 {signal}</Badge>
}

function MetricBadge({ metric }: { metric: string }) {
  const idx = READING_METRICS.indexOf(metric as typeof READING_METRICS[number])
  return <Badge variant="outline" className="badge-interactive isd-metric-badge" style={{ borderColor: CC[idx] ?? CC[0], color: CC[idx] ?? CC[0] }}>{metric}</Badge>
}

function ValueTile({ value, unit, status }: { value: number; unit: string; status: string }) {
  const col = status === "Critical" ? C.rose : status === "Warning" ? C.amber : C.emerald
  return <span className="isd-value-tile" style={{ background: `${col}18`, color: col, border: `1px solid ${col}40` }}>{value} {unit}</span>
}

function AlertTypeBadge({ type }: { type: string }) {
  const idx = ALERT_TYPES.indexOf(type as typeof ALERT_TYPES[number])
  return <Badge variant="outline" className="badge-interactive isd-alert-type-badge" style={{ borderColor: CC[idx] ?? CC[0], color: CC[idx] ?? CC[0] }}>{type}</Badge>
}

function AlertSeverityBadge({ severity }: { severity: string }) {
  const pulse = severity === "Critical"
  return <Badge className={cn("isd-sev-badge", pulse && "isd-pulse")} style={{ background: SEV_COL[severity] ?? "#475569", color: "#fff" }}>{severity}</Badge>
}

function AlertStatusBadge({ status }: { status: string }) {
  const pulse = status === "New" || status === "Investigating"
  return <Badge className={cn("isd-alert-status-badge", pulse && "isd-pulse")} style={{ background: ASTATUS_COL[status] ?? "#475569", color: "#fff" }}>{status}</Badge>
}

function MaintTypeBadge({ type }: { type: string }) {
  const idx = MAINT_TYPES.indexOf(type as typeof MAINT_TYPES[number])
  return <Badge variant="outline" className="badge-interactive isd-maint-type-badge" style={{ borderColor: CC[idx] ?? CC[0], color: CC[idx] ?? CC[0] }}>{type}</Badge>
}

function MaintStatusBadge({ status }: { status: string }) {
  const pulse = status === "Overdue" || status === "In Progress"
  return <Badge className={cn("isd-maint-status-badge", pulse && "isd-pulse")} style={{ background: MSTATUS_COL[status] ?? "#475569", color: "#fff" }}>{status}</Badge>
}

function PriorityBadge({ priority }: { priority: string }) {
  return <Badge className="badge-interactive isd-priority-badge" style={{ background: SEV_COL[priority] ?? "#475569", color: "#fff" }}>⏱ {priority}</Badge>
}

function ZoneBadge({ zone }: { zone: string }) {
  const idx = INDIAN_ZONES.indexOf(zone as typeof INDIAN_ZONES[number])
  const short = zone.replace("Zone ", "").split(" - ")[0]
  return <Badge variant="outline" className="badge-interactive isd-zone-badge" style={{ borderColor: CC[idx] ?? CC[0], color: CC[idx] ?? CC[0] }}>{short}</Badge>
}

function WarehouseBadge({ warehouse }: { warehouse: string }) {
  return <Badge variant="secondary" className="badge-interactive isd-warehouse-badge">{warehouse.split(" ").slice(0, 2).join(" ")}</Badge>
}

function DurationTile({ duration }: { duration: string }) {
  return <span className="isd-duration-tile">⏱ {duration}</span>
}

function CostTile({ cost }: { cost: number }) {
  return <span className="isd-cost-tile">{formatINR(cost)}</span>
}

/* ═══════ KPI Card ═══════ */
function KpiCard({ label, value, color, icon }: { label: string; value: string | number; color: string; icon: string }) {
  return (
    <Card className="hover-lift-sm isd-kpi-card">
      <CardContent className="inner-glow glass-subtle p-4">
        <div className="flex items-center gap-3">
          <div className="isd-kpi-icon" style={{ background: `${color}18`, color, width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>{icon}</div>
          <div><p className="isd-kpi-label text-xs text-muted-foreground">{label}</p><p className="isd-kpi-value text-lg font-bold" style={{ color }}>{value}</p></div>
        </div>
      </CardContent>
    </Card>
  )
}

/* ═══════ Sheet Gradient Header ═══════ */
function GradientHeader({ from, to, title, subtitle }: { from: string; to: string; title: string; subtitle: string }) {
  return (
    <div className="isd-gradient-header rounded-t-lg p-4 -m-6 mb-0" style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}>
      <h3 className="text-white font-semibold text-lg">{title}</h3>
      <p className="text-white/80 text-sm mt-0.5">{subtitle}</p>
    </div>
  )
}

/* ═══════ Detail Field ═══════ */
function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="flex justify-between items-center py-1.5 border-b border-border/50 last:border-0"><span className="text-xs text-muted-foreground">{label}</span><span className="text-xs font-medium">{value}</span></div>
}

/* ═══════ Main Component ═══════ */
export default function IoTSensorDashboardView() {
  const { toast } = useToast()
  const data = useMemo(() => generateData(), [])
  const [activeTab, setActiveTab] = useState("0")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterSeverity, setFilterSeverity] = useState("all")
  const [sheetOpen, setSheetOpen] = useState<string | null>(null)

  const openSheet = (id: string) => { setSheetOpen(id); toast.info("View Details", `Opening details for ${id}`) }
  const closeSheet = () => setSheetOpen(null)
  const selectedSensor = data.sensors.find(s => s.id === sheetOpen)
  const selectedAlert = data.alerts.find(a => a.id === sheetOpen)

  /* ─── Tab 0 KPIs ─── */
  const kpis0 = useMemo(() => {
    const online = data.sensors.filter(s => s.status === "Online").length
    const onlineRate = ((online / data.sensors.length) * 100).toFixed(1)
    const tempSensors = data.sensors.filter(s => s.type === "Temperature")
    const avgTemp = +(22 + seededRandom(2150)() * 8).toFixed(1)
    const activeAlerts = data.alerts.filter(a => a.status !== "Resolved" && a.status !== "False Positive").length
    const lowBatt = data.sensors.filter(s => s.status === "Low Battery").length
    const dataGaps = ri(3, 18, 2150)
    const uptime = (97 + seededRandom(2150)() * 3).toFixed(1)
    const maintDue = data.maintenance.filter(m => m.status === "Scheduled" || m.status === "Overdue").length
    return [
      { label: "Total Sensors", value: data.sensors.length, color: C.teal, icon: "📡" },
      { label: "Online Rate", value: `${onlineRate}%`, color: C.emerald, icon: "✅" },
      { label: "Avg Temperature", value: `${avgTemp}°C`, color: C.amber, icon: "🌡️" },
      { label: "Active Alerts", value: activeAlerts, color: C.rose, icon: "🚨" },
      { label: "Low Battery", value: lowBatt, color: C.amber, icon: "🔋" },
      { label: "Data Gaps Today", value: dataGaps, color: C.blue, icon: "📉" },
      { label: "Uptime %", value: `${uptime}%`, color: C.violet, icon: "📈" },
      { label: "Maintenance Due", value: maintDue, color: C.teal, icon: "🔧" },
    ]
  }, [data])

  const sensorTypeDist = useMemo(() => SENSOR_TYPES.map((t, i) => ({ name: t, value: data.sensors.filter(s => s.type === t).length, fill: CC[i] })), [data])
  const alertsByWH = useMemo(() => INDIAN_WAREHOUSES.map(w => ({ name: w.split(" ")[0], alerts: data.alerts.filter(a => a.warehouse === w).length })), [data])

  /* ─── Filtered Data ─── */
  const filteredSensors = useMemo(() => {
    let arr = [...data.sensors]
    if (filterStatus !== "all") arr = arr.filter(s => s.status === filterStatus)
    if (searchTerm) arr = arr.filter(s => s.id.toLowerCase().includes(searchTerm.toLowerCase()) || s.type.toLowerCase().includes(searchTerm.toLowerCase()) || s.warehouse.toLowerCase().includes(searchTerm.toLowerCase()))
    return arr.sort((a, b) => a.id.localeCompare(b.id))
  }, [data, filterStatus, searchTerm])

  const filteredAlerts = useMemo(() => {
    let arr = [...data.alerts]
    if (filterSeverity !== "all") arr = arr.filter(a => a.severity === filterSeverity)
    if (searchTerm) arr = arr.filter(a => a.id.toLowerCase().includes(searchTerm.toLowerCase()) || a.type.toLowerCase().includes(searchTerm.toLowerCase()) || a.warehouse.toLowerCase().includes(searchTerm.toLowerCase()))
    return arr.sort((a, b) => a.id.localeCompare(b.id))
  }, [data, filterSeverity, searchTerm])

  const filteredMaint = useMemo(() => {
    if (searchTerm) return data.maintenance.filter(m => m.id.toLowerCase().includes(searchTerm.toLowerCase()) || m.type.toLowerCase().includes(searchTerm.toLowerCase()) || m.warehouse.toLowerCase().includes(searchTerm.toLowerCase()))
    return data.maintenance
  }, [data, searchTerm])

  /* ─── Tab 5 KPIs ─── */
  const kpis5 = useMemo(() => [
    { label: "Avg Response Time", value: `${(1.2 + seededRandom(2150)() * 0.8).toFixed(1)}s`, color: C.teal, icon: "⚡" },
    { label: "Prediction Accuracy", value: `${(92 + seededRandom(2150)() * 6).toFixed(1)}%`, color: C.emerald, icon: "🎯" },
    { label: "Energy Saved", value: formatINR(ri(200000, 800000, 2150)), color: C.amber, icon: "💡" },
    { label: "Alerts Resolved", value: `${data.alerts.filter(a => a.status === "Resolved").length}/${data.alerts.length}`, color: C.blue, icon: "✅" },
    { label: "Uptime Trend", value: "+2.1%", color: C.emerald, icon: "📈" },
    { label: "Sensor ROI", value: `${(3.2 + seededRandom(2150)() * 1.5).toFixed(1)}x`, color: C.violet, icon: "💰" },
    { label: "Data Quality", value: `${(95 + seededRandom(2150)() * 4).toFixed(1)}%`, color: C.teal, icon: "📊" },
    { label: "Maint Savings", value: formatINR(ri(500000, 1500000, 2150)), color: C.rose, icon: "💸" },
  ], [data])

  const uptimeTrend = useMemo(() => ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => ({ month: m, uptime: +(97 + seededRandom(2150)() * 2.9).toFixed(1) })), [])
  const alertResByType = useMemo(() => ALERT_TYPES.map(t => ({ type: t.split(" ")[0], resolved: data.alerts.filter(a => a.type === t && a.status === "Resolved").length, total: data.alerts.filter(a => a.type === t).length })), [data])
  const topProblemWH = useMemo(() => [...INDIAN_WAREHOUSES].sort((a, b) => data.alerts.filter(x => x.warehouse === b).length - data.alerts.filter(x => x.warehouse === a).length).slice(0, 10).map(w => ({ name: w.split(" ")[0], count: data.alerts.filter(x => x.warehouse === w).length })), [data])
  const costTrend = useMemo(() => ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map(m => ({ month: m, preventive: ri(80000, 200000, 2150), corrective: ri(30000, 100000, 2150), emergency: ri(10000, 50000, 2150) })), [])

  return (
    <div className="isd-root space-y-4">
      <PageHeader title="IoT Sensor Dashboard" description="Real-time monitoring of warehouse sensors, alerts, and maintenance across 12 Indian facilities" />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="isd-tabs-list w-full flex-wrap h-auto gap-1">
          {["Sensor Dashboard", "Sensor Fleet", "Real-Time Readings", "Alert Management", "Maintenance Tracker", "Sensor Analytics"].map((t, i) => (
            <TabsTrigger key={i} value={String(i)} className="text-xs px-2 py-1">{t}</TabsTrigger>
          ))}
        </TabsList>

        {/* ═══ Tab 0: Sensor Dashboard ═══ */}
        {activeTab === "0" && (
          <div className="isd-tab-content space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{kpis0.map((k, i) => <KpiCard key={i} {...k} />)}</div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="hover-lift-sm lg:col-span-2">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">24h Sensor Readings</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={data.hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={2} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Area type="monotone" dataKey="temp" stackId="1" stroke={C.rose} fill={C.rose} fillOpacity={0.3} name="Temp °C" />
                      <Area type="monotone" dataKey="humidity" stackId="1" stroke={C.blue} fill={C.blue} fillOpacity={0.3} name="Humidity %" />
                      <Area type="monotone" dataKey="co2" stackId="1" stroke={C.amber} fill={C.amber} fillOpacity={0.3} name="CO2 ppm" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Sensor Type Distribution</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={sensorTypeDist} dataKey="value" cx="50%" cy="50%" outerRadius={80} innerRadius={40} label={({ name, value }) => `${name}: ${value}`} labelLine={false} fontSize={9}>
                        {sensorTypeDist.map((e, i) => <Cell key={i} fill={e.fill} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Alerts by Warehouse</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={alertsByWH}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" height={50} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Bar dataKey="alerts" fill={C.rose} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ═══ Tab 1: Sensor Fleet ═══ */}
        {activeTab === "1" && (
          <div className="isd-tab-content space-y-4">
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative"><Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" /><Input placeholder="Search sensors..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-8 w-56 h-9" /></div>
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select className="isd-filter-select h-9 rounded-md border bg-background px-3 text-sm" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                {SENSOR_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <Badge variant="secondary" className="badge-interactive ml-auto text-xs">{filteredSensors.length} sensors</Badge>
            </div>
            <Card><CardContent className="inner-glow glass-subtle p-0"><ScrollArea className="max-h-[520px]"><Table><TableHeader><TableRow>
              <TableHead className="text-xs h-9">Sensor</TableHead><TableHead className="text-xs h-9">Type</TableHead><TableHead className="text-xs h-9 hidden md:table-cell">Model</TableHead>
              <TableHead className="text-xs h-9">Warehouse</TableHead><TableHead className="text-xs h-9 hidden lg:table-cell">Zone</TableHead><TableHead className="text-xs h-9">Status</TableHead>
              <TableHead className="text-xs h-9 hidden sm:table-cell">Battery</TableHead><TableHead className="text-xs h-9 hidden lg:table-cell">Signal</TableHead><TableHead className="text-xs h-9 hidden md:table-cell">Last Reading</TableHead><TableHead className="text-xs h-9 w-10"></TableHead>
            </TableRow></TableHeader><TableBody>
              {filteredSensors.map(sensor => (
                <TableRow key={sensor.id} className="hover:bg-muted/50">
                  <TableCell className="text-xs font-mono font-medium">{sensor.id}</TableCell>
                  <TableCell><SensorTypeBadge type={sensor.type} /></TableCell>
                  <TableCell className="text-xs hidden md:table-cell">{sensor.model}</TableCell>
                  <TableCell><WarehouseBadge warehouse={sensor.warehouse} /></TableCell>
                  <TableCell className="hidden lg:table-cell"><ZoneBadge zone={sensor.zone} /></TableCell>
                  <TableCell><SensorStatusBadge status={sensor.status} /></TableCell>
                  <TableCell className="hidden sm:table-cell"><BatteryLevelBar level={sensor.battery} /></TableCell>
                  <TableCell className="hidden lg:table-cell"><SignalBadge signal={sensor.signal} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground hidden md:table-cell">{sensor.lastReading}</TableCell>
                  <TableCell><Button variant="ghost" size="icon" className="press-scale h-7 w-7" onClick={() => openSheet(sensor.id)}><Eye className="h-3.5 w-3.5" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody></Table></ScrollArea></CardContent></Card>
          </div>
        )}

        {/* ═══ Tab 2: Real-Time Readings ═══ */}
        {activeTab === "2" && (
          <div className="isd-tab-content space-y-4">
            <div className="flex items-center gap-2"><Activity className="h-4 w-4 text-teal-500" /><span className="text-sm text-muted-foreground">{data.readings.length} real-time readings</span></div>
            <Card><CardContent className="inner-glow glass-subtle p-0"><ScrollArea className="max-h-[520px]"><Table><TableHeader><TableRow>
              <TableHead className="text-xs h-9">Reading</TableHead><TableHead className="text-xs h-9">Sensor</TableHead><TableHead className="text-xs h-9 hidden md:table-cell">Warehouse</TableHead>
              <TableHead className="text-xs h-9 hidden lg:table-cell">Zone</TableHead><TableHead className="text-xs h-9">Metric</TableHead><TableHead className="text-xs h-9">Value</TableHead>
              <TableHead className="text-xs h-9 hidden sm:table-cell">Min</TableHead><TableHead className="text-xs h-9 hidden sm:table-cell">Max</TableHead><TableHead className="text-xs h-9">Status</TableHead><TableHead className="text-xs h-9 hidden md:table-cell">Time</TableHead>
            </TableRow></TableHeader><TableBody>
              {data.readings.map(r => (
                <TableRow key={r.id} className="hover:bg-muted/50">
                  <TableCell className="text-xs font-mono font-medium">{r.id}</TableCell>
                  <TableCell className="text-xs"><span className="font-mono">{r.sensorId}</span> <span className="text-muted-foreground">({r.sensorType})</span></TableCell>
                  <TableCell className="hidden md:table-cell"><WarehouseBadge warehouse={r.warehouse} /></TableCell>
                  <TableCell className="hidden lg:table-cell"><ZoneBadge zone={r.zone} /></TableCell>
                  <TableCell><MetricBadge metric={r.metric} /></TableCell>
                  <TableCell><ValueTile value={r.value} unit={r.unit} status={r.status} /></TableCell>
                  <TableCell className="numeric-cell hidden sm:table-cell"><ValueTile value={r.min} unit={r.unit} status="Normal" /></TableCell>
                  <TableCell className="numeric-cell hidden sm:table-cell"><ValueTile value={r.max} unit={r.unit} status="Warning" /></TableCell>
                  <TableCell><SensorStatusBadge status={r.status === "Normal" ? "Online" : r.status === "Warning" ? "Low Battery" : "Error"} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground hidden md:table-cell">{r.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody></Table></ScrollArea></CardContent></Card>
          </div>
        )}

        {/* ═══ Tab 3: Alert Management ═══ */}
        {activeTab === "3" && (
          <div className="isd-tab-content space-y-4">
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative"><Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" /><Input placeholder="Search alerts..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-8 w-56 h-9" /></div>
              <select className="isd-filter-select h-9 rounded-md border bg-background px-3 text-sm" value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)}>
                <option value="all">All Severity</option>
                {ALERT_SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <Badge variant="secondary" className="badge-interactive ml-auto text-xs">{filteredAlerts.length} alerts</Badge>
            </div>
            <Card><CardContent className="inner-glow glass-subtle p-0"><ScrollArea className="max-h-[520px]"><Table><TableHeader><TableRow>
              <TableHead className="text-xs h-9">Alert</TableHead><TableHead className="text-xs h-9">Type</TableHead><TableHead className="text-xs h-9">Severity</TableHead>
              <TableHead className="text-xs h-9">Status</TableHead><TableHead className="text-xs h-9 hidden md:table-cell">Sensor</TableHead><TableHead className="text-xs h-9 hidden lg:table-cell">Warehouse</TableHead>
              <TableHead className="text-xs h-9 hidden lg:table-cell">Zone</TableHead><TableHead className="text-xs h-9">Value / Thresh</TableHead><TableHead className="text-xs h-9 hidden sm:table-cell">Duration</TableHead><TableHead className="text-xs h-9 w-10"></TableHead>
            </TableRow></TableHeader><TableBody>
              {filteredAlerts.map(alert => (
                <TableRow key={alert.id} className="hover:bg-muted/50">
                  <TableCell className="text-xs font-mono font-medium">{alert.id}</TableCell>
                  <TableCell><AlertTypeBadge type={alert.type} /></TableCell>
                  <TableCell><AlertSeverityBadge severity={alert.severity} /></TableCell>
                  <TableCell><AlertStatusBadge status={alert.status} /></TableCell>
                  <TableCell className="text-xs font-mono hidden md:table-cell">{alert.sensorId}</TableCell>
                  <TableCell className="hidden lg:table-cell"><WarehouseBadge warehouse={alert.warehouse} /></TableCell>
                  <TableCell className="hidden lg:table-cell"><ZoneBadge zone={alert.zone} /></TableCell>
                  <TableCell><div className="numeric-cell flex items-center gap-1 flex-wrap"><ValueTile value={alert.value} unit="" status={alert.severity === "Critical" ? "Critical" : "Warning"} /><span className="text-muted-foreground text-xs">/</span><ValueTile value={alert.thresholdVal} unit="" status="Normal" /></div></TableCell>
                  <TableCell className="hidden sm:table-cell"><DurationTile duration={alert.duration} /></TableCell>
                  <TableCell><Button variant="ghost" size="icon" className="press-scale h-7 w-7" onClick={() => openSheet(alert.id)}><Eye className="h-3.5 w-3.5" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody></Table></ScrollArea></CardContent></Card>
          </div>
        )}

        {/* ═══ Tab 4: Maintenance Tracker ═══ */}
        {activeTab === "4" && (
          <div className="isd-tab-content space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative"><Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" /><Input placeholder="Search maintenance..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-8 w-56 h-9" /></div>
              <Badge variant="secondary" className="badge-interactive ml-auto text-xs">{filteredMaint.length} records</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMaint.map(m => (
                <Card key={m.id} className="hover-lift-sm isd-maint-card overflow-hidden">
                  <div className="isd-maint-card-header px-4 py-2.5" style={{ background: `linear-gradient(90deg, ${MSTATUS_COL[m.status] ?? "#475569"}25, transparent)` }}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold">{m.id}</span>
                      <MaintStatusBadge status={m.status} />
                    </div>
                  </div>
                  <CardContent className="inner-glow glass-subtle p-3 space-y-2">
                    <div className="flex items-center gap-1.5 flex-wrap"><MaintTypeBadge type={m.type} /><PriorityBadge priority={m.priority} /></div>
                    <Separator />
                    <div className="text-xs space-y-1.5">
                      <div className="flex justify-between"><span className="text-muted-foreground">Sensor</span><span className="font-mono">{m.sensorId} <span className="text-muted-foreground">({m.sensorType})</span></span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Warehouse</span><span>{m.warehouse.split(" ").slice(0, 2).join(" ")}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Zone</span><ZoneBadge zone={m.zone} /></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Technician</span><span>{m.technician}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Scheduled</span><span>{m.scheduledDate}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Completed</span><span>{m.completedDate}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Est. Hours</span><span>{m.estimatedHours}h</span></div>
                      <div className="flex justify-between items-center"><span className="text-muted-foreground">Cost</span><CostTile cost={m.cost} /></div>
                    </div>
                    <Separator />
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{m.notes}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ═══ Tab 5: Sensor Analytics ═══ */}
        {activeTab === "5" && (
          <div className="isd-tab-content space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{kpis5.map((k, i) => <KpiCard key={i} {...k} />)}</div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Monthly Uptime Trend</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={uptimeTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis domain={[96, 100]} tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Line type="monotone" dataKey="uptime" stroke={C.emerald} strokeWidth={2} dot={{ r: 3, fill: C.emerald }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Alert Resolution by Type</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={alertResByType} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis dataKey="type" type="category" tick={{ fontSize: 9 }} width={80} />
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Bar dataKey="resolved" fill={C.emerald} stackId="a" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="total" fill={C.rose} fillOpacity={0.3} stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Top 10 Problem Warehouses</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={topProblemWH} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={80} />
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Bar dataKey="count" fill={C.rose} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Cost Trend (6 Months)</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={costTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `₹${(v as number / 1000).toFixed(0)}K`} />
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Area type="monotone" dataKey="preventive" stackId="c" stroke={C.teal} fill={C.teal} fillOpacity={0.4} name="Preventive" />
                      <Area type="monotone" dataKey="corrective" stackId="c" stroke={C.amber} fill={C.amber} fillOpacity={0.4} name="Corrective" />
                      <Area type="monotone" dataKey="emergency" stackId="c" stroke={C.rose} fill={C.rose} fillOpacity={0.4} name="Emergency" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </Tabs>

      {/* ═══ Sensor Detail Sheet ═══ */}
      <Sheet open={!!(sheetOpen && selectedSensor)} onOpenChange={open => !open && closeSheet()}>
        <SheetContent className="isd-sheet sm:max-w-md p-0 overflow-y-auto">
          {selectedSensor && (<>
            <GradientHeader from={C.teal} to={C.amber} title={selectedSensor.id} subtitle={`${selectedSensor.type} — ${selectedSensor.warehouse}`} />
            <div className="p-4 space-y-4">
              <SheetHeader className="px-0"><SheetTitle className="text-base">Sensor Details</SheetTitle><SheetDescription className="text-xs">Complete sensor information and configuration</SheetDescription></SheetHeader>
              <Card><CardContent className="inner-glow glass-subtle p-3 space-y-0">
                <DetailField label="Type" value={<SensorTypeBadge type={selectedSensor.type} />} />
                <DetailField label="Model" value={selectedSensor.model} />
                <DetailField label="Warehouse" value={<WarehouseBadge warehouse={selectedSensor.warehouse} />} />
                <DetailField label="Zone" value={<ZoneBadge zone={selectedSensor.zone} />} />
                <DetailField label="Status" value={<SensorStatusBadge status={selectedSensor.status} />} />
                <DetailField label="Battery" value={<BatteryLevelBar level={selectedSensor.battery} />} />
                <DetailField label="Signal" value={<SignalBadge signal={selectedSensor.signal} />} />
                <DetailField label="Firmware" value={selectedSensor.firmware} />
                <DetailField label="MAC Address" value={<span className="font-mono">{selectedSensor.mac}</span>} />
                <DetailField label="Installed" value={selectedSensor.installDate} />
                <DetailField label="Last Reading" value={selectedSensor.lastReading} />
              </CardContent></Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-xs font-semibold">Recent Temperature Readings</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={140}>
                    <AreaChart data={data.hourlyData.slice(-8)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="hour" tick={{ fontSize: 9 }} />
                      <YAxis tick={{ fontSize: 9 }} />
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Area type="monotone" dataKey="temp" stroke={C.teal} fill={C.teal} fillOpacity={0.2} name="Temp °C" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </>)}
        </SheetContent>
      </Sheet>

      {/* ═══ Alert Detail Sheet ═══ */}
      <Sheet open={!!(sheetOpen && selectedAlert)} onOpenChange={open => !open && closeSheet()}>
        <SheetContent className="isd-sheet sm:max-w-md p-0 overflow-y-auto">
          {selectedAlert && (<>
            <GradientHeader from={C.rose} to={C.violet} title={selectedAlert.id} subtitle={`${selectedAlert.type} — ${selectedAlert.severity}`} />
            <div className="p-4 space-y-4">
              <SheetHeader className="px-0"><SheetTitle className="text-base">Alert Details</SheetTitle><SheetDescription className="text-xs">Complete alert information and timeline</SheetDescription></SheetHeader>
              <Card><CardContent className="inner-glow glass-subtle p-3 space-y-0">
                <DetailField label="Type" value={<AlertTypeBadge type={selectedAlert.type} />} />
                <DetailField label="Severity" value={<AlertSeverityBadge severity={selectedAlert.severity} />} />
                <DetailField label="Status" value={<AlertStatusBadge status={selectedAlert.status} />} />
                <DetailField label="Sensor" value={<span className="font-mono">{selectedAlert.sensorId} ({selectedAlert.sensorType})</span>} />
                <DetailField label="Warehouse" value={<WarehouseBadge warehouse={selectedAlert.warehouse} />} />
                <DetailField label="Zone" value={<ZoneBadge zone={selectedAlert.zone} />} />
                <DetailField label="Value" value={<ValueTile value={selectedAlert.value} unit="" status={selectedAlert.severity === "Critical" ? "Critical" : "Warning"} />} />
                <DetailField label="Threshold" value={<ValueTile value={selectedAlert.thresholdVal} unit="" status="Normal" />} />
                <DetailField label="Duration" value={<DurationTile duration={selectedAlert.duration} />} />
                <DetailField label="Impact" value={<span className="font-semibold">{selectedAlert.impact}</span>} />
                <DetailField label="Timestamp" value={selectedAlert.timestamp} />
              </CardContent></Card>
              <Card><CardContent className="inner-glow glass-subtle p-3"><p className="text-xs text-muted-foreground mb-1">Message</p><p className="text-sm leading-relaxed">{selectedAlert.message}</p></CardContent></Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-xs font-semibold">Affected Sensor</CardTitle></CardHeader>
                <CardContent className="inner-glow glass-subtle space-y-0">
                  <DetailField label="Sensor ID" value={<span className="font-mono">{selectedAlert.sensorId}</span>} />
                  <DetailField label="Type" value={selectedAlert.sensorType} />
                  <DetailField label="Warehouse" value={selectedAlert.warehouse} />
                  <DetailField label="Zone" value={<ZoneBadge zone={selectedAlert.zone} />} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-xs font-semibold">Event Timeline</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { time: selectedAlert.timestamp, event: "Alert triggered", color: C.rose, done: true },
                      { time: selectedAlert.acknowledged ? selectedAlert.timestamp : "Pending", event: "Acknowledged", color: C.amber, done: selectedAlert.acknowledged },
                      { time: selectedAlert.resolved ? "Completed" : "Pending", event: "Resolved", color: C.emerald, done: selectedAlert.resolved },
                    ].map((t, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: t.done ? t.color : `${t.color}40` }} />
                        <div className="flex-1 flex justify-between items-center">
                          <span className="text-sm">{t.event}</span>
                          <span className="text-xs text-muted-foreground">{t.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>)}
        </SheetContent>
      </Sheet>

      {/* ═══ Inline CSS ═══ */}
      <style>{`
        .isd-pulse { animation: isdPulse 2s ease-in-out infinite; }
        @keyframes isdPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .isd-kpi-card:hover { transform: translateY(-2px); transition: transform 0.2s; }
        .isd-battery-track { width: 48px; height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden; }
        .isd-battery-fill { height: 100%; border-radius: 3px; transition: width 0.3s; }
        .isd-battery-bar-wrap { display: flex; align-items: center; gap: 6px; }
        .isd-battery-label { font-size: 0.7rem; white-space: nowrap; }
        .isd-value-tile { display: inline-block; padding: 2px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; white-space: nowrap; }
        .isd-duration-tile { display: inline-block; padding: 2px 8px; background: #f1f5f9; border-radius: 6px; font-size: 0.7rem; white-space: nowrap; }
        .isd-cost-tile { font-size: 0.75rem; font-weight: 700; color: #0d9488; }
        .isd-filter-select { min-width: 120px; }
        .isd-maint-card { transition: box-shadow 0.2s; }
        .isd-maint-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .isd-gradient-header { padding: 1rem 1.5rem; margin: -1.5rem -1.5rem 0; border-radius: 0; }
      `}</style>
    </div>
  )
}
