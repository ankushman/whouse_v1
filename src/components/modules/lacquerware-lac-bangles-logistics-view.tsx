import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#7c2d12', '#9a3412', '#c2410c', '#ea580c', '#f97316', '#431407', '#5a1d08', '#fff7ed']
const PRODUCTS = ['Rajasthan Lac Bangles', 'Hyderabad Lacquer Toys', 'Channapatna Lac Ware', 'Etikoppaka Lac Craft', 'Mysore Sandal Lac Bangles', 'Jaipur Meenakari Lac', 'Saharanpur Lac Wood', 'Nagaland Bamboo Lac']
const MANUFACTURERS = ['Jaipur Lac Cluster RJ', 'Hyderabad Lac Art AP', 'Channapatna Toys KA', 'Etikoppaka Artisans AP', 'Mysore Lac Industry KA', 'Jodhpur Lac Works RJ', 'Varanasi Lac Unit UP', 'Sivasagar Lac Craft AS']
const STATUSES = ['GI Lac Mark', 'IS 1670 Lac Grade', 'Bubble Wrapped', 'Pallet Transit', 'Dehumid Store', 'Fragility QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="llb-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="llb-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="llb-costbar w-full bg-orange-100 rounded h-2"><div className="bg-orange-700 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="llb-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#7c2d12" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="llb-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="llb-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['sets', 'pairs', 'units', 'boxes']
  return {
    id: `LLB-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], manufacturer: MANUFACTURERS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(50, 3000, 100 + idx * 75), unit: units[idx % 4],
    cost: ri(5000, 180000, 8000 + idx * 6500), date: `2025-07-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const lacRecords = [
  { id: 'LLB-0001', product: 'Rajasthan Lac Bangles', manufacturer: 'Jaipur Lac Cluster RJ', status: 'GI Lac Mark', qty: 2000, unit: 'pairs', cost: 35000, date: '2025-07-02' },
  { id: 'LLB-0002', product: 'Hyderabad Lacquer Toys', manufacturer: 'Hyderabad Lac Art AP', status: 'IS 1670 Lac Grade', qty: 500, unit: 'sets', cost: 28000, date: '2025-07-04' },
  { id: 'LLB-0003', product: 'Channapatna Lac Ware', manufacturer: 'Channapatna Toys KA', status: 'Bubble Wrapped', qty: 300, unit: 'units', cost: 52000, date: '2025-07-05' },
  { id: 'LLB-0004', product: 'Etikoppaka Lac Craft', manufacturer: 'Etikoppaka Artisans AP', status: 'Pallet Transit', qty: 150, unit: 'boxes', cost: 67000, date: '2025-07-07' },
  { id: 'LLB-0005', product: 'Mysore Sandal Lac Bangles', manufacturer: 'Mysore Lac Industry KA', status: 'Dehumid Store', qty: 800, unit: 'pairs', cost: 95000, date: '2025-07-08' },
  { id: 'LLB-0006', product: 'Jaipur Meenakari Lac', manufacturer: 'Jodhpur Lac Works RJ', status: 'Fragility QC', qty: 400, unit: 'sets', cost: 142000, date: '2025-07-10' },
  { id: 'LLB-0007', product: 'Saharanpur Lac Wood', manufacturer: 'Varanasi Lac Unit UP', status: 'GI Lac Mark', qty: 250, unit: 'units', cost: 38000, date: '2025-07-11' },
  { id: 'LLB-0008', product: 'Nagaland Bamboo Lac', manufacturer: 'Sivasagar Lac Craft AS', status: 'IS 1670 Lac Grade', qty: 180, unit: 'boxes', cost: 22000, date: '2025-07-13' },
  { id: 'LLB-0009', product: 'Rajasthan Lac Bangles', manufacturer: 'Jaipur Lac Cluster RJ', status: 'Bubble Wrapped', qty: 1800, unit: 'pairs', cost: 31500, date: '2025-07-14' },
  { id: 'LLB-0010', product: 'Hyderabad Lacquer Toys', manufacturer: 'Hyderabad Lac Art AP', status: 'Pallet Transit', qty: 450, unit: 'sets', cost: 25200, date: '2025-07-15' },
  { id: 'LLB-0011', product: 'Channapatna Lac Ware', manufacturer: 'Channapatna Toys KA', status: 'Dehumid Store', qty: 280, unit: 'units', cost: 48600, date: '2025-07-16' },
  { id: 'LLB-0012', product: 'Etikoppaka Lac Craft', manufacturer: 'Etikoppaka Artisans AP', status: 'Fragility QC', qty: 140, unit: 'boxes', cost: 62500, date: '2025-07-17' },
  { id: 'LLB-0013', product: 'Mysore Sandal Lac Bangles', manufacturer: 'Mysore Lac Industry KA', status: 'GI Lac Mark', qty: 750, unit: 'pairs', cost: 89000, date: '2025-07-18' },
  { id: 'LLB-0014', product: 'Jaipur Meenakari Lac', manufacturer: 'Jodhpur Lac Works RJ', status: 'IS 1670 Lac Grade', qty: 380, unit: 'sets', cost: 135000, date: '2025-07-19' },
  { id: 'LLB-0015', product: 'Saharanpur Lac Wood', manufacturer: 'Varanasi Lac Unit UP', status: 'Bubble Wrapped', qty: 230, unit: 'units', cost: 35000, date: '2025-07-20' },
  { id: 'LLB-0016', product: 'Nagaland Bamboo Lac', manufacturer: 'Sivasagar Lac Craft AS', status: 'Pallet Transit', qty: 165, unit: 'boxes', cost: 20200, date: '2025-07-21' },
  { id: 'LLB-0017', product: 'Rajasthan Lac Bangles', manufacturer: 'Jaipur Lac Cluster RJ', status: 'Dehumid Store', qty: 1600, unit: 'pairs', cost: 28000, date: '2025-07-22' },
  { id: 'LLB-0018', product: 'Hyderabad Lacquer Toys', manufacturer: 'Hyderabad Lac Art AP', status: 'Fragility QC', qty: 420, unit: 'sets', cost: 23600, date: '2025-07-23' },
  { id: 'LLB-0019', product: 'Channapatna Lac Ware', manufacturer: 'Channapatna Toys KA', status: 'GI Lac Mark', qty: 260, unit: 'units', cost: 45000, date: '2025-07-24' },
  { id: 'LLB-0020', product: 'Etikoppaka Lac Craft', manufacturer: 'Etikoppaka Artisans AP', status: 'IS 1670 Lac Grade', qty: 130, unit: 'boxes', cost: 58200, date: '2025-07-25' },
]


export default function LacquerwareLacBanglesLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...lacRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.product.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string))
    })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'product', label: 'Product', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.product === p).length })) },
    { key: 'status', label: 'Status', options: STATUSES.map(s => ({ value: s, label: s, count: allRecords.filter(r => r.status === s).length })) },
  ]

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 15 + i * 7, cost: 40000 + i * 22000 }))
  const mfgChart = MANUFACTURERS.slice(0, 6).map((m, i) => ({ name: m.split(' ').slice(0, 2).join(' '), volume: 120 + i * 60, revenue: 4 + i * 3 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 9 + i * 3 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="llb-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Lacquerware & Lac Bangles' }]} />
      <PageHeader title="Lacquerware & Lac Bangles Logistics" description="Track traditional lacquer-coated crafts, lac bangles, Channapatna toys, and Etikoppaka lacquerware from India's heritage artisan clusters to retail and export destinations" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-orange-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="📿" label="Total Shipments" value={String(allRecords.length)} />
            <KpiTile icon="🏭" label="Artisan Clusters" value={String(MANUFACTURERS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile icon="📈" label="Avg Cost" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="llb-health-grid">
            <CardHeader><CardTitle>Operational Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={86} label="GI Lac" />
                <HealthRing value={79} label="IS 1670" />
                <HealthRing value={83} label="Wrap" />
                <HealthRing value={77} label="Pallet" />
                <HealthRing value={91} label="Dehumid" />
                <HealthRing value={72} label="Fragility" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Jaipur Stock" value="5,400 pairs" />
            <ValueTile label="QC Passed" value="31 Lots" />
            <ValueTile label="Heritage SKUs" value="128 Types" />
            <ValueTile label="Export Ready" value="65%" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filteredRecords.length} onRefresh={() => {}} placeholder="Search by ID, product, cluster, or lot..." />

          <Card className="llb-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-orange-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-left">Cluster</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Cost</th>
                    <th className="p-3 text-left">Cost Bar</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.slice(0, 15).map(r => (
                    <tr key={r.id} className="border-b hover:bg-orange-50/50">
                      <td className="p-3 font-mono text-xs">{r.id}</td>
                      <td className="p-3"><ProductBadge name={r.product} /></td>
                      <td className="p-3 text-xs">{r.manufacturer}</td>
                      <td className="p-3"><StatusBadge status={r.status} /></td>
                      <td className="p-3 text-right">{r.qty} {r.unit}</td>
                      <td className="p-3 text-right">₹{r.cost.toLocaleString()}</td>
                      <td className="p-3 w-28"><CostBar cost={r.cost} max={maxCost} /></td>
                      <td className="p-3 text-xs text-gray-500">{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Shipment Trend</CardTitle></CardHeader>
              <CardContent>
                <LineChart width={500} height={250} data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="shipments" stroke={COLORS[0]} strokeWidth={2} />
                  <Line type="monotone" dataKey="cost" stroke={COLORS[3]} strokeWidth={2} />
                </LineChart>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Cluster Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={250} data={mfgChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={10} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]} />
                  <Bar dataKey="revenue" fill={COLORS[3]} />
                </BarChart>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Status Distribution</CardTitle></CardHeader>
            <CardContent>
              <PieChart width={500} height={300}>
                <Pie data={statusPie} cx={200} cy={150} outerRadius={100} dataKey="value" label>
                  {statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="llb-insight"><CardHeader><CardTitle>Rajasthan Lac Bangle Heritage</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Rajasthan is India's largest lac bangle production centre, with Jaipur and Jodhpur together producing over 50 crore lac bangles annually worth ₹800 crore. The craft employs 3 lakh women artisans across 15,000 micro-enterprises. Lac is a natural resin secreted by the lac insect (Kerria lacca) found on kusum and palash trees. Traditional Rajasthani lac bangles feature mirror work, kundan settings, and meenakari enamel. The GI tag for Rajasthani lac bangles protects the craft's geographic origin and traditional making process under the Geographical Indications Act 1999.</p></CardContent></Card>
            <Card className="llb-insight"><CardHeader><CardTitle>Channapatna & Etikoppaka Traditions</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Channapatna in Karnataka produces lacquerware using Hale wood (Wrightia tinctoria) with vegetable-dye lacquer finishes in vivid reds, yellows, and greens under GI registration since 2005. The craft dates to Tipu Sultan's era (1780s) when Persian artisans introduced the technique. Etikoppaka in Andhra Pradesh uses Ankudu wood with lacquer from local forest trees. Both clusters employ 25,000+ artisans and generate ₹150 crore in annual revenue. The lacquer coating provides a non-toxic, food-safe finish ideal for children's toys and kitchenware.</p></CardContent></Card>
            <Card className="llb-insight"><CardHeader><CardTitle>IS 1670 Lac Standards & Fragility Handling</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">IS 1670 classifies lac resin into four commercial grades (shellac, button lac, dewaxed lac, and bleached lac) based on purity, moisture, and acid value. Lac-coated products must maintain coating thickness between 0.15-0.25mm for durability. Fragility testing IS 1498 specifies drop-test from 76cm onto concrete with zero cracking tolerance. Dehumidified storage at 40-55% relative humidity prevents lac crazing and delamination. India exports 65,000 tonnes of lac and lac products worth ₹1,200 crore to 80+ countries annually.</p></CardContent></Card>
            <Card className="llb-insight"><CardHeader><CardTitle>AI Color Matching & Lac Supply Chain</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">AI-powered spectrophotometry matches lacquer colours with 99.2% consistency across batches, reducing artisan rework by 30%. Blockchain-traced lac supply chain from forest harvest to finished product ensures sustainable sourcing from approved tree hosts. The National Mission on Natural Lac promotes lac-based livelihoods for 40 lakh tribals in Jharkhand, Chhattisgarh, and Odisha. AI demand forecasting for festive season lac bangle sales achieves 85% accuracy. Machine learning detects lac coating defects in real-time on production lines with 96% precision.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
