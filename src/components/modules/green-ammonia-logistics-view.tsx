'use client'
import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
} from 'recharts'

const COLOR = '#059669'
const PIE_COLORS = ['#059669', '#0d9488', '#0891b2', '#2563eb', '#7c3aed', '#c026d3', '#e11d48', '#f59e0b']

interface GAMRecord {
  id: string; projectId: string; state: string; plant: string; producer: string; process: string
  capacityKTPA: number; greenPremium: number; investmentCr: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; zone: string; remarks: string
}

const records: GAMRecord[] = [
  { id: 'gam-001', projectId: 'PRJ-4101', state: 'Odisha', plant: 'Rourkela', producer: 'SAIL',
    process: 'Alkaline Electrolysis Haber', capacityKTPA: 450, greenPremium: 18, investmentCr: 2850,
    status: 'Active', priority: 'High', origin: 'Rourkela Steel Plant', destination: 'Paradip Port', shipDate: '2024-03-15', transitDays: 3, zone: 'East', remarks: 'Pilot phase operational since Q1 2024' },
  { id: 'gam-002', projectId: 'PRJ-4102', state: 'Gujarat', plant: 'Mithapur', producer: 'Tata Chemicals',
    process: 'Biomass Gasification Ammonia', capacityKTPA: 320, greenPremium: 22, investmentCr: 1980,
    status: 'Active', priority: 'High', origin: 'Mithapur Complex', destination: 'Kandla Port', shipDate: '2024-01-20', transitDays: 2, zone: 'West', remarks: 'Biomass feedstock from local agricultural sources' },
  { id: 'gam-003', projectId: 'PRJ-4103', state: 'Gujarat', plant: 'Mundra', producer: 'Adani',
    process: 'Autothermal Reforming + CCS', capacityKTPA: 600, greenPremium: 15, investmentCr: 4200,
    status: 'Delayed', priority: 'Critical', origin: 'Mundra SEZ', destination: 'Mundra Port', shipDate: '2024-06-01', transitDays: 1, zone: 'West', remarks: 'CCS integration facing technical delays in pipeline' },
  { id: 'gam-004', projectId: 'PRJ-4104', state: 'Maharashtra', plant: 'Nagothane', producer: 'Reliance',
    process: 'Green H2 + N2 Haber (Electrolytic)', capacityKTPA: 800, greenPremium: 12, investmentCr: 5600,
    status: 'Active', priority: 'High', origin: 'Nagothane Refinery', destination: 'JNPT Mumbai', shipDate: '2023-11-10', transitDays: 2, zone: 'West', remarks: 'Largest green ammonia facility in India' },
  { id: 'gam-005', projectId: 'PRJ-4105', state: 'Uttar Pradesh', plant: 'Singrauli', producer: 'NTPC',
    process: 'e-NH3 Solid Oxide Electrolysis', capacityKTPA: 250, greenPremium: 25, investmentCr: 1750,
    status: 'In Progress', priority: 'Medium', origin: 'Singrauli Thermal Plant', destination: 'Varanasi Hub', shipDate: '2024-08-20', transitDays: 4, zone: 'North', remarks: 'SOE technology demonstration with 50MW electrolyzer' },
  { id: 'gam-006', projectId: 'PRJ-4106', state: 'Gujarat', plant: 'Vadodara', producer: 'IOCL',
    process: 'Blue H2 SMR + CCS', capacityKTPA: 500, greenPremium: 20, investmentCr: 3500,
    status: 'Active', priority: 'High', origin: 'Gujarat Refinery', destination: 'Dahej Port', shipDate: '2024-02-28', transitDays: 2, zone: 'West', remarks: 'Retrofit of existing SMR with CCS technology' },
  { id: 'gam-007', projectId: 'PRJ-4107', state: 'Gujarat', plant: 'Kandla', producer: 'Indian Farmers Fertiliser Cooperative (IFFCO)',
    process: 'Methane Pyrolysis Turquoise H2', capacityKTPA: 380, greenPremium: 19, investmentCr: 2660,
    status: 'Delayed', priority: 'High', origin: 'Kandla Fertilizer Complex', destination: 'Kandla Port', shipDate: '2024-07-15', transitDays: 1, zone: 'West', remarks: 'Turquoise H2 pyrolysis reactor under commissioning' },
  { id: 'gam-008', projectId: 'PRJ-4108', state: 'Rajasthan', plant: 'Kota', producer: 'Chambal Fertilisers',
    process: 'Anion Exchange Membrane', capacityKTPA: 200, greenPremium: 28, investmentCr: 1400,
    status: 'In Progress', priority: 'Medium', origin: 'Kota Plant', destination: 'IGI Delhi Hub', shipDate: '2024-09-05', transitDays: 3, zone: 'North', remarks: 'AEM technology pilot targeting 200 KTPA output' },
  { id: 'gam-009', projectId: 'PRJ-4109', state: 'Maharashtra', plant: 'Taloja', producer: 'Deepak Fertilisers',
    process: 'Alkaline Electrolysis Haber', capacityKTPA: 280, greenPremium: 16, investmentCr: 1960,
    status: 'Active', priority: 'Medium', origin: 'Taloja Industrial Area', destination: 'Mumbai Port', shipDate: '2024-04-12', transitDays: 1, zone: 'West', remarks: 'Co-located with existing fertilizer manufacturing' },
  { id: 'gam-010', projectId: 'PRJ-4110', state: 'Andhra Pradesh', plant: 'Kakinada', producer: 'National Fertilisers (NFCL)',
    process: 'Green H2 + N2 Haber (Electrolytic)', capacityKTPA: 350, greenPremium: 21, investmentCr: 2450,
    status: 'Active', priority: 'High', origin: 'Kakinada Complex', destination: 'Kakinada Port', shipDate: '2024-05-18', transitDays: 1, zone: 'South', remarks: 'Solar-powered electrolysis with grid backup system' },
  { id: 'gam-011', projectId: 'PRJ-4111', state: 'Maharashtra', plant: 'Thal', producer: 'Rashtriya Chemicals & Fertilizers (RCF)',
    process: 'Biomass Gasification Ammonia', capacityKTPA: 220, greenPremium: 24, investmentCr: 1540,
    status: 'Planned', priority: 'Low', origin: 'Thal Fertilizer Complex', destination: 'Mumbai Port', shipDate: '2025-02-01', transitDays: 1, zone: 'West', remarks: 'FEED study completed, awaiting environmental clearance' },
  { id: 'gam-012', projectId: 'PRJ-4112', state: 'Gujarat', plant: 'Vadodara', producer: 'Gujarat State Fertilizers (GSFC)',
    process: 'Autothermal Reforming + CCS', capacityKTPA: 420, greenPremium: 17, investmentCr: 2940,
    status: 'Active', priority: 'High', origin: 'GSFC Complex', destination: 'Dahej Port', shipDate: '2024-01-05', transitDays: 2, zone: 'West', remarks: 'CCS capacity rated at 1.2 MTPA CO2 captured' },
  { id: 'gam-013', projectId: 'PRJ-4113', state: 'Madhya Pradesh', plant: 'Bhopal', producer: 'Madhya Pradesh Glycols',
    process: 'e-NH3 Solid Oxide Electrolysis', capacityKTPA: 150, greenPremium: 30, investmentCr: 1050,
    status: 'In Progress', priority: 'Medium', origin: 'Bhopal Plant', destination: 'Indore Hub', shipDate: '2024-10-10', transitDays: 2, zone: 'Central', remarks: 'Small-scale SOE demonstration with 30MW input' },
  { id: 'gam-014', projectId: 'PRJ-4114', state: 'Tamil Nadu', plant: 'Chennai', producer: 'Solar Electric Company',
    process: 'Anion Exchange Membrane', capacityKTPA: 180, greenPremium: 26, investmentCr: 1260,
    status: 'Planned', priority: 'Low', origin: 'Chennai Solar Park', destination: 'Chennai Port', shipDate: '2025-04-15', transitDays: 1, zone: 'South', remarks: 'Dedicated 75MW solar farm for AEM electrolysis' },
]

const filterGroups = [
  { key: 'status', label: 'Status', options: [
    { value: 'Active', count: 7 }, { value: 'Delayed', count: 2 }, { value: 'In Progress', count: 3 }, { value: 'Planned', count: 2 },
  ]},
  { key: 'priority', label: 'Priority', options: [
    { value: 'High', count: 8 }, { value: 'Medium', count: 4 }, { value: 'Low', count: 2 }, { value: 'Critical', count: 1 },
  ]},
  { key: 'process', label: 'Process', options: [
    { value: 'Alkaline Electrolysis Haber', count: 2 }, { value: 'Biomass Gasification Ammonia', count: 2 },
    { value: 'Autothermal Reforming + CCS', count: 2 }, { value: 'Green H2 + N2 Haber (Electrolytic)', count: 2 },
    { value: 'e-NH3 Solid Oxide Electrolysis', count: 2 }, { value: 'Blue H2 SMR + CCS', count: 1 },
    { value: 'Methane Pyrolysis Turquoise H2', count: 1 }, { value: 'Anion Exchange Membrane', count: 2 },
  ]},
  { key: 'zone', label: 'Zone', options: [
    { value: 'North', count: 2 }, { value: 'South', count: 2 }, { value: 'East', count: 1 }, { value: 'West', count: 8 }, { value: 'Central', count: 1 },
  ]},
]

export default function GreenAmmoniaLogisticsView() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [searchQuery, setSearchQuery] = useState('')

  const toggleFilter = (group: string, value: string) => setActiveFilters(prev => {
    const cur = prev[group] || []
    const next = cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]
    return next.length ? { ...prev, [group]: next } : Object.fromEntries(Object.entries(prev).filter(([k]) => k !== group))
  })

  const filtered = useMemo(() => records.filter(r => {
    if (searchQuery && !`${r.plant} ${r.producer} ${r.state}`.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return Object.entries(activeFilters).every(([k, vs]) => !vs.length || vs.includes(r[k as keyof GAMRecord] as string))
  }), [searchQuery, activeFilters])

  const totalCap = filtered.reduce((a: number, r) => a + r.capacityKTPA, 0)
  const avgPremium = filtered.length ? filtered.reduce((a: number, r) => a + r.greenPremium, 0) / filtered.length : 0
  const carbonAvoided = Math.round(totalCap * 1.6)
  const totalInv = filtered.reduce((a: number, r) => a + r.investmentCr, 0)

  const toArr = (obj: Record<string, number>) => Object.entries(obj).map(([name, value]) => ({ name, value }))
  const stateData = toArr(filtered.reduce((a: Record<string, number>, r) => { a[r.state] = (a[r.state] || 0) + r.capacityKTPA; return a }, {}))
  const zoneData = toArr(filtered.reduce((a: Record<string, number>, r) => { a[r.zone] = (a[r.zone] || 0) + 1; return a }, {}))
  const statusData = toArr(filtered.reduce((a: Record<string, number>, r) => { a[r.status] = (a[r.status] || 0) + 1; return a }, {}))
  const lineData = filtered.map(r => ({ name: r.producer.slice(0, 12), capacity: r.capacityKTPA, premium: r.greenPremium }))
  const invKTPA = filtered.map(r => ({ name: r.producer.slice(0, 12), value: Math.round(r.investmentCr / r.capacityKTPA * 10) / 10 }))
  const priorityData = toArr(filtered.reduce((a: Record<string, number>, r) => { a[r.priority] = (a[r.priority] || 0) + 1; return a }, {}))
  const processData = toArr(filtered.reduce((a: Record<string, number>, r) => { const k = r.process.split(' ').slice(0, 2).join(' '); a[k] = (a[k] || 0) + 1; return a }, {}))
  const zoneCap = toArr(filtered.reduce((a: Record<string, number>, r) => { a[r.zone] = (a[r.zone] || 0) + r.capacityKTPA; return a }, {}))

  return (
    <div className="space-y-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Energy' }, { label: 'Green Ammonia Logistics' }]} />
      <PageHeader title="Green Ammonia Logistics" description="Track green ammonia production, logistics &amp; carbon avoidance across India" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="flex gap-2 border-b pb-2">
        {['dashboard', 'registry', 'analytics', 'insights'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-1.5 text-sm rounded-t font-medium ${activeTab === t ? 'bg-white border border-b-white -mb-[1px] text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Total Green Ammonia Capacity', value: `${totalCap.toLocaleString()} KTPA` },
              { label: 'Avg Green Premium', value: `${avgPremium.toFixed(1)}%` },
              { label: 'Carbon Avoided', value: `${carbonAvoided.toLocaleString()} KTPA CO2` },
              { label: 'Total Investment', value: `&#8377;${totalInv.toLocaleString()} Cr` },
            ].map(k => (
              <Card key={k.label}><CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{k.label}</p>
                <p className="text-2xl font-bold" dangerouslySetInnerHTML={{ __html: k.value }} />
              </CardContent></Card>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Capacity by State (KTPA)</CardTitle></CardHeader>
              <CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={stateData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip />
                <Bar dataKey="value" fill={COLOR} radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader>
              <CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={zoneData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label fontSize={11}>
                {zoneData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="space-y-4">
          <div className="grid gap-2">{filtered.map(r => (
            <Card key={r.id} className={`border-l-4 ${r.status === 'Delayed' ? 'border-l-red-500 bg-red-50/30' : ''}`} style={r.status !== 'Delayed' ? { borderLeftColor: COLOR } : undefined}>
              <CardContent className="p-3">
                <div className="flex justify-between items-start"><div>
                  <p className="font-medium text-sm">{r.plant} <span className="text-muted-foreground text-xs">- {r.producer}</span></p>
                  <p className="text-xs text-muted-foreground">{r.state} | {r.process} | {r.capacityKTPA} KTPA | {r.greenPremium}% | &#8377;{r.investmentCr} Cr</p>
                  <p className="text-xs text-muted-foreground">{r.origin} &#8594; {r.destination} | {r.transitDays}d | {r.zone} | {r.remarks}</p>
                </div>
                <Badge variant={r.status === 'Delayed' ? 'destructive' : 'secondary'} className="text-xs shrink-0 ml-2">{r.status}</Badge></div>
              </CardContent>
            </Card>
          ))}</div>
          <div className="grid grid-cols-2 gap-4">
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Capacity by Zone</CardTitle></CardHeader>
              <CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={zoneCap} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip />
                <Bar dataKey="value" fill={COLOR} radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader>
              <CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label fontSize={11}>
                {statusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-2 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Capacity vs Green Premium</CardTitle></CardHeader>
            <CardContent><ResponsiveContainer width="100%" height={250}><LineChart data={lineData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} />
              <Tooltip /><Legend /><Line type="monotone" dataKey="capacity" stroke={COLOR} strokeWidth={2} />
              <Line type="monotone" dataKey="premium" stroke="#f59e0b" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Investment per KTPA (&#8377; Cr)</CardTitle></CardHeader>
            <CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={invKTPA} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip />
              <Bar dataKey="value" fill="#7c3aed" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Priority Distribution</CardTitle></CardHeader>
            <CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={priorityData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip />
              <Bar dataKey="value" fill="#e11d48" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Process Distribution</CardTitle></CardHeader>
            <CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={processData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label fontSize={10}>
              {processData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="grid grid-cols-2 gap-4">
          <Card><CardContent className="p-4">
            <p className="font-semibold text-sm mb-1">Capacity Concentration</p>
            <p className="text-xs text-muted-foreground">Gujarat leads with {stateData.find(d => d.name === 'Gujarat')?.value || 0} KTPA across 5 plants, contributing over 60% of total tracked green ammonia capacity in the western corridor.</p>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <p className="font-semibold text-sm mb-1">Green Premium Trends</p>
            <p className="text-xs text-muted-foreground">Average green premium stands at {avgPremium.toFixed(1)}%. e-NH3 Solid Oxide Electrolysis commands the highest premium at 25-30% due to technology novelty and limited deployment scale.</p>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <p className="font-semibold text-sm mb-1">Investment Efficiency</p>
            <p className="text-xs text-muted-foreground">Investment per KTPA ranges from &#8377;6.3 to &#8377;8.3 Cr. Reliance Nagothane achieves best scale efficiency with 800 KTPA capacity and &#8377;7.0 Cr per KTPA investment ratio.</p>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <p className="font-semibold text-sm mb-1">Delay Analysis</p>
            <p className="text-xs text-muted-foreground">2 projects delayed (Adani Mundra &#8594; CCS integration, IFFCO Kandla &#8594; pyrolysis commissioning). Combined 980 KTPA capacity at risk of timeline slippage in 2024-25.</p>
          </CardContent></Card>
        </div>
      )}
    </div>
  )
}
