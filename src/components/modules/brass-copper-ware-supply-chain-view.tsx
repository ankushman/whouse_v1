import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#92400e', '#b45309', '#d97706', '#f59e0b', '#fbbf24', '#78350f', '#451a03', '#fffbeb']
const PRODUCTS = ['Brass Puja Lota 4inch', 'Copper Water Bottle 1L', 'Brass Diya Traditional', 'Copper Kadhai 3L', 'Brass Statue God Idol', 'Copper Tamra Jal Glass', 'Brass Urli Decorative', 'Copper Serving Bowl Set']
const MANUFACTURERS = ['Moradabad Brass Works', 'Jaipur Copper Crafters', 'Rajasthan Metal Artisans', 'Kerala Bell Metal Co', 'Mumbai Artisan Metals', 'Varanasi Temple Craft', 'Punjab Brass Industries', 'Tamil Nadu Copper Works']
const STATUSES = ['GI Brass Craft', 'IS 2064 Certified', 'In Transit Open Truck', 'Warehouse Dry', 'Pending IGST 18%', 'Awaiting Polishing']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="bcw-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="bcw-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="bcw-costbar w-full bg-yellow-100 rounded h-2"><div className="bg-yellow-600 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="bcw-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#92400e" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="bcw-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="bcw-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['pcs', 'sets', 'lots', 'pairs']
  return {
    id: `BCW-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], manufacturer: MANUFACTURERS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(50, 3000, 100 + idx * 75), unit: units[idx % 4],
    cost: ri(8000, 350000, 12000 + idx * 8500), date: `2025-01-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const brassRecords = [
  { id: 'BCW-0001', product: 'Brass Puja Lota 4inch', manufacturer: 'Moradabad Brass Works', status: 'GI Brass Craft', qty: 1500, unit: 'pcs', cost: 135000, date: '2025-01-04' },
  { id: 'BCW-0002', product: 'Copper Water Bottle 1L', manufacturer: 'Jaipur Copper Crafters', status: 'IS 2064 Certified', qty: 2000, unit: 'pcs', cost: 200000, date: '2025-01-06' },
  { id: 'BCW-0003', product: 'Brass Diya Traditional', manufacturer: 'Rajasthan Metal Artisans', status: 'In Transit Open Truck', qty: 5000, unit: 'pcs', cost: 100000, date: '2025-01-08' },
  { id: 'BCW-0004', product: 'Copper Kadhai 3L', manufacturer: 'Kerala Bell Metal Co', status: 'Warehouse Dry', qty: 400, unit: 'pcs', cost: 160000, date: '2025-01-10' },
  { id: 'BCW-0005', product: 'Brass Statue God Idol', manufacturer: 'Varanasi Temple Craft', status: 'Pending IGST 18%', qty: 200, unit: 'pcs', cost: 300000, date: '2025-01-11' },
  { id: 'BCW-0006', product: 'Copper Tamra Jal Glass', manufacturer: 'Mumbai Artisan Metals', status: 'Awaiting Polishing', qty: 3000, unit: 'sets', cost: 180000, date: '2025-01-13' },
  { id: 'BCW-0007', product: 'Brass Urli Decorative', manufacturer: 'Punjab Brass Industries', status: 'GI Brass Craft', qty: 300, unit: 'pcs', cost: 270000, date: '2025-01-14' },
  { id: 'BCW-0008', product: 'Copper Serving Bowl Set', manufacturer: 'Tamil Nadu Copper Works', status: 'IS 2064 Certified', qty: 800, unit: 'sets', cost: 240000, date: '2025-01-16' },
  { id: 'BCW-0009', product: 'Brass Puja Lota 4inch', manufacturer: 'Moradabad Brass Works', status: 'In Transit Open Truck', qty: 1200, unit: 'pcs', cost: 108000, date: '2025-01-17' },
  { id: 'BCW-0010', product: 'Copper Water Bottle 1L', manufacturer: 'Jaipur Copper Crafters', status: 'Warehouse Dry', qty: 1800, unit: 'pcs', cost: 180000, date: '2025-01-18' },
  { id: 'BCW-0011', product: 'Brass Diya Traditional', manufacturer: 'Rajasthan Metal Artisans', status: 'GI Brass Craft', qty: 4500, unit: 'pcs', cost: 90000, date: '2025-01-19' },
  { id: 'BCW-0012', product: 'Copper Kadhai 3L', manufacturer: 'Kerala Bell Metal Co', status: 'Awaiting Polishing', qty: 350, unit: 'pcs', cost: 140000, date: '2025-01-20' },
  { id: 'BCW-0013', product: 'Brass Statue God Idol', manufacturer: 'Varanasi Temple Craft', status: 'IS 2064 Certified', qty: 150, unit: 'pcs', cost: 225000, date: '2025-01-21' },
  { id: 'BCW-0014', product: 'Copper Tamra Jal Glass', manufacturer: 'Mumbai Artisan Metals', status: 'Pending IGST 18%', qty: 2800, unit: 'sets', cost: 168000, date: '2025-01-22' },
  { id: 'BCW-0015', product: 'Brass Urli Decorative', manufacturer: 'Punjab Brass Industries', status: 'In Transit Open Truck', qty: 250, unit: 'pcs', cost: 225000, date: '2025-01-23' },
  { id: 'BCW-0016', product: 'Copper Serving Bowl Set', manufacturer: 'Tamil Nadu Copper Works', status: 'GI Brass Craft', qty: 700, unit: 'sets', cost: 210000, date: '2025-01-24' },
  { id: 'BCW-0017', product: 'Brass Puja Lota 4inch', manufacturer: 'Moradabad Brass Works', status: 'Awaiting Polishing', qty: 1100, unit: 'pcs', cost: 99000, date: '2025-01-25' },
  { id: 'BCW-0018', product: 'Copper Water Bottle 1L', manufacturer: 'Jaipur Copper Crafters', status: 'IS 2064 Certified', qty: 1600, unit: 'pcs', cost: 160000, date: '2025-01-26' },
  { id: 'BCW-0019', product: 'Brass Diya Traditional', manufacturer: 'Rajasthan Metal Artisans', status: 'Pending IGST 18%', qty: 4000, unit: 'pcs', cost: 80000, date: '2025-01-27' },
  { id: 'BCW-0020', product: 'Copper Kadhai 3L', manufacturer: 'Kerala Bell Metal Co', status: 'Warehouse Dry', qty: 320, unit: 'pcs', cost: 128000, date: '2025-01-28' },
]




export default function BrassCopperWareSupplyChainView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...brassRecords, ...genRecords(21), ...genRecords(41)]

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

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 25 + i * 10, cost: 80000 + i * 25000 }))
  const mfgChart = MANUFACTURERS.slice(0, 6).map((m, i) => ({ name: m.split(' ').slice(0, 2).join(' '), volume: 80 + i * 50, revenue: 5 + i * 3 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 10 + i * 5 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="bcw-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Brass & Copper Ware' }]} />
      <PageHeader title="Brass & Copper Ware Supply Chain" description="Track GI-tagged brass and copper ware logistics from artisan clusters to domestic and export markets" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-yellow-50">
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

          <Card className="bcw-health-grid">
            <CardHeader><CardTitle>Operational Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={81} label="GI Craft" />
                <HealthRing value={76} label="IS 2064" />
                <HealthRing value={88} label="Polish QC" />
                <HealthRing value={72} label="Transport" />
                <HealthRing value={94} label="Export" />
                <HealthRing value={67} label="Artisan" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Brass Lota Stock" value="3,800 pcs" />
            <ValueTile label="Copper Bottles" value="5,400 pcs" />
            <ValueTile label="In Open Truck" value="24 Lots" />
            <ValueTile label="Polishing Done" value="38 Batches" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filteredRecords.length} onRefresh={() => {}} placeholder="Search by ID, product, artisan, or lot..." />

          <Card className="bcw-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-yellow-50">
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
                    <tr key={r.id} className="border-b hover:bg-yellow-50/50">
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
              <CardHeader><CardTitle>Cluster Production Volume</CardTitle></CardHeader>
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
            <Card className="bcw-insight"><CardHeader><CardTitle>Moradabad Brass Cluster</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Moradabad in Uttar Pradesh is India's brass capital with 1,500+ manufacturing units employing 200,000 artisans. The cluster produces 80% of India's brassware exports worth ₹3,000 crore annually. GI registration for Moradabad Brass protects the 400-year metalworking heritage with hand-casting techniques unique to the region.</p></CardContent></Card>
            <Card className="bcw-insight"><CardHeader><CardTitle>Copper Tamra Jal Ayurvedic Revival</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Copper water vessels (Tamra Jal) are witnessing 300% demand surge driven by Ayurvedic health awareness. IS 2064 Grade C copper purity standards ensure food safety. Copper bottle e-commerce sales crossed ₹200 crore in 2024 with Amazon and Flipkart listing 500+ SKUs from Moradabad and Jaipur artisans.</p></CardContent></Card>
            <Card className="bcw-insight"><CardHeader><CardTitle>Tarnish Prevention Logistics</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Brass and copper ware requires nitrogen-flushed packaging and silica gel desiccants to prevent oxidation tarnish during monsoon transit. Lacquer-coated finished products need anti-abrasion bubble wrap with 30% humidity-controlled warehousing. Sea freight to Gulf markets takes 18-25 days demanding specialized anti-tarnish treatment.</p></CardContent></Card>
            <Card className="bcw-insight"><CardHeader><CardTitle>Temple Export Market Growth</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Indian brass temple bells, urulis, and diyas are exported to 70+ countries with $200 million annual value. Moradabad and Varanasi supply major Hindu temples worldwide including USA, UK, Singapore, and Malaysia. GI-tagged temple crafts carry 25% export duty exemption under Focus Product Scheme.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
