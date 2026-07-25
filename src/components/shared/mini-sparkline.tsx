"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"

interface MiniSparklineProps {
  /** Array of numeric data points */
  data: number[]
  /** Width of the SVG in CSS units */
  width?: number
  /** Height of the SVG in CSS units */
  height?: number
  /** CSS class for the stroke color (e.g. "text-emerald-500") */
  colorClass?: string
  /** Show a filled gradient area below the line */
  fill?: boolean
  /** Additional CSS classes */
  className?: string
  /** Trend direction for color auto-selection */
  trend?: "up" | "down" | "neutral"
}

/**
 * MiniSparkline — a tiny inline SVG line chart for embedding in KPI cards
 * and small data displays. No external charting library needed.
 */
export function MiniSparkline({
  data,
  width = 64,
  height = 24,
  colorClass,
  fill = true,
  className,
  trend,
}: MiniSparklineProps) {
  const { pathD, areaD, id } = useMemo(() => {
    if (!data || data.length < 2) return { pathD: "", areaD: "", id: "" }

    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    const padding = 2
    const chartW = width - padding * 2
    const chartH = height - padding * 2
    const stepX = chartW / (data.length - 1)

    const points = data.map((val, i) => ({
      x: padding + i * stepX,
      y: padding + chartH - ((val - min) / range) * chartH,
    }))

    const lineParts: string[] = []
    const areaParts: string[] = []

    points.forEach((pt, i) => {
      const cmd = i === 0 ? "M" : "L"
      lineParts.push(`${cmd}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`)
      areaParts.push(`${cmd}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`)
    })

    // Close area path to bottom
    areaParts.push(`L${points[points.length - 1].x.toFixed(1)},${(height - padding).toFixed(1)}`)
    areaParts.push(`L${points[0].x.toFixed(1)},${(height - padding).toFixed(1)}`)
    areaParts.push("Z")

    return {
      pathD: lineParts.join(" "),
      areaD: areaParts.join(" "),
      id: `spark-${Math.random().toString(36).slice(2, 8)}`,
    }
  }, [data, width, height])

  if (!pathD) return null

  const defaultColorClass = trend === "up"
    ? "text-emerald-500"
    : trend === "down"
      ? "text-red-500"
      : "text-blue-500"

  const strokeClass = colorClass || defaultColorClass

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={cn("shrink-0", className)}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity={0.2} />
          <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
        </linearGradient>
      </defs>
      {fill && (
        <path
          d={areaD}
          fill={`url(#grad-${id})`}
          className={strokeClass}
        />
      )}
      <path
        d={pathD}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={strokeClass}
      />
      {/* Current value dot */}
      {data.length > 0 && (() => {
        const lastIdx = data.length - 1
        const min = Math.min(...data)
        const max = Math.max(...data)
        const range = max - min || 1
        const padding = 2
        const chartH = height - padding * 2
        const chartW = width - padding * 2
        const stepX = chartW / (data.length - 1)
        const x = padding + lastIdx * stepX
        const y = padding + chartH - ((data[lastIdx] - min) / range) * chartH
        return (
          <circle
            cx={x.toFixed(1)}
            cy={y.toFixed(1)}
            r={2}
            fill="currentColor"
            className={strokeClass}
          />
        )
      })()}
    </svg>
  )
}

// Pre-generated sparkline data for each KPI
export function generateSparklineData(
  baseValue: number,
  points: number = 12,
  volatility: number = 0.1
): number[] {
  const result: number[] = []
  let current = baseValue
  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.48) * baseValue * volatility
    current = Math.max(0, current + change)
    result.push(Math.round(current * 10) / 10)
  }
  return result
}
