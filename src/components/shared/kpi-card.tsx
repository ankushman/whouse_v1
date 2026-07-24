"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react"

interface KPICardProps {
  title: string
  value: string | number
  change?: number
  trend?: "up" | "down" | "neutral"
  icon: LucideIcon
  subtitle?: string
  index?: number
  colorClass?: string
}

export function KPICard({ title, value, change = 0, trend = "neutral", icon: Icon, subtitle, index = 0, colorClass = "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" }: KPICardProps) {
  return (
    <Card className="group relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm transition-all duration-200 hover:shadow-md hover:border-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
              {change !== 0 && (
                <div className={cn(
                  "flex items-center gap-0.5 text-xs font-medium",
                  trend === "up" && "text-emerald-600 dark:text-emerald-400",
                  trend === "down" && "text-red-600 dark:text-red-400"
                )}>
                  {trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>{trend === "up" ? "+" : ""}{change}%</span>
                </div>
              )}
              {change === 0 && (
                <div className="flex items-center gap-0.5 text-xs font-medium text-muted-foreground">
                  <Minus className="h-3 w-3" />
                </div>
              )}
            </div>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105", colorClass)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
