"use client"

import { useState, Fragment } from "react"
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart,
} from "recharts"
import {
  ShieldCheck, Search, CheckCircle2, AlertTriangle, BarChart3,
  TrendingUp, Eye, X, Clock, Package, ArrowRight,
  ChevronRight, MapPin, Users, IndianRupee,
  Warehouse, Filter, Calendar, Star, Zap, Tag,
  ArrowUpRight, ArrowDownRight, ClipboardCheck, XCircle,
  ThumbsUp, ThumbsDown, FileWarning, Beaker, Thermometer,
  Weight, Ruler, Microscope, BadgeCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"

function createRng(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 12345) % 2147483647; return (s & 0x7fffffff) / 0x7fffffff }
}
const rand = createRng(144144)
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)]
const rInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min
const rDate = (start: number, end: number) => new Date(2026, 6, rInt(start, end)).toISOString().split("T")[0]
const rTime = () => `${String(rInt(4, 20)).padStart(2, "0")}:${String(rInt(0, 59)).padStart(2, "0")}`

const WAREHOUSES = ["Mumbai Hub", "Delhi NCR", "Chennai DC", "Kolkata Hub", "Bangalore South", "Pune West"]
const INSPECTION_TYPES = ["Incoming", "In-Process", "Final", "Line Audit", "Random Sample", "Calibration", "Environmental", "Safety"]
const INSPECTION_STATUSES = ["Pending", "In Progress", "Passed", "Failed", "Conditional Pass", "Rework Required", "Escalated"]
const DEFECT_SEVERITIES = ["Critical", "Major", "Minor", "Cosmetic"]
const DEFECT_CATEGORIES = ["Dimensional", "Surface Finish", "Functional", "Material", "Packaging", "Labeling", "Color", "Weight", "Assembly", "Safety"]
const SAMPLING_PLANS = ["AQL 0.65", "AQL 1.0", "AQL 1.5", "AQL 2.5", "AQL 4.0", "100% Inspection", "Skip-Lot"]
const INSPECTION_STANDARDS = ["ISO 2859-1", "ISO 9001:2015", "AS9100D", "IATF 16949", "ASTM E2587", "MIL-STD-1916", "FSSAI", "BIS"]

const inspectors = [
  { id: "INSP-001", name: "Rajesh Iyer", cert: "CQI-IRCA Lead Auditor", dept: "Quality", avatar: "RI", inspections: rInt(200, 800) },
  { id: "INSP-002", name: "Kavitha Menon", cert: "ISO 9001 Auditor", dept: "Quality", avatar: "KM", inspections: rInt(150, 600) },
  { id: "INSP-003", name: "Sunil Deshmukh", cert: "Six Sigma Black Belt", dept: "Operations", avatar: "SD", inspections: rInt(180, 700) },
  { id: "INSP-004", name: "Ananya Roy", cert: "CQE-ASQ", dept: "Quality", avatar: "AR", inspections: rInt(100, 400) },
  { id: "INSP-005", name: "Deepak Joshi", cert: "Lean Manufacturing", dept: "Production", avatar: "DJ", inspections: rInt(120, 500) },
  { id: "INSP-006", name: "Meera Krishnan", cert: "FSSAI Certified", dept: "Quality", avatar: "MK", inspections: rInt(250, 900) },
]

const inspections = (() => {
  const result: Array<{
    id: string; type: string; standard: string; status: string; priority: string;
    inspector: typeof inspectors[0]; warehouse: string; department: string;
    batchId: string; productId: string; productName: string; supplier: string;
    sampleSize: number; totalLot: number; passCount: number; failCount: number;
    defectRate: number; samplingPlan: string; startDate: string; endDate: string | null;
    duration: number | null; score: number | null; notes: string | null;
  }> = []

  const products = [
    { id: "PRD-001", name: "Steel Bearing Housing", supplier: "Tata Steel" },
    { id: "PRD-002", name: "LED Panel Assembly", supplier: "Godrej Electrical" },
    { id: "PRD-003", name: "Pharma Tablet Pack", supplier: "Sun Pharma" },
    { id: "PRD-004", name: "Auto Brake Disc", supplier: "Bharat Forge" },
    { id: "PRD-005", name: "Textile Roll", supplier: "Welspun Global" },
    { id: "PRD-006", name: "FMCG Shampoo Bottle", supplier: "Hindustan Unilever" },
    { id: "PRD-007", name: "Electronic PCB Board", supplier: "Dixon Tech" },
    { id: "PRD-008", name: "Rubber Gasket Set", supplier: "MRF Tyres" },
    { id: "PRD-009", name: "Food Grade Container", supplier: "TCPL Packaging" },
    { id: "PRD-010", name: "Precision Gear Assembly", supplier: "Bajaj Auto" },
  ]

  for (let i = 0; i < 100; i++) {
    const status = pick(INSPECTION_STATUSES)
    const sampleSize = rInt(5, 200)
    const totalLot = rInt(sampleSize * 5, sampleSize * 20)
    const failCount = status === "Passed" ? 0 : rInt(0, Math.round(sampleSize * 0.15))
    const passCount = sampleSize - failCount
    const product = pick(products)
    const inspector = pick(inspectors)

    result.push({
      id: `QC-${String(i + 1).padStart(4, "0")}`,
      type: pick(INSPECTION_TYPES), standard: pick(INSPECTION_STANDARDS),
      status, priority: pick(["Critical", "High", "Medium", "Medium", "Low"]),
      inspector, warehouse: pick(WAREHOUSES), department: pick(["Quality", "Operations", "Production", "Inbound", "Outbound"]),
      batchId: `BTH-${String(rInt(1000, 9999))}`,
      productId: product.id, productName: product.name, supplier: product.supplier,
      sampleSize, totalLot, passCount, failCount,
      defectRate: +(failCount / sampleSize * 100).toFixed(2),
      samplingPlan: pick(SAMPLING_PLANS),
      startDate: rDate(1, 28), endDate: status !== "Pending" ? rDate(1, 28) : null,
      duration: status !== "Pending" ? rInt(15, 180) : null,
      score: status === "Passed" ? rInt(85, 100) : status === "Failed" ? rInt(20, 60) : status === "Conditional Pass" ? rInt(70, 84) : null,
      notes: status === "Failed" ? pick(["Surface scratches exceeding tolerance", "Dimensional variance in slot width", "Missing safety seal", "Color mismatch with approved sample", "Weight below minimum spec"]) :
              status === "Conditional Pass" ? pick(["Minor surface defect, acceptable with concession", "Label alignment off by 2mm, within tolerance", "Packaging dent, functional product OK"]) : null,
    })
  }
  return result
})()

const defects = (() => {
  const result: Array<{
    id: string; inspectionId: string; category: string; severity: string;
    description: string; product: string; warehouse: string;
    inspector: typeof inspectors[0]; date: string;
    rootCause: string; correctiveAction: string | null; status: string;
  }> = []

  for (let i = 0; i < 50; i++) {
    const status = pick(["Open", "In Progress", "Resolved", "Escalated", "Closed"])
    const inspector = pick(inspectors)
    const inspection = pick(inspections.filter((insp) => insp.status !== "Pending" && insp.status !== "Passed"))

    result.push({
      id: `DEF-${String(i + 1).padStart(4, "0")}`,
      inspectionId: inspection.id,
      category: pick(DEFECT_CATEGORIES),
      severity: pick(DEFECT_SEVERITIES),
      description: pick([
        "Surface scratch detected on housing surface — 3mm length, exceeds 2mm spec",
        "Dimensional variance: inner diameter 24.8mm vs spec 25.0±0.1mm",
        "Functional test failed: actuation force 8.5N exceeds 7.5N maximum",
        "Material contamination: foreign particle in pharmaceutical batch",
        "Packaging damage: corner dent on corrugated box — 15mm depth",
        "Label misalignment: barcode rotation 5° exceeds 2° tolerance",
        "Color variation: ΔE value 3.2 exceeds ΔE ≤ 2.0 specification",
        "Weight deviation: net weight 492g vs declared 500g (1.6% under)",
        "Assembly defect: missing O-ring seal in hydraulic assembly",
        "Safety non-compliance: safety interlock not engaging per IEC 61010",
      ]),
      product: inspection.productName, warehouse: inspection.warehouse,
      inspector, date: rDate(1, 28),
      rootCause: pick(["Operator error — incorrect tool setup", "Machine calibration drift beyond tolerance", "Raw material incoming quality issue", "Environmental factor — humidity exceeding spec", "Process parameter deviation — temperature control", "Wear and tear of tooling — die wear", "Supplier quality issue — incoming material defect", "Handling damage during transfer"]),
      correctiveAction: status === "Resolved" || status === "Closed" ? pick(["Tooling replaced, process parameters updated", "Incoming inspection tightened, supplier notified", "Operator retrained on SOP-QC-042", "Machine recalibrated, verification inspection passed", "Handling procedure revised, protective packaging added"]) : null,
      status,
    })
  }
  return result
})()

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const COLORS = ["#0ea5e9", "#ef4444", "#f59e0b", "#8b5cf6", "#06b6d4", "#ec4899", "#22c55e", "#f97316"]

const monthlyInspections = MONTHS.map((m) => ({
  month: m, incoming: rInt(30, 80), inProcess: rInt(20, 60), final: rInt(25, 70), totalDefects: rInt(5, 30),
}))

const monthlyDefectRate = MONTHS.map((m) => ({
  month: m, rate: +(rand() * 3 + 0.5).toFixed(2), target: 2.0,
}))

const typeDist = (() => {
  const counts: Record<string, number> = {}
  inspections.forEach((insp) => { counts[insp.type] = (counts[insp.type] || 0) + 1 })
  return Object.entries(counts).map(([name, count]) => ({ name, count }))
})()

const severityDist = (() => {
  const counts: Record<string, number> = {}
  defects.forEach((d) => { counts[d.severity] = (counts[d.severity] || 0) + 1 })
  return Object.entries(counts).map(([name, count]) => ({ name, count }))
})()

const categoryDist = (() => {
  const counts: Record<string, number> = {}
  defects.forEach((d) => { counts[d.category] = (counts[d.category] || 0) + 1 })
  return Object.entries(counts).map(([name, count]) => ({ name, count }))
})()

const whQuality = WAREHOUSES.map((w) => ({
  warehouse: w, passed: rInt(40, 150), failed: rInt(2, 15), conditional: rInt(1, 8), avgScore: rInt(85, 98),
}))

const STATUS_COLORS: Record<string, string> = {
  Pending: "qci-badge-pending", "In Progress": "qci-badge-progress", Passed: "qci-badge-passed",
  Failed: "qci-badge-failed", "Conditional Pass": "qci-badge-conditional", "Rework Required": "qci-badge-rework", Escalated: "qci-badge-escalated",
  Open: "qci-badge-open", "Resolved": "qci-badge-resolved", Closed: "qci-badge-closed",
}

const SEVERITY_COLORS: Record<string, string> = {
  Critical: "qci-severity-critical", Major: "qci-severity-major", Minor: "qci-severity-minor", Cosmetic: "qci-severity-cosmetic",
}

const PRIORITY_COLORS: Record<string, string> = {
  Critical: "qci-priority-critical", High: "qci-priority-high", Medium: "qci-priority-medium", Low: "qci-priority-low",
}

const totalInspections = inspections.length
const passedCount = inspections.filter((i) => i.status === "Passed").length
const failedCount = inspections.filter((i) => i.status === "Failed").length
const pendingCount = inspections.filter((i) => i.status === "Pending" || i.status === "In Progress").length
const openDefects = defects.filter((d) => d.status === "Open" || d.status === "Escalated").length
const avgScore = Math.round(inspections.filter((i) => i.score !== null).reduce((s, i) => s + i.score!, 0) / inspections.filter((i) => i.score !== null).length * 10) / 10

const KPIS = [
  { label: "Total Inspections", value: String(totalInspections), sub: `${passedCount} passed`, icon: ClipboardCheck, trend: "up" },
  { label: "Pass Rate", value: `${Math.round(passedCount / (passedCount + failedCount) * 100)}%`, sub: "Target: 95%", icon: CheckCircle2, trend: passedCount / (passedCount + failedCount) > 0.9 ? "up" : "down" },
  { label: "Pending Queue", value: String(pendingCount), sub: "Awaiting action", icon: Clock, trend: pendingCount > 20 ? "down" : "up" },
  { label: "Open Defects", value: String(openDefects), sub: "Need resolution", icon: XCircle, trend: openDefects > 10 ? "down" : "up" },
  { label: "Avg Quality Score", value: `${avgScore}`, sub: "Out of 100", icon: Star, trend: avgScore > 90 ? "up" : "down" },
  { label: "Inspectors", value: String(inspectors.length), sub: "Certified team", icon: Users, trend: "up" },
]

type InspDetail = typeof inspections[0]

export default function QualityControlView() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedInsp, setSelectedInsp] = useState<InspDetail | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const openDrawer = (insp: InspDetail) => { setSelectedInsp(insp); setDrawerOpen(true) }

  const filteredInspecs = inspections.filter((i) => {
    const ms = i.id.toLowerCase().includes(searchTerm.toLowerCase()) || i.productName.toLowerCase().includes(searchTerm.toLowerCase()) || i.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const mst = statusFilter === "all" || i.status === statusFilter
    return ms && mst
  })

  const filteredDefects = defects.filter((d) => {
    const ms = d.id.toLowerCase().includes(searchTerm.toLowerCase()) || d.description.toLowerCase().includes(searchTerm.toLowerCase()) || d.category.toLowerCase().includes(searchTerm.toLowerCase())
    const mst = statusFilter === "all" || d.status === statusFilter
    return ms && mst
  })

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "inspections", label: "Inspection Queue" },
    { id: "defects", label: "Defects" },
    { id: "sampling", label: "Sampling" },
    { id: "analytics", label: "Analytics" },
  ]

  return (
    <div className="qci-root flex flex-col h-full">
      <div className="qci-header px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="qci-icon-wrap"><ShieldCheck className="h-6 w-6" /></div>
          <div>
            <h1 className="qci-title text-xl font-bold">Quality Control &amp; Inspection Center</h1>
            <p className="qci-subtitle text-sm">Inspection management, defect tracking &amp; sampling plans</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="badge-interactive qci-badge-trend qci-badge-trend-up">{totalInspections} Inspections</Badge>
          <Badge className="badge-interactive qci-badge-trend qci-badge-trend-up">{inspectors.length} Inspectors</Badge>
        </div>
      </div>

      <div className="qci-tabs-wrap px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="qci-tabs-list">
            {tabs.map((t) => <TabsTrigger key={t.id} value={t.id} className="qci-tab-trigger">{t.label}</TabsTrigger>)}
          </TabsList>
        </Tabs>
      </div>

      <div className="qci-content flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {activeTab === "dashboard" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {KPIS.map((kpi) => (
                <Card key={kpi.label} className="hover-lift-sm qci-kpi-card">
                  <CardContent className="inner-glow glass-subtle p-4">
                    <div className="flex items-center justify-between mb-2">
                      <kpi.icon className="h-4 w-4 qci-kpi-icon" />
                      <span className={cn("qci-trend-badge", kpi.trend === "up" ? "qci-trend-up" : "qci-trend-down")}>
                        {kpi.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      </span>
                    </div>
                    <div className="qci-kpi-value text-lg font-bold">{kpi.value}</div>
                    <div className="qci-kpi-label text-xs">{kpi.label}</div>
                    <div className="qci-kpi-sub text-xs">{kpi.sub}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="hover-lift-sm qci-chart-card">
                <CardHeader className="pb-2"><CardTitle className="qci-chart-title text-sm">Inspection Volume by Type</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <ComposedChart data={monthlyInspections}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e5e7eb)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="incoming" name="Incoming" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="inProcess" name="In-Process" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="final" name="Final" fill="#22c55e" radius={[4, 4, 0, 0]} />
                      <Line type="monotone" dataKey="totalDefects" name="Defects" stroke="#ef4444" strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover-lift-sm qci-chart-card">
                <CardHeader className="pb-2"><CardTitle className="qci-chart-title text-sm">Defect Rate Trend</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={monthlyDefectRate}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e5e7eb)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" unit="%" />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                      <Line type="monotone" dataKey="rate" name="Actual %" stroke="#ef4444" strokeWidth={2} />
                      <Line type="monotone" dataKey="target" name="Target" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover-lift-sm qci-chart-card">
                <CardHeader className="pb-2"><CardTitle className="qci-chart-title text-sm">Inspection Type Distribution</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={typeDist} dataKey="count" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={2} label={({ name, count }) => `${name}: ${count}`}>
                        {typeDist.map((_, idx) => { const tc = COLORS; return <Cell key={idx} fill={tc[idx % tc.length]} /> })}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="hover-lift-sm qci-chart-card">
                <CardHeader className="pb-2"><CardTitle className="qci-chart-title text-sm">Warehouse Quality Overview</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={whQuality}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e5e7eb)" />
                      <XAxis dataKey="warehouse" tick={{ fontSize: 9 }} stroke="var(--chart-axis, #6b7280)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="passed" name="Passed" fill="#22c55e" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="failed" name="Failed" fill="#ef4444" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="conditional" name="Conditional" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover-lift-sm qci-chart-card">
                <CardHeader className="pb-2"><CardTitle className="qci-chart-title text-sm">Defect Severity Distribution</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={severityDist} dataKey="count" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={3} label={({ name, count }) => `${name}: ${count}`}>
                        {severityDist.map((_, idx) => { const sc = ["#ef4444", "#f97316", "#f59e0b", "#06b6d4"]; return <Cell key={idx} fill={sc[idx % sc.length]} /> })}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="hover-lift-sm qci-alert-card">
              <CardHeader className="pb-2"><CardTitle className="qci-chart-title text-sm">Quality Alerts</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { msg: "QC-0042 failed — dimension variance detected on Brake Disc (Bharat Forge), batch BTH-3421", severity: "critical", time: "10m ago" },
                    { msg: "Defect rate exceeded 2.5% target in Mumbai Hub incoming inspection this week", severity: "warning", time: "35m ago" },
                    { msg: "Inspector Meera Krishnan FSSAI certification renewal due in 30 days", severity: "info", time: "1h ago" },
                    { msg: "Corrective action verified for DEF-0018 — recalibration completed", severity: "info", time: "2h ago" },
                    { msg: "Line audit at Chennai DC found 3 minor labeling defects in pharma batch", severity: "warning", time: "3h ago" },
                    { msg: "Skip-lot approval granted for Tata Steel — 5 consecutive lot passes", severity: "info", time: "5h ago" },
                  ].map((alert, idx) => (
                    <div key={idx} className={cn("qci-alert-row flex items-center justify-between p-2 rounded-lg text-sm", alert.severity === "critical" && "qci-alert-critical", alert.severity === "warning" && "qci-alert-warning", alert.severity === "info" && "qci-alert-info")}>
                      <div className="flex items-center gap-2">
                        {alert.severity === "critical" ? <AlertTriangle className="h-4 w-4 text-red-500" /> : alert.severity === "warning" ? <Clock className="h-4 w-4 text-amber-500" /> : <Eye className="h-4 w-4 text-blue-500" />}
                        <span>{alert.msg}</span>
                      </div>
                      <span className="text-xs opacity-70">{alert.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "inspections" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                <input className="qci-filter-input w-full pl-9 pr-4 py-2 rounded-lg text-sm" placeholder="Search by ID, product, or supplier..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <select className="qci-filter-select rounded-lg px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                {INSPECTION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
              {INSPECTION_STATUSES.map((s) => {
                const cnt = inspections.filter((i) => i.status === s).length
                return (
                  <Card key={s} className="hover-lift-sm qci-stat-mini cursor-pointer" onClick={() => setStatusFilter(s)}>
                    <CardContent className="inner-glow glass-subtle p-2 text-center">
                      <div className="text-sm font-bold">{cnt}</div>
                      <div className="text-[9px] opacity-60 truncate">{s}</div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <Card className="hover-lift-sm card-crud-lift qci-table-card">
              <CardContent className="inner-glow glass-subtle p-0">
                <div className="overflow-x-auto">
                  <Table className="table-hover-highlight">
                    <TableHeader>
                      <TableRow className="qci-table-header">
                        <TableHead className="qci-th">ID</TableHead>
                        <TableHead className="qci-th">Type</TableHead>
                        <TableHead className="qci-th">Product</TableHead>
                        <TableHead className="qci-th">Supplier</TableHead>
                        <TableHead className="qci-th">Standard</TableHead>
                        <TableHead className="qci-th">Sampling</TableHead>
                        <TableHead className="qci-th">Sample/Lot</TableHead>
                        <TableHead className="qci-th">Pass/Fail</TableHead>
                        <TableHead className="qci-th">Defect%</TableHead>
                        <TableHead className="qci-th">Score</TableHead>
                        <TableHead className="qci-th">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInspecs.slice(0, 30).map((insp) => (
                        <TableRow key={insp.id} className="qci-table-row cursor-pointer" onClick={() => openDrawer(insp)}>
                          <TableCell className="qci-td font-mono text-xs">{insp.id}</TableCell>
                          <TableCell className="qci-td text-xs">{insp.type}</TableCell>
                          <TableCell className="qci-td text-xs font-medium">{insp.productName}</TableCell>
                          <TableCell className="qci-td text-xs">{insp.supplier}</TableCell>
                          <TableCell className="badge-interactive qci-td text-xs"><Badge className="qci-standard-badge text-[10px]">{insp.standard}</Badge></TableCell>
                          <TableCell className="qci-td text-xs">{insp.samplingPlan}</TableCell>
                          <TableCell className="numeric-cell qci-td text-xs font-mono">{insp.sampleSize}/{insp.totalLot}</TableCell>
                          <TableCell className="qci-td text-xs">
                            <span className="text-emerald-600">{insp.passCount}</span>
                            <span className="opacity-40"> / </span>
                            <span className="text-red-500">{insp.failCount}</span>
                          </TableCell>
                          <TableCell className={cn("qci-td text-xs font-bold", insp.defectRate > 5 ? "text-red-500" : insp.defectRate > 2 ? "text-amber-500" : "text-emerald-600")}>{insp.defectRate}%</TableCell>
                          <TableCell className="numeric-cell qci-td text-xs font-mono">{insp.score !== null ? insp.score : "—"}</TableCell>
                          <TableCell className="badge-interactive qci-td"><Badge className={cn(STATUS_COLORS[insp.status], "text-[10px]")}>{insp.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "defects" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                <input className="qci-filter-input w-full pl-9 pr-4 py-2 rounded-lg text-sm" placeholder="Search defects..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <select className="qci-filter-select rounded-lg px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Escalated">Escalated</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Total Defects", value: String(defects.length), color: "qci-sum-card-red" },
                { label: "Critical", value: String(defects.filter((d) => d.severity === "Critical").length), color: "qci-sum-card-red" },
                { label: "Open", value: String(defects.filter((d) => d.status === "Open").length), color: "qci-sum-card-amber" },
                { label: "Resolved", value: String(defects.filter((d) => d.status === "Resolved" || d.status === "Closed").length), color: "qci-sum-card-green" },
              ].map((c) => (
                <Card key={c.label} className={c.color}>
                  <CardContent className="inner-glow glass-subtle p-3 text-center">
                    <div className="text-lg font-bold">{c.value}</div>
                    <div className="text-xs opacity-70">{c.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="hover-lift-sm qci-chart-card">
              <CardHeader className="pb-2"><CardTitle className="qci-chart-title text-sm">Defect Category Breakdown</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={categoryDist} dataKey="count" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={2} label={({ name, count }) => `${name}: ${count}`}>
                      {categoryDist.map((_, idx) => { const cc = COLORS; return <Cell key={idx} fill={cc[idx % cc.length]} /> })}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="hover-lift-sm card-crud-lift qci-table-card">
              <CardContent className="inner-glow glass-subtle p-0">
                <div className="overflow-x-auto">
                  <Table className="table-hover-highlight">
                    <TableHeader>
                      <TableRow className="qci-table-header">
                        <TableHead className="qci-th">ID</TableHead>
                        <TableHead className="qci-th">Inspection</TableHead>
                        <TableHead className="qci-th">Category</TableHead>
                        <TableHead className="qci-th">Severity</TableHead>
                        <TableHead className="qci-th">Description</TableHead>
                        <TableHead className="qci-th">Root Cause</TableHead>
                        <TableHead className="qci-th">Corrective Action</TableHead>
                        <TableHead className="qci-th">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDefects.map((d) => (
                        <TableRow key={d.id} className="qci-table-row">
                          <TableCell className="qci-td font-mono text-xs">{d.id}</TableCell>
                          <TableCell className="qci-td font-mono text-xs">{d.inspectionId}</TableCell>
                          <TableCell className="qci-td text-xs">{d.category}</TableCell>
                          <TableCell className="badge-interactive qci-td"><Badge className={cn(SEVERITY_COLORS[d.severity], "text-[10px]")}>{d.severity}</Badge></TableCell>
                          <TableCell className="qci-td text-xs max-w-[180px] truncate">{d.description}</TableCell>
                          <TableCell className="qci-td text-xs max-w-[150px] truncate">{d.rootCause}</TableCell>
                          <TableCell className="qci-td text-xs max-w-[150px] truncate">{d.correctiveAction || "—"}</TableCell>
                          <TableCell className="badge-interactive qci-td"><Badge className={cn(STATUS_COLORS[d.status], "text-[10px]")}>{d.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "sampling" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inspectors.map((insp) => (
                <Card key={insp.id} className="hover-lift-sm qci-inspector-card">
                  <CardContent className="inner-glow glass-subtle p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="qci-inspector-avatar">{insp.avatar}</div>
                        <div>
                          <h3 className="font-semibold text-sm">{insp.name}</h3>
                          <p className="text-xs opacity-60">{insp.cert}</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="badge-interactive flex items-center gap-1"><BadgeCheck className="h-3 w-3 text-sky-500" /><span>Inspections: {insp.inspections}</span></div>
                      <div className="flex items-center gap-1"><Beaker className="h-3 w-3 text-amber-500" /><span>Dept: {insp.dept}</span></div>
                    </div>
                    <div className="mt-2 flex items-center gap-1">
                      <Microscope className="h-3 w-3 opacity-50" />
                      <span className="text-[10px] opacity-60">{insp.cert}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="hover-lift-sm qci-chart-card">
              <CardHeader className="pb-2"><CardTitle className="qci-chart-title text-sm">Sampling Plans Overview</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={SAMPLING_PLANS.map((sp) => ({ plan: sp, usage: inspections.filter((i) => i.samplingPlan === sp).length }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e5e7eb)" />
                    <XAxis dataKey="plan" tick={{ fontSize: 10 }} stroke="var(--chart-axis, #6b7280)" />
                    <YAxis tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    <Bar dataKey="usage" name="Usage" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="hover-lift-sm qci-chart-card">
              <CardHeader className="pb-2"><CardTitle className="qci-chart-title text-sm">Standards Reference</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={INSPECTION_STANDARDS.map((std) => ({ standard: std, usage: inspections.filter((i) => i.standard === std).length }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e5e7eb)" />
                    <XAxis dataKey="standard" tick={{ fontSize: 10 }} stroke="var(--chart-axis, #6b7280)" />
                    <YAxis tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    <Bar dataKey="usage" name="Usage" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Avg Defect Rate", value: `${(defects.length / inspections.length * 100).toFixed(1)}%`, sub: "Target: ≤ 2.0%" },
                { label: "CAPA Closure Rate", value: `${rInt(75, 95)}%`, sub: "Within 30 days" },
                { label: "First Pass Yield", value: `${rInt(88, 98)}%`, sub: "All inspection types" },
                { label: "Inspector Utilization", value: `${rInt(70, 92)}%`, sub: "Productive hours" },
              ].map((k) => (
                <Card key={k.label} className="hover-lift-sm qci-kpi-card">
                  <CardContent className="inner-glow glass-subtle p-4">
                    <div className="qci-kpi-value text-lg font-bold">{k.value}</div>
                    <div className="qci-kpi-label text-xs">{k.label}</div>
                    <div className="qci-kpi-sub text-xs">{k.sub}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="hover-lift-sm qci-chart-card">
                <CardHeader className="pb-2"><CardTitle className="qci-chart-title text-sm">Quality Score by Warehouse</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={whQuality}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e5e7eb)" />
                      <XAxis dataKey="warehouse" tick={{ fontSize: 9 }} stroke="var(--chart-axis, #6b7280)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" domain={[80, 100]} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Bar dataKey="avgScore" name="Avg Score" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover-lift-sm qci-chart-card">
                <CardHeader className="pb-2"><CardTitle className="qci-chart-title text-sm">Defect Pareto (Top Categories)</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={(() => {
                      const sorted = [...categoryDist].sort((a, b) => b.count - a.count).slice(0, 6)
                      let cumulative = 0
                      const total = categoryDist.reduce((s, c) => s + c.count, 0)
                      return sorted.map((c) => { cumulative += c.count; return { ...c, cumulative: Math.round(cumulative / total * 100) } })
                    })()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e5e7eb)" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="var(--chart-axis, #6b7280)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="count" name="Defect Count" fill="#ef4444" radius={[4, 4, 0, 0]} />
                      <Line type="monotone" dataKey="cumulative" name="Cumulative %" stroke="#0ea5e9" strokeWidth={2} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover-lift-sm qci-chart-card">
                <CardHeader className="pb-2"><CardTitle className="qci-chart-title text-sm">Inspector Performance</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={inspectors.map((insp) => ({ name: insp.name.split(" ")[0], inspections: insp.inspections }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e5e7eb)" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="var(--chart-axis, #6b7280)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Bar dataKey="inspections" name="Total Inspections" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover-lift-sm qci-chart-card">
                <CardHeader className="pb-2"><CardTitle className="qci-chart-title text-sm">Root Cause Analysis</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={(() => {
                        const counts: Record<string, number> = {}
                        defects.forEach((d) => { counts[d.rootCause] = (counts[d.rootCause] || 0) + 1 })
                        return Object.entries(counts).map(([name, count]) => ({ name: name.split(" — ")[0], count })).sort((a, b) => b.count - a.count).slice(0, 6)
                      })()} dataKey="count" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={2} label={({ name, count }) => `${name}: ${count}`}>
                        {["#ef4444", "#f97316", "#f59e0b", "#0ea5e9", "#8b5cf6", "#22c55e"].map((c, idx) => {
                          const rcData = (() => {
                            const counts: Record<string, number> = {}
                            defects.forEach((d) => { counts[d.rootCause] = (counts[d.rootCause] || 0) + 1 })
                            return Object.entries(counts).map(([name, count]) => ({ name: name.split(" — ")[0], count })).sort((a, b) => b.count - a.count).slice(0, 6)
                          })()
                          return <Cell key={idx} fill={c} />
                        })}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {drawerOpen && selectedInsp && (
        <div className="qci-drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="qci-drawer" onClick={(e) => e.stopPropagation()}>
            <div className={cn("qci-drawer-header p-5", selectedInsp.status === "Passed" ? "qci-drawer-header-passed" : selectedInsp.status === "Failed" ? "qci-drawer-header-failed" : selectedInsp.status === "Conditional Pass" ? "qci-drawer-header-conditional" : "qci-drawer-header-default")}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="qci-drawer-avatar"><Microscope className="h-6 w-6" /></div>
                  <div>
                    <h2 className="font-bold text-lg">{selectedInsp.id}</h2>
                    <p className="text-sm opacity-80">{selectedInsp.productName}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setDrawerOpen(false)} className="press-scale text-white/70 hover:text-white hover:bg-white/10">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-3">
<div className="chip-group">
                <Badge className={cn(STATUS_COLORS[selectedInsp.status])}>{selectedInsp.status}</Badge>
                <Badge className="badge-interactive qci-badge-trend qci-badge-trend-up">{selectedInsp.type}</Badge>
                <Badge className={cn(PRIORITY_COLORS[selectedInsp.priority], "text-white")}>{selectedInsp.priority}</Badge>
                {selectedInsp.score !== null && <Badge className="badge-interactive qci-score-badge text-white">{selectedInsp.score}/100</Badge>}
</div>
              </div>
            </div>

            <div className="px-5 py-3 border-b">
              <div className="flex items-center justify-between">
                {["Pending", "In Progress", "Passed", "Failed"].map((step, idx) => (
                  <Fragment key={step}>
                    <div className="flex flex-col items-center">
                      <div className={cn("qci-flow-dot", selectedInsp.status === "Passed" ? idx <= 2 : selectedInsp.status === "Failed" ? idx <= 2 : idx <= 0 ? "qci-flow-dot-active" : "qci-flow-dot-inactive")}>
                        {selectedInsp.status === "Passed" ? idx <= 2 ? <CheckCircle2 className="h-3 w-3" /> : <span className="text-[10px]">{idx + 1}</span> : idx <= 0 ? <span className="text-[10px]">{idx + 1}</span> : <span className="text-[10px]">{idx + 1}</span>}
                      </div>
                      <span className="text-[10px] mt-1 opacity-70">{step}</span>
                    </div>
                    {idx < 3 && <div className={cn("flex-1 h-0.5 mx-1", selectedInsp.status === "Passed" ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-600")} />}
                  </Fragment>
                ))}
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-5 space-y-5">
              <div>
                <h3 className="qci-section-title text-sm font-semibold mb-2">Inspection Details</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Inspection ID", value: selectedInsp.id },
                    { label: "Type", value: selectedInsp.type },
                    { label: "Standard", value: selectedInsp.standard },
                    { label: "Sampling Plan", value: selectedInsp.samplingPlan },
                    { label: "Batch ID", value: selectedInsp.batchId },
                    { label: "Product ID", value: selectedInsp.productId },
                    { label: "Product", value: selectedInsp.productName },
                    { label: "Supplier", value: selectedInsp.supplier },
                    { label: "Department", value: selectedInsp.department },
                    { label: "Start Date", value: selectedInsp.startDate },
                    { label: "End Date", value: selectedInsp.endDate || "—" },
                    { label: "Duration", value: selectedInsp.duration !== null ? `${selectedInsp.duration} min` : "—" },
                  ].map((item) => (
                    <div key={item.label} className="qci-info-cell p-2 rounded-lg">
                      <div className="qci-info-label text-[10px] uppercase opacity-50">{item.label}</div>
                      <div className="qci-info-value text-xs font-medium">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="qci-section-title text-sm font-semibold mb-2">Results</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Sample Size", value: String(selectedInsp.sampleSize) },
                    { label: "Total Lot", value: String(selectedInsp.totalLot) },
                    { label: "Passed", value: String(selectedInsp.passCount) },
                    { label: "Failed", value: String(selectedInsp.failCount) },
                    { label: "Defect Rate", value: `${selectedInsp.defectRate}%` },
                    { label: "Quality Score", value: selectedInsp.score !== null ? `${selectedInsp.score}/100` : "—" },
                  ].map((item) => (
                    <div key={item.label} className="qci-info-cell p-2 rounded-lg">
                      <div className="qci-info-label text-[10px] uppercase opacity-50">{item.label}</div>
                      <div className={cn("qci-info-value text-xs font-medium", item.label === "Failed" && selectedInsp.failCount > 0 && "text-red-500", item.label === "Defect Rate" && selectedInsp.defectRate > 2 && "text-amber-500")}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="qci-section-title text-sm font-semibold mb-2">Inspector</h3>
                <div className="qci-info-cell p-3 rounded-lg flex items-center gap-3">
                  <div className="qci-person-avatar"><span className="text-[10px] font-bold">{selectedInsp.inspector.avatar}</span></div>
                  <div>
                    <div className="text-sm font-medium">{selectedInsp.inspector.name}</div>
                    <div className="text-[10px] opacity-60">{selectedInsp.inspector.cert}</div>
                    <div className="text-[10px] opacity-60">{selectedInsp.inspector.dept} · {selectedInsp.inspector.inspections} inspections</div>
                  </div>
                </div>
              </div>

              {selectedInsp.notes && (
                <div>
                  <h3 className="qci-section-title text-sm font-semibold mb-2">Notes</h3>
                  <div className="qci-notes p-3 rounded-lg text-xs">{selectedInsp.notes}</div>
                </div>
              )}

              <div>
                <h3 className="qci-section-title text-sm font-semibold mb-2">Related Defects</h3>
                <div className="space-y-2">
                  {defects.filter((d) => d.inspectionId === selectedInsp.id).slice(0, 3).map((d) => (
                    <div key={d.id} className="qci-defect-mini p-2 rounded-lg flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Badge className={cn(SEVERITY_COLORS[d.severity], "text-[9px]")}>{d.severity}</Badge>
                        <span className="truncate max-w-[200px]">{d.category}: {d.description.split(" — ")[0]}</span>
                      </div>
                      <Badge className={cn(STATUS_COLORS[d.status], "text-[9px]")}>{d.status}</Badge>
                    </div>
                  ))}
                  {defects.filter((d) => d.inspectionId === selectedInsp.id).length === 0 && <p className="text-xs opacity-50">No defects recorded</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
