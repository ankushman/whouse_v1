import { create } from 'zustand'
import type { Role, NavItem } from '@/types'

export type { Role, NavItem }

export const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'operations-overview', label: 'Operations Overview', icon: 'Activity', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager'] },
  { id: 'warehouses', label: 'Warehouses', icon: 'Warehouse', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'inbound', label: 'Inbound', icon: 'PackageSearch', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'procurement-purchase-orders', label: 'Procurement / PO', icon: 'ShoppingCart', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'bill-of-materials', label: 'BOM Management', icon: 'Layers', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'quality-inspection-plan', label: 'Quality Inspection', icon: 'Microscope', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'non-conformance-report', label: 'NCR / CAPA', icon: 'FileWarning', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'work-order-management', label: 'Work Orders', icon: 'ClipboardList', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'production-schedule', label: 'Prod. Schedule', icon: 'CalendarRange', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'production-cost-variance', label: 'Cost Variance', icon: 'Calculator', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'inventory-valuation', label: 'Inventory Valuation', icon: 'Landmark', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'demand-forecasting', label: 'Demand Forecasting', icon: 'Brain', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'outbound', label: 'Outbound', icon: 'Truck', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'returns-reverse-logistics', label: 'Returns & Reverse', icon: 'RotateCcw', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'inventory', label: 'Inventory', icon: 'Package', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'inventory-replenishment', label: 'MRP Replenishment', icon: 'Boxes', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'transportation', label: 'Transportation', icon: 'Route', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'route-optimization', label: 'Route Optimization', icon: 'Navigation', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'warehouse-map', label: 'Warehouse Map', icon: 'MapPin', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'equipment', label: 'Equipment', icon: 'Cog', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'employees', label: 'Employees', icon: 'Users', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'vendor-management', label: 'Vendor Management', icon: 'Factory', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'customer-sla-performance', label: 'Customer SLA', icon: 'Trophy', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'supplier-quality-scorecard', label: 'Supplier Quality', icon: 'ClipboardCheck', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'supplier-corrective-action-request', label: 'SCAR / 8D', icon: 'Mail', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'productivity', label: 'Productivity', icon: 'TrendingUp', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'cost-analytics', label: 'Cost Analytics', icon: 'DollarSign', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager'] },
  { id: 'predictive-analytics', label: 'Predictive Analytics', icon: 'Brain', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager'] },
  { id: 'energy-sustainability', label: 'Energy & ESG', icon: 'Leaf', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager'] },
  { id: 'esg-sustainability-audit', label: 'ESG Audit', icon: 'Globe', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager'] },
  { id: 'continual-improvement', label: 'Continual Improvement', icon: 'Rocket', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager'] },
  { id: 'fixed-asset-register', label: 'Fixed Assets', icon: 'Building', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager'] },
  { id: 'capacity-planning', label: 'Capacity Planning', icon: 'Gauge', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'supplier-audit', label: 'Supplier Audit', icon: 'FileSearch', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'warehouse-performance-scorecard', label: 'WH Performance', icon: 'Medal', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager'] },
  { id: 'three-way-match', label: '3-Way Match', icon: 'GitCompareArrows', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'vendor-contract-mgmt', label: 'Vendor Contracts', icon: 'FileText', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'safety-incident-mgmt', label: 'Safety & EHS', icon: 'ShieldAlert', group: 'system', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'fleet-maintenance', label: 'Fleet Maint.', icon: 'Wrench', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'cargo-damage-claims', label: 'Damage Claims', icon: 'PackageX', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'compliance-audit', label: 'Compliance & Audit', icon: 'ShieldCheck', group: 'system', roles: ['super_admin', 'executive', 'regional_manager'] },
  { id: 'alerts', label: 'Alerts', icon: 'Bell', badge: 5, group: 'system', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'dock-scheduler', label: 'Dock Scheduling', icon: 'LayoutGrid', group: 'system', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'yard-management', label: 'Yard Management', icon: 'ParkingCircle', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'cross-dock-transshipment', label: 'Cross-Dock Hub', icon: 'ArrowLeftRight', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'cold-chain-temp', label: 'Cold Chain', icon: 'ThermometerSnowflake', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'container-freight-station', label: 'CFS & Customs', icon: 'Container', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'hazmat-dangerous-goods', label: 'Hazmat & DG', icon: 'Flame', group: 'system', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'serial-number-tracking', label: 'Serial Tracking', icon: 'ScanBarcode', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'ecommerce-fulfillment', label: 'E-Commerce Fulfill', icon: 'ShoppingCart', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'packaging-standards', label: 'Packaging Specs', icon: 'Box', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'slotting-optimization', label: 'Slotting & Bins', icon: 'LayoutList', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'wave-planning', label: 'Wave Planning', icon: 'Waves', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'stock-transfer', label: 'Stock Transfer', icon: 'ArrowLeftRight', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'barcode-label', label: 'Barcode & Labels', icon: 'QrCode', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'cycle-count', label: 'Cycle Counting', icon: 'ClipboardCheck', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'returns-processing', label: 'Returns & Refund', icon: 'Undo2', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'putaway-management', label: 'Putaway Management', icon: 'PackagePlus', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'loading-dispatch', label: 'Loading & Dispatch', icon: 'Send', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'goods-receipt', label: 'Goods Receipt / GRN', icon: 'FileCheck', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'tally-integration', label: 'Tally Integration', icon: 'RefreshCw', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager'] },
  { id: 'kitting-assembly', label: 'Kitting & Assembly', icon: 'Puzzle', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'batch-lot', label: 'Batch & Lot Management', icon: 'Layers', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'consignment-stock', label: 'Consignment Stock', icon: 'Landmark', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'pool-distribution', label: 'Pool Distribution & Scheduling', icon: 'Gauge', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'third-party-logistics', label: '3PL Partners & Services', icon: 'Handshake', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'document-management', label: 'Document & Workflow', icon: 'ScrollText', group: 'system', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'multi-channel-fulfillment', label: 'Multi-Channel Fulfill', icon: 'LayoutGrid', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'quality-control', label: 'Quality Control & QC', icon: 'ShieldCheck', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'vehicle-fleet-transport', label: 'Fleet & Transport', icon: 'Bus', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'customer-service-resolution', label: 'Customer Service', icon: 'Headset', group: 'system', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'warehouse-analytics-bi', label: 'Analytics & BI', icon: 'BarChart3', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager'] },
  { id: 'returns-refund-analytics', label: 'Returns Analytics', icon: 'TrendingDown', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'pick-pack-optimization', label: 'Pick & Pack', icon: 'PackageCheck', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'freight-shipping-rate', label: 'Freight & Rates', icon: 'Anchor', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'dock-scheduling-yard', label: 'Dock & Yard', icon: 'DoorOpen', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'dangerous-goods-hazmat', label: 'HazMat Safety', icon: 'ShieldAlert', group: 'system', roles: ['super_admin', 'executive', 'warehouse_manager', 'supervisor'] },
  { id: 'customs-duty-gst', label: 'Customs & GST', icon: 'Landmark', group: 'system', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'pallet-container', label: 'Pallet & Container', icon: 'Box', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'returns-quality-inspection', label: 'Returns Quality', icon: 'RotateCcw', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'cod-payment-reconciliation', label: 'COD & Payments', icon: 'Banknote', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'warranty-guarantee', label: 'Warranty & Guarantee', icon: 'ShieldQuestion', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'insurance-claims', label: 'Insurance Claims', icon: 'ShieldPlus', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'last-mile-delivery', label: 'Last Mile Delivery', icon: 'MapPinCheck', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'multi-channel-integration', label: 'Multi-Channel Hub', icon: 'Globe', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'supplier-portal', label: 'Supplier Portal', icon: 'Handshake', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'hyperlocal-delivery', label: 'Hyperlocal Delivery', icon: 'Zap', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'carbon-footprint', label: 'Carbon Footprint', icon: 'Sprout', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'smart-locker-kiosk', label: 'Smart Locker & Kiosk', icon: 'LockKeyhole', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'warehouse-digital-twin', label: 'Digital Twin / IoT', icon: 'Building2', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'agv-fleet-management', label: 'AGV Fleet Management', icon: 'Bot', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'parcel-sorting-crossdock', label: 'Parcel Sorting & Cross-Dock', icon: 'GitFork', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'warehouse-safety-compliance', label: 'Safety & Compliance', icon: 'ShieldAlert', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'goods-to-person-picking', label: 'Goods-to-Person Picking', icon: 'ArrowRightLeft', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'value-added-services', label: 'Value-Added Services', icon: 'Sparkles', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'gate-security', label: 'Gate & Security', icon: 'ScanLine', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'yard-trucking-dock', label: 'Yard Trucking & Dock', icon: 'Waypoints', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'packaging-design-studio', label: 'Packaging Design Studio', icon: 'Palette', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'warehouse-labor-forecasting', label: 'Labor Forecasting', icon: 'BrainCircuit', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'returns-consolidation-hub', label: 'Returns Consolidation', icon: 'RotateCcw', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: '3pl-performance-scorecard', label: '3PL Scorecard', icon: 'Award', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'quality-inspection-automation', label: 'Inspection Automation', icon: 'Thermometer', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'supplier-risk-management', label: 'Supplier Risk', icon: 'ShieldAlert', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'procurement'] },
  { id: 'predictive-demand-forecasting', label: 'Demand Forecasting AI', icon: 'ChartSpline', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'demand_planner'] },
  { id: 'logistics-network-optimization', label: 'Network Optimization', icon: 'ChartNetwork', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics'] },
  { id: 'contract-compliance-automation', label: 'Contract Compliance', icon: 'ClipboardCheck', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'procurement'] },
  { id: 'last-mile-delivery-analytics', label: 'Last Mile Analytics', icon: 'Route', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics'] },
  { id: 'returns-processing-enhancement', label: 'Returns Processing', icon: 'Recycle', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'cold-chain-monitoring', label: 'Cold Chain Monitor', icon: 'ThermometerSnowflake', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'packaging-optimization', label: 'Packaging Optimization', icon: 'Package', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'procurement'] },
  { id: 'load-planning-optimization', label: 'Load Planning', icon: 'Weight', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor'] },
  { id: 'freight-lane-management', label: 'Freight Lane Mgmt', icon: 'Route', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics'] },
  { id: 'customs-duty-optimization', label: 'Customs & Duty', icon: 'Landmark', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'procurement'] },
  { id: 'intermodal-transport-hub', label: 'Intermodal Hub', icon: 'Network', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'operator'] },
  { id: 'warehouse-energy-management', label: 'Energy Management', icon: 'Zap', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'operator'] },
  { id: 'cargo-insurance-claims', label: 'Insurance & Claims', icon: 'Scale', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'procurement', 'logistics'] },
  { id: 'port-community-system', label: 'Port Community System', icon: 'Ship', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'procurement', 'logistics'] },
  { id: 'dedicated-freight-corridor', label: 'Freight Corridor', icon: 'TrainFront', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'logistics', 'operator'] },
  { id: 'maritime-cargo-security', label: 'Maritime Security', icon: 'Radar', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'procurement', 'logistics'] },
  { id: 'cold-chain-compliance', label: 'Cold Chain Compliance', icon: 'TestTubes', group: 'system', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'customs-duty-refund', label: 'Customs Duty Refund', icon: 'Gavel', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'procurement'] },
  { id: 'export-documentation-lc', label: 'Export Docs & LC', icon: 'FileCheck2', group: 'system', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'procurement'] },
  { id: 'freight-audit-payment', label: 'Freight Audit & Pay', icon: 'Receipt', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'procurement', 'operator'] },
  { id: 'labor-management', label: 'Labor Management', icon: 'HardHat', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'sla-countdown', label: 'SLA Countdown', icon: 'Timer', group: 'system', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'eway-bill-gst-compliance', label: 'E-Way Bill & GST', icon: 'ScrollText', group: 'system', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'procurement', 'logistics'] },
  { id: 'shift-handover', label: 'Shift Handover', icon: 'ArrowRightLeft', group: 'system', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'tally-integration-erp', label: 'Tally Integration & ERP', icon: 'RefreshCw', group: 'system', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'procurement'] },
  { id: 'warehouse-ops-command', label: 'Warehouse Operations Command', icon: 'LayoutDashboard', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'shift_lead'] },
  { id: 'inventory-aging-obsolescence', label: 'Inventory Aging & Obsolescence', icon: 'Hourglass', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'procurement', 'finance'] },
  { id: 'demurrage-detention-mgmt', label: 'Demurrage & Detention', icon: 'Anchor', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'procurement', 'logistics', 'finance'] },
  { id: 'multi-warehouse-rebalance', label: 'Multi-WH Rebalancing', icon: 'GitCompareArrows', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics'] },
  { id: 'multi-modal-transport-corridor', label: 'Multi-Modal Transport', icon: 'Route', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'procurement'] },
  { id: 'drayage-first-mile', label: 'Drayage & First-Mile', icon: 'Container', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'procurement', 'shift_lead'] },
  { id: 'chassis-pool-mgmt', label: 'Chassis Pool Mgmt', icon: 'Layers', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'procurement', 'shift_lead'] },
  { id: 'dock-door-optimization', label: 'Dock Door Optimization', icon: 'DoorOpen', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'shift_lead'] },
  { id: 'yard-operations', label: 'Yard Trucking Enhancement', icon: 'Truck', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'shift_lead'] },
  { id: 'first-mile-collection', label: 'First-Mile Collection Hub', icon: 'MapPin', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'procurement', 'shift_lead'] },
  { id: 'last-mile-enhancement', label: 'Last-Mile Enhancement', icon: 'Bike', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'shift_lead'] },
  { id: 'supply-chain-visibility', label: 'Supply Chain Visibility', icon: 'Satellite', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'procurement'] },
  { id: 'cold-chain-enhancement', label: 'Cold Chain Enhancement', icon: 'ThermometerSnowflake', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'shift_lead'] },
  { id: 'cross-dock-optimization', label: 'Cross-Dock Optimization', icon: 'GitFork', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'shift_lead'] },
  { id: 'reverse-logistics-enhancement', label: 'Reverse Logistics Enhancement', icon: 'Recycle', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'shift_lead'] },
  { id: 'warehouse-automation', label: 'Warehouse Automation', icon: 'Bot', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'shift_lead'] },
  { id: 'smart-packaging-hub', label: 'Smart Packaging Hub', icon: 'PackagePlus', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'shift_lead'] },
  { id: 'logistics-ai-command', label: 'Logistics AI Command', icon: 'BrainCircuit', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics'] },
  { id: 'drone-delivery-hub', label: 'Drone Delivery Hub', icon: 'Send', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'shift_lead'] },
  { id: 'digital-freight-marketplace', label: 'Digital Freight Market', icon: 'Globe', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'procurement'] },
  { id: 'iot-sensor-dashboard', label: 'IoT Sensor Dashboard', icon: 'Radar', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'shift_lead'] },
  { id: '3pl-integration-hub', label: '3PL Integration Hub', icon: 'Network', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'procurement'] },
  { id: 'last-mile-customer-portal', label: 'Last-Mile Customer Portal', icon: 'Users', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'shift_lead'] },
  { id: 'cold-chain-monitor', label: 'Cold Chain Monitor', icon: 'ThermometerSnowflake', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor'] },
  { id: 'fleet-management-pro', label: 'Fleet Management Pro', icon: 'Truck', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'shift_lead'] },
  { id: 'cross-dock-operations-hub', label: 'Cross-Dock Hub', icon: 'GitFork', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'shift_lead'] },
  { id: 'customs-trade-compliance', label: 'Customs & Trade', icon: 'Gavel', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'finance'] },
  { id: 'returns-processing-center', label: 'Returns Center', icon: 'Recycle', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'ecommerce-fulfillment-hub', label: 'E-comm Fulfillment', icon: 'PackageCheck', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator', 'shift_lead'] },
  { id: 'warehouse-safety-management', label: 'Safety Management', icon: 'HardHat', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'shift_lead'] },
  { id: 'logistics-analytics-pro', label: 'Analytics Pro', icon: 'ChartSpline', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'finance', 'logistics'] },
  { id: 'multi-warehouse-operations', label: 'Multi-WH Ops', icon: 'Building2', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'transport-network-hub', label: 'Transport Network', icon: 'Network', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor'] },
  { id: 'wms-dashboard-pro', label: 'WMS Dashboard Pro', icon: 'LayoutGrid', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'supplier-intelligence-portal', label: 'Supplier Intelligence', icon: 'BrainCircuit', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'procurement', 'finance'] },
  { id: 'last-mile-optimization', label: 'Last-mile Optimize', icon: 'Navigation', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'shift_lead'] },
  { id: 'smart-locker-network', label: 'Smart Locker Net', icon: 'LockKeyhole', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'operator'] },
  { id: 'returns-quality-center', label: 'Returns Quality', icon: 'Microscope', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'finance', 'supervisor'] },
  { id: 'hyperlocal-fulfillment', label: 'Hyperlocal Fulfill', icon: 'MapPin', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'operator', 'shift_lead'] },
  { id: 'freight-lane-intelligence', label: 'Freight Lane Intel', icon: 'Route', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'finance', 'demand_planner'] },
  { id: 'omnichannel-returns-hub', label: 'Omnichannel Returns', icon: 'RotateCcw', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'operator', 'shift_lead'] },
  { id: 'autonomous-mobile-robots-fleet', label: 'AMR Fleet', icon: 'Bot', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'operator', 'shift_lead'] },
  { id: 'consignment-inventory-pro', label: 'Consignment Pro', icon: 'Archive', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'finance', 'supervisor'] },
  { id: 'logistics-control-tower', label: 'Control Tower', icon: 'MonitorSmartphone', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'operator', 'shift_lead'] },
  { id: 'warehouse-smart-picking', label: 'Smart Picking', icon: 'Crosshair', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'operator', 'shift_lead'] },
  { id: 'supply-chain-resilience-hub', label: 'Resilience Hub', icon: 'HeartPulse', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'procurement', 'finance'] },
  { id: 'logistics-procurement-command', label: 'Procurement Cmd', icon: 'Handshake', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'procurement', 'finance', 'supervisor'] },
  { id: 'warehouse-quality-command', label: 'Quality Command', icon: 'Microscope', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'operator', 'shift_lead'] },
  { id: 'wms-configuration-studio', label: 'WMS Studio', icon: 'Grid3x3', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor'] },
  { id: 'demand-sensing-ai', label: 'Demand Sensing AI', icon: 'BrainCircuit', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'demand_planner', 'procurement', 'finance', 'supervisor'] },
  { id: 'returns-prediction-engine', label: 'Returns Prediction', icon: 'Target', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'shift_lead'] },
  { id: 'supply-chain-digital-twin', label: 'Digital Twin', icon: 'Network', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'demand_planner', 'procurement', 'supervisor'] },
  { id: 'last-mile-optimization-pro', label: 'Last Mile Pro', icon: 'Navigation', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'shift_lead'] },
  { id: 'warehouse-automation-hub', label: 'Automation Hub', icon: 'Bot', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'operator'] },
  { id: 'logistics-carbon-tracker', label: 'Carbon Tracker', icon: 'Leaf', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor'] },
  { id: 'smart-dock-scheduler', label: 'Dock Scheduler', icon: 'Anchor', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'shift_lead'] },
  { id: 'logistics-ai-copilot', label: 'AI Copilot', icon: 'BrainCircuit', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'demand_planner', 'procurement', 'supervisor'] },
  { id: 'fleet-telematics-pro', label: 'Fleet Telematics', icon: 'Satellite', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'operator'] },
  { id: 'dynamic-pricing-engine', label: 'Dynamic Pricing', icon: 'Calculator', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'finance', 'procurement'] },
  { id: 'freight-lane-command', label: 'Freight Lane Cmd', icon: 'Workflow', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'shift_lead'] },
  { id: '3pl-partner-hub', label: '3PL Partner Hub', icon: 'Link', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'procurement', 'supervisor'] },
  { id: 'logistics-network-command', label: 'Network Command', icon: 'Wifi', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'shift_lead'] },
  { id: 'transport-analytics-pro', label: 'Transport Analytics', icon: 'Rss', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'operator'] },
  { id: 'smart-locker-fleet', label: 'Smart Locker Fleet', icon: 'KeyRound', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'operator'] },
  { id: 'cold-chain-monitor-pro', label: 'Cold Chain Monitor', icon: 'Refrigerator', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'operator'] },
  { id: 'cross-border-logistics', label: 'Cross-Border Hub', icon: 'Globe', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'operator'] },
  { id: 'warehouse-digital-floor-plan', label: 'Digital Floor Plan', icon: 'Grid2x2Plus', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'operator'] },
  { id: 'returns-quality-lab', label: 'Returns Quality Lab', icon: 'FlaskConical', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'operator'] },
  { id: 'port-operations-hub', label: 'Port Operations Hub', icon: 'Anchor', group: 'operations', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'logistics', 'supervisor', 'operator'] },
  { id: 'reports', label: 'Reports', icon: 'FileBarChart', group: 'system', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'settings', label: 'Settings', icon: 'Settings', group: 'system', roles: ['super_admin', 'executive'] },
]

export interface AppNotification {
  id: string
  title: string
  message: string
  severity: 'critical' | 'warning' | 'success' | 'info'
  warehouse?: string
  timestamp: number
  read: boolean
}

/**
 * Notification preferences with strict union types for enum-like fields.
 * This prevents typos like setNotifPrefs({ minSeverity: "warningg" }) at compile time.
 */
export type NotifFrequency = 'instant' | 'hourly' | 'daily' | '1hr' | '4hr'
export type NotifSeverity = 'all' | 'warning' | 'critical'
export type NotifVolume = 'low' | 'medium' | 'high'

export interface NotifPrefs {
  frequency: NotifFrequency
  quietHoursEnabled: boolean
  quietHoursStart: string
  quietHoursEnd: string
  minSeverity: NotifSeverity
  soundEnabled: boolean
  soundVolume: NotifVolume
  emailAddress: string
  dailyDigest: boolean
  weeklySummary: boolean
  browserPush: boolean
  desktopBadge: boolean
}

const DEFAULT_NOTIF_PREFS: NotifPrefs = {
  frequency: 'instant',
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
  minSeverity: 'all',
  soundEnabled: true,
  soundVolume: 'medium',
  emailAddress: 'ops@autoflow.in',
  dailyDigest: true,
  weeklySummary: false,
  browserPush: true,
  desktopBadge: true,
}

interface AppState {
  activeView: string
  setActiveView: (view: string) => void
  currentRole: Role
  setCurrentRole: (role: Role) => void
  selectedWarehouse: string
  setSelectedWarehouse: (id: string) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  commandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void
  notifications: AppNotification[]
  unreadCount: number
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void
  markAllRead: () => void
  markRead: (id: string) => void
  clearNotifications: () => void
  notifPrefs: NotifPrefs
  setNotifPrefs: (prefs: Partial<NotifPrefs>) => void
  resetNotifPrefs: () => void
}

export const useAppStore = create<AppState>((set) => ({
  activeView: 'last-mile-customer-portal',
  setActiveView: (view) => set({ activeView: view }),
  currentRole: 'executive',
  setCurrentRole: (role) => set({ currentRole: role }),
  selectedWarehouse: 'all',
  setSelectedWarehouse: (id) => set({ selectedWarehouse: id }),
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  notifications: [],
  unreadCount: 0,
  addNotification: (notification) => set((state) => {
    const newNotification: AppNotification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
      read: false,
    }
    const notifications = [newNotification, ...state.notifications].slice(0, 50)
    return {
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    }
  }),
  markAllRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, read: true })),
    unreadCount: 0,
  })),
  markRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n),
    unreadCount: state.notifications.filter((n) => !n.read && n.id !== id).length,
  })),
  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
  notifPrefs: DEFAULT_NOTIF_PREFS,
  setNotifPrefs: (prefs) => set((state) => ({
    notifPrefs: { ...state.notifPrefs, ...prefs },
  })),
  resetNotifPrefs: () => set({ notifPrefs: DEFAULT_NOTIF_PREFS }),
}))
