"use client"

import { useState, useEffect } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppLayout } from "@/components/layout/app-layout"
import { useAppStore } from "@/store/app-store"
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
import { DashboardSkeleton } from "@/components/shared/dashboard-skeleton"

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
}


function ViewRenderer() {
  const [mounted, setMounted] = useState(false)
  const { activeView } = useAppStore()

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 300)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) {
    return <DashboardSkeleton />
  }

  const View = viewMap[activeView]
  if (!View) return null
  return (
    <div className="transition-all duration-500 page-transition">
      <View />
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
