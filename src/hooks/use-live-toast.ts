"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { io, Socket } from "socket.io-client"
import { useToast } from "@/hooks/use-toast-helper"

interface LiveEvent {
  type: string
  title: string
  message: string
  warehouse: string
  severity: "info" | "warning" | "critical" | "success"
  timestamp: string
}

// Track processed events to avoid duplicate toasts
const processedEvents = new Set<string>()
const MAX_PROCESSED = 100

function cleanupProcessed() {
  if (processedEvents.size > MAX_PROCESSED) {
    const entries = Array.from(processedEvents)
    entries.slice(0, processedEvents.size - MAX_PROCESSED).forEach((id) => processedEvents.delete(id))
  }
}

export function useLiveDataWithToast(onEvent?: (event: LiveEvent) => void) {
  const toast = useToast()
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const onEventRef = useRef(onEvent)
  useEffect(() => {
    onEventRef.current = onEvent
  })

  const showToastForEvent = useCallback((event: LiveEvent) => {
    // Deduplicate: don't toast for events with the same message within 30 seconds
    const dedupeKey = `${event.type}-${event.message}-${Math.floor(Date.now() / 30000)}`
    if (processedEvents.has(dedupeKey)) return
    processedEvents.add(dedupeKey)
    cleanupProcessed()

    const icon = event.severity === "critical" ? "🔴" :
                event.severity === "warning" ? "🟡" :
                event.severity === "success" ? "🟢" : "🔵"

    const title = event.title || event.type

    // Use the raw sonner toast via the helper for the custom-icon variant
    toast.raw(`${icon} ${title}`, {
      description: `${event.message} — ${event.warehouse}`,
      duration: event.severity === "critical" ? 6000 : 4000,
      id: event.timestamp || `live-${Date.now()}`,
    })
  }, [toast])

  useEffect(() => {
    const socket = io("/?XTransformPort=3005", {
      transports: ["websocket", "polling"],
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      timeout: 10000,
    })
    socketRef.current = socket

    socket.on("connect", () => {
      setIsConnected(true)
    })

    socket.on("live-event", (event: LiveEvent) => {
      showToastForEvent(event)
      onEventRef.current?.(event)
    })

    socket.on("disconnect", () => {
      setIsConnected(false)
    })

    return () => {
      socket.disconnect()
    }
  }, [showToastForEvent])

  return { isConnected }
}

export type { LiveEvent }
