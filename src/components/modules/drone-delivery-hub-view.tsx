import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#10b981', '#06b6d4', '#3b82f6', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#f97316']

const DRONE_TYPES = ['Fixed Wing', 'Multirotor', 'VTOL Hybrid', 'Heavy Lift', 'Delivery Bot', 'Agricultural']
const ZONES = ['Metro Zone', 'Suburban Ring', 'Industrial Belt', 'Rural Outreach', 'Hilly Terrain', 'Coastal Arc', 'Island Connect', 'Emergency Zone']
const MISSION_TYPES = ['Medical Supply', 'E-commerce Express', 'Food Delivery', 'Agricultural Spray', 'Survey & Map', 'Infra Inspect', 'Emergency Relief', 'WH Transfer']
const STATUSES = ['Airborne', 'Charging', 'Maintenance', 'Standby', 'Returning', 'Loading']
const OPERATORS = ['SkyPort India', 'DroneSeva', 'AeroLogistics', 'FlytBase Ops', 'Garuda Drones', 'TechEagle', 'DroniX', 'AutoSky']

const drones = [
  { id: 'DRN-0001', model: 'Fixed-806', type: 'Fixed Wing', zone: 'Metro Zone', mission: 'Medical Supply', status: 'Airborne', operator: 'SkyPort India', battery: 76, range_km: 30.0, payload: 21, altitude: 285, speed: 107, missions_today: 12, lastUpdate: '2026-07-20 08:34' },
  { id: 'DRN-0002', model: 'Multirotor-900', type: 'Multirotor', zone: 'Suburban Ring', mission: 'E-commerce Express', status: 'Charging', operator: 'DroneSeva', battery: 93, range_km: 16.0, payload: 17, altitude: 204, speed: 63, missions_today: 13, lastUpdate: '2026-07-01 07:12' },
  { id: 'DRN-0003', model: 'VTOL-675', type: 'VTOL Hybrid', zone: 'Industrial Belt', mission: 'Food Delivery', status: 'Maintenance', operator: 'AeroLogistics', battery: 60, range_km: 12.5, payload: 8, altitude: 293, speed: 78, missions_today: 17, lastUpdate: '2026-07-23 23:41' },
  { id: 'DRN-0004', model: 'Heavy-306', type: 'Heavy Lift', zone: 'Rural Outreach', mission: 'Agricultural Spray', status: 'Standby', operator: 'FlytBase Ops', battery: 97, range_km: 12.8, payload: 3, altitude: 269, speed: 134, missions_today: 14, lastUpdate: '2026-07-23 19:09' },
  { id: 'DRN-0005', model: 'Delivery-440', type: 'Delivery Bot', zone: 'Hilly Terrain', mission: 'Survey & Map', status: 'Returning', operator: 'Garuda Drones', battery: 87, range_km: 63.9, payload: 3, altitude: 379, speed: 118, missions_today: 6, lastUpdate: '2026-07-24 10:29' },
  { id: 'DRN-0006', model: 'Agricultural-993', type: 'Agricultural', zone: 'Coastal Arc', mission: 'Infra Inspect', status: 'Loading', operator: 'TechEagle', battery: 25, range_km: 62.6, payload: 15, altitude: 252, speed: 108, missions_today: 1, lastUpdate: '2026-07-10 07:01' },
  { id: 'DRN-0007', model: 'Fixed-392', type: 'Fixed Wing', zone: 'Island Connect', mission: 'Emergency Relief', status: 'Airborne', operator: 'DroniX', battery: 85, range_km: 11.3, payload: 20, altitude: 42, speed: 134, missions_today: 17, lastUpdate: '2026-07-19 17:09' },
  { id: 'DRN-0008', model: 'Multirotor-133', type: 'Multirotor', zone: 'Emergency Zone', mission: 'WH Transfer', status: 'Charging', operator: 'AutoSky', battery: 39, range_km: 26.7, payload: 4, altitude: 109, speed: 28, missions_today: 11, lastUpdate: '2026-07-14 10:16' },
  { id: 'DRN-0009', model: 'VTOL-887', type: 'VTOL Hybrid', zone: 'Metro Zone', mission: 'Medical Supply', status: 'Maintenance', operator: 'SkyPort India', battery: 19, range_km: 55.5, payload: 10, altitude: 126, speed: 92, missions_today: 18, lastUpdate: '2026-07-20 07:08' },
  { id: 'DRN-0010', model: 'Heavy-757', type: 'Heavy Lift', zone: 'Suburban Ring', mission: 'E-commerce Express', status: 'Standby', operator: 'DroneSeva', battery: 96, range_km: 76.1, payload: 25, altitude: 241, speed: 24, missions_today: 13, lastUpdate: '2026-07-19 07:16' },
  { id: 'DRN-0011', model: 'Delivery-315', type: 'Delivery Bot', zone: 'Industrial Belt', mission: 'Food Delivery', status: 'Returning', operator: 'AeroLogistics', battery: 69, range_km: 42.4, payload: 5, altitude: 283, speed: 91, missions_today: 12, lastUpdate: '2026-07-05 07:46' },
  { id: 'DRN-0012', model: 'Agricultural-367', type: 'Agricultural', zone: 'Rural Outreach', mission: 'Agricultural Spray', status: 'Loading', operator: 'FlytBase Ops', battery: 17, range_km: 79.7, payload: 9, altitude: 393, speed: 57, missions_today: 11, lastUpdate: '2026-07-16 06:25' },
  { id: 'DRN-0013', model: 'Fixed-296', type: 'Fixed Wing', zone: 'Hilly Terrain', mission: 'Survey & Map', status: 'Airborne', operator: 'Garuda Drones', battery: 21, range_km: 59.8, payload: 21, altitude: 196, speed: 148, missions_today: 2, lastUpdate: '2026-07-21 13:52' },
  { id: 'DRN-0014', model: 'Multirotor-870', type: 'Multirotor', zone: 'Coastal Arc', mission: 'Infra Inspect', status: 'Charging', operator: 'TechEagle', battery: 67, range_km: 3.9, payload: 10, altitude: 301, speed: 125, missions_today: 13, lastUpdate: '2026-07-20 19:30' },
  { id: 'DRN-0015', model: 'VTOL-609', type: 'VTOL Hybrid', zone: 'Island Connect', mission: 'Emergency Relief', status: 'Maintenance', operator: 'DroniX', battery: 84, range_km: 58.9, payload: 25, altitude: 278, speed: 64, missions_today: 12, lastUpdate: '2026-07-14 09:12' },
  { id: 'DRN-0016', model: 'Heavy-114', type: 'Heavy Lift', zone: 'Emergency Zone', mission: 'WH Transfer', status: 'Standby', operator: 'AutoSky', battery: 36, range_km: 12.7, payload: 1, altitude: 90, speed: 106, missions_today: 16, lastUpdate: '2026-07-12 20:13' },
  { id: 'DRN-0017', model: 'Delivery-993', type: 'Delivery Bot', zone: 'Metro Zone', mission: 'Medical Supply', status: 'Returning', operator: 'SkyPort India', battery: 35, range_km: 34.8, payload: 8, altitude: 314, speed: 89, missions_today: 9, lastUpdate: '2026-07-10 09:08' },
  { id: 'DRN-0018', model: 'Agricultural-233', type: 'Agricultural', zone: 'Suburban Ring', mission: 'E-commerce Express', status: 'Loading', operator: 'DroneSeva', battery: 79, range_km: 52.2, payload: 22, altitude: 98, speed: 37, missions_today: 11, lastUpdate: '2026-07-25 04:39' },
  { id: 'DRN-0019', model: 'Fixed-665', type: 'Fixed Wing', zone: 'Industrial Belt', mission: 'Food Delivery', status: 'Airborne', operator: 'AeroLogistics', battery: 54, range_km: 19.3, payload: 1, altitude: 209, speed: 132, missions_today: 7, lastUpdate: '2026-07-21 11:35' },
  { id: 'DRN-0020', model: 'Multirotor-542', type: 'Multirotor', zone: 'Rural Outreach', mission: 'Agricultural Spray', status: 'Charging', operator: 'FlytBase Ops', battery: 27, range_km: 42.7, payload: 24, altitude: 274, speed: 150, missions_today: 7, lastUpdate: '2026-07-19 20:15' },
  { id: 'DRN-0021', model: 'VTOL-494', type: 'VTOL Hybrid', zone: 'Hilly Terrain', mission: 'Survey & Map', status: 'Maintenance', operator: 'Garuda Drones', battery: 73, range_km: 69.8, payload: 10, altitude: 221, speed: 99, missions_today: 4, lastUpdate: '2026-07-06 08:26' },
  { id: 'DRN-0022', model: 'Heavy-893', type: 'Heavy Lift', zone: 'Coastal Arc', mission: 'Infra Inspect', status: 'Standby', operator: 'TechEagle', battery: 58, range_km: 76.7, payload: 23, altitude: 138, speed: 125, missions_today: 13, lastUpdate: '2026-07-02 05:43' },
  { id: 'DRN-0023', model: 'Delivery-538', type: 'Delivery Bot', zone: 'Island Connect', mission: 'Emergency Relief', status: 'Returning', operator: 'DroniX', battery: 40, range_km: 11.5, payload: 16, altitude: 233, speed: 94, missions_today: 8, lastUpdate: '2026-07-01 02:04' },
  { id: 'DRN-0024', model: 'Agricultural-104', type: 'Agricultural', zone: 'Emergency Zone', mission: 'WH Transfer', status: 'Loading', operator: 'AutoSky', battery: 20, range_km: 68.0, payload: 15, altitude: 331, speed: 41, missions_today: 12, lastUpdate: '2026-07-13 03:20' },
  { id: 'DRN-0025', model: 'Fixed-467', type: 'Fixed Wing', zone: 'Metro Zone', mission: 'Medical Supply', status: 'Airborne', operator: 'SkyPort India', battery: 54, range_km: 80.0, payload: 8, altitude: 321, speed: 149, missions_today: 3, lastUpdate: '2026-07-13 19:19' },
  { id: 'DRN-0026', model: 'Multirotor-989', type: 'Multirotor', zone: 'Suburban Ring', mission: 'E-commerce Express', status: 'Charging', operator: 'DroneSeva', battery: 29, range_km: 12.1, payload: 10, altitude: 288, speed: 141, missions_today: 13, lastUpdate: '2026-07-25 09:26' },
  { id: 'DRN-0027', model: 'VTOL-519', type: 'VTOL Hybrid', zone: 'Industrial Belt', mission: 'Food Delivery', status: 'Maintenance', operator: 'AeroLogistics', battery: 28, range_km: 32.5, payload: 5, altitude: 269, speed: 135, missions_today: 9, lastUpdate: '2026-07-03 10:57' },
  { id: 'DRN-0028', model: 'Heavy-118', type: 'Heavy Lift', zone: 'Rural Outreach', mission: 'Agricultural Spray', status: 'Standby', operator: 'FlytBase Ops', battery: 48, range_km: 51.3, payload: 18, altitude: 244, speed: 97, missions_today: 13, lastUpdate: '2026-07-07 14:19' },
  { id: 'DRN-0029', model: 'Delivery-894', type: 'Delivery Bot', zone: 'Hilly Terrain', mission: 'Survey & Map', status: 'Returning', operator: 'Garuda Drones', battery: 69, range_km: 68.2, payload: 4, altitude: 124, speed: 90, missions_today: 16, lastUpdate: '2026-07-29 14:04' },
  { id: 'DRN-0030', model: 'Agricultural-282', type: 'Agricultural', zone: 'Coastal Arc', mission: 'Infra Inspect', status: 'Loading', operator: 'TechEagle', battery: 27, range_km: 16.0, payload: 14, altitude: 280, speed: 96, missions_today: 7, lastUpdate: '2026-07-04 12:28' },
  { id: 'DRN-0031', model: 'Fixed-999', type: 'Fixed Wing', zone: 'Island Connect', mission: 'Emergency Relief', status: 'Airborne', operator: 'DroniX', battery: 44, range_km: 59.0, payload: 24, altitude: 338, speed: 103, missions_today: 10, lastUpdate: '2026-07-07 15:15' },
  { id: 'DRN-0032', model: 'Multirotor-679', type: 'Multirotor', zone: 'Emergency Zone', mission: 'WH Transfer', status: 'Charging', operator: 'AutoSky', battery: 46, range_km: 22.8, payload: 19, altitude: 202, speed: 105, missions_today: 9, lastUpdate: '2026-07-01 20:25' },
  { id: 'DRN-0033', model: 'VTOL-816', type: 'VTOL Hybrid', zone: 'Metro Zone', mission: 'Medical Supply', status: 'Maintenance', operator: 'SkyPort India', battery: 69, range_km: 76.2, payload: 6, altitude: 70, speed: 52, missions_today: 13, lastUpdate: '2026-07-27 21:25' },
  { id: 'DRN-0034', model: 'Heavy-539', type: 'Heavy Lift', zone: 'Suburban Ring', mission: 'E-commerce Express', status: 'Standby', operator: 'DroneSeva', battery: 20, range_km: 27.8, payload: 24, altitude: 329, speed: 131, missions_today: 8, lastUpdate: '2026-07-27 00:10' },
  { id: 'DRN-0035', model: 'Delivery-197', type: 'Delivery Bot', zone: 'Industrial Belt', mission: 'Food Delivery', status: 'Returning', operator: 'AeroLogistics', battery: 57, range_km: 69.3, payload: 21, altitude: 357, speed: 142, missions_today: 16, lastUpdate: '2026-07-03 21:30' },
  { id: 'DRN-0036', model: 'Agricultural-961', type: 'Agricultural', zone: 'Rural Outreach', mission: 'Agricultural Spray', status: 'Loading', operator: 'FlytBase Ops', battery: 78, range_km: 75.2, payload: 13, altitude: 247, speed: 44, missions_today: 5, lastUpdate: '2026-07-03 09:59' },
  { id: 'DRN-0037', model: 'Fixed-547', type: 'Fixed Wing', zone: 'Hilly Terrain', mission: 'Survey & Map', status: 'Airborne', operator: 'Garuda Drones', battery: 97, range_km: 64.4, payload: 23, altitude: 53, speed: 92, missions_today: 16, lastUpdate: '2026-07-22 06:45' },
  { id: 'DRN-0038', model: 'Multirotor-739', type: 'Multirotor', zone: 'Coastal Arc', mission: 'Infra Inspect', status: 'Charging', operator: 'TechEagle', battery: 61, range_km: 22.6, payload: 1, altitude: 265, speed: 148, missions_today: 6, lastUpdate: '2026-07-12 16:12' },
  { id: 'DRN-0039', model: 'VTOL-931', type: 'VTOL Hybrid', zone: 'Island Connect', mission: 'Emergency Relief', status: 'Maintenance', operator: 'DroniX', battery: 63, range_km: 16.6, payload: 2, altitude: 193, speed: 147, missions_today: 14, lastUpdate: '2026-07-26 17:57' },
  { id: 'DRN-0040', model: 'Heavy-581', type: 'Heavy Lift', zone: 'Emergency Zone', mission: 'WH Transfer', status: 'Standby', operator: 'AutoSky', battery: 78, range_km: 8.1, payload: 19, altitude: 173, speed: 57, missions_today: 11, lastUpdate: '2026-07-08 10:11' },
  { id: 'DRN-0041', model: 'Delivery-532', type: 'Delivery Bot', zone: 'Metro Zone', mission: 'Medical Supply', status: 'Returning', operator: 'SkyPort India', battery: 77, range_km: 42.0, payload: 24, altitude: 138, speed: 62, missions_today: 3, lastUpdate: '2026-07-06 10:10' },
  { id: 'DRN-0042', model: 'Agricultural-281', type: 'Agricultural', zone: 'Suburban Ring', mission: 'E-commerce Express', status: 'Loading', operator: 'DroneSeva', battery: 60, range_km: 19.2, payload: 23, altitude: 37, speed: 108, missions_today: 3, lastUpdate: '2026-07-12 21:30' },
  { id: 'DRN-0043', model: 'Fixed-684', type: 'Fixed Wing', zone: 'Industrial Belt', mission: 'Food Delivery', status: 'Airborne', operator: 'AeroLogistics', battery: 67, range_km: 21.7, payload: 15, altitude: 69, speed: 68, missions_today: 8, lastUpdate: '2026-07-19 15:03' },
  { id: 'DRN-0044', model: 'Multirotor-685', type: 'Multirotor', zone: 'Rural Outreach', mission: 'Agricultural Spray', status: 'Charging', operator: 'FlytBase Ops', battery: 27, range_km: 54.5, payload: 21, altitude: 399, speed: 39, missions_today: 2, lastUpdate: '2026-07-01 14:16' },
  { id: 'DRN-0045', model: 'VTOL-658', type: 'VTOL Hybrid', zone: 'Hilly Terrain', mission: 'Survey & Map', status: 'Maintenance', operator: 'Garuda Drones', battery: 70, range_km: 27.8, payload: 9, altitude: 59, speed: 115, missions_today: 17, lastUpdate: '2026-07-20 00:22' },
  { id: 'DRN-0046', model: 'Heavy-647', type: 'Heavy Lift', zone: 'Coastal Arc', mission: 'Infra Inspect', status: 'Standby', operator: 'TechEagle', battery: 38, range_km: 27.9, payload: 17, altitude: 219, speed: 106, missions_today: 5, lastUpdate: '2026-07-22 17:58' },
  { id: 'DRN-0047', model: 'Delivery-223', type: 'Delivery Bot', zone: 'Island Connect', mission: 'Emergency Relief', status: 'Returning', operator: 'DroniX', battery: 80, range_km: 26.3, payload: 19, altitude: 109, speed: 127, missions_today: 15, lastUpdate: '2026-07-18 00:54' },
  { id: 'DRN-0048', model: 'Agricultural-150', type: 'Agricultural', zone: 'Emergency Zone', mission: 'WH Transfer', status: 'Loading', operator: 'AutoSky', battery: 36, range_km: 21.5, payload: 5, altitude: 64, speed: 135, missions_today: 9, lastUpdate: '2026-07-07 20:39' },
  { id: 'DRN-0049', model: 'Fixed-628', type: 'Fixed Wing', zone: 'Metro Zone', mission: 'Medical Supply', status: 'Airborne', operator: 'SkyPort India', battery: 37, range_km: 70.1, payload: 18, altitude: 386, speed: 108, missions_today: 7, lastUpdate: '2026-07-09 06:12' },
  { id: 'DRN-0050', model: 'Multirotor-537', type: 'Multirotor', zone: 'Suburban Ring', mission: 'E-commerce Express', status: 'Charging', operator: 'DroneSeva', battery: 87, range_km: 38.4, payload: 16, altitude: 83, speed: 27, missions_today: 10, lastUpdate: '2026-07-04 05:44' },
  { id: 'DRN-0051', model: 'VTOL-185', type: 'VTOL Hybrid', zone: 'Industrial Belt', mission: 'Food Delivery', status: 'Maintenance', operator: 'AeroLogistics', battery: 76, range_km: 6.0, payload: 20, altitude: 168, speed: 61, missions_today: 8, lastUpdate: '2026-07-12 17:10' },
  { id: 'DRN-0052', model: 'Heavy-161', type: 'Heavy Lift', zone: 'Rural Outreach', mission: 'Agricultural Spray', status: 'Standby', operator: 'FlytBase Ops', battery: 42, range_km: 15.0, payload: 9, altitude: 382, speed: 131, missions_today: 1, lastUpdate: '2026-07-17 06:15' },
  { id: 'DRN-0053', model: 'Delivery-363', type: 'Delivery Bot', zone: 'Hilly Terrain', mission: 'Survey & Map', status: 'Returning', operator: 'Garuda Drones', battery: 64, range_km: 67.2, payload: 4, altitude: 217, speed: 32, missions_today: 6, lastUpdate: '2026-07-15 16:13' },
  { id: 'DRN-0054', model: 'Agricultural-443', type: 'Agricultural', zone: 'Coastal Arc', mission: 'Infra Inspect', status: 'Loading', operator: 'TechEagle', battery: 76, range_km: 55.0, payload: 6, altitude: 235, speed: 148, missions_today: 4, lastUpdate: '2026-07-07 08:00' },
  { id: 'DRN-0055', model: 'Fixed-445', type: 'Fixed Wing', zone: 'Island Connect', mission: 'Emergency Relief', status: 'Airborne', operator: 'DroniX', battery: 41, range_km: 53.5, payload: 18, altitude: 377, speed: 20, missions_today: 3, lastUpdate: '2026-07-11 10:25' },
]

const monthlyData = [
  { month: 'Jan', flights: 351, deliveries: 291, successRate: 94.5 },
  { month: 'Feb', flights: 742, deliveries: 505, successRate: 90.0 },
  { month: 'Mar', flights: 560, deliveries: 566, successRate: 93.5 },
  { month: 'Apr', flights: 755, deliveries: 521, successRate: 91.5 },
  { month: 'May', flights: 205, deliveries: 407, successRate: 95.6 },
  { month: 'Jun', flights: 633, deliveries: 451, successRate: 95.3 },
  { month: 'Jul', flights: 392, deliveries: 410, successRate: 96.4 },
  { month: 'Aug', flights: 563, deliveries: 240, successRate: 92.6 },
  { month: 'Sep', flights: 699, deliveries: 575, successRate: 97.7 },
  { month: 'Oct', flights: 233, deliveries: 337, successRate: 91.2 },
  { month: 'Nov', flights: 360, deliveries: 510, successRate: 99.0 },
  { month: 'Dec', flights: 533, deliveries: 391, successRate: 94.8 },
]

const zoneDist = [
  { name: 'Metro Zone', value: 45 },
  { name: 'Suburban Ring', value: 54 },
  { name: 'Industrial Belt', value: 61 },
  { name: 'Rural Outreach', value: 58 },
  { name: 'Hilly Terrain', value: 39 },
  { name: 'Coastal Arc', value: 31 },
  { name: 'Island Connect', value: 42 },
  { name: 'Emergency Zone', value: 44 },
]

const filterGroups = [
  { key: 'type', label: 'Drone Type', options: DRONE_TYPES.map(t => ({ value: t, label: t, count: 0 })) },
  { key: 'status', label: 'Status', options: STATUSES.map(s => ({ value: s, label: s, count: 0 })) },
  { key: 'mission', label: 'Mission', options: MISSION_TYPES.map(m => ({ value: m, label: m, count: 0 })) },
]

function TypeBadge({ type }: { type: string }) {
  const color = type === 'Fixed Wing' ? 'bg-emerald-500/15 text-emerald-400' : type === 'Multirotor' ? 'bg-cyan-500/15 text-cyan-400' : type === 'VTOL Hybrid' ? 'bg-blue-500/15 text-blue-400' : type === 'Heavy Lift' ? 'bg-amber-500/15 text-amber-400' : type === 'Delivery Bot' ? 'bg-violet-500/15 text-violet-400' : 'bg-rose-500/15 text-rose-400'
  return <span className={'drh-type-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{type}</span>
}

function StatusBadge({ status }: { status: string }) {
  const color = status === 'Airborne' ? 'bg-emerald-500/15 text-emerald-400' : status === 'Charging' ? 'bg-amber-500/15 text-amber-400' : status === 'Maintenance' ? 'bg-red-500/15 text-red-400' : status === 'Standby' ? 'bg-zinc-500/15 text-zinc-400' : status === 'Returning' ? 'bg-blue-500/15 text-blue-400' : 'bg-cyan-500/15 text-cyan-400'
  return <span className={'drh-status-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{status}</span>
}

function BatteryIndicator({ value }: { value: number }) {
  const w = value
  const color = value > 60 ? 'bg-emerald-500' : value > 30 ? 'bg-amber-500' : 'bg-red-500'
  return <div className='drh-batt-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className={'h-full rounded-full drh-batt-fill ' + color} style={{ width: w + '%', animation: 'drh-grow 1s ease-out' }}/></div>
}

function PayloadBar({ value, max }: { value: number; max: number }) {
  const w = Math.round(value / max * 100)
  return <div className='drh-pl-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className='h-full rounded-full bg-cyan-500 drh-pl-fill' style={{ width: w + '%', animation: 'drh-grow 1s ease-out' }}/></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, c = 2 * Math.PI * r, offset = c - (value / 100) * c
  return <div className='drh-ring flex flex-col items-center'><svg width='70' height='70' className='-rotate-90'><circle cx='35' cy='35' r={r} fill='none' stroke='#27272a' strokeWidth='5'/><circle cx='35' cy='35' r={r} fill='none' stroke={color} strokeWidth='5' strokeDasharray={c} strokeDashoffset={offset} strokeLinecap='round' className='drh-ring-path' style={{ transition: 'stroke-dashoffset 1s ease' }}/></svg><span className='drh-ring-val text-sm font-bold mt-1' style={{ color }}>{value}%</span><span className='drh-ring-label text-[10px] text-zinc-500'>{label}</span></div>
}

function KpiTile({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return <div className='drh-kpi bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 drh-kpi-card'><p className='text-xs text-zinc-500 mb-1'>{label}</p><p className={'text-xl font-bold ' + color}>{value}</p><p className='text-[10px] text-zinc-400 mt-1'>{sub}</p></div>
}

function ValueTile({ label, value, change }: { label: string; value: string; change: string }) {
  const up = change.startsWith('+')
  return <div className='drh-value-tile bg-zinc-900/60 border border-zinc-800 rounded-lg p-3'><p className='text-xs text-zinc-500'>{label}</p><p className='text-lg font-bold text-white mt-1'>{value}</p><p className={'text-xs mt-1 ' + (up ? 'text-emerald-400' : 'text-red-400')}>{change}</p></div>
}

const insights = [
  { title: 'BVLOS Permission Granted', desc: 'DGCA approved Beyond Visual Line of Sight operations for 5 zones covering Mumbai-Pune corridor. 12 new delivery routes activated. Expected daily capacity: +340 flights.', severity: 'high' },
  { title: 'Battery Technology Upgrade', desc: 'Lithium-sulfur cells deployed across 20 Multirotor fleet. Flight endurance increased from 35min to 62min. Payload capacity up 15%. Maintenance cost down 22%.', severity: 'medium' },
  { title: 'Weather API Integration', desc: 'Real-time IMD weather feed now auto-halts flights during wind >40km/h or visibility <500m. Prevented 23 unsafe flights in July. Safety compliance at 99.7%.', severity: 'medium' },
  { title: 'Rural Medical Route Success', desc: 'Emergency medical supply drone route to 8 PHCs in Karnataka rural belt achieving 94% on-time delivery. Avg delivery time: 18 min vs 2.5 hrs by road.', severity: 'low' },
]

export default function DroneDeliveryHubView() {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [tab, setTab] = useState('dashboard')

  const toggleFilter = (key: string, val: string) => {
    setActiveFilters(prev => {
      const cur = prev[key] || []
      const next = cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val]
      return { ...prev, [key]: next }
    })
  }

  const filtered = drones.filter(d => {
    for (const [key, vals] of Object.entries(activeFilters)) {
      if (vals.length > 0 && !vals.includes(d[key as keyof typeof d] as string)) return false
    }
    if (searchQuery && !Object.values(d).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))) return false
    return true
  })

  return (
    <div className='drh-root space-y-4 p-4'>
      <PageHeader title='Drone Delivery Hub' description='UAV fleet management & autonomous delivery operations' />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className='drh-tabs-list bg-zinc-900 border border-zinc-800'>
          <TabsTrigger value='dashboard' className='drh-tab'>Dashboard</TabsTrigger>
          <TabsTrigger value='fleet' className='drh-tab'>Fleet</TabsTrigger>
          <TabsTrigger value='analytics' className='drh-tab'>Analytics</TabsTrigger>
          <TabsTrigger value='insights' className='drh-tab'>Insights</TabsTrigger>
        </TabsList>

        <TabsContent value='dashboard' className='drh-tab-content space-y-4 mt-4'>
          <div className='drh-kpi-row grid grid-cols-2 lg:grid-cols-4 gap-3'>
            <KpiTile label='Active Drones' value='55' sub='+12 this quarter' color='text-emerald-400' />
            <KpiTile label='Flights Today' value='142' sub='+28% vs avg' color='text-cyan-400' />
            <KpiTile label='Success Rate' value='96.8%' sub='+1.2pp' color='text-blue-400' />
            <KpiTile label='Avg Delivery' value='18 min' sub='-4 min improvement' color='text-amber-400' />
          </div>
          <div className='drh-ring-row flex flex-wrap justify-around gap-2'>
            <HealthRing value={97} label='Safety' color='#10b981' />
            <HealthRing value={84} label='Battery Avg' color='#06b6d4' />
            <HealthRing value={91} label='On-Time' color='#3b82f6' />
            <HealthRing value={73} label='Coverage' color='#f59e0b' />
            <HealthRing value={88} label='Uptime' color='#8b5cf6' />
            <HealthRing value={95} label='Signal' color='#ec4899' />
          </div>
          <div className='drh-chart-row grid grid-cols-1 lg:grid-cols-3 gap-4'>
            <Card className='drh-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Flight Volume</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='month' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Line type='monotone' dataKey='flights' stroke='#10b981' strokeWidth={2} dot={false}/><Line type='monotone' dataKey='deliveries' stroke='#06b6d4' strokeWidth={2} dot={false}/></LineChart></CardContent></Card>
            <Card className='drh-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Success Rate Trend</CardTitle></CardHeader><CardContent><BarChart data={monthlyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='month' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Bar dataKey='successRate' fill='#3b82f6' radius={[4,4,0,0]}/></BarChart></CardContent></Card>
            <Card className='drh-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Zone Distribution</CardTitle></CardHeader><CardContent><PieChart width={350} height={200}><Pie data={zoneDist} cx='50%' cy='50%' outerRadius={70} innerRadius={35} dataKey='value' paddingAngle={2}>{zoneDist.map((_, i) => <Cell key={i} fill={COLORS[i % 8]} />)}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value='fleet' className='drh-tab-content space-y-4 mt-4'>
          <ModuleBreadcrumb items={[{ label: 'Drone Hub' }, { label: 'Fleet' }]} />
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => { setActiveFilters({}); setSearchQuery('') }} totalItems={drones.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder='Search drones by ID, model, zone...' />
          <Card className='drh-table-card bg-zinc-900/60 border-zinc-800'><CardContent className='p-0'><div className='drh-table-wrap overflow-x-auto'><table className='drh-table w-full text-sm'><thead><tr className='border-b border-zinc-800'><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>ID</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Model</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Type</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Zone</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Mission</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Operator</th><th className='text-right px-3 py-2 text-zinc-500 text-xs font-medium'>Battery</th><th className='text-right px-3 py-2 text-zinc-500 text-xs font-medium'>Payload</th><th className='text-right px-3 py-2 text-zinc-500 text-xs font-medium'>Speed</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Status</th></tr></thead><tbody>
          {filtered.map(d => (
            <tr key={d.id} className='drh-table-row border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors'>
              <td className='px-3 py-2 font-mono text-xs text-emerald-400'>{d.id}</td>
              <td className='px-3 py-2 text-xs font-medium text-zinc-200'>{d.model}</td>
              <td className='px-3 py-2'><TypeBadge type={d.type} /></td>
              <td className='px-3 py-2 text-xs text-zinc-300'>{d.zone}</td>
              <td className='px-3 py-2 text-xs text-zinc-400'>{d.mission}</td>
              <td className='px-3 py-2 text-xs text-blue-300'>{d.operator}</td>
              <td className='px-3 py-2 w-24'><BatteryIndicator value={d.battery} /><span className='text-[10px] text-zinc-500 ml-1'>{d.battery}%</span></td>
              <td className='px-3 py-2 text-right text-xs'>{d.payload}kg</td>
              <td className='px-3 py-2 text-right text-xs'>{d.speed}km/h</td>
              <td className='px-3 py-2'><StatusBadge status={d.status} /></td>
            </tr>
          ))})
          </tbody></table></div></CardContent></Card>
        </TabsContent>

        <TabsContent value='analytics' className='drh-tab-content space-y-4 mt-4'>
          <div className='drh-value-row grid grid-cols-2 lg:grid-cols-4 gap-3'>
            <ValueTile label='Total Flights (MTD)' value='4,280' change='+35% YoY' />
            <ValueTile label='Avg Flight Time' value='14.2 min' change='-2.1 min' />
            <ValueTile label='Distance Covered' value='12.5K km' change='+22% QoQ' />
            <ValueTile label='Battery Lifespan' value='340 cycles' change='+45 cycles' />
          </div>
          <div className='drh-analytics-charts grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <Card className='drh-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Mission Type Mix</CardTitle></CardHeader><CardContent><PieChart width={450} height={220}><Pie data={[{ name: 'Medical', value: 28 }, { name: 'E-commerce', value: 22 }, { name: 'Food', value: 18 }, { name: 'Survey', value: 14 }, { name: 'Emergency', value: 10 }, { name: 'Others', value: 8 }]} cx='50%' cy='50%' outerRadius={80} innerRadius={40} dataKey='value' paddingAngle={3}>{[<Cell key={0} fill='#10b981' />, <Cell key={1} fill='#06b6d4' />, <Cell key={2} fill='#3b82f6' />, <Cell key={3} fill='#f59e0b' />, <Cell key={4} fill='#ef4444' />, <Cell key={5} fill='#6b7280' />]}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
            <Card className='drh-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Operator Performance</CardTitle></CardHeader><CardContent><BarChart data={OPERATORS.map((o,i) => ({ name: o.split(' ')[0], flights: [420,380,310,280,250,220,190,160][i], incidents: [2,3,1,4,2,1,3,2][i] }))} width={450} height={220}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='name' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Bar dataKey='flights' fill='#10b981' radius={[4,4,0,0]}/><Bar dataKey='incidents' fill='#ef4444' radius={[4,4,0,0]}/></BarChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value='insights' className='drh-tab-content space-y-4 mt-4'>
          {insights.map((ins, i) => (
            <Card key={i} className={'drh-insight-card bg-zinc-900/60 border ' + (ins.severity === 'high' ? 'border-emerald-500/30' : ins.severity === 'medium' ? 'border-amber-500/30' : 'border-zinc-800')}><CardContent className='p-4'><div className='flex items-start gap-3'><div className={'drh-insight-dot w-2 h-2 rounded-full mt-1.5 shrink-0 ' + (ins.severity === 'high' ? 'bg-emerald-500' : ins.severity === 'medium' ? 'bg-amber-500' : 'bg-zinc-500')} /><div><p className='text-sm font-medium text-zinc-200'>{ins.title}</p><p className='text-xs text-zinc-400 mt-1 leading-relaxed'>{ins.desc}</p></div></div></CardContent></Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
