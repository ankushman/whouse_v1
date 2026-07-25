"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppLayout } from "@/components/layout/app-layout"
import { useAppStore, navItems } from "@/store/app-store"
import { useIsMobile } from "@/hooks/use-mobile"
import { useSwipe } from "@/hooks/use-swipe"
import { DashboardView } from "@/components/dashboard/dashboard-view"
import { WarehousesView } from "@/components/modules/warehouses-view"
import { InboundView } from "@/components/modules/inbound-view"
import { OutboundView } from "@/components/modules/outbound-view"
import { InventoryView } from "@/components/modules/inventory-view"
import { TransportationView } from "@/components/modules/transportation-view"
import { RouteOptimizationView } from "@/components/modules/route-optimization-view"
import { EquipmentView } from "@/components/modules/equipment-view"
import { EmployeesView } from "@/components/modules/employees-view"
import { ProductivityView } from "@/components/modules/productivity-view"
import { CostAnalyticsView } from "@/components/modules/cost-analytics-view"
import { AlertsView } from "@/components/modules/alerts-view"
import { ReportsView } from "@/components/modules/reports-view"
import { SettingsView } from "@/components/modules/settings-view"
import { DockSchedulerView } from "@/components/modules/dock-scheduler-view"
import { WarehouseMapView } from "@/components/modules/warehouse-map-view"
import { SLACountdownView } from "@/components/modules/sla-countdown-view"
import { DashboardSkeleton } from "@/components/shared/dashboard-skeleton"
import { cn } from "@/lib/utils"

const viewMap: Record<string, React.ComponentType> = {
  dashboard: DashboardView,
  warehouses: WarehousesView,
  inbound: InboundView,
  outbound: OutboundView,
  inventory: InventoryView,
  transportation: TransportationView,
  "route-optimization": RouteOptimizationView,
  equipment: EquipmentView,
  employees: EmployeesView,
  productivity: ProductivityView,
  'cost-analytics': CostAnalyticsView,
  alerts: AlertsView,
  reports: ReportsView,
  settings: SettingsView,
  "dock-scheduler": DockSchedulerView,
  "warehouse-map": WarehouseMapView,
  "sla-countdown": SLACountdownView,
}


function ViewRenderer() {
  const [mounted, setMounted] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [transitionDir, setTransitionDir] = useState<"left" | "right">("right")
  const { activeView, setActiveView, currentRole } = useAppStore()
  const isMobile = useIsMobile()

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 300)
    return () => clearTimeout(timer)
  }, [])

  // Build permitted nav items list for swipe navigation
  const permittedNavIds = useMemo(
    () => navItems.filter((n) => n.roles.includes(currentRole)).map((n) => n.id),
    [currentRole]
  )

  const navigateToIndex = useCallback(
    (targetIndex: number) => {
      if (targetIndex < 0 || targetIndex >= permittedNavIds.length) return
      const dir = targetIndex > permittedNavIds.indexOf(activeView) ? "right" : "left"
      setTransitionDir(dir)
      setTransitioning(true)
      setTimeout(() => {
        setActiveView(permittedNavIds[targetIndex])
        setTransitioning(false)
      }, 150)
    },
    [activeView, permittedNavIds, setActiveView]
  )

  const currentIndex = permittedNavIds.indexOf(activeView)

  const { swipeHandlers } = useSwipe({
    onSwipeLeft: () => {
      if (!isMobile) return
      if (currentIndex < permittedNavIds.length - 1) {
        navigateToIndex(currentIndex + 1)
      }
    },
    onSwipeRight: () => {
      if (!isMobile) return
      if (currentIndex > 0) {
        navigateToIndex(currentIndex - 1)
      }
    },
    threshold: 60,
  })

  if (!mounted) {
    return <DashboardSkeleton />
  }

  const View = viewMap[activeView]
  if (!View) return null

  const canSwipeLeft = isMobile && currentIndex < permittedNavIds.length - 1
  const canSwipeRight = isMobile && currentIndex > 0

  return (
    <div className="relative">
      {/* Swipe hint indicators (mobile only) */}
      {isMobile && (
        <>
          <div
            className={cn(
              "swipe-hint-left md:hidden",
              canSwipeRight && "visible"
            )}
          />
          <div
            className={cn(
              "swipe-hint-right md:hidden",
              canSwipeLeft && "visible"
            )}
          />
        </>
      )}

      {/* Main content area with swipe support on mobile */}
      <div
        {...swipeHandlers}
        className={cn(
          "touch-pan-y",
          isMobile && "page-content-transition",
          transitioning && (transitionDir === "left" ? "exiting" : "entering")
        )}
      >
        <View />
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <SidebarProvider defaultOpen>
      <AppLayout>
        <div className="flex min-h-0 flex-1 flex-col p-4 md:p-6">
          <ViewRenderer />
        </div>
      </AppLayout>
    </SidebarProvider>
  )
}
