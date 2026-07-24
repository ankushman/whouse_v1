import { create } from 'zustand'

export type Role = 'super_admin' | 'executive' | 'regional_manager' | 'warehouse_manager' | 'supervisor' | 'operator'

export interface NavItem {
  id: string
  label: string
  icon: string
  badge?: number
  roles: Role[]
}

export const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'warehouses', label: 'Warehouses', icon: 'Warehouse', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'inbound', label: 'Inbound', icon: 'PackageSearch', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'outbound', label: 'Outbound', icon: 'Truck', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'inventory', label: 'Inventory', icon: 'Package', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'transportation', label: 'Transportation', icon: 'Route', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'equipment', label: 'Equipment', icon: 'Cog', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'employees', label: 'Employees', icon: 'Users', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'productivity', label: 'Productivity', icon: 'TrendingUp', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor'] },
  { id: 'cost-analytics', label: 'Cost Analytics', icon: 'DollarSign', roles: ['super_admin', 'executive', 'regional_manager'] },
  { id: 'alerts', label: 'Alerts', icon: 'Bell', badge: 5, roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager', 'supervisor', 'operator'] },
  { id: 'reports', label: 'Reports', icon: 'FileBarChart', roles: ['super_admin', 'executive', 'regional_manager', 'warehouse_manager'] },
  { id: 'settings', label: 'Settings', icon: 'Settings', roles: ['super_admin', 'executive'] },
]

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
}))
