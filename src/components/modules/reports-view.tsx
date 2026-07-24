"use client"

import { PageHeader } from "@/components/shared/page-header"
import { ExportButton, exportToCSV } from "@/components/shared/export-button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
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
} from "lucide-react"
import { toast } from "sonner"
import { kpiMetrics, warehousePerformance } from "@/data/mock-data"

interface Report {
  id: string
  title: string
  description: string
  icon: typeof FileBarChart
  lastGenerated: string
  frequency: string
  formats: ("pdf" | "excel")[]
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

export function ReportsView() {
  const handleGenerateReport = (reportId: string, reportTitle: string) => {
    toast.loading(`Generating ${reportTitle}...`, {
      id: reportId,
    })
    setTimeout(() => {
      toast.success(`${reportTitle} generated successfully`, {
        id: reportId,
        description: "Report ready for download",
        duration: 4000,
      })
    }, 1500)
  }
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Generate and download operational reports"
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => toast.info("Refreshing all reports...", { description: "This may take a moment", duration: 2000 })}>
            <RefreshCw className="h-3.5 w-3.5" /> Refresh All
          </Button>
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => {
          const Icon = report.icon
          const exportHandlers = getExportHandlers(report.id)
          const hasCSVExport = !!exportHandlers.onExportCSV

          return (
            <Card key={report.id} className="group rounded-xl border-border/60 shadow-sm transition-all hover:shadow-md hover:border-border">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-semibold">{report.title}</CardTitle>
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
                  <span className="text-muted-foreground">Frequency</span>
                  <Badge variant="secondary" className="text-[10px]">{report.frequency}</Badge>
                </div>
                <Separator />
                <div className="flex items-center gap-2">
                  <Button size="sm" className="flex-1 text-xs gap-1.5 h-8" onClick={() => handleGenerateReport(report.id, report.title)}>
                    <RefreshCw className="h-3 w-3" /> Generate
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
    </div>
  )
}
