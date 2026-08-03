'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface IABRecord {
  id: string; projectId: string; city: string; operator: string; batteryType: string
  capacityMWh: number; investmentCr: number; cycles: number; efficiency: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#78350f', '#92400e', '#a16207', '#ca8a04', '#eab308', '#854d0e', '#713f12', '#422006']

const records: IABRecord[] = [
  { id: 'IAB-0001', projectId: 'IAB-001', city: 'Jamshedpur', operator: 'Tata Steel Iron Air Division', batteryType: 'Fe-Air Alkaline 100MWh',
    capacityMWh: 100, investmentCr: 340, cycles: 12000, efficiency: 52.0, status: 'Delivered', priority: 'Critical', origin: 'Tata Steel Plant', destination: 'Jamshedpur Energy Park', shipDate: '2025-05-05', transitDays: 1, state: 'Jharkhand',
    remarks: 'Iron-air alkaline battery with 100 MWh capacity at Tata Steel Jamshedpur energy park. Uses iron anode with air cathode for ultra-low-cost grid storage at &#8377;3.4 Cr/MWh. 12,000 cycle lifespan provides 30-year daily cycling for steel plant peak shaving. India&apos;s first commercial iron-air deployment under Tata Green Energy programme.' },
  { id: 'IAB-0002', projectId: 'IAB-002', city: 'Rourkela', operator: 'SAIL RSP Energy Storage', batteryType: 'Fe-Air Neutral Salt 80MWh',
    capacityMWh: 80, investmentCr: 260, cycles: 10000, efficiency: 48.5, status: 'Delivered', priority: 'Critical', origin: 'Rourkela Steel Plant', destination: 'RSP Grid Substation', shipDate: '2025-05-10', transitDays: 2, state: 'Odisha',
    remarks: 'Iron-air neutral salt battery system for SAIL Rourkela steel plant with 80 MWh capacity. Neutral pH electrolyte eliminates corrosion issues extending system lifetime. &#8377;260 Cr project supports 500 MW RSP plant frequency regulation services under POSOCO ancillary services market for eastern grid stability.' },
  { id: 'IAB-0003', projectId: 'IAB-003', city: 'Bhilai', operator: 'BSP Iron Air Battery Ops', batteryType: 'Fe-Air Deep Discharge 60MWh',
    capacityMWh: 60, investmentCr: 190, cycles: 8000, efficiency: 45.2, status: 'Delivered', priority: 'High', origin: 'Bhilai Steel Plant', destination: 'BSP Power House', shipDate: '2025-05-02', transitDays: 1, state: 'Chhattisgarh',
    remarks: 'Deep discharge iron-air battery at Bhilai Steel Plant with 60 MWh capacity rated for 80% depth of discharge. Integrated with BSP captive power plant for load leveling during electric arc furnace operation. &#8377;190 Cr deployment reduces grid power purchase by 18% during peak demand hours for Bhilai expansion project.' },
  { id: 'IAB-0004', projectId: 'IAB-004', city: 'Mumbai', operator: 'Adani Green Iron Air', batteryType: 'Fe-Air Hybrid 120MWh',
    capacityMWh: 120, investmentCr: 420, cycles: 15000, efficiency: 55.3, status: 'Delivered', priority: 'Critical', origin: 'Adani Dahanu Solar', destination: 'Mumbai IEX Trading Hub', shipDate: '2025-04-28', transitDays: 3, state: 'Maharashtra',
    remarks: 'Hybrid iron-air battery system integrating solar with 120 MWh capacity for Adani Green at Mumbai IEX hub. Advanced Fe-air chemistry achieves 55.3% round-trip efficiency with 15,000 cycles. &#8377;420 Cr project enables arbitrage trading on Indian Energy Exchange capturing &#8377;2.5 Cr daily peak-off-peak spread for Adani portfolio optimization.' },
  { id: 'IAB-0005', projectId: 'IAB-005', city: 'Vishakhapatnam', operator: 'Vizag Steel Iron Air', batteryType: 'Fe-Ar Maritime Grade 50MWh',
    capacityMWh: 50, investmentCr: 165, cycles: 6000, efficiency: 42.8, status: 'In Transit', priority: 'High', origin: 'RINL Vizag Steel', destination: 'Vizag Port Storage', shipDate: '2025-05-15', transitDays: 2, state: 'Andhra Pradesh',
    remarks: 'Marine-grade iron-air battery en route to RINL Visakhapatnam steel plant port facility. Corrosion-resistant casing for coastal humid environment with 50 MWh capacity. &#8377;165 Cr installation provides port crane and loader peak power reducing diesel genset usage by 40% at Vizag Port Trust berth operations.' },
  { id: 'IAB-0006', projectId: 'IAB-006', city: 'Bengaluru', operator: 'BESCOM Fe-Air Grid Storage', batteryType: 'Fe-Air Urban 90MWh',
    capacityMWh: 90, investmentCr: 310, cycles: 11000, efficiency: 50.1, status: 'Delivered', priority: 'High', origin: 'BESCOM Peaking Station', destination: 'Bengaluru South Grid', shipDate: '2025-05-08', transitDays: 1, state: 'Karnataka',
    remarks: 'Urban iron-air grid storage for BESCOM Bengaluru south substation with 90 MWh capacity. Compact containerized design fits within existing substation footprint. &#8377;310 Cr project addresses Bengaluru&apos;s 3,000 MW peak demand deficit providing 90 MW for 1 hour during evening peak reducing load shedding incidents by 65%.' },
  { id: 'IAB-0007', projectId: 'IAB-007', city: 'Gandhinagar', operator: 'GUVNL Iron Air Storage', batteryType: 'Fe-Ar Solar Integrated 150MWh',
    capacityMWh: 150, investmentCr: 510, cycles: 14000, efficiency: 53.7, status: 'Delivered', priority: 'Critical', origin: 'Gujarat Solar Park', destination: 'Gandhinagar 400kV Station', shipDate: '2025-04-25', transitDays: 1, state: 'Gujarat',
    remarks: 'Solar-integrated iron-air battery at Gujarat Solar Park with 150 MWh capacity, India&apos;s largest Fe-air installation. Stores excess daytime solar for evening peak dispatch through Gujarat UVSL transmission network. &#8377;510 Cr project under UDAY scheme reduces Gujarat&apos;s coal plant evening ramp burden by 200 MW equivalent capacity.' },
  { id: 'IAB-0008', projectId: 'IAB-008', city: 'Chennai', operator: 'TANGEDCO Iron Air Bank', batteryType: 'Fe-Air Coastal 70MWh',
    capacityMWh: 70, investmentCr: 235, cycles: 9500, efficiency: 47.3, status: 'Delivered', priority: 'Medium', origin: 'TANGEDCO North Chennai', destination: 'Chennai TNEB Grid', shipDate: '2025-05-12', transitDays: 2, state: 'Tamil Nadu',
    remarks: 'Coastal-rated iron-air battery for TANGEDCO North Chennai thermal complex with 70 MWh capacity. Humidity-tolerant design withstands Chennai&apos;s 75% average humidity without performance degradation. &#8377;235 Cr deployment provides spinning reserve replacing gas turbine peakers saving &#8377;18 Cr annually in fuel costs for TNEB grid operations.' },
  { id: 'IAB-0009', projectId: 'IAB-009', city: 'Jaipur', operator: 'JVVNL Fe-Ar Desert Storage', batteryType: 'Fe-Air Arid Zone 40MWh',
    capacityMWh: 40, investmentCr: 135, cycles: 13000, efficiency: 54.6, status: 'Delayed', priority: 'High', origin: 'Bhadla Solar Park', destination: 'Jaipur 220kV Station', shipDate: '2025-04-15', transitDays: 5, state: 'Rajasthan',
    remarks: 'Arid-zone iron-air battery at Bhadla Solar Park delayed by extreme heat testing certification. 40 MWh capacity with enhanced thermal management for 50&#176;C desert ambient conditions. &#8377;135 Cr project provides 8-hour storage for Bhadla&apos;s 2,245 MW solar capacity enabling round-the-clock renewable dispatch through Rajasthan Rajya Vidyut Prasaran Nigam transmission network.' },
  { id: 'IAB-0010', projectId: 'IAB-010', city: 'Hyderabad', operator: 'TSNPDCL Iron Air Hub', batteryType: 'Fe-Air Telecom Backup 20MWh',
    capacityMWh: 20, investmentCr: 68, cycles: 7000, efficiency: 44.5, status: 'Delivered', priority: 'Medium', origin: 'TSNPDCL Warangal', destination: 'Hyderabad Data Center', shipDate: '2025-05-01', transitDays: 2, state: 'Telangana',
    remarks: 'Iron-air telecom backup battery at Hyderabad data center with 20 MWh capacity replacing lead-acid banks. Zero maintenance iron-air chemistry eliminates monthly electrolyte top-up and quarterly equalization charging. &#8377;68 Cr installation provides 48-hour backup for Hyderabad IT corridor data centers at 60% lower TCO than lithium-ion alternatives for TSNPDCL operations.' },
  { id: 'IAB-0011', projectId: 'IAB-011', city: 'Kolkata', operator: 'CESC Iron Air Storage', batteryType: 'Fe-Air Legacy Plant 85MWh',
    capacityMWh: 85, investmentCr: 280, cycles: 10500, efficiency: 49.8, status: 'Delivered', priority: 'Medium', origin: 'CESC Titagarh Plant', destination: 'CESC New Cossipore', shipDate: '2025-05-18', transitDays: 2, state: 'West Bengal',
    remarks: 'Iron-air battery for CESC legacy coal plant transition with 85 MWh storage capacity. Enables planned coal unit retirement while maintaining grid reliability for Kolkata metro area. &#8377;280 Cr project under WBSEDCL renewable purchase obligation allows CESC to defer 300 MW coal unit retirement by 5 years while meeting RPO compliance targets for West Bengal electricity regulatory commission.' },
  { id: 'IAB-0012', projectId: 'IAB-012', city: 'Kochi', operator: 'KSEB Iron Air Pilot', batteryType: 'Fe-Air Humid Tropic 30MWh',
    capacityMWh: 30, investmentCr: 105, cycles: 7500, efficiency: 46.2, status: 'Processing', priority: 'Low', origin: 'KSEB Idukki Hydro', destination: 'Kochi Substation', shipDate: '2025-05-22', transitDays: 1, state: 'Kerala',
    remarks: 'Tropical-humidity-rated iron-air battery pilot for KSEB Idukki hydroelectric complex with 30 MWh capacity. Biofouling-resistant air cathode designed for Kerala&apos;s monsoon conditions with dehumidification pre-filter. &#8377;105 Cr pilot project stores excess Idukki hydropower during low-demand night hours for daytime peaking replacing costly diesel peaker plants in Kerala state grid.' },
  { id: 'IAB-0013', projectId: 'IAB-013', city: 'Bhopal', operator: 'MPPMCL Iron Air Grid', batteryType: 'Fe-Air Central India 65MWh',
    capacityMWh: 65, investmentCr: 215, cycles: 11000, efficiency: 51.4, status: 'Delivered', priority: 'Medium', origin: 'MPPKVVCL Bhopal', destination: 'Indore 132kV Station', shipDate: '2025-05-06', transitDays: 3, state: 'Madhya Pradesh',
    remarks: 'Central India iron-air grid storage for MPPKVVCL Bhopal-Indore corridor with 65 MWh capacity. Provides voltage support and frequency regulation for Madhya Pradesh&apos;s growing renewable share reaching 25% by 2026. &#8377;215 Cr deployment enables 150 MW wind farm integration from Ratlam and Neemuch districts through Indore load center balancing services.' },
  { id: 'IAB-0014', projectId: 'IAB-014', city: 'Lucknow', operator: 'UPPCL Iron Air System', batteryType: 'Fe-Air Northern Grid 55MWh',
    capacityMWh: 55, investmentCr: 185, cycles: 9000, efficiency: 48.9, status: 'Delayed', priority: 'High', origin: 'UPPCL Lucknow', destination: 'Varanasi Grid Station', shipDate: '2025-04-20', transitDays: 4, state: 'Uttar Pradesh',
    remarks: 'Iron-air battery system for UPPCL Lucknow-Varanasi corridor delayed by land acquisition for substation expansion. 55 MWh capacity addresses Uttar Pradesh&apos;s 2,500 MW evening peak deficit in Purvanchal region. &#8377;185 Cr project under Saubhagya scheme supports 24x7 power supply to 500 villages in Varanasi division reducing dependency on diesel generators for rural electrification.' },
]

export default function IronAirBatteryLogisticsView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof IABRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'batteryType', label: 'Battery Type', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.batteryType] = (m[r.batteryType] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Capacity', value: `${filtered.reduce((a: number, r) => a + r.capacityMWh, 0).toLocaleString()} MWh` },
    { label: 'Avg Efficiency', value: `${(filtered.reduce((a: number, r) => a + r.efficiency, 0) / Math.max(1, filtered.length)).toFixed(1)}%` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Avg Cycles', value: `${(filtered.reduce((a: number, r) => a + r.cycles, 0) / Math.max(1, filtered.length)).toLocaleString()}` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: IABRecord) => string, val: (r: IABRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.capacityMWh)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const matBar = grp(r => r.batteryType, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const effData = filtered.map(r => ({ name: r.batteryType.split(' ').slice(0, 2).join(' '), value: r.efficiency }))
    const lm = filtered.reduce((a: Record<string, { capacityMWh: number; investmentCr: number }>, r) => {
      if (!a[r.state]) a[r.state] = { capacityMWh: 0, investmentCr: 0 }
      a[r.state].capacityMWh += r.capacityMWh; a[r.state].investmentCr += r.investmentCr; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, capacityMWh: v.capacityMWh, investmentCr: v.investmentCr }))
    return { barState, pieState, statusPie, matBar, priorityPie, totalInvest, effData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="iab-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Iron Air Battery' }]} />
      <PageHeader title="Iron Air Battery Logistics" description="Track iron-air battery storage supply chains, Fe-air module logistics, ultra-low-cost long-duration energy storage systems distribution, and grid-scale battery deployment for steel plants, solar parks and utility substations across India" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="iab-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`iab-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-amber-900 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="iab-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="iab-kpi-card"><CardContent className="p-4"><p className="iab-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="iab-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="iab-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="iab-chart-title text-sm">Storage Capacity (MWh) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#78350f" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="iab-chart-title text-sm">Installations by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="iab-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="iab-chart-title text-sm">Efficiency (%) by Battery Type</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.effData}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} domain={[40, 58]} /><Tooltip /><Bar dataKey="value" fill="#92400e" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="iab-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="iab-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`iab-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-amber-900'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.batteryType} | {r.state}</p>
              <p className="text-xs mt-1">{r.capacityMWh} MWh | {r.efficiency}% efficiency | {r.cycles.toLocaleString()} cycles | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="iab-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="iab-chart-title text-sm">Capacity vs Investment by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="capacityMWh" stroke="#78350f" name="Capacity MWh" /><Line yAxisId="right" type="monotone" dataKey="investmentCr" stroke="#eab308" name="Investment &#8377; Cr" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="iab-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#854d0e" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="iab-chart-title text-sm">Battery Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.matBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#92400e" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="iab-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="iab-insights grid grid-cols-2 gap-4">
        <Card className="iab-insight-card border-l-4 border-l-amber-900"><CardContent className="p-5">
          <h4 className="iab-insight-title font-semibold text-base">India&apos;s Iron-Air: World&apos;s Cheapest Grid Battery</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Iron-air batteries offer &#8377;2,500/kWh installed cost, 10x cheaper than lithium-ion at &#8377;25,000/kWh. India&apos;s abundant iron ore reserves of 5.5 billion tonnes in Jharkhand, Odisha and Chhattisgarh provide limitless raw material. NITI Aayog estimates India needs 410 GWh grid storage by 2030, with iron-air potentially serving 60% at &#8377;1 lakh Cr versus &#8377;10 lakh Cr for lithium solutions under National Energy Storage Mission.</p>
        </CardContent></Card>
        <Card className="iab-insight-card border-l-4 border-l-amber-900"><CardContent className="p-5">
          <h4 className="iab-insight-title font-semibold text-base">Form Energy India: 1 GWh Gujarat Gigafactory</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Form Energy partnering with Adani Green for 1 GWh iron-air battery gigafactory near Mundra, Gujarat at &#8377;2,500 Cr. Production begins 2027 with 500 MWh annual output using Indian iron anode powder from Essar Steel and Tata Steel. Gujarat&apos;s port infrastructure enables export to Southeast Asian grids targeting &#8377;500 Cr annual export revenue by 2030 under Make in India advanced energy storage programme.</p>
        </CardContent></Card>
        <Card className="iab-insight-card border-l-4 border-l-amber-900"><CardContent className="p-5">
          <h4 className="iab-insight-title font-semibold text-base">Steel Plants: Natural Iron-Air Battery Hubs</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s 55 major steel plants consume 35 GW of captive power ideal for iron-air battery integration. SAIL, Tata Steel and JSW Steel deploying 2.5 GWh of Fe-air storage across Bhilai, Rourkela, Jamshedpur and Vijayanagar by 2028. On-site iron availability from blast furnace dust recycling creates closed-loop supply chain reducing battery raw material cost by 40% compared to imported lithium-ion cells.</p>
        </CardContent></Card>
        <Card className="iab-insight-card border-l-4 border-l-amber-900"><CardContent className="p-5">
          <h4 className="iab-insight-title font-semibold text-base">Rural Electrification: 24x7 Power Without Lithium</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Iron-air batteries enabling 24x7 rural electrification in UP, Bihar, MP and Rajasthan at &#8377;4 lakh per village for 50 kWh systems. DDG-Rural scheme deploying 10,000 village-level Fe-air units by 2028 replacing expensive diesel generators consuming &#8377;12,000 Cr annual fuel subsidy. Iron-air&apos;s 30-year lifespan matches transformer lifetime eliminating battery replacement cycles that plague lead-acid rural installations.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
