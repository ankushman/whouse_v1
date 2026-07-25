"use client"

import * as React from "react"
import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudFog,
  CloudSun,
  MapPin,
  AlertTriangle,
  Wind,
  Droplets,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { type LucideIcon } from "lucide-react"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type WeatherCondition = "sunny" | "cloudy" | "rainy" | "stormy" | "haze"
type ImpactLevel = "Low" | "Moderate" | "High"

interface WarehouseWeather {
  city: string
  temp: number
  condition: WeatherCondition
  humidity: number
  wind: number
  impact: string
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const warehouseWeather: WarehouseWeather[] = [
  { city: "Mumbai", temp: 32, condition: "rainy", humidity: 85, wind: 18, impact: "Moderate - Dock operations may slow" },
  { city: "Delhi NCR", temp: 38, condition: "sunny", humidity: 35, wind: 12, impact: "Low - Normal operations" },
  { city: "Chennai", temp: 34, condition: "cloudy", humidity: 72, wind: 22, impact: "Low - Normal operations" },
  { city: "Pune", temp: 29, condition: "sunny", humidity: 55, wind: 10, impact: "Low - Ideal conditions" },
  { city: "Kolkata", temp: 35, condition: "stormy", humidity: 90, wind: 35, impact: "High - Dock closures possible" },
  { city: "Jaipur", temp: 40, condition: "sunny", humidity: 25, wind: 8, impact: "Moderate - Heat advisory" },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const weatherIcons: Record<WeatherCondition, LucideIcon> = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  stormy: CloudLightning,
  haze: CloudFog,
}

const weatherIconColors: Record<WeatherCondition, string> = {
  sunny: "text-amber-500",
  cloudy: "text-slate-400",
  rainy: "text-sky-500",
  stormy: "text-red-500",
  haze: "text-zinc-400",
}

const conditionLabels: Record<WeatherCondition, string> = {
  sunny: "Sunny",
  cloudy: "Cloudy",
  rainy: "Rainy",
  stormy: "Stormy",
  haze: "Haze",
}

/** Get temperature-based tint for the card background */
function getTempTint(temp: number): string {
  if (temp >= 40) return "bg-red-50/60 dark:bg-red-950/30"
  if (temp >= 35) return "bg-orange-50/60 dark:bg-orange-950/25"
  if (temp >= 30) return "bg-amber-50/50 dark:bg-amber-950/20"
  if (temp >= 25) return "bg-emerald-50/40 dark:bg-emerald-950/15"
  return "bg-sky-50/50 dark:bg-sky-950/20"
}

/** Temperature text color */
function getTempColor(temp: number): string {
  if (temp >= 40) return "text-red-600 dark:text-red-400"
  if (temp >= 35) return "text-orange-600 dark:text-orange-400"
  if (temp >= 30) return "text-amber-600 dark:text-amber-400"
  return "text-foreground"
}

/** Extract the impact level from the impact string */
function getImpactLevel(impact: string): ImpactLevel {
  if (impact.startsWith("High")) return "High"
  if (impact.startsWith("Moderate")) return "Moderate"
  return "Low"
}

const impactStyles: Record<ImpactLevel, string> = {
  Low: "text-emerald-600 dark:text-emerald-400",
  Moderate: "text-amber-600 dark:text-amber-400",
  High: "text-red-600 dark:text-red-400",
}

// ---------------------------------------------------------------------------
// Component: WeatherCard
// ---------------------------------------------------------------------------

function WeatherCard({ data }: { data: WarehouseWeather }) {
  const Icon = weatherIcons[data.condition]
  const impactLevel = getImpactLevel(data.impact)
  const isHighImpact = impactLevel === "High"
  const isSevere = data.condition === "stormy" || data.temp >= 40

  return (
    <Card
      className={cn(
        "card-lift relative overflow-hidden rounded-xl border border-border/60 transition-all",
        getTempTint(data.temp)
      )}
    >
      <CardContent className="p-3">
        {/* City name + alert badge */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold tracking-tight truncate">
            {data.city}
          </span>
          {isSevere && (
            <Badge
              variant="destructive"
              className="h-4 gap-0.5 px-1.5 text-[9px] font-medium"
            >
              <AlertTriangle className="h-2.5 w-2.5" />
              Alert
            </Badge>
          )}
        </div>

        {/* Temperature + Icon row */}
        <div className="flex items-center justify-between mb-1.5">
          <span className={cn("text-2xl font-bold leading-none", getTempColor(data.temp))}>
            {data.temp}°C
          </span>
          <div className="flex items-center gap-1.5">
            <Icon className={cn("h-5 w-5", weatherIconColors[data.condition])} />
            <span className="text-[11px] text-muted-foreground font-medium">
              {conditionLabels[data.condition]}
            </span>
          </div>
        </div>

        {/* Humidity + Wind */}
        <div className="flex items-center gap-3 mb-1.5">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Droplets className="h-3 w-3" />
            <span className="text-[10px]">{data.humidity}%</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Wind className="h-3 w-3" />
            <span className="text-[10px]">{data.wind} km/h</span>
          </div>
        </div>

        {/* Impact text */}
        <p className={cn("text-[10px] font-medium leading-tight truncate", impactStyles[impactLevel])}>
          {isHighImpact && (
            <AlertTriangle className="inline h-2.5 w-2.5 mr-0.5 -mt-px" />
          )}
          {data.impact}
        </p>
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Component: WeatherPanel
// ---------------------------------------------------------------------------

export function WeatherPanel() {
  return (
    <Card className="rounded-xl border border-border/60 shadow-sm">
      <CardHeader className="pb-2 flex-center">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <div>
            <CardTitle className="text-sm font-semibold">Weather Conditions</CardTitle>
            <CardDescription className="text-xs">Operations Impact</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 stagger-fade">
          {warehouseWeather.map((w) => (
            <WeatherCard key={w.city} data={w} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
