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
  RotateCcw, Package, Clock, IndianRupee, TrendingUp, Star,
  ArrowUpRight, ArrowDownRight, Search, Eye, Filter,
  ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Truck,
  MapPin, Phone, CalendarDays, RefreshCw, PackageCheck,
  PackageX, PackageMinus, CreditCard, Wallet, Building2,
  BarChart3, Target, Warehouse, Users, FileText, Banknote,
  type LucideIcon,
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
const RETURN_STATUSES = ["Requested", "Pickup Scheduled", "Picked Up", "In Transit", "Received", "Inspected", "Approved", "Rejected", "Refunded", "Closed"] as const
const RETURN_REASONS = ["Defective Product", "Wrong Item Delivered", "Size Not Fit", "Changed Mind", "Damaged in Transit", "Warranty Claim", "Late Delivery", "Duplicate Order"] as const
const RETURN_CHANNELS = ["Amazon", "Flipkart", "Myntra", "Ajio", "Meesho", "Direct Website", "Retail Store", "Wholesale Partner"] as const
const PRODUCT_CATEGORIES = ["Electronics", "Apparel", "Footwear", "Home Appliances", "Beauty", "Books", "Toys", "Kitchen", "Sports", "Mobile Accessories"] as const
const INSPECTION_RESULTS = ["Pass", "Fail", "Conditional Pass", "Rejected"] as const
const DEFECT_TYPES = ["Manufacturing Defect", "Cosmetic Damage", "Missing Parts", "Functional Failure", "Water Damage", "Packaging Damage", "Wrong Variant", "Counterfeit"] as const
const SEVERITY_LEVELS = ["Critical", "Major", "Minor", "Negligible"] as const
const QA_ACTIONS = ["Refund", "Replacement", "Repair", "Resell as Open Box", "Scrap", "Return to Vendor", "Donate"] as const
const REFUND_METHODS = ["Original Payment", "UPI Refund", "Bank Transfer", "Wallet Credit", "Store Credit", "NEFT", "Gift Card"] as const
const REFUND_STATUSES = ["Pending", "Processing", "Approved", "Completed", "Failed", "Reversed"] as const
const CONDITION_GRADES = ["A+", "A", "B", "C", "D", "Scrap"] as const
const RECOVERY_CHANNELS = ["Amazon Warehouse", "Flipkart Refurbished", "Second-hand Platform", "Outlet Store", "B2B Liquidation", "Employee Sale"] as const
const RECOVERY_STATUSES = ["Listed", "Active Auction", "Sold", "Unsold", "Relisted", "Donated", "Scrapped"] as const

const INDIAN_CUSTOMERS = [
  "Rajesh Kumar", "Priya Sharma", "Arun Patel", "Sneha Reddy", "Vikram Singh",
  "Ananya Iyer", "Karthik Menon", "Deepa Nair", "Sanjay Gupta", "Meera Joshi",
  "Rohit Verma", "Pooja Agarwal", "Amit Bose", "Kavitha Krishnan", "Manish Tiwari",
  "Divya Saxena", "Suresh Pillai", "Lakshmi Rao", "Nikhil Deshmukh", "Ritu Malhotra",
  "Pradeep Yadav", "Shalini Kulkarni", "Arunachalam Murugan", "Harish Chauhan",
  "Sunita Devi", "Vishal Kapoor", "Anjali Mehta", "Ramesh Bhatt", "Pallavi Hegde",
  "Dinesh Shukla", "Swati Pandey", "Ganesh Iyer", "Komal Thakur", "Tarun Grover",
  "Bhavna Sinha", "Akhil Nambiar", "Madhuri Dixit", "Siddharth Jha", "Prachi Goyal",
  "Rajan Pillai", "Neha Chopra", "Kiran Rao", "Yogesh Patil", "Asha Menon",
  "Varun Khanna", "Shikha Verma", "Gaurav Tandon", "Suman Latha", "Pankaj Dubey",
] as const
const INDIAN_CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata",
  "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Indore", "Bhopal", "Coimbatore",
  "Kochi", "Vizag", "Nagpur", "Surat", "Vadodara", "Thane",
] as const
const INDIAN_PINCodes = [
  "400001", "400051", "400078", "400086", "400061", "110001", "110045", "110092",
  "560001", "560034", "560076", "560100", "600001", "600042", "600096", "600119",
  "500001", "500032", "500081", "500072", "411001", "411014", "411027", "411038",
  "700001", "700045", "700091", "700156", "380001", "380015", "380052", "380054",
  "302001", "302015", "302020", "226001", "226010", "226012", "160001", "160017",
] as const
const PRODUCT_SKUS = [
  "ELEC-TV-001", "ELEC-MOB-002", "ELEC-LAP-003", "ELEC-TAB-004", "ELEC-WCH-005",
  "APRL-SHIRT-010", "APRL-JEAN-011", "APRL-KURTA-012", "APRL-DRESS-013", "APRL-SARI-014",
  "FTWR-SNK-020", "FTWR-BOOT-021", "FTWR-SAND-022", "FTWR-FORM-023", "FTWR-SPT-024",
  "HOME-MIX-030", "HOME-AC-031", "HOME-MIC-032", "HOME-WASH-033", "HOME-VAC-034",
  "BEAU-CRM-040", "BEAU-SRN-041", "BEAU-LIP-042", "BEAU-SKN-043", "BEAU-PRS-044",
  "BOOK-NVL-050", "BOOK-TEX-051", "BOOK-CHL-052", "BOOK-REF-053", "BOOK-MAG-054",
  "TOYS-GME-060", "TOYS-PZL-061", "TOYS-RCS-062", "TOYS-BLK-063", "TOYS-CTC-064",
  "KTCN-MXR-070", "KTCN-COK-071", "KTCN-PNL-072", "KTCN-KTL-073", "KTCN-BLK-074",
  "SPRT-CRK-080", "SPRT-BTB-081", "SPRT-YGA-082", "SPRT-TNS-083", "SPRT-GYM-084",
  "MOB-CHG-090", "MOB-CSE-091", "MOB-EBD-092", "MOB-POP-093", "MOB-MNT-094",
] as const
const INSPECTOR_NAMES = [
  "Ravindra Kumar", "Sunita Sharma", "Manoj Verma", "Pooja Tiwari", "Anil Gupta",
  "Kavita Joshi", "Suresh Patel", "Deepika Iyer", "Rajesh Menon", "Vijay Nair",
  "Asha Deshmukh", "Prakash Saxena", "Meena Kumari", "Ganesh Hegde", "Harish Rao",
  "Swati Bhatt", "Nitin Kulkarni", "Rekha Pillai", "Arun Reddy", "Divya Malhotra",
] as const

// ============================================================================
// Color Maps
// ============================================================================
const RETURN_STATUS_COLORS: Record<string, string> = {
  "Requested": "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300",
  "Pickup Scheduled": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Picked Up": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300 rle-status-pulse-active",
  "In Transit": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 rle-status-pulse-active",
  "Received": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  "Inspected": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Approved": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Rejected": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  "Refunded": "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  "Closed": "bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400",
}
const REASON_COLORS: Record<string, string> = {
  "Defective Product": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  "Wrong Item Delivered": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Size Not Fit": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Changed Mind": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Damaged in Transit": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  "Warranty Claim": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "Late Delivery": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  "Duplicate Order": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
}
const CHANNEL_COLORS: Record<string, string> = {
  "Amazon": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Flipkart": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Myntra": "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  "Ajio": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  "Meesho": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Direct Website": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "Retail Store": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Wholesale Partner": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
}
const QA_RESULT_COLORS: Record<string, string> = {
  "Pass": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Fail": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  "Conditional Pass": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Rejected": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
}
const DEFECT_COLORS: Record<string, string> = {
  "Manufacturing Defect": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  "Cosmetic Damage": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Missing Parts": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Functional Failure": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  "Water Damage": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Packaging Damage": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  "Wrong Variant": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "Counterfeit": "bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300",
}
const SEVERITY_COLORS: Record<string, string> = {
  "Critical": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 rle-severity-pulse",
  "Major": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Minor": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Negligible": "bg-slate-100 text-slate-600 dark:bg-slate-900/40 dark:text-slate-400",
}
const REFUND_STATUS_COLORS: Record<string, string> = {
  "Pending": "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300",
  "Processing": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rle-status-pulse-active",
  "Approved": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Completed": "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  "Failed": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 rle-status-pulse-error",
  "Reversed": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
}
const GRADE_COLORS: Record<string, string> = {
  "A+": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "A": "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  "B": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "C": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "D": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Scrap": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
}
const RECOVERY_STATUS_COLORS: Record<string, string> = {
  "Listed": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Active Auction": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 rle-status-pulse-active",
  "Sold": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Unsold": "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300",
  "Relisted": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  "Donated": "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  "Scrapped": "bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400",
}

// ============================================================================
// Data Generation
// ============================================================================
interface ReturnRequest {
  id: string; customer: string; sku: string; reason: string; channel: string;
  status: string; value: number; pickupDate: string; age: number;
  city: string; pincode: string; phone: string; category: string;
}
interface InspectionRecord {
  id: string; requestId: string; product: string; inspector: string;
  result: string; defectType: string; severity: string; action: string; notes: string;
}
interface RefundRecord {
  id: string; requestId: string; customer: string; originalValue: number;
  refundAmount: number; deduction: number; method: string; status: string;
  processedDate: string; tat: number;
}
interface RecoveryRecord {
  id: string; product: string; conditionGrade: string; recoveryChannel: string;
  listedPrice: number; soldPrice: number; recoveryPct: number; status: string; daysToSell: number;
}

function generateData() {
  const returns: ReturnRequest[] = []
  for (let i = 0; i < 75; i++) {
    const s = i * 17 + 3
    const customer = pick(INDIAN_CUSTOMERS, s) as string
    const city = pick(INDIAN_CITIES, s + 1) as string
    const pincode = pick(INDIAN_PINCodes, s + 2) as string
    const sku = pick(PRODUCT_SKUS, s + 3) as string
    const cat = pick(PRODUCT_CATEGORIES, s + 4) as string
    const statusIdx = Math.min(Math.floor(seededRandom(s + 5) * RETURN_STATUSES.length), RETURN_STATUSES.length - 1)
    const status = RETURN_STATUSES[statusIdx]
    const value = ri(299, 49999, s + 6) * (seededRandom(s + 7) < 0.1 ? 10 : 1)
    const day = ri(1, 28, s + 8)
    const month = ri(1, 12, s + 9)
    returns.push({
      id: `RET-2026-${String(i + 1001).padStart(4, "0")}`,
      customer, sku, reason: pick(RETURN_REASONS, s + 10) as string,
      channel: pick(RETURN_CHANNELS, s + 11) as string, status,
      value, pickupDate: `${day < 10 ? "0" : ""}${day}/${month < 10 ? "0" : ""}${month}/2026`,
      age: ri(0, 30, s + 12), city, pincode, phone: `+91 ${ri(7000, 9999, s + 13)}${ri(10000, 99999, s + 14)}`,
      category: cat,
    })
  }

  const inspections: InspectionRecord[] = []
  for (let i = 0; i < 60; i++) {
    const s = i * 19 + 7
    inspections.push({
      id: `INS-${String(i + 2001).padStart(4, "0")}`,
      requestId: `RET-2026-${String(ri(1001, 1075, s)).padStart(4, "0")}`,
      product: pick(PRODUCT_SKUS, s + 1) as string,
      inspector: pick(INSPECTOR_NAMES, s + 2) as string,
      result: pick(INSPECTION_RESULTS, s + 3) as string,
      defectType: pick(DEFECT_TYPES, s + 4) as string,
      severity: pick(SEVERITY_LEVELS, s + 5) as string,
      action: pick(QA_ACTIONS, s + 6) as string,
      notes: pick(["Cosmetic scratch on surface", "Internal component damaged", "Packaging intact, product defective", "Software issue confirmed", "Physical damage to casing", "Missing accessories found", "Wear and tear from usage", "No defects found"], s + 7) as string,
    })
  }

  const refunds: RefundRecord[] = []
  for (let i = 0; i < 65; i++) {
    const s = i * 23 + 11
    const orig = ri(299, 49999, s) * (seededRandom(s + 1) < 0.1 ? 10 : 1)
    const dedPct = seededRandom(s + 2) * 0.15
    const ded = Math.round(orig * dedPct)
    const rstat = pick(REFUND_STATUSES, s + 3) as string
    refunds.push({
      id: `RFD-${String(i + 3001).padStart(4, "0")}`,
      requestId: `RET-2026-${String(ri(1001, 1075, s + 4)).padStart(4, "0")}`,
      customer: pick(INDIAN_CUSTOMERS, s + 5) as string,
      originalValue: orig, refundAmount: orig - ded, deduction: ded,
      method: pick(REFUND_METHODS, s + 6) as string, status: rstat,
      processedDate: `${ri(1, 28, s + 7)}/${ri(1, 12, s + 8)}/2026`,
      tat: ri(1, 14, s + 9),
    })
  }

  const recoveries: RecoveryRecord[] = []
  for (let i = 0; i < 55; i++) {
    const s = i * 29 + 13
    const listP = ri(500, 35000, s)
    const grade = pick(CONDITION_GRADES, s + 1) as string
    const gradeDiscounts: Record<string, number> = { "A+": 0.1, "A": 0.2, "B": 0.35, "C": 0.5, "D": 0.7, "Scrap": 0.9 }
    const disc = gradeDiscounts[grade] ?? 0.5
    const soldP = Math.round(listP * (1 - disc))
    recoveries.push({
      id: `RCV-${String(i + 4001).padStart(4, "0")}`,
      product: pick(PRODUCT_SKUS, s + 2) as string,
      conditionGrade: grade,
      recoveryChannel: pick(RECOVERY_CHANNELS, s + 3) as string,
      listedPrice: listP, soldPrice: soldP,
      recoveryPct: Math.round((soldP / Math.max(listP, 1)) * 100),
      status: pick(RECOVERY_STATUSES, s + 4) as string,
      daysToSell: ri(1, 45, s + 5),
    })
  }

  // Chart data
  const dailyVolume = Array.from({ length: 14 }, (_, i) => ({
    day: `Day ${i + 1}`,
    "New Request": ri(15, 45, i * 3),
    "Picked Up": ri(10, 35, i * 3 + 1),
    "Processed": ri(8, 30, i * 3 + 2),
    "Refunded": ri(5, 25, i * 3 + 4),
  }))
  const reasonDist = RETURN_REASONS.map((r, i) => ({ name: r, value: ri(5, 30, i * 7) }))
  const channelDist = RETURN_CHANNELS.map((c, i) => ({ name: c, value: ri(10, 40, i * 11) }))
  const monthlyTrend = Array.from({ length: 12 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    returns: ri(200, 600, i * 5),
    refunds: ri(150, 500, i * 5 + 1),
    recovery: ri(50, 200, i * 5 + 2),
  }))
  const categoryReturnRate = PRODUCT_CATEGORIES.map((c, i) => ({ name: c, rate: ri(3, 18, i * 9) }))
  const channelReturnRate = RETURN_CHANNELS.map((c, i) => ({ name: c, rate: ri(4, 22, i * 13) }))
  const costSavings = Array.from({ length: 6 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i],
    "Refund Savings": ri(500000, 1500000, i * 3),
    "Recovery Revenue": ri(200000, 800000, i * 3 + 1),
    "Restock Value": ri(300000, 900000, i * 3 + 2),
    "Repair Savings": ri(100000, 400000, i * 3 + 3),
  }))

  return {
    returns, inspections, refunds, recoveries,
    dailyVolume, reasonDist, channelDist,
    monthlyTrend, categoryReturnRate, channelReturnRate, costSavings,
  }
}

// ============================================================================
// Visual Components
// ============================================================================
function ReturnStatusBadge({ status }: { status: string }) {
  return <Badge className={cn("text-[10px] px-1.5 py-0 font-medium", RETURN_STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700")}>{status}</Badge>
}
function ReturnReasonBadge({ reason }: { reason: string }) {
  return <Badge className={cn("text-[10px] px-1.5 py-0 font-medium", REASON_COLORS[reason] ?? "bg-gray-100 text-gray-700")}>{reason}</Badge>
}
function ChannelBadge({ channel }: { channel: string }) {
  return <Badge className={cn("text-[10px] px-1.5 py-0 font-medium", CHANNEL_COLORS[channel] ?? "bg-gray-100 text-gray-700")}>{channel}</Badge>
}
function QualityResultBadge({ result }: { result: string }) {
  return <Badge className={cn("text-[10px] px-1.5 py-0 font-medium", QA_RESULT_COLORS[result] ?? "bg-gray-100 text-gray-700")}>{result}</Badge>
}
function DefectTypeBadge({ type }: { type: string }) {
  return <Badge className={cn("text-[10px] px-1.5 py-0 font-medium", DEFECT_COLORS[type] ?? "bg-gray-100 text-gray-700")}>{type}</Badge>
}
function SeverityBadge({ severity }: { severity: string }) {
  return <Badge className={cn("text-[10px] px-1.5 py-0 font-medium", SEVERITY_COLORS[severity] ?? "bg-gray-100 text-gray-700")}>{severity}</Badge>
}
function RefundMethodBadge({ method }: { method: string }) {
  const icons: Record<string, string> = { "Original Payment": "💳", "UPI Refund": "📱", "Bank Transfer": "🏦", "Wallet Credit": "💎", "Store Credit": "🏪", "NEFT": "💰", "Gift Card": "🎁" }
  return <Badge className="badge-interactive text-[10px] px-1.5 py-0 font-medium bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">{icons[method] ?? ""} {method}</Badge>
}
function RefundStatusBadge({ status }: { status: string }) {
  return <Badge className={cn("text-[10px] px-1.5 py-0 font-medium", REFUND_STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700")}>{status}</Badge>
}
function ConditionGradeBadge({ grade }: { grade: string }) {
  return <Badge className={cn("text-[10px] px-1.5 py-0 font-medium", GRADE_COLORS[grade] ?? "bg-gray-100 text-gray-700")}>{grade}</Badge>
}
function RecoveryChannelBadge({ channel }: { channel: string }) {
  return <Badge className="badge-interactive text-[10px] px-1.5 py-0 font-medium bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300">{channel}</Badge>
}
function RecoveryStatusBadge({ status }: { status: string }) {
  return <Badge className={cn("text-[10px] px-1.5 py-0 font-medium", RECOVERY_STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700")}>{status}</Badge>
}
function RecoveryPctBar({ pct }: { pct: number }) {
  const color = pct >= 60 ? "bg-emerald-500" : pct >= 40 ? "bg-amber-500" : "bg-red-500"
  return (
    <div className="flex items-center gap-2 w-24">
      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
      <span className="text-[10px] font-mono font-medium">{pct}%</span>
    </div>
  )
}
function ValueTile({ value, label }: { value: number; label: string }) {
  return <div className="text-xs"><span className="text-gray-500 dark:text-gray-400">{label}: </span><span className="font-semibold text-foreground">{formatINR(value)}</span></div>
}
function TATBadge({ days }: { days: number }) {
  const color = days <= 3 ? "text-emerald-600 dark:text-emerald-400" : days <= 7 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
  const pulseClass = days > 7 ? "rle-tat-pulse" : ""
  return <span className={cn("text-xs font-mono font-medium", color, pulseClass)}>{days}d</span>
}
function DeductionTile({ deduction, original }: { deduction: number; original: number }) {
  const pct = Math.round((deduction / Math.max(original, 1)) * 100)
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-red-600 dark:text-red-400">-{formatINR(deduction)}</span>
      <span className="text-[10px] text-gray-500">({pct}%)</span>
    </div>
  )
}

const PIE_COLORS = ["#e11d48", "#059669", "#d97706", "#3b82f6", "#7c3aed", "#0891b2", "#ea580c", "#6366f1"]
const CHART_AREA_COLORS = ["#e11d48", "#059669", "#3b82f6", "#d97706", "#7c3aed", "#0891b2"]

function SortHeader({ label, field, sortField, sortDir, onSort }: { label: string; field: string; sortField: string; sortDir: "asc" | "desc"; onSort: (f: string) => void }) {
  return (
    <TableHead className="cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => onSort(field)}>
      <div className={cn("flex items-center gap-1 text-xs font-semibold uppercase tracking-wider", sortField === field ? "text-foreground" : "text-gray-500 dark:text-gray-400")}>
        {label}
        {sortField === field && (
          <span className="text-[10px]">{sortDir === "asc" ? "↑" : "↓"}</span>
        )}
      </div>
    </TableHead>
  )
}

// ============================================================================
// Main Component
// ============================================================================
export default function ReverseLogisticsEnhancementView() {
  const { toast } = useToast()
  const data = useMemo(() => generateData(), [])
  const [activeTab, setActiveTab] = useState("0")
  const [searchQ, setSearchQ] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null)

  const kpis = useMemo(() => [
    { label: "Total Returns", value: data.returns.length.toString(), change: "+12%", up: true, icon: RotateCcw, color: "text-rose-600 dark:text-rose-400" },
    { label: "Pending Pickup", value: data.returns.filter(r => r.status === "Requested" || r.status === "Pickup Scheduled").length.toString(), change: "+5%", up: true, icon: Truck, color: "text-blue-600 dark:text-blue-400" },
    { label: "In Transit", value: data.returns.filter(r => r.status === "In Transit" || r.status === "Picked Up").length.toString(), change: "-3%", up: false, icon: Package, color: "text-violet-600 dark:text-violet-400" },
    { label: "Processing Complete", value: data.returns.filter(r => ["Refunded", "Closed", "Approved"].includes(r.status)).length.toString(), change: "+18%", up: true, icon: PackageCheck, color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Refund Issued", value: formatINR(data.refunds.filter(r => r.status === "Completed").reduce((a, b) => a + b.refundAmount, 0)), change: "+8%", up: true, icon: IndianRupee, color: "text-amber-600 dark:text-amber-400" },
    { label: "Avg Processing Time", value: "3.2d", change: "-0.4d", up: false, icon: Clock, color: "text-cyan-600 dark:text-cyan-400" },
    { label: "Return Rate", value: "6.8%", change: "-0.5%", up: false, icon: TrendingUp, color: "text-blue-600 dark:text-blue-400" },
    { label: "Customer Satisfaction", value: "4.2★", change: "+0.3", up: true, icon: Star, color: "text-emerald-600 dark:text-emerald-400" },
  ], [data])

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortField(field); setSortDir("desc") }
  }

  const filteredReturns = useMemo(() => {
    let f = data.returns
    if (searchQ) f = f.filter(r => r.customer.toLowerCase().includes(searchQ.toLowerCase()) || r.id.toLowerCase().includes(searchQ.toLowerCase()) || r.sku.toLowerCase().includes(searchQ.toLowerCase()))
    if (statusFilter !== "all") f = f.filter(r => r.status === statusFilter)
    if (sortField) f = [...f].sort((a, b) => { const aV = (a as unknown as Record<string, string | number>)[sortField] ?? ""; const bV = (b as unknown as Record<string, string | number>)[sortField] ?? ""; const cmp = aV < bV ? -1 : aV > bV ? 1 : 0; return sortDir === "asc" ? cmp : -cmp })
    return f
  }, [data.returns, searchQ, statusFilter, sortField, sortDir])

  const filteredInspections = useMemo(() => {
    let f = data.inspections
    if (searchQ) f = f.filter(i => i.inspector.toLowerCase().includes(searchQ.toLowerCase()) || i.id.toLowerCase().includes(searchQ.toLowerCase()) || i.product.toLowerCase().includes(searchQ.toLowerCase()))
    if (sortField) f = [...f].sort((a, b) => { const aV = (a as unknown as Record<string, string | number>)[sortField] ?? ""; const bV = (b as unknown as Record<string, string | number>)[sortField] ?? ""; const cmp = aV < bV ? -1 : aV > bV ? 1 : 0; return sortDir === "asc" ? cmp : -cmp })
    return f
  }, [data.inspections, searchQ, sortField, sortDir])

  const filteredRefunds = useMemo(() => {
    let f = data.refunds
    if (searchQ) f = f.filter(r => r.customer.toLowerCase().includes(searchQ.toLowerCase()) || r.id.toLowerCase().includes(searchQ.toLowerCase()))
    if (statusFilter !== "all") f = f.filter(r => r.status === statusFilter)
    if (sortField) f = [...f].sort((a, b) => { const aV = (a as unknown as Record<string, string | number>)[sortField] ?? ""; const bV = (b as unknown as Record<string, string | number>)[sortField] ?? ""; const cmp = aV < bV ? -1 : aV > bV ? 1 : 0; return sortDir === "asc" ? cmp : -cmp })
    return f
  }, [data.refunds, searchQ, statusFilter, sortField, sortDir])

  const filteredRecoveries = useMemo(() => {
    let f = data.recoveries
    if (searchQ) f = f.filter(r => r.product.toLowerCase().includes(searchQ.toLowerCase()) || r.id.toLowerCase().includes(searchQ.toLowerCase()))
    if (statusFilter !== "all") f = f.filter(r => r.status === statusFilter)
    if (sortField) f = [...f].sort((a, b) => { const aV = (a as unknown as Record<string, string | number>)[sortField] ?? ""; const bV = (b as unknown as Record<string, string | number>)[sortField] ?? ""; const cmp = aV < bV ? -1 : aV > bV ? 1 : 0; return sortDir === "asc" ? cmp : -cmp })
    return f
  }, [data.recoveries, searchQ, statusFilter, sortField, sortDir])

  const openDetail = (ret: ReturnRequest) => {
    setSelectedReturn(ret)
    setSheetOpen(true)
    toast.info("Return Detail", `Viewing ${ret.id}`)
  }

  return (
    <div className="space-y-4 p-4 md:p-6">
      <PageHeader title="Reverse Logistics Enhancement" description="End-to-end returns management, quality inspection, refund processing and asset recovery" />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 h-auto flex-wrap gap-1">
          {["Returns Dashboard", "Return Requests", "Quality Inspection", "Refund Tracker", "Recovery & Resale", "Returns Analytics"].map((t, i) => (
            <TabsTrigger key={i} value={String(i)} className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white text-xs px-3 py-1.5">{t}</TabsTrigger>
          ))}
        </TabsList>

        {/* Tab 0: Dashboard */}
        <TabsContent value="0" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {kpis.map((k, i) => {
              const Icon = k.icon
              return (
                <Card key={i} className="rle-kpi-card border-l-4 border-l-rose-500 hover:shadow-lg transition-shadow">
                  <CardContent className="glass-subtle p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">{k.label}</p>
                        <p className="text-lg font-bold mt-0.5">{k.value}</p>
                        <div className={cn("flex items-center text-[10px] mt-1 gap-0.5", k.up ? "text-emerald-600" : "text-red-600")}>
                          {k.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {k.change}
                        </div>
                      </div>
                      <Icon className={cn("w-5 h-5 opacity-50", k.color)} />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="rle-chart-card col-span-2">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Daily Returns Volume</CardTitle></CardHeader>
              <CardContent><AreaChart data={data.dailyVolume} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Area type="monotone" dataKey="New Request" stackId="a" fill="#e11d48" /><Area type="monotone" dataKey="Picked Up" stackId="a" fill="#059669" /><Area type="monotone" dataKey="Processed" stackId="a" fill="#3b82f6" /><Area type="monotone" dataKey="Refunded" stackId="a" fill="#d97706" /></AreaChart></CardContent>
            </Card>
            <Card className="rle-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Return Reasons</CardTitle></CardHeader>
              <CardContent><PieChart width={240} height={240}><Pie data={data.reasonDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={9}>{data.reasonDist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent>
            </Card>
          </div>
          <Card className="rle-chart-card">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Channel Distribution</CardTitle></CardHeader>
            <CardContent><BarChart data={data.channelDist} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="value" fill="#7c3aed" radius={[4, 4, 0, 0]} /></BarChart></CardContent>
          </Card>
        </TabsContent>

        {/* Tab 1: Return Requests */}
        <TabsContent value="1" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
              <Input placeholder="Search by customer, ID, SKU..." value={searchQ} onChange={e => setSearchQ(e.target.value)} className="pl-8 h-9 text-xs" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 text-xs w-[160px]"><SelectValue placeholder="Filter Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {RETURN_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="border rounded-lg overflow-auto max-h-[520px]">
            <Table className="table-hover-highlight">
              <TableHeader>
                <TableRow>
                  <SortHeader label="ID" field="id" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <SortHeader label="Customer" field="customer" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">SKU</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Reason</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Channel</TableHead>
                  <SortHeader label="Status" field="status" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <SortHeader label="Value" field="value" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Pickup</TableHead>
                  <SortHeader label="Age" field="age" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReturns.map(r => (
                  <TableRow key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <TableCell className="text-xs font-mono">{r.id}</TableCell>
                    <TableCell><div className="text-xs font-medium">{r.customer}</div><div className="text-[10px] text-gray-500">{r.city} - {r.pincode}</div></TableCell>
                    <TableCell className="text-xs font-mono">{r.sku}</TableCell>
                    <TableCell><ReturnReasonBadge reason={r.reason} /></TableCell>
                    <TableCell><ChannelBadge channel={r.channel} /></TableCell>
                    <TableCell><ReturnStatusBadge status={r.status} /></TableCell>
                    <TableCell className="numeric-cell text-xs font-semibold">{formatINR(r.value)}</TableCell>
                    <TableCell className="text-xs">{r.pickupDate}</TableCell>
                    <TableCell><TATBadge days={r.age} /></TableCell>
                    <TableCell><Button variant="ghost" size="sm" className="h-7 text-[10px] rle-action-btn" onClick={() => openDetail(r)}><Eye className="w-3 h-3 mr-1" />View</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Tab 2: Quality Inspection */}
        <TabsContent value="2" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
              <Input placeholder="Search by inspector, ID, product..." value={searchQ} onChange={e => setSearchQ(e.target.value)} className="pl-8 h-9 text-xs" />
            </div>
          </div>
          <div className="border rounded-lg overflow-auto max-h-[520px]">
            <Table className="table-hover-highlight">
              <TableHeader>
                <TableRow>
                  <SortHeader label="ID" field="id" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Request ID</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Product</TableHead>
                  <SortHeader label="Inspector" field="inspector" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Result</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Defect</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Severity</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Action</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInspections.map(ins => (
                  <TableRow key={ins.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <TableCell className="text-xs font-mono">{ins.id}</TableCell>
                    <TableCell className="text-xs font-mono">{ins.requestId}</TableCell>
                    <TableCell className="text-xs font-mono">{ins.product}</TableCell>
                    <TableCell className="text-xs">{ins.inspector}</TableCell>
                    <TableCell><QualityResultBadge result={ins.result} /></TableCell>
                    <TableCell><DefectTypeBadge type={ins.defectType} /></TableCell>
                    <TableCell><SeverityBadge severity={ins.severity} /></TableCell>
                    <TableCell><Badge className="badge-interactive text-[10px] px-1.5 py-0 font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">{ins.action}</Badge></TableCell>
                    <TableCell className="text-[10px] text-gray-600 dark:text-gray-400 max-w-[140px] truncate">{ins.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Tab 3: Refund Tracker */}
        <TabsContent value="3" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
              <Input placeholder="Search by customer, refund ID..." value={searchQ} onChange={e => setSearchQ(e.target.value)} className="pl-8 h-9 text-xs" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 text-xs w-[160px]"><SelectValue placeholder="Filter Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {REFUND_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredRefunds.map(r => (
              <Card key={r.id} className="rle-refund-card overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-rose-500 to-emerald-500" />
                <CardContent className="glass-subtle p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold">{r.id}</span>
                    <RefundStatusBadge status={r.status} />
                  </div>
                  <div className="text-xs font-medium">{r.customer}</div>
                  <Separator />
                  <div className="space-y-1">
                    <ValueTile value={r.originalValue} label="Original" />
                    <ValueTile value={r.refundAmount} label="Refund" />
                    <DeductionTile deduction={r.deduction} original={r.originalValue} />
                  </div>
                  <div className="flex items-center justify-between">
                    <RefundMethodBadge method={r.method} />
                    <div className="text-[10px] text-gray-500">{r.processedDate}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-500">TAT</span>
                    <TATBadge days={r.tat} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 4: Recovery & Resale */}
        <TabsContent value="4" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
              <Input placeholder="Search by product, recovery ID..." value={searchQ} onChange={e => setSearchQ(e.target.value)} className="pl-8 h-9 text-xs" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 text-xs w-[160px]"><SelectValue placeholder="Filter Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {RECOVERY_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="border rounded-lg overflow-auto max-h-[520px]">
            <Table className="table-hover-highlight">
              <TableHeader>
                <TableRow>
                  <SortHeader label="ID" field="id" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Product</TableHead>
                  <SortHeader label="Grade" field="conditionGrade" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Channel</TableHead>
                  <SortHeader label="Listed" field="listedPrice" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <SortHeader label="Sold" field="soldPrice" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <SortHeader label="Recovery" field="recoveryPct" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <SortHeader label="Status" field="status" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <SortHeader label="Days" field="daysToSell" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecoveries.map(rc => (
                  <TableRow key={rc.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <TableCell className="text-xs font-mono">{rc.id}</TableCell>
                    <TableCell className="text-xs font-mono">{rc.product}</TableCell>
                    <TableCell><ConditionGradeBadge grade={rc.conditionGrade} /></TableCell>
                    <TableCell><RecoveryChannelBadge channel={rc.recoveryChannel} /></TableCell>
                    <TableCell className="numeric-cell text-xs font-semibold">{formatINR(rc.listedPrice)}</TableCell>
                    <TableCell className="numeric-cell text-xs font-semibold">{formatINR(rc.soldPrice)}</TableCell>
                    <TableCell><RecoveryPctBar pct={rc.recoveryPct} /></TableCell>
                    <TableCell><RecoveryStatusBadge status={rc.status} /></TableCell>
                    <TableCell className="text-xs font-mono">{rc.daysToSell}d</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Tab 5: Analytics */}
        <TabsContent value="5" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Total Returns (YTD)", value: "3,847", icon: RotateCcw, color: "text-rose-600 dark:text-rose-400" },
              { label: "Recovery Rate", value: "62.4%", icon: RefreshCw, color: "text-emerald-600 dark:text-emerald-400" },
              { label: "Avg Refund TAT", value: "3.1 days", icon: Clock, color: "text-blue-600 dark:text-blue-400" },
              { label: "Cost Avoidance", value: formatINR(28400000), icon: IndianRupee, color: "text-amber-600 dark:text-amber-400" },
              { label: "Resale Revenue", value: formatINR(12800000), icon: TrendingUp, color: "text-emerald-600 dark:text-emerald-400" },
              { label: "Quality Pass Rate", value: "71.3%", icon: ShieldCheck, color: "text-violet-600 dark:text-violet-400" },
              { label: "Scrap Rate", value: "8.2%", icon: PackageX, color: "text-red-600 dark:text-red-400" },
              { label: "Net Recovery Value", value: formatINR(15600000), icon: PackageCheck, color: "text-cyan-600 dark:text-cyan-400" },
            ].map((k, i) => {
              const Icon = k.icon
              return (
                <Card key={i} className="rle-kpi-card border-l-4 border-l-emerald-500">
                  <CardContent className="glass-subtle p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">{k.label}</p>
                        <p className="text-base font-bold mt-0.5">{k.value}</p>
                      </div>
                      <Icon className={cn("w-5 h-5 opacity-50", k.color)} />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="rle-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Return Trend</CardTitle></CardHeader>
              <CardContent><LineChart data={data.monthlyTrend} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Line type="monotone" dataKey="returns" stroke="#e11d48" strokeWidth={2} /><Line type="monotone" dataKey="refunds" stroke="#059669" strokeWidth={2} /><Line type="monotone" dataKey="recovery" stroke="#3b82f6" strokeWidth={2} /></LineChart></CardContent>
            </Card>
            <Card className="rle-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Category Return Rate</CardTitle></CardHeader>
              <CardContent><BarChart data={data.categoryReturnRate} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-20} textAnchor="end" height={50} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="rate" fill="#e11d48" radius={[4, 4, 0, 0]} /></BarChart></CardContent>
            </Card>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="rle-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Channel Return Rate Comparison</CardTitle></CardHeader>
              <CardContent><BarChart data={data.channelReturnRate} layout="vertical" height={260}><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" tick={{ fontSize: 10 }} /><YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={100} /><Tooltip /><Bar dataKey="rate" fill="#7c3aed" radius={[0, 4, 4, 0]} /></BarChart></CardContent>
            </Card>
            <Card className="rle-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Cost Savings Breakdown (6-Month)</CardTitle></CardHeader>
              <CardContent><AreaChart data={data.costSavings} height={260}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${(v / 100000).toFixed(0)}L`} /><Tooltip formatter={(v: number) => formatINR(v)} /><Area type="monotone" dataKey="Refund Savings" stackId="a" fill="#e11d48" /><Area type="monotone" dataKey="Recovery Revenue" stackId="a" fill="#059669" /><Area type="monotone" dataKey="Restock Value" stackId="a" fill="#3b82f6" /><Area type="monotone" dataKey="Repair Savings" stackId="a" fill="#d97706" /></AreaChart></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Detail Sheet */}
      <Sheet open={!!sheetOpen && !!selectedReturn} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[420px] sm:w-[540px] overflow-y-auto">
          {selectedReturn && (
            <>
              <SheetHeader>
                <div className="h-2 bg-gradient-to-r from-rose-500 to-emerald-500 rounded-full -mx-6 -mt-6 mb-4" />
                <SheetTitle className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-rose-600" />
                  {selectedReturn.id}
                </SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-2">
                <div className="flex items-center gap-2">
                  <ReturnStatusBadge status={selectedReturn.status} />
                  <ChannelBadge channel={selectedReturn.channel} />
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="text-xs"><span className="text-gray-500">Customer: </span><span className="font-semibold">{selectedReturn.customer}</span></div>
                  <div className="text-xs"><span className="text-gray-500">Phone: </span><span className="font-mono">{selectedReturn.phone}</span></div>
                  <div className="text-xs"><span className="text-gray-500">Address: </span><span className="">{selectedReturn.city} - {selectedReturn.pincode}</span></div>
                  <div className="text-xs"><span className="text-gray-500">SKU: </span><span className="font-mono font-semibold">{selectedReturn.sku}</span></div>
                  <div className="text-xs"><span className="text-gray-500">Category: </span><span>{selectedReturn.category}</span></div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="text-xs"><span className="text-gray-500">Reason: </span></div>
                  <ReturnReasonBadge reason={selectedReturn.reason} />
                  <div className="text-xs mt-2"><span className="text-gray-500">Value: </span><span className="font-bold text-base">{formatINR(selectedReturn.value)}</span></div>
                  <div className="text-xs"><span className="text-gray-500">Pickup Date: </span><span>{selectedReturn.pickupDate}</span></div>
                  <div className="text-xs flex items-center gap-1"><span className="text-gray-500">Processing Age: </span><TATBadge days={selectedReturn.age} /></div>
                </div>
                <Separator />
                <div className="flex gap-2">
                  <Button size="sm" className="text-xs flex-1 bg-rose-600 hover:bg-rose-700" onClick={() => { toast.success("Approved", `Return ${selectedReturn.id} approved`) }}>{selectedReturn.status === "Approved" || selectedReturn.status === "Refunded" ? "Already Approved" : "Approve Return"}</Button>
                  <Button size="sm" className="text-xs flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => { toast.success("Refunded", `Refund initiated for ${selectedReturn.id}`) }}>{selectedReturn.status === "Refunded" ? "Refund Done" : "Process Refund"}</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
