'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface UMLRecord {
  id: string; projectId: string; city: string; operator: string; wasteType: string
  throughputTPD: number; investmentCr: number; recoveryPercent: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#5c3d2e', '#78350f', '#92400e', '#a16207', '#b45309', '#ca8a04', '#d97706', '#eab308']

const records: UMLRecord[] = [
  { id: 'UML-001', projectId: 'UML-001', city: 'Delhi', operator: 'Delhi Urban Mine Corp', wasteType: 'E-Waste PCB Recovery',
    throughputTPD: 350, investmentCr: 420, recoveryPercent: 92, status: 'Delivered', priority: 'Critical', origin: 'Nehru Place Collection', destination: 'Okhla Processing', shipDate: '2024-01-15', transitDays: 5, state: 'Delhi',
    remarks: '350 TPD e-waste urban mining facility extracting gold, silver, copper, palladium from PCBs and semiconductor scrap at Okhla industrial area, 92% material recovery with zero-landfill operation serving Delhi NCR&apos;s 1.8 Lakh MT annual e-waste generation' },
  { id: 'UML-002', projectId: 'UML-002', city: 'Bengaluru', operator: 'Karnataka Rare Earth Mine', wasteType: 'Li-Ion Battery Recovery',
    throughputTPD: 200, investmentCr: 580, recoveryPercent: 88, status: 'Delivered', priority: 'Critical', origin: 'Electronic City Hub', destination: 'Bidadi Industrial', shipDate: '2024-01-28', transitDays: 7, state: 'Karnataka',
    remarks: '200 TPD lithium-ion battery urban mining recovering lithium carbonate, cobalt, nickel, and graphite from EV and consumer electronics batteries, 88% cathode material recovery supplying Bengaluru&apos;s EV battery manufacturing cluster' },
  { id: 'UML-003', projectId: 'UML-003', city: 'Mumbai', operator: 'Maharashtra Scrap Mine', wasteType: 'Construction Debris Aggregate',
    throughputTPD: 1800, investmentCr: 310, recoveryPercent: 85, status: 'Delivered', priority: 'High', origin: 'BKC Demolition Sites', destination: 'Goregaon Recycling', shipDate: '2024-02-10', transitDays: 6, state: 'Maharashtra',
    remarks: '1,800 TPD construction and demolition waste urban mining producing recycled aggregate, sand, and steel reinforcement recovery for Mumbai&apos;s 50,000 Cr infrastructure pipeline, reducing virgin material demand by 35%' },
  { id: 'UML-004', projectId: 'UML-004', city: 'Chennai', operator: 'TN Auto Shred Mine', wasteType: 'End-of-Life Vehicle Shredding',
    throughputTPD: 280, investmentCr: 350, recoveryPercent: 90, status: 'Delivered', priority: 'High', origin: 'Ambattur Collection', destination: 'Oragadam Auto Park', shipDate: '2024-02-22', transitDays: 8, state: 'Tamil Nadu',
    remarks: '280 TPD end-of-life vehicle shredding and material recovery, extracting steel (65%), aluminum (8%), copper (3%), plastics (12%), and rubber (5%) from 15,000 annual ELVs, supplying Chennai&apos;s auto component re-manufacturing industry' },
  { id: 'UML-005', projectId: 'UML-005', city: 'Hyderabad', operator: 'AP E-City Urban Mine', wasteType: 'Server Farm Hardware',
    throughputTPD: 120, investmentCr: 390, recoveryPercent: 94, status: 'In Transit', priority: 'High', origin: 'HITEC City Data Centers', destination: 'Gachibowli Tech Park', shipDate: '2024-04-15', transitDays: 9, state: 'Telangana',
    remarks: '120 TPD data center equipment urban mining recovering rare earth magnets, gold-plated connectors, DDR memory chips, and silicon wafers from server decommissioning at Hyderabad&apos;s 85 MW data center corridor' },
  { id: 'UML-006', projectId: 'UML-006', city: 'Pune', operator: 'Pune Metal Recovery Mine', wasteType: 'Aluminium Dross Processing',
    throughputTPD: 450, investmentCr: 220, recoveryPercent: 87, status: 'Delivered', priority: 'Medium', origin: 'Chakan Auto Cluster', destination: 'Ranjangaon MIDC', shipDate: '2024-03-05', transitDays: 6, state: 'Maharashtra',
    remarks: '450 TPD aluminum dross urban mining recovering 87% metallic aluminum from foundry and die-casting operations in Pune&apos;s auto manufacturing cluster, reducing primary aluminum import dependency by 12,000 MT annually' },
  { id: 'UML-007', projectId: 'UML-007', city: 'Kolkata', operator: 'WB Copper Cable Mine', wasteType: 'Copper Wire Recovery',
    throughputTPD: 180, investmentCr: 260, recoveryPercent: 91, status: 'Delivered', priority: 'Medium', origin: 'Taratolla Scrap Yard', destination: 'Howrah Industrial', shipDate: '2024-03-18', transitDays: 10, state: 'West Bengal',
    remarks: '180 TPD copper cable and transformer urban mining recovering 99.9% pure copper cathode from legacy power infrastructure, telecom cable scrap, and railway overhead wire replacements across Eastern India&apos;s railway modernization program' },
  { id: 'UML-008', projectId: 'UML-008', city: 'Jaipur', operator: 'Rajasthan Marble Slurry Mine', wasteType: 'Marble Slurry Processing',
    throughputTPD: 2200, investmentCr: 180, recoveryPercent: 72, status: 'Delivered', priority: 'Medium', origin: 'Makrana Quarries', destination: 'Kishangarh Industrial', shipDate: '2024-03-28', transitDays: 12, state: 'Rajasthan',
    remarks: '2,200 TPD marble slurry urban mining recovering calcium carbonate, fine aggregate, and mineral pigments from Rajasthan&apos;s 350+ marble processing units, converting waste slurry into construction-grade material and reducing water pollution in Banas river basin' },
  { id: 'UML-009', projectId: 'UML-009', city: 'Ahmedabad', operator: 'Gujarat Textile Fiber Mine', wasteType: 'Textile Waste Regeneration',
    throughputTPD: 600, investmentCr: 280, recoveryPercent: 78, status: 'In Transit', priority: 'Medium', origin: 'Surat Textile Market', destination: 'Vatva Industrial', shipDate: '2024-05-10', transitDays: 8, state: 'Gujarat',
    remarks: '600 TPD textile waste urban mining regenerating polyester fiber, cotton lint, and viscose pulp from Surat-Ahmedabad textile cluster&apos;s 45,000 MT annual pre-consumer and post-consumer textile waste, producing recycled yarn for fast fashion circular supply chains' },
  { id: 'UML-010', projectId: 'UML-010', city: 'Indore', operator: 'MP Plastic Waste Mine', wasteType: 'Multi-Layer Packaging Recovery',
    throughputTPD: 500, investmentCr: 320, recoveryPercent: 65, status: 'Processing', priority: 'High', origin: 'Indore Segregation Center', destination: 'Pithampur Industrial', shipDate: '2024-06-20', transitDays: 9, state: 'Madhya Pradesh',
    remarks: '500 TPD multi-layer plastic packaging urban mining using solvent-based delamination to recover PE, PP, and aluminum layers from MLP waste, India&apos;s first commercial-scale solution addressing 3.3 MT annual MLP crisis in Indore smart city region' },
  { id: 'UML-011', projectId: 'UML-011', city: 'Lucknow', operator: 'UP Tyre Rubber Mine', wasteType: 'End-of-Life Tyre Pyrolysis',
    throughputTPD: 380, investmentCr: 250, recoveryPercent: 82, status: 'Delivered', priority: 'Medium', origin: 'Amausi Transport Hub', destination: 'Lucknow Industrial', shipDate: '2024-04-08', transitDays: 11, state: 'Uttar Pradesh',
    remarks: '380 TPD end-of-life tyre urban mining through pyrolysis recovering carbon black, pyrolysis oil, and steel wire from UP&apos;s 2.5 Lakh annual ELT generation, producing 120 TPD of recovered carbon black for tyre manufacturing and 90 KL/day pyrolysis oil for boiler fuel' },
  { id: 'UML-012', projectId: 'UML-012', city: 'Bhubaneswar', operator: 'Odisha Steel Slag Mine', wasteType: 'Steel Slag Aggregate',
    throughputTPD: 1500, investmentCr: 290, recoveryPercent: 76, status: 'Delivered', priority: 'Medium', origin: 'Rourkela Steel Plant', destination: 'Paradip Port Zone', shipDate: '2024-04-22', transitDays: 15, state: 'Odisha',
    remarks: '1,500 TPD steel slag urban mining from Rourkela, Jajpur, and Paradip steel plants producing BOF and EAF slag aggregate for road construction, cement additive, and soil conditioner, reducing Odisha&apos;s 8 MT annual slag dumping burden by 40%' },
  { id: 'UML-013', projectId: 'UML-013', city: 'Kochi', operator: 'Kerala Ship Breaking Mine', wasteType: 'Ship Breaking Steel Recovery',
    throughputTPD: 900, investmentCr: 450, recoveryPercent: 88, status: 'Delayed', priority: 'High', origin: 'Cochin Shipyard', destination: 'Vallarpadam IT Park', shipDate: '2024-06-01', transitDays: 14, state: 'Kerala',
    remarks: '900 TPD ship-breaking and offshore platform decommissioning urban mining recovering marine-grade steel, copper piping, navigation electronics, and rare metals from Alang-standard ship recycling operations at Cochin port with HKC Convention compliance' },
  { id: 'UML-014', projectId: 'UML-014', city: 'Guwahati', operator: 'NE Glass Cullet Mine', wasteType: 'Glass Cullet Processing',
    throughputTPD: 280, investmentCr: 120, recoveryPercent: 95, status: 'In Transit', priority: 'Low', origin: 'Guwahati Collection', destination: 'Rangiya Industrial', shipDate: '2024-05-28', transitDays: 16, state: 'Assam',
    remarks: '280 TPD glass cullet urban mining processing container, automotive, and flat glass waste into furnace-ready cullet for bottle manufacturing, 95% recovery rate reducing silica sand mining demand by 40% and cutting melting energy by 25% for Northeast India&apos;s glass industry' },
]

export default function UrbanMiningLogisticsView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof UMLRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'wasteType', label: 'Waste Type', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.wasteType] = (m[r.wasteType] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Throughput', value: `${filtered.reduce((a: number, r) => a + r.throughputTPD, 0).toLocaleString()} TPD` },
    { label: 'Avg Recovery Rate', value: `${(filtered.reduce((a: number, r) => a + r.recoveryPercent, 0) / Math.max(1, filtered.length)).toFixed(1)}%` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Avg Cost/TPD', value: `&#8377;${(filtered.reduce((a: number, r) => a + r.investmentCr, 0) / Math.max(1, filtered.reduce((a: number, r) => a + r.throughputTPD, 0))).toFixed(2)} Cr/TPD` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: UMLRecord) => string, val: (r: UMLRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.throughputTPD)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const wasteBar = grp(r => r.wasteType, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const effData = filtered.map(r => ({ name: r.city.slice(0, 10), value: r.recoveryPercent }))
    const lm = filtered.reduce((a: Record<string, { throughputTPD: number; recoveryPercent: number }>, r) => {
      if (!a[r.state]) a[r.state] = { throughputTPD: 0, recoveryPercent: 0 }
      a[r.state].throughputTPD += r.throughputTPD; a[r.state].recoveryPercent += r.recoveryPercent; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, throughputTPD: v.throughputTPD, avgRecovery: +(v.recoveryPercent / Math.max(1, filtered.filter(r => r.state === name).length)).toFixed(1) }))
    return { barState, pieState, statusPie, wasteBar, priorityPie, totalInvest, effData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="uml-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Urban Mining' }]} />
      <PageHeader title="Urban Mining Logistics" description="Track urban mining operations, material recovery from waste streams, circular economy logistics, and secondary resource extraction across India's industrial corridors" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="uml-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`uml-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-amber-900 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="uml-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="uml-kpi-card"><CardContent className="p-4"><p className="uml-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="uml-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="uml-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="uml-chart-title text-sm">Throughput (TPD) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#78350f" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="uml-chart-title text-sm">Mining Sites by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="uml-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="uml-chart-title text-sm">Recovery Rate by City (%)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.effData}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} domain={[0, 100]} /><Tooltip /><Bar dataKey="value" fill="#92400e" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="uml-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="uml-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`uml-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-amber-900'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.wasteType} | {r.state}</p>
              <p className="text-xs mt-1">{r.throughputTPD.toLocaleString()} TPD | {r.recoveryPercent}% recovery | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="uml-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="uml-chart-title text-sm">Throughput vs Recovery Rate by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} domain={[0, 100]} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="throughputTPD" stroke="#78350f" name="Throughput TPD" /><Line yAxisId="right" type="monotone" dataKey="avgRecovery" stroke="#16a34a" name="Avg Recovery %" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="uml-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#a16207" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="uml-chart-title text-sm">Waste Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.wasteBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#b45309" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="uml-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="uml-insights grid grid-cols-2 gap-4">
        <Card className="uml-insight-card border-l-4 border-l-amber-900"><CardContent className="p-5">
          <h4 className="uml-insight-title font-semibold text-base">India&apos;s &#8377;14.5 Lakh Cr Urban Mine Opportunity</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s urban areas generate 62 MT of solid waste annually containing recoverable materials worth &#8377;14.5 Lakh Cr. E-waste alone holds &#8377;2.5 Lakh Cr in precious metals. Urban mining can reduce India&apos;s import dependency on copper by 40%, rare earths by 25%, and lithium by 15% by 2035.</p>
        </CardContent></Card>
        <Card className="uml-insight-card border-l-4 border-l-amber-900"><CardContent className="p-5">
          <h4 className="uml-insight-title font-semibold text-base">Circular Economy EPR Compliance</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s Extended Producer Responsibility (EPR) rules mandate plastic, e-waste, battery, and tyre waste recovery targets. Urban mining operations provide EPR compliance infrastructure for 500+ producers, generating &#8377;3,200 Cr in EPR credit trading annually while ensuring material traceability from collection to recovery.</p>
        </CardContent></Card>
        <Card className="uml-insight-card border-l-4 border-l-amber-900"><CardContent className="p-5">
          <h4 className="uml-insight-title font-semibold text-base">Rare Earth Independence via Urban Mining</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India imports 100% of its rare earth requirements despite having 6% of global reserves. Urban mining of hard disk drives, smartphone speakers, wind turbine magnets, and EV motor components can recover 2,500 MT of neodymium, dysprosium, and praseodymium annually, reducing strategic dependency on China&apos;s rare earth monopoly.</p>
        </CardContent></Card>
        <Card className="uml-insight-card border-l-4 border-l-amber-900"><CardContent className="p-5">
          <h4 className="uml-insight-title font-semibold text-base">C&amp;D Waste: India&apos;s Largest Urban Mine</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Construction and demolition waste generates 150 MT annually in India, projected to reach 750 MT by 2030. Only 1% is currently recycled. Urban mining C&amp;D facilities can recover 85% as aggregate, steel, and sand, saving &#8377;8,000 Cr annually in virgin material costs and reducing illegal sand mining by 30% across major cities.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
