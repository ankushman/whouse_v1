'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface BMLRecord {
  id: string; projectId: string; city: string; operator: string; feedstockType: string
  capacityTPD: number; investmentCr: number; methaneYield: number; purity: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#78350f', '#92400e', '#a16207', '#ca8a04', '#eab308', '#713f12', '#422006', '#854d0e']

const records: BMLRecord[] = [
  { id: 'BML-0001', projectId: 'BML-001', city: 'Indore', operator: 'Indore Bio-Methane Plant', feedstockType: 'Municipal Solid Waste AD',
    capacityTPD: 500, investmentCr: 185, methaneYield: 62, purity: 96.2, status: 'Delivered', priority: 'Critical', origin: 'Indore SWM Collection', destination: 'Indore CBG Grid', shipDate: '2025-05-02', transitDays: 1, state: 'Madhya Pradesh',
    remarks: 'Municipal solid waste anaerobic digestion bio-methane plant at Indore processing 500 TPD of segregated organic waste through thermophilic dry fermentation producing compressed bio-gas for city transport buses and industrial heating. &#8377;185 Cr plant converts 62% of organic fraction into pipeline-quality bio-methane serving 400 Indore city buses and 25 industrial customers replacing 28,000 kg CNG per day under Indore Municipal Corporation zero-waste city programme and SATAT CBG scheme winning India Clean Air Award 2024 for reducing municipal emissions by 45%.' },
  { id: 'BML-0002', projectId: 'BML-002', city: 'Pune', operator: 'Pune Agriculture Residue CBG', feedstockType: 'Crop Residue Biomass',
    capacityTPD: 350, investmentCr: 145, methaneYield: 58, purity: 95.8, status: 'Delivered', priority: 'Critical', origin: 'Baramati Sugarcane Fields', destination: 'Pune Industrial CBG Hub', shipDate: '2025-05-08', transitDays: 1, state: 'Maharashtra',
    remarks: 'Agriculture residue-based compressed bio-gas facility at Pune converting 350 TPD of sugarcane bagasse, paddy straw and cotton stalk into bio-methane through two-stage anaerobic digestion with biogas upgrading membrane system. &#8377;145 Cr plant produces 58% methane yield purity 95.8% serving Pune automotive fleet and Maharashtra State Road Transport Corporation 150 buses under National Bio-Energy Programme reducing stubble burning across 120,000 hectares in Baramati, Solapur and Satara districts preventing 85,000 tonnes CO2 equivalent emissions annually.' },
  { id: 'BML-0003', projectId: 'BML-003', city: 'Gandhinagar', operator: 'Gujarat Cattle Waste CBG', feedstockType: 'Cattle Dung Biogas',
    capacityTPD: 600, investmentCr: 220, methaneYield: 65, purity: 97.0, status: 'Delivered', priority: 'High', origin: 'Mehsana Dairy Belt', destination: 'Gandhinagar Gas Grid', shipDate: '2025-05-03', transitDays: 1, state: 'Gujarat',
    remarks: 'Cattle dung-based compressed bio-gas plant at Gandhinagar processing 600 TPD of fresh and dry cattle manure from Mehsana and Sabarkantha dairy belt through covered lagoon anaerobic digestion with pressure swing adsorption upgrading. &#8377;220 Cr facility produces 97% pure bio-methane injected directly into Gujarat Gas grid serving industrial and transport customers replacing 35,000 SCM of natural gas per day. Integrated with GCMMF Amul dairy network collecting dung from 50,000 dairy farmers providing supplementary income of &#8377;2,500 per farmer per month under Gujarat Gobar Dhan Mission.' },
  { id: 'BML-0004', projectId: 'BML-004', city: 'Kolkata', operator: 'Kolkata Market Waste CBG', feedstockType: 'Market Vegetable Waste',
    capacityTPD: 280, investmentCr: 120, methaneYield: 55, purity: 94.5, status: 'In Transit', priority: 'High', origin: 'Howrah Vegetable Market', destination: 'Kolkata Bio-CNG Station', shipDate: '2025-05-12', transitDays: 2, state: 'West Bengal',
    remarks: 'Market vegetable and fruit waste bio-methane facility en route to Kolkata processing 280 TPD of perishable market waste from Howrah, Sealdah and Gariahat wholesale markets through wet anaerobic digestion with amine scrubbing purification. &#8377;120 Cr plant produces 55% methane yield bio-CNG distributed through 8 Kolkata fueling stations for 200 yellow taxis and 150 goods auto-rickshaws under West Bengal Bio-Energy Mission reducing landfill burden at Dhapa waste dump by 30% and preventing methane emissions equivalent to 120,000 tonnes CO2 annually from uncontrolled organic waste decomposition.' },
  { id: 'BML-0005', projectId: 'BML-005', city: 'Agra', operator: 'Agra Poultry Litter Biogas', feedstockType: 'Poultry Litter AD',
    capacityTPD: 200, investmentCr: 95, methaneYield: 52, purity: 93.8, status: 'Delivered', priority: 'Medium', origin: 'Uttar Pradesh Poultry Farms', destination: 'Agra CBG Plant', shipDate: '2025-04-28', transitDays: 1, state: 'Uttar Pradesh',
    remarks: 'Poultry litter anaerobic digestion bio-methane plant at Agra converting 200 TPD of poultry manure from 350 egg and broiler farms in Mathura, Aligarh and Etawah districts through plug-flow digester with iron sponge desulphurization. &#8377;95 Cr plant generates 52% methane yield bio-gas serving 100 Agra city buses and supplying bio-fertilizer to 15,000 hectares of wheat and mustard fields in Uttar Pradesh reducing ammonia pollution from open poultry waste dumping in Yamuna river basin by 70% supporting Namami Gange clean river programme and Agra Taj Trapezium Zone air quality improvement.' },
  { id: 'BML-0006', projectId: 'BML-006', city: 'Coimbatore', operator: 'TN Coir Pith Biogas Works', feedstockType: 'Coir Pith Digestion',
    capacityTPD: 320, investmentCr: 130, methaneYield: 54, purity: 95.2, status: 'Delivered', priority: 'High', origin: 'Pollachi Coir Mills', destination: 'Coimbatore Industrial Zone', shipDate: '2025-05-01', transitDays: 1, state: 'Tamil Nadu',
    remarks: 'Coir pith and coconut waste anaerobic digestion plant at Coimbatore processing 320 TPD of coir pith from Pollachi and Tirupur coconut coir mills through solid-state anaerobic digestion with water recirculation and bio-gas upgradation. &#8377;130 Cr facility produces 54% methane yield CBG for 120 Coimbatore city buses and textile industry boilers while generating 40 TPD coir pith bio-char used as soil conditioner in Coimbatore and Tirupur agricultural fields. Tamil Nadu Pollution Control Board certified zero liquid discharge operation converting 95% of waste coir pith that was previously dumped or burned near coconut processing clusters.' },
  { id: 'BML-0007', projectId: 'BML-007', city: 'Jaipur', operator: 'Rajasthan Jatropha CBG', feedstockType: 'Jatropha Seedcake',
    capacityTPD: 180, investmentCr: 88, methaneYield: 48, purity: 94.0, status: 'In Transit', priority: 'Medium', origin: 'Jodhpur Jatropha Farms', destination: 'Jaipur Bio-Fuel Hub', shipDate: '2025-05-10', transitDays: 3, state: 'Rajasthan',
    remarks: 'Jatropha seedcake and de-oiled cake bio-methane facility en route to Jaipur processing 180 TPD of oil press cake from Rajasthan biodiesel industry through thermophilic high-solids anaerobic digestion with biological desulphurization. &#8377;88 Cr plant produces 48% methane bio-gas and 60 TPD organic fertilizer for Rajasthan desert agriculture serving Jaipur transport fleet and supplying bio-gas to 20 villages in Jodhpur district for cooking under Pradhan Mantri Ujjwala Yojana Bio-Gas extension programme creating circular economy from jatropha biodiesel value chain.' },
  { id: 'BML-0008', projectId: 'BML-008', city: 'Guwahati', operator: 'Assam Water Hyacinth CBG', feedstockType: 'Water Hyacinth Digestion',
    capacityTPD: 250, investmentCr: 105, methaneYield: 50, purity: 93.5, status: 'Delivered', priority: 'High', origin: 'Brahmaputra River Banks', destination: 'Guwahati CBG Terminal', shipDate: '2025-04-25', transitDays: 1, state: 'Assam',
    remarks: 'Water hyacinth bio-methane plant at Guwahati harvesting and processing 250 TPD of invasive water hyacinth from Brahmaputra and Barak river systems through mesophilic anaerobic digestion with biological hydrogen sulphide removal. &#8377;105 Cr plant simultaneously generates 50% methane bio-CNG for 80 Guwahati city buses and produces bio-compost restoring soil health in Assam tea gardens while clearing 2,500 hectares of water hyacinth infestation threatening Kaziranga National Park wetland ecosystem and Brahmaputra navigational channels enabling dual environmental benefit of invasive species control and renewable energy production.' },
  { id: 'BML-0009', projectId: 'BML-009', city: 'Lucknow', operator: 'UP Sewage CBG Complex', feedstockType: 'Sewage Sludge AD',
    capacityTPD: 450, investmentCr: 175, methaneYield: 56, purity: 95.5, status: 'Delivered', priority: 'Critical', origin: 'Lucknow STP Outfall', destination: 'Lucknow CBG Grid', shipDate: '2025-05-04', transitDays: 1, state: 'Uttar Pradesh',
    remarks: 'Sewage sludge anaerobic co-digestion bio-methane plant at Lucknow processing 450 TPD of sewage sludge from Lucknow municipal sewage treatment plants through two-stage thermophilic-mesophilic anaerobic digestion with membrane upgradation. &#8377;175 Cr facility produces 95.5% pure bio-methane for 200 Lucknow city buses and 15 industrial units while generating 90 TPD dried bio-sludge as organic fertilizer for Lucknow and Sitapur agricultural fields. Project reduces Lucknow STP electricity consumption by 40% through co-generation and diverts 30,000 tonnes of sludge from dumping to productive bio-energy use under Namami Gange sewage treatment programme.' },
  { id: 'BML-0010', projectId: 'BML-010', city: 'Bhopal', operator: 'MP MSW Bio-Methane Hub', feedstockType: 'Mixed Organic Waste AD',
    capacityTPD: 380, investmentCr: 155, methaneYield: 60, purity: 96.0, status: 'Delivered', priority: 'High', origin: 'Bhopal Municipal Waste', destination: 'Bhopal Industrial Estate', shipDate: '2025-05-06', transitDays: 1, state: 'Madhya Pradesh',
    remarks: 'Mixed organic waste bio-methane hub at Bhopal processing 380 TPD of kitchen waste, garden waste and food processing residue from Bhopal smart city and surrounding industrial area through high-rate anaerobic digester with cryogenic bio-methane liquefaction. &#8377;155 Cr plant produces 60% methane yield liquefied bio-methane for long-haul transport and 120 TPD digestate bio-fertilizer distributed to Bhopal, Sehore and Vidisha districts. Project aligned with Bhopal Smart City Mission achieving 70% organic waste processing rate and reducing Bhopal municipal landfill methane emissions by 55% through integrated waste-to-energy circular economy model.' },
  { id: 'BML-0011', projectId: 'BML-011', city: 'Ranchi', operator: 'Jharkhand Rice Mill CBG', feedstockType: 'Rice Husk Digestion',
    capacityTPD: 220, investmentCr: 92, methaneYield: 46, purity: 93.2, status: 'Delayed', priority: 'Medium', origin: 'Hazaribag Rice Mills', destination: 'Ranchi CBG Station', shipDate: '2025-05-15', transitDays: 2, state: 'Jharkhand',
    remarks: 'Rice husk and rice mill waste anaerobic digestion bio-methane plant at Ranchi processing 220 TPD of rice husk, bran and broken rice from Hazaribag and Ramgarh rice mills through solid-state anaerobic digestion with alkali pretreatment enhancement. &#8377;92 Cr facility produces 46% methane bio-gas serving 60 Ranchi city buses and supplying bio-char to Jharkhand steel plants as reducing agent replacing 8,000 tonnes of coal annually. Project supports rice mill waste management in Jharkhand rice belt converting 80% of previously burned rice husk into clean energy and carbon-neutral bio-char under Ministry of New and Renewable Energy biomass CBG promotion scheme.' },
  { id: 'BML-0012', projectId: 'BML-012', city: 'Bengaluru', operator: 'Karnataka FSE Waste CBG', feedstockType: 'Food Service Establishment Waste',
    capacityTPD: 300, investmentCr: 140, methaneYield: 61, purity: 96.5, status: 'Delivered', priority: 'Critical', origin: 'Bengaluru Restaurant Hubs', destination: 'Bengaluru Metro CBG Grid', shipDate: '2025-05-07', transitDays: 1, state: 'Karnataka',
    remarks: 'Food service establishment waste bio-methane plant at Bengaluru processing 300 TPD of cooked food waste, kitchen residue and organic waste from 5,000 Bengaluru restaurants, hotels and food courts through thermophilic high-solids anaerobic digestion with PSA upgradation. &#8377;140 Cr plant produces 61% methane yield 96.5% pure bio-CNG for 150 Bengaluru Metro feeder buses and 25 compressed bio-gas stations. Bruhat Bengaluru Mahanagara Palike integrated food waste collection from Indiranagar, Koramangala and Whitefield restaurant clusters achieving 85% collection efficiency reducing BBMP landfill burden at Mandur and Bellahalli dump yards by 25%.' },
  { id: 'BML-0013', projectId: 'BML-013', city: 'Chennai', operator: 'TN Fish Waste Bio-Methane', feedstockType: 'Fish Processing Waste AD',
    capacityTPD: 160, investmentCr: 78, methaneYield: 53, purity: 94.8, status: 'In Transit', priority: 'Medium', origin: 'Chennai Fish Harbour', destination: 'Chennai Harbour Industrial Zone', shipDate: '2025-05-11', transitDays: 1, state: 'Tamil Nadu',
    remarks: 'Fish processing waste anaerobic digestion bio-methane plant en route to Chennai processing 160 TPD of fish waste, fish offal and shellfish residue from Chennai Kasimedu fishing harbour and seafood processing units through salt-tolerant mesophilic anaerobic digestion. &#8377;78 Cr plant produces 53% methane bio-gas for 50 Chennai MTC buses while producing 30 TPD fish meal bio-fertilizer for Tamil Nadu coastal agriculture preventing ocean pollution from Chennai harbour fish waste dumping reducing marine ecosystem damage in Bay of Bengal coastal zone and serving Tamil Nadu Marine Fisheries Department sustainable fisheries programme.' },
  { id: 'BML-0014', projectId: 'BML-014', city: 'Ludhiana', operator: 'Punjab Brewery Waste CBG', feedstockType: 'Brewery Spent Grain AD',
    capacityTPD: 240, investmentCr: 110, methaneYield: 57, purity: 95.0, status: 'Delivered', priority: 'High', origin: 'Punjab Brewery Belt', destination: 'Ludhiana Industrial CBG Hub', shipDate: '2025-05-09', transitDays: 1, state: 'Punjab',
    remarks: 'Brewery spent grain and distillery effluent anaerobic digestion bio-methane plant at Ludhiana processing 240 TPD of spent grain, malt waste and distillery slosh from 15 Punjab breweries and distilleries through two-phase high-rate anaerobic digestion with pressure swing adsorption bio-gas upgrading. &#8377;110 Cr facility produces 57% methane yield 95% pure CBG for 80 Ludhiana city buses and 30 industrial boilers while generating 50 TPD protein-rich animal feed supplement from digester effluent for Punjab dairy and poultry industry creating zero-waste brewery circular economy model under Punjab Pollution Control Board distillery waste management regulations.' },
]

export default function BioMethaneLogisticsView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof BMLRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'feedstockType', label: 'Feedstock Type', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.feedstockType] = (m[r.feedstockType] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Capacity', value: `${filtered.reduce((a: number, r) => a + r.capacityTPD, 0).toLocaleString()} TPD` },
    { label: 'Avg Methane Yield', value: `${(filtered.reduce((a: number, r) => a + r.methaneYield, 0) / Math.max(1, filtered.length)).toFixed(1)}%` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Avg Purity', value: `${(filtered.reduce((a: number, r) => a + r.purity, 0) / Math.max(1, filtered.length)).toFixed(1)}%` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: BMLRecord) => string, val: (r: BMLRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.capacityTPD)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const typeBar = grp(r => r.feedstockType, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const yieldData = filtered.map(r => ({ name: r.feedstockType.split(' ').slice(0, 2).join(' '), value: r.methaneYield }))
    const lm = filtered.reduce((a: Record<string, { capacityTPD: number; investmentCr: number }>, r) => {
      if (!a[r.state]) a[r.state] = { capacityTPD: 0, investmentCr: 0 }
      a[r.state].capacityTPD += r.capacityTPD; a[r.state].investmentCr += r.investmentCr; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, capacityTPD: v.capacityTPD, investmentCr: v.investmentCr }))
    return { barState, pieState, statusPie, typeBar, priorityPie, totalInvest, yieldData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="bml-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Bio-Methane' }]} />
      <PageHeader title="Bio-Methane Logistics" description="Track bio-methane and compressed bio-gas supply chains, anaerobic digestion feedstock logistics, CBG distribution networks, and India's SATAT bio-gas programme for waste-to-energy, transport fuel and industrial heating applications" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="bml-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t as 'dashboard' | 'registry' | 'analytics' | 'insights')} className={`bml-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-amber-900 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="bml-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="bml-kpi-card"><CardContent className="p-4"><p className="bml-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="bml-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="bml-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="bml-chart-title text-sm">Processing Capacity (TPD) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#78350f" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="bml-chart-title text-sm">Facilities by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="bml-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="bml-chart-title text-sm">Methane Yield (%) by Feedstock Type</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.yieldData}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} domain={[40, 70]} /><Tooltip /><Bar dataKey="value" fill="#92400e" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="bml-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="bml-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`bml-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-amber-900'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.feedstockType} | {r.state}</p>
              <p className="text-xs mt-1">{r.capacityTPD.toLocaleString()} TPD | {r.methaneYield}% yield | {r.purity}% purity | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="bml-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="bml-chart-title text-sm">Capacity vs Investment by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="capacityTPD" stroke="#78350f" name="Capacity TPD" /><Line yAxisId="right" type="monotone" dataKey="investmentCr" stroke="#ca8a04" name="Investment &#8377; Cr" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="bml-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#713f12" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="bml-chart-title text-sm">Feedstock Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.typeBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#92400e" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="bml-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="bml-insights grid grid-cols-2 gap-4">
        <Card className="bml-insight-card border-l-4 border-l-amber-900"><CardContent className="p-5">
          <h4 className="bml-insight-title font-semibold text-base">India&apos;s &#8377;25,000 Cr Bio-Methane Target by 2028</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India targeting 5,000 CBG plants producing 25 million tonnes of bio-methane annually by 2028 under SATAT Sustainable Alternative Towards Affordable Transportation initiative. Ministry of Petroleum and Natural Gas allocating &#8377;25,000 Cr capital subsidy for CBG plant construction through viability gap funding covering 40% of project cost. Current installed base of 680 CBG plants processing 12,000 TPD organic waste needs 8x expansion to meet 2028 target creating massive logistics demand for feedstock collection, bio-gas transportation and CBG distribution infrastructure across 750 districts.</p>
        </CardContent></Card>
        <Card className="bml-insight-card border-l-4 border-l-amber-900"><CardContent className="p-5">
          <h4 className="bml-insight-title font-semibold text-base">Agriculture Residue: 280 Million Tonnes Opportunity</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India generating 280 million tonnes of crop residue annually with only 25% used productively for bio-energy, cattle feed or paper manufacturing while 55% burned in open fields causing severe air pollution across Punjab, Haryana and Uttar Pradesh. Commission for Agricultural Costs and Prices estimating &#8377;15,000 Cr bio-methane potential from paddy straw alone at &#8377;1,500 per tonne collection cost generating 50,000 TPD CBG capacity. Supreme Court directed Punjab and Haryana governments to ensure zero stubble burning by 2025 with bio-methane plants as primary alternative creating urgent logistics infrastructure for residue collection, baling, transport and storage.</p>
        </CardContent></Card>
        <Card className="bml-insight-card border-l-4 border-l-amber-900"><CardContent className="p-5">
          <h4 className="bml-insight-title font-semibold text-base">Urban Organic Waste: &#8377;8,500 Cr Municipal CBG Opportunity</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s 8,000 urban local bodies generating 62 million tonnes of municipal solid waste annually with 50% organic fraction suitable for anaerobic digestion producing bio-methane and bio-fertilizer. Ministry of Housing and Urban Affairs Smart Cities Mission funding 200 municipal CBG plants in tier-1 and tier-2 cities through AMRUT and Swachh Bharat Mission Urban 2.0 programme. Indore model of integrated waste-to-energy achieving 100% organic waste processing with 500 TPD CBG plant being replicated across 50 smart cities creating &#8377;8,500 Cr investment opportunity for urban bio-methane logistics including door-to-door collection, segregation and transport infrastructure.</p>
        </CardContent></Card>
        <Card className="bml-insight-card border-l-4 border-l-amber-900"><CardContent className="p-5">
          <h4 className="bml-insight-title font-semibold text-base">Bio-CNG Transport: 15% City Bus Fleet Target</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Ministry of Heavy Industries FAME II scheme mandating 15% of city bus fleet run on bio-CNG by 2027 across 100 largest Indian cities. State transport undertakings in Indore, Pune, Bengaluru and Lucknow already operating 1,200 bio-CNG buses with 300 more under procurement. IOCL, BPCL and HPCL establishing 5,000 CBG retail stations nationwide interconnected through dedicated bio-gas pipelines and virtual pipeline network of cascade tankers. Automotive Research Association of India certifying 45 bus and truck models for bio-CNG compatibility enabling freight fleet conversion to bio-methane reducing logistics carbon footprint by 80% versus diesel.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
