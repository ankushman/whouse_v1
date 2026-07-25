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

export interface NavItem {
  id: string
  label: string
  icon: string
  badge?: number
  roles: Role[]
}
