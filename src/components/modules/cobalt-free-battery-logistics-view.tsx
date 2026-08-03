'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface CFBRecord {
  id: string; projectId: string; city: string; operator: string; chemistryType: string
  capacityMWh: number; investmentCr: number; energyDensity: number; cycleLife: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#065f46', '#047857', '#059669', '#10b981', '#34d399', '#064e3b', '#022c22', '#14532d']

const records: CFBRecord[] = [
  { id: 'CFB-0001', projectId: 'CFB-001', city: 'Bengaluru', operator: 'Ather LFP Cell Works', chemistryType: 'LFP Prismatic 280Ah',
    capacityMWh: 95, investmentCr: 420, energyDensity: 160, cycleLife: 6000, status: 'Delivered', priority: 'Critical', origin: 'Ather Hosur Plant', destination: 'Bengaluru Assembly Hub', shipDate: '2025-05-05', transitDays: 1, state: 'Karnataka',
    remarks: 'LFP prismatic 280Ah cobalt-free battery cell manufacturing at Ather Energy Bengaluru facility. 95 MWh annual capacity producing phosphate-based cathode cells eliminating cobalt dependency entirely. &#8377;420 Cr plant uses indigenous lithium iron phosphate chemistry developed at IIT Bangalore reducing raw material cost by 40% versus NMC cells while achieving 6,000 cycle life for electric two-wheeler and three-wheeler applications across India under PLI ACC scheme.' },
  { id: 'CFB-0002', projectId: 'CFB-002', city: 'Gandhinagar', operator: 'Reliance LFP Gigafactory', chemistryType: 'LFP Blade 230Ah',
    capacityMWh: 150, investmentCr: 720, energyDensity: 170, cycleLife: 7000, status: 'Delivered', priority: 'Critical', origin: 'Reliance Jamnagar RE Hub', destination: 'Dhirubhai Ambani Green Park', shipDate: '2025-05-10', transitDays: 2, state: 'Gujarat',
    remarks: 'LFP blade cell 230Ah cobalt-free gigafactory at Reliance Dhirubhai Ambani Green Energy Park in Jamnagar with 150 MWh annual capacity. India&apos;s largest cobalt-free battery facility using blade-type prismatic cells optimized for energy storage and EV applications. &#8377;720 Cr investment under Reliance&apos;s &#8377;75,000 Cr green energy transition plan producing cells at &#8377;4,500/kWh versus imported NMC at &#8377;7,200/kWh with zero cobalt supply chain risk from DRC conflict zones.' },
  { id: 'CFB-0003', projectId: 'CFB-003', city: 'Pune', operator: 'Exide LFP Battery Works', chemistryType: 'LFMP Cylindrical 4680',
    capacityMWh: 80, investmentCr: 380, energyDensity: 185, cycleLife: 5500, status: 'Delivered', priority: 'High', origin: 'Exide Pune Chemical', destination: 'Pune EV Industrial Zone', shipDate: '2025-05-02', transitDays: 1, state: 'Maharashtra',
    remarks: 'Lithium ferromanganese phosphate cylindrical 4680 cobalt-free cells at Exide Industries Pune facility with 80 MWh annual capacity. LFMP chemistry adds manganese to LFP for 15% higher energy density while remaining cobalt-free. &#8377;380 Cr plant serves Tata Punch EV and Mahindra XUV400 battery packs with locally produced cells reducing import dependency from 85% to 40% under Exide&apos;s &#8377;2,500 Cr cell manufacturing roadmap approved by DIPP.' },
  { id: 'CFB-0004', projectId: 'CFB-004', city: 'Chennai', operator: 'Amara Raja LFP Plant', chemistryType: 'LFP Pouch 200Ah',
    capacityMWh: 70, investmentCr: 330, energyDensity: 155, cycleLife: 6500, status: 'In Transit', priority: 'High', origin: 'Amara Raja Tirupati', destination: 'Chennai Export Processing', shipDate: '2025-05-15', transitDays: 2, state: 'Tamil Nadu',
    remarks: 'LFP pouch 200Ah cobalt-free cells en route to Amara Raja Energy Chennai export processing zone from Tirupati facility. 70 MWh annual capacity producing pouch cells for European EV market export and domestic stationary storage. &#8377;330 Cr investment leverages Amara Raja&apos;s 40-year lead-acid battery manufacturing expertise transitioning to lithium technology. Chennai Port export logistics enable competitive shipping to European OEMs requiring cobalt-free batteries under EU Battery Regulation 2023 effective February 2027.' },
  { id: 'CFB-0005', projectId: 'CFB-005', city: 'Hyderabad', operator: 'Greene Energy LMFP Works', chemistryType: 'LMFP Prismatic 350Ah',
    capacityMWh: 110, investmentCr: 510, energyDensity: 210, cycleLife: 4500, status: 'Delivered', priority: 'Critical', origin: 'Greene Hyderabad Campus', destination: 'Hyderabad Battery Valley', shipDate: '2025-04-28', transitDays: 1, state: 'Telangana',
    remarks: 'Lithium manganese iron phosphate prismatic 350Ah cells at Greene Energy Hyderabad Battery Valley with 110 MWh annual capacity. LMFP chemistry achieves 210 Wh/kg energy density approaching NMC532 performance without cobalt or nickel. &#8377;510 Cr plant developed with CSIR-IICT technology transfer using indigenous manganese source from MOIL Nagpur producing India&apos;s highest energy density cobalt-free cells for Ola Electric S1 Pro and Ather 450X Gen3 flagship electric scooters.' },
  { id: 'CFB-0006', projectId: 'CFB-006', city: 'Kolkata', operator: 'Bengal LFP Energy Storage', chemistryType: 'LFP Container 100kWh',
    capacityMWh: 65, investmentCr: 280, energyDensity: 145, cycleLife: 8000, status: 'Delivered', priority: 'Medium', origin: 'Bengal Chemical Works', destination: 'Kolkata Grid Station', shipDate: '2025-05-08', transitDays: 1, state: 'West Bengal',
    remarks: 'LFP containerized 100kWh energy storage battery systems at Kolkata grid station with 65 MWh annual assembly capacity. Cobalt-free stationary storage optimized for cycle life over energy density achieving 8,000 cycles at 90% depth of discharge. &#8377;280 Cr facility serves WBSEDCL grid-scale storage and Kolkata Metro regenerative braking energy capture. Long cycle life matches 20-year infrastructure asset lifetime eliminating battery replacement costs that plague NMC-based grid storage installations.' },
  { id: 'CFB-0007', projectId: 'CFB-007', city: 'Bhopal', operator: 'MP LNMO Cell Pilot', chemistryType: 'LNMO Spinel 200Ah',
    capacityMWh: 40, investmentCr: 195, energyDensity: 220, cycleLife: 3500, status: 'Delivered', priority: 'Medium', origin: 'MP Rare Earth Corp', destination: 'Bhopal Technology Park', shipDate: '2025-04-25', transitDays: 2, state: 'Madhya Pradesh',
    remarks: 'Lithium nickel manganese oxide spinel 200Ah cobalt-free pilot cells at Bhopal Technology Park with 40 MWh annual capacity. LNMO spinel chemistry achieves 220 Wh/kg using only nickel and manganese eliminating both cobalt dependency. &#8377;195 Cr pilot plant developed by IIT Indore and BHEL producing cells for defence applications where cobalt-free supply chain is strategic imperative under DRDO modernisation programme for unmanned ground vehicle and portable military power systems.' },
  { id: 'CFB-0008', projectId: 'CFB-008', city: 'Noida', operator: 'ONELN LFP Pack Assembly', chemistryType: 'LFP Module 156Ah',
    capacityMWh: 55, investmentCr: 245, energyDensity: 165, cycleLife: 6000, status: 'Delivered', priority: 'High', origin: 'ONELN Greater Noida', destination: 'Noida EV Cluster', shipDate: '2025-05-12', transitDays: 1, state: 'Uttar Pradesh',
    remarks: 'LFP module 156Ah pack assembly at Ola Electric and ONELN Noida EV cluster with 55 MWh annual capacity. Produces standardized LFP modules for rapid EV battery pack assembly serving Suzuki-Maruti EV launch planned for 2026. &#8377;245 Cr facility produces drop-in LFP modules compatible with existing NMC pack architectures enabling automakers to switch cathode chemistry without redesigning battery management systems under Maruti Suzuki&apos;s &#8377;10,500 Cr EV production roadmap for Gujarat and Haryana plants.' },
  { id: 'CFB-0009', projectId: 'CFB-009', city: 'Jaipur', operator: 'Rajasthan Na-Ion LFP Hybrid', chemistryType: 'Na-Ion Hard Carbon 120Ah',
    capacityMWh: 35, investmentCr: 155, energyDensity: 140, cycleLife: 4000, status: 'Delayed', priority: 'Medium', origin: 'Rajasthan Soda Ash Supply', destination: 'Jaipur Clean Energy Park', shipDate: '2025-04-15', transitDays: 4, state: 'Rajasthan',
    remarks: 'Sodium-ion hard carbon 120Ah cobalt-free cells delayed by Rajasthan soda ash supply logistics at Jaipur Clean Energy Park. 35 MWh capacity producing India&apos;s first commercial Na-ion cells using Rajasthan&apos;s abundant sodium from Sambhar Lake and Tata Chemicals soda ash. &#8377;155 Cr project eliminates lithium dependency entirely using hard carbon anode from rice husk ash achieving 140 Wh/kg at &#8377;1,800/kWh cell cost, 60% cheaper than cheapest LFP cells targeting budget EV segment under PM E-DRIVE scheme for sub-&#8377;5 lakh electric vehicles.' },
  { id: 'CFB-0010', projectId: 'CFB-010', city: 'Bhubaneswar', operator: 'Odisha LNMAO Cathode Pilot', chemistryType: 'LNMAO Layered 180Ah',
    capacityMWh: 28, investmentCr: 135, energyDensity: 195, cycleLife: 3000, status: 'Processing', priority: 'Low', origin: 'NALCO Mn Supply', destination: 'Bhubaneswar Test Facility', shipDate: '2025-05-01', transitDays: 2, state: 'Odisha',
    remarks: 'Lithium nickel manganese aluminium oxide layered 180Ah cathode pilot at Bhubaneswar test facility with 28 MWh capacity. LNMAO chemistry developed by IMMT Bhubaneswar and NALCO using Odisha manganese achieves 195 Wh/kg cobalt-free. &#8377;135 Cr pilot demonstrates India&apos;s third-generation cobalt-free cathode technology for grid storage and commercial vehicle applications where moderate cycle life of 3,000 cycles provides 8-year operational lifetime for intra-city electric bus fleets operated by state transport undertakings.' },
  { id: 'CFB-0011', projectId: 'CFB-011', city: 'Vishakhapatnam', operator: 'Vizag LFP Marine Grade', chemistryType: 'LFP Marine 280Ah',
    capacityMWh: 45, investmentCr: 215, energyDensity: 150, cycleLife: 7000, status: 'Delivered', priority: 'Medium', origin: 'Vizag Shipyard Supply', destination: 'Vizag Maritime Battery', shipDate: '2025-05-18', transitDays: 2, state: 'Andhra Pradesh',
    remarks: 'Marine-grade LFP 280Ah cobalt-free cells at Visakhapatnam maritime battery facility with 45 MWh annual capacity. Salt-spray and vibration-tested LFP cells for Cochin Shipyard electric propulsion and fishing vessel electrification programme. &#8377;215 Cr facility produces cells meeting DNV-GL maritime battery certification for Indian Navy auxiliary electric vessels and 2,000 fishing vessel electrification under PM Matsya Sampada Yojana reducing diesel consumption by 40,000 kl annually across Andhra Pradesh and Tamil Nadu coastal fishing fleet.' },
  { id: 'CFB-0012', projectId: 'CFB-012', city: 'Gurugram', operator: 'Haryana LFP Telecom Backup', chemistryType: 'LFP Telecom 100Ah',
    capacityMWh: 30, investmentCr: 130, energyDensity: 130, cycleLife: 10000, status: 'Delivered', priority: 'Low', origin: 'Gurugram Industrial Area', destination: 'North India Telecom Hub', shipDate: '2025-05-22', transitDays: 1, state: 'Haryana',
    remarks: 'LFP 100Ah cobalt-free telecom backup cells at Gurugram North India telecom hub with 30 MWh annual capacity. Ultra-long cycle life 10,000+ cycles optimized for 10-year telecom tower backup replacing lead-acid and VRLA batteries at 500,000 Jio and Airtel tower sites across northern India. &#8377;130 Cr facility produces cells at &#8377;2,100/kWh 60% cheaper than lithium NMC backup systems with zero thermal runaway risk eliminating tower fire incidents that caused 23 deaths in 2024 under DoT mandate for lithium-based tower backup by 2027.' },
  { id: 'CFB-0013', projectId: 'CFB-013', city: 'Kochi', operator: 'Kerala LFP Solar Storage', chemistryType: 'LFP Home 50Ah',
    capacityMWh: 25, investmentCr: 108, energyDensity: 125, cycleLife: 9000, status: 'Delivered', priority: 'Low', origin: 'Kochi Assembly Unit', destination: 'Kerala Solar Installer Network', shipDate: '2025-05-06', transitDays: 1, state: 'Kerala',
    remarks: 'LFP 50Ah cobalt-free home solar storage cells at Kochi assembly unit with 25 MWh annual capacity serving Kerala&apos;s residential rooftop solar-plus-storage market under ANERT programme. &#8377;108 Cr facility produces compact LFP cells for 3-5 kWh home battery systems at &#8377;15,000 per installed kWh enabling 500,000 Kerala households to store daytime solar for evening use. Ultra-safe LFP chemistry eliminates fire risk in densely populated residential installations exceeding BIS IS 16046 safety standards by 3x safety margin.' },
  { id: 'CFB-0014', projectId: 'CFB-014', city: 'Guwahati', operator: 'NE LFP Microgrid Cells', chemistryType: 'LFP Microgrid 200Ah',
    capacityMWh: 22, investmentCr: 98, energyDensity: 140, cycleLife: 7500, status: 'Delayed', priority: 'Medium', origin: 'Assam Industrial Hub', destination: 'NE Microgrid Programme', shipDate: '2025-04-20', transitDays: 6, state: 'Assam',
    remarks: 'LFP 200Ah cobalt-free microgrid cells for northeast India off-grid electrification delayed by monsoon logistics at Guwahati industrial hub. 22 MWh capacity producing microgrid battery systems for 500 villages in Assam, Arunachal Pradesh and Meghalaya under MNRE off-grid solar programme. &#8377;98 Cr facility delayed pending road connectivity restoration for equipment transport through Meghalaya hills with expected commissioning by Q3 2026 serving 50 MW of village-level solar-plus-storage microgrid installations across NE states.' },
]

export default function CobaltFreeBatteryLogisticsView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof CFBRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'chemistryType', label: 'Chemistry', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.chemistryType] = (m[r.chemistryType] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Capacity', value: `${filtered.reduce((a: number, r) => a + r.capacityMWh, 0).toLocaleString()} MWh` },
    { label: 'Avg Energy Density', value: `${(filtered.reduce((a: number, r) => a + r.energyDensity, 0) / Math.max(1, filtered.length)).toFixed(0)} Wh/kg` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Avg Cycle Life', value: `${(filtered.reduce((a: number, r) => a + r.cycleLife, 0) / Math.max(1, filtered.length)).toLocaleString()}` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: CFBRecord) => string, val: (r: CFBRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.capacityMWh)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const chemBar = grp(r => r.chemistryType, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const edData = filtered.map(r => ({ name: r.chemistryType.split(' ').slice(0, 2).join(' '), value: r.energyDensity }))
    const lm = filtered.reduce((a: Record<string, { capacityMWh: number; investmentCr: number }>, r) => {
      if (!a[r.state]) a[r.state] = { capacityMWh: 0, investmentCr: 0 }
      a[r.state].capacityMWh += r.capacityMWh; a[r.state].investmentCr += r.investmentCr; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, capacityMWh: v.capacityMWh, investmentCr: v.investmentCr }))
    return { barState, pieState, statusPie, chemBar, priorityPie, totalInvest, edData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="cfb-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Cobalt-Free Battery' }]} />
      <PageHeader title="Cobalt-Free Battery Logistics" description="Track cobalt-free battery cell supply chains, LFP/LMFP/LNMO chemistry logistics, phosphate-based cathode distribution, and ethical battery manufacturing without cobalt dependency for EV and energy storage across India" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="cfb-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`cfb-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-emerald-900 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="cfb-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="cfb-kpi-card"><CardContent className="p-4"><p className="cfb-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="cfb-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="cfb-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="cfb-chart-title text-sm">Cell Capacity (MWh) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#065f46" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="cfb-chart-title text-sm">Facilities by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="cfb-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="cfb-chart-title text-sm">Energy Density (Wh/kg) by Chemistry</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.edData}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} domain={[120, 230]} /><Tooltip /><Bar dataKey="value" fill="#047857" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="cfb-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="cfb-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`cfb-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-emerald-800'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.chemistryType} | {r.state}</p>
              <p className="text-xs mt-1">{r.capacityMWh} MWh | {r.energyDensity} Wh/kg | {r.cycleLife.toLocaleString()} cycles | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="cfb-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="cfb-chart-title text-sm">Capacity vs Investment by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="capacityMWh" stroke="#065f46" name="Capacity MWh" /><Line yAxisId="right" type="monotone" dataKey="investmentCr" stroke="#10b981" name="Investment &#8377; Cr" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="cfb-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#064e3b" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="cfb-chart-title text-sm">Chemistry Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.chemBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#047857" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="cfb-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="cfb-insights grid grid-cols-2 gap-4">
        <Card className="cfb-insight-card border-l-4 border-l-emerald-800"><CardContent className="p-5">
          <h4 className="cfb-insight-title font-semibold text-base">Why Cobalt-Free: Ethics and Supply Security</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Cobalt mining in DRC employs 200,000 artisanal miners including 40,000 children under hazardous conditions with zero safety regulations. Global cobalt prices volatile from $30,000 to $82,000/tonne creating unpredictable battery costs. India imported 8,500 tonnes of cobalt worth &#8377;4,200 Cr in 2024 with 65% from DRC subject to conflict mineral sanctions. Cobalt-free LFP and LMFP chemistries eliminate this ethical and supply chain risk entirely while using iron, manganese and phosphate abundantly available in India through MOIL, NMDC and Paradeep Phosphates at stable domestic prices.</p>
        </CardContent></Card>
        <Card className="cfb-insight-card border-l-4 border-l-emerald-800"><CardContent className="p-5">
          <h4 className="cfb-insight-title font-semibold text-base">LFP Revolution: 65% Cost Advantage Over NMC</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Lithium iron phosphate cells cost &#8377;4,500/kWh at cell level versus &#8377;7,200/kWh for NMC622 in India as of 2025. With India&apos;s 30 million EV target by 2030, switching to LFP saves &#8377;81,000 Cr in cumulative battery costs. LFP thermal stability eliminates need for active cooling reducing pack-level cost by additional 15%. Reliance Jamnagar, Ather Bengaluru and Ola Noida collectively commissioning 350 MWh LFP capacity by 2026 making India the world&apos;s second-largest LFP producer after China, targeting &#8377;12,000 Cr annual cobalt-free battery export revenue by 2028 to European markets mandating ethical battery sourcing.</p>
        </CardContent></Card>
        <Card className="cfb-insight-card border-l-4 border-l-emerald-800"><CardContent className="p-5">
          <h4 className="cfb-insight-title font-semibold text-base">LMFP Breakthrough: NMC Performance Without Cobalt</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Lithium manganese iron phosphate achieves 210 Wh/kg energy density approaching NMC532 at 215 Wh/kg while maintaining cobalt-free chemistry. Greene Energy Hyderabad and IIT Hyderabad collaborating on manganese-doped LFP achieving 15% higher voltage plateau at 4.1V versus standard LFP at 3.2V. India&apos;s MOIL producing 95,000 TPA manganese oxide provides sufficient feedstock for 200 GWh LMFP cells annually. DRDO and ISRO evaluating LMFP for satellite and missile applications where cobalt-free supply chain provides strategic material independence for India&apos;s space and defence programmes.</p>
        </CardContent></Card>
        <Card className="cfb-insight-card border-l-4 border-l-emerald-800"><CardContent className="p-5">
          <h4 className="cfb-insight-title font-semibold text-base">EU Battery Regulation: Cobalt-Free Mandate by 2027</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">European Union Battery Regulation 2023 requires battery carbon footprint declarations from 2025, recycled content minimums of 16% cobalt by 2031, and mandatory supply chain due diligence for cobalt sourced from conflict zones. India&apos;s cobalt-free battery production positions it ideally for EU market access avoiding complex cobalt sourcing compliance. Amara Raja Chennai and Exide Pune establishing dedicated LFP export lines for European OEMs BMW, Volkswagen and Stellantis who committed to 50% cobalt-free cell procurement by 2028, creating &#8377;8,000 Cr annual export opportunity for Indian cobalt-free battery manufacturers.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
