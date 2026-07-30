"use client"

import { useState, Fragment } from "react"
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart,
} from "recharts"
import {
  ScrollText, Search, CheckCircle2, AlertTriangle, BarChart3,
  TrendingUp, Eye, X, Clock, Package, ArrowRight,
  ChevronRight, MapPin, Upload, Download, FileText,
  Users, IndianRupee, Filter, Calendar, Star, ShieldCheck,
  Lock, Unlock, Copy, FolderOpen, FileType, Archive,
  ArrowUpRight, ArrowDownRight, RotateCcw, Edit, Trash2,
  UserCheck, UserX, GitBranch, Tag, Paperclip,
} from "lucide-react"
import { cn } from "@/lib/utils"

function createRng(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 12345) % 2147483647; return (s & 0x7fffffff) / 0x7fffffff }
}
const rand = createRng(142142)
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)]
const rInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min
const rDate = (start: number, end: number) => new Date(2026, 6, rInt(start, end)).toISOString().split("T")[0]
const rTime = () => `${String(rInt(4, 20)).padStart(2, "0")}:${String(rInt(0, 59)).padStart(2, "0")}`
const rSize = () => pick(["2.1 KB", "15.3 KB", "48.7 KB", "128.4 KB", "256.1 KB", "512.8 KB", "1.2 MB", "2.8 MB", "4.5 MB", "8.3 MB", "15.6 MB", "23.4 MB"])

const WAREHOUSES = ["Mumbai Hub", "Delhi NCR", "Chennai DC", "Kolkata Hub", "Bangalore South", "Pune West"]
const DOC_CATEGORIES = ["SOP", "Policy", "Safety Manual", "Training Material", "Quality Record", "Audit Report", "Compliance Certificate", "Invoice", "PO Document", "Shipping Manifest", "Insurance", "Customs Declaration", "License", "Permit", "Contract"]
const DOC_STATUSES = ["Draft", "Under Review", "Approved", "Published", "Archived", "Rejected", "Pending Revision"]
const FILE_TYPES = ["PDF", "DOCX", "XLSX", "PPTX", "JPEG", "PNG", "CSV", "TXT", "ZIP"]
const WORKFLOW_STATUSES = ["Pending", "In Progress", "Approved", "Rejected", "On Hold", "Completed"]
const APPROVAL_LEVELS = ["Level 1 - Supervisor", "Level 2 - Manager", "Level 3 - Director", "Level 4 - VP", "Level 5 - CXO"]
const PRIORITY_LEVELS = ["Low", "Medium", "High", "Critical"]

const DEPARTMENTS = ["Operations", "Finance", "Quality", "Safety", "HR", "IT", "Legal", "Procurement", "Logistics", "Warehouse"]

const EMPLOYEES = [
  { id: "EMP-001", name: "Rajesh Sharma", role: "Warehouse Manager", dept: "Operations", avatar: "RS" },
  { id: "EMP-002", name: "Priya Patel", role: "Quality Director", dept: "Quality", avatar: "PP" },
  { id: "EMP-003", name: "Amit Kumar", role: "Safety Officer", dept: "Safety", avatar: "AK" },
  { id: "EMP-004", name: "Sunita Verma", role: "Finance Controller", dept: "Finance", avatar: "SV" },
  { id: "EMP-005", name: "Vikram Singh", role: "VP Operations", dept: "Operations", avatar: "VS" },
  { id: "EMP-006", name: "Deepa Nair", role: "HR Director", dept: "HR", avatar: "DN" },
  { id: "EMP-007", name: "Manoj Gupta", role: "IT Manager", dept: "IT", avatar: "MG" },
  { id: "EMP-008", name: "Kavitha Raman", role: "Legal Counsel", dept: "Legal", avatar: "KR" },
  { id: "EMP-009", name: "Arjun Mehta", role: "Procurement Head", dept: "Procurement", avatar: "AM" },
  { id: "EMP-010", name: "Lakshmi Iyer", role: "Compliance Officer", dept: "Quality", avatar: "LI" },
]

const templates = [
  { id: "TPL-001", name: "SOP Template v3", category: "SOP", version: "3.2", owner: EMPLOYEES[0], downloads: rInt(150, 800), lastUsed: rDate(1, 28), status: "Published", description: "Standard Operating Procedure template for warehouse operations per ISO 9001:2015" },
  { id: "TPL-002", name: "Safety Inspection Form", category: "Safety Manual", version: "2.1", owner: EMPLOYEES[2], downloads: rInt(200, 600), lastUsed: rDate(1, 28), status: "Published", description: "Monthly safety inspection checklist aligned with OSHA and Indian Factory Act 1948" },
  { id: "TPL-003", name: "Invoice Template GST", category: "Invoice", version: "4.0", owner: EMPLOYEES[3], downloads: rInt(300, 1200), lastUsed: rDate(1, 28), status: "Published", description: "GST-compliant invoice template with auto HSN/SAC code fields, CGST/SGST/IGST breakdown" },
  { id: "TPL-004", name: "Audit Report Template", category: "Audit Report", version: "1.5", owner: EMPLOYEES[1], downloads: rInt(80, 300), lastUsed: rDate(1, 28), status: "Published", description: "Internal audit report template with findings, observations, and CAPA tracking sections" },
  { id: "TPL-005", name: "Purchase Order Template", category: "PO Document", version: "3.0", owner: EMPLOYEES[8], downloads: rInt(250, 900), lastUsed: rDate(1, 28), status: "Published", description: "Standard PO template with multi-warehouse delivery, GST input credit tracking" },
  { id: "TPL-006", name: "Training Assessment Form", category: "Training Material", version: "2.0", owner: EMPLOYEES[5], downloads: rInt(100, 400), lastUsed: rDate(1, 28), status: "Published", description: "Post-training competency assessment with scoring rubric and skill matrix alignment" },
  { id: "TPL-007", name: "Non-Conformance Report", category: "Quality Record", version: "2.3", owner: EMPLOYEES[1], downloads: rInt(120, 350), lastUsed: rDate(1, 28), status: "Published", description: "NCR/NCB reporting template with root cause analysis (5-Why, Ishikawa) and CAPA sections" },
  { id: "TPL-008", name: "Vendor Evaluation Scorecard", category: "Policy", version: "1.8", owner: EMPLOYEES[8], downloads: rInt(60, 250), lastUsed: rDate(1, 28), status: "Under Review", description: "Vendor performance evaluation covering quality, delivery, cost, and service metrics" },
  { id: "TPL-009", name: "Insurance Claim Form", category: "Insurance", version: "1.2", owner: EMPLOYEES[7], downloads: rInt(40, 180), lastUsed: rDate(1, 28), status: "Published", description: "Cargo insurance claim form with incident details, damage assessment, and photo attachment sections" },
  { id: "TPL-010", name: "Shift Handover Checklist", category: "SOP", version: "3.5", owner: EMPLOYEES[0], downloads: rInt(400, 1500), lastUsed: rDate(1, 28), status: "Published", description: "Standardized shift handover covering inventory, equipment, pending tasks, and safety notes" },
  { id: "TPL-011", name: "Compliance Certificate Template", category: "Compliance Certificate", version: "2.0", owner: EMPLOYEES[9], downloads: rInt(90, 280), lastUsed: rDate(1, 28), status: "Published", description: "ISO/FSSAI/BIS compliance certificate generation with expiry tracking and renewal alerts" },
  { id: "TPL-012", name: "Customs Declaration Form", category: "Customs Declaration", version: "1.4", owner: EMPLOYEES[7], downloads: rInt(50, 200), lastUsed: rDate(1, 28), status: "Draft", description: "Indian customs declaration (Bill of Entry / Shipping Bill) aligned with CBIC regulations" },
]

const documents = (() => {
  const result: Array<{
    id: string; title: string; category: string; fileType: string; size: string;
    version: string; status: string; author: typeof EMPLOYEES[0]; reviewer: typeof EMPLOYEES[0];
    warehouse: string; department: string; createdDate: string; modifiedDate: string;
    expiryDate: string | null; tags: string[]; downloads: number; isLocked: boolean;
    retention: string; classification: string; workflowId: string | null;
  }> = []

  const titles: Record<string, string[]> = {
    "SOP": ["Inbound Goods Receipt Procedure", "Putaway Strategy Guideline", "Cycle Count Execution Protocol", "Pick & Pack Standard Process", "Returns Handling SOP", "Cross-Dock Transfer SOP", "Cold Chain Management SOP", "Hazmat Handling Guidelines"],
    "Policy": ["Data Privacy Policy", "Access Control Policy", "Visitor Management Policy", "Incident Reporting Policy", "Document Retention Policy", "Vendor Onboarding Policy"],
    "Safety Manual": ["Fire Safety Manual", "Forklift Operations Manual", "PPE Requirements Manual", "Emergency Evacuation Plan", "Electrical Safety Manual"],
    "Training Material": ["New Hire Orientation Guide", "Forklift Certification Training", "WMS System Training Manual", "Barcode Scanner Operations Guide", "Safety Awareness Training Pack"],
    "Quality Record": ["Incoming Inspection Report Template", "Process Validation Report", "Customer Complaint Log", "CAPA Tracking Register", "Calibration Records"],
    "Audit Report": ["Q2 2026 Internal Audit Report", "Safety Audit - Mumbai Hub", "Environmental Compliance Audit", "Vendor Audit - Tata Steel", "Fire Safety Audit - All WH"],
    "Compliance Certificate": ["ISO 9001:2015 Certificate", "FSSAI License Renewal", "BIS Certification", "CDSCO Drug License", "GST Registration Certificate"],
    "Invoice": ["Monthly Invoice - Jun 2026", "Service Tax Invoice Q1", "Purchase Return Credit Note", "Debit Note - Damage Claim"],
    "PO Document": ["PO-2026-0451 - Raw Materials", "PO-2026-0452 - Packaging Supplies", "PO-2026-0453 - Safety Equipment", "Blanket PO - Annual Consumables"],
    "Shipping Manifest": ["Container Manifest - MA-4521", "Airway Bill - AWB-789234", "Bill of Lading - BL/MUM-9876", "Road Manifest - RM-DEL-1234"],
    "Insurance": ["Marine Cargo Insurance Policy", "Warehouse Liability Insurance", "Employee Group Insurance", "Transit Insurance Certificate"],
    "Customs Declaration": ["Bill of Entry - BE-2026-0012", "Shipping Bill - SB-2026-0045", "Exemption Certificate - GST", "Advance Authorization License"],
    "License": ["Trade License - Mumbai", "Factory License - Chennai DC", "Warehouse License - Delhi NCR", "Explosive Storage License - Pune"],
    "Permit": ["E-Waste Handling Permit", "Hazardous Waste Transport Permit", "Import License - Electronics", "Export License - Textiles"],
    "Contract": ["Master Service Agreement - Delhivery", "Warehousing Lease - Mumbai", "Transport SLA - BlueDart", "NDA - Technology Vendor"],
  }

  const classifications = ["Public", "Internal", "Confidential", "Restricted"]
  const retentions = ["1 Year", "2 Years", "3 Years", "5 Years", "7 Years", "10 Years", "Permanent"]

  for (let i = 0; i < 120; i++) {
    const category = pick(DOC_CATEGORIES)
    const catTitles = titles[category] || ["General Document"]
    const title = pick(catTitles)
    const status = pick(DOC_STATUSES)
    const author = pick(EMPLOYEES)
    const reviewer = pick(EMPLOYEES.filter((e) => e.id !== author.id))
    const expiry = category === "Compliance Certificate" || category === "License" || category === "Permit" ? rDate(1, 28) : null

    result.push({
      id: `DOC-${String(i + 1).padStart(4, "0")}`,
      title: title + (i > 0 ? ` (v${rInt(1, 5)})` : ""),
      category, fileType: pick(FILE_TYPES), size: rSize(),
      version: `v${rInt(1, 5)}.${rInt(0, 9)}`, status, author, reviewer,
      warehouse: pick(WAREHOUSES), department: pick(DEPARTMENTS),
      createdDate: rDate(1, 28), modifiedDate: rDate(1, 28),
      expiryDate: expiry,
      tags: (() => { const t = [category]; if (rand() > 0.5) t.push(pick(WAREHOUSES)); if (rand() > 0.6) t.push("2026"); if (rand() > 0.7) t.push("Compliance"); return t })(),
      downloads: rInt(0, 200), isLocked: status === "Published" && rand() > 0.7,
      retention: pick(retentions), classification: pick(classifications),
      workflowId: status === "Under Review" ? `WF-${String(rInt(1, 25)).padStart(4, "0")}` : null,
    })
  }
  return result
})()

const workflows = (() => {
  const result: Array<{
    id: string; title: string; documentId: string; initiator: typeof EMPLOYEES[0];
    currentLevel: number; totalLevels: number; status: string;
    priority: string; department: string; warehouse: string;
    createdDate: string; dueDate: string; completedDate: string | null;
    approvers: Array<{ employee: typeof EMPLOYEES[0]; level: number; status: string; comment: string | null;actionDate: string | null }>;
    description: string;
  }> = []

  const wfTitles = [
    "New SOP Approval", "Policy Update Review", "Safety Manual Revision",
    "Compliance Certificate Renewal", "Audit Report Sign-off", "Contract Amendment Approval",
    "Training Material Review", "Quality Record Validation", "Insurance Policy Update",
    "Vendor Document Verification", "License Renewal Approval", "Customs Declaration Approval",
  ]

  for (let i = 0; i < 25; i++) {
    const status = pick(WORKFLOW_STATUSES)
    const totalLevels = pick([2, 3, 3, 4, 5])
    const currentLevel = status === "Pending" ? 0 : status === "In Progress" ? rInt(1, totalLevels - 1) : status === "Approved" || status === "Completed" ? totalLevels : rInt(0, totalLevels - 1)
    const initiator = pick(EMPLOYEES)
    const priority = pick(PRIORITY_LEVELS)

    const approvers: Array<{ employee: typeof EMPLOYEES[0]; level: number; status: string; comment: string | null; actionDate: string | null }> = []
    for (let lvl = 1; lvl <= totalLevels; lvl++) {
      const emp = pick(EMPLOYEES.filter((e) => e.id !== initiator.id))
      let aStatus: string
      if (lvl < currentLevel) aStatus = "Approved"
      else if (lvl === currentLevel) aStatus = status === "Rejected" ? "Rejected" : status === "On Hold" ? "Pending" : "Pending"
      else aStatus = "Pending"
      approvers.push({
        employee: emp, level: lvl, status: aStatus,
        comment: aStatus === "Approved" ? pick(["Reviewed and approved", "Looks good, approved", "Approved with minor comments", "No objections, proceed"]) :
                 aStatus === "Rejected" ? pick(["Needs revision — see comments", "Incorrect format, please resubmit", "Missing required sections"]) : null,
        actionDate: aStatus !== "Pending" ? rDate(1, 28) : null,
      })
    }

    result.push({
      id: `WF-${String(i + 1).padStart(4, "0")}`,
      title: pick(wfTitles), documentId: `DOC-${String(rInt(1, 120)).padStart(4, "0")}`,
      initiator, currentLevel, totalLevels, status, priority,
      department: pick(DEPARTMENTS), warehouse: pick(WAREHOUSES),
      createdDate: rDate(1, 15), dueDate: rDate(15, 28),
      completedDate: status === "Completed" || status === "Approved" ? rDate(15, 28) : null,
      approvers, description: pick([
        "Document submitted for multi-level approval per ISO 9001:2015 clause 7.5",
        "Updated policy requires review by department heads and compliance team",
        "Safety document revision as per latest OSHA amendments and Factory Act update",
        "Annual compliance certificate renewal with external auditor sign-off",
        "Quarterly audit report requires CXO approval before distribution",
        "Contract amendment needs legal review and finance authorization",
      ]),
    })
  }
  return result
})()

const versionHistory = (() => {
  const result: Array<{
    id: string; documentId: string; version: string; author: typeof EMPLOYEES[0];
    date: string; changeType: string; summary: string; size: string;
  }> = []
  for (let i = 0; i < 40; i++) {
    result.push({
      id: `VH-${String(i + 1).padStart(4, "0")}`,
      documentId: `DOC-${String(rInt(1, 50)).padStart(4, "0")}`,
      version: `v${rInt(1, 5)}.${rInt(0, 9)}`,
      author: pick(EMPLOYEES), date: rDate(1, 28),
      changeType: pick(["Created", "Modified", "Reviewed", "Approved", "Archived", "Restored"]),
      summary: pick([
        "Initial document created from template",
        "Updated Section 3.2 with new warehouse layout",
        "Added GST rate revision per Finance Order",
        "Incorporated safety audit findings",
        "Corrected formatting and numbering",
        "Added new compliance requirements per CDSCO",
        "Version bumped after annual review",
        "Restored from archive for re-approval",
      ]),
      size: rSize(),
    })
  }
  return result
})()

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const COLORS = ["#10b981", "#f43f5e", "#f59e0b", "#8b5cf6", "#06b6d4", "#ec4899", "#ef4444", "#22c55e"]

const monthlyUploads = MONTHS.map((m) => ({
  month: m, uploaded: rInt(80, 250), approved: rInt(60, 200), rejected: rInt(2, 20), archived: rInt(5, 30),
}))

const monthlyWorkflows = MONTHS.map((m) => ({
  month: m, created: rInt(15, 60), completed: rInt(12, 55), pending: rInt(2, 15), overdue: rInt(0, 5),
}))

const categoryDist = (() => {
  const counts: Record<string, number> = {}
  documents.forEach((d) => { counts[d.category] = (counts[d.category] || 0) + 1 })
  return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 8)
})()

const fileExtDist = (() => {
  const counts: Record<string, number> = {}
  documents.forEach((d) => { counts[d.fileType] = (counts[d.fileType] || 0) + 1 })
  return Object.entries(counts).map(([name, count]) => ({ name: name.toLowerCase(), count }))
})()

const deptWorkflowDist = (() => {
  const counts: Record<string, number> = {}
  workflows.forEach((w) => { counts[w.department] = (counts[w.department] || 0) + 1 })
  return Object.entries(counts).map(([name, count]) => ({ name, count }))
})()

const classificationDist = (() => {
  const counts: Record<string, number> = {}
  documents.forEach((d) => { counts[d.classification] = (counts[d.classification] || 0) + 1 })
  return Object.entries(counts).map(([name, count]) => ({ name, count }))
})()

const STATUS_COLORS: Record<string, string> = {
  Draft: "dmw-badge-draft", "Under Review": "dmw-badge-review", Approved: "dmw-badge-approved",
  Published: "dmw-badge-published", Archived: "dmw-badge-archived", Rejected: "dmw-badge-rejected", "Pending Revision": "dmw-badge-pending-rev",
  Pending: "dmw-badge-pending", "In Progress": "dmw-badge-progress", Completed: "dmw-badge-completed",
  "On Hold": "dmw-badge-hold",
}

const CLASS_COLORS: Record<string, string> = {
  Public: "dmw-class-public", Internal: "dmw-class-internal", Confidential: "dmw-class-confidential", Restricted: "dmw-class-restricted",
}

const PRIORITY_COLORS: Record<string, string> = {
  Low: "dmw-priority-low", Medium: "dmw-priority-medium", High: "dmw-priority-high", Critical: "dmw-priority-critical",
}

const totalDocs = documents.length
const publishedDocs = documents.filter((d) => d.status === "Published").length
const pendingReviews = documents.filter((d) => d.status === "Under Review").length
const activeWorkflows = workflows.filter((w) => w.status === "In Progress" || w.status === "Pending").length
const overdueWorkflows = workflows.filter((w) => w.status === "On Hold" || (w.status === "In Progress" && rand() > 0.7)).length
const templatesCount = templates.length
const totalDownloads = documents.reduce((s, d) => s + d.downloads, 0)

const SUMMARY_KPIS = [
  { label: "Total Documents", value: String(totalDocs), sub: `${publishedDocs} published`, icon: FileText, trend: "up" },
  { label: "Pending Reviews", value: String(pendingReviews), sub: "Awaiting approval", icon: Clock, trend: pendingReviews > 20 ? "down" : "up" },
  { label: "Active Workflows", value: String(activeWorkflows), sub: `${workflows.filter((w) => w.status === "Completed").length} completed`, icon: GitBranch, trend: "up" },
  { label: "Templates", value: String(templatesCount), sub: `${templates.filter((t) => t.status === "Published").length} published`, icon: Copy, trend: "up" },
  { label: "Total Downloads", value: totalDownloads.toLocaleString(), sub: "All time", icon: Download, trend: "up" },
  { label: "Overdue", value: String(overdueWorkflows), sub: "Need attention", icon: AlertTriangle, trend: overdueWorkflows > 3 ? "down" : "up" },
]

type DocDetail = typeof documents[0]

export default function DocumentManagementView() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedDoc, setSelectedDoc] = useState<DocDetail | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const openDrawer = (doc: DocDetail) => { setSelectedDoc(doc); setDrawerOpen(true) }

  const filteredDocs = documents.filter((d) => {
    const matchSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase()) || d.id.toLowerCase().includes(searchTerm.toLowerCase()) || d.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === "all" || d.status === statusFilter
    return matchSearch && matchStatus
  })

  const filteredWorkflows = workflows.filter((w) => {
    const matchSearch = w.title.toLowerCase().includes(searchTerm.toLowerCase()) || w.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === "all" || w.status === statusFilter
    return matchSearch && matchStatus
  })

  const filteredTemplates = templates.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === "all" || t.status === statusFilter
    return matchSearch && matchStatus
  })

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "documents", label: "Documents" },
    { id: "workflows", label: "Workflows" },
    { id: "templates", label: "Templates" },
    { id: "analytics", label: "Analytics" },
  ]

  return (
    <div className="dmw-root flex flex-col h-full">
      {/* Header */}
      <div className="dmw-header px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="dmw-icon-wrap">
            <ScrollText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="dmw-title text-xl font-bold">Document Management & Workflow Center</h1>
            <p className="dmw-subtitle text-sm">Document lifecycle, multi-level approval workflows &amp; compliance tracking</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={cn("dmw-badge-trend", "dmw-badge-trend-up")}>
            {totalDocs} Documents
          </Badge>
          <Badge className={cn("dmw-badge-trend", "dmw-badge-trend-up")}>
            {templatesCount} Templates
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="dmw-tabs-wrap px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="dmw-tabs-list">
            {tabs.map((t) => (
              <TabsTrigger key={t.id} value={t.id} className="dmw-tab-trigger">
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="dmw-content flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {activeTab === "dashboard" && (
          <div className="space-y-4">
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {SUMMARY_KPIS.map((kpi) => (
                <Card key={kpi.label} className="dmw-kpi-card">
                  <CardContent className="glass-subtle p-4">
                    <div className="flex items-center justify-between mb-2">
                      <kpi.icon className="h-4 w-4 dmw-kpi-icon" />
                      <span className={cn("dmw-trend-badge", kpi.trend === "up" ? "dmw-trend-up" : "dmw-trend-down")}>
                        {kpi.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      </span>
                    </div>
                    <div className="dmw-kpi-value text-lg font-bold">{kpi.value}</div>
                    <div className="dmw-kpi-label text-xs">{kpi.label}</div>
                    <div className="dmw-kpi-sub text-xs">{kpi.sub}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="dmw-chart-card">
                <CardHeader className="pb-2">
                  <CardTitle className="dmw-chart-title text-sm">Document Activity Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <ComposedChart data={monthlyUploads}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e5e7eb)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="uploaded" name="Uploaded" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="approved" name="Approved" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      <Line type="monotone" dataKey="rejected" name="Rejected" stroke="#f43f5e" strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="dmw-chart-card">
                <CardHeader className="pb-2">
                  <CardTitle className="dmw-chart-title text-sm">Document Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={categoryDist} dataKey="count" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={2} label={({ name, count }) => `${name}: ${count}`}>
                        {categoryDist.map((_, idx) => { const cc = COLORS; return <Cell key={idx} fill={cc[idx % cc.length]} /> })}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="dmw-chart-card">
                <CardHeader className="pb-2">
                  <CardTitle className="dmw-chart-title text-sm">File Type Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={fileExtDist} dataKey="count" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={2} label={({ name, count }) => `${name}: ${count}`}>
                        {fileExtDist.map((_, idx) => { const fc = ["#10b981", "#f43f5e", "#f59e0b", "#8b5cf6", "#06b6d4", "#ec4899", "#3b82f6", "#ef4444", "#22c55e"]; return <Cell key={idx} fill={fc[idx % fc.length]} /> })}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="dmw-chart-card">
                <CardHeader className="pb-2">
                  <CardTitle className="dmw-chart-title text-sm">Workflow Volume Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={monthlyWorkflows}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e5e7eb)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                      <Area type="monotone" dataKey="created" name="Created" fill="#10b98133" stroke="#10b981" strokeWidth={2} />
                      <Area type="monotone" dataKey="completed" name="Completed" fill="#f59e0b33" stroke="#f59e0b" strokeWidth={2} />
                      <Area type="monotone" dataKey="overdue" name="Overdue" fill="#f43f5e33" stroke="#f43f5e" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="dmw-chart-card">
                <CardHeader className="pb-2">
                  <CardTitle className="dmw-chart-title text-sm">Classification Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={classificationDist} dataKey="count" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={3} label={({ name, count }) => `${name}: ${count}`}>
                        {classificationDist.map((_, idx) => { const gc = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"]; return <Cell key={idx} fill={gc[idx % gc.length]} /> })}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Alerts */}
            <Card className="dmw-alert-card">
              <CardHeader className="pb-2">
                <CardTitle className="dmw-chart-title text-sm">Recent Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { msg: "SOP-2026-0034 pending Level 3 approval — Director review due today", severity: "warning", time: "15m ago" },
                    { msg: "ISO 9001:2015 Certificate expiry in 7 days — renewal workflow initiated", severity: "critical", time: "42m ago" },
                    { msg: "FSSAI License document uploaded by Lakshmi Iyer — auto-routed to Quality", severity: "info", time: "1h ago" },
                    { msg: "WF-0018 rejected at Level 2 — vendor evaluation scorecard needs revision", severity: "warning", time: "2h ago" },
                    { msg: "30 documents approaching retention expiry — batch review recommended", severity: "info", time: "3h ago" },
                    { msg: "Customs Declaration Form template updated to v1.5 by Legal team", severity: "info", time: "5h ago" },
                  ].map((alert, idx) => (
                    <div key={idx} className={cn("dmw-alert-row flex items-center justify-between p-2 rounded-lg text-sm", alert.severity === "critical" && "dmw-alert-critical", alert.severity === "warning" && "dmw-alert-warning", alert.severity === "info" && "dmw-alert-info")}>
                      <div className="flex items-center gap-2">
                        {alert.severity === "critical" ? <AlertTriangle className="h-4 w-4 text-red-500" /> : alert.severity === "warning" ? <Clock className="h-4 w-4 text-amber-500" /> : <Eye className="h-4 w-4 text-blue-500" />}
                        <span>{alert.msg}</span>
                      </div>
                      <span className="text-xs opacity-70">{alert.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                <input className="dmw-filter-input w-full pl-9 pr-4 py-2 rounded-lg text-sm" placeholder="Search by title, ID, or category..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <select className="dmw-filter-select rounded-lg px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                {DOC_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {[
                { label: "Total", value: totalDocs },
                { label: "Published", value: publishedDocs },
                { label: "Under Review", value: pendingReviews },
                { label: "Draft", value: documents.filter((d) => d.status === "Draft").length },
                { label: "Archived", value: documents.filter((d) => d.status === "Archived").length },
                { label: "Locked", value: documents.filter((d) => d.isLocked).length },
              ].map((s) => (
                <Card key={s.label} className="dmw-stat-mini">
                  <CardContent className="glass-subtle p-2 text-center">
                    <div className="text-sm font-bold">{s.value}</div>
                    <div className="text-[10px] opacity-60">{s.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Documents Table */}
            <Card className="card-crud-lift dmw-table-card">
              <CardContent className="glass-subtle p-0">
                <div className="overflow-x-auto">
                  <Table className="table-hover-highlight">
                    <TableHeader>
                      <TableRow className="dmw-table-header">
                        <TableHead className="dmw-th">ID</TableHead>
                        <TableHead className="dmw-th">Title</TableHead>
                        <TableHead className="dmw-th">Category</TableHead>
                        <TableHead className="dmw-th">Type</TableHead>
                        <TableHead className="dmw-th">Version</TableHead>
                        <TableHead className="dmw-th">Author</TableHead>
                        <TableHead className="dmw-th">Classification</TableHead>
                        <TableHead className="dmw-th">Warehouse</TableHead>
                        <TableHead className="dmw-th">Retention</TableHead>
                        <TableHead className="dmw-th">Downloads</TableHead>
                        <TableHead className="dmw-th">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDocs.slice(0, 30).map((doc) => (
                        <TableRow key={doc.id} className="dmw-table-row cursor-pointer" onClick={() => openDrawer(doc)}>
                          <TableCell className="dmw-td font-mono text-xs">{doc.id}</TableCell>
                          <TableCell className="dmw-td text-xs font-medium max-w-[200px]">
                            <div className="flex items-center gap-1.5">
                              {doc.isLocked ? <Lock className="h-3 w-3 text-red-500 shrink-0" /> : <Unlock className="h-3 w-3 text-gray-400 shrink-0" />}
                              <span className="truncate">{doc.title}</span>
                            </div>
                          </TableCell>
                          <TableCell className="dmw-td text-xs">{doc.category}</TableCell>
                          <TableCell className="dmw-td">
                            <Badge className="badge-interactive dmw-filetype-badge text-[10px]">{doc.fileType}</Badge>
                          </TableCell>
                          <TableCell className="dmw-td text-xs font-mono">{doc.version}</TableCell>
                          <TableCell className="dmw-td text-xs">{doc.author.name}</TableCell>
                          <TableCell className="badge-interactive dmw-td"><Badge className={cn(CLASS_COLORS[doc.classification], "text-[10px]")}>{doc.classification}</Badge></TableCell>
                          <TableCell className="dmw-td text-xs">{doc.warehouse}</TableCell>
                          <TableCell className="dmw-td text-xs">{doc.retention}</TableCell>
                          <TableCell className="dmw-td text-xs font-mono">{doc.downloads}</TableCell>
                          <TableCell className="badge-interactive dmw-td"><Badge className={cn(STATUS_COLORS[doc.status], "text-[10px]")}>{doc.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "workflows" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                <input className="dmw-filter-input w-full pl-9 pr-4 py-2 rounded-lg text-sm" placeholder="Search workflows..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <select className="dmw-filter-select rounded-lg px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                {WORKFLOW_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* WF Summary */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: "Total Workflows", value: String(workflows.length), color: "dmw-sum-card-emerald" },
                { label: "Pending", value: String(workflows.filter((w) => w.status === "Pending").length), color: "dmw-sum-card-amber" },
                { label: "In Progress", value: String(workflows.filter((w) => w.status === "In Progress").length), color: "dmw-sum-card-rose" },
                { label: "Approved", value: String(workflows.filter((w) => w.status === "Approved").length), color: "dmw-sum-card-violet" },
                { label: "Rejected", value: String(workflows.filter((w) => w.status === "Rejected").length), color: "dmw-sum-card-red" },
                { label: "Completed", value: String(workflows.filter((w) => w.status === "Completed").length), color: "dmw-sum-card-cyan" },
              ].map((c) => (
                <Card key={c.label} className={c.color}>
                  <CardContent className="glass-subtle p-3 text-center">
                    <div className="text-lg font-bold">{c.value}</div>
                    <div className="text-xs opacity-70">{c.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Dept Dist + Approval Pipeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="dmw-chart-card">
                <CardHeader className="pb-2">
                  <CardTitle className="dmw-chart-title text-sm">Workflows by Department</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={deptWorkflowDist} dataKey="count" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={2} label={({ name, count }) => `${name}: ${count}`}>
                        {deptWorkflowDist.map((_, idx) => { const dc = COLORS; return <Cell key={idx} fill={dc[idx % dc.length]} /> })}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="dmw-chart-card">
                <CardHeader className="pb-2">
                  <CardTitle className="dmw-chart-title text-sm">Approval Level Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={APPROVAL_LEVELS.map((level) => ({ level: level.split(" - ")[1], count: workflows.filter((w) => w.totalLevels === APPROVAL_LEVELS.indexOf(level) + 1).length }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e5e7eb)" />
                      <XAxis dataKey="level" tick={{ fontSize: 10 }} stroke="var(--chart-axis, #6b7280)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Bar dataKey="count" name="Workflows" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Workflow Cards */}
            <Card className="dmw-table-card">
              <CardHeader className="pb-2">
                <CardTitle className="dmw-chart-title text-sm">Active Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredWorkflows.map((wf) => (
                    <div key={wf.id} className="dmw-wf-card p-3 rounded-xl border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className="badge-interactive dmw-wf-id font-mono text-[10px]">{wf.id}</Badge>
                          <Badge className={cn(STATUS_COLORS[wf.status], "text-[10px]")}>{wf.status}</Badge>
                        </div>
                        <Badge className={cn(PRIORITY_COLORS[wf.priority], "text-[10px]")}>{wf.priority}</Badge>
                      </div>
                      <h4 className="text-sm font-semibold mb-1">{wf.title}</h4>
                      <p className="text-xs opacity-60 mb-2 line-clamp-1">{wf.description}</p>

                      {/* Approval Flow */}
                      <div className="flex items-center gap-1 mb-2">
                        {wf.approvers.map((a, idx) => (
                          <Fragment key={a.level}>
                            <div className={cn("dmw-approver-dot", a.status === "Approved" && "dmw-approver-approved", a.status === "Rejected" && "dmw-approver-rejected", a.status === "Pending" && idx === wf.currentLevel && "dmw-approver-current")}>
                              {a.status === "Approved" ? <CheckCircle2 className="h-2.5 w-2.5" /> : a.status === "Rejected" ? <UserX className="h-2.5 w-2.5" /> : <span className="text-[8px]">{a.level}</span>}
                            </div>
                            {idx < wf.approvers.length - 1 && <div className={cn("flex-1 h-0.5", idx < wf.currentLevel ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-600")} />}
                          </Fragment>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>Initiated by {wf.initiator.name}</span>
                        </div>
                        <span>Due: {wf.dueDate}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] mt-1 opacity-60">
                        <span>{wf.warehouse} · {wf.department}</span>
                        <span className="font-mono">{wf.documentId}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "templates" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                <input className="dmw-filter-input w-full pl-9 pr-4 py-2 rounded-lg text-sm" placeholder="Search templates..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <select className="dmw-filter-select rounded-lg px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Under Review">Under Review</option>
              </select>
            </div>

            {/* Template Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((tpl) => (
                <Card key={tpl.id} className="dmw-tpl-card">
                  <CardContent className="glass-subtle p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="dmw-tpl-avatar">
                          <Copy className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{tpl.name}</h3>
                          <p className="text-xs opacity-60">{tpl.category} · {tpl.version}</p>
                        </div>
                      </div>
                      <Badge className={cn(STATUS_COLORS[tpl.status], "text-[10px]")}>{tpl.status}</Badge>
                    </div>
                    <p className="text-xs opacity-70 mb-3 line-clamp-2">{tpl.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div className="flex items-center gap-1"><Users className="h-3 w-3" /><span>{tpl.owner.name}</span></div>
                      <div className="flex items-center gap-1"><Download className="h-3 w-3" /><span>{tpl.downloads} downloads</span></div>
                      <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /><span>Last: {tpl.lastUsed}</span></div>
                      <div className="flex items-center gap-1"><FolderOpen className="h-3 w-3" /><span>{tpl.category}</span></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="dmw-owner-avatar">
                        <span className="text-[10px] font-bold">{tpl.owner.avatar}</span>
                      </div>
                      <Button variant="outline" size="sm" className="btn-outline-animate dmw-use-btn text-xs">
                        <Download className="h-3 w-3 mr-1" /> Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Avg Review Time", value: `${rInt(2, 5)} days`, sub: "Target: 3 days" },
                { label: "Approval Rate", value: `${rInt(78, 96)}%`, sub: "Last 30 days" },
                { label: "Doc Storage Used", value: `${rInt(2, 8)}.${rInt(0, 9)} GB`, sub: `of ${rInt(10, 50)} GB` },
                { label: "Workflow SLA", value: `${rInt(85, 98)}%`, sub: "Met on time" },
              ].map((k) => (
                <Card key={k.label} className="dmw-kpi-card">
                  <CardContent className="glass-subtle p-4">
                    <div className="dmw-kpi-value text-lg font-bold">{k.value}</div>
                    <div className="dmw-kpi-label text-xs">{k.label}</div>
                    <div className="dmw-kpi-sub text-xs">{k.sub}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="dmw-chart-card">
                <CardHeader className="pb-2">
                  <CardTitle className="dmw-chart-title text-sm">Version History Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={MONTHS.map((m) => ({ month: m, created: rInt(20, 80), modified: rInt(30, 100), reviewed: rInt(15, 60) }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e5e7eb)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="created" name="Created" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="modified" name="Modified" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="reviewed" name="Reviewed" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="dmw-chart-card">
                <CardHeader className="pb-2">
                  <CardTitle className="dmw-chart-title text-sm">Workflow Completion Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={MONTHS.map((m) => ({ month: m, avg: rInt(2, 7), p95: rInt(5, 12), p99: rInt(8, 18) }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e5e7eb)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" unit="d" />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                      <Line type="monotone" dataKey="avg" name="Avg Days" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="p95" name="P95 Days" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
                      <Line type="monotone" dataKey="p99" name="P99 Days" stroke="#f43f5e" strokeWidth={2} strokeDasharray="2 4" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="dmw-chart-card">
                <CardHeader className="pb-2">
                  <CardTitle className="dmw-chart-title text-sm">Warehouse Document Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={WAREHOUSES.map((w) => ({ warehouse: w, docs: documents.filter((d) => d.warehouse === w).length, workflows: workflows.filter((wf) => wf.warehouse === w).length }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e5e7eb)" />
                      <XAxis dataKey="warehouse" tick={{ fontSize: 9 }} stroke="var(--chart-axis, #6b7280)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="var(--chart-axis, #6b7280)" />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="docs" name="Documents" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="workflows" name="Workflows" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="dmw-chart-card">
                <CardHeader className="pb-2">
                  <CardTitle className="dmw-chart-title text-sm">Change Type Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={(() => {
                        const counts: Record<string, number> = {}
                        versionHistory.forEach((v) => { counts[v.changeType] = (counts[v.changeType] || 0) + 1 })
                        return Object.entries(counts).map(([name, count]) => ({ name, count }))
                      })()} dataKey="count" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={2} label={({ name, count }) => `${name}: ${count}`}>
                        {(() => {
                          const ctc = ["#10b981", "#f59e0b", "#8b5cf6", "#f43f5e", "#06b6d4", "#ec4899"]
                          const ctData = (() => {
                            const counts: Record<string, number> = {}
                            versionHistory.forEach((v) => { counts[v.changeType] = (counts[v.changeType] || 0) + 1 })
                            return Object.entries(counts).map(([name, count]) => ({ name, count }))
                          })()
                          return ctData.map((_, idx) => <Cell key={idx} fill={ctc[idx % ctc.length]} />)
                        })()}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Version History Table */}
            <Card className="dmw-table-card">
              <CardHeader className="pb-2">
                <CardTitle className="dmw-chart-title text-sm">Recent Version History</CardTitle>
              </CardHeader>
              <CardContent className="glass-subtle p-0">
                <div className="overflow-x-auto">
                  <Table className="table-hover-highlight">
                    <TableHeader>
                      <TableRow className="dmw-table-header">
                        <TableHead className="dmw-th">Version ID</TableHead>
                        <TableHead className="dmw-th">Document</TableHead>
                        <TableHead className="dmw-th">Version</TableHead>
                        <TableHead className="dmw-th">Author</TableHead>
                        <TableHead className="dmw-th">Change Type</TableHead>
                        <TableHead className="dmw-th">Date</TableHead>
                        <TableHead className="dmw-th">Size</TableHead>
                        <TableHead className="dmw-th">Summary</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {versionHistory.slice(0, 20).map((vh) => (
                        <TableRow key={vh.id} className="dmw-table-row">
                          <TableCell className="dmw-td font-mono text-xs">{vh.id}</TableCell>
                          <TableCell className="dmw-td text-xs font-medium">{vh.documentId}</TableCell>
                          <TableCell className="dmw-td font-mono text-xs">{vh.version}</TableCell>
                          <TableCell className="dmw-td text-xs">{vh.author.name}</TableCell>
                          <TableCell className="dmw-td text-xs">{vh.changeType}</TableCell>
                          <TableCell className="dmw-td text-xs">{vh.date}</TableCell>
                          <TableCell className="dmw-td font-mono text-xs">{vh.size}</TableCell>
                          <TableCell className="dmw-td text-xs max-w-[200px] truncate">{vh.summary}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Document Detail Drawer */}
      {drawerOpen && selectedDoc && (
        <div className="dmw-drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="dmw-drawer" onClick={(e) => e.stopPropagation()}>
            <div className={cn("dmw-drawer-header p-5", selectedDoc.status === "Published" ? "dmw-drawer-header-published" : selectedDoc.status === "Under Review" ? "dmw-drawer-header-review" : selectedDoc.status === "Approved" ? "dmw-drawer-header-approved" : "dmw-drawer-header-draft")}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="dmw-drawer-avatar">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg line-clamp-1">{selectedDoc.title}</h2>
                    <p className="text-sm opacity-80">{selectedDoc.id} · {selectedDoc.version}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setDrawerOpen(false)} className="text-white/70 hover:text-white hover:bg-white/10">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-3">
<div className="chip-group">
                <Badge className={cn(STATUS_COLORS[selectedDoc.status])}>{selectedDoc.status}</Badge>
                <Badge className={cn(CLASS_COLORS[selectedDoc.classification])}>{selectedDoc.classification}</Badge>
                <Badge className="badge-interactive dmw-badge-trend dmw-badge-trend-up flex items-center gap-1"><Download className="h-3 w-3" /> {selectedDoc.downloads}</Badge>
                {selectedDoc.isLocked && <Badge className="badge-interactive dmw-badge-locked"><Lock className="h-3 w-3 mr-1" /> Locked</Badge>}
</div>
              </div>
            </div>

            {/* Drawer Flow */}
            <div className="px-5 py-3 border-b">
              <div className="flex items-center justify-between">
                {["Created", "Under Review", "Approved", "Published"].map((step, idx) => (
                  <Fragment key={step}>
                    <div className="flex flex-col items-center">
                      <div className={cn("dmw-flow-dot", idx <= 1 && (selectedDoc.status === "Published" || selectedDoc.status === "Approved") ? "dmw-flow-dot-active" : "dmw-flow-dot-inactive")}>
                        {idx <= 1 && (selectedDoc.status === "Published" || selectedDoc.status === "Approved") ? <CheckCircle2 className="h-3 w-3" /> : <span className="text-[10px]">{idx + 1}</span>}
                      </div>
                      <span className="text-[10px] mt-1 opacity-70">{step}</span>
                    </div>
                    {idx < 3 && <div className={cn("flex-1 h-0.5 mx-1", idx < 1 && (selectedDoc.status === "Published" || selectedDoc.status === "Approved") ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-600")} />}
                  </Fragment>
                ))}
              </div>
            </div>

            {/* Drawer Content */}
            <div className="overflow-y-auto flex-1 p-5 space-y-5">
              {/* Info Grid */}
              <div>
                <h3 className="dmw-section-title text-sm font-semibold mb-2">Document Details</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Document ID", value: selectedDoc.id },
                    { label: "Category", value: selectedDoc.category },
                    { label: "File Type", value: selectedDoc.fileType },
                    { label: "Size", value: selectedDoc.size },
                    { label: "Version", value: selectedDoc.version },
                    { label: "Retention", value: selectedDoc.retention },
                    { label: "Department", value: selectedDoc.department },
                    { label: "Warehouse", value: selectedDoc.warehouse },
                    { label: "Created", value: selectedDoc.createdDate },
                    { label: "Modified", value: selectedDoc.modifiedDate },
                    { label: "Expiry", value: selectedDoc.expiryDate || "N/A" },
                    { label: "Classification", value: selectedDoc.classification },
                  ].map((item) => (
                    <div key={item.label} className="dmw-info-cell p-2 rounded-lg">
                      <div className="dmw-info-label text-[10px] uppercase opacity-50">{item.label}</div>
                      <div className="dmw-info-value text-xs font-medium">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Author & Reviewer */}
              <div>
                <h3 className="dmw-section-title text-sm font-semibold mb-2">People</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="dmw-info-cell p-2 rounded-lg flex items-center gap-2">
                    <div className="dmw-person-avatar"><span className="text-[10px] font-bold">{selectedDoc.author.avatar}</span></div>
                    <div>
                      <div className="dmw-info-label text-[10px]">Author</div>
                      <div className="text-xs font-medium">{selectedDoc.author.name}</div>
                      <div className="text-[10px] opacity-60">{selectedDoc.author.role}</div>
                    </div>
                  </div>
                  <div className="dmw-info-cell p-2 rounded-lg flex items-center gap-2">
                    <div className="dmw-person-avatar"><span className="text-[10px] font-bold">{selectedDoc.reviewer.avatar}</span></div>
                    <div>
                      <div className="dmw-info-label text-[10px]">Reviewer</div>
                      <div className="text-xs font-medium">{selectedDoc.reviewer.name}</div>
                      <div className="text-[10px] opacity-60">{selectedDoc.reviewer.role}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="dmw-section-title text-sm font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDoc.tags.map((tag) => (
                    <Badge key={tag} className="badge-interactive dmw-tag-badge text-xs"><Tag className="h-3 w-3 mr-1" />{tag}</Badge>
                  ))}
                </div>
              </div>

              {/* Workflow */}
              {selectedDoc.workflowId && (() => {
                const wf = workflows.find((w) => w.id === selectedDoc.workflowId)
                if (!wf) return null
                return (
                  <div>
                    <h3 className="dmw-section-title text-sm font-semibold mb-2">Approval Workflow</h3>
                    <div className="space-y-2">
                      {wf.approvers.map((a) => (
                        <div key={a.level} className={cn("dmw-wf-step p-2 rounded-lg flex items-center justify-between", a.status === "Approved" && "dmw-wf-step-approved", a.status === "Rejected" && "dmw-wf-step-rejected")}>
                          <div className="flex items-center gap-2">
                            <div className="dmw-person-avatar"><span className="text-[10px] font-bold">{a.employee.avatar}</span></div>
                            <div>
                              <div className="text-xs font-medium">{a.employee.name}</div>
                              <div className="text-[10px] opacity-60">Level {a.level} — {a.employee.role}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={cn(STATUS_COLORS[a.status], "text-[9px]")}>{a.status}</Badge>
                            {a.comment && <p className="text-[10px] opacity-60 mt-1 max-w-[150px]">{a.comment}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}

              {/* Actions */}
              <div>
                <h3 className="dmw-section-title text-sm font-semibold mb-2">Actions</h3>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="btn-outline-animate dmw-action-btn text-xs"><Download className="h-3 w-3 mr-1" /> Download</Button>
                  <Button variant="outline" size="sm" className="btn-outline-animate dmw-action-btn text-xs"><Eye className="h-3 w-3 mr-1" /> Preview</Button>
                  <Button variant="outline" size="sm" className="btn-outline-animate dmw-action-btn text-xs"><Edit className="h-3 w-3 mr-1" /> Edit</Button>
                  <Button variant="outline" size="sm" className="btn-outline-animate dmw-action-btn text-xs"><Paperclip className="h-3 w-3 mr-1" /> Attach</Button>
                  <Button variant="outline" size="sm" className="btn-outline-animate dmw-action-btn text-xs"><RotateCcw className="h-3 w-3 mr-1" /> Version</Button>
                  <Button variant="outline" size="sm" className="btn-outline-animate dmw-action-btn text-xs"><Archive className="h-3 w-3 mr-1" /> Archive</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
