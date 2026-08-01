import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#9d174d', '#be185d', '#ec4899', '#f472b6', '#f9a8d4', '#831843', '#500724', '#fdf2f8']
const PRODUCTS = ['Face Cream Moisturizer', 'Hair Oil Herbal', 'Sunscreen SPF 50+', 'Lipstick Matte', 'Shampoo Sulphate Free', 'Body Lotion Aloe', 'Kajal Waterproof', 'Perfume Eau De']
const BRANDS = ['Lakme Mumbai', 'Himalaya Wellness Bangalore', 'Biotique Noida', 'Nykaa Mumbai', 'Dabur Gurugram', 'Marico Mumbai', 'Emami Kolkata', 'Lotus Herbals Noida']
const STATUSES = ['IS 4011 Tested', 'CDSCO Licensed', 'In Transit Ambient', 'Warehouse FIFO', 'Pending BIS Mark', 'Awaiting Batch QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="cpc-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="cpc-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-pink-100 text-pink-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="cpc-costbar w-full bg-pink-100 rounded h-2"><div className="bg-pink-600 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="cpc-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#9d174d" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="cpc-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="cpc-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['units', 'bottles', 'pieces', 'cartons']
  return {
    id: `CPC-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], brand: BRANDS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(100, 10000, 500 + idx * 110), unit: units[idx % 4],
    cost: ri(15000, 600000, 25000 + idx * 8500), date: `2025-01-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const handRecords = [
  { id: 'CPC-0001', product: 'Face Cream Moisturizer', brand: 'Lakme Mumbai', status: 'In Transit Ambient', qty: 5000, unit: 'units', cost: 350000, date: '2025-01-03' },
  { id: 'CPC-0002', product: 'Hair Oil Herbal', brand: 'Dabur Gurugram', status: 'IS 4011 Tested', qty: 8000, unit: 'bottles', cost: 240000, date: '2025-01-05' },
  { id: 'CPC-0003', product: 'Sunscreen SPF 50+', brand: 'Himalaya Wellness Bangalore', status: 'Warehouse FIFO', qty: 3200, unit: 'pieces', cost: 256000, date: '2025-01-07' },
  { id: 'CPC-0004', product: 'Lipstick Matte', brand: 'Nykaa Mumbai', status: 'CDSCO Licensed', qty: 6500, unit: 'pieces', cost: 195000, date: '2025-01-09' },
  { id: 'CPC-0005', product: 'Shampoo Sulphate Free', brand: 'Biotique Noida', status: 'Pending BIS Mark', qty: 4500, unit: 'bottles', cost: 135000, date: '2025-01-10' },
  { id: 'CPC-0006', product: 'Body Lotion Aloe', brand: 'Lotus Herbals Noida', status: 'Awaiting Batch QC', qty: 7200, unit: 'bottles', cost: 216000, date: '2025-01-12' },
  { id: 'CPC-0007', product: 'Kajal Waterproof', brand: 'Lakme Mumbai', status: 'In Transit Ambient', qty: 9000, unit: 'pieces', cost: 180000, date: '2025-01-13' },
  { id: 'CPC-0008', product: 'Perfume Eau De', brand: 'Marico Mumbai', status: 'IS 4011 Tested', qty: 2500, unit: 'bottles', cost: 375000, date: '2025-01-15' },
  { id: 'CPC-0009', product: 'Face Cream Moisturizer', brand: 'Emami Kolkata', status: 'CDSCO Licensed', qty: 6000, unit: 'units', cost: 420000, date: '2025-01-16' },
  { id: 'CPC-0010', product: 'Hair Oil Herbal', brand: 'Himalaya Wellness Bangalore', status: 'Warehouse FIFO', qty: 9500, unit: 'bottles', cost: 285000, date: '2025-01-17' },
  { id: 'CPC-0011', product: 'Sunscreen SPF 50+', brand: 'Nykaa Mumbai', status: 'In Transit Ambient', qty: 4000, unit: 'pieces', cost: 320000, date: '2025-01-18' },
  { id: 'CPC-0012', product: 'Lipstick Matte', brand: 'Lakme Mumbai', status: 'Pending BIS Mark', qty: 7800, unit: 'pieces', cost: 234000, date: '2025-01-19' },
  { id: 'CPC-0013', product: 'Shampoo Sulphate Free', brand: 'Dabur Gurugram', status: 'Awaiting Batch QC', qty: 5500, unit: 'bottles', cost: 165000, date: '2025-01-20' },
  { id: 'CPC-0014', product: 'Body Lotion Aloe', brand: 'Biotique Noida', status: 'IS 4011 Tested', qty: 8200, unit: 'bottles', cost: 246000, date: '2025-01-21' },
  { id: 'CPC-0015', product: 'Kajal Waterproof', brand: 'Marico Mumbai', status: 'CDSCO Licensed', qty: 11000, unit: 'pieces', cost: 220000, date: '2025-01-22' },
  { id: 'CPC-0016', product: 'Perfume Eau De', brand: 'Emami Kolkata', status: 'Warehouse FIFO', qty: 3000, unit: 'bottles', cost: 450000, date: '2025-01-23' },
  { id: 'CPC-0017', product: 'Face Cream Moisturizer', brand: 'Himalaya Wellness Bangalore', status: 'In Transit Ambient', qty: 4800, unit: 'units', cost: 336000, date: '2025-01-24' },
  { id: 'CPC-0018', product: 'Hair Oil Herbal', brand: 'Marico Mumbai', status: 'Pending BIS Mark', qty: 7200, unit: 'bottles', cost: 216000, date: '2025-01-25' },
  { id: 'CPC-0019', product: 'Sunscreen SPF 50+', brand: 'Lotus Herbals Noida', status: 'Awaiting Batch QC', qty: 3800, unit: 'pieces', cost: 304000, date: '2025-01-26' },
  { id: 'CPC-0020', product: 'Lipstick Matte', brand: 'Nykaa Mumbai', status: 'IS 4011 Tested', qty: 6200, unit: 'pieces', cost: 186000, date: '2025-01-27' },
]




export default function CosmeticsPersonalCareLogisticsView() {
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

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 25 + i * 11, cost: 180000 + i * 32000 }))
  const brandChart = BRANDS.slice(0, 6).map((b, i) => ({ name: b.split(' ').slice(0, 2).join(' '), volume: 400 + i * 150, revenue: 15 + i * 6 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 12 + i * 5 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="cpc-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Cosmetics & Personal Care' }]} />
      <PageHeader title="Cosmetics & Personal Care Logistics" description="Track cosmetic products and personal care items across Indian supply chains" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-pink-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="💄" label="Total Shipments" value={String(allRecords.length)} />
            <KpiTile icon="🏭" label="Active Brands" value={String(BRANDS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile icon="📈" label="Avg Cost" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="cpc-health-grid">
            <CardHeader><CardTitle>Operational Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={91} label="Formulation" />
                <HealthRing value={94} label="Safety" />
                <HealthRing value={85} label="Packaging" />
                <HealthRing value={97} label="Compliance" />
                <HealthRing value={80} label="Distribution" />
                <HealthRing value={89} label="Expiry Ctrl" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Creams Shipped" value="15,800 units" />
            <ValueTile label="Hair Care Transit" value="25,200 bottles" />
            <ValueTile label="Pending BIS Mark" value="₹3.5L" />
            <ValueTile label="CDSCO Licensed" value="42 Lots" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filteredRecords.length} onRefresh={() => {}} placeholder="Search by ID, product, brand, or lot..." />

          <Card className="cpc-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-pink-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-left">Brand</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Cost</th>
                    <th className="p-3 text-left">Cost Bar</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.slice(0, 15).map(r => (
                    <tr key={r.id} className="border-b hover:bg-pink-50/50">
                      <td className="p-3 font-mono text-xs">{r.id}</td>
                      <td className="p-3"><ProductBadge name={r.product} /></td>
                      <td className="p-3 text-xs">{r.brand}</td>
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
                  <Line type="monotone" dataKey="cost" stroke={COLORS[2]} strokeWidth={2} />
                </LineChart>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Brand Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={250} data={brandChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={10} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]} />
                  <Bar dataKey="revenue" fill={COLORS[2]} />
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
            <Card className="cpc-insight"><CardHeader><CardTitle>BIS IS 4011 Cosmetics Safety</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">BIS IS 4011 sets safety standards for cosmetics including heavy metal limits, microbiological contamination thresholds, and labelling requirements. Mandatory BIS certification for cosmetics imports took effect from February 2023 under QCO order.</p></CardContent></Card>
            <Card className="cpc-insight"><CardHeader><CardTitle>CDSCO Cosmetic Regulation</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Central Drugs Standard Control Organisation regulates cosmetics under Drugs and Cosmetics Act 1940. Manufacturing licences, stability testing, and adverse event reporting are mandatory for all cosmetic manufacturers selling in Indian markets.</p></CardContent></Card>
            <Card className="cpc-insight"><CardHeader><CardTitle>India Beauty Market D2C Boom</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">India personal care market valued at $18 billion with 15% CAGR growth. D2C brands via Nykaa, Purplle, and Amazon Beauty drive 40% of online sales. Quick-commerce integration enables 10-minute delivery in Tier-1 cities.</p></CardContent></Card>
            <Card className="cpc-insight"><CardHeader><CardTitle>AI Skin Analysis personalization</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">AI-powered skin analysis tools at retail kiosks recommend personalized product combinations. Demand forecasting using ML reduces stockout by 28% for fast-moving SKUs like sunscreen, face wash, and hair serums across 1,200 retail touchpoints.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
