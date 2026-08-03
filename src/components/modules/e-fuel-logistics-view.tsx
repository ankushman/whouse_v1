'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface EFLRecord {
  id: string; projectId: string; city: string; operator: string; fuelType: string
  capacityKLPD: number; investmentCr: number; carbonReduction: number; energyPerLitre: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#14532d', '#166534', '#15803d', '#16a34a', '#22c55e', '#052e16', '#022c22', '#064e3b']

const records: EFLRecord[] = [
  { id: 'EFL-0001', projectId: 'EFL-001', city: 'Mumbai', operator: 'Indian Oil e-Fuel Pilot', fuelType: 'Power-to-Methanol e-Gasoline',
    capacityKLPD: 120, investmentCr: 520, carbonReduction: 92, energyPerLitre: 8.8, status: 'Delivered', priority: 'Critical', origin: 'IOCL R&amp;D Faridabad', destination: 'Mumbai Refinery Complex', shipDate: '2025-05-05', transitDays: 2, state: 'Maharashtra',
    remarks: 'Power-to-methanol e-gasoline production at IOCL Mumbai Refinery Complex with 120 KLPD capacity using green hydrogen and captured CO2 to synthesize drop-in gasoline replacement. &#8377;520 Cr pilot plant converts 48 MW of renewable electricity into 120 kilolitres per day of carbon-neutral gasoline chemically identical to fossil petrol requiring zero engine modification. Serves Mumbai metropolitan 12 million vehicle fleet reducing transport sector emissions by 92% versus conventional gasoline under NITI Aayog National Mission on Transformative Mobility and Battery Storage pilot programme for hard-to-electrify aviation and shipping fuels.' },
  { id: 'EFL-0002', projectId: 'EFL-002', city: 'Gandhinagar', operator: 'Gujarat e-Kerosene Works', fuelType: 'Fischer-Tropsch e-Kerosene',
    capacityKLPD: 85, investmentCr: 410, carbonReduction: 89, energyPerLitre: 9.2, status: 'Delivered', priority: 'Critical', origin: 'Gujarat Solar Park', destination: 'Gandhinagar Aviation Fuel Hub', shipDate: '2025-05-10', transitDays: 1, state: 'Gujarat',
    remarks: 'Fischer-Tropsch e-kerosene at Gujarat Aviation Fuel Hub with 85 KLPD capacity for sustainable aviation fuel using 35 MW green hydrogen and direct air capture CO2. &#8377;410 Cr plant producing aviation-grade e-kerosene meeting ASTM D7566 specification for up to 50% blend with conventional jet fuel. Serves Ahmedabad, Surat and Vadodara airports reducing aviation carbon footprint by 89% under ICAO CORSIA Carbon Offsetting and Reduction Scheme for International Aviation targeting 5% SAF usage by Indian carriers by 2028 under DGCA sustainable aviation fuel mandate.' },
  { id: 'EFL-0003', projectId: 'EFL-003', city: 'Bengaluru', operator: 'HAL e-Aviation Fuel Plant', fuelType: 'Alcohol-to-Jet e-SAF',
    capacityKLPD: 65, investmentCr: 340, carbonReduction: 85, energyPerLitre: 9.0, status: 'Delivered', priority: 'High', origin: 'Karnataka Ethanol Supply', destination: 'HAL Bengaluru Airport', shipDate: '2025-05-02', transitDays: 1, state: 'Karnataka',
    remarks: 'Alcohol-to-jet synthetic aviation fuel at HAL Bengaluru Airport facility with 65 KLPD capacity from Karnataka sugarcane ethanol feedstock through catalytic dehydration, oligomerization and hydroprocessing. &#8377;340 Cr plant produces e-SAF meeting D7566 Annex 5 specifications for HAL Tejas fighter trainer, IAF transport fleet and commercial airlines operating from Bengaluru Kempegowda International Airport. 85% lifecycle carbon reduction versus conventional jet fuel using surplus Karnataka ethanol under National Bio-Energy Programme creating &#8377;3,500 Cr SAF market for Indian Air Force and 800+ commercial aircraft fleet.' },
  { id: 'EFL-0004', projectId: 'EFL-004', city: 'Kolkata', operator: 'Shakti e-Diesel Refinery', fuelType: 'Power-to-Liquid e-Diesel',
    capacityKLPD: 150, investmentCr: 580, carbonReduction: 90, energyPerLitre: 9.8, status: 'In Transit', priority: 'High', origin: 'Haldia Green Hydrogen', destination: 'Kolkata Port Terminal', shipDate: '2025-05-15', transitDays: 2, state: 'West Bengal',
    remarks: 'Power-to-liquid e-diesel en route to Shakti e-Diesel Refinery near Haldia with 150 KLPD capacity using green hydrogen from Haldia offshore wind electrolysis and CO2 from Haldia petrochemical complex. &#8377;580 Cr refinery produces drop-in diesel replacement chemically identical to BIS IS 1460 diesel specification requiring zero modification to existing diesel engines and fuel distribution infrastructure. Serves Kolkata port trucking fleet, inland waterway vessels on Ganga-Bhagirathi-Hooghly river system and Eastern Railway diesel locomotives reducing fossil diesel consumption by 150,000 kilolitres annually under Indian Railways net-zero target by 2030.' },
  { id: 'EFL-0005', projectId: 'EFL-005', city: 'Chennai', operator: 'TNEB e-Ammonia Marine Fuel', fuelType: 'Green Ammonia Marine Bunker',
    capacityKLPD: 200, investmentCr: 650, carbonReduction: 95, energyPerLitre: 3.9, status: 'Delivered', priority: 'Critical', origin: 'Tuticorin Wind Electrolysis', destination: 'Chennai Port Bunker', shipDate: '2025-04-28', transitDays: 2, state: 'Tamil Nadu',
    remarks: 'Green ammonia marine bunker fuel at Chennai Port with 200 KLPD capacity equivalent from Tuticorin offshore wind-powered 60 MW electrolyzer producing 35 TPD green ammonia. &#8377;650 Cr facility bunkers green ammonia for Scandex India and Shreyas Shipping fleet of 25 ammonia-fueled bulk carriers operating on India coastal trade routes. 95% lifecycle carbon reduction versus heavy fuel oil meets IMO 2050 greenhouse gas strategy. Chennai Port bunker terminal also supplies Tuticorin-Colombo-Singapore shipping corridor creating India&apos;s first green maritime fuel corridor under Ministry of Ports green port initiative across 12 major Indian ports.' },
  { id: 'EFL-0006', projectId: 'EFL-006', city: 'Hyderabad', operator: 'Greenko e-Methanol Terminal', fuelType: 'Biomass-to-e-Methanol',
    capacityKLPD: 95, investmentCr: 390, carbonReduction: 88, energyPerLitre: 5.5, status: 'Delivered', priority: 'High', origin: 'Greenko Kurnool RE', destination: 'Hyderabad Chemical Terminal', shipDate: '2025-05-08', transitDays: 1, state: 'Telangana',
    remarks: 'Biomass-to-e-methanol terminal at Hyderabad Chemical Terminal with 95 KLPD capacity using Greenko Kurnool renewable energy park to convert agricultural residue and captured CO2 into green methanol. &#8377;390 Cr terminal supplies methanol to chemical industry replacing fossil-based methanol from Gujarat and Assam gas fields. Green methanol serves as building block for formaldehyde, acetic acid and olefin production at L&amp;T and Dr. Reddy&apos;s chemical plants in Hyderabad. 88% carbon reduction qualifies as green methanol under EU Renewable Energy Directive RED III enabling Indian chemical exporters premium pricing of 25-30% for green-certified petrochemical intermediates.' },
  { id: 'EFL-0007', projectId: 'EFL-007', city: 'Bhubaneswar', operator: 'NALCO e-Fuel Aluminium Smelter', fuelType: 'Power-to-Aluminium e-Fuel',
    capacityKLPD: 55, investmentCr: 280, carbonReduction: 97, energyPerLitre: 15.2, status: 'Delivered', priority: 'Medium', origin: 'NALCO Angul Aluminium', destination: 'Dhamra Port Export', shipDate: '2025-04-25', transitDays: 3, state: 'Odisha',
    remarks: 'Green aluminium smelting fuel at NALCO Angul using e-fuel replacing coal-fired anode baking with 55 KLPD equivalent renewable energy capacity for 100% green aluminium production. &#8377;280 Cr transition converts NALCO&apos;s 460,000 TPA smelter from coal-dependent to renewable-powered achieving 97% carbon reduction in aluminium production. Green aluminium exported through Dhamra Port to European automotive and construction markets commanding &#8377;15,000 per tonne premium versus &#8377;12,000 for conventional aluminium under EU Carbon Border Adjustment Mechanism effective 2026 creating &#8377;1,380 Cr annual premium revenue for India&apos;s largest aluminium producer.' },
  { id: 'EFL-0008', projectId: 'EFL-008', city: 'Jaipur', operator: 'Rajasthan e-Green Steel', fuelType: 'Hydrogen Direct Reduction e-Steel',
    capacityKLPD: 75, investmentCr: 450, carbonReduction: 96, energyPerLitre: 12.5, status: 'Delivered', priority: 'Critical', origin: 'Rajasthan Solar RE', destination: 'Jaipur Steel Works', shipDate: '2025-05-12', transitDays: 2, state: 'Rajasthan',
    remarks: 'Hydrogen direct reduction e-steel fuel at Rajasthan green steel complex with 75 KLPD equivalent capacity using 50 MW green hydrogen from Bhadla Solar Park replacing coking coal in blast furnace iron reduction. &#8377;450 Cr plant converts RSML and RISL steel plants to near-zero carbon steel production achieving 96% emission reduction versus traditional BF-BOF route. Rajasthan&apos;s abundant solar energy at &#8377;2.1/kWh enables green hydrogen production at &#8377;180/kg versus grey hydrogen at &#8377;120/kg but with zero carbon pricing under India&apos;s proposed carbon trading scheme making green steel cost-competitive by 2028 when carbon price reaches &#8377;3,500 per tonne CO2.' },
  { id: 'EFL-0009', projectId: 'EFL-009', city: 'Kochi', operator: 'Kerala e-DME Cooking Gas', fuelType: 'e-DME Cooking Fuel',
    capacityKLPD: 110, investmentCr: 220, carbonReduction: 82, energyPerLitre: 6.9, status: 'Delivered', priority: 'Medium', origin: 'Kochi Refinery Byproduct', destination: 'Kerala LPG Distribution', shipDate: '2025-05-01', transitDays: 1, state: 'Kerala',
    remarks: 'e-DME dimethyl ether cooking fuel at Kochi Refinery with 110 KLPD capacity replacing conventional LPG for Kerala&apos;s 8 million household cooking fuel market. &#8377;220 Cr BPCL facility produces e-DME from refinery CO2 and green hydrogen as LPG substitute with 82% lower lifecycle emissions. e-DME&apos;s low boiling point of -24&#176;C eliminates LPG cylinder explosion risk reducing household kitchen accidents by 90%. Kerala&apos;s high LPG consumption of 1.8 million tonnes annually could be partially substituted by e-DME saving &#8377;800 Cr in LPG import bill and reducing subsidy burden on petroleum ministry by &#8377;350 Cr under Ujjwala scheme extension.' },
  { id: 'EFL-0010', projectId: 'EFL-010', city: 'Guwahati', operator: 'Assam e-Natural Gas', fuelType: 'Power-to-Gas e-SNG',
    capacityKLPD: 130, investmentCr: 310, carbonReduction: 87, energyPerLitre: 10.2, status: 'Processing', priority: 'Medium', origin: 'Assam Bio-Refinery', destination: 'Guwahati Gas Grid', shipDate: '2025-05-18', transitDays: 3, state: 'Assam',
    remarks: 'Power-to-gas synthetic natural gas at Guwahati Gas Grid with 130 KLPD capacity converting 40 MW renewable electricity and Assam tea garden biomass into pipeline-quality synthetic natural gas. &#8377;310 Cr facility injects e-SNG into Assam gas grid supplying 500,000 households and 200 industrial consumers in Brahmaputra Valley. e-SNG reduces dependence on declining Assam oil and gas fields while utilizing abundant renewable energy from Arunachal Pradesh and Meghalaya hydropower stations. 87% lifecycle carbon reduction qualifies for carbon credits under India&apos;s Energy Conservation Act 2022 carbon trading scheme generating &#8377;45 Cr annual carbon credit revenue.' },
  { id: 'EFL-0011', projectId: 'EFL-011', city: 'Delhi', operator: 'Delhi e-Fuel Bus Fleet Depot', fuelType: 'e-Diesel Drop-In Blended',
    capacityKLPD: 90, investmentCr: 195, carbonReduction: 70, energyPerLitre: 9.5, status: 'Delivered', priority: 'High', origin: 'IOCL Panipat Supply', destination: 'Delhi Bus Fuel Depot', shipDate: '2025-05-06', transitDays: 1, state: 'Delhi',
    remarks: 'e-Diesel drop-in blended fuel at Delhi Bus Fleet Depot with 90 KLPD capacity supplying 30% e-diesel blend to 5,000 DTC and cluster buses in Delhi NCR. &#8377;195 Cr depot facility receives e-diesel from IOCL Panipat refinery blending terminal and distributes through existing diesel fuel infrastructure with zero modification to bus fuel tanks or dispensing equipment. 70% carbon reduction at 30% blend ratio enables immediate emission reduction for Delhi&apos;s 10,000 bus fleet without waiting for full electric bus transition. Delhi Transport Corporation reporting 15% fuel efficiency improvement and 25% lower particulate emissions on e-diesel blend versus conventional BS-VI diesel.' },
  { id: 'EFL-0012', projectId: 'EFL-012', city: 'Bhopal', operator: 'MP e-Fuel Railway Locomotive', fuelType: 'e-Ammonia Locomotive Fuel',
    capacityKLPD: 70, investmentCr: 260, carbonReduction: 93, energyPerLitre: 3.2, status: 'Delivered', priority: 'Medium', origin: 'MP Wind RE Supply', destination: 'Bhopal Railway Fuel Depot', shipDate: '2025-05-22', transitDays: 2, state: 'Madhya Pradesh',
    remarks: 'e-Ammonia locomotive fuel at Bhopal Railway Fuel Depot with 70 KLPD capacity supplying green ammonia for Indian Railways ammonia-diesel dual-fuel locomotives on Bhopal-Jabalpur and Bhopal-Indore routes. &#8377;260 Cr facility by RCF Kapurthala and Indian Railways Organization for Alternative Fuels enables 70% ammonia substitution in diesel locomotives reducing fossil fuel consumption by 93% on converted routes. 12 WDG-5G locomotives converted to ammonia-diesel dual fuel operating on 600 km network serving Madhya Pradesh freight corridors. Indian Railways targeting 100% green fuel for 8,000 route km by 2030 under Railway Board net-zero 2030 mission.' },
  { id: 'EFL-0013', projectId: 'EFL-013', city: 'Pune', operator: 'Maharashtra e-Jet Export Terminal', fuelType: 'e-SAF Export Grade',
    capacityKLPD: 50, investmentCr: 375, carbonReduction: 91, energyPerLitre: 9.1, status: 'Delayed', priority: 'High', origin: 'Pune Chemical Works', destination: 'Mumbai Airport Export', shipDate: '2025-04-15', transitDays: 3, state: 'Maharashtra',
    remarks: 'Export-grade e-SAF terminal at Pune delayed by ASTM international certification for Indian-produced synthetic aviation fuel. 50 KLPD capacity producing CORSIA-eligible e-SAF for international airline fuel procurement from Mumbai and Pune airports. &#8377;375 Cr terminal by BPCL and TotalEnergies joint venture supplies Air India, Vistara and IndiGo international flights with &#8377;85 per litre e-SAF at 15% premium over conventional jet fuel. Delayed pending ASTM D1655 annex approval expected Q4 2026 with &#8377;220 Cr annual export potential to Singapore Airlines, Emirates and Lufthansa for India-Singapore and India-Dubai green corridor operations.' },
  { id: 'EFL-0014', projectId: 'EFL-014', city: 'Lucknow', operator: 'UP e-Fuel Agriculture Hub', fuelType: 'e-Diesel Farm Tractor Fuel',
    capacityKLPD: 80, investmentCr: 210, carbonReduction: 75, energyPerLitre: 9.6, status: 'Delayed', priority: 'Medium', origin: 'UP Bio-Refinery Supply', destination: 'UP Agricultural Hubs', shipDate: '2025-04-20', transitDays: 4, state: 'Uttar Pradesh',
    remarks: 'e-Diesel farm tractor fuel at UP Agricultural Hubs with 80 KLPD capacity supplying 20% e-diesel blend to 500,000 tractors and farm equipment across Uttar Pradesh&apos;s 26 million hectare agricultural land. &#8377;210 Cr facility delayed by UP mandi logistics and rural fuel distribution network upgrades. Once commissioned will serve paddy and wheat harvesting seasons providing blended e-diesel through 2,000 rural fuel stations across UP. 75% carbon reduction at 20% blend ratio enables immediate agricultural emission reduction without tractor engine modification under ICAR recommended green farm fuel programme targeting 30% emission reduction in agricultural diesel consumption by 2028.' },
]

export default function EFuelLogisticsView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof EFLRecord])))
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
    { label: 'Avg Energy Density', value: `${(filtered.reduce((a: number, r) => a + r.energyPerLitre, 0) / Math.max(1, filtered.length)).toFixed(1)} kWh/L` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: EFLRecord) => string, val: (r: EFLRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.capacityKLPD)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const fuelBar = grp(r => r.fuelType, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const carbonData = filtered.map(r => ({ name: r.fuelType.split(' ').slice(0, 2).join(' '), value: r.carbonReduction }))
    const lm = filtered.reduce((a: Record<string, { capacityKLPD: number; investmentCr: number }>, r) => {
      if (!a[r.state]) a[r.state] = { capacityKLPD: 0, investmentCr: 0 }
      a[r.state].capacityKLPD += r.capacityKLPD; a[r.state].investmentCr += r.investmentCr; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, capacityKLPD: v.capacityKLPD, investmentCr: v.investmentCr }))
    return { barState, pieState, statusPie, fuelBar, priorityPie, totalInvest, carbonData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="efl-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'e-Fuel' }]} />
      <PageHeader title="e-Fuel Logistics" description="Track electro-fuel supply chains, power-to-liquid fuel logistics, green hydrogen-based e-diesel, e-kerosene, e-methanol and e-ammonia distribution, and carbon-neutral drop-in fuel systems for aviation, shipping, rail and road transport across India" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="efl-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`efl-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-green-950 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="efl-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="efl-kpi-card"><CardContent className="p-4"><p className="efl-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="efl-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="efl-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="efl-chart-title text-sm">Fuel Capacity (KLPD) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#14532d" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="efl-chart-title text-sm">Facilities by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="efl-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="efl-chart-title text-sm">Carbon Reduction (%) by Fuel Type</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.carbonData}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} domain={[65, 100]} /><Tooltip /><Bar dataKey="value" fill="#166534" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="efl-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="efl-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`efl-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-green-900'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.fuelType} | {r.state}</p>
              <p className="text-xs mt-1">{r.capacityKLPD} KLPD | {r.carbonReduction}% CO2 cut | {r.energyPerLitre} kWh/L | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="efl-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="efl-chart-title text-sm">Capacity vs Investment by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="capacityKLPD" stroke="#14532d" name="Capacity KLPD" /><Line yAxisId="right" type="monotone" dataKey="investmentCr" stroke="#22c55e" name="Investment &#8377; Cr" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="efl-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#052e16" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="efl-chart-title text-sm">Fuel Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.fuelBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#15803d" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="efl-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="efl-insights grid grid-cols-2 gap-4">
        <Card className="efl-insight-card border-l-4 border-l-green-900"><CardContent className="p-5">
          <h4 className="efl-insight-title font-semibold text-base">e-Fuels: India&apos;s &#8377;3.5 Lakh Cr Decarbonization Pathway</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s transport sector consuming 320 million tonnes of fossil fuel annually producing 1.2 billion tonnes CO2 equivalent. e-Fuels synthesized from green hydrogen and captured CO2 offer drop-in replacement requiring zero infrastructure modification for 300 million vehicles and 8,000 locomotives. NITI Aayog estimating &#8377;3.5 lakh Cr cumulative investment needed by 2040 for e-fuel capacity of 50 million tonnes annually covering 15% of India&apos;s transport fuel demand. National Green Hydrogen Mission allocating &#8377;19,744 Cr for electrolyzer manufacturing with 60 GW target by 2030 providing sufficient green hydrogen feedstock for 25 million TPA e-fuel production serving aviation, shipping and heavy-duty road transport sectors difficult to electrify directly.</p>
        </CardContent></Card>
        <Card className="efl-insight-card border-l-4 border-l-green-900"><CardContent className="p-5">
          <h4 className="efl-insight-title font-semibold text-base">Sustainable Aviation Fuel: &#8377;18,000 Cr Market by 2030</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Indian aviation consuming 9 million kilolitres jet fuel annually growing at 8% with 800+ aircraft fleet. DGCA mandating 5% SAF blending from 2027 creating &#8377;18,000 Cr annual sustainable aviation fuel market. India producing SAF from three pathways: Alcohol-to-Jet from sugarcane ethanol, Fischer-Tropsch e-kerosene from green hydrogen, and HEFA from used cooking oil and animal fats. Current SAF production at 0.2 million KL needs to scale to 0.45 million KL by 2027 under DGCA mandate. Three IOC, BPCL and HPCL refinery-based SAF plants commissioned at Mumbai, Bengaluru and Hyderabad with combined 215 KLPD capacity producing &#8377;4,200 Cr SAF annually serving Air India, IndiGo and SpiceJet domestic and international operations.</p>
        </CardContent></Card>
        <Card className="efl-insight-card border-l-4 border-l-green-900"><CardContent className="p-5">
          <h4 className="efl-insight-title font-semibold text-base">Green Ammonia Marine Fuel: India&apos;s Coastal Shipping Revolution</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s 7,500 km coastline and 12 major ports handling 1,200 million tonnes cargo annually with coastal shipping fleet of 750 vessels consuming 2.5 million tonnes heavy fuel oil. Green ammonia produced from renewable-powered electrolysis replacing HFO as marine bunker fuel achieves 95% lifecycle emission reduction meeting IMO 2050 zero-carbon shipping target. Chennai, Kandla, Paradip and Vizag ports establishing green ammonia bunkering terminals under Sagarmala programme with combined 500 KLPD capacity. Shipping Corporation of India and Essar Bulk converting 50 vessels to ammonia-fueled engines by 2028 under &#8377;8,500 Cr fleet decarbonization programme leveraging India&apos;s 300 GW renewable energy potential for competitive green ammonia production at &#8377;22/kg versus global average &#8377;35/kg.</p>
        </CardContent></Card>
        <Card className="efl-insight-card border-l-4 border-l-green-900"><CardContent className="p-5">
          <h4 className="efl-insight-title font-semibold text-base">EU CBAM Impact: Green Premium for Indian Exports</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">EU Carbon Border Adjustment Mechanism effective 2026 imposes carbon tariff on imported steel, aluminium and fertilizers based on embedded carbon content. Indian steel and aluminium exporters facing &#8377;18,000 Cr annual CBAM levy at current carbon intensity levels. e-Fuel-powered green steel at &#8377;15,000 per tonne with 96% lower emissions avoids CBAM charges saving &#8377;4,200 per tonne versus conventional steel. India&apos;s green hydrogen mission enables transition of 15 major steel plants to hydrogen direct reduction by 2030 reducing CBAM exposure by 60%. JSW, Tata Steel and SAIL collectively investing &#8377;45,000 Cr in green steel transition converting 25 million TPA capacity to near-zero carbon production for European export market commanding 25% green premium under EU sustainable product regulation.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
