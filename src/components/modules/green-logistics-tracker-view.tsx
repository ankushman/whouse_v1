import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#10b981', '#059669', '#84cc16', '#eab308', '#06b6d4', '#3b82f6', '#8b5cf6', '#f97316']

const CATEGORIES = ['Carbon Emissions', 'Waste Reduction', 'Energy Efficiency', 'Water Conservation', 'Green Packaging', 'Sustainable Transport', 'Renewable Energy', 'Circular Economy']
const SITES = ['Mumbai Hub', 'Delhi NCR DC', 'Chennai South', 'Bangalore Central', 'Hyderabad East', 'Pune West', 'Kolkata North', 'Ahmedabad Mid']
const COMPLIANCE = ['Compliant', 'Near Target', 'At Risk', 'Non-Compliant']
const PRIORITIES = ['Critical', 'High', 'Medium', 'Low']

const metrics = [
  { id: 'GRN-0001', category: 'Carbon Emissions', site: 'Mumbai Hub', compliance: 'Compliant', priority: 'Critical', reduction_pct: 4.4, co2_saved: 30.6, cost_savings: 29.5, score: 72, target: 28, baseline: 212, current: 82, reportingPeriod: 'Q1 2026' },
  { id: 'GRN-0002', category: 'Waste Reduction', site: 'Delhi NCR DC', compliance: 'Near Target', priority: 'High', reduction_pct: 28.6, co2_saved: 25.1, cost_savings: 58.0, score: 85, target: 73, baseline: 455, current: 195, reportingPeriod: 'Q2 2026' },
  { id: 'GRN-0003', category: 'Energy Efficiency', site: 'Chennai South', compliance: 'At Risk', priority: 'Medium', reduction_pct: 60.1, co2_saved: 35.0, cost_savings: 119.4, score: 65, target: 58, baseline: 450, current: 120, reportingPeriod: 'Q3 2026' },
  { id: 'GRN-0004', category: 'Water Conservation', site: 'Bangalore Central', compliance: 'Non-Compliant', priority: 'Low', reduction_pct: 3.2, co2_saved: 25.6, cost_savings: 35.6, score: 82, target: 29, baseline: 347, current: 343, reportingPeriod: 'Q4 2026' },
  { id: 'GRN-0005', category: 'Green Packaging', site: 'Hyderabad East', compliance: 'Compliant', priority: 'Critical', reduction_pct: 32.6, co2_saved: 34.1, cost_savings: 104.5, score: 53, target: 31, baseline: 314, current: 72, reportingPeriod: 'Q1 2026' },
  { id: 'GRN-0006', category: 'Sustainable Transport', site: 'Pune West', compliance: 'Near Target', priority: 'High', reduction_pct: 25.3, co2_saved: 46.1, cost_savings: 38.0, score: 93, target: 28, baseline: 290, current: 61, reportingPeriod: 'Q2 2026' },
  { id: 'GRN-0007', category: 'Renewable Energy', site: 'Kolkata North', compliance: 'At Risk', priority: 'Medium', reduction_pct: 38.7, co2_saved: 33.2, cost_savings: 88.4, score: 80, target: 49, baseline: 322, current: 132, reportingPeriod: 'Q3 2026' },
  { id: 'GRN-0008', category: 'Circular Economy', site: 'Ahmedabad Mid', compliance: 'Non-Compliant', priority: 'Low', reduction_pct: 35.7, co2_saved: 39.4, cost_savings: 83.8, score: 69, target: 43, baseline: 446, current: 295, reportingPeriod: 'Q4 2026' },
  { id: 'GRN-0009', category: 'Carbon Emissions', site: 'Mumbai Hub', compliance: 'Compliant', priority: 'Critical', reduction_pct: 24.0, co2_saved: 14.4, cost_savings: 95.2, score: 65, target: 47, baseline: 222, current: 102, reportingPeriod: 'Q1 2026' },
  { id: 'GRN-0010', category: 'Waste Reduction', site: 'Delhi NCR DC', compliance: 'Near Target', priority: 'High', reduction_pct: 0.8, co2_saved: 45.0, cost_savings: 81.2, score: 100, target: 34, baseline: 300, current: 196, reportingPeriod: 'Q2 2026' },
  { id: 'GRN-0011', category: 'Energy Efficiency', site: 'Chennai South', compliance: 'At Risk', priority: 'Medium', reduction_pct: 37.7, co2_saved: 25.3, cost_savings: 67.4, score: 51, target: 40, baseline: 471, current: 207, reportingPeriod: 'Q3 2026' },
  { id: 'GRN-0012', category: 'Water Conservation', site: 'Bangalore Central', compliance: 'Non-Compliant', priority: 'Low', reduction_pct: 51.0, co2_saved: 36.1, cost_savings: 66.4, score: 38, target: 48, baseline: 275, current: 133, reportingPeriod: 'Q4 2026' },
  { id: 'GRN-0013', category: 'Green Packaging', site: 'Hyderabad East', compliance: 'Compliant', priority: 'Critical', reduction_pct: 32.7, co2_saved: 15.6, cost_savings: 78.3, score: 35, target: 35, baseline: 479, current: 293, reportingPeriod: 'Q1 2026' },
  { id: 'GRN-0014', category: 'Sustainable Transport', site: 'Pune West', compliance: 'Near Target', priority: 'High', reduction_pct: 60.4, co2_saved: 21.9, cost_savings: 99.9, score: 67, target: 20, baseline: 467, current: 208, reportingPeriod: 'Q2 2026' },
  { id: 'GRN-0015', category: 'Renewable Energy', site: 'Kolkata North', compliance: 'At Risk', priority: 'Medium', reduction_pct: 23.6, co2_saved: 17.5, cost_savings: 34.0, score: 49, target: 20, baseline: 122, current: 45, reportingPeriod: 'Q3 2026' },
  { id: 'GRN-0016', category: 'Circular Economy', site: 'Ahmedabad Mid', compliance: 'Non-Compliant', priority: 'Low', reduction_pct: 58.2, co2_saved: 44.1, cost_savings: 8.5, score: 37, target: 74, baseline: 200, current: 198, reportingPeriod: 'Q4 2026' },
  { id: 'GRN-0017', category: 'Carbon Emissions', site: 'Mumbai Hub', compliance: 'Compliant', priority: 'Critical', reduction_pct: 55.1, co2_saved: 39.9, cost_savings: 99.6, score: 71, target: 76, baseline: 465, current: 304, reportingPeriod: 'Q1 2026' },
  { id: 'GRN-0018', category: 'Waste Reduction', site: 'Delhi NCR DC', compliance: 'Near Target', priority: 'High', reduction_pct: 22.2, co2_saved: 18.4, cost_savings: 43.6, score: 40, target: 80, baseline: 362, current: 48, reportingPeriod: 'Q2 2026' },
  { id: 'GRN-0019', category: 'Energy Efficiency', site: 'Chennai South', compliance: 'At Risk', priority: 'Medium', reduction_pct: 41.5, co2_saved: 29.8, cost_savings: 2.8, score: 36, target: 31, baseline: 127, current: 320, reportingPeriod: 'Q3 2026' },
  { id: 'GRN-0020', category: 'Water Conservation', site: 'Bangalore Central', compliance: 'Non-Compliant', priority: 'Low', reduction_pct: 63.1, co2_saved: 46.6, cost_savings: 107.1, score: 83, target: 22, baseline: 153, current: 82, reportingPeriod: 'Q4 2026' },
  { id: 'GRN-0021', category: 'Green Packaging', site: 'Hyderabad East', compliance: 'Compliant', priority: 'Critical', reduction_pct: 59.7, co2_saved: 35.2, cost_savings: 35.1, score: 67, target: 61, baseline: 235, current: 72, reportingPeriod: 'Q1 2026' },
  { id: 'GRN-0022', category: 'Sustainable Transport', site: 'Pune West', compliance: 'Near Target', priority: 'High', reduction_pct: 35.2, co2_saved: 36.7, cost_savings: 48.6, score: 47, target: 37, baseline: 392, current: 178, reportingPeriod: 'Q2 2026' },
  { id: 'GRN-0023', category: 'Renewable Energy', site: 'Kolkata North', compliance: 'At Risk', priority: 'Medium', reduction_pct: 12.7, co2_saved: 20.8, cost_savings: 16.4, score: 55, target: 47, baseline: 410, current: 204, reportingPeriod: 'Q3 2026' },
  { id: 'GRN-0024', category: 'Circular Economy', site: 'Ahmedabad Mid', compliance: 'Non-Compliant', priority: 'Low', reduction_pct: -1.1, co2_saved: 5.5, cost_savings: 79.6, score: 84, target: 62, baseline: 244, current: 188, reportingPeriod: 'Q4 2026' },
  { id: 'GRN-0025', category: 'Carbon Emissions', site: 'Mumbai Hub', compliance: 'Compliant', priority: 'Critical', reduction_pct: -1.3, co2_saved: 46.0, cost_savings: 49.0, score: 45, target: 27, baseline: 142, current: 88, reportingPeriod: 'Q1 2026' },
  { id: 'GRN-0026', category: 'Waste Reduction', site: 'Delhi NCR DC', compliance: 'Near Target', priority: 'High', reduction_pct: 37.0, co2_saved: 33.2, cost_savings: 80.6, score: 71, target: 70, baseline: 443, current: 48, reportingPeriod: 'Q2 2026' },
  { id: 'GRN-0027', category: 'Energy Efficiency', site: 'Chennai South', compliance: 'At Risk', priority: 'Medium', reduction_pct: 22.6, co2_saved: 1.4, cost_savings: 74.6, score: 85, target: 56, baseline: 168, current: 275, reportingPeriod: 'Q3 2026' },
  { id: 'GRN-0028', category: 'Water Conservation', site: 'Bangalore Central', compliance: 'Non-Compliant', priority: 'Low', reduction_pct: 26.8, co2_saved: 3.6, cost_savings: 84.9, score: 80, target: 27, baseline: 108, current: 126, reportingPeriod: 'Q4 2026' },
  { id: 'GRN-0029', category: 'Green Packaging', site: 'Hyderabad East', compliance: 'Compliant', priority: 'Critical', reduction_pct: 16.1, co2_saved: 5.2, cost_savings: 111.4, score: 72, target: 47, baseline: 432, current: 331, reportingPeriod: 'Q1 2026' },
  { id: 'GRN-0030', category: 'Sustainable Transport', site: 'Pune West', compliance: 'Near Target', priority: 'High', reduction_pct: -8.4, co2_saved: 10.0, cost_savings: 97.1, score: 88, target: 62, baseline: 183, current: 117, reportingPeriod: 'Q2 2026' },
  { id: 'GRN-0031', category: 'Renewable Energy', site: 'Kolkata North', compliance: 'At Risk', priority: 'Medium', reduction_pct: 39.6, co2_saved: 1.0, cost_savings: 77.3, score: 64, target: 74, baseline: 317, current: 203, reportingPeriod: 'Q3 2026' },
  { id: 'GRN-0032', category: 'Circular Economy', site: 'Ahmedabad Mid', compliance: 'Non-Compliant', priority: 'Low', reduction_pct: -0.6, co2_saved: 11.3, cost_savings: 60.8, score: 54, target: 30, baseline: 241, current: 152, reportingPeriod: 'Q4 2026' },
  { id: 'GRN-0033', category: 'Carbon Emissions', site: 'Mumbai Hub', compliance: 'Compliant', priority: 'Critical', reduction_pct: 51.1, co2_saved: 37.7, cost_savings: 58.6, score: 86, target: 47, baseline: 482, current: 269, reportingPeriod: 'Q1 2026' },
  { id: 'GRN-0034', category: 'Waste Reduction', site: 'Delhi NCR DC', compliance: 'Near Target', priority: 'High', reduction_pct: 13.9, co2_saved: 0.6, cost_savings: 24.0, score: 95, target: 30, baseline: 365, current: 165, reportingPeriod: 'Q2 2026' },
  { id: 'GRN-0035', category: 'Energy Efficiency', site: 'Chennai South', compliance: 'At Risk', priority: 'Medium', reduction_pct: 22.5, co2_saved: 38.5, cost_savings: 31.0, score: 79, target: 57, baseline: 282, current: 305, reportingPeriod: 'Q3 2026' },
  { id: 'GRN-0036', category: 'Water Conservation', site: 'Bangalore Central', compliance: 'Non-Compliant', priority: 'Low', reduction_pct: 54.9, co2_saved: 15.3, cost_savings: 15.4, score: 62, target: 53, baseline: 211, current: 216, reportingPeriod: 'Q4 2026' },
  { id: 'GRN-0037', category: 'Green Packaging', site: 'Hyderabad East', compliance: 'Compliant', priority: 'Critical', reduction_pct: 30.9, co2_saved: 21.5, cost_savings: 45.7, score: 83, target: 21, baseline: 270, current: 62, reportingPeriod: 'Q1 2026' },
  { id: 'GRN-0038', category: 'Sustainable Transport', site: 'Pune West', compliance: 'Near Target', priority: 'High', reduction_pct: -3.6, co2_saved: 27.6, cost_savings: 53.0, score: 86, target: 25, baseline: 251, current: 187, reportingPeriod: 'Q2 2026' },
  { id: 'GRN-0039', category: 'Renewable Energy', site: 'Kolkata North', compliance: 'At Risk', priority: 'Medium', reduction_pct: 39.4, co2_saved: 16.6, cost_savings: 59.9, score: 80, target: 55, baseline: 480, current: 241, reportingPeriod: 'Q3 2026' },
  { id: 'GRN-0040', category: 'Circular Economy', site: 'Ahmedabad Mid', compliance: 'Non-Compliant', priority: 'Low', reduction_pct: 30.6, co2_saved: 7.1, cost_savings: 99.6, score: 100, target: 20, baseline: 491, current: 84, reportingPeriod: 'Q4 2026' },
  { id: 'GRN-0041', category: 'Carbon Emissions', site: 'Mumbai Hub', compliance: 'Compliant', priority: 'Critical', reduction_pct: 12.0, co2_saved: 45.9, cost_savings: 66.8, score: 56, target: 60, baseline: 237, current: 284, reportingPeriod: 'Q1 2026' },
  { id: 'GRN-0042', category: 'Waste Reduction', site: 'Delhi NCR DC', compliance: 'Near Target', priority: 'High', reduction_pct: 16.2, co2_saved: 5.7, cost_savings: 66.3, score: 70, target: 29, baseline: 341, current: 275, reportingPeriod: 'Q2 2026' },
  { id: 'GRN-0043', category: 'Energy Efficiency', site: 'Chennai South', compliance: 'At Risk', priority: 'Medium', reduction_pct: 25.5, co2_saved: 16.1, cost_savings: 91.7, score: 85, target: 63, baseline: 371, current: 89, reportingPeriod: 'Q3 2026' },
  { id: 'GRN-0044', category: 'Water Conservation', site: 'Bangalore Central', compliance: 'Non-Compliant', priority: 'Low', reduction_pct: 19.1, co2_saved: 39.8, cost_savings: 7.3, score: 50, target: 24, baseline: 418, current: 74, reportingPeriod: 'Q4 2026' },
  { id: 'GRN-0045', category: 'Green Packaging', site: 'Hyderabad East', compliance: 'Compliant', priority: 'Critical', reduction_pct: 9.6, co2_saved: 22.7, cost_savings: 4.8, score: 72, target: 71, baseline: 421, current: 335, reportingPeriod: 'Q1 2026' },
  { id: 'GRN-0046', category: 'Sustainable Transport', site: 'Pune West', compliance: 'Near Target', priority: 'High', reduction_pct: 10.3, co2_saved: 30.9, cost_savings: 41.8, score: 99, target: 47, baseline: 300, current: 188, reportingPeriod: 'Q2 2026' },
  { id: 'GRN-0047', category: 'Renewable Energy', site: 'Kolkata North', compliance: 'At Risk', priority: 'Medium', reduction_pct: -1.4, co2_saved: 15.5, cost_savings: 53.4, score: 65, target: 26, baseline: 274, current: 260, reportingPeriod: 'Q3 2026' },
  { id: 'GRN-0048', category: 'Circular Economy', site: 'Ahmedabad Mid', compliance: 'Non-Compliant', priority: 'Low', reduction_pct: 56.7, co2_saved: 20.6, cost_savings: 27.4, score: 89, target: 58, baseline: 335, current: 54, reportingPeriod: 'Q4 2026' },
  { id: 'GRN-0049', category: 'Carbon Emissions', site: 'Mumbai Hub', compliance: 'Compliant', priority: 'Critical', reduction_pct: 46.4, co2_saved: 3.2, cost_savings: 59.7, score: 74, target: 42, baseline: 496, current: 80, reportingPeriod: 'Q1 2026' },
  { id: 'GRN-0050', category: 'Waste Reduction', site: 'Delhi NCR DC', compliance: 'Near Target', priority: 'High', reduction_pct: 1.7, co2_saved: 27.5, cost_savings: 29.9, score: 91, target: 26, baseline: 201, current: 294, reportingPeriod: 'Q2 2026' },
  { id: 'GRN-0051', category: 'Energy Efficiency', site: 'Chennai South', compliance: 'At Risk', priority: 'Medium', reduction_pct: 32.1, co2_saved: 27.1, cost_savings: 109.6, score: 97, target: 38, baseline: 221, current: 266, reportingPeriod: 'Q3 2026' },
  { id: 'GRN-0052', category: 'Water Conservation', site: 'Bangalore Central', compliance: 'Non-Compliant', priority: 'Low', reduction_pct: 54.6, co2_saved: 12.9, cost_savings: 43.6, score: 39, target: 58, baseline: 115, current: 70, reportingPeriod: 'Q4 2026' },
  { id: 'GRN-0053', category: 'Green Packaging', site: 'Hyderabad East', compliance: 'Compliant', priority: 'Critical', reduction_pct: 4.5, co2_saved: 26.6, cost_savings: 52.8, score: 59, target: 26, baseline: 368, current: 186, reportingPeriod: 'Q1 2026' },
  { id: 'GRN-0054', category: 'Sustainable Transport', site: 'Pune West', compliance: 'Near Target', priority: 'High', reduction_pct: 6.3, co2_saved: 19.8, cost_savings: 20.4, score: 91, target: 32, baseline: 286, current: 224, reportingPeriod: 'Q2 2026' },
  { id: 'GRN-0055', category: 'Renewable Energy', site: 'Kolkata North', compliance: 'At Risk', priority: 'Medium', reduction_pct: 20.3, co2_saved: 23.7, cost_savings: 37.2, score: 53, target: 69, baseline: 285, current: 303, reportingPeriod: 'Q3 2026' },
]

const monthlyData = [
  { month: 'Jan', co2: 260, cost: 73, reduction: 10.8 },
  { month: 'Feb', co2: 245, cost: 38, reduction: 16.0 },
  { month: 'Mar', co2: 218, cost: 41, reduction: 38.6 },
  { month: 'Apr', co2: 176, cost: 21, reduction: 7.1 },
  { month: 'May', co2: 218, cost: 51, reduction: 27.1 },
  { month: 'Jun', co2: 59, cost: 39, reduction: 38.3 },
  { month: 'Jul', co2: 269, cost: 72, reduction: 14.5 },
  { month: 'Aug', co2: 249, cost: 40, reduction: 18.2 },
  { month: 'Sep', co2: 203, cost: 77, reduction: 40.0 },
  { month: 'Oct', co2: 102, cost: 60, reduction: 7.5 },
  { month: 'Nov', co2: 267, cost: 42, reduction: 5.8 },
  { month: 'Dec', co2: 291, cost: 68, reduction: 16.7 },
]

const categoryDist = [
  { name: 'Carbon Emissions', value: 54 },
  { name: 'Waste Reduction', value: 67 },
  { name: 'Energy Efficiency', value: 16 },
  { name: 'Water Conservation', value: 64 },
  { name: 'Green Packaging', value: 64 },
  { name: 'Sustainable Transport', value: 18 },
  { name: 'Renewable Energy', value: 15 },
  { name: 'Circular Economy', value: 65 },
]

const filterGroups = [
  { key: 'category', label: 'Category', options: CATEGORIES.map(c => ({ value: c, label: c, count: 0 })) },
  { key: 'compliance', label: 'Compliance', options: COMPLIANCE.map(c => ({ value: c, label: c, count: 0 })) },
  { key: 'priority', label: 'Priority', options: PRIORITIES.map(p => ({ value: p, label: p, count: 0 })) },
]

function CategoryBadge({ category }: { category: string }) {
  const color = category === 'Carbon Emissions' ? 'bg-emerald-500/15 text-emerald-400' : category === 'Waste Reduction' ? 'bg-lime-500/15 text-lime-400' : category === 'Energy Efficiency' ? 'bg-cyan-500/15 text-cyan-400' : category === 'Water Conservation' ? 'bg-blue-500/15 text-blue-400' : category === 'Green Packaging' ? 'bg-amber-500/15 text-amber-400' : category === 'Sustainable Transport' ? 'bg-violet-500/15 text-violet-400' : category === 'Renewable Energy' ? 'bg-teal-500/15 text-teal-400' : 'bg-orange-500/15 text-orange-400'
  return <span className={'glt-category-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{category}</span>
}

function ComplianceBadge({ compliance }: { compliance: string }) {
  const color = compliance === 'Compliant' ? 'bg-emerald-500/15 text-emerald-400' : compliance === 'Near Target' ? 'bg-blue-500/15 text-blue-400' : compliance === 'At Risk' ? 'bg-amber-500/15 text-amber-400' : 'bg-red-500/15 text-red-400'
  return <span className={'glt-compliance-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{compliance}</span>
}

function PriorityBadge({ priority }: { priority: string }) {
  const color = priority === 'Critical' ? 'bg-red-500/15 text-red-400' : priority === 'High' ? 'bg-orange-500/15 text-orange-400' : priority === 'Medium' ? 'bg-amber-500/15 text-amber-400' : 'bg-blue-500/15 text-blue-400'
  return <span className={'glt-priority-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{priority}</span>
}

function ReductionBar({ value }: { value: number }) {
  const w = Math.min(Math.max(value * 2, 0), 100)
  const color = value >= 30 ? 'bg-emerald-500' : value >= 15 ? 'bg-amber-500' : 'bg-red-500'
  return <div className='glt-reduction-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className={'h-full rounded-full glt-reduction-fill ' + color} style={{ width: w + '%', animation: 'glt-grow 1s ease-out' }}/></div>
}

function Co2Bar({ value, max }: { value: number; max: number }) {
  const w = Math.round(value / max * 100)
  return <div className='glt-co2-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className='h-full rounded-full bg-lime-500 glt-co2-fill' style={{ width: w + '%', animation: 'glt-grow 1s ease-out' }}/></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, c = 2 * Math.PI * r, offset = c - (value / 100) * c
  return <div className='glt-ring flex flex-col items-center'><svg width='70' height='70' className='-rotate-90'><circle cx='35' cy='35' r={r} fill='none' stroke='#27272a' strokeWidth='5'/><circle cx='35' cy='35' r={r} fill='none' stroke={color} strokeWidth='5' strokeDasharray={c} strokeDashoffset={offset} strokeLinecap='round' className='glt-ring-path' style={{ transition: 'stroke-dashoffset 1s ease' }}/></svg><span className='glt-ring-val text-sm font-bold mt-1' style={{ color }}>{value}%</span><span className='glt-ring-label text-[10px] text-zinc-500'>{label}</span></div>
}

function KpiTile({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return <div className='glt-kpi bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 glt-kpi-card'><p className='text-xs text-zinc-500 mb-1'>{label}</p><p className={'text-xl font-bold ' + color}>{value}</p><p className='text-[10px] text-zinc-400 mt-1'>{sub}</p></div>
}

function ValueTile({ label, value, change }: { label: string; value: string; change: string }) {
  const up = change.startsWith('+')
  return <div className='glt-value-tile bg-zinc-900/60 border border-zinc-800 rounded-lg p-3'><p className='text-xs text-zinc-500'>{label}</p><p className='text-lg font-bold text-white mt-1'>{value}</p><p className={'text-xs mt-1 ' + (up ? 'text-emerald-400' : 'text-red-400')}>{change}</p></div>
}

const insights = [
  { title: 'ESG Rating Upgrade', desc: 'Overall ESG score improved from B+ to A- after implementing solar panels at 3 warehouses. Carbon intensity reduced by 18%. Board presentation scheduled for August review.', severity: 'high' },
  { title: 'Zero-Waste Milestone', desc: 'Chennai South achieved 92% waste diversion rate through composting, recycling partnerships, and packaging redesign. Target: 95% by Q4 2026. Model for other sites.', severity: 'medium' },
  { title: 'EV Fleet Expansion', desc: '12 new electric forklifts deployed across Mumbai and Pune. Charging infrastructure complete with solar-backed stations. Total EV fleet now 38 units, 45% of material handling.', severity: 'high' },
  { title: 'Water Recycling ROI', desc: 'Rainwater harvesting + greywater recycling at Bangalore Central saved 2.1M liters in H1 2026. Payback period: 14 months. Recommend scaling to all southern sites.', severity: 'low' },
]

export default function GreenLogisticsTrackerView() {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [tab, setTab] = useState('dashboard')

  const toggleFilter = (key: string, val: string) => {
    setActiveFilters(prev => { const cur = prev[key] || []; const next = cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val]; return { ...prev, [key]: next } })
  }

  const filtered = metrics.filter(m => {
    for (const [key, vals] of Object.entries(activeFilters)) { if (vals.length > 0 && !vals.includes(m[key as keyof typeof m] as string)) return false }
    if (searchQuery && !Object.values(m).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))) return false
    return true
  })

  return (
    <div className='glt-root space-y-4 p-4'>
      <PageHeader title='Green Logistics Tracker' description='Sustainability metrics, ESG compliance & carbon footprint monitoring' />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className='glt-tabs-list bg-zinc-900 border border-zinc-800'>
          <TabsTrigger value='dashboard' className='glt-tab'>Dashboard</TabsTrigger>
          <TabsTrigger value='metrics' className='glt-tab'>Metrics</TabsTrigger>
          <TabsTrigger value='analytics' className='glt-tab'>Analytics</TabsTrigger>
          <TabsTrigger value='insights' className='glt-tab'>Insights</TabsTrigger>
        </TabsList>
        <TabsContent value='dashboard' className='glt-tab-content space-y-4 mt-4'>
          <div className='glt-kpi-row grid grid-cols-2 lg:grid-cols-4 gap-3'>
            <KpiTile label='CO2 Saved (MTD)' value='142 T' sub='+28% vs target' color='text-emerald-400' />
            <KpiTile label='ESG Score' value='A-' sub='Up from B+' color='text-lime-400' />
            <KpiTile label='Compliance Rate' value='87%' sub='+5pp QoQ' color='text-cyan-400' />
            <KpiTile label='Cost Savings' value='INR 4.2Cr' sub='+18% YoY' color='text-amber-400' />
          </div>
          <div className='glt-ring-row flex flex-wrap justify-around gap-2'>
            <HealthRing value={82} label='Carbon' color='#10b981' />
            <HealthRing value={76} label='Water' color='#06b6d4' />
            <HealthRing value={89} label='Energy' color='#84cc16' />
            <HealthRing value={71} label='Waste' color='#eab308' />
            <HealthRing value={85} label='Transport' color='#3b82f6' />
            <HealthRing value={93} label='Packaging' color='#059669' />
          </div>
          <div className='glt-chart-row grid grid-cols-1 lg:grid-cols-3 gap-4'>
            <Card className='glt-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>CO2 Savings Trend</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='month' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Line type='monotone' dataKey='co2' stroke='#10b981' strokeWidth={2} dot={false}/><Line type='monotone' dataKey='reduction' stroke='#84cc16' strokeWidth={2} dot={false}/></LineChart></CardContent></Card>
            <Card className='glt-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Cost Savings</CardTitle></CardHeader><CardContent><BarChart data={monthlyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='month' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Bar dataKey='cost' fill='#059669' radius={[4,4,0,0]}/></BarChart></CardContent></Card>
            <Card className='glt-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Category Distribution</CardTitle></CardHeader><CardContent><PieChart width={350} height={200}><Pie data={categoryDist} cx='50%' cy='50%' outerRadius={70} innerRadius={35} dataKey='value' paddingAngle={2}>{categoryDist.map((_, i) => <Cell key={i} fill={COLORS[i % 8]} />)}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value='metrics' className='glt-tab-content space-y-4 mt-4'>
          <ModuleBreadcrumb items={[{ label: 'Green Logistics' }, { label: 'Metrics' }]} />
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => { setActiveFilters({}); setSearchQuery('') }} totalItems={metrics.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder='Search metrics by ID, category, site...' />
          <Card className='glt-table-card bg-zinc-900/60 border-zinc-800'><CardContent className='p-0'><div className='glt-table-wrap overflow-x-auto'><table className='glt-table w-full text-sm'><thead><tr className='border-b border-zinc-800'><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>ID</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Category</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Site</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Priority</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Reduction</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>CO2 Saved</th><th className='text-right px-3 py-2 text-zinc-500 text-xs font-medium'>Score</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Compliance</th></tr></thead><tbody>
          {filtered.map(m => (
            <tr key={m.id} className='glt-table-row border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors'>
              <td className='px-3 py-2 font-mono text-xs text-emerald-400'>{m.id}</td>
              <td className='px-3 py-2'><CategoryBadge category={m.category} /></td>
              <td className='px-3 py-2 text-xs text-zinc-300'>{m.site}</td>
              <td className='px-3 py-2'><PriorityBadge priority={m.priority} /></td>
              <td className='px-3 py-2 w-24'><ReductionBar value={m.reduction_pct} /><span className='text-[10px] text-zinc-500 ml-1'>{m.reduction_pct}%</span></td>
              <td className='px-3 py-2 w-24'><Co2Bar value={m.co2_saved} max={50} /><span className='text-[10px] text-zinc-500 ml-1'>{m.co2_saved}T</span></td>
              <td className='px-3 py-2 text-right text-xs font-medium'>{m.score}</td>
              <td className='px-3 py-2'><ComplianceBadge compliance={m.compliance} /></td>
            </tr>
          ))})
          </tbody></table></div></CardContent></Card>
        </TabsContent>
        <TabsContent value='analytics' className='glt-tab-content space-y-4 mt-4'>
          <div className='glt-value-row grid grid-cols-2 lg:grid-cols-4 gap-3'>
            <ValueTile label='Total CO2 YTD' value='1,240 T' change='+32% vs target' />
            <ValueTile label='Energy from Solar' value='42%' change='+8pp' />
            <ValueTile label='Waste Diverted' value='78%' change='+12pp' />
            <ValueTile label='Green Certs' value='24' change='+6 new' />
          </div>
          <div className='glt-analytics-charts grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <Card className='glt-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Site ESG Scores</CardTitle></CardHeader><CardContent><BarChart data={SITES.map((s,i) => ({ name: s.split(' ')[0], score: [82,78,91,74,86,79,71,88][i] }))} width={450} height={220}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='name' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Bar dataKey='score' fill='#10b981' radius={[4,4,0,0]}/></BarChart></CardContent></Card>
            <Card className='glt-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Compliance Distribution</CardTitle></CardHeader><CardContent><PieChart width={450} height={220}><Pie data={[{ name: 'Compliant', value: 42 }, { name: 'Near Target', value: 28 }, { name: 'At Risk', value: 20 }, { name: 'Non-Compliant', value: 10 }]} cx='50%' cy='50%' outerRadius={80} innerRadius={40} dataKey='value' paddingAngle={3}>{[<Cell key={0} fill='#10b981' />, <Cell key={1} fill='#3b82f6' />, <Cell key={2} fill='#eab308' />, <Cell key={3} fill='#ef4444' />]}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value='insights' className='glt-tab-content space-y-4 mt-4'>
          {insights.map((ins, i) => (
            <Card key={i} className={'glt-insight-card bg-zinc-900/60 border ' + (ins.severity === 'high' ? 'border-emerald-500/30' : ins.severity === 'medium' ? 'border-amber-500/30' : 'border-zinc-800')}><CardContent className='p-4'><div className='flex items-start gap-3'><div className={'glt-insight-dot w-2 h-2 rounded-full mt-1.5 shrink-0 ' + (ins.severity === 'high' ? 'bg-emerald-500' : ins.severity === 'medium' ? 'bg-amber-500' : 'bg-zinc-500')} /><div><p className='text-sm font-medium text-zinc-200'>{ins.title}</p><p className='text-xs text-zinc-400 mt-1 leading-relaxed'>{ins.desc}</p></div></div></CardContent></Card>
          ))})
        </TabsContent>
      </Tabs>
    </div>
  )
}
