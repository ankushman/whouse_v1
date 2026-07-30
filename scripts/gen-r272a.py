#!/usr/bin/env python3
"""Generate Rail Freight Command module (R272a) - pure JS literals"""
import random
random.seed(272)

lines = []
a = lines.append

a("import React, { useState } from 'react'")
a("import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'")
a("import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'")
a("import { PageHeader } from '@/components/shared/page-header'")
a("import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'")
a("import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'")
a("import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'")

a("")
a("const COLORS = ['#f97316', '#ef4444', '#eab308', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4']")

CARGO_TYPES_PY = ['Container', 'Bulk Dry', 'Bulk Liquid', 'Auto Rack', 'Intermodal', 'Tank Wagon', 'Flat Bed', 'Refrigerated']
CORRIDORS_PY = ['Delhi-Mumbai', 'Delhi-Kolkata', 'Mumbai-Chennai', 'Delhi-Chennai', 'Kolkata-Chennai', 'Mumbai-Bangalore', 'Delhi-Bangalore', 'Hyderabad-Mumbai']
RAILWAYS_PY = ['Indian Railways (IR)', 'DFCCIL (WDFC)', 'DFCCIL (EDFC)', 'CRIS Network', 'CONCOR', 'Dedicated Freight', 'Private Freight', 'Container Corp']
STATUSES_PY = ['In Transit', 'At Terminal', 'Loading', 'Delayed', 'On Schedule', 'Customs Hold', 'Dispatched']
PRIORITIES_PY = ['Critical', 'High', 'Medium', 'Low', 'Standard']

a("")
a("const CARGO_TYPES = ['Container', 'Bulk Dry', 'Bulk Liquid', 'Auto Rack', 'Intermodal', 'Tank Wagon', 'Flat Bed', 'Refrigerated']")
a("const CORRIDORS = ['Delhi-Mumbai', 'Delhi-Kolkata', 'Mumbai-Chennai', 'Delhi-Chennai', 'Kolkata-Chennai', 'Mumbai-Bangalore', 'Delhi-Bangalore', 'Hyderabad-Mumbai']")
a("const RAILWAYS = ['Indian Railways (IR)', 'DFCCIL (WDFC)', 'DFCCIL (EDFC)', 'CRIS Network', 'CONCOR', 'Dedicated Freight', 'Private Freight', 'Container Corp']")
a("const STATUSES = ['In Transit', 'At Terminal', 'Loading', 'Delayed', 'On Schedule', 'Customs Hold', 'Dispatched']")
a("const PRIORITIES = ['Critical', 'High', 'Medium', 'Low', 'Standard']")

consignments = []
for i in range(60):
    cargo = CARGO_TYPES_PY[i % 8]
    corridor = CORRIDORS_PY[i % 8]
    railway = RAILWAYS_PY[i % 8]
    status = STATUSES_PY[i % 7]
    priority = PRIORITIES_PY[i % 5]
    weight = random.randint(50, 3500)
    wagons = random.randint(2, 45)
    eta_hrs = random.randint(2, 72)
    dwell_hrs = round(random.uniform(0.5, 24), 1)
    revenue = random.randint(50000, 800000)
    consignments.append({
        'id': f'RFC-{i+1:04d}',
        'consignor': f'Consignor {random.randint(1,200)}',
        'consignee': f'Consignee {random.randint(1,200)}',
        'cargo': cargo,
        'corridor': corridor,
        'railway': railway,
        'status': status,
        'priority': priority,
        'weight': weight,
        'wagons': wagons,
        'eta_hrs': eta_hrs,
        'dwell_hrs': dwell_hrs,
        'revenue': revenue,
        'rakeNo': f'RK-{random.randint(1000,9999)}',
        'origin': corridor.split('-')[0],
        'destination': corridor.split('-')[1],
        'updatedAt': f"2026-07-{random.randint(1,30):02d}",
    })

a("")
a("const consignments = [")
for c in consignments:
    a(f"  {{ id: '{c['id']}', consignor: '{c['consignor']}', consignee: '{c['consignee']}', cargo: '{c['cargo']}', corridor: '{c['corridor']}', railway: '{c['railway']}', status: '{c['status']}', priority: '{c['priority']}', weight: {c['weight']}, wagons: {c['wagons']}, eta_hrs: {c['eta_hrs']}, dwell_hrs: {c['dwell_hrs']}, revenue: {c['revenue']}, rakeNo: '{c['rakeNo']}', origin: '{c['origin']}', destination: '{c['destination']}', updatedAt: '{c['updatedAt']}' }},")
a("]")

a("")
a("const monthlyData = [")
for i in range(12):
    month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]
    tons = random.randint(800,2500)
    rakes = random.randint(40,150)
    a(f"  {{ month: '{month}', tons: {tons}, rakes: {rakes}, utilization: round(random.uniform(65,95)*10)/10 }},")
a("]")

a("")
a("const cargoDist = [")
for ct in CARGO_TYPES_PY:
    val = random.randint(20,100)
    a(f"  {{ name: '{ct}', value: {val} }},")
a("]")

a("")
a("const filterGroups = [")
a("  { key: 'cargo', label: 'Cargo Type', options: CARGO_TYPES.map(c => ({ value: c, label: c, count: 0 })) },")
a("  { key: 'status', label: 'Status', options: STATUSES.map(s => ({ value: s, label: s, count: 0 })) },")
a("  { key: 'priority', label: 'Priority', options: PRIORITIES.map(p => ({ value: p, label: p, count: 0 })) },")
a("]")

a("")
a("function CargoBadge({ cargo }: { cargo: string }) {")
a("  const color = cargo === 'Container' ? 'bg-orange-500/15 text-orange-400' : cargo === 'Bulk Dry' ? 'bg-amber-500/15 text-amber-400' : cargo === 'Bulk Liquid' ? 'bg-blue-500/15 text-blue-400' : cargo === 'Auto Rack' ? 'bg-red-500/15 text-red-400' : cargo === 'Intermodal' ? 'bg-violet-500/15 text-violet-400' : cargo === 'Tank Wagon' ? 'bg-cyan-500/15 text-cyan-400' : cargo === 'Refrigerated' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-zinc-500/15 text-zinc-400'")
a("  return <span className={'rfc-cargo-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{cargo}</span>")
a("}")
a("")
a("function StatusBadge({ status }: { status: string }) {")
a("  const color = status === 'In Transit' ? 'bg-blue-500/15 text-blue-400' : status === 'At Terminal' ? 'bg-amber-500/15 text-amber-400' : status === 'Delayed' ? 'bg-red-500/15 text-red-400' : status === 'On Schedule' ? 'bg-emerald-500/15 text-emerald-400' : status === 'Customs Hold' ? 'bg-violet-500/15 text-violet-400' : status === 'Loading' ? 'bg-cyan-500/15 text-cyan-400' : 'bg-zinc-500/15 text-zinc-400'")
a("  return <span className={'rfc-status-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{status}</span>")
a("}")
a("")
a("function PriorityBadge({ priority }: { priority: string }) {")
a("  const color = priority === 'Critical' ? 'bg-red-500/15 text-red-400' : priority === 'High' ? 'bg-orange-500/15 text-orange-400' : priority === 'Medium' ? 'bg-amber-500/15 text-amber-400' : priority === 'Low' ? 'bg-blue-500/15 text-blue-400' : 'bg-zinc-500/15 text-zinc-400'")
a("  return <span className={'rfc-priority-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{priority}</span>")
a("}")
a("")
a("function WeightBar({ value, max }: { value: number; max: number }) {")
a("  const w = Math.round(value / max * 100)")
a("  return <div className='rfc-wt-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className='h-full rounded-full bg-orange-500 rfc-wt-fill' style={{ width: w + '%', animation: 'rfc-grow 1s ease-out' }}/></div>")
a("}")
a("")
a("function EtaBar({ value }: { value: number }) {")
a("  const w = Math.min(value * 1.5, 100)")
a("  const color = value > 48 ? 'bg-red-500' : value > 24 ? 'bg-amber-500' : 'bg-emerald-500'")
a("  return <div className='rfc-eta-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className={'h-full rounded-full rfc-eta-fill ' + color} style={{ width: w + '%', animation: 'rfc-grow 1s ease-out' }}/></div>")
a("}")
a("")
a("function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {")
a("  const r = 28, c = 2 * Math.PI * r, offset = c - (value / 100) * c")
a("  return <div className='rfc-ring flex flex-col items-center'><svg width='70' height='70' className='-rotate-90'><circle cx='35' cy='35' r={r} fill='none' stroke='#27272a' strokeWidth='5'/><circle cx='35' cy='35' r={r} fill='none' stroke={color} strokeWidth='5' strokeDasharray={c} strokeDashoffset={offset} strokeLinecap='round' className='rfc-ring-path' style={{ transition: 'stroke-dashoffset 1s ease' }}/></svg><span className='rfc-ring-val text-sm font-bold mt-1' style={{ color }}>{value}%</span><span className='rfc-ring-label text-[10px] text-zinc-500'>{label}</span></div>")
a("}")
a("")
a("function KpiTile({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {")
a("  return <div className='rfc-kpi bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 rfc-kpi-card'><p className='text-xs text-zinc-500 mb-1'>{label}</p><p className={'text-xl font-bold ' + color}>{value}</p><p className='text-[10px] text-zinc-400 mt-1'>{sub}</p></div>")
a("}")
a("")
a("function ValueTile({ label, value, change }: { label: string; value: string; change: string }) {")
a("  const up = change.startswith('+')")
a("  return <div className='rfc-value-tile bg-zinc-900/60 border border-zinc-800 rounded-lg p-3'><p className='text-xs text-zinc-500'>{label}</p><p className='text-lg font-bold text-white mt-1'>{value}</p><p className={'text-xs mt-1 ' + (up ? 'text-emerald-400' : 'text-red-400')}>{change}</p></div>")
a("}")

a("")
a("const insights = [")
a("  { title: 'WDFC Congestion Alert', desc: 'Western Dedicated Freight Corridor experiencing 35% delay between Rewari and Vadodara. 12 consignments rerouted via old IR network. ETD recovery expected within 48 hours.', severity: 'high' },")
a("  { title: 'Monsoon Disruption', desc: 'Mumbai-Chennai corridor affected by heavy rainfall. 8 rakes held at Pune terminal. Intermodal switch to road for time-critical cargo recommended.', severity: 'high' },")
a("  { title: 'Container Volume Spike', desc: 'Nhava Sheva to Delhi container volumes up 22% month-over-month. Pre-position additional flat wagons at Dadri terminal to handle surge.', severity: 'medium' },")
a("  { title: 'DFCCIL Integration Win', desc: 'Eastern DFC onboarding complete. 15 new consignors registered. Avg transit time Kolkata-Delhi reduced from 36h to 28h. Revenue impact: +INR 2.4Cr.', severity: 'low' },")
a("]")

a("")
a("export default function RailFreightCommandView() {")
a("  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})")
a("  const [searchQuery, setSearchQuery] = useState('')")
a("  const [tab, setTab] = useState('dashboard')")

a("")
a("  const toggleFilter = (key: string, val: string) => {")
a("    setActiveFilters(prev => {")
a("      const cur = prev[key] || []")
a("      const next = cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val]")
a("      return { ...prev, [key]: next }")
a("    })")
a("  }")

a("")
a("  const filtered = consignments.filter(c => {")
a("    for (const [key, vals] of Object.entries(activeFilters)) {")
a("      if (vals.length > 0 && !vals.includes(c[key as keyof typeof c] as string)) return false")
a("    }")
a("    if (searchQuery && !Object.values(c).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))) return false")
a("    return true")
a("  })")

a("")
a("  return (")
a("    <div className='rfc-root space-y-4 p-4'>")
a("      <PageHeader title='Rail Freight Command' description='Indian rail freight operations & dedicated corridor management' />")
a("")
a("      <Tabs value={tab} onValueChange={setTab}>")
a("        <TabsList className='rfc-tabs-list bg-zinc-900 border border-zinc-800'>")
a("          <TabsTrigger value='dashboard' className='rfc-tab'>Dashboard</TabsTrigger>")
a("          <TabsTrigger value='consignments' className='rfc-tab'>Consignments</TabsTrigger>")
a("          <TabsTrigger value='analytics' className='rfc-tab'>Analytics</TabsTrigger>")
a("          <TabsTrigger value='insights' className='rfc-tab'>Insights</TabsTrigger>")
a("        </TabsList>")
a("")
a("        <TabsContent value='dashboard' className='rfc-tab-content space-y-4 mt-4'>")
a("          <div className='rfc-kpi-row grid grid-cols-2 lg:grid-cols-4 gap-3'>")
a("            <KpiTile label='Active Rakes' value='247' sub='+18 vs yesterday' color='text-orange-400' />")
a("            <KpiTile label='Avg Transit Time' value='32h' sub='-4h improvement' color='text-red-400' />")
a("            <KpiTile label='Tonnage (MTD)' value='18.5K' sub='+22% vs last month' color='text-amber-400' />")
a("            <KpiTile label='Revenue (Cr)' value='42.7' sub='+8% QoQ' color='text-blue-400' />")
a("          </div>")
a("          <div className='rfc-ring-row flex flex-wrap justify-around gap-2'>")
a("            <HealthRing value={82} label='On-Time' color='#f97316' />")
a("            <HealthRing value={88} label='Utilization' color='#ef4444' />")
a("            <HealthRing value={91} label='Capacity' color='#eab308' />")
a("            <HealthRing value={74} label='Speed' color='#3b82f6' />")
a("            <HealthRing value={86} label='Reliability' color='#10b981' />")
a("            <HealthRing value={79} label='Cost Eff' color='#8b5cf6' />")
a("          </div>")
a("          <div className='rfc-chart-row grid grid-cols-1 lg:grid-cols-3 gap-4'>")
a("            <Card className='rfc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Monthly Tonnage</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='month' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Line type='monotone' dataKey='tons' stroke='#f97316' strokeWidth={2} dot={false}/><Line type='monotone' dataKey='rakes' stroke='#ef4444' strokeWidth={2} dot={false}/></LineChart></CardContent></Card>")
a("            <Card className='rfc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Corridor Utilization</CardTitle></CardHeader><CardContent><BarChart data={monthlyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='month' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Bar dataKey='utilization' fill='#eab308' radius={[4,4,0,0]}/></BarChart></CardContent></Card>")
a("            <Card className='rfc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Cargo Distribution</CardTitle></CardHeader><CardContent><PieChart width={350} height={200}><Pie data={cargoDist} cx='50%' cy='50%' outerRadius={70} innerRadius={35} dataKey='value' paddingAngle={2}>{cargoDist.map((_, i) => <Cell key={i} fill={COLORS[i % 8]} />)}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>")
a("          </div>")
a("        </TabsContent>")
a("")
a("        <TabsContent value='consignments' className='rfc-tab-content space-y-4 mt-4'>")
a("          <ModuleBreadcrumb items={[{ label: 'Rail Freight' }, { label: 'Consignments' }]} />")
a("          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => { setActiveFilters({}); setSearchQuery('') }} totalItems={consignments.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder='Search by ID, rake, corridor...' />")
a("          <Card className='rfc-table-card bg-zinc-900/60 border-zinc-800'><CardContent className='p-0'><div className='rfc-table-wrap overflow-x-auto'><table className='rfc-table w-full text-sm'><thead><tr className='border-b border-zinc-800'><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>ID</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Rake</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Corridor</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Cargo</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Priority</th><th className='text-right px-3 py-2 text-zinc-500 text-xs font-medium'>Weight(T)</th><th className='text-right px-3 py-2 text-zinc-500 text-xs font-medium'>Wagons</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>ETA</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Dwell(h)</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Status</th></tr></thead><tbody>")
a("          {filtered.map(c => (")
a("            <tr key={c.id} className='rfc-table-row border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors'>")
a("              <td className='px-3 py-2 font-mono text-xs text-orange-400'>{c.id}</td>")
a("              <td className='px-3 py-2 font-mono text-xs'>{c.rakeNo}</td>")
a("              <td className='px-3 py-2 text-xs text-zinc-300'>{c.origin} → {c.destination}</td>")
a("              <td className='px-3 py-2'><CargoBadge cargo={c.cargo} /></td>")
a("              <td className='px-3 py-2'><PriorityBadge priority={c.priority} /></td>")
a("              <td className='px-3 py-2 text-right text-xs font-medium'>{c.weight}</td>")
a("              <td className='px-3 py-2 text-right text-xs'>{c.wagons}</td>")
a("              <td className='px-3 py-2 w-24'><EtaBar value={c.eta_hrs} /><span className='text-[10px] text-zinc-500 ml-1'>{c.eta_hrs}h</span></td>")
a("              <td className='px-3 py-2 w-24'><WeightBar value={c.dwell_hrs} max={24} /><span className='text-[10px] text-zinc-500 ml-1'>{c.dwell_hrs}h</span></td>")
a("              <td className='px-3 py-2'><StatusBadge status={c.status} /></td>")
a("            </tr>")
a("          ))}")
a("          </tbody></table></div></CardContent></Card>")
a("        </TabsContent>")
a("")
a("        <TabsContent value='analytics' className='rfc-tab-content space-y-4 mt-4'>")
a("          <div className='rfc-value-row grid grid-cols-2 lg:grid-cols-4 gap-3'>")
a("            <ValueTile label='Total Rakes (MTD)' value='1,247' change='+18% YoY' />")
a("            <ValueTile label='Avg Dwell Time' value='6.2h' change='-1.8h' />")
a("            <ValueTile label='WDFC Share' value='38%' change='+12pp YoY' />")
a("            <ValueTile label='Revenue/Train-km' value='INR 8.4K' change='+6% QoQ' />")
a("          </div>")
a("          <div className='rfc-analytics-charts grid grid-cols-1 lg:grid-cols-2 gap-4'>")

corridor_data = []
for cor in CORRIDORS_PY:
    corridor_data.append(f"{{ name: '{cor}', tons: {random.randint(200,1800)}, revenue: {random.randint(10,120)} }}")
corridor_data_str = ", ".join(corridor_data)

a(f"            <Card className='rfc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Corridor Tonnage</CardTitle></CardHeader><CardContent><BarChart data={[{corridor_data_str}]} width={450} height={220}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='name' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Bar dataKey='tons' fill='#f97316' radius={[4,4,0,0]}/><Bar dataKey='revenue' fill='#eab308' radius={[4,4,0,0]}/></BarChart></CardContent></Card>")

a("            <Card className='rfc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Railway Operator Mix</CardTitle></CardHeader><CardContent><PieChart width={450} height={220}><Pie data={[{ name: 'IR Freight', value: 35 }, { name: 'DFCCIL', value: 25 }, { name: 'CONCOR', value: 18 }, { name: 'Private', value: 12 }, { name: 'Others', value: 10 }]} cx='50%' cy='50%' outerRadius={80} innerRadius={40} dataKey='value' paddingAngle={3}>{[<Cell key={0} fill='#f97316' />, <Cell key={1} fill='#ef4444' />, <Cell key={2} fill='#eab308' />, <Cell key={3} fill='#3b82f6' />, <Cell key={4} fill='#6b7280' />]}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>")
a("          </div>")
a("        </TabsContent>")
a("")
a("        <TabsContent value='insights' className='rfc-tab-content space-y-4 mt-4'>")
a("          {insights.map((ins, i) => (")
a("            <Card key={i} className={'rfc-insight-card bg-zinc-900/60 border ' + (ins.severity === 'high' ? 'border-orange-500/30' : ins.severity === 'medium' ? 'border-amber-500/30' : 'border-zinc-800')}><CardContent className='p-4'><div className='flex items-start gap-3'><div className={'rfc-insight-dot w-2 h-2 rounded-full mt-1.5 shrink-0 ' + (ins.severity === 'high' ? 'bg-orange-500' : ins.severity === 'medium' ? 'bg-amber-500' : 'bg-zinc-500')} /><div><p className='text-sm font-medium text-zinc-200'>{ins.title}</p><p className='text-xs text-zinc-400 mt-1 leading-relaxed'>{ins.desc}</p></div></div></CardContent></Card>")
a("          ))}")
a("        </TabsContent>")
a("      </Tabs>")
a("    </div>")
a("  )")
a("}")
a("")

with open('/home/z/my-project/src/components/modules/rail-freight-command-view.tsx', 'w') as f:
    f.write('\n'.join(lines))
print(f"Generated rail-freight-command-view.tsx: {len(lines)} lines")
