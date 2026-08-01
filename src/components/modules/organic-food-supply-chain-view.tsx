import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#9a3412', '#c2410c', '#ea580c', '#f97316', '#fb923c', '#7c2d12', '#431407', '#fff7ed']
const PRODUCTS = ['Organic Basmati Rice', 'Organic Turmeric Powder', 'Organic Cold Press Oil', 'Organic Jaggery Blocks', 'Organic Honey Multiflora', 'Organic Pulses Toor Dal', 'Organic A2 Cow Ghee', 'Organic Green Tea']
const FARMS = ['Sikkim Organic Farm Co-op', 'Madhya Pradesh ORGANIC', 'Kerala Spice Organic Wayanad', 'Rajasthan Desert Organic', 'Uttarakhand Hill Organic', 'Karnataka Zero Budget Farm', 'Tamil Nadu Organic Co-op', 'Mizoram Certified Organic']
const STATUSES = ['NPOP Certified', 'India Organic Jaivik', 'In Transit Reefer', 'Cold Store', 'Pending FSSAI', 'Awaiting PGS Verify']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="ofc-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="ofc-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="ofc-costbar w-full bg-orange-100 rounded h-2"><div className="bg-orange-600 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="ofc-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#9a3412" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="ofc-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="ofc-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['kg', 'litres', 'tons', 'boxes']
  return {
    id: `OFC-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], farm: FARMS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(100, 10000, 300 + idx * 260), unit: units[idx % 4],
    cost: ri(15000, 450000, 25000 + idx * 11000), date: `2025-04-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const organicRecords = [
  { id: 'OFC-0001', product: 'Organic Basmati Rice', farm: 'Madhya Pradesh ORGANIC', status: 'NPOP Certified', qty: 5000, unit: 'kg', cost: 375000, date: '2025-04-04' },
  { id: 'OFC-0002', product: 'Organic Turmeric Powder', farm: 'Kerala Spice Organic Wayanad', status: 'India Organic Jaivik', qty: 2000, unit: 'kg', cost: 160000, date: '2025-04-06' },
  { id: 'OFC-0003', product: 'Organic Cold Press Oil', farm: 'Rajasthan Desert Organic', status: 'In Transit Reefer', qty: 1500, unit: 'litres', cost: 270000, date: '2025-04-08' },
  { id: 'OFC-0004', product: 'Organic Jaggery Blocks', farm: 'Karnataka Zero Budget Farm', status: 'Cold Store', qty: 4000, unit: 'kg', cost: 120000, date: '2025-04-10' },
  { id: 'OFC-0005', product: 'Organic Honey Multiflora', farm: 'Uttarakhand Hill Organic', status: 'Pending FSSAI', qty: 800, unit: 'litres', cost: 320000, date: '2025-04-11' },
  { id: 'OFC-0006', product: 'Organic Pulses Toor Dal', farm: 'Tamil Nadu Organic Co-op', status: 'Awaiting PGS Verify', qty: 6000, unit: 'kg', cost: 360000, date: '2025-04-13' },
  { id: 'OFC-0007', product: 'Organic A2 Cow Ghee', farm: 'Rajasthan Desert Organic', status: 'NPOP Certified', qty: 500, unit: 'litres', cost: 400000, date: '2025-04-14' },
  { id: 'OFC-0008', product: 'Organic Green Tea', farm: 'Sikkim Organic Farm Co-op', status: 'India Organic Jaivik', qty: 1200, unit: 'kg', cost: 240000, date: '2025-04-16' },
  { id: 'OFC-0009', product: 'Organic Basmati Rice', farm: 'Madhya Pradesh ORGANIC', status: 'In Transit Reefer', qty: 4500, unit: 'kg', cost: 337500, date: '2025-04-17' },
  { id: 'OFC-0010', product: 'Organic Turmeric Powder', farm: 'Kerala Spice Organic Wayanad', status: 'Cold Store', qty: 1800, unit: 'kg', cost: 144000, date: '2025-04-18' },
  { id: 'OFC-0011', product: 'Organic Cold Press Oil', farm: 'Rajasthan Desert Organic', status: 'NPOP Certified', qty: 1300, unit: 'litres', cost: 234000, date: '2025-04-19' },
  { id: 'OFC-0012', product: 'Organic Jaggery Blocks', farm: 'Karnataka Zero Budget Farm', status: 'Awaiting PGS Verify', qty: 3500, unit: 'kg', cost: 105000, date: '2025-04-20' },
  { id: 'OFC-0013', product: 'Organic Honey Multiflora', farm: 'Uttarakhand Hill Organic', status: 'India Organic Jaivik', qty: 700, unit: 'litres', cost: 280000, date: '2025-04-21' },
  { id: 'OFC-0014', product: 'Organic Pulses Toor Dal', farm: 'Tamil Nadu Organic Co-op', status: 'In Transit Reefer', qty: 5500, unit: 'kg', cost: 330000, date: '2025-04-22' },
  { id: 'OFC-0015', product: 'Organic A2 Cow Ghee', farm: 'Rajasthan Desert Organic', status: 'Pending FSSAI', qty: 450, unit: 'litres', cost: 360000, date: '2025-04-23' },
  { id: 'OFC-0016', product: 'Organic Green Tea', farm: 'Sikkim Organic Farm Co-op', status: 'Cold Store', qty: 1100, unit: 'kg', cost: 220000, date: '2025-04-24' },
  { id: 'OFC-0017', product: 'Organic Basmati Rice', farm: 'Madhya Pradesh ORGANIC', status: 'Awaiting PGS Verify', qty: 4000, unit: 'kg', cost: 300000, date: '2025-04-25' },
  { id: 'OFC-0018', product: 'Organic Turmeric Powder', farm: 'Kerala Spice Organic Wayanad', status: 'NPOP Certified', qty: 2200, unit: 'kg', cost: 176000, date: '2025-04-26' },
  { id: 'OFC-0019', product: 'Organic Cold Press Oil', farm: 'Rajasthan Desert Organic', status: 'India Organic Jaivik', qty: 1600, unit: 'litres', cost: 288000, date: '2025-04-27' },
  { id: 'OFC-0020', product: 'Organic Jaggery Blocks', farm: 'Karnataka Zero Budget Farm', status: 'In Transit Reefer', qty: 3800, unit: 'kg', cost: 114000, date: '2025-04-28' },
]




export default function OrganicFoodSupplyChainView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...organicRecords, ...genRecords(21), ...genRecords(41)]

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

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 18 + i * 10, cost: 120000 + i * 35000 }))
  const farmChart = FARMS.slice(0, 6).map((f, i) => ({ name: f.split(' ').slice(0, 2).join(' '), volume: 100 + i * 80, revenue: 5 + i * 3 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 10 + i * 5 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="ofc-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Organic Food' }]} />
      <PageHeader title="Organic Food Supply Chain" description="Track India organic certified food products from certified farms to retail and export markets" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-orange-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🥕" label="Total Shipments" value={String(allRecords.length)} />
            <KpiTile icon="🌾" label="Certified Farms" value={String(FARMS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile icon="📈" label="Avg Cost" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="ofc-health-grid">
            <CardHeader><CardTitle>Operational Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={85} label="NPOP Cert" />
                <HealthRing value={79} label="PGS Verify" />
                <HealthRing value={73} label="Cold Chain" />
                <HealthRing value={90} label="FSSAI" />
                <HealthRing value={82} label="Export" />
                <HealthRing value={76} label="Farm Trace" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Basmati Rice" value="18,000 kg" />
            <ValueTile label="In Reefer Transit" value="32 Lots" />
            <ValueTile label="Pending FSSAI" value="₹4.2L" />
            <ValueTile label="PGS Verified" value="48 Lots" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filteredRecords.length} onRefresh={() => {}} placeholder="Search by ID, product, farm, or lot..." />

          <Card className="ofc-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-orange-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-left">Farm</th>
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
                      <td className="p-3 text-xs">{r.farm}</td>
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
              <CardHeader><CardTitle>Farm Production Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={250} data={farmChart}>
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
            <Card className="ofc-insight"><CardHeader><CardTitle>NPOP India Organic Certification</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">National Programme for Organic Production (NPOP) under APEDA certifies organic products for export. India has 2.6 million hectares under organic cultivation with 4.4 million farmers. Sikkim became the world's first fully organic state with 76,000 hectares NPOP certified.</p></CardContent></Card>
            <Card className="ofc-insight"><CardHeader><CardTitle>PGS-India Participatory Guarantee</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Participatory Guarantee System India enables farmer-to-consumer organic verification without third-party certification costs. PGS-India covers 600+ district councils with 30 lakh registered farmers, ideal for domestic organic markets and direct farm-to-fork supply chains.</p></CardContent></Card>
            <Card className="ofc-insight"><CardHeader><CardTitle>Organic Basmati Export Premium</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">India exports 80% of global basmati rice with organic basmati commanding 40-60% premium over conventional. APEDA facilitated $5.1 billion in organic exports in 2024 with major markets in EU, USA, and Middle East requiring EU Organic equivalency under NPOP bilateral agreements.</p></CardContent></Card>
            <Card className="ofc-insight"><CardHeader><CardTitle>Cold Chain Infrastructure Gap</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">India loses 30-40% of organic produce due to inadequate cold chain. Only 37% of required refrigerated storage capacity exists for perishable organics. Govt ₹15,000 crore cold chain scheme under MoFPI targets 100 integrated cold chain projects by 2027 with solar-powered cold storage for rural organic clusters.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
