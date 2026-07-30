import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#ec4899', '#a855f7', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#f97316']

const ZONES = ['Gurgaon Sector 29', 'BKC Mumbai', 'Koramangala BLR', 'Hitech City HYD', 'Salt Lake KOL', 'Anna Nagar CHN', 'Baner Pune', 'SG Highway AMD']
const CATEGORIES = ['Grocery Fresh', 'FMCG Staples', 'Dairy & Chilled', 'Beverages', 'Snacks & Confectionery', 'Personal Care', 'Pharmacy OTC', 'Pet Supplies']
const STATUSES = ['Active', 'Low Stock', 'Replenishing', 'Closed', 'Maintenance', 'Restricted']
const PRIORITIES = ['Critical', 'High', 'Medium', 'Low']

const stores = [
  { id: 'DSO-0001', zone: 'Gurgaon Sector 29', category: 'Grocery Fresh', status: 'Active', priority: 'Critical', fill_rate: 61.4, delivery_min: 19, orders_hr: 259, spoilage: 0.3, sku_count: 2519, sqr_ft: 1500, lastRestock: '2026-07-22 08:13' },
  { id: 'DSO-0002', zone: 'BKC Mumbai', category: 'FMCG Staples', status: 'Low Stock', priority: 'High', fill_rate: 81.5, delivery_min: 27, orders_hr: 156, spoilage: 0.2, sku_count: 4069, sqr_ft: 3000, lastRestock: '2026-07-11 00:25' },
  { id: 'DSO-0003', zone: 'Koramangala BLR', category: 'Dairy & Chilled', status: 'Replenishing', priority: 'Medium', fill_rate: 72.0, delivery_min: 19, orders_hr: 187, spoilage: 3.8, sku_count: 1236, sqr_ft: 2500, lastRestock: '2026-07-08 04:48' },
  { id: 'DSO-0004', zone: 'Hitech City HYD', category: 'Beverages', status: 'Closed', priority: 'Low', fill_rate: 74.5, delivery_min: 16, orders_hr: 310, spoilage: 2.0, sku_count: 1552, sqr_ft: 3500, lastRestock: '2026-07-03 00:43' },
  { id: 'DSO-0005', zone: 'Salt Lake KOL', category: 'Snacks & Confectionery', status: 'Maintenance', priority: 'Critical', fill_rate: 97.8, delivery_min: 11, orders_hr: 91, spoilage: 2.9, sku_count: 3674, sqr_ft: 4000, lastRestock: '2026-07-19 04:56' },
  { id: 'DSO-0006', zone: 'Anna Nagar CHN', category: 'Personal Care', status: 'Restricted', priority: 'High', fill_rate: 92.2, delivery_min: 16, orders_hr: 263, spoilage: 1.8, sku_count: 2085, sqr_ft: 1500, lastRestock: '2026-07-05 06:58' },
  { id: 'DSO-0007', zone: 'Baner Pune', category: 'Pharmacy OTC', status: 'Active', priority: 'Medium', fill_rate: 63.5, delivery_min: 27, orders_hr: 206, spoilage: 3.1, sku_count: 5007, sqr_ft: 3500, lastRestock: '2026-07-03 20:03' },
  { id: 'DSO-0008', zone: 'SG Highway AMD', category: 'Pet Supplies', status: 'Low Stock', priority: 'Low', fill_rate: 98.4, delivery_min: 27, orders_hr: 252, spoilage: 4.0, sku_count: 1033, sqr_ft: 2000, lastRestock: '2026-07-03 04:24' },
  { id: 'DSO-0009', zone: 'Gurgaon Sector 29', category: 'Grocery Fresh', status: 'Replenishing', priority: 'Critical', fill_rate: 91.8, delivery_min: 30, orders_hr: 161, spoilage: 3.3, sku_count: 4637, sqr_ft: 3000, lastRestock: '2026-07-23 06:18' },
  { id: 'DSO-0010', zone: 'BKC Mumbai', category: 'FMCG Staples', status: 'Closed', priority: 'High', fill_rate: 80.8, delivery_min: 21, orders_hr: 114, spoilage: 1.9, sku_count: 2051, sqr_ft: 4000, lastRestock: '2026-07-08 11:00' },
  { id: 'DSO-0011', zone: 'Koramangala BLR', category: 'Dairy & Chilled', status: 'Maintenance', priority: 'Medium', fill_rate: 73.5, delivery_min: 17, orders_hr: 300, spoilage: 3.0, sku_count: 3242, sqr_ft: 4000, lastRestock: '2026-07-12 07:41' },
  { id: 'DSO-0012', zone: 'Hitech City HYD', category: 'Beverages', status: 'Restricted', priority: 'Low', fill_rate: 95.7, delivery_min: 18, orders_hr: 119, spoilage: 3.1, sku_count: 1651, sqr_ft: 2500, lastRestock: '2026-07-01 01:47' },
  { id: 'DSO-0013', zone: 'Salt Lake KOL', category: 'Snacks & Confectionery', status: 'Active', priority: 'Critical', fill_rate: 60.3, delivery_min: 24, orders_hr: 266, spoilage: 0.4, sku_count: 3013, sqr_ft: 1500, lastRestock: '2026-07-05 15:51' },
  { id: 'DSO-0014', zone: 'Anna Nagar CHN', category: 'Personal Care', status: 'Low Stock', priority: 'High', fill_rate: 82.6, delivery_min: 28, orders_hr: 299, spoilage: 3.0, sku_count: 5062, sqr_ft: 2500, lastRestock: '2026-07-26 13:16' },
  { id: 'DSO-0015', zone: 'Baner Pune', category: 'Pharmacy OTC', status: 'Replenishing', priority: 'Medium', fill_rate: 91.7, delivery_min: 30, orders_hr: 202, spoilage: 1.1, sku_count: 1951, sqr_ft: 2000, lastRestock: '2026-07-26 14:37' },
  { id: 'DSO-0016', zone: 'SG Highway AMD', category: 'Pet Supplies', status: 'Closed', priority: 'Low', fill_rate: 69.4, delivery_min: 24, orders_hr: 173, spoilage: 1.4, sku_count: 4047, sqr_ft: 3000, lastRestock: '2026-07-20 03:23' },
  { id: 'DSO-0017', zone: 'Gurgaon Sector 29', category: 'Grocery Fresh', status: 'Maintenance', priority: 'Critical', fill_rate: 59.7, delivery_min: 11, orders_hr: 198, spoilage: 4.0, sku_count: 5056, sqr_ft: 1500, lastRestock: '2026-07-25 14:05' },
  { id: 'DSO-0018', zone: 'BKC Mumbai', category: 'FMCG Staples', status: 'Restricted', priority: 'High', fill_rate: 62.3, delivery_min: 26, orders_hr: 190, spoilage: 0.6, sku_count: 2476, sqr_ft: 3500, lastRestock: '2026-07-08 14:51' },
  { id: 'DSO-0019', zone: 'Koramangala BLR', category: 'Dairy & Chilled', status: 'Active', priority: 'Medium', fill_rate: 64.7, delivery_min: 13, orders_hr: 288, spoilage: 3.3, sku_count: 3984, sqr_ft: 1500, lastRestock: '2026-07-20 13:11' },
  { id: 'DSO-0020', zone: 'Hitech City HYD', category: 'Beverages', status: 'Low Stock', priority: 'Low', fill_rate: 93.8, delivery_min: 28, orders_hr: 211, spoilage: 1.0, sku_count: 2170, sqr_ft: 3000, lastRestock: '2026-07-19 02:25' },
  { id: 'DSO-0021', zone: 'Salt Lake KOL', category: 'Snacks & Confectionery', status: 'Replenishing', priority: 'Critical', fill_rate: 66.1, delivery_min: 13, orders_hr: 254, spoilage: 4.8, sku_count: 3266, sqr_ft: 1500, lastRestock: '2026-07-14 01:20' },
  { id: 'DSO-0022', zone: 'Anna Nagar CHN', category: 'Personal Care', status: 'Closed', priority: 'High', fill_rate: 69.7, delivery_min: 11, orders_hr: 111, spoilage: 4.7, sku_count: 3861, sqr_ft: 3500, lastRestock: '2026-07-08 07:28' },
  { id: 'DSO-0023', zone: 'Baner Pune', category: 'Pharmacy OTC', status: 'Maintenance', priority: 'Medium', fill_rate: 86.6, delivery_min: 14, orders_hr: 130, spoilage: 0.6, sku_count: 3539, sqr_ft: 3500, lastRestock: '2026-07-10 15:32' },
  { id: 'DSO-0024', zone: 'SG Highway AMD', category: 'Pet Supplies', status: 'Restricted', priority: 'Low', fill_rate: 65.4, delivery_min: 20, orders_hr: 125, spoilage: 4.2, sku_count: 4757, sqr_ft: 3000, lastRestock: '2026-07-07 16:08' },
  { id: 'DSO-0025', zone: 'Gurgaon Sector 29', category: 'Grocery Fresh', status: 'Active', priority: 'Critical', fill_rate: 63.7, delivery_min: 27, orders_hr: 53, spoilage: 0.5, sku_count: 1101, sqr_ft: 3500, lastRestock: '2026-07-12 05:27' },
  { id: 'DSO-0026', zone: 'BKC Mumbai', category: 'FMCG Staples', status: 'Low Stock', priority: 'High', fill_rate: 83.9, delivery_min: 28, orders_hr: 130, spoilage: 3.0, sku_count: 4715, sqr_ft: 2000, lastRestock: '2026-07-10 09:12' },
  { id: 'DSO-0027', zone: 'Koramangala BLR', category: 'Dairy & Chilled', status: 'Replenishing', priority: 'Medium', fill_rate: 73.3, delivery_min: 15, orders_hr: 229, spoilage: 2.3, sku_count: 1604, sqr_ft: 1500, lastRestock: '2026-07-01 10:58' },
  { id: 'DSO-0028', zone: 'Hitech City HYD', category: 'Beverages', status: 'Closed', priority: 'Low', fill_rate: 91.0, delivery_min: 28, orders_hr: 225, spoilage: 0.9, sku_count: 2569, sqr_ft: 2500, lastRestock: '2026-07-16 04:27' },
  { id: 'DSO-0029', zone: 'Salt Lake KOL', category: 'Snacks & Confectionery', status: 'Maintenance', priority: 'Critical', fill_rate: 86.5, delivery_min: 21, orders_hr: 74, spoilage: 3.4, sku_count: 4849, sqr_ft: 1500, lastRestock: '2026-07-05 09:36' },
  { id: 'DSO-0030', zone: 'Anna Nagar CHN', category: 'Personal Care', status: 'Restricted', priority: 'High', fill_rate: 85.6, delivery_min: 30, orders_hr: 103, spoilage: 3.2, sku_count: 1535, sqr_ft: 2000, lastRestock: '2026-07-27 23:04' },
  { id: 'DSO-0031', zone: 'Baner Pune', category: 'Pharmacy OTC', status: 'Active', priority: 'Medium', fill_rate: 82.2, delivery_min: 26, orders_hr: 149, spoilage: 3.4, sku_count: 1573, sqr_ft: 2000, lastRestock: '2026-07-04 23:30' },
  { id: 'DSO-0032', zone: 'SG Highway AMD', category: 'Pet Supplies', status: 'Low Stock', priority: 'Low', fill_rate: 97.3, delivery_min: 22, orders_hr: 105, spoilage: 1.2, sku_count: 1616, sqr_ft: 2000, lastRestock: '2026-07-25 11:54' },
  { id: 'DSO-0033', zone: 'Gurgaon Sector 29', category: 'Grocery Fresh', status: 'Replenishing', priority: 'Critical', fill_rate: 69.9, delivery_min: 29, orders_hr: 171, spoilage: 0.9, sku_count: 2508, sqr_ft: 3500, lastRestock: '2026-07-24 06:46' },
  { id: 'DSO-0034', zone: 'BKC Mumbai', category: 'FMCG Staples', status: 'Closed', priority: 'High', fill_rate: 86.7, delivery_min: 8, orders_hr: 76, spoilage: 0.7, sku_count: 1046, sqr_ft: 3000, lastRestock: '2026-07-28 08:01' },
  { id: 'DSO-0035', zone: 'Koramangala BLR', category: 'Dairy & Chilled', status: 'Maintenance', priority: 'Medium', fill_rate: 97.3, delivery_min: 10, orders_hr: 164, spoilage: 0.5, sku_count: 1630, sqr_ft: 4000, lastRestock: '2026-07-03 02:06' },
  { id: 'DSO-0036', zone: 'Hitech City HYD', category: 'Beverages', status: 'Restricted', priority: 'Low', fill_rate: 72.2, delivery_min: 19, orders_hr: 124, spoilage: 3.6, sku_count: 3583, sqr_ft: 2500, lastRestock: '2026-07-28 16:16' },
  { id: 'DSO-0037', zone: 'Salt Lake KOL', category: 'Snacks & Confectionery', status: 'Active', priority: 'Critical', fill_rate: 84.3, delivery_min: 17, orders_hr: 249, spoilage: 1.0, sku_count: 2836, sqr_ft: 2500, lastRestock: '2026-07-26 02:19' },
  { id: 'DSO-0038', zone: 'Anna Nagar CHN', category: 'Personal Care', status: 'Low Stock', priority: 'High', fill_rate: 98.6, delivery_min: 26, orders_hr: 100, spoilage: 1.8, sku_count: 1013, sqr_ft: 3500, lastRestock: '2026-07-16 14:15' },
  { id: 'DSO-0039', zone: 'Baner Pune', category: 'Pharmacy OTC', status: 'Replenishing', priority: 'Medium', fill_rate: 91.5, delivery_min: 22, orders_hr: 252, spoilage: 4.6, sku_count: 2891, sqr_ft: 3000, lastRestock: '2026-07-16 11:13' },
  { id: 'DSO-0040', zone: 'SG Highway AMD', category: 'Pet Supplies', status: 'Closed', priority: 'Low', fill_rate: 78.2, delivery_min: 25, orders_hr: 99, spoilage: 2.0, sku_count: 2624, sqr_ft: 2500, lastRestock: '2026-07-20 01:52' },
  { id: 'DSO-0041', zone: 'Gurgaon Sector 29', category: 'Grocery Fresh', status: 'Maintenance', priority: 'Critical', fill_rate: 74.6, delivery_min: 20, orders_hr: 232, spoilage: 2.4, sku_count: 4054, sqr_ft: 2000, lastRestock: '2026-07-16 11:23' },
  { id: 'DSO-0042', zone: 'BKC Mumbai', category: 'FMCG Staples', status: 'Restricted', priority: 'High', fill_rate: 78.5, delivery_min: 24, orders_hr: 301, spoilage: 4.6, sku_count: 3557, sqr_ft: 3000, lastRestock: '2026-07-09 14:18' },
  { id: 'DSO-0043', zone: 'Koramangala BLR', category: 'Dairy & Chilled', status: 'Active', priority: 'Medium', fill_rate: 79.3, delivery_min: 27, orders_hr: 52, spoilage: 3.0, sku_count: 4604, sqr_ft: 4000, lastRestock: '2026-07-12 13:42' },
  { id: 'DSO-0044', zone: 'Hitech City HYD', category: 'Beverages', status: 'Low Stock', priority: 'Low', fill_rate: 82.9, delivery_min: 13, orders_hr: 150, spoilage: 2.4, sku_count: 2241, sqr_ft: 2500, lastRestock: '2026-07-10 21:11' },
  { id: 'DSO-0045', zone: 'Salt Lake KOL', category: 'Snacks & Confectionery', status: 'Replenishing', priority: 'Critical', fill_rate: 57.3, delivery_min: 25, orders_hr: 313, spoilage: 3.4, sku_count: 1443, sqr_ft: 2000, lastRestock: '2026-07-30 06:45' },
  { id: 'DSO-0046', zone: 'Anna Nagar CHN', category: 'Personal Care', status: 'Closed', priority: 'High', fill_rate: 86.9, delivery_min: 15, orders_hr: 292, spoilage: 0.8, sku_count: 3140, sqr_ft: 4000, lastRestock: '2026-07-23 00:51' },
  { id: 'DSO-0047', zone: 'Baner Pune', category: 'Pharmacy OTC', status: 'Maintenance', priority: 'Medium', fill_rate: 61.7, delivery_min: 11, orders_hr: 309, spoilage: 1.2, sku_count: 3008, sqr_ft: 3500, lastRestock: '2026-07-26 12:24' },
  { id: 'DSO-0048', zone: 'SG Highway AMD', category: 'Pet Supplies', status: 'Restricted', priority: 'Low', fill_rate: 57.1, delivery_min: 21, orders_hr: 132, spoilage: 0.7, sku_count: 815, sqr_ft: 2000, lastRestock: '2026-07-02 03:47' },
  { id: 'DSO-0049', zone: 'Gurgaon Sector 29', category: 'Grocery Fresh', status: 'Active', priority: 'Critical', fill_rate: 82.6, delivery_min: 18, orders_hr: 74, spoilage: 0.9, sku_count: 3517, sqr_ft: 4000, lastRestock: '2026-07-04 21:37' },
  { id: 'DSO-0050', zone: 'BKC Mumbai', category: 'FMCG Staples', status: 'Low Stock', priority: 'High', fill_rate: 58.4, delivery_min: 11, orders_hr: 207, spoilage: 4.4, sku_count: 4235, sqr_ft: 2000, lastRestock: '2026-07-09 16:09' },
  { id: 'DSO-0051', zone: 'Koramangala BLR', category: 'Dairy & Chilled', status: 'Replenishing', priority: 'Medium', fill_rate: 60.4, delivery_min: 14, orders_hr: 141, spoilage: 0.4, sku_count: 5366, sqr_ft: 2000, lastRestock: '2026-07-21 14:49' },
  { id: 'DSO-0052', zone: 'Hitech City HYD', category: 'Beverages', status: 'Closed', priority: 'Low', fill_rate: 79.7, delivery_min: 25, orders_hr: 185, spoilage: 3.5, sku_count: 2058, sqr_ft: 2000, lastRestock: '2026-07-03 12:13' },
  { id: 'DSO-0053', zone: 'Salt Lake KOL', category: 'Snacks & Confectionery', status: 'Maintenance', priority: 'Critical', fill_rate: 98.0, delivery_min: 10, orders_hr: 93, spoilage: 3.8, sku_count: 1137, sqr_ft: 2000, lastRestock: '2026-07-19 21:29' },
  { id: 'DSO-0054', zone: 'Anna Nagar CHN', category: 'Personal Care', status: 'Restricted', priority: 'High', fill_rate: 56.2, delivery_min: 18, orders_hr: 303, spoilage: 0.5, sku_count: 4218, sqr_ft: 2000, lastRestock: '2026-07-21 06:57' },
  { id: 'DSO-0055', zone: 'Baner Pune', category: 'Pharmacy OTC', status: 'Active', priority: 'Medium', fill_rate: 98.0, delivery_min: 30, orders_hr: 293, spoilage: 4.6, sku_count: 4563, sqr_ft: 2000, lastRestock: '2026-07-29 02:24' },
  { id: 'DSO-0056', zone: 'SG Highway AMD', category: 'Pet Supplies', status: 'Low Stock', priority: 'Low', fill_rate: 82.9, delivery_min: 24, orders_hr: 240, spoilage: 2.9, sku_count: 4055, sqr_ft: 2000, lastRestock: '2026-07-20 04:06' },
  { id: 'DSO-0057', zone: 'Gurgaon Sector 29', category: 'Grocery Fresh', status: 'Replenishing', priority: 'Critical', fill_rate: 97.5, delivery_min: 19, orders_hr: 319, spoilage: 4.3, sku_count: 1265, sqr_ft: 2500, lastRestock: '2026-07-15 06:03' },
  { id: 'DSO-0058', zone: 'BKC Mumbai', category: 'FMCG Staples', status: 'Closed', priority: 'High', fill_rate: 64.9, delivery_min: 9, orders_hr: 95, spoilage: 1.5, sku_count: 4140, sqr_ft: 1500, lastRestock: '2026-07-02 00:09' },
  { id: 'DSO-0059', zone: 'Koramangala BLR', category: 'Dairy & Chilled', status: 'Maintenance', priority: 'Medium', fill_rate: 87.4, delivery_min: 22, orders_hr: 147, spoilage: 2.2, sku_count: 2097, sqr_ft: 4000, lastRestock: '2026-07-20 14:33' },
  { id: 'DSO-0060', zone: 'Hitech City HYD', category: 'Beverages', status: 'Restricted', priority: 'Low', fill_rate: 81.4, delivery_min: 18, orders_hr: 157, spoilage: 0.5, sku_count: 4957, sqr_ft: 3000, lastRestock: '2026-07-19 19:39' },
]

const hourlyData = [
  { hour: '00:00', orders: 128, deliveries: 215, avgTime: 16.3 },
  { hour: '01:00', orders: 146, deliveries: 28, avgTime: 15.9 },
  { hour: '02:00', orders: 103, deliveries: 34, avgTime: 13.0 },
  { hour: '03:00', orders: 247, deliveries: 68, avgTime: 26.6 },
  { hour: '04:00', orders: 104, deliveries: 116, avgTime: 17.0 },
  { hour: '05:00', orders: 202, deliveries: 199, avgTime: 23.7 },
  { hour: '06:00', orders: 190, deliveries: 59, avgTime: 21.1 },
  { hour: '07:00', orders: 151, deliveries: 141, avgTime: 16.6 },
  { hour: '08:00', orders: 202, deliveries: 81, avgTime: 23.6 },
  { hour: '09:00', orders: 61, deliveries: 176, avgTime: 14.7 },
  { hour: '10:00', orders: 250, deliveries: 35, avgTime: 12.0 },
  { hour: '11:00', orders: 266, deliveries: 174, avgTime: 26.9 },
  { hour: '12:00', orders: 57, deliveries: 187, avgTime: 24.6 },
  { hour: '13:00', orders: 119, deliveries: 20, avgTime: 23.4 },
  { hour: '14:00', orders: 20, deliveries: 68, avgTime: 16.8 },
  { hour: '15:00', orders: 37, deliveries: 38, avgTime: 10.3 },
  { hour: '16:00', orders: 247, deliveries: 50, avgTime: 20.4 },
  { hour: '17:00', orders: 100, deliveries: 199, avgTime: 19.9 },
  { hour: '18:00', orders: 227, deliveries: 172, avgTime: 12.7 },
  { hour: '19:00', orders: 205, deliveries: 35, avgTime: 15.7 },
  { hour: '20:00', orders: 258, deliveries: 96, avgTime: 15.6 },
  { hour: '21:00', orders: 82, deliveries: 35, avgTime: 13.0 },
  { hour: '22:00', orders: 153, deliveries: 69, avgTime: 17.7 },
  { hour: '23:00', orders: 189, deliveries: 28, avgTime: 26.2 },
]

const catDist = [
  { name: 'Grocery Fresh', value: 346 },
  { name: 'FMCG Staples', value: 157 },
  { name: 'Dairy & Chilled', value: 205 },
  { name: 'Beverages', value: 83 },
  { name: 'Snacks & Confectionery', value: 275 },
  { name: 'Personal Care', value: 114 },
  { name: 'Pharmacy OTC', value: 197 },
  { name: 'Pet Supplies', value: 192 },
]

const filterGroups = [
  { key: 'zone', label: 'Zone', options: ZONES.map(z => ({ value: z, label: z, count: 0 })) },
  { key: 'category', label: 'Category', options: CATEGORIES.map(c => ({ value: c, label: c, count: 0 })) },
  { key: 'status', label: 'Status', options: STATUSES.map(s => ({ value: s, label: s, count: 0 })) },
]

function ZoneBadge({ zone }: { zone: string }) {
  const color = zone.includes('Gurgaon') ? 'bg-pink-500/15 text-pink-400' : zone.includes('BKC') ? 'bg-purple-500/15 text-purple-400' : zone.includes('Koramangala') ? 'bg-rose-500/15 text-rose-400' : zone.includes('Hitech') ? 'bg-violet-500/15 text-violet-400' : zone.includes('Salt Lake') ? 'bg-amber-500/15 text-amber-400' : zone.includes('Anna Nagar') ? 'bg-emerald-500/15 text-emerald-400' : zone.includes('Baner') ? 'bg-cyan-500/15 text-cyan-400' : 'bg-indigo-500/15 text-indigo-400'
  return <span className={'dso-zone-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{zone}</span>
}

function StatusBadge({ status }: { status: string }) {
  const color = status === 'Active' ? 'bg-emerald-500/15 text-emerald-400' : status === 'Low Stock' ? 'bg-red-500/15 text-red-400' : status === 'Replenishing' ? 'bg-amber-500/15 text-amber-400' : status === 'Closed' ? 'bg-zinc-500/15 text-zinc-400' : status === 'Maintenance' ? 'bg-orange-500/15 text-orange-400' : 'bg-blue-500/15 text-blue-400'
  return <span className={'dso-status-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{status}</span>
}

function PriorityBadge({ priority }: { priority: string }) {
  const color = priority === 'Critical' ? 'bg-red-500/15 text-red-400' : priority === 'High' ? 'bg-orange-500/15 text-orange-400' : priority === 'Medium' ? 'bg-amber-500/15 text-amber-400' : 'bg-blue-500/15 text-blue-400'
  return <span className={'dso-priority-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{priority}</span>
}

function FillBar({ value }: { value: number }) {
  const w = value
  const color = value >= 90 ? 'bg-emerald-500' : value >= 75 ? 'bg-amber-500' : 'bg-red-500'
  return <div className='dso-fill-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className={'h-full rounded-full dso-fill-fill ' + color} style={{ width: w + '%', animation: 'dso-grow 1s ease-out' }}/></div>
}

function DeliveryBar({ value }: { value: number }) {
  const w = Math.max(100 - value * 2.5, 5)
  return <div className='dso-del-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className='h-full rounded-full bg-pink-500 dso-del-fill' style={{ width: w + '%', animation: 'dso-grow 1s ease-out' }}/></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, c = 2 * Math.PI * r, offset = c - (value / 100) * c
  return <div className='dso-ring flex flex-col items-center'><svg width='70' height='70' className='-rotate-90'><circle cx='35' cy='35' r={r} fill='none' stroke='#27272a' strokeWidth='5'/><circle cx='35' cy='35' r={r} fill='none' stroke={color} strokeWidth='5' strokeDasharray={c} strokeDashoffset={offset} strokeLinecap='round' className='dso-ring-path' style={{ transition: 'stroke-dashoffset 1s ease' }}/></svg><span className='dso-ring-val text-sm font-bold mt-1' style={{ color }}>{value}%</span><span className='dso-ring-label text-[10px] text-zinc-500'>{label}</span></div>
}

function KpiTile({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return <div className='dso-kpi bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 dso-kpi-card'><p className='text-xs text-zinc-500 mb-1'>{label}</p><p className={'text-xl font-bold ' + color}>{value}</p><p className='text-[10px] text-zinc-400 mt-1'>{sub}</p></div>
}

function ValueTile({ label, value, change }: { label: string; value: string; change: string }) {
  const up = change.startsWith('+')
  return <div className='dso-value-tile bg-zinc-900/60 border border-zinc-800 rounded-lg p-3'><p className='text-xs text-zinc-500'>{label}</p><p className='text-lg font-bold text-white mt-1'>{value}</p><p className={'text-xs mt-1 ' + (up ? 'text-emerald-400' : 'text-red-400')}>{change}</p></div>
}

const insights = [
  { title: 'BKC Mumbai Peak Hour Bottleneck', desc: 'BKC dark store handling 312 orders/hr during 7-9 PM rush, exceeding optimal throughput by 40%. Recommend adding 2 micro-pick stations and implementing queue-busting pick paths to reduce SLA breaches from 8.2% to under 2%.', severity: 'high' },
  { title: 'Koramangala Spoilage Alert', desc: 'Dairy & Chilled category spoilage rate at Koramangala hit 4.8% this week, 3x the network average. Cold chain audit reveals door seal gaps in Zone B. Immediate maintenance scheduled and backup chiller units deployed.', severity: 'high' },
  { title: 'AI Slot Optimization Rollout', desc: 'ML-based delivery slot optimizer deployed across 6 zones. Average delivery time reduced from 22 min to 16 min. Customer satisfaction score improved from 4.1 to 4.6 stars. Full rollout to all 8 zones planned for next week.', severity: 'medium' },
  { title: 'Gurgaon Grocery Fresh Expansion', desc: 'New 4000 sq ft dark store in Sector 49 approved. Expected to serve 15,000 customers in 15-min delivery radius. SKU expansion plan includes 1,200 organic and premium fresh items targeted at affluent demographic.', severity: 'low' },
]

export default function DarkStoreOperationsView() {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [tab, setTab] = useState('dashboard')

  const toggleFilter = (key: string, val: string) => {
    setActiveFilters(prev => { const cur = prev[key] || []; const next = cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val]; return { ...prev, [key]: next } })
  }

  const filtered = stores.filter(s => {
    for (const [key, vals] of Object.entries(activeFilters)) { if (vals.length > 0 && !vals.includes(s[key as keyof typeof s] as string)) return false }
    if (searchQuery && !Object.values(s).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))) return false
    return true
  })

  return (
    <div className='dso-root space-y-4 p-4'>
      <PageHeader title='Dark Store Operations' description='Q-commerce micro-fulfillment & quick delivery management' />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className='dso-tabs-list bg-zinc-900 border border-zinc-800'>
          <TabsTrigger value='dashboard' className='dso-tab'>Dashboard</TabsTrigger>
          <TabsTrigger value='stores' className='dso-tab'>Stores</TabsTrigger>
          <TabsTrigger value='analytics' className='dso-tab'>Analytics</TabsTrigger>
          <TabsTrigger value='insights' className='dso-tab'>Insights</TabsTrigger>
        </TabsList>
        <TabsContent value='dashboard' className='dso-tab-content space-y-4 mt-4'>
          <div className='dso-kpi-row grid grid-cols-2 lg:grid-cols-4 gap-3'>
            <KpiTile label='Active Dark Stores' value='8' sub='2 launching next week' color='text-pink-400' />
            <KpiTile label='Orders Today' value='14,832' sub='+22% vs yesterday' color='text-purple-400' />
            <KpiTile label='Avg Delivery Time' value='16 min' sub='-3 min improvement' color='text-emerald-400' />
            <KpiTile label='Fill Rate' value='94.2%' sub='+1.8pp this week' color='text-amber-400' />
          </div>
          <div className='dso-ring-row flex flex-wrap justify-around gap-2'>
            <HealthRing value={94} label='Fill Rate' color='#ec4899' />
            <HealthRing value={88} label='On-Time' color='#a855f7' />
            <HealthRing value={76} label='Fresh Quality' color='#f43f5e' />
            <HealthRing value={92} label='Inventory Acc.' color='#f59e0b' />
            <HealthRing value={85} label='Picker Eff.' color='#10b981' />
            <HealthRing value={79} label='Customer Sat.' color='#06b6d4' />
          </div>
          <div className='dso-chart-row grid grid-cols-1 lg:grid-cols-3 gap-4'>
            <Card className='dso-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Hourly Order Volume</CardTitle></CardHeader><CardContent><LineChart data={hourlyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='hour' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Line type='monotone' dataKey='orders' stroke='#ec4899' strokeWidth={2} dot={false}/><Line type='monotone' dataKey='deliveries' stroke='#a855f7' strokeWidth={2} dot={false}/></LineChart></CardContent></Card>
            <Card className='dso-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Avg Delivery Time</CardTitle></CardHeader><CardContent><BarChart data={hourlyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='hour' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Bar dataKey='avgTime' fill='#f43f5e' radius={[4,4,0,0]}/></BarChart></CardContent></Card>
            <Card className='dso-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Category Distribution</CardTitle></CardHeader><CardContent><PieChart width={350} height={200}><Pie data={catDist} cx='50%' cy='50%' outerRadius={70} innerRadius={35} dataKey='value' paddingAngle={2}>{catDist.map((_, i) => <Cell key={i} fill={COLORS[i % 8]} />)}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value='stores' className='dso-tab-content space-y-4 mt-4'>
          <ModuleBreadcrumb items={[{ label: 'Dark Store Ops' }, { label: 'Stores' }]} />
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => { setActiveFilters({}); setSearchQuery('') }} totalItems={stores.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder='Search stores by ID, zone, category...' />
          <Card className='dso-table-card bg-zinc-900/60 border-zinc-800'><CardContent className='p-0'><div className='dso-table-wrap overflow-x-auto max-h-[400px] overflow-y-auto'><table className='dso-table w-full text-sm'><thead><tr className='border-b border-zinc-800'><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>ID</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Zone</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Category</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Priority</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Fill Rate</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Delivery</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Orders/hr</th><th className='text-right px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>SKUs</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Status</th></tr></thead><tbody>
          {filtered.map(s => (
            <tr key={s.id} className='dso-table-row border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors'>
              <td className='px-3 py-2 font-mono text-xs text-pink-400'>{s.id}</td>
              <td className='px-3 py-2'><ZoneBadge zone={s.zone} /></td>
              <td className='px-3 py-2 text-xs text-zinc-300'>{s.category}</td>
              <td className='px-3 py-2'><PriorityBadge priority={s.priority} /></td>
              <td className='px-3 py-2 w-24'><FillBar value={s.fill_rate} /><span className='text-[10px] text-zinc-500 ml-1'>{s.fill_rate}%</span></td>
              <td className='px-3 py-2 w-24'><DeliveryBar value={s.delivery_min} /><span className='text-[10px] text-zinc-500 ml-1'>{s.delivery_min}m</span></td>
              <td className='px-3 py-2 text-xs text-zinc-400'>{s.orders_hr}/hr</td>
              <td className='px-3 py-2 text-right text-xs'>{s.sku_count}</td>
              <td className='px-3 py-2'><StatusBadge status={s.status} /></td>
            </tr>
          ))})
          </tbody></table></div></CardContent></Card>
        </TabsContent>
        <TabsContent value='analytics' className='dso-tab-content space-y-4 mt-4'>
          <div className='dso-value-row grid grid-cols-2 lg:grid-cols-4 gap-3'>
            <ValueTile label='Revenue Today' value='INR 42.8L' change='+18% WoW' />
            <ValueTile label='Avg Basket Value' value='INR 487' change='+INR 32' />
            <ValueTile label='Spoilage Rate' value='1.8%' change='-0.4pp' />
            <ValueTile label='Delivery Radius' value='3.2 km' change='+0.5 km' />
          </div>
          <div className='dso-analytics-charts grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <Card className='dso-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Zone Performance</CardTitle></CardHeader><CardContent><BarChart data={ZONES.map((z,i) => ({ name: z.split(' ')[0], fillRate: [94,89,91,87,93,90,88,92][i], onTime: [91,86,93,82,88,85,90,87][i] }))} width={450} height={220}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='name' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Bar dataKey='fillRate' fill='#ec4899' radius={[4,4,0,0]}/><Bar dataKey='onTime' fill='#a855f7' radius={[4,4,0,0]}/></BarChart></CardContent></Card>
            <Card className='dso-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Status Mix</CardTitle></CardHeader><CardContent><PieChart width={450} height={220}><Pie data={[{ name: 'Active', value: 42 }, { name: 'Low Stock', value: 8 }, { name: 'Replenishing', value: 5 }, { name: 'Maintenance', value: 3 }, { name: 'Closed', value: 2 }]} cx='50%' cy='50%' outerRadius={80} innerRadius={40} dataKey='value' paddingAngle={3}>{[<Cell key={0} fill='#10b981' />, <Cell key={1} fill='#ef4444' />, <Cell key={2} fill='#f59e0b' />, <Cell key={3} fill='#f97316' />, <Cell key={4} fill='#71717a' />]}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value='insights' className='dso-tab-content space-y-4 mt-4'>
          {insights.map((ins, i) => (
            <Card key={i} className={'dso-insight-card bg-zinc-900/60 border ' + (ins.severity === 'high' ? 'border-pink-500/30' : ins.severity === 'medium' ? 'border-purple-500/30' : 'border-zinc-800')}><CardContent className='p-4'><div className='flex items-start gap-3'><div className={'dso-insight-dot w-2 h-2 rounded-full mt-1.5 shrink-0 ' + (ins.severity === 'high' ? 'bg-pink-500' : ins.severity === 'medium' ? 'bg-purple-500' : 'bg-zinc-500')} /><div><p className='text-sm font-medium text-zinc-200'>{ins.title}</p><p className='text-xs text-zinc-400 mt-1 leading-relaxed'>{ins.desc}</p></div></div></CardContent></Card>
          ))})
        </TabsContent>
      </Tabs>
    </div>
  )
}
