#!/usr/bin/env python3
"""Generate Drone Delivery Hub module (R272b) - pure JS literals"""
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
a("const COLORS = ['#10b981', '#06b6d4', '#3b82f6', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#f97316']")

DRONE_TYPES_PY = ['Fixed Wing', 'Multirotor', 'VTOL Hybrid', 'Heavy Lift', 'Delivery Bot', 'Agricultural']
ZONES_PY = ['Metro Zone', 'Suburban Ring', 'Industrial Belt', 'Rural Outreach', 'Hilly Terrain', 'Coastal Arc', 'Island Connect', 'Emergency Zone']
MISSION_TYPES_PY = ['Medical Supply', 'E-commerce Express', 'Food Delivery', 'Agricultural Spray', 'Survey & Map', 'Infra Inspect', 'Emergency Relief', 'WH Transfer']
STATUSES_PY = ['Airborne', 'Charging', 'Maintenance', 'Standby', 'Returning', 'Loading']
OPERATORS_PY = ['SkyPort India', 'DroneSeva', 'AeroLogistics', 'FlytBase Ops', 'Garuda Drones', 'TechEagle', 'DroniX', 'AutoSky']

a("")
a("const DRONE_TYPES = ['Fixed Wing', 'Multirotor', 'VTOL Hybrid', 'Heavy Lift', 'Delivery Bot', 'Agricultural']")
a("const ZONES = ['Metro Zone', 'Suburban Ring', 'Industrial Belt', 'Rural Outreach', 'Hilly Terrain', 'Coastal Arc', 'Island Connect', 'Emergency Zone']")
a("const MISSION_TYPES = ['Medical Supply', 'E-commerce Express', 'Food Delivery', 'Agricultural Spray', 'Survey & Map', 'Infra Inspect', 'Emergency Relief', 'WH Transfer']")
a("const STATUSES = ['Airborne', 'Charging', 'Maintenance', 'Standby', 'Returning', 'Loading']")
a("const OPERATORS = ['SkyPort India', 'DroneSeva', 'AeroLogistics', 'FlytBase Ops', 'Garuda Drones', 'TechEagle', 'DroniX', 'AutoSky']")

drones = []
for i in range(55):
    dtype = DRONE_TYPES_PY[i % 6]
    zone = ZONES_PY[i % 8]
    mission = MISSION_TYPES_PY[i % 8]
    status = STATUSES_PY[i % 6]
    operator = OPERATORS_PY[i % 8]
    battery = random.randint(15, 100)
    range_km = round(random.uniform(2, 80), 1)
    payload = random.randint(1, 25)
    altitude = random.randint(30, 400)
    speed = random.randint(20, 150)
    missions_today = random.randint(1, 18)
    drones.append({
        'id': 'DRN-%04d' % (i+1),
        'model': '%s-%d' % (dtype.split()[0], random.randint(100,999)),
        'type': dtype,
        'zone': zone,
        'mission': mission,
        'status': status,
        'operator': operator,
        'battery': battery,
        'range_km': range_km,
        'payload': payload,
        'altitude': altitude,
        'speed': speed,
        'missions_today': missions_today,
        'lastUpdate': '2026-07-%02d %02d:%02d' % (random.randint(1,30), random.randint(0,23), random.randint(0,59)),
    })

a("")
a("const drones = [")
for d in drones:
    a("  { id: '%s', model: '%s', type: '%s', zone: '%s', mission: '%s', status: '%s', operator: '%s', battery: %d, range_km: %s, payload: %d, altitude: %d, speed: %d, missions_today: %d, lastUpdate: '%s' }," % (d['id'], d['model'], d['type'], d['zone'], d['mission'], d['status'], d['operator'], d['battery'], d['range_km'], d['payload'], d['altitude'], d['speed'], d['missions_today'], d['lastUpdate']))
a("]")

a("")
a("const monthlyData = [")
for i in range(12):
    month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]
    flights = random.randint(200,800)
    deliveries = random.randint(150,650)
    a("  { month: '%s', flights: %d, deliveries: %d, successRate: %s }," % (month, flights, deliveries, str(round(random.uniform(88,99),1))))
a("]")

a("")
a("const zoneDist = [")
for z in ZONES_PY:
    val = random.randint(15,80)
    a("  { name: '%s', value: %d }," % (z, val))
a("]")

a("")
a("const filterGroups = [")
a("  { key: 'type', label: 'Drone Type', options: DRONE_TYPES.map(t => ({ value: t, label: t, count: 0 })) },")
a("  { key: 'status', label: 'Status', options: STATUSES.map(s => ({ value: s, label: s, count: 0 })) },")
a("  { key: 'mission', label: 'Mission', options: MISSION_TYPES.map(m => ({ value: m, label: m, count: 0 })) },")
a("]")

a("")
a("function TypeBadge({ type }: { type: string }) {")
a("  const color = type === 'Fixed Wing' ? 'bg-emerald-500/15 text-emerald-400' : type === 'Multirotor' ? 'bg-cyan-500/15 text-cyan-400' : type === 'VTOL Hybrid' ? 'bg-blue-500/15 text-blue-400' : type === 'Heavy Lift' ? 'bg-amber-500/15 text-amber-400' : type === 'Delivery Bot' ? 'bg-violet-500/15 text-violet-400' : 'bg-rose-500/15 text-rose-400'")
a("  return <span className={'drh-type-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{type}</span>")
a("}")
a("")
a("function StatusBadge({ status }: { status: string }) {")
a("  const color = status === 'Airborne' ? 'bg-emerald-500/15 text-emerald-400' : status === 'Charging' ? 'bg-amber-500/15 text-amber-400' : status === 'Maintenance' ? 'bg-red-500/15 text-red-400' : status === 'Standby' ? 'bg-zinc-500/15 text-zinc-400' : status === 'Returning' ? 'bg-blue-500/15 text-blue-400' : 'bg-cyan-500/15 text-cyan-400'")
a("  return <span className={'drh-status-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{status}</span>")
a("}")
a("")
a("function BatteryIndicator({ value }: { value: number }) {")
a("  const w = value")
a("  const color = value > 60 ? 'bg-emerald-500' : value > 30 ? 'bg-amber-500' : 'bg-red-500'")
a("  return <div className='drh-batt-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className={'h-full rounded-full drh-batt-fill ' + color} style={{ width: w + '%', animation: 'drh-grow 1s ease-out' }}/></div>")
a("}")
a("")
a("function PayloadBar({ value, max }: { value: number; max: number }) {")
a("  const w = Math.round(value / max * 100)")
a("  return <div className='drh-pl-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className='h-full rounded-full bg-cyan-500 drh-pl-fill' style={{ width: w + '%', animation: 'drh-grow 1s ease-out' }}/></div>")
a("}")
a("")
a("function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {")
a("  const r = 28, c = 2 * Math.PI * r, offset = c - (value / 100) * c")
a("  return <div className='drh-ring flex flex-col items-center'><svg width='70' height='70' className='-rotate-90'><circle cx='35' cy='35' r={r} fill='none' stroke='#27272a' strokeWidth='5'/><circle cx='35' cy='35' r={r} fill='none' stroke={color} strokeWidth='5' strokeDasharray={c} strokeDashoffset={offset} strokeLinecap='round' className='drh-ring-path' style={{ transition: 'stroke-dashoffset 1s ease' }}/></svg><span className='drh-ring-val text-sm font-bold mt-1' style={{ color }}>{value}%</span><span className='drh-ring-label text-[10px] text-zinc-500'>{label}</span></div>")
a("}")
a("")
a("function KpiTile({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {")
a("  return <div className='drh-kpi bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 drh-kpi-card'><p className='text-xs text-zinc-500 mb-1'>{label}</p><p className={'text-xl font-bold ' + color}>{value}</p><p className='text-[10px] text-zinc-400 mt-1'>{sub}</p></div>")
a("}")
a("")
a("function ValueTile({ label, value, change }: { label: string; value: string; change: string }) {")
a("  const up = change.startsWith('+')")
a("  return <div className='drh-value-tile bg-zinc-900/60 border border-zinc-800 rounded-lg p-3'><p className='text-xs text-zinc-500'>{label}</p><p className='text-lg font-bold text-white mt-1'>{value}</p><p className={'text-xs mt-1 ' + (up ? 'text-emerald-400' : 'text-red-400')}>{change}</p></div>")
a("}")

a("")
a("const insights = [")
a("  { title: 'BVLOS Permission Granted', desc: 'DGCA approved Beyond Visual Line of Sight operations for 5 zones covering Mumbai-Pune corridor. 12 new delivery routes activated. Expected daily capacity: +340 flights.', severity: 'high' },")
a("  { title: 'Battery Technology Upgrade', desc: 'Lithium-sulfur cells deployed across 20 Multirotor fleet. Flight endurance increased from 35min to 62min. Payload capacity up 15%. Maintenance cost down 22%.', severity: 'medium' },")
a("  { title: 'Weather API Integration', desc: 'Real-time IMD weather feed now auto-halts flights during wind >40km/h or visibility <500m. Prevented 23 unsafe flights in July. Safety compliance at 99.7%.', severity: 'medium' },")
a("  { title: 'Rural Medical Route Success', desc: 'Emergency medical supply drone route to 8 PHCs in Karnataka rural belt achieving 94% on-time delivery. Avg delivery time: 18 min vs 2.5 hrs by road.', severity: 'low' },")
a("]")

a("")
a("export default function DroneDeliveryHubView() {")
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
a("  const filtered = drones.filter(d => {")
a("    for (const [key, vals] of Object.entries(activeFilters)) {")
a("      if (vals.length > 0 && !vals.includes(d[key as keyof typeof d] as string)) return false")
a("    }")
a("    if (searchQuery && !Object.values(d).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))) return false")
a("    return true")
a("  })")
a("")
a("  return (")
a("    <div className='drh-root space-y-4 p-4'>")
a("      <PageHeader title='Drone Delivery Hub' description='UAV fleet management & autonomous delivery operations' />")
a("")
a("      <Tabs value={tab} onValueChange={setTab}>")
a("        <TabsList className='drh-tabs-list bg-zinc-900 border border-zinc-800'>")
a("          <TabsTrigger value='dashboard' className='drh-tab'>Dashboard</TabsTrigger>")
a("          <TabsTrigger value='fleet' className='drh-tab'>Fleet</TabsTrigger>")
a("          <TabsTrigger value='analytics' className='drh-tab'>Analytics</TabsTrigger>")
a("          <TabsTrigger value='insights' className='drh-tab'>Insights</TabsTrigger>")
a("        </TabsList>")
a("")
a("        <TabsContent value='dashboard' className='drh-tab-content space-y-4 mt-4'>")
a("          <div className='drh-kpi-row grid grid-cols-2 lg:grid-cols-4 gap-3'>")
a("            <KpiTile label='Active Drones' value='55' sub='+12 this quarter' color='text-emerald-400' />")
a("            <KpiTile label='Flights Today' value='142' sub='+28% vs avg' color='text-cyan-400' />")
a("            <KpiTile label='Success Rate' value='96.8%' sub='+1.2pp' color='text-blue-400' />")
a("            <KpiTile label='Avg Delivery' value='18 min' sub='-4 min improvement' color='text-amber-400' />")
a("          </div>")
a("          <div className='drh-ring-row flex flex-wrap justify-around gap-2'>")
a("            <HealthRing value={97} label='Safety' color='#10b981' />")
a("            <HealthRing value={84} label='Battery Avg' color='#06b6d4' />")
a("            <HealthRing value={91} label='On-Time' color='#3b82f6' />")
a("            <HealthRing value={73} label='Coverage' color='#f59e0b' />")
a("            <HealthRing value={88} label='Uptime' color='#8b5cf6' />")
a("            <HealthRing value={95} label='Signal' color='#ec4899' />")
a("          </div>")
a("          <div className='drh-chart-row grid grid-cols-1 lg:grid-cols-3 gap-4'>")
a("            <Card className='drh-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Flight Volume</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='month' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Line type='monotone' dataKey='flights' stroke='#10b981' strokeWidth={2} dot={false}/><Line type='monotone' dataKey='deliveries' stroke='#06b6d4' strokeWidth={2} dot={false}/></LineChart></CardContent></Card>")
a("            <Card className='drh-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Success Rate Trend</CardTitle></CardHeader><CardContent><BarChart data={monthlyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='month' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Bar dataKey='successRate' fill='#3b82f6' radius={[4,4,0,0]}/></BarChart></CardContent></Card>")
a("            <Card className='drh-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Zone Distribution</CardTitle></CardHeader><CardContent><PieChart width={350} height={200}><Pie data={zoneDist} cx='50%' cy='50%' outerRadius={70} innerRadius={35} dataKey='value' paddingAngle={2}>{zoneDist.map((_, i) => <Cell key={i} fill={COLORS[i % 8]} />)}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>")
a("          </div>")
a("        </TabsContent>")
a("")
a("        <TabsContent value='fleet' className='drh-tab-content space-y-4 mt-4'>")
a("          <ModuleBreadcrumb items={[{ label: 'Drone Hub' }, { label: 'Fleet' }]} />")
a("          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => { setActiveFilters({}); setSearchQuery('') }} totalItems={drones.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder='Search drones by ID, model, zone...' />")
a("          <Card className='drh-table-card bg-zinc-900/60 border-zinc-800'><CardContent className='p-0'><div className='drh-table-wrap overflow-x-auto'><table className='drh-table w-full text-sm'><thead><tr className='border-b border-zinc-800'><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>ID</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Model</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Type</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Zone</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Mission</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Operator</th><th className='text-right px-3 py-2 text-zinc-500 text-xs font-medium'>Battery</th><th className='text-right px-3 py-2 text-zinc-500 text-xs font-medium'>Payload</th><th className='text-right px-3 py-2 text-zinc-500 text-xs font-medium'>Speed</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Status</th></tr></thead><tbody>")
a("          {filtered.map(d => (")
a("            <tr key={d.id} className='drh-table-row border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors'>")
a("              <td className='px-3 py-2 font-mono text-xs text-emerald-400'>{d.id}</td>")
a("              <td className='px-3 py-2 text-xs font-medium text-zinc-200'>{d.model}</td>")
a("              <td className='px-3 py-2'><TypeBadge type={d.type} /></td>")
a("              <td className='px-3 py-2 text-xs text-zinc-300'>{d.zone}</td>")
a("              <td className='px-3 py-2 text-xs text-zinc-400'>{d.mission}</td>")
a("              <td className='px-3 py-2 text-xs text-blue-300'>{d.operator}</td>")
a("              <td className='px-3 py-2 w-24'><BatteryIndicator value={d.battery} /><span className='text-[10px] text-zinc-500 ml-1'>{d.battery}%</span></td>")
a("              <td className='px-3 py-2 text-right text-xs'>{d.payload}kg</td>")
a("              <td className='px-3 py-2 text-right text-xs'>{d.speed}km/h</td>")
a("              <td className='px-3 py-2'><StatusBadge status={d.status} /></td>")
a("            </tr>")
a("          ))})")
a("          </tbody></table></div></CardContent></Card>")
a("        </TabsContent>")
a("")
a("        <TabsContent value='analytics' className='drh-tab-content space-y-4 mt-4'>")
a("          <div className='drh-value-row grid grid-cols-2 lg:grid-cols-4 gap-3'>")
a("            <ValueTile label='Total Flights (MTD)' value='4,280' change='+35% YoY' />")
a("            <ValueTile label='Avg Flight Time' value='14.2 min' change='-2.1 min' />")
a("            <ValueTile label='Distance Covered' value='12.5K km' change='+22% QoQ' />")
a("            <ValueTile label='Battery Lifespan' value='340 cycles' change='+45 cycles' />")
a("          </div>")
a("          <div className='drh-analytics-charts grid grid-cols-1 lg:grid-cols-2 gap-4'>")
a("            <Card className='drh-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Mission Type Mix</CardTitle></CardHeader><CardContent><PieChart width={450} height={220}><Pie data={[{ name: 'Medical', value: 28 }, { name: 'E-commerce', value: 22 }, { name: 'Food', value: 18 }, { name: 'Survey', value: 14 }, { name: 'Emergency', value: 10 }, { name: 'Others', value: 8 }]} cx='50%' cy='50%' outerRadius={80} innerRadius={40} dataKey='value' paddingAngle={3}>{[<Cell key={0} fill='#10b981' />, <Cell key={1} fill='#06b6d4' />, <Cell key={2} fill='#3b82f6' />, <Cell key={3} fill='#f59e0b' />, <Cell key={4} fill='#ef4444' />, <Cell key={5} fill='#6b7280' />]}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>")
a("            <Card className='drh-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Operator Performance</CardTitle></CardHeader><CardContent><BarChart data={OPERATORS.map((o,i) => ({ name: o.split(' ')[0], flights: [420,380,310,280,250,220,190,160][i], incidents: [2,3,1,4,2,1,3,2][i] }))} width={450} height={220}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='name' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Bar dataKey='flights' fill='#10b981' radius={[4,4,0,0]}/><Bar dataKey='incidents' fill='#ef4444' radius={[4,4,0,0]}/></BarChart></CardContent></Card>")
a("          </div>")
a("        </TabsContent>")
a("")
a("        <TabsContent value='insights' className='drh-tab-content space-y-4 mt-4'>")
a("          {insights.map((ins, i) => (")
a("            <Card key={i} className={'drh-insight-card bg-zinc-900/60 border ' + (ins.severity === 'high' ? 'border-emerald-500/30' : ins.severity === 'medium' ? 'border-amber-500/30' : 'border-zinc-800')}><CardContent className='p-4'><div className='flex items-start gap-3'><div className={'drh-insight-dot w-2 h-2 rounded-full mt-1.5 shrink-0 ' + (ins.severity === 'high' ? 'bg-emerald-500' : ins.severity === 'medium' ? 'bg-amber-500' : 'bg-zinc-500')} /><div><p className='text-sm font-medium text-zinc-200'>{ins.title}</p><p className='text-xs text-zinc-400 mt-1 leading-relaxed'>{ins.desc}</p></div></div></CardContent></Card>")
a("          ))}")
a("        </TabsContent>")
a("      </Tabs>")
a("    </div>")
a("  )")
a("}")
a("")

with open('/home/z/my-project/src/components/modules/drone-delivery-hub-view.tsx', 'w') as f:
    f.write('\n'.join(lines))

print(f"Generated drone-delivery-hub-view.tsx: {len(lines)} lines")
