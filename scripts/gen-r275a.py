#!/usr/bin/env python3
"""Generate Perishable Goods Command module (R275a) - pure JS literals"""
import random
random.seed(275)

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
a("const COLORS = ['#f97316', '#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#ec4899', '#84cc16']")

COMMODITIES_PY = ['Fresh Fruits', 'Leafy Vegetables', 'Dairy Products', 'Frozen Seafood', 'Fresh Meat', 'Bakery Items', 'Cut Flowers', 'Organic Produce']
HUBS_PY = ['Mumbai Cold Hub', 'Delhi NCR Cold Chain', 'Chennai Seafood Port', 'Bangalore Farm Gate', 'Hyderabad Agri Hub', 'Pune Dairy Center', 'Kolkata Flower Market', 'Ahmedabad Meat Plant']
TEMP_ZONES_PY = ['Ambient (15-25C)', 'Cool (2-8C)', 'Cold (-18 to -25C)', 'Frozen (-30C below)', 'Controlled RT (12-18C)', 'Warm (25-30C)']
PRIORITIES_PY = ['Critical', 'High', 'Medium', 'Low']

a("")
a("const COMMODITIES = ['Fresh Fruits', 'Leafy Vegetables', 'Dairy Products', 'Frozen Seafood', 'Fresh Meat', 'Bakery Items', 'Cut Flowers', 'Organic Produce']")
a("const HUBS = ['Mumbai Cold Hub', 'Delhi NCR Cold Chain', 'Chennai Seafood Port', 'Bangalore Farm Gate', 'Hyderabad Agri Hub', 'Pune Dairy Center', 'Kolkata Flower Market', 'Ahmedabad Meat Plant']")
a("const TEMP_ZONES = ['Ambient (15-25C)', 'Cool (2-8C)', 'Cold (-18 to -25C)', 'Frozen (-30C below)', 'Controlled RT (12-18C)', 'Warm (25-30C)']")
a("const PRIORITIES = ['Critical', 'High', 'Medium', 'Low']")

goods = []
for i in range(60):
    commodity = COMMODITIES_PY[i % 8]
    hub = HUBS_PY[i % 8]
    temp = TEMP_ZONES_PY[i % 6]
    priority = PRIORITIES_PY[i % 4]
    freshness = round(random.uniform(55, 99), 1)
    shelf_days = random.randint(1, 21)
    spoilage = round(random.uniform(0.2, 8.5), 1)
    goods.append({
        'id': 'PGC-%04d' % (i+1),
        'commodity': commodity,
        'hub': hub,
        'tempZone': temp,
        'priority': priority,
        'freshness_pct': freshness,
        'shelf_days': shelf_days,
        'spoilage_pct': spoilage,
        'tonnage': random.randint(50, 2500),
        'temp_actual': round(random.uniform(-35, 30), 1),
        'lastInspected': '2026-07-%02d %02d:%02d' % (random.randint(1,30), random.randint(0,23), random.randint(0,59)),
    })

a("")
a("const goods = [")
for g in goods:
    a("  { id: '%s', commodity: '%s', hub: '%s', tempZone: '%s', priority: '%s', freshness_pct: %s, shelf_days: %d, spoilage_pct: %s, tonnage: %d, temp_actual: %s, lastInspected: '%s' }," % (g['id'], g['commodity'], g['hub'], g['tempZone'], g['priority'], g['freshness_pct'], g['shelf_days'], g['spoilage_pct'], g['tonnage'], g['temp_actual'], g['lastInspected']))
a("]")

a("")
a("const dailyData = [")
for i in range(24):
    a("  { hour: '%02d:00', intake: %d, dispatch: %d, waste: %s }," % (i, random.randint(30, 250), random.randint(20, 200), str(round(random.uniform(0.5, 6.5), 1))))
a("]")

a("")
a("const commodityDist = [")
for c in COMMODITIES_PY:
    a("  { name: '%s', value: %d }," % (c, random.randint(60, 300)))
a("]")

a("")
a("const filterGroups = [")
a("  { key: 'commodity', label: 'Commodity', options: COMMODITIES.map(c => ({ value: c, label: c, count: 0 })) },")
a("  { key: 'tempZone', label: 'Temp Zone', options: TEMP_ZONES.map(t => ({ value: t, label: t, count: 0 })) },")
a("  { key: 'priority', label: 'Priority', options: PRIORITIES.map(p => ({ value: p, label: p, count: 0 })) },")
a("]")

# Badges
a("")
a("function CommodityBadge({ commodity }: { commodity: string }) {")
a("  const color = commodity === 'Fresh Fruits' ? 'bg-orange-500/15 text-orange-400' : commodity === 'Leafy Vegetables' ? 'bg-emerald-500/15 text-emerald-400' : commodity === 'Dairy Products' ? 'bg-sky-500/15 text-sky-400' : commodity === 'Frozen Seafood' ? 'bg-blue-500/15 text-blue-400' : commodity === 'Fresh Meat' ? 'bg-red-500/15 text-red-400' : commodity === 'Bakery Items' ? 'bg-amber-500/15 text-amber-400' : commodity === 'Cut Flowers' ? 'bg-pink-500/15 text-pink-400' : 'bg-lime-500/15 text-lime-400'")
a("  return <span className={'pgc-commodity-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{commodity}</span>")
a("}")
a("")
a("function TempBadge({ temp }: { temp: string }) {")
a("  const color = temp.startsWith('Ambient') ? 'bg-amber-500/15 text-amber-400' : temp.startsWith('Cool') ? 'bg-sky-500/15 text-sky-400' : temp.startswith('Cold') ? 'bg-blue-500/15 text-blue-400' : temp.startswith('Frozen') ? 'bg-cyan-500/15 text-cyan-400' : temp.startswith('Controlled') ? 'bg-emerald-500/15 text-emerald-400' : 'bg-orange-500/15 text-orange-400'")
a("  return <span className={'pgc-temp-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{temp}</span>")
a("}")
a("")
a("function PriorityBadge({ priority }: { priority: string }) {")
a("  const color = priority === 'Critical' ? 'bg-red-500/15 text-red-400' : priority === 'High' ? 'bg-orange-500/15 text-orange-400' : priority === 'Medium' ? 'bg-amber-500/15 text-amber-400' : 'bg-blue-500/15 text-blue-400'")
a("  return <span className={'pgc-priority-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{priority}</span>")
a("}")
a("")
a("function FreshnessBar({ value }: { value: number }) {")
a("  const w = value")
a("  const color = value >= 85 ? 'bg-emerald-500' : value >= 65 ? 'bg-amber-500' : 'bg-red-500'")
a("  return <div className='pgc-fresh-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className={'h-full rounded-full pgc-fresh-fill ' + color} style={{ width: w + '%', animation: 'pgc-grow 1s ease-out' }}/></div>")
a("}")
a("")
a("function SpoilageBar({ value }: { value: number }) {")
a("  const w = Math.min(value * 10, 100)")
a("  return <div className='pgc-spoil-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className='h-full rounded-full bg-orange-500 pgc-spoil-fill' style={{ width: w + '%', animation: 'pgc-grow 1s ease-out' }}/></div>")
a("}")
a("")
a("function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {")
a("  const r = 28, c = 2 * Math.PI * r, offset = c - (value / 100) * c")
a("  return <div className='pgc-ring flex flex-col items-center'><svg width='70' height='70' className='-rotate-90'><circle cx='35' cy='35' r={r} fill='none' stroke='#27272a' strokeWidth='5'/><circle cx='35' cy='35' r={r} fill='none' stroke={color} strokeWidth='5' strokeDasharray={c} strokeDashoffset={offset} strokeLinecap='round' className='pgc-ring-path' style={{ transition: 'stroke-dashoffset 1s ease' }}/></svg><span className='pgc-ring-val text-sm font-bold mt-1' style={{ color }}>{value}%</span><span className='pgc-ring-label text-[10px] text-zinc-500'>{label}</span></div>")
a("}")
a("")
a("function KpiTile({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {")
a("  return <div className='pgc-kpi bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 pgc-kpi-card'><p className='text-xs text-zinc-500 mb-1'>{label}</p><p className={'text-xl font-bold ' + color}>{value}</p><p className='text-[10px] text-zinc-400 mt-1'>{sub}</p></div>")
a("}")
a("")
a("function ValueTile({ label, value, change }: { label: string; value: string; change: string }) {")
a("  const up = change.startswith('+')")
a("  return <div className='pgc-value-tile bg-zinc-900/60 border border-zinc-800 rounded-lg p-3'><p className='text-xs text-zinc-500'>{label}</p><p className='text-lg font-bold text-white mt-1'>{value}</p><p className={'text-xs mt-1 ' + (up ? 'text-emerald-400' : 'text-red-400')}>{change}</p></div>")
a("}")

a("")
a("const insights = [")
a("  { title: 'Mumbai Cold Hub Temperature Excursion', desc: 'Zone B2 recorded 4.2C above target for 47 minutes during compressor maintenance. 2.3 tons of dairy products quarantined for quality assessment. Recommend installing redundant compressor and automated alert threshold at +2C deviation.', severity: 'high' },")
a("  { title: 'Chennai Seafood Port FIFO Compliance', desc: 'AI vision inspection system deployed at dock 3 achieved 98% FIFO compliance for frozen seafood. Shrimp exports quality grade improved from A- to A+. Integration with Customs EDI reduced clearance time by 3 hours per container.', severity: 'medium' },")
a("  { title: 'Kolkata Flower Market Cold Chain Innovation', desc: 'New vacuum pre-cooling system for cut flowers reduced wilting rate from 12% to 3.5%. Average vase life extended from 5 to 9 days. Revenue per stem increased 22% due to premium quality grading. Expand to Pune and Bangalore.', severity: 'low' },")
a("  { title: 'Predictive Spoilage Model v2 Launch', desc: 'Enhanced spoilage prediction model using IoT sensor data + weather forecasts + traffic patterns. Accuracy improved from 78% to 91%. Reduces waste by estimating remaining shelf life in real-time and auto-prioritizing dispatch for near-expiry items.', severity: 'high' },")
a("]")

a("")
a("export default function PerishableGoodsCommandView() {")
a("  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})")
a("  const [searchQuery, setSearchQuery] = useState('')")
a("  const [tab, setTab] = useState('dashboard')")

a("")
a("  const toggleFilter = (key: string, val: string) => {")
a("    setActiveFilters(prev => { const cur = prev[key] || []; const next = cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val]; return { ...prev, [key]: next } })")
a("  }")

a("")
a("  const filtered = goods.filter(g => {")
a("    for (const [key, vals] of Object.entries(activeFilters)) { if (vals.length > 0 && !vals.includes(g[key as keyof typeof g] as string)) return false }")
a("    if (searchQuery && !Object.values(g).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))) return false")
a("    return true")
a("  })")

a("")
a("  return (")
a("    <div className='pgc-root space-y-4 p-4'>")
a("      <PageHeader title='Perishable Goods Command' description='Cold chain quality, temperature monitoring & shelf life optimization' />")

a("      <Tabs value={tab} onValueChange={setTab}>")
a("        <TabsList className='pgc-tabs-list bg-zinc-900 border border-zinc-800'>")
a("          <TabsTrigger value='dashboard' className='pgc-tab'>Dashboard</TabsTrigger>")
a("          <TabsTrigger value='inventory' className='pgc-tab'>Inventory</TabsTrigger>")
a("          <TabsTrigger value='analytics' className='pgc-tab'>Analytics</TabsTrigger>")
a("          <TabsTrigger value='insights' className='pgc-tab'>Insights</TabsTrigger>")
a("        </TabsList>")

a("        <TabsContent value='dashboard' className='pgc-tab-content space-y-4 mt-4'>")
a("          <div className='pgc-kpi-row grid grid-cols-2 lg:grid-cols-4 gap-3'>")
a("            <KpiTile label='Active Shipments' value='2,847' sub='+180 in transit' color='text-orange-400' />")
a("            <KpiTile label='Avg Freshness' value='91.3%' sub='+2.1pp vs last week' color='text-red-400' />")
a("            <KpiTile label='Waste Today' value='1.2 tons' sub='-0.4 tons improved' color='text-emerald-400' />")
a("            <KpiTile label='Temp Compliance' value='97.8%' sub='-0.3pp (target 99%)' color='text-amber-400' />")
a("          </div>")
a("          <div className='pgc-ring-row flex flex-wrap justify-around gap-2'>")
a("            <HealthRing value={97} label='Temp OK' color='#f97316' />")
a("            <HealthRing value={91} label='Freshness' color='#ef4444' />")
a("            <HealthRing value={88} label='FIFO Score' color='#f59e0b' />")
a("            <HealthRing value={94} label='Cold Chain' color='#10b981' />")
a("            <HealthRing value={82} label='Shelf Predict' color='#06b6d4' />")
a("            <HealthRing value={96} label='Hygiene' color='#6366f1' />")
a("          </div>")
a("          <div className='pgc-chart-row grid grid-cols-1 lg:grid-cols-3 gap-4'>")
a("            <Card className='pgc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>24hr Intake/Dispatch</CardTitle></CardHeader><CardContent><LineChart data={dailyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='hour' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Line type='monotone' dataKey='intake' stroke='#f97316' strokeWidth={2} dot={false}/><Line type='monotone' dataKey='dispatch' stroke='#ef4444' strokeWidth={2} dot={false}/></LineChart></CardContent></Card>")
a("            <Card className='pgc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Hourly Waste %</CardTitle></CardHeader><CardContent><BarChart data={dailyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='hour' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Bar dataKey='waste' fill='#f59e0b' radius={[4,4,0,0]}/></BarChart></CardContent></Card>")
a("            <Card className='pgc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Commodity Mix</CardTitle></CardHeader><CardContent><PieChart width={350} height={200}><Pie data={commodityDist} cx='50%' cy='50%' outerRadius={70} innerRadius={35} dataKey='value' paddingAngle={2}>{commodityDist.map((_, i) => <Cell key={i} fill={COLORS[i % 8]} />)}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>")
a("          </div>")
a("        </TabsContent>")

a("        <TabsContent value='inventory' className='pgc-tab-content space-y-4 mt-4'>")
a("          <ModuleBreadcrumb items={[{ label: 'Perishable Command' }, { label: 'Inventory' }]} />")
a("          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => { setActiveFilters({}); setSearchQuery('') }} totalItems={goods.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder='Search perishable goods by ID, commodity, hub...' />")
a("          <Card className='pgc-table-card bg-zinc-900/60 border-zinc-800'><CardContent className='p-0'><div className='pgc-table-wrap overflow-x-auto max-h-[400px] overflow-y-auto'><table className='pgc-table w-full text-sm'><thead><tr className='border-b border-zinc-800'><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>ID</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Commodity</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Hub</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Priority</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Freshness</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Spoilage</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Shelf</th><th className='text-right px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Tons</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Temp Zone</th></tr></thead><tbody>")
a("          {filtered.map(g => (")
a("            <tr key={g.id} className='pgc-table-row border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors'>")
a("              <td className='px-3 py-2 font-mono text-xs text-orange-400'>{g.id}</td>")
a("              <td className='px-3 py-2'><CommodityBadge commodity={g.commodity} /></td>")
a("              <td className='px-3 py-2 text-xs text-zinc-300'>{g.hub}</td>")
a("              <td className='px-3 py-2'><PriorityBadge priority={g.priority} /></td>")
a("              <td className='px-3 py-2 w-24'><FreshnessBar value={g.freshness_pct} /><span className='text-[10px] text-zinc-500 ml-1'>{g.freshness_pct}%</span></td>")
a("              <td className='px-3 py-2 w-24'><SpoilageBar value={g.spoilage_pct} /><span className='text-[10px] text-zinc-500 ml-1'>{g.spoilage_pct}%</span></td>")
a("              <td className='px-3 py-2 text-xs text-zinc-400'>{g.shelf_days}d</td>")
a("              <td className='px-3 py-2 text-right text-xs'>{g.tonnage}</td>")
a("              <td className='px-3 py-2'><TempBadge temp={g.tempZone} /></td>")
a("            </tr>")
a("          ))})")
a("          </tbody></table></div></CardContent></Card>")
a("        </TabsContent>")

a("        <TabsContent value='analytics' className='pgc-tab-content space-y-4 mt-4'>")
a("          <div className='pgc-value-row grid grid-cols-2 lg:grid-cols-4 gap-3'>")
a("            <ValueTile label='Total Throughput' value='4,280 tons' change='+12% WoW' />")
a("            <ValueTile label='Cold Chain Uptime' value='99.4%' change='+0.2pp' />")
a("            <ValueTile label='Avg Shelf Life Used' value='62%' change='-5pp optimized' />")
a("            <ValueTile label='Quality Rejections' value='0.8%' change='-0.3pp' />")
a("          </div>")
a("          <div className='pgc-analytics-charts grid grid-cols-1 lg:grid-cols-2 gap-4'>")
a("            <Card className='pgc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Hub Performance</CardTitle></CardHeader><CardContent><BarChart data={HUBS.map((h,i) => ({ name: h.split(' ')[0], freshness: [92,89,94,87,91,93,85,90][i], compliance: [98,96,99,95,97,99,93,97][i] }))} width={450} height={220}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='name' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Bar dataKey='freshness' fill='#f97316' radius={[4,4,0,0]}/><Bar dataKey='compliance' fill='#ef4444' radius={[4,4,0,0]}/></BarChart></CardContent></Card>")
a("            <Card className='pgc-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Temperature Zone Mix</CardTitle></CardHeader><CardContent><PieChart width={450} height={220}><Pie data={[{ name: 'Cool (2-8C)', value: 35 }, { name: 'Cold (-18C)', value: 28 }, { name: 'Ambient', value: 15 }, { name: 'Frozen', value: 12 }, { name: 'Ctrl RT', value: 10 }]} cx='50%' cy='50%' outerRadius={80} innerRadius={40} dataKey='value' paddingAngle={3}>{[<Cell key={0} fill='#0ea5e9' />, <Cell key={1} fill='#3b82f6' />, <Cell key={2} fill='#f59e0b' />, <Cell key={3} fill='#06b6d4' />, <Cell key={4} fill='#10b981' />]}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>")
a("          </div>")
a("        </TabsContent>")

a("        <TabsContent value='insights' className='pgc-tab-content space-y-4 mt-4'>")
a("          {insights.map((ins, i) => (")
a("            <Card key={i} className={'pgc-insight-card bg-zinc-900/60 border ' + (ins.severity === 'high' ? 'border-orange-500/30' : ins.severity === 'medium' ? 'border-red-500/30' : 'border-zinc-800')}><CardContent className='p-4'><div className='flex items-start gap-3'><div className={'pgc-insight-dot w-2 h-2 rounded-full mt-1.5 shrink-0 ' + (ins.severity === 'high' ? 'bg-orange-500' : ins.severity === 'medium' ? 'bg-red-500' : 'bg-zinc-500')} /><div><p className='text-sm font-medium text-zinc-200'>{ins.title}</p><p className='text-xs text-zinc-400 mt-1 leading-relaxed'>{ins.desc}</p></div></div></CardContent></Card>")
a("          ))})")
a("        </TabsContent>")
a("      </Tabs>")
a("    </div>")
a("  )")
a("}")
a("")

with open('/home/z/my-project/src/components/modules/perishable-goods-command-view.tsx', 'w') as f:
    f.write('\n'.join(lines))
print(f"Generated perishable-goods-command-view.tsx: {len(lines)} lines")
