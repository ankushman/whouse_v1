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
import CycleCountView from "@/components/modules/cycle-count-view"
import ReturnsProcessingView from "@/components/modules/returns-processing-view"
import PutawayManagementView from "@/components/modules/putaway-management-view"
import LoadingDispatchView from "@/components/modules/loading-dispatch-view"
import GoodsReceiptView from "@/components/modules/goods-receipt-view"
import TallyIntegrationView from "@/components/modules/tally-integration-view"
import KittingAssemblyView from "@/components/modules/kitting-assembly-view"
import BatchLotView from "@/components/modules/batch-lot-view"
import ConsignmentStockView from "@/components/modules/consignment-stock-view"
import PoolDistributionView from "@/components/modules/pool-distribution-view"
import ThirdPartyLogisticsView from "@/components/modules/third-party-logistics-view"
import DocumentManagementView from "@/components/modules/document-management-view"
import MultiChannelFulfillmentView from "@/components/modules/multi-channel-fulfillment-view"
import QualityControlView from "@/components/modules/quality-control-view"
import VehicleFleetTransportView from "@/components/modules/vehicle-fleet-transport-view"
import CustomerServiceResolutionView from "@/components/modules/customer-service-resolution-view"
import WarehouseAnalyticsBIView from "@/components/modules/warehouse-analytics-bi-view"
import ReturnsRefundAnalyticsView from "@/components/modules/returns-refund-analytics-view"
import PickPackOptimizationView from "@/components/modules/pick-pack-optimization-view"
import FreightShippingRateView from "@/components/modules/freight-shipping-rate-view"
import DockSchedulingYardView from "@/components/modules/dock-scheduling-yard-view"
import DangerousGoodsHazMatView from "@/components/modules/dangerous-goods-hazmat-view"
import CustomsDutyGstView from "@/components/modules/customs-duty-gst-view"
import PalletContainerView from "@/components/modules/pallet-container-view"
import ReturnsQualityInspectionView from "@/components/modules/returns-quality-inspection-view"
import CODPaymentReconciliationView from "@/components/modules/cod-payment-reconciliation-view"
import WarrantyGuaranteeView from "@/components/modules/warranty-guarantee-view"
import InsuranceClaimsView from "@/components/modules/insurance-claims-view"
import LastMileDeliveryView from "@/components/modules/last-mile-delivery-view"
import MultiChannelIntegrationHubView from "@/components/modules/multi-channel-integration-hub-view"
import SupplierPortalView from "@/components/modules/supplier-portal-view"
import HyperlocalDeliveryView from "@/components/modules/hyperlocal-delivery-view"
import CarbonFootprintTrackerView from "@/components/modules/carbon-footprint-tracker-view"
import SmartLockerKioskView from "@/components/modules/smart-locker-kiosk-view"
import WarehouseDigitalTwinView from "@/components/modules/warehouse-digital-twin-view"
import AGVFleetManagementView from "@/components/modules/agv-fleet-management-view"
import ParcelSortingCrossDockView from "@/components/modules/parcel-sorting-crossdock-view"
import WarehouseSafetyComplianceView from "@/components/modules/warehouse-safety-compliance-view"
import GoodsToPersonPickingView from "@/components/modules/goods-to-person-picking-view"
import ValueAddedServicesView from "@/components/modules/value-added-services-view"
import GateSecurityView from "@/components/modules/gate-security-view"
import YardTruckingView from "@/components/modules/yard-trucking-dock-view"
import PackagingDesignStudioView from "@/components/modules/packaging-design-studio-view"
import WarehouseLaborForecastingView from "@/components/modules/warehouse-labor-forecasting-view"
import ReturnsConsolidationHubView from "@/components/modules/returns-consolidation-hub-view"
import ThreePLPerformanceScorecardView from "@/components/modules/3pl-performance-scorecard-view"
import QualityInspectionAutomationView from "@/components/modules/quality-inspection-automation-view"
import SupplierRiskManagementView from "@/components/modules/supplier-risk-management-view"
import PredictiveDemandForecastingView from "@/components/modules/predictive-demand-forecasting-view"
import LogisticsNetworkOptimizationView from "@/components/modules/logistics-network-optimization-view"
import ContractComplianceAutomationView from "@/components/modules/contract-compliance-automation-view"
import LastMileDeliveryAnalyticsView from "@/components/modules/last-mile-delivery-analytics-view"
import ReturnsProcessingEnhancementView from "@/components/modules/returns-processing-enhancement-view"
import ColdChainMonitoringView from "@/components/modules/cold-chain-monitoring-view"
import PackagingOptimizationView from "@/components/modules/packaging-optimization-view"
import LoadPlanningOptimizationView from "@/components/modules/load-planning-optimization-view"
import FreightLaneManagementView from "@/components/modules/freight-lane-management-view"
import CustomsDutyOptimizationView from "@/components/modules/customs-duty-optimization-view"
import IntermodalTransportHubView from "@/components/modules/intermodal-transport-hub-view"
import WarehouseEnergyManagementView from "@/components/modules/warehouse-energy-management-view"
import CargoInsuranceClaimsView from "@/components/modules/cargo-insurance-claims-view"
import PortCommunitySystemView from "@/components/modules/port-community-system-view"
import DedicatedFreightCorridorView from "@/components/modules/dedicated-freight-corridor-view"
import MaritimeCargoSecurityView from "@/components/modules/maritime-cargo-security-view"
import ColdChainComplianceView from "@/components/modules/cold-chain-compliance-view"
import CustomsDutyRefundView from "@/components/modules/customs-duty-refund-view"
import ExportDocumentationLCView from "@/components/modules/export-documentation-lc-view"
import FreightAuditPaymentView from "@/components/modules/freight-audit-payment-view"
import EWayBillGSTComplianceView from "@/components/modules/eway-bill-gst-compliance-view"
import TallyIntegrationERPView from "@/components/modules/tally-integration-erp-view"
import { ShiftHandoverView } from "@/components/modules/shift-handover-view"
import WarehouseOpsCommandView from "@/components/modules/warehouse-ops-command-view"
import InventoryAgingObsolescenceView from "@/components/modules/inventory-aging-obsolescence-view"
import DemurrageDetentionMgmtView from "@/components/modules/demurrage-detention-mgmt-view"
import MultiWarehouseRebalanceView from "@/components/modules/multi-warehouse-rebalance-view"
import MultiModalTransportCorridorView from "@/components/modules/multi-modal-transport-corridor-view"
import BarcodeLabelView from "@/components/modules/barcode-label-view"
import DrayageFirstMileView from "@/components/modules/drayage-first-mile-view"
import ChassisPoolMgmtView from "@/components/modules/chassis-pool-mgmt-view"
import DockDoorOptimizationView from "@/components/modules/dock-door-optimization-view"
import YardOperationsView from "@/components/modules/yard-trucking-view"
import FirstMileCollectionView from "@/components/modules/first-mile-collection-view"
import LastMileEnhancementView from "@/components/modules/last-mile-enhancement-view"
import SupplyChainVisibilityView from "@/components/modules/supply-chain-visibility-view"
import ColdChainEnhancementView from "@/components/modules/cold-chain-enhancement-view"
import CrossDockOptimizationView from "@/components/modules/cross-dock-optimization-view"
import ReverseLogisticsEnhancementView from "@/components/modules/reverse-logistics-enhancement-view"
import WarehouseAutomationView from "@/components/modules/warehouse-automation-view"
import SmartPackagingHubView from "@/components/modules/smart-packaging-hub-view"
import LogisticsAICommandView from "@/components/modules/logistics-ai-command-view"
import DroneDeliveryHubView from "@/components/modules/drone-delivery-hub-view"
import DigitalFreightMarketplaceView from "@/components/modules/digital-freight-marketplace-view"
import IoTSensorDashboardView from "@/components/modules/iot-sensor-dashboard-view"
import ThreePLIntegrationHubView from "@/components/modules/3pl-integration-hub-view"
import LastMileCustomerPortalView from "@/components/modules/last-mile-customer-portal-view"
import ColdChainMonitorView from "@/components/modules/cold-chain-monitor-view"
import { FleetManagementProView } from "@/components/modules/fleet-management-pro-view"
import CrossDockOperationsHubView from "@/components/modules/cross-dock-operations-hub-view"
import CustomsTradeComplianceView from "@/components/modules/customs-trade-compliance-view"
import ReturnsProcessingCenterView from "@/components/modules/returns-processing-center-view"
import EcommerceFulfillmentHubView from "@/components/modules/ecommerce-fulfillment-hub-view"
import WarehouseSafetyManagementView from "@/components/modules/warehouse-safety-management-view"
import LogisticsAnalyticsProView from "@/components/modules/logistics-analytics-pro-view"
import MultiWarehouseOperationsView from "@/components/modules/multi-warehouse-operations-view"
import TransportNetworkHubView from "@/components/modules/transport-network-hub-view"
import WMSDashboardProView from "@/components/modules/wms-dashboard-pro-view"
import SupplierIntelligencePortalView from "@/components/modules/supplier-intelligence-portal-view"
import LastMileOptimizationView from "@/components/modules/last-mile-optimization-view"
import SmartLockerNetworkView from "@/components/modules/smart-locker-network-view"
import ReturnsQualityCenterView from "@/components/modules/returns-quality-center-view"
import HyperlocalFulfillmentView from "@/components/modules/hyperlocal-fulfillment-view"
import FreightLaneIntelligenceView from "@/components/modules/freight-lane-intelligence-view"
import OmnichannelReturnsHubView from "@/components/modules/omnichannel-returns-hub-view"
import AutonomousMobileRobotsFleetView from "@/components/modules/autonomous-mobile-robots-fleet-view"
import ConsignmentInventoryProView from "@/components/modules/consignment-inventory-pro-view"
import LogisticsControlTowerView from "@/components/modules/logistics-control-tower-view"
import WarehouseSmartPickingView from "@/components/modules/warehouse-smart-picking-view"
import SupplyChainResilienceHubView from "@/components/modules/supply-chain-resilience-hub-view"
import LogisticsProcurementCommandView from "@/components/modules/logistics-procurement-command-view"
import WarehouseQualityCommandView from "@/components/modules/warehouse-quality-command-view"
import WmsConfigurationStudioView from "@/components/modules/wms-configuration-studio-view"
import DemandSensingAiView from "@/components/modules/demand-sensing-ai-view"
import ReturnsPredictionEngineView from "@/components/modules/returns-prediction-engine-view"
import SupplyChainDigitalTwinView from "@/components/modules/supply-chain-digital-twin-view"
import LastMileOptimizationProView from "@/components/modules/last-mile-optimization-pro-view"
import WarehouseAutomationHubView from "@/components/modules/warehouse-automation-hub-view"
import LogisticsCarbonTrackerView from "@/components/modules/logistics-carbon-tracker-view"
import SmartDockSchedulerView from "@/components/modules/smart-dock-scheduler-view"
import LogisticsAiCopilotView from "@/components/modules/logistics-ai-copilot-view"
import FleetTelematicsProView from "@/components/modules/fleet-telematics-pro-view"
import DynamicPricingEngineView from "@/components/modules/dynamic-pricing-engine-view"
import FreightLaneCommandView from "@/components/modules/freight-lane-command-view"
import ThreePlPartnerHubView from "@/components/modules/3pl-partner-hub-view"
import LogisticsNetworkCommandView from "@/components/modules/logistics-network-command-view"
import TransportAnalyticsProView from "@/components/modules/transport-analytics-pro-view"
import SmartLockerFleetView from "@/components/modules/smart-locker-fleet-view"
import ColdChainMonitorProView from "@/components/modules/cold-chain-monitor-pro-view"
import CrossBorderLogisticsView from "@/components/modules/cross-border-logistics-view"
import WarehouseDigitalFloorPlanView from "@/components/modules/warehouse-digital-floor-plan-view"
import ReturnsQualityLabView from "@/components/modules/returns-quality-lab-view"
import PortOperationsHubView from "@/components/modules/port-operations-hub-view"
import AiDemandSensingProView from "@/components/modules/ai-demand-sensing-pro-view"
import MicroFulfillmentCenterView from "@/components/modules/micro-fulfillment-center-view"
import RailFreightCommandView from "@/components/modules/rail-freight-command-view"
import WarehouseSimulationLabView from "@/components/modules/warehouse-simulation-lab-view"
import GreenLogisticsTrackerView from "@/components/modules/green-logistics-tracker-view"
import DarkStoreOperationsView from "@/components/modules/dark-store-operations-view"
import SmartReturnsRoutingView from "@/components/modules/smart-returns-routing-view"
import PerishableGoodsCommandView from "@/components/modules/perishable-goods-command-view"
import ExpressDeliveryCommandView from "@/components/modules/express-delivery-command-view"
import CustomsDutyCommandView from "@/components/modules/customs-duty-command-view"
import FleetFuelTrackerView from "@/components/modules/fleet-fuel-tracker-view"
import MultiModalTransportView from "@/components/modules/multi-modal-transport-view"
import SupplyChainRiskView from "@/components/modules/supply-chain-risk-view"
import WarehouseSafetyView from "@/components/modules/warehouse-safety-view"
import PharmaLogisticsView from "@/components/modules/pharma-logistics-view"
import EWasteReverseLogisticsView from "@/components/modules/e-waste-reverse-logistics-view"
import TextileReverseLogisticsView from "@/components/modules/textile-reverse-logistics-view"
import AgriSupplyChainView from "@/components/modules/agri-supply-chain-view"
import LuxuryGoodsLogisticsView from "@/components/modules/luxury-goods-logistics-view"
import ConstructionMaterialTrackerView from "@/components/modules/construction-material-tracker-view"
import AutomotivePartsLogisticsView from "@/components/modules/automotive-parts-logistics-view"
import FmcgDistributionHubView from "@/components/modules/fmcg-distribution-hub-view"
import MedicalDeviceLogisticsView from "@/components/modules/medical-device-logistics-view"
import AerospacePartsTrackingView from "@/components/modules/aerospace-parts-tracking-view"
import NuclearFuelLogisticsView from "@/components/modules/nuclear-fuel-logistics-view"
import OilGasPipelineSupplyView from "@/components/modules/oil-gas-pipeline-supply-view"
import MiningMineralsLogisticsView from "@/components/modules/mining-minerals-logistics-view"
import DefenceSupplyChainView from "@/components/modules/defence-supply-chain-view"
import SeedAgriInputLogisticsView from "@/components/modules/seed-agri-input-logistics-view"
import DairyMilkSupplyChainView from "@/components/modules/dairy-milk-supply-chain-view"
import GemJewelleryLogisticsView from "@/components/modules/gem-jewellery-logistics-view"
import PortContainerTerminalView from "@/components/modules/port-container-terminal-view"
import PharmaVaccineSupplyView from "@/components/modules/pharma-vaccine-supply-view"
import AerospaceMroLogisticsView from "@/components/modules/aerospace-mro-logistics-view"
import TextileApparelLogisticsView from "@/components/modules/textile-apparel-logistics-view"
import EwasteCircularEconomyView from "@/components/modules/ewaste-circular-economy-view"
import SolarEnergyLogisticsView from "@/components/modules/solar-energy-logistics-view"
import EvBatterySupplyChainView from "@/components/modules/ev-battery-supply-chain-view"
import ColdChainPerishableView from "@/components/modules/cold-chain-perishable-view"
import DefenceOrdnanceSupplyView from "@/components/modules/defence-ordnance-supply-view"
import ProjectCargoHeavyLiftView from "@/components/modules/project-cargo-heavy-lift-view"
import MedicalDeviceDistributionView from "@/components/modules/medical-device-distribution-view"
import ChemicalIndustrialGasesView from "@/components/modules/chemical-industrial-gases-view"
import SemiconductorElectronicsView from "@/components/modules/semiconductor-electronics-view"
import SteelMetalsSupplyChainView from "@/components/modules/steel-metals-supply-chain-view"
import DataCenterEquipmentView from "@/components/modules/data-center-equipment-view"
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
  "putaway-management": PutawayManagementView,
  "loading-dispatch": LoadingDispatchView,
  "goods-receipt": GoodsReceiptView,
  "tally-integration": TallyIntegrationView,
  "kitting-assembly": KittingAssemblyView,
  "batch-lot": BatchLotView,
  "consignment-stock": ConsignmentStockView,
  "pool-distribution": PoolDistributionView,
  "third-party-logistics": ThirdPartyLogisticsView,
  "document-management": DocumentManagementView,
  "multi-channel-fulfillment": MultiChannelFulfillmentView,
  "quality-control": QualityControlView,
  "vehicle-fleet-transport": VehicleFleetTransportView,
  "customer-service-resolution": CustomerServiceResolutionView,
  "warehouse-analytics-bi": WarehouseAnalyticsBIView,
  "returns-refund-analytics": ReturnsRefundAnalyticsView,
  "pick-pack-optimization": PickPackOptimizationView,
  "freight-shipping-rate": FreightShippingRateView,
  "dock-scheduling-yard": DockSchedulingYardView,
  "dangerous-goods-hazmat": DangerousGoodsHazMatView,
  "customs-duty-gst": CustomsDutyGstView,
  "pallet-container": PalletContainerView,
  "returns-quality-inspection": ReturnsQualityInspectionView,
  "cod-payment-reconciliation": CODPaymentReconciliationView,
  "warranty-guarantee": WarrantyGuaranteeView,
  "insurance-claims": InsuranceClaimsView,
  "last-mile-delivery": LastMileDeliveryView,
  "multi-channel-integration": MultiChannelIntegrationHubView,
  "supplier-portal": SupplierPortalView,
  "hyperlocal-delivery": HyperlocalDeliveryView,
  "carbon-footprint": CarbonFootprintTrackerView,
  "smart-locker-kiosk": SmartLockerKioskView,
  "warehouse-digital-twin": WarehouseDigitalTwinView,
  "agv-fleet-management": AGVFleetManagementView,
  "parcel-sorting-crossdock": ParcelSortingCrossDockView,
  "warehouse-safety-compliance": WarehouseSafetyComplianceView,
  "goods-to-person-picking": GoodsToPersonPickingView,
  "value-added-services": ValueAddedServicesView,
  "gate-security": GateSecurityView,
  "yard-trucking-dock": YardTruckingView,
  "packaging-design-studio": PackagingDesignStudioView,
  "warehouse-labor-forecasting": WarehouseLaborForecastingView,
  "returns-consolidation-hub": ReturnsConsolidationHubView,
  "3pl-performance-scorecard": ThreePLPerformanceScorecardView,
  "quality-inspection-automation": QualityInspectionAutomationView,
  "supplier-risk-management": SupplierRiskManagementView,
  "predictive-demand-forecasting": PredictiveDemandForecastingView,
  "logistics-network-optimization": LogisticsNetworkOptimizationView,
  "contract-compliance-automation": ContractComplianceAutomationView,
  "last-mile-delivery-analytics": LastMileDeliveryAnalyticsView,
  "returns-processing-enhancement": ReturnsProcessingEnhancementView,
  "cold-chain-monitoring": ColdChainMonitoringView,
  "packaging-optimization": PackagingOptimizationView,
  "load-planning-optimization": LoadPlanningOptimizationView,
  "freight-lane-management": FreightLaneManagementView,
  "customs-duty-optimization": CustomsDutyOptimizationView,
  "intermodal-transport-hub": IntermodalTransportHubView,
  "warehouse-energy-management": WarehouseEnergyManagementView,
  "cargo-insurance-claims": CargoInsuranceClaimsView,
  "port-community-system": PortCommunitySystemView,
  "dedicated-freight-corridor": DedicatedFreightCorridorView,
  "maritime-cargo-security": MaritimeCargoSecurityView,
  "cold-chain-compliance": ColdChainComplianceView,
  "customs-duty-refund": CustomsDutyRefundView,
  "export-documentation-lc": ExportDocumentationLCView,
  "freight-audit-payment": FreightAuditPaymentView,
  "eway-bill-gst-compliance": EWayBillGSTComplianceView,
  "tally-integration-erp": TallyIntegrationERPView,
  "shift-handover": ShiftHandoverView,
  "warehouse-ops-command": WarehouseOpsCommandView,
  "inventory-aging-obsolescence": InventoryAgingObsolescenceView,
  "demurrage-detention-mgmt": DemurrageDetentionMgmtView,
  "multi-warehouse-rebalance": MultiWarehouseRebalanceView,
  "multi-modal-transport-corridor": MultiModalTransportCorridorView,
  "drayage-first-mile": DrayageFirstMileView,
  "chassis-pool-mgmt": ChassisPoolMgmtView,
  "dock-door-optimization": DockDoorOptimizationView,
  "yard-operations": YardOperationsView,
  "first-mile-collection": FirstMileCollectionView,
  "last-mile-enhancement": LastMileEnhancementView,
  "supply-chain-visibility": SupplyChainVisibilityView,
  "cold-chain-enhancement": ColdChainEnhancementView,
  "cross-dock-optimization": CrossDockOptimizationView,
  "reverse-logistics-enhancement": ReverseLogisticsEnhancementView,
  "warehouse-automation": WarehouseAutomationView,
  "smart-packaging-hub": SmartPackagingHubView,
  "logistics-ai-command": LogisticsAICommandView,
  "drone-delivery-hub": DroneDeliveryHubView,
  "digital-freight-marketplace": DigitalFreightMarketplaceView,
  "iot-sensor-dashboard": IoTSensorDashboardView,
  "3pl-integration-hub": ThreePLIntegrationHubView,
  "last-mile-customer-portal": LastMileCustomerPortalView,
  "cold-chain-monitor": ColdChainMonitorView,
  "fleet-management-pro": FleetManagementProView,
  "cross-dock-operations-hub": CrossDockOperationsHubView,
  "customs-trade-compliance": CustomsTradeComplianceView,
  "returns-processing-center": ReturnsProcessingCenterView,
  "ecommerce-fulfillment-hub": EcommerceFulfillmentHubView,
  "warehouse-safety-management": WarehouseSafetyManagementView,
  "logistics-analytics-pro": LogisticsAnalyticsProView,
  "multi-warehouse-operations": MultiWarehouseOperationsView,
  "transport-network-hub": TransportNetworkHubView,
  "wms-dashboard-pro": WMSDashboardProView,
  "supplier-intelligence-portal": SupplierIntelligencePortalView,
  "last-mile-optimization": LastMileOptimizationView,
  "smart-locker-network": SmartLockerNetworkView,
  "returns-quality-center": ReturnsQualityCenterView,
  "hyperlocal-fulfillment": HyperlocalFulfillmentView,
  "freight-lane-intelligence": FreightLaneIntelligenceView,
  "omnichannel-returns-hub": OmnichannelReturnsHubView,
  "autonomous-mobile-robots-fleet": AutonomousMobileRobotsFleetView,
  "consignment-inventory-pro": ConsignmentInventoryProView,
  "logistics-control-tower": LogisticsControlTowerView,
  "warehouse-smart-picking": WarehouseSmartPickingView,
  "supply-chain-resilience-hub": SupplyChainResilienceHubView,
  "logistics-procurement-command": LogisticsProcurementCommandView,
  "warehouse-quality-command": WarehouseQualityCommandView,
  "wms-configuration-studio": WmsConfigurationStudioView,
  "demand-sensing-ai": DemandSensingAiView,
  "returns-prediction-engine": ReturnsPredictionEngineView,
  "supply-chain-digital-twin": SupplyChainDigitalTwinView,
  "last-mile-optimization-pro": LastMileOptimizationProView,
  "warehouse-automation-hub": WarehouseAutomationHubView,
  "logistics-carbon-tracker": LogisticsCarbonTrackerView,
  "smart-dock-scheduler": SmartDockSchedulerView,
  "logistics-ai-copilot": LogisticsAiCopilotView,
  "fleet-telematics-pro": FleetTelematicsProView,
  "dynamic-pricing-engine": DynamicPricingEngineView,
  "freight-lane-command": FreightLaneCommandView,
  "3pl-partner-hub": ThreePlPartnerHubView,
  "logistics-network-command": LogisticsNetworkCommandView,
  "transport-analytics-pro": TransportAnalyticsProView,
  "smart-locker-fleet": SmartLockerFleetView,
  "cold-chain-monitor-pro": ColdChainMonitorProView,
  "cross-border-logistics": CrossBorderLogisticsView,
  "warehouse-digital-floor-plan": WarehouseDigitalFloorPlanView,
  "returns-quality-lab": ReturnsQualityLabView,
  "port-operations-hub": PortOperationsHubView,
  "ai-demand-sensing-pro": AiDemandSensingProView,
  "micro-fulfillment-center": MicroFulfillmentCenterView,
  "rail-freight-command": RailFreightCommandView,
  "warehouse-simulation-lab": WarehouseSimulationLabView,
  "green-logistics-tracker": GreenLogisticsTrackerView,
  "dark-store-operations": DarkStoreOperationsView,
  "smart-returns-routing": SmartReturnsRoutingView,
  "perishable-goods-command": PerishableGoodsCommandView,
  "express-delivery-command": ExpressDeliveryCommandView,
  "customs-duty-command": CustomsDutyCommandView,
  "fleet-fuel-tracker": FleetFuelTrackerView,
  "multi-modal-transport": MultiModalTransportView,
  "supply-chain-risk": SupplyChainRiskView,
  "warehouse-safety": WarehouseSafetyView,
  "pharma-logistics": PharmaLogisticsView,
  "e-waste-reverse-logistics": EWasteReverseLogisticsView,
  "textile-reverse-logistics": TextileReverseLogisticsView,
  "agri-supply-chain": AgriSupplyChainView,
  "luxury-goods-logistics": LuxuryGoodsLogisticsView,
  "construction-material-tracker": ConstructionMaterialTrackerView,
  "automotive-parts-logistics": AutomotivePartsLogisticsView,
  "fmcg-distribution-hub": FmcgDistributionHubView,
  "medical-device-logistics": MedicalDeviceLogisticsView,
  "aerospace-parts-tracking": AerospacePartsTrackingView,
  "nuclear-fuel-logistics": NuclearFuelLogisticsView,
  "oil-gas-pipeline-supply": OilGasPipelineSupplyView,
  "mining-minerals-logistics": MiningMineralsLogisticsView,
  "defence-supply-chain": DefenceSupplyChainView,
  "seed-agri-input-logistics": SeedAgriInputLogisticsView,
  "dairy-milk-supply-chain": DairyMilkSupplyChainView,
  "gem-jewellery-logistics": GemJewelleryLogisticsView,
  "port-container-terminal": PortContainerTerminalView,
  "pharma-vaccine-supply": PharmaVaccineSupplyView,
  "aerospace-mro-logistics": AerospaceMroLogisticsView,
  "textile-apparel-logistics": TextileApparelLogisticsView,
  "ewaste-circular-economy": EwasteCircularEconomyView,
  "solar-energy-logistics": SolarEnergyLogisticsView,
  "ev-battery-supply-chain": EvBatterySupplyChainView,
  "cold-chain-perishable": ColdChainPerishableView,
  "defence-ordnance-supply": DefenceOrdnanceSupplyView,
  "project-cargo-heavy-lift": ProjectCargoHeavyLiftView,
  "medical-device-distribution": MedicalDeviceDistributionView,
  "chemical-industrial-gases": ChemicalIndustrialGasesView,
  "semiconductor-electronics": SemiconductorElectronicsView,
  "steel-metals-supply-chain": SteelMetalsSupplyChainView,
  "data-center-equipment": DataCenterEquipmentView,
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
