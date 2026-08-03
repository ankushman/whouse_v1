'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface PARRecord {
  id: string; projectId: string; city: string; operator: string; technology: string
  capacityTPD: number; investmentCr: number; energyConsumption: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#c026d3', '#d946ef', '#e879f9', '#f0abfc', '#f5d0fe', '#fae8ff', '#fdf4ff', '#fbcfe8']

const records: PARRecord[] = [
  { id: 'PAR-001', projectId: 'PAR-001', city: 'Delhi NCR', operator: 'Indian Waste Recycling', technology: 'DC Plasma Arc',
    capacityTPD: 500, investmentCr: 1850, energyConsumption: 850, status: 'Delivered', priority: 'Critical', origin: 'Ghazipur Plant', destination: 'Narela Hub', shipDate: '2024-02-15', transitDays: 12, state: 'Delhi',
    remarks: 'Flagship 500 TPD plasma arc facility treating hazardous and medical waste at Ghazipur landfill, converting 95% to syngas and vitrified slag' },
  { id: 'PAR-002', projectId: 'PAR-002', city: 'Mumbai', operator: 'Enviro Solutions Mumbai', technology: 'AC Plasma Torch',
    capacityTPD: 400, investmentCr: 1500, energyConsumption: 720, status: 'Delivered', priority: 'High', origin: 'Deonar Facility', destination: 'Trombay Industrial', shipDate: '2024-01-20', transitDays: 8, state: 'Maharashtra',
    remarks: 'Mumbai&apos;s first plasma gasification plant at Deonar, processing 400 TPD of mixed municipal solid waste with near-zero emissions technology' },
  { id: 'PAR-003', projectId: 'PAR-003', city: 'Bengaluru', operator: 'Karnataka Enviro Tech', technology: 'Transferred Arc Plasma',
    capacityTPD: 350, investmentCr: 1350, energyConsumption: 650, status: 'Delivered', priority: 'High', origin: 'Mavallipura', destination: 'Peenya Industrial', shipDate: '2024-03-10', transitDays: 15, state: 'Karnataka',
    remarks: 'Transferred arc system recovering precious metals from e-waste, achieving 98% metal recovery rate from circuit boards and electronic scrap' },
  { id: 'PAR-004', projectId: 'PAR-004', city: 'Chennai', operator: 'Tamil Nadu Green Tech', technology: 'Non-Transferred Arc',
    capacityTPD: 300, investmentCr: 1200, energyConsumption: 580, status: 'In Transit', priority: 'Medium', origin: 'Kodungaiyur', destination: 'Ambattur Zone', shipDate: '2024-06-01', transitDays: 18, state: 'Tamil Nadu',
    remarks: 'Non-transferred arc for biomedical waste sterilization, handling 300 TPD from 42 hospitals across Chennai metropolitan area' },
  { id: 'PAR-005', projectId: 'PAR-005', city: 'Hyderabad', operator: 'Telangana Waste Corp', technology: 'DC Plasma Arc',
    capacityTPD: 450, investmentCr: 1650, energyConsumption: 800, status: 'Delivered', priority: 'High', origin: 'Jawaharnagar', destination: 'Gachibowli Tech Park', shipDate: '2024-01-05', transitDays: 10, state: 'Telangana',
    remarks: 'Large DC plasma arc at Jawaharnagar dump site, generating 4 MW of excess syngas power fed back into the Telangana state grid' },
  { id: 'PAR-006', projectId: 'PAR-006', city: 'Kolkata', operator: 'West Bengal Eco Energy', technology: 'Plasma Pyrolysis',
    capacityTPD: 250, investmentCr: 980, energyConsumption: 520, status: 'In Transit', priority: 'Medium', origin: 'Dhapa Landfill', destination: 'Salt Lake Zone', shipDate: '2024-05-15', transitDays: 14, state: 'West Bengal',
    remarks: 'Plasma pyrolysis converting Dhapa landfill organic fraction into biochar and producer gas, reducing landfill volume by 85%' },
  { id: 'PAR-007', projectId: 'PAR-007', city: 'Pune', operator: 'Maharashtra Plasma Systems', technology: 'AC Plasma Torch',
    capacityTPD: 280, investmentCr: 1050, energyConsumption: 550, status: 'Delivered', priority: 'Medium', origin: 'Urali Devachi', destination: 'Hinjewadi IT', shipDate: '2024-02-28', transitDays: 11, state: 'Maharashtra',
    remarks: 'AC torch system focused on industrial hazardous waste from Hinjewadi and Chakan MIDC, achieving complete destruction of toxic organics' },
  { id: 'PAR-008', projectId: 'PAR-008', city: 'Ahmedabad', operator: 'Gujarat Green Energy', technology: 'Vitrification Plasma',
    capacityTPD: 320, investmentCr: 1250, energyConsumption: 620, status: 'Delivered', priority: 'High', origin: 'Pirana Site', destination: 'SG Highway Industrial', shipDate: '2024-03-20', transitDays: 9, state: 'Gujarat',
    remarks: 'Vitrification system converting fly ash and slag into construction-grade glass aggregate, producing 120 TPD of reusable building material' },
  { id: 'PAR-009', projectId: 'PAR-009', city: 'Jaipur', operator: 'Rajasthan PlasmaTech', technology: 'DC Plasma Arc',
    capacityTPD: 200, investmentCr: 850, energyConsumption: 450, status: 'Processing', priority: 'Medium', origin: 'Langariawas', destination: 'Sitapura Industrial', shipDate: '2024-07-10', transitDays: 16, state: 'Rajasthan',
    remarks: 'Desert-region plasma plant processing 200 TPD of construction and demolition waste, producing vitrified tiles and road aggregate' },
  { id: 'PAR-010', projectId: 'PAR-010', city: 'Lucknow', operator: 'UP Waste Solutions', technology: 'Transferred Arc Plasma',
    capacityTPD: 260, investmentCr: 1000, energyConsumption: 540, status: 'Delivered', priority: 'Medium', origin: 'Bakshi Ka Talab', destination: 'Amausi Industrial', shipDate: '2024-04-05', transitDays: 13, state: 'Uttar Pradesh',
    remarks: 'Transferred arc recovering metals from Lucknow&apos;s industrial scrap yards, generating 2.5 MW syngas power for local grid connection' },
  { id: 'PAR-011', projectId: 'PAR-011', city: 'Indore', operator: 'Madhya Pradesh Enviro', technology: 'Plasma Gasification',
    capacityTPD: 300, investmentCr: 1150, energyConsumption: 600, status: 'In Transit', priority: 'High', origin: 'Devguradia', destination: 'Pithampur Industrial', shipDate: '2024-05-28', transitDays: 17, state: 'MP',
    remarks: 'Plasma gasification at Indore&apos;s cleanest city initiative, converting segregated organic and plastic waste into synthesis gas for power generation' },
  { id: 'PAR-012', projectId: 'PAR-012', city: 'Kochi', operator: 'Kerala BioPlasma', technology: 'Non-Transferred Arc',
    capacityTPD: 150, investmentCr: 680, energyConsumption: 380, status: 'Processing', priority: 'Low', origin: 'Brahmapuram', destination: 'Kalamassery Industrial', shipDate: '2024-07-20', transitDays: 19, state: 'Kerala',
    remarks: 'Compact non-transferred arc for Kochi&apos;s coconut and biomass waste, producing biochar for Kerala&apos;s spice plantations and organic farms' },
  { id: 'PAR-013', projectId: 'PAR-013', city: 'Coimbatore', operator: 'Tamil Nadu Plasma Corp', technology: 'AC Plasma Torch',
    capacityTPD: 220, investmentCr: 880, energyConsumption: 480, status: 'Delivered', priority: 'Medium', origin: 'Vellalore', destination: 'Ganapathy Industrial', shipDate: '2024-03-30', transitDays: 12, state: 'Tamil Nadu',
    remarks: 'AC torch handling textile and dyeing industry sludge from Tirupur-Coimbatore belt, destroying hazardous azo dyes at molecular level' },
  { id: 'PAR-014', projectId: 'PAR-014', city: 'Visakhapatnam', operator: 'Andhra Plasma Energy', technology: 'DC Plasma Arc',
    capacityTPD: 180, investmentCr: 750, energyConsumption: 420, status: 'Delayed', priority: 'Low', origin: 'Ravulapalem', destination: 'Vizag Steel Plant', shipDate: '2024-06-15', transitDays: 22, state: 'AP',
    remarks: 'Delayed due to monsoon logistics disruptions, plasma plant designed to process steel plant slag and recover iron oxide for sintering recycle' },
]

export default function PlasmaArcRecyclingView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof PARRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'technology', label: 'Technology', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.technology] = (m[r.technology] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Capacity', value: `${filtered.reduce((a: number, r) => a + r.capacityTPD, 0).toLocaleString()} TPD` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Avg Energy/kWh per TPD', value: `${(filtered.reduce((a: number, r) => a + r.energyConsumption, 0) / Math.max(1, filtered.reduce((a: number, r) => a + r.capacityTPD, 0))).toFixed(0)} kWh` },
    { label: 'Active Facilities', value: String(filtered.filter(r => r.status === 'Delivered').length) },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: PARRecord) => string, val: (r: PARRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.capacityTPD)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const techBar = grp(r => r.technology, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const energyKpd = filtered.map(r => ({ name: r.city.split(' ')[0].slice(0, 12), value: +(r.energyConsumption / r.capacityTPD).toFixed(1) }))
    const lm = filtered.reduce((a: Record<string, { capacityTPD: number; energyConsumption: number }>, r) => {
      if (!a[r.state]) a[r.state] = { capacityTPD: 0, energyConsumption: 0 }
      a[r.state].capacityTPD += r.capacityTPD; a[r.state].energyConsumption += r.energyConsumption; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, capacityTPD: v.capacityTPD, energyConsumption: v.energyConsumption }))
    return { barState, pieState, statusPie, techBar, priorityPie, totalInvest, energyKpd, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="par-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Plasma Arc Recycling' }]} />
      <PageHeader title="Plasma Arc Recycling Logistics" description="Monitor plasma gasification facilities, waste treatment capacity, and energy recovery operations across Indian cities" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="par-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`par-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-fuchsia-700 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="par-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="par-kpi-card"><CardContent className="p-4"><p className="par-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="par-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="par-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="par-chart-title text-sm">Capacity (TPD) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#c026d3" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="par-chart-title text-sm">Facilities by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="par-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="par-chart-title text-sm">Energy per TPD (kWh)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.energyKpd}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#d946ef" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="par-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="par-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`par-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-fuchsia-700'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.technology} | {r.state}</p>
              <p className="text-xs mt-1">{r.capacityTPD} TPD | {r.energyConsumption} kWh | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="par-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="par-chart-title text-sm">Capacity vs Energy Consumption</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="capacityTPD" stroke="#c026d3" name="Capacity TPD" /><Line yAxisId="right" type="monotone" dataKey="energyConsumption" stroke="#f59e0b" name="Energy kWh" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="par-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#d946ef" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="par-chart-title text-sm">Technology Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.techBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#e879f9" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="par-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="par-insights grid grid-cols-2 gap-4">
        <Card className="par-insight-card border-l-4 border-l-fuchsia-700"><CardContent className="p-5">
          <h4 className="par-insight-title font-semibold text-base">Plasma Gasification vs Incineration</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Plasma arc technology reaches temperatures exceeding 10,000&#176;C, compared to 1,000&#176;C for conventional incineration. This destroys dioxins, furans, and PFAS compounds at the molecular level, producing vitrified slag instead of toxic ash residue.</p>
        </CardContent></Card>
        <Card className="par-insight-card border-l-4 border-l-fuchsia-700"><CardContent className="p-5">
          <h4 className="par-insight-title font-semibold text-base">Syngas Energy Recovery Potential</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Each ton of MSW processed via plasma gasification generates 600-800 kWh of syngas energy. India&apos;s 4,000+ TPD plasma capacity could produce 2.4-3.2 GWh daily, powering 200,000+ households while eliminating landfill dependency.</p>
        </CardContent></Card>
        <Card className="par-insight-card border-l-4 border-l-fuchsia-700"><CardContent className="p-5">
          <h4 className="par-insight-title font-semibold text-base">E-Waste Metal Recovery Advantage</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Plasma arc achieves 98% metal recovery from e-waste compared to 60-70% for smelting. India generates 3.2 MT of e-waste annually, and plasma recycling could recover &#8377;12,000 Cr worth of gold, copper, palladium, and rare earths.</p>
        </CardContent></Card>
        <Card className="par-insight-card border-l-4 border-l-fuchsia-700"><CardContent className="p-5">
          <h4 className="par-insight-title font-semibold text-base">Vitrified Slag as Construction Material</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Plasma-produced vitrified slag is leach-resistant and exceeds BIS standards for road aggregate and building tiles. One plasma plant producing 120 TPD of vitrified material can replace &#8377;15 Cr worth of natural quarry materials annually.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
