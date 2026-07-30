#!/usr/bin/env python3
"""Generate Dark Store Operations module (R274a) - pure JS literals"""
import random
random.seed(274)

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
a("const COLORS = ['#ec4899', '#a855f7', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#f97316']")

ZONES_PY = ['Gurgaon Sector 29', 'BKC Mumbai', 'Koramangala BLR', 'Hitech City HYD', 'Salt Lake KOL', 'Anna Nagar CHN', 'Baner Pune', 'SG Highway AMD']
CATEGORIES_PY = ['Grocery Fresh', 'FMCG Staples', 'Dairy & Chilled', 'Beverages', 'Snacks & Confectionery', 'Personal Care', 'Pharmacy OTC', 'Pet Supplies']
STATUSES_PY = ['Active', 'Low Stock', 'Replenishing', 'Closed', 'Maintenance', 'Restricted']
PRIORITIES_PY = ['Critical', 'High', 'Medium', 'Low']

a("")
a("const ZONES = ['Gurgaon Sector 29', 'BKC Mumbai', 'Koramangala BLR', 'Hitech City HYD', 'Salt Lake KOL', 'Anna Nagar CHN', 'Baner Pune', 'SG Highway AMD']")
a("const CATEGORIES = ['Grocery Fresh', 'FMCG Staples', 'Dairy & Chilled', 'Beverages', 'Snacks & Confectionery', 'Personal Care', 'Pharmacy OTC', 'Pet Supplies']")
a("const STATUSES = ['Active', 'Low Stock', 'Replenishing', 'Closed', 'Maintenance', 'Restricted']")
a("const PRIORITIES = ['Critical', 'High', 'Medium', 'Low']")

stores = []
for i in range(60):
    zone = ZONES_PY[i % 8]
    cat = CATEGORIES_PY[i % 8]
    status = STATUSES_PY[i % 6]
    priority = PRIORITIES_PY[i % 4]
    fill_rate = round(random.uniform(55, 99), 1)
    delivery_min = random.randint(8, 30)
    orders_hr = random.randint(45, 320)
    spoilage = round(random.uniform(0.1, 4.8), 1)
    stores.append({
        'id': 'DSO-%04d' % (i+1),
        'zone': zone,
        'category': cat,
        'status': status,
        'priority': priority,
        'fill_rate': fill_rate,
        'delivery_min': delivery_min,
        'orders_hr': orders_hr,
        'spoilage': spoilage,
        'sku_count': random.randint(800, 5500),
        'sqr_ft': random.choice([1500, 2000, 2500, 3000, 3500, 4000]),
        'lastRestock': '2026-07-%02d %02d:%02d' % (random.randint(1,30), random.randint(0,23), random.randint(0,59)),
    })

a("")
a("const stores = [")
for s in stores:
    a("  { id: '%s', zone: '%s', category: '%s', status: '%s', priority: '%s', fill_rate: %s, delivery_min: %d, orders_hr: %d, spoilage: %s, sku_count: %d, sqr_ft: %d, lastRestock: '%s' }," % (s['id'], s['zone'], s['category'], s['status'], s['priority'], s['fill_rate'], s['delivery_min'], s['orders_hr'], s['spoilage'], s['sku_count'], s['sqr_ft'], s['lastRestock']))
a("]")

a("")
a("const hourlyData = [")
for i in range(24):
    a("  { hour: '%02d:00', orders: %d, deliveries: %d, avgTime: %s }," % (i, random.randint(20, 280), random.randint(15, 220), str(round(random.uniform(10, 28), 1))))
a("]")

a("")
a("const catDist = [")
for c in CATEGORIES_PY:
    a("  { name: '%s', value: %d }," % (c, random.randint(80, 350)))
a("]")

a("")
a("const filterGroups = [")
a("  { key: 'zone', label: 'Zone', options: ZONES.map(z => ({ value: z, label: z, count: 0 })) },")
a("  { key: 'category', label: 'Category', options: CATEGORIES.map(c => ({ value: c, label: c, count: 0 })) },")
a("  { key: 'status', label: 'Status', options: STATUSES.map(s => ({ value: s, label: s, count: 0 })) },")
a("]")

# Badges
a("")
a("function ZoneBadge({ zone }: { zone: string }) {")
a("  const color = zone.includes('Gurgaon') ? 'bg-pink-500/15 text-pink-400' : zone.includes('BKC') ? 'bg-purple-500/15 text-purple-400' : zone.includes('Koramangala') ? 'bg-rose-500/15 text-rose-400' : zone.includes('Hitech') ? 'bg-violet-500/15 text-violet-400' : zone.includes('Salt Lake') ? 'bg-amber-500/15 text-amber-400' : zone.includes('Anna Nagar') ? 'bg-emerald-500/15 text-emerald-400' : zone.includes('Baner') ? 'bg-cyan-500/15 text-cyan-400' : 'bg-indigo-500/15 text-indigo-400'")
a("  return <span className={'dso-zone-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{zone}</span>")
a("}")
a("")
a("function StatusBadge({ status }: { status: string }) {")
a("  const color = status === 'Active' ? 'bg-emerald-500/15 text-emerald-400' : status === 'Low Stock' ? 'bg-red-500/15 text-red-400' : status === 'Replenishing' ? 'bg-amber-500/15 text-amber-400' : status === 'Closed' ? 'bg-zinc-500/15 text-zinc-400' : status === 'Maintenance' ? 'bg-orange-500/15 text-orange-400' : 'bg-blue-500/15 text-blue-400'")
a("  return <span className={'dso-status-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{status}</span>")
a("}")
a("")
a("function PriorityBadge({ priority }: { priority: string }) {")
a("  const color = priority === 'Critical' ? 'bg-red-500/15 text-red-400' : priority === 'High' ? 'bg-orange-500/15 text-orange-400' : priority === 'Medium' ? 'bg-amber-500/15 text-amber-400' : 'bg-blue-500/15 text-blue-400'")
a("  return <span className={'dso-priority-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{priority}</span>")
a("}")
a("")
a("function FillBar({ value }: { value: number }) {")
a("  const w = value")
a("  const color = value >= 90 ? 'bg-emerald-500' : value >= 75 ? 'bg-amber-500' : 'bg-red-500'")
a("  return <div className='dso-fill-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className={'h-full rounded-full dso-fill-fill ' + color} style={{ width: w + '%', animation: 'dso-grow 1s ease-out' }}/></div>")
a("}")
a("")
a("function DeliveryBar({ value }: { value: number }) {")
a("  const w = Math.max(100 - value * 2.5, 5)")
a("  return <div className='dso-del-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className='h-full rounded-full bg-pink-500 dso-del-fill' style={{ width: w + '%', animation: 'dso-grow 1s ease-out' }}/></div>")
a("}")
a("")
a("function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {")
a("  const r = 28, c = 2 * Math.PI * r, offset = c - (value / 100) * c")
a("  return <div className='dso-ring flex flex-col items-center'><svg width='70' height='70' className='-rotate-90'><circle cx='35' cy='35' r={r} fill='none' stroke='#27272a' strokeWidth='5'/><circle cx='35' cy='35' r={r} fill='none' stroke={color} strokeWidth='5' strokeDasharray={c} strokeDashoffset={offset} strokeLinecap='round' className='dso-ring-path' style={{ transition: 'stroke-dashoffset 1s ease' }}/></svg><span className='dso-ring-val text-sm font-bold mt-1' style={{ color }}>{value}%</span><span className='dso-ring-label text-[10px] text-zinc-500'>{label}</span></div>")
a("}")
a("")
a("function KpiTile({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {")
a("  return <div className='dso-kpi bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 dso-kpi-card'><p className='text-xs text-zinc-500 mb-1'>{label}</p><p className={'text-xl font-bold ' + color}>{value}</p><p className='text-[10px] text-zinc-400 mt-1'>{sub}</p></div>")
a("}")
a("")
a("function ValueTile({ label, value, change }: { label: string; value: string; change: string }) {")
a("  const up = change.startsWith('+')")
a("  return <div className='dso-value-tile bg-zinc-900/60 border border-zinc-800 rounded-lg p-3'><p className='text-xs text-zinc-500'>{label}</p><p className='text-lg font-bold text-white mt-1'>{value}</p><p className={'text-xs mt-1 ' + (up ? 'text-emerald-400' : 'text-red-400')}>{change}</p></div>")
a("}")

a("")
a("const insights = [")
a("  { title: 'BKC Mumbai Peak Hour Bottleneck', desc: 'BKC dark store handling 312 orders/hr during 7-9 PM rush, exceeding optimal throughput by 40%. Recommend adding 2 micro-pick stations and implementing queue-busting pick paths to reduce SLA breaches from 8.2% to under 2%.', severity: 'high' },")
a("  { title: 'Koramangala Spoilage Alert', desc: 'Dairy & Chilled category spoilage rate at Koramangala hit 4.8% this week, 3x the network average. Cold chain audit reveals door seal gaps in Zone B. Immediate maintenance scheduled and backup chiller units deployed.', severity: 'high' },")
a("  { title: 'AI Slot Optimization Rollout', desc: 'ML-based delivery slot optimizer deployed across 6 zones. Average delivery time reduced from 22 min to 16 min. Customer satisfaction score improved from 4.1 to 4.6 stars. Full rollout to all 8 zones planned for next week.', severity: 'medium' },")
a("  { title: 'Gurgaon Grocery Fresh Expansion', desc: 'New 4000 sq ft dark store in Sector 49 approved. Expected to serve 15,000 customers in 15-min delivery radius. SKU expansion plan includes 1,200 organic and premium fresh items targeted at affluent demographic.', severity: 'low' },")
a("]")

a("")
a("export default function DarkStoreOperationsView() {")
a("  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})")
a("  const [searchQuery, setSearchQuery] = useState('')")
a("  const [tab, setTab] = useState('dashboard')")

a("")
a("  const toggleFilter = (key: string, val: string) => {")
a("    setActiveFilters(prev => { const cur = prev[key] || []; const next = cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val]; return { ...prev, [key]: next } })")
a("  }")

a("")
a("  const filtered = stores.filter(s => {")
a("    for (const [key, vals] of Object.entries(activeFilters)) { if (vals.length > 0 && !vals.includes(s[key as keyof typeof s] as string)) return false }")
a("    if (searchQuery && !Object.values(s).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))) return false")
a("    return true")
a("  })")

a("")
a("  return (")
a("    <div className='dso-root space-y-4 p-4'>")
a("      <PageHeader title='Dark Store Operations' description='Q-commerce micro-fulfillment & quick delivery management' />")

a("      <Tabs value={tab} onValueChange={setTab}>")
a("        <TabsList className='dso-tabs-list bg-zinc-900 border border-zinc-800'>")
a("          <TabsTrigger value='dashboard' className='dso-tab'>Dashboard</TabsTrigger>")
a("          <TabsTrigger value='stores' className='dso-tab'>Stores</TabsTrigger>")
a("          <TabsTrigger value='analytics' className='dso-tab'>Analytics</TabsTrigger>")
a("          <TabsTrigger value='insights' className='dso-tab'>Insights</TabsTrigger>")
a("        </TabsList>")

a("        <TabsContent value='dashboard' className='dso-tab-content space-y-4 mt-4'>")
a("          <div className='dso-kpi-row grid grid-cols-2 lg:grid-cols-4 gap-3'>")
a("            <KpiTile label='Active Dark Stores' value='8' sub='2 launching next week' color='text-pink-400' />")
a("            <KpiTile label='Orders Today' value='14,832' sub='+22% vs yesterday' color='text-purple-400' />")
a("            <KpiTile label='Avg Delivery Time' value='16 min' sub='-3 min improvement' color='text-emerald-400' />")
a("            <KpiTile label='Fill Rate' value='94.2%' sub='+1.8pp this week' color='text-amber-400' />")
a("          </div>")
a("          <div className='dso-ring-row flex flex-wrap justify-around gap-2'>")
a("            <HealthRing value={94} label='Fill Rate' color='#ec4899' />")
a("            <HealthRing value={88} label='On-Time' color='#a855f7' />")
a("            <HealthRing value={76} label='Fresh Quality' color='#f43f5e' />")
a("            <HealthRing value={92} label='Inventory Acc.' color='#f59e0b' />")
a("            <HealthRing value={85} label='Picker Eff.' color='#10b981' />")
a("            <HealthRing value={79} label='Customer Sat.' color='#06b6d4' />")
a("          </div>")
a("          <div className='dso-chart-row grid grid-cols-1 lg:grid-cols-3 gap-4'>")
a("            <Card className='dso-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Hourly Order Volume</CardTitle></CardHeader><CardContent><LineChart data={hourlyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='hour' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Line type='monotone' dataKey='orders' stroke='#ec4899' strokeWidth={2} dot={false}/><Line type='monotone' dataKey='deliveries' stroke='#a855f7' strokeWidth={2} dot={false}/></LineChart></CardContent></Card>")
a("            <Card className='dso-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Avg Delivery Time</CardTitle></CardHeader><CardContent><BarChart data={hourlyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='hour' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Bar dataKey='avgTime' fill='#f43f5e' radius={[4,4,0,0]}/></BarChart></CardContent></Card>")
a("            <Card className='dso-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Category Distribution</CardTitle></CardHeader><CardContent><PieChart width={350} height={200}><Pie data={catDist} cx='50%' cy='50%' outerRadius={70} innerRadius={35} dataKey='value' paddingAngle={2}>{catDist.map((_, i) => <Cell key={i} fill={COLORS[i % 8]} />)}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>")
a("          </div>")
a("        </TabsContent>")

a("        <TabsContent value='stores' className='dso-tab-content space-y-4 mt-4'>")
a("          <ModuleBreadcrumb items={[{ label: 'Dark Store Ops' }, { label: 'Stores' }]} />")
a("          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => { setActiveFilters({}); setSearchQuery('') }} totalItems={stores.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder='Search stores by ID, zone, category...' />")
a("          <Card className='dso-table-card bg-zinc-900/60 border-zinc-800'><CardContent className='p-0'><div className='dso-table-wrap overflow-x-auto max-h-[400px] overflow-y-auto'><table className='dso-table w-full text-sm'><thead><tr className='border-b border-zinc-800'><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>ID</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Zone</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Category</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Priority</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Fill Rate</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Delivery</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Orders/hr</th><th className='text-right px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>SKUs</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Status</th></tr></thead><tbody>")
a("          {filtered.map(s => (")
a("            <tr key={s.id} className='dso-table-row border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors'>")
a("              <td className='px-3 py-2 font-mono text-xs text-pink-400'>{s.id}</td>")
a("              <td className='px-3 py-2'><ZoneBadge zone={s.zone} /></td>")
a("              <td className='px-3 py-2 text-xs text-zinc-300'>{s.category}</td>")
a("              <td className='px-3 py-2'><PriorityBadge priority={s.priority} /></td>")
a("              <td className='px-3 py-2 w-24'><FillBar value={s.fill_rate} /><span className='text-[10px] text-zinc-500 ml-1'>{s.fill_rate}%</span></td>")
a("              <td className='px-3 py-2 w-24'><DeliveryBar value={s.delivery_min} /><span className='text-[10px] text-zinc-500 ml-1'>{s.delivery_min}m</span></td>")
a("              <td className='px-3 py-2 text-xs text-zinc-400'>{s.orders_hr}/hr</td>")
a("              <td className='px-3 py-2 text-right text-xs'>{s.sku_count}</td>")
a("              <td className='px-3 py-2'><StatusBadge status={s.status} /></td>")
a("            </tr>")
a("          ))})")
a("          </tbody></table></div></CardContent></Card>")
a("        </TabsContent>")

a("        <TabsContent value='analytics' className='dso-tab-content space-y-4 mt-4'>")
a("          <div className='dso-value-row grid grid-cols-2 lg:grid-cols-4 gap-3'>")
a("            <ValueTile label='Revenue Today' value='INR 42.8L' change='+18% WoW' />")
a("            <ValueTile label='Avg Basket Value' value='INR 487' change='+INR 32' />")
a("            <ValueTile label='Spoilage Rate' value='1.8%' change='-0.4pp' />")
a("            <ValueTile label='Delivery Radius' value='3.2 km' change='+0.5 km' />")
a("          </div>")
a("          <div className='dso-analytics-charts grid grid-cols-1 lg:grid-cols-2 gap-4'>")
a("            <Card className='dso-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Zone Performance</CardTitle></CardHeader><CardContent><BarChart data={ZONES.map((z,i) => ({ name: z.split(' ')[0], fillRate: [94,89,91,87,93,90,88,92][i], onTime: [91,86,93,82,88,85,90,87][i] }))} width={450} height={220}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='name' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Bar dataKey='fillRate' fill='#ec4899' radius={[4,4,0,0]}/><Bar dataKey='onTime' fill='#a855f7' radius={[4,4,0,0]}/></BarChart></CardContent></Card>")
a("            <Card className='dso-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Status Mix</CardTitle></CardHeader><CardContent><PieChart width={450} height={220}><Pie data={[{ name: 'Active', value: 42 }, { name: 'Low Stock', value: 8 }, { name: 'Replenishing', value: 5 }, { name: 'Maintenance', value: 3 }, { name: 'Closed', value: 2 }]} cx='50%' cy='50%' outerRadius={80} innerRadius={40} dataKey='value' paddingAngle={3}>{[<Cell key={0} fill='#10b981' />, <Cell key={1} fill='#ef4444' />, <Cell key={2} fill='#f59e0b' />, <Cell key={3} fill='#f97316' />, <Cell key={4} fill='#71717a' />]}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>")
a("          </div>")
a("        </TabsContent>")

a("        <TabsContent value='insights' className='dso-tab-content space-y-4 mt-4'>")
a("          {insights.map((ins, i) => (")
a("            <Card key={i} className={'dso-insight-card bg-zinc-900/60 border ' + (ins.severity === 'high' ? 'border-pink-500/30' : ins.severity === 'medium' ? 'border-purple-500/30' : 'border-zinc-800')}><CardContent className='p-4'><div className='flex items-start gap-3'><div className={'dso-insight-dot w-2 h-2 rounded-full mt-1.5 shrink-0 ' + (ins.severity === 'high' ? 'bg-pink-500' : ins.severity === 'medium' ? 'bg-purple-500' : 'bg-zinc-500')} /><div><p className='text-sm font-medium text-zinc-200'>{ins.title}</p><p className='text-xs text-zinc-400 mt-1 leading-relaxed'>{ins.desc}</p></div></div></CardContent></Card>")
a("          ))})")
a("        </TabsContent>")
a("      </Tabs>")
a("    </div>")
a("  )")
a("}")
a("")

with open('/home/z/my-project/src/components/modules/dark-store-operations-view.tsx', 'w') as f:
    f.write('\n'.join(lines))
print(f"Generated dark-store-operations-view.tsx: {len(lines)} lines")
