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
import ESGComplianceHubView from "@/components/modules/esg-compliance-hub-view"
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
import CementBuildingMaterialsView from "@/components/modules/cement-building-materials-view"
import TelecomTowerInfrastructureView from "@/components/modules/telecom-tower-infrastructure-view"
import SugarEthanolLogisticsView from "@/components/modules/sugar-ethanol-logistics-view"
import FertilizerAgriChemicalsView from "@/components/modules/fertilizer-agri-chemicals-view"
import RubberTyreLogisticsView from "@/components/modules/rubber-tyre-logistics-view"
import PaintsCoatingsSupplyChainView from "@/components/modules/paints-coatings-supply-chain-view"
import PaperPulpLogisticsView from "@/components/modules/paper-pulp-logistics-view"
import LeatherFootwearSupplyChainView from "@/components/modules/leather-footwear-supply-chain-view"
import ScrapRecyclingLogisticsView from "@/components/modules/scrap-recycling-logistics-view"
import GemsJewellerySupplyChainView from "@/components/modules/gems-jewellery-supply-chain-view"
import MarbleGraniteLogisticsView from "@/components/modules/marble-granite-logistics-view"
import CashewProcessingLogisticsView from "@/components/modules/cashew-processing-logistics-view"
import CosmeticsPersonalCareLogisticsView from "@/components/modules/cosmetics-personal-care-logistics-view"
import SportsEquipmentSupplyChainView from "@/components/modules/sports-equipment-supply-chain-view"
import HandicraftsArtisanLogisticsView from "@/components/modules/handicrafts-artisan-logistics-view"
import TeaSpiceSupplyChainView from "@/components/modules/tea-spice-supply-chain-view"
import FireworksCrackersLogisticsView from "@/components/modules/fireworks-crackers-logistics-view"
import JuteCoirSupplyChainView from "@/components/modules/jute-coir-supply-chain-view"
import MusicalInstrumentsLogisticsView from "@/components/modules/musical-instruments-logistics-view"
import SilkTextileHeritageSupplyChainView from "@/components/modules/silk-textile-heritage-supply-chain-view"
import AyurvedaHerbalProductsLogisticsView from "@/components/modules/ayurveda-herbal-products-logistics-view"
import OrganicFoodSupplyChainView from "@/components/modules/organic-food-supply-chain-view"
import PlywoodPlyboardLogisticsView from "@/components/modules/plywood-plyboard-logistics-view"
import BrassCopperWareSupplyChainView from "@/components/modules/brass-copper-ware-supply-chain-view"
import IncenseDhoopLogisticsView from "@/components/modules/incense-dhoop-logistics-view"
import TerracottaPotterySupplyChainView from "@/components/modules/terracotta-pottery-supply-chain-view"
import HandloomCottonSupplyChainView from "@/components/modules/handloom-cotton-supply-chain-view"
import CarpetRugLogisticsView from "@/components/modules/carpet-rug-logistics-view"
import GlassCeramicsSupplyChainView from "@/components/modules/glass-ceramics-supply-chain-view"
import HandicraftWoodworkLogisticsView from "@/components/modules/handicraft-woodwork-logistics-view"
import BambooCaneProductsSupplyChainView from "@/components/modules/bamboo-cane-products-supply-chain-view"
import LacquerwareLacBanglesLogisticsView from "@/components/modules/lacquerware-lac-bangles-logistics-view"
import ZariZardoziEmbroideryLogisticsView from "@/components/modules/zari-zardozi-embroidery-logistics-view"
import PuppetryTraditionalToysLogisticsView from "@/components/modules/puppetry-traditional-toys-logistics-view"
import MakhanaFoxNutProcessingLogisticsView from "@/components/modules/makhana-fox-nut-processing-logistics-view"
import MadhubaniFolkArtSupplyChainView from "@/components/modules/madhubani-folk-art-supply-chain-view"
import SaffronKesarProcessingLogisticsView from "@/components/modules/saffron-kesar-processing-logistics-view"
import PashminaWoolSupplyChainView from "@/components/modules/pashmina-wool-supply-chain-view"
import SandstoneCarvingSupplyChainView from "@/components/modules/sandstone-carving-supply-chain-view"
import BluePotteryJaipurLogisticsView from "@/components/modules/blue-pottery-jaipur-logistics-view"
import KashmirWalnutWoodCarvingSupplyChainView from "@/components/modules/kashmir-walnut-wood-carving-supply-chain-view"
import AssamSilkMugaWeavingSupplyChainView from "@/components/modules/assam-silk-muga-weaving-supply-chain-view"
import ChikankariLucknowEmbroideryView from "@/components/modules/chikankari-lucknow-embroidery-view"
import ThanjavurBronzeSculptureSupplyChainView from "@/components/modules/thanjavur-bronze-sculpture-supply-chain-view"
import KondapalliBommaluToysLogisticsView from "@/components/modules/kondapalli-bommalu-toys-logistics-view"
import KalamkariPenArtLogisticsView from "@/components/modules/kalamkari-pen-art-logistics-view"
import ChhauMaskDanceLogisticsView from "@/components/modules/chhau-mask-dance-logistics-view"
import KanthaEmbroideryBengalLogisticsView from "@/components/modules/kantha-embroidery-bengal-logistics-view"
import RajasthanPuppetryLogisticsView from "@/components/modules/rajasthan-puppetry-logistics-view"
import BanarasiSilkWeavingLogisticsView from "@/components/modules/banarasi-silk-weaving-logistics-view"
import MadhubaniPaintingBiharLogisticsView from "@/components/modules/madhubani-painting-bihar-logistics-view"
import PattachitraOdishaLogisticsView from "@/components/modules/pattachitra-odisha-logistics-view"
import KeralaMuralPaintingLogisticsView from "@/components/modules/kerala-mural-painting-logistics-view"
import WarliTribalArtMaharashtraLogisticsView from "@/components/modules/warli-tribal-art-maharashtra-logistics-view"
import RoghanPaintingGujaratLogisticsView from "@/components/modules/roghan-painting-gujarat-logistics-view"
import DhokraBellMetalCraftLogisticsView from "@/components/modules/dhokra-bell-metal-craft-logistics-view"
import PhadPaintingRajasthanLogisticsView from "@/components/modules/phad-painting-rajasthan-logistics-view"
import BidriwareMetalCraftKarnatakaLogisticsView from "@/components/modules/bidriware-metal-craft-karnataka-logistics-view"
import KalamkariVeilArtAndhraLogisticsView from "@/components/modules/kalamkari-veil-art-andhra-logistics-view"
import PichwaiPaintingRajasthanLogisticsView from "@/components/modules/pichwai-painting-rajasthan-logistics-view"
import SaurashtraAppliqueGujaratLogisticsView from "@/components/modules/saurashtra-applique-gujarat-logistics-view"
import ManipuriBlackPotteryLogisticsView from "@/components/modules/manipuri-black-pottery-logistics-view"
import NagaWoodCarvingNagalandLogisticsView from "@/components/modules/naga-wood-carving-nagaland-logistics-view"
import SantiniketanBatikBengalLogisticsView from "@/components/modules/santiniketan-batik-bengal-logistics-view"
import KashmirPapierMacheLogisticsView from "@/components/modules/kashmir-papier-mache-logistics-view"
import MysoreRosewoodInlayLogisticsView from "@/components/modules/mysore-rosewood-inlay-logistics-view"
import AssamBambooCraftLogisticsView from "@/components/modules/assam-bamboo-craft-logistics"
import RajasthanBluePotteryLogisticsView from "@/components/modules/rajasthan-blue-pottery-logistics"
import KanchipuramSilkSareeLogisticsView from "@/components/modules/kanchipuram-silk-saree-logistics"
import GondTribalArtMadhyaPradeshLogisticsView from "@/components/modules/gond-tribal-art-madhya-pradesh-logistics"
import NirmalPaintingTelanganaLogisticsView from "@/components/modules/nirmal-painting-telangana-logistics"
import SankhedaLacquerwareGujaratLogisticsView from "@/components/modules/sankheda-lacquerware-gujarat-logistics-view"
import TanjorePaintingTamilNaduLogisticsView from "@/components/modules/tanjore-painting-tamil-nadu-logistics-view"
import PatolaDoubleIkatGujaratLogisticsView from "@/components/modules/patola-double-ikat-gujarat-logistics-view"
import ChikankariEmbroideryLucknowLogisticsView from "@/components/modules/chikankari-embroidery-lucknow-logistics-view"
import PochampallyIkatTelanganaLogisticsView from "@/components/modules/pochampally-ikat-telangana-logistics-view"
import KutchBandhaniGujaratLogisticsView from "@/components/modules/kutch-bandhani-gujarat-logistics-view"
import MiniaturePaintingRajasthanLogisticsView from "@/components/modules/miniature-painting-rajasthan-logistics-view"
import OdishaPipliAppliqueLogisticsView from "@/components/modules/odisha-pipli-applique-logistics-view"
import BhilTribalArtMadhyaPradeshLogisticsView from "@/components/modules/bhil-tribal-art-madhya-pradesh-logistics-view"
import SanjhiPaperArtUttarPradeshLogisticsView from "@/components/modules/sanjhi-paper-art-uttar-pradesh-logistics-view"
import MataNiPachediGujaratLogisticsView from "@/components/modules/mata-ni-pachedi-gujarat-logistics-view"
import KashmirSozniEmbroideryLogisticsView from "@/components/modules/kashmir-sozni-embroidery-logistics-view"
import WarliTribalPaintingMaharashtraLogisticsView from "@/components/modules/warli-tribal-painting-maharashtra-logistics-view"
import ChanderiSilkWeavingMadhyaPradeshLogisticsView from "@/components/modules/chanderi-silk-weaving-madhya-pradesh-logistics-view"
import KangraPaintingHimachalPradeshLogisticsView from "@/components/modules/kangra-painting-himachal-pradesh-logistics-view"
import GodnaTattooArtMadhyaPradeshLogisticsView from "@/components/modules/godna-tattoo-art-madhya-pradesh-logistics-view"
import PatuaScrollArtWestBengalLogisticsView from "@/components/modules/patua-scroll-art-west-bengal-logistics-view"
import SauraTribalArtOdishaLogisticsView from "@/components/modules/saura-tribal-art-odisha-logistics-view"
import ChambaRumalEmbroideryHimachalPradeshLogisticsView from "@/components/modules/chamba-rumal-embroidery-himachal-pradesh-logistics-view"
import ThangkaPaintingLadakhLogisticsView from "@/components/modules/thangka-painting-ladakh-logistics-view"
import KolamFloorArtTamilNaduLogisticsView from "@/components/modules/kolam-floor-art-tamil-nadu-logistics-view"
import KinhalWoodcraftKarnatakaLogisticsView from "@/components/modules/kinhal-woodcraft-karnataka-logistics-view"
import SikkiGrassWeavingBiharLogisticsView from "@/components/modules/sikki-grass-weaving-bihar-logistics-view"
import AipanArtAlmoraLogisticsView from "@/components/modules/aipan-art-almora-logistics-view"
import KinnauriShawlHimachalPradeshLogisticsView from "@/components/modules/kinnauri-shawl-himachal-pradesh-logistics-view"
import BastarIronCraftChhattisgarhLogisticsView from "@/components/modules/bastar-iron-craft-chhattisgarh-logistics-view"
import MolelaTerracottaRajasthanLogisticsView from "@/components/modules/molela-terracotta-rajasthan-logistics-view"
import SungudiSareeTamilNaduLogisticsView from "@/components/modules/sungudi-saree-tamil-nadu-logistics-view"
import PembarthiMetalCraftTelanganaLogisticsView from "@/components/modules/pembarthi-metal-craft-telangana-logistics-view"
import RoganArtGujaratLogisticsView from "@/components/modules/rogan-art-gujarat-logistics-view"
import PichwaiRajasthanLogisticsView from "@/components/modules/pichwai-rajasthan-logistics-view"
import WarliMaharashtraLogisticsView from "@/components/modules/warli-maharashtra-logistics-view"
import GondMadhyaLogisticsView from "@/components/modules/gond-madhya-logistics-view"
import KalighatBengalLogisticsView from "@/components/modules/kalighat-bengal-logistics-view"
import CheriyalScrollArtTelanganaLogisticsView from "@/components/modules/cheriyal-scroll-art-telangana-logistics-view"
import BaghPrintMadhyaLogisticsView from "@/components/modules/bagh-print-madhya-logistics-view"
import BagruBlockPrintRajasthanLogisticsView from "@/components/modules/bagru-block-print-rajasthan-logistics-view"
import KalamkariPenArtAndhraLogisticsView from "@/components/modules/kalamkari-pen-art-andhra-logistics-view"
import DabuPrintRajasthanLogisticsView from "@/components/modules/dabu-print-rajasthan-logistics-view"
import RoganGujaratLogisticsView from "@/components/modules/rogan-gujarat-logistics-view"
import SanjhiPaperCuttingUpLogisticsView from "@/components/modules/sanjhi-paper-cutting-up-logistics-view"
import MeenakariUdaipurRajasthanLogisticsView from "@/components/modules/meenakari-udaipur-rajasthan-logistics-view"
import DhokraChhattisgarhLogisticsView from "@/components/modules/dhokra-chhattisgarh-logistics-view"
import BidriKarnatakaLogisticsView from "@/components/modules/bidri-karnataka-logistics-view"
import GondArtMadhyaPradeshLogisticsView from "@/components/modules/gond-art-madhya-pradesh-logistics-view"
import MadhubaniBiharLogisticsView from "@/components/modules/madhubani-bihar-logistics-view"
import KalamkariAndhraLogisticsView from "@/components/modules/kalamkari-andhra-logistics-view"
import PatolaGujaratLogisticsView from "@/components/modules/patola-gujarat-logistics-view"
import KasutiKarnatakaLogisticsView from "@/components/modules/kasuti-karnataka-logistics-view"
import BanjaraEmbroideryTelanganaLogisticsView from "@/components/modules/banjara-embroidery-telangana-logistics-view"
import ChanderiMadhyaPradeshLogisticsView from "@/components/modules/chanderi-madhya-pradesh-logistics-view"
import PhulkariEmbroideryPunjabLogisticsView from "@/components/modules/phulkari-embroidery-punjab-logistics-view"
import TarakasiSilverFiligreeOdishaLogisticsView from "@/components/modules/tarakasi-silver-filigree-odisha-logistics-view"
import AjrakhBlockPrintKutchLogisticsView from "@/components/modules/ajrakh-block-print-kutch-logistics-view"
import PattachitraWestBengalLogisticsView from "@/components/modules/pattachitra-west-bengal-logistics-view"
import PithoraTribalArtChhattisgarhLogisticsView from "@/components/modules/pithora-tribal-art-chhattisgarh-logistics-view"
import WarehouseEnergyAnalyticsView from "@/components/modules/warehouse-energy-analytics-view"
import RouteIntelligenceHubView from "@/components/modules/route-intelligence-hub-view"
import DriverPerformanceHubView from "@/components/modules/driver-performance-hub-view"
import LoadOptimizationCommandView from "@/components/modules/load-optimization-command-view"
import WarehouseLifecycleTrackerView from "@/components/modules/warehouse-lifecycle-tracker-view"
import ReturnsQualityAssessmentView from "@/components/modules/returns-quality-assessment-view"
import PortVesselTrackerView from "@/components/modules/port-vessel-tracker-view"
import SmartPackagingIntelligenceView from "@/components/modules/smart-packaging-intelligence-view"
import FreightBookingCommandView from "@/components/modules/freight-booking-command-view"
import WarehouseShuttleOpsView from "@/components/modules/warehouse-shuttle-ops-view"
import TransportRateIntelligenceView from "@/components/modules/transport-rate-intelligence-view"
import VehicleInspectionComplianceView from "@/components/modules/vehicle-inspection-compliance-view"
import FastagTollIntelligenceView from "@/components/modules/fastag-toll-intelligence-view"
import WarehouseLabourWorkforceAnalyticsView from "@/components/modules/warehouse-labour-workforce-analytics-view"
import GstInvoiceEInvoicingCommandView from "@/components/modules/gst-invoice-e-invoicing-command-view"
import FreightInvoiceReconciliationView from "@/components/modules/freight-invoice-reconciliation-view"
import IcdContainerYardIntelligenceView from "@/components/modules/icd-container-yard-intelligence-view"
import WarehouseSpaceCapacityPlannerView from "@/components/modules/warehouse-space-capacity-planner-view"
import ShipmentTrackingMilestoneView from "@/components/modules/shipment-tracking-milestone-view"
import TransitInsuranceClaimsView from "@/components/modules/transit-insurance-claims-view"
import EwayBillExpiryTrackerView from "@/components/modules/eway-bill-expiry-tracker-view"
import InlandContainerDepotCommandView from "@/components/modules/inland-container-depot-command-view"
import FreightForwardingCommandView from "@/components/modules/freight-forwarding-command-view"
import CoastalShippingWaterwayView from "@/components/modules/coastal-shipping-waterway-view"
import FmcgSuperstockistNetworkView from "@/components/modules/fmcg-superstockist-network-view"
import AutomotiveLogisticsCommandView from "@/components/modules/automotive-logistics-command-view"
import AirCargoTerminalView from "@/components/modules/air-cargo-terminal-view"
import AgriWarehousingCommandView from "@/components/modules/agri-warehousing-command-view"
import RailwayFreightTerminalView from "@/components/modules/railway-freight-terminal-view"
import PharmaColdChainView from "@/components/modules/pharma-cold-chain-view"
import CementLogisticsCommandView from "@/components/modules/cement-logistics-command-view"
import MiningLogisticsCommandView from "@/components/modules/mining-logistics-command-view"
import PetroleumPipelineCommandView from "@/components/modules/petroleum-pipeline-command-view"
import SteelLogisticsCommandView from "@/components/modules/steel-logistics-command-view"
import GrainSiloLogisticsView from "@/components/modules/grain-silo-logistics-view"
import DefenseSupplyCommandView from "@/components/modules/defense-supply-command-view"
import RiverWaterwayLogisticsView from "@/components/modules/river-waterway-logistics-view"
import ExpressParcelLogisticsView from "@/components/modules/express-parcel-logistics-view"
import MetroRailLogisticsView from "@/components/modules/metro-rail-logistics-view"
import QuickCommerceLogisticsView from "@/components/modules/quick-commerce-logistics-view"
import LpgDistributionLogisticsView from "@/components/modules/lpg-distribution-logistics-view"
import EWasteRecyclingLogisticsView from "@/components/modules/e-waste-recycling-logistics-view"
import DairyFarmLogisticsView from "@/components/modules/dairy-farm-logistics-view"
import TextileMillLogisticsView from "@/components/modules/textile-mill-logistics-view"
import FmcgDistributionLogisticsView from "@/components/modules/fmcg-distribution-logistics-view"
import CementBlendLogisticsView from "@/components/modules/cement-blend-logistics-view"
import NewsprintPublishingLogisticsView from "@/components/modules/newsprint-publishing-logistics-view"
import SteelScrapRecyclingLogisticsView from "@/components/modules/steel-scrap-recycling-logistics-view"
import CourierExpressLogisticsView from "@/components/modules/courier-express-logistics-view"
import PetroleumTankFarmLogisticsView from "@/components/modules/petroleum-tank-farm-logistics-view"
import MiningEquipmentLogisticsView from "@/components/modules/mining-equipment-logistics-view"
import InlandWaterwayLogisticsView from "@/components/modules/inland-waterway-logistics-view"
import RailwayFreightLogisticsView from "@/components/modules/railway-freight-logistics-view"
import AerospacePartsLogisticsView from "@/components/modules/aerospace-parts-logistics-view"
import DefenceOrdnanceLogisticsView from "@/components/modules/defence-ordnance-logistics-view"
import ColdChainPharmaLogisticsView from "@/components/modules/cold-chain-pharma-logistics-view"
import MetroRailOperationsLogisticsView from "@/components/modules/metro-rail-operations-logistics-view"
import TelecomTowerLogisticsView from "@/components/modules/telecom-tower-logistics-view"
import OversizeOdcTransportLogisticsView from "@/components/modules/oversize-odc-transport-logistics-view"
import ParcelSortationLogisticsView from "@/components/modules/parcel-sortation-logistics-view"
import PipelineIntegrityLogisticsView from "@/components/modules/pipeline-integrity-logistics-view"
import SolarPanelRecyclingLogisticsView from "@/components/modules/solar-panel-recycling-logistics-view"
import PortTerminalOperationsLogisticsView from "@/components/modules/port-terminal-operations-logistics-view"
import EvBatteryRecyclingLogisticsView from "@/components/modules/ev-battery-recycling-logistics-view"
import InlandWaterwaysLogisticsView from "@/components/modules/inland-waterways-logistics-view"
import HsrLogisticsView from "@/components/modules/hsr-logistics-view"
import DataCenterCoolingLogisticsView from "@/components/modules/data-center-cooling-logistics-view"
import SpaceLaunchLogisticsView from "@/components/modules/space-launch-logistics-view"
import DefenseLogisticsView from "@/components/modules/defense-logistics-view"
import AviationGroundHandlingLogisticsView from "@/components/modules/aviation-ground-handling-logistics-view"
import SmartCityLogisticsView from "@/components/modules/smart-city-logistics-view"
import SmartGridPowerLogisticsView from "@/components/modules/smart-grid-power-logistics-view"
import SubseaCableLayingLogisticsView from "@/components/modules/subsea-cable-laying-logistics-view"
import GreenHydrogenEnergyLogisticsView from "@/components/modules/green-hydrogen-energy-logistics-view"
import SemiconductorFabLogisticsView from "@/components/modules/semiconductor-fab-logistics-view"
import OffshoreWindLogisticsView from "@/components/modules/offshore-wind-logistics-view"
import LithiumBatteryCellLogisticsView from "@/components/modules/lithium-battery-cell-logistics-view"
import NuclearPowerPlantLogisticsView from "@/components/modules/nuclear-power-plant-logistics-view"
import ElectricBusFleetLogisticsView from "@/components/modules/electric-bus-fleet-logistics-view"
import SolarFarmConstructionLogisticsView from "@/components/modules/solar-farm-construction-logistics-view"
import WasteToEnergyPlantLogisticsView from "@/components/modules/waste-to-energy-plant-logistics-view"
import HydroelectricDamConstructionLogisticsView from "@/components/modules/hydroelectric-dam-construction-logistics-view"
import TunnelBoringMachineLogisticsView from "@/components/modules/tunnel-boring-machine-logistics-view"
import LngTerminalLogisticsView from "@/components/modules/lng-terminal-logistics-view"
import MonorailSystemLogisticsView from "@/components/modules/monorail-system-logistics-view"
import DroneDeliveryLogisticsView from "@/components/modules/drone-delivery-logistics-view"
import CableCarRopewayLogisticsView from "@/components/modules/cable-car-ropeway-logistics-view"
import BridgeConstructionLogisticsView from "@/components/modules/bridge-construction-logistics-view"
import DesalinationPlantLogisticsView from "@/components/modules/desalination-plant-logistics-view"
import SolarThermalCspLogisticsView from "@/components/modules/solar-thermal-csp-logistics-view"
import BiomassPowerPlantLogisticsView from "@/components/modules/biomass-power-plant-logistics-view"
import HydrogenProductionFacilityLogisticsView from "@/components/modules/hydrogen-production-facility-logistics-view"
import FlyoverInterchangeLogisticsView from "@/components/modules/flyover-interchange-logistics-view"
import PortContainerTerminalLogisticsView from "@/components/modules/port-container-terminal-logistics-view"
import SubmarineTunnelLogisticsView from "@/components/modules/submarine-tunnel-logistics-view"
import SupercapacitorEnergyStorageLogisticsView from "@/components/modules/supercapacitor-energy-storage-logistics-view"
import OffshoreWindInstallationLogisticsView from "@/components/modules/offshore-wind-installation-logistics-view"
import SuperconductingCableTransmissionLogisticsView from "@/components/modules/superconducting-cable-transmission-logistics-view"
import DeepWaterDrillingPlatformLogisticsView from "@/components/modules/deep-water-drilling-platform-logistics-view"
import NuclearPowerPlantConstructionLogisticsView from "@/components/modules/nuclear-power-plant-construction-logistics-view"
import SatelliteLaunchComplexLogisticsView from "@/components/modules/satellite-launch-complex-logistics-view"
import QuantumCommunicationNetworkLogisticsView from "@/components/modules/quantum-communication-network-logistics-view"
import SpaceDebrisRemovalLogisticsView from "@/components/modules/space-debris-removal-logistics-view"
import SolidStateBatteryManufacturingLogisticsView from "@/components/modules/solid-state-battery-manufacturing-logistics-view"
import GreenAmmoniaProductionLogisticsView from "@/components/modules/green-ammonia-production-logistics-view"
import FusionEnergyReactorLogisticsView from "@/components/modules/fusion-energy-reactor-logistics-view"
import OceanWaveEnergyLogisticsView from "@/components/modules/ocean-wave-energy-logistics-view"
import DirectAirCaptureLogisticsView from "@/components/modules/direct-air-capture-logistics-view"
import FloatingSolarFarmLogisticsView from "@/components/modules/floating-solar-farm-logistics-view"
import TidalEnergyLogisticsView from "@/components/modules/tidal-energy-logistics-view"
import HydrogenFuelStationLogisticsView from "@/components/modules/hydrogen-fuel-station-logistics-view"
import CarbonNanotubeProductionLogisticsView from "@/components/modules/carbon-nanotube-production-logistics-view"
import GrapheneProductionLogisticsView from "@/components/modules/graphene-production-logistics-view"
import GeothermalEnergyLogisticsView from "@/components/modules/geothermal-energy-logistics-view"
import AutonomousVehicleLogisticsView from "@/components/modules/autonomous-vehicle-logistics-view"
import PerovskiteSolarCellManufacturingLogisticsView from "@/components/modules/perovskite-solar-cell-manufacturing-logistics-view"
import HydrogenFuelCellStackLogisticsView from "@/components/modules/hydrogen-fuel-cell-stack-logistics-view"
import VanadiumRedoxFlowBatteryLogisticsView from "@/components/modules/vanadium-redox-flow-battery-logistics-view"
import SolidOxideElectrolyzerLogisticsView from "@/components/modules/solid-oxide-electrolyzer-logistics-view"
import NuclearSmrLogisticsView from "@/components/modules/nuclear-smr-logistics-view"
import LithiumExtractionLogisticsView from "@/components/modules/lithium-extraction-logistics-view"
import CarbonCaptureStorageLogisticsView from "@/components/modules/carbon-capture-storage-logistics-view"
import GreenMethanolLogisticsView from "@/components/modules/green-methanol-logistics-view"
import AmmoniaCrackingLogisticsView from "@/components/modules/ammonia-cracking-logistics-view"
import SpaceLaunchVehicleLogisticsView from "@/components/modules/space-launch-vehicle-logistics-view"
import BiojetFuelLogisticsView from "@/components/modules/biojet-fuel-logistics-view"
import RareEarthMineralsLogisticsView from "@/components/modules/rare-earth-minerals-logistics-view"
import HydrogenPipelineLogisticsView from "@/components/modules/hydrogen-pipeline-logistics-view"
import CarbonTradingLogisticsView from "@/components/modules/carbon-trading-logistics-view"
import DeepSeaMiningLogisticsView from "@/components/modules/deep-sea-mining-logistics-view"
import BiocharLogisticsView from "@/components/modules/biochar-logistics-view"
import HydrogenStorageLogisticsView from "@/components/modules/hydrogen-storage-logistics-view"
import PlasmaGasificationLogisticsView from "@/components/modules/plasma-gasification-logistics-view"
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
  "esg-compliance-hub": ESGComplianceHubView,
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
  "cement-building-materials": CementBuildingMaterialsView,
  "telecom-tower-infrastructure": TelecomTowerInfrastructureView,
  "sugar-ethanol-logistics": SugarEthanolLogisticsView,
  "fertilizer-agri-chemicals": FertilizerAgriChemicalsView,
  "rubber-tyre-logistics": RubberTyreLogisticsView,
  "paints-coatings-supply-chain": PaintsCoatingsSupplyChainView,
  "paper-pulp-logistics": PaperPulpLogisticsView,
  "leather-footwear-supply-chain": LeatherFootwearSupplyChainView,
  "scrap-recycling-logistics": ScrapRecyclingLogisticsView,
  "gems-jewellery-supply-chain": GemsJewellerySupplyChainView,
  "marble-granite-logistics": MarbleGraniteLogisticsView,
  "cashew-processing-logistics": CashewProcessingLogisticsView,
  "cosmetics-personal-care-logistics": CosmeticsPersonalCareLogisticsView,
  "sports-equipment-supply-chain": SportsEquipmentSupplyChainView,
  "handicrafts-artisan-logistics": HandicraftsArtisanLogisticsView,
  "tea-spice-supply-chain": TeaSpiceSupplyChainView,
  "fireworks-crackers-logistics": FireworksCrackersLogisticsView,
  "jute-coir-supply-chain": JuteCoirSupplyChainView,
  "musical-instruments-logistics": MusicalInstrumentsLogisticsView,
  "silk-textile-heritage-supply-chain": SilkTextileHeritageSupplyChainView,
  "ayurveda-herbal-products-logistics": AyurvedaHerbalProductsLogisticsView,
  "organic-food-supply-chain": OrganicFoodSupplyChainView,
  "plywood-plyboard-logistics": PlywoodPlyboardLogisticsView,
  "brass-copper-ware-supply-chain": BrassCopperWareSupplyChainView,
  "incense-dhoop-logistics": IncenseDhoopLogisticsView,
  "terracotta-pottery-supply-chain": TerracottaPotterySupplyChainView,
  "handloom-cotton-supply-chain": HandloomCottonSupplyChainView,
  "carpet-rug-logistics": CarpetRugLogisticsView,
  "glass-ceramics-supply-chain": GlassCeramicsSupplyChainView,
  "handicraft-woodwork-logistics": HandicraftWoodworkLogisticsView,
  "bamboo-cane-products-supply-chain": BambooCaneProductsSupplyChainView,
  "lacquerware-lac-bangles-logistics": LacquerwareLacBanglesLogisticsView,
  "zari-zardozi-embroidery-logistics": ZariZardoziEmbroideryLogisticsView,
  "puppetry-traditional-toys-logistics": PuppetryTraditionalToysLogisticsView,
  "makhana-fox-nut-processing-logistics": MakhanaFoxNutProcessingLogisticsView,
  "madhubani-folk-art-supply-chain": MadhubaniFolkArtSupplyChainView,
  "saffron-kesar-processing-logistics": SaffronKesarProcessingLogisticsView,
  "pashmina-wool-supply-chain": PashminaWoolSupplyChainView,
  "sandstone-carving-supply-chain": SandstoneCarvingSupplyChainView,
  "blue-pottery-jaipur-logistics": BluePotteryJaipurLogisticsView,
  "kashmir-walnut-wood-carving-supply-chain": KashmirWalnutWoodCarvingSupplyChainView,
  "assam-silk-muga-weaving-supply-chain": AssamSilkMugaWeavingSupplyChainView,
  "chikankari-lucknow-embroidery": ChikankariLucknowEmbroideryView,
  "thanjavur-bronze-sculpture-supply-chain": ThanjavurBronzeSculptureSupplyChainView,
  "kondapalli-bommalu-toys-logistics": KondapalliBommaluToysLogisticsView,
  "kalamkari-pen-art-logistics": KalamkariPenArtLogisticsView,
  "chhau-mask-dance-logistics": ChhauMaskDanceLogisticsView,
  "kantha-embroidery-bengal-logistics": KanthaEmbroideryBengalLogisticsView,
  "rajasthan-puppetry-logistics": RajasthanPuppetryLogisticsView,
  "banarasi-silk-weaving-logistics": BanarasiSilkWeavingLogisticsView,
  "madhubani-painting-bihar-logistics": MadhubaniPaintingBiharLogisticsView,
  "pattachitra-odisha-logistics": PattachitraOdishaLogisticsView,
  "kerala-mural-painting-logistics": KeralaMuralPaintingLogisticsView,
  "warli-tribal-art-maharashtra-logistics": WarliTribalArtMaharashtraLogisticsView,
  "roghan-painting-gujarat-logistics": RoghanPaintingGujaratLogisticsView,
  "dhokra-bell-metal-craft-logistics": DhokraBellMetalCraftLogisticsView,
  "phad-painting-rajasthan-logistics": PhadPaintingRajasthanLogisticsView,
  "bidriware-metal-craft-karnataka-logistics": BidriwareMetalCraftKarnatakaLogisticsView,
  "kalamkari-veil-art-andhra-logistics": KalamkariVeilArtAndhraLogisticsView,
  "pichwai-painting-rajasthan-logistics": PichwaiPaintingRajasthanLogisticsView,
  "saurashtra-applique-gujarat-logistics": SaurashtraAppliqueGujaratLogisticsView,
  "manipuri-black-pottery-logistics": ManipuriBlackPotteryLogisticsView,
  "naga-wood-carving-nagaland-logistics": NagaWoodCarvingNagalandLogisticsView,
  "santiniketan-batik-bengal-logistics": SantiniketanBatikBengalLogisticsView,
  "kashmir-papier-mache-logistics": KashmirPapierMacheLogisticsView,
  "mysore-rosewood-inlay-logistics": MysoreRosewoodInlayLogisticsView,
  "assam-bamboo-craft-logistics": AssamBambooCraftLogisticsView,
  "rajasthan-blue-pottery-logistics": RajasthanBluePotteryLogisticsView,
  "kanchipuram-silk-saree-logistics": KanchipuramSilkSareeLogisticsView,
  "gond-tribal-art-madhya-pradesh-logistics": GondTribalArtMadhyaPradeshLogisticsView,
  "nirmal-painting-telangana-logistics": NirmalPaintingTelanganaLogisticsView,
  "sankheda-lacquerware-gujarat-logistics": SankhedaLacquerwareGujaratLogisticsView,
  "tanjore-painting-tamil-nadu-logistics": TanjorePaintingTamilNaduLogisticsView,
  "patola-double-ikat-gujarat-logistics": PatolaDoubleIkatGujaratLogisticsView,
  "chikankari-embroidery-lucknow-logistics": ChikankariEmbroideryLucknowLogisticsView,
  "pochampally-ikat-telangana-logistics": PochampallyIkatTelanganaLogisticsView,
  "kutch-bandhani-gujarat-logistics": KutchBandhaniGujaratLogisticsView,
  "miniature-painting-rajasthan-logistics": MiniaturePaintingRajasthanLogisticsView,
  "odisha-pipli-applique-logistics": OdishaPipliAppliqueLogisticsView,
  "bhil-tribal-art-madhya-pradesh-logistics": BhilTribalArtMadhyaPradeshLogisticsView,
  "sanjhi-paper-art-uttar-pradesh-logistics": SanjhiPaperArtUttarPradeshLogisticsView,
  "mata-ni-pachedi-gujarat-logistics": MataNiPachediGujaratLogisticsView,
  "kashmir-sozni-embroidery-logistics": KashmirSozniEmbroideryLogisticsView,
  "warli-tribal-painting-maharashtra-logistics": WarliTribalPaintingMaharashtraLogisticsView,
  "chanderi-silk-weaving-madhya-pradesh-logistics": ChanderiSilkWeavingMadhyaPradeshLogisticsView,
  "kangra-painting-himachal-pradesh-logistics": KangraPaintingHimachalPradeshLogisticsView,
  "godna-tattoo-art-madhya-pradesh-logistics": GodnaTattooArtMadhyaPradeshLogisticsView,
  "patua-scroll-art-west-bengal-logistics": PatuaScrollArtWestBengalLogisticsView,
  "saura-tribal-art-odisha-logistics": SauraTribalArtOdishaLogisticsView,
  "chamba-rumal-embroidery-himachal-pradesh-logistics": ChambaRumalEmbroideryHimachalPradeshLogisticsView,
  "thangka-painting-ladakh-logistics": ThangkaPaintingLadakhLogisticsView,
  "kolam-floor-art-tamil-nadu-logistics": KolamFloorArtTamilNaduLogisticsView,
  "kinhal-woodcraft-karnataka-logistics": KinhalWoodcraftKarnatakaLogisticsView,
  "sikki-grass-weaving-bihar-logistics": SikkiGrassWeavingBiharLogisticsView,
  "aipan-art-almora-logistics": AipanArtAlmoraLogisticsView,
  "kinnauri-shawl-himachal-pradesh-logistics": KinnauriShawlHimachalPradeshLogisticsView,
  "bastar-iron-craft-chhattisgarh-logistics": BastarIronCraftChhattisgarhLogisticsView,
  "molela-terracotta-rajasthan-logistics": MolelaTerracottaRajasthanLogisticsView,
  "sungudi-saree-tamil-nadu-logistics": SungudiSareeTamilNaduLogisticsView,
  "pembarthi-metal-craft-telangana-logistics": PembarthiMetalCraftTelanganaLogisticsView,
  "rogan-art-gujarat-logistics": RoganArtGujaratLogisticsView,
  "pichwai-rajasthan-logistics": PichwaiRajasthanLogisticsView,
  "warli-maharashtra-logistics": WarliMaharashtraLogisticsView,
  "gond-madhya-logistics": GondMadhyaLogisticsView,
  "kalighat-bengal-logistics": KalighatBengalLogisticsView,
  "cheriyal-scroll-art-telangana-logistics": CheriyalScrollArtTelanganaLogisticsView,
  "bagh-print-madhya-logistics": BaghPrintMadhyaLogisticsView,
  "bagru-block-print-rajasthan-logistics": BagruBlockPrintRajasthanLogisticsView,
  "kalamkari-pen-art-andhra-logistics": KalamkariPenArtAndhraLogisticsView,
  "dabu-print-rajasthan-logistics": DabuPrintRajasthanLogisticsView,
  "rogan-gujarat-logistics": RoganGujaratLogisticsView,
  "sanjhi-paper-cutting-up-logistics": SanjhiPaperCuttingUpLogisticsView,
  "meenakari-udaipur-rajasthan-logistics": MeenakariUdaipurRajasthanLogisticsView,
  "dhokra-chhattisgarh-logistics": DhokraChhattisgarhLogisticsView,
  "bidri-karnataka-logistics": BidriKarnatakaLogisticsView,
  "gond-art-madhya-pradesh-logistics": GondArtMadhyaPradeshLogisticsView,
  "madhubani-bihar-logistics": MadhubaniBiharLogisticsView,
  "kalamkari-andhra-logistics": KalamkariAndhraLogisticsView,
  "patola-gujarat-logistics": PatolaGujaratLogisticsView,
  "kasuti-karnataka-logistics": KasutiKarnatakaLogisticsView,
  "banjara-embroidery-telangana-logistics": BanjaraEmbroideryTelanganaLogisticsView,
  "chanderi-madhya-pradesh-logistics": ChanderiMadhyaPradeshLogisticsView,
  "phulkari-embroidery-punjab-logistics": PhulkariEmbroideryPunjabLogisticsView,
  "tarakasi-silver-filigree-odisha-logistics": TarakasiSilverFiligreeOdishaLogisticsView,
  "ajrakh-block-print-kutch-logistics": AjrakhBlockPrintKutchLogisticsView,
  "pattachitra-west-bengal-logistics": PattachitraWestBengalLogisticsView,
  "pithora-tribal-art-chhattisgarh-logistics": PithoraTribalArtChhattisgarhLogisticsView,
  "warehouse-energy-analytics": WarehouseEnergyAnalyticsView,
  "route-intelligence-hub": RouteIntelligenceHubView,
  "driver-performance-hub": DriverPerformanceHubView,
  "load-optimization-command": LoadOptimizationCommandView,
  "warehouse-lifecycle-tracker": WarehouseLifecycleTrackerView,
  "returns-quality-assessment": ReturnsQualityAssessmentView,
  "port-vessel-tracker": PortVesselTrackerView,
  "smart-packaging-intelligence": SmartPackagingIntelligenceView,
  "freight-booking-command": FreightBookingCommandView,
  "warehouse-shuttle-ops": WarehouseShuttleOpsView,
  "transport-rate-intelligence": TransportRateIntelligenceView,
  "vehicle-inspection-compliance": VehicleInspectionComplianceView,
  "fastag-toll-intelligence": FastagTollIntelligenceView,
  "warehouse-labour-workforce-analytics": WarehouseLabourWorkforceAnalyticsView,
  "gst-invoice-e-invoicing-command": GstInvoiceEInvoicingCommandView,
  "freight-invoice-reconciliation": FreightInvoiceReconciliationView,
  "icd-container-yard-intelligence": IcdContainerYardIntelligenceView,
  "warehouse-space-capacity-planner": WarehouseSpaceCapacityPlannerView,
  "shipment-tracking-milestone": ShipmentTrackingMilestoneView,
  "transit-insurance-claims": TransitInsuranceClaimsView,
  "eway-bill-expiry-tracker": EwayBillExpiryTrackerView,
  "inland-container-depot-command": InlandContainerDepotCommandView,
  "freight-forwarding-command": FreightForwardingCommandView,
  "coastal-shipping-waterway": CoastalShippingWaterwayView,
  "fmcg-superstockist-network": FmcgSuperstockistNetworkView,
  "automotive-logistics-command": AutomotiveLogisticsCommandView,
  "air-cargo-terminal": AirCargoTerminalView,
  "agri-warehousing-command": AgriWarehousingCommandView,
  "railway-freight-terminal": RailwayFreightTerminalView,
  "pharma-cold-chain": PharmaColdChainView,
  "cement-logistics-command": CementLogisticsCommandView,
  "mining-logistics-command": MiningLogisticsCommandView,
  "petroleum-pipeline-command": PetroleumPipelineCommandView,
  "steel-logistics-command": SteelLogisticsCommandView,
  "grain-silo-logistics": GrainSiloLogisticsView,
  "defense-supply-command": DefenseSupplyCommandView,
  "river-waterway-logistics": RiverWaterwayLogisticsView,
  "express-parcel-logistics": ExpressParcelLogisticsView,
  "metro-rail-logistics": MetroRailLogisticsView,
  "quick-commerce-logistics": QuickCommerceLogisticsView,
  "lpg-distribution-logistics": LpgDistributionLogisticsView,
  "e-waste-recycling-logistics": EWasteRecyclingLogisticsView,
  "dairy-farm-logistics": DairyFarmLogisticsView,
  "textile-mill-logistics": TextileMillLogisticsView,
  "fmcg-distribution-logistics": FmcgDistributionLogisticsView,
  "cement-blend-logistics": CementBlendLogisticsView,
  "newsprint-publishing-logistics": NewsprintPublishingLogisticsView,
  "steel-scrap-recycling-logistics": SteelScrapRecyclingLogisticsView,
  "courier-express-logistics": CourierExpressLogisticsView,
  "petroleum-tank-farm-logistics": PetroleumTankFarmLogisticsView,
  "mining-equipment-logistics": MiningEquipmentLogisticsView,
  "inland-waterway-logistics": InlandWaterwayLogisticsView,
  "railway-freight-logistics": RailwayFreightLogisticsView,
  "aerospace-parts-logistics": AerospacePartsLogisticsView,
  "defence-ordnance-logistics": DefenceOrdnanceLogisticsView,
  "cold-chain-pharma-logistics": ColdChainPharmaLogisticsView,
  "metro-rail-operations-logistics": MetroRailOperationsLogisticsView,
  "telecom-tower-logistics": TelecomTowerLogisticsView,
  "oversize-odc-transport-logistics": OversizeOdcTransportLogisticsView,
  "parcel-sortation-logistics": ParcelSortationLogisticsView,
  "pipeline-integrity-logistics": PipelineIntegrityLogisticsView,
  "solar-panel-recycling-logistics": SolarPanelRecyclingLogisticsView,
  "port-terminal-operations-logistics": PortTerminalOperationsLogisticsView,
  "ev-battery-recycling-logistics": EvBatteryRecyclingLogisticsView,
  "inland-waterways-logistics": InlandWaterwaysLogisticsView,
  "hsr-logistics": HsrLogisticsView,
  "data-center-cooling-logistics": DataCenterCoolingLogisticsView,
  "space-launch-logistics": SpaceLaunchLogisticsView,
  "defense-logistics": DefenseLogisticsView,
  "aviation-ground-handling": AviationGroundHandlingLogisticsView,
  "smart-city-logistics": SmartCityLogisticsView,
  "smart-grid-power": SmartGridPowerLogisticsView,
  "subsea-cable-laying": SubseaCableLayingLogisticsView,
  "green-hydrogen-energy": GreenHydrogenEnergyLogisticsView,
  "semiconductor-fab": SemiconductorFabLogisticsView,
  "offshore-wind": OffshoreWindLogisticsView,
  "lithium-battery-cell": LithiumBatteryCellLogisticsView,
  "nuclear-power-plant": NuclearPowerPlantLogisticsView,
  "electric-bus-fleet": ElectricBusFleetLogisticsView,
  "solar-farm-construction": SolarFarmConstructionLogisticsView,
  "waste-to-energy-plant": WasteToEnergyPlantLogisticsView,
  "hydroelectric-dam-construction": HydroelectricDamConstructionLogisticsView,
  "tunnel-boring-machine": TunnelBoringMachineLogisticsView,
  "lng-terminal": LngTerminalLogisticsView,
  "monorail-system": MonorailSystemLogisticsView,
  "drone-delivery": DroneDeliveryLogisticsView,
  "cable-car-ropeway": CableCarRopewayLogisticsView,
  "bridge-construction": BridgeConstructionLogisticsView,
  "desalination-plant": DesalinationPlantLogisticsView,
  "solar-thermal-csp": SolarThermalCspLogisticsView,
  "biomass-power-plant": BiomassPowerPlantLogisticsView,
  "hydrogen-production-facility": HydrogenProductionFacilityLogisticsView,
  "flyover-interchange": FlyoverInterchangeLogisticsView,
  "port-container-terminal": PortContainerTerminalLogisticsView,
  "submarine-tunnel": SubmarineTunnelLogisticsView,
  "supercapacitor-energy-storage": SupercapacitorEnergyStorageLogisticsView,
  "offshore-wind-installation": OffshoreWindInstallationLogisticsView,
  "superconducting-cable-transmission": SuperconductingCableTransmissionLogisticsView,
  "deep-water-drilling-platform": DeepWaterDrillingPlatformLogisticsView,
  "nuclear-power-plant-construction": NuclearPowerPlantConstructionLogisticsView,
  "satellite-launch-complex": SatelliteLaunchComplexLogisticsView,
  "quantum-communication-network": QuantumCommunicationNetworkLogisticsView,
  "space-debris-removal": SpaceDebrisRemovalLogisticsView,
  "solid-state-battery-manufacturing": SolidStateBatteryManufacturingLogisticsView,
  "green-ammonia-production": GreenAmmoniaProductionLogisticsView,
  "fusion-energy-reactor": FusionEnergyReactorLogisticsView,
  "ocean-wave-energy": OceanWaveEnergyLogisticsView,
  "direct-air-capture": DirectAirCaptureLogisticsView,
  "floating-solar-farm": FloatingSolarFarmLogisticsView,
  "hydrogen-fuel-station": HydrogenFuelStationLogisticsView,
  "carbon-nanotube-production": CarbonNanotubeProductionLogisticsView,
  "graphene-production": GrapheneProductionLogisticsView,
  "geothermal-energy": GeothermalEnergyLogisticsView,
  "autonomous-vehicle": AutonomousVehicleLogisticsView,
  "perovskite-solar-cell-manufacturing": PerovskiteSolarCellManufacturingLogisticsView,
  "hydrogen-fuel-cell-stack": HydrogenFuelCellStackLogisticsView,
  "vanadium-redox-flow-battery": VanadiumRedoxFlowBatteryLogisticsView,
  "solid-oxide-electrolyzer": SolidOxideElectrolyzerLogisticsView,
  "nuclear-smr": NuclearSmrLogisticsView,
  "lithium-extraction": LithiumExtractionLogisticsView,
  "carbon-capture-storage": CarbonCaptureStorageLogisticsView,
  "green-methanol": GreenMethanolLogisticsView,
  "ammonia-cracking": AmmoniaCrackingLogisticsView,
  "space-launch-vehicle": SpaceLaunchVehicleLogisticsView,
  "biojet-fuel": BiojetFuelLogisticsView,
  "rare-earth-minerals": RareEarthMineralsLogisticsView,
  "hydrogen-pipeline": HydrogenPipelineLogisticsView,
  "carbon-trading": CarbonTradingLogisticsView,
  "deep-sea-mining": DeepSeaMiningLogisticsView,
  "biochar": BiocharLogisticsView,
  "hydrogen-storage": HydrogenStorageLogisticsView,
  "plasma-gasification": PlasmaGasificationLogisticsView,
  "carbon-capture-utilization": CarbonCaptureUtilizationLogisticsView,
  "electric-ferry": ElectricFerryLogisticsView,
  "microgrid-management": MicrogridManagementLogisticsView,
  "molten-salt-storage": MoltenSaltStorageLogisticsView,
  "green-steel": GreenSteelLogisticsView,
  "wind-turbine-blade-recycling": WindTurbineBladeRecyclingLogisticsView,
  "smart-grid-os": SmartGridOSLogisticsView,
  "sludge-to-energy": SludgeToEnergyLogisticsView,
  "smart-city-resilience-hub": SmartCityResilienceHubLogisticsView,
  "urban-canopy-microclimate": UrbanCanopyMicroclimateLogisticsView,
  "industrial-heat-decarbonization": IndustrialHeatDecarbonizationLogisticsView,
  "urban-cool-island-creation": UrbanCoolIslandCreationLogisticsView,
  "digital-twin-water-infrastructure": DigitalTwinWaterInfrastructureLogisticsView,
  "bio-jet-fuel-logistics": BioJetFuelLogisticsView,
  "ev-charging-hub-logistics": EVChargingHubLogisticsView,
  "hydrogen-blending-network-logistics": HydrogenBlendingNetworkLogisticsView,
  "agrivoltaics-logistics": AgrivoltaicsLogisticsView,
  "autonomous-port-logistics": AutonomousPortLogisticsView,
  "quantum-computing-logistics": QuantumComputingLogisticsView,
  "carbon-sequestration-logistics": CarbonSequestrationLogisticsView,
  "green-cement-logistics": GreenCementLogisticsView,
  "ai-chip-logistics": AIChipLogisticsView,
  "ev-battery-swapping": EVBatterySwappingView,
  "ocean-energy": OceanEnergyView,
  "hyperloop-logistics": HyperloopLogisticsView,
  "urban-air-mobility": UrbanAirMobilityView,
  "green-ammonia-logistics": GreenAmmoniaLogisticsView,
  "carbon-trading-platform": CarbonTradingPlatformView,
  "railway-electrification": RailwayElectrificationView,
  "satellite-iot-logistics": SatelliteIotLogisticsView,
  "plasma-arc-recycling": PlasmaArcRecyclingView,
  "green-roof-infrastructure": GreenRoofInfrastructureView,
  "waste-heat-recovery": WasteHeatRecoveryView,
  "floating-offshore-wind": FloatingOffshoreWindView,
  "biomass-gasification-logistics": BiomassGasificationLogisticsView,
  "underground-energy-storage": UndergroundEnergyStorageView,
  "tidal-energy-logistics": TidalEnergyLogisticsView,
  "hydrogen-refueling-logistics": HydrogenRefuelingLogisticsView,
  "ev-telematics-platform": EVTelematicsPlatformView,
  "urban-mining-logistics": UrbanMiningLogisticsView,
  "smart-campus-logistics": SmartCampusLogisticsView,
  "nano-material-logistics": NanoMaterialLogisticsView,
  "bio-plastic-logistics": BioPlasticLogisticsView,
  "vertical-farm-logistics": VerticalFarmLogisticsView,
  "carbon-fiber-logistics": CarbonFiberLogisticsView,
  "phase-change-material-logistics": PhaseChangeMaterialLogisticsView,
  "piezoelectric-energy-logistics": PiezoelectricEnergyLogisticsView,
  "flywheel-energy-storage": FlywheelEnergyStorageView,
  "thermo-electric-logistics": ThermoElectricLogisticsView,
  "direct-lithium-extraction-logistics": DirectLithiumExtractionLogisticsView,
  "iron-air-battery-logistics": IronAirBatteryLogisticsView,
  "gravity-energy-storage": GravityEnergyStorageView,
  "compressed-air-energy-storage": CompressedAirEnergyStorageView,
  "hydrogen-liquefaction-logistics": HydrogenLiquefactionLogisticsView,
  "mycelium-logistics": MyceliumLogisticsView,
  "sodium-ion-logistics": SodiumIonLogisticsView,
  "neodymium-magnet-logistics": NeodymiumMagnetLogisticsView,
  "manganese-sulphate-logistics": ManganeseSulphateLogisticsView,
  "cobalt-free-battery-logistics": CobaltFreeBatteryLogisticsView,
  "solid-state-cooling-logistics": SolidStateCoolingLogisticsView,
  "smart-textile-logistics": SmartTextileLogisticsView,
  "e-fuel-logistics": EFuelLogisticsView,
  "bio-methane-logistics": BioMethaneLogisticsView,
  "vanadium-electrolyte-logistics": VanadiumElectrolyteLogisticsView,
  "silicon-anode-logistics": SiliconAnodeLogisticsView,
  "potassium-ion-battery-logistics": PotassiumIonBatteryLogisticsView,
  "aluminium-air-battery-logistics": AluminiumAirBatteryLogisticsView,
  "syngas-logistics": SyngasLogisticsView,
  "methanol-fuel-logistics": MethanolFuelLogisticsView,
  "graphene-battery-logistics": GrapheneBatteryLogisticsView,
  "titanium-alloy-logistics": TitaniumAlloyLogisticsView,
  "green-ammonia-shipping-logistics": GreenAmmoniaShippingLogisticsView,
  "fuel-cell-truck-logistics": FuelCellTruckLogisticsView,
  "aramid-fiber-logistics": AramidFiberLogisticsView,
  "silicon-carbide-logistics": SiliconCarbideLogisticsView,
  "vaccine-cold-chain-logistics": VaccineColdChainLogisticsView,
  "gallium-nitride-logistics": GalliumNitrideLogisticsView,
  "drone-delivery-medical-logistics": DroneDeliveryMedicalLogisticsView,
  "tungsten-carbide-logistics": TungstenCarbideLogisticsView,
  "hemp-fiber-logistics": HempFiberLogisticsView,
  "silicon-photonics-logistics": SiliconPhotonicsLogisticsView,
  "beryllium-copper-logistics": BerylliumCopperLogisticsView,
  "diamond-synthetic-logistics": DiamondSyntheticLogisticsView,
  "rare-earth-magnet-logistics": RareEarthMagnetLogisticsView,
  "molybdenum-alloy-logistics": MolybdenumAlloyLogisticsView,
  "indium-phosphide-logistics": IndiumPhosphideLogisticsView,
  "cobalt-alloy-logistics": CobaltAlloyLogisticsView,
  "magnesium-alloy-logistics": MagnesiumAlloyLogisticsView,
  "tantalum-capacitor-logistics": TantalumCapacitorLogisticsView,
  "gallium-arsenide-logistics": GalliumArsenideLogisticsView,
  "hafnium-alloy-logistics": HafniumAlloyLogisticsView,
  "zirconia-ceramic-logistics": ZirconiaCeramicLogisticsView,
  "scandium-alloy-logistics": ScandiumAlloyLogisticsView,
  "nickel-superalloy-logistics": NickelSuperalloyLogisticsView,
  "titanium-sponge-logistics": TitaniumSpongeLogisticsView,
  "boron-carbide-logistics": BoronCarbideLogisticsView,
  "niobium-alloy-logistics": NiobiumAlloyLogisticsView,
  "platinum-group-metal-logistics": PlatinumGroupMetalLogisticsView,
  "vanadium-alloy-logistics": VanadiumAlloyLogisticsView,
  "silicon-nitride-logistics": SiliconNitrideLogisticsView,
  "palladium-catalyst-logistics": PalladiumCatalystLogisticsView,
  "tungsten-heavy-alloy-logistics": TungstenHeavyAlloyLogisticsView,
  "graphite-electrode-logistics": GraphiteElectrodeLogisticsView,
  "manganese-alloy-logistics": ManganeseAlloyLogisticsView,
  "silver-paste-logistics": SilverPasteLogisticsView,
  "silicon-metal-logistics": SiliconMetalLogisticsView,
  "rare-gas-logistics": RareGasLogisticsView,
  "carbon-brush-logistics": CarbonBrushLogisticsView,
  "alumina-ceramic-logistics": AluminaCeramicLogisticsView,
  "chromium-alloy-logistics": ChromiumAlloyLogisticsView,
  "zirconium-alloy-logistics": ZirconiumAlloyLogisticsView,
  "lithium-refining-logistics": LithiumRefiningLogisticsView,
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
import CarbonCaptureUtilizationLogisticsView from "@/components/modules/carbon-capture-utilization-logistics-view"
import ElectricFerryLogisticsView from "@/components/modules/electric-ferry-logistics-view"
import MicrogridManagementLogisticsView from "@/components/modules/microgrid-management-logistics-view"
import MoltenSaltStorageLogisticsView from "@/components/modules/molten-salt-storage-logistics-view"
import GreenSteelLogisticsView from "@/components/modules/green-steel-logistics-view"
import WindTurbineBladeRecyclingLogisticsView from "@/components/modules/wind-turbine-blade-recycling-logistics-view"
import IndustrialHeatDecarbonizationLogisticsView from "@/components/modules/industrial-heat-decarbonization-logistics-view"
import UrbanCoolIslandCreationLogisticsView from "@/components/modules/urban-cool-island-creation-logistics-view"
import DigitalTwinWaterInfrastructureLogisticsView from "@/components/modules/digital-twin-water-infrastructure-logistics-view"
import BioJetFuelLogisticsView from "@/components/modules/bio-jet-fuel-logistics-view"
import EVChargingHubLogisticsView from "@/components/modules/ev-charging-hub-logistics-view"
import HydrogenBlendingNetworkLogisticsView from "@/components/modules/hydrogen-blending-network-logistics-view"
import AgrivoltaicsLogisticsView from "@/components/modules/agrivoltaics-logistics-view"
import AutonomousPortLogisticsView from "@/components/modules/autonomous-port-logistics-view"
import QuantumComputingLogisticsView from "@/components/modules/quantum-computing-logistics-view"
import CarbonSequestrationLogisticsView from "@/components/modules/carbon-sequestration-logistics-view"
import GreenCementLogisticsView from "@/components/modules/green-cement-logistics-view"
import AIChipLogisticsView from "@/components/modules/ai-chip-logistics-view"
import EVBatterySwappingView from "@/components/modules/ev-battery-swapping-view"
import OceanEnergyView from "@/components/modules/ocean-energy-view"
import HyperloopLogisticsView from "@/components/modules/hyperloop-logistics-view"
import UrbanAirMobilityView from "@/components/modules/urban-air-mobility-view"
import GreenAmmoniaLogisticsView from "@/components/modules/green-ammonia-logistics-view"
import CarbonTradingPlatformView from "@/components/modules/carbon-trading-platform-view"
import RailwayElectrificationView from "@/components/modules/railway-electrification-view"
import SatelliteIotLogisticsView from "@/components/modules/satellite-iot-logistics-view"
import PlasmaArcRecyclingView from "@/components/modules/plasma-arc-recycling-view"
import GreenRoofInfrastructureView from "@/components/modules/green-roof-infrastructure-view"
import WasteHeatRecoveryView from "@/components/modules/waste-heat-recovery-view"
import FloatingOffshoreWindView from "@/components/modules/floating-offshore-wind-view"
import BiomassGasificationLogisticsView from "@/components/modules/biomass-gasification-logistics-view"
import UndergroundEnergyStorageView from "@/components/modules/underground-energy-storage-view"
import HydrogenRefuelingLogisticsView from "@/components/modules/hydrogen-refueling-logistics-view"
import EVTelematicsPlatformView from "@/components/modules/ev-telematics-platform-view"
import UrbanMiningLogisticsView from "@/components/modules/urban-mining-logistics-view"
import SmartCampusLogisticsView from "@/components/modules/smart-campus-logistics-view"
import NanoMaterialLogisticsView from "@/components/modules/nano-material-logistics-view"
import BioPlasticLogisticsView from "@/components/modules/bio-plastic-logistics-view"
import VerticalFarmLogisticsView from "@/components/modules/vertical-farm-logistics-view"
import SmartCityResilienceHubLogisticsView from "@/components/modules/smart-city-resilience-hub-logistics-view"
import UrbanCanopyMicroclimateLogisticsView from "@/components/modules/urban-canopy-microclimate-logistics-view"
import SmartGridOSLogisticsView from "@/components/modules/smart-grid-os-logistics-view"
import SludgeToEnergyLogisticsView from "@/components/modules/sludge-to-energy-logistics-view"
import CarbonFiberLogisticsView from "@/components/modules/carbon-fiber-logistics-view"
import PhaseChangeMaterialLogisticsView from "@/components/modules/phase-change-material-logistics-view"
import PiezoelectricEnergyLogisticsView from "@/components/modules/piezoelectric-energy-logistics-view"
import FlywheelEnergyStorageView from "@/components/modules/flywheel-energy-storage-view"
import ThermoElectricLogisticsView from "@/components/modules/thermo-electric-logistics-view"
import DirectLithiumExtractionLogisticsView from "@/components/modules/direct-lithium-extraction-logistics-view"
import IronAirBatteryLogisticsView from "@/components/modules/iron-air-battery-logistics-view"
import GravityEnergyStorageView from "@/components/modules/gravity-energy-storage-view"
import CompressedAirEnergyStorageView from "@/components/modules/compressed-air-energy-storage-view"
import HydrogenLiquefactionLogisticsView from "@/components/modules/hydrogen-liquefaction-logistics-view"
import MyceliumLogisticsView from "@/components/modules/mycelium-logistics-view"
import SodiumIonLogisticsView from "@/components/modules/sodium-ion-logistics-view"
import NeodymiumMagnetLogisticsView from "@/components/modules/neodymium-magnet-logistics-view"
import ManganeseSulphateLogisticsView from "@/components/modules/manganese-sulphate-logistics-view"
import CobaltFreeBatteryLogisticsView from "@/components/modules/cobalt-free-battery-logistics-view"
import SolidStateCoolingLogisticsView from "@/components/modules/solid-state-cooling-logistics-view"
import SmartTextileLogisticsView from "@/components/modules/smart-textile-logistics-view"
import EFuelLogisticsView from "@/components/modules/e-fuel-logistics-view"
import BioMethaneLogisticsView from "@/components/modules/bio-methane-logistics-view"
import VanadiumElectrolyteLogisticsView from "@/components/modules/vanadium-electrolyte-logistics-view"
import SiliconAnodeLogisticsView from "@/components/modules/silicon-anode-logistics-view"
import PotassiumIonBatteryLogisticsView from "@/components/modules/potassium-ion-battery-logistics-view"
import AluminiumAirBatteryLogisticsView from "@/components/modules/aluminium-air-battery-logistics-view"
import SyngasLogisticsView from "@/components/modules/syngas-logistics-view"
import MethanolFuelLogisticsView from "@/components/modules/methanol-fuel-logistics-view"
import GrapheneBatteryLogisticsView from "@/components/modules/graphene-battery-logistics-view"
import TitaniumAlloyLogisticsView from "@/components/modules/titanium-alloy-logistics-view"
import GreenAmmoniaShippingLogisticsView from "@/components/modules/green-ammonia-shipping-logistics-view"
import FuelCellTruckLogisticsView from "@/components/modules/fuel-cell-truck-logistics-view"
import AramidFiberLogisticsView from "@/components/modules/aramid-fiber-logistics-view"
import SiliconCarbideLogisticsView from "@/components/modules/silicon-carbide-logistics-view"
import VaccineColdChainLogisticsView from "@/components/modules/vaccine-cold-chain-logistics-view"
import GalliumNitrideLogisticsView from "@/components/modules/gallium-nitride-logistics-view"
import DroneDeliveryMedicalLogisticsView from "@/components/modules/drone-delivery-medical-logistics-view"
import TungstenCarbideLogisticsView from "@/components/modules/tungsten-carbide-logistics-view"
import HempFiberLogisticsView from "@/components/modules/hemp-fiber-logistics-view"
import SiliconPhotonicsLogisticsView from "@/components/modules/silicon-photonics-logistics-view"
import BerylliumCopperLogisticsView from "@/components/modules/beryllium-copper-logistics-view"
import DiamondSyntheticLogisticsView from "@/components/modules/diamond-synthetic-logistics-view"
import RareEarthMagnetLogisticsView from "@/components/modules/rare-earth-magnet-logistics-view"
import MolybdenumAlloyLogisticsView from "@/components/modules/molybdenum-alloy-logistics-view"
import IndiumPhosphideLogisticsView from "@/components/modules/indium-phosphide-logistics-view"
import CobaltAlloyLogisticsView from "@/components/modules/cobalt-alloy-logistics-view"
import MagnesiumAlloyLogisticsView from "@/components/modules/magnesium-alloy-logistics-view"
import TantalumCapacitorLogisticsView from "@/components/modules/tantalum-capacitor-logistics-view"
import GalliumArsenideLogisticsView from "@/components/modules/gallium-arsenide-logistics-view"
import HafniumAlloyLogisticsView from "@/components/modules/hafnium-alloy-logistics-view"
import ZirconiaCeramicLogisticsView from "@/components/modules/zirconia-ceramic-logistics-view"
import ScandiumAlloyLogisticsView from "@/components/modules/scandium-alloy-logistics-view"
import NickelSuperalloyLogisticsView from "@/components/modules/nickel-superalloy-logistics-view"
import TitaniumSpongeLogisticsView from "@/components/modules/titanium-sponge-logistics-view"
import BoronCarbideLogisticsView from "@/components/modules/boron-carbide-logistics-view"
import NiobiumAlloyLogisticsView from "@/components/modules/niobium-alloy-logistics-view"
import PlatinumGroupMetalLogisticsView from "@/components/modules/platinum-group-metal-logistics-view"
import VanadiumAlloyLogisticsView from "@/components/modules/vanadium-alloy-logistics-view"
import SiliconNitrideLogisticsView from "@/components/modules/silicon-nitride-logistics-view"
import PalladiumCatalystLogisticsView from "@/components/modules/palladium-catalyst-logistics-view"
import TungstenHeavyAlloyLogisticsView from "@/components/modules/tungsten-heavy-alloy-logistics-view"
import GraphiteElectrodeLogisticsView from "@/components/modules/graphite-electrode-logistics-view"
import ManganeseAlloyLogisticsView from "@/components/modules/manganese-alloy-logistics-view"
import SilverPasteLogisticsView from "@/components/modules/silver-paste-logistics-view"
import SiliconMetalLogisticsView from "@/components/modules/silicon-metal-logistics-view"
import RareGasLogisticsView from "@/components/modules/rare-gas-logistics-view"
import CarbonBrushLogisticsView from "@/components/modules/carbon-brush-logistics-view"
import AluminaCeramicLogisticsView from "@/components/modules/alumina-ceramic-logistics-view"
import ChromiumAlloyLogisticsView from "@/components/modules/chromium-alloy-logistics-view"
import ZirconiumAlloyLogisticsView from "@/components/modules/zirconium-alloy-logistics-view"
import LithiumRefiningLogisticsView from "@/components/modules/lithium-refining-logistics-view"
