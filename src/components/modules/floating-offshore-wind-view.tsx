'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface FOSRecord {
  id: string; projectId: string; zone: string; developer: string; turbineType: string
  capacityMW: number; investmentCr: number; depthM: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#0f766e', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4', '#ccfbf1', '#f0fdfa', '#e6fffa']

const records: FOSRecord[] = [
  { id: 'FOS-001', projectId: 'FOS-001', zone: 'Gujarat Kutch', developer: 'Adani Green Energy', turbineType: '15 MW Semi-Sub',
    capacityMW: 600, investmentCr: 4800, depthM: 35, status: 'Delivered', priority: 'Critical', origin: 'Mundra Port', destination: 'Kutch Wind Farm', shipDate: '2024-01-10', transitDays: 25, state: 'Gujarat',
    remarks: 'India&apos;s first commercial floating offshore wind farm in Kutch, 40 x 15 MW semi-submersible turbines with 35m water depth, supplying 1.8 TWh annually to Gujarat grid' },
  { id: 'FOS-002', projectId: 'FOS-002', zone: 'Tamil Nadu Palk Strait', developer: 'Vestas Wind India', turbineType: '18 MW Spar-Buoy',
    capacityMW: 540, investmentCr: 4500, depthM: 55, status: 'In Transit', priority: 'Critical', origin: 'Chennai Port', destination: 'Palk Bay Farm', shipDate: '2024-05-15', transitDays: 30, state: 'Tamil Nadu',
    remarks: 'Deep-water spar-buoy floating wind in Palk Strait, 30 x 18 MW turbines at 55m depth, designed for Indian monsoon conditions with enhanced mooring systems' },
  { id: 'FOS-003', projectId: 'FOS-003', zone: 'Maharashtra Konkan', developer: 'Siemens Gamesa India', turbineType: '14 MW Tension Leg',
    capacityMW: 280, investmentCr: 2200, depthM: 80, status: 'Delivered', priority: 'High', origin: 'Mumbai Port', destination: 'Konkan Deep Water', shipDate: '2024-02-20', transitDays: 22, state: 'Maharashtra',
    remarks: 'Tension leg platform floating wind off Konkan coast, 20 x 14 MW turbines in 80m depth, with dynamic inter-array cables and offshore substation platform' },
  { id: 'FOS-004', projectId: 'FOS-004', zone: 'Gujarat Saurashtra', developer: 'Orix India Wind', turbineType: '16 MW Semi-Sub',
    capacityMW: 320, investmentCr: 2500, depthM: 28, status: 'Delivered', priority: 'High', origin: 'Porbandar Port', destination: 'Saurashtra Float', shipDate: '2024-03-05', transitDays: 20, state: 'Gujarat',
    remarks: 'Semi-submersible floating wind off Saurashtra coast, 20 x 16 MW turbines in 28m depth, co-located with existing fixed-bottom wind for hybrid power optimization' },
  { id: 'FOS-005', projectId: 'FOS-005', zone: 'Kerala Laccadive Sea', developer: 'NTPC Renewable', turbineType: '15 MW Spar-Buoy',
    capacityMW: 180, investmentCr: 1500, depthM: 60, status: 'In Transit', priority: 'Medium', origin: 'Cochin Shipyard', destination: 'Lakshadweep Zone', shipDate: '2024-06-10', transitDays: 35, state: 'Kerala',
    remarks: 'Deep-water spar-buoy floating wind for Lakshadweep islands, 12 x 15 MW turbines replacing diesel generators, providing clean power to 10 inhabited islands' },
  { id: 'FOS-006', projectId: 'FOS-006', zone: 'Odisha Gopalpur', developer: 'Greenko Energies', turbineType: '12 MW Semi-Sub',
    capacityMW: 240, investmentCr: 1900, depthM: 25, status: 'Delivered', priority: 'High', origin: 'Gopalpur Port', destination: 'Bay of Bengal Farm', shipDate: '2024-01-28', transitDays: 18, state: 'Odisha',
    remarks: 'Semi-submersible floating wind off Gopalpur in Bay of Bengal, 20 x 12 MW turbines at 25m depth, with cyclone-rated mooring designed for 250 kmph winds' },
  { id: 'FOS-007', projectId: 'FOS-007', zone: 'Karnataka Mangalore', developer: 'ReNew Power Offshore', turbineType: '14 MW Tension Leg',
    capacityMW: 168, investmentCr: 1350, depthM: 70, status: 'Delivered', priority: 'Medium', origin: 'Mangalore Port', destination: 'Arabian Sea Deep', shipDate: '2024-03-15', transitDays: 24, state: 'Karnataka',
    remarks: 'TLP floating wind off Mangalore in Arabian Sea, 12 x 14 MW turbines at 70m depth, with integrated wave energy converters for hybrid ocean energy generation' },
  { id: 'FOS-008', projectId: 'FOS-008', zone: 'Andhra Kakinada', developer: 'Mytrah Energy', turbineType: '16 MW Semi-Sub',
    capacityMW: 224, investmentCr: 1780, depthM: 32, status: 'Processing', priority: 'Medium', origin: 'Kakinada Port', destination: 'Vizag Coast Farm', shipDate: '2024-07-20', transitDays: 28, state: 'Andhra Pradesh',
    remarks: 'Semi-submersible floating wind off Kakinada in Bay of Bengal, 14 x 16 MW turbines at 32m depth, with underwater HVDC export cable to onshore substation' },
  { id: 'FOS-009', projectId: 'FOS-009', zone: 'West Bengal Sundarbans', developer: 'Suzlon Energy', turbineType: '10 MW Spar-Buoy',
    capacityMW: 100, investmentCr: 850, depthM: 45, status: 'In Transit', priority: 'Medium', origin: 'Haldia Port', destination: 'Sundarbans Float', shipDate: '2024-05-28', transitDays: 32, state: 'West Bengal',
    remarks: 'Environmentally sensitive floating wind in Sundarbans delta, 10 x 10 MW spar-buoy turbines at 45m depth, with zero-emission installation avoiding mangrove disruption' },
  { id: 'FOS-010', projectId: 'FOS-010', zone: 'Gujarat Dwarka', developer: 'Torrent Power Wind', turbineType: '18 MW Semi-Sub',
    capacityMW: 360, investmentCr: 2800, depthM: 40, status: 'Delivered', priority: 'High', origin: 'Okha Port', destination: 'Dwarka Deep Wind', shipDate: '2024-02-08', transitDays: 22, state: 'Gujarat',
    remarks: 'Large semi-submersible floating wind off Dwarka, 20 x 18 MW turbines at 40m depth, high capacity factor of 45% due to consistent Arabian Sea wind speeds exceeding 9 m/s' },
  { id: 'FOS-011', projectId: 'FOS-011', zone: 'Tamil Nadu Gulf of Mannar', developer: 'WP Energy India', turbineType: '15 MW Tension Leg',
    capacityMW: 225, investmentCr: 1850, depthM: 65, status: 'Delivered', priority: 'Medium', origin: 'Tuticorin Port', destination: 'Gulf of Mannar Farm', shipDate: '2024-03-22', transitDays: 26, state: 'Tamil Nadu',
    remarks: 'TLP floating wind in Gulf of Mannar marine biosphere, 15 x 15 MW turbines at 65m depth with marine life-friendly cable routing avoiding coral reef zones' },
  { id: 'FOS-012', projectId: 'FOS-012', zone: 'Goa Arabian Sea', developer: 'GMR Energy Offshore', turbineType: '12 MW Semi-Sub',
    capacityMW: 96, investmentCr: 780, depthM: 30, status: 'Processing', priority: 'Low', origin: 'Mormugao Port', destination: 'Goa Coast Float', shipDate: '2024-07-10', transitDays: 20, state: 'Goa',
    remarks: 'Small-scale floating wind pilot off Goa coast, 8 x 12 MW turbines at 30m depth, serving as technology demonstrator for future Maharashtra-Goa floating wind corridor' },
  { id: 'FOS-013', projectId: 'FOS-013', zone: 'Puducherry Coromandel', developer: 'NHPC Renewable', turbineType: '14 MW Spar-Buoy',
    capacityMW: 112, investmentCr: 920, depthM: 50, status: 'Delayed', priority: 'Low', origin: 'Puducherry Port', destination: 'Coromandel Float', shipDate: '2024-06-20', transitDays: 30, state: 'Puducherry',
    remarks: 'Delayed due to monsoon installation window constraints, spar-buoy floating wind off Puducherry, 8 x 14 MW turbines at 50m depth targeting 38% capacity factor' },
  { id: 'FOS-014', projectId: 'FOS-014', zone: 'Andaman Nicobar', developer: 'TP Renewable (Adani)', turbineType: '10 MW Semi-Sub',
    capacityMW: 80, investmentCr: 720, depthM: 38, status: 'In Transit', priority: 'Low', origin: 'Port Blair', destination: 'South Andaman Float', shipDate: '2024-06-01', transitDays: 40, state: 'Andaman',
    remarks: 'Strategic floating wind for Andaman &amp; Nicobar defense and civilian power, 8 x 10 MW turbines replacing 100% diesel dependency for Port Blair and surrounding islands' },
]

export default function FloatingOffshoreWindView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof FOSRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'turbineType', label: 'Turbine Type', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.turbineType] = (m[r.turbineType] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Floating Capacity', value: `${filtered.reduce((a: number, r) => a + r.capacityMW, 0).toLocaleString()} MW` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Avg Depth', value: `${(filtered.reduce((a: number, r) => a + r.depthM, 0) / Math.max(1, filtered.length)).toFixed(0)} m` },
    { label: 'Avg Investment/MW', value: `&#8377;${(filtered.reduce((a: number, r) => a + r.investmentCr, 0) / Math.max(1, filtered.reduce((a: number, r) => a + r.capacityMW, 0))).toFixed(1)} Cr/MW` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: FOSRecord) => string, val: (r: FOSRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.capacityMW)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const turbBar = grp(r => r.turbineType, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const depthCap = filtered.map(r => ({ name: r.zone.split(' ').slice(0, 2).join(' ').slice(0, 14), value: r.depthM, cap: r.capacityMW }))
    const lm = filtered.reduce((a: Record<string, { capacityMW: number; investmentCr: number }>, r) => {
      if (!a[r.state]) a[r.state] = { capacityMW: 0, investmentCr: 0 }
      a[r.state].capacityMW += r.capacityMW; a[r.state].investmentCr += r.investmentCr; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, capacityMW: v.capacityMW, investmentCr: v.investmentCr }))
    return { barState, pieState, statusPie, turbBar, priorityPie, totalInvest, depthCap, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="fos-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Floating Offshore Wind' }]} />
      <PageHeader title="Floating Offshore Wind Logistics" description="Monitor floating wind farm installations, turbine deployments, and deep-water energy infrastructure across Indian coastal zones" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="fos-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`fos-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-teal-700 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="fos-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="fos-kpi-card"><CardContent className="p-4"><p className="fos-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="fos-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="fos-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="fos-chart-title text-sm">Capacity (MW) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#0f766e" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="fos-chart-title text-sm">Farms by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="fos-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="fos-chart-title text-sm">Water Depth vs Capacity</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.depthCap}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Depth (m)" /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="fos-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="fos-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`fos-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-teal-700'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.zone}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.developer} | {r.turbineType} | {r.state}</p>
              <p className="text-xs mt-1">{r.capacityMW} MW | {r.depthM}m depth | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="fos-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="fos-chart-title text-sm">Capacity MW vs Investment</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="capacityMW" stroke="#0f766e" name="Capacity MW" /><Line yAxisId="right" type="monotone" dataKey="investmentCr" stroke="#f59e0b" name="Investment &#8377;Cr" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="fos-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#14b8a6" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="fos-chart-title text-sm">Turbine Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.turbBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#2dd4bf" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="fos-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="fos-insights grid grid-cols-2 gap-4">
        <Card className="fos-insight-card border-l-4 border-l-teal-700"><CardContent className="p-5">
          <h4 className="fos-insight-title font-semibold text-base">India&apos;s 30 GW Floating Wind Target by 2035</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">MNRE has identified 72 GW of offshore wind potential along India&apos;s 7,500 km coastline, with 30 GW earmarked for floating platforms. Initial tenders for 10 GW have been announced for Gujarat and Tamil Nadu zones in 2025-26.</p>
        </CardContent></Card>
        <Card className="fos-insight-card border-l-4 border-l-teal-700"><CardContent className="p-5">
          <h4 className="fos-insight-title font-semibold text-base">Semi-Sub vs Spar-Buoy vs TLP Platforms</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Semi-submersibles dominate Indian projects (60%) due to versatility across 20-80m depths. Spar-buoys suit deeper waters 50m+ with excellent stability. Tension leg platforms offer minimal motion for turbine performance but require complex installation at 60m+ depths.</p>
        </CardContent></Card>
        <Card className="fos-insight-card border-l-4 border-l-teal-700"><CardContent className="p-5">
          <h4 className="fos-insight-title font-semibold text-base">Monsoon-Resilient Mooring Design</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Indian floating wind farms face unique challenges from cyclone-season waves exceeding 12m and monsoon winds at 150+ kmph. Engineers use catenary mooring with polyester ropes and chain fallbacks rated for 500-year return period storm conditions.</p>
        </CardContent></Card>
        <Card className="fos-insight-card border-l-4 border-l-teal-700"><CardContent className="p-5">
          <h4 className="fos-insight-title font-semibold text-base">Grid Integration via HVDC Export Cables</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s floating wind farms at 50-80 km offshore require HVDC cable systems for low-loss power transmission. Each 500 MW farm uses &#177;320 kV submarine cables with 3% loss over 100 km, connecting to dedicated onshore converter stations.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
