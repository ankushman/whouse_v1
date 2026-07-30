"use client"

import { useState, useMemo, Fragment } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, AreaChart, Area,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts"
import {
  ShieldAlert, FlaskConical, ThermometerSun, Wind, Droplets, Zap, Flame, Skull,
  Search, Eye, X, ChevronRight, Filter, AlertTriangle, CheckCircle2, Clock,
  Package, Warehouse, Truck, MapPin, TrendingUp, TrendingDown, Target, Users,
  RefreshCw, Download, Plus, FileText, ClipboardCheck, ShieldCheck, Ban,
  CircleAlert, TriangleAlert, Radiation, Bug, Leaf, Snowflake
} from "lucide-react"

function seededRandom(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646 }
}
const rng = seededRandom(152152)
function pick<T>(arr: T[]): T { return arr[Math.floor(rng() * arr.length)] }
function randInt(min: number, max: number): number { return Math.floor(rng() * (max - min + 1)) + min }
function randFloat(min: number, max: number, dec = 1): number { return Number((rng() * (max - min) + min).toFixed(dec)) }

const UN_CLASSES = [
  { class: 1, name: "Explosives", icon: Flame, color: "#ef4444", example: "Fireworks, Detonators" },
  { class: 2, name: "Gases", icon: Wind, color: "#f59e0b", example: "LPG, Oxygen, Nitrogen" },
  { class: 3, name: "Flammable Liquids", icon: Droplets, color: "#f97316", example: "Petrol, Diesel, Solvents" },
  { class: 4, name: "Flammable Solids", icon: Flame, color: "#dc2626", example: "Matches, Sulphur" },
  { class: 5, name: "Oxidizers", icon: Zap, color: "#eab308", example: "Ammonium Nitrate, Bleach" },
  { class: 6, name: "Toxic & Infectious", icon: Skull, color: "#7c3aed", example: "Pesticides, Chemical Waste" },
  { class: 7, name: "Radioactive", icon: Radiation, color: "#06b6d4", example: "Medical Isotopes" },
  { class: 8, name: "Corrosives", icon: Droplets, color: "#ec4899", example: "Acids, Battery Fluid" },
  { class: 9, name: "Miscellaneous", icon: TriangleAlert, color: "#64748b", example: "Lithium Batteries, Dry Ice" },
]

const HAZMAT_CATEGORIES = ["Flammable", "Toxic", "Corrosive", "Oxidizer", "Radioactive", "Cryogenic", "Pressurized", "Environmental", "Explosive", "Biohazard"] as const
const STORAGE_ZONES = ["Zone H1 - Flameproof", "Zone H2 - Ventilated", "Zone H3 - Climate Controlled", "Zone H4 - Isolation", "Zone H5 - General Chemical", "Zone H6 - Quarantine"]
const STATUSES = ["Stored", "In Transit", "Pending Inspection", "Approved", "Rejected", "Disposed", "Under Review", "Expired"] as const
const WAREHOUSES = ["Mumbai Chemical WH", "Delhi NCR Hazmat Hub", "Chennai Port Storage", "Bangalore Pharma WH", "Hyderabad Industrial", "Kolkata Chemical Zone"]
const INSPECTORS = [
  { name: "Dr. Vikram Mehta", cert: "CDG-1024", avatar: "bg-red-500" },
  { name: "Ananya Krishnan", cert: "CDG-2045", avatar: "bg-amber-500" },
  { name: "Rajiv Gupta", cert: "CDG-3087", avatar: "bg-blue-500" },
  { name: "Priya Sharma", cert: "CDG-4012", avatar: "bg-emerald-500" },
  { name: "Suresh Patel", cert: "CDG-5089", avatar: "bg-violet-500" },
  { name: "Kavitha Raman", cert: "CDG-6034", avatar: "bg-cyan-500" },
]

interface HazMatItem {
  id: string; name: string; unNumber: string; unClass: number; category: string;
  hazardLevel: string; quantity: number; unit: string; storageZone: string;
  warehouse: string; status: string; expiryDate: string; arrivalDate: string;
  inspector: string; lastInspection: string; nextInspection: string;
  temperature: number; humidity: number; msds: string; sdsCompliant: boolean;
  ppeRequired: string[]; incidents: number; riskScore: number;
  supplier: string; storageCondition: string; emergencyContact: string;
}

const items: HazMatItem[] = []
for (let i = 0; i < 200; i++) {
  const unCls = pick(UN_CLASSES)
  const cat = pick([...HAZMAT_CATEGORIES])
  const status = pick([...STATUSES])
  const hazard = pick(["Low", "Medium", "High", "Critical"])
  const riskScore = hazard === "Critical" ? randInt(85, 100) : hazard === "High" ? randInt(60, 84) : hazard === "Medium" ? randInt(30, 59) : randInt(1, 29)
  const insp = pick(INSPECTORS)
  items.push({
    id: `HAZ-${String(1520001 + i).padStart(7, "0")}`,
    name: pick(["Acetone AR Grade", "Sulphuric Acid 98%", "Ammonium Nitrate", "LPG Cylinder 14.2kg", "Liquid Chlorine", "Sodium Hydroxide", "Hydrogen Peroxide 50%", "Formaldehyde 37%", "Benzene", "Toluene", "Methanol", "Ethanol 95%", "Diesel HSD", "Petrol MS", "Kerosene", "Calcium Hypochlorite", "Sodium Hypochlorite", "Nitric Acid 69%", "Hydrochloric Acid 32%", "Lithium-ion Batteries", "Lead Acid Batteries", "Dry Ice (CO2)", "Liquid Nitrogen", "Medical Oxygen", "Pesticide MCPA", "Fertilizer DAP", "Zinc Dust", "Aluminium Powder", "Carbon Disulphide", "Phosphorus Pentoxide"]),
    unNumber: `UN${String(randInt(1000, 3500))}`,
    unClass: unCls.class, category: cat, hazardLevel: hazard,
    quantity: randInt(1, 5000), unit: pick(["kg", "litres", "cylinders", "drums", "tanks", "pieces", "tonnes"]),
    storageZone: pick(STORAGE_ZONES), warehouse: pick(WAREHOUSES), status,
    expiryDate: `2026-${String(randInt(8, 12)).padStart(2, "0")}-${String(randInt(1, 28)).padStart(2, "0")}`,
    arrivalDate: `2026-07-${String(randInt(1, 28)).padStart(2, "0")}`,
    inspector: insp.name, lastInspection: `2026-07-${String(randInt(1, 28)).padStart(2, "0")}`,
    nextInspection: `2026-08-${String(randInt(1, 28)).padStart(2, "0")}`,
    temperature: unCls.class === 2 ? randFloat(-20, 40) : randFloat(18, 35),
    humidity: randInt(30, 80),
    msds: randInt(1, 100) > 15 ? "Uploaded" : "Missing",
    sdsCompliant: randInt(1, 100) > 20,
    ppeRequired: [pick(["Safety Goggles", "Chemical Suit", "Respirator", "Gloves (Nitrile)", "Face Shield", "Steel Boots", "Chemical Apron"])],
    incidents: hazard === "Critical" ? randInt(0, 5) : randInt(0, 2),
    riskScore,
    supplier: pick(["Tata Chemicals", "Reliance Industries", "Dr. Reddy's Labs", "UPL Ltd", "Nav Bharat Chemicals", "Solar Industries", "Aarti Industries", "Deepak Nitrite", "Atul Ltd", "Godrej Agrovet"]),
    storageCondition: pick(["Cool & Dry", "Well Ventilated", "Flameproof Area", "Temperature Controlled", "Segregated", "Under Water Sprinkler"]),
    emergencyContact: pick(["9876543210", "9812345678", "9908765432", "9876123456", "9801234567"]),
  })
}

const monthlyIncidents = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  spills: randInt(0, 8),
  exposures: randInt(0, 5),
  nearMiss: randInt(1, 10),
  total: 0,
})).map(d => ({ ...d, total: d.spills + d.exposures + d.nearMiss }))

const zoneOccupancy = STORAGE_ZONES.map(z => ({
  zone: z.split(" - ")[1],
  capacity: randInt(20, 80),
  occupied: randInt(5, 60),
})).map(d => ({ ...d, pct: Math.round(d.occupied / d.capacity * 100) }))

const classDistribution = UN_CLASSES.map(c => ({
  name: `Class ${c.class}`,
  count: items.filter(it => it.unClass === c.class).length,
}))

const complianceTrend = Array.from({ length: 6 }, (_, i) => ({
  month: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"][i],
  sdsRate: randInt(75, 98),
  inspectionRate: randInt(80, 100),
  trainingRate: randInt(70, 95),
}))

const PPE_COLORS: Record<string, string> = { Flammable: "#ef4444", Toxic: "#7c3aed", Corrosive: "#ec4899", Oxidizer: "#eab308", Radioactive: "#06b6d4", Cryogenic: "#3b82f6", Pressurized: "#f97316", Environmental: "#10b981", Explosive: "#dc2626", Biohazard: "#84cc16" }
const STATUS_COLORS: Record<string, string> = {
  Stored: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "In Transit": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Pending Inspection": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Approved: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  Rejected: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  Disposed: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  "Under Review": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  Expired: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
}
const HAZARD_COLORS: Record<string, string> = { Low: "#10b981", Medium: "#f59e0b", High: "#f97316", Critical: "#ef4444" }

export default function DangerousGoodsHazMatView() {
  const [activeTab, setActiveTab] = useState(0)
  const [statusFilter, setStatusFilter] = useState("All")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<HazMatItem | null>(null)
  const tabs = ["Dashboard", "Hazmat Inventory", "Storage Zones", "Compliance & Inspections", "Incident Tracker"]

  const filteredItems = useMemo(() => {
    let data = [...items]
    if (statusFilter !== "All") data = data.filter(it => it.status === statusFilter)
    if (categoryFilter !== "All") data = data.filter(it => it.category === categoryFilter)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      data = data.filter(it =>
        it.id.toLowerCase().includes(q) || it.name.toLowerCase().includes(q) ||
        it.unNumber.toLowerCase().includes(q) || it.supplier.toLowerCase().includes(q) ||
        it.warehouse.toLowerCase().includes(q)
      )
    }
    return data
  }, [statusFilter, categoryFilter, searchQuery])

  const totalItems = items.length
  const criticalItems = items.filter(it => it.hazardLevel === "Critical").length
  const pendingInsp = items.filter(it => it.status === "Pending Inspection").length
  const sdsRate = Math.round(items.filter(it => it.sdsCompliant).length / items.length * 100)
  const highRisk = items.filter(it => it.riskScore >= 60).length
  const totalIncidents = items.reduce((s, it) => s + it.incidents, 0)

  const statusCounts: Record<string, number> = {
    All: items.length,
    ...Object.fromEntries([...STATUSES].map(s => [s, items.filter(it => it.status === s).length])),
  }

  const openDrawer = (it: HazMatItem) => { setSelectedItem(it); setDrawerOpen(true) }

  function renderDashboard() {
    return (
      <Fragment>
        <div className="hazmat-kpi-grid">
          {[
            { label: "Total Hazmat Items", value: String(totalItems), icon: FlaskConical, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40", sub: `across ${WAREHOUSES.length} warehouses` },
            { label: "Critical Hazard", value: String(criticalItems), icon: Skull, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/40", sub: "Requires immediate attention" },
            { label: "Pending Inspection", value: String(pendingInsp), icon: ClipboardCheck, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/40", sub: "Awaiting CDG clearance" },
            { label: "SDS Compliance", value: `${sdsRate}%`, icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40", sub: sdsRate >= 85 ? "Above target" : "Below target" },
            { label: "High Risk Items", value: String(highRisk), icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950/40", sub: `Risk score >= 60` },
            { label: "Total Incidents", value: String(totalIncidents), icon: ShieldAlert, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-950/40", sub: "This quarter" },
          ].map(kpi => (
            <Card key={kpi.label} className="hazmat-kpi-card border-slate-100 dark:border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="hazmat-label">{kpi.label}</p>
                    <p className={`hazmat-value ${kpi.color}`}>{kpi.value}</p>
                    <p className="hazmat-sub">{kpi.sub}</p>
                  </div>
                  <div className={`${kpi.bg} hazmat-icon-wrap`}>
                    <kpi.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="hazmat-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="hazmat-title"><ShieldAlert className="h-4 w-4 text-red-500" />UN Class Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={classDistribution}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {UN_CLASSES.map((c, i) => <Cell key={i} fill={c.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hazmat-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="hazmat-title"><TrendingUp className="h-4 w-4 text-amber-500" />Hazard Category Mix</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={[...HAZMAT_CATEGORIES].map(c => ({ name: c, value: items.filter(it => it.category === c).length }))} cx="50%" cy="50%" innerRadius={45} outerRadius={85} paddingAngle={2} dataKey="value" label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ strokeWidth: 1 }}>
                    {[...HAZMAT_CATEGORIES].map((c, i) => <Cell key={i} fill={Object.values(PPE_COLORS)[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hazmat-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="hazmat-title"><Flame className="h-4 w-4 text-orange-500" />Incident Trend (Monthly)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <ComposedChart data={monthlyIncidents}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="spills" stackId="a" fill="#ef4444" name="Spills" />
                  <Bar dataKey="exposures" stackId="a" fill="#7c3aed" name="Exposures" />
                  <Bar dataKey="nearMiss" stackId="a" fill="#f59e0b" name="Near Miss" />
                  <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} dot={false} name="Total" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hazmat-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="hazmat-title"><ShieldCheck className="h-4 w-4 text-emerald-500" />Compliance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={complianceTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} domain={[60, 100]} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Line type="monotone" dataKey="sdsRate" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="SDS Rate %" />
                  <Line type="monotone" dataKey="inspectionRate" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Inspection Rate %" />
                  <Line type="monotone" dataKey="trainingRate" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Training Rate %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="hazmat-alerts-section">
          <h3 className="hazmat-section-heading"><AlertTriangle className="h-4 w-4 text-red-500" />Safety Alerts & Notifications</h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {[
              { type: "critical", msg: "Sulphuric Acid drums in Zone H1 approaching expiry — schedule disposal", time: "30 min ago" },
              { type: "critical", msg: "Temperature alert: Zone H3 exceeding 30°C — activate cooling", time: "1 hour ago" },
              { type: "warning", msg: "MSDS renewal pending for 12 chemicals — deadline Aug 15", time: "2 hours ago" },
              { type: "info", msg: "CDG inspection completed for Batch HZ-1520015 by Dr. Vikram Mehta", time: "3 hours ago" },
              { type: "warning", msg: "Lithium-ion batteries (UN3481) need Class 9 reclassification", time: "5 hours ago" },
              { type: "info", msg: "Fire drill completed at Mumbai Chemical WH — all zones passed", time: "1 day ago" },
            ].map((alert, i) => (
              <div key={i} className={`hazmat-alert-card hazmat-alert-${alert.type}`}>
                <div className="flex items-start gap-2">
                  <AlertTriangle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${alert.type === "critical" ? "text-red-500" : alert.type === "warning" ? "text-amber-500" : "text-blue-500"}`} />
                  <div>
                    <p className="text-sm font-medium">{alert.msg}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Fragment>
    )
  }

  function renderInventory() {
    return (
      <Fragment>
        <div className="hazmat-filter-bar">
          <div className="flex flex-wrap gap-2 flex-1">
            {Object.entries(statusCounts).map(([s, c]) => (
              <Badge key={s} variant={statusFilter === s ? "default" : "outline"} className="hazmat-filter-badge cursor-pointer" onClick={() => setStatusFilter(s)}>
                {s} <span className="ml-1 opacity-60">({c})</span>
              </Badge>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-400" />
            <input className="hazmat-search-input" placeholder="Search chemicals..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <select className="hazmat-select-input" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option value="All">All Categories</option>
            {[...HAZMAT_CATEGORIES].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <Card className="hazmat-table-card border-slate-100 dark:border-slate-800">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="hazmat-table">
                <thead>
                  <tr className="hazmat-table-head">
                    <th>ID</th>
                    <th>Chemical</th>
                    <th>UN Class</th>
                    <th>Category</th>
                    <th>Qty</th>
                    <th>Hazard</th>
                    <th>Risk</th>
                    <th>SDS</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.slice(0, 30).map(item => {
                    const unCls = UN_CLASSES.find(c => c.class === item.unClass)
                    return (
                      <tr key={item.id} className="hazmat-table-row">
                        <td className="font-mono text-xs">{item.id}</td>
                        <td>
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.unNumber}</div>
                        </td>
                        <td>
                          <Badge variant="outline" className="text-xs" style={{ borderColor: unCls?.color, color: unCls?.color }}>
                            {unCls?.name?.slice(0, 12)}
                          </Badge>
                        </td>
                        <td><Badge className="text-xs" style={{ backgroundColor: PPE_COLORS[item.category] + "18", color: PPE_COLORS[item.category], borderColor: PPE_COLORS[item.category] + "30" }}>{item.category}</Badge></td>
                        <td className="font-medium text-sm">{item.quantity} {item.unit}</td>
                        <td>
                          <Badge variant={item.hazardLevel === "Critical" ? "destructive" : "outline"} className="text-xs">
                            {item.hazardLevel === "Critical" && <Skull className="h-3 w-3 mr-1" />}
                            {item.hazardLevel}
                          </Badge>
                        </td>
                        <td>
                          <div className="hazmat-risk-bar-wrap">
                            <div className="hazmat-risk-bar">
                              <div className="hazmat-risk-fill" style={{ width: `${item.riskScore}%`, backgroundColor: HAZARD_COLORS[item.hazardLevel] }} />
                            </div>
                            <span className="text-xs font-medium">{item.riskScore}</span>
                          </div>
                        </td>
                        <td>
                          {item.sdsCompliant ? (
                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs"><CheckCircle2 className="h-3 w-3 mr-1" />SDS</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 text-xs"><X className="h-3 w-3 mr-1" />Missing</Badge>
                          )}
                        </td>
                        <td><Badge className={STATUS_COLORS[item.status]}>{item.status}</Badge></td>
                        <td>
                          <Button size="sm" variant="ghost" className="hazmat-action-btn" onClick={() => openDrawer(item)}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </Fragment>
    )
  }

  function renderStorageZones() {
    return (
      <Fragment>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {STORAGE_ZONES.map((zone, i) => {
            const zItems = items.filter(it => it.storageZone === zone)
            const critCount = zItems.filter(it => it.hazardLevel === "Critical").length
            const zonePct = Math.min(Math.round(zItems.length / randInt(30, 60) * 100), 100)
            const zoneColor = critCount > 5 ? "#ef4444" : critCount > 2 ? "#f59e0b" : "#10b981"
            return (
              <Card key={i} className="hazmat-zone-card border-slate-100 dark:border-slate-800" style={{ borderTopWidth: 3, borderTopColor: zoneColor }}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-sm">{zone}</p>
                      <p className="text-xs text-gray-500">{zItems.length} items stored</p>
                    </div>
                    {critCount > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        <Skull className="h-3 w-3 mr-1" />{critCount} Critical
                      </Badge>
                    )}
                  </div>
                  <div className="hazmat-zone-bar">
                    <div className="hazmat-zone-fill" style={{ width: `${zonePct}%`, backgroundColor: zoneColor }} />
                  </div>
                  <div className="flex justify-between text-xs mt-1 text-gray-500">
                    <span>Occupancy</span><span>{zonePct}%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="hazmat-metric-mini">
                      <p className="text-xs text-gray-500">Avg Temp</p>
                      <p className="text-sm font-semibold">{randFloat(18, 28)}°C</p>
                    </div>
                    <div className="hazmat-metric-mini">
                      <p className="text-xs text-gray-500">Humidity</p>
                      <p className="text-sm font-semibold">{randInt(35, 65)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mt-4">
          <Card className="hazmat-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="hazmat-title"><MapPin className="h-4 w-4 text-blue-500" />Zone Occupancy</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={zoneOccupancy}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="zone" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Bar dataKey="occupied" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Occupied" />
                  <Bar dataKey="capacity" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Capacity" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hazmat-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="hazmat-title"><ThermometerSun className="h-4 w-4 text-red-500" />Temperature by Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={STORAGE_ZONES.map(z => ({
                  zone: z.split(" - ")[1],
                  temp: randFloat(15, 32),
                  humidity: randInt(30, 75),
                }))}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="zone" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="temp" fill="#ef4444" radius={[4, 4, 0, 0]} name="Temp °C" />
                  <Bar dataKey="humidity" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Humidity %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </Fragment>
    )
  }

  function renderCompliance() {
    return (
      <Fragment>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {INSPECTORS.map((insp, i) => {
            const inspItems = items.filter(it => it.inspector === insp.name)
            const completed = inspItems.filter(it => it.status === "Approved").length
            const pending = inspItems.filter(it => it.status === "Pending Inspection").length
            return (
              <Card key={i} className="hazmat-inspector-card border-slate-100 dark:border-slate-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`hazmat-avatar ${insp.avatar}`}>
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{insp.name}</p>
                      <p className="text-xs text-gray-500">CDG Cert: {insp.cert}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="hazmat-metric-mini text-center">
                      <p className="text-xs text-gray-500">Assigned</p>
                      <p className="text-sm font-bold">{inspItems.length}</p>
                    </div>
                    <div className="hazmat-metric-mini text-center">
                      <p className="text-xs text-gray-500">Approved</p>
                      <p className="text-sm font-bold text-emerald-600">{completed}</p>
                    </div>
                    <div className="hazmat-metric-mini text-center">
                      <p className="text-xs text-gray-500">Pending</p>
                      <p className="text-sm font-bold text-amber-600">{pending}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mt-4">
          <Card className="hazmat-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="hazmat-title"><FileText className="h-4 w-4 text-violet-500" />SDS Compliance by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={[...HAZMAT_CATEGORIES].map(c => ({
                  cat: c.slice(0, 8),
                  compliant: items.filter(it => it.category === c && it.sdsCompliant).length,
                  missing: items.filter(it => it.category === c && !it.sdsCompliant).length,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="cat" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="compliant" stackId="a" fill="#10b981" name="Compliant" />
                  <Bar dataKey="missing" stackId="a" fill="#ef4444" name="Missing" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hazmat-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="hazmat-title"><Target className="h-4 w-4 text-blue-500" />Risk Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={["Critical", "High", "Medium", "Low"].map(h => ({ name: h, value: items.filter(it => it.hazardLevel === h).length }))} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ strokeWidth: 1 }}>
                    <Cell fill="#ef4444" /><Cell fill="#f97316" /><Cell fill="#f59e0b" /><Cell fill="#10b981" />
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </Fragment>
    )
  }

  function renderIncidents() {
    return (
      <Fragment>
        <div className="hazmat-kpi-grid mb-4">
          {[
            { label: "Spills This Month", value: String(monthlyIncidents[6].spills), icon: Droplets, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/40" },
            { label: "Exposures", value: String(monthlyIncidents[6].exposures), icon: Skull, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/40" },
            { label: "Near Misses", value: String(monthlyIncidents[6].nearMiss), icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40" },
            { label: "Days Since Last", value: `${randInt(5, 45)}`, icon: Clock, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
          ].map(kpi => (
            <Card key={kpi.label} className="hazmat-kpi-card border-slate-100 dark:border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="hazmat-label">{kpi.label}</p>
                    <p className={`hazmat-value ${kpi.color}`}>{kpi.value}</p>
                  </div>
                  <div className={`${kpi.bg} hazmat-icon-wrap`}>
                    <kpi.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="hazmat-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="hazmat-title"><TrendingDown className="h-4 w-4 text-red-500" />12-Month Incident Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={monthlyIncidents}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Area type="monotone" dataKey="spills" stackId="a" stroke="#ef4444" fill="#ef4444" fillOpacity={0.5} name="Spills" />
                  <Area type="monotone" dataKey="exposures" stackId="a" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.5} name="Exposures" />
                  <Area type="monotone" dataKey="nearMiss" stackId="a" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.5} name="Near Miss" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hazmat-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="hazmat-title"><Warehouse className="h-4 w-4 text-blue-500" />Incidents by Warehouse</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={WAREHOUSES.map(w => ({
                  wh: w.split(" ")[0],
                  incidents: items.filter(it => it.warehouse === w).reduce((s, it) => s + it.incidents, 0),
                }))} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="wh" tick={{ fontSize: 9 }} width={65} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Bar dataKey="incidents" fill="#ef4444" radius={[0, 4, 4, 0]} name="Incidents" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="hazmat-incident-log mt-4">
          <h3 className="hazmat-section-heading"><ClipboardCheck className="h-4 w-4 text-amber-500" />Recent Incident Log</h3>
          <div className="flex flex-col gap-3">
            {items.filter(it => it.incidents > 0).slice(0, 8).map((it, i) => (
              <div key={i} className="hazmat-incident-row">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="text-xs"><Skull className="h-3 w-3 mr-1" />{it.incidents} incident{it.incidents > 1 ? "s" : ""}</Badge>
                  <span className="font-medium text-sm">{it.name}</span>
                  <Badge variant="outline" className="text-xs">{it.unNumber}</Badge>
                </div>
                <div className="flex gap-4 text-xs text-gray-500 mt-1">
                  <span>{it.warehouse}</span>
                  <span>{it.storageZone}</span>
                  <span className={it.hazardLevel === "Critical" ? "text-red-600 font-semibold" : ""}>Risk: {it.riskScore}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Fragment>
    )
  }

  return (
    <div className="hazmat-root">
      <div className="hazmat-header">
        <div>
          <h2 className="hazmat-heading"><ShieldAlert className="h-5 w-5 text-red-500" />Dangerous Goods & HazMat Management</h2>
          <p className="hazmat-subheading">Hazardous materials tracking, compliance monitoring, and safety management</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="hazmat-header-btn"><RefreshCw className="h-3.5 w-3.5" />Refresh</Button>
          <Button size="sm" className="hazmat-header-btn-primary"><Plus className="h-3.5 w-3.5" />Register Item</Button>
        </div>
      </div>

      <div className="hazmat-tabs-bar">
        {tabs.map((tab, i) => (
          <button key={tab} className={`hazmat-tab ${activeTab === i ? "hazmat-tab-active" : ""}`} onClick={() => setActiveTab(i)}>
            {tab}
          </button>
        ))}
      </div>

      <div className="hazmat-content">
        {activeTab === 0 && renderDashboard()}
        {activeTab === 1 && renderInventory()}
        {activeTab === 2 && renderStorageZones()}
        {activeTab === 3 && renderCompliance()}
        {activeTab === 4 && renderIncidents()}
      </div>

      {drawerOpen && selectedItem && (
        <div className="hazmat-drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="hazmat-drawer" onClick={e => e.stopPropagation()}>
            <div className="hazmat-drawer-header" style={{
              background: selectedItem.hazardLevel === "Critical" ? "linear-gradient(135deg, #dc2626, #ef4444)" :
                selectedItem.hazardLevel === "High" ? "linear-gradient(135deg, #ea580c, #f97316)" :
                  selectedItem.hazardLevel === "Medium" ? "linear-gradient(135deg, #d97706, #f59e0b)" :
                    "linear-gradient(135deg, #059669, #10b981)"
            }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-bold text-lg">{selectedItem.id}</p>
                  <p className="text-white/80 text-sm">{selectedItem.name} — {selectedItem.unNumber}</p>
                </div>
                <button className="text-white/70 hover:text-white" onClick={() => setDrawerOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex gap-2 mt-3">
                <Badge className="bg-white/20 text-white border-white/30">Class {selectedItem.unClass}</Badge>
                <Badge className="bg-white/20 text-white border-white/30">{selectedItem.category}</Badge>
                <Badge className="bg-white/20 text-white border-white/30">{selectedItem.status}</Badge>
              </div>
            </div>

            <div className="hazmat-drawer-body">
              <div className="hazmat-hazard-badge-row">
                <div className="hazmat-hazard-level" style={{ backgroundColor: HAZARD_COLORS[selectedItem.hazardLevel] + "18", borderColor: HAZARD_COLORS[selectedItem.hazardLevel] }}>
                  <Skull className="h-4 w-4" style={{ color: HAZARD_COLORS[selectedItem.hazardLevel] }} />
                  <span className="font-semibold" style={{ color: HAZARD_COLORS[selectedItem.hazardLevel] }}>{selectedItem.hazardLevel}</span>
                </div>
                <div className="hazmat-risk-score">
                  <span className="text-xs text-gray-500">Risk Score</span>
                  <span className="text-xl font-bold" style={{ color: selectedItem.riskScore >= 60 ? "#ef4444" : selectedItem.riskScore >= 30 ? "#f59e0b" : "#10b981" }}>{selectedItem.riskScore}</span>
                </div>
                <div className="hazmat-sds-status">
                  {selectedItem.sdsCompliant ? (
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"><CheckCircle2 className="h-3 w-3 mr-1" />SDS Compliant</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"><X className="h-3 w-3 mr-1" />SDS Missing</Badge>
                  )}
                </div>
              </div>

              <div className="hazmat-detail-grid">
                {[
                  { label: "Quantity", value: `${selectedItem.quantity} ${selectedItem.unit}` },
                  { label: "Storage Zone", value: selectedItem.storageZone },
                  { label: "Warehouse", value: selectedItem.warehouse },
                  { label: "Supplier", value: selectedItem.supplier },
                  { label: "Storage Condition", value: selectedItem.storageCondition },
                  { label: "Arrival Date", value: selectedItem.arrivalDate },
                  { label: "Expiry Date", value: selectedItem.expiryDate },
                  { label: "Temperature", value: `${selectedItem.temperature}°C` },
                  { label: "Humidity", value: `${selectedItem.humidity}%` },
                  { label: "MSDS", value: selectedItem.msds },
                  { label: "Incidents", value: String(selectedItem.incidents) },
                  { label: "Emergency", value: selectedItem.emergencyContact },
                ].map(item => (
                  <div key={item.label} className="hazmat-detail-item">
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="font-semibold text-sm">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="hazmat-drawer-section">
                <h4 className="hazmat-drawer-section-title">PPE Requirements</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.ppeRequired.map((ppe, i) => (
                    <Badge key={i} variant="outline" className="text-xs"><ShieldCheck className="h-3 w-3 mr-1" />{ppe}</Badge>
                  ))}
                </div>
              </div>

              <div className="hazmat-drawer-section">
                <h4 className="hazmat-drawer-section-title">Inspection Schedule</h4>
                <div className="flex gap-4">
                  <div className="flex-1 hazmat-inspection-card">
                    <p className="text-xs text-gray-500">Inspector</p>
                    <p className="font-medium text-sm">{selectedItem.inspector}</p>
                  </div>
                  <div className="flex-1 hazmat-inspection-card">
                    <p className="text-xs text-gray-500">Last Inspection</p>
                    <p className="font-medium text-sm">{selectedItem.lastInspection}</p>
                  </div>
                  <div className="flex-1 hazmat-inspection-card">
                    <p className="text-xs text-gray-500">Next Due</p>
                    <p className="font-medium text-sm">{selectedItem.nextInspection}</p>
                  </div>
                </div>
              </div>

              <div className="hazmat-drawer-actions">
                <Button className="hazmat-action-primary flex-1"><ClipboardCheck className="h-4 w-4" />Inspect</Button>
                <Button variant="outline" className="hazmat-action-secondary"><FileText className="h-4 w-4" />View SDS</Button>
                <Button variant="outline" className="hazmat-action-secondary text-red-500"><Ban className="h-4 w-4" />Restrict</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
