"use client"

import React, { useState, useMemo } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { useToast } from "@/hooks/use-toast-helper"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts"
import {
  Network, MapPin, Clock, IndianRupee, TrendingUp, Target,
  ArrowUpRight, ArrowDownRight, Search, Eye, Filter,
  Zap, ShieldAlert, CheckCircle2, XCircle, AlertTriangle,
  BarChart3, Star, Activity, Gauge, RefreshCw, Download,
  Globe, Handshake, FileText, CreditCard, type LucideIcon,
} from "lucide-react"

// ============================================================================
// Helpers
// ============================================================================
function seededRandom(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  s = (s * 16807) % 2147483647
  return (s - 1) / 2147483646
}
const pick = <T,>(arr: readonly T[], seed: number) =>
  arr[Math.floor(seededRandom(seed) * arr.length)]
const ri = (min: number, max: number, seed: number) =>
  Math.floor(seededRandom(seed) * (max - min + 1)) + min
const formatINR = (n: number) =>
  n >= 10000000 ? `₹${(n / 10000000).toFixed(2)} Cr`
  : n >= 100000 ? `₹${(n / 100000).toFixed(2)} L`
  : `₹${n.toLocaleString("en-IN")}`

// ============================================================================
// Enums
// ============================================================================
const PARTNER_TYPES = ["Full-Service 3PL", "Warehousing Only", "Transport Only", "E-commerce Fulfillment", "Cold Chain", "Last-Mile", "Cross-Dock", "Value-Added Services"] as const
const PARTNER_STATUSES = ["Active", "Onboarding", "Under Review", "Suspended", "Terminated", "Probation", "Trial", "Migrated"] as const
const INTEGRATION_STATUSES = ["Synced", "Pending Sync", "Failed", "Partial", "Reprocessing", "Queued", "Manual Override", "Legacy"] as const
const API_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "WEBHOOK"] as const
const API_STATUSES = ["Healthy", "Degraded", "Down", "Maintenance", "Rate Limited", "Deprecated"] as const
const CONTRACT_STATUSES = ["Active", "Pending Approval", "Under Negotiation", "Expiring Soon", "Expired", "Terminated", "Renewed", "Amended"] as const
const BILLING_CYCLES = ["Monthly", "Quarterly", "Annual", "Per-Shipment", "Volume-Based", "Hybrid"] as const
const INDIAN_3PL = [
  "Delhivery Pvt Ltd", "Blue Dart Express", "DTDC Express", "Ecom Express",
  "Xpressbees Logistics", "Shadowfax", "Spoton Logistics", "Pickrr Technologies",
  "NimbusPost", "Shiprocket Fulfillment", "DartHQ Logistics", "VRL Logistics",
  "TCI Express", "Gati Ltd", "Allcargo Logistics", "SafeExpress",
] as const
const INDIAN_CITIES = ["Mumbai", "Delhi NCR", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Nagpur", "Indore"] as const
const REGIONS = ["West India", "North India", "South India", "East India", "Central India", "Pan India", "Metro Only", "Tier-2 Cities"] as const
const INDIAN_CONTACTS = [
  "Rajesh Kumar", "Priya Sharma", "Arun Patel", "Sneha Reddy", "Vikram Singh",
  "Ananya Iyer", "Karthik Menon", "Deepa Nair", "Sanjay Gupta", "Meera Joshi",
  "Rohit Verma", "Pooja Agarwal", "Amit Bose", "Kavitha Krishnan", "Manish Tiwari",
  "Divya Saxena", "Suresh Pillai", "Lakshmi Rao", "Nikhil Deshmukh", "Ritu Malhotra",
] as const

const PIE_COLORS = ["#6366f1", "#059669", "#ea580c", "#0891b2", "#e11d48", "#d97706", "#7c3aed", "#0d9488"]

// ============================================================================
// Color Maps
// ============================================================================
const PARTNER_STATUS_COLORS: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  Onboarding: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 tpl-pulse-active",
  "Under Review": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 tpl-pulse-warning",
  Suspended: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 tpl-pulse-error",
  Terminated: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  Probation: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  Trial: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 tpl-pulse-active",
  Migrated: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
}
const PARTNER_TYPE_EMOJI: Record<string, string> = {
  "Full-Service 3PL": "🏢", "Warehousing Only": "🏭", "Transport Only": "🚛",
  "E-commerce Fulfillment": "📦", "Cold Chain": "❄️", "Last-Mile": "🛵",
  "Cross-Dock": "🔄", "Value-Added Services": "⚙️",
}
const INTEGRATION_STATUS_COLORS: Record<string, string> = {
  Synced: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Pending Sync": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 tpl-pulse-active",
  Failed: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 tpl-pulse-error",
  Partial: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 tpl-pulse-warning",
  Reprocessing: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 tpl-pulse-active",
  Queued: "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300",
  "Manual Override": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  Legacy: "bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400",
}
const API_STATUS_COLORS: Record<string, string> = {
  Healthy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  Degraded: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 tpl-pulse-warning",
  Down: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 tpl-pulse-error",
  Maintenance: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 tpl-pulse-active",
  "Rate Limited": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  Deprecated: "bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400",
}
const METHOD_COLORS: Record<string, string> = {
  GET: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  POST: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  PUT: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  PATCH: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  DELETE: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  WEBHOOK: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
}
const CONTRACT_STATUS_COLORS: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Pending Approval": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 tpl-pulse-active",
  "Under Negotiation": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 tpl-pulse-warning",
  "Expiring Soon": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 tpl-pulse-warning",
  Expired: "bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400",
  Terminated: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  Renewed: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  Amended: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
}

// ============================================================================
// Data Generation
// ============================================================================
interface Partner { id: string; company: string; type: string; status: string; region: string; sla: number; rating: number; fleet: number; orders: number; revenue: number; contact: string; city: string; onboarded: string }
interface Order { id: string; partner: string; warehouse: string; status: string; orderType: string; source: string; syncTime: string; retryCount: number; errorMsg: string; value: number; timestamp: string }
interface ApiEndpoint { id: string; method: string; path: string; status: string; responseTime: number; requestsToday: number; errorRate: number; lastPing: string; uptime: number; version: string }
interface Contract { id: string; partner: string; type: string; status: string; billingCycle: string; startDate: string; endDate: string; monthlyFee: number; volumeCommitment: number; penaltyClause: string; paymentStatus: string }

function generatePartners(): Partner[] {
  return Array.from({ length: 75 }, (_, i) => {
    const seed = i * 137 + 42
    const type = pick(PARTNER_TYPES, seed)
    const status = pick(PARTNER_STATUSES, seed + 1)
    return {
      id: `3PL-${String(i + 1).padStart(4, "0")}`,
      company: pick(INDIAN_3PL, seed + 2),
      type,
      status,
      region: pick(REGIONS, seed + 3),
      sla: ri(72, 100, seed + 4),
      rating: ri(10, 50, seed + 5) / 10,
      fleet: ri(5, 500, seed + 6),
      orders: ri(100, 25000, seed + 7),
      revenue: ri(50000, 5000000, seed + 8),
      contact: pick(INDIAN_CONTACTS, seed + 9),
      city: pick(INDIAN_CITIES, seed + 10),
      onboarded: `2024-${String(ri(1, 12, seed + 11)).padStart(2, "0")}-${String(ri(1, 28, seed + 12)).padStart(2, "0")}`,
    }
  })
}

function generateOrders(): Order[] {
  const sources = ["WMS", "OMS", "ERP", "TMS", "IMS"] as const
  const orderTypes = ["Standard", "Express", "Bulk", "Return", "Exchange", "Priority", "Scheduled", "Ad-hoc"] as const
  return Array.from({ length: 70 }, (_, i) => {
    const seed = i * 211 + 88
    const status = pick(INTEGRATION_STATUSES, seed)
    return {
      id: `ORD-INT-${String(i + 1).padStart(4, "0")}`,
      partner: pick(INDIAN_3PL, seed + 1),
      warehouse: pick(INDIAN_CITIES, seed + 2) + " WH",
      status,
      orderType: pick(orderTypes, seed + 3),
      source: pick(sources, seed + 4),
      syncTime: status === "Synced" ? `${ri(10, 500, seed + 5)}ms` : "—",
      retryCount: status === "Failed" ? ri(1, 5, seed + 6) : 0,
      errorMsg: status === "Failed" ? "Connection timeout / API rate limit / Data mismatch / Auth error" : "",
      value: ri(500, 150000, seed + 7),
      timestamp: `2024-12-${String(ri(1, 28, seed + 8)).padStart(2, "0")} ${String(ri(0, 23, seed + 9)).padStart(2, "0")}:${String(ri(0, 59, seed + 10)).padStart(2, "0")}`,
    }
  })
}

function generateAPIs(): ApiEndpoint[] {
  const paths = ["/api/v2/orders", "/api/v2/inventory", "/api/v2/shipment", "/api/v2/tracking", "/api/v2/partners", "/api/v2/invoice", "/api/v2/warehouse", "/api/v2/alerts", "/api/v2/reports", "/api/v2/auth", "/api/v2/slots", "/api/v2/returns", "/api/v2/billing", "/api/v2/rate-card", "/api/v2/sla", "/api/v2/webhook"] as const
  return Array.from({ length: 65 }, (_, i) => {
    const seed = i * 173 + 55
    return {
      id: `API-${String(i + 1).padStart(3, "0")}`,
      method: pick(API_METHODS, seed),
      path: pick(paths, seed + 1) + `/v${ri(1, 3, seed + 2)}`,
      status: pick(API_STATUSES, seed + 3),
      responseTime: ri(12, 2500, seed + 4),
      requestsToday: ri(50, 50000, seed + 5),
      errorRate: ri(0, 15, seed + 6) / 100,
      lastPing: `${ri(1, 59, seed + 7)}m ago`,
      uptime: ri(9500, 10000, seed + 8) / 100,
      version: `v${ri(1, 3, seed + 9)}.${ri(0, 9, seed + 10)}.${ri(0, 9, seed + 11)}`,
    }
  })
}

function generateContracts(): Contract[] {
  const penalties = ["None", "2%", "5%", "10%", "Variable"] as const
  const payments = ["Paid", "Pending", "Overdue"] as const
  return Array.from({ length: 55 }, (_, i) => {
    const seed = i * 191 + 33
    return {
      id: `CTR-${String(i + 1).padStart(4, "0")}`,
      partner: pick(INDIAN_3PL, seed),
      type: pick(PARTNER_TYPES, seed + 1),
      status: pick(CONTRACT_STATUSES, seed + 2),
      billingCycle: pick(BILLING_CYCLES, seed + 3),
      startDate: `2024-${String(ri(1, 12, seed + 4)).padStart(2, "0")}-01`,
      endDate: `2025-${String(ri(1, 12, seed + 5)).padStart(2, "0")}-${String(ri(1, 28, seed + 6)).padStart(2, "0")}`,
      monthlyFee: ri(25000, 2000000, seed + 7),
      volumeCommitment: ri(500, 50000, seed + 8),
      penaltyClause: pick(penalties, seed + 9),
      paymentStatus: pick(payments, seed + 10),
    }
  })
}

// ============================================================================
// Sub-Components
// ============================================================================
function SortHeader({ label, field, sortField, sortDir, onSort }: { label: string; field: string; sortField: string; sortDir: string; onSort: (f: string) => void }) {
  return (
    <TableHead className="cursor-pointer select-none text-xs font-semibold" onClick={() => onSort(field)}>
      <span className="inline-flex items-center gap-1">{label}
        {sortField === field && (sortDir === "asc" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />)}
      </span>
    </TableHead>
  )
}

function PartnerTypeBadge({ type }: { type: string }) {
  return <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">{PARTNER_TYPE_EMOJI[type] ?? ""} {type}</span>
}
function PartnerStatusBadge({ status }: { status: string }) {
  return <span className={cn("tpl-status-badge inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold", PARTNER_STATUS_COLORS[status] ?? "bg-slate-100 text-slate-600")}>{(status === "Active") && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}{status}</span>
}
function SLAComplianceBar({ value }: { value: number }) {
  const color = value >= 95 ? "bg-emerald-500" : value >= 80 ? "bg-amber-500" : "bg-red-500"
  const textC = value >= 95 ? "text-emerald-600 dark:text-emerald-400" : value >= 80 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
  return <div className="tpl-sla-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-muted overflow-hidden"><div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${value}%` }} /></div><span className={cn("text-[10px] font-bold font-mono", textC)}>{value}%</span></div>
}
function RatingBar({ rating }: { rating: number }) {
  return <span className="flex items-center gap-0.5">{Array.from({ length: 5 }, (_, i) => <Star key={i} className={cn("h-3 w-3", i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-300")} />)}<span className="ml-1 text-[10px] font-mono text-muted-foreground">{rating.toFixed(1)}</span></span>
}
function RegionBadge({ region }: { region: string }) {
  return <span className="tpl-region-badge inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold bg-cyan-50 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300">{region}</span>
}
function IntegrationStatusBadge({ status }: { status: string }) {
  return <span className={cn("tpl-int-status-badge inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold", INTEGRATION_STATUS_COLORS[status] ?? "bg-slate-100 text-slate-600")}>{status === "Synced" && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}{status === "Failed" && <span className="h-1.5 w-1.5 rounded-full bg-red-500" />}{status}</span>
}
function MethodBadge({ method }: { method: string }) {
  return <span className={cn("tpl-method-badge inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold", METHOD_COLORS[method] ?? "bg-slate-100 text-slate-600")}>{method}</span>
}
function APIStatusBadge({ status }: { status: string }) {
  return <span className={cn("tpl-api-status-badge inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold", API_STATUS_COLORS[status] ?? "bg-slate-100 text-slate-600")}>{status === "Healthy" && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}{status === "Down" && <span className="h-1.5 w-1.5 rounded-full bg-red-500" />}{status}</span>
}
function ErrorRateBar({ rate }: { rate: number }) {
  const pct = rate * 100
  const color = pct < 1 ? "bg-emerald-500" : pct < 5 ? "bg-amber-500" : "bg-red-500"
  return <div className="tpl-error-bar flex items-center gap-2"><div className="h-2 w-16 rounded-full bg-muted overflow-hidden"><div className={cn("h-full rounded-full", color)} style={{ width: `${Math.min(pct * 10, 100)}%` }} /></div><span className="text-[10px] font-mono text-muted-foreground">{pct.toFixed(1)}%</span></div>
}
function ResponseTimeTile({ ms }: { ms: number }) {
  const color = ms < 200 ? "text-emerald-600 dark:text-emerald-400" : ms < 1000 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
  return <span className={cn("font-mono text-xs font-bold", color)}>{ms}ms</span>
}
function ContractStatusBadge({ status }: { status: string }) {
  return <span className={cn("tpl-ct-status-badge inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold", CONTRACT_STATUS_COLORS[status] ?? "bg-slate-100 text-slate-600")}>{status === "Active" && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}{status === "Expiring Soon" && <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />}{status}</span>
}
function BillingCycleBadge({ cycle }: { cycle: string }) {
  const m: Record<string, string> = { Monthly: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300", Quarterly: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300", Annual: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300", "Per-Shipment": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300", "Volume-Based": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300", Hybrid: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" }
  return <span className={cn("tpl-billing-badge inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold", m[cycle] ?? "bg-slate-100 text-slate-600")}>{cycle}</span>
}
function PenaltyBadge({ penalty }: { penalty: string }) {
  const m: Record<string, string> = { None: "bg-slate-100 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400", "2%": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300", "5%": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300", "10%": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300", Variable: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" }
  return <span className={cn("inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold", m[penalty] ?? "bg-slate-100 text-slate-600")}>{penalty}</span>
}
function PaymentStatusBadge({ status }: { status: string }) {
  const m: Record<string, string> = { Paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300", Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 tpl-pulse-active", Overdue: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 tpl-pulse-error" }
  return <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold", m[status] ?? "bg-slate-100 text-slate-600")}>{status === "Paid" && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}{status}</span>
}
function RetryBadge({ count }: { count: number }) {
  if (count === 0) return <span className="text-[10px] text-muted-foreground">—</span>
  return <span className={cn("inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold", count <= 2 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700")}>{count}x</span>
}

// ============================================================================
// Main Component
// ============================================================================
export default function ThreePLIntegrationHubView() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("0")
  const [searchQ, setSearchQ] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("")
  const [sortDir, setSortDir] = useState("asc")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [selectedAPI, setSelectedAPI] = useState<ApiEndpoint | null>(null)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)

  const partners = useMemo(() => generatePartners(), [])
  const orders = useMemo(() => generateOrders(), [])
  const apis = useMemo(() => generateAPIs(), [])
  const contracts = useMemo(() => generateContracts(), [])

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc")
    else { setSortField(field); setSortDir("asc") }
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

  // Dashboard KPI data
  const dashKPIs = [
    { label: "Total Partners", value: partners.length.toString(), icon: Handshake, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
    { label: "Active Integrations", value: partners.filter((p) => p.status === "Active").length.toString(), icon: Network, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "API Health", value: `${(apis.filter((a) => a.status === "Healthy").length / apis.length * 100).toFixed(1)}%`, icon: Activity, color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-50 dark:bg-cyan-900/20" },
    { label: "Orders Today", value: orders.length.toString(), icon: FileText, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/20" },
    { label: "Avg Sync Time", value: `${ri(45, 320, 42)}ms`, icon: Zap, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { label: "Pending Issues", value: orders.filter((o) => o.status === "Failed").length.toString(), icon: ShieldAlert, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20" },
    { label: "Revenue Month", value: formatINR(partners.reduce((s, p) => s + p.revenue, 0) / 12), icon: IndianRupee, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/20" },
    { label: "SLA Compliance", value: `${(partners.reduce((s, p) => s + p.sla, 0) / partners.length).toFixed(1)}%`, icon: Target, color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-900/20" },
  ]

  const dailySyncData = useMemo(() => Array.from({ length: 14 }, (_, i) => {
    const seed = i * 97 + 10
    return { day: `Dec ${i + 1}`, Synced: ri(200, 500, seed), Failed: ri(5, 30, seed + 1), Pending: ri(10, 60, seed + 2) }
  }), [])

  const partnerTypeData = useMemo(() => PARTNER_TYPES.map((t) => ({ name: t, value: partners.filter((p) => p.type === t).length })), [partners])
  const healthByTypeData = useMemo(() => PARTNER_TYPES.map((t) => ({ name: t.replace("3PL", "").trim().slice(0, 12), Healthy: ri(70, 100, t.length * 17), Degraded: ri(5, 20, t.length * 23), Down: ri(0, 5, t.length * 31) })), [])

  // Analytics data
  const analyticsKPIs = [
    { label: "Avg Processing", value: `${ri(2, 8, 1)}h`, icon: Clock, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
    { label: "Reliability", value: `${ri(970, 998, 2) / 10}%`, icon: ShieldAlert, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "Cost/Shipment", value: formatINR(ri(85, 350, 3)), icon: IndianRupee, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/20" },
    { label: "Satisfaction", value: `${ri(82, 97, 4)}%`, icon: Star, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { label: "API Avg Resp", value: `${ri(45, 280, 5)}ms`, icon: Gauge, color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-50 dark:bg-cyan-900/20" },
    { label: "Error Resolution", value: `${ri(1, 6, 6)}h`, icon: Zap, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/20" },
    { label: "Revenue Growth", value: `+${ri(8, 28, 7)}%`, icon: TrendingUp, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/20" },
    { label: "Renewal Rate", value: `${ri(78, 96, 8)}%`, icon: RefreshCw, color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-900/20" },
  ]

  const monthlyVolumeData = useMemo(() => Array.from({ length: 12 }, (_, i) => {
    const seed = i * 83 + 20
    return { month: `Jan ${i + 1}`, Direct: ri(300, 800, seed), Partner: ri(200, 600, seed + 1), Marketplace: ri(100, 400, seed + 2) }
  }), [])

  const partnerPerfData = useMemo(() => partners.slice(0, 10).map((p, i) => ({ name: p.company.split(" ")[0], Orders: p.orders, SLA: p.sla, Revenue: Math.round(p.revenue / 1000) })), [partners])

  const apiUsageData = useMemo(() => API_METHODS.map((m) => ({ method: m, count: apis.filter((a) => a.method === m).reduce((s, a) => s + a.requestsToday, 0) })), [apis])

  const costBreakdownData = useMemo(() => Array.from({ length: 6 }, (_, i) => {
    const seed = i * 71 + 50
    return { month: `Jul ${i + 1}`, Warehousing: ri(200, 600, seed) * 1000, Transport: ri(150, 500, seed + 1) * 1000, "E-com": ri(80, 300, seed + 2) * 1000, "Cold Chain": ri(40, 150, seed + 3) * 1000 }
  }), [])

  return (
    <div className="space-y-4">
      <PageHeader title="3PL Integration Hub" description="Manage third-party logistics partners, API integrations, contracts and performance analytics" />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="tpl-tab-list">
          {["Integration Dashboard", "Partner Management", "Order Integration", "API Gateway", "Contract & Billing", "Performance Analytics"].map((t, i) => (
            <TabsTrigger key={i} value={String(i)} className="tpl-tab-trigger">{t}</TabsTrigger>
          ))}
        </TabsList>

        {/* Tab 0: Dashboard */}
        <TabsContent value="0" className="tpl-tab-dash space-y-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {dashKPIs.map((kpi, i) => (
              <Card key={i} className="tpl-kpi-card">
                <CardContent className="glass-subtle p-3 flex items-center gap-3">
                  <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0", kpi.bg)}><kpi.icon className={cn("h-4 w-4", kpi.color)} /></div>
                  <div><p className="text-[10px] text-muted-foreground font-medium">{kpi.label}</p><p className={cn("text-lg font-bold leading-tight", kpi.color)}>{kpi.value}</p></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="tpl-chart-card col-span-1"><CardHeader className="pb-2"><CardTitle className="text-xs font-semibold">Daily Sync Volume</CardTitle></CardHeader><CardContent><AreaChart data={dailySyncData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip contentStyle={{ fontSize: 11 }} /><Area type="monotone" dataKey="Synced" stackId="a" stroke="#059669" fill="#059669" fillOpacity={0.3} /><Area type="monotone" dataKey="Failed" stackId="a" stroke="#e11d48" fill="#e11d48" fillOpacity={0.3} /><Area type="monotone" dataKey="Pending" stackId="a" stroke="#d97706" fill="#d97706" fillOpacity={0.3} /></AreaChart></CardContent></Card>
            <Card className="tpl-chart-card col-span-1"><CardHeader className="pb-2"><CardTitle className="text-xs font-semibold">Partner Type Distribution</CardTitle></CardHeader><CardContent><PieChart><Pie data={partnerTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={35} label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={9}>{partnerTypeData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}</Pie><Tooltip contentStyle={{ fontSize: 11 }} /></PieChart></CardContent></Card>
            <Card className="tpl-chart-card col-span-1"><CardHeader className="pb-2"><CardTitle className="text-xs font-semibold">Health by Partner Type</CardTitle></CardHeader><CardContent><BarChart data={healthByTypeData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip contentStyle={{ fontSize: 11 }} /><Bar dataKey="Healthy" stackId="a" fill="#059669" /><Bar dataKey="Degraded" stackId="a" fill="#d97706" /><Bar dataKey="Down" stackId="a" fill="#e11d48" /></BarChart></CardContent></Card>
          </div>
        </TabsContent>

        {/* Tab 1: Partners */}
        <TabsContent value="1" className="tpl-tab-partners space-y-4 mt-4">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" /><Input placeholder="Search partners..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)} className="h-9 pl-8 text-xs" /></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="h-9 w-[140px] text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem>{PARTNER_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
          </div>
          <Card><CardContent className="glass-subtle p-0"><Table><TableHeader><TableRow className="tpl-table-header">
            <SortHeader label="ID" field="id" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
            <SortHeader label="Company" field="company" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
            <TableHead className="text-xs">Type</TableHead>
            <TableHead className="text-xs">Status</TableHead>
            <TableHead className="text-xs">Region</TableHead>
            <SortHeader label="SLA" field="sla" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
            <TableHead className="text-xs">Rating</TableHead>
            <SortHeader label="Fleet" field="fleet" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
            <SortHeader label="Orders" field="orders" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
            <SortHeader label="Revenue" field="revenue" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
            <TableHead className="text-xs">Actions</TableHead>
          </TableRow></TableHeader><TableBody>
            {sortedData(filterData(partners, "status", ["id", "company", "type", "status", "region"]), sortField, sortDir).map((p) => (
              <TableRow key={p.id} className="tpl-table-row">
                <TableCell className="text-[10px] font-mono">{p.id}</TableCell>
                <TableCell className="text-xs font-semibold max-w-[140px] truncate">{p.company}</TableCell>
                <TableCell><PartnerTypeBadge type={p.type} /></TableCell>
                <TableCell><PartnerStatusBadge status={p.status} /></TableCell>
                <TableCell><RegionBadge region={p.region} /></TableCell>
                <TableCell><SLAComplianceBar value={p.sla} /></TableCell>
                <TableCell><RatingBar rating={p.rating} /></TableCell>
                <TableCell className="text-[10px] font-mono">{p.fleet}</TableCell>
                <TableCell className="text-[10px] font-mono">{p.orders.toLocaleString("en-IN")}</TableCell>
                <TableCell className="numeric-cell text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">{formatINR(p.revenue)}</TableCell>
                <TableCell><Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { setSelectedPartner(p); setSelectedOrder(null); setSelectedAPI(null); setSelectedContract(null); setSheetOpen(true) }}><Eye className="h-3.5 w-3.5" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody></Table></CardContent></Card>
        </TabsContent>

        {/* Tab 2: Orders */}
        <TabsContent value="2" className="tpl-tab-orders space-y-4 mt-4">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" /><Input placeholder="Search orders..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)} className="h-9 pl-8 text-xs" /></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="h-9 w-[140px] text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem>{INTEGRATION_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
          </div>
          <Card><CardContent className="glass-subtle p-0"><Table><TableHeader><TableRow className="tpl-table-header">
            <SortHeader label="Order ID" field="id" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
            <TableHead className="text-xs">Partner</TableHead>
            <TableHead className="text-xs">Warehouse</TableHead>
            <TableHead className="text-xs">Status</TableHead>
            <TableHead className="text-xs">Type</TableHead>
            <TableHead className="text-xs">Source</TableHead>
            <TableHead className="text-xs">Sync Time</TableHead>
            <TableHead className="text-xs">Retries</TableHead>
            <SortHeader label="Value" field="value" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
            <TableHead className="text-xs">Actions</TableHead>
          </TableRow></TableHeader><TableBody>
            {sortedData(filterData(orders, "status", ["id", "partner", "warehouse", "status"]), sortField, sortDir).map((o) => (
              <TableRow key={o.id} className="tpl-table-row">
                <TableCell className="text-[10px] font-mono">{o.id}</TableCell>
                <TableCell className="text-xs max-w-[120px] truncate">{o.partner}</TableCell>
                <TableCell className="text-[10px]">{o.warehouse}</TableCell>
                <TableCell><IntegrationStatusBadge status={o.status} /></TableCell>
                <TableCell className="text-[10px]">{o.orderType}</TableCell>
                <TableCell><Badge variant="outline" className="badge-interactive text-[9px] h-5">{o.source}</Badge></TableCell>
                <TableCell className="text-[10px] font-mono">{o.syncTime}</TableCell>
                <TableCell><RetryBadge count={o.retryCount} /></TableCell>
                <TableCell className="numeric-cell text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">{formatINR(o.value)}</TableCell>
                <TableCell><Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { setSelectedOrder(o); setSelectedPartner(null); setSelectedAPI(null); setSelectedContract(null); setSheetOpen(true) }}><Eye className="h-3.5 w-3.5" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody></Table></CardContent></Card>
        </TabsContent>

        {/* Tab 3: API Gateway */}
        <TabsContent value="3" className="tpl-tab-api space-y-4 mt-4">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" /><Input placeholder="Search endpoints..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)} className="h-9 pl-8 text-xs" /></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="h-9 w-[140px] text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem>{API_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
          </div>
          <Card><CardContent className="glass-subtle p-0"><Table><TableHeader><TableRow className="tpl-table-header">
            <TableHead className="text-xs">ID</TableHead>
            <TableHead className="text-xs">Method</TableHead>
            <TableHead className="text-xs">Endpoint</TableHead>
            <TableHead className="text-xs">Status</TableHead>
            <SortHeader label="Resp Time" field="responseTime" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
            <SortHeader label="Requests" field="requestsToday" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
            <TableHead className="text-xs">Error Rate</TableHead>
            <TableHead className="text-xs">Uptime</TableHead>
            <TableHead className="text-xs">Version</TableHead>
            <TableHead className="text-xs">Actions</TableHead>
          </TableRow></TableHeader><TableBody>
            {sortedData(filterData(apis, "status", ["id", "method", "path", "status"]), sortField, sortDir).map((a) => (
              <TableRow key={a.id} className="tpl-table-row">
                <TableCell className="text-[10px] font-mono">{a.id}</TableCell>
                <TableCell><MethodBadge method={a.method} /></TableCell>
                <TableCell className="text-[10px] font-mono max-w-[160px] truncate">{a.path}</TableCell>
                <TableCell><APIStatusBadge status={a.status} /></TableCell>
                <TableCell><ResponseTimeTile ms={a.responseTime} /></TableCell>
                <TableCell className="text-[10px] font-mono">{a.requestsToday.toLocaleString("en-IN")}</TableCell>
                <TableCell><ErrorRateBar rate={a.errorRate} /></TableCell>
                <TableCell className="text-[10px] font-mono">{a.uptime.toFixed(2)}%</TableCell>
                <TableCell><Badge variant="outline" className="badge-interactive text-[9px] h-5">{a.version}</Badge></TableCell>
                <TableCell><Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { setSelectedAPI(a); setSelectedPartner(null); setSelectedOrder(null); setSelectedContract(null); setSheetOpen(true) }}><Eye className="h-3.5 w-3.5" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody></Table></CardContent></Card>
        </TabsContent>

        {/* Tab 4: Contracts */}
        <TabsContent value="4" className="tpl-tab-contracts space-y-4 mt-4">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" /><Input placeholder="Search contracts..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)} className="h-9 pl-8 text-xs" /></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="h-9 w-[140px] text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem>{CONTRACT_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sortedData(filterData(contracts, "status", ["id", "partner", "type", "status"]), sortField, sortDir).map((c) => (
              <Card key={c.id} className="tpl-contract-card overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setSelectedContract(c); setSelectedPartner(null); setSelectedOrder(null); setSelectedAPI(null); setSheetOpen(true) }}>
                <div className="tpl-contract-header bg-gradient-to-r from-indigo-600 to-emerald-600 px-4 py-2.5">
                  <div className="flex items-center justify-between"><span className="text-[10px] font-mono text-white/80">{c.id}</span><ContractStatusBadge status={c.status} /></div>
                  <p className="text-sm font-bold text-white mt-0.5 truncate">{c.partner}</p>
                </div>
                <CardContent className="glass-subtle p-3 space-y-2">
                  <div className="flex items-center justify-between"><PartnerTypeBadge type={c.type} /><BillingCycleBadge cycle={c.billingCycle} /></div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    <div><span className="text-muted-foreground">Period</span><p className="font-mono font-semibold">{c.startDate} → {c.endDate}</p></div>
                    <div><span className="text-muted-foreground">Penalty</span><p className="font-semibold"><PenaltyBadge penalty={c.penaltyClause} /></p></div>
                    <div><span className="text-muted-foreground">Monthly Fee</span><p className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{formatINR(c.monthlyFee)}</p></div>
                    <div><span className="text-muted-foreground">Volume</span><p className="font-mono font-semibold">{c.volumeCommitment.toLocaleString("en-IN")}</p></div>
                    <div><span className="text-muted-foreground">Payment</span><p><PaymentStatusBadge status={c.paymentStatus} /></p></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 5: Analytics */}
        <TabsContent value="5" className="tpl-tab-analytics space-y-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {analyticsKPIs.map((kpi, i) => (
              <Card key={i} className="tpl-kpi-card">
                <CardContent className="glass-subtle p-3 flex items-center gap-3">
                  <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0", kpi.bg)}><kpi.icon className={cn("h-4 w-4", kpi.color)} /></div>
                  <div><p className="text-[10px] text-muted-foreground font-medium">{kpi.label}</p><p className={cn("text-lg font-bold leading-tight", kpi.color)}>{kpi.value}</p></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="tpl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-xs font-semibold">Monthly Order Volume</CardTitle></CardHeader><CardContent><LineChart data={monthlyVolumeData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip contentStyle={{ fontSize: 11 }} /><Line type="monotone" dataKey="Direct" stroke="#6366f1" strokeWidth={2} /><Line type="monotone" dataKey="Partner" stroke="#059669" strokeWidth={2} /><Line type="monotone" dataKey="Marketplace" stroke="#ea580c" strokeWidth={2} /></LineChart></CardContent></Card>
            <Card className="tpl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-xs font-semibold">Top Partner Performance</CardTitle></CardHeader><CardContent><BarChart data={partnerPerfData} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" tick={{ fontSize: 10 }} /><YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} /><Tooltip contentStyle={{ fontSize: 11 }} /><Bar dataKey="Orders" fill="#6366f1" /><Bar dataKey="SLA" fill="#059669" /></BarChart></CardContent></Card>
            <Card className="tpl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-xs font-semibold">API Usage by Method</CardTitle></CardHeader><CardContent><BarChart data={apiUsageData} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" tick={{ fontSize: 10 }} /><YAxis type="category" dataKey="method" tick={{ fontSize: 10 }} width={65} /><Tooltip contentStyle={{ fontSize: 11 }} /><Bar dataKey="count" fill="#0891b2" radius={[0, 4, 4, 0]} /></BarChart></CardContent></Card>
            <Card className="tpl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-xs font-semibold">Cost Breakdown (6-Month)</CardTitle></CardHeader><CardContent><AreaChart data={costBreakdownData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip contentStyle={{ fontSize: 11 }} /><Area type="monotone" dataKey="Warehousing" stackId="a" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} /><Area type="monotone" dataKey="Transport" stackId="a" stroke="#059669" fill="#059669" fillOpacity={0.3} /><Area type="monotone" dataKey="E-com" stackId="a" stroke="#ea580c" fill="#ea580c" fillOpacity={0.3} /><Area type="monotone" dataKey="Cold Chain" stackId="a" stroke="#0891b2" fill="#0891b2" fillOpacity={0.3} /></AreaChart></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Sheet */}
      <Sheet open={!!(sheetOpen && (selectedPartner || selectedOrder || selectedAPI || selectedContract))} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[420px] sm:w-[480px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-sm">
              {selectedPartner ? `Partner: ${selectedPartner.company}` : selectedOrder ? `Order: ${selectedOrder.id}` : selectedAPI ? `API: ${selectedAPI.id}` : selectedContract ? `Contract: ${selectedContract.id}` : "Details"}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            {selectedPartner && (
              <div className="space-y-3">
                <div className="tpl-sheet-header bg-gradient-to-r from-indigo-600 to-emerald-600 rounded-lg p-4">
                  <p className="text-lg font-bold text-white">{selectedPartner.company}</p>
                  <div className="flex items-center gap-2 mt-1"><PartnerStatusBadge status={selectedPartner.status} /><RegionBadge region={selectedPartner.region} /></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[["Partner ID", selectedPartner.id], ["Type", selectedPartner.type], ["SLA Compliance", `${selectedPartner.sla}%`], ["Rating", `${selectedPartner.rating}/5`], ["Fleet Size", selectedPartner.fleet.toString()], ["Total Orders", selectedPartner.orders.toLocaleString("en-IN")], ["Revenue", formatINR(selectedPartner.revenue)], ["Contact", selectedPartner.contact], ["City", selectedPartner.city], ["Onboarded", selectedPartner.onboarded]].map(([k, v]) => (
                    <div key={k} className="rounded-lg border p-2.5"><p className="text-[10px] text-muted-foreground uppercase">{k}</p><p className="text-sm font-bold">{v}</p></div>
                  ))}
                </div>
              </div>
            )}
            {selectedOrder && (
              <div className="space-y-3">
                <div className="tpl-sheet-header bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-lg p-4">
                  <p className="text-lg font-bold text-white">{selectedOrder.id}</p>
                  <div className="badge-interactive flex items-center gap-2 mt-1"><IntegrationStatusBadge status={selectedOrder.status} /><Badge variant="outline" className="text-[9px] text-white/80">{selectedOrder.source}</Badge></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[["Order ID", selectedOrder.id], ["Partner", selectedOrder.partner], ["Warehouse", selectedOrder.warehouse], ["Status", selectedOrder.status], ["Order Type", selectedOrder.orderType], ["Source System", selectedOrder.source], ["Sync Time", selectedOrder.syncTime], ["Retry Count", selectedOrder.retryCount.toString()], ["Value", formatINR(selectedOrder.value)], ["Timestamp", selectedOrder.timestamp]].map(([k, v]) => (
                    <div key={k} className="rounded-lg border p-2.5"><p className="text-[10px] text-muted-foreground uppercase">{k}</p><p className="text-sm font-bold">{v}</p></div>
                  ))}
                </div>
              </div>
            )}
            {selectedAPI && (
              <div className="space-y-3">
                <div className="tpl-sheet-header bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-lg p-4">
                  <div className="flex items-center gap-2"><MethodBadge method={selectedAPI.method} /><p className="text-lg font-bold text-white">{selectedAPI.path}</p></div>
                  <div className="badge-interactive flex items-center gap-2 mt-1"><APIStatusBadge status={selectedAPI.status} /><Badge variant="outline" className="text-[9px] text-white/80">{selectedAPI.version}</Badge></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[["API ID", selectedAPI.id], ["Method", selectedAPI.method], ["Path", selectedAPI.path], ["Status", selectedAPI.status], ["Response Time", `${selectedAPI.responseTime}ms`], ["Requests Today", selectedAPI.requestsToday.toLocaleString("en-IN")], ["Error Rate", `${(selectedAPI.errorRate * 100).toFixed(1)}%`], ["Uptime", `${selectedAPI.uptime.toFixed(2)}%`], ["Last Ping", selectedAPI.lastPing], ["Version", selectedAPI.version]].map(([k, v]) => (
                    <div key={k} className="rounded-lg border p-2.5"><p className="text-[10px] text-muted-foreground uppercase">{k}</p><p className="text-sm font-bold">{v}</p></div>
                  ))}
                </div>
              </div>
            )}
            {selectedContract && (
              <div className="space-y-3">
                <div className="tpl-sheet-header bg-gradient-to-r from-indigo-600 to-emerald-600 rounded-lg p-4">
                  <p className="text-lg font-bold text-white">{selectedContract.partner}</p>
                  <div className="flex items-center gap-2 mt-1"><ContractStatusBadge status={selectedContract.status} /><BillingCycleBadge cycle={selectedContract.billingCycle} /></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[["Contract ID", selectedContract.id], ["Partner", selectedContract.partner], ["Type", selectedContract.type], ["Status", selectedContract.status], ["Billing Cycle", selectedContract.billingCycle], ["Penalty", selectedContract.penaltyClause], ["Payment", selectedContract.paymentStatus], ["Monthly Fee", formatINR(selectedContract.monthlyFee)], ["Volume", selectedContract.volumeCommitment.toLocaleString("en-IN")], ["Period", `${selectedContract.startDate} → ${selectedContract.endDate}`]].map(([k, v]) => (
                    <div key={k} className="rounded-lg border p-2.5"><p className="text-[10px] text-muted-foreground uppercase">{k}</p><p className="text-sm font-bold">{v}</p></div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="border-t px-4 py-3 flex-row gap-2 flex">
            <Button variant="outline" size="sm" className="btn-outline-animate h-8 text-xs flex-1" onClick={() => toast.success("Exported", "Record exported successfully")}><Download className="h-3 w-3 mr-1" /> Export</Button>
            <Button variant="outline" size="sm" className="btn-outline-animate h-8 text-xs flex-1" onClick={() => toast.info("Refreshed", "Data refreshed")}><RefreshCw className="h-3 w-3 mr-1" /> Refresh</Button>
            <Button size="sm" className="h-8 text-xs flex-1" onClick={() => toast.success("Saved", "Changes saved")}><CheckCircle2 className="h-3 w-3 mr-1" /> Save</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
