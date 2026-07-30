"use client"

import React, { useState, useMemo, useEffect } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { useToast } from "@/hooks/use-toast-helper"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Thermometer, Search, Eye, Activity, Zap, Package, ShieldCheck,
  TrendingUp, AlertTriangle, Battery, Snowflake, Droplets,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Enums ────────────────────────────────────────────────────────────────────
const TEMP_ZONES = ["Frozen (-25°C)", "Deep Freeze (-18°C)", "Chill (2-8°C)", "Cool (8-15°C)", "Ambient Controlled (15-25°C)", "Pharma Grade (2-8°C)", "Ultra-Frozen (-40°C)", "Custom Range"] as const
const SENSOR_STATUSES = ["Normal", "Warning", "Critical", "Offline", "Calibrating", "Low Battery", "Maintenance", "Error"] as const
const SHIPMENT_TYPES = ["Pharmaceutical", "Food & Beverage", "Dairy", "Meat & Seafood", "Frozen Food", "Chemicals", "Biotech", "Vaccines"] as const
const SHIPMENT_STATUSES = ["In Transit", "At Warehouse", "Loading", "Unloading", "Customs Hold", "Delivered", "Quarantine", "Rejected"] as const
const COMPLIANCE_TYPES = ["FDA 21 CFR Part 11", "EU GDP", "WHO PQ", "CDSCO", "ISO 22000", "HACCP", "FSSAI", "IFS"] as const
const ALERT_SEVERITIES = ["Critical", "High", "Medium", "Low", "Info"] as const
const INDIAN_WAREHOUSES = ["Mumbai Cold Storage", "Delhi Pharma Hub", "Bangalore Fresh", "Chennai Port Cold", "Hyderabad Agri", "Pune Food Park", "Kolkata Ice Plant", "Ahmedabad Dairy Hub", "Jaipur Vaccine", "Lucknow Meat Plant", "Nagpur Chemical", "Indore Dairy"] as const
const COLD_PRODUCTS = ["Insulin Pen", "COVID Vaccine", "Amoxicillin", "Fresh Paneer", "Ice Cream Mix", "Frozen Peas", "Milk Carton", "Yogurt Pack", "Chicken Breast", "Salmon Fillet", "Chemical Reagent", "Blood Plasma", "Orange Juice", "Cheese Block", "Butter"] as const
const INDIAN_CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Nagpur", "Indore", "Goa", "Cochin", "Bhopal"] as const
const STOCK_STATUSES = ["In Stock", "Low", "Expiring Soon", "Expired"] as const
const COMPLIANCE_STATUSES = ["Pass", "Fail", "Pending", "Under Review"] as const

// ─── Theme Colors ───────────────────────────────────────────────────────────
const TC = { cyan: "#0891b2", blue: "#3b82f6", emerald: "#059669", amber: "#d97706", rose: "#e11d48", violet: "#7c3aed" }
const CC = [TC.cyan, TC.blue, TC.emerald, TC.amber, TC.rose, TC.violet, "#0d9488", "#ea580c"]

const ZONE_EMOJI: Record<string, string> = { "Frozen (-25°C)": "❄️", "Deep Freeze (-18°C)": "🧊", "Chill (2-8°C)": "🌡️", "Cool (8-15°C)": "🍏", "Ambient Controlled (15-25°C)": "🌡️", "Pharma Grade (2-8°C)": "💊", "Ultra-Frozen (-40°C)": "🥶", "Custom Range": "⚙️" }

// ─── Helpers ────────────────────────────────────────────────────────────────
function seededRandom(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646 }
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

const sortedData = <T,>(data: T[], field: string, dir: string): T[] => {
  if (!field) return data
  return [...data].sort((a, b) => {
    const recA = a as unknown as Record<string, string | number>
    const recB = b as unknown as Record<string, string | number>
    const av = recA[field] ?? ""
    const bv = recB[field] ?? ""
    const cmp = av < bv ? -1 : av > bv ? 1 : 0
    return dir === "asc" ? cmp : -cmp
  })
}
const filterData = <T,>(data: T[], statusKey: string, searchKeys?: string[]): T[] => {
  return data.filter((item) => {
    const rec = item as unknown as Record<string, string | number>
    if (statusFilter !== "all" && rec[statusKey] !== statusFilter) return false
    if (searchQ) {
      const q = searchQ.toLowerCase()
      const keys = searchKeys ?? Object.keys(rec)
      return keys.some((k) => String(rec[k]).toLowerCase().includes(q))
    }
    return true
  })
}

// ─── Visual Components ──────────────────────────────────────────────────────
function TempZoneBadge({ zone }: { zone: string }) {
  const colors: string[] = ["bg-blue-600", "bg-blue-500", "bg-cyan-600", "bg-emerald-600", "bg-amber-600", "bg-violet-600", "bg-indigo-700", "bg-slate-600"]
  const idx = TEMP_ZONES.indexOf(zone as typeof TEMP_ZONES[number])
  return <Badge className={cn("ccm-zone-badge text-white", colors[idx >= 0 ? idx : 7])}>{ZONE_EMOJI[zone] ?? "🌡️"} {zone}</Badge>
}

function SensorStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = { Normal: "bg-emerald-600 text-white", Warning: "bg-amber-500 text-white animate-pulse", Critical: "bg-rose-600 text-white animate-pulse", Offline: "bg-slate-500 text-white", Calibrating: "bg-cyan-600 text-white", "Low Battery": "bg-yellow-500 text-black", Maintenance: "bg-orange-600 text-white", Error: "bg-red-700 text-white" }
  return <Badge className={cn("ccm-sensor-status", map[status] ?? "bg-slate-500")}>{status}</Badge>
}

function TempTile({ temp }: { temp: number }) {
  const color = temp < 0 ? "bg-blue-600 text-white" : temp <= 8 ? "bg-emerald-600 text-white" : temp <= 15 ? "bg-amber-500 text-white" : "bg-rose-600 text-white"
  return <span className={cn("ccm-temp-tile inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold", color)}>{temp}°C</span>
}

function DeviationTile({ dev }: { dev: number }) {
  const color = Math.abs(dev) <= 1 ? "bg-emerald-100 text-emerald-700" : Math.abs(dev) <= 3 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
  return <span className={cn("ccm-deviation-tile inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold", color)}>{dev >= 0 ? "+" : ""}{dev}°C</span>
}

function ShipmentTypeBadge({ type }: { type: string }) {
  const colors = ["bg-violet-600", "bg-blue-600", "bg-emerald-600", "bg-rose-600", "bg-cyan-600", "bg-amber-600", "bg-indigo-600", "bg-pink-600"]
  const idx = SHIPMENT_TYPES.indexOf(type as typeof SHIPMENT_TYPES[number])
  return <Badge className={cn("ccm-shipment-type text-white", colors[idx >= 0 ? idx : 0])}>{type}</Badge>
}

function ShipmentStatusBadge({ status }: { status: string }) {
  const pulse = ["In Transit", "Loading", "Unloading"].includes(status) ? "animate-pulse" : ""
  const red = ["Customs Hold", "Quarantine", "Rejected"].includes(status)
  const map: Record<string, string> = { "In Transit": "bg-blue-600 text-white", "At Warehouse": "bg-emerald-600 text-white", Loading: "bg-cyan-600 text-white", Unloading: "bg-teal-600 text-white", "Customs Hold": "bg-rose-600 text-white", Delivered: "bg-green-700 text-white", Quarantine: "bg-orange-600 text-white", Rejected: "bg-red-700 text-white" }
  return <Badge className={cn("ccm-shipment-status", map[status] ?? "bg-slate-500", pulse, red && "ring-2 ring-rose-400")}>{status}</Badge>
}

function ComplianceBadge({ type }: { type: string }) {
  const colors = ["bg-violet-600", "bg-blue-600", "bg-emerald-600", "bg-amber-600", "bg-rose-600", "bg-cyan-600", "bg-orange-600", "bg-indigo-600"]
  const idx = COMPLIANCE_TYPES.indexOf(type as typeof COMPLIANCE_TYPES[number])
  return <Badge className={cn("ccm-compliance-badge text-white", colors[idx >= 0 ? idx : 0])}>{type}</Badge>
}

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = { Critical: "bg-rose-600 text-white animate-pulse", High: "bg-amber-500 text-white animate-pulse", Medium: "bg-orange-500 text-white", Low: "bg-yellow-100 text-yellow-700", Info: "bg-sky-100 text-sky-700" }
  return <Badge className={cn("ccm-severity-badge", map[severity] ?? "bg-slate-500")}>{severity}</Badge>
}

function StockStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = { "In Stock": "bg-emerald-600 text-white", Low: "bg-amber-500 text-white", "Expiring Soon": "bg-orange-500 text-white animate-pulse", Expired: "bg-rose-600 text-white animate-pulse" }
  return <Badge className={cn("ccm-stock-status", map[status] ?? "bg-slate-500")}>{status}</Badge>
}

function BatteryBar({ pct }: { pct: number }) {
  const color = pct > 60 ? "bg-emerald-500" : pct > 30 ? "bg-amber-500" : "bg-rose-500"
  return <div className="ccm-battery-bar w-16 h-2 bg-slate-200 rounded-full overflow-hidden"><div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} /></div>
}

function CategoryBadge({ cat }: { cat: string }) {
  const colors = ["bg-violet-600", "bg-emerald-600", "bg-blue-600", "bg-rose-600", "bg-amber-600", "bg-cyan-600", "bg-pink-600", "bg-indigo-600"]
  const idx = SHIPMENT_TYPES.indexOf(cat as typeof SHIPMENT_TYPES[number])
  return <Badge className={cn("ccm-category-badge text-white text-[10px]", colors[idx >= 0 ? idx : 0])}>{cat}</Badge>
}

function ExcursionBadge({ count }: { count: number }) {
  if (count === 0) return <Badge className="ccm-excursion-badge bg-emerald-100 text-emerald-700">0</Badge>
  if (count <= 2) return <Badge className="ccm-excursion-badge bg-amber-100 text-amber-700">{count}</Badge>
  return <Badge className="ccm-excursion-badge bg-rose-100 text-rose-700">{count}</Badge>
}

function ValueTile({ val }: { val: number }) {
  return <span className="ccm-value-tile text-xs font-semibold text-foreground">{formatINR(val)}</span>
}

function HumidityTile({ pct }: { pct: number }) {
  return <span className="ccm-humidity-tile text-xs text-slate-600">{pct}%</span>
}

function EnergyTile({ kwh }: { kwh: number }) {
  return <span className="ccm-energy-tile text-xs font-medium text-emerald-700">{kwh} kWh</span>
}

// ─── Data Generation ─────────────────────────────────────────────────────────
interface SensorReading { id: string; zone: string; currentTemp: number; setPoint: number; deviation: number; humidity: number; status: string; warehouse: string; lastUpdated: string; battery: number }
interface Shipment { id: string; type: string; product: string; warehouse: string; status: string; origin: string; destination: string; minTemp: number; maxTemp: number; duration: string; value: number; excursions: number }
interface InventoryItem { id: string; product: string; category: string; zone: string; quantity: number; unitWeight: number; totalWeight: number; batchNo: string; expiryDate: string; warehouse: string; tempAtLocation: number; stockStatus: string; value: number }
interface ComplianceRecord { id: string; complianceType: string; severity: string; status: string; reference: string; warehouse: string; inspector: string; findings: string; dueDate: string }

function generateData() {
  const s = seededRandom(216)
  const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(s() * arr.length)]
  const rf = (min: number, max: number) => +(min + s() * (max - min)).toFixed(1)
  const now = new Date()

  const sensors: SensorReading[] = Array.from({ length: 75 }, (_, i) => {
    const zone = pick(TEMP_ZONES)
    const sp = zone.includes("-40") ? -40 : zone.includes("-25") ? -25 : zone.includes("-18") ? -18 : zone.includes("2-8") || zone.includes("Pharma") ? 5 : zone.includes("8-15") ? 11 : 20
    const ct = +(sp + (s() - 0.5) * 6).toFixed(1)
    return { id: `CCM-SR-${String(i + 1).padStart(4, "0")}`, zone, currentTemp: ct, setPoint: sp, deviation: +((ct - sp) * (s() > 0.7 ? -1 : 1)).toFixed(1), humidity: ri(30, 85, i * 7 + 100), status: pick(SENSOR_STATUSES), warehouse: pick(INDIAN_WAREHOUSES), lastUpdated: new Date(now.getTime() - ri(1, 3600, i + 200)).toISOString(), battery: ri(10, 100, i + 300) }
  })

  const shipments: Shipment[] = Array.from({ length: 70 }, (_, i) => {
    const o = pick(INDIAN_CITIES)
    let d = pick(INDIAN_CITIES)
    while (d === o) d = pick(INDIAN_CITIES)
    return { id: `CCM-SH-${String(i + 1).padStart(4, "0")}`, type: pick(SHIPMENT_TYPES), product: pick(COLD_PRODUCTS), warehouse: pick(INDIAN_WAREHOUSES), status: pick(SHIPMENT_STATUSES), origin: o, destination: d, minTemp: rf(-40, -5), maxTemp: rf(2, 25), duration: `${ri(2, 72, i + 400)}h`, value: ri(50000, 5000000, i + 500), excursions: ri(0, 5, i + 600) }
  })

  const inventory: InventoryItem[] = Array.from({ length: 65 }, (_, i) => {
    const cat = pick(SHIPMENT_TYPES)
    const zone = pick(TEMP_ZONES)
    const qty = ri(10, 5000, i + 700)
    const uw = rf(0.1, 50)
    const exp = new Date(now.getTime() + ri(-30, 365, i + 800) * 86400000)
    const expDays = Math.floor((exp.getTime() - now.getTime()) / 86400000)
    const ss = expDays < 0 ? "Expired" : expDays < 30 ? "Expiring Soon" : qty < 100 ? "Low" : "In Stock"
    return { id: `CCM-INV-${String(i + 1).padStart(4, "0")}`, product: pick(COLD_PRODUCTS), category: cat, zone, quantity: qty, unitWeight: uw, totalWeight: +(qty * uw).toFixed(1), batchNo: `B-${ri(100000, 999999, i + 900)}`, expiryDate: exp.toLocaleDateString("en-IN"), warehouse: pick(INDIAN_WAREHOUSES), tempAtLocation: rf(-40, 25), stockStatus: ss, value: ri(10000, 2000000, i + 1000) }
  })

  const compliance: ComplianceRecord[] = Array.from({ length: 55 }, (_, i) => ({
    id: `CCM-CR-${String(i + 1).padStart(4, "0")}`, complianceType: pick(COMPLIANCE_TYPES), severity: pick(ALERT_SEVERITIES), status: pick(COMPLIANCE_STATUSES), reference: pick([...sensors.map(s => s.id), ...shipments.map(s => s.id)]), warehouse: pick(INDIAN_WAREHOUSES), inspector: `Inspector ${ri(1, 20, i + 1100)}`, findings: pick(["No deviation found", "Minor temperature drift", "Humidity exceeded limit", "Sensor calibration required", "Documentation gap", "Cold chain break detected", "Compressor inefficiency", "Door seal integrity issue"]), dueDate: new Date(now.getTime() + ri(1, 90, i + 1200) * 86400000).toLocaleDateString("en-IN")
  }))

  return { sensors, shipments, inventory, compliance }
}

// ─── KPICard ─────────────────────────────────────────────────────────────────
function KPICard({ label, value, icon, color, sub }: { label: string; value: string; icon: React.ReactNode; color: string; sub?: string }) {
  return (
    <Card className="hover-lift-sm ccm-kpi-card">
      <CardContent className="inner-glow p-4 flex items-center gap-3">
        <div className={cn("ccm-kpi-icon flex h-10 w-10 items-center justify-center rounded-lg text-white", color)}>{icon}</div>
        <div><p className="text-xs text-muted-foreground">{label}</p><p className="text-lg font-bold">{value}</p>{sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}</div>
      </CardContent>
    </Card>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────
let statusFilter = "all"
let searchQ = ""

export function ColdChainMonitorView() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("0")
  const { sensors, shipments, inventory, compliance } = useMemo(() => generateData(), [])
  const [searchQState, setSearchQ] = useState("")
  const [statusFilterState, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("")
  const [sortDir, setSortDir] = useState("asc")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedSensor, setSelectedSensor] = useState<SensorReading | null>(null)
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  const [selectedCompliance, setSelectedCompliance] = useState<ComplianceRecord | null>(null)

  useEffect(() => { searchQ = searchQState }, [searchQState])
  useEffect(() => { statusFilter = statusFilterState }, [statusFilterState])

  // ─── Tab 0: Dashboard ────────────────────────────────────────────────────
  const tempTrend = useMemo(() => {
    const s = seededRandom(216)
    return Array.from({ length: 24 }, (_, i) => ({
      hour: `${String(i).padStart(2, "0")}:00`,
      Frozen: +(ri(-30, -20, i * 3) + s() * 2 - 1).toFixed(1),
      Chill: +(ri(2, 8, i * 3 + 50) + s() * 1).toFixed(1),
      Cool: +(ri(8, 15, i * 3 + 100) + s() * 1).toFixed(1),
    }))
  }, [])

  const shipmentTypeDist = useMemo(() => {
    const counts: Record<string, number> = {}
    shipments.forEach(sh => { counts[sh.type] = (counts[sh.type] || 0) + 1 })
    return SHIPMENT_TYPES.map(t => ({ name: t, value: counts[t] || 0 }))
  }, [shipments])

  const warehouseCompliance = useMemo(() => {
    const s = seededRandom(300)
    return INDIAN_WAREHOUSES.map(w => ({ name: w.length > 12 ? w.slice(0, 12) + "…" : w, score: ri(72, 99, w.length * 7) }))
  }, [])

  // ─── Tab 5: Analytics ────────────────────────────────────────────────────
  const monthlyExcursions = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return months.map((m, i) => ({ month: m, count: ri(3, 28, i * 11 + 500) }))
  }, [])

  const warehouseEnergy = useMemo(() => {
    return INDIAN_WAREHOUSES.map((w, i) => ({ name: w.length > 10 ? w.slice(0, 10) + "…" : w, kwh: ri(5000, 45000, i * 13 + 600) }))
  }, [])

  const productValue = useMemo(() => {
    return SHIPMENT_TYPES.map((t, i) => ({ name: t, value: ri(500000, 8000000, i * 17 + 700) }))
  }, [])

  const costTrend = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    return months.map((m, i) => ({ month: m, Energy: ri(800000, 2000000, i * 19 + 800), Labor: ri(300000, 800000, i * 19 + 900), Maintenance: ri(100000, 500000, i * 19 + 1000), Compliance: ri(50000, 300000, i * 19 + 1100) }))
  }, [])

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortField(field); setSortDir("asc") }
  }

  const SortIcon = ({ col }: { col: string }) => (
    <span className={cn("ccm-sort-icon ml-1 text-[10px]", sortField === col ? "text-foreground" : "text-muted-foreground/30")}>
      {sortField === col ? (sortDir === "asc" ? "▲" : "▼") : "▲▼"}
    </span>
  )

  // ─── Sheet: Sensor Detail ───────────────────────────────────────────────
  const sensorHistory = useMemo(() => {
    if (!selectedSensor) return []
    const s = seededRandom(selectedSensor.battery + 999)
    return Array.from({ length: 12 }, (_, i) => ({ t: `${i * 2}h`, temp: +(selectedSensor.setPoint + (s() - 0.5) * 6).toFixed(1) }))
  }, [selectedSensor])

  // ─── Sheet: Shipment Detail ─────────────────────────────────────────────
  const shipmentTempLog = useMemo(() => {
    if (!selectedShipment) return []
    const s = seededRandom(selectedShipment.value % 1000 + 555)
    return Array.from({ length: 10 }, (_, i) => ({ t: `${i * 3}h`, min: +(selectedShipment.minTemp + s() * 2).toFixed(1), max: +(selectedShipment.maxTemp - s() * 2).toFixed(1) }))
  }, [selectedShipment])

  return (
    <div className="ccm-root space-y-4">
      <PageHeader title="Cold Chain Monitor" description="Real-time temperature monitoring, shipment tracking, and compliance management across Indian cold chain logistics" />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="ccm-tabs-list flex w-full overflow-x-auto gap-1">
          {["Dashboard", "Temperature", "Shipments", "Inventory", "Compliance", "Analytics"].map((t, i) => (
            <TabsTrigger key={i} value={String(i)} className="ccm-tab-trigger text-xs whitespace-nowrap">{t}</TabsTrigger>
          ))}
        </TabsList>

        {/* Tab 0: Dashboard */}
        <TabsContent value="0" className="ccm-tab-dashboard space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <KPICard label="Active Sensors" value="68" icon={<Thermometer className="h-5 w-5" />} color="bg-cyan-600" sub="of 75 total" />
            <KPICard label="Avg Temperature" value="4.2°C" icon={<Snowflake className="h-5 w-5" />} color="bg-blue-600" sub="Across all zones" />
            <KPICard label="Excursions Today" value="7" icon={<AlertTriangle className="h-5 w-5" />} color="bg-amber-600" sub="+2 from yesterday" />
            <KPICard label="Shipments in Transit" value="23" icon={<Activity className="h-5 w-5" />} color="bg-emerald-600" />
            <KPICard label="Inventory Items" value="65" icon={<Package className="h-5 w-5" />} color="bg-violet-600" sub="Across 12 warehouses" />
            <KPICard label="Compliance Score" value="94.5%" icon={<ShieldCheck className="h-5 w-5" />} color="bg-rose-600" sub="All standards" />
            <KPICard label="Energy Cost Today" value={formatINR(385000)} icon={<Zap className="h-5 w-5" />} color="bg-orange-600" />
            <KPICard label="Uptime" value="99.2%" icon={<Activity className="h-5 w-5" />} color="bg-teal-600" sub="30-day average" />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="hover-lift-sm ccm-chart-card md:col-span-2">
              <CardHeader className="pb-2"><CardTitle className="text-sm">24h Temperature Trend</CardTitle></CardHeader>
              <CardContent><ResponsiveContainer width="100%" height={220}><AreaChart data={tempTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="hour" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Area type="monotone" dataKey="Frozen" stroke={TC.blue} fill={TC.blue} fillOpacity={0.2} /><Area type="monotone" dataKey="Chill" stroke={TC.cyan} fill={TC.cyan} fillOpacity={0.2} /><Area type="monotone" dataKey="Cool" stroke={TC.emerald} fill={TC.emerald} fillOpacity={0.2} /></AreaChart></ResponsiveContainer></CardContent>
            </Card>
            <Card className="hover-lift-sm ccm-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Shipment Type Distribution</CardTitle></CardHeader>
              <CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={shipmentTypeDist} cx="50%" cy="50%" innerRadius={40} outerRadius={75} dataKey="value" paddingAngle={2} label={{ fontSize: 9 }}>{shipmentTypeDist.map((_, i) => <Cell key={i} fill={CC[i]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent>
            </Card>
          </div>
          <Card className="hover-lift-sm ccm-chart-card">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Compliance Score by Warehouse</CardTitle></CardHeader>
            <CardContent><ResponsiveContainer width="100%" height={200}><BarChart data={warehouseCompliance}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" height={50} /><YAxis tick={{ fontSize: 10 }} domain={[60, 100]} /><Tooltip /><Bar dataKey="score" fill={TC.cyan} radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent>
          </Card>
        </TabsContent>

        {/* Tab 1: Temperature Monitoring */}
        <TabsContent value="1" className="ccm-tab-temp space-y-4">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]"><Search className="ccm-search-icon absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search sensors..." value={searchQState} onChange={e => setSearchQ(e.target.value)} className="ccm-search pl-8" /></div>
            <Select value={statusFilterState} onValueChange={setStatusFilter}>
              <SelectTrigger className="ccm-zone-filter w-[180px]"><SelectValue placeholder="Filter by Zone" /></SelectTrigger>
              <SelectContent>{TEMP_ZONES.map(z => <SelectItem key={z} value={z}>{ZONE_EMOJI[z]} {z}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="ccm-sensor-grid grid gap-2 md:grid-cols-2 xl:grid-cols-3 max-h-[70vh] overflow-y-auto">
            {sortedData(filterData(sensors, "zone", ["id", "zone", "status", "warehouse"]), sortField, sortDir).map(sensor => (
              <Card key={sensor.id} className="hover-lift-sm ccm-sensor-card">
                <CardContent className="inner-glow p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold">{sensor.id}</span>
                    <SensorStatusBadge status={sensor.status} />
                  </div>
                  <TempZoneBadge zone={sensor.zone} />
                  <div className="flex items-center gap-2 flex-wrap">
                    <TempTile temp={sensor.currentTemp} />
                    <span className="text-[10px] text-muted-foreground">Set: {sensor.setPoint}°C</span>
                    <DeviationTile dev={sensor.deviation} />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <div className="flex items-center gap-2"><Droplets className="h-3 w-3" /><HumidityTile pct={sensor.humidity} /></div>
                    <div className="flex items-center gap-1"><Battery className="h-3 w-3" /><BatteryBar pct={sensor.battery} /> <span>{sensor.battery}%</span></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground truncate max-w-[140px]">{sensor.warehouse}</span>
                    <Button variant="ghost" size="sm" className="press-scale ccm-eye-btn h-6 w-6 p-0" onClick={() => { setSelectedSensor(sensor); setSheetOpen(true); toast.info("Sensor Details", `Viewing ${sensor.id}`) }}><Eye className="h-3 w-3" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 2: Shipment Tracking */}
        <TabsContent value="2" className="ccm-tab-shipments space-y-4">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]"><Search className="ccm-search-icon absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search shipments..." value={searchQState} onChange={e => setSearchQ(e.target.value)} className="ccm-search pl-8" /></div>
            <Select value={statusFilterState} onValueChange={setStatusFilter}>
              <SelectTrigger className="ccm-status-filter w-[160px]"><SelectValue placeholder="Filter Status" /></SelectTrigger>
              <SelectContent>{SHIPMENT_STATUSES.map(st => <SelectItem key={st} value={st}>{st}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="ccm-shipment-grid grid gap-2 md:grid-cols-2 xl:grid-cols-3 max-h-[70vh] overflow-y-auto">
            {sortedData(filterData(shipments, "status", ["id", "type", "product", "warehouse", "origin", "destination"]), sortField, sortDir).map(sh => (
              <Card key={sh.id} className="hover-lift-sm ccm-shipment-card">
                <CardContent className="inner-glow p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold">{sh.id}</span>
                    <ShipmentStatusBadge status={sh.status} />
                  </div>
                  <ShipmentTypeBadge type={sh.type} />
                  <p className="text-xs font-medium">{sh.product}</p>
                  <p className="text-[10px] text-muted-foreground">{sh.origin} → {sh.destination}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-muted-foreground">Min</span><TempTile temp={sh.minTemp} />
                    <span className="text-[10px] text-muted-foreground">Max</span><TempTile temp={sh.maxTemp} />
                    <span className="text-[10px] text-muted-foreground ml-auto">Duration: {sh.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ValueTile val={sh.value} />
                      <ExcursionBadge count={sh.excursions} />
                    </div>
                    <Button variant="ghost" size="sm" className="press-scale ccm-eye-btn h-6 w-6 p-0" onClick={() => { setSelectedShipment(sh); setSheetOpen(true); toast.info("Shipment Details", `Viewing ${sh.id}`) }}><Eye className="h-3 w-3" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 3: Cold Storage Inventory */}
        <TabsContent value="3" className="ccm-tab-inventory space-y-4">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]"><Search className="ccm-search-icon absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search inventory..." value={searchQState} onChange={e => setSearchQ(e.target.value)} className="ccm-search pl-8" /></div>
            <Select value={statusFilterState} onValueChange={setStatusFilter}>
              <SelectTrigger className="ccm-zone-filter w-[180px]"><SelectValue placeholder="Filter by Zone" /></SelectTrigger>
              <SelectContent>{TEMP_ZONES.map(z => <SelectItem key={z} value={z}>{ZONE_EMOJI[z]} {z}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          {/* Critical / Expiring cards */}
          <div className="ccm-critical-cards grid gap-2 md:grid-cols-3">
            {inventory.filter(it => it.stockStatus === "Expiring Soon" || it.stockStatus === "Expired").slice(0, 3).map(it => (
              <Card key={it.id} className={cn("ccm-critical-card border-l-4", it.stockStatus === "Expired" ? "border-l-rose-600" : "border-l-amber-500")}>
                <CardContent className="inner-glow p-3 space-y-1">
                  <div className="flex items-center justify-between"><span className="text-xs font-bold">{it.product}</span><StockStatusBadge status={it.stockStatus} /></div>
                  <p className="text-[10px] text-muted-foreground">Batch: {it.batchNo} | Exp: {it.expiryDate}</p>
                  <p className="text-[10px]">{it.warehouse} | <TempTile temp={it.tempAtLocation} /></p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="ccm-inv-grid grid gap-2 md:grid-cols-2 xl:grid-cols-3 max-h-[65vh] overflow-y-auto">
            {sortedData(filterData(inventory, "zone", ["id", "product", "category", "warehouse", "batchNo"]), sortField, sortDir).map(it => (
              <Card key={it.id} className="hover-lift-sm ccm-inv-card">
                <CardContent className="inner-glow p-3 space-y-2">
                  <div className="flex items-center justify-between"><span className="text-xs font-mono font-bold">{it.id}</span><StockStatusBadge status={it.stockStatus} /></div>
                  <p className="text-xs font-medium">{it.product}</p>
                  <div className="flex gap-1 flex-wrap"><CategoryBadge cat={it.category} /><TempZoneBadge zone={it.zone} /></div>
                  <div className="grid grid-cols-2 gap-1 text-[10px] text-muted-foreground">
                    <span>Qty: {it.quantity.toLocaleString()}</span><span>Unit: {it.unitWeight}kg</span>
                    <span>Total: {it.totalWeight}kg</span><span>Batch: {it.batchNo}</span>
                    <span>Exp: {it.expiryDate}</span><TempTile temp={it.tempAtLocation} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">{it.warehouse}</span>
                    <div className="flex items-center gap-2"><ValueTile val={it.value} /></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 4: Compliance & Alerts */}
        <TabsContent value="4" className="ccm-tab-compliance space-y-4">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]"><Search className="ccm-search-icon absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search compliance records..." value={searchQState} onChange={e => setSearchQ(e.target.value)} className="ccm-search pl-8" /></div>
          </div>
          <div className="ccm-compliance-grid grid gap-2 md:grid-cols-2 max-h-[75vh] overflow-y-auto">
            {sortedData(filterData(compliance, "severity", ["id", "complianceType", "status", "warehouse", "inspector", "findings"]), sortField, sortDir).map(cr => (
              <Card key={cr.id} className={cn("ccm-compliance-card border-l-4", cr.severity === "Critical" ? "border-l-rose-600" : cr.severity === "High" ? "border-l-amber-500" : cr.severity === "Medium" ? "border-l-orange-400" : "border-l-sky-400")}>
                <CardContent className="inner-glow p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold">{cr.id}</span>
                    <SeverityBadge severity={cr.severity} />
                  </div>
                  <div className="flex gap-1 flex-wrap"><ComplianceBadge type={cr.complianceType} /></div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className={cn("font-semibold", cr.status === "Pass" ? "text-emerald-600" : cr.status === "Fail" ? "text-rose-600" : "text-amber-600")}>{cr.status}</span>
                    <span className="text-muted-foreground">Due: {cr.dueDate}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Ref: {cr.reference.slice(0, 16)}…</p>
                  <p className="text-[10px] text-muted-foreground">{cr.warehouse} | {cr.inspector}</p>
                  <p className="text-[10px]">{cr.findings}</p>
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" className="press-scale ccm-eye-btn h-6 w-6 p-0" onClick={() => { setSelectedCompliance(cr); setSheetOpen(true); toast.info("Compliance Details", `Viewing ${cr.id}`) }}><Eye className="h-3 w-3" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 5: Analytics */}
        <TabsContent value="5" className="ccm-tab-analytics space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <KPICard label="Temp Stability" value="97.8%" icon={<Thermometer className="h-5 w-5" />} color="bg-cyan-600" />
            <KPICard label="Excursion Rate" value="2.1%" icon={<AlertTriangle className="h-5 w-5" />} color="bg-amber-600" />
            <KPICard label="Energy Efficiency" value="89.4%" icon={<Zap className="h-5 w-5" />} color="bg-emerald-600" />
            <KPICard label="Compliance Rate" value="94.5%" icon={<ShieldCheck className="h-5 w-5" />} color="bg-blue-600" />
            <KPICard label="Product Loss %" value="0.8%" icon={<TrendingUp className="h-5 w-5" />} color="bg-rose-600" />
            <KPICard label="Shelf Life Util." value="82.3%" icon={<Package className="h-5 w-5" />} color="bg-violet-600" />
            <KPICard label="Cost per km" value="₹12.5" icon={<Activity className="h-5 w-5" />} color="bg-orange-600" />
            <KPICard label="Carbon Footprint" value="4.2t" icon={<Snowflake className="h-5 w-5" />} color="bg-teal-600" sub="CO₂ equivalent" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="hover-lift-sm ccm-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Excursion Count</CardTitle></CardHeader>
              <CardContent><ResponsiveContainer width="100%" height={200}><LineChart data={monthlyExcursions}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Line type="monotone" dataKey="count" stroke={TC.rose} strokeWidth={2} dot={{ r: 3 }} /></LineChart></ResponsiveContainer></CardContent>
            </Card>
            <Card className="hover-lift-sm ccm-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Warehouse Energy Consumption</CardTitle></CardHeader>
              <CardContent><ResponsiveContainer width="100%" height={200}><BarChart data={warehouseEnergy} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" tick={{ fontSize: 10 }} /><YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={80} /><Tooltip /><Bar dataKey="kwh" fill={TC.amber} radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="hover-lift-sm ccm-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Top Product Categories by Value</CardTitle></CardHeader>
              <CardContent><ResponsiveContainer width="100%" height={200}><BarChart data={productValue} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => formatINR(v)} /><YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={90} /><Tooltip formatter={v => formatINR(v as number)} /><Bar dataKey="value" fill={TC.violet} radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></CardContent>
            </Card>
            <Card className="hover-lift-sm ccm-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">6-Month Cost Trend</CardTitle></CardHeader>
              <CardContent><ResponsiveContainer width="100%" height={200}><AreaChart data={costTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${(v / 100000).toFixed(0)}L`} /><Tooltip formatter={v => formatINR(v as number)} /><Area type="monotone" dataKey="Energy" stackId="1" fill={TC.amber} /><Area type="monotone" dataKey="Labor" stackId="1" fill={TC.cyan} /><Area type="monotone" dataKey="Maintenance" stackId="1" fill={TC.emerald} /><Area type="monotone" dataKey="Compliance" stackId="1" fill={TC.violet} /></AreaChart></ResponsiveContainer></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ─── Sheet: Sensor Detail ───────────────────────────────────────── */}
      <Sheet open={!!(sheetOpen && selectedSensor)} onOpenChange={open => { setSheetOpen(open); if (!open) setSelectedSensor(null) }}>
        <SheetContent className="ccm-sheet-sensor w-[400px] sm:w-[480px] overflow-y-auto">
          <div className="space-y-4 pt-4">
            <div className="rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 p-4 text-white">
              <p className="text-xs opacity-80">Sensor Detail</p>
              <p className="text-lg font-bold">{selectedSensor?.id}</p>
              <div className="mt-2 flex gap-2"><TempTile temp={selectedSensor?.currentTemp ?? 0} /><DeviationTile dev={selectedSensor?.deviation ?? 0} /></div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Temperature History</h4>
              <ResponsiveContainer width="100%" height={140}><LineChart data={sensorHistory}><XAxis dataKey="t" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 9 }} /><Tooltip /><Line type="monotone" dataKey="temp" stroke={TC.cyan} strokeWidth={2} dot={{ r: 2 }} /></LineChart></ResponsiveContainer>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Zone</span><TempZoneBadge zone={selectedSensor?.zone ?? ""} /></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><SensorStatusBadge status={selectedSensor?.status ?? ""} /></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Set Point</span><span>{selectedSensor?.setPoint}°C</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Humidity</span><HumidityTile pct={selectedSensor?.humidity ?? 0} /></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Warehouse</span><span className="text-xs">{selectedSensor?.warehouse}</span></div>
              <div className="flex justify-between items-center"><span className="text-muted-foreground">Battery</span><div className="flex items-center gap-2"><BatteryBar pct={selectedSensor?.battery ?? 0} /><span className="text-xs">{selectedSensor?.battery}%</span></div></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Last Updated</span><span className="text-xs">{selectedSensor?.lastUpdated ? new Date(selectedSensor.lastUpdated).toLocaleString("en-IN") : ""}</span></div>
            </div>
            <div className="rounded-lg border p-3 space-y-2">
              <h4 className="text-sm font-semibold">Threshold Settings</h4>
              <div className="flex justify-between text-xs"><span className="text-muted-foreground">Min Temp</span><span>{(selectedSensor?.setPoint ?? 0) - 3}°C</span></div>
              <div className="flex justify-between text-xs"><span className="text-muted-foreground">Max Temp</span><span>{(selectedSensor?.setPoint ?? 0) + 3}°C</span></div>
              <div className="flex justify-between text-xs"><span className="text-muted-foreground">Max Humidity</span><span>85%</span></div>
              <div className="flex justify-between text-xs"><span className="text-muted-foreground">Alert Delay</span><span>5 min</span></div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* ─── Sheet: Shipment Detail ─────────────────────────────────────── */}
      <Sheet open={!!(sheetOpen && selectedShipment)} onOpenChange={open => { setSheetOpen(open); if (!open) setSelectedShipment(null) }}>
        <SheetContent className="ccm-sheet-shipment w-[400px] sm:w-[480px] overflow-y-auto">
          <div className="space-y-4 pt-4">
            <div className="rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 p-4 text-white">
              <p className="text-xs opacity-80">Shipment Detail</p>
              <p className="text-lg font-bold">{selectedShipment?.id}</p>
              <p className="text-sm mt-1">{selectedShipment?.origin} → {selectedShipment?.destination}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Temperature Log</h4>
              <ResponsiveContainer width="100%" height={150}><LineChart data={shipmentTempLog}><XAxis dataKey="t" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 9 }} /><Tooltip /><Line type="monotone" dataKey="min" stroke={TC.blue} strokeWidth={2} dot={{ r: 2 }} /><Line type="monotone" dataKey="max" stroke={TC.rose} strokeWidth={2} dot={{ r: 2 }} /></LineChart></ResponsiveContainer>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Type</span><ShipmentTypeBadge type={selectedShipment?.type ?? ""} /></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Product</span><span className="text-xs">{selectedShipment?.product}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><ShipmentStatusBadge status={selectedShipment?.status ?? ""} /></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="text-xs">{selectedShipment?.duration}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Value</span><ValueTile val={selectedShipment?.value ?? 0} /></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Excursions</span><ExcursionBadge count={selectedShipment?.excursions ?? 0} /></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Warehouse</span><span className="text-xs">{selectedShipment?.warehouse}</span></div>
            </div>
            <div className="rounded-lg border p-3 space-y-2">
              <h4 className="text-sm font-semibold">Shipment Timeline</h4>
              {["Order Placed", "Packed & Loaded", "In Transit", "Arrived at Hub", "Delivered"].map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className={cn("h-2 w-2 rounded-full", i <= 2 ? "bg-emerald-500" : "bg-slate-300")} />
                  <span className={cn(i <= 2 ? "text-foreground" : "text-muted-foreground")}>{step}</span>
                </div>
              ))}
            </div>
            <div className="rounded-lg border p-3 space-y-1">
              <h4 className="text-sm font-semibold">Compliance Status</h4>
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" /><span className="text-xs text-emerald-600 font-medium">All checks passed</span></div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* ─── Sheet: Compliance Detail ───────────────────────────────────── */}
      <Sheet open={!!(sheetOpen && selectedCompliance)} onOpenChange={open => { setSheetOpen(open); if (!open) setSelectedCompliance(null) }}>
        <SheetContent className="ccm-sheet-compliance w-[400px] sm:w-[480px] overflow-y-auto">
          <div className="space-y-4 pt-4">
            <div className="rounded-xl bg-gradient-to-r from-rose-600 to-violet-600 p-4 text-white">
              <p className="text-xs opacity-80">Compliance Record</p>
              <p className="text-lg font-bold">{selectedCompliance?.id}</p>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Type</span><ComplianceBadge type={selectedCompliance?.complianceType ?? ""} /></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Severity</span><SeverityBadge severity={selectedCompliance?.severity ?? ""} /></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className={cn("font-semibold text-xs", selectedCompliance?.status === "Pass" ? "text-emerald-600" : selectedCompliance?.status === "Fail" ? "text-rose-600" : "text-amber-600")}>{selectedCompliance?.status}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Reference</span><span className="text-xs font-mono">{selectedCompliance?.reference?.slice(0, 20)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Warehouse</span><span className="text-xs">{selectedCompliance?.warehouse}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Inspector</span><span className="text-xs">{selectedCompliance?.inspector}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Due Date</span><span className="text-xs">{selectedCompliance?.dueDate}</span></div>
            </div>
            <div className="rounded-lg border p-3 space-y-1">
              <h4 className="text-sm font-semibold">Findings</h4>
              <p className="text-xs">{selectedCompliance?.findings}</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default ColdChainMonitorView
