#!/usr/bin/env python3
"""Generate Green Logistics Tracker module (R273b) - pure JS literals"""
import random
random.seed(273)

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
a("const COLORS = ['#10b981', '#059669', '#84cc16', '#eab308', '#06b6d4', '#3b82f6', '#8b5cf6', '#f97316']")

CATEGORIES_PY = ['Carbon Emissions', 'Waste Reduction', 'Energy Efficiency', 'Water Conservation', 'Green Packaging', 'Sustainable Transport', 'Renewable Energy', 'Circular Economy']
SITES_PY = ['Mumbai Hub', 'Delhi NCR DC', 'Chennai South', 'Bangalore Central', 'Hyderabad East', 'Pune West', 'Kolkata North', 'Ahmedabad Mid']
COMPLIANCE_PY = ['Compliant', 'Near Target', 'At Risk', 'Non-Compliant']
PRIORITIES_PY = ['Critical', 'High', 'Medium', 'Low']

a("")
a("const CATEGORIES = ['Carbon Emissions', 'Waste Reduction', 'Energy Efficiency', 'Water Conservation', 'Green Packaging', 'Sustainable Transport', 'Renewable Energy', 'Circular Economy']")
a("const SITES = ['Mumbai Hub', 'Delhi NCR DC', 'Chennai South', 'Bangalore Central', 'Hyderabad East', 'Pune West', 'Kolkata North', 'Ahmedabad Mid']")
a("const COMPLIANCE = ['Compliant', 'Near Target', 'At Risk', 'Non-Compliant']")
a("const PRIORITIES = ['Critical', 'High', 'Medium', 'Low']")

metrics = []
for i in range(55):
    cat = CATEGORIES_PY[i % 8]
    site = SITES_PY[i % 8]
    compliance = COMPLIANCE_PY[i % 4]
    priority = PRIORITIES_PY[i % 4]
    reduction_pct = round(random.uniform(-10, 65), 1)
    co2_saved = round(random.uniform(0.5, 48), 1)
    cost_savings = round(random.uniform(1, 120), 1)
    score = random.randint(35, 100)
    metrics.append({
        'id': 'GRN-%04d' % (i+1),
        'category': cat,
        'site': site,
        'compliance': compliance,
        'priority': priority,
        'reduction_pct': reduction_pct,
        'co2_saved': co2_saved,
        'cost_savings': cost_savings,
        'score': score,
        'target': random.randint(20, 80),
        'baseline': random.randint(100, 500),
        'current': random.randint(40, 350),
        'reportingPeriod': 'Q%d 2026' % ((i % 4) + 1),
    })

a("")
a("const metrics = [")
for m in metrics:
    a("  { id: '%s', category: '%s', site: '%s', compliance: '%s', priority: '%s', reduction_pct: %s, co2_saved: %s, cost_savings: %s, score: %d, target: %d, baseline: %d, current: %d, reportingPeriod: '%s' }," % (m['id'], m['category'], m['site'], m['compliance'], m['priority'], m['reduction_pct'], m['co2_saved'], m['cost_savings'], m['score'], m['target'], m['baseline'], m['current'], m['reportingPeriod']))
a("]")

a("")
a("const monthlyData = [")
months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
for i in range(12):
    a("  { month: '%s', co2: %d, cost: %d, reduction: %s }," % (months[i], random.randint(50,300), random.randint(10,80), str(round(random.uniform(5,45),1))))
a("]")

a("")
a("const categoryDist = [")
for c in CATEGORIES_PY:
    a("  { name: '%s', value: %d }," % (c, random.randint(15,70)))
a("]")

a("")
a("const filterGroups = [")
a("  { key: 'category', label: 'Category', options: CATEGORIES.map(c => ({ value: c, label: c, count: 0 })) },")
a("  { key: 'compliance', label: 'Compliance', options: COMPLIANCE.map(c => ({ value: c, label: c, count: 0 })) },")
a("  { key: 'priority', label: 'Priority', options: PRIORITIES.map(p => ({ value: p, label: p, count: 0 })) },")
a("]")

a("")
a("function CategoryBadge({ category }: { category: string }) {")
a("  const color = category === 'Carbon Emissions' ? 'bg-emerald-500/15 text-emerald-400' : category === 'Waste Reduction' ? 'bg-lime-500/15 text-lime-400' : category === 'Energy Efficiency' ? 'bg-cyan-500/15 text-cyan-400' : category === 'Water Conservation' ? 'bg-blue-500/15 text-blue-400' : category === 'Green Packaging' ? 'bg-amber-500/15 text-amber-400' : category === 'Sustainable Transport' ? 'bg-violet-500/15 text-violet-400' : category === 'Renewable Energy' ? 'bg-teal-500/15 text-teal-400' : 'bg-orange-500/15 text-orange-400'")
a("  return <span className={'glt-category-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{category}</span>")
a("}")
a("")
a("function ComplianceBadge({ compliance }: { compliance: string }) {")
a("  const color = compliance === 'Compliant' ? 'bg-emerald-500/15 text-emerald-400' : compliance === 'Near Target' ? 'bg-blue-500/15 text-blue-400' : compliance === 'At Risk' ? 'bg-amber-500/15 text-amber-400' : 'bg-red-500/15 text-red-400'")
a("  return <span className={'glt-compliance-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{compliance}</span>")
a("}")
a("")
a("function PriorityBadge({ priority }: { priority: string }) {")
a("  const color = priority === 'Critical' ? 'bg-red-500/15 text-red-400' : priority === 'High' ? 'bg-orange-500/15 text-orange-400' : priority === 'Medium' ? 'bg-amber-500/15 text-amber-400' : 'bg-blue-500/15 text-blue-400'")
a("  return <span className={'glt-priority-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{priority}</span>")
a("}")
a("")
a("function ReductionBar({ value }: { value: number }) {")
a("  const w = Math.min(Math.max(value * 2, 0), 100)")
a("  const color = value >= 30 ? 'bg-emerald-500' : value >= 15 ? 'bg-amber-500' : 'bg-red-500'")
a("  return <div className='glt-reduction-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className={'h-full rounded-full glt-reduction-fill ' + color} style={{ width: w + '%', animation: 'glt-grow 1s ease-out' }}/></div>")
a("}")
a("")
a("function Co2Bar({ value, max }: { value: number; max: number }) {")
a("  const w = Math.round(value / max * 100)")
a("  return <div className='glt-co2-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className='h-full rounded-full bg-lime-500 glt-co2-fill' style={{ width: w + '%', animation: 'glt-grow 1s ease-out' }}/></div>")
a("}")
a("")
a("function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {")
a("  const r = 28, c = 2 * Math.PI * r, offset = c - (value / 100) * c")
a("  return <div className='glt-ring flex flex-col items-center'><svg width='70' height='70' className='-rotate-90'><circle cx='35' cy='35' r={r} fill='none' stroke='#27272a' strokeWidth='5'/><circle cx='35' cy='35' r={r} fill='none' stroke={color} strokeWidth='5' strokeDasharray={c} strokeDashoffset={offset} strokeLinecap='round' className='glt-ring-path' style={{ transition: 'stroke-dashoffset 1s ease' }}/></svg><span className='glt-ring-val text-sm font-bold mt-1' style={{ color }}>{value}%</span><span className='glt-ring-label text-[10px] text-zinc-500'>{label}</span></div>")
a("}")
a("")
a("function KpiTile({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {")
a("  return <div className='glt-kpi bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 glt-kpi-card'><p className='text-xs text-zinc-500 mb-1'>{label}</p><p className={'text-xl font-bold ' + color}>{value}</p><p className='text-[10px] text-zinc-400 mt-1'>{sub}</p></div>")
a("}")
a("")
a("function ValueTile({ label, value, change }: { label: string; value: string; change: string }) {")
a("  const up = change.startsWith('+')")
a("  return <div className='glt-value-tile bg-zinc-900/60 border border-zinc-800 rounded-lg p-3'><p className='text-xs text-zinc-500'>{label}</p><p className='text-lg font-bold text-white mt-1'>{value}</p><p className={'text-xs mt-1 ' + (up ? 'text-emerald-400' : 'text-red-400')}>{change}</p></div>")
a("}")

a("")
a("const insights = [")
a("  { title: 'ESG Rating Upgrade', desc: 'Overall ESG score improved from B+ to A- after implementing solar panels at 3 warehouses. Carbon intensity reduced by 18%. Board presentation scheduled for August review.', severity: 'high' },")
a("  { title: 'Zero-Waste Milestone', desc: 'Chennai South achieved 92% waste diversion rate through composting, recycling partnerships, and packaging redesign. Target: 95% by Q4 2026. Model for other sites.', severity: 'medium' },")
a("  { title: 'EV Fleet Expansion', desc: '12 new electric forklifts deployed across Mumbai and Pune. Charging infrastructure complete with solar-backed stations. Total EV fleet now 38 units, 45% of material handling.', severity: 'high' },")
a("  { title: 'Water Recycling ROI', desc: 'Rainwater harvesting + greywater recycling at Bangalore Central saved 2.1M liters in H1 2026. Payback period: 14 months. Recommend scaling to all southern sites.', severity: 'low' },")
a("]")

a("")
a("export default function GreenLogisticsTrackerView() {")
a("  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})")
a("  const [searchQuery, setSearchQuery] = useState('')")
a("  const [tab, setTab] = useState('dashboard')")

a("")
a("  const toggleFilter = (key: string, val: string) => {")
a("    setActiveFilters(prev => { const cur = prev[key] || []; const next = cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val]; return { ...prev, [key]: next } })")
a("  }")

a("")
a("  const filtered = metrics.filter(m => {")
a("    for (const [key, vals] of Object.entries(activeFilters)) { if (vals.length > 0 && !vals.includes(m[key as keyof typeof m] as string)) return false }")
a("    if (searchQuery && !Object.values(m).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))) return false")
a("    return true")
a("  })")

a("")
a("  return (")
a("    <div className='glt-root space-y-4 p-4'>")
a("      <PageHeader title='Green Logistics Tracker' description='Sustainability metrics, ESG compliance & carbon footprint monitoring' />")

a("      <Tabs value={tab} onValueChange={setTab}>")
a("        <TabsList className='glt-tabs-list bg-zinc-900 border border-zinc-800'>")
a("          <TabsTrigger value='dashboard' className='glt-tab'>Dashboard</TabsTrigger>")
a("          <TabsTrigger value='metrics' className='glt-tab'>Metrics</TabsTrigger>")
a("          <TabsTrigger value='analytics' className='glt-tab'>Analytics</TabsTrigger>")
a("          <TabsTrigger value='insights' className='glt-tab'>Insights</TabsTrigger>")
a("        </TabsList>")

a("        <TabsContent value='dashboard' className='glt-tab-content space-y-4 mt-4'>")
a("          <div className='glt-kpi-row grid grid-cols-2 lg:grid-cols-4 gap-3'>")
a("            <KpiTile label='CO2 Saved (MTD)' value='142 T' sub='+28% vs target' color='text-emerald-400' />")
a("            <KpiTile label='ESG Score' value='A-' sub='Up from B+' color='text-lime-400' />")
a("            <KpiTile label='Compliance Rate' value='87%' sub='+5pp QoQ' color='text-cyan-400' />")
a("            <KpiTile label='Cost Savings' value='INR 4.2Cr' sub='+18% YoY' color='text-amber-400' />")
a("          </div>")
a("          <div className='glt-ring-row flex flex-wrap justify-around gap-2'>")
a("            <HealthRing value={82} label='Carbon' color='#10b981' />")
a("            <HealthRing value={76} label='Water' color='#06b6d4' />")
a("            <HealthRing value={89} label='Energy' color='#84cc16' />")
a("            <HealthRing value={71} label='Waste' color='#eab308' />")
a("            <HealthRing value={85} label='Transport' color='#3b82f6' />")
a("            <HealthRing value={93} label='Packaging' color='#059669' />")
a("          </div>")
a("          <div className='glt-chart-row grid grid-cols-1 lg:grid-cols-3 gap-4'>")
a("            <Card className='glt-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>CO2 Savings Trend</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='month' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Line type='monotone' dataKey='co2' stroke='#10b981' strokeWidth={2} dot={false}/><Line type='monotone' dataKey='reduction' stroke='#84cc16' strokeWidth={2} dot={false}/></LineChart></CardContent></Card>")
a("            <Card className='glt-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Cost Savings</CardTitle></CardHeader><CardContent><BarChart data={monthlyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='month' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Bar dataKey='cost' fill='#059669' radius={[4,4,0,0]}/></BarChart></CardContent></Card>")
a("            <Card className='glt-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Category Distribution</CardTitle></CardHeader><CardContent><PieChart width={350} height={200}><Pie data={categoryDist} cx='50%' cy='50%' outerRadius={70} innerRadius={35} dataKey='value' paddingAngle={2}>{categoryDist.map((_, i) => <Cell key={i} fill={COLORS[i % 8]} />)}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>")
a("          </div>")
a("        </TabsContent>")

a("        <TabsContent value='metrics' className='glt-tab-content space-y-4 mt-4'>")
a("          <ModuleBreadcrumb items={[{ label: 'Green Logistics' }, { label: 'Metrics' }]} />")
a("          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => { setActiveFilters({}); setSearchQuery('') }} totalItems={metrics.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder='Search metrics by ID, category, site...' />")
a("          <Card className='glt-table-card bg-zinc-900/60 border-zinc-800'><CardContent className='p-0'><div className='glt-table-wrap overflow-x-auto'><table className='glt-table w-full text-sm'><thead><tr className='border-b border-zinc-800'><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>ID</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Category</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Site</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Priority</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Reduction</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>CO2 Saved</th><th className='text-right px-3 py-2 text-zinc-500 text-xs font-medium'>Score</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Compliance</th></tr></thead><tbody>")
a("          {filtered.map(m => (")
a("            <tr key={m.id} className='glt-table-row border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors'>")
a("              <td className='px-3 py-2 font-mono text-xs text-emerald-400'>{m.id}</td>")
a("              <td className='px-3 py-2'><CategoryBadge category={m.category} /></td>")
a("              <td className='px-3 py-2 text-xs text-zinc-300'>{m.site}</td>")
a("              <td className='px-3 py-2'><PriorityBadge priority={m.priority} /></td>")
a("              <td className='px-3 py-2 w-24'><ReductionBar value={m.reduction_pct} /><span className='text-[10px] text-zinc-500 ml-1'>{m.reduction_pct}%</span></td>")
a("              <td className='px-3 py-2 w-24'><Co2Bar value={m.co2_saved} max={50} /><span className='text-[10px] text-zinc-500 ml-1'>{m.co2_saved}T</span></td>")
a("              <td className='px-3 py-2 text-right text-xs font-medium'>{m.score}</td>")
a("              <td className='px-3 py-2'><ComplianceBadge compliance={m.compliance} /></td>")
a("            </tr>")
a("          ))})")
a("          </tbody></table></div></CardContent></Card>")
a("        </TabsContent>")

a("        <TabsContent value='analytics' className='glt-tab-content space-y-4 mt-4'>")
a("          <div className='glt-value-row grid grid-cols-2 lg:grid-cols-4 gap-3'>")
a("            <ValueTile label='Total CO2 YTD' value='1,240 T' change='+32% vs target' />")
a("            <ValueTile label='Energy from Solar' value='42%' change='+8pp' />")
a("            <ValueTile label='Waste Diverted' value='78%' change='+12pp' />")
a("            <ValueTile label='Green Certs' value='24' change='+6 new' />")
a("          </div>")
a("          <div className='glt-analytics-charts grid grid-cols-1 lg:grid-cols-2 gap-4'>")
a("            <Card className='glt-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Site ESG Scores</CardTitle></CardHeader><CardContent><BarChart data={SITES.map((s,i) => ({ name: s.split(' ')[0], score: [82,78,91,74,86,79,71,88][i] }))} width={450} height={220}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='name' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Bar dataKey='score' fill='#10b981' radius={[4,4,0,0]}/></BarChart></CardContent></Card>")
a("            <Card className='glt-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Compliance Distribution</CardTitle></CardHeader><CardContent><PieChart width={450} height={220}><Pie data={[{ name: 'Compliant', value: 42 }, { name: 'Near Target', value: 28 }, { name: 'At Risk', value: 20 }, { name: 'Non-Compliant', value: 10 }]} cx='50%' cy='50%' outerRadius={80} innerRadius={40} dataKey='value' paddingAngle={3}>{[<Cell key={0} fill='#10b981' />, <Cell key={1} fill='#3b82f6' />, <Cell key={2} fill='#eab308' />, <Cell key={3} fill='#ef4444' />]}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>")
a("          </div>")
a("        </TabsContent>")

a("        <TabsContent value='insights' className='glt-tab-content space-y-4 mt-4'>")
a("          {insights.map((ins, i) => (")
a("            <Card key={i} className={'glt-insight-card bg-zinc-900/60 border ' + (ins.severity === 'high' ? 'border-emerald-500/30' : ins.severity === 'medium' ? 'border-amber-500/30' : 'border-zinc-800')}><CardContent className='p-4'><div className='flex items-start gap-3'><div className={'glt-insight-dot w-2 h-2 rounded-full mt-1.5 shrink-0 ' + (ins.severity === 'high' ? 'bg-emerald-500' : ins.severity === 'medium' ? 'bg-amber-500' : 'bg-zinc-500')} /><div><p className='text-sm font-medium text-zinc-200'>{ins.title}</p><p className='text-xs text-zinc-400 mt-1 leading-relaxed'>{ins.desc}</p></div></div></CardContent></Card>")
a("          ))})")
a("        </TabsContent>")
a("      </Tabs>")
a("    </div>")
a("  )")
a("}")
a("")

with open('/home/z/my-project/src/components/modules/green-logistics-tracker-view.tsx', 'w') as f:
    f.write('\n'.join(lines))
print(f"Generated green-logistics-tracker-view.tsx: {len(lines)} lines")
