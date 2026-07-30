"use client"

import { useState, useMemo } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast-helper"
import { ExportButton } from "@/components/shared/export-button"
import {
  Ship, FileText, CreditCard, Award, BarChart3, Search, ArrowUpRight, ArrowDownRight,
  Clock, CheckCircle2, AlertTriangle, TrendingUp, Globe, Printer, Send, RefreshCw,
  Download, FileCheck, Shield, Calendar, Building2, Eye, Package,
} from "lucide-react"

// ── Constants & Theme ──
const CC = { teal: "#0d9488", gold: "#d4a017", burgundy: "#8b1a1a", navy: "#1e3a5f", emerald: "#059669", amber: "#d97706", rose: "#e11d48", sky: "#0284c7", cyan: "#06b6d4", orange: "#ea580c", lime: "#65a30d", purple: "#7c3aed", indigo: "#6366f1", slate: "#475569" }
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const sheetGrad = "bg-gradient-to-r from-[#0d9488] to-[#1e3a5f] text-white"
const fmtINR = (v: number) => { if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)}Cr`; if (v >= 100000) return `₹${(v / 100000).toFixed(2)}L`; return `₹${v.toLocaleString("en-IN")}` }
const fmtShort = (v: number) => { if (v >= 10000000) return `₹${(v / 10000000).toFixed(1)}Cr`; if (v >= 100000) return `₹${(v / 100000).toFixed(0)}L`; return `₹${(v / 1000).toFixed(0)}K` }

function seededRandom(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 198198) % 2147483647; return (s & 0x7fffffff) / 0x7fffffff }
}

function generateData() {
  const r = seededRandom(198198198)
  const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(r() * arr.length)]
  const ri = (min: number, max: number) => Math.floor(r() * (max - min + 1)) + min
  const rf = (min: number, max: number) => +(r() * (max - min) + min).toFixed(2)

  const SB_STATUSES = ["Draft", "Submitted", "Customs Cleared", "Under Examination", "Held", "Approved", "Rejected", "Exported"] as const
  const SB_PORTS = ["JNPT Mumbai", "Mundra", "Chennai", "Kolkata", "Cochin", "Visakhapatnam", "Tuticorin", "Kandla", "Ennore", "Nhava Sheva"] as const
  const SB_TYPES = ["Export (Normal)", "Export with Duty Drawback", "Export under Bond", "Export under claim of RoDTEP", "DEPB", "EPCG", "SEZ", "Re-export"] as const
  const LC_TYPES = ["Irrevocable", "Revocable", "Confirmed", "Unconfirmed", "Transferable", "Back-to-Back", "Red Clause", "Standby", "Revolving", "Usance"] as const
  const LC_BANKS = ["SBI", "HDFC", "ICICI", "Bank of Baroda", "PNB", "Canara Bank", "Axis", "UCO", "Indian Bank", "Union Bank"] as const
  const CURRENCIES = ["USD", "EUR", "GBP", "AED", "SGD", "JPY", "AUD", "CAD", "SAR", "CNY", "KRW", "THB", "MYR", "ZAR", "BRL"] as const
  const LC_STATUSES = ["Opened", "Amended", "Advised", "Presented", "Accepted", "Settled", "Closed"] as const
  const AMENDMENT_REASONS = ["Value Change", "Date Extension", "Port Change", "Quantity Change", "Specification Change", "Partial Shipment", "Transshipment", "Document Requirement"] as const
  const INV_STATUSES = ["Draft", "Sent", "Confirmed", "Revised", "Paid", "Disputed", "Cancelled"] as const
  const EXPORTERS = ["Tata Steel Exports", "Reliance Industries", "Infosys Global", "Mahindra Exports", "Wipro Solutions", "Bajaj Auto Intl", "Godrej Consumer", "Dr. Reddy's Pharma", "Asian Paints Global", "L&T Exports"] as const
  const COUNTRIES = ["USA", "UK", "Germany", "UAE", "Singapore", "Japan", "South Korea", "Australia", "Saudi Arabia", "China", "Brazil", "South Africa", "Thailand", "Malaysia", "Canada"] as const
  const PAYMENT_TERMS = ["Advance", "Letter of Credit", "DA (Documents Against Acceptance)", "DP (Documents Against Payment)", "TT (Telegraphic Transfer)", "Open Account", "Consignment", "CAD (Cash Against Documents)"] as const
  const CERT_TYPES = ["Certificate of Origin (COO)", "Phytosanitary Certificate", "FSSAI Health Certificate", "Health Certificate", "Non-Preferential COO", "GSP Certificate", "ARI Certificate", "REB Certificate", "MEIS Certificate", "Quality Certificate"] as const
  const CERT_STATUSES = ["Applied", "Processing", "Approved", "Issued", "Expired", "Rejected"] as const
  const AUTHORITIES = ["DGFT", "FSSAI", "APEDA", "EIC", "Tea Board"] as const

  const shippingBills = Array.from({ length: 75 }, (_, i) => {
    const val = ri(500000, 50000000)
    return {
      id: `SB-${String(1980001 + i).padStart(7, "0")}`,
      sbNo: `SB/${2026}/MUM/${String(ri(100000, 999999))}`,
      type: pick(SB_TYPES), port: pick(SB_PORTS), status: pick(SB_STATUSES),
      exporter: pick(EXPORTERS), destination: pick(COUNTRIES),
      fobValue: val, cifValue: Math.round(val * rf(1.02, 1.18)),
      pkgCount: ri(5, 2000), grossWeight: ri(100, 50000),
      hsCode: `${ri(10, 99)}.${ri(10, 99)}.${ri(10, 99)}`,
      filedDate: `2026-${String(ri(1, 12)).padStart(2, "0")}-${String(ri(1, 28)).padStart(2, "0")}`,
      clearanceDate: r() > 0.3 ? `2026-${String(ri(1, 12)).padStart(2, "0")}-${String(ri(1, 28)).padStart(2, "0")}` : null,
      goodsDesc: pick(["Basmati Rice", "Cotton Yarn", "Pharmaceuticals", "Auto Parts", "Textiles", "Engineering Goods", "Spices", "Chemical Products", "IT Hardware", "Handicrafts"]),
      trend: r() > 0.5 ? "up" as const : "down" as const,
    }
  })

  const lcs = Array.from({ length: 55 }, (_, i) => {
    const cur = pick(CURRENCIES)
    const amt = ri(10000, 5000000)
    const daysToExpiry = ri(2, 120)
    return {
      id: `LC-${String(1980001 + i).padStart(7, "0")}`,
      lcNo: `LC${String(ri(100000, 999999))}`,
      type: pick(LC_TYPES), bank: pick(LC_BANKS), status: pick(LC_STATUSES),
      currency: cur, amount: amt,
      inrEquiv: Math.round(amt * rf(70, 90)),
      applicant: pick(EXPORTERS), beneficiary: pick(["ABC Trading Co.", "Global Imports Ltd", "Pacific Rim Corp", "Euro Trade GmbH", "Dubai Gold LLC", "Singapore Pte Ltd", "London Exports PLC"]),
      openedDate: `2026-${String(ri(1, 12)).padStart(2, "0")}-${String(ri(1, 28)).padStart(2, "0")}`,
      expiryDate: `2026-${String(ri(1, 12)).padStart(2, "0")}-${String(ri(1, 28)).padStart(2, "0")}`,
      daysToExpiry, amendmentReason: r() > 0.7 ? pick(AMENDMENT_REASONS) : null,
      amendmentCount: r() > 0.7 ? ri(1, 5) : 0,
      shipmentPort: pick(SB_PORTS),
    }
  })

  const invoices = Array.from({ length: 65 }, (_, i) => {
    const total = ri(100000, 25000000)
    const paid = r() > 0.4 ? Math.round(total * rf(0.3, 1.0)) : 0
    return {
      id: `INV-EXP-${String(1980001 + i).padStart(7, "0")}`,
      invNo: `EXP/INV/${2026}/${String(ri(10000, 99999))}`,
      exporter: pick(EXPORTERS), destination: pick(COUNTRIES),
      status: pick(INV_STATUSES), paymentTerm: pick(PAYMENT_TERMS),
      invoiceDate: `2026-${String(ri(1, 12)).padStart(2, "0")}-${String(ri(1, 28)).padStart(2, "0")}`,
      dueDate: `2026-${String(ri(1, 12)).padStart(2, "0")}-${String(ri(1, 28)).padStart(2, "0")}`,
      totalAmount: total, paidAmount: paid,
      currency: pick(["INR", "USD", "EUR", "GBP", "AED"] as const),
      lcRef: r() > 0.5 ? pick(lcs).lcNo : null,
      sbRef: pick(shippingBills).sbNo,
      goodsDesc: pick(["Textile Lot", "Steel Coils", "Pharma Batch", "Auto Components", "Rice Consignment", "Chemical Shipment", "IT Equipment", "Spices Export"]),
      hsCode: `${ri(10, 99)}.${ri(10, 99)}.${ri(10, 99)}`,
    }
  })

  const certificates = Array.from({ length: 50 }, (_, i) => {
    const daysToExpiry = ri(0, 365)
    return {
      id: `CERT-${String(1980001 + i).padStart(7, "0")}`,
      certNo: `CRT/${2026}/${pick(AUTHORITIES).slice(0, 2)}/${String(ri(10000, 99999))}`,
      type: pick(CERT_TYPES), status: pick(CERT_STATUSES),
      authority: pick(AUTHORITIES),
      applicant: pick(EXPORTERS), destination: pick(COUNTRIES),
      appliedDate: `2026-${String(ri(1, 12)).padStart(2, "0")}-${String(ri(1, 28)).padStart(2, "0")}`,
      issuedDate: r() > 0.4 ? `2026-${String(ri(1, 12)).padStart(2, "0")}-${String(ri(1, 28)).padStart(2, "0")}` : null,
      expiryDate: r() > 0.3 ? `2026-${String(ri(1, 12)).padStart(2, "0")}-${String(ri(1, 28)).padStart(2, "0")}` : null,
      daysToExpiry,
      goodsDesc: pick(["Basmati Rice", "Organic Spices", "Pharmaceuticals", "Cotton Textiles", "Auto Parts", "Handicrafts", "Tea", "Marine Products"]),
    }
  })

  const monthlyExport = MONTHS.map(m => ({ month: m, value: ri(50000000, 500000000) }))
  const docStatusDist = [
    { name: "Approved", value: ri(40, 80) }, { name: "Pending", value: ri(30, 60) },
    { name: "Rejected", value: ri(5, 20) }, { name: "In Review", value: ri(15, 40) },
  ]
  const portBillData = [...SB_PORTS].slice(0, 8).map(p => ({ port: p.split(" ")[0], count: ri(3, 20) }))
  const lcLifecycle = [
    { name: "Opened", value: ri(5, 15) }, { name: "Advised", value: ri(5, 12) },
    { name: "Presented", value: ri(5, 15) }, { name: "Settled", value: ri(8, 20) },
    { name: "Closed", value: ri(3, 10) },
  ]
  const monthlyDocVolume = MONTHS.map(m => ({ month: m, shipping: ri(10, 50), invoices: ri(15, 60), lcs: ri(5, 25), certs: ri(8, 35) }))
  const rejectionReasons = ["Incomplete docs", "HS code mismatch", "Wrong valuation", "Missing signature", "Expired certificate", "Port discrepancy", "Bank discrepancy", "Quantity mismatch", "Late filing", "Duplicate entry"].map(reason => ({ reason, count: ri(2, 18) }))
  const processingTrend = MONTHS.map(m => ({ month: m, actual: ri(3, 10), target: 5 }))
  const complianceByType = [
    { type: "Shipping Bills", score: ri(80, 98) }, { type: "Commercial Inv", score: ri(75, 95) },
    { type: "LC Docs", score: ri(70, 96) }, { type: "Certificates", score: ri(82, 99) },
    { type: "Insurance", score: ri(78, 97) }, { type: "Customs Docs", score: ri(80, 95) },
  ]
  const portExportValue = [...SB_PORTS].slice(0, 8).map(p => ({ port: p.split(" ")[0], value: ri(100000000, 800000000) }))

  return {
    shippingBills, lcs, invoices, certificates,
    monthlyExport, docStatusDist, portBillData, lcLifecycle,
    monthlyDocVolume, rejectionReasons, processingTrend, complianceByType, portExportValue,
    SB_STATUSES, SB_PORTS, SB_TYPES, LC_TYPES, LC_BANKS, CURRENCIES, LC_STATUSES,
    AMENDMENT_REASONS, INV_STATUSES, EXPORTERS, COUNTRIES, PAYMENT_TERMS,
    CERT_TYPES, CERT_STATUSES, AUTHORITIES,
  }
}

type D = ReturnType<typeof generateData>

// ── Unique Visual Components (outside main, no toast needed here) ──
function SBStatusBadge({ status }: { status: string }) {
  const m: Record<string, string> = {
    Draft: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    Submitted: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
    "Customs Cleared": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    "Under Examination": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    Held: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    Approved: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
    Rejected: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
    Exported: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 font-semibold",
  }
  return <Badge variant="outline" className={cn("edl-sb-badge text-[10px] px-2 py-0.5 border-0", m[status] || "")}>{status}</Badge>
}

function DocProgressTracker({ status }: { status: string }) {
  const stages = ["Draft", "Filed", "Examined", "Assessed", "Cleared", "Shipped"]
  const stageColors = ["#64748b", "#0284c7", "#d97706", "#8b5cf6", "#0d9488", "#059669"]
  const statusMap: Record<string, number> = {
    Draft: 0, Submitted: 1, "Under Examination": 2, Held: 2,
    Approved: 3, "Customs Cleared": 4, Exported: 5, Rejected: -1,
  }
  const idx = statusMap[status] ?? 0
  return (
    <div className="edl-progress-tracker flex items-center gap-0.5">
      {stages.map((s, i) => (
        <div key={s} className="flex items-center gap-0.5">
          <div className={cn("edl-progress-dot w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold border-2 transition-all",
            i < idx ? "border-emerald-500 bg-emerald-500 text-white" :
            i === idx ? (idx < 0 ? "border-rose-400 bg-rose-100 text-rose-600" : "border-transparent") : "border-muted-foreground/30 bg-muted text-muted-foreground"
          )} style={i === idx && idx >= 0 ? { borderColor: stageColors[i], background: stageColors[i], color: "white" } : {}}>
            {i < idx ? "\u2713" : i + 1}
          </div>
          {i < stages.length - 1 && <div className={cn("w-4 h-0.5 transition-all", i < idx ? "bg-emerald-500" : "bg-muted-foreground/20")} />}
        </div>
      ))}
    </div>
  )
}

function ExportValueTile({ value, trend }: { value: number; trend: string }) {
  return (
    <div className="edl-value-tile flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
      <span className="text-sm font-bold text-foreground">{fmtINR(value)}</span>
      {trend === "up" ? <TrendingUp className="h-3.5 w-3.5 text-emerald-500" /> : <ArrowDownRight className="h-3.5 w-3.5 text-rose-500" />}
    </div>
  )
}

function LCStatusRing({ status }: { status: string }) {
  const stages = ["Opened", "Amended", "Advised", "Presented", "Accepted", "Settled", "Closed"]
  const idx = stages.indexOf(status)
  const pct = stages.length > 0 ? ((idx >= 0 ? idx + 1 : 0) / stages.length) * 100 : 0
  const color = pct <= 28 ? CC.emerald : pct <= 57 ? CC.cyan : pct <= 71 ? CC.amber : CC.rose
  const circumference = 2 * Math.PI * 28
  const dashOffset = circumference - (pct / 100) * circumference
  return (
    <div className="edl-lc-ring relative w-16 h-16 flex items-center justify-center">
      <svg className="edl-lc-ring-svg w-16 h-16 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-muted-foreground/20" />
        <circle cx="32" cy="32" r="28" fill="none" stroke={color} strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round" className="edl-lc-ring-arc" />
      </svg>
      <span className="absolute text-[10px] font-bold" style={{ color }}>{pct.toFixed(0)}%</span>
    </div>
  )
}

function CurrencyBadge({ currency }: { currency: string }) {
  const flagColors: Record<string, string> = {
    USD: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    EUR: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    GBP: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    AED: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    SGD: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
    JPY: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    AUD: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
    CAD: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    SAR: "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300",
    CNY: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    KRW: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
    THB: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
    MYR: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
    ZAR: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    BRL: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    INR: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  }
  return <Badge variant="outline" className={cn("edl-currency-badge text-[10px] px-2 py-0.5 border-0 font-mono", flagColors[currency] || "")}>{currency}</Badge>
}

function LCTypeBadge({ type }: { type: string }) {
  const m: Record<string, string> = {
    Irrevocable: "bg-teal-100 text-teal-700", Revocable: "bg-slate-100 text-slate-700",
    Confirmed: "bg-emerald-100 text-emerald-700", Unconfirmed: "bg-amber-100 text-amber-700",
    Transferable: "bg-sky-100 text-sky-700", "Back-to-Back": "bg-indigo-100 text-indigo-700",
    "Red Clause": "bg-rose-100 text-rose-700", Standby: "bg-purple-100 text-purple-700",
    Revolving: "bg-cyan-100 text-cyan-700", Usance: "bg-orange-100 text-orange-700",
  }
  return <Badge variant="outline" className={cn("edl-lc-type-badge text-[10px] px-2 py-0.5 border-0", m[type] || "")}>{type}</Badge>
}

function ExpiryCountdown({ days }: { days: number }) {
  const color = days >= 30 ? "text-emerald-600" : days >= 14 ? "text-amber-600" : days >= 7 ? "text-orange-600" : "text-rose-600"
  const bg = days >= 30 ? "bg-emerald-50 dark:bg-emerald-900/20" : days >= 14 ? "bg-amber-50 dark:bg-amber-900/20" : days >= 7 ? "bg-orange-50 dark:bg-orange-900/20" : "bg-rose-50 dark:bg-rose-900/20"
  return <span className={cn("edl-expiry-countdown text-[10px] font-medium px-2 py-0.5 rounded-full", color, bg)}>{days}d left</span>
}

function InvoiceStatusBadge({ status }: { status: string }) {
  const m: Record<string, string> = {
    Draft: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    Sent: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
    Confirmed: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
    Revised: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    Paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 font-semibold",
    Disputed: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
    Cancelled: "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500",
  }
  return <Badge variant="outline" className={cn("edl-inv-status text-[10px] px-2 py-0.5 border-0", m[status] || "")}>{status}</Badge>
}

function PaymentTermBadge({ term }: { term: string }) {
  const m: Record<string, string> = {
    Advance: "bg-emerald-100 text-emerald-700", "Letter of Credit": "bg-teal-100 text-teal-700",
    "DA (Documents Against Acceptance)": "bg-amber-100 text-amber-700",
    "DP (Documents Against Payment)": "bg-sky-100 text-sky-700",
    "TT (Telegraphic Transfer)": "bg-indigo-100 text-indigo-700",
    "Open Account": "bg-orange-100 text-orange-700",
    Consignment: "bg-purple-100 text-purple-700",
    "CAD (Cash Against Documents)": "bg-rose-100 text-rose-700",
  }
  return <Badge variant="outline" className={cn("edl-pay-term text-[9px] px-1.5 py-0.5 border-0", m[term] || "")}>{term.length > 20 ? term.slice(0, 18) + "..." : term}</Badge>
}

function AmountDueIndicator({ paid, total }: { paid: number; total: number }) {
  const pct = total > 0 ? Math.round((paid / total) * 100) : 0
  const color = pct >= 100 ? CC.emerald : pct >= 50 ? CC.teal : pct > 0 ? CC.amber : CC.rose
  return (
    <div className="edl-amount-due space-y-1">
      <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">Paid</span><span className="font-bold" style={{ color }}>{pct}%</span></div>
      <div className="w-full h-2 rounded bg-muted overflow-hidden"><div className="h-full rounded edl-bar-fill" style={{ width: `${Math.min(pct, 100)}%`, background: color }} /></div>
      <div className="flex justify-between text-[9px] text-muted-foreground"><span>{fmtShort(paid)}</span><span>{fmtShort(total)}</span></div>
    </div>
  )
}

function CertStatusBadge({ status }: { status: string }) {
  const m: Record<string, string> = {
    Applied: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    Processing: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
    Approved: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
    Issued: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    Expired: "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500",
    Rejected: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  }
  return <Badge variant="outline" className={cn("edl-cert-status text-[10px] px-2 py-0.5 border-0", m[status] || "")}>{status}</Badge>
}

function CertExpiryBadge({ days }: { days: number }) {
  const color = days >= 90 ? "text-emerald-600" : days >= 30 ? "text-amber-600" : days >= 7 ? "text-orange-600" : "text-rose-600"
  return (
    <span className={cn("edl-cert-expiry inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted", color)}>
      <Clock className="h-3 w-3" />{days >= 0 ? `${days}d` : "Expired"}
    </span>
  )
}

function AuthorityBadge({ authority }: { authority: string }) {
  const colors: Record<string, string> = {
    DGFT: "bg-navy-100 text-[#1e3a5f] dark:bg-[#1e3a5f]/20 dark:text-teal-300",
    FSSAI: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    APEDA: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    EIC: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
    "Tea Board": "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300",
  }
  return (
    <Badge variant="outline" className={cn("edl-auth-badge text-[10px] px-2 py-0.5 border-0 font-semibold", colors[authority] || "")}>
      <span className="inline-block w-4 h-4 rounded-full bg-current/20 text-center leading-4 mr-1 text-[8px] font-bold">{authority[0]}</span>
      {authority}
    </Badge>
  )
}

// ── Main Component ──
export default function ExportDocumentationLCView() {
  const data = useMemo(() => generateData(), [])
  const [tab, setTab] = useState("0")
  const [drawerData, setDrawerData] = useState<any>(null)
  const [drawerType, setDrawerType] = useState("")
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState<string>("id")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const { toast } = useToast()

  const sortFn = <T extends Record<string, any>>(items: T[], key: string) => {
    const s = [...items].sort((a, b) => { const va = a[key], vb = b[key]; return va < vb ? -1 : va > vb ? 1 : 0 })
    return sortDir === "asc" ? s : s.reverse()
  }

  const SH = ({ label, field }: { label: string; field: string }) => (
    <TableHead className="underline-animated cursor-pointer select-none text-[11px] edl-sort-head" onClick={() => { if (sortBy === field) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortBy(field); setSortDir("asc") } }}>
      <span className="flex items-center gap-1">{label} {sortBy === field && (sortDir === "asc" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />)}</span>
    </TableHead>
  )

  const DrawerH = ({ title, desc, children }: { title: string; desc?: string; children?: React.ReactNode }) => (
    <SheetHeader className={cn("edl-drawer-header rounded-lg p-4 -mx-6 -mt-6 mb-4", sheetGrad)}>
      <SheetTitle className="text-white text-sm">{title}</SheetTitle>
      {desc && <SheetDescription className="text-teal-100 mt-1 text-xs">{desc}</SheetDescription>}
      {children && <SheetDescription className="text-teal-100 flex flex-wrap gap-1.5 mt-1">{children}</SheetDescription>}
    </SheetHeader>
  )

  const InfoG = ({ items }: { items: [string, string][] }) => (
    <div className="grid grid-cols-2 gap-2 text-xs">
      {items.map(([l, v]) => (<div key={l} className="flex justify-between p-1.5 rounded bg-muted/50"><span className="text-muted-foreground">{l}</span><span className="font-medium text-right max-w-[140px] truncate">{v}</span></div>))}
    </div>
  )

  // ── Tab 0: Dashboard ──
  const DashboardTab = () => {
    const activeShipments = data.shippingBills.filter(s => !["Rejected", "Draft"].includes(s.status)).length
    const docsPending = data.shippingBills.filter(s => ["Submitted", "Under Examination"].includes(s.status)).length + data.certificates.filter(c => ["Applied", "Processing"].includes(c.status)).length
    const lcsOpen = data.lcs.filter(l => ["Opened", "Advised", "Presented"].includes(l.status)).length
    const totalExportVal = data.shippingBills.reduce((a, s) => a + s.fobValue, 0)
    const docsToday = 17
    const avgTime = "3.2 days"
    const complianceRate = "94.7%"
    const activeCerts = data.certificates.filter(c => ["Approved", "Issued"].includes(c.status)).length
    const kpis = [
      { label: "Active Shipments", value: activeShipments, icon: Ship, color: "text-[#0d9488]", bg: "bg-teal-50 dark:bg-teal-900/20" },
      { label: "Documents Pending", value: docsPending, icon: FileText, color: "text-[#d4a017]", bg: "bg-amber-50 dark:bg-amber-900/20" },
      { label: "LCs Open", value: lcsOpen, icon: CreditCard, color: "text-[#1e3a5f]", bg: "bg-blue-50 dark:bg-blue-900/20" },
      { label: "Total Export Value", value: fmtINR(totalExportVal), icon: TrendingUp, color: "text-[#059669]", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
      { label: "Docs Processed Today", value: docsToday, icon: CheckCircle2, color: "text-[#0d9488]", bg: "bg-teal-50 dark:bg-teal-900/20" },
      { label: "Avg Processing Time", value: avgTime, icon: Clock, color: "text-[#d4a017]", bg: "bg-amber-50 dark:bg-amber-900/20" },
      { label: "Compliance Rate", value: complianceRate, icon: Award, color: "text-[#059669]", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
      { label: "Active Certificates", value: activeCerts, icon: Shield, color: "text-[#1e3a5f]", bg: "bg-blue-50 dark:bg-blue-900/20" },
    ]
    return (
      <div className="edl-dashboard space-y-4">
        <div className="edl-kpi-grid grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {kpis.map((k, i) => (
            <Card key={k.label} className="inner-glow hover-lift-sm glass-subtle edl-kpi-card border-border/60"><CardContent className="p-3 flex items-center gap-2" style={{ animationDelay: `${i * 50}ms` }}>
              <div className={cn("edl-kpi-icon p-2 rounded-lg", k.bg)}><k.icon className={cn("h-4 w-4", k.color)} /></div>
              <div><p className="text-[9px] text-muted-foreground uppercase tracking-wide leading-tight">{k.label}</p><p className={cn("edl-counter text-sm font-bold", k.color)}>{k.value}</p></div>
            </CardContent></Card>
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover-lift-sm edl-chart-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Export Value</CardTitle></CardHeader><CardContent>
            <ResponsiveContainer width="100%" height={200}><LineChart data={data.monthlyExport}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 9 }} tickFormatter={v => fmtShort(v)} /><Tooltip contentStyle={{ fontSize: 11 }} formatter={(v: number) => fmtINR(v)} />
              <Line type="monotone" dataKey="value" stroke={CC.teal} strokeWidth={2} dot={{ r: 3 }} name="Export Value" />
            </LineChart></ResponsiveContainer>
          </CardContent></Card>
          <Card className="hover-lift-sm edl-chart-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Document Status</CardTitle></CardHeader><CardContent>
            <ResponsiveContainer width="100%" height={200}><PieChart>
              <Pie data={data.docStatusDist} cx="50%" cy="50%" innerRadius={40} outerRadius={75} dataKey="value" paddingAngle={2} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ strokeWidth: 1 }}>
                {[CC.emerald, CC.amber, CC.rose, CC.sky].map((c, i) => <Cell key={i} fill={c} />)}
              </Pie><Tooltip contentStyle={{ fontSize: 11 }} />
            </PieChart></ResponsiveContainer>
          </CardContent></Card>
          <Card className="hover-lift-sm edl-chart-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Shipping Bills by Port</CardTitle></CardHeader><CardContent>
            <ResponsiveContainer width="100%" height={200}><BarChart data={data.portBillData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="port" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 9 }} /><Tooltip contentStyle={{ fontSize: 11 }} />
              <Bar dataKey="count" fill={CC.teal} radius={[4, 4, 0, 0]} name="Bills" />
            </BarChart></ResponsiveContainer>
          </CardContent></Card>
          <Card className="hover-lift-sm edl-chart-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">LC Lifecycle Stages</CardTitle></CardHeader><CardContent>
            <ResponsiveContainer width="100%" height={200}><PieChart>
              <Pie data={data.lcLifecycle} cx="50%" cy="50%" innerRadius={40} outerRadius={75} dataKey="value" paddingAngle={2}>
                {[CC.emerald, CC.cyan, CC.amber, CC.gold, CC.slate].map((c, i) => <Cell key={i} fill={c} />)}
              </Pie><Tooltip contentStyle={{ fontSize: 11 }} /><Legend iconSize={8} wrapperStyle={{ fontSize: 9 }} />
            </PieChart></ResponsiveContainer>
          </CardContent></Card>
        </div>
      </div>
    )
  }

  // ── Tab 1: Shipping Bills ──
  const ShippingBillsTab = () => {
    const rows = sortFn(data.shippingBills.filter(s => {
      if (search && !s.sbNo.toLowerCase().includes(search.toLowerCase()) && !s.id.toLowerCase().includes(search.toLowerCase())) return false
      if (filterStatus !== "all" && s.status !== filterStatus) return false
      return true
    }), sortBy)
    return (
      <div className="edl-sb-tab space-y-4">
        <div className="flex flex-wrap gap-2">
          <Input placeholder="Search SB number..." value={search} onChange={e => setSearch(e.target.value)} className="h-8 text-xs w-60" />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="h-8 text-xs border rounded-md px-2 bg-background"><option value="all">All Status</option>{[...data.SB_STATUSES].map(s => <option key={s}>{s}</option>)}</select>
        </div>
        <div className="rounded-lg border overflow-x-auto max-h-[480px] overflow-y-auto"><Table><TableHeader><TableRow>
          <SH label="SB No." field="sbNo" /><TableHead className="text-[11px]">Exporter</TableHead><SH label="Port" field="port" /><TableHead className="text-[11px]">Type</TableHead><SH label="FOB Value" field="fobValue" /><TableHead className="text-[11px]">Goods</TableHead><TableHead className="text-[11px]">Destination</TableHead><TableHead className="text-[11px]">Filed</TableHead><TableHead className="text-[11px]">Status</TableHead><TableHead className="text-[11px]">Actions</TableHead>
        </TableRow></TableHeader><TableBody>{rows.slice(0, 20).map(s => (
          <TableRow key={s.id} className="edl-sb-row">
            <TableCell className="text-[10px] font-mono font-medium">{s.sbNo}</TableCell>
            <TableCell className="text-[10px]">{s.exporter.split(" ").slice(0, 2).join(" ")}</TableCell>
            <TableCell className="text-[10px]">{s.port.split(" ")[0]}</TableCell>
            <TableCell className="text-[9px] max-w-[100px] truncate">{s.type}</TableCell>
            <TableCell className="numeric-cell text-[10px] font-medium">{fmtShort(s.fobValue)}</TableCell>
            <TableCell className="text-[10px]">{s.goodsDesc}</TableCell>
            <TableCell className="text-[10px]">{s.destination}</TableCell>
            <TableCell className="text-[10px] text-muted-foreground">{s.filedDate}</TableCell>
            <TableCell><SBStatusBadge status={s.status} /></TableCell>
            <TableCell><Button variant="ghost" size="sm" className="press-scale edl-view-btn h-6 text-[10px]" onClick={() => { setDrawerData(s); setDrawerType("sb") }}><Eye className="h-3 w-3 mr-1" />View</Button></TableCell>
          </TableRow>
        ))}</TableBody></Table></div>
        <p className="text-xs text-muted-foreground">Showing {Math.min(20, rows.length)} of {rows.length} shipping bills</p>
      </div>
    )
  }

  // ── Tab 2: Letter of Credit ──
  const LCTab = () => {
    const rows = sortFn(data.lcs.filter(l => {
      if (search && !l.lcNo.toLowerCase().includes(search.toLowerCase()) && !l.id.toLowerCase().includes(search.toLowerCase())) return false
      if (filterStatus !== "all" && l.status !== filterStatus) return false
      return true
    }), sortBy)
    return (
      <div className="edl-lc-tab space-y-4">
        <div className="flex flex-wrap gap-2">
          <Input placeholder="Search LC number..." value={search} onChange={e => setSearch(e.target.value)} className="h-8 text-xs w-60" />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="h-8 text-xs border rounded-md px-2 bg-background"><option value="all">All Status</option>{[...data.LC_STATUSES].map(s => <option key={s}>{s}</option>)}</select>
        </div>
        <div className="rounded-lg border overflow-x-auto max-h-[480px] overflow-y-auto"><Table><TableHeader><TableRow>
          <SH label="LC No." field="lcNo" /><TableHead className="text-[11px]">Type</TableHead><TableHead className="text-[11px]">Bank</TableHead><TableHead className="text-[11px]">Currency</TableHead><SH label="Amount" field="amount" /><TableHead className="text-[11px]">Applicant</TableHead><TableHead className="text-[11px]">Expiry</TableHead><SH label="Days Left" field="daysToExpiry" /><TableHead className="text-[11px]">Status</TableHead><TableHead className="text-[11px]">Actions</TableHead>
        </TableRow></TableHeader><TableBody>{rows.slice(0, 20).map(l => (
          <TableRow key={l.id} className="edl-lc-row">
            <TableCell className="text-[10px] font-mono font-medium">{l.lcNo}</TableCell>
            <TableCell><LCTypeBadge type={l.type} /></TableCell>
            <TableCell className="text-[10px]">{l.bank}</TableCell>
            <TableCell><CurrencyBadge currency={l.currency} /></TableCell>
            <TableCell className="numeric-cell text-[10px] font-medium">{`${l.currency} ${l.amount.toLocaleString()}`}</TableCell>
            <TableCell className="text-[10px] max-w-[100px] truncate">{l.applicant}</TableCell>
            <TableCell className="text-[10px] text-muted-foreground">{l.expiryDate}</TableCell>
            <TableCell><ExpiryCountdown days={l.daysToExpiry} /></TableCell>
            <TableCell><Badge variant="outline" className={cn("text-[10px] px-2 py-0.5", l.status === "Settled" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : l.status === "Closed" ? "bg-slate-100 text-slate-500 border-slate-200" : "bg-sky-100 text-sky-700 border-sky-200")}>{l.status}</Badge></TableCell>
            <TableCell><Button variant="ghost" size="sm" className="press-scale edl-view-btn h-6 text-[10px]" onClick={() => { setDrawerData(l); setDrawerType("lc") }}><Eye className="h-3 w-3 mr-1" />View</Button></TableCell>
          </TableRow>
        ))}</TableBody></Table></div>
        <p className="text-xs text-muted-foreground">Showing {Math.min(20, rows.length)} of {rows.length} LCs</p>
      </div>
    )
  }

  // ── Tab 3: Commercial Invoices ──
  const InvoicesTab = () => {
    const rows = sortFn(data.invoices.filter(inv => {
      if (search && !inv.invNo.toLowerCase().includes(search.toLowerCase()) && !inv.id.toLowerCase().includes(search.toLowerCase())) return false
      if (filterStatus !== "all" && inv.status !== filterStatus) return false
      return true
    }), sortBy)
    return (
      <div className="edl-inv-tab space-y-4">
        <div className="flex flex-wrap gap-2">
          <Input placeholder="Search invoice number..." value={search} onChange={e => setSearch(e.target.value)} className="h-8 text-xs w-60" />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="h-8 text-xs border rounded-md px-2 bg-background"><option value="all">All Status</option>{[...data.INV_STATUSES].map(s => <option key={s}>{s}</option>)}</select>
        </div>
        <div className="rounded-lg border overflow-x-auto max-h-[480px] overflow-y-auto"><Table><TableHeader><TableRow>
          <SH label="Invoice" field="invNo" /><TableHead className="text-[11px]">Exporter</TableHead><TableHead className="text-[11px]">Destination</TableHead><TableHead className="text-[11px]">Payment</TableHead><SH label="Amount" field="totalAmount" /><TableHead className="text-[11px]">Currency</TableHead><TableHead className="text-[11px]">LC Ref</TableHead><TableHead className="text-[11px]">Due Date</TableHead><TableHead className="text-[11px]">Status</TableHead><TableHead className="text-[11px]">Actions</TableHead>
        </TableRow></TableHeader><TableBody>{rows.slice(0, 20).map(inv => (
          <TableRow key={inv.id} className="edl-inv-row">
            <TableCell className="text-[10px] font-mono font-medium">{inv.invNo}</TableCell>
            <TableCell className="text-[10px] max-w-[100px] truncate">{inv.exporter.split(" ").slice(0, 2).join(" ")}</TableCell>
            <TableCell className="text-[10px]">{inv.destination}</TableCell>
            <TableCell><PaymentTermBadge term={inv.paymentTerm} /></TableCell>
            <TableCell className="numeric-cell text-[10px] font-medium">{inv.currency === "INR" ? fmtShort(inv.totalAmount) : `${inv.currency} ${inv.totalAmount.toLocaleString()}`}</TableCell>
            <TableCell className="text-[10px]">{inv.currency}</TableCell>
            <TableCell className="text-[9px] font-mono text-muted-foreground">{inv.lcRef || "—"}</TableCell>
            <TableCell className="text-[10px] text-muted-foreground">{inv.dueDate}</TableCell>
            <TableCell><InvoiceStatusBadge status={inv.status} /></TableCell>
            <TableCell><Button variant="ghost" size="sm" className="press-scale edl-view-btn h-6 text-[10px]" onClick={() => { setDrawerData(inv); setDrawerType("inv") }}><Eye className="h-3 w-3 mr-1" />View</Button></TableCell>
          </TableRow>
        ))}</TableBody></Table></div>
        <p className="text-xs text-muted-foreground">Showing {Math.min(20, rows.length)} of {rows.length} invoices</p>
      </div>
    )
  }

  // ── Tab 4: Certificates & Permits ──
  const CertsTab = () => {
    const rows = data.certificates.filter(c => {
      if (search && !c.certNo.toLowerCase().includes(search.toLowerCase()) && !c.id.toLowerCase().includes(search.toLowerCase())) return false
      if (filterStatus !== "all" && c.status !== filterStatus) return false
      return true
    })
    return (
      <div className="edl-cert-tab space-y-4">
        <div className="flex flex-wrap gap-2">
          <Input placeholder="Search certificate number..." value={search} onChange={e => setSearch(e.target.value)} className="h-8 text-xs w-60" />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="h-8 text-xs border rounded-md px-2 bg-background"><option value="all">All Status</option>{[...data.CERT_STATUSES].map(s => <option key={s}>{s}</option>)}</select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.slice(0, 18).map(c => (
            <Card key={c.id} className="hover-lift-sm edl-cert-card border-border/60 cursor-pointer hover:shadow-md transition-all" onClick={() => { setDrawerData(c); setDrawerType("cert") }}>
              <CardContent className="inner-glow glass-subtle p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div><p className="text-xs font-mono font-medium">{c.certNo}</p><p className="text-[10px] text-muted-foreground mt-0.5">{c.type}</p></div>
                  <CertStatusBadge status={c.status} />
                </div>
                <div className="flex items-center gap-2"><AuthorityBadge authority={c.authority} /></div>
                <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">Applicant</span><span className="font-medium">{c.applicant.split(" ").slice(0, 2).join(" ")}</span></div>
                <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">Destination</span><span>{c.destination}</span></div>
                <div className="flex justify-between text-[10px]"><span className="text-muted-foreground">Goods</span><span>{c.goodsDesc}</span></div>
                <div className="flex justify-between items-center"><span className="text-[10px] text-muted-foreground">Expiry</span>{c.expiryDate ? <CertExpiryBadge days={c.daysToExpiry} /> : <span className="text-[10px] text-muted-foreground">N/A</span>}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Showing {Math.min(18, rows.length)} of {rows.length} certificates</p>
      </div>
    )
  }

  // ── Tab 5: Analytics ──
  const AnalyticsTab = () => {
    const totalDocs = data.shippingBills.length + data.invoices.length + data.lcs.length + data.certificates.length
    const rejectionRate = ((data.rejectionReasons.reduce((a, r) => a + r.count, 0) / totalDocs) * 100).toFixed(1)
    const complianceScore = Math.round(data.complianceByType.reduce((a, c) => a + c.score, 0) / data.complianceByType.length)
    const pendingQueue = data.shippingBills.filter(s => ["Submitted", "Under Examination"].includes(s.status)).length + data.certificates.filter(c => ["Applied", "Processing"].includes(c.status)).length
    const amendmentsRate = ((data.lcs.filter(l => l.amendmentCount > 0).length / data.lcs.length) * 100).toFixed(1)
    const onTimeRate = "92.4%"
    const exportValProcessed = data.shippingBills.reduce((a, s) => a + s.fobValue, 0)
    const cards = [
      { label: "Total Documents", value: totalDocs, icon: FileText, color: "text-[#0d9488]" },
      { label: "Avg Processing Time", value: "3.2 days", icon: Clock, color: "text-[#d4a017]" },
      { label: "Rejection Rate", value: `${rejectionRate}%`, icon: AlertTriangle, color: "text-[#8b1a1a]" },
      { label: "Compliance Score", value: `${complianceScore}%`, icon: Award, color: "text-[#059669]" },
      { label: "Pending Queue", value: pendingQueue, icon: Package, color: "text-[#d4a017]" },
      { label: "Amendments Rate", value: `${amendmentsRate}%`, icon: RefreshCw, color: "text-[#1e3a5f]" },
      { label: "On-Time Rate", value: onTimeRate, icon: CheckCircle2, color: "text-[#0d9488]" },
      { label: "Export Value Processed", value: fmtShort(exportValProcessed), icon: TrendingUp, color: "text-[#059669]" },
    ]
    return (
      <div className="edl-analytics-tab space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {cards.map(c => (
            <Card key={c.label} className="inner-glow hover-lift-sm glass-subtle edl-analytic-card border-border/60"><CardContent className="p-4 flex items-center gap-3">
              <c.icon className={cn("h-5 w-5", c.color)} /><div><p className="text-[10px] text-muted-foreground">{c.label}</p><p className={cn("text-lg font-bold", c.color)}>{c.value}</p></div>
            </CardContent></Card>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="hover-lift-sm edl-chart-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Doc Volume</CardTitle></CardHeader><CardContent>
            <ResponsiveContainer width="100%" height={240}><BarChart data={data.monthlyDocVolume}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 9 }} /><Tooltip contentStyle={{ fontSize: 11 }} /><Legend iconSize={8} wrapperStyle={{ fontSize: 9 }} />
              <Bar dataKey="shipping" stackId="a" fill={CC.teal} name="Shipping Bills" /><Bar dataKey="invoices" stackId="a" fill={CC.gold} name="Invoices" /><Bar dataKey="lcs" stackId="a" fill={CC.navy} name="LCs" /><Bar dataKey="certs" stackId="a" fill={CC.burgundy} name="Certificates" />
            </BarChart></ResponsiveContainer>
          </CardContent></Card>
          <Card className="hover-lift-sm edl-chart-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Rejection by Reason</CardTitle></CardHeader><CardContent>
            <ResponsiveContainer width="100%" height={240}><BarChart data={data.rejectionReasons} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis type="number" tick={{ fontSize: 9 }} /><YAxis type="category" dataKey="reason" tick={{ fontSize: 8 }} width={110} /><Tooltip contentStyle={{ fontSize: 11 }} />
              <Bar dataKey="count" fill={CC.burgundy} radius={[0, 4, 4, 0]} name="Rejections" />
            </BarChart></ResponsiveContainer>
          </CardContent></Card>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="hover-lift-sm edl-chart-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Processing Time Trend</CardTitle></CardHeader><CardContent>
            <ResponsiveContainer width="100%" height={220}><AreaChart data={data.processingTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 9 }} unit="d" /><Tooltip contentStyle={{ fontSize: 11 }} /><Legend iconSize={8} wrapperStyle={{ fontSize: 9 }} />
              <Area type="monotone" dataKey="actual" stroke={CC.teal} fill={CC.teal} fillOpacity={0.15} name="Actual Days" />
              <Line type="monotone" dataKey="target" stroke={CC.rose} strokeDasharray="5 5" strokeWidth={2} dot={false} name="Target (5d)" />
            </AreaChart></ResponsiveContainer>
          </CardContent></Card>
          <Card className="hover-lift-sm edl-chart-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Compliance by Doc Type</CardTitle></CardHeader><CardContent>
            <ResponsiveContainer width="100%" height={220}><RadarChart data={data.complianceByType}>
              <PolarGrid stroke="#e5e7eb" /><PolarAngleAxis dataKey="type" tick={{ fontSize: 8 }} /><PolarRadiusAxis tick={{ fontSize: 8 }} domain={[60, 100]} />
              <Radar name="Compliance %" dataKey="score" stroke={CC.teal} fill={CC.teal} fillOpacity={0.2} />
            </RadarChart></ResponsiveContainer>
          </CardContent></Card>
        </div>
        <Card className="hover-lift-sm edl-chart-card border-border/60"><CardHeader className="pb-2"><CardTitle className="text-sm">Port-wise Export Value</CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={200}><BarChart data={data.portExportValue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="port" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 9 }} tickFormatter={v => fmtShort(v)} /><Tooltip contentStyle={{ fontSize: 11 }} formatter={(v: number) => fmtINR(v)} />
            <Bar dataKey="value" fill={CC.navy} radius={[4, 4, 0, 0]} name="Export Value" />
          </BarChart></ResponsiveContainer>
        </CardContent></Card>
      </div>
    )
  }

  const open = !!drawerData
  const close = () => setDrawerData(null)

  return (
    <div className="edl-root space-y-4">
      <PageHeader title="Export Documentation & LC Management" description="Manage shipping bills, letters of credit, commercial invoices, export certificates and documentation analytics" />
      <Tabs value={tab} onValueChange={v => { setTab(v); setSearch(""); setFilterStatus("all") }}>
        <TabsList className="flex-wrap h-auto gap-1">
          {[{ v: "0", l: "Export Dashboard" }, { v: "1", l: "Shipping Bills" }, { v: "2", l: "Letter of Credit" }, { v: "3", l: "Commercial Invoices" }, { v: "4", l: "Certificates & Permits" }, { v: "5", l: "Documentation Analytics" }].map(t => <TabsTrigger key={t.v} value={t.v} className="edl-tab-trigger text-xs h-7 px-3">{t.l}</TabsTrigger>)}
        </TabsList>
      </Tabs>
      {tab === "0" && <DashboardTab />}
      {tab === "1" && <ShippingBillsTab />}
      {tab === "2" && <LCTab />}
      {tab === "3" && <InvoicesTab />}
      {tab === "4" && <CertsTab />}
      {tab === "5" && <AnalyticsTab />}

      {/* Shipping Bill Drawer */}
      <Sheet open={open && drawerType === "sb"} onOpenChange={close}><SheetContent className="edl-sb-drawer w-full sm:max-w-md overflow-y-auto">
        {drawerData && <><DrawerH title={drawerData.sbNo} desc={`${drawerData.id} | ${drawerData.exporter}`}>
          <SBStatusBadge status={drawerData.status} /><Badge className="badge-interactive bg-white/20 text-white text-[10px] border-0">{drawerData.port}</Badge>
        </DrawerH>
        <div className="space-y-4 px-1">
          <Card className="inner-glow hover-lift-sm glass-subtle border-border/60"><CardContent className="p-3"><p className="text-[10px] text-muted-foreground mb-2">Progress</p><DocProgressTracker status={drawerData.status} /></CardContent></Card>
          <Card className="inner-glow hover-lift-sm glass-subtle border-border/60"><CardContent className="p-3"><p className="text-[10px] text-muted-foreground mb-1">FOB Value</p><ExportValueTile value={drawerData.fobValue} trend={drawerData.trend} /></CardContent></Card>
          <InfoG items={[["Type", drawerData.type], ["Port", drawerData.port], ["Destination", drawerData.destination], ["Goods", drawerData.goodsDesc], ["HS Code", drawerData.hsCode], ["Pkg Count", String(drawerData.pkgCount)], ["Gross Weight", `${drawerData.grossWeight} kg`], ["CIF Value", fmtINR(drawerData.cifValue)], ["Filed Date", drawerData.filedDate], ["Clearance Date", drawerData.clearanceDate || "Pending"]] } />
          <div className="flex gap-2 pt-2">
            {[{ label: "Verify", icon: CheckCircle2 }, { label: "Print", icon: Printer }, { label: "Submit", icon: Send }].map(a => (
              <Button key={a.label} variant="outline" size="sm" className="press-scale btn-outline-animate edl-action-btn flex-1 text-xs h-8" onClick={() => toast.success(a.label, `${drawerData.sbNo} ${a.label.toLowerCase()} triggered`)}><a.icon className="h-3 w-3 mr-1" />{a.label}</Button>
            ))}
          </div>
        </div></>}
      </SheetContent></Sheet>

      {/* LC Drawer */}
      <Sheet open={open && drawerType === "lc"} onOpenChange={close}><SheetContent className="edl-lc-drawer w-full sm:max-w-md overflow-y-auto">
        {drawerData && <><DrawerH title={drawerData.lcNo} desc={`${drawerData.id} | ${drawerData.bank}`}>
          <LCTypeBadge type={drawerData.type} /><CurrencyBadge currency={drawerData.currency} /><ExpiryCountdown days={drawerData.daysToExpiry} />
        </DrawerH>
        <div className="space-y-4 px-1">
          <div className="flex items-center justify-center"><LCStatusRing status={drawerData.status} /></div>
          <Card className="inner-glow hover-lift-sm glass-subtle border-border/60"><CardContent className="p-3"><p className="text-[10px] text-muted-foreground mb-1">Amount (INR Equiv)</p><ExportValueTile value={drawerData.inrEquiv} trend="up" /></CardContent></Card>
          <div className="grid grid-cols-3 gap-3">
            {[{ label: "Amount", value: `${drawerData.currency} ${drawerData.amount.toLocaleString()}` }, { label: "Amendments", value: String(drawerData.amendmentCount) }, { label: "Port", value: drawerData.shipmentPort.split(" ")[0] }].map(m => (
              <Card key={m.label} className="inner-glow hover-lift-sm glass-subtle border-border/60"><CardContent className="p-3 text-center"><p className="text-[10px] text-muted-foreground">{m.label}</p><p className="text-sm font-bold text-teal-700 dark:text-teal-300">{m.value}</p></CardContent></Card>
            ))}
          </div>
          <InfoG items={[["Applicant", drawerData.applicant], ["Beneficiary", drawerData.beneficiary], ["Bank", drawerData.bank], ["Type", drawerData.type], ["Opened", drawerData.openedDate], ["Expiry", drawerData.expiryDate], ["Amendment Reason", drawerData.amendmentReason || "N/A"], ["Status", drawerData.status]]} />
          <div className="flex gap-2 pt-2">
            {[{ label: "Amend", icon: RefreshCw }, { label: "Present", icon: Send }, { label: "Close", icon: CheckCircle2 }].map(a => (
              <Button key={a.label} variant="outline" size="sm" className="press-scale btn-outline-animate edl-action-btn flex-1 text-xs h-8" onClick={() => toast.success(a.label, `${drawerData.lcNo} ${a.label.toLowerCase()} triggered`)}><a.icon className="h-3 w-3 mr-1" />{a.label}</Button>
            ))}
          </div>
        </div></>}
      </SheetContent></Sheet>

      {/* Invoice Drawer */}
      <Sheet open={open && drawerType === "inv"} onOpenChange={close}><SheetContent className="edl-inv-drawer w-full sm:max-w-md overflow-y-auto">
        {drawerData && <><DrawerH title={drawerData.invNo} desc={`${drawerData.id} | ${drawerData.exporter}`}>
          <InvoiceStatusBadge status={drawerData.status} /><PaymentTermBadge term={drawerData.paymentTerm} />
        </DrawerH>
        <div className="space-y-4 px-1">
          <Card className="inner-glow hover-lift-sm glass-subtle border-border/60"><CardContent className="p-3"><p className="text-[10px] text-muted-foreground mb-1">Payment Status</p><AmountDueIndicator paid={drawerData.paidAmount} total={drawerData.totalAmount} /></CardContent></Card>
          <div className="grid grid-cols-3 gap-3">
            {[{ label: "Total", value: drawerData.currency === "INR" ? fmtINR(drawerData.totalAmount) : `${drawerData.currency} ${drawerData.totalAmount.toLocaleString()}` }, { label: "Paid", value: fmtINR(drawerData.paidAmount) }, { label: "Balance", value: fmtINR(drawerData.totalAmount - drawerData.paidAmount) }].map(m => (
              <Card key={m.label} className="inner-glow hover-lift-sm glass-subtle border-border/60"><CardContent className="p-3 text-center"><p className="text-[10px] text-muted-foreground">{m.label}</p><p className="text-sm font-bold text-amber-700 dark:text-amber-300">{m.value}</p></CardContent></Card>
            ))}
          </div>
          <InfoG items={[["Exporter", drawerData.exporter], ["Destination", drawerData.destination], ["Currency", drawerData.currency], ["LC Reference", drawerData.lcRef || "None"], ["SB Reference", drawerData.sbRef], ["Goods", drawerData.goodsDesc], ["HS Code", drawerData.hsCode], ["Invoice Date", drawerData.invoiceDate], ["Due Date", drawerData.dueDate], ["Payment Term", drawerData.paymentTerm]]} />
          <div className="flex gap-2 pt-2">
            {[{ label: "Send", icon: Send }, { label: "Revise", icon: RefreshCw }, { label: "Record Payment", icon: CheckCircle2 }].map(a => (
              <Button key={a.label} variant="outline" size="sm" className="press-scale btn-outline-animate edl-action-btn flex-1 text-xs h-8" onClick={() => toast.success(a.label, `${drawerData.invNo} ${a.label.toLowerCase()} triggered`)}><a.icon className="h-3 w-3 mr-1" />{a.label}</Button>
            ))}
          </div>
        </div></>}
      </SheetContent></Sheet>

      {/* Certificate Drawer */}
      <Sheet open={open && drawerType === "cert"} onOpenChange={close}><SheetContent className="edl-cert-drawer w-full sm:max-w-md overflow-y-auto">
        {drawerData && <><DrawerH title={drawerData.certNo} desc={`${drawerData.id} | ${drawerData.type}`}>
          <CertStatusBadge status={drawerData.status} /><CertExpiryBadge days={drawerData.daysToExpiry} /><AuthorityBadge authority={drawerData.authority} />
        </DrawerH>
        <div className="space-y-4 px-1">
          <InfoG items={[["Type", drawerData.type], ["Authority", drawerData.authority], ["Applicant", drawerData.exporter], ["Destination", drawerData.destination], ["Goods", drawerData.goodsDesc], ["Applied", drawerData.appliedDate], ["Issued", drawerData.issuedDate || "Pending"], ["Expiry", drawerData.expiryDate || "N/A"], ["Status", drawerData.status]]} />
          <div className="flex gap-2 pt-2">
            {[{ label: "Download", icon: Download }, { label: "Apply", icon: Send }, { label: "Renew", icon: RefreshCw }].map(a => (
              <Button key={a.label} variant="outline" size="sm" className="press-scale btn-outline-animate edl-action-btn flex-1 text-xs h-8" onClick={() => toast.success(a.label, `${drawerData.certNo} ${a.label.toLowerCase()} triggered`)}><a.icon className="h-3 w-3 mr-1" />{a.label}</Button>
            ))}
          </div>
        </div></>}
      </SheetContent></Sheet>
    </div>
  )
}