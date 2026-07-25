"use client"

import { useEffect, useRef, useState, useCallback, useSyncExternalStore } from "react"
import { cn } from "@/lib/utils"

interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
  decimals?: number
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

// External store to drive the animation without setState in effect
function createAnimationStore(targetValue: number, duration: number) {
  let currentValue = 0
  let animationFrame: number | null = null
  let startTime: number | null = null
  const listeners = new Set<() => void>()

  function animate(currentTime: number) {
    if (startTime === null) {
      startTime = currentTime
    }
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easedProgress = easeOutCubic(progress)
    currentValue = targetValue * easedProgress
    listeners.forEach((l) => l())

    if (progress < 1) {
      animationFrame = requestAnimationFrame(animate)
    }
  }

  function start() {
    currentValue = 0
    startTime = null
    listeners.forEach((l) => l())
    animationFrame = requestAnimationFrame(animate)
  }

  function stop() {
    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame)
      animationFrame = null
    }
  }

  function getSnapshot() {
    return currentValue
  }

  function subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
      stop()
    }
  }

  return { start, stop, getSnapshot, subscribe }
}

export function AnimatedCounter({
  value,
  duration = 1000,
  className,
  prefix = "",
  suffix = "",
  decimals = 0,
}: AnimatedCounterProps) {
  const storeRef = useRef<ReturnType<typeof createAnimationStore> | null>(null)
  const getSnapshot = useCallback(() => storeRef.current?.getSnapshot() ?? 0, [])
  const subscribe = useCallback(
    (listener: () => void) => storeRef.current?.subscribe(listener) ?? (() => {}),
    []
  )
  const displayValue = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  useEffect(() => {
    const store = createAnimationStore(value, duration)
    storeRef.current = store
    store.start()
    return () => {
      store.stop()
      storeRef.current = null
    }
  }, [value, duration])

  const formatted = displayValue.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <span className={cn("tabular-nums", className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}
