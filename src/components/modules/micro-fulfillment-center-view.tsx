import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#06b6d4', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#6366f1']

const ZONE_TYPES = ['Pick Zone', 'Pack Zone', 'Staging', 'Returns', 'Cold Storage', 'Bulk Storage', 'Value-Add', 'QC Zone']
const CITIES = ['Mumbai', 'Delhi NCR', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad']
const STATUSES = ['Operational', 'Setup', 'Maintenance', 'Under Review']
const AUTOMATION = ['Full Auto', 'Semi-Auto', 'Manual', 'Robot-Assisted']
const CENTER_NAMES = ['Central', 'South', 'North', 'East', 'West', 'Express', 'Prime', 'Lite']

const centers = [
  { id: 'MFC-0001', name: 'MFC Mumbai Central', city: 'Mumbai', zoneType: 'Pick Zone', status: 'Operational', automation: 'Full Auto', utilization: 70, ordersPerHr: 790, throughput: 928, sqft: 13116, workers: 48, avgFulfillTime: 14.5, accuracy: 98, activatedAt: '2026-05-22' },
  { id: 'MFC-0002', name: 'MFC Delhi NCR South', city: 'Delhi NCR', zoneType: 'Pack Zone', status: 'Setup', automation: 'Semi-Auto', utilization: 70, ordersPerHr: 223, throughput: 359, sqft: 23628, workers: 56, avgFulfillTime: 23.3, accuracy: 97, activatedAt: '2026-06-24' },
  { id: 'MFC-0003', name: 'MFC Bangalore North', city: 'Bangalore', zoneType: 'Staging', status: 'Maintenance', automation: 'Manual', utilization: 47, ordersPerHr: 482, throughput: 1087, sqft: 4924, workers: 25, avgFulfillTime: 19.0, accuracy: 98, activatedAt: '2026-06-16' },
  { id: 'MFC-0004', name: 'MFC Hyderabad East', city: 'Hyderabad', zoneType: 'Returns', status: 'Under Review', automation: 'Robot-Assisted', utilization: 43, ordersPerHr: 608, throughput: 768, sqft: 3373, workers: 56, avgFulfillTime: 28.4, accuracy: 95, activatedAt: '2026-04-03' },
  { id: 'MFC-0005', name: 'MFC Chennai West', city: 'Chennai', zoneType: 'Cold Storage', status: 'Operational', automation: 'Full Auto', utilization: 45, ordersPerHr: 841, throughput: 511, sqft: 6346, workers: 57, avgFulfillTime: 35.0, accuracy: 97, activatedAt: '2026-02-21' },
  { id: 'MFC-0006', name: 'MFC Pune Express', city: 'Pune', zoneType: 'Bulk Storage', status: 'Setup', automation: 'Semi-Auto', utilization: 74, ordersPerHr: 316, throughput: 746, sqft: 10643, workers: 46, avgFulfillTime: 37.7, accuracy: 94, activatedAt: '2026-06-01' },
  { id: 'MFC-0007', name: 'MFC Kolkata Prime', city: 'Kolkata', zoneType: 'Value-Add', status: 'Maintenance', automation: 'Manual', utilization: 95, ordersPerHr: 715, throughput: 623, sqft: 19538, workers: 57, avgFulfillTime: 18.1, accuracy: 95, activatedAt: '2026-04-10' },
  { id: 'MFC-0008', name: 'MFC Ahmedabad Lite', city: 'Ahmedabad', zoneType: 'QC Zone', status: 'Under Review', automation: 'Robot-Assisted', utilization: 78, ordersPerHr: 793, throughput: 354, sqft: 5604, workers: 59, avgFulfillTime: 38.8, accuracy: 95, activatedAt: '2026-06-09' },
  { id: 'MFC-0009', name: 'MFC Mumbai Central', city: 'Mumbai', zoneType: 'Pick Zone', status: 'Operational', automation: 'Full Auto', utilization: 70, ordersPerHr: 364, throughput: 1099, sqft: 17591, workers: 30, avgFulfillTime: 13.4, accuracy: 95, activatedAt: '2026-04-02' },
  { id: 'MFC-0010', name: 'MFC Delhi NCR South', city: 'Delhi NCR', zoneType: 'Pack Zone', status: 'Setup', automation: 'Semi-Auto', utilization: 44, ordersPerHr: 830, throughput: 1380, sqft: 18999, workers: 27, avgFulfillTime: 37.6, accuracy: 96, activatedAt: '2026-01-12' },
  { id: 'MFC-0011', name: 'MFC Bangalore North', city: 'Bangalore', zoneType: 'Staging', status: 'Maintenance', automation: 'Manual', utilization: 73, ordersPerHr: 341, throughput: 1083, sqft: 19554, workers: 43, avgFulfillTime: 23.7, accuracy: 99, activatedAt: '2026-01-24' },
  { id: 'MFC-0012', name: 'MFC Hyderabad East', city: 'Hyderabad', zoneType: 'Returns', status: 'Under Review', automation: 'Robot-Assisted', utilization: 69, ordersPerHr: 724, throughput: 357, sqft: 23403, workers: 21, avgFulfillTime: 10.0, accuracy: 99, activatedAt: '2026-05-18' },
  { id: 'MFC-0013', name: 'MFC Chennai West', city: 'Chennai', zoneType: 'Cold Storage', status: 'Operational', automation: 'Full Auto', utilization: 43, ordersPerHr: 673, throughput: 1401, sqft: 20697, workers: 14, avgFulfillTime: 13.3, accuracy: 98, activatedAt: '2026-07-28' },
  { id: 'MFC-0014', name: 'MFC Pune Express', city: 'Pune', zoneType: 'Bulk Storage', status: 'Setup', automation: 'Semi-Auto', utilization: 84, ordersPerHr: 459, throughput: 787, sqft: 13237, workers: 15, avgFulfillTime: 22.4, accuracy: 97, activatedAt: '2026-04-14' },
  { id: 'MFC-0015', name: 'MFC Kolkata Prime', city: 'Kolkata', zoneType: 'Value-Add', status: 'Maintenance', automation: 'Manual', utilization: 74, ordersPerHr: 503, throughput: 1231, sqft: 7926, workers: 16, avgFulfillTime: 21.2, accuracy: 96, activatedAt: '2026-03-15' },
  { id: 'MFC-0016', name: 'MFC Ahmedabad Lite', city: 'Ahmedabad', zoneType: 'QC Zone', status: 'Under Review', automation: 'Robot-Assisted', utilization: 82, ordersPerHr: 192, throughput: 889, sqft: 24503, workers: 53, avgFulfillTime: 25.6, accuracy: 95, activatedAt: '2026-04-19' },
  { id: 'MFC-0017', name: 'MFC Mumbai Central', city: 'Mumbai', zoneType: 'Pick Zone', status: 'Operational', automation: 'Full Auto', utilization: 81, ordersPerHr: 359, throughput: 303, sqft: 6761, workers: 55, avgFulfillTime: 14.8, accuracy: 99, activatedAt: '2026-02-27' },
  { id: 'MFC-0018', name: 'MFC Delhi NCR South', city: 'Delhi NCR', zoneType: 'Pack Zone', status: 'Setup', automation: 'Semi-Auto', utilization: 67, ordersPerHr: 640, throughput: 439, sqft: 3257, workers: 37, avgFulfillTime: 28.5, accuracy: 95, activatedAt: '2026-01-02' },
  { id: 'MFC-0019', name: 'MFC Bangalore North', city: 'Bangalore', zoneType: 'Staging', status: 'Maintenance', automation: 'Manual', utilization: 41, ordersPerHr: 425, throughput: 1328, sqft: 10610, workers: 32, avgFulfillTime: 10.8, accuracy: 98, activatedAt: '2026-05-21' },
  { id: 'MFC-0020', name: 'MFC Hyderabad East', city: 'Hyderabad', zoneType: 'Returns', status: 'Under Review', automation: 'Robot-Assisted', utilization: 59, ordersPerHr: 154, throughput: 339, sqft: 19275, workers: 26, avgFulfillTime: 10.2, accuracy: 95, activatedAt: '2026-02-16' },
  { id: 'MFC-0021', name: 'MFC Chennai West', city: 'Chennai', zoneType: 'Cold Storage', status: 'Operational', automation: 'Full Auto', utilization: 67, ordersPerHr: 779, throughput: 1369, sqft: 11320, workers: 46, avgFulfillTime: 33.8, accuracy: 98, activatedAt: '2026-02-23' },
  { id: 'MFC-0022', name: 'MFC Pune Express', city: 'Pune', zoneType: 'Bulk Storage', status: 'Setup', automation: 'Semi-Auto', utilization: 43, ordersPerHr: 278, throughput: 1470, sqft: 18808, workers: 31, avgFulfillTime: 8.5, accuracy: 98, activatedAt: '2026-02-04' },
  { id: 'MFC-0023', name: 'MFC Kolkata Prime', city: 'Kolkata', zoneType: 'Value-Add', status: 'Maintenance', automation: 'Manual', utilization: 66, ordersPerHr: 471, throughput: 376, sqft: 18553, workers: 43, avgFulfillTime: 22.8, accuracy: 98, activatedAt: '2026-06-20' },
  { id: 'MFC-0024', name: 'MFC Ahmedabad Lite', city: 'Ahmedabad', zoneType: 'QC Zone', status: 'Under Review', automation: 'Robot-Assisted', utilization: 69, ordersPerHr: 441, throughput: 570, sqft: 21173, workers: 35, avgFulfillTime: 10.2, accuracy: 97, activatedAt: '2026-02-05' },
  { id: 'MFC-0025', name: 'MFC Mumbai Central', city: 'Mumbai', zoneType: 'Pick Zone', status: 'Operational', automation: 'Full Auto', utilization: 75, ordersPerHr: 686, throughput: 495, sqft: 22207, workers: 39, avgFulfillTime: 24.4, accuracy: 98, activatedAt: '2026-05-06' },
  { id: 'MFC-0026', name: 'MFC Delhi NCR South', city: 'Delhi NCR', zoneType: 'Pack Zone', status: 'Setup', automation: 'Semi-Auto', utilization: 68, ordersPerHr: 847, throughput: 1368, sqft: 15626, workers: 35, avgFulfillTime: 20.7, accuracy: 98, activatedAt: '2026-02-02' },
  { id: 'MFC-0027', name: 'MFC Bangalore North', city: 'Bangalore', zoneType: 'Staging', status: 'Maintenance', automation: 'Manual', utilization: 80, ordersPerHr: 357, throughput: 466, sqft: 6692, workers: 32, avgFulfillTime: 19.5, accuracy: 98, activatedAt: '2026-07-02' },
  { id: 'MFC-0028', name: 'MFC Hyderabad East', city: 'Hyderabad', zoneType: 'Returns', status: 'Under Review', automation: 'Robot-Assisted', utilization: 40, ordersPerHr: 344, throughput: 317, sqft: 18187, workers: 31, avgFulfillTime: 43.3, accuracy: 97, activatedAt: '2026-03-22' },
  { id: 'MFC-0029', name: 'MFC Chennai West', city: 'Chennai', zoneType: 'Cold Storage', status: 'Operational', automation: 'Full Auto', utilization: 96, ordersPerHr: 197, throughput: 1140, sqft: 11273, workers: 54, avgFulfillTime: 40.9, accuracy: 96, activatedAt: '2026-04-13' },
  { id: 'MFC-0030', name: 'MFC Pune Express', city: 'Pune', zoneType: 'Bulk Storage', status: 'Setup', automation: 'Semi-Auto', utilization: 82, ordersPerHr: 310, throughput: 246, sqft: 23682, workers: 11, avgFulfillTime: 27.4, accuracy: 95, activatedAt: '2026-07-05' },
  { id: 'MFC-0031', name: 'MFC Kolkata Prime', city: 'Kolkata', zoneType: 'Value-Add', status: 'Maintenance', automation: 'Manual', utilization: 63, ordersPerHr: 692, throughput: 1031, sqft: 5183, workers: 47, avgFulfillTime: 42.7, accuracy: 99, activatedAt: '2026-06-22' },
  { id: 'MFC-0032', name: 'MFC Ahmedabad Lite', city: 'Ahmedabad', zoneType: 'QC Zone', status: 'Under Review', automation: 'Robot-Assisted', utilization: 81, ordersPerHr: 215, throughput: 580, sqft: 6796, workers: 17, avgFulfillTime: 8.2, accuracy: 99, activatedAt: '2026-01-10' },
  { id: 'MFC-0033', name: 'MFC Mumbai Central', city: 'Mumbai', zoneType: 'Pick Zone', status: 'Operational', automation: 'Full Auto', utilization: 51, ordersPerHr: 736, throughput: 1287, sqft: 4153, workers: 18, avgFulfillTime: 15.2, accuracy: 97, activatedAt: '2026-07-25' },
  { id: 'MFC-0034', name: 'MFC Delhi NCR South', city: 'Delhi NCR', zoneType: 'Pack Zone', status: 'Setup', automation: 'Semi-Auto', utilization: 77, ordersPerHr: 637, throughput: 345, sqft: 5285, workers: 38, avgFulfillTime: 21.5, accuracy: 94, activatedAt: '2026-07-09' },
  { id: 'MFC-0035', name: 'MFC Bangalore North', city: 'Bangalore', zoneType: 'Staging', status: 'Maintenance', automation: 'Manual', utilization: 52, ordersPerHr: 559, throughput: 1343, sqft: 14805, workers: 19, avgFulfillTime: 29.6, accuracy: 98, activatedAt: '2026-06-11' },
  { id: 'MFC-0036', name: 'MFC Hyderabad East', city: 'Hyderabad', zoneType: 'Returns', status: 'Under Review', automation: 'Robot-Assisted', utilization: 69, ordersPerHr: 241, throughput: 1141, sqft: 17456, workers: 30, avgFulfillTime: 37.3, accuracy: 96, activatedAt: '2026-05-20' },
  { id: 'MFC-0037', name: 'MFC Chennai West', city: 'Chennai', zoneType: 'Cold Storage', status: 'Operational', automation: 'Full Auto', utilization: 97, ordersPerHr: 549, throughput: 348, sqft: 21944, workers: 11, avgFulfillTime: 27.9, accuracy: 96, activatedAt: '2026-05-28' },
  { id: 'MFC-0038', name: 'MFC Pune Express', city: 'Pune', zoneType: 'Bulk Storage', status: 'Setup', automation: 'Semi-Auto', utilization: 91, ordersPerHr: 385, throughput: 973, sqft: 13999, workers: 10, avgFulfillTime: 16.3, accuracy: 94, activatedAt: '2026-07-13' },
  { id: 'MFC-0039', name: 'MFC Kolkata Prime', city: 'Kolkata', zoneType: 'Value-Add', status: 'Maintenance', automation: 'Manual', utilization: 47, ordersPerHr: 436, throughput: 839, sqft: 16223, workers: 44, avgFulfillTime: 28.7, accuracy: 96, activatedAt: '2026-06-06' },
  { id: 'MFC-0040', name: 'MFC Ahmedabad Lite', city: 'Ahmedabad', zoneType: 'QC Zone', status: 'Under Review', automation: 'Robot-Assisted', utilization: 91, ordersPerHr: 658, throughput: 432, sqft: 3024, workers: 53, avgFulfillTime: 28.0, accuracy: 96, activatedAt: '2026-06-28' },
  { id: 'MFC-0041', name: 'MFC Mumbai Central', city: 'Mumbai', zoneType: 'Pick Zone', status: 'Operational', automation: 'Full Auto', utilization: 55, ordersPerHr: 128, throughput: 601, sqft: 13756, workers: 49, avgFulfillTime: 35.9, accuracy: 94, activatedAt: '2026-02-27' },
  { id: 'MFC-0042', name: 'MFC Delhi NCR South', city: 'Delhi NCR', zoneType: 'Pack Zone', status: 'Setup', automation: 'Semi-Auto', utilization: 57, ordersPerHr: 442, throughput: 569, sqft: 18582, workers: 39, avgFulfillTime: 19.6, accuracy: 98, activatedAt: '2026-03-02' },
  { id: 'MFC-0043', name: 'MFC Bangalore North', city: 'Bangalore', zoneType: 'Staging', status: 'Maintenance', automation: 'Manual', utilization: 86, ordersPerHr: 740, throughput: 1449, sqft: 19709, workers: 42, avgFulfillTime: 15.7, accuracy: 95, activatedAt: '2026-02-28' },
  { id: 'MFC-0044', name: 'MFC Hyderabad East', city: 'Hyderabad', zoneType: 'Returns', status: 'Under Review', automation: 'Robot-Assisted', utilization: 71, ordersPerHr: 541, throughput: 1391, sqft: 2205, workers: 14, avgFulfillTime: 16.8, accuracy: 99, activatedAt: '2026-01-01' },
  { id: 'MFC-0045', name: 'MFC Chennai West', city: 'Chennai', zoneType: 'Cold Storage', status: 'Operational', automation: 'Full Auto', utilization: 70, ordersPerHr: 230, throughput: 722, sqft: 7542, workers: 12, avgFulfillTime: 38.5, accuracy: 98, activatedAt: '2026-07-01' },
  { id: 'MFC-0046', name: 'MFC Pune Express', city: 'Pune', zoneType: 'Bulk Storage', status: 'Setup', automation: 'Semi-Auto', utilization: 65, ordersPerHr: 593, throughput: 449, sqft: 15641, workers: 59, avgFulfillTime: 32.2, accuracy: 99, activatedAt: '2026-07-17' },
  { id: 'MFC-0047', name: 'MFC Kolkata Prime', city: 'Kolkata', zoneType: 'Value-Add', status: 'Maintenance', automation: 'Manual', utilization: 54, ordersPerHr: 138, throughput: 764, sqft: 13069, workers: 28, avgFulfillTime: 39.9, accuracy: 97, activatedAt: '2026-01-23' },
  { id: 'MFC-0048', name: 'MFC Ahmedabad Lite', city: 'Ahmedabad', zoneType: 'QC Zone', status: 'Under Review', automation: 'Robot-Assisted', utilization: 74, ordersPerHr: 615, throughput: 318, sqft: 19890, workers: 19, avgFulfillTime: 18.1, accuracy: 96, activatedAt: '2026-07-17' },
  { id: 'MFC-0049', name: 'MFC Mumbai Central', city: 'Mumbai', zoneType: 'Pick Zone', status: 'Operational', automation: 'Full Auto', utilization: 94, ordersPerHr: 435, throughput: 1260, sqft: 24854, workers: 56, avgFulfillTime: 16.4, accuracy: 94, activatedAt: '2026-04-25' },
  { id: 'MFC-0050', name: 'MFC Delhi NCR South', city: 'Delhi NCR', zoneType: 'Pack Zone', status: 'Setup', automation: 'Semi-Auto', utilization: 73, ordersPerHr: 217, throughput: 746, sqft: 21124, workers: 30, avgFulfillTime: 44.8, accuracy: 96, activatedAt: '2026-07-04' },
  { id: 'MFC-0051', name: 'MFC Bangalore North', city: 'Bangalore', zoneType: 'Staging', status: 'Maintenance', automation: 'Manual', utilization: 96, ordersPerHr: 152, throughput: 222, sqft: 7203, workers: 35, avgFulfillTime: 34.3, accuracy: 99, activatedAt: '2026-06-17' },
  { id: 'MFC-0052', name: 'MFC Hyderabad East', city: 'Hyderabad', zoneType: 'Returns', status: 'Under Review', automation: 'Robot-Assisted', utilization: 86, ordersPerHr: 548, throughput: 894, sqft: 5979, workers: 36, avgFulfillTime: 22.0, accuracy: 97, activatedAt: '2026-04-10' },
  { id: 'MFC-0053', name: 'MFC Chennai West', city: 'Chennai', zoneType: 'Cold Storage', status: 'Operational', automation: 'Full Auto', utilization: 94, ordersPerHr: 416, throughput: 609, sqft: 24047, workers: 14, avgFulfillTime: 8.6, accuracy: 98, activatedAt: '2026-02-06' },
  { id: 'MFC-0054', name: 'MFC Pune Express', city: 'Pune', zoneType: 'Bulk Storage', status: 'Setup', automation: 'Semi-Auto', utilization: 70, ordersPerHr: 440, throughput: 877, sqft: 15966, workers: 11, avgFulfillTime: 26.5, accuracy: 99, activatedAt: '2026-04-01' },
  { id: 'MFC-0055', name: 'MFC Kolkata Prime', city: 'Kolkata', zoneType: 'Value-Add', status: 'Maintenance', automation: 'Manual', utilization: 58, ordersPerHr: 638, throughput: 1471, sqft: 10358, workers: 16, avgFulfillTime: 9.2, accuracy: 95, activatedAt: '2026-05-16' },
]

const monthlyData = [
  { month: 'Jan', orders: 12587, throughput: 12407, utilization: 83.8 },
  { month: 'Feb', orders: 6111, throughput: 13007, utilization: 91.8 },
  { month: 'Mar', orders: 8029, throughput: 12914, utilization: 91.0 },
  { month: 'Apr', orders: 5667, throughput: 10308, utilization: 87.9 },
  { month: 'May', orders: 13734, throughput: 11731, utilization: 72.9 },
  { month: 'Jun', orders: 7395, throughput: 10560, utilization: 73.7 },
  { month: 'Jul', orders: 8018, throughput: 15902, utilization: 79.2 },
  { month: 'Aug', orders: 10682, throughput: 8662, utilization: 88.8 },
  { month: 'Sep', orders: 10737, throughput: 15390, utilization: 73.4 },
  { month: 'Oct', orders: 14646, throughput: 14116, utilization: 76.0 },
  { month: 'Nov', orders: 8020, throughput: 17733, utilization: 87.2 },
  { month: 'Dec', orders: 14817, throughput: 15212, utilization: 66.6 },
]

const zoneDist = [
  { name: 'Pick Zone', value: 85 },
  { name: 'Pack Zone', value: 40 },
  { name: 'Staging', value: 84 },
  { name: 'Returns', value: 90 },
  { name: 'Cold Storage', value: 74 },
  { name: 'Bulk Storage', value: 82 },
  { name: 'Value-Add', value: 57 },
  { name: 'QC Zone', value: 36 },
]

const filterGroups = [
  { key: 'zoneType', label: 'Zone Type', options: ZONE_TYPES.map(z => ({ value: z, label: z, count: 0 })) },
  { key: 'automation', label: 'Automation', options: AUTOMATION.map(a => ({ value: a, label: a, count: 0 })) },
  { key: 'status', label: 'Status', options: STATUSES.map(s => ({ value: s, label: s, count: 0 })) },
]

function ZoneBadge({ zone }: { zone: string }) {
  const color = zone === 'Pick Zone' ? 'bg-cyan-500/15 text-cyan-400' : zone === 'Pack Zone' ? 'bg-blue-500/15 text-blue-400' : zone === 'Cold Storage' ? 'bg-emerald-500/15 text-emerald-400' : zone === 'Returns' ? 'bg-red-500/15 text-red-400' : zone === 'Value-Add' ? 'bg-violet-500/15 text-violet-400' : zone === 'QC Zone' ? 'bg-amber-500/15 text-amber-400' : zone === 'Staging' ? 'bg-pink-500/15 text-pink-400' : 'bg-zinc-500/15 text-zinc-400'
  return <span className={'mfc-zone-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{zone}</span>
}

function StatusBadge({ status }: { status: string }) {
  const color = status === 'Operational' ? 'bg-emerald-500/15 text-emerald-400' : status === 'Setup' ? 'bg-blue-500/15 text-blue-400' : status === 'Maintenance' ? 'bg-amber-500/15 text-amber-400' : 'bg-zinc-500/15 text-zinc-400'
  return <span className={'mfc-status-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{status}</span>
}

function AutoBadge({ level }: { level: string }) {
  const color = level === 'Full Auto' ? 'bg-violet-500/15 text-violet-400' : level === 'Semi-Auto' ? 'bg-blue-500/15 text-blue-400' : level === 'Robot-Assisted' ? 'bg-cyan-500/15 text-cyan-400' : 'bg-zinc-500/15 text-zinc-400'
  return <span className={'mfc-auto-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{level}</span>
}

function UtilBar({ value }: { value: number }) {
  const w = value
  const color = value > 85 ? 'bg-emerald-500' : value > 65 ? 'bg-blue-500' : value > 45 ? 'bg-amber-500' : 'bg-red-500'
  return <div className='mfc-util-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className={'h-full rounded-full mfc-util-fill ' + color} style={{ width: w + '%', animation: 'mfc-grow 1s ease-out' }}/></div>
}

function ThroughputBar({ value, max }: { value: number; max: number }) {
  const w = Math.round(value / max * 100)
  return <div className='mfc-tp-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className='h-full rounded-full bg-cyan-500 mfc-tp-fill' style={{ width: w + '%', animation: 'mfc-grow 1s ease-out' }}/></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, c = 2 * Math.PI * r, offset = c - (value / 100) * c
  return <div className='mfc-ring flex flex-col items-center'><svg width='70' height='70' className='-rotate-90'><circle cx='35' cy='35' r={r} fill='none' stroke='#27272a' strokeWidth='5'/><circle cx='35' cy='35' r={r} fill='none' stroke={color} strokeWidth='5' strokeDasharray={c} strokeDashoffset={offset} strokeLinecap='round' className='mfc-ring-path' style={{ transition: 'stroke-dashoffset 1s ease' }}/></svg><span className='mfc-ring-val text-sm font-bold mt-1' style={{ color }}>{value}%</span><span className='mfc-ring-label text-[10px] text-zinc-500'>{label}</span></div>
}

function KpiTile({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return <div className='mfc-kpi bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 mfc-kpi-card'><p className='text-xs text-zinc-500 mb-1'>{label}</p><p className={'text-xl font-bold ' + color}>{value}</p><p className='text-[10px] text-zinc-400 mt-1'>{sub}</p></div>
}

function ValueTile({ label, value, change }: { label: string; value: string; change: string }) {
  const up = change.startsWith('+')
  return <div className='mfc-value-tile bg-zinc-900/60 border border-zinc-800 rounded-lg p-3'><p className='text-xs text-zinc-500'>{label}</p><p className='text-lg font-bold text-white mt-1'>{value}</p><p className={'text-xs mt-1 ' + (up ? 'text-emerald-400' : 'text-red-400')}>{change}</p></div>
}

const insights = [
  { title: 'Peak Hour Optimization', desc: 'Mumbai Central and Delhi NCR Express centers exceeding 92% utilization during 2-5 PM peak. Recommend adding robot-assisted pick stations to reduce bottlenecks by 30%.', severity: 'high' },
  { title: 'Automation ROI Milestone', desc: 'Full Auto centers now achieve 3.2x throughput vs manual at 1.8x cost. Bangalore South and Hyderabad Central show best ROI at 14-month payback period.', severity: 'medium' },
  { title: 'Cold Storage Expansion', desc: 'Chennai and Kolkata MFCs report 85% cold storage capacity. Pharma and frozen food demand up 40% YoY. Recommend modular cold unit installation by Q3.', severity: 'high' },
  { title: 'Worker Efficiency Gains', desc: 'Semi-Auto zones show 28% pick rate improvement after wearable scanner deployment. Expand to all Pick Zones across 55 centers by end of August.', severity: 'low' },
]

export default function MicroFulfillmentCenterView() {
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

  const filtered = centers.filter(c => {
    for (const [key, vals] of Object.entries(activeFilters)) {
      if (vals.length > 0 && !vals.includes(c[key as keyof typeof c] as string)) return false
    }
    if (searchQuery && !Object.values(c).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))) return false
    return true
  })

  return (
    <div className='mfc-root space-y-4 p-4'>
      <PageHeader title='Micro-Fulfillment Center' description='Hyperlocal dark store & micro-warehouse operations' />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className='mfc-tabs-list bg-zinc-900 border border-zinc-800'>
          <TabsTrigger value='dashboard' className='mfc-tab'>Dashboard</TabsTrigger>
          <TabsTrigger value='centers' className='mfc-tab'>Centers</TabsTrigger>
          <TabsTrigger value='analytics' className='mfc-tab'>Analytics</TabsTrigger>
          <TabsTrigger value='insights' className='mfc-tab'>Insights</TabsTrigger>
        </TabsList>

        <TabsContent value='dashboard' className='mfc-tab-content space-y-4 mt-4'>
          <div className='mfc-kpi-row grid grid-cols-2 lg:grid-cols-4 gap-3'>
            <KpiTile label='Active Centers' value='55' sub='+8 this quarter' color='text-cyan-400' />
            <KpiTile label='Avg Utilization' value='76.4%' sub='+4.2pp vs Q1' color='text-blue-400' />
            <KpiTile label='Orders/Hour' value='487' sub='+23% peak hours' color='text-emerald-400' />
            <KpiTile label='Fulfill Accuracy' value='97.8%' sub='+0.6pp improvement' color='text-amber-400' />
          </div>
          <div className='mfc-ring-row flex flex-wrap justify-around gap-2'>
            <HealthRing value={76} label='Utilization' color='#06b6d4' />
            <HealthRing value={92} label='Uptime' color='#3b82f6' />
            <HealthRing value={88} label='Pick Rate' color='#10b981' />
            <HealthRing value={71} label='Automation' color='#f59e0b' />
            <HealthRing value={85} label='On-Time' color='#8b5cf6' />
            <HealthRing value={94} label='Quality' color='#ec4899' />
          </div>
          <div className='mfc-chart-row grid grid-cols-1 lg:grid-cols-3 gap-4'>
            <Card className='mfc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Order Volume</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='month' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Line type='monotone' dataKey='orders' stroke='#06b6d4' strokeWidth={2} dot={false}/><Line type='monotone' dataKey='throughput' stroke='#3b82f6' strokeWidth={2} dot={false}/></LineChart></CardContent></Card>
            <Card className='mfc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Utilization Trend</CardTitle></CardHeader><CardContent><BarChart data={monthlyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='month' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Bar dataKey='utilization' fill='#10b981' radius={[4,4,0,0]}/></BarChart></CardContent></Card>
            <Card className='mfc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Zone Distribution</CardTitle></CardHeader><CardContent><PieChart width={350} height={200}><Pie data={zoneDist} cx='50%' cy='50%' outerRadius={70} innerRadius={35} dataKey='value' paddingAngle={2}>{zoneDist.map((_, i) => <Cell key={i} fill={COLORS[i % 8]} />)}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value='centers' className='mfc-tab-content space-y-4 mt-4'>
          <ModuleBreadcrumb items={[{ label: 'Micro-Fulfillment' }, { label: 'Centers' }]} />
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => { setActiveFilters({}); setSearchQuery('') }} totalItems={centers.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search centers by ID, name, or city..." />
          <Card className='mfc-table-card bg-zinc-900/60 border-zinc-800'><CardContent className='p-0'><div className='mfc-table-wrap overflow-x-auto'><table className='mfc-table w-full text-sm'><thead><tr className='border-b border-zinc-800'><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>ID</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Name</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>City</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Zone</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Automation</th><th className='text-right px-3 py-2 text-zinc-500 text-xs font-medium'>Sqft</th><th className='text-right px-3 py-2 text-zinc-500 text-xs font-medium'>Orders/Hr</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Utilization</th><th className='text-right px-3 py-2 text-zinc-500 text-xs font-medium'>Throughput</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Status</th></tr></thead><tbody>
          {filtered.map(c => (
            <tr key={c.id} className='mfc-table-row border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors'>
              <td className='px-3 py-2 font-mono text-xs text-cyan-400'>{c.id}</td>
              <td className='px-3 py-2 text-xs font-medium text-zinc-200'>{c.name}</td>
              <td className='px-3 py-2 text-xs text-zinc-300'>{c.city}</td>
              <td className='px-3 py-2'><ZoneBadge zone={c.zoneType} /></td>
              <td className='px-3 py-2'><AutoBadge level={c.automation} /></td>
              <td className='px-3 py-2 text-right text-xs text-zinc-300'>{c.sqft.toLocaleString()}</td>
              <td className='px-3 py-2 text-right text-xs font-medium'>{c.ordersPerHr}</td>
              <td className='px-3 py-2 w-24'><UtilBar value={c.utilization} /><span className='text-[10px] text-zinc-500 ml-1'>{c.utilization}%</span></td>
              <td className='px-3 py-2 w-24'><ThroughputBar value={c.throughput} max={1500} /><span className='text-[10px] text-zinc-500 ml-1'>{c.throughput}</span></td>
              <td className='px-3 py-2'><StatusBadge status={c.status} /></td>
            </tr>
          ))}
          </tbody></table></div></CardContent></Card>
        </TabsContent>

        <TabsContent value='analytics' className='mfc-tab-content space-y-4 mt-4'>
          <div className='mfc-value-row grid grid-cols-2 lg:grid-cols-4 gap-3'>
            <ValueTile label='Total Sqft' value='685K' change='+15% YoY' />
            <ValueTile label='Avg Fulfill Time' value='22.4 min' change='-3.1 min' />
            <ValueTile label='Workers Deployed' value='1,240' change='+85 QoQ' />
            <ValueTile label='Automation Rate' value='38%' change='+7pp YoY' />
          </div>
          <div className='mfc-analytics-charts grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <Card className='mfc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>City Throughput</CardTitle></CardHeader><CardContent><BarChart data={[{ name: 'Mumbai', throughput: 1084, orders: 1488 }, { name: 'Delhi NCR', throughput: 1206, orders: 856 }, { name: 'Bangalore', throughput: 1904, orders: 851 }, { name: 'Hyderabad', throughput: 1994, orders: 1273 }, { name: 'Chennai', throughput: 962, orders: 1302 }, { name: 'Pune', throughput: 1114, orders: 937 }, { name: 'Kolkata', throughput: 1065, orders: 1177 }, { name: 'Ahmedabad', throughput: 2360, orders: 748 }]} width={450} height={220}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='name' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Bar dataKey='throughput' fill='#06b6d4' radius={[4,4,0,0]}/><Bar dataKey='orders' fill='#3b82f6' radius={[4,4,0,0]}/></BarChart></CardContent></Card>
            <Card className='mfc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Automation Level Mix</CardTitle></CardHeader><CardContent><PieChart width={450} height={220}><Pie data={[{ name: 'Full Auto', value: 15 }, { name: 'Semi-Auto', value: 22 }, { name: 'Robot-Assisted', value: 10 }, { name: 'Manual', value: 8 }]} cx='50%' cy='50%' outerRadius={80} innerRadius={40} dataKey='value' paddingAngle={3}>{[<Cell key={0} fill='#8b5cf6' />, <Cell key={1} fill='#3b82f6' />, <Cell key={2} fill='#06b6d4' />, <Cell key={3} fill='#6b7280' />]}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value='insights' className='mfc-tab-content space-y-4 mt-4'>
          {insights.map((ins, i) => (
            <Card key={i} className={'mfc-insight-card bg-zinc-900/60 border ' + (ins.severity === 'high' ? 'border-cyan-500/30' : ins.severity === 'medium' ? 'border-amber-500/30' : 'border-zinc-800')}><CardContent className='p-4'><div className='flex items-start gap-3'><div className={'mfc-insight-dot w-2 h-2 rounded-full mt-1.5 shrink-0 ' + (ins.severity === 'high' ? 'bg-cyan-500' : ins.severity === 'medium' ? 'bg-amber-500' : 'bg-zinc-500')} /><div><p className='text-sm font-medium text-zinc-200'>{ins.title}</p><p className='text-xs text-zinc-400 mt-1 leading-relaxed'>{ins.desc}</p></div></div></CardContent></Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
