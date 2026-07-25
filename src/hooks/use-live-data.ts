"use client"

import { useEffect, useRef, useState, useCallback } from "react"
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

  const stableOnEvent = useCallback((e) => onEvent(e), [onEvent])

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
      stableOnEvent(event)
    })

    socket.on("disconnect", () => {
      setIsConnected(false)
    })

    return () => {
      socket.disconnect()
    }
  }, [stableOnEvent])

  return { isConnected }
}

export type { LiveEvent }
