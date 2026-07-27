"use client"

import { useThemeStore, type AccentColor } from '@/store/theme-store'

const accentColorMap: Record<AccentColor, { className: string; oklch: string }> = {
  blue: { className: 'accent-blue', oklch: 'oklch(0.488 0.243 264)' },
  emerald: { className: 'accent-emerald', oklch: 'oklch(0.596 0.145 163.225)' },
  violet: { className: 'accent-violet', oklch: 'oklch(0.541 0.281 293.009)' },
  amber: { className: 'accent-amber', oklch: 'oklch(0.769 0.188 70.08)' },
  rose: { className: 'accent-rose', oklch: 'oklch(0.645 0.246 16.439)' },
}

export function useAccentColor() {
  const accentColor = useThemeStore((s) => s.accentColor)
  const config = accentColorMap[accentColor]
  return {
    accentColor,
    className: config?.className ?? 'accent-blue',
    oklch: config?.oklch ?? accentColorMap.blue.oklch,
  }
}
