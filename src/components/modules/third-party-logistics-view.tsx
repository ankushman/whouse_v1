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
  Handshake, Search, CheckCircle2, AlertTriangle, BarChart3,
  TrendingUp, Eye, X, Clock, Package, ArrowRight,
  ChevronRight, MapPin, Truck, Users, IndianRupee,
  Warehouse, Filter, Calendar, Phone, Star, Globe,
  FileText, Zap, ShieldCheck, Building2, Wifi, WifiOff,
  CreditCard, Receipt, Ban, Timer, ArrowUpRight, ArrowDownRight,
  Wrench,
} from "lucide-react"
import { cn } from "@/lib/utils"

function createRng(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 12345) % 2147483647; return (s & 0x7fffffff) / 0x7fffffff }
}
const rand = createRng(141141)
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)]
const rInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min
const rDate = (start: number, end: number) => new Date(2026, 6, rInt(start, end)).toISOString().split("T")[0]
const rTime = () => `${String(rInt(4, 20)).padStart(2, "0")}:${String(rInt(0, 59)).padStart(2, "0")}`
const fmtRupee = (n: number) => `₹${n.toLocaleString("en-IN")}`

const WAREHOUSES = ["Mumbai Hub", "Delhi NCR", "Chennai DC", "Kolkata Hub", "Bangalore South", "Pune West"]
const SERVICE_TYPES = ["Warehousing", "Transportation", "Last Mile", "Cross Dock", "Cold Chain", "E-Commerce Fulfillment", "Returns Processing", "Value Added Services"]
const CONTRACT_STATUSES = ["Active", "Pending Renewal", "Under Review", "Expiring Soon", "Terminated", "On Hold"]
const BILLING_CYCLES = ["Monthly", "Quarterly", "Bi-Weekly", "Per Shipment"]
const INTEGRATION_TYPES = ["API REST", "EDI X12", "EDI EDIFACT", "AS2", "SFTP", "SOAP", "Webhook", "Direct DB"]
const SLA_METRICS = ["On-Time Delivery", "Order Accuracy", "Pick Accuracy", "Damage Rate", "Response Time", "Inventory Accuracy"]

const PARTNERS = [
  { id: "3PL-001", name: "Delhivery Pvt Ltd", code: "DLV", ceo: "Sahil Barua", hq: "Gurugram, Haryana", phone: "+91-124-456-7890", email: "ops@delhivery.com", gst: "07AADCD5189K1ZV", pan: "AADCD5189K", since: "2019-03-15", rating: 4.5, type: "Full Service 3PL", fleetSize: 2500, warehouses: 45, employees: 12000, turnover: 8500, services: ["Warehousing", "Transportation", "Last Mile", "E-Commerce Fulfillment"] as string[], status: "Active", tier: "Platinum", region: "Pan India" },
  { id: "3PL-002", name: "BlueDart Express Ltd", code: "BDX", ceo: "Brett Chappell", hq: "Mumbai, Maharashtra", phone: "+91-22-2448-1400", email: "partner@bluedart.com", gst: "27AABCB3333K1ZP", pan: "AABCB3333K", since: "2018-07-01", rating: 4.7, type: "Express Logistics", fleetSize: 1800, warehouses: 30, employees: 8500, turnover: 6200, services: ["Transportation", "Last Mile", "Cross Dock"] as string[], status: "Active", tier: "Platinum", region: "Pan India" },
  { id: "3PL-003", name: "TCI Supply Chain", code: "TCI", ceo: "Vikram Agarwal", hq: "Gurugram, Haryana", phone: "+91-124-672-8900", email: "partnership@tci.co.in", gst: "07AABCT1234L1Z5", pan: "AABCT1234L", since: "2020-01-10", rating: 4.2, type: "Heavy Freight 3PL", fleetSize: 4200, warehouses: 60, employees: 18000, turnover: 12000, services: ["Warehousing", "Transportation", "Cross Dock"] as string[], status: "Active", tier: "Gold", region: "North & East" },
  { id: "3PL-004", name: "Ekart Logistics", code: "EKT", ceo: "Kalyan Krishnamurthy", hq: "Bangalore, Karnataka", phone: "+91-80-4567-8900", email: "ops@ekart.com", gst: "29AABCE5678M1Z3", pan: "AABCE5678M", since: "2021-05-20", rating: 4.0, type: "E-Commerce 3PL", fleetSize: 3500, warehouses: 25, employees: 9500, turnover: 5800, services: ["E-Commerce Fulfillment", "Last Mile", "Returns Processing"] as string[], status: "Active", tier: "Gold", region: "South & West" },
  { id: "3PL-005", name: "Mahindra Logistics", code: "MLL", ceo: "Pirojshaw Sarkari", hq: "Mumbai, Maharashtra", phone: "+91-22-6684-5600", email: "partner@mahindralogistics.com", gst: "27AABCM9012N1Z7", pan: "AABCM9012N", since: "2019-11-08", rating: 4.3, type: "Integrated 3PL", fleetSize: 2000, warehouses: 35, employees: 7500, turnover: 4500, services: ["Warehousing", "Transportation", "Value Added Services"] as string[], status: "Active", tier: "Gold", region: "West & Central" },
  { id: "3PL-006", name: "Allcargo Logistics", code: "ALC", ceo: "Shashi Kiran Shetty", hq: "Mumbai, Maharashtra", phone: "+91-22-4057-6789", email: "scm@allcargo.in", gst: "27AABCA3456P1Z9", pan: "AABCA3456P", since: "2020-08-12", rating: 3.9, type: "Container Freight", fleetSize: 800, warehouses: 20, employees: 4500, turnover: 7200, services: ["Cross Dock", "Transportation", "Cold Chain"] as string[], status: "Pending Renewal", tier: "Silver", region: "West" },
  { id: "3PL-007", name: "Xpressbees Logistics", code: "XBE", ceo: "Amitava Saha", hq: "Pune, Maharashtra", phone: "+91-20-6728-9100", email: "partner@xpressbees.com", gst: "27AABCX7890Q1Z1", pan: "AABCX7890Q", since: "2022-02-14", rating: 4.1, type: "Express E-Com 3PL", fleetSize: 1500, warehouses: 18, employees: 6000, turnover: 3200, services: ["E-Commerce Fulfillment", "Last Mile", "Returns Processing"] as string[], status: "Active", tier: "Silver", region: "Pan India" },
  { id: "3PL-008", name: "Spoton Logistics", code: "SPT", ceo: "Abhik Barua", hq: "Gurugram, Haryana", phone: "+91-124-9876-5432", email: "ops@spoton.com", gst: "07AABCS2345R1Z6", pan: "AABCS2345R", since: "2023-06-01", rating: 3.7, type: "Tech-Enabled 3PL", fleetSize: 600, warehouses: 12, employees: 3000, turnover: 1800, services: ["Warehousing", "Transportation", "Value Added Services"] as string[], status: "Under Review", tier: "Silver", region: "North" },
  { id: "3PL-009", name: "Coldman Logistics", code: "CLD", ceo: "Rajeev Dogra", hq: "Mumbai, Maharashtra", phone: "+91-22-2890-1234", email: "partner@coldman.in", gst: "27AABCC6789S1Z2", pan: "AABCC6789S", since: "2021-09-22", rating: 4.4, type: "Cold Chain Specialist", fleetSize: 400, warehouses: 15, employees: 2500, turnover: 2800, services: ["Cold Chain", "Warehousing", "Transportation"] as string[], status: "Active", tier: "Gold", region: "West & South" },
  { id: "3PL-010", name: "VRL Logistics", code: "VRL", ceo: "Vijay Sankeshwar", hq: "Hubli, Karnataka", phone: "+91-836-234-5678", email: "partnership@vrl.in", gst: "29AABCV0123T1Z8", pan: "AABCV0123T", since: "2020-04-30", rating: 3.8, type: "Road Transport 3PL", fleetSize: 3500, warehouses: 22, employees: 5200, turnover: 5100, services: ["Transportation", "Cross Dock"] as string[], status: "Active", tier: "Silver", region: "South" },
]

const contracts = (() => {
  const result: Array<{
    id: string; partner: typeof PARTNERS[0]; warehouse: string;
    service: string; status: string; startDate: string; endDate: string;
    value: number; billingCycle: string; penaltyRate: number; discount: number;
    minVolume: number; currentVolume: number; utilization: number;
    slaTarget: number; slaActual: number; lastReview: string; nextReview: string;
  }> = []
  for (let i = 0; i < 30; i++) {
    const partner = pick(PARTNERS)
    const service = pick(partner.services)
    const status = pick(CONTRACT_STATUSES)
    const startDate = rDate(1, 28)
    const value = rInt(5, 120) * 100000
    const minVol = rInt(500, 5000)
    const curVol = rInt(Math.round(minVol * 0.4), Math.round(minVol * 1.5))
    const slaT = rInt(95, 99)
    const slaA = slaT - rInt(-2, 5)
    result.push({
      id: `CTR-${String(i + 1).padStart(4, "0")}`, partner, warehouse: pick(WAREHOUSES),
      service, status, startDate, endDate: rDate(1, 28),
      value, billingCycle: pick(BILLING_CYCLES),
      penaltyRate: rInt(2, 15), discount: rInt(0, 12),
      minVolume: minVol, currentVolume: curVol,
      utilization: Math.min(100, Math.round((curVol / minVol) * 100)),
      slaTarget: slaT, slaActual: Math.min(100, slaA),
      lastReview: rDate(1, 20), nextReview: rDate(20, 28),
    })
  }
  return result
})()

const integrations = (() => {
  const result: Array<{
    id: string; partner: typeof PARTNERS[0]; type: string; protocol: string;
    status: string; lastSync: string; latency: number; uptime: number;
    errorRate: number; dailyVolume: number; warehouse: string;
  }> = []
  for (let i = 0; i < 20; i++) {
    const partner = pick(PARTNERS)
    const status = pick(["Connected", "Connected", "Connected", "Degraded", "Disconnected", "Maintenance"])
    result.push({
      id: `INT-${String(i + 1).padStart(4, "0")}`, partner,
      type: pick(["Order Sync", "Inventory Sync", "Shipment Tracking", "Invoice Exchange", "ASN"]),
      protocol: pick(INTEGRATION_TYPES), status,
      lastSync: rTime(), latency: status === "Connected" ? rInt(50, 500) : rInt(800, 5000),
      uptime: status === "Connected" ? +(rand() * 3 + 97).toFixed(1) : +(rand() * 15 + 70).toFixed(1),
      errorRate: status === "Connected" ? +(rand() * 0.5).toFixed(2) : +(rand() * 5 + 1).toFixed(2),
      dailyVolume: rInt(100, 5000), warehouse: pick(WAREHOUSES),
    })
  }
  return result
})()

const invoices = (() => {
  const result: Array<{
    id: string; partner: typeof PARTNERS[0]; contract: string;
    warehouse: string; period: string; baseAmount: number; gst: number; tds: number;
    penalty: number; discount: number; netAmount: number; status: string;
    dueDate: string; paidDate: string | null; items: number;
  }> = []
  for (let i = 0; i < 50; i++) {
    const partner = pick(PARTNERS)
    const base = rInt(50000, 800000)
    const gstAmt = Math.round(base * 0.18)
    const tdsAmt = Math.round(base * 0.02)
    const penalty = rand() > 0.7 ? rInt(1000, 50000) : 0
    const discount = rand() > 0.5 ? Math.round(base * rand() * 0.08) : 0
    const net = base + gstAmt + penalty - discount - tdsAmt
    const status = pick(["Paid", "Paid", "Paid", "Pending", "Processing", "Overdue", "Disputed"])
    result.push({
      id: `INV-${String(i + 1).padStart(4, "0")}`, partner,
      contract: `CTR-${String(rInt(1, 30)).padStart(4, "0")}`,
      warehouse: pick(WAREHOUSES), period: `${pick(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"])} 2026`,
      baseAmount: base, gst: gstAmt, tds: tdsAmt,
      penalty, discount, netAmount: net,
      status, dueDate: rDate(1, 28), paidDate: status === "Paid" ? rDate(1, 28) : null,
      items: rInt(5, 45),
    })
  }
  return result
})()

const disputes = (() => {
  const result: Array<{
    id: string; partner: typeof PARTNERS[0]; invoice: string;
    warehouse: string; category: string; amount: number;
    status: string; raisedDate: string; resolvedDate: string | null;
    description: string; priority: string;
  }> = []
  for (let i = 0; i < 15; i++) {
    const status = pick(["Open", "Under Review", "Resolved", "Escalated"])
    result.push({
      id: `DSP-${String(i + 1).padStart(4, "0")}`, partner: pick(PARTNERS),
      invoice: `INV-${String(rInt(1, 50)).padStart(4, "0")}`,
      warehouse: pick(WAREHOUSES),
      category: pick(["Billing Error", "SLA Breach Claim", "Volume Mismatch", "Double Billing", "Incorrect GST", "Service Not Rendered", "Rate Discrepancy"]),
      amount: rInt(5000, 200000),
      status, raisedDate: rDate(1, 20), resolvedDate: status === "Resolved" ? rDate(20, 28) : null,
      description: pick([
        "Charged for 50 extra units not handled",
        "SLA target missed for 3 consecutive days",
        "Volume reported 15% higher than actual",
        "Same invoice processed twice",
        "GST calculated at 28% instead of 18%",
        "Service period not aligned with contract dates",
        "Rate per unit higher than agreed contract rate",
      ]),
      priority: pick(["Critical", "High", "Medium", "Low"]),
    })
  }
  return result
})()

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const COLORS = ["#d946ef", "#14b8a6", "#f97316", "#ef4444", "#8b5cf6", "#06b6d4", "#eab308", "#22c55e"]

const monthlyPerformance = MONTHS.map((m) => ({
  month: m, otd: rInt(88, 99), accuracy: rInt(94, 99), damageRate: +(rand() * 2 + 0.5).toFixed(1), costIndex: rInt(85, 115),
}))

const monthlyBilling = MONTHS.map((m) => ({
  month: m, invoiced: rInt(800000, 2500000), paid: rInt(700000, 2300000), disputed: rInt(0, 200000), penalty: rInt(0, 100000),
}))

const serviceTypeDist = (() => {
  const counts: Record<string, number> = {}
  contracts.forEach((c) => { counts[c.service] = (counts[c.service] || 0) + 1 })
  return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
})()

const partnerTierDist = (() => {
  const counts: Record<string, number> = {}
  PARTNERS.forEach((p) => { counts[p.tier] = (counts[p.tier] || 0) + 1 })
  return Object.entries(counts).map(([name, count]) => ({ name, count }))
})()

const integrationHealthDist = (() => {
  const counts: Record<string, number> = {}
  integrations.forEach((i) => { counts[i.status] = (counts[i.status] || 0) + 1 })
  return Object.entries(counts).map(([name, count]) => ({ name, count }))
})()

const warehouseSpend = WAREHOUSES.map((w) => ({
  warehouse: w, warehousing: rInt(500000, 2000000), transportation: rInt(400000, 1800000),
  lastMile: rInt(200000, 800000), valueAdded: rInt(50000, 300000),
}))

const STATUS_COLORS: Record<string, string> = {
  Active: "tpl-badge-active", "Pending Renewal": "tpl-badge-renewal", "Under Review": "tpl-badge-review",
  "Expiring Soon": "tpl-badge-expiring", Terminated: "tpl-badge-terminated", "On Hold": "tpl-badge-hold",
  Paid: "tpl-badge-paid", Pending: "tpl-badge-pending", Processing: "tpl-badge-processing",
  Overdue: "tpl-badge-overdue", Disputed: "tpl-badge-disputed",
  Connected: "tpl-badge-connected", Degraded: "tpl-badge-degraded", Disconnected: "tpl-badge-disconnected",
  Maintenance: "tpl-badge-maintenance",
  Open: "tpl-badge-open", Resolved: "tpl-badge-resolved", Escalated: "tpl-badge-escalated",
}

const TIER_COLORS: Record<string, string> = {
  Platinum: "tpl-tier-platinum", Gold: "tpl-tier-gold", Silver: "tpl-tier-silver",
}

const PRIORITY_COLORS: Record<string, string> = {
  Critical: "tpl-priority-critical", High: "tpl-priority-high", Medium: "tpl-priority-medium", Low: "tpl-priority-low",
}

// Summary stats
const totalPartners = PARTNERS.length
const activePartners = PARTNERS.filter((p) => p.status === "Active").length
const totalContractValue = contracts.reduce((s, c) => s + c.value, 0)
const avgSla = Math.round(contracts.reduce((s, c) => s + c.slaActual, 0) / contracts.length * 10) / 10
const connectedIntegrations = integrations.filter((i) => i.status === "Connected").length
const totalInvoiced = invoices.reduce((s, i) => s + i.netAmount, 0)
const openDisputes = disputes.filter((d) => d.status === "Open" || d.status === "Escalated").length

const SUMMARY_KPIS = [
  { label: "Total Partners", value: String(totalPartners), sub: `${activePartners} active`, icon: Handshake, trend: "up" },
  { label: "Contract Value", value: `₹${(totalContractValue / 10000000).toFixed(1)}Cr`, sub: `${contracts.length} contracts`, icon: FileText, trend: "up" },
  { label: "Avg SLA Score", value: `${avgSla}%`, sub: `Target: 97%`, icon: TrendingUp, trend: avgSla > 96 ? "up" : "down" },
  { label: "Integrations", value: `${connectedIntegrations}/${integrations.length}`, sub: `${integrations.filter((i) => i.status === "Connected").length} connected`, icon: Wifi, trend: "up" },
  { label: "Total Invoiced", value: `₹${(totalInvoiced / 10000000).toFixed(2)}Cr`, sub: `${invoices.filter((i) => i.status === "Paid").length}/${invoices.length} paid`, icon: CreditCard, trend: "up" },
  { label: "Open Disputes", value: String(openDisputes), sub: `₹${disputes.filter((d) => d.status === "Open").reduce((s, d) => s + d.amount, 0).toLocaleString("en-IN")}`, icon: AlertTriangle, trend: openDisputes > 5 ? "down" : "up" },
]

type PartnerDetail = typeof PARTNERS[0]

export default function ThirdPartyLogisticsView() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPartner, setSelectedPartner] = useState<PartnerDetail | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const openDrawer = (partner: PartnerDetail) => { setSelectedPartner(partner); setDrawerOpen(true) }

  const filteredPartners = PARTNERS.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === "all" || p.status === statusFilter
    return matchSearch && matchStatus
  })

  const filteredContracts = contracts.filter((c) => {
    const matchSearch = c.partner.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === "all" || c.status === statusFilter
    return matchSearch && matchStatus
  })

  const filteredInvoices = invoices.filter((i) => {
    const matchSearch = i.partner.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === "all" || i.status === statusFilter
    return matchSearch && matchStatus
  })

  const filteredIntegrations = integrations.filter((i) => {
    const matchSearch = i.partner.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === "all" || i.status === statusFilter
    return matchSearch && matchStatus
  })

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "partners", label: "Partners" },
    { id: "contracts", label: "Contracts" },
    { id: "operations", label: "Operations" },
    { id: "analytics", label: "Analytics" },
  ]

  return (
    <div className="tpl-root flex flex-col h-full">
      {/* Header */}
      <div className="tpl-header px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="tpl-icon-wrap">
            <Handshake className="h-6 w-6" />
          </div>
          <div>
            <h1 className="tpl-title text-xl font-bold">3PL Partner & Service Management</h1>
            <p className="tpl-subtitle text-sm">Third-party logistics partner oversight, contracts, integration &amp; billing</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={cn("tpl-badge-trend", totalPartners > 0 && "tpl-badge-trend-up")}>
            {totalPartners} Partners
          </Badge>
          <Badge className={cn("tpl-badge-trend", contracts.filter((c) => c.status === "Active").length > 15 && "tpl-badge-trend-up")}>
            {contracts.filter((c) => c.status === "Active").length} Active Contracts
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="tpl-tabs-wrap px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="tpl-tabs-list">
            {tabs.map((t) => (
              <TabsTrigger key={t.id} value={t.id} className="tpl-tab-trigger">
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="tpl-content flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {activeTab === "dashboard" && (
          <div className="space-y-4">
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {SUMMARY_KPIS.map((kpi) => (
                <Card key={kpi.label} className="hover-lift-sm tpl-kpi-card">
                  <CardContent className="inner-glow glass-subtle p-4">
                    <div className="flex items-center justify-between mb-2">
                      <kpi.icon className="h-4 w-4 tpl-kpi-icon" />
                      <span className={cn("tpl-trend-badge", kpi.trend === "up" ? "tpl-trend-up" : "tpl-trend-down")}>
                        {kpi.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      </span>
                    </div>
                    <div className="tpl-kpi-value text-lg font-bold">{kpi.value}</div>
                    <div className="tpl-kpi-label text-xs">{kpi.label}</div>
                    <div className="tpl-kpi-sub text-xs">{kpi.sub}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="hover-lift-sm tpl-chart-card">
                <CardHeader className="pb-2">
                  <CardTitle className="tpl-chart-title text-sm">SLA Performance Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <ComposedChart data={monthlyPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e5e7eb)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" domain={[80, 100]} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="otd" name="On-Time Delivery" fill="#d946ef" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="accuracy" name="Order Accuracy" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                      <Line type="monotone" dataKey="damageRate" name="Damage Rate%" stroke="#f97316" strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover-lift-sm tpl-chart-card">
                <CardHeader className="pb-2">
                  <CardTitle className="tpl-chart-title text-sm">Service Type Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={serviceTypeDist} dataKey="count" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={2} label={({ name, count }) => `${name}: ${count}`}>
                        {serviceTypeDist.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover-lift-sm tpl-chart-card">
                <CardHeader className="pb-2">
                  <CardTitle className="tpl-chart-title text-sm">Partner Tier Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={partnerTierDist} dataKey="count" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={3} label={({ name, count }) => `${name}: ${count}`}>
                        {partnerTierDist.map((_, idx) => { const tc = ["#e2e8f0", "#fbbf24", "#94a3b8"]; return <Cell key={idx} fill={tc[idx % 3]} /> })}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="hover-lift-sm tpl-chart-card">
                <CardHeader className="pb-2">
                  <CardTitle className="tpl-chart-title text-sm">Monthly Billing Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={monthlyBilling}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e5e7eb)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => fmtRupee(v)} />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                      <Area type="monotone" dataKey="invoiced" name="Invoiced" fill="#d946ef33" stroke="#d946ef" strokeWidth={2} />
                      <Area type="monotone" dataKey="paid" name="Paid" fill="#14b8a633" stroke="#14b8a6" strokeWidth={2} />
                      <Area type="monotone" dataKey="disputed" name="Disputed" fill="#f9731633" stroke="#f97316" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover-lift-sm tpl-chart-card">
                <CardHeader className="pb-2">
                  <CardTitle className="tpl-chart-title text-sm">Warehouse Spend Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={warehouseSpend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e5e7eb)" />
                      <XAxis dataKey="warehouse" tick={{ fontSize: 10 }} stroke="var(--chart-axis, #6b7280)}" />
                      <YAxis tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => fmtRupee(v)} />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="warehousing" name="Warehousing" stackId="a" fill="#d946ef" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="transportation" name="Transport" stackId="a" fill="#14b8a6" />
                      <Bar dataKey="lastMile" name="Last Mile" stackId="a" fill="#f97316" />
                      <Bar dataKey="valueAdded" name="Value Added" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Active Alerts */}
            <Card className="hover-lift-sm tpl-alert-card">
              <CardHeader className="pb-2">
                <CardTitle className="tpl-chart-title text-sm">Recent Alerts &amp; Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { msg: "BlueDart API latency spike — avg 450ms (threshold: 300ms)", severity: "warning", time: "12m ago" },
                    { msg: "Delhivery contract CTR-0012 expiring in 15 days — renewal pending", severity: "warning", time: "28m ago" },
                    { msg: "Invoice INV-0034 disputed — billing error ₹45,000 by Ekart Logistics", severity: "critical", time: "1h ago" },
                    { msg: "Spoton Logistics integration maintenance scheduled tonight 23:00-02:00", severity: "info", time: "2h ago" },
                    { msg: "Coldman Logistics SLA exceeded 3 days — Cold Chain On-Time Delivery at 91.2%", severity: "critical", time: "3h ago" },
                    { msg: "New partner VRL Logistics onboarding — integration setup 60% complete", severity: "info", time: "4h ago" },
                  ].map((alert, idx) => (
                    <div key={idx} className={cn("tpl-alert-row flex items-center justify-between p-2 rounded-lg text-sm", alert.severity === "critical" && "tpl-alert-critical", alert.severity === "warning" && "tpl-alert-warning", alert.severity === "info" && "tpl-alert-info")}>
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

        {activeTab === "partners" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                <input className="tpl-filter-input w-full pl-9 pr-4 py-2 rounded-lg text-sm" placeholder="Search partners by name or code..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <select className="tpl-filter-select rounded-lg px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Pending Renewal">Pending Renewal</option>
                <option value="Under Review">Under Review</option>
                <option value="On Hold">On Hold</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>

            {/* Partner Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPartners.map((partner) => (
                <Card key={partner.id} className="hover-lift-sm tpl-partner-card cursor-pointer hover:shadow-lg transition-shadow" onClick={() => openDrawer(partner)}>
                  <CardContent className="inner-glow glass-subtle p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="tpl-partner-avatar">
                          <span className="font-bold">{partner.code.substring(0, 2)}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{partner.name}</h3>
                          <p className="text-xs opacity-60">{partner.type}</p>
                        </div>
                      </div>
                      <Badge className={cn(TIER_COLORS[partner.tier])}>{partner.tier}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /><span>{partner.region}</span></div>
                      <div className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-500" /><span>{partner.rating}/5.0</span></div>
                      <div className="flex items-center gap-1"><Truck className="h-3 w-3" /><span>{partner.fleetSize.toLocaleString()} fleet</span></div>
                      <div className="flex items-center gap-1"><Building2 className="h-3 w-3" /><span>{partner.warehouses} WH</span></div>
                      <div className="flex items-center gap-1"><Users className="h-3 w-3" /><span>{partner.employees.toLocaleString()} staff</span></div>
                      <div className="flex items-center gap-1"><IndianRupee className="h-3 w-3" /><span>₹{partner.turnover}Cr</span></div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {partner.services.map((s) => (
                        <Badge key={s} className="badge-interactive tpl-service-tag text-[10px]">{s}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className={cn(STATUS_COLORS[partner.status])}>{partner.status}</Badge>
                      <span className="tpl-view-detail text-xs flex items-center gap-1">View Details <ChevronRight className="h-3 w-3" /></span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "contracts" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                <input className="tpl-filter-input w-full pl-9 pr-4 py-2 rounded-lg text-sm" placeholder="Search contracts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <select className="tpl-filter-select rounded-lg px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                {CONTRACT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Contract Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: "Total Contracts", value: String(contracts.length), color: "tpl-sum-card-fuchsia" },
                { label: "Active", value: String(contracts.filter((c) => c.status === "Active").length), color: "tpl-sum-card-teal" },
                { label: "Expiring Soon", value: String(contracts.filter((c) => c.status === "Expiring Soon").length), color: "tpl-sum-card-orange" },
                { label: "Total Value", value: `₹${(totalContractValue / 10000000).toFixed(1)}Cr`, color: "tpl-sum-card-purple" },
                { label: "Avg Utilization", value: `${Math.round(contracts.reduce((s, c) => s + c.utilization, 0) / contracts.length)}%`, color: "tpl-sum-card-cyan" },
                { label: "SLA Compliance", value: `${avgSla}%`, color: "tpl-sum-card-green" },
              ].map((c) => (
                <Card key={c.label} className={c.color}>
                  <CardContent className="inner-glow glass-subtle p-3 text-center">
                    <div className="text-lg font-bold">{c.value}</div>
                    <div className="text-xs opacity-70">{c.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contract Table */}
            <Card className="hover-lift-sm card-crud-lift tpl-table-card">
              <CardContent className="inner-glow glass-subtle p-0">
                <div className="overflow-x-auto">
                  <Table className="table-hover-highlight">
                    <TableHeader>
                      <TableRow className="tpl-table-header">
                        <TableHead className="tpl-th">Contract ID</TableHead>
                        <TableHead className="tpl-th">Partner</TableHead>
                        <TableHead className="tpl-th">Warehouse</TableHead>
                        <TableHead className="tpl-th">Service</TableHead>
                        <TableHead className="tpl-th">Value</TableHead>
                        <TableHead className="tpl-th">Billing</TableHead>
                        <TableHead className="tpl-th">Penalty Rate</TableHead>
                        <TableHead className="tpl-th">Utilization</TableHead>
                        <TableHead className="tpl-th">SLA Target</TableHead>
                        <TableHead className="tpl-th">SLA Actual</TableHead>
                        <TableHead className="tpl-th">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContracts.slice(0, 25).map((c) => (
                        <TableRow key={c.id} className="tpl-table-row">
                          <TableCell className="tpl-td font-mono text-xs">{c.id}</TableCell>
                          <TableCell className="tpl-td text-xs font-medium">{c.partner.name}</TableCell>
                          <TableCell className="tpl-td text-xs">{c.warehouse}</TableCell>
                          <TableCell className="tpl-td text-xs">{c.service}</TableCell>
                          <TableCell className="numeric-cell tpl-td text-xs font-mono">{fmtRupee(c.value)}</TableCell>
                          <TableCell className="tpl-td text-xs">{c.billingCycle}</TableCell>
                          <TableCell className="numeric-cell tpl-td text-xs">{c.penaltyRate}%</TableCell>
                          <TableCell className="tpl-td text-xs">
                            <div className="flex items-center gap-2">
                              <div className="tpl-progress-bar h-1.5 w-16 rounded-full bg-gray-200 dark:bg-gray-700">
                                <div className={cn("tpl-progress-fill h-full rounded-full", c.utilization >= 80 ? "bg-emerald-500" : c.utilization >= 50 ? "bg-amber-500" : "bg-red-500")} style={{ width: `${c.utilization}%` }} />
                              </div>
                              <span>{c.utilization}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="tpl-td text-xs">{c.slaTarget}%</TableCell>
                          <TableCell className={cn("tpl-td text-xs font-bold", c.slaActual >= c.slaTarget ? "text-emerald-600" : "text-red-500")}>{c.slaActual}%</TableCell>
                          <TableCell className="tpl-td">
                            <Badge className={cn(STATUS_COLORS[c.status], "text-[10px]")}>{c.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "operations" && (
          <div className="space-y-4">
            {/* Ops Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Connected", value: String(integrations.filter((i) => i.status === "Connected").length), icon: Wifi, color: "text-emerald-600" },
                { label: "Degraded", value: String(integrations.filter((i) => i.status === "Degraded").length), icon: AlertTriangle, color: "text-amber-500" },
                { label: "Disconnected", value: String(integrations.filter((i) => i.status === "Disconnected").length), icon: WifiOff, color: "text-red-500" },
                { label: "Maintenance", value: String(integrations.filter((i) => i.status === "Maintenance").length), icon: Wrench, color: "text-blue-500" },
              ].map((s) => (
                <Card key={s.label} className="hover-lift-sm tpl-chart-card">
                  <CardContent className="inner-glow glass-subtle p-4 flex items-center gap-3">
                    <s.icon className={cn("h-8 w-8", s.color)} />
                    <div>
                      <div className="text-xl font-bold">{s.value}</div>
                      <div className="text-xs opacity-70">{s.label}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Integration Health Pie + Invoices */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="hover-lift-sm tpl-chart-card">
                <CardHeader className="pb-2">
                  <CardTitle className="tpl-chart-title text-sm">Integration Health Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={integrationHealthDist} dataKey="count" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={2} label={({ name, count }) => `${name}: ${count}`}>
                        {integrationHealthDist.map((_, idx) => { const hc = ["#22c55e", "#f59e0b", "#ef4444", "#3b82f6"]; return <Cell key={idx} fill={hc[idx % 4]} /> })}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover-lift-sm tpl-chart-card">
                <CardHeader className="pb-2">
                  <CardTitle className="tpl-chart-title text-sm">Billing Status Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={[
                        { name: "Paid", count: invoices.filter((i) => i.status === "Paid").length },
                        { name: "Pending", count: invoices.filter((i) => i.status === "Pending").length },
                        { name: "Processing", count: invoices.filter((i) => i.status === "Processing").length },
                        { name: "Overdue", count: invoices.filter((i) => i.status === "Overdue").length },
                        { name: "Disputed", count: invoices.filter((i) => i.status === "Disputed").length },
                      ]} dataKey="count" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={2} label={({ name, count }) => `${name}: ${count}`}>
                        {["#22c55e", "#f59e0b", "#3b82f6", "#ef4444", "#8b5cf6"].map((c, idx) => <Cell key={idx} fill={c} />)}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Integration Table */}
            <Card className="hover-lift-sm tpl-table-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="tpl-chart-title text-sm">Integration Connections</CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1 min-w-[200px] max-w-[300px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                      <input className="tpl-filter-input w-full pl-9 pr-4 py-2 rounded-lg text-sm" placeholder="Search integrations..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="inner-glow glass-subtle p-0">
                <div className="overflow-x-auto">
                  <Table className="table-hover-highlight">
                    <TableHeader>
                      <TableRow className="tpl-table-header">
                        <TableHead className="tpl-th">ID</TableHead>
                        <TableHead className="tpl-th">Partner</TableHead>
                        <TableHead className="tpl-th">Type</TableHead>
                        <TableHead className="tpl-th">Protocol</TableHead>
                        <TableHead className="tpl-th">Status</TableHead>
                        <TableHead className="tpl-th">Latency</TableHead>
                        <TableHead className="tpl-th">Uptime</TableHead>
                        <TableHead className="tpl-th">Error Rate</TableHead>
                        <TableHead className="tpl-th">Daily Vol</TableHead>
                        <TableHead className="tpl-th">Warehouse</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredIntegrations.map((intg) => (
                        <TableRow key={intg.id} className="tpl-table-row">
                          <TableCell className="tpl-td font-mono text-xs">{intg.id}</TableCell>
                          <TableCell className="tpl-td text-xs font-medium">{intg.partner.name}</TableCell>
                          <TableCell className="tpl-td text-xs">{intg.type}</TableCell>
                          <TableCell className="badge-interactive tpl-td text-xs"><Badge className="tpl-protocol-badge text-[10px]">{intg.protocol}</Badge></TableCell>
                          <TableCell className="badge-interactive tpl-td"><Badge className={cn(STATUS_COLORS[intg.status], "text-[10px]")}>{intg.status}</Badge></TableCell>
                          <TableCell className={cn("tpl-td text-xs font-mono", intg.latency < 300 ? "text-emerald-600" : intg.latency < 1000 ? "text-amber-500" : "text-red-500")}>{intg.latency}ms</TableCell>
                          <TableCell className={cn("tpl-td text-xs", intg.uptime >= 99 ? "text-emerald-600" : "text-amber-500")}>{intg.uptime}%</TableCell>
                          <TableCell className={cn("tpl-td text-xs", intg.errorRate < 1 ? "text-emerald-600" : "text-red-500")}>{intg.errorRate}%</TableCell>
                          <TableCell className="tpl-td text-xs font-mono">{intg.dailyVolume.toLocaleString()}</TableCell>
                          <TableCell className="tpl-td text-xs">{intg.warehouse}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Invoices Table */}
            <Card className="hover-lift-sm tpl-table-card">
              <CardHeader className="pb-2">
                <CardTitle className="tpl-chart-title text-sm">Recent Invoices &amp; Disputes</CardTitle>
              </CardHeader>
              <CardContent className="inner-glow glass-subtle p-0">
                <div className="overflow-x-auto">
                  <Table className="table-hover-highlight">
                    <TableHeader>
                      <TableRow className="tpl-table-header">
                        <TableHead className="tpl-th">Invoice</TableHead>
                        <TableHead className="tpl-th">Partner</TableHead>
                        <TableHead className="tpl-th">Period</TableHead>
                        <TableHead className="tpl-th">Base</TableHead>
                        <TableHead className="tpl-th">GST 18%</TableHead>
                        <TableHead className="tpl-th">TDS 2%</TableHead>
                        <TableHead className="tpl-th">Penalty</TableHead>
                        <TableHead className="tpl-th">Discount</TableHead>
                        <TableHead className="tpl-th">Net Amount</TableHead>
                        <TableHead className="tpl-th">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvoices.slice(0, 20).map((inv) => (
                        <TableRow key={inv.id} className="tpl-table-row">
                          <TableCell className="tpl-td font-mono text-xs">{inv.id}</TableCell>
                          <TableCell className="tpl-td text-xs font-medium">{inv.partner.name}</TableCell>
                          <TableCell className="tpl-td text-xs">{inv.period}</TableCell>
                          <TableCell className="numeric-cell tpl-td text-xs font-mono">{fmtRupee(inv.baseAmount)}</TableCell>
                          <TableCell className="tpl-td text-xs font-mono">{fmtRupee(inv.gst)}</TableCell>
                          <TableCell className="tpl-td text-xs font-mono">{fmtRupee(inv.tds)}</TableCell>
                          <TableCell className={cn("tpl-td text-xs font-mono", inv.penalty > 0 ? "text-red-500" : "text-gray-400")}>{fmtRupee(inv.penalty)}</TableCell>
                          <TableCell className={cn("tpl-td text-xs font-mono", inv.discount > 0 ? "text-emerald-600" : "text-gray-400")}>-{fmtRupee(inv.discount)}</TableCell>
                          <TableCell className="numeric-cell tpl-td text-xs font-mono font-bold">{fmtRupee(inv.netAmount)}</TableCell>
                          <TableCell className="badge-interactive tpl-td"><Badge className={cn(STATUS_COLORS[inv.status], "text-[10px]")}>{inv.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Disputes Table */}
            {disputes.length > 0 && (
              <Card className="hover-lift-sm tpl-table-card">
                <CardHeader className="pb-2">
                  <CardTitle className="tpl-chart-title text-sm">Active Disputes</CardTitle>
                </CardHeader>
                <CardContent className="inner-glow glass-subtle p-0">
                  <div className="overflow-x-auto">
                    <Table className="table-hover-highlight">
                      <TableHeader>
                        <TableRow className="tpl-table-header">
                          <TableHead className="tpl-th">Dispute ID</TableHead>
                          <TableHead className="tpl-th">Partner</TableHead>
                          <TableHead className="tpl-th">Invoice</TableHead>
                          <TableHead className="tpl-th">Category</TableHead>
                          <TableHead className="tpl-th">Amount</TableHead>
                          <TableHead className="tpl-th">Priority</TableHead>
                          <TableHead className="tpl-th">Status</TableHead>
                          <TableHead className="tpl-th">Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {disputes.map((d) => (
                          <TableRow key={d.id} className="tpl-table-row">
                            <TableCell className="tpl-td font-mono text-xs">{d.id}</TableCell>
                            <TableCell className="tpl-td text-xs font-medium">{d.partner.name}</TableCell>
                            <TableCell className="tpl-td text-xs font-mono">{d.invoice}</TableCell>
                            <TableCell className="tpl-td text-xs">{d.category}</TableCell>
                            <TableCell className="numeric-cell tpl-td text-xs font-mono font-bold text-red-500">{fmtRupee(d.amount)}</TableCell>
                            <TableCell className="badge-interactive tpl-td"><Badge className={cn(PRIORITY_COLORS[d.priority], "text-[10px]")}>{d.priority}</Badge></TableCell>
                            <TableCell className="badge-interactive tpl-td"><Badge className={cn(STATUS_COLORS[d.status], "text-[10px]")}>{d.status}</Badge></TableCell>
                            <TableCell className="tpl-td text-xs max-w-[250px] truncate">{d.description}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-4">
            {/* Analytics KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Cost per Shipment", value: `₹${rInt(180, 450)}`, sub: "Avg across all partners" },
                { label: "Partner Churn Risk", value: `${rInt(8, 22)}%`, sub: "2 partners flagged" },
                { label: "Avg Response Time", value: `${rInt(15, 45)}min`, sub: "SLA target: 30min" },
                { label: "Digital Maturity", value: `${rInt(65, 92)}%`, sub: "API/EDI adoption rate" },
              ].map((k) => (
                <Card key={k.label} className="hover-lift-sm tpl-kpi-card">
                  <CardContent className="inner-glow glass-subtle p-4">
                    <div className="tpl-kpi-value text-lg font-bold">{k.value}</div>
                    <div className="tpl-kpi-label text-xs">{k.label}</div>
                    <div className="tpl-kpi-sub text-xs">{k.sub}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="hover-lift-sm tpl-chart-card">
                <CardHeader className="pb-2">
                  <CardTitle className="tpl-chart-title text-sm">Cost Index Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <ComposedChart data={monthlyPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e5e7eb)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" domain={[80, 120]} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="costIndex" name="Cost Index" fill="#d946ef" radius={[4, 4, 0, 0]} opacity={0.8} />
                      <Line type="monotone" dataKey="otd" name="OTD%" stroke="#14b8a6" strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover-lift-sm tpl-chart-card">
                <CardHeader className="pb-2">
                  <CardTitle className="tpl-chart-title text-sm">Penalty &amp; Dispute Cost</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={monthlyBilling}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e5e7eb)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => fmtRupee(v)} />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                      <Area type="monotone" dataKey="disputed" name="Disputed" fill="#ef444433" stroke="#ef4444" strokeWidth={2} />
                      <Area type="monotone" dataKey="penalty" name="Penalty" fill="#f9731633" stroke="#f97316" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover-lift-sm tpl-chart-card">
                <CardHeader className="pb-2">
                  <CardTitle className="tpl-chart-title text-sm">Invoice Cycle Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={MONTHS.map((m) => ({ month: m, processing: rInt(3, 12), payment: rInt(5, 18) }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e5e7eb)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" unit=" days" />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="processing" name="Processing Days" fill="#d946ef" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="payment" name="Payment Days" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover-lift-sm tpl-chart-card">
                <CardHeader className="pb-2">
                  <CardTitle className="tpl-chart-title text-sm">Partner Performance Matrix</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={PARTNERS.map((p) => ({ name: p.code, sla: p.rating * 20, volume: rInt(60, 100), cost: rInt(50, 95) }))} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e5e7eb)" />
                      <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" width={40} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="sla" name="SLA Score" fill="#d946ef" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="volume" name="Volume" fill="#14b8a6" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="cost" name="Cost Efficiency" fill="#f97316" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Drawer */}
      {drawerOpen && selectedPartner && (
        <div className="tpl-drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="tpl-drawer" onClick={(e) => e.stopPropagation()}>
            {/* Drawer Header */}
            <div className={cn("tpl-drawer-header p-5", selectedPartner.status === "Active" ? "tpl-drawer-header-active" : selectedPartner.status === "Under Review" ? "tpl-drawer-header-review" : "tpl-drawer-header-inactive")}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="tpl-drawer-avatar">
                    <Handshake className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">{selectedPartner.name}</h2>
                    <p className="text-sm opacity-80">{selectedPartner.type} · {selectedPartner.code}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setDrawerOpen(false)} className="press-scale text-white/70 hover:text-white hover:bg-white/10">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-3">
<div className="chip-group">
                <Badge className={cn(TIER_COLORS[selectedPartner.tier])}>{selectedPartner.tier} Tier</Badge>
                <Badge className={cn(STATUS_COLORS[selectedPartner.status])}>{selectedPartner.status}</Badge>
                <Badge className="badge-interactive tpl-badge-trend tpl-badge-trend-up flex items-center gap-1"><Star className="h-3 w-3" /> {selectedPartner.rating}/5.0</Badge>
</div>
              </div>
            </div>

            {/* Drawer Flow */}
            <div className="px-5 py-3 border-b">
              <div className="flex items-center justify-between">
                {["Onboarding", "Active Ops", "Performance Review", "Renewal"].map((step, idx) => (
                  <Fragment key={step}>
                    <div className="flex flex-col items-center">
                      <div className={cn("tpl-flow-dot", idx <= (selectedPartner.status === "Active" ? 2 : 0) ? "tpl-flow-dot-active" : "tpl-flow-dot-inactive")}>
                        {idx <= (selectedPartner.status === "Active" ? 2 : 0) ? <CheckCircle2 className="h-3 w-3" /> : <span className="text-[10px]">{idx + 1}</span>}
                      </div>
                      <span className="text-[10px] mt-1 opacity-70">{step}</span>
                    </div>
                    {idx < 3 && <div className={cn("flex-1 h-0.5 mx-1", idx < (selectedPartner.status === "Active" ? 2 : 0) ? "bg-fuchsia-500" : "bg-gray-300 dark:bg-gray-600")} />}
                  </Fragment>
                ))}
              </div>
            </div>

            {/* Drawer Content */}
            <div className="overflow-y-auto flex-1 p-5 space-y-5">
              {/* Info Grid */}
              <div>
                <h3 className="tpl-section-title text-sm font-semibold mb-2">Partner Information</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Code", value: selectedPartner.code },
                    { label: "CEO", value: selectedPartner.ceo },
                    { label: "Headquarters", value: selectedPartner.hq },
                    { label: "Region", value: selectedPartner.region },
                    { label: "Phone", value: selectedPartner.phone },
                    { label: "Email", value: selectedPartner.email },
                    { label: "GST Number", value: selectedPartner.gst },
                    { label: "PAN", value: selectedPartner.pan },
                    { label: "Partner Since", value: selectedPartner.since },
                    { label: "Fleet Size", value: selectedPartner.fleetSize.toLocaleString() },
                    { label: "Warehouses", value: String(selectedPartner.warehouses) },
                    { label: "Employees", value: selectedPartner.employees.toLocaleString() },
                  ].map((item) => (
                    <div key={item.label} className="tpl-info-cell p-2 rounded-lg">
                      <div className="tpl-info-label text-[10px] uppercase opacity-50">{item.label}</div>
                      <div className="tpl-info-value text-xs font-medium">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div>
                <h3 className="tpl-section-title text-sm font-semibold mb-2">Active Services</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPartner.services.map((s) => (
                    <Badge key={s} className="badge-interactive tpl-service-badge"><Zap className="h-3 w-3 mr-1" />{s}</Badge>
                  ))}
                </div>
              </div>

              {/* Contracts Summary */}
              <div>
                <h3 className="tpl-section-title text-sm font-semibold mb-2">Contract Summary</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(() => {
                    const partnerContracts = contracts.filter((c) => c.partner.id === selectedPartner.id)
                    return [
                      { label: "Total Contracts", value: String(partnerContracts.length) },
                      { label: "Active", value: String(partnerContracts.filter((c) => c.status === "Active").length) },
                      { label: "Total Value", value: fmtRupee(partnerContracts.reduce((s, c) => s + c.value, 0)) },
                      { label: "Avg SLA", value: partnerContracts.length > 0 ? `${Math.round(partnerContracts.reduce((s, c) => s + c.slaActual, 0) / partnerContracts.length)}%` : "N/A" },
                    ].map((item) => (
                      <div key={item.label} className="tpl-info-cell p-2 rounded-lg">
                        <div className="tpl-info-label text-[10px] uppercase opacity-50">{item.label}</div>
                        <div className="tpl-info-value text-xs font-medium">{item.value}</div>
                      </div>
                    ))
                  })()}
                </div>
              </div>

              {/* Financial */}
              <div>
                <h3 className="tpl-section-title text-sm font-semibold mb-2">Financial Overview</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(() => {
                    const partnerInvoices = invoices.filter((i) => i.partner.id === selectedPartner.id)
                    const totalBilled = partnerInvoices.reduce((s, i) => s + i.netAmount, 0)
                    const totalPaid = partnerInvoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.netAmount, 0)
                    const totalPenalty = partnerInvoices.reduce((s, i) => s + i.penalty, 0)
                    const totalGst = partnerInvoices.reduce((s, i) => s + i.gst, 0)
                    return [
                      { label: "Turnover", value: `₹${selectedPartner.turnover}Cr` },
                      { label: "Total Billed", value: fmtRupee(totalBilled) },
                      { label: "Total Paid", value: fmtRupee(totalPaid) },
                      { label: "Outstanding", value: fmtRupee(totalBilled - totalPaid) },
                      { label: "Total GST (18%)", value: fmtRupee(totalGst) },
                      { label: "Total Penalty", value: fmtRupee(totalPenalty) },
                    ].map((item) => (
                      <div key={item.label} className="tpl-info-cell p-2 rounded-lg">
                        <div className="tpl-info-label text-[10px] uppercase opacity-50">{item.label}</div>
                        <div className="tpl-info-value text-xs font-medium">{item.value}</div>
                      </div>
                    ))
                  })()}
                </div>
              </div>

              {/* Integration Status */}
              <div>
                <h3 className="tpl-section-title text-sm font-semibold mb-2">Integration Status</h3>
                <div className="space-y-2">
                  {integrations.filter((i) => i.partner.id === selectedPartner.id).map((intg) => (
                    <div key={intg.id} className="tpl-intg-row flex items-center justify-between p-2 rounded-lg text-xs">
                      <div className="flex items-center gap-2">
                        {intg.status === "Connected" ? <Wifi className="h-3.5 w-3.5 text-emerald-500" /> : <WifiOff className="h-3.5 w-3.5 text-red-500" />}
                        <span className="font-medium">{intg.type}</span>
                        <Badge className="badge-interactive tpl-protocol-badge text-[9px]">{intg.protocol}</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono">{intg.latency}ms</span>
                        <Badge className={cn(STATUS_COLORS[intg.status], "text-[9px]")}>{intg.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
