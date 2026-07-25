"use client"

import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"

interface LiveEvent {
  type: string
  title: string
  message: string
  warehouse: string
  severity: "info" | "warning" | "critical" | "success"
  timestamp: string
}

export function useLiveData(onEvent: (event: LiveEvent) => void) {
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const onEventRef = useRef(onEvent)

  // Keep ref in sync without triggering effect re-runs
  useEffect(() => {
    onEventRef.current = onEvent
  })

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
      onEventRef.current(event)
    })

    socket.on("disconnect", () => {
      setIsConnected(false)
    })

    return () => {
      socket.disconnect()
    }
    // No onEvent dependency — uses ref pattern to avoid infinite reconnects
  }, [])

  return { isConnected }
}

export type { LiveEvent }
