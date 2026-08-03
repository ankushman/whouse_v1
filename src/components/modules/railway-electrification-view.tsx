'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface RWERecord {
  id: string; projectId: string; zone: string; section: string; contractor: string; system: string
  routeKm: number; tractionMW: number; investmentCr: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#0369a1', '#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd', '#e0f2fe', '#f0f9ff']

const records: RWERecord[] = [
  { id: 'RWE-001', projectId: 'RWE-001', zone: 'Northern', section: 'Delhi-Ambala Cantt', contractor: 'L&T Construction', system: '25kV AC Overhead',
    routeKm: 350, tractionMW: 120, investmentCr: 2100, status: 'Delivered', priority: 'High', origin: 'New Delhi', destination: 'Ambala Cantt', shipDate: '2024-03-15', transitDays: 45, state: 'Delhi',
    remarks: 'Core NCR electrification under Mission 100%, OHE spanning 350 km with 14 traction substations and SCADA integration across Delhi-Haryana belt' },
  { id: 'RWE-002', projectId: 'RWE-002', zone: 'Northern', section: 'Delhi-Chandigarh', contractor: 'KEC International', system: '2x25kV Auto Transformer',
    routeKm: 280, tractionMW: 95, investmentCr: 1800, status: 'Delivered', priority: 'Medium', origin: 'New Delhi', destination: 'Chandigarh', shipDate: '2024-02-10', transitDays: 38, state: 'Punjab',
    remarks: 'Auto-transformer system for high-speed corridor, 2x25kV configuration reduces transmission losses by 35% on Northern Railway mainline' },
  { id: 'RWE-003', projectId: 'RWE-003', zone: 'Southern', section: 'Chennai-Madurai', contractor: 'Kalpataru Power', system: '25kV Regenerative',
    routeKm: 450, tractionMW: 160, investmentCr: 3200, status: 'Delivered', priority: 'High', origin: 'Chennai Egmore', destination: 'Madurai Jn', shipDate: '2024-01-20', transitDays: 55, state: 'Tamil Nadu',
    remarks: 'Regenerative braking enabled section saving 18% energy, 12 substations with SCADA control covering Tamil Nadu core corridor' },
  { id: 'RWE-004', projectId: 'RWE-004', zone: 'Southern', section: 'Bengaluru-Mysuru', contractor: 'Afcons Infrastructure', system: '25kV Smart Grid',
    routeKm: 150, tractionMW: 55, investmentCr: 1200, status: 'In Transit', priority: 'Medium', origin: 'KSR Bengaluru', destination: 'Mysuru Jn', shipDate: '2024-06-01', transitDays: 30, state: 'Karnataka',
    remarks: 'Smart grid integration with AI-based load management, pilot project for future South Western Railway routes' },
  { id: 'RWE-005', projectId: 'RWE-005', zone: 'Eastern', section: 'Howrah-Dhanbad', contractor: 'IRCON International', system: '25kV AC Overhead',
    routeKm: 400, tractionMW: 140, investmentCr: 2800, status: 'Delivered', priority: 'Critical', origin: 'Howrah Jn', destination: 'Dhanbad Jn', shipDate: '2023-11-05', transitDays: 60, state: 'West Bengal',
    remarks: 'Critical coal corridor electrification enabling heavier freight loads, 200+ freight trains daily on Eastern Railway section' },
  { id: 'RWE-006', projectId: 'RWE-006', zone: 'Eastern', section: 'Guwahati-Lumding', contractor: 'Siemens Mobility', system: '2x25kV Auto Transformer',
    routeKm: 320, tractionMW: 110, investmentCr: 2400, status: 'In Transit', priority: 'Medium', origin: 'Guwahati', destination: 'Lumding Jn', shipDate: '2024-05-10', transitDays: 52, state: 'Assam',
    remarks: 'Challenging terrain electrification in NE region, specialized foundations for landslide-prone areas with seismic reinforcement' },
  { id: 'RWE-007', projectId: 'RWE-007', zone: 'Western', section: 'Mumbai-Ahmedabad', contractor: 'Alstom Transport', system: '25kV with Energy Storage',
    routeKm: 500, tractionMW: 180, investmentCr: 3500, status: 'Delivered', priority: 'Critical', origin: 'Mumbai Central', destination: 'Ahmedabad Jn', shipDate: '2023-09-15', transitDays: 48, state: 'Gujarat',
    remarks: 'Energy storage integration for peak load management, first-of-its-kind battery-backed OHE in Indian Railways' },
  { id: 'RWE-008', projectId: 'RWE-008', zone: 'Western', section: 'Vadodara-Rajkot', contractor: 'L&T Construction', system: '25kV Regenerative',
    routeKm: 250, tractionMW: 85, investmentCr: 1600, status: 'Delivered', priority: 'Medium', origin: 'Vadodara Jn', destination: 'Rajkot Jn', shipDate: '2024-01-05', transitDays: 35, state: 'Gujarat',
    remarks: 'Regenerative system on Western Railway freight corridor, 25% energy savings documented over 6 months' },
  { id: 'RWE-009', projectId: 'RWE-009', zone: 'Central', section: 'Prayagraj-Jabalpur', contractor: 'Titagarh Rail Systems', system: '25kV AC Overhead',
    routeKm: 380, tractionMW: 130, investmentCr: 2600, status: 'In Transit', priority: 'High', origin: 'Prayagraj Jn', destination: 'Jabalpur Jn', shipDate: '2024-04-20', transitDays: 42, state: 'MP',
    remarks: 'East-Central connectivity electrification, critical for coal and mineral freight movement via NCR to MP corridor' },
  { id: 'RWE-010', projectId: 'RWE-010', zone: 'Central', section: 'Nagpur-Secunderabad', contractor: 'KEC International', system: '2x25kV Auto Transformer',
    routeKm: 420, tractionMW: 150, investmentCr: 3000, status: 'Delivered', priority: 'High', origin: 'Nagpur Jn', destination: 'Secunderabad Jn', shipDate: '2023-12-10', transitDays: 50, state: 'Telangana',
    remarks: 'Auto-transformer on high-traffic South Central route, handles 300+ trains per day with minimal voltage drop' },
  { id: 'RWE-011', projectId: 'RWE-011', zone: 'NE', section: 'Katihar-Guwahati', contractor: 'Texmaco Rail', system: '1500V DC Overhead',
    routeKm: 200, tractionMW: 50, investmentCr: 800, status: 'Processing', priority: 'Medium', origin: 'Katihar Jn', destination: 'Guwahati', shipDate: '2024-07-01', transitDays: 65, state: 'Bihar',
    remarks: 'Legacy 1500V DC to 25kV AC conversion, last DC section in NE frontier region with heritage bridge crossings' },
  { id: 'RWE-012', projectId: 'RWE-012', zone: 'NFR', section: 'New Jalpaiguri-Siliguri', contractor: 'Siemens Mobility', system: '25kV Smart Grid',
    routeKm: 280, tractionMW: 95, investmentCr: 1900, status: 'In Transit', priority: 'Medium', origin: 'New Jalpaiguri', destination: 'Siliguri Jn', shipDate: '2024-05-25', transitDays: 40, state: 'West Bengal',
    remarks: 'Smart grid pilot with real-time OHE health monitoring via 500+ IoT sensors across NFR tea garden belt' },
  { id: 'RWE-013', projectId: 'RWE-013', zone: 'SR', section: 'Trivandrum-Ernakulam', contractor: 'Kalpataru Power', system: '25kV Regenerative',
    routeKm: 350, tractionMW: 120, investmentCr: 2200, status: 'Processing', priority: 'High', origin: 'Trivandrum Ctrl', destination: 'Ernakulam Jn', shipDate: '2024-02-20', transitDays: 32, state: 'Kerala',
    remarks: 'Regenerative system on Kerala&apos;s busiest corridor, solar-powered substations planned at 8 locations by 2025' },
  { id: 'RWE-014', projectId: 'RWE-014', zone: 'WR', section: 'Ratlam-Ajmer', contractor: 'IRCON International', system: '25kV AC Overhead',
    routeKm: 300, tractionMW: 105, investmentCr: 2000, status: 'Delayed', priority: 'Medium', origin: 'Ratlam Jn', destination: 'Ajmer Jn', shipDate: '2024-04-01', transitDays: 55, state: 'Rajasthan',
    remarks: 'Delayed due to land acquisition issues in 3 sections pending forest and wildlife clearance near Kumbhalgarh' },
]

export default function RailwayElectrificationView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const toggleFilter = (group: string, value: string) => {
    setActiveFilters(prev => {
      const arr = prev[group] || []
      const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]
      if (!next.length) { const { [group]: _, ...rest } = prev; return rest }
      return { ...prev, [group]: next }
    })
  }

  const filtered = useMemo(() => {
    let result = records
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(q)))
    }
    result = result.filter(r =>
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof RWERecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'system', label: 'System', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.system] = (m[r.system] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'zone', label: 'Zone', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.zone] = (m[r.zone] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Route Electrified', value: `${filtered.reduce((a: number, r) => a + r.routeKm, 0).toLocaleString()} km` },
    { label: 'Total Traction Power', value: `${filtered.reduce((a: number, r) => a + r.tractionMW, 0).toLocaleString()} MW` },
    { label: 'Avg Investment per km', value: `&#8377;${(filtered.reduce((a: number, r) => a + r.investmentCr, 0) / Math.max(1, filtered.reduce((a: number, r) => a + r.routeKm, 0))).toFixed(1)} Cr/km` },
    { label: 'Active Contractors', value: String(new Set(filtered.map(r => r.contractor)).size) },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: RWERecord) => string, val: (r: RWERecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barZone = grp(r => r.zone, r => r.routeKm)
    const pieZone = grp(r => r.zone, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const systemBar = grp(r => r.system, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalZone = grp(r => r.zone, r => r.investmentCr)
    const investKm = filtered.map(r => ({ name: r.section.split('-')[0].slice(0, 14), value: +(r.investmentCr / r.routeKm).toFixed(1) }))
    const lm = filtered.reduce((a: Record<string, { routeKm: number; tractionMW: number }>, r) => {
      if (!a[r.zone]) a[r.zone] = { routeKm: 0, tractionMW: 0 }
      a[r.zone].routeKm += r.routeKm; a[r.zone].tractionMW += r.tractionMW; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, routeKm: v.routeKm, tractionMW: v.tractionMW }))
    return { barZone, pieZone, statusPie, systemBar, priorityPie, totalZone, investKm, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="rwe-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Railway Electrification' }]} />
      <PageHeader title="Railway Electrification Logistics" description="Track electrification projects, traction power deployment, and contractor performance across Indian Railway zones" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="rwe-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`rwe-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-sky-700 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="rwe-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="rwe-kpi-card"><CardContent className="p-4"><p className="rwe-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="rwe-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="rwe-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="rwe-chart-title text-sm">Route Km by Zone</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barZone}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#0369a1" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="rwe-chart-title text-sm">Projects by Zone</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieZone} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieZone.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="rwe-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="rwe-chart-title text-sm">Investment per km (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.investKm}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="rwe-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="rwe-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`rwe-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-sky-700'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.section}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.zone} | {r.contractor} | {r.system}</p>
              <p className="text-xs mt-1">{r.routeKm} km | {r.tractionMW} MW | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="rwe-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="rwe-chart-title text-sm">Route Km vs Traction MW</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="routeKm" stroke="#0369a1" name="Route Km" /><Line yAxisId="right" type="monotone" dataKey="tractionMW" stroke="#f59e0b" name="Traction MW" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="rwe-chart-title text-sm">Total Investment by Zone (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalZone}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#0284c7" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="rwe-chart-title text-sm">System Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.systemBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#38bdf8" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="rwe-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="rwe-insights grid grid-cols-2 gap-4">
        <Card className="rwe-insight-card border-l-4 border-l-sky-700"><CardContent className="p-5">
          <h4 className="rwe-insight-title font-semibold text-base">Mission 100% Electrification</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India aims to electrify 100% of broad gauge routes. Over 63,000 route km already electrified covering ~80% of total BG network. Remaining sections in NE and hilly terrain pose unique challenges requiring specialized engineering.</p>
        </CardContent></Card>
        <Card className="rwe-insight-card border-l-4 border-l-sky-700"><CardContent className="p-5">
          <h4 className="rwe-insight-title font-semibold text-base">Energy Savings from Regen Braking</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">25kV regenerative systems recover 15-30% of braking energy, saving ~&#8377;1,500 Cr annually across Indian Railways. New sections with regenerative tech show 18% energy reduction with payback under 3 years.</p>
        </CardContent></Card>
        <Card className="rwe-insight-card border-l-4 border-l-sky-700"><CardContent className="p-5">
          <h4 className="rwe-insight-title font-semibold text-base">25kV vs 1500V DC Transition</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Legacy 1500V DC systems in Mumbai suburban are being converted to 25kV AC. DC systems limited to 1,500V causing higher losses. AC conversion improves efficiency by 25-30% and enables speeds up to 160 kmph.</p>
        </CardContent></Card>
        <Card className="rwe-insight-card border-l-4 border-l-sky-700"><CardContent className="p-5">
          <h4 className="rwe-insight-title font-semibold text-base">Indian Railways Net Zero 2030 Target</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Indian Railways aims for net-zero carbon emissions by 2030, the largest green initiative by any government entity. Solar-wind installations at stations plus 100% electrification are key pillars of this &#8377;50,000 Cr mission.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
