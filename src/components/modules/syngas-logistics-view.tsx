'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface SYGRecord {
  id: string; projectId: string; city: string; operator: string; gasifierType: string
  capacityTPD: number; investmentCr: number; heatingValue: number; carbonEfficiency: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#3f6212', '#4d7c0f', '#65a30d', '#84cc16', '#a3e635', '#365314', '#1a2e05', '#42500a']

const records: SYGRecord[] = [
  { id: 'SYG-0001', projectId: 'SYG-001', city: 'Jamshedpur', operator: 'Jharkhand Coal Syngas Works', gasifierType: 'Entrained Flow Coal Gasification',
    capacityTPD: 2500, investmentCr: 680, heatingValue: 18.5, carbonEfficiency: 82, status: 'Delivered', priority: 'Critical', origin: 'Jharkhand Coal Mines', destination: 'Jamshedpur Steel Complex', shipDate: '2025-05-03', transitDays: 1, state: 'Jharkhand',
    remarks: 'Entrained flow coal gasification syngas plant at Jamshedpur processing 2,500 TPD of Jharkhand coking coal into high-heating-value syngas at 18.5 MJ/m3 for Tata Steel blast furnace injection replacing 40% of coke consumption. &#8377;680 Cr integrated gasification combined cycle facility achieving 82% carbon efficiency with dry feed oxygen-blown gasification at 1,400&#176;C and 40 bar pressure producing syngas directly for steelmaking and 150 MW captive power generation. Project reducing Tata Steel carbon intensity by 25% and coke import dependency by &#8377;2,800 Cr annually under National Steel Policy 2025 mandating 20% gasification-based steelmaking by 2030.' },
  { id: 'SYG-0002', projectId: 'SYG-002', city: 'Raipur', operator: 'Chhattisgarh Biomass Syngas Hub', gasifierType: 'Downdraft Biomass Gasification',
    capacityTPD: 1200, investmentCr: 320, heatingValue: 5.2, carbonEfficiency: 72, status: 'Delivered', priority: 'High', origin: 'Chhattisgarh Rice Mills', destination: 'Raipur Industrial Zone', shipDate: '2025-05-07', transitDays: 1, state: 'Chhattisgarh',
    remarks: 'Downdraft biomass gasification syngas facility at Raipur processing 1,200 TPD of rice husk, sawdust and agricultural residue from Chhattisgarh rice mills and forest biomass into low-calorific syngas at 5.2 MJ/m3 for industrial heating and 25 MW power generation. &#8377;320 Cr plant serving Raipur and Bhilai industrial clusters replacing natural gas for 150 small and medium enterprises in steel re-rolling, ceramic and brick kiln industries. Biomass gasification reducing industrial fuel cost by 55% versus natural gas and eliminating 180,000 tonnes CO2 annually from fossil fuel combustion under Chhattisgarh Renewable Energy Industrial Policy 2025 targeting 500 MW biomass syngas capacity by 2028.' },
  { id: 'SYG-0003', projectId: 'SYG-003', city: 'Mundra', operator: 'Gujarat Petcoke Syngas Works', gasifierType: 'Fluidised Bed Petcoke Gasification',
    capacityTPD: 3000, investmentCr: 850, heatingValue: 16.8, carbonEfficiency: 78, status: 'Delivered', priority: 'Critical', origin: 'Gujarat Refineries', destination: 'Mundra Chemical Zone', shipDate: '2025-05-01', transitDays: 1, state: 'Gujarat',
    remarks: 'Fluidised bed petroleum coke gasification syngas plant at Mundra processing 3,000 TPD of refinery petcoke from Gujarat Reliance and Essar refineries into syngas at 16.8 MJ/m3 for fertiliser production and 350 MW IGCC power. &#8377;850 Cr facility converts high-sulphur petcoke unsuitable for cement industry into clean syngas removing 99.5% of sulphur through in-bed limestone addition. Syngas supplied to Gujarat State Fertilisers and Chemicals ammonia-urea plant replacing 800,000 tonnes per year of imported natural gas feedstock under Gujarat Refinery Waste-to-Energy and Fertiliser Feedstock Policy 2025 reducing India&apos;s urea import dependency by 8%.' },
  { id: 'SYG-0004', projectId: 'SYG-004', city: 'Dhanbad', operator: 'Bihar Underground Coal Gasification', gasifierType: 'UCG In-Situ Coal Gasification',
    capacityTPD: 1800, investmentCr: 520, heatingValue: 12.4, carbonEfficiency: 68, status: 'In Transit', priority: 'High', origin: 'Jharkhand Deep Coal Seams', destination: 'Dhanbad Power Station', shipDate: '2025-05-12', transitDays: 1, state: 'Jharkhand',
    remarks: 'Underground coal gasification syngas plant at Dhanbad converting 1,800 TPD of deep-seam coal in-situ into syngas at 12.4 MJ/m3 without surface mining through controlled underground combustion and gasification. &#8377;520 Cr UCG project accessing 300 million tonnes of coal seams below 600 metres depth uneconomical for conventional mining producing syngas for 100 MW power generation and synthetic natural gas production. Central Mine Planning and Design Institute certifying UCG technology for safe deep seam extraction without subsidence risk under Coal Ministry Unconventional Coal Extraction Programme targeting 5 GW UCG power capacity from abandoned and deep coal reserves by 2030.' },
  { id: 'SYG-005', projectId: 'SYG-005', city: 'Bengaluru', operator: 'Karnataka MSW Plasma Syngas', gasifierType: 'Plasma Gasification MSW',
    capacityTPD: 800, investmentCr: 450, heatingValue: 14.2, carbonEfficiency: 85, status: 'Delivered', priority: 'High', origin: 'Bengaluru Municipal Waste', destination: 'Bengaluru Bio-CNG Plant', shipDate: '2025-05-05', transitDays: 1, state: 'Karnataka',
    remarks: 'Plasma gasification syngas facility at Bengaluru processing 800 TPD of municipal solid waste from BBMP collection network into clean syngas at 14.2 MJ/m3 through 5,000&#176;C plasma arc destruction of all organic and inorganic waste components. &#8377;450 Cr plant produces syngas for 15 MW power generation and 80 TPD bio-methanol production achieving 85% carbon efficiency with zero landfill residue. Bengaluru generating 6,500 TPD MSW requiring 8 plasma gasification plants to achieve 100% waste-to-energy processing under Swachh Bharat Mission Urban 2.0 with plasma gasification preferred over incineration for dioxin-free operation and complete waste destruction including plastics and medical waste.' },
  { id: 'SYG-0006', projectId: 'SYG-006', city: 'Nagpur', operator: 'Maharashtra MSW Syngas Hub', gasifierType: 'Rotary Kiln MSW Gasification',
    capacityTPD: 1000, investmentCr: 380, heatingValue: 11.8, carbonEfficiency: 76, status: 'Delivered', priority: 'High', origin: 'Nagpur Municipal Waste', destination: 'Nagpur Industrial Fuel Hub', shipDate: '2025-05-04', transitDays: 1, state: 'Maharashtra',
    remarks: 'Rotary kiln municipal solid waste gasification syngas plant at Nagpur processing 1,000 TPD of segregated MSW into syngas at 11.8 MJ/m3 for industrial fuel and 20 MW power generation. &#8377;380 Cr facility serves Nagpur orange city municipal waste management and Vidarbha industrial region supplying syngas to 80 industrial consumers replacing furnace oil and coal in boilers. Rotary kiln gasification handling heterogeneous waste including organic, paper, plastic and textile fractions with 76% carbon efficiency under Maharashtra MSW-to-Energy Policy 2025 mandating all cities above 1 million population to process minimum 50% MSW through gasification by 2028.' },
  { id: 'SYG-0007', projectId: 'SYG-007', city: 'Bhilai', operator: 'Chhattisgarh Blast Furnace Syngas', gasifierType: 'Top-Charge Coal Gasification',
    capacityTPD: 2000, investmentCr: 580, heatingValue: 17.2, carbonEfficiency: 80, status: 'Delivered', priority: 'Critical', origin: 'Chhattisgarh Coal Belt', destination: 'Bhilai Steel Plant', shipDate: '2025-05-08', transitDays: 1, state: 'Chhattisgarh',
    remarks: 'Top-charge coal gasification syngas plant at Bhilai processing 2,000 TPD of Chhattisgarh non-coking coal into syngas at 17.2 MJ/m3 for SAIL Bhilai Steel Plant blast furnace injection and captive power generation. &#8377;580 Cr integrated gasification facility converting locally abundant non-coking coal unsuitable for coke making into clean syngas replacing 35% of blast furnace coke requirement and generating 120 MW captive power. SAIL targeting gasification-based syngas injection at all 5 integrated steel plants reducing overall coke rate from 450 kg/t to 300 kg/t hot metal under National Steel Policy blast furnace efficiency improvement programme saving &#8377;4,200 Cr annually in coke procurement.' },
  { id: 'SYG-0008', projectId: 'SYG-008', city: 'Hyderabad', operator: 'Telangana Refuse Syngas Works', gasifierType: 'Fluidised Bed Refuse Gasification',
    capacityTPD: 600, investmentCr: 290, heatingValue: 10.5, carbonEfficiency: 73, status: 'In Transit', priority: 'Medium', origin: 'Hyderabad Municipal Waste', destination: 'Hyderabad Industrial Zone', shipDate: '2025-05-14', transitDays: 1, state: 'Telangana',
    remarks: 'Fluidised bed refuse-derived fuel gasification syngas plant en route to Hyderabad processing 600 TPD of refuse-derived fuel from Hyderabad municipal waste processing facility into syngas at 10.5 MJ/m3. &#8377;290 Cr facility produces syngas for 12 MW power and industrial heating for Telangana pharma and chemical industries near Hyderabad. RDF pre-processing removes recyclables and inert material achieving 73% carbon efficiency in gasification of high-calorific fraction. Greater Hyderabad Municipal Corporation integrating RDF gasification into Hyderabad Integrated Solid Waste Management Plan 2025 targeting 2,000 TPD RDF processing capacity through 4 gasification plants serving pharmaceutical cluster industrial fuel needs.' },
  { id: 'SYG-0009', projectId: 'SYG-009', city: 'Rourkela', operator: 'Odisha Sponge Iron Syngas', gasifierType: 'Fixed Bed Coal Syngas DRI',
    capacityTPD: 2200, investmentCr: 620, heatingValue: 15.8, carbonEfficiency: 79, status: 'Delivered', priority: 'High', origin: 'Odisha Coal Belt', destination: 'Rourkela Steel Plant', shipDate: '2025-05-06', transitDays: 1, state: 'Odisha',
    remarks: 'Fixed bed coal gasification syngas-to-DRI plant at Rourkela processing 2,200 TPD of Odisha coal into syngas at 15.8 MJ/m3 for direct reduced iron production replacing natural gas-based DRI process. &#8377;620 Cr coal gasification-DRI facility produces 800,000 TPA sponge iron using coal-derived syngas reducing natural gas import dependency for Rourkela Steel Plant DRI units. India&apos;s 45 million TPA DRI industry currently 60% coal-based and 40% gas-based with gasification syngas enabling coal-to-gas conversion at existing DRI plants under Ministry of Steel DRI Gasification Conversion Programme targeting 10 million TPA coal gasification-based DRI by 2028 reducing natural gas import bill by &#8377;8,000 Cr.' },
  { id: 'SYG-0010', projectId: 'SYG-010', city: 'Kolkata', operator: 'West Bengal Jute Syngas', gasifierType: 'Downdraft Jute Stalk Gasification',
    capacityTPD: 900, investmentCr: 240, heatingValue: 4.8, carbonEfficiency: 70, status: 'Delivered', priority: 'Medium', origin: 'WB Jute Mills', destination: 'Kolkata Jute Industrial Zone', shipDate: '2025-05-02', transitDays: 1, state: 'West Bengal',
    remarks: 'Downdraft jute stalk gasification syngas plant at Kolkata processing 900 TPD of jute stalk waste from West Bengal jute mills into syngas at 4.8 MJ/m3 for jute mill process steam and 10 MW power generation. &#8377;240 Cr facility serves 50 jute mills in Hooghly and North 24 Parganas districts replacing coal-fired boilers for jute processing steam and providing captive power reducing jute mill energy cost by 45%. West Bengal generating 8 million tonnes jute stalk waste annually from 90 jute mills creating 5,000 TPD biomass gasification opportunity under National Jute Board Jute Waste-to-Energy Programme targeting 100% jute mill energy self-sufficiency from jute stalk gasification by 2028.' },
  { id: 'SYG-0011', projectId: 'SYG-011', city: 'Vijayawada', operator: 'AP Rice Husk Syngas', gasifierType: 'Circulating Fluidised Bed Rice',
    capacityTPD: 1400, investmentCr: 350, heatingValue: 5.8, carbonEfficiency: 74, status: 'Delivered', priority: 'Medium', origin: 'AP Rice Mills', destination: 'Vijayawada Industrial Fuel', shipDate: '2025-05-09', transitDays: 1, state: 'Andhra Pradesh',
    remarks: 'Circulating fluidised bed rice husk gasification syngas facility at Vijayawada processing 1,400 TPD of rice husk from Andhra Pradesh rice mills into syngas at 5.8 MJ/m3 for 30 MW power and industrial heating supply. &#8377;350 Cr plant serving Vijayawada-Guntur industrial cluster and AP poultry feed industry providing low-cost syngas replacing LPG and diesel in 120 industrial boilers. Circulating fluidised bed technology achieving uniform temperature distribution and 74% carbon efficiency for variable-moisture rice husk feedstock under AP Biomass Energy and Rice Mill Waste Utilisation Policy 2025 with Andhra Pradesh targeting 200 MW rice husk gasification power capacity by 2028 from 28 million tonnes annual paddy production.' },
  { id: 'SYG-0012', projectId: 'SYG-012', city: 'Kerala', operator: 'Kerala Coir Syngas Works', gasifierType: 'Updraft Coir Pith Gasification',
    capacityTPD: 500, investmentCr: 180, heatingValue: 4.5, carbonEfficiency: 68, status: 'Delivered', priority: 'Medium', origin: 'Kerala Coir Mills', destination: 'Kerala Coir Industrial Zone', shipDate: '2025-05-10', transitDays: 1, state: 'Kerala',
    remarks: 'Updraft coir pith gasification syngas plant at Kerala processing 500 TPD of coir pith waste from Kerala coconut coir industry into syngas at 4.5 MJ/m3 for coir industry process heat and 8 MW power generation. &#8377;180 Cr facility serves 200 coir mills in Thrissur, Alappuzha and Ernakulam districts replacing firewood and diesel for coir retting and mat weaving process heat. Kerala&apos;s 7.5 million tonnes annual coconut production generating 1.2 million tonnes coir pith waste with 60% currently burned or dumped creating massive syngas potential under Kerala Coir Industry Modernisation and Waste-to-Energy Scheme 2025 targeting 100% coir pith utilisation for syngas and bio-char production.' },
  { id: 'SYG-0013', projectId: 'SYG-013', city: 'Vadodara', operator: 'Gujarat Chemical Syngas', gasifierType: 'Partial Oxidation Naphtha',
    capacityTPD: 1600, investmentCr: 490, heatingValue: 19.2, carbonEfficiency: 86, status: 'In Transit', priority: 'High', origin: 'Gujarat Refineries', destination: 'Vadodara Petrochemical Hub', shipDate: '2025-05-11', transitDays: 1, state: 'Gujarat',
    remarks: 'Partial oxidation naphtha gasification syngas facility en route to Vadodara processing 1,600 TPD of naphtha and refinery off-gas into syngas at 19.2 MJ/m3 for Gujarat State Fertilisers ammonia production and Indian Petrochemicals Corporation methanol synthesis. &#8377;490 Cr plant achieves 86% carbon efficiency through catalytic partial oxidation at 1,350&#176;C and 70 bar pressure producing hydrogen-rich syngas directly optimised for ammonia synthesis without shift conversion. Vadodara petrochemical cluster syngas pipeline interconnecting 6 fertiliser and chemical plants replacing 600,000 tonnes per year natural gas feedstock under Gujarat Petrochemical Feedstock Diversification Programme 2025 reducing fertiliser production cost by 20% and import dependency on LNG.' },
  { id: 'SYG-0014', projectId: 'SYG-014', city: 'Tuticorin', operator: 'TN Coal Slurry Syngas', gasifierType: 'Slurry Feed Coal Gasification',
    capacityTPD: 2800, investmentCr: 750, heatingValue: 17.8, carbonEfficiency: 83, status: 'Delayed', priority: 'High', origin: 'TN Imported Coal Port', destination: 'Tuticorin Chemical Zone', shipDate: '2025-05-16', transitDays: 1, state: 'Tamil Nadu',
    remarks: 'Slurry feed coal gasification syngas plant at Tuticorin processing 2,800 TPD of imported coal from Tuticorin port into syngas at 17.8 MJ/m3 for Sterlite Copper process heat and 200 MW IGCC power generation. &#8377;750 Cr coal-water slurry feed gasification facility achieving 83% carbon efficiency with low-rank imported Indonesian coal for TN thermal power and industrial fuel substitution. Slurry feed technology enabling use of cheaper high-moisture coal without drying penalty reducing syngas production cost by 15% versus dry feed systems under Tamil Nadu Industrial Fuel Substitution and Clean Energy Mandate 2025 requiring all large industries to source minimum 25% process energy from gasification-based syngas by 2027.' },
]

export default function SyngasLogisticsView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof SYGRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'gasifierType', label: 'Gasifier Type', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.gasifierType] = (m[r.gasifierType] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Capacity', value: `${filtered.reduce((a: number, r) => a + r.capacityTPD, 0).toLocaleString()} TPD` },
    { label: 'Avg Heating Value', value: `${(filtered.reduce((a: number, r) => a + r.heatingValue, 0) / Math.max(1, filtered.length)).toFixed(1)} MJ/m3` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Avg Carbon Eff.', value: `${(filtered.reduce((a: number, r) => a + r.carbonEfficiency, 0) / Math.max(1, filtered.length)).toFixed(1)}%` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: SYGRecord) => string, val: (r: SYGRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.capacityTPD)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const typeBar = grp(r => r.gasifierType, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const hvData = filtered.map(r => ({ name: r.gasifierType.split(' ').slice(0, 2).join(' '), value: r.heatingValue }))
    const lm = filtered.reduce((a: Record<string, { capacityTPD: number; investmentCr: number }>, r) => {
      if (!a[r.state]) a[r.state] = { capacityTPD: 0, investmentCr: 0 }
      a[r.state].capacityTPD += r.capacityTPD; a[r.state].investmentCr += r.investmentCr; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, capacityTPD: v.capacityTPD, investmentCr: v.investmentCr }))
    return { barState, pieState, statusPie, typeBar, priorityPie, totalInvest, hvData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="syg-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Syngas' }]} />
      <PageHeader title="Syngas Logistics" description="Track syngas production and distribution supply chains, coal and biomass gasification logistics, syngas pipeline networks, and India's clean gasification programme for steel, fertiliser, power and chemical industries" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="syg-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t as 'dashboard' | 'registry' | 'analytics' | 'insights')} className={`syg-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-lime-800 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="syg-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="syg-kpi-card"><CardContent className="p-4"><p className="syg-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="syg-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="syg-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="syg-chart-title text-sm">Gasification Capacity (TPD) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#3f6212" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="syg-chart-title text-sm">Facilities by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="syg-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="syg-chart-title text-sm">Heating Value (MJ/m3) by Gasifier Type</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.hvData}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} domain={[0, 22]} /><Tooltip /><Bar dataKey="value" fill="#4d7c0f" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="syg-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="syg-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`syg-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-lime-800'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.gasifierType} | {r.state}</p>
              <p className="text-xs mt-1">{r.capacityTPD.toLocaleString()} TPD | {r.heatingValue} MJ/m3 | {r.carbonEfficiency}% eff. | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="syg-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="syg-chart-title text-sm">Capacity vs Investment by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="capacityTPD" stroke="#3f6212" name="Capacity TPD" /><Line yAxisId="right" type="monotone" dataKey="investmentCr" stroke="#84cc16" name="Investment &#8377; Cr" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="syg-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#365314" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="syg-chart-title text-sm">Gasifier Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.typeBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#4d7c0f" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="syg-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="syg-insights grid grid-cols-2 gap-4">
        <Card className="syg-insight-card border-l-4 border-l-lime-800"><CardContent className="p-5">
          <h4 className="syg-insight-title font-semibold text-base">India&apos;s &#8377;45,000 Cr Gasification Target by 2030</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India targeting 100 million tonnes coal gasification capacity by 2030 under National Coal Gasification Mission with &#8377;45,000 Cr investment allocation from Coal Ministry and Ministry of Power. Coal gasification producing syngas for steel, fertiliser, chemicals, synthetic natural gas and power generation reducing India&apos;s natural gas import bill by &#8377;35,000 Cr annually. NITI Aayog gasification roadmap designating 12 coal gasification hubs at Jamshedpur, Rourkela, Bhilai, Dhanbad, Talcher, Singrauli, Korba, Bilaspur, Mundra, Tuticorin, Kakinada and Paradip creating integrated syngas pipeline networks serving multiple industrial consumers under National Gas Grid Expansion Programme 2025-2030.</p>
        </CardContent></Card>
        <Card className="syg-insight-card border-l-4 border-l-lime-800"><CardContent className="p-5">
          <h4 className="syg-insight-title font-semibold text-base">Syngas for Steel: 25% Coke Reduction</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Indian steel industry consuming 70 million tonnes coke annually at &#8377;12,000 per tonne with syngas-based blast furnace injection replacing 25-40% of coke requirement reducing steelmaking carbon footprint by 20-35%. Ministry of Steel mandating all new blast furnaces above 2,000 m3 volume to incorporate syngas injection capability under National Steel Policy gasification integration requirement effective 2027. SAIL, Tata Steel and JSPL committing &#8377;18,000 Cr to gasification-based syngas injection across 15 blast furnaces by 2028 reducing India&apos;s steel sector CO2 emissions by 85 million tonnes annually and coke import dependency from Australia and Mozambique by &#8377;8,500 Cr saving per year.</p>
        </CardContent></Card>
        <Card className="syg-insight-card border-l-4 border-l-lime-800"><CardContent className="p-5">
          <h4 className="syg-insight-title font-semibold text-base">Biomass Syngas: &#8377;8,000 Cr Rural Industry Fuel</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India generating 500 million tonnes agricultural residue annually with 200 million tonnes available for biomass gasification producing syngas for rural industrial clusters at &#8377;3 per MJ versus &#8377;8 for LPG and &#8377;6 for natural gas. Ministry of New and Renewable Energy promoting biomass gasification through 5,000 MW biomass syngas power programme and 2,000 industrial syngas heating installations by 2028 under National Biomass Gasification Mission. Rice husk, bagasse, jute stalk and coir pith gasification serving rice mills, jute mills, sugar mills and brick kilns across Punjab, West Bengal, Uttar Pradesh and Tamil Nadu creating &#8377;8,000 Cr rural industrial fuel market while eliminating open biomass burning causing severe air pollution in North India.</p>
        </CardContent></Card>
        <Card className="syg-insight-card border-l-4 border-l-lime-800"><CardContent className="p-5">
          <h4 className="syg-insight-title font-semibold text-base">Underground Coal Gasification: Accessing 300 Billion Tonnes</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Underground coal gasification technology enabling access to 300 billion tonnes of Indian coal resources below 600 metres depth uneconomical for conventional mining including 50 billion tonnes in Jharkhand, Chhattisgarh and Odisha deep coal seams. CMPDI estimating 5 GW UCG power generation potential from abandoned coal mines and deep seams requiring zero surface land acquisition and minimal environmental impact compared to opencast mining. Coal Ministry allocating &#8377;3,500 Cr for UCG pilot programme at 8 sites in Jharkhand, Chhattisgarh, Telangana and Rajasthan under Unconventional Coal Technologies Programme 2025 targeting commercial-scale UCG syngas production by 2028 for power and synthetic natural gas manufacturing.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
