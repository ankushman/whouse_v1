"use client"

import { useEffect, useRef, useCallback } from "react"
import { useAppStore } from "@/store/app-store"
import { useToast } from "@/hooks/use-toast-helper"
import { warehouses } from "@/data/mock-data"

// ── Event Templates ────────────────────────────────────────────────

interface EventTemplate {
  title: string
  message: string
  severity: "critical" | "warning" | "success" | "info"
  warehouse: string
  weight: number // Higher = more likely to appear
}

const EVENT_TEMPLATES: EventTemplate[] = [
  // Critical (rare)
  { title: "Capacity Overflow Risk", message: "Zone B-12 has reached 98% capacity", severity: "critical", warehouse: "Mumbai", weight: 2 },
  { title: "SLA Breach Imminent", message: "Shipment SH-2847 will miss delivery window", severity: "critical", warehouse: "Delhi NCR", weight: 2 },
  { title: "Equipment Failure", message: "Forklift FL-003 motor overheating detected", severity: "critical", warehouse: "Chennai", weight: 1 },
  { title: "Temperature Alert", message: "Cold storage zone C-04 temperature rising", severity: "critical", warehouse: "Pune", weight: 1 },

  // Warning (moderate)
  { title: "Dock Congestion", message: "3 trucks waiting at loading bay — avg 25min delay", severity: "warning", warehouse: "Mumbai", weight: 5 },
  { title: "Low Stock Alert", message: "SKU ENG-CY-001 below minimum threshold", severity: "warning", warehouse: "Bangalore", weight: 4 },
  { title: "Pick Rate Drop", message: "Afternoon shift productivity dropped 15%", severity: "warning", warehouse: "Kolkata", weight: 3 },
  { title: "Route Delay", message: "Route RT-004 delayed by 35min due to traffic", severity: "warning", warehouse: "Hyderabad", weight: 4 },
  { title: "QC Rejection Spike", message: "6 items rejected in last batch inspection", severity: "warning", warehouse: "Delhi NCR", weight: 3 },
  { title: "Power Fluctuation", message: "Voltage dip detected in Zone A-08", severity: "warning", warehouse: "Chennai", weight: 2 },

  // Success (frequent)
  { title: "Shipment Delivered", message: "Consignment SH-1923 delivered on time", severity: "success", warehouse: "Mumbai", weight: 6 },
  { title: "GRN Completed", message: "Inbound batch IB-4521 processed successfully", severity: "success", warehouse: "Pune", weight: 5 },
  { title: "Cycle Count Done", message: "Zone D-06 cycle count completed — 99.2% accuracy", severity: "success", warehouse: "Bangalore", weight: 4 },
  { title: "Pick Wave Complete", message: "Wave W-0891 completed 48 picks in 22min", severity: "success", warehouse: "Hyderabad", weight: 5 },
  { title: "Dock Cleared", message: "Loading bay L-03 cleared — next truck assigned", severity: "success", warehouse: "Kolkata", weight: 4 },

  // Info (most frequent)
  { title: "New Inbound Arrival", message: "Truck TRK-207 arriving at gate in 15min", severity: "info", warehouse: "Mumbai", weight: 7 },
  { title: "Shift Handover", message: "Morning shift handing over to afternoon shift", severity: "info", warehouse: "Delhi NCR", weight: 3 },
  { title: "Inventory Updated", message: "Batch sync completed for Warehouse A zones", severity: "info", warehouse: "Chennai", weight: 4 },
  { title: "Maintenance Scheduled", message: "Conveyor belt C-02 maintenance at 2:00 PM", severity: "info", warehouse: "Pune", weight: 3 },
  { title: "Report Generated", message: "Daily warehouse report ready for download", severity: "info", warehouse: "Bangalore", weight: 3 },
  { title: "Vehicle Dispatched", message: "TRK-101 dispatched for Mumbai → Pune route", severity: "info", warehouse: "Mumbai", weight: 5 },
]

// Pick a random event based on weights
function pickRandomEvent(): EventTemplate {
  const totalWeight = EVENT_TEMPLATES.reduce((sum, e) => sum + e.weight, 0)
  let random = Math.random() * totalWeight
  for (const event of EVENT_TEMPLATES) {
    random -= event.weight
    if (random <= 0) return event
  }
  return EVENT_TEMPLATES[EVENT_TEMPLATES.length - 1]
}

// Severity → duration mapping (toast function is now resolved via useToast inside the hook)
const SEVERITY_DURATION: Record<string, number> = {
  critical: 7000,
  warning: 5000,
  success: 4000,
  info: 3500,
}

/**
 * useSimulatedEvents — generates realistic warehouse events at random intervals
 * and pushes them into the Zustand notification store + shows toast popups.
 *
 * Only active when the dashboard is the current view (controlled by caller).
 */
export function useSimulatedEvents(options?: {
  /** Minimum interval between events in ms (default: 15000) */
  minInterval?: number
  /** Maximum interval between events in ms (default: 45000) */
  maxInterval?: number
  /** Whether to also show toast popups (default: true) */
  showToast?: boolean
  /** Whether to add to notification store (default: true) */
  addNotification?: boolean
  /** Only fire when on dashboard view (default: false) */
  dashboardOnly?: boolean
}) {
  const {
    minInterval = 15000,
    maxInterval = 45000,
    showToast = true,
    addNotification = true,
    dashboardOnly = false,
  } = options ?? {}

  const addNotificationFn = useAppStore((s) => s.addNotification)
  const activeView = useAppStore((s) => s.activeView)
  const notifPrefs = useAppStore((s) => s.notifPrefs)
  const toast = useToast()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mutedRef = useRef(false)
  const activeViewRef = useRef(activeView)
  useEffect(() => { activeViewRef.current = activeView })
  const scheduleNextRef = useRef<() => void>(() => {})

  // Check mute state
  const checkMuted = useCallback(() => {
    if (typeof window !== "undefined") {
      mutedRef.current = localStorage.getItem("realtime-toasts-muted") === "true"
    }
  }, [])

  // Check if event should be filtered by severity preference
  const passesSeverityFilter = useCallback((severity: string) => {
    const min = notifPrefs.minSeverity
    if (min === "all") return true
    if (min === "warning") return severity === "warning" || severity === "critical"
    if (min === "critical") return severity === "critical"
    return true
  }, [notifPrefs.minSeverity])

  // Check if currently in quiet hours
  const isQuietHours = useCallback(() => {
    if (!notifPrefs.quietHoursEnabled) return false
    const now = new Date()
    const hours = now.getHours()
    const mins = now.getMinutes()
    const currentMinutes = hours * 60 + mins
    const [sh, sm] = notifPrefs.quietHoursStart.split(":").map(Number)
    const [eh, em] = notifPrefs.quietHoursEnd.split(":").map(Number)
    const startMinutes = sh * 60 + (sm ?? 0)
    const endMinutes = eh * 60 + (em ?? 0)
    // Handle overnight quiet hours (e.g. 22:00 to 07:00)
    if (startMinutes > endMinutes) {
      return currentMinutes >= startMinutes || currentMinutes < endMinutes
    }
    return currentMinutes >= startMinutes && currentMinutes < endMinutes
  }, [notifPrefs.quietHoursEnabled, notifPrefs.quietHoursStart, notifPrefs.quietHoursEnd])

  const scheduleNext = useCallback(() => {
    const delay = minInterval + Math.random() * (maxInterval - minInterval)
    timerRef.current = setTimeout(() => {
      checkMuted()
      const event = pickRandomEvent()

      // Randomize warehouse occasionally
      const warehouse = Math.random() > 0.7
        ? warehouses[Math.floor(Math.random() * warehouses.length)].city
        : event.warehouse

      // Should we fire? Use ref to avoid recreating scheduleNext on every navigation
      const shouldFire = !dashboardOnly || activeViewRef.current === "dashboard"

      // Severity filter: skip if event doesn't meet minimum severity
      const severityOk = passesSeverityFilter(event.severity)

      // Quiet hours: only show critical events during quiet hours
      const quietOk = !isQuietHours() || event.severity === "critical"

      // Notification store: always add (browserPush only controls actual browser Notification API)
      if (shouldFire && severityOk && quietOk && addNotification) {
        addNotificationFn({
          title: event.title,
          message: event.message,
          severity: event.severity,
          warehouse,
        })
      }

      if (shouldFire && severityOk && quietOk && showToast && !mutedRef.current) {
        const duration = SEVERITY_DURATION[event.severity] ?? 4000
        const description = `${event.message} — ${warehouse}`
        const opts = { duration, id: `sim-${Date.now()}` }
        switch (event.severity) {
          case "critical": toast.error(event.title, description, opts); break
          case "warning":  toast.warning(event.title, description, opts); break
          case "success":  toast.success(event.title, description, opts); break
          default:          toast.info(event.title, description, opts)
        }
      }

      // Use ref to call the latest scheduleNext without circular dependency
      scheduleNextRef.current()
    }, delay)
  }, [minInterval, maxInterval, showToast, addNotification, dashboardOnly, addNotificationFn, checkMuted, passesSeverityFilter, isQuietHours, toast])

  // Keep ref updated
  useEffect(() => {
    scheduleNextRef.current = scheduleNext
  }, [scheduleNext])

  useEffect(() => {
    // Initial delay of 3-8 seconds before first event
    const initialDelay = 3000 + Math.random() * 5000
    timerRef.current = setTimeout(() => {
      scheduleNext()
    }, initialDelay)

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [scheduleNext])
}
