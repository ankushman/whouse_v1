"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BrainCircuit,
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ExternalLink,
  XCircle,
  Share2,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// ---- Types ----

type InsightSeverity = "critical" | "warning" | "opportunity" | "info"

interface Insight {
  id: string
  severity: InsightSeverity
  title: string
  description: string
  details: string
  confidence: number
  impact: "High" | "Medium" | "Low"
}

// ---- Mock Data ----

const insights: Insight[] = [
  {
    id: "ai-1",
    severity: "critical",
    title: "Mumbai Warehouse Approaching Capacity Overflow",
    description: "Zone A3-A5 at 95% utilization — risk of overflow within 4 hours.",
    details: "Current inbound queue has 47 pending GRNs. Average processing time is 35 min/unit. At current rate, Zone A3-A5 will reach 100% by approximately 2:30 PM IST. Recommend activating the overflow staging area and redirecting 12 units to Zone B1-B3. Estimated additional handling time: 15 min/unit.",
    confidence: 94,
    impact: "High",
  },
  {
    id: "ai-2",
    severity: "warning",
    title: "SLA Breach Risk — Delhi NCR Inbound Shipments",
    description: "Processing delay increased 18% — 3 shipments at risk of missing SLA.",
    details: "INV-2024-3847 (deadline: 4:00 PM), INV-2024-3901 (deadline: 3:15 PM), INV-2024-3765 (already overdue by 30 min). Root cause: Dock D4 equipment malfunction causing backup. Repair team dispatched at 1:20 PM, ETA 45 min. Recommend activating backup dock D6.",
    confidence: 89,
    impact: "Medium",
  },
  {
    id: "ai-3",
    severity: "opportunity",
    title: "Route Consolidation: Chennai + Bangalore",
    description: "Combining outbound routes could reduce costs by 12% (~₹2.4L/month).",
    details: "Analysis of last 90 days shows 340 shipments on CHN→BLR and 280 on BLR→CHN routes with average 40% empty return capacity. Consolidating to a loop route with 3 shared vehicles would reduce total distance by 847 km/week. Implementation requires fleet manager approval and 2-week driver retraining.",
    confidence: 82,
    impact: "High",
  },
  {
    id: "ai-4",
    severity: "info",
    title: "Pune Night Shift Equipment Underutilization",
    description: "Forklift utilization dropped 8% — consider reallocation to morning shift.",
    details: "Night shift (10 PM - 6 AM) averaged 62% utilization across 6 forklifts, down from 70% last week. Morning shift shows consistent 85% with occasional queuing. Reallocating 2 units would bring morning utilization to ~78% and night to ~70% — both within optimal range.",
    confidence: 91,
    impact: "Low",
  },
]

const severityConfig: Record<InsightSeverity, {
  icon: React.ComponentType<{ className?: string }>
  badgeClass: string
  cardBg: string
  dotColor: string
}> = {
  critical: {
    icon: AlertTriangle,
    badgeClass: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/60",
    cardBg: "data-viz-gradient",
    dotColor: "bg-red-500",
  },
  warning: {
    icon: TrendingUp,
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60",
    cardBg: "bg-muted/20",
    dotColor: "bg-amber-500",
  },
  opportunity: {
    icon: Lightbulb,
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60",
    cardBg: "bg-muted/20",
    dotColor: "bg-emerald-500",
  },
  info: {
    icon: Info,
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60",
    cardBg: "bg-muted/20",
    dotColor: "bg-blue-500",
  },
}

const impactColors: Record<string, string> = {
  High: "text-red-600 dark:text-red-400",
  Medium: "text-amber-600 dark:text-amber-400",
  Low: "text-blue-600 dark:text-blue-400",
}

// ---- Component ----

export function AIInsightsPanel() {
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set())
  // Bug A1 fix: insights are now component state so Apply/Dismiss actually change the UI.
  // Previously `insights` was a module-level const and Apply/Dismiss handlers only showed a toast,
  // giving false confirmation while leaving the list unchanged.
  const [insightList, setInsightList] = React.useState<Insight[]>(insights)
  // Track which insights have been "applied" so we can show a different visual state.
  const [appliedIds, setAppliedIds] = React.useState<Set<string>>(new Set())

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleApply = (insight: Insight) => {
    setAppliedIds((prev) => new Set(prev).add(insight.id))
    toast.success("Recommendation Applied", {
      description: `"${insight.title}" has been queued for implementation`,
    })
  }

  const handleDismiss = (id: string) => {
    setInsightList((prev) => prev.filter((i) => i.id !== id))
    setExpandedIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    // Bug 33-AUDIT#18 (LOW) fix: also clear the appliedIds entry so the Set doesn't
    // accumulate stale IDs forever (would matter if insights were re-added later).
    setAppliedIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    toast.info("Insight Dismissed", { description: "The insight has been archived" })
  }

  const handleDismissAll = () => {
    if (insightList.length === 0) {
      toast.info("No insights to dismiss", { description: "The insights list is already empty" })
      return
    }
    const dismissedCount = insightList.length
    setInsightList([])
    setExpandedIds(new Set())
    // Bug 33-AUDIT#18 (LOW) fix: clear appliedIds too.
    setAppliedIds(new Set())
    toast.info("Insights Dismissed", {
      description: `${dismissedCount} insight${dismissedCount === 1 ? "" : "s"} archived`,
    })
  }

  const handleShare = () => {
    toast.success("Report Shared", { description: "AI insights report sent to operations team" })
  }

  return (
    <Card className="card-depth chart-card card-accent-blue rounded-xl border border-t-2 border-border/60 depth-shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/70">
              <BrainCircuit className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">AI Insights</CardTitle>
              <p className="text-xs text-muted-foreground">Analyzed 2 min ago</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="status-dot-pulse h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">Live</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Insights List */}
        <div className="space-y-2">
          {insightList.length === 0 && (
            <div className="rounded-lg border border-dashed border-border/50 p-6 text-center">
              <Sparkles className="mx-auto h-5 w-5 text-muted-foreground/50" />
              <p className="mt-2 text-xs font-medium text-muted-foreground">All insights resolved</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground/70">
                New AI recommendations will appear here when available
              </p>
            </div>
          )}
          {insightList.map((insight, index) => {
            const config = severityConfig[insight.severity]
            const Icon = config.icon
            const isExpanded = expandedIds.has(insight.id)
            const isApplied = appliedIds.has(insight.id)

            return (
              <div
                key={insight.id}
                className={cn(
                  "rounded-lg border border-border/40 p-3 transition-all duration-300 data-row-enter",
                  config.cardBg,
                  isExpanded && "ring-1 ring-primary/20",
                  isApplied && "ring-1 ring-emerald-400/40 bg-emerald-50/40 dark:bg-emerald-950/30"
                )}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Header Row */}
                <div className="flex items-start gap-2.5">
                  <div className={cn("mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border", config.badgeClass)}>
                    <Icon className="h-3 w-3" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-semibold leading-tight">{insight.title}</h4>
                      <Badge
                        variant="outline"
                        className={cn("tag-chip text-[9px] gap-0.5 px-1.5 py-0", config.badgeClass)}
                      >
                        {insight.severity}
                      </Badge>
                      {isApplied && (
                        <Badge variant="outline" className="text-[9px] gap-0.5 px-1.5 py-0 border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                          Applied
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                      {insight.description}
                    </p>

                    {/* Meta Row */}
                    <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        Confidence:
                        <span className="font-semibold text-foreground">{insight.confidence}%</span>
                      </span>
                      <span className="text-border">|</span>
                      <span className="flex items-center gap-1">
                        Impact:
                        <span className={cn("font-semibold", impactColors[insight.impact])}>
                          {insight.impact}
                        </span>
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleExpand(insight.id)}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label={isExpanded ? "Collapse insight" : "Expand insight"}
                  >
                    {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-3 overflow-hidden border-t border-border/40 pt-2.5" style={{ animation: "fade-in-up 0.3s ease" }}>
                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                      {insight.details}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <Button
                        size="sm"
                        variant={isApplied ? "secondary" : "outline"}
                        className="h-7 gap-1 text-[10px]"
                        onClick={() => handleApply(insight)}
                        disabled={isApplied}
                      >
                        {isApplied ? (
                          <><Sparkles className="h-2.5 w-2.5" /> Applied</>
                        ) : (
                          <><ExternalLink className="h-2.5 w-2.5" /> Apply Recommendation</>
                        )}
                      </Button>
                      {/* Bug A2 fix: "Dismiss" button now actually dismisses (was calling toggleExpand). */}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 gap-1 text-[10px] hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                        onClick={() => handleDismiss(insight.id)}
                      >
                        <XCircle className="h-2.5 w-2.5" /> Dismiss
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 pt-1">
          <Button
            size="sm"
            variant="outline"
            className="h-7 gap-1.5 text-[10px] flex-1"
            onClick={() => {
              const first = insightList[0]
              if (first) handleApply(first)
              else toast.info("No insights to apply", { description: "All recommendations have been resolved" })
            }}
            disabled={insightList.length === 0}
          >
            <Sparkles className="h-3 w-3 text-blue-500" /> Apply Recommendation
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 gap-1.5 text-[10px] flex-1"
            onClick={handleDismissAll}
            disabled={insightList.length === 0}
          >
            <XCircle className="h-3 w-3" /> Dismiss All
          </Button>
          <Button size="sm" variant="outline" className="h-7 gap-1.5 text-[10px]" onClick={handleShare}>
            <Share2 className="h-3 w-3" />
          </Button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          <Sparkles className="h-2.5 w-2.5 text-muted-foreground/50" />
          <p className="text-[9px] text-muted-foreground/50">Powered by AutoFlow AI v2.1</p>
        </div>
      </CardContent>
    </Card>
  )
}
