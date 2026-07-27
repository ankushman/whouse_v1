"use client"

import { useSimulatedEvents } from "@/hooks/use-simulated-events"

/**
 * SimulatedEventProvider — a headless component that generates
 * realistic warehouse events at random intervals (15-45s).
 * Pushes events into the Zustand notification store and shows toast popups.
 */
export function SimulatedEventProvider() {
  useSimulatedEvents({
    minInterval: 15000,
    maxInterval: 45000,
    showToast: true,
    addNotification: true,
    dashboardOnly: false, // Fire events on all pages
  })
  return null
}
