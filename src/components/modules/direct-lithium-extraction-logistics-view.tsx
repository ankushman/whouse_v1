'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface DLERecord {
  id: string; projectId: string; city: string; operator: string; sourceType: string
  lithiumOutputTPD: number; investmentCr: number; recoveryRate: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#0369a1', '#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc', '#075985', '#0c4a6e', '#bae6fd']

const records: DLERecord[] = [
  { id: 'DLE-0001', projectId: 'DLE-001', city: 'Kutch', operator: 'Gujarat Lithium DLE Corp', sourceType: 'Continental Brine Aquifer',
    lithiumOutputTPD: 85, investmentCr: 580, recoveryRate: 92, status: 'Delivered', priority: 'Critical', origin: 'Little Rann of Kutch', destination: 'Kutch Li Processing Hub', shipDate: '2025-04-05', transitDays: 2, state: 'Gujarat',
    remarks: 'Direct Lithium Extraction from continental brine aquifer in Little Rann of Kutch at 85 TPD output. DLE technology using Li-selective crown ether sorbent achieving 92% recovery rate from 200 ppm Li brine. &#8377;580 Cr investment includes solar-powered evaporation ponds and ion-exchange processing plant for battery-grade Li2CO3 production.' },
  { id: 'DLE-0002', projectId: 'DLE-002', city: 'Jodhpur', operator: 'Rajasthan Brine Minerals', sourceType: 'Sambhar Lake Brine',
    lithiumOutputTPD: 62, investmentCr: 420, recoveryRate: 88, status: 'Delivered', priority: 'Critical', origin: 'Sambhar Salt Lake', destination: 'Jodhpur Li Refinery', shipDate: '2025-04-10', transitDays: 3, state: 'Rajasthan',
    remarks: 'DLE from Sambhar Lake hypersaline brine at 62 TPD lithium output. India&apos;s largest salt lake contains estimated 2.4 million tonnes of lithium in brine reserves. &#8377;420 Cr plant uses aluminium hydroxide adsorbent DLE process with 88% extraction efficiency and zero liquid discharge system meeting Rajasthan pollution control norms.' },
  { id: 'DLE-0003', projectId: 'DLE-003', city: 'Nagaur', operator: 'Rajasthan State Minerals', sourceType: 'Groundwater Brine',
    lithiumOutputTPD: 45, investmentCr: 320, recoveryRate: 85, status: 'Delivered', priority: 'High', origin: 'Nagaur Basin Wellfield', destination: 'Nagaur DLE Plant', shipDate: '2025-04-02', transitDays: 1, state: 'Rajasthan',
    remarks: 'Groundwater brine DLE at Nagaur Basin extracting 45 TPD from 150 ppm Li concentration aquifers. Direct Lithium Extraction eliminates 18-month evaporation pond wait time of conventional methods. &#8377;320 Cr facility produces battery-grade lithium hydroxide for Tesla and Tata EV supply chain within 24 hours of brine extraction.' },
  { id: 'DLE-0004', projectId: 'DLE-004', city: 'Ladakh', operator: 'Himalayan Li Resources', sourceType: 'High-Altitude Brine Spring',
    lithiumOutputTPD: 25, investmentCr: 410, recoveryRate: 78, status: 'In Transit', priority: 'High', origin: 'Puga Valley Hot Springs', destination: 'Leh Processing Facility', shipDate: '2025-04-15', transitDays: 8, state: 'Ladakh',
    remarks: 'High-altitude brine spring DLE en route from Puga Valley geothermal springs at 4,500m elevation. 25 TPD output from geothermal brine with 78% recovery using titanium manganese oxide ion sieve. &#8377;410 Cr project includes portable DLE units deployable at remote Himalayan brine sites for strategic lithium security in extreme terrain.' },
  { id: 'DLE-0005', projectId: 'DLE-005', city: 'Vishakhapatnam', operator: 'Vizag Li Solutions', sourceType: 'Seawater Desalination Brine',
    lithiumOutputTPD: 35, investmentCr: 480, recoveryRate: 72, status: 'Delivered', priority: 'High', origin: 'Vizag Desalination Plant', destination: 'Vizag Li Recovery Unit', shipDate: '2025-03-28', transitDays: 1, state: 'Andhra Pradesh',
    remarks: 'Seawater desalination brine DLE at Visakhapatnam extracting 35 TPD from concentrated reject brine. Process integrated with existing 100 MLD desalination plant using manganese oxide intercalation electrode. &#8377;480 Cr investment produces Li2CO3 as byproduct of desalination converting waste brine into strategic lithium resource.' },
  { id: 'DLE-0006', projectId: 'DLE-006', city: 'Chennai', operator: 'Tamil Nadu Li Extraction', sourceType: 'Brackish Water Estuary',
    lithiumOutputTPD: 40, investmentCr: 350, recoveryRate: 82, status: 'Delivered', priority: 'Medium', origin: 'Pulicat Lake Estuary', destination: 'Chennai Li Chemical Park', shipDate: '2025-04-08', transitDays: 2, state: 'Tamil Nadu',
    remarks: 'Brackish water estuary DLE at Pulicat Lake extracting 40 TPD from mixed freshwater-seawater interface zone. Li-selective membrane process achieves 82% recovery with minimal environmental impact on sensitive estuary ecosystem. &#8377;350 Cr project includes real-time brine monitoring and automated flow control for sustainable extraction operations.' },
  { id: 'DLE-0007', projectId: 'DLE-007', city: 'Bengaluru', operator: 'Karnataka Geothermal Li', sourceType: 'Geothermal Brine Reservoir',
    lithiumOutputTPD: 55, investmentCr: 520, recoveryRate: 90, status: 'Delivered', priority: 'Critical', origin: 'Bellary Geothermal Field', destination: 'Bengaluru Li Processing', shipDate: '2025-03-25', transitDays: 4, state: 'Karnataka',
    remarks: 'Geothermal brine DLE at Bellary geothermal field with 55 TPD from 350&#176;C reservoir brine at 1,200 ppm Li concentration. Highest-grade Indian lithium brine processed using lithium titanium oxide precursor DLE. &#8377;520 Cr integrated geothermal power-DLE plant generating 20 MW electricity plus battery-grade lithium hydroxide.' },
  { id: 'DLE-0008', projectId: 'DLE-008', city: 'Mumbai', operator: 'LTI Lithium India', sourceType: 'Oilfield Produced Water',
    lithiumOutputTPD: 48, investmentCr: 390, recoveryRate: 75, status: 'Delivered', priority: 'High', origin: 'Mumbai Offshore Basin', destination: 'Navi Mumbai Li Hub', shipDate: '2025-04-12', transitDays: 3, state: 'Maharashtra',
    remarks: 'Oilfield produced water DLE from Mumbai offshore basin recovering 48 TPD lithium from petroleum extraction wastewater. Crown ether DLE process achieving 75% recovery from complex produced water with hydrocarbon contaminants. &#8377;390 Cr investment converts petroleum waste stream into strategic lithium resource for Indian EV battery supply chain.' },
  { id: 'DLE-0009', projectId: 'DLE-009', city: 'Kolkata', operator: 'Bengal Li Brine Corp', sourceType: 'Hugli River Estuary Brine',
    lithiumOutputTPD: 30, investmentCr: 260, recoveryRate: 80, status: 'Delayed', priority: 'Medium', origin: 'Hugli Estuary Point', destination: 'Haldia DLE Plant', shipDate: '2025-03-15', transitDays: 3, state: 'West Bengal',
    remarks: 'Hugli River estuary DLE at Haldia delayed by monsoon flooding affecting construction schedule. 30 TPD capacity from estuarine brine with seasonal lithium concentration variations. &#8377;260 Cr plant uses aluminum-based DLE sorbent optimized for variable-salinity estuary conditions with modular scalability for future expansion.' },
  { id: 'DLE-0010', projectId: 'DLE-0010', city: 'Hyderabad', operator: 'Deccan Lithium Ltd', sourceType: 'Granite Weathered Zone Brine',
    lithiumOutputTPD: 38, investmentCr: 300, recoveryRate: 84, status: 'Delivered', priority: 'Medium', origin: 'Deccan Plateau Wells', destination: 'Hyderabad Li Refinery', shipDate: '2025-04-18', transitDays: 1, state: 'Telangana',
    remarks: 'Granite weathered zone brine DLE from Deccan Plateau geological formations extracting 38 TPD. Lithium-rich groundwater from weathered granite aquifers at 300-500m depth processed using hydrogen titanate DLE. &#8377;300 Cr facility serves South India EV battery manufacturers including Mahindra and Ola Electric with local lithium supply.' },
  { id: 'DLE-0011', projectId: 'DLE-0011', city: 'Gandhinagar', operator: 'Gujarat Green Li Tech', sourceType: 'Solar Evaporation Pond Brine',
    lithiumOutputTPD: 70, investmentCr: 450, recoveryRate: 91, status: 'In Transit', priority: 'Critical', origin: 'Mithapur Salt Pans', destination: 'Gandhinagar Li Processing', shipDate: '2025-04-22', transitDays: 2, state: 'Gujarat',
    remarks: 'Solar-evaporation concentrated brine DLE en route from Mithapur salt pans at 70 TPD capacity. Pre-concentrated brine with 2,000 ppm Li using solar evaporation followed by rapid DLE processing. &#8377;450 Cr hybrid solar-DLE approach reduces processing energy by 40% compared to direct brine DLE with 91% recovery rate achieved.' },
  { id: 'DLE-0012', projectId: 'DLE-0012', city: 'Bhubaneswar', operator: 'Odisha Li Resources', sourceType: 'Laterite Leachate Brine',
    lithiumOutputTPD: 22, investmentCr: 190, recoveryRate: 76, status: 'Delivered', priority: 'Low', origin: 'Kalahandi Laterite', destination: 'Bhubaneswar Li Plant', shipDate: '2025-04-06', transitDays: 2, state: 'Odisha',
    remarks: 'Laterite leachate brine DLE from Odisha&apos;s nickel-cobalt laterite mining operations at 22 TPD. Co-extraction of lithium alongside nickel and cobalt from laterite leaching waste streams. &#8377;190 Cr plant demonstrates multi-metal DLE recovery at 76% lithium efficiency from low-grade 80 ppm laterite leachate brine.' },
  { id: 'DLE-0013', projectId: 'DLE-0013', city: 'Guwahati', operator: 'NE Brine Lithium', sourceType: 'Brahmaputra Floodplain Brine',
    lithiumOutputTPD: 28, investmentCr: 220, recoveryRate: 79, status: 'Processing', priority: 'Low', origin: 'Brahmaputra Aquifer', destination: 'Guwahati Li Facility', shipDate: '2025-04-25', transitDays: 3, state: 'Assam',
    remarks: 'Brahmaputra floodplain alluvial brine DLE under processing for 28 TPD output from Assam&apos;s vast aquifer systems. Manganese oxide DLE ion sieve optimized for monsoon-season high-flow conditions. &#8377;220 Cr pilot facility exploring Northeast India&apos;s lithium potential across Brahmaputra, Barak and Meghna river basin aquifers.' },
  { id: 'DLE-0014', projectId: 'DLE-0014', city: 'Jaipur', operator: 'Rajasthan Premium Li', sourceType: 'Saline Playa Brine',
    lithiumOutputTPD: 58, investmentCr: 460, recoveryRate: 93, status: 'Delayed', priority: 'High', origin: 'Didwana Salt Lake', destination: 'Jaipur Li Refinery', shipDate: '2025-03-20', transitDays: 4, state: 'Rajasthan',
    remarks: 'Saline playa brine DLE at Didwana Salt Lake delayed by land acquisition issues for processing plant expansion. 58 TPD capacity from Rajasthan&apos;s third-largest saline lake with premium-grade 93% recovery. &#8377;460 Cr investment targets 99.9% purity battery-grade lithium carbonate for premium EV cell manufacturers under PLI scheme.' },
]

export default function DirectLithiumExtractionLogisticsView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof DLERecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'sourceType', label: 'Source Type', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.sourceType] = (m[r.sourceType] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Li Output', value: `${filtered.reduce((a: number, r) => a + r.lithiumOutputTPD, 0).toLocaleString()} TPD` },
    { label: 'Avg Recovery Rate', value: `${(filtered.reduce((a: number, r) => a + r.recoveryRate, 0) / Math.max(1, filtered.length)).toFixed(1)}%` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Avg Cost/TPD', value: `&#8377;${(filtered.reduce((a: number, r) => a + r.investmentCr, 0) / Math.max(1, filtered.reduce((a: number, r) => a + r.lithiumOutputTPD, 0))).toFixed(1)} Cr` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: DLERecord) => string, val: (r: DLERecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.lithiumOutputTPD)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const matBar = grp(r => r.sourceType, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const effData = filtered.map(r => ({ name: r.sourceType.split(' ').slice(0, 2).join(' '), value: r.recoveryRate }))
    const lm = filtered.reduce((a: Record<string, { lithiumOutputTPD: number; investmentCr: number }>, r) => {
      if (!a[r.state]) a[r.state] = { lithiumOutputTPD: 0, investmentCr: 0 }
      a[r.state].lithiumOutputTPD += r.lithiumOutputTPD; a[r.state].investmentCr += r.investmentCr; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, lithiumOutputTPD: v.lithiumOutputTPD, investmentCr: v.investmentCr }))
    return { barState, pieState, statusPie, matBar, priorityPie, totalInvest, effData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="dle-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Direct Lithium Extraction' }]} />
      <PageHeader title="Direct Lithium Extraction Logistics" description="Track direct lithium extraction from brine and groundwater sources, DLE technology supply chains, lithium processing logistics and battery-grade lithium carbonate production across India" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="dle-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`dle-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-sky-900 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="dle-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="dle-kpi-card"><CardContent className="p-4"><p className="dle-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="dle-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="dle-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="dle-chart-title text-sm">Li Output (TPD) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#0369a1" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="dle-chart-title text-sm">Installations by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="dle-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="dle-chart-title text-sm">Recovery Rate (%) by Source Type</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.effData}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} domain={[65, 100]} /><Tooltip /><Bar dataKey="value" fill="#0284c7" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="dle-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="dle-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`dle-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-sky-900'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.sourceType} | {r.state}</p>
              <p className="text-xs mt-1">{r.lithiumOutputTPD.toLocaleString()} TPD | {r.recoveryRate}% recovery | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="dle-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="dle-chart-title text-sm">Li Output vs Investment by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="lithiumOutputTPD" stroke="#0369a1" name="Li TPD" /><Line yAxisId="right" type="monotone" dataKey="investmentCr" stroke="#7dd3fc" name="Investment &#8377; Cr" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="dle-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#0c4a6e" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="dle-chart-title text-sm">Source Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.matBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#0284c7" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="dle-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="dle-insights grid grid-cols-2 gap-4">
        <Card className="dle-insight-card border-l-4 border-l-sky-900"><CardContent className="p-5">
          <h4 className="dle-insight-title font-semibold text-base">India&apos;s &#8377;18,000 Cr Lithium Security Mission</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India imports 100% of its lithium, spending &#8377;24,000 Cr annually on lithium-ion battery raw materials. Geological Survey of India discovered 5.9 million tonnes of lithium resources in Rajasthan, Karnataka and J&amp;K brine reserves. DLE technology enables rapid extraction within hours vs 18 months for conventional evaporation ponds, achieving &#8377;18,000 Cr domestic lithium production target by 2030.</p>
        </CardContent></Card>
        <Card className="dle-insight-card border-l-4 border-l-sky-900"><CardContent className="p-5">
          <h4 className="dle-insight-title font-semibold text-base">Rajasthan: India&apos;s Lithium Valley</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Rajasthan&apos;s Sambhar, Didwana, Kuchaman and Pachpadra salt lakes contain an estimated 3.2 million tonnes of lithium in brine form. State government allocating &#8377;5,000 Cr for lithium DLE industrial corridor. Four operating DLE plants and three under construction make Rajasthan India&apos;s lithium capital, targeting 500 TPD output by 2028 for PLI-certified battery cell manufacturers.</p>
        </CardContent></Card>
        <Card className="dle-insight-card border-l-4 border-l-sky-900"><CardContent className="p-5">
          <h4 className="dle-insight-title font-semibold text-base">DLE vs Conventional: 10x Faster Processing</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Direct Lithium Extraction processes brine in 4-24 hours versus 12-18 months for traditional solar evaporation ponds. DLE achieves higher recovery rates of 80-95% vs 40-60% for evaporation. India&apos;s Ministry of Mines mandating DLE technology for all new brine lithium licences, with &#8377;2,000 Cr R&amp;D funding for indigenous DLE sorbent development at CSIR and IIT institutions.</p>
        </CardContent></Card>
        <Card className="dle-insight-card border-l-4 border-l-sky-900"><CardContent className="p-5">
          <h4 className="dle-insight-title font-semibold text-base">Oilfield Produced Water: Hidden Li Treasure</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s 700 oilfields generate 2.5 million barrels per day of produced water containing 50-300 ppm lithium. ONGC and Oil India partnering with DLE companies to extract lithium from petroleum waste. Mumbai offshore, Assam and Gujarat onshore fields offer combined 15,000 TPD lithium potential, converting petroleum waste into strategic battery material at near-zero extraction cost.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
