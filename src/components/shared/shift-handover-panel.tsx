"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  ArrowRightLeft,
  Clock,
  CheckCircle2,
  Loader2,
  AlertCircle,
  TrendingUp,
  ClipboardCheck,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// ---- Types ----

type TaskStatus = "done" | "pending" | "in-progress"

interface HandoverTask {
  id: string
  description: string
  assignee: string
  status: TaskStatus
}

// ---- Mock Data ----

const handoverTasks: HandoverTask[] = [
  { id: "ht-1", description: "Inbound GRN pending count verified", assignee: "Rajesh K.", status: "done" },
  { id: "ht-2", description: "Dock assignments handed over", assignee: "Priya S.", status: "done" },
  { id: "ht-3", description: "Equipment status report submitted", assignee: "Amit P.", status: "done" },
  { id: "ht-4", description: "Open alerts reviewed and escalated", assignee: "Rajesh K.", status: "in-progress" },
  { id: "ht-5", description: "Inventory variance report shared", assignee: "Sunita M.", status: "pending" },
  { id: "ht-6", description: "Vehicle dispatch log updated", assignee: "Vikram D.", status: "pending" },
  { id: "ht-7", description: "Safety walkthrough completed", assignee: "Amit P.", status: "done" },
  { id: "ht-8", description: "Shift productivity metrics recorded", assignee: "Priya S.", status: "pending" },
]

const shiftSummary = [
  { label: "Tasks Completed", value: "47/52", icon: ClipboardCheck, color: "text-emerald-600 dark:text-emerald-400" },
  { label: "Pending Escalations", value: "3", icon: AlertCircle, color: "text-amber-600 dark:text-amber-400" },
  { label: "On-time Rate", value: "96%", icon: TrendingUp, color: "text-blue-600 dark:text-blue-400" },
]

// ---- Helpers ----

function getStatusConfig(status: TaskStatus) {
  switch (status) {
    case "done":
      return {
        icon: CheckCircle2,
        className: "text-emerald-500",
        textClass: "line-through text-muted-foreground",
        badgeClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
      }
    case "in-progress":
      return {
        icon: Loader2,
        className: "text-blue-500 animate-spin",
        textClass: "text-foreground",
        badgeClass: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
      }
    case "pending":
      return {
        icon: Clock,
        className: "text-amber-500",
        textClass: "text-muted-foreground",
        badgeClass: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
      }
  }
}

// ---- Component ----

export function ShiftHandoverPanel() {
  const [taskStates, setTaskStates] = React.useState<Record<string, TaskStatus>>(
    Object.fromEntries(handoverTasks.map((t) => [t.id, t.status]))
  )

  const toggleTask = (id: string) => {
    setTaskStates((prev) => {
      const current = prev[id]
      const next = current === "done" ? "pending" : current === "pending" ? "in-progress" : "done"
      return { ...prev, [id]: next }
    })
  }

  const completedCount = Object.values(taskStates).filter((s) => s === "done").length
  const totalCount = handoverTasks.length
  const progressPercent = Math.round((completedCount / totalCount) * 100)

  const handleCompleteHandover = () => {
    toast.success("Handover Complete", { description: "Morning shift handover has been finalized and sent to afternoon shift supervisor" })
  }

  return (
    <Card className="card-depth rounded-xl border border-t-2 border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-950/70">
              <ArrowRightLeft className="h-4 w-4 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">Shift Handover</CardTitle>
              <p className="text-xs text-muted-foreground">Morning → Afternoon transition</p>
            </div>
          </div>
          <Badge variant="outline" className="tag-chip text-[10px] border-violet-200 text-violet-700 dark:border-violet-800/60 dark:text-violet-300">
            <Clock className="h-2.5 w-2.5" /> 2h 45m left
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Shift Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium">Morning Shift Progress</span>
            <span className="text-muted-foreground">6 AM – 2 PM</span>
          </div>
          <div className="relative h-2 rounded-full bg-muted/50">
            <div className="progress-bar-animated h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-500" style={{ width: "72%" }} />
          </div>
          <p className="text-right text-[10px] text-muted-foreground">72% complete · 2h 14m remaining</p>
        </div>

        {/* Shift Summary Stats */}
        <div className="grid grid-cols-3 gap-2">
          {shiftSummary.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="rounded-lg border border-border/40 bg-muted/20 p-2 text-center transition-smooth">
                <Icon className={cn("mx-auto h-3.5 w-3.5", stat.color)} />
                <p className={cn("mt-1 text-sm font-bold tabular-nums", stat.color)}>{stat.value}</p>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </div>
            )
          })}
        </div>

        {/* Handover Checklist */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Handover Checklist
            </h3>
            <span className="text-[10px] text-muted-foreground">
              {completedCount}/{totalCount} completed
            </span>
          </div>
          <div className="space-y-1.5">
            {handoverTasks.map((task, index) => {
              const status = taskStates[task.id]
              const config = getStatusConfig(status)
              const StatusIcon = config.icon
              const isChecked = status === "done"

              return (
                <div
                  key={task.id}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg border border-border/30 px-2.5 py-2 transition-all data-row-enter",
                    isChecked ? "bg-emerald-50/50 dark:bg-emerald-950/20" : "bg-muted/15",
                    status === "in-progress" && "ring-1 ring-blue-200/50 dark:ring-blue-800/30"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="h-3.5 w-3.5"
                  />
                  <span className={cn("flex-1 text-[11px] leading-tight transition-all", config.textClass, isChecked && "line-through opacity-60")}>
                    {task.description}
                  </span>
                  <StatusIcon className={cn("h-3 w-3 shrink-0", config.className)} />
                  <span className="text-[9px] text-muted-foreground/70 hidden sm:inline">{task.assignee}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Complete Handover Button */}
        <Button
          className="w-full h-8 gap-1.5 text-xs font-medium"
          variant="outline"
          onClick={handleCompleteHandover}
          disabled={progressPercent < 100}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Complete Handover
          {progressPercent < 100 && (
            <span className="ml-1 text-muted-foreground">({completedCount}/{totalCount})</span>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
