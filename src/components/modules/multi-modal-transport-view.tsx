import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#14b8a6', '#6366f1', '#f59e0b', '#10b981', '#06b6d4', '#ec4899', '#ef4444', '#84cc16']

const MODES = ['Rail', 'Road-Rail', 'Sea-Rail', 'Air-Rail', 'Inland Water', 'Pipeline-Rail', 'Road-Sea', 'Air-Sea']
const CORRIDORS = ['Delhi-Mumbai Corridor', 'Chennai-Bangalore Link', 'Kolkata-Delhi Express', 'Mundra-Nhava Sheva', 'Hyderabad-Vizag Route', 'Pune-Goa Coastal', 'Cochin-Trivandrum Belt', 'Ahmedabad-Jaipur Line']
const PRIORITIES = ['Critical', 'High', 'Medium', 'Low']

const shipments = [
  { id: 'MMT-0001', mode: 'Rail', corridor: 'Delhi-Mumbai Corridor', priority: 'Critical', containers: 42, weight_tons: 1680, transit_hrs: 18.4, cost_inr: 420000, on_time_pct: 94.2, last_update: '2026-07-28 05:55' },
  { id: 'MMT-0002', mode: 'Road-Rail', corridor: 'Chennai-Bangalore Link', priority: 'High', containers: 28, weight_tons: 840, transit_hrs: 12.6, cost_inr: 312000, on_time_pct: 97.8, last_update: '2026-07-27 14:28' },
  { id: 'MMT-0003', mode: 'Sea-Rail', corridor: 'Kolkata-Delhi Express', priority: 'Medium', containers: 65, weight_tons: 3250, transit_hrs: 48.2, cost_inr: 785000, on_time_pct: 88.5, last_update: '2026-07-26 22:36' },
  { id: 'MMT-0004', mode: 'Air-Rail', corridor: 'Mundra-Nhava Sheva', priority: 'Low', containers: 12, weight_tons: 180, transit_hrs: 6.8, cost_inr: 1250000, on_time_pct: 99.1, last_update: '2026-07-25 11:25' },
  { id: 'MMT-0005', mode: 'Inland Water', corridor: 'Hyderabad-Vizag Route', priority: 'Critical', containers: 55, weight_tons: 2200, transit_hrs: 72.4, cost_inr: 340000, on_time_pct: 76.3, last_update: '2026-07-28 15:05' },
  { id: 'MMT-0006', mode: 'Pipeline-Rail', corridor: 'Pune-Goa Coastal', priority: 'High', containers: 8, weight_tons: 4200, transit_hrs: 36.1, cost_inr: 198000, on_time_pct: 91.7, last_update: '2026-07-26 12:07' },
  { id: 'MMT-0007', mode: 'Road-Sea', corridor: 'Cochin-Trivandrum Belt', priority: 'Medium', containers: 38, weight_tons: 1140, transit_hrs: 24.8, cost_inr: 567000, on_time_pct: 93.4, last_update: '2026-07-24 08:14' },
  { id: 'MMT-0008', mode: 'Air-Sea', corridor: 'Ahmedabad-Jaipur Line', priority: 'Low', containers: 15, weight_tons: 225, transit_hrs: 8.2, cost_inr: 1480000, on_time_pct: 98.6, last_update: '2026-07-22 02:25' },
  { id: 'MMT-0009', mode: 'Rail', corridor: 'Delhi-Mumbai Corridor', priority: 'High', containers: 50, weight_tons: 2000, transit_hrs: 16.5, cost_inr: 465000, on_time_pct: 95.8, last_update: '2026-07-28 09:41' },
  { id: 'MMT-0010', mode: 'Sea-Rail', corridor: 'Chennai-Bangalore Link', priority: 'Critical', containers: 72, weight_tons: 3600, transit_hrs: 52.7, cost_inr: 890000, on_time_pct: 82.1, last_update: '2026-07-27 21:02' },
  { id: 'MMT-0011', mode: 'Road-Rail', corridor: 'Kolkata-Delhi Express', priority: 'Medium', containers: 34, weight_tons: 1020, transit_hrs: 14.3, cost_inr: 385000, on_time_pct: 96.2, last_update: '2026-07-26 16:37' },
  { id: 'MMT-0012', mode: 'Inland Water', corridor: 'Mundra-Nhava Sheva', priority: 'High', containers: 48, weight_tons: 1920, transit_hrs: 68.5, cost_inr: 310000, on_time_pct: 79.8, last_update: '2026-07-25 17:43' },
  { id: 'MMT-0013', mode: 'Air-Rail', corridor: 'Hyderabad-Vizag Route', priority: 'Low', containers: 18, weight_tons: 270, transit_hrs: 5.4, cost_inr: 1120000, on_time_pct: 99.5, last_update: '2026-07-28 03:07' },
  { id: 'MMT-0014', mode: 'Pipeline-Rail', corridor: 'Pune-Goa Coastal', priority: 'Critical', containers: 6, weight_tons: 3800, transit_hrs: 42.3, cost_inr: 225000, on_time_pct: 85.4, last_update: '2026-07-24 20:18' },
  { id: 'MMT-0015', mode: 'Rail', corridor: 'Cochin-Trivandrum Belt', priority: 'Medium', containers: 40, weight_tons: 1600, transit_hrs: 20.6, cost_inr: 498000, on_time_pct: 92.7, last_update: '2026-07-28 11:20' },
  { id: 'MMT-0016', mode: 'Road-Sea', corridor: 'Ahmedabad-Jaipur Line', priority: 'High', containers: 30, weight_tons: 900, transit_hrs: 28.4, cost_inr: 545000, on_time_pct: 90.1, last_update: '2026-07-26 06:44' },
  { id: 'MMT-0017', mode: 'Sea-Rail', corridor: 'Delhi-Mumbai Corridor', priority: 'Low', containers: 58, weight_tons: 2900, transit_hrs: 44.8, cost_inr: 720000, on_time_pct: 87.3, last_update: '2026-07-25 22:55' },
  { id: 'MMT-0018', mode: 'Air-Sea', corridor: 'Chennai-Bangalore Link', priority: 'Critical', containers: 10, weight_tons: 150, transit_hrs: 4.2, cost_inr: 1650000, on_time_pct: 99.8, last_update: '2026-07-27 14:34' },
  { id: 'MMT-0019', mode: 'Road-Rail', corridor: 'Kolkata-Delhi Express', priority: 'Medium', containers: 36, weight_tons: 1080, transit_hrs: 15.8, cost_inr: 402000, on_time_pct: 94.5, last_update: '2026-07-28 07:59' },
  { id: 'MMT-0020', mode: 'Inland Water', corridor: 'Mundra-Nhava Sheva', priority: 'High', containers: 52, weight_tons: 2080, transit_hrs: 65.2, cost_inr: 295000, on_time_pct: 78.4, last_update: '2026-07-26 10:18' },
  { id: 'MMT-0021', mode: 'Rail', corridor: 'Hyderabad-Vizag Route', priority: 'Critical', containers: 44, weight_tons: 1760, transit_hrs: 19.7, cost_inr: 445000, on_time_pct: 93.9, last_update: '2026-07-28 16:24' },
  { id: 'MMT-0022', mode: 'Sea-Rail', corridor: 'Pune-Goa Coastal', priority: 'Low', containers: 62, weight_tons: 3100, transit_hrs: 50.5, cost_inr: 810000, on_time_pct: 86.7, last_update: '2026-07-25 08:55' },
  { id: 'MMT-0023', mode: 'Air-Rail', corridor: 'Cochin-Trivandrum Belt', priority: 'Medium', containers: 14, weight_tons: 210, transit_hrs: 7.1, cost_inr: 1320000, on_time_pct: 98.2, last_update: '2026-07-27 12:51' },
  { id: 'MMT-0024', mode: 'Pipeline-Rail', corridor: 'Ahmedabad-Jaipur Line', priority: 'High', containers: 4, weight_tons: 4500, transit_hrs: 38.9, cost_inr: 210000, on_time_pct: 88.2, last_update: '2026-07-24 17:51' },
  { id: 'MMT-0025', mode: 'Road-Sea', corridor: 'Delhi-Mumbai Corridor', priority: 'Critical', containers: 45, weight_tons: 1350, transit_hrs: 22.3, cost_inr: 520000, on_time_pct: 91.4, last_update: '2026-07-28 03:48' },
  { id: 'MMT-0026', mode: 'Rail', corridor: 'Chennai-Bangalore Link', priority: 'Medium', containers: 38, weight_tons: 1520, transit_hrs: 17.2, cost_inr: 478000, on_time_pct: 95.3, last_update: '2026-07-26 21:06' },
  { id: 'MMT-0027', mode: 'Sea-Rail', corridor: 'Kolkata-Delhi Express', priority: 'High', containers: 70, weight_tons: 3500, transit_hrs: 55.8, cost_inr: 865000, on_time_pct: 83.9, last_update: '2026-07-28 14:22' },
  { id: 'MMT-0028', mode: 'Air-Rail', corridor: 'Mundra-Nhava Sheva', priority: 'Low', containers: 20, weight_tons: 300, transit_hrs: 5.9, cost_inr: 1180000, on_time_pct: 99.3, last_update: '2026-07-25 09:33' },
  { id: 'MMT-0029', mode: 'Inland Water', corridor: 'Hyderabad-Vizag Route', priority: 'Critical', containers: 56, weight_tons: 2240, transit_hrs: 70.1, cost_inr: 325000, on_time_pct: 75.8, last_update: '2026-07-27 05:58' },
  { id: 'MMT-0030', mode: 'Road-Rail', corridor: 'Pune-Goa Coastal', priority: 'Medium', containers: 32, weight_tons: 960, transit_hrs: 13.4, cost_inr: 356000, on_time_pct: 96.8, last_update: '2026-07-28 09:33' },
  { id: 'MMT-0031', mode: 'Rail', corridor: 'Cochin-Trivandrum Belt', priority: 'High', containers: 46, weight_tons: 1840, transit_hrs: 21.8, cost_inr: 510000, on_time_pct: 92.5, last_update: '2026-07-26 11:07' },
  { id: 'MMT-0032', mode: 'Sea-Rail', corridor: 'Ahmedabad-Jaipur Line', priority: 'Low', containers: 60, weight_tons: 3000, transit_hrs: 46.4, cost_inr: 795000, on_time_pct: 87.8, last_update: '2026-07-25 22:15' },
  { id: 'MMT-0033', mode: 'Air-Sea', corridor: 'Delhi-Mumbai Corridor', priority: 'Critical', containers: 11, weight_tons: 165, transit_hrs: 3.8, cost_inr: 1720000, on_time_pct: 99.7, last_update: '2026-07-28 17:33' },
  { id: 'MMT-0034', mode: 'Pipeline-Rail', corridor: 'Chennai-Bangalore Link', priority: 'Medium', containers: 5, weight_tons: 4100, transit_hrs: 40.7, cost_inr: 205000, on_time_pct: 86.9, last_update: '2026-07-26 04:28' },
  { id: 'MMT-0035', mode: 'Road-Sea', corridor: 'Kolkata-Delhi Express', priority: 'High', containers: 33, weight_tons: 990, transit_hrs: 26.5, cost_inr: 538000, on_time_pct: 89.6, last_update: '2026-07-28 07:59' },
  { id: 'MMT-0036', mode: 'Inland Water', corridor: 'Mundra-Nhava Sheva', priority: 'Low', containers: 50, weight_tons: 2000, transit_hrs: 62.8, cost_inr: 305000, on_time_pct: 80.2, last_update: '2026-07-27 15:24' },
  { id: 'MMT-0037', mode: 'Rail', corridor: 'Hyderabad-Vizag Route', priority: 'Medium', containers: 41, weight_tons: 1640, transit_hrs: 18.9, cost_inr: 462000, on_time_pct: 94.8, last_update: '2026-07-28 01:58' },
  { id: 'MMT-0038', mode: 'Sea-Rail', corridor: 'Pune-Goa Coastal', priority: 'Critical', containers: 68, weight_tons: 3400, transit_hrs: 54.1, cost_inr: 880000, on_time_pct: 81.5, last_update: '2026-07-26 19:48' },
  { id: 'MMT-0039', mode: 'Air-Rail', corridor: 'Cochin-Trivandrum Belt', priority: 'High', containers: 16, weight_tons: 240, transit_hrs: 6.3, cost_inr: 1280000, on_time_pct: 98.9, last_update: '2026-07-28 10:06' },
  { id: 'MMT-0040', mode: 'Road-Rail', corridor: 'Ahmedabad-Jaipur Line', priority: 'Medium', containers: 26, weight_tons: 780, transit_hrs: 11.7, cost_inr: 298000, on_time_pct: 97.2, last_update: '2026-07-25 16:05' },
  { id: 'MMT-0041', mode: 'Rail', corridor: 'Delhi-Mumbai Corridor', priority: 'Low', containers: 47, weight_tons: 1880, transit_hrs: 20.2, cost_inr: 490000, on_time_pct: 93.6, last_update: '2026-07-28 06:19' },
  { id: 'MMT-0042', mode: 'Sea-Rail', corridor: 'Chennai-Bangalore Link', priority: 'High', containers: 64, weight_tons: 3200, transit_hrs: 49.3, cost_inr: 845000, on_time_pct: 85.8, last_update: '2026-07-26 08:27' },
  { id: 'MMT-0043', mode: 'Inland Water', corridor: 'Kolkata-Delhi Express', priority: 'Critical', containers: 54, weight_tons: 2160, transit_hrs: 69.7, cost_inr: 335000, on_time_pct: 77.1, last_update: '2026-07-28 12:51' },
  { id: 'MMT-0044', mode: 'Air-Sea', corridor: 'Mundra-Nhava Sheva', priority: 'Medium', containers: 13, weight_tons: 195, transit_hrs: 4.8, cost_inr: 1420000, on_time_pct: 99.4, last_update: '2026-07-27 20:34' },
  { id: 'MMT-0045', mode: 'Pipeline-Rail', corridor: 'Hyderabad-Vizag Route', priority: 'High', containers: 7, weight_tons: 3900, transit_hrs: 35.6, cost_inr: 218000, on_time_pct: 87.5, last_update: '2026-07-25 14:33' },
  { id: 'MMT-0046', mode: 'Road-Sea', corridor: 'Pune-Goa Coastal', priority: 'Low', containers: 35, weight_tons: 1050, transit_hrs: 27.2, cost_inr: 558000, on_time_pct: 90.8, last_update: '2026-07-28 01:24' },
  { id: 'MMT-0047', mode: 'Rail', corridor: 'Cochin-Trivandrum Belt', priority: 'Medium', containers: 43, weight_tons: 1720, transit_hrs: 19.4, cost_inr: 475000, on_time_pct: 94.1, last_update: '2026-07-26 14:33' },
  { id: 'MMT-0048', mode: 'Sea-Rail', corridor: 'Ahmedabad-Jaipur Line', priority: 'Critical', containers: 66, weight_tons: 3300, transit_hrs: 51.9, cost_inr: 870000, on_time_pct: 82.6, last_update: '2026-07-28 08:14' },
  { id: 'MMT-0049', mode: 'Air-Rail', corridor: 'Delhi-Mumbai Corridor', priority: 'High', containers: 19, weight_tons: 285, transit_hrs: 7.5, cost_inr: 1350000, on_time_pct: 98.4, last_update: '2026-07-27 20:08' },
  { id: 'MMT-0050', mode: 'Inland Water', corridor: 'Chennai-Bangalore Link', priority: 'Low', containers: 58, weight_tons: 2320, transit_hrs: 66.3, cost_inr: 315000, on_time_pct: 79.5, last_update: '2026-07-25 18:41' },
  { id: 'MMT-0051', mode: 'Road-Rail', corridor: 'Kolkata-Delhi Express', priority: 'Critical', containers: 31, weight_tons: 930, transit_hrs: 13.8, cost_inr: 345000, on_time_pct: 95.9, last_update: '2026-07-28 11:46' },
  { id: 'MMT-0052', mode: 'Rail', corridor: 'Mundra-Nhava Sheva', priority: 'Medium', containers: 49, weight_tons: 1960, transit_hrs: 17.8, cost_inr: 455000, on_time_pct: 94.4, last_update: '2026-07-26 07:22' },
  { id: 'MMT-0053', mode: 'Sea-Rail', corridor: 'Hyderabad-Vizag Route', priority: 'High', containers: 74, weight_tons: 3700, transit_hrs: 56.4, cost_inr: 910000, on_time_pct: 84.2, last_update: '2026-07-28 15:39' },
  { id: 'MMT-0054', mode: 'Air-Sea', corridor: 'Pune-Goa Coastal', priority: 'Low', containers: 17, weight_tons: 255, transit_hrs: 5.6, cost_inr: 1260000, on_time_pct: 99.2, last_update: '2026-07-27 13:55' },
  { id: 'MMT-0055', mode: 'Pipeline-Rail', corridor: 'Cochin-Trivandrum Belt', priority: 'Medium', containers: 3, weight_tons: 4600, transit_hrs: 44.1, cost_inr: 235000, on_time_pct: 86.1, last_update: '2026-07-26 17:33' },
  { id: 'MMT-0056', mode: 'Road-Sea', corridor: 'Ahmedabad-Jaipur Line', priority: 'Critical', containers: 37, weight_tons: 1110, transit_hrs: 25.1, cost_inr: 528000, on_time_pct: 89.2, last_update: '2026-07-28 02:48' },
  { id: 'MMT-0057', mode: 'Inland Water', corridor: 'Delhi-Mumbai Corridor', priority: 'High', containers: 53, weight_tons: 2120, transit_hrs: 71.8, cost_inr: 330000, on_time_pct: 76.9, last_update: '2026-07-25 21:22' },
  { id: 'MMT-0058', mode: 'Rail', corridor: 'Chennai-Bangalore Link', priority: 'Low', containers: 39, weight_tons: 1560, transit_hrs: 18.1, cost_inr: 468000, on_time_pct: 95.6, last_update: '2026-07-28 16:05' },
  { id: 'MMT-0059', mode: 'Sea-Rail', corridor: 'Kolkata-Delhi Express', priority: 'Medium', containers: 69, weight_tons: 3450, transit_hrs: 53.5, cost_inr: 855000, on_time_pct: 83.4, last_update: '2026-07-26 20:05' },
  { id: 'MMT-0060', mode: 'Air-Sea', corridor: 'Mundra-Nhava Sheva', priority: 'High', containers: 22, weight_tons: 330, transit_hrs: 6.1, cost_inr: 1380000, on_time_pct: 98.7, last_update: '2026-07-28 12:22' },
]

const hourlyData = [
  { hour: '00:00', rail: 85, road: 42, sea: 28, air: 8 },
  { hour: '01:00', rail: 62, road: 31, sea: 35, air: 5 },
  { hour: '02:00', rail: 95, road: 48, sea: 22, air: 12 },
  { hour: '03:00', rail: 78, road: 39, sea: 40, air: 6 },
  { hour: '04:00', rail: 110, road: 55, sea: 30, air: 15 },
  { hour: '05:00', rail: 45, road: 22, sea: 18, air: 3 },
  { hour: '06:00', rail: 125, road: 62, sea: 45, air: 18 },
  { hour: '07:00', rail: 98, road: 49, sea: 32, air: 10 },
  { hour: '08:00', rail: 72, road: 36, sea: 25, air: 7 },
  { hour: '09:00', rail: 115, road: 57, sea: 42, air: 14 },
  { hour: '10:00', rail: 88, road: 44, sea: 28, air: 9 },
  { hour: '11:00', rail: 130, road: 65, sea: 48, air: 20 },
  { hour: '12:00', rail: 68, road: 34, sea: 20, air: 5 },
  { hour: '13:00', rail: 55, road: 27, sea: 15, air: 4 },
  { hour: '14:00', rail: 105, road: 52, sea: 38, air: 16 },
  { hour: '15:00', rail: 120, road: 60, sea: 44, air: 19 },
  { hour: '16:00', rail: 82, road: 41, sea: 26, air: 8 },
  { hour: '17:00', rail: 95, road: 47, sea: 35, air: 11 },
  { hour: '18:00', rail: 112, road: 56, sea: 40, air: 15 },
  { hour: '19:00', rail: 75, road: 37, sea: 22, air: 6 },
  { hour: '20:00', rail: 108, road: 54, sea: 38, air: 13 },
  { hour: '21:00', rail: 92, road: 46, sea: 30, air: 10 },
  { hour: '22:00', rail: 85, road: 42, sea: 25, air: 7 },
  { hour: '23:00', rail: 70, road: 35, sea: 20, air: 5 },
]

const modeDist = [
  { name: 'Rail', value: 312 },
  { name: 'Road-Rail', value: 187 },
  { name: 'Sea-Rail', value: 245 },
  { name: 'Air-Rail', value: 98 },
  { name: 'Inland Water', value: 134 },
  { name: 'Pipeline-Rail', value: 56 },
  { name: 'Road-Sea', value: 112 },
  { name: 'Air-Sea', value: 68 },
]

const filterGroups = [
  { key: 'mode', label: 'Mode', options: MODES.map(m => ({ value: m, label: m, count: 0 })) },
  { key: 'corridor', label: 'Corridor', options: CORRIDORS.map(c => ({ value: c, label: c, count: 0 })) },
  { key: 'priority', label: 'Priority', options: PRIORITIES.map(p => ({ value: p, label: p, count: 0 })) },
]

function ModeBadge({ mode }: { mode: string }) {
  const color = mode === 'Rail' ? 'bg-teal-500/15 text-teal-400' : mode === 'Road-Rail' ? 'bg-indigo-500/15 text-indigo-400' : mode === 'Sea-Rail' ? 'bg-blue-500/15 text-blue-400' : mode === 'Air-Rail' ? 'bg-amber-500/15 text-amber-400' : mode === 'Inland Water' ? 'bg-cyan-500/15 text-cyan-400' : mode === 'Pipeline-Rail' ? 'bg-emerald-500/15 text-emerald-400' : mode === 'Road-Sea' ? 'bg-violet-500/15 text-violet-400' : 'bg-pink-500/15 text-pink-400'
  return <span className={'mmt-mode-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{mode}</span>
}

function PriorityBadge({ priority }: { priority: string }) {
  const color = priority === 'Critical' ? 'bg-red-500/15 text-red-400' : priority === 'High' ? 'bg-orange-500/15 text-orange-400' : priority === 'Medium' ? 'bg-amber-500/15 text-amber-400' : 'bg-blue-500/15 text-blue-400'
  return <span className={'mmt-priority-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{priority}</span>
}

function ContainerBar({ value, max }: { value: number; max: number }) {
  const w = Math.min((value / max) * 100, 100)
  const color = w >= 80 ? 'bg-teal-500' : w >= 50 ? 'bg-indigo-500' : 'bg-amber-500'
  return <div className='mmt-container-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className={'h-full rounded-full mmt-container-fill ' + color} style={{ width: w + '%', animation: 'mmt-grow 1s ease-out' }}/></div>
}

function OnTimeBar({ value }: { value: number }) {
  const color = value >= 95 ? 'bg-emerald-500' : value >= 85 ? 'bg-amber-500' : 'bg-red-500'
  return <div className='mmt-ontime-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className={'h-full rounded-full mmt-ontime-fill ' + color} style={{ width: value + '%', animation: 'mmt-grow 1s ease-out' }}/></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, c = 2 * Math.PI * r, offset = c - (value / 100) * c
  return <div className='mmt-ring flex flex-col items-center'><svg width='70' height='70' className='-rotate-90'><circle cx='35' cy='35' r={r} fill='none' stroke='#27272a' strokeWidth='5'/><circle cx='35' cy='35' r={r} fill='none' stroke={color} strokeWidth='5' strokeDasharray={c} strokeDashoffset={offset} strokeLinecap='round' className='mmt-ring-path' style={{ transition: 'stroke-dashoffset 1s ease' }}/></svg><span className='mmt-ring-val text-sm font-bold mt-1' style={{ color }}>{value}%</span><span className='mmt-ring-label text-[10px] text-zinc-500'>{label}</span></div>
}

function KpiTile({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return <div className='mmt-kpi bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 mmt-kpi-card'><p className='text-xs text-zinc-500 mb-1'>{label}</p><p className={'text-xl font-bold ' + color}>{value}</p><p className='text-[10px] text-zinc-400 mt-1'>{sub}</p></div>
}

function ValueTile({ label, value, change }: { label: string; value: string; change: string }) {
  const up = change.startsWith('+')
  return <div className='mmt-value-tile bg-zinc-900/60 border border-zinc-800 rounded-lg p-3'><p className='text-xs text-zinc-500'>{label}</p><p className='text-lg font-bold text-white mt-1'>{value}</p><p className={'text-xs mt-1 ' + (up ? 'text-emerald-400' : 'text-red-400')}>{change}</p></div>
}

const insights = [
  { title: 'Dedicated Freight Corridor Phase 2 Expansion', desc: 'Western DFC Phase 2 from Jawaharlal Nehru Port to Dadri achieved 98% rail utilization. Container transit time reduced from 42 to 18 hours for Mumbai-Delhi route. Daily throughput increased from 240 to 420 TEU. Eastern DFC Phase 1 from Ludhiana to Dankuni on track for December 2026 commissioning with 320 TEU daily capacity.', severity: 'high' },
  { title: 'Inland Water Transport Ro-Ro Service Launch', desc: 'NWAI launched Roll-on/Roll-off service on National Waterway 1 (Ganga-Bhagirathi-Hooghly) connecting Kolkata to Varanasi. Service carries 48 trucks per trip, reducing road congestion by 12% on NH-2 corridor. Transit time 4.5 days vs 2 days by road but at 40% lower cost. Monthly savings: INR 8.4 Cr in logistics cost for eastern region shippers.', severity: 'medium' },
  { title: 'Kolkata Port Transshipment Hub Upgrade', desc: 'Syama Prasad Mookerjee Port upgraded transshipment capacity with 2 new gantry cranes (60 TPH each). Vessel turnaround time improved from 4.2 to 2.8 days. Direct shipping connections to 8 new ports including Colombo, Singapore, and Jebel Ali. Annual container handling capacity increased from 1.2M to 1.8M TEU. Eastern India exporters save INR 14,000 per TEU on average.', severity: 'low' },
  { title: 'AI-Driven Intermodal Route Optimization v4', desc: 'Enhanced intermodal routing AI now integrates real-time monsoon forecasts, port congestion levels, and rail slot availability. Route recommendation accuracy improved from 84% to 93%. Average cost reduction of 8.2% per shipment. Rail-sea combination routes now identified 40% faster. Integration with Indian Railways FOIS system provides live wagon tracking across 6,800+ stations.', severity: 'high' },
]

export default function MultiModalTransportView() {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [tab, setTab] = useState('dashboard')

  const toggleFilter = (key: string, val: string) => {
    setActiveFilters(prev => { const cur = prev[key] || []; const next = cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val]; return { ...prev, [key]: next } })
  }

  const filtered = shipments.filter(s => {
    for (const [key, vals] of Object.entries(activeFilters)) { if (vals.length > 0 && !vals.includes(s[key as keyof typeof s] as string)) return false }
    if (searchQuery && !Object.values(s).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))) return false
    return true
  })

  return (
    <div className='mmt-root space-y-4 p-4'>
      <PageHeader title='Multi-Modal Transport Hub' description='Intermodal freight coordination across rail, road, sea & air corridors' />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className='mmt-tabs-list bg-zinc-900 border border-zinc-800'>
          <TabsTrigger value='dashboard' className='mmt-tab'>Dashboard</TabsTrigger>
          <TabsTrigger value='shipments' className='mmt-tab'>Shipments</TabsTrigger>
          <TabsTrigger value='analytics' className='mmt-tab'>Analytics</TabsTrigger>
          <TabsTrigger value='insights' className='mmt-tab'>Insights</TabsTrigger>
        </TabsList>
        <TabsContent value='dashboard' className='mmt-tab-content space-y-4 mt-4'>
          <div className='mmt-kpi-row grid grid-cols-2 lg:grid-cols-4 gap-3'>
            <KpiTile label='Active Corridors' value='847' sub='+3 new routes' color='text-teal-400' />
            <KpiTile label='Avg Transit' value='28.4 hrs' sub='-4.2 hrs improved' color='text-indigo-400' />
            <KpiTile label='On-Time Rate' value='92.1%' sub='+1.8pp vs last month' color='text-emerald-400' />
            <KpiTile label='Cost per TEU' value='INR 18.4K' sub='-INR 2.1K optimized' color='text-amber-400' />
          </div>
          <div className='mmt-ring-row flex flex-wrap justify-around gap-2'>
            <HealthRing value={94} label='Rail Util' color='#14b8a6' />
            <HealthRing value={87} label='Sea Connect' color='#6366f1' />
            <HealthRing value={78} label='Road Link' color='#f59e0b' />
            <HealthRing value={96} label='Air Cargo' color='#10b981' />
            <HealthRing value={82} label='Waterway' color='#06b6d4' />
            <HealthRing value={91} label='Pipeline' color='#ec4899' />
          </div>
          <div className='mmt-chart-row grid grid-cols-1 lg:grid-cols-3 gap-4'>
            <Card className='mmt-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>24hr Mode Throughput</CardTitle></CardHeader><CardContent><LineChart data={hourlyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='hour' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Line type='monotone' dataKey='rail' stroke='#14b8a6' strokeWidth={2} dot={false}/><Line type='monotone' dataKey='road' stroke='#6366f1' strokeWidth={2} dot={false}/><Line type='monotone' dataKey='sea' stroke='#06b6d4' strokeWidth={2} dot={false}/></LineChart></CardContent></Card>
            <Card className='mmt-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Hourly Air Shipments</CardTitle></CardHeader><CardContent><BarChart data={hourlyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='hour' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Bar dataKey='air' fill='#f59e0b' radius={[4,4,0,0]}/></BarChart></CardContent></Card>
            <Card className='mmt-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Transport Mode Mix</CardTitle></CardHeader><CardContent><PieChart width={350} height={200}><Pie data={modeDist} cx='50%' cy='50%' outerRadius={70} innerRadius={35} dataKey='value' paddingAngle={2}>{modeDist.map((_, i) => <Cell key={i} fill={COLORS[i % 8]} />)}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value='shipments' className='mmt-tab-content space-y-4 mt-4'>
          <ModuleBreadcrumb items={[{ label: 'Multi-Modal Hub' }, { label: 'Shipments' }]} />
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => { setActiveFilters({}); setSearchQuery('') }} totalItems={shipments.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder='Search shipments by ID, mode, corridor...' />
          <Card className='mmt-table-card bg-zinc-900/60 border-zinc-800'><CardContent className='p-0'><div className='mmt-table-wrap overflow-x-auto max-h-[400px] overflow-y-auto'><table className='mmt-table w-full text-sm'><thead><tr className='border-b border-zinc-800'><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>ID</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Mode</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Corridor</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Priority</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Containers</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>On-Time</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Transit</th><th className='text-right px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Weight(T)</th><th className='text-right px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Cost(INR)</th></tr></thead><tbody>
          {filtered.map(s => (
            <tr key={s.id} className='mmt-table-row border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors'>
              <td className='px-3 py-2 font-mono text-xs text-teal-400'>{s.id}</td>
              <td className='px-3 py-2'><ModeBadge mode={s.mode} /></td>
              <td className='px-3 py-2 text-xs text-zinc-300 max-w-[160px] truncate'>{s.corridor}</td>
              <td className='px-3 py-2'><PriorityBadge priority={s.priority} /></td>
              <td className='px-3 py-2 w-20'><ContainerBar value={s.containers} max={74} /><span className='text-[10px] text-zinc-500 ml-1'>{s.containers}</span></td>
              <td className='px-3 py-2 w-20'><OnTimeBar value={s.on_time_pct} /><span className='text-[10px] text-zinc-500 ml-1'>{s.on_time_pct}%</span></td>
              <td className='px-3 py-2 text-xs text-zinc-400'>{s.transit_hrs}h</td>
              <td className='px-3 py-2 text-right text-xs'>{s.weight_tons}</td>
              <td className='px-3 py-2 text-right text-xs'>{(s.cost_inr / 1000).toFixed(0)}K</td>
            </tr>
          ))})
          </tbody></table></div></CardContent></Card>
        </TabsContent>
        <TabsContent value='analytics' className='mmt-tab-content space-y-4 mt-4'>
          <div className='mmt-value-row grid grid-cols-2 lg:grid-cols-4 gap-3'>
            <ValueTile label='Total TEU Handled (MTD)' value='24,580' change='+18% YoY' />
            <ValueTile label='Intermodal Savings' value='INR 14.2 Cr' change='+22% vs road-only' />
            <ValueTile label='Avg Dwell Time' value='4.2 hrs' change='-1.8 hrs' />
            <ValueTile label='Equipment Utilization' value='89.4%' change='+3.2pp' />
          </div>
          <div className='mmt-analytics-charts grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <Card className='mmt-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Corridor Throughput</CardTitle></CardHeader><CardContent><BarChart data={CORRIDORS.map((c,i) => ({ name: c.split('-')[0].substring(0,6), throughput: [320,280,245,190,210,175,160,195][i], ontime: [94,97,88,92,91,93,95,90][i] }))} width={450} height={220}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='name' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Bar dataKey='throughput' fill='#14b8a6' radius={[4,4,0,0]}/><Bar dataKey='ontime' fill='#6366f1' radius={[4,4,0,0]}/></BarChart></CardContent></Card>
            <Card className='mmt-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Priority Distribution</CardTitle></CardHeader><CardContent><PieChart width={450} height={220}><Pie data={[{ name: 'Critical', value: 28 }, { name: 'High', value: 32 }, { name: 'Medium', value: 24 }, { name: 'Low', value: 16 }]} cx='50%' cy='50%' outerRadius={80} innerRadius={40} dataKey='value' paddingAngle={3}>{[<Cell key={0} fill='#ef4444' />, <Cell key={1} fill='#f97316' />, <Cell key={2} fill='#f59e0b' />, <Cell key={3} fill='#6366f1' />]}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value='insights' className='mmt-tab-content space-y-4 mt-4'>
          {insights.map((ins, i) => (
            <Card key={i} className={'mmt-insight-card bg-zinc-900/60 border ' + (ins.severity === 'high' ? 'border-teal-500/30' : ins.severity === 'medium' ? 'border-indigo-500/30' : 'border-zinc-800')}><CardContent className='p-4'><div className='flex items-start gap-3'><div className={'mmt-insight-dot w-2 h-2 rounded-full mt-1.5 shrink-0 ' + (ins.severity === 'high' ? 'bg-teal-500' : ins.severity === 'medium' ? 'bg-indigo-500' : 'bg-zinc-500')} /><div><p className='text-sm font-medium text-zinc-200'>{ins.title}</p><p className='text-xs text-zinc-400 mt-1 leading-relaxed'>{ins.desc}</p></div></div></CardContent></Card>
          ))})
        </TabsContent>
      </Tabs>
    </div>
  )
}
