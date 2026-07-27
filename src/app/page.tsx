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
import { ProcurementPurchaseOrdersView } from "@/components/modules/procurement-purchase-orders-view"
import { BillOfMaterialsView } from "@/components/modules/bill-of-materials-view"
import { QualityInspectionPlanView } from "@/components/modules/quality-inspection-plan-view"
import { NonConformanceReportView } from "@/components/modules/non-conformance-report-view"
import { WorkOrderManagementView } from "@/components/modules/work-order-management-view"
import { ProductionScheduleView } from "@/components/modules/production-schedule-view"
import { ProductionCostVarianceView } from "@/components/modules/production-cost-variance-view"
import { InventoryValuationView } from "@/components/modules/inventory-valuation-view"
import { DemandForecastingView } from "@/components/modules/demand-forecasting-view"
import { SupplierCorrectiveActionRequestView } from "@/components/modules/supplier-corrective-action-request-view"
import { OutboundView } from "@/components/modules/outbound-view"
import { ReturnsReverseLogisticsView } from "@/components/modules/returns-reverse-logistics-view"
import { YardManagementView } from "@/components/modules/yard-management-view"
import { InventoryView } from "@/components/modules/inventory-view"
import { InventoryReplenishmentView } from "@/components/modules/inventory-replenishment-view"
import { TransportationView } from "@/components/modules/transportation-view"
import { RouteOptimizationView } from "@/components/modules/route-optimization-view"
import { EquipmentView } from "@/components/modules/equipment-view"
import { EmployeesView } from "@/components/modules/employees-view"
import { VendorManagementView } from "@/components/modules/vendor-management-view"
import { CustomerSLAPerformanceView } from "@/components/modules/customer-sla-performance-view"
import { SupplierQualityScorecardView } from "@/components/modules/supplier-quality-scorecard-view"
import { ProductivityView } from "@/components/modules/productivity-view"
import { CostAnalyticsView } from "@/components/modules/cost-analytics-view"
import { AlertsView } from "@/components/modules/alerts-view"
import { ReportsView } from "@/components/modules/reports-view"
import { SettingsView } from "@/components/modules/settings-view"
import { DockSchedulerView } from "@/components/modules/dock-scheduler-view"
import { WarehouseMapView } from "@/components/modules/warehouse-map-view"
import { SLACountdownView } from "@/components/modules/sla-countdown-view"
import { OperationsOverviewView } from "@/components/modules/operations-overview-view"
import { PredictiveAnalyticsView } from "@/components/modules/predictive-analytics-view"
import { ComplianceAuditView } from "@/components/modules/compliance-audit-view"
import { EnergySustainabilityView } from "@/components/modules/energy-sustainability-view"
import { ContinualImprovementView } from "@/components/modules/continual-improvement-view"
import { FixedAssetRegisterView } from "@/components/modules/fixed-asset-register-view"
import { SupplierAuditView } from "@/components/modules/supplier-audit-view"
import { ESGSustainabilityAuditView } from "@/components/modules/esg-sustainability-audit-view"
import { CapacityPlanningView } from "@/components/modules/capacity-planning-view"
import { WarehousePerformanceScorecardView } from "@/components/modules/warehouse-performance-scorecard-view"
import { ThreeWayMatchDashboardView } from "@/components/modules/three-way-match-dashboard-view"
import { VendorContractManagementView } from "@/components/modules/vendor-contract-management-view"
import { SafetyIncidentManagementView } from "@/components/modules/safety-incident-management-view"
import { FleetMaintenanceManagementView } from "@/components/modules/fleet-maintenance-management-view"
import { CargoDamageClaimsView } from "@/components/modules/cargo-damage-claims-view"
import CrossDockTransshipmentView from "@/components/modules/cross-dock-transshipment-view"
import ColdChainTemperatureView from "@/components/modules/cold-chain-temperature-view"
import ContainerFreightStationView from "@/components/modules/container-freight-station-view"
import HazmatDangerousGoodsView from "@/components/modules/hazmat-dangerous-goods-view"
import SerialNumberTrackingView from "@/components/modules/serial-number-tracking-view"
import EcommerceFulfillmentView from "@/components/modules/ecommerce-fulfillment-view"
import LaborManagementView from "@/components/modules/labor-management-view"
import PackagingStandardsView from "@/components/modules/packaging-standards-view"
import SlottingOptimizationView from "@/components/modules/slotting-optimization-view"
import WavePlanningView from "@/components/modules/wave-planning-view"
import StockTransferView from "@/components/modules/stock-transfer-view"
import BarcodeLabelView from "@/components/modules/barcode-label-view"
import CycleCountView from "@/components/modules/cycle-count-view"
import ReturnsProcessingView from "@/components/modules/returns-processing-view"
import { ShiftHandoverView } from "@/components/modules/shift-handover-view"
import { DashboardSkeleton } from "@/components/shared/dashboard-skeleton"
import { ViewErrorBoundary } from "@/components/shared/view-error-boundary"
import { cn } from "@/lib/utils"

const viewMap: Record<string, React.ComponentType> = {
  dashboard: DashboardView,
  "operations-overview": OperationsOverviewView,
  warehouses: WarehousesView,
  inbound: InboundView,
  "procurement-purchase-orders": ProcurementPurchaseOrdersView,
  "bill-of-materials": BillOfMaterialsView,
  "quality-inspection-plan": QualityInspectionPlanView,
  "non-conformance-report": NonConformanceReportView,
  "work-order-management": WorkOrderManagementView,
  "production-schedule": ProductionScheduleView,
  "production-cost-variance": ProductionCostVarianceView,
  "inventory-valuation": InventoryValuationView,
  "demand-forecasting": DemandForecastingView,
  "supplier-corrective-action-request": SupplierCorrectiveActionRequestView,
  outbound: OutboundView,
  "returns-reverse-logistics": ReturnsReverseLogisticsView,
  "yard-management": YardManagementView,
  inventory: InventoryView,
  "inventory-replenishment": InventoryReplenishmentView,
  transportation: TransportationView,
  "route-optimization": RouteOptimizationView,
  equipment: EquipmentView,
  employees: EmployeesView,
  "vendor-management": VendorManagementView,
  "customer-sla-performance": CustomerSLAPerformanceView,
  "supplier-quality-scorecard": SupplierQualityScorecardView,
  productivity: ProductivityView,
  'cost-analytics': CostAnalyticsView,
  alerts: AlertsView,
  reports: ReportsView,
  settings: SettingsView,
  "dock-scheduler": DockSchedulerView,
  "warehouse-map": WarehouseMapView,
  "sla-countdown": SLACountdownView,
  "predictive-analytics": PredictiveAnalyticsView,
  "compliance-audit": ComplianceAuditView,
  "energy-sustainability": EnergySustainabilityView,
  "continual-improvement": ContinualImprovementView,
  "fixed-asset-register": FixedAssetRegisterView,
  "supplier-audit": SupplierAuditView,
  "esg-sustainability-audit": ESGSustainabilityAuditView,
  "capacity-planning": CapacityPlanningView,
  "warehouse-performance-scorecard": WarehousePerformanceScorecardView,
  "three-way-match": ThreeWayMatchDashboardView,
  "vendor-contract-mgmt": VendorContractManagementView,
  "safety-incident-mgmt": SafetyIncidentManagementView,
  "fleet-maintenance": FleetMaintenanceManagementView,
  "cargo-damage-claims": CargoDamageClaimsView,
  "cross-dock-transshipment": CrossDockTransshipmentView,
  "cold-chain-temp": ColdChainTemperatureView,
  "container-freight-station": ContainerFreightStationView,
  "hazmat-dangerous-goods": HazmatDangerousGoodsView,
  "serial-number-tracking": SerialNumberTrackingView,
  "ecommerce-fulfillment": EcommerceFulfillmentView,
  "labor-management": LaborManagementView,
  "packaging-standards": PackagingStandardsView,
  "slotting-optimization": SlottingOptimizationView,
  "wave-planning": WavePlanningView,
  "stock-transfer": StockTransferView,
  "barcode-label": BarcodeLabelView,
  "cycle-count": CycleCountView,
  "returns-processing": ReturnsProcessingView,
  "shift-handover": ShiftHandoverView,
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
        <ViewErrorBoundary>
          <View />
        </ViewErrorBoundary>
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
