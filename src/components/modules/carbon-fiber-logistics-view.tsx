'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface CFLRecord {
  id: string; projectId: string; city: string; operator: string; compositeType: string
  productionTons: number; investmentCr: number; tensileStrength: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#374151', '#4b5563', '#6b7280', '#9ca3af', '#d1d5db', '#111827', '#1f2937', '#f3f4f6']

const records: CFLRecord[] = [
  { id: 'CFL-0001', projectId: 'CFL-001', city: 'Vadodara', operator: 'Hindustan Composites Ltd', compositeType: '3K Plain Weave Fabric',
    productionTons: 8500, investmentCr: 520, tensileStrength: 4500, status: 'Delivered', priority: 'Critical', origin: 'Vadodara CF Hub', destination: 'Bengaluru AFC', shipDate: '2025-01-15', transitDays: 4, state: 'Gujarat',
    remarks: '3K Plain Weave Fabric dispatched from Vadodara &#8594; Bengaluru for DRDO&apos;s composite wing programme. Batch tested at 4,500 MPa tensile strength with 0.5% defect rate. Investment of &#8377;520 Cr allocated for Phase-2 capacity expansion targeting defence aerospace orders through 2028.' },
  { id: 'CFL-0002', projectId: 'CFL-002', city: 'Pune', operator: 'Aditya Birla CFRP Division', compositeType: '12K Tow Prepreg',
    productionTons: 12000, investmentCr: 740, tensileStrength: 5200, status: 'Delivered', priority: 'High', origin: 'Pune Composite Park', destination: 'Chennai Aero Zone', shipDate: '2025-01-20', transitDays: 5, state: 'Maharashtra',
    remarks: '12K Tow Prepreg shipment from Pune &#8594; Chennai for aerospace structural components. High-modulus grade certified to 5,200 MPa for fuselage panel applications. Consignment tracked via GPS with 72-hour delivery window confirmed for HAL supply chain.' },
  { id: 'CFL-0003', projectId: 'CFL-003', city: 'Bengaluru', operator: 'Mishra Composites Pvt Ltd', compositeType: 'UD Tape Carbon',
    productionTons: 6200, investmentCr: 430, tensileStrength: 4800, status: 'In Transit', priority: 'Critical', origin: 'Bengaluru Tech Park', destination: 'Hyderabad DMRL', shipDate: '2025-02-05', transitDays: 3, state: 'Karnataka',
    remarks: 'Unidirectional Tape Carbon in transit from Bengaluru &#8594; Hyderabad for missile body casings. Tensile rating of 4,800 MPa meets ISRO&apos;s Gaganyaan crew module specification. Expected arrival within 3 days with customs clearance pre-approved for DRDO priority shipment.' },
  { id: 'CFL-0004', projectId: 'CFL-004', city: 'Chennai', operator: 'DRDO ADA Composites', compositeType: '3D Woven Preform',
    productionTons: 3800, investmentCr: 330, tensileStrength: 6200, status: 'Delivered', priority: 'Critical', origin: 'Chennai DRDO Lab', destination: 'Bengaluru ADA', shipDate: '2025-01-28', transitDays: 2, state: 'Tamil Nadu',
    remarks: '3D Woven Preform delivered from Chennai &#8594; Bengaluru for Tejas Mk2 wing structures. Exceptional 6,200 MPa tensile strength validated at NAL test facility. Batch qualifies for AMCA fifth-generation fighter programme airframe integration and HAL production line.' },
  { id: 'CFL-0005', projectId: 'CFL-005', city: 'Hyderabad', operator: 'ISRO CFRP Division', compositeType: 'Carbon Fibre Sheet Moulding',
    productionTons: 9500, investmentCr: 570, tensileStrength: 4100, status: 'Delivered', priority: 'High', origin: 'Hyderabad ISRO Plant', destination: 'Sriharikota SHAR', shipDate: '2025-02-10', transitDays: 2, state: 'Telangana',
    remarks: 'CF Sheet Moulding compound shipped from Hyderabad &#8594; Sriharikota for launch vehicle fairings. Production capacity of 9,500 tons/yr supports PSLV &amp; GSLV Mk-III programmes. &#8377;570 Cr facility meets AS9100D quality standards for space-grade composites.' },
  { id: 'CFL-0006', projectId: 'CFL-006', city: 'Jodhpur', operator: 'Tata Advanced Materials', compositeType: 'Recycled CF Chopped',
    productionTons: 4200, investmentCr: 260, tensileStrength: 3600, status: 'Processing', priority: 'Medium', origin: 'Jodhpur Recycling Unit', destination: 'Pune TAM Facility', shipDate: '2025-02-18', transitDays: 6, state: 'Rajasthan',
    remarks: 'Recycled CF Chopped strands under processing at Jodhpur plant for automotive non-structural parts. Pyrolysis recovery achieves 3,600 MPa retained tensile at 60% lower cost. &#8377;260 Cr investment supports India&apos;s circular economy targets for composite materials recycling.' },
  { id: 'CFL-0007', projectId: 'CFL-007', city: 'Bhopal', operator: 'L&amp;T Composite Technology', compositeType: 'PAN Precursor CF',
    productionTons: 15000, investmentCr: 820, tensileStrength: 5800, status: 'Delivered', priority: 'Critical', origin: 'Bhopal L&amp;T Works', destination: 'Visakhapatnam Shipyard', shipDate: '2025-01-10', transitDays: 7, state: 'Madhya Pradesh',
    remarks: 'PAN-based Precursor Carbon Fibre delivered from Bhopal &#8594; Visakhapatnam for naval corvette hull panels. Largest domestic production at 15,000 tons/yr with 5,800 MPa strength. &#8377;820 Cr plant is India&apos;s flagship CF manufacturing facility under PLI scheme.' },
  { id: 'CFL-0008', projectId: 'CFL-008', city: 'Noida', operator: 'Mahindra CFRP Unit', compositeType: 'Pitch-Based High Modulus',
    productionTons: 7800, investmentCr: 560, tensileStrength: 6500, status: 'Delivered', priority: 'High', origin: 'Noida Mahindra Plant', destination: 'Pune R&amp;D Centre', shipDate: '2025-02-01', transitDays: 4, state: 'Uttar Pradesh',
    remarks: 'Pitch-Based High Modulus CF shipped from Noida &#8594; Pune for EV battery enclosure prototyping. Ultra-high 6,500 MPa tensile enables 40% weight reduction vs aluminium. Mahindra&apos;s &#8377;560 Cr unit targets XUV electric platform launch in Q3 2025.' },
  { id: 'CFL-0009', projectId: 'CFL-009', city: 'Durgapur', operator: 'Reliance CF Materials', compositeType: 'Aerospace Grade UD Tape',
    productionTons: 2500, investmentCr: 360, tensileStrength: 7000, status: 'Delayed', priority: 'Critical', origin: 'Durgapur RFM Plant', destination: 'Bengaluru HAL', shipDate: '2025-02-12', transitDays: 5, state: 'West Bengal',
    remarks: 'Aerospace Grade UD tape delayed at Durgapur &#8594; Bengaluru route due to rail congestion on Howrah-Bangalore corridor. Premium 7,000 MPa grade intended for HAL&apos;s Su-30MKI overhaul programme. Revised ETA pending with alternative road transport arranged via NH48.' },
  { id: 'CFL-0010', projectId: 'CFL-010', city: 'Kochi', operator: 'Cyient CFRP Aerospace', compositeType: 'Automotive Class-A Prepreg',
    productionTons: 5600, investmentCr: 410, tensileStrength: 4900, status: 'Delivered', priority: 'Medium', origin: 'Kochi Cyient Works', destination: 'Chennai Ford Plant', shipDate: '2025-01-25', transitDays: 3, state: 'Kerala',
    remarks: 'Class-A Surface Prepreg delivered from Kochi &#8594; Chennai for automotive exterior body panels. 4,900 MPa strength meets OEM surface finish requirements for visible parts. &#8377;410 Cr investment positions Kerala as CF automotive components manufacturing hub.' },
  { id: 'CFL-0011', projectId: 'CFL-011', city: 'Visakhapatnam', operator: 'GTRE Composite Wing', compositeType: 'Wind Blade Spar Cap',
    productionTons: 18500, investmentCr: 870, tensileStrength: 4300, status: 'In Transit', priority: 'High', origin: 'Vizag GTRE Facility', destination: 'Gujarat Wind Farm', shipDate: '2025-02-20', transitDays: 8, state: 'Andhra Pradesh',
    remarks: 'Wind Blade Spar Cap pultrusions in transit from Vizag &#8594; Gujarat for 120m turbine blades. 18,500 tons/yr capacity makes this India&apos;s largest CF wind energy facility. &#8377;870 Cr investment aligned with 500 GW renewable energy target by 2030 for onshore wind farms.' },
  { id: 'CFL-0012', projectId: 'CFL-012', city: 'Gurugram', operator: 'Bharat Forge Carbon', compositeType: 'Marine Grade Fabric',
    productionTons: 3200, investmentCr: 280, tensileStrength: 4600, status: 'Delivered', priority: 'Low', origin: 'Gurugram BFC Unit', destination: 'Mumbai Naval Dock', shipDate: '2025-02-08', transitDays: 4, state: 'Haryana',
    remarks: 'Marine Grade Woven Fabric delivered from Gurugram &#8594; Mumbai for frigate interior panels. Salt-spray resistant grade at 4,600 MPa meets Indian Navy specifications for INS Vishal carrier programme. Low-priority shipment completed within standard 4-day transit.' },
  { id: 'CFL-0013', projectId: 'CFL-013', city: 'Raipur', operator: 'NAL Composite Lab', compositeType: 'Thermoplastic CF/PEEK',
    productionTons: 4800, investmentCr: 320, tensileStrength: 5100, status: 'Delivered', priority: 'Medium', origin: 'Raipur NAL Facility', destination: 'Bengaluru NAL Main', shipDate: '2025-02-14', transitDays: 6, state: 'Chhattisgarh',
    remarks: 'Thermoplastic CF/PEEK delivered from Raipur &#8594; Bengaluru for recyclable aerospace structures. 5,100 MPa strength with 180&#176;C continuous service temperature capability. &#8377;320 Cr pilot plant demonstrates India&apos;s thermoplastic composite readiness for next-gen aircraft.' },
  { id: 'CFL-0014', projectId: 'CFL-014', city: 'Ahmedabad', operator: 'HexaCorp India', compositeType: 'Carbon Nanotube Reinforced',
    productionTons: 1800, investmentCr: 210, tensileStrength: 6800, status: 'Delayed', priority: 'High', origin: 'Ahmedabad HexaCorp Lab', destination: 'Pune DRDO Lab', shipDate: '2025-02-22', transitDays: 3, state: 'Gujarat',
    remarks: 'CNT-Reinforced CF delayed from Ahmedabad &#8594; Pune due to monsoon-related logistics disruption on NH48. Cutting-edge 6,800 MPa hybrid material for hypersonic vehicle TPS applications. &#8377;210 Cr R&amp;D batch represents next-gen material technology for DRDO missile programmes.' },
]

export default function CarbonFiberLogisticsView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof CFLRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'compositeType', label: 'Composite Type', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.compositeType] = (m[r.compositeType] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Production', value: `${filtered.reduce((a: number, r) => a + r.productionTons, 0).toLocaleString()} tons/yr` },
    { label: 'Avg Tensile Strength', value: `${(filtered.reduce((a: number, r) => a + r.tensileStrength, 0) / Math.max(1, filtered.length)).toLocaleString()} MPa` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Avg Cost/Ton', value: `&#8377;${(filtered.reduce((a: number, r) => a + r.investmentCr, 0) * 100 / Math.max(1, filtered.reduce((a: number, r) => a + r.productionTons, 0))).toFixed(0)} L` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: CFLRecord) => string, val: (r: CFLRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.productionTons)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const matBar = grp(r => r.compositeType, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const effData = filtered.map(r => ({ name: r.compositeType.split(' ').slice(0, 2).join(' '), value: r.tensileStrength }))
    const lm = filtered.reduce((a: Record<string, { productionTons: number; investmentCr: number }>, r) => {
      if (!a[r.state]) a[r.state] = { productionTons: 0, investmentCr: 0 }
      a[r.state].productionTons += r.productionTons; a[r.state].investmentCr += r.investmentCr; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, productionTons: v.productionTons, investmentCr: v.investmentCr }))
    return { barState, pieState, statusPie, matBar, priorityPie, totalInvest, effData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="cfl-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Carbon Fiber' }]} />
      <PageHeader title="Carbon Fiber Logistics" description="Track carbon fiber composite supply chains, CFRP logistics, advanced materials distribution for aerospace, automotive, wind energy and defence industries across India" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="cfl-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`cfl-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="cfl-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="cfl-kpi-card"><CardContent className="p-4"><p className="cfl-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="cfl-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="cfl-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="cfl-chart-title text-sm">Production (tons/yr) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#374151" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="cfl-chart-title text-sm">Facilities by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="cfl-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="cfl-chart-title text-sm">Tensile Strength (MPa) by Composite Type</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.effData}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#4b5563" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="cfl-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="cfl-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`cfl-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-gray-900'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.compositeType} | {r.state}</p>
              <p className="text-xs mt-1">{r.productionTons.toLocaleString()} tons/yr | {r.tensileStrength.toLocaleString()} MPa | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="cfl-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="cfl-chart-title text-sm">Production vs Investment by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="productionTons" stroke="#374151" name="Production tons" /><Line yAxisId="right" type="monotone" dataKey="investmentCr" stroke="#6b7280" name="Investment &#8377; Cr" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="cfl-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#111827" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="cfl-chart-title text-sm">Composite Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.matBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#4b5563" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="cfl-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="cfl-insights grid grid-cols-2 gap-4">
        <Card className="cfl-insight-card border-l-4 border-l-gray-900"><CardContent className="p-5">
          <h4 className="cfl-insight-title font-semibold text-base">India&apos;s &#8377;15,000 Cr Carbon Fiber Market by 2030</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s carbon fiber market projected to reach &#8377;15,000 Cr by 2030, driven by aerospace and defence demand. Domestic production targets aim to reduce 80% import dependency from Japan and Germany. PLI scheme for advanced composites expected to attract &#8377;3,500 Cr in fresh investments across Gujarat, Karnataka and Tamil Nadu states.</p>
        </CardContent></Card>
        <Card className="cfl-insight-card border-l-4 border-l-gray-900"><CardContent className="p-5">
          <h4 className="cfl-insight-title font-semibold text-base">Aerospace CFRP: Light-Weight Revolution</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">DRDO and HAL accelerating CFRP adoption for Tejas Mk2, AMCA and Gaganyaan crew module programmes. Carbon fiber composites reduce airframe weight by 20-30%, improving payload range and fuel efficiency. NAL&apos;s composite wing programme targets 100% indigenous CF structural components by 2028 with 5,000+ ton annual requirement.</p>
        </CardContent></Card>
        <Card className="cfl-insight-card border-l-4 border-l-gray-900"><CardContent className="p-5">
          <h4 className="cfl-insight-title font-semibold text-base">Automotive Carbon Fiber Adoption Surge</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Tata Motors and Mahindra investing heavily in CF for EV weight reduction and range extension. Class-A prepreg enables visible exterior panels replacing steel with 50% mass savings. India&apos;s EV policy mandates 30% composite content in premium electric vehicles by 2028, creating &#8377;4,200 Cr annual demand for automotive-grade CF.</p>
        </CardContent></Card>
        <Card className="cfl-insight-card border-l-4 border-l-gray-900"><CardContent className="p-5">
          <h4 className="cfl-insight-title font-semibold text-base">Sustainability: Recycled Carbon Fiber Circular Economy</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Pyrolysis-based CF recycling gaining traction with &#8377;500 Cr circular economy investment planned by 2027. Recycled CF retains 60-90% of virgin tensile strength at 40% lower cost. Automotive and wind energy sectors leading adoption of sustainable CF supply chains, with 12 recycling facilities planned across India by 2029.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
