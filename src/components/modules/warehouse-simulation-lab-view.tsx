import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f97316', '#ef4444']

const SCENARIOS = ['Peak Season Surge', 'Dock Congestion', 'Labor Shortage', 'Equipment Failure', 'Power Outage', 'IT System Crash', 'Weather Disruption', 'Supply Chain Shock']
const WAREHOUSES = ['Mumbai Hub', 'Delhi NCR DC', 'Chennai South', 'Bangalore Central', 'Hyderabad East', 'Pune West', 'Kolkata North', 'Ahmedabad Mid']
const OUTCOMES = ['Optimal', 'Acceptable', 'Risk Detected', 'Bottleneck Found', 'Failure Point', 'Needs Review']
const PRIORITIES = ['Critical', 'High', 'Medium', 'Low']

const sims = [
  { id: 'SIM-0001', scenario: 'Peak Season Surge', warehouse: 'Mumbai Hub', outcome: 'Optimal', priority: 'Critical', score: 52, throughput_pct: 84.3, wait_time: 27.5, utilization: 64, cost_impact: 18.4, duration: 84, runs: 19, lastRun: '2026-07-05 07:54' },
  { id: 'SIM-0002', scenario: 'Dock Congestion', warehouse: 'Delhi NCR DC', outcome: 'Acceptable', priority: 'High', score: 45, throughput_pct: 77.7, wait_time: 24.3, utilization: 75, cost_impact: 23.4, duration: 60, runs: 45, lastRun: '2026-07-28 09:59' },
  { id: 'SIM-0003', scenario: 'Labor Shortage', warehouse: 'Chennai South', outcome: 'Risk Detected', priority: 'Medium', score: 49, throughput_pct: 87.0, wait_time: 44.8, utilization: 60, cost_impact: 15.4, duration: 97, runs: 11, lastRun: '2026-07-06 18:33' },
  { id: 'SIM-0004', scenario: 'Equipment Failure', warehouse: 'Bangalore Central', outcome: 'Bottleneck Found', priority: 'Low', score: 72, throughput_pct: 67.8, wait_time: 18.1, utilization: 75, cost_impact: 19.9, duration: 82, runs: 19, lastRun: '2026-07-23 00:55' },
  { id: 'SIM-0005', scenario: 'Power Outage', warehouse: 'Hyderabad East', outcome: 'Failure Point', priority: 'Critical', score: 58, throughput_pct: 61.5, wait_time: 42.8, utilization: 49, cost_impact: 12.0, duration: 115, runs: 20, lastRun: '2026-07-15 04:23' },
  { id: 'SIM-0006', scenario: 'IT System Crash', warehouse: 'Pune West', outcome: 'Needs Review', priority: 'High', score: 42, throughput_pct: 83.6, wait_time: 31.6, utilization: 91, cost_impact: 13.8, duration: 68, runs: 28, lastRun: '2026-07-06 19:52' },
  { id: 'SIM-0007', scenario: 'Weather Disruption', warehouse: 'Kolkata North', outcome: 'Optimal', priority: 'Medium', score: 92, throughput_pct: 60.9, wait_time: 5.1, utilization: 62, cost_impact: 9.4, duration: 73, runs: 30, lastRun: '2026-07-28 09:02' },
  { id: 'SIM-0008', scenario: 'Supply Chain Shock', warehouse: 'Ahmedabad Mid', outcome: 'Acceptable', priority: 'Low', score: 90, throughput_pct: 68.3, wait_time: 44.4, utilization: 60, cost_impact: 11.0, duration: 25, runs: 10, lastRun: '2026-07-18 04:43' },
  { id: 'SIM-0009', scenario: 'Peak Season Surge', warehouse: 'Mumbai Hub', outcome: 'Risk Detected', priority: 'Critical', score: 43, throughput_pct: 85.7, wait_time: 35.4, utilization: 59, cost_impact: 20.5, duration: 49, runs: 41, lastRun: '2026-07-21 16:33' },
  { id: 'SIM-0010', scenario: 'Dock Congestion', warehouse: 'Delhi NCR DC', outcome: 'Bottleneck Found', priority: 'High', score: 75, throughput_pct: 94.7, wait_time: 43.2, utilization: 91, cost_impact: 8.5, duration: 18, runs: 49, lastRun: '2026-07-27 17:47' },
  { id: 'SIM-0011', scenario: 'Labor Shortage', warehouse: 'Chennai South', outcome: 'Failure Point', priority: 'Medium', score: 41, throughput_pct: 74.9, wait_time: 9.9, utilization: 77, cost_impact: 8.3, duration: 93, runs: 19, lastRun: '2026-07-23 00:15' },
  { id: 'SIM-0012', scenario: 'Equipment Failure', warehouse: 'Bangalore Central', outcome: 'Needs Review', priority: 'Low', score: 87, throughput_pct: 76.8, wait_time: 36.4, utilization: 87, cost_impact: 20.9, duration: 42, runs: 1, lastRun: '2026-07-23 10:28' },
  { id: 'SIM-0013', scenario: 'Power Outage', warehouse: 'Hyderabad East', outcome: 'Optimal', priority: 'Critical', score: 83, throughput_pct: 70.7, wait_time: 13.9, utilization: 90, cost_impact: 16.0, duration: 11, runs: 3, lastRun: '2026-07-01 18:58' },
  { id: 'SIM-0014', scenario: 'IT System Crash', warehouse: 'Pune West', outcome: 'Acceptable', priority: 'High', score: 92, throughput_pct: 57.8, wait_time: 32.2, utilization: 88, cost_impact: 0.9, duration: 119, runs: 13, lastRun: '2026-07-10 02:53' },
  { id: 'SIM-0015', scenario: 'Weather Disruption', warehouse: 'Kolkata North', outcome: 'Risk Detected', priority: 'Medium', score: 65, throughput_pct: 67.5, wait_time: 32.7, utilization: 72, cost_impact: 22.0, duration: 102, runs: 23, lastRun: '2026-07-16 01:32' },
  { id: 'SIM-0016', scenario: 'Supply Chain Shock', warehouse: 'Ahmedabad Mid', outcome: 'Bottleneck Found', priority: 'Low', score: 41, throughput_pct: 85.2, wait_time: 28.5, utilization: 45, cost_impact: 3.4, duration: 11, runs: 12, lastRun: '2026-07-02 17:24' },
  { id: 'SIM-0017', scenario: 'Peak Season Surge', warehouse: 'Mumbai Hub', outcome: 'Failure Point', priority: 'Critical', score: 93, throughput_pct: 94.2, wait_time: 18.3, utilization: 95, cost_impact: 22.2, duration: 88, runs: 6, lastRun: '2026-07-30 14:46' },
  { id: 'SIM-0018', scenario: 'Dock Congestion', warehouse: 'Delhi NCR DC', outcome: 'Needs Review', priority: 'High', score: 64, throughput_pct: 67.6, wait_time: 12.9, utilization: 61, cost_impact: 2.1, duration: 111, runs: 49, lastRun: '2026-07-12 12:18' },
  { id: 'SIM-0019', scenario: 'Labor Shortage', warehouse: 'Chennai South', outcome: 'Optimal', priority: 'Medium', score: 88, throughput_pct: 59.4, wait_time: 36.0, utilization: 81, cost_impact: 17.9, duration: 48, runs: 21, lastRun: '2026-07-14 05:08' },
  { id: 'SIM-0020', scenario: 'Equipment Failure', warehouse: 'Bangalore Central', outcome: 'Acceptable', priority: 'Low', score: 85, throughput_pct: 84.9, wait_time: 20.1, utilization: 83, cost_impact: 20.5, duration: 51, runs: 8, lastRun: '2026-07-12 03:24' },
  { id: 'SIM-0021', scenario: 'Power Outage', warehouse: 'Hyderabad East', outcome: 'Risk Detected', priority: 'Critical', score: 82, throughput_pct: 85.4, wait_time: 30.7, utilization: 63, cost_impact: 3.3, duration: 61, runs: 3, lastRun: '2026-07-03 03:05' },
  { id: 'SIM-0022', scenario: 'IT System Crash', warehouse: 'Pune West', outcome: 'Bottleneck Found', priority: 'High', score: 46, throughput_pct: 82.6, wait_time: 31.6, utilization: 87, cost_impact: 5.5, duration: 98, runs: 19, lastRun: '2026-07-26 21:40' },
  { id: 'SIM-0023', scenario: 'Weather Disruption', warehouse: 'Kolkata North', outcome: 'Failure Point', priority: 'Medium', score: 98, throughput_pct: 89.7, wait_time: 20.7, utilization: 46, cost_impact: 9.3, duration: 118, runs: 26, lastRun: '2026-07-19 04:29' },
  { id: 'SIM-0024', scenario: 'Supply Chain Shock', warehouse: 'Ahmedabad Mid', outcome: 'Needs Review', priority: 'Low', score: 71, throughput_pct: 74.3, wait_time: 18.5, utilization: 77, cost_impact: 9.2, duration: 12, runs: 11, lastRun: '2026-07-12 19:06' },
  { id: 'SIM-0025', scenario: 'Peak Season Surge', warehouse: 'Mumbai Hub', outcome: 'Optimal', priority: 'Critical', score: 100, throughput_pct: 95.8, wait_time: 14.5, utilization: 86, cost_impact: 14.4, duration: 38, runs: 13, lastRun: '2026-07-15 06:55' },
  { id: 'SIM-0026', scenario: 'Dock Congestion', warehouse: 'Delhi NCR DC', outcome: 'Acceptable', priority: 'High', score: 95, throughput_pct: 97.0, wait_time: 30.2, utilization: 54, cost_impact: 16.7, duration: 11, runs: 27, lastRun: '2026-07-21 21:14' },
  { id: 'SIM-0027', scenario: 'Labor Shortage', warehouse: 'Chennai South', outcome: 'Risk Detected', priority: 'Medium', score: 94, throughput_pct: 73.7, wait_time: 32.4, utilization: 53, cost_impact: 22.6, duration: 102, runs: 33, lastRun: '2026-07-19 04:10' },
  { id: 'SIM-0028', scenario: 'Equipment Failure', warehouse: 'Bangalore Central', outcome: 'Bottleneck Found', priority: 'Low', score: 97, throughput_pct: 67.1, wait_time: 37.0, utilization: 95, cost_impact: 22.7, duration: 88, runs: 26, lastRun: '2026-07-14 23:28' },
  { id: 'SIM-0029', scenario: 'Power Outage', warehouse: 'Hyderabad East', outcome: 'Failure Point', priority: 'Critical', score: 60, throughput_pct: 93.4, wait_time: 42.5, utilization: 50, cost_impact: 12.2, duration: 114, runs: 34, lastRun: '2026-07-08 13:53' },
  { id: 'SIM-0030', scenario: 'IT System Crash', warehouse: 'Pune West', outcome: 'Needs Review', priority: 'High', score: 91, throughput_pct: 75.3, wait_time: 4.5, utilization: 82, cost_impact: 9.3, duration: 120, runs: 20, lastRun: '2026-07-29 03:52' },
  { id: 'SIM-0031', scenario: 'Weather Disruption', warehouse: 'Kolkata North', outcome: 'Optimal', priority: 'Medium', score: 74, throughput_pct: 81.8, wait_time: 26.2, utilization: 78, cost_impact: 5.8, duration: 79, runs: 11, lastRun: '2026-07-15 14:24' },
  { id: 'SIM-0032', scenario: 'Supply Chain Shock', warehouse: 'Ahmedabad Mid', outcome: 'Acceptable', priority: 'Low', score: 93, throughput_pct: 71.6, wait_time: 16.4, utilization: 47, cost_impact: 2.6, duration: 83, runs: 34, lastRun: '2026-07-14 19:51' },
  { id: 'SIM-0033', scenario: 'Peak Season Surge', warehouse: 'Mumbai Hub', outcome: 'Risk Detected', priority: 'Critical', score: 65, throughput_pct: 58.9, wait_time: 28.9, utilization: 87, cost_impact: 10.2, duration: 51, runs: 32, lastRun: '2026-07-12 18:22' },
  { id: 'SIM-0034', scenario: 'Dock Congestion', warehouse: 'Delhi NCR DC', outcome: 'Bottleneck Found', priority: 'High', score: 75, throughput_pct: 87.7, wait_time: 25.3, utilization: 53, cost_impact: 22.3, duration: 79, runs: 46, lastRun: '2026-07-17 00:48' },
  { id: 'SIM-0035', scenario: 'Labor Shortage', warehouse: 'Chennai South', outcome: 'Failure Point', priority: 'Medium', score: 45, throughput_pct: 67.9, wait_time: 43.1, utilization: 80, cost_impact: 2.2, duration: 90, runs: 18, lastRun: '2026-07-28 15:22' },
  { id: 'SIM-0036', scenario: 'Equipment Failure', warehouse: 'Bangalore Central', outcome: 'Needs Review', priority: 'Low', score: 79, throughput_pct: 59.8, wait_time: 25.6, utilization: 62, cost_impact: 4.0, duration: 68, runs: 31, lastRun: '2026-07-23 10:27' },
  { id: 'SIM-0037', scenario: 'Power Outage', warehouse: 'Hyderabad East', outcome: 'Optimal', priority: 'Critical', score: 88, throughput_pct: 56.1, wait_time: 19.0, utilization: 78, cost_impact: 2.9, duration: 106, runs: 49, lastRun: '2026-07-02 19:07' },
  { id: 'SIM-0038', scenario: 'IT System Crash', warehouse: 'Pune West', outcome: 'Acceptable', priority: 'High', score: 44, throughput_pct: 82.4, wait_time: 28.4, utilization: 61, cost_impact: 13.4, duration: 18, runs: 3, lastRun: '2026-07-12 09:51' },
  { id: 'SIM-0039', scenario: 'Weather Disruption', warehouse: 'Kolkata North', outcome: 'Risk Detected', priority: 'Medium', score: 80, throughput_pct: 80.4, wait_time: 30.1, utilization: 86, cost_impact: 8.9, duration: 118, runs: 33, lastRun: '2026-07-14 12:44' },
  { id: 'SIM-0040', scenario: 'Supply Chain Shock', warehouse: 'Ahmedabad Mid', outcome: 'Bottleneck Found', priority: 'Low', score: 82, throughput_pct: 67.8, wait_time: 43.2, utilization: 73, cost_impact: 12.8, duration: 40, runs: 7, lastRun: '2026-07-11 20:27' },
  { id: 'SIM-0041', scenario: 'Peak Season Surge', warehouse: 'Mumbai Hub', outcome: 'Failure Point', priority: 'Critical', score: 96, throughput_pct: 77.1, wait_time: 20.8, utilization: 66, cost_impact: 22.7, duration: 86, runs: 30, lastRun: '2026-07-20 00:48' },
  { id: 'SIM-0042', scenario: 'Dock Congestion', warehouse: 'Delhi NCR DC', outcome: 'Needs Review', priority: 'High', score: 43, throughput_pct: 67.6, wait_time: 27.9, utilization: 67, cost_impact: 19.5, duration: 30, runs: 29, lastRun: '2026-07-19 13:15' },
  { id: 'SIM-0043', scenario: 'Labor Shortage', warehouse: 'Chennai South', outcome: 'Optimal', priority: 'Medium', score: 52, throughput_pct: 89.4, wait_time: 20.8, utilization: 57, cost_impact: 12.7, duration: 83, runs: 36, lastRun: '2026-07-14 03:52' },
  { id: 'SIM-0044', scenario: 'Equipment Failure', warehouse: 'Bangalore Central', outcome: 'Acceptable', priority: 'Low', score: 71, throughput_pct: 67.9, wait_time: 21.0, utilization: 94, cost_impact: 6.9, duration: 55, runs: 33, lastRun: '2026-07-02 19:01' },
  { id: 'SIM-0045', scenario: 'Power Outage', warehouse: 'Hyderabad East', outcome: 'Risk Detected', priority: 'Critical', score: 43, throughput_pct: 63.5, wait_time: 25.6, utilization: 72, cost_impact: 7.3, duration: 22, runs: 34, lastRun: '2026-07-28 09:13' },
  { id: 'SIM-0046', scenario: 'IT System Crash', warehouse: 'Pune West', outcome: 'Bottleneck Found', priority: 'High', score: 63, throughput_pct: 72.8, wait_time: 9.0, utilization: 80, cost_impact: 23.6, duration: 34, runs: 24, lastRun: '2026-07-12 12:24' },
  { id: 'SIM-0047', scenario: 'Weather Disruption', warehouse: 'Kolkata North', outcome: 'Failure Point', priority: 'Medium', score: 71, throughput_pct: 78.2, wait_time: 21.8, utilization: 94, cost_impact: 9.4, duration: 115, runs: 32, lastRun: '2026-07-05 14:48' },
  { id: 'SIM-0048', scenario: 'Supply Chain Shock', warehouse: 'Ahmedabad Mid', outcome: 'Needs Review', priority: 'Low', score: 100, throughput_pct: 87.9, wait_time: 13.8, utilization: 87, cost_impact: 20.9, duration: 117, runs: 30, lastRun: '2026-07-16 02:03' },
  { id: 'SIM-0049', scenario: 'Peak Season Surge', warehouse: 'Mumbai Hub', outcome: 'Optimal', priority: 'Critical', score: 40, throughput_pct: 84.0, wait_time: 25.7, utilization: 47, cost_impact: 6.2, duration: 77, runs: 32, lastRun: '2026-07-08 07:49' },
  { id: 'SIM-0050', scenario: 'Dock Congestion', warehouse: 'Delhi NCR DC', outcome: 'Acceptable', priority: 'High', score: 55, throughput_pct: 69.6, wait_time: 27.8, utilization: 78, cost_impact: 21.9, duration: 36, runs: 26, lastRun: '2026-07-02 23:54' },
  { id: 'SIM-0051', scenario: 'Labor Shortage', warehouse: 'Chennai South', outcome: 'Risk Detected', priority: 'Medium', score: 56, throughput_pct: 55.9, wait_time: 42.5, utilization: 63, cost_impact: 9.3, duration: 115, runs: 2, lastRun: '2026-07-25 01:00' },
  { id: 'SIM-0052', scenario: 'Equipment Failure', warehouse: 'Bangalore Central', outcome: 'Bottleneck Found', priority: 'Low', score: 90, throughput_pct: 94.7, wait_time: 24.9, utilization: 79, cost_impact: 8.8, duration: 96, runs: 31, lastRun: '2026-07-23 04:36' },
  { id: 'SIM-0053', scenario: 'Power Outage', warehouse: 'Hyderabad East', outcome: 'Failure Point', priority: 'Critical', score: 56, throughput_pct: 91.3, wait_time: 11.4, utilization: 76, cost_impact: 16.9, duration: 35, runs: 15, lastRun: '2026-07-10 19:16' },
  { id: 'SIM-0054', scenario: 'IT System Crash', warehouse: 'Pune West', outcome: 'Needs Review', priority: 'High', score: 80, throughput_pct: 66.7, wait_time: 31.0, utilization: 98, cost_impact: 16.6, duration: 57, runs: 42, lastRun: '2026-07-27 12:52' },
  { id: 'SIM-0055', scenario: 'Weather Disruption', warehouse: 'Kolkata North', outcome: 'Optimal', priority: 'Medium', score: 68, throughput_pct: 98.9, wait_time: 28.3, utilization: 68, cost_impact: 1.1, duration: 57, runs: 1, lastRun: '2026-07-08 18:43' },
]

const monthlyData = [
  { month: 'Jan', runs: 49, failures: 16, avgScore: 84.5 },
  { month: 'Feb', runs: 175, failures: 15, avgScore: 79.5 },
  { month: 'Mar', runs: 154, failures: 15, avgScore: 84.6 },
  { month: 'Apr', runs: 56, failures: 13, avgScore: 84.3 },
  { month: 'May', runs: 171, failures: 20, avgScore: 76.3 },
  { month: 'Jun', runs: 164, failures: 18, avgScore: 71.1 },
  { month: 'Jul', runs: 94, failures: 15, avgScore: 73.7 },
  { month: 'Aug', runs: 45, failures: 16, avgScore: 87.9 },
  { month: 'Sep', runs: 168, failures: 20, avgScore: 77.4 },
  { month: 'Oct', runs: 90, failures: 20, avgScore: 87.3 },
  { month: 'Nov', runs: 84, failures: 25, avgScore: 77.6 },
  { month: 'Dec', runs: 149, failures: 5, avgScore: 75.3 },
]

const scenarioDist = [
  { name: 'Peak Season Surge', value: 59 },
  { name: 'Dock Congestion', value: 51 },
  { name: 'Labor Shortage', value: 78 },
  { name: 'Equipment Failure', value: 30 },
  { name: 'Power Outage', value: 51 },
  { name: 'IT System Crash', value: 64 },
  { name: 'Weather Disruption', value: 48 },
  { name: 'Supply Chain Shock', value: 31 },
]

const filterGroups = [
  { key: 'scenario', label: 'Scenario', options: SCENARIOS.map(s => ({ value: s, label: s, count: 0 })) },
  { key: 'outcome', label: 'Outcome', options: OUTCOMES.map(o => ({ value: o, label: o, count: 0 })) },
  { key: 'priority', label: 'Priority', options: PRIORITIES.map(p => ({ value: p, label: p, count: 0 })) },
]

function ScenarioBadge({ scenario }: { scenario: string }) {
  const color = scenario === 'Peak Season Surge' ? 'bg-indigo-500/15 text-indigo-400' : scenario === 'Dock Congestion' ? 'bg-violet-500/15 text-violet-400' : scenario === 'Labor Shortage' ? 'bg-pink-500/15 text-pink-400' : scenario === 'Equipment Failure' ? 'bg-red-500/15 text-red-400' : scenario === 'Power Outage' ? 'bg-amber-500/15 text-amber-400' : scenario === 'IT System Crash' ? 'bg-cyan-500/15 text-cyan-400' : scenario === 'Weather Disruption' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-orange-500/15 text-orange-400'
  return <span className={'wsl-scenario-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{scenario}</span>
}

function OutcomeBadge({ outcome }: { outcome: string }) {
  const color = outcome === 'Optimal' ? 'bg-emerald-500/15 text-emerald-400' : outcome === 'Acceptable' ? 'bg-blue-500/15 text-blue-400' : outcome === 'Risk Detected' ? 'bg-amber-500/15 text-amber-400' : outcome === 'Bottleneck Found' ? 'bg-orange-500/15 text-orange-400' : outcome === 'Failure Point' ? 'bg-red-500/15 text-red-400' : 'bg-zinc-500/15 text-zinc-400'
  return <span className={'wsl-outcome-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{outcome}</span>
}

function PriorityBadge({ priority }: { priority: string }) {
  const color = priority === 'Critical' ? 'bg-red-500/15 text-red-400' : priority === 'High' ? 'bg-orange-500/15 text-orange-400' : priority === 'Medium' ? 'bg-amber-500/15 text-amber-400' : 'bg-blue-500/15 text-blue-400'
  return <span className={'wsl-priority-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{priority}</span>
}

function ScoreBar({ value }: { value: number }) {
  const w = value
  const color = value >= 80 ? 'bg-emerald-500' : value >= 60 ? 'bg-amber-500' : 'bg-red-500'
  return <div className='wsl-score-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className={'h-full rounded-full wsl-score-fill ' + color} style={{ width: w + '%', animation: 'wsl-grow 1s ease-out' }}/></div>
}

function ThroughputBar({ value }: { value: number }) {
  const w = Math.min(value * 1.1, 100)
  return <div className='wsl-tp-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className='h-full rounded-full bg-indigo-500 wsl-tp-fill' style={{ width: w + '%', animation: 'wsl-grow 1s ease-out' }}/></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, c = 2 * Math.PI * r, offset = c - (value / 100) * c
  return <div className='wsl-ring flex flex-col items-center'><svg width='70' height='70' className='-rotate-90'><circle cx='35' cy='35' r={r} fill='none' stroke='#27272a' strokeWidth='5'/><circle cx='35' cy='35' r={r} fill='none' stroke={color} strokeWidth='5' strokeDasharray={c} strokeDashoffset={offset} strokeLinecap='round' className='wsl-ring-path' style={{ transition: 'stroke-dashoffset 1s ease' }}/></svg><span className='wsl-ring-val text-sm font-bold mt-1' style={{ color }}>{value}%</span><span className='wsl-ring-label text-[10px] text-zinc-500'>{label}</span></div>
}

function KpiTile({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return <div className='wsl-kpi bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 wsl-kpi-card'><p className='text-xs text-zinc-500 mb-1'>{label}</p><p className={'text-xl font-bold ' + color}>{value}</p><p className='text-[10px] text-zinc-400 mt-1'>{sub}</p></div>
}

function ValueTile({ label, value, change }: { label: string; value: string; change: string }) {
  const up = change.startsWith('+')
  return <div className='wsl-value-tile bg-zinc-900/60 border border-zinc-800 rounded-lg p-3'><p className='text-xs text-zinc-500'>{label}</p><p className='text-lg font-bold text-white mt-1'>{value}</p><p className={'text-xs mt-1 ' + (up ? 'text-emerald-400' : 'text-red-400')}>{change}</p></div>
}

const insights = [
  { title: 'Mumbai Hub Peak Capacity Alert', desc: 'Simulation reveals Mumbai Hub operates at 94% capacity during Diwali surge, with dock dwell time exceeding 8 hours. Recommend pre-staging 2 additional dock doors and cross-docking overflow to Pune West facility.', severity: 'high' },
  { title: 'Delhi NCR Labor Model Validated', desc: 'New shift optimization model tested across 200 scenarios. Average throughput improvement of 18% with 12% labor cost reduction. Recommend immediate rollout to Delhi, Chennai, and Hyderabad.', severity: 'medium' },
  { title: 'Multi-Site Failure Cascade Risk', desc: 'Simulated concurrent equipment failures across Mumbai + Chennai shows 72% order fulfillment drop within 4 hours. Emergency redundancy plan needed for critical path equipment.', severity: 'high' },
  { title: 'AI-Powered Scenario Generator', desc: 'New ML-based scenario generator trained on 3 years of historical data now produces 40% more realistic simulations. Bias reduction in peak season forecasting: -8% MAE improvement.', severity: 'low' },
]

export default function WarehouseSimulationLabView() {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [tab, setTab] = useState('dashboard')

  const toggleFilter = (key: string, val: string) => {
    setActiveFilters(prev => { const cur = prev[key] || []; const next = cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val]; return { ...prev, [key]: next } })
  }

  const filtered = sims.filter(s => {
    for (const [key, vals] of Object.entries(activeFilters)) { if (vals.length > 0 && !vals.includes(s[key as keyof typeof s] as string)) return false }
    if (searchQuery && !Object.values(s).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))) return false
    return true
  })

  return (
    <div className='wsl-root space-y-4 p-4'>
      <PageHeader title='Warehouse Simulation Lab' description='Digital twin simulations & what-if scenario testing' />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className='wsl-tabs-list bg-zinc-900 border border-zinc-800'>
          <TabsTrigger value='dashboard' className='wsl-tab'>Dashboard</TabsTrigger>
          <TabsTrigger value='simulations' className='wsl-tab'>Simulations</TabsTrigger>
          <TabsTrigger value='analytics' className='wsl-tab'>Analytics</TabsTrigger>
          <TabsTrigger value='insights' className='wsl-tab'>Insights</TabsTrigger>
        </TabsList>
        <TabsContent value='dashboard' className='wsl-tab-content space-y-4 mt-4'>
          <div className='wsl-kpi-row grid grid-cols-2 lg:grid-cols-4 gap-3'>
            <KpiTile label='Total Simulations' value='1,847' sub='+234 this month' color='text-indigo-400' />
            <KpiTile label='Avg Score' value='76.4' sub='+3.2pp' color='text-violet-400' />
            <KpiTile label='Optimal Outcomes' value='34%' sub='+5% vs Q1' color='text-emerald-400' />
            <KpiTile label='Active Models' value='12' sub='3 new this week' color='text-amber-400' />
          </div>
          <div className='wsl-ring-row flex flex-wrap justify-around gap-2'>
            <HealthRing value={78} label='Accuracy' color='#6366f1' />
            <HealthRing value={85} label='Coverage' color='#8b5cf6' />
            <HealthRing value={72} label='Speed' color='#ec4899' />
            <HealthRing value={91} label='Repeatability' color='#f59e0b' />
            <HealthRing value={68} label='Complexity' color='#10b981' />
            <HealthRing value={83} label='Correlation' color='#06b6d4' />
          </div>
          <div className='wsl-chart-row grid grid-cols-1 lg:grid-cols-3 gap-4'>
            <Card className='wsl-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Simulation Runs</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='month' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Line type='monotone' dataKey='runs' stroke='#6366f1' strokeWidth={2} dot={false}/><Line type='monotone' dataKey='failures' stroke='#ef4444' strokeWidth={2} dot={false}/></LineChart></CardContent></Card>
            <Card className='wsl-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Avg Score Trend</CardTitle></CardHeader><CardContent><BarChart data={monthlyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='month' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Bar dataKey='avgScore' fill='#8b5cf6' radius={[4,4,0,0]}/></BarChart></CardContent></Card>
            <Card className='wsl-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Scenario Distribution</CardTitle></CardHeader><CardContent><PieChart width={350} height={200}><Pie data={scenarioDist} cx='50%' cy='50%' outerRadius={70} innerRadius={35} dataKey='value' paddingAngle={2}>{scenarioDist.map((_, i) => <Cell key={i} fill={COLORS[i % 8]} />)}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value='simulations' className='wsl-tab-content space-y-4 mt-4'>
          <ModuleBreadcrumb items={[{ label: 'Simulation Lab' }, { label: 'Simulations' }]} />
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => { setActiveFilters({}); setSearchQuery('') }} totalItems={sims.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder='Search simulations by ID, scenario, warehouse...' />
          <Card className='wsl-table-card bg-zinc-900/60 border-zinc-800'><CardContent className='p-0'><div className='wsl-table-wrap overflow-x-auto'><table className='wsl-table w-full text-sm'><thead><tr className='border-b border-zinc-800'><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>ID</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Scenario</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Warehouse</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Priority</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Score</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Throughput</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Wait</th><th className='text-right px-3 py-2 text-zinc-500 text-xs font-medium'>Runs</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Outcome</th></tr></thead><tbody>
          {filtered.map(s => (
            <tr key={s.id} className='wsl-table-row border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors'>
              <td className='px-3 py-2 font-mono text-xs text-indigo-400'>{s.id}</td>
              <td className='px-3 py-2'><ScenarioBadge scenario={s.scenario} /></td>
              <td className='px-3 py-2 text-xs text-zinc-300'>{s.warehouse}</td>
              <td className='px-3 py-2'><PriorityBadge priority={s.priority} /></td>
              <td className='px-3 py-2 w-24'><ScoreBar value={s.score} /><span className='text-[10px] text-zinc-500 ml-1'>{s.score}</span></td>
              <td className='px-3 py-2 w-24'><ThroughputBar value={s.throughput_pct} /><span className='text-[10px] text-zinc-500 ml-1'>{s.throughput_pct}%</span></td>
              <td className='px-3 py-2 text-xs text-zinc-400'>{s.wait_time}m</td>
              <td className='px-3 py-2 text-right text-xs'>{s.runs}</td>
              <td className='px-3 py-2'><OutcomeBadge outcome={s.outcome} /></td>
            </tr>
          ))})
          </tbody></table></div></CardContent></Card>
        </TabsContent>
        <TabsContent value='analytics' className='wsl-tab-content space-y-4 mt-4'>
          <div className='wsl-value-row grid grid-cols-2 lg:grid-cols-4 gap-3'>
            <ValueTile label='Total Sim Hours' value='2,450' change='+18% YoY' />
            <ValueTile label='Avg Duration' value='48 min' change='-12 min' />
            <ValueTile label='Cost Impact' value='INR 3.2Cr' change='-15% QoQ' />
            <ValueTile label='Models Active' value='12' change='+3 new' />
          </div>
          <div className='wsl-analytics-charts grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <Card className='wsl-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Warehouse Performance</CardTitle></CardHeader><CardContent><BarChart data={WAREHOUSES.map((w,i) => ({ name: w.split(' ')[0], score: [82,78,85,71,88,74,69,81][i], utilization: [92,88,94,78,86,82,76,90][i] }))} width={450} height={220}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='name' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Bar dataKey='score' fill='#6366f1' radius={[4,4,0,0]}/><Bar dataKey='utilization' fill='#ec4899' radius={[4,4,0,0]}/></BarChart></CardContent></Card>
            <Card className='wsl-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Outcome Mix</CardTitle></CardHeader><CardContent><PieChart width={450} height={220}><Pie data={[{ name: 'Optimal', value: 34 }, { name: 'Acceptable', value: 28 }, { name: 'Risk', value: 18 }, { name: 'Bottleneck', value: 12 }, { name: 'Failure', value: 8 }]} cx='50%' cy='50%' outerRadius={80} innerRadius={40} dataKey='value' paddingAngle={3}>{[<Cell key={0} fill='#10b981' />, <Cell key={1} fill='#3b82f6' />, <Cell key={2} fill='#f59e0b' />, <Cell key={3} fill='#f97316' />, <Cell key={4} fill='#ef4444' />]}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value='insights' className='wsl-tab-content space-y-4 mt-4'>
          {insights.map((ins, i) => (
            <Card key={i} className={'wsl-insight-card bg-zinc-900/60 border ' + (ins.severity === 'high' ? 'border-indigo-500/30' : ins.severity === 'medium' ? 'border-amber-500/30' : 'border-zinc-800')}><CardContent className='p-4'><div className='flex items-start gap-3'><div className={'wsl-insight-dot w-2 h-2 rounded-full mt-1.5 shrink-0 ' + (ins.severity === 'high' ? 'bg-indigo-500' : ins.severity === 'medium' ? 'bg-amber-500' : 'bg-zinc-500')} /><div><p className='text-sm font-medium text-zinc-200'>{ins.title}</p><p className='text-xs text-zinc-400 mt-1 leading-relaxed'>{ins.desc}</p></div></div></CardContent></Card>
          ))})
        </TabsContent>
      </Tabs>
    </div>
  )
}
