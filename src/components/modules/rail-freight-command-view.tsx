import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#f97316', '#ef4444', '#eab308', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4']

const CARGO_TYPES = ['Container', 'Bulk Dry', 'Bulk Liquid', 'Auto Rack', 'Intermodal', 'Tank Wagon', 'Flat Bed', 'Refrigerated']
const CORRIDORS = ['Delhi-Mumbai', 'Delhi-Kolkata', 'Mumbai-Chennai', 'Delhi-Chennai', 'Kolkata-Chennai', 'Mumbai-Bangalore', 'Delhi-Bangalore', 'Hyderabad-Mumbai']
const RAILWAYS = ['Indian Railways (IR)', 'DFCCIL (WDFC)', 'DFCCIL (EDFC)', 'CRIS Network', 'CONCOR', 'Dedicated Freight', 'Private Freight', 'Container Corp']
const STATUSES = ['In Transit', 'At Terminal', 'Loading', 'Delayed', 'On Schedule', 'Customs Hold', 'Dispatched']
const PRIORITIES = ['Critical', 'High', 'Medium', 'Low', 'Standard']

const consignments = [
  { id: 'RFC-0001', consignor: 'Consignor 88', consignee: 'Consignee 95', cargo: 'Container', corridor: 'Delhi-Mumbai', railway: 'Indian Railways (IR)', status: 'In Transit', priority: 'Critical', weight: 2003, wagons: 24, eta_hrs: 10, dwell_hrs: 15.8, revenue: 572352, rakeNo: 'RK-5487', origin: 'Delhi', destination: 'Mumbai', updatedAt: '2026-07-18' },
  { id: 'RFC-0002', consignor: 'Consignor 102', consignee: 'Consignee 6', cargo: 'Bulk Dry', corridor: 'Delhi-Kolkata', railway: 'DFCCIL (WDFC)', status: 'At Terminal', priority: 'High', weight: 2550, wagons: 13, eta_hrs: 67, dwell_hrs: 23.1, revenue: 226694, rakeNo: 'RK-4901', origin: 'Delhi', destination: 'Kolkata', updatedAt: '2026-07-07' },
  { id: 'RFC-0003', consignor: 'Consignor 167', consignee: 'Consignee 133', cargo: 'Bulk Liquid', corridor: 'Mumbai-Chennai', railway: 'DFCCIL (EDFC)', status: 'Loading', priority: 'Medium', weight: 1508, wagons: 10, eta_hrs: 33, dwell_hrs: 12.6, revenue: 291549, rakeNo: 'RK-3261', origin: 'Mumbai', destination: 'Chennai', updatedAt: '2026-07-16' },
  { id: 'RFC-0004', consignor: 'Consignor 52', consignee: 'Consignee 179', cargo: 'Auto Rack', corridor: 'Delhi-Chennai', railway: 'CRIS Network', status: 'Delayed', priority: 'Low', weight: 312, wagons: 31, eta_hrs: 59, dwell_hrs: 22.4, revenue: 481458, rakeNo: 'RK-3505', origin: 'Delhi', destination: 'Chennai', updatedAt: '2026-07-19' },
  { id: 'RFC-0005', consignor: 'Consignor 117', consignee: 'Consignee 21', cargo: 'Intermodal', corridor: 'Kolkata-Chennai', railway: 'CONCOR', status: 'On Schedule', priority: 'Standard', weight: 3300, wagons: 7, eta_hrs: 51, dwell_hrs: 4.9, revenue: 398525, rakeNo: 'RK-8432', origin: 'Kolkata', destination: 'Chennai', updatedAt: '2026-07-15' },
  { id: 'RFC-0006', consignor: 'Consignor 6', consignee: 'Consignee 182', cargo: 'Tank Wagon', corridor: 'Mumbai-Bangalore', railway: 'Dedicated Freight', status: 'Customs Hold', priority: 'Critical', weight: 1830, wagons: 24, eta_hrs: 5, dwell_hrs: 21.0, revenue: 281100, rakeNo: 'RK-2949', origin: 'Mumbai', destination: 'Bangalore', updatedAt: '2026-07-18' },
  { id: 'RFC-0007', consignor: 'Consignor 144', consignee: 'Consignee 39', cargo: 'Flat Bed', corridor: 'Delhi-Bangalore', railway: 'Private Freight', status: 'Dispatched', priority: 'High', weight: 2592, wagons: 3, eta_hrs: 59, dwell_hrs: 12.3, revenue: 655447, rakeNo: 'RK-4114', origin: 'Delhi', destination: 'Bangalore', updatedAt: '2026-07-11' },
  { id: 'RFC-0008', consignor: 'Consignor 106', consignee: 'Consignee 198', cargo: 'Refrigerated', corridor: 'Hyderabad-Mumbai', railway: 'Container Corp', status: 'In Transit', priority: 'Medium', weight: 2046, wagons: 9, eta_hrs: 21, dwell_hrs: 1.2, revenue: 84103, rakeNo: 'RK-6460', origin: 'Hyderabad', destination: 'Mumbai', updatedAt: '2026-07-09' },
  { id: 'RFC-0009', consignor: 'Consignor 197', consignee: 'Consignee 159', cargo: 'Container', corridor: 'Delhi-Mumbai', railway: 'Indian Railways (IR)', status: 'At Terminal', priority: 'Low', weight: 182, wagons: 45, eta_hrs: 39, dwell_hrs: 4.9, revenue: 617967, rakeNo: 'RK-4672', origin: 'Delhi', destination: 'Mumbai', updatedAt: '2026-07-05' },
  { id: 'RFC-0010', consignor: 'Consignor 57', consignee: 'Consignee 67', cargo: 'Bulk Dry', corridor: 'Delhi-Kolkata', railway: 'DFCCIL (WDFC)', status: 'Loading', priority: 'Standard', weight: 2647, wagons: 28, eta_hrs: 4, dwell_hrs: 10.0, revenue: 656393, rakeNo: 'RK-7959', origin: 'Delhi', destination: 'Kolkata', updatedAt: '2026-07-17' },
  { id: 'RFC-0011', consignor: 'Consignor 54', consignee: 'Consignee 40', cargo: 'Bulk Liquid', corridor: 'Mumbai-Chennai', railway: 'DFCCIL (EDFC)', status: 'Delayed', priority: 'Critical', weight: 1993, wagons: 10, eta_hrs: 65, dwell_hrs: 7.0, revenue: 414902, rakeNo: 'RK-4991', origin: 'Mumbai', destination: 'Chennai', updatedAt: '2026-07-24' },
  { id: 'RFC-0012', consignor: 'Consignor 184', consignee: 'Consignee 187', cargo: 'Auto Rack', corridor: 'Delhi-Chennai', railway: 'CRIS Network', status: 'On Schedule', priority: 'High', weight: 116, wagons: 42, eta_hrs: 36, dwell_hrs: 17.2, revenue: 202844, rakeNo: 'RK-6613', origin: 'Delhi', destination: 'Chennai', updatedAt: '2026-07-09' },
  { id: 'RFC-0013', consignor: 'Consignor 190', consignee: 'Consignee 62', cargo: 'Intermodal', corridor: 'Kolkata-Chennai', railway: 'CONCOR', status: 'Customs Hold', priority: 'Medium', weight: 2006, wagons: 14, eta_hrs: 53, dwell_hrs: 16.9, revenue: 102875, rakeNo: 'RK-6325', origin: 'Kolkata', destination: 'Chennai', updatedAt: '2026-07-17' },
  { id: 'RFC-0014', consignor: 'Consignor 7', consignee: 'Consignee 85', cargo: 'Tank Wagon', corridor: 'Mumbai-Bangalore', railway: 'Dedicated Freight', status: 'Dispatched', priority: 'Low', weight: 3387, wagons: 5, eta_hrs: 26, dwell_hrs: 15.9, revenue: 482535, rakeNo: 'RK-5997', origin: 'Mumbai', destination: 'Bangalore', updatedAt: '2026-07-17' },
  { id: 'RFC-0015', consignor: 'Consignor 195', consignee: 'Consignee 125', cargo: 'Flat Bed', corridor: 'Delhi-Bangalore', railway: 'Private Freight', status: 'In Transit', priority: 'Standard', weight: 1745, wagons: 27, eta_hrs: 62, dwell_hrs: 22.0, revenue: 337266, rakeNo: 'RK-3866', origin: 'Delhi', destination: 'Bangalore', updatedAt: '2026-07-12' },
  { id: 'RFC-0016', consignor: 'Consignor 1', consignee: 'Consignee 31', cargo: 'Refrigerated', corridor: 'Hyderabad-Mumbai', railway: 'Container Corp', status: 'At Terminal', priority: 'Critical', weight: 2089, wagons: 29, eta_hrs: 38, dwell_hrs: 4.9, revenue: 193433, rakeNo: 'RK-6525', origin: 'Hyderabad', destination: 'Mumbai', updatedAt: '2026-07-21' },
  { id: 'RFC-0017', consignor: 'Consignor 41', consignee: 'Consignee 108', cargo: 'Container', corridor: 'Delhi-Mumbai', railway: 'Indian Railways (IR)', status: 'Loading', priority: 'High', weight: 2386, wagons: 32, eta_hrs: 3, dwell_hrs: 9.3, revenue: 263308, rakeNo: 'RK-2862', origin: 'Delhi', destination: 'Mumbai', updatedAt: '2026-07-08' },
  { id: 'RFC-0018', consignor: 'Consignor 77', consignee: 'Consignee 76', cargo: 'Bulk Dry', corridor: 'Delhi-Kolkata', railway: 'DFCCIL (WDFC)', status: 'Delayed', priority: 'Medium', weight: 3442, wagons: 37, eta_hrs: 36, dwell_hrs: 23.8, revenue: 340567, rakeNo: 'RK-3242', origin: 'Delhi', destination: 'Kolkata', updatedAt: '2026-07-23' },
  { id: 'RFC-0019', consignor: 'Consignor 145', consignee: 'Consignee 182', cargo: 'Bulk Liquid', corridor: 'Mumbai-Chennai', railway: 'DFCCIL (EDFC)', status: 'On Schedule', priority: 'Low', weight: 3390, wagons: 34, eta_hrs: 19, dwell_hrs: 20.6, revenue: 670520, rakeNo: 'RK-6306', origin: 'Mumbai', destination: 'Chennai', updatedAt: '2026-07-05' },
  { id: 'RFC-0020', consignor: 'Consignor 90', consignee: 'Consignee 113', cargo: 'Auto Rack', corridor: 'Delhi-Chennai', railway: 'CRIS Network', status: 'Customs Hold', priority: 'Standard', weight: 3201, wagons: 11, eta_hrs: 41, dwell_hrs: 5.7, revenue: 74653, rakeNo: 'RK-4316', origin: 'Delhi', destination: 'Chennai', updatedAt: '2026-07-18' },
  { id: 'RFC-0021', consignor: 'Consignor 190', consignee: 'Consignee 123', cargo: 'Intermodal', corridor: 'Kolkata-Chennai', railway: 'CONCOR', status: 'Dispatched', priority: 'Critical', weight: 2633, wagons: 24, eta_hrs: 72, dwell_hrs: 2.8, revenue: 693552, rakeNo: 'RK-9381', origin: 'Kolkata', destination: 'Chennai', updatedAt: '2026-07-21' },
  { id: 'RFC-0022', consignor: 'Consignor 96', consignee: 'Consignee 80', cargo: 'Tank Wagon', corridor: 'Mumbai-Bangalore', railway: 'Dedicated Freight', status: 'In Transit', priority: 'High', weight: 899, wagons: 29, eta_hrs: 32, dwell_hrs: 22.5, revenue: 375557, rakeNo: 'RK-2906', origin: 'Mumbai', destination: 'Bangalore', updatedAt: '2026-07-13' },
  { id: 'RFC-0023', consignor: 'Consignor 55', consignee: 'Consignee 106', cargo: 'Flat Bed', corridor: 'Delhi-Bangalore', railway: 'Private Freight', status: 'At Terminal', priority: 'Medium', weight: 780, wagons: 19, eta_hrs: 54, dwell_hrs: 8.4, revenue: 796518, rakeNo: 'RK-7226', origin: 'Delhi', destination: 'Bangalore', updatedAt: '2026-07-25' },
  { id: 'RFC-0024', consignor: 'Consignor 102', consignee: 'Consignee 200', cargo: 'Refrigerated', corridor: 'Hyderabad-Mumbai', railway: 'Container Corp', status: 'Loading', priority: 'Low', weight: 211, wagons: 12, eta_hrs: 27, dwell_hrs: 3.4, revenue: 573263, rakeNo: 'RK-5767', origin: 'Hyderabad', destination: 'Mumbai', updatedAt: '2026-07-22' },
  { id: 'RFC-0025', consignor: 'Consignor 11', consignee: 'Consignee 113', cargo: 'Container', corridor: 'Delhi-Mumbai', railway: 'Indian Railways (IR)', status: 'Delayed', priority: 'Standard', weight: 2551, wagons: 16, eta_hrs: 56, dwell_hrs: 0.5, revenue: 122925, rakeNo: 'RK-2380', origin: 'Delhi', destination: 'Mumbai', updatedAt: '2026-07-12' },
  { id: 'RFC-0026', consignor: 'Consignor 27', consignee: 'Consignee 61', cargo: 'Bulk Dry', corridor: 'Delhi-Kolkata', railway: 'DFCCIL (WDFC)', status: 'On Schedule', priority: 'Critical', weight: 68, wagons: 26, eta_hrs: 17, dwell_hrs: 23.0, revenue: 370052, rakeNo: 'RK-9261', origin: 'Delhi', destination: 'Kolkata', updatedAt: '2026-07-25' },
  { id: 'RFC-0027', consignor: 'Consignor 78', consignee: 'Consignee 29', cargo: 'Bulk Liquid', corridor: 'Mumbai-Chennai', railway: 'DFCCIL (EDFC)', status: 'Customs Hold', priority: 'High', weight: 3167, wagons: 6, eta_hrs: 47, dwell_hrs: 9.4, revenue: 697853, rakeNo: 'RK-3131', origin: 'Mumbai', destination: 'Chennai', updatedAt: '2026-07-09' },
  { id: 'RFC-0028', consignor: 'Consignor 105', consignee: 'Consignee 28', cargo: 'Auto Rack', corridor: 'Delhi-Chennai', railway: 'CRIS Network', status: 'Dispatched', priority: 'Medium', weight: 1230, wagons: 34, eta_hrs: 62, dwell_hrs: 9.4, revenue: 365397, rakeNo: 'RK-7402', origin: 'Delhi', destination: 'Chennai', updatedAt: '2026-07-11' },
  { id: 'RFC-0029', consignor: 'Consignor 19', consignee: 'Consignee 81', cargo: 'Intermodal', corridor: 'Kolkata-Chennai', railway: 'CONCOR', status: 'In Transit', priority: 'Low', weight: 608, wagons: 31, eta_hrs: 59, dwell_hrs: 6.9, revenue: 479966, rakeNo: 'RK-5295', origin: 'Kolkata', destination: 'Chennai', updatedAt: '2026-07-21' },
  { id: 'RFC-0030', consignor: 'Consignor 5', consignee: 'Consignee 53', cargo: 'Tank Wagon', corridor: 'Mumbai-Bangalore', railway: 'Dedicated Freight', status: 'At Terminal', priority: 'Standard', weight: 2572, wagons: 37, eta_hrs: 55, dwell_hrs: 17.9, revenue: 461111, rakeNo: 'RK-8443', origin: 'Mumbai', destination: 'Bangalore', updatedAt: '2026-07-10' },
  { id: 'RFC-0031', consignor: 'Consignor 199', consignee: 'Consignee 114', cargo: 'Flat Bed', corridor: 'Delhi-Bangalore', railway: 'Private Freight', status: 'Loading', priority: 'Critical', weight: 1788, wagons: 41, eta_hrs: 16, dwell_hrs: 4.8, revenue: 549334, rakeNo: 'RK-2112', origin: 'Delhi', destination: 'Bangalore', updatedAt: '2026-07-27' },
  { id: 'RFC-0032', consignor: 'Consignor 77', consignee: 'Consignee 52', cargo: 'Refrigerated', corridor: 'Hyderabad-Mumbai', railway: 'Container Corp', status: 'Delayed', priority: 'High', weight: 434, wagons: 13, eta_hrs: 57, dwell_hrs: 17.6, revenue: 718733, rakeNo: 'RK-3922', origin: 'Hyderabad', destination: 'Mumbai', updatedAt: '2026-07-04' },
  { id: 'RFC-0033', consignor: 'Consignor 84', consignee: 'Consignee 79', cargo: 'Container', corridor: 'Delhi-Mumbai', railway: 'Indian Railways (IR)', status: 'On Schedule', priority: 'Medium', weight: 1607, wagons: 30, eta_hrs: 31, dwell_hrs: 17.7, revenue: 680811, rakeNo: 'RK-4452', origin: 'Delhi', destination: 'Mumbai', updatedAt: '2026-07-16' },
  { id: 'RFC-0034', consignor: 'Consignor 87', consignee: 'Consignee 86', cargo: 'Bulk Dry', corridor: 'Delhi-Kolkata', railway: 'DFCCIL (WDFC)', status: 'Customs Hold', priority: 'Low', weight: 1033, wagons: 17, eta_hrs: 36, dwell_hrs: 4.4, revenue: 652196, rakeNo: 'RK-5453', origin: 'Delhi', destination: 'Kolkata', updatedAt: '2026-07-19' },
  { id: 'RFC-0035', consignor: 'Consignor 48', consignee: 'Consignee 21', cargo: 'Bulk Liquid', corridor: 'Mumbai-Chennai', railway: 'DFCCIL (EDFC)', status: 'Dispatched', priority: 'Standard', weight: 142, wagons: 42, eta_hrs: 53, dwell_hrs: 22.0, revenue: 718565, rakeNo: 'RK-3083', origin: 'Mumbai', destination: 'Chennai', updatedAt: '2026-07-13' },
  { id: 'RFC-0036', consignor: 'Consignor 192', consignee: 'Consignee 150', cargo: 'Auto Rack', corridor: 'Delhi-Chennai', railway: 'CRIS Network', status: 'In Transit', priority: 'Critical', weight: 2915, wagons: 45, eta_hrs: 53, dwell_hrs: 1.5, revenue: 715852, rakeNo: 'RK-8140', origin: 'Delhi', destination: 'Chennai', updatedAt: '2026-07-08' },
  { id: 'RFC-0037', consignor: 'Consignor 164', consignee: 'Consignee 164', cargo: 'Intermodal', corridor: 'Kolkata-Chennai', railway: 'CONCOR', status: 'At Terminal', priority: 'High', weight: 1807, wagons: 3, eta_hrs: 23, dwell_hrs: 8.3, revenue: 572394, rakeNo: 'RK-8833', origin: 'Kolkata', destination: 'Chennai', updatedAt: '2026-07-23' },
  { id: 'RFC-0038', consignor: 'Consignor 123', consignee: 'Consignee 128', cargo: 'Tank Wagon', corridor: 'Mumbai-Bangalore', railway: 'Dedicated Freight', status: 'Loading', priority: 'Medium', weight: 2672, wagons: 33, eta_hrs: 14, dwell_hrs: 2.6, revenue: 741059, rakeNo: 'RK-3072', origin: 'Mumbai', destination: 'Bangalore', updatedAt: '2026-07-13' },
  { id: 'RFC-0039', consignor: 'Consignor 189', consignee: 'Consignee 166', cargo: 'Flat Bed', corridor: 'Delhi-Bangalore', railway: 'Private Freight', status: 'Delayed', priority: 'Low', weight: 1789, wagons: 8, eta_hrs: 21, dwell_hrs: 20.3, revenue: 366713, rakeNo: 'RK-1743', origin: 'Delhi', destination: 'Bangalore', updatedAt: '2026-07-10' },
  { id: 'RFC-0040', consignor: 'Consignor 68', consignee: 'Consignee 173', cargo: 'Refrigerated', corridor: 'Hyderabad-Mumbai', railway: 'Container Corp', status: 'On Schedule', priority: 'Standard', weight: 1998, wagons: 29, eta_hrs: 26, dwell_hrs: 17.2, revenue: 431387, rakeNo: 'RK-1064', origin: 'Hyderabad', destination: 'Mumbai', updatedAt: '2026-07-15' },
  { id: 'RFC-0041', consignor: 'Consignor 50', consignee: 'Consignee 98', cargo: 'Container', corridor: 'Delhi-Mumbai', railway: 'Indian Railways (IR)', status: 'Customs Hold', priority: 'Critical', weight: 2107, wagons: 38, eta_hrs: 22, dwell_hrs: 15.2, revenue: 593469, rakeNo: 'RK-4058', origin: 'Delhi', destination: 'Mumbai', updatedAt: '2026-07-21' },
  { id: 'RFC-0042', consignor: 'Consignor 138', consignee: 'Consignee 127', cargo: 'Bulk Dry', corridor: 'Delhi-Kolkata', railway: 'DFCCIL (WDFC)', status: 'Dispatched', priority: 'High', weight: 220, wagons: 22, eta_hrs: 65, dwell_hrs: 23.0, revenue: 495375, rakeNo: 'RK-2271', origin: 'Delhi', destination: 'Kolkata', updatedAt: '2026-07-17' },
  { id: 'RFC-0043', consignor: 'Consignor 190', consignee: 'Consignee 87', cargo: 'Bulk Liquid', corridor: 'Mumbai-Chennai', railway: 'DFCCIL (EDFC)', status: 'In Transit', priority: 'Medium', weight: 3476, wagons: 39, eta_hrs: 37, dwell_hrs: 21.4, revenue: 202050, rakeNo: 'RK-8697', origin: 'Mumbai', destination: 'Chennai', updatedAt: '2026-07-08' },
  { id: 'RFC-0044', consignor: 'Consignor 43', consignee: 'Consignee 18', cargo: 'Auto Rack', corridor: 'Delhi-Chennai', railway: 'CRIS Network', status: 'At Terminal', priority: 'Low', weight: 1385, wagons: 13, eta_hrs: 64, dwell_hrs: 12.6, revenue: 273160, rakeNo: 'RK-7924', origin: 'Delhi', destination: 'Chennai', updatedAt: '2026-07-06' },
  { id: 'RFC-0045', consignor: 'Consignor 4', consignee: 'Consignee 149', cargo: 'Intermodal', corridor: 'Kolkata-Chennai', railway: 'CONCOR', status: 'Loading', priority: 'Standard', weight: 1370, wagons: 12, eta_hrs: 47, dwell_hrs: 5.7, revenue: 780919, rakeNo: 'RK-6662', origin: 'Kolkata', destination: 'Chennai', updatedAt: '2026-07-28' },
  { id: 'RFC-0046', consignor: 'Consignor 106', consignee: 'Consignee 65', cargo: 'Tank Wagon', corridor: 'Mumbai-Bangalore', railway: 'Dedicated Freight', status: 'Delayed', priority: 'Critical', weight: 395, wagons: 13, eta_hrs: 49, dwell_hrs: 20.1, revenue: 551354, rakeNo: 'RK-8359', origin: 'Mumbai', destination: 'Bangalore', updatedAt: '2026-07-03' },
  { id: 'RFC-0047', consignor: 'Consignor 15', consignee: 'Consignee 182', cargo: 'Flat Bed', corridor: 'Delhi-Bangalore', railway: 'Private Freight', status: 'On Schedule', priority: 'High', weight: 2910, wagons: 14, eta_hrs: 30, dwell_hrs: 13.9, revenue: 565304, rakeNo: 'RK-2617', origin: 'Delhi', destination: 'Bangalore', updatedAt: '2026-07-22' },
  { id: 'RFC-0048', consignor: 'Consignor 67', consignee: 'Consignee 111', cargo: 'Refrigerated', corridor: 'Hyderabad-Mumbai', railway: 'Container Corp', status: 'Customs Hold', priority: 'Medium', weight: 2645, wagons: 6, eta_hrs: 6, dwell_hrs: 13.9, revenue: 536361, rakeNo: 'RK-6419', origin: 'Hyderabad', destination: 'Mumbai', updatedAt: '2026-07-03' },
  { id: 'RFC-0049', consignor: 'Consignor 1', consignee: 'Consignee 92', cargo: 'Container', corridor: 'Delhi-Mumbai', railway: 'Indian Railways (IR)', status: 'Dispatched', priority: 'Low', weight: 1160, wagons: 5, eta_hrs: 49, dwell_hrs: 12.3, revenue: 680285, rakeNo: 'RK-3963', origin: 'Delhi', destination: 'Mumbai', updatedAt: '2026-07-11' },
  { id: 'RFC-0050', consignor: 'Consignor 169', consignee: 'Consignee 141', cargo: 'Bulk Dry', corridor: 'Delhi-Kolkata', railway: 'DFCCIL (WDFC)', status: 'In Transit', priority: 'Standard', weight: 3455, wagons: 34, eta_hrs: 49, dwell_hrs: 8.4, revenue: 610293, rakeNo: 'RK-9439', origin: 'Delhi', destination: 'Kolkata', updatedAt: '2026-07-10' },
  { id: 'RFC-0051', consignor: 'Consignor 139', consignee: 'Consignee 1', cargo: 'Bulk Liquid', corridor: 'Mumbai-Chennai', railway: 'DFCCIL (EDFC)', status: 'At Terminal', priority: 'Critical', weight: 480, wagons: 39, eta_hrs: 21, dwell_hrs: 10.3, revenue: 176668, rakeNo: 'RK-3732', origin: 'Mumbai', destination: 'Chennai', updatedAt: '2026-07-08' },
  { id: 'RFC-0052', consignor: 'Consignor 69', consignee: 'Consignee 13', cargo: 'Auto Rack', corridor: 'Delhi-Chennai', railway: 'CRIS Network', status: 'Loading', priority: 'High', weight: 3350, wagons: 10, eta_hrs: 10, dwell_hrs: 22.1, revenue: 523541, rakeNo: 'RK-4472', origin: 'Delhi', destination: 'Chennai', updatedAt: '2026-07-21' },
  { id: 'RFC-0053', consignor: 'Consignor 150', consignee: 'Consignee 155', cargo: 'Intermodal', corridor: 'Kolkata-Chennai', railway: 'CONCOR', status: 'Delayed', priority: 'Medium', weight: 2567, wagons: 13, eta_hrs: 59, dwell_hrs: 13.3, revenue: 412887, rakeNo: 'RK-4256', origin: 'Kolkata', destination: 'Chennai', updatedAt: '2026-07-17' },
  { id: 'RFC-0054', consignor: 'Consignor 122', consignee: 'Consignee 27', cargo: 'Tank Wagon', corridor: 'Mumbai-Bangalore', railway: 'Dedicated Freight', status: 'On Schedule', priority: 'Low', weight: 1182, wagons: 14, eta_hrs: 26, dwell_hrs: 13.7, revenue: 504217, rakeNo: 'RK-1498', origin: 'Mumbai', destination: 'Bangalore', updatedAt: '2026-07-10' },
  { id: 'RFC-0055', consignor: 'Consignor 14', consignee: 'Consignee 165', cargo: 'Flat Bed', corridor: 'Delhi-Bangalore', railway: 'Private Freight', status: 'Customs Hold', priority: 'Standard', weight: 1800, wagons: 9, eta_hrs: 23, dwell_hrs: 16.7, revenue: 550332, rakeNo: 'RK-5438', origin: 'Delhi', destination: 'Bangalore', updatedAt: '2026-07-06' },
  { id: 'RFC-0056', consignor: 'Consignor 56', consignee: 'Consignee 43', cargo: 'Refrigerated', corridor: 'Hyderabad-Mumbai', railway: 'Container Corp', status: 'Dispatched', priority: 'Critical', weight: 3039, wagons: 16, eta_hrs: 12, dwell_hrs: 9.0, revenue: 218868, rakeNo: 'RK-7358', origin: 'Hyderabad', destination: 'Mumbai', updatedAt: '2026-07-27' },
  { id: 'RFC-0057', consignor: 'Consignor 64', consignee: 'Consignee 100', cargo: 'Container', corridor: 'Delhi-Mumbai', railway: 'Indian Railways (IR)', status: 'In Transit', priority: 'High', weight: 1201, wagons: 29, eta_hrs: 2, dwell_hrs: 1.9, revenue: 269545, rakeNo: 'RK-8767', origin: 'Delhi', destination: 'Mumbai', updatedAt: '2026-07-04' },
  { id: 'RFC-0058', consignor: 'Consignor 129', consignee: 'Consignee 54', cargo: 'Bulk Dry', corridor: 'Delhi-Kolkata', railway: 'DFCCIL (WDFC)', status: 'At Terminal', priority: 'Medium', weight: 1550, wagons: 5, eta_hrs: 22, dwell_hrs: 22.5, revenue: 521889, rakeNo: 'RK-8876', origin: 'Delhi', destination: 'Kolkata', updatedAt: '2026-07-22' },
  { id: 'RFC-0059', consignor: 'Consignor 65', consignee: 'Consignee 2', cargo: 'Bulk Liquid', corridor: 'Mumbai-Chennai', railway: 'DFCCIL (EDFC)', status: 'Loading', priority: 'Low', weight: 763, wagons: 27, eta_hrs: 66, dwell_hrs: 3.3, revenue: 259661, rakeNo: 'RK-4375', origin: 'Mumbai', destination: 'Chennai', updatedAt: '2026-07-22' },
  { id: 'RFC-0060', consignor: 'Consignor 85', consignee: 'Consignee 86', cargo: 'Auto Rack', corridor: 'Delhi-Chennai', railway: 'CRIS Network', status: 'Delayed', priority: 'Standard', weight: 2521, wagons: 37, eta_hrs: 2, dwell_hrs: 14.9, revenue: 403376, rakeNo: 'RK-7635', origin: 'Delhi', destination: 'Chennai', updatedAt: '2026-07-27' },
]

const monthlyData = [
  { month: 'Jan', tons: 1103, rakes: 75, utilization: 78.3 },
  { month: 'Feb', tons: 2008, rakes: 94, utilization: 85.7 },
  { month: 'Mar', tons: 1884, rakes: 128, utilization: 72.4 },
  { month: 'Apr', tons: 1164, rakes: 74, utilization: 91.2 },
  { month: 'May', tons: 1520, rakes: 144, utilization: 68.9 },
  { month: 'Jun', tons: 1826, rakes: 109, utilization: 83.5 },
  { month: 'Jul', tons: 2284, rakes: 80, utilization: 76.1 },
  { month: 'Aug', tons: 1361, rakes: 143, utilization: 88.4 },
  { month: 'Sep', tons: 811, rakes: 104, utilization: 94.6 },
  { month: 'Oct', tons: 2219, rakes: 51, utilization: 79.8 },
  { month: 'Nov', tons: 2400, rakes: 94, utilization: 87.3 },
  { month: 'Dec', tons: 2006, rakes: 125, utilization: 71.5 },
]

const cargoDist = [
  { name: 'Container', value: 32 },
  { name: 'Bulk Dry', value: 44 },
  { name: 'Bulk Liquid', value: 85 },
  { name: 'Auto Rack', value: 98 },
  { name: 'Intermodal', value: 65 },
  { name: 'Tank Wagon', value: 42 },
  { name: 'Flat Bed', value: 73 },
  { name: 'Refrigerated', value: 82 },
]

const filterGroups = [
  { key: 'cargo', label: 'Cargo Type', options: CARGO_TYPES.map(c => ({ value: c, label: c, count: 0 })) },
  { key: 'status', label: 'Status', options: STATUSES.map(s => ({ value: s, label: s, count: 0 })) },
  { key: 'priority', label: 'Priority', options: PRIORITIES.map(p => ({ value: p, label: p, count: 0 })) },
]

function CargoBadge({ cargo }: { cargo: string }) {
  const color = cargo === 'Container' ? 'bg-orange-500/15 text-orange-400' : cargo === 'Bulk Dry' ? 'bg-amber-500/15 text-amber-400' : cargo === 'Bulk Liquid' ? 'bg-blue-500/15 text-blue-400' : cargo === 'Auto Rack' ? 'bg-red-500/15 text-red-400' : cargo === 'Intermodal' ? 'bg-violet-500/15 text-violet-400' : cargo === 'Tank Wagon' ? 'bg-cyan-500/15 text-cyan-400' : cargo === 'Refrigerated' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-zinc-500/15 text-zinc-400'
  return <span className={'rfc-cargo-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{cargo}</span>
}

function StatusBadge({ status }: { status: string }) {
  const color = status === 'In Transit' ? 'bg-blue-500/15 text-blue-400' : status === 'At Terminal' ? 'bg-amber-500/15 text-amber-400' : status === 'Delayed' ? 'bg-red-500/15 text-red-400' : status === 'On Schedule' ? 'bg-emerald-500/15 text-emerald-400' : status === 'Customs Hold' ? 'bg-violet-500/15 text-violet-400' : status === 'Loading' ? 'bg-cyan-500/15 text-cyan-400' : 'bg-zinc-500/15 text-zinc-400'
  return <span className={'rfc-status-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{status}</span>
}

function PriorityBadge({ priority }: { priority: string }) {
  const color = priority === 'Critical' ? 'bg-red-500/15 text-red-400' : priority === 'High' ? 'bg-orange-500/15 text-orange-400' : priority === 'Medium' ? 'bg-amber-500/15 text-amber-400' : priority === 'Low' ? 'bg-blue-500/15 text-blue-400' : 'bg-zinc-500/15 text-zinc-400'
  return <span className={'rfc-priority-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{priority}</span>
}

function WeightBar({ value, max }: { value: number; max: number }) {
  const w = Math.round(value / max * 100)
  return <div className='rfc-wt-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className='h-full rounded-full bg-orange-500 rfc-wt-fill' style={{ width: w + '%', animation: 'rfc-grow 1s ease-out' }}/></div>
}

function EtaBar({ value }: { value: number }) {
  const w = Math.min(value * 1.5, 100)
  const color = value > 48 ? 'bg-red-500' : value > 24 ? 'bg-amber-500' : 'bg-emerald-500'
  return <div className='rfc-eta-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className={'h-full rounded-full rfc-eta-fill ' + color} style={{ width: w + '%', animation: 'rfc-grow 1s ease-out' }}/></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, c = 2 * Math.PI * r, offset = c - (value / 100) * c
  return <div className='rfc-ring flex flex-col items-center'><svg width='70' height='70' className='-rotate-90'><circle cx='35' cy='35' r={r} fill='none' stroke='#27272a' strokeWidth='5'/><circle cx='35' cy='35' r={r} fill='none' stroke={color} strokeWidth='5' strokeDasharray={c} strokeDashoffset={offset} strokeLinecap='round' className='rfc-ring-path' style={{ transition: 'stroke-dashoffset 1s ease' }}/></svg><span className='rfc-ring-val text-sm font-bold mt-1' style={{ color }}>{value}%</span><span className='rfc-ring-label text-[10px] text-zinc-500'>{label}</span></div>
}

function KpiTile({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return <div className='rfc-kpi bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 rfc-kpi-card'><p className='text-xs text-zinc-500 mb-1'>{label}</p><p className={'text-xl font-bold ' + color}>{value}</p><p className='text-[10px] text-zinc-400 mt-1'>{sub}</p></div>
}

function ValueTile({ label, value, change }: { label: string; value: string; change: string }) {
  const up = change.startsWith('+')
  return <div className='rfc-value-tile bg-zinc-900/60 border border-zinc-800 rounded-lg p-3'><p className='text-xs text-zinc-500'>{label}</p><p className='text-lg font-bold text-white mt-1'>{value}</p><p className={'text-xs mt-1 ' + (up ? 'text-emerald-400' : 'text-red-400')}>{change}</p></div>
}

const insights = [
  { title: 'WDFC Congestion Alert', desc: 'Western Dedicated Freight Corridor experiencing 35% delay between Rewari and Vadodara. 12 consignments rerouted via old IR network. ETD recovery expected within 48 hours.', severity: 'high' },
  { title: 'Monsoon Disruption', desc: 'Mumbai-Chennai corridor affected by heavy rainfall. 8 rakes held at Pune terminal. Intermodal switch to road for time-critical cargo recommended.', severity: 'high' },
  { title: 'Container Volume Spike', desc: 'Nhava Sheva to Delhi container volumes up 22% month-over-month. Pre-position additional flat wagons at Dadri terminal to handle surge.', severity: 'medium' },
  { title: 'DFCCIL Integration Win', desc: 'Eastern DFC onboarding complete. 15 new consignors registered. Avg transit time Kolkata-Delhi reduced from 36h to 28h. Revenue impact: +INR 2.4Cr.', severity: 'low' },
]

const corridorChartData = [{ name: 'Delhi-Mumbai', tons: 901, revenue: 14 }, { name: 'Delhi-Kolkata', tons: 950, revenue: 47 }, { name: 'Mumbai-Chennai', tons: 410, revenue: 30 }, { name: 'Delhi-Chennai', tons: 1642, revenue: 59 }, { name: 'Kolkata-Chennai', tons: 867, revenue: 70 }, { name: 'Mumbai-Bangalore', tons: 1473, revenue: 89 }, { name: 'Delhi-Bangalore', tons: 686, revenue: 49 }, { name: 'Hyderabad-Mumbai', tons: 1627, revenue: 92 }]

export default function RailFreightCommandView() {
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

  const filtered = consignments.filter(c => {
    for (const [key, vals] of Object.entries(activeFilters)) {
      if (vals.length > 0 && !vals.includes(c[key as keyof typeof c] as string)) return false
    }
    if (searchQuery && !Object.values(c).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))) return false
    return true
  })

  return (
    <div className='rfc-root space-y-4 p-4'>
      <PageHeader title='Rail Freight Command' description='Indian rail freight operations & dedicated corridor management' />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className='rfc-tabs-list bg-zinc-900 border border-zinc-800'>
          <TabsTrigger value='dashboard' className='rfc-tab'>Dashboard</TabsTrigger>
          <TabsTrigger value='consignments' className='rfc-tab'>Consignments</TabsTrigger>
          <TabsTrigger value='analytics' className='rfc-tab'>Analytics</TabsTrigger>
          <TabsTrigger value='insights' className='rfc-tab'>Insights</TabsTrigger>
        </TabsList>

        <TabsContent value='dashboard' className='rfc-tab-content space-y-4 mt-4'>
          <div className='rfc-kpi-row grid grid-cols-2 lg:grid-cols-4 gap-3'>
            <KpiTile label='Active Rakes' value='247' sub='+18 vs yesterday' color='text-orange-400' />
            <KpiTile label='Avg Transit Time' value='32h' sub='-4h improvement' color='text-red-400' />
            <KpiTile label='Tonnage (MTD)' value='18.5K' sub='+22% vs last month' color='text-amber-400' />
            <KpiTile label='Revenue (Cr)' value='42.7' sub='+8% QoQ' color='text-blue-400' />
          </div>
          <div className='rfc-ring-row flex flex-wrap justify-around gap-2'>
            <HealthRing value={82} label='On-Time' color='#f97316' />
            <HealthRing value={88} label='Utilization' color='#ef4444' />
            <HealthRing value={91} label='Capacity' color='#eab308' />
            <HealthRing value={74} label='Speed' color='#3b82f6' />
            <HealthRing value={86} label='Reliability' color='#10b981' />
            <HealthRing value={79} label='Cost Eff' color='#8b5cf6' />
          </div>
          <div className='rfc-chart-row grid grid-cols-1 lg:grid-cols-3 gap-4'>
            <Card className='rfc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Monthly Tonnage</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='month' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Line type='monotone' dataKey='tons' stroke='#f97316' strokeWidth={2} dot={false}/><Line type='monotone' dataKey='rakes' stroke='#ef4444' strokeWidth={2} dot={false}/></LineChart></CardContent></Card>
            <Card className='rfc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Corridor Utilization</CardTitle></CardHeader><CardContent><BarChart data={monthlyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='month' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Bar dataKey='utilization' fill='#eab308' radius={[4,4,0,0]}/></BarChart></CardContent></Card>
            <Card className='rfc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Cargo Distribution</CardTitle></CardHeader><CardContent><PieChart width={350} height={200}><Pie data={cargoDist} cx='50%' cy='50%' outerRadius={70} innerRadius={35} dataKey='value' paddingAngle={2}>{cargoDist.map((_, i) => <Cell key={i} fill={COLORS[i % 8]} />)}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value='consignments' className='rfc-tab-content space-y-4 mt-4'>
          <ModuleBreadcrumb items={[{ label: 'Rail Freight' }, { label: 'Consignments' }]} />
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => { setActiveFilters({}); setSearchQuery('') }} totalItems={consignments.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder='Search by ID, rake, corridor...' />
          <Card className='rfc-table-card bg-zinc-900/60 border-zinc-800'><CardContent className='p-0'><div className='rfc-table-wrap overflow-x-auto'><table className='rfc-table w-full text-sm'><thead><tr className='border-b border-zinc-800'><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>ID</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Rake</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Corridor</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Cargo</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Priority</th><th className='text-right px-3 py-2 text-zinc-500 text-xs font-medium'>Weight(T)</th><th className='text-right px-3 py-2 text-zinc-500 text-xs font-medium'>Wagons</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>ETA</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Dwell(h)</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Status</th></tr></thead><tbody>
          {filtered.map(c => (
            <tr key={c.id} className='rfc-table-row border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors'>
              <td className='px-3 py-2 font-mono text-xs text-orange-400'>{c.id}</td>
              <td className='px-3 py-2 font-mono text-xs'>{c.rakeNo}</td>
              <td className='px-3 py-2 text-xs text-zinc-300'>{c.origin} → {c.destination}</td>
              <td className='px-3 py-2'><CargoBadge cargo={c.cargo} /></td>
              <td className='px-3 py-2'><PriorityBadge priority={c.priority} /></td>
              <td className='px-3 py-2 text-right text-xs font-medium'>{c.weight}</td>
              <td className='px-3 py-2 text-right text-xs'>{c.wagons}</td>
              <td className='px-3 py-2 w-24'><EtaBar value={c.eta_hrs} /><span className='text-[10px] text-zinc-500 ml-1'>{c.eta_hrs}h</span></td>
              <td className='px-3 py-2 w-24'><WeightBar value={c.dwell_hrs} max={24} /><span className='text-[10px] text-zinc-500 ml-1'>{c.dwell_hrs}h</span></td>
              <td className='px-3 py-2'><StatusBadge status={c.status} /></td>
            </tr>
          ))}
          </tbody></table></div></CardContent></Card>
        </TabsContent>

        <TabsContent value='analytics' className='rfc-tab-content space-y-4 mt-4'>
          <div className='rfc-value-row grid grid-cols-2 lg:grid-cols-4 gap-3'>
            <ValueTile label='Total Rakes (MTD)' value='1,247' change='+18% YoY' />
            <ValueTile label='Avg Dwell Time' value='6.2h' change='-1.8h' />
            <ValueTile label='WDFC Share' value='38%' change='+12pp YoY' />
            <ValueTile label='Revenue/Train-km' value='INR 8.4K' change='+6% QoQ' />
          </div>
          <div className='rfc-analytics-charts grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <Card className='rfc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Corridor Tonnage</CardTitle></CardHeader><CardContent><BarChart data={corridorChartData} width={450} height={220}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='name' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Bar dataKey='tons' fill='#f97316' radius={[4,4,0,0]}/><Bar dataKey='revenue' fill='#eab308' radius={[4,4,0,0]}/></BarChart></CardContent></Card>
            <Card className='rfc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Railway Operator Mix</CardTitle></CardHeader><CardContent><PieChart width={450} height={220}><Pie data={[{ name: 'IR Freight', value: 35 }, { name: 'DFCCIL', value: 25 }, { name: 'CONCOR', value: 18 }, { name: 'Private', value: 12 }, { name: 'Others', value: 10 }]} cx='50%' cy='50%' outerRadius={80} innerRadius={40} dataKey='value' paddingAngle={3}>{[<Cell key={0} fill='#f97316' />, <Cell key={1} fill='#ef4444' />, <Cell key={2} fill='#eab308' />, <Cell key={3} fill='#3b82f6' />, <Cell key={4} fill='#6b7280' />]}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value='insights' className='rfc-tab-content space-y-4 mt-4'>
          {insights.map((ins, i) => (
            <Card key={i} className={'rfc-insight-card bg-zinc-900/60 border ' + (ins.severity === 'high' ? 'border-orange-500/30' : ins.severity === 'medium' ? 'border-amber-500/30' : 'border-zinc-800')}><CardContent className='p-4'><div className='flex items-start gap-3'><div className={'rfc-insight-dot w-2 h-2 rounded-full mt-1.5 shrink-0 ' + (ins.severity === 'high' ? 'bg-orange-500' : ins.severity === 'medium' ? 'bg-amber-500' : 'bg-zinc-500')} /><div><p className='text-sm font-medium text-zinc-200'>{ins.title}</p><p className='text-xs text-zinc-400 mt-1 leading-relaxed'>{ins.desc}</p></div></div></CardContent></Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
