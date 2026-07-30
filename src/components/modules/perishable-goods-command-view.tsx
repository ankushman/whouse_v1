import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#f97316', '#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#ec4899', '#84cc16']

const COMMODITIES = ['Fresh Fruits', 'Leafy Vegetables', 'Dairy Products', 'Frozen Seafood', 'Fresh Meat', 'Bakery Items', 'Cut Flowers', 'Organic Produce']
const HUBS = ['Mumbai Cold Hub', 'Delhi NCR Cold Chain', 'Chennai Seafood Port', 'Bangalore Farm Gate', 'Hyderabad Agri Hub', 'Pune Dairy Center', 'Kolkata Flower Market', 'Ahmedabad Meat Plant']
const TEMP_ZONES = ['Ambient (15-25C)', 'Cool (2-8C)', 'Cold (-18 to -25C)', 'Frozen (-30C below)', 'Controlled RT (12-18C)', 'Warm (25-30C)']
const PRIORITIES = ['Critical', 'High', 'Medium', 'Low']

const goods = [
  { id: 'PGC-0001', commodity: 'Fresh Fruits', hub: 'Mumbai Cold Hub', tempZone: 'Ambient (15-25C)', priority: 'Critical', freshness_pct: 88.4, shelf_days: 4, spoilage_pct: 4.9, tonnage: 1570, temp_actual: 1.2, lastInspected: '2026-07-11 05:55' },
  { id: 'PGC-0002', commodity: 'Leafy Vegetables', hub: 'Delhi NCR Cold Chain', tempZone: 'Cool (2-8C)', priority: 'High', freshness_pct: 69.6, shelf_days: 21, spoilage_pct: 8.4, tonnage: 590, temp_actual: 5.3, lastInspected: '2026-07-12 14:28' },
  { id: 'PGC-0003', commodity: 'Dairy Products', hub: 'Chennai Seafood Port', tempZone: 'Cold (-18 to -25C)', priority: 'Medium', freshness_pct: 80.2, shelf_days: 14, spoilage_pct: 7.6, tonnage: 990, temp_actual: -21.7, lastInspected: '2026-07-21 22:36' },
  { id: 'PGC-0004', commodity: 'Frozen Seafood', hub: 'Bangalore Farm Gate', tempZone: 'Frozen (-30C below)', priority: 'Low', freshness_pct: 57.0, shelf_days: 12, spoilage_pct: 1.8, tonnage: 960, temp_actual: 17.3, lastInspected: '2026-07-22 11:25' },
  { id: 'PGC-0005', commodity: 'Fresh Meat', hub: 'Hyderabad Agri Hub', tempZone: 'Controlled RT (12-18C)', priority: 'Critical', freshness_pct: 88.9, shelf_days: 16, spoilage_pct: 7.6, tonnage: 1904, temp_actual: -22.8, lastInspected: '2026-07-28 15:05' },
  { id: 'PGC-0006', commodity: 'Bakery Items', hub: 'Pune Dairy Center', tempZone: 'Warm (25-30C)', priority: 'High', freshness_pct: 65.5, shelf_days: 14, spoilage_pct: 8.1, tonnage: 1769, temp_actual: -1.3, lastInspected: '2026-07-26 12:07' },
  { id: 'PGC-0007', commodity: 'Cut Flowers', hub: 'Kolkata Flower Market', tempZone: 'Ambient (15-25C)', priority: 'Medium', freshness_pct: 62.4, shelf_days: 11, spoilage_pct: 3.8, tonnage: 817, temp_actual: 16.8, lastInspected: '2026-07-08 07:01' },
  { id: 'PGC-0008', commodity: 'Organic Produce', hub: 'Ahmedabad Meat Plant', tempZone: 'Cool (2-8C)', priority: 'Low', freshness_pct: 59.2, shelf_days: 3, spoilage_pct: 6.8, tonnage: 1719, temp_actual: -4.0, lastInspected: '2026-07-22 08:14' },
  { id: 'PGC-0009', commodity: 'Fresh Fruits', hub: 'Mumbai Cold Hub', tempZone: 'Cold (-18 to -25C)', priority: 'Critical', freshness_pct: 55.7, shelf_days: 14, spoilage_pct: 1.1, tonnage: 1857, temp_actual: -20.6, lastInspected: '2026-07-21 02:25' },
  { id: 'PGC-0010', commodity: 'Leafy Vegetables', hub: 'Delhi NCR Cold Chain', tempZone: 'Frozen (-30C below)', priority: 'High', freshness_pct: 95.6, shelf_days: 20, spoilage_pct: 5.3, tonnage: 523, temp_actual: -15.2, lastInspected: '2026-07-12 11:21' },
  { id: 'PGC-0011', commodity: 'Dairy Products', hub: 'Chennai Seafood Port', tempZone: 'Controlled RT (12-18C)', priority: 'Medium', freshness_pct: 55.2, shelf_days: 19, spoilage_pct: 1.3, tonnage: 2164, temp_actual: -2.2, lastInspected: '2026-07-21 16:37' },
  { id: 'PGC-0012', commodity: 'Frozen Seafood', hub: 'Bangalore Farm Gate', tempZone: 'Warm (25-30C)', priority: 'Low', freshness_pct: 85.9, shelf_days: 13, spoilage_pct: 8.4, tonnage: 1286, temp_actual: 1.7, lastInspected: '2026-07-11 17:43' },
  { id: 'PGC-0013', commodity: 'Fresh Meat', hub: 'Hyderabad Agri Hub', tempZone: 'Ambient (15-25C)', priority: 'Critical', freshness_pct: 77.0, shelf_days: 19, spoilage_pct: 4.8, tonnage: 1020, temp_actual: 4.1, lastInspected: '2026-07-22 03:07' },
  { id: 'PGC-0014', commodity: 'Bakery Items', hub: 'Pune Dairy Center', tempZone: 'Cool (2-8C)', priority: 'High', freshness_pct: 85.4, shelf_days: 17, spoilage_pct: 2.5, tonnage: 1543, temp_actual: 17.9, lastInspected: '2026-07-01 15:20' },
  { id: 'PGC-0015', commodity: 'Cut Flowers', hub: 'Kolkata Flower Market', tempZone: 'Cold (-18 to -25C)', priority: 'Medium', freshness_pct: 55.2, shelf_days: 15, spoilage_pct: 6.3, tonnage: 773, temp_actual: 13.2, lastInspected: '2026-07-18 06:44' },
  { id: 'PGC-0016', commodity: 'Organic Produce', hub: 'Ahmedabad Meat Plant', tempZone: 'Frozen (-30C below)', priority: 'Low', freshness_pct: 97.1, shelf_days: 1, spoilage_pct: 0.7, tonnage: 436, temp_actual: -34.2, lastInspected: '2026-07-28 05:11' },
  { id: 'PGC-0017', commodity: 'Fresh Fruits', hub: 'Mumbai Cold Hub', tempZone: 'Controlled RT (12-18C)', priority: 'Critical', freshness_pct: 76.5, shelf_days: 17, spoilage_pct: 6.7, tonnage: 2202, temp_actual: -10.9, lastInspected: '2026-07-28 00:35' },
  { id: 'PGC-0018', commodity: 'Leafy Vegetables', hub: 'Delhi NCR Cold Chain', tempZone: 'Warm (25-30C)', priority: 'High', freshness_pct: 79.2, shelf_days: 16, spoilage_pct: 6.3, tonnage: 2042, temp_actual: 28.5, lastInspected: '2026-07-02 21:34' },
  { id: 'PGC-0019', commodity: 'Dairy Products', hub: 'Chennai Seafood Port', tempZone: 'Ambient (15-25C)', priority: 'Medium', freshness_pct: 63.1, shelf_days: 21, spoilage_pct: 3.3, tonnage: 1942, temp_actual: -14.5, lastInspected: '2026-07-02 07:54' },
  { id: 'PGC-0020', commodity: 'Frozen Seafood', hub: 'Bangalore Farm Gate', tempZone: 'Cool (2-8C)', priority: 'Low', freshness_pct: 60.3, shelf_days: 13, spoilage_pct: 6.3, tonnage: 1977, temp_actual: 29.3, lastInspected: '2026-07-26 16:24' },
  { id: 'PGC-0021', commodity: 'Fresh Meat', hub: 'Hyderabad Agri Hub', tempZone: 'Cold (-18 to -25C)', priority: 'Critical', freshness_pct: 80.4, shelf_days: 12, spoilage_pct: 0.9, tonnage: 2305, temp_actual: 2.4, lastInspected: '2026-07-03 11:10' },
  { id: 'PGC-0022', commodity: 'Bakery Items', hub: 'Pune Dairy Center', tempZone: 'Frozen (-30C below)', priority: 'High', freshness_pct: 76.1, shelf_days: 6, spoilage_pct: 7.0, tonnage: 2134, temp_actual: 6.9, lastInspected: '2026-07-20 10:22' },
  { id: 'PGC-0023', commodity: 'Cut Flowers', hub: 'Kolkata Flower Market', tempZone: 'Controlled RT (12-18C)', priority: 'Medium', freshness_pct: 67.9, shelf_days: 20, spoilage_pct: 3.0, tonnage: 2330, temp_actual: 13.9, lastInspected: '2026-07-23 13:49' },
  { id: 'PGC-0024', commodity: 'Organic Produce', hub: 'Ahmedabad Meat Plant', tempZone: 'Warm (25-30C)', priority: 'Low', freshness_pct: 95.3, shelf_days: 9, spoilage_pct: 4.6, tonnage: 1935, temp_actual: -2.2, lastInspected: '2026-07-12 04:55' },
  { id: 'PGC-0025', commodity: 'Fresh Fruits', hub: 'Mumbai Cold Hub', tempZone: 'Ambient (15-25C)', priority: 'Critical', freshness_pct: 71.4, shelf_days: 21, spoilage_pct: 5.6, tonnage: 1867, temp_actual: -9.0, lastInspected: '2026-07-05 09:31' },
  { id: 'PGC-0026', commodity: 'Leafy Vegetables', hub: 'Delhi NCR Cold Chain', tempZone: 'Cool (2-8C)', priority: 'High', freshness_pct: 96.5, shelf_days: 19, spoilage_pct: 6.4, tonnage: 943, temp_actual: 0.0, lastInspected: '2026-07-25 06:16' },
  { id: 'PGC-0027', commodity: 'Dairy Products', hub: 'Chennai Seafood Port', tempZone: 'Cold (-18 to -25C)', priority: 'Medium', freshness_pct: 95.2, shelf_days: 10, spoilage_pct: 7.5, tonnage: 100, temp_actual: -9.7, lastInspected: '2026-07-11 08:07' },
  { id: 'PGC-0028', commodity: 'Frozen Seafood', hub: 'Bangalore Farm Gate', tempZone: 'Frozen (-30C below)', priority: 'Low', freshness_pct: 75.5, shelf_days: 1, spoilage_pct: 2.3, tonnage: 1087, temp_actual: -14.1, lastInspected: '2026-07-15 14:37' },
  { id: 'PGC-0029', commodity: 'Fresh Meat', hub: 'Hyderabad Agri Hub', tempZone: 'Controlled RT (12-18C)', priority: 'Critical', freshness_pct: 77.2, shelf_days: 13, spoilage_pct: 6.6, tonnage: 704, temp_actual: 18.9, lastInspected: '2026-07-29 19:07' },
  { id: 'PGC-0030', commodity: 'Bakery Items', hub: 'Pune Dairy Center', tempZone: 'Warm (25-30C)', priority: 'High', freshness_pct: 64.4, shelf_days: 10, spoilage_pct: 6.9, tonnage: 979, temp_actual: -23.8, lastInspected: '2026-07-22 22:01' },
  { id: 'PGC-0031', commodity: 'Cut Flowers', hub: 'Kolkata Flower Market', tempZone: 'Ambient (15-25C)', priority: 'Medium', freshness_pct: 56.0, shelf_days: 18, spoilage_pct: 7.1, tonnage: 2064, temp_actual: -15.1, lastInspected: '2026-07-21 06:15' },
  { id: 'PGC-0032', commodity: 'Organic Produce', hub: 'Ahmedabad Meat Plant', tempZone: 'Cool (2-8C)', priority: 'Low', freshness_pct: 77.1, shelf_days: 17, spoilage_pct: 8.3, tonnage: 926, temp_actual: 14.8, lastInspected: '2026-07-08 07:46' },
  { id: 'PGC-0033', commodity: 'Fresh Fruits', hub: 'Mumbai Cold Hub', tempZone: 'Cold (-18 to -25C)', priority: 'Critical', freshness_pct: 72.4, shelf_days: 1, spoilage_pct: 3.8, tonnage: 1117, temp_actual: 7.9, lastInspected: '2026-07-04 21:43' },
  { id: 'PGC-0034', commodity: 'Leafy Vegetables', hub: 'Delhi NCR Cold Chain', tempZone: 'Frozen (-30C below)', priority: 'High', freshness_pct: 76.0, shelf_days: 6, spoilage_pct: 1.5, tonnage: 2475, temp_actual: -15.5, lastInspected: '2026-07-05 08:23' },
  { id: 'PGC-0035', commodity: 'Dairy Products', hub: 'Chennai Seafood Port', tempZone: 'Controlled RT (12-18C)', priority: 'Medium', freshness_pct: 81.7, shelf_days: 6, spoilage_pct: 1.6, tonnage: 2068, temp_actual: -24.8, lastInspected: '2026-07-25 03:02' },
  { id: 'PGC-0036', commodity: 'Frozen Seafood', hub: 'Bangalore Farm Gate', tempZone: 'Warm (25-30C)', priority: 'Low', freshness_pct: 66.9, shelf_days: 13, spoilage_pct: 6.7, tonnage: 1420, temp_actual: 11.0, lastInspected: '2026-07-11 13:16' },
  { id: 'PGC-0037', commodity: 'Fresh Meat', hub: 'Hyderabad Agri Hub', tempZone: 'Ambient (15-25C)', priority: 'Critical', freshness_pct: 56.0, shelf_days: 19, spoilage_pct: 2.3, tonnage: 2337, temp_actual: -0.5, lastInspected: '2026-07-03 17:48' },
  { id: 'PGC-0038', commodity: 'Bakery Items', hub: 'Pune Dairy Center', tempZone: 'Cool (2-8C)', priority: 'High', freshness_pct: 55.7, shelf_days: 16, spoilage_pct: 4.3, tonnage: 149, temp_actual: -0.1, lastInspected: '2026-07-25 18:50' },
  { id: 'PGC-0039', commodity: 'Cut Flowers', hub: 'Kolkata Flower Market', tempZone: 'Cold (-18 to -25C)', priority: 'Medium', freshness_pct: 80.0, shelf_days: 4, spoilage_pct: 2.9, tonnage: 1585, temp_actual: 29.4, lastInspected: '2026-07-02 13:50' },
  { id: 'PGC-0040', commodity: 'Organic Produce', hub: 'Ahmedabad Meat Plant', tempZone: 'Frozen (-30C below)', priority: 'Low', freshness_pct: 89.8, shelf_days: 15, spoilage_pct: 2.4, tonnage: 741, temp_actual: -26.1, lastInspected: '2026-07-14 19:52' },
  { id: 'PGC-0041', commodity: 'Fresh Fruits', hub: 'Mumbai Cold Hub', tempZone: 'Controlled RT (12-18C)', priority: 'Critical', freshness_pct: 88.6, shelf_days: 8, spoilage_pct: 0.4, tonnage: 2403, temp_actual: 12.3, lastInspected: '2026-07-05 08:15' },
  { id: 'PGC-0042', commodity: 'Leafy Vegetables', hub: 'Delhi NCR Cold Chain', tempZone: 'Warm (25-30C)', priority: 'High', freshness_pct: 88.1, shelf_days: 1, spoilage_pct: 3.7, tonnage: 412, temp_actual: -17.3, lastInspected: '2026-07-14 22:12' },
  { id: 'PGC-0043', commodity: 'Dairy Products', hub: 'Chennai Seafood Port', tempZone: 'Ambient (15-25C)', priority: 'Medium', freshness_pct: 84.4, shelf_days: 17, spoilage_pct: 8.0, tonnage: 506, temp_actual: 16.4, lastInspected: '2026-07-07 02:56' },
  { id: 'PGC-0044', commodity: 'Frozen Seafood', hub: 'Bangalore Farm Gate', tempZone: 'Cool (2-8C)', priority: 'Low', freshness_pct: 85.7, shelf_days: 21, spoilage_pct: 5.7, tonnage: 1355, temp_actual: -4.4, lastInspected: '2026-07-08 20:39' },
  { id: 'PGC-0045', commodity: 'Fresh Meat', hub: 'Hyderabad Agri Hub', tempZone: 'Cold (-18 to -25C)', priority: 'Critical', freshness_pct: 94.8, shelf_days: 7, spoilage_pct: 3.9, tonnage: 570, temp_actual: 12.8, lastInspected: '2026-07-23 16:55' },
  { id: 'PGC-0046', commodity: 'Bakery Items', hub: 'Pune Dairy Center', tempZone: 'Frozen (-30C below)', priority: 'High', freshness_pct: 70.6, shelf_days: 15, spoilage_pct: 3.0, tonnage: 665, temp_actual: 10.9, lastInspected: '2026-07-01 08:44' },
  { id: 'PGC-0047', commodity: 'Cut Flowers', hub: 'Kolkata Flower Market', tempZone: 'Controlled RT (12-18C)', priority: 'Medium', freshness_pct: 60.7, shelf_days: 5, spoilage_pct: 5.4, tonnage: 939, temp_actual: 29.2, lastInspected: '2026-07-25 16:04' },
  { id: 'PGC-0048', commodity: 'Organic Produce', hub: 'Ahmedabad Meat Plant', tempZone: 'Warm (25-30C)', priority: 'Low', freshness_pct: 73.0, shelf_days: 9, spoilage_pct: 4.5, tonnage: 2348, temp_actual: -18.8, lastInspected: '2026-07-17 17:49' },
  { id: 'PGC-0049', commodity: 'Fresh Fruits', hub: 'Mumbai Cold Hub', tempZone: 'Ambient (15-25C)', priority: 'Critical', freshness_pct: 56.0, shelf_days: 13, spoilage_pct: 4.1, tonnage: 2403, temp_actual: 25.5, lastInspected: '2026-07-06 20:01' },
  { id: 'PGC-0050', commodity: 'Leafy Vegetables', hub: 'Delhi NCR Cold Chain', tempZone: 'Cool (2-8C)', priority: 'High', freshness_pct: 76.3, shelf_days: 16, spoilage_pct: 7.7, tonnage: 2004, temp_actual: 13.6, lastInspected: '2026-07-08 11:26' },
  { id: 'PGC-0051', commodity: 'Dairy Products', hub: 'Chennai Seafood Port', tempZone: 'Cold (-18 to -25C)', priority: 'Medium', freshness_pct: 65.1, shelf_days: 6, spoilage_pct: 2.9, tonnage: 344, temp_actual: 11.6, lastInspected: '2026-07-11 05:33' },
  { id: 'PGC-0052', commodity: 'Frozen Seafood', hub: 'Bangalore Farm Gate', tempZone: 'Frozen (-30C below)', priority: 'Low', freshness_pct: 56.8, shelf_days: 8, spoilage_pct: 1.3, tonnage: 213, temp_actual: 17.6, lastInspected: '2026-07-06 09:01' },
  { id: 'PGC-0053', commodity: 'Fresh Meat', hub: 'Hyderabad Agri Hub', tempZone: 'Controlled RT (12-18C)', priority: 'Critical', freshness_pct: 83.4, shelf_days: 4, spoilage_pct: 3.5, tonnage: 80, temp_actual: -15.1, lastInspected: '2026-07-03 02:28' },
  { id: 'PGC-0054', commodity: 'Bakery Items', hub: 'Pune Dairy Center', tempZone: 'Warm (25-30C)', priority: 'High', freshness_pct: 60.0, shelf_days: 5, spoilage_pct: 7.7, tonnage: 570, temp_actual: 0.2, lastInspected: '2026-07-16 21:56' },
  { id: 'PGC-0055', commodity: 'Cut Flowers', hub: 'Kolkata Flower Market', tempZone: 'Ambient (15-25C)', priority: 'Medium', freshness_pct: 63.8, shelf_days: 15, spoilage_pct: 1.5, tonnage: 1194, temp_actual: -6.0, lastInspected: '2026-07-09 19:42' },
  { id: 'PGC-0056', commodity: 'Organic Produce', hub: 'Ahmedabad Meat Plant', tempZone: 'Cool (2-8C)', priority: 'Low', freshness_pct: 60.2, shelf_days: 5, spoilage_pct: 7.3, tonnage: 2262, temp_actual: 7.5, lastInspected: '2026-07-14 00:15' },
  { id: 'PGC-0057', commodity: 'Fresh Fruits', hub: 'Mumbai Cold Hub', tempZone: 'Cold (-18 to -25C)', priority: 'Critical', freshness_pct: 88.2, shelf_days: 5, spoilage_pct: 6.7, tonnage: 2405, temp_actual: 20.5, lastInspected: '2026-07-08 09:04' },
  { id: 'PGC-0058', commodity: 'Leafy Vegetables', hub: 'Delhi NCR Cold Chain', tempZone: 'Frozen (-30C below)', priority: 'High', freshness_pct: 73.1, shelf_days: 7, spoilage_pct: 6.0, tonnage: 339, temp_actual: -27.6, lastInspected: '2026-07-07 01:52' },
  { id: 'PGC-0059', commodity: 'Dairy Products', hub: 'Chennai Seafood Port', tempZone: 'Controlled RT (12-18C)', priority: 'Medium', freshness_pct: 56.7, shelf_days: 8, spoilage_pct: 1.9, tonnage: 384, temp_actual: 2.4, lastInspected: '2026-07-28 08:54' },
  { id: 'PGC-0060', commodity: 'Frozen Seafood', hub: 'Bangalore Farm Gate', tempZone: 'Warm (25-30C)', priority: 'Low', freshness_pct: 83.6, shelf_days: 14, spoilage_pct: 2.0, tonnage: 1109, temp_actual: 19.3, lastInspected: '2026-07-26 13:08' },
]

const dailyData = [
  { hour: '00:00', intake: 100, dispatch: 159, waste: 3.3 },
  { hour: '01:00', intake: 51, dispatch: 192, waste: 6.4 },
  { hour: '02:00', intake: 210, dispatch: 103, waste: 1.5 },
  { hour: '03:00', intake: 171, dispatch: 168, waste: 5.4 },
  { hour: '04:00', intake: 245, dispatch: 96, waste: 3.9 },
  { hour: '05:00', intake: 67, dispatch: 49, waste: 1.2 },
  { hour: '06:00', intake: 182, dispatch: 168, waste: 4.4 },
  { hour: '07:00', intake: 196, dispatch: 32, waste: 5.7 },
  { hour: '08:00', intake: 134, dispatch: 40, waste: 1.1 },
  { hour: '09:00', intake: 210, dispatch: 153, waste: 4.8 },
  { hour: '10:00', intake: 192, dispatch: 184, waste: 0.6 },
  { hour: '11:00', intake: 159, dispatch: 118, waste: 3.9 },
  { hour: '12:00', intake: 197, dispatch: 76, waste: 3.9 },
  { hour: '13:00', intake: 128, dispatch: 24, waste: 1.8 },
  { hour: '14:00', intake: 242, dispatch: 195, waste: 4.8 },
  { hour: '15:00', intake: 246, dispatch: 194, waste: 3.2 },
  { hour: '16:00', intake: 92, dispatch: 143, waste: 4.1 },
  { hour: '17:00', intake: 143, dispatch: 181, waste: 4.6 },
  { hour: '18:00', intake: 215, dispatch: 127, waste: 1.6 },
  { hour: '19:00', intake: 170, dispatch: 200, waste: 1.2 },
  { hour: '20:00', intake: 225, dispatch: 192, waste: 1.5 },
  { hour: '21:00', intake: 230, dispatch: 186, waste: 2.6 },
  { hour: '22:00', intake: 212, dispatch: 106, waste: 2.8 },
  { hour: '23:00', intake: 160, dispatch: 161, waste: 5.8 },
]

const commodityDist = [
  { name: 'Fresh Fruits', value: 134 },
  { name: 'Leafy Vegetables', value: 89 },
  { name: 'Dairy Products', value: 283 },
  { name: 'Frozen Seafood', value: 156 },
  { name: 'Fresh Meat', value: 164 },
  { name: 'Bakery Items', value: 252 },
  { name: 'Cut Flowers', value: 236 },
  { name: 'Organic Produce', value: 97 },
]

const filterGroups = [
  { key: 'commodity', label: 'Commodity', options: COMMODITIES.map(c => ({ value: c, label: c, count: 0 })) },
  { key: 'tempZone', label: 'Temp Zone', options: TEMP_ZONES.map(t => ({ value: t, label: t, count: 0 })) },
  { key: 'priority', label: 'Priority', options: PRIORITIES.map(p => ({ value: p, label: p, count: 0 })) },
]

function CommodityBadge({ commodity }: { commodity: string }) {
  const color = commodity === 'Fresh Fruits' ? 'bg-orange-500/15 text-orange-400' : commodity === 'Leafy Vegetables' ? 'bg-emerald-500/15 text-emerald-400' : commodity === 'Dairy Products' ? 'bg-sky-500/15 text-sky-400' : commodity === 'Frozen Seafood' ? 'bg-blue-500/15 text-blue-400' : commodity === 'Fresh Meat' ? 'bg-red-500/15 text-red-400' : commodity === 'Bakery Items' ? 'bg-amber-500/15 text-amber-400' : commodity === 'Cut Flowers' ? 'bg-pink-500/15 text-pink-400' : 'bg-lime-500/15 text-lime-400'
  return <span className={'pgc-commodity-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{commodity}</span>
}

function TempBadge({ temp }: { temp: string }) {
  const color = temp.startsWith('Ambient') ? 'bg-amber-500/15 text-amber-400' : temp.startsWith('Cool') ? 'bg-sky-500/15 text-sky-400' : temp.startsWith('Cold') ? 'bg-blue-500/15 text-blue-400' : temp.startsWith('Frozen') ? 'bg-cyan-500/15 text-cyan-400' : temp.startsWith('Controlled') ? 'bg-emerald-500/15 text-emerald-400' : 'bg-orange-500/15 text-orange-400'
  return <span className={'pgc-temp-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{temp}</span>
}

function PriorityBadge({ priority }: { priority: string }) {
  const color = priority === 'Critical' ? 'bg-red-500/15 text-red-400' : priority === 'High' ? 'bg-orange-500/15 text-orange-400' : priority === 'Medium' ? 'bg-amber-500/15 text-amber-400' : 'bg-blue-500/15 text-blue-400'
  return <span className={'pgc-priority-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{priority}</span>
}

function FreshnessBar({ value }: { value: number }) {
  const w = value
  const color = value >= 85 ? 'bg-emerald-500' : value >= 65 ? 'bg-amber-500' : 'bg-red-500'
  return <div className='pgc-fresh-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className={'h-full rounded-full pgc-fresh-fill ' + color} style={{ width: w + '%', animation: 'pgc-grow 1s ease-out' }}/></div>
}

function SpoilageBar({ value }: { value: number }) {
  const w = Math.min(value * 10, 100)
  return <div className='pgc-spoil-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className='h-full rounded-full bg-orange-500 pgc-spoil-fill' style={{ width: w + '%', animation: 'pgc-grow 1s ease-out' }}/></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, c = 2 * Math.PI * r, offset = c - (value / 100) * c
  return <div className='pgc-ring flex flex-col items-center'><svg width='70' height='70' className='-rotate-90'><circle cx='35' cy='35' r={r} fill='none' stroke='#27272a' strokeWidth='5'/><circle cx='35' cy='35' r={r} fill='none' stroke={color} strokeWidth='5' strokeDasharray={c} strokeDashoffset={offset} strokeLinecap='round' className='pgc-ring-path' style={{ transition: 'stroke-dashoffset 1s ease' }}/></svg><span className='pgc-ring-val text-sm font-bold mt-1' style={{ color }}>{value}%</span><span className='pgc-ring-label text-[10px] text-zinc-500'>{label}</span></div>
}

function KpiTile({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return <div className='pgc-kpi bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 pgc-kpi-card'><p className='text-xs text-zinc-500 mb-1'>{label}</p><p className={'text-xl font-bold ' + color}>{value}</p><p className='text-[10px] text-zinc-400 mt-1'>{sub}</p></div>
}

function ValueTile({ label, value, change }: { label: string; value: string; change: string }) {
  const up = change.startsWith('+')
  return <div className='pgc-value-tile bg-zinc-900/60 border border-zinc-800 rounded-lg p-3'><p className='text-xs text-zinc-500'>{label}</p><p className='text-lg font-bold text-white mt-1'>{value}</p><p className={'text-xs mt-1 ' + (up ? 'text-emerald-400' : 'text-red-400')}>{change}</p></div>
}

const insights = [
  { title: 'Mumbai Cold Hub Temperature Excursion', desc: 'Zone B2 recorded 4.2C above target for 47 minutes during compressor maintenance. 2.3 tons of dairy products quarantined for quality assessment. Recommend installing redundant compressor and automated alert threshold at +2C deviation.', severity: 'high' },
  { title: 'Chennai Seafood Port FIFO Compliance', desc: 'AI vision inspection system deployed at dock 3 achieved 98% FIFO compliance for frozen seafood. Shrimp exports quality grade improved from A- to A+. Integration with Customs EDI reduced clearance time by 3 hours per container.', severity: 'medium' },
  { title: 'Kolkata Flower Market Cold Chain Innovation', desc: 'New vacuum pre-cooling system for cut flowers reduced wilting rate from 12% to 3.5%. Average vase life extended from 5 to 9 days. Revenue per stem increased 22% due to premium quality grading. Expand to Pune and Bangalore.', severity: 'low' },
  { title: 'Predictive Spoilage Model v2 Launch', desc: 'Enhanced spoilage prediction model using IoT sensor data + weather forecasts + traffic patterns. Accuracy improved from 78% to 91%. Reduces waste by estimating remaining shelf life in real-time and auto-prioritizing dispatch for near-expiry items.', severity: 'high' },
]

export default function PerishableGoodsCommandView() {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [tab, setTab] = useState('dashboard')

  const toggleFilter = (key: string, val: string) => {
    setActiveFilters(prev => { const cur = prev[key] || []; const next = cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val]; return { ...prev, [key]: next } })
  }

  const filtered = goods.filter(g => {
    for (const [key, vals] of Object.entries(activeFilters)) { if (vals.length > 0 && !vals.includes(g[key as keyof typeof g] as string)) return false }
    if (searchQuery && !Object.values(g).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))) return false
    return true
  })

  return (
    <div className='pgc-root space-y-4 p-4'>
      <PageHeader title='Perishable Goods Command' description='Cold chain quality, temperature monitoring & shelf life optimization' />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className='pgc-tabs-list bg-zinc-900 border border-zinc-800'>
          <TabsTrigger value='dashboard' className='pgc-tab'>Dashboard</TabsTrigger>
          <TabsTrigger value='inventory' className='pgc-tab'>Inventory</TabsTrigger>
          <TabsTrigger value='analytics' className='pgc-tab'>Analytics</TabsTrigger>
          <TabsTrigger value='insights' className='pgc-tab'>Insights</TabsTrigger>
        </TabsList>
        <TabsContent value='dashboard' className='pgc-tab-content space-y-4 mt-4'>
          <div className='pgc-kpi-row grid grid-cols-2 lg:grid-cols-4 gap-3'>
            <KpiTile label='Active Shipments' value='2,847' sub='+180 in transit' color='text-orange-400' />
            <KpiTile label='Avg Freshness' value='91.3%' sub='+2.1pp vs last week' color='text-red-400' />
            <KpiTile label='Waste Today' value='1.2 tons' sub='-0.4 tons improved' color='text-emerald-400' />
            <KpiTile label='Temp Compliance' value='97.8%' sub='-0.3pp (target 99%)' color='text-amber-400' />
          </div>
          <div className='pgc-ring-row flex flex-wrap justify-around gap-2'>
            <HealthRing value={97} label='Temp OK' color='#f97316' />
            <HealthRing value={91} label='Freshness' color='#ef4444' />
            <HealthRing value={88} label='FIFO Score' color='#f59e0b' />
            <HealthRing value={94} label='Cold Chain' color='#10b981' />
            <HealthRing value={82} label='Shelf Predict' color='#06b6d4' />
            <HealthRing value={96} label='Hygiene' color='#6366f1' />
          </div>
          <div className='pgc-chart-row grid grid-cols-1 lg:grid-cols-3 gap-4'>
            <Card className='pgc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>24hr Intake/Dispatch</CardTitle></CardHeader><CardContent><LineChart data={dailyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='hour' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Line type='monotone' dataKey='intake' stroke='#f97316' strokeWidth={2} dot={false}/><Line type='monotone' dataKey='dispatch' stroke='#ef4444' strokeWidth={2} dot={false}/></LineChart></CardContent></Card>
            <Card className='pgc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Hourly Waste %</CardTitle></CardHeader><CardContent><BarChart data={dailyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='hour' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Bar dataKey='waste' fill='#f59e0b' radius={[4,4,0,0]}/></BarChart></CardContent></Card>
            <Card className='pgc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Commodity Mix</CardTitle></CardHeader><CardContent><PieChart width={350} height={200}><Pie data={commodityDist} cx='50%' cy='50%' outerRadius={70} innerRadius={35} dataKey='value' paddingAngle={2}>{commodityDist.map((_, i) => <Cell key={i} fill={COLORS[i % 8]} />)}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value='inventory' className='pgc-tab-content space-y-4 mt-4'>
          <ModuleBreadcrumb items={[{ label: 'Perishable Command' }, { label: 'Inventory' }]} />
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => { setActiveFilters({}); setSearchQuery('') }} totalItems={goods.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder='Search perishable goods by ID, commodity, hub...' />
          <Card className='pgc-table-card bg-zinc-900/60 border-zinc-800'><CardContent className='p-0'><div className='pgc-table-wrap overflow-x-auto max-h-[400px] overflow-y-auto'><table className='pgc-table w-full text-sm'><thead><tr className='border-b border-zinc-800'><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>ID</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Commodity</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Hub</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Priority</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Freshness</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Spoilage</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Shelf</th><th className='text-right px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Tons</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Temp Zone</th></tr></thead><tbody>
          {filtered.map(g => (
            <tr key={g.id} className='pgc-table-row border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors'>
              <td className='px-3 py-2 font-mono text-xs text-orange-400'>{g.id}</td>
              <td className='px-3 py-2'><CommodityBadge commodity={g.commodity} /></td>
              <td className='px-3 py-2 text-xs text-zinc-300'>{g.hub}</td>
              <td className='px-3 py-2'><PriorityBadge priority={g.priority} /></td>
              <td className='px-3 py-2 w-24'><FreshnessBar value={g.freshness_pct} /><span className='text-[10px] text-zinc-500 ml-1'>{g.freshness_pct}%</span></td>
              <td className='px-3 py-2 w-24'><SpoilageBar value={g.spoilage_pct} /><span className='text-[10px] text-zinc-500 ml-1'>{g.spoilage_pct}%</span></td>
              <td className='px-3 py-2 text-xs text-zinc-400'>{g.shelf_days}d</td>
              <td className='px-3 py-2 text-right text-xs'>{g.tonnage}</td>
              <td className='px-3 py-2'><TempBadge temp={g.tempZone} /></td>
            </tr>
          ))})
          </tbody></table></div></CardContent></Card>
        </TabsContent>
        <TabsContent value='analytics' className='pgc-tab-content space-y-4 mt-4'>
          <div className='pgc-value-row grid grid-cols-2 lg:grid-cols-4 gap-3'>
            <ValueTile label='Total Throughput' value='4,280 tons' change='+12% WoW' />
            <ValueTile label='Cold Chain Uptime' value='99.4%' change='+0.2pp' />
            <ValueTile label='Avg Shelf Life Used' value='62%' change='-5pp optimized' />
            <ValueTile label='Quality Rejections' value='0.8%' change='-0.3pp' />
          </div>
          <div className='pgc-analytics-charts grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <Card className='pgc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Hub Performance</CardTitle></CardHeader><CardContent><BarChart data={HUBS.map((h,i) => ({ name: h.split(' ')[0], freshness: [92,89,94,87,91,93,85,90][i], compliance: [98,96,99,95,97,99,93,97][i] }))} width={450} height={220}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='name' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Bar dataKey='freshness' fill='#f97316' radius={[4,4,0,0]}/><Bar dataKey='compliance' fill='#ef4444' radius={[4,4,0,0]}/></BarChart></CardContent></Card>
            <Card className='pgc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Temperature Zone Mix</CardTitle></CardHeader><CardContent><PieChart width={450} height={220}><Pie data={[{ name: 'Cool (2-8C)', value: 35 }, { name: 'Cold (-18C)', value: 28 }, { name: 'Ambient', value: 15 }, { name: 'Frozen', value: 12 }, { name: 'Ctrl RT', value: 10 }]} cx='50%' cy='50%' outerRadius={80} innerRadius={40} dataKey='value' paddingAngle={3}>{[<Cell key={0} fill='#0ea5e9' />, <Cell key={1} fill='#3b82f6' />, <Cell key={2} fill='#f59e0b' />, <Cell key={3} fill='#06b6d4' />, <Cell key={4} fill='#10b981' />]}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value='insights' className='pgc-tab-content space-y-4 mt-4'>
          {insights.map((ins, i) => (
            <Card key={i} className={'pgc-insight-card bg-zinc-900/60 border ' + (ins.severity === 'high' ? 'border-orange-500/30' : ins.severity === 'medium' ? 'border-red-500/30' : 'border-zinc-800')}><CardContent className='p-4'><div className='flex items-start gap-3'><div className={'pgc-insight-dot w-2 h-2 rounded-full mt-1.5 shrink-0 ' + (ins.severity === 'high' ? 'bg-orange-500' : ins.severity === 'medium' ? 'bg-red-500' : 'bg-zinc-500')} /><div><p className='text-sm font-medium text-zinc-200'>{ins.title}</p><p className='text-xs text-zinc-400 mt-1 leading-relaxed'>{ins.desc}</p></div></div></CardContent></Card>
          ))})
        </TabsContent>
      </Tabs>
    </div>
  )
}
