"use client"

import { useState, useMemo } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { useToast } from "@/hooks/use-toast-helper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Search, Eye, Package, Truck, Users, Star, TrendingUp, Clock, Phone, MapPin, IndianRupee, BarChart3, Activity, ChevronDown, ChevronUp, CheckCircle2, XCircle, MessageSquare, Route, Zap, Shield, Heart, Award, Timer } from "lucide-react"

// ═══════════════════════════════════════════════════════════════════════════════
// ENUMS
// ═══════════════════════════════════════════════════════════════════════════════
const DELIVERY_STATUSES = ["Picked Up", "In Transit", "Out for Delivery", "Near Location", "Delivered", "Failed", "Rescheduled", "Returned"] as const
const DELIVERY_TYPES = ["Same-Day", "Next-Day", "Express 2hr", "Standard", "Scheduled", "Cash on Delivery", "Pickup Point", "White-Glove"] as const
const CUSTOMER_TIERS = ["Platinum", "Gold", "Silver", "Bronze", "New", "Inactive"] as const
const RIDER_STATUSES = ["Available", "On Delivery", "Break", "Offline", "Training", "Suspended"] as const
const RIDER_VEHICLES = ["Bicycle", "Motorcycle", "E-Scooter", "Van", "Electric Van", "Auto Rickshaw"] as const
const FEEDBACK_CATEGORIES = ["Delivery Speed", "Package Condition", "Rider Behavior", "Communication", "Overall Experience"] as const
const INDIAN_CUSTOMERS = ["Rajesh Kumar", "Priya Sharma", "Arun Patel", "Sneha Reddy", "Vikram Singh", "Ananya Iyer", "Karthik Menon", "Deepa Nair", "Sanjay Gupta", "Meera Joshi", "Rohit Verma", "Pooja Agarwal", "Amit Bose", "Kavitha Krishnan", "Manish Tiwari", "Divya Saxena", "Suresh Pillai", "Lakshmi Rao", "Nikhil Deshmukh", "Ritu Malhotra"] as const
const INDIAN_PINCODES = ["400001", "400051", "110001", "110052", "560001", "560034", "600001", "600028", "500001", "500034", "700001", "700045", "380001", "380015", "302001", "226001", "440001", "462001", "411001", "411028"] as const
const INDIAN_CITIES = ["Mumbai", "Delhi NCR", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Nagpur", "Indore"] as const
const RIDER_NAMES = ["Suresh Yadav", "Ravi Kumar", "Anil Sharma", "Mohan Singh", "Raju Patel", "Sunil Verma", "Dinesh Gupta", "Arun Das", "Bhola Nath", "Gopal Rai", "Kamlesh Meena", "Pappu Yadav", "Manoj Tiwari", "Ashok Prajapati", "Vijay Kumar"] as const

const THEME = { blue: "#3b82f6", emerald: "#059669", orange: "#ea580c", violet: "#7c3aed", rose: "#e11d48", amber: "#d97706" }
const PIE_COLORS = [THEME.blue, THEME.emerald, THEME.orange, THEME.violet, THEME.rose, THEME.amber, "#6366f1", "#0ea5e9"]

// ═══════════════════════════════════════════════════════════════════════════════
// SEEDED RANDOM & UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}
const ri = (min: number, max: number, seed: number): number =>
  Math.floor(seededRandom(seed) * (max - min + 1)) + min

const formatINR = (n: number): string => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`
  return `₹${n.toLocaleString("en-IN")}`
}

// ═══════════════════════════════════════════════════════════════════════════════
// SORT / FILTER (exact pattern required)
// ═══════════════════════════════════════════════════════════════════════════════
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

// Global filter/search state used by filterData
let statusFilter = "all"
let searchQ = ""

// ═══════════════════════════════════════════════════════════════════════════════
// DATA INTERFACES & GENERATION
// ═══════════════════════════════════════════════════════════════════════════════
interface Delivery {
  id: string; customer: string; phone: string; pincode: string; city: string
  type: string; status: string; rider: string; eta: string; value: number; attempts: number
  weight: string; distance: string; address: string
}
interface Customer {
  id: string; name: string; phone: string; email: string; city: string; pincode: string
  tier: string; totalOrders: number; totalSpent: number; avgRating: number; lastOrder: string
  joinedDate: string
}
interface Rider {
  id: string; name: string; phone: string; vehicle: string; status: string; city: string
  completedToday: number; totalDelivered: number; rating: number; earnings: number; acceptanceRate: number
  totalKm: number; joinDate: string
}
interface Feedback {
  id: string; customer: string; rider: string; rating: number; category: string; comment: string
  deliveryId: string; timestamp: string; resolved: string; sentiment: string
}

const generateData = () => {
  const addresses = ["42, MG Road, Andheri West", "15, Park Street, Salt Lake", "78, Brigade Road, Koramangala", "23, T. Nagar, Anna Nagar", "9, Banjara Hills, Road No 12", "56, FC Road, Shivajinagar", "101, Park Circus, Ballygunge", "34, CG Road, Navrangpura", "67, MI Road, C-Scheme", "12, Hazratganj, Lalbagh", "89, Dharampeth, Sitabuldi", "45, Sapna Sangeeta, Vijay Nagar"]
  const deliveries: Delivery[] = Array.from({ length: 75 }, (_, i) => ({
    id: `LMC-D${1001 + i}`, customer: INDIAN_CUSTOMERS[i % 20] as string,
    phone: `+91 ${ri(7000, 9999, i)}${ri(100000, 999999, i + 50)}`,
    pincode: INDIAN_PINCODES[i % 20] as string, city: INDIAN_CITIES[i % 12] as string,
    type: DELIVERY_TYPES[i % 8] as string, status: DELIVERY_STATUSES[i % 8] as string,
    rider: RIDER_NAMES[i % 15] as string, eta: `${ri(10, 120, i)} min`,
    value: ri(150, 15000, i + 100), attempts: i < 55 ? 1 : ri(2, 4, i),
    weight: `${(ri(1, 50, i + 200) / 10).toFixed(1)} kg`,
    distance: `${(ri(2, 45, i + 300) / 10).toFixed(1)} km`,
    address: addresses[i % addresses.length]
  }))
  const customers: Customer[] = Array.from({ length: 70 }, (_, i) => ({
    id: `LMC-C${2001 + i}`, name: INDIAN_CUSTOMERS[i % 20] as string,
    phone: `+91 ${ri(7000, 9999, i + 200)}${ri(100000, 999999, i + 250)}`,
    email: `${INDIAN_CUSTOMERS[i % 20].toLowerCase().replace(" ", ".")}@gmail.com`,
    city: INDIAN_CITIES[i % 12] as string, pincode: INDIAN_PINCODES[i % 20] as string,
    tier: CUSTOMER_TIERS[i % 6] as string, totalOrders: ri(5, 180, i + 300),
    totalSpent: ri(2000, 250000, i + 400), avgRating: +(ri(30, 50, i + 500) / 10).toFixed(1),
    lastOrder: `2025-01-${String(ri(1, 28, i + 600)).padStart(2, "0")}`,
    joinedDate: `2024-${String(ri(1, 12, i + 700)).padStart(2, "0")}-${String(ri(1, 28, i + 720)).padStart(2, "0")}`
  }))
  const riders: Rider[] = Array.from({ length: 65 }, (_, i) => ({
    id: `LMC-R${3001 + i}`, name: RIDER_NAMES[i % 15] as string,
    phone: `+91 ${ri(8000, 9999, i + 700)}${ri(100000, 999999, i + 750)}`,
    vehicle: RIDER_VEHICLES[i % 6] as string, status: RIDER_STATUSES[i % 6] as string,
    city: INDIAN_CITIES[i % 12] as string, completedToday: ri(2, 25, i + 800),
    totalDelivered: ri(200, 8000, i + 850), rating: +(ri(30, 50, i + 900) / 10).toFixed(1),
    earnings: ri(500, 2500, i + 950), acceptanceRate: ri(70, 100, i + 1000),
    totalKm: ri(1000, 25000, i + 1050),
    joinDate: `2024-${String(ri(1, 12, i + 1100)).padStart(2, "0")}-${String(ri(1, 28, i + 1120)).padStart(2, "0")}`
  }))
  const feedback: Feedback[] = Array.from({ length: 55 }, (_, i) => ({
    id: `LMC-F${4001 + i}`, customer: INDIAN_CUSTOMERS[i % 20] as string,
    rider: RIDER_NAMES[i % 15] as string, rating: (i % 5) + 1,
    category: FEEDBACK_CATEGORIES[i % 5] as string,
    comment: ["Excellent service, package arrived on time and in perfect condition!", "Rider was very polite and helpful during the delivery process.", "Delivery was delayed by 30 minutes beyond the promised time.", "Package condition could be better — slight dent on outer box.", "Good experience overall, will order again from this platform.", "Rider called before arriving which was very thoughtful.", "Needs improvement in communication regarding delays.", "Very satisfied with same-day delivery option. Great work!", "The tracking updates were accurate and helpful throughout.", "Delivery partner went above and beyond to find my address."][i % 10],
    deliveryId: `LMC-D${1001 + (i % 75)}`,
    timestamp: `2025-01-${String(ri(1, 28, i + 1200)).padStart(2, "0")} ${ri(8, 21, i + 1250)}:${String(ri(10, 59, i + 1300)).padStart(2, "0")}`,
    resolved: (["Yes", "No", "Pending"] as const)[i % 3] as string,
    sentiment: (["Positive", "Neutral", "Negative"] as const)[i % 3] as string
  }))
  return { deliveries, customers, riders, feedback }
}

const { deliveries, customers, riders, feedback } = generateData()

// ═══════════════════════════════════════════════════════════════════════════════
// CHART DATA
// ═══════════════════════════════════════════════════════════════════════════════
const dailyVolume = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => ({
  day: d, Delivered: ri(80, 150, i + 2000), Failed: ri(5, 20, i + 2010), "In Transit": ri(20, 60, i + 2020)
}))
const deliveryTypeDist = DELIVERY_TYPES.map((t, i) => ({ name: t, value: ri(20, 120, i + 3000) }))
const cityDeliveries = INDIAN_CITIES.map((c, i) => ({ city: c, deliveries: ri(100, 500, i + 4000) }))
const weeklyTrend = Array.from({ length: 12 }, (_, i) => ({
  week: `W${i + 1}`, Delivered: ri(300, 700, i + 5000), Failed: ri(15, 60, i + 5010)
}))
const cityPerformance = INDIAN_CITIES.map((c, i) => ({ city: c, score: ri(60, 98, i + 6000) }))
const failureReasons = ["Address Issue", "Customer Unavailable", "Wrong Address", "Package Damaged", "Refused by Customer", "Access Denied", "Vehicle Breakdown", "Weather Delay"].map((r, i) => ({
  reason: r, count: ri(8, 45, i + 7000)
}))
const costBreakdown = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, i) => ({
  month: m, Labor: ri(200, 400, i + 8000), Fuel: ri(80, 180, i + 8010), Technology: ri(50, 120, i + 8020), Misc: ri(20, 60, i + 8030)
}))

// ═══════════════════════════════════════════════════════════════════════════════
// UNIQUE VISUAL COMPONENTS (16+)
// ═══════════════════════════════════════════════════════════════════════════════
const DeliveryStatusBadge = ({ status }: { status: string }) => {
  const pulse = ["In Transit", "Out for Delivery", "Near Location"].includes(status)
  const isFailed = status === "Failed"
  const colors: Record<string, string> = {
    "Picked Up": "bg-blue-100 text-blue-800", "In Transit": "bg-violet-100 text-violet-800",
    "Out for Delivery": "bg-amber-100 text-amber-800", "Near Location": "bg-orange-100 text-orange-800",
    Delivered: "bg-emerald-100 text-emerald-800", Failed: "bg-rose-100 text-rose-800",
    Rescheduled: "bg-indigo-100 text-indigo-800", Returned: "bg-gray-100 text-gray-800"
  }
  return (
    <span className={`lmc-ds-badge inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${colors[status] ?? "bg-gray-100 text-gray-800"} ${pulse ? "animate-pulse" : ""} ${isFailed ? "ring-2 ring-rose-300 animate-pulse" : ""}`}>
      {isFailed ? <XCircle className="h-3 w-3" /> : status === "Delivered" ? <CheckCircle2 className="h-3 w-3" /> : null}
      {status}
    </span>
  )
}

const DeliveryTypeBadge = ({ type }: { type: string }) => {
  const colors: Record<string, string> = {
    "Same-Day": "bg-blue-100 text-blue-800", "Next-Day": "bg-emerald-100 text-emerald-800",
    "Express 2hr": "bg-orange-100 text-orange-800", Standard: "bg-gray-100 text-gray-700",
    Scheduled: "bg-violet-100 text-violet-800", "Cash on Delivery": "bg-amber-100 text-amber-800",
    "Pickup Point": "bg-teal-100 text-teal-800", "White-Glove": "bg-rose-100 text-rose-800"
  }
  return <span className={`lmc-dt-badge rounded-md px-2 py-0.5 text-xs font-medium ${colors[type] ?? "bg-gray-100"}`}>{type}</span>
}

const CustomerTierBadge = ({ tier }: { tier: string }) => {
  const styles: Record<string, string> = {
    Platinum: "bg-gradient-to-r from-amber-300 to-yellow-200 text-amber-900 shadow-[0_0_8px_rgba(217,119,6,0.5)]",
    Gold: "bg-gradient-to-r from-yellow-200 to-amber-100 text-amber-800",
    Silver: "bg-gradient-to-r from-gray-200 to-slate-100 text-gray-700",
    Bronze: "bg-gradient-to-r from-orange-200 to-amber-100 text-orange-800 opacity-75",
    New: "bg-sky-100 text-sky-800", Inactive: "bg-gray-100 text-gray-500"
  }
  const icons: Record<string, React.ReactNode> = {
    Platinum: <Award className="h-3 w-3" />, Gold: <Star className="h-3 w-3" />, Silver: <Shield className="h-3 w-3" />, Bronze: <Heart className="h-3 w-3" />
  }
  return (
    <span className={`lmc-ct-badge inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${styles[tier] ?? "bg-gray-100"}`}>
      {icons[tier]} {tier}
    </span>
  )
}

const VehicleBadge = ({ vehicle }: { vehicle: string }) => {
  const emojis: Record<string, string> = { Bicycle: "🚲", Motorcycle: "🏍️", "E-Scooter": "🛵", Van: "🚐", "Electric Van": "⚡", "Auto Rickshaw": "🛺" }
  return <span className="lmc-vb-badge inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium">{emojis[vehicle] ?? "📦"} {vehicle}</span>
}

const RiderStatusBadge = ({ status }: { status: string }) => {
  const pulse = status === "On Delivery"
  const colors: Record<string, string> = {
    Available: "bg-emerald-100 text-emerald-800", "On Delivery": "bg-blue-100 text-blue-800",
    Break: "bg-amber-100 text-amber-800", Offline: "bg-gray-200 text-gray-600",
    Training: "bg-violet-100 text-violet-800", Suspended: "bg-rose-100 text-rose-800"
  }
  return <span className={`lmc-rs-badge inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${colors[status] ?? "bg-gray-100"} ${pulse ? "animate-pulse" : ""}`}>{status}</span>
}

const RatingBar = ({ rating }: { rating: number }) => (
  <span className="lmc-rb inline-flex items-center gap-0.5">
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-3.5 w-3.5 ${i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
    ))}
  </span>
)

const AcceptanceRateBar = ({ rate }: { rate: number }) => (
  <div className="flex items-center gap-2">
    <div className="lmc-arb h-2 w-20 overflow-hidden rounded-full bg-gray-200">
      <div className={`h-full transition-all ${rate >= 90 ? "bg-emerald-500" : rate >= 75 ? "bg-amber-400" : "bg-rose-500"}`} style={{ width: `${rate}%` }} />
    </div>
    <span className="text-xs font-medium">{rate}%</span>
  </div>
)

const CategoryBadge = ({ category }: { category: string }) => {
  const c = category === "Delivery Speed" ? "bg-blue-100 text-blue-800" : category === "Package Condition" ? "bg-emerald-100 text-emerald-800" : category === "Rider Behavior" ? "bg-violet-100 text-violet-800" : category === "Communication" ? "bg-amber-100 text-amber-800" : "bg-orange-100 text-orange-800"
  return <span className={`lmc-cat-badge rounded-md px-2 py-0.5 text-xs font-medium ${c}`}>{category}</span>
}

const SentimentBadge = ({ sentiment }: { sentiment: string }) => {
  const c = sentiment === "Positive" ? "bg-emerald-100 text-emerald-800" : sentiment === "Negative" ? "bg-rose-100 text-rose-800" : "bg-gray-100 text-gray-700"
  const icon = sentiment === "Positive" ? <TrendingUp className="h-3 w-3" /> : sentiment === "Negative" ? <XCircle className="h-3 w-3" /> : <Activity className="h-3 w-3" />
  return <span className={`lmc-sent-badge inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${c}`}>{icon} {sentiment}</span>
}

const ResolvedBadge = ({ resolved }: { resolved: string }) => {
  const c = resolved === "Yes" ? "bg-emerald-100 text-emerald-800" : resolved === "No" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"
  return <span className={`lmc-res-badge rounded-md px-2 py-0.5 text-xs font-medium ${c}`}>{resolved}</span>
}

const ETATile = ({ eta }: { eta: string }) => {
  const mins = parseInt(eta)
  const c = mins <= 30 ? "bg-emerald-100 text-emerald-800" : mins <= 60 ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
  return <span className={`lmc-eta inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${c}`}><Timer className="h-3 w-3" />{eta}</span>
}

const AttemptsBadge = ({ attempts }: { attempts: number }) => {
  const c = attempts === 1 ? "bg-emerald-100 text-emerald-800" : attempts === 2 ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
  return <span className={`lmc-attempt rounded-md px-2 py-0.5 text-xs font-medium ${c}`}>Attempt {attempts}</span>
}

const ValueTile = ({ value }: { value: number }) => <span className="lmc-vt inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-800"><IndianRupee className="h-3 w-3" />{formatINR(value)}</span>
const EarningsTile = ({ earnings }: { earnings: number }) => <span className="lmc-et inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800"><IndianRupee className="h-3 w-3" />{formatINR(earnings)}</span>
const SpendingTile = ({ spent }: { spent: number }) => <span className="lmc-st inline-flex items-center gap-1 rounded-md bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-800"><IndianRupee className="h-3 w-3" />{formatINR(spent)}</span>
const PhoneTile = ({ phone }: { phone: string }) => <span className="lmc-ph inline-flex items-center gap-1 text-xs text-muted-foreground"><Phone className="h-3 w-3" />{phone}</span>

// ═══════════════════════════════════════════════════════════════════════════════
// KPI CARD
// ═══════════════════════════════════════════════════════════════════════════════
const KPI = ({ label, value, icon: Icon, color, change }: { label: string; value: string; icon: React.ElementType; color: string; change?: string }) => (
  <Card className="hover-lift-sm lmc-kpi p-4 transition-shadow hover:shadow-md">
    <CardContent className="inner-glow glass-subtle flex items-center gap-3 p-0">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${color}`}><Icon className="h-5 w-5 text-white" /></div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-bold leading-tight">{value}</p>
        {change && <p className={`text-xs ${change.startsWith("+") ? "text-emerald-600" : "text-rose-600"}`}>{change}</p>}
      </div>
    </CardContent>
  </Card>
)

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function LastMileCustomerPortalView() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("0")
  const [sortField, setSortField] = useState("")
  const [sortDir, setSortDir] = useState("asc")
  const [dStatusFilter, setDStatusFilter] = useState("all")
  const [dSearchQ, setDSearchQ] = useState("")
  const [cTierFilter, setCTierFilter] = useState("all")
  const [cSearchQ, setCSearchQ] = useState("")
  const [rStatusFilter, setRStatusFilter] = useState("all")
  const [rSearchQ, setRSearchQ] = useState("")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null)
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc")
    else { setSortField(field); setSortDir("asc") }
  }

  const SortIcon = ({ col }: { col: string }) => {
    if (sortField !== col) return <ChevronDown className="ml-1 h-3 w-3 opacity-40" />
    return sortDir === "asc" ? <ChevronUp className="ml-1 h-3 w-3 text-blue-500" /> : <ChevronDown className="ml-1 h-3 w-3 text-blue-500" />
  }

  const SortHeader = ({ label, field }: { label: string; field: string }) => (
    <button onClick={() => handleSort(field)} className="lmc-sort-hdr flex items-center gap-0.5 text-left text-xs font-medium text-muted-foreground hover:text-foreground">
      {label}<SortIcon col={field} />
    </button>
  )

  // Filtered data with proper sort/filter pattern
  const filteredDeliveries = useMemo(() => {
    statusFilter = dStatusFilter; searchQ = dSearchQ
    return sortedData(filterData(deliveries, "status", ["id", "customer", "city", "type", "rider"]), sortField, sortDir)
  }, [dStatusFilter, dSearchQ, sortField, sortDir])

  const filteredCustomers = useMemo(() => {
    statusFilter = cTierFilter; searchQ = cSearchQ
    return sortedData(filterData(customers, "tier", ["id", "name", "city", "email"]), sortField, sortDir)
  }, [cTierFilter, cSearchQ, sortField, sortDir])

  const filteredRiders = useMemo(() => {
    statusFilter = rStatusFilter; searchQ = rSearchQ
    return sortedData(filterData(riders, "status", ["id", "name", "city", "vehicle"]), sortField, sortDir)
  }, [rStatusFilter, rSearchQ, sortField, sortDir])

  // ── Tab 0: Customer Dashboard ────────────────────────────────────────────
  const DashboardTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPI label="Total Deliveries Today" value="1,247" icon={Package} color="bg-blue-500" change="+12.3%" />
        <KPI label="On-Time Rate" value="94.2%" icon={Clock} color="bg-emerald-500" change="+2.1%" />
        <KPI label="Avg Delivery Time" value="38 min" icon={TrendingUp} color="bg-orange-500" change="-5 min" />
        <KPI label="Active Customers" value="3,842" icon={Users} color="bg-violet-500" change="+156" />
        <KPI label="Failed Deliveries" value="23" icon={Activity} color="bg-rose-500" change="-8" />
        <KPI label="Customer Satisfaction" value="4.6/5" icon={Star} color="bg-amber-500" change="+0.2" />
        <KPI label="Revenue Today" value="₹4.82 L" icon={IndianRupee} color="bg-emerald-600" change="+18.5%" />
        <KPI label="Avg Order Value" value="₹1,250" icon={BarChart3} color="bg-violet-600" change="+₹85" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="hover-lift-sm col-span-1 lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Daily Delivery Volume</CardTitle></CardHeader>
          <CardContent>
            <AreaChart data={dailyVolume}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" fontSize={12} /><YAxis fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="Delivered" stackId="1" fill={THEME.emerald} />
              <Area type="monotone" dataKey="Failed" stackId="1" fill={THEME.rose} />
              <Area type="monotone" dataKey="In Transit" stackId="1" fill={THEME.blue} />
            </AreaChart>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Delivery Type Distribution</CardTitle></CardHeader>
          <CardContent className="inner-glow glass-subtle flex items-center justify-center">
            <PieChart width={280} height={280}>
              <Pie data={deliveryTypeDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={(e) => e.name.length > 8 ? e.name.slice(0, 8) + "…" : e.name} labelLine={false} fontSize={9}>
                {deliveryTypeDist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie><Tooltip />
            </PieChart>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Deliveries by City</CardTitle></CardHeader>
        <CardContent>
          <BarChart data={cityDeliveries}>
            <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="city" fontSize={11} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} />
            <Tooltip /><Bar dataKey="deliveries" fill={THEME.blue} radius={[4, 4, 0, 0]} />
          </BarChart>
        </CardContent>
      </Card>
    </div>
  )

  // ── Tab 1: Delivery Tracking ──────────────────────────────────────────────
  const DeliveryTrackingTab = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="lmc-search-ic absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by ID, customer, city..." value={dSearchQ} onChange={(e) => setDSearchQ(e.target.value)} className="lmc-search pl-9" />
        </div>
        <div className="max-h-9 flex flex-wrap gap-1 overflow-y-auto">
          <Badge variant={dStatusFilter === "all" ? "default" : "outline"} className="badge-interactive cursor-pointer" onClick={() => setDStatusFilter("all")}>All</Badge>
          {DELIVERY_STATUSES.map((s) => <Badge key={s} variant={dStatusFilter === s ? "default" : "outline"} className="badge-interactive cursor-pointer" onClick={() => setDStatusFilter(s)}>{s}</Badge>)}
        </div>
      </div>
      <Card>
        <div className="lmc-dtable max-h-[480px] overflow-x-auto overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10"><tr className="border-b bg-muted/95 backdrop-blur">
              <th className="p-3"><SortHeader label="ID" field="id" /></th><th className="p-3">Customer</th>
              <th className="hidden p-3 md:table-cell">Phone</th><th className="hidden p-3 lg:table-cell">Pin</th>
              <th className="hidden p-3 lg:table-cell">City</th><th className="p-3">Type</th><th className="p-3">Status</th>
              <th className="hidden p-3 md:table-cell">Rider</th><th className="p-3">ETA</th><th className="p-3">Value</th>
              <th className="hidden p-3 md:table-cell">Attempts</th><th className="p-3"></th>
            </tr></thead>
            <tbody>
              {filteredDeliveries.map((d) => (
                <tr key={d.id} className="lmc-drow border-b transition-colors hover:bg-muted/30">
                  <td className="p-3 font-medium text-blue-600">{d.id}</td>
                  <td className="p-3"><div className="font-medium">{d.customer}</div><div className="text-xs text-muted-foreground">{d.address.split(",")[1]}</div></td>
                  <td className="hidden p-3 md:table-cell"><PhoneTile phone={d.phone} /></td>
                  <td className="hidden p-3 lg:table-cell text-xs">{d.pincode}</td>
                  <td className="hidden p-3 lg:table-cell">{d.city}</td>
                  <td className="p-3"><DeliveryTypeBadge type={d.type} /></td>
                  <td className="p-3"><DeliveryStatusBadge status={d.status} /></td>
                  <td className="hidden p-3 md:table-cell text-xs">{d.rider}</td>
                  <td className="p-3"><ETATile eta={d.eta} /></td>
                  <td className="p-3"><ValueTile value={d.value} /></td>
                  <td className="hidden p-3 md:table-cell"><AttemptsBadge attempts={d.attempts} /></td>
                  <td className="p-3">
                    <Button size="icon" variant="ghost" className="press-scale lmc-eye h-7 w-7" onClick={() => { setSelectedDelivery(d); setSheetOpen(true); toast.info("Delivery Details", `Viewing ${d.id}`) }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )

  // ── Tab 2: Customer Management ─────────────────────────────────────────────
  const CustomerManagementTab = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="lmc-search-ic absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search customers..." value={cSearchQ} onChange={(e) => setCSearchQ(e.target.value)} className="lmc-search pl-9" />
        </div>
        <div className="max-h-9 flex flex-wrap gap-1 overflow-y-auto">
          {(["all", ...CUSTOMER_TIERS] as const).map((t) => <Badge key={t} variant={cTierFilter === t ? "default" : "outline"} className="badge-interactive cursor-pointer" onClick={() => setCTierFilter(t)}>{t === "all" ? "All" : t}</Badge>)}
        </div>
      </div>
      <Card>
        <div className="lmc-ctable max-h-[480px] overflow-x-auto overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10"><tr className="border-b bg-muted/95 backdrop-blur">
              <th className="p-3"><SortHeader label="ID" field="id" /></th><th className="p-3">Name</th>
              <th className="hidden p-3 md:table-cell">Phone</th><th className="hidden p-3 lg:table-cell">Email</th>
              <th className="p-3">Tier</th><th className="hidden p-3 md:table-cell">Orders</th>
              <th className="p-3">Spent</th><th className="hidden p-3 md:table-cell">Rating</th>
              <th className="hidden p-3 lg:table-cell">Last Order</th><th className="p-3"></th>
            </tr></thead>
            <tbody>
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="lmc-crow border-b transition-colors hover:bg-muted/30">
                  <td className="p-3 font-medium text-blue-600">{c.id}</td>
                  <td className="p-3">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.city}</div>
                  </td>
                  <td className="hidden p-3 md:table-cell"><PhoneTile phone={c.phone} /></td>
                  <td className="hidden max-w-[160px] truncate p-3 lg:table-cell text-xs">{c.email}</td>
                  <td className="p-3"><CustomerTierBadge tier={c.tier} /></td>
                  <td className="hidden p-3 md:table-cell font-medium">{c.totalOrders}</td>
                  <td className="p-3"><SpendingTile spent={c.totalSpent} /></td>
                  <td className="hidden p-3 md:table-cell"><RatingBar rating={Math.round(c.avgRating)} /></td>
                  <td className="hidden p-3 lg:table-cell text-xs">{c.lastOrder}</td>
                  <td className="p-3">
                    <Button size="icon" variant="ghost" className="press-scale lmc-eye h-7 w-7" onClick={() => { setSelectedCustomer(c); setSheetOpen(true); toast.info("Customer Profile", `Viewing ${c.name}`) }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )

  // ── Tab 3: Rider Fleet ────────────────────────────────────────────────────
  const RiderFleetTab = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="lmc-search-ic absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search riders..." value={rSearchQ} onChange={(e) => setRSearchQ(e.target.value)} className="lmc-search pl-9" />
        </div>
        <div className="max-h-9 flex flex-wrap gap-1 overflow-y-auto">
          {(["all", ...RIDER_STATUSES] as const).map((s) => <Badge key={s} variant={rStatusFilter === s ? "default" : "outline"} className="badge-interactive cursor-pointer" onClick={() => setRStatusFilter(s)}>{s === "all" ? "All" : s}</Badge>)}
        </div>
      </div>
      <Card>
        <div className="lmc-rtable max-h-[480px] overflow-x-auto overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10"><tr className="border-b bg-muted/95 backdrop-blur">
              <th className="p-3"><SortHeader label="ID" field="id" /></th><th className="p-3">Name</th>
              <th className="hidden p-3 md:table-cell">Phone</th><th className="p-3">Vehicle</th>
              <th className="p-3">Status</th><th className="hidden p-3 lg:table-cell">City</th>
              <th className="hidden p-3 md:table-cell">Today</th><th className="hidden p-3 lg:table-cell">Total</th>
              <th className="p-3">Rating</th><th className="hidden p-3 md:table-cell">Earnings</th>
              <th className="hidden p-3 md:table-cell">Accept</th><th className="p-3"></th>
            </tr></thead>
            <tbody>
              {filteredRiders.map((r) => (
                <tr key={r.id} className="lmc-rrow border-b transition-colors hover:bg-muted/30">
                  <td className="p-3 font-medium text-blue-600">{r.id}</td>
                  <td className="p-3"><div className="font-medium">{r.name}</div><div className="text-xs text-muted-foreground">{r.city}</div></td>
                  <td className="hidden p-3 md:table-cell"><PhoneTile phone={r.phone} /></td>
                  <td className="p-3"><VehicleBadge vehicle={r.vehicle} /></td>
                  <td className="p-3"><RiderStatusBadge status={r.status} /></td>
                  <td className="hidden p-3 lg:table-cell text-xs">{r.city}</td>
                  <td className="hidden p-3 md:table-cell font-medium">{r.completedToday}</td>
                  <td className="hidden p-3 lg:table-cell text-xs">{r.totalDelivered.toLocaleString()}</td>
                  <td className="p-3"><RatingBar rating={Math.round(r.rating)} /></td>
                  <td className="hidden p-3 md:table-cell"><EarningsTile earnings={r.earnings} /></td>
                  <td className="hidden p-3 md:table-cell"><AcceptanceRateBar rate={r.acceptanceRate} /></td>
                  <td className="p-3">
                    <Button size="icon" variant="ghost" className="press-scale lmc-eye h-7 w-7" onClick={() => { setSelectedRider(r); setSheetOpen(true); toast.info("Rider Profile", `Viewing ${r.name}`) }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )

  // ── Tab 4: Feedback & Ratings ────────────────────────────────────────────
  const FeedbackTab = () => (
    <div className="space-y-4">
      <Card>
        <div className="lmc-ftable max-h-[520px] overflow-x-auto overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10"><tr className="border-b bg-muted/95 backdrop-blur">
              <th className="p-3">ID</th><th className="p-3">Customer</th><th className="hidden p-3 md:table-cell">Rider</th>
              <th className="p-3">Rating</th><th className="hidden p-3 md:table-cell">Category</th>
              <th className="p-3">Comment</th><th className="hidden p-3 lg:table-cell">Delivery</th>
              <th className="hidden p-3 md:table-cell">Resolved</th><th className="hidden p-3 lg:table-cell">Sentiment</th>
              <th className="p-3"></th>
            </tr></thead>
            <tbody>
              {feedback.map((f) => (
                <tr key={f.id} className="lmc-frow border-b transition-colors hover:bg-muted/30">
                  <td className="p-3 font-medium text-blue-600">{f.id}</td>
                  <td className="p-3 font-medium">{f.customer}</td>
                  <td className="hidden p-3 md:table-cell text-xs">{f.rider}</td>
                  <td className="p-3"><RatingBar rating={f.rating} /></td>
                  <td className="hidden p-3 md:table-cell"><CategoryBadge category={f.category} /></td>
                  <td className="max-w-[200px] truncate p-3 text-xs text-muted-foreground">{f.comment}</td>
                  <td className="hidden p-3 lg:table-cell text-xs">{f.deliveryId}</td>
                  <td className="hidden p-3 md:table-cell"><ResolvedBadge resolved={f.resolved} /></td>
                  <td className="hidden p-3 lg:table-cell"><SentimentBadge sentiment={f.sentiment} /></td>
                  <td className="p-3">
                    <Button size="icon" variant="ghost" className="press-scale lmc-eye h-7 w-7" onClick={() => { setSelectedFeedback(f); setSheetOpen(true); toast.info("Feedback", `Viewing ${f.id}`) }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )

  // ── Tab 5: Last-Mile Analytics ────────────────────────────────────────────
  const AnalyticsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPI label="Delivery Speed Index" value="87.3" icon={Zap} color="bg-blue-500" change="+3.2" />
        <KPI label="First Attempt Rate" value="91.6%" icon={Package} color="bg-emerald-500" change="+1.8%" />
        <KPI label="Customer Retention" value="78.4%" icon={Users} color="bg-orange-500" change="+4.2%" />
        <KPI label="Rider Utilization" value="82.1%" icon={Truck} color="bg-violet-500" change="-1.3%" />
        <KPI label="Route Efficiency" value="88.7%" icon={Route} color="bg-emerald-600" change="+2.5%" />
        <KPI label="Cost per Delivery" value="₹42" icon={IndianRupee} color="bg-amber-500" change="-₹3" />
        <KPI label="NPS Score" value="72" icon={Star} color="bg-rose-500" change="+5" />
        <KPI label="Growth Rate" value="+14.2%" icon={Activity} color="bg-violet-600" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Weekly Delivery Trend</CardTitle></CardHeader>
          <CardContent>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="week" fontSize={12} /><YAxis fontSize={12} />
              <Tooltip /><Line type="monotone" dataKey="Delivered" stroke={THEME.blue} strokeWidth={2} />
              <Line type="monotone" dataKey="Failed" stroke={THEME.rose} strokeWidth={2} />
            </LineChart>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">City-wise Performance</CardTitle></CardHeader>
          <CardContent>
            <BarChart data={cityPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" /><XAxis type="number" fontSize={12} />
              <YAxis type="category" dataKey="city" fontSize={11} width={70} /><Tooltip />
              <Bar dataKey="score" fill={THEME.emerald} radius={[0, 4, 4, 0]} />
            </BarChart>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Failure Reasons</CardTitle></CardHeader>
          <CardContent>
            <BarChart data={failureReasons} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" /><XAxis type="number" fontSize={12} />
              <YAxis type="category" dataKey="reason" fontSize={10} width={110} /><Tooltip />
              <Bar dataKey="count" fill={THEME.rose} radius={[0, 4, 4, 0]} />
            </BarChart>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Cost Breakdown (6 months)</CardTitle></CardHeader>
          <CardContent>
            <AreaChart data={costBreakdown}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="Labor" stackId="a" fill={THEME.blue} />
              <Area type="monotone" dataKey="Fuel" stackId="a" fill={THEME.orange} />
              <Area type="monotone" dataKey="Technology" stackId="a" fill={THEME.violet} />
              <Area type="monotone" dataKey="Misc" stackId="a" fill={THEME.amber} />
            </AreaChart>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // ── Sheet Content ─────────────────────────────────────────────────────────
  const SheetContentInner = () => {
    if (selectedDelivery) {
      const statusIdx = DELIVERY_STATUSES.indexOf(selectedDelivery.status as typeof DELIVERY_STATUSES[number])
      return (
        <div className="space-y-5">
          <div className="rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 p-6 text-white">
            <h3 className="text-xl font-bold">{selectedDelivery.id}</h3>
            <p className="text-sm opacity-90">{selectedDelivery.customer} · {selectedDelivery.city}</p>
            <p className="mt-1 text-xs opacity-75">{selectedDelivery.address}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <DeliveryStatusBadge status={selectedDelivery.status} /><DeliveryTypeBadge type={selectedDelivery.type} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 rounded-lg border p-3"><Truck className="h-4 w-4 shrink-0 text-blue-500" /><div><p className="text-xs text-muted-foreground">Rider</p><p className="text-sm font-medium">{selectedDelivery.rider}</p></div></div>
            <div className="flex items-center gap-3 rounded-lg border p-3"><Timer className="h-4 w-4 shrink-0 text-emerald-500" /><div><p className="text-xs text-muted-foreground">ETA</p><p className="text-sm font-medium">{selectedDelivery.eta}</p></div></div>
            <div className="flex items-center gap-3 rounded-lg border p-3"><IndianRupee className="h-4 w-4 shrink-0 text-violet-500" /><div><p className="text-xs text-muted-foreground">Value</p><p className="text-sm font-medium">{formatINR(selectedDelivery.value)}</p></div></div>
            <div className="flex items-center gap-3 rounded-lg border p-3"><MapPin className="h-4 w-4 shrink-0 text-orange-500" /><div><p className="text-xs text-muted-foreground">Distance</p><p className="text-sm font-medium">{selectedDelivery.distance}</p></div></div>
          </div>
          <div><p className="mb-3 text-sm font-semibold">Tracking Milestones</p>
            <div className="space-y-2">
              {DELIVERY_STATUSES.map((s, i) => (
                <div key={s} className={`flex items-center gap-3 rounded-md px-3 py-2 ${i <= statusIdx ? "bg-emerald-50 text-emerald-900" : "bg-gray-50 text-gray-400"}`}>
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full ${i <= statusIdx ? "bg-emerald-500 text-white" : "bg-gray-300 text-gray-500"}`}>
                    {i < statusIdx ? <CheckCircle2 className="h-3.5 w-3.5" /> : i === statusIdx ? <Activity className="h-3.5 w-3.5" /> : <span className="text-xs">{i + 1}</span>}
                  </div>
                  <span className="text-sm font-medium">{s}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border p-3"><PhoneTile phone={selectedDelivery.phone} /><p className="mt-1 text-xs text-muted-foreground">Pincode: {selectedDelivery.pincode}</p><p className="text-xs text-muted-foreground">Weight: {selectedDelivery.weight} · Attempts: {selectedDelivery.attempts}</p></div>
        </div>
      )
    }
    if (selectedCustomer) {
      const spendingData = Array.from({ length: 6 }, (_, i) => ({ month: `M${i + 1}`, amount: ri(2000, 40000, i + 9000) }))
      return (
        <div className="space-y-5">
          <div className="rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 p-6 text-white">
            <h3 className="text-xl font-bold">{selectedCustomer.name}</h3>
            <p className="text-sm opacity-90">{selectedCustomer.city} · {selectedCustomer.pincode}</p>
            <div className="mt-3"><CustomerTierBadge tier={selectedCustomer.tier} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Total Orders</p><p className="text-xl font-bold text-blue-600">{selectedCustomer.totalOrders}</p></div>
            <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Total Spent</p><p className="text-xl font-bold text-violet-600">{formatINR(selectedCustomer.totalSpent)}</p></div>
            <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground mb-1">Avg Rating</p><RatingBar rating={Math.round(selectedCustomer.avgRating)} /><span className="ml-2 text-sm font-medium">{selectedCustomer.avgRating}</span></div>
            <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Last Order</p><p className="text-sm font-medium">{selectedCustomer.lastOrder}</p></div>
          </div>
          <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground mb-1">Contact</p><PhoneTile phone={selectedCustomer.phone} /><p className="mt-1 text-xs">{selectedCustomer.email}</p></div>
          <Card className="hover-lift-sm p-4"><CardHeader className="p-0 pb-2"><CardTitle className="text-xs">Monthly Spending</CardTitle></CardHeader>
            <AreaChart data={spendingData} height={120}>
              <XAxis dataKey="month" fontSize={10} /><YAxis fontSize={10} hide /><Tooltip />
              <Area type="monotone" dataKey="amount" fill={THEME.violet} stroke={THEME.violet} />
            </AreaChart>
          </Card>
          <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Member Since</p><p className="text-sm font-medium">{selectedCustomer.joinedDate}</p></div>
        </div>
      )
    }
    if (selectedRider) {
      const perfData = Array.from({ length: 7 }, (_, i) => ({ day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i], deliveries: ri(8, 28, i + 9200) }))
      return (
        <div className="space-y-5">
          <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white">
            <h3 className="text-xl font-bold">{selectedRider.name}</h3>
            <p className="text-sm opacity-90">{selectedRider.city} · Joined {selectedRider.joinDate}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2"><RiderStatusBadge status={selectedRider.status} /><VehicleBadge vehicle={selectedRider.vehicle} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Today</p><p className="text-xl font-bold text-emerald-600">{selectedRider.completedToday}</p></div>
            <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Total Delivered</p><p className="text-xl font-bold text-blue-600">{selectedRider.totalDelivered.toLocaleString()}</p></div>
            <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground mb-1">Rating</p><RatingBar rating={Math.round(selectedRider.rating)} /><span className="ml-2 text-sm font-medium">{selectedRider.rating}</span></div>
            <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Earnings</p><p className="text-xl font-bold text-violet-600">{formatINR(selectedRider.earnings)}</p></div>
          </div>
          <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground mb-2">Acceptance Rate</p><AcceptanceRateBar rate={selectedRider.acceptanceRate} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Total KM</p><p className="text-sm font-medium">{selectedRider.totalKm.toLocaleString()} km</p></div>
            <div className="rounded-lg border p-3"><PhoneTile phone={selectedRider.phone} /></div>
          </div>
          <Card className="hover-lift-sm p-4"><CardHeader className="p-0 pb-2"><CardTitle className="text-xs">Weekly Performance</CardTitle></CardHeader>
            <BarChart data={perfData} height={120}>
              <XAxis dataKey="day" fontSize={10} /><YAxis fontSize={10} hide /><Tooltip />
              <Bar dataKey="deliveries" fill={THEME.emerald} radius={[3, 3, 0, 0]} />
            </BarChart>
          </Card>
        </div>
      )
    }
    if (selectedFeedback) return (
      <div className="space-y-5">
        <div className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
          <h3 className="text-xl font-bold">{selectedFeedback.id}</h3>
          <p className="text-sm opacity-90">{selectedFeedback.customer}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2"><RatingBar rating={selectedFeedback.rating} /><SentimentBadge sentiment={selectedFeedback.sentiment} /></div>
        </div>
        <div className="rounded-lg border bg-muted/30 p-4">
          <MessageSquare className="mb-2 h-4 w-4 text-muted-foreground" />
          <p className="text-sm italic">"{selectedFeedback.comment}"</p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border p-3"><span className="text-xs text-muted-foreground">Category</span><CategoryBadge category={selectedFeedback.category} /></div>
          <div className="flex items-center justify-between rounded-lg border p-3"><span className="text-xs text-muted-foreground">Delivery</span><span className="text-sm font-medium">{selectedFeedback.deliveryId}</span></div>
          <div className="flex items-center justify-between rounded-lg border p-3"><span className="text-xs text-muted-foreground">Rider</span><span className="text-sm font-medium">{selectedFeedback.rider}</span></div>
          <div className="flex items-center justify-between rounded-lg border p-3"><span className="text-xs text-muted-foreground">Status</span><ResolvedBadge resolved={selectedFeedback.resolved} /></div>
          <div className="flex items-center justify-between rounded-lg border p-3"><span className="text-xs text-muted-foreground">Timestamp</span><span className="text-sm">{selectedFeedback.timestamp}</span></div>
        </div>
      </div>
    )
    return null
  }

  return (
    <div className="lmc-root space-y-6">
      <PageHeader title="Last-Mile Customer Portal" description="Track deliveries, manage customers, and monitor rider performance across India" />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="lmc-tabs-list flex-wrap">
          <TabsTrigger value="0" className="lmc-tab"><Package className="mr-1.5 h-4 w-4" />Dashboard</TabsTrigger>
          <TabsTrigger value="1" className="lmc-tab"><Truck className="mr-1.5 h-4 w-4" />Tracking</TabsTrigger>
          <TabsTrigger value="2" className="lmc-tab"><Users className="mr-1.5 h-4 w-4" />Customers</TabsTrigger>
          <TabsTrigger value="3" className="lmc-tab"><Activity className="mr-1.5 h-4 w-4" />Riders</TabsTrigger>
          <TabsTrigger value="4" className="lmc-tab"><Star className="mr-1.5 h-4 w-4" />Feedback</TabsTrigger>
          <TabsTrigger value="5" className="lmc-tab"><BarChart3 className="mr-1.5 h-4 w-4" />Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="0"><DashboardTab /></TabsContent>
        <TabsContent value="1"><DeliveryTrackingTab /></TabsContent>
        <TabsContent value="2"><CustomerManagementTab /></TabsContent>
        <TabsContent value="3"><RiderFleetTab /></TabsContent>
        <TabsContent value="4"><FeedbackTab /></TabsContent>
        <TabsContent value="5"><AnalyticsTab /></TabsContent>
      </Tabs>

      <Sheet open={!!(sheetOpen && (selectedDelivery || selectedCustomer || selectedRider || selectedFeedback))} onOpenChange={(open) => {
        setSheetOpen(open)
        if (!open) { setSelectedDelivery(null); setSelectedCustomer(null); setSelectedRider(null); setSelectedFeedback(null) }
      }}>
        <SheetContent className="lmc-sheet w-full overflow-y-auto sm:max-w-md">
          <SheetHeader><SheetTitle>Details</SheetTitle></SheetHeader>
          <SheetContentInner />
        </SheetContent>
      </Sheet>
    </div>
  )
}
