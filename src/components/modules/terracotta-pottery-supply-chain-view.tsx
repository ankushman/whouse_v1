import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#92400e', '#b45309', '#d97706', '#f59e0b', '#fbbf24', '#78350f', '#451a03', '#fffbeb']
const PRODUCTS = ['Terracotta Pots 12"', 'Red Clay Planters', 'Terracotta Jewelry Set', 'Clay Water Surahi', 'Terracotta Wall Panels', 'Black Pottery Vase', 'Clay Roofing Tiles', 'Terracotta Garden Gnome']
const MANUFACTURERS = ['Khurja Potteries UP', 'Andretta Pottery HP', 'Rajasthan Blue Pottery Jaipur', 'Nongpoh Terracotta Meghalaya', 'Chennai Terracotta Works', 'Bankura Clay Craft WB', 'Molela Terracotta Rajasthan', 'Gurgaon Studio Pottery']
const STATUSES = ['GI Terracotta Certified', 'Firing Kiln QC', 'Fragile Packaging Done', 'In Transit Padded', 'Yard Shaded Storage', 'Glaze Integrity Test']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="tps-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="tps-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="tps-costbar w-full bg-amber-100 rounded h-2"><div className="bg-amber-700 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="tps-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#92400e" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="tps-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="tps-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['pieces', 'sets', 'pairs', 'boxes']
  return {
    id: `TPS-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], manufacturer: MANUFACTURERS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(50, 3000, 150 + idx * 80), unit: units[idx % 4],
    cost: ri(10000, 350000, 18000 + idx * 12000), date: `2025-06-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const terraRecords = [
  { id: 'TPS-0001', product: 'Terracotta Pots 12"', manufacturer: 'Khurja Potteries UP', status: 'GI Terracotta Certified', qty: 2000, unit: 'pieces', cost: 120000, date: '2025-06-03' },
  { id: 'TPS-0002', product: 'Red Clay Planters', manufacturer: 'Andretta Pottery HP', status: 'Firing Kiln QC', qty: 800, unit: 'pieces', cost: 96000, date: '2025-06-04' },
  { id: 'TPS-0003', product: 'Terracotta Jewelry Set', manufacturer: 'Rajasthan Blue Pottery Jaipur', status: 'Fragile Packaging Done', qty: 400, unit: 'sets', cost: 56000, date: '2025-06-06' },
  { id: 'TPS-0004', product: 'Clay Water Surahi', manufacturer: 'Nongpoh Terracotta Meghalaya', status: 'In Transit Padded', qty: 600, unit: 'pieces', cost: 42000, date: '2025-06-07' },
  { id: 'TPS-0005', product: 'Terracotta Wall Panels', manufacturer: 'Chennai Terracotta Works', status: 'Yard Shaded Storage', qty: 250, unit: 'pieces', cost: 150000, date: '2025-06-09' },
  { id: 'TPS-0006', product: 'Black Pottery Vase', manufacturer: 'Bankura Clay Craft WB', status: 'Glaze Integrity Test', qty: 350, unit: 'pieces', cost: 70000, date: '2025-06-10' },
  { id: 'TPS-0007', product: 'Clay Roofing Tiles', manufacturer: 'Molela Terracotta Rajasthan', status: 'GI Terracotta Certified', qty: 5000, unit: 'pieces', cost: 200000, date: '2025-06-12' },
  { id: 'TPS-0008', product: 'Terracotta Garden Gnome', manufacturer: 'Gurgaon Studio Pottery', status: 'Firing Kiln QC', qty: 150, unit: 'pairs', cost: 45000, date: '2025-06-13' },
  { id: 'TPS-0009', product: 'Terracotta Pots 12"', manufacturer: 'Khurja Potteries UP', status: 'Fragile Packaging Done', qty: 1800, unit: 'pieces', cost: 108000, date: '2025-06-14' },
  { id: 'TPS-0010', product: 'Red Clay Planters', manufacturer: 'Andretta Pottery HP', status: 'In Transit Padded', qty: 750, unit: 'pieces', cost: 90000, date: '2025-06-15' },
  { id: 'TPS-0011', product: 'Terracotta Jewelry Set', manufacturer: 'Rajasthan Blue Pottery Jaipur', status: 'Yard Shaded Storage', qty: 380, unit: 'sets', cost: 53200, date: '2025-06-16' },
  { id: 'TPS-0012', product: 'Clay Water Surahi', manufacturer: 'Nongpoh Terracotta Meghalaya', status: 'GI Terracotta Certified', qty: 550, unit: 'pieces', cost: 38500, date: '2025-06-17' },
  { id: 'TPS-0013', product: 'Terracotta Wall Panels', manufacturer: 'Chennai Terracotta Works', status: 'Glaze Integrity Test', qty: 230, unit: 'pieces', cost: 138000, date: '2025-06-18' },
  { id: 'TPS-0014', product: 'Black Pottery Vase', manufacturer: 'Bankura Clay Craft WB', status: 'Firing Kiln QC', qty: 320, unit: 'pieces', cost: 64000, date: '2025-06-19' },
  { id: 'TPS-0015', product: 'Clay Roofing Tiles', manufacturer: 'Molela Terracotta Rajasthan', status: 'Fragile Packaging Done', qty: 4500, unit: 'pieces', cost: 180000, date: '2025-06-20' },
  { id: 'TPS-0016', product: 'Terracotta Garden Gnome', manufacturer: 'Gurgaon Studio Pottery', status: 'In Transit Padded', qty: 140, unit: 'pairs', cost: 42000, date: '2025-06-21' },
  { id: 'TPS-0017', product: 'Terracotta Pots 12"', manufacturer: 'Khurja Potteries UP', status: 'Yard Shaded Storage', qty: 1600, unit: 'pieces', cost: 96000, date: '2025-06-22' },
  { id: 'TPS-0018', product: 'Red Clay Planters', manufacturer: 'Andretta Pottery HP', status: 'GI Terracotta Certified', qty: 700, unit: 'pieces', cost: 84000, date: '2025-06-23' },
  { id: 'TPS-0019', product: 'Terracotta Jewelry Set', manufacturer: 'Rajasthan Blue Pottery Jaipur', status: 'Glaze Integrity Test', qty: 360, unit: 'sets', cost: 50400, date: '2025-06-24' },
  { id: 'TPS-0020', product: 'Clay Water Surahi', manufacturer: 'Nongpoh Terracotta Meghalaya', status: 'Firing Kiln QC', qty: 500, unit: 'pieces', cost: 35000, date: '2025-06-25' },
]



export default function TerracottaPotterySupplyChainView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...terraRecords, ...genRecords(21), ...genRecords(41)]

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

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 10 + i * 6, cost: 50000 + i * 20000 }))
  const mfgChart = MANUFACTURERS.slice(0, 6).map((m, i) => ({ name: m.split(' ').slice(0, 2).join(' '), volume: 120 + i * 100, revenue: 6 + i * 4 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 7 + i * 4 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="tps-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Supply Chain' }, { label: 'Terracotta & Pottery' }]} />
      <PageHeader title="Terracotta & Pottery Supply Chain" description="Track terracotta pottery, clay craft, and ceramic ware shipments from Indian artisan clusters to retail and export markets" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-amber-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🏺" label="Total Shipments" value={String(allRecords.length)} />
            <KpiTile icon="🏭" label="Artisan Clusters" value={String(MANUFACTURERS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile icon="📈" label="Avg Cost" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="tps-health-grid">
            <CardHeader><CardTitle>Operational Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={85} label="GI Cert" />
                <HealthRing value={79} label="Kiln QC" />
                <HealthRing value={72} label="Packaging" />
                <HealthRing value={88} label="Glaze" />
                <HealthRing value={81} label="Shade" />
                <HealthRing value={76} label="Fragile" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Pots in Stock" value="5,400 pieces" />
            <ValueTile label="Fragile Packaged" value="18 Lots" />
            <ValueTile label="Kiln Tested" value="32 Batches" />
            <ValueTile label="Shaded Yard" value="65%" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filteredRecords.length} onRefresh={() => {}} placeholder="Search by ID, product, cluster, or lot..." />

          <Card className="tps-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-amber-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-left">Manufacturer</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Cost</th>
                    <th className="p-3 text-left">Cost Bar</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.slice(0, 15).map(r => (
                    <tr key={r.id} className="border-b hover:bg-amber-50/50">
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
            <Card className="tps-insight"><CardHeader><CardTitle>India UNESCO Terracotta Heritage</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">India's terracotta tradition spans 5,000 years from Indus Valley seals to modern artisan clusters. Bankura horse figurines of West Bengal and Manipuri clay pottery hold GI tags protecting regional designs. The Khurja pottery cluster in Uttar Pradesh produces 60% of India's terracotta tableware with over 500 operational kilns and 15,000 artisans. NIFT design intervention has boosted export appeal by 40%.</p></CardContent></Card>
            <Card className="tps-insight"><CardHeader><CardTitle>Fragile Ware Logistics Challenge</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Terracotta breakage during transit averages 8-12% for unpadded shipments versus 1.5% for air-cushioned packaging. IS 14544 mandates minimum 25mm foam wrap for hollow clay items under 5kg. Rail freight from Khurja to Mumbai ports costs ₹18 per kg with 3.2% average damage rate. Purpose-built terracotta crates with partition inserts reduce stacking crush damage by 68%.</p></CardContent></Card>
            <Card className="tps-insight"><CardHeader><CardTitle>Rajasthan Blue Pottery & Glazing</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Jaipur blue pottery uses quartz, glass powder, and multani mitti instead of clay, making it India's only non-clay ceramic art form with GI registration. Cobalt oxide glazing at 850°C kiln temperature produces signature blue patterns. The craft supports 200 artisan families with 8 months training apprenticeship. Export price premium for GI-certified blue pottery is 3x domestic rates.</p></CardContent></Card>
            <Card className="tps-insight"><CardHeader><CardTitle>AI Kiln Optimization & Green Ceramics</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">IoT-connected kilns with AI temperature profiling reduce fuel consumption by 25% and firing defects by 35%. Digital twin simulations optimize heat distribution patterns for complex terracotta shapes. Bio-ceramic research at IIT Kanpur develops rice-husk ash glazes replacing toxic lead-based glazes. Carbon-neutral pit firing using agricultural waste reduces kiln CO2 emissions by 60%.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
