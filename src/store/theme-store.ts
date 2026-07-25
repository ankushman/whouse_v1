"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AccentColor = 'blue' | 'emerald' | 'violet' | 'amber' | 'rose'
export type LayoutDensity = 'compact' | 'comfortable' | 'spacious'

interface ThemeStore {
  accentColor: AccentColor
  density: LayoutDensity
  animationsEnabled: boolean

  setAccentColor: (color: AccentColor) => void
  setDensity: (density: LayoutDensity) => void
  setAnimationsEnabled: (enabled: boolean) => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      accentColor: 'blue',
      density: 'comfortable',
      animationsEnabled: true,

      setAccentColor: (color) => set({ accentColor: color }),
      setDensity: (density) => set({ density }),
      setAnimationsEnabled: (enabled) => set({ animationsEnabled: enabled }),
    }),
    {
      name: 'wms-theme-prefs',
    }
  )
)
