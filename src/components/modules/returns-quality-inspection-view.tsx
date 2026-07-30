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
  ClipboardCheck, Search, Eye, X, Filter, AlertTriangle, CheckCircle2, Clock,
  Package, TrendingUp, TrendingDown, Target, RefreshCw, Download, Plus,
  RotateCcw, Star, ThumbsUp, ThumbsDown, Trash2, Recycle, DollarSign,
  Camera, Tag, QrCode, ArrowLeftRight, ShieldCheck, Wrench, Flame,
  Snowflake, Droplets, Zap, Leaf, ChevronRight, Warehouse, Truck, MapPin, PackageX, FileText, BarChart3
} from "lucide-react"

function seededRandom(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646 }
}
const rng = seededRandom(155155)
function pick<T>(arr: T[]): T { return arr[Math.floor(rng() * arr.length)] }
function randInt(min: number, max: number): number { return Math.floor(rng() * (max - min + 1)) + min }
function randFloat(min: number, max: number, dec = 1): number { return Number((rng() * (max - min) + min).toFixed(dec)) }

const RETURN_REASONS = ["Defective", "Wrong Item", "Damaged in Transit", "Customer Changed Mind", "Warranty Claim", "Expired", "Size Mismatch", "Quality Issue", "Missing Parts", "Not as Described"]
const DISPOSITIONS = ["Resale (Grade A)", "Resale (Grade B)", "Refurbish", "Liquidate", "Scrap/Dispose", "Return to Vendor", "Donation", "Parts Harvest", "Hold for Review"] as const
const CATEGORIES = ["Electronics", "Apparel", "FMCG", "Home & Kitchen", "Footwear", "Beauty & Personal Care", "Toys & Games", "Sports Equipment", "Books & Media", "Auto Accessories"]
const INSPECTION_STATUSES = ["Pending Inspection", "In Progress", "Completed", "Failed", "Escalated", "Auto-Approved"] as const
const WAREHOUSES = ["Mumbai Central WH", "Delhi NCR Hub", "Chennai Port WH", "Bangalore Tech WH", "Kolkata East WH", "Hyderabad South WH"]
const INSPECTORS = [
  { name: "Arun Kumar", empId: "EMP-1001", avatar: "bg-blue-500" },
  { name: "Priya Nair", empId: "EMP-1045", avatar: "bg-pink-500" },
  { name: "Rahul Singh", empId: "EMP-1089", avatar: "bg-green-500" },
  { name: "Kavitha Devi", empId: "EMP-1123", avatar: "bg-violet-500" },
  { name: "Sanjay Mishra", empId: "EMP-1156", avatar: "bg-amber-500" },
  { name: "Deepa Menon", empId: "EMP-1190", avatar: "bg-cyan-500" },
]
const PLATFORMS = ["Amazon", "Flipkart", "Myntra", "Meesho", "Ajio", "Nykaa", "Croma", "Tata CLiQ", "Direct Website", "Retail Store"]
const CUSTOMERS = ["Rajesh Sharma", "Anita Patel", "Vikram Joshi", "Sneha Gupta", "Amit Mehta", "Pooja Iyer", "Suresh Reddy", "Nisha Kulkarni", "Karthik Nair", "Divya Rao"]

interface ReturnItem {
  id: string; rmaNo: string; orderId: string; customer: string; platform: string;
  date: string; sku: string; productName: string; category: string; returnReason: string;
  inspectionStatus: string; disposition: string; grade: string; inspector: string;
  defectType: string; severity: string; estimatedLoss: number; resaleValue: number;
  refurbCost: number; warehouse: string; photos: number; notes: string;
  timeline: { step: string; date: string; status: string }[];
}

const items: ReturnItem[] = []
for (let i = 0; i < 250; i++) {
  const insp = pick(INSPECTORS)
  const status = pick([...INSPECTION_STATUSES])
  const disp = status === "Completed" ? pick([...DISPOSITIONS]) : status === "Auto-Approved" ? pick(["Resale (Grade A)", "Resale (Grade B)"]) : "Pending"
  const grade = disp.startsWith("Resale (Grade A)") ? "A" : disp.startsWith("Resale (Grade B)") ? "B" : disp === "Refurbish" ? "C" : disp === "Scrap/Dispose" ? "F" : disp === "Liquidate" ? "D" : "-"
  const reason = pick(RETURN_REASONS)
  const defect = reason === "Defective" ? pick(["Manufacturing Defect", "Component Failure", "Software Bug", "Cosmetic Damage"]) :
    reason === "Damaged in Transit" ? pick(["Crushed Box", "Water Damage", "Puncture", "Torn Packaging"]) :
    reason === "Wrong Item" ? pick(["SKU Mismatch", "Wrong Color", "Wrong Size", "Wrong Model"]) :
    reason === "Quality Issue" ? pick(["Poor Finish", "Missing Stitch", "Faded Print", "Rust"]) :
    pick(["N/A", "N/A", "Customer Preference"])
  const sev = defect === "N/A" ? "-" : defect.includes("Crush") || defect.includes("Water") || defect.includes("Puncture") ? "High" : defect.includes("Manufacturing") || defect.includes("Component") ? "Medium" : "Low"
  const origPrice = randInt(200, 25000)
  const lossPct = grade === "A" ? randInt(5, 15) : grade === "B" ? randInt(20, 40) : grade === "C" ? randInt(30, 55) : grade === "D" ? randInt(50, 70) : grade === "F" ? randInt(80, 100) : randInt(10, 50)
  const items2 = [
    { step: "Return Initiated", date: `2026-07-${String(randInt(1, 25)).padStart(2, "0")}`, status: "done" },
    { step: "Received at WH", date: `2026-07-${String(randInt(3, 27)).padStart(2, "0")}`, status: "done" },
    { step: "Inspection", date: status === "Pending Inspection" ? "—" : `2026-07-${String(randInt(5, 28)).padStart(2, "0")}`, status: status === "Pending Inspection" ? "pending" : status === "In Progress" ? "active" : "done" },
    { step: "Disposition", date: status === "Completed" || status === "Auto-Approved" ? `2026-07-${String(randInt(10, 28)).padStart(2, "0")}` : "—", status: status === "Completed" || status === "Auto-Approved" ? "done" : "pending" },
  ]
  items.push({
    id: `RET-INSP-${String(1550001 + i).padStart(7, "0")}`,
    rmaNo: `RMA-${String(randInt(200000, 999999))}`,
    orderId: `ORD-${String(randInt(10000000, 99999999))}`,
    customer: pick(CUSTOMERS), platform: pick(PLATFORMS),
    date: `2026-07-${String(randInt(1, 28)).padStart(2, "0")}`,
    sku: `SKU-${String(randInt(10000, 99999))}`,
    productName: pick(["Samsung Galaxy Buds", "Nike Air Max 90", "Bata Formal Shoes", "Prestige Cookware Set", "Dyson Vacuum V15", "Levi's 511 Jeans", "HP Laptop 15s", "Patanjali Shampoo", "Boat Rockerz 450", "Whirlpool Refrigerator"]),
    category: pick(CATEGORIES), returnReason: reason,
    inspectionStatus: status, disposition: disp, grade,
    inspector: insp.name, defectType: defect, severity: sev,
    estimatedLoss: Math.round(origPrice * lossPct / 100),
    resaleValue: grade === "A" ? Math.round(origPrice * 0.85) : grade === "B" ? Math.round(origPrice * 0.6) : grade === "C" ? Math.round(origPrice * 0.4) : grade === "D" ? Math.round(origPrice * 0.2) : 0,
    refurbCost: disp === "Refurbish" ? randInt(100, 3000) : 0,
    warehouse: pick(WAREHOUSES), photos: randInt(2, 12),
    notes: pick(["Customer reported issue within warranty period.", "Package was damp on receipt.", "Customer received wrong color variant.", "Product works but cosmetic damage visible.", "No defect found — auto-approved for resale.", "Vendor fault — initiating return to vendor.", "Minor scratch on surface, grade B appropriate.", "Critical failure — sent to scrap.", "Customer changed mind, product unused.", "Component replacement needed before resale."]),
    timeline: items2,
  })
}

const monthlyReturns = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  total: randInt(150, 400), inspected: randInt(100, 350),
  approved: randInt(60, 250), rejected: randInt(20, 80),
}))

const reasonDist = RETURN_REASONS.map(r => ({
  name: r.length > 12 ? r.slice(0, 12) + "…" : r, value: items.filter(it => it.returnReason === r).length,
}))

const gradeDist = [
  { name: "Grade A", value: items.filter(it => it.grade === "A").length, color: "#10b981" },
  { name: "Grade B", value: items.filter(it => it.grade === "B").length, color: "#3b82f6" },
  { name: "Grade C", value: items.filter(it => it.grade === "C").length, color: "#f59e0b" },
  { name: "Grade D", value: items.filter(it => it.grade === "D").length, color: "#f97316" },
  { name: "Grade F", value: items.filter(it => it.grade === "F").length, color: "#ef4444" },
]

const platformDist = PLATFORMS.map(p => ({
  name: p.length > 8 ? p.slice(0, 8) : p, returns: items.filter(it => it.platform === p).length,
  lossRate: Math.round(items.filter(it => it.platform === p).reduce((s, it) => s + it.estimatedLoss, 0) / Math.max(1, items.filter(it => it.platform === p).length)),
}))

const dispositionDist = [...DISPOSITIONS].map(d => ({
  name: d.length > 16 ? d.slice(0, 16) + "…" : d, count: items.filter(it => it.disposition === d).length,
}))

const categoryRadar = CATEGORIES.slice(0, 8).map(c => ({
  subject: c.length > 10 ? c.slice(0, 10) : c,
  returnRate: randInt(5, 30),
  avgLoss: randInt(20, 60),
}))

const totalLoss = items.reduce((s, it) => s + it.estimatedLoss, 0)
const totalResale = items.reduce((s, it) => s + it.resaleValue, 0)
const recoveryRate = Math.round(totalResale / (totalResale + totalLoss) * 100)
const avgInspectionTime = randFloat(1.5, 4.2, 1)

const STATUS_COLORS: Record<string, string> = {
  "Pending Inspection": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "In Progress": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  Failed: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  Escalated: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "Auto-Approved": "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
}

const GRADE_COLORS: Record<string, string> = {
  A: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  B: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  C: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  D: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  F: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  "-": "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
}

const SEVERITY_COLORS: Record<string, string> = {
  High: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Low: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "-": "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
}

export default function ReturnsQualityView() {
  const [activeTab, setActiveTab] = useState(0)
  const [statusFilter, setStatusFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ReturnItem | null>(null)
  const tabs = ["Dashboard", "Inspection Queue", "Grade & Disposition", "Platform Analysis", "Loss Recovery"]

  const filteredItems = useMemo(() => {
    let data = [...items]
    if (statusFilter !== "All") data = data.filter(it => it.inspectionStatus === statusFilter)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      data = data.filter(it =>
        it.id.toLowerCase().includes(q) || it.rmaNo.toLowerCase().includes(q) ||
        it.orderId.toLowerCase().includes(q) || it.sku.toLowerCase().includes(q) ||
        it.customer.toLowerCase().includes(q) || it.platform.toLowerCase().includes(q) ||
        it.productName.toLowerCase().includes(q) || it.warehouse.toLowerCase().includes(q)
      )
    }
    return data
  }, [statusFilter, searchQuery])

  const statusCounts: Record<string, number> = {
    All: items.length,
    "Pending Inspection": items.filter(it => it.inspectionStatus === "Pending Inspection").length,
    "In Progress": items.filter(it => it.inspectionStatus === "In Progress").length,
    Completed: items.filter(it => it.inspectionStatus === "Completed").length,
    Failed: items.filter(it => it.inspectionStatus === "Failed").length,
    Escalated: items.filter(it => it.inspectionStatus === "Escalated").length,
  }

  function handleTabChange(idx: number) { setActiveTab(idx); setStatusFilter("All"); setSearchQuery("") }

  function renderDashboard() {
    return (
      <Fragment>
        <div className="rq-kpi-grid">
          {[
            { label: "Total Returns", value: String(items.length), icon: RotateCcw, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/40", sub: `${WAREHOUSES.length} warehouses` },
            { label: "Total Loss (₹)", value: `${(totalLoss / 100000).toFixed(1)}L`, icon: TrendingDown, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/40", sub: "estimated write-off" },
            { label: "Recovery Rate", value: `${recoveryRate}%`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40", sub: "resale value recovered" },
            { label: "Avg Inspect Time", value: `${avgInspectionTime} min`, icon: Clock, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40", sub: "per item" },
            { label: "Pending Queue", value: String(items.filter(it => it.inspectionStatus === "Pending Inspection").length), icon: ClipboardCheck, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/40", sub: "awaiting inspector" },
            { label: "Auto-Approved", value: String(items.filter(it => it.inspectionStatus === "Auto-Approved").length), icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950/40", sub: "no defect found" },
          ].map(kpi => (
            <Card key={kpi.label} className="rq-kpi-card border-slate-100 dark:border-slate-800">
              <CardContent className="glass-subtle p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="rq-label">{kpi.label}</p>
                    <p className={`rq-value ${kpi.color}`}>{kpi.value}</p>
                    <p className="rq-sub">{kpi.sub}</p>
                  </div>
                  <div className={`${kpi.bg} rq-icon-wrap`}>
                    <kpi.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="rq-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="rq-title"><RotateCcw className="h-4 w-4 text-blue-500" />Monthly Return Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <ComposedChart data={monthlyReturns}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="total" fill="#3b82f6" name="Total Returns" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="approved" fill="#10b981" name="Approved" radius={[2, 2, 0, 0]} />
                  <Line type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={2} dot={false} name="Rejected" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rq-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="rq-title"><Star className="h-4 w-4 text-amber-500" />Grade Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={gradeDist} cx="50%" cy="50%" innerRadius={45} outerRadius={85} paddingAngle={2} dataKey="value" label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ strokeWidth: 1 }}>
                    {gradeDist.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rq-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="rq-title"><BarChart3 className="h-4 w-4 text-indigo-500" />Return Reasons</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={reasonDist} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={90} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="#6366f1" name="Count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rq-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="rq-title"><Target className="h-4 w-4 text-emerald-500" />Category Risk Radar</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={categoryRadar}>
                  <PolarGrid className="stroke-gray-200 dark:stroke-gray-700" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9 }} />
                  <PolarRadiusAxis tick={{ fontSize: 8 }} domain={[0, 100]} />
                  <Radar name="Return Rate %" dataKey="returnRate" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  <Radar name="Avg Loss %" dataKey="avgLoss" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="rq-alerts-section">
          <h3 className="rq-section-heading"><AlertTriangle className="h-4 w-4 text-amber-500" />Quality Alerts & Actions</h3>
          <div className="rq-alerts-grid">
            {[
              { icon: Clock, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40", title: `${items.filter(it => it.inspectionStatus === "Pending Inspection").length} Pending Inspections`, desc: "Queue exceeding SLA — assign inspectors", time: "Avg wait 2.3 days" },
              { icon: AlertTriangle, color: "text-red-600 bg-red-50 dark:bg-red-950/40", title: `${items.filter(it => it.severity === "High").length} High Severity Defects`, desc: "Critical defects requiring vendor notification", time: "Escalation needed" },
              { icon: Recycle, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40", title: `${items.filter(it => it.disposition === "Refurbish").length} Items for Refurb`, desc: "Refurbishment pipeline capacity at 85%", time: "3-day backlog" },
              { icon: DollarSign, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40", title: "Loss Recovery Opportunity", desc: `${(totalResale / 100000).toFixed(1)}L recoverable through Grade A/B resale`, time: `${recoveryRate}% recovery rate` },
              { icon: Trash2, color: "text-orange-600 bg-orange-50 dark:bg-orange-950/40", title: `${items.filter(it => it.disposition === "Scrap/Dispose").length} Scrap Items This Month`, desc: "Environmental disposal compliance required", time: "E-waste certificate" },
              { icon: Tag, color: "text-violet-600 bg-violet-50 dark:bg-violet-950/40", title: "Vendor Return Pending", desc: `${items.filter(it => it.disposition === "Return to Vendor").length} items approved for vendor return`, time: "Credit note pending" },
            ].map(alert => (
              <div key={alert.title} className="rq-alert-card">
                <div className="flex items-start gap-3">
                  <div className={`${alert.color} rq-alert-icon`}>
                    <alert.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="rq-alert-title">{alert.title}</p>
                    <p className="rq-alert-desc">{alert.desc}</p>
                    <p className="rq-alert-time">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Fragment>
    )
  }

  function renderInspectionQueue() {
    return (
      <Fragment>
        <div className="flex flex-wrap gap-2 items-center mb-4">
          <div className="rq-filter-bar">
            {Object.entries(statusCounts).map(([s, c]) => (
              <Badge key={s} variant={statusFilter === s ? "default" : "outline"} className={`rq-filter-badge ${statusFilter === s ? "rq-filter-active" : ""}`} onClick={() => setStatusFilter(s)}>
                {s} ({c})
              </Badge>
            ))}
          </div>
          <div className="rq-search-wrap">
            <Search className="h-3.5 w-3.5 text-gray-400" />
            <input className="rq-search-input" placeholder="Search RMA, order, SKU, customer..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>
        <Card className="rq-table-card border-slate-100 dark:border-slate-800">
          <CardContent className="glass-subtle p-0">
            <div className="overflow-x-auto">
              <table className="rq-table">
                <thead>
                  <tr>
                    <th>RMA / Order</th><th>Product</th><th>Customer</th><th>Platform</th>
                    <th>Reason</th><th>Defect</th><th>Severity</th><th>Inspector</th>
                    <th>Status</th><th>Grade</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.slice(0, 30).map(it => (
                    <tr key={it.id} className="rq-table-row">
                      <td>
                        <span className="rq-id">{it.rmaNo}</span>
                        <p className="text-[10px] text-slate-500">{it.orderId}</p>
                      </td>
                      <td>
                        <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate max-w-[140px]">{it.productName}</p>
                        <p className="text-[10px] text-slate-500">{it.sku}</p>
                      </td>
                      <td className="text-xs text-slate-600 dark:text-slate-400">{it.customer}</td>
                      <td><Badge className="badge-interactive rq-platform-badge">{it.platform}</Badge></td>
                      <td className="text-xs text-slate-600 dark:text-slate-400">{it.returnReason}</td>
                      <td className="text-xs text-slate-500 max-w-[100px] truncate">{it.defectType}</td>
                      <td><span className={`rq-severity-badge ${SEVERITY_COLORS[it.severity] || ""}`}>{it.severity}</span></td>
                      <td className="text-xs text-slate-600 dark:text-slate-400">{it.inspector}</td>
                      <td><span className={`rq-status-badge ${STATUS_COLORS[it.inspectionStatus] || ""}`}>{it.inspectionStatus}</span></td>
                      <td><Badge className={`rq-grade-badge ${GRADE_COLORS[it.grade] || ""}`}>{it.grade === "-" ? "—" : `Grade ${it.grade}`}</Badge></td>
                      <td><Button size="sm" variant="ghost" className="rq-action-btn" onClick={() => { setSelectedItem(it); setDrawerOpen(true) }}><Eye className="h-3.5 w-3.5" /></Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <p className="rq-footer-count">Showing {Math.min(30, filteredItems.length)} of {filteredItems.length} returns</p>
      </Fragment>
    )
  }

  function renderGradeDisposition() {
    return (
      <Fragment>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-4">
          <Card className="rq-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="rq-title"><Recycle className="h-4 w-4 text-emerald-500" />Disposition Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={dispositionDist} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={110} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} fill="#6366f1" name="Items" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rq-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="rq-title"><DollarSign className="h-4 w-4 text-indigo-500" />Loss by Grade (₹)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={[
                  { grade: "A", loss: items.filter(it => it.grade === "A").reduce((s, it) => s + it.estimatedLoss, 0), resale: items.filter(it => it.grade === "A").reduce((s, it) => s + it.resaleValue, 0) },
                  { grade: "B", loss: items.filter(it => it.grade === "B").reduce((s, it) => s + it.estimatedLoss, 0), resale: items.filter(it => it.grade === "B").reduce((s, it) => s + it.resaleValue, 0) },
                  { grade: "C", loss: items.filter(it => it.grade === "C").reduce((s, it) => s + it.estimatedLoss, 0), resale: items.filter(it => it.grade === "C").reduce((s, it) => s + it.resaleValue, 0) },
                  { grade: "D", loss: items.filter(it => it.grade === "D").reduce((s, it) => s + it.estimatedLoss, 0), resale: items.filter(it => it.grade === "D").reduce((s, it) => s + it.resaleValue, 0) },
                  { grade: "F", loss: items.filter(it => it.grade === "F").reduce((s, it) => s + it.estimatedLoss, 0), resale: 0 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="grade" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="loss" fill="#ef4444" name="Est. Loss" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resale" fill="#10b981" name="Resale Value" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="rq-table-card border-slate-100 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="rq-title"><ClipboardCheck className="h-4 w-4 text-amber-500" />Grade Summary Table</CardTitle>
          </CardHeader>
          <CardContent className="glass-subtle p-0">
            <div className="overflow-x-auto">
              <table className="rq-table">
                <thead>
                  <tr><th>Grade</th><th>Count</th><th>Disposition</th><th>Avg Loss</th><th>Total Resale</th><th>Refurb Cost</th><th>Recovery %</th></tr>
                </thead>
                <tbody>
                  {["A", "B", "C", "D", "F"].map(g => {
                    const gItems = items.filter(it => it.grade === g)
                    const gLoss = gItems.reduce((s, it) => s + it.estimatedLoss, 0)
                    const gResale = gItems.reduce((s, it) => s + it.resaleValue, 0)
                    const gRefurb = gItems.reduce((s, it) => s + it.refurbCost, 0)
                    const gRecov = gLoss + gRefurb > 0 ? Math.round(gResale / (gLoss + gRefurb) * 100) : 0
                    const disp = g === "A" ? "Resale (Grade A)" : g === "B" ? "Resale (Grade B)" : g === "C" ? "Refurbish" : g === "D" ? "Liquidate" : "Scrap/Dispose"
                    return (
                      <tr key={g} className="rq-table-row">
                        <td><Badge className={`rq-grade-badge ${GRADE_COLORS[g] || ""}`}>Grade {g}</Badge></td>
                        <td className="text-xs font-semibold text-slate-900 dark:text-slate-100">{gItems.length}</td>
                        <td className="text-xs text-slate-600 dark:text-slate-400">{disp}</td>
                        <td className="text-xs text-red-600 font-semibold">₹{(gLoss / 1000).toFixed(1)}K</td>
                        <td className="text-xs text-emerald-600 font-semibold">₹{(gResale / 1000).toFixed(1)}K</td>
                        <td className="text-xs text-amber-600">₹{(gRefurb / 1000).toFixed(1)}K</td>
                        <td>
                          <div className="flex items-center gap-1.5">
                            <div className="rq-occ-bar"><div className="rq-occ-fill" style={{ width: `${gRecov}%`, background: gRecov >= 60 ? "#10b981" : gRecov >= 30 ? "#f59e0b" : "#ef4444" }} /></div>
                            <span className="rq-occ-label">{gRecov}%</span>
                          </div>
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

  function renderPlatformAnalysis() {
    return (
      <Fragment>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-4">
          <Card className="rq-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="rq-title"><TrendingDown className="h-4 w-4 text-red-500" />Returns by Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={platformDist}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="returns" fill="#6366f1" name="Returns" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="lossRate" fill="#ef4444" name="Avg Loss ₹" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rq-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="rq-title"><TrendingUp className="h-4 w-4 text-emerald-500" />Recovery Trend by Month</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={Array.from({ length: 6 }, (_, i) => ({
                  month: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"][i],
                  recovered: randInt(200000, 1200000),
                  lost: randInt(100000, 600000),
                }))}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${(v / 100000).toFixed(0)}L`} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Area type="monotone" dataKey="recovered" fill="#10b981" stroke="#10b981" name="Recovered" />
                  <Area type="monotone" dataKey="lost" fill="#ef4444" stroke="#ef4444" name="Lost" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="rq-table-card border-slate-100 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="rq-title"><ArrowLeftRight className="h-4 w-4 text-indigo-500" />Inspector Performance</CardTitle>
          </CardHeader>
          <CardContent className="glass-subtle p-0">
            <div className="overflow-x-auto">
              <table className="rq-table">
                <thead>
                  <tr><th>Inspector</th><th>Emp ID</th><th>Total Inspected</th><th>Approved</th><th>Rejected</th><th>Avg Time</th><th>Accuracy</th></tr>
                </thead>
                <tbody>
                  {INSPECTORS.map(insp => {
                    const inspItems = items.filter(it => it.inspector === insp.name)
                    const approved = inspItems.filter(it => it.inspectionStatus === "Completed" || it.inspectionStatus === "Auto-Approved").length
                    const rejected = inspItems.filter(it => it.inspectionStatus === "Failed").length
                    return (
                      <tr key={insp.empId} className="rq-table-row">
                        <td>
                          <div className="flex items-center gap-2">
                            <div className={`rq-avatar ${insp.avatar}`}>{insp.name.split(" ").map(n => n[0]).join("")}</div>
                            <span className="text-xs font-medium text-slate-900 dark:text-slate-100">{insp.name}</span>
                          </div>
                        </td>
                        <td className="text-xs text-slate-500 font-mono">{insp.empId}</td>
                        <td className="text-xs font-semibold text-slate-900 dark:text-slate-100">{inspItems.length}</td>
                        <td className="text-xs text-emerald-600">{approved}</td>
                        <td className="text-xs text-red-600">{rejected}</td>
                        <td className="text-xs text-slate-600 dark:text-slate-400">{randFloat(1.5, 4.5)} min</td>
                        <td>
                          <div className="flex items-center gap-1.5">
                            <div className="rq-occ-bar"><div className="rq-occ-fill" style={{ width: `${randInt(85, 98)}%`, background: "#10b981" }} /></div>
                            <span className="rq-occ-label">{randInt(85, 98)}%</span>
                          </div>
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

  function renderLossRecovery() {
    return (
      <Fragment>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 mb-4">
          {[
            { label: "Total Estimated Loss", value: `₹${(totalLoss / 100000).toFixed(2)}L`, icon: TrendingDown, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/40" },
            { label: "Total Resale Recovery", value: `₹${(totalResale / 100000).toFixed(2)}L`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
            { label: "Net Recovery", value: `₹${((totalResale - totalLoss) / 100000).toFixed(2)}L`, icon: DollarSign, color: totalResale >= totalLoss ? "text-green-600" : "text-orange-600", bg: totalResale >= totalLoss ? "bg-green-50 dark:bg-green-950/40" : "bg-orange-50 dark:bg-orange-950/40" },
          ].map(kpi => (
            <Card key={kpi.label} className="rq-kpi-card border-slate-100 dark:border-slate-800">
              <CardContent className="glass-subtle p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="rq-label">{kpi.label}</p>
                    <p className={`rq-value ${kpi.color}`}>{kpi.value}</p>
                  </div>
                  <div className={`${kpi.bg} rq-icon-wrap`}><kpi.icon className="h-5 w-5" /></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="rq-chart-card border-slate-100 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="rq-title"><ClipboardCheck className="h-4 w-4 text-blue-500" />Category-wise Loss & Recovery</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={CATEGORIES.map(c => {
                const cItems = items.filter(it => it.category === c)
                return { category: c.length > 12 ? c.slice(0, 12) : c, loss: cItems.reduce((s, it) => s + it.estimatedLoss, 0), resale: cItems.reduce((s, it) => s + it.resaleValue, 0) }
              })}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="category" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="loss" fill="#ef4444" name="Loss ₹" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resale" fill="#10b981" name="Resale ₹" radius={[4, 4, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Fragment>
    )
  }

  function renderDrawer() {
    if (!selectedItem) return null
    const it = selectedItem
    return (
      <div className="rq-drawer-overlay" onClick={() => setDrawerOpen(false)}>
        <div className="rq-drawer" onClick={e => e.stopPropagation()}>
          <div className={`rq-drawer-header ${it.grade === "A" ? "rq-drawer-header-a" : it.grade === "F" ? "rq-drawer-header-f" : "rq-drawer-header-b"}`}>
            <div className="flex items-center gap-3">
              <div className="rq-drawer-icon"><ClipboardCheck className="h-5 w-5" /></div>
              <div>
                <h3 className="rq-drawer-title">{it.rmaNo}</h3>
                <p className="rq-drawer-subtitle">{it.orderId} | {it.date}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="rq-drawer-close" onClick={() => setDrawerOpen(false)}><X className="h-4 w-4" /></Button>
          </div>
          <div className="rq-drawer-body">
            <div className="rq-drawer-status-row">
              <span className={`rq-status-badge ${STATUS_COLORS[it.inspectionStatus] || ""}`}>{it.inspectionStatus}</span>
              <Badge className={`rq-grade-badge ${GRADE_COLORS[it.grade] || ""}`}>{it.grade === "-" ? "Ungraded" : `Grade ${it.grade}`}</Badge>
              <span className={`rq-severity-badge ${SEVERITY_COLORS[it.severity] || ""}`}>{it.severity}</span>
            </div>
            <div className="rq-detail-grid">
              <div className="rq-detail-item"><p className="rq-detail-label">Product</p><p className="rq-detail-value">{it.productName}</p></div>
              <div className="rq-detail-item"><p className="rq-detail-label">SKU</p><p className="rq-detail-value font-mono">{it.sku}</p></div>
              <div className="rq-detail-item"><p className="rq-detail-label">Customer</p><p className="rq-detail-value">{it.customer}</p></div>
              <div className="rq-detail-item"><p className="rq-detail-label">Platform</p><p className="rq-detail-value">{it.platform}</p></div>
              <div className="rq-detail-item"><p className="rq-detail-label">Category</p><p className="rq-detail-value">{it.category}</p></div>
              <div className="rq-detail-item"><p className="rq-detail-label">Return Reason</p><p className="rq-detail-value">{it.returnReason}</p></div>
              <div className="rq-detail-item"><p className="rq-detail-label">Defect Type</p><p className="rq-detail-value">{it.defectType}</p></div>
              <div className="rq-detail-item"><p className="rq-detail-label">Disposition</p><p className="rq-detail-value">{it.disposition}</p></div>
              <div className="rq-detail-item"><p className="rq-detail-label">Warehouse</p><p className="rq-detail-value">{it.warehouse}</p></div>
              <div className="rq-detail-item"><p className="rq-detail-label">Inspector</p><p className="rq-detail-value">{it.inspector}</p></div>
              <div className="rq-detail-item"><p className="rq-detail-label">Photos</p><p className="rq-detail-value">{it.photos} attached</p></div>
              <div className="rq-detail-item"><p className="rq-detail-label">Refurb Cost</p><p className="rq-detail-value">{it.refurbCost > 0 ? `₹${it.refurbCost}` : "N/A"}</p></div>
            </div>
            <div className="rq-loss-section">
              <div className="rq-loss-row"><span>Estimated Loss</span><span className="rq-loss-red">₹{it.estimatedLoss.toLocaleString()}</span></div>
              <div className="rq-loss-row"><span>Resale Value</span><span className="rq-loss-green">₹{it.resaleValue.toLocaleString()}</span></div>
              <div className="rq-loss-row rq-loss-total"><span>Net Impact</span><span className={it.resaleValue > it.estimatedLoss ? "text-emerald-600 font-semibold" : "text-red-600 font-semibold"}>₹{(it.resaleValue - it.estimatedLoss).toLocaleString()}</span></div>
            </div>
            <div className="rq-timeline">
              <h4 className="rq-timeline-title">Inspection Timeline</h4>
              {it.timeline.map((step, idx) => (
                <div key={step.step} className="rq-timeline-step">
                  <div className={`rq-timeline-dot ${step.status}`} />
                  {idx < it.timeline.length - 1 && <div className="rq-timeline-line" />}
                  <div className="rq-timeline-info">
                    <p className="rq-timeline-step-name">{step.step}</p>
                    <p className="rq-timeline-step-date">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="rq-drawer-notes">
              <p className="rq-notes-label">Inspector Notes</p>
              <p className="rq-notes-text">{it.notes}</p>
            </div>
            <div className="rq-drawer-actions">
              <Button size="sm" className="rq-btn-primary"><ClipboardCheck className="h-3.5 w-3.5 mr-1" /> Complete Inspection</Button>
              <Button size="sm" variant="outline" className="btn-outline-animate rq-btn-outline"><Camera className="h-3.5 w-3.5 mr-1" /> Add Photos</Button>
              <Button size="sm" variant="outline" className="btn-outline-animate rq-btn-outline"><QrCode className="h-3.5 w-3.5 mr-1" /> Scan SKU</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rq-container space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <div>
          <h1 className="rq-page-title"><ClipboardCheck className="h-5 w-5 text-blue-500" />Returns Quality Inspection & Disposition</h1>
          <p className="rq-page-subtitle">Inspect, grade, and manage disposition of returned goods across all channels</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="rq-btn-primary"><Plus className="h-3.5 w-3.5 mr-1" /> New Inspection</Button>
          <Button size="sm" variant="outline" className="btn-outline-animate rq-btn-outline"><RefreshCw className="h-3.5 w-3.5 mr-1" /> Bulk Grade</Button>
          <Button size="sm" variant="outline" className="btn-outline-animate rq-btn-outline"><Download className="h-3.5 w-3.5 mr-1" /> Export Report</Button>
        </div>
      </div>

      <div className="rq-tabs-bar">
        {tabs.map((tab, idx) => (
          <button key={tab} className={`rq-tab ${activeTab === idx ? "rq-tab-active" : ""}`} onClick={() => handleTabChange(idx)}>
            <span className="rq-tab-label">{tab}</span>
            {activeTab === idx && <span className="rq-tab-indicator" />}
          </button>
        ))}
      </div>

      {activeTab === 0 && renderDashboard()}
      {activeTab === 1 && renderInspectionQueue()}
      {activeTab === 2 && renderGradeDisposition()}
      {activeTab === 3 && renderPlatformAnalysis()}
      {activeTab === 4 && renderLossRecovery()}

      {drawerOpen && renderDrawer()}
    </div>
  )
}
