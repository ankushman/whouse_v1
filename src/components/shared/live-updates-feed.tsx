"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { useLiveData } from "@/hooks/use-live-data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Wrench,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Timer,
  Package,
  Truck,
  Clock,
  Zap,
} from "lucide-react"

interface LiveEvent {
  id: string
  type: "inbound" | "outbound" | "equipment" | "sla" | "capacity" | "dispatch"
  description: string
  warehouse: string
  severity: "success" | "warning" | "critical" | "info"
  timestamp: number
}

const eventTemplates: Omit<LiveEvent, "id" | "timestamp">[] = [
  { type: "inbound", description: "Shipment INV-2024-{id} received and unloading started", warehouse: "Mumbai Hub", severity: "success" },
  { type: "outbound", description: "Dispatch SH-{id} departed for Delhi NCR region", warehouse: "Pune Warehouse", severity: "info" },
  { type: "equipment", description: "Forklift FL-{id} battery charging completed", warehouse: "Chennai Hub", severity: "success" },
  { type: "sla", description: "Dock-to-stock time exceeded 4hrs threshold", warehouse: "Gurugram Hub", severity: "critical" },
  { type: "capacity", description: "Warehouse utilization approaching 90% capacity", warehouse: "Pune Warehouse", severity: "warning" },
  { type: "dispatch", description: "Last-mile delivery completed for order OD-{id}", warehouse: "Delhi NCR", severity: "success" },
  { type: "inbound", description: "Import shipment IMO-{id} cleared customs at port", warehouse: "Mumbai Hub", severity: "success" },
  { type: "equipment", description: "Conveyor belt CV-{id} maintenance alert triggered", warehouse: "Bangalore South", severity: "warning" },
  { type: "sla", description: "OTIF target achieved: 98.5% on-time delivery this week", warehouse: "Delhi NCR", severity: "success" },
  { type: "capacity", description: "New storage bay allocated for Class-A inventory", warehouse: "Chennai Hub", severity: "info" },
  { type: "outbound", description: "Priority dispatch for Maruti Suzuki order MS-{id}", warehouse: "Gurugram Hub", severity: "info" },
  { type: "dispatch", description: "Vehicle VH-{id} delayed by 45 mins - rerouting", warehouse: "Pune Warehouse", severity: "warning" },
]

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  inbound: ArrowDownToLine,
  outbound: ArrowUpFromLine,
  equipment: Wrench,
  sla: ShieldAlert,
  capacity: Package,
  dispatch: Truck,
}

const severityStyles = {
  success: {
    icon: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50",
    dot: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  warning: {
    icon: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50",
    dot: "bg-amber-500",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  critical: {
    icon: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50",
    dot: "bg-red-500",
    badge: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  },
  info: {
    icon: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50",
    dot: "bg-blue-500",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
}

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  return `${Math.floor(minutes / 60)}h ago`
}

export function LiveUpdatesFeed({ maxItems = 6 }: { maxItems?: number }) {
  const [isPaused, setIsPaused] = useState(false)

  const initialEvents = useMemo((): LiveEvent[] => {
    return Array.from({ length: maxItems }, (_, i) => ({
      ...eventTemplates[i % eventTemplates.length],
      id: `init-${i}`,
      timestamp: Date.now() - (maxItems - i) * 30000,
    }))
  }, [maxItems])

  const [events, setEvents] = useState<LiveEvent[]>(initialEvents)

  const generateEvent = useCallback((): LiveEvent => {
    const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)]
    return {
      ...template,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: Date.now(),
    }
  }, [])

  // WebSocket event handler
  const handleWsEvent = useCallback((wsEvent: { type: string; title: string; message: string; warehouse: string; severity: string; timestamp: string }) => {
    const newEvent: LiveEvent = {
      id: `ws-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: (wsEvent.type === "sla" ? "sla" : wsEvent.type === "dock" ? "capacity" : wsEvent.type === "vehicle" ? "dispatch" : wsEvent.type === "temperature" ? "equipment" : wsEvent.type === "shift" ? "capacity" : "inbound") as LiveEvent["type"],
      description: wsEvent.message,
      warehouse: wsEvent.warehouse,
      severity: wsEvent.severity as LiveEvent["severity"],
      timestamp: Date.now(),
    }
    setEvents(prev => [newEvent, ...prev].slice(0, maxItems))
  }, [maxItems])

  // Connect to WebSocket live data service
  const { isConnected: wsConnected } = useLiveData(handleWsEvent)

  // Local fallback: generate events only if WebSocket is not connected
  useEffect(() => {
    if (isPaused || wsConnected) return

    const interval = setInterval(() => {
      setEvents(prev => {
        const newEvent = generateEvent()
        return [newEvent, ...prev].slice(0, maxItems)
      })
    }, 8000 + Math.random() * 7000) // Random interval between 8-15 seconds

    return () => clearInterval(interval)
  }, [isPaused, generateEvent, maxItems, wsConnected])

  // Update timestamps every 10s
  useEffect(() => {
    const interval = setInterval(() => {
      setEvents(prev => [...prev]) // Force re-render for time updates
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="rounded-xl border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold">Live Operations Feed</CardTitle>
            <CardDescription className="text-xs">Real-time events from all warehouses</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className={cn("h-2 w-2 rounded-full", isPaused ? "bg-muted-foreground" : "bg-emerald-500 live-indicator")} />
              <span className={cn(
                "text-[10px] font-medium",
                wsConnected ? "text-emerald-600 dark:text-emerald-400" : isPaused ? "text-muted-foreground" : "text-amber-600 dark:text-amber-400"
              )}>{wsConnected ? "● Live" : isPaused ? "Paused" : "Local"}</span>
            </div>
            <Badge variant="secondary" className="text-[10px] gap-1 cursor-pointer select-none" onClick={() => setIsPaused(!isPaused)}>
              <Zap className="h-2.5 w-2.5" />
              {isPaused ? "Resume" : "Pause"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="relative space-y-0">
          {/* Timeline line */}
          <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />
          {events.map((event, idx) => {
            const TypeIcon = typeIcons[event.type] || Package
            const styles = severityStyles[event.severity]
            return (
              <div
                key={event.id}
                className={cn(
                  "relative flex items-start gap-3 py-2.5 pl-1",
                  idx === 0 && !isPaused && "animate-fade-in"
                )}
              >
                {/* Timeline dot */}
                <div className="relative z-10 mt-0.5 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border-2 border-background">
                  <div className={cn("absolute inset-0 rounded-full", styles.dot, "opacity-30")} />
                  <TypeIcon className={cn("h-3.5 w-3.5 relative z-10", styles.icon.split(" ")[0])} />
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0 pb-0.5">
                  <p className="text-xs leading-relaxed text-foreground">{event.description}</p>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-0.5">
                      <Package className="h-2.5 w-2.5" />
                      {event.warehouse}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Clock className="h-2.5 w-2.5" />
                      {formatTimeAgo(event.timestamp)}
                    </span>
                  </div>
                </div>
                {/* Severity badge */}
                <Badge
                  variant="outline"
                  className={cn(
                    "shrink-0 text-[9px] px-1.5 py-0 h-5 border-current/20",
                    styles.badge
                  )}
                >
                  {event.id.startsWith("ws-") && (
                    <span className="mr-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 text-[7px] font-bold text-white">W</span>
                  )}
                  {event.severity === "critical" ? "Critical" : event.severity === "warning" ? "Warning" : event.severity === "success" ? "Resolved" : "Info"}
                </Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
