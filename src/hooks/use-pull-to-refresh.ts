"use client"

import * as React from "react"

/**
 * usePullToRefresh — mobile pull-to-refresh gesture hook
 *
 * Attaches touch listeners to a scroll container. When the user pulls DOWN
 * past `threshold` px while at scrollTop === 0, fires `onRefresh` (which
 * should return a Promise that resolves when the refresh is complete).
 *
 * Visual state is exposed via the returned ref + state so callers can render
 * a spinner / progress indicator at the top of the scroll area.
 *
 * ── Behavior ───────────────────────────────────────────────────────────────
 * - Only activates when scrollTop <= 0 (prevents hijacking normal scroll).
 * - Resistant to horizontal swipes ( deltaX > deltaY cancels the gesture ).
 * - Rubber-band easing: visual indicator moves ~40% of the actual pull distance.
 * - Auto-completes if pull > threshold; auto-cancels if released before threshold.
 * - While refreshing, further pulls are ignored until the promise resolves.
 * - Resets smoothly to 0 when done.
 *
 * ── Usage ──────────────────────────────────────────────────────────────────
 *   const { scrollRef, pullDistance, isRefreshing, refreshProgress } = usePullToRefresh({
 *     onRefresh: async () => { await refetch() },
 *   })
 *
 *   <div ref={scrollRef} className="h-full overflow-y-auto">
 *     {pullDistance > 0 && <PullIndicator distance={pullDistance} refreshing={isRefreshing} />}
 *     ...content
 *   </div>
 */

export interface PullToRefreshOptions {
  /** Required: async callback fired when the user releases past threshold. */
  onRefresh: () => Promise<void> | void
  /** Pull distance in px required to trigger a refresh. Default 70. */
  threshold?: number
  /** Maximum visual pull distance in px (rubber-band clamp). Default 120. */
  maxPull?: number
  /** Resistance factor (0-1] applied to raw touch movement. Default 0.4. */
  resistance?: number
  /** Disabled state (e.g. when not on mobile). Default false. */
  disabled?: boolean
}

export interface PullToRefreshState {
  /** Ref to attach to the scrollable container. */
  scrollRef: React.RefObject<HTMLDivElement | null>
  /** Current pull distance in px (already resistance-adjusted). */
  pullDistance: number
  /** True while the onRefresh promise is in-flight. */
  isRefreshing: boolean
  /** 0-100 — progress toward the refresh threshold. */
  refreshProgress: number
}

export function usePullToRefresh({
  onRefresh,
  threshold = 70,
  maxPull = 120,
  resistance = 0.4,
  disabled = false,
}: PullToRefreshOptions): PullToRefreshState {
  const scrollRef = React.useRef<HTMLDivElement | null>(null)
  const [pullDistance, setPullDistance] = React.useState(0)
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  // Track gesture state in refs so we don't re-create listeners on every state change.
  const startYRef = React.useRef<number | null>(null)
  const startXRef = React.useRef<number | null>(null)
  const pullingRef = React.useRef(false)
  // Mirror isRefreshing into a ref so the touchmove/touchend handlers (which are
  // attached once) can read the latest value without re-binding.
  const isRefreshingRef = React.useRef(false)
  React.useEffect(() => {
    isRefreshingRef.current = isRefreshing
  }, [isRefreshing])

  // Use a ref to keep the latest onRefresh without re-attaching listeners.
  const onRefreshRef = React.useRef(onRefresh)
  React.useEffect(() => {
    onRefreshRef.current = onRefresh
  }, [onRefresh])

  const disabledRef = React.useRef(disabled)
  React.useEffect(() => {
    disabledRef.current = disabled
  }, [disabled])

  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const onTouchStart = (e: TouchEvent) => {
      if (disabledRef.current || isRefreshingRef.current) return
      // Only initiate if we're at the top of the scroll area
      if (el.scrollTop > 0) return
      const t = e.touches[0]
      startYRef.current = t.clientY
      startXRef.current = t.clientX
      pullingRef.current = false
    }

    const onTouchMove = (e: TouchEvent) => {
      if (disabledRef.current || isRefreshingRef.current) return
      if (startYRef.current === null || startXRef.current === null) return

      const t = e.touches[0]
      const deltaY = t.clientY - startYRef.current
      const deltaX = t.clientX - startXRef.current

      // If horizontal motion dominates, abort (treat as horizontal swipe).
      if (Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
        startYRef.current = null
        startXRef.current = null
        setPullDistance(0)
        return
      }

      // Only pulling DOWN past the top counts.
      if (deltaY <= 0) {
        pullingRef.current = false
        setPullDistance(0)
        return
      }

      // If user scrolled away from top mid-gesture, cancel.
      if (el.scrollTop > 0) {
        pullingRef.current = false
        setPullDistance(0)
        return
      }

      pullingRef.current = true

      // Apply resistance + clamp at maxPull
      const adjusted = deltaY * resistance
      const clamped = Math.min(maxPull, adjusted)
      setPullDistance(clamped)

      // Prevent native pull-to-refresh (Chrome on Android).
      if (e.cancelable) e.preventDefault()
    }

    const onTouchEnd = async () => {
      if (!pullingRef.current) {
        startYRef.current = null
        startXRef.current = null
        setPullDistance(0)
        return
      }
      pullingRef.current = false
      startYRef.current = null
      startXRef.current = null

      if (pullDistance >= threshold && !isRefreshingRef.current) {
        // Snap to threshold + trigger refresh
        setPullDistance(threshold)
        isRefreshingRef.current = true
        setIsRefreshing(true)
        try {
          await onRefreshRef.current()
        } catch (err) {
          console.error("[usePullToRefresh] onRefresh threw:", err)
        } finally {
          isRefreshingRef.current = false
          setIsRefreshing(false)
          setPullDistance(0)
        }
      } else {
        // Animate back to 0
        setPullDistance(0)
      }
    }

    const onTouchCancel = () => {
      pullingRef.current = false
      startYRef.current = null
      startXRef.current = null
      setPullDistance(0)
    }

    el.addEventListener("touchstart", onTouchStart, { passive: true })
    el.addEventListener("touchmove", onTouchMove, { passive: false })
    el.addEventListener("touchend", onTouchEnd, { passive: true })
    el.addEventListener("touchcancel", onTouchCancel, { passive: true })

    return () => {
      el.removeEventListener("touchstart", onTouchStart)
      el.removeEventListener("touchmove", onTouchMove)
      el.removeEventListener("touchend", onTouchEnd)
      el.removeEventListener("touchcancel", onTouchCancel)
    }
  }, [threshold, maxPull, resistance])

  const refreshProgress = Math.min(100, Math.round((pullDistance / threshold) * 100))

  return {
    scrollRef,
    pullDistance,
    isRefreshing,
    refreshProgress,
  }
}
