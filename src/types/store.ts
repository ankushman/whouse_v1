// ============================================================================
// AutoFlow Logistics - Store Types
// Zustand store type definitions
// ============================================================================

export type Role =
  | 'super_admin'
  | 'executive'
  | 'regional_manager'
  | 'warehouse_manager'
  | 'supervisor'
  | 'operator'
  | 'procurement'
  | 'demand_planner'
  | 'logistics'
  | 'shift_lead'
  | 'finance'
  | 'operations_planner'
  | 'fleet_manager'
  | 'facilities'
  | 'hr'
  | 'quality'

export type NavGroup = "operations" | "analytics" | "system" | "transport" | "warehouse" | "fleet" | "returns" | "sustainability"

export interface NavItem {
  id: string
  label: string
  icon: string
  group: NavGroup
  badge?: number
  roles: Role[]
}
