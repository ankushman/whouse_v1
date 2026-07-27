"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Activity,
  ArrowDownToLine,
  ArrowUpFromLine,
  Wrench,
  ShieldAlert,
  Clock,
  Filter,
  ChevronDown,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type TimelineEvent = {
  id: string
  time: string
  duration: string
  type: "inbound" | "outbound" | "equipment" | "sla" | "capacity" | "shift"
  title: string
  description: string
  warehouse: string
  status: "completed" | "in-progress" | "scheduled" | "delayed"
}

const MOCK_EVENTS: TimelineEvent[] = [
  { id: "e1", time: "09:15", duration: "2h 15m", type: "inbound", title: "Container Unloading - INV-2024-1215", description: "Import container from Shanghai port. 450 units of transmission assemblies.", warehouse: "Mumbai Hub", status: "in-progress" },
  { id: "e2", time: "09:30", duration: "1h 45m", type: "outbound", title: "Priority Dispatch - MS-Maruti-0891", description: "Maruti Suzuki engine parts for Gurugram plant. SLA: 4hr delivery.", warehouse: "Pune Warehouse", status: "in-progress" },
  { id: "e3", time: "10:00", duration: "45m", type: "sla", title: "Dock-to-Stock SLA Review", description: "Weekly SLA compliance review for all warehouses. 3 breaches flagged.", warehouse: "Delhi NCR", status: "completed" },
  { id: "e4", time: "10:15", duration: "30m", type: "equipment", title: "Forklift FL-003 Maintenance", description: "Battery replacement and hydraulic system check for Unit FL-003.", warehouse: "Chennai Hub", status: "completed" },
  { id: "e5", time: "10:30", duration: "2h", type: "inbound", title: "Domestic Receipt - PO-2024-0847", description: "Bharat Forge crankshaft components. 280 units in 14 pallets.", warehouse: "Bangalore South", status: "scheduled" },
  { id: "e6", time: "11:00", duration: "1h", type: "capacity", title: "Zone Reassignment - A3→B1", description: "Relocate Class-A inventory from Zone A3 to B1 due to capacity pressure.", warehouse: "Gurugram Hub", status: "scheduled" },
  { id: "e7", time: "11:15", duration: "3h", type: "outbound", title: "Batch Dispatch - Customer Returns", description: "Process 12 customer return items from batch RB-4421 for restocking.", warehouse: "Kolkata", status: "scheduled" },
  { id: "e8", time: "08:30", duration: "1h 30m", type: "sla", title: "Temperature Check - Cold Storage CS-02", description: "Routine temperature compliance check. Recorded 2.8°C average.", warehouse: "Chennai Hub", status: "completed" },
  { id: "e9", time: "08:00", duration: "45m", type: "shift", title: "Morning Shift Handover", description: "Shift handover at Mumbai. 3 pending tasks transferred from night shift.", warehouse: "Mumbai Hub", status: "completed" },
  { id: "e10", time: "07:30", duration: "30m", type: "equipment", title: "Conveyor Belt CV-007 Alert", description: "Conveyor belt motor overheating detected. Maintenance team dispatched.", warehouse: "Hyderabad", status: "delayed" },
]

const typeConfig: Record<string, { icon: typeof Activity; color: string; bgClass: string; label: string }> = {
  inbound: { icon: ArrowDownToLine, color: "text-blue-600 dark:text-blue-400", bgClass: "bg-blue-100 dark:bg-blue-950/60", label: "Inbound" },
  outbound: { icon: ArrowUpFromLine, color: "text-emerald-600 dark:text-emerald-400", bgClass: "bg-emerald-100 dark:bg-emerald-950/60", label: "Outbound" },
  equipment: { icon: Wrench, color: "text-amber-600 dark:text-amber-400", bgClass: "bg-amber-100 dark:bg-amber-950/60", label: "Equipment" },
  sla: { icon: ShieldAlert, color: "text-red-600 dark:text-red-400", bgClass: "bg-red-100 dark:bg-red-950/60", label: "SLA" },
  capacity: { icon: Activity, color: "text-purple-600 dark:text-purple-400", bgClass: "bg-purple-100 dark:bg-purple-950/60", label: "Capacity" },
  shift: { icon: Clock, color: "text-indigo-600 dark:text-indigo-400", bgClass: "bg-indigo-100 dark:bg-indigo-950/60", label: "Shift" },
}

const statusStyles: Record<string, string> = {
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  "in-progress": "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  scheduled: "bg-slate-100 text-slate-600 dark:bg-slate-950 dark:text-slate-300",
  delayed: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
}

export function ActivityTimeline({ maxItems = 8 }: { maxItems?: number }) {
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [showAll, setShowAll] = useState(false)

  const filtered = useMemo(() => {
    const items = typeFilter === "all"
      ? MOCK_EVENTS
      : MOCK_EVENTS.filter((e) => e.type === typeFilter)
    return showAll ? items : items.slice(0, maxItems)
  }, [typeFilter, showAll, maxItems])

  const toggleShowAll = useCallback(() => setShowAll((p) => !p), [])
  const visibleCount = showAll ? "all" : `${filtered.length} of ${MOCK_EVENTS.filter((e) => typeFilter === "all" || e.type === typeFilter).length}`

  return (
    <Card className="rounded-xl border-border/60 shadow-sm card-depth chart-card card-accent-blue">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Activity className="size-4 text-blue-500" />
              Operations Timeline
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Today&apos;s warehouse operations chronology
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[130px] h-7 text-xs">
                <Filter className="mr-1 size-3" />
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(typeConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="relative space-y-0">
          {/* Timeline line */}
          <div className="absolute left-[23px] top-3 bottom-3 w-px bg-gradient-to-b from-blue-300 via-border to-transparent dark:from-blue-700" />

          <div className="stagger-children space-y-1">
            {filtered.map((event) => {
              const config = typeConfig[event.type]
              const Icon = config.icon
              return (
                <div
                  key={event.id}
                  className={cn(
                    "group relative flex gap-3 rounded-lg p-3 transition-all duration-200 hover:bg-muted/30",
                    event.status === "in-progress" && "bg-blue-50/50 dark:bg-blue-950/20",
                    event.status === "delayed" && "bg-red-50/40 dark:bg-red-950/15",
                  )}
                >
                  {/* Timeline node */}
                  <div className="relative z-10 flex shrink-0">
                    <div className={cn(
                      "flex size-[46px] items-center justify-center rounded-full border-2 border-background shadow-sm",
                      config.bgClass
                    )}>
                      <Icon className={cn("size-4", config.color)} />
                    </div>
                    {event.status === "in-progress" && (
                      <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 size-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50 animate-pulse-subtle" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground leading-tight truncate">
                          {event.title}
                        </p>
                        <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                          {event.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end shrink-0 gap-1">
                        <span className="text-[11px] font-semibold tabular-nums text-foreground">{event.time}</span>
                        <span className="text-[10px] text-muted-foreground">{event.duration}</span>
                      </div>
                    </div>

                    {/* Footer: warehouse + type + status */}
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="outline" className={cn("text-[9px] px-1.5 py-0 h-4 font-normal", config.bgClass, config.color)}>
                        {config.label}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground truncate">
                        {event.warehouse}
                      </span>
                      <Badge variant="outline" className={cn("text-[9px] px-1.5 py-0 h-4 font-normal ml-auto", statusStyles[event.status])}>
                        {event.status === "in-progress" ? "In Progress" : event.status === "completed" ? "Done" : event.status === "scheduled" ? "Scheduled" : "Delayed"}
                      </Badge>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Show more toggle */}
        {MOCK_EVENTS.length > maxItems && (
          <div className="mt-3 flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs gap-1 text-muted-foreground"
              onClick={toggleShowAll}
            >
              {showAll ? "Show Less" : `Show All (${MOCK_EVENTS.length})`}
              <ChevronDown className={cn("size-3 transition-transform", showAll && "rotate-180")} />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
