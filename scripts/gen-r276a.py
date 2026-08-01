#!/usr/bin/env python3
"""Generate Customs Duty Command module (R276a)."""
import json, random, hashlib
random.seed(2761)

ID_PRE = "CDC"
CSS_PRE = "cdc"
PRIMARY = "#eab308"  # Yellow
SECONDARY = "#f59e0b"  # Amber

CATEGORIES = [
    "Electronics","Textiles","Auto Parts","Pharmaceuticals",
    "Agricultural","Machinery","Chemical Products","Gemstones"
]
PORTS = [
    "Nhava Sheva JNPT","Chennai Port","Kandla Port","Kolkata Haldia",
    "Mundra Port","Cochin Port","Vizag Port","Tuticorin Port"
]
DUTY_TYPES = [
    "Basic Customs","IGST","Social Welfare","Compensation Cess",
    "Anti-Dumping","Safeguard Duty","Countervailing"
]
STATUSES = ["Pending","Under Review","Assessed","Paid","Dispute"]
SEVERITIES = ["high","medium","low"]

# --- Generate 60 records ---
def ri(lo, hi, decimals=1):
    if decimals == 0:
        return random.randint(lo, hi)
    return round(random.uniform(lo, hi), decimals)

records = []
for i in range(1, 61):
    records.append({
        "id": f"{ID_PRE}-{i:04d}",
        "category": random.choice(CATEGORIES),
        "port": random.choice(PORTS),
        "duty_type": random.choice(DUTY_TYPES),
        "status": random.choice(STATUSES),
        "duty_inr": ri(15000, 9800000, 0),
        "gst_inr": ri(5000, 3200000, 0),
        "clearance_hrs": ri(2, 72, 1),
        "risk_score": ri(1, 100, 0),
        "docs_complete": random.choice(["Yes","No","Partial"]),
        "filing_date": f"2026-07-{ri(1,28,0):02d} {ri(0,23,0):02d}:{ri(0,59,0):02d}",
    })

# --- Chart data ---
hourly = []
for h in range(24):
    hourly.append({
        "hour": f"{h:02d}:00",
        "filings": ri(8, 85, 0),
        "clearances": ri(5, 65, 0),
        "revenue_lakh": ri(1, 18, 1),
    })

cat_dist = []
for c in CATEGORIES:
    cat_dist.append({"name": c, "value": ri(45, 340, 0)})

# --- Insights ---
insights_data = [
    {
        "title": "Nhava Sheva JNPT Clearing Backlog",
        "desc": "Over 340 shipments pending customs assessment at JNPT due to monsoon-related container scanning equipment downtime. Average clearance time increased from 18 to 42 hours. Recommend deploying mobile X-ray units and activating emergency clearance protocols for perishable consignments. Revenue impact estimated at INR 2.4 Cr per day.",
        "severity": "high",
    },
    {
        "title": "Anti-Dumping Duty Reclassification Alert",
        "desc": "DGFT issued Notification 47/2026 reclassifying 18 HS codes under anti-dumping scope. Affected shipments from 4 SEZ units require reassessment. Automated duty calculator flagged 23 entries with potential INR 8.7L under-assessment. Compliance team notified for batch re-filing within 72-hour window.",
        "severity": "medium",
    },
    {
        "title": "Kandla Port E-Way Bill Integration",
        "desc": "ICEGATE integration with GST e-Way Bill system achieved 94% auto-reconciliation for Kandla-based imports. Manual verification reduced by 67%. Average GST clearance time improved from 6.2 to 1.8 hours. Rollout planned for Mundra and Cochin by August 2026. Estimated annual savings: INR 3.2 Cr in broker fees.",
        "severity": "low",
    },
    {
        "title": "AI Risk Scoring Model v3 Deployment",
        "desc": "Enhanced risk scoring model using shipment history, importer profile analytics, and real-time exchange rate volatility. Detection rate for duty evasion improved from 72% to 89%. False positive rate reduced to 8%. Integrated with ICEGATE for real-time risk classification on all Bill of Entry filings across 8 major ports.",
        "severity": "high",
    },
]

# --- Format records as JS ---
def fmt_rec(r):
    return json.dumps(r, separators=(",", ":"))

rec_lines = []
for r in records:
    rec_lines.append("  " + json.dumps(r, separators=(",", ":")))

# --- Build TSX ---
lines = []
lines.append("import React, { useState } from 'react'")
lines.append("import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'")
lines.append("import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'")
lines.append("import { PageHeader } from '@/components/shared/page-header'")
lines.append("import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'")
lines.append("import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'")
lines.append("import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'")
lines.append("")
lines.append("const COLORS = ['#eab308', '#f59e0b', '#84cc16', '#06b6d4', '#6366f1', '#ec4899', '#10b981', '#ef4444']")
lines.append("")
lines.append(f"const CATEGORIES = {json.dumps(CATEGORIES, separators=(',', ': '))}")
lines.append(f"const PORTS = {json.dumps(PORTS, separators=(',', ': '))}")
lines.append(f"const DUTY_TYPES = {json.dumps(DUTY_TYPES, separators=(',', ': '))}")
lines.append(f"const STATUSES = {json.dumps(STATUSES, separators=(',', ': '))}")
lines.append("")
lines.append("const shipments = [")
lines.extend(rec_lines)
lines.append("]")
lines.append("")

# Hourly chart data
lines.append("const hourlyData = [")
for h in hourly:
    lines.append("  " + json.dumps(h, separators=(",", ":")))
lines.append("]")
lines.append("")

# Category distribution
lines.append("const catDist = [")
for c in cat_dist:
    lines.append("  " + json.dumps(c, separators=(",", ":")))
lines.append("]")
lines.append("")

# Filter groups
lines.append("const filterGroups = [")
lines.append("  { key: 'category', label: 'Category', options: CATEGORIES.map(c => ({ value: c, label: c, count: 0 })) },")
lines.append("  { key: 'duty_type', label: 'Duty Type', options: DUTY_TYPES.map(d => ({ value: d, label: d, count: 0 })) },")
lines.append("  { key: 'status', label: 'Status', options: STATUSES.map(s => ({ value: s, label: s, count: 0 })) },")
lines.append("]")
lines.append("")

# --- Components ---
lines.append(f"function CategoryBadge({{ category }}: {{ category: string }}) {{")
cat_colors = "bg-yellow-500/15 text-yellow-400"
cat_map = {}
cat_colors_list = [
    "bg-yellow-500/15 text-yellow-400",
    "bg-emerald-500/15 text-emerald-400",
    "bg-sky-500/15 text-sky-400",
    "bg-rose-500/15 text-rose-400",
    "bg-lime-500/15 text-lime-400",
    "bg-orange-500/15 text-orange-400",
    "bg-purple-500/15 text-purple-400",
    "bg-cyan-500/15 text-cyan-400",
]
cond_parts = []
for ci, cat in enumerate(CATEGORIES):
    cond_parts.append(f"category === '{cat}' ? '{cat_colors_list[ci]}'")
cond_parts.append("'bg-amber-500/15 text-amber-400'")
cond_str = " : ".join(cond_parts)
lines.append(f"  const color = {cond_str}")
lines.append(f"  return <span className={{'{CSS_PRE}-cat-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}}>{{category}}</span>")
lines.append("}")
lines.append("")

lines.append(f"function PortBadge({{ port }}: {{ port: string }}) {{")
port_map = {}
port_colors_list = [
    "bg-blue-500/15 text-blue-400",
    "bg-red-500/15 text-red-400",
    "bg-amber-500/15 text-amber-400",
    "bg-emerald-500/15 text-emerald-400",
    "bg-sky-500/15 text-sky-400",
    "bg-teal-500/15 text-teal-400",
    "bg-violet-500/15 text-violet-400",
    "bg-orange-500/15 text-orange-400",
]
port_conds = []
for pi, port in enumerate(PORTS):
    port_conds.append(f"port === '{port}' ? '{port_colors_list[pi]}'")
port_conds.append("'bg-zinc-500/15 text-zinc-400'")
lines.append(f"  const color = {' : '.join(port_conds)}")
lines.append(f"  return <span className={{'{CSS_PRE}-port-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}}>{{port}}</span>")
lines.append("}")
lines.append("")

lines.append(f"function StatusBadge({{ status }}: {{ status: string }}) {{")
status_colors = {"Pending": "bg-amber-500/15 text-amber-400", "Under Review": "bg-blue-500/15 text-blue-400", "Assessed": "bg-violet-500/15 text-violet-400", "Paid": "bg-emerald-500/15 text-emerald-400", "Dispute": "bg-red-500/15 text-red-400"}
status_conds = []
for s, c in status_colors.items():
    status_conds.append(f"status === '{s}' ? '{c}'")
status_conds.append("'bg-zinc-500/15 text-zinc-400'")
lines.append(f"  const color = {' : '.join(status_conds)}")
lines.append(f"  return <span className={{'{CSS_PRE}-status-badge px-2 py-0.5 rounded-full text-xs font-medium ' + color}}>{{status}}</span>")
lines.append("}")
lines.append("")

# DutyBar (duty amount as bar)
lines.append(f"function DutyBar({{ value, max }}: {{ value: number; max: number }}) {{")
lines.append(f"  const w = Math.min((value / max) * 100, 100)")
lines.append(f"  const color = w >= 80 ? 'bg-yellow-500' : w >= 50 ? 'bg-amber-500' : 'bg-emerald-500'")
lines.append(f"  return <div className='{CSS_PRE}-duty-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className={{'h-full rounded-full {CSS_PRE}-duty-fill ' + color}} style={{{{ width: w + '%', animation: '{CSS_PRE}-grow 1s ease-out' }}}}/></div>")
lines.append("}")
lines.append("")

# RiskBar
lines.append(f"function RiskBar({{ value }}: {{ value: number }}) {{")
lines.append(f"  const color = value >= 70 ? 'bg-red-500' : value >= 40 ? 'bg-amber-500' : 'bg-emerald-500'")
lines.append(f"  return <div className='{CSS_PRE}-risk-bar w-full h-2 bg-zinc-800 rounded-full overflow-hidden'><div className={{'h-full rounded-full {CSS_PRE}-risk-fill ' + color}} style={{{{ width: value + '%', animation: '{CSS_PRE}-grow 1s ease-out' }}}}/></div>")
lines.append("}")
lines.append("")

# HealthRing
lines.append(f"function HealthRing({{ value, label, color }}: {{ value: number; label: string; color: string }}) {{")
lines.append(f"  const r = 28, c = 2 * Math.PI * r, offset = c - (value / 100) * c")
lines.append(f"  return <div className='{CSS_PRE}-ring flex flex-col items-center'><svg width='70' height='70' className='-rotate-90'><circle cx='35' cy='35' r={{r}} fill='none' stroke='#27272a' strokeWidth='5'/><circle cx='35' cy='35' r={{r}} fill='none' stroke={{color}} strokeWidth='5' strokeDasharray={{c}} strokeDashoffset={{offset}} strokeLinecap='round' className='{CSS_PRE}-ring-path' style={{{{ transition: 'stroke-dashoffset 1s ease' }}}/></svg><span className='{CSS_PRE}-ring-val text-sm font-bold mt-1' style={{{{ color }}}}>{{value}}%</span><span className='{CSS_PRE}-ring-label text-[10px] text-zinc-500'>{{label}}</span></div>")
lines.append("}")
lines.append("")

# KpiTile
lines.append(f"function KpiTile({{ label, value, sub, color }}: {{ label: string; value: string; sub: string; color: string }}) {{")
lines.append(f"  return <div className='{CSS_PRE}-kpi bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 {CSS_PRE}-kpi-card'><p className='text-xs text-zinc-500 mb-1'>{{label}}</p><p className={{'text-xl font-bold ' + color}}>{{value}}</p><p className='text-[10px] text-zinc-400 mt-1'>{{sub}}</p></div>")
lines.append("}")
lines.append("")

# ValueTile
lines.append(f"function ValueTile({{ label, value, change }}: {{ label: string; value: string; change: string }}) {{")
lines.append(f"  const up = change.startsWith('+')")
lines.append(f"  return <div className='{CSS_PRE}-value-tile bg-zinc-900/60 border border-zinc-800 rounded-lg p-3'><p className='text-xs text-zinc-500'>{{label}}</p><p className='text-lg font-bold text-white mt-1'>{{value}}</p><p className={{'text-xs mt-1 ' + (up ? 'text-emerald-400' : 'text-red-400')}}>{{change}}</p></div>")
lines.append("}")
lines.append("")

# Insights
lines.append("const insights = [")
for ins in insights_data:
    lines.append("  " + json.dumps(ins, separators=(",", ":")))
lines.append("]")
lines.append("")

# --- Main Component ---
lines.append(f"export default function CustomsDutyCommandView() {{")
lines.append(f"  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({{}})")
lines.append(f"  const [searchQuery, setSearchQuery] = useState('')")
lines.append(f"  const [tab, setTab] = useState('dashboard')")
lines.append("")
lines.append(f"  const toggleFilter = (key: string, val: string) => {{")
lines.append(f"    setActiveFilters(prev => {{ const cur = prev[key] || []; const next = cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val]; return {{ ...prev, [key]: next }} }})")
lines.append(f"  }}")
lines.append("")
lines.append(f"  const filtered = shipments.filter(s => {{")
lines.append(f"    for (const [key, vals] of Object.entries(activeFilters)) {{ if (vals.length > 0 && !vals.includes(s[key as keyof typeof s] as string)) return false }}")
lines.append(f"    if (searchQuery && !Object.values(s).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))) return false")
lines.append(f"    return true")
lines.append(f"  }})")
lines.append("")
lines.append(f"  return (")
lines.append(f"    <div className='{CSS_PRE}-root space-y-4 p-4'>")
lines.append(f"      <PageHeader title='Customs Duty Command' description='Import duty assessment, compliance tracking & risk scoring across Indian ports' />")
lines.append(f"      <Tabs value={{tab}} onValueChange={{setTab}}>")
lines.append(f"        <TabsList className='{CSS_PRE}-tabs-list bg-zinc-900 border border-zinc-800'>")
lines.append(f"          <TabsTrigger value='dashboard' className='{CSS_PRE}-tab'>Dashboard</TabsTrigger>")
lines.append(f"          <TabsTrigger value='shipments' className='{CSS_PRE}-tab'>Shipments</TabsTrigger>")
lines.append(f"          <TabsTrigger value='analytics' className='{CSS_PRE}-tab'>Analytics</TabsTrigger>")
lines.append(f"          <TabsTrigger value='insights' className='{CSS_PRE}-tab'>Insights</TabsTrigger>")
lines.append(f"        </TabsList>")

# Tab 0: Dashboard
lines.append(f"        <TabsContent value='dashboard' className='{CSS_PRE}-tab-content space-y-4 mt-4'>")
lines.append(f"          <div className='{CSS_PRE}-kpi-row grid grid-cols-2 lg:grid-cols-4 gap-3'>")
lines.append(f"            <KpiTile label='Pending Filings' value='1,247' sub='+89 today' color='text-yellow-400' />")
lines.append(f"            <KpiTile label='Avg Clearance' value='24.6 hrs' sub='-3.2 hrs improved' color='text-amber-400' />")
lines.append(f"            <KpiTile label='Duty Collected' value='INR 18.4 Cr' sub='+INR 2.1 Cr WoW' color='text-emerald-400' />")
lines.append(f"            <KpiTile label='Risk Score Avg' value='34.2' sub='-5.1 improved' color='text-cyan-400' />")
lines.append(f"          </div>")
lines.append(f"          <div className='{CSS_PRE}-ring-row flex flex-wrap justify-around gap-2'>")
lines.append(f"            <HealthRing value={92} label='Compliance' color='#eab308' />")
lines.append(f"            <HealthRing value={86} label='Auto Clear' color='#f59e0b' />")
lines.append(f"            <HealthRing value={78} label='Doc Complete' color='#84cc16' />")
lines.append(f"            <HealthRing value={91} label='e-Way Match' color='#06b6d4' />")
lines.append(f"            <HealthRing value={84} label='IGST Reconcile' color='#6366f1' />")
lines.append(f"            <HealthRing value={96} label='Audit Ready' color='#ec4899' />")
lines.append(f"          </div>")
lines.append(f"          <div className='{CSS_PRE}-chart-row grid grid-cols-1 lg:grid-cols-3 gap-4'>")
lines.append(f"            <Card className='{CSS_PRE}-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>24hr Filings/Clearances</CardTitle></CardHeader><CardContent><LineChart data={{hourlyData}} width={{350}} height={{200}}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='hour' tick={{{{ fontSize: 10 }}}} stroke='#71717a'/><YAxis tick={{{{ fontSize: 10 }}}} stroke='#71717a'/><Tooltip contentStyle={{{{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}}}/><Legend iconSize={{8}} wrapperStyle={{{{ fontSize: 10 }}}}/><Line type='monotone' dataKey='filings' stroke='#eab308' strokeWidth={{2}} dot={{false}}/><Line type='monotone' dataKey='clearances' stroke='#f59e0b' strokeWidth={{2}} dot={{false}}/></LineChart></CardContent></Card>")
lines.append(f"            <Card className='{CSS_PRE}-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Hourly Revenue (Lakh INR)</CardTitle></CardHeader><CardContent><BarChart data={{hourlyData}} width={{350}} height={{200}}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='hour' tick={{{{ fontSize: 10 }}}} stroke='#71717a'/><YAxis tick={{{{ fontSize: 10 }}}} stroke='#71717a'/><Tooltip contentStyle={{{{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}}}/><Bar dataKey='revenue_lakh' fill='#84cc16' radius={{{[4,4,0,0]}}}/></BarChart></CardContent></Card>")
lines.append(f"            <Card className='{CSS_PRE}-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Category Mix</CardTitle></CardHeader><CardContent><PieChart width={{350}} height={{200}}><Pie data={{catDist}} cx='50%' cy='50%' outerRadius={{70}} innerRadius={{35}} dataKey='value' paddingAngle={{2}}>{{catDist.map((_, i) => <Cell key={{i}} fill={{COLORS[i % 8]}} />)}}</Pie><Tooltip contentStyle={{{{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}}}/><Legend iconSize={{8}} wrapperStyle={{{{ fontSize: 10 }}}}/></PieChart></CardContent></Card>")
lines.append(f"          </div>")
lines.append(f"        </TabsContent>")

# Tab 1: Shipments table
lines.append(f"        <TabsContent value='shipments' className='{CSS_PRE}-tab-content space-y-4 mt-4'>")
lines.append(f"          <ModuleBreadcrumb items={{{[{{ label: 'Customs Command' }}, {{ label: 'Shipments' }}]}} />")
lines.append(f"          <SearchFilterToolbar searchQuery={{searchQuery}} onSearchChange={{setSearchQuery}} onClearSearch={{() => setSearchQuery('')}} activeFilters={{activeFilters}} filterGroups={{filterGroups}} onToggleFilter={{toggleFilter}} onClearAllFilters={{() => {{ setActiveFilters({{}}); setSearchQuery('') }}}} totalItems={{shipments.length}} filteredCount={{filtered.length}} onRefresh={{() => {{}}}} placeholder='Search shipments by ID, category, port...' />")
lines.append(f"          <Card className='{CSS_PRE}-table-card bg-zinc-900/60 border-zinc-800'><CardContent className='p-0'><div className='{CSS_PRE}-table-wrap overflow-x-auto max-h-[400px] overflow-y-auto'><table className='{CSS_PRE}-table w-full text-sm'><thead><tr className='border-b border-zinc-800'><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>ID</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Category</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Port</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Status</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Duty (INR)</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Risk</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Clearance</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>GST (INR)</th><th className='text-left px-3 py-2 text-zinc-500 text-xs font-medium sticky top-0 bg-zinc-900 z-10'>Duty Type</th></tr></thead><tbody>")
lines.append(f"          {{filtered.map(s => (")
lines.append(f"            <tr key={{s.id}} className='{CSS_PRE}-table-row border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors'>")
lines.append(f"              <td className='px-3 py-2 font-mono text-xs text-yellow-400'>{{s.id}}</td>")
lines.append(f"              <td className='px-3 py-2'><CategoryBadge category={{s.category}} /></td>")
lines.append(f"              <td className='px-3 py-2'><PortBadge port={{s.port}} /></td>")
lines.append(f"              <td className='px-3 py-2'><StatusBadge status={{s.status}} /></td>")
lines.append(f"              <td className='px-3 py-2 w-24'><DutyBar value={{s.duty_inr}} max={{9800000}} /><span className='text-[10px] text-zinc-500 ml-1'>{{(s.duty_inr / 100000).toFixed(1)}}L</span></td>")
lines.append(f"              <td className='px-3 py-2 w-20'><RiskBar value={{s.risk_score}} /><span className='text-[10px] text-zinc-500 ml-1'>{{s.risk_score}}</span></td>")
lines.append(f"              <td className='px-3 py-2 text-xs text-zinc-400'>{{s.clearance_hrs}}h</td>")
lines.append(f"              <td className='px-3 py-2 text-right text-xs'>{{(s.gst_inr / 1000).toFixed(0)}}K</td>")
lines.append(f"              <td className='px-3 py-2'><span className='text-[10px] text-zinc-400'>{{s.duty_type}}</span></td>")
lines.append(f"            </tr>")
lines.append(f"          ))}})")
lines.append(f"          </tbody></table></div></CardContent></Card>")
lines.append(f"        </TabsContent>")

# Tab 2: Analytics
lines.append(f"        <TabsContent value='analytics' className='{CSS_PRE}-tab-content space-y-4 mt-4'>")
lines.append(f"          <div className='{CSS_PRE}-value-row grid grid-cols-2 lg:grid-cols-4 gap-3'>")
lines.append(f"            <ValueTile label='Total Duty Collected' value='INR 184 Cr' change='+14% MoM' />")
lines.append(f"            <ValueTile label='Avg Processing Time' value='22.3 hrs' change='-8% faster' />")
lines.append(f"            <ValueTile label='Dispute Rate' value='3.2%' change='-0.8pp' />")
lines.append(f"            <ValueTile label='Exemption Claims' value='INR 12.7 Cr' change='+1 new' />")
lines.append(f"          </div>")
lines.append(f"          <div className='{CSS_PRE}-analytics-charts grid grid-cols-1 lg:grid-cols-2 gap-4'>")
# Port performance bar chart
lines.append(f"            <Card className='{CSS_PRE}-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Port Performance</CardTitle></CardHeader><CardContent><BarChart data={{PORTS.map((p,i) => ({{ name: p.split(' ')[0], clearance: [92,88,94,81,90,86,89,87][i], compliance: [98,95,99,93,97,94,96,95][i] }}))}} width={{450}} height={{220}}><CartesianGrid strokeDasharray='3 3' stroke='#27272a'/><XAxis dataKey='name' tick={{{{ fontSize: 10 }}}} stroke='#71717a'/><YAxis tick={{{{ fontSize: 10 }}}} stroke='#71717a'/><Tooltip contentStyle={{{{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}}}/><Legend iconSize={{8}} wrapperStyle={{{{ fontSize: 10 }}}}/><Bar dataKey='clearance' fill='#eab308' radius={{{[4,4,0,0]}}}/><Bar dataKey='compliance' fill='#f59e0b' radius={{{[4,4,0,0]}}}/></BarChart></CardContent></Card>")
# Duty type pie chart
lines.append(f"            <Card className='{CSS_PRE}-chart-card bg-zinc-900/60 border-zinc-800'><CardHeader className='pb-2'><CardTitle className='text-sm text-zinc-300'>Duty Type Distribution</CardTitle></CardHeader><CardContent><PieChart width={{450}} height={{220}}><Pie data={{{[{{ name: 'Basic Customs', value: 35 }}, {{ name: 'IGST', value: 28 }}, {{ name: 'Social Welfare', value: 15 }}, {{ name: 'Comp Cess', value: 10 }}, {{ name: 'Anti-Dumping', value: 8 }}, {{ name: 'Safeguard', value: 4 }}]}} cx='50%' cy='50%' outerRadius={{80}} innerRadius={{40}} dataKey='value' paddingAngle={{3}}>{{[<Cell key={{0}} fill='#eab308' />, <Cell key={{1}} fill='#f59e0b' />, <Cell key={{2}} fill='#84cc16' />, <Cell key={{3}} fill='#06b6d4' />, <Cell key={{4}} fill='#6366f1' />, <Cell key={{5}} fill='#ec4899' />]}}</Pie><Tooltip contentStyle={{{{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 11 }}}}/><Legend iconSize={{8}} wrapperStyle={{{{ fontSize: 10 }}}}/></PieChart></CardContent></Card>")
lines.append(f"          </div>")
lines.append(f"        </TabsContent>")

# Tab 3: Insights
lines.append(f"        <TabsContent value='insights' className='{CSS_PRE}-tab-content space-y-4 mt-4'>")
lines.append(f"          {{insights.map((ins, i) => (")
lines.append(f"            <Card key={{i}} className={{'{CSS_PRE}-insight-card bg-zinc-900/60 border ' + (ins.severity === 'high' ? 'border-yellow-500/30' : ins.severity === 'medium' ? 'border-amber-500/30' : 'border-zinc-800')}}><CardContent className='p-4'><div className='flex items-start gap-3'><div className={{'{CSS_PRE}-insight-dot w-2 h-2 rounded-full mt-1.5 shrink-0 ' + (ins.severity === 'high' ? 'bg-yellow-500' : ins.severity === 'medium' ? 'bg-amber-500' : 'bg-zinc-500')}} /><div><p className='text-sm font-medium text-zinc-200'>{{ins.title}}</p><p className='text-xs text-zinc-400 mt-1 leading-relaxed'>{{ins.desc}}</p></div></div></CardContent></Card>")
lines.append(f"          ))}})")
lines.append(f"        </TabsContent>")

lines.append(f"      </Tabs>")
lines.append(f"    </div>")
lines.append(f"  )")
lines.append(f"}}")
lines.append("")

tsx_content = "\n".join(lines)

outpath = "/home/z/my-project/src/components/modules/customs-duty-command-view.tsx"
with open(outpath, "w") as f:
    f.write(txx_content)

line_count = len(lines)
print(f"Generated {outpath}: {line_count} lines")
