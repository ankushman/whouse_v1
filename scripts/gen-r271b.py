#!/usr/bin/env python3
"""Regenerate Micro-Fulfillment Center module (R271b) - pure JS literals"""
import random
random.seed(271)

lines = []
a = lines.append

a("import React, { useState } from 'react'")
a("import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'")
a("import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'")
a("import { PageHeader } from '@/components/layout/page-header'")
a("import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'")
a("import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'")
a("import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'")

a("")
a("const COLORS = ['#06b6d4', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#6366f1']")
a("")
a("const ZONE_TYPES = ['Pick Zone', 'Pack Zone', 'Staging', 'Returns', 'Cold Storage', 'Bulk Storage', 'Value-Add', 'QC Zone']")
a("const CITIES = ['Mumbai', 'Delhi NCR', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad']")
a("const STATUSES = ['Operational', 'Setup', 'Maintenance', 'Under Review']")
a("const AUTOMATION = ['Full Auto', 'Semi-Auto', 'Manual', 'Robot-Assisted']")
a("const CENTER_NAMES = ['Central', 'South', 'North', 'East', 'West', 'Express', 'Prime', 'Lite']")

CITIES_PY = ['Mumbai', 'Delhi NCR', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad']
ZONE_TYPES_PY = ['Pick Zone', 'Pack Zone', 'Staging', 'Returns', 'Cold Storage', 'Bulk Storage', 'Value-Add', 'QC Zone']
STATUSES_PY = ['Operational', 'Setup', 'Maintenance', 'Under Review']
AUTOMATION_PY = ['Full Auto', 'Semi-Auto', 'Manual', 'Robot-Assisted']
CENTER_NAMES_PY = ['Central', 'South', 'North', 'East', 'West', 'Express', 'Prime', 'Lite']

centers = []
for i in range(55):
    city = CITIES_PY[i % 8]
    zone = ZONE_TYPES_PY[i % 8]
    status = STATUSES_PY[i % 4]
    auto = AUTOMATION_PY[i % 4]
    utilization = random.randint(40, 98)
    ordersPerHr = random.randint(120, 850)
    throughput = random.randint(200, 1500)
    sqft = random.randint(2000, 25000)
    workers = random.randint(5, 60)
    avgFulfillTime = round(random.uniform(8, 45), 1)
    accuracy = random.randint(94, 99)
    centers.append({
        'id': f'MFC-{i+1:04d}',
        'name': f'MFC {city} {CENTER_NAMES_PY[i % 8]}',
        'city': city,
        'zoneType': zone,
        'status': status,
        'automation': auto,
        'utilization': utilization,
        'ordersPerHr': ordersPerHr,
        'throughput': throughput,
        'sqft': sqft,
        'workers': workers,
        'avgFulfillTime': avgFulfillTime,
        'accuracy': accuracy,
        'activatedAt': f"2026-0{random.randint(1,7)}-{random.randint(1,28):02d}",
    })

a("")
a("const centers = [")
for c in centers:
    a(f"  {{ id: '{c['id']}', name: '{c['name']}', city: '{c['city']}', zoneType: '{c['zoneType']}', status: '{c['status']}', automation: '{c['automation']}', utilization: {c['utilization']}, ordersPerHr: {c['ordersPerHr']}, throughput: {c['throughput']}, sqft: {c['sqft']}, workers: {c['workers']}, avgFulfillTime: {c['avgFulfillTime']}, accuracy: {c['accuracy']}, activatedAt: '{c['activatedAt']}' }},")
a("]")

a("")
a("const monthlyData = [")
for i in range(12):
    month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]
    orders = random.randint(5000, 15000)
    tp = random.randint(8000, 18000)
    util = round(random.uniform(65, 95), 1)
    a(f"  {{ month: '{month}', orders: {orders}, throughput: {tp}, utilization: {util} }},")
a("]")

a("")
a("const zoneDist = [")
for z in ZONE_TYPES_PY:
    val = random.randint(20, 100)
    a(f"  {{ name: '{z}', value: {val} }},")
a("]")

a("")
a("const filterGroups = [")
a("  { key: 'zoneType', label: 'Zone Type', options: ZONE_TYPES.map(z => ({ value: z, label: z, count: 0 })) },")
a("  { key: 'automation', label: 'Automation', options: AUTOMATION.map(a => ({ value: a, label: a, count: 0 })) },")
a("  { key: 'status', label: 'Status', options: STATUSES.map(s => ({ value: s, label: s, count: 0 })) },")
a("]")

a("")
a("function ZoneBadge({ zone }: { zone: string }) {")
a("  const color = zone === 'Pick Zone' ? 'bg-cyan-500/15 text-cyan-400' : zone === 'Pack Zone' ? 'bg-blue-500/15 text-blue-400' : zone === 'Cold Storage' ? 'bg-emerald-500/15 text-emerald-400' : zone === 'Returns' ? 'bg-red-500/15 text-red-400' : zone === 'Value-Add' ? 'bg-violet-500/15 text-violet-400' : zone === 'QC Zone' ? 'bg-amber-500/15 text-amber-400' : zone === 'Staging' ? 'bg-pink-500/15 text-pink-400' : 'bg-zinc-500/15 text-zinc-400'")
a("  return <span className={'mfc-zone-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{zone}</span>")
a("}")
a("")
a("function StatusBadge({ status }: { status: string }) {")
a("  const color = status === 'Operational' ? 'bg-emerald-500/15 text-emerald-400' : status === 'Setup' ? 'bg-blue-500/15 text-blue-400' : status === 'Maintenance' ? 'bg-amber-500/15 text-amber-400' : 'bg-zinc-500/15 text-zinc-400'")
a("  return <span className={'mfc-status-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{status}</span>")
a("}")
a("")
a("function AutoBadge({ level }: { level: string }) {")
a("  const color = level === 'Full Auto' ? 'bg-violet-500/15 text-violet-400' : level === 'Semi-Auto' ? 'bg-blue-500/15 text-blue-400' : level === 'Robot-Assisted' ? 'bg-cyan-500/15 text-cyan-400' : 'bg-zinc-500/15 text-zinc-400'")
a("  return <span className={'mfc-auto-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{level}</span>")
a("}")
a("")
a("function UtilBar({ value }: { value: number }) {")
a("  const w = value")
a("  const color = value > 85 ? 'bg-emerald-500' : value > 65 ? 'bg-blue-500' : value > 45 ? 'bg-amber-500' : 'bg-red-500'")
a("  return <div className='mfc-util-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className={'h-full rounded-full mfc-util-fill ' + color} style={{ width: w + '%', animation: 'mfc-grow 1s ease-out' }}/></div>")
a("}")
a("")
a("function ThroughputBar({ value, max }: { value: number; max: number }) {")
a("  const w = Math.round(value / max * 100)")
a("  return <div className='mfc-tp-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className='h-full rounded-full bg-cyan-500 mfc-tp-fill' style={{ width: w + '%', animation: 'mfc-grow 1s ease-out' }}/></div>")
a("}")
a("")
a("function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {")
a("  const r = 28, c = 2 * Math.PI * r, offset = c - (value / 100) * c")
a("  return <div className='mfc-ring flex flex-col items-center'><svg width='70' height='70' className='-rotate-90'><circle cx='35' cy='35' r={r} fill='none' stroke='#27272a' strokeWidth='5'/><circle cx='35' cy='35' r={r} fill='none' stroke={color} strokeWidth='5' strokeDasharray={c} strokeDashoffset={offset} strokeLinecap='round' className='mfc-ring-path' style={{ transition: 'stroke-dashoffset 1s ease' }}/></svg><span className='mfc-ring-val text-sm font-bold mt-1' style={{ color }}>{value}%</span><span className='mfc-ring-label text-[10px] text-zinc-500'>{label}</span></div>")
a("}")
a("")
a("function KpiTile({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {")
a("  return <div className='mfc-kpi bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 mfc-kpi-card'><p className='text-xs text-zinc-500 mb-1'>{label}</p><p className={'text-xl font-bold ' + color}>{value}</p><p className='text-[10px] text-zinc-400 mt-1'>{sub}</p></div>")
a("}")
a("")
a("function ValueTile({ label, value, change }: { label: string; value: string; change: string }) {")
a("  const up = change.startsWith('+')")
a("  return <div className='mfc-value-tile bg-zinc-900/60 border border-zinc-800 rounded-lg p-3'><p className='text-xs text-zinc-500'>{label}</p><p className='text-lg font-bold text-white mt-1'>{value}</p><p className={'text-xs mt-1 ' + (up ? 'text-emerald-400' : 'text-red-400')}>{change}</p></div>")
a("}")

a("")
a("const insights = [")
a("  { title: 'Peak Hour Optimization', desc: 'Mumbai Central and Delhi NCR Express centers exceeding 92% utilization during 2-5 PM peak. Recommend adding robot-assisted pick stations to reduce bottlenecks by 30%.', severity: 'high' },")
a("  { title: 'Automation ROI Milestone', desc: 'Full Auto centers now achieve 3.2x throughput vs manual at 1.8x cost. Bangalore South and Hyderabad Central show best ROI at 14-month payback period.', severity: 'medium' },")
a("  { title: 'Cold Storage Expansion', desc: 'Chennai and Kolkata MFCs report 85% cold storage capacity. Pharma and frozen food demand up 40% YoY. Recommend modular cold unit installation by Q3.', severity: 'high' },")
a("  { title: 'Worker Efficiency Gains', desc: 'Semi-Auto zones show 28% pick rate improvement after wearable scanner deployment. Expand to all Pick Zones across 55 centers by end of August.', severity: 'low' },")
a("]")

a("")
a("export default function MicroFulfillmentCenterView() {")
a("  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})")
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
a("  const filtered = centers.filter(c => {")
a("    for (const [key, vals] of Object.entries(activeFilters)) {")
a("      if (vals.length > 0 && !vals.includes(c[key as keyof typeof c] as string)) return false")
a("    }")
a("    return true")
a("  })")
a("")
a("  return (")
a("    <div className='mfc-root space-y-4 p-4'>")
a("      <PageHeader title='Micro-Fulfillment Center' description='Hyperlocal dark store & micro-warehouse operations' />")
a("")
a("      <Tabs value={tab} onValueChange={setTab}>")
a("        <TabsList className='mfc-tabs-list bg-zinc-900 border border-zinc-800'>")
a("          <TabsTrigger value='dashboard' className='mfc-tab'>Dashboard</TabsTrigger>")
a("          <TabsTrigger value='centers' className='mfc-tab'>Centers</TabsTrigger>")
a("          <TabsTrigger value='analytics' className='mfc-tab'>Analytics</TabsTrigger>")
a("          <TabsTrigger value='insights' className='mfc-tab'>Insights</TabsTrigger>")
a("        </TabsList>")
a("")
a("        <TabsContent value='dashboard' className='mfc-tab-content space-y-4 mt-4'>")
a("          <div className='mfc-kpi-row grid grid-cols-2 lg:grid-cols-4 gap-3'>")
a("            <KpiTile label='Active Centers' value='55' sub='+8 this quarter' color='text-cyan-400' />")
a("            <KpiTile label='Avg Utilization' value='76.4%' sub='+4.2pp vs Q1' color='text-blue-400' />")
a("            <KpiTile label='Orders/Hour' value='487' sub='+23% peak hours' color='text-emerald-400' />")
a("            <KpiTile label='Fulfill Accuracy' value='97.8%' sub='+0.6pp improvement' color='text-amber-400' />")
a("          </div>")
a("          <div className='mfc-ring-row flex flex-wrap justify-around gap-2'>")
a("            <HealthRing value={76} label='Utilization' color='#06b6d4' />")
a("            <HealthRing value={92} label='Uptime' color='#3b82f6' />")
a("            <HealthRing value={88} label='Pick Rate' color='#10b981' />")
a("            <HealthRing value={71} label='Automation' color='#f59e0b' />")
a("            <HealthRing value={85} label='On-Time' color='#8b5cf6' />")
a("            <HealthRing value={94} label='Quality' color='#ec4899' />")
a("          </div>")
a("          <div className='mfc-chart-row grid grid-cols-1 lg:grid-cols-3 gap-4'>")
a("            <Card className='mfc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Order Volume</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='month' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Line type='monotone' dataKey='orders' stroke='#06b6d4' strokeWidth={2} dot={false}/><Line type='monotone' dataKey='throughput' stroke='#3b82f6' strokeWidth={2} dot={false}/></LineChart></CardContent></Card>")
a("            <Card className='mfc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Utilization Trend</CardTitle></CardHeader><CardContent><BarChart data={monthlyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='month' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Bar dataKey='utilization' fill='#10b981' radius={[4,4,0,0]}/></BarChart></CardContent></Card>")
a("            <Card className='mfc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Zone Distribution</CardTitle></CardHeader><CardContent><PieChart width={350} height={200}><Pie data={zoneDist} cx='50%' cy='50%' outerRadius={70} innerRadius={35} dataKey='value' paddingAngle={2}>{zoneDist.map((_, i) => <Cell key={i} fill={COLORS[i % 8]} />)}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>")
a("          </div>")
a("        </TabsContent>")
a("")
a("        <TabsContent value='centers' className='mfc-tab-content space-y-4 mt-4'>")
a("          <ModuleBreadcrumb items={[{ label: 'Micro-Fulfillment' }, { label: 'Centers' }]} />")
a("          <SearchFilterToolbar filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} />")
a("          <Card className='mfc-table-card bg-zinc-900/60 border-zinc-800'><CardContent className='p-0'><div className='mfc-table-wrap overflow-x-auto'><table className='mfc-table w-full text-sm'><thead><tr className='border-b border-zinc-800'><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>ID</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Name</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>City</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Zone</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Automation</th><th className='text-right px-3 py-2 text-zinc-500 text-xs font-medium'>Sqft</th><th className='text-right px-3 py-2 text-zinc-500 text-xs font-medium'>Orders/Hr</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Utilization</th><th className='text-right px-3 py-2 text-zinc-500 text-xs font-medium'>Throughput</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Status</th></tr></thead><tbody>")
a("          {filtered.map(c => (")
a("            <tr key={c.id} className='mfc-table-row border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors'>")
a("              <td className='px-3 py-2 font-mono text-xs text-cyan-400'>{c.id}</td>")
a("              <td className='px-3 py-2 text-xs font-medium text-zinc-200'>{c.name}</td>")
a("              <td className='px-3 py-2 text-xs text-zinc-300'>{c.city}</td>")
a("              <td className='px-3 py-2'><ZoneBadge zone={c.zoneType} /></td>")
a("              <td className='px-3 py-2'><AutoBadge level={c.automation} /></td>")
a("              <td className='px-3 py-2 text-right text-xs text-zinc-300'>{c.sqft.toLocaleString()}</td>")
a("              <td className='px-3 py-2 text-right text-xs font-medium'>{c.ordersPerHr}</td>")
a("              <td className='px-3 py-2 w-24'><UtilBar value={c.utilization} /><span className='text-[10px] text-zinc-500 ml-1'>{c.utilization}%</span></td>")
a("              <td className='px-3 py-2 w-24'><ThroughputBar value={c.throughput} max={1500} /><span className='text-[10px] text-zinc-500 ml-1'>{c.throughput}</span></td>")
a("              <td className='px-3 py-2'><StatusBadge status={c.status} /></td>")
a("            </tr>")
a("          ))}")
a("          </tbody></table></div></CardContent></Card>")
a("        </TabsContent>")
a("")
a("        <TabsContent value='analytics' className='mfc-tab-content space-y-4 mt-4'>")
a("          <div className='mfc-value-row grid grid-cols-2 lg:grid-cols-4 gap-3'>")
a("            <ValueTile label='Total Sqft' value='685K' change='+15% YoY' />")
a("            <ValueTile label='Avg Fulfill Time' value='22.4 min' change='-3.1 min' />")
a("            <ValueTile label='Workers Deployed' value='1,240' change='+85 QoQ' />")
a("            <ValueTile label='Automation Rate' value='38%' change='+7pp YoY' />")
a("          </div>")
a("          <div className='mfc-analytics-charts grid grid-cols-1 lg:grid-cols-2 gap-4'>")

city_tp = []
for c in CITIES_PY:
    city_tp.append(f"{{ name: '{c}', throughput: {random.randint(800, 2500)}, orders: {random.randint(500, 1800)} }}")

a("            <Card className='mfc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>City Throughput</CardTitle></CardHeader><CardContent><BarChart data={[" + ", ".join(city_tp) + "]} width={450} height={220}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='name' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Bar dataKey='throughput' fill='#06b6d4' radius={[4,4,0,0]}/><Bar dataKey='orders' fill='#3b82f6' radius={[4,4,0,0]}/></BarChart></CardContent></Card>")
a("            <Card className='mfc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Automation Level Mix</CardTitle></CardHeader><CardContent><PieChart width={450} height={220}><Pie data={[{ name: 'Full Auto', value: 15 }, { name: 'Semi-Auto', value: 22 }, { name: 'Robot-Assisted', value: 10 }, { name: 'Manual', value: 8 }]} cx='50%' cy='50%' outerRadius={80} innerRadius={40} dataKey='value' paddingAngle={3}>{[<Cell key={0} fill='#8b5cf6' />, <Cell key={1} fill='#3b82f6' />, <Cell key={2} fill='#06b6d4' />, <Cell key={3} fill='#6b7280' />]}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>")
a("          </div>")
a("        </TabsContent>")
a("")
a("        <TabsContent value='insights' className='mfc-tab-content space-y-4 mt-4'>")
a("          {insights.map((ins, i) => (")
a("            <Card key={i} className={'mfc-insight-card bg-zinc-900/60 border ' + (ins.severity === 'high' ? 'border-cyan-500/30' : ins.severity === 'medium' ? 'border-amber-500/30' : 'border-zinc-800')}><CardContent className='p-4'><div className='flex items-start gap-3'><div className={'mfc-insight-dot w-2 h-2 rounded-full mt-1.5 shrink-0 ' + (ins.severity === 'high' ? 'bg-cyan-500' : ins.severity === 'medium' ? 'bg-amber-500' : 'bg-zinc-500')} /><div><p className='text-sm font-medium text-zinc-200'>{ins.title}</p><p className='text-xs text-zinc-400 mt-1 leading-relaxed'>{ins.desc}</p></div></div></CardContent></Card>")
a("          ))}")
a("        </TabsContent>")
a("      </Tabs>")
a("    </div>")
a("  )")
a("}")
a("")

with open('/home/z/my-project/src/components/modules/micro-fulfillment-center-view.tsx', 'w') as f:
    f.write('\n'.join(lines))

print(f"Generated micro-fulfillment-center-view.tsx: {len(lines)} lines")
