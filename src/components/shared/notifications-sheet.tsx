"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { useToast } from "@/hooks/use-toast-helper"
import { useAppStore, type AppNotification } from "@/store/app-store"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Bell,
  CheckCheck,
  Filter,
  Trash2,
} from "lucide-react"

type Severity = "critical" | "warning" | "info" | "success"

const SEVERITY_CONFIG: Record<
  Severity,
  { icon: typeof Info; colorClass: string; bgClass: string; borderClass: string }
> = {
  critical: {
    icon: AlertTriangle,
    colorClass: "text-red-600 dark:text-red-400",
    bgClass: "bg-red-50 dark:bg-red-950/50",
    borderClass: "border-l-red-500 dark:border-l-red-400",
  },
  warning: {
    icon: AlertCircle,
    colorClass: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-50 dark:bg-amber-950/50",
    borderClass: "border-l-amber-500 dark:border-l-amber-400",
  },
  info: {
    icon: Info,
    colorClass: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-50 dark:bg-blue-950/50",
    borderClass: "border-l-blue-500 dark:border-l-blue-400",
  },
  success: {
    icon: CheckCircle2,
    colorClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-50 dark:bg-emerald-950/50",
    borderClass: "border-l-emerald-500 dark:border-l-emerald-400",
  },
}

// Seed data — populated once on first load
const SEED_NOTIFICATIONS: Omit<AppNotification, "id" | "timestamp">[] = [
  { title: "SLA Breach Detected", message: "Gurugram Hub dock-to-stock time exceeded 4 hours for shipment SH-2024-0912. Immediate escalation required.", severity: "critical", warehouse: "Delhi NCR", read: false },
  { title: "Equipment Battery Low", message: "Forklift FL-003 battery at 12%. Scheduled for charging but currently in active pick cycle.", severity: "warning", warehouse: "Mumbai", read: false },
  { title: "Inventory Variance Alert", message: "SKU ENG-4521 physical count shows -23 unit variance at Chennai warehouse zone B3.", severity: "warning", warehouse: "Chennai", read: false },
  { title: "Shipment Delivered On Time", message: "Shipment SH-2024-0891 delivered to Mumbai distribution center within SLA window.", severity: "success", warehouse: "Mumbai", read: false },
  { title: "Warehouse Capacity Update", message: "Pune warehouse has reached 85% capacity utilization. Review staging area allocation.", severity: "info", warehouse: "Pune", read: false },
  { title: "Temperature Excursion", message: "Cold storage zone CS-02 temperature spiked to 9.2°C for 18 minutes. Product integrity review needed.", severity: "critical", warehouse: "Chennai", read: true },
  { title: "Shift Handover Complete", message: "Morning-to-Afternoon shift handover completed at Chennai. 3 pending tasks transferred.", severity: "info", warehouse: "Chennai", read: true },
  { title: "Receiving Dock Congestion", message: "Delhi NCR inbound dock 3 experiencing 45-min average wait time. Consider rerouting.", severity: "warning", warehouse: "Delhi NCR", read: true },
  { title: "Cycle Count Completed", message: "Zone A1 cycle count at Hyderabad completed. Accuracy: 99.2%. All items reconciled.", severity: "success", warehouse: "Hyderabad", read: true },
  { title: "New PO Received", message: "Purchase order PO-2024-1247 received from supplier. 450 units of Transmission assembly parts.", severity: "info", warehouse: "Bangalore", read: true },
]

function formatTimestamp(ts: number): string {
  const diff = Date.now() - ts
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`
  return `${Math.floor(hours / 24)} day${Math.floor(hours / 24) > 1 ? "s" : ""} ago`
}

type FilterTab = "all" | "critical" | "warning" | "info"

interface NotificationsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NotificationsSheet({ open, onOpenChange }: NotificationsSheetProps) {
  const { toast } = useToast()
  const [filter, setFilter] = useState<FilterTab>("all")
  const notifications = useAppStore((s) => s.notifications)
  const unreadCount = useAppStore((s) => s.unreadCount)
  const markAllRead = useAppStore((s) => s.markAllRead)
  const markRead = useAppStore((s) => s.markRead)
  const clearNotifications = useAppStore((s) => s.clearNotifications)
  const addNotification = useAppStore((s) => s.addNotification)

  // Seed initial notifications on first mount
  const seededRef = useRef(false)
  useEffect(() => {
    if (!seededRef.current) {
      SEED_NOTIFICATIONS.forEach((n) => addNotification(n))
      seededRef.current = true
    }
  }, [addNotification])

  const filtered = useMemo(() => {
    if (filter === "all") return notifications
    if (filter === "critical") return notifications.filter((n) => n.severity === "critical")
    if (filter === "warning") return notifications.filter((n) => n.severity === "warning")
    return notifications.filter((n) => n.severity === "info" || n.severity === "success")
  }, [notifications, filter])

  // Severity summary counts
  const severityCounts = useMemo(() => ({
    critical: notifications.filter((n) => n.severity === "critical" && !n.read).length,
    warning: notifications.filter((n) => n.severity === "warning" && !n.read).length,
    info: notifications.filter((n) => (n.severity === "info" || n.severity === "success") && !n.read).length,
  }), [notifications])

  const handleMarkAllRead = () => {
    markAllRead()
    toast.success("All notifications marked as read")
  }

  const handleClearAll = () => {
    clearNotifications()
    toast.info("All notifications cleared")
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0">
        <SheetHeader className="px-5 pt-5 pb-0 gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="size-4 text-muted-foreground" />
              <SheetTitle className="text-base">Notifications</SheetTitle>
              {notifications.length > 0 && (
                <Badge variant="secondary" className="text-[10px] tabular-nums">
                  {notifications.length}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <Badge variant="outline" className="text-[10px] text-blue-600 border-blue-200 bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:bg-blue-950/50">
                  {unreadCount} unread
                </Badge>
              )}
            </div>
          </div>
          <SheetDescription className="text-xs">
            Real-time alerts and warehouse updates
          </SheetDescription>
        </SheetHeader>

        {/* Filter Tabs + Actions */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterTab)}>
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-[11px] px-2.5">All</TabsTrigger>
              <TabsTrigger value="critical" className="text-[11px] px-2.5 gap-1">
                <AlertTriangle className="size-3" />
                {severityCounts.critical > 0 && (
                  <span className="flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-red-100 px-1 text-[9px] font-bold text-red-700 dark:bg-red-900 dark:text-red-300">
                    {severityCounts.critical}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="warning" className="text-[11px] px-2.5 gap-1">
                <AlertCircle className="size-3" />
                {severityCounts.warning > 0 && (
                  <span className="flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-amber-100 px-1 text-[9px] font-bold text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                    {severityCounts.warning}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="info" className="text-[11px] px-2.5 gap-1">
                <Info className="size-3" />
                {severityCounts.info > 0 && (
                  <span className="flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-blue-100 px-1 text-[9px] font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    {severityCounts.info}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-[11px] text-muted-foreground gap-1"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
              title="Mark all as read"
            >
              <CheckCheck className="size-3" />
              <span className="hidden sm:inline">Read All</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-[11px] text-muted-foreground gap-1"
              onClick={handleClearAll}
              disabled={notifications.length === 0}
              title="Clear all notifications"
            >
              <Trash2 className="size-3" />
            </Button>
          </div>
        </div>

        {/* Notification List */}
        <ScrollArea className="scrollbar-glass flex-1 h-[calc(100vh-220px)]">
          <div className="px-4 pb-6">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="flex size-10 items-center justify-center rounded-full bg-muted/60">
                  <Filter className="size-4 text-muted-foreground" />
                </div>
                <p className="mt-3 text-xs font-medium text-muted-foreground">
                  {notifications.length === 0
                    ? "No notifications yet"
                    : "No notifications match this filter"}
                </p>
                <p className="mt-1 text-[10px] text-muted-foreground/60">
                  {notifications.length === 0
                    ? "Live events will appear here as they occur"
                    : "Try selecting a different filter tab"}
                </p>
              </div>
            ) : (
              filtered.map((notif, index) => {
                const config = SEVERITY_CONFIG[notif.severity]
                const Icon = config.icon
                return (
                  <div
                    key={notif.id}
                    className={cn(
                      "relative flex gap-3 rounded-lg p-3 mb-1 transition-colors hover:bg-muted/50",
                      "animate-in fade-in slide-in-from-right-2 duration-300",
                      !notif.read && "border-l-2 border-l-blue-500 dark:border-l-blue-400"
                    )}
                    style={{ animationDelay: `${Math.min(index * 30, 300)}ms`, animationFillMode: "both" }}
                    onClick={() => !notif.read && markRead(notif.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full mt-0.5 transition-colors",
                      config.bgClass
                    )}>
                      <Icon className={cn("size-3.5", config.colorClass)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn(
                          "text-xs leading-tight",
                          !notif.read ? "font-semibold text-foreground" : "font-medium text-foreground/80"
                        )}>
                          {notif.title}
                        </p>
                        {!notif.read && (
                          <span className="size-2 shrink-0 rounded-full bg-blue-500 mt-1 animate-pulse" />
                        )}
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                        {notif.message}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <p className="text-[10px] text-muted-foreground/60">
                          {formatTimestamp(notif.timestamp)}
                        </p>
                        {notif.warehouse && (
                          <>
                            <span className="text-muted-foreground/30">·</span>
                            <p className="text-[10px] text-muted-foreground/60 font-medium">
                              {notif.warehouse}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
