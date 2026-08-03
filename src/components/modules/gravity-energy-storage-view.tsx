'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface GESRecord {
  id: string; projectId: string; city: string; operator: string; storageType: string
  capacityMWh: number; investmentCr: number; heightM: number; efficiency: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1', '#1e293b', '#0f172a', '#020617']

const records: GESRecord[] = [
  { id: 'GES-0001', projectId: 'GES-001', city: 'Ladakh (Leh)', operator: 'NHPC Gravity Storage Leh', storageType: 'Mountain Gravity 200MWh',
    capacityMWh: 200, investmentCr: 480, heightM: 800, efficiency: 82.0, status: 'Delivered', priority: 'Critical', origin: 'NHPC Leh Station', destination: 'Leh Grid Hub', shipDate: '2025-06-05', transitDays: 10, state: 'Ladakh',
    remarks: 'Mountain gravity energy storage at Leh using 800m elevation difference between upper and lower reservoirs. 200 MWh capacity stores excess solar during Ladakh&apos;s 300 sunny days for winter night supply. &#8377;480 Cr project eliminates diesel dependency for Leh-Ladakh region saving &#8377;85 Cr annual fuel transport cost via Manali-Leh and Srinagar-Leh highways during 6-month winter closure.' },
  { id: 'GES-0002', projectId: 'GES-002', city: 'Shimla', operator: 'HPPCL Gravity Storage', storageType: 'Mine Shaft Gravity 50MWh',
    capacityMWh: 50, investmentCr: 140, heightM: 350, efficiency: 78.5, status: 'Delivered', priority: 'High', origin: 'HPPCL Sundernagar', destination: 'Shimla Grid Station', shipDate: '2025-06-10', transitDays: 3, state: 'Himachal Pradesh',
    remarks: 'Abandoned mine shaft gravity storage at Himachal Pradesh with 50 MWh capacity using 350m vertical drop. Repurposes closed limestone mine near Sundernagar for weights-and-pulley gravity system. &#8377;140 Cr project provides peak power for Shimla hill station tourism load during December-January winter peak when HPSEB hydro generation drops 60% due to frozen glacial runoff.' },
  { id: 'GES-0003', projectId: 'GES-003', city: 'Gangtok', operator: 'Sikkim Gravity Energy', storageType: 'Hydro-Mechanical 80MWh',
    capacityMWh: 80, investmentCr: 220, heightM: 500, efficiency: 85.2, status: 'Delivered', priority: 'High', origin: 'Sikkim RTPCL Ranji', destination: 'Gangtok 132kV Station', shipDate: '2025-06-02', transitDays: 5, state: 'Sikkim',
    remarks: 'Hydro-mechanical gravity storage at Sikkim RTPCL Ranji power house with 80 MWh capacity utilizing 500m Teesta river gorge elevation. Combines pumped hydro principles with mechanical weights for rapid 15-second response time. &#8377;220 Cr deployment supports Sikkim&apos;s 100% renewable target by storing Teesta basin hydro surplus during monsoon for dry season dispatch through Gangtok 132kV transmission network.' },
  { id: 'GES-0004', projectId: 'GES-004', city: 'Mumbai', operator: 'Adani Gravity Tower', storageType: 'Tower Gravity Urban 25MWh',
    capacityMWh: 25, investmentCr: 110, heightM: 120, efficiency: 75.3, status: 'Delivered', priority: 'Critical', origin: 'Adani Powai Tower', destination: 'Mumbai BKC Grid', shipDate: '2025-05-28', transitDays: 1, state: 'Maharashtra',
    remarks: 'Urban tower gravity storage at Adani Powai complex Mumbai with 25 MWh capacity using 120m composite tower. Heavy composite weights raised by surplus grid power during off-peak and lowered through generator for peak supply. &#8377;110 Cr installation provides 5 MW for 5 hours at Mumbai BKC business district serving Tata-MTRDC metro and commercial load during evening peak reducing reliance on Dahanu gas turbine peakers.' },
  { id: 'GES-0005', projectId: 'GES-005', city: 'Hyderabad', operator: 'TSGrid Gravity Mine', storageType: 'Open Pit Gravity 120MWh',
    capacityMWh: 120, investmentCr: 310, heightM: 200, efficiency: 80.8, status: 'In Transit', priority: 'High', origin: 'Singareni Colleries', destination: 'Hyderabad 400kV Station', shipDate: '2025-06-15', transitDays: 2, state: 'Telangana',
    remarks: 'Open pit mine gravity storage en route from Singareni Collieries to Hyderabad 400kV station with 120 MWh capacity. Repurposes depleted coal open pit at Ramagundam with 200m depth for rail-car based gravity system. &#8377;310 Cr project under Singareni just transition programme converts retired coal infrastructure into clean energy asset providing Telangana grid with 120 MW peak capacity for 1 hour during summer demand spikes.' },
  { id: 'GES-0006', projectId: 'GES-006', city: 'Bengaluru', operator: 'KPTCL Gravity Hills', storageType: 'Hillside Gravity 60MWh',
    capacityMWh: 60, investmentCr: 175, heightM: 280, efficiency: 79.6, status: 'Delivered', priority: 'Medium', origin: 'Nandi Hills Station', destination: 'Bengaluru Devanahalli', shipDate: '2025-06-08', transitDays: 1, state: 'Karnataka',
    remarks: 'Hillside gravity energy storage at Nandi Hills near Bengaluru with 60 MWh capacity using 280m natural elevation. Rail-mounted concrete weights shuttle between Nandi Hills summit and Devanahalli base through automated funicular system. &#8377;175 Cr project provides Karnataka grid with rapid-response storage replacing proposed gas peaker plants at Devanahalli industrial area near Bengaluru airport electricity demand zone.' },
  { id: 'GES-0007', projectId: 'GES-007', city: 'Ahmedabad', operator: 'GSECL Gravity Block', storageType: 'Building Gravity 15MWh',
    capacityMWh: 15, investmentCr: 52, heightM: 80, efficiency: 72.4, status: 'Delivered', priority: 'Medium', origin: 'GIDC Naroda', destination: 'Ahmedabad SG Highway', shipDate: '2025-05-25', transitDays: 1, state: 'Gujarat',
    remarks: 'Building-integrated gravity storage at GIDC Naroda industrial estate Ahmedabad with 15 MWh capacity using 80m purpose-built structure. Modular concrete block system designed for distributed industrial storage at &#8377;3.5 Cr/MWh. &#8377;52 Cr pilot provides peak shaving for 200 small-scale industries eliminating transformer overloading during simultaneous factory startup reducing Ahmedabad distribution network congestion by 15%.' },
  { id: 'GES-0008', projectId: 'GES-008', city: 'Chennai', operator: 'TNEB Gravity Coastal', storageType: 'Cliff Gravity 45MWh',
    capacityMWh: 45, investmentCr: 130, heightM: 150, efficiency: 77.1, status: 'Delivered', priority: 'Medium', origin: 'TNEB Kalpakkam Cliff', destination: 'Chennai South Grid', shipDate: '2025-06-12', transitDays: 2, state: 'Tamil Nadu',
    remarks: 'Cliff-face gravity storage at Kalpakkam coastal bluff near Chennai with 45 MWh capacity using 150m natural cliff elevation. Coastal corrosion-resistant weights and rails for 30-year service life in saline environment. &#8377;130 Cr installation supports Kalpakkam nuclear plant off-peak power storage and provides TN grid ancillary services including frequency regulation and spinning reserve for Chennai metropolitan area 5,000 MW peak demand management.' },
  { id: 'GES-0009', projectId: 'GES-009', city: 'Darbhanga', operator: 'BSEB Gravity Floodplain', storageType: 'Underground Piston 90MWh',
    capacityMWh: 90, investmentCr: 250, heightM: 100, efficiency: 83.5, status: 'Delayed', priority: 'High', origin: 'BSEB Darbhanga', destination: 'Muzaffarpur Grid', shipDate: '2025-05-15', transitDays: 6, state: 'Bihar',
    remarks: 'Underground piston gravity storage at Darbhanga floodplain Bihar delayed by monsoon water table concerns. 90 MWh capacity using massive concrete piston lowered into 100m deep sealed shaft below groundwater level. &#8377;250 Cr project addresses Bihar&apos;s chronic 3,000 MW power deficit during paddy transplantation season March-June when agricultural pump load peaks simultaneously with summer cooling demand across North Bihar transmission network.' },
  { id: 'GES-0010', projectId: 'GES-010', city: 'Guwahati', operator: 'ASEB Gravity Hills', storageType: 'Northeast Mountain 70MWh',
    capacityMWh: 70, investmentCr: 195, heightM: 450, efficiency: 84.2, status: 'Delivered', priority: 'High', origin: 'ASEB Umiam Dam', destination: 'Guwahati Grid Station', shipDate: '2025-06-01', transitDays: 4, state: 'Assam',
    remarks: 'Northeast mountain gravity storage at Umiam Dam area near Shillong with 70 MWh capacity using 450m Khasi Hills elevation difference. System complements existing Umiam hydroelectric plant for combined storage capacity enhancement. &#8377;195 Cr project provides Assam grid with much-needed peaking capacity reducing dependency on expensive Bought-Out Power from NTPC Eastern Region during evening peak hours for Guwahati metropolitan load center.' },
  { id: 'GES-0011', projectId: 'GES-011', city: 'Bhubaneswar', storageType: 'Rail Gravity 55MWh', operator: 'OPTCL Gravity Rail System', capacityMWh: 55, investmentCr: 160, heightM: 180, efficiency: 76.8, status: 'Delivered', priority: 'Medium', origin: 'OPTCL Talcher', destination: 'Bhubaneswar Grid', shipDate: '2025-06-18', transitDays: 2, state: 'Odisha',
    remarks: 'Rail-based gravity storage on OPTCL transmission corridor from Talcher to Bhubaneswar with 55 MWh capacity using 180m elevation change over 12km dedicated rail track. Automated heavy rail cars carry 500-tonne concrete weights uphill during off-peak generation surplus. &#8377;160 Cr project stabilizes Odisha grid voltage during 2,000 MW renewable intermittency from coastal wind farms at Gopalpur and Paradip integrating with POSOCO regional dispatch center.' },
  { id: 'GES-0012', projectId: 'GES-012', city: 'Jodhpur', operator: 'JVVNL Desert Gravity', storageType: 'Sand Dune Gravity 35MWh',
    capacityMWh: 35, investmentCr: 98, heightM: 60, efficiency: 70.2, status: 'Processing', priority: 'Low', origin: 'JVVNL Phalodi', destination: 'Jodhpur 220kV Station', shipDate: '2025-06-22', transitDays: 3, state: 'Rajasthan',
    remarks: 'Sand dune gravity storage prototype at Phalodi near Jodhpur with 35 MWh capacity using Thar Desert 60m dune formations. Specialized tracked vehicles move sand mass uphill during solar peak and regenerate downhill during evening. &#8377;98 Cr pilot by JVVNL explores ultra-low-cost gravity storage using abundant desert sand as working mass at &#8377;2.8 Cr/MWh potentially world&apos;s cheapest storage medium leveraging Rajasthan&apos;s 200,000 sq km Thar Desert geomass.' },
  { id: 'GES-0013', projectId: 'GES-013', city: 'Dehradun', operator: 'UPCL Gravity Valley', storageType: 'Valley Gravity 100MWh',
    capacityMWh: 100, investmentCr: 270, heightM: 400, efficiency: 81.3, status: 'Delivered', priority: 'High', origin: 'UPCL Tehri Dam', destination: 'Dehradun Grid', shipDate: '2025-06-06', transitDays: 3, state: 'Uttarakhand',
    remarks: 'Valley gravity storage near Tehri Dam with 100 MWh capacity using 400m Himalayan valley elevation between upper and lower reservoirs. Complements existing 1,000 MW Tehri pumped storage for additional flexibility without water consumption. &#8377;270 Cr project serves Uttarakhand grid and provides power for Char Dham highway tunnel ventilation systems during peak tourist season reducing UPCL dependence on thermal power purchases during monsoon hydro uncertainty period.' },
  { id: 'GES-0014', projectId: 'GES-014', city: 'Pune', operator: 'MSEDCL Gravity Quarry', storageType: 'Quarry Gravity 40MWh',
    capacityMWh: 40, investmentCr: 115, heightM: 130, efficiency: 74.5, status: 'Delayed', priority: 'Medium', origin: 'MSEDCL Lonavala', destination: 'Pune Hinjewadi Grid', shipDate: '2025-05-20', transitDays: 4, state: 'Maharashtra',
    remarks: 'Quarry gravity storage at Lonavala basalt quarry near Pune delayed by environmental clearance for rail corridor. 40 MWh capacity using 130m quarry depth for suspended weight gravity system. &#8377;115 Cr project targets Hinjewadi IT Park peak demand of 800 MW providing 40 MW for 1 hour during IT shift change peaks at 10 AM and 6:30 PM reducing MSEDCL transmission losses on Pune-Satara corridor by avoiding long-distance power wheeling during demand spikes.' },
]

export default function GravityEnergyStorageView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof GESRecord])))
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
    { label: 'Avg Height', value: `${(filtered.reduce((a: number, r) => a + r.heightM, 0) / Math.max(1, filtered.length)).toFixed(0)} m` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: GESRecord) => string, val: (r: GESRecord) => number) =>
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
    <div className="ges-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Gravity Energy Storage' }]} />
      <PageHeader title="Gravity Energy Storage Logistics" description="Track gravity energy storage supply chains, weights-and-pulley system logistics, mountain-mine-quarry gravity storage distribution, and long-duration mechanical energy storage deployment for grids, mines and urban towers across India" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="ges-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`ges-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-slate-800 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="ges-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="ges-kpi-card"><CardContent className="p-4"><p className="ges-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="ges-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="ges-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="ges-chart-title text-sm">Storage Capacity (MWh) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#334155" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="ges-chart-title text-sm">Installations by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="ges-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="ges-chart-title text-sm">Efficiency (%) by Storage Type</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.effData}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} domain={[68, 88]} /><Tooltip /><Bar dataKey="value" fill="#475569" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="ges-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="ges-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`ges-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-slate-800'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.storageType} | {r.state}</p>
              <p className="text-xs mt-1">{r.capacityMWh} MWh | {r.heightM}m height | {r.efficiency}% efficiency | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="ges-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="ges-chart-title text-sm">Capacity vs Investment by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="capacityMWh" stroke="#334155" name="Capacity MWh" /><Line yAxisId="right" type="monotone" dataKey="investmentCr" stroke="#94a3b8" name="Investment &#8377; Cr" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="ges-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#1e293b" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="ges-chart-title text-sm">Storage Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.matBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#475569" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="ges-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="ges-insights grid grid-cols-2 gap-4">
        <Card className="ges-insight-card border-l-4 border-l-slate-800"><CardContent className="p-5">
          <h4 className="ges-insight-title font-semibold text-base">Himalayan Gravity: India&apos;s 50 GWh Untapped Potential</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s Himalayan states of Himachal Pradesh, Uttarakhand, Sikkim and Ladakh offer 50 GWh of gravity storage potential using 500-2,000m elevation differences. Unlike pumped hydro, gravity storage needs no water, zero evaporation loss and works in sub-zero temperatures. MNRE Himalayan Gravity Storage Mission targeting 5 GWh by 2030 leveraging BRO road construction corridors for weight transport logistics along India-China border infrastructure projects.</p>
        </CardContent></Card>
        <Card className="ges-insight-card border-l-4 border-l-slate-800"><CardContent className="p-5">
          <h4 className="ges-insight-title font-semibold text-base">Coal Mine Repurposing: Just Transition Gravity Storage</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India has 350 abandoned coal mines with combined depth potential for 8 GWh gravity storage. Coal India and Singareni Collieries partnering with Gravity Storage UK and Energy Vault for mine shaft conversion projects in Jharia, Raniganj and Godavari Valley. &#8377;12,000 Cr National Mine Repurposing Programme targeting 100 mine-to-gravity conversions by 2032 creating 15,000 green jobs in coal-dependent districts of Jharkhand, Chhattisgarh and Telangana.</p>
        </CardContent></Card>
        <Card className="ges-insight-card border-l-4 border-l-slate-800"><CardContent className="p-5">
          <h4 className="ges-insight-title font-semibold text-base">50-Year Lifespan: Gravity Beats All Battery Chemistries</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Gravity energy storage systems achieve 50-year operational lifetime with zero degradation, compared to 10-15 years for lithium-ion and 5-8 years for lead-acid. No chemical degradation, no thermal runaway risk, no toxic materials and 95% recyclable concrete and steel components. NITI Aayog LCOE analysis shows gravity storage at &#8377;1.8/kWh cycle versus &#8377;4.2/kWh for lithium-ion over 25-year project lifetime making gravity the cheapest long-duration storage for India&apos;s grid modernization programme.</p>
        </CardContent></Card>
        <Card className="ges-insight-card border-l-4 border-l-slate-800"><CardContent className="p-5">
          <h4 className="ges-insight-title font-semibold text-base">Island Grids: Gravity for Lakshadweep and Andaman</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Gravity storage towers planned for Lakshadweep and Andaman-Nicobar islands replacing expensive diesel generators consuming &#8377;600 Cr annual fuel subsidy. 25 MWh tower gravity systems at Kavaratti, Port Blair and 8 island locations provide 24x7 renewable-powered electricity. &#8377;350 Cr island gravity programme under PM-SAHI scheme eliminates diesel dependency for 400,000 island residents while supporting A&amp;N Command strategic defence installations with reliable zero-fuel power supply.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
