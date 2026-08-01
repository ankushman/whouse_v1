import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#f43f5e', '#64748b', '#eab308', '#10b981', '#06b6d4', '#6366f1', '#ec4899', '#84cc16']

const RISK_CATEGORIES = ['Supplier Default', 'Demand Volatility', 'Geopolitical', 'Natural Disaster', 'Currency Fluctuation', 'Regulatory Change', 'Cyber Threat', 'Quality Failure']
const REGIONS = ['North India', 'South India', 'West India', 'East India', 'Central India', 'NE India', 'Border Region', 'Coastal Belt']
const SEVERITIES = ['Critical', 'High', 'Medium', 'Low']

const risks = [
  { id: 'SCR-0001', category: 'Supplier Default', region: 'North India', severity: 'Critical', impact_score: 92, probability: 78, exposure_inr: 4200000, mitigation_status: 'Active', owner: 'Procurement', last_assessed: '2026-07-28 05:55' },
  { id: 'SCR-0002', category: 'Demand Volatility', region: 'South India', severity: 'High', impact_score: 68, probability: 85, exposure_inr: 1890000, mitigation_status: 'Monitoring', owner: 'Sales Ops', last_assessed: '2026-07-27 14:28' },
  { id: 'SCR-0003', category: 'Geopolitical', region: 'Border Region', severity: 'Critical', impact_score: 95, probability: 42, exposure_inr: 8900000, mitigation_status: 'Escalated', owner: 'Exec Office', last_assessed: '2026-07-26 22:36' },
  { id: 'SCR-0004', category: 'Natural Disaster', region: 'Coastal Belt', severity: 'Medium', impact_score: 72, probability: 35, exposure_inr: 320000, mitigation_status: 'Planned', owner: 'Safety', last_assessed: '2026-07-25 11:25' },
  { id: 'SCR-0005', category: 'Currency Fluctuation', region: 'West India', severity: 'High', impact_score: 58, probability: 90, exposure_inr: 5600000, mitigation_status: 'Active', owner: 'Finance', last_assessed: '2026-07-28 15:05' },
  { id: 'SCR-0006', category: 'Regulatory Change', region: 'Central India', severity: 'Medium', impact_score: 45, probability: 62, exposure_inr: 780000, mitigation_status: 'Monitoring', owner: 'Legal', last_assessed: '2026-07-26 12:07' },
  { id: 'SCR-0007', category: 'Cyber Threat', region: 'North India', severity: 'Critical', impact_score: 88, probability: 55, exposure_inr: 6500000, mitigation_status: 'Escalated', owner: 'IT Security', last_assessed: '2026-07-24 08:14' },
  { id: 'SCR-0008', category: 'Quality Failure', region: 'East India', severity: 'Low', impact_score: 32, probability: 48, exposure_inr: 450000, mitigation_status: 'Resolved', owner: 'QA', last_assessed: '2026-07-22 02:25' },
  { id: 'SCR-0009', category: 'Supplier Default', region: 'South India', severity: 'High', impact_score: 74, probability: 70, exposure_inr: 3100000, mitigation_status: 'Active', owner: 'Procurement', last_assessed: '2026-07-28 09:41' },
  { id: 'SCR-0010', category: 'Demand Volatility', region: 'West India', severity: 'Medium', impact_score: 52, probability: 82, exposure_inr: 1450000, mitigation_status: 'Monitoring', owner: 'Sales Ops', last_assessed: '2026-07-27 21:02' },
  { id: 'SCR-0011', category: 'Geopolitical', region: 'NE India', severity: 'High', impact_score: 80, probability: 38, exposure_inr: 7200000, mitigation_status: 'Planned', owner: 'Exec Office', last_assessed: '2026-07-26 16:37' },
  { id: 'SCR-0012', category: 'Natural Disaster', region: 'Coastal Belt', severity: 'Critical', impact_score: 96, probability: 30, exposure_inr: 9800000, mitigation_status: 'Escalated', owner: 'Safety', last_assessed: '2026-07-25 17:43' },
  { id: 'SCR-0013', category: 'Currency Fluctuation', region: 'North India', severity: 'Medium', impact_score: 55, probability: 88, exposure_inr: 4800000, mitigation_status: 'Active', owner: 'Finance', last_assessed: '2026-07-28 03:07' },
  { id: 'SCR-0014', category: 'Regulatory Change', region: 'South India', severity: 'Low', impact_score: 38, probability: 55, exposure_inr: 920000, mitigation_status: 'Monitoring', owner: 'Legal', last_assessed: '2026-07-24 20:18' },
  { id: 'SCR-0015', category: 'Cyber Threat', region: 'West India', severity: 'High', impact_score: 82, probability: 60, exposure_inr: 5400000, mitigation_status: 'Active', owner: 'IT Security', last_assessed: '2026-07-28 11:20' },
  { id: 'SCR-0016', category: 'Quality Failure', region: 'Central India', severity: 'Medium', impact_score: 48, probability: 52, exposure_inr: 680000, mitigation_status: 'Resolved', owner: 'QA', last_assessed: '2026-07-26 06:44' },
  { id: 'SCR-0017', category: 'Supplier Default', region: 'East India', severity: 'Critical', impact_score: 90, probability: 72, exposure_inr: 6100000, mitigation_status: 'Escalated', owner: 'Procurement', last_assessed: '2026-07-25 22:55' },
  { id: 'SCR-0018', category: 'Demand Volatility', region: 'NE India', severity: 'High', impact_score: 65, probability: 78, exposure_inr: 2200000, mitigation_status: 'Monitoring', owner: 'Sales Ops', last_assessed: '2026-07-27 14:34' },
  { id: 'SCR-0019', category: 'Geopolitical', region: 'Border Region', severity: 'Medium', impact_score: 70, probability: 45, exposure_inr: 4500000, mitigation_status: 'Planned', owner: 'Exec Office', last_assessed: '2026-07-28 07:59' },
  { id: 'SCR-0020', category: 'Natural Disaster', region: 'South India', severity: 'Low', impact_score: 35, probability: 28, exposure_inr: 380000, mitigation_status: 'Resolved', owner: 'Safety', last_assessed: '2026-07-26 10:18' },
  { id: 'SCR-0021', category: 'Currency Fluctuation', region: 'Central India', severity: 'High', impact_score: 62, probability: 92, exposure_inr: 5200000, mitigation_status: 'Active', owner: 'Finance', last_assessed: '2026-07-28 16:24' },
  { id: 'SCR-0022', category: 'Regulatory Change', region: 'Coastal Belt', severity: 'Critical', impact_score: 78, probability: 58, exposure_inr: 3800000, mitigation_status: 'Escalated', owner: 'Legal', last_assessed: '2026-07-25 08:55' },
  { id: 'SCR-0023', category: 'Cyber Threat', region: 'North India', severity: 'Medium', impact_score: 50, probability: 65, exposure_inr: 2900000, mitigation_status: 'Active', owner: 'IT Security', last_assessed: '2026-07-27 12:51' },
  { id: 'SCR-0024', category: 'Quality Failure', region: 'West India', severity: 'High', impact_score: 60, probability: 44, exposure_inr: 1800000, mitigation_status: 'Monitoring', owner: 'QA', last_assessed: '2026-07-24 17:51' },
  { id: 'SCR-0025', category: 'Supplier Default', region: 'South India', severity: 'Medium', impact_score: 55, probability: 68, exposure_inr: 2400000, mitigation_status: 'Active', owner: 'Procurement', last_assessed: '2026-07-28 03:48' },
  { id: 'SCR-0026', category: 'Demand Volatility', region: 'Central India', severity: 'Critical', impact_score: 85, probability: 80, exposure_inr: 7600000, mitigation_status: 'Escalated', owner: 'Sales Ops', last_assessed: '2026-07-26 21:06' },
  { id: 'SCR-0027', category: 'Geopolitical', region: 'East India', severity: 'Low', impact_score: 40, probability: 32, exposure_inr: 850000, mitigation_status: 'Monitoring', owner: 'Exec Office', last_assessed: '2026-07-28 14:22' },
  { id: 'SCR-0028', category: 'Natural Disaster', region: 'NE India', severity: 'High', impact_score: 75, probability: 40, exposure_inr: 3200000, mitigation_status: 'Planned', owner: 'Safety', last_assessed: '2026-07-25 09:33' },
  { id: 'SCR-0029', category: 'Currency Fluctuation', region: 'Coastal Belt', severity: 'Medium', impact_score: 58, probability: 86, exposure_inr: 4100000, mitigation_status: 'Active', owner: 'Finance', last_assessed: '2026-07-27 05:58' },
  { id: 'SCR-0030', category: 'Regulatory Change', region: 'North India', severity: 'High', impact_score: 68, probability: 50, exposure_inr: 2600000, mitigation_status: 'Monitoring', owner: 'Legal', last_assessed: '2026-07-28 09:33' },
  { id: 'SCR-0031', category: 'Cyber Threat', region: 'South India', severity: 'Critical', impact_score: 91, probability: 52, exposure_inr: 7200000, mitigation_status: 'Escalated', owner: 'IT Security', last_assessed: '2026-07-26 11:07' },
  { id: 'SCR-0032', category: 'Quality Failure', region: 'East India', severity: 'Low', impact_score: 30, probability: 38, exposure_inr: 520000, mitigation_status: 'Resolved', owner: 'QA', last_assessed: '2026-07-25 22:15' },
  { id: 'SCR-0033', category: 'Supplier Default', region: 'West India', severity: 'High', impact_score: 72, probability: 65, exposure_inr: 3800000, mitigation_status: 'Active', owner: 'Procurement', last_assessed: '2026-07-28 17:33' },
  { id: 'SCR-0034', category: 'Demand Volatility', region: 'Border Region', severity: 'Medium', impact_score: 48, probability: 75, exposure_inr: 1600000, mitigation_status: 'Monitoring', owner: 'Sales Ops', last_assessed: '2026-07-26 04:28' },
  { id: 'SCR-0035', category: 'Geopolitical', region: 'Coastal Belt', severity: 'Critical', impact_score: 94, probability: 36, exposure_inr: 8500000, mitigation_status: 'Escalated', owner: 'Exec Office', last_assessed: '2026-07-28 07:59' },
  { id: 'SCR-0036', category: 'Natural Disaster', region: 'Central India', severity: 'Low', impact_score: 42, probability: 25, exposure_inr: 640000, mitigation_status: 'Planned', owner: 'Safety', last_assessed: '2026-07-27 15:24' },
  { id: 'SCR-0037', category: 'Currency Fluctuation', region: 'NE India', severity: 'High', impact_score: 64, probability: 84, exposure_inr: 4600000, mitigation_status: 'Active', owner: 'Finance', last_assessed: '2026-07-28 01:58' },
  { id: 'SCR-0038', category: 'Regulatory Change', region: 'South India', severity: 'Medium', impact_score: 52, probability: 58, exposure_inr: 1900000, mitigation_status: 'Monitoring', owner: 'Legal', last_assessed: '2026-07-26 19:48' },
  { id: 'SCR-0039', category: 'Cyber Threat', region: 'West India', severity: 'High', impact_score: 78, probability: 62, exposure_inr: 5800000, mitigation_status: 'Active', owner: 'IT Security', last_assessed: '2026-07-28 10:06' },
  { id: 'SCR-0040', category: 'Quality Failure', region: 'North India', severity: 'Medium', impact_score: 44, probability: 50, exposure_inr: 720000, mitigation_status: 'Resolved', owner: 'QA', last_assessed: '2026-07-25 16:05' },
  { id: 'SCR-0041', category: 'Supplier Default', region: 'Central India', severity: 'Low', impact_score: 36, probability: 42, exposure_inr: 1100000, mitigation_status: 'Monitoring', owner: 'Procurement', last_assessed: '2026-07-28 06:19' },
  { id: 'SCR-0042', category: 'Demand Volatility', region: 'Coastal Belt', severity: 'High', impact_score: 70, probability: 76, exposure_inr: 3400000, mitigation_status: 'Active', owner: 'Sales Ops', last_assessed: '2026-07-26 08:27' },
  { id: 'SCR-0043', category: 'Geopolitical', region: 'NE India', severity: 'Medium', impact_score: 62, probability: 40, exposure_inr: 2800000, mitigation_status: 'Planned', owner: 'Exec Office', last_assessed: '2026-07-28 12:51' },
  { id: 'SCR-0044', category: 'Natural Disaster', region: 'West India', severity: 'Critical', impact_score: 88, probability: 33, exposure_inr: 6900000, mitigation_status: 'Escalated', owner: 'Safety', last_assessed: '2026-07-27 20:34' },
  { id: 'SCR-0045', category: 'Currency Fluctuation', region: 'South India', severity: 'Low', impact_score: 42, probability: 88, exposure_inr: 3500000, mitigation_status: 'Active', owner: 'Finance', last_assessed: '2026-07-25 14:33' },
  { id: 'SCR-0046', category: 'Regulatory Change', region: 'East India', severity: 'High', impact_score: 66, probability: 48, exposure_inr: 2100000, mitigation_status: 'Monitoring', owner: 'Legal', last_assessed: '2026-07-28 01:24' },
  { id: 'SCR-0047', category: 'Cyber Threat', region: 'Central India', severity: 'Medium', impact_score: 54, probability: 58, exposure_inr: 2400000, mitigation_status: 'Active', owner: 'IT Security', last_assessed: '2026-07-26 14:33' },
  { id: 'SCR-0048', category: 'Quality Failure', region: 'Border Region', severity: 'Critical', impact_score: 84, probability: 36, exposure_inr: 4100000, mitigation_status: 'Escalated', owner: 'QA', last_assessed: '2026-07-28 08:14' },
  { id: 'SCR-0049', category: 'Supplier Default', region: 'Coastal Belt', severity: 'High', impact_score: 76, probability: 60, exposure_inr: 3200000, mitigation_status: 'Active', owner: 'Procurement', last_assessed: '2026-07-27 20:08' },
  { id: 'SCR-0050', category: 'Demand Volatility', region: 'NE India', severity: 'Medium', impact_score: 50, probability: 72, exposure_inr: 1800000, mitigation_status: 'Monitoring', owner: 'Sales Ops', last_assessed: '2026-07-25 18:41' },
  { id: 'SCR-0051', category: 'Geopolitical', region: 'North India', severity: 'Low', impact_score: 38, probability: 34, exposure_inr: 1200000, mitigation_status: 'Monitoring', owner: 'Exec Office', last_assessed: '2026-07-28 11:46' },
  { id: 'SCR-0052', category: 'Natural Disaster', region: 'South India', severity: 'High', impact_score: 73, probability: 38, exposure_inr: 2800000, mitigation_status: 'Planned', owner: 'Safety', last_assessed: '2026-07-26 07:22' },
  { id: 'SCR-0053', category: 'Currency Fluctuation', region: 'West India', severity: 'Critical', impact_score: 86, probability: 94, exposure_inr: 8200000, mitigation_status: 'Escalated', owner: 'Finance', last_assessed: '2026-07-28 15:39' },
  { id: 'SCR-0054', category: 'Regulatory Change', region: 'Central India', severity: 'Medium', impact_score: 46, probability: 56, exposure_inr: 1500000, mitigation_status: 'Monitoring', owner: 'Legal', last_assessed: '2026-07-27 13:55' },
  { id: 'SCR-0055', category: 'Cyber Threat', region: 'East India', severity: 'High', impact_score: 80, probability: 58, exposure_inr: 5100000, mitigation_status: 'Active', owner: 'IT Security', last_assessed: '2026-07-26 17:33' },
  { id: 'SCR-0056', category: 'Quality Failure', region: 'Coastal Belt', severity: 'Low', impact_score: 34, probability: 42, exposure_inr: 580000, mitigation_status: 'Resolved', owner: 'QA', last_assessed: '2026-07-28 02:48' },
  { id: 'SCR-0057', category: 'Supplier Default', region: 'NE India', severity: 'Medium', impact_score: 58, probability: 66, exposure_inr: 2000000, mitigation_status: 'Active', owner: 'Procurement', last_assessed: '2026-07-25 21:22' },
  { id: 'SCR-0058', category: 'Demand Volatility', region: 'North India', severity: 'Critical', impact_score: 82, probability: 88, exposure_inr: 6800000, mitigation_status: 'Escalated', owner: 'Sales Ops', last_assessed: '2026-07-28 16:05' },
  { id: 'SCR-0059', category: 'Geopolitical', region: 'South India', severity: 'High', impact_score: 71, probability: 42, exposure_inr: 3800000, mitigation_status: 'Planned', owner: 'Exec Office', last_assessed: '2026-07-26 20:05' },
  { id: 'SCR-0060', category: 'Natural Disaster', region: 'Border Region', severity: 'Medium', impact_score: 64, probability: 30, exposure_inr: 2100000, mitigation_status: 'Monitoring', owner: 'Safety', last_assessed: '2026-07-28 12:22' },
]

const hourlyData = [
  { hour: '00:00', alerts: 12, mitigated: 8, exposure_m: 4.2 },
  { hour: '01:00', alerts: 8, mitigated: 5, exposure_m: 2.8 },
  { hour: '02:00', alerts: 15, mitigated: 11, exposure_m: 5.1 },
  { hour: '03:00', alerts: 10, mitigated: 7, exposure_m: 3.6 },
  { hour: '04:00', alerts: 18, mitigated: 14, exposure_m: 6.4 },
  { hour: '05:00', alerts: 6, mitigated: 3, exposure_m: 2.1 },
  { hour: '06:00', alerts: 22, mitigated: 18, exposure_m: 7.8 },
  { hour: '07:00', alerts: 14, mitigated: 10, exposure_m: 4.9 },
  { hour: '08:00', alerts: 9, mitigated: 6, exposure_m: 3.2 },
  { hour: '09:00', alerts: 20, mitigated: 16, exposure_m: 7.1 },
  { hour: '10:00', alerts: 13, mitigated: 9, exposure_m: 4.5 },
  { hour: '11:00', alerts: 24, mitigated: 20, exposure_m: 8.4 },
  { hour: '12:00', alerts: 11, mitigated: 7, exposure_m: 3.8 },
  { hour: '13:00', alerts: 7, mitigated: 4, exposure_m: 2.4 },
  { hour: '14:00', alerts: 19, mitigated: 15, exposure_m: 6.7 },
  { hour: '15:00', alerts: 21, mitigated: 17, exposure_m: 7.4 },
  { hour: '16:00', alerts: 16, mitigated: 12, exposure_m: 5.6 },
  { hour: '17:00', alerts: 13, mitigated: 10, exposure_m: 4.6 },
  { hour: '18:00', alerts: 23, mitigated: 19, exposure_m: 8.1 },
  { hour: '19:00', alerts: 14, mitigated: 11, exposure_m: 4.9 },
  { hour: '20:00', alerts: 17, mitigated: 13, exposure_m: 5.9 },
  { hour: '21:00', alerts: 12, mitigated: 8, exposure_m: 4.2 },
  { hour: '22:00', alerts: 10, mitigated: 7, exposure_m: 3.5 },
  { hour: '23:00', alerts: 8, mitigated: 5, exposure_m: 2.8 },
]

const catDist = [
  { name: 'Supplier Default', value: 142 },
  { name: 'Demand Volatility', value: 198 },
  { name: 'Geopolitical', value: 124 },
  { name: 'Natural Disaster', value: 86 },
  { name: 'Currency', value: 167 },
  { name: 'Regulatory', value: 95 },
  { name: 'Cyber Threat', value: 156 },
  { name: 'Quality Failure', value: 78 },
]

const filterGroups = [
  { key: 'category', label: 'Category', options: RISK_CATEGORIES.map(c => ({ value: c, label: c, count: 0 })) },
  { key: 'region', label: 'Region', options: REGIONS.map(r => ({ value: r, label: r, count: 0 })) },
  { key: 'severity', label: 'Severity', options: SEVERITIES.map(s => ({ value: s, label: s, count: 0 })) },
]

function CategoryBadge({ category }: { category: string }) {
  const color = category === 'Supplier Default' ? 'bg-rose-500/15 text-rose-400' : category === 'Demand Volatility' ? 'bg-slate-500/15 text-slate-400' : category === 'Geopolitical' ? 'bg-red-500/15 text-red-400' : category === 'Natural Disaster' ? 'bg-amber-500/15 text-amber-400' : category === 'Currency Fluctuation' ? 'bg-yellow-500/15 text-yellow-400' : category === 'Regulatory Change' ? 'bg-indigo-500/15 text-indigo-400' : category === 'Cyber Threat' ? 'bg-purple-500/15 text-purple-400' : 'bg-emerald-500/15 text-emerald-400'
  return <span className={'scr-cat-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{category}</span>
}

function SeverityBadge({ severity }: { severity: string }) {
  const color = severity === 'Critical' ? 'bg-red-500/15 text-red-400' : severity === 'High' ? 'bg-rose-500/15 text-rose-400' : severity === 'Medium' ? 'bg-amber-500/15 text-amber-400' : 'bg-slate-500/15 text-slate-400'
  return <span className={'scr-severity-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{severity}</span>
}

function ImpactBar({ value }: { value: number }) {
  const color = value >= 80 ? 'bg-red-500' : value >= 60 ? 'bg-rose-500' : value >= 40 ? 'bg-amber-500' : 'bg-emerald-500'
  return <div className='scr-impact-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className={'h-full rounded-full scr-impact-fill ' + color} style={{ width: value + '%', animation: 'scr-grow 1s ease-out' }}/></div>
}

function ExposureBar({ value, max }: { value: number; max: number }) {
  const w = Math.min((value / max) * 100, 100)
  const color = w >= 80 ? 'bg-red-500' : w >= 50 ? 'bg-rose-500' : w >= 30 ? 'bg-amber-500' : 'bg-emerald-500'
  return <div className='scr-exposure-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className={'h-full rounded-full scr-exposure-fill ' + color} style={{ width: w + '%', animation: 'scr-grow 1s ease-out' }}/></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, c = 2 * Math.PI * r, offset = c - (value / 100) * c
  return <div className='scr-ring flex flex-col items-center'><svg width='70' height='70' className='-rotate-90'><circle cx='35' cy='35' r={r} fill='none' stroke='#27272a' strokeWidth='5'/><circle cx='35' cy='35' r={r} fill='none' stroke={color} strokeWidth='5' strokeDasharray={c} strokeDashoffset={offset} strokeLinecap='round' className='scr-ring-path' style={{ transition: 'stroke-dashoffset 1s ease' }}/></svg><span className='scr-ring-val text-sm font-bold mt-1' style={{ color }}>{value}%</span><span className='scr-ring-label text-[10px] text-zinc-500'>{label}</span></div>
}

function KpiTile({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return <div className='scr-kpi bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 scr-kpi-card'><p className='text-xs text-zinc-500 mb-1'>{label}</p><p className={'text-xl font-bold ' + color}>{value}</p><p className='text-[10px] text-zinc-400 mt-1'>{sub}</p></div>
}

function ValueTile({ label, value, change }: { label: string; value: string; change: string }) {
  const up = change.startsWith('+')
  return <div className='scr-value-tile bg-zinc-900/60 border border-zinc-800 rounded-lg p-3'><p className='text-xs text-zinc-500'>{label}</p><p className='text-lg font-bold text-white mt-1'>{value}</p><p className={'text-xs mt-1 ' + (up ? 'text-emerald-400' : 'text-red-400')}>{change}</p></div>
}

const insights = [
  { title: 'Single-Source Supplier Concentration Risk', desc: '12 critical components sourced from single suppliers in China-Southeast Asia corridor. Earthquake in Taiwan region could disrupt semiconductor supply for 6-8 weeks. Recommend qualifying 2-3 alternative suppliers per critical component and maintaining 45-day safety stock. Estimated mitigation cost: INR 2.8 Cr but avoids INR 45 Cr potential loss.', severity: 'high' },
  { title: 'Monsoon Season Supply Chain Disruption Plan', desc: 'Kolkata and Mumbai port areas facing 30% above-normal rainfall forecast for August 2026. Pre-positioned emergency inventory at 4 inland depots (Nagpur, Indore, Bhopal, Hyderabad). Contingency rail routes activated via DFC network bypassing flooded coastal highways. Real-time water level monitoring at 48 river crossing points on key logistics routes.', severity: 'high' },
  { title: 'RBI Foreign Exchange Exposure Hedging Review', desc: 'Rupee depreciated 4.2% against USD in Q2 2026, impacting import cost for 340 SKUs with overseas sourcing. Finance team implemented dynamic hedging strategy covering 80% of 90-day forward exposure. Unhedged exposure reduced from INR 120 Cr to INR 24 Cr. Recommend expanding hedge coverage to EUR and JPY corridors which remain unhedged at 65% and 78% respectively.', severity: 'medium' },
  { title: 'Cybersecurity Supply Chain Attack Surface Reduction', desc: 'Zero-trust architecture deployment completed for 85% of supplier portal connections. Two-factor authentication now mandatory for all Tier 1 supplier access. AI anomaly detection system flagged 23 suspicious login patterns from previously trusted vendor IPs. Phishing simulation tests show 94% detection rate among procurement staff, up from 72% in Q1. Full zero-trust rollout expected by October 2026.', severity: 'low' },
]

export default function SupplyChainRiskView() {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [tab, setTab] = useState('dashboard')

  const toggleFilter = (key: string, val: string) => {
    setActiveFilters(prev => { const cur = prev[key] || []; const next = cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val]; return { ...prev, [key]: next } })
  }

  const filtered = risks.filter(r => {
    for (const [key, vals] of Object.entries(activeFilters)) { if (vals.length > 0 && !vals.includes(r[key as keyof typeof r] as string)) return false }
    if (searchQuery && !Object.values(r).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))) return false
    return true
  })

  return (
    <div className='scr-root space-y-4 p-4'>
      <PageHeader title='Supply Chain Risk Command' description='Enterprise risk identification, impact assessment & mitigation tracking' />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className='scr-tabs-list bg-zinc-900 border border-zinc-800'>
          <TabsTrigger value='dashboard' className='scr-tab'>Dashboard</TabsTrigger>
          <TabsTrigger value='risks' className='scr-tab'>Risk Register</TabsTrigger>
          <TabsTrigger value='analytics' className='scr-tab'>Analytics</TabsTrigger>
          <TabsTrigger value='insights' className='scr-tab'>Insights</TabsTrigger>
        </TabsList>
        <TabsContent value='dashboard' className='scr-tab-content space-y-4 mt-4'>
          <div className='scr-kpi-row grid grid-cols-2 lg:grid-cols-4 gap-3'>
            <KpiTile label='Active Risks' value='247' sub='+12 new this week' color='text-rose-400' />
            <KpiTile label='Critical Items' value='18' sub='-4 mitigated' color='text-red-400' />
            <KpiTile label='Total Exposure' value='INR 84 Cr' sub='-INR 12 Cr hedged' color='text-amber-400' />
            <KpiTile label='Mitigation Rate' value='78.4%' sub='+3.2pp improved' color='text-emerald-400' />
          </div>
          <div className='scr-ring-row flex flex-wrap justify-around gap-2'>
            <HealthRing value={85} label='Supplier' color='#f43f5e' />
            <HealthRing value={72} label='Demand' color='#64748b' />
            <HealthRing value={90} label='Geo-Political' color='#eab308' />
            <HealthRing value={68} label='Natural' color='#10b981' />
            <HealthRing value={78} label='Currency' color='#06b6d4' />
            <HealthRing value={82} label='Cyber' color='#6366f1' />
          </div>
          <div className='scr-chart-row grid grid-cols-1 lg:grid-cols-3 gap-4'>
            <Card className='scr-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>24hr Risk Alerts/Mitigations</CardTitle></CardHeader><CardContent><LineChart data={hourlyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='hour' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Line type='monotone' dataKey='alerts' stroke='#f43f5e' strokeWidth={2} dot={false}/><Line type='monotone' dataKey='mitigated' stroke='#64748b' strokeWidth={2} dot={false}/></LineChart></CardContent></Card>
            <Card className='scr-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Hourly Exposure (Cr INR)</CardTitle></CardHeader><CardContent><BarChart data={hourlyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='hour' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Bar dataKey='exposure_m' fill='#eab308' radius={[4,4,0,0]}/></BarChart></CardContent></Card>
            <Card className='scr-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Risk Category Mix</CardTitle></CardHeader><CardContent><PieChart width={350} height={200}><Pie data={catDist} cx='50%' cy='50%' outerRadius={70} innerRadius={35} dataKey='value' paddingAngle={2}>{catDist.map((_, i) => <Cell key={i} fill={COLORS[i % 8]} />)}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value='risks' className='scr-tab-content space-y-4 mt-4'>
          <ModuleBreadcrumb items={[{ label: 'Risk Command' }, { label: 'Risk Register' }]} />
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => { setActiveFilters({}); setSearchQuery('') }} totalItems={risks.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder='Search risks by ID, category, region, owner...' />
          <Card className='scr-table-card bg-zinc-900/60 border-zinc-800'><CardContent className='p-0'><div className='scr-table-wrap overflow-x-auto max-h-[400px] overflow-y-auto'><table className='scr-table w-full text-sm'><thead><tr className='border-b border-zinc-800'><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>ID</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Category</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Severity</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Impact</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Probability</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Exposure</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Status</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Owner</th></tr></thead><tbody>
          {filtered.map(r => (
            <tr key={r.id} className='scr-table-row border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors'>
              <td className='px-3 py-2 font-mono text-xs text-rose-400'>{r.id}</td>
              <td className='px-3 py-2'><CategoryBadge category={r.category} /></td>
              <td className='px-3 py-2'><SeverityBadge severity={r.severity} /></td>
              <td className='px-3 py-2 w-20'><ImpactBar value={r.impact_score} /><span className='text-[10px] text-zinc-500 ml-1'>{r.impact_score}</span></td>
              <td className='px-3 py-2 text-xs text-zinc-400'>{r.probability}%</td>
              <td className='px-3 py-2 w-24'><ExposureBar value={r.exposure_inr} max={9800000} /><span className='text-[10px] text-zinc-500 ml-1'>{(r.exposure_inr / 100000).toFixed(0)}L</span></td>
              <td className='px-3 py-2'><span className={'text-[10px] px-2 py-0.5 rounded-full ' + (r.mitigation_status === 'Escalated' ? 'bg-red-500/15 text-red-400' : r.mitigation_status === 'Active' ? 'bg-emerald-500/15 text-emerald-400' : r.mitigation_status === 'Monitoring' ? 'bg-amber-500/15 text-amber-400' : r.mitigation_status === 'Planned' ? 'bg-blue-500/15 text-blue-400' : 'bg-zinc-500/15 text-zinc-400')}>{r.mitigation_status}</span></td>
              <td className='px-3 py-2 text-xs text-zinc-300'>{r.owner}</td>
            </tr>
          ))})
          </tbody></table></div></CardContent></Card>
        </TabsContent>
        <TabsContent value='analytics' className='scr-tab-content space-y-4 mt-4'>
          <div className='scr-value-row grid grid-cols-2 lg:grid-cols-4 gap-3'>
            <ValueTile label='Total Risk Exposure' value='INR 84.2 Cr' change='-14% vs Q1' />
            <ValueTile label='Avg Mitigation Time' value='3.2 days' change='-1.4 days' />
            <ValueTile label='Risk Events (MTD)' value='42' change='+8 events' />
            <ValueTile label='Financial Impact Avoided' value='INR 18.7 Cr' change='+24% protected' />
          </div>
          <div className='scr-analytics-charts grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <Card className='scr-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Regional Risk Profile</CardTitle></CardHeader><CardContent><BarChart data={REGIONS.map((r,i) => ({ name: r.split(' ')[0].substring(0,6), impact: [88,72,65,80,55,75,92,68][i], probability: [78,85,90,70,82,62,45,88][i] }))} width={450} height={220}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='name' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Bar dataKey='impact' fill='#f43f5e' radius={[4,4,0,0]}/><Bar dataKey='probability' fill='#64748b' radius={[4,4,0,0]}/></BarChart></CardContent></Card>
            <Card className='scr-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Mitigation Status Distribution</CardTitle></CardHeader><CardContent><PieChart width={450} height={220}><Pie data={[{ name: 'Active', value: 32 }, { name: 'Monitoring', value: 28 }, { name: 'Escalated', value: 18 }, { name: 'Planned', value: 14 }, { name: 'Resolved', value: 8 }]} cx='50%' cy='50%' outerRadius={80} innerRadius={40} dataKey='value' paddingAngle={3}>{[<Cell key={0} fill='#10b981' />, <Cell key={1} fill='#f59e0b' />, <Cell key={2} fill='#ef4444' />, <Cell key={3} fill='#6366f1' />, <Cell key={4} fill='#64748b' />]}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value='insights' className='scr-tab-content space-y-4 mt-4'>
          {insights.map((ins, i) => (
            <Card key={i} className={'scr-insight-card bg-zinc-900/60 border ' + (ins.severity === 'high' ? 'border-rose-500/30' : ins.severity === 'medium' ? 'border-slate-500/30' : 'border-zinc-800')}><CardContent className='p-4'><div className='flex items-start gap-3'><div className={'scr-insight-dot w-2 h-2 rounded-full mt-1.5 shrink-0 ' + (ins.severity === 'high' ? 'bg-rose-500' : ins.severity === 'medium' ? 'bg-slate-500' : 'bg-zinc-500')} /><div><p className='text-sm font-medium text-zinc-200'>{ins.title}</p><p className='text-xs text-zinc-400 mt-1 leading-relaxed'>{ins.desc}</p></div></div></CardContent></Card>
          ))})
        </TabsContent>
      </Tabs>
    </div>
  )
}
