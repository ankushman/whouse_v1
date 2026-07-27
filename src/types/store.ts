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

export type NavGroup = "operations" | "analytics" | "system"

export interface NavItem {
  id: string
  label: string
  icon: string
  group: NavGroup
  badge?: number
  roles: Role[]
}
