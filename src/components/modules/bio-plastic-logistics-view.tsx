'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface BPLRecord {
  id: string; projectId: string; city: string; operator: string; bioplasticType: string
  capacityTPD: number; investmentCr: number; carbonSaved: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#166534', '#15803d', '#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0', '#dcfce7']

const records: BPLRecord[] = [
  { id: 'BPL-001', projectId: 'BPL-001', city: 'Bengaluru', operator: 'Terra Bioplastics Pvt Ltd', bioplasticType: 'PLA Corn Starch',
    capacityTPD: 120, investmentCr: 180, carbonSaved: 8500, status: 'Delivered', priority: 'Critical', origin: 'KRPURA Agri Hub', destination: 'Peenya Industrial', shipDate: '2024-01-12', transitDays: 5, state: 'Karnataka',
    remarks: '120 TPD PLA production from corn starch feedstock supplied by Karnataka farmers cooperative, replacing petroleum-based PET for food packaging in Bengaluru&apos;s QSR chains with 100% compostable cups, cutlery and containers within 90-day industrial composting cycle' },
  { id: 'BPL-002', projectId: 'BPL-002', city: 'Mumbai', operator: 'EcoVision Bio Mumbai', bioplasticType: 'PHA Bacterial Synthesis',
    capacityTPD: 45, investmentCr: 320, carbonSaved: 6200, status: 'Delivered', priority: 'High', origin: 'Navi Mumbai SEZ', destination: 'Andheri Packaging', shipDate: '2024-01-25', transitDays: 4, state: 'Maharashtra',
    remarks: '45 TPD PHA bioplastic via bacterial fermentation using municipal organic waste as carbon source, producing marine-biodegradable bags and films. Mumbai&apos;s Alibag beach cleanup campaign uses PHA bags eliminating microplastic pollution in Arabian Sea coastal zone' },
  { id: 'BPL-003', projectId: 'BPL-003', city: 'Delhi NCR', operator: 'GreenLeaf Biopolymers', bioplasticType: 'PBS Polybutylene Succinate',
    capacityTPD: 80, investmentCr: 240, carbonSaved: 5800, status: 'Delivered', priority: 'High', origin: 'Gurgaon Industrial', destination: 'Noida Export Zone', shipDate: '2024-02-08', transitDays: 6, state: 'Delhi',
    remarks: '80 TPD PBS production for agricultural mulch films replacing LDPE in Haryana and Punjab farming belts, biodegradable mulch increasing soil organic carbon by 15% while eliminating 2,500 MT annual plastic film waste from Delhi NCR agricultural supply chain' },
  { id: 'BPL-004', projectId: 'BPL-004', city: 'Chennai', operator: 'TN BioComp Industries', bioplasticType: 'Bagasse Fiber Composite',
    capacityTPD: 200, investmentCr: 150, carbonSaved: 9200, status: 'Delivered', priority: 'Medium', origin: 'Sivakasi Sugar Mills', destination: 'Chennai Port Trust', shipDate: '2024-02-20', transitDays: 7, state: 'Tamil Nadu',
    remarks: '200 TPD bagasse fiber biocomposite tableware and packaging from Tamil Nadu sugar mill residue, supplying Swiggy/Zomato eco-packaging mandate for 500+ restaurant partners. Chennai port exports 40% production to EU markets meeting EN 13432 compostability standard' },
  { id: 'BPL-005', projectId: 'BPL-005', city: 'Hyderabad', operator: 'Deccan BioMaterials', bioplasticType: 'Starch Blend PBAT',
    capacityTPD: 95, investmentCr: 200, carbonSaved: 7100, status: 'In Transit', priority: 'High', origin: 'Medak Agri Zone', destination: 'Gachibowli IT Park', shipDate: '2024-04-15', transitDays: 8, state: 'Telangana',
    remarks: '95 TPD starch-PBAT blend bioplastic for Telangana IT park food courts and corporate cafeterias, replacing single-use plastics with certified compostable alternatives. IoT-enabled tracking of bioplastic lifecycle from production to composting facility for complete circularity audit' },
  { id: 'BPL-006', projectId: 'BPL-006', city: 'Indore', operator: 'MP Green Polymer Ltd', bioplasticType: 'Municipal Waste PLA',
    capacityTPD: 60, investmentCr: 280, carbonSaved: 4800, status: 'Processing', priority: 'Medium', origin: 'Indore Segregation Center', destination: 'Pithampur Industrial', shipDate: '2024-06-20', transitDays: 9, state: 'Madhya Pradesh',
    remarks: '60 TPD PLA from Indore&apos;s segregated organic municipal waste through lactic acid fermentation, India&apos;s first circular bioplastic plant converting city waste to compostable packaging. Reducing Indore&apos;s 1,200 TPD waste burden by 5% while creating 300 green jobs' },
  { id: 'BPL-007', projectId: 'BPL-007', city: 'Kolkata', operator: 'Bengal BioPlast Corp', bioplasticType: 'Jute Biocomposite',
    capacityTPD: 150, investmentCr: 190, carbonSaved: 11200, status: 'Delivered', priority: 'Medium', origin: 'Howrah Jute Mills', destination: 'Kolkata Export Terminal', shipDate: '2024-03-05', transitDays: 10, state: 'West Bengal',
    remarks: '150 TPD jute fiber reinforced bioplastic composite packaging from WB jute mills, combining traditional jute with bio-resin matrix for heavy-duty packaging replacing wooden crates and thermocol. 60% exported to US and EU sustainable packaging markets through Kolkata port' },
  { id: 'BPL-008', projectId: 'BPL-008', city: 'Pune', operator: 'AgroPlast Maharashtra', bioplasticType: 'Rice Husk BioComposite',
    capacityTPD: 110, investmentCr: 170, carbonSaved: 7800, status: 'Delivered', priority: 'Medium', origin: 'Baramati Rice Hub', destination: 'Chakan MIDC', shipDate: '2024-03-18', transitDays: 7, state: 'Maharashtra',
    remarks: '110 TPD rice husk biocomposite from Baramati-Kolhapur rice belt, producing automotive interior components for Tata and Mahindra EV platforms, replacing petroleum-based PP with 40% bio-content composites meeting BIS IS 17264 automotive bioplastic standard' },
  { id: 'BPL-009', projectId: 'BPL-009', city: 'Ahmedabad', operator: 'Gujarat BioPack Industries', bioplasticType: 'Corn Starch PLA Film',
    capacityTPD: 85, investmentCr: 210, carbonSaved: 5900, status: 'Delivered', priority: 'High', origin: 'Mehsana Corn Belt', destination: 'SG Highway Hub', shipDate: '2024-02-28', transitDays: 6, state: 'Gujarat',
    remarks: '85 TDP corn starch PLA film production for Gujarat&apos;s dairy and edible oil packaging, replacing BOPP films with compostable PLA shrink films for Amul cheese and Mother Dairy lassi packaging, 100% certified OK Compost and BIS IS 17088 food-grade bioplastic' },
  { id: 'BPL-010', projectId: 'BPL-010', city: 'Kochi', operator: 'Kerala Coir BioPlast', bioplasticType: 'Coir Fiber BioComposite',
    capacityTPD: 70, investmentCr: 130, carbonSaved: 6500, status: 'In Transit', priority: 'Low', origin: 'Alappuzha Coir Cluster', destination: 'Kochi InfoPark', shipDate: '2024-05-10', transitDays: 8, state: 'Kerala',
    remarks: '70 TPD coir fiber biocomposite from Kerala&apos;s coconut coir industry, producing biodegradable grow bags replacing plastic nursery bags in Kerala&apos;s spice and coconut nurseries. Coir bio-pots eliminating 800 MT annual plastic nursery waste while improving root aeration by 35%' },
  { id: 'BPL-011', projectId: 'BPL-011', city: 'Jaipur', operator: 'Rajasthan BioResin Works', bioplasticType: 'Cactus Cellulose Film',
    capacityTPD: 35, investmentCr: 260, carbonSaved: 3200, status: 'Processing', priority: 'Medium', origin: 'Jodhpur Cactus Farm', destination: 'Sitapura Industrial', shipDate: '2024-07-05', transitDays: 10, state: 'Rajasthan',
    remarks: '35 TPD cactus-based cellulose film from Opuntia cactus plantations in Rajasthan&apos;s arid zone, producing edible/biodegradable food wrap films using 95% less water than conventional cellulose. Zero freshwater footprint bioplastic from desert-hardy cactus species' },
  { id: 'BPL-012', projectId: 'BPL-012', city: 'Lucknow', operator: 'UP Sugarcane Bioplastics', bioplasticType: 'Bagasse Tableware',
    capacityTPD: 160, investmentCr: 140, carbonSaved: 10500, status: 'Delivered', priority: 'Medium', origin: 'Lakhimpur Sugar Mills', destination: 'Lucknow Packaging Hub', shipDate: '2024-03-28', transitDays: 9, state: 'Uttar Pradesh',
    remarks: '160 TPD bagasse tableware from UP sugar cane mills supplying IRCTC&apos;s onboard meal packaging and UP&apos;s mid-day meal scheme with compostable plates, bowls and trays. Eliminating 5,000 MT annual thermocol waste from Indian Railways catering services' },
  { id: 'BPL-013', projectId: 'BPL-013', city: 'Bhubaneswar', operator: 'Odisha Sea Weed Bioplastics', bioplasticType: 'Seaweed Agar Film',
    capacityTPD: 25, investmentCr: 310, carbonSaved: 2800, status: 'Delayed', priority: 'Low', origin: 'Ganjam Coast Seaweed', destination: 'Bhubaneswar Food Park', shipDate: '2024-06-01', transitDays: 12, state: 'Odisha',
    remarks: '25 TPD seaweed-based agar bioplastic film from Odisha&apos;s 4,000 km coastline seaweed farming cooperatives, producing edible wrapping films and water-soluble detergent pouches. First commercial-scale seaweed bioplastic plant in India supporting 2,500 women seaweed farmer families' },
  { id: 'BPL-014', projectId: 'BPL-014', city: 'Guwahati', operator: 'NE Bamboo Biocomposite', bioplasticType: 'Bamboo Cellulose Composite',
    capacityTPD: 90, investmentCr: 160, carbonSaved: 8400, status: 'Delivered', priority: 'Medium', origin: 'Barpeta Bamboo Forest', destination: 'Guwahati Industrial', shipDate: '2024-04-08', transitDays: 13, state: 'Assam',
    remarks: '90 TPD bamboo cellulose biocomposite from Northeast India&apos;s bamboo reserves, producing biodegradable construction formwork replacing steel and plastic shuttering. Assam bamboo composite achieving 3x higher tensile strength than conventional PLA for load-bearing applications' },
]

export default function BioPlasticLogisticsView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof BPLRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'bioplasticType', label: 'Bioplastic Type', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.bioplasticType] = (m[r.bioplasticType] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Capacity', value: `${filtered.reduce((a: number, r) => a + r.capacityTPD, 0).toLocaleString()} TPD` },
    { label: 'Total Carbon Saved', value: `${(filtered.reduce((a: number, r) => a + r.carbonSaved, 0) / 1000).toFixed(1)}k MT CO2/yr` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Cost/TPD', value: `&#8377;${(filtered.reduce((a: number, r) => a + r.investmentCr, 0) / Math.max(1, filtered.reduce((a: number, r) => a + r.capacityTPD, 0))).toFixed(1)} Cr/TPD` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: BPLRecord) => string, val: (r: BPLRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.capacityTPD)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const typeBar = grp(r => r.bioplasticType, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const effData = filtered.map(r => ({ name: r.city.slice(0, 10), value: +(r.carbonSaved / r.capacityTPD).toFixed(1) }))
    const lm = filtered.reduce((a: Record<string, { capacityTPD: number; carbonSaved: number }>, r) => {
      if (!a[r.state]) a[r.state] = { capacityTPD: 0, carbonSaved: 0 }
      a[r.state].capacityTPD += r.capacityTPD; a[r.state].carbonSaved += r.carbonSaved; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, capacityTPD: v.capacityTPD, carbonSaved: v.carbonSaved }))
    return { barState, pieState, statusPie, typeBar, priorityPie, totalInvest, effData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="bpl-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Bio Plastic' }]} />
      <PageHeader title="Bio Plastic Logistics" description="Track bioplastic production, compostable packaging supply chains, bio-resin logistics, and circular plastic alternatives across India's manufacturing corridors" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="bpl-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`bpl-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-green-800 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="bpl-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="bpl-kpi-card"><CardContent className="p-4"><p className="bpl-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="bpl-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="bpl-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="bpl-chart-title text-sm">Capacity (TPD) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#166534" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="bpl-chart-title text-sm">Plants by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="bpl-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="bpl-chart-title text-sm">Carbon Efficiency (MT CO2 saved per TPD)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.effData}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#15803d" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="bpl-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="bpl-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`bpl-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-green-800'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.bioplasticType} | {r.state}</p>
              <p className="text-xs mt-1">{r.capacityTPD} TPD | {r.carbonSaved.toLocaleString()} MT CO2 saved | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="bpl-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="bpl-chart-title text-sm">Capacity vs Carbon Savings by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="capacityTPD" stroke="#166534" name="Capacity TPD" /><Line yAxisId="right" type="monotone" dataKey="carbonSaved" stroke="#4ade80" name="CO2 Saved MT" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="bpl-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#16a34a" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="bpl-chart-title text-sm">Bioplastic Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.typeBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#22c55e" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="bpl-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="bpl-insights grid grid-cols-2 gap-4">
        <Card className="bpl-insight-card border-l-4 border-l-green-800"><CardContent className="p-5">
          <h4 className="bpl-insight-title font-semibold text-base">India&apos;s Plastic Ban Driving Bioplastic Boom</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India banned single-use plastics in July 2022, covering cups, plates, straws, and cutlery. This created a &#8377;45,000 Cr bioplastic market opportunity by 2030. Current bioplastic production meets only 2% of India&apos;s 18 MT annual plastic demand. Government PLI scheme for bioplastics offering 20% capital subsidy for plants above 50 TPD capacity.</p>
        </CardContent></Card>
        <Card className="bpl-insight-card border-l-4 border-l-green-800"><CardContent className="p-5">
          <h4 className="bpl-insight-title font-semibold text-base">Agricultural Waste as Bioplastic Feedstock</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India generates 620 MT of agricultural crop residue annually. Bagasse, rice husk, corn stover, and bamboo can supply 80% of bioplastic feedstock needs, reducing dependence on food crops for PLA production. Bagasse-based bioplastics achieve 60% lower carbon footprint than corn-PLA while providing additional income to 12 million sugarcane farmers.</p>
        </CardContent></Card>
        <Card className="bpl-insight-card border-l-4 border-l-green-800"><CardContent className="p-5">
          <h4 className="bpl-insight-title font-semibold text-base">Composting Infrastructure Gap</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Bioplastics need industrial composting at 58&#176;C for 90 days to fully degrade. India has only 200 industrial composting facilities vs 5,000+ needed. Without composting infrastructure, bioplastics end up in landfills where they degrade slowly and release methane. MNRE allocating &#8377;2,500 Cr for 500 new composting hubs in 100 smart cities.</p>
        </CardContent></Card>
        <Card className="bpl-insight-card border-l-4 border-l-green-800"><CardContent className="p-5">
          <h4 className="bpl-insight-title font-semibold text-base">BIS Standards for Indian Bioplastics</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">BIS IS 17088 (compostable plastics), IS 17264 (bioplastics for automotive), and IS 17887 (oxo-degradable plastics) form India&apos;s bioplastic regulatory framework. CPCB mandates BIS-certified bioplastics for all government procurement. FSSAI food-contact bioplastic regulations require migration testing under Indian food conditions (high temperature, spicy, oily foods).</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
