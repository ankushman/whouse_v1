"use client"

import { useState, useMemo } from "react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts"
import {
  Search, Eye, ArrowUpDown, TrendingUp, TrendingDown, Clock, IndianRupee, Zap,
  AlertTriangle, Users, BarChart3, MapPin, Package, Box, CheckCircle, XCircle, Activity, Timer, ShieldCheck, Star, Radio, Gauge, Warehouse, Layers, ScanLine, Factory, Weight, Ruler, Settings, Grid3x3, Maximize2, Move, ArrowRight, ChevronRight, RefreshCw, Download, Filter, Target, LayoutGrid, PackageSearch, ScanBarcode, ClipboardCheck
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const ZONE_TYPES = ["Picking Zone","Receiving Dock","Shipping Dock","Staging","Cold Storage","Bulk Storage","Returns Area","Value-added Services","Kitting Area","QC Hold"] as const
const ZONE_EMOJI: Record<string,string> = {["Picking Zone"]:"PK",["Receiving Dock"]:"RC",["Shipping Dock"]:"SH",Staging:"ST",["Cold Storage"]:"CS",["Bulk Storage"]:"BS",["Returns Area"]:"RT",["Value-added Services"]:"VAS",["Kitting Area"]:"KT",["QC Hold"]:"QC"}
const SLOT_TYPES = ["Pallet Rack","Shelf Bin","Floor Stack","Flow Rack","Carton Flow","Mezzanine","Mobile Rack","Drive-in","Push-back","ASRS"] as const
const EQUIP_TYPES = ["Forklift","Pallet Jack","Conveyor","Reach Truck","Order Picker","Cherry Picker","Scissor Lift","Automated Crane","AGV","Robotic Arm"] as const
const EQUIP_STS = ["Active","Maintenance","Idle","Reserved","Decommissioned"] as const
const CITIES = ["Mumbai","Delhi","Bangalore","Chennai","Hyderabad","Kolkata","Pune","Ahmedabad"] as const
const LAYOUT_STS = ["Active","Draft","Under Review","Deprecated","Migrated"] as const
const MO = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] as const
const TH = {blue:"#3b82f6",emerald:"#059669",amber:"#d97706",violet:"#7c3aed",rose:"#e11d48",cyan:"#0891b2",indigo:"#4f46e5",orange:"#ea580c"}
const PC = [TH.blue,TH.emerald,TH.amber,TH.violet,TH.rose,TH.cyan,TH.indigo,TH.orange]

function seededRandom(seed: number): number { const x = Math.sin(seed * 9301 + 49297 + 233280) * 10000; return x - Math.floor(x) }
function ri(a: number, b: number, s: number): number { return Math.floor(seededRandom(s) * (b - a + 1)) + a }
function pick<T>(arr: readonly T[], s: number): T { return arr[Math.abs(s) % arr.length] }
function filterData<T>(d: T[], q: string): T[] { if (!q) return d; const l = q.toLowerCase(); return d.filter(i => Object.values(i as unknown as Record<string, string | number>).some(v => String(v).toLowerCase().includes(l))) }
function sortedData<T>(d: T[], f: string, dir: "asc" | "desc"): T[] { return [...d].sort((a, b) => { const av = (a as unknown as Record<string, string | number>)[f], bv = (b as unknown as Record<string, string | number>)[f]; if (typeof av === "number" && typeof bv === "number") return dir === "asc" ? av - bv : bv - av; return dir === "asc" ? String(av ?? "").localeCompare(String(bv ?? "")) : String(bv ?? "").localeCompare(String(av ?? "")) }) }

/* 16 Visual Components */
function ZoneBadge({ z }: { z: string }) {
  const cl: Record<string,string> = {["Picking Zone"]:"bg-emerald-100 text-emerald-700",["Receiving Dock"]:"bg-blue-100 text-blue-700",["Shipping Dock"]:"bg-amber-100 text-amber-700",Staging:"bg-violet-100 text-violet-700",["Cold Storage"]:"bg-cyan-100 text-cyan-700",["Bulk Storage"]:"bg-indigo-100 text-indigo-700",["Returns Area"]:"bg-rose-100 text-rose-700",["Value-added Services"]:"bg-orange-100 text-orange-700",["Kitting Area"]:"bg-pink-100 text-pink-700",["QC Hold"]:"bg-red-100 text-red-700"}
  return <span className={"wcs-zone inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium " + (cl[z]||"bg-gray-100")}>{ZONE_EMOJI[z]} {z}</span>
}
function SlotBadge({ t }: { t: string }) { return <span className="wcs-slot inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">📁 {t}</span> }
function EquipBadge({ t }: { t: string }) {
  const cl: Record<string,string> = {Forklift:"bg-amber-100 text-amber-700","Pallet Jack":"bg-blue-100 text-blue-700",Conveyor:"bg-emerald-100 text-emerald-700","Reach Truck":"bg-violet-100 text-violet-700","Order Picker":"bg-cyan-100 text-cyan-700","Cherry Picker":"bg-rose-100 text-rose-700","Scissor Lift":"bg-indigo-100 text-indigo-700","Automated Crane":"bg-orange-100 text-orange-700",AGV:"bg-teal-100 text-teal-700","Robotic Arm":"bg-pink-100 text-pink-700"}
  return <span className={"wcs-eq inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium " + (cl[t]||"bg-gray-100")}>🔧 {t}</span>
}
function EquipStatusBadge({ s }: { s: string }) {
  const cl: Record<string,string> = {Active:"bg-emerald-100 text-emerald-700",Maintenance:"bg-amber-100 text-amber-700 animate-pulse",Idle:"bg-slate-100 text-slate-600",Reserved:"bg-blue-100 text-blue-700",Decommissioned:"bg-gray-100 text-gray-500"}
  return <span className={"wcs-es inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cl[s]||"bg-gray-100")}>● {s}</span>
}
function LayoutStatusBadge({ s }: { s: string }) {
  const cl: Record<string,string> = {Active:"bg-emerald-100 text-emerald-700",Draft:"bg-blue-100 text-blue-700","Under Review":"bg-amber-100 text-amber-700",Deprecated:"bg-gray-100 text-gray-500",Migrated:"bg-violet-100 text-violet-700"}
  return <span className={"wcs-ls inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold " + (cl[s]||"bg-gray-100")}>● {s}</span>
}
function CityBadge({ city }: { city: string }) { return <span className="wcs-city inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">📍 {city}</span> }
function UtilBar({ pct }: { pct: number }) {
  const c = pct > 90 ? "bg-red-500" : pct > 75 ? "bg-amber-500" : pct > 50 ? "bg-blue-500" : "bg-emerald-500"
  return <div className="wcs-util flex items-center gap-2"><div className="flex-1 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700"><div className={"h-full rounded-full transition-all " + c} style={{width: Math.min(pct,100)+"%"}}/></div><span className="text-[10px] font-bold tabular-nums">{pct}%</span></div>
}
function CapacityTile({ used, total, unit }: { used: number; total: number; unit: string }) {
  const pct = Math.round((used / Math.max(total, 1)) * 100)
  const c = pct > 90 ? "text-red-600" : pct > 75 ? "text-amber-600" : pct > 50 ? "text-blue-600" : "text-emerald-600"
  return <div className="wcs-cap flex items-center gap-2"><span className={"text-sm font-bold tabular-nums " + c}>{used}/{total}</span><span className="text-[10px] text-muted-foreground">{unit}</span></div>
}
function ValueTile({ value, label, trend }: { value: string; label: string; trend: number }) {
  return <div className="wcs-val text-right"><div className="text-sm font-bold tabular-nums">{value}</div><div className="text-[10px] text-muted-foreground">{label}</div>{trend !== 0 && <div className={"text-[10px] font-semibold flex items-center justify-end gap-0.5 " + (trend > 0 ? "text-emerald-600" : "text-red-600")}>{trend > 0 ? <TrendingUp className="h-3 w-3"/> : <TrendingDown className="h-3 w-3"/>}{Math.abs(trend)}%</div>}</div>
}
function StarRating({ value }: { value: number }) { return <span className="wcs-stars inline-flex gap-0.5">{"★".repeat(value)}{"☆".repeat(5-value)}</span> }
function WeightTile({ value }: { value: number }) { return <span className="wcs-wt text-sm font-bold tabular-nums text-indigo-600 dark:text-indigo-400">{value.toLocaleString()} kg</span> }
function ThroughputTile({ value }: { value: number }) { return <span className="wcs-tp text-sm font-bold tabular-nums text-emerald-600 dark:text-emerald-400">{value.toLocaleString()} ops/hr</span> }
function SlotCountTile({ total, occupied }: { total: number; occupied: number }) {
  const pct = Math.round((occupied / Math.max(total, 1)) * 100)
  return <div className="wcs-slot-count flex items-center gap-2"><span className="text-sm font-bold tabular-nums">{occupied}<span className="text-muted-foreground font-normal">/{total}</span></span><div className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700"><div className={"h-full rounded-full " + (pct > 90 ? "bg-red-500" : pct > 75 ? "bg-amber-500" : "bg-emerald-500")} style={{width: pct+"%"}}/></div></div>
}
function ValueTileNoTrend({ value, label }: { value: string; label: string }) {
  return <div className="wcs-val text-right"><div className="text-sm font-bold tabular-nums">{value}</div><div className="text-[10px] text-muted-foreground">{label}</div></div>
}

function genZones() {
  return Array.from({length: 50}, (_, i) => ({
    id: "ZONE-" + String(i+11001).padStart(4,"0"),
    name: pick(ZONE_TYPES, i+1) + " " + String.fromCharCode(65 + (i % 8)),
    type: pick(ZONE_TYPES, i+1),
    city: pick(CITIES, i+2),
    capacity: ri(200, 2000, i+3),
    occupied: ri(50, 1800, i+4),
    totalSlots: ri(20, 200, i+5),
    usedSlots: ri(5, 180, i+6),
    utilization: ri(30, 98, i+7),
    throughput: ri(100, 800, i+8),
    maxWeight: ri(500, 10000, i+9),
    currentWeight: ri(100, 9000, i+10),
    tempZone: pick(["Ambient","Cold","Frozen","Controlled"], i+11),
  }))
}

function genEquipment() {
  return Array.from({length: 60}, (_, i) => ({
    id: "EQ-" + String(i+12001).padStart(4,"0"),
    type: pick(EQUIP_TYPES, i+1),
    status: pick(EQUIP_STS, i+2),
    city: pick(CITIES, i+3),
    zone: pick(ZONE_TYPES, i+4),
    utilization: ri(10, 95, i+5),
    operatingHours: ri(100, 2000, i+6),
    efficiency: ri(60, 99, i+7),
    maintCost: ri(5, 50, i+8),
    lastService: ri(1, 60, i+9) + "d ago",
    nextService: ri(1, 90, i+10) + "d",
  }))
}

function genLayouts() {
  return Array.from({length: 30}, (_, i) => ({
    id: "LAY-" + String(i+13001).padStart(4,"0"),
    name: pick(["Layout Alpha","Layout Beta","Layout Gamma","Layout Delta","Layout Epsilon"], i+1) + " v" + ri(1,5,i+2),
    status: pick(LAYOUT_STS, i+3),
    city: pick(CITIES, i+4),
    zones: ri(8, 24, i+5),
    totalArea: ri(5000, 50000, i+6) + " sqft",
    utilization: ri(60, 98, i+7),
    throughput: ri(500, 3000, i+8),
    efficiency: ri(70, 98, i+9),
  }))
}

function genCharts() {
  const monthly = MO.map((m, i) => ({ month: m, util: ri(60,95,i), throughput: ri(2000,8000,i+12), config: ri(2,15,i+24) }))
  const zonePie = ZONE_TYPES.map((z, i) => ({ name: z.split(" ")[0], value: ri(5,30,i) }))
  const equipBar = EQUIP_TYPES.map((e, i) => ({ name: e.split(" ")[0], active: ri(5,15,i), maintenance: ri(0,3,i+10), util: ri(50,95,i+20) }))
  const slotPie = SLOT_TYPES.map((s, i) => ({ name: s.split(" ")[0], count: ri(50,300,i) }))
  return { monthly, zonePie, equipBar, slotPie }
}

export default function WmsConfigurationStudioView() {
  const [tab, setTab] = useState("overview")
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState("id")
  const [sortDir, setSortDir] = useState<"asc"|"desc">("asc")
  const [detail, setDetail] = useState<Record<string, unknown>|null>(null)

  const zones = useMemo(() => genZones(), [])
  const equipment = useMemo(() => genEquipment(), [])
  const layouts = useMemo(() => genLayouts(), [])
  const charts = useMemo(() => genCharts(), [])

  const filteredZones = useMemo(() => sortedData(filterData(zones, search), sortField, sortDir), [zones, search, sortField, sortDir])
  const filteredEquip = useMemo(() => sortedData(filterData(equipment, search), sortField, sortDir), [equipment, search, sortField, sortDir])
  const filteredLayouts = useMemo(() => sortedData(filterData(layouts, search), sortField, sortDir), [layouts, search, sortField, sortDir])

  const toggleSort = (f: string) => { if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortField(f); setSortDir("asc") } }

  const tab0 = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[['Total Zones','50','+4',<Layers key='l'/>],['Avg Utilization','78%','+3%',<Gauge key='g'/>],['Equipment Active','48','+2',<Settings key='s'/>],['Total Slots','2,450','+120',<Grid3x3 key='gr'/>],['Layouts Active','18','+1',<LayoutGrid key='lg'/>],['Config Changes','12','+5',<RefreshCw key='r'/>],['Throughput','5,240 ops/hr','+8%',<Activity key='a'/>],['Warehouse Area','2.8L sqft','0',<Maximize2 key='m'/>]].map(([label,val,tr,icon], i) => (
          <Card key={i} className="glass-subtle wcs-kpi"><CardContent className="p-3"><div className="flex items-center gap-2.5">{icon}<div><div className="text-[10px] text-muted-foreground">{String(label)}</div><div className="text-lg font-black tabular-nums">{String(val)}</div><div className="text-[10px] font-semibold text-emerald-600">{String(tr)}</div></div></div></CardContent></Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="glass-subtle wcs-chart"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Monthly Utilization & Throughput</CardTitle></CardHeader><CardContent className="p-3"><LineChart data={charts.monthly}><CartesianGrid strokeDasharray="3 3" className="opacity-30"/><XAxis dataKey="month" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip wrapperClassName="rounded-lg shadow-lg"/><Line type="monotone" dataKey="util" stroke={TH.blue} strokeWidth={2}/><Line type="monotone" dataKey="throughput" stroke={TH.emerald} strokeWidth={2}/></LineChart></CardContent></Card>
        <Card className="glass-subtle wcs-chart"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Zone Type Distribution</CardTitle></CardHeader><CardContent className="p-3"><PieChart><Pie data={charts.zonePie} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name}: {name:string}) => <text x={0} y={0} fill="currentColor" fontSize={9} textAnchor="middle">{name}</text>}>{charts.zonePie.map((_,i) => <Cell key={i} fill={PC[i%PC.length]}/>)}</Pie><Tooltip/></PieChart></CardContent></Card>
        <Card className="glass-subtle wcs-chart"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Equipment Status</CardTitle></CardHeader><CardContent className="p-3"><BarChart data={charts.equipBar}><CartesianGrid strokeDasharray="3 3" className="opacity-30"/><XAxis dataKey="name" tick={{fontSize:9}}/><YAxis tick={{fontSize:10}}/><Tooltip wrapperClassName="rounded-lg shadow-lg"/><Bar dataKey="active" fill={TH.emerald} radius={[4,4,0,0]}/><Bar dataKey="maintenance" fill={TH.amber} radius={[4,4,0,0]}/></BarChart></CardContent></Card>
        <Card className="glass-subtle wcs-chart"><CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-semibold">Slot Type Distribution</CardTitle></CardHeader><CardContent className="p-3"><PieChart><Pie data={charts.slotPie} cx="50%" cy="50%" outerRadius={80} dataKey="count" label={({name}: {name:string}) => <text x={0} y={0} fill="currentColor" fontSize={9} textAnchor="middle">{name}</text>}>{charts.slotPie.map((_,i) => <Cell key={i} fill={PC[i%PC.length]}/>)}</Pie><Tooltip/></PieChart></CardContent></Card>
      </div>
    </div>
  )

  const tab1 = (
    <div className="space-y-3">
      <div className="flex items-center gap-2"><div className="relative flex-1"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground"/><Input className="h-8 pl-8 text-xs" placeholder="Search zones..." value={search} onChange={e => setSearch(e.target.value)}/></div></div>
      <div className="rounded-lg border overflow-auto max-h-[calc(100vh-280px)]">
        <table className="w-full text-xs"><thead className="bg-blue-50 dark:bg-blue-900/20 sticky top-0 z-10"><tr>
          <th className="p-2 text-left font-semibold cursor-pointer select-none" onClick={() => toggleSort("id")}>ID <ArrowUpDown className="inline h-3 w-3 ml-0.5 opacity-50"/></th>
          <th className="p-2 text-left font-semibold">Type</th>
          <th className="p-2 text-left font-semibold">City</th>
          <th className="p-2 text-left font-semibold">Capacity</th>
          <th className="p-2 text-left font-semibold">Occupied</th>
          <th className="p-2 text-left font-semibold">Utilization</th>
          <th className="p-2 text-left font-semibold">Slots</th>
          <th className="p-2 text-left font-semibold">Throughput</th>
          <th className="p-2 text-left font-semibold">Weight</th>
          <th className="p-2 text-left font-semibold">Temp</th>
          <th className="p-2"></th>
        </tr></thead><tbody className="divide-y">
          {filteredZones.map(row => (
            <tr key={row.id} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
              <td className="p-2 font-mono font-medium">{row.id}</td>
              <td className="p-2"><ZoneBadge z={row.type}/></td>
              <td className="p-2"><CityBadge city={row.city}/></td>
              <td className="p-2"><CapacityTile used={row.occupied} total={row.capacity} unit="loc"/></td>
              <td className="p-2 numeric-cell tabular-nums">{row.occupied.toLocaleString()}</td>
              <td className="p-2"><UtilBar pct={row.utilization}/></td>
              <td className="p-2"><SlotCountTile total={row.totalSlots} occupied={row.usedSlots}/></td>
              <td className="p-2"><ThroughputTile value={row.throughput}/></td>
              <td className="p-2"><WeightTile value={row.currentWeight}/></td>
              <td className="p-2"><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">{row.tempZone === "Cold" ? "\u2744\ufe0f" : row.tempZone === "Frozen" ? "\U0001f9ca" : "🌡️"} {row.tempZone}</span></td>
              <td className="p-2"><Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setDetail(row)}><Eye className="h-3 w-3"/></Button></td>
            </tr>
          ))}
        </tbody></table>
      </div>
      <div className="text-[10px] text-muted-foreground text-right">{filteredZones.length} zones</div>
    </div>
  )

  const tab2 = (
    <div className="space-y-3">
      <div className="flex items-center gap-2"><div className="relative flex-1"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground"/><Input className="h-8 pl-8 text-xs" placeholder="Search equipment..." value={search} onChange={e => setSearch(e.target.value)}/></div></div>
      <div className="rounded-lg border overflow-auto max-h-[calc(100vh-280px)]">
        <table className="w-full text-xs"><thead className="bg-amber-50 dark:bg-amber-900/20 sticky top-0 z-10"><tr>
          <th className="p-2 text-left font-semibold cursor-pointer select-none" onClick={() => toggleSort("id")}>ID <ArrowUpDown className="inline h-3 w-3 ml-0.5 opacity-50"/></th>
          <th className="p-2 text-left font-semibold">Type</th>
          <th className="p-2 text-left font-semibold">Status</th>
          <th className="p-2 text-left font-semibold">City</th>
          <th className="p-2 text-left font-semibold">Zone</th>
          <th className="p-2 text-left font-semibold">Utilization</th>
          <th className="p-2 text-left font-semibold">Operating Hrs</th>
          <th className="p-2 text-left font-semibold">Efficiency</th>
          <th className="p-2 text-left font-semibold">Maint Cost</th>
          <th className="p-2 text-left font-semibold">Service</th>
        </tr></thead><tbody className="divide-y">
          {filteredEquip.map(row => (
            <tr key={row.id} className="hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-colors">
              <td className="p-2 font-mono font-medium">{row.id}</td>
              <td className="p-2"><EquipBadge t={row.type}/></td>
              <td className="p-2"><EquipStatusBadge s={row.status}/></td>
              <td className="p-2"><CityBadge city={row.city}/></td>
              <td className="p-2"><ZoneBadge z={row.zone}/></td>
              <td className="p-2"><UtilBar pct={row.utilization}/></td>
              <td className="p-2 numeric-cell tabular-nums">{row.operatingHours.toLocaleString()}</td>
              <td className="p-2 numeric-cell tabular-nums">{row.efficiency}%</td>
              <td className="p-2"><span className="text-sm font-bold tabular-nums text-orange-600">{(row.maintCost * 1000).toLocaleString("en-IN")}</span></td>
              <td className="p-2 text-muted-foreground">{row.lastService}</td>
            </tr>
          ))}
        </tbody></table>
      </div>
      <div className="text-[10px] text-muted-foreground text-right">{filteredEquip.length} equipment</div>
    </div>
  )

  const tab3 = (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredLayouts.map(l => (
          <Card key={l.id} className="glass-subtle wcs-layout hover:border-blue-300 dark:hover:border-blue-700 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2"><span className="font-mono text-[10px] text-muted-foreground">{l.id}</span><LayoutStatusBadge s={l.status}/></div>
              <div className="text-xs font-bold mb-2">{l.name}</div>
              <div className="flex items-center gap-2 mb-2"><CityBadge city={l.city}/><ZoneBadge z={pick(ZONE_TYPES, l.zones)}/></div>
              <div className="grid grid-cols-2 gap-1.5 text-center">
                <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-1.5"><div className="text-xs font-black text-blue-600">{l.zones}</div><div className="text-[9px] text-muted-foreground">Zones</div></div>
                <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-1.5"><div className="text-xs font-black text-emerald-600">{l.utilization}%</div><div className="text-[9px] text-muted-foreground">Util</div></div>
                <div className="rounded-lg bg-violet-50 dark:bg-violet-900/20 p-1.5"><div className="text-xs font-black text-violet-600">{l.efficiency}%</div><div className="text-[9px] text-muted-foreground">Efficiency</div></div>
                <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 p-1.5"><div className="text-xs font-black text-amber-600">{l.throughput}</div><div className="text-[9px] text-muted-foreground">Ops/hr</div></div>
              </div>
              <div className="mt-2 text-[10px] text-muted-foreground">Area: {l.totalArea}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const tabs = [
    {key:"overview",label:"Dashboard",icon:<LayoutGrid className="h-3.5 w-3.5"/>,content:tab0},
    {key:"zones",label:"Zones",icon:<Layers className="h-3.5 w-3.5"/>,content:tab1},
    {key:"equipment",label:"Equipment",icon:<Settings className="h-3.5 w-3.5"/>,content:tab2},
    {key:"layouts",label:"Layouts",icon:<Grid3x3 className="h-3.5 w-3.5"/>,content:tab3},
  ]

  return (
    <div className="space-y-4 p-4">
      <PageHeader title="WMS Configuration Studio" description="Warehouse zone configuration, slot management, equipment tracking, and layout design optimization"/>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30"><Layers className="h-3 w-3 text-blue-600"/><span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300">50 Zones Configured</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30"><span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">48 Equipment Active</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30"><span className="text-[10px] font-semibold text-violet-700 dark:text-violet-300">18 Active Layouts</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30"><span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300">3 Need Maintenance</span></div>
      </div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-gradient-to-r from-blue-500/10 to-violet-500/10 p-0.5 h-9">
          {tabs.map(t => <TabsTrigger key={t.key} value={t.key} className="text-xs gap-1.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white">{t.icon}{t.label}</TabsTrigger>)}
        </TabsList>
        {tabs.map(t => tab === t.key && <div key={t.key} className="mt-3">{t.content}</div>)}
      </Tabs>
      <Sheet open={!!detail} onOpenChange={() => setDetail(null)}><SheetContent className="w-[420px] overflow-y-auto"><SheetHeader><SheetTitle className="text-sm">Zone Detail</SheetTitle></SheetHeader>{detail && <div className="mt-4 space-y-3"><div className="rounded-lg bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 p-4"><div className="text-lg font-bold">Zone Configuration</div></div>{Object.entries(detail).map(([k,v]) => <div key={k} className="flex items-center justify-between py-1.5 border-b border-border/50"><span className="text-xs font-medium text-muted-foreground">{k}</span><span className="text-xs font-semibold tabular-nums">{String(v)}</span></div>)}</div>}</SheetContent></Sheet>
    </div>
  )
}