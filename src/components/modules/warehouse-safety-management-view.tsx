"use client"

import { useState, useMemo } from "react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts"
import {
  HardHat, ShieldAlert, Search, Eye, ArrowUpDown, TrendingUp,
  Clock, AlertTriangle, CheckCircle, XCircle, BarChart3, Activity,
  ShieldCheck, Flame, Thermometer, Users, Factory, Wrench, Zap,
  Heart, CircleDot, FileWarning, Award,
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
const INSPECTION_TYPES = ["Fire Safety", "Electrical Safety", "Structural Integrity", "PPE Compliance", "Chemical Storage", "Emergency Exits", "Equipment Safety", "Housekeeping"] as const
const INSPECTION_EMOJI = ["🔥", "⚡", "🏗️", "🪖", "🧪", "🚪", "⚙️", "🧹"] as const
const INSPECTION_STATUSES = ["Scheduled", "In Progress", "Passed", "Failed", "Rectified", "Overdue"] as const
const INCIDENT_TYPES = ["Slip/Fall", "Equipment Malfunction", "Fire Alert", "Chemical Spill", "Electrical Hazard", "Forklift Incident", "Rack Collapse", "Heat Exhaustion"] as const
const INCIDENT_SEVERITIES = ["Critical", "Major", "Moderate", "Minor", "Near Miss"] as const
const INCIDENT_STATUSES = ["Reported", "Investigating", "Resolved", "Closed", "Escalated"] as const
const PPE_TYPES = ["Safety Helmet", "Safety Shoes", "Hi-Vis Vest", "Gloves", "Goggles", "Ear Plugs", "Harness", "Respirator"] as const
const PPE_STATUSES = ["Compliant", "Non-Compliant", "Partially Compliant", "Expired", "Missing"] as const
const ZONES = ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E", "Loading Dock", "Dispatch Area", "Cold Storage", "Hazardous Zone", "Receiving Yard"] as const
const INDIAN_NAMES = ["Aarav Sharma", "Priya Patel", "Rohit Kumar", "Sneha Reddy", "Vikram Singh", "Anjali Gupta", "Arjun Mehta", "Divya Nair", "Karthik Iyer", "Pooja Das", "Manish Verma", "Ritu Joshi", "Sanjay Rathore", "Neha Saxena", "Deepak Chauhan"] as const
const COMPLIANCE_TYPES = ["OSHA Equivalent", "Factory Act", "BIS Standards", "Fire Safety Act", "Environmental", "Electrical Code", "Building Safety", "Hazardous Materials"] as const
const AUDIT_STATUSES = ["Compliant", "Major NC", "Minor NC", "Observation", "Not Audited"] as const
const COLORS = ["#059669", "#e11d48", "#d97706", "#3b82f6", "#7c3aed", "#0891b2", "#6366f1", "#f97316"]

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

function InspectionTypeBadge({ type }: { type: string }) {
  const idx = INSPECTION_TYPES.indexOf(type as typeof INSPECTION_TYPES[number])
  return (
    <Badge variant="outline" className="badge-interactive wsm-type-badge gap-1 text-[10px] px-2 py-0.5 font-medium">
      {idx >= 0 ? INSPECTION_EMOJI[idx] : "📋"} {type}
    </Badge>
  )
}

function InspectionStatusBadge({ status }: { status: string }) {
  const pulse = ["In Progress", "Overdue"].includes(status)
  const colorMap: Record<string, string> = {
    Scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    "In Progress": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    Passed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    Failed: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    Rectified: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400",
    Overdue: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
  }
  return (
    <Badge variant="outline" className={`wsm-status-badge gap-1 text-[10px] px-2 py-0.5 font-medium ${pulse ? "wsm-pulse-warning" : ""} ${colorMap[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </Badge>
  )
}

function IncidentTypeBadge({ type }: { type: string }) {
  const colorMap: Record<string, string> = {
    "Slip/Fall": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    "Equipment Malfunction": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    "Fire Alert": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
    "Chemical Spill": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
    "Electrical Hazard": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
    "Forklift Incident": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    "Rack Collapse": "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
    "Heat Exhaustion": "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
  }
  return (
    <Badge variant="outline" className={`wsm-incident-badge gap-1 text-[10px] px-2 py-0.5 font-medium ${colorMap[type] || "bg-gray-100 text-gray-700"}`}>
      {type}
    </Badge>
  )
}

function SeverityBadge({ severity }: { severity: string }) {
  const pulse = ["Critical", "Major"].includes(severity)
  const glow = severity === "Critical"
  const colorMap: Record<string, string> = {
    Critical: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    Major: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
    Moderate: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    Minor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    "Near Miss": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400",
  }
  return (
    <Badge variant="outline" className={`wsm-severity-badge gap-1 text-[10px] px-2 py-0.5 font-bold ${pulse ? (glow ? "wsm-pulse-critical-glow" : "wsm-pulse-warning") : ""} ${colorMap[severity] || "bg-gray-100 text-gray-700"}`}>
      <AlertTriangle className="h-3 w-3" /> {severity}
    </Badge>
  )
}

function IncidentStatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    Reported: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    Investigating: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    Resolved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    Closed: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
    Escalated: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  }
  return (
    <Badge variant="outline" className={`wsm-istatus-badge gap-1 text-[10px] px-2 py-0.5 font-medium ${colorMap[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </Badge>
  )
}

function PPETypeBadge({ type }: { type: string }) {
  const emoji = ["🪖", "👢", "🦺", "🧤", "🥽", "👂", "🪢", "😷"]
  const idx = PPE_TYPES.indexOf(type as typeof PPE_TYPES[number])
  return (
    <Badge variant="outline" className="badge-interactive wsm-ppe-type-badge gap-1 text-[10px] px-2 py-0.5 font-medium">
      {idx >= 0 ? emoji[idx] : "🛡️"} {type}
    </Badge>
  )
}

function PPEStatusBadge({ status }: { status: string }) {
  const pulse = ["Non-Compliant", "Expired"].includes(status)
  const colorMap: Record<string, string> = {
    Compliant: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    "Non-Compliant": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    "Partially Compliant": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    Expired: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
    Missing: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  }
  return (
    <Badge variant="outline" className={`wsm-ppe-status-badge gap-1 text-[10px] px-2 py-0.5 font-bold ${pulse ? "wsm-pulse-active" : ""} ${colorMap[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </Badge>
  )
}

function ComplianceTypeBadge({ type }: { type: string }) {
  return (
    <Badge variant="outline" className="badge-interactive wsm-comp-type-badge gap-1 text-[10px] px-2 py-0.5 font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
      <ShieldCheck className="h-3 w-3" /> {type}
    </Badge>
  )
}

function AuditStatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    Compliant: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    "Major NC": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    "Minor NC": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    Observation: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    "Not Audited": "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  }
  return (
    <Badge variant="outline" className={`wsm-audit-badge gap-1 text-[10px] px-2 py-0.5 font-medium ${colorMap[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </Badge>
  )
}

function SafetyScoreBar({ score }: { score: number }) {
  const color = score > 90 ? "bg-emerald-500" : score > 70 ? "bg-amber-500" : "bg-red-500"
  return (
    <div className="wsm-safety-bar flex items-center gap-2">
      <div className="h-2.5 w-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-[10px] font-bold" style={{ color: score > 90 ? "#059669" : score > 70 ? "#d97706" : "#e11d48" }}>{score}%</span>
    </div>
  )
}

function DaysTile({ days }: { days: number }) {
  const color = days > 30 ? "text-amber-600 dark:text-amber-400" : days > 7 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
  return (
    <div className={`wsm-days-tile inline-flex items-center gap-1 rounded bg-gray-50 px-2 py-0.5 text-[11px] font-bold ${color} dark:bg-gray-800`}>
      <Clock className="h-3 w-3" /> {days}d
    </div>
  )
}

function ZoneBadge({ zone }: { zone: string }) {
  return (
    <Badge variant="outline" className="badge-interactive wsm-zone-badge gap-1 text-[10px] px-2 py-0.5 font-medium bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400">
      <Factory className="h-3 w-3" /> {zone}
    </Badge>
  )
}

function InjuryTile({ count }: { count: number }) {
  const color = count > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
  return (
    <div className={`wsm-injury-tile inline-flex items-center gap-1 rounded ${count > 0 ? "bg-red-50 dark:bg-red-900/30" : "bg-emerald-50 dark:bg-emerald-900/30"} px-2 py-0.5 text-[11px] font-bold ${color}`}>
      <Heart className="h-3 w-3" /> {count} injuries
    </div>
  )
}

function CostTile({ amount }: { amount: number }) {
  return (
    <div className="wsm-cost-tile inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
      {fmtINR(amount)}
    </div>
  )
}

function RiskScoreBadge({ score }: { score: number }) {
  const color = score > 80 ? "text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40" : score > 50 ? "text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40" : "text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/40"
  return (
    <Badge variant="outline" className={`wsm-risk-score-badge gap-1 text-[10px] px-2 py-0.5 font-bold ${color}`}>
      <ShieldAlert className="h-3 w-3" /> Risk: {score}
    </Badge>
  )
}

function InspectorBadge({ name }: { name: string }) {
  return (
    <Badge variant="outline" className="badge-interactive wsm-inspector-badge gap-1 text-[10px] px-2 py-0.5 font-medium bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
      <Users className="h-3 w-3" /> {name}
    </Badge>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   Data Generation
   ═══════════════════════════════════════════════════════════════════ */
function generateData() {
  const inspections = Array.from({ length: 75 }, (_, i) => {
    const s = i * 7 + 1
    return {
      id: `INS-${String(i + 1001).padStart(4, "0")}`,
      type: INSPECTION_TYPES[i % 8],
      status: INSPECTION_STATUSES[i % 6],
      zone: ZONES[i % 10],
      inspector: INDIAN_NAMES[i % 15],
      findings: ri(0, 12, s),
      critical: ri(0, 3, s + 1),
      score: ri(55, 100, s + 2),
      nextDue: ri(1, 90, s + 3),
      lastDate: `2026-${String(ri(1, 7, s + 4)).padStart(2, "0")}-${String(ri(1, 28, s + 5)).padStart(2, "0")}`,
    }
  })
  const incidents = Array.from({ length: 70 }, (_, i) => {
    const s = i * 6 + 200
    return {
      id: `INC-${String(i + 2001).padStart(4, "0")}`,
      type: INCIDENT_TYPES[i % 8],
      severity: INCIDENT_SEVERITIES[i % 5],
      status: INCIDENT_STATUSES[i % 5],
      zone: ZONES[i % 10],
      reportedBy: INDIAN_NAMES[i % 15],
      injuries: i % 7 === 0 ? ri(1, 5, s) : 0,
      lostDays: ri(0, 30, s + 1),
      cost: ri(0, 500000, s + 2),
      date: `2026-${String(ri(1, 7, s + 3)).padStart(2, "0")}-${String(ri(1, 28, s + 4)).padStart(2, "0")}`,
      rootCause: ["Human Error", "Equipment Fault", "Procedural Gap", "Environmental", "Training Deficit", "Maintenance Overdue"][i % 6],
    }
  })
  const ppe = Array.from({ length: 55 }, (_, i) => {
    const s = i * 5 + 400
    return {
      id: `PPE-${String(i + 3001).padStart(4, "0")}`,
      type: PPE_TYPES[i % 8],
      status: PPE_STATUSES[i % 5],
      zone: ZONES[i % 10],
      issuedTo: INDIAN_NAMES[i % 15],
      expiryDate: `2026-${String(ri(1, 12, s + 1)).padStart(2, "0")}-${String(ri(1, 28, s + 2)).padStart(2, "0")}`,
      lastInspected: `2026-${String(ri(1, 6, s + 3)).padStart(2, "0")}-${String(ri(1, 28, s + 4)).padStart(2, "0")}`,
      complianceRate: ri(60, 100, s),
    }
  })
  const audits = Array.from({ length: 65 }, (_, i) => {
    const s = i * 4 + 600
    return {
      id: `AUD-${String(i + 4001).padStart(4, "0")}`,
      type: COMPLIANCE_TYPES[i % 8],
      status: AUDIT_STATUSES[i % 5],
      auditor: INDIAN_NAMES[i % 15],
      score: ri(40, 100, s + 1),
      findings: ri(0, 15, s + 2),
      riskScore: ri(10, 95, s + 3),
      lastAudit: `2026-${String(ri(1, 7, s)).padStart(2, "0")}-${String(ri(1, 28, s + 1)).padStart(2, "0")}`,
    }
  })
  return { INSPECTION_TYPES, INSPECTION_STATUSES, INCIDENT_TYPES, INCIDENT_SEVERITIES, INCIDENT_STATUSES, PPE_TYPES, PPE_STATUSES, ZONES, INDIAN_NAMES, COMPLIANCE_TYPES, AUDIT_STATUSES, inspections, incidents, ppe, audits }
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
export default function WarehouseSafetyManagementView() {
  const data = useMemo(() => generateData(), [])
  const [activeTab, setActiveTab] = useState("0")
  const [searchQ, setSearchQ] = useState("")
  const [sortField, setSortField] = useState("")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState<typeof data.incidents[0] | null>(null)
  const { toast } = useToast()

  const handleSort = (f: string) => {
    if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortField(f); setSortDir("asc") }
  }

  const kpis = [
    { label: "Safety Score", value: `${Math.round(data.inspections.reduce((s, x) => s + x.score, 0) / data.inspections.length)}%`, icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "Total Incidents", value: data.incidents.length, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
    { label: "Critical Incidents", value: data.incidents.filter(x => x.severity === "Critical").length, icon: Flame, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { label: "Days Without Loss", value: `${ri(15, 120, 999)}`, icon: Award, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "PPE Compliance", value: `${Math.round(data.ppe.filter(x => x.status === "Compliant").length / data.ppe.length * 100)}%`, icon: HardHat, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "Open Inspections", value: data.inspections.filter(x => x.status === "Scheduled" || x.status === "In Progress").length, icon: Search, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { label: "Total Injury Cost", value: fmtINR(data.incidents.reduce((s, x) => s + x.cost, 0)), icon: TrendingUp, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-900/20" },
    { label: "Compliance Audits", value: data.audits.filter(x => x.status === "Compliant").length, icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
  ]

  const monthlyIncidents = Array.from({ length: 12 }, (_, i) => ({ month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i], Incidents: ri(2, 15, i + 10), Injuries: ri(0, 5, i + 50) }))
  const typePie = INCIDENT_TYPES.map((t, i) => ({ name: t, value: ri(3, 20, i + 100) }))
  const zoneBar = ZONES.map((z, i) => ({ zone: z, Score: ri(50, 100, i + 150) }))

  const filteredInspections = sortedData(filterData(data.inspections, searchQ), sortField, sortDir)
  const filteredIncidents = sortedData(filterData(data.incidents, searchQ), sortField, sortDir)
  const filteredPPE = sortedData(filterData(data.ppe, searchQ), sortField, sortDir)

  const SortHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <Button variant="ghost" size="sm" className="wsm-sort-header h-8 px-2 text-[10px] font-semibold hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => handleSort(field)}>
      <span className="flex items-center gap-1">{children}<ArrowUpDown className="h-3 w-3" /></span>
    </Button>
  )

  return (
    <div className="wsm-root space-y-4 p-4">
      <PageHeader title="Warehouse Safety Management" description="Safety inspections, incident tracking, PPE compliance, audit management and risk monitoring" />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="wsm-tabs space-y-4">
        <TabsList className="wsm-tabs-list h-10 rounded-lg bg-gray-100 dark:bg-gray-800">
          {["Safety Dashboard", "Safety Inspections", "Incident Tracker", "PPE Compliance", "Audit & Compliance", "Safety Analytics"].map((t, i) => (
            <TabsTrigger key={i} value={String(i)} className="wsm-tab-trigger text-xs font-medium px-3">{t}</TabsTrigger>
          ))}
        </TabsList>

        {/* ══════════ Tab 0: Dashboard ══════════ */}
        <TabsContent value="0" className="wsm-tab-content space-y-4">
          <div className="wsm-kpi-grid grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-4">
            {kpis.map((k, i) => (
              <Card key={i} className={`wsm-kpi-card group hover:shadow-md transition-all duration-300 ${k.bg}`}>
                <CardContent className="glass-subtle flex items-center gap-3 p-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ${k.color}`}><k.icon className="h-5 w-5" /></div>
                  <div className="min-w-0"><p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 truncate">{k.label}</p><p className={`text-lg font-bold ${k.color}`}>{k.value}</p></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="wsm-chart-grid grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="wsm-chart-card hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Monthly Incidents</CardTitle></CardHeader>
              <CardContent><AreaChart data={monthlyIncidents}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Area type="monotone" dataKey="Incidents" stackId="a" fill="#e11d48" /><Area type="monotone" dataKey="Injuries" stackId="a" fill="#d97706" /></AreaChart></CardContent>
            </Card>
            <Card className="wsm-chart-card hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Incident Types</CardTitle></CardHeader>
              <CardContent><PieChart><Pie data={typePie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{typePie.map((_, i) => <Cell key={i} fill={COLORS[i % 8]} />)}</Pie><Tooltip /></PieChart></CardContent>
            </Card>
            <Card className="wsm-chart-card hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Zone Safety Scores</CardTitle></CardHeader>
              <CardContent><BarChart data={zoneBar}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="zone" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" height={60} /><YAxis tick={{ fontSize: 10 }} domain={[0, 100]} /><Tooltip /><Bar dataKey="Score" fill="#059669" radius={[4, 4, 0, 0]} /></BarChart></CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ══════════ Tab 1: Safety Inspections ══════════ */}
        <TabsContent value="1" className="wsm-tab-content space-y-4">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /><Input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search inspections..." className="pl-9 h-9 text-sm" /></div>
            <Badge variant="outline" className="badge-interactive text-xs">{filteredInspections.length} inspections</Badge>
          </div>
          <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-900">
            <table className="wsm-inspection-table w-full text-xs">
              <thead><tr className="border-b bg-gray-50 dark:bg-gray-800"><th className="p-2 text-left">ID</th><th className="p-2 text-left">Type</th><th className="p-2 text-left"><SortHeader field="status">Status</SortHeader></th><th className="p-2 text-left">Zone</th><th className="p-2 text-left">Inspector</th><th className="p-2 text-left">Findings</th><th className="p-2 text-left"><SortHeader field="score">Score</SortHeader></th><th className="p-2 text-left">Next Due</th></tr></thead>
              <tbody>
                {filteredInspections.map((insp) => (
                  <tr key={insp.id} className="wsm-table-row border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-2 font-mono font-semibold">{insp.id}</td>
                    <td className="p-2"><InspectionTypeBadge type={insp.type} /></td>
                    <td className="p-2"><InspectionStatusBadge status={insp.status} /></td>
                    <td className="p-2"><ZoneBadge zone={insp.zone} /></td>
                    <td className="p-2"><InspectorBadge name={insp.inspector} /></td>
                    <td className="p-2 text-[10px] font-semibold">{insp.findings} ({insp.critical} critical)</td>
                    <td className="p-2"><SafetyScoreBar score={insp.score} /></td>
                    <td className="p-2"><DaysTile days={insp.nextDue} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ══════════ Tab 2: Incident Tracker ══════════ */}
        <TabsContent value="2" className="wsm-tab-content space-y-4">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /><Input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search incidents..." className="pl-9 h-9 text-sm" /></div>
            <Badge variant="outline" className="badge-interactive text-xs">{filteredIncidents.length} incidents</Badge>
          </div>
          <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-900">
            <table className="wsm-incident-table w-full text-xs">
              <thead><tr className="border-b bg-gray-50 dark:bg-gray-800"><th className="p-2 text-left">ID</th><th className="p-2 text-left"><SortHeader field="severity">Severity</SortHeader></th><th className="p-2 text-left">Type</th><th className="p-2 text-left"><SortHeader field="status">Status</SortHeader></th><th className="p-2 text-left">Zone</th><th className="p-2 text-left">Injuries</th><th className="p-2 text-left"><SortHeader field="cost">Cost</SortHeader></th><th className="p-2 text-left">Root Cause</th><th className="p-2 text-center">Action</th></tr></thead>
              <tbody>
                {filteredIncidents.map((inc) => (
                  <tr key={inc.id} className="wsm-table-row border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-2 font-mono font-semibold">{inc.id}</td>
                    <td className="p-2"><SeverityBadge severity={inc.severity} /></td>
                    <td className="p-2"><IncidentTypeBadge type={inc.type} /></td>
                    <td className="p-2"><IncidentStatusBadge status={inc.status} /></td>
                    <td className="p-2"><ZoneBadge zone={inc.zone} /></td>
                    <td className="p-2"><InjuryTile count={inc.injuries} /></td>
                    <td className="p-2"><CostTile amount={inc.cost} /></td>
                    <td className="p-2 text-[10px] font-medium text-gray-600 dark:text-gray-400">{inc.rootCause}</td>
                    <td className="p-2 text-center"><Button variant="ghost" size="sm" className="wsm-view-btn h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30" onClick={() => { setSelectedIncident(inc); setSheetOpen(true); toast.success("Viewing Incident", `${inc.id} details opened`) }}><Eye className="h-3.5 w-3.5" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ══════════ Tab 3: PPE Compliance ══════════ */}
        <TabsContent value="3" className="wsm-tab-content space-y-4">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /><Input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search PPE..." className="pl-9 h-9 text-sm" /></div>
            <Badge variant="outline" className="badge-interactive text-xs">{filteredPPE.length} records</Badge>
          </div>
          <div className="wsm-ppe-grid grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {data.ppe.map((p) => (
              <Card key={p.id} className={`wsm-ppe-card group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden ${p.status === "Compliant" ? "border-l-4 border-l-emerald-500" : p.status === "Non-Compliant" ? "border-l-4 border-l-red-500" : "border-l-4 border-l-amber-500"}`}>
                <div className={`wsm-ppe-card-header p-3 ${p.status === "Compliant" ? "bg-gradient-to-r from-emerald-500 to-emerald-600" : p.status === "Non-Compliant" ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gradient-to-r from-amber-500 to-amber-600"} text-white`}>
                  <div className="flex items-center justify-between"><PPETypeBadge type={p.type} /><PPEStatusBadge status={p.status} /></div>
                  <p className="text-lg font-bold mt-1">{p.id}</p>
                </div>
                <CardContent className="glass-subtle p-3 space-y-2">
                  <div className="flex items-center justify-between"><span className="text-[10px] text-gray-500 dark:text-gray-400">Zone</span><ZoneBadge zone={p.zone} /></div>
                  <div className="flex items-center justify-between"><span className="text-[10px] text-gray-500 dark:text-gray-400">Issued To</span><InspectorBadge name={p.issuedTo} /></div>
                  <div className="flex items-center justify-between"><span className="text-[10px] text-gray-500 dark:text-gray-400">Compliance</span><SafetyScoreBar score={p.complianceRate} /></div>
                  <div className="flex items-center justify-between"><span className="text-[10px] text-gray-500 dark:text-gray-400">Expiry</span><span className="text-[10px] font-medium">{p.expiryDate}</span></div>
                  <div className="flex items-center justify-between"><span className="text-[10px] text-gray-500 dark:text-gray-400">Last Inspected</span><span className="text-[10px] font-medium">{p.lastInspected}</span></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ══════════ Tab 4: Audit & Compliance ══════════ */}
        <TabsContent value="4" className="wsm-tab-content space-y-4">
          <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-900">
            <table className="wsm-audit-table w-full text-xs">
              <thead><tr className="border-b bg-gray-50 dark:bg-gray-800"><th className="p-2 text-left">ID</th><th className="p-2 text-left">Type</th><th className="p-2 text-left">Status</th><th className="p-2 text-left">Auditor</th><th className="p-2 text-left"><SortHeader field="score">Score</SortHeader></th><th className="p-2 text-left">Findings</th><th className="p-2 text-left">Risk</th><th className="p-2 text-left">Last Audit</th></tr></thead>
              <tbody>
                {data.audits.map((aud) => (
                  <tr key={aud.id} className="wsm-table-row border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-2 font-mono font-semibold">{aud.id}</td>
                    <td className="p-2"><ComplianceTypeBadge type={aud.type} /></td>
                    <td className="p-2"><AuditStatusBadge status={aud.status} /></td>
                    <td className="p-2"><InspectorBadge name={aud.auditor} /></td>
                    <td className="p-2"><SafetyScoreBar score={aud.score} /></td>
                    <td className="p-2 text-[10px] font-semibold">{aud.findings}</td>
                    <td className="p-2"><RiskScoreBadge score={aud.riskScore} /></td>
                    <td className="p-2 text-[10px] font-medium">{aud.lastAudit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ══════════ Tab 5: Analytics ══════════ */}
        <TabsContent value="5" className="wsm-tab-content space-y-4">
          <div className="wsm-kpi-grid grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-4">
            {[
              { label: "Avg Safety Score", value: `${Math.round(data.audits.reduce((s, a) => s + a.score, 0) / data.audits.length)}%`, icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
              { label: "Incident Rate", value: `${(data.incidents.length / 12).toFixed(1)}/mo`, icon: Activity, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
              { label: "Lost Work Days", value: data.incidents.reduce((s, x) => s + x.lostDays, 0), icon: Clock, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
              { label: "Total Cost", value: fmtINR(data.incidents.reduce((s, x) => s + x.cost, 0)), icon: TrendingUp, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/20" },
            ].map((k, i) => (
              <Card key={i} className={`wsm-kpi-card group hover:shadow-md transition-all duration-300 ${k.bg}`}>
                <CardContent className="glass-subtle flex items-center gap-3 p-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ${k.color}`}><k.icon className="h-5 w-5" /></div>
                  <div className="min-w-0"><p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 truncate">{k.label}</p><p className={`text-lg font-bold ${k.color}`}>{k.value}</p></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="wsm-chart-grid grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="wsm-chart-card hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Safety Trend (12 months)</CardTitle></CardHeader>
              <CardContent><LineChart data={Array.from({ length: 12 }, (_, i) => ({ month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i], Score: ri(70, 100, i + 200), Target: 90 }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} domain={[50, 100]} /><Tooltip /><Line type="monotone" dataKey="Score" stroke="#059669" strokeWidth={2} /><Line type="monotone" dataKey="Target" stroke="#e11d48" strokeWidth={1.5} strokeDasharray="5 5" /></LineChart></CardContent>
            </Card>
            <Card className="wsm-chart-card hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Incident Severity Distribution</CardTitle></CardHeader>
              <CardContent><PieChart><Pie data={INCIDENT_SEVERITIES.map((s, i) => ({ name: s, value: ri(3, 25, i + 300) }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{INCIDENT_SEVERITIES.map((_, i) => <Cell key={i} fill={["#e11d48", "#f97316", "#d97706", "#059669", "#3b82f6"][i]} />)}</Pie><Tooltip /></PieChart></CardContent>
            </Card>
            <Card className="wsm-chart-card hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Top Root Causes</CardTitle></CardHeader>
              <CardContent><BarChart data={["Human Error", "Equipment Fault", "Procedural Gap", "Environmental", "Training Deficit", "Maintenance Overdue"].map((c, i) => ({ cause: c, count: ri(3, 20, i + 400) }))} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" tick={{ fontSize: 10 }} /><YAxis dataKey="cause" type="category" tick={{ fontSize: 9 }} width={100} /><Tooltip /><Bar dataKey="count" fill="#e11d48" radius={[0, 4, 4, 0]} /></BarChart></CardContent>
            </Card>
            <Card className="wsm-chart-card hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Cost by Type (6 months)</CardTitle></CardHeader>
              <CardContent><AreaChart data={Array.from({ length: 6 }, (_, i) => ({ month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i], Medical: ri(50, 200, i + 500), Legal: ri(10, 80, i + 550), Equipment: ri(20, 100, i + 600), Productivity: ri(30, 150, i + 650) }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Area type="monotone" dataKey="Medical" stackId="a" fill="#e11d48" /><Area type="monotone" dataKey="Legal" stackId="a" fill="#7c3aed" /><Area type="monotone" dataKey="Equipment" stackId="a" fill="#3b82f6" /><Area type="monotone" dataKey="Productivity" stackId="a" fill="#d97706" /></AreaChart></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ══════════ Sheet ══════════ */}
      <Sheet open={!!(sheetOpen && selectedIncident)} onOpenChange={o => { setSheetOpen(o); if (!o) setSelectedIncident(null) }}>
        <SheetContent className="wsm-sheet w-full sm:w-[540px]">
          {selectedIncident && (
            <>
              <div className="wsm-sheet-header bg-gradient-to-r from-red-600 via-red-500 to-amber-500 p-6 mx-6 mt-6 rounded-xl text-white">
                <SheetHeader><SheetTitle className="text-white">Incident Detail</SheetTitle></SheetHeader>
                <p className="text-sm opacity-80 mt-1">{selectedIncident.id} | {selectedIncident.type}</p>
              </div>
              <ScrollArea className="mt-4 px-6">
                <div className="space-y-3 pb-6">
                  <div className="wsm-detail-grid grid grid-cols-2 gap-3">
                    <div className="wsm-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">Severity</p><SeverityBadge severity={selectedIncident.severity} /></div>
                    <div className="wsm-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">Status</p><IncidentStatusBadge status={selectedIncident.status} /></div>
                    <div className="wsm-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">Type</p><IncidentTypeBadge type={selectedIncident.type} /></div>
                    <div className="wsm-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">Zone</p><ZoneBadge zone={selectedIncident.zone} /></div>
                    <div className="wsm-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">Injuries</p><InjuryTile count={selectedIncident.injuries} /></div>
                    <div className="wsm-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">Lost Days</p><DaysTile days={selectedIncident.lostDays} /></div>
                    <div className="wsm-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">Cost</p><CostTile amount={selectedIncident.cost} /></div>
                    <div className="wsm-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800"><p className="text-[10px] text-gray-500 dark:text-gray-400">Reported By</p><p className="text-[11px] font-semibold">{selectedIncident.reportedBy}</p></div>
                    <div className="wsm-detail-item p-3 rounded-lg bg-gray-50 dark:bg-gray-800 col-span-2"><p className="text-[10px] text-gray-500 dark:text-gray-400">Root Cause</p><p className="text-[11px] font-semibold">{selectedIncident.rootCause}</p></div>
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
