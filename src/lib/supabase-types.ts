// ============================================================================
// AutoFlow Logistics - Supabase Database Types
// Generated to match the Supabase schema for type-safe queries
// ============================================================================

export interface Warehouse {
  id: string
  name: string
  code: string
  city: string
  state: string
  address: string
  manager_id: string | null
  manager_name: string
  manager_avatar: string
  capacity: number
  capacity_used: number
  inventory_accuracy: number
  forklift_count: number
  forklift_active: number
  today_orders: number
  pending_tasks: number
  health_score: number
  status: 'green' | 'amber' | 'red'
  alerts_count: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Employee {
  id: string
  name: string
  email: string
  role: string
  warehouse_id: string
  warehouse_name: string
  avatar: string
  shift: 'Morning' | 'Afternoon' | 'Night'
  attendance: number
  tasks_completed: number
  productivity: number
  overtime: number
  error_rate: number
  rank: number
  is_active: boolean
  created_at: string
}

export interface InboundShipment {
  id: string
  invoice: string
  supplier: string
  type: 'Domestic' | 'Imported'
  warehouse_id: string
  warehouse_name: string
  status: string
  current_step: number
  sla_progress: number
  timeline: Json[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface OutboundShipment {
  id: string
  invoice: string
  customer: string
  warehouse_id: string
  warehouse_name: string
  picking_type: 'Batch' | 'Wave' | 'Single'
  picker: string
  packer: string
  vehicle_id: string | null
  vehicle: string
  status: 'Pending' | 'Picking' | 'Packing' | 'Ready' | 'Dispatched' | 'Delivered'
  dispatch_time: string | null
  delivery_time: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface InventoryItem {
  id: string
  sku: string
  part_name: string
  category: 'Engine' | 'Transmission' | 'Body' | 'Electrical' | 'Suspension' | 'Brakes'
  warehouse_id: string
  warehouse_name: string
  quantity: number
  min_stock: number
  max_stock: number
  abc_class: 'A' | 'B' | 'C'
  last_count: string
  variance: number
  location: string
  days_since_last_count: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface TransportVehicle {
  id: string
  registration: string
  type: 'Truck' | 'Container' | 'Flatbed'
  driver: string
  driver_phone: string
  route: string
  status: 'in-transit' | 'available' | 'maintenance' | 'delayed'
  eta: string
  current_location: string
  deliveries_completed: number
  deliveries_total: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Equipment {
  id: string
  name: string
  warehouse_id: string
  warehouse_name: string
  type: string
  battery_level: number
  status: 'active' | 'maintenance' | 'idle' | 'charging'
  last_maintenance: string
  next_maintenance: string
  hours_used: number
  downtime: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Alert {
  id: string
  type: 'sla' | 'productivity' | 'inventory' | 'dispatch' | 'equipment' | 'capacity'
  severity: 'critical' | 'warning' | 'info'
  title: string
  message: string
  warehouse_id: string
  warehouse_name: string
  acknowledged: boolean
  acknowledged_at: string | null
  acknowledged_by: string | null
  is_active: boolean
  created_at: string
}

export interface KpiSnapshot {
  id: string
  warehouse_id: string
  warehouse_name: string
  total_warehouses: number
  active_shipments: number
  pending_grn: number
  inventory_accuracy: number
  todays_dispatches: number
  dock_to_stock_time: number
  sla_achievement: number
  equipment_utilization: number
  cost_per_shipment: number
  warehouse_occupancy: number
  productivity: number
  recorded_at: string
}

export interface Customer {
  id: string
  name: string
  code: string
  city: string
  state: string
  contact: string
  email: string
  type: 'OEM' | 'Tier1' | 'Tier2'
  status: 'Active' | 'Inactive'
  created_at: string
}

export interface Transporter {
  id: string
  name: string
  fleet: number
  routes: number
  contact: string
  phone: string
  rating: number
  status: 'Active' | 'Inactive'
  created_at: string
}

// JSON type for timeline steps
export interface TimelineStep {
  step: number
  label: string
  duration: string
  user: string
  status: 'completed' | 'in-progress' | 'pending'
  timestamp: string
}

type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json }

// Database response types
export interface Tables {
  warehouses: Warehouse
  employees: Employee
  inbound_shipments: InboundShipment
  outbound_shipments: OutboundShipment
  inventory_items: InventoryItem
  transport_vehicles: TransportVehicle
  equipment: Equipment
  alerts: Alert
  kpi_snapshots: KpiSnapshot
  customers: Customer
  transporters: Transporter
}

// API Response types
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  count?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}
