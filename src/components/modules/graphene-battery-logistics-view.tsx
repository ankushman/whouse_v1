'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface GBLRecord {
  id: string; projectId: string; city: string; operator: string; materialType: string
  capacityTPA: number; investmentCr: number; layers: number; conductivity: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#3730a3', '#4338ca', '#4f46e5', '#6366f1', '#818cf8', '#312e81', '#1e1b4b', '#272554']

const records: GBLRecord[] = [
  { id: 'GBL-0001', projectId: 'GBL-001', city: 'Bengaluru', operator: 'Bengaluru Graphene Battery Tech', materialType: 'CVD Monolayer Graphene Anode',
    capacityTPA: 85, investmentCr: 520, layers: 1, conductivity: 12000, status: 'Delivered', priority: 'Critical', origin: 'Tamil Nadu Graphite Supply', destination: 'Bengaluru EV Cell Factory', shipDate: '2025-05-03', transitDays: 2, state: 'Karnataka',
    remarks: 'CVD monolayer graphene anode material production facility at Bengaluru producing 85 TPA of single-layer graphene on copper foil substrate for ultra-high-performance EV battery anodes achieving 12000 S/m electrical conductivity. &#8377;520 Cr plant uses chemical vapour deposition at 1000&#176;C growing monolayer graphene on copper catalyst then transferring to nickel current collector for silicon-graphene composite anodes achieving 450 Wh/kg cell energy density. Bengaluru facility serving Ola Electric and Ather Energy premium EV cell programme targeting 600 km range electric two-wheelers and 800 km electric cars under FAME III Ultra-High-Energy-Density Battery incentive tier providing &#8377;2,000 Cr subsidy for graphene-enhanced cells achieving above 400 Wh/kg cell level energy density.' },
  { id: 'GBL-0002', projectId: 'GBL-002', city: 'Hyderabad', operator: 'Telangana Graphene Electrolyte Works', materialType: 'Graphene Oxide Separator',
    capacityTPA: 120, investmentCr: 380, layers: 5, conductivity: 8500, status: 'Delivered', priority: 'Critical', origin: 'Telangana Graphite Mines', destination: 'Hyderabad Battery Material Hub', shipDate: '2025-05-07', transitDays: 1, state: 'Telangana',
    remarks: 'Graphene oxide composite separator production facility at Hyderabad producing 120 TPA of graphene-oxide-coated polyethylene battery separator with 8500 S/m ionic conductivity enabling 3C fast charging capability. &#8377;380 Cr plant coats ultra-thin graphene oxide layer on commercial PE separators through dip-coating and annealing process creating thermally stable separators with 200&#176;C shrinkage resistance versus 130&#176;C for conventional PE separators. Hyderabad facility supplying Indian EV cell manufacturers including Exicom and Amaron for fast-charge battery packs enabling 0-80% charge in 15 minutes under Telangana EV Battery Safety and Fast-Charging Programme 2025 mandating graphene-enhanced separators in all EV cells sold in Telangana from 2026.' },
  { id: 'GBL-0003', projectId: 'GBL-003', city: 'Pune', operator: 'Maharashtra Graphene Cathode Works', materialType: 'Graphene-LFP Cathode Coating',
    capacityTPA: 200, investmentCr: 450, layers: 3, conductivity: 15000, status: 'In Transit', priority: 'High', origin: 'Odisha Graphite Supply', destination: 'Pune Cell Manufacturing Hub', shipDate: '2025-05-12', transitDays: 2, state: 'Maharashtra',
    remarks: 'Graphene-coated lithium iron phosphate cathode material facility en route to Pune producing 200 TPA of graphene-wrapped LFP cathode particles achieving 15000 S/m electronic conductivity 1000x higher than bare LFP enabling 5C discharge rate capability. &#8377;450 Cr plant coats individual LFP nanoparticles with 2nm graphene shell through solvothermal self-assembly process increasing cathode rate capability from 1C to 5C without sacrificing 160 Wh/kg energy density. Graphene-LFP cathode serving Tata Motors electric bus programme and Mahindra electric SUV platform providing 5C highway acceleration performance equivalent to diesel engines under Maharashtra EV Battery Performance Enhancement Programme 2025 with graphene-LFP cells qualifying for highest state subsidy tier.' },
  { id: 'GBL-0004', projectId: 'GBL-004', city: 'Gandhinagar', operator: 'Gujarat Graphene Composite Electrode', materialType: 'Graphene-Silicon Composite',
    capacityTPA: 95, investmentCr: 480, layers: 7, conductivity: 9800, status: 'Delivered', priority: 'High', origin: 'Gujarat Graphite Refinery', destination: 'Gandhinagar Battery Park', shipDate: '2025-05-01', transitDays: 1, state: 'Gujarat',
    remarks: 'Graphene-silicon composite electrode material production facility at Gandhinagar producing 95 TPA of multilayer graphene-silicon nanocomposite anode achieving 9800 S/m conductivity with 7-layer graphene encapsulation of silicon nanoparticles. &#8377;480 Cr facility produces graphene-encapsulated silicon anode material accommodating 280% silicon volume expansion during lithiation through flexible graphene shell preventing particle pulverisation and maintaining 85% capacity retention after 1500 cycles. Gujarat facility serving Reliance New Energy 100 GWh gigafactory programme for premium EV cells with graphene-silicon anodes achieving 420 Wh/kg cell energy density under Gujarat Battery Energy Storage Manufacturing Incentive Scheme 2025 providing &#8377;4,500 Cr production subsidy for graphene-enhanced battery materials.' },
  { id: 'GBL-0005', projectId: 'GBL-005', city: 'Chennai', operator: 'TN Reduced Graphene Oxide Works', materialType: 'rGO Thermal Interface 99.5%',
    capacityTPA: 150, investmentCr: 340, layers: 10, conductivity: 20000, status: 'Delivered', priority: 'High', origin: 'TN Graphite Mines', destination: 'Chennai Battery Corridor', shipDate: '2025-05-05', transitDays: 1, state: 'Tamil Nadu',
    remarks: 'Reduced graphene oxide thermal interface material facility at Chennai producing 150 TPA of 99.5% purity rGO films for battery thermal management achieving 20000 S/m in-plane thermal conductivity for EV battery pack heat dissipation. &#8377;340 Cr plant produces rGO thermal interface sheets laminated between battery cells in EV battery packs reducing cell operating temperature by 15&#176;C and increasing battery cycle life by 40% through uniform heat distribution. Chennai rGO facility supplying TVS Motor and BYD India battery pack assembly lines under TN Electric Vehicle Battery Thermal Management Mandate 2025 requiring graphene thermal interface in all EV battery packs sold in Tamil Nadu preventing thermal runaway incidents that caused 4 EV battery fires in Chennai during summer 2024.' },
  { id: 'GBL-0006', projectId: 'GBL-006', city: 'Kolkata', operator: 'WB Graphene Supercapacitor', materialType: 'Graphene Supercap Electrode',
    capacityTPA: 60, investmentCr: 290, conductivity: 18000, layers: 12, status: 'Delivered', priority: 'High', origin: 'Jharkhand Graphite Supply', destination: 'Kolkata Power Electronics Hub', shipDate: '2025-05-08', transitDays: 2, state: 'West Bengal',
    remarks: 'Graphene supercapacitor electrode material facility at Kolkata producing 60 TPA of activated graphene electrode sheets with 18000 S/m conductivity achieving 250 Wh/kg energy density for graphene supercapacitors bridging gap between batteries and capacitors. &#8377;290 Cr plant produces vertically-aligned graphene nanosheet electrodes with 12-layer 3D architecture providing 95% coulombic efficiency and 500,000 cycle life for regenerative braking energy capture in Kolkata metro and suburban railway. Kolkata graphene supercapacitor programme targeting 50 MW peak power smoothing capacity for Eastern Railway and Kolkata Metro regenerative braking under Ministry of Railways Energy Storage and Supercapacitor Programme 2025 saving &#8377;850 Cr annually in traction energy cost.' },
  { id: 'GBL-0007', projectId: 'GBL-007', city: 'Bhubaneswar', operator: 'Odisha Graphene from Graphite', materialType: 'Exfoliated Graphene Powder',
    capacityTPA: 300, investmentCr: 410, layers: 5, conductivity: 6000, status: 'Delivered', priority: 'Critical', origin: 'Odisha Graphite Mines', destination: 'Bhubaneswar Graphene Terminal', shipDate: '2025-05-04', transitDays: 1, state: 'Odisha',
    remarks: 'Liquid-phase exfoliated graphene powder production facility at Bhubaneswar producing 300 TPA of 5-layer few-layer graphene powder from Odisha natural graphite flakes through shear-force exfoliation in NMP solvent with ultrasonic processing. &#8377;410 Cr plant is India&apos;s largest graphene powder facility providing feedstock material to Bengaluru, Hyderabad and Pune graphene coating facilities. Odisha possessing 35% of India&apos;s natural graphite reserves with Bhubaneswar hub processing 15,000 TPA graphite ore into 300 TPA few-layer graphene powder at 60% lower cost than imported graphene from China under National Graphene Mission 2025 reducing India&apos;s graphene import dependency from 95% to 40% and creating domestic graphene supply chain for 10 GWh battery material demand.' },
  { id: 'GBL-0008', projectId: 'GBL-008', city: 'Jaipur', operator: 'Rajasthan Graphene EMI Shielding', materialType: 'Graphene EMI Shield Film',
    capacityTPA: 40, investmentCr: 185, conductivity: 25000, layers: 8, status: 'Delivered', priority: 'Medium', origin: 'Rajasthan Graphite Supply', destination: 'Jaipur Defence Electronics', shipDate: '2025-05-06', transitDays: 1, state: 'Rajasthan',
    remarks: 'Graphene EMI shielding film production facility at Jaipur producing 40 TPA of 8-layer graphene-polymer composite EMI shielding films with 25000 S/m surface conductivity achieving 80 dB shielding effectiveness for military and aerospace electronic systems. &#8377;185 Cr plant serves Jaipur and Jodhpur defence electronics manufacturers supplying EMI shielding for DRDO radar systems, HAL avionics and ISRO satellite electronic packages. Graphene EMI shielding films replacing copper mesh shielding at 70% weight reduction and 50 dB higher shielding effectiveness under Defence Research and Development Organisation Advanced Materials Programme 2025 with ISRO mandating graphene EMI shielding for all satellite electronic packages from 2026 launch manifest.' },
  { id: 'GBL-0009', projectId: 'GBL-009', city: 'Lucknow', operator: 'UP Graphene Conductive Ink', materialType: 'Graphene Conductive Ink',
    capacityTPA: 25, investmentCr: 140, conductivity: 15000, layers: 3, status: 'Delivered', priority: 'Medium', origin: 'Odisha Graphene Powder', destination: 'Lucknow Printed Electronics', shipDate: '2025-05-02', transitDays: 2, state: 'Uttar Pradesh',
    remarks: 'Graphene conductive ink production facility at Lucknow producing 25 TPA of graphene-based conductive ink with 15000 S/m conductivity for printed battery electrodes, flexible electronics and smart packaging applications. &#8377;140 Cr plant formulates graphene nanoplatelet ink in water-based vehicle system for screen printing, inkjet printing and gravure printing of battery electrode patterns on flexible substrates. Lucknow graphene ink enabling roll-to-roll printed battery electrode manufacturing at 10x lower cost than conventional slurry casting electrode process under UP Printed Electronics and Flexible Battery Programme 2025 targeting 500 million printed battery units annually for smart packaging, RFID tags and medical sensor applications.' },
  { id: 'GBL-0010', projectId: 'GBL-010', city: 'Ahmedabad', operator: 'Gujarat Graphene Quantum Dot', materialType: 'Graphene Quantum Dot Sensor',
    capacityTPA: 8, investmentCr: 95, conductivity: 35000, layers: 1, status: 'In Transit', priority: 'Medium', origin: 'Gujarat Graphene Labs', destination: 'Ahmedabad Tech Park', shipDate: '2025-05-14', transitDays: 1, state: 'Gujarat',
    remarks: 'Graphene quantum dot sensor material facility en route to Ahmedabad producing 8 TPA of zero-defect single-layer graphene quantum dots with 35000 S/m conductivity for battery state-of-charge sensors and gas detection applications. &#8377;95 Cr plant produces 5-20nm diameter graphene quantum dots through bottom-up synthesis from citric acid and graphene oxide achieving quantum confinement enabling wavelength-tunable fluorescence for real-time battery SOC monitoring. Graphene quantum dot sensors providing 99.5% SOC accuracy for EV batteries enabling precise range prediction under Gujarat EV Battery Management System Enhancement Programme 2025 mandating graphene quantum dot SOC sensors in all EVs registered in Gujarat from 2026.' },
  { id: 'GBL-0011', projectId: 'GBL-011', city: 'Indore', operator: 'MP Graphene Anti-Corrosion', materialType: 'Graphene Anti-Corrosion Coating',
    capacityTPA: 35, investmentCr: 155, conductivity: 8000, layers: 6, status: 'Delivered', priority: 'Medium', origin: 'MP Graphite Supply', destination: 'Indore Industrial Zone', shipDate: '2025-05-09', transitDays: 1, state: 'Madhya Pradesh',
    remarks: 'Graphene anti-corrosion coating production facility at Indore producing 35 TPA of 6-layer graphene-polymer composite anti-corrosion coatings with 8000 S/m conductivity providing 99.9% corrosion protection for battery casings, steel enclosures and marine applications. &#8377;155 Cr plant produces graphene epoxy composite coatings with impermeable graphene barrier layer preventing oxygen and moisture penetration extending battery enclosure life from 10 years to 25 years in coastal and humid environments. Indore facility supplying Indian Navy submarine battery enclosures, coastal EV battery packs and offshore wind turbine battery housings under MP Advanced Materials and Corrosion Protection Programme 2025 replacing toxic chromate anti-corrosion coatings with environmentally friendly graphene alternatives.' },
  { id: 'GBL-0012', projectId: 'GBL-012', city: 'Guwahati', operator: 'Assam Graphene Bio-Sensor', materialType: 'Graphene Bio-Sensor Strip',
    capacityTPA: 5, investmentCr: 75, conductivity: 12000, layers: 2, status: 'Delivered', priority: 'Low', origin: 'Odisha Graphene Powder', destination: 'Guwahati Medical Hub', shipDate: '2025-05-11', transitDays: 5, state: 'Assam',
    remarks: 'Graphene bio-sensor strip production facility at Guwahati producing 5 TPA of 2-layer graphene field-effect transistor biosensor strips with 12000 S/m conductivity for point-of-care medical diagnostics and battery electrolyte monitoring. &#8377;75 Cr plant fabricates graphene FET biosensors on flexible PET substrate detecting lithium-ion concentration, electrolyte degradation products and temperature in real-time for battery health monitoring. IIT Guwahati developed graphene biosensor technology enabling smartphone-connected battery health diagnostics replacing &#8377;15,000 laboratory battery testing equipment with &#8377;500 disposable graphene sensor strips under Assam Bio-Economy and Graphene Sensor Programme 2025 targeting 50 million graphene sensor strips annually for India&apos;s 300 million battery-equipped devices.' },
  { id: 'GBL-0013', projectId: 'GBL-013', city: 'Cochin', operator: 'Kerala Graphene Desalination', materialType: 'Graphene Oxide Desalination Membrane',
    capacityTPA: 15, investmentCr: 120, conductivity: 5000, layers: 4, status: 'Delivered', priority: 'Medium', origin: 'TN Graphene Oxide Supply', destination: 'Kochi Desalination Plant', shipDate: '2025-05-10', transitDays: 2, state: 'Kerala',
    remarks: 'Graphene oxide desalination membrane production facility at Cochin producing 15 TPA of 4-layer graphene oxide laminate membranes with 5000 S/m conductivity for forward osmosis desalination of battery manufacturing wastewater. &#8377;120 Cr plant produces GO membranes achieving 99.7% salt rejection at 3x higher water flux than conventional reverse osmosis membranes for recycling battery electrode manufacturing wastewater containing heavy metals and organic solvents. Kerala facility serving lithium-ion battery manufacturing plants in Kochi and Bengaluru for zero-liquid-discharge wastewater treatment under Kerala Battery Industry Water Conservation and Zero Discharge Mandate 2025 requiring all battery material plants to achieve 90% water recycling through graphene membrane filtration.' },
  { id: 'GBL-0014', projectId: 'GBL-014', city: 'Visakhapatnam', operator: 'AP Graphene Aerospace', materialType: 'Graphene Aerogel Battery Pack',
    capacityTPA: 10, investmentCr: 105, conductivity: 7000, layers: 20, status: 'Delayed', priority: 'High', origin: 'Odisha Graphene Powder', destination: 'Vizag Defence Corridor', shipDate: '2025-05-16', transitDays: 2, state: 'Andhra Pradesh',
    remarks: 'Graphene aerogel composite battery casing production facility at Visakhapatnam producing 10 TPA of 20-layer graphene aerogel-polymer composite battery pack casings with 7000 S/m conductivity for aerospace and defence battery applications. &#8377;105 Cr plant produces lightweight graphene aerogel battery enclosures weighing 70% less than aluminium with equivalent mechanical strength and integrated fire suppression capability through graphene aerogel&apos;s inherent flame retardant properties. Vizag Defence Corridor supplying HAL Tejas battery casings, BrahMos missile battery containers and ISRO PSLV rocket battery housings under DRDO Lightweight Battery Enclosure Programme 2025 targeting 500 kg weight reduction per satellite launch vehicle through graphene aerogel battery casing replacement saving &#8377;12 Cr per launch in reduced fuel requirements.' },
]

export default function GrapheneBatteryLogisticsView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof GBLRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'materialType', label: 'Material Type', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.materialType] = (m[r.materialType] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Capacity', value: `${filtered.reduce((a: number, r) => a + r.capacityTPA, 0).toLocaleString()} TPA` },
    { label: 'Avg Conductivity', value: `${(filtered.reduce((a: number, r) => a + r.conductivity, 0) / Math.max(1, filtered.length)).toLocaleString()} S/m` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Avg Layers', value: `${(filtered.reduce((a: number, r) => a + r.layers, 0) / Math.max(1, filtered.length)).toFixed(1)}` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: GBLRecord) => string, val: (r: GBLRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.capacityTPA)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const typeBar = grp(r => r.materialType, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const condData = filtered.map(r => ({ name: r.materialType.split(' ').slice(0, 2).join(' '), value: r.conductivity }))
    const lm = filtered.reduce((a: Record<string, { capacityTPA: number; investmentCr: number }>, r) => {
      if (!a[r.state]) a[r.state] = { capacityTPA: 0, investmentCr: 0 }
      a[r.state].capacityTPA += r.capacityTPA; a[r.state].investmentCr += r.investmentCr; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, capacityTPA: v.capacityTPA, investmentCr: v.investmentCr }))
    return { barState, pieState, statusPie, typeBar, priorityPie, totalInvest, condData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="gbl-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Graphene Battery' }]} />
      <PageHeader title="Graphene Battery Logistics" description="Track graphene battery material supply chains, CVD graphene production logistics, graphene oxide separator distribution, and India's graphene-enhanced battery material manufacturing for EV, defence and electronics applications" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="gbl-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t as 'dashboard' | 'registry' | 'analytics' | 'insights')} className={`gbl-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-indigo-900 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="gbl-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="gbl-kpi-card"><CardContent className="p-4"><p className="gbl-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="gbl-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="gbl-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="gbl-chart-title text-sm">Material Capacity (TPA) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#3730a3" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="gbl-chart-title text-sm">Facilities by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="gbl-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="gbl-chart-title text-sm">Conductivity (S/m) by Material</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.condData}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#4338ca" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="gbl-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="gbl-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`gbl-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-indigo-900'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.materialType} | {r.state}</p>
              <p className="text-xs mt-1">{r.capacityTPA.toLocaleString()} TPA | {r.conductivity.toLocaleString()} S/m | {r.layers} layers | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="gbl-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="gbl-chart-title text-sm">Capacity vs Investment by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="capacityTPA" stroke="#3730a3" name="Capacity TPA" /><Line yAxisId="right" type="monotone" dataKey="investmentCr" stroke="#818cf8" name="Investment &#8377; Cr" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="gbl-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#312e81" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="gbl-chart-title text-sm">Material Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.typeBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#4338ca" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="gbl-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="gbl-insights grid grid-cols-2 gap-4">
        <Card className="gbl-insight-card border-l-4 border-l-indigo-900"><CardContent className="p-5">
          <h4 className="gbl-insight-title font-semibold text-base">India&apos;s &#8377;8,000 Cr Graphene Battery Market</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s graphene battery material market projected to reach &#8377;8,000 Cr by 2028 from &#8377;400 Cr in 2024 growing at 110% CAGR driven by EV cell performance enhancement, battery safety improvement and fast-charging capability requirements under FAME III programme. Department of Science and Technology National Graphene Mission allocating &#8377;2,500 Cr for graphene material production, characterisation and application development across 25 institute-industry consortia. India importing 95% of graphene materials from China and South Korea with domestic production target of 2,000 TPA by 2028 reducing import dependency to 40% and creating &#8377;5,000 Cr domestic graphene industry serving 30 GWh battery manufacturing capacity under PLI Advanced Chemistry Cell scheme graphene enhancement incentive.</p>
        </CardContent></Card>
        <Card className="gbl-insight-card border-l-4 border-l-indigo-900"><CardContent className="p-5">
          <h4 className="gbl-insight-title font-semibold text-base">Odisha Graphite: Domestic Graphene Feedstock</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Odisha possessing 35% of India&apos;s 40 million tonnes natural graphite reserves with Bhubaneswar hub processing 15,000 TPA graphite ore into 300 TPA few-layer graphene powder through liquid-phase exfoliation at 60% lower cost than imported CVD graphene from China. Geological Survey of India identifying 8 new graphite deposits in Angul, Dhenkanal and Rayagada districts extending Odisha graphite leadership. Odisha government establishing &#8377;1,800 Cr Graphene Valley industrial park near Bhubaneswar hosting 15 graphene material and application companies under Odisha Critical Mineral and Advanced Materials Policy 2025 with graphene powder production capacity increasing to 1,000 TPA by 2028 supplying 50% of Indian graphene demand from domestic natural graphite.</p>
        </CardContent></Card>
        <Card className="gbl-insight-card border-l-4 border-l-indigo-900"><CardContent className="p-5">
          <h4 className="gbl-insight-title font-semibold text-base">Graphene Separator: 15-Minute Fast Charge</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Graphene oxide coated battery separators enabling 3C fast charging rate achieving 0-80% state of charge in 15 minutes versus 45 minutes for conventional lithium-ion cells with standard PE separators. Graphene oxide&apos;s 2D nano-channel structure providing 10x higher ionic conductivity than conventional ceramic-coated separators while maintaining thermal runaway shutdown at 200&#176;C versus 130&#176;C for uncoated PE separators. Indian EV manufacturers Ola, Ather and Tata Motors qualifying graphene-enhanced separators for fast-charge battery packs under AIS-156 battery safety standard amendment 2025 with graphene separator mandated for all fast-charge capable EVs from 2026 model year eliminating separator-induced thermal runaway as root cause of 85% EV battery fire incidents in India.</p>
        </CardContent></Card>
        <Card className="gbl-insight-card border-l-4 border-l-indigo-900"><CardContent className="p-5">
          <h4 className="gbl-insight-title font-semibold text-base">Graphene Supercapacitors: Railways Regenerative Braking</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Graphene supercapacitor modules achieving 250 Wh/kg energy density approaching lithium-ion battery range while maintaining 500,000 cycle life and sub-second charge-discharge rates ideal for railway regenerative braking energy capture. Indian Railways deploying 50 MW graphene supercapacitor banks at 200 stations capturing braking energy from 8,000 daily train stops saving &#8377;850 Cr annually in traction energy cost. Kolkata Metro率先 piloting graphene supercapacitor-equipped trains achieving 30% energy recovery from regenerative braking under Ministry of Railways Energy Efficiency Enhancement Programme 2025 with national rollout to 5,000 stations targeting 5 GW graphene supercapacitor peak power capacity by 2030 reducing railway electricity consumption by 15%.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
