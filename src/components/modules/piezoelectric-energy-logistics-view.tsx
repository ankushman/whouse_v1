'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface PELRecord {
  id: string; projectId: string; city: string; operator: string; piezoType: string
  powerOutputKW: number; investmentCr: number; efficiency: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#7e22ce', '#9333ea', '#a855f7', '#c084fc', '#d8b4fe', '#6b21a8', '#581c87', '#3b0764']

const records: PELRecord[] = [
  { id: 'PEL-0001', projectId: 'PEL-001', city: 'Mumbai', operator: 'PiezoTech India Ltd', piezoType: 'PZT-5H Ceramic Floor Tile',
    powerOutputKW: 450, investmentCr: 320, efficiency: 72, status: 'Delivered', priority: 'Critical', origin: 'Mumbai Manufacturing', destination: 'BKC Pedestrian Zone', shipDate: '2025-03-10', transitDays: 2, state: 'Maharashtra',
    remarks: 'PZT-5H ceramic floor tiles installed at BKC pedestrian zone converting footfall energy to electricity. 450 kW peak output powering 200 street lights and 50 CCTV cameras. System deployed under Mumbai Smart City Phase-3 with &#8377;320 Cr investment covering 5 km walkway network.' },
  { id: 'PEL-0002', projectId: 'PEL-002', city: 'Delhi', operator: 'Energy Harvest Delhi', piezoType: 'PVDF Polymer Road Strip',
    powerOutputKW: 680, investmentCr: 480, efficiency: 68, status: 'Delivered', priority: 'Critical', origin: 'Gurgaon Plant', destination: 'Connaught Place Inner Circle', shipDate: '2025-03-15', transitDays: 1, state: 'Delhi',
    remarks: 'PVDF polymer piezoelectric road strips at Connaught Place generating 680 kW from vehicular traffic pressure. Flexible polymer design withstands 50-ton truck loads with 68% energy conversion efficiency. Integrated with NDMC smart grid for real-time power injection at &#8377;480 Cr project cost.' },
  { id: 'PEL-0003', projectId: 'PEL-003', city: 'Bengaluru', operator: 'Kinetic Energy Systems', piezoType: 'BaTiO3 Single Crystal Disc',
    powerOutputKW: 320, investmentCr: 290, efficiency: 85, status: 'Delivered', priority: 'High', origin: 'Electronic City Lab', destination: 'Majestic Bus Station', shipDate: '2025-03-05', transitDays: 3, state: 'Karnataka',
    remarks: 'Barium Titanate single crystal discs at Bengaluru Majestic bus station with 85% efficiency, highest among deployed units. 320 kW output powering ticketing systems, digital displays and EV charging stations. &#8377;290 Cr project includes AI-powered footfall prediction for optimal energy harvesting.' },
  { id: 'PEL-0004', projectId: 'PEL-004', city: 'Chennai', operator: 'Tamil Nadu Piezo Corp', piezoType: 'PZT-4 Ceramic Railway Pad',
    powerOutputKW: 1200, investmentCr: 720, efficiency: 74, status: 'Delivered', priority: 'Critical', origin: 'Ambattur Industrial', destination: 'Chennai Central Railway', shipDate: '2025-02-28', transitDays: 2, state: 'Tamil Nadu',
    remarks: 'PZT-4 ceramic pads under Chennai Central railway tracks harvesting 1,200 kW from train vibrations. System powers station lighting, platform signage and signalling equipment. &#8377;720 Cr investment includes vibration sensors and predictive maintenance for Southern Railway track network.' },
  { id: 'PEL-0005', projectId: 'PEL-005', city: 'Hyderabad', operator: 'Telangana Energy Harvest', piezoType: 'PMN-PT Crystal Stack',
    powerOutputKW: 280, investmentCr: 350, efficiency: 82, status: 'In Transit', priority: 'High', origin: 'HITEC City Warehouse', destination: 'Rajiv Gandhi Airport', shipDate: '2025-03-20', transitDays: 3, state: 'Telangana',
    remarks: 'PMN-PT crystal stack modules en route to Hyderabad Rajiv Gandhi Airport for runway energy harvesting. 82% efficiency PMN-PT crystals capture aircraft landing kinetic energy at 280 kW capacity. &#8377;350 Cr project will power airport terminal HVAC and baggage handling systems.' },
  { id: 'PEL-0006', projectId: 'PEL-006', city: 'Kolkata', operator: 'Bengal Harvester Systems', piezoType: 'AlN Thin Film Membrane',
    powerOutputKW: 200, investmentCr: 180, efficiency: 76, status: 'Delivered', priority: 'Medium', origin: 'Salt Lake Facility', destination: 'Park Street Metro Station', shipDate: '2025-03-12', transitDays: 4, state: 'West Bengal',
    remarks: 'Aluminium Nitride thin film membranes at Kolkata Park Street metro station generating 200 kW from passenger movement. Thin-film technology enables ultra-thin 3mm floor tiles with 76% efficiency. &#8377;180 Cr investment covers 12 metro stations under Kolkata Metro expansion.' },
  { id: 'PEL-0007', projectId: 'PEL-007', city: 'Pune', operator: 'Maharashtra Kinetic Power', piezoType: 'Lead-Free KNN Ceramic',
    powerOutputKW: 380, investmentCr: 260, efficiency: 65, status: 'Delivered', priority: 'High', origin: 'Hinjewadi Factory', destination: 'Hinjewadi IT Corridor', shipDate: '2025-03-08', transitDays: 1, state: 'Maharashtra',
    remarks: 'Lead-free KNN (K0.5Na0.5NbO3) ceramic tiles at Hinjewadi IT corridor producing 380 kW green energy. Eco-friendly lead-free composition meets RoHS compliance for IT campus deployment. &#8377;260 Cr project powers tech park street lighting and electric shuttle charging stations.' },
  { id: 'PEL-0008', projectId: 'PEL-008', city: 'Jaipur', operator: 'Rajasthan Renewable Harvester', piezoType: 'PZT-5A Walkway Tile',
    powerOutputKW: 250, investmentCr: 210, efficiency: 70, status: 'Delivered', priority: 'Medium', origin: 'Sitapura Industrial', destination: 'Hawa Mahal Tourist Zone', shipDate: '2025-03-18', transitDays: 3, state: 'Rajasthan',
    remarks: 'PZT-5A walkway tiles at Jaipur Hawa Mahal tourist zone generating 250 kW for heritage area lighting. Desert-rated IP67 enclosure handles 50&#176;C ambient temperature with minimal efficiency loss. &#8377;210 Cr project part of Rajasthan tourism infrastructure modernization under Smart City Mission.' },
  { id: 'PEL-0009', projectId: 'PEL-009', city: 'Ahmedabad', operator: 'Gujarat Piezo Energy', piezoType: 'Bimorph Cantilever Array',
    powerOutputKW: 520, investmentCr: 390, efficiency: 78, status: 'Delayed', priority: 'Critical', origin: 'Sanand Industrial', destination: 'Sabarmati Riverfront', shipDate: '2025-02-20', transitDays: 2, state: 'Gujarat',
    remarks: 'Bimorph cantilever arrays for Sabarmati Riverfront walkway delayed by monsoon pre-monsoon construction. 520 kW rated capacity with 78% efficiency from dual-layer piezo configuration. &#8377;390 Cr investment includes underwater turbine integration for combined wind-piezo energy generation.' },
  { id: 'PEL-0010', projectId: 'PEL-010', city: 'Kochi', operator: 'Kerala Green Harvester', piezoType: 'PVDF-TrFE Copolymer Film',
    powerOutputKW: 180, investmentCr: 160, efficiency: 71, status: 'Delivered', priority: 'Medium', origin: 'Kalamassery Factory', destination: 'Marine Drive Walkway', shipDate: '2025-03-22', transitDays: 2, state: 'Kerala',
    remarks: 'PVDF-TrFE copolymer films at Kochi Marine Drive generating 180 kW from pedestrian and cycling traffic. Humidity-resistant copolymer design optimized for Kerala&apos;s tropical coastal climate. &#8377;160 Cr project integrates with Kerala State Electricity Board grid via net metering.' },
  { id: 'PEL-0011', projectId: 'PEL-011', city: 'Lucknow', operator: 'UP Piezo Ventures', piezoType: 'PZT-8 High Power Disk',
    powerOutputKW: 350, investmentCr: 280, efficiency: 73, status: 'In Transit', priority: 'High', origin: 'Noida Warehouse', destination: 'Hazratganj Market', shipDate: '2025-03-25', transitDays: 4, state: 'Uttar Pradesh',
    remarks: 'PZT-8 high power disks en route to Lucknow Hazratganj commercial district for 350 kW energy harvesting. High-power variant handles sustained 24/7 footfall from UP&apos;s busiest market area. &#8377;280 Cr investment covers 3.5 km of piezoelectric-enabled sidewalks and marketplace flooring.' },
  { id: 'PEL-0012', projectId: 'PEL-012', city: 'Bhubaneswar', operator: 'Odisha Wave Power Ltd', piezoType: 'PZN-PT Relaxor Single Crystal',
    powerOutputKW: 290, investmentCr: 310, efficiency: 88, status: 'Delivered', priority: 'High', origin: 'Bhubaneswar Tech Park', destination: 'Puri Golden Beach', shipDate: '2025-03-02', transitDays: 3, state: 'Odisha',
    remarks: 'PZN-PT relaxor single crystals at Puri Golden Beach achieving record 88% energy conversion efficiency. 290 kW from beachgoer footfall combined with wave-induced micro-vibrations. &#8377;310 Cr project powers beachfront lighting, tourist facilities and desalination pump for drinking water.' },
  { id: 'PEL-0013', projectId: 'PEL-013', city: 'Guwahati', operator: 'NE Energy Systems', piezoType: 'Flexible Piezo Rubber Pad',
    powerOutputKW: 150, investmentCr: 140, efficiency: 62, status: 'Processing', priority: 'Low', origin: 'Guwahati IIT Lab', destination: 'Kamakhya Temple Approach', shipDate: '2025-03-28', transitDays: 1, state: 'Assam',
    remarks: 'Flexible piezo rubber pads under processing for Kamakhya Temple approach road at &#8377;140 Cr investment. Low-cost rubber composite design enables 62% efficiency with 10-year durability. 150 kW output will power temple complex lighting and Northeast tourism information displays.' },
  { id: 'PEL-0014', projectId: 'PEL-014', city: 'Indore', operator: 'MP Clean Energy Ltd', piezoType: 'Macro Fiber Composite MFC',
    powerOutputKW: 420, investmentCr: 340, efficiency: 77, status: 'Delayed', priority: 'High', origin: 'Pithampur Industrial', destination: 'Sarafa Bazaar Road', shipDate: '2025-02-15', transitDays: 3, state: 'Madhya Pradesh',
    remarks: 'Macro Fiber Composite (MFC) piezo panels for Indore Sarafa Bazaar road delayed by municipal approval process. 420 kW rated output from MFC interdigitated electrode design achieving 77% efficiency. &#8377;340 Cr project covers Indore&apos;s smartest commercial stretch with integrated EV charging from footfall energy.' },
]

export default function PiezoelectricEnergyLogisticsView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof PELRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'piezoType', label: 'Piezo Type', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.piezoType] = (m[r.piezoType] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Power Output', value: `${filtered.reduce((a: number, r) => a + r.powerOutputKW, 0).toLocaleString()} kW` },
    { label: 'Avg Efficiency', value: `${(filtered.reduce((a: number, r) => a + r.efficiency, 0) / Math.max(1, filtered.length)).toFixed(1)}%` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Avg Cost/kW', value: `&#8377;${(filtered.reduce((a: number, r) => a + r.investmentCr, 0) * 100 / Math.max(1, filtered.reduce((a: number, r) => a + r.powerOutputKW, 0))).toFixed(0)} L` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: PELRecord) => string, val: (r: PELRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.powerOutputKW)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const matBar = grp(r => r.piezoType, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const effData = filtered.map(r => ({ name: r.piezoType.split(' ').slice(0, 2).join(' '), value: r.efficiency }))
    const lm = filtered.reduce((a: Record<string, { powerOutputKW: number; investmentCr: number }>, r) => {
      if (!a[r.state]) a[r.state] = { powerOutputKW: 0, investmentCr: 0 }
      a[r.state].powerOutputKW += r.powerOutputKW; a[r.state].investmentCr += r.investmentCr; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, powerOutputKW: v.powerOutputKW, investmentCr: v.investmentCr }))
    return { barState, pieState, statusPie, matBar, priorityPie, totalInvest, effData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="pel-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Piezoelectric Energy' }]} />
      <PageHeader title="Piezoelectric Energy Logistics" description="Track piezoelectric energy harvesting systems, vibration-to-electricity conversion logistics, footfall power generation, and kinetic energy harvesting distribution for smart cities and transport infrastructure across India" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="pel-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`pel-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-purple-900 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="pel-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="pel-kpi-card"><CardContent className="p-4"><p className="pel-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="pel-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="pel-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="pel-chart-title text-sm">Power Output (kW) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#7e22ce" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="pel-chart-title text-sm">Installations by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="pel-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="pel-chart-title text-sm">Efficiency (%) by Piezo Type</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.effData}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} domain={[55, 95]} /><Tooltip /><Bar dataKey="value" fill="#9333ea" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="pel-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="pel-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`pel-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-purple-900'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.piezoType} | {r.state}</p>
              <p className="text-xs mt-1">{r.powerOutputKW.toLocaleString()} kW | {r.efficiency}% efficiency | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="pel-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="pel-chart-title text-sm">Power Output vs Investment by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="powerOutputKW" stroke="#7e22ce" name="Power kW" /><Line yAxisId="right" type="monotone" dataKey="investmentCr" stroke="#c084fc" name="Investment &#8377; Cr" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="pel-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#581c87" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="pel-chart-title text-sm">Piezo Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.matBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#9333ea" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="pel-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="pel-insights grid grid-cols-2 gap-4">
        <Card className="pel-insight-card border-l-4 border-l-purple-900"><CardContent className="p-5">
          <h4 className="pel-insight-title font-semibold text-base">India&apos;s &#8377;8,500 Cr Piezoelectric Energy Market by 2030</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s piezoelectric energy harvesting market growing at 28% CAGR, projected to reach &#8377;8,500 Cr by 2030. With 1.4 billion population generating massive footfall energy in urban areas, smart city projects across 100 cities are mandating piezoelectric integration. Bureau of Energy Efficiency (BEE) estimating 2,500 MW recoverable from footfall and vehicular traffic nationwide.</p>
        </CardContent></Card>
        <Card className="pel-insight-card border-l-4 border-l-purple-900"><CardContent className="p-5">
          <h4 className="pel-insight-title font-semibold text-base">Railway Vibration Harvesting: 5,000 MW Potential</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Indian Railways operates 68,000 km of track with 23 million daily passengers creating enormous vibration energy. PZT ceramic pads under tracks can generate 50-100 kW per km of busy track. Indian Railways targeting 500 MW piezoelectric capacity by 2028 under Mission Net Zero Carbon, converting train vibrations into clean power for stations and signalling.</p>
        </CardContent></Card>
        <Card className="pel-insight-card border-l-4 border-l-purple-900"><CardContent className="p-5">
          <h4 className="pel-insight-title font-semibold text-base">Lead-Free Piezo Ceramics: Eco Innovation Wave</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India banning lead-containing electronics by 2027 under E-waste Management Rules, driving shift to KNN and BNT-based lead-free piezo ceramics. CSIR and IIT Madras developing high-performance lead-free compositions matching PZT efficiency at 65% lower environmental impact. &#8377;1,200 Cr PLI for green piezo manufacturing announced in Union Budget 2025.</p>
        </CardContent></Card>
        <Card className="pel-insight-card border-l-4 border-l-purple-900"><CardContent className="p-5">
          <h4 className="pel-insight-title font-semibold text-base">Airport Runway Energy: Unlocking Aviation Power</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s 136 airports handle 400 million passengers annually, with aircraft landings generating massive kinetic energy. Piezoelectric runway systems at Delhi, Mumbai and Bangalore airports targeting 5 MW capacity each. AAI (Airport Authority of India) allocating &#8377;2,000 Cr for piezo-airstrip development as part of green airport certification mandate by 2027.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
