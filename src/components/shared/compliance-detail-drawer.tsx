"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Award,
  FileCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Download,
  Bell,
  User,
  Building,
  Calendar,
  TrendingUp,
  TrendingDown,
  Scale,
  ScrollText,
  Gavel,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast-helper"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

// ── Types ────────────────────────────────────────────────────────────────────

export interface ComplianceDomainDetail {
  id: string
  name: string
  icon?: typeof ShieldCheck
  score: number
  target: number
  status: "compliant" | "at-risk" | "non-compliant"
  lastAudit: string
  findings: number
  criticalFindings: number
  description: string
}

interface ComplianceDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  domain: ComplianceDomainDetail | null
  onAcknowledge?: (d: ComplianceDomainDetail) => void
}

// ── Status theming ───────────────────────────────────────────────────────────

const statusTheme = {
  compliant: {
    gradient: "from-emerald-500/15 via-emerald-500/5 to-transparent",
    border: "border-emerald-500/40",
    text: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    glow: "shadow-[0_0_30px_-8px_rgba(16,185,129,0.4)]",
    bar: "bg-emerald-500",
    icon: ShieldCheck,
  },
  "at-risk": {
    gradient: "from-amber-500/15 via-amber-500/5 to-transparent",
    border: "border-amber-500/40",
    text: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    glow: "shadow-[0_0_30px_-8px_rgba(245,158,11,0.4)]",
    bar: "bg-amber-500",
    icon: ShieldAlert,
  },
  "non-compliant": {
    gradient: "from-red-500/15 via-red-500/5 to-transparent",
    border: "border-red-500/40",
    text: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10",
    glow: "shadow-[0_0_30px_-8px_rgba(239,68,68,0.4)]",
    bar: "bg-red-500",
    icon: ShieldX,
  },
} as const

// ── Deterministic helpers ────────────────────────────────────────────────────

function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

// ── Findings (deterministic per domain) ──────────────────────────────────────

interface Finding {
  id: string
  title: string
  severity: "critical" | "major" | "minor" | "observation"
  status: "open" | "in-remediation" | "resolved" | "overdue"
  owner: string
  dueDate: string
  detectedOn: string
  description: string
  remediation: string
  evidence: string
}

function getFindings(domain: ComplianceDomainDetail): Finding[] {
  const seed = hashStr(domain.id)
  const baseFindings: Record<string, Finding[]> = {
    "iso-9001": [
      {
        id: "F-9001-01",
        title: "Document control gap — SOP-WH-014 revision not propagated",
        severity: "major",
        status: "in-remediation",
        owner: "Quality Manager",
        dueDate: "2026-08-02",
        detectedOn: "2026-05-14",
        description: "SOP revision 3.2 was approved but not distributed to Chennai and Kolkata warehouses. Operators still referencing revision 3.1.",
        remediation: "Re-distribute SOP via QMS. Acknowledge receipt from each warehouse manager within 7 days.",
        evidence: "QMS log shows distribution gap. 2 of 6 warehouses confirmed receipt.",
      },
      {
        id: "F-9001-02",
        title: "Corrective action closure delay — CAR-2025-018",
        severity: "minor",
        status: "open",
        owner: "Operations Lead",
        dueDate: "2026-07-30",
        detectedOn: "2026-04-22",
        description: "Corrective action request open for 91 days. Target closure is 60 days.",
        remediation: "Schedule root cause review meeting. Escalate to MR if not closed by 2026-07-30.",
        evidence: "CAR log age > SLA. Last update 18 days ago.",
      },
      {
        id: "F-9001-03",
        title: "Internal audit finding — picker training records incomplete",
        severity: "observation",
        status: "resolved",
        owner: "HR Manager",
        dueDate: "2026-06-15",
        detectedOn: "2026-05-14",
        description: "3 pickers at Pune warehouse missing annual refresher training records.",
        remediation: "Training completed 2026-06-10. Records uploaded to HRMS.",
        evidence: "HRMS record IDs TR-2026-0481, TR-2026-0482, TR-2026-0483.",
      },
    ],
    "iso-27001": [
      {
        id: "F-27001-01",
        title: "Access review overdue — privileged accounts",
        severity: "critical",
        status: "overdue",
        owner: "IT Security",
        dueDate: "2026-07-15",
        detectedOn: "2026-06-01",
        description: "Quarterly access review for privileged accounts (admin, dba, sysadmin) overdue by 11 days. 47 accounts in scope.",
        remediation: "Complete review by 2026-07-30. Revoke 3 accounts identified as stale.",
        evidence: "IAM export shows 47 privileged accounts. Last review 2026-04-15.",
      },
      {
        id: "F-27001-02",
        title: "Patch management gap — 4 critical CVEs unpatched >30 days",
        severity: "major",
        status: "in-remediation",
        owner: "IT Ops",
        dueDate: "2026-08-05",
        detectedOn: "2026-06-20",
        description: "4 critical CVEs on production WMS server (CVE-2026-1234, CVE-2026-1456, CVE-2026-1789, CVE-2026-1820) past patch SLA.",
        remediation: "Schedule emergency patch window. Validate in staging by 2026-07-28.",
        evidence: "Vulnerability scanner report. CVSS scores 8.5-9.4.",
      },
      {
        id: "F-27001-03",
        title: "USB device control policy not enforced on 2 endpoints",
        severity: "minor",
        status: "open",
        owner: "IT Ops",
        dueDate: "2026-08-10",
        detectedOn: "2026-07-01",
        description: "MDM policy for USB blocking not applied to 2 laptops in Hosur warehouse.",
        remediation: "Re-enroll devices in MDM. Verify policy push.",
        evidence: "MDM console shows 2 devices non-compliant.",
      },
    ],
    "dpdp-2023": [
      {
        id: "F-DPDP-01",
        title: "Data retention policy not enforced — customer PII >7 years",
        severity: "major",
        status: "in-remediation",
        owner: "Data Protection Officer",
        dueDate: "2026-08-15",
        detectedOn: "2026-06-10",
        description: "Customer PII for 2,847 records older than 7-year retention limit. Auto-purge job failing silently.",
        remediation: "Fix DPO purge job. Execute manual purge for backlog. Notify Data Principals per Section 8.",
        evidence: "DB query confirms 2,847 records >7yr. Job log shows failure since 2026-04-12.",
      },
      {
        id: "F-DPDP-02",
        title: "Consent registry mismatch — 124 customers",
        severity: "minor",
        status: "open",
        owner: "Data Protection Officer",
        dueDate: "2026-08-20",
        detectedOn: "2026-07-05",
        description: "Consent registry shows 124 customers with stale or missing consent records for marketing communications.",
        remediation: "Re-consent campaign via email/SMS. Suppress non-consented records until confirmed.",
        evidence: "CRM export vs. consent registry diff: 124 mismatches.",
      },
    ],
    "sox-equiv": [
      {
        id: "F-SOX-01",
        title: "Segregation of duties violation — cost approval",
        severity: "critical",
        status: "in-remediation",
        owner: "Finance Controller",
        dueDate: "2026-07-31",
        detectedOn: "2026-06-25",
        description: "Single user with both cost entry and approval rights on invoices >₹5L. 14 transactions affected.",
        remediation: "Reassign approval rights. Re-validate 14 transactions. Quarterly SoD review.",
        evidence: "IAM role matrix shows overlap. ERP log shows 14 transactions.",
      },
      {
        id: "F-SOX-02",
        title: "Audit log immutability not verified — last 90 days",
        severity: "major",
        status: "open",
        owner: "IT Security",
        dueDate: "2026-08-12",
        detectedOn: "2026-07-10",
        description: "WORM (write-once-read-many) verification for audit logs not performed in last 90 days.",
        remediation: "Run WORM integrity check. Document hash chain validation.",
        evidence: "Last WORM verification report: 2026-04-12.",
      },
    ],
    "osh-2020": [
      {
        id: "F-OSH-01",
        title: "Forklift operator certification expired — 3 operators",
        severity: "major",
        status: "in-remediation",
        owner: "Safety Officer",
        dueDate: "2026-07-29",
        detectedOn: "2026-07-01",
        description: "3 forklift operators at Chennai Hub have certifications expired >30 days. RTO compliance at risk.",
        remediation: "Schedule recertification training. Restrict operators from forklift use until certified.",
        evidence: "Training matrix shows 3 expired certifications.",
      },
      {
        id: "F-OSH-02",
        title: "Fire safety drill not conducted — Pune warehouse",
        severity: "minor",
        status: "open",
        owner: "Facilities Manager",
        dueDate: "2026-08-15",
        detectedOn: "2026-07-15",
        description: "Quarterly fire safety drill overdue by 12 days at Pune warehouse.",
        remediation: "Schedule drill with local fire department. Document attendance.",
        evidence: "Drill log shows last drill 2026-04-03.",
      },
    ],
    "gst-compliance": [
      {
        id: "F-GST-01",
        title: "E-way bill generation delay — 8 shipments",
        severity: "minor",
        status: "resolved",
        owner: "Tax Accountant",
        dueDate: "2026-07-20",
        detectedOn: "2026-07-10",
        description: "8 shipments had e-way bills generated >2 hours after dispatch. SLA breach.",
        remediation: "Integrated e-way bill API with dispatch workflow. Auto-trigger on dispatch event.",
        evidence: "GST portal log vs. dispatch timestamps. SLA defined as <2hr.",
      },
      {
        id: "F-GST-02",
        title: "HSN code mapping incorrect — 23 SKUs",
        severity: "major",
        status: "in-remediation",
        owner: "Tax Accountant",
        dueDate: "2026-08-08",
        detectedOn: "2026-07-08",
        description: "23 SKUs mapped to incorrect HSN codes. Potential tax liability + penalty exposure.",
        remediation: "Re-map HSN codes with tax consultant. File revised returns for affected periods.",
        evidence: "Tax consultant review report dated 2026-07-08.",
      },
    ],
  }

  const fallback: Finding[] = [
    {
      id: `F-${domain.id.toUpperCase()}-01`,
      title: "Sample finding — review required",
      severity: "minor",
      status: "open",
      owner: "Compliance Officer",
      dueDate: "2026-08-30",
      detectedOn: "2026-07-15",
      description: "Sample finding for this compliance domain. Awaiting detailed review.",
      remediation: "Schedule compliance review meeting.",
      evidence: "Pending review.",
    },
  ]

  return baseFindings[domain.id] ?? fallback
}

// ── 6-month score history ────────────────────────────────────────────────────

function getScoreHistory(domain: ComplianceDomainDetail) {
  const seed = hashStr(domain.id)
  const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"]
  return months.map((m, i) => {
    const trend = (domain.score - domain.target) * 0.6 + (i - 3) * 1.4
    const noise = ((seed >> (i * 2)) & 0x7) - 3
    return {
      month: m,
      score: Math.max(60, Math.min(100, Math.round(domain.score + trend * 0.4 + noise))),
      target: domain.target,
    }
  })
}

// ── Control coverage breakdown ───────────────────────────────────────────────

function getControlCoverage(domain: ComplianceDomainDetail) {
  const seed = hashStr(domain.id)
  const total = 40 + (seed % 20)
  const passed = Math.round(total * (domain.score / 100))
  const failed = Math.max(0, domain.criticalFindings)
  const warning = Math.max(0, domain.findings - failed)
  const notTested = Math.max(0, total - passed - failed - warning)
  return [
    { name: "Passed", value: passed, color: "#10B981" },
    { name: "Warning", value: warning, color: "#F59E0B" },
    { name: "Failed", value: failed, color: "#EF4444" },
    { name: "Not Tested", value: notTested, color: "#94A3B8" },
  ]
}

// ── Audit history ────────────────────────────────────────────────────────────

interface AuditEvent {
  date: string
  type: "internal" | "external" | "surveillance" | "recertification"
  auditor: string
  outcome: "passed" | "passed-with-findings" | "major-findings" | "failed"
  notes: string
}

function getAuditHistory(domain: ComplianceDomainDetail): AuditEvent[] {
  const seed = hashStr(domain.id)
  const baseHistory: AuditEvent[] = [
    {
      date: domain.lastAudit,
      type: "surveillance",
      auditor: "External Auditor — TUV NORD",
      outcome: "passed-with-findings",
      notes: `Surveillance audit. ${domain.findings} findings identified, ${domain.criticalFindings} critical.`,
    },
    {
      date: "2026-02-15",
      type: "internal",
      auditor: "Internal Audit Team — Priya Sharma",
      outcome: "passed-with-findings",
      notes: "Q1 internal audit. 5 findings, 0 critical. All resolved within SLA.",
    },
    {
      date: "2025-11-08",
      type: "external",
      auditor: "External Auditor — BSI Group",
      outcome: "passed",
      notes: "Stage 2 external audit. Zero major findings. Certification maintained.",
    },
    {
      date: "2025-08-22",
      type: "internal",
      auditor: "Internal Audit Team — Amit Patel",
      outcome: "passed-with-findings",
      notes: "Q3 internal audit. 3 findings, 1 critical (resolved 2025-09-15).",
    },
    {
      date: "2025-05-14",
      type: "surveillance",
      auditor: "External Auditor — TUV NORD",
      outcome: "passed-with-findings",
      notes: "Annual surveillance audit. 4 findings identified.",
    },
  ]
  // Deterministically vary order based on seed
  return baseHistory.slice(0, 4 + (seed % 2))
}

// ── Component ────────────────────────────────────────────────────────────────

const findingSeverityColor = {
  critical: "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/30",
  major: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30",
  minor: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/30",
  observation: "text-slate-600 dark:text-slate-400 bg-slate-500/10 border-slate-500/30",
} as const

const findingStatusColor = {
  open: "text-red-600 dark:text-red-400",
  "in-remediation": "text-blue-600 dark:text-blue-400",
  resolved: "text-emerald-600 dark:text-emerald-400",
  overdue: "text-red-700 dark:text-red-300 animate-pulse",
} as const

const auditOutcomeColor = {
  passed: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
  "passed-with-findings": "text-amber-600 dark:text-amber-400 bg-amber-500/10",
  "major-findings": "text-orange-600 dark:text-orange-400 bg-orange-500/10",
  failed: "text-red-600 dark:text-red-400 bg-red-500/10",
} as const

const chartConfig: ChartConfig = {
  score: { label: "Score", color: "#10B981" },
  target: { label: "Target", color: "#94a3b8" },
}

export function ComplianceDetailDrawer({
  open,
  onOpenChange,
  domain,
  onAcknowledge,
}: ComplianceDetailDrawerProps) {
  const { toast } = useToast()

  const theme = domain ? statusTheme[domain.status] : statusTheme.compliant
  const StatusIcon = theme.icon

  const findings = React.useMemo(() => (domain ? getFindings(domain) : []), [domain])
  const scoreHistory = React.useMemo(() => (domain ? getScoreHistory(domain) : []), [domain])
  const coverage = React.useMemo(() => (domain ? getControlCoverage(domain) : []), [domain])
  const auditHistory = React.useMemo(() => (domain ? getAuditHistory(domain) : []), [domain])

  if (!domain) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto" />
      </Sheet>
    )
  }

  const gap = Math.max(0, domain.target - domain.score)
  const totalControls = coverage.reduce((s, c) => s + c.value, 0)

  const handleAcknowledge = () => {
    toast.success("Acknowledged", `${domain.name} compliance status reviewed`)
    onAcknowledge?.(domain)
  }

  const handleExport = () => {
    const csv = [
      `Compliance Report - ${domain.name}`,
      `Domain,${domain.name}`,
      `Score,${domain.score}`,
      `Target,${domain.target}`,
      `Status,${domain.status}`,
      `Last Audit,${domain.lastAudit}`,
      `Total Findings,${domain.findings}`,
      `Critical Findings,${domain.criticalFindings}`,
      ``,
      `Description:,${domain.description}`,
      ``,
      `Findings:`,
      ...findings.map((f) => `${f.id} [${f.severity}/${f.status}] ${f.title} (Owner: ${f.owner}, Due: ${f.dueDate})`),
      ``,
      `Audit History:`,
      ...auditHistory.map((a) => `${a.date} [${a.type}] ${a.auditor} — ${a.outcome}: ${a.notes}`),
    ].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `compliance-${domain.id}.csv`
    link.click()
    URL.revokeObjectURL(url)
    toast.success("Report exported", `compliance-${domain.id}.csv`)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0">
        {/* Header strip */}
        <div className={cn(
          "compliance-drawer-header relative overflow-hidden bg-gradient-to-br border-b",
          theme.gradient,
          theme.border,
          theme.glow
        )}>
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          </div>
          <SheetHeader className="p-5 pb-4 relative">
            <div className="flex items-start gap-3">
              <div className={cn(
                "compliance-icon-pulse size-11 rounded-xl flex items-center justify-center shrink-0",
                theme.bg,
                theme.text
              )}>
                <StatusIcon className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <Badge variant="outline" className={cn("text-[10px] uppercase tracking-wider font-bold", theme.text, theme.border)}>
                    {domain.status.replace("-", " ")}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    <Scale className="size-2.5 mr-1" />
                    {domain.id}
                  </Badge>
                </div>
                <SheetTitle className="text-lg font-bold leading-tight">
                  {domain.name}
                </SheetTitle>
                <SheetDescription className="text-xs mt-0.5 flex items-center gap-2">
                  <Calendar className="size-3" />
                  Last audit: {domain.lastAudit}
                </SheetDescription>
              </div>
            </div>

            {/* Hero metrics */}
            <div className="compliance-stat-enter grid grid-cols-4 gap-2 mt-4">
              <div className="rounded-lg border border-border/40 bg-background/60 backdrop-blur-sm p-2.5">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Score</p>
                <p className={cn("text-sm font-bold text-number tabular-nums", theme.text)}>{domain.score}</p>
                <p className="text-[9px] text-muted-foreground">/ 100</p>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/60 backdrop-blur-sm p-2.5">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Target</p>
                <p className="text-sm font-bold text-number tabular-nums">{domain.target}</p>
                <p className="text-[9px] text-muted-foreground">/ 100</p>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/60 backdrop-blur-sm p-2.5">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Gap</p>
                <p className={cn("text-sm font-bold text-number tabular-nums", gap > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400")}>
                  {gap > 0 ? `-${gap}` : `+${Math.abs(gap)}`}
                </p>
                <p className="text-[9px] text-muted-foreground">vs target</p>
              </div>
              <div className="rounded-lg border border-border/40 bg-background/60 backdrop-blur-sm p-2.5">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Critical</p>
                <p className={cn("text-sm font-bold text-number tabular-nums", domain.criticalFindings > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400")}>
                  {domain.criticalFindings}
                </p>
                <p className="text-[9px] text-muted-foreground">findings</p>
              </div>
            </div>
          </SheetHeader>
        </div>

        <div className="compliance-drawer-body-enter p-5 space-y-5">
          {/* Description */}
          <Card className="border-border/40">
            <CardContent className="p-4">
              <div className="flex items-start gap-2.5">
                <div className={cn("size-7 rounded-md flex items-center justify-center shrink-0 mt-0.5", theme.bg, theme.text)}>
                  <FileCheck className="size-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-semibold text-foreground mb-1">Framework Description</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{domain.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 6-month score trend */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <TrendingUp className="size-3.5 text-muted-foreground" />
                6-Month Score Trend
              </h3>
              <Badge variant="outline" className="text-[9px]">
                <TrendingUp className="size-2.5 mr-1 text-emerald-500" />
                +{(scoreHistory[scoreHistory.length - 1]?.score ?? 0) - (scoreHistory[0]?.score ?? 0)} pts
              </Badge>
            </div>
            <Card className="border-border/40">
              <CardContent className="p-3">
                <ChartContainer config={chartConfig} className="h-[160px] w-full">
                  <BarChart data={scoreHistory} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} domain={[60, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="target" fill="#94a3b8" radius={[2, 2, 0, 0]} barSize={6} />
                    <Bar dataKey="score" radius={[3, 3, 0, 0]} barSize={14}>
                      {scoreHistory.map((entry, i) => (
                        <Cell
                          key={`cell-${i}`}
                          fill={
                            entry.score >= entry.target
                              ? "#10B981"
                              : entry.score >= entry.target - 5
                                ? "#F59E0B"
                                : "#EF4444"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
                <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-emerald-500" /> Above target</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-amber-500" /> Within 5pts</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-red-500" /> Below target</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-slate-400" /> Target</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Control coverage donut */}
          <div>
            <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-muted-foreground" />
              Control Coverage Breakdown
            </h3>
            <Card className="border-border/40">
              <CardContent className="p-3">
                <div className="flex items-center gap-4">
                  <ChartContainer config={chartConfig} className="h-[140px] w-[140px] shrink-0">
                    <PieChart>
                      <Pie
                        data={coverage}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={36}
                        outerRadius={56}
                        paddingAngle={2}
                      >
                        {coverage.map((entry, i) => (
                          <Cell key={`cell-${i}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                  <div className="flex-1 space-y-1.5">
                    {coverage.map((c) => (
                      <div key={c.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="size-2 rounded-sm" style={{ backgroundColor: c.color }} />
                          <span className="text-muted-foreground">{c.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-number tabular-nums">{c.value}</span>
                          <span className="text-[10px] text-muted-foreground">
                            ({totalControls > 0 ? Math.round((c.value / totalControls) * 100) : 0}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Findings list */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <AlertTriangle className="size-3.5 text-muted-foreground" />
                Open Findings
              </h3>
              <Badge variant="outline" className="text-[9px]">
                {findings.filter((f) => f.status === "open" || f.status === "overdue").length} open · {findings.filter((f) => f.status === "in-remediation").length} in-progress
              </Badge>
            </div>
            <div className="space-y-2">
              {findings.map((f, i) => (
                <div
                  key={f.id}
                  className="compliance-card-enter rounded-lg border border-border/40 bg-background/60 p-3"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <Badge variant="outline" className={cn("text-[9px] uppercase shrink-0 mt-0.5", findingSeverityColor[f.severity])}>
                        {f.severity}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground leading-snug">{f.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          <span className="font-mono">{f.id}</span> · Detected {f.detectedOn} · Due {f.dueDate}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn("text-[9px] uppercase shrink-0", findingStatusColor[f.status])}>
                      {f.status.replace("-", " ")}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">{f.description}</p>
                  <div className="rounded-md bg-muted/40 p-2 mb-2">
                    <p className="text-[10px] text-foreground/80">
                      <ChevronRight className="size-2.5 inline mr-0.5 text-muted-foreground" />
                      <span className="font-medium">Remediation:</span> {f.remediation}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="size-2.5" /> {f.owner}
                    </span>
                    <span className="italic truncate ml-2">{f.evidence}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit history timeline */}
          <div>
            <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <ScrollText className="size-3.5 text-muted-foreground" />
              Audit History
            </h3>
            <div className="space-y-2">
              {auditHistory.map((a, i) => (
                <div
                  key={i}
                  className="compliance-card-enter flex items-start gap-2.5 rounded-lg border border-border/40 bg-background/60 p-2.5"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className={cn(
                    "size-7 rounded-md flex items-center justify-center shrink-0",
                    auditOutcomeColor[a.outcome]
                  )}>
                    {a.outcome === "passed" ? <CheckCircle2 className="size-3.5" /> :
                     a.outcome === "failed" ? <XCircle className="size-3.5" /> :
                     <AlertTriangle className="size-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="text-xs font-medium">{a.date}</p>
                      <Badge variant="outline" className={cn("text-[9px] uppercase", auditOutcomeColor[a.outcome])}>
                        {a.outcome.replace("-", " ")}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      <span className="font-medium">{a.type}</span> · {a.auditor}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1 italic">{a.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Footer */}
          <div className="flex items-center gap-2 pb-2">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8" onClick={handleExport}>
              <Download className="size-3.5" />
              Export Report
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8" onClick={handleAcknowledge}>
              <Bell className="size-3.5" />
              Acknowledge
            </Button>
            <Button size="sm" className="gap-1.5 text-xs h-8 ml-auto bg-emerald-600 hover:bg-emerald-700" onClick={() => {
              toast.success("Compliance review scheduled", `Internal audit scheduled for ${domain.name}`)
              onOpenChange(false)
            }}>
              <Gavel className="size-3.5" />
              Schedule Review
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
