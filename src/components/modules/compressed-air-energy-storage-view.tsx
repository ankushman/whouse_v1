'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface CASRecord {
  id: string; projectId: string; city: string; operator: string; storageType: string
  capacityMWh: number; investmentCr: number; pressureBar: number; efficiency: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#0e7490', '#0891b2', '#06b6d4', '#22d3ee', '#67e8f9', '#155e75', '#164e63', '#083344']

const records: CASRecord[] = [
  { id: 'CAS-0001', projectId: 'CAS-001', city: 'Bhilai', operator: 'SAIL CAES Bhilai Plant', storageType: 'Salt Cavern Adiabatic 150MWh',
    capacityMWh: 150, investmentCr: 520, pressureBar: 200, efficiency: 72.0, status: 'Delivered', priority: 'Critical', origin: 'SAIL Bhilai Salt Mine', destination: 'BSP Power House', shipDate: '2025-07-05', transitDays: 1, state: 'Chhattisgarh',
    remarks: 'Salt cavern adiabatic compressed air storage at Bhilai Steel Plant with 150 MWh capacity using 200 bar storage pressure. Underground salt cavern provides near-isothermal compression eliminating thermal losses. &#8377;520 Cr project supports 500 MW BSP plant peak shaving storing off-peak power in underground cavern for daytime steel rolling mill demand spikes at SAIL Bhilai expansion complex.' },
  { id: 'CAS-0002', projectId: 'CAS-002', city: 'Mundra', operator: 'Adani CAES Gujarat', storageType: 'Above Ground CAES 80MWh',
    capacityMWh: 80, investmentCr: 280, pressureBar: 120, efficiency: 58.5, status: 'Delivered', priority: 'High', origin: 'Adani Kutch Pipeline', destination: 'Mundra Power Hub', shipDate: '2025-07-10', transitDays: 2, state: 'Gujarat',
    remarks: 'Above-ground compressed air energy storage at Adani Mundra with 80 MWh capacity using 120 bar high-pressure steel vessels. Modular design enables rapid deployment near existing gas turbine peaker plants. &#8377;280 Cr installation provides 80 MW for 1 hour replacing gas-fired peaker at Mundra SEZ reducing LNG import dependency by &#8377;45 Cr annually for Adani Power western grid operations.' },
  { id: 'CAS-0003', projectId: 'CAS-003', city: 'Bellary', operator: 'JSW Steel CAES', storageType: 'Mine Shaft CAES 100MWh',
    capacityMWh: 100, investmentCr: 350, pressureBar: 150, efficiency: 65.2, status: 'Delivered', priority: 'High', origin: 'JSW Bellary Mine', destination: 'JSW Vijayanagar', shipDate: '2025-07-02', transitDays: 1, state: 'Karnataka',
    remarks: 'Abandoned mine shaft CAES at JSW Steel Bellary with 100 MWh capacity using 150 bar compression in 300m deep iron ore mine shaft. Repurposes depleted Kiriburu iron mine for compressed air storage eliminating mine reclamation cost. &#8377;350 Cr project provides Vijayanagar steel works with 100 MW peak power for 1 hour during electric arc furnace startup reducing JSW grid power purchase during Karnataka evening peak demand.' },
  { id: 'CAS-0004', projectId: 'CAS-004', city: 'Jharsuguda', operator: 'Vedanta CAES Plant', storageType: 'Lined Rock Cavern 120MWh',
    capacityMWh: 120, investmentCr: 410, pressureBar: 180, efficiency: 68.3, status: 'Delivered', priority: 'Critical', origin: 'Vedanta Bauxite Mine', destination: 'Jharsuguda Smelter', shipDate: '2025-06-28', transitDays: 3, state: 'Odisha',
    remarks: 'Lined rock cavern compressed air storage at Vedanta Jharsuguda aluminium smelter with 120 MWh capacity using 180 bar pressure in lined underground cavern. System captures waste heat from aluminium pot rooms for isothermal compression boosting efficiency. &#8377;410 Cr deployment provides 120 MW peak smelter power reducing Vedanta dependency on Odisha state grid during power deficit periods affecting aluminium production continuity.' },
  { id: 'CAS-0005', projectId: 'CAS-005', city: 'Singrauli', operator: 'NTPC CAES Pilot', storageType: 'Adiabatic CAES 200MWh',
    capacityMWh: 200, investmentCr: 650, pressureBar: 250, efficiency: 75.8, status: 'In Transit', priority: 'Critical', origin: 'NTPC Singrauli Plant', destination: 'Northern Grid Hub', shipDate: '2025-07-15', transitDays: 4, state: 'Madhya Pradesh',
    remarks: 'Adiabatic compressed air energy storage en route to NTPC Singrauli super thermal power plant with 200 MWh capacity at 250 bar ultra-high pressure. Thermal energy storage module captures compression heat for re-heating during expansion achieving 75.8% round-trip efficiency. &#8377;650 Cr project is India&apos;s largest CAES installation providing Northern Regional Load Despatch Centre with 200 MW grid regulation capacity for 1 hour during evening peak.' },
  { id: 'CAS-0006', projectId: 'CAS-006', city: 'Dhanbad', operator: 'BCCL Mine CAES', storageType: 'Coal Mine CAES 60MWh',
    capacityMWh: 60, investmentCr: 195, pressureBar: 100, efficiency: 62.4, status: 'Delivered', priority: 'Medium', origin: 'BCCL Jharia Mine', destination: 'Dhanbad Grid Station', shipDate: '2025-07-08', transitDays: 2, state: 'Jharkhand',
    remarks: 'Coal mine compressed air storage at BCCL Jharia with 60 MWh capacity using 100 bar pressure in sealed abandoned coal mine chambers. Mine sealing prevents methane ingress for safe high-pressure air storage. &#8377;195 Cr project under BCCL mine closure and just transition programme converts depleted coal infrastructure into grid storage asset serving Dhanbad industrial load including mining equipment manufacturers and railway workshops.' },
  { id: 'CAS-0007', projectId: 'CAS-007', city: 'Kanyakumari', operator: 'TNEB CAES Coastal', storageType: 'Underwater CAES 40MWh',
    capacityMWh: 40, investmentCr: 145, pressureBar: 80, efficiency: 55.7, status: 'Delivered', priority: 'Medium', origin: 'TNEB Coastal Plant', destination: 'Kanyakumari Substation', shipDate: '2025-06-25', transitDays: 2, state: 'Tamil Nadu',
    remarks: 'Underwater compressed air energy storage at Kanyakumari coast with 40 MWh capacity using 80 bar pressure in submerged flexible bags at 100m ocean depth. Hydrostatic water pressure enables lower-cost containment than steel pressure vessels. &#8377;145 Cr pilot leverages Bay of Bengal constant temperature for isothermal operation supporting Tamil Nadu coastal wind and solar integration near India Land&apos;s End renewable energy zone.' },
  { id: 'CAS-0008', projectId: 'CAS-008', city: 'Jaipur', operator: 'RVPN CAES Desert', storageType: 'Sandstone Aquifer 90MWh',
    capacityMWh: 90, investmentCr: 305, pressureBar: 140, efficiency: 64.1, status: 'Delivered', priority: 'High', origin: 'Jaisalmer Aquifer', destination: 'Jaipur 400kV Station', shipDate: '2025-07-12', transitDays: 5, state: 'Rajasthan',
    remarks: 'Sandstone aquifer compressed air storage at Jaisalmer with 90 MWh capacity using 140 bar pressure in naturally porous sandstone formations 800m below Thar Desert. Deep aquifer provides free geological containment eliminating cavern excavation cost. &#8377;305 Cr project stores excess Bhadla solar power in underground sandstone for evening dispatch through Jaipur 400kV grid replacing gas turbine peakers in Rajasthan&apos;s solar-heavy transmission network.' },
  { id: 'CAS-0009', projectId: 'CAS-009', city: 'Nagpur', operator: 'MSEDCL CAES Central', storageType: 'Hard Rock CAES 70MWh',
    capacityMWh: 70, investmentCr: 240, pressureBar: 160, efficiency: 66.9, status: 'Delayed', priority: 'High', origin: 'WCL Nagpur Mine', destination: 'Nagpur 220kV Station', shipDate: '2025-06-15', transitDays: 3, state: 'Maharashtra',
    remarks: 'Hard rock compressed air storage at Western Coalfields Nagpur with 70 MWh capacity using 160 bar pressure in excavated granite cavern at 250m depth delayed by monsoon flooding of mine access tunnel. &#8377;240 Cr deployment provides Nagpur-Vidarbha industrial corridor with peak power for 1 hour serving MIDC Butibori and Hingna industrial estates reducing load shedding frequency during Maharashtra&apos;s agricultural pump load season September-October.' },
  { id: 'CAS-0010', projectId: 'CAS-010', city: 'Itanagar', operator: 'Arunachal CAES Mountain', storageType: 'Mountain CAES 50MWh',
    capacityMWh: 50, investmentCr: 175, pressureBar: 130, efficiency: 70.5, status: 'Delivered', priority: 'High', origin: 'Arunachal Hydro', destination: 'Itanagar Grid', shipDate: '2025-07-01', transitDays: 8, state: 'Arunachal Pradesh',
    remarks: 'Mountain compressed air storage near Itanagar with 50 MWh capacity using 130 bar pressure in natural Himalayan rock fissures at 600m elevation. Cold mountain ambient improves compressor efficiency by 8% versus plains installation. &#8377;175 Cr project stores excess Siang basin hydropower during monsoon for dry winter dispatch supporting Arunachal Pradesh capital complex and defence installations along India-China border for reliable year-round power supply.' },
  { id: 'CAS-0011', projectId: 'CAS-011', city: 'Bhubaneswar', operator: 'OPTCL CAES Salt Dome', storageType: 'Salt Dome CAES 110MWh',
    capacityMWh: 110, investmentCr: 380, pressureBar: 190, efficiency: 71.2, status: 'Delivered', priority: 'Critical', origin: 'OPTCL Puri Salt Dome', destination: 'Bhubaneswar Grid', shipDate: '2025-07-18', transitDays: 2, state: 'Odisha',
    remarks: 'Salt dome compressed air storage at Puri coast Odisha with 110 MWh capacity using 190 bar pressure in solution-mined salt dome cavern at 500m depth. Coastal salt dome geology ideal for large-volume low-cost cavern creation. &#8377;380 Cr project integrates with Paradeep and Dhamra port renewable energy zones storing offshore wind power for grid dispatch serving Bhubaneswar-Cuttack industrial corridor under OPTCL transmission network expansion plan.' },
  { id: 'CAS-0012', projectId: 'CAS-012', city: 'Vijayawada', operator: 'APGCL CAES Delta', storageType: 'Delta Aquifer CAES 55MWh',
    capacityMWh: 55, investmentCr: 190, pressureBar: 110, efficiency: 60.3, status: 'Processing', priority: 'Low', origin: 'Krishna Delta Aquifer', destination: 'Vijayawada Grid', shipDate: '2025-07-22', transitDays: 2, state: 'Andhra Pradesh',
    remarks: 'Delta aquifer compressed air storage at Krishna River delta near Vijayawada with 55 MWh capacity using 110 bar pressure in alluvial aquifer 400m below Godavari-Krishina delta region. Sedimentary basin provides 200 GWh theoretical storage potential. &#8377;190 Cr pilot under APGCL evaluates delta aquifer CAES viability for large-scale deployment across Godavari basin supporting Andhra Pradesh 25,000 MW solar target with affordable long-duration storage solution.' },
  { id: 'CAS-0013', projectId: 'CAS-013', city: 'Raipur', operator: 'CSEB CAES Chhattisgarh', storageType: 'Basalt Cavern 85MWh',
    capacityMWh: 85, investmentCr: 290, pressureBar: 170, efficiency: 67.8, status: 'Delivered', priority: 'Medium', origin: 'CSEB Korba Mine', destination: 'Raipur Grid Station', shipDate: '2025-07-06', transitDays: 2, state: 'Chhattisgarh',
    remarks: 'Basalt cavern compressed air storage at Korba with 85 MWh capacity using 170 bar pressure in excavated Deccan basalt formation at 200m depth. Dense basalt provides excellent airtight containment reducing air leakage losses below 2% annually. &#8377;290 Cr deployment serves NTPC Korba and BALCO smelter corridor providing 85 MW peaking for 1 hour reducing Chhattisgarh state grid power purchase during evening agricultural pump demand peak for rice irrigation season.' },
  { id: 'CAS-0014', projectId: 'CAS-014', city: 'Leh', operator: 'NHPC CAES Ladakh', storageType: 'High Altitude CAES 35MWh',
    capacityMWh: 35, investmentCr: 125, pressureBar: 90, efficiency: 73.5, status: 'Delayed', priority: 'High', origin: 'NHPC Leh Station', destination: 'Leh Solar Storage', shipDate: '2025-06-20', transitDays: 10, state: 'Ladakh',
    remarks: 'High altitude compressed air storage at Leh delayed by winter road closure logistics for heavy equipment transport. 35 MWh capacity using 90 bar pressure in Ladakh granite formations at 3,500m altitude. Thin cold air improves compressor and expander efficiency by 12% versus sea-level. &#8377;125 Cr project stores surplus Leh solar for winter nights replacing diesel generators at -30&#176;C ambient for Siachen military base and Leh civilian population of 35,000 during 6-month winter road isolation.' },
]

export default function CompressedAirEnergyStorageView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof CASRecord])))
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
    { label: 'Total Capacity', value: `${filtered.reduce((a: number, r) => a + r.capacityMWh, 0).toLocaleString()} MWh` },
    { label: 'Avg Efficiency', value: `${(filtered.reduce((a: number, r) => a + r.efficiency, 0) / Math.max(1, filtered.length)).toFixed(1)}%` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Avg Pressure', value: `${(filtered.reduce((a: number, r) => a + r.pressureBar, 0) / Math.max(1, filtered.length)).toFixed(0)} bar` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: CASRecord) => string, val: (r: CASRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.capacityMWh)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const matBar = grp(r => r.storageType, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const effData = filtered.map(r => ({ name: r.storageType.split(' ').slice(0, 2).join(' '), value: r.efficiency }))
    const lm = filtered.reduce((a: Record<string, { capacityMWh: number; investmentCr: number }>, r) => {
      if (!a[r.state]) a[r.state] = { capacityMWh: 0, investmentCr: 0 }
      a[r.state].capacityMWh += r.capacityMWh; a[r.state].investmentCr += r.investmentCr; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, capacityMWh: v.capacityMWh, investmentCr: v.investmentCr }))
    return { barState, pieState, statusPie, matBar, priorityPie, totalInvest, effData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="cas-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Compressed Air Storage' }]} />
      <PageHeader title="Compressed Air Energy Storage Logistics" description="Track compressed air energy storage supply chains, CAES system logistics, underground cavern and mine shaft air storage distribution, and grid-scale mechanical energy storage deployment across India" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="cas-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`cas-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-cyan-800 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="cas-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="cas-kpi-card"><CardContent className="p-4"><p className="cas-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="cas-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="cas-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="cas-chart-title text-sm">Storage Capacity (MWh) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#0e7490" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="cas-chart-title text-sm">Installations by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="cas-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="cas-chart-title text-sm">Efficiency (%) by Storage Type</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.effData}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} domain={[50, 78]} /><Tooltip /><Bar dataKey="value" fill="#0891b2" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="cas-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="cas-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`cas-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-cyan-800'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.storageType} | {r.state}</p>
              <p className="text-xs mt-1">{r.capacityMWh} MWh | {r.pressureBar} bar | {r.efficiency}% efficiency | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="cas-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="cas-chart-title text-sm">Capacity vs Investment by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="capacityMWh" stroke="#0e7490" name="Capacity MWh" /><Line yAxisId="right" type="monotone" dataKey="investmentCr" stroke="#67e8f9" name="Investment &#8377; Cr" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="cas-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#155e75" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="cas-chart-title text-sm">Storage Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.matBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#0891b2" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="cas-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="cas-insights grid grid-cols-2 gap-4">
        <Card className="cas-insight-card border-l-4 border-l-cyan-800"><CardContent className="p-5">
          <h4 className="cas-insight-title font-semibold text-base">India&apos;s Salt Cavern CAES: 100 GWh Geological Potential</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s salt formations in Rajasthan, Gujarat, Himachal Pradesh and Andhra Pradesh offer 100 GWh of compressed air storage potential in solution-mined salt caverns. Geological Survey of India identified 28 salt dome sites suitable for CAES with 40-300m cavern heights at 500-1,500m depth. ONGC and GAIL partnering for 5 pilot salt cavern CAES projects by 2028 targeting &#8377;15,000 Cr investment under National Energy Storage Mission using existing solution mining expertise from underground natural gas storage programme.</p>
        </CardContent></Card>
        <Card className="cas-insight-card border-l-4 border-l-cyan-800"><CardContent className="p-5">
          <h4 className="cas-insight-title font-semibold text-base">Coal Mine CAES: Just Transition for 350 Abandoned Mines</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s 350 abandoned coal mines offer 8 GWh CAES potential using sealed underground voids at 100-200m depth. Coal India and SCCL partnering with Indian Institute of Technology Dhanbad for mine safety certification and methane sealing technology. &#8377;8,000 Cr National Mine-to-CAES programme targeting 50 coal mine conversions by 2032 creating 10,000 green jobs in Jharkhand, Chhattisgarh, Odisha and Telangana coal districts while providing grid storage for state electricity boards.</p>
        </CardContent></Card>
        <Card className="cas-insight-card border-l-4 border-l-cyan-800"><CardContent className="p-5">
          <h4 className="cas-insight-title font-semibold text-base">Adiabatic CAES: 75% Efficiency Breakthrough for India</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">NTPC Singrauli adiabatic CAES achieving 75.8% efficiency through thermal energy storage capturing compression heat at 600&#176;C for re-heating during expansion. CSIR-NAL and IIT Bombay developing advanced ceramic thermal storage bricks reducing heat loss to below 3% over 12-hour storage cycle. Adiabatic CAES eliminates fuel consumption completely unlike conventional gas-fired CAES achieving true zero-emission grid storage at &#8377;3.5 Cr/MWh versus lithium-ion at &#8377;25 Cr/MWh for 8+ hour duration applications.</p>
        </CardContent></Card>
        <Card className="cas-insight-card border-l-4 border-l-cyan-800"><CardContent className="p-5">
          <h4 className="cas-insight-title font-semibold text-base">Underwater CAES: Bay of Bengal and Lakshadweep Potential</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s 7,500 km coastline offers 15 GWh underwater CAES potential using submerged flexible air bags at 100-200m ocean depth. National Institute of Ocean Technology Chennai developing pressure-resistant composite bags with 20-year service life in saline conditions. &#8377;3,500 Cr underwater CAES programme targeting Lakshadweep, Andaman islands and Tamil Nadu coast for wind-solar integration replacing diesel generators at &#8377;8 Cr/MWh lifetime cost versus imported diesel at &#8377;18 Cr/MWh for island electrification.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
