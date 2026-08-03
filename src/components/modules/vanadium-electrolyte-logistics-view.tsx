'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface VELRecord {
  id: string; projectId: string; city: string; operator: string; electrolyteType: string
  capacityKL: number; investmentCr: number; vanadiumPurity: number; energyDensity: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#831843', '#9f1239', '#be123c', '#e11d48', '#f43f5e', '#4c0519', '#500724', '#881337']

const records: VELRecord[] = [
  { id: 'VEL-0001', projectId: 'VEL-001', city: 'Bengaluru', operator: 'Bengaluru V-Electrolyte Corp', electrolyteType: 'VOSO4 1.6M Sulphate',
    capacityKL: 4500, investmentCr: 280, vanadiumPurity: 99.5, energyDensity: 25, status: 'Delivered', priority: 'Critical', origin: 'Karnataka V2O5 Processing', destination: 'Bengaluru VRFB Assembly Hub', shipDate: '2025-05-03', transitDays: 1, state: 'Karnataka',
    remarks: 'Vanadium oxy-sulphate 1.6M electrolyte production facility at Bengaluru processing 4,500 KL of high-purity vanadium electrolyte for grid-scale vanadium redox flow batteries from V2O5 feedstock imported from South Africa and China. &#8377;280 Cr plant produces 99.5% pure VOSO4 electrolyte with 25 Wh/L energy density serving Indian VRFB manufacturers including Indian Railways and Grid Controller of India for 4-hour and 8-hour grid storage applications under National Energy Storage Mission targeting 10 GWh of flow battery capacity by 2030 requiring 25,000 KL vanadium electrolyte annually.' },
  { id: 'VEL-0002', projectId: 'VEL-002', city: 'Hyderabad', operator: 'Telangana Vanadium Works', electrolyteType: 'V2O5 2M Sulphate',
    capacityKL: 3800, investmentCr: 245, vanadiumPurity: 99.3, energyDensity: 28, status: 'Delivered', priority: 'Critical', origin: 'Odisha V2O5 Mines', destination: 'Hyderabad VRFB Manufacturing', shipDate: '2025-05-07', transitDays: 2, state: 'Telangana',
    remarks: 'Vanadium pentoxide 2M sulphate electrolyte plant at Hyderabad producing 3,800 KL of concentrated vanadium electrolyte from Odisha-sourced V2O5 through acid dissolution, purification and concentration steps. &#8377;245 Cr facility achieves 99.3% purity with 28 Wh/L volumetric energy density supplying Telangana State Renewable Energy Development Corporation 200 MWh VRFB installations and private VRFB manufacturers in Hyderabad pharma and IT park microgrid energy storage projects under Telangana Solar Policy 2025 and SECI grid storage tenders.' },
  { id: 'VEL-0003', projectId: 'VEL-003', city: 'Mumbai', operator: 'Maharashtra V-Electrolyte Ltd', electrolyteType: 'VCl3 Chloride-Based',
    capacityKL: 3200, investmentCr: 210, vanadiumPurity: 98.8, energyDensity: 32, status: 'In Transit', priority: 'High', origin: 'Jharkhand V2O5 Refinery', destination: 'Mumbai Port VRFB Terminal', shipDate: '2025-05-12', transitDays: 3, state: 'Maharashtra',
    remarks: 'Vanadium trichloride chloride-based electrolyte facility en route to Mumbai producing 3,200 KL of next-generation vanadium chloride electrolyte offering 32 Wh/L energy density 28% higher than conventional sulphate electrolyte. &#8377;210 Cr plant serves Mumbai metropolitan region microgrid VRFB installations for Tata Power, Adani Electricity and BEST transport depot energy storage. Chloride-based electrolyte eliminates sulphate precipitation issues in tropical Indian climates enabling longer battery cycle life of 20,000 cycles versus 15,000 for sulphate systems under Maharashtra Electricity Regulatory Commission distributed energy storage regulations.' },
  { id: 'VEL-0004', projectId: 'VEL-004', city: 'Bhubaneswar', operator: 'Odisha Vanadium Electrolyte Hub', electrolyteType: 'VOSO4 1.5M Mining',
    capacityKL: 5000, investmentCr: 310, vanadiumPurity: 99.0, energyDensity: 24, status: 'Delivered', priority: 'Critical', origin: 'Odisha V2O5 Ore Belt', destination: 'Bhubaneswar Electrolyte Terminal', shipDate: '2025-05-01', transitDays: 1, state: 'Odisha',
    remarks: 'Vanadium electrolyte production hub at Bhubaneswar leveraging Odisha&apos;s 18% of India&apos;s vanadium resources from Kiriburu-Malguri and Daitari iron ore mines producing 5,000 KL of VOSO4 1.5M electrolyte from locally mined vanadium-bearing magnetite ore. &#8377;310 Cr plant achieves 99.0% purity through solvent extraction purification with 24 Wh/L energy density serving Eastern India grid storage including Odisha, West Bengal and Bihar VRFB installations for renewable energy integration under SECI 1 GWh flow battery tender and NTPC renewable energy parks requiring 6,000 KL vanadium electrolyte annually.' },
  { id: 'VEL-0005', projectId: 'VEL-005', city: 'Chennai', operator: 'TN Vanadium Electrolyte Works', electrolyteType: 'VBr3 Bromide-Based',
    capacityKL: 2800, investmentCr: 195, vanadiumPurity: 99.1, energyDensity: 35, status: 'Delivered', priority: 'High', origin: 'TN Vanadium Processing', destination: 'Chennai VRFB Assembly', shipDate: '2025-05-05', transitDays: 1, state: 'Tamil Nadu',
    remarks: 'Vanadium tribromide bromide-based electrolyte plant at Chennai producing 2,800 KL of high-energy-density vanadium bromide electrolyte achieving 35 Wh/L volumetric energy density highest among all vanadium electrolyte chemistries. &#8377;195 Cr facility serves Tamil Nadu Energy Development Agency 150 MWh coastal VRFB installations and Indian Navy shipboard energy storage. Bromide chemistry provides wider operating temperature range suitable for Chennai&apos;s tropical maritime climate and eliminates crossover contamination enabling single-tank VRFB design reducing system cost by 25% per kWh under Tamil Nadu Energy Storage Policy 2025.' },
  { id: 'VEL-0006', projectId: 'VEL-006', city: 'Gandhinagar', operator: 'Gujarat V-Electrolyte Industries', electrolyteType: 'VOSO4 2M High-Density',
    capacityKL: 4200, investmentCr: 265, vanadiumPurity: 99.6, energyDensity: 30, status: 'Delivered', priority: 'High', origin: 'Gujarat Petrochemical Vanadium', destination: 'Gandhinagar Grid Storage Hub', shipDate: '2025-05-04', transitDays: 1, state: 'Gujarat',
    remarks: 'High-density vanadium oxy-sulphate 2M electrolyte plant at Gandhinagar producing 4,200 KL of premium-grade vanadium electrolyte from vanadium recovery in Gujarat&apos;s petrochemical refineries. &#8377;265 Cr facility achieves 99.6% purity highest in Indian electrolyte market with 30 Wh/L energy density serving Gujarat Urja Vikas Nigam 300 MWh VRFB grid storage programme and Reliance Industries Jamnagar refinery microgrid. Gujarat&apos;s 35 GW renewable capacity by 2030 requiring 5 GWh energy storage creating &#8377;4,500 Cr vanadium electrolyte demand with Gandhinagar plant supplying 40% of Gujarat market.' },
  { id: 'VEL-0007', projectId: 'VEL-007', city: 'Kolkata', operator: 'West Bengal V-Electrolyte Plant', electrolyteType: 'VOSO4 1.6M Utility',
    capacityKL: 3500, investmentCr: 225, vanadiumPurity: 99.2, energyDensity: 26, status: 'In Transit', priority: 'High', origin: 'Jharkhand V2O5 Refinery', destination: 'Kolkata Port Terminal', shipDate: '2025-05-14', transitDays: 3, state: 'West Bengal',
    remarks: 'Vanadium oxy-sulphate 1.6M utility-grade electrolyte plant en route to Kolkata producing 3,500 KL of standard-grade vanadium electrolyte for utility-scale VRFB installations in Eastern India. &#8377;225 Cr facility serves West Bengal State Electricity Distribution Company 200 MWh VRFB peaking plant and Damodar Valley Corporation pumped storage replacement projects. West Bengal&apos;s 4 GW solar capacity requiring 800 MWh storage by 2030 with vanadium flow batteries preferred for 4-12 hour duration applications over lithium-ion which faces thermal degradation in Bengal&apos;s hot-humid climate exceeding 45&#176;C summer peak temperatures.' },
  { id: 'VEL-0008', projectId: 'VEL-008', city: 'Jaipur', operator: 'Rajasthan V-Electrolyte Corp', electrolyteType: 'VOSO4 1.8M Solar',
    capacityKL: 3000, investmentCr: 190, vanadiumPurity: 99.0, energyDensity: 27, status: 'Delivered', priority: 'Medium', origin: 'Rajasthan V2O5 Deposits', destination: 'Jaipur Solar Storage Hub', shipDate: '2025-05-08', transitDays: 2, state: 'Rajasthan',
    remarks: 'Vanadium oxy-sulphate 1.8M solar-optimised electrolyte plant at Jaipur producing 3,000 KL of temperature-stable vanadium electrolyte engineered for Rajasthan desert solar installations with operating range from 5&#176;C to 55&#176;C. &#8377;190 Cr facility serves Rajasthan Renewable Energy Corporation 500 MWh VRFB programme for Bhadla and Jaisalmer ultra-mega solar parks requiring 8-hour evening peak storage. Custom electrolyte formulation with anti-crystallisation additives preventing vanadium precipitation in extreme desert temperature cycling improving battery longevity by 30% in arid conditions.' },
  { id: 'VEL-0009', projectId: 'VEL-009', city: 'Lucknow', operator: 'UP Vanadium Electrolyte Works', electrolyteType: 'VOSO4 1.5M Agricultural',
    capacityKL: 2500, investmentCr: 165, vanadiumPurity: 98.7, energyDensity: 23, status: 'Delivered', priority: 'Medium', origin: 'Odisha V2O5 Ore Belt', destination: 'Lucknow Industrial Zone', shipDate: '2025-05-06', transitDays: 2, state: 'Uttar Pradesh',
    remarks: 'Vanadium oxy-sulphate 1.5M agricultural-sector electrolyte plant at Lucknow producing 2,500 KL of cost-optimised vanadium electrolyte for rural microgrid and agricultural pump VRFB energy storage systems. &#8377;165 Cr facility supplies UP New and Renewable Energy Development Agency solar-plus-storage projects for 50,000 agricultural pump sets replacing diesel generators. Agricultural-grade electrolyte specifications allow 98.7% purity reducing production cost by 15% versus utility-grade electrolyte while maintaining 20,000 cycle life enabling &#8377;4 per kWh per cycle levelized cost competitive with diesel pump operation in Uttar Pradesh agricultural heartland.' },
  { id: 'VEL-0010', projectId: 'VEL-010', city: 'Pune', operator: 'Maharashtra V-Electrolyte Tech', electrolyteType: 'VOSO4 2M Tech-Park',
    capacityKL: 2200, investmentCr: 155, vanadiumPurity: 99.4, energyDensity: 29, status: 'Delivered', priority: 'High', origin: 'Jharkhand V2O5 Refinery', destination: 'Pune IT Park Hub', shipDate: '2025-05-02', transitDays: 1, state: 'Maharashtra',
    remarks: 'High-purity vanadium oxy-sulphate 2M tech-park electrolyte facility at Pune producing 2,200 KL of premium vanadium electrolyte for commercial building and IT park behind-the-meter VRFB energy storage systems. &#8377;155 Cr plant supplies Hinjawadi, Magarpatta and Kharadi IT parks 50 MWh VRBC installations replacing diesel generators for 99.99% power uptime requirement. Premium 99.4% purity electrolyte with enhanced thermal stability for 24/7 data centre VRFB applications serving Tata Communications and Amazon Web Services Pune data centres requiring zero-downtime energy storage with 20-year cycle life under Maharashtra IT Park Energy Storage Mandate 2025.' },
  { id: 'VEL-0011', projectId: 'VEL-011', city: 'Kochi', operator: 'Kerala Vanadium Electrolyte Ltd', electrolyteType: 'VOSO4 1.6M Marine',
    capacityKL: 1800, investmentCr: 125, vanadiumPurity: 99.2, energyDensity: 25, status: 'In Transit', priority: 'Medium', origin: 'TN Vanadium Processing', destination: 'Kochi Port Terminal', shipDate: '2025-05-11', transitDays: 2, state: 'Kerala',
    remarks: 'Marine-grade vanadium oxy-sulphate 1.6M electrolyte plant en route to Kochi producing 1,800 KL of corrosion-resistant vanadium electrolyte for shipboard VRFB energy storage and Kerala coastal microgrid installations. &#8377;125 Cr facility serves Cochin Shipyard electric vessel programme and Kerala State Electricity Board 100 MWh coastal VRFB installations. Marine-grade electrolyte formulation with anti-corrosion additives prevents electrolyte degradation in saline coastal environment and meets International Maritime Organisation safety standards for shipboard energy storage replacing lead-acid batteries on 200 Kerala inland waterway vessels under National Inland Waterways programme.' },
  { id: 'VEL-0012', projectId: 'VEL-012', city: 'Bhopal', operator: 'MP Vanadium Electrolyte Works', electrolyteType: 'VOSO4 1.5M Mining',
    capacityKL: 2000, investmentCr: 140, vanadiumPurity: 98.9, energyDensity: 24, status: 'Delayed', priority: 'Medium', origin: 'MP Vanadium Ore', destination: 'Bhopal Industrial Estate', shipDate: '2025-05-16', transitDays: 2, state: 'Madhya Pradesh',
    remarks: 'Mining-grade vanadium oxy-sulphate 1.5M electrolyte plant at Bhopal producing 2,000 KL of vanadium electrolyte from Madhya Pradesh vanadium-bearing titanomagnetite deposits in Balaghat and Chhindwara districts. &#8377;140 Cr facility processes locally mined vanadium ore through alkaline roasting and acid leach achieving 98.9% purity electrolyte for Madhya Pradesh Power Generating Company 150 MWh VRFB grid balancing plants. Project delayed by mining license acquisition but expected to reduce electrolyte import dependency by 12% for Central India VRFB installations under Madhya Pradesh Mineral Development Policy 2025.' },
  { id: 'VEL-0013', projectId: 'VEL-013', city: 'Visakhapatnam', operator: 'AP Vanadium Electrolyte Plant', electrolyteType: 'VOSO4 1.8M Port',
    capacityKL: 2600, investmentCr: 175, vanadiumPurity: 99.3, energyDensity: 28, status: 'Delivered', priority: 'High', origin: 'Odisha V2O5 Ore Belt', destination: 'Vizag Port Terminal', shipDate: '2025-05-09', transitDays: 2, state: 'Andhra Pradesh',
    remarks: 'Port-grade vanadium oxy-sulphate 1.8M electrolyte plant at Visakhapatnam producing 2,600 KL of vanadium electrolyte with strategic port access for South India VRFB distribution and export to Sri Lanka and Bangladesh. &#8377;175 Cr facility serves Andhra Pradesh Eastern Power Distribution Company 250 MWh VRFB installations for Visakhapatnam Steel Plant microgrid and Srikakulam solar park storage. Vizag port logistics enabling electrolyte tanker distribution to Chennai, Kochi and Tuticorin VRFB installation sites within 48-hour delivery window under Sagarmala port-led development programme for energy storage logistics.' },
  { id: 'VEL-0014', projectId: 'VEL-014', city: 'Guwahati', operator: 'Assam Vanadium Electrolyte Hub', electrolyteType: 'VOSO4 1.6M NE-Grid',
    capacityKL: 1500, investmentCr: 110, vanadiumPurity: 98.6, energyDensity: 24, status: 'Delivered', priority: 'Medium', origin: 'Odisha V2O5 Ore Belt', destination: 'Guwahati Grid Storage Hub', shipDate: '2025-04-28', transitDays: 5, state: 'Assam',
    remarks: 'Northeast India grid-grade vanadium oxy-sulphate 1.6M electrolyte hub at Guwahati producing 1,500 KL of vanadium electrolyte for Assam, Meghalaya, Arunachal Pradesh and other northeastern states VRFB installations addressing 8-hour peak demand deficit. &#8377;110 Cr facility serves Assam State Electricity Board 100 MWh VRFB installations for Guwahati and Tezpur grid balancing and North Eastern Electric Power Corporation 50 MWh hydropower-smoothing VRFB plants. Northeast India&apos;s 10 GW hydroelectric capacity requiring 2 GWh daily storage for peak-load shifting with vanadium flow batteries preferred over lithium due to 25-year calendar life in humid subtropical conditions.' },
]

export default function VanadiumElectrolyteLogisticsView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof VELRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'electrolyteType', label: 'Electrolyte Type', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.electrolyteType] = (m[r.electrolyteType] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Capacity', value: `${filtered.reduce((a: number, r) => a + r.capacityKL, 0).toLocaleString()} KL` },
    { label: 'Avg Energy Density', value: `${(filtered.reduce((a: number, r) => a + r.energyDensity, 0) / Math.max(1, filtered.length)).toFixed(1)} Wh/L` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Avg Purity', value: `${(filtered.reduce((a: number, r) => a + r.vanadiumPurity, 0) / Math.max(1, filtered.length)).toFixed(1)}%` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: VELRecord) => string, val: (r: VELRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.capacityKL)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const typeBar = grp(r => r.electrolyteType, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const purityData = filtered.map(r => ({ name: r.electrolyteType.split(' ').slice(0, 2).join(' '), value: r.vanadiumPurity }))
    const lm = filtered.reduce((a: Record<string, { capacityKL: number; investmentCr: number }>, r) => {
      if (!a[r.state]) a[r.state] = { capacityKL: 0, investmentCr: 0 }
      a[r.state].capacityKL += r.capacityKL; a[r.state].investmentCr += r.investmentCr; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, capacityKL: v.capacityKL, investmentCr: v.investmentCr }))
    return { barState, pieState, statusPie, typeBar, priorityPie, totalInvest, purityData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="vel-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Vanadium Electrolyte' }]} />
      <PageHeader title="Vanadium Electrolyte Logistics" description="Track vanadium electrolyte supply chains for redox flow batteries, VOSO4 and VCl3 electrolyte production, VRFB electrolyte distribution networks, and India's grid-scale energy storage electrolyte logistics" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="vel-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t as 'dashboard' | 'registry' | 'analytics' | 'insights')} className={`vel-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-rose-900 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="vel-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="vel-kpi-card"><CardContent className="p-4"><p className="vel-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="vel-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="vel-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="vel-chart-title text-sm">Electrolyte Capacity (KL) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#831843" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="vel-chart-title text-sm">Facilities by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="vel-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="vel-chart-title text-sm">Vanadium Purity (%) by Electrolyte Type</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.purityData}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} domain={[98, 100]} /><Tooltip /><Bar dataKey="value" fill="#9f1239" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="vel-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="vel-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`vel-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-rose-900'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.electrolyteType} | {r.state}</p>
              <p className="text-xs mt-1">{r.capacityKL.toLocaleString()} KL | {r.energyDensity} Wh/L | {r.vanadiumPurity}% purity | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="vel-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="vel-chart-title text-sm">Capacity vs Investment by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="capacityKL" stroke="#831843" name="Capacity KL" /><Line yAxisId="right" type="monotone" dataKey="investmentCr" stroke="#e11d48" name="Investment &#8377; Cr" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="vel-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#4c0519" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="vel-chart-title text-sm">Electrolyte Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.typeBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#9f1239" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="vel-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="vel-insights grid grid-cols-2 gap-4">
        <Card className="vel-insight-card border-l-4 border-l-rose-900"><CardContent className="p-5">
          <h4 className="vel-insight-title font-semibold text-base">India&apos;s 10 GWh VRFB Target by 2030</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India targeting 10 GWh of vanadium redox flow battery capacity by 2030 under National Energy Storage Mission requiring 50,000 KL of vanadium electrolyte valued at &#8377;15,000 Cr. Ministry of New and Renewable Energy designating VRFB as preferred technology for 4-hour and longer duration grid storage over lithium-ion due to 25-year calendar life, 100% depth of discharge and zero fire risk. NITI Aayog estimating VRFB levelized cost of storage at &#8377;5.5 per kWh per cycle by 2028 versus &#8377;7.2 for lithium-ion at Indian operating conditions with SECI tendering 3 GWh VRFB capacity in 2026-27 creating &#8377;4,500 Cr electrolyte procurement demand.</p>
        </CardContent></Card>
        <Card className="vel-insight-card border-l-4 border-l-rose-900"><CardContent className="p-5">
          <h4 className="vel-insight-title font-semibold text-base">Odisha Vanadium: India&apos;s Domestic Supply Solution</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Geological Survey of India estimating Odisha&apos;s vanadium resources at 25 million tonnes of V2O5 equivalent in Kiriburu-Malguri, Daitari and Barbil iron ore deposits ranking India among top 5 global vanadium resource nations. Ministry of Mines auctioning 12 vanadium mining blocks in Odisha and Madhya Pradesh under National Mineral Policy 2025 targeting 2 million tonnes annual V2O5 production by 2028. Domestic vanadium ore processing in Bhubaneswar and Rourkela refineries reducing electrolyte production cost by 35% versus imported V2O5 from South Africa and China eliminating &#8377;3,000 Cr annual vanadium import bill and securing supply chain for India&apos;s energy storage programme.</p>
        </CardContent></Card>
        <Card className="vel-insight-card border-l-4 border-l-rose-900"><CardContent className="p-5">
          <h4 className="vel-insight-title font-semibold text-base">Electrolyte Recycling: Circular Economy Opportunity</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Vanadium electrolyte retains 95% capacity after 20,000 charge-discharge cycles with indefinite recyclability through simple re-balancing and impurity removal without loss of active vanadium material. India&apos;s 10 GWh VRBC fleet requiring 50,000 KL initial electrolyte fill plus 5,000 KL annual replenishment for capacity restoration. CSIR-NCL Pune developing vanadium electrolyte recycling technology recovering 99.5% vanadium from spent electrolyte at &#8377;500 per KL versus &#8377;8,000 per KL for virgin electrolyte production. Recycled electrolyte market projected to reach &#8377;2,500 Cr annually by 2035 under Battery Waste Management Rules 2022 extended to cover flow battery electrolytes.</p>
        </CardContent></Card>
        <Card className="vel-insight-card border-l-4 border-l-rose-900"><CardContent className="p-5">
          <h4 className="vel-insight-title font-semibold text-base">Indian Railways: 5 GWh VRBC Fleet Conversion</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Indian Railways committing &#8377;8,000 Cr for 5 GWh vanadium redox flow battery installation across 200 traction sub-stations by 2030 replacing diesel backup power and enabling regenerative braking energy capture. Railway Board specifying VRFB over lithium-ion for traction sub-stations due to non-flammable electrolyte safety requirement for passenger rail infrastructure and 25-year maintenance-free operation reducing lifecycle cost by 60%. Railway&apos;s 2,500 KL annual electrolyte demand being sourced from Odisha and Gujarat plants under Make in India procurement policy with IIT Delhi developing advanced mixed-acid vanadium electrolyte formulation increasing energy density from 25 to 40 Wh/L for space-constrained sub-station installations.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
