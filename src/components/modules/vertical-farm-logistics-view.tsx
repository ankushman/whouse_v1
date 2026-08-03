'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface VFLRecord {
  id: string; projectId: string; city: string; operator: string; farmType: string
  areaSqm: number; investmentCr: number; yieldKg: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#3f6212', '#4d7c0f', '#65a30d', '#84cc16', '#a3e635', '#bef264', '#d9f99d', '#ecfccb']

const records: VFLRecord[] = [
  { id: 'VFL-001', projectId: 'VFL-001', city: 'Bengaluru', operator: 'AeroFarms Bengaluru', farmType: 'Aeroponic Leafy Greens',
    areaSqm: 4500, investmentCr: 95, yieldKg: 320000, status: 'Delivered', priority: 'Critical', origin: 'Whitefield Seed Hub', destination: 'HSR Layout Retail', shipDate: '2024-01-10', transitDays: 2, state: 'Karnataka',
    remarks: '4,500 sqm aeroponic vertical farm producing 320 MT/year lettuce, spinach, and herbs using 95% less water than field agriculture. NPK-optimized nutrient mist with AI-controlled environmental parameters (22-26&#176;C, 65% humidity, 16h photoperiod) serving Bengaluru&apos;s premium salad and juice market' },
  { id: 'VFL-002', projectId: 'VFL-002', city: 'Delhi NCR', operator: 'FreshVista Hydroponics', farmType: 'NFT Hydroponic Herbs',
    areaSqm: 3200, investmentCr: 68, yieldKg: 185000, status: 'Delivered', priority: 'Critical', origin: 'Gurgaon Cold Chain', destination: 'Khan Market Gourmet', shipDate: '2024-01-22', transitDays: 1, state: 'Delhi',
    remarks: '3,200 sqm NFT hydroponic farm growing basil, mint, cilantro, and microgreens in controlled environment for Delhi&apos;s 5-star hotels and fine dining restaurants. Harvest-to-plate in 4 hours, 30x higher yield per sqm than open-field herbs, zero pesticide certified by APEDA for export' },
  { id: 'VFL-003', projectId: 'VFL-003', city: 'Mumbai', operator: 'UrbanGreens Powai', farmType: 'Vertical Mushroom Farm',
    areaSqm: 2800, investmentCr: 52, yieldKg: 240000, status: 'Delivered', priority: 'High', origin: 'Powai Compost Hub', destination: 'Crawford Market Wholesale', shipDate: '2024-02-05', transitDays: 2, state: 'Maharashtra',
    remarks: '2,800 sqm multi-tier mushroom farm producing oyster, button, and shiitake varieties using paddy straw substrate from Mumbai&apos;s rice mills. 240 MT/year with 12 harvest cycles, converting agricultural waste into premium protein crop serving Mumbai&apos;s 120 MT/day mushroom demand' },
  { id: 'VFL-004', projectId: 'VFL-004', city: 'Chennai', operator: 'TamilAgri Vertical', farmType: 'Dutch Bucket Hydroponic Tomatoes',
    areaSqm: 5500, investmentCr: 110, yieldKg: 480000, status: 'Delivered', priority: 'High', origin: 'Kanchipuram Green Belt', destination: 'Koyambedu Market', shipDate: '2024-02-18', transitDays: 3, state: 'Tamil Nadu',
    remarks: '5,500 sqm Dutch bucket hydroponic tomato farm with 8-tier vertical stacking, 480 MT/year of cherry and vine tomatoes. Computer-controlled drip fertigation with CO2 enrichment achieving 45 kg/sqm/year vs 3 kg/sqm in field, supplying Chennai&apos;s pizza chains and processed tomato industry' },
  { id: 'VFL-005', projectId: 'VFL-005', city: 'Hyderabad', operator: 'AgriDome IoT Farms', farmType: 'Smart Container Farm Strawberries',
    areaSqm: 1800, investmentCr: 85, yieldKg: 95000, status: 'In Transit', priority: 'High', origin: 'AgriDome Factory', destination: 'Banjara Hills Premium', shipDate: '2024-04-15', transitDays: 2, state: 'Telangana',
    remarks: '1,800 sqm shipping container vertical farm with IoT-controlled hydroponic strawberries, 95 kg/sqm/year yield in insulated containers maintaining 15-22&#176;C year-round. Hydroponic strawberry logistics from container to retail in under 6 hours, serving Hyderabad&apos;s growing premium fruit market' },
  { id: 'VFL-006', projectId: 'VFL-006', city: 'Pune', operator: 'Mahyco GreenHouse Tech', farmType: 'Aquaponic Fish + Greens',
    areaSqm: 4000, investmentCr: 120, yieldKg: 210000, status: 'Delivered', priority: 'Medium', origin: 'Pune Agri Export Zone', destination: 'FC Road Organic Store', shipDate: '2024-03-05', transitDays: 3, state: 'Maharashtra',
    remarks: '4,000 sqm aquaponic facility integrating tilapia fish farming with leafy green production, fish waste converted to plant nutrients via biofilter bacteria. Zero-input circular system producing 210 MT greens and 45 MT fish annually, reducing water consumption by 97% compared to separate aquaculture and agriculture' },
  { id: 'VFL-007', projectId: 'VFL-007', city: 'Kolkata', operator: 'Bengal Fresh Vertical', farmType: 'Microgreens Rack System',
    areaSqm: 1200, investmentCr: 38, yieldKg: 68000, status: 'Delivered', priority: 'Medium', origin: 'Salt Lake Seed Bank', destination: 'Park Street Restaurants', shipDate: '2024-03-18', transitDays: 2, state: 'West Bengal',
    remarks: '1,200 sqm automated microgreens rack system growing 28 varieties including radish, sunflower, pea, and wheatgrass microgreens. 10-day growth cycle with 95% germination rate, supplying 150+ Kolkata restaurants and 40 health food stores with daily harvest delivery' },
  { id: 'VFL-008', projectId: 'VFL-008', city: 'Jaipur', operator: 'Rajasthan Desert Green', farmType: 'Saltwater Hydroponic Fodder',
    areaSqm: 6000, investmentCr: 75, yieldKg: 540000, status: 'Delivered', priority: 'High', origin: 'Jodhpur Saline Bore', destination: 'Jaipur Dairy Hub', shipDate: '2024-02-28', transitDays: 5, state: 'Rajasthan',
    remarks: '6,000 sqm saltwater hydroponic fodder farm using brackish groundwater for barley and maize sprout fodder production. 540 MT/year fodder for 12,000 dairy cattle, converting Rajasthan&apos;s saline water problem into livestock feed solution, reducing fodder import from Punjab by 25%' },
  { id: 'VFL-009', projectId: 'VFL-009', city: 'Kochi', operator: 'Kerala Spice Vertical', farmType: 'Climate-Controlled Vanilla',
    areaSqm: 3500, investmentCr: 180, yieldKg: 42000, status: 'Processing', priority: 'High', origin: 'Idukki Vanilla Estate', destination: 'Mattancherry Spice Market', shipDate: '2024-06-20', transitDays: 4, state: 'Kerala',
    remarks: '3,500 sqm climate-controlled vanilla vertical farm replicating Idukki&apos;s natural vanilla growing conditions at controlled 28&#176;C and 80% humidity. 42 MT/year vanilla bean production in 8 months vs 3-year field curing cycle, serving India&apos;s &#8377;3,500 Cr vanilla export market' },
  { id: 'VFL-010', projectId: 'VFL-010', city: 'Lucknow', operator: 'UP Smart Farm Network', farmType: 'Ebb and Flow Hydroponic Cucumbers',
    areaSqm: 4800, investmentCr: 62, yieldKg: 380000, status: 'Delivered', priority: 'Medium', origin: 'Lucknow Seed Supply', destination: 'Aminabad Vegetable Market', shipDate: '2024-03-28', transitDays: 3, state: 'Uttar Pradesh',
    remarks: '4,800 sqm ebb-and-flow hydroponic cucumber farm with 6-tier vertical system, 380 MT/year of seedless cucumber. AI-optimized nutrient delivery reducing fertilizer use by 80% while maintaining 98% market-grade quality. Supplying Lucknow, Kanpur, and Varanasi fresh produce markets year-round' },
  { id: 'VFL-011', projectId: 'VFL-011', city: 'Bhubaneswar', operator: 'Odisha AquaVeg Farms', farmType: 'Deep Water Culture Kale',
    areaSqm: 2500, investmentCr: 55, yieldKg: 165000, status: 'In Transit', priority: 'Medium', origin: 'Bhubaneswar Green Hub', destination: 'Unit 1 Market Complex', shipDate: '2024-05-10', transitDays: 4, state: 'Odisha',
    remarks: '2,500 sqm deep water culture kale and Swiss chard farm with LED spectrum optimization for maximum leaf nutrition. 165 MT/year superfood greens with 30% higher vitamin K and iron content than field-grown, targeting Odisha&apos;s growing health-conscious urban population of 4 million' },
  { id: 'VFL-012', projectId: 'VFL-012', city: 'Guwahati', operator: 'NE Organic Towers', farmType: 'Rotating Vertical Tower Farm',
    areaSqm: 1500, investmentCr: 72, yieldKg: 125000, status: 'Delivered', priority: 'Low', origin: 'Guwahati Agri Terminal', destination: 'Pan Bazaar Fresh', shipDate: '2024-04-08', transitDays: 3, state: 'Assam',
    remarks: '1,500 sqm rotating vertical tower farm growing lettuce, bok choy, and medicinal herbs for Guwahati and Dibrugarh markets. Automated carousel system with gravity-fed nutrient film, 125 MT/year from footprint 90% smaller than equivalent field area, suitable for Northeast urban rooftop installations' },
  { id: 'VFL-013', projectId: 'VFL-013', city: 'Indore', operator: 'MP Clean Food Labs', farmType: 'BioSecure Seedling Nursery',
    areaSqm: 2200, investmentCr: 45, yieldKg: 2800000, status: 'Delivered', priority: 'Medium', origin: 'Jhabua Seed Zone', destination: 'Indore Kisan Mandi', shipDate: '2024-03-05', transitDays: 6, state: 'Madhya Pradesh',
    remarks: '2,200 sqm biosecure vertical seedling nursery producing 2.8 million disease-free grafted vegetable seedlings annually for MP&apos;s tomato, pepper, and brinjal farmers. Maintaining 14 pathogen-free zones with HEPA filtration, increasing farmer yields by 40% with virus-resistant hybrid seedlings' },
  { id: 'VFL-014', projectId: 'VFL-014', city: 'Ahmedabad', operator: 'Sabarmati Green Towers', farmType: 'Aeroponic Medicinal Plants',
    areaSqm: 3800, investmentCr: 140, yieldKg: 85000, status: 'Delayed', priority: 'High', origin: 'Gandhinagar Pharma Zone', destination: 'Zydus CADILA Processing', shipDate: '2024-06-01', transitDays: 5, state: 'Gujarat',
    remarks: '3,800 sqm aeroponic farm growing 12 medicinal plant species (ashwagandha, tulsi, saffron, stevia) with pharmaceutical-grade quality control. 85 MT/year supplying Zydus, Cadila, and 8 Ayurvedic pharma companies with GACP-certified raw materials, 10x higher active alkaloid content than field crops' },
]

export default function VerticalFarmLogisticsView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof VFLRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'farmType', label: 'Farm Type', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.farmType] = (m[r.farmType] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Farm Area', value: `${filtered.reduce((a: number, r) => a + r.areaSqm, 0).toLocaleString()} sqm` },
    { label: 'Total Annual Yield', value: `${(filtered.reduce((a: number, r) => a + r.yieldKg, 0) / 1000).toFixed(0)}k MT/yr` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Yield Efficiency', value: `${(filtered.reduce((a: number, r) => a + r.yieldKg, 0) / Math.max(1, filtered.reduce((a: number, r) => a + r.areaSqm, 0))).toFixed(0)} kg/sqm` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: VFLRecord) => string, val: (r: VFLRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.areaSqm)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const typeBar = grp(r => r.farmType, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const effData = filtered.map(r => ({ name: r.city.slice(0, 10), value: +(r.yieldKg / r.areaSqm).toFixed(1) }))
    const lm = filtered.reduce((a: Record<string, { areaSqm: number; yieldKg: number }>, r) => {
      if (!a[r.state]) a[r.state] = { areaSqm: 0, yieldKg: 0 }
      a[r.state].areaSqm += r.areaSqm; a[r.state].yieldKg += r.yieldKg; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, areaSqm: v.areaSqm, yieldKg: v.yieldKg }))
    return { barState, pieState, statusPie, typeBar, priorityPie, totalInvest, effData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="vfl-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Vertical Farm' }]} />
      <PageHeader title="Vertical Farm Logistics" description="Track vertical farming operations, controlled environment agriculture, hydroponic supply chains, and urban food production systems across India's major cities" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="vfl-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`vfl-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-lime-700 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="vfl-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="vfl-kpi-card"><CardContent className="p-4"><p className="vfl-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="vfl-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="vfl-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="vfl-chart-title text-sm">Farm Area (sqm) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#3f6212" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="vfl-chart-title text-sm">Farms by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="vfl-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="vfl-chart-title text-sm">Yield Efficiency (kg/sqm) by City</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.effData}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#4d7c0f" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="vfl-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="vfl-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`vfl-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-lime-700'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.farmType} | {r.state}</p>
              <p className="text-xs mt-1">{r.areaSqm.toLocaleString()} sqm | {(r.yieldKg / 1000).toFixed(0)} MT/yr yield | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="vfl-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="vfl-chart-title text-sm">Area vs Yield by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="areaSqm" stroke="#3f6212" name="Area sqm" /><Line yAxisId="right" type="monotone" dataKey="yieldKg" stroke="#84cc16" name="Yield kg" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="vfl-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#65a30d" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="vfl-chart-title text-sm">Farm Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.typeBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#a3e635" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="vfl-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="vfl-insights grid grid-cols-2 gap-4">
        <Card className="vfl-insight-card border-l-4 border-l-lime-700"><CardContent className="p-5">
          <h4 className="vfl-insight-title font-semibold text-base">India&apos;s Urban Food Crisis: Vertical Farming Solution</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s urban population will reach 600 million by 2030, requiring 30% more fresh produce in cities with shrinking farmland. Vertical farming produces 10-30x more food per sqm than field agriculture while using 95% less water and zero pesticides. The Indian vertical farming market is projected at &#8377;8,500 Cr by 2028.</p>
        </CardContent></Card>
        <Card className="vfl-insight-card border-l-4 border-l-lime-700"><CardContent className="p-5">
          <h4 className="vfl-insight-title font-semibold text-base">Cold Chain: Critical Vertical Farm Logistics Link</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Vertical farm produce requires 2-8&#176;C cold chain within 30 minutes of harvest to maintain 14+ day shelf life. India loses 35-40% of fresh produce due to cold chain gaps. Vertical farms solve this by co-locating with retail distribution centers, enabling harvest-to-shelf in under 4 hours with zero cold chain intermediaries.</p>
        </CardContent></Card>
        <Card className="vfl-insight-card border-l-4 border-l-lime-700"><CardContent className="p-5">
          <h4 className="vfl-insight-title font-semibold text-base">Energy: Vertical Farm&apos;s Biggest Challenge</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">LED lighting consumes 40-60% of vertical farm energy costs. India&apos;s high electricity costs (&#8377;8-12/kWh industrial) make solar integration mandatory for profitability. 500 kW rooftop solar with battery storage reduces energy cost by 55%, making vertical farm produce price-competitive with field crops for premium urban markets.</p>
        </CardContent></Card>
        <Card className="vfl-insight-card border-l-4 border-l-lime-700"><CardContent className="p-5">
          <h4 className="vfl-insight-title font-semibold text-base">Government Schemes Supporting Vertical Farming</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">NHB provides 25% capital subsidy for controlled environment agriculture under MIDH scheme. APEDA offers organic certification subsidies for hydroponic export farms. Smart Cities Mission funds urban vertical farm integration in 100 cities. PMKSY allocates &#8377;500 Cr for peri-urban protected cultivation including vertical farming clusters.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
