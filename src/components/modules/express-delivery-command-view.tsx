import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#0ea5e9', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#f97316']

const ZONES = ['South Mumbai', 'Central Delhi', 'Koramangala BLR', 'HITEC City HYD', 'Park Street KOL', 'T. Nagar CHN', 'Koregaon Park PNE', 'SG Highway AMD']
const VEHICLES = ['Bike Courier', 'Electric Scooter', 'Delivery Van', 'Auto Rickshaw', 'Drone Drop', 'Walk-in Agent', 'Cycle Courier', 'EV Three-Wheeler']
const SLA_TIERS = ['Same Day (4hr)', 'Same Day (2hr)', 'Next Hour', 'Express 30min', 'Scheduled Window', 'Economy Same Day']
const PRIORITIES = ['Critical', 'High', 'Medium', 'Low']

const deliveries = [
  { id: 'EDC-0001', zone: 'South Mumbai', vehicle: 'Bike Courier', slaTier: 'Same Day (4hr)', priority: 'Critical', on_time_pct: 74.5, transit_min: 33, cost_inr: 330.4, parcels_hr: 101, distance_km: 6.0, lastDispatch: '2026-07-01 12:09' },
  { id: 'EDC-0002', zone: 'Central Delhi', vehicle: 'Electric Scooter', slaTier: 'Same Day (2hr)', priority: 'High', on_time_pct: 93.3, transit_min: 41, cost_inr: 89.0, parcels_hr: 112, distance_km: 7.9, lastDispatch: '2026-07-06 22:21' },
  { id: 'EDC-0003', zone: 'Koramangala BLR', vehicle: 'Delivery Van', slaTier: 'Next Hour', priority: 'Medium', on_time_pct: 67.6, transit_min: 63, cost_inr: 248.4, parcels_hr: 28, distance_km: 1.8, lastDispatch: '2026-07-13 18:27' },
  { id: 'EDC-0004', zone: 'HITEC City HYD', vehicle: 'Auto Rickshaw', slaTier: 'Express 30min', priority: 'Low', on_time_pct: 77.9, transit_min: 40, cost_inr: 80.8, parcels_hr: 86, distance_km: 13.5, lastDispatch: '2026-07-20 11:05' },
  { id: 'EDC-0005', zone: 'Park Street KOL', vehicle: 'Drone Drop', slaTier: 'Scheduled Window', priority: 'Critical', on_time_pct: 62.8, transit_min: 71, cost_inr: 213.4, parcels_hr: 80, distance_km: 12.7, lastDispatch: '2026-07-01 12:19' },
  { id: 'EDC-0006', zone: 'T. Nagar CHN', vehicle: 'Walk-in Agent', slaTier: 'Economy Same Day', priority: 'High', on_time_pct: 93.0, transit_min: 95, cost_inr: 230.5, parcels_hr: 136, distance_km: 17.6, lastDispatch: '2026-07-17 13:57' },
  { id: 'EDC-0007', zone: 'Koregaon Park PNE', vehicle: 'Cycle Courier', slaTier: 'Same Day (4hr)', priority: 'Medium', on_time_pct: 81.1, transit_min: 40, cost_inr: 69.9, parcels_hr: 123, distance_km: 10.0, lastDispatch: '2026-07-27 08:44' },
  { id: 'EDC-0008', zone: 'SG Highway AMD', vehicle: 'EV Three-Wheeler', slaTier: 'Same Day (2hr)', priority: 'Low', on_time_pct: 88.6, transit_min: 22, cost_inr: 270.6, parcels_hr: 45, distance_km: 9.2, lastDispatch: '2026-07-16 07:36' },
  { id: 'EDC-0009', zone: 'South Mumbai', vehicle: 'Bike Courier', slaTier: 'Next Hour', priority: 'Critical', on_time_pct: 77.9, transit_min: 15, cost_inr: 185.0, parcels_hr: 29, distance_km: 15.1, lastDispatch: '2026-07-05 23:12' },
  { id: 'EDC-0010', zone: 'Central Delhi', vehicle: 'Electric Scooter', slaTier: 'Express 30min', priority: 'High', on_time_pct: 61.0, transit_min: 56, cost_inr: 120.3, parcels_hr: 27, distance_km: 3.2, lastDispatch: '2026-07-12 05:29' },
  { id: 'EDC-0011', zone: 'Koramangala BLR', vehicle: 'Delivery Van', slaTier: 'Scheduled Window', priority: 'Medium', on_time_pct: 77.1, transit_min: 42, cost_inr: 285.1, parcels_hr: 92, distance_km: 18.0, lastDispatch: '2026-07-26 07:13' },
  { id: 'EDC-0012', zone: 'HITEC City HYD', vehicle: 'Auto Rickshaw', slaTier: 'Economy Same Day', priority: 'Low', on_time_pct: 94.5, transit_min: 27, cost_inr: 103.7, parcels_hr: 168, distance_km: 9.0, lastDispatch: '2026-07-08 03:50' },
  { id: 'EDC-0013', zone: 'Park Street KOL', vehicle: 'Drone Drop', slaTier: 'Same Day (4hr)', priority: 'Critical', on_time_pct: 73.1, transit_min: 65, cost_inr: 230.8, parcels_hr: 45, distance_km: 10.1, lastDispatch: '2026-07-02 02:27' },
  { id: 'EDC-0014', zone: 'T. Nagar CHN', vehicle: 'Walk-in Agent', slaTier: 'Same Day (2hr)', priority: 'High', on_time_pct: 83.6, transit_min: 82, cost_inr: 139.2, parcels_hr: 178, distance_km: 17.4, lastDispatch: '2026-07-30 21:47' },
  { id: 'EDC-0015', zone: 'Koregaon Park PNE', vehicle: 'Cycle Courier', slaTier: 'Next Hour', priority: 'Medium', on_time_pct: 62.5, transit_min: 70, cost_inr: 46.2, parcels_hr: 115, distance_km: 8.4, lastDispatch: '2026-07-26 02:48' },
  { id: 'EDC-0016', zone: 'SG Highway AMD', vehicle: 'EV Three-Wheeler', slaTier: 'Express 30min', priority: 'Low', on_time_pct: 90.4, transit_min: 57, cost_inr: 40.2, parcels_hr: 177, distance_km: 7.9, lastDispatch: '2026-07-21 05:42' },
  { id: 'EDC-0017', zone: 'South Mumbai', vehicle: 'Bike Courier', slaTier: 'Scheduled Window', priority: 'Critical', on_time_pct: 88.4, transit_min: 27, cost_inr: 266.6, parcels_hr: 80, distance_km: 3.6, lastDispatch: '2026-07-05 14:15' },
  { id: 'EDC-0018', zone: 'Central Delhi', vehicle: 'Electric Scooter', slaTier: 'Economy Same Day', priority: 'High', on_time_pct: 89.5, transit_min: 74, cost_inr: 255.4, parcels_hr: 161, distance_km: 17.8, lastDispatch: '2026-07-13 21:54' },
  { id: 'EDC-0019', zone: 'Koramangala BLR', vehicle: 'Delivery Van', slaTier: 'Same Day (4hr)', priority: 'Medium', on_time_pct: 67.4, transit_min: 34, cost_inr: 236.1, parcels_hr: 51, distance_km: 7.5, lastDispatch: '2026-07-21 19:56' },
  { id: 'EDC-0020', zone: 'HITEC City HYD', vehicle: 'Auto Rickshaw', slaTier: 'Same Day (2hr)', priority: 'Low', on_time_pct: 88.2, transit_min: 27, cost_inr: 52.4, parcels_hr: 89, distance_km: 6.7, lastDispatch: '2026-07-08 13:57' },
  { id: 'EDC-0021', zone: 'Park Street KOL', vehicle: 'Drone Drop', slaTier: 'Next Hour', priority: 'Critical', on_time_pct: 72.5, transit_min: 37, cost_inr: 28.3, parcels_hr: 115, distance_km: 16.5, lastDispatch: '2026-07-01 10:42' },
  { id: 'EDC-0022', zone: 'T. Nagar CHN', vehicle: 'Walk-in Agent', slaTier: 'Express 30min', priority: 'High', on_time_pct: 94.0, transit_min: 79, cost_inr: 150.3, parcels_hr: 38, distance_km: 1.6, lastDispatch: '2026-07-20 05:29' },
  { id: 'EDC-0023', zone: 'Koregaon Park PNE', vehicle: 'Cycle Courier', slaTier: 'Scheduled Window', priority: 'Medium', on_time_pct: 75.2, transit_min: 15, cost_inr: 280.0, parcels_hr: 127, distance_km: 11.6, lastDispatch: '2026-07-21 16:21' },
  { id: 'EDC-0024', zone: 'SG Highway AMD', vehicle: 'EV Three-Wheeler', slaTier: 'Economy Same Day', priority: 'Low', on_time_pct: 88.5, transit_min: 24, cost_inr: 222.9, parcels_hr: 25, distance_km: 2.0, lastDispatch: '2026-07-24 23:02' },
  { id: 'EDC-0025', zone: 'South Mumbai', vehicle: 'Bike Courier', slaTier: 'Same Day (4hr)', priority: 'Critical', on_time_pct: 76.4, transit_min: 55, cost_inr: 342.3, parcels_hr: 31, distance_km: 12.1, lastDispatch: '2026-07-01 03:12' },
  { id: 'EDC-0026', zone: 'Central Delhi', vehicle: 'Electric Scooter', slaTier: 'Same Day (2hr)', priority: 'High', on_time_pct: 79.0, transit_min: 79, cost_inr: 127.6, parcels_hr: 90, distance_km: 3.6, lastDispatch: '2026-07-18 18:53' },
  { id: 'EDC-0027', zone: 'Koramangala BLR', vehicle: 'Delivery Van', slaTier: 'Next Hour', priority: 'Medium', on_time_pct: 71.7, transit_min: 88, cost_inr: 147.5, parcels_hr: 42, distance_km: 7.3, lastDispatch: '2026-07-04 01:55' },
  { id: 'EDC-0028', zone: 'HITEC City HYD', vehicle: 'Auto Rickshaw', slaTier: 'Express 30min', priority: 'Low', on_time_pct: 68.4, transit_min: 13, cost_inr: 272.6, parcels_hr: 118, distance_km: 14.1, lastDispatch: '2026-07-21 15:12' },
  { id: 'EDC-0029', zone: 'Park Street KOL', vehicle: 'Drone Drop', slaTier: 'Scheduled Window', priority: 'Critical', on_time_pct: 80.5, transit_min: 59, cost_inr: 33.5, parcels_hr: 46, distance_km: 11.7, lastDispatch: '2026-07-02 05:42' },
  { id: 'EDC-0030', zone: 'T. Nagar CHN', vehicle: 'Walk-in Agent', slaTier: 'Economy Same Day', priority: 'High', on_time_pct: 69.1, transit_min: 17, cost_inr: 69.1, parcels_hr: 128, distance_km: 6.8, lastDispatch: '2026-07-03 04:18' },
  { id: 'EDC-0031', zone: 'Koregaon Park PNE', vehicle: 'Cycle Courier', slaTier: 'Same Day (4hr)', priority: 'Medium', on_time_pct: 87.4, transit_min: 13, cost_inr: 107.3, parcels_hr: 108, distance_km: 7.4, lastDispatch: '2026-07-29 06:54' },
  { id: 'EDC-0032', zone: 'SG Highway AMD', vehicle: 'EV Three-Wheeler', slaTier: 'Same Day (2hr)', priority: 'Low', on_time_pct: 62.4, transit_min: 34, cost_inr: 339.9, parcels_hr: 108, distance_km: 13.0, lastDispatch: '2026-07-18 23:02' },
  { id: 'EDC-0033', zone: 'South Mumbai', vehicle: 'Bike Courier', slaTier: 'Next Hour', priority: 'Critical', on_time_pct: 65.2, transit_min: 85, cost_inr: 131.2, parcels_hr: 118, distance_km: 15.1, lastDispatch: '2026-07-12 00:59' },
  { id: 'EDC-0034', zone: 'Central Delhi', vehicle: 'Electric Scooter', slaTier: 'Express 30min', priority: 'High', on_time_pct: 83.9, transit_min: 72, cost_inr: 248.7, parcels_hr: 141, distance_km: 1.8, lastDispatch: '2026-07-09 03:32' },
  { id: 'EDC-0035', zone: 'Koramangala BLR', vehicle: 'Delivery Van', slaTier: 'Scheduled Window', priority: 'Medium', on_time_pct: 61.4, transit_min: 54, cost_inr: 342.4, parcels_hr: 104, distance_km: 5.5, lastDispatch: '2026-07-06 11:33' },
  { id: 'EDC-0036', zone: 'HITEC City HYD', vehicle: 'Auto Rickshaw', slaTier: 'Economy Same Day', priority: 'Low', on_time_pct: 86.7, transit_min: 14, cost_inr: 332.4, parcels_hr: 92, distance_km: 4.6, lastDispatch: '2026-07-02 04:57' },
  { id: 'EDC-0037', zone: 'Park Street KOL', vehicle: 'Drone Drop', slaTier: 'Same Day (4hr)', priority: 'Critical', on_time_pct: 89.7, transit_min: 17, cost_inr: 152.2, parcels_hr: 85, distance_km: 5.4, lastDispatch: '2026-07-07 14:43' },
  { id: 'EDC-0038', zone: 'T. Nagar CHN', vehicle: 'Walk-in Agent', slaTier: 'Same Day (2hr)', priority: 'High', on_time_pct: 60.1, transit_min: 25, cost_inr: 271.4, parcels_hr: 32, distance_km: 17.1, lastDispatch: '2026-07-11 04:48' },
  { id: 'EDC-0039', zone: 'Koregaon Park PNE', vehicle: 'Cycle Courier', slaTier: 'Next Hour', priority: 'Medium', on_time_pct: 85.3, transit_min: 79, cost_inr: 108.9, parcels_hr: 128, distance_km: 14.7, lastDispatch: '2026-07-20 12:24' },
  { id: 'EDC-0040', zone: 'SG Highway AMD', vehicle: 'EV Three-Wheeler', slaTier: 'Express 30min', priority: 'Low', on_time_pct: 83.8, transit_min: 19, cost_inr: 124.7, parcels_hr: 49, distance_km: 11.3, lastDispatch: '2026-07-18 21:51' },
  { id: 'EDC-0041', zone: 'South Mumbai', vehicle: 'Bike Courier', slaTier: 'Scheduled Window', priority: 'Critical', on_time_pct: 89.0, transit_min: 45, cost_inr: 327.5, parcels_hr: 89, distance_km: 14.2, lastDispatch: '2026-07-07 06:01' },
  { id: 'EDC-0042', zone: 'Central Delhi', vehicle: 'Electric Scooter', slaTier: 'Economy Same Day', priority: 'High', on_time_pct: 98.4, transit_min: 31, cost_inr: 103.6, parcels_hr: 158, distance_km: 12.6, lastDispatch: '2026-07-12 20:07' },
  { id: 'EDC-0043', zone: 'Koramangala BLR', vehicle: 'Delivery Van', slaTier: 'Same Day (4hr)', priority: 'Medium', on_time_pct: 76.5, transit_min: 83, cost_inr: 229.7, parcels_hr: 109, distance_km: 9.4, lastDispatch: '2026-07-03 21:21' },
  { id: 'EDC-0044', zone: 'HITEC City HYD', vehicle: 'Auto Rickshaw', slaTier: 'Same Day (2hr)', priority: 'Low', on_time_pct: 95.4, transit_min: 90, cost_inr: 108.5, parcels_hr: 88, distance_km: 2.6, lastDispatch: '2026-07-26 01:57' },
  { id: 'EDC-0045', zone: 'Park Street KOL', vehicle: 'Drone Drop', slaTier: 'Next Hour', priority: 'Critical', on_time_pct: 78.2, transit_min: 22, cost_inr: 310.4, parcels_hr: 32, distance_km: 11.3, lastDispatch: '2026-07-12 10:30' },
  { id: 'EDC-0046', zone: 'T. Nagar CHN', vehicle: 'Walk-in Agent', slaTier: 'Express 30min', priority: 'High', on_time_pct: 68.0, transit_min: 85, cost_inr: 197.5, parcels_hr: 159, distance_km: 2.0, lastDispatch: '2026-07-11 15:33' },
  { id: 'EDC-0047', zone: 'Koregaon Park PNE', vehicle: 'Cycle Courier', slaTier: 'Scheduled Window', priority: 'Medium', on_time_pct: 97.7, transit_min: 48, cost_inr: 113.8, parcels_hr: 37, distance_km: 16.1, lastDispatch: '2026-07-28 07:05' },
  { id: 'EDC-0048', zone: 'SG Highway AMD', vehicle: 'EV Three-Wheeler', slaTier: 'Economy Same Day', priority: 'Low', on_time_pct: 73.7, transit_min: 87, cost_inr: 146.3, parcels_hr: 30, distance_km: 11.1, lastDispatch: '2026-07-22 04:34' },
  { id: 'EDC-0049', zone: 'South Mumbai', vehicle: 'Bike Courier', slaTier: 'Same Day (4hr)', priority: 'Critical', on_time_pct: 70.1, transit_min: 10, cost_inr: 223.0, parcels_hr: 104, distance_km: 6.3, lastDispatch: '2026-07-16 12:42' },
  { id: 'EDC-0050', zone: 'Central Delhi', vehicle: 'Electric Scooter', slaTier: 'Same Day (2hr)', priority: 'High', on_time_pct: 74.0, transit_min: 75, cost_inr: 127.5, parcels_hr: 147, distance_km: 5.8, lastDispatch: '2026-07-21 11:20' },
  { id: 'EDC-0051', zone: 'Koramangala BLR', vehicle: 'Delivery Van', slaTier: 'Next Hour', priority: 'Medium', on_time_pct: 61.0, transit_min: 64, cost_inr: 259.7, parcels_hr: 100, distance_km: 11.4, lastDispatch: '2026-07-02 13:41' },
  { id: 'EDC-0052', zone: 'HITEC City HYD', vehicle: 'Auto Rickshaw', slaTier: 'Express 30min', priority: 'Low', on_time_pct: 76.0, transit_min: 68, cost_inr: 195.4, parcels_hr: 31, distance_km: 10.0, lastDispatch: '2026-07-10 17:25' },
  { id: 'EDC-0053', zone: 'Park Street KOL', vehicle: 'Drone Drop', slaTier: 'Scheduled Window', priority: 'Critical', on_time_pct: 73.9, transit_min: 91, cost_inr: 193.2, parcels_hr: 50, distance_km: 13.7, lastDispatch: '2026-07-14 09:56' },
  { id: 'EDC-0054', zone: 'T. Nagar CHN', vehicle: 'Walk-in Agent', slaTier: 'Economy Same Day', priority: 'High', on_time_pct: 79.6, transit_min: 33, cost_inr: 269.7, parcels_hr: 89, distance_km: 5.4, lastDispatch: '2026-07-09 09:05' },
  { id: 'EDC-0055', zone: 'Koregaon Park PNE', vehicle: 'Cycle Courier', slaTier: 'Same Day (4hr)', priority: 'Medium', on_time_pct: 91.2, transit_min: 83, cost_inr: 334.4, parcels_hr: 50, distance_km: 6.6, lastDispatch: '2026-07-10 09:33' },
  { id: 'EDC-0056', zone: 'SG Highway AMD', vehicle: 'EV Three-Wheeler', slaTier: 'Same Day (2hr)', priority: 'Low', on_time_pct: 64.2, transit_min: 10, cost_inr: 327.5, parcels_hr: 128, distance_km: 17.0, lastDispatch: '2026-07-24 05:49' },
  { id: 'EDC-0057', zone: 'South Mumbai', vehicle: 'Bike Courier', slaTier: 'Next Hour', priority: 'Critical', on_time_pct: 77.5, transit_min: 18, cost_inr: 128.8, parcels_hr: 135, distance_km: 11.1, lastDispatch: '2026-07-17 11:07' },
  { id: 'EDC-0058', zone: 'Central Delhi', vehicle: 'Electric Scooter', slaTier: 'Express 30min', priority: 'High', on_time_pct: 64.9, transit_min: 61, cost_inr: 68.6, parcels_hr: 74, distance_km: 11.5, lastDispatch: '2026-07-09 05:56' },
  { id: 'EDC-0059', zone: 'Koramangala BLR', vehicle: 'Delivery Van', slaTier: 'Scheduled Window', priority: 'Medium', on_time_pct: 82.2, transit_min: 59, cost_inr: 113.1, parcels_hr: 125, distance_km: 14.4, lastDispatch: '2026-07-22 22:01' },
  { id: 'EDC-0060', zone: 'HITEC City HYD', vehicle: 'Auto Rickshaw', slaTier: 'Economy Same Day', priority: 'Low', on_time_pct: 64.9, transit_min: 77, cost_inr: 148.5, parcels_hr: 124, distance_km: 16.5, lastDispatch: '2026-07-23 19:48' },
]

const peakData = [
  { hour: '00:00', dispatched: 68, delivered: 174, avgTime: 38.1 },
  { hour: '01:00', dispatched: 261, delivered: 166, avgTime: 31.1 },
  { hour: '02:00', dispatched: 315, delivered: 272, avgTime: 17.9 },
  { hour: '03:00', dispatched: 40, delivered: 159, avgTime: 37.4 },
  { hour: '04:00', dispatched: 64, delivered: 150, avgTime: 19.5 },
  { hour: '05:00', dispatched: 320, delivered: 103, avgTime: 33.2 },
  { hour: '06:00', dispatched: 292, delivered: 231, avgTime: 17.0 },
  { hour: '07:00', dispatched: 223, delivered: 278, avgTime: 29.9 },
  { hour: '08:00', dispatched: 217, delivered: 203, avgTime: 23.3 },
  { hour: '09:00', dispatched: 56, delivered: 115, avgTime: 17.2 },
  { hour: '10:00', dispatched: 110, delivered: 247, avgTime: 18.1 },
  { hour: '11:00', dispatched: 253, delivered: 198, avgTime: 23.2 },
  { hour: '12:00', dispatched: 174, delivered: 237, avgTime: 30.1 },
  { hour: '13:00', dispatched: 239, delivered: 98, avgTime: 21.3 },
  { hour: '14:00', dispatched: 186, delivered: 173, avgTime: 13.4 },
  { hour: '15:00', dispatched: 216, delivered: 260, avgTime: 33.2 },
  { hour: '16:00', dispatched: 165, delivered: 137, avgTime: 25.4 },
  { hour: '17:00', dispatched: 215, delivered: 223, avgTime: 37.6 },
  { hour: '18:00', dispatched: 224, delivered: 231, avgTime: 15.2 },
  { hour: '19:00', dispatched: 192, delivered: 197, avgTime: 19.1 },
  { hour: '20:00', dispatched: 263, delivered: 81, avgTime: 17.2 },
  { hour: '21:00', dispatched: 285, delivered: 172, avgTime: 34.3 },
  { hour: '22:00', dispatched: 216, delivered: 109, avgTime: 36.7 },
  { hour: '23:00', dispatched: 320, delivered: 165, avgTime: 42.3 },
]

const vehicleDist = [
  { name: 'Bike Courier', value: 55 },
  { name: 'Electric Scooter', value: 127 },
  { name: 'Delivery Van', value: 159 },
  { name: 'Auto Rickshaw', value: 192 },
  { name: 'Drone Drop', value: 206 },
  { name: 'Walk-in Agent', value: 227 },
  { name: 'Cycle Courier', value: 121 },
  { name: 'EV Three-Wheeler', value: 187 },
]

const filterGroups = [
  { key: 'zone', label: 'Zone', options: ZONES.map(z => ({ value: z, label: z, count: 0 })) },
  { key: 'vehicle', label: 'Vehicle', options: VEHICLES.map(v => ({ value: v, label: v, count: 0 })) },
  { key: 'slaTier', label: 'SLA Tier', options: SLA_TIERS.map(s => ({ value: s, label: s, count: 0 })) },
]

function ZoneBadge({ zone }: { zone: string }) {
  const color = zone.includes('Mumbai') ? 'bg-sky-500/15 text-sky-400' : zone.includes('Delhi') ? 'bg-blue-500/15 text-blue-400' : zone.includes('BLR') ? 'bg-cyan-500/15 text-cyan-400' : zone.includes('HYD') ? 'bg-indigo-500/15 text-indigo-400' : zone.includes('KOL') ? 'bg-emerald-500/15 text-emerald-400' : zone.includes('CHN') ? 'bg-amber-500/15 text-amber-400' : zone.includes('PNE') ? 'bg-pink-500/15 text-pink-400' : 'bg-orange-500/15 text-orange-400'
  return <span className={'edc-zone-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{zone}</span>
}

function VehicleBadge({ vehicle }: { vehicle: string }) {
  const color = vehicle === 'Bike Courier' ? 'bg-sky-500/15 text-sky-400' : vehicle === 'Electric Scooter' ? 'bg-emerald-500/15 text-emerald-400' : vehicle === 'Delivery Van' ? 'bg-blue-500/15 text-blue-400' : vehicle === 'Auto Rickshaw' ? 'bg-amber-500/15 text-amber-400' : vehicle === 'Drone Drop' ? 'bg-violet-500/15 text-violet-400' : vehicle === 'Walk-in Agent' ? 'bg-pink-500/15 text-pink-400' : vehicle === 'Cycle Courier' ? 'bg-lime-500/15 text-lime-400' : 'bg-orange-500/15 text-orange-400'
  return <span className={'edc-vehicle-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{vehicle}</span>
}

function PriorityBadge({ priority }: { priority: string }) {
  const color = priority === 'Critical' ? 'bg-red-500/15 text-red-400' : priority === 'High' ? 'bg-orange-500/15 text-orange-400' : priority === 'Medium' ? 'bg-amber-500/15 text-amber-400' : 'bg-blue-500/15 text-blue-400'
  return <span className={'edc-priority-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{priority}</span>
}

function OnTimeBar({ value }: { value: number }) {
  const w = value
  const color = value >= 90 ? 'bg-emerald-500' : value >= 75 ? 'bg-amber-500' : 'bg-red-500'
  return <div className='edc-ontime-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className={'h-full rounded-full edc-ontime-fill ' + color} style={{ width: w + '%', animation: 'edc-grow 1s ease-out' }}/></div>
}

function CostBar({ value }: { value: number }) {
  const w = Math.min(value / 3.5, 100)
  return <div className='edc-cost-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className='h-full rounded-full bg-sky-500 edc-cost-fill' style={{ width: w + '%', animation: 'edc-grow 1s ease-out' }}/></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, c = 2 * Math.PI * r, offset = c - (value / 100) * c
  return <div className='edc-ring flex flex-col items-center'><svg width='70' height='70' className='-rotate-90'><circle cx='35' cy='35' r={r} fill='none' stroke='#27272a' strokeWidth='5'/><circle cx='35' cy='35' r={r} fill='none' stroke={color} strokeWidth='5' strokeDasharray={c} strokeDashoffset={offset} strokeLinecap='round' className='edc-ring-path' style={{ transition: 'stroke-dashoffset 1s ease' }}/></svg><span className='edc-ring-val text-sm font-bold mt-1' style={{ color }}>{value}%</span><span className='edc-ring-label text-[10px] text-zinc-500'>{label}</span></div>
}

function KpiTile({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return <div className='edc-kpi bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 edc-kpi-card'><p className='text-xs text-zinc-500 mb-1'>{label}</p><p className={'text-xl font-bold ' + color}>{value}</p><p className='text-[10px] text-zinc-400 mt-1'>{sub}</p></div>
}

function ValueTile({ label, value, change }: { label: string; value: string; change: string }) {
  const up = change.startsWith('+')
  return <div className='edc-value-tile bg-zinc-900/60 border border-zinc-800 rounded-lg p-3'><p className='text-xs text-zinc-500'>{label}</p><p className='text-lg font-bold text-white mt-1'>{value}</p><p className={'text-xs mt-1 ' + (up ? 'text-emerald-400' : 'text-red-400')}>{change}</p></div>
}

const insights = [
  { title: 'Mumbai 30-Min Express Surge', desc: 'Express 30min deliveries in South Mumbai surged 340% during Ganesh Chaturthi pre-orders. 12 riders deployed from overflow pool. Average delivery time held at 24 minutes. Recommend pre-positioning 50 high-value SKUs at 5 micro-hubs across SoBo for festival season.', severity: 'high' },
  { title: 'Bangalore EV Fleet Expansion', desc: 'Electric Scooter fleet expanded to 85 vehicles in Koramangala zone, covering 92% of same-day deliveries. Carbon footprint reduced 40% vs petrol bikes. Rider satisfaction improved from 3.8 to 4.4 stars. Charging infra: 12 swap stations operational.', severity: 'medium' },
  { title: 'Hyderabad Drone Drop Pilot Success', desc: 'Drone delivery pilot in HITEC City completed 847 deliveries with 99.2% success rate. Average delivery time: 8 minutes for 2km radius. Regulatory approval received for 3 additional zones. Scale-up plan: 50 drones by Q4 2026.', severity: 'high' },
  { title: 'Dynamic Route Optimization v2', desc: 'Real-time route optimization engine now processes 15,000 deliveries/hour. Average transit time reduced 18% through traffic-aware routing. Integration with Google Maps real-time traffic and Ola/Uber API for rider assignment. Cost savings: INR 2.8L/day across all zones.', severity: 'low' },
]

export default function ExpressDeliveryCommandView() {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [tab, setTab] = useState('dashboard')

  const toggleFilter = (key: string, val: string) => {
    setActiveFilters(prev => { const cur = prev[key] || []; const next = cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val]; return { ...prev, [key]: next } })
  }

  const filtered = deliveries.filter(d => {
    for (const [key, vals] of Object.entries(activeFilters)) { if (vals.length > 0 && !vals.includes(d[key as keyof typeof d] as string)) return false }
    if (searchQuery && !Object.values(d).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))) return false
    return true
  })

  return (
    <div className='edc-root space-y-4 p-4'>
      <PageHeader title='Express Delivery Command' description='Same-day & instant delivery fleet management & SLA optimization' />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className='edc-tabs-list bg-zinc-900 border border-zinc-800'>
          <TabsTrigger value='dashboard' className='edc-tab'>Dashboard</TabsTrigger>
          <TabsTrigger value='deliveries' className='edc-tab'>Deliveries</TabsTrigger>
          <TabsTrigger value='analytics' className='edc-tab'>Analytics</TabsTrigger>
          <TabsTrigger value='insights' className='edc-tab'>Insights</TabsTrigger>
        </TabsList>
        <TabsContent value='dashboard' className='edc-tab-content space-y-4 mt-4'>
          <div className='edc-kpi-row grid grid-cols-2 lg:grid-cols-4 gap-3'>
            <KpiTile label='Active Deliveries' value='3,291' sub='+420 in last hour' color='text-sky-400' />
            <KpiTile label='On-Time Rate' value='94.6%' sub='+1.8pp vs yesterday' color='text-blue-400' />
            <KpiTile label='Avg Transit' value='22 min' sub='-3 min optimized' color='text-emerald-400' />
            <KpiTile label='Fleet Utilization' value='87%' sub='+4% peak hours' color='text-amber-400' />
          </div>
          <div className='edc-ring-row flex flex-wrap justify-around gap-2'>
            <HealthRing value={95} label='SLA Met' color='#0ea5e9' />
            <HealthRing value={88} label='Fleet Ready' color='#3b82f6' />
            <HealthRing value={92} label='Customer Sat' color='#06b6d4' />
            <HealthRing value={79} label='Route Opt.' color='#10b981' />
            <HealthRing value={85} label='EV Share' color='#f59e0b' />
            <HealthRing value={96} label='Safety' color='#ec4899' />
          </div>
          <div className='edc-chart-row grid grid-cols-1 lg:grid-cols-3 gap-4'>
            <Card className='edc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Peak Hour Dispatch</CardTitle></CardHeader><CardContent><LineChart data={peakData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='hour' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Line type='monotone' dataKey='dispatched' stroke='#0ea5e9' strokeWidth={2} dot={false}/><Line type='monotone' dataKey='delivered' stroke='#3b82f6' strokeWidth={2} dot={false}/></LineChart></CardContent></Card>
            <Card className='edc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Avg Delivery Time</CardTitle></CardHeader><CardContent><BarChart data={peakData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='hour' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Bar dataKey='avgTime' fill='#06b6d4' radius={[4,4,0,0]}/></BarChart></CardContent></Card>
            <Card className='edc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Vehicle Mix</CardTitle></CardHeader><CardContent><PieChart width={350} height={200}><Pie data={vehicleDist} cx='50%' cy='50%' outerRadius={70} innerRadius={35} dataKey='value' paddingAngle={2}>{vehicleDist.map((_, i) => <Cell key={i} fill={COLORS[i % 8]} />)}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value='deliveries' className='edc-tab-content space-y-4 mt-4'>
          <ModuleBreadcrumb items={[{ label: 'Express Command' }, { label: 'Deliveries' }]} />
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => { setActiveFilters({}); setSearchQuery('') }} totalItems={deliveries.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder='Search deliveries by ID, zone, vehicle, SLA tier...' />
          <Card className='edc-table-card bg-zinc-900/60 border-zinc-800'><CardContent className='p-0'><div className='edc-table-wrap overflow-x-auto max-h-[400px] overflow-y-auto'><table className='edc-table w-full text-sm'><thead><tr className='border-b border-zinc-800'><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>ID</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Zone</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Vehicle</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Priority</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>On-Time</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Cost</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Transit</th><th className='text-right px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Parcels/hr</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>SLA Tier</th></tr></thead><tbody>
          {filtered.map(d => (
            <tr key={d.id} className='edc-table-row border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors'>
              <td className='px-3 py-2 font-mono text-xs text-sky-400'>{d.id}</td>
              <td className='px-3 py-2'><ZoneBadge zone={d.zone} /></td>
              <td className='px-3 py-2'><VehicleBadge vehicle={d.vehicle} /></td>
              <td className='px-3 py-2'><PriorityBadge priority={d.priority} /></td>
              <td className='px-3 py-2 w-24'><OnTimeBar value={d.on_time_pct} /><span className='text-[10px] text-zinc-500 ml-1'>{d.on_time_pct}%</span></td>
              <td className='px-3 py-2 w-24'><CostBar value={d.cost_inr} /><span className='text-[10px] text-zinc-500 ml-1'>INR {d.cost_inr}</span></td>
              <td className='px-3 py-2 text-xs text-zinc-400'>{d.transit_min}m</td>
              <td className='px-3 py-2 text-right text-xs'>{d.parcels_hr}</td>
              <td className='px-3 py-2 text-xs text-zinc-300'>{d.slaTier}</td>
            </tr>
          ))})
          </tbody></table></div></CardContent></Card>
        </TabsContent>
        <TabsContent value='analytics' className='edc-tab-content space-y-4 mt-4'>
          <div className='edc-value-row grid grid-cols-2 lg:grid-cols-4 gap-3'>
            <ValueTile label='Total Parcels Today' value='24,580' change='+15% WoW' />
            <ValueTile label='Revenue Today' value='INR 18.4L' change='+INR 2.1L' />
            <ValueTile label='Avg Cost/Parcel' value='INR 42' change='-INR 5 optimized' />
            <ValueTile label='Fleet Size' value='342' change='+28 new EVs' />
          </div>
          <div className='edc-analytics-charts grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <Card className='edc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Zone Performance</CardTitle></CardHeader><CardContent><BarChart data={ZONES.map((z,i) => ({ name: z.split(' ')[0], onTime: [95,92,96,89,93,91,94,90][i], parcels: [320,280,350,240,210,260,190,300][i] }))} width={450} height={220}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='name' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Bar dataKey='onTime' fill='#0ea5e9' radius={[4,4,0,0]}/><Bar dataKey='parcels' fill='#3b82f6' radius={[4,4,0,0]}/></BarChart></CardContent></Card>
            <Card className='edc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>SLA Tier Distribution</CardTitle></CardHeader><CardContent><PieChart width={450} height={220}><Pie data={[{ name: 'Same Day 4hr', value: 32 }, { name: 'Same Day 2hr', value: 24 }, { name: 'Next Hour', value: 18 }, { name: 'Express 30min', value: 14 }, { name: 'Scheduled', value: 8 }, { name: 'Economy', value: 4 }]} cx='50%' cy='50%' outerRadius={80} innerRadius={40} dataKey='value' paddingAngle={3}>{[<Cell key={0} fill='#0ea5e9' />, <Cell key={1} fill='#3b82f6' />, <Cell key={2} fill='#06b6d4' />, <Cell key={3} fill='#10b981' />, <Cell key={4} fill='#f59e0b' />, <Cell key={5} fill='#ec4899' />]}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value='insights' className='edc-tab-content space-y-4 mt-4'>
          {insights.map((ins, i) => (
            <Card key={i} className={'edc-insight-card bg-zinc-900/60 border ' + (ins.severity === 'high' ? 'border-sky-500/30' : ins.severity === 'medium' ? 'border-blue-500/30' : 'border-zinc-800')}><CardContent className='p-4'><div className='flex items-start gap-3'><div className={'edc-insight-dot w-2 h-2 rounded-full mt-1.5 shrink-0 ' + (ins.severity === 'high' ? 'bg-sky-500' : ins.severity === 'medium' ? 'bg-blue-500' : 'bg-zinc-500')} /><div><p className='text-sm font-medium text-zinc-200'>{ins.title}</p><p className='text-xs text-zinc-400 mt-1 leading-relaxed'>{ins.desc}</p></div></div></CardContent></Card>
          ))})
        </TabsContent>
      </Tabs>
    </div>
  )
}
