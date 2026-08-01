import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#365314', '#3f6212', '#4d7c0f', '#65a30d', '#84cc16', '#1a2e05', '#1f3a07', '#f7fee7']
const PRODUCTS = ['Assam Orthodox Tea', 'Darjeeling First Flush', 'Nilgiri Black Tea', 'Green Tea Sikkim', 'Cardamom Alleppey Green', 'Turmeric Lakadong', 'Black Pepper Malabar', 'Cinnamon Ceylon Grown']
const ESTATES = ['Harmutty Tea Estate Assam', 'Makaibari Darjeeling', 'Nonsuch Nilgiri TN', 'Temi Garden Sikkim', 'Cardamom Board Idukki', 'Spice Board Kochi', 'Pepper Growers Wayanad', 'Cardamom Hills Karnataka']
const STATUSES = ['FSSAI Tea Board', 'GI Tag Certified', 'In Transit Liner', 'Warehouse Aroma Seal', 'Pending Tea Board License', 'Awaiting Cupping Test']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="tsl-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="tsl-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-lime-100 text-lime-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="tsl-costbar w-full bg-lime-100 rounded h-2"><div className="bg-lime-600 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="tsl-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#365314" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="tsl-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="tsl-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['kg', 'MT', 'crates', 'bags']
  return {
    id: `TSL-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], estate: ESTATES[idx % 8],
    status: STATUSES[idx % 6], qty: ri(50, 10000, 200 + idx * 120), unit: units[idx % 4],
    cost: ri(10000, 800000, 30000 + idx * 15000), date: `2025-01-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const handRecords = [
  { id: 'TSL-0001', product: 'Assam Orthodox Tea', estate: 'Harmutty Tea Estate Assam', status: 'In Transit Liner', qty: 5000, unit: 'kg', cost: 350000, date: '2025-01-03' },
  { id: 'TSL-0002', product: 'Darjeeling First Flush', estate: 'Makaibari Darjeeling', status: 'GI Tag Certified', qty: 800, unit: 'kg', cost: 480000, date: '2025-01-05' },
  { id: 'TSL-0003', product: 'Nilgiri Black Tea', estate: 'Nonsuch Nilgiri TN', status: 'FSSAI Tea Board', qty: 6500, unit: 'kg', cost: 195000, date: '2025-01-07' },
  { id: 'TSL-0004', product: 'Green Tea Sikkim', estate: 'Temi Garden Sikkim', status: 'Warehouse Aroma Seal', qty: 1200, unit: 'crates', cost: 216000, date: '2025-01-09' },
  { id: 'TSL-0005', product: 'Cardamom Alleppey Green', estate: 'Cardamom Board Idukki', status: 'Pending Tea Board License', qty: 600, unit: 'bags', cost: 420000, date: '2025-01-10' },
  { id: 'TSL-0006', product: 'Turmeric Lakadong', estate: 'Spice Board Kochi', status: 'Awaiting Cupping Test', qty: 3500, unit: 'kg', cost: 175000, date: '2025-01-12' },
  { id: 'TSL-0007', product: 'Black Pepper Malabar', estate: 'Pepper Growers Wayanad', status: 'In Transit Liner', qty: 4200, unit: 'kg', cost: 252000, date: '2025-01-13' },
  { id: 'TSL-0008', product: 'Cinnamon Ceylon Grown', estate: 'Cardamom Hills Karnataka', status: 'GI Tag Certified', qty: 1800, unit: 'bags', cost: 144000, date: '2025-01-15' },
  { id: 'TSL-0009', product: 'Assam Orthodox Tea', estate: 'Harmutty Tea Estate Assam', status: 'FSSAI Tea Board', qty: 7200, unit: 'kg', cost: 504000, date: '2025-01-16' },
  { id: 'TSL-0010', product: 'Darjeeling First Flush', estate: 'Makaibari Darjeeling', status: 'Warehouse Aroma Seal', qty: 950, unit: 'kg', cost: 570000, date: '2025-01-17' },
  { id: 'TSL-0011', product: 'Nilgiri Black Tea', estate: 'Nonsuch Nilgiri TN', status: 'In Transit Liner', qty: 8000, unit: 'kg', cost: 240000, date: '2025-01-18' },
  { id: 'TSL-0012', product: 'Green Tea Sikkim', estate: 'Temi Garden Sikkim', status: 'Awaiting Cupping Test', qty: 1500, unit: 'crates', cost: 270000, date: '2025-01-19' },
  { id: 'TSL-0013', product: 'Cardamom Alleppey Green', estate: 'Cardamom Board Idukki', status: 'FSSAI Tea Board', qty: 750, unit: 'bags', cost: 525000, date: '2025-01-20' },
  { id: 'TSL-0014', product: 'Turmeric Lakadong', estate: 'Spice Board Kochi', status: 'GI Tag Certified', qty: 5000, unit: 'kg', cost: 250000, date: '2025-01-21' },
  { id: 'TSL-0015', product: 'Black Pepper Malabar', estate: 'Pepper Growers Wayanad', status: 'Pending Tea Board License', qty: 6000, unit: 'kg', cost: 360000, date: '2025-01-22' },
  { id: 'TSL-0016', product: 'Cinnamon Ceylon Grown', estate: 'Cardamom Hills Karnataka', status: 'Warehouse Aroma Seal', qty: 2200, unit: 'bags', cost: 176000, date: '2025-01-23' },
  { id: 'TSL-0017', product: 'Assam Orthodox Tea', estate: 'Harmutty Tea Estate Assam', status: 'Awaiting Cupping Test', qty: 4500, unit: 'kg', cost: 315000, date: '2025-01-24' },
  { id: 'TSL-0018', product: 'Darjeeling First Flush', estate: 'Makaibari Darjeeling', status: 'In Transit Liner', qty: 650, unit: 'kg', cost: 390000, date: '2025-01-25' },
  { id: 'TSL-0019', product: 'Nilgiri Black Tea', estate: 'Nonsuch Nilgiri TN', status: 'Pending Tea Board License', qty: 9200, unit: 'kg', cost: 276000, date: '2025-01-26' },
  { id: 'TSL-0020', product: 'Green Tea Sikkim', estate: 'Temi Garden Sikkim', status: 'FSSAI Tea Board', qty: 1800, unit: 'crates', cost: 324000, date: '2025-01-27' },
]




export default function TeaSpiceSupplyChainView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...handRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.product.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string))
    })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'product', label: 'Product Type', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.product === p).length })) },
    { key: 'status', label: 'Status', options: STATUSES.map(s => ({ value: s, label: s, count: allRecords.filter(r => r.status === s).length })) },
  ]

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 18 + i * 9, cost: 200000 + i * 35000 }))
  const estateChart = ESTATES.slice(0, 6).map((e, i) => ({ name: e.split(' ').slice(0, 2).join(' '), volume: 300 + i * 120, revenue: 12 + i * 5 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 10 + i * 5 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="tsl-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Supply Chain' }, { label: 'Tea & Spice' }]} />
      <PageHeader title="Tea & Spice Supply Chain" description="Track tea estate produce and spice shipments across Indian auction houses and export corridors" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-lime-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🍵" label="Total Shipments" value={String(allRecords.length)} />
            <KpiTile icon="🌿" label="Active Estates" value={String(ESTATES.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile icon="📈" label="Avg Cost" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="tsl-health-grid">
            <CardHeader><CardTitle>Operational Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={90} label="Plucking" />
                <HealthRing value={93} label="Processing" />
                <HealthRing value={85} label="Aroma Seal" />
                <HealthRing value={97} label="FSSAI" />
                <HealthRing value={78} label="Auction" />
                <HealthRing value={88} label="Export" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Assam Orthodox" value="16,700 kg" />
            <ValueTile label="Darjeeling Flush" value="2,400 kg" />
            <ValueTile label="Pending License" value="₹5.1L" />
            <ValueTile label="GI Tagged" value="38 Lots" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filteredRecords.length} onRefresh={() => {}} placeholder="Search by ID, product, estate, or lot..." />

          <Card className="tsl-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-lime-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-left">Estate</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Cost</th>
                    <th className="p-3 text-left">Cost Bar</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.slice(0, 15).map(r => (
                    <tr key={r.id} className="border-b hover:bg-lime-50/50">
                      <td className="p-3 font-mono text-xs">{r.id}</td>
                      <td className="p-3"><ProductBadge name={r.product} /></td>
                      <td className="p-3 text-xs">{r.estate}</td>
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
              <CardHeader><CardTitle>Estate Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={250} data={estateChart}>
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
            <Card className="tsl-insight"><CardHeader><CardTitle>Tea Board India Regulation</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Tea Board of India under Ministry of Commerce mandates auction licensing, quality certification, and lab testing for all tea exports. Darjeeling tea carries exclusive GI tag limiting production to 87 registered gardens in Darjeeling district.</p></CardContent></Card>
            <Card className="tsl-insight"><CardHeader><CardTitle>Spice Board Quality Export</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Spice Board of India regulates cardamom, pepper, turmeric, and cinnamon exports through quality certification labs. India produces 75% of global spice output with 12 MT annual production valued at $3.6 billion in export earnings.</p></CardContent></Card>
            <Card className="tsl-insight"><CardHeader><CardTitle>Assam Tea Auction System</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Guwahati and Kolkata tea auctions handle 150 million kg annually. E-auction platforms replaced physical auctions, enabling real-time bidding from 200+ global buyers. Assam CTC grades dominate with 55% share of total auction volume.</p></CardContent></Card>
            <Card className="tsl-insight"><CardHeader><CardTitle>AI Tea Leaf Grading</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">AI-powered electronic nose and colour grading systems assess tea quality with 94% correlation to human cupping tests. Machine learning predicts optimal plucking schedules and fermentation timing, improving first-flush yield by 12% at Darjeeling estates.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
