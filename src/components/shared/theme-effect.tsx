"use client"

import { useEffect } from 'react'
import { useThemeStore } from '@/store/theme-store'
import { useAccentColor } from '@/hooks/use-accent-color'

export function ThemeEffect() {
  const { density, animationsEnabled } = useThemeStore()
  const { className: accentClass } = useAccentColor()

  useEffect(() => {
    const root = document.documentElement

    // Apply accent color class
    root.classList.remove('accent-blue', 'accent-emerald', 'accent-violet', 'accent-amber', 'accent-rose')
    root.classList.add(accentClass)

    // Apply density
    root.setAttribute('data-density', density)

    // Apply animation toggle
    if (!animationsEnabled) {
      root.classList.add('no-animations')
    } else {
      root.classList.remove('no-animations')
    }
  }, [accentClass, density, animationsEnabled])

  return null
}
