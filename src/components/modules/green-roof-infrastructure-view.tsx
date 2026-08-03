'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface GRIRecord {
  id: string; projectId: string; city: string; developer: string; roofType: string
  areaSqM: number; investmentCr: number; stormwaterL: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#15803d', '#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0', '#dcfce7', '#f0fdf4']

const records: GRIRecord[] = [
  { id: 'GRI-001', projectId: 'GRI-001', city: 'Delhi NCR', developer: 'Green terrace build Tech', roofType: 'Intensive Green Roof',
    areaSqM: 15000, investmentCr: 680, stormwaterL: 45000, status: 'Delivered', priority: 'Critical', origin: 'Connaught Place', destination: 'Rajendra Place', shipDate: '2024-01-15', transitDays: 8, state: 'Delhi',
    remarks: 'Largest intensive green roof at Connaught Place commercial complex, featuring 45 native plant species, rooftop cafe, and 45,000 L stormwater retention capacity' },
  { id: 'GRI-002', projectId: 'GRI-002', city: 'Mumbai', developer: 'Mumbai Skyline Greens', roofType: 'Extensive Green Roof',
    areaSqM: 12000, investmentCr: 520, stormwaterL: 36000, status: 'Delivered', priority: 'High', origin: 'BKC Tower', destination: 'Bandra Reclamation', shipDate: '2024-02-20', transitDays: 6, state: 'Maharashtra',
    remarks: 'Extensive sedum-based green roof at BKC financial district, reducing ambient temperature by 4&#176;C and HVAC energy consumption by 25% in adjacent floors' },
  { id: 'GRI-003', projectId: 'GRI-003', city: 'Bengaluru', developer: 'Namma Garden Roofs', roofType: 'Rooftop Farm',
    areaSqM: 8500, investmentCr: 380, stormwaterL: 25500, status: 'Delivered', priority: 'High', origin: 'Whitefield IT Park', destination: 'HSR Layout', shipDate: '2024-03-10', transitDays: 10, state: 'Karnataka',
    remarks: 'Rooftop urban farm producing 2.5 tonnes of organic vegetables annually, with rainwater harvesting, drip irrigation, and composting from cafeteria waste' },
  { id: 'GRI-004', projectId: 'GRI-004', city: 'Chennai', developer: 'Chennai Roofscapes', roofType: 'Solar-Green Hybrid',
    areaSqM: 10000, investmentCr: 750, stormwaterL: 30000, status: 'In Transit', priority: 'High', origin: 'OMR Tech Corridor', destination: 'Adyar Eco Park', shipDate: '2024-06-01', transitDays: 12, state: 'Tamil Nadu',
    remarks: 'Bifacial solar panels integrated with green roof at OMR IT corridor, generating 180 kWp while green layer cools panels improving efficiency by 8%' },
  { id: 'GRI-005', projectId: 'GRI-005', city: 'Hyderabad', developer: 'Deccan Green Builds', roofType: 'Biodiverse Brown Roof',
    areaSqM: 6000, investmentCr: 280, stormwaterL: 18000, status: 'Delivered', priority: 'Medium', origin: 'HITEC City Campus', destination: 'Gachibowli Zone', shipDate: '2024-02-05', transitDays: 7, state: 'Telangana',
    remarks: 'Brown roof using local subsoil and recycled rubble to create biodiverse habitat for 30+ bird species, butterflies, and native pollinator insects' },
  { id: 'GRI-006', projectId: 'GRI-006', city: 'Kolkata', developer: 'Bengal Green Terraces', roofType: 'Modular Green Roof',
    areaSqM: 7500, investmentCr: 340, stormwaterL: 22500, status: 'In Transit', priority: 'Medium', origin: 'Salt Lake Sector V', destination: 'New Town Eco Hub', shipDate: '2024-05-15', transitDays: 11, state: 'West Bengal',
    remarks: 'Modular tray system enabling rapid installation across 3 Salt Lake IT towers, snap-to-join irrigation with automated fertigation and remote monitoring' },
  { id: 'GRI-007', projectId: 'GRI-007', city: 'Pune', developer: 'Pune Terrace Gardens', roofType: 'Living Wall Terrace',
    areaSqM: 5500, investmentCr: 310, stormwaterL: 16500, status: 'Delivered', priority: 'Medium', origin: 'Hinjewadi Phase 2', destination: 'Baner IT Corridor', shipDate: '2024-03-25', transitDays: 9, state: 'Maharashtra',
    remarks: 'Vertical living walls combined with terrace garden at Hinjewadi tech campus, covering 2,200 sqm of vertical surface with 80% humidity buffer effect' },
  { id: 'GRI-008', projectId: 'GRI-008', city: 'Ahmedabad', developer: 'Gujarat Green Roofs', roofType: 'Stormwater Green Roof',
    areaSqM: 9200, investmentCr: 420, stormwaterL: 55000, status: 'Delivered', priority: 'High', origin: 'SG Highway Mall', destination: 'Navrangpura Commercial', shipDate: '2024-01-30', transitDays: 8, state: 'Gujarat',
    remarks: 'Engineered stormwater retention green roof with 55,000 L capacity, featuring sensor-monitored drainage layers reducing Ahmedabad&apos;s monsoon runoff peak by 40%' },
  { id: 'GRI-009', projectId: 'GRI-009', city: 'Jaipur', developer: 'Rajasthan Terrace Green', roofType: 'Intensive Green Roof',
    areaSqM: 4800, investmentCr: 240, stormwaterL: 14400, status: 'Processing', priority: 'Medium', origin: 'Tonk Road Business Park', destination: 'Malviya Nagar', shipDate: '2024-07-10', transitDays: 14, state: 'Rajasthan',
    remarks: 'Desert-adapted intensive green roof using xeriscaping with native arid plants, requiring 60% less irrigation than conventional green roof designs' },
  { id: 'GRI-010', projectId: 'GRI-010', city: 'Lucknow', developer: 'UP Green Infrastructure', roofType: 'Extensive Green Roof',
    areaSqM: 6200, investmentCr: 290, stormwaterL: 18600, status: 'Delivered', priority: 'Medium', origin: 'Hazratganj Commercial', destination: 'Gomti Nagar IT', shipDate: '2024-04-05', transitDays: 10, state: 'Uttar Pradesh',
    remarks: 'Lightweight extensive green roof on heritage building near Hazratganj, using sedum mats and drought-tolerant ground covers preserving building structural integrity' },
  { id: 'GRI-011', projectId: 'GRI-011', city: 'Indore', developer: 'MP Green Terrace', roofType: 'Rooftop Farm',
    areaSqM: 4000, investmentCr: 200, stormwaterL: 12000, status: 'In Transit', priority: 'Medium', origin: 'Super Corridor IT Park', destination: 'Vijay Nagar Mall', shipDate: '2024-05-28', transitDays: 13, state: 'MP',
    remarks: 'Community rooftop farm in Indore&apos;s cleanest city initiative, growing organic tomatoes, capsicum, and herbs sold directly to local restaurants and residents' },
  { id: 'GRI-012', projectId: 'GRI-012', city: 'Kochi', developer: 'Kerala Green Tops', roofType: 'Solar-Green Hybrid',
    areaSqM: 3500, investmentCr: 320, stormwaterL: 10500, status: 'Processing', priority: 'Low', origin: 'Lulu Mall Tower', destination: 'Edappally Commercial', shipDate: '2024-07-20', transitDays: 16, state: 'Kerala',
    remarks: 'Tropical-adapted solar-green hybrid with monsoon-resistant drainage, producing 65 kWp while green layer reduces heat island effect by 5&#176;C in surrounding area' },
  { id: 'GRI-013', projectId: 'GRI-013', city: 'Guwahati', developer: 'NE Green Roofs', roofType: 'Biodiverse Brown Roof',
    areaSqM: 3000, investmentCr: 150, stormwaterL: 9000, status: 'Delivered', priority: 'Low', origin: 'Paltan Bazaar Complex', destination: 'GS Road Commercial', shipDate: '2024-03-30', transitDays: 18, state: 'Assam',
    remarks: 'Northeast India&apos;s first biodiverse brown roof using bamboo structural support, native orchids, and Assam tea garden companion plants for ecological connectivity' },
  { id: 'GRI-014', projectId: 'GRI-014', city: 'Bhubaneswar', developer: 'Odisha Terrace Green', roofType: 'Modular Green Roof',
    areaSqM: 4200, investmentCr: 195, stormwaterL: 12600, status: 'Delayed', priority: 'Low', origin: 'Infocity Tower', destination: 'Patia IT Park', shipDate: '2024-06-15', transitDays: 20, state: 'Odisha',
    remarks: 'Delayed due to cyclone-resistant structural upgrades, modular system designed to withstand 200 kmph winds with reinforced edge barriers and anchoring' },
]

export default function GreenRoofInfrastructureView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof GRIRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'roofType', label: 'Roof Type', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.roofType] = (m[r.roofType] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Green Roof Area', value: `${filtered.reduce((a: number, r) => a + r.areaSqM, 0).toLocaleString()} sqm` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Stormwater Retention', value: `${(filtered.reduce((a: number, r) => a + r.stormwaterL, 0) / 1000).toFixed(1)}K L` },
    { label: 'Active Installations', value: String(filtered.filter(r => r.status === 'Delivered').length) },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: GRIRecord) => string, val: (r: GRIRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.areaSqM)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const roofBar = grp(r => r.roofType, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const costSqm = filtered.map(r => ({ name: r.city.split(' ')[0].slice(0, 12), value: +(r.investmentCr * 100 / r.areaSqM).toFixed(0) }))
    const lm = filtered.reduce((a: Record<string, { areaSqM: number; stormwaterL: number }>, r) => {
      if (!a[r.state]) a[r.state] = { areaSqM: 0, stormwaterL: 0 }
      a[r.state].areaSqM += r.areaSqM; a[r.state].stormwaterL += r.stormwaterL; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, areaSqM: v.areaSqM, stormwaterL: v.stormwaterL }))
    return { barState, pieState, statusPie, roofBar, priorityPie, totalInvest, costSqm, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="gri-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Green Roof Infrastructure' }]} />
      <PageHeader title="Green Roof Infrastructure Logistics" description="Track green roof installations, rooftop farms, and urban cooling infrastructure across Indian cities" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="gri-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`gri-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-green-700 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="gri-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="gri-kpi-card"><CardContent className="p-4"><p className="gri-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="gri-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="gri-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="gri-chart-title text-sm">Green Roof Area by State (sqm)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#15803d" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="gri-chart-title text-sm">Installations by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="gri-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="gri-chart-title text-sm">Cost per sqm (&#8377;/sqm)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.costSqm}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#16a34a" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="gri-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="gri-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`gri-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-green-700'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.developer} | {r.roofType} | {r.state}</p>
              <p className="text-xs mt-1">{r.areaSqM.toLocaleString()} sqm | {r.stormwaterL.toLocaleString()} L | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="gri-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="gri-chart-title text-sm">Green Roof Area vs Stormwater</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="areaSqM" stroke="#15803d" name="Area sqm" /><Line yAxisId="right" type="monotone" dataKey="stormwaterL" stroke="#0ea5e9" name="Stormwater L" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="gri-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#22c55e" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="gri-chart-title text-sm">Roof Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.roofBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#4ade80" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="gri-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="gri-insights grid grid-cols-2 gap-4">
        <Card className="gri-insight-card border-l-4 border-l-green-700"><CardContent className="p-5">
          <h4 className="gri-insight-title font-semibold text-base">Urban Heat Island Mitigation</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Green roofs reduce surface temperatures by 15-25&#176;C compared to conventional concrete roofs. Indian cities like Delhi and Ahmedabad with UHI effects exceeding 5&#176;C can benefit significantly, with modeling showing 2-4&#176;C cooling within 500m radius of large installations.</p>
        </CardContent></Card>
        <Card className="gri-insight-card border-l-4 border-l-green-700"><CardContent className="p-5">
          <h4 className="gri-insight-title font-semibold text-base">Stormwater Management Impact</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">A mature green roof retains 50-80% of annual rainfall, reducing peak runoff by 60-90% during monsoon events. For Indian cities facing frequent urban flooding like Mumbai, Chennai, and Bengaluru, widespread adoption could prevent &#8377;2,000 Cr in annual flood damage.</p>
        </CardContent></Card>
        <Card className="gri-insight-card border-l-4 border-l-green-700"><CardContent className="p-5">
          <h4 className="gri-insight-title font-semibold text-base">Rooftop Farming and Food Security</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s rooftop farms can yield 15-25 kg of vegetables per sqm annually. Bengaluru&apos;s 85,000 sqm of rooftop farms produce over 1,200 tonnes of organic produce yearly, supplying 200+ restaurants and reducing food-miles by 90% compared to rural supply chains.</p>
        </CardContent></Card>
        <Card className="gri-insight-card border-l-4 border-l-green-700"><CardContent className="p-5">
          <h4 className="gri-insight-title font-semibold text-base">Solar-Green Hybrid Synergy</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Combining solar panels with green roofs creates mutual benefits: plants cool panels by 3-8&#176;C boosting output by 5-12%, while panels provide partial shade reducing plant water needs by 20-30%. India&apos;s 100 GW rooftop solar target could integrate green roofs across 500+ million sqm.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
