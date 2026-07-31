import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#14532d', '#166534', '#15803d', '#16a34a', '#22c55e', '#052e16', '#0a3d1e', '#dcfce7']
const PRODUCTS = ['Bamboo Basket Set', 'Cane Dining Chair', 'Bamboo Handicraft Lamp', 'Rattan Garden Table', 'Bamboo Flooring Panel', 'Cane Wine Rack', 'Bamboo Toothbrush Pack', 'Rattan Sun Lounger']
const MANUFACTURERS = ['Assam Cane Cluster', 'Tripura Bamboo Mission', 'Manipur Cane Craft', 'Nagaland Bamboo Unit', 'Kerala Bamboo Society', 'Karnataka Bamboo Board', 'Mizoram Cane Works', 'Arunachal Bamboo Corp']
const STATUSES = ['IS 15984 Certified', 'BIS Bamboo Grade', 'Strap Bundled', 'Open Truck Transit', 'Rack Store Dry', 'Borer Treatment']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="bcp-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="bcp-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="bcp-costbar w-full bg-emerald-100 rounded h-2"><div className="bg-emerald-700 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="bcp-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#14532d" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="bcp-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="bcp-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['pieces', 'sets', 'units', 'pairs']
  return {
    id: `BCP-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], manufacturer: MANUFACTURERS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(30, 2000, 60 + idx * 65), unit: units[idx % 4],
    cost: ri(8000, 250000, 12000 + idx * 9500), date: `2025-07-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const bambooRecords = [
  { id: 'BCP-0001', product: 'Bamboo Basket Set', manufacturer: 'Assam Cane Cluster', status: 'IS 15984 Certified', qty: 500, unit: 'sets', cost: 45000, date: '2025-07-02' },
  { id: 'BCP-0002', product: 'Cane Dining Chair', manufacturer: 'Tripura Bamboo Mission', status: 'BIS Bamboo Grade', qty: 120, unit: 'pieces', cost: 180000, date: '2025-07-03' },
  { id: 'BCP-0003', product: 'Bamboo Handicraft Lamp', manufacturer: 'Manipur Cane Craft', status: 'Strap Bundled', qty: 300, unit: 'units', cost: 72000, date: '2025-07-05' },
  { id: 'BCP-0004', product: 'Rattan Garden Table', manufacturer: 'Nagaland Bamboo Unit', status: 'Open Truck Transit', qty: 80, unit: 'pieces', cost: 196000, date: '2025-07-06' },
  { id: 'BCP-0005', product: 'Bamboo Flooring Panel', manufacturer: 'Kerala Bamboo Society', status: 'Rack Store Dry', qty: 1000, unit: 'units', cost: 85000, date: '2025-07-08' },
  { id: 'BCP-0006', product: 'Cane Wine Rack', manufacturer: 'Karnataka Bamboo Board', status: 'Borer Treatment', qty: 200, unit: 'sets', cost: 54000, date: '2025-07-10' },
  { id: 'BCP-0007', product: 'Bamboo Toothbrush Pack', manufacturer: 'Mizoram Cane Works', status: 'IS 15984 Certified', qty: 5000, unit: 'pieces', cost: 15000, date: '2025-07-11' },
  { id: 'BCP-0008', product: 'Rattan Sun Lounger', manufacturer: 'Arunachal Bamboo Corp', status: 'BIS Bamboo Grade', qty: 60, unit: 'pieces', cost: 168000, date: '2025-07-12' },
  { id: 'BCP-0009', product: 'Bamboo Basket Set', manufacturer: 'Assam Cane Cluster', status: 'Strap Bundled', qty: 450, unit: 'sets', cost: 40500, date: '2025-07-13' },
  { id: 'BCP-0010', product: 'Cane Dining Chair', manufacturer: 'Tripura Bamboo Mission', status: 'Open Truck Transit', qty: 100, unit: 'pieces', cost: 150000, date: '2025-07-14' },
  { id: 'BCP-0011', product: 'Bamboo Handicraft Lamp', manufacturer: 'Manipur Cane Craft', status: 'Rack Store Dry', qty: 280, unit: 'units', cost: 67200, date: '2025-07-15' },
  { id: 'BCP-0012', product: 'Rattan Garden Table', manufacturer: 'Nagaland Bamboo Unit', status: 'Borer Treatment', qty: 75, unit: 'pieces', cost: 183750, date: '2025-07-16' },
  { id: 'BCP-0013', product: 'Bamboo Flooring Panel', manufacturer: 'Kerala Bamboo Society', status: 'IS 15984 Certified', qty: 900, unit: 'units', cost: 76500, date: '2025-07-17' },
  { id: 'BCP-0014', product: 'Cane Wine Rack', manufacturer: 'Karnataka Bamboo Board', status: 'BIS Bamboo Grade', qty: 180, unit: 'sets', cost: 48600, date: '2025-07-18' },
  { id: 'BCP-0015', product: 'Bamboo Toothbrush Pack', manufacturer: 'Mizoram Cane Works', status: 'Strap Bundled', qty: 4500, unit: 'pieces', cost: 13500, date: '2025-07-19' },
  { id: 'BCP-0016', product: 'Rattan Sun Lounger', manufacturer: 'Arunachal Bamboo Corp', status: 'Open Truck Transit', qty: 55, unit: 'pieces', cost: 154000, date: '2025-07-20' },
  { id: 'BCP-0017', product: 'Bamboo Basket Set', manufacturer: 'Assam Cane Cluster', status: 'Rack Store Dry', qty: 400, unit: 'sets', cost: 36000, date: '2025-07-21' },
  { id: 'BCP-0018', product: 'Cane Dining Chair', manufacturer: 'Tripura Bamboo Mission', status: 'Borer Treatment', qty: 90, unit: 'pieces', cost: 135000, date: '2025-07-22' },
  { id: 'BCP-0019', product: 'Bamboo Handicraft Lamp', manufacturer: 'Manipur Cane Craft', status: 'IS 15984 Certified', qty: 260, unit: 'units', cost: 62400, date: '2025-07-23' },
  { id: 'BCP-0020', product: 'Rattan Garden Table', manufacturer: 'Nagaland Bamboo Unit', status: 'BIS Bamboo Grade', qty: 70, unit: 'pieces', cost: 171500, date: '2025-07-24' },
]


export default function BambooCaneProductsSupplyChainView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...bambooRecords, ...genRecords(21), ...genRecords(41)]

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

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 12 + i * 6, cost: 50000 + i * 28000 }))
  const mfgChart = MANUFACTURERS.slice(0, 6).map((m, i) => ({ name: m.split(' ').slice(0, 2).join(' '), volume: 100 + i * 85, revenue: 5 + i * 3 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 8 + i * 3 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="bcp-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Bamboo & Cane' }]} />
      <PageHeader title="Bamboo & Cane Products Supply Chain" description="Monitor bamboo furniture, cane crafts, rattan products, and eco-friendly bamboo goods from Northeast India's tribal artisan clusters to domestic and export markets" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-emerald-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🎋" label="Total Shipments" value={String(allRecords.length)} />
            <KpiTile icon="🏭" label="Artisan Clusters" value={String(MANUFACTURERS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile icon="📈" label="Avg Cost" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="bcp-health-grid">
            <CardHeader><CardTitle>Operational Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={92} label="IS 15984" />
                <HealthRing value={85} label="BIS" />
                <HealthRing value={78} label="Bundling" />
                <HealthRing value={81} label="Transit" />
                <HealthRing value={87} label="Dry Store" />
                <HealthRing value={74} label="Borer" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Assam Stock" value="950 pieces" />
            <ValueTile label="Treated Lots" value="22 Batches" />
            <ValueTile label="NE Corridor" value="14 Routes" />
            <ValueTile label="Export Ready" value="72%" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filteredRecords.length} onRefresh={() => {}} placeholder="Search by ID, product, cluster, or lot..." />

          <Card className="bcp-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-emerald-50">
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
                    <tr key={r.id} className="border-b hover:bg-emerald-50/50">
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
            <Card className="bcp-insight"><CardHeader><CardTitle>Northeast India Bamboo Capital</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Northeast India holds 66% of the country's bamboo reserves with 12.8 million tonnes across Assam, Mizoram, Nagaland, Tripura, and Arunachal Pradesh. The National Bamboo Mission (NBM) has allocated ₹1,290 crore for plantation, product development, and market linkage. Assam alone produces 3.2 million tonnes annually, supporting 5 lakh bamboo artisans. The sector contributes ₹12,000 crore to the regional economy with 85% products from the unorganized sector transitioning to GI-tagged cooperatives.</p></CardContent></Card>
            <Card className="bcp-insight"><CardHeader><CardTitle>IS 15984 & BIS Bamboo Standards</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">IS 15984 specifies bamboo mat board, strip flooring, and panel standards for structural and non-structural applications. BIS has introduced grading for bamboo poles based on wall thickness, moisture content below 15%, and node spacing. The National Bamboo Mission certifies products under the Bamboo Mark scheme. Bamboo flooring must meet IS 15489 durability class 1 for termite and borer resistance. Export shipments require FSC or PEFC chain-of-custody certification for EU and US markets.</p></CardContent></Card>
            <Card className="bcp-insight"><CardHeader><CardTitle>Borer Treatment & Storage Protocols</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Bamboo products are susceptible to powder-post beetle (Dinoderus minutus) and termite attack within 6 months of harvest. Approved treatments include boric acid pressure treatment (IS 1905), hot water immersion at 80°C for 30 minutes, and solar drying to below 12% moisture. Treated bamboo furniture lasts 15-20 years versus 3-5 years untreated. Proper warehouse storage requires humidity below 60% and temperature 20-30°C. Borax-boric acid treatment costs ₹15-25 per kg of bamboo pole.</p></CardContent></Card>
            <Card className="bcp-insight"><CardHeader><CardTitle>AI Quality Inspection & Carbon Credits</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Computer vision inspection detects surface cracks, node defects, and fungal stains in bamboo poles with 94% accuracy using hyperspectral imaging. AI-powered grading machines process 200 poles per hour versus 15 manually. Bamboo sequesters 35% more CO2 than equivalent timber, earning ₹2,500-4,000 per tonne in voluntary carbon credits. India's bamboo economy is projected to reach ₹45,000 crore by 2030 with value-added products contributing 60%. Smart warehouse IoT sensors monitor moisture and borer activity in real-time.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
