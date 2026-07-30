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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Store, Package, Clock, MapPin, Star, TrendingUp, Users, IndianRupee, Bike, Search, Eye, type LucideIcon } from "lucide-react"

// ============================================================================
// Helpers
// ============================================================================
function seededRandom(seed: number) {
  let s = seed % 2147483647; if (s <= 0) s += 2147483646; s = (s * 16807) % 2147483647; return (s - 1) / 2147483646
}
const pick = <T,>(arr: readonly T[], seed: number) => arr[Math.floor(seededRandom(seed) * arr.length)]
const ri = (min: number, max: number, seed: number) => Math.floor(seededRandom(seed) * (max - min + 1)) + min
const fmtINR = (n: number) => n >= 10000000 ? `₹${(n / 10000000).toFixed(2)} Cr` : n >= 100000 ? `₹${(n / 100000).toFixed(2)} L` : n >= 1000 ? `₹${(n / 1000).toFixed(1)}K` : `₹${n}`

// ============================================================================
// Interfaces
// ============================================================================
interface DarkStore { id: string; storeId: string; name: string; type: string; city: string; status: string; avgDeliveryMin: number; dailyOrders: number; skuCount: number; riderCount: number; tempZone: string }
interface Order { id: string; orderId: string; customer: string; status: string; channel: string; priority: string; items: number; value: number; partner: string }
interface Partner { id: string; partnerId: string; name: string; vehicle: string; status: string; deliveries: number; rating: number; earnings: number; zone: string; shift: string }
interface Zone { id: string; zoneId: string; name: string; type: string; status: string; density: string; avgFreq: number; competitors: number; darkStores: number; radius: number }

// ============================================================================
// 16 Unique Visual Components
// ============================================================================
const DS_TYPE_EMOJI: Record<string, string> = { "Micro Hub": "🏪", "Quick Commerce": "🛒", "Pharmacy Plus": "💊", "Fresh Daily": "🥬", "Fashion Express": "👗", "Electronics Now": "🔌", "Pet Care": "🐾", "Beauty Hub": "💄" }
function DarkStoreTypeBadge({ type }: { type: string }) { return <span className="inline-flex items-center gap-1 rounded-md bg-cyan-50 px-2 py-0.5 text-[10px] font-medium text-cyan-800 dark:bg-cyan-950/30 dark:text-cyan-300 hyl-ds-type">{DS_TYPE_EMOJI[type]} {type}</span> }

const STORE_STATUS_CFG: Record<string, { c: string; bg: string }> = { Active: { c: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30" }, Launching: { c: "text-blue-700 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30" }, Maintenance: { c: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30" }, Expanding: { c: "text-violet-700 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-950/30" }, Relocating: { c: "text-orange-700 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/30" }, Closed: { c: "text-red-700 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30" } }
function StoreStatusBadge({ status }: { status: string }) {
  const cfg = STORE_STATUS_CFG[status] ?? STORE_STATUS_CFG.Closed
  const pulse = status === "Active" ? "hyl-pulse-green" : ""
  return <span className={cn("inline-flex items-center rounded-md border border-current/20 px-2 py-0.5 text-[10px] font-semibold hyl-store-status", cfg.c, cfg.bg, pulse)}>{status}</span>
}

const CITY_COLORS: Record<string, string> = { "Mumbai": "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300", "Delhi NCR": "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300", "Bengaluru": "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300", "Hyderabad": "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300", "Chennai": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300", "Pune": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300", "Kolkata": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300", "Jaipur": "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300" }
function CityBadge({ city }: { city: string }) { return <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium hyl-city-badge", CITY_COLORS[city] ?? "bg-gray-100 text-gray-700")}>{city}</span> }

const ORDER_STATUS_CFG: Record<string, { c: string; bg: string }> = { Placed: { c: "text-blue-700 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30" }, Picked: { c: "text-indigo-700 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/30" }, Packed: { c: "text-violet-700 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-950/30" }, Dispatched: { c: "text-cyan-700 dark:text-cyan-400", bg: "bg-cyan-50 dark:bg-cyan-950/30" }, "Out for Delivery": { c: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30" }, Delivered: { c: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30" }, Cancelled: { c: "text-red-700 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30" }, Refunded: { c: "text-orange-700 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/30" } }
function OrderStatusBadge({ status }: { status: string }) {
  const cfg = ORDER_STATUS_CFG[status] ?? ORDER_STATUS_CFG.Placed
  const pulse = status === "Dispatched" ? "hyl-pulse-cyan" : ""
  return <span className={cn("inline-flex items-center rounded-md border border-current/20 px-2 py-0.5 text-[10px] font-semibold hyl-order-status", cfg.c, cfg.bg, pulse)}>{status}</span>
}

const CH_COLORS: Record<string, string> = { App: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300", Website: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300", WhatsApp: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300", Phone: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300", "Swiggy Instamart": "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300", Blinkit: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300" }
function ChannelBadge({ channel }: { channel: string }) { return <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium hyl-channel-badge", CH_COLORS[channel] ?? "bg-gray-100 text-gray-700")}>{channel}</span> }

const PRI_COLORS: Record<string, string> = { Express: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300", Standard: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300", Scheduled: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300", Bulk: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" }
function PriorityBadge({ priority }: { priority: string }) {
  const suffix = priority === "Express" ? " 30min" : priority === "Standard" ? " 2hr" : ""
  return <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold hyl-priority-badge", PRI_COLORS[priority] ?? "bg-gray-100 text-gray-700")}>{priority}{suffix}</span>
}

const VEH_EMOJI: Record<string, string> = { "Bicycle": "🚲", "Motorcycle": "🏍️", "E-Scooter": "🔋", "Delivery Van": "🚐", "E-Rickshaw": "🛺", "Walk": "🚶", "Auto Rickshaw": "🛻", "Drone": "✈️" }
function VehicleTypeBadge({ vehicle }: { vehicle: string }) { return <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-800 dark:bg-blue-950/30 dark:text-blue-300 hyl-vehicle-badge">{VEH_EMOJI[vehicle]} {vehicle}</span> }

const PARTNER_STATUS_CFG: Record<string, { c: string; bg: string }> = { Online: { c: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30" }, "On Delivery": { c: "text-cyan-700 dark:text-cyan-400", bg: "bg-cyan-50 dark:bg-cyan-950/30" }, Break: { c: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30" }, Offline: { c: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800/40" }, Training: { c: "text-violet-700 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-950/30" }, Suspended: { c: "text-red-700 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30" } }
function PartnerStatusBadge({ status }: { status: string }) {
  const cfg = PARTNER_STATUS_CFG[status] ?? PARTNER_STATUS_CFG.Offline
  const pulse = status === "Online" ? "hyl-pulse-green" : ""
  return <span className={cn("inline-flex items-center rounded-md border border-current/20 px-2 py-0.5 text-[10px] font-semibold hyl-partner-status", cfg.c, cfg.bg, pulse)}>{status}</span>
}

function StarRating({ rating }: { rating: number }) { return <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold hyl-star-rating text-amber-600"><Star className="h-2.5 w-2.5 fill-current" />{rating.toFixed(1)}</span> }

function EarningsTile({ amount }: { amount: number }) { return <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 hyl-earnings-tile"><IndianRupee className="h-3 w-3" />{fmtINR(amount)}</span> }

const ZT_COLORS: Record<string, string> = { Residential: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300", Commercial: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300", Industrial: "bg-slate-100 text-slate-800 dark:bg-slate-800/40 dark:text-slate-300", "IT Park": "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300", University: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300", "Hospital Zone": "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300", "Mall Area": "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300", "Mixed Use": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300" }
function ZoneTypeBadge({ type }: { type: string }) { return <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium hyl-zone-type", ZT_COLORS[type] ?? "bg-gray-100 text-gray-700")}>{type}</span> }

const COV_COLORS: Record<string, string> = { Covered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300", Partial: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300", Planned: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300", "Under Survey": "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300", "Not Covered": "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300", Priority: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300" }
function CoverageStatusBadge({ status }: { status: string }) { return <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium hyl-cov-status", COV_COLORS[status] ?? "bg-gray-100 text-gray-700")}>{status}</span> }

const DEN_COLORS: Record<string, string> = { High: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300", Medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300", Low: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300" }
function DensityBadge({ density }: { density: string }) { return <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold hyl-density-badge", DEN_COLORS[density] ?? "bg-gray-100 text-gray-700")}>{density}</span> }

function RadiusTile({ km }: { km: number }) { return <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/30 dark:text-blue-300 hyl-radius-tile"><MapPin className="h-3 w-3" />{km} km</span> }

function DeliveryTimeTile({ min }: { min: number }) {
  const c = min <= 15 ? "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30" : min <= 25 ? "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30" : "text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/30"
  return <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold hyl-delivery-tile", c)}><Clock className="h-3 w-3" />{min} min</span>
}

function ValueTile({ amount }: { amount: number }) { return <span className="inline-flex items-center gap-1 rounded-md bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-950/30 dark:text-violet-300 hyl-value-tile"><IndianRupee className="h-3 w-3" />{fmtINR(amount)}</span> }

// ============================================================================
// Data Generation
// ============================================================================
function generateData() {
  const STORE_TYPES = ["Micro Hub", "Quick Commerce", "Pharmacy Plus", "Fresh Daily", "Fashion Express", "Electronics Now", "Pet Care", "Beauty Hub"] as const
  const STORE_STATUSES = ["Active", "Launching", "Maintenance", "Expanding", "Relocating", "Closed"] as const
  const CITIES = ["Mumbai", "Delhi NCR", "Bengaluru", "Hyderabad", "Chennai", "Pune", "Kolkata", "Jaipur"] as const
  const ORDER_STATUSES = ["Placed", "Picked", "Packed", "Dispatched", "Out for Delivery", "Delivered", "Cancelled", "Refunded"] as const
  const CHANNELS = ["App", "Website", "WhatsApp", "Phone", "Swiggy Instamart", "Blinkit"] as const
  const PRIORITIES = ["Express", "Standard", "Scheduled", "Bulk"] as const
  const VEHICLES = ["Bicycle", "Motorcycle", "E-Scooter", "Delivery Van", "E-Rickshaw", "Walk", "Auto Rickshaw", "Drone"] as const
  const PARTNER_STATUSES = ["Online", "On Delivery", "Break", "Offline", "Training", "Suspended"] as const
  const ZONE_TYPES = ["Residential", "Commercial", "Industrial", "IT Park", "University", "Hospital Zone", "Mall Area", "Mixed Use"] as const
  const COVERAGE_STATUSES = ["Covered", "Partial", "Planned", "Under Survey", "Not Covered", "Priority"] as const
  const DENSITIES = ["High", "Medium", "Low"] as const
  const CUSTOMERS = ["Rahul Sharma", "Priya Patel", "Amit Kumar", "Sneha Gupta", "Vikram Singh", "Ananya Reddy", "Rohan Joshi", "Kavitha Nair", "Arjun Mehta", "Deepika Rao", "Sanjay Verma", "Meera Iyer", "Karthik Pillai", "Shreya Das", "Nikhil Bose", "Pooja Sharma", "Ravi Tiwari", "Neha Agarwal", "Aditya Kapoor", "Sunita Mishra", "Manoj Chauhan", "Divya Bhat", "Akash Pandey", "Swati Raman", "Prashant Hegde", "Anita Kulkarni", "Gaurav Desai", "Lakshmi Iyer", "Varun Malhotra", "Ritu Saxena", "Bharath H.", "Chandra M.", "Devraj P.", "Eshwar L.", "Farhan A.", "Giri J.", "Harish O.", "Irfan Q.", "Jagdish C.", "Kamal W.", "Lakshman X.", "Mohan Y.", "Nandu Z.", "Om Prakash", "Tarun Bhat", "Krishna M.", "Bhaskar R.", "Ajay D.", "Vijay C.", "Sunil K.", "Prakash H.", "Rajan P.", "Suresh T.", "Dinesh Y."] as const
  const PARTNER_NAMES = ["Suresh M.", "Ramesh K.", "Dinesh T.", "Mahesh P.", "Ganesh R.", "Raju N.", "Kumar S.", "Venkat B.", "Prasad D.", "Naresh G.", "Arun V.", "Bharath H.", "Chandra M.", "Devraj P.", "Eshwar L.", "Farhan A.", "Giri J.", "Harish O.", "Irfan Q.", "Jagdish C.", "Kamal W.", "Lakshman X.", "Mohan Y.", "Nandu Z.", "Om Prakash", "Ravi K.", "Santosh M.", "Anil D.", "Rajesh G.", "Vijay N.", "Sankar R.", "Balu P.", "Muthu S.", "Selva J.", "Kannan T.", "Mani V.", "Prabhu D.", "Senthil N.", "Murugan R.", "Karthik S.", "Arun K.", "Deepak V.", "Pradeep M.", "Shankar P.", "Ganapathy S.", "Ramesh B.", "Vinoth K.", "Saravanan T.", "Anand R.", "Suresh C.", "Raj Kumar"] as const
  const ZONE_NAMES = ["Koramangala", "Indiranagar", "HSR Layout", "Whitefield", "Electronic City", "Jayanagar", "MG Road", "Marathahalli", "BTM Layout", "Sarjapur Rd", "Gachibowli", "Madhapur", "Kondapur", "Banjara Hills", "Jubilee Hills", "Bandra", "Andheri", "Juhu", "Powai", "Goregaon", "Connaught Place", "Dwarka", "Rohini", "Noida Sec-18", "Gurgaon", "T Nagar", "Anna Nagar", "Velachery", "Adyar", "OMR", "Koregaon Park", "Viman Nagar", "Hinjewadi", "Wakad", "Aundh", "Salt Lake", "New Alipore", "Park Street", "Gariahat", "Behala", "Vaishali Nagar", "Malviya Nagar", "Tonk Road", "Mansarovar", "C-Scheme", "MI Road", "Bapu Nagar", "Sodala", "Jhotwara", "Jagatpura", "Sanganer", "Sitapura", "Pratap Nagar", "Mansarovar Ext", "Sikar Road", "Banaswadi", "Yelahanka", "Hebbal", "Rajajinagar", "JP Nagar"] as const

  // 75 dark stores
  const darkStores: DarkStore[] = Array.from({ length: 75 }, (_, i) => {
    const s = i * 17 + 3
    return { id: `ds-${i}`, storeId: `DS-${String(i + 1).padStart(4, "0")}`, name: `${pick(ZONE_NAMES, s)} ${pick(STORE_TYPES, s + 1) as string}`, type: pick(STORE_TYPES, s + 1) as string, city: pick(CITIES, s + 2) as string, status: pick(STORE_STATUSES, s + 3) as string, avgDeliveryMin: ri(10, 35, s + 4), dailyOrders: ri(80, 600, s + 5), skuCount: ri(500, 5000, s + 6), riderCount: ri(5, 30, s + 7), tempZone: pick(["Ambient", "Cold", "Frozen", "Mixed"], s + 8) as string }
  })

  // 70 orders
  const orders: Order[] = Array.from({ length: 70 }, (_, i) => {
    const s = i * 19 + 7
    return { id: `ord-${i}`, orderId: `HL-${String(i + 1).padStart(5, "0")}`, customer: pick(CUSTOMERS, s) as string, status: pick(ORDER_STATUSES, s + 1) as string, channel: pick(CHANNELS, s + 2) as string, priority: pick(PRIORITIES, s + 3) as string, items: ri(1, 15, s + 4), value: ri(150, 4500, s + 5), partner: pick(PARTNER_NAMES, s + 6) as string }
  })

  // 55 partners
  const partners: Partner[] = Array.from({ length: 55 }, (_, i) => {
    const s = i * 23 + 11
    return { id: `p-${i}`, partnerId: `DP-${String(i + 1).padStart(4, "0")}`, name: PARTNER_NAMES[i % PARTNER_NAMES.length], vehicle: pick(VEHICLES, s) as string, status: pick(PARTNER_STATUSES, s + 1) as string, deliveries: ri(5, 45, s + 2), rating: ri(30, 50, s + 3) / 10, earnings: ri(400, 3500, s + 4), zone: pick(ZONE_NAMES, s + 5) as string, shift: pick(["Morning", "Evening", "Night"], s + 6) as string }
  })

  // 65 zones
  const zones: Zone[] = Array.from({ length: 65 }, (_, i) => {
    const s = i * 29 + 17
    return { id: `z-${i}`, zoneId: `ZN-${String(i + 1).padStart(4, "0")}`, name: ZONE_NAMES[i % ZONE_NAMES.length], type: pick(ZONE_TYPES, s) as string, status: pick(COVERAGE_STATUSES, s + 1) as string, density: pick(DENSITIES, s + 2) as string, avgFreq: ri(10, 200, s + 3), competitors: ri(0, 8, s + 4), darkStores: ri(0, 5, s + 5), radius: ri(1, 8, s + 6) }
  })

  // Dashboard chart data
  const hourlyOrders = Array.from({ length: 24 }, (_, i) => ({ hour: `${String(i).padStart(2, "0")}:00`, Grocery: ri(30, 120, i * 7 + 100), Food: ri(20, 90, i * 7 + 200), Pharmacy: ri(10, 50, i * 7 + 300) }))
  const categoryMix = (["Grocery", "Food", "Pharmacy", "Fashion", "Electronics", "Beauty", "Pet Care", "Fresh"] as const).map((n, i) => ({ name: n, value: ri(50, 300, i * 11 + 400) }))
  const zoneDelivery = Array.from({ length: 10 }, (_, i) => ({ zone: ZONE_NAMES[i % ZONE_NAMES.length].slice(0, 12), deliveries: ri(200, 800, i * 13 + 500) }))

  // Analytics chart data
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const deliveryTrend = months.map((m, i) => ({ month: m, avgMin: ri(18, 32, i * 9 + 600) }))
  const channelDist = (CHANNELS as readonly string[]).map((c, i) => ({ name: c, value: ri(100, 500, i * 7 + 700) }))
  const catPerf = (["Grocery", "Food", "Pharma", "Fashion", "Electronics", "Beauty"] as const).map((n, i) => ({ name: n, revenue: ri(50000, 500000, i * 11 + 800) }))
  const zoneRevenue = Array.from({ length: 10 }, (_, i) => ({ zone: ZONE_NAMES[i * 6 % ZONE_NAMES.length].slice(0, 14), revenue: ri(200000, 2000000, i * 13 + 900) }))

  return { STORE_TYPES, STORE_STATUSES, CITIES, ORDER_STATUSES, CHANNELS, PRIORITIES, VEHICLES, PARTNER_STATUSES, ZONE_TYPES, COVERAGE_STATUSES, DENSITIES, darkStores, orders, partners, zones, hourlyOrders, categoryMix, zoneDelivery, deliveryTrend, channelDist, catPerf, zoneRevenue, kpis: { activeDarkStores: 62, ordersToday: 4827, avgDelivery: 18, coverageKm: 342, revenueToday: 1845000, partnerStores: 234, riderUtil: 78.5, custRating: 4.6 } }
}

const PIE_COLORS = ["#0891b2", "#3b82f6", "#059669", "#d97706", "#7c3aed", "#e11d48", "#4f46e5", "#0d9480", "#ea580c", "#c026d3"]

const KPI_ICON_MAP: Record<string, LucideIcon> = { Store, Package, Clock, MapPin, IndianRupee, Users, Bike, Star }

// ============================================================================
// Main Component
// ============================================================================
export default function HyperlocalFulfillmentView() {
  const { toast } = useToast()
  const data = useMemo(() => generateData(), [])
  const [activeTab, setActiveTab] = useState("0")
  const [searchQ, setSearchQ] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<DarkStore | Order | Partner | Zone | null>(null)

  const handleSort = (f: string) => { if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortField(f); setSortDir("asc") } }
  const sortFn = <T,>(items: T[], field: string): T[] => {
    if (!field) return items
    return [...items].sort((a, b) => {
      const aV = (a as unknown as Record<string, string | number>)[field] ?? ""
      const bV = (b as unknown as Record<string, string | number>)[field] ?? ""
      return sortDir === "asc" ? (aV < bV ? -1 : aV > bV ? 1 : 0) : (aV < bV ? 1 : aV > bV ? -1 : 0)
    })
  }
  const SortHead = ({ col, label }: { col: string; label: string }) => (
    <TableHead className="text-xs cursor-pointer select-none hover:bg-accent/50 hyl-sort-head" onClick={() => handleSort(col)}>
      <div className="flex items-center gap-0.5">{label}{sortField === col && <span className="text-[9px]">{sortDir === "asc" ? "↑" : "↓"}</span>}</div>
    </TableHead>
  )

  const tab = activeTab
  const statuses = tab === "1" ? data.STORE_STATUSES : tab === "2" ? data.ORDER_STATUSES : tab === "3" ? data.PARTNER_STATUSES : tab === "4" ? data.COVERAGE_STATUSES : data.STORE_STATUSES

  const filteredStores = useMemo(() => { let f = data.darkStores; if (searchQ) f = f.filter(s => s.storeId.toLowerCase().includes(searchQ.toLowerCase()) || s.name.toLowerCase().includes(searchQ.toLowerCase())); if (statusFilter !== "all") f = f.filter(s => s.status === statusFilter); return sortFn(f as unknown as Record<string, string | number>[], sortField) as unknown as DarkStore[] }, [data.darkStores, searchQ, statusFilter, sortField, sortDir])
  const filteredOrders = useMemo(() => { let f = data.orders; if (searchQ) f = f.filter(o => o.orderId.toLowerCase().includes(searchQ.toLowerCase()) || o.customer.toLowerCase().includes(searchQ.toLowerCase())); if (statusFilter !== "all") f = f.filter(o => o.status === statusFilter); return sortFn(f as unknown as Record<string, string | number>[], sortField) as unknown as Order[] }, [data.orders, searchQ, statusFilter, sortField, sortDir])
  const filteredPartners = useMemo(() => { let f = data.partners; if (searchQ) f = f.filter(p => p.partnerId.toLowerCase().includes(searchQ.toLowerCase()) || p.name.toLowerCase().includes(searchQ.toLowerCase())); if (statusFilter !== "all") f = f.filter(p => p.status === statusFilter); return sortFn(f as unknown as Record<string, string | number>[], sortField) as unknown as Partner[] }, [data.partners, searchQ, statusFilter, sortField, sortDir])
  const filteredZones = useMemo(() => { let f = data.zones; if (searchQ) f = f.filter(z => z.zoneId.toLowerCase().includes(searchQ.toLowerCase()) || z.name.toLowerCase().includes(searchQ.toLowerCase())); if (statusFilter !== "all") f = f.filter(z => z.status === statusFilter); return sortFn(f as unknown as Record<string, string | number>[], sortField) as unknown as Zone[] }, [data.zones, searchQ, statusFilter, sortField, sortDir])

  const openSheet = (item: DarkStore | Order | Partner | Zone) => { setSelectedRow(item); setSheetOpen(true) }
  const kpi = data.kpis

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <PageHeader title="Hyperlocal Fulfillment" description="Dark store network, quick commerce orders, delivery partners & zone coverage management" />

      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setSearchQ(""); setStatusFilter("all") }}>
        <TabsList className="grid w-full grid-cols-6 h-9">
          <TabsTrigger value="0" className="text-[11px]">Dashboard</TabsTrigger>
          <TabsTrigger value="1" className="text-[11px]">Dark Stores</TabsTrigger>
          <TabsTrigger value="2" className="text-[11px]">Orders</TabsTrigger>
          <TabsTrigger value="3" className="text-[11px]">Partners</TabsTrigger>
          <TabsTrigger value="4" className="text-[11px]">Zones</TabsTrigger>
          <TabsTrigger value="5" className="text-[11px]">Analytics</TabsTrigger>
        </TabsList>

        {/* Tab 0 — Hyperlocal Dashboard */}
        <TabsContent value="0" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 hyl-kpi-grid">
            {(
              [{ t: "Active Dark Stores", v: String(kpi.activeDarkStores), s: "+4 this week", icon: "Store", color: "bg-cyan-600" },
              { t: "Orders Today", v: String(kpi.ordersToday), s: "+12% vs yesterday", icon: "Package", color: "bg-blue-600" },
              { t: "Avg Delivery", v: `${kpi.avgDelivery} min`, s: "-2 min improvement", icon: "Clock", color: "bg-emerald-600" },
              { t: "Coverage Area", v: `${kpi.coverageKm} km²`, s: "Across 8 cities", icon: "MapPin", color: "bg-amber-600" },
              { t: "Revenue Today", v: fmtINR(kpi.revenueToday), s: "+15% vs last week", icon: "IndianRupee", color: "bg-violet-600" },
              { t: "Partner Stores", v: String(kpi.partnerStores), s: "Quick commerce", icon: "Users", color: "bg-rose-600" },
              { t: "Rider Utilization", v: `${kpi.riderUtil}%`, s: "78.5% active", icon: "Bike", color: "bg-cyan-700" },
              { t: "Customer Rating", v: `${kpi.custRating}/5`, s: "4.6 avg stars", icon: "Star", color: "bg-amber-500" }] as { t: string; v: string; s: string; icon: string; color: string }[]
            ).map((k, i) => {
              const KpiIcon = KPI_ICON_MAP[k.icon]
              return (
              <Card key={i}><CardContent className="glass-subtle flex items-center gap-3 p-4">
                <div className={cn("rounded-lg p-2 hyl-kpi-icon", k.color)}>{KpiIcon && <KpiIcon className="h-4 w-4 text-white" />}</div>
                <div><p className="text-[10px] text-muted-foreground">{k.t}</p><p className="text-sm font-bold">{k.v}</p><p className="text-[10px] text-muted-foreground">{k.s}</p></div>
              </CardContent></Card>
              )
            })}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card><CardHeader><CardTitle className="text-sm">Hourly Orders (Grocery/Food/Pharmacy)</CardTitle></CardHeader><CardContent><div className="h-[240px]"><AreaChart data={data.hourlyOrders}><CartesianGrid strokeDasharray="3 3" className="stroke-muted" /><XAxis dataKey="hour" tick={{ fontSize: 9 }} interval={3} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Area type="monotone" dataKey="Grocery" stackId="1" stroke="#0891b2" fill="#0891b2" fillOpacity={0.4} /><Area type="monotone" dataKey="Food" stackId="1" stroke="#d97706" fill="#d97706" fillOpacity={0.4} /><Area type="monotone" dataKey="Pharmacy" stackId="1" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.4} /></AreaChart></div></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Category Mix</CardTitle></CardHeader><CardContent><div className="h-[240px]"><PieChart><Pie data={data.categoryMix} cx="50%" cy="50%" outerRadius={70} dataKey="value" nameKey="name" label={({ name }) => <span className="text-[9px]">{name}</span>} labelLine={false}>{data.categoryMix.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}</Pie><Tooltip /></PieChart></div></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Zone-wise Deliveries</CardTitle></CardHeader><CardContent><div className="h-[240px]"><BarChart data={data.zoneDelivery}><CartesianGrid strokeDasharray="3 3" className="stroke-muted" /><XAxis dataKey="zone" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="deliveries" fill="#3b82f6" radius={[4, 4, 0, 0]} /></BarChart></div></CardContent></Card>
          </div>
        </TabsContent>

        {/* Tab 1 — Dark Store Network */}
        <TabsContent value="1" className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" /><Input placeholder="Search store ID, name..." className="h-8 pl-8 text-xs" value={searchQ} onChange={(e) => setSearchQ(e.target.value)} /></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Statuses</SelectItem>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="rounded-md border overflow-auto max-h-[420px]">
            <Table className="table-hover-highlight"><TableHeader><TableRow className="hyl-table-row">
              <SortHead col="storeId" label="Store ID" /><TableHead className="text-[10px]">Name</TableHead><TableHead className="text-[10px]">Type</TableHead><TableHead className="text-[10px]">City</TableHead><TableHead className="text-[10px]">Status</TableHead><TableHead className="text-[10px]">Avg Del.</TableHead><TableHead className="text-[10px]">Orders</TableHead><TableHead className="text-[10px]">SKUs</TableHead><TableHead className="text-[10px]">Riders</TableHead><TableHead className="text-[10px]">Temp</TableHead><TableHead className="w-[40px]" />
            </TableRow></TableHeader><TableBody>
              {filteredStores.map((s) => (
                <TableRow key={s.id} className="cursor-pointer hyl-table-row hover:bg-muted/50" onClick={() => openSheet(s)}>
                  <TableCell className="text-xs font-mono font-semibold">{s.storeId}</TableCell>
                  <TableCell className="text-[10px] font-medium max-w-[120px] truncate">{s.name}</TableCell>
                  <TableCell><DarkStoreTypeBadge type={s.type} /></TableCell>
                  <TableCell><CityBadge city={s.city} /></TableCell>
                  <TableCell><StoreStatusBadge status={s.status} /></TableCell>
                  <TableCell><DeliveryTimeTile min={s.avgDeliveryMin} /></TableCell>
                  <TableCell className="text-[10px]">{s.dailyOrders}</TableCell>
                  <TableCell className="text-[10px]">{s.skuCount.toLocaleString()}</TableCell>
                  <TableCell className="text-[10px]">{s.riderCount}</TableCell>
                  <TableCell><Badge variant="outline" className="badge-interactive text-[9px] h-5">{s.tempZone}</Badge></TableCell>
                  <TableCell><Eye className="h-3.5 w-3.5 text-muted-foreground" /></TableCell>
                </TableRow>
              ))}
            </TableBody></Table>
          </div>
        </TabsContent>

        {/* Tab 2 — Order Management */}
        <TabsContent value="2" className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" /><Input placeholder="Search order ID, customer..." className="h-8 pl-8 text-xs" value={searchQ} onChange={(e) => setSearchQ(e.target.value)} /></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Statuses</SelectItem>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="rounded-md border overflow-auto max-h-[420px]">
            <Table className="table-hover-highlight"><TableHeader><TableRow className="hyl-table-row">
              <SortHead col="orderId" label="Order ID" /><TableHead className="text-[10px]">Customer</TableHead><TableHead className="text-[10px]">Status</TableHead><TableHead className="text-[10px]">Channel</TableHead><TableHead className="text-[10px]">Priority</TableHead><TableHead className="text-[10px]">Items</TableHead><TableHead className="text-[10px]">Value</TableHead><TableHead className="text-[10px]">Partner</TableHead><TableHead className="w-[40px]" />
            </TableRow></TableHeader><TableBody>
              {filteredOrders.map((o) => (
                <TableRow key={o.id} className="cursor-pointer hyl-table-row hover:bg-muted/50" onClick={() => openSheet(o)}>
                  <TableCell className="text-xs font-mono font-semibold">{o.orderId}</TableCell>
                  <TableCell className="text-[10px] font-medium">{o.customer}</TableCell>
                  <TableCell><OrderStatusBadge status={o.status} /></TableCell>
                  <TableCell><ChannelBadge channel={o.channel} /></TableCell>
                  <TableCell><PriorityBadge priority={o.priority} /></TableCell>
                  <TableCell className="text-[10px]">{o.items}</TableCell>
                  <TableCell><ValueTile amount={o.value} /></TableCell>
                  <TableCell className="text-[10px]">{o.partner}</TableCell>
                  <TableCell><Eye className="h-3.5 w-3.5 text-muted-foreground" /></TableCell>
                </TableRow>
              ))}
            </TableBody></Table>
          </div>
        </TabsContent>

        {/* Tab 3 — Delivery Partners */}
        <TabsContent value="3" className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" /><Input placeholder="Search partner ID, name..." className="h-8 pl-8 text-xs" value={searchQ} onChange={(e) => setSearchQ(e.target.value)} /></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Statuses</SelectItem>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="rounded-md border overflow-auto max-h-[420px]">
            <Table className="table-hover-highlight"><TableHeader><TableRow className="hyl-table-row">
              <SortHead col="partnerId" label="Partner ID" /><TableHead className="text-[10px]">Name</TableHead><TableHead className="text-[10px]">Vehicle</TableHead><TableHead className="text-[10px]">Status</TableHead><TableHead className="text-[10px]">Deliveries</TableHead><TableHead className="text-[10px]">Rating</TableHead><TableHead className="text-[10px]">Earnings</TableHead><TableHead className="text-[10px]">Zone</TableHead><TableHead className="text-[10px]">Shift</TableHead><TableHead className="w-[40px]" />
            </TableRow></TableHeader><TableBody>
              {filteredPartners.map((p) => (
                <TableRow key={p.id} className="cursor-pointer hyl-table-row hover:bg-muted/50" onClick={() => openSheet(p)}>
                  <TableCell className="text-xs font-mono font-semibold">{p.partnerId}</TableCell>
                  <TableCell className="text-[10px] font-medium">{p.name}</TableCell>
                  <TableCell><VehicleTypeBadge vehicle={p.vehicle} /></TableCell>
                  <TableCell><PartnerStatusBadge status={p.status} /></TableCell>
                  <TableCell className="text-[10px]">{p.deliveries}</TableCell>
                  <TableCell><StarRating rating={p.rating} /></TableCell>
                  <TableCell><EarningsTile amount={p.earnings} /></TableCell>
                  <TableCell className="text-[10px] max-w-[80px] truncate">{p.zone}</TableCell>
                  <TableCell><Badge variant="outline" className="badge-interactive text-[9px] h-5">{p.shift}</Badge></TableCell>
                  <TableCell><Eye className="h-3.5 w-3.5 text-muted-foreground" /></TableCell>
                </TableRow>
              ))}
            </TableBody></Table>
          </div>
        </TabsContent>

        {/* Tab 4 — Zone & Coverage */}
        <TabsContent value="4" className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" /><Input placeholder="Search zone ID, name..." className="h-8 pl-8 text-xs" value={searchQ} onChange={(e) => setSearchQ(e.target.value)} /></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Statuses</SelectItem>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="rounded-md border overflow-auto max-h-[420px]">
            <Table className="table-hover-highlight"><TableHeader><TableRow className="hyl-table-row">
              <SortHead col="zoneId" label="Zone ID" /><TableHead className="text-[10px]">Name</TableHead><TableHead className="text-[10px]">Type</TableHead><TableHead className="text-[10px]">Status</TableHead><TableHead className="text-[10px]">Density</TableHead><TableHead className="text-[10px]">Avg Freq</TableHead><TableHead className="text-[10px]">Competitors</TableHead><TableHead className="text-[10px]">Dark Stores</TableHead><TableHead className="text-[10px]">Radius</TableHead><TableHead className="w-[40px]" />
            </TableRow></TableHeader><TableBody>
              {filteredZones.map((z) => (
                <TableRow key={z.id} className="cursor-pointer hyl-table-row hover:bg-muted/50" onClick={() => openSheet(z)}>
                  <TableCell className="text-xs font-mono font-semibold">{z.zoneId}</TableCell>
                  <TableCell className="text-[10px] font-medium">{z.name}</TableCell>
                  <TableCell><ZoneTypeBadge type={z.type} /></TableCell>
                  <TableCell><CoverageStatusBadge status={z.status} /></TableCell>
                  <TableCell><DensityBadge density={z.density} /></TableCell>
                  <TableCell className="text-[10px]">{z.avgFreq}/day</TableCell>
                  <TableCell className="text-[10px]">{z.competitors}</TableCell>
                  <TableCell className="text-[10px]">{z.darkStores}</TableCell>
                  <TableCell><RadiusTile km={z.radius} /></TableCell>
                  <TableCell><Eye className="h-3.5 w-3.5 text-muted-foreground" /></TableCell>
                </TableRow>
              ))}
            </TableBody></Table>
          </div>
        </TabsContent>

        {/* Tab 5 — Fulfillment Analytics */}
        <TabsContent value="5" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card><CardHeader><CardTitle className="text-sm">Delivery Time Trend (12 months)</CardTitle></CardHeader><CardContent><div className="h-[240px]"><LineChart data={data.deliveryTrend}><CartesianGrid strokeDasharray="3 3" className="stroke-muted" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Line type="monotone" dataKey="avgMin" stroke="#0891b2" strokeWidth={2} /></LineChart></div></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Channel Distribution</CardTitle></CardHeader><CardContent><div className="h-[240px]"><PieChart><Pie data={data.channelDist} cx="50%" cy="50%" outerRadius={70} dataKey="value" nameKey="name" label={({ name }) => <span className="text-[9px]">{name}</span>} labelLine={false}>{data.channelDist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}</Pie><Tooltip /></PieChart></div></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Category Performance</CardTitle></CardHeader><CardContent><div className="h-[240px]"><BarChart data={data.catPerf}><CartesianGrid strokeDasharray="3 3" className="stroke-muted" /><XAxis dataKey="name" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="revenue" fill="#059669" radius={[4, 4, 0, 0]} /></BarChart></div></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Zone Revenue Comparison</CardTitle></CardHeader><CardContent><div className="h-[240px]"><BarChart data={data.zoneRevenue} layout="vertical"><CartesianGrid strokeDasharray="3 3" className="stroke-muted" /><XAxis type="number" tick={{ fontSize: 10 }} /><YAxis type="category" dataKey="zone" tick={{ fontSize: 9 }} width={80} /><Tooltip /><Bar dataKey="revenue" fill="#7c3aed" radius={[0, 4, 4, 0]} /></BarChart></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Sheet */}
      <Sheet open={!!(sheetOpen && selectedRow)} onOpenChange={(o) => { setSheetOpen(o); if (!o) setSelectedRow(null) }}>
        <SheetContent side="right" className="w-[460px] overflow-y-auto p-0">
          <SheetHeader className="sr-only"><SheetTitle>Detail</SheetTitle></SheetHeader>
          {selectedRow && ("storeId" in selectedRow ? (() => {
            const s = selectedRow as DarkStore
            return <>
              <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 text-white hyl-sheet-header">
                <div className="flex items-center gap-2 mb-2"><Store className="h-5 w-5" /><h3 className="text-lg font-bold">{s.storeId}</h3></div>
                <div className="flex flex-wrap items-center gap-2"><DarkStoreTypeBadge type={s.type} /><CityBadge city={s.city} /><StoreStatusBadge status={s.status} /></div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Name</span><span className="text-xs font-medium">{s.name}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Temp Zone</span><span className="text-xs">{s.tempZone}</span></div>
                </div>
                <div className="badge-interactive flex flex-wrap items-center gap-3"><DeliveryTimeTile min={s.avgDeliveryMin} /><Badge variant="outline" className="text-[10px]">{s.dailyOrders} orders/day</Badge><Badge variant="outline" className="text-[10px]">{s.skuCount.toLocaleString()} SKUs</Badge><Badge variant="outline" className="text-[10px]">{s.riderCount} riders</Badge></div>
                <Separator />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" className="h-8 text-xs gap-1" onClick={() => toast.success("Store Updated", `${s.storeId} details updated`)}><TrendingUp className="h-3 w-3" />Update</Button>
                  <Button size="sm" variant="outline" className="btn-outline-animate h-8 text-xs gap-1" onClick={() => toast.info("Maintenance", `Scheduling maintenance for ${s.storeId}`)}>Maintenance</Button>
                </div>
              </div>
            </>
          })() : "orderId" in selectedRow ? (() => {
            const o = selectedRow as Order
            return <>
              <div className="bg-gradient-to-r from-blue-600 to-violet-600 p-6 text-white hyl-sheet-header">
                <div className="flex items-center gap-2 mb-2"><Package className="h-5 w-5" /><h3 className="text-lg font-bold">{o.orderId}</h3></div>
                <div className="flex flex-wrap items-center gap-2"><OrderStatusBadge status={o.status} /><ChannelBadge channel={o.channel} /><PriorityBadge priority={o.priority} /></div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Customer</span><span className="text-xs font-medium">{o.customer}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Delivery Partner</span><span className="text-xs">{o.partner}</span></div>
                </div>
                <div className="badge-interactive flex flex-wrap items-center gap-3"><ValueTile amount={o.value} /><Badge variant="outline" className="text-[10px]">{o.items} items</Badge></div>
                <Separator />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" className="h-8 text-xs gap-1" onClick={() => toast.success("Updated", `Order ${o.orderId} updated`)}>Update Status</Button>
                  <Button size="sm" variant="outline" className="btn-outline-animate h-8 text-xs gap-1" onClick={() => toast.info("Tracking", `Tracking ${o.orderId}`)}>Track</Button>
                </div>
              </div>
            </>
          })() : "partnerId" in selectedRow ? (() => {
            const p = selectedRow as Partner
            return <>
              <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 p-6 text-white hyl-sheet-header">
                <div className="flex items-center gap-2 mb-2"><Bike className="h-5 w-5" /><h3 className="text-lg font-bold">{p.partnerId}</h3></div>
                <div className="flex flex-wrap items-center gap-2"><VehicleTypeBadge vehicle={p.vehicle} /><PartnerStatusBadge status={p.status} /></div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Name</span><span className="text-xs font-medium">{p.name}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Shift</span><span className="text-xs">{p.shift}</span></div>
                </div>
                <div className="badge-interactive flex flex-wrap items-center gap-3"><StarRating rating={p.rating} /><EarningsTile amount={p.earnings} /><Badge variant="outline" className="text-[10px]">{p.deliveries} deliveries</Badge></div>
                <Separator />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" className="h-8 text-xs gap-1" onClick={() => toast.success("Partner Updated", `${p.partnerId} updated`)}>Update</Button>
                  <Button size="sm" variant="outline" className="btn-outline-animate h-8 text-xs gap-1" onClick={() => toast.info("Assigned", `New zone assigned to ${p.name}`)}>Assign Zone</Button>
                </div>
              </div>
            </>
          })() : (() => {
            const z = selectedRow as Zone
            return <>
              <div className="bg-gradient-to-r from-amber-600 to-rose-600 p-6 text-white hyl-sheet-header">
                <div className="flex items-center gap-2 mb-2"><MapPin className="h-5 w-5" /><h3 className="text-lg font-bold">{z.zoneId}</h3></div>
                <div className="flex flex-wrap items-center gap-2"><ZoneTypeBadge type={z.type} /><CoverageStatusBadge status={z.status} /><DensityBadge density={z.density} /></div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex flex-col gap-1"><span className="text-[10px] text-muted-foreground font-medium">Zone Name</span><span className="text-xs font-medium">{z.name}</span></div>
                <div className="badge-interactive flex flex-wrap items-center gap-3"><RadiusTile km={z.radius} /><Badge variant="outline" className="text-[10px]">{z.avgFreq} orders/day</Badge><Badge variant="outline" className="text-[10px]">{z.competitors} competitors</Badge><Badge variant="outline" className="text-[10px]">{z.darkStores} dark stores</Badge></div>
                <Separator />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" className="h-8 text-xs gap-1" onClick={() => toast.success("Zone Updated", `${z.zoneId} updated`)}>Update</Button>
                  <Button size="sm" variant="outline" className="btn-outline-animate h-8 text-xs gap-1" onClick={() => toast.info("Expanding", `Expanding coverage for ${z.name}`)}>Expand Coverage</Button>
                </div>
              </div>
            </>
          })())}
        </SheetContent>
      </Sheet>
    </div>
  )
}
