import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#1e3a5f', '#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#172554', '#1e3a8a', '#eff6ff']
const PRODUCTS = ['Cricket Bat English Willow', 'Cricket Ball Leather SG', 'Badminton Racket Carbon', 'Football FIFA Std', 'Yoga Mat TPE Eco', 'Running Shoes Lightweight', 'Table Tennis Set Pro', 'Gym Dumbbell Rubber Coat']
const BRANDS = ['SG Jalandhar', 'SS Sunridges Jalandhar', 'Yonex Gurgaon', 'Nivia Jalandhar', 'Nike India Bangalore', 'Decathlon Hyderabad', 'Stag Sports Jalandhar', 'Cosco Delhi']
const STATUSES = ['BIS IS 14463 Certified', 'FIFA Quality Pro', 'In Transit Pallet', 'Warehouse Rack', 'Pending GST 18%', 'Awaiting QC Check']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="ssc-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="ssc-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="ssc-costbar w-full bg-blue-100 rounded h-2"><div className="bg-blue-600 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="ssc-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e3a5f" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="ssc-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="ssc-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['pcs', 'pairs', 'sets', 'dozens']
  return {
    id: `SSC-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], brand: BRANDS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(20, 3000, 100 + idx * 48), unit: units[idx % 4],
    cost: ri(8000, 500000, 20000 + idx * 9500), date: `2025-01-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const handRecords = [
  { id: 'SSC-0001', product: 'Cricket Bat English Willow', brand: 'SG Jalandhar', status: 'In Transit Pallet', qty: 500, unit: 'pcs', cost: 375000, date: '2025-01-04' },
  { id: 'SSC-0002', product: 'Cricket Ball Leather SG', brand: 'SS Sunridges Jalandhar', status: 'BIS IS 14463 Certified', qty: 1200, unit: 'dozens', cost: 240000, date: '2025-01-06' },
  { id: 'SSC-0003', product: 'Badminton Racket Carbon', brand: 'Yonex Gurgaon', status: 'Warehouse Rack', qty: 300, unit: 'pcs', cost: 180000, date: '2025-01-08' },
  { id: 'SSC-0004', product: 'Football FIFA Std', brand: 'Nivia Jalandhar', status: 'FIFA Quality Pro', qty: 800, unit: 'pcs', cost: 160000, date: '2025-01-10' },
  { id: 'SSC-0005', product: 'Yoga Mat TPE Eco', brand: 'Decathlon Hyderabad', status: 'Pending GST 18%', qty: 2000, unit: 'pcs', cost: 200000, date: '2025-01-11' },
  { id: 'SSC-0006', product: 'Running Shoes Lightweight', brand: 'Nike India Bangalore', status: 'Awaiting QC Check', qty: 400, unit: 'pairs', cost: 280000, date: '2025-01-13' },
  { id: 'SSC-0007', product: 'Table Tennis Set Pro', brand: 'Stag Sports Jalandhar', status: 'In Transit Pallet', qty: 600, unit: 'sets', cost: 90000, date: '2025-01-14' },
  { id: 'SSC-0008', product: 'Gym Dumbbell Rubber Coat', brand: 'Cosco Delhi', status: 'BIS IS 14463 Certified', qty: 1500, unit: 'pcs', cost: 225000, date: '2025-01-16' },
  { id: 'SSC-0009', product: 'Cricket Bat English Willow', brand: 'SS Sunridges Jalandhar', status: 'Warehouse Rack', qty: 750, unit: 'pcs', cost: 562500, date: '2025-01-17' },
  { id: 'SSC-0010', product: 'Cricket Ball Leather SG', brand: 'SG Jalandhar', status: 'FIFA Quality Pro', qty: 2000, unit: 'dozens', cost: 400000, date: '2025-01-18' },
  { id: 'SSC-0011', product: 'Badminton Racket Carbon', brand: 'Yonex Gurgaon', status: 'In Transit Pallet', qty: 450, unit: 'pcs', cost: 270000, date: '2025-01-19' },
  { id: 'SSC-0012', product: 'Football FIFA Std', brand: 'Nivia Jalandhar', status: 'Pending GST 18%', qty: 1200, unit: 'pcs', cost: 240000, date: '2025-01-20' },
  { id: 'SSC-0013', product: 'Yoga Mat TPE Eco', brand: 'Decathlon Hyderabad', status: 'BIS IS 14463 Certified', qty: 3500, unit: 'pcs', cost: 350000, date: '2025-01-21' },
  { id: 'SSC-0014', product: 'Running Shoes Lightweight', brand: 'Nike India Bangalore', status: 'Awaiting QC Check', qty: 600, unit: 'pairs', cost: 420000, date: '2025-01-22' },
  { id: 'SSC-0015', product: 'Table Tennis Set Pro', brand: 'Stag Sports Jalandhar', status: 'Warehouse Rack', qty: 900, unit: 'sets', cost: 135000, date: '2025-01-23' },
  { id: 'SSC-0016', product: 'Gym Dumbbell Rubber Coat', brand: 'Cosco Delhi', status: 'In Transit Pallet', qty: 2200, unit: 'pcs', cost: 330000, date: '2025-01-24' },
  { id: 'SSC-0017', product: 'Cricket Bat English Willow', brand: 'SG Jalandhar', status: 'FIFA Quality Pro', qty: 550, unit: 'pcs', cost: 412500, date: '2025-01-25' },
  { id: 'SSC-0018', product: 'Cricket Ball Leather SG', brand: 'SS Sunridges Jalandhar', status: 'BIS IS 14463 Certified', qty: 1800, unit: 'dozens', cost: 360000, date: '2025-01-26' },
  { id: 'SSC-0019', product: 'Badminton Racket Carbon', brand: 'Yonex Gurgaon', status: 'Pending GST 18%', qty: 350, unit: 'pcs', cost: 210000, date: '2025-01-27' },
  { id: 'SSC-0020', product: 'Football FIFA Std', brand: 'Nivia Jalandhar', status: 'Warehouse Rack', qty: 1000, unit: 'pcs', cost: 200000, date: '2025-01-28' },
]




export default function SportsEquipmentSupplyChainView() {
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

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 15 + i * 10, cost: 150000 + i * 28000 }))
  const brandChart = BRANDS.slice(0, 6).map((b, i) => ({ name: b.split(' ').slice(0, 2).join(' '), volume: 120 + i * 80, revenue: 10 + i * 5 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 10 + i * 5 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="ssc-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Supply Chain' }, { label: 'Sports Equipment' }]} />
      <PageHeader title="Sports Equipment Supply Chain" description="Track sports goods from Indian manufacturers to retail and distribution networks" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-blue-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🏏" label="Total Shipments" value={String(allRecords.length)} />
            <KpiTile icon="🏭" label="Active Brands" value={String(BRANDS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile icon="📈" label="Avg Cost" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="ssc-health-grid">
            <CardHeader><CardTitle>Operational Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={86} label="Production" />
                <HealthRing value={92} label="Quality" />
                <HealthRing value={78} label="Logistics" />
                <HealthRing value={95} label="BIS Std" />
                <HealthRing value={73} label="Seasonal" />
                <HealthRing value={88} label="Retail" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Bats Dispatched" value="1,800 pcs" />
            <ValueTile label="Balls in Transit" value="5,000 dozens" />
            <ValueTile label="Pending GST 18%" value="₹2.4L" />
            <ValueTile label="FIFA Certified" value="15 Lots" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filteredRecords.length} onRefresh={() => {}} placeholder="Search by ID, product, brand, or lot..." />

          <Card className="ssc-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-blue-50">
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
                    <tr key={r.id} className="border-b hover:bg-blue-50/50">
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
            <Card className="ssc-insight"><CardHeader><CardTitle>BIS IS 14463 Cricket Equipment</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">BIS IS 14463 covers cricket bats specifying dimensions, moisture content, and willow grading. Jalandhar cluster produces 70% of world cricket balls. English willow imports from UK face 15% customs duty affecting premium bat pricing.</p></CardContent></Card>
            <Card className="ssc-insight"><CardHeader><CardTitle>India Sports Goods Export Hub</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">India exports $4.2 billion in sports goods annually, with Jalandhar-Meerut corridor as the manufacturing hub. Major markets include USA, UK, Australia, and GCC for cricket equipment, athletic wear, and fitness gear under Make in India initiative.</p></CardContent></Card>
            <Card className="ssc-insight"><CardHeader><CardTitle>Decathlon India Localization</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Decathlon operates 100+ stores across India with 85% local sourcing. Their Indian suppliers manufacture yoga mats, fitness accessories, and sportswear for global distribution, leveraging India cost advantage of 30-40% over China bases.</p></CardContent></Card>
            <Card className="ssc-insight"><CardHeader><CardTitle>IPL Seasonal Demand Surge</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">IPL season triggers 300% demand spike in cricket equipment during March-May. AI-powered demand sensing integrates ticket sales and social media sentiment to pre-position inventory at 5,000+ retail points across top 8 cricket-playing states.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
