"use client"

import { useState, useEffect, useCallback } from "react"

export interface RealtimeKpiData {
  throughput: number       // orders/hour, fluctuates ±5
  pendingOrders: number   // slowly decreases or increases
  activeDocks: number     // 0-24 range
  occupancyRate: number   // percentage 65-95
  lastUpdated: number     // Date.now() timestamp
  isUpdating: boolean     // true during data transition
  flashKey: string        // unique key to trigger re-render animation
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)

const randomDelta = (range: number): number =>
  Math.round((Math.random() - 0.5) * 2 * range)

const DEFAULTS: Omit<RealtimeKpiData, "lastUpdated" | "isUpdating" | "flashKey"> = {
  throughput: 142,
  pendingOrders: 47,
  activeDocks: 18,
  occupancyRate: 82,
}

export function useRealtimeKpi() {
  const [kpi, setKpi] = useState<RealtimeKpiData>({
    ...DEFAULTS,
    lastUpdated: Date.now(),
    isUpdating: false,
    flashKey: Date.now().toString(),
  })

  const triggerUpdate = useCallback(() => {
    setKpi((prev) => ({
      ...prev,
      isUpdating: true,
    }))

    const flashKey = Date.now().toString()

    setTimeout(() => {
      setKpi((prev) => ({
        throughput: clamp(prev.throughput + randomDelta(5), 80, 200),
        pendingOrders: clamp(prev.pendingOrders + randomDelta(3), 10, 80),
        activeDocks: clamp(prev.activeDocks + randomDelta(1), 8, 24),
        occupancyRate: clamp(prev.occupancyRate + randomDelta(2), 60, 98),
        lastUpdated: Date.now(),
        isUpdating: false,
        flashKey,
      }))
    }, 300)
  }, [])

  useEffect(() => {
    const interval = setInterval(triggerUpdate, 5000)
    return () => clearInterval(interval)
  }, [triggerUpdate])

  return { kpi, triggerUpdate }
}
