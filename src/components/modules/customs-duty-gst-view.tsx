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
  Landmark, Receipt, FileText, Globe, Search, Eye, X, ChevronRight, Filter,
  AlertTriangle, CheckCircle2, Clock, Package, Truck, MapPin, TrendingUp, TrendingDown,
  Target, RefreshCw, Download, Plus, ArrowRightLeft, ShieldCheck, Ban, CircleAlert,
  IndianRupee, FileCheck, Stamp, CalendarDays, Building2, Ship, Plane, Train,
  Barcode, Copy, ExternalLink, Calculator, BadgeDollarSign
} from "lucide-react"

function seededRandom(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646 }
}
const rng = seededRandom(153153)
function pick<T>(arr: T[]): T { return arr[Math.floor(rng() * arr.length)] }
function randInt(min: number, max: number): number { return Math.floor(rng() * (max - min + 1)) + min }
function randFloat(min: number, max: number, dec = 1): number { return Number((rng() * (max - min) + min).toFixed(dec)) }

const HS_CHAPTERS = [
  { code: "01", name: "Live Animals", duty: 5, gst: 0 },
  { code: "09", name: "Coffee, Tea, Spices", duty: 30, gst: 5 },
  { code: "21", name: "Food Preparations", duty: 15, gst: 12 },
  { code: "28", name: "Inorganic Chemicals", duty: 10, gst: 18 },
  { code: "39", name: "Plastics & Articles", duty: 15, gst: 18 },
  { code: "48", name: "Paper & Paperboard", duty: 10, gst: 12 },
  { code: "52", name: "Cotton", duty: 10, gst: 5 },
  { code: "61", name: "Apparel & Clothing", duty: 20, gst: 12 },
  { code: "71", name: "Natural Pearls, Gems", duty: 15, gst: 3 },
  { code: "84", name: "Machinery & Equipment", duty: 15, gst: 18 },
  { code: "85", name: "Electrical Machinery", duty: 15, gst: 18 },
  { code: "87", name: "Vehicles & Parts", duty: 25, gst: 28 },
  { code: "90", name: "Optical & Medical Instruments", duty: 10, gst: 18 },
  { code: "94", name: "Furniture & Bedding", duty: 20, gst: 18 },
  { code: "72", name: "Iron & Steel", duty: 15, gst: 18 },
]

const GST_TYPES = ["CGST", "SGST", "IGST", "UTGST"] as const
const EWAY_STATUSES = ["Active", "Expired", "Cancelled", "Extended", "In Transit", "Delivered", "Pending"] as const
const CUSTOMS_STATUSES = ["Cleared", "Under Examination", "Pending Assessment", "Hold", "Assessed", "Released"] as const
const DOCUMENT_TYPES = ["Bill of Entry", "Shipping Bill", "Exim Declaration", "GST Invoice", "E-Way Bill", "Customs Bond"] as const

const WAREHOUSES = [
  { name: "Mumbai Port WH", code: "MH-MP-001", zone: "SEZ" },
  { name: "Nhava Sheva CFS", code: "MH-NS-002", zone: "FTWZ" },
  { name: "Delhi ICD Tughlakabad", code: "DL-ICD-003", zone: "ICD" },
  { name: "Chennai Port CFS", code: "TN-CP-004", zone: "CFS" },
  { name: "Kolkata Dock", code: "WB-KD-005", zone: "Port" },
  { name: "Bangalore ICD Whitefield", code: "KA-BW-006", zone: "ICD" },
]

const SUPPLIERS = [
  { name: "Tata Steel Ltd", gstin: "27AABCT1332L1ZA", state: "MH" },
  { name: "Reliance Industries", gstin: "27AABCR5555L1Z5", state: "MH" },
  { name: "Infosys Ltd", gstin: "29AABCI1234L1Z1", state: "KA" },
  { name: "Mahindra & Mahindra", gstin: "27AABCM4444L1Z3", state: "MH" },
  { name: "Wipro Ltd", gstin: "29AABCW5555L1Z2", state: "KA" },
  { name: "Bajaj Auto Ltd", gstin: "27AABCB6666L1Z4", state: "MH" },
  { name: "Godrej Consumer", gstin: "27AABCG7777L1Z6", state: "MH" },
  { name: "Dr. Reddy's Labs", gstin: "36AABCD8888L1Z1", state: "TG" },
  { name: "Asian Paints Ltd", gstin: "27AABCA9999L1Z7", state: "MH" },
  { name: "Larsen & Toubro", gstin: "27AABCL0000L1Z8", state: "MH" },
]

const INDIAN_PORTS = ["Jawaharlal Nehru Port (Nhava Sheva)", "Mumbai Port", "Chennai Port", "Kolkata Port (Haldia)", "V.O. Chidambaranar Port (Tuticorin)", "Cochin Port", "Visakhapatnam Port", "Kandla Port", "Mundra Port", "Krishnapatnam Port"]
const TRANSPORT_MODES = ["Road", "Rail", "Air", "Ship", "Multi-modal"]

interface GSTInvoice {
  id: string; invoiceNo: string; supplier: string; gstin: string; date: string;
  hsCode: string; chapter: string; taxableValue: number; cgstRate: number; cgstAmt: number;
  sgstRate: number; sgstAmt: number; igstRate: number; igstAmt: number; totalGst: number;
  totalValue: number; status: string; warehouse: string; itcClaimed: boolean; itcAmount: number;
}

interface EWayBill {
  id: string; ewayNo: string; invoiceId: string; date: string; validUntil: string;
  from: string; to: string; transportMode: string; vehicleNo: string;
  distance: number; goods: string; hsCode: string; taxableValue: number; status: string;
  supplier: string; extended: boolean; extensions: number; warehouse: string;
}

interface CustomsEntry {
  id: string; beNo: string; type: string; port: string; date: string;
  importer: string; gstin: string; hsCode: string; chapter: string; country: string;
  assessableValue: number; customsDuty: number; igst: number; educationCess: number;
  socialCess: number; totalDuty: number; status: string; warehouse: string;
  documentType: string; agent: string;
}

const invoices: GSTInvoice[] = []
for (let i = 0; i < 250; i++) {
  const sup = pick(SUPPLIERS)
  const wh = pick(WAREHOUSES)
  const isInterState = sup.state !== wh.code.substring(0, 2)
  const chapter = pick(HS_CHAPTERS)
  const taxable = randInt(50000, 5000000)
  const gstRate = chapter.gst
  const igstAmt = isInterState ? Math.round(taxable * gstRate / 100) : 0
  const halfRate = gstRate / 2
  const cgstAmt = isInterState ? 0 : Math.round(taxable * halfRate / 100)
  const sgstAmt = isInterState ? 0 : Math.round(taxable * halfRate / 100)
  const totalGst = cgstAmt + sgstAmt + igstAmt
  const status = pick(["Filed", "Filed", "Filed", "Pending", "Under Review", "Reconciled", "ITC Claimed", "Error"])
  invoices.push({
    id: `GST-${String(1530001 + i).padStart(7, "0")}`,
    invoiceNo: `INV-${2026}${String(randInt(10000, 99999))}`,
    supplier: sup.name, gstin: sup.gstin,
    date: `2026-07-${String(randInt(1, 28)).padStart(2, "0")}`,
    hsCode: `${chapter.code}${String(randInt(10, 99))}.${String(randInt(10, 99))}.${String(randInt(10, 99))}`,
    chapter: chapter.name, taxableValue: taxable,
    cgstRate: halfRate, cgstAmt, sgstRate: halfRate, sgstAmt,
    igstRate: isInterState ? gstRate : 0, igstAmt, totalGst,
    totalValue: taxable + totalGst,
    status, warehouse: wh.name,
    itcClaimed: status === "ITC Claimed" || randInt(1, 100) > 60,
    itcAmount: (status === "ITC Claimed" || randInt(1, 100) > 60) ? totalGst : 0,
  })
}

const ewayBills: EWayBill[] = []
for (let i = 0; i < 200; i++) {
  const inv = pick(invoices)
  const days = randInt(1, 20)
  const status = pick([...EWAY_STATUSES])
  ewayBills.push({
    id: `EWB-${String(1530001 + i).padStart(7, "0")}`,
    ewayNo: `31${String(randInt(100000000000, 999999999999))}`,
    invoiceId: inv.invoiceNo, date: `2026-07-${String(randInt(1, 25)).padStart(2, "0")}`,
    validUntil: `2026-${String(randInt(7, 8)).padStart(2, "0")}-${String(randInt(1, 28)).padStart(2, "0")}`,
    from: pick(WAREHOUSES).name, to: pick(["Distribution Hub - Pune", "Retail DC - Noida", "Factory - Gurgaon", "CFS - Chennai", "Customer Site - Bangalore", "Export Terminal - Mundra"]),
    transportMode: pick(TRANSPORT_MODES),
    vehicleNo: status !== "Pending" ? `${pick(["MH", "DL", "KA", "TN", "TS", "GJ"])}${String(randInt(10, 99))}${pick(["AB", "CD", "EF", "GH", "JK", "LM", "NO", "PQ"])}${String(randInt(1000, 9999))}` : "TBD",
    distance: randInt(50, 2500),
    goods: inv.chapter, hsCode: inv.hsCode, taxableValue: inv.taxableValue,
    status, supplier: inv.supplier,
    extended: status === "Extended",
    extensions: status === "Extended" ? randInt(1, 3) : 0,
    warehouse: inv.warehouse,
  })
}

const customsEntries: CustomsEntry[] = []
for (let i = 0; i < 150; i++) {
  const sup = pick(SUPPLIERS)
  const chapter = pick(HS_CHAPTERS)
  const assessable = randInt(100000, 10000000)
  const customsDuty = Math.round(assessable * chapter.duty / 100)
  const igst = Math.round(assessable * chapter.gst / 100)
  const eduCess = Math.round((customsDuty + igst) * 0.02)
  const socCess = Math.round((customsDuty + igst) * 0.01)
  const totalDuty = customsDuty + igst + eduCess + socCess
  const status = pick([...CUSTOMS_STATUSES])
  customsEntries.push({
    id: `CUST-${String(1530001 + i).padStart(7, "0")}`,
    beNo: `BE/${2026}/${String(randInt(10000, 99999))}`,
    type: pick(["Import", "Import", "Export"]),
    port: pick(INDIAN_PORTS),
    date: `2026-07-${String(randInt(1, 28)).padStart(2, "0")}`,
    importer: sup.name, gstin: sup.gstin,
    hsCode: `${chapter.code}${String(randInt(10, 99))}.${String(randInt(10, 99))}.${String(randInt(10, 99))}`,
    chapter: chapter.name,
    country: pick(["China", "USA", "Germany", "Japan", "South Korea", "UAE", "UK", "Singapore", "Thailand", "Vietnam"]),
    assessableValue: assessable, customsDuty, igst, educationCess: eduCess, socialCess: socCess,
    totalDuty, status, warehouse: pick(WAREHOUSES).name,
    documentType: pick([...DOCUMENT_TYPES]),
    agent: pick(["CBIC Licensed CHA - Patel Logistics", "V.O. Customs Brokers Pvt Ltd", "Seaways Freight Forwarders", "Allcargo Customs Agents", "Container Corporation CHA Division"]),
  })
}

const monthlyGST = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  cgst: randInt(800000, 4500000),
  sgst: randInt(800000, 4500000),
  igst: randInt(200000, 3000000),
  itc: randInt(500000, 3500000),
}))

const hsDistribution = HS_CHAPTERS.map(ch => ({
  name: `${ch.code}`,
  fullName: ch.name,
  count: invoices.filter(it => it.hsCode.startsWith(ch.code)).length,
  dutyRate: ch.duty,
}))

const gstByWarehouse = WAREHOUSES.map(wh => {
  const whInv = invoices.filter(it => it.warehouse === wh.name)
  return {
    name: wh.name.split(" ")[0],
    filed: whInv.filter(it => it.status === "Filed" || it.status === "Reconciled").length,
    pending: whInv.filter(it => it.status === "Pending").length,
    itcClaimed: whInv.filter(it => it.itcClaimed).length,
    total: whInv.length,
  }
})

const customsTrend = Array.from({ length: 6 }, (_, i) => ({
  month: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"][i],
  imports: randInt(15, 40),
  exports: randInt(5, 20),
  dutyCollected: randInt(2000000, 12000000),
  avgClearanceDays: randFloat(2, 7, 1),
}))

const itcUtilization = Array.from({ length: 6 }, (_, i) => ({
  month: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"][i],
  itcAvailable: randInt(3000000, 8000000),
  itcClaimed: randInt(1500000, 6000000),
  itcLapsed: randInt(100000, 800000),
}))

const STATUS_COLORS: Record<string, string> = {
  Filed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Under Review": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  Reconciled: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "ITC Claimed": "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  Error: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  Active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  Expired: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  Cancelled: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  Extended: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "In Transit": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  Delivered: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  Cleared: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Under Examination": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Pending Assessment": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  Hold: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  Assessed: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Released: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
}

const PORT_Radar = [
  { subject: "JNPT", value: randInt(70, 98) },
  { subject: "Mumbai", value: randInt(55, 85) },
  { subject: "Chennai", value: randInt(60, 90) },
  { subject: "Kolkata", value: randInt(40, 75) },
  { subject: "Cochin", value: randInt(35, 70) },
  { subject: "Mundra", value: randInt(50, 85) },
]

export default function CustomsDutyGstView() {
  const [activeTab, setActiveTab] = useState(0)
  const [statusFilter, setStatusFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<GSTInvoice | null>(null)
  const [selectedEway, setSelectedEway] = useState<EWayBill | null>(null)
  const [drawerMode, setDrawerMode] = useState<"invoice" | "eway" | "customs">("invoice")
  const [selectedCustoms, setSelectedCustoms] = useState<CustomsEntry | null>(null)
  const tabs = ["Dashboard", "GST Register", "E-Way Bills", "HS Code Classification", "Customs & Import/Export"]

  const filteredInvoices = useMemo(() => {
    let data = [...invoices]
    if (statusFilter !== "All") data = data.filter(it => it.status === statusFilter)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      data = data.filter(it =>
        it.id.toLowerCase().includes(q) || it.invoiceNo.toLowerCase().includes(q) ||
        it.supplier.toLowerCase().includes(q) || it.gstin.toLowerCase().includes(q) ||
        it.hsCode.toLowerCase().includes(q) || it.warehouse.toLowerCase().includes(q)
      )
    }
    return data
  }, [statusFilter, searchQuery])

  const filteredEway = useMemo(() => {
    let data = [...ewayBills]
    if (statusFilter !== "All") data = data.filter(it => it.status === statusFilter)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      data = data.filter(it =>
        it.id.toLowerCase().includes(q) || it.ewayNo.toLowerCase().includes(q) ||
        it.supplier.toLowerCase().includes(q) || it.vehicleNo.toLowerCase().includes(q) ||
        it.goods.toLowerCase().includes(q)
      )
    }
    return data
  }, [statusFilter, searchQuery])

  const filteredCustoms = useMemo(() => {
    let data = [...customsEntries]
    if (statusFilter !== "All") data = data.filter(it => it.status === statusFilter)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      data = data.filter(it =>
        it.id.toLowerCase().includes(q) || it.beNo.toLowerCase().includes(q) ||
        it.importer.toLowerCase().includes(q) || it.port.toLowerCase().includes(q) ||
        it.hsCode.toLowerCase().includes(q) || it.country.toLowerCase().includes(q)
      )
    }
    return data
  }, [statusFilter, searchQuery])

  const totalGSTCollected = invoices.reduce((s, it) => s + it.totalGst, 0)
  const totalITC = invoices.reduce((s, it) => s + it.itcAmount, 0)
  const pendingFiling = invoices.filter(it => it.status === "Pending").length
  const activeEway = ewayBills.filter(it => it.status === "Active" || it.status === "In Transit").length
  const customsPending = customsEntries.filter(it => it.status === "Under Examination" || it.status === "Pending Assessment" || it.status === "Hold").length
  const totalDutyCollected = customsEntries.reduce((s, it) => s + it.totalDuty, 0)

  const invStatusCounts: Record<string, number> = {
    All: invoices.length,
    Filed: invoices.filter(it => it.status === "Filed").length,
    Pending: invoices.filter(it => it.status === "Pending").length,
    Reconciled: invoices.filter(it => it.status === "Reconciled").length,
    "ITC Claimed": invoices.filter(it => it.status === "ITC Claimed").length,
    Error: invoices.filter(it => it.status === "Error").length,
  }

  const ewayStatusCounts: Record<string, number> = {
    All: ewayBills.length,
    Active: ewayBills.filter(it => it.status === "Active").length,
    Expired: ewayBills.filter(it => it.status === "Expired").length,
    "In Transit": ewayBills.filter(it => it.status === "In Transit").length,
    Delivered: ewayBills.filter(it => it.status === "Delivered").length,
    Cancelled: ewayBills.filter(it => it.status === "Cancelled").length,
  }

  const customsStatusCounts: Record<string, number> = {
    All: customsEntries.length,
    Cleared: customsEntries.filter(it => it.status === "Cleared").length,
    "Under Examination": customsEntries.filter(it => it.status === "Under Examination").length,
    "Pending Assessment": customsEntries.filter(it => it.status === "Pending Assessment").length,
    Hold: customsEntries.filter(it => it.status === "Hold").length,
    Released: customsEntries.filter(it => it.status === "Released").length,
  }

  function formatINR(amount: number): string {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`
    return `₹${amount.toLocaleString("en-IN")}`
  }

  const openDrawerInvoice = (it: GSTInvoice) => { setSelectedInvoice(it); setDrawerMode("invoice"); setDrawerOpen(true) }
  const openDrawerEway = (it: EWayBill) => { setSelectedEway(it); setDrawerMode("eway"); setDrawerOpen(true) }
  const openDrawerCustoms = (it: CustomsEntry) => { setSelectedCustoms(it); setDrawerMode("customs"); setDrawerOpen(true) }

  function handleTabChange(idx: number) {
    setActiveTab(idx)
    setStatusFilter("All")
    setSearchQuery("")
  }

  function renderDashboard() {
    return (
      <Fragment>
        <div className="cdg-kpi-grid">
          {[
            { label: "Total GST Collected", value: formatINR(totalGSTCollected), icon: IndianRupee, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-950/40", sub: `across ${WAREHOUSES.length} warehouses` },
            { label: "ITC Claimed", value: formatINR(totalITC), icon: Landmark, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40", sub: `${invoices.filter(it => it.itcClaimed).length} invoices` },
            { label: "Pending Filing", value: String(pendingFiling), icon: Clock, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40", sub: "awaiting GST return" },
            { label: "Active E-Way Bills", value: String(activeEway), icon: Truck, color: "text-sky-600", bg: "bg-sky-50 dark:bg-sky-950/40", sub: "in transit" },
            { label: "Customs Pending", value: String(customsPending), icon: Ship, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/40", sub: "under examination / hold" },
            { label: "Total Duty Collected", value: formatINR(totalDutyCollected), icon: Globe, color: "text-teal-600", bg: "bg-teal-50 dark:bg-teal-950/40", sub: "customs + cess" },
          ].map(kpi => (
            <Card key={kpi.label} className="cdg-kpi-card border-slate-100 dark:border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="cdg-label">{kpi.label}</p>
                    <p className={`cdg-value ${kpi.color}`}>{kpi.value}</p>
                    <p className="cdg-sub">{kpi.sub}</p>
                  </div>
                  <div className={`${kpi.bg} cdg-icon-wrap`}>
                    <kpi.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="cdg-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="cdg-title"><IndianRupee className="h-4 w-4 text-indigo-500" />Monthly GST Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={monthlyGST}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${(v / 100000).toFixed(0)}L`} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => formatINR(v)} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Area type="monotone" dataKey="cgst" stackId="a" fill="#6366f1" stroke="#6366f1" name="CGST" />
                  <Area type="monotone" dataKey="sgst" stackId="a" fill="#10b981" stroke="#10b981" name="SGST" />
                  <Area type="monotone" dataKey="igst" stackId="a" fill="#f59e0b" stroke="#f59e0b" name="IGST" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="cdg-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="cdg-title"><FileText className="h-4 w-4 text-teal-500" />E-Way Bill Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={Object.entries({
                    Active: ewayBills.filter(e => e.status === "Active").length,
                    "In Transit": ewayBills.filter(e => e.status === "In Transit").length,
                    Delivered: ewayBills.filter(e => e.status === "Delivered").length,
                    Expired: ewayBills.filter(e => e.status === "Expired").length,
                    Cancelled: ewayBills.filter(e => e.status === "Cancelled").length,
                    Extended: ewayBills.filter(e => e.status === "Extended").length,
                  }).map(([name, value]) => ({ name, value }))} cx="50%" cy="50%" innerRadius={45} outerRadius={85} paddingAngle={2} dataKey="value" label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ strokeWidth: 1 }}>
                    {["#10b981", "#3b82f6", "#22c55e", "#ef4444", "#6b7280", "#8b5cf6"].map((c, i) => <Cell key={i} fill={c} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="cdg-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="cdg-title"><Landmark className="h-4 w-4 text-emerald-500" />ITC Utilization Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <ComposedChart data={itcUtilization}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${(v / 100000).toFixed(0)}L`} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => formatINR(v)} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="itcAvailable" fill="#6366f1" name="ITC Available" opacity={0.6} />
                  <Bar dataKey="itcClaimed" fill="#10b981" name="ITC Claimed" />
                  <Line type="monotone" dataKey="itcLapsed" stroke="#ef4444" strokeWidth={2} dot={false} name="ITC Lapsed" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="cdg-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="cdg-title"><Ship className="h-4 w-4 text-sky-500" />Port Performance Radar</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={PORT_Radar}>
                  <PolarGrid className="stroke-gray-200 dark:stroke-gray-700" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9 }} />
                  <PolarRadiusAxis tick={{ fontSize: 8 }} domain={[0, 100]} />
                  <Radar name="Clearance Score" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="cdg-alerts-section">
          <h3 className="cdg-section-heading"><AlertTriangle className="h-4 w-4 text-amber-500" />Compliance Alerts & Notifications</h3>
          <div className="cdg-alerts-grid">
            {[
              { icon: Clock, color: "text-red-600 bg-red-50 dark:bg-red-950/40", title: "GST Return Due", desc: "GSTR-3B filing deadline: 20-Aug-2026", time: "12 days remaining" },
              { icon: AlertTriangle, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40", title: `${ewayBills.filter(e => e.status === "Expired").length} E-Way Bills Expired`, desc: "Extension or cancellation required", time: "Action needed" },
              { icon: Ship, color: "text-sky-600 bg-sky-50 dark:bg-sky-950/40", title: `${customsPending} BOEs Pending`, desc: "Customs examination in progress at JNPT", time: "Avg 3 days clearance" },
              { icon: FileCheck, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40", title: "GSTR-2A Mismatch", desc: `${randInt(5, 20)} invoices mismatch with supplier filings`, time: "Review required" },
              { icon: Globe, color: "text-violet-600 bg-violet-950/40 dark:bg-violet-950/40", title: "Anti-Dumping Duty Alert", desc: "New ADD notification on Steel imports from China", time: "Effective 01-Aug" },
              { icon: Calculator, color: "text-teal-600 bg-teal-50 dark:bg-teal-950/40", title: "ITC Reversal Required", desc: `${randInt(2, 8)} invoices flagged for ITC reversal under Sec 43(9)`, time: "This month" },
            ].map(alert => (
              <div key={alert.title} className="cdg-alert-card">
                <div className="flex items-start gap-3">
                  <div className={`${alert.color} cdg-alert-icon`}>
                    <alert.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="cdg-alert-title">{alert.title}</p>
                    <p className="cdg-alert-desc">{alert.desc}</p>
                    <p className="cdg-alert-time">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Fragment>
    )
  }

  function renderGSTRegister() {
    return (
      <Fragment>
        <div className="flex flex-wrap gap-2 items-center mb-4">
          <div className="cdg-filter-bar">
            {Object.entries(invStatusCounts).map(([s, c]) => (
              <Badge key={s} variant={statusFilter === s ? "default" : "outline"} className={`cdg-filter-badge ${statusFilter === s ? "cdg-filter-active" : ""}`} onClick={() => setStatusFilter(s)}>
                {s} ({c})
              </Badge>
            ))}
          </div>
          <div className="cdg-search-wrap">
            <Search className="h-3.5 w-3.5 text-gray-400" />
            <input className="cdg-search-input" placeholder="Search invoices, GSTIN, HS code..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>
        <Card className="cdg-table-card border-slate-100 dark:border-slate-800">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="cdg-table">
                <thead>
                  <tr>
                    <th>Invoice</th><th>Supplier / GSTIN</th><th>Date</th><th>HS Code</th>
                    <th>Taxable (₹)</th><th>CGST</th><th>SGST</th><th>IGST</th>
                    <th>Total GST</th><th>Status</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.slice(0, 30).map(inv => (
                    <tr key={inv.id} className="cdg-table-row">
                      <td><span className="cdg-id">{inv.invoiceNo}</span></td>
                      <td>
                        <p className="text-xs font-medium text-slate-900 dark:text-slate-100">{inv.supplier}</p>
                        <p className="text-[10px] text-slate-500">{inv.gstin.slice(0, 15)}...</p>
                      </td>
                      <td className="text-xs text-slate-600 dark:text-slate-400">{inv.date}</td>
                      <td><Badge className="cdg-hs-badge">{inv.hsCode}</Badge></td>
                      <td className="cdg-amount text-right">{formatINR(inv.taxableValue)}</td>
                      <td className="cdg-amount-indigo text-right">{inv.cgstAmt > 0 ? `${inv.cgstRate}%` : "-"}</td>
                      <td className="cdg-amount-emerald text-right">{inv.sgstAmt > 0 ? `${inv.sgstRate}%` : "-"}</td>
                      <td className="cdg-amount-amber text-right">{inv.igstAmt > 0 ? `${inv.igstRate}%` : "-"}</td>
                      <td className="cdg-amount font-semibold text-right">{formatINR(inv.totalGst)}</td>
                      <td><span className={`cdg-status-badge ${STATUS_COLORS[inv.status] || ""}`}>{inv.status}</span></td>
                      <td><Button size="sm" variant="ghost" className="cdg-action-btn" onClick={() => openDrawerInvoice(inv)}><Eye className="h-3.5 w-3.5" /></Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <p className="cdg-footer-count">Showing {Math.min(30, filteredInvoices.length)} of {filteredInvoices.length} invoices</p>
      </Fragment>
    )
  }

  function renderEwayBills() {
    return (
      <Fragment>
        <div className="flex flex-wrap gap-2 items-center mb-4">
          <div className="cdg-filter-bar">
            {Object.entries(ewayStatusCounts).map(([s, c]) => (
              <Badge key={s} variant={statusFilter === s ? "default" : "outline"} className={`cdg-filter-badge ${statusFilter === s ? "cdg-filter-active" : ""}`} onClick={() => setStatusFilter(s)}>
                {s} ({c})
              </Badge>
            ))}
          </div>
          <div className="cdg-search-wrap">
            <Search className="h-3.5 w-3.5 text-gray-400" />
            <input className="cdg-search-input" placeholder="Search e-way bills, vehicle, supplier..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>
        <Card className="cdg-table-card border-slate-100 dark:border-slate-800">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="cdg-table">
                <thead>
                  <tr>
                    <th>E-Way No.</th><th>Goods / HS Code</th><th>From → To</th><th>Transport</th>
                    <th>Distance</th><th>Valid Until</th><th>Status</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEway.slice(0, 30).map(ew => (
                    <tr key={ew.id} className="cdg-table-row">
                      <td>
                        <span className="cdg-id">{ew.ewayNo.slice(0, 16)}...</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">{ew.invoiceId}</p>
                      </td>
                      <td>
                        <p className="text-xs font-medium text-slate-900 dark:text-slate-100">{ew.goods}</p>
                        <Badge className="cdg-hs-badge mt-0.5">{ew.hsCode}</Badge>
                      </td>
                      <td>
                        <p className="text-[10px] text-slate-600 dark:text-slate-400">{ew.from.split(" ")[0]}</p>
                        <p className="text-[10px]"><ArrowRightLeft className="h-2.5 w-2.5 inline text-slate-400" /></p>
                        <p className="text-[10px] text-slate-600 dark:text-slate-400">{ew.to.split(" - ")[1] || ew.to.split(" ")[0]}</p>
                      </td>
                      <td>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{ew.transportMode}</p>
                        <p className="text-[10px] text-slate-500">{ew.vehicleNo}</p>
                      </td>
                      <td className="text-xs text-slate-600 dark:text-slate-400">{ew.distance} km</td>
                      <td className="text-xs text-slate-600 dark:text-slate-400">{ew.validUntil}</td>
                      <td>
                        <span className={`cdg-status-badge ${STATUS_COLORS[ew.status] || ""}`}>{ew.status}</span>
                        {ew.extended && <Badge className="cdg-ext-badge ml-1">{ew.extensions}x</Badge>}
                      </td>
                      <td><Button size="sm" variant="ghost" className="cdg-action-btn" onClick={() => openDrawerEway(ew)}><Eye className="h-3.5 w-3.5" /></Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <p className="cdg-footer-count">Showing {Math.min(30, filteredEway.length)} of {filteredEway.length} e-way bills</p>
      </Fragment>
    )
  }

  function renderHSClassification() {
    return (
      <Fragment>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="cdg-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="cdg-title"><Barcode className="h-4 w-4 text-indigo-500" />Invoice Distribution by HS Chapter</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={hsDistribution.filter(d => d.count > 0)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={40} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} fill="#6366f1" name="Invoices" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="cdg-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="cdg-title"><Calculator className="h-4 w-4 text-teal-500" />GST Rate by HS Chapter</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={HS_CHAPTERS.map(c => ({ name: `${c.code}`, gst: c.gst, duty: c.duty }))}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} unit="%" />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="gst" fill="#10b981" name="GST Rate %" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="duty" fill="#f59e0b" name="Customs Duty %" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="cdg-table-card border-slate-100 dark:border-slate-800 mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="cdg-title"><Stamp className="h-4 w-4 text-amber-500" />HS Code Directory — Active Chapters</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="cdg-table">
                <thead>
                  <tr><th>Chapter</th><th>Description</th><th>Customs Duty</th><th>GST Rate</th><th>Invoices</th><th>Total Taxable</th></tr>
                </thead>
                <tbody>
                  {HS_CHAPTERS.map(ch => {
                    const chInv = invoices.filter(it => it.hsCode.startsWith(ch.code))
                    const chTaxable = chInv.reduce((s, it) => s + it.taxableValue, 0)
                    return (
                      <tr key={ch.code} className="cdg-table-row">
                        <td><Badge className="cdg-ch-badge">{ch.code}</Badge></td>
                        <td className="text-xs font-medium text-slate-900 dark:text-slate-100">{ch.name}</td>
                        <td><Badge className="cdg-duty-badge">{ch.duty}%</Badge></td>
                        <td><Badge className="cdg-gst-rate-badge">{ch.gst}%</Badge></td>
                        <td className="text-xs text-slate-600 dark:text-slate-400">{chInv.length}</td>
                        <td className="cdg-amount text-right">{formatINR(chTaxable)}</td>
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

  function renderCustomsImportExport() {
    return (
      <Fragment>
        <div className="flex flex-wrap gap-2 items-center mb-4">
          <div className="cdg-filter-bar">
            {Object.entries(customsStatusCounts).map(([s, c]) => (
              <Badge key={s} variant={statusFilter === s ? "default" : "outline"} className={`cdg-filter-badge ${statusFilter === s ? "cdg-filter-active" : ""}`} onClick={() => setStatusFilter(s)}>
                {s} ({c})
              </Badge>
            ))}
          </div>
          <div className="cdg-search-wrap">
            <Search className="h-3.5 w-3.5 text-gray-400" />
            <input className="cdg-search-input" placeholder="Search BE, importer, port, country..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-4">
          <Card className="cdg-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="cdg-title"><Globe className="h-4 w-4 text-sky-500" />Import vs Export Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <ComposedChart data={customsTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="imports" fill="#3b82f6" name="Imports" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="exports" fill="#10b981" name="Exports" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="avgClearanceDays" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="Avg Days" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="cdg-chart-card border-slate-100 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="cdg-title"><IndianRupee className="h-4 w-4 text-emerald-500" />Duty Collected Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={customsTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${(v / 100000).toFixed(0)}L`} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => formatINR(v)} />
                  <Area type="monotone" dataKey="dutyCollected" fill="#10b981" stroke="#10b981" name="Duty Collected" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="cdg-table-card border-slate-100 dark:border-slate-800">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="cdg-table">
                <thead>
                  <tr>
                    <th>BE No.</th><th>Type</th><th>Importer</th><th>Port</th><th>Country</th>
                    <th>HS Code</th><th>Assessable</th><th>Customs Duty</th><th>IGST</th><th>Total Duty</th><th>Status</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustoms.slice(0, 25).map(ce => (
                    <tr key={ce.id} className="cdg-table-row">
                      <td><span className="cdg-id">{ce.beNo}</span></td>
                      <td><Badge className={ce.type === "Import" ? "cdg-import-badge" : "cdg-export-badge"}>{ce.type}</Badge></td>
                      <td>
                        <p className="text-xs font-medium text-slate-900 dark:text-slate-100">{ce.importer}</p>
                        <p className="text-[10px] text-slate-500">{ce.gstin.slice(0, 15)}...</p>
                      </td>
                      <td className="text-[10px] text-slate-600 dark:text-slate-400 max-w-[120px] truncate">{ce.port.split("(")[0]}</td>
                      <td className="text-xs text-slate-600 dark:text-slate-400">{ce.country}</td>
                      <td><Badge className="cdg-hs-badge">{ce.hsCode}</Badge></td>
                      <td className="cdg-amount text-right">{formatINR(ce.assessableValue)}</td>
                      <td className="cdg-amount-amber text-right">{formatINR(ce.customsDuty)}</td>
                      <td className="cdg-amount-indigo text-right">{formatINR(ce.igst)}</td>
                      <td className="cdg-amount font-semibold text-right">{formatINR(ce.totalDuty)}</td>
                      <td><span className={`cdg-status-badge ${STATUS_COLORS[ce.status] || ""}`}>{ce.status}</span></td>
                      <td><Button size="sm" variant="ghost" className="cdg-action-btn" onClick={() => openDrawerCustoms(ce)}><Eye className="h-3.5 w-3.5" /></Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <p className="cdg-footer-count">Showing {Math.min(25, filteredCustoms.length)} of {filteredCustoms.length} customs entries</p>
      </Fragment>
    )
  }

  function renderDrawer() {
    if (drawerMode === "invoice" && selectedInvoice) {
      const inv = selectedInvoice
      return (
        <div className="cdg-drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="cdg-drawer" onClick={e => e.stopPropagation()}>
            <div className="cdg-drawer-header cdg-drawer-header-gst">
              <div className="flex items-center gap-3">
                <div className="cdg-drawer-icon"><Receipt className="h-5 w-5" /></div>
                <div>
                  <h3 className="cdg-drawer-title">{inv.invoiceNo}</h3>
                  <p className="cdg-drawer-subtitle">{inv.id} | {inv.date}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="cdg-drawer-close" onClick={() => setDrawerOpen(false)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="cdg-drawer-body">
              <div className="cdg-drawer-status-row">
                <span className={`cdg-status-badge ${STATUS_COLORS[inv.status] || ""}`}>{inv.status}</span>
                <Badge className={inv.itcClaimed ? "cdg-itc-claimed-badge" : "cdg-itc-pending-badge"}>
                  {inv.itcClaimed ? "ITC Claimed" : "ITC Pending"}
                </Badge>
              </div>
              <div className="cdg-detail-grid">
                <div className="cdg-detail-item"><p className="cdg-detail-label">Supplier</p><p className="cdg-detail-value">{inv.supplier}</p></div>
                <div className="cdg-detail-item"><p className="cdg-detail-label">GSTIN</p><p className="cdg-detail-value text-[11px]">{inv.gstin}</p></div>
                <div className="cdg-detail-item"><p className="cdg-detail-label">HS Code</p><p className="cdg-detail-value">{inv.hsCode}</p></div>
                <div className="cdg-detail-item"><p className="cdg-detail-label">Chapter</p><p className="cdg-detail-value">{inv.chapter}</p></div>
                <div className="cdg-detail-item"><p className="cdg-detail-label">Warehouse</p><p className="cdg-detail-value">{inv.warehouse}</p></div>
                <div className="cdg-detail-item"><p className="cdg-detail-label">Taxable Value</p><p className="cdg-detail-value font-semibold">{formatINR(inv.taxableValue)}</p></div>
              </div>
              <div className="cdg-duty-breakdown">
                <h4 className="cdg-duty-title">GST Breakdown</h4>
                <div className="cdg-duty-rows">
                  {inv.cgstAmt > 0 && <div className="cdg-duty-row"><span>CGST @ {inv.cgstRate}%</span><span className="cdg-duty-indigo">{formatINR(inv.cgstAmt)}</span></div>}
                  {inv.sgstAmt > 0 && <div className="cdg-duty-row"><span>SGST @ {inv.sgstRate}%</span><span className="cdg-duty-emerald">{formatINR(inv.sgstAmt)}</span></div>}
                  {inv.igstAmt > 0 && <div className="cdg-duty-row"><span>IGST @ {inv.igstRate}%</span><span className="cdg-duty-amber">{formatINR(inv.igstAmt)}</span></div>}
                  <div className="cdg-duty-row cdg-duty-total"><span>Total GST</span><span className="font-semibold">{formatINR(inv.totalGst)}</span></div>
                  <div className="cdg-duty-row cdg-duty-grand-total"><span>Invoice Total</span><span className="font-bold">{formatINR(inv.totalValue)}</span></div>
                </div>
              </div>
              <div className="cdg-drawer-actions">
                <Button size="sm" className="cdg-btn-primary"><FileCheck className="h-3.5 w-3.5 mr-1" /> File GSTR</Button>
                <Button size="sm" variant="outline" className="cdg-btn-outline"><Copy className="h-3.5 w-3.5 mr-1" /> Copy GSTIN</Button>
                <Button size="sm" variant="outline" className="cdg-btn-outline"><Download className="h-3.5 w-3.5 mr-1" /> Download</Button>
              </div>
            </div>
          </div>
        </div>
      )
    }
    if (drawerMode === "eway" && selectedEway) {
      const ew = selectedEway
      return (
        <div className="cdg-drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="cdg-drawer" onClick={e => e.stopPropagation()}>
            <div className="cdg-drawer-header cdg-drawer-header-eway">
              <div className="flex items-center gap-3">
                <div className="cdg-drawer-icon"><Truck className="h-5 w-5" /></div>
                <div>
                  <h3 className="cdg-drawer-title">E-Way Bill</h3>
                  <p className="cdg-drawer-subtitle">{ew.ewayNo.slice(0, 20)}...</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="cdg-drawer-close" onClick={() => setDrawerOpen(false)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="cdg-drawer-body">
              <div className="cdg-drawer-status-row">
                <span className={`cdg-status-badge ${STATUS_COLORS[ew.status] || ""}`}>{ew.status}</span>
                {ew.extended && <Badge className="cdg-ext-badge">{ew.extensions} Extensions</Badge>}
              </div>
              <div className="cdg-detail-grid">
                <div className="cdg-detail-item"><p className="cdg-detail-label">Invoice</p><p className="cdg-detail-value">{ew.invoiceId}</p></div>
                <div className="cdg-detail-item"><p className="cdg-detail-label">Supplier</p><p className="cdg-detail-value">{ew.supplier}</p></div>
                <div className="cdg-detail-item"><p className="cdg-detail-label">Goods</p><p className="cdg-detail-value">{ew.goods}</p></div>
                <div className="cdg-detail-item"><p className="cdg-detail-label">HS Code</p><p className="cdg-detail-value">{ew.hsCode}</p></div>
                <div className="cdg-detail-item"><p className="cdg-detail-label">Transport</p><p className="cdg-detail-value">{ew.transportMode} | {ew.vehicleNo}</p></div>
                <div className="cdg-detail-item"><p className="cdg-detail-label">Distance</p><p className="cdg-detail-value">{ew.distance} km</p></div>
                <div className="cdg-detail-item"><p className="cdg-detail-label">From</p><p className="cdg-detail-value">{ew.from}</p></div>
                <div className="cdg-detail-item"><p className="cdg-detail-label">To</p><p className="cdg-detail-value">{ew.to}</p></div>
                <div className="cdg-detail-item"><p className="cdg-detail-label">Created</p><p className="cdg-detail-value">{ew.date}</p></div>
                <div className="cdg-detail-item"><p className="cdg-detail-label">Valid Until</p><p className="cdg-detail-value">{ew.validUntil}</p></div>
                <div className="cdg-detail-item"><p className="cdg-detail-label">Warehouse</p><p className="cdg-detail-value">{ew.warehouse}</p></div>
                <div className="cdg-detail-item"><p className="cdg-detail-label">Taxable</p><p className="cdg-detail-value font-semibold">{formatINR(ew.taxableValue)}</p></div>
              </div>
              <div className="cdg-drawer-actions">
                <Button size="sm" className="cdg-btn-primary"><RefreshCw className="h-3.5 w-3.5 mr-1" /> Extend Validity</Button>
                <Button size="sm" variant="outline" className="cdg-btn-outline"><ExternalLink className="h-3.5 w-3.5 mr-1" /> View on NIC</Button>
                <Button size="sm" variant="outline" className="cdg-btn-outline"><Copy className="h-3.5 w-3.5 mr-1" /> Copy No.</Button>
              </div>
            </div>
          </div>
        </div>
      )
    }
    if (drawerMode === "customs" && selectedCustoms) {
      const ce = selectedCustoms
      return (
        <div className="cdg-drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="cdg-drawer" onClick={e => e.stopPropagation()}>
            <div className="cdg-drawer-header cdg-drawer-header-customs">
              <div className="flex items-center gap-3">
                <div className="cdg-drawer-icon"><Globe className="h-5 w-5" /></div>
                <div>
                  <h3 className="cdg-drawer-title">{ce.beNo}</h3>
                  <p className="cdg-drawer-subtitle">{ce.id} | {ce.type} | {ce.date}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="cdg-drawer-close" onClick={() => setDrawerOpen(false)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="cdg-drawer-body">
              <div className="cdg-drawer-status-row">
                <span className={`cdg-status-badge ${STATUS_COLORS[ce.status] || ""}`}>{ce.status}</span>
                <Badge className={ce.type === "Import" ? "cdg-import-badge" : "cdg-export-badge"}>{ce.type}</Badge>
              </div>
              <div className="cdg-detail-grid">
                <div className="cdg-detail-item"><p className="cdg-detail-label">Importer</p><p className="cdg-detail-value">{ce.importer}</p></div>
                <div className="cdg-detail-item"><p className="cdg-detail-label">GSTIN</p><p className="cdg-detail-value text-[11px]">{ce.gstin}</p></div>
                <div className="cdg-detail-item"><p className="cdg-detail-label">Port</p><p className="cdg-detail-value">{ce.port}</p></div>
                <div className="cdg-detail-item"><p className="cdg-detail-label">Country</p><p className="cdg-detail-value">{ce.country}</p></div>
                <div className="cdg-detail-item"><p className="cdg-detail-label">HS Code</p><p className="cdg-detail-value">{ce.hsCode}</p></div>
                <div className="cdg-detail-item"><p className="cdg-detail-label">Chapter</p><p className="cdg-detail-value">{ce.chapter}</p></div>
                <div className="cdg-detail-item"><p className="cdg-detail-label">Document</p><p className="cdg-detail-value">{ce.documentType}</p></div>
                <div className="cdg-detail-item"><p className="cdg-detail-label">CHA Agent</p><p className="cdg-detail-value text-[11px]">{ce.agent}</p></div>
                <div className="cdg-detail-item"><p className="cdg-detail-label">Warehouse</p><p className="cdg-detail-value">{ce.warehouse}</p></div>
                <div className="cdg-detail-item"><p className="cdg-detail-label">Assessable Value</p><p className="cdg-detail-value font-semibold">{formatINR(ce.assessableValue)}</p></div>
              </div>
              <div className="cdg-duty-breakdown">
                <h4 className="cdg-duty-title">Duty Breakdown</h4>
                <div className="cdg-duty-rows">
                  <div className="cdg-duty-row"><span>Basic Customs Duty</span><span className="cdg-duty-amber">{formatINR(ce.customsDuty)}</span></div>
                  <div className="cdg-duty-row"><span>IGST</span><span className="cdg-duty-indigo">{formatINR(ce.igst)}</span></div>
                  <div className="cdg-duty-row"><span>Education Cess @ 2%</span><span className="cdg-duty-emerald">{formatINR(ce.educationCess)}</span></div>
                  <div className="cdg-duty-row"><span>Social Welfare Cess @ 1%</span><span className="cdg-duty-teal">{formatINR(ce.socialCess)}</span></div>
                  <div className="cdg-duty-row cdg-duty-total"><span>Total Duty Payable</span><span className="font-semibold">{formatINR(ce.totalDuty)}</span></div>
                </div>
              </div>
              <div className="cdg-drawer-actions">
                <Button size="sm" className="cdg-btn-primary"><FileCheck className="h-3.5 w-3.5 mr-1" /> Assess & Release</Button>
                <Button size="sm" variant="outline" className="cdg-btn-outline"><Download className="h-3.5 w-3.5 mr-1" /> BOE Copy</Button>
                <Button size="sm" variant="outline" className="cdg-btn-outline"><ExternalLink className="h-3.5 w-3.5 mr-1" /> ICEGATE</Button>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="cdg-container space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <div>
          <h1 className="cdg-page-title"><Landmark className="h-5 w-5 text-indigo-500" />Customs, Duty & GST Compliance</h1>
          <p className="cdg-page-subtitle">GST filing, E-Way Bills, HS classification & customs duty management across India</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="cdg-btn-primary"><Download className="h-3.5 w-3.5 mr-1" /> Export GSTR</Button>
          <Button size="sm" variant="outline" className="cdg-btn-outline"><RefreshCw className="h-3.5 w-3.5 mr-1" /> Sync NIC</Button>
        </div>
      </div>

      <div className="cdg-tabs-bar">
        {tabs.map((tab, idx) => (
          <button key={tab} className={`cdg-tab ${activeTab === idx ? "cdg-tab-active" : ""}`} onClick={() => handleTabChange(idx)}>
            <span className="cdg-tab-label">{tab}</span>
            {activeTab === idx && <span className="cdg-tab-indicator" />}
          </button>
        ))}
      </div>

      {activeTab === 0 && renderDashboard()}
      {activeTab === 1 && renderGSTRegister()}
      {activeTab === 2 && renderEwayBills()}
      {activeTab === 3 && renderHSClassification()}
      {activeTab === 4 && renderCustomsImportExport()}

      {drawerOpen && renderDrawer()}
    </div>
  )
}
