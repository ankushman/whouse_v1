'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface MYCRecord {
  id: string; projectId: string; city: string; operator: string; speciesType: string
  productionTPA: number; investmentCr: number; yieldKgPerM3: number; cycleDays: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#166534', '#15803d', '#16a34a', '#22c55e', '#4ade80', '#14532d', '#052e16', '#365314']

const records: MYCRecord[] = [
  { id: 'MYC-0001', projectId: 'MYC-001', city: 'Bengaluru', operator: 'Mycoworks Bengaluru Facility', speciesType: 'Ganoderma lucidum Reishi',
    productionTPA: 12000, investmentCr: 85, yieldKgPerM3: 28, cycleDays: 45, status: 'Delivered', priority: 'Critical', origin: 'Mycoworks Culture Lab', destination: 'Bengaluru Packaging Hub', shipDate: '2025-09-05', transitDays: 1, state: 'Karnataka',
    remarks: 'Ganoderma lucidum Reishi mushroom cultivation at Mycoworks Bengaluru facility producing 12 TPA premium medicinal mushrooms. 45-day growth cycle on sterilized substrate blocks yields 28 kg/m3. &#8377;85 Cr facility supplies Reishi to Ayurveda pharmaceutical companies and nutraceutical exporters generating &#8377;35 Cr annual export revenue for Karnataka&apos;s growing functional mushroom market targeting Japan Korea and USA organic supplement channels.' },
  { id: 'MYC-0002', projectId: 'MYC-002', city: 'Dehradun', operator: 'Uttarakhand Mycelium Composites', speciesType: 'Pleurotus ostreatus Oyster Composite',
    productionTPA: 8500, investmentCr: 62, yieldKgPerM3: 35, cycleDays: 30, status: 'Delivered', priority: 'High', origin: 'Forest Research Institute', destination: 'Dehradun Eco Products', shipDate: '2025-09-10', transitDays: 2, state: 'Uttarakhand',
    remarks: 'Oyster mushroom mycelium composite facility at FRI Dehradun producing 8.5 TPA biodegradable packaging material from agricultural waste. Mycelium binds paddy straw and wheat husk into rigid packaging replacing expanded polystyrene. &#8377;62 Cr project under Uttarakhand Bio-Economy Policy converts pine needle forest waste into packaging products saving &#8377;8 Cr annually in pine needle forest fire prevention costs for Himalayan forest conservation programme.' },
  { id: 'MYC-0003', projectId: 'MYC-003', city: 'Guwahati', operator: 'Assam BioMycelium Unit', speciesType: 'Volvariella volvacea Paddy Straw',
    productionTPA: 15000, investmentCr: 45, yieldKgPerM3: 42, cycleDays: 25, status: 'Delivered', priority: 'High', origin: 'Assam Agricultural University', destination: 'Guwahati Market Hub', shipDate: '2025-09-02', transitDays: 2, state: 'Assam',
    remarks: 'Paddy straw mushroom cultivation at AAU Guwahati producing 15 TPA Volvariella volvacea using Assam&apos;s abundant paddy straw waste. Fastest growing mushroom species at 25-day cycle achieving 42 kg/m3 on tropical substrates. &#8377;45 Cr project trains 500 rural women mushroom cultivators across 15 Assam districts generating &#8377;12 Cr annual supplementary income for paddy farming households under Assam Rural Livelihood Mission and National Mission for Sustainable Agriculture.' },
  { id: 'MYC-0004', projectId: 'MYC-004', city: 'Srinagar', operator: 'Kashmir Mycelium Morel', speciesType: 'Morchella esculenta Morel',
    productionTPA: 800, investmentCr: 120, yieldKgPerM3: 8, cycleDays: 90, status: 'Delivered', priority: 'Critical', origin: 'Kashmir University Lab', destination: 'Srinagar Export Terminal', shipDate: '2025-08-28', transitDays: 3, state: 'Jammu and Kashmir',
    remarks: 'Morchella esculenta wild morel cultivation at Kashmir University Srinagar producing 800 kg per annum of world&apos;s most expensive cultivated mushroom. 90-day cold-weather cycle at Kashmir&apos;s 1,600m altitude simulates natural Himalayan morel fruiting conditions. &#8377;120 Cr high-value facility exports dried morel at &#8377;80,000/kg to European Michelin restaurants generating &#8377;64 Cr annual export revenue under Kashmir One District One Product programme targeting luxury food market with GI-tagged Kashmir Morel certification.' },
  { id: 'MYC-0005', projectId: 'MYC-005', city: 'Pune', operator: 'AgriMycel Maharashtra', speciesType: 'Agaricus bisporus Button Mushroom',
    productionTPA: 25000, investmentCr: 95, yieldKgPerM3: 32, cycleDays: 35, status: 'In Transit', priority: 'High', origin: 'AgriMycel Satara Farm', destination: 'Pune Distribution', shipDate: '2025-09-15', transitDays: 1, state: 'Maharashtra',
    remarks: 'Button mushroom production en route from AgriMycel Satara to Pune distribution network with 25 TPA capacity on controlled environment compost beds. Agaricus bisporus on wheat straw compost at 35-day cycle achieving 32 kg/m3 in temperature-controlled growing rooms. &#8377;95 Cr facility supplies button mushrooms to Pune Mumbai and Nashik hotel and restaurant chains and Pizza Hut Domino&apos;s India serving &#8377;15 Cr annual B2B food service market in Maharashtra metropolitan region.' },
  { id: 'MYC-0006', projectId: 'MYC-006', city: 'Bhopal', operator: 'MP Mycelium Bio-Remediation', speciesType: 'Phanerochaete chrysosporium White Rot',
    productionTPA: 5000, investmentCr: 78, yieldKgPerM3: 18, cycleDays: 60, status: 'Delivered', priority: 'Medium', origin: 'MP Pollution Control Board', destination: 'Bhopal Industrial Zone', shipDate: '2025-09-08', transitDays: 2, state: 'Madhya Pradesh',
    remarks: 'White rot mycelium for bioremediation at Bhopal industrial zone with 5 TPA fungal biomass production for effluent treatment. Phanerochaete chrysosporium produces lignin-degrading enzymes breaking down industrial dye and chemical pollutants in wastewater. &#8377;78 Cr deployment at 12 Bhopal industrial estates treats 50 million litres daily of textile and pharmaceutical effluent reducing COD by 80% and replacing chemical treatment processes saving &#8377;18 Cr annually in treatment chemical costs for MP Pollution Control Board.' },
  { id: 'MYC-0007', projectId: 'MYC-007', city: 'Chennai', operator: 'TamilNadu Mycelium Leather', speciesType: 'Ganoderma tsugae Bio-Leather',
    productionTPA: 3500, investmentCr: 110, yieldKgPerM3: 15, cycleDays: 50, status: 'Delivered', priority: 'Critical', origin: 'IIT Madras BioLab', destination: 'Chennai Leather Cluster', shipDate: '2025-08-25', transitDays: 2, state: 'Tamil Nadu',
    remarks: 'Mycelium bio-leather production at IIT Madras with 3.5 TPA Ganoderma tsugae mycelium sheets for sustainable fashion industry. Grown on agricultural waste substrate then compressed and tanned into leather-like material matching animal leather durability at 60% lower environmental footprint. &#8377;110 Cr project partners with Chennai Leather Cluster exporting mycelium leather to European luxury brands under India-EU Sustainable Fashion Agreement targeting &#8377;45 Cr annual revenue replacing 500,000 animal hides annually.' },
  { id: 'MYC-0008', projectId: 'MYC-008', city: 'Shillong', operator: 'Meghalaya Mycelium Food', speciesType: 'Lentinula edodes Shiitake',
    productionTPA: 6000, investmentCr: 55, yieldKgPerM3: 25, cycleDays: 55, status: 'Delivered', priority: 'Medium', origin: 'NEHU Shillong Culture', destination: 'Shillong Market', shipDate: '2025-09-12', transitDays: 3, state: 'Meghalaya',
    remarks: 'Shiitake mushroom cultivation at NEHU Shillong producing 6 TPA of premium Lentinula edodes on oak sawdust logs at Meghalaya&apos;s 1,500m altitude ideal for cool-weather shiitake. 55-day fruiting cycle on sterilized hardwood blocks yields 25 kg/m3 of dried shiitake for Northeast India and export markets. &#8377;55 Cr project supports 200 Khasi tribal mushroom growers under Meghalaya Basin Development Programme generating &#8377;8 Cr annual income for hill farming communities previously dependent on broom grass monoculture.' },
  { id: 'MYC-0009', projectId: 'MYC-009', city: 'Hyderabad', operator: 'AP Mycelium Insulation', speciesType: 'Mycelium Foam Board Insulation',
    productionTPA: 20000, investmentCr: 130, yieldKgPerM3: 12, cycleDays: 40, status: 'Delayed', priority: 'High', origin: 'AP Industrial Zone', destination: 'Hyderabad Construction Hub', shipDate: '2025-08-15', transitDays: 2, state: 'Telangana',
    remarks: 'Mycelium foam board insulation production at AP industrial zone Hyderabad delayed by fire safety certification testing. 20 TPA capacity growing mycelium on hemp hurds and crop residue into rigid insulation boards with R-value 3.0 per inch. &#8377;130 Cr facility targets Hyderabad&apos;s booming green construction market providing carbon-negative insulation panels for 500,000 sqm annual construction under Telangana Green Building Code replacing petroleum-based EPS and XPS insulation materials.' },
  { id: 'MYC-0010', projectId: 'MYC-010', city: 'Ranchi', operator: 'Jharkhand Mycelium Protein', speciesType: 'Pleurotus eryngii King Oyster',
    productionTPA: 10000, investmentCr: 42, yieldKgPerM3: 38, cycleDays: 30, status: 'Delivered', priority: 'Medium', origin: 'Ranchi University Farm', destination: 'Ranchi Food Processing', shipDate: '2025-09-01', transitDays: 1, state: 'Jharkhand',
    remarks: 'King oyster mushroom cultivation at Ranchi University producing 10 TPA Pleurotus eryngii for plant-based protein market. Thick-fleshed king oyster achieves 38 kg/m3 yield on maize cob substrate in 30-day cycle. &#8377;42 Cr facility processes fresh and dried king oyster for ITC Hotels and plant-based meat companies creating mushroom-based protein alternatives under Jharkhand Nutri-Food Mission generating &#8377;15 Cr annual revenue serving eastern India premium vegetarian food service segment.' },
  { id: 'MYC-0011', projectId: 'MYC-011', city: 'Thiruvananthapuram', operator: 'Kerala Mycelium Coir Composite', speciesType: 'Trametes versicolor Coir-Bound',
    productionTPA: 7000, investmentCr: 68, yieldKgPerM3: 22, cycleDays: 45, status: 'Delivered', priority: 'Medium', origin: 'Kerala Coir Board', destination: 'Trivandrum Port Export', shipDate: '2025-09-18', transitDays: 2, state: 'Kerala',
    remarks: 'Coir-mycelium composite production at Kerala Coir Board Trivandrum with 7 TPA Trametes versicolor grown on coir pith substrate creating biodegradable grow pots and nursery trays. Mycelium binds coir fiber into rigid plant containers replacing plastic nursery pots. &#8377;68 Cr project under Kerala Coir Development Programme exports bio-pots to 15 countries generating &#8377;22 Cr annual export revenue while eliminating 500 million plastic nursery pots from India&apos;s horticulture supply chain annually.' },
  { id: 'MYC-0012', projectId: 'MYC-012', city: 'Bhubaneswar', operator: 'Odisha Mycelium Brick', speciesType: 'Mycelium Structural Brick',
    productionTPA: 18000, investmentCr: 145, yieldKgPerM3: 10, cycleDays: 50, status: 'Processing', priority: 'Low', origin: 'Odisha Rice Mill Waste', destination: 'Bhubaneswar Green Building', shipDate: '2025-09-22', transitDays: 2, state: 'Odisha',
    remarks: 'Mycelium structural brick production at Odisha rice mill belt using rice husk substrate colonized with mycelium for 50 days then dried into load-bearing bricks with compressive strength 2 MPa. &#8377;145 Cr pilot facility processes 50,000 tonnes annual rice mill waste into 18,000 TPA structural bricks for Odisha affordable housing programme under Pradhan Mantri Awas Yojana-PMAY replacing fired clay bricks at 40% lower carbon footprint and 30% lower material cost for rural housing construction.' },
  { id: 'MYC-0013', projectId: 'MYC-013', city: 'Imphal', operator: 'Manipur BioFloc Mycelium', speciesType: 'Hericium erinaceus Lion Mane',
    productionTPA: 2500, investmentCr: 38, yieldKgPerM3: 16, cycleDays: 60, status: 'Delivered', priority: 'High', origin: 'CAU Imphal Lab', destination: 'Imphal Wellness Hub', shipDate: '2025-09-06', transitDays: 5, state: 'Manipur',
    remarks: 'Lion&apos;s mane mushroom cultivation at Central Agricultural University Imphal producing 2.5 TPA Hericium erinaceus for brain health nutraceutical market. Rich in hericenones and erinacines compounds shown to stimulate nerve growth factor. &#8377;38 Cr facility under Manipur Organic Mission supplies dried lion&apos;s mane to Ayurveda nutraceutical companies targeting India&apos;s &#8377;500 Cr nootropic supplement market while providing 80 Manipuri tribal farmers with high-value cash crop income replacing poppy cultivation in hill districts.' },
  { id: 'MYC-0014', projectId: 'MYC-014', city: 'Gandhinagar', operator: 'Gujarat Mycelium Pharma', speciesType: 'Cordyceps militaris Caterpillar Fungus',
    productionTPA: 1500, investmentCr: 165, yieldKgPerM3: 6, cycleDays: 75, status: 'Delayed', priority: 'High', origin: 'Gujarat Ayurveda Univ', destination: 'Ahmedabad Pharma Hub', shipDate: '2025-08-20', transitDays: 2, state: 'Gujarat',
    remarks: 'Cordyceps militaris cultivation at Gujarat Ayurveda University Gandhinagar producing 1.5 TPA of high-value caterpillar fungus for pharmaceutical industry. Contains cordycepin and adenosine compounds with anti-fatigue and immunomodulatory properties. &#8377;165 Cr facility delayed by culture contamination issue supplies cordyceps extract to Dabur Himalaya and Zandu pharmaceutical companies at &#8377;40,000/kg dried cordyceps under Gujarat Biotechnology Mission targeting India&apos;s &#8377;2,000 Cr Ayurveda export market with cultivated alternative to wild Himalayan cordyceps.' },
]

export default function MyceliumLogisticsView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof MYCRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'speciesType', label: 'Species Type', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.speciesType] = (m[r.speciesType] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Production', value: `${filtered.reduce((a: number, r) => a + r.productionTPA, 0).toLocaleString()} TPA` },
    { label: 'Avg Yield', value: `${(filtered.reduce((a: number, r) => a + r.yieldKgPerM3, 0) / Math.max(1, filtered.length)).toFixed(1)} kg/m3` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Avg Cycle', value: `${(filtered.reduce((a: number, r) => a + r.cycleDays, 0) / Math.max(1, filtered.length)).toFixed(0)} days` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: MYCRecord) => string, val: (r: MYCRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.productionTPA)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const matBar = grp(r => r.speciesType, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const effData = filtered.map(r => ({ name: r.speciesType.split(' ').slice(0, 2).join(' '), value: r.yieldKgPerM3 }))
    const lm = filtered.reduce((a: Record<string, { productionTPA: number; investmentCr: number }>, r) => {
      if (!a[r.state]) a[r.state] = { productionTPA: 0, investmentCr: 0 }
      a[r.state].productionTPA += r.productionTPA; a[r.state].investmentCr += r.investmentCr; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, productionTPA: v.productionTPA, investmentCr: v.investmentCr }))
    return { barState, pieState, statusPie, matBar, priorityPie, totalInvest, effData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="myc-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Mycelium' }]} />
      <PageHeader title="Mycelium Logistics" description="Track mycelium supply chains, mushroom and fungal biomass logistics, bio-materials distribution, mycelium composites, leather alternatives and mushroom cultivation supply networks across India" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="myc-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`myc-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-green-800 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="myc-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="myc-kpi-card"><CardContent className="p-4"><p className="myc-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="myc-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="myc-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="myc-chart-title text-sm">Production (TPA) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#166534" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="myc-chart-title text-sm">Installations by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="myc-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="myc-chart-title text-sm">Yield (kg/m3) by Species</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.effData}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#15803d" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="myc-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="myc-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`myc-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-green-800'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.speciesType} | {r.state}</p>
              <p className="text-xs mt-1">{r.productionTPA.toLocaleString()} TPA | {r.yieldKgPerM3} kg/m3 | {r.cycleDays}d cycle | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="myc-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="myc-chart-title text-sm">Production vs Investment by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="productionTPA" stroke="#166534" name="Production TPA" /><Line yAxisId="right" type="monotone" dataKey="investmentCr" stroke="#4ade80" name="Investment &#8377; Cr" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="myc-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#14532d" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="myc-chart-title text-sm">Species Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.matBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#15803d" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="myc-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="myc-insights grid grid-cols-2 gap-4">
        <Card className="myc-insight-card border-l-4 border-l-green-800"><CardContent className="p-5">
          <h4 className="myc-insight-title font-semibold text-base">India&apos;s &#8377;5,000 Cr Mycelium Economy by 2030</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s mycelium industry projected to reach &#8377;5,000 Cr by 2030 driven by medicinal mushrooms, bio-materials and sustainable packaging. DPIIT Startup India initiative supporting 200 mycelium startups across mushroom cultivation, bio-composites and mycelium leather. Ministry of Food Processing Industries allocating &#8377;500 Cr under PMKSY for mushroom cultivation infrastructure in 300 districts targeting India&apos;s 1.4 billion protein demand with sustainable fungi-based alternatives to meat and dairy protein sources.</p>
        </CardContent></Card>
        <Card className="myc-insight-card border-l-4 border-l-green-800"><CardContent className="p-5">
          <h4 className="myc-insight-title font-semibold text-base">Mycelium Packaging Replacing 500,000 Tonnes Plastic</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India generates 26,000 tonnes plastic packaging waste daily with mycelium composites offering biodegradable alternative at comparable cost. IIT Kharagpur and Mushroom Research Centre Solan developing strain-specific mycelium achieving packaging-grade mechanical strength from paddy straw and wheat husk. &#8377;800 Cr National Mycelium Packaging Programme targeting 500,000 tonnes annual plastic replacement by 2028 through Amazon India Flipkart and Zomato packaging supply chain partnerships.</p>
        </CardContent></Card>
        <Card className="myc-insight-card border-l-4 border-l-green-800"><CardContent className="p-5">
          <h4 className="myc-insight-title font-semibold text-base">Northeast India: Mushroom Capital of South Asia</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Northeast India produces 40% of India&apos;s cultivated mushrooms leveraging ideal climate conditions with 200+ indigenous mushroom species documented by Botanical Survey of India. Meghalaya Assam Manipur and Sikkim cultivating shiitake oyster and paddy straw mushrooms for domestic and export markets. Ministry of DoNER allocating &#8377;300 Cr under Northeast Bio-Economy Mission creating 50,000 mushroom farming jobs replacing jhum cultivation and opium farming with profitable mycelium-based livelihoods for tribal communities.</p>
        </CardContent></Card>
        <Card className="myc-insight-card border-l-4 border-l-green-800"><CardContent className="p-5">
          <h4 className="myc-insight-title font-semibold text-base">Mycelium Construction: Carbon-Negative Buildings for PMAY</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Mycelium bricks and insulation panels offer carbon-negative construction materials absorbing 16 kg CO2 per kg of mycelium grown. IIT Madras and CSIR-SERC developing mycelium structural bricks with 2 MPa compressive strength meeting IS 1077 lightweight block standards. &#8377;1,200 Cr Mycelium Green Building Programme under PMAY-G targets 5 million mycelium bricks annually for affordable rural housing across 500 districts providing 30% thermal insulation improvement reducing household energy costs for below-poverty-line beneficiaries.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
