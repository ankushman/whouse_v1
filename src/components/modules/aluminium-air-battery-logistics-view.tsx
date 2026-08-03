'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface AALRecord {
  id: string; projectId: string; city: string; operator: string; batteryType: string
  capacityKWh: number; investmentCr: number; energyDensity: number; cycleLife: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#1e3a5f', '#1e40af', '#1d4ed8', '#2563eb', '#3b82f6', '#172554', '#0f172a', '#0c1e3a']

const records: AALRecord[] = [
  { id: 'AAL-0001', projectId: 'AAL-001', city: 'Bengaluru', operator: 'Bengaluru Al-Air Drone Works', batteryType: 'Al-Air Drone 500Wh/kg',
    capacityKWh: 45000, investmentCr: 320, energyDensity: 500, cycleLife: 200, status: 'Delivered', priority: 'Critical', origin: 'Odisha Al Ingot Supply', destination: 'Bengaluru Defence Drone Hub', shipDate: '2025-05-03', transitDays: 2, state: 'Karnataka',
    remarks: 'Aluminium-air drone battery production facility at Bengaluru manufacturing 45,000 kWh annually of 500 Wh/kg aluminium-air batteries for military and commercial UAV applications using aluminium anode and ambient air cathode. &#8377;320 Cr plant supplies DRDO-developed Nishant and Tapas UAV platforms and IdeaForge commercial drones for Indian Army reconnaissance and paramilitary border surveillance. Aluminium-air chemistry providing 8x energy density advantage over lithium-polymer batteries enabling 4-hour drone flight endurance versus 30 minutes for equivalent weight lithium packs under Make in India defence drone production programme targeting &#8377;12,000 Cr domestic military drone market by 2028.' },
  { id: 'AAL-0002', projectId: 'AAL-002', city: 'Hyderabad', operator: 'Telangana Al-Air Telecom', batteryType: 'Al-Air Telecom Backup 400Wh/kg',
    capacityKWh: 60000, investmentCr: 380, energyDensity: 400, cycleLife: 150, status: 'Delivered', priority: 'High', origin: 'TN Aluminium Foil', destination: 'Hyderabad Telecom Hub', shipDate: '2025-05-07', transitDays: 1, state: 'Telangana',
    remarks: 'Aluminium-air telecom backup battery facility at Hyderabad producing 60,000 kWh of 400 Wh/kg aluminium-air primary batteries for telecom tower backup power during grid outages and natural disasters. &#8377;380 Cr plant supplies Jio, Airtel and BSNL telecom infrastructure across Telangana, Andhra Pradesh and Maharashtra replacing lead-acid and lithium-ion tower batteries. Aluminium-air primary batteries providing 72-hour backup versus 8-hour lithium runtime with zero self-discharge and 20-year shelf life ideal for disaster resilience under Department of Telecom National Telecom Backup Power Mandate 2025 requiring all tower sites to maintain minimum 48-hour backup capability for emergency communications.' },
  { id: 'AAL-0003', projectId: 'AAL-003', city: 'Mumbai', operator: 'Maharashtra Al-Air Marine', batteryType: 'Al-Air Marine Vessel 350Wh/kg',
    capacityKWh: 85000, investmentCr: 420, energyDensity: 350, cycleLife: 180, status: 'In Transit', priority: 'High', origin: 'Jharkhand Al Plate', destination: 'Mumbai Port Terminal', shipDate: '2025-05-12', transitDays: 2, state: 'Maharashtra',
    remarks: 'Aluminium-air marine vessel battery plant en route to Mumbai producing 85,000 kWh of 350 Wh/kg aluminium-air batteries for coastal cargo vessel and fishing boat electrification replacing diesel engines on 200 vessels. &#8377;420 Cr facility serves Mumbai Port Trust and Fishing Boat Operators Association providing 12-hour vessel range at 80% lower fuel cost than diesel with mechanical aluminium anode replacement at port. Marine-grade Al-air batteries certified by Indian Register of Shipping for seawater operation eliminating fire and explosion risk inherent in lithium marine batteries under DG Shipping Green Vessel Incentive Programme 2025 providing 30% subsidy on Al-air vessel conversion cost.' },
  { id: 'AAL-0004', projectId: 'AAL-004', city: 'Kolkata', operator: 'West Bengal Al-Air Rail', batteryType: 'Al-Air Rail Backup 300Wh/kg',
    capacityKWh: 120000, investmentCr: 520, energyDensity: 300, cycleLife: 100, status: 'Delivered', priority: 'Critical', origin: 'Odisha Al Ingot Supply', destination: 'Kolkata Railway Depot', shipDate: '2025-05-01', transitDays: 2, state: 'West Bengal',
    remarks: 'Aluminium-air rail backup battery facility at Kolkata producing 120,000 kWh of 300 Wh/kg Al-air batteries for Indian Railways emergency power and last-mile connectivity on non-electrified branch lines. &#8377;520 Cr plant supplies Indian Railways Kolkata division and Eastern Railway 150 diesel locomotive replacements with Al-air battery railcars for 200 km branch line operation. Aluminium-air railcars requiring only aluminium anode cartridge swap at stations versus 4-hour lithium charging enabling 15-minute turnaround and 2,000 km daily range per anode cartridge under Indian Railways Mission 100% Electrification extension programme targeting zero-diesel branch line operation by 2030.' },
  { id: 'AAL-0005', projectId: 'AAL-005', city: 'Chennai', operator: 'TN Al-Air Defence', batteryType: 'Al-Air Military 450Wh/kg',
    capacityKWh: 35000, investmentCr: 280, energyDensity: 450, cycleLife: 120, status: 'Delivered', priority: 'Critical', origin: 'TN Aluminium Smelter', destination: 'Chennai Defence Corridor', shipDate: '2025-05-05', transitDays: 1, state: 'Tamil Nadu',
    remarks: 'Aluminium-air military-grade battery plant at Chennai producing 35,000 kWh of 450 Wh/kg Al-air batteries for Indian Army soldier portable power, man-pack radio systems and battlefield communication equipment. &#8377;280 Cr facility supplies Bharat Electronics and BEL-O-FB joint venture for 50,000 man-pack radio battery systems replacing lithium batteries that fail in desert heat above 50&#176;C. Al-air chemistry operating from -20&#176;C to 70&#176;C with zero thermal runaway risk and water-activated saltwater electrolyte option for jungle and marine operations under Indian Army Tactical Battery Modernisation Programme targeting 200,000 Al-air military battery units by 2028.' },
  { id: 'AAL-0006', projectId: 'AAL-006', city: 'Gandhinagar', operator: 'Gujarat Al-Air Emergency', batteryType: 'Al-Air Emergency 380Wh/kg',
    capacityKWh: 25000, investmentCr: 195, energyDensity: 380, cycleLife: 80, status: 'Delivered', priority: 'Medium', origin: 'Gujarat Al Extrusion', destination: 'Gandhinagar Emergency Hub', shipDate: '2025-05-04', transitDays: 1, state: 'Gujarat',
    remarks: 'Aluminium-air emergency power battery facility at Gandhinagar producing 25,000 kWh of 380 Wh/kg Al-air primary batteries for disaster relief, emergency medical equipment and field hospital power systems. &#8377;195 Cr plant supplies National Disaster Response Force 200 emergency power packs and Gujarat Emergency Management Authority field hospitals with 72-hour battery runtime. Water-activated Al-air battery variant enabling instant activation by adding seawater providing critical power during Gujarat cyclone and flood relief operations under National Disaster Management Authority Emergency Power Reserve Programme 2025 with 20-year shelf life requiring zero maintenance until deployment.' },
  { id: 'AAL-0007', projectId: 'AAL-007', city: 'Lucknow', operator: 'UP Al-Air Rural', batteryType: 'Al-Air Village 320Wh/kg',
    capacityKWh: 40000, investmentCr: 260, energyDensity: 320, cycleLife: 90, status: 'Delivered', priority: 'Medium', origin: 'Odisha Al Ingot Supply', destination: 'Lucknow Rural Hub', shipDate: '2025-05-08', transitDays: 2, state: 'Uttar Pradesh',
    remarks: 'Aluminium-air rural energy battery plant at Lucknow producing 40,000 kWh of 320 Wh/kg Al-air batteries for off-grid village electrification and agricultural pump power in Uttar Pradesh serving 5,000 unelectrified households. &#8377;260 Cr facility provides 24-hour household power through aluminium anode distribution network with weekly anode swap at village level replacing diesel generators and kerosene lamps. Aluminium-air village systems costing &#8377;15,000 per household with &#8377;500 monthly anode replacement cost versus &#8377;2,500 monthly diesel expenditure under UP Rural Electrification and Clean Energy Access Programme targeting 100,000 Al-air powered households by 2028.' },
  { id: 'AAL-0008', projectId: 'AAL-008', city: 'Jaipur', operator: 'Rajasthan Al-Air Mining', batteryType: 'Al-Air Mining 280Wh/kg',
    capacityKWh: 55000, investmentCr: 340, energyDensity: 280, cycleLife: 110, status: 'Delivered', priority: 'High', origin: 'Rajasthan Al Smelter', destination: 'Jaipur Mining Hub', shipDate: '2025-05-06', transitDays: 1, state: 'Rajasthan',
    remarks: 'Aluminium-air mining battery facility at Jaipur producing 55,000 kWh of 280 Wh/kg intrinsically safe mining batteries for underground coal and metal mine locomotives, ventilation fans and emergency power systems. &#8377;340 Cr plant supplies Coal India underground mines in Jharkhand and Rajasthan with DGMS-certified Al-air batteries meeting intrinsic safety standards for gassy underground environments. Aluminium-air chemistry eliminates methane ignition risk from thermal runaway providing 100% safe underground battery operation replacing 4,000 lead-acid mine locomotive batteries under Coal India Mine Safety and Battery Modernisation Programme 2025 targeting zero battery-related mine incidents.' },
  { id: 'AAL-0009', projectId: 'AAL-009', city: 'Bhubaneswar', operator: 'Odisha Al-Air Fertiliser', batteryType: 'Al-Air Alumina Co-Product',
    capacityKWh: 30000, investmentCr: 210, energyDensity: 260, cycleLife: 60, status: 'In Transit', priority: 'Medium', origin: 'Odisha Bauxite Mines', destination: 'Bhubaneswar Al Terminal', shipDate: '2025-05-14', transitDays: 2, state: 'Odisha',
    remarks: 'Aluminium-air battery with alumina co-product recovery plant en route to Bhubaneswar producing 30,000 kWh of Al-air batteries with integrated aluminium hydroxide recovery from spent anodes. &#8377;210 Cr facility converts spent aluminium anodes into battery-grade aluminium hydroxide for NALCO alumina refinery creating circular economy value chain. Each kWh Al-air battery generates 3.5 kg of recoverable aluminium hydroxide worth &#8377;175 reducing net battery cost by 40% through material credit. Bhubaneswar circular Al-air hub integrating bauxite mining, aluminium production, battery manufacturing and alumina recovery under Odisha Aluminium and Battery Circular Economy Policy 2025.' },
  { id: 'AAL-0010', projectId: 'AAL-010', city: 'Pune', operator: 'Maharashtra Al-Air EV', batteryType: 'Al-Air EV Range Extender 420Wh/kg',
    capacityKWh: 70000, investmentCr: 450, energyDensity: 420, cycleLife: 160, status: 'Delivered', priority: 'Critical', origin: 'Jharkhand Al Plate', destination: 'Pune EV Manufacturing', shipDate: '2025-05-02', transitDays: 1, state: 'Maharashtra',
    remarks: 'Aluminium-air EV range extender battery plant at Pune producing 70,000 kWh of 420 Wh/kg Al-air range extender batteries for electric vehicle long-range applications enabling 1,000 km single-charge range for commercial vehicles. &#8377;450 Cr facility serves Tata Motors, Mahindra and Force Motors electric truck and bus programme providing mechanical aluminium anode swap at highway stations enabling 5-minute refuelling versus 4-hour lithium charging. Al-air range extenders used as secondary battery in hybrid EV architecture with compact lithium primary battery for regenerative braking and Al-air for highway cruising under FAME III Heavy Vehicle Electrification Programme targeting 100,000 Al-air extended-range EVs by 2028.' },
  { id: 'AAL-0011', projectId: 'AAL-011', city: 'Kochi', operator: 'Kerala Al-Air Fishing', batteryType: 'Al-Air Fishing Boat 300Wh/kg',
    capacityKWh: 20000, investmentCr: 155, energyDensity: 300, cycleLife: 130, status: 'In Transit', priority: 'Medium', origin: 'TN Aluminium Smelter', destination: 'Kochi Fishing Harbour', shipDate: '2025-05-11', transitDays: 2, state: 'Kerala',
    remarks: 'Aluminium-air fishing boat battery plant en route to Kochi producing 20,000 kWh of 300 Wh/kg saltwater-activated Al-air batteries for traditional deep-sea fishing vessels operating from Kerala coast. &#8377;155 Cr facility supplies Kochi, Kollam and Alappuzha fishing harbours with seawater-activated batteries that require no charging infrastructure and provide 8-hour fishing range per aluminium cartridge. Saltwater-activated Al-air chemistry using seawater as natural electrolyte eliminating battery maintenance and providing instant power activation by lowering electrodes into sea under Kerala Matsya Keralam fishing vessel electrification programme converting 15,000 traditional fishing boats by 2028.' },
  { id: 'AAL-0012', projectId: 'AAL-012', city: 'Guwahati', operator: 'Assam Al-Air Remote', batteryType: 'Al-Air Remote Area 340Wh/kg',
    capacityKWh: 18000, investmentCr: 135, energyDensity: 340, cycleLife: 70, status: 'Delivered', priority: 'Medium', origin: 'Odisha Al Ingot Supply', destination: 'Guwahati NE Distribution', shipDate: '2025-05-09', transitDays: 5, state: 'Assam',
    remarks: 'Aluminium-air remote area power battery plant at Guwahati producing 18,000 kWh of 340 Wh/kg Al-air batteries for off-grid power supply in remote Northeast India villages, border outposts and island communities. &#8377;135 Cr facility supplies Assam, Arunachal Pradesh, Meghalaya and Andaman Islands off-grid installations with primary batteries requiring no charging infrastructure. 20-year shelf life and zero self-discharge enabling strategic stockpiling at remote locations with annual aluminium cartridge air-dropping for Border Roads Organisation and ITBP forward positions under North East Special Infrastructure Development Programme and Ministry of Home Affairs Border Area Energy Security Programme 2025.' },
  { id: 'AAL-0013', projectId: 'AAL-013', city: 'Visakhapatnam', operator: 'AP Al-Air Naval', batteryType: 'Al-Air Naval 360Wh/kg',
    capacityKWh: 28000, investmentCr: 240, energyDensity: 360, cycleLife: 140, status: 'Delivered', priority: 'High', origin: 'TN Aluminium Smelter', destination: 'Vizag Naval Base', shipDate: '2025-05-10', transitDays: 2, state: 'Andhra Pradesh',
    remarks: 'Aluminium-air naval battery facility at Visakhapatnam producing 28,000 kWh of 360 Wh/kg seawater-activated Al-air batteries for Indian Navy submarine auxiliary power and surface vessel emergency systems. &#8377;240 Cr plant supplies Visakhapatnam Shipyard and Indian Navy Eastern Naval Command with submarine battery modules providing 30-day submerged endurance for Sindhughosh-class submarines. Seawater-activated Al-air chemistry using ocean water as natural electrolyte eliminating electrolyte storage requirement on submarines and providing instant emergency power activation under Indian Navy Underwater Power Modernisation Programme targeting Al-air auxiliary systems on 12 submarines and 20 surface vessels by 2028.' },
  { id: 'AAL-0014', projectId: 'AAL-014', city: 'Indore', operator: 'MP Al-Air EV Two-Wheeler', batteryType: 'Al-Air 2W Swap 480Wh/kg',
    capacityKWh: 50000, investmentCr: 350, energyDensity: 480, cycleLife: 200, status: 'Delayed', priority: 'High', origin: 'Odisha Al Ingot Supply', destination: 'Indore EV Swap Hub', shipDate: '2025-05-16', transitDays: 2, state: 'Madhya Pradesh',
    remarks: 'Aluminium-air two-wheeler swap battery facility at Indore producing 50,000 kWh of 480 Wh/kg Al-air batteries for electric two-wheeler aluminium anode swap network across Madhya Pradesh and Chhattisgarh. &#8377;350 Cr plant operates 500 battery swap stations enabling 2-minute mechanical anode replacement providing 200 km range per swap for 50,000 electric two-wheelers. Anode swap cost of &#8377;45 per 200 km versus &#8377;120 electricity charging cost for equivalent lithium range creating compelling economic proposition under MP EV and Swap Battery Policy 2025 with Indore hub serving as template for national Al-air swap network expansion.' },
]

export default function AluminiumAirBatteryLogisticsView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof AALRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'batteryType', label: 'Battery Type', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.batteryType] = (m[r.batteryType] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Capacity', value: `${filtered.reduce((a: number, r) => a + r.capacityKWh, 0).toLocaleString()} kWh` },
    { label: 'Avg Energy Density', value: `${(filtered.reduce((a: number, r) => a + r.energyDensity, 0) / Math.max(1, filtered.length)).toFixed(0)} Wh/kg` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Avg Cycle Life', value: `${(filtered.reduce((a: number, r) => a + r.cycleLife, 0) / Math.max(1, filtered.length)).toFixed(0)}` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: AALRecord) => string, val: (r: AALRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.capacityKWh)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const typeBar = grp(r => r.batteryType, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const densityData = filtered.map(r => ({ name: r.batteryType.split(' ').slice(0, 2).join(' '), value: r.energyDensity }))
    const lm = filtered.reduce((a: Record<string, { capacityKWh: number; investmentCr: number }>, r) => {
      if (!a[r.state]) a[r.state] = { capacityKWh: 0, investmentCr: 0 }
      a[r.state].capacityKWh += r.capacityKWh; a[r.state].investmentCr += r.investmentCr; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, capacityKWh: v.capacityKWh, investmentCr: v.investmentCr }))
    return { barState, pieState, statusPie, typeBar, priorityPie, totalInvest, densityData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="aal-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Aluminium-Air Battery' }]} />
      <PageHeader title="Aluminium-Air Battery Logistics" description="Track aluminium-air battery supply chains, metal-air cell manufacturing logistics, aluminium anode distribution networks, and India's post-lithium energy storage for defence, marine, telecom, EV and emergency power applications" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="aal-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t as 'dashboard' | 'registry' | 'analytics' | 'insights')} className={`aal-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-blue-900 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="aal-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="aal-kpi-card"><CardContent className="p-4"><p className="aal-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="aal-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="aal-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="aal-chart-title text-sm">Battery Capacity (kWh) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#1e3a5f" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="aal-chart-title text-sm">Facilities by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="aal-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="aal-chart-title text-sm">Energy Density (Wh/kg) by Battery Type</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.densityData}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} domain={[0, 550]} /><Tooltip /><Bar dataKey="value" fill="#1e40af" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="aal-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="aal-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`aal-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-blue-900'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.batteryType} | {r.state}</p>
              <p className="text-xs mt-1">{r.capacityKWh.toLocaleString()} kWh | {r.energyDensity} Wh/kg | {r.cycleLife} cycles | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="aal-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="aal-chart-title text-sm">Capacity vs Investment by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="capacityKWh" stroke="#1e3a5f" name="Capacity kWh" /><Line yAxisId="right" type="monotone" dataKey="investmentCr" stroke="#3b82f6" name="Investment &#8377; Cr" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="aal-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#172554" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="aal-chart-title text-sm">Battery Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.typeBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#1e40af" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="aal-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="aal-insights grid grid-cols-2 gap-4">
        <Card className="aal-insight-card border-l-4 border-l-blue-900"><CardContent className="p-5">
          <h4 className="aal-insight-title font-semibold text-base">India&apos;s &#8377;6,500 Cr Aluminium-Air Battery Market</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s aluminium-air battery market projected to reach &#8377;6,500 Cr by 2028 from &#8377;200 Cr in 2024 growing at 130% CAGR driven by defence modernisation, marine electrification and off-grid energy access programmes. Aluminium-air batteries providing 8x energy density versus lithium-ion at 40% lower cost per kWh with abundant domestic aluminium supply from NALCO, Hindalco and Vedanta smelters producing 4.1 million tonnes annually. Ministry of Defence designating aluminium-air as strategic battery technology for military UAVs, soldier portable power and submarine applications with &#8377;3,000 Cr defence procurement allocation under Make in India defence production policy targeting 100% domestic Al-air battery sourcing by 2028.</p>
        </CardContent></Card>
        <Card className="aal-insight-card border-l-4 border-l-blue-900"><CardContent className="p-5">
          <h4 className="aal-insight-title font-semibold text-base">Aluminium Anode Swap: 5-Minute EV Refuelling</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Aluminium-air battery mechanical anode swap enables 5-minute EV refuelling comparable to petrol/diesel filling versus 4-8 hour lithium-ion DC fast charging. Each aluminium anode cartridge weighing 12 kg provides 200 km electric vehicle range with swap cost of &#8377;450 versus &#8377;600 for equivalent diesel fuel. Maharashtra and Madhya Pradesh piloting 500-station Al-air swap networks for electric two-wheelers, three-wheelers and commercial vehicles under NITI Aayog Alternative Fuel Infrastructure Programme with anode swap infrastructure costing 80% less than lithium fast charging stations requiring no grid connection upgrades at swap stations.</p>
        </CardContent></Card>
        <Card className="aal-insight-card border-l-4 border-l-blue-900"><CardContent className="p-5">
          <h4 className="aal-insight-title font-semibold text-base">Seawater-Activated: Zero Infrastructure Naval Power</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Seawater-activated aluminium-air batteries using ocean water as natural electrolyte eliminating electrolyte storage, manufacturing and maintenance requirements for naval and marine applications. Indian Navy and Coast Guard deploying seawater Al-air batteries on 15 submarines and 40 surface vessels providing 30-day submerged endurance and emergency backup power with ocean water as freely available electrolyte. Cochin Shipyard and Mazagon Dock integrating Al-air systems into 12 new construction vessels under Indian Navy Green Fleet Programme 2025 with seawater-activated chemistry reducing naval battery logistics by 90% eliminating electrolyte supply chain dependency.</p>
        </CardContent></Card>
        <Card className="aal-insight-card border-l-4 border-l-blue-900"><CardContent className="p-5">
          <h4 className="aal-insight-title font-semibold text-base">Circular Economy: Alumina Recovery from Spent Anodes</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Spent aluminium-air battery anodes generating aluminium hydroxide recoverable as alumina feedstock for aluminium smelting creating circular economy value chain reducing effective battery cost by 40%. NALCO Odisha developing aluminium hydroxide recovery process converting spent Al-air anodes into calcined alumina for aluminium smelting at 99.5% recovery efficiency. Each MWh of Al-air battery operation generating 3.5 tonnes of recoverable aluminium hydroxide worth &#8377;175,000 creating &#8377;2,500 Cr annual alumina recovery industry from India&apos;s projected 5 GWh Al-air battery deployment by 2030 under Ministry of Mines Circular Economy in Battery Materials Programme 2025.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
