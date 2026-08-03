'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface UESRecord {
  id: string; projectId: string; city: string; operator: string; storageType: string
  capacityMWh: number; investmentCr: number; dischargeHours: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#4338ca', '#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff', '#eef2ff']

const records: UESRecord[] = [
  { id: 'UES-001', projectId: 'UES-001', city: 'Kurnool', operator: 'NHES Kurnool Compressed Air', storageType: 'Salt Cavern CAES',
    capacityMWh: 1200, investmentCr: 2800, dischargeHours: 12, status: 'Delivered', priority: 'Critical', origin: 'Kurnool Salt Mines', destination: 'AP Grid Station', shipDate: '2024-01-10', transitDays: 30, state: 'Andhra Pradesh',
    remarks: 'India&apos;s first utility-scale salt cavern CAES at Kurnool, 1.2 GWh compressed air storage in solution-mined salt caverns at 600m depth, discharging 100 MW for 12 hours peak demand' },
  { id: 'UES-002', projectId: 'UES-002', city: 'Jaisalmer', operator: 'Rajasthan UES Authority', storageType: 'Aquifer Thermal',
    capacityMWh: 800, investmentCr: 1800, dischargeHours: 8, status: 'Delivered', priority: 'High', origin: 'Jaisalmer Aquifer', destination: 'Barmer Solar Hub', shipDate: '2024-02-20', transitDays: 25, state: 'Rajasthan',
    remarks: 'Underground aquifer thermal energy storage coupling with 500 MW solar park, storing 800 MWh of hot water at 200m depth for overnight power generation via ORC cycle' },
  { id: 'UES-003', projectId: 'UES-003', city: 'Bellary', operator: 'Karnataka Mining Storage', storageType: 'Abandoned Mine CAES',
    capacityMWh: 600, investmentCr: 1400, dischargeHours: 10, status: 'Delivered', priority: 'High', origin: 'Bellary Iron Mine', destination: 'Ballari Grid', shipDate: '2024-01-28', transitDays: 20, state: 'Karnataka',
    remarks: 'Repurposed iron ore mine shaft at 400m depth for compressed air energy storage, 600 MWh capacity with 60 MW output serving Karnataka grid peak demand in Bellary industrial belt' },
  { id: 'UES-004', projectId: 'UES-004', city: 'Khargone', operator: 'MP Underground Battery', storageType: 'Hard Rock Battery',
    capacityMWh: 500, investmentCr: 2200, dischargeHours: 6, status: 'In Transit', priority: 'High', origin: 'Khargone Granite', destination: 'Indore Grid', shipDate: '2024-05-15', transitDays: 35, state: 'MP',
    remarks: 'Underground battery energy storage carved into granite formation at 150m depth, 500 MWh LFP battery pack providing 6-hour discharge for Indore metro region grid stability' },
  { id: 'UES-005', projectId: 'UES-005', city: 'Dhanbad', operator: 'Jharkhand Mine Energy', storageType: 'Coal Mine Pumped Hydro',
    capacityMWh: 900, investmentCr: 2600, dischargeHours: 8, status: 'Delivered', priority: 'Critical', origin: 'Dhanbad Colliery', destination: 'Jharkhand Grid', shipDate: '2024-03-05', transitDays: 22, state: 'Jharkhand',
    remarks: 'Underground pumped hydro using exhausted coal mine pits at 300m depth differential, 900 MTh capacity with 112 MW generation during evening peak in coal belt region' },
  { id: 'UES-006', projectId: 'UES-006', city: 'Gandhinagar', operator: 'Gujarat Salt Cavern AES', storageType: 'Salt Cavern CAES',
    capacityMWh: 1500, investmentCr: 3200, dischargeHours: 15, status: 'In Transit', priority: 'Critical', origin: 'Kutch Salt Basin', destination: 'SG Highway Grid', shipDate: '2024-06-01', transitDays: 28, state: 'Gujarat',
    remarks: 'Advanced adiabatic CAES in Kutch salt cavern at 800m depth, 1.5 GWh capacity with thermal energy recovery achieving 70% round-trip efficiency, India&apos;s largest UES' },
  { id: 'UES-007', projectId: 'UES-007', city: 'Koderma', operator: 'Bihar Mica Mine Storage', storageType: 'Abandoned Mine Gravity',
    capacityMWh: 350, investmentCr: 950, dischargeHours: 7, status: 'Delivered', priority: 'Medium', origin: 'Koderma Mica Mine', destination: 'Hazaribagh Grid', shipDate: '2024-03-18', transitDays: 18, state: 'Jharkhand',
    remarks: 'Gravity energy storage in abandoned mica mine shaft, 350 MTh using 2,000 tonne weights lowered and raised on 200m vertical shaft providing 50 MW peak output' },
  { id: 'UES-008', projectId: 'UES-008', city: 'Ratnagiri', operator: 'Maharashtra Basalt Storage', storageType: 'Hard Rock CAES',
    capacityMWh: 450, investmentCr: 1200, dischargeHours: 5, status: 'Delivered', priority: 'Medium', origin: 'Ratnagiri Basalt', destination: 'Konkan Grid', shipDate: '2024-04-10', transitDays: 15, state: 'Maharashtra',
    remarks: 'Compressed air storage in engineered basalt caverns at 250m depth near Ratnagiri, 450 MWh supporting coastal wind and solar integration for Konkan region grid' },
  { id: 'UES-009', projectId: 'UES-009', city: 'Cuddapah', operator: 'AP Limestone Storage', storageType: 'Limestone Cavern TES',
    capacityMWh: 700, investmentCr: 1600, dischargeHours: 9, status: 'Processing', priority: 'Medium', origin: 'Cuddapah Quarry', destination: 'Tirupati Grid', shipDate: '2024-07-10', transitDays: 32, state: 'Andhra Pradesh',
    remarks: 'Thermal energy storage in limestone caverns at 180m depth storing 700 MWh of molten salt heat for 6-hour steam generation during evening solar ramp-down' },
  { id: 'UES-010', projectId: 'UES-010', city: 'Bikaner', operator: 'Rajasthan Desert Storage', storageType: 'Sandstone Aquifer CAES',
    capacityMWh: 550, investmentCr: 1100, dischargeHours: 7, status: 'Delivered', priority: 'Medium', origin: 'Bikaner Aquifer', destination: 'Jodhpur Grid', shipDate: '2024-04-05', transitDays: 20, state: 'Rajasthan',
    remarks: 'Sandstone aquifer compressed air storage in Thar desert, 550 MWh utilizing naturally porous sandstone at 200m depth with minimal environmental surface footprint' },
  { id: 'UES-011', projectId: 'UES-011', city: 'Cuttack', operator: 'Odisha Mine Thermal', storageType: 'Abandoned Mine TES',
    capacityMWh: 400, investmentCr: 1000, dischargeHours: 6, status: 'In Transit', priority: 'Medium', origin: 'Talcher Coal Mine', destination: 'Cuttack Grid', shipDate: '2024-05-28', transitDays: 22, state: 'Odisha',
    remarks: 'Thermal energy storage in abandoned Talcher coal mine using crushed rock and heat transfer fluid, 400 MWh capacity for 6-hour discharge supporting Odisha industrial corridor' },
  { id: 'UES-012', projectId: 'UES-012', city: 'Nalgonda', operator: 'Telangana Granite Battery', storageType: 'Hard Rock Battery',
    capacityMWh: 380, investmentCr: 1650, dischargeHours: 5, status: 'Delivered', priority: 'Low', origin: 'Nalgonda Granite', destination: 'Hyderabad Grid', shipDate: '2024-03-28', transitDays: 18, state: 'Telangana',
    remarks: 'Underground battery carved into Deccan granite at 120m depth, 380 MWh sodium-ion battery installation providing frequency regulation for Hyderabad metro grid' },
  { id: 'UES-013', projectId: 'UES-013', city: 'Thiruvarur', operator: 'TN Cauvery Basin CAES', storageType: 'Salt Dome CAES',
    capacityMWh: 650, investmentCr: 1500, dischargeHours: 8, status: 'Delayed', priority: 'Low', origin: 'Nagapattinam Basin', destination: 'Thanjavur Grid', shipDate: '2024-06-15', transitDays: 30, state: 'Tamil Nadu',
    remarks: 'Delayed due to geological survey revision, salt dome CAES in Cauvery delta basin at 500m depth, 650 MWh designed for Tamil Nadu wind corridor balancing' },
  { id: 'UES-014', projectId: 'UES-014', city: 'Gulbarga', operator: 'Karnataka Deccan Trap CAES', storageType: 'Basalt Cavern CAES',
    capacityMWh: 420, investmentCr: 1050, dischargeHours: 6, status: 'Processing', priority: 'Low', origin: 'Gulbarga Basalt', destination: 'Kalaburagi Grid', shipDate: '2024-07-20', transitDays: 25, state: 'Karnataka',
    remarks: 'Deccan trap basalt cavern compressed air storage at 300m depth, 420 MWh for Kalyana-Karnataka region solar intermittency management with 8-hour window' },
]

export default function UndergroundEnergyStorageView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof UESRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'storageType', label: 'Storage Type', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.storageType] = (m[r.storageType] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Storage Capacity', value: `${(filtered.reduce((a: number, r) => a + r.capacityMWh, 0) / 1000).toFixed(1)} GWh` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Avg Discharge Duration', value: `${(filtered.reduce((a: number, r) => a + r.dischargeHours, 0) / Math.max(1, filtered.length)).toFixed(1)} hrs` },
    { label: 'Active Installations', value: String(filtered.filter(r => r.status === 'Delivered').length) },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: UESRecord) => string, val: (r: UESRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.capacityMWh)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const typeBar = grp(r => r.storageType, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const depthData = filtered.map(r => ({ name: r.city.slice(0, 12), value: r.dischargeHours }))
    const lm = filtered.reduce((a: Record<string, { capacityMWh: number; investmentCr: number }>, r) => {
      if (!a[r.state]) a[r.state] = { capacityMWh: 0, investmentCr: 0 }
      a[r.state].capacityMWh += r.capacityMWh; a[r.state].investmentCr += r.investmentCr; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, capacityMWh: v.capacityMWh, investmentCr: v.investmentCr }))
    return { barState, pieState, statusPie, typeBar, priorityPie, totalInvest, depthData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="ues-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Underground Energy Storage' }]} />
      <PageHeader title="Underground Energy Storage Logistics" description="Monitor subsurface energy storage installations including CAES, mine battery, aquifer thermal, and gravity systems across Indian geological formations" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="ues-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`ues-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-indigo-700 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="ues-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="ues-kpi-card"><CardContent className="p-4"><p className="ues-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="ues-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="ues-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="ues-chart-title text-sm">Storage Capacity (MWh) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#4338ca" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="ues-chart-title text-sm">Installations by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="ues-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="ues-chart-title text-sm">Discharge Duration (hrs)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.depthData}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="ues-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="ues-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`ues-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-indigo-700'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.storageType} | {r.state}</p>
              <p className="text-xs mt-1">{r.capacityMWh} MWh | {r.dischargeHours}h discharge | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="ues-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="ues-chart-title text-sm">Capacity MWh vs Investment</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="capacityMWh" stroke="#4338ca" name="Capacity MWh" /><Line yAxisId="right" type="monotone" dataKey="investmentCr" stroke="#f59e0b" name="Investment &#8377;Cr" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="ues-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="ues-chart-title text-sm">Storage Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.typeBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#818cf8" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="ues-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="ues-insights grid grid-cols-2 gap-4">
        <Card className="ues-insight-card border-l-4 border-l-indigo-700"><CardContent className="p-5">
          <h4 className="ues-insight-title font-semibold text-base">India&apos;s 200 GWh Underground Storage Potential</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">GSI estimates India has 200+ GWh of underground energy storage potential across salt formations, abandoned mines, and aquifers. Salt cavern CAES alone could provide 50 GWh in Kutch, Rajasthan, and Cauvery basins at costs 40% below surface-level alternatives.</p>
        </CardContent></Card>
        <Card className="ues-insight-card border-l-4 border-l-indigo-700"><CardContent className="p-5">
          <h4 className="ues-insight-title font-semibold text-base">CAES vs Battery Underground Cost Advantage</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Underground CAES costs &#8377;2.0-2.5 Cr/MWh vs surface lithium-ion at &#8377;3.5-4.5 Cr/MWh. Underground batteries in hard rock caverns achieve &#8377;3.0 Cr/MWh with 25-year lifespan versus 12 years for surface installations, reducing LCOE by 35%.</p>
        </CardContent></Card>
        <Card className="ues-insight-card border-l-4 border-l-indigo-700"><CardContent className="p-5">
          <h4 className="ues-insight-title font-semibold text-base">Renewable Integration via Long-Duration Storage</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s 500 GW renewable target requires 100+ GWh of long-duration storage. Underground systems provide 6-15 hour discharge windows ideal for evening solar ramp and wind intermittency, solving the duck curve challenge facing states like Gujarat and Tamil Nadu.</p>
        </CardContent></Card>
        <Card className="ues-insight-card border-l-4 border-l-indigo-700"><CardContent className="p-5">
          <h4 className="ues-insight-title font-semibold text-base">Mine Reclamation for Energy Storage</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India has 300+ abandoned coal and mineral mines suitable for gravity, CAES, or thermal energy storage. Repurposing these sites creates dual value: environmental remediation of hazardous mine voids plus revenue-generating energy storage infrastructure with zero new land acquisition.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
