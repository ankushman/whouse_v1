// R111: Fixed Asset Register Module (Companies Act Schedule II + Ind AS 16)
// Capital asset tracking + depreciation + impairment + transfer/disposal
'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  RefreshCw, Search, Building2, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle2, XCircle, Clock, Hash, Calendar, FileText, Coins, Truck,
  Cog, Building, Server, Lightbulb, Wind, Box, Wrench, Laptop, Camera,
  ShieldCheck, Banknote, ArrowRightLeft, Trash2, AlertCircle, Eye,
  Filter, ChevronDown, ChevronUp, ChevronRight, X, Activity, Info,
  Sparkles, Award, Zap, Target, Layers, MapPin, User, Briefcase,
  PieChart as PieChartIcon, BarChart3, DollarSign, Percent, Calculator,
} from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, ComposedChart, Line, ReferenceLine,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { warehouses } from '@/data/mock-data';

// ============================================================================
// Types
// ============================================================================
type AssetCategory = 'land' | 'building' | 'plant_machinery' | 'vehicles' | 'it_equipment' | 'furniture_fixtures' | 'warehouse_equipment' | 'office_equipment';
type AssetStatus = 'in_service' | 'under_installation' | 'under_maintenance' | 'idle' | 'impaired' | 'held_for_sale' | 'disposed' | 'capitalized_wip';
type DepreciationMethod = 'slm' | 'wdv' | 'uop'; // Straight Line / Written Down Value / Units of Production
type AcquisitionMode = 'purchase' | 'lease' | 'transfer_in' | 'capital_wip_completion' | 'donation';
type ImpairmentIndicator = 'none' | 'physical_damage' | 'obsolescence' | 'market_decline' | 'regulatory_change' | 'underutilization';
type MaintenanceTier = 'a_critical' | 'b_essential' | 'c_standard';
type DisposalMode = 'sale' | 'scrap' | 'donation' | 'transfer_out';

interface Asset {
  id: string;
  assetCode: string;
  assetName: string;
  category: AssetCategory;
  status: AssetStatus;
  warehouseId: string;
  location: string;
  department: string;
  custodian: string;
  // Acquisition
  acquisitionMode: AcquisitionMode;
  acquisitionDate: string;
  acquisitionCostInr: number;
  vendorName: string;
  poNumber: string;
  // Capitalization
  capitalizationDate: string;
  usefulLifeYears: number;
  salvageValueInr: number;
  depreciationMethod: DepreciationMethod;
  // Financial (current state)
  accumulatedDepreciationInr: number;
  netBookValueInr: number;
  // Revaluation
  lastRevaluationDate: string | null;
  lastRevaluationSurplusInr: number;
  // Impairment
  impairmentIndicator: ImpairmentIndicator;
  impairmentLossInr: number;
  impairmentDate: string | null;
  // Maintenance
  maintenanceTier: MaintenanceTier;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  // Compliance
  insuranceValueInr: number;
  insuranceExpiryDate: string;
  physicalVerificationDate: string;
  physicalVerificationStatus: 'matched' | 'mismatched' | 'pending';
  // Cross-module links
  linkedPoId: string | null;
  linkedPcvId: string | null; // Production Cost Variance
  linkedNcrId: string | null; // Non-Conformance Report
  linkedWorkOrderId: string | null;
}

interface DepreciationScheduleEntry {
  year: number;
  openingBookValue: number;
  depreciationExpense: number;
  closingBookValue: number;
  cumulativeDepreciation: number;
}

interface MaintenanceHistoryEntry {
  assetId: string;
  assetName: string;
  date: string;
  type: 'preventive' | 'corrective' | 'predictive' | 'overhaul';
  costInr: number;
  downtimeHours: number;
  technician: string;
  workOrderId: string;
  outcome: 'success' | 'partial' | 'failed';
}

interface AssetTransfer {
  id: string;
  transferCode: string;
  assetId: string;
  assetName: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  transferDate: string;
  transferReason: string;
  bookValueAtTransfer: number;
  approvedBy: string;
  status: 'initiated' | 'in_transit' | 'received' | 'rejected';
  journalEntryId: string;
}

interface AssetDisposal {
  id: string;
  disposalCode: string;
  assetId: string;
  assetName: string;
  category: AssetCategory;
  disposalDate: string;
  disposalMode: DisposalMode;
  originalCostInr: number;
  accumulatedDepreciationInr: number;
  netBookValueInr: number;
  saleProceedsInr: number;
  gainLossInr: number;
  buyerOrRecipient: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  journalEntryId: string;
}

// ============================================================================
// Seeded deterministic data
// ============================================================================
function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

const ASSET_CATEGORIES: { id: AssetCategory; label: string; icon: any; color: string }[] = [
  { id: 'land', label: 'Land', icon: Building, color: '#8b5cf6' },
  { id: 'building', label: 'Buildings', icon: Building2, color: '#6366f1' },
  { id: 'plant_machinery', label: 'Plant & Machinery', icon: Cog, color: '#3b82f6' },
  { id: 'vehicles', label: 'Vehicles', icon: Truck, color: '#06b6d4' },
  { id: 'it_equipment', label: 'IT Equipment', icon: Laptop, color: '#10b981' },
  { id: 'furniture_fixtures', label: 'Furniture & Fixtures', icon: Box, color: '#84cc16' },
  { id: 'warehouse_equipment', label: 'Warehouse Equipment', icon: Wind, color: '#f59e0b' },
  { id: 'office_equipment', label: 'Office Equipment', icon: Camera, color: '#ec4899' },
];

const ASSET_NAMES_BY_CATEGORY: Record<AssetCategory, string[]> = {
  land: ['Industrial Plot - Chennai Hub', 'Industrial Plot - Pune WH', 'Land - Mumbai DC'],
  building: ['Warehouse Building - Chennai', 'Warehouse Building - Pune', 'Office Building - Mumbai', 'Loading Bay - Bangalore', 'Storage Shed - Kolkata'],
  plant_machinery: ['CNC Machine - CM-001', 'Hydraulic Press - HP-002', 'Conveyor System - CV-001', 'Packaging Machine - PK-003', 'Sorting Conveyor - SC-002', 'Strapping Machine - ST-001'],
  vehicles: ['Forklift - FL-001', 'Forklift - FL-002', 'Forklift - FL-003', 'Electric Pallet Truck - PT-001', 'Reach Truck - RT-001', 'Delivery Truck - DT-001', 'Delivery Truck - DT-002'],
  it_equipment: ['Server Rack - SR-001', 'Barcode Scanner Set - BS-001', 'Workstation Cluster - WS-001', 'Network Switch - NS-001', 'UPS System - UPS-001', 'Wireless AP Set - AP-001'],
  furniture_fixtures: ['Office Workstations - OW-001', 'Storage Cabinets - SC-001', 'Conference Table - CT-001', 'Reception Counter - RC-001'],
  warehouse_equipment: ['HVAC System - HVAC-001', 'Fire Suppression System - FS-001', 'Dock Leveler - DL-001', 'Dock Leveler - DL-002', 'Roll-up Doors - RD-001', 'CCTV System - CCTV-001'],
  office_equipment: ['Xerox Machine - XM-001', 'Projector - PR-001', 'Coffee Machine - CM-001', 'Water Dispenser - WD-001'],
};

const VENDORS = ['Tata Motors Ltd', 'Larsen & Toubro', 'Godrej & Boyce', 'Voltas Limited', 'Blue Star India', 'Toyota Material Handling', 'Linde Material Handling', 'Jungheinrich India', 'Hikvision India', 'Dell India', 'HP India', 'Cisco Systems India', 'APC by Schneider'];

const DEPARTMENTS = ['Operations', 'Maintenance', 'IT', 'Finance', 'HR', 'Administration', 'Logistics', 'Quality'];

function generateAssets(): Asset[] {
  const rand = seededRandom(424242);
  const assets: Asset[] = [];
  let serialCounter = 1;

  // For each warehouse, generate a realistic set of assets
  warehouses.forEach((wh, whIdx) => {
    // Land (1 per warehouse, only 3 warehouses have land)
    if (whIdx < 3) {
      const cost = Math.round((rand() * 80 + 40) * 10000000); // 4-12 Cr
      assets.push({
        id: `asset-LND-${String(serialCounter).padStart(4, '0')}`,
        assetCode: `LND/${wh.id.slice(-3)}/${String(serialCounter).padStart(3, '0')}`,
        assetName: `Industrial Plot - ${wh.city}`,
        category: 'land',
        status: 'in_service',
        warehouseId: wh.id,
        location: `${wh.city} Industrial Area`,
        department: 'Administration',
        custodian: wh.managerName,
        acquisitionMode: 'purchase',
        acquisitionDate: `201${whIdx + 5}-0${whIdx + 3}-15`,
        acquisitionCostInr: cost,
        vendorName: 'SIDCO Industrial Estate',
        poNumber: `PO/LND/201${whIdx + 5}/0${whIdx + 1}`,
        capitalizationDate: `201${whIdx + 5}-0${whIdx + 4}-01`,
        usefulLifeYears: 0, // Land has infinite life
        salvageValueInr: cost, // Land doesn't depreciate
        depreciationMethod: 'slm',
        accumulatedDepreciationInr: 0,
        netBookValueInr: cost,
        lastRevaluationDate: '2024-04-01',
        lastRevaluationSurplusInr: Math.round(cost * 0.35),
        impairmentIndicator: 'none',
        impairmentLossInr: 0,
        impairmentDate: null,
        maintenanceTier: 'c_standard',
        lastMaintenanceDate: '2025-01-15',
        nextMaintenanceDate: '2025-07-15',
        insuranceValueInr: Math.round(cost * 1.2),
        insuranceExpiryDate: '2026-03-31',
        physicalVerificationDate: '2024-12-15',
        physicalVerificationStatus: 'matched',
        linkedPoId: `PO/LND/201${whIdx + 5}/0${whIdx + 1}`,
        linkedPcvId: null,
        linkedNcrId: null,
        linkedWorkOrderId: null,
      });
      serialCounter++;
    }

    // Building (1-2 per warehouse)
    const buildingCount = whIdx < 4 ? 2 : 1;
    for (let b = 0; b < buildingCount; b++) {
      const cost = Math.round((rand() * 4 + 1.5) * 10000000); // 1.5-5.5 Cr
      const lifeYears = 30;
      const capDate = new Date(2016 + whIdx, 2 + b * 6, 1);
      const yearsElapsed = (new Date('2025-07-27').getTime() - capDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
      const annualDep = cost / lifeYears;
      const accDep = Math.round(annualDep * yearsElapsed);
      assets.push({
        id: `asset-BLD-${String(serialCounter).padStart(4, '0')}`,
        assetCode: `BLD/${wh.id.slice(-3)}/${String(serialCounter).padStart(3, '0')}`,
        assetName: b === 0 ? `Warehouse Building - ${wh.city}` : `Ancillary Building - ${wh.city}`,
        category: 'building',
        status: 'in_service',
        warehouseId: wh.id,
        location: `${wh.city} Main Campus`,
        department: 'Administration',
        custodian: wh.managerName,
        acquisitionMode: 'capital_wip_completion',
        acquisitionDate: capDate.toISOString().slice(0, 10),
        acquisitionCostInr: cost,
        vendorName: 'Larsen & Toubro Construction',
        poNumber: `PO/BLD/${capDate.getFullYear()}/0${serialCounter}`,
        capitalizationDate: capDate.toISOString().slice(0, 10),
        usefulLifeYears: lifeYears,
        salvageValueInr: Math.round(cost * 0.05),
        depreciationMethod: 'slm',
        accumulatedDepreciationInr: accDep,
        netBookValueInr: cost - accDep,
        lastRevaluationDate: null,
        lastRevaluationSurplusInr: 0,
        impairmentIndicator: 'none',
        impairmentLossInr: 0,
        impairmentDate: null,
        maintenanceTier: 'b_essential',
        lastMaintenanceDate: '2025-06-10',
        nextMaintenanceDate: '2025-12-10',
        insuranceValueInr: Math.round(cost * 1.1),
        insuranceExpiryDate: '2026-03-31',
        physicalVerificationDate: '2024-12-20',
        physicalVerificationStatus: 'matched',
        linkedPoId: `PO/BLD/${capDate.getFullYear()}/0${serialCounter}`,
        linkedPcvId: null,
        linkedNcrId: null,
        linkedWorkOrderId: null,
      });
      serialCounter++;
    }

    // Plant & Machinery (3-5 per warehouse)
    const pmCount = 3 + Math.floor(rand() * 3);
    for (let p = 0; p < pmCount; p++) {
      const namePool = ASSET_NAMES_BY_CATEGORY.plant_machinery;
      const name = namePool[p % namePool.length];
      const cost = Math.round((rand() * 35 + 8) * 100000); // 8L-43L
      const lifeYears = 12;
      const capYear = 2018 + Math.floor(rand() * 6);
      const capMonth = 1 + Math.floor(rand() * 12);
      const capDate = new Date(capYear, capMonth, 15);
      const yearsElapsed = Math.max(0, (new Date('2025-07-27').getTime() - capDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
      const annualDep = cost / lifeYears;
      const accDep = Math.min(cost - Math.round(cost * 0.05), Math.round(annualDep * yearsElapsed));
      const status: AssetStatus = rand() > 0.92 ? 'impaired' : (rand() > 0.85 ? 'under_maintenance' : 'in_service');
      const impairmentIndicator: ImpairmentIndicator = status === 'impaired' ? (rand() > 0.5 ? 'obsolescence' : 'underutilization') : 'none';
      const impairmentLoss = impairmentIndicator !== 'none' ? Math.round((cost - accDep) * 0.15) : 0;
      assets.push({
        id: `asset-PNM-${String(serialCounter).padStart(4, '0')}`,
        assetCode: `PNM/${wh.id.slice(-3)}/${String(serialCounter).padStart(3, '0')}`,
        assetName: `${name} - ${wh.city}`,
        category: 'plant_machinery',
        status,
        warehouseId: wh.id,
        location: `${wh.city} Plant Area`,
        department: 'Operations',
        custodian: 'Maintenance Lead',
        acquisitionMode: 'purchase',
        acquisitionDate: capDate.toISOString().slice(0, 10),
        acquisitionCostInr: cost,
        vendorName: VENDORS[Math.floor(rand() * VENDORS.length)],
        poNumber: `PO/PNM/${capYear}/${String(serialCounter).padStart(3, '0')}`,
        capitalizationDate: capDate.toISOString().slice(0, 10),
        usefulLifeYears: lifeYears,
        salvageValueInr: Math.round(cost * 0.08),
        depreciationMethod: rand() > 0.5 ? 'slm' : 'wdv',
        accumulatedDepreciationInr: accDep,
        netBookValueInr: cost - accDep - impairmentLoss,
        lastRevaluationDate: null,
        lastRevaluationSurplusInr: 0,
        impairmentIndicator,
        impairmentLossInr: impairmentLoss,
        impairmentDate: impairmentIndicator !== 'none' ? '2024-09-30' : null,
        maintenanceTier: 'a_critical',
        lastMaintenanceDate: '2025-06-25',
        nextMaintenanceDate: '2025-09-25',
        insuranceValueInr: Math.round(cost * 0.9),
        insuranceExpiryDate: '2026-03-31',
        physicalVerificationDate: '2024-12-10',
        physicalVerificationStatus: rand() > 0.05 ? 'matched' : (rand() > 0.5 ? 'mismatched' : 'pending'),
        linkedPoId: `PO/PNM/${capYear}/${String(serialCounter).padStart(3, '0')}`,
        linkedPcvId: rand() > 0.7 ? `PCV/${capYear}/0${serialCounter}` : null,
        linkedNcrId: status === 'impaired' ? `NCR/${capYear}/0${serialCounter}` : null,
        linkedWorkOrderId: status === 'under_maintenance' ? `WO/2025/0${serialCounter}` : null,
      });
      serialCounter++;
    }

    // Vehicles (forklifts + trucks) - 4-7 per warehouse
    const vehCount = 4 + Math.floor(rand() * 4);
    for (let v = 0; v < vehCount; v++) {
      const namePool = ASSET_NAMES_BY_CATEGORY.vehicles;
      const name = namePool[v % namePool.length];
      const cost = Math.round((rand() * 25 + 6) * 100000); // 6L-31L
      const lifeYears = 8;
      const capYear = 2019 + Math.floor(rand() * 5);
      const capMonth = 1 + Math.floor(rand() * 12);
      const capDate = new Date(capYear, capMonth, 10);
      const yearsElapsed = Math.max(0, (new Date('2025-07-27').getTime() - capDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
      const annualDep = cost / lifeYears;
      const accDep = Math.min(cost - Math.round(cost * 0.1), Math.round(annualDep * yearsElapsed));
      const statuses: AssetStatus[] = ['in_service', 'under_maintenance', 'idle', 'held_for_sale', 'disposed'];
      const statusWeights = [0.7, 0.12, 0.1, 0.04, 0.04];
      let r = rand(), status: AssetStatus = 'in_service';
      for (let s = 0; s < statuses.length; s++) { r -= statusWeights[s]; if (r <= 0) { status = statuses[s]; break; } }
      assets.push({
        id: `asset-VEH-${String(serialCounter).padStart(4, '0')}`,
        assetCode: `VEH/${wh.id.slice(-3)}/${String(serialCounter).padStart(3, '0')}`,
        assetName: `${name} - ${wh.city}`,
        category: 'vehicles',
        status,
        warehouseId: wh.id,
        location: `${wh.city} Vehicle Bay`,
        department: 'Logistics',
        custodian: 'Logistics Supervisor',
        acquisitionMode: 'purchase',
        acquisitionDate: capDate.toISOString().slice(0, 10),
        acquisitionCostInr: cost,
        vendorName: 'Toyota Material Handling',
        poNumber: `PO/VEH/${capYear}/${String(serialCounter).padStart(3, '0')}`,
        capitalizationDate: capDate.toISOString().slice(0, 10),
        usefulLifeYears: lifeYears,
        salvageValueInr: Math.round(cost * 0.12),
        depreciationMethod: 'wdv',
        accumulatedDepreciationInr: accDep,
        netBookValueInr: cost - accDep,
        lastRevaluationDate: null,
        lastRevaluationSurplusInr: 0,
        impairmentIndicator: 'none',
        impairmentLossInr: 0,
        impairmentDate: null,
        maintenanceTier: 'a_critical',
        lastMaintenanceDate: '2025-07-05',
        nextMaintenanceDate: '2025-10-05',
        insuranceValueInr: Math.round(cost * 0.95),
        insuranceExpiryDate: '2026-03-31',
        physicalVerificationDate: '2024-12-05',
        physicalVerificationStatus: 'matched',
        linkedPoId: `PO/VEH/${capYear}/${String(serialCounter).padStart(3, '0')}`,
        linkedPcvId: null,
        linkedNcrId: null,
        linkedWorkOrderId: status === 'under_maintenance' ? `WO/2025/V${serialCounter}` : null,
      });
      serialCounter++;
    }

    // IT Equipment (3-5 per warehouse)
    const itCount = 3 + Math.floor(rand() * 3);
    for (let i = 0; i < itCount; i++) {
      const namePool = ASSET_NAMES_BY_CATEGORY.it_equipment;
      const name = namePool[i % namePool.length];
      const cost = Math.round((rand() * 8 + 1.5) * 100000); // 1.5L-9.5L
      const lifeYears = 5;
      const capYear = 2020 + Math.floor(rand() * 5);
      const capMonth = 1 + Math.floor(rand() * 12);
      const capDate = new Date(capYear, capMonth, 20);
      const yearsElapsed = Math.max(0, (new Date('2025-07-27').getTime() - capDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
      const annualDep = cost / lifeYears;
      const accDep = Math.min(cost - Math.round(cost * 0.05), Math.round(annualDep * yearsElapsed));
      assets.push({
        id: `asset-ITE-${String(serialCounter).padStart(4, '0')}`,
        assetCode: `ITE/${wh.id.slice(-3)}/${String(serialCounter).padStart(3, '0')}`,
        assetName: `${name} - ${wh.city}`,
        category: 'it_equipment',
        status: rand() > 0.85 ? 'under_maintenance' : 'in_service',
        warehouseId: wh.id,
        location: `${wh.city} Server Room`,
        department: 'IT',
        custodian: 'IT Manager',
        acquisitionMode: 'purchase',
        acquisitionDate: capDate.toISOString().slice(0, 10),
        acquisitionCostInr: cost,
        vendorName: VENDORS[Math.floor(rand() * VENDORS.length)],
        poNumber: `PO/ITE/${capYear}/${String(serialCounter).padStart(3, '0')}`,
        capitalizationDate: capDate.toISOString().slice(0, 10),
        usefulLifeYears: lifeYears,
        salvageValueInr: Math.round(cost * 0.05),
        depreciationMethod: 'slm',
        accumulatedDepreciationInr: accDep,
        netBookValueInr: cost - accDep,
        lastRevaluationDate: null,
        lastRevaluationSurplusInr: 0,
        impairmentIndicator: rand() > 0.95 ? 'obsolescence' : 'none',
        impairmentLossInr: 0,
        impairmentDate: null,
        maintenanceTier: 'b_essential',
        lastMaintenanceDate: '2025-05-15',
        nextMaintenanceDate: '2025-08-15',
        insuranceValueInr: cost,
        insuranceExpiryDate: '2026-03-31',
        physicalVerificationDate: '2024-12-15',
        physicalVerificationStatus: 'matched',
        linkedPoId: `PO/ITE/${capYear}/${String(serialCounter).padStart(3, '0')}`,
        linkedPcvId: null,
        linkedNcrId: null,
        linkedWorkOrderId: null,
      });
      serialCounter++;
    }

    // Furniture & Fixtures (1-2 per warehouse)
    const ffCount = 1 + Math.floor(rand() * 2);
    for (let f = 0; f < ffCount; f++) {
      const namePool = ASSET_NAMES_BY_CATEGORY.furniture_fixtures;
      const name = namePool[f % namePool.length];
      const cost = Math.round((rand() * 4 + 1) * 100000); // 1L-5L
      const lifeYears = 10;
      const capYear = 2019 + Math.floor(rand() * 5);
      const capDate = new Date(capYear, 6, 1);
      const yearsElapsed = Math.max(0, (new Date('2025-07-27').getTime() - capDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
      const annualDep = cost / lifeYears;
      const accDep = Math.min(cost - Math.round(cost * 0.05), Math.round(annualDep * yearsElapsed));
      assets.push({
        id: `asset-FNF-${String(serialCounter).padStart(4, '0')}`,
        assetCode: `FNF/${wh.id.slice(-3)}/${String(serialCounter).padStart(3, '0')}`,
        assetName: `${name} - ${wh.city}`,
        category: 'furniture_fixtures',
        status: 'in_service',
        warehouseId: wh.id,
        location: `${wh.city} Office Area`,
        department: 'Administration',
        custodian: 'Admin Officer',
        acquisitionMode: 'purchase',
        acquisitionDate: capDate.toISOString().slice(0, 10),
        acquisitionCostInr: cost,
        vendorName: 'Godrej & Boyce',
        poNumber: `PO/FNF/${capYear}/${String(serialCounter).padStart(3, '0')}`,
        capitalizationDate: capDate.toISOString().slice(0, 10),
        usefulLifeYears: lifeYears,
        salvageValueInr: Math.round(cost * 0.05),
        depreciationMethod: 'slm',
        accumulatedDepreciationInr: accDep,
        netBookValueInr: cost - accDep,
        lastRevaluationDate: null,
        lastRevaluationSurplusInr: 0,
        impairmentIndicator: 'none',
        impairmentLossInr: 0,
        impairmentDate: null,
        maintenanceTier: 'c_standard',
        lastMaintenanceDate: '2025-04-01',
        nextMaintenanceDate: '2025-10-01',
        insuranceValueInr: cost,
        insuranceExpiryDate: '2026-03-31',
        physicalVerificationDate: '2024-12-15',
        physicalVerificationStatus: 'matched',
        linkedPoId: `PO/FNF/${capYear}/${String(serialCounter).padStart(3, '0')}`,
        linkedPcvId: null,
        linkedNcrId: null,
        linkedWorkOrderId: null,
      });
      serialCounter++;
    }

    // Warehouse Equipment (2-3 per warehouse)
    const weCount = 2 + Math.floor(rand() * 2);
    for (let w = 0; w < weCount; w++) {
      const namePool = ASSET_NAMES_BY_CATEGORY.warehouse_equipment;
      const name = namePool[w % namePool.length];
      const cost = Math.round((rand() * 12 + 3) * 100000); // 3L-15L
      const lifeYears = 15;
      const capYear = 2018 + Math.floor(rand() * 6);
      const capDate = new Date(capYear, 4, 1);
      const yearsElapsed = Math.max(0, (new Date('2025-07-27').getTime() - capDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
      const annualDep = cost / lifeYears;
      const accDep = Math.min(cost - Math.round(cost * 0.05), Math.round(annualDep * yearsElapsed));
      assets.push({
        id: `asset-WEQ-${String(serialCounter).padStart(4, '0')}`,
        assetCode: `WEQ/${wh.id.slice(-3)}/${String(serialCounter).padStart(3, '0')}`,
        assetName: `${name} - ${wh.city}`,
        category: 'warehouse_equipment',
        status: 'in_service',
        warehouseId: wh.id,
        location: `${wh.city} Warehouse Floor`,
        department: 'Maintenance',
        custodian: 'Maintenance Lead',
        acquisitionMode: 'purchase',
        acquisitionDate: capDate.toISOString().slice(0, 10),
        acquisitionCostInr: cost,
        vendorName: 'Voltas Limited',
        poNumber: `PO/WEQ/${capYear}/${String(serialCounter).padStart(3, '0')}`,
        capitalizationDate: capDate.toISOString().slice(0, 10),
        usefulLifeYears: lifeYears,
        salvageValueInr: Math.round(cost * 0.07),
        depreciationMethod: 'slm',
        accumulatedDepreciationInr: accDep,
        netBookValueInr: cost - accDep,
        lastRevaluationDate: null,
        lastRevaluationSurplusInr: 0,
        impairmentIndicator: 'none',
        impairmentLossInr: 0,
        impairmentDate: null,
        maintenanceTier: 'a_critical',
        lastMaintenanceDate: '2025-06-15',
        nextMaintenanceDate: '2025-09-15',
        insuranceValueInr: Math.round(cost * 0.95),
        insuranceExpiryDate: '2026-03-31',
        physicalVerificationDate: '2024-12-15',
        physicalVerificationStatus: 'matched',
        linkedPoId: `PO/WEQ/${capYear}/${String(serialCounter).padStart(3, '0')}`,
        linkedPcvId: null,
        linkedNcrId: null,
        linkedWorkOrderId: null,
      });
      serialCounter++;
    }

    // Office Equipment (1-2 per warehouse)
    const oeCount = 1 + Math.floor(rand() * 2);
    for (let o = 0; o < oeCount; o++) {
      const namePool = ASSET_NAMES_BY_CATEGORY.office_equipment;
      const name = namePool[o % namePool.length];
      const cost = Math.round((rand() * 2 + 0.5) * 100000); // 50K-2.5L
      const lifeYears = 6;
      const capYear = 2020 + Math.floor(rand() * 4);
      const capDate = new Date(capYear, 3, 1);
      const yearsElapsed = Math.max(0, (new Date('2025-07-27').getTime() - capDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
      const annualDep = cost / lifeYears;
      const accDep = Math.min(cost - Math.round(cost * 0.05), Math.round(annualDep * yearsElapsed));
      assets.push({
        id: `asset-OEQ-${String(serialCounter).padStart(4, '0')}`,
        assetCode: `OEQ/${wh.id.slice(-3)}/${String(serialCounter).padStart(3, '0')}`,
        assetName: `${name} - ${wh.city}`,
        category: 'office_equipment',
        status: 'in_service',
        warehouseId: wh.id,
        location: `${wh.city} Office Area`,
        department: 'Administration',
        custodian: 'Admin Officer',
        acquisitionMode: 'purchase',
        acquisitionDate: capDate.toISOString().slice(0, 10),
        acquisitionCostInr: cost,
        vendorName: 'Xerox India',
        poNumber: `PO/OEQ/${capYear}/${String(serialCounter).padStart(3, '0')}`,
        capitalizationDate: capDate.toISOString().slice(0, 10),
        usefulLifeYears: lifeYears,
        salvageValueInr: Math.round(cost * 0.05),
        depreciationMethod: 'slm',
        accumulatedDepreciationInr: accDep,
        netBookValueInr: cost - accDep,
        lastRevaluationDate: null,
        lastRevaluationSurplusInr: 0,
        impairmentIndicator: 'none',
        impairmentLossInr: 0,
        impairmentDate: null,
        maintenanceTier: 'c_standard',
        lastMaintenanceDate: '2025-05-01',
        nextMaintenanceDate: '2025-11-01',
        insuranceValueInr: cost,
        insuranceExpiryDate: '2026-03-31',
        physicalVerificationDate: '2024-12-15',
        physicalVerificationStatus: 'matched',
        linkedPoId: `PO/OEQ/${capYear}/${String(serialCounter).padStart(3, '0')}`,
        linkedPcvId: null,
        linkedNcrId: null,
        linkedWorkOrderId: null,
      });
      serialCounter++;
    }
  });

  return assets;
}

function generateMaintenanceHistory(assets: Asset[]): MaintenanceHistoryEntry[] {
  const rand = seededRandom(787878);
  const history: MaintenanceHistoryEntry[] = [];
  const types: ('preventive' | 'corrective' | 'predictive' | 'overhaul')[] = ['preventive', 'corrective', 'predictive', 'overhaul'];
  const outcomes: ('success' | 'partial' | 'failed')[] = ['success', 'partial', 'failed'];
  const technicians = ['Ramesh Kumar', 'Suresh Patel', 'Mahesh Singh', 'Anil Kumar', 'Vikram Reddy', 'Sai Krishnan', 'Deepak Sharma', 'Rajiv Mehta'];

  // Generate 3-7 maintenance entries per non-land/non-building asset
  assets.forEach((asset) => {
    if (asset.category === 'land' || asset.category === 'building') return;
    const entryCount = 3 + Math.floor(rand() * 5);
    for (let i = 0; i < entryCount; i++) {
      const monthsAgo = Math.floor(rand() * 18);
      const date = new Date(2025, 6 - monthsAgo, 1 + Math.floor(rand() * 28));
      if (date > new Date('2025-07-27')) continue;
      const type = types[Math.floor(rand() * types.length)];
      const outcome = rand() > 0.85 ? (rand() > 0.5 ? 'partial' : 'failed') : 'success';
      const cost = Math.round((rand() * 25 + 2) * 1000); // 2K-27K
      const downtime = type === 'overhaul' ? 8 + rand() * 24 : 0.5 + rand() * 4;
      history.push({
        assetId: asset.id,
        assetName: asset.assetName,
        date: date.toISOString().slice(0, 10),
        type,
        costInr: cost,
        downtimeHours: Math.round(downtime * 10) / 10,
        technician: technicians[Math.floor(rand() * technicians.length)],
        workOrderId: `WO/2025/${String(1000 + history.length).padStart(4, '0')}`,
        outcome,
      });
    }
  });
  return history.sort((a, b) => b.date.localeCompare(a.date));
}

function generateAssetTransfers(assets: Asset[]): AssetTransfer[] {
  const rand = seededRandom(919191);
  const transfers: AssetTransfer[] = [];
  const reasons = ['Capacity rebalancing', 'New project deployment', 'Maintenance reallocation', 'Disaster recovery', 'Equipment sharing', 'Pilot program'];
  const approvers = ['CFO Office', 'Regional Manager', 'Asset Committee', 'Operations Director'];

  // Generate ~10 transfers
  for (let i = 0; i < 10; i++) {
    const asset = assets[Math.floor(rand() * assets.length)];
    if (asset.category === 'land' || asset.category === 'building') continue;
    const fromWh = asset.warehouseId;
    const toWh = warehouses[Math.floor(rand() * warehouses.length)].id;
    if (fromWh === toWh) continue;
    const daysAgo = Math.floor(rand() * 90);
    const date = new Date(2025, 6, 27 - daysAgo);
    const statuses: AssetTransfer['status'][] = ['initiated', 'in_transit', 'received', 'rejected'];
    const statusWeights = [0.2, 0.15, 0.6, 0.05];
    let r = rand(), status: AssetTransfer['status'] = 'received';
    for (let s = 0; s < statuses.length; s++) { r -= statusWeights[s]; if (r <= 0) { status = statuses[s]; break; } }
    transfers.push({
      id: `xfer-${String(i + 1).padStart(4, '0')}`,
      transferCode: `TRF/2025/${String(i + 1).padStart(3, '0')}`,
      assetId: asset.id,
      assetName: asset.assetName,
      fromWarehouseId: fromWh,
      toWarehouseId: toWh,
      transferDate: date.toISOString().slice(0, 10),
      transferReason: reasons[Math.floor(rand() * reasons.length)],
      bookValueAtTransfer: asset.netBookValueInr,
      approvedBy: approvers[Math.floor(rand() * approvers.length)],
      status,
      journalEntryId: `JE/TRF/2025/${String(i + 1).padStart(3, '0')}`,
    });
  }
  return transfers.sort((a, b) => b.transferDate.localeCompare(a.transferDate));
}

function generateAssetDisposals(assets: Asset[]): AssetDisposal[] {
  const rand = seededRandom(333444);
  const disposals: AssetDisposal[] = [];
  const disposedAssets = assets.filter((a) => a.status === 'disposed' || a.status === 'held_for_sale').slice(0, 8);

  disposedAssets.forEach((asset, i) => {
    const daysAgo = Math.floor(rand() * 180);
    const date = new Date(2025, 6, 27 - daysAgo);
    const modes: DisposalMode[] = ['sale', 'scrap', 'donation', 'transfer_out'];
    const mode = modes[Math.floor(rand() * modes.length)];
    const saleProceeds = mode === 'sale' ? Math.round(asset.netBookValueInr * (0.4 + rand() * 0.6)) : 0;
    const gainLoss = saleProceeds - asset.netBookValueInr;
    const buyers = ['Surplus Equipment Co.', 'Local Scrap Dealer', 'NGO - Educational Trust', 'Sister Facility - Hyderabad', 'Auction House Pvt Ltd'];
    disposals.push({
      id: `disp-${String(i + 1).padStart(4, '0')}`,
      disposalCode: `DSP/2025/${String(i + 1).padStart(3, '0')}`,
      assetId: asset.id,
      assetName: asset.assetName,
      category: asset.category,
      disposalDate: date.toISOString().slice(0, 10),
      disposalMode: mode,
      originalCostInr: asset.acquisitionCostInr,
      accumulatedDepreciationInr: asset.accumulatedDepreciationInr,
      netBookValueInr: asset.netBookValueInr,
      saleProceedsInr: saleProceeds,
      gainLossInr: gainLoss,
      buyerOrRecipient: buyers[Math.floor(rand() * buyers.length)],
      approvalStatus: rand() > 0.2 ? 'approved' : (rand() > 0.5 ? 'pending' : 'rejected'),
      journalEntryId: `JE/DSP/2025/${String(i + 1).padStart(3, '0')}`,
    });
  });
  return disposals.sort((a, b) => b.disposalDate.localeCompare(a.disposalDate));
}

// ============================================================================
// Constants
// ============================================================================
const STATUS_LABELS: Record<AssetStatus, string> = {
  in_service: 'In Service',
  under_installation: 'Under Installation',
  under_maintenance: 'Under Maintenance',
  idle: 'Idle',
  impaired: 'Impaired',
  held_for_sale: 'Held for Sale',
  disposed: 'Disposed',
  capitalized_wip: 'Capitalized WIP',
};
const STATUS_COLORS: Record<AssetStatus, string> = {
  in_service: '#10b981',
  under_installation: '#3b82f6',
  under_maintenance: '#f59e0b',
  idle: '#94a3b8',
  impaired: '#ef4444',
  held_for_sale: '#a855f7',
  disposed: '#6b7280',
  capitalized_wip: '#06b6d4',
};

const METHOD_LABELS: Record<DepreciationMethod, string> = {
  slm: 'Straight Line',
  wdv: 'Written Down Value',
  uop: 'Units of Production',
};

const IMPAIRMENT_LABELS: Record<ImpairmentIndicator, string> = {
  none: 'None',
  physical_damage: 'Physical Damage',
  obsolescence: 'Obsolescence',
  market_decline: 'Market Decline',
  regulatory_change: 'Regulatory Change',
  underutilization: 'Underutilization',
};

const CATEGORY_LABELS: Record<AssetCategory, string> = Object.fromEntries(
  ASSET_CATEGORIES.map((c) => [c.id, c.label])
) as Record<AssetCategory, string>;

const CATEGORY_COLORS: Record<AssetCategory, string> = Object.fromEntries(
  ASSET_CATEGORIES.map((c) => [c.id, c.color])
) as Record<AssetCategory, string>;

const CATEGORY_ICONS: Record<AssetCategory, any> = Object.fromEntries(
  ASSET_CATEGORIES.map((c) => [c.id, c.icon])
) as Record<AssetCategory, any>;

const TIER_LABELS: Record<MaintenanceTier, string> = {
  a_critical: 'A - Critical',
  b_essential: 'B - Essential',
  c_standard: 'C - Standard',
};

const formatINR = (amount: number, compact = false): string => {
  if (compact) {
    if (Math.abs(amount) >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (Math.abs(amount) >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    if (Math.abs(amount) >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};

const formatPct = (val: number) => `${val.toFixed(1)}%`;

// ============================================================================
// Main Component
// ============================================================================
export function FixedAssetRegisterView() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'depreciation' | 'maintenance' | 'transfers' | 'disposals' | 'compliance' | 'insights'>('portfolio');
  // Initialize all data in a single lazy init to ensure consistency
  const [assets, setAssets] = useState<Asset[]>(() => generateAssets());
  // Derive maintenance/transfers/disposals from assets via useMemo to avoid setState-in-effect lint rule
  const maintenanceHistory = useMemo<MaintenanceHistoryEntry[]>(() => generateMaintenanceHistory(assets), [assets]);
  const transfers = useMemo<AssetTransfer[]>(() => generateAssetTransfers(assets), [assets]);
  const disposals = useMemo<AssetDisposal[]>(() => generateAssetDisposals(assets), [assets]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<AssetStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<AssetCategory | 'all'>('all');
  const [warehouseFilter, setWarehouseFilter] = useState<string>('all');

  const handleRefresh = useCallback(() => {
    const generated = generateAssets();
    setAssets(generated);
    // maintenanceHistory, transfers, disposals auto-recompute via useMemo
    toast({ title: 'Asset register refreshed', description: `${generated.length} assets loaded successfully` });
  }, [toast]);

  // ============================================================================
  // Derived data
  // ============================================================================
  const stats = useMemo(() => {
    if (!assets.length) return null;
    const totalGross = assets.reduce((s, a) => s + a.acquisitionCostInr, 0);
    const totalAccDep = assets.reduce((s, a) => s + a.accumulatedDepreciationInr, 0);
    const totalImpair = assets.reduce((s, a) => s + a.impairmentLossInr, 0);
    const totalNBV = assets.reduce((s, a) => s + a.netBookValueInr, 0);
    const totalInsurance = assets.reduce((s, a) => s + a.insuranceValueInr, 0);
    const totalRevaluation = assets.reduce((s, a) => s + a.lastRevaluationSurplusInr, 0);
    const inService = assets.filter((a) => a.status === 'in_service').length;
    const underMaintenance = assets.filter((a) => a.status === 'under_maintenance').length;
    const impaired = assets.filter((a) => a.status === 'impaired').length;
    const heldForSale = assets.filter((a) => a.status === 'held_for_sale').length;
    const insuranceExpiring90Days = assets.filter((a) => {
      const days = (new Date(a.insuranceExpiryDate).getTime() - new Date('2025-07-27').getTime()) / (1000 * 60 * 60 * 24);
      return days >= 0 && days <= 90;
    }).length;
    const pvPending = assets.filter((a) => a.physicalVerificationStatus === 'pending').length;
    const pvMismatched = assets.filter((a) => a.physicalVerificationStatus === 'mismatched').length;
    const avgUtilization = Math.round((inService / assets.length) * 100);

    return {
      totalAssets: assets.length,
      totalGross, totalAccDep, totalImpair, totalNBV, totalInsurance, totalRevaluation,
      inService, underMaintenance, impaired, heldForSale,
      insuranceExpiring90Days, pvPending, pvMismatched,
      avgUtilization,
      depRatio: Math.round((totalAccDep / totalGross) * 1000) / 10,
    };
  }, [assets]);

  const byCategory = useMemo(() => {
    if (!assets.length) return [];
    return ASSET_CATEGORIES.map((cat) => {
      const items = assets.filter((a) => a.category === cat.id);
      const gross = items.reduce((s, a) => s + a.acquisitionCostInr, 0);
      const accDep = items.reduce((s, a) => s + a.accumulatedDepreciationInr, 0);
      const nbv = items.reduce((s, a) => s + a.netBookValueInr, 0);
      return {
        category: cat.id,
        label: cat.label,
        color: cat.color,
        count: items.length,
        grossValue: gross,
        accDepreciation: accDep,
        netBookValue: nbv,
        depRatio: gross > 0 ? Math.round((accDep / gross) * 1000) / 10 : 0,
      };
    }).filter((c) => c.count > 0);
  }, [assets]);

  const byWarehouse = useMemo(() => {
    if (!assets.length) return [];
    return warehouses.map((wh) => {
      const items = assets.filter((a) => a.warehouseId === wh.id);
      const gross = items.reduce((s, a) => s + a.acquisitionCostInr, 0);
      const nbv = items.reduce((s, a) => s + a.netBookValueInr, 0);
      return {
        warehouseId: wh.id,
        warehouseName: wh.name,
        city: wh.city,
        count: items.length,
        grossValue: gross,
        netBookValue: nbv,
      };
    }).filter((w) => w.count > 0);
  }, [assets]);

  const byStatus = useMemo(() => {
    if (!assets.length) return [];
    return Object.entries(STATUS_LABELS).map(([status, label]) => {
      const items = assets.filter((a) => a.status === status as AssetStatus);
      return {
        status: status as AssetStatus,
        label,
        color: STATUS_COLORS[status as AssetStatus],
        count: items.length,
        nbv: items.reduce((s, a) => s + a.netBookValueInr, 0),
      };
    }).filter((s) => s.count > 0);
  }, [assets]);

  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      if (search && !a.assetName.toLowerCase().includes(search.toLowerCase()) &&
          !a.assetCode.toLowerCase().includes(search.toLowerCase()) &&
          !a.custodian.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && a.category !== categoryFilter) return false;
      if (warehouseFilter !== 'all' && a.warehouseId !== warehouseFilter) return false;
      return true;
    });
  }, [assets, search, statusFilter, categoryFilter, warehouseFilter]);

  // Depreciation schedule for selected asset (or aggregate)
  const depreciationSchedule = useMemo((): DepreciationScheduleEntry[] => {
    if (!selectedAsset) return [];
    const asset = selectedAsset;
    if (asset.usefulLifeYears === 0 || asset.depreciationMethod === 'slm') {
      // SLM schedule
      const annualDep = asset.usefulLifeYears > 0 ? (asset.acquisitionCostInr - asset.salvageValueInr) / asset.usefulLifeYears : 0;
      const schedule: DepreciationScheduleEntry[] = [];
      let opening = asset.acquisitionCostInr;
      let cumulative = 0;
      const years = asset.usefulLifeYears || 0;
      for (let y = 1; y <= Math.max(years, 1); y++) {
        const dep = Math.min(annualDep, opening - asset.salvageValueInr);
        const closing = opening - dep;
        cumulative += dep;
        schedule.push({
          year: y,
          openingBookValue: Math.round(opening),
          depreciationExpense: Math.round(dep),
          closingBookValue: Math.round(closing),
          cumulativeDepreciation: Math.round(cumulative),
        });
        opening = closing;
      }
      return schedule;
    }
    // WDV schedule (approximation)
    const rate = 1 - Math.pow(asset.salvageValueInr / asset.acquisitionCostInr, 1 / asset.usefulLifeYears);
    const schedule: DepreciationScheduleEntry[] = [];
    let opening = asset.acquisitionCostInr;
    let cumulative = 0;
    for (let y = 1; y <= asset.usefulLifeYears; y++) {
      const dep = opening * rate;
      const closing = opening - dep;
      cumulative += dep;
      schedule.push({
        year: y,
        openingBookValue: Math.round(opening),
        depreciationExpense: Math.round(dep),
        closingBookValue: Math.round(closing),
        cumulativeDepreciation: Math.round(cumulative),
      });
      opening = closing;
    }
    return schedule;
  }, [selectedAsset]);

  // Insights
  const insights = useMemo(() => {
    if (!assets.length || !stats) return [];
    const list: { severity: 'danger' | 'warning' | 'success' | 'info'; title: string; detail: string; icon: any }[] = [];

    // Impaired assets
    if (stats.impaired > 0) {
      const impairedNbv = assets.filter((a) => a.status === 'impaired').reduce((s, a) => s + a.netBookValueInr, 0);
      list.push({
        severity: 'danger',
        title: `${stats.impaired} Impaired Asset${stats.impaired > 1 ? 's' : ''} — NBV at risk`,
        detail: `₹${(impairedNbv / 100000).toFixed(2)} L book value requires impairment review. Ind AS 36 requires recovery assessment.`,
        icon: AlertCircle,
      });
    }

    // Insurance expiring soon
    if (stats.insuranceExpiring90Days > 0) {
      list.push({
        severity: 'warning',
        title: `${stats.insuranceExpiring90Days} Asset${stats.insuranceExpiring90Days > 1 ? 's' : ''} with Insurance Expiring in 90 Days`,
        detail: `Renew insurance policies before March 31, 2026 to maintain continuous coverage and comply with audit requirements.`,
        icon: ShieldCheck,
      });
    }

    // Physical verification pending
    if (stats.pvPending > 0 || stats.pvMismatched > 0) {
      list.push({
        severity: 'warning',
        title: `Physical Verification Incomplete: ${stats.pvPending} Pending, ${stats.pvMismatched} Mismatched`,
        detail: `Schedule physical verification for all pending assets. Investigate ${stats.pvMismatched} mismatches as per asset policy.`,
        icon: Eye,
      });
    }

    // Depreciation ratio
    if (stats.depRatio > 60) {
      list.push({
        severity: 'info',
        title: `Depreciation Ratio at ${stats.depRatio}% — Capital Expenditure Review Recommended`,
        detail: `Accumulated depreciation exceeds 60% of gross block. Plan CAPEX for asset replacement to maintain operational efficiency.`,
        icon: TrendingUp,
      });
    } else {
      list.push({
        severity: 'success',
        title: `Healthy Asset Age Profile — Depreciation at ${stats.depRatio}%`,
        detail: `Asset portfolio is relatively new. Continue preventive maintenance to maximize useful life and ROI.`,
        icon: CheckCircle2,
      });
    }

    // Maintenance overdue
    const maintenanceOverdue = assets.filter((a) => {
      if (a.category === 'land') return false;
      return new Date(a.nextMaintenanceDate) < new Date('2025-07-27');
    });
    if (maintenanceOverdue.length > 0) {
      list.push({
        severity: 'danger',
        title: `${maintenanceOverdue.length} Asset${maintenanceOverdue.length > 1 ? 's' : ''} with Overdue Maintenance`,
        detail: `Schedule maintenance immediately to prevent breakdown, safety incidents, and accelerated depreciation.`,
        icon: Wrench,
      });
    }

    // Held-for-sale assets
    if (stats.heldForSale > 0) {
      const heldNbv = assets.filter((a) => a.status === 'held_for_sale').reduce((s, a) => s + a.netBookValueInr, 0);
      list.push({
        severity: 'info',
        title: `${stats.heldForSale} Asset${stats.heldForSale > 1 ? 's' : ''} Held for Sale`,
        detail: `₹${(heldNbv / 100000).toFixed(2)} L classified as held-for-sale per Ind AS 105. Plan disposal within 12 months.`,
        icon: Banknote,
      });
    }

    // Revaluation surplus
    if (stats.totalRevaluation > 0) {
      list.push({
        severity: 'success',
        title: `Revaluation Reserve: ₹${(stats.totalRevaluation / 10000000).toFixed(2)} Cr`,
        detail: `Land revaluation surplus recognized in OCI per Ind AS 16. Available for future bonus issue or offset against impairment.`,
        icon: Sparkles,
      });
    }

    return list;
  }, [assets, stats]);

  // ============================================================================
  // Handlers
  // ============================================================================
  const tabs = [
    { id: 'portfolio', label: 'Asset Portfolio', icon: Briefcase },
    { id: 'depreciation', label: 'Depreciation', icon: Calculator },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'transfers', label: 'Transfers', icon: ArrowRightLeft },
    { id: 'disposals', label: 'Disposals', icon: Trash2 },
    { id: 'compliance', label: 'Compliance', icon: ShieldCheck },
    { id: 'insights', label: 'Insights', icon: Sparkles },
  ] as const;

  if (!stats) {
    return (
      <div className="far-loading">
        <RefreshCw className="far-loading-icon" />
        <p>Loading Fixed Asset Register...</p>
      </div>
    );
  }

  // ============================================================================
  // Render
  // ============================================================================
  return (
    <div className="far-container">
      {/* Header with animated gradient top border */}
      <div className="far-header">
        <div className="far-header-top-border" />
        <div className="far-header-content">
          <div className="far-header-left">
            <div className="far-header-icon-wrapper">
              <Building className="far-header-icon" />
            </div>
            <div>
              <h1 className="far-header-title">Fixed Asset Register</h1>
              <p className="far-header-subtitle">
                Capital asset lifecycle management · Companies Act Schedule II · Ind AS 16 / 36 / 105
              </p>
            </div>
          </div>
          <div className="far-header-right">
            <div className="far-header-badge far-header-badge-primary">
              <CheckCircle2 className="w-3 h-3" />
              <span>{stats.totalAssets} Assets</span>
            </div>
            <div className="far-header-badge far-header-badge-info">
              <Calendar className="w-3 h-3" />
              <span>FY 2025-26</span>
            </div>
            <Button onClick={handleRefresh} variant="outline" size="sm" className="press-scale btn-outline-animate far-header-refresh">
              <RefreshCw className="w-3 h-3 mr-1" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Banner */}
      <div className="far-kpi-banner">
        <div className="far-kpi-main">
          <div className="far-kpi-main-icon">
            <Coins className="w-7 h-7" />
          </div>
          <div>
            <p className="far-kpi-main-label">Gross Block Value</p>
            <p className="far-kpi-main-value">{formatINR(stats.totalGross, true)}</p>
            <p className="far-kpi-main-sub">
              Net Book Value: <strong>{formatINR(stats.totalNBV, true)}</strong>
            </p>
          </div>
        </div>
        <div className="far-kpi-sub-grid">
          <div className="far-kpi-tile far-kpi-tile-blue">
            <div className="far-kpi-tile-icon"><Building2 className="w-4 h-4" /></div>
            <div>
              <p className="far-kpi-tile-label">Total Assets</p>
              <p className="far-kpi-tile-value">{stats.totalAssets}</p>
            </div>
          </div>
          <div className="far-kpi-tile far-kpi-tile-green">
            <div className="far-kpi-tile-icon"><CheckCircle2 className="w-4 h-4" /></div>
            <div>
              <p className="far-kpi-tile-label">In Service</p>
              <p className="far-kpi-tile-value">{stats.inService}</p>
            </div>
          </div>
          <div className="far-kpi-tile far-kpi-tile-amber">
            <div className="far-kpi-tile-icon"><Wrench className="w-4 h-4" /></div>
            <div>
              <p className="far-kpi-tile-label">Under Maint.</p>
              <p className="far-kpi-tile-value">{stats.underMaintenance}</p>
            </div>
          </div>
          <div className="far-kpi-tile far-kpi-tile-red">
            <div className="far-kpi-tile-icon"><AlertTriangle className="w-4 h-4" /></div>
            <div>
              <p className="far-kpi-tile-label">Impaired</p>
              <p className="far-kpi-tile-value">{stats.impaired}</p>
            </div>
          </div>
          <div className="far-kpi-tile far-kpi-tile-purple">
            <div className="far-kpi-tile-icon"><Banknote className="w-4 h-4" /></div>
            <div>
              <p className="far-kpi-tile-label">Held for Sale</p>
              <p className="far-kpi-tile-value">{stats.heldForSale}</p>
            </div>
          </div>
          <div className="far-kpi-tile far-kpi-tile-cyan">
            <div className="far-kpi-tile-icon"><TrendingDown className="w-4 h-4" /></div>
            <div>
              <p className="far-kpi-tile-label">Acc. Depreciation</p>
              <p className="far-kpi-tile-value">{formatINR(stats.totalAccDep, true)}</p>
            </div>
          </div>
          <div className="far-kpi-tile far-kpi-tile-pink">
            <div className="far-kpi-tile-icon"><Percent className="w-4 h-4" /></div>
            <div>
              <p className="far-kpi-tile-label">Dep. Ratio</p>
              <p className="far-kpi-tile-value">{stats.depRatio}%</p>
            </div>
          </div>
          <div className="far-kpi-tile far-kpi-tile-indigo">
            <div className="far-kpi-tile-icon"><ShieldCheck className="w-4 h-4" /></div>
            <div>
              <p className="far-kpi-tile-label">Insured Value</p>
              <p className="far-kpi-tile-value">{formatINR(stats.totalInsurance, true)}</p>
            </div>
          </div>
          <div className="far-kpi-tile far-kpi-tile-orange">
            <div className="far-kpi-tile-icon"><Clock className="w-4 h-4" /></div>
            <div>
              <p className="far-kpi-tile-label">Insurance ≤90d</p>
              <p className="far-kpi-tile-value">{stats.insuranceExpiring90Days}</p>
            </div>
          </div>
          <div className="far-kpi-tile far-kpi-tile-violet">
            <div className="far-kpi-tile-icon"><Sparkles className="w-4 h-4" /></div>
            <div>
              <p className="far-kpi-tile-label">Reval. Reserve</p>
              <p className="far-kpi-tile-value">{formatINR(stats.totalRevaluation, true)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="far-tab-bar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn('far-tab', activeTab === tab.id && 'far-tab-active')}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="far-tab-content">
        {activeTab === 'portfolio' && (
          <AssetPortfolioTab
            assets={filteredAssets}
            byCategory={byCategory}
            byWarehouse={byWarehouse}
            byStatus={byStatus}
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            warehouseFilter={warehouseFilter}
            setWarehouseFilter={setWarehouseFilter}
            onSelectAsset={setSelectedAsset}
          />
        )}
        {activeTab === 'depreciation' && (
          <DepreciationTab
            byCategory={byCategory}
            selectedAsset={selectedAsset}
            depreciationSchedule={depreciationSchedule}
            assets={assets}
            onSelectAsset={setSelectedAsset}
          />
        )}
        {activeTab === 'maintenance' && (
          <MaintenanceTab assets={assets} history={maintenanceHistory} onSelectAsset={setSelectedAsset} />
        )}
        {activeTab === 'transfers' && <TransfersTab transfers={transfers} />}
        {activeTab === 'disposals' && <DisposalsTab disposals={disposals} />}
        {activeTab === 'compliance' && <ComplianceTab assets={assets} stats={stats} onSelectAsset={setSelectedAsset} />}
        {activeTab === 'insights' && <InsightsTab insights={insights} stats={stats} byCategory={byCategory} />}
      </div>

      {/* Asset Detail Modal */}
      {selectedAsset && (
        <AssetDetailModal
          asset={selectedAsset}
          depreciationSchedule={depreciationSchedule}
          maintenanceHistory={maintenanceHistory.filter((m) => m.assetId === selectedAsset.id)}
          onClose={() => setSelectedAsset(null)}
        />
      )}
    </div>
  );
}

// ============================================================================
// Sub-components
// ============================================================================
interface AssetPortfolioTabProps {
  assets: Asset[];
  byCategory: any[];
  byWarehouse: any[];
  byStatus: any[];
  search: string;
  setSearch: (s: string) => void;
  statusFilter: AssetStatus | 'all';
  setStatusFilter: (s: AssetStatus | 'all') => void;
  categoryFilter: AssetCategory | 'all';
  setCategoryFilter: (c: AssetCategory | 'all') => void;
  warehouseFilter: string;
  setWarehouseFilter: (w: string) => void;
  onSelectAsset: (a: Asset) => void;
}

function AssetPortfolioTab({
  assets, byCategory, byWarehouse, byStatus,
  search, setSearch, statusFilter, setStatusFilter,
  categoryFilter, setCategoryFilter, warehouseFilter, setWarehouseFilter,
  onSelectAsset,
}: AssetPortfolioTabProps) {
  return (
    <div className="far-tab-pane">
      {/* Chart row */}
      <div className="far-chart-row">
        <Card className="hover-lift-sm far-chart-card">
          <div className="far-chart-header">
            <h3 className="far-chart-title">Gross Block vs Net Book Value by Category</h3>
            <p className="far-chart-subtitle">Capital allocation across asset categories</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={byCategory} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatINR(v, true)} />
              <Tooltip formatter={(v: number) => formatINR(v)} contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="grossValue" name="Gross Block" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="netBookValue" name="Net Book Value" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Line dataKey="depRatio" name="Dep. %" stroke="#f59e0b" strokeWidth={2} yAxisId="right" />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
        <Card className="hover-lift-sm far-chart-card">
          <div className="far-chart-header">
            <h3 className="far-chart-title">Asset Distribution by Status</h3>
            <p className="far-chart-subtitle">Operational state of all assets</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={byStatus}
                dataKey="count"
                nameKey="label"
                cx="50%" cy="50%"
                outerRadius={90}
                innerRadius={50}
                label={({ label, count }) => `${label}: ${count}`}
                labelLine={false}
              >
                {byStatus.map((s, i) => (
                  <Cell key={i} fill={s.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number, n: string) => [v, n]} contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card className="hover-lift-sm far-chart-card">
          <div className="far-chart-header">
            <h3 className="far-chart-title">Asset Count by Warehouse</h3>
            <p className="far-chart-subtitle">Geographic distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byWarehouse} layout="vertical" margin={{ top: 10, right: 20, left: 80, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="city" type="category" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
              <Bar dataKey="count" name="Asset Count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Filter bar */}
      <div className="far-filter-bar">
        <div className="far-filter-search">
          <Search className="w-4 h-4" />
          <Input
            placeholder="Search by asset name, code, or custodian..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="far-filter-input"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as AssetStatus | 'all')}
          className="far-filter-select"
        >
          <option value="all">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as AssetCategory | 'all')}
          className="far-filter-select"
        >
          <option value="all">All Categories</option>
          {ASSET_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
        <select
          value={warehouseFilter}
          onChange={(e) => setWarehouseFilter(e.target.value)}
          className="far-filter-select"
        >
          <option value="all">All Warehouses</option>
          {warehouses.map((w) => (
            <option key={w.id} value={w.id}>{w.city}</option>
          ))}
        </select>
        <div className="far-filter-count">
          Showing <strong>{assets.length}</strong> asset{assets.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Assets table */}
      <Card className="hover-lift-sm far-table-card">
        <div className="far-table-wrapper">
          <table className="far-table">
            <thead>
              <tr>
                <th>Asset Code</th>
                <th>Asset Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Warehouse</th>
                <th>Custodian</th>
                <th>Acquisition Cost</th>
                <th>Acc. Dep.</th>
                <th>Net Book Value</th>
                <th>Dep. Method</th>
                <th>Useful Life</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {assets.slice(0, 50).map((asset) => {
                const Icon = CATEGORY_ICONS[asset.category];
                const wh = warehouses.find((w) => w.id === asset.warehouseId);
                return (
                  <tr key={asset.id} className="far-table-row" onClick={() => onSelectAsset(asset)}>
                    <td><span className="far-asset-code">{asset.assetCode}</span></td>
                    <td>
                      <div className="far-asset-name-cell">
                        <span className="far-asset-icon" style={{ background: `${CATEGORY_COLORS[asset.category]}20`, color: CATEGORY_COLORS[asset.category] }}>
                          <Icon className="w-3.5 h-3.5" />
                        </span>
                        <span>{asset.assetName}</span>
                      </div>
                    </td>
                    <td><span className="far-pill" style={{ background: `${CATEGORY_COLORS[asset.category]}20`, color: CATEGORY_COLORS[asset.category] }}>{CATEGORY_LABELS[asset.category]}</span></td>
                    <td>
                      <span className="far-pill" style={{ background: `${STATUS_COLORS[asset.status]}20`, color: STATUS_COLORS[asset.status] }}>
                        {STATUS_LABELS[asset.status]}
                      </span>
                    </td>
                    <td>{wh?.city || '—'}</td>
                    <td>{asset.custodian}</td>
                    <td className="far-amount">{formatINR(asset.acquisitionCostInr, true)}</td>
                    <td className="far-amount">{formatINR(asset.accumulatedDepreciationInr, true)}</td>
                    <td className="far-amount far-amount-strong">{formatINR(asset.netBookValueInr, true)}</td>
                    <td><span className="far-pill far-pill-neutral">{METHOD_LABELS[asset.depreciationMethod]}</span></td>
                    <td>{asset.usefulLifeYears > 0 ? `${asset.usefulLifeYears} yr` : '∞'}</td>
                    <td>
                      <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onSelectAsset(asset); }}>
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {assets.length > 50 && (
          <div className="far-table-footer">
            Showing first 50 of {assets.length} assets. Use filters to narrow down.
          </div>
        )}
      </Card>
    </div>
  );
}

interface DepreciationTabProps {
  byCategory: any[];
  selectedAsset: Asset | null;
  depreciationSchedule: DepreciationScheduleEntry[];
  assets: Asset[];
  onSelectAsset: (a: Asset) => void;
}

function DepreciationTab({ byCategory, selectedAsset, depreciationSchedule, assets, onSelectAsset }: DepreciationTabProps) {
  return (
    <div className="far-tab-pane">
      {/* Summary cards */}
      <div className="far-summary-grid">
        <div className="far-summary-card far-summary-indigo">
          <div className="far-summary-icon"><Coins className="w-5 h-5" /></div>
          <div>
            <p className="far-summary-label">Total Gross Block</p>
            <p className="far-summary-value">{formatINR(byCategory.reduce((s, c) => s + c.grossValue, 0), true)}</p>
          </div>
        </div>
        <div className="far-summary-card far-summary-amber">
          <div className="far-summary-icon"><TrendingDown className="w-5 h-5" /></div>
          <div>
            <p className="far-summary-label">Total Acc. Depreciation</p>
            <p className="far-summary-value">{formatINR(byCategory.reduce((s, c) => s + c.accDepreciation, 0), true)}</p>
          </div>
        </div>
        <div className="far-summary-card far-summary-green">
          <div className="far-summary-icon"><TrendingUp className="w-5 h-5" /></div>
          <div>
            <p className="far-summary-label">Total Net Book Value</p>
            <p className="far-summary-value">{formatINR(byCategory.reduce((s, c) => s + c.netBookValue, 0), true)}</p>
          </div>
        </div>
        <div className="far-summary-card far-summary-purple">
          <div className="far-summary-icon"><Percent className="w-5 h-5" /></div>
          <div>
            <p className="far-summary-label">Weighted Dep. Ratio</p>
            <p className="far-summary-value">
              {(() => {
                const gross = byCategory.reduce((s, c) => s + c.grossValue, 0);
                const acc = byCategory.reduce((s, c) => s + c.accDepreciation, 0);
                return `${(acc / gross * 100).toFixed(1)}%`;
              })()}
            </p>
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <Card className="hover-lift-sm far-chart-card">
        <div className="far-chart-header">
          <h3 className="far-chart-title">Depreciation by Category</h3>
          <p className="far-chart-subtitle">Gross block, accumulated depreciation, and net book value per asset class</p>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={byCategory} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" height={80} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatINR(v, true)} />
            <Tooltip formatter={(v: number) => formatINR(v)} contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            <Bar dataKey="grossValue" name="Gross Block" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="accDepreciation" name="Acc. Depreciation" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="netBookValue" name="Net Book Value" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Category table */}
      <Card className="hover-lift-sm far-table-card">
        <div className="far-table-wrapper">
          <table className="far-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Asset Count</th>
                <th>Gross Block</th>
                <th>Acc. Depreciation</th>
                <th>Net Book Value</th>
                <th>Dep. Ratio</th>
                <th>Visualization</th>
              </tr>
            </thead>
            <tbody>
              {byCategory.map((c) => (
                <tr key={c.category} className="far-table-row">
                  <td>
                    <div className="far-asset-name-cell">
                      <span className="far-asset-icon" style={{ background: `${c.color}20`, color: c.color }}>
                        {(() => { const Icon = CATEGORY_ICONS[c.category as AssetCategory]; return <Icon className="w-3.5 h-3.5" />; })()}
                      </span>
                      <span>{c.label}</span>
                    </div>
                  </td>
                  <td>{c.count}</td>
                  <td className="far-amount">{formatINR(c.grossValue, true)}</td>
                  <td className="far-amount">{formatINR(c.accDepreciation, true)}</td>
                  <td className="far-amount far-amount-strong">{formatINR(c.netBookValue, true)}</td>
                  <td>{c.depRatio}%</td>
                  <td>
                    <div className="far-progress-bar">
                      <div className="far-progress-fill" style={{ width: `${c.depRatio}%`, background: c.color }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Per-asset depreciation schedule */}
      <Card className="hover-lift-sm far-chart-card">
        <div className="far-chart-header">
          <h3 className="far-chart-title">Asset Depreciation Schedule</h3>
          <p className="far-chart-subtitle">
            {selectedAsset
              ? `Schedule for ${selectedAsset.assetName} (${selectedAsset.assetCode})`
              : 'Select an asset from the table below to view its year-by-year depreciation schedule'}
          </p>
        </div>
        {selectedAsset && depreciationSchedule.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={depreciationSchedule} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="depGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} tickFormatter={(v) => `Yr ${v}`} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatINR(v, true)} />
                <Tooltip formatter={(v: number) => formatINR(v)} contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="closingBookValue" name="Book Value" stroke="#6366f1" fill="url(#depGradient)" strokeWidth={2} />
                <Line type="monotone" dataKey="depreciationExpense" name="Annual Depreciation" stroke="#f59e0b" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>

            <div className="far-schedule-table-wrapper">
              <table className="far-table">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Opening Book Value</th>
                    <th>Depreciation Expense</th>
                    <th>Cumulative Depreciation</th>
                    <th>Closing Book Value</th>
                  </tr>
                </thead>
                <tbody>
                  {depreciationSchedule.map((s) => (
                    <tr key={s.year} className="far-table-row">
                      <td>Year {s.year}</td>
                      <td className="far-amount">{formatINR(s.openingBookValue, true)}</td>
                      <td className="far-amount">{formatINR(s.depreciationExpense, true)}</td>
                      <td className="far-amount">{formatINR(s.cumulativeDepreciation, true)}</td>
                      <td className="far-amount far-amount-strong">{formatINR(s.closingBookValue, true)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="far-empty-state">
            <Calculator className="w-12 h-12 far-empty-icon" />
            <p className="far-empty-text">Select an asset to view its depreciation schedule</p>
            <div className="far-asset-quick-list">
              {assets.slice(0, 8).map((a) => (
                <button key={a.id} className="far-asset-quick-item" onClick={() => onSelectAsset(a)}>
                  <span className="far-asset-code">{a.assetCode}</span>
                  <span>{a.assetName}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

interface MaintenanceTabProps {
  assets: Asset[];
  history: MaintenanceHistoryEntry[];
  onSelectAsset: (a: Asset) => void;
}

function MaintenanceTab({ assets, history, onSelectAsset }: MaintenanceTabProps) {
  const totalCost = history.reduce((s, h) => s + h.costInr, 0);
  const totalDowntime = history.reduce((s, h) => s + h.downtimeHours, 0);
  const successRate = history.length > 0 ? Math.round((history.filter((h) => h.outcome === 'success').length / history.length) * 100) : 0;

  // Group by type
  const byType = useMemo(() => {
    const types = ['preventive', 'corrective', 'predictive', 'overhaul'];
    return types.map((t) => {
      const items = history.filter((h) => h.type === t);
      return {
        type: t,
        label: t.charAt(0).toUpperCase() + t.slice(1),
        count: items.length,
        cost: items.reduce((s, h) => s + h.costInr, 0),
        downtime: items.reduce((s, h) => s + h.downtimeHours, 0),
      };
    });
  }, [history]);

  // Maintenance due in next 30 days
  const upcomingMaintenance = assets
    .filter((a) => {
      if (a.category === 'land') return false;
      const days = (new Date(a.nextMaintenanceDate).getTime() - new Date('2025-07-27').getTime()) / (1000 * 60 * 60 * 24);
      return days >= 0 && days <= 30;
    })
    .sort((a, b) => a.nextMaintenanceDate.localeCompare(b.nextMaintenanceDate));

  return (
    <div className="far-tab-pane">
      <div className="far-summary-grid">
        <div className="far-summary-card far-summary-blue">
          <div className="far-summary-icon"><Wrench className="w-5 h-5" /></div>
          <div>
            <p className="far-summary-label">Total Maintenance Events</p>
            <p className="far-summary-value">{history.length}</p>
          </div>
        </div>
        <div className="far-summary-card far-summary-amber">
          <div className="far-summary-icon"><Coins className="w-5 h-5" /></div>
          <div>
            <p className="far-summary-label">Total Maintenance Cost</p>
            <p className="far-summary-value">{formatINR(totalCost, true)}</p>
          </div>
        </div>
        <div className="far-summary-card far-summary-red">
          <div className="far-summary-icon"><Clock className="w-5 h-5" /></div>
          <div>
            <p className="far-summary-label">Total Downtime</p>
            <p className="far-summary-value">{totalDowntime.toFixed(1)} hrs</p>
          </div>
        </div>
        <div className="far-summary-card far-summary-green">
          <div className="far-summary-icon"><CheckCircle2 className="w-5 h-5" /></div>
          <div>
            <p className="far-summary-label">Success Rate</p>
            <p className="far-summary-value">{successRate}%</p>
          </div>
        </div>
      </div>

      <div className="far-chart-row">
        <Card className="hover-lift-sm far-chart-card">
          <div className="far-chart-header">
            <h3 className="far-chart-title">Maintenance Events by Type</h3>
            <p className="far-chart-subtitle">Cost and count distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={byType} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickFormatter={(v) => formatINR(v, true)} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar yAxisId="left" dataKey="cost" name="Cost" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" dataKey="count" name="Count" stroke="#f59e0b" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
        <Card className="hover-lift-sm far-chart-card">
          <div className="far-chart-header">
            <h3 className="far-chart-title">Upcoming Maintenance (30 days)</h3>
            <p className="far-chart-subtitle">{upcomingMaintenance.length} assets due</p>
          </div>
          <div className="far-maintenance-upcoming-list">
            {upcomingMaintenance.slice(0, 8).map((a) => {
              const days = Math.round((new Date(a.nextMaintenanceDate).getTime() - new Date('2025-07-27').getTime()) / (1000 * 60 * 60 * 24));
              return (
                <div key={a.id} className="far-maintenance-upcoming-item" onClick={() => onSelectAsset(a)}>
                  <div className="far-maintenance-upcoming-info">
                    <span className="far-asset-code">{a.assetCode}</span>
                    <span className="far-maintenance-upcoming-name">{a.assetName}</span>
                  </div>
                  <span className={cn('far-pill', days <= 7 ? 'far-pill-red' : days <= 14 ? 'far-pill-amber' : 'far-pill-blue')}>
                    {days === 0 ? 'Today' : `${days}d`}
                  </span>
                </div>
              );
            })}
            {upcomingMaintenance.length === 0 && (
              <div className="far-empty-state-inline">
                <CheckCircle2 className="w-8 h-8" />
                <p>No maintenance due in next 30 days</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card className="hover-lift-sm far-table-card">
        <div className="far-chart-header">
          <h3 className="far-chart-title">Maintenance History Log</h3>
          <p className="far-chart-subtitle">{history.length} most recent events</p>
        </div>
        <div className="far-table-wrapper">
          <table className="far-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Asset</th>
                <th>Type</th>
                <th>Technician</th>
                <th>Cost</th>
                <th>Downtime</th>
                <th>Work Order</th>
                <th>Outcome</th>
              </tr>
            </thead>
            <tbody>
              {history.slice(0, 30).map((h, i) => (
                <tr key={i} className="far-table-row">
                  <td>{h.date}</td>
                  <td>{h.assetName}</td>
                  <td>
                    <span className="far-pill far-pill-neutral">{h.type}</span>
                  </td>
                  <td>{h.technician}</td>
                  <td className="far-amount">{formatINR(h.costInr, true)}</td>
                  <td>{h.downtimeHours}h</td>
                  <td><span className="far-asset-code">{h.workOrderId}</span></td>
                  <td>
                    <span className={cn('far-pill',
                      h.outcome === 'success' ? 'far-pill-green' :
                      h.outcome === 'partial' ? 'far-pill-amber' : 'far-pill-red')}>
                      {h.outcome}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function TransfersTab({ transfers }: { transfers: AssetTransfer[] }) {
  const byStatus = useMemo(() => {
    const statuses: AssetTransfer['status'][] = ['initiated', 'in_transit', 'received', 'rejected'];
    return statuses.map((s) => ({
      status: s,
      label: s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' '),
      count: transfers.filter((t) => t.status === s).length,
    }));
  }, [transfers]);

  return (
    <div className="far-tab-pane">
      <div className="far-summary-grid">
        {byStatus.map((s, i) => {
          const colors = ['far-summary-blue', 'far-summary-amber', 'far-summary-green', 'far-summary-red'];
          const icons = [Clock, ArrowRightLeft, CheckCircle2, XCircle];
          const Icon = icons[i];
          return (
            <div key={s.status} className={`far-summary-card ${colors[i]}`}>
              <div className="far-summary-icon"><Icon className="w-5 h-5" /></div>
              <div>
                <p className="far-summary-label">{s.label}</p>
                <p className="far-summary-value">{s.count}</p>
              </div>
            </div>
          );
        })}
      </div>

      <Card className="hover-lift-sm far-table-card">
        <div className="far-chart-header">
          <h3 className="far-chart-title">Asset Transfer Log</h3>
          <p className="far-chart-subtitle">Inter-warehouse asset movements with journal entries</p>
        </div>
        <div className="far-table-wrapper">
          <table className="far-table">
            <thead>
              <tr>
                <th>Transfer Code</th>
                <th>Asset</th>
                <th>From</th>
                <th>To</th>
                <th>Date</th>
                <th>Reason</th>
                <th>Book Value</th>
                <th>Approved By</th>
                <th>Journal Entry</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((t) => {
                const fromWh = warehouses.find((w) => w.id === t.fromWarehouseId);
                const toWh = warehouses.find((w) => w.id === t.toWarehouseId);
                return (
                  <tr key={t.id} className="far-table-row">
                    <td><span className="far-asset-code">{t.transferCode}</span></td>
                    <td>{t.assetName}</td>
                    <td>{fromWh?.city || '—'}</td>
                    <td>{toWh?.city || '—'}</td>
                    <td>{t.transferDate}</td>
                    <td>{t.transferReason}</td>
                    <td className="far-amount">{formatINR(t.bookValueAtTransfer, true)}</td>
                    <td>{t.approvedBy}</td>
                    <td><span className="far-asset-code">{t.journalEntryId}</span></td>
                    <td>
                      <span className={cn('far-pill',
                        t.status === 'received' ? 'far-pill-green' :
                        t.status === 'in_transit' ? 'far-pill-amber' :
                        t.status === 'initiated' ? 'far-pill-blue' : 'far-pill-red')}>
                        {t.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function DisposalsTab({ disposals }: { disposals: AssetDisposal[] }) {
  const totalGainLoss = disposals.reduce((s, d) => s + d.gainLossInr, 0);
  const totalProceeds = disposals.reduce((s, d) => s + d.saleProceedsInr, 0);
  const totalNBV = disposals.reduce((s, d) => s + d.netBookValueInr, 0);

  return (
    <div className="far-tab-pane">
      <div className="far-summary-grid">
        <div className="far-summary-card far-summary-purple">
          <div className="far-summary-icon"><Trash2 className="w-5 h-5" /></div>
          <div>
            <p className="far-summary-label">Total Disposals</p>
            <p className="far-summary-value">{disposals.length}</p>
          </div>
        </div>
        <div className="far-summary-card far-summary-amber">
          <div className="far-summary-icon"><TrendingDown className="w-5 h-5" /></div>
          <div>
            <p className="far-summary-label">Total NBV Disposed</p>
            <p className="far-summary-value">{formatINR(totalNBV, true)}</p>
          </div>
        </div>
        <div className="far-summary-card far-summary-green">
          <div className="far-summary-icon"><Banknote className="w-5 h-5" /></div>
          <div>
            <p className="far-summary-label">Sale Proceeds</p>
            <p className="far-summary-value">{formatINR(totalProceeds, true)}</p>
          </div>
        </div>
        <div className={`far-summary-card ${totalGainLoss >= 0 ? 'far-summary-green' : 'far-summary-red'}`}>
          <div className="far-summary-icon">{totalGainLoss >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}</div>
          <div>
            <p className="far-summary-label">Net Gain/(Loss)</p>
            <p className="far-summary-value">{formatINR(totalGainLoss, true)}</p>
          </div>
        </div>
      </div>

      <Card className="hover-lift-sm far-table-card">
        <div className="far-chart-header">
          <h3 className="far-chart-title">Asset Disposal Log</h3>
          <p className="far-chart-subtitle">Disposal events with journal entries per Ind AS 105</p>
        </div>
        <div className="far-table-wrapper">
          <table className="far-table">
            <thead>
              <tr>
                <th>Disposal Code</th>
                <th>Asset</th>
                <th>Category</th>
                <th>Disposal Date</th>
                <th>Mode</th>
                <th>Original Cost</th>
                <th>Acc. Dep.</th>
                <th>Net Book Value</th>
                <th>Sale Proceeds</th>
                <th>Gain/(Loss)</th>
                <th>Buyer/Recipient</th>
                <th>Journal Entry</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {disposals.map((d) => (
                <tr key={d.id} className="far-table-row">
                  <td><span className="far-asset-code">{d.disposalCode}</span></td>
                  <td>{d.assetName}</td>
                  <td><span className="far-pill far-pill-neutral">{CATEGORY_LABELS[d.category]}</span></td>
                  <td>{d.disposalDate}</td>
                  <td><span className="far-pill far-pill-neutral">{d.disposalMode}</span></td>
                  <td className="far-amount">{formatINR(d.originalCostInr, true)}</td>
                  <td className="far-amount">{formatINR(d.accumulatedDepreciationInr, true)}</td>
                  <td className="far-amount">{formatINR(d.netBookValueInr, true)}</td>
                  <td className="far-amount">{formatINR(d.saleProceedsInr, true)}</td>
                  <td className="far-amount">
                    <span style={{ color: d.gainLossInr >= 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                      {formatINR(d.gainLossInr, true)}
                    </span>
                  </td>
                  <td>{d.buyerOrRecipient}</td>
                  <td><span className="far-asset-code">{d.journalEntryId}</span></td>
                  <td>
                    <span className={cn('far-pill',
                      d.approvalStatus === 'approved' ? 'far-pill-green' :
                      d.approvalStatus === 'pending' ? 'far-pill-amber' : 'far-pill-red')}>
                      {d.approvalStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function ComplianceTab({ assets, stats, onSelectAsset }: { assets: Asset[]; stats: any; onSelectAsset: (a: Asset) => void }) {
  const expiringInsurance = assets.filter((a) => {
    const days = (new Date(a.insuranceExpiryDate).getTime() - new Date('2025-07-27').getTime()) / (1000 * 60 * 60 * 24);
    return days >= 0 && days <= 180;
  });

  const pvPending = assets.filter((a) => a.physicalVerificationStatus === 'pending');
  const pvMismatched = assets.filter((a) => a.physicalVerificationStatus === 'mismatched');
  const pvMatched = assets.filter((a) => a.physicalVerificationStatus === 'matched');

  return (
    <div className="far-tab-pane">
      {/* Compliance scorecard */}
      <div className="far-compliance-grid">
        <div className="far-compliance-tile">
          <div className="far-compliance-icon far-compliance-icon-green"><ShieldCheck className="w-5 h-5" /></div>
          <div>
            <p className="far-compliance-label">Insurance Coverage</p>
            <p className="far-compliance-value">{Math.round(((assets.length - expiringInsurance.length) / assets.length) * 100)}%</p>
            <p className="far-compliance-sub">{assets.length - expiringInsurance.length}/{assets.length} assets covered</p>
          </div>
        </div>
        <div className="far-compliance-tile">
          <div className="far-compliance-icon far-compliance-icon-amber"><Eye className="w-5 h-5" /></div>
          <div>
            <p className="far-compliance-label">Physical Verification</p>
            <p className="far-compliance-value">{Math.round((pvMatched.length / assets.length) * 100)}%</p>
            <p className="far-compliance-sub">{pvMatched.length} matched, {pvMismatched.length} mismatched, {pvPending.length} pending</p>
          </div>
        </div>
        <div className="far-compliance-tile">
          <div className="far-compliance-icon far-compliance-icon-red"><AlertTriangle className="w-5 h-5" /></div>
          <div>
            <p className="far-compliance-label">Impairment Review</p>
            <p className="far-compliance-value">{stats.impaired}</p>
            <p className="far-compliance-sub">Assets requiring Ind AS 36 review</p>
          </div>
        </div>
        <div className="far-compliance-tile">
          <div className="far-compliance-icon far-compliance-icon-purple"><Clock className="w-5 h-5" /></div>
          <div>
            <p className="far-compliance-label">Insurance Expiring ≤90d</p>
            <p className="far-compliance-value">{stats.insuranceExpiring90Days}</p>
            <p className="far-compliance-sub">Renewals due before Mar 31, 2026</p>
          </div>
        </div>
      </div>

      {/* Insurance expiring list */}
      <Card className="hover-lift-sm far-table-card">
        <div className="far-chart-header">
          <h3 className="far-chart-title">Insurance Renewals — Within 180 Days</h3>
          <p className="far-chart-subtitle">Schedule renewals with insurance providers</p>
        </div>
        <div className="far-table-wrapper">
          <table className="far-table">
            <thead>
              <tr>
                <th>Asset Code</th>
                <th>Asset Name</th>
                <th>Category</th>
                <th>Insured Value</th>
                <th>Expiry Date</th>
                <th>Days to Expiry</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {expiringInsurance.slice(0, 20).map((a) => {
                const days = Math.round((new Date(a.insuranceExpiryDate).getTime() - new Date('2025-07-27').getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <tr key={a.id} className="far-table-row">
                    <td><span className="far-asset-code">{a.assetCode}</span></td>
                    <td>{a.assetName}</td>
                    <td><span className="far-pill far-pill-neutral">{CATEGORY_LABELS[a.category]}</span></td>
                    <td className="far-amount">{formatINR(a.insuranceValueInr, true)}</td>
                    <td>{a.insuranceExpiryDate}</td>
                    <td>
                      <span className={cn('far-pill', days <= 30 ? 'far-pill-red' : days <= 90 ? 'far-pill-amber' : 'far-pill-blue')}>
                        {days} days
                      </span>
                    </td>
                    <td>
                      <Button size="sm" variant="outline" onClick={() => onSelectAsset(a)}>
                        <Eye className="w-3.5 h-3.5 mr-1" /> View
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Physical verification status */}
      <Card className="hover-lift-sm far-chart-card">
        <div className="far-chart-header">
          <h3 className="far-chart-title">Physical Verification Status</h3>
          <p className="far-chart-subtitle">Asset physical verification per audit requirements</p>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={[
                { name: 'Matched', value: pvMatched.length, color: '#10b981' },
                { name: 'Mismatched', value: pvMismatched.length, color: '#ef4444' },
                { name: 'Pending', value: pvPending.length, color: '#f59e0b' },
              ]}
              dataKey="value"
              nameKey="name"
              cx="50%" cy="50%"
              outerRadius={90}
              innerRadius={50}
              label={({ name, value }) => `${name}: ${value}`}
              labelLine={false}
            >
              {[
                { name: 'Matched', value: pvMatched.length, color: '#10b981' },
                { name: 'Mismatched', value: pvMismatched.length, color: '#ef4444' },
                { name: 'Pending', value: pvPending.length, color: '#f59e0b' },
              ].map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function InsightsTab({ insights, stats, byCategory }: { insights: any[]; stats: any; byCategory: any[] }) {
  return (
    <div className="far-tab-pane">
      {/* Auto-generated insights */}
      <div className="far-insights-list">
        {insights.map((insight, i) => {
          const Icon = insight.icon;
          return (
            <div key={i} className={`far-insight-row far-insight-${insight.severity}`}>
              <div className="far-insight-icon">
                <Icon className="w-5 h-5" />
              </div>
              <div className="far-insight-content">
                <p className="far-insight-title">{insight.title}</p>
                <p className="far-insight-detail">{insight.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Asset Health Scorecard */}
      <Card className="hover-lift-sm far-chart-card">
        <div className="far-chart-header">
          <h3 className="far-chart-title">Asset Health Scorecard</h3>
          <p className="far-chart-subtitle">Composite indicators across the asset portfolio</p>
        </div>
        <div className="far-health-grid">
          <div className="far-health-tile">
            <div className="far-health-header">
              <span className="far-health-label">Utilization Rate</span>
              <span className="far-health-value">{stats.avgUtilization}%</span>
            </div>
            <div className="far-progress-bar">
              <div className="far-progress-fill" style={{ width: `${stats.avgUtilization}%`, background: '#10b981' }} />
            </div>
            <p className="far-health-target">Target: ≥85%</p>
          </div>
          <div className="far-health-tile">
            <div className="far-health-header">
              <span className="far-health-label">Insurance Coverage</span>
              <span className="far-health-value">{Math.round(((stats.totalAssets - stats.insuranceExpiring90Days) / stats.totalAssets) * 100)}%</span>
            </div>
            <div className="far-progress-bar">
              <div className="far-progress-fill" style={{ width: `${((stats.totalAssets - stats.insuranceExpiring90Days) / stats.totalAssets) * 100}%`, background: '#3b82f6' }} />
            </div>
            <p className="far-health-target">Target: 100%</p>
          </div>
          <div className="far-health-tile">
            <div className="far-health-header">
              <span className="far-health-label">Physical Verification</span>
              <span className="far-health-value">{Math.round(((stats.totalAssets - stats.pvPending - stats.pvMismatched) / stats.totalAssets) * 100)}%</span>
            </div>
            <div className="far-progress-bar">
              <div className="far-progress-fill" style={{ width: `${((stats.totalAssets - stats.pvPending - stats.pvMismatched) / stats.totalAssets) * 100}%`, background: '#8b5cf6' }} />
            </div>
            <p className="far-health-target">Target: 100%</p>
          </div>
          <div className="far-health-tile">
            <div className="far-health-header">
              <span className="far-health-label">Impairment Ratio</span>
              <span className="far-health-value">{(stats.impaired / stats.totalAssets * 100).toFixed(1)}%</span>
            </div>
            <div className="far-progress-bar">
              <div className="far-progress-fill" style={{ width: `${(stats.impaired / stats.totalAssets * 100)}%`, background: '#ef4444' }} />
            </div>
            <p className="far-health-target">Target: &lt;5%</p>
          </div>
          <div className="far-health-tile">
            <div className="far-health-header">
              <span className="far-health-label">Depreciation Ratio</span>
              <span className="far-health-value">{stats.depRatio}%</span>
            </div>
            <div className="far-progress-bar">
              <div className="far-progress-fill" style={{ width: `${stats.depRatio}%`, background: '#f59e0b' }} />
            </div>
            <p className="far-health-target">Target: &lt;60%</p>
          </div>
          <div className="far-health-tile">
            <div className="far-health-header">
              <span className="far-health-label">Held-for-Sale Ratio</span>
              <span className="far-health-value">{(stats.heldForSale / stats.totalAssets * 100).toFixed(1)}%</span>
            </div>
            <div className="far-progress-bar">
              <div className="far-progress-fill" style={{ width: `${(stats.heldForSale / stats.totalAssets * 100)}%`, background: '#a855f7' }} />
            </div>
            <p className="far-health-target">Target: &lt;3%</p>
          </div>
        </div>
      </Card>

      {/* Category summary */}
      <Card className="hover-lift-sm far-chart-card">
        <div className="far-chart-header">
          <h3 className="far-chart-title">Category Distribution Summary</h3>
          <p className="far-chart-subtitle">Concentration analysis across asset classes</p>
        </div>
        <div className="far-category-summary-grid">
          {byCategory.map((c) => {
            const Icon = CATEGORY_ICONS[c.category as AssetCategory];
            const grossShare = (c.grossValue / byCategory.reduce((s, x) => s + x.grossValue, 0) * 100).toFixed(1);
            return (
              <div key={c.category} className="far-category-summary-tile" style={{ borderLeftColor: c.color }}>
                <div className="far-category-summary-icon" style={{ background: `${c.color}20`, color: c.color }}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="far-category-summary-label">{c.label}</p>
                  <p className="far-category-summary-value">{formatINR(c.grossValue, true)}</p>
                  <p className="far-category-summary-sub">{c.count} assets · {grossShare}% of gross block</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ============================================================================
// Asset Detail Modal
// ============================================================================
interface AssetDetailModalProps {
  asset: Asset;
  depreciationSchedule: DepreciationScheduleEntry[];
  maintenanceHistory: MaintenanceHistoryEntry[];
  onClose: () => void;
}

function AssetDetailModal({ asset, depreciationSchedule, maintenanceHistory, onClose }: AssetDetailModalProps) {
  const Icon = CATEGORY_ICONS[asset.category];
  const wh = warehouses.find((w) => w.id === asset.warehouseId);

  return (
    <div className="far-modal-overlay" onClick={onClose}>
      <div className="far-modal" onClick={(e) => e.stopPropagation()}>
        <div className="far-modal-header" style={{ background: `linear-gradient(135deg, ${CATEGORY_COLORS[asset.category]} 0%, ${CATEGORY_COLORS[asset.category]}cc 100%)` }}>
          <div className="far-modal-header-content">
            <div className="far-modal-header-icon">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="far-modal-title">{asset.assetName}</h2>
              <p className="far-modal-subtitle">
                <span className="far-asset-code" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>{asset.assetCode}</span>
                <span className="far-modal-status">{STATUS_LABELS[asset.status]}</span>
              </p>
            </div>
          </div>
          <button className="far-modal-close" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="far-modal-body">
          {/* Meta grid */}
          <div className="far-modal-meta-grid">
            <div><p className="far-meta-label">Category</p><p className="far-meta-value">{CATEGORY_LABELS[asset.category]}</p></div>
            <div><p className="far-meta-label">Warehouse</p><p className="far-meta-value">{wh?.name || '—'}</p></div>
            <div><p className="far-meta-label">Location</p><p className="far-meta-value">{asset.location}</p></div>
            <div><p className="far-meta-label">Department</p><p className="far-meta-value">{asset.department}</p></div>
            <div><p className="far-meta-label">Custodian</p><p className="far-meta-value">{asset.custodian}</p></div>
            <div><p className="far-meta-label">Maintenance Tier</p><p className="far-meta-value">{TIER_LABELS[asset.maintenanceTier]}</p></div>
            <div><p className="far-meta-label">Acquisition Mode</p><p className="far-meta-value">{asset.acquisitionMode.replace('_', ' ')}</p></div>
            <div><p className="far-meta-label">Acquisition Date</p><p className="far-meta-value">{asset.acquisitionDate}</p></div>
            <div><p className="far-meta-label">Vendor</p><p className="far-meta-value">{asset.vendorName}</p></div>
            <div><p className="far-meta-label">PO Number</p><p className="far-meta-value"><span className="far-asset-code">{asset.poNumber}</span></p></div>
            <div><p className="far-meta-label">Capitalization Date</p><p className="far-meta-value">{asset.capitalizationDate}</p></div>
            <div><p className="far-meta-label">Useful Life</p><p className="far-meta-value">{asset.usefulLifeYears > 0 ? `${asset.usefulLifeYears} years` : 'Infinite (Land)'}</p></div>
            <div><p className="far-meta-label">Depreciation Method</p><p className="far-meta-value">{METHOD_LABELS[asset.depreciationMethod]}</p></div>
            <div><p className="far-meta-label">Last Maintenance</p><p className="far-meta-value">{asset.lastMaintenanceDate}</p></div>
            <div><p className="far-meta-label">Next Maintenance</p><p className="far-meta-value">{asset.nextMaintenanceDate}</p></div>
            <div><p className="far-meta-label">Insurance Expiry</p><p className="far-meta-value">{asset.insuranceExpiryDate}</p></div>
          </div>

          {/* Financial summary */}
          <div className="far-modal-financial-grid">
            <div className="far-modal-fin-tile far-modal-fin-indigo">
              <p className="far-modal-fin-label">Acquisition Cost</p>
              <p className="far-modal-fin-value">{formatINR(asset.acquisitionCostInr, true)}</p>
            </div>
            <div className="far-modal-fin-tile far-modal-fin-amber">
              <p className="far-modal-fin-label">Acc. Depreciation</p>
              <p className="far-modal-fin-value">{formatINR(asset.accumulatedDepreciationInr, true)}</p>
            </div>
            {asset.impairmentLossInr > 0 && (
              <div className="far-modal-fin-tile far-modal-fin-red">
                <p className="far-modal-fin-label">Impairment Loss</p>
                <p className="far-modal-fin-value">{formatINR(asset.impairmentLossInr, true)}</p>
              </div>
            )}
            <div className="far-modal-fin-tile far-modal-fin-green">
              <p className="far-modal-fin-label">Net Book Value</p>
              <p className="far-modal-fin-value">{formatINR(asset.netBookValueInr, true)}</p>
            </div>
            <div className="far-modal-fin-tile far-modal-fin-purple">
              <p className="far-modal-fin-label">Salvage Value</p>
              <p className="far-modal-fin-value">{formatINR(asset.salvageValueInr, true)}</p>
            </div>
            <div className="far-modal-fin-tile far-modal-fin-blue">
              <p className="far-modal-fin-label">Insured Value</p>
              <p className="far-modal-fin-value">{formatINR(asset.insuranceValueInr, true)}</p>
            </div>
            {asset.lastRevaluationSurplusInr > 0 && (
              <div className="far-modal-fin-tile far-modal-fin-violet">
                <p className="far-modal-fin-label">Revaluation Surplus</p>
                <p className="far-modal-fin-value">{formatINR(asset.lastRevaluationSurplusInr, true)}</p>
              </div>
            )}
          </div>

          {/* Impairment info */}
          {asset.impairmentIndicator !== 'none' && (
            <div className="far-modal-callout far-modal-callout-danger">
              <AlertCircle className="w-5 h-5" />
              <div>
                <p className="far-callout-title">Impairment Indicator: {IMPAIRMENT_LABELS[asset.impairmentIndicator]}</p>
                <p className="far-callout-detail">
                  Recognized on {asset.impairmentDate}. Impairment loss of {formatINR(asset.impairmentLossInr, true)} charged to P&L.
                  {asset.linkedNcrId && ` Linked NCR: ${asset.linkedNcrId}.`}
                </p>
              </div>
            </div>
          )}

          {/* Cross-module links */}
          <div className="far-modal-cross-module">
            <h4 className="far-modal-section-title">Cross-Module Links</h4>
            <div className="far-cross-module-pills">
              {asset.linkedPoId && (
                <span className="far-cross-module-pill far-cross-module-blue">
                  <FileText className="w-3 h-3" /> PO: {asset.linkedPoId}
                </span>
              )}
              {asset.linkedPcvId && (
                <span className="far-cross-module-pill far-cross-module-amber">
                  <Calculator className="w-3 h-3" /> PCV: {asset.linkedPcvId}
                </span>
              )}
              {asset.linkedNcrId && (
                <span className="far-cross-module-pill far-cross-module-red">
                  <AlertTriangle className="w-3 h-3" /> NCR: {asset.linkedNcrId}
                </span>
              )}
              {asset.linkedWorkOrderId && (
                <span className="far-cross-module-pill far-cross-module-purple">
                  <Wrench className="w-3 h-3" /> WO: {asset.linkedWorkOrderId}
                </span>
              )}
              {!asset.linkedPoId && !asset.linkedPcvId && !asset.linkedNcrId && !asset.linkedWorkOrderId && (
                <span className="far-cross-module-empty">No cross-module links</span>
              )}
            </div>
          </div>

          {/* Depreciation schedule */}
          {depreciationSchedule.length > 0 && (
            <div className="far-modal-section">
              <h4 className="far-modal-section-title">Depreciation Schedule</h4>
              <div className="far-modal-table-wrapper">
                <table className="far-table">
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Opening BV</th>
                      <th>Depreciation</th>
                      <th>Cumulative Dep.</th>
                      <th>Closing BV</th>
                    </tr>
                  </thead>
                  <tbody>
                    {depreciationSchedule.map((s) => (
                      <tr key={s.year}>
                        <td>Year {s.year}</td>
                        <td className="far-amount">{formatINR(s.openingBookValue, true)}</td>
                        <td className="far-amount">{formatINR(s.depreciationExpense, true)}</td>
                        <td className="far-amount">{formatINR(s.cumulativeDepreciation, true)}</td>
                        <td className="far-amount far-amount-strong">{formatINR(s.closingBookValue, true)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Maintenance history */}
          {maintenanceHistory.length > 0 && (
            <div className="far-modal-section">
              <h4 className="far-modal-section-title">Maintenance History ({maintenanceHistory.length} events)</h4>
              <div className="far-modal-table-wrapper">
                <table className="far-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Technician</th>
                      <th>Cost</th>
                      <th>Downtime</th>
                      <th>Outcome</th>
                    </tr>
                  </thead>
                  <tbody>
                    {maintenanceHistory.slice(0, 10).map((m, i) => (
                      <tr key={i}>
                        <td>{m.date}</td>
                        <td><span className="far-pill far-pill-neutral">{m.type}</span></td>
                        <td>{m.technician}</td>
                        <td className="far-amount">{formatINR(m.costInr, true)}</td>
                        <td>{m.downtimeHours}h</td>
                        <td>
                          <span className={cn('far-pill',
                            m.outcome === 'success' ? 'far-pill-green' :
                            m.outcome === 'partial' ? 'far-pill-amber' : 'far-pill-red')}>
                            {m.outcome}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
