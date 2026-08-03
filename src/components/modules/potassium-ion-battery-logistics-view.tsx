'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface KIBRecord {
  id: string; projectId: string; city: string; operator: string; cellChemistry: string
  capacityMWh: number; investmentCr: number; energyDensity: number; cycleLife: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#7e22ce', '#6b21a8', '#581c87', '#a855f7', '#c084fc', '#3b0764', '#2e1065', '#4c1d95']

const records: KIBRecord[] = [
  { id: 'KIB-0001', projectId: 'KIB-001', city: 'Bengaluru', operator: 'Bengaluru K-Ion Cell Works', cellChemistry: 'K-Ion Prismatic 100Ah',
    capacityMWh: 85, investmentCr: 310, energyDensity: 160, cycleLife: 3500, status: 'Delivered', priority: 'Critical', origin: 'Rajasthan K-Salt Mines', destination: 'Bengaluru K-Ion Gigafactory', shipDate: '2025-05-03', transitDays: 2, state: 'Karnataka',
    remarks: 'Potassium-ion prismatic 100Ah cell manufacturing facility at Bengaluru producing 85 MWh annually of 160 Wh/kg potassium-ion cells using potassium manganese hexacyanoferrate cathode and hard carbon anode. &#8377;310 Cr gigafactory serves Indian stationary energy storage market where potassium-ion&apos;s 3500 cycle life and zero-lithium chemistry reduce cost to &#8377;800 per kWh versus &#8377;1,500 for lithium iron phosphate cells. Karnataka Renewable Energy Development Agency mandating 500 MWh potassium-ion storage for state grid balancing programme under Karnataka Clean Energy Policy 2025 with Bengaluru plant supplying 17% of state requirement at 47% lower levelized storage cost than lithium alternatives.' },
  { id: 'KIB-0002', projectId: 'KIB-002', city: 'Hyderabad', operator: 'Telangana K-Ion Tech Hub', cellChemistry: 'K-Ion Cylindrical 4680',
    capacityMWh: 65, investmentCr: 280, energyDensity: 170, cycleLife: 3200, status: 'Delivered', priority: 'Critical', origin: 'MP Potash Refinery', destination: 'Hyderabad EV Cell Park', shipDate: '2025-05-07', transitDays: 1, state: 'Telangana',
    remarks: 'Potassium-ion 4680 cylindrical cell plant at Hyderabad producing 65 MWh of 170 Wh/kg potassium-ion cells in Tesla 4680 form factor using potassium vanadium phosphate cathode with graphite composite anode. &#8377;280 Cr facility enables drop-in replacement for lithium-ion 4680 cells in existing EV battery pack manufacturing lines serving Indian two-wheeler and three-wheeler manufacturers. K-ion chemistry eliminates cobalt and nickel dependency reducing geopolitical supply chain risk while achieving 3200 cycle life sufficient for commercial vehicle applications under Telangana EV Manufacturing and Battery Policy 2025 targeting 200,000 K-ion cell electric three-wheelers by 2028.' },
  { id: 'KIB-0003', projectId: 'KIB-003', city: 'Pune', operator: 'Maharashtra K-Ion Grid Storage', cellChemistry: 'K-Ion Container 500kWh',
    capacityMWh: 120, investmentCr: 350, energyDensity: 140, cycleLife: 4000, status: 'In Transit', priority: 'High', origin: 'Rajasthan K-Salt Mines', destination: 'Pune Grid Storage Hub', shipDate: '2025-05-12', transitDays: 2, state: 'Maharashtra',
    remarks: 'Potassium-ion containerised 500kWh grid storage system manufacturing en route to Pune producing 120 MWh annually of integrated potassium-ion battery containers for utility-scale renewable energy integration. &#8377;350 Cr plant assembles K-ion cells into 20-foot ISO containers each providing 500kWh 4-hour storage with 4000 cycle life for solar and wind farm peak shifting. Maharashtra State Electricity Distribution Company tendering 2 GWh of potassium-ion grid storage preferring K-ion over lithium for non-flammable aqueous electrolyte safety eliminating thermal runaway risk that caused 12 lithium battery warehouse fires in Mumbai metropolitan area in 2024.' },
  { id: 'KIB-0004', projectId: 'KIB-004', city: 'Gandhinagar', operator: 'Gujarat K-Salt Processing Hub', cellChemistry: 'K-Ion Pouch 200Ah',
    capacityMWh: 95, investmentCr: 295, energyDensity: 155, cycleLife: 3800, status: 'Delivered', priority: 'High', origin: 'Gujarat Potash Brine', destination: 'Gandhinagar K-Ion Park', shipDate: '2025-05-01', transitDays: 1, state: 'Gujarat',
    remarks: 'Potassium-ion pouch 200Ah cell manufacturing facility at Gandhinagar producing 95 MWh annually of 155 Wh/kg pouch cells using potassium Prussian blue analogue cathode with biomass-derived hard carbon anode. &#8377;295 Cr plant achieves 3800 cycle life with aqueous electrolyte enabling inherently safe battery chemistry for Gujarat&apos;s 35 GW solar fleet requiring 5 GWh daily storage. Gujarat Energy Development Agency designating potassium-ion as preferred chemistry for agricultural pump and rural microgrid storage due to non-toxic electrolyte eliminating groundwater contamination risk under Gujarat Groundwater Protection and Energy Storage Directive 2025.' },
  { id: 'KIB-0005', projectId: 'KIB-005', city: 'Chennai', operator: 'TN K-Ion Marine Battery', cellChemistry: 'K-Ion Marine 280Ah',
    capacityMWh: 55, investmentCr: 220, energyDensity: 145, cycleLife: 4500, status: 'Delivered', priority: 'High', origin: 'TN K-Salt Production', destination: 'Chennai Shipyard Hub', shipDate: '2025-05-05', transitDays: 1, state: 'Tamil Nadu',
    remarks: 'Potassium-ion marine 280Ah cell plant at Chennai producing 55 MWh annually of 145 Wh/kg marine-grade potassium-ion cells with aqueous electrolyte certified for shipboard use by Indian Register of Shipping. &#8377;220 Cr facility serves Cochin Shipyard and GRSE Kolkata electric vessel construction programme replacing lead-acid batteries on 300 inland waterway vessels and 50 coastal cargo ships. Marine-grade K-ion cells achieving 4500 cycle life with zero thermal runaway risk meeting International Maritime Organisation SOLAS battery safety requirements for passenger vessel electrification under National Inland Waterways programme converting 2,000 diesel vessels to electric propulsion by 2030.' },
  { id: 'KIB-0006', projectId: 'KIB-006', city: 'Kolkata', operator: 'West Bengal K-Ion Telecom', cellChemistry: 'K-Ion Telecom 50Ah',
    capacityMWh: 40, investmentCr: 165, energyDensity: 130, cycleLife: 5000, status: 'Delivered', priority: 'Medium', origin: 'Rajasthan K-Salt Mines', destination: 'Kolkata Telecom Hub', shipDate: '2025-05-08', transitDays: 2, state: 'West Bengal',
    remarks: 'Potassium-ion telecom 50Ah cell facility at Kolkata producing 40 MWh annually of 130 Wh/kg telecom tower backup battery cells with exceptional 5000 cycle life for 10-year tower site operation without replacement. &#8377;165 Cr plant supplies Jio, Airtel and Vi telecom tower backup systems across West Bengal, Bihar and Odisha replacing 200,000 lead-acid and 50,000 lithium-ion telecom batteries. K-ion&apos;s non-flammable aqueous electrolyte eliminating 35 tower battery fire incidents per year in Eastern India while providing 70% lower total cost of ownership than lead-acid under Department of Telecom Green Telecom Infrastructure mandate 2025 requiring all new tower batteries to be non-flammable and recyclable.' },
  { id: 'KIB-0007', projectId: 'KIB-007', city: 'Bhubaneswar', operator: 'Odisha K-Ion Mining Battery', cellChemistry: 'K-Ion Mining LFP 100Ah',
    capacityMWh: 70, investmentCr: 240, energyDensity: 150, cycleLife: 4200, status: 'In Transit', priority: 'High', origin: 'Odisha Potash Deposits', destination: 'Bhubaneswar Mining Hub', shipDate: '2025-05-14', transitDays: 2, state: 'Odisha',
    remarks: 'Potassium-ion mining battery plant en route to Bhubaneswar producing 70 MWh of 150 Wh/kg underground mining safety-rated potassium-ion batteries certified by DGMS for hazardous area use in coal and metal mines. &#8377;240 Cr facility serves Coal India underground mines in Jharkhand, Chhattisgarh and Odisha replacing 8,000 lead-acid locomotive batteries and 15,000 miner cap lamp batteries. K-ion&apos;s aqueous electrolyte eliminates methane explosion risk from thermal runaway in gassy underground mines meeting DGMS Gas Safety Regulation Amendment 2025 requiring all underground battery equipment to pass intrinsic safety certification with potassium-ion cells passing all 14 DGMS test protocols.' },
  { id: 'KIB-0008', projectId: 'KIB-008', city: 'Jaipur', operator: 'Rajasthan K-Salt Extraction', cellChemistry: 'K-Ion Prismatic 150Ah',
    capacityMWh: 100, investmentCr: 320, energyDensity: 165, cycleLife: 3600, status: 'Delivered', priority: 'Critical', origin: 'Rajasthan Potash Lakes', destination: 'Jaipur K-Ion Hub', shipDate: '2025-05-06', transitDays: 1, state: 'Rajasthan',
    remarks: 'Potassium-ion prismatic 150Ah cell plant at Jaipur producing 100 MWh of 165 Wh/kg potassium-ion cells integrated with Rajasthan&apos;s Sambhar Lake potash extraction facility providing domestic potassium feedstock for Indian K-ion industry. &#8377;320 Cr vertically integrated facility converts Sambhar Lake potash brine into battery-grade potassium hexacyanoferrate cathode material and potassium hydroxide electrolyte reducing cell production cost by 25% versus imported potassium salts. Rajasthan controlling 60% of India&apos;s potash resources with Sambhar Lake alone containing 28 million tonnes of potassium chloride equivalent sufficient for 50 years of Indian K-ion cell production under Rajasthan Critical Minerals and Battery Material Policy 2025.' },
  { id: 'KIB-0009', projectId: 'KIB-009', city: 'Lucknow', operator: 'UP K-Ion Agricultural', cellChemistry: 'K-Ion Agri Pump 300Ah',
    capacityMWh: 60, investmentCr: 195, energyDensity: 125, cycleLife: 4800, status: 'Delivered', priority: 'Medium', origin: 'Rajasthan K-Salt Mines', destination: 'Lucknow Agri Hub', shipDate: '2025-05-04', transitDays: 2, state: 'Uttar Pradesh',
    remarks: 'Potassium-ion agricultural pump battery plant at Lucknow producing 60 MWh of 125 Wh/kg high-cycle-life K-ion battery systems for solar-powered agricultural pump sets replacing 100,000 diesel pump sets across Uttar Pradesh. &#8377;195 Cr facility achieves 4800 cycle life equivalent to 13 years daily cycling for kharif and rabi irrigation pumping with aqueous electrolyte safe for rural household installation. UP New and Renewable Energy Development Agency distributing 50,000 K-ion solar pump systems under PM-KUSUM programme with K-ion cells preferred over lithium due to non-toxic electrolyte eliminating soil and groundwater contamination risk from accidental battery damage in agricultural fields.' },
  { id: 'KIB-0010', projectId: 'KIB-010', city: 'Ahmedabad', operator: 'Gujarat K-Ion Data Centre', cellChemistry: 'K-Ion DC Rack 200Ah',
    capacityMWh: 45, investmentCr: 210, energyDensity: 135, cycleLife: 5500, status: 'Delivered', priority: 'High', origin: 'Gujarat Potash Brine', destination: 'Ahmedabad DC Park', shipDate: '2025-05-09', transitDays: 1, state: 'Gujarat',
    remarks: 'Potassium-ion data centre rack battery plant at Ahmedabad producing 45 MWh of 135 Wh/kg UPS-grade K-ion battery modules achieving industry-leading 5500 cycle life for 24/7 data centre backup power applications. &#8377;210 Cr facility serves Aadhaar data centre, NPCI payment systems and AWS Mumbai region with non-flammable K-ion backup power eliminating lithium battery fire risk that caused &#8377;850 Cr data centre outage losses globally in 2024. K-ion&apos;s aqueous electrolyte rated for 25-year calendar life enabling maintenance-free data centre UPS operation under Bureau of Indian Standards data centre safety code IS 14962 Amendment 2025 requiring all new data centre batteries to pass non-flammability testing.' },
  { id: 'KIB-0011', projectId: 'KIB-011', city: 'Indore', operator: 'MP K-Ion Home Storage', cellChemistry: 'K-Ion Home 10kWh',
    capacityMWh: 35, investmentCr: 145, energyDensity: 120, cycleLife: 5000, status: 'Delivered', priority: 'Medium', origin: 'MP Potash Refinery', destination: 'Indore Residential Hub', shipDate: '2025-05-02', transitDays: 1, state: 'Madhya Pradesh',
    remarks: 'Potassium-ion home storage 10kWh battery plant at Indore producing 35 MWh of 120 Wh/kg residential energy storage systems for rooftop solar-plus-storage applications serving 15,000 Indian households annually. &#8377;145 Cr facility manufactures wall-mounted and floor-standing K-ion home batteries with 5000 cycle life providing 10kWh storage for overnight solar self-consumption reducing household electricity bills by 65%. Ministry of New and Renewable Energy subsidising 40% of K-ion home battery cost under PM Surya Ghar Yojana extension programme with Indore plant supplying MP, Chhattisgarh and Rajasthan residential markets through 500 distributor network under MNRE Residential Energy Storage Mission 2025.' },
  { id: 'KIB-0012', projectId: 'KIB-012', city: 'Guwahati', operator: 'Assam K-Ion Microgrid', cellChemistry: 'K-Ion Microgrid 100kWh',
    capacityMWh: 30, investmentCr: 130, energyDensity: 115, cycleLife: 4500, status: 'In Transit', priority: 'Medium', origin: 'Rajasthan K-Salt Mines', destination: 'Guwahati NE Grid Hub', shipDate: '2025-05-11', transitDays: 5, state: 'Assam',
    remarks: 'Potassium-ion microgrid battery plant en route to Guwahati producing 30 MWh of 115 Wh/kg microgrid-scale K-ion battery containers for Northeast India village electrification and island grid stabilisation. &#8377;130 Cr facility serves Assam, Meghalaya, Arunachal Pradesh and Tripura microgrid programmes providing 100kWh community storage for solar-powered village clusters replacing diesel generators in 500 off-grid villages. North Eastern Electric Power Corporation and Assam State Electricity Board deploying K-ion microgrid batteries in 50 MW solar village programme with K-ion preferred for humid tropical climate stability and non-toxic electrolyte safety in ecologically sensitive Northeast India biodiversity hotspots under NECMP 2025.' },
  { id: 'KIB-0013', projectId: 'KIB-013', city: 'Visakhapatnam', operator: 'AP K-Ion Defence', cellChemistry: 'K-Ion Defence Module 200Ah',
    capacityMWh: 25, investmentCr: 115, energyDensity: 155, cycleLife: 3800, status: 'Delivered', priority: 'High', origin: 'Odisha Potash Deposits', destination: 'Vizag Defence Corridor', shipDate: '2025-05-10', transitDays: 2, state: 'Andhra Pradesh',
    remarks: 'Potassium-ion defence-grade battery module plant at Visakhapatnam producing 25 MWh of 155 Wh/kg military-specification K-ion battery modules for Indian Army tactical radios, UAV power systems and battlefield communication equipment. &#8377;115 Cr facility supplies Visakhapatnam Defence Corridor manufacturers including Bharat Electronics and MIDHANI producing K-ion battery packs meeting Indian Army QRD-2025 military battery specifications with 3800 cycle life and -20&#176;C to 60&#176;C operating temperature range. K-ion&apos;s non-flammable aqueous electrolyte eliminating thermal runaway risk in combat conditions providing 100% safe battery operation for frontline military applications under Make in India defence production policy.' },
  { id: 'KIB-0014', projectId: 'KIB-014', city: 'Kochi', operator: 'Kerala K-Ion Fishing', cellChemistry: 'K-Ion Fishing Boat 150Ah',
    capacityMWh: 20, investmentCr: 95, energyDensity: 140, cycleLife: 4200, status: 'Delayed', priority: 'Medium', origin: 'TN K-Salt Production', destination: 'Kochi Fishing Harbour', shipDate: '2025-05-16', transitDays: 2, state: 'Kerala',
    remarks: 'Potassium-ion fishing boat battery plant at Kochi producing 20 MWh of 140 Wh/kg marine-grade K-ion battery packs for traditional deep-sea fishing vessel electrification replacing 50,000 diesel outboard motors across Kerala fishing fleet. &#8377;95 Cr facility integrates K-ion cells into IP67-rated waterproof battery packs rated for saltwater submersion and extreme humidity serving Kochi, Kollam and Alappuzha fishing harbours. Kerala Fisheries Department subsidising K-ion boat conversion under Matsya Keralam programme with 4200 cycle life providing 12-year maintenance-free operation reducing fishing vessel fuel cost by 80% and diesel engine maintenance by 95% while eliminating 200,000 tonnes annual CO2 emissions from Kerala fishing fleet under Kerala Blue Economy Mission 2025.' },
]

export default function PotassiumIonBatteryLogisticsView() {
  const [tab, setTab] = useState<'dashboard' | 'registry' | 'analytics' | 'insights'>('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const toggleFilter = (key: string, value: string) => {
    setActiveFilters(prev => {
      const vals = prev[key] || []
      const next = vals.includes(value) ? vals.filter(v => v !== value) : [...vals, value]
      const updated = { ...prev, [key]: next }
      if (next.length === 0) delete updated[key]
      return updated
    })
  }

  const filtered = useMemo(() => {
    let result = records
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(q)))
    }
    result = result.filter(r =>
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof KIBRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'cellChemistry', label: 'Cell Chemistry', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.cellChemistry] = (m[r.cellChemistry] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Capacity', value: `${filtered.reduce((a: number, r) => a + r.capacityMWh, 0).toLocaleString()} MWh` },
    { label: 'Avg Energy Density', value: `${(filtered.reduce((a: number, r) => a + r.energyDensity, 0) / Math.max(1, filtered.length)).toFixed(0)} Wh/kg` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Avg Cycle Life', value: `${(filtered.reduce((a: number, r) => a + r.cycleLife, 0) / Math.max(1, filtered.length)).toFixed(0)}` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: KIBRecord) => string, val: (r: KIBRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.capacityMWh)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const typeBar = grp(r => r.cellChemistry, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const cycleData = filtered.map(r => ({ name: r.cellChemistry.split(' ').slice(0, 2).join(' '), value: r.cycleLife }))
    const lm = filtered.reduce((a: Record<string, { capacityMWh: number; investmentCr: number }>, r) => {
      if (!a[r.state]) a[r.state] = { capacityMWh: 0, investmentCr: 0 }
      a[r.state].capacityMWh += r.capacityMWh; a[r.state].investmentCr += r.investmentCr; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, capacityMWh: v.capacityMWh, investmentCr: v.investmentCr }))
    return { barState, pieState, statusPie, typeBar, priorityPie, totalInvest, cycleData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="kib-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Potassium-Ion Battery' }]} />
      <PageHeader title="Potassium-Ion Battery Logistics" description="Track potassium-ion battery cell supply chains, K-ion manufacturing logistics, potassium salt feedstock distribution, and India's post-lithium battery programme for grid storage, telecom, marine and defence applications" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="kib-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t as 'dashboard' | 'registry' | 'analytics' | 'insights')} className={`kib-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-purple-800 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="kib-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="kib-kpi-card"><CardContent className="p-4"><p className="kib-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="kib-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="kib-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="kib-chart-title text-sm">Cell Capacity (MWh) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#7e22ce" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="kib-chart-title text-sm">Facilities by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="kib-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="kib-chart-title text-sm">Cycle Life by Cell Chemistry</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.cycleData}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} domain={[0, 6000]} /><Tooltip /><Bar dataKey="value" fill="#6b21a8" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="kib-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="kib-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`kib-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-purple-800'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.cellChemistry} | {r.state}</p>
              <p className="text-xs mt-1">{r.capacityMWh.toLocaleString()} MWh | {r.energyDensity} Wh/kg | {r.cycleLife} cycles | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="kib-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="kib-chart-title text-sm">Capacity vs Investment by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="capacityMWh" stroke="#7e22ce" name="Capacity MWh" /><Line yAxisId="right" type="monotone" dataKey="investmentCr" stroke="#a855f7" name="Investment &#8377; Cr" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="kib-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#581c87" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="kib-chart-title text-sm">Cell Chemistry Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.typeBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#6b21a8" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="kib-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="kib-insights grid grid-cols-2 gap-4">
        <Card className="kib-insight-card border-l-4 border-l-purple-800"><CardContent className="p-5">
          <h4 className="kib-insight-title font-semibold text-base">India&apos;s &#8377;8,500 Cr Potassium-Ion Opportunity by 2028</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s potassium-ion battery market projected to reach &#8377;8,500 Cr by 2028 from &#8377;300 Cr in 2024 growing at 125% CAGR driven by lithium supply chain security concerns and potassium&apos;s abundance as 2.1% of Earth&apos;s crust versus 0.002% for lithium. Ministry of New and Renewable Energy including potassium-ion in National Energy Storage Mission incentive programme with &#8377;3,000 Cr production-linked subsidy for K-ion cell manufacturing. India targeting 5 GWh potassium-ion cell production by 2030 serving grid storage, telecom backup, marine electrification and defence applications where K-ion&apos;s non-flammable aqueous electrolyte provides decisive safety advantage over lithium-ion chemistry.</p>
        </CardContent></Card>
        <Card className="kib-insight-card border-l-4 border-l-purple-800"><CardContent className="p-5">
          <h4 className="kib-insight-title font-semibold text-base">Rajasthan Sambhar Lake: India&apos;s Potassium Goldmine</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Rajasthan&apos;s Sambhar Lake containing 28 million tonnes of potassium chloride equivalent representing India&apos;s largest potash resource sufficient for 50 years of domestic potassium-ion battery production. Geological Survey of India survey identifying additional 15 million tonnes potassium resources in Didwana, Pachpadra and Kuchaman salt lakes extending Rajasthan&apos;s potash leadership to 80% of national resources. Rajasthan government establishing &#8377;1,200 Cr potash extraction and K-ion electrolyte production corridor linking Sambhar Lake to Jaipur K-Ion manufacturing hub creating vertically integrated domestic potassium supply chain eliminating &#8377;2,000 Cr annual potash import dependency on Canada and Belarus under National Critical Mineral Mission.</p>
        </CardContent></Card>
        <Card className="kib-insight-card border-l-4 border-l-purple-800"><CardContent className="p-5">
          <h4 className="kib-insight-title font-semibold text-base">Aqueous Electrolyte: Zero Fire Risk Advantage</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Potassium-ion batteries using aqueous electrolyte are intrinsically non-flammable unlike lithium-ion batteries using organic carbonate solvents which self-ignite at 150&#176;C causing 350+ battery fire incidents annually in India including 12 warehouse fires and 8 EV fires in 2024. Bureau of Indian Standards mandating non-flammable battery chemistry for 15 application categories including telecom towers, data centres, hospitals, underground mines and defence equipment under BIS IS 16046 Amendment 2025. Indian Fire Services Association estimating &#8377;2,500 Cr annual fire damage from lithium batteries that potassium-ion chemistry eliminates entirely through water-based electrolyte that cannot sustain thermal runaway under any abuse condition.</p>
        </CardContent></Card>
        <Card className="kib-insight-card border-l-4 border-l-purple-800"><CardContent className="p-5">
          <h4 className="kib-insight-title font-semibold text-base">K-Ion vs Li-Ion: 47% Lower Grid Storage Cost</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Potassium-ion grid storage systems achieving levelized cost of storage of &#8377;3.8 per kWh per cycle versus &#8377;7.2 for lithium iron phosphate and &#8377;11.5 for lithium nickel manganese cobalt oxide at Indian operating conditions with 45&#176;C ambient temperatures. NITI Aayog energy storage cost analysis demonstrating K-ion&apos;s cost advantage from three factors: potassium salts cost &#8377;150 per kg versus &#8377;1,200 for lithium carbonate, aqueous electrolyte manufacturing eliminates dry room requirement saving &#8377;400 per kWh, and aluminium current collectors replace expensive copper anode foil saving &#8377;250 per kWh. Central Electricity Authority recommending potassium-ion as default chemistry for all new 4-hour and longer grid storage projects under National Electricity Plan 2026-2032.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
