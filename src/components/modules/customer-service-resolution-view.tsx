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
  Headset, MessageCircle, AlertTriangle, CheckCircle2, Clock, Star,
  TrendingUp, TrendingDown, Phone, Mail, ChevronRight, ArrowRight,
  ThumbsUp, ThumbsDown, Minus, User, X, PhoneCall, MessageSquare,
  CreditCard, IndianRupee, Filter, Search, Eye, RotateCcw,
  Send, FileText, Award, BarChart3, Users, Sparkles, Target
} from "lucide-react"

// ──────────────────────────────────────────────────────
// Seed-based mock data generation
// ──────────────────────────────────────────────────────
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

const rng = seededRandom(146146)

function pick<T>(arr: T[]): T { return arr[Math.floor(rng() * arr.length)] }
function randInt(min: number, max: number): number { return Math.floor(rng() * (max - min + 1)) + min }
function randFloat(min: number, max: number, dec = 1): number { return Number((rng() * (max - min) + min).toFixed(dec)) }

// ──────────────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────────────
const CATEGORIES = [
  "Delivery Delay", "Wrong Item", "Damaged Product", "Quality Issue",
  "Billing Error", "Missing Items", "Wrong Quantity", "Packaging Damage",
  "Service Complaint", "Refund Delay", "Order Cancellation", "App/Website Issue"
] as const

const CHANNELS = ["Phone", "Email", "WhatsApp", "Chat", "Social Media", "Walk-in", "Email Ticket", "Portal"] as const

const PRIORITIES = ["Critical", "High", "Medium", "Low"] as const

const STATUSES = ["Open", "In Progress", "Escalated", "Pending Customer", "Resolved", "Closed"] as const

const AGENTS = [
  { id: "AG001", name: "Priya Sharma", dept: "Customer Service", rating: 4.8, resolved: 245, avgTAT: "4.2h", avatar: "bg-rose-500" },
  { id: "AG002", name: "Arjun Patel", dept: "Customer Service", rating: 4.6, resolved: 218, avgTAT: "5.1h", avatar: "bg-blue-500" },
  { id: "AG003", name: "Kavitha Nair", dept: "Returns", rating: 4.7, resolved: 196, avgTAT: "3.8h", avatar: "bg-emerald-500" },
  { id: "AG004", name: "Rohit Mehta", dept: "Billing", rating: 4.5, resolved: 182, avgTAT: "6.0h", avatar: "bg-amber-500" },
  { id: "AG005", name: "Sneha Gupta", dept: "Escalations", rating: 4.9, resolved: 165, avgTAT: "3.2h", avatar: "bg-purple-500" },
  { id: "AG006", name: "Vikram Singh", dept: "Delivery", rating: 4.4, resolved: 158, avgTAT: "5.5h", avatar: "bg-cyan-500" },
  { id: "AG007", name: "Anjali Desai", dept: "Customer Service", rating: 4.3, resolved: 147, avgTAT: "5.8h", avatar: "bg-pink-500" },
  { id: "AG008", name: "Manish Kumar", dept: "Quality", rating: 4.6, resolved: 134, avgTAT: "4.5h", avatar: "bg-indigo-500" },
] as const

const WAREHOUSES = [
  "Mumbai Central", "Delhi NCR Hub", "Chennai Port", "Bangalore South",
  "Hyderabad East", "Kolkata Warehouse", "Pune West", "Ahmedabad North"
] as const

const INDIAN_CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata",
  "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Kochi", "Indore", "Bhopal",
  "Coimbatore", "Vizag", "Nagpur", "Surat", "Nashik", "Thiruvananthapuram"
] as const

const CUSTOMER_COMPANIES = [
  "Tata Motors Ltd", "Reliance Retail", "BigBasket (NinjaCart)", "DMart",
  "Spencer's Retail", "Aditya Birla Fashion", "Metro Cash & Carry",
  "Vijay Sales", "Croma (Infiniti Retail)", "Decathlon India",
  "Pepperfry", "Nykaa Man", "Usha International", "Bajaj Electricals",
  "Havells India", "Godrej Appliances", "Whirlpool India", "HP India",
  "Canon India", "Samsung India"
] as const

const RESOLUTION_FLOW = ["Received", "Triaged", "Assigned", "Investigating", "Resolved", "Closed"] as const

// ──────────────────────────────────────────────────────
// Status colors
// ──────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  "Open": "csrc-status-open",
  "In Progress": "csrc-status-in-progress",
  "Escalated": "csrc-status-escalated",
  "Pending Customer": "csrc-status-pending-customer",
  "Resolved": "csrc-status-resolved",
  "Closed": "csrc-status-closed",
}

const PRIORITY_STYLES: Record<string, string> = {
  "Critical": "csrc-priority-critical",
  "High": "csrc-priority-high",
  "Medium": "csrc-priority-medium",
  "Low": "csrc-priority-low",
}

const HEADER_GRADIENTS: Record<string, string> = {
  "Open": "from-amber-500 to-orange-600",
  "In Progress": "from-blue-500 to-indigo-600",
  "Escalated": "from-rose-500 to-pink-600",
  "Pending Customer": "from-purple-500 to-violet-600",
  "Resolved": "from-emerald-500 to-teal-600",
  "Closed": "from-gray-500 to-slate-600",
}

const CSAT_LABELS: Record<string, string> = {
  "5": "Excellent",
  "4": "Good",
  "3": "Average",
  "2": "Poor",
  "1": "Terrible",
}

const PIE_COLORS = ["#f43f5e", "#10b981", "#f59e0b", "#6366f1", "#06b6d4", "#8b5cf6"]
const PIE_COLORS_2 = ["#ec4899", "#14b8a6", "#eab308", "#818cf8", "#22d3ee", "#a78bfa"]

// ──────────────────────────────────────────────────────
// Generate mock data
// ──────────────────────────────────────────────────────
const complaints: Array<{
  id: string; date: string; customer: string; city: string;
  category: string; priority: string; status: string; channel: string;
  description: string; agent: string; csat: number; tatHours: number;
  warehouse: string; orderId: string; creditAmount: number;
  escalationLevel: number; commCount: number; lastUpdate: string;
}> = []

for (let i = 0; i < 120; i++) {
  const status = pick([...STATUSES])
  const priority = pick([...PRIORITIES])
  const category = pick([...CATEGORIES])
  const channel = pick([...CHANNELS])
  const warehouse = pick([...WAREHOUSES])
  const agent = pick([...AGENTS])
  const customer = pick([...CUSTOMER_COMPANIES])
  const city = pick([...INDIAN_CITIES])
  const csat = status === "Resolved" || status === "Closed" ? randInt(1, 5) : 0
  const tatHours = status === "Open" ? randInt(1, 72) :
    status === "In Progress" ? randInt(1, 48) :
    status === "Escalated" ? randInt(24, 96) : randInt(1, 24)
  const creditAmount = (status === "Resolved" || status === "Closed") && rng() > 0.4 ? randInt(100, 50000) : 0

  complaints.push({
    id: `CST-${String(146001 + i).padStart(6, "0")}`,
    date: `2026-07-${String(randInt(1, 28)).padStart(2, "0")}`,
    customer, city, category, priority, status, channel,
    description: `${category} reported by ${customer} - ${pick(["Order not received on expected date", "Product arrived damaged during transit", "Incorrect item delivered", "Quality does not match sample", "Overcharged on invoice", "Missing items in package", "Quantity mismatch in delivery", "Packaging torn and product exposed", "Rude behavior from delivery staff", "Refund not processed after 7 days", "Order cancelled but amount debited", "App showing wrong tracking status"])}`,
    agent: agent.name,
    csat,
    tatHours,
    warehouse,
    orderId: `ORD-${String(2607001 + i).padStart(7, "0")}`,
    creditAmount,
    escalationLevel: status === "Escalated" ? randInt(2, 3) : 1,
    commCount: randInt(1, 12),
    lastUpdate: `${randInt(1, 48)}h ago`,
  })
}

// Monthly data
const monthlyData = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  complaints: randInt(60, 140),
  resolved: randInt(50, 130),
  escalated: randInt(5, 25),
  avgCsat: randFloat(3.2, 4.8),
}))

// Resolution time data
const tatData = Array.from({ length: 7 }, () => ({
  category: pick([...CATEGORIES]),
  avgHours: randFloat(2, 18),
  targetHours: pick([4, 6, 8, 12, 24]),
}))

// Communication log mock
const commLog = Array.from({ length: 8 }, (_, i) => ({
  id: String(i + 1),
  type: i % 2 === 0 ? "inbound" as const : "outbound" as const,
  channel: pick(["Phone", "Email", "WhatsApp", "Chat"]),
  agent: pick([...AGENTS]).name,
  message: pick([
    "Customer called regarding delayed shipment SH-28491. Advised ETA and offered priority tracking.",
    "Sent email with refund confirmation and credit note CN-2026-0341.",
    "WhatsApp message: Customer confirmed receipt of replacement product.",
    "Chat session: Customer inquired about order cancellation policy. Provided detailed explanation.",
    "Phone follow-up: Customer satisfied with resolution. CSAT score: 5/5.",
    "Email sent: Escalation report submitted to logistics team for route review.",
    "WhatsApp: Shared tracking link and estimated delivery window with customer.",
    "Chat: Walked customer through return pickup scheduling process.",
  ]),
  timestamp: `2026-07-28 ${String(randInt(8, 20)).padStart(2, "0")}:${String(randInt(0, 59)).padStart(2, "0")}`,
}))

// ──────────────────────────────────────────────────────
// Helper: format number
// ──────────────────────────────────────────────────────
function fmtNum(n: number): string {
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(n)
}

function fmtINR(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`
}

// ──────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────
export default function CustomerServiceView() {
  const [activeTab, setActiveTab] = useState(0)
  const [statusFilter, setStatusFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState<typeof complaints[0] | null>(null)

  const tabs = ["Dashboard", "Complaints Queue", "Resolution Tracking", "Customer Feedback", "Analytics"]

  // ── Filtered data ──────────────────────────────────
  const filteredComplaints = useMemo(() => {
    let data = [...complaints]
    if (statusFilter !== "All") data = data.filter(c => c.status === statusFilter)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      data = data.filter(c =>
        c.id.toLowerCase().includes(q) ||
        c.customer.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      )
    }
    return data
  }, [statusFilter, searchQuery])

  // ── KPI calculations ──────────────────────────────
  const openCount = complaints.filter(c => c.status === "Open").length
  const escalatedCount = complaints.filter(c => c.status === "Escalated").length
  const resolvedCount = complaints.filter(c => c.status === "Resolved" || c.status === "Closed").length
  const avgCsat = complaints.filter(c => c.csat > 0).reduce((s, c) => s + c.csat, 0) / Math.max(complaints.filter(c => c.csat > 0).length, 1)
  const avgTAT = (complaints.reduce((s, c) => s + c.tatHours, 0) / complaints.length).toFixed(1)
  const totalCredits = complaints.reduce((s, c) => s + c.creditAmount, 0)

  // ── Chart data ────────────────────────────────────
  const categoryPie = CATEGORIES.slice(0, 6).map(cat => ({
    name: cat,
    value: complaints.filter(c => c.category === cat).length,
  }))
  const channelPie = CHANNELS.slice(0, 6).map(ch => ({
    name: ch,
    value: complaints.filter(c => c.channel === ch).length,
  }))
  const statusPie = STATUSES.map(st => ({
    name: st,
    value: complaints.filter(c => c.status === st).length,
  }))
  const warehouseBar = WAREHOUSES.map(wh => ({
    name: wh.split(" ")[0],
    open: complaints.filter(c => c.warehouse === wh && c.status === "Open").length,
    resolved: complaints.filter(c => c.warehouse === wh && (c.status === "Resolved" || c.status === "Closed")).length,
    escalated: complaints.filter(c => c.warehouse === wh && c.status === "Escalated").length,
  }))
  const npsData = {
    promoters: complaints.filter(c => c.csat >= 4).length,
    passives: complaints.filter(c => c.csat === 3).length,
    detractors: complaints.filter(c => c.csat > 0 && c.csat <= 2).length,
  }
  const npsScore = Math.round((npsData.promoters - npsData.detractors) / Math.max(complaints.filter(c => c.csat > 0).length, 1) * 100)

  // Resolution SLA compliance
  const slaCompliance = WAREHOUSES.map(wh => ({
    name: wh.split(" ")[0],
    withinSLA: randInt(60, 95),
    breached: randInt(5, 40),
  }))

  // Daily volume
  const dailyVolume = Array.from({ length: 28 }, (_, i) => ({
    day: String(i + 1),
    received: randInt(3, 12),
    resolved: randInt(2, 10),
  }))

  // Agent performance
  const agentPerf = AGENTS.map(a => ({
    name: a.name.split(" ")[0],
    resolved: a.resolved + randInt(-20, 20),
    avgTAT: parseFloat(a.avgTAT),
    csat: a.rating,
  }))

  // Credit note data
  const creditByCategory = CATEGORIES.slice(0, 6).map(cat => ({
    category: cat.split(" ")[0],
    amount: complaints.filter(c => c.category === cat).reduce((s, c) => s + c.creditAmount, 0),
  }))

  // Customer satisfaction distribution
  const csatDist = [5, 4, 3, 2, 1].map(score => ({
    score: String(score),
    label: CSAT_LABELS[score],
    count: complaints.filter(c => c.csat === score).length,
  }))

  // ── Open drawer ───────────────────────────────────
  const openDrawer = (c: typeof complaints[0]) => {
    setSelectedComplaint(c)
    setDrawerOpen(true)
  }

  // ── Close drawer ──────────────────────────────────
  const closeDrawer = () => {
    setDrawerOpen(false)
    setSelectedComplaint(null)
  }

  // ── Status counts for filter cards ────────────────
  const statusCounts: Record<string, number> = {
    "All": complaints.length,
    ...Object.fromEntries(STATUSES.map(s => [s, complaints.filter(c => c.status === s).length])),
  }

  // ── Get current flow step ─────────────────────────
  const getCurrentStep = (status: string): number => {
    const map: Record<string, number> = {
      "Open": 0, "In Progress": 2, "Escalated": 3,
      "Pending Customer": 4, "Resolved": 4, "Closed": 5,
    }
    return map[status] ?? 0
  }

  // ── Pie chart cell colors (extracted as const) ────
  const catPieColors = PIE_COLORS
  const chPieColors = PIE_COLORS_2
  const stPieColors = ["#f59e0b", "#3b82f6", "#f43f5e", "#8b5cf6", "#10b981", "#6b7280"]

  // ══════════════════════════════════════════════════
  // TAB 0: Dashboard
  // ══════════════════════════════════════════════════
  function renderDashboard() {
    return (
      <Fragment>
        {/* KPI Row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "Open Tickets", value: openCount, icon: MessageCircle, color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400", trend: "+12%", up: false },
            { label: "Escalated", value: escalatedCount, icon: AlertTriangle, color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400", trend: "-8%", up: true },
            { label: "Resolved", value: resolvedCount, icon: CheckCircle2, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400", trend: "+15%", up: true },
            { label: "Avg CSAT", value: avgCsat.toFixed(1), icon: Star, color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400", trend: "+0.3", up: true },
            { label: "Avg TAT (hrs)", value: avgTAT, icon: Clock, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400", trend: "-1.2h", up: true },
            { label: "Total Credits", value: fmtINR(totalCredits), icon: IndianRupee, color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400", trend: "+5%", up: false },
          ].map((kpi, idx) => (
            <div key={idx} className="csrc-kpi-card">
              <div className="flex items-start justify-between">
                <div className="csrc-kpi-label">{kpi.label}</div>
                <div className={`csrc-kpi-icon ${kpi.color}`}>
                  <kpi.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-1 csrc-kpi-value">{String(kpi.value)}</div>
              <div className={`mt-1 csrc-kpi-trend ${kpi.up ? "csrc-kpi-trend-up" : "csrc-kpi-trend-down"}`}>
                {kpi.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {kpi.trend} vs last month
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Monthly Volume */}
          <Card className="hover-lift-sm border-rose-100 dark:border-rose-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <BarChart3 className="h-4 w-4 text-rose-500" />
                Monthly Complaint Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <ComposedChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} tickFormatter={v => String(v)} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Bar dataKey="complaints" fill="#f43f5e" radius={[2, 2, 0, 0]} name="Received" />
                  <Bar dataKey="resolved" fill="#10b981" radius={[2, 2, 0, 0]} name="Resolved" />
                  <Line dataKey="avgCsat" stroke="#f59e0b" strokeWidth={2} dot={false} name="Avg CSAT" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="hover-lift-sm border-rose-100 dark:border-rose-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <PieChart className="h-4 w-4 text-emerald-500" />
                Complaint Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={categoryPie} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {categoryPie.map((_, idx) => {
                      const tc = [...catPieColors]
                      return <Cell key={String(idx)} fill={tc[idx]} />
                    })}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Channel Distribution */}
          <Card className="hover-lift-sm border-rose-100 dark:border-rose-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Phone className="h-4 w-4 text-amber-500" />
                Channel Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={channelPie} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {channelPie.map((_, idx) => {
                      const tc = [...chPieColors]
                      return <Cell key={String(idx)} fill={tc[idx]} />
                    })}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Warehouse Breakdown */}
          <Card className="hover-lift-sm border-rose-100 dark:border-rose-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Target className="h-4 w-4 text-blue-500" />
                Complaints by Warehouse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={warehouseBar}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Bar dataKey="open" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} name="Open" />
                  <Bar dataKey="resolved" stackId="a" fill="#10b981" radius={[2, 2, 0, 0]} name="Resolved" />
                  <Bar dataKey="escalated" stackId="a" fill="#f43f5e" radius={[2, 2, 0, 0]} name="Escalated" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card className="hover-lift-sm border-rose-100 dark:border-rose-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Filter className="h-4 w-4 text-purple-500" />
                Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={statusPie} cx="50%" cy="50%" outerRadius={70} paddingAngle={2} dataKey="value" label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {statusPie.map((_, idx) => {
                      const tc = [...stPieColors]
                      return <Cell key={String(idx)} fill={tc[idx]} />
                    })}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* NPS Score */}
          <Card className="hover-lift-sm border-rose-100 dark:border-rose-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4 text-amber-500" />
                NPS Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-3">
                <div className={`csrc-gauge ${npsScore >= 50 ? "csrc-gauge-excellent" : npsScore >= 0 ? "csrc-gauge-average" : "csrc-gauge-poor"}`}>
                  <div className="text-center">
                    <div className="csrc-gauge-value">{npsScore > 0 ? `+${npsScore}` : npsScore}</div>
                    <div className="csrc-gauge-label">NPS</div>
                  </div>
                </div>
                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-600 dark:text-emerald-400">Promoters (9-10)</span>
                    <span className="font-medium">{npsData.promoters}</span>
                  </div>
                  <div className="csrc-progress-track">
                    <div className="csrc-progress-fill csrc-progress-fill-green" style={{ width: `${(npsData.promoters / Math.max(complaints.filter(c => c.csat > 0).length, 1)) * 100}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-600 dark:text-amber-400">Passives (7-8)</span>
                    <span className="font-medium">{npsData.passives}</span>
                  </div>
                  <div className="csrc-progress-track">
                    <div className="csrc-progress-fill csrc-progress-fill-amber" style={{ width: `${(npsData.passives / Math.max(complaints.filter(c => c.csat > 0).length, 1)) * 100}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-rose-600 dark:text-rose-400">Detractors (0-6)</span>
                    <span className="font-medium">{npsData.detractors}</span>
                  </div>
                  <div className="csrc-progress-track">
                    <div className="csrc-progress-fill csrc-progress-fill-red" style={{ width: `${(npsData.detractors / Math.max(complaints.filter(c => c.csat > 0).length, 1)) * 100}%` }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Complaints + Alerts */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Recent Complaints */}
          <Card className="hover-lift-sm border-rose-100 dark:border-rose-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Clock className="h-4 w-4 text-rose-500" />
                Recent Complaints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {complaints.slice(0, 8).map((c, idx) => (
                  <div
                    key={c.id}
                    className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-100 px-3 py-2 transition-colors hover:bg-rose-50/50 dark:border-gray-800 dark:hover:bg-rose-950/10"
                    onClick={() => openDrawer(c)}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`csrc-status-badge ${STATUS_STYLES[c.status]}`}>{c.status.split(" ")[0]}</span>
                      <div>
                        <div className="text-xs font-medium text-gray-900 dark:text-gray-100">{c.id}</div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">{c.customer} - {c.category}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {c.csat > 0 && (
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} className={`h-2.5 w-2.5 ${s <= c.csat ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                          ))}
                        </div>
                      )}
                      <ChevronRight className="h-3 w-3 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card className="hover-lift-sm border-rose-100 dark:border-rose-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Service Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { type: "critical", icon: AlertTriangle, title: "5 Critical complaints unresolved for 48+ hours", desc: "Delivery delays in Delhi NCR Hub - logistics team notified" },
                  { type: "warning", icon: Clock, title: "12 complaints approaching SLA breach (within 2hrs)", desc: "Mixed categories across Mumbai and Bangalore warehouses" },
                  { type: "warning", icon: TrendingDown, title: "CSAT score dropped below 4.0 for Packaging Damage", desc: "3-week downward trend - quality team review scheduled" },
                  { type: "info", icon: Users, title: "Agent Sneha Gupta achieved 100% resolution rate today", desc: "Outstanding performance - 8 tickets resolved in 6 hours" },
                  { type: "critical", icon: IndianRupee, title: "Credit note backlog: ₹2.4L pending approval", desc: "3 high-value credits awaiting finance team sign-off" },
                  { type: "info", icon: Award, title: "Customer Reliance Retail gave 5-star satisfaction", desc: "Acknowledged prompt handling of their bulk order issue" },
                ].map((alert, idx) => (
                  <div key={idx} className={`csrc-alert csrc-alert-${alert.type}`}>
                    <alert.icon className={`h-4 w-4 shrink-0 mt-0.5 ${alert.type === "critical" ? "text-red-500" : alert.type === "warning" ? "text-amber-500" : "text-blue-500"}`} />
                    <div>
                      <div className="text-xs font-semibold text-gray-900 dark:text-gray-100">{alert.title}</div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400">{alert.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Fragment>
    )
  }

  // ══════════════════════════════════════════════════
  // TAB 1: Complaints Queue
  // ══════════════════════════════════════════════════
  function renderComplaintsQueue() {
    return (
      <Fragment>
        {/* Status Filter Cards */}
        <div className="flex flex-wrap gap-2">
          {(["All", ...STATUSES] as Array<string>).map(s => (
            <button
              key={s}
              className={`csrc-status-card ${statusFilter === s ? "csrc-status-card-active" : "border-gray-200 dark:border-gray-700"}`}
              onClick={() => setStatusFilter(s)}
            >
              <span className={`csrc-status-badge ${STATUS_STYLES[s] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"}`}>
                {s}
              </span>
              <span className="text-gray-500 dark:text-gray-400">{statusCounts[s] || 0}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, customer, category, or description..."
              className="csrc-search w-full pl-9"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <Badge variant="outline" className="badge-interactive text-xs">
            {filteredComplaints.length} tickets
          </Badge>
        </div>

        {/* Table */}
        <div className="csrc-table-wrap">
          <table className="csrc-table">
            <thead className="csrc-table-head">
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>City</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Channel</th>
                <th>Agent</th>
                <th>TAT (hrs)</th>
                <th>CSAT</th>
                <th>Credit</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.slice(0, 30).map(c => (
                <tr key={c.id} className="csrc-table-row">
                  <td className="font-mono text-xs font-semibold text-rose-600 dark:text-rose-400">{c.id}</td>
                  <td className="text-xs font-medium">{c.customer}</td>
                  <td className="text-xs text-gray-500 dark:text-gray-400">{c.city}</td>
                  <td>
                    <span className="csrc-cat-badge">{c.category.split(" ")[0]}</span>
                  </td>
                  <td>
                    <span className={`csrc-status-badge ${PRIORITY_STYLES[c.priority]}`}>{c.priority}</span>
                  </td>
                  <td>
                    <span className="csrc-channel-badge">{c.channel}</span>
                  </td>
                  <td className="text-xs">{c.agent}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16">
                        <div className="csrc-progress-track">
                          <div
                            className={`csrc-progress-fill ${c.tatHours > 24 ? "csrc-progress-fill-red" : c.tatHours > 12 ? "csrc-progress-fill-amber" : "csrc-progress-fill-green"}`}
                            style={{ width: `${Math.min((c.tatHours / 48) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs font-medium">{String(c.tatHours)}</span>
                    </div>
                  </td>
                  <td>
                    {c.csat > 0 ? (
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={`h-2.5 w-2.5 ${s <= c.csat ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                        ))}
                      </div>
                    ) : <span className="text-xs text-gray-400">—</span>}
                  </td>
                  <td className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {c.creditAmount > 0 ? fmtINR(c.creditAmount) : "—"}
                  </td>
                  <td>
                    <span className={`csrc-status-badge ${STATUS_STYLES[c.status]}`}>{c.status.split(" ")[0]}</span>
                  </td>
                  <td>
                    <button onClick={() => openDrawer(c)} className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-rose-600 dark:hover:bg-gray-800">
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Fragment>
    )
  }

  // ══════════════════════════════════════════════════
  // TAB 2: Resolution Tracking
  // ══════════════════════════════════════════════════
  function renderResolutionTracking() {
    const inProgress = complaints.filter(c => ["In Progress", "Escalated"].includes(c.status))
    const recentResolved = complaints.filter(c => c.status === "Resolved").slice(0, 20)
    const totalCreditPending = complaints.filter(c => c.creditAmount > 0 && c.status !== "Closed").reduce((s, c) => s + c.creditAmount, 0)

    return (
      <Fragment>
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Active Tickets", value: inProgress.length, icon: RotateCcw, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
            { label: "Pending Credits", value: fmtINR(totalCreditPending), icon: CreditCard, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
            { label: "Escalation Rate", value: `${((escalatedCount / complaints.length) * 100).toFixed(1)}%`, icon: TrendingUp, color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" },
            { label: "SLA Compliance", value: "87.3%", icon: Target, color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
          ].map((kpi, idx) => (
            <div key={idx} className="csrc-kpi-card">
              <div className="flex items-start justify-between">
                <div className="csrc-kpi-label">{kpi.label}</div>
                <div className={`csrc-kpi-icon ${kpi.color}`}>
                  <kpi.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-1 csrc-kpi-value">{String(kpi.value)}</div>
            </div>
          ))}
        </div>

        {/* Active Complaints with Flow */}
        <Card className="hover-lift-sm border-rose-100 dark:border-rose-900/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <RotateCcw className="h-4 w-4 text-blue-500" />
              Active Complaints Resolution Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inProgress.slice(0, 12).map(c => {
                const currentStep = getCurrentStep(c.status)
                return (
                  <div
                    key={c.id}
                    className="flex cursor-pointer flex-col gap-3 rounded-lg border border-gray-100 p-3 transition-colors hover:bg-rose-50/50 dark:border-gray-800 dark:hover:bg-rose-950/10"
                    onClick={() => openDrawer(c)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-rose-600 dark:text-rose-400">{c.id}</span>
                        <span className={`csrc-status-badge ${PRIORITY_STYLES[c.priority]}`}>{c.priority}</span>
                        <span className={`csrc-status-badge ${STATUS_STYLES[c.status]}`}>{c.status}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{c.agent}</span>
                        <ChevronRight className="h-3 w-3 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">{c.customer} - {c.category}</span>
                      <span className="text-gray-400">{String(c.tatHours)}h elapsed</span>
                    </div>
                    {/* Resolution Flow Steps */}
                    <div className="flex items-center justify-between">
                      {RESOLUTION_FLOW.map((step, sIdx) => (
                        <Fragment key={step}>
                          <div className="csrc-flow-step">
                            <div className={`csrc-flow-circle ${sIdx < currentStep ? "csrc-flow-circle-done" : sIdx === currentStep ? "csrc-flow-circle-current" : "csrc-flow-circle-pending"}`}>
                              {sIdx < currentStep ? <CheckCircle2 className="h-3.5 w-3.5" /> : sIdx + 1}
                            </div>
                            <span className="text-[9px] text-gray-500 dark:text-gray-400">{step}</span>
                          </div>
                          {sIdx < RESOLUTION_FLOW.length - 1 && (
                            <div className={`csrc-flow-line ${sIdx < currentStep ? "csrc-flow-line-done" : "csrc-flow-line-pending"}`} />
                          )}
                        </Fragment>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Agent Workload */}
        <Card className="hover-lift-sm border-rose-100 dark:border-rose-900/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Users className="h-4 w-4 text-purple-500" />
              Agent Workload Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
              {AGENTS.slice(0, 8).map(a => {
                const assigned = complaints.filter(c => c.agent === a.name && ["In Progress", "Escalated", "Open"].includes(c.status)).length
                return (
                  <div key={a.id} className="csrc-agent-card">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`csrc-agent-avatar ${a.avatar}`}>
                        {a.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-900 dark:text-gray-100">{a.name}</div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">{a.dept}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[10px]">
                      <div className="text-gray-500 dark:text-gray-400">Active:</div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{String(assigned)}</div>
                      <div className="text-gray-500 dark:text-gray-400">Resolved:</div>
                      <div className="font-medium text-emerald-600 dark:text-emerald-400">{String(a.resolved)}</div>
                      <div className="text-gray-500 dark:text-gray-400">Rating:</div>
                      <div className="flex items-center gap-0.5 font-medium text-amber-600 dark:text-amber-400">
                        <Star className="h-2.5 w-2.5 fill-amber-400" />
                        {String(a.rating)}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">Avg TAT:</div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{a.avgTAT}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </Fragment>
    )
  }

  // ══════════════════════════════════════════════════
  // TAB 3: Customer Feedback
  // ══════════════════════════════════════════════════
  function renderCustomerFeedback() {
    const feedbacked = complaints.filter(c => c.csat > 0)
    const topCustomers = CUSTOMER_COMPANIES.slice(0, 8).map(comp => ({
      name: comp.split(" ").slice(0, 2).join(" "),
      complaints: complaints.filter(c => c.customer === comp).length,
      avgCsat: complaints.filter(c => c.customer === comp && c.csat > 0).reduce((s, c) => s + c.csat, 0) / Math.max(complaints.filter(c => c.customer === comp && c.csat > 0).length, 1),
      resolved: complaints.filter(c => c.customer === comp && (c.status === "Resolved" || c.status === "Closed")).length,
    }))

    return (
      <Fragment>
        {/* CSAT Overview */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Overall CSAT", value: avgCsat.toFixed(1), icon: Star, sub: "/ 5.0", color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
            { label: "5-Star Reviews", value: feedbacked.filter(c => c.csat === 5).length, icon: ThumbsUp, sub: `${((feedbacked.filter(c => c.csat === 5).length / Math.max(feedbacked.length, 1)) * 100).toFixed(0)}%`, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
            { label: "NPS Score", value: npsScore > 0 ? `+${npsScore}` : npsScore, icon: Sparkles, sub: npsScore >= 50 ? "Excellent" : "Good", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" },
            { label: "Response Rate", value: "78%", icon: MessageSquare, sub: "+5% vs LMo", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
          ].map((kpi, idx) => (
            <div key={idx} className="csrc-kpi-card">
              <div className="flex items-start justify-between">
                <div className="csrc-kpi-label">{kpi.label}</div>
                <div className={`csrc-kpi-icon ${kpi.color}`}>
                  <kpi.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-1 csrc-kpi-value">{String(kpi.value)}</div>
              <div className="csrc-kpi-label">{kpi.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* CSAT Distribution */}
          <Card className="hover-lift-sm border-rose-100 dark:border-rose-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Star className="h-4 w-4 text-amber-500" />
                Satisfaction Score Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={csatDist}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="score" tick={{ fontSize: 10 }} label={{ value: "Stars", position: "bottom", fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {csatDist.map((_, idx) => {
                      const colors = ["#10b981", "#22c55e", "#f59e0b", "#f97316", "#f43f5e"]
                      const tc = [...colors]
                      return <Cell key={String(idx)} fill={tc[idx]} />
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-2 flex flex-wrap justify-center gap-3">
                {csatDist.map(d => (
                  <div key={d.score} className="flex items-center gap-1 text-[10px]">
                    <div className="h-2 w-2 rounded-full" style={{
                      backgroundColor: d.score === "5" ? "#10b981" : d.score === "4" ? "#22c55e" : d.score === "3" ? "#f59e0b" : d.score === "2" ? "#f97316" : "#f43f5e"
                    }} />
                    <span className="text-gray-500 dark:text-gray-400">{d.score}★ ({d.label}): {d.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Customer Satisfaction */}
          <Card className="hover-lift-sm border-rose-100 dark:border-rose-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Award className="h-4 w-4 text-purple-500" />
                Customer Satisfaction Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {topCustomers.filter(c => c.complaints > 0).sort((a, b) => b.avgCsat - a.avgCsat).map((cust, idx) => (
                  <div key={cust.name} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-600 text-[10px] font-bold text-white">{String(idx + 1)}</span>
                      <div>
                        <div className="text-xs font-medium text-gray-900 dark:text-gray-100">{cust.name}</div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">{String(cust.complaints)} complaints, {String(cust.resolved)} resolved</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className={`h-3 w-3 ${s <= Math.round(cust.avgCsat) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                      ))}
                      <span className="ml-1 text-xs font-medium text-gray-600 dark:text-gray-400">{cust.avgCsat.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Credit Notes Summary */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="hover-lift-sm border-rose-100 dark:border-rose-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <CreditCard className="h-4 w-4 text-emerald-500" />
                Credit Notes by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={creditByCategory} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => `₹${fmtNum(v)}`} />
                  <YAxis type="category" dataKey="category" tick={{ fontSize: 10 }} width={70} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => [fmtINR(v), "Amount"]} />
                  <Bar dataKey="amount" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Communication Channel Performance */}
          <Card className="hover-lift-sm border-rose-100 dark:border-rose-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <PhoneCall className="h-4 w-4 text-cyan-500" />
                Channel Performance (Avg CSAT)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={CHANNELS.slice(0, 6).map(ch => ({
                  channel: ch,
                  csat: parseFloat((complaints.filter(c => c.channel === ch && c.csat > 0).reduce((s, c) => s + c.csat, 0) / Math.max(complaints.filter(c => c.channel === ch && c.csat > 0).length, 1)).toFixed(1)),
                }))}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="channel" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} domain={[0, 5]} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Bar dataKey="csat" radius={[4, 4, 0, 0]}>
                    {CHANNELS.slice(0, 6).map((_, idx) => {
                      const colors = ["#06b6d4", "#3b82f6", "#22c55e", "#f59e0b", "#f43f5e", "#8b5cf6"]
                      const tc = [...colors]
                      return <Cell key={String(idx)} fill={tc[idx]} />
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </Fragment>
    )
  }

  // ══════════════════════════════════════════════════
  // TAB 4: Analytics
  // ══════════════════════════════════════════════════
  function renderAnalytics() {
    return (
      <Fragment>
        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total Complaints", value: fmtNum(complaints.length), icon: MessageCircle, color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" },
            { label: "Resolution Rate", value: `${((resolvedCount / complaints.length) * 100).toFixed(1)}%`, icon: CheckCircle2, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
            { label: "Avg Resolution TAT", value: `${avgTAT}h`, icon: Clock, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
            { label: "First Contact Resolution", value: "68%", icon: Target, color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
          ].map((kpi, idx) => (
            <div key={idx} className="csrc-kpi-card">
              <div className="flex items-start justify-between">
                <div className="csrc-kpi-label">{kpi.label}</div>
                <div className={`csrc-kpi-icon ${kpi.color}`}>
                  <kpi.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-1 csrc-kpi-value">{String(kpi.value)}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Daily Volume Trend */}
          <Card className="hover-lift-sm border-rose-100 dark:border-rose-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                Daily Volume (July 2026)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={dailyVolume}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="day" tick={{ fontSize: 9 }} interval={2} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Area type="monotone" dataKey="received" fill="#f43f5e" fillOpacity={0.15} stroke="#f43f5e" strokeWidth={2} name="Received" />
                  <Area type="monotone" dataKey="resolved" fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={2} name="Resolved" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* SLA Compliance by Warehouse */}
          <Card className="hover-lift-sm border-rose-100 dark:border-rose-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Target className="h-4 w-4 text-emerald-500" />
                SLA Compliance by Warehouse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={slaCompliance}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => [`${v}%`]} />
                  <Bar dataKey="withinSLA" stackId="a" fill="#10b981" radius={[2, 2, 0, 0]} name="Within SLA" />
                  <Bar dataKey="breached" stackId="a" fill="#f43f5e" radius={[2, 2, 0, 0]} name="Breached" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Agent Performance */}
          <Card className="hover-lift-sm border-rose-100 dark:border-rose-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Users className="h-4 w-4 text-indigo-500" />
                Agent Performance Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <ComposedChart data={agentPerf}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} domain={[0, 5]} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar yAxisId="left" dataKey="resolved" fill="#6366f1" radius={[4, 4, 0, 0]} name="Resolved" />
                  <Line yAxisId="right" dataKey="csat" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="CSAT" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* TAT by Category */}
          <Card className="hover-lift-sm border-rose-100 dark:border-rose-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Clock className="h-4 w-4 text-orange-500" />
                Avg Resolution Time by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={tatData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis type="number" tick={{ fontSize: 10 }} label={{ value: "Hours", position: "bottom", fontSize: 10 }} />
                  <YAxis type="category" dataKey="category" tick={{ fontSize: 9 }} width={80} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => [`${v}h`]} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="avgHours" fill="#f43f5e" radius={[0, 4, 4, 0]} name="Actual" />
                  <Bar dataKey="targetHours" fill="#10b981" radius={[0, 4, 4, 0]} name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Monthly CSAT Trend */}
        <Card className="hover-lift-sm border-rose-100 dark:border-rose-900/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Monthly CSAT & Escalation Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} domain={[0, 5]} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar yAxisId="left" dataKey="escalated" fill="#f43f5e" radius={[2, 2, 0, 0]} name="Escalated" />
                <Line yAxisId="right" dataKey="avgCsat" stroke="#10b981" strokeWidth={2} dot={false} name="Avg CSAT" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Fragment>
    )
  }

  // ══════════════════════════════════════════════════
  // DRAWER: Complaint Detail
  // ══════════════════════════════════════════════════
  function renderDrawer() {
    if (!selectedComplaint) return null
    const c = selectedComplaint
    const currentStep = getCurrentStep(c.status)
    const gradientClass = HEADER_GRADIENTS[c.status] || "from-gray-500 to-slate-600"

    return (
      <div className="csrc-drawer-overlay" onClick={closeDrawer}>
        <div className="csrc-drawer-panel" onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className={`csrc-drawer-header-gradient bg-gradient-to-r ${gradientClass} text-white`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Headset className="h-5 w-5" />
                  <span className="text-lg font-bold">{c.id}</span>
                </div>
                <div className="mt-1 text-sm opacity-90">{c.customer}</div>
                <div className="mt-1 text-xs opacity-75">{c.city} | {c.warehouse}</div>
              </div>
              <button onClick={closeDrawer} className="rounded-lg bg-white/20 p-1.5 transition-colors hover:bg-white/30">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold">{c.status}</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold">{c.priority}</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold">{c.channel}</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold">{c.category}</span>
            </div>
          </div>

          <div className="csrc-drawer-body">
            {/* Resolution Flow */}
            <div className="csrc-drawer-section">
              <div className="csrc-drawer-section-title">Resolution Progress</div>
              <div className="flex items-center justify-between">
                {RESOLUTION_FLOW.map((step, sIdx) => (
                  <Fragment key={step}>
                    <div className="csrc-flow-step">
                      <div className={`csrc-flow-circle ${sIdx < currentStep ? "csrc-flow-circle-done" : sIdx === currentStep ? "csrc-flow-circle-current" : "csrc-flow-circle-pending"}`}>
                        {sIdx < currentStep ? <CheckCircle2 className="h-3.5 w-3.5" /> : sIdx + 1}
                      </div>
                      <span className="text-[9px] text-gray-500 dark:text-gray-400">{step}</span>
                    </div>
                    {sIdx < RESOLUTION_FLOW.length - 1 && (
                      <div className={`csrc-flow-line ${sIdx < currentStep ? "csrc-flow-line-done" : "csrc-flow-line-pending"}`} />
                    )}
                  </Fragment>
                ))}
              </div>
            </div>

            {/* TAT Progress */}
            {c.status !== "Closed" && (
              <div className="csrc-drawer-section">
                <div className="csrc-drawer-section-title">Time to Resolution</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="csrc-progress-track">
                      <div
                        className={`csrc-progress-fill ${c.tatHours > 24 ? "csrc-progress-fill-red" : c.tatHours > 12 ? "csrc-progress-fill-amber" : "csrc-progress-fill-green"}`}
                        style={{ width: `${Math.min((c.tatHours / 48) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{String(c.tatHours)}h / 48h SLA</span>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="csrc-drawer-section">
              <div className="csrc-drawer-section-title">Complaint Description</div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{c.description}</p>
            </div>

            {/* Info Grid */}
            <div className="csrc-drawer-section">
              <div className="csrc-drawer-section-title">Details</div>
              <div className="csrc-drawer-field-grid">
                {[
                  { label: "Date", value: c.date },
                  { label: "Order ID", value: c.orderId },
                  { label: "Warehouse", value: c.warehouse },
                  { label: "Agent", value: c.agent },
                  { label: "TAT (hrs)", value: String(c.tatHours) },
                  { label: "Escalation Level", value: `L${String(c.escalationLevel)}` },
                  { label: "Communications", value: String(c.commCount) },
                  { label: "Last Update", value: c.lastUpdate },
                ].map((f, idx) => (
                  <div key={idx} className="csrc-drawer-field">
                    <div className="csrc-drawer-field-label">{f.label}</div>
                    <div className="csrc-drawer-field-value">{f.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Credit Note */}
            {c.creditAmount > 0 && (
              <div className="csrc-drawer-section">
                <div className="csrc-drawer-section-title">Credit Note</div>
                <div className="csrc-credit-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs font-medium text-emerald-800 dark:text-emerald-300">Approved Credit</span>
                    </div>
                    <span className="csrc-credit-value">{fmtINR(c.creditAmount)}</span>
                  </div>
                  <div className="mt-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                    Credit Note: CN-2026-{String(randInt(1000, 9999))} | GST 18% applicable
                  </div>
                </div>
              </div>
            )}

            {/* CSAT Rating */}
            {c.csat > 0 && (
              <div className="csrc-drawer-section">
                <div className="csrc-drawer-section-title">Customer Satisfaction</div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`h-5 w-5 ${s <= c.csat ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{String(c.csat)}/5 — {CSAT_LABELS[String(c.csat)]}</span>
                </div>
              </div>
            )}

            {/* Communication Log */}
            <div className="csrc-drawer-section">
              <div className="csrc-drawer-section-title">Communication Log</div>
              <div className="space-y-2">
                {commLog.map(entry => (
                  <div key={entry.id} className={`csrc-comm-entry ${entry.type === "inbound" ? "csrc-comm-inbound" : "csrc-comm-outbound"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {entry.type === "inbound" ? <PhoneCall className="h-3 w-3 text-blue-500" /> : <Send className="h-3 w-3 text-emerald-500" />}
                        <span className="text-[10px] font-semibold text-gray-700 dark:text-gray-300">{entry.type === "inbound" ? "Customer" : entry.agent}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="csrc-channel-badge">{entry.channel}</span>
                        <span className="text-[10px] text-gray-400">{entry.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{entry.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="csrc-drawer-section">
              <div className="csrc-drawer-section-title">Actions</div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" className="press-scale bg-rose-600 text-white hover:bg-rose-700 gap-1">
                  <Phone className="h-3.5 w-3.5" /> Call Customer
                </Button>
                <Button size="sm" variant="outline" className="press-scale btn-outline-animate gap-1">
                  <Mail className="h-3.5 w-3.5" /> Send Email
                </Button>
                <Button size="sm" variant="outline" className="press-scale btn-outline-animate gap-1">
                  <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
                </Button>
                <Button size="sm" variant="outline" className="press-scale btn-outline-animate gap-1">
                  <FileText className="h-3.5 w-3.5" /> Credit Note
                </Button>
                <Button size="sm" variant="outline" className="press-scale btn-outline-animate gap-1">
                  <ArrowRight className="h-3.5 w-3.5" /> Escalate
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════
  // MAIN RENDER
  // ══════════════════════════════════════════════════
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg">
            <Headset className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-50">Customer Service & Resolution</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Complaint management, CSAT tracking, and credit notes</p>
          </div>
        </div>
        <Badge className="badge-interactive bg-gradient-to-r from-rose-500 to-pink-600 text-white border-0">
          {fmtNum(complaints.length)} Tickets
        </Badge>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-medium transition-all duration-150 ${
              activeTab === idx
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-gray-50"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab(idx)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="csrc-tab-content">
        {activeTab === 0 && renderDashboard()}
        {activeTab === 1 && renderComplaintsQueue()}
        {activeTab === 2 && renderResolutionTracking()}
        {activeTab === 3 && renderCustomerFeedback()}
        {activeTab === 4 && renderAnalytics()}
      </div>

      {/* Drawer */}
      {drawerOpen && renderDrawer()}
    </div>
  )
}
