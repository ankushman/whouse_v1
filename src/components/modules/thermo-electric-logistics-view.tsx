'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface TELRecord {
  id: string; projectId: string; city: string; operator: string; moduleType: string
  powerOutputKW: number; investmentCr: number; efficiency: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#be123c', '#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#9f1239', '#881337', '#4c0519']

const records: TELRecord[] = [
  { id: 'TEL-0001', projectId: 'TEL-001', city: 'Jamshedpur', operator: 'Tata Steel TEG Division', moduleType: 'Bi2Te3 Industrial Waste Heat',
    powerOutputKW: 850, investmentCr: 520, efficiency: 8.2, status: 'Delivered', priority: 'Critical', origin: 'Tata Steel Plant', destination: 'Jamshedpur TEG Station', shipDate: '2025-04-05', transitDays: 1, state: 'Jharkhand',
    remarks: 'Bi2Te3 thermoelectric generators capturing 850 kW from Tata Steel blast furnace waste heat at 8.2% conversion efficiency. System reduces coke consumption by 3% annually. &#8377;520 Cr installation covers 12 furnace stacks with automated hot-side heat exchanger integration for continuous power generation.' },
  { id: 'TEL-0002', projectId: 'TEL-002', city: 'Rourkela', operator: 'SAIL RSP TEG Systems', moduleType: 'PbTe High Temp Generator',
    powerOutputKW: 1200, investmentCr: 680, efficiency: 12.5, status: 'Delivered', priority: 'Critical', origin: 'Rourkela Steel Plant', destination: 'RSP Sinter Plant', shipDate: '2025-04-10', transitDays: 2, state: 'Odisha',
    remarks: 'PbTe high-temperature thermoelectric generators at Rourkela Steel Plant sinter plant capturing 1,200 kW from 500&#176;C exhaust gases. Lead telluride modules achieve 12.5% efficiency at elevated temperatures. &#8377;680 Cr project is India&apos;s largest industrial TEG installation under SAIL decarbonization programme.' },
  { id: 'TEL-0003', projectId: 'TEL-003', city: 'Bhilai', operator: 'BSP TEG Operations', moduleType: 'SiGe Aerospace Grade',
    powerOutputKW: 350, investmentCr: 420, efficiency: 14.1, status: 'Delivered', priority: 'High', origin: 'Bhilai Steel Plant', destination: 'BSP Coke Oven', shipDate: '2025-04-02', transitDays: 1, state: 'Chhattisgarh',
    remarks: 'SiGe (Silicon-Germanium) thermoelectric modules at Bhilai Steel Plant coke oven battery. High-efficiency 14.1% conversion from 700&#176;C coke oven exhaust. &#8377;420 Cr installation integrates with existing waste gas recovery system for combined heat-power optimization and emission reduction.' },
  { id: 'TEL-0004', projectId: 'TEL-004', city: 'Mumbai', operator: 'Reliance Petrochemical TEG', moduleType: 'Skutterudite CoSb3 Module',
    powerOutputKW: 980, investmentCr: 590, efficiency: 11.8, status: 'Delivered', priority: 'High', origin: 'Jamnagar Refinery', destination: 'Reliance Mumbai HQ', shipDate: '2025-03-28', transitDays: 3, state: 'Maharashtra',
    remarks: 'Skutterudite CoSb3 thermoelectric modules at Reliance Jamnagar refinery converting 980 kW from catalytic cracker exhaust. Filler-filled skutterudite achieves 11.8% efficiency at 550&#176;C operating temperature. &#8377;590 Cr deployment covers 8 refinery process units with remote monitoring via IoT sensors.' },
  { id: 'TEL-0005', projectId: 'TEL-005', city: 'Vishakhapatnam', operator: 'HPCL TEG Unit', moduleType: 'Half-Heusler NiTiSn',
    powerOutputKW: 450, investmentCr: 310, efficiency: 10.3, status: 'In Transit', priority: 'High', origin: 'HPCL Refinery Visakhapatnam', destination: 'Vizag VRP Complex', shipDate: '2025-04-15', transitDays: 2, state: 'Andhra Pradesh',
    remarks: 'Half-Heusler NiTiSn thermoelectric generators en route to HPCL Visakhapatnam refinery for process heat recovery. Eco-friendly non-toxic Half-Heusler alloy replaces lead-containing modules. 450 kW rated capacity at &#8377;310 Cr for VRP complex crude distillation unit waste heat utilization.' },
  { id: 'TEL-0006', projectId: 'TEL-006', city: 'Bengaluru', operator: 'Wipro IoT TEG Division', moduleType: 'Bi2Te3 Data Center Cooling',
    powerOutputKW: 280, investmentCr: 340, efficiency: 6.5, status: 'Delivered', priority: 'Medium', origin: 'Wipro Electronic City', destination: 'Bengaluru DC Park', shipDate: '2025-04-08', transitDays: 1, state: 'Karnataka',
    remarks: 'Bi2Te3 thermoelectric modules harvesting 280 kW from Bengaluru data center server rack exhaust heat. Low-grade heat recovery at 80&#176;C with 6.5% efficiency using optimized bismuth telluride. &#8377;340 Cr project also provides active cooling reducing chiller energy consumption by 25% for Wipro data center operations.' },
  { id: 'TEL-0007', projectId: 'TEL-007', city: 'Gujrat', operator: 'Adani LNG TEG System', moduleType: 'PbTe LNG Regasification',
    powerOutputKW: 720, investmentCr: 480, efficiency: 9.7, status: 'Delivered', priority: 'Critical', origin: 'Adani Hazira LNG', destination: 'Hazira Power Station', shipDate: '2025-03-25', transitDays: 1, state: 'Gujarat',
    remarks: 'PbTe thermoelectric generators at Adani Hazira LNG terminal capturing cold-to-hot temperature differential during LNG regasification. 720 kW output from -162&#176;C LNG to 35&#176;C pipeline gas conversion. &#8377;480 Cr system eliminates 720 kW gas-fired heating previously needed for vaporizer operation.' },
  { id: 'TEL-0008', projectId: 'TEL-008', city: 'Chennai', operator: 'IIT Madras TEG Research', moduleType: 'Mg3Sb2 Eco-Friendly Module',
    powerOutputKW: 120, investmentCr: 180, efficiency: 7.8, status: 'Delivered', priority: 'Medium', origin: 'IITM Research Park', destination: 'Guindy Industrial Area', shipDate: '2025-04-12', transitDays: 2, state: 'Tamil Nadu',
    remarks: 'IIT Madras-developed Mg3Sb2 magnesium antimonide modules for industrial waste heat at &#8377;180 Cr. Earth-abundant magnesium replaces expensive tellurium reducing module cost by 60%. 120 kW pilot deployment at Guindy industrial area proving commercial viability with 7.8% efficiency at 400&#176;C.' },
  { id: 'TEL-0009', projectId: 'TEL-009', city: 'Kota', operator: 'NTPC TEG Retrofit', moduleType: 'Bi2Te3 Power Plant Condenser',
    powerOutputKW: 1500, investmentCr: 820, efficiency: 5.2, status: 'Delayed', priority: 'Critical', origin: 'NTPC Anta Gas', destination: 'Kota Thermal Plant', shipDate: '2025-03-15', transitDays: 5, state: 'Rajasthan',
    remarks: 'Bi2Te3 thermoelectric array retrofit at NTPC Kota thermal power plant condenser outlet delayed by monsoon. 1,500 kW from 40&#176;C cooling water temperature differential. &#8377;820 Cr project demonstrates low-grade heat recovery from existing 2,100 MW coal fleet without modifying main steam cycle efficiency.' },
  { id: 'TEL-0010', projectId: 'TEL-010', city: 'Hyderabad', operator: 'DRDO TEG Defence', moduleType: 'SiGe Military Grade RTG',
    powerOutputKW: 45, investmentCr: 260, efficiency: 15.2, status: 'Delivered', priority: 'High', origin: 'DRDO Hyderabad', destination: 'DRDO Leh Station', shipDate: '2025-04-01', transitDays: 8, state: 'Telangana',
    remarks: 'SiGe military-grade radioisotope thermoelectric generators for DRDO high-altitude stations in Leh-Ladakh. 15.2% efficiency at extreme cold -40&#176;C ambient with 45 kW continuous power for 5 years unattended. &#8377;260 Cr strategic defence project eliminating diesel generator logistics at Siachen and Daulat Beg Oldi posts.' },
  { id: 'TEL-0011', projectId: 'TEL-011', city: 'Kolkata', operator: 'CESC Waste Heat TEG', moduleType: 'PbTe Boiler Exhaust',
    powerOutputKW: 380, investmentCr: 290, efficiency: 8.9, status: 'Delivered', priority: 'Medium', origin: 'CESC Titagarh', destination: 'CESC New Cossipore', shipDate: '2025-04-18', transitDays: 2, state: 'West Bengal',
    remarks: 'PbTe thermoelectric modules recovering 380 kW from CESC coal-fired boiler exhaust at 8.9% efficiency. System installed on 500 MW Unit-6 boiler flue gas duct. &#8377;290 Cr investment provides zero-fuel continuous power reducing station auxiliary consumption by 0.8% for CESC Kolkata operations.' },
  { id: 'TEL-0012', projectId: 'TEL-012', city: 'Kochi', operator: 'BPCL Kochi Refinery TEG', moduleType: 'Clathrate Ba8Ga16Ge30 Module',
    powerOutputKW: 210, investmentCr: 220, efficiency: 11.0, status: 'Processing', priority: 'Low', origin: 'BPCL Kochi Refinery', destination: 'Kochi Petrochemical', shipDate: '2025-04-22', transitDays: 1, state: 'Kerala',
    remarks: 'Clathrate Ba8Ga16Ge30 type-I thermoelectric modules for BPCL Kochi refinery under processing. 11.0% efficiency at intermediate temperature range 200-400&#176;C ideal for refinery process streams. &#8377;220 Cr pilot installation for 3 process units with expansion to 8 units planned by 2027.' },
  { id: 'TEL-0013', projectId: 'TEL-013', city: 'Bhopal', operator: 'BHEL TEG Manufacturing', moduleType: 'Oxide Perovskite Ca3Co4O9',
    powerOutputKW: 550, investmentCr: 370, efficiency: 6.8, status: 'Delivered', priority: 'Medium', origin: 'BHEL Bhopal Plant', destination: 'MP Power Plant', shipDate: '2025-04-06', transitDays: 3, state: 'Madhya Pradesh',
    remarks: 'Oxide perovskite Ca3Co4O9 thermoelectric modules manufactured by BHEL for Madhya Pradesh power plant. Cobaltite oxide ceramic achieves 6.8% efficiency in air at 800&#176;C without encapsulation. &#8377;370 Cr project demonstrates Indian oxide TEG manufacturing capability with 14 modules per unit for utility-scale deployment.' },
  { id: 'TEL-0014', projectId: 'TEL-014', city: 'Nagpur', operator: 'MOIL Manganese TEG', moduleType: 'AgSbTe2 Silver Antimonide',
    powerOutputKW: 160, investmentCr: 240, efficiency: 13.5, status: 'Delayed', priority: 'High', origin: 'MOIL Nagpur Plant', destination: 'MOIL Balaghat Mine', shipDate: '2025-03-20', transitDays: 4, state: 'Maharashtra',
    remarks: 'AgSbTe2 silver antimonide TEG for MOIL manganese mine waste heat recovery delayed by supply chain issue for silver feedstock. 160 kW from mine furnace exhaust at 13.5% efficiency. &#8377;240 Cr deployment at Balaghat mine reduced diesel generator consumption by 35% for underground mine ventilation systems.' },
]

export default function ThermoElectricLogisticsView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof TELRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'moduleType', label: 'Module Type', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.moduleType] = (m[r.moduleType] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Power Output', value: `${filtered.reduce((a: number, r) => a + r.powerOutputKW, 0).toLocaleString()} kW` },
    { label: 'Avg Efficiency', value: `${(filtered.reduce((a: number, r) => a + r.efficiency, 0) / Math.max(1, filtered.length)).toFixed(1)}%` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Avg Cost/kW', value: `&#8377;${(filtered.reduce((a: number, r) => a + r.investmentCr, 0) * 100 / Math.max(1, filtered.reduce((a: number, r) => a + r.powerOutputKW, 0))).toFixed(0)} L` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: TELRecord) => string, val: (r: TELRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.powerOutputKW)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const matBar = grp(r => r.moduleType, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const effData = filtered.map(r => ({ name: r.moduleType.split(' ').slice(0, 2).join(' '), value: r.efficiency }))
    const lm = filtered.reduce((a: Record<string, { powerOutputKW: number; investmentCr: number }>, r) => {
      if (!a[r.state]) a[r.state] = { powerOutputKW: 0, investmentCr: 0 }
      a[r.state].powerOutputKW += r.powerOutputKW; a[r.state].investmentCr += r.investmentCr; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, powerOutputKW: v.powerOutputKW, investmentCr: v.investmentCr }))
    return { barState, pieState, statusPie, matBar, priorityPie, totalInvest, effData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="tel-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Thermo Electric' }]} />
      <PageHeader title="Thermo Electric Logistics" description="Track thermoelectric generator supply chains, TEG module logistics, Seebeck effect energy harvesting materials distribution, and industrial waste heat recovery systems for steel, refinery and power plants across India" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="tel-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`tel-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-rose-900 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="tel-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="tel-kpi-card"><CardContent className="p-4"><p className="tel-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="tel-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="tel-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="tel-chart-title text-sm">Power Output (kW) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#be123c" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="tel-chart-title text-sm">Installations by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="tel-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="tel-chart-title text-sm">Efficiency (%) by Module Type</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.effData}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} domain={[4, 18]} /><Tooltip /><Bar dataKey="value" fill="#e11d48" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="tel-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="tel-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`tel-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-rose-900'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.moduleType} | {r.state}</p>
              <p className="text-xs mt-1">{r.powerOutputKW.toLocaleString()} kW | {r.efficiency}% efficiency | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="tel-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="tel-chart-title text-sm">Power Output vs Investment by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="powerOutputKW" stroke="#be123c" name="Power kW" /><Line yAxisId="right" type="monotone" dataKey="investmentCr" stroke="#fda4af" name="Investment &#8377; Cr" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="tel-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#9f1239" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="tel-chart-title text-sm">Module Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.matBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#e11d48" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="tel-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="tel-insights grid grid-cols-2 gap-4">
        <Card className="tel-insight-card border-l-4 border-l-rose-900"><CardContent className="p-5">
          <h4 className="tel-insight-title font-semibold text-base">India&apos;s 10 GW Industrial Waste Heat Recovery Potential</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s steel, cement and refinery industries emit 15 GW of waste heat recoverable through thermoelectric generators. Bureau of Energy Efficiency estimates 10 GW installable TEG capacity at current Bi2Te3 and PbTe technology levels. National Mission for Enhanced Energy Efficiency targeting 3 GW TEG deployment by 2030 under Perform Achieve Trade scheme for industrial decarbonization.</p>
        </CardContent></Card>
        <Card className="tel-insight-card border-l-4 border-l-rose-900"><CardContent className="p-5">
          <h4 className="tel-insight-title font-semibold text-base">Tellurium Supply: India&apos;s Strategic Dependency</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India imports 100% of tellurium for Bi2Te3 thermoelectric modules, creating critical supply chain vulnerability. CSIR and Hindalco developing tellurium recovery from copper anode slime to achieve 30% domestic production by 2028. Simultaneously, CSIR-IMMT developing Mg3Sb2 tellurium-free alternatives achieving comparable efficiency at 60% lower material cost.</p>
        </CardContent></Card>
        <Card className="tel-insight-card border-l-4 border-l-rose-900"><CardContent className="p-5">
          <h4 className="tel-insight-title font-semibold text-base">LNG Cold Energy: Untapped Thermoelectric Source</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s 7 LNG terminals regasify 30 million tonnes annually releasing 3 GW of cold energy. Thermoelectric generators can capture temperature differential between -162&#176;C LNG and ambient for power generation. Petronet LNG, GAIL and Adani targeting 500 MW TEG capacity at Dahej, Kochi, Ennore and Mundra terminals by 2028 under MoPNG&apos;s gas infrastructure optimization programme.</p>
        </CardContent></Card>
        <Card className="tel-insight-card border-l-4 border-l-rose-900"><CardContent className="p-5">
          <h4 className="tel-insight-title font-semibold text-base">Military RTG: Siachen Power Independence</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">DRDO deploying SiGe radioisotope thermoelectric generators at Siachen and Daulat Beg Oldi for 5-year unattended power supply. RTGs eliminate hazardous diesel helicopter resupply missions saving &#8377;150 Cr annually in logistics costs. DRDO-BARC developed Pu-238 fuel pellets with indigenous isotope production from CIRUS reactor supporting 50 military RTG installations by 2028.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
