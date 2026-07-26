"use client"

import * as React from "react"
import { RefreshCw, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePullToRefresh } from "@/hooks/use-pull-to-refresh"
import { useIsMobile } from "@/hooks/use-mobile"

/**
 * PullToRefreshContainer — wraps children in a scrollable container with
 * pull-to-refresh gesture support. On desktop (no touch), renders children
 * untouched inside a normal scroll div.
 *
 * Visual indicator: a slim bar above the content that shows a spinning RefreshCw
 * while refreshing, an ArrowDown that rotates based on pull progress while pulling.
 */
export interface PullToRefreshContainerProps {
  onRefresh: () => Promise<void> | void
  children: React.ReactNode
  className?: string
  /** Hide on screens larger than this breakpoint (default: false on desktop too). */
  mobileOnly?: boolean
}

export function PullToRefreshContainer({
  onRefresh,
  children,
  className,
  mobileOnly = true,
}: PullToRefreshContainerProps) {
  const isMobile = useIsMobile()
  const disabled = mobileOnly && !isMobile

  const { scrollRef, pullDistance, isRefreshing, refreshProgress } = usePullToRefresh({
    onRefresh,
    disabled,
  })

  // When disabled, render children in a plain scroll container (no pull logic).
  if (disabled) {
    return (
      <div className={cn("h-full overflow-y-auto", className)}>
        {children}
      </div>
    )
  }

  const showIndicator = pullDistance > 0 || isRefreshing
  // Rotate the arrow 0 → 180deg based on progress.
  const arrowRotation = Math.min(180, refreshProgress * 1.8)

  return (
    <div
      ref={scrollRef}
      className={cn("relative h-full overflow-y-auto overs-contain", className)}
      style={{
        // Don't let pull translate the scroll container; we render the indicator
        // above the content using absolute positioning.
        overscrollBehaviorY: "contain",
      }}
    >
      {/* Pull-to-refresh indicator (fixed at top of scroll area) */}
      {showIndicator && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-center ptr-indicator-enter"
          style={{ height: `${isRefreshing ? 70 : pullDistance}px` }}
        >
          <div
            className={cn(
              "flex items-center gap-2 rounded-full border bg-background/95 backdrop-blur px-3 py-1.5 shadow-md transition-all ptr-spinner-glow",
              isRefreshing
                ? "border-primary/30 text-primary"
                : refreshProgress >= 100
                  ? "border-emerald-300 text-emerald-600 dark:text-emerald-400"
                  : "border-border/60 text-muted-foreground"
            )}
          >
            {isRefreshing ? (
              <>
                <RefreshCw className="size-3.5 animate-spin" />
                <span className="text-[11px] font-medium">Refreshing…</span>
              </>
            ) : (
              <>
                <ArrowDown
                  className={cn(
                    "size-3.5 transition-transform duration-150",
                    refreshProgress >= 100 && "rotate-180 text-emerald-500"
                  )}
                  style={{ transform: `rotate(${arrowRotation}deg)` }}
                />
                <span className="text-[11px] font-medium tabular-nums">
                  {refreshProgress >= 100 ? "Release to refresh" : `${refreshProgress}%`}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Spacer that grows with the pull, pushing content down */}
      {showIndicator && (
        <div
          style={{ height: `${isRefreshing ? 70 : pullDistance}px` }}
          className="transition-[height] duration-100 ease-out"
        />
      )}

      {children}
    </div>
  )
}
