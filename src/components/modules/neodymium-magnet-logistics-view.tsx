'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface NDMRecord {
  id: string; projectId: string; city: string; operator: string; magnetType: string
  capacityTPD: number; investmentCr: number; gradeTesla: number; purity: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#92400e', '#78350f', '#a16207', '#b45309', '#d97706', '#854d0e', '#713f12', '#422006']

const records: NDMRecord[] = [
  { id: 'NDM-0001', projectId: 'NDM-001', city: 'Visakhapatnam', operator: 'Indian Rare Earths Vizag', magnetType: 'NdFeB N52 Sintered',
    capacityTPD: 85, investmentCr: 620, gradeTesla: 1.48, purity: 99.5, status: 'Delivered', priority: 'Critical', origin: 'IRE Vizag Plant', destination: 'Visakhapatnam Rare Earth Hub', shipDate: '2025-05-05', transitDays: 1, state: 'Andhra Pradesh',
    remarks: 'Sintered NdFeB N52 grade neodymium magnet production at IRE Visakhapatnam rare earth hub. 85 TPD capacity utilizing monazite sand from AP coastal beaches processed through solvent extraction route. &#8377;620 Cr facility produces 1.48 Tesla grade magnets for Indian EV motor and wind turbine OEM supply chain under Make in India rare earth independence programme.' },
  { id: 'NDM-0002', projectId: 'NDM-002', city: 'Bhubaneswar', operator: 'Odisha Rare Earth Corp', magnetType: 'NdFeB N48SH Sintered',
    capacityTPD: 70, investmentCr: 510, gradeTesla: 1.40, purity: 99.2, status: 'Delivered', priority: 'Critical', origin: 'Chatrapur Monazite', destination: 'Bhubaneswar Processing Zone', shipDate: '2025-05-10', transitDays: 2, state: 'Odisha',
    remarks: 'High-coercivity N48SH grade NdFeB magnet plant at Bhubaneswar with 70 TPD capacity sourced from Chatrapur monazite sands. SH-grade magnets rated for 150&#176;C operating temperature ideal for EV traction motors and industrial drives. &#8377;510 Cr investment supports Odisha&apos;s 15,000 MW renewable energy target providing direct-drive wind turbine magnets for Suzlon and Inox Wind.' },
  { id: 'NDM-0003', projectId: 'NDM-003', city: 'Bengaluru', operator: 'Tata Motors Magnet Division', magnetType: 'NdFeB N42 bonded injection',
    capacityTPD: 45, investmentCr: 340, gradeTesla: 1.32, purity: 98.8, status: 'Delivered', priority: 'High', origin: 'Tata Steel Nd Processing', destination: 'Tata Motors EV Plant', shipDate: '2025-05-02', transitDays: 3, state: 'Karnataka',
    remarks: 'Bonded injection-molded NdFeB N42 magnets for Tata Motors EV powertrain at Bengaluru. 45 TPD capacity producing near-net-shape magnets eliminating machining waste by 80%. &#8377;340 Cr plant supplies Nexon EV and Tiago EV motor magnets with 30% lower cost than imported sintered magnets from China under Tata Group vertical integration rare earth strategy.' },
  { id: 'NDM-0004', projectId: 'NDM-004', city: 'Kochi', operator: 'Kerala Rare Earth Extractor', magnetType: 'NdFeB N50 Sintered Coastal',
    capacityTPD: 55, investmentCr: 395, gradeTesla: 1.44, purity: 99.3, status: 'In Transit', priority: 'High', origin: 'Chavara Titanium Plant', destination: 'Kochi Magnet Works', shipDate: '2025-05-15', transitDays: 2, state: 'Kerala',
    remarks: 'Coastal-processed NdFeB N50 sintered magnets from Chavara mineral sands en route to Kochi Magnet Works. 55 TPD capacity utilizes ilmenite and monazite byproducts from Kerala&apos;s titanium dioxide industry. &#8377;395 Cr facility establishes India&apos;s southern rare earth magnet corridor serving Cochin Shipyard electric propulsion and Kerala State Electricity Board wind farm installations.' },
  { id: 'NDM-0005', projectId: 'NDM-005', city: 'Mumbai', operator: 'Adani Wind Magnet Works', magnetType: 'NdFeB N48 Arc Segment',
    capacityTPD: 60, investmentCr: 450, gradeTesla: 1.40, purity: 99.1, status: 'Delivered', priority: 'Critical', origin: 'IRE Vizag Supply', destination: 'Adani Wind Turbine Hub', shipDate: '2025-04-28', transitDays: 5, state: 'Maharashtra',
    remarks: 'Arc-segment NdFeB N48 magnets for Adani Group wind turbine generators at Mumbai manufacturing hub. 60 TPD capacity produces curved pole pieces for 3-5 MW direct-drive turbines. &#8377;450 Cr investment reduces Adani&apos;s 85% dependence on Chinese magnet imports critical for 16 GW wind pipeline requiring 12,000 tonnes of NdFeB magnets annually under National Wind Energy Mission 2030.' },
  { id: 'NDM-0006', projectId: 'NDM-006', city: 'Chennai', operator: 'TVS Neodymium Magnet Plant', magnetType: 'NdFeB N44 bonded compression',
    capacityTPD: 35, investmentCr: 255, gradeTesla: 1.35, purity: 98.5, status: 'Delivered', priority: 'Medium', origin: 'IRE Chennai Depot', destination: 'TVS Motor EV Factory', shipDate: '2025-05-08', transitDays: 1, state: 'Tamil Nadu',
    remarks: 'Compression-bonded NdFeB N44 magnets for TVS Motor electric two-wheeler motors at Chennai. 35 TPD capacity producing ring magnets for hub motors and IPM rotor assemblies. &#8377;255 Cr plant supports TVS iQube and Creon production targeting 2 million EV two-wheeler annual output by 2027 with domestically sourced magnets reducing BOM cost by &#8377;800 per unit versus Chinese imports.' },
  { id: 'NDM-0007', projectId: 'NDM-007', city: 'Ahmedabad', operator: 'Reliance Rare Earth Hub', magnetType: 'NdFeB N52SH Sintered',
    capacityTPD: 90, investmentCr: 680, gradeTesla: 1.48, purity: 99.6, status: 'Delivered', priority: 'Critical', origin: 'Reliance Jamnagar RE', destination: 'Reliance Dhirubhai Ambani Green', shipDate: '2025-04-25', transitDays: 2, state: 'Gujarat',
    remarks: 'Ultra-high-grade N52SH sintered NdFeB magnets at Reliance Jamnagar rare earth complex with 90 TPD capacity. India&apos;s largest neodymium magnet plant with 99.6% purity using praseodymium-dysprosium alloy additions for 200&#176;C thermal stability. &#8377;680 Cr project supplies Reliance&apos;s 10 GWh battery gigafactory motor requirements and green hydrogen electrolyzer permanent magnet drives under Mukesh Ambani green energy transition plan.' },
  { id: 'NDM-0008', projectId: 'NDM-008', city: 'Hyderabad', operator: 'DRDO Rare Earth Facility', magnetType: 'NdFeB N50 Sintered Defence',
    capacityTPD: 25, investmentCr: 195, gradeTesla: 1.44, purity: 99.7, status: 'Delivered', priority: 'High', origin: 'DRDO Kanchanbagh', destination: 'Defence Electronics Production', shipDate: '2025-05-12', transitDays: 1, state: 'Telangana',
    remarks: 'Defence-grade NdFeB N50 sintered magnets for DRDO missile guidance systems and electronic warfare applications at Hyderabad. 25 TPD classified facility producing 99.7% purity magnets meeting military specification MIL-STD-883. &#8377;195 Cr plant supports BrahMos Astra and Nirbhay missile programmes replacing imported American and Japanese rare earth magnets under Atmanirbhar Bharat defence production policy.' },
  { id: 'NDM-0009', projectId: 'NDM-009', city: 'Jaipur', operator: 'Rajasthan Rare Earth Mining', magnetType: 'NdFeB N46 Sintered Arid',
    capacityTPD: 40, investmentCr: 290, gradeTesla: 1.38, purity: 99.0, status: 'Delayed', priority: 'High', origin: 'Barmer RE Deposit', destination: 'Jaipur Processing Zone', shipDate: '2025-04-15', transitDays: 6, state: 'Rajasthan',
    remarks: 'Arid-zone NdFeB N46 sintered magnet facility delayed by Barmer rare earth deposit licensing disputes. 40 TPD capacity from Rajasthan&apos;s newly discovered bastnasite deposits estimated at 2.1 million tonnes. &#8377;290 Cr project stalled pending Mines and Minerals Development Regulation amendments for rare earth minerals under Rajasthan State Mines and Minerals Ltd with potential resolution by Q3 2026.' },
  { id: 'NDM-0010', projectId: 'NDM-010', city: 'Ranchi', operator: 'Jharkhand NdFeB Works', magnetType: 'NdFeB N42 Sintered Iron Region',
    capacityTPD: 50, investmentCr: 375, gradeTesla: 1.32, purity: 98.9, status: 'Delivered', priority: 'Medium', origin: 'Jharkhand Iron Ore Mines', destination: 'Ranchi Industrial Area', shipDate: '2025-05-01', transitDays: 2, state: 'Jharkhand',
    remarks: 'NdFeB N42 sintered magnets at Ranchi leveraging Jharkhand iron ore region logistics with 50 TPD capacity. Proximity to Tata Steel and SAIL iron sources reduces neodymium-iron alloy production cost by 25%. &#8377;375 Cr facility produces magnets for eastern India heavy industry including CR locomotive traction motors and SAIL steel plant automation actuators serving 12 states distribution network via NH31 freight corridor.' },
  { id: 'NDM-0011', projectId: 'NDM-011', city: 'Raipur', operator: 'Chhattisgarh NdFeB Plant', magnetType: 'NdFeB N48 Sintered Mining',
    capacityTPD: 42, investmentCr: 310, gradeTesla: 1.40, purity: 99.1, status: 'Delivered', priority: 'Medium', origin: 'Bastar Rare Earth Zone', destination: 'Raipur Industrial Estate', shipDate: '2025-05-18', transitDays: 3, state: 'Chhattisgarh',
    remarks: 'NdFeB N48 sintered magnets for Chhattisgarh mining equipment electrification with 42 TPD capacity at Raipur. Heavy-duty magnets rated for vibration and dust-laden underground mining environments. &#8377;310 Cr plant supports Coal India&apos;s 400 electric mining dump truck programme replacing hydraulic systems with permanent magnet drives for 60% energy savings across SECL and MCL coal fields in central India.' },
  { id: 'NDM-0012', projectId: 'NDM-012', city: 'Kolkata', operator: 'Bengal Rare Earth Refinery', magnetType: 'NdFeB N44 Sintered Metro',
    capacityTPD: 38, investmentCr: 280, gradeTesla: 1.35, purity: 99.2, status: 'Processing', priority: 'Low', origin: 'Haldia RE Terminal', destination: 'Kolkata Export Processing', shipDate: '2025-05-22', transitDays: 1, state: 'West Bengal',
    remarks: 'NdFeB N44 sintered magnets at Kolkata export processing zone with 38 TPD capacity from Haldia port terminal. Dual-use facility serves domestic metro rail projects and export markets for Southeast Asia. &#8377;280 Cr refinery processes imported neodymium oxide from Myanmar and Australian Lynas through Haldia port for value-added magnet production supporting Kolkata Metro Line 6 and Dhaka Metro Line 1 under subcontinental rail modernisation.' },
  { id: 'NDM-0013', projectId: 'NDM-013', city: 'Bhopal', operator: 'MP Rare Earth Processing', magnetType: 'NdFeB N40 Sintered Central',
    capacityTPD: 32, investmentCr: 235, gradeTesla: 1.30, purity: 98.7, status: 'Delivered', priority: 'Medium', origin: 'MP Mineral Corp', destination: 'Bhopal Magnet Factory', shipDate: '2025-05-06', transitDays: 2, state: 'Madhya Pradesh',
    remarks: 'Central India NdFeB N40 sintered magnet facility at Bhopal with 32 TPD capacity from MP Mineral Corporation rare earth feedstock. &#8377;235 Cr plant targets central India agricultural pump manufacturers and textile industry motor rewind market. Supplies MP DISCOM smart meter permanent magnet sensors and Pithampur industrial cluster servo motor magnets for 500MW solar pump drive applications under PM-KUSUM scheme.' },
  { id: 'NDM-0014', projectId: 'NDM-014', city: 'Guwahati', operator: 'NE Rare Earth Venture', magnetType: 'NdFeB N42 Sintered Hill',
    capacityTPD: 28, investmentCr: 210, gradeTesla: 1.32, purity: 98.8, status: 'Delayed', priority: 'Medium', origin: 'Meghalaya RE Deposits', destination: 'Guwahati Industrial Hub', shipDate: '2025-04-20', transitDays: 7, state: 'Assam',
    remarks: 'Northeast India NdFeB N42 sintered magnet venture at Guwahati delayed by monsoon logistics and Meghalaya rare earth mining permits. 28 TPD capacity from Meghalaya&apos;s monazite-bearing sand deposits in West Khasi Hills. &#8377;210 Cr project would serve Assam tea garden micro-hydro generators and NE states off-grid solar installations. Delayed pending NER rare earth mining policy framework under DoNER with expected commissioning by Q1 2027.' },
]

export default function NeodymiumMagnetLogisticsView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof NDMRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'magnetType', label: 'Magnet Type', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.magnetType] = (m[r.magnetType] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Capacity', value: `${filtered.reduce((a: number, r) => a + r.capacityTPD, 0).toLocaleString()} TPD` },
    { label: 'Avg Grade', value: `${(filtered.reduce((a: number, r) => a + r.gradeTesla, 0) / Math.max(1, filtered.length)).toFixed(2)} T` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Avg Purity', value: `${(filtered.reduce((a: number, r) => a + r.purity, 0) / Math.max(1, filtered.length)).toFixed(1)}%` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: NDMRecord) => string, val: (r: NDMRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.capacityTPD)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const matBar = grp(r => r.magnetType, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const gradeData = filtered.map(r => ({ name: r.magnetType.split(' ').slice(1, 3).join(' '), value: r.gradeTesla }))
    const lm = filtered.reduce((a: Record<string, { capacityTPD: number; investmentCr: number }>, r) => {
      if (!a[r.state]) a[r.state] = { capacityTPD: 0, investmentCr: 0 }
      a[r.state].capacityTPD += r.capacityTPD; a[r.state].investmentCr += r.investmentCr; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, capacityTPD: v.capacityTPD, investmentCr: v.investmentCr }))
    return { barState, pieState, statusPie, matBar, priorityPie, totalInvest, gradeData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="ndm-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Neodymium Magnet' }]} />
      <PageHeader title="Neodymium Magnet Logistics" description="Track neodymium-iron-boron magnet supply chains, rare earth processing logistics, NdFeB sintered and bonded magnet distribution, and strategic rare earth independence for EV motors, wind turbines and defence applications across India" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="ndm-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`ndm-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-amber-900 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="ndm-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="ndm-kpi-card"><CardContent className="p-4"><p className="ndm-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="ndm-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="ndm-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="ndm-chart-title text-sm">Magnet Capacity (TPD) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#92400e" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="ndm-chart-title text-sm">Facilities by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="ndm-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="ndm-chart-title text-sm">Grade (Tesla) by Magnet Type</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.gradeData}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} domain={[1.25, 1.52]} /><Tooltip /><Bar dataKey="value" fill="#78350f" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="ndm-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="ndm-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`ndm-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-amber-800'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.magnetType} | {r.state}</p>
              <p className="text-xs mt-1">{r.capacityTPD} TPD | {r.gradeTesla}T grade | {r.purity}% purity | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="ndm-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="ndm-chart-title text-sm">Capacity vs Investment by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="capacityTPD" stroke="#92400e" name="Capacity TPD" /><Line yAxisId="right" type="monotone" dataKey="investmentCr" stroke="#d97706" name="Investment &#8377; Cr" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="ndm-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#854d0e" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="ndm-chart-title text-sm">Magnet Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.matBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#78350f" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="ndm-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="ndm-insights grid grid-cols-2 gap-4">
        <Card className="ndm-insight-card border-l-4 border-l-amber-800"><CardContent className="p-5">
          <h4 className="ndm-insight-title font-semibold text-base">India&apos;s Rare Earth Crisis: 85% Import Dependence</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India consumes 8,000 tonnes of neodymium magnets annually but produces only 1,200 tonnes domestically. China controls 70% of global rare earth mining and 90% of magnet processing. India&apos;s monazite beach sand reserves of 11.9 million tonnes contain 1.2 million tonnes of rare earth oxides sufficient for 150 years at current consumption. IRE and Kerala Minerals and Metals Ltd processing only 5% of available monazite due to regulatory restrictions on beach sand mining under Atomic Energy Regulatory Board and Indian Bureau of Mines jurisdiction.</p>
        </CardContent></Card>
        <Card className="ndm-insight-card border-l-4 border-l-amber-800"><CardContent className="p-5">
          <h4 className="ndm-insight-title font-semibold text-base">EV Motor Magnets: &#8377;15,000 Cr Market by 2030</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s EV industry needs 25,000 tonnes of NdFeB magnets by 2030 for 30 million annual EV motor production. Current domestic capacity of 700 TPD covers only 10% of demand. Tata Motors, Mahindra, Ola Electric and Ather Energy collectively investing &#8377;4,500 Cr in captive magnet plants to reduce per-motor cost from &#8377;8,500 to &#8377;3,200 through vertical integration. FAME III scheme mandates 40% domestic rare earth content for subsidy eligibility accelerating Atmanirbhar magnet production.</p>
        </CardContent></Card>
        <Card className="ndm-insight-card border-l-4 border-l-amber-800"><CardContent className="p-5">
          <h4 className="ndm-insight-title font-semibold text-base">Wind Turbine Direct-Drive: 60,000 Tonnes NdFeB Needed</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s 140 GW wind energy target by 2030 requires 60,000 tonnes of NdFeB magnets for direct-drive turbines eliminating gearbox failures. Siemens Gamesa and Vestas transitioning to permanent magnet generators with 30% higher efficiency. Each 5 MW turbine requires 1.2 tonnes of N52 grade magnets costing &#8377;3.6 Cr. Domestic magnet production must scale 8x from current 700 TPD to meet demand under National Offshore Wind Energy Mission and onshore repowering programme.</p>
        </CardContent></Card>
        <Card className="ndm-insight-card border-l-4 border-l-amber-800"><CardContent className="p-5">
          <h4 className="ndm-insight-title font-semibold text-base">Recycling Urban Mine: 2,500 TPA NdFeB Recovery</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India generates 3.2 million tonnes of e-waste annually containing 8,000 tonnes of recoverable rare earth magnets from hard drives, speakers, motors and MRI machines. CMET Hyderabad and NML Jamshedpur developing hydrometallurgical NdFeB recycling achieving 95% recovery rate at &#8377;12,000 per tonne versus &#8377;85,000 per tonne for virgin production. E-waste recycling mandate under EPR rules could supply 15% of India&apos;s neodymium demand by 2028 reducing mining pressure on coastal monazite deposits.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
