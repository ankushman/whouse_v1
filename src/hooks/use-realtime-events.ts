"use client"

import { useEffect, useRef, useCallback, useState } from "react"

export interface WarehouseEvent {
  id: string
  type: "shipment" | "inventory" | "equipment" | "sla" | "dock" | "alert"
  severity: "info" | "warning" | "critical"
  warehouse: string
  title: string
  message: string
  timestamp: string
  data?: Record<string, unknown>
}

interface UseRealtimeEventsOptions {
  enabled?: boolean
  onEvent?: (event: WarehouseEvent) => void
  maxEvents?: number
}

export function useRealtimeEvents(options: UseRealtimeEventsOptions = {}) {
  const { enabled = true, onEvent, maxEvents = 50 } = options
  const [events, setEvents] = useState<WarehouseEvent[]>([])
  const [connected, setConnected] = useState(false)
  const socketRef = useRef<any>(null)
  const onEventRef = useRef(onEvent)
  // Capture maxEvents in a ref so the socket setup effect doesn't tear down
  // and reconnect every time maxEvents changes (which only controls local state slicing).
  const maxEventsRef = useRef(maxEvents)
  useEffect(() => {
    onEventRef.current = onEvent
  })
  useEffect(() => {
    maxEventsRef.current = maxEvents
  }, [maxEvents])

  useEffect(() => {
    if (!enabled) return

    let mounted = true

    const connect = async () => {
      try {
        const { io } = await import("socket.io-client")
        // Guard: component may have unmounted while awaiting dynamic import
        if (!mounted) return
        const socket = io("/?XTransformPort=3004", {
          transports: ["websocket", "polling"],
          reconnection: true,
          reconnectionAttempts: 10,
          reconnectionDelay: 2000,
        })

        socket.on("connect", () => {
          if (mounted) setConnected(true)
        })

        socket.on("disconnect", () => {
          if (mounted) setConnected(false)
        })

        socket.on("warehouse-event", (event: WarehouseEvent) => {
          if (!mounted) return
          // Read latest maxEvents from ref to avoid stale closure
          setEvents((prev) => [event, ...prev].slice(0, maxEventsRef.current))
          onEventRef.current?.(event)
        })

        socketRef.current = socket
      } catch {
        if (mounted) setConnected(false)
      }
    }

    connect()

    return () => {
      mounted = false
      socketRef.current?.disconnect()
    }
  }, [enabled])

  const clearEvents = useCallback(() => setEvents([]), [])

  return { events, connected, clearEvents }
}
