'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface SSCRecord {
  id: string; projectId: string; city: string; operator: string; coolerType: string
  capacityTR: number; investmentCr: number; cop: number; lifespan: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#1e3a5f', '#1e40af', '#1d4ed8', '#2563eb', '#3b82f6', '#172554', '#1e1b4b', '#312e81']

const records: SSCRecord[] = [
  { id: 'SSC-0001', projectId: 'SSC-001', city: 'Bengaluru', operator: 'BESS Technologies IT Cooling', coolerType: 'Peltier Thermoelectric 500TR',
    capacityTR: 500, investmentCr: 420, cop: 3.2, lifespan: 15, status: 'Delivered', priority: 'Critical', origin: 'BESS Electronic City', destination: 'Bengaluru Data Center Belt', shipDate: '2025-05-05', transitDays: 1, state: 'Karnataka',
    remarks: 'Solid-state Peltier thermoelectric 500TR cooling system for Bengaluru data center belt at Electronic City. Eliminates compressor, refrigerant gas and moving parts achieving zero Global Warming Potential. &#8377;420 Cr installation serves 12 hyperscale data centers with 50 MW IT load cooling at 3.2 COP efficiency. Semiconductor-grade Peltier modules from IISC Bangalore research transfer enable 24/7 precision cooling at &#8377;0.84 lakh per TR versus &#8377;1.2 lakh per TR for conventional VRF systems under Karnataka State Data Center Policy 2025.' },
  { id: 'SSC-0002', projectId: 'SSC-002', city: 'Mumbai', operator: 'Tata Solid-State Pharma Cooling', coolerType: 'Magnetic Caloric 200TR',
    capacityTR: 200, investmentCr: 280, cop: 4.5, lifespan: 20, status: 'Delivered', priority: 'Critical', origin: 'Tata Steel Research', destination: 'Mumbai Pharma Corridor', shipDate: '2025-05-10', transitDays: 2, state: 'Maharashtra',
    remarks: 'Magnetic caloric solid-state cooling 200TR for Mumbai pharmaceutical corridor cold chain warehouses. Gadolinium-based magnetocaloric effect achieves 4.5 COP without CFC, HCFC or HFC refrigerants banned under Montreal Protocol Kigali Amendment. &#8377;280 Cr deployment by Tata Projects serves 8 pharmaceutical companies including Serum Institute and Cipla for vaccine and biologic cold storage at 2-8&#176;C with zero refrigerant leakage risk and 99.97% uptime guarantee for WHO-GMP compliant storage facilities.' },
  { id: 'SSC-0003', projectId: 'SSC-003', city: 'Hyderabad', operator: 'Hyderabad Vaccine Cold Chain', coolerType: 'Thermoacoustic 150TR',
    capacityTR: 150, investmentCr: 215, cop: 2.8, lifespan: 12, status: 'Delivered', priority: 'High', origin: 'Hyderabad Genome Valley', destination: 'Hyderabad Pharma Hub', shipDate: '2025-05-02', transitDays: 1, state: 'Telangana',
    remarks: 'Thermoacoustic solid-state 150TR cooling for Hyderabad Genome Valley vaccine cold chain facilities. Sound-wave-driven heat pumping with no moving parts achieving ultra-reliable cooling for Biological E and Bharat Biotech vaccine production. &#8377;215 Cr installation provides 150TR of precision cooling at 2-8&#176;C with 2.8 COP using inert helium as working gas. Thermoacoustic technology from DRDL DRDO defence lab transfer enables maintenance-free operation for 12 years ideal for pharmaceutical clean room cooling with zero vibration disturbance.' },
  { id: 'SSC-0004', projectId: 'SSC-004', city: 'Pune', operator: 'Mahindra EV Solid-State Cabin', coolerType: 'Peltier Cabin 2kW Unit',
    capacityTR: 300, investmentCr: 195, cop: 3.5, lifespan: 15, status: 'In Transit', priority: 'High', origin: 'Mahindra Research Valley', destination: 'Pune EV Assembly', shipDate: '2025-05-15', transitDays: 2, state: 'Maharashtra',
    remarks: 'Solid-state Peltier cabin cooling 2kW units en route to Mahindra EV assembly at Chakan Pune. 300 TR equivalent capacity producing compact thermoelectric air conditioners for XUV400 Electric and upcoming Mahindra BE electric SUVs. &#8377;195 Cr contract replaces traditional compressor-based EV AC that consumes 4 kW from battery reducing cabin cooling energy draw by 50% and extending EV range by 25 km per charge. Solid-state AC weighs 40% less than compressor units critical for vehicle weight reduction meeting AIS-045 automotive standards.' },
  { id: 'SSC-0005', projectId: 'SSC-005', city: 'Chennai', operator: 'TCS Data Center Cooling', coolerType: 'Elastocaloric 400TR',
    capacityTR: 400, investmentCr: 360, cop: 5.2, lifespan: 18, status: 'Delivered', priority: 'Critical', origin: 'TCS Siruseri SIPCOT', destination: 'Chennai IT Corridor', shipDate: '2025-04-28', transitDays: 2, state: 'Tamil Nadu',
    remarks: 'Elastocaloric solid-state 400TR cooling at TCS Siruseri SIPCOT IT park data center. Nickel-titanium shape memory alloy strips generating cooling through superelastic stress cycling achieving industry-leading 5.2 COP efficiency. &#8377;360 Cr installation by L&amp;T Technology Services serves TCS, Infosys and Wipro hyperscale data centers with 40 MW combined IT load. Elastocaloric technology developed at IIT Madras with L&amp;T joint venture produces zero-refrigerant cooling that is 30% more efficient than conventional centrifugal chillers for India&apos;s $250 billion IT services sector.' },
  { id: 'SSC-0006', projectId: 'SSC-006', city: 'Gandhinagar', operator: 'Reliance Green Cold Storage', coolerType: 'Peltier Cold Room 100TR',
    capacityTR: 180, investmentCr: 148, cop: 3.0, lifespan: 14, status: 'Delivered', priority: 'High', origin: 'Reliance Jamnagar', destination: 'Gandhinagar Food Park', shipDate: '2025-05-08', transitDays: 1, state: 'Gujarat',
    remarks: 'Solid-state Peltier cold room 100TR at Gandhinagar food park for Reliance Retail fresh food supply chain. Modular thermoelectric cooling units for -5&#176;C to 5&#176;C cold rooms serving 200 Reliance Fresh and Smart stores across Gujarat. &#8377;148 Cr deployment eliminates HCFC-22 refrigerant phase-out compliance issues for 180 TR cold storage capacity. Peltier modules from indigenous silicon carbide semiconductor production at Reliance Dhirubhai Ambani semiconductor fab reducing import dependency on Chinese thermoelectric modules by 80%.' },
  { id: 'SSC-0007', projectId: 'SSC-007', city: 'Kolkata', operator: 'WB Cold Chain Logistics', coolerType: 'Thermoacoustic Transport 50TR',
    capacityTR: 120, investmentCr: 165, cop: 2.5, lifespan: 12, status: 'Delivered', priority: 'Medium', origin: 'Kolkata Cold Storage Hub', destination: 'Eastern India Ports', shipDate: '2025-04-25', transitDays: 2, state: 'West Bengal',
    remarks: 'Thermoacoustic solid-state transport refrigeration 50TR for Kolkata cold chain logistics serving Haldia and Kolkata Port frozen food export. 120 TR capacity across 15 reefer containers and 6 cold chain trucks operating on sound-wave cooling eliminating diesel generator refrigeration units. &#8377;165 Cr investment by WB Cold Chain Development Corporation provides noiseless vibration-free transport refrigeration for 50,000 tonnes of frozen shrimp export annually to EU and Japan meeting FSSAI and EU food safety temperature logging requirements for marine export cold chain compliance.' },
  { id: 'SSC-0008', projectId: 'SSC-008', city: 'Noida', operator: 'UP Vaccine Storage Network', coolerType: 'Magnetic Caloric 80TR',
    capacityTR: 100, investmentCr: 130, cop: 4.0, lifespan: 20, status: 'Delivered', priority: 'High', origin: 'Noida Pharma Zone', destination: 'UP District Hospitals', shipDate: '2025-05-12', transitDays: 1, state: 'Uttar Pradesh',
    remarks: 'Magnetic caloric 80TR solid-state cooling units for Uttar Pradesh district hospital vaccine storage network. 100 TR capacity across 40 district-level vaccine cold rooms maintaining 2-8&#176;C for Universal Immunization Programme. &#8377;130 Cr deployment under National Health Mission eliminates fluorinated greenhouse gas refrigerants from 40 government vaccine stores. Zero-vibration magnetic cooling preserves vaccine protein structure integrity extending shelf life by 15% for BCG, DPT and OPV vaccines serving 85 million annual immunization sessions across Uttar Pradesh.' },
  { id: 'SSC-0009', projectId: 'SSC-009', city: 'Jaipur', operator: 'Rajasthan Desert Cooling', coolerType: 'Peltier Desert 200TR',
    capacityTR: 220, investmentCr: 188, cop: 3.8, lifespan: 14, status: 'Delayed', priority: 'Medium', origin: 'Jaipur Industrial Area', destination: 'Rajasthan Solar Cooling Hub', shipDate: '2025-04-15', transitDays: 5, state: 'Rajasthan',
    remarks: 'Peltier desert-rated solid-state cooling 200TR delayed by high-ambient temperature testing at Jaipur Solar Cooling Hub. 220 TR capacity designed for 50&#176;C desert ambient conditions in Rajasthan with enhanced Peltier module thermal management. &#8377;188 Cr project stalled pending MNRE certification for solar-direct thermoelectric cooling systems that operate without inverters. Once commissioned, will serve Jaipur International Airport terminal cooling and Jodhpur railway station air conditioning reducing peak HVAC electrical load by 35% during summer months when Rajasthan grid faces 4,000 MW deficit.' },
  { id: 'SSC-0010', projectId: 'SSC-010', city: 'Kochi', operator: 'Kerala Marine Cooling', coolerType: 'Thermoelectric Marine 100TR',
    capacityTR: 140, investmentCr: 158, cop: 3.4, lifespan: 15, status: 'Delivered', priority: 'Medium', origin: 'Cochin Shipyard', destination: 'Kerala Fishing Fleet', shipDate: '2025-05-01', transitDays: 1, state: 'Kerala',
    remarks: 'Thermoelectric solid-state marine cooling 100TR for Kerala fishing fleet vessel cold storage at Cochin Shipyard. 140 TR capacity across 70 fishing vessels providing on-board fish hold cooling at -18&#176;C without compressor-based refrigeration vulnerable to saltwater corrosion. &#8377;158 Cr installation under PM Matsya Sampada replaces R-134a marine refrigeration systems with solid-state Peltier cooling modules rated for 15-year marine duty cycle. Kerala&apos;s 200,000 tonne annual marine catch sees 12% post-harvest loss reduced to 3% through reliable solid-state on-board chilling extending fishing vessel stay at sea from 5 to 12 days.' },
  { id: 'SSC-0011', projectId: 'SSC-011', city: 'Bhopal', operator: 'MP Agricultural Cold Storage', coolerType: 'Peltier Farm Gate 30TR',
    capacityTR: 90, investmentCr: 85, cop: 2.9, lifespan: 12, status: 'Processing', priority: 'Low', origin: 'MP Mandi Network', destination: 'MP Farm Cold Chain', shipDate: '2025-05-18', transitDays: 2, state: 'Madhya Pradesh',
    remarks: 'Peltier farm-gate solid-state cold storage 30TR for Madhya Pradesh agricultural mandi network. 90 TR capacity across 15 modular cold storage units at mandi yards for onion, tomato and potato storage eliminating 40% post-harvest losses. &#8377;85 Cr project under MP Agriculture Infrastructure Fund provides solar-powered thermoelectric cold rooms at &#8377;5 lakh per unit affordable for farmer producer organizations. Each 30TR unit preserves 50 tonnes of produce for 60 days extending market window and enabling farmers to sell during price peaks rather than distress sales at harvest time under PM-AASHA price support scheme.' },
  { id: 'SSC-0012', projectId: 'SSC-012', city: 'Guwahati', operator: 'NE Medical Cooling', coolerType: 'Magnetic Caloric 60TR',
    capacityTR: 80, investmentCr: 112, cop: 4.2, lifespan: 20, status: 'Delivered', priority: 'Medium', origin: 'Guwahati Medical College', destination: 'NE Hospital Network', shipDate: '2025-05-22', transitDays: 3, state: 'Assam',
    remarks: 'Magnetic caloric solid-state 60TR cooling for northeast India hospital network blood bank and organ preservation. 80 TR capacity across 20 medical facilities in Assam, Meghalaya and Manipur maintaining blood bank at 1-6&#176;C and organ transplant preservation at 0-4&#176;C. &#8377;112 Cr installation under Ayushman Bharat hospital infrastructure upgrade eliminates refrigerant gas dependency for critical medical cooling in NE states where grid power is unreliable. Magnetic cooling operates on 12V backup battery during power outages maintaining cold chain integrity for 48 hours without generator support.' },
  { id: 'SSC-0013', projectId: 'SSC-013', city: 'Bhubaneswar', operator: 'Odisha Ice Plant Network', coolerType: 'Thermoacoustic Ice 40TR',
    capacityTR: 110, investmentCr: 92, cop: 2.6, lifespan: 12, status: 'Delivered', priority: 'Low', origin: 'Odisha Fisheries Dept', destination: 'Coastal Ice Plant Network', shipDate: '2025-05-06', transitDays: 2, state: 'Odisha',
    remarks: 'Thermoacoustic solid-state ice plant 40TR for Odisha coastal fishing community ice plant network. 110 TR capacity producing 40 tonnes of ice per day across 8 coastal districts replacing diesel-powered ammonia refrigeration ice plants. &#8377;92 Cr investment by Odisha Fisheries and Animal Resources Department provides pollution-free ice production for 150,000 fishermen along 480 km coastline. Thermoacoustic ice plants reduce ice production cost from &#8377;250 per tonne using diesel-ammonia to &#8377;180 per tonne using solar-powered sound-wave cooling under NFDB blue revolution scheme.' },
  { id: 'SSC-0014', projectId: 'SSC-014', city: 'Chandigarh', operator: 'Tricity Smart Building HVAC', coolerType: 'Peltier HVAC 300TR',
    capacityTR: 350, investmentCr: 310, cop: 3.6, lifespan: 15, status: 'Delayed', priority: 'High', origin: 'Chandigarh IT Park', destination: 'Tricity Government Buildings', shipDate: '2025-04-20', transitDays: 3, state: 'Punjab',
    remarks: 'Peltier solid-state HVAC 300TR for Chandigarh Tricity smart government buildings delayed by UT administration tender re-evaluation. 350 TR capacity providing compressor-free air conditioning for Punjab and Haryana Secretariat, Chandigarh High Court and 15 government office buildings. &#8377;310 Cr smart building cooling project under Smart Cities Mission eliminates refrigerant handling certification requirements and annual gas top-up costs saving &#8377;12 Cr annually. Delayed pending revised DPR approval expected by Q3 2026 with BSERI energy efficiency rating of 5-star for solid-state HVAC performance.' },
]

export default function SolidStateCoolingLogisticsView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof SSCRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'coolerType', label: 'Cooler Type', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.coolerType] = (m[r.coolerType] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Capacity', value: `${filtered.reduce((a: number, r) => a + r.capacityTR, 0).toLocaleString()} TR` },
    { label: 'Avg COP', value: `${(filtered.reduce((a: number, r) => a + r.cop, 0) / Math.max(1, filtered.length)).toFixed(1)}` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Avg Lifespan', value: `${(filtered.reduce((a: number, r) => a + r.lifespan, 0) / Math.max(1, filtered.length)).toFixed(1)} yrs` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: SSCRecord) => string, val: (r: SSCRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.capacityTR)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const typeBar = grp(r => r.coolerType, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const copData = filtered.map(r => ({ name: r.coolerType.split(' ').slice(0, 2).join(' '), value: r.cop }))
    const lm = filtered.reduce((a: Record<string, { capacityTR: number; investmentCr: number }>, r) => {
      if (!a[r.state]) a[r.state] = { capacityTR: 0, investmentCr: 0 }
      a[r.state].capacityTR += r.capacityTR; a[r.state].investmentCr += r.investmentCr; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, capacityTR: v.capacityTR, investmentCr: v.investmentCr }))
    return { barState, pieState, statusPie, typeBar, priorityPie, totalInvest, copData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="ssc-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Solid-State Cooling' }]} />
      <PageHeader title="Solid-State Cooling Logistics" description="Track solid-state cooling supply chains, thermoelectric Peltier cooler logistics, magnetocaloric and thermoacoustic refrigeration distribution, and zero-refrigerant cooling systems for data centers, pharma, cold chain and EV cabin cooling across India" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="ssc-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`ssc-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-blue-950 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="ssc-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="ssc-kpi-card"><CardContent className="p-4"><p className="ssc-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="ssc-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="ssc-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="ssc-chart-title text-sm">Cooling Capacity (TR) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#1e3a5f" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="ssc-chart-title text-sm">Facilities by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="ssc-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="ssc-chart-title text-sm">COP Efficiency by Cooler Type</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.copData}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} domain={[2, 6]} /><Tooltip /><Bar dataKey="value" fill="#1e40af" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="ssc-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="ssc-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`ssc-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-blue-900'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.coolerType} | {r.state}</p>
              <p className="text-xs mt-1">{r.capacityTR} TR | {r.cop} COP | {r.lifespan}yr lifespan | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="ssc-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="ssc-chart-title text-sm">Capacity vs Investment by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="capacityTR" stroke="#1e3a5f" name="Capacity TR" /><Line yAxisId="right" type="monotone" dataKey="investmentCr" stroke="#3b82f6" name="Investment &#8377; Cr" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="ssc-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#172554" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="ssc-chart-title text-sm">Cooler Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.typeBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#1d4ed8" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="ssc-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="ssc-insights grid grid-cols-2 gap-4">
        <Card className="ssc-insight-card border-l-4 border-l-blue-900"><CardContent className="p-5">
          <h4 className="ssc-insight-title font-semibold text-base">India&apos;s HVAC Market: &#8377;1.2 Lakh Cr by 2028</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s HVAC and refrigeration market is projected to reach &#8377;1.2 lakh Cr by 2028 driven by rising temperatures, data center boom and cold chain expansion. Conventional compressor-based systems using HFC refrigerants have Global Warming Potential 1,000-4,000x higher than CO2. India&apos;s cooling demand growing at 12% annually with 300 million new AC units expected by 2030. Solid-state cooling eliminates refrigerant gases entirely positioning India as a global leader in sustainable refrigeration technology under India Cooling Action Plan targeting 30-40% reduction in cooling energy demand by 2038.</p>
        </CardContent></Card>
        <Card className="ssc-insight-card border-l-4 border-l-blue-900"><CardContent className="p-5">
          <h4 className="ssc-insight-title font-semibold text-base">Montreal Protocol: HFC Phase-Down Deadline</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India committed to Kigali Amendment phasing down HFC refrigerants by 80% by 2047 under Montreal Protocol. Current Indian HVAC industry uses 28,000 ODP tonnes of R-410A and R-32 refrigerants requiring complete phase-out. Solid-state cooling technologies bypass HFC phase-down entirely with zero-GWP operation. BEE Star Rating programme mandating minimum 3-star efficiency from 2025 makes solid-state COP of 3.0-5.2 competitive with inverter compressor systems while eliminating &#8377;15,000 Cr annual refrigerant procurement and disposal cost for Indian HVAC industry.</p>
        </CardContent></Card>
        <Card className="ssc-insight-card border-l-4 border-l-blue-900"><CardContent className="p-5">
          <h4 className="ssc-insight-title font-semibold text-base">Data Center Cooling: 40% of IT Power</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s 1,000+ data centers consume 8 GW of power with cooling accounting for 40% of total energy use. Hyperscale operators AWS, Microsoft Azure, Google Cloud and Indian players CtrlS, Nxtra and Sify collectively spending &#8377;8,000 Cr annually on data center cooling. Solid-state elastocaloric and Peltier cooling achieving 5.2 COP reduces cooling energy by 25% saving &#8377;2,000 Cr annually. Bengaluru, Chennai, Hyderabad and Mumbai data center corridors collectively requiring 200,000 TR of additional cooling by 2028 making solid-state technology critical for India&apos;s digital infrastructure growth.</p>
        </CardContent></Card>
        <Card className="ssc-insight-card border-l-4 border-l-blue-900"><CardContent className="p-5">
          <h4 className="ssc-insight-title font-semibold text-base">Cold Chain India: 35% Food Wastage</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India loses &#8377;13.3 lakh Cr worth of perishable food annually due to inadequate cold chain infrastructure covering only 10% of total produce. Solid-state cooling enables distributed modular cold rooms at farm-gate level without requiring refrigerant handling certified technicians. Ministry of Food Processing Industries sanctioning &#8377;10,000 Cr under Pradhan Mantri Kisan SAMPADA for cold chain expansion with solid-state technology eligible for 25% additional capital subsidy. Thermoelectric cold rooms operating on solar DC power eliminate grid dependency for 60% of rural cold storage locations across India&apos;s 6,600 cold chain gaps identified by NITI Aayog.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
