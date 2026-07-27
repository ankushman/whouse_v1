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
  { id: 'labor-management', label: 'Labor Management', icon: 'HardHat', group: 'analytics', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'sla-countdown', label: 'SLA Countdown', icon: 'Timer', group: 'system', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'shift-handover', label: 'Shift Handover', icon: 'ArrowRightLeft', group: 'system', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
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
  activeView: 'dashboard',
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
