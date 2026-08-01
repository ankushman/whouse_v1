import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#14b8a6', '#84cc16', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#f97316']

const ROUTES = ['Refurbish Center', 'Donate Charity', 'Resell Marketplace', 'Recycle Vendor', 'Manufacturer Return', 'Liquidation Auction', 'Exchange Stock', 'Scrap Disposal']
const CATEGORIES = ['Electronics', 'Apparel', 'Home & Kitchen', 'Beauty & Health', 'Sports & Outdoor', 'Books & Media', 'Toys & Games', 'Food & Beverages']
const CHANNELS = ['Online E-com', 'Retail Store', 'COD Reject', 'Warranty Claim', 'Subscription Cancel', 'Corporate Bulk']
const PRIORITIES = ['Critical', 'High', 'Medium', 'Low']

const returns = [
  { id: 'SRR-0001', route: 'Refurbish Center', category: 'Electronics', channel: 'Online E-com', priority: 'Critical', recovery_pct: 77.0, transit_days: 2, cost_inr: 166.2, volume: 430, condition: 'Defective', lastRouted: '2026-07-10 10:11' },
  { id: 'SRR-0002', route: 'Donate Charity', category: 'Apparel', channel: 'Retail Store', priority: 'High', recovery_pct: 85.3, transit_days: 11, cost_inr: 275.7, volume: 185, condition: 'Defective', lastRouted: '2026-07-12 11:29' },
  { id: 'SRR-0003', route: 'Resell Marketplace', category: 'Home & Kitchen', channel: 'COD Reject', priority: 'Medium', recovery_pct: 53.0, transit_days: 9, cost_inr: 254.4, volume: 492, condition: 'Damaged', lastRouted: '2026-07-23 07:13' },
  { id: 'SRR-0004', route: 'Recycle Vendor', category: 'Beauty & Health', channel: 'Warranty Claim', priority: 'Low', recovery_pct: 66.1, transit_days: 12, cost_inr: 166.8, volume: 586, condition: 'Fair', lastRouted: '2026-07-07 10:14' },
  { id: 'SRR-0005', route: 'Manufacturer Return', category: 'Sports & Outdoor', channel: 'Subscription Cancel', priority: 'Critical', recovery_pct: 80.4, transit_days: 11, cost_inr: 253.9, volume: 458, condition: 'Good', lastRouted: '2026-07-22 15:56' },
  { id: 'SRR-0006', route: 'Liquidation Auction', category: 'Books & Media', channel: 'Corporate Bulk', priority: 'High', recovery_pct: 87.7, transit_days: 8, cost_inr: 64.8, volume: 560, condition: 'Like New', lastRouted: '2026-07-08 06:27' },
  { id: 'SRR-0007', route: 'Exchange Stock', category: 'Toys & Games', channel: 'Online E-com', priority: 'Medium', recovery_pct: 91.2, transit_days: 12, cost_inr: 126.2, volume: 171, condition: 'Damaged', lastRouted: '2026-07-04 05:38' },
  { id: 'SRR-0008', route: 'Scrap Disposal', category: 'Food & Beverages', channel: 'Retail Store', priority: 'Low', recovery_pct: 80.5, transit_days: 7, cost_inr: 100.3, volume: 59, condition: 'Good', lastRouted: '2026-07-08 00:06' },
  { id: 'SRR-0009', route: 'Refurbish Center', category: 'Electronics', channel: 'COD Reject', priority: 'Critical', recovery_pct: 39.9, transit_days: 10, cost_inr: 123.0, volume: 307, condition: 'Fair', lastRouted: '2026-07-08 00:34' },
  { id: 'SRR-0010', route: 'Donate Charity', category: 'Apparel', channel: 'Warranty Claim', priority: 'High', recovery_pct: 52.2, transit_days: 8, cost_inr: 73.8, volume: 695, condition: 'Like New', lastRouted: '2026-07-13 08:38' },
  { id: 'SRR-0011', route: 'Resell Marketplace', category: 'Home & Kitchen', channel: 'Subscription Cancel', priority: 'Medium', recovery_pct: 66.0, transit_days: 2, cost_inr: 95.6, volume: 417, condition: 'Fair', lastRouted: '2026-07-11 00:11' },
  { id: 'SRR-0012', route: 'Recycle Vendor', category: 'Beauty & Health', channel: 'Corporate Bulk', priority: 'Low', recovery_pct: 63.0, transit_days: 3, cost_inr: 238.9, volume: 785, condition: 'Defective', lastRouted: '2026-07-17 00:40' },
  { id: 'SRR-0013', route: 'Manufacturer Return', category: 'Sports & Outdoor', channel: 'Online E-com', priority: 'Critical', recovery_pct: 58.8, transit_days: 12, cost_inr: 143.1, volume: 629, condition: 'Fair', lastRouted: '2026-07-19 04:21' },
  { id: 'SRR-0014', route: 'Liquidation Auction', category: 'Books & Media', channel: 'Retail Store', priority: 'High', recovery_pct: 62.0, transit_days: 8, cost_inr: 49.5, volume: 612, condition: 'Like New', lastRouted: '2026-07-08 19:10' },
  { id: 'SRR-0015', route: 'Exchange Stock', category: 'Toys & Games', channel: 'COD Reject', priority: 'Medium', recovery_pct: 69.8, transit_days: 2, cost_inr: 197.9, volume: 575, condition: 'Fair', lastRouted: '2026-07-22 11:52' },
  { id: 'SRR-0016', route: 'Scrap Disposal', category: 'Food & Beverages', channel: 'Warranty Claim', priority: 'Low', recovery_pct: 65.9, transit_days: 8, cost_inr: 97.9, volume: 359, condition: 'Damaged', lastRouted: '2026-07-24 00:11' },
  { id: 'SRR-0017', route: 'Refurbish Center', category: 'Electronics', channel: 'Subscription Cancel', priority: 'Critical', recovery_pct: 75.7, transit_days: 9, cost_inr: 71.2, volume: 763, condition: 'Good', lastRouted: '2026-07-24 00:03' },
  { id: 'SRR-0018', route: 'Donate Charity', category: 'Apparel', channel: 'Corporate Bulk', priority: 'High', recovery_pct: 93.3, transit_days: 1, cost_inr: 71.3, volume: 220, condition: 'Good', lastRouted: '2026-07-16 16:50' },
  { id: 'SRR-0019', route: 'Resell Marketplace', category: 'Home & Kitchen', channel: 'Online E-com', priority: 'Medium', recovery_pct: 51.6, transit_days: 12, cost_inr: 154.3, volume: 136, condition: 'Like New', lastRouted: '2026-07-18 17:05' },
  { id: 'SRR-0020', route: 'Recycle Vendor', category: 'Beauty & Health', channel: 'Retail Store', priority: 'Low', recovery_pct: 57.1, transit_days: 12, cost_inr: 143.9, volume: 182, condition: 'Like New', lastRouted: '2026-07-28 21:34' },
  { id: 'SRR-0021', route: 'Manufacturer Return', category: 'Sports & Outdoor', channel: 'COD Reject', priority: 'Critical', recovery_pct: 33.7, transit_days: 11, cost_inr: 113.7, volume: 523, condition: 'Fair', lastRouted: '2026-07-11 01:52' },
  { id: 'SRR-0022', route: 'Liquidation Auction', category: 'Books & Media', channel: 'Warranty Claim', priority: 'High', recovery_pct: 38.3, transit_days: 2, cost_inr: 106.6, volume: 796, condition: 'Damaged', lastRouted: '2026-07-11 16:24' },
  { id: 'SRR-0023', route: 'Exchange Stock', category: 'Toys & Games', channel: 'Subscription Cancel', priority: 'Medium', recovery_pct: 63.3, transit_days: 6, cost_inr: 38.0, volume: 613, condition: 'Defective', lastRouted: '2026-07-03 02:22' },
  { id: 'SRR-0024', route: 'Scrap Disposal', category: 'Food & Beverages', channel: 'Corporate Bulk', priority: 'Low', recovery_pct: 32.6, transit_days: 7, cost_inr: 244.0, volume: 551, condition: 'Defective', lastRouted: '2026-07-21 19:53' },
  { id: 'SRR-0025', route: 'Refurbish Center', category: 'Electronics', channel: 'Online E-com', priority: 'Critical', recovery_pct: 43.5, transit_days: 5, cost_inr: 82.1, volume: 667, condition: 'Fair', lastRouted: '2026-07-11 17:48' },
  { id: 'SRR-0026', route: 'Donate Charity', category: 'Apparel', channel: 'Retail Store', priority: 'High', recovery_pct: 40.4, transit_days: 7, cost_inr: 221.2, volume: 762, condition: 'Fair', lastRouted: '2026-07-17 13:29' },
  { id: 'SRR-0027', route: 'Resell Marketplace', category: 'Home & Kitchen', channel: 'COD Reject', priority: 'Medium', recovery_pct: 57.9, transit_days: 6, cost_inr: 244.4, volume: 431, condition: 'Like New', lastRouted: '2026-07-21 20:45' },
  { id: 'SRR-0028', route: 'Recycle Vendor', category: 'Beauty & Health', channel: 'Warranty Claim', priority: 'Low', recovery_pct: 75.4, transit_days: 8, cost_inr: 121.1, volume: 200, condition: 'Fair', lastRouted: '2026-07-16 08:48' },
  { id: 'SRR-0029', route: 'Manufacturer Return', category: 'Sports & Outdoor', channel: 'Subscription Cancel', priority: 'Critical', recovery_pct: 93.8, transit_days: 12, cost_inr: 245.6, volume: 602, condition: 'Good', lastRouted: '2026-07-09 03:19' },
  { id: 'SRR-0030', route: 'Liquidation Auction', category: 'Books & Media', channel: 'Corporate Bulk', priority: 'High', recovery_pct: 86.4, transit_days: 1, cost_inr: 117.9, volume: 371, condition: 'Fair', lastRouted: '2026-07-04 14:14' },
  { id: 'SRR-0031', route: 'Exchange Stock', category: 'Toys & Games', channel: 'Online E-com', priority: 'Medium', recovery_pct: 20.6, transit_days: 5, cost_inr: 100.3, volume: 508, condition: 'Damaged', lastRouted: '2026-07-19 16:47' },
  { id: 'SRR-0032', route: 'Scrap Disposal', category: 'Food & Beverages', channel: 'Retail Store', priority: 'Low', recovery_pct: 48.8, transit_days: 3, cost_inr: 57.3, volume: 260, condition: 'Defective', lastRouted: '2026-07-04 06:17' },
  { id: 'SRR-0033', route: 'Refurbish Center', category: 'Electronics', channel: 'COD Reject', priority: 'Critical', recovery_pct: 71.2, transit_days: 4, cost_inr: 60.6, volume: 746, condition: 'Like New', lastRouted: '2026-07-01 17:57' },
  { id: 'SRR-0034', route: 'Donate Charity', category: 'Apparel', channel: 'Warranty Claim', priority: 'High', recovery_pct: 60.1, transit_days: 9, cost_inr: 179.0, volume: 553, condition: 'Fair', lastRouted: '2026-07-10 20:12' },
  { id: 'SRR-0035', route: 'Resell Marketplace', category: 'Home & Kitchen', channel: 'Subscription Cancel', priority: 'Medium', recovery_pct: 37.9, transit_days: 5, cost_inr: 152.9, volume: 353, condition: 'Good', lastRouted: '2026-07-25 13:15' },
  { id: 'SRR-0036', route: 'Recycle Vendor', category: 'Beauty & Health', channel: 'Corporate Bulk', priority: 'Low', recovery_pct: 36.6, transit_days: 7, cost_inr: 20.6, volume: 490, condition: 'Good', lastRouted: '2026-07-28 08:42' },
  { id: 'SRR-0037', route: 'Manufacturer Return', category: 'Sports & Outdoor', channel: 'Online E-com', priority: 'Critical', recovery_pct: 93.6, transit_days: 11, cost_inr: 193.2, volume: 530, condition: 'Good', lastRouted: '2026-07-06 13:37' },
  { id: 'SRR-0038', route: 'Liquidation Auction', category: 'Books & Media', channel: 'Retail Store', priority: 'High', recovery_pct: 42.4, transit_days: 3, cost_inr: 84.0, volume: 672, condition: 'Defective', lastRouted: '2026-07-06 05:39' },
  { id: 'SRR-0039', route: 'Exchange Stock', category: 'Toys & Games', channel: 'COD Reject', priority: 'Medium', recovery_pct: 57.0, transit_days: 2, cost_inr: 216.5, volume: 89, condition: 'Fair', lastRouted: '2026-07-09 12:50' },
  { id: 'SRR-0040', route: 'Scrap Disposal', category: 'Food & Beverages', channel: 'Warranty Claim', priority: 'Low', recovery_pct: 44.9, transit_days: 12, cost_inr: 187.9, volume: 466, condition: 'Fair', lastRouted: '2026-07-01 23:37' },
  { id: 'SRR-0041', route: 'Refurbish Center', category: 'Electronics', channel: 'Subscription Cancel', priority: 'Critical', recovery_pct: 39.3, transit_days: 9, cost_inr: 155.6, volume: 124, condition: 'Defective', lastRouted: '2026-07-25 00:16' },
  { id: 'SRR-0042', route: 'Donate Charity', category: 'Apparel', channel: 'Corporate Bulk', priority: 'High', recovery_pct: 55.5, transit_days: 1, cost_inr: 21.4, volume: 647, condition: 'Defective', lastRouted: '2026-07-25 03:20' },
  { id: 'SRR-0043', route: 'Resell Marketplace', category: 'Home & Kitchen', channel: 'Online E-com', priority: 'Medium', recovery_pct: 78.2, transit_days: 1, cost_inr: 128.7, volume: 336, condition: 'Damaged', lastRouted: '2026-07-09 14:10' },
  { id: 'SRR-0044', route: 'Recycle Vendor', category: 'Beauty & Health', channel: 'Retail Store', priority: 'Low', recovery_pct: 30.2, transit_days: 7, cost_inr: 178.9, volume: 195, condition: 'Good', lastRouted: '2026-07-01 23:44' },
  { id: 'SRR-0045', route: 'Manufacturer Return', category: 'Sports & Outdoor', channel: 'COD Reject', priority: 'Critical', recovery_pct: 63.1, transit_days: 4, cost_inr: 55.6, volume: 304, condition: 'Defective', lastRouted: '2026-07-01 13:07' },
  { id: 'SRR-0046', route: 'Liquidation Auction', category: 'Books & Media', channel: 'Warranty Claim', priority: 'High', recovery_pct: 26.6, transit_days: 5, cost_inr: 127.0, volume: 765, condition: 'Good', lastRouted: '2026-07-22 00:33' },
  { id: 'SRR-0047', route: 'Exchange Stock', category: 'Toys & Games', channel: 'Subscription Cancel', priority: 'Medium', recovery_pct: 90.5, transit_days: 2, cost_inr: 224.7, volume: 269, condition: 'Like New', lastRouted: '2026-07-29 22:12' },
  { id: 'SRR-0048', route: 'Scrap Disposal', category: 'Food & Beverages', channel: 'Corporate Bulk', priority: 'Low', recovery_pct: 67.5, transit_days: 11, cost_inr: 99.5, volume: 297, condition: 'Defective', lastRouted: '2026-07-29 02:56' },
  { id: 'SRR-0049', route: 'Refurbish Center', category: 'Electronics', channel: 'Online E-com', priority: 'Critical', recovery_pct: 35.9, transit_days: 6, cost_inr: 48.7, volume: 84, condition: 'Defective', lastRouted: '2026-07-28 11:46' },
  { id: 'SRR-0050', route: 'Donate Charity', category: 'Apparel', channel: 'Retail Store', priority: 'High', recovery_pct: 55.2, transit_days: 3, cost_inr: 202.3, volume: 63, condition: 'Fair', lastRouted: '2026-07-23 04:26' },
  { id: 'SRR-0051', route: 'Resell Marketplace', category: 'Home & Kitchen', channel: 'COD Reject', priority: 'Medium', recovery_pct: 30.9, transit_days: 4, cost_inr: 72.5, volume: 111, condition: 'Defective', lastRouted: '2026-07-03 13:25' },
  { id: 'SRR-0052', route: 'Recycle Vendor', category: 'Beauty & Health', channel: 'Warranty Claim', priority: 'Low', recovery_pct: 41.1, transit_days: 4, cost_inr: 163.7, volume: 745, condition: 'Defective', lastRouted: '2026-07-18 00:14' },
  { id: 'SRR-0053', route: 'Manufacturer Return', category: 'Sports & Outdoor', channel: 'Subscription Cancel', priority: 'Critical', recovery_pct: 49.7, transit_days: 2, cost_inr: 236.3, volume: 112, condition: 'Good', lastRouted: '2026-07-25 20:01' },
  { id: 'SRR-0054', route: 'Liquidation Auction', category: 'Books & Media', channel: 'Corporate Bulk', priority: 'High', recovery_pct: 56.4, transit_days: 8, cost_inr: 253.3, volume: 743, condition: 'Damaged', lastRouted: '2026-07-24 11:14' },
  { id: 'SRR-0055', route: 'Exchange Stock', category: 'Toys & Games', channel: 'Online E-com', priority: 'Medium', recovery_pct: 47.4, transit_days: 4, cost_inr: 224.3, volume: 378, condition: 'Damaged', lastRouted: '2026-07-03 22:21' },
  { id: 'SRR-0056', route: 'Scrap Disposal', category: 'Food & Beverages', channel: 'Retail Store', priority: 'Low', recovery_pct: 44.3, transit_days: 9, cost_inr: 26.0, volume: 299, condition: 'Good', lastRouted: '2026-07-02 09:10' },
  { id: 'SRR-0057', route: 'Refurbish Center', category: 'Electronics', channel: 'COD Reject', priority: 'Critical', recovery_pct: 42.9, transit_days: 11, cost_inr: 98.5, volume: 451, condition: 'Like New', lastRouted: '2026-07-10 19:04' },
  { id: 'SRR-0058', route: 'Donate Charity', category: 'Apparel', channel: 'Warranty Claim', priority: 'High', recovery_pct: 25.6, transit_days: 2, cost_inr: 116.7, volume: 584, condition: 'Good', lastRouted: '2026-07-18 08:31' },
  { id: 'SRR-0059', route: 'Resell Marketplace', category: 'Home & Kitchen', channel: 'Subscription Cancel', priority: 'Medium', recovery_pct: 71.4, transit_days: 4, cost_inr: 133.2, volume: 216, condition: 'Fair', lastRouted: '2026-07-15 14:17' },
  { id: 'SRR-0060', route: 'Recycle Vendor', category: 'Beauty & Health', channel: 'Corporate Bulk', priority: 'Low', recovery_pct: 65.1, transit_days: 2, cost_inr: 119.7, volume: 312, condition: 'Defective', lastRouted: '2026-07-21 14:26' },
]

const weeklyData = [
  { week: 'W1', routed: 205, recovered: 596, costAvg: 76.9 },
  { week: 'W2', routed: 689, recovered: 453, costAvg: 65.8 },
  { week: 'W3', routed: 756, recovered: 563, costAvg: 122.6 },
  { week: 'W4', routed: 430, recovered: 251, costAvg: 54.5 },
  { week: 'W5', routed: 422, recovered: 456, costAvg: 126.0 },
  { week: 'W6', routed: 316, recovered: 267, costAvg: 73.4 },
  { week: 'W7', routed: 239, recovered: 574, costAvg: 142.9 },
  { week: 'W8', routed: 407, recovered: 340, costAvg: 174.3 },
  { week: 'W9', routed: 789, recovered: 511, costAvg: 162.4 },
  { week: 'W10', routed: 865, recovered: 196, costAvg: 103.2 },
  { week: 'W11', routed: 411, recovered: 232, costAvg: 157.7 },
  { week: 'W12', routed: 617, recovered: 169, costAvg: 165.7 },
]

const routeDist = [
  { name: 'Refurbish Center', value: 169 },
  { name: 'Donate Charity', value: 148 },
  { name: 'Resell Marketplace', value: 51 },
  { name: 'Recycle Vendor', value: 113 },
  { name: 'Manufacturer Return', value: 71 },
  { name: 'Liquidation Auction', value: 171 },
  { name: 'Exchange Stock', value: 178 },
  { name: 'Scrap Disposal', value: 106 },
]

const filterGroups = [
  { key: 'route', label: 'Route', options: ROUTES.map(r => ({ value: r, label: r, count: 0 })) },
  { key: 'category', label: 'Category', options: CATEGORIES.map(c => ({ value: c, label: c, count: 0 })) },
  { key: 'channel', label: 'Channel', options: CHANNELS.map(c => ({ value: c, label: c, count: 0 })) },
]

function RouteBadge({ route }: { route: string }) {
  const color = route === 'Refurbish Center' ? 'bg-teal-500/15 text-teal-400' : route === 'Donate Charity' ? 'bg-lime-500/15 text-lime-400' : route === 'Resell Marketplace' ? 'bg-cyan-500/15 text-cyan-400' : route === 'Recycle Vendor' ? 'bg-emerald-500/15 text-emerald-400' : route === 'Manufacturer Return' ? 'bg-amber-500/15 text-amber-400' : route === 'Liquidation Auction' ? 'bg-pink-500/15 text-pink-400' : route === 'Exchange Stock' ? 'bg-indigo-500/15 text-indigo-400' : 'bg-orange-500/15 text-orange-400'
  return <span className={'srr-route-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{route}</span>
}

function ChannelBadge({ channel }: { channel: string }) {
  const color = channel === 'Online E-com' ? 'bg-blue-500/15 text-blue-400' : channel === 'Retail Store' ? 'bg-violet-500/15 text-violet-400' : channel === 'COD Reject' ? 'bg-red-500/15 text-red-400' : channel === 'Warranty Claim' ? 'bg-emerald-500/15 text-emerald-400' : channel === 'Subscription Cancel' ? 'bg-amber-500/15 text-amber-400' : 'bg-orange-500/15 text-orange-400'
  return <span className={'srr-channel-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{channel}</span>
}

function PriorityBadge({ priority }: { priority: string }) {
  const color = priority === 'Critical' ? 'bg-red-500/15 text-red-400' : priority === 'High' ? 'bg-orange-500/15 text-orange-400' : priority === 'Medium' ? 'bg-amber-500/15 text-amber-400' : 'bg-blue-500/15 text-blue-400'
  return <span className={'srr-priority-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{priority}</span>
}

function RecoveryBar({ value }: { value: number }) {
  const w = value
  const color = value >= 70 ? 'bg-emerald-500' : value >= 50 ? 'bg-amber-500' : 'bg-red-500'
  return <div className='srr-recovery-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className={'h-full rounded-full srr-recovery-fill ' + color} style={{ width: w + '%', animation: 'srr-grow 1s ease-out' }}/></div>
}

function CostBar({ value }: { value: number }) {
  const w = Math.min(value / 2.8, 100)
  return <div className='srr-cost-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className='h-full rounded-full bg-teal-500 srr-cost-fill' style={{ width: w + '%', animation: 'srr-grow 1s ease-out' }}/></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, c = 2 * Math.PI * r, offset = c - (value / 100) * c
  return <div className='srr-ring flex flex-col items-center'><svg width='70' height='70' className='-rotate-90'><circle cx='35' cy='35' r={r} fill='none' stroke='#27272a' strokeWidth='5'/><circle cx='35' cy='35' r={r} fill='none' stroke={color} strokeWidth='5' strokeDasharray={c} strokeDashoffset={offset} strokeLinecap='round' className='srr-ring-path' style={{ transition: 'stroke-dashoffset 1s ease' }}/></svg><span className='srr-ring-val text-sm font-bold mt-1' style={{ color }}>{value}%</span><span className='srr-ring-label text-[10px] text-zinc-500'>{label}</span></div>
}

function KpiTile({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return <div className='srr-kpi bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 srr-kpi-card'><p className='text-xs text-zinc-500 mb-1'>{label}</p><p className={'text-xl font-bold ' + color}>{value}</p><p className='text-[10px] text-zinc-400 mt-1'>{sub}</p></div>
}

function ValueTile({ label, value, change }: { label: string; value: string; change: string }) {
  const up = change.startsWith('+')
  return <div className='srr-value-tile bg-zinc-900/60 border border-zinc-800 rounded-lg p-3'><p className='text-xs text-zinc-500'>{label}</p><p className='text-lg font-bold text-white mt-1'>{value}</p><p className={'text-xs mt-1 ' + (up ? 'text-emerald-400' : 'text-red-400')}>{change}</p></div>
}

const insights = [
  { title: 'Electronics Refurbish Revenue Surge', desc: 'Refurbish Center route for electronics generated INR 2.4Cr revenue this month, up 35% from refurbished smartphones and laptops. AI grading system achieving 92% accuracy in condition assessment. Recommend expanding to 2 additional refurbish centers in Pune and Hyderabad.', severity: 'high' },
  { title: 'COD Reject Route Optimization', desc: 'COD rejection rate reduced from 18% to 11% after implementing pre-paid incentive program and dynamic routing. Returns from COD channel rerouted to Exchange Stock at 68% recovery rate vs previous Liquidation at 22%. Net savings: INR 45L per month.', severity: 'medium' },
  { title: 'Charity Donation Partnership Expansion', desc: 'New MoU signed with 5 NGOs for apparel and home goods donation channel. Tax benefit recovery improved from INR 12/unit to INR 28/unit. Environmental impact: 4.2 tons diverted from landfill. CSR compliance score improved to 95/100.', severity: 'low' },
  { title: 'AI Route Assignment Engine v3', desc: 'New ML-based route assignment engine considers 14 factors including item condition, market demand, logistics cost, and environmental impact. Average recovery value improved by 22% while reducing transit time by 1.8 days. Processing cost reduced by INR 8 per unit.', severity: 'medium' },
]

export default function SmartReturnsRoutingView() {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [tab, setTab] = useState('dashboard')

  const toggleFilter = (key: string, val: string) => {
    setActiveFilters(prev => { const cur = prev[key] || []; const next = cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val]; return { ...prev, [key]: next } })
  }

  const filtered = returns.filter(r => {
    for (const [key, vals] of Object.entries(activeFilters)) { if (vals.length > 0 && !vals.includes(r[key as keyof typeof r] as string)) return false }
    if (searchQuery && !Object.values(r).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))) return false
    return true
  })

  return (
    <div className='srr-root space-y-4 p-4'>
      <PageHeader title='Smart Returns Routing' description='AI-powered reverse logistics routing & recovery optimization' />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className='srr-tabs-list bg-zinc-900 border border-zinc-800'>
          <TabsTrigger value='dashboard' className='srr-tab'>Dashboard</TabsTrigger>
          <TabsTrigger value='routes' className='srr-tab'>Routes</TabsTrigger>
          <TabsTrigger value='analytics' className='srr-tab'>Analytics</TabsTrigger>
          <TabsTrigger value='insights' className='srr-tab'>Insights</TabsTrigger>
        </TabsList>
        <TabsContent value='dashboard' className='srr-tab-content space-y-4 mt-4'>
          <div className='srr-kpi-row grid grid-cols-2 lg:grid-cols-4 gap-3'>
            <KpiTile label='Returns Routed' value='8,456' sub='+340 this week' color='text-teal-400' />
            <KpiTile label='Recovery Rate' value='68.4%' sub='+4.2pp vs Q1' color='text-lime-400' />
            <KpiTile label='Revenue Recovered' value='INR 5.8Cr' sub='+INR 1.2Cr MoM' color='text-emerald-400' />
            <KpiTile label='Avg Transit' value='4.2 days' sub='-1.1 day improvement' color='text-cyan-400' />
          </div>
          <div className='srr-ring-row flex flex-wrap justify-around gap-2'>
            <HealthRing value={68} label='Recovery' color='#14b8a6' />
            <HealthRing value={82} label='Speed' color='#84cc16' />
            <HealthRing value={74} label='Accuracy' color='#06b6d4' />
            <HealthRing value={91} label='Compliance' color='#10b981' />
            <HealthRing value={65} label='Sustainability' color='#f59e0b' />
            <HealthRing value={88} label='Automation' color='#ec4899' />
          </div>
          <div className='srr-chart-row grid grid-cols-1 lg:grid-cols-3 gap-4'>
            <Card className='srr-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Weekly Returns Volume</CardTitle></CardHeader><CardContent><LineChart data={weeklyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='week' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Line type='monotone' dataKey='routed' stroke='#14b8a6' strokeWidth={2} dot={false}/><Line type='monotone' dataKey='recovered' stroke='#84cc16' strokeWidth={2} dot={false}/></LineChart></CardContent></Card>
            <Card className='srr-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Avg Processing Cost</CardTitle></CardHeader><CardContent><BarChart data={weeklyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='week' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Bar dataKey='costAvg' fill='#06b6d4' radius={[4,4,0,0]}/></BarChart></CardContent></Card>
            <Card className='srr-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Route Distribution</CardTitle></CardHeader><CardContent><PieChart width={350} height={200}><Pie data={routeDist} cx='50%' cy='50%' outerRadius={70} innerRadius={35} dataKey='value' paddingAngle={2}>{routeDist.map((_, i) => <Cell key={i} fill={COLORS[i % 8]} />)}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value='routes' className='srr-tab-content space-y-4 mt-4'>
          <ModuleBreadcrumb items={[{ label: 'Smart Returns' }, { label: 'Routes' }]} />
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => { setActiveFilters({}); setSearchQuery('') }} totalItems={returns.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder='Search returns by ID, route, category, channel...' />
          <Card className='srr-table-card bg-zinc-900/60 border-zinc-800'><CardContent className='p-0'><div className='srr-table-wrap overflow-x-auto max-h-[400px] overflow-y-auto'><table className='srr-table w-full text-sm'><thead><tr className='border-b border-zinc-800'><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>ID</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Route</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Category</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Priority</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Recovery</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Cost</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Transit</th><th className='text-right px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Volume</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Channel</th></tr></thead><tbody>
          {filtered.map(r => (
            <tr key={r.id} className='srr-table-row border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors'>
              <td className='px-3 py-2 font-mono text-xs text-teal-400'>{r.id}</td>
              <td className='px-3 py-2'><RouteBadge route={r.route} /></td>
              <td className='px-3 py-2 text-xs text-zinc-300'>{r.category}</td>
              <td className='px-3 py-2'><PriorityBadge priority={r.priority} /></td>
              <td className='px-3 py-2 w-24'><RecoveryBar value={r.recovery_pct} /><span className='text-[10px] text-zinc-500 ml-1'>{r.recovery_pct}%</span></td>
              <td className='px-3 py-2 w-24'><CostBar value={r.cost_inr} /><span className='text-[10px] text-zinc-500 ml-1'>INR {r.cost_inr}</span></td>
              <td className='px-3 py-2 text-xs text-zinc-400'>{r.transit_days}d</td>
              <td className='px-3 py-2 text-right text-xs'>{r.volume}</td>
              <td className='px-3 py-2'><ChannelBadge channel={r.channel} /></td>
            </tr>
          ))})
          </tbody></table></div></CardContent></Card>
        </TabsContent>
        <TabsContent value='analytics' className='srr-tab-content space-y-4 mt-4'>
          <div className='srr-value-row grid grid-cols-2 lg:grid-cols-4 gap-3'>
            <ValueTile label='Total Recovery Value' value='INR 12.4Cr' change='+28% YoY' />
            <ValueTile label='Items Processed' value='48,290' change='+5,200 this month' />
            <ValueTile label='Carbon Diverted' value='18.6 tons' change='-4.2 tons landfill' />
            <ValueTile label='Routes Active' value='8' change='+1 new' />
          </div>
          <div className='srr-analytics-charts grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <Card className='srr-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Category Recovery Rates</CardTitle></CardHeader><CardContent><BarChart data={CATEGORIES.map((c,i) => ({ name: c.split(' ')[0], recovery: [72,58,64,78,55,82,48,91][i], volume: [420,380,310,290,180,350,120,450][i] }))} width={450} height={220}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='name' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Bar dataKey='recovery' fill='#14b8a6' radius={[4,4,0,0]}/><Bar dataKey='volume' fill='#84cc16' radius={[4,4,0,0]}/></BarChart></CardContent></Card>
            <Card className='srr-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Channel Mix</CardTitle></CardHeader><CardContent><PieChart width={450} height={220}><Pie data={[{ name: 'Online E-com', value: 38 }, { name: 'COD Reject', value: 22 }, { name: 'Retail Store', value: 18 }, { name: 'Warranty', value: 12 }, { name: 'Subscription', value: 6 }, { name: 'Corporate', value: 4 }]} cx='50%' cy='50%' outerRadius={80} innerRadius={40} dataKey='value' paddingAngle={3}>{[<Cell key={0} fill='#3b82f6' />, <Cell key={1} fill='#ef4444' />, <Cell key={2} fill='#8b5cf6' />, <Cell key={3} fill='#10b981' />, <Cell key={4} fill='#f59e0b' />, <Cell key={5} fill='#f97316' />]}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value='insights' className='srr-tab-content space-y-4 mt-4'>
          {insights.map((ins, i) => (
            <Card key={i} className={'srr-insight-card bg-zinc-900/60 border ' + (ins.severity === 'high' ? 'border-teal-500/30' : ins.severity === 'medium' ? 'border-lime-500/30' : 'border-zinc-800')}><CardContent className='p-4'><div className='flex items-start gap-3'><div className={'srr-insight-dot w-2 h-2 rounded-full mt-1.5 shrink-0 ' + (ins.severity === 'high' ? 'bg-teal-500' : ins.severity === 'medium' ? 'bg-lime-500' : 'bg-zinc-500')} /><div><p className='text-sm font-medium text-zinc-200'>{ins.title}</p><p className='text-xs text-zinc-400 mt-1 leading-relaxed'>{ins.desc}</p></div></div></CardContent></Card>
          ))})
        </TabsContent>
      </Tabs>
    </div>
  )
}
