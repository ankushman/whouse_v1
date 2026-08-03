'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface HRLRecord {
  id: string; projectId: string; city: string; operator: string; stationType: string
  dispensers: number; pressureBar: number; investmentCr: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5', '#ecfdf5', '#f0fdf4']

const records: HRLRecord[] = [
  { id: 'HRL-001', projectId: 'HRL-001', city: 'Delhi IGI Airport', operator: 'IOCL Hydrogen Station', stationType: '350 Bar H2 Station',
    dispensers: 4, pressureBar: 350, investmentCr: 85, status: 'Delivered', priority: 'Critical', origin: 'Gurgaon Plant', destination: 'IGI Airport Hub', shipDate: '2024-01-15', transitDays: 5, state: 'Delhi',
    remarks: 'India&apos;s flagship hydrogen refueling station at IGI Airport for fuel cell buses and taxis, 350 bar dispensing with 4 nozzles serving 200+ vehicles per day' },
  { id: 'HRL-002', projectId: 'HRL-002', city: 'Bengaluru Electronic City', operator: 'H2 Green Mobility', stationType: '700 Bar H2 Station',
    dispensers: 6, pressureBar: 700, investmentCr: 120, status: 'Delivered', priority: 'Critical', origin: 'Kolar Electrolyzer', destination: 'Electronic City', shipDate: '2024-02-10', transitDays: 8, state: 'Karnataka',
    remarks: 'High-pressure 700 bar station for passenger FCVs and heavy-duty trucks, 6 dispensers with sub-3-minute fill time at Bengaluru&apos;s tech corridor serving IT campus shuttle fleet' },
  { id: 'HRL-003', projectId: 'HRL-003', city: 'Mumbai BKC', operator: 'Tata Power H2', stationType: '350 Bar H2 Station',
    dispensers: 4, pressureBar: 350, investmentCr: 95, status: 'Delivered', priority: 'High', origin: 'Trombay Electrolyzer', destination: 'BKC Station', shipDate: '2024-01-28', transitDays: 6, state: 'Maharashtra',
    remarks: 'Mumbai&apos;s first public hydrogen station at BKC financial district, 350 bar dispensing for 100+ FC taxis with green hydrogen produced from Trombay&apos;s 10 MW electrolyzer' },
  { id: 'HRL-004', projectId: 'HRL-004', city: 'Pune Hinjewadi', operator: 'Adani H2 Mobility', stationType: '700 Bar H2 Station',
    dispensers: 5, pressureBar: 700, investmentCr: 110, status: 'Delivered', priority: 'High', origin: 'Chakan Electrolyzer', destination: 'Hinjewadi IT Park', shipDate: '2024-03-05', transitDays: 7, state: 'Maharashtra',
    remarks: 'Hinjewadi IT park hydrogen station with 5 dispensers, 700 bar for IT shuttle buses and employee FCVs, connected to Chakan industrial green hydrogen supply pipeline' },
  { id: 'HRL-005', projectId: 'HRL-005', city: 'Chennai OMR', operator: 'IOCL Tamil Nadu H2', stationType: '350 Bar H2 Station',
    dispensers: 3, pressureBar: 350, investmentCr: 72, status: 'In Transit', priority: 'High', origin: 'Manali Refinery', destination: 'OMR Tech Corridor', shipDate: '2024-05-15', transitDays: 10, state: 'Tamil Nadu',
    remarks: 'OMR tech corridor hydrogen station with grey-blue hydrogen from Manali refinery, 3 dispensers for 150+ FC vehicles per day serving Chennai&apos;s IT and industrial belt' },
  { id: 'HRL-006', projectId: 'HRL-006', city: 'Hyderabad HITEC City', operator: 'NTPC Green Hydrogen', stationType: '700 Bar H2 Station',
    dispensers: 5, pressureBar: 700, investmentCr: 105, status: 'Delivered', priority: 'High', origin: 'Hyderabad Electrolyzer', destination: 'HITEC City', shipDate: '2024-03-18', transitDays: 6, state: 'Telangana',
    remarks: 'HITEC City hydrogen station with 5 dispensers, 700 bar pressure for Telangana state FC bus fleet, powered by NTPC&apos;s 5 MW PEM electrolyzer at Hyderabad energy park' },
  { id: 'HRL-007', projectId: 'HRL-007', city: 'Gandhinagar SG Highway', operator: 'Gujarat Green H2', stationType: '350 Bar H2 Station',
    dispensers: 4, pressureBar: 350, investmentCr: 88, status: 'Delivered', priority: 'High', origin: 'Gandhinagar Electrolyzer', destination: 'SG Highway Hub', shipDate: '2024-04-10', transitDays: 5, state: 'Gujarat',
    remarks: 'SG Highway hydrogen corridor station for intercity FC buses and trucks, 4 dispensers on Ahmedabad-Gandhinagar expressway serving 180+ vehicles daily from Gujarat&apos;s first green H2 hub' },
  { id: 'HRL-008', projectId: 'HRL-008', city: 'Jaipur Mansarovar', operator: 'Rajasthan H2 Energy', stationType: '350 Bar H2 Station',
    dispensers: 3, pressureBar: 350, investmentCr: 65, status: 'In Transit', priority: 'Medium', origin: 'Jodhpur Solar H2', destination: 'Jaipur Station', shipDate: '2024-06-01', transitDays: 12, state: 'Rajasthan',
    remarks: 'Jaipur&apos;s first hydrogen station at Mansarovar, 3 dispensers with solar-powered electrolyzer supply from Jodhpur, serving Rajasthan state transport FC bus fleet of 50 vehicles' },
  { id: 'HRL-009', projectId: 'HRL-009', city: 'Kolkata Salt Lake', operator: 'WB H2 Mobility', stationType: '700 Bar H2 Station',
    dispensers: 4, pressureBar: 700, investmentCr: 98, status: 'Delivered', priority: 'Medium', origin: 'Durgapur Electrolyzer', destination: 'Salt Lake Sector V', shipDate: '2024-02-28', transitDays: 10, state: 'West Bengal',
    remarks: 'Salt Lake IT sector hydrogen station with 4 dispensers at 700 bar, serving 120+ FC vehicles in Kolkata&apos;s technology and government campus corridor with green H2 from Durgapur' },
  { id: 'HRL-010', projectId: 'HRL-010', city: 'Kochi Lulu Metro', operator: 'Kerala H2 Transport', stationType: '350 Bar H2 Station',
    dispensers: 3, pressureBar: 350, investmentCr: 70, status: 'Delivered', priority: 'Medium', origin: 'Kochi Refinery', destination: 'Lulu Metro Station', shipDate: '2024-03-28', transitDays: 8, state: 'Kerala',
    remarks: 'Lulu Metro integrated hydrogen station for FC feeder buses and Kochi Metro fleet, 3 dispensers with 350 bar pressure supplying 80+ vehicles daily from BPCL Kochi refinery hydrogen' },
  { id: 'HRL-011', projectId: 'HRL-011', city: 'Ahmedabad Naroda', operator: 'Reliance H2 Station', stationType: '700 Bar H2 Station',
    dispensers: 6, pressureBar: 700, investmentCr: 125, status: 'Processing', priority: 'High', origin: 'Jamnagar Green H2', destination: 'Naroda Industrial', shipDate: '2024-07-10', transitDays: 14, state: 'Gujarat',
    remarks: 'Heavy-duty hydrogen station at Naroda industrial estate with 6 dispensers for FC trucks and buses, connected to Reliance Jamnagar&apos;s 60,000 TPD green hydrogen pipeline' },
  { id: 'HRL-012', projectId: 'HRL-012', city: 'Lucknow Gomti Nagar', operator: 'UP H2 Energy Corp', stationType: '350 Bar H2 Station',
    dispensers: 3, pressureBar: 350, investmentCr: 62, status: 'In Transit', priority: 'Medium', origin: 'Kanpur Electrolyzer', destination: 'Gomti Nagar', shipDate: '2024-05-28', transitDays: 10, state: 'Uttar Pradesh',
    remarks: 'Lucknow&apos;s first hydrogen refueling station at Gomti Nagar, 3 dispensers for UP state transport FC buses, with green hydrogen supplied via dedicated tanker fleet from Kanpur' },
  { id: 'HRL-013', projectId: 'HRL-013', city: 'Bhubaneswar Infocity', operator: 'Odisha Green H2', stationType: '700 Bar H2 Station',
    dispensers: 4, pressureBar: 700, investmentCr: 92, status: 'Delivered', priority: 'Medium', origin: 'Paradip Electrolyzer', destination: 'Infocity Tower', shipDate: '2024-04-05', transitDays: 12, state: 'Odisha',
    remarks: 'Infocity hydrogen station with 4 dispensers at 700 bar, serving Bhubaneswar IT park shuttle fleet and Odisha state FC buses with green H2 from Paradip coastal electrolyzer' },
  { id: 'HRL-014', projectId: 'HRL-014', city: 'Nagpur Hingna', operator: 'Maharashtra H2 Corridor', stationType: '350 Bar H2 Station',
    dispensers: 4, pressureBar: 350, investmentCr: 78, status: 'Delayed', priority: 'Medium', origin: 'Nagpur Solar H2', destination: 'Hingna Industrial', shipDate: '2024-06-15', transitDays: 9, state: 'Maharashtra',
    remarks: 'Delayed due to hydrogen compressor import clearance, Nagpur Hingna station with 4 dispensers for Nagpur Metro FC bus fleet and MIHAN cargo terminal hydrogen trucks' },
]

export default function HydrogenRefuelingLogisticsView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof HRLRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'stationType', label: 'Station Type', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.stationType] = (m[r.stationType] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Dispensers', value: `${filtered.reduce((a: number, r) => a + r.dispensers, 0).toLocaleString()}` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Avg Pressure', value: `${(filtered.reduce((a: number, r) => a + r.pressureBar, 0) / Math.max(1, filtered.length)).toFixed(0)} bar` },
    { label: 'Active Stations', value: String(filtered.filter(r => r.status === 'Delivered').length) },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: HRLRecord) => string, val: (r: HRLRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.dispensers)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const typeBar = grp(r => r.stationType, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const costData = filtered.map(r => ({ name: r.city.split(' ')[0].slice(0, 12), value: +(r.investmentCr / r.dispensers).toFixed(1) }))
    const lm = filtered.reduce((a: Record<string, { dispensers: number; investmentCr: number }>, r) => {
      if (!a[r.state]) a[r.state] = { dispensers: 0, investmentCr: 0 }
      a[r.state].dispensers += r.dispensers; a[r.state].investmentCr += r.investmentCr; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, dispensers: v.dispensers, investmentCr: v.investmentCr }))
    return { barState, pieState, statusPie, typeBar, priorityPie, totalInvest, costData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="hrl-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Hydrogen Refueling' }]} />
      <PageHeader title="Hydrogen Refueling Logistics" description="Track hydrogen refueling station deployments, dispenser capacity, pressure ratings, and green hydrogen supply chain across Indian cities" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="hrl-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`hrl-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-emerald-700 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="hrl-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="hrl-kpi-card"><CardContent className="p-4"><p className="hrl-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="hrl-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="hrl-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="hrl-chart-title text-sm">Dispensers by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#059669" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="hrl-chart-title text-sm">Stations by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="hrl-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="hrl-chart-title text-sm">Cost per Dispenser (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.costData}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="hrl-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="hrl-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`hrl-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-emerald-700'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.stationType} | {r.state}</p>
              <p className="text-xs mt-1">{r.dispensers} dispensers | {r.pressureBar} bar | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="hrl-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="hrl-chart-title text-sm">Dispensers vs Investment</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="dispensers" stroke="#059669" name="Dispensers" /><Line yAxisId="right" type="monotone" dataKey="investmentCr" stroke="#f59e0b" name="Investment &#8377;Cr" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="hrl-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#34d399" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="hrl-chart-title text-sm">Station Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.typeBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#6ee7b7" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="hrl-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="hrl-insights grid grid-cols-2 gap-4">
        <Card className="hrl-insight-card border-l-4 border-l-emerald-700"><CardContent className="p-5">
          <h4 className="hrl-insight-title font-semibold text-base">India&apos;s National Hydrogen Mission: 1,000 Stations by 2030</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">NTHM targets 1,000 hydrogen refueling stations across NH and state highway networks by 2030. Currently 58 operational stations serve 5,000+ FC vehicles. India&apos;s &#8377;8,000 Cr hydrogen infrastructure fund is financing station construction at &#8377;8-12 Cr per station.</p>
        </CardContent></Card>
        <Card className="hrl-insight-card border-l-4 border-l-emerald-700"><CardContent className="p-5">
          <h4 className="hrl-insight-title font-semibold text-base">350 Bar vs 700 Bar: Use Case Split</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">350 bar stations serve buses, trucks, and fleet vehicles with faster 2-3 minute fills and lower infrastructure costs. 700 bar stations target passenger FCVs needing longer range, with 3-5 minute fills enabling 500-700 km driving. India deploys both formats across city corridors.</p>
        </CardContent></Card>
        <Card className="hrl-insight-card border-l-4 border-l-emerald-700"><CardContent className="p-5">
          <h4 className="hrl-insight-title font-semibold text-base">Green Hydrogen Supply Chain</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India produces 6 MT grey hydrogen annually via SMR. Green hydrogen from electrolysis costs &#8377;300-400/kg versus &#8377;150/kg grey. MNRE targets &#8377;100/kg green H2 by 2030, enabling cost parity with diesel at &#8377;85/liter at the pump for fleet operators.</p>
        </CardContent></Card>
        <Card className="hrl-insight-card border-l-4 border-l-emerald-700"><CardContent className="p-5">
          <h4 className="hrl-insight-title font-semibold text-base">Hydrogen Highway Corridors</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India is building 6 hydrogen highway corridors: Delhi-Jaipur, Mumbai-Pune, Bengaluru-Chennai, Hyderabad-Vizag, Kochi-Coimbatore, and Kolkata-Bhubaneswar. Each corridor has stations every 150-200 km enabling intercity FCV travel by 2027.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
