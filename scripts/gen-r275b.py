#!/usr/bin/env python3
"""Generate Express Delivery Command module (R275b) - pure JS literals"""
import random
random.seed(276)

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
a("const COLORS = ['#0ea5e9', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#f97316']")

ZONES_PY = ['South Mumbai', 'Central Delhi', 'Koramangala BLR', 'HITEC City HYD', 'Park Street KOL', 'T. Nagar CHN', 'Koregaon Park PNE', 'SG Highway AMD']
VEHICLES_PY = ['Bike Courier', 'Electric Scooter', 'Delivery Van', 'Auto Rickshaw', 'Drone Drop', 'Walk-in Agent', 'Cycle Courier', 'EV Three-Wheeler']
SLA_TIERS_PY = ['Same Day (4hr)', 'Same Day (2hr)', 'Next Hour', 'Express 30min', 'Scheduled Window', 'Economy Same Day']
PRIORITIES_PY = ['Critical', 'High', 'Medium', 'Low']

a("")
a("const ZONES = ['South Mumbai', 'Central Delhi', 'Koramangala BLR', 'HITEC City HYD', 'Park Street KOL', 'T. Nagar CHN', 'Koregaon Park PNE', 'SG Highway AMD']")
a("const VEHICLES = ['Bike Courier', 'Electric Scooter', 'Delivery Van', 'Auto Rickshaw', 'Drone Drop', 'Walk-in Agent', 'Cycle Courier', 'EV Three-Wheeler']")
a("const SLA_TIERS = ['Same Day (4hr)', 'Same Day (2hr)', 'Next Hour', 'Express 30min', 'Scheduled Window', 'Economy Same Day']")
a("const PRIORITIES = ['Critical', 'High', 'Medium', 'Low']")

deliveries = []
for i in range(60):
    zone = ZONES_PY[i % 8]
    vehicle = VEHICLES_PY[i % 8]
    sla = SLA_TIERS_PY[i % 6]
    priority = PRIORITIES_PY[i % 4]
    on_time = round(random.uniform(60, 99), 1)
    transit_min = random.randint(8, 95)
    cost = round(random.uniform(25, 350), 1)
    deliveries.append({
        'id': 'EDC-%04d' % (i+1),
        'zone': zone,
        'vehicle': vehicle,
        'slaTier': sla,
        'priority': priority,
        'on_time_pct': on_time,
        'transit_min': transit_min,
        'cost_inr': cost,
        'parcels_hr': random.randint(20, 180),
        'distance_km': round(random.uniform(1.5, 18), 1),
        'lastDispatch': '2026-07-%02d %02d:%02d' % (random.randint(1,30), random.randint(0,23), random.randint(0,59)),
    })

a("")
a("const deliveries = [")
for d in deliveries:
    a("  { id: '%s', zone: '%s', vehicle: '%s', slaTier: '%s', priority: '%s', on_time_pct: %s, transit_min: %d, cost_inr: %s, parcels_hr: %d, distance_km: %s, lastDispatch: '%s' }," % (d['id'], d['zone'], d['vehicle'], d['slaTier'], d['priority'], d['on_time_pct'], d['transit_min'], d['cost_inr'], d['parcels_hr'], d['distance_km'], d['lastDispatch']))
a("]")

a("")
a("const peakData = [")
for i in range(24):
    a("  { hour: '%02d:00', dispatched: %d, delivered: %d, avgTime: %s }," % (i, random.randint(40, 320), random.randint(30, 280), str(round(random.uniform(12, 45), 1))))
a("]")

a("")
a("const vehicleDist = [")
for v in VEHICLES_PY:
    a("  { name: '%s', value: %d }," % (v, random.randint(40, 250)))
a("]")

a("")
a("const filterGroups = [")
a("  { key: 'zone', label: 'Zone', options: ZONES.map(z => ({ value: z, label: z, count: 0 })) },")
a("  { key: 'vehicle', label: 'Vehicle', options: VEHICLES.map(v => ({ value: v, label: v, count: 0 })) },")
a("  { key: 'slaTier', label: 'SLA Tier', options: SLA_TIERS.map(s => ({ value: s, label: s, count: 0 })) },")
a("]")

# Badges
a("")
a("function ZoneBadge({ zone }: { zone: string }) {")
a("  const color = zone.includes('Mumbai') ? 'bg-sky-500/15 text-sky-400' : zone.includes('Delhi') ? 'bg-blue-500/15 text-blue-400' : zone.includes('BLR') ? 'bg-cyan-500/15 text-cyan-400' : zone.includes('HYD') ? 'bg-indigo-500/15 text-indigo-400' : zone.includes('KOL') ? 'bg-emerald-500/15 text-emerald-400' : zone.includes('CHN') ? 'bg-amber-500/15 text-amber-400' : zone.includes('PNE') ? 'bg-pink-500/15 text-pink-400' : 'bg-orange-500/15 text-orange-400'")
a("  return <span className={'edc-zone-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{zone}</span>")
a("}")
a("")
a("function VehicleBadge({ vehicle }: { vehicle: string }) {")
a("  const color = vehicle === 'Bike Courier' ? 'bg-sky-500/15 text-sky-400' : vehicle === 'Electric Scooter' ? 'bg-emerald-500/15 text-emerald-400' : vehicle === 'Delivery Van' ? 'bg-blue-500/15 text-blue-400' : vehicle === 'Auto Rickshaw' ? 'bg-amber-500/15 text-amber-400' : vehicle === 'Drone Drop' ? 'bg-violet-500/15 text-violet-400' : vehicle === 'Walk-in Agent' ? 'bg-pink-500/15 text-pink-400' : vehicle === 'Cycle Courier' ? 'bg-lime-500/15 text-lime-400' : 'bg-orange-500/15 text-orange-400'")
a("  return <span className={'edc-vehicle-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{vehicle}</span>")
a("}")
a("")
a("function PriorityBadge({ priority }: { priority: string }) {")
a("  const color = priority === 'Critical' ? 'bg-red-500/15 text-red-400' : priority === 'High' ? 'bg-orange-500/15 text-orange-400' : priority === 'Medium' ? 'bg-amber-500/15 text-amber-400' : 'bg-blue-500/15 text-blue-400'")
a("  return <span className={'edc-priority-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{priority}</span>")
a("}")
a("")
a("function OnTimeBar({ value }: { value: number }) {")
a("  const w = value")
a("  const color = value >= 90 ? 'bg-emerald-500' : value >= 75 ? 'bg-amber-500' : 'bg-red-500'")
a("  return <div className='edc-ontime-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className={'h-full rounded-full edc-ontime-fill ' + color} style={{ width: w + '%', animation: 'edc-grow 1s ease-out' }}/></div>")
a("}")
a("")
a("function CostBar({ value }: { value: number }) {")
a("  const w = Math.min(value / 3.5, 100)")
a("  return <div className='edc-cost-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className='h-full rounded-full bg-sky-500 edc-cost-fill' style={{ width: w + '%', animation: 'edc-grow 1s ease-out' }}/></div>")
a("}")
a("")
a("function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {")
a("  const r = 28, c = 2 * Math.PI * r, offset = c - (value / 100) * c")
a("  return <div className='edc-ring flex flex-col items-center'><svg width='70' height='70' className='-rotate-90'><circle cx='35' cy='35' r={r} fill='none' stroke='#27272a' strokeWidth='5'/><circle cx='35' cy='35' r={r} fill='none' stroke={color} strokeWidth='5' strokeDasharray={c} strokeDashoffset={offset} strokeLinecap='round' className='edc-ring-path' style={{ transition: 'stroke-dashoffset 1s ease' }}/></svg><span className='edc-ring-val text-sm font-bold mt-1' style={{ color }}>{value}%</span><span className='edc-ring-label text-[10px] text-zinc-500'>{label}</span></div>")
a("}")
a("")
a("function KpiTile({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {")
a("  return <div className='edc-kpi bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 edc-kpi-card'><p className='text-xs text-zinc-500 mb-1'>{label}</p><p className={'text-xl font-bold ' + color}>{value}</p><p className='text-[10px] text-zinc-400 mt-1'>{sub}</p></div>")
a("}")
a("")
a("function ValueTile({ label, value, change }: { label: string; value: string; change: string }) {")
a("  const up = change.startswith('+')")
a("  return <div className='edc-value-tile bg-zinc-900/60 border border-zinc-800 rounded-lg p-3'><p className='text-xs text-zinc-500'>{label}</p><p className='text-lg font-bold text-white mt-1'>{value}</p><p className={'text-xs mt-1 ' + (up ? 'text-emerald-400' : 'text-red-400')}>{change}</p></div>")
a("}")

a("")
a("const insights = [")
a("  { title: 'Mumbai 30-Min Express Surge', desc: 'Express 30min deliveries in South Mumbai surged 340% during Ganesh Chaturthi pre-orders. 12 riders deployed from overflow pool. Average delivery time held at 24 minutes. Recommend pre-positioning 50 high-value SKUs at 5 micro-hubs across SoBo for festival season.', severity: 'high' },")
a("  { title: 'Bangalore EV Fleet Expansion', desc: 'Electric Scooter fleet expanded to 85 vehicles in Koramangala zone, covering 92% of same-day deliveries. Carbon footprint reduced 40% vs petrol bikes. Rider satisfaction improved from 3.8 to 4.4 stars. Charging infra: 12 swap stations operational.', severity: 'medium' },")
a("  { title: 'Hyderabad Drone Drop Pilot Success', desc: 'Drone delivery pilot in HITEC City completed 847 deliveries with 99.2% success rate. Average delivery time: 8 minutes for 2km radius. Regulatory approval received for 3 additional zones. Scale-up plan: 50 drones by Q4 2026.', severity: 'high' },")
a("  { title: 'Dynamic Route Optimization v2', desc: 'Real-time route optimization engine now processes 15,000 deliveries/hour. Average transit time reduced 18% through traffic-aware routing. Integration with Google Maps real-time traffic and Ola/Uber API for rider assignment. Cost savings: INR 2.8L/day across all zones.', severity: 'low' },")
a("]")

a("")
a("export default function ExpressDeliveryCommandView() {")
a("  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})")
a("  const [searchQuery, setSearchQuery] = useState('')")
a("  const [tab, setTab] = useState('dashboard')")

a("")
a("  const toggleFilter = (key: string, val: string) => {")
a("    setActiveFilters(prev => { const cur = prev[key] || []; const next = cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val]; return { ...prev, [key]: next } })")
a("  }")

a("")
a("  const filtered = deliveries.filter(d => {")
a("    for (const [key, vals] of Object.entries(activeFilters)) { if (vals.length > 0 && !vals.includes(d[key as keyof typeof d] as string)) return false }")
a("    if (searchQuery && !Object.values(d).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))) return false")
a("    return true")
a("  })")

a("")
a("  return (")
a("    <div className='edc-root space-y-4 p-4'>")
a("      <PageHeader title='Express Delivery Command' description='Same-day & instant delivery fleet management & SLA optimization' />")

a("      <Tabs value={tab} onValueChange={setTab}>")
a("        <TabsList className='edc-tabs-list bg-zinc-900 border border-zinc-800'>")
a("          <TabsTrigger value='dashboard' className='edc-tab'>Dashboard</TabsTrigger>")
a("          <TabsTrigger value='deliveries' className='edc-tab'>Deliveries</TabsTrigger>")
a("          <TabsTrigger value='analytics' className='edc-tab'>Analytics</TabsTrigger>")
a("          <TabsTrigger value='insights' className='edc-tab'>Insights</TabsTrigger>")
a("        </TabsList>")

a("        <TabsContent value='dashboard' className='edc-tab-content space-y-4 mt-4'>")
a("          <div className='edc-kpi-row grid grid-cols-2 lg:grid-cols-4 gap-3'>")
a("            <KpiTile label='Active Deliveries' value='3,291' sub='+420 in last hour' color='text-sky-400' />")
a("            <KpiTile label='On-Time Rate' value='94.6%' sub='+1.8pp vs yesterday' color='text-blue-400' />")
a("            <KpiTile label='Avg Transit' value='22 min' sub='-3 min optimized' color='text-emerald-400' />")
a("            <KpiTile label='Fleet Utilization' value='87%' sub='+4% peak hours' color='text-amber-400' />")
a("          </div>")
a("          <div className='edc-ring-row flex flex-wrap justify-around gap-2'>")
a("            <HealthRing value={95} label='SLA Met' color='#0ea5e9' />")
a("            <HealthRing value={88} label='Fleet Ready' color='#3b82f6' />")
a("            <HealthRing value={92} label='Customer Sat' color='#06b6d4' />")
a("            <HealthRing value={79} label='Route Opt.' color='#10b981' />")
a("            <HealthRing value={85} label='EV Share' color='#f59e0b' />")
a("            <HealthRing value={96} label='Safety' color='#ec4899' />")
a("          </div>")
a("          <div className='edc-chart-row grid grid-cols-1 lg:grid-cols-3 gap-4'>")
a("            <Card className='edc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Peak Hour Dispatch</CardTitle></CardHeader><CardContent><LineChart data={peakData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='hour' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Line type='monotone' dataKey='dispatched' stroke='#0ea5e9' strokeWidth={2} dot={false}/><Line type='monotone' dataKey='delivered' stroke='#3b82f6' strokeWidth={2} dot={false}/></LineChart></CardContent></Card>")
a("            <Card className='edc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Avg Delivery Time</CardTitle></CardHeader><CardContent><BarChart data={peakData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='hour' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Bar dataKey='avgTime' fill='#06b6d4' radius={[4,4,0,0]}/></BarChart></CardContent></Card>")
a("            <Card className='edc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Vehicle Mix</CardTitle></CardHeader><CardContent><PieChart width={350} height={200}><Pie data={vehicleDist} cx='50%' cy='50%' outerRadius={70} innerRadius={35} dataKey='value' paddingAngle={2}>{vehicleDist.map((_, i) => <Cell key={i} fill={COLORS[i % 8]} />)}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>")
a("          </div>")
a("        </TabsContent>")

a("        <TabsContent value='deliveries' className='edc-tab-content space-y-4 mt-4'>")
a("          <ModuleBreadcrumb items={[{ label: 'Express Command' }, { label: 'Deliveries' }]} />")
a("          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => { setActiveFilters({}); setSearchQuery('') }} totalItems={deliveries.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder='Search deliveries by ID, zone, vehicle, SLA tier...' />")
a("          <Card className='edc-table-card bg-zinc-900/60 border-zinc-800'><CardContent className='p-0'><div className='edc-table-wrap overflow-x-auto max-h-[400px] overflow-y-auto'><table className='edc-table w-full text-sm'><thead><tr className='border-b border-zinc-800'><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>ID</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Zone</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Vehicle</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Priority</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>On-Time</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Cost</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Transit</th><th className='text-right px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Parcels/hr</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>SLA Tier</th></tr></thead><tbody>")
a("          {filtered.map(d => (")
a("            <tr key={d.id} className='edc-table-row border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors'>")
a("              <td className='px-3 py-2 font-mono text-xs text-sky-400'>{d.id}</td>")
a("              <td className='px-3 py-2'><ZoneBadge zone={d.zone} /></td>")
a("              <td className='px-3 py-2'><VehicleBadge vehicle={d.vehicle} /></td>")
a("              <td className='px-3 py-2'><PriorityBadge priority={d.priority} /></td>")
a("              <td className='px-3 py-2 w-24'><OnTimeBar value={d.on_time_pct} /><span className='text-[10px] text-zinc-500 ml-1'>{d.on_time_pct}%</span></td>")
a("              <td className='px-3 py-2 w-24'><CostBar value={d.cost_inr} /><span className='text-[10px] text-zinc-500 ml-1'>INR {d.cost_inr}</span></td>")
a("              <td className='px-3 py-2 text-xs text-zinc-400'>{d.transit_min}m</td>")
a("              <td className='px-3 py-2 text-right text-xs'>{d.parcels_hr}</td>")
a("              <td className='px-3 py-2 text-xs text-zinc-300'>{d.slaTier}</td>")
a("            </tr>")
a("          ))})")
a("          </tbody></table></div></CardContent></Card>")
a("        </TabsContent>")

a("        <TabsContent value='analytics' className='edc-tab-content space-y-4 mt-4'>")
a("          <div className='edc-value-row grid grid-cols-2 lg:grid-cols-4 gap-3'>")
a("            <ValueTile label='Total Parcels Today' value='24,580' change='+15% WoW' />")
a("            <ValueTile label='Revenue Today' value='INR 18.4L' change='+INR 2.1L' />")
a("            <ValueTile label='Avg Cost/Parcel' value='INR 42' change='-INR 5 optimized' />")
a("            <ValueTile label='Fleet Size' value='342' change='+28 new EVs' />")
a("          </div>")
a("          <div className='edc-analytics-charts grid grid-cols-1 lg:grid-cols-2 gap-4'>")
a("            <Card className='edc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Zone Performance</CardTitle></CardHeader><CardContent><BarChart data={ZONES.map((z,i) => ({ name: z.split(' ')[0], onTime: [95,92,96,89,93,91,94,90][i], parcels: [320,280,350,240,210,260,190,300][i] }))} width={450} height={220}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='name' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Bar dataKey='onTime' fill='#0ea5e9' radius={[4,4,0,0]}/><Bar dataKey='parcels' fill='#3b82f6' radius={[4,4,0,0]}/></BarChart></CardContent></Card>")
a("            <Card className='edc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>SLA Tier Distribution</CardTitle></CardHeader><CardContent><PieChart width={450} height={220}><Pie data={[{ name: 'Same Day 4hr', value: 32 }, { name: 'Same Day 2hr', value: 24 }, { name: 'Next Hour', value: 18 }, { name: 'Express 30min', value: 14 }, { name: 'Scheduled', value: 8 }, { name: 'Economy', value: 4 }]} cx='50%' cy='50%' outerRadius={80} innerRadius={40} dataKey='value' paddingAngle={3}>{[<Cell key={0} fill='#0ea5e9' />, <Cell key={1} fill='#3b82f6' />, <Cell key={2} fill='#06b6d4' />, <Cell key={3} fill='#10b981' />, <Cell key={4} fill='#f59e0b' />, <Cell key={5} fill='#ec4899' />]}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>")
a("          </div>")
a("        </TabsContent>")

a("        <TabsContent value='insights' className='edc-tab-content space-y-4 mt-4'>")
a("          {insights.map((ins, i) => (")
a("            <Card key={i} className={'edc-insight-card bg-zinc-900/60 border ' + (ins.severity === 'high' ? 'border-sky-500/30' : ins.severity === 'medium' ? 'border-blue-500/30' : 'border-zinc-800')}><CardContent className='p-4'><div className='flex items-start gap-3'><div className={'edc-insight-dot w-2 h-2 rounded-full mt-1.5 shrink-0 ' + (ins.severity === 'high' ? 'bg-sky-500' : ins.severity === 'medium' ? 'bg-blue-500' : 'bg-zinc-500')} /><div><p className='text-sm font-medium text-zinc-200'>{ins.title}</p><p className='text-xs text-zinc-400 mt-1 leading-relaxed'>{ins.desc}</p></div></div></CardContent></Card>")
a("          ))})")
a("        </TabsContent>")
a("      </Tabs>")
a("    </div>")
a("  )")
a("}")
a("")

with open('/home/z/my-project/src/components/modules/express-delivery-command-view.tsx', 'w') as f:
    f.write('\n'.join(lines))
print(f"Generated express-delivery-command-view.tsx: {len(lines)} lines")
