'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface MFLRecord {
  id: string; projectId: string; city: string; operator: string; fuelType: string
  capacityKLPD: number; investmentCr: number; carbonReduction: number; energyPerLitre: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#065f46', '#047857', '#059669', '#10b981', '#34d399', '#022c22', '#0a3d2e', '#064e3b']

const records: MFLRecord[] = [
  { id: 'MFL-0001', projectId: 'MFL-001', city: 'Mumbai', operator: 'Mumbai Green Methanol Refinery', fuelType: 'Biomass-to-Methanol',
    capacityKLPD: 350, investmentCr: 520, carbonReduction: 92, energyPerLitre: 15.8, status: 'Delivered', priority: 'Critical', origin: 'Maharashtra Biomass Hub', destination: 'Mumbai Port Terminal', shipDate: '2025-05-03', transitDays: 1, state: 'Maharashtra',
    remarks: 'Biomass-to-methanol production facility at Mumbai converting 350 KLPD of green methanol from Maharashtra agricultural residue and urban organic waste through gasification-synthesis route. &#8377;520 Cr plant produces 92% carbon-reduced methanol for Mumbai shipping fuel blend, chemical industry and fuel cell applications replacing fossil methanol from imported natural gas. Mumbai Port Trust mandating 15% green methanol blend for all bunker fuel sold to international shipping vessels by 2027 under IMO GHG Strategy reducing Mumbai maritime emissions by 45% and qualifying for International Carbon Credit revenue of &#8377;180 Cr annually under Paris Agreement Article 6.2 bilateral carbon trading mechanism.' },
  { id: 'MFL-0002', projectId: 'MFL-002', city: 'Kochi', operator: 'Kerala Maritime Methanol Works', fuelType: 'e-Methanol Maritime Fuel',
    capacityKLPD: 280, investmentCr: 440, carbonReduction: 95, energyPerLitre: 16.2, status: 'Delivered', priority: 'Critical', origin: 'Kerala Green Hydrogen', destination: 'Kochi Ship Bunkering', shipDate: '2025-05-07', transitDays: 1, state: 'Kerala',
    remarks: 'Electro-methanol maritime fuel facility at Kochi producing 280 KLPD of 95% carbon-reduced e-methanol from green hydrogen and captured CO2 through catalytic hydrogenation for ship bunkering. &#8377;440 Cr plant serves Kochi International Container Terminal and Cochin Shipyard newbuild vessels meeting IMO 2030 carbon intensity reduction targets. Electro-methanol enabling 60% lifecycle GHG reduction versus heavy fuel oil for coastal vessel operations from Kochi to Colombo, Male and Dubai routes under DG Shipping Green Ship Incentive Programme 2025 providing 25% port fee discount for green methanol-powered vessels calling at Indian ports.' },
  { id: 'MFL-0003', projectId: 'MFL-003', city: 'Jamshedpur', operator: 'Jharkhand Coal Methanol Hub', fuelType: 'Coal-to-Methanol CTL',
    capacityKLPD: 500, investmentCr: 680, carbonReduction: 45, energyPerLitre: 19.8, status: 'Delivered', priority: 'High', origin: 'Jharkhand Coal Mines', destination: 'Jamshedpur Chemical Zone', shipDate: '2025-05-01', transitDays: 1, state: 'Jharkhand',
    remarks: 'Coal-to-liquid methanol production facility at Jamshedpur converting 500 KLPD of methanol from Jharkhand thermal coal through high-pressure coal gasification and methanol synthesis with carbon capture. &#8377;680 Cr CTL plant produces methanol for formaldehyde, acetic acid and olefin production serving Jamshedpur and Ranchi chemical industries while capturing 45% of CO2 emissions through pre-combustion carbon capture. Coal Ministry promoting CTL-methanol as bridge technology for coal utilisation with carbon capture under National Coal Gasification Mission with Jamshedpur hub producing &#8377;2,500 Cr methanol annually replacing 40% of imported methanol for eastern India chemical industry.' },
  { id: 'MFL-0004', projectId: 'MFL-004', city: 'Bengaluru', operator: 'Karnataka MSW-to-MeOH Works', fuelType: 'MSW-to-Methanol Plasma',
    capacityKLPD: 200, investmentCr: 380, carbonReduction: 88, energyPerLitre: 15.2, status: 'In Transit', priority: 'High', origin: 'Bengaluru Municipal Waste', destination: 'Bengaluru Bio-Methanol Hub', shipDate: '2025-05-12', transitDays: 1, state: 'Karnataka',
    remarks: 'Municipal solid waste-to-methanol plasma gasification facility en route to Bengaluru converting 200 KLPD of green methanol from 800 TPD of BBMP-collected organic and plastic waste through plasma-assisted gasification and catalytic methanol synthesis. &#8377;380 Cr plant produces 88% carbon-reduced methanol for Bangalore Metropolitan Transport Corporation 200 buses on methanol fuel cell powertrain and 50 MW fuel cell power generation. MSW-to-methanol pathway achieving negative carbon footprint through waste diversion preventing methane emissions from landfills while producing transport fuel under Karnataka Waste-to-Energy and Green Fuel Mandate 2025 targeting 500 KLPD waste-derived methanol from all tier-1 cities by 2028.' },
  { id: 'MFL-0005', projectId: 'MFL-005', city: 'Gandhinagar', operator: 'Gujarat CO2-to-MeOH Plant', fuelType: 'CO2 Hydrogenation Methanol',
    capacityKLPD: 300, investmentCr: 560, carbonReduction: 98, energyPerLitre: 16.8, status: 'Delivered', priority: 'Critical', origin: 'Gujarat Refinery CO2', destination: 'Gandhinagar Green Fuel Hub', shipDate: '2025-05-05', transitDays: 1, state: 'Gujarat',
    remarks: 'Carbon dioxide hydrogenation-to-methanol facility at Gandhinagar producing 300 KLPD of near-zero-carbon methanol from captured CO2 at Gujarat refineries and green hydrogen from Gujarat solar and wind electrolysis. &#8377;560 Cr plant achieves 98% lifecycle carbon reduction using concentrated CO2 streams from Reliance Jamnagar and Essar Vadinar refineries as carbon feedstock. Gujarat targeting 10 GW green hydrogen electrolyser capacity by 2030 providing abundant hydrogen for CO2-to-methanol conversion at 6 refinery sites producing 2,000 KLPD green methanol under Gujarat Green Hydrogen and Methanol Economy Policy 2025 positioning Gujarat as India&apos;s methanol fuel capital.' },
  { id: 'MFL-0006', projectId: 'MFL-006', city: 'Kolkata', operator: 'WB Jute Methanol Plant', fuelType: 'Jute Waste Methanol',
    capacityKLPD: 180, investmentCr: 280, carbonReduction: 85, energyPerLitre: 14.5, status: 'Delivered', priority: 'Medium', origin: 'WB Jute Mills Waste', destination: 'Kolkata Chemical Hub', shipDate: '2025-05-08', transitDays: 1, state: 'West Bengal',
    remarks: 'Jute waste-to-methanol facility at Kolkata converting 180 KLPD of green methanol from 600 TPD jute stalk waste of West Bengal jute mills through catalytic hydrothermal liquefaction and methanol synthesis. &#8377;280 Cr plant converts jute cellulose and hemicellulose into methanol for Kolkata chemical industry and 10 MW fuel cell power while producing lignin co-product for bio-char briquettes. West Bengal&apos;s 90 jute mills generating 8 million tonnes jute stalk waste annually with 60% currently burned creating massive methanol feedstock opportunity under National Jute Board Jute Waste Valorisation Programme targeting 2,000 KLPD jute-derived methanol across West Bengal by 2028.' },
  { id: 'MFL-0007', projectId: 'MFL-007', city: 'Tuticorin', operator: 'TN Maritime Methanol Bunker', fuelType: 'Green Methanol Bunker',
    capacityKLPD: 250, investmentCr: 410, carbonReduction: 90, energyPerLitre: 15.6, status: 'Delivered', priority: 'High', origin: 'TN Biomass Methanol', destination: 'Tuticorin Port Bunker', shipDate: '2025-05-04', transitDays: 1, state: 'Tamil Nadu',
    remarks: 'Green methanol maritime bunkering terminal at Tuticorin port storing and distributing 250 KLPD of biomass-derived green methanol for international and coastal vessel bunkering serving East-West shipping lane traffic. &#8377;410 Cr bunkering terminal with 50,000 KL storage capacity serving 800 vessels annually at Tuticorin Port replacing heavy fuel oil bunkering with 90% carbon-reduced green methanol. V.O. Chidambaranar Port Authority designating Tuticorin as India&apos;s first green methanol bunkering hub under Sagarmala Green Port Programme 2025 with three Indian ports targeting 1,000 KLPD green methanol bunkering capacity by 2028 capturing 5% of global green maritime fuel market transiting Indian Ocean routes.' },
  { id: 'MFL-0008', projectId: 'MFL-008', city: 'Hyderabad', operator: 'Telangana Syngas Methanol', fuelType: 'Syngas-to-Methanol OTM',
    capacityKLPD: 400, investmentCr: 490, carbonReduction: 55, energyPerLitre: 18.4, status: 'Delivered', priority: 'High', origin: 'Telangana Coal Syngas', destination: 'Hyderabad Petrochemical Hub', shipDate: '2025-05-06', transitDays: 1, state: 'Telangana',
    remarks: 'Syngas-to-methanol facility at Hyderabad producing 400 KLPD of methanol from coal-derived syngas through oxygen-to-methanol catalytic conversion for Telangana petrochemical and fertiliser industry. &#8377;490 Cr plant converts syngas from Telangana coal gasification plants into methanol for acetic acid production serving Laurus Labs and Dr. Reddys pharmaceutical manufacturing. OTM process achieving 55% carbon reduction versus conventional natural gas methanol through carbon capture integration under Telangana Chemical Industry Feedstock Diversification Programme 2025 with Hyderabad methanol corridor serving 12 pharmaceutical and chemical companies reducing natural gas dependency by &#8377;1,200 Cr annually.' },
  { id: 'MFL-0009', projectId: 'MFL-009', city: 'Paradip', operator: 'Odisha LNG-to-MeOH Works', fuelType: 'LNG-to-Methanol Autothermal',
    capacityKLPD: 350, investmentCr: 420, carbonReduction: 30, energyPerLitre: 20.1, status: 'Delivered', priority: 'Medium', origin: 'Paradip LNG Terminal', destination: 'Paradip Chemical Zone', shipDate: '2025-05-02', transitDays: 1, state: 'Odisha',
    remarks: 'LNG-to-methanol autothermal reforming facility at Paradip converting 350 KLPD of methanol from imported LNG through autothermal reforming and methanol synthesis for Paradip and Cuttack industrial chemical consumers. &#8377;420 Cr plant achieves 30% carbon reduction versus coal-based methanol through efficient natural gas conversion at 65% overall energy efficiency. Paradip methanol hub serving Indian Farmers Fertiliser Cooperative and Paradeep Phosphates urea-methanol integration reducing fertiliser production cost by 12% under Odisha Petrochemical and Fertiliser Feedstock Policy 2025 with Paradip Port LNG-methanol corridor targeting 1,000 KLPD capacity by 2028 from expanding LNG import infrastructure.' },
  { id: 'MFL-0010', projectId: 'MFL-010', city: 'Bhopal', operator: 'MP Biomass Methanol Hub', fuelType: 'Soya Waste Methanol',
    capacityKLPD: 150, investmentCr: 220, carbonReduction: 82, energyPerLitre: 14.8, status: 'In Transit', priority: 'Medium', origin: 'MP Soyabean Mills', destination: 'Bhopal Green Fuel Terminal', shipDate: '2025-05-14', transitDays: 1, state: 'Madhya Pradesh',
    remarks: 'Soyabean waste-to-methanol facility en route to Bhopal converting 150 KLPD of green methanol from 500 TPD soya stalk and oil cake waste from Madhya Pradesh soyabean oil mills through hydrothermal liquefaction. &#8377;220 Cr plant serves Bhopal and Indore industrial chemical consumers with 82% carbon-reduced methanol while producing soya protein concentrate co-product. MP India&apos;s largest soyabean producing state generating 5 million tonnes soyabean waste annually with 40% currently burned creating significant methanol feedstock opportunity under Madhya Pradesh Bio-Economy and Agricultural Waste Valorisation Mission targeting 500 KLPD agricultural waste methanol by 2028.' },
  { id: 'MFL-011', projectId: 'MFL-011', city: 'Guwahati', operator: 'Assam Biomass Methanol NE', fuelType: 'Bamboo Methanol',
    capacityKLPD: 120, investmentCr: 195, carbonReduction: 86, energyPerLitre: 14.2, status: 'Delivered', priority: 'Medium', origin: 'Assam Bamboo Forests', destination: 'Guwahati NE Fuel Hub', shipDate: '2025-05-09', transitDays: 1, state: 'Assam',
    remarks: 'Bamboo-to-methanol production facility at Guwahati converting 120 KLPD of green methanol from 400 TPD bamboo feedstock through catalytic hydrothermal liquefaction for Northeast India fuel and chemical applications. &#8377;195 Cr plant serves Assam and Northeast states with carbon-neutral methanol for 50 MW fuel cell power generation and methanol fuel blending replacing 20,000 KL imported diesel for power generation. Assam possessing 30% of India&apos;s bamboo reserves with 3.5 million hectares bamboo forest providing sustainable methanol feedstock under National Bamboo Mission creating 2,000 KLPD bamboo methanol capacity by 2028 for Northeast India energy security and forest economy development.' },
  { id: 'MFL-012', projectId: 'MFL-012', city: 'Mangalore', operator: 'Karnataka Bio-MeOH Marine', fuelType: 'Bio-Methanol Marine 99%',
    capacityKLPD: 220, investmentCr: 390, carbonReduction: 94, energyPerLitre: 16.0, status: 'Delivered', priority: 'High', origin: 'Karnataka Bio-Methanol', destination: 'Mangalore Port Bunker', shipDate: '2025-05-10', transitDays: 1, state: 'Karnataka',
    remarks: 'Bio-methanol marine fuel production and bunkering facility at Mangalore producing 220 KLPD of 99% purity bio-methanol for New Mangalore Port vessel bunkering and MRPL refinery co-processing. &#8377;390 Cr plant achieves 94% carbon reduction using Karnataka bio-mass gasification syngas for methanol synthesis meeting ISCC Plus sustainability certification for EU renewable fuel mandate compliance. Mangalore Port Authority establishing second Indian green methanol bunkering hub after Tuticorin with combined 470 KLPD green methanol bunkering capacity serving Arabian Sea shipping lanes under Ministry of Ports Green Maritime Fuel Programme 2025 targeting 3,000 KLPD across 6 Indian ports by 2030.' },
  { id: 'MFL-013', projectId: 'MFL-013', city: 'Visakhapatnam', operator: 'AP Fish Waste Methanol', fuelType: 'Fish Waste Methanol',
    capacityKLPD: 100, investmentCr: 165, carbonReduction: 78, energyPerLitre: 13.8, status: 'Delivered', priority: 'Medium', origin: 'Visakhapatnam Fish Harbour', destination: 'Vizag Bio-Fuel Terminal', shipDate: '2025-05-11', transitDays: 1, state: 'Andhra Pradesh',
    remarks: 'Fish processing waste-to-methanol facility at Visakhapatnam converting 100 KLPD of green methanol from 350 TPD fish waste, fish offal and shellfish residue from Vizag fishing harbour through hydrothermal liquefaction and methanol synthesis. &#8377;165 Cr plant solves Visakhapatnam harbour fish waste disposal problem while producing methanol for AP Eastern Power Distribution Company fuel cell peaking plants and Vizag Steel blast furnace injection. Fish waste methanol pathway recovering 80% of fish biomass carbon into methanol with nitrogen-rich residue as organic fertiliser for AP coastal agriculture under Andhra Pradesh Blue Economy and Fishery Waste Valorisation Programme 2025 targeting 300 KLPD fish-derived methanol across AP&apos;s 13 fishing harbours by 2028.' },
  { id: 'MFL-014', projectId: 'MFL-014', city: 'Lucknow', operator: 'UP Straw Methanol Works', fuelType: 'Wheat Straw Methanol',
    capacityKLPD: 250, investmentCr: 340, carbonReduction: 84, energyPerLitre: 15.0, status: 'Delayed', priority: 'High', origin: 'UP Wheat Harvest Residue', destination: 'Lucknow Green Fuel Hub', shipDate: '2025-05-16', transitDays: 2, state: 'Uttar Pradesh',
    remarks: 'Wheat straw-to-methanol facility at Lucknow converting 250 KLPD of green methanol from 850 TPD wheat straw residue from Uttar Pradesh wheat harvest through catalytic gasification and methanol synthesis with carbon capture. &#8377;340 Cr plant addresses UP wheat straw burning crisis by converting 850 TPD of residue into methanol for Lucknow city bus fleet fuel cell conversion and industrial heating. UP generating 120 million tonnes wheat straw annually with 60% currently burned causing severe north India air pollution crisis with project preventing 400,000 tonnes CO2 equivalent emissions annually under National Crop Residue Management and Green Fuel Programme 2025 targeting 5,000 KLPD straw methanol across Punjab, Haryana and UP by 2028.' },
]

export default function MethanolFuelLogisticsView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof MFLRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'fuelType', label: 'Fuel Type', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.fuelType] = (m[r.fuelType] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Capacity', value: `${filtered.reduce((a: number, r) => a + r.capacityKLPD, 0).toLocaleString()} KLPD` },
    { label: 'Avg Carbon Reduction', value: `${(filtered.reduce((a: number, r) => a + r.carbonReduction, 0) / Math.max(1, filtered.length)).toFixed(1)}%` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Avg Energy/L', value: `${(filtered.reduce((a: number, r) => a + r.energyPerLitre, 0) / Math.max(1, filtered.length)).toFixed(1)} MJ/L` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: MFLRecord) => string, val: (r: MFLRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.capacityKLPD)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const typeBar = grp(r => r.fuelType, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const carbonData = filtered.map(r => ({ name: r.fuelType.split(' ').slice(0, 2).join(' '), value: r.carbonReduction }))
    const lm = filtered.reduce((a: Record<string, { capacityKLPD: number; investmentCr: number }>, r) => {
      if (!a[r.state]) a[r.state] = { capacityKLPD: 0, investmentCr: 0 }
      a[r.state].capacityKLPD += r.capacityKLPD; a[r.state].investmentCr += r.investmentCr; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, capacityKLPD: v.capacityKLPD, investmentCr: v.investmentCr }))
    return { barState, pieState, statusPie, typeBar, priorityPie, totalInvest, carbonData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="mfl-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Methanol Fuel' }]} />
      <PageHeader title="Methanol Fuel Logistics" description="Track green methanol fuel supply chains, biomass-to-methanol production logistics, CO2-to-methanol maritime fuel distribution, and India's methanol economy programme for shipping, transport and chemical industries" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="mfl-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t as 'dashboard' | 'registry' | 'analytics' | 'insights')} className={`mfl-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-emerald-900 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="mfl-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="mfl-kpi-card"><CardContent className="p-4"><p className="mfl-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="mfl-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="mfl-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="mfl-chart-title text-sm">Production Capacity (KLPD) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#065f46" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="mfl-chart-title text-sm">Facilities by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="mfl-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="mfl-chart-title text-sm">Carbon Reduction (%) by Fuel Type</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.carbonData}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} domain={[20, 100]} /><Tooltip /><Bar dataKey="value" fill="#047857" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="mfl-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="mfl-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`mfl-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-emerald-900'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.fuelType} | {r.state}</p>
              <p className="text-xs mt-1">{r.capacityKLPD.toLocaleString()} KLPD | {r.carbonReduction}% CO2 red. | {r.energyPerLitre} MJ/L | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="mfl-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="mfl-chart-title text-sm">Capacity vs Investment by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="capacityKLPD" stroke="#065f46" name="Capacity KLPD" /><Line yAxisId="right" type="monotone" dataKey="investmentCr" stroke="#34d399" name="Investment &#8377; Cr" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="mfl-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#022c22" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="mfl-chart-title text-sm">Fuel Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.typeBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#047857" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="mfl-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="mfl-insights grid grid-cols-2 gap-4">
        <Card className="mfl-insight-card border-l-4 border-l-emerald-900"><CardContent className="p-5">
          <h4 className="mfl-insight-title font-semibold text-base">India&apos;s &#8377;18,000 Cr Green Methanol Target by 2028</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India targeting 10,000 KLPD green methanol production by 2028 under NITI Aayog Methanol Economy Roadmap with &#8377;18,000 Cr investment allocation from Ministry of Petroleum, Ministry of Ports and Ministry of New and Renewable Energy. Green methanol replacing 20% of imported crude oil equivalent for transport fuel and 30% of methanol chemical industry feedstock currently imported. India consuming 6 million tonnes methanol annually importing 85% from Saudi Arabia, Iran and Oman with domestic production increasing from 700 KLPD to 10,000 KLPD reducing import bill by &#8377;25,000 Cr annually under National Methanol Economy Programme creating 150,000 direct and indirect jobs in methanol production, distribution and end-use industries.</p>
        </CardContent></Card>
        <Card className="mfl-insight-card border-l-4 border-l-emerald-900"><CardContent className="p-5">
          <h4 className="mfl-insight-title font-semibold text-base">Green Maritime Methanol: IMO 2030 Compliance</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">International Maritime Organisation mandating 40% carbon intensity reduction for international shipping by 2030 creating 3,000 KLPD green methanol demand at 6 Indian ports serving 15,000 vessels annually transiting Indian Ocean shipping lanes. Maersk, COSCO and Evergreen already operating 30 methanol-powered container vessels with 200 more on order creating assured demand for Indian-produced green methanol. Ministry of Ports establishing green methanol bunkering at Tuticorin, Mangalore, Paradip, Kandla, Mumbai and Vizag ports under Sagarmala Green Maritime Corridor Programme 2025 with combined 3,000 KLPD capacity serving 40% of Indian Ocean green fuel demand and generating &#8377;2,500 Cr annual bunkering revenue.</p>
        </CardContent></Card>
        <Card className="mfl-insight-card border-l-4 border-l-emerald-900"><CardContent className="p-5">
          <h4 className="mfl-insight-title font-semibold text-base">Crop Residue Methanol: Punjab Air Pollution Solution</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Punjab, Haryana and Uttar Pradesh generating 160 million tonnes of crop residue annually with 55% burned in open fields causing severe north India air pollution crisis with PM2.5 levels exceeding 500 microgram/m3 during October-November. Supreme Court directed state governments to eliminate stubble burning by 2025 with methanol production from crop residue providing dual benefit of pollution control and green fuel production. Ministry of New and Renewable Energy estimating 5,000 KLPD methanol potential from wheat and paddy straw across three states requiring &#8377;7,500 Cr investment in 40 biomass gasification-methanol plants under National Crop Residue Management Mission 2025 eliminating 200,000 stubble fires annually while producing transport fuel worth &#8377;9,000 Cr.</p>
        </CardContent></Card>
        <Card className="mfl-insight-card border-l-4 border-l-emerald-900"><CardContent className="p-5">
          <h4 className="mfl-insight-title font-semibold text-base">Methanol Fuel Cell: 500 MW Power by 2028</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India targeting 500 MW methanol fuel cell power generation capacity by 2028 under MNRE Methanol Fuel Cell Mission replacing diesel generators and gas turbines for distributed power and industrial cogeneration. Methanol fuel cells achieving 55% electrical efficiency versus 40% for diesel generators with zero local emissions and near-silent operation ideal for urban commercial buildings and telecom towers. NTPC, BHEL and IOCL jointly developing 250 MW methanol fuel cell programme at 8 sites in Delhi, Mumbai, Bengaluru, Chennai, Kolkata, Hyderabad, Pune and Lucknow under MNRE Clean Distributed Energy Programme 2025 with methanol fuel cell levelized electricity cost of &#8377;4.5 per kWh competitive with diesel generator cost of &#8377;12 per kWh in urban commercial areas.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
