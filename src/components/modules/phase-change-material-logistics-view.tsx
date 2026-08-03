'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface PCMRecord {
  id: string; projectId: string; city: string; operator: string; pcmType: string
  storageCapacityMWh: number; investmentCr: number; phaseTemp: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#92400e', '#a16207', '#ca8a04', '#eab308', '#facc15', '#fde047', '#78350f', '#451a03']

const records: PCMRecord[] = [
  { id: 'PCM-0001', projectId: 'PCM-001', city: 'Jodhpur', operator: 'Rajasthan CSP Storage Ltd', pcmType: 'Paraffin Wax RT44',
    storageCapacityMWh: 12000, investmentCr: 850, phaseTemp: 44, status: 'Delivered', priority: 'Critical', origin: 'Mumbai Port', destination: 'Jodhpur Solar Park', shipDate: '2025-01-15', transitDays: 5, state: 'Rajasthan',
    remarks: 'Paraffin RT44 capsules shipped via temperature-controlled containers from Mumbai port to Jodhpur. Designed for building thermal comfort in Rajasthan&apos;s extreme desert climate with 45&#176;C peak summer days. Real-time GPS tracking enabled throughout 5-day transit with &#8377;850 Cr investment covering 12,000 MWh storage capacity.' },
  { id: 'PCM-0002', projectId: 'PCM-002', city: 'Ahmedabad', operator: 'Adani Solar Thermal TES', pcmType: 'Salt Hydrate Na2SO4',
    storageCapacityMWh: 10500, investmentCr: 720, phaseTemp: 32, status: 'Delivered', priority: 'High', origin: 'Kandla Port', destination: 'Ahmedabad Pharma Hub', shipDate: '2025-01-20', transitDays: 3, state: 'Gujarat',
    remarks: 'Glauber salt PCM units dispatched from Kandla port with humidity-controlled packaging for Gujarat pharmaceutical corridor. Targeting cold chain logistics hubs across 12 major pharma companies. Investment includes specialised storage tanks and &#8377;120 Cr in thermal monitoring IoT systems.' },
  { id: 'PCM-0003', projectId: 'PCM-003', city: 'Chennai', operator: 'Vikram Solar PCM Division', pcmType: 'Eutectic KNO3-NaNO3',
    storageCapacityMWh: 8000, investmentCr: 600, phaseTemp: 222, status: 'Delivered', priority: 'Critical', origin: 'Chennai Port', destination: 'Tirunelveli CSP', shipDate: '2025-01-28', transitDays: 2, state: 'Tamil Nadu',
    remarks: 'High-temperature eutectic salt blend for concentrated solar power TES systems at 222&#176;C operating temperature. Transported from Chennai manufacturing facility via dedicated thermal vessels to Tirunelveli CSP plant. &#8377;600 Cr investment critical for Tamil Nadu&apos;s 500 MW CSP pipeline integration.' },
  { id: 'PCM-0004', projectId: 'PCM-004', city: 'Pune', operator: 'Tata Power Solar Thermal', pcmType: 'Organic Erythritol PCM',
    storageCapacityMWh: 6500, investmentCr: 500, phaseTemp: 118, status: 'Delivered', priority: 'High', origin: 'Nhava Sheva', destination: 'Pune Warehouse', shipDate: '2025-02-05', transitDays: 2, state: 'Maharashtra',
    remarks: 'Erythritol-based PCM modules for pharmaceutical cold chain applications across Maharashtra state. Shipped from Nhava Sheva with active cooling to maintain material integrity at rated 118&#176;C capacity. Supports state vaccine distribution network expansion for 200+ cold chain points.' },
  { id: 'PCM-0005', projectId: 'PCM-005', city: 'Bengaluru', operator: 'Kirloskar Thermal Systems', pcmType: 'Glauber Salt PCM Panel',
    storageCapacityMWh: 5500, investmentCr: 450, phaseTemp: 33, status: 'Delivered', priority: 'Medium', origin: 'Mangalore Port', destination: 'Bengaluru Tech Hub', shipDate: '2025-02-10', transitDays: 3, state: 'Karnataka',
    remarks: 'Glauber salt-based thermal storage units for Bengaluru&apos;s commercial building cooling market. Delivered via multi-modal transport from Mangalore coastal manufacturing hub. System designed to reduce AC load by 35% in commercial towers, targeting 500+ buildings in Whitefield and Electronic City.' },
  { id: 'PCM-0006', projectId: 'PCM-006', city: 'Visakhapatnam', operator: 'Sterling and Wilson TES', pcmType: 'Fatty Acid Blend C16-C18',
    storageCapacityMWh: 5000, investmentCr: 420, phaseTemp: 52, status: 'In Transit', priority: 'High', origin: 'Vizag Port', destination: 'Steel Plant TES', shipDate: '2025-02-20', transitDays: 4, state: 'Andhra Pradesh',
    remarks: 'Bio-based fatty acid PCM shipment en route from Vizag port facility to Visakhapatnam steel plant expansion. Currently transiting through East Coast maritime corridor with ETA in 4 days. Will support industrial process cooling at &#8377;420 Cr, reducing coke oven gas consumption by 15%.' },
  { id: 'PCM-0007', projectId: 'PCM-007', city: 'Bhopal', operator: 'BHEL Energy Storage Unit', pcmType: 'Sugar Alcohol Mannitol',
    storageCapacityMWh: 4500, investmentCr: 380, phaseTemp: 166, status: 'Delivered', priority: 'High', origin: 'Indore Warehouse', destination: 'Bhopal Smart City', shipDate: '2025-02-14', transitDays: 2, state: 'Madhya Pradesh',
    remarks: 'Mannitol PCM for solar thermal integration in Bhopal&apos;s smart city project at 166&#176;C rated temperature. Temperature-stable organic PCM suitable for 120-180&#176;C range applications. Includes 4,500 MWh modular storage units for distributed deployment across 25 MP municipal buildings.' },
  { id: 'PCM-0008', projectId: 'PCM-008', city: 'Lucknow', operator: 'NTPC Solar Thermal Div', pcmType: 'Metal Alloy Al-Si',
    storageCapacityMWh: 9000, investmentCr: 780, phaseTemp: 565, status: 'Processing', priority: 'Critical', origin: 'Delhi ICD', destination: 'Lucknow TES Depot', shipDate: '2025-02-22', transitDays: 3, state: 'Uttar Pradesh',
    remarks: 'High-temperature Al-Si alloy PCM for industrial waste heat recovery systems at &#8377;780 Cr investment. Currently undergoing quality processing at Lucknow warehouse before final dispatch. Rated for 565&#176;C operation in metal processing and steel industry heat recovery applications across UP.' },
  { id: 'PCM-0009', projectId: 'PCM-009', city: 'Kochi', operator: 'Amplus PCM Solutions', pcmType: 'Inorganic KCl-LiCl Salt',
    storageCapacityMWh: 3000, investmentCr: 350, phaseTemp: 355, status: 'In Transit', priority: 'Critical', origin: 'Cochin Port', destination: 'Kochi Spice Park', shipDate: '2025-02-18', transitDays: 2, state: 'Kerala',
    remarks: 'Inorganic salt PCM blend for Kochi&apos;s spice cold chain preservation project at 355&#176;C. In transit via Cochin port with temperature logging at 15-minute intervals. Targets 20% energy savings in cold storage operations for &#8377;350 Cr investment covering spice export quality maintenance.' },
  { id: 'PCM-0010', projectId: 'PCM-010', city: 'Hyderabad', operator: 'Thermax Energy Storage', pcmType: 'Bio-Based Coconut PCM',
    storageCapacityMWh: 2500, investmentCr: 320, phaseTemp: 28, status: 'Delivered', priority: 'Medium', origin: 'Hyderabad MFP', destination: 'HITEC City Complex', shipDate: '2025-02-01', transitDays: 1, state: 'Telangana',
    remarks: 'Sustainable coconut-derived PCM for Hyderabad&apos;s green building initiatives at 28&#176;C transition temperature. Delivered from Kerala processing centre via road transport in 1 day. Fully biodegradable formulation ideal for passive cooling in 200+ HITEC City commercial towers.' },
  { id: 'PCM-0011', projectId: 'PCM-011', city: 'Gurugram', operator: 'Reliance New Energy PCM', pcmType: 'Phase Change Slurry PCS',
    storageCapacityMWh: 6000, investmentCr: 550, phaseTemp: 45, status: 'Delivered', priority: 'Low', origin: 'Delhi ICD', destination: 'Gurugram DC Park', shipDate: '2025-02-08', transitDays: 1, state: 'Haryana',
    remarks: 'Phase change slurry system for Gurugram&apos;s data center cooling infrastructure at &#8377;550 Cr. Shipped in insulated tanker trucks from Delhi ICD in under 24 hours. Provides 45&#176;C thermal buffer reducing chiller energy consumption by 40% for NCR&apos;s growing data center cluster.' },
  { id: 'PCM-0012', projectId: 'PCM-012', city: 'Bhubaneswar', operator: 'L&amp;T Thermal Storage', pcmType: 'Form-Stable Paraffin/HDPE',
    storageCapacityMWh: 4800, investmentCr: 480, phaseTemp: 58, status: 'Delayed', priority: 'High', origin: 'Paradip Port', destination: 'Bhubaneswar TES Hub', shipDate: '2025-01-12', transitDays: 6, state: 'Odisha',
    remarks: 'Form-stable composite PCM for Bhubaneswar&apos;s thermal energy storage pilot delayed by monsoon congestion. Port congestion at Paradip pushed delivery by 6 additional days beyond schedule. HDPE matrix ensures zero leakage during phase transitions at 58&#176;C for 4,800 MWh capacity.' },
  { id: 'PCM-0013', projectId: 'PCM-013', city: 'Ranchi', operator: 'Godawari Energy PCM', pcmType: 'Microencapsulated PCM',
    storageCapacityMWh: 3500, investmentCr: 400, phaseTemp: 26, status: 'Delivered', priority: 'Critical', origin: 'Kolkata Port', destination: 'Ranchi Textile Park', shipDate: '2025-01-08', transitDays: 4, state: 'Jharkhand',
    remarks: 'Microencapsulated PCM powder for textile thermal management applications in Jharkhand at &#8377;400 Cr. Delivered to Ranchi textile park for integration into smart fabric production lines. Encapsulation technology ensures 10,000+ charge-discharge cycle durability for performance textiles.' },
  { id: 'PCM-0014', projectId: 'PCM-014', city: 'Jaipur', operator: 'ThermalTech India Pvt Ltd', pcmType: 'Graphite-Enhanced PCM',
    storageCapacityMWh: 3500, investmentCr: 400, phaseTemp: 420, status: 'Delayed', priority: 'Medium', origin: 'Kandla Port', destination: 'Jaipur Solar TES', shipDate: '2025-02-02', transitDays: 5, state: 'Rajasthan',
    remarks: 'Graphite-enhanced paraffin composite for concentrated solar thermal storage in Jaipur at 420&#176;C. Delayed by 2 days due to rail logistics bottleneck in North India freight corridor. Thermal conductivity enhanced 5x for rapid charge-discharge cycles in CSP plant integration.' },
]

export default function PhaseChangeMaterialLogisticsView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof PCMRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'pcmType', label: 'PCM Type', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.pcmType] = (m[r.pcmType] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Storage Capacity', value: `${filtered.reduce((a: number, r) => a + r.storageCapacityMWh, 0).toLocaleString()} MWh` },
    { label: 'Avg Phase Temp', value: `${(filtered.reduce((a: number, r) => a + r.phaseTemp, 0) / Math.max(1, filtered.length)).toFixed(1)}&#176;C` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Avg Cost/MWh', value: `&#8377;${(filtered.reduce((a: number, r) => a + r.investmentCr, 0) * 100 / Math.max(1, filtered.reduce((a: number, r) => a + r.storageCapacityMWh, 0))).toFixed(0)} L` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: PCMRecord) => string, val: (r: PCMRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.storageCapacityMWh)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const matBar = grp(r => r.pcmType, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const effData = filtered.map(r => ({ name: r.pcmType.split(' ').slice(0, 2).join(' '), value: r.phaseTemp }))
    const lm = filtered.reduce((a: Record<string, { storageCapacityMWh: number; investmentCr: number }>, r) => {
      if (!a[r.state]) a[r.state] = { storageCapacityMWh: 0, investmentCr: 0 }
      a[r.state].storageCapacityMWh += r.storageCapacityMWh; a[r.state].investmentCr += r.investmentCr; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, storageCapacityMWh: v.storageCapacityMWh, investmentCr: v.investmentCr }))
    return { barState, pieState, statusPie, matBar, priorityPie, totalInvest, effData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="pcm-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Phase Change Material' }]} />
      <PageHeader title="Phase Change Material Logistics" description="Track phase change material thermal energy storage logistics, PCM supply chain distribution for solar thermal, building cooling, cold chain and industrial process applications across India" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="pcm-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`pcm-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-amber-900 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="pcm-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="pcm-kpi-card"><CardContent className="p-4"><p className="pcm-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="pcm-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="pcm-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="pcm-chart-title text-sm">Storage Capacity (MWh) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#92400e" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="pcm-chart-title text-sm">Facilities by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="pcm-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="pcm-chart-title text-sm">Phase Change Temp (&#176;C) by PCM Type</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.effData}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#a16207" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="pcm-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="pcm-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`pcm-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-amber-900'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.pcmType} | {r.state}</p>
              <p className="text-xs mt-1">{r.storageCapacityMWh.toLocaleString()} MWh | {r.phaseTemp}&#176;C phase | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="pcm-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="pcm-chart-title text-sm">Storage vs Investment by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="storageCapacityMWh" stroke="#92400e" name="Storage MWh" /><Line yAxisId="right" type="monotone" dataKey="investmentCr" stroke="#eab308" name="Investment &#8377; Cr" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="pcm-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#78350f" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="pcm-chart-title text-sm">PCM Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.matBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#a16207" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="pcm-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="pcm-insights grid grid-cols-2 gap-4">
        <Card className="pcm-insight-card border-l-4 border-l-amber-900"><CardContent className="p-5">
          <h4 className="pcm-insight-title font-semibold text-base">India&apos;s &#8377;25,000 Cr Thermal Energy Storage Market by 2030</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s PCM market projected to reach &#8377;25,000 Cr by 2030 driven by CSP integration and cold chain expansion. Government incentives under National Solar Mission promote thermal storage adoption with 40% subsidy for TES systems. Phase change materials offer 3-5x higher energy density vs. conventional sensible heat storage technologies.</p>
        </CardContent></Card>
        <Card className="pcm-insight-card border-l-4 border-l-amber-900"><CardContent className="p-5">
          <h4 className="pcm-insight-title font-semibold text-base">Building Thermal Comfort: 40% AC Load Reduction</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">PCM-integrated building materials reduce peak cooling loads by 30-40% in Indian climates. Passive thermal storage in walls and ceilings absorbs daytime heat, releasing it at night. Leading developers in Tier-1 cities adopting form-stable PCM panels for IGBC and GRIHA green building certifications.</p>
        </CardContent></Card>
        <Card className="pcm-insight-card border-l-4 border-l-amber-900"><CardContent className="p-5">
          <h4 className="pcm-insight-title font-semibold text-base">Solar Thermal: Rajasthan &amp; Gujarat CSP Pipeline</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Rajasthan and Gujarat lead India&apos;s CSP deployment with over 2 GW pipeline capacity. PCM-based TES enables 6-12 hour thermal energy dispatch for grid stability. Eutectic salt and metal alloy PCMs operating above 300&#176;C are critical for next-generation CSP plants targeting round-the-clock solar power.</p>
        </CardContent></Card>
        <Card className="pcm-insight-card border-l-4 border-l-amber-900"><CardContent className="p-5">
          <h4 className="pcm-insight-title font-semibold text-base">Cold Chain PCM: &#8377;13,000 Cr Food Loss Prevention</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India loses &#8377;13,000 Cr annually to food spoilage due to inadequate cold chain infrastructure. PCM-based passive cooling containers eliminate diesel-powered refrigeration dependency. Vaccine logistics networks in rural areas adopting microencapsulated PCM packaging for last-mile delivery with 48-hour holdover time.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
