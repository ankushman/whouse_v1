'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface SILRecord {
  id: string; projectId: string; city: string; operator: string; anodeType: string
  capacityTPA: number; investmentCr: number; specificCapacity: number; cycleLife: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#0f766e', '#115e59', '#134e4a', '#0d9488', '#14b8a6', '#042f2e', '#041f1f', '#065f46']

const records: SILRecord[] = [
  { id: 'SIL-0001', projectId: 'SIL-001', city: 'Bengaluru', operator: 'Bengaluru Si-Anode Tech', anodeType: 'Nano-Silicon Composite 4200mAh',
    capacityTPA: 1200, investmentCr: 420, specificCapacity: 4200, cycleLife: 850, status: 'Delivered', priority: 'Critical', origin: 'Karnataka Si Precursor', destination: 'Bengaluru EV Cell Plant', shipDate: '2025-05-03', transitDays: 1, state: 'Karnataka',
    remarks: 'Nano-silicon composite anode facility at Bengaluru producing 1,200 TPA of 4200 mAh/g specific capacity silicon anode material from Karnataka-sourced metallurgical grade silicon through nano-milling and carbon coating process. &#8377;420 Cr plant supplies Tesla-competitor Indian EV cell manufacturers achieving 850 cycle life with first-cycle efficiency of 92%. Serving Ola Electric, Ather Energy and Mahindra Electric cell assembly lines in Bengaluru enabling 350 Wh/kg EV cell energy density 40% higher than graphite anode cells under FAME III programme targeting 500 km range electric two-wheelers.' },
  { id: 'SIL-0002', projectId: 'SIL-002', city: 'Hyderabad', operator: 'Telangana Silicon Oxide Works', anodeType: 'SiOx 1.5V Composite',
    capacityTPA: 950, investmentCr: 365, specificCapacity: 1800, cycleLife: 1200, status: 'Delivered', priority: 'Critical', origin: 'Telangana Silica Sand', destination: 'Hyderabad Cell Factory', shipDate: '2025-05-07', transitDays: 1, state: 'Telangana',
    remarks: 'Silicon monoxide composite anode plant at Hyderabad producing 950 TPA of SiOx anode with 1800 mAh/g specific capacity and 1200 cycle life from Telangana silica sand through carbothermal reduction and carbon nanotube coating. &#8377;365 Cr facility serves leading Indian battery manufacturers including Exicom, Amaron and Exide for premium electric vehicle battery packs with 25% higher energy density than conventional graphite cells. Telangana State EV Policy 2025 mandating minimum 300 Wh/kg cell-level energy density for all EVs registered in state creating guaranteed demand for silicon-anode cells from 2026.' },
  { id: 'SIL-0003', projectId: 'SIL-003', city: 'Pune', operator: 'Maharashtra Si-Nano Plant', anodeType: 'Porous Silicon Nanowire',
    capacityTPA: 800, investmentCr: 340, specificCapacity: 3500, cycleLife: 900, status: 'In Transit', priority: 'High', origin: 'Jharkhand Metallurgical Si', destination: 'Pune EV Manufacturing Hub', shipDate: '2025-05-12', transitDays: 2, state: 'Maharashtra',
    remarks: 'Porous silicon nanowire anode facility en route to Pune producing 800 TPA of 3500 mAh/g specific capacity porous silicon nanowire anode from Jharkhand metallurgical-grade silicon through electrochemical etching and atomic layer deposition carbon coating. &#8377;340 Cr plant enables volume expansion accommodation of 300% during lithiation achieving 900 cycle life for Tata Motors EV passenger car programme. Porous nanowire architecture eliminating traditional binder and conductive additive requirements reducing anode cost by 20% versus conventional silicon-carbon composite anodes under Maharashtra EV and Battery Manufacturing Policy 2025.' },
  { id: 'SIL-0004', projectId: 'SIL-004', city: 'Gandhinagar', operator: 'Gujarat Silicon Carbide Anode', anodeType: 'SiC Nanoparticle Composite',
    capacityTPA: 700, investmentCr: 310, specificCapacity: 1400, cycleLife: 1500, status: 'Delivered', priority: 'High', origin: 'Gujarat Silica Refinery', destination: 'Gandhinagar Battery Park', shipDate: '2025-05-01', transitDays: 1, state: 'Gujarat',
    remarks: 'Silicon carbide nanoparticle composite anode plant at Gandhinagar producing 700 TPA of 1400 mAh/g SiC nanoparticle composite anode from Gujarat silica through plasma-enhanced chemical vapour deposition and planetary ball milling. &#8377;310 Cr facility achieves exceptional 1500 cycle life with less than 15% volume expansion serving Reliance New Energy gigafactory for stationary energy storage cells with 20-year calendar life. Gujarat Battery Energy Storage Policy 2025 allocating &#8377;5,000 Cr subsidy for silicon-anode cell production with SiC nanoparticle anode qualifying for highest incentive tier due to ultra-long cycle life performance.' },
  { id: 'SIL-0005', projectId: 'SIL-005', city: 'Chennai', operator: 'TN Silicon Alloy Works', anodeType: 'Si-Graphite Alloy 2000mAh',
    capacityTPA: 1400, investmentCr: 385, specificCapacity: 2000, cycleLife: 1000, status: 'Delivered', priority: 'Critical', origin: 'TN Quartz Deposits', destination: 'Chennai Battery Corridor', shipDate: '2025-05-05', transitDays: 1, state: 'Tamil Nadu',
    remarks: 'Silicon-graphite alloy anode production facility at Chennai producing 1,400 TPA of 2000 mAh/g silicon-graphite blended anode from Tamil Nadu quartz deposits through magnesiothermic reduction and mechanical alloying with spherical graphite. &#8377;385 Cr plant is India&apos;s highest-volume silicon anode facility supplying 60% of Indian EV cell market through drop-in compatible graphite replacement requiring zero cell design changes. TVS Motor, Royal Enfield Electric and BYD India sourcing silicon-graphite alloy anode for electric two-wheeler and three-wheeler cells achieving 280 Wh/kg cell energy density with 1000 cycle life under FAME III localisation requirements.' },
  { id: 'SIL-0006', projectId: 'SIL-006', city: 'Kolkata', operator: 'West Bengal Si-Carbon Works', anodeType: 'Si-Carbon Microsphere 2800mAh',
    capacityTPA: 600, investmentCr: 275, specificCapacity: 2800, cycleLife: 800, status: 'In Transit', priority: 'High', origin: 'Jharkhand Si Precursor', destination: 'Kolkata Port Terminal', shipDate: '2025-05-14', transitDays: 2, state: 'West Bengal',
    remarks: 'Silicon-carbon microsphere anode plant en route to Kolkata producing 600 TPA of 2800 mAh/g silicon-carbon core-shell microsphere anode through spray-drying silicon nanoparticle dispersion and chemical vapour deposition carbon coating. &#8377;275 Cr facility serves Eastern India EV cell cluster and Indian Navy submarine battery programme requiring high-energy-density anodes with 800 cycle life. Core-shell microsphere architecture providing mechanical integrity during cycling preventing silicon pulverisation in high-rate charge-discharge conditions critical for defence submarine propulsion batteries under Make in India naval battery programme.' },
  { id: 'SIL-0007', projectId: 'SIL-007', city: 'Bhubaneswar', operator: 'Odisha Si-Ore Processing Hub', anodeType: 'Metallurgical Si Micropowder',
    capacityTPA: 2000, investmentCr: 250, specificCapacity: 3500, cycleLife: 600, status: 'Delivered', priority: 'Medium', origin: 'Odisha Quartzite Mines', destination: 'Bhubaneswar Si Terminal', shipDate: '2025-04-28', transitDays: 1, state: 'Odisha',
    remarks: 'Metallurgical silicon micropowder anode precursor facility at Bhubaneswar producing 2,000 TPA of 3500 mAh/g metallurgical grade silicon micropowder from Odisha quartzite mines through electric arc furnace smelting and jet milling classification. &#8377;250 Cr plant is India&apos;s primary silicon anode precursor supplier providing feedstock material to Bengaluru, Pune and Chennai silicon anode coating facilities. Odisha&apos;s 40% of India&apos;s quartz reserves enabling domestic silicon supply chain reducing import dependency on Chinese silicon anode material by 35% under National Critical Mineral Mission with Bhubaneswar hub processing 15,000 TPA quartz ore into 2,000 TPA battery-grade silicon micropowder.' },
  { id: 'SIL-0008', projectId: 'SIL-008', city: 'Gurgaon', operator: 'Haryana Si-Polymer Composite', anodeType: 'Si-Polymer Binder Anode 2500mAh',
    capacityTPA: 500, investmentCr: 230, specificCapacity: 2500, cycleLife: 950, status: 'Delivered', priority: 'Medium', origin: 'Rajasthan Si Precursor', destination: 'Gurgaon EV Cell Hub', shipDate: '2025-05-08', transitDays: 2, state: 'Haryana',
    remarks: 'Silicon-polymer composite anode facility at Gurgaon producing 500 TPA of 2500 mAh/g silicon-polymer binder anode using self-healing polymeric binder technology addressing silicon volume expansion without carbon coating. &#8377;230 Cr plant jointly developed with IIT Delhi polymer science department using proprietary elastomeric binder enabling 950 cycle life through self-healing of silicon particle cracks during cycling. Haryana EV Policy 2025 mandating silicon-anode cells for all state-purchased government EV fleet with 30% subsidy on silicon-anode cell procurement for Maruti Suzuki and Hero MotoCorp electric vehicle manufacturing in Haryana automotive cluster.' },
  { id: 'SIL-0009', projectId: 'SIL-009', city: 'Ahmedabad', operator: 'Gujarat Si-Thin Film Works', anodeType: 'Amorphous Si Thin Film 3000mAh',
    capacityTPA: 350, investmentCr: 200, specificCapacity: 3000, cycleLife: 1100, status: 'Delivered', priority: 'Medium', origin: 'Gujarat Semiconductor Si', destination: 'Ahmedabad Tech Park', shipDate: '2025-05-06', transitDays: 1, state: 'Gujarat',
    remarks: 'Amorphous silicon thin film anode facility at Ahmedabad producing 350 TPA of 3000 mAh/g amorphous silicon thin film anode deposited on copper current collector through physical vapour deposition and sputtering. &#8377;200 Cr plant serves premium EV segment requiring ultra-high energy density cells with 1100 cycle life for luxury electric vehicles and performance motorcycle batteries. Thin film architecture eliminates binder and conductive additive requirements achieving 95% first-cycle coulombic efficiency with areal loading of 3 mAh/cm2 suitable for high-power applications in Gujarat&apos;s emerging electric supercar and performance motorcycle segment.' },
  { id: 'SIL-0010', projectId: 'SIL-010', city: 'Lucknow', operator: 'UP Silicon Recycling Hub', anodeType: 'Recycled Si from PV Waste',
    capacityTPA: 400, investmentCr: 140, specificCapacity: 3200, cycleLife: 750, status: 'Delayed', priority: 'Medium', origin: 'UP Solar Panel Scrap', destination: 'Lucknow Circular Economy Park', shipDate: '2025-05-16', transitDays: 2, state: 'Uttar Pradesh',
    remarks: 'Recycled silicon anode facility at Lucknow producing 400 TPA of 3200 mAh/g battery-grade silicon recovered from end-of-life solar panel waste through hydrometallurgical leaching and recrystallisation. &#8377;140 Cr circular economy plant processes 8,000 TPA of decommissioned solar panel silicon recovering 95% of battery-grade silicon for anode manufacturing. India generating 150,000 TPA solar panel waste by 2027 under CPGL Solar Waste Management Rules creating massive silicon recycling feedstock for UP recycling hub addressing dual challenge of solar waste management and domestic silicon supply under National Solar Mission and Battery Waste Management Rules 2022.' },
  { id: 'SIL-0011', projectId: 'SIL-011', city: 'Jaipur', operator: 'Rajasthan Si-Graphene Hybrid', anodeType: 'Si-Graphene 3D Scaffold 4000mAh',
    capacityTPA: 300, investmentCr: 185, specificCapacity: 4000, cycleLife: 700, status: 'Delivered', priority: 'High', origin: 'Rajasthan Si Precursor', destination: 'Jaipur Advanced Materials Hub', shipDate: '2025-05-09', transitDays: 1, state: 'Rajasthan',
    remarks: 'Silicon-graphene 3D scaffold anode plant at Jaipur producing 300 TPA of 4000 mAh/g silicon-graphene hybrid anode embedding silicon nanoparticles in 3D graphene aerogel scaffold through chemical vapour deposition and hydrothermal self-assembly. &#8377;185 Cr facility represents India&apos;s highest specific capacity silicon anode product with 4000 mAh/g approaching theoretical silicon limit of 4200 mAh/g. Graphene scaffold preventing silicon particle aggregation and accommodating 280% volume expansion enabling 700 cycle life serving premium drone, aerospace and defence battery applications under Rajasthan Advanced Materials and Battery Policy 2025.' },
  { id: 'SIL-0012', projectId: 'SIL-012', city: 'Cochin', operator: 'Kerala Si-Preform Plant', anodeType: 'Si Preform for Solid-State 3800mAh',
    capacityTPA: 250, investmentCr: 160, specificCapacity: 3800, cycleLife: 950, status: 'In Transit', priority: 'Medium', origin: 'TN Si Precursor', destination: 'Cochin Port Terminal', shipDate: '2025-05-11', transitDays: 2, state: 'Kerala',
    remarks: 'Silicon preform anode facility en route to Cochin producing 250 TPA of 3800 mAh/g silicon preform specifically designed for solid-state battery architectures using sulfide electrolyte interface. &#8377;160 Cr plant serves emerging Indian solid-state battery programme at IIT Madras Research Park and ISRO Vikram Sarabhai Space Centre for satellite and launch vehicle batteries. Silicon preform architecture optimised for solid electrolyte contact eliminating liquid electrolyte incompatibility issues and achieving 950 cycle life with solid-state cells under Kerala Emerging Technology Promotion Scheme for advanced battery materials.' },
  { id: 'SIL-0013', projectId: 'SIL-013', city: 'Indore', operator: 'MP Silicon Coating Centre', anodeType: 'Si-Carbon Coated 2600mAh',
    capacityTPA: 850, investmentCr: 290, specificCapacity: 2600, cycleLife: 1050, status: 'Delivered', priority: 'High', origin: 'Odisha Si Micropowder', destination: 'Indore Industrial Zone', shipDate: '2025-05-04', transitDays: 1, state: 'Madhya Pradesh',
    remarks: 'Silicon-carbon coated anode production centre at Indore producing 850 TPA of 2600 mAh/g pitch-derived carbon-coated silicon composite anode from Odisha-sourced silicon micropowder through pitch coating and carbonisation at 1200&#176;C. &#8377;290 Cr facility achieves 1050 cycle life through uniform carbon shell preventing direct electrolyte-silicon contact and SEI stabilisation serving central India EV cell manufacturers and grid storage cell producers. MP Industrial Policy 2025 providing 15% capital subsidy for silicon anode coating operations with Indore centre supplying central and western India battery cluster through dedicated silicon anode logistics corridor.' },
  { id: 'SIL-0014', projectId: 'SIL-014', city: 'Guwahati', operator: 'Assam Si-Rice Husk Anode', anodeType: 'Bio-Silica Si Nano 1500mAh',
    capacityTPA: 350, investmentCr: 120, specificCapacity: 1500, cycleLife: 650, status: 'Delivered', priority: 'Medium', origin: 'Assam Rice Husk Bio-Silica', destination: 'Guwahati Materials Hub', shipDate: '2025-05-02', transitDays: 1, state: 'Assam',
    remarks: 'Bio-silica derived silicon nano anode facility at Guwahati producing 350 TPA of 1500 mAh/g battery-grade nano-silicon extracted from rice husk bio-silica through magnesiothermic reduction at low temperature. &#8377;120 Cr plant represents India&apos;s first agricultural waste-to-silicon anode value chain processing 5,000 TPA rice husk from Assam rice mills into nano-silicon anode material. Technology jointly developed with IIT Guwahati converting 95% of rice husk silica into battery-grade silicon at 60% lower cost than metallurgical silicon route serving cost-sensitive electric three-wheeler and bus battery segment under Assam Bio-Economy Mission 2025 and North East Special Infrastructure Development Programme.' },
]

export default function SiliconAnodeLogisticsView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof SILRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'anodeType', label: 'Anode Type', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.anodeType] = (m[r.anodeType] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Capacity', value: `${filtered.reduce((a: number, r) => a + r.capacityTPA, 0).toLocaleString()} TPA` },
    { label: 'Avg Specific Cap.', value: `${(filtered.reduce((a: number, r) => a + r.specificCapacity, 0) / Math.max(1, filtered.length)).toFixed(0)} mAh/g` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Avg Cycle Life', value: `${(filtered.reduce((a: number, r) => a + r.cycleLife, 0) / Math.max(1, filtered.length)).toFixed(0)}` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: SILRecord) => string, val: (r: SILRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.capacityTPA)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const typeBar = grp(r => r.anodeType, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const capData = filtered.map(r => ({ name: r.anodeType.split(' ').slice(0, 2).join(' '), value: r.specificCapacity }))
    const lm = filtered.reduce((a: Record<string, { capacityTPA: number; investmentCr: number }>, r) => {
      if (!a[r.state]) a[r.state] = { capacityTPA: 0, investmentCr: 0 }
      a[r.state].capacityTPA += r.capacityTPA; a[r.state].investmentCr += r.investmentCr; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, capacityTPA: v.capacityTPA, investmentCr: v.investmentCr }))
    return { barState, pieState, statusPie, typeBar, priorityPie, totalInvest, capData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="sil-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Silicon Anode' }]} />
      <PageHeader title="Silicon Anode Logistics" description="Track silicon anode material supply chains, nano-silicon composite production logistics, Si-graphite alloy distribution, and India's advanced battery anode manufacturing for next-generation high-energy-density EV and grid storage cells" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="sil-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t as 'dashboard' | 'registry' | 'analytics' | 'insights')} className={`sil-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-teal-800 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="sil-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="sil-kpi-card"><CardContent className="p-4"><p className="sil-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="sil-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="sil-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="sil-chart-title text-sm">Production Capacity (TPA) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#0f766e" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="sil-chart-title text-sm">Facilities by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="sil-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="sil-chart-title text-sm">Specific Capacity (mAh/g) by Anode Type</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.capData}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} domain={[0, 4500]} /><Tooltip /><Bar dataKey="value" fill="#115e59" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="sil-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="sil-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`sil-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-teal-800'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.anodeType} | {r.state}</p>
              <p className="text-xs mt-1">{r.capacityTPA.toLocaleString()} TPA | {r.specificCapacity} mAh/g | {r.cycleLife} cycles | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="sil-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="sil-chart-title text-sm">Capacity vs Investment by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="capacityTPA" stroke="#0f766e" name="Capacity TPA" /><Line yAxisId="right" type="monotone" dataKey="investmentCr" stroke="#14b8a6" name="Investment &#8377; Cr" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="sil-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#134e4a" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="sil-chart-title text-sm">Anode Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.typeBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#115e59" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="sil-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="sil-insights grid grid-cols-2 gap-4">
        <Card className="sil-insight-card border-l-4 border-l-teal-800"><CardContent className="p-5">
          <h4 className="sil-insight-title font-semibold text-base">India&apos;s &#8377;12,000 Cr Silicon Anode Market by 2028</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s silicon anode material market projected to reach &#8377;12,000 Cr by 2028 from &#8377;800 Cr in 2024 growing at 95% CAGR driven by EV cell localisation under PLI Advanced Chemistry Cell scheme and FAME III programme. Silicon anodes replacing graphite in 40% of EV cells by 2028 achieving 350 Wh/kg cell-level energy density versus 260 Wh/kg for pure graphite anodes. Ministry of Heavy Industries mandating minimum 300 Wh/kg cell energy density for FAME subsidy qualification from 2026 creating &#8377;10,000 Cr silicon anode demand from 30 GWh Indian EV cell production requiring 18,000 TPA silicon anode material capacity across 25 production facilities.</p>
        </CardContent></Card>
        <Card className="sil-insight-card border-l-4 border-l-teal-800"><CardContent className="p-5">
          <h4 className="sil-insight-title font-semibold text-base">Odisha Quartz: &#8377;2,500 Cr Domestic Silicon Supply</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Odisha possesses 35% of India&apos;s quartz and quartzite reserves estimated at 800 million tonnes providing domestic feedstock for metallurgical-grade silicon production replacing 90% of current silicon anode precursor imports from China valued at &#8377;3,500 Cr annually. Geological Survey of India identifying 12 new quartz deposits in Sundargarh, Koraput and Kalahandi districts with mining leases auctioned by Odisha Mining Corporation under National Critical Mineral Mission. Bhubaneswar silicon processing hub converting quartz to battery-grade silicon micropowder at &#8377;1,200 per kg versus &#8377;2,800 per kg for imported material reducing Indian silicon anode production cost by 40% and securing supply chain for 30 GWh annual cell production target by 2030.</p>
        </CardContent></Card>
        <Card className="sil-insight-card border-l-4 border-l-teal-800"><CardContent className="p-5">
          <h4 className="sil-insight-title font-semibold text-base">Rice Husk Bio-Silica: &#8377;1,800 Cr Circular Opportunity</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India generating 180 million tonnes of rice husk annually containing 15-20% amorphous silica representing 27 million tonnes of potential battery-grade silicon feedstock at near-zero raw material cost. IIT Guwahati and IIT Kharagpur developing magnesiothermic reduction process converting rice husk bio-silica into nano-silicon at 60% lower energy consumption than conventional carbothermic silicon smelting. Assam, Punjab and Andhra Pradesh rice husk collection networks processing 50,000 TPA rice husk into 3,000 TPA nano-silicon anode material creating &#8377;1,800 Cr circular economy opportunity under National Bio-Energy Programme and Agriculture Waste Management Rules 2025 eliminating rice husk burning while producing EV battery materials.</p>
        </CardContent></Card>
        <Card className="sil-insight-card border-l-4 border-l-teal-800"><CardContent className="p-5">
          <h4 className="sil-insight-title font-semibold text-base">Silicon Volume Expansion: 85% First-Cycle Loss Challenge</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Silicon anodes face fundamental challenge of 300% volume expansion during lithiation causing particle pulverisation, SEI instability and rapid capacity fade limiting commercial cycle life to 500-1000 cycles versus 5000 for graphite. Indian research institutions developing three solutions: nano-structuring reducing particle size below critical fracture threshold at IISc Bengaluru, carbon pre-lithiation compensating first-cycle loss at IIT Bombay, and solid electrolyte interface stabilisation using artificial SEI coatings at ARCI Hyderabad. Department of Science and Technology allocating &#8377;450 Cr under Mission Innovation Clean Energy Materials programme for silicon anode degradation research targeting 2000-cycle commercial silicon anode cells by 2027 for Indian EV and defence applications.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
