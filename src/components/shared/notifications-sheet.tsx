"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast-helper"
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
} from "lucide-react"

type Severity = "critical" | "warning" | "info" | "success"

type NotificationItem = {
  id: string
  severity: Severity
  title: string
  description: string
  timestamp: string
  unread: boolean
}

const SEVERITY_CONFIG: Record<
  Severity,
  { icon: typeof Info; colorClass: string; bgClass: string }
> = {
  critical: {
    icon: AlertTriangle,
    colorClass: "text-red-600 dark:text-red-400",
    bgClass: "bg-red-50 dark:bg-red-950/50",
  },
  warning: {
    icon: AlertCircle,
    colorClass: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-50 dark:bg-amber-950/50",
  },
  info: {
    icon: Info,
    colorClass: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-50 dark:bg-blue-950/50",
  },
  success: {
    icon: CheckCircle2,
    colorClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-50 dark:bg-emerald-950/50",
  },
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: "n1", severity: "critical", title: "SLA Breach Detected", description: "Gurugram Hub dock-to-stock time exceeded 4 hours for shipment SH-2024-0912. Immediate escalation required.", timestamp: "5 min ago", unread: true },
  { id: "n2", severity: "warning", title: "Equipment Battery Low", description: "Forklift FL-003 battery at 12%. Scheduled for charging but currently in active pick cycle.", timestamp: "12 min ago", unread: true },
  { id: "n3", severity: "warning", title: "Inventory Variance Alert", description: "SKU ENG-4521 physical count shows -23 unit variance at Chennai warehouse zone B3.", timestamp: "28 min ago", unread: true },
  { id: "n4", severity: "success", title: "Shipment Delivered On Time", description: "Shipment SH-2024-0891 delivered to Mumbai distribution center within SLA window.", timestamp: "45 min ago", unread: true },
  { id: "n5", severity: "info", title: "Warehouse Capacity Update", description: "Pune warehouse has reached 85% capacity utilization. Review staging area allocation.", timestamp: "1 hour ago", unread: true },
  { id: "n6", severity: "critical", title: "Temperature Excursion", description: "Cold storage zone CS-02 temperature spiked to 9.2°C for 18 minutes. Product integrity review needed.", timestamp: "1.5 hours ago", unread: false },
  { id: "n7", severity: "info", title: "Shift Handover Complete", description: "Morning-to-Afternoon shift handover completed at Chennai. 3 pending tasks transferred.", timestamp: "2 hours ago", unread: false },
  { id: "n8", severity: "warning", title: "Receiving Dock Congestion", description: "Delhi NCR inbound dock 3 experiencing 45-min average wait time. Consider rerouting.", timestamp: "2.5 hours ago", unread: false },
  { id: "n9", severity: "success", title: "Cycle Count Completed", description: "Zone A1 cycle count at Hyderabad completed. Accuracy: 99.2%. All items reconciled.", timestamp: "3 hours ago", unread: false },
  { id: "n10", severity: "info", title: "New PO Received", description: "Purchase order PO-2024-1247 received from supplier. 450 units of Transmission assembly parts.", timestamp: "3.5 hours ago", unread: false },
  { id: "n11", severity: "warning", title: "Forklift Maintenance Due", description: "Forklift FL-007 has 50 operating hours remaining before scheduled maintenance.", timestamp: "4 hours ago", unread: false },
  { id: "n12", severity: "success", title: "Returns Processed", description: "12 return items from customer batch RB-4421 processed and restocked. Quality check passed.", timestamp: "5 hours ago", unread: false },
  { id: "n13", severity: "critical", title: "Security Alert", description: "Unauthorized access attempt detected at warehouse gate B, Kolkata facility. Security team notified.", timestamp: "5.5 hours ago", unread: false },
  { id: "n14", severity: "info", title: "System Update Scheduled", description: "WMS v2.4.1 patch deployment scheduled for tonight 2:00 AM IST. Estimated downtime: 15 min.", timestamp: "6 hours ago", unread: false },
  { id: "n15", severity: "success", title: "Carrier SLA Met", description: "All 8 outbound shipments from Bangalore dispatched within carrier pickup window today.", timestamp: "7 hours ago", unread: false },
]

type FilterTab = "all" | "critical" | "warning" | "info"

interface NotificationsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NotificationsSheet({ open, onOpenChange }: NotificationsSheetProps) {
  const { toast } = useToast()
  const [filter, setFilter] = useState<FilterTab>("all")
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS)

  const filtered = filter === "all"
    ? notifications
    : notifications.filter((n) => n.severity === filter)

  const unreadCount = notifications.filter((n) => n.unread).length

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
    toast.success("All notifications marked as read")
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0">
        <SheetHeader className="px-5 pt-5 pb-0 gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="size-4 text-muted-foreground" />
              <SheetTitle className="text-base">Notification History</SheetTitle>
            </div>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-[10px]">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          <SheetDescription className="text-xs">
            View and manage all system alerts and updates
          </SheetDescription>
        </SheetHeader>

        {/* Filter Tabs + Mark All Read */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterTab)}>
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-[11px] px-2.5">All</TabsTrigger>
              <TabsTrigger value="critical" className="text-[11px] px-2.5 gap-1">
                <AlertTriangle className="size-3" />
                Critical
              </TabsTrigger>
              <TabsTrigger value="warning" className="text-[11px] px-2.5 gap-1">
                <AlertCircle className="size-3" />
                Warning
              </TabsTrigger>
              <TabsTrigger value="info" className="text-[11px] px-2.5 gap-1">
                <Info className="size-3" />
                Info
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-[11px] text-muted-foreground gap-1"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="size-3" />
            Mark All Read
          </Button>
        </div>

        {/* Notification List */}
        <ScrollArea className="scrollbar-glass flex-1 h-[calc(100vh-220px)]">
          <div className="px-4 pb-6 stagger-children">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="flex size-10 items-center justify-center rounded-full bg-muted/60">
                  <Filter className="size-4 text-muted-foreground" />
                </div>
                <p className="mt-3 text-xs font-medium text-muted-foreground">
                  No notifications match this filter
                </p>
              </div>
            ) : (
              filtered.map((notif) => {
                const config = SEVERITY_CONFIG[notif.severity]
                const Icon = config.icon
                return (
                  <div
                    key={notif.id}
                    className={cn(
                      "relative flex gap-3 rounded-lg p-3 mb-1 transition-colors hover:bg-muted/50 data-row-enter",
                      notif.unread && "border-l-2 border-l-blue-500 dark:border-l-blue-400"
                    )}
                  >
                    <div className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full mt-0.5",
                      config.bgClass
                    )}>
                      <Icon className={cn("size-3.5", config.colorClass)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn(
                          "text-xs leading-tight",
                          notif.unread ? "font-semibold" : "font-medium text-foreground"
                        )}>
                          {notif.title}
                        </p>
                        {notif.unread && (
                          <span className="size-2 shrink-0 rounded-full bg-blue-500 mt-1" />
                        )}
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                        {notif.description}
                      </p>
                      <p className="mt-1.5 text-[10px] text-muted-foreground/60">
                        {notif.timestamp}
                      </p>
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
