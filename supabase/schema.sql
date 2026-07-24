-- ============================================================================
-- AutoFlow Logistics - Supabase Database Schema
-- Run this SQL in the Supabase SQL Editor (https://supabase.com/dashboard/project/jcirlewwkzhezaxaavja/sql)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Warehouses
CREATE TABLE IF NOT EXISTS warehouses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  address TEXT,
  manager_id UUID,
  manager_name TEXT NOT NULL DEFAULT 'TBD',
  manager_avatar TEXT NOT NULL DEFAULT 'WH',
  capacity INTEGER NOT NULL DEFAULT 10000,
  capacity_used INTEGER NOT NULL DEFAULT 0,
  inventory_accuracy DECIMAL(5,2) NOT NULL DEFAULT 97.50,
  forklift_count INTEGER NOT NULL DEFAULT 0,
  forklift_active INTEGER NOT NULL DEFAULT 0,
  today_orders INTEGER NOT NULL DEFAULT 0,
  pending_tasks INTEGER NOT NULL DEFAULT 0,
  health_score INTEGER NOT NULL DEFAULT 85,
  status TEXT NOT NULL DEFAULT 'green' CHECK (status IN ('green', 'amber', 'red')),
  alerts_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Employees
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  warehouse_id UUID NOT NULL,
  warehouse_name TEXT NOT NULL,
  avatar TEXT NOT NULL DEFAULT 'EM',
  shift TEXT NOT NULL DEFAULT 'Morning' CHECK (shift IN ('Morning', 'Afternoon', 'Night')),
  attendance INTEGER NOT NULL DEFAULT 95,
  tasks_completed INTEGER NOT NULL DEFAULT 0,
  productivity INTEGER NOT NULL DEFAULT 85,
  overtime DECIMAL(5,2) NOT NULL DEFAULT 0,
  error_rate DECIMAL(4,2) NOT NULL DEFAULT 0,
  rank INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_employee_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

-- 3. Inbound Shipments
CREATE TABLE IF NOT EXISTS inbound_shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice TEXT NOT NULL UNIQUE,
  supplier TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Domestic' CHECK (type IN ('Domestic', 'Imported')),
  warehouse_id UUID NOT NULL,
  warehouse_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  current_step INTEGER NOT NULL DEFAULT 0,
  sla_progress INTEGER NOT NULL DEFAULT 0 CHECK (sla_progress >= 0 AND sla_progress <= 100),
  timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_inbound_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

-- 4. Outbound Shipments
CREATE TABLE IF NOT EXISTS outbound_shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice TEXT NOT NULL UNIQUE,
  customer TEXT NOT NULL,
  warehouse_id UUID NOT NULL,
  warehouse_name TEXT NOT NULL,
  picking_type TEXT NOT NULL DEFAULT 'Batch' CHECK (picking_type IN ('Batch', 'Wave', 'Single')),
  picker TEXT NOT NULL DEFAULT 'Unassigned',
  packer TEXT NOT NULL DEFAULT 'Unassigned',
  vehicle_id UUID,
  vehicle TEXT NOT NULL DEFAULT 'Unassigned',
  status TEXT NOT NULL DEFAULT 'Pending',
  dispatch_time TIMESTAMPTZ,
  delivery_time TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_outbound_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

-- 5. Inventory Items
CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku TEXT NOT NULL UNIQUE,
  part_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Engine', 'Transmission', 'Body', 'Electrical', 'Suspension', 'Brakes')),
  warehouse_id UUID NOT NULL,
  warehouse_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  min_stock INTEGER NOT NULL DEFAULT 10,
  max_stock INTEGER NOT NULL DEFAULT 500,
  abc_class TEXT NOT NULL DEFAULT 'B' CHECK (abc_class IN ('A', 'B', 'C')),
  last_count TEXT NOT NULL DEFAULT '0',
  variance INTEGER NOT NULL DEFAULT 0,
  location TEXT NOT NULL DEFAULT 'A-01-01',
  days_since_last_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_inventory_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

-- 6. Transport Vehicles
CREATE TABLE IF NOT EXISTS transport_vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'Truck' CHECK (type IN ('Truck', 'Container', 'Flatbed')),
  driver TEXT NOT NULL,
  driver_phone TEXT,
  route TEXT NOT NULL DEFAULT 'Unassigned',
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('in-transit', 'available', 'maintenance', 'delayed')),
  eta TEXT NOT NULL DEFAULT 'N/A',
  current_location TEXT NOT NULL DEFAULT 'Hub',
  deliveries_completed INTEGER NOT NULL DEFAULT 0,
  deliveries_total INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Equipment
CREATE TABLE IF NOT EXISTS equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  warehouse_id UUID NOT NULL,
  warehouse_name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Forklift',
  battery_level INTEGER NOT NULL DEFAULT 100 CHECK (battery_level >= 0 AND battery_level <= 100),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'idle', 'charging')),
  last_maintenance TEXT NOT NULL DEFAULT 'N/A',
  next_maintenance TEXT NOT NULL DEFAULT 'N/A',
  hours_used DECIMAL(8,2) NOT NULL DEFAULT 0,
  downtime DECIMAL(8,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_equipment_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

-- 8. Alerts
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('sla', 'productivity', 'inventory', 'dispatch', 'equipment', 'capacity')),
  severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('critical', 'warning', 'info')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  warehouse_id UUID,
  warehouse_name TEXT NOT NULL DEFAULT 'All',
  acknowledged BOOLEAN NOT NULL DEFAULT false,
  acknowledged_at TIMESTAMPTZ,
  acknowledged_by TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. KPI Snapshots
CREATE TABLE IF NOT EXISTS kpi_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  warehouse_id UUID,
  warehouse_name TEXT NOT NULL DEFAULT 'All',
  total_warehouses INTEGER NOT NULL DEFAULT 6,
  active_shipments INTEGER NOT NULL DEFAULT 0,
  pending_grn INTEGER NOT NULL DEFAULT 0,
  inventory_accuracy DECIMAL(5,2) NOT NULL DEFAULT 97.50,
  todays_dispatches INTEGER NOT NULL DEFAULT 0,
  dock_to_stock_time DECIMAL(4,2) NOT NULL DEFAULT 3.20,
  sla_achievement DECIMAL(5,2) NOT NULL DEFAULT 94.60,
  equipment_utilization DECIMAL(5,2) NOT NULL DEFAULT 82.40,
  cost_per_shipment DECIMAL(10,2) NOT NULL DEFAULT 3245.00,
  warehouse_occupancy DECIMAL(5,2) NOT NULL DEFAULT 79.70,
  productivity DECIMAL(5,2) NOT NULL DEFAULT 86.30,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Customers
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  contact TEXT NOT NULL,
  email TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'OEM' CHECK (type IN ('OEM', 'Tier1', 'Tier2')),
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. Transporters
CREATE TABLE IF NOT EXISTS transporters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  fleet INTEGER NOT NULL DEFAULT 0,
  routes INTEGER NOT NULL DEFAULT 0,
  contact TEXT NOT NULL,
  phone TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 3 CHECK (rating >= 1 AND rating <= 5),
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- Indexes
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_warehouses_city ON warehouses(city);
CREATE INDEX IF NOT EXISTS idx_employees_warehouse ON employees(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_inbound_status ON inbound_shipments(status);
CREATE INDEX IF NOT EXISTS idx_outbound_status ON outbound_shipments(status);
CREATE INDEX IF NOT EXISTS idx_inventory_warehouse ON inventory_items(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_kpi_recorded ON kpi_snapshots(recorded_at DESC);

-- ============================================================================
-- Auto-update trigger
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY['warehouses','employees','inbound_shipments','outbound_shipments','inventory_items','transport_vehicles','equipment']) LOOP
    EXECUTE format('CREATE TRIGGER update_%s_updated_at BEFORE UPDATE ON %s FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', replace(t,'_',''), t);
  END LOOP;
END $$;

-- ============================================================================
-- RLS (Row Level Security)
-- ============================================================================
DO $$ DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY['warehouses','employees','inbound_shipments','outbound_shipments','inventory_items','transport_vehicles','equipment','alerts','kpi_snapshots','customers','transporters']) LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY "Public read %I" ON %I FOR SELECT USING (true)', t, t);
    EXECUTE format('CREATE POLICY "Full access %I" ON %I FOR ALL USING (true)', t, t);
  END LOOP;
END $$;

-- ============================================================================
-- Seed: Warehouses
-- ============================================================================
INSERT INTO warehouses (id, name, code, city, state, address, manager_name, manager_avatar, capacity, capacity_used, inventory_accuracy, forklift_count, forklift_active, today_orders, pending_tasks, health_score, status, alerts_count) VALUES
('a1b2c3d4-1111-1111-1111-111111111111', 'Mumbai Hub', 'MH-001', 'Mumbai', 'Maharashtra', 'Plot 42, MIDC Industrial Area, Andheri East', 'Rajesh Kumar', 'RK', 12000, 7200, 98.20, 15, 12, 245, 18, 92, 'green', 2),
('b2c3d4e5-2222-2222-2222-222222222222', 'Delhi NCR Hub', 'DL-001', 'Gurugram', 'Haryana', 'Sector 37, Udyog Vihar Phase V', 'Priya Sharma', 'PS', 15000, 10500, 96.80, 20, 18, 312, 35, 78, 'amber', 5),
('c3d4e5f6-3333-3333-3333-333333333333', 'Pune Warehouse', 'PN-001', 'Pune', 'Maharashtra', 'Chakan Industrial Area, Taluka Khed', 'Amit Patel', 'AP', 10000, 8500, 97.50, 12, 10, 189, 22, 85, 'green', 3),
('d4e5f6a7-4444-4444-4444-444444444444', 'Chennai Hub', 'CH-001', 'Chennai', 'Tamil Nadu', 'SRP Tools Road, Thiruvallur District', 'Deepa Nair', 'DN', 9000, 5400, 99.10, 10, 8, 156, 12, 95, 'green', 1),
('e5f6a7b8-5555-5555-5555-555555555555', 'Bangalore South', 'BL-001', 'Bangalore', 'Karnataka', 'Plot 78, Electronic City Phase 2', 'Suresh Reddy', 'SR', 11000, 9350, 95.90, 14, 11, 278, 45, 72, 'red', 7),
('f6a7b8c9-6666-6666-6666-666666666666', 'Kolkata Distribution', 'KB-001', 'Kolkata', 'West Bengal', 'Dankuni Industrial Complex, Hooghly', 'Kavitha Menon', 'KM', 8000, 3200, 97.20, 8, 6, 98, 8, 90, 'green', 0);

-- Seed: KPI Snapshot
INSERT INTO kpi_snapshots (warehouse_name, total_warehouses, active_shipments, pending_grn, inventory_accuracy, todays_dispatches, dock_to_stock_time, sla_achievement, equipment_utilization, cost_per_shipment, warehouse_occupancy, productivity) VALUES
('All', 6, 148, 63, 97.80, 89, 3.20, 94.60, 82.40, 3245.00, 79.70, 86.30);
