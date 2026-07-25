import { create } from 'zustand'
import type { Role, NavItem } from '@/types'

export type { Role, NavItem }

export const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'warehouses', label: 'Warehouses', icon: 'Warehouse', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'inbound', label: 'Inbound', icon: 'PackageSearch', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'outbound', label: 'Outbound', icon: 'Truck', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'inventory', label: 'Inventory', icon: 'Package', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'transportation', label: 'Transportation', icon: 'Route', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'route-optimization', label: 'Route Optimization', icon: 'Navigation', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'warehouse-map', label: 'Warehouse Map', icon: 'MapPin', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'equipment', label: 'Equipment', icon: 'Cog', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'employees', label: 'Employees', icon: 'Users', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'productivity', label: 'Productivity', icon: 'TrendingUp', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'cost-analytics', label: 'Cost Analytics', icon: 'DollarSign', roles: ['super_admin', 'executive', 'regional_manager'] },
  { id: 'alerts', label: 'Alerts', icon: 'Bell', badge: 5, roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'dock-scheduler', label: 'Dock Scheduling', icon: 'LayoutGrid', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'sla-countdown', label: 'SLA Countdown', icon: 'Timer', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'reports', label: 'Reports', icon: 'FileBarChart', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'settings', label: 'Settings', icon: 'Settings', roles: ['super_admin', 'executive'] },
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

export interface NotifPrefs {
  frequency: string
  quietHoursEnabled: boolean
  quietHoursStart: string
  quietHoursEnd: string
  minSeverity: string
  soundEnabled: boolean
  soundVolume: string
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
