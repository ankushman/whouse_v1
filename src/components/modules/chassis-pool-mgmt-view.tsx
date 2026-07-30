"use client"

import React, { useState, useMemo } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { useToast } from "@/hooks/use-toast-helper"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Legend, Tooltip, ResponsiveContainer,
} from "recharts"
import {
  Search, Filter, Eye, AlertTriangle, CheckCircle2, XCircle, TrendingUp, TrendingDown,
  ArrowUpRight, ArrowDownRight, Timer, MapPin, Wrench, CalendarDays, IndianRupee,
  Truck, ShieldAlert, Gauge, Activity, RotateCcw, Package, ChevronRight, Star,
  CreditCard, Clock, Warehouse, User, FileText, DollarSign, Receipt, BarChart3, Target,
  Building2, Navigation, Fuel, Layers, CircleDot, Settings, Zap, Ban, ArrowUpDown,
  Send,
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
const pick = <T,>(arr: readonly T[], seed: number) => arr[Math.floor(seededRandom(seed) * arr.length)]
const ri = (min: number, max: number, seed: number) => Math.floor(seededRandom(seed) * (max - min + 1)) + min
const formatINR = (n: number) => n >= 10000000 ? `₹${(n / 10000000).toFixed(2)} Cr` : n >= 100000 ? `₹${(n / 100000).toFixed(2)} L` : `₹${n.toLocaleString("en-IN")}`

// ============================================================================
// Enums
// ============================================================================
const CHASSIS_TYPES = ["20ft Standard", "40ft Standard", "40ft HC", "45ft HC", "Skeleton", "Gooseneck"] as const
const CHASSIS_STATUSES = ["Available", "On Rent", "Under Maintenance", "Damaged", "In Transit", "At Port", "Inspection", "Decommissioned"] as const
const OWNERS = ["BlueDart", "TCI", "VRL", "Container Corp", "ChassisPool India", "PortTrust", "Roadzen", "BlackBuck", "DHL Supply Chain", "Allcargo"] as const
const LOCATIONS = ["JNPT Mumbai", "Mundra Gujarat", "Chennai TN", "Hazira Gujarat", "ICD Tughlakabad", "ICD Patparganj", "ICD Nagpur", "ICD Bengaluru"] as const
const CONDITIONS = ["Excellent", "Good", "Fair", "Poor", "Critical"] as const
const ALLOC_STATUSES = ["Pending", "Confirmed", "Active", "Completed", "Cancelled", "Overdue", "Extended", "Shortfall"] as const
const ALLOC_TYPES = ["Import", "Export", "Domestic", "Empty Return", "Bonded", "Transshipment"] as const
const DURATIONS = ["1-3 days", "4-7 days", "8-14 days", "15-30 days", "31-60 days", "61-90 days", "Quarterly", "Annual"] as const
const CUSTOMERS = ["Delhivery", "Flipkart", "Amazon India", "Reliance", "Maersk India", "MSC", "CMA CGM", "Hapag-Lloyd", "ONE", "EVERGREEN"] as const
const MAINT_STATUSES = ["Scheduled", "In Progress", "Completed", "Failed", "Cancelled", "Overdue", "Pending Parts", "Awaiting Approval"] as const
const MAINT_TYPES = ["Tire Replacement", "Brake Service", "Lighting", "Electrical", "Structural", "Repaint", "Alignment", "Computer", "Annual Audit", "Registration Renewal"] as const
const PRIORITIES = ["Critical", "High", "Medium", "Low", "Routine"] as const
const FACILITIES = ["JNPT Workshop", "Mundra Depot", "Chennai Bay", "ICD Tughlakabad", "Mobile Unit"] as const
const BILL_STATUSES = ["Draft", "Sent", "Paid", "Overdue", "Disputed", "Partial", "Cancelled", "Waived"] as const
const CHARGE_TYPES = ["Daily Rental", "Extension Fee", "Maintenance", "Transport", "Demurrage", "Damage"] as const
const PAYMENT_METHODS = ["NEFT", "RTGS", "UPI", "Cheque", "Letter of Credit", "Cash", "Bank Transfer", "Net Banking"] as const

const STATUS_COLORS: Record<string, string> = {
  Available: "#059669", "On Rent": "#0d9488", "Under Maintenance": "#d97706",
  Damaged: "#dc2626", "In Transit": "#0891b2", "At Port": "#475569",
  Inspection: "#7c3aed", Decommissioned: "#9ca3af",
  Pending: "#6b7280", Confirmed: "#0d9488", Active: "#059669",
  Completed: "#3b82f6", Cancelled: "#9ca3af", Overdue: "#dc2626",
  Extended: "#d97706", Shortfall: "#ea580c",
  Scheduled: "#3b82f6", "In Progress": "#0891b2", Failed: "#dc2626",
  Draft: "#6b7280", Sent: "#3b82f6", Paid: "#059669", Disputed: "#ea580c",
  Partial: "#d97706", Waived: "#9ca3af",
}
const CONDITION_COLORS: Record<string, string> = { Excellent: "#059669", Good: "#0d9488", Fair: "#d97706", Poor: "#ea580c", Critical: "#dc2626" }
const TYPE_COLORS: Record<string, string> = { "20ft Standard": "#3b82f6", "40ft Standard": "#8b5cf6", "40ft HC": "#0d9488", "45ft HC": "#059669", Skeleton: "#d97706", Gooseneck: "#ea580c" }
const PIE_COLORS = ["#334155", "#d97706", "#0d9488", "#e11d48", "#059669", "#4f46e5", "#0891b2", "#ea580c"]
const COL_LABELS: Record<string, string> = {
  id: "ID", serial: "Serial No", chassisId: "Chassis ID", type: "Type", status: "Status",
  owner: "Owner", location: "Location", condition: "Condition", year: "Year",
  tirePct: "Tire %", lastInspection: "Last Insp.", customer: "Customer",
  allocationType: "Type", duration: "Duration", pickup: "Pickup", dropoff: "Drop",
  cost: "Cost", startDate: "Start", endDate: "End", maintType: "Maint. Type",
  priority: "Priority", facility: "Facility", partsCost: "Parts", laborHrs: "Hours",
  nextDue: "Next Due", chargeType: "Charge", paymentMethod: "Payment",
  amount: "Amount", dueDate: "Due Date", tax: "Tax",
}

// ============================================================================
// generateData
// ============================================================================
function generateData() {
  const chassis = Array.from({ length: 65 }, (_, i) => {
    const seed = i * 17 + 1
    const s = pick(CHASSIS_STATUSES, seed)
    return {
      id: `CHS-${String(i + 1).padStart(4, "0")}`,
      serial: `SL${ri(100000, 999999, seed + 1)}`,
      chassisId: `CPM-${ri(1000, 9999, seed + 2)}`,
      type: pick(CHASSIS_TYPES, seed + 3) as string,
      status: s,
      owner: pick(OWNERS, seed + 4) as string,
      location: pick(LOCATIONS, seed + 5) as string,
      condition: pick(CONDITIONS, seed + 6) as string,
      year: ri(2015, 2025, seed + 7),
      tirePct: ri(20, 100, seed + 8),
      lastInspection: `2025-${String(ri(1, 12, seed + 9)).padStart(2, "0")}-${String(ri(1, 28, seed + 10)).padStart(2, "0")}`,
      kmTraveled: ri(5000, 250000, seed + 11),
    }
  })

  const allocations = Array.from({ length: 55 }, (_, i) => {
    const seed = i * 23 + 100
    return {
      id: `ALC-${String(i + 1).padStart(4, "0")}`,
      status: pick(ALLOC_STATUSES, seed) as string,
      allocationType: pick(ALLOC_TYPES, seed + 1) as string,
      customer: pick(CUSTOMERS, seed + 2) as string,
      duration: pick(DURATIONS, seed + 3) as string,
      pickup: pick(LOCATIONS.slice(0, 6), seed + 4) as string,
      dropoff: pick(LOCATIONS, seed + 5) as string,
      cost: ri(5000, 250000, seed + 6),
      startDate: `2025-${String(ri(1, 12, seed + 7)).padStart(2, "0")}-${String(ri(1, 28, seed + 8)).padStart(2, "0")}`,
      endDate: `2025-${String(ri(1, 12, seed + 9)).padStart(2, "0")}-${String(ri(1, 28, seed + 10)).padStart(2, "0")}`,
      chassisId: `CHS-${String(ri(1, 65, seed + 11)).padStart(4, "0")}`,
    }
  })

  const maintenance = Array.from({ length: 45 }, (_, i) => {
    const seed = i * 31 + 200
    return {
      id: `MNT-${String(i + 1).padStart(4, "0")}`,
      status: pick(MAINT_STATUSES, seed) as string,
      maintType: pick(MAINT_TYPES, seed + 1) as string,
      priority: pick(PRIORITIES, seed + 2) as string,
      facility: pick(FACILITIES, seed + 3) as string,
      partsCost: ri(2000, 85000, seed + 4),
      laborHrs: ri(1, 24, seed + 5),
      nextDue: `2025-${String(ri(7, 12, seed + 6)).padStart(2, "0")}-${String(ri(1, 28, seed + 7)).padStart(2, "0")}`,
      chassisId: `CHS-${String(ri(1, 65, seed + 8)).padStart(4, "0")}`,
      scheduledDate: `2025-${String(ri(1, 12, seed + 9)).padStart(2, "0")}-${String(ri(1, 28, seed + 10)).padStart(2, "0")}`,
    }
  })

  const billing = Array.from({ length: 50 }, (_, i) => {
    const seed = i * 37 + 300
    const amt = ri(8000, 500000, seed + 4)
    const taxRate = pick(["0.18", "0.12", "0.05", "0.28"], seed + 5) as string
    const taxVal = Math.round(amt * parseFloat(taxRate))
    return {
      id: `BIL-${String(i + 1).padStart(4, "0")}`,
      status: pick(BILL_STATUSES, seed) as string,
      chargeType: pick(CHARGE_TYPES, seed + 1) as string,
      customer: pick(CUSTOMERS, seed + 2) as string,
      paymentMethod: pick(PAYMENT_METHODS, seed + 3) as string,
      amount: amt,
      tax: taxVal,
      dueDate: `2025-${String(ri(1, 12, seed + 6)).padStart(2, "0")}-${String(ri(1, 28, seed + 7)).padStart(2, "0")}`,
      paidDate: pick(["Paid", "Partial"], seed + 8) === "Paid" ? `2025-${String(ri(1, 12, seed + 9)).padStart(2, "0")}-${String(ri(1, 28, seed + 10)).padStart(2, "0")}` : "—",
      chassisId: `CHS-${String(ri(1, 65, seed + 11)).padStart(4, "0")}`,
    }
  })

  const analytics = {
    totalRevenue: 42500000, avgDailyRate: 2850, utilizationRate: 78.5,
    maintenanceCost: 8500000, availabilityIndex: 82.3, turnaroundTime: 4.2,
    fleetAge: 4.8, customerSatisfaction: 91.2,
  }

  const dailyUtil = Array.from({ length: 30 }, (_, i) => ({
    day: `Jul ${i + 1}`,
    onRent: ri(35, 55, i * 3 + 500),
    available: ri(8, 20, i * 3 + 501),
    maintenance: ri(3, 10, i * 3 + 502),
  }))

  const portWise = LOCATIONS.slice(0, 6).map((loc, i) => ({
    port: loc.split(" ")[0],
    count: ri(8, 18, i * 7 + 600),
  }))

  const typeDist = CHASSIS_TYPES.map((t, i) => ({ name: t, value: ri(8, 20, i * 11 + 700) }))
  const monthlyRev = Array.from({ length: 6 }, (_, i) => ({
    month: `Month ${i + 1}`,
    revenue: ri(6000000, 10000000, i * 13 + 800),
    cost: ri(2000000, 5000000, i * 13 + 801),
    maintenance: ri(800000, 2000000, i * 13 + 802),
  }))
  const utilByLoc = LOCATIONS.map((loc, i) => ({ location: loc.split(" ").slice(-1)[0], utilization: ri(55, 95, i * 17 + 900) }))
  const custAlloc = CUSTOMERS.slice(0, 6).map((c, i) => ({ name: c, value: ri(5, 15, i * 19 + 1000) }))
  const maintCost = Array.from({ length: 6 }, (_, i) => ({ month: `Month ${i + 1}`, cost: ri(500000, 2000000, i * 23 + 1100) }))
  const ageDist = Array.from({ length: 5 }, (_, i) => ({
    range: `${i * 2}-${(i + 1) * 2} years`,
    count: ri(5, 18, i * 29 + 1200),
  }))

  return {
    CHASSIS_TYPES, CHASSIS_STATUSES, OWNERS, LOCATIONS, CONDITIONS,
    ALLOC_STATUSES, ALLOC_TYPES, DURATIONS, CUSTOMERS,
    MAINT_STATUSES, MAINT_TYPES, PRIORITIES, FACILITIES,
    BILL_STATUSES, CHARGE_TYPES, PAYMENT_METHODS,
    STATUS_COLORS, CONDITION_COLORS, TYPE_COLORS, PIE_COLORS, COL_LABELS,
    chassis, allocations, maintenance, billing, analytics,
    dailyUtil, portWise, typeDist, monthlyRev, utilByLoc, custAlloc, maintCost, ageDist,
  }
}

// ============================================================================
// Visual Components
// ============================================================================
function StatusBadge({ status, color }: { status: string; color: string }) {
  const isPulse = ["Damaged", "Overdue", "In Progress"].includes(status)
  return (
    <Badge variant="outline" className={cn("cpm-badge text-xs px-2 py-0.5 border", isPulse && "cpm-pulse-error")} style={{ borderColor: color, color }}>
      <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ backgroundColor: color }} />{status}
    </Badge>
  )
}
function ChassisTypeBadge({ type }: { type: string }) {
  const c = TYPE_COLORS[type] || "#475569"
  return <Badge className="badge-interactive cpm-type-badge text-xs px-2 py-0.5" style={{ background: c + "18", color: c, border: `1px solid ${c}30` }}>{type}</Badge>
}
function ConditionBadge({ condition }: { condition: string }) {
  const c = CONDITION_COLORS[condition] || "#475569"
  return <Badge className="badge-interactive cpm-cond-badge text-xs px-2 py-0.5" style={{ background: c + "18", color: c, border: `1px solid ${c}30` }}>{condition}</Badge>
}
function TireBar({ pct }: { pct: number }) {
  const c = pct >= 70 ? "#059669" : pct >= 40 ? "#d97706" : "#dc2626"
  return (
    <div className="cpm-tire-bar flex items-center gap-2">
      <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 w-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${c}, ${c}cc)` }} />
      </div>
      <span className="text-xs font-mono tabular-nums" style={{ color: c }}>{pct}%</span>
    </div>
  )
}
function LocationBadge({ loc }: { loc: string }) {
  return <Badge variant="outline" className="badge-interactive cpm-loc-badge text-xs px-2 py-0.5 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"><MapPin className="w-3 h-3 mr-0.5" />{loc}</Badge>
}
function CustomerBadge({ customer }: { customer: string }) {
  return <Badge className="badge-interactive cpm-cust-badge text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">{customer}</Badge>
}
function DurationBadge({ dur }: { dur: string }) {
  return <Badge variant="outline" className="badge-interactive cpm-dur-badge text-xs px-2 py-0.5 border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400">{dur}</Badge>
}
function PickupDropTile({ from, to }: { from: string; to: string }) {
  return (
    <div className="cpm-pickup-drop flex items-center gap-1.5 text-xs">
      <span className="truncate max-w-[100px]">{from}</span>
      <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
      <span className="truncate max-w-[100px]">{to}</span>
    </div>
  )
}
function CostTile({ amount }: { amount: number }) {
  return <span className="cpm-cost-tile font-semibold tabular-nums text-sm">{formatINR(amount)}</span>
}
function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = { Critical: "#dc2626", High: "#ea580c", Medium: "#d97706", Low: "#3b82f6", Routine: "#6b7280" }
  const c = colors[priority] || "#475569"
  return <Badge className="badge-interactive cpm-priority-badge text-xs px-2 py-0.5" style={{ background: c + "18", color: c, border: `1px solid ${c}30` }}>{priority}</Badge>
}
function FacilityBadge({ facility }: { facility: string }) {
  return <Badge variant="outline" className="badge-interactive cpm-facility-badge text-xs px-2 py-0.5 border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-400">{facility}</Badge>
}
function PaymentMethodBadge({ method }: { method: string }) {
  const icons: Record<string, string> = { NEFT: "🏦", RTGS: "💳", UPI: "📱", Cheque: "📝", "Letter of Credit": "📄", Cash: "💵", "Bank Transfer": "🏧", "Net Banking": "🌐" }
  return <Badge variant="outline" className="badge-interactive cpm-pay-badge text-xs px-2 py-0.5 border-slate-300 dark:border-slate-600">{icons[method] || "💰"} {method}</Badge>
}
function TaxTile({ tax }: { tax: number }) {
  const cgst = Math.round(tax / 2), sgst = Math.round(tax / 2)
  return (
    <div className="cpm-tax-tile flex gap-2 text-xs">
      <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 rounded">CGST {formatINR(cgst)}</span>
      <span className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 px-1.5 py-0.5 rounded">SGST {formatINR(sgst)}</span>
    </div>
  )
}
function DueDateIndicator({ date }: { date: string }) {
  return <span className="cpm-due-date text-xs text-slate-600 dark:text-slate-400">{date}</span>
}

// ============================================================================
// Main Component
// ============================================================================
export default function ChassisPoolMgmtView() {
  const [activeTab, setActiveTab] = useState("0")
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortCol, setSortCol] = useState<string | null>(null)
  const [sortAsc, setSortAsc] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerType, setDrawerType] = useState<string | null>(null)
  const [drawerRecord, setDrawerRecord] = useState<Record<string, unknown> | null>(null)
  const { toast } = useToast()
  const data = useMemo(() => generateData(), [])

  const genericSort = <T extends Record<string, unknown>>(arr: T[], col: string, asc: boolean): T[] =>
    [...arr].sort((a, b) => {
      const va = a[col], vb = b[col]
      if (typeof va === "number" && typeof vb === "number") return asc ? va - vb : vb - va
      return asc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
    })

  const handleSort = (col: string) => {
    if (sortCol === col) setSortAsc(!sortAsc); else { setSortCol(col); setSortAsc(true) }
  }

  const SortHeader = ({ col, label }: { col: string; label: string }) => (
    <TableHead className={cn("cpm-sort-header cursor-pointer select-none text-xs", sortCol === col && "active")} onClick={() => handleSort(col)}>
      {label} {sortCol === col && <ArrowUpDown className="w-3 h-3 inline ml-1" />}
    </TableHead>
  )

  // KPIs
  const availCount = data.chassis.filter(c => c.status === "Available").length
  const rentCount = data.chassis.filter(c => c.status === "On Rent").length
  const maintCount = data.chassis.filter(c => c.status === "Under Maintenance").length
  const totalChassis = data.chassis.length
  const utilRate = ((rentCount / totalChassis) * 100).toFixed(1)
  const todayReturns = ri(3, 12, 42)
  const pendingAlloc = data.allocations.filter(a => a.status === "Pending" || a.status === "Confirmed").length
  const monthlyRev = 42500000

  const kpis = [
    { label: "Total Chassis", value: totalChassis, icon: Layers, color: "#334155" },
    { label: "Available Now", value: availCount, icon: CheckCircle2, color: "#059669" },
    { label: "On Rent", value: rentCount, icon: Truck, color: "#0d9488" },
    { label: "Under Maintenance", value: maintCount, icon: Wrench, color: "#d97706" },
    { label: "Utilization Rate", value: `${utilRate}%`, icon: Gauge, color: "#4f46e5" },
    { label: "Today's Returns", value: todayReturns, icon: RotateCcw, color: "#0891b2" },
    { label: "Pending Allocations", value: pendingAlloc, icon: Clock, color: "#e11d48" },
    { label: "Monthly Revenue", value: formatINR(monthlyRev), icon: IndianRupee, color: "#ea580c" },
  ]
  const kpiColorClasses = ["cpm-kpi-slate", "cpm-kpi-emerald", "cpm-kpi-teal", "cpm-kpi-amber", "cpm-kpi-indigo", "cpm-kpi-cyan", "cpm-kpi-rose", "cpm-kpi-orange"]

  // Filtered data
  const filteredChassis = useMemo(() => {
    let f = data.chassis
    if (search) f = f.filter(c => c.id.toLowerCase().includes(search.toLowerCase()) || c.serial.toLowerCase().includes(search.toLowerCase()) || c.owner.toLowerCase().includes(search.toLowerCase()))
    if (filterStatus !== "all") f = f.filter(c => c.status === filterStatus)
    return sortCol ? genericSort(f as unknown as Record<string, unknown>[], sortCol, sortAsc) : f
  }, [search, filterStatus, sortCol, sortAsc, data.chassis])

  const filteredAlloc = useMemo(() => {
    let f = data.allocations
    if (search) f = f.filter(a => a.id.toLowerCase().includes(search.toLowerCase()) || a.customer.toLowerCase().includes(search.toLowerCase()))
    if (filterStatus !== "all") f = f.filter(a => a.status === filterStatus)
    return sortCol ? genericSort(f as unknown as Record<string, unknown>[], sortCol, sortAsc) : f
  }, [search, filterStatus, sortCol, sortAsc, data.allocations])

  const filteredMaint = useMemo(() => {
    let f = data.maintenance
    if (search) f = f.filter(m => m.id.toLowerCase().includes(search.toLowerCase()) || m.maintType.toLowerCase().includes(search.toLowerCase()))
    if (filterStatus !== "all") f = f.filter(m => m.status === filterStatus)
    return sortCol ? genericSort(f as unknown as Record<string, unknown>[], sortCol, sortAsc) : f
  }, [search, filterStatus, sortCol, sortAsc, data.maintenance])

  const filteredBill = useMemo(() => {
    let f = data.billing
    if (search) f = f.filter(b => b.id.toLowerCase().includes(search.toLowerCase()) || b.customer.toLowerCase().includes(search.toLowerCase()))
    if (filterStatus !== "all") f = f.filter(b => b.status === filterStatus)
    return sortCol ? genericSort(f as unknown as Record<string, unknown>[], sortCol, sortAsc) : f
  }, [search, filterStatus, sortCol, sortAsc, data.billing])

  return (
    <div className="space-y-6 cpm-root">
      <PageHeader title="Chassis Pool Management" description="Manage container chassis fleet allocation, maintenance, and billing across Indian ports and ICDs" />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto gap-1">
          {["Dashboard", "Fleet Registry", "Allocation & Booking", "Maintenance", "Billing & Rental", "Pool Analytics"].map((t, i) => (
            <TabsTrigger key={i} value={String(i)} className={cn(activeTab === String(i) && "cpm-tab-active")}>{t}</TabsTrigger>
          ))}
        </TabsList>

        {/* Tab 0: Dashboard */}
        <TabsContent value="0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 cpm-shimmer">
            {kpis.map((kpi, i) => (
              <Card key={i} className={cn("cpm-kpi cpm-kpi-anim", kpiColorClasses[i])}>
                <CardContent className="glass-subtle p-4">
                  <div className="flex items-center justify-between">
                    <div><p className="text-xs text-muted-foreground">{kpi.label}</p><p className="text-xl font-bold tabular-nums mt-1">{kpi.value}</p></div>
                    <kpi.icon className="w-8 h-8 opacity-20" style={{ color: kpi.color }} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="cpm-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Daily Utilization (30 days)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><AreaChart data={data.dailyUtil}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} /><Area type="monotone" dataKey="onRent" stackId="1" stroke="#0d9488" fill="#0d948840" /><Area type="monotone" dataKey="available" stackId="1" stroke="#059669" fill="#05966940" /><Area type="monotone" dataKey="maintenance" stackId="1" stroke="#d97706" fill="#d9770640" /></AreaChart></ResponsiveContainer></CardContent></Card>
            <Card className="cpm-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Port-wise Chassis</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={data.portWise}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="port" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="count" fill="#334155" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="cpm-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Chassis Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={data.typeDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={{ fontSize: 10 }}>{data.typeDist.map((_, i) => <Cell key={i} fill={data.PIE_COLORS[i % data.PIE_COLORS.length]} />)}</Pie><Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} /></PieChart></ResponsiveContainer></CardContent></Card>
          </div>
        </TabsContent>

        {/* Tab 1: Fleet Registry */}
        <TabsContent value="1">
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search chassis ID, serial, owner..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} /></div>
            <Select value={filterStatus} onValueChange={setFilterStatus}><SelectTrigger className="w-[160px]"><SelectValue placeholder="Filter status" /></SelectTrigger><SelectContent>{["all", ...data.CHASSIS_STATUSES].map(s => <SelectItem key={s} value={s}>{s === "all" ? "All Statuses" : s}</SelectItem>)}</SelectContent></Select>
          </div>
          <Card><CardContent className="glass-subtle p-0"><div className="overflow-x-auto"><Table><TableHeader><TableRow>{["chassisId", "type", "status", "owner", "location", "condition", "year", "tirePct", "lastInspection", "serial"].map(col => <SortHeader key={col} col={col} label={data.COL_LABELS[col] || col} />)}<TableHead className="text-xs">Actions</TableHead></TableRow></TableHeader><TableBody className="cpm-table cpm-table-tab1">{filteredChassis.slice(0, 30).map((c, i) => (<TableRow key={i} className="cursor-pointer" onClick={() => { setDrawerRecord(c as unknown as Record<string, unknown>); setDrawerType("chassis"); setDrawerOpen(true); }}><TableCell className="text-xs font-mono">{c.chassisId}</TableCell><TableCell><ChassisTypeBadge type={c.type} /></TableCell><TableCell><StatusBadge status={c.status} color={data.STATUS_COLORS[c.status] || "#475569"} /></TableCell><TableCell className="text-xs">{c.owner}</TableCell><TableCell><LocationBadge loc={c.location} /></TableCell><TableCell><ConditionBadge condition={c.condition} /></TableCell><TableCell className="text-xs tabular-nums">{c.year}</TableCell><TableCell><TireBar pct={c.tirePct} /></TableCell><TableCell className="text-xs">{c.lastInspection}</TableCell><TableCell className="text-xs font-mono">{c.serial}</TableCell><TableCell><Button size="sm" variant="ghost" className="cpm-action-btn" onClick={e => { e.stopPropagation(); toast.info("Details", `Chassis ${c.chassisId} details`) }}><Eye className="w-3.5 h-3.5" /></Button></TableCell></TableRow>))}</TableBody></Table></div></CardContent></Card>
        </TabsContent>

        {/* Tab 2: Allocation & Booking */}
        <TabsContent value="2">
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search allocation, customer..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} /></div>
            <Select value={filterStatus} onValueChange={setFilterStatus}><SelectTrigger className="w-[160px]"><SelectValue placeholder="Filter status" /></SelectTrigger><SelectContent>{["all", ...data.ALLOC_STATUSES].map(s => <SelectItem key={s} value={s}>{s === "all" ? "All Statuses" : s}</SelectItem>)}</SelectContent></Select>
          </div>
          <Card><CardContent className="numeric-cell glass-subtle p-0"><div className="overflow-x-auto"><Table><TableHeader><TableRow>{["id", "allocationType", "status", "customer", "duration", "pickup", "dropoff", "cost", "startDate", "endDate"].map(col => <SortHeader key={col} col={col} label={data.COL_LABELS[col] || col} />)}<TableHead className="text-xs">Actions</TableHead></TableRow></TableHeader><TableBody className="cpm-table cpm-table-tab2">{filteredAlloc.slice(0, 30).map((a, i) => (<TableRow key={i} className="cursor-pointer" onClick={() => { setDrawerRecord(a as unknown as Record<string, unknown>); setDrawerType("alloc"); setDrawerOpen(true); }}><TableCell className="text-xs font-mono">{a.id}</TableCell><TableCell className="text-xs">{a.allocationType}</TableCell><TableCell><StatusBadge status={a.status} color={data.STATUS_COLORS[a.status] || "#475569"} /></TableCell><TableCell><CustomerBadge customer={a.customer} /></TableCell><TableCell><DurationBadge dur={a.duration} /></TableCell><TableCell className="text-xs">{a.pickup}</TableCell><TableCell className="text-xs">{a.dropoff}</TableCell><TableCell><CostTile amount={a.cost} /></TableCell><TableCell className="text-xs">{a.startDate}</TableCell><TableCell className="text-xs">{a.endDate}</TableCell><TableCell><Button size="sm" variant="ghost" className="cpm-action-btn" onClick={e => { e.stopPropagation(); toast.info("Allocation", `${a.id} details`) }}><Eye className="w-3.5 h-3.5" /></Button></TableCell></TableRow>))}</TableBody></Table></div></CardContent></Card>
        </TabsContent>

        {/* Tab 3: Maintenance */}
        <TabsContent value="3">
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search maintenance record..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} /></div>
            <Select value={filterStatus} onValueChange={setFilterStatus}><SelectTrigger className="w-[160px]"><SelectValue placeholder="Filter status" /></SelectTrigger><SelectContent>{["all", ...data.MAINT_STATUSES].map(s => <SelectItem key={s} value={s}>{s === "all" ? "All Statuses" : s}</SelectItem>)}</SelectContent></Select>
          </div>
          <Card><CardContent className="numeric-cell glass-subtle p-0"><div className="overflow-x-auto"><Table><TableHeader><TableRow>{["id", "maintType", "status", "priority", "facility", "partsCost", "laborHrs", "nextDue", "scheduledDate", "chassisId"].map(col => <SortHeader key={col} col={col} label={data.COL_LABELS[col] || col} />)}<TableHead className="text-xs">Actions</TableHead></TableRow></TableHeader><TableBody className="cpm-table cpm-table-tab3">{filteredMaint.slice(0, 30).map((m, i) => (<TableRow key={i} className="cursor-pointer" onClick={() => { setDrawerRecord(m as unknown as Record<string, unknown>); setDrawerType("maint"); setDrawerOpen(true); }}><TableCell className="text-xs font-mono">{m.id}</TableCell><TableCell className="text-xs">{m.maintType}</TableCell><TableCell><StatusBadge status={m.status} color={data.STATUS_COLORS[m.status] || "#475569"} /></TableCell><TableCell><PriorityBadge priority={m.priority} /></TableCell><TableCell><FacilityBadge facility={m.facility} /></TableCell><TableCell className="text-xs font-semibold tabular-nums">{formatINR(m.partsCost)}</TableCell><TableCell className="text-xs tabular-nums">{m.laborHrs}h</TableCell><TableCell className="text-xs">{m.nextDue}</TableCell><TableCell className="text-xs">{m.scheduledDate}</TableCell><TableCell className="text-xs font-mono">{m.chassisId}</TableCell><TableCell><Button size="sm" variant="ghost" className="cpm-action-btn" onClick={e => { e.stopPropagation(); toast.info("Maintenance", `${m.id} details`) }}><Eye className="w-3.5 h-3.5" /></Button></TableCell></TableRow>))}</TableBody></Table></div></CardContent></Card>
        </TabsContent>

        {/* Tab 4: Billing */}
        <TabsContent value="4">
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search bill, customer..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} /></div>
            <Select value={filterStatus} onValueChange={setFilterStatus}><SelectTrigger className="w-[160px]"><SelectValue placeholder="Filter status" /></SelectTrigger><SelectContent>{["all", ...data.BILL_STATUSES].map(s => <SelectItem key={s} value={s}>{s === "all" ? "All Statuses" : s}</SelectItem>)}</SelectContent></Select>
          </div>
          <Card><CardContent className="numeric-cell glass-subtle p-0"><div className="overflow-x-auto"><Table><TableHeader><TableRow>{["id", "chargeType", "status", "customer", "paymentMethod", "amount", "tax", "dueDate", "paidDate", "chassisId"].map(col => <SortHeader key={col} col={col} label={data.COL_LABELS[col] || col} />)}<TableHead className="text-xs">Actions</TableHead></TableRow></TableHeader><TableBody className="cpm-table cpm-table-tab4">{filteredBill.slice(0, 30).map((b, i) => (<TableRow key={i} className="cursor-pointer" onClick={() => { setDrawerRecord(b as unknown as Record<string, unknown>); setDrawerType("bill"); setDrawerOpen(true); }}><TableCell className="text-xs font-mono">{b.id}</TableCell><TableCell className="text-xs">{b.chargeType}</TableCell><TableCell><StatusBadge status={b.status} color={data.STATUS_COLORS[b.status] || "#475569"} /></TableCell><TableCell><CustomerBadge customer={b.customer} /></TableCell><TableCell><PaymentMethodBadge method={b.paymentMethod} /></TableCell><TableCell className="text-xs font-bold tabular-nums">{formatINR(b.amount)}</TableCell><TableCell className="text-xs tabular-nums">{formatINR(b.tax)}</TableCell><TableCell><DueDateIndicator date={b.dueDate} /></TableCell><TableCell className="text-xs">{b.paidDate}</TableCell><TableCell className="text-xs font-mono">{b.chassisId}</TableCell><TableCell><Button size="sm" variant="ghost" className="cpm-action-btn" onClick={e => { e.stopPropagation(); toast.info("Billing", `${b.id} details`) }}><Eye className="w-3.5 h-3.5" /></Button></TableCell></TableRow>))}</TableBody></Table></div></CardContent></Card>
        </TabsContent>

        {/* Tab 5: Pool Analytics */}
        <TabsContent value="5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 cpm-shimmer">
            {[
              { label: "Total Revenue", value: formatINR(data.analytics.totalRevenue), idx: 0 },
              { label: "Avg Daily Rate", value: formatINR(data.analytics.avgDailyRate), idx: 1 },
              { label: "Utilization Rate", value: `${data.analytics.utilizationRate}%`, idx: 2 },
              { label: "Maint. Cost", value: formatINR(data.analytics.maintenanceCost), idx: 3 },
              { label: "Availability", value: `${data.analytics.availabilityIndex}%`, idx: 4 },
              { label: "Turnaround", value: `${data.analytics.turnaroundTime}d`, idx: 5 },
              { label: "Fleet Age", value: `${data.analytics.fleetAge}yr`, idx: 6 },
              { label: "Satisfaction", value: `${data.analytics.customerSatisfaction}%`, idx: 7 },
            ].map((kpi, i) => (
              <Card key={i} className={cn("cpm-analytics-card", kpiColorClasses[kpi.idx])} style={{ borderLeftColor: ["#334155", "#0d9488", "#4f46e5", "#e11d48", "#059669", "#d97706", "#ea580c", "#0891b2"][kpi.idx] }}>
                <CardContent className="glass-subtle p-4"><p className="text-xs text-muted-foreground">{kpi.label}</p><p className="text-lg font-bold tabular-nums mt-1">{kpi.value}</p></CardContent>
              </Card>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="cpm-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Revenue vs Cost (6 months)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={data.monthlyRev}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} /><Bar dataKey="revenue" fill="#334155" radius={[4, 4, 0, 0]} /><Bar dataKey="cost" fill="#d97706" radius={[4, 4, 0, 0]} /><Bar dataKey="maintenance" fill="#e11d48" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="cpm-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Utilization by Location</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={data.utilByLoc} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" tick={{ fontSize: 10 }} /><YAxis dataKey="location" type="category" tick={{ fontSize: 10 }} width={65} /><Tooltip /><Bar dataKey="utilization" fill="#0d9488" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="cpm-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Customer Allocation</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={data.custAlloc} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={{ fontSize: 10 }}>{data.custAlloc.map((_, i) => <Cell key={i} fill={data.PIE_COLORS[i % data.PIE_COLORS.length]} />)}</Pie><Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} /></PieChart></ResponsiveContainer></CardContent></Card>
            <Card className="cpm-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Maintenance Cost Trend</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={data.maintCost}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Line type="monotone" dataKey="cost" stroke="#e11d48" strokeWidth={2} dot={{ r: 3 }} /></LineChart></ResponsiveContainer></CardContent></Card>
            <Card className="cpm-chart-card md:col-span-2"><CardHeader className="pb-2"><CardTitle className="text-sm">Fleet Age Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><AreaChart data={data.ageDist}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="range" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Area type="monotone" dataKey="count" stroke="#4f46e5" fill="#4f46e530" strokeWidth={2} /></AreaChart></ResponsiveContainer></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Drawer */}
      <Sheet open={!!(drawerOpen && drawerType)} onOpenChange={setDrawerOpen}>
        <SheetContent className="cpm-drawer w-[420px] sm:w-[500px] overflow-y-auto">
          <>
            {/* Chassis Drawer */}
            {drawerType === "chassis" && drawerRecord && (() => {
              const rec = drawerRecord as unknown as { id: string; chassisId: string; serial: string; type: string; status: string; owner: string; location: string; condition: string; year: number; tirePct: number; lastInspection: string; kmTraveled: number }
              return (<>
                <SheetHeader className="px-4 py-4 rounded-t-xl bg-gradient-to-r from-slate-600 to-slate-800 text-white"><SheetTitle className="text-base">{rec.chassisId} — {rec.type}</SheetTitle></SheetHeader>
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-2 flex-wrap"><ChassisTypeBadge type={rec.type} /><StatusBadge status={rec.status} color={data.STATUS_COLORS[rec.status] || "#475569"} /><ConditionBadge condition={rec.condition} /><LocationBadge loc={rec.location} /></div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span className="text-muted-foreground">Serial No</span><div className="font-mono font-semibold">{rec.serial}</div></div>
                    <div><span className="text-muted-foreground">Year</span><div className="font-medium">{rec.year}</div></div>
                    <div><span className="text-muted-foreground">Owner</span><div className="font-medium">{rec.owner}</div></div>
                    <div><span className="text-muted-foreground">KM Traveled</span><div className="font-medium tabular-nums">{rec.kmTraveled.toLocaleString("en-IN")}</div></div>
                    <div className="col-span-2"><span className="text-muted-foreground">Tire Condition</span><div className="mt-1"><TireBar pct={rec.tirePct} /></div></div>
                    <div><span className="text-muted-foreground">Last Inspection</span><div className="font-medium">{rec.lastInspection}</div></div>
                    <div><span className="text-muted-foreground">ID</span><div className="font-mono font-semibold">{rec.id}</div></div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="cpm-action-btn flex-1 bg-slate-700 hover:bg-slate-800" onClick={() => { toast.success("Allocated", `${rec.chassisId} allocated`); setDrawerOpen(false) }}><Truck className="w-3.5 h-3.5 mr-1" />Allocate</Button>
                    <Button size="sm" variant="outline" className="btn-outline-animate cpm-action-btn flex-1" onClick={() => { toast.info("Maintenance", `${rec.chassisId} sent for maintenance`); setDrawerOpen(false) }}><Wrench className="w-3.5 h-3.5 mr-1" />Maintain</Button>
                    <Button size="sm" variant="outline" className="btn-outline-animate cpm-action-btn" onClick={() => { toast.info("Inspection", `${rec.chassisId} inspection scheduled`); setDrawerOpen(false) }}><Search className="w-3.5 h-3.5 mr-1" />Inspect</Button>
                  </div>
                </div>
              </>)
            })()}

            {/* Allocation Drawer */}
            {drawerType === "alloc" && drawerRecord && (() => {
              const rec = drawerRecord as unknown as { id: string; status: string; allocationType: string; customer: string; duration: string; pickup: string; dropoff: string; cost: number; startDate: string; endDate: string; chassisId: string }
              return (<>
                <SheetHeader className="px-4 py-4 rounded-t-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white"><SheetTitle className="text-base">{rec.id} — {rec.allocationType}</SheetTitle></SheetHeader>
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-2 flex-wrap"><StatusBadge status={rec.status} color={data.STATUS_COLORS[rec.status] || "#475569"} /><CustomerBadge customer={rec.customer} /><DurationBadge dur={rec.duration} /></div>
                  <PickupDropTile from={rec.pickup} to={rec.dropoff} />
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span className="text-muted-foreground">Allocation ID</span><div className="font-mono font-semibold">{rec.id}</div></div>
                    <div><span className="text-muted-foreground">Type</span><div className="font-medium">{rec.allocationType}</div></div>
                    <div><span className="text-muted-foreground">Cost</span><div className="font-bold tabular-nums">{formatINR(rec.cost)}</div></div>
                    <div><span className="text-muted-foreground">Chassis</span><div className="font-mono">{rec.chassisId}</div></div>
                    <div><span className="text-muted-foreground">Start</span><div className="font-medium">{rec.startDate}</div></div>
                    <div><span className="text-muted-foreground">End</span><div className="font-medium">{rec.endDate}</div></div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="cpm-action-btn flex-1 bg-teal-600 hover:bg-teal-700" onClick={() => { toast.success("Extended", `${rec.id} extended`); setDrawerOpen(false) }}><Clock className="w-3.5 h-3.5 mr-1" />Extend</Button>
                    <Button size="sm" variant="outline" className="btn-outline-animate cpm-action-btn flex-1" onClick={() => { toast.info("Returned", `${rec.id} returned`); setDrawerOpen(false) }}><RotateCcw className="w-3.5 h-3.5 mr-1" />Return</Button>
                    <Button size="sm" variant="outline" className="btn-outline-animate cpm-action-btn" onClick={() => { toast.warning("Shortfall", `${rec.id} shortfall reported`); setDrawerOpen(false) }}><AlertTriangle className="w-3.5 h-3.5 mr-1" />Shortfall</Button>
                  </div>
                </div>
              </>)
            })()}

            {/* Maintenance Drawer */}
            {drawerType === "maint" && drawerRecord && (() => {
              const rec = drawerRecord as unknown as { id: string; status: string; maintType: string; priority: string; facility: string; partsCost: number; laborHrs: number; nextDue: string; scheduledDate: string; chassisId: string }
              return (<>
                <SheetHeader className="px-4 py-4 rounded-t-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white"><SheetTitle className="text-base">{rec.id} — {rec.maintType}</SheetTitle></SheetHeader>
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-2 flex-wrap"><StatusBadge status={rec.status} color={data.STATUS_COLORS[rec.status] || "#475569"} /><PriorityBadge priority={rec.priority} /><FacilityBadge facility={rec.facility} /></div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span className="text-muted-foreground">Record ID</span><div className="font-mono font-semibold">{rec.id}</div></div>
                    <div><span className="text-muted-foreground">Type</span><div className="font-medium">{rec.maintType}</div></div>
                    <div><span className="text-muted-foreground">Parts Cost</span><div className="font-bold tabular-nums">{formatINR(rec.partsCost)}</div></div>
                    <div><span className="text-muted-foreground">Labor Hours</span><div className="font-medium tabular-nums">{rec.laborHrs}h</div></div>
                    <div><span className="text-muted-foreground">Scheduled</span><div className="font-medium">{rec.scheduledDate}</div></div>
                    <div><span className="text-muted-foreground">Next Due</span><div className="font-medium">{rec.nextDue}</div></div>
                    <div className="col-span-2"><span className="text-muted-foreground">Chassis</span><div className="font-mono">{rec.chassisId}</div></div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="cpm-action-btn flex-1 bg-amber-600 hover:bg-amber-700" onClick={() => { toast.success("Approved", `${rec.id} approved`); setDrawerOpen(false) }}><CheckCircle2 className="w-3.5 h-3.5 mr-1" />Approve</Button>
                    <Button size="sm" variant="outline" className="btn-outline-animate cpm-action-btn flex-1" onClick={() => { toast.info("Rescheduled", `${rec.id} rescheduled`); setDrawerOpen(false) }}><CalendarDays className="w-3.5 h-3.5 mr-1" />Reschedule</Button>
                    <Button size="sm" variant="outline" className="btn-outline-animate cpm-action-btn" onClick={() => { toast.success("Completed", `${rec.id} completed`); setDrawerOpen(false) }}><CheckCircle2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
              </>)
            })()}

            {/* Billing Drawer */}
            {drawerType === "bill" && drawerRecord && (() => {
              const rec = drawerRecord as unknown as { id: string; status: string; chargeType: string; customer: string; paymentMethod: string; amount: number; tax: number; dueDate: string; paidDate: string; chassisId: string }
              return (<>
                <SheetHeader className="px-4 py-4 rounded-t-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white"><SheetTitle className="text-base">{rec.id} — {rec.chargeType}</SheetTitle></SheetHeader>
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-2 flex-wrap"><StatusBadge status={rec.status} color={data.STATUS_COLORS[rec.status] || "#475569"} /><CustomerBadge customer={rec.customer} /><PaymentMethodBadge method={rec.paymentMethod} /></div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span className="text-muted-foreground">Bill ID</span><div className="font-mono font-semibold">{rec.id}</div></div>
                    <div><span className="text-muted-foreground">Charge Type</span><div className="font-medium">{rec.chargeType}</div></div>
                    <div><span className="text-muted-foreground">Amount</span><div className="font-bold tabular-nums text-lg">{formatINR(rec.amount)}</div></div>
                    <div><span className="text-muted-foreground">Tax</span><div className="mt-0.5"><TaxTile tax={rec.tax} /></div></div>
                    <div><span className="text-muted-foreground">Due Date</span><div className="font-medium"><DueDateIndicator date={rec.dueDate} /></div></div>
                    <div><span className="text-muted-foreground">Paid Date</span><div className="font-medium">{rec.paidDate}</div></div>
                    <div className="col-span-2"><span className="text-muted-foreground">Chassis</span><div className="font-mono">{rec.chassisId}</div></div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="cpm-action-btn flex-1 bg-indigo-600 hover:bg-indigo-700" onClick={() => { toast.success("Sent", `${rec.id} sent to customer`); setDrawerOpen(false) }}><Send className="w-3.5 h-3.5 mr-1" />Send</Button>
                    <Button size="sm" variant="outline" className="btn-outline-animate cpm-action-btn flex-1" onClick={() => { toast.success("Paid", `${rec.id} marked as paid`); setDrawerOpen(false) }}><CheckCircle2 className="w-3.5 h-3.5 mr-1" />Mark Paid</Button>
                    <Button size="sm" variant="outline" className="btn-outline-animate cpm-action-btn" onClick={() => { toast.warning("Disputed", `${rec.id} disputed`); setDrawerOpen(false) }}><AlertTriangle className="w-3.5 h-3.5 mr-1" />Dispute</Button>
                  </div>
                </div>
              </>)
            })()}
          </>
        </SheetContent>
      </Sheet>
    </div>
  )
}
