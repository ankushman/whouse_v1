"use client"

import { useState, useMemo, Fragment } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, AreaChart, Area,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts"
import {
  Box, Package, Layers, Search, Eye, X, ChevronRight, Filter,
  AlertTriangle, CheckCircle2, Clock, PackageSearch, TrendingUp, TrendingDown,
  Target, RefreshCw, Download, Plus, ArrowRightLeft, ShieldCheck, MapPin,
  Warehouse, Truck, Weight, Ruler, Barcode, ScanBarcode, RotateCw,
  QrCode, ClipboardList, ArrowDownUp, Gauge, Tag, BrickWall
} from "lucide-react"

function seededRandom(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646 }
}
const rng = seededRandom(154154)
function pick<T>(arr: T[]): T { return arr[Math.floor(rng() * arr.length)] }
function randInt(min: number, max: number): number { return Math.floor(rng() * (max - min + 1)) + min }
function randFloat(min: number, max: number, dec = 1): number { return Number((rng() * (max - min) + min).toFixed(dec)) }

const PALLET_TYPES = [
  { name: "EUR-1 (1200x800)", size: "1200x800mm", load: 1500, type: "Wooden", color: "#8B4513" },
  { name: "EUR-2 (1200x1000)", size: "1200x1000mm", load: 1500, type: "Wooden", color: "#A0522D" },
  { name: "EUR-3 (1000x1200)", size: "1000x1200mm", load: 1500, type: "Wooden", color: "#CD853F" },
  { name: "EUR-6 (800x600)", size: "800x600mm", load: 500, type: "Wooden", color: "#DEB887" },
  { name: "US Standard (48x40)", size: "1219x1016mm", load: 2000, type: "Wooden", color: "#D2691E" },
  { name: "Plastic IP-1", size: "1200x1000mm", load: 1200, type: "Plastic", color: "#3b82f6" },
  { name: "Plastic IP-2", size: "1200x800mm", load: 1000, type: "Plastic", color: "#6366f1" },
  { name: "Metal Cage", size: "1000x1000mm", load: 2000, type: "Metal", color: "#6b7280" },
]

const CONTAINER_TYPES = [
  { name: "20ft Standard", code: "20GP", length: "6.058m", width: "2.438m", height: "2.591m", capacity: "33.2 CBM", teu: 1, maxWeight: 24000, color: "#3b82f6" },
  { name: "40ft Standard", code: "40GP", length: "12.192m", width: "2.438m", height: "2.591m", capacity: "67.7 CBM", teu: 2, maxWeight: 30480, color: "#10b981" },
  { name: "40ft High Cube", code: "40HC", length: "12.192m", width: "2.438m", height: "2.896m", capacity: "76.3 CBM", teu: 2, maxWeight: 30480, color: "#6366f1" },
  { name: "20ft Reefer", code: "20RF", length: "6.058m", width: "2.438m", height: "2.591m", capacity: "28.3 CBM", teu: 1, maxWeight: 24000, color: "#06b6d4" },
  { name: "40ft Reefer HC", code: "40RH", length: "12.192m", width: "2.438m", height: "2.896m", capacity: "67.5 CBM", teu: 2, maxWeight: 30480, color: "#0891b2" },
  { name: "20ft Open Top", code: "20OT", length: "6.058m", width: "2.438m", height: "2.591m", capacity: "32.5 CBM", teu: 1, maxWeight: 24000, color: "#f59e0b" },
  { name: "40ft Flat Rack", code: "40FR", length: "12.192m", width: "2.438m", height: "2.591m", capacity: "N/A", teu: 2, maxWeight: 35000, color: "#ef4444" },
]

const STATUSES = ["Available", "In Use", "Maintenance", "Damaged", "Quarantine", "In Transit", "Empty", "Loaded"] as const
const Pallet_STATES = ["Ready", "Stacked", "In Pick Zone", "At Dock", "In Transit", "Damaged", "Repaired", "Retired"] as const
const MATERIALS = ["FMCG", "Electronics", "Pharmaceuticals", "Textiles", "Auto Parts", "Chemicals", "Food Grains", "Steel & Metal", "Paper & Packaging", "Consumer Goods"]
const WAREHOUSES = ["Mumbai Central WH", "Delhi NCR Hub", "Chennai Port WH", "Bangalore Tech WH", "Kolkata East WH", "Hyderabad South WH"]
const LOCATIONS = ["Zone A-01", "Zone A-02", "Zone B-01", "Zone B-02", "Zone C-01", "Zone C-02", "Dock-1", "Dock-2", "Dock-3", "Staging-1", "Staging-2", "Cold Room-1", "Cold Room-2", "Yard-1", "Yard-2"]

interface Pallet {
  id: string; type: string; material: string; status: string; state: string;
  weight: number; maxLoad: number; occupancy: number; warehouse: string;
  location: string; lastScan: string; scanCount: number; goods: string;
  skuCount: number; lotNo: string; stacked: boolean; stackPos: number;
  condition: string; nextAudit: string; assignedTo: string;
}

interface ContainerUnit {
  id: string; containerNo: string; type: string; code: string;
  status: string; warehouse: string; port: string;
  bookingNo: string; vessel: string; voyage: string;
  goods: string; material: string; weight: number; maxWeight: number;
  teu: number; temp: number; sealNo: string; eta: string; etd: string;
  destination: string; origin: string; stuffingPercent: number;
  damageReported: boolean; lastInspection: string;
}

const pallets: Pallet[] = []
for (let i = 0; i < 300; i++) {
  const pt = pick(PALLET_TYPES)
  const status = pick([...STATUSES])
  const state = pick([...Pallet_STATES])
  const cond = status === "Damaged" || state === "Damaged" ? pick(["Cracked", "Broken Board", "Nail Popped", "Warped", "Contaminated"]) : pick(["Good", "Good", "Fair", "Excellent"])
  pallets.push({
    id: `PAL-${String(1540001 + i).padStart(7, "0")}`,
    type: pt.name, material: pick(MATERIALS), status, state,
    weight: randInt(50, pt.load), maxLoad: pt.load,
    occupancy: Math.round(randInt(30, 100)),
    warehouse: pick(WAREHOUSES), location: pick(LOCATIONS),
    lastScan: `2026-07-${String(randInt(1, 28)).padStart(2, "0")}`,
    scanCount: randInt(0, 200),
    goods: pick(["Biscuit Cartons", "Laptop Boxes", "Tablet Strips", "T-Shirts", "Brake Pads", "Chemical Drums", "Rice Bags 25kg", "Steel Rods", "Carton Boxes", "TV Sets"]),
    skuCount: randInt(1, 24), lotNo: `LOT-${String(randInt(100000, 999999))}`,
    stacked: randInt(1, 100) > 40,
    stackPos: randInt(1, 4),
    condition: cond,
    nextAudit: `2026-${String(randInt(8, 10)).padStart(2, "0")}-${String(randInt(1, 28)).padStart(2, "0")}`,
    assignedTo: pick(["Putaway Team A", "Pick Team B", "Dispatch Team C", "Inbound Team D", "QC Team E", "Replenishment F", "Unassigned"]),
  })
}

const containers: ContainerUnit[] = []
for (let i = 0; i < 180; i++) {
  const ct = pick(CONTAINER_TYPES)
  const status = pick(["At Port", "In Yard", "Being Loaded", "Sealed", "Dispatched", "Arrived", "Empty Available", "Under Inspection"])
  const isReefer = ct.code.includes("RF") || ct.code.includes("RH")
  containers.push({
    id: `CTR-${String(1540001 + i).padStart(7, "0")}`,
    containerNo: `${ct.code}${String(randInt(1000000, 9999999)).slice(0, 7)}`,
    type: ct.name, code: ct.code,
    status, warehouse: pick(WAREHOUSES),
    port: pick(["JNPT Nhava Sheva", "Mumbai Port", "Chennai Port", "Kolkata Port", "Cochin Port", "Mundra Port"]),
    bookingNo: `BK-${String(randInt(10000000, 99999999))}`,
    vessel: pick(["MSC Giulia", "Maersk Elba", "CMA CGM Marco Polo", "COSCO Harmony", "Ever Given", "Hapag-Lloyd Berlin", "ONE Fortune", "Yang Ming Unity"]),
    voyage: `V-${String(randInt(100, 999))}${String.fromCharCode(65 + randInt(0, 25))}`,
    goods: pick(["General Cargo", "Refrigerated Goods", "Hazardous Material", "Oversized Cargo", "Bulk Cargo", "Machinery", "Textiles Export", "Auto Parts Import", "Pharma Export", "Steel Coils"]),
    material: pick(MATERIALS),
    weight: randInt(5000, ct.maxWeight),
    maxWeight: ct.maxWeight, teu: ct.teu,
    temp: isReefer ? randFloat(-25, 8) : 0,
    sealNo: randInt(1, 100) > 20 ? `SL-${String(randInt(100000, 999999))}` : "Pending",
    eta: `2026-${String(randInt(7, 9)).padStart(2, "0")}-${String(randInt(1, 28)).padStart(2, "0")}`,
    etd: `2026-${String(randInt(7, 9)).padStart(2, "0")}-${String(randInt(1, 28)).padStart(2, "0")}`,
    destination: pick(["Rotterdam", "Felixstowe", "Hamburg", "Singapore", "Dubai", "Colombo", "Shanghai", "Busan", "Long Beach", "Tanjung Priok"]),
    origin: pick(["Nhava Sheva", "Mumbai", "Chennai", "Kolkata", "Cochin", "Mundra", "Tuticorin", "Visakhapatnam"]),
    stuffingPercent: status === "Empty Available" ? 0 : randInt(10, 100),
    damageReported: randInt(1, 100) > 90,
    lastInspection: `2026-07-${String(randInt(1, 28)).padStart(2, "0")}`,
  })
}

const monthlyPalletMoves = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  inbound: randInt(800, 2500),
  outbound: randInt(700, 2400),
  repairs: randInt(20, 120),
  retired: randInt(5, 40),
}))

const containerThroughput = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  import: randInt(30, 80),
  export: randInt(20, 60),
  empty: randInt(10, 30),
}))

const palletTypeDist = PALLET_TYPES.map(pt => ({
  name: pt.name.split(" (")[0],
  count: pallets.filter(p => p.type === pt.name).length,
  color: pt.color,
}))

const containerTypeDist = CONTAINER_TYPES.map(ct => ({
  name: ct.code,
  count: containers.filter(c => c.code === ct.code).length,
  color: ct.color,
}))

const warehouseUtil = WAREHOUSES.map(wh => ({
  name: wh.split(" ")[0],
  pallets: pallets.filter(p => p.warehouse === wh).length,
  containers: containers.filter(c => c.warehouse === wh).length,
  avgOcc: Math.round(pallets.filter(p => p.warehouse === wh).reduce((s, p) => s + p.occupancy, 0) / Math.max(1, pallets.filter(p => p.warehouse === wh).length)),
}))

const conditionDist = [
  { name: "Excellent", value: pallets.filter(p => p.condition === "Excellent").length, color: "#10b981" },
  { name: "Good", value: pallets.filter(p => p.condition === "Good").length, color: "#3b82f6" },
  { name: "Fair", value: pallets.filter(p => p.condition === "Fair").length, color: "#f59e0b" },
  { name: "Cracked", value: pallets.filter(p => p.condition === "Cracked").length, color: "#f97316" },
  { name: "Broken Board", value: pallets.filter(p => p.condition === "Broken Board").length, color: "#ef4444" },
  { name: "Warped", value: pallets.filter(p => p.condition === "Warped").length, color: "#8b5cf6" },
]

const PORT_Radar = [
  { subject: "JNPT", score: randInt(70, 98) },
  { subject: "Mumbai", score: randInt(60, 90) },
  { subject: "Chennai", score: randInt(65, 92) },
  { subject: "Mundra", score: randInt(55, 85) },
  { subject: "Cochin", score: randInt(40, 75) },
  { subject: "Kolkata", score: randInt(35, 70) },
]

const STATUS_COLORS: Record<string, string> = {
  Available: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "In Use": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Maintenance: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Damaged: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  Quarantine: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "In Transit": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  Empty: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  Loaded: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  Ready: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  Stacked: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "At Dock": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  Repaired: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  Retired: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  "In Pick Zone": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "At Port": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  "In Yard": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  "Being Loaded": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Sealed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  Dispatched: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  Arrived: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Empty Available": "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  "Under Inspection": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
}

const PTYPE_COLORS: Record<string, string> = { Wooden: "#8B4513", Plastic: "#3b82f6", Metal: "#6b7280" }

export default function PalletContainerView() {
  const [activeTab, setActiveTab] = useState(0)
  const [statusFilter, setStatusFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedPallet, setSelectedPallet] = useState<Pallet | null>(null)
  const [selectedContainer, setSelectedContainer] = useState<ContainerUnit | null>(null)
  const [drawerMode, setDrawerMode] = useState<"pallet" | "container">("pallet")
  const tabs = ["Dashboard", "Pallet Inventory", "Container Tracking", "Storage Locations", "Analytics"]

  const filteredPallets = useMemo(() => {
    let data = [...pallets]
    if (statusFilter !== "All") data = data.filter(p => p.status === statusFilter)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      data = data.filter(p =>
        p.id.toLowerCase().includes(q) || p.type.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) || p.warehouse.toLowerCase().includes(q) ||
        p.goods.toLowerCase().includes(q) || p.lotNo.toLowerCase().includes(q)
      )
    }
    return data
  }, [statusFilter, searchQuery])

  const filteredContainers = useMemo(() => {
    let data = [...containers]
    if (statusFilter !== "All") data = data.filter(c => c.status === statusFilter)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      data = data.filter(c =>
        c.id.toLowerCase().includes(q) || c.containerNo.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q) || c.port.toLowerCase().includes(q) ||
        c.vessel.toLowerCase().includes(q) || c.destination.toLowerCase().includes(q) ||
        c.origin.toLowerCase().includes(q) || c.bookingNo.toLowerCase().includes(q)
      )
    }
    return data
  }, [statusFilter, searchQuery])

  const totalPallets = pallets.length
  const inUsePallets = pallets.filter(p => p.status === "In Use").length
  const damagedPallets = pallets.filter(p => p.condition === "Cracked" || p.condition === "Broken Board" || p.condition === "Warped" || p.condition === "Contaminated").length
  const avgOccupancy = Math.round(pallets.reduce((s, p) => s + p.occupancy, 0) / pallets.length)
  const totalContainers = containers.length
  const activeTEU = containers.reduce((s, c) => s + c.teu, 0)
  const avgStuffing = Math.round(containers.filter(c => c.stuffingPercent > 0).reduce((s, c) => s + c.stuffingPercent, 0) / Math.max(1, containers.filter(c => c.stuffingPercent > 0).length))

  const palStatusCounts: Record<string, number> = {
    All: pallets.length,
    Available: pallets.filter(p => p.status === "Available").length,
    "In Use": pallets.filter(p => p.status === "In Use").length,
    Maintenance: pallets.filter(p => p.status === "Maintenance").length,
    Damaged: pallets.filter(p => p.status === "Damaged").length,
    "In Transit": pallets.filter(p => p.status === "In Transit").length,
  }

  const ctrStatusCounts: Record<string, number> = {
    All: containers.length,
    "At Port": containers.filter(c => c.status === "At Port").length,
    "In Yard": containers.filter(c => c.status === "In Yard").length,
    "Being Loaded": containers.filter(c => c.status === "Being Loaded").length,
    Sealed: containers.filter(c => c.status === "Sealed").length,
    Dispatched: containers.filter(c => c.status === "Dispatched").length,
    "Empty Available": containers.filter(c => c.status === "Empty Available").length,
  }

  const openDrawerPallet = (p: Pallet) => { setSelectedPallet(p); setDrawerMode("pallet"); setDrawerOpen(true) }
  const openDrawerContainer = (c: ContainerUnit) => { setSelectedContainer(c); setDrawerMode("container"); setDrawerOpen(true) }

  function handleTabChange(idx: number) { setActiveTab(idx); setStatusFilter("All"); setSearchQuery("") }

  function renderDashboard() {
    return (
      <Fragment>
        <div className="pcm-kpi-grid">
          {[
            { label: "Total Pallets", value: String(totalPallets), icon: Layers, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40", sub: `${PALLET_TYPES.length} types` },
            { label: "Pallets In Use", value: String(inUsePallets), icon: Package, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/40", sub: `${Math.round(inUsePallets / totalPallets * 100)}% utilization` },
            { label: "Damaged Pallets", value: String(damagedPallets), icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/40", sub: "needs repair" },
            { label: "Avg Occupancy", value: `${avgOccupancy}%`, icon: Gauge, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40", sub: "across all pallets" },
            { label: "Total Containers", value: String(totalContainers), icon: BrickWall, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-950/40", sub: `${CONTAINER_TYPES.length} types` },
            { label: "Active TEU", value: String(activeTEU), icon: Warehouse, color: "text-teal-600", bg: "bg-teal-50 dark:bg-teal-950/40", sub: `avg stuffing ${avgStuffing}%` },
          ].map(kpi => (
            <Card key={kpi.label} className="pcm-kpi-card border-slate-100 dark:border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="pcm-label">{kpi.label}</p>
                    <p className={`pcm-value ${kpi.color}`}>{kpi.value}</p>
                    <p className="pcm-sub">{kpi.sub}</p>
                  </div>
                  <div className={`${kpi.bg} pcm-icon-wrap`}>
                    <kpi.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="pcm-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="pcm-title"><TrendingUp className="h-4 w-4 text-amber-500" />Monthly Pallet Movements</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <ComposedChart data={monthlyPalletMoves}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="inbound" fill="#3b82f6" name="Inbound" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="outbound" fill="#10b981" name="Outbound" radius={[2, 2, 0, 0]} />
                  <Line type="monotone" dataKey="repairs" stroke="#f59e0b" strokeWidth={2} dot={false} name="Repairs" />
                  <Line type="monotone" dataKey="retired" stroke="#ef4444" strokeWidth={2} dot={false} name="Retired" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="pcm-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="pcm-title"><Box className="h-4 w-4 text-indigo-500" />Container Throughput</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={containerThroughput}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Area type="monotone" dataKey="import" stackId="a" fill="#3b82f6" stroke="#3b82f6" name="Imports" />
                  <Area type="monotone" dataKey="export" stackId="a" fill="#10b981" stroke="#10b981" name="Exports" />
                  <Area type="monotone" dataKey="empty" stackId="a" fill="#94a3b8" stroke="#94a3b8" name="Empty" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="pcm-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="pcm-title"><Layers className="h-4 w-4 text-emerald-500" />Pallet Condition Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={conditionDist} cx="50%" cy="50%" innerRadius={45} outerRadius={85} paddingAngle={2} dataKey="value" label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ strokeWidth: 1 }}>
                    {conditionDist.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="pcm-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="pcm-title"><MapPin className="h-4 w-4 text-sky-500" />Port Handling Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={PORT_Radar}>
                  <PolarGrid className="stroke-gray-200 dark:stroke-gray-700" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9 }} />
                  <PolarRadiusAxis tick={{ fontSize: 8 }} domain={[0, 100]} />
                  <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="pcm-alerts-section">
          <h3 className="pcm-section-heading"><AlertTriangle className="h-4 w-4 text-amber-500" />Asset Alerts & Notifications</h3>
          <div className="pcm-alerts-grid">
            {[
              { icon: AlertTriangle, color: "text-red-600 bg-red-50 dark:bg-red-950/40", title: `${damagedPallets} Pallets Damaged`, desc: "Cracked or broken boards detected in last scan cycle", time: "Repair queue pending" },
              { icon: Clock, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40", title: `${pallets.filter(p => p.status === "Quarantine").length} Pallets Quarantined`, desc: "Contamination flagged — awaiting QC clearance", time: "Zone B isolated" },
              { icon: ShieldCheck, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40", title: "Pallet Audit Due", desc: `Next quarterly audit: 15-Aug-2026`, time: `${Math.round(totalPallets * 0.1)} pallets due` },
              { icon: BrickWall, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40", title: `${containers.filter(c => c.damageReported).length} Container Damage Reports`, desc: "Dented panels, broken locks reported at JNPT", time: "Inspection required" },
              { icon: RotateCw, color: "text-teal-600 bg-teal-50 dark:bg-teal-950/40", title: "Empty Container Repositioning", desc: `${containers.filter(c => c.status === "Empty Available").length} empty containers awaiting repositioning`, time: "Cost optimization" },
              { icon: Weight, color: "text-violet-600 bg-violet-950/40 dark:bg-violet-950/40", title: "Weight Compliance Alert", desc: `${randInt(2, 8)} containers exceed 95% max payload`, time: "Restuffing advised" },
            ].map(alert => (
              <div key={alert.title} className="pcm-alert-card">
                <div className="flex items-start gap-3">
                  <div className={`${alert.color} pcm-alert-icon`}>
                    <alert.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="pcm-alert-title">{alert.title}</p>
                    <p className="pcm-alert-desc">{alert.desc}</p>
                    <p className="pcm-alert-time">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Fragment>
    )
  }

  function renderPalletInventory() {
    return (
      <Fragment>
        <div className="flex flex-wrap gap-2 items-center mb-4">
          <div className="pcm-filter-bar">
            {Object.entries(palStatusCounts).map(([s, c]) => (
              <Badge key={s} variant={statusFilter === s ? "default" : "outline"} className={`pcm-filter-badge ${statusFilter === s ? "pcm-filter-active" : ""}`} onClick={() => setStatusFilter(s)}>
                {s} ({c})
              </Badge>
            ))}
          </div>
          <div className="pcm-search-wrap">
            <Search className="h-3.5 w-3.5 text-gray-400" />
            <input className="pcm-search-input" placeholder="Search pallets, location, SKU..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>
        <Card className="pcm-table-card border-slate-100 dark:border-slate-800">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="pcm-table">
                <thead>
                  <tr>
                    <th>Pallet ID</th><th>Type</th><th>Material</th><th>Weight/Max</th>
                    <th>Occupancy</th><th>Location</th><th>State</th><th>Condition</th><th>Status</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPallets.slice(0, 30).map(p => (
                    <tr key={p.id} className="pcm-table-row">
                      <td><span className="pcm-id">{p.id}</span><p className="text-[10px] text-slate-500 mt-0.5">{p.lotNo}</p></td>
                      <td>
                        <p className="text-xs font-medium text-slate-900 dark:text-slate-100">{p.type.split(" (")[0]}</p>
                        <p className="text-[10px] text-slate-500">{PALLET_TYPES.find(t => t.name === p.type)?.type || ""}</p>
                      </td>
                      <td className="text-xs text-slate-600 dark:text-slate-400">{p.material}</td>
                      <td>
                        <p className="text-xs text-slate-900 dark:text-slate-100">{p.weight} kg</p>
                        <p className="text-[10px] text-slate-500">/ {p.maxLoad} kg</p>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <div className="pcm-occ-bar">
                            <div className="pcm-occ-fill" style={{ width: `${p.occupancy}%`, background: p.occupancy > 90 ? "#ef4444" : p.occupancy > 70 ? "#f59e0b" : "#10b981" }} />
                          </div>
                          <span className="pcm-occ-label">{p.occupancy}%</span>
                        </div>
                      </td>
                      <td className="text-xs text-slate-600 dark:text-slate-400">{p.location}</td>
                      <td><span className={`pcm-status-badge ${STATUS_COLORS[p.state] || STATUS_COLORS[p.status] || ""}`}>{p.state}</span></td>
                      <td><Badge className={p.condition === "Good" || p.condition === "Excellent" ? "pcm-cond-good" : "pcm-cond-bad"}>{p.condition}</Badge></td>
                      <td><span className={`pcm-status-badge ${STATUS_COLORS[p.status] || ""}`}>{p.status}</span></td>
                      <td><Button size="sm" variant="ghost" className="pcm-action-btn" onClick={() => openDrawerPallet(p)}><Eye className="h-3.5 w-3.5" /></Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <p className="pcm-footer-count">Showing {Math.min(30, filteredPallets.length)} of {filteredPallets.length} pallets</p>
      </Fragment>
    )
  }

  function renderContainerTracking() {
    return (
      <Fragment>
        <div className="flex flex-wrap gap-2 items-center mb-4">
          <div className="pcm-filter-bar">
            {Object.entries(ctrStatusCounts).map(([s, c]) => (
              <Badge key={s} variant={statusFilter === s ? "default" : "outline"} className={`pcm-filter-badge ${statusFilter === s ? "pcm-filter-active" : ""}`} onClick={() => setStatusFilter(s)}>
                {s} ({c})
              </Badge>
            ))}
          </div>
          <div className="pcm-search-wrap">
            <Search className="h-3.5 w-3.5 text-gray-400" />
            <input className="pcm-search-input" placeholder="Search container, vessel, port..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>
        <Card className="pcm-table-card border-slate-100 dark:border-slate-800">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="pcm-table">
                <thead>
                  <tr>
                    <th>Container</th><th>Type</th><th>Vessel / Voyage</th><th>Route</th>
                    <th>Weight</th><th>Stuffing</th><th>Seal</th><th>Status</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContainers.slice(0, 30).map(c => (
                    <tr key={c.id} className="pcm-table-row">
                      <td>
                        <span className="pcm-id">{c.containerNo}</span>
                        <p className="text-[10px] text-slate-500 mt-0.5">{c.bookingNo}</p>
                      </td>
                      <td>
                        <Badge className={`pcm-ctr-type-badge ${c.code.includes("RF") || c.code.includes("RH") ? "pcm-reefer" : ""}`}>{c.code}</Badge>
                        <p className="text-[10px] text-slate-500 mt-0.5">{c.teu} TEU</p>
                      </td>
                      <td>
                        <p className="text-xs font-medium text-slate-900 dark:text-slate-100">{c.vessel}</p>
                        <p className="text-[10px] text-slate-500">{c.voyage}</p>
                      </td>
                      <td>
                        <p className="text-[10px] text-slate-600 dark:text-slate-400">{c.origin.split(" ")[0]} → {c.destination}</p>
                        <p className="text-[10px] text-slate-500">via {c.port.split(" ")[0]}</p>
                      </td>
                      <td>
                        <p className="text-xs text-slate-900 dark:text-slate-100">{(c.weight / 1000).toFixed(1)}t</p>
                        <p className="text-[10px] text-slate-500">/ {(c.maxWeight / 1000).toFixed(1)}t</p>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <div className="pcm-occ-bar">
                            <div className="pcm-occ-fill" style={{ width: `${c.stuffingPercent}%`, background: c.stuffingPercent > 95 ? "#ef4444" : c.stuffingPercent > 80 ? "#f59e0b" : "#10b981" }} />
                          </div>
                          <span className="pcm-occ-label">{c.stuffingPercent}%</span>
                        </div>
                      </td>
                      <td className="text-xs text-slate-600 dark:text-slate-400">{c.sealNo === "Pending" ? <Badge className="pcm-seal-pending">Pending</Badge> : <span className="text-[10px] font-mono">{c.sealNo}</span>}</td>
                      <td><span className={`pcm-status-badge ${STATUS_COLORS[c.status] || ""}`}>{c.status}</span></td>
                      <td><Button size="sm" variant="ghost" className="pcm-action-btn" onClick={() => openDrawerContainer(c)}><Eye className="h-3.5 w-3.5" /></Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <p className="pcm-footer-count">Showing {Math.min(30, filteredContainers.length)} of {filteredContainers.length} containers</p>
      </Fragment>
    )
  }

  function renderStorageLocations() {
    return (
      <Fragment>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="pcm-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="pcm-title"><Layers className="h-4 w-4 text-amber-500" />Pallet Distribution by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={palletTypeDist} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Pallets">
                    {palletTypeDist.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="pcm-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="pcm-title"><BrickWall className="h-4 w-4 text-indigo-500" />Container Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={containerTypeDist} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2} dataKey="count" label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ strokeWidth: 1 }}>
                    {containerTypeDist.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="pcm-table-card border-slate-100 dark:border-slate-800 mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="pcm-title"><MapPin className="h-4 w-4 text-sky-500" />Warehouse Asset Utilization</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="pcm-table">
                <thead>
                  <tr><th>Warehouse</th><th>Pallets</th><th>Containers</th><th>Avg Occupancy</th><th>Utilization</th></tr>
                </thead>
                <tbody>
                  {warehouseUtil.map(w => (
                    <tr key={w.name} className="pcm-table-row">
                      <td className="text-xs font-medium text-slate-900 dark:text-slate-100">{w.name}</td>
                      <td className="text-xs text-slate-600 dark:text-slate-400">{w.pallets}</td>
                      <td className="text-xs text-slate-600 dark:text-slate-400">{w.containers}</td>
                      <td className="text-xs text-slate-600 dark:text-slate-400">{w.avgOcc}%</td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <div className="pcm-occ-bar">
                            <div className="pcm-occ-fill" style={{ width: `${w.avgOcc}%`, background: w.avgOcc > 85 ? "#ef4444" : w.avgOcc > 70 ? "#f59e0b" : "#10b981" }} />
                          </div>
                          <span className="pcm-occ-label">{w.avgOcc}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </Fragment>
    )
  }

  function renderAnalytics() {
    return (
      <Fragment>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="pcm-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="pcm-title"><TrendingUp className="h-4 w-4 text-emerald-500" />Pallet Lifecycle Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={monthlyPalletMoves}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Line type="monotone" dataKey="repairs" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Repairs" />
                  <Line type="monotone" dataKey="retired" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="Retired" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="pcm-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="pcm-title"><ArrowDownUp className="h-4 w-4 text-indigo-500" />Import vs Export Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <ComposedChart data={containerThroughput}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="import" fill="#3b82f6" name="Import" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="export" fill="#10b981" name="Export" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="empty" stroke="#94a3b8" strokeWidth={2} dot={false} name="Empty Reposition" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 mt-4">
          {PALLET_TYPES.map(pt => {
            const ptPallets = pallets.filter(p => p.type === pt.name)
            const avgCond = ptPallets.length > 0 ? ptPallets.filter(p => p.condition === "Good" || p.condition === "Excellent").length / ptPallets.length * 100 : 0
            const inUse = ptPallets.filter(p => p.status === "In Use").length
            return (
              <Card key={pt.name} className="pcm-type-card border-slate-100 dark:border-slate-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="pcm-type-dot" style={{ background: pt.color }} />
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{pt.name.split(" (")[0]}</p>
                      <p className="text-[10px] text-slate-500">{pt.size} | {pt.type}</p>
                    </div>
                  </div>
                  <div className="pcm-type-stats">
                    <div className="pcm-type-stat"><p className="pcm-type-stat-val">{ptPallets.length}</p><p className="pcm-type-stat-lbl">Total</p></div>
                    <div className="pcm-type-stat"><p className="pcm-type-stat-val">{inUse}</p><p className="pcm-type-stat-lbl">In Use</p></div>
                    <div className="pcm-type-stat"><p className="pcm-type-stat-val">{pt.load}kg</p><p className="pcm-type-stat-lbl">Max Load</p></div>
                    <div className="pcm-type-stat"><p className="pcm-type-stat-val" style={{ color: avgCond >= 70 ? "#10b981" : avgCond >= 40 ? "#f59e0b" : "#ef4444" }}>{avgCond.toFixed(0)}%</p><p className="pcm-type-stat-lbl">Health</p></div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </Fragment>
    )
  }

  function renderDrawer() {
    if (drawerMode === "pallet" && selectedPallet) {
      const p = selectedPallet
      return (
        <div className="pcm-drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="pcm-drawer" onClick={e => e.stopPropagation()}>
            <div className={`pcm-drawer-header ${p.condition === "Good" || p.condition === "Excellent" ? "pcm-drawer-header-good" : "pcm-drawer-header-damaged"}`}>
              <div className="flex items-center gap-3">
                <div className="pcm-drawer-icon"><Layers className="h-5 w-5" /></div>
                <div>
                  <h3 className="pcm-drawer-title">{p.id}</h3>
                  <p className="pcm-drawer-subtitle">{p.type} | {p.lotNo}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="pcm-drawer-close" onClick={() => setDrawerOpen(false)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="pcm-drawer-body">
              <div className="pcm-drawer-status-row">
                <span className={`pcm-status-badge ${STATUS_COLORS[p.status] || ""}`}>{p.status}</span>
                <span className={`pcm-status-badge ${STATUS_COLORS[p.state] || ""}`}>{p.state}</span>
                <Badge className={p.condition === "Good" || p.condition === "Excellent" ? "pcm-cond-good" : "pcm-cond-bad"}>{p.condition}</Badge>
              </div>
              <div className="pcm-detail-grid">
                <div className="pcm-detail-item"><p className="pcm-detail-label">Pallet Type</p><p className="pcm-detail-value">{p.type}</p></div>
                <div className="pcm-detail-item"><p className="pcm-detail-label">Material</p><p className="pcm-detail-value">{p.material}</p></div>
                <div className="pcm-detail-item"><p className="pcm-detail-label">Goods</p><p className="pcm-detail-value">{p.goods}</p></div>
                <div className="pcm-detail-item"><p className="pcm-detail-label">SKU Count</p><p className="pcm-detail-value">{p.skuCount} SKUs</p></div>
                <div className="pcm-detail-item"><p className="pcm-detail-label">Weight / Max</p><p className="pcm-detail-value">{p.weight} / {p.maxLoad} kg</p></div>
                <div className="pcm-detail-item"><p className="pcm-detail-label">Occupancy</p><p className="pcm-detail-value">{p.occupancy}%</p></div>
                <div className="pcm-detail-item"><p className="pcm-detail-label">Warehouse</p><p className="pcm-detail-value">{p.warehouse}</p></div>
                <div className="pcm-detail-item"><p className="pcm-detail-label">Location</p><p className="pcm-detail-value">{p.location}</p></div>
                <div className="pcm-detail-item"><p className="pcm-detail-label">Stacked</p><p className="pcm-detail-value">{p.stacked ? `Yes (Pos ${p.stackPos})` : "No"}</p></div>
                <div className="pcm-detail-item"><p className="pcm-detail-label">Assigned To</p><p className="pcm-detail-value">{p.assignedTo}</p></div>
                <div className="pcm-detail-item"><p className="pcm-detail-label">Last Scan</p><p className="pcm-detail-value">{p.lastScan} ({p.scanCount} scans)</p></div>
                <div className="pcm-detail-item"><p className="pcm-detail-label">Next Audit</p><p className="pcm-detail-value">{p.nextAudit}</p></div>
              </div>
              <div className="pcm-drawer-actions">
                <Button size="sm" className="pcm-btn-primary"><ScanBarcode className="h-3.5 w-3.5 mr-1" /> Scan Pallet</Button>
                <Button size="sm" variant="outline" className="pcm-btn-outline"><RotateCw className="h-3.5 w-3.5 mr-1" /> Transfer</Button>
                <Button size="sm" variant="outline" className="pcm-btn-outline"><ClipboardList className="h-3.5 w-3.5 mr-1" /> Audit</Button>
              </div>
            </div>
          </div>
        </div>
      )
    }
    if (drawerMode === "container" && selectedContainer) {
      const c = selectedContainer
      const isReefer = c.code.includes("RF") || c.code.includes("RH")
      return (
        <div className="pcm-drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="pcm-drawer pcm-drawer-header-container">
            <div className="pcm-drawer-header pcm-drawer-header-ctr">
              <div className="flex items-center gap-3">
                <div className="pcm-drawer-icon"><BrickWall className="h-5 w-5" /></div>
                <div>
                  <h3 className="pcm-drawer-title">{c.containerNo}</h3>
                  <p className="pcm-drawer-subtitle">{c.type} ({c.code}) | {c.teu} TEU</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="pcm-drawer-close" onClick={() => setDrawerOpen(false)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="pcm-drawer-body">
              <div className="pcm-drawer-status-row">
                <span className={`pcm-status-badge ${STATUS_COLORS[c.status] || ""}`}>{c.status}</span>
                <Badge className="pcm-seal-badge">{c.sealNo === "Pending" ? "No Seal" : `Sealed`}</Badge>
                {c.damageReported && <Badge className="pcm-dmg-badge">Damage Reported</Badge>}
              </div>
              <div className="pcm-detail-grid">
                <div className="pcm-detail-item"><p className="pcm-detail-label">Vessel</p><p className="pcm-detail-value">{c.vessel}</p></div>
                <div className="pcm-detail-item"><p className="pcm-detail-label">Voyage</p><p className="pcm-detail-value">{c.voyage}</p></div>
                <div className="pcm-detail-item"><p className="pcm-detail-label">Booking No.</p><p className="pcm-detail-value text-[11px]">{c.bookingNo}</p></div>
                <div className="pcm-detail-item"><p className="pcm-detail-label">Goods</p><p className="pcm-detail-value">{c.goods}</p></div>
                <div className="pcm-detail-item"><p className="pcm-detail-label">Material</p><p className="pcm-detail-value">{c.material}</p></div>
                <div className="pcm-detail-item"><p className="pcm-detail-label">Weight / Max</p><p className="pcm-detail-value">{(c.weight / 1000).toFixed(1)}t / {(c.maxWeight / 1000).toFixed(1)}t</p></div>
                <div className="pcm-detail-item"><p className="pcm-detail-label">Stuffing</p><p className="pcm-detail-value">{c.stuffingPercent}%</p></div>
                <div className="pcm-detail-item"><p className="pcm-detail-label">{isReefer ? "Temperature" : "Type"}</p><p className="pcm-detail-value">{isReefer ? `${c.temp}°C` : c.type}</p></div>
                <div className="pcm-detail-item"><p className="pcm-detail-label">Origin</p><p className="pcm-detail-value">{c.origin}</p></div>
                <div className="pcm-detail-item"><p className="pcm-detail-label">Destination</p><p className="pcm-detail-value">{c.destination}</p></div>
                <div className="pcm-detail-item"><p className="pcm-detail-label">Port</p><p className="pcm-detail-value">{c.port}</p></div>
                <div className="pcm-detail-item"><p className="pcm-detail-label">ETD / ETA</p><p className="pcm-detail-value">{c.etd} / {c.eta}</p></div>
              </div>
              <div className="pcm-duty-breakdown">
                <h4 className="pcm-duty-title">Container Capacity</h4>
                <div className="pcm-capacity-bar">
                  <div className="pcm-capacity-fill" style={{ width: `${Math.round(c.weight / c.maxWeight * 100)}%`, background: c.weight / c.maxWeight > 0.95 ? "#ef4444" : c.weight / c.maxWeight > 0.8 ? "#f59e0b" : "#10b981" }} />
                  <span className="pcm-capacity-label">{Math.round(c.weight / c.maxWeight * 100)}% weight utilized</span>
                </div>
              </div>
              <div className="pcm-drawer-actions">
                <Button size="sm" className="pcm-btn-primary"><QrCode className="h-3.5 w-3.5 mr-1" /> Scan Container</Button>
                <Button size="sm" variant="outline" className="pcm-btn-outline"><ArrowRightLeft className="h-3.5 w-3.5 mr-1" /> Transfer</Button>
                <Button size="sm" variant="outline" className="pcm-btn-outline"><Download className="h-3.5 w-3.5 mr-1" /> DO Copy</Button>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="pcm-container space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <div>
          <h1 className="pcm-page-title"><Box className="h-5 w-5 text-amber-500" />Pallet & Container Management</h1>
          <p className="pcm-page-subtitle">Track pallets, containers, storage utilization and asset lifecycle across warehouses</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="pcm-btn-primary"><Plus className="h-3.5 w-3.5 mr-1" /> Add Pallet</Button>
          <Button size="sm" variant="outline" className="pcm-btn-outline"><RefreshCw className="h-3.5 w-3.5 mr-1" /> Audit Scan</Button>
          <Button size="sm" variant="outline" className="pcm-btn-outline"><Download className="h-3.5 w-3.5 mr-1" /> Export</Button>
        </div>
      </div>

      <div className="pcm-tabs-bar">
        {tabs.map((tab, idx) => (
          <button key={tab} className={`pcm-tab ${activeTab === idx ? "pcm-tab-active" : ""}`} onClick={() => handleTabChange(idx)}>
            <span className="pcm-tab-label">{tab}</span>
            {activeTab === idx && <span className="pcm-tab-indicator" />}
          </button>
        ))}
      </div>

      {activeTab === 0 && renderDashboard()}
      {activeTab === 1 && renderPalletInventory()}
      {activeTab === 2 && renderContainerTracking()}
      {activeTab === 3 && renderStorageLocations()}
      {activeTab === 4 && renderAnalytics()}

      {drawerOpen && renderDrawer()}
    </div>
  )
}
