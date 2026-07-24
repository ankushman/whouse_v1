"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppLayout } from "@/components/layout/app-layout"
import { useAppStore } from "@/store/app-store"
import { DashboardView } from "@/components/dashboard/dashboard-view"
import { WarehousesView } from "@/components/modules/warehouses-view"
import { InboundView } from "@/components/modules/inbound-view"
import { OutboundView } from "@/components/modules/outbound-view"
import { InventoryView } from "@/components/modules/inventory-view"
import { TransportationView } from "@/components/modules/transportation-view"
import { EquipmentView } from "@/components/modules/equipment-view"
import { EmployeesView } from "@/components/modules/employees-view"
import { ProductivityView } from "@/components/modules/productivity-view"
import { CostAnalyticsView } from "@/components/modules/cost-analytics-view"
import { AlertsView } from "@/components/modules/alerts-view"
import { ReportsView } from "@/components/modules/reports-view"
import { SettingsView } from "@/components/modules/settings-view"
import { Skeleton } from "@/components/ui/skeleton"

const viewMap: Record<string, React.ComponentType> = {
  dashboard: DashboardView,
  warehouses: WarehousesView,
  inbound: InboundView,
  outbound: OutboundView,
  inventory: InventoryView,
  transportation: TransportationView,
  equipment: EquipmentView,
  employees: EmployeesView,
  productivity: ProductivityView,
  'cost-analytics': CostAnalyticsView,
  alerts: AlertsView,
  reports: ReportsView,
  settings: SettingsView,
}

function ViewRenderer() {
  const { activeView } = useAppStore()
  const View = viewMap[activeView]
  if (!View) return null
  return <View />
}

export default function Home() {
  return (
    <SidebarProvider defaultOpen>
      <AppLayout>
        <div className="p-4 md:p-6">
          <ViewRenderer />
        </div>
      </AppLayout>
    </SidebarProvider>
  )
}
