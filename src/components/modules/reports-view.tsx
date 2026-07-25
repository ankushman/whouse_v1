"use client"

import { useState, useCallback } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { ExportButton, exportToCSV } from "@/components/shared/export-button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  FileBarChart,
  Download,
  FileText,
  Building2,
  Package,
  Truck,
  DollarSign,
  Calendar,
  RefreshCw,
  Eye,
  FileSpreadsheet,
  DownloadCloud,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast-helper"
import { kpiMetrics, warehousePerformance } from "@/data/mock-data"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Report {
  id: string
  title: string
  description: string
  icon: typeof FileBarChart
  lastGenerated: string
  frequency: string
  formats: ("pdf" | "excel")[]
}

interface ReportHistoryItem {
  id: string
  name: string
  generatedDate: string
  type: "PDF" | "Excel"
  size: string
  status: "Completed" | "Processing" | "Failed"
}

const reports: Report[] = [
  {
    id: "exec",
    title: "Executive Summary",
    description: "Comprehensive overview of all operations across all warehouses with KPIs, trends and recommendations",
    icon: FileBarChart,
    lastGenerated: "Today, 09:00 AM",
    frequency: "Daily",
    formats: ["pdf", "excel"],
  },
  {
    id: "warehouse",
    title: "Warehouse Performance",
    description: "Detailed warehouse metrics including throughput, accuracy, SLA compliance and equipment status",
    icon: Building2,
    lastGenerated: "Today, 08:30 AM",
    frequency: "Daily",
    formats: ["pdf", "excel"],
  },
  {
    id: "mis",
    title: "Monthly MIS",
    description: "Monthly management information system report with operational and financial summaries",
    icon: FileText,
    lastGenerated: "1 Jan 2025",
    frequency: "Monthly",
    formats: ["pdf", "excel"],
  },
  {
    id: "inventory",
    title: "Inventory Report",
    description: "Stock levels, variance analysis, ABC classification and cycle count summaries",
    icon: Package,
    lastGenerated: "Today, 07:00 AM",
    frequency: "Weekly",
    formats: ["pdf", "excel"],
  },
  {
    id: "transport",
    title: "Transportation Report",
    description: "Fleet utilization, delivery performance, OTIF metrics and route analytics",
    icon: Truck,
    lastGenerated: "Today, 06:00 AM",
    frequency: "Daily",
    formats: ["pdf", "excel"],
  },
  {
    id: "cost",
    title: "Cost Analysis",
    description: "Financial performance breakdown, cost trends and optimization opportunities",
    icon: DollarSign,
    lastGenerated: "15 Jan 2025",
    frequency: "Monthly",
    formats: ["pdf"],
  },
]

const recentReports: ReportHistoryItem[] = [
  { id: "rh-1", name: "Executive Summary", generatedDate: "20 Jan 2025, 09:00 AM", type: "PDF", size: "2.4 MB", status: "Completed" },
  { id: "rh-2", name: "Warehouse Performance", generatedDate: "20 Jan 2025, 08:30 AM", type: "Excel", size: "1.8 MB", status: "Completed" },
  { id: "rh-3", name: "Inventory Report", generatedDate: "19 Jan 2025, 07:00 AM", type: "PDF", size: "3.1 MB", status: "Completed" },
  { id: "rh-4", name: "Transportation Report", generatedDate: "19 Jan 2025, 06:00 AM", type: "Excel", size: "956 KB", status: "Completed" },
  { id: "rh-5", name: "Monthly MIS", generatedDate: "1 Jan 2025, 10:00 AM", type: "PDF", size: "5.2 MB", status: "Completed" },
  { id: "rh-6", name: "Cost Analysis", generatedDate: "15 Jan 2025, 11:00 AM", type: "PDF", size: "1.3 MB", status: "Failed" },
  { id: "rh-7", name: "Executive Summary", generatedDate: "19 Jan 2025, 09:00 AM", type: "Excel", size: "890 KB", status: "Completed" },
  { id: "rh-8", name: "Warehouse Performance", generatedDate: "18 Jan 2025, 08:30 AM", type: "PDF", size: "2.7 MB", status: "Completed" },
  { id: "rh-9", name: "Inventory Report", generatedDate: "12 Jan 2025, 07:00 AM", type: "Excel", size: "1.5 MB", status: "Completed" },
  { id: "rh-10", name: "Transportation Report", generatedDate: "18 Jan 2025, 06:00 AM", type: "PDF", size: "1.1 MB", status: "Processing" },
]

const scheduleOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "custom", label: "Custom" },
]

export function ReportsView() {
  const { toast: appToast } = useToast()
  const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set())
  const [readyIds, setReadyIds] = useState<Set<string>>(new Set())
  const [schedules, setSchedules] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    reports.forEach(r => {
      initial[r.id] = r.frequency.toLowerCase()
    })
    return initial
  })

  const handleGenerateReport = useCallback((reportId: string, reportTitle: string) => {
    if (generatingIds.has(reportId)) return
    setGeneratingIds(prev => new Set(prev).add(reportId))
    setReadyIds(prev => {
      const next = new Set(prev)
      next.delete(reportId)
      return next
    })

    setTimeout(() => {
      setGeneratingIds(prev => {
        const next = new Set(prev)
        next.delete(reportId)
        return next
      })
      setReadyIds(prev => new Set(prev).add(reportId))
      toast.success("Report Generated", "Your report is ready to download")
    }, 1500)
  }, [generatingIds])

  const handleDownloadAll = useCallback(() => {
    const loadingId = "download-all"
    toast.loading("Preparing Downloads", "Compressing 3 reports...", { id: loadingId })
    setTimeout(() => {
      toast.success("Downloads Ready", "3 reports prepared for download", { id: loadingId })
    }, 2000)
  }, [])

  const handleScheduleChange = useCallback((reportId: string, value: string) => {
    setSchedules(prev => ({ ...prev, [reportId]: value }))
    const label = scheduleOptions.find(o => o.value === value)?.label ?? value
    appToast.success("Schedule Updated", `Report set to ${label} frequency`)
  }, [appToast])

  // CSV export handlers
  const handleExportExecSummaryCSV = () => {
    const data = kpiMetrics.map(m => ({
      KPI: m.label,
      Value: m.value,
      Unit: m.unit,
      Trend: m.trend === "up" ? "↑" : "↓",
      "Change (%)": m.trendValue,
    }))
    exportToCSV(data, "executive-summary-kpis")
  }

  const handleExportWarehousePerfCSV = () => {
    const data = warehousePerformance.map(w => ({
      Warehouse: w.name,
      "Inbound (units)": w.inbound,
      "Outbound (units)": w.outbound,
      "Accuracy (%)": w.accuracy,
      "SLA Achievement (%)": w.sla,
    }))
    exportToCSV(data, "warehouse-performance")
  }

  const getExportHandlers = (reportId: string) => {
    switch (reportId) {
      case "exec":
        return { onExportCSV: handleExportExecSummaryCSV }
      case "warehouse":
        return { onExportCSV: handleExportWarehousePerfCSV }
      default:
        return {}
    }
  }

  const getStatusBadge = (reportId: string) => {
    if (generatingIds.has(reportId)) {
      return (
        <Badge variant="outline" className="text-[10px] gap-1 text-amber-600 border-amber-300 bg-amber-50 dark:text-amber-400 dark:border-amber-700 dark:bg-amber-950/40">
          <Loader2 className="h-2.5 w-2.5 animate-spin" />
          Generating
        </Badge>
      )
    }
    if (readyIds.has(reportId)) {
      return (
        <Badge variant="outline" className="text-[10px] gap-1 text-emerald-600 border-emerald-300 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-700 dark:bg-emerald-950/40">
          <CheckCircle2 className="h-2.5 w-2.5" />
          Ready
        </Badge>
      )
    }
    return null
  }

  const getHistoryStatusBadge = (status: ReportHistoryItem["status"]) => {
    switch (status) {
      case "Completed":
        return <Badge variant="secondary" className="text-[10px] gap-1 text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/40"><CheckCircle2 className="h-2.5 w-2.5" />{status}</Badge>
      case "Processing":
        return <Badge variant="secondary" className="text-[10px] gap-1 text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/40"><Loader2 className="h-2.5 w-2.5 animate-spin" />{status}</Badge>
      case "Failed":
        return <Badge variant="secondary" className="text-[10px] gap-1 text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/40"><AlertCircle className="h-2.5 w-2.5" />{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Generate and download operational reports"
        actions={
          <div className="flex items-center gap-2">
            <Button size="sm" className="gap-1.5" onClick={handleDownloadAll}>
              <DownloadCloud className="h-3.5 w-3.5" /> Download All
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => appToast.info("Refreshing all reports...", "This may take a moment", { duration: 2000 })}>
              <RefreshCw className="h-3.5 w-3.5" /> Refresh All
            </Button>
          </div>
        }
      />

      {/* Schedule Banner */}
      <Card className="rounded-xl border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/30">
        <CardContent className="flex items-center gap-3 p-4">
          <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Automated Report Schedule</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">Executive Summary: Daily 9AM • MIS: 1st of every month • Cost Analysis: 15th of every month</p>
          </div>
          <Button variant="outline" size="sm" className="text-xs">Manage Schedule</Button>
        </CardContent>
      </Card>

      {/* Report Cards Grid */}
      <div className="stagger-children grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => {
          const Icon = report.icon
          const exportHandlers = getExportHandlers(report.id)
          const hasCSVExport = !!exportHandlers.onExportCSV
          const isGenerating = generatingIds.has(report.id)

          return (
            <Card key={report.id} className={cn(
              "card-depth hover-lift-sm data-card group rounded-xl border-border/60 shadow-sm transition-all hover:border-border",
              isGenerating && "shimmer-loading pointer-events-none"
            )}>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-sm font-semibold">{report.title}</CardTitle>
                      {getStatusBadge(report.id)}
                    </div>
                    <CardDescription className="mt-0.5 text-xs line-clamp-2">{report.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Last Generated</span>
                  <span className="font-medium">{report.lastGenerated}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Schedule</span>
                  <Select
                    value={schedules[report.id]}
                    onValueChange={(value) => handleScheduleChange(report.id, value)}
                  >
                    <SelectTrigger size="sm" className="w-[100px] h-7 text-[10px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {scheduleOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value} className="text-xs">
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="flex items-center gap-2">
                  <Button size="sm" className="flex-1 text-xs gap-1.5 h-8" disabled={isGenerating} onClick={() => handleGenerateReport(report.id, report.title)}>
                    {isGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />} Generate
                  </Button>
                  {hasCSVExport ? (
                    <ExportButton onExportCSV={exportHandlers.onExportCSV} />
                  ) : (
                    <Button variant="outline" size="sm" className="text-xs gap-1.5 h-8" title="Download PDF">
                      <Download className="h-3 w-3" />
                      <span className="hidden sm:inline">PDF</span>
                    </Button>
                  )}
                  {report.formats.includes("excel") && !hasCSVExport && (
                    <Button variant="outline" size="sm" className="text-xs gap-1.5 h-8" title="Download Excel">
                      <FileSpreadsheet className="h-3 w-3" />
                      <span className="hidden sm:inline">Excel</span>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="text-xs gap-1.5 h-8" title="Preview">
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Reports History Table */}
      <Card className="rounded-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">Recent Reports</CardTitle>
          </div>
          <CardDescription className="text-xs">History of recently generated reports</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader className="table-header-sticky-glass">
                <TableRow className="table-row-hover">
                  <TableHead className="text-xs">Report Name</TableHead>
                  <TableHead className="text-xs">Generated Date</TableHead>
                  <TableHead className="text-xs">Type</TableHead>
                  <TableHead className="text-xs">Size</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentReports.map((item) => (
                  <TableRow key={item.id} className="table-row-hover">
                    <TableCell className="text-xs font-medium">{item.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{item.generatedDate}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] gap-1">
                        {item.type === "PDF" ? <FileText className="h-2.5 w-2.5 text-red-500" /> : <FileSpreadsheet className="h-2.5 w-2.5 text-emerald-600" />}
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-number">{item.size}</TableCell>
                    <TableCell>{getHistoryStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Download" disabled={item.status !== "Completed"}>
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Preview">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
