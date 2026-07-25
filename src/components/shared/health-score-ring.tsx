"use client"

import { cn } from "@/lib/utils"

interface HealthScoreRingProps {
  score: number // 0-100
  size?: number
  strokeWidth?: number
  status?: "green" | "amber" | "red"
  className?: string
  showLabel?: boolean
}

const statusColors = {
  green: { stroke: "#10B981", bg: "rgba(16,185,129,0.12)", text: "text-emerald-600 dark:text-emerald-400" },
  amber: { stroke: "#F59E0B", bg: "rgba(245,158,11,0.12)", text: "text-amber-600 dark:text-amber-400" },
  red: { stroke: "#EF4444", bg: "rgba(239,68,68,0.12)", text: "text-red-600 dark:text-red-400" },
}

export function HealthScoreRing({ score, size = 56, strokeWidth = 4, status = "green", className, showLabel = false }: HealthScoreRingProps) {
  const colors = statusColors[status]
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted/30"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 4px ${colors.bg})`,
            }}
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("text-sm font-bold leading-none", colors.text)} style={{ fontSize: size * 0.26 }}>
            {score}
          </span>
        </div>
      </div>
      {showLabel && (
        <div className="flex flex-col">
          <span className="text-[10px] font-medium text-muted-foreground">Health</span>
          <span className={cn("text-xs font-bold capitalize", colors.text)}>{status}</span>
        </div>
      )}
    </div>
  )
}