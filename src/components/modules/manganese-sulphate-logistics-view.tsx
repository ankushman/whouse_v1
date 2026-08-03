'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface MNSRecord {
  id: string; projectId: string; city: string; operator: string; processType: string
  capacityTPD: number; investmentCr: number; purity: number; recovery: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#7c2d12', '#9a3412', '#c2410c', '#ea580c', '#f97316', '#a3612a', '#78350f', '#451a03']

const records: MNSRecord[] = [
  { id: 'MNS-0001', projectId: 'MNS-001', city: 'Nagpur', operator: 'MOIL Manganese Sulphate Plant', processType: 'Pyrolusite Acid Leach',
    capacityTPD: 120, investmentCr: 480, purity: 98.5, recovery: 94.2, status: 'Delivered', priority: 'Critical', origin: 'MOIL Balaghat Mine', destination: 'Nagpur MnSO4 Hub', shipDate: '2025-05-05', transitDays: 2, state: 'Maharashtra',
    remarks: 'Pyrolusite acid leach manganese sulphate plant at MOIL Nagpur with 120 TPD capacity from Balaghat and Ukwa mine ore. Produces battery-grade MnSO4 monohydrate for lithium-ion cathode precursors NMC and NCA chemistry. &#8377;480 Cr facility serves as India&apos;s primary MnSO4 source for 50 GWh EV battery supply chain under National Battery Energy Storage Mission targeting &#8377;18,000 Cr annual manganese sulphate market.' },
  { id: 'MNS-0002', projectId: 'MNS-002', city: 'Balaghat', operator: 'MOIL Balaghat Sulphate Works', processType: 'Rhodochrosite Leach',
    capacityTPD: 95, investmentCr: 370, purity: 97.8, recovery: 92.5, status: 'Delivered', priority: 'Critical', origin: 'Balaghat Underground Mine', destination: 'Balaghat Processing Plant', shipDate: '2025-05-10', transitDays: 1, state: 'Madhya Pradesh',
    remarks: 'Rhodochrosite carbonate leach manganese sulphate at MOIL Balaghat underground mine with 95 TPD capacity. Direct ore-to-sulphate processing eliminates intermediate manganese metal step reducing cost by 35%. &#8377;370 Cr plant utilizes Balaghat&apos;s 40 million tonnes manganese ore reserve graded 38% MnO2 producing technical-grade MnSO4 for ferroalloy industry and agricultural micronutrient fertilizer supply across central India.' },
  { id: 'MNS-0003', projectId: 'MNS-003', city: 'Bhubaneswar', operator: 'Odisha Mn Chemical Works', processType: 'Manganese Nodule Leach',
    capacityTPD: 80, investmentCr: 310, purity: 98.2, recovery: 93.8, status: 'Delivered', priority: 'High', origin: 'Odisha Manganese Ore', destination: 'Bhubaneswar Chemical Zone', shipDate: '2025-05-02', transitDays: 2, state: 'Odisha',
    remarks: 'Manganese nodule sulphate leach plant at Bhubaneswar chemical zone with 80 TPD capacity from Odisha&apos;s Gondwana manganese deposits. &#8377;310 Cr facility produces ultra-pure MnSO4 for pharmaceutical-grade potassium permanganate and animal feed supplement markets. Odisha&apos;s 189 million tonnes manganese ore base supports 50-year plant life serving NALCO aluminium smelter water treatment and Vedanta Jharsuguda ferroalloy feedstock requirements.' },
  { id: 'MNS-0004', projectId: 'MNS-004', city: 'Bhilai', operator: 'SAIL Bhilai MnSO4 Unit', processType: 'Slag Leach Recovery',
    capacityTPD: 65, investmentCr: 245, purity: 96.5, recovery: 88.4, status: 'Delivered', priority: 'High', origin: 'Bhilai Steel Slag Dump', destination: 'Bhilai Chemical Works', shipDate: '2025-04-28', transitDays: 1, state: 'Chhattisgarh',
    remarks: 'Steel slag leach recovery manganese sulphate at Bhilai Steel Plant with 65 TPD capacity from BFS slag containing 12-15% MnO. Circular economy plant converts steel waste into valuable MnSO4 reducing slag disposal cost by &#8377;45 Cr annually. &#8377;245 Cr unit supports SAIL&apos;s 8 million tonne steel production with zero-waste manganese recovery supplying ferro-silico-manganese alloy makers in Chhattisgarh industrial corridor.' },
  { id: 'MNS-0005', projectId: 'MNS-005', city: 'Visakhapatnam', operator: 'Vizag Mn Sulphate Terminal', processType: 'Pyrolusite Roast Leach',
    capacityTPD: 85, investmentCr: 330, purity: 98.8, recovery: 95.1, status: 'In Transit', priority: 'High', origin: 'Vizag Port Mn Ore', destination: 'Vizag Export Processing', shipDate: '2025-05-15', transitDays: 3, state: 'Andhra Pradesh',
    remarks: 'Pyrolusite roast-leach manganese sulphate terminal at Visakhapatnam port with 85 TPD capacity processing imported South African and Gabonese manganese ore. &#8377;330 Cr dual-use plant produces battery-grade MnSO4 for Indian EV makers and exports technical-grade to Bangladesh and Vietnam. Vizag Port&apos;s deep-draft berths enable 65,000 DWT cape-size manganese ore carrier direct discharge reducing raw material logistics cost by 22% for eastern India battery supply chain.' },
  { id: 'MNS-0006', projectId: 'MNS-006', city: 'Ranchi', operator: 'Jharkhand Mn Processing', processType: 'Manganite Acid Digest',
    capacityTPD: 55, investmentCr: 210, purity: 97.5, recovery: 91.3, status: 'Delivered', priority: 'Medium', origin: 'Jharkhand Mn Belt', destination: 'Ranchi Industrial Area', shipDate: '2025-05-08', transitDays: 2, state: 'Jharkhand',
    remarks: 'Manganite acid digest manganese sulphate plant at Ranchi with 55 TPD capacity from Jharkhand&apos;s Singhbhum manganese belt. &#8377;210 Cr facility processes low-grade manganite ore at 28% Mn content through optimized acid digestion with iron impurity removal. Serves Jharkhand ferroalloy smelters and HEC Ranchi heavy electrical equipment manufacturing requiring high-purity MnSO4 for electroplating and battery electrode production.' },
  { id: 'MNS-0007', projectId: 'MNS-007', city: 'Kolkata', operator: 'Bengal Mn Chemical Plant', processType: 'Wad Leach Process',
    capacityTPD: 70, investmentCr: 268, purity: 98.0, recovery: 93.6, status: 'Delivered', priority: 'High', origin: 'Haldia Mn Terminal', destination: 'Kolkata Chemical Estate', shipDate: '2025-04-25', transitDays: 1, state: 'West Bengal',
    remarks: 'Wad manganese dioxide leach process plant at Kolkata chemical estate with 70 TPD capacity. Purified MnSO4 for EMFIL battery-grade NMC cathode production and agricultural micronutrient supply. &#8377;268 Cr plant serves West Bengal&apos;s 4 million tonne tea industry requiring MnSO4 foliar spray application and Hindalco aluminium smelter anode production. Haldia port logistics enables competitive export pricing for Bangladesh emerging battery manufacturing sector.' },
  { id: 'MNS-0008', projectId: 'MNS-008', city: 'Bengaluru', operator: 'Karnataka Mn Precursor Plant', processType: 'Electrolytic MnSO4 Recrystallization',
    capacityTPD: 45, investmentCr: 195, purity: 99.2, recovery: 96.8, status: 'Delivered', priority: 'Critical', origin: 'Sandur Mn Ore Supply', destination: 'Bengaluru Battery Park', shipDate: '2025-05-12', transitDays: 3, state: 'Karnataka',
    remarks: 'Electrolytic recrystallization manganese sulphate ultra-pure plant at Bengaluru Battery Park with 45 TPD capacity. Produces 99.2% purity MnSO4 single crystal for high-nickel NMC811 and NCA cathode precursor manufacturing. &#8377;195 Cr plant serves Tesla-FARISON gigafactory and Exide Industries cell production requiring pharmaceutical-grade MnSO4 with less than 5 ppm heavy metal contamination for next-generation EV battery performance exceeding 300 Wh/kg energy density targets.' },
  { id: 'MNS-0009', projectId: 'MNS-009', city: 'Jaipur', operator: 'Rajasthan Mn Fertilizer Works', processType: 'Psilomelane Leach',
    capacityTPD: 50, investmentCr: 185, purity: 96.8, recovery: 90.2, status: 'Delayed', priority: 'Medium', origin: 'Rajasthan Mn Deposits', destination: 'Jaipur Agri Chemical', shipDate: '2025-04-15', transitDays: 5, state: 'Rajasthan',
    remarks: 'Psilomelane leach manganese sulphate for agricultural micronutrient fertilizer at Jaipur delayed by mining lease renewal for Rajasthan manganese deposits. 50 TPD capacity producing fertilizer-grade MnSO4 for Rajasthan&apos;s mustard, guar and pearl millet cultivation. &#8377;185 Cr project stalled pending Rajasthan State Mining Department approval for Banswara district manganese ore block with projected Q4 2026 commissioning under National Mission for Sustainable Agriculture micronutrient programme.' },
  { id: 'MNS-0010', projectId: 'MNS-010', city: 'Gandhinagar', operator: 'Gujarat Mn Export Facility', processType: 'Sea Water Mn Recovery',
    capacityTPD: 40, investmentCr: 165, purity: 97.0, recovery: 85.5, status: 'Processing', priority: 'Low', origin: 'Gujarat Coastal Plant', destination: 'Kandla Export Terminal', shipDate: '2025-05-01', transitDays: 2, state: 'Gujarat',
    remarks: 'Sea water manganese recovery manganese sulphate facility at Gujarat coast with 40 TPD capacity. Novel extraction from seawater manganese nodules and coastal brine concentration. &#8377;165 Cr pilot project demonstrates India&apos;s seawater Mn extraction technology for strategic material independence. Exports through Kandla Port to Middle East desalination plants requiring MnSO4 for anti-scaling treatment and GCC agricultural fertilizer market valued at &#8377;250 Cr annually.' },
  { id: 'MNS-0011', projectId: 'MNS-011', city: 'Cochin', operator: 'Kerala Mn Sulphate Exporter', processType: 'Beach Sand Mn Leach',
    capacityTPD: 35, investmentCr: 138, purity: 97.5, recovery: 89.7, status: 'Delivered', priority: 'Medium', origin: 'Chavara Mineral Sands', destination: 'Cochin Industrial Zone', shipDate: '2025-05-18', transitDays: 1, state: 'Kerala',
    remarks: 'Beach sand manganese leach sulphate plant at Cochin industrial zone with 35 TPD capacity from Chavara mineral sand byproduct streams. &#8377;138 Cr facility produces technical MnSO4 from ilmenite processing residues containing 8-12% recoverable manganese oxide. Kerala&apos;s 22 km coastal mineral sand belt provides low-cost feedstock for MnSO4 production competing with imported material at &#8377;15 per kg versus &#8377;28 per kg landed cost at Cochin Port from South Africa.' },
  { id: 'MNS-0012', projectId: 'MNS-012', city: 'Guwahati', operator: 'Assam Mn Bioleach Plant', processType: 'Bio-Oxidation Leach',
    capacityTPD: 25, investmentCr: 110, purity: 96.0, recovery: 84.2, status: 'Processing', priority: 'Low', origin: 'NE Region Mn Ore', destination: 'Guwahati Biochemical Hub', shipDate: '2025-05-22', transitDays: 4, state: 'Assam',
    remarks: 'Bio-oxidation leach manganese sulphate plant at Guwahati with 25 TPD capacity using native Acidithiobacillus ferrooxidans bacteria. India&apos;s first bio-metallurgical MnSO4 plant eliminates strong acid consumption by 70%. &#8377;110 Cr pilot project developed by NEIST Jorhat and Assam Biochemical Corporation demonstrating green chemistry for northeast India manganese resources. Tea garden soil remediation using MnSO4 byproduct addresses 200,000 hectares of manganese-deficient tea estates in Assam and Darjeeling.' },
  { id: 'MNS-0013', projectId: 'MNS-013', city: 'Hyderabad', operator: 'Telangana Mn Battery Chemical', processType: 'High-Purity Recrystallization',
    capacityTPD: 60, investmentCr: 240, purity: 99.0, recovery: 95.5, status: 'Delivered', priority: 'High', origin: 'Sandur Ore Logistics', destination: 'Hyderabad Battery Zone', shipDate: '2025-05-06', transitDays: 2, state: 'Telangana',
    remarks: 'High-purity recrystallization manganese sulphate for battery chemical production at Hyderabad with 60 TPD capacity. &#8377;240 Cr facility supplies metro-chemically pure MnSO4 for Greene Energy and Amara Raja lithium-ion cell manufacturing targeting 20 GWh annual output. Telangana&apos;s pharma-grade chemical processing expertise ensures sub-2 ppm transition metal impurity levels meeting Samsung SDI and LG Chem cathode precursor specifications for Indian battery cell export market.' },
  { id: 'MNS-0014', projectId: 'MNS-014', city: 'Lucknow', operator: 'UP Mn Agri Chemicals', processType: 'Pyrolusite Direct Leach',
    capacityTPD: 42, investmentCr: 155, purity: 97.2, recovery: 91.8, status: 'Delayed', priority: 'Medium', origin: 'Madhya Pradesh Ore Supply', destination: 'Lucknow Fertilizer Complex', shipDate: '2025-04-20', transitDays: 5, state: 'Uttar Pradesh',
    remarks: 'Pyrolusite direct leach manganese sulphate for agricultural micronutrient production at Lucknow delayed by UP pollution board emission clearance. 42 TPD capacity producing fertilizer-grade MnSO4 for Uttar Pradesh&apos;s 26 million hectare cropland. &#8377;155 Cr facility addresses widespread manganese deficiency in Indo-Gangetic alluvial soils affecting wheat, rice and sugarcane yields by 15-20%. Expected commissioning post-UPEPB approval with immediate supply to IFFCO and KRIBHCO custom fertilizer blending operations.' },
]

export default function ManganeseSulphateLogisticsView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof MNSRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'processType', label: 'Process Type', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.processType] = (m[r.processType] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Capacity', value: `${filtered.reduce((a: number, r) => a + r.capacityTPD, 0).toLocaleString()} TPD` },
    { label: 'Avg Purity', value: `${(filtered.reduce((a: number, r) => a + r.purity, 0) / Math.max(1, filtered.length)).toFixed(1)}%` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Avg Recovery', value: `${(filtered.reduce((a: number, r) => a + r.recovery, 0) / Math.max(1, filtered.length)).toFixed(1)}%` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: MNSRecord) => string, val: (r: MNSRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.capacityTPD)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const procBar = grp(r => r.processType, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const recovData = filtered.map(r => ({ name: r.processType.split(' ').slice(0, 2).join(' '), value: r.recovery }))
    const lm = filtered.reduce((a: Record<string, { capacityTPD: number; investmentCr: number }>, r) => {
      if (!a[r.state]) a[r.state] = { capacityTPD: 0, investmentCr: 0 }
      a[r.state].capacityTPD += r.capacityTPD; a[r.state].investmentCr += r.investmentCr; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, capacityTPD: v.capacityTPD, investmentCr: v.investmentCr }))
    return { barState, pieState, statusPie, procBar, priorityPie, totalInvest, recovData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="mns-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Manganese Sulphate' }]} />
      <PageHeader title="Manganese Sulphate Logistics" description="Track manganese sulphate supply chains, MnSO4 production logistics, battery-grade precursor distribution, ferroalloy industry feedstock, and agricultural micronutrient manganese chemical logistics across India" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="mns-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`mns-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-orange-900 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="mns-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="mns-kpi-card"><CardContent className="p-4"><p className="mns-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="mns-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="mns-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="mns-chart-title text-sm">MnSO4 Capacity (TPD) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#7c2d12" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="mns-chart-title text-sm">Facilities by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="mns-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="mns-chart-title text-sm">Recovery (%) by Process</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.recovData}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} domain={[80, 100]} /><Tooltip /><Bar dataKey="value" fill="#9a3412" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="mns-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="mns-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`mns-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-orange-800'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.processType} | {r.state}</p>
              <p className="text-xs mt-1">{r.capacityTPD} TPD | {r.purity}% purity | {r.recovery}% recovery | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="mns-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="mns-chart-title text-sm">Capacity vs Investment by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="capacityTPD" stroke="#7c2d12" name="Capacity TPD" /><Line yAxisId="right" type="monotone" dataKey="investmentCr" stroke="#f97316" name="Investment &#8377; Cr" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="mns-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#a3612a" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="mns-chart-title text-sm">Process Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.procBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#c2410c" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="mns-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="mns-insights grid grid-cols-2 gap-4">
        <Card className="mns-insight-card border-l-4 border-l-orange-800"><CardContent className="p-5">
          <h4 className="mns-insight-title font-semibold text-base">MnSO4: Critical Battery Cathode Precursor</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Manganese sulphate is the primary precursor for NMC (Nickel-Manganese-Cobalt) and NCA cathodes used in 65% of global EV batteries. India&apos;s 50 GWh cell manufacturing target by 2030 requires 150,000 TPA of battery-grade MnSO4, 12x current production capacity. NMC811 cathode chemistry uses 32% manganese by weight making MnSO4 supply security as critical as lithium for India&apos;s EV transition under PLI scheme for Advanced Chemistry Cell manufacturing with &#8377;18,000 Cr government incentive allocation.</p>
        </CardContent></Card>
        <Card className="mns-insight-card border-l-4 border-l-orange-800"><CardContent className="p-5">
          <h4 className="mns-insight-title font-semibold text-base">MOIL: World&apos;s Largest Manganese Producer</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">MOIL (Manganese Ore India Ltd) operates 7 mines across Maharashtra and Madhya Pradesh with 1.2 million TPA ore capacity, ranking among world&apos;s top 5 manganese producers. India&apos;s total manganese ore resource of 496 million tonnes is fifth globally after South Africa, Ukraine, Australia and China. MOIL&apos;s Balaghat mine at 40 million tonnes reserve and Nagpur processing hub form the backbone of India&apos;s manganese sulphate industry supplying raw material at &#8377;8,500 per tonne versus &#8377;22,000 per tonne for imported South African ore landed at Indian ports.</p>
        </CardContent></Card>
        <Card className="mns-insight-card border-l-4 border-l-orange-800"><CardContent className="p-5">
          <h4 className="mns-insight-title font-semibold text-base">Steel Slag Recycling: 5 Million Tonnes Mn Waste</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s 120 million tonne steel industry generates 5 million tonnes of manganese-bearing blast furnace slag annually containing 12-15% recoverable MnO. Converting this waste stream to MnSO4 could produce 600,000 TPA at near-zero raw material cost. SAIL, Tata Steel and JSW Steel investing &#8377;1,200 Cr collectively in slag-to-MnSO4 recycling plants by 2027 under Steel Ministry circular economy mandate. Bhilai, Rourkela and Jamshedpur pilot plants demonstrate 88% recovery rates with iron separation using solvent extraction technology developed by NML Jamshedpur.</p>
        </CardContent></Card>
        <Card className="mns-insight-card border-l-4 border-l-orange-800"><CardContent className="p-5">
          <h4 className="mns-insight-title font-semibold text-base">Agricultural MnSO4: &#8377;3,500 Cr Fertilizer Market</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Manganese sulphate is India&apos;s third-largest micronutrient fertilizer after zinc sulphate and borax, applied on 45 million hectares of Mn-deficient soils across Indo-Gangetic plains, red soil regions and laterite zones. Indian Council of Agricultural Research estimates manganese deficiency reduces wheat yields by 18% and pulse yields by 25%. &#8377;3,500 Cr annual MnSO4 fertilizer market growing at 8% CAGR driven by soil health card programme mandating micronutrient application under National Mission for Sustainable Agriculture and Paramparagat Krishi organic farming initiative.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
