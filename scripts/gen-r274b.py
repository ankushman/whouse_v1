#!/usr/bin/env python3
"""Generate Smart Returns Routing module (R274b) - pure JS literals"""
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
a("const COLORS = ['#14b8a6', '#84cc16', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#f97316']")

ROUTES_PY = ['Refurbish Center', 'Donate Charity', 'Resell Marketplace', 'Recycle Vendor', 'Manufacturer Return', 'Liquidation Auction', 'Exchange Stock', 'Scrap Disposal']
CATEGORIES_PY = ['Electronics', 'Apparel', 'Home & Kitchen', 'Beauty & Health', 'Sports & Outdoor', 'Books & Media', 'Toys & Games', 'Food & Beverages']
CHANNELS_PY = ['Online E-com', 'Retail Store', 'COD Reject', 'Warranty Claim', 'Subscription Cancel', 'Corporate Bulk']
PRIORITIES_PY = ['Critical', 'High', 'Medium', 'Low']

a("")
a("const ROUTES = ['Refurbish Center', 'Donate Charity', 'Resell Marketplace', 'Recycle Vendor', 'Manufacturer Return', 'Liquidation Auction', 'Exchange Stock', 'Scrap Disposal']")
a("const CATEGORIES = ['Electronics', 'Apparel', 'Home & Kitchen', 'Beauty & Health', 'Sports & Outdoor', 'Books & Media', 'Toys & Games', 'Food & Beverages']")
a("const CHANNELS = ['Online E-com', 'Retail Store', 'COD Reject', 'Warranty Claim', 'Subscription Cancel', 'Corporate Bulk']")
a("const PRIORITIES = ['Critical', 'High', 'Medium', 'Low']")

returns = []
for i in range(60):
    route = ROUTES_PY[i % 8]
    cat = CATEGORIES_PY[i % 8]
    channel = CHANNELS_PY[i % 6]
    priority = PRIORITIES_PY[i % 4]
    recovery = round(random.uniform(20, 95), 1)
    transit_days = random.randint(1, 12)
    cost = round(random.uniform(15, 280), 1)
    returns.append({
        'id': 'SRR-%04d' % (i+1),
        'route': route,
        'category': cat,
        'channel': channel,
        'priority': priority,
        'recovery_pct': recovery,
        'transit_days': transit_days,
        'cost_inr': cost,
        'volume': random.randint(50, 800),
        'condition': random.choice(['Like New', 'Good', 'Fair', 'Damaged', 'Defective']),
        'lastRouted': '2026-07-%02d %02d:%02d' % (random.randint(1,30), random.randint(0,23), random.randint(0,59)),
    })

a("")
a("const returns = [")
for r in returns:
    a("  { id: '%s', route: '%s', category: '%s', channel: '%s', priority: '%s', recovery_pct: %s, transit_days: %d, cost_inr: %s, volume: %d, condition: '%s', lastRouted: '%s' }," % (r['id'], r['route'], r['category'], r['channel'], r['priority'], r['recovery_pct'], r['transit_days'], r['cost_inr'], r['volume'], r['condition'], r['lastRouted']))
a("]")

a("")
a("const weeklyData = [")
weeks = ['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12']
for i in range(12):
    a("  { week: '%s', routed: %d, recovered: %d, costAvg: %s }," % (weeks[i], random.randint(200,900), random.randint(100,600), str(round(random.uniform(45,180),1))))
a("]")

a("")
a("const routeDist = [")
for rt in ROUTES_PY:
    a("  { name: '%s', value: %d }," % (rt, random.randint(30, 180)))
a("]")

a("")
a("const filterGroups = [")
a("  { key: 'route', label: 'Route', options: ROUTES.map(r => ({ value: r, label: r, count: 0 })) },")
a("  { key: 'category', label: 'Category', options: CATEGORIES.map(c => ({ value: c, label: c, count: 0 })) },")
a("  { key: 'channel', label: 'Channel', options: CHANNELS.map(c => ({ value: c, label: c, count: 0 })) },")
a("]")

# Badges
a("")
a("function RouteBadge({ route }: { route: string }) {")
a("  const color = route === 'Refurbish Center' ? 'bg-teal-500/15 text-teal-400' : route === 'Donate Charity' ? 'bg-lime-500/15 text-lime-400' : route === 'Resell Marketplace' ? 'bg-cyan-500/15 text-cyan-400' : route === 'Recycle Vendor' ? 'bg-emerald-500/15 text-emerald-400' : route === 'Manufacturer Return' ? 'bg-amber-500/15 text-amber-400' : route === 'Liquidation Auction' ? 'bg-pink-500/15 text-pink-400' : route === 'Exchange Stock' ? 'bg-indigo-500/15 text-indigo-400' : 'bg-orange-500/15 text-orange-400'")
a("  return <span className={'srr-route-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{route}</span>")
a("}")
a("")
a("function ChannelBadge({ channel }: { channel: string }) {")
a("  const color = channel === 'Online E-com' ? 'bg-blue-500/15 text-blue-400' : channel === 'Retail Store' ? 'bg-violet-500/15 text-violet-400' : channel === 'COD Reject' ? 'bg-red-500/15 text-red-400' : channel === 'Warranty Claim' ? 'bg-emerald-500/15 text-emerald-400' : channel === 'Subscription Cancel' ? 'bg-amber-500/15 text-amber-400' : 'bg-orange-500/15 text-orange-400'")
a("  return <span className={'srr-channel-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{channel}</span>")
a("}")
a("")
a("function PriorityBadge({ priority }: { priority: string }) {")
a("  const color = priority === 'Critical' ? 'bg-red-500/15 text-red-400' : priority === 'High' ? 'bg-orange-500/15 text-orange-400' : priority === 'Medium' ? 'bg-amber-500/15 text-amber-400' : 'bg-blue-500/15 text-blue-400'")
a("  return <span className={'srr-priority-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{priority}</span>")
a("}")
a("")
a("function RecoveryBar({ value }: { value: number }) {")
a("  const w = value")
a("  const color = value >= 70 ? 'bg-emerald-500' : value >= 50 ? 'bg-amber-500' : 'bg-red-500'")
a("  return <div className='srr-recovery-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className={'h-full rounded-full srr-recovery-fill ' + color} style={{ width: w + '%', animation: 'srr-grow 1s ease-out' }}/></div>")
a("}")
a("")
a("function CostBar({ value }: { value: number }) {")
a("  const w = Math.min(value / 2.8, 100)")
a("  return <div className='srr-cost-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className='h-full rounded-full bg-teal-500 srr-cost-fill' style={{ width: w + '%', animation: 'srr-grow 1s ease-out' }}/></div>")
a("}")
a("")
a("function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {")
a("  const r = 28, c = 2 * Math.PI * r, offset = c - (value / 100) * c")
a("  return <div className='srr-ring flex flex-col items-center'><svg width='70' height='70' className='-rotate-90'><circle cx='35' cy='35' r={r} fill='none' stroke='#27272a' strokeWidth='5'/><circle cx='35' cy='35' r={r} fill='none' stroke={color} strokeWidth='5' strokeDasharray={c} strokeDashoffset={offset} strokeLinecap='round' className='srr-ring-path' style={{ transition: 'stroke-dashoffset 1s ease' }}/></svg><span className='srr-ring-val text-sm font-bold mt-1' style={{ color }}>{value}%</span><span className='srr-ring-label text-[10px] text-zinc-500'>{label}</span></div>")
a("}")
a("")
a("function KpiTile({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {")
a("  return <div className='srr-kpi bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 srr-kpi-card'><p className='text-xs text-zinc-500 mb-1'>{label}</p><p className={'text-xl font-bold ' + color}>{value}</p><p className='text-[10px] text-zinc-400 mt-1'>{sub}</p></div>")
a("}")
a("")
a("function ValueTile({ label, value, change }: { label: string; value: string; change: string }) {")
a("  const up = change.startsWith('+')")
a("  return <div className='srr-value-tile bg-zinc-900/60 border border-zinc-800 rounded-lg p-3'><p className='text-xs text-zinc-500'>{label}</p><p className='text-lg font-bold text-white mt-1'>{value}</p><p className={'text-xs mt-1 ' + (up ? 'text-emerald-400' : 'text-red-400')}>{change}</p></div>")
a("}")

a("")
a("const insights = [")
a("  { title: 'Electronics Refurbish Revenue Surge', desc: 'Refurbish Center route for electronics generated INR 2.4Cr revenue this month, up 35% from refurbished smartphones and laptops. AI grading system achieving 92% accuracy in condition assessment. Recommend expanding to 2 additional refurbish centers in Pune and Hyderabad.', severity: 'high' },")
a("  { title: 'COD Reject Route Optimization', desc: 'COD rejection rate reduced from 18% to 11% after implementing pre-paid incentive program and dynamic routing. Returns from COD channel rerouted to Exchange Stock at 68% recovery rate vs previous Liquidation at 22%. Net savings: INR 45L per month.', severity: 'medium' },")
a("  { title: 'Charity Donation Partnership Expansion', desc: 'New MoU signed with 5 NGOs for apparel and home goods donation channel. Tax benefit recovery improved from INR 12/unit to INR 28/unit. Environmental impact: 4.2 tons diverted from landfill. CSR compliance score improved to 95/100.', severity: 'low' },")
a("  { title: 'AI Route Assignment Engine v3', desc: 'New ML-based route assignment engine considers 14 factors including item condition, market demand, logistics cost, and environmental impact. Average recovery value improved by 22% while reducing transit time by 1.8 days. Processing cost reduced by INR 8 per unit.', severity: 'medium' },")
a("]")

a("")
a("export default function SmartReturnsRoutingView() {")
a("  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})")
a("  const [searchQuery, setSearchQuery] = useState('')")
a("  const [tab, setTab] = useState('dashboard')")

a("")
a("  const toggleFilter = (key: string, val: string) => {")
a("    setActiveFilters(prev => { const cur = prev[key] || []; const next = cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val]; return { ...prev, [key]: next } })")
a("  }")

a("")
a("  const filtered = returns.filter(r => {")
a("    for (const [key, vals] of Object.entries(activeFilters)) { if (vals.length > 0 && !vals.includes(r[key as keyof typeof r] as string)) return false }")
a("    if (searchQuery && !Object.values(r).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))) return false")
a("    return true")
a("  })")

a("")
a("  return (")
a("    <div className='srr-root space-y-4 p-4'>")
a("      <PageHeader title='Smart Returns Routing' description='AI-powered reverse logistics routing & recovery optimization' />")

a("      <Tabs value={tab} onValueChange={setTab}>")
a("        <TabsList className='srr-tabs-list bg-zinc-900 border border-zinc-800'>")
a("          <TabsTrigger value='dashboard' className='srr-tab'>Dashboard</TabsTrigger>")
a("          <TabsTrigger value='routes' className='srr-tab'>Routes</TabsTrigger>")
a("          <TabsTrigger value='analytics' className='srr-tab'>Analytics</TabsTrigger>")
a("          <TabsTrigger value='insights' className='srr-tab'>Insights</TabsTrigger>")
a("        </TabsList>")

a("        <TabsContent value='dashboard' className='srr-tab-content space-y-4 mt-4'>")
a("          <div className='srr-kpi-row grid grid-cols-2 lg:grid-cols-4 gap-3'>")
a("            <KpiTile label='Returns Routed' value='8,456' sub='+340 this week' color='text-teal-400' />")
a("            <KpiTile label='Recovery Rate' value='68.4%' sub='+4.2pp vs Q1' color='text-lime-400' />")
a("            <KpiTile label='Revenue Recovered' value='INR 5.8Cr' sub='+INR 1.2Cr MoM' color='text-emerald-400' />")
a("            <KpiTile label='Avg Transit' value='4.2 days' sub='-1.1 day improvement' color='text-cyan-400' />")
a("          </div>")
a("          <div className='srr-ring-row flex flex-wrap justify-around gap-2'>")
a("            <HealthRing value={68} label='Recovery' color='#14b8a6' />")
a("            <HealthRing value={82} label='Speed' color='#84cc16' />")
a("            <HealthRing value={74} label='Accuracy' color='#06b6d4' />")
a("            <HealthRing value={91} label='Compliance' color='#10b981' />")
a("            <HealthRing value={65} label='Sustainability' color='#f59e0b' />")
a("            <HealthRing value={88} label='Automation' color='#ec4899' />")
a("          </div>")
a("          <div className='srr-chart-row grid grid-cols-1 lg:grid-cols-3 gap-4'>")
a("            <Card className='srr-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Weekly Returns Volume</CardTitle></CardHeader><CardContent><LineChart data={weeklyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='week' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Line type='monotone' dataKey='routed' stroke='#14b8a6' strokeWidth={2} dot={false}/><Line type='monotone' dataKey='recovered' stroke='#84cc16' strokeWidth={2} dot={false}/></LineChart></CardContent></Card>")
a("            <Card className='srr-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Avg Processing Cost</CardTitle></CardHeader><CardContent><BarChart data={weeklyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='week' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Bar dataKey='costAvg' fill='#06b6d4' radius={[4,4,0,0]}/></BarChart></CardContent></Card>")
a("            <Card className='srr-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Route Distribution</CardTitle></CardHeader><CardContent><PieChart width={350} height={200}><Pie data={routeDist} cx='50%' cy='50%' outerRadius={70} innerRadius={35} dataKey='value' paddingAngle={2}>{routeDist.map((_, i) => <Cell key={i} fill={COLORS[i % 8]} />)}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>")
a("          </div>")
a("        </TabsContent>")

a("        <TabsContent value='routes' className='srr-tab-content space-y-4 mt-4'>")
a("          <ModuleBreadcrumb items={[{ label: 'Smart Returns' }, { label: 'Routes' }]} />")
a("          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => { setActiveFilters({}); setSearchQuery('') }} totalItems={returns.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder='Search returns by ID, route, category, channel...' />")
a("          <Card className='srr-table-card bg-zinc-900/60 border-zinc-800'><CardContent className='p-0'><div className='srr-table-wrap overflow-x-auto max-h-[400px] overflow-y-auto'><table className='srr-table w-full text-sm'><thead><tr className='border-b border-zinc-800'><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>ID</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Route</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Category</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Priority</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Recovery</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Cost</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Transit</th><th className='text-right px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Volume</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Channel</th></tr></thead><tbody>")
a("          {filtered.map(r => (")
a("            <tr key={r.id} className='srr-table-row border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors'>")
a("              <td className='px-3 py-2 font-mono text-xs text-teal-400'>{r.id}</td>")
a("              <td className='px-3 py-2'><RouteBadge route={r.route} /></td>")
a("              <td className='px-3 py-2 text-xs text-zinc-300'>{r.category}</td>")
a("              <td className='px-3 py-2'><PriorityBadge priority={r.priority} /></td>")
a("              <td className='px-3 py-2 w-24'><RecoveryBar value={r.recovery_pct} /><span className='text-[10px] text-zinc-500 ml-1'>{r.recovery_pct}%</span></td>")
a("              <td className='px-3 py-2 w-24'><CostBar value={r.cost_inr} /><span className='text-[10px] text-zinc-500 ml-1'>INR {r.cost_inr}</span></td>")
a("              <td className='px-3 py-2 text-xs text-zinc-400'>{r.transit_days}d</td>")
a("              <td className='px-3 py-2 text-right text-xs'>{r.volume}</td>")
a("              <td className='px-3 py-2'><ChannelBadge channel={r.channel} /></td>")
a("            </tr>")
a("          ))})")
a("          </tbody></table></div></CardContent></Card>")
a("        </TabsContent>")

a("        <TabsContent value='analytics' className='srr-tab-content space-y-4 mt-4'>")
a("          <div className='srr-value-row grid grid-cols-2 lg:grid-cols-4 gap-3'>")
a("            <ValueTile label='Total Recovery Value' value='INR 12.4Cr' change='+28% YoY' />")
a("            <ValueTile label='Items Processed' value='48,290' change='+5,200 this month' />")
a("            <ValueTile label='Carbon Diverted' value='18.6 tons' change='-4.2 tons landfill' />")
a("            <ValueTile label='Routes Active' value='8' change='+1 new' />")
a("          </div>")
a("          <div className='srr-analytics-charts grid grid-cols-1 lg:grid-cols-2 gap-4'>")
a("            <Card className='srr-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Category Recovery Rates</CardTitle></CardHeader><CardContent><BarChart data={CATEGORIES.map((c,i) => ({ name: c.split(' ')[0], recovery: [72,58,64,78,55,82,48,91][i], volume: [420,380,310,290,180,350,120,450][i] }))} width={450} height={220}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='name' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Bar dataKey='recovery' fill='#14b8a6' radius={[4,4,0,0]}/><Bar dataKey='volume' fill='#84cc16' radius={[4,4,0,0]}/></BarChart></CardContent></Card>")
a("            <Card className='srr-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Channel Mix</CardTitle></CardHeader><CardContent><PieChart width={450} height={220}><Pie data={[{ name: 'Online E-com', value: 38 }, { name: 'COD Reject', value: 22 }, { name: 'Retail Store', value: 18 }, { name: 'Warranty', value: 12 }, { name: 'Subscription', value: 6 }, { name: 'Corporate', value: 4 }]} cx='50%' cy='50%' outerRadius={80} innerRadius={40} dataKey='value' paddingAngle={3}>{[<Cell key={0} fill='#3b82f6' />, <Cell key={1} fill='#ef4444' />, <Cell key={2} fill='#8b5cf6' />, <Cell key={3} fill='#10b981' />, <Cell key={4} fill='#f59e0b' />, <Cell key={5} fill='#f97316' />]}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>")
a("          </div>")
a("        </TabsContent>")

a("        <TabsContent value='insights' className='srr-tab-content space-y-4 mt-4'>")
a("          {insights.map((ins, i) => (")
a("            <Card key={i} className={'srr-insight-card bg-zinc-900/60 border ' + (ins.severity === 'high' ? 'border-teal-500/30' : ins.severity === 'medium' ? 'border-lime-500/30' : 'border-zinc-800')}><CardContent className='p-4'><div className='flex items-start gap-3'><div className={'srr-insight-dot w-2 h-2 rounded-full mt-1.5 shrink-0 ' + (ins.severity === 'high' ? 'bg-teal-500' : ins.severity === 'medium' ? 'bg-lime-500' : 'bg-zinc-500')} /><div><p className='text-sm font-medium text-zinc-200'>{ins.title}</p><p className='text-xs text-zinc-400 mt-1 leading-relaxed'>{ins.desc}</p></div></div></CardContent></Card>")
a("          ))})")
a("        </TabsContent>")
a("      </Tabs>")
a("    </div>")
a("  )")
a("}")
a("")

with open('/home/z/my-project/src/components/modules/smart-returns-routing-view.tsx', 'w') as f:
    f.write('\n'.join(lines))
print(f"Generated smart-returns-routing-view.tsx: {len(lines)} lines")
