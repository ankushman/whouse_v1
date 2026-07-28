"use client"
import { useState, useMemo } from "react"
import {
  BarChart, Bar, AreaChart, Area, ComposedChart, Line, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search, TrendingUp, TrendingDown, Minus, ArrowUpDown, Filter,
  X, ChevronRight, Clock, MapPin, Star, AlertTriangle, CheckCircle2,
  FileText, IndianRupee, Award, Users, BarChart3, Target, Zap,
  ShieldCheck, ShieldAlert, ThumbsUp, ThumbsDown, Eye, Download,
  RefreshCw, ArrowUpRight, ArrowDownRight, Globe, Building, Truck,
  PackageCheck, Timer, DollarSign, Percent, CircleDot, SquareStack,
  CalendarRange,
} from "lucide-react"

// ─── Seed & Helpers ──────────────────────────────────────
function seededRandom(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  s = (s * 16807) % 2147483647
  return (s - 1) / 2147483646
}
const pick = <T,>(arr: T[], seed: number) => arr[Math.floor(seededRandom(seed) * arr.length)]
const ri = (min: number, max: number, seed: number) => Math.floor(seededRandom(seed) * (max - min + 1)) + min
const rf = (min: number, max: number, seed: number) => +(seededRandom(seed) * (max - min) + min).toFixed(2)
const formatINR = (n: number) => n >= 10000000 ? `₹${(n / 10000000).toFixed(2)} Cr` : n >= 100000 ? `₹${(n / 100000).toFixed(2)} L` : `₹${n.toLocaleString("en-IN")}`
const formatPct = (n: number) => `${n.toFixed(1)}%`

// ─── Enums (returned from generateData) ───────────────────
const VENDOR_NAMES = [
  "Delhivery Logistics", "BlueDart Express", "DTDC Express", "Ecom Express",
  "XpressBees", "Shadowfax", "Spoton Logistics", "Ekart Logistics",
  "Delivree Partner", "Shiprocket Fulfillment", "NimbusPost", "Pickrr",
  "Rivigo", "BlackBuck", "Lalamove India", "Porter Logistics",
  "Moovo Fleet", "ElasticRun", "Loadshare Networks", "LetsTransport",
] as const
const WAREHOUSES = [
  "Mumbai Hub", "Delhi NCR Hub", "Bengaluru DC", "Chennai DC",
  "Hyderabad DC", "Pune Warehouse", "Kolkata Hub", "Ahmedabad DC",
] as const
const ZONES = ["West", "North", "South", "South", "West", "West", "East", "West"] as const
const SERVICE_TYPES = [
  "Fulfillment", "Last Mile Delivery", "First Mile Pickup", "Cross-Dock",
  "Express Delivery", "Economy Delivery", "Cold Chain", "Bulk Transport",
  "Warehousing", "Value-Added Services",
] as const
const CATEGORIES = [
  "On-Time Delivery", "Order Accuracy", "Damage Rate", "Cost Efficiency",
  "Customer Satisfaction", " responsiveness", "Documentation Quality", "Compliance",
] as const
const SLA_CATEGORIES = [
  "Delivery SLA", "Pickup SLA", "Processing SLA", "Quality SLA",
  "Response SLA", "Reporting SLA",
] as const
const CONTRACT_STATUSES = [
  "Active", "Under Review", "Expiring Soon", "Renewed", "Terminated", "Pending Signature",
] as const
const RATING_TIERS = ["Platinum", "Gold", "Silver", "Bronze", "At Risk"] as const
const RATING_COLORS: Record<string, string> = {
  Platinum: "#7c3aed", Gold: "#d97706", Silver: "#6b7280", Bronze: "#b45309", "At Risk": "#dc2626",
}

// ─── Types ────────────────────────────────────────────────
interface VendorScorecard {
  id: string; vendor: string; zone: string; service: string; warehouse: string;
  overallScore: number; deliveryRating: number; accuracyRating: number;
  costRating: number; satisfactionRating: number; complianceRating: number;
  tier: string; onTimePct: number; damagePct: number; returnPct: number;
  avgCostPerOrder: number; totalShipments: number; totalRevenue: number;
  contractStart: string; contractEnd: string; trend: number; isPreferred: boolean;
}
interface SLARecord {
  id: string; vendor: string; category: string; targetPct: number; actualPct: number;
  breachCount: number; penaltyAmount: number; period: string; zone: string;
  status: string; slaId: string;
}
interface CostRecord {
  id: string; vendor: string; service: string; warehouse: string; zone: string;
  baseCost: number; fuelSurcharge: number; handlingCost: number; insuranceCost: number;
  techFee: number; totalCost: number; costPerUnit: number; volume: number;
  period: string; savingsVsLastYear: number; budgetVariance: number;
}
interface Contract {
  id: string; vendor: string; service: string; warehouse: string;
  startDate: string; endDate: string; value: number; status: string;
  autoRenew: boolean; noticePeriod: string; paymentTerms: string;
  penaltyClause: string; performanceBonus: number; slaGuarantee: number;
}
interface Benchmark {
  id: string; vendor: string; metric: string; ourScore: number;
  industryAvg: number; bestInClass: number; peerAvg: number;
  percentile: number; trend: string; period: string;
}

// ─── Data Generation ─────────────────────────────────────
function generateData() {
  const vendors: VendorScorecard[] = []
  for (let i = 0; i < 80; i++) {
    const seed = i * 137 + 42
    const delivery = rf(70, 99.5, seed); const accuracy = rf(85, 99.9, seed + 1)
    const cost = rf(60, 98, seed + 2); const satisfaction = rf(65, 99, seed + 3)
    const compliance = rf(75, 100, seed + 4)
    const overall = +((delivery * 0.3 + accuracy * 0.25 + cost * 0.15 + satisfaction * 0.15 + compliance * 0.15)).toFixed(1)
    const tier = overall >= 95 ? "Platinum" : overall >= 88 ? "Gold" : overall >= 78 ? "Silver" : overall >= 65 ? "Bronze" : "At Risk"
    vendors.push({
      id: `TPL-V-${String(i + 1).padStart(4, "0")}`,
      vendor: VENDOR_NAMES[i % VENDOR_NAMES.length],
      zone: ZONES[i % ZONES.length],
      service: pick([...SERVICE_TYPES], seed + 5) as string,
      warehouse: WAREHOUSES[i % WAREHOUSES.length],
      overallScore: overall, deliveryRating: delivery, accuracyRating: accuracy,
      costRating: cost, satisfactionRating: satisfaction, complianceRating: compliance,
      tier, onTimePct: delivery, damagePct: rf(0.1, 5, seed + 6),
      returnPct: rf(0.5, 8, seed + 7),
      avgCostPerOrder: ri(45, 320, seed + 8),
      totalShipments: ri(500, 50000, seed + 9),
      totalRevenue: ri(500000, 80000000, seed + 10),
      contractStart: `2024-${String(ri(1, 12, seed + 11)).padStart(2, "0")}-01`,
      contractEnd: `2026-${String(ri(1, 12, seed + 12)).padStart(2, "0")}-30`,
      trend: [-3, -2, -1, 0, 1, 2, 3, 4, 5][Math.floor(seededRandom(seed + 13) * 9)] as number,
      isPreferred: seededRandom(seed + 14) > 0.7,
    })
  }
  const slaRecords: SLARecord[] = []
  for (let i = 0; i < 70; i++) {
    const seed = i * 199 + 77
    const target = rf(95, 99.5, seed)
    const actual = rf(80, 100, seed + 1)
    slaRecords.push({
      id: `TPL-SLA-${String(i + 1).padStart(4, "0")}`,
      vendor: VENDOR_NAMES[i % VENDOR_NAMES.length],
      category: SLA_CATEGORIES[i % SLA_CATEGORIES.length] as string,
      targetPct: target, actualPct: actual,
      breachCount: actual < target ? ri(1, 25, seed + 2) : 0,
      penaltyAmount: actual < target ? ri(5000, 500000, seed + 3) : 0,
      period: `Q${ri(1, 4, seed + 4)} 2025`,
      zone: ZONES[i % ZONES.length],
      status: actual >= target ? "Met" : actual >= target - 2 ? "At Risk" : "Breached",
      slaId: `SLA-${ri(1000, 9999, seed + 5)}`,
    })
  }
  const costs: CostRecord[] = []
  for (let i = 0; i < 55; i++) {
    const seed = i * 223 + 99
    const base = ri(200000, 5000000, seed)
    const fuel = Math.round(base * rf(0.05, 0.2, seed + 1))
    const handling = Math.round(base * rf(0.03, 0.12, seed + 2))
    const insurance = Math.round(base * rf(0.01, 0.05, seed + 3))
    const tech = Math.round(base * rf(0.02, 0.08, seed + 4))
    const total = base + fuel + handling + insurance + tech
    costs.push({
      id: `TPL-COST-${String(i + 1).padStart(4, "0")}`,
      vendor: VENDOR_NAMES[i % VENDOR_NAMES.length],
      service: pick([...SERVICE_TYPES], seed + 5) as string,
      warehouse: WAREHOUSES[i % WAREHOUSES.length],
      zone: ZONES[i % ZONES.length],
      baseCost: base, fuelSurcharge: fuel, handlingCost: handling,
      insuranceCost: insurance, techFee: tech, totalCost: total,
      costPerUnit: ri(20, 350, seed + 6),
      volume: ri(1000, 100000, seed + 7),
      period: `2025-${String(ri(1, 12, seed + 8)).padStart(2, "0")}`,
      savingsVsLastYear: rf(-10, 25, seed + 9),
      budgetVariance: rf(-15, 10, seed + 10),
    })
  }
  const contracts: Contract[] = []
  for (let i = 0; i < 40; i++) {
    const seed = i * 311 + 55
    const status = [...CONTRACT_STATUSES][Math.floor(seededRandom(seed) * CONTRACT_STATUSES.length)] as string
    contracts.push({
      id: `TPL-CON-${String(i + 1).padStart(4, "0")}`,
      vendor: VENDOR_NAMES[i % VENDOR_NAMES.length],
      service: pick([...SERVICE_TYPES], seed + 1) as string,
      warehouse: WAREHOUSES[i % WAREHOUSES.length],
      startDate: `2024-${String(ri(1, 12, seed + 2)).padStart(2, "0")}-01`,
      endDate: `2026-${String(ri(1, 12, seed + 3)).padStart(2, "0")}-30`,
      value: ri(1000000, 500000000, seed + 4),
      status,
      autoRenew: seededRandom(seed + 5) > 0.5,
      noticePeriod: ["30 Days", "60 Days", "90 Days"][Math.floor(seededRandom(seed + 6) * 3)] as string,
      paymentTerms: ["Net 30", "Net 45", "Net 60", "Net 90"][Math.floor(seededRandom(seed + 7) * 4)] as string,
      penaltyClause: ["5% of invoice", "2% per day delay", "₹50K per breach", "Tiered penalty"][Math.floor(seededRandom(seed + 8) * 4)] as string,
      performanceBonus: ri(50000, 2000000, seed + 9),
      slaGuarantee: rf(90, 99, seed + 10),
    })
  }
  const benchmarks: Benchmark[] = []
  for (let i = 0; i < 60; i++) {
    const seed = i * 373 + 88
    const ourScore = rf(65, 98, seed)
    const industryAvg = ourScore - rf(2, 12, seed + 1)
    const bestInClass = ourScore + rf(1, 8, seed + 2)
    const peerAvg = ourScore - rf(1, 8, seed + 3)
    const percentile = ri(15, 98, seed + 4)
    benchmarks.push({
      id: `TPL-BM-${String(i + 1).padStart(4, "0")}`,
      vendor: VENDOR_NAMES[i % VENDOR_NAMES.length],
      metric: [...CATEGORIES][Math.floor(seededRandom(seed + 5) * CATEGORIES.length)] as string,
      ourScore, industryAvg: +industryAvg.toFixed(1),
      bestInClass: +bestInClass.toFixed(1), peerAvg: +peerAvg.toFixed(1),
      percentile, trend: ["improving", "stable", "declining"][Math.floor(seededRandom(seed + 6) * 3)] as string,
      period: `Q${ri(1, 4, seed + 7)} 2025`,
    })
  }
  const monthlyTrend = Array.from({ length: 12 }, (_, i) => {
    const seed = i * 47 + 100
    return {
      month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
      avgScore: rf(82, 96, seed),
      totalShipments: ri(80000, 200000, seed + 1),
      totalCost: ri(50000000, 150000000, seed + 2),
      slaBreachCount: ri(3, 30, seed + 3),
      onTimePct: rf(88, 98, seed + 4),
      costPerShipment: ri(120, 350, seed + 5),
    }
  })
  const vendorDistribution = RATING_TIERS.map(tier => ({
    tier,
    count: vendors.filter(v => v.tier === tier).length,
    color: RATING_COLORS[tier],
  }))
  const servicePerformance = SERVICE_TYPES.slice(0, 8).map(svc => {
    const seed = svc.length * 31
    const matching = vendors.filter(v => v.service === svc)
    return {
      service: svc,
      avgScore: matching.length ? +(matching.reduce((a, b) => a + b.overallScore, 0) / matching.length).toFixed(1) : rf(75, 95, seed),
      avgCost: ri(80, 300, seed + 1),
      volume: ri(5000, 80000, seed + 2),
    }
  })
  const zoneComparison = WAREHOUSES.map((wh, idx) => {
    const seed = idx * 61 + 200
    const matching = vendors.filter(v => v.warehouse === wh)
    return {
      warehouse: wh,
      delivery: matching.length ? +(matching.reduce((a, b) => a + b.deliveryRating, 0) / matching.length).toFixed(1) : rf(85, 97, seed),
      accuracy: matching.length ? +(matching.reduce((a, b) => a + b.accuracyRating, 0) / matching.length).toFixed(1) : rf(88, 99, seed + 1),
      cost: matching.length ? +(matching.reduce((a, b) => a + b.costRating, 0) / matching.length).toFixed(1) : rf(70, 95, seed + 2),
      satisfaction: matching.length ? +(matching.reduce((a, b) => a + b.satisfactionRating, 0) / matching.length).toFixed(1) : rf(78, 96, seed + 3),
      compliance: matching.length ? +(matching.reduce((a, b) => a + b.complianceRating, 0) / matching.length).toFixed(1) : rf(80, 99, seed + 4),
    }
  })
  const costBreakdownData = [
    { component: "Base Freight", value: 55, color: "#0d9488" },
    { component: "Fuel Surcharge", value: 15, color: "#e11d48" },
    { component: "Handling", value: 12, color: "#6366f1" },
    { component: "Insurance", value: 8, color: "#f59e0b" },
    { component: "Tech Fee", value: 6, color: "#10b981" },
    { component: "Miscellaneous", value: 4, color: "#8b5cf6" },
  ]
  return {
    vendors, slaRecords, costs, contracts, benchmarks, monthlyTrend,
    vendorDistribution, servicePerformance, zoneComparison, costBreakdownData,
    VENDOR_NAMES, WAREHOUSES, ZONES, SERVICE_TYPES, CATEGORIES, SLA_CATEGORIES,
    CONTRACT_STATUSES, RATING_TIERS, RATING_COLORS,
  }
}

const data = generateData()

// ─── Helper Components ───────────────────────────────────
function FieldGrid({ fields }: { fields: { label: string; value: string; icon?: React.ReactNode }[] }) {
  return (
    <div className="tpl-drawer-field-grid">
      {fields.map((f, i) => (
        <div key={i} className="tpl-drawer-field">
          <span className="tpl-drawer-field-label">{f.icon}{f.label}</span>
          <span className="tpl-drawer-field-value">{f.value}</span>
        </div>
      ))}
    </div>
  )
}
function MetricsRow({ metrics }: { metrics: { label: string; value: string; trend?: string; color: string }[] }) {
  return (
    <div className="tpl-drawer-metrics-row">
      {metrics.map((m, i) => (
        <div key={i} className={`tpl-drawer-metric-card tpl-metric-${m.color}`}>
          <span className="tpl-drawer-metric-label">{m.label}</span>
          <span className="tpl-drawer-metric-value">{m.value}</span>
          {m.trend && (
            <span className={`tpl-drawer-metric-trend ${m.trend.startsWith("+") ? "tpl-trend-up" : m.trend.startsWith("-") ? "tpl-trend-down" : ""}`}>
              {m.trend}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
function TierBadge({ tier }: { tier: string }) {
  const colors: Record<string, string> = {
    Platinum: "tpl-tier-platinum", Gold: "tpl-tier-gold", Silver: "tpl-tier-silver",
    Bronze: "tpl-tier-bronze", "At Risk": "tpl-tier-atrisk",
  }
  return <span className={`tpl-tier-badge ${colors[tier] || ""}`}>{tier}</span>
}
function ScoreRing({ score, size = 60 }: { score: number; size?: number }) {
  const r = (size - 8) / 2; const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 90 ? "#0d9488" : score >= 75 ? "#6366f1" : score >= 60 ? "#f59e0b" : "#e11d48"
  return (
    <svg width={size} height={size} className="tpl-score-ring">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth="4" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central"
        fontSize="14" fontWeight="700" fill={color}>{score}</text>
    </svg>
  )
}
function StarRating({ rating }: { rating: number }) {
  const stars = Math.round(rating / 20)
  return (
    <span className="tpl-star-rating">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={14} className={i < stars ? "tpl-star-filled" : "tpl-star-empty"} />
      ))}
      <span className="tpl-star-value">{rating.toFixed(0)}%</span>
    </span>
  )
}
function ProgressBar({ value, max, color = "#0d9488", label }: { value: number; max: number; color?: string; label: string }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="tpl-progress-bar-container">
      <span className="tpl-progress-label">{label}</span>
      <div className="tpl-progress-bar-track">
        <div className="tpl-progress-bar-fill" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="tpl-progress-value">{formatPct(pct)}</span>
    </div>
  )
}

// ─── Sort Helper ──────────────────────────────────────────
function sortBy(arr: any[], key: string, dir: "asc" | "desc"): any[] {
  return [...arr].sort((a, b) => {
    const va = a[key]; const vb = b[key]
    if (typeof va === "number" && typeof vb === "number") return dir === "asc" ? va - vb : vb - va
    return dir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
  })
}

// ─── Drawers ───────────────────────────────────────────────
function VendorDrawer({ v, onClose }: { v: any; onClose: () => void }) {
  return (
    <>
      <div className="tpl-drawer-overlay" onClick={onClose} />
      <div className="tpl-drawer-panel">
        <div className="tpl-drawer-header">
          <div className="tpl-drawer-header-info">
            <h3 className="tpl-drawer-title">{v.vendor}</h3>
            <div className="tpl-drawer-subtitle">
              <MapPin size={13} /> {v.warehouse} · {v.zone} Zone
              {v.isPreferred && <Badge className="tpl-preferred-badge"><Award size={12} /> Preferred</Badge>}
            </div>
          </div>
          <button onClick={onClose} className="tpl-drawer-close"><X size={18} /></button>
        </div>
        <div className="tpl-drawer-body">
          <div className="tpl-drawer-score-section">
            <ScoreRing score={v.overallScore} size={80} />
            <div className="tpl-drawer-tier-info">
              <TierBadge tier={v.tier} />
              <div className="tpl-drawer-trend" style={{ color: v.trend > 0 ? "#10b981" : v.trend < 0 ? "#ef4444" : "#6b7280" }}>
                {v.trend > 0 ? <ArrowUpRight size={14} /> : v.trend < 0 ? <ArrowDownRight size={14} /> : <Minus size={14} />}
                {v.trend > 0 ? `+${v.trend}%` : v.trend < 0 ? `${v.trend}%` : "0%"} vs last quarter
              </div>
            </div>
          </div>
          <FieldGrid fields={[
            { label: "Service Type", value: v.service, icon: <Truck size={13} /> },
            { label: "Vendor ID", value: v.id, icon: <FileText size={13} /> },
            { label: "Contract Start", value: v.contractStart, icon: <Clock size={13} /> },
            { label: "Contract End", value: v.contractEnd, icon: <Clock size={13} /> },
            { label: "On-Time %", value: formatPct(v.onTimePct), icon: <Timer size={13} /> },
            { label: "Damage Rate", value: formatPct(v.damagePct), icon: <AlertTriangle size={13} /> },
            { label: "Return Rate", value: formatPct(v.returnPct), icon: <RefreshCw size={13} /> },
            { label: "Avg Cost/Order", value: `₹${v.avgCostPerOrder}`, icon: <IndianRupee size={13} /> },
            { label: "Total Shipments", value: v.totalShipments.toLocaleString(), icon: <PackageCheck size={13} /> },
            { label: "Total Revenue", value: formatINR(v.totalRevenue), icon: <DollarSign size={13} /> },
          ]} />
          <MetricsRow metrics={[
            { label: "Delivery", value: formatPct(v.deliveryRating), color: "teal" },
            { label: "Accuracy", value: formatPct(v.accuracyRating), color: "indigo" },
            { label: "Satisfaction", value: formatPct(v.satisfactionRating), color: "rose" },
          ]} />
          <div className="tpl-drawer-progress-section">
            <h4 className="tpl-drawer-section-title">Performance Breakdown</h4>
            <ProgressBar value={v.deliveryRating} max={100} color="#0d9488" label="Delivery" />
            <ProgressBar value={v.accuracyRating} max={100} color="#6366f1" label="Accuracy" />
            <ProgressBar value={v.costRating} max={100} color="#e11d48" label="Cost Efficiency" />
            <ProgressBar value={v.satisfactionRating} max={100} color="#f59e0b" label="Satisfaction" />
            <ProgressBar value={v.complianceRating} max={100} color="#10b981" label="Compliance" />
          </div>
          <div className="tpl-drawer-actions">
            <Button size="sm" className="tpl-btn-primary"><Eye size={14} /> View Report</Button>
            <Button size="sm" variant="outline"><FileText size={14} /> SLA Details</Button>
            <Button size="sm" variant="outline"><Download size={14} /> Export</Button>
          </div>
        </div>
      </div>
    </>
  )
}

function SLADrawer({ s, onClose }: { s: any; onClose: () => void }) {
  const isMet = s.actualPct >= s.targetPct
  return (
    <>
      <div className="tpl-drawer-overlay" onClick={onClose} />
      <div className="tpl-drawer-panel">
        <div className="tpl-drawer-header tpl-sla-header">
          <div className="tpl-drawer-header-info">
            <h3 className="tpl-drawer-title">SLA: {s.slaId}</h3>
            <div className="tpl-drawer-subtitle">
              <span className={`tpl-sla-status-badge tpl-sla-${s.status.toLowerCase().replace(" ", "-")}`}>{s.status}</span>
              <MapPin size={13} /> {s.zone} Zone
            </div>
          </div>
          <button onClick={onClose} className="tpl-drawer-close"><X size={18} /></button>
        </div>
        <div className="tpl-drawer-body">
          <div className="tpl-drawer-sla-visual">
            <div className={`tpl-sla-circle ${isMet ? "tpl-sla-met" : "tpl-sla-breached"}`}>
              <span className="tpl-sla-circle-value">{formatPct(s.actualPct)}</span>
              <span className="tpl-sla-circle-label">Actual</span>
            </div>
            <div className="tpl-sla-target-indicator">
              <Target size={20} />
              <span>Target: {formatPct(s.targetPct)}</span>
            </div>
            {s.breachCount > 0 && (
              <div className="tpl-sla-breach-alert">
                <ShieldAlert size={16} />
                <span>{s.breachCount} breaches · Penalty: {formatINR(s.penaltyAmount)}</span>
              </div>
            )}
          </div>
          <FieldGrid fields={[
            { label: "Vendor", value: s.vendor, icon: <Users size={13} /> },
            { label: "SLA ID", value: s.slaId, icon: <FileText size={13} /> },
            { label: "Category", value: s.category, icon: <ShieldCheck size={13} /> },
            { label: "Period", value: s.period, icon: <CalendarRange size={13} /> },
            { label: "Target %", value: formatPct(s.targetPct), icon: <Target size={13} /> },
            { label: "Actual %", value: formatPct(s.actualPct), icon: <BarChart3 size={13} /> },
            { label: "Gap", value: formatPct(s.actualPct - s.targetPct), icon: s.actualPct >= s.targetPct ? <ThumbsUp size={13} /> : <ThumbsDown size={13} /> },
            { label: "Penalty", value: s.penaltyAmount ? formatINR(s.penaltyAmount) : "None", icon: <IndianRupee size={13} /> },
          ]} />
          <MetricsRow metrics={[
            { label: "Breach Count", value: String(s.breachCount), color: s.breachCount > 0 ? "rose" : "teal" },
            { label: "Performance", value: formatPct(s.actualPct), color: isMet ? "teal" : "rose" },
            { label: "Penalty", value: s.penaltyAmount ? formatINR(s.penaltyAmount) : "₹0", color: s.penaltyAmount > 0 ? "amber" : "teal" },
          ]} />
          <div className="tpl-drawer-actions">
            <Button size="sm" className="tpl-btn-primary"><RefreshCw size={14} /> Dispute</Button>
            <Button size="sm" variant="outline"><FileText size={14} /> Full Report</Button>
          </div>
        </div>
      </div>
    </>
  )
}

function CostDrawer({ c, onClose }: { c: any; onClose: () => void }) {
  const breakdown = [
    { label: "Base Freight", value: c.baseCost, pct: c.baseCost / c.totalCost * 100, color: "#0d9488" },
    { label: "Fuel Surcharge", value: c.fuelSurcharge, pct: c.fuelSurcharge / c.totalCost * 100, color: "#e11d48" },
    { label: "Handling", value: c.handlingCost, pct: c.handlingCost / c.totalCost * 100, color: "#6366f1" },
    { label: "Insurance", value: c.insuranceCost, pct: c.insuranceCost / c.totalCost * 100, color: "#f59e0b" },
    { label: "Tech Fee", value: c.techFee, pct: c.techFee / c.totalCost * 100, color: "#10b981" },
  ]
  return (
    <>
      <div className="tpl-drawer-overlay" onClick={onClose} />
      <div className="tpl-drawer-panel">
        <div className="tpl-drawer-header tpl-cost-header">
          <div className="tpl-drawer-header-info">
            <h3 className="tpl-drawer-title">Cost: {c.id}</h3>
            <div className="tpl-drawer-subtitle">
              <IndianRupee size={13} /> {formatINR(c.totalCost)} total · {c.period}
            </div>
          </div>
          <button onClick={onClose} className="tpl-drawer-close"><X size={18} /></button>
        </div>
        <div className="tpl-drawer-body">
          <FieldGrid fields={[
            { label: "Vendor", value: c.vendor, icon: <Users size={13} /> },
            { label: "Service", value: c.service, icon: <Truck size={13} /> },
            { label: "Warehouse", value: c.warehouse, icon: <Building size={13} /> },
            { label: "Zone", value: c.zone, icon: <MapPin size={13} /> },
            { label: "Volume", value: c.volume.toLocaleString(), icon: <PackageCheck size={13} /> },
            { label: "Cost/Unit", value: `₹${c.costPerUnit}`, icon: <IndianRupee size={13} /> },
            { label: "Savings YoY", value: formatPct(c.savingsVsLastYear), icon: c.savingsVsLastYear > 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} /> },
            { label: "Budget Variance", value: formatPct(c.budgetVariance), icon: c.budgetVariance >= 0 ? <ThumbsUp size={13} /> : <ThumbsDown size={13} /> },
          ]} />
          <MetricsRow metrics={[
            { label: "Total Cost", value: formatINR(c.totalCost), color: "teal" },
            { label: "Cost/Unit", value: `₹${c.costPerUnit}`, color: "indigo" },
            { label: "Volume", value: c.volume.toLocaleString(), color: "amber" },
          ]} />
          <div className="tpl-drawer-breakdown-section">
            <h4 className="tpl-drawer-section-title">Cost Breakdown</h4>
            {breakdown.map((b, i) => (
              <div key={i} className="tpl-cost-breakdown-bar">
                <span className="tpl-cb-label">{b.label}</span>
                <div className="tpl-cb-track">
                  <div className="tpl-cb-fill" style={{ width: `${b.pct}%`, backgroundColor: b.color }} />
                </div>
                <span className="tpl-cb-value">{formatINR(b.value)}</span>
                <span className="tpl-cb-pct">{formatPct(b.pct)}</span>
              </div>
            ))}
          </div>
          <div className="tpl-drawer-actions">
            <Button size="sm" className="tpl-btn-primary"><Download size={14} /> Export Report</Button>
            <Button size="sm" variant="outline"><BarChart3 size={14} /> Compare</Button>
          </div>
        </div>
      </div>
    </>
  )
}

function ContractDrawer({ ct, onClose }: { ct: any; onClose: () => void }) {
  const statusColors: Record<string, string> = {
    Active: "tpl-con-active", "Under Review": "tpl-con-review", "Expiring Soon": "tpl-con-expiring",
    Renewed: "tpl-con-renewed", Terminated: "tpl-con-terminated", "Pending Signature": "tpl-con-pending",
  }
  return (
    <>
      <div className="tpl-drawer-overlay" onClick={onClose} />
      <div className="tpl-drawer-panel">
        <div className="tpl-drawer-header tpl-contract-header">
          <div className="tpl-drawer-header-info">
            <h3 className="tpl-drawer-title">Contract: {ct.id}</h3>
            <div className="tpl-drawer-subtitle">
              <span className={`tpl-contract-status-badge ${statusColors[ct.status] || ""}`}>{ct.status}</span>
              <span className="tpl-contract-auto-renew">{ct.autoRenew ? "Auto-Renew ON" : "Manual Renewal"}</span>
            </div>
          </div>
          <button onClick={onClose} className="tpl-drawer-close"><X size={18} /></button>
        </div>
        <div className="tpl-drawer-body">
          <FieldGrid fields={[
            { label: "Vendor", value: ct.vendor, icon: <Users size={13} /> },
            { label: "Service", value: ct.service, icon: <Truck size={13} /> },
            { label: "Warehouse", value: ct.warehouse, icon: <Building size={13} /> },
            { label: "Contract Value", value: formatINR(ct.value), icon: <IndianRupee size={13} /> },
            { label: "Start Date", value: ct.startDate, icon: <Clock size={13} /> },
            { label: "End Date", value: ct.endDate, icon: <Clock size={13} /> },
            { label: "Notice Period", value: ct.noticePeriod, icon: <Timer size={13} /> },
            { label: "Payment Terms", value: ct.paymentTerms, icon: <DollarSign size={13} /> },
            { label: "Penalty Clause", value: ct.penaltyClause, icon: <ShieldAlert size={13} /> },
            { label: "SLA Guarantee", value: formatPct(ct.slaGuarantee), icon: <ShieldCheck size={13} /> },
          ]} />
          <MetricsRow metrics={[
            { label: "Contract Value", value: formatINR(ct.value), color: "teal" },
            { label: "Perf. Bonus", value: formatINR(ct.performanceBonus), color: "amber" },
            { label: "SLA Target", value: formatPct(ct.slaGuarantee), color: "indigo" },
          ]} />
          <div className="tpl-drawer-actions">
            <Button size="sm" className="tpl-btn-primary"><FileText size={14} /> Full Contract</Button>
            <Button size="sm" variant="outline"><RefreshCw size={14} /> Renew</Button>
            <Button size="sm" variant="outline"><Download size={14} /> Download</Button>
          </div>
        </div>
      </div>
    </>
  )
}

function BenchmarkDrawer({ b, onClose }: { b: any; onClose: () => void }) {
  const trendIcons = { improving: <TrendingUp size={14} />, stable: <Minus size={14} />, declining: <TrendingDown size={14} /> }
  const trendColors = { improving: "#10b981", stable: "#6b7280", declining: "#ef4444" }
  return (
    <>
      <div className="tpl-drawer-overlay" onClick={onClose} />
      <div className="tpl-drawer-panel">
        <div className="tpl-drawer-header tpl-benchmark-header">
          <div className="tpl-drawer-header-info">
            <h3 className="tpl-drawer-title">Benchmark: {b.metric}</h3>
            <div className="tpl-drawer-subtitle">
              {b.vendor} · {b.period}
              <span className="tpl-benchmark-trend" style={{ color: trendColors[b.trend as keyof typeof trendColors] }}>
                {trendIcons[b.trend as keyof typeof trendIcons]} {b.trend}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="tpl-drawer-close"><X size={18} /></button>
        </div>
        <div className="tpl-drawer-body">
          <div className="tpl-benchmark-visual">
            <div className="tpl-bm-rank">
              <span className="tpl-bm-percentile">{b.percentile}<small>th %ile</small></span>
              <span className="tpl-bm-label">Percentile</span>
            </div>
            <div className="tpl-bm-comparisons">
              <div className="tpl-bm-bar-item">
                <span className="tpl-bm-bar-label">Our Score</span>
                <div className="tpl-bm-bar-track"><div className="tpl-bm-bar-fill tpl-bm-ours" style={{ width: `${b.ourScore}%` }} /></div>
                <span className="tpl-bm-bar-val">{formatPct(b.ourScore)}</span>
              </div>
              <div className="tpl-bm-bar-item">
                <span className="tpl-bm-bar-label">Peer Avg</span>
                <div className="tpl-bm-bar-track"><div className="tpl-bm-bar-fill tpl-bm-peer" style={{ width: `${Math.max(b.peerAvg, 0)}%` }} /></div>
                <span className="tpl-bm-bar-val">{formatPct(b.peerAvg)}</span>
              </div>
              <div className="tpl-bm-bar-item">
                <span className="tpl-bm-bar-label">Industry Avg</span>
                <div className="tpl-bm-bar-track"><div className="tpl-bm-bar-fill tpl-bm-industry" style={{ width: `${Math.max(b.industryAvg, 0)}%` }} /></div>
                <span className="tpl-bm-bar-val">{formatPct(b.industryAvg)}</span>
              </div>
              <div className="tpl-bm-bar-item">
                <span className="tpl-bm-bar-label">Best in Class</span>
                <div className="tpl-bm-bar-track"><div className="tpl-bm-bar-fill tpl-bm-best" style={{ width: `${Math.min(b.bestInClass, 100)}%` }} /></div>
                <span className="tpl-bm-bar-val">{formatPct(b.bestInClass)}</span>
              </div>
            </div>
          </div>
          <FieldGrid fields={[
            { label: "Vendor", value: b.vendor, icon: <Users size={13} /> },
            { label: "Metric", value: b.metric, icon: <BarChart3 size={13} /> },
            { label: "Our Score", value: formatPct(b.ourScore), icon: <Star size={13} /> },
            { label: "Industry Avg", value: formatPct(b.industryAvg), icon: <Globe size={13} /> },
            { label: "Best in Class", value: formatPct(b.bestInClass), icon: <Award size={13} /> },
            { label: "Peer Avg", value: formatPct(b.peerAvg), icon: <Users size={13} /> },
            { label: "Period", value: b.period, icon: <Clock size={13} /> },
          ]} />
          <MetricsRow metrics={[
            { label: "Our Score", value: formatPct(b.ourScore), color: b.ourScore >= 90 ? "teal" : b.ourScore >= 75 ? "amber" : "rose" },
            { label: "Percentile", value: `${b.percentile}th`, color: b.percentile >= 75 ? "teal" : "amber" },
            { label: "Trend", value: b.trend, color: b.trend === "improving" ? "teal" : b.trend === "stable" ? "amber" : "rose" },
          ]} />
          <div className="tpl-drawer-actions">
            <Button size="sm" className="tpl-btn-primary"><Download size={14} /> Export</Button>
            <Button size="sm" variant="outline"><BarChart3 size={14} /> Deep Dive</Button>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Main Component ───────────────────────────────────────
export default function ThreePLPerformanceScorecardView() {
  const [activeTab, setActiveTab] = useState("0")
  const [search, setSearch] = useState("")
  const [filterVendor, setFilterVendor] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortKey, setSortKey] = useState("")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [drawerData, setDrawerData] = useState<any>(null)
  const [drawerType, setDrawerType] = useState<"vendor" | "sla" | "cost" | "contract" | "benchmark">("vendor")

  const filteredVendors = useMemo(() => {
    let result = data.vendors.filter(v =>
      v.vendor.toLowerCase().includes(search.toLowerCase()) ||
      v.id.toLowerCase().includes(search.toLowerCase()) ||
      v.warehouse.toLowerCase().includes(search.toLowerCase())
    )
    if (filterVendor !== "all") result = result.filter(v => v.vendor === filterVendor)
    if (filterStatus !== "all") result = result.filter(v => v.tier === filterStatus)
    return sortKey ? sortBy(result, sortKey, sortDir) : result
  }, [search, filterVendor, filterStatus, sortKey, sortDir])

  const filteredSLA = useMemo(() => {
    let result = data.slaRecords.filter(s =>
      s.vendor.toLowerCase().includes(search.toLowerCase()) ||
      s.slaId.toLowerCase().includes(search.toLowerCase())
    )
    if (filterStatus !== "all") result = result.filter(s => s.status === filterStatus)
    if (filterVendor !== "all") result = result.filter(s => s.vendor === filterVendor)
    return sortKey ? sortBy(result, sortKey, sortDir) : result
  }, [search, filterVendor, filterStatus, sortKey, sortDir])

  const filteredCosts = useMemo(() => {
    let result = data.costs.filter(c =>
      c.vendor.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase())
    )
    if (filterVendor !== "all") result = result.filter(c => c.vendor === filterVendor)
    return sortKey ? sortBy(result, sortKey, sortDir) : result
  }, [search, filterVendor, sortKey, sortDir])

  const filteredContracts = useMemo(() => {
    let result = data.contracts.filter(c =>
      c.vendor.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase())
    )
    if (filterVendor !== "all") result = result.filter(c => c.vendor === filterVendor)
    if (filterStatus !== "all") result = result.filter(c => c.status === filterStatus)
    return sortKey ? sortBy(result, sortKey, sortDir) : result
  }, [search, filterVendor, filterStatus, sortKey, sortDir])

  const filteredBenchmarks = useMemo(() => {
    let result = data.benchmarks.filter(b =>
      b.vendor.toLowerCase().includes(search.toLowerCase()) ||
      b.metric.toLowerCase().includes(search.toLowerCase())
    )
    if (filterVendor !== "all") result = result.filter(b => b.vendor === filterVendor)
    return sortKey ? sortBy(result, sortKey, sortDir) : result
  }, [search, filterVendor, sortKey, sortDir])

  const totalRevenue = data.vendors.reduce((a, b) => a + b.totalRevenue, 0)
  const avgScore = +(data.vendors.reduce((a, b) => a + b.overallScore, 0) / data.vendors.length).toFixed(1)
  const totalPenalties = data.slaRecords.reduce((a, b) => a + b.penaltyAmount, 0)
  const preferredCount = data.vendors.filter(v => v.isPreferred).length

  const openDrawer = (item: any, type: typeof drawerType) => {
    setDrawerData(item); setDrawerType(type)
  }
  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("desc") }
  }

  return (
    <div className="tpl-container">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="tpl-header">
          <div className="tpl-header-left">
            <h1 className="tpl-title"><Award size={26} className="tpl-title-icon" />3PL Performance Scorecard</h1>
            <p className="tpl-subtitle">Vendor performance management &amp; SLA compliance tracking</p>
          </div>
          <div className="tpl-header-controls">
            <div className="tpl-search-box">
              <Search size={15} />
              <input type="text" placeholder="Search vendors, IDs, warehouses..." value={search} onChange={e => setSearch(e.target.value)} />
              {search && <button onClick={() => setSearch("")}><X size={14} /></button>}
            </div>
            <button className="tpl-refresh-btn"><RefreshCw size={15} /> Refresh</button>
          </div>
        </div>
        <TabsList className="tpl-tabs-list">
          <TabsTrigger value="0" className="tpl-tab-trigger"><BarChart3 size={14} /> Dashboard</TabsTrigger>
          <TabsTrigger value="1" className="tpl-tab-trigger"><Award size={14} /> Vendor Scorecards</TabsTrigger>
          <TabsTrigger value="2" className="tpl-tab-trigger"><ShieldCheck size={14} /> SLA Compliance</TabsTrigger>
          <TabsTrigger value="3" className="tpl-tab-trigger"><DollarSign size={14} /> Cost Analysis</TabsTrigger>
          <TabsTrigger value="4" className="tpl-tab-trigger"><FileText size={14} /> Contracts</TabsTrigger>
          <TabsTrigger value="5" className="tpl-tab-trigger"><Globe size={14} /> Benchmarking</TabsTrigger>
        </TabsList>

        {/* ═══ Tab 0: Dashboard ═══ */}
        <TabsContent value="0" className="tpl-tab-content">
          <div className="tpl-kpi-grid">
            <Card className="tpl-kpi-card tpl-kpi-teal"><CardContent className="tpl-kpi-body"><div className="tpl-kpi-icon-wrap"><Truck size={22} /></div><div className="tpl-kpi-text"><span className="tpl-kpi-label">Active Vendors</span><span className="tpl-kpi-value">{data.VENDOR_NAMES.length}</span><span className="tpl-kpi-sub">Across {data.WAREHOUSES.length} warehouses</span></div></CardContent></Card>
            <Card className="tpl-kpi-card tpl-kpi-indigo"><CardContent className="tpl-kpi-body"><div className="tpl-kpi-icon-wrap"><Star size={22} /></div><div className="tpl-kpi-text"><span className="tpl-kpi-label">Avg. Score</span><span className="tpl-kpi-value">{avgScore}</span><span className="tpl-kpi-sub"><TrendingUp size={12} /> +2.3 vs last quarter</span></div></CardContent></Card>
            <Card className="tpl-kpi-card tpl-kpi-rose"><CardContent className="tpl-kpi-body"><div className="tpl-kpi-icon-wrap"><IndianRupee size={22} /></div><div className="tpl-kpi-text"><span className="tpl-kpi-label">Total Spend</span><span className="tpl-kpi-value">{formatINR(totalRevenue)}</span><span className="tpl-kpi-sub">FY 2025-26</span></div></CardContent></Card>
            <Card className="tpl-kpi-card tpl-kpi-amber"><CardContent className="tpl-kpi-body"><div className="tpl-kpi-icon-wrap"><ShieldAlert size={22} /></div><div className="tpl-kpi-text"><span className="tpl-kpi-label">SLA Penalties</span><span className="tpl-kpi-value">{formatINR(totalPenalties)}</span><span className="tpl-kpi-sub">{data.slaRecords.filter(s => s.breachCount > 0).length} breach events</span></div></CardContent></Card>
            <Card className="tpl-kpi-card tpl-kpi-emerald"><CardContent className="tpl-kpi-body"><div className="tpl-kpi-icon-wrap"><Award size={22} /></div><div className="tpl-kpi-text"><span className="tpl-kpi-label">Preferred Partners</span><span className="tpl-kpi-value">{preferredCount}</span><span className="tpl-kpi-sub">{preferredCount > 0 ? "Top-rated vendors" : "None selected"}</span></div></CardContent></Card>
            <Card className="tpl-kpi-card tpl-kpi-violet"><CardContent className="tpl-kpi-body"><div className="tpl-kpi-icon-wrap"><Target size={22} /></div><div className="tpl-kpi-text"><span className="tpl-kpi-label">On-Time Rate</span><span className="tpl-kpi-value">{formatPct(data.vendors.reduce((a, b) => a + b.onTimePct, 0) / data.vendors.length)}</span><span className="tpl-kpi-sub">Network average</span></div></CardContent></Card>
          </div>
          <div className="tpl-chart-grid">
            <Card className="tpl-chart-card tpl-chart-wide"><CardHeader className="tpl-chart-header"><CardTitle className="tpl-chart-title">Monthly Performance Trend</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><ComposedChart data={data.monthlyTrend}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis yAxisId="score" domain={[75, 100]} tick={{ fontSize: 12 }} /><YAxis yAxisId="shipments" orientation="right" tick={{ fontSize: 12 }} /><Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }} /><Legend wrapperStyle={{ fontSize: 12 }} /><Bar yAxisId="shipments" dataKey="totalShipments" fill="#c7d2fe" name="Shipments" radius={[4, 4, 0, 0]} /><Line yAxisId="score" type="monotone" dataKey="avgScore" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 4, fill: "#0d9488" }} name="Avg Score" /><Line yAxisId="score" type="monotone" dataKey="onTimePct" stroke="#e11d48" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3, fill: "#e11d48" }} name="On-Time %" /></ComposedChart></ResponsiveContainer></CardContent></Card>
            <Card className="tpl-chart-card"><CardHeader className="tpl-chart-header"><CardTitle className="tpl-chart-title">Vendor Tier Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={data.vendorDistribution} dataKey="count" nameKey="tier" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={3} label={({ tier, count }) => `${tier}: ${count}`}><Cell fill="#7c3aed" /><Cell fill="#d97706" /><Cell fill="#6b7280" /><Cell fill="#b45309" /><Cell fill="#dc2626" /></Pie><Tooltip /><Legend wrapperStyle={{ fontSize: 12 }} /></PieChart></ResponsiveContainer></CardContent></Card>
          </div>
          <div className="tpl-chart-grid">
            <Card className="tpl-chart-card"><CardHeader className="tpl-chart-header"><CardTitle className="tpl-chart-title">Warehouse Performance Radar</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><RadarChart data={data.zoneComparison}><PolarGrid stroke="#e5e7eb" /><PolarAngleAxis dataKey="warehouse" tick={{ fontSize: 10 }} /><PolarRadiusAxis domain={[70, 100]} tick={{ fontSize: 10 }} /><Radar name="Delivery" dataKey="delivery" stroke="#0d9488" fill="#0d9488" fillOpacity={0.15} /><Radar name="Accuracy" dataKey="accuracy" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} /><Legend wrapperStyle={{ fontSize: 12 }} /></RadarChart></ResponsiveContainer></CardContent></Card>
            <Card className="tpl-chart-card"><CardHeader className="tpl-chart-header"><CardTitle className="tpl-chart-title">Cost Component Breakdown</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><PieChart><Pie data={data.costBreakdownData} dataKey="value" nameKey="component" cx="50%" cy="50%" outerRadius={95} innerRadius={55} paddingAngle={2} label={({ component, value }) => `${component}: ${value}%`}><Cell fill="#0d9488" /><Cell fill="#e11d48" /><Cell fill="#6366f1" /><Cell fill="#f59e0b" /><Cell fill="#10b981" /><Cell fill="#8b5cf6" /></Pie><Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} /></PieChart></ResponsiveContainer></CardContent></Card>
          </div>
          <div className="tpl-chart-grid">
            <Card className="tpl-chart-card tpl-chart-wide"><CardHeader className="tpl-chart-header"><CardTitle className="tpl-chart-title">SLA Breach Trend</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={260}><AreaChart data={data.monthlyTrend}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip contentStyle={{ borderRadius: 8 }} /><Legend wrapperStyle={{ fontSize: 12 }} /><Area type="monotone" dataKey="slaBreachCount" stroke="#e11d48" fill="#fecdd3" strokeWidth={2} name="Breaches" /><Area type="monotone" dataKey="costPerShipment" stroke="#6366f1" fill="#e0e7ff" strokeWidth={2} name="Cost/Shipment (₹)" /></AreaChart></ResponsiveContainer></CardContent></Card>
            <Card className="tpl-chart-card"><CardHeader className="tpl-chart-header"><CardTitle className="tpl-chart-title">Service Performance</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={260}><BarChart data={data.servicePerformance}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="service" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" height={50} /><YAxis domain={[70, 100]} tick={{ fontSize: 12 }} /><Tooltip contentStyle={{ borderRadius: 8 }} /><Bar dataKey="avgScore" radius={[4, 4, 0, 0]}><Cell fill="#0d9488" /><Cell fill="#6366f1" /><Cell fill="#e11d48" /><Cell fill="#f59e0b" /><Cell fill="#10b981" /><Cell fill="#8b5cf6" /><Cell fill="#0ea5e9" /><Cell fill="#ec4899" /></Bar></BarChart></ResponsiveContainer></CardContent></Card>
          </div>
        </TabsContent>

        {/* ═══ Tab 1: Vendor Scorecards ═══ */}
        <TabsContent value="1" className="tpl-tab-content">
          <div className="tpl-table-toolbar">
            <div className="tpl-filter-row">
              <select value={filterVendor} onChange={e => setFilterVendor(e.target.value)}>
                <option value="all">All Vendors</option>
                {data.VENDOR_NAMES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="all">All Tiers</option>
                {data.RATING_TIERS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <Badge className="tpl-count-badge">{filteredVendors.length} vendors</Badge>
            </div>
          </div>
          <div className="tpl-table-container">
            <table className="tpl-table">
              <thead><tr>
                <th onClick={() => toggleSort("vendor")}>Vendor <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("overallScore")}>Score <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("tier")}>Tier <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("deliveryRating")}>Delivery <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("accuracyRating")}>Accuracy <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("costRating")}>Cost Eff. <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("satisfactionRating")}>Satisfaction <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("warehouse")}>Warehouse <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("totalShipments")}>Shipments <ArrowUpDown size={12} /></th>
                <th>Trend</th>
              </tr></thead>
              <tbody>
                {filteredVendors.map(v => (
                  <tr key={v.id} className={`tpl-row ${v.trend < 0 ? "tpl-row-declining" : ""}`} onClick={() => openDrawer(v, "vendor")}>
                    <td>
                      <div className="tpl-vendor-cell">
                        <span className="tpl-vendor-name">{v.vendor}</span>
                        {v.isPreferred && <Award size={12} className="tpl-preferred-icon" />}
                      </div>
                      <span className="tpl-vendor-id">{v.id}</span>
                    </td>
                    <td><ScoreRing score={v.overallScore} size={44} /></td>
                    <td><TierBadge tier={v.tier} /></td>
                    <td><StarRating rating={v.deliveryRating} /></td>
                    <td><StarRating rating={v.accuracyRating} /></td>
                    <td><StarRating rating={v.costRating} /></td>
                    <td><StarRating rating={v.satisfactionRating} /></td>
                    <td><div className="tpl-warehouse-cell"><MapPin size={12} />{v.warehouse}</div></td>
                    <td className="tpl-number-cell">{v.totalShipments.toLocaleString()}</td>
                    <td>
                      <span className={`tpl-trend-badge ${v.trend > 0 ? "tpl-trend-up" : v.trend < 0 ? "tpl-trend-down" : "tpl-trend-flat"}`}>
                        {v.trend > 0 ? <ArrowUpRight size={14} /> : v.trend < 0 ? <ArrowDownRight size={14} /> : <Minus size={14} />}
                        {v.trend > 0 ? `+${v.trend}%` : `${v.trend}%`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ═══ Tab 2: SLA Compliance ═══ */}
        <TabsContent value="2" className="tpl-tab-content">
          <div className="tpl-table-toolbar">
            <div className="tpl-filter-row">
              <select value={filterVendor} onChange={e => setFilterVendor(e.target.value)}>
                <option value="all">All Vendors</option>
                {data.VENDOR_NAMES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="Met">Met</option>
                <option value="At Risk">At Risk</option>
                <option value="Breached">Breached</option>
              </select>
              <Badge className="tpl-count-badge">{filteredSLA.length} records</Badge>
            </div>
          </div>
          <div className="tpl-table-container">
            <table className="tpl-table">
              <thead><tr>
                <th onClick={() => toggleSort("slaId")}>SLA ID <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("vendor")}>Vendor <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("category")}>Category <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("targetPct")}>Target <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("actualPct")}>Actual <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("status")}>Status <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("breachCount")}>Breaches <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("penaltyAmount")}>Penalty <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("period")}>Period <ArrowUpDown size={12} /></th>
              </tr></thead>
              <tbody>
                {filteredSLA.map(s => (
                  <tr key={s.id} className={`tpl-row ${s.status === "Breached" ? "tpl-row-breached" : s.status === "At Risk" ? "tpl-row-atrisk" : ""}`} onClick={() => openDrawer(s, "sla")}>
                    <td className="tpl-mono-cell">{s.slaId}</td>
                    <td>{s.vendor}</td>
                    <td><Badge className="tpl-category-badge">{s.category}</Badge></td>
                    <td className="tpl-number-cell">{formatPct(s.targetPct)}</td>
                    <td className="tpl-number-cell">{formatPct(s.actualPct)}</td>
                    <td>
                      <span className={`tpl-sla-status-badge tpl-sla-${s.status.toLowerCase().replace(" ", "-")}`}>{s.status}</span>
                    </td>
                    <td className="tpl-number-cell">{s.breachCount}</td>
                    <td className="tpl-number-cell">{s.penaltyAmount ? formatINR(s.penaltyAmount) : "—"}</td>
                    <td>{s.period}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ═══ Tab 3: Cost Analysis ═══ */}
        <TabsContent value="3" className="tpl-tab-content">
          <div className="tpl-table-toolbar">
            <div className="tpl-filter-row">
              <select value={filterVendor} onChange={e => setFilterVendor(e.target.value)}>
                <option value="all">All Vendors</option>
                {data.VENDOR_NAMES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
              <Badge className="tpl-count-badge">{filteredCosts.length} records</Badge>
            </div>
          </div>
          <div className="tpl-table-container">
            <table className="tpl-table">
              <thead><tr>
                <th onClick={() => toggleSort("vendor")}>Vendor <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("service")}>Service <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("warehouse")}>Warehouse <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("totalCost")}>Total Cost <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("costPerUnit")}>Cost/Unit <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("volume")}>Volume <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("savingsVsLastYear")}>YoY Savings <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("budgetVariance")}>Budget Var. <ArrowUpDown size={12} /></th>
                <th>Period</th>
              </tr></thead>
              <tbody>
                {filteredCosts.map(c => (
                  <tr key={c.id} className="tpl-row" onClick={() => openDrawer(c, "cost")}>
                    <td><div className="tpl-vendor-cell"><span className="tpl-vendor-name">{c.vendor}</span></div></td>
                    <td><Badge className="tpl-category-badge">{c.service}</Badge></td>
                    <td><div className="tpl-warehouse-cell"><MapPin size={12} />{c.warehouse}</div></td>
                    <td className="tpl-number-cell">{formatINR(c.totalCost)}</td>
                    <td className="tpl-number-cell">₹{c.costPerUnit}</td>
                    <td className="tpl-number-cell">{c.volume.toLocaleString()}</td>
                    <td>
                      <span className={`tpl-trend-badge ${c.savingsVsLastYear > 0 ? "tpl-trend-up" : "tpl-trend-down"}`}>
                        {c.savingsVsLastYear > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {formatPct(c.savingsVsLastYear)}
                      </span>
                    </td>
                    <td>
                      <span className={`tpl-trend-badge ${c.budgetVariance >= 0 ? "tpl-trend-up" : "tpl-trend-down"}`}>
                        {formatPct(Math.abs(c.budgetVariance))}
                        {c.budgetVariance >= 0 ? " under" : " over"}
                      </span>
                    </td>
                    <td>{c.period}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ═══ Tab 4: Contracts ═══ */}
        <TabsContent value="4" className="tpl-tab-content">
          <div className="tpl-table-toolbar">
            <div className="tpl-filter-row">
              <select value={filterVendor} onChange={e => setFilterVendor(e.target.value)}>
                <option value="all">All Vendors</option>
                {data.VENDOR_NAMES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                {data.CONTRACT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <Badge className="tpl-count-badge">{filteredContracts.length} contracts</Badge>
            </div>
          </div>
          <div className="tpl-table-container">
            <table className="tpl-table">
              <thead><tr>
                <th onClick={() => toggleSort("id")}>Contract ID <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("vendor")}>Vendor <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("service")}>Service <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("value")}>Value <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("status")}>Status <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("startDate")}>Start <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("endDate")}>End <ArrowUpDown size={12} /></th>
                <th>Auto-Renew</th>
                <th onClick={() => toggleSort("slaGuarantee")}>SLA Target <ArrowUpDown size={12} /></th>
              </tr></thead>
              <tbody>
                {filteredContracts.map(c => (
                  <tr key={c.id} className={`tpl-row ${c.status === "Expiring Soon" ? "tpl-row-expiring" : c.status === "Terminated" ? "tpl-row-terminated" : ""}`} onClick={() => openDrawer(c, "contract")}>
                    <td className="tpl-mono-cell">{c.id}</td>
                    <td><div className="tpl-vendor-cell"><span className="tpl-vendor-name">{c.vendor}</span></div></td>
                    <td><Badge className="tpl-category-badge">{c.service}</Badge></td>
                    <td className="tpl-number-cell">{formatINR(c.value)}</td>
                    <td><span className={`tpl-contract-status-badge tpl-con-${c.status.toLowerCase().replace(" ", "-")}`}>{c.status}</span></td>
                    <td>{c.startDate}</td>
                    <td>{c.endDate}</td>
                    <td><span className={`tpl-auto-renew-badge ${c.autoRenew ? "tpl-auto-on" : "tpl-auto-off"}`}>{c.autoRenew ? "ON" : "OFF"}</span></td>
                    <td className="tpl-number-cell">{formatPct(c.slaGuarantee)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ═══ Tab 5: Benchmarking ═══ */}
        <TabsContent value="5" className="tpl-tab-content">
          <div className="tpl-table-toolbar">
            <div className="tpl-filter-row">
              <select value={filterVendor} onChange={e => setFilterVendor(e.target.value)}>
                <option value="all">All Vendors</option>
                {data.VENDOR_NAMES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
              <Badge className="tpl-count-badge">{filteredBenchmarks.length} benchmarks</Badge>
            </div>
          </div>
          <div className="tpl-table-container">
            <table className="tpl-table">
              <thead><tr>
                <th onClick={() => toggleSort("metric")}>Metric <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("vendor")}>Vendor <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("ourScore")}>Our Score <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("peerAvg")}>Peer Avg <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("industryAvg")}>Industry Avg <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("bestInClass")}>Best in Class <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("percentile")}>Percentile <ArrowUpDown size={12} /></th>
                <th onClick={() => toggleSort("trend")}>Trend <ArrowUpDown size={12} /></th>
                <th>Period</th>
              </tr></thead>
              <tbody>
                {filteredBenchmarks.map(b => (
                  <tr key={b.id} className={`tpl-row ${b.trend === "declining" ? "tpl-row-declining" : ""}`} onClick={() => openDrawer(b, "benchmark")}>
                    <td><Badge className="tpl-category-badge">{b.metric}</Badge></td>
                    <td>{b.vendor}</td>
                    <td className="tpl-number-cell tpl-score-highlight">{formatPct(b.ourScore)}</td>
                    <td className="tpl-number-cell">{formatPct(b.peerAvg)}</td>
                    <td className="tpl-number-cell">{formatPct(b.industryAvg)}</td>
                    <td className="tpl-number-cell">{formatPct(b.bestInClass)}</td>
                    <td>
                      <div className="tpl-percentile-cell">
                        <div className="tpl-percentile-bar">
                          <div className="tpl-percentile-fill" style={{ width: `${b.percentile}%`, backgroundColor: b.percentile >= 75 ? "#0d9488" : b.percentile >= 50 ? "#f59e0b" : "#e11d48" }} />
                        </div>
                        <span className="tpl-percentile-value">{b.percentile}th</span>
                      </div>
                    </td>
                    <td>
                      <span className={`tpl-benchmark-trend-badge ${b.trend === "improving" ? "tpl-trend-up" : b.trend === "declining" ? "tpl-trend-down" : "tpl-trend-flat"}`}>
                        {b.trend === "improving" ? <TrendingUp size={14} /> : b.trend === "declining" ? <TrendingDown size={14} /> : <Minus size={14} />}
                        {b.trend}
                      </span>
                    </td>
                    <td>{b.period}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Drawer */}
      {drawerData && drawerType === "vendor" && <VendorDrawer v={drawerData} onClose={() => setDrawerData(null)} />}
      {drawerData && drawerType === "sla" && <SLADrawer s={drawerData} onClose={() => setDrawerData(null)} />}
      {drawerData && drawerType === "cost" && <CostDrawer c={drawerData} onClose={() => setDrawerData(null)} />}
      {drawerData && drawerType === "contract" && <ContractDrawer ct={drawerData} onClose={() => setDrawerData(null)} />}
      {drawerData && drawerType === "benchmark" && <BenchmarkDrawer b={drawerData} onClose={() => setDrawerData(null)} />}
    </div>
  )
}
