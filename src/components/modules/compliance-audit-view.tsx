"use client"

import { useState, useMemo, useEffect } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DataTable, type Column } from "@/components/shared/data-table"
import {
  ShieldCheck,
  ShieldAlert,
  FileCheck2,
  ScrollText,
  Lock,
  Unlock,
  UserCheck,
  Building2,
  Eye,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Search,
  KeyRound,
  History,
  Award,
  Scale,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast-helper"
import { ExportButton } from "@/components/shared/export-button"
import {
  ComplianceDetailDrawer,
  type ComplianceDomainDetail,
} from "@/components/shared/compliance-detail-drawer"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts"

// ── Types ────────────────────────────────────────────────────────────────────

type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "LOGIN"
  | "LOGOUT"
  | "EXPORT"
  | "PERMISSION_CHANGE"
  | "CONFIG_CHANGE"
  | "VIEW_SENSITIVE"

type AuditOutcome = "success" | "failure" | "denied"

interface AuditEntry {
  id: string
  timestamp: string
  actor: string
  actorRole: string
  action: AuditAction
  resource: string
  resourceType: "shipment" | "inventory" | "user" | "config" | "report" | "warehouse" | "cost"
  outcome: AuditOutcome
  ipAddress: string
  details: string
  riskScore: number
}

interface ComplianceDomain {
  id: string
  name: string
  icon: typeof ShieldCheck
  score: number
  target: number
  status: "compliant" | "at-risk" | "non-compliant"
  lastAudit: string
  findings: number
  criticalFindings: number
  description: string
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const auditEntries: AuditEntry[] = [
  { id: "AUD-9281", timestamp: "2026-07-26 10:24:11", actor: "Rajesh Kumar", actorRole: "Warehouse Manager", action: "UPDATE", resource: "SHP-4821 (Maruti shipment)", resourceType: "shipment", outcome: "success", ipAddress: "10.4.12.81", details: "Updated ETA from 14:30 to 15:15 — carrier delay acknowledged", riskScore: 12 },
  { id: "AUD-9280", timestamp: "2026-07-26 10:21:55", actor: "system", actorRole: "Automation", action: "EXPORT", resource: "Daily KPI Report", resourceType: "report", outcome: "success", ipAddress: "internal", details: "Auto-generated daily KPI export scheduled at 10:21", riskScore: 5 },
  { id: "AUD-9279", timestamp: "2026-07-26 10:18:42", actor: "Priya Sharma", actorRole: "Supervisor", action: "VIEW_SENSITIVE", resource: "Vendor pricing sheet — Bosch Ltd", resourceType: "report", outcome: "success", ipAddress: "10.4.12.105", details: "Accessed confidential pricing data for SLA review", riskScore: 38 },
  { id: "AUD-9278", timestamp: "2026-07-26 10:15:09", actor: "unknown", actorRole: "—", action: "LOGIN", resource: "Operator account: op_user_4821", resourceType: "user", outcome: "failure", ipAddress: "203.0.113.55", details: "5 failed login attempts from external IP — account locked for 30 min", riskScore: 88 },
  { id: "AUD-9277", timestamp: "2026-07-26 10:12:33", actor: "Amit Patel", actorRole: "Regional Manager", action: "PERMISSION_CHANGE", resource: "User: Vikram Singh — granted Cost Analytics access", resourceType: "user", outcome: "success", ipAddress: "10.4.12.42", details: "Role escalation approved by RM. Effective immediately.", riskScore: 55 },
  { id: "AUD-9276", timestamp: "2026-07-26 10:08:17", actor: "Suresh Reddy", actorRole: "Operator", action: "DELETE", resource: "Inventory SKU 7821", resourceType: "inventory", outcome: "denied", ipAddress: "10.4.12.119", details: "Delete blocked — operator role lacks delete permission on inventory", riskScore: 72 },
  { id: "AUD-9275", timestamp: "2026-07-26 10:04:50", actor: "Deepak Nair", actorRole: "Supervisor", action: "CONFIG_CHANGE", resource: "Dock Scheduler — max concurrent bookings", resourceType: "config", outcome: "success", ipAddress: "10.4.12.105", details: "Increased dock-3 concurrent booking limit from 2 to 3", riskScore: 28 },
  { id: "AUD-9274", timestamp: "2026-07-26 09:58:21", actor: "Kiran Joshi", actorRole: "Warehouse Manager", action: "CREATE", resource: "New warehouse zone — Bangalore/Zone-E", resourceType: "warehouse", outcome: "success", ipAddress: "10.4.12.81", details: "Created zone E for automotive parts staging. 240 sqm added.", riskScore: 18 },
  { id: "AUD-9273", timestamp: "2026-07-26 09:52:08", actor: "system", actorRole: "Automation", action: "UPDATE", resource: "Cost threshold alert rule", resourceType: "config", outcome: "success", ipAddress: "internal", details: "Auto-adjusted threshold based on Q3 baseline recalibration", riskScore: 8 },
  { id: "AUD-9272", timestamp: "2026-07-26 09:48:34", actor: "Manish Gupta", actorRole: "Operator", action: "LOGIN", resource: "Session started", resourceType: "user", outcome: "success", ipAddress: "10.4.12.119", details: "MFA verified via authenticator app", riskScore: 4 },
  { id: "AUD-9271", timestamp: "2026-07-26 09:45:12", actor: "Vikram Singh", actorRole: "Operator", action: "EXPORT", resource: "Inventory snapshot — Kolkata", resourceType: "report", outcome: "success", ipAddress: "10.4.12.142", details: "Standard daily inventory CSV export", riskScore: 11 },
  { id: "AUD-9270", timestamp: "2026-07-26 09:42:03", actor: "unknown", actorRole: "—", action: "LOGIN", resource: "Admin account: admin@autoflow.in", resourceType: "user", outcome: "failure", ipAddress: "198.51.100.22", details: "Failed admin login from blacklisted IP range — auto-reported to SOC", riskScore: 95 },
]

const complianceDomains: ComplianceDomain[] = [
  {
    id: "iso-9001",
    name: "ISO 9001:2015",
    icon: Award,
    score: 94,
    target: 90,
    status: "compliant",
    lastAudit: "2026-05-14",
    findings: 3,
    criticalFindings: 0,
    description: "Quality Management Systems — process consistency, document control, corrective actions.",
  },
  {
    id: "iso-27001",
    name: "ISO 27001:2022",
    icon: Lock,
    score: 88,
    target: 90,
    status: "at-risk",
    lastAudit: "2026-04-22",
    findings: 7,
    criticalFindings: 1,
    description: "Information Security Management — access control, encryption, incident response.",
  },
  {
    id: "gdpr",
    name: "DPDP Act 2023",
    icon: ShieldCheck,
    score: 91,
    target: 85,
    status: "compliant",
    lastAudit: "2026-06-08",
    findings: 2,
    criticalFindings: 0,
    description: "Digital Personal Data Protection Act — consent management, data subject rights.",
  },
  {
    id: "sox",
    name: "SOX-equivalent",
    icon: Scale,
    score: 76,
    target: 80,
    status: "at-risk",
    lastAudit: "2026-03-30",
    findings: 11,
    criticalFindings: 2,
    description: "Financial controls — segregation of duties, audit trail integrity, change management.",
  },
  {
    id: "osha",
    name: "OSH Code 2020",
    icon: ShieldAlert,
    score: 96,
    target: 92,
    status: "compliant",
    lastAudit: "2026-06-20",
    findings: 1,
    criticalFindings: 0,
    description: "Occupational Safety & Health — PPE compliance, hazard reporting, training records.",
  },
  {
    id: "gst",
    name: "GST Compliance",
    icon: FileCheck2,
    score: 99,
    target: 95,
    status: "compliant",
    lastAudit: "2026-07-01",
    findings: 0,
    criticalFindings: 0,
    description: "GST e-invoicing, e-way bill generation, HSN code accuracy, monthly reconciliation.",
  },
]

const riskDistribution = [
  { range: "0-20", label: "Low", count: 842, color: "hsl(var(--chart-2))" },
  { range: "21-50", label: "Medium", count: 124, color: "hsl(var(--chart-3))" },
  { range: "51-80", label: "High", count: 28, color: "hsl(var(--chart-4))" },
  { range: "81-100", label: "Critical", count: 6, color: "hsl(var(--chart-5))" },
]

// ── Component ─────────────────────────────────────────────────────────────────

export function ComplianceAuditView() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState<string>("all")
  const [outcomeFilter, setOutcomeFilter] = useState<string>("all")
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null)
  const [drawerDomain, setDrawerDomain] = useState<ComplianceDomain | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(t)
  }, [])

  const filteredEntries = useMemo(() => {
    return auditEntries.filter((e) => {
      if (actionFilter !== "all" && e.action !== actionFilter) return false
      if (outcomeFilter !== "all" && e.outcome !== outcomeFilter) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return (
          e.actor.toLowerCase().includes(q) ||
          e.resource.toLowerCase().includes(q) ||
          e.details.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [searchQuery, actionFilter, outcomeFilter])

  const overallScore = useMemo(
    () => Math.round(complianceDomains.reduce((s, d) => s + d.score, 0) / complianceDomains.length),
    []
  )

  const totalFindings = complianceDomains.reduce((s, d) => s + d.findings, 0)
  const totalCritical = complianceDomains.reduce((s, d) => s + d.criticalFindings, 0)

  const handleExportAudit = () => {
    toast.success("Audit log exported", `${filteredEntries.length} entries packaged as signed CSV`)
  }

  const handleMarkReviewed = (entry: AuditEntry) => {
    toast.info("Entry flagged for review", `${entry.id} queued for compliance officer review`)
  }

  const columns: Column<AuditEntry>[] = [
    {
      key: "id",
      header: "Audit ID",
      sortable: true,
      className: "font-mono text-xs",
      render: (v) => <span className="text-primary font-medium">{v as string}</span>,
    },
    {
      key: "timestamp",
      header: "Timestamp",
      sortable: true,
      className: "text-xs",
    },
    {
      key: "actor",
      header: "Actor",
      sortable: true,
      render: (v, row) => (
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium">
            {(row.actor === "system" ? "SY" : row.actor.split(" ").map((p) => p[0]).join("").slice(0, 2)).toUpperCase()}
          </div>
          <div>
            <div className="text-xs font-medium">{row.actor}</div>
            <div className="text-[10px] text-muted-foreground">{row.actorRole}</div>
          </div>
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      sortable: true,
      render: (v) => {
        const action = v as AuditAction
        const colorMap: Record<AuditAction, string> = {
          CREATE: "border-emerald-500/40 text-emerald-600 bg-emerald-500/5",
          UPDATE: "border-blue-500/40 text-blue-600 bg-blue-500/5",
          DELETE: "border-destructive/40 text-destructive bg-destructive/5",
          LOGIN: "border-purple-500/40 text-purple-600 bg-purple-500/5",
          LOGOUT: "border-gray-500/40 text-gray-600 bg-gray-500/5",
          EXPORT: "border-amber-500/40 text-amber-600 bg-amber-500/5",
          PERMISSION_CHANGE: "border-orange-500/40 text-orange-600 bg-orange-500/5",
          CONFIG_CHANGE: "border-indigo-500/40 text-indigo-600 bg-indigo-500/5",
          VIEW_SENSITIVE: "border-pink-500/40 text-pink-600 bg-pink-500/5",
        }
        return (
          <Badge variant="outline" className={cn("text-[10px] font-mono", colorMap[action])}>
            {action}
          </Badge>
        )
      },
    },
    {
      key: "resource",
      header: "Resource",
      render: (v, row) => (
        <div>
          <div className="text-xs font-medium truncate max-w-[280px]">{v as string}</div>
          <div className="text-[10px] text-muted-foreground uppercase">{row.resourceType}</div>
        </div>
      ),
    },
    {
      key: "outcome",
      header: "Outcome",
      sortable: true,
      render: (v) => {
        const outcome = v as AuditOutcome
        if (outcome === "success")
          return (
            <Badge variant="outline" className="badge-interactive border-emerald-500/40 text-emerald-600 text-[10px]">
              <CheckCircle2 className="h-3 w-3 mr-0.5" /> Success
            </Badge>
          )
        if (outcome === "failure")
          return (
            <Badge variant="outline" className="badge-interactive border-amber-500/40 text-amber-600 text-[10px]">
              <XCircle className="h-3 w-3 mr-0.5" /> Failure
            </Badge>
          )
        return (
          <Badge variant="outline" className="badge-interactive border-destructive/40 text-destructive text-[10px]">
            <ShieldAlert className="h-3 w-3 mr-0.5" /> Denied
          </Badge>
        )
      },
    },
    {
      key: "riskScore",
      header: "Risk",
      sortable: true,
      render: (v) => {
        const score = v as number
        const level = score < 20 ? "low" : score < 50 ? "medium" : score < 80 ? "high" : "critical"
        const colorMap = {
          low: "text-emerald-600 bg-emerald-500/10",
          medium: "text-amber-600 bg-amber-500/10",
          high: "text-orange-600 bg-orange-500/10",
          critical: "text-destructive bg-destructive/10",
        }
        return (
          <div className="flex items-center gap-2">
            <span className={cn("text-[10px] font-mono px-1.5 py-0.5 rounded", colorMap[level])}>
              {level.toUpperCase()}
            </span>
            <span className="text-xs text-muted-foreground">{score}</span>
          </div>
        )
      },
    },
    {
      key: "_actions",
      header: "",
      render: (v, row) => (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs btn-press"
          onClick={(e) => {
            e.stopPropagation()
            handleMarkReviewed(row)
          }}
        >
          <Eye className="h-3 w-3 mr-1" />
          Review
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <PageHeader
        title="Compliance & Audit Trail"
        description={`Immutable activity log · Overall compliance score ${overallScore}% · ${new Date(now).toLocaleString("en-IN")}`}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportAudit}
            className="btn-press focus-ring-primary"
          >
            <Download className="h-3.5 w-3.5" />
            Export Signed Log
          </Button>
        }
      />

      {/* Top summary cards */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <Card className="hover-lift-sm compliance-score-card overflow-hidden">
          <CardContent className="inner-glow glass-subtle p-4">
            <div className="flex items-start justify-between">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <Badge variant="outline" className="badge-interactive border-emerald-500/40 text-emerald-600 text-[10px]">
                PASSING
              </Badge>
            </div>
            <div className="mt-2 text-3xl font-bold">{overallScore}<span className="text-base text-muted-foreground">%</span></div>
            <div className="text-xs text-muted-foreground mt-0.5">Overall Compliance</div>
            <Progress value={overallScore} className="h-1 mt-2" />
          </CardContent>
        </Card>
        <Card className="hover-lift-sm compliance-findings-card overflow-hidden">
          <CardContent className="inner-glow glass-subtle p-4">
            <div className="flex items-start justify-between">
              <ScrollText className="h-5 w-5 text-blue-500" />
              <Badge variant="outline" className="badge-interactive text-[10px]">{complianceDomains.length} domains</Badge>
            </div>
            <div className="mt-2 text-3xl font-bold">{totalFindings}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Open Findings</div>
            <div className="mt-2 text-[10px] text-muted-foreground">Last audit: {complianceDomains[0].lastAudit}</div>
          </CardContent>
        </Card>
        <Card className="hover-lift-sm compliance-critical-card overflow-hidden">
          <CardContent className="inner-glow glass-subtle p-4">
            <div className="flex items-start justify-between">
              <ShieldAlert className="h-5 w-5 text-destructive" />
              <Badge variant="outline" className="badge-interactive border-destructive/40 text-destructive text-[10px]">
                PRIORITY
              </Badge>
            </div>
            <div className="mt-2 text-3xl font-bold text-destructive">{totalCritical}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Critical Findings</div>
            <div className="mt-2 text-[10px] text-muted-foreground">Requires 24h remediation</div>
          </CardContent>
        </Card>
        <Card className="hover-lift-sm compliance-events-card overflow-hidden">
          <CardContent className="inner-glow glass-subtle p-4">
            <div className="flex items-start justify-between">
              <History className="h-5 w-5 text-purple-500" />
              <Badge variant="outline" className="badge-interactive text-[10px]">Last 24h</Badge>
            </div>
            <div className="mt-2 text-3xl font-bold">1,038</div>
            <div className="text-xs text-muted-foreground mt-0.5">Audit Events</div>
            <div className="mt-2 text-[10px] text-muted-foreground">6 flagged for review</div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance domains grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            Compliance Frameworks
          </CardTitle>
          <CardDescription>Score against industry-standard frameworks (last 90 days)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {complianceDomains.map((d) => (
              <ComplianceDomainCard
                key={d.id}
                domain={d}
                onOpen={(dom) => {
                  setDrawerDomain(dom)
                  setDrawerOpen(true)
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk distribution + Radial overall */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover-lift-sm md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-primary" />
              Event Risk Distribution (Last 30 days)
            </CardTitle>
            <CardDescription>Histogram of audit events by risk score band</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[220px] w-full">
              <BarChart data={riskDistribution} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Scale className="h-4 w-4 text-primary" />
              Composite Score
            </CardTitle>
            <CardDescription>Weighted across all frameworks</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[220px] w-full">
              <RadialBarChart
                innerRadius="65%"
                outerRadius="100%"
                data={[{ value: overallScore, fill: "hsl(var(--primary))" }]}
                startAngle={90}
                endAngle={90 - (overallScore / 100) * 360}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar dataKey="value" background cornerRadius={8} />
              </RadialBarChart>
            </ChartContainer>
            <div className="-mt-[140px] text-center pointer-events-none">
              <div className="text-3xl font-bold">{overallScore}%</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Compliant</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit log table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ScrollText className="h-4 w-4 text-primary" />
            Immutable Audit Trail
          </CardTitle>
          <CardDescription>
            Every privileged action across all warehouses · Tamper-evident · Hash-chained
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search actor, resource, details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-64 pl-8 text-xs focus-ring-primary"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="h-8 w-40 text-xs">
                <Filter className="h-3 w-3 mr-1" />
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All actions</SelectItem>
                <SelectItem value="CREATE" className="text-xs">CREATE</SelectItem>
                <SelectItem value="UPDATE" className="text-xs">UPDATE</SelectItem>
                <SelectItem value="DELETE" className="text-xs">DELETE</SelectItem>
                <SelectItem value="LOGIN" className="text-xs">LOGIN</SelectItem>
                <SelectItem value="EXPORT" className="text-xs">EXPORT</SelectItem>
                <SelectItem value="PERMISSION_CHANGE" className="text-xs">PERMISSION_CHANGE</SelectItem>
                <SelectItem value="CONFIG_CHANGE" className="text-xs">CONFIG_CHANGE</SelectItem>
                <SelectItem value="VIEW_SENSITIVE" className="text-xs">VIEW_SENSITIVE</SelectItem>
              </SelectContent>
            </Select>
            <Select value={outcomeFilter} onValueChange={setOutcomeFilter}>
              <SelectTrigger className="h-8 w-36 text-xs">
                <SelectValue placeholder="Outcome" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All outcomes</SelectItem>
                <SelectItem value="success" className="text-xs">Success</SelectItem>
                <SelectItem value="failure" className="text-xs">Failure</SelectItem>
                <SelectItem value="denied" className="text-xs">Denied</SelectItem>
              </SelectContent>
            </Select>
            <div className="ml-auto text-xs text-muted-foreground">
              {filteredEntries.length} of {auditEntries.length} entries
            </div>
          </div>

          <DataTable
            data={filteredEntries}
            columns={columns}
            pageSize={8}
            searchableColumns={["actor", "resource", "details"]}
            searchPlaceholder="Search audit entries..."
            getRowKey={(row) => row.id}
            onRowClick={(row) => setSelectedEntry(row)}
          />

          {/* Selected entry detail panel */}
          {selectedEntry && (
            <div className="mt-4 p-4 rounded-lg border bg-muted/20 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">{selectedEntry.id}</span>
                  <Badge variant="outline" className="badge-interactive text-[10px] font-mono">{selectedEntry.action}</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => setSelectedEntry(null)}
                >
                  Close
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <div className="text-muted-foreground text-[10px] uppercase">Timestamp</div>
                  <div className="font-mono mt-0.5">{selectedEntry.timestamp}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-[10px] uppercase">Actor</div>
                  <div className="font-medium mt-0.5">{selectedEntry.actor}</div>
                  <div className="text-[10px] text-muted-foreground">{selectedEntry.actorRole}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-[10px] uppercase">IP Address</div>
                  <div className="font-mono mt-0.5">{selectedEntry.ipAddress}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-[10px] uppercase">Risk Score</div>
                  <div className="font-mono mt-0.5 font-bold">{selectedEntry.riskScore}/100</div>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-muted-foreground text-[10px] uppercase">Resource</div>
                <div className="text-xs font-medium mt-0.5">{selectedEntry.resource}</div>
              </div>
              <div className="mt-2">
                <div className="text-muted-foreground text-[10px] uppercase">Details</div>
                <p className="text-xs mt-0.5 leading-relaxed">{selectedEntry.details}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ComplianceDetailDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        domain={drawerDomain}
        onAcknowledge={(d) => {
          toast.info("Compliance acknowledged", `${d.name} status reviewed`)
        }}
      />
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ComplianceDomainCard({
  domain,
  onOpen,
}: {
  domain: ComplianceDomain
  onOpen: (d: ComplianceDomain) => void
}) {
  const Icon = domain.icon
  const passes = domain.score >= domain.target
  const statusColor =
    domain.status === "compliant"
      ? "emerald"
      : domain.status === "at-risk"
        ? "amber"
        : "destructive"

  return (
    <Card
      onClick={() => onOpen(domain)}
      className={cn(
        "compliance-domain-card overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all",
        domain.status === "at-risk" && "border-amber-500/40",
        domain.status === "non-compliant" && "border-destructive/40"
      )}
    >
      <CardContent className="inner-glow glass-subtle p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-sm font-semibold">{domain.name}</div>
              <div className="text-[10px] text-muted-foreground">Last audit: {domain.lastAudit}</div>
            </div>
          </div>
          {passes ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          ) : (
            <Clock className="h-4 w-4 text-amber-500" />
          )}
        </div>

        <p className="mt-3 text-xs text-muted-foreground leading-relaxed line-clamp-2">{domain.description}</p>

        <div className="mt-3 flex items-baseline justify-between">
          <div className="text-2xl font-bold">{domain.score}<span className="text-sm text-muted-foreground">%</span></div>
          <div className="text-[10px] text-muted-foreground">Target: {domain.target}%</div>
        </div>
        <Progress
          value={domain.score}
          className={cn(
            "h-1.5 mt-1.5",
            statusColor === "emerald" && "[&>div]:bg-emerald-500",
            statusColor === "amber" && "[&>div]:bg-amber-500",
            statusColor === "destructive" && "[&>div]:bg-destructive"
          )}
        />

        <div className="mt-3 flex items-center justify-between text-[10px]">
          <span className="text-muted-foreground">
            {domain.findings} findings · <span className="text-destructive">{domain.criticalFindings} critical</span>
          </span>
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] capitalize",
              domain.status === "compliant" && "border-emerald-500/40 text-emerald-600",
              domain.status === "at-risk" && "border-amber-500/40 text-amber-600",
              domain.status === "non-compliant" && "border-destructive/40 text-destructive"
            )}
          >
            {domain.status.replace("-", " ")}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
