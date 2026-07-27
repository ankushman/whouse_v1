"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useToast } from "@/hooks/use-toast-helper"
import { useLiveDataWithToast, type LiveEvent } from "@/hooks/use-live-toast"
import { useRealtimeEvents, type WarehouseEvent } from "@/hooks/use-realtime-events"
import { useAppStore } from "@/store/app-store"
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Info,
  Volume2,
  VolumeX,
} from "lucide-react"
import { Button } from "@/components/ui/button"

// Deduplication: track messages to avoid repeat toasts within 60s (for port 3004)
const recentMessages = new Map<string, number>()
const DEDUP_WINDOW_MS = 60_000
const MAX_DEDUP_ENTRIES = 200

function isDuplicate(message: string): boolean {
  const now = Date.now()
  if (recentMessages.size > MAX_DEDUP_ENTRIES) {
    for (const [key, ts] of recentMessages) {
      if (now - ts > DEDUP_WINDOW_MS) recentMessages.delete(key)
    }
  }
  if (recentMessages.has(message) && now - (recentMessages.get(message) ?? 0) < DEDUP_WINDOW_MS) {
    return true
  }
  recentMessages.set(message, now)
  return false
}

type SeverityKey = "critical" | "warning" | "success" | "info"

function getSeverityKey(severity: string): SeverityKey {
  switch (severity) {
    case "critical": return "critical"
    case "warning":  return "warning"
    case "success":  return "success"
    default:         return "info"
  }
}

/**
 * RealtimeToastListener — a "headless" component that connects to
 * WebSocket services (ports 3005 and 3004) and shows toast notifications
 * when events arrive. Only shows toasts when the user is on the dashboard.
 *
 * Port 3005: useLiveDataWithToast handles its own toasts with 30s dedup
 * Port 3004: handled here with 60s dedup, dashboard-only gate, and mute toggle
 *
 * Includes a mute toggle persisted in localStorage.
 */
export function RealtimeToastListener() {
  const toast = useToast()
  const activeView = useAppStore((s) => s.activeView)
  const isOnDashboard = activeView === "dashboard"

  const [muted, setMuted] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("realtime-toasts-muted")
      return saved === "true"
    }
    return false
  })

  const mutedRef = useRef(muted)
  useEffect(() => {
    mutedRef.current = muted
  }, [muted])

  const handleMuteToggle = useCallback(() => {
    setMuted((prev) => {
      const next = !prev
      if (typeof window !== "undefined") {
        localStorage.setItem("realtime-toasts-muted", String(next))
      }
      return next
    })
  }, [])

  // Handler for port 3004 (WarehouseEvent from useRealtimeEvents)
  const onWarehouseEvent = useCallback(
    (event: WarehouseEvent) => {
      if (mutedRef.current) return
      if (!isOnDashboard) return
      if (isDuplicate(`${event.type}-${event.message}`)) return

      const severityKey = getSeverityKey(event.severity)
      const title = event.title || event.type
      const description = `${event.message} — ${event.warehouse}`
      const opts = {
        duration: event.severity === "critical" ? 6000 : 4000,
        id: event.id || `wh-${Date.now()}`,
      }
      // Route to the appropriate toast method based on severity
      switch (severityKey) {
        case "critical":
          toast.error(title, description, opts)
          break
        case "warning":
          toast.warning(title, description, opts)
          break
        case "success":
          toast.success(title, description, opts)
          break
        default:
          toast.info(title, description, opts)
      }
    },
    [isOnDashboard, toast]
  )

  // Connect to port 3005 — useLiveDataWithToast handles its own toasts + dedup
  useLiveDataWithToast()
  // Connect to port 3004 — we handle toasts with dashboard gating, mute, and 60s dedup
  useRealtimeEvents({
    enabled: true,
    onEvent: onWarehouseEvent,
    maxEvents: 50,
  })

  if (!isOnDashboard) return null

  return (
    <Button
      variant="ghost"
      size="sm"
      className="fixed bottom-4 right-4 z-50 h-9 w-9 rounded-full border border-border/60 bg-card shadow-sm transition-all hover:shadow-md"
      onClick={handleMuteToggle}
      title={muted ? "Unmute realtime notifications" : "Mute realtime notifications"}
      aria-label={muted ? "Unmute realtime notifications" : "Mute realtime notifications"}
    >
      {muted ? (
        <VolumeX className="h-4 w-4 text-muted-foreground" />
      ) : (
        <Volume2 className="h-4 w-4 text-foreground" />
      )}
    </Button>
  )
}
