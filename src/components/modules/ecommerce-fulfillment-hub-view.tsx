"use client"

import { useState, useMemo } from "react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts"
import {
  PackageCheck, ShoppingCart, Search, Eye, ArrowUpDown, TrendingUp,
  Clock, IndianRupee, Star, AlertTriangle, CheckCircle, XCircle,
  Package, BarChart3, Activity, Zap, Truck, Warehouse, Tag, Users,
  Box, MapPin, ScanBarcode, Printer, ArrowRightLeft,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { PageHeader } from "@/components/shared/page-header"
import { useToast } from "@/hooks/use-toast-helper"

/* ═══════════════════════════════════════════════════════════════════
   Seed-based deterministic random helpers
   ═══════════════════════════════════════════════════════════════════ */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297 + 233280) * 10000
  return x - Math.floor(x)
}
function ri(min: number, max: number, seed: number): number {
  return Math.floor(seededRandom(seed) * (max - min + 1)) + min
}

/* ═══════════════════════════════════════════════════════════════════
   Enums (as const)
   ═══════════════════════════════════════════════════════════════════ */
const ORDER_STATUSES = ["New", "Confirmed", "Picking", "Packing", "Quality Check", "Dispatched", "Delivered", "Cancelled"] as const
const MARKETPLACES = ["Amazon", "Flipkart", "Myntra", "Meesho", "Snapdeal", "Nykaa", "Ajio", "JioMart"] as const
const ORDER_TYPES = ["Standard", "Express", "Same-Day", "Next-Day", "Scheduled", "Pre-Order", "COD", "Gift Wrap"] as const
const INDIAN_CITIES = ["Mumbai", "Delhi NCR", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Nagpur", "Indore"] as const
const PICK_STATUSES = ["Assigned", "In Progress", "Completed", "Exception", "Short Pick", "Cancelled"] as const
const PACK_TYPES = ["Standard Box", "Bubble Wrap", "Custom Crating", "Poly Mailer", "Gift Box", "Pallet", "Carton", "Tube"] as const
const COURIER_PARTNERS = ["Delhivery", "Blue Dart", "DTDC", "Ecom Express", "Xpressbees", "Shadowfax", "Spoton", "VRL", "TCI Express", "Gati"] as const
const SLOT_TIMES = ["9AM-12PM", "12PM-3PM", "3PM-6PM", "6PM-9PM", "9AM-3PM", "12PM-6PM", "3PM-9PM"] as const
const BATCH_TYPES = ["Single SKU", "Multi SKU", "Bulk", "Fragile", "Hazmat", "Oversized", "Premium", "Returns Batch"] as const
const INDIAN_NAMES = ["Aarav Sharma", "Priya Patel", "Rohit Kumar", "Sneha Reddy", "Vikram Singh", "Anjali Gupta", "Arjun Mehta", "Divya Nair", "Karthik Iyer", "Pooja Das", "Manish Verma", "Ritu Joshi", "Sanjay Rathore", "Neha Saxena", "Deepak Chauhan"] as const
const COLORS = ["#3b82f6", "#059669", "#d97706", "#e11d48", "#7c3aed", "#0891b2", "#6366f1", "#f97316"]

/* ═══════════════════════════════════════════════════════════════════
   INR formatting
   ═══════════════════════════════════════════════════════════════════ */
function fmtINR(n: number): string {
  const sign = n < 0 ? "-" : ""
  const abs = Math.abs(n)
  if (abs >= 1e7) return `₹${sign}${(abs / 1e7).toFixed(2)} Cr`
  if (abs >= 1e5) return `₹${sign}${(abs / 1e5).toFixed(2)} L`
  return `₹${sign}${abs.toLocaleString("en-IN")}`
}

/* ═══════════════════════════════════════════════════════════════════
   16 Unique Visual Components
   ═══════════════════════════════════════════════════════════════════ */

function OrderStatusBadge({ status }: { status: string }) {
  const pulse = ["Picking", "Packing", "Quality Check"].includes(status)
  const colorMap: Record<string, string> = {
    New: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    Confirmed: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400",
    Picking: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    Packing: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
    "Quality Check": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400",
    Dispatched: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    Delivered: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
    Cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  }
  return (
    <Badge variant="outline" className={`ecf-status-badge gap-1 text-[10px] px-2 py-0.5 font-medium ${pulse ? "ecf-pulse-active" : ""} ${colorMap[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </Badge>
  )
}

function MarketplaceBadge({ mp }: { mp: string }) {
  const colorMap: Record<string, string> = {
    Amazon: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
    Flipkart: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    Myntra: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400",
    Meesho: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    Snapdeal: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    Nykaa: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-400",
    Ajio: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
    JioMart: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400",
  }
  return (
    <Badge variant="outline" className={`ecf-mp-badge gap-1 text-[10px] px-2 py-0.5 font-semibold ${colorMap[mp] || "bg-gray-100 text-gray-700"}`}>
      {mp}
    </Badge>
  )
}

function OrderTypeBadge({ type }: { type: string }) {
  const colorMap: Record<string, string> = {
    Standard: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    Express: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    "Same-Day": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    "Next-Day": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    Scheduled: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
    "Pre-Order": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400",
    COD: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    "Gift Wrap": "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400",
  }
  return (
    <Badge variant="outline" className={`ecf-otype-badge gap-1 text-[10px] px-2 py-0.5 font-medium ${colorMap[type] || "bg-gray-100 text-gray-700"}`}>
      <Zap className="h-3 w-3" /> {type}
    </Badge>
  )
}

function PickStatusBadge({ status }: { status: string }) {
  const pulse = ["In Progress"].includes(status)
  const colorMap: Record<string, string> = {
    Assigned: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    "In Progress": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    Completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    Exception: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    "Short Pick": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
    Cancelled: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  }
  return (
    <Badge variant="outline" className={`ecf-pick-badge gap-1 text-[10px] px-2 py-0.5 font-medium ${pulse ? "ecf-pulse-warning" : ""} ${colorMap[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </Badge>
  )
}

function PackTypeBadge({ type }: { type: string }) {
  const emoji = ["📦", "🫧", "🏗️", "✉️", "🎁", "🪵", "📋", "🧪"]
  const idx = PACK_TYPES.indexOf(type as typeof PACK_TYPES[number])
  return (
    <Badge variant="outline" className="badge-interactive ecf-pack-badge gap-1 text-[10px] px-2 py-0.5 font-medium">
      {idx >= 0 ? emoji[idx] : "📦"} {type}
    </Badge>
  )
}

function CourierBadge({ name }: { name: string }) {
  return (
    <Badge variant="outline" className="badge-interactive ecf-courier-badge gap-1 text-[10px] px-2 py-0.5 font-medium bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
      <Truck className="h-3 w-3" /> {name}
    </Badge>
  )
}

function SlotBadge({ slot }: { slot: string }) {
  return (
    <Badge variant="outline" className="badge-interactive ecf-slot-badge gap-1 text-[10px] px-2 py-0.5 font-medium bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
      <Clock className="h-3 w-3" /> {slot}
    </Badge>
  )
}

function BatchTypeBadge({ type }: { type: string }) {
  const colorMap: Record<string, string> = {
    "Single SKU": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    "Multi SKU": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    Bulk: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    Fragile: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    Hazmat: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
    Oversized: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
    Premium: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400",
    "Returns Batch": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  }
  return (
    <Badge variant="outline" className={`ecf-batch-badge gap-1 text-[10px] px-2 py-0.5 font-medium ${colorMap[type] || "bg-gray-100 text-gray-700"}`}>
      {type}
    </Badge>
  )
}

function SLABadge({ sla }: { sla: number }) {
  const color = sla > 6 ? "text-emerald-600 dark:text-emerald-400" : sla > 2 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
  const bgColor = sla > 6 ? "bg-emerald-50 dark:bg-emerald-900/30" : sla > 2 ? "bg-amber-50 dark:bg-amber-900/30" : "bg-red-50 dark:bg-red-900/30"
  return (
    <Badge variant="outline" className={`ecf-sla-badge gap-1 text-[10px] px-2 py-0.5 font-bold ${color} ${bgColor}`}>
      {sla}h left
    </Badge>
  )
}

function OrderValueTile({ amount }: { amount: number }) {
  return (
    <div className="ecf-value-tile inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
      <IndianRupee className="h-3 w-3" /> {fmtINR(amount)}
    </div>
  )
}

function PickRateBar({ rate }: { rate: number }) {
  const color = rate > 90 ? "bg-emerald-500" : rate > 70 ? "bg-amber-500" : "bg-red-500"
  return (
    <div className="ecf-pick-rate-bar flex items-center gap-2">
      <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${rate}%` }} />
      </div>
      <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">{rate}%</span>
    </div>
  )
}

function WeightTile({ kg }: { kg: number }) {
  return (
    <div className="ecf-weight-tile inline-flex items-center gap-1 rounded bg-gray-50 px-2 py-0.5 text-[11px] font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
      {kg} kg
    </div>
  )
}

function LineItemsTile({ count }: { count: number }) {
  return (
    <div className="ecf-items-tile inline-flex items-center gap-1 rounded bg-violet-50 px-2 py-0.5 text-[11px] font-bold text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
      <Box className="h-3 w-3" /> {count} items
    </div>
  )
}

function WarehouseBadge({ name }: { name: string }) {
  return (
    <Badge variant="outline" className="badge-interactive ecf-wh-badge gap-1 text-[10px] px-2 py-0.5 font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
      <Warehouse className="h-3 w-3" /> {name}
    </Badge>
  )
}

function ManifestBadge({ id }: { id: string }) {
  return (
    <div className="ecf-manifest-tile inline-flex items-center gap-1 rounded bg-cyan-50 px-2 py-0.5 text-[11px] font-mono font-semibold text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400">
      <ScanBarcode className="h-3 w-3" /> {id}
    </div>
  )
}

function PickerBadge({ name }: { name: string }) {
  return (
    <Badge variant="outline" className="badge-interactive ecf-picker-badge gap-1 text-[10px] px-2 py-0.5 font-medium bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
      <Users className="h-3 w-3" /> {name}
    </Badge>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   Data Generation
   ═══════════════════════════════════════════════════════════════════ */
function generateData() {
  const orders = Array.from({ length: 75 }, (_, i) => {
    const s = i * 7 + 1
    return {
      id: `ECF-${String(i + 1001).padStart(4, "0")}`,
      status: ORDER_STATUSES[i % 8],
      marketplace: MARKETPLACES[i % 8],
      type: ORDER_TYPES[i % 8],
      city: INDIAN_CITIES[i % 12],
      value: ri(300, 30000, s),
      orderId: `ORD-${ri(100000, 999999, s + 1)}`,
      customer: INDIAN_NAMES[i % 15],
      items: ri(1, 15, s + 2),
      weight: ri(100, 5000, s + 3),
      slaHrs: ri(1, 24, s + 4),
      warehouse: [`WH-${String(ri(1, 8, s + 5)).padStart(2, "0")} Mumbai`, `WH-${String(ri(1, 8, s + 6)).padStart(2, "0")} Delhi`, `WH-${String(ri(1, 8, s + 7)).padStart(2, "0")} BLR`][i % 3],
    }
  })
  const picks = Array.from({ length: 70 }, (_, i) => {
    const s = i * 6 + 200
    return {
      id: `PK-${String(i + 2001).padStart(4, "0")}`,
      status: PICK_STATUSES[i % 6],
      picker: INDIAN_NAMES[i % 15],
      orderId: `ECF-${String(i + 1001).padStart(4, "0")}`,
      sku: `SKU-${ri(10000, 99999, s)}`,
      qty: ri(1, 50, s + 1),
      zone: [`Zone A-${ri(1, 10, s + 2)}`, `Zone B-${ri(1, 10, s + 3)}`, `Zone C-${ri(1, 10, s + 4)}`][i % 3],
      time: ri(2, 30, s + 5),
      accuracy: ri(85, 100, s),
    }
  })
  const packs = Array.from({ length: 55 }, (_, i) => {
    const s = i * 5 + 400
    return {
      id: `PCK-${String(i + 3001).padStart(4, "0")}`,
      type: PACK_TYPES[i % 8],
      orderId: `ECF-${String(i + 1001).padStart(4, "0")}`,
      courier: COURIER_PARTNERS[i % 10],
      awbNo: `AWB${ri(1000000000, 9999999999, s)}`,
      weight: ri(200, 8000, s + 1),
      dimensions: `${ri(10, 80, s + 2)}x${ri(10, 60, s + 3)}x${ri(5, 50, s + 4)}cm`,
      slot: SLOT_TIMES[i % 7],
      printed: i % 5 !== 0,
    }
  })
  const batches = Array.from({ length: 65 }, (_, i) => {
    const s = i * 4 + 600
    return {
      id: `BAT-${String(i + 4001).padStart(4, "0")}`,
      type: BATCH_TYPES[i % 8],
      warehouse: [`Mumbai Hub`, `Delhi NCR Hub`, `Bangalore DC`, `Chennai Terminal`, `Hyderabad Center`][i % 5],
      orders: ri(5, 200, s),
      skus: ri(1, 50, s + 1),
      assignedTo: INDIAN_NAMES[i % 15],
      eta: ri(30, 480, s + 2),
      status: i % 4 === 0 ? "Pending" : i % 4 === 1 ? "In Progress" : i % 4 === 2 ? "Completed" : "On Hold",
    }
  })
  return { ORDER_STATUSES, MARKETPLACES, ORDER_TYPES, INDIAN_CITIES, PICK_STATUSES, PACK_TYPES, COURIER_PARTNERS, SLOT_TIMES, BATCH_TYPES, INDIAN_NAMES, orders, picks, packs, batches }
}

/* ═══════════════════════════════════════════════════════════════════
   Sort / Filter helpers
   ═══════════════════════════════════════════════════════════════════ */
function filterData<T,>(data: T[], q: string): T[] {
  if (!q) return data
  const lower = q.toLowerCase()
  return data.filter(item => Object.values(item as unknown as Record<string, string | number>).some(v => String(v).toLowerCase().includes(lower)))
}
function sortedData<T,>(data: T[], field: string, dir: "asc" | "desc"): T[] {
  return [...data].sort((a, b) => {
    const av = (a as unknown as Record<string, string | number>)[field]
    const bv = (b as unknown as Record<string, string | number>)[field]
    if (typeof av === "number" && typeof bv === "number") return dir === "asc" ? av - bv : bv - av
    return dir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av))
  })
}

/* ═══════════════════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════════════════ */
export default function EcommerceFulfillmentHubView() {
  const data = useMemo(() => generateData(), [])
  const [activeTab, setActiveTab] = useState("0")
  const [searchQ, setSearchQ] = useState("")
  const [sortField, setSortField] = useState("")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<typeof data.orders[0] | null>(null)
  const { toast } = useToast()

  const handleSort = (f: string) => {
    if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortField(f); setSortDir("asc") }
  }

  const kpis = [
    { label: "Total Orders", value: data.orders.length, icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Fulfillment Rate", value: `${Math.round(data.orders.filter(x => ["Dispatched", "Delivered"].includes(x.status)).length / data.orders.length * 100)}%`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "Revenue", value: fmtINR(data.orders.reduce((s, o) => s + o.value, 0)), icon: IndianRupee, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { label: "Avg Processing", value: `${(data.picks.reduce((s, p) => s + p.time, 0) / data.picks.length).toFixed(0)}min`, icon: Clock, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/20" },
    { label: "Pick Accuracy", value: `${Math.round(data.picks.reduce((s, p) => s + p.accuracy, 0) / data.picks.length)}%`, icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Packed Today", value: data.packs.length, icon: Package, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "Active Batches", value: data.batches.filter(x => x.status === "In Progress").length, icon: Activity, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { label: "Channels", value: MARKETPLACES.length, icon: BarChart3, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/20" },
  ]

  // Charts
  const dailyOrders = Array.from({ length: 7 }, (_, i) => ({ day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i], Standard: ri(40, 100, i + 10), Express: ri(10, 30, i + 50), SameDay: ri(2, 10, i + 90) }))
  const mpPie = MARKETPLACES.map((m, i) => ({ name: m, value: ri(10, 60, i + 100) }))
  const cityBar = INDIAN_CITIES.map((c, i) => ({ city: c, Orders: ri(20, 100, i + 150) }))

  const filteredOrders = sortedData(filterData(data.orders, searchQ), sortField, sortDir)
  const filteredPicks = sortedData(filterData(data.picks, searchQ), sortField, sortDir)

  const SortHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <Button variant="ghost" size="sm" className="ecf-sort-header h-8 px-2 text-[10px] font-semibold hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => handleSort(field)}>
      <span className="flex items-center gap-1">{children}<ArrowUpDown className="h-3 w-3" /></span>
    </Button>
  )

  return (
    <div className="ecf-root space-y-4 p-4">
      <PageHeader title="E-commerce Fulfillment Hub" description="Multi-channel order processing, pick-pack-ship operations, batch management and dispatch" />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="ecf-tabs space-y-4">
        <TabsList className="ecf-tabs-list h-10 rounded-lg bg-gray-100 dark:bg-gray-800">
          {["Fulfillment Dashboard", "Order Management", "Pick Operations", "Pack & Ship", "Batch Management", "Fulfillment Analytics"].map((t, i) => (
            <TabsTrigger key={i} value={String(i)} className="ecf-tab-trigger text-xs font-medium px-3">{t}</TabsTrigger>
          ))}
        </TabsList>

        {/* ══════════ Tab 0: Dashboard ══════════ */}
        <TabsContent value="0" className="ecf-tab-content space-y-4">
          <div className="ecf-kpi-grid grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-4">
            {kpis.map((k, i) => (
              <Card key={i} className={`ecf-kpi-card group hover:shadow-md transition-all duration-300 ${k.bg}`}>
                <CardContent className="glass-subtle flex items-center gap-3 p-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ${k.color}`}><k.icon className="h-5 w-5" /></div>
                  <div className="min-w-0"><p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 truncate">{k.label}</p><p className={`text-lg font-bold ${k.color}`}>{k.value}</p></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="ecf-chart-grid grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="ecf-chart-card hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Daily Order Volume</CardTitle></CardHeader>
              <CardContent><AreaChart data={dailyOrders}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Area type="monotone" dataKey="Standard" stackId="a" fill="#3b82f6" /><Area type="monotone" dataKey="Express" stackId="a" fill="#059669" /><Area type="monotone" dataKey="SameDay" stackId="a" fill="#e11d48" /></AreaChart></CardContent>
            </Card>
            <Card className="ecf-chart-card hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Marketplace Distribution</CardTitle></CardHeader>
              <CardContent><PieChart><Pie data={mpPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{mpPie.map((_, i) => <Cell key={i} fill={COLORS[i % 8]} />)}</Pie><Tooltip /></PieChart></CardContent>
            </Card>
            <Card className="ecf-chart-card hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">City-wise Orders</CardTitle></CardHeader>
              <CardContent><BarChart data={cityBar}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="city" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" height={60} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="Orders" fill="#3b82f6" radius={[4, 4, 0, 0]} /></BarChart></CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ══════════ Tab 1: Order Management ══════════ */}
        <TabsContent value="1" className="ecf-tab-content space-y-4">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /><Input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search orders..." className="pl-9 h-9 text-sm" /></div>
            <Badge variant="outline" className="badge-interactive text-xs">{filteredOrders.length} orders</Badge>
          </div>
          <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-900">
            <table className="ecf-order-table w-full text-xs">
              <thead><tr className="border-b bg-gray-50 dark:bg-gray-800"><th className="p-2 text-left"><SortHeader field="id">ID</SortHeader></th><th className="p-2 text-left"><SortHeader field="status">Status</SortHeader></th><th className="p-2 text-left">Marketplace</th><th className="p-2 text-left">Type</th><th className="p-2 text-left"><SortHeader field="value">Value</SortHeader></th><th className="p-2 text-left">Items</th><th className="p-2 text-left">Weight</th><th className="p-2 text-left">City</th><th className="p-2 text-left">SLA</th><th className="p-2 text-center">Action</th></tr></thead>
              <tbody>
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="ecf-table-row border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-2 font-mono font-semibold">{ord.id}</td>
                    <td className="p-2"><OrderStatusBadge status={ord.status} /></td>
                    <td className="p-2"><MarketplaceBadge mp={ord.marketplace} /></td>
                    <td className="p-2"><OrderTypeBadge type={ord.type} /></td>
                    <td className="p-2"><OrderValueTile amount={ord.value} /></td>
                    <td className="p-2"><LineItemsTile count={ord.items} /></td>
                    <td className="p-2"><WeightTile kg={ord.weight} /></td>
                    <td className="p-2 text-[10px] font-medium text-gray-600 dark:text-gray-400">{ord.city}</td>
                    <td className="p-2"><SLABadge sla={ord.slaHrs} /></td>
                    <td className="p-2 text-center"><Button variant="ghost" size="sm" className="ecf-view-btn h-7 w-7 p-0 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30" onClick={() => { setSelectedOrder(ord); setSheetOpen(true); toast.success("Viewing Order", `${ord.id} details opened`) }}><Eye className="h-3.5 w-3.5" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ══════════ Tab 2: Pick Operations ══════════ */}
        <TabsContent value="2" className="ecf-tab-content space-y-4">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /><Input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search picks..." className="pl-9 h-9 text-sm" /></div>
            <Badge variant="outline" className="badge-interactive text-xs">{filteredPicks.length} picks</Badge>
          </div>
          <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-900">
            <table className="ecf-pick-table w-full text-xs">
              <thead><tr className="border-b bg-gray-50 dark:bg-gray-800"><th className="p-2 text-left">ID</th><th className="p-2 text-left"><SortHeader field="status">Status</SortHeader></th><th className="p-2 text-left">Picker</th><th className="p-2 text-left">Order</th><th className="p-2 text-left">SKU</th><th className="p-2 text-left">Qty</th><th className="p-2 text-left">Zone</th><th className="p-2 text-left"><SortHeader field="time">Time</SortHeader></th><th className="p-2 text-left">Accuracy</th></tr></thead>
              <tbody>
                {filteredPicks.map((pk) => (
                  <tr key={pk.id} className="ecf-table-row border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-2 font-mono font-semibold">{pk.id}</td>
                    <td className="p-2"><PickStatusBadge status={pk.status} /></td>
                    <td className="p-2"><PickerBadge name={pk.picker} /></td>
                    <td className="p-2 text-[10px] font-mono">{pk.orderId}</td>
                    <td className="p-2 text-[10px] font-mono font-medium">{pk.sku}</td>
                    <td className="p-2 text-[10px] font-semibold">{pk.qty}</td>
                    <td className="p-2 text-[10px] font-medium text-gray-600 dark:text-gray-400">{pk.zone}</td>
                    <td className="p-2 text-[10px]">{pk.time}min</td>
                    <td className="p-2"><PickRateBar rate={pk.accuracy} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ══════════ Tab 3: Pack & Ship ══════════ */}
        <TabsContent value="3" className="ecf-tab-content space-y-4">
          <div className="ecf-pack-grid grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {data.packs.map((pk) => (
              <Card key={pk.id} className="ecf-pack-card group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden border-l-4 border-l-blue-500">
                <div className="ecf-pack-card-header p-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                  <div className="badge-interactive flex items-center justify-between"><PackTypeBadge type={pk.type} /><Badge variant="outline" className="text-[10px] px-2 py-0.5 border-white/30 text-white bg-white/10">{pk.printed ? "Label Printed" : "Pending"}</Badge></div>
                  <p className="text-lg font-bold mt-1">{pk.id}</p>
                </div>
                <CardContent className="glass-subtle p-3 space-y-2">
                  <div className="flex items-center justify-between"><span className="text-[10px] text-gray-500 dark:text-gray-400">AWB</span><ManifestBadge id={pk.awbNo} /></div>
                  <div className="flex items-center justify-between"><span className="text-[10px] text-gray-500 dark:text-gray-400">Courier</span><CourierBadge name={pk.courier} /></div>
                  <div className="flex items-center justify-between"><span className="text-[10px] text-gray-500 dark:text-gray-400">Weight</span><WeightTile kg={pk.weight} /></div>
                  <div className="flex items-center justify-between"><span className="text-[10px] text-gray-500 dark:text-gray-400">Dimensions</span><span className="text-[10px] font-mono font-medium text-gray-600 dark:text-gray-400">{pk.dimensions}</span></div>
                  <div className="flex items-center justify-between"><span className="text-[10px] text-gray-500 dark:text-gray-400">Slot</span><SlotBadge slot={pk.slot} /></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ══════════ Tab 4: Batch Management ══════════ */}
        <TabsContent value="4" className="ecf-tab-content space-y-4">
          <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-900">
            <table className="ecf-batch-table w-full text-xs">
              <thead><tr className="border-b bg-gray-50 dark:bg-gray-800"><th className="p-2 text-left">ID</th><th className="p-2 text-left">Type</th><th className="p-2 text-left">Warehouse</th><th className="p-2 text-left">Orders</th><th className="p-2 text-left">SKUs</th><th className="p-2 text-left">Assigned To</th><th className="p-2 text-left">ETA</th><th className="p-2 text-left">Status</th></tr></thead>
              <tbody>
                {data.batches.map((b) => (
                  <tr key={b.id} className="ecf-table-row border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-2 font-mono font-semibold">{b.id}</td>
                    <td className="p-2"><BatchTypeBadge type={b.type} /></td>
                    <td className="p-2"><WarehouseBadge name={b.warehouse} /></td>
                    <td className="p-2 text-[10px] font-bold">{b.orders}</td>
                    <td className="p-2"><LineItemsTile count={b.skus} /></td>
                    <td className="p-2"><PickerBadge name={b.assignedTo} /></td>
                    <td className="p-2"><SLABadge sla={Math.round(b.eta / 60)} /></td>
                    <td className="p-2"><PickStatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ══════════ Tab 5: Analytics ══════════ */}
        <TabsContent value="5" className="ecf-tab-content space-y-4">
          <div className="ecf-kpi-grid grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-4">
            {[
              { label: "Orders (YTD)", value: data.orders.length, icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
              { label: "Fulfillment Rate", value: `${Math.round(data.orders.filter(x => ["Dispatched", "Delivered"].includes(x.status)).length / data.orders.length * 100)}%`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
              { label: "Pick Accuracy", value: `${Math.round(data.picks.reduce((s, p) => s + p.accuracy, 0) / data.picks.length)}%`, icon: CheckCircle, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
              { label: "Revenue", value: fmtINR(data.orders.reduce((s, o) => s + o.value, 0)), icon: IndianRupee, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/20" },
            ].map((k, i) => (
              <Card key={i} className={`ecf-kpi-card group hover:shadow-md transition-all duration-300 ${k.bg}`}>
                <CardContent className="glass-subtle flex items-center gap-3 p-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ${k.color}`}><k.icon className="h-5 w-5" /></div>
                  <div className="min-w-0"><p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 truncate">{k.label}</p><p className={`text-lg font-bold ${k.color}`}>{k.value}</p></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="ecf-chart-grid grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="ecf-chart-card hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Monthly Orders Trend</CardTitle></CardHeader>
              <CardContent><LineChart data={Array.from({ length: 12 }, (_, i) => ({ month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i], Orders: ri(200, 800, i + 200), Dispatched: ri(150, 700, i + 300) }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Line type="monotone" dataKey="Orders" stroke="#3b82f6" strokeWidth={2} /><Line type="monotone" dataKey="Dispatched" stroke="#059669" strokeWidth={2} /></LineChart></CardContent>
            </Card>
            <Card className="ecf-chart-card hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Order Type Mix</CardTitle></CardHeader>
              <CardContent><PieChart><Pie data={ORDER_TYPES.map((t, i) => ({ name: t, value: ri(5, 40, i + 400) }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{ORDER_TYPES.map((_, i) => <Cell key={i} fill={COLORS[i % 8]} />)}</Pie><Tooltip /></PieChart></CardContent>
            </Card>
            <Card className="ecf-chart-card hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Top SKUs by Volume</CardTitle></CardHeader>
              <CardContent><BarChart data={Array.from({ length: 8 }, (_, i) => ({ sku: `SKU-${ri(10000, 99999, i + 500)}`, Volume: ri(20, 150, i + 600) }))} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" tick={{ fontSize: 10 }} /><YAxis dataKey="sku" type="category" tick={{ fontSize: 9 }} width={70} /><Tooltip /><Bar dataKey="Volume" fill="#7c3aed" radius={[0, 4, 4, 0]} /></BarChart></CardContent>
            </Card>
            <Card className="ecf-chart-card hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Revenue by Channel (6 months)</CardTitle></CardHeader>
              <CardContent><AreaChart data={Array.from({ length: 6 }, (_, i) => ({ month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i], Amazon: ri(10, 50, i + 700), Flipkart: ri(8, 40, i + 750), Myntra: ri(5, 25, i + 800), Others: ri(10, 35, i + 850) }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} unit="L" /><Tooltip /><Area type="monotone" dataKey="Amazon" stackId="a" fill="#f97316" /><Area type="monotone" dataKey="Flipkart" stackId="a" fill="#3b82f6" /><Area type="monotone" dataKey="Myntra" stackId="a" fill="#ec4899" /><Area type="monotone" dataKey="Others" stackId="a" fill="#6b7280" /></AreaChart></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ══════════ Sheet ══════════ */}
      <Sheet open={!!(sheetOpen && selectedOrder)} onOpenChange={o => { setSheetOpen(o); if (!o) setSelectedOrder(null) }}>
        <SheetContent className="ecf-sheet w-full sm:w-[540px]">
          {selectedOrder && (
            <>
              <div className="ecf-sheet-header bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 p-6 mx-6 mt-6 rounded-xl text-white">
                <SheetHeader><SheetTitle className="text-white">Order Detail</SheetTitle></SheetHeader>
                <p className="text-sm opacity-80 mt-1">{selectedOrder.id} | {selectedOrder.marketplace}</p>
              </div>
              <ScrollArea className="mt-4 px-6">
                <div className="space-y-3 pb-6">
                  <div className="ecf-detail-grid grid grid-cols-2 gap-3">
                    <div className="ecf-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">Status</p><OrderStatusBadge status={selectedOrder.status} /></div>
                    <div className="ecf-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">Type</p><OrderTypeBadge type={selectedOrder.type} /></div>
                    <div className="ecf-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">Value</p><OrderValueTile amount={selectedOrder.value} /></div>
                    <div className="ecf-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">Customer</p><p className="text-[11px] font-semibold">{selectedOrder.customer}</p></div>
                    <div className="ecf-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">Items</p><LineItemsTile count={selectedOrder.items} /></div>
                    <div className="ecf-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">Weight</p><WeightTile kg={selectedOrder.weight} /></div>
                    <div className="ecf-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">City</p><p className="text-[11px] font-medium">{selectedOrder.city}</p></div>
                    <div className="ecf-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">SLA</p><SLABadge sla={selectedOrder.slaHrs} /></div>
                    <div className="ecf-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">Order ID</p><p className="text-[11px] font-mono font-semibold">{selectedOrder.orderId}</p></div>
                    <div className="ecf-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">Warehouse</p><WarehouseBadge name={selectedOrder.warehouse} /></div>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
