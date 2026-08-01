import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#ef4444', '#f97316', '#eab308', '#10b981', '#06b6d4', '#6366f1', '#ec4899', '#84cc16']

const VEHICLE_TYPES = ['Heavy Truck', 'Light Truck', 'Refrigerated', 'Tanker', 'Flatbed', 'Container', 'Pickup Van', 'Electric EV']
const DEPOTS = ['Mumbai Central Depot', 'Delhi NCR Hub', 'Chennai Fuel Station', 'Bangalore Terminal', 'Hyderabad Yard', 'Pune Junction', 'Kolkata Depot', 'Ahmedabay Yard']
const FUEL_TYPES = ['Diesel', 'CNG', 'Electric', 'Petrol', 'LNG', 'Hybrid']
const EFFICIENCY_TIERS = ['Excellent', 'Good', 'Average', 'Poor']

const fleet = [
  { id: 'FFT-0001', vehicle: 'Heavy Truck', depot: 'Mumbai Central Depot', fuel_type: 'Diesel', efficiency: 'Excellent', fuel_liters: 142, km_covered: 680, cost_inr: 12640, co2_kg: 373, last_refuel: '2026-07-28 05:55', plate: 'MH-01-AB-1234' },
  { id: 'FFT-0002', vehicle: 'Light Truck', depot: 'Delhi NCR Hub', fuel_type: 'CNG', efficiency: 'Good', fuel_liters: 67, km_covered: 420, cost_inr: 4690, co2_kg: 148, last_refuel: '2026-07-27 14:28', plate: 'DL-02-CD-5678' },
  { id: 'FFT-0003', vehicle: 'Refrigerated', depot: 'Chennai Fuel Station', fuel_type: 'Diesel', efficiency: 'Average', fuel_liters: 198, km_covered: 540, cost_inr: 17622, co2_kg: 521, last_refuel: '2026-07-26 22:36', plate: 'TN-04-EF-9012' },
  { id: 'FFT-0004', vehicle: 'Tanker', depot: 'Bangalore Terminal', fuel_type: 'Diesel', efficiency: 'Poor', fuel_liters: 310, km_covered: 720, cost_inr: 27590, co2_kg: 816, last_refuel: '2026-07-25 11:25', plate: 'KA-03-GH-3456' },
  { id: 'FFT-0005', vehicle: 'Flatbed', depot: 'Hyderabad Yard', fuel_type: 'Petrol', efficiency: 'Good', fuel_liters: 85, km_covered: 510, cost_inr: 7650, co2_kg: 187, last_refuel: '2026-07-28 15:05', plate: 'TS-05-IJ-7890' },
  { id: 'FFT-0006', vehicle: 'Container', depot: 'Pune Junction', fuel_type: 'Diesel', efficiency: 'Excellent', fuel_liters: 165, km_covered: 820, cost_inr: 14685, co2_kg: 434, last_refuel: '2026-07-26 12:07', plate: 'MH-06-KL-1234' },
  { id: 'FFT-0007', vehicle: 'Pickup Van', depot: 'Kolkata Depot', fuel_type: 'LNG', efficiency: 'Average', fuel_liters: 52, km_covered: 310, cost_inr: 3640, co2_kg: 104, last_refuel: '2026-07-24 08:14', plate: 'WB-07-MN-5678' },
  { id: 'FFT-0008', vehicle: 'Electric EV', depot: 'Ahmedabay Yard', fuel_type: 'Electric', efficiency: 'Excellent', fuel_liters: 0, km_covered: 450, cost_inr: 1125, co2_kg: 0, last_refuel: '2026-07-28 02:25', plate: 'GJ-08-OP-9012' },
  { id: 'FFT-0009', vehicle: 'Heavy Truck', depot: 'Mumbai Central Depot', fuel_type: 'Diesel', efficiency: 'Good', fuel_liters: 128, km_covered: 590, cost_inr: 11392, co2_kg: 336, last_refuel: '2026-07-27 21:02', plate: 'MH-09-QR-3456' },
  { id: 'FFT-0010', vehicle: 'Light Truck', depot: 'Delhi NCR Hub', fuel_type: 'CNG', efficiency: 'Excellent', fuel_liters: 58, km_covered: 480, cost_inr: 4060, co2_kg: 128, last_refuel: '2026-07-26 16:37', plate: 'DL-10-ST-7890' },
  { id: 'FFT-0011', vehicle: 'Refrigerated', depot: 'Chennai Fuel Station', fuel_type: 'Hybrid', efficiency: 'Good', fuel_liters: 145, km_covered: 620, cost_inr: 10875, co2_kg: 285, last_refuel: '2026-07-28 09:41', plate: 'TN-11-UV-1234' },
  { id: 'FFT-0012', vehicle: 'Tanker', depot: 'Bangalore Terminal', fuel_type: 'Diesel', efficiency: 'Poor', fuel_liters: 295, km_covered: 680, cost_inr: 26255, co2_kg: 777, last_refuel: '2026-07-25 17:43', plate: 'KA-12-WX-5678' },
  { id: 'FFT-0013', vehicle: 'Flatbed', depot: 'Hyderabad Yard', fuel_type: 'Diesel', efficiency: 'Average', fuel_liters: 175, km_covered: 560, cost_inr: 15575, co2_kg: 461, last_refuel: '2026-07-27 03:07', plate: 'TS-13-YZ-9012' },
  { id: 'FFT-0014', vehicle: 'Container', depot: 'Pune Junction', fuel_type: 'LNG', efficiency: 'Good', fuel_liters: 190, km_covered: 780, cost_inr: 13300, co2_kg: 380, last_refuel: '2026-07-28 11:20', plate: 'MH-14-AB-3456' },
  { id: 'FFT-0015', vehicle: 'Pickup Van', depot: 'Kolkata Depot', fuel_type: 'Petrol', efficiency: 'Poor', fuel_liters: 72, km_covered: 280, cost_inr: 6480, co2_kg: 158, last_refuel: '2026-07-24 06:44', plate: 'WB-15-CD-7890' },
  { id: 'FFT-0016', vehicle: 'Electric EV', depot: 'Ahmedabay Yard', fuel_type: 'Electric', efficiency: 'Excellent', fuel_liters: 0, km_covered: 520, cost_inr: 1300, co2_kg: 0, last_refuel: '2026-07-28 05:11', plate: 'GJ-16-EF-1234' },
  { id: 'FFT-0017', vehicle: 'Heavy Truck', depot: 'Mumbai Central Depot', fuel_type: 'Diesel', efficiency: 'Average', fuel_liters: 158, km_covered: 620, cost_inr: 14062, co2_kg: 416, last_refuel: '2026-07-26 22:55', plate: 'MH-17-GH-5678' },
  { id: 'FFT-0018', vehicle: 'Light Truck', depot: 'Delhi NCR Hub', fuel_type: 'Hybrid', efficiency: 'Good', fuel_liters: 45, km_covered: 390, cost_inr: 3375, co2_kg: 89, last_refuel: '2026-07-27 14:34', plate: 'DL-18-IJ-9012' },
  { id: 'FFT-0019', vehicle: 'Refrigerated', depot: 'Chennai Fuel Station', fuel_type: 'Diesel', efficiency: 'Poor', fuel_liters: 220, km_covered: 480, cost_inr: 19580, co2_kg: 579, last_refuel: '2026-07-25 07:54', plate: 'TN-19-KL-3456' },
  { id: 'FFT-0020', vehicle: 'Tanker', depot: 'Bangalore Terminal', fuel_type: 'CNG', efficiency: 'Good', fuel_liters: 125, km_covered: 650, cost_inr: 8750, co2_kg: 276, last_refuel: '2026-07-28 16:24', plate: 'KA-20-MN-7890' },
  { id: 'FFT-0021', vehicle: 'Flatbed', depot: 'Hyderabad Yard', fuel_type: 'Diesel', efficiency: 'Excellent', fuel_liters: 140, km_covered: 710, cost_inr: 12460, co2_kg: 369, last_refuel: '2026-07-26 10:18', plate: 'TS-21-OP-1234' },
  { id: 'FFT-0022', vehicle: 'Container', depot: 'Pune Junction', fuel_type: 'Diesel', efficiency: 'Average', fuel_liters: 180, km_covered: 690, cost_inr: 16020, co2_kg: 474, last_refuel: '2026-07-27 08:55', plate: 'MH-22-QR-5678' },
  { id: 'FFT-0023', vehicle: 'Pickup Van', depot: 'Kolkata Depot', fuel_type: 'CNG', efficiency: 'Good', fuel_liters: 38, km_covered: 340, cost_inr: 2660, co2_kg: 84, last_refuel: '2026-07-25 19:33', plate: 'WB-23-ST-9012' },
  { id: 'FFT-0024', vehicle: 'Electric EV', depot: 'Ahmedabay Yard', fuel_type: 'Electric', efficiency: 'Good', fuel_liters: 0, km_covered: 380, cost_inr: 950, co2_kg: 0, last_refuel: '2026-07-27 12:19', plate: 'GJ-24-UV-3456' },
  { id: 'FFT-0025', vehicle: 'Heavy Truck', depot: 'Mumbai Central Depot', fuel_type: 'LNG', efficiency: 'Good', fuel_liters: 160, km_covered: 750, cost_inr: 11200, co2_kg: 320, last_refuel: '2026-07-28 03:48', plate: 'MH-25-WX-7890' },
  { id: 'FFT-0026', vehicle: 'Light Truck', depot: 'Delhi NCR Hub', fuel_type: 'Petrol', efficiency: 'Average', fuel_liters: 78, km_covered: 440, cost_inr: 7020, co2_kg: 171, last_refuel: '2026-07-26 21:06', plate: 'DL-26-YZ-1234' },
  { id: 'FFT-0027', vehicle: 'Refrigerated', depot: 'Chennai Fuel Station', fuel_type: 'Hybrid', efficiency: 'Excellent', fuel_liters: 110, km_covered: 680, cost_inr: 8250, co2_kg: 216, last_refuel: '2026-07-28 14:22', plate: 'TN-27-AB-5678' },
  { id: 'FFT-0028', vehicle: 'Tanker', depot: 'Bangalore Terminal', fuel_type: 'Diesel', efficiency: 'Poor', fuel_liters: 340, km_covered: 700, cost_inr: 30260, co2_kg: 895, last_refuel: '2026-07-24 17:51', plate: 'KA-28-CD-9012' },
  { id: 'FFT-0029', vehicle: 'Flatbed', depot: 'Hyderabad Yard', fuel_type: 'CNG', efficiency: 'Average', fuel_liters: 95, km_covered: 520, cost_inr: 6650, co2_kg: 210, last_refuel: '2026-07-27 05:58', plate: 'TS-29-EF-3456' },
  { id: 'FFT-0030', vehicle: 'Container', depot: 'Pune Junction', fuel_type: 'Diesel', efficiency: 'Excellent', fuel_liters: 155, km_covered: 840, cost_inr: 13795, co2_kg: 408, last_refuel: '2026-07-28 09:33', plate: 'MH-30-GH-7890' },
  { id: 'FFT-0031', vehicle: 'Pickup Van', depot: 'Kolkata Depot', fuel_type: 'Diesel', efficiency: 'Poor', fuel_liters: 88, km_covered: 290, cost_inr: 7832, co2_kg: 232, last_refuel: '2026-07-25 11:07', plate: 'WB-31-IJ-1234' },
  { id: 'FFT-0032', vehicle: 'Electric EV', depot: 'Ahmedabay Yard', fuel_type: 'Electric', efficiency: 'Excellent', fuel_liters: 0, km_covered: 490, cost_inr: 1225, co2_kg: 0, last_refuel: '2026-07-27 22:15', plate: 'GJ-32-KL-5678' },
  { id: 'FFT-0033', vehicle: 'Heavy Truck', depot: 'Mumbai Central Depot', fuel_type: 'Hybrid', efficiency: 'Good', fuel_liters: 95, km_covered: 640, cost_inr: 7125, co2_kg: 187, last_refuel: '2026-07-26 18:41', plate: 'MH-33-MN-9012' },
  { id: 'FFT-0034', vehicle: 'Light Truck', depot: 'Delhi NCR Hub', fuel_type: 'Diesel', efficiency: 'Average', fuel_liters: 82, km_covered: 410, cost_inr: 7298, co2_kg: 216, last_refuel: '2026-07-25 04:28', plate: 'DL-34-OP-3456' },
  { id: 'FFT-0035', vehicle: 'Refrigerated', depot: 'Chennai Fuel Station', fuel_type: 'Diesel', efficiency: 'Good', fuel_liters: 168, km_covered: 610, cost_inr: 14952, co2_kg: 442, last_refuel: '2026-07-28 07:59', plate: 'TN-35-QR-7890' },
  { id: 'FFT-0036', vehicle: 'Tanker', depot: 'Bangalore Terminal', fuel_type: 'LNG', efficiency: 'Good', fuel_liters: 240, km_covered: 790, cost_inr: 16800, co2_kg: 480, last_refuel: '2026-07-27 15:24', plate: 'KA-36-ST-1234' },
  { id: 'FFT-0037', vehicle: 'Flatbed', depot: 'Hyderabad Yard', fuel_type: 'Petrol', efficiency: 'Poor', fuel_liters: 105, km_covered: 460, cost_inr: 9450, co2_kg: 231, last_refuel: '2026-07-26 01:58', plate: 'TS-37-UV-5678' },
  { id: 'FFT-0038', vehicle: 'Container', depot: 'Pune Junction', fuel_type: 'Diesel', efficiency: 'Excellent', fuel_liters: 148, km_covered: 810, cost_inr: 13172, co2_kg: 389, last_refuel: '2026-07-28 13:32', plate: 'MH-38-WX-9012' },
  { id: 'FFT-0039', vehicle: 'Pickup Van', depot: 'Kolkata Depot', fuel_type: 'Hybrid', efficiency: 'Good', fuel_liters: 42, km_covered: 360, cost_inr: 3150, co2_kg: 83, last_refuel: '2026-07-27 10:06', plate: 'WB-39-YZ-3456' },
  { id: 'FFT-0040', vehicle: 'Electric EV', depot: 'Ahmedabay Yard', fuel_type: 'Electric', efficiency: 'Good', fuel_liters: 0, km_covered: 410, cost_inr: 1025, co2_kg: 0, last_refuel: '2026-07-26 19:48', plate: 'GJ-40-AB-7890' },
  { id: 'FFT-0041', vehicle: 'Heavy Truck', depot: 'Mumbai Central Depot', fuel_type: 'Diesel', efficiency: 'Excellent', fuel_liters: 135, km_covered: 720, cost_inr: 12015, co2_kg: 355, last_refuel: '2026-07-28 06:19', plate: 'MH-41-CD-1234' },
  { id: 'FFT-0042', vehicle: 'Light Truck', depot: 'Delhi NCR Hub', fuel_type: 'CNG', efficiency: 'Average', fuel_liters: 72, km_covered: 390, cost_inr: 5040, co2_kg: 159, last_refuel: '2026-07-25 08:27', plate: 'DL-42-EF-5678' },
  { id: 'FFT-0043', vehicle: 'Refrigerated', depot: 'Chennai Fuel Station', fuel_type: 'LNG', efficiency: 'Good', fuel_liters: 152, km_covered: 640, cost_inr: 10640, co2_kg: 304, last_refuel: '2026-07-27 12:51', plate: 'TN-43-GH-9012' },
  { id: 'FFT-0044', vehicle: 'Tanker', depot: 'Bangalore Terminal', fuel_type: 'Diesel', efficiency: 'Poor', fuel_liters: 325, km_covered: 690, cost_inr: 28925, co2_kg: 856, last_refuel: '2026-07-24 22:34', plate: 'KA-44-IJ-3456' },
  { id: 'FFT-0045', vehicle: 'Flatbed', depot: 'Hyderabad Yard', fuel_type: 'Hybrid', efficiency: 'Excellent', fuel_liters: 68, km_covered: 580, cost_inr: 5100, co2_kg: 134, last_refuel: '2026-07-28 16:05', plate: 'TS-45-KL-7890' },
  { id: 'FFT-0046', vehicle: 'Container', depot: 'Pune Junction', fuel_type: 'CNG', efficiency: 'Good', fuel_liters: 200, km_covered: 760, cost_inr: 14000, co2_kg: 440, last_refuel: '2026-07-27 04:17', plate: 'MH-46-MN-1234' },
  { id: 'FFT-0047', vehicle: 'Pickup Van', depot: 'Kolkata Depot', fuel_type: 'Diesel', efficiency: 'Average', fuel_liters: 65, km_covered: 320, cost_inr: 5785, co2_kg: 171, last_refuel: '2026-07-25 14:33', plate: 'WB-47-OP-5678' },
  { id: 'FFT-0048', vehicle: 'Electric EV', depot: 'Ahmedabay Yard', fuel_type: 'Electric', efficiency: 'Excellent', fuel_liters: 0, km_covered: 540, cost_inr: 1350, co2_kg: 0, last_refuel: '2026-07-28 01:24', plate: 'GJ-48-QR-9012' },
  { id: 'FFT-0049', vehicle: 'Heavy Truck', depot: 'Mumbai Central Depot', fuel_type: 'Petrol', efficiency: 'Poor', fuel_liters: 185, km_covered: 540, cost_inr: 16650, co2_kg: 411, last_refuel: '2026-07-26 09:58', plate: 'MH-49-ST-3456' },
  { id: 'FFT-0050', vehicle: 'Light Truck', depot: 'Delhi NCR Hub', fuel_type: 'Hybrid', efficiency: 'Excellent', fuel_liters: 52, km_covered: 450, cost_inr: 3900, co2_kg: 103, last_refuel: '2026-07-27 20:08', plate: 'DL-50-UV-7890' },
  { id: 'FFT-0051', vehicle: 'Refrigerated', depot: 'Chennai Fuel Station', fuel_type: 'Diesel', efficiency: 'Average', fuel_liters: 188, km_covered: 550, cost_inr: 16732, co2_kg: 495, last_refuel: '2026-07-25 18:41', plate: 'TN-51-WX-1234' },
  { id: 'FFT-0052', vehicle: 'Tanker', depot: 'Bangalore Terminal', fuel_type: 'Hybrid', efficiency: 'Good', fuel_liters: 210, km_covered: 740, cost_inr: 15750, co2_kg: 413, last_refuel: '2026-07-28 11:46', plate: 'KA-52-YZ-5678' },
  { id: 'FFT-0053', vehicle: 'Flatbed', depot: 'Hyderabad Yard', fuel_type: 'Diesel', efficiency: 'Good', fuel_liters: 150, km_covered: 630, cost_inr: 13350, co2_kg: 395, last_refuel: '2026-07-27 07:22', plate: 'TS-53-AB-9012' },
  { id: 'FFT-0054', vehicle: 'Container', depot: 'Pune Junction', fuel_type: 'Diesel', efficiency: 'Poor', fuel_liters: 195, km_covered: 580, cost_inr: 17355, co2_kg: 513, last_refuel: '2026-07-26 15:39', plate: 'MH-54-CD-3456' },
  { id: 'FFT-0055', vehicle: 'Pickup Van', depot: 'Kolkata Depot', fuel_type: 'Electric', efficiency: 'Excellent', fuel_liters: 0, km_covered: 350, cost_inr: 875, co2_kg: 0, last_refuel: '2026-07-28 08:14', plate: 'WB-55-EF-7890' },
  { id: 'FFT-0056', vehicle: 'Electric EV', depot: 'Ahmedabay Yard', fuel_type: 'Electric', efficiency: 'Good', fuel_liters: 0, km_covered: 470, cost_inr: 1175, co2_kg: 0, last_refuel: '2026-07-27 13:55', plate: 'GJ-56-GH-1234' },
  { id: 'FFT-0057', vehicle: 'Heavy Truck', depot: 'Mumbai Central Depot', fuel_type: 'CNG', efficiency: 'Good', fuel_liters: 170, km_covered: 700, cost_inr: 11900, co2_kg: 374, last_refuel: '2026-07-28 17:33', plate: 'MH-57-IJ-5678' },
  { id: 'FFT-0058', vehicle: 'Light Truck', depot: 'Delhi NCR Hub', fuel_type: 'Diesel', efficiency: 'Poor', fuel_liters: 92, km_covered: 360, cost_inr: 8188, co2_kg: 242, last_refuel: '2026-07-25 02:48', plate: 'DL-58-KL-9012' },
  { id: 'FFT-0059', vehicle: 'Refrigerated', depot: 'Chennai Fuel Station', fuel_type: 'Electric', efficiency: 'Excellent', fuel_liters: 0, km_covered: 480, cost_inr: 1200, co2_kg: 0, last_refuel: '2026-07-27 21:22', plate: 'TN-59-MN-3456' },
  { id: 'FFT-0060', vehicle: 'Tanker', depot: 'Bangalore Terminal', fuel_type: 'Diesel', efficiency: 'Average', fuel_liters: 275, km_covered: 710, cost_inr: 24475, co2_kg: 724, last_refuel: '2026-07-26 20:05', plate: 'KA-60-OP-7890' },
]

const hourlyData = [
  { hour: '00:00', consumption: 145, distance: 320, cost_k: 18.4 },
  { hour: '01:00', consumption: 82, distance: 180, cost_k: 10.2 },
  { hour: '02:00', consumption: 210, distance: 460, cost_k: 26.8 },
  { hour: '03:00', consumption: 165, distance: 380, cost_k: 21.1 },
  { hour: '04:00', consumption: 245, distance: 520, cost_k: 31.2 },
  { hour: '05:00', consumption: 55, distance: 120, cost_k: 6.9 },
  { hour: '06:00', consumption: 280, distance: 590, cost_k: 35.7 },
  { hour: '07:00', consumption: 195, distance: 420, cost_k: 24.8 },
  { hour: '08:00', consumption: 120, distance: 260, cost_k: 15.3 },
  { hour: '09:00', consumption: 255, distance: 550, cost_k: 32.5 },
  { hour: '10:00', consumption: 175, distance: 380, cost_k: 22.3 },
  { hour: '11:00', consumption: 290, distance: 610, cost_k: 36.9 },
  { hour: '12:00', consumption: 140, distance: 300, cost_k: 17.8 },
  { hour: '13:00', consumption: 95, distance: 210, cost_k: 12.1 },
  { hour: '14:00', consumption: 230, distance: 490, cost_k: 29.3 },
  { hour: '15:00', consumption: 265, distance: 560, cost_k: 33.8 },
  { hour: '16:00', consumption: 155, distance: 340, cost_k: 19.7 },
  { hour: '17:00', consumption: 200, distance: 430, cost_k: 25.5 },
  { hour: '18:00', consumption: 270, distance: 570, cost_k: 34.4 },
  { hour: '19:00', consumption: 185, distance: 400, cost_k: 23.6 },
  { hour: '20:00', consumption: 240, distance: 510, cost_k: 30.6 },
  { hour: '21:00', consumption: 215, distance: 460, cost_k: 27.4 },
  { hour: '22:00', consumption: 190, distance: 410, cost_k: 24.2 },
  { hour: '23:00', consumption: 160, distance: 350, cost_k: 20.4 },
]

const fuelDist = [
  { name: 'Diesel', value: 312 },
  { name: 'CNG', value: 187 },
  { name: 'Electric', value: 145 },
  { name: 'Petrol', value: 98 },
  { name: 'LNG', value: 156 },
  { name: 'Hybrid', value: 112 },
]

const filterGroups = [
  { key: 'vehicle', label: 'Vehicle', options: VEHICLE_TYPES.map(v => ({ value: v, label: v, count: 0 })) },
  { key: 'fuel_type', label: 'Fuel Type', options: FUEL_TYPES.map(f => ({ value: f, label: f, count: 0 })) },
  { key: 'efficiency', label: 'Efficiency', options: EFFICIENCY_TIERS.map(e => ({ value: e, label: e, count: 0 })) },
]

function VehicleBadge({ vehicle }: { vehicle: string }) {
  const color = vehicle === 'Heavy Truck' ? 'bg-red-500/15 text-red-400' : vehicle === 'Light Truck' ? 'bg-orange-500/15 text-orange-400' : vehicle === 'Refrigerated' ? 'bg-blue-500/15 text-blue-400' : vehicle === 'Tanker' ? 'bg-amber-500/15 text-amber-400' : vehicle === 'Flatbed' ? 'bg-emerald-500/15 text-emerald-400' : vehicle === 'Container' ? 'bg-violet-500/15 text-violet-400' : vehicle === 'Pickup Van' ? 'bg-pink-500/15 text-pink-400' : 'bg-cyan-500/15 text-cyan-400'
  return <span className={'fft-vehicle-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{vehicle}</span>
}

function FuelBadge({ fuel }: { fuel: string }) {
  const color = fuel === 'Diesel' ? 'bg-amber-500/15 text-amber-400' : fuel === 'CNG' ? 'bg-emerald-500/15 text-emerald-400' : fuel === 'Electric' ? 'bg-cyan-500/15 text-cyan-400' : fuel === 'Petrol' ? 'bg-red-500/15 text-red-400' : fuel === 'LNG' ? 'bg-blue-500/15 text-blue-400' : 'bg-violet-500/15 text-violet-400'
  return <span className={'fft-fuel-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{fuel}</span>
}

function EfficiencyBadge({ efficiency }: { efficiency: string }) {
  const color = efficiency === 'Excellent' ? 'bg-emerald-500/15 text-emerald-400' : efficiency === 'Good' ? 'bg-sky-500/15 text-sky-400' : efficiency === 'Average' ? 'bg-amber-500/15 text-amber-400' : 'bg-red-500/15 text-red-400'
  return <span className={'fft-eff-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{efficiency}</span>
}

function FuelBar({ value, max }: { value: number; max: number }) {
  const w = Math.min((value / max) * 100, 100)
  const color = w >= 80 ? 'bg-red-500' : w >= 50 ? 'bg-orange-500' : 'bg-emerald-500'
  return <div className='fft-fuel-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className={'h-full rounded-full fft-fuel-fill ' + color} style={{ width: w + '%', animation: 'fft-grow 1s ease-out' }}/></div>
}

function Co2Bar({ value }: { value: number }) {
  const w = Math.min(value / 10, 100)
  const color = value >= 700 ? 'bg-red-500' : value >= 400 ? 'bg-orange-500' : 'bg-emerald-500'
  return <div className='fft-co2-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className={'h-full rounded-full fft-co2-fill ' + color} style={{ width: w + '%', animation: 'fft-grow 1s ease-out' }}/></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, c = 2 * Math.PI * r, offset = c - (value / 100) * c
  return <div className='fft-ring flex flex-col items-center'><svg width='70' height='70' className='-rotate-90'><circle cx='35' cy='35' r={r} fill='none' stroke='#27272a' strokeWidth='5'/><circle cx='35' cy='35' r={r} fill='none' stroke={color} strokeWidth='5' strokeDasharray={c} strokeDashoffset={offset} strokeLinecap='round' className='fft-ring-path' style={{ transition: 'stroke-dashoffset 1s ease' }}/></svg><span className='fft-ring-val text-sm font-bold mt-1' style={{ color }}>{value}%</span><span className='fft-ring-label text-[10px] text-zinc-500'>{label}</span></div>
}

function KpiTile({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return <div className='fft-kpi bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 fft-kpi-card'><p className='text-xs text-zinc-500 mb-1'>{label}</p><p className={'text-xl font-bold ' + color}>{value}</p><p className='text-[10px] text-zinc-400 mt-1'>{sub}</p></div>
}

function ValueTile({ label, value, change }: { label: string; value: string; change: string }) {
  const up = change.startsWith('+')
  return <div className='fft-value-tile bg-zinc-900/60 border border-zinc-800 rounded-lg p-3'><p className='text-xs text-zinc-500'>{label}</p><p className='text-lg font-bold text-white mt-1'>{value}</p><p className={'text-xs mt-1 ' + (up ? 'text-emerald-400' : 'text-red-400')}>{change}</p></div>
}

const insights = [
  { title: 'Fleet EV Transition Milestone', desc: 'Electric vehicle fleet reached 12% of total fleet size this month. Average fuel cost per km for EVs is INR 2.8 vs INR 18.6 for diesel trucks (85% savings). Bangalore and Hyderabad depots now have 8 fast-charging bays each. Target: 25% EV by Q4 2026. Recommend expanding overnight charging infrastructure at Mumbai and Delhi depots.', severity: 'high' },
  { title: 'Diesel Price Hedging Strategy', desc: 'Fuel procurement team locked in 3-month forward contracts at INR 89.2/liter, saving estimated INR 4.8 Cr vs spot market volatility. Mumbai depot fuel cost per km reduced from INR 21.4 to INR 18.2. Recommend extending hedging to CNG and LNG procurement which currently lack forward price protection.', severity: 'medium' },
  { title: 'Predictive Maintenance Fuel Anomaly Detection', desc: 'AI model detected 7 vehicles with fuel consumption anomalies exceeding 2 standard deviations. FFT-0012 (Tanker) and FFT-0028 (Tanker) flagged for possible injector leaks. FFT-0049 (Heavy Truck) showing reduced turbo boost efficiency. Proactive maintenance scheduled; estimated fuel savings: INR 3.2L per month.', severity: 'low' },
  { title: 'CNG Infrastructure Expansion Plan', desc: 'Government subsidy approval for 12 new CNG filling stations along Delhi-Mumbai and Chennai-Bangalore freight corridors. Current CNG fleet operates at 92% route coverage; new stations will close remaining gaps by November 2026. Projected annual savings: INR 6.4 Cr in fuel costs and 1,200 tons CO2 reduction.', severity: 'high' },
]

export default function FleetFuelTrackerView() {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [tab, setTab] = useState('dashboard')

  const toggleFilter = (key: string, val: string) => {
    setActiveFilters(prev => { const cur = prev[key] || []; const next = cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val]; return { ...prev, [key]: next } })
  }

  const filtered = fleet.filter(f => {
    for (const [key, vals] of Object.entries(activeFilters)) { if (vals.length > 0 && !vals.includes(f[key as keyof typeof f] as string)) return false }
    if (searchQuery && !Object.values(f).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))) return false
    return true
  })

  return (
    <div className='fft-root space-y-4 p-4'>
      <PageHeader title='Fleet Fuel Tracker' description='Vehicle fuel monitoring, efficiency analytics & carbon emission tracking' />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className='fft-tabs-list bg-zinc-900 border border-zinc-800'>
          <TabsTrigger value='dashboard' className='fft-tab'>Dashboard</TabsTrigger>
          <TabsTrigger value='vehicles' className='fft-tab'>Vehicles</TabsTrigger>
          <TabsTrigger value='analytics' className='fft-tab'>Analytics</TabsTrigger>
          <TabsTrigger value='insights' className='fft-tab'>Insights</TabsTrigger>
        </TabsList>
        <TabsContent value='dashboard' className='fft-tab-content space-y-4 mt-4'>
          <div className='fft-kpi-row grid grid-cols-2 lg:grid-cols-4 gap-3'>
            <KpiTile label='Active Vehicles' value='847' sub='+12 new EVs' color='text-red-400' />
            <KpiTile label='Avg Efficiency' value='4.2 km/L' sub='+0.3 improved' color='text-orange-400' />
            <KpiTile label='Fuel Cost Today' value='INR 8.4L' sub='-INR 1.2L vs avg' color='text-emerald-400' />
            <KpiTile label='CO2 Emitted' value='42.3 tons' sub='-8.2% MoM' color='text-cyan-400' />
          </div>
          <div className='fft-ring-row flex flex-wrap justify-around gap-2'>
            <HealthRing value={94} label='Fuel Budget' color='#ef4444' />
            <HealthRing value={87} label='Efficiency' color='#f97316' />
            <HealthRing value={76} label='EV Adoption' color='#eab308' />
            <HealthRing value={92} label='Route Plan' color='#10b981' />
            <HealthRing value={81} label='Maintenance' color='#06b6d4' />
            <HealthRing value={88} label='CO2 Target' color='#6366f1' />
          </div>
          <div className='fft-chart-row grid grid-cols-1 lg:grid-cols-3 gap-4'>
            <Card className='fft-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>24hr Consumption/Distance</CardTitle></CardHeader><CardContent><LineChart data={hourlyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='hour' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Line type='monotone' dataKey='consumption' stroke='#ef4444' strokeWidth={2} dot={false}/><Line type='monotone' dataKey='distance' stroke='#f97316' strokeWidth={2} dot={false}/></LineChart></CardContent></Card>
            <Card className='fft-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Hourly Fuel Cost (K INR)</CardTitle></CardHeader><CardContent><BarChart data={hourlyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='hour' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Bar dataKey='cost_k' fill='#eab308' radius={[4,4,0,0]}/></BarChart></CardContent></Card>
            <Card className='fft-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Fuel Type Mix</CardTitle></CardHeader><CardContent><PieChart width={350} height={200}><Pie data={fuelDist} cx='50%' cy='50%' outerRadius={70} innerRadius={35} dataKey='value' paddingAngle={2}>{fuelDist.map((_, i) => <Cell key={i} fill={COLORS[i % 8]} />)}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value='vehicles' className='fft-tab-content space-y-4 mt-4'>
          <ModuleBreadcrumb items={[{ label: 'Fleet Fuel' }, { label: 'Vehicles' }]} />
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => { setActiveFilters({}); setSearchQuery('') }} totalItems={fleet.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder='Search vehicles by ID, type, plate, depot...' />
          <Card className='fft-table-card bg-zinc-900/60 border-zinc-800'><CardContent className='p-0'><div className='fft-table-wrap overflow-x-auto max-h-[400px] overflow-y-auto'><table className='fft-table w-full text-sm'><thead><tr className='border-b border-zinc-800'><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>ID</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Vehicle</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Depot</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Efficiency</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Fuel</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>CO2</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>KM</th><th className='text-right px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Cost</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Fuel Type</th></tr></thead><tbody>
          {filtered.map(f => (
            <tr key={f.id} className='fft-table-row border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors'>
              <td className='px-3 py-2 font-mono text-xs text-red-400'>{f.id}</td>
              <td className='px-3 py-2'><VehicleBadge vehicle={f.vehicle} /></td>
              <td className='px-3 py-2 text-xs text-zinc-300'>{f.depot.split(' ')[0]}</td>
              <td className='px-3 py-2'><EfficiencyBadge efficiency={f.efficiency} /></td>
              <td className='px-3 py-2 w-20'><FuelBar value={f.fuel_liters} max={340} /><span className='text-[10px] text-zinc-500 ml-1'>{f.fuel_liters}L</span></td>
              <td className='px-3 py-2 w-20'><Co2Bar value={f.co2_kg} /><span className='text-[10px] text-zinc-500 ml-1'>{f.co2_kg}</span></td>
              <td className='px-3 py-2 text-xs text-zinc-400'>{f.km_covered}</td>
              <td className='px-3 py-2 text-right text-xs'>INR {(f.cost_inr / 1000).toFixed(1)}K</td>
              <td className='px-3 py-2'><FuelBadge fuel={f.fuel_type} /></td>
            </tr>
          ))})
          </tbody></table></div></CardContent></Card>
        </TabsContent>
        <TabsContent value='analytics' className='fft-tab-content space-y-4 mt-4'>
          <div className='fft-value-row grid grid-cols-2 lg:grid-cols-4 gap-3'>
            <ValueTile label='Total Fuel Cost (MTD)' value='INR 2.4 Cr' change='-11% YoY' />
            <ValueTile label='Fleet Utilization' value='87.3%' change='+2.1pp' />
            <ValueTile label='Avg km/Liter' value='4.8' change='+0.4 optimized' />
            <ValueTile label='Carbon Saved' value='124 tons' change='+18 tons' />
          </div>
          <div className='fft-analytics-charts grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <Card className='fft-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Depot Performance</CardTitle></CardHeader><CardContent><BarChart data={DEPOTS.map((d,i) => ({ name: d.split(' ')[0], efficiency: [88,82,90,85,87,91,79,86][i], cost: [92,88,85,90,87,93,88,91][i] }))} width={450} height={220}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='name' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Bar dataKey='efficiency' fill='#ef4444' radius={[4,4,0,0]}/><Bar dataKey='cost' fill='#f97316' radius={[4,4,0,0]}/></BarChart></CardContent></Card>
            <Card className='fft-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Vehicle Type Cost Distribution</CardTitle></CardHeader><CardContent><PieChart width={450} height={220}><Pie data={[{ name: 'Heavy Truck', value: 32 }, { name: 'Light Truck', value: 18 }, { name: 'Refrigerated', value: 22 }, { name: 'Tanker', value: 15 }, { name: 'Container', value: 8 }, { name: 'EV', value: 5 }]} cx='50%' cy='50%' outerRadius={80} innerRadius={40} dataKey='value' paddingAngle={3}>{[<Cell key={0} fill='#ef4444' />, <Cell key={1} fill='#f97316' />, <Cell key={2} fill='#eab308' />, <Cell key={3} fill='#10b981' />, <Cell key={4} fill='#6366f1' />, <Cell key={5} fill='#06b6d4' />]}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value='insights' className='fft-tab-content space-y-4 mt-4'>
          {insights.map((ins, i) => (
            <Card key={i} className={'fft-insight-card bg-zinc-900/60 border ' + (ins.severity === 'high' ? 'border-red-500/30' : ins.severity === 'medium' ? 'border-orange-500/30' : 'border-zinc-800')}><CardContent className='p-4'><div className='flex items-start gap-3'><div className={'fft-insight-dot w-2 h-2 rounded-full mt-1.5 shrink-0 ' + (ins.severity === 'high' ? 'bg-red-500' : ins.severity === 'medium' ? 'bg-orange-500' : 'bg-zinc-500')} /><div><p className='text-sm font-medium text-zinc-200'>{ins.title}</p><p className='text-xs text-zinc-400 mt-1 leading-relaxed'>{ins.desc}</p></div></div></CardContent></Card>
          ))})
        </TabsContent>
      </Tabs>
    </div>
  )
}
