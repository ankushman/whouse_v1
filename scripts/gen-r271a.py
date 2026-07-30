#!/usr/bin/env python3
"""Regenerate AI Demand Sensing Pro module (R271a) - pure JS literals"""
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
a("const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#6366f1']")
a("")
a("const CATEGORIES = ['Electronics', 'Apparel', 'FMCG', 'Home & Garden', 'Pharma', 'Automotive', 'Sports', 'Beauty']")
a("const REGIONS = ['North India', 'South India', 'West India', 'East India', 'Central India', 'NE India', 'Metro Tier1', 'Rural']")
a("const MODELS = ['ARIMA', 'Prophet', 'LSTM', 'XGBoost', 'Ensemble', 'Transformer']")
a("const ACCURACIES = ['High (>95%)', 'Medium (85-95%)', 'Low (<85%)']")
a("const STATUSES = ['Active', 'Draft', 'Paused', 'Archived']")
a("const SIGNALS = ['Bullish', 'Bearish', 'Neutral', 'Seasonal Spike', 'Trend Break']")
a("const HORIZONS = ['7d', '14d', '30d', '60d', '90d']")

# Generate 60 forecast records
forecasts = []
CATEGORIES_PY = ['Electronics', 'Apparel', 'FMCG', 'Home & Garden', 'Pharma', 'Automotive', 'Sports', 'Beauty']
REGIONS_PY = ['North India', 'South India', 'West India', 'East India', 'Central India', 'NE India', 'Metro Tier1', 'Rural']
MODELS_PY = ['ARIMA', 'Prophet', 'LSTM', 'XGBoost', 'Ensemble', 'Transformer']
ACCURACIES_PY = ['High (>95%)', 'Medium (85-95%)', 'Low (<85%)']
STATUSES_PY = ['Active', 'Draft', 'Paused', 'Archived']
SIGNALS_PY = ['Bullish', 'Bearish', 'Neutral', 'Seasonal Spike', 'Trend Break']
HORIZONS_PY = ['7d', '14d', '30d', '60d', '90d']

for i in range(60):
    cat = CATEGORIES_PY[i % 8]
    region = REGIONS_PY[i % 8]
    model = MODELS_PY[i % 6]
    accuracy = ACCURACIES_PY[i % 3]
    status = STATUSES_PY[i % 4]
    predicted = random.randint(80, 950)
    actual = predicted + random.randint(-80, 60)
    mape = round(abs(actual - predicted) / max(actual, 1) * 100, 1)
    bias = round(random.uniform(-15, 15), 1)
    forecasts.append({
        'id': f'DS-{i+1:04d}',
        'sku': f'SKU-{random.randint(10000, 99999)}',
        'category': cat,
        'region': region,
        'model': model,
        'horizon': HORIZONS_PY[i % 5],
        'predicted': predicted,
        'actual': actual,
        'mape': mape,
        'bias': bias,
        'accuracy': accuracy,
        'status': status,
        'confidence': random.randint(60, 99),
        'signal': SIGNALS_PY[i % 5],
        'updatedAt': f"2026-07-{random.randint(1, 30):02d}",
    })

a("")
a("const forecasts = [")
for f in forecasts:
    a(f"  {{ id: '{f['id']}', sku: '{f['sku']}', category: '{f['category']}', region: '{f['region']}', model: '{f['model']}', horizon: '{f['horizon']}', predicted: {f['predicted']}, actual: {f['actual']}, mape: {f['mape']}, bias: {f['bias']}, accuracy: '{f['accuracy']}', status: '{f['status']}', confidence: {f['confidence']}, signal: '{f['signal']}', updatedAt: '{f['updatedAt']}' }},")
a("]")

# Monthly data
a("")
a("const monthlyData = [")
for i in range(12):
    month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]
    forecast = random.randint(400, 800)
    actual = random.randint(380, 820)
    accuracy = round(random.uniform(82, 98), 1)
    a(f"  {{ month: '{month}', forecast: {forecast}, actual: {actual}, accuracy: {accuracy} }},")
a("]")

# Category distribution
a("")
a("const categoryDist = [")
for cat in CATEGORIES_PY:
    val = random.randint(40, 180)
    a(f"  {{ name: '{cat}', value: {val} }},")
a("]")

a("")
a("const filterGroups = [")
a("  { key: 'category', label: 'Category', options: CATEGORIES.map(c => ({ value: c, label: c, count: 0 })) },")
a("  { key: 'model', label: 'Model', options: MODELS.map(m => ({ value: m, label: m, count: 0 })) },")
a("  { key: 'accuracy', label: 'Accuracy', options: ACCURACIES.map(a => ({ value: a, label: a, count: 0 })) },")
a("]")

# Inline components
a("")
a("function AccuracyBadge({ accuracy }: { accuracy: string }) {")
a("  const color = accuracy.startsWith('High') ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : accuracy.startsWith('Medium') ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' : 'bg-red-500/15 text-red-400 border-red-500/30'")
a("  return <span className={'ads-acc-badge px-2 py-0.5 rounded-full text-xs font-medium border ' + color}>{accuracy}</span>")
a("}")
a("")
a("function StatusBadge({ status }: { status: string }) {")
a("  const color = status === 'Active' ? 'bg-emerald-500/15 text-emerald-400' : status === 'Draft' ? 'bg-blue-500/15 text-blue-400' : status === 'Paused' ? 'bg-amber-500/15 text-amber-400' : 'bg-zinc-500/15 text-zinc-400'")
a("  return <span className={'ads-status-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{status}</span>")
a("}")
a("")
a("function SignalBadge({ signal }: { signal: string }) {")
a("  const color = signal === 'Bullish' ? 'bg-emerald-500/15 text-emerald-400' : signal === 'Bearish' ? 'bg-red-500/15 text-red-400' : signal === 'Seasonal Spike' ? 'bg-amber-500/15 text-amber-400' : signal === 'Trend Break' ? 'bg-violet-500/15 text-violet-400' : 'bg-zinc-500/15 text-zinc-400'")
a("  return <span className={'ads-signal-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}>{signal}</span>")
a("}")
a("")
a("function MapeBar({ value }: { value: number }) {")
a("  const w = Math.min(value * 2, 100)")
a("  const color = value < 10 ? 'bg-emerald-500' : value < 20 ? 'bg-amber-500' : 'bg-red-500'")
a("  return <div className='ads-mape-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className={'h-full rounded-full ads-mape-fill ' + color} style={{ width: w + '%', animation: 'ads-grow 1s ease-out' }}/></div>")
a("}")
a("")
a("function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {")
a("  const r = 28, c = 2 * Math.PI * r, offset = c - (value / 100) * c")
a("  return <div className='ads-ring flex flex-col items-center'><svg width='70' height='70' className='-rotate-90'><circle cx='35' cy='35' r={r} fill='none' stroke='#27272a' strokeWidth='5'/><circle cx='35' cy='35' r={r} fill='none' stroke={color} strokeWidth='5' strokeDasharray={c} strokeDashoffset={offset} strokeLinecap='round' className='ads-ring-path' style={{ transition: 'stroke-dashoffset 1s ease' }}/></svg><span className='ads-ring-val text-sm font-bold mt-1' style={{ color }}>{value}%</span><span className='ads-ring-label text-[10px] text-zinc-500'>{label}</span></div>")
a("}")
a("")
a("function KpiTile({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {")
a("  return <div className='ads-kpi bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 ads-kpi-card'><p className='text-xs text-zinc-500 mb-1'>{label}</p><p className={'text-xl font-bold ' + color}>{value}</p><p className='text-[10px] text-zinc-400 mt-1'>{sub}</p></div>")
a("}")
a("")
a("function ValueTile({ label, value, change }: { label: string; value: string; change: string }) {")
a("  const up = change.startsWith('+')")
a("  return <div className='ads-value-tile bg-zinc-900/60 border border-zinc-800 rounded-lg p-3'><p className='text-xs text-zinc-500'>{label}</p><p className='text-lg font-bold text-white mt-1'>{value}</p><p className={'text-xs mt-1 ' + (up ? 'text-emerald-400' : 'text-red-400')}>{change}</p></div>")
a("}")

a("")
a("const insights = [")
a("  { title: 'Monsoon Demand Surge', desc: 'FMCG & Pharma categories show 23% spike in South India forecasts for Aug-Sep. LSTM model outperforms others with 96.2% accuracy.', severity: 'high' },")
a("  { title: 'Model Drift Detected', desc: 'ARIMA model accuracy dropped below 85% for Electronics in Metro Tier1. Recommend switching to Ensemble model.', severity: 'medium' },")
a("  { title: 'Festival Season Prep', desc: 'Diwali forecast signals +40% demand for Apparel and Home & Garden. Pre-position inventory in North & West India warehouses.', severity: 'high' },")
a("  { title: 'Bias Correction Needed', desc: 'Central India region shows consistent +12% bias across all models. Recalibration suggested to prevent overstocking.', severity: 'low' },")
a("]")

a("")
a("export default function AiDemandSensingProView() {")
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
a("  const filtered = forecasts.filter(f => {")
a("    for (const [key, vals] of Object.entries(activeFilters)) {")
a("      if (vals.length > 0 && !vals.includes(f[key as keyof typeof f] as string)) return false")
a("    }")
a("    return true")
a("  })")
a("")
a("  return (")
a("    <div className='ads-root space-y-4 p-4'>")
a("      <PageHeader title='AI Demand Sensing Pro' description='ML-powered demand forecasting & sensing engine' />")
a("")
a("      <Tabs value={tab} onValueChange={setTab}>")
a("        <TabsList className='ads-tabs-list bg-zinc-900 border border-zinc-800'>")
a("          <TabsTrigger value='dashboard' className='ads-tab'>Dashboard</TabsTrigger>")
a("          <TabsTrigger value='forecasts' className='ads-tab'>Forecasts</TabsTrigger>")
a("          <TabsTrigger value='analytics' className='ads-tab'>Analytics</TabsTrigger>")
a("          <TabsTrigger value='insights' className='ads-tab'>Insights</TabsTrigger>")
a("        </TabsList>")
a("")
a("        <TabsContent value='dashboard' className='ads-tab-content space-y-4 mt-4'>")
a("          <div className='ads-kpi-row grid grid-cols-2 lg:grid-cols-4 gap-3'>")
a("            <KpiTile label='Active Forecasts' value='2,847' sub='+12% vs last month' color='text-violet-400' />")
a("            <KpiTile label='Avg Accuracy' value='91.3%' sub='+2.1pp improvement' color='text-blue-400' />")
a("            <KpiTile label='Models Deployed' value='6' sub='All active in production' color='text-emerald-400' />")
a("            <KpiTile label='Demand Signals' value='156' sub='38 bullish, 52 bearish' color='text-amber-400' />")
a("          </div>")
a("          <div className='ads-ring-row flex flex-wrap justify-around gap-2'>")
a("            <HealthRing value={91} label='Accuracy' color='#8b5cf6' />")
a("            <HealthRing value={87} label='Coverage' color='#3b82f6' />")
a("            <HealthRing value={94} label='Timeliness' color='#10b981' />")
a("            <HealthRing value={78} label='Confidence' color='#f59e0b' />")
a("            <HealthRing value={89} label='Freshness' color='#06b6d4' />")
a("            <HealthRing value={85} label='Stability' color='#ec4899' />")
a("          </div>")
a("          <div className='ads-chart-row grid grid-cols-1 lg:grid-cols-3 gap-4'>")
a("            <Card className='ads-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Forecast vs Actual</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='month' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Line type='monotone' dataKey='forecast' stroke='#8b5cf6' strokeWidth={2} dot={false}/><Line type='monotone' dataKey='actual' stroke='#3b82f6' strokeWidth={2} dot={false}/></LineChart></CardContent></Card>")
a("            <Card className='ads-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Model Accuracy Trend</CardTitle></CardHeader><CardContent><BarChart data={monthlyData} width={350} height={200}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='month' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Bar dataKey='accuracy' fill='#10b981' radius={[4,4,0,0]}/></BarChart></CardContent></Card>")
a("            <Card className='ads-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Category Distribution</CardTitle></CardHeader><CardContent><PieChart width={350} height={200}><Pie data={categoryDist} cx='50%' cy='50%' outerRadius={70} innerRadius={35} dataKey='value' paddingAngle={2}>{categoryDist.map((_, i) => <Cell key={i} fill={COLORS[i % 8]} />)}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>")
a("          </div>")
a("        </TabsContent>")
a("")
a("        <TabsContent value='forecasts' className='ads-tab-content space-y-4 mt-4'>")
a("          <ModuleBreadcrumb items={[{ label: 'Demand Sensing' }, { label: 'Forecasts' }]} />")
a("          <SearchFilterToolbar filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} />")
a("          <Card className='ads-table-card bg-zinc-900/60 border-zinc-800'><CardContent className='p-0'><div className='ads-table-wrap overflow-x-auto'><table className='ads-table w-full text-sm'><thead><tr className='border-b border-zinc-800'><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>ID</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>SKU</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Category</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Region</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Model</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Horizon</th><th className='text-right px-3 py-2 text-zinc-500 text-xs font-medium'>Predicted</th><th className='text-right px-3 py-2 text-zinc-500 text-xs font-medium'>Actual</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>MAPE</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Accuracy</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Signal</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium'>Status</th></tr></thead><tbody>")
a("          {filtered.map(f => (")
a("            <tr key={f.id} className='ads-table-row border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors'>")
a("              <td className='px-3 py-2 font-mono text-xs text-violet-400'>{f.id}</td>")
a("              <td className='px-3 py-2 font-mono text-xs'>{f.sku}</td>")
a("              <td className='px-3 py-2'><span className='ads-cat-badge px-1.5 py-0.5 rounded text-xs bg-violet-500/10 text-violet-300'>{f.category}</span></td>")
a("              <td className='px-3 py-2 text-xs text-zinc-300'>{f.region}</td>")
a("              <td className='px-3 py-2 text-xs text-blue-300'>{f.model}</td>")
a("              <td className='px-3 py-2 text-xs text-zinc-400'>{f.horizon}</td>")
a("              <td className='px-3 py-2 text-right text-xs font-medium'>{f.predicted}</td>")
a("              <td className='px-3 py-2 text-right text-xs font-medium'>{f.actual}</td>")
a("              <td className='px-3 py-2 w-24'><MapeBar value={f.mape} /><span className='text-[10px] text-zinc-500 ml-1'>{f.mape}%</span></td>")
a("              <td className='px-3 py-2'><AccuracyBadge accuracy={f.accuracy} /></td>")
a("              <td className='px-3 py-2'><SignalBadge signal={f.signal} /></td>")
a("              <td className='px-3 py-2'><StatusBadge status={f.status} /></td>")
a("            </tr>")
a("          ))}")
a("          </tbody></table></div></CardContent></Card>")
a("        </TabsContent>")
a("")
a("        <TabsContent value='analytics' className='ads-tab-content space-y-4 mt-4'>")
a("          <div className='ads-value-row grid grid-cols-2 lg:grid-cols-4 gap-3'>")
a("            <ValueTile label='Total Forecasts' value='2,847' change='+18% YoY' />")
a("            <ValueTile label='Avg MAPE' value='8.7%' change='-1.2pp' />")
a("            <ValueTile label='Best Model' value='LSTM' change='96.2% acc' />")
a("            <ValueTile label='Signal Coverage' value='78%' change='+5% QoQ' />")
a("          </div>")
a("          <div className='ads-analytics-charts grid grid-cols-1 lg:grid-cols-2 gap-4'>")

# Generate model perf data as literal
model_perf = []
for m in MODELS_PY:
    model_perf.append(f"  {{ name: '{m}', accuracy: {random.randint(78, 97)}, mape: {random.randint(3, 22)} }}")

a("            <Card className='ads-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Model Performance</CardTitle></CardHeader><CardContent><BarChart data={[{ model_perf_str }]} width={450} height={220}>".replace("{ model_perf_str }", ", ".join(model_perf)) + "<CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='name' tick={{ fontSize: 10 }} stroke='#71717a'/><YAxis tick={{ fontSize: 10 }} stroke='#71717a'/><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/><Bar dataKey='accuracy' fill='#8b5cf6' radius={[4,4,0,0]}/><Bar dataKey='mape' fill='#f59e0b' radius={[4,4,0,0]}/></BarChart></CardContent></Card>")

a("            <Card className='ads-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Confidence Distribution</CardTitle></CardHeader><CardContent><PieChart width={450} height={220}><Pie data={[{ name: 'High (>90%)', value: 38 }, { name: 'Medium (70-90%)', value: 42 }, { name: 'Low (<70%)', value: 20 }]} cx='50%' cy='50%' outerRadius={80} innerRadius={40} dataKey='value' paddingAngle={3}>{[<Cell key={0} fill='#8b5cf6' />, <Cell key={1} fill='#3b82f6' />, <Cell key={2} fill='#f59e0b' />]}</Pie><Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}/><Legend iconSize={8} wrapperStyle={{ fontSize: 10 }}/></PieChart></CardContent></Card>")
a("          </div>")
a("        </TabsContent>")
a("")
a("        <TabsContent value='insights' className='ads-tab-content space-y-4 mt-4'>")
a("          {insights.map((ins, i) => (")
a("            <Card key={i} className={'ads-insight-card bg-zinc-900/60 border ' + (ins.severity === 'high' ? 'border-violet-500/30' : ins.severity === 'medium' ? 'border-amber-500/30' : 'border-zinc-800')}><CardContent className='p-4'><div className='flex items-start gap-3'><div className={'ads-insight-dot w-2 h-2 rounded-full mt-1.5 shrink-0 ' + (ins.severity === 'high' ? 'bg-violet-500' : ins.severity === 'medium' ? 'bg-amber-500' : 'bg-zinc-500')} /><div><p className='text-sm font-medium text-zinc-200'>{ins.title}</p><p className='text-xs text-zinc-400 mt-1 leading-relaxed'>{ins.desc}</p></div></div></CardContent></Card>")
a("          ))}")
a("        </TabsContent>")
a("      </Tabs>")
a("    </div>")
a("  )")
a("}")
a("")

with open('/home/z/my-project/src/components/modules/ai-demand-sensing-pro-view.tsx', 'w') as f:
    f.write('\n'.join(lines))

print(f"Generated ai-demand-sensing-pro-view.tsx: {len(lines)} lines")
