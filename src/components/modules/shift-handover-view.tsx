"use client"

import { useState, useMemo, useEffect } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SignaturePad } from "@/components/shared/signature-pad"
import {
  ArrowRightLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ClipboardCheck,
  ShieldCheck,
  User,
  Calendar,
  Truck,
  Package,
  AlertTriangle,
  FileSignature,
  Lock,
  Sparkles,
  ChevronRight,
  History,
  Award,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast-helper"

// ── Types ────────────────────────────────────────────────────────────────────

type TaskStatus = "done" | "pending" | "in-progress"

interface HandoverTask {
  id: string
  description: string
  assignee: string
  status: TaskStatus
  category: "operations" | "safety" | "compliance" | "equipment"
}

interface ShiftSummary {
  label: string
  value: string
  icon: typeof ClipboardCheck
  color: string
}

interface PastHandover {
  id: string
  from: string
  to: string
  shift: string
  timestamp: string
  status: "completed" | "pending" | "acknowledged"
  signatureHash: string
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const handoverTasks: HandoverTask[] = [
  { id: "ht-1", description: "Inbound GRN pending count verified for SKU 4xxx", assignee: "Rajesh K.", status: "done", category: "operations" },
  { id: "ht-2", description: "Dock assignments handed over (Docks 1–4)", assignee: "Priya S.", status: "done", category: "operations" },
  { id: "ht-3", description: "Equipment status report submitted (3 forklifts serviced)", assignee: "Amit P.", status: "done", category: "equipment" },
  { id: "ht-4", description: "Open alerts reviewed and escalated to RM", assignee: "Rajesh K.", status: "in-progress", category: "operations" },
  { id: "ht-5", description: "Inventory variance report shared (SKU 7821 mismatch)", assignee: "Sunita M.", status: "pending", category: "compliance" },
  { id: "ht-6", description: "Vehicle dispatch log updated (12 outbound trucks)", assignee: "Vikram D.", status: "pending", category: "operations" },
  { id: "ht-7", description: "Safety walkthrough completed — fire exits clear", assignee: "Amit P.", status: "done", category: "safety" },
  { id: "ht-8", description: "Shift productivity metrics recorded (96% on-time)", assignee: "Priya S.", status: "pending", category: "operations" },
  { id: "ht-9", description: "Cold storage temp logs verified (2–4°C maintained)", assignee: "Sunita M.", status: "done", category: "safety" },
  { id: "ht-10", description: "Battery charging rotation completed for EV fleet", assignee: "Vikram D.", status: "in-progress", category: "equipment" },
  { id: "ht-11", description: "Hazardous material manifest reconciled", assignee: "Rajesh K.", status: "done", category: "compliance" },
  { id: "ht-12", description: "Visitor log signed and submitted", assignee: "Priya S.", status: "pending", category: "compliance" },
]

const shiftSummary: ShiftSummary[] = [
  { label: "Tasks Completed", value: "47/52", icon: ClipboardCheck, color: "text-emerald-600" },
  { label: "Pending Escalations", value: "3", icon: AlertCircle, color: "text-amber-600" },
  { label: "On-time Rate", value: "96%", icon: TrendingUp, color: "text-blue-600" },
  { label: "Shipments", value: "284", icon: Truck, color: "text-purple-600" },
  { label: "Pick Accuracy", value: "99.4%", icon: Package, color: "text-emerald-600" },
  { label: "Safety Incidents", value: "0", icon: ShieldCheck, color: "text-emerald-600" },
]

const pastHandovers: PastHandover[] = [
  { id: "SHO-2410", from: "Night Shift (10PM-6AM)", to: "Morning Shift (6AM-2PM)", shift: "Night → Morning", timestamp: "2026-07-26 06:14", status: "acknowledged", signatureHash: "0x8a3f...e21b" },
  { id: "SHO-2409", from: "Evening Shift (2PM-10PM)", to: "Night Shift (10PM-6AM)", shift: "Evening → Night", timestamp: "2026-07-25 22:08", status: "completed", signatureHash: "0x4c2d...91af" },
  { id: "SHO-2408", from: "Morning Shift (6AM-2PM)", to: "Evening Shift (2PM-10PM)", shift: "Morning → Evening", timestamp: "2026-07-25 14:11", status: "completed", signatureHash: "0x7e9a...3c0d" },
  { id: "SHO-2407", from: "Night Shift (10PM-6AM)", to: "Morning Shift (6AM-2PM)", shift: "Night → Morning", timestamp: "2026-07-25 06:09", status: "completed", signatureHash: "0x1b5c...88fe" },
]

// ── Component ─────────────────────────────────────────────────────────────────

export function ShiftHandoverView() {
  const { toast } = useToast()
  const [taskStates, setTaskStates] = useState<Record<string, TaskStatus>>(
    Object.fromEntries(handoverTasks.map((t) => [t.id, t.status]))
  )
  const [outgoingSignature, setOutgoingSignature] = useState("")
  const [incomingSignature, setIncomingSignature] = useState("")
  const [outgoingConfirmed, setOutgoingConfirmed] = useState(false)
  const [incomingConfirmed, setIncomingConfirmed] = useState(false)
  const [handoverNotes, setHandoverNotes] = useState("")
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(t)
  }, [])

  const toggleTask = (id: string) => {
    setTaskStates((prev) => {
      const current = prev[id]
      const next = current === "done" ? "pending" : current === "pending" ? "in-progress" : "done"
      return { ...prev, [id]: next }
    })
  }

  const completedCount = useMemo(
    () => Object.values(taskStates).filter((s) => s === "done").length,
    [taskStates]
  )
  const totalCount = handoverTasks.length
  const progressPercent = Math.round((completedCount / totalCount) * 100)

  const allTasksDone = completedCount === totalCount
  const bothSigned = outgoingConfirmed && incomingConfirmed
  const canComplete = allTasksDone && bothSigned

  const handleOutgoingConfirm = (path: string) => {
    setOutgoingConfirmed(true)
    toast.success("Outgoing signature captured", `Hash: 0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`)
  }

  const handleIncomingConfirm = (path: string) => {
    setIncomingConfirmed(true)
    toast.success("Incoming signature captured", "Acknowledgment recorded on blockchain ledger")
  }

  const handleCompleteHandover = () => {
    if (!canComplete) return
    const handoverId = `SHO-${2411 + Math.floor(Math.random() * 9)}`
    toast.success("Handover Complete", `${handoverId} finalized · both signatures verified · ledger updated`)
    // Reset for next handover
    setOutgoingSignature("")
    setIncomingSignature("")
    setOutgoingConfirmed(false)
    setIncomingConfirmed(false)
    setHandoverNotes("")
  }

  const categoryColors: Record<HandoverTask["category"], string> = {
    operations: "border-blue-500/40 text-blue-600 bg-blue-500/5",
    safety: "border-emerald-500/40 text-emerald-600 bg-emerald-500/5",
    compliance: "border-amber-500/40 text-amber-600 bg-amber-500/5",
    equipment: "border-purple-500/40 text-purple-600 bg-purple-500/5",
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <PageHeader
        title="Shift Handover"
        description={`Morning → Afternoon transition · ${new Date(now).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}`}
        actions={
          <Badge variant="outline" className="text-xs handover-status-badge">
            <Clock className="h-3 w-3 mr-1" />
            2h 45m remaining
          </Badge>
        }
      />

      {/* Top KPI strip */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {shiftSummary.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="handover-kpi-card kpi-card-tilt overflow-hidden">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center">
                    <Icon className={cn("h-3.5 w-3.5", stat.color)} />
                  </div>
                </div>
                <div className="mt-2 text-xl font-bold tabular-nums">{stat.value}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{stat.label}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left: Checklist */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Handover Checklist</CardTitle>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">{completedCount}/{totalCount}</span>
                <Progress value={progressPercent} className="h-1.5 w-24" />
              </div>
            </div>
            <CardDescription>Toggle each task to cycle: pending → in-progress → done</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {handoverTasks.map((task, index) => {
              const status = taskStates[task.id]
              const isDone = status === "done"
              const isInProgress = status === "in-progress"
              return (
                <div
                  key={task.id}
                  className={cn(
                    "handover-task-row flex items-center gap-3 rounded-lg border p-3 transition-all data-row-enter",
                    isDone ? "border-emerald-500/30 bg-emerald-500/5" : "border-border bg-card",
                    isInProgress && "ring-1 ring-blue-500/30"
                  )}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={cn(
                      "h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all btn-press",
                      isDone
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : isInProgress
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-muted-foreground/30 hover:border-primary"
                    )}
                    aria-label={`Toggle ${task.description}`}
                  >
                    {isDone && <CheckCircle2 className="h-3 w-3" />}
                    {isInProgress && <Clock className="h-2.5 w-2.5 text-blue-500" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className={cn("text-sm leading-tight", isDone && "line-through opacity-60")}>
                      {task.description}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-0.5">
                        <User className="h-2.5 w-2.5" />
                        {task.assignee}
                      </span>
                      <Badge variant="outline" className={cn("text-[9px] py-0 px-1 capitalize", categoryColors[task.category])}>
                        {task.category}
                      </Badge>
                    </div>
                  </div>
                  <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Right: Handover metadata + notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Handover Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] uppercase text-muted-foreground">Outgoing Shift</div>
                <div className="font-semibold mt-0.5">Morning (6AM-2PM)</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-muted-foreground">Incoming Shift</div>
                <div className="font-semibold mt-0.5">Afternoon (2PM-10PM)</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-muted-foreground">Outgoing Sup.</div>
                <div className="font-medium mt-0.5">Rajesh Kumar</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-muted-foreground">Incoming Sup.</div>
                <div className="font-medium mt-0.5">Sunita Mehra</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-muted-foreground">Warehouse</div>
                <div className="font-medium mt-0.5">Mumbai Hub</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-muted-foreground">Handover ID</div>
                <div className="font-mono mt-0.5">SHO-2411</div>
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase text-muted-foreground">Handover Notes</label>
              <Textarea
                value={handoverNotes}
                onChange={(e) => setHandoverNotes(e.target.value)}
                placeholder="Optional: additional context for incoming shift..."
                className="mt-1 text-xs min-h-[80px] focus-ring-primary"
              />
            </div>

            {/* Status indicators */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <ClipboardCheck className="h-3 w-3" /> All tasks completed
                </span>
                {allTasksDone ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Clock className="h-3.5 w-3.5 text-amber-500" />
                )}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <FileSignature className="h-3 w-3" /> Outgoing signature
                </span>
                {outgoingConfirmed ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Clock className="h-3.5 w-3.5 text-amber-500" />
                )}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <FileSignature className="h-3 w-3" /> Incoming signature
                </span>
                {incomingConfirmed ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Clock className="h-3.5 w-3.5 text-amber-500" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Signature pads */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className={cn("signature-card-outgoing", outgoingConfirmed && "border-emerald-500/40 bg-emerald-500/[0.02]")}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileSignature className="h-4 w-4 text-primary" />
              Outgoing Supervisor Signature
            </CardTitle>
            <CardDescription>Rajesh Kumar · Confirms shift work completed & data accurate</CardDescription>
          </CardHeader>
          <CardContent>
            <SignaturePad
              value={outgoingSignature}
              onChange={setOutgoingSignature}
              onConfirm={handleOutgoingConfirm}
              label="Sign below to confirm outgoing shift"
              disabled={outgoingConfirmed}
            />
            {outgoingConfirmed && (
              <div className="mt-3 p-2 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <Lock className="h-3 w-3 text-emerald-600" />
                <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                  Signature locked · Hash recorded
                </span>
                <span className="text-muted-foreground font-mono ml-auto">
                  0x{Math.random().toString(16).slice(2, 6)}...{Math.random().toString(16).slice(2, 6)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={cn("signature-card-incoming", incomingConfirmed && "border-emerald-500/40 bg-emerald-500/[0.02]")}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileSignature className="h-4 w-4 text-primary" />
              Incoming Supervisor Signature
            </CardTitle>
            <CardDescription>Sunita Mehra · Acknowledges receipt of shift & all assets</CardDescription>
          </CardHeader>
          <CardContent>
            <SignaturePad
              value={incomingSignature}
              onChange={setIncomingSignature}
              onConfirm={handleIncomingConfirm}
              label="Sign below to acknowledge handover receipt"
              disabled={incomingConfirmed}
            />
            {incomingConfirmed && (
              <div className="mt-3 p-2 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <Lock className="h-3 w-3 text-emerald-600" />
                <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                  Acknowledgment locked · Ledger updated
                </span>
                <span className="text-muted-foreground font-mono ml-auto">
                  0x{Math.random().toString(16).slice(2, 6)}...{Math.random().toString(16).slice(2, 6)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Finalize button */}
      <Card className={cn(
        "handover-finalize-card transition-all",
        canComplete && "border-primary/40 bg-primary/[0.02] handover-finalize-ready"
      )}>
        <CardContent className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "h-10 w-10 rounded-lg flex items-center justify-center",
              canComplete ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              {canComplete ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
            </div>
            <div>
              <div className="text-sm font-semibold">
                {canComplete ? "Ready to finalize handover" : "Complete prerequisites first"}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {!allTasksDone && `(${totalCount - completedCount}) tasks remaining · `}
                {!outgoingConfirmed && "Outgoing signature pending · "}
                {!incomingConfirmed && "Incoming signature pending"}
                {canComplete && "Both signatures captured · All tasks complete"}
              </div>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleCompleteHandover}
            disabled={!canComplete}
            className="btn-press focus-ring-primary"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Finalize Handover
          </Button>
        </CardContent>
      </Card>

      {/* Past handovers history */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            Handover History (Last 24h)
          </CardTitle>
          <CardDescription>
            Immutable audit trail · Each entry hash-chained to previous record
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {pastHandovers.map((h, i) => (
              <div
                key={h.id}
                className="past-handover-row flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
              >
                <div className={cn(
                  "h-8 w-8 rounded-md flex items-center justify-center shrink-0",
                  h.status === "completed" && "bg-emerald-500/10 text-emerald-600",
                  h.status === "acknowledged" && "bg-blue-500/10 text-blue-600",
                  h.status === "pending" && "bg-amber-500/10 text-amber-600"
                )}>
                  {h.status === "completed" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : h.status === "acknowledged" ? (
                    <ArrowRightLeft className="h-4 w-4" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-medium">{h.id}</span>
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {h.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 truncate">
                    {h.shift} · {h.timestamp}
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-2 text-[10px] text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  <span className="font-mono">{h.signatureHash}</span>
                </div>
                {i === 0 && (
                  <Badge variant="outline" className="text-[10px] border-primary/40 text-primary">
                    <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                    Latest
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
