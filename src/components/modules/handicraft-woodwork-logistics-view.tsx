import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#78350f', '#92400e', '#a16207', '#ca8a04', '#eab308', '#451a03', '#5c3303', '#fefce8']
const PRODUCTS = ['Rosewood Carved Elephant', 'Sandalwood Mini Temple', 'Teak Wood Panel Screen', 'Sheesham Dining Table Set', 'Ebony Inlay Chess Board', 'Mango Wood Bookshelf', 'Bamboo Cane Furniture Set', ' Walnut Wood Jewelry Box']
const MANUFACTURERS = ['Saharanpur Woodcraft UP', 'Jaipur Wood Carving Rajasthan', 'Kerala Wooden Handicraft', 'Jodhpur Furniture Cluster', 'Mysore Sandalwood KA', 'Channapatna Toys KA', 'Tamil Nadu Woodcraft TN', 'Assam Bamboo Cane']
const STATUSES = ['GI Woodcraft Certified', 'IS 13296 Moisture QC', 'Crate Packed', 'In Transit Flatbed', 'Yard Climate Store', 'Fumigation ISPM 15']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="hwl-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="hwl-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="hwl-costbar w-full bg-yellow-100 rounded h-2"><div className="bg-yellow-700 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="hwl-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#78350f" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="hwl-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="hwl-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['pieces', 'sets', 'units', 'pairs']
  return {
    id: `HWL-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], manufacturer: MANUFACTURERS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(20, 1500, 80 + idx * 55), unit: units[idx % 4],
    cost: ri(15000, 600000, 25000 + idx * 18000), date: `2025-07-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const woodRecords = [
  { id: 'HWL-0001', product: 'Rosewood Carved Elephant', manufacturer: 'Saharanpur Woodcraft UP', status: 'GI Woodcraft Certified', qty: 200, unit: 'pieces', cost: 400000, date: '2025-07-02' },
  { id: 'HWL-0002', product: 'Sandalwood Mini Temple', manufacturer: 'Jaipur Wood Carving Rajasthan', status: 'IS 13296 Moisture QC', qty: 50, unit: 'pieces', cost: 350000, date: '2025-07-04' },
  { id: 'HWL-0003', product: 'Teak Wood Panel Screen', manufacturer: 'Kerala Wooden Handicraft', status: 'Crate Packed', qty: 120, unit: 'units', cost: 288000, date: '2025-07-05' },
  { id: 'HWL-0004', product: 'Sheesham Dining Table Set', manufacturer: 'Jodhpur Furniture Cluster', status: 'In Transit Flatbed', qty: 40, unit: 'sets', cost: 480000, date: '2025-07-07' },
  { id: 'HWL-0005', product: 'Ebony Inlay Chess Board', manufacturer: 'Mysore Sandalwood KA', status: 'Yard Climate Store', qty: 150, unit: 'pieces', cost: 225000, date: '2025-07-08' },
  { id: 'HWL-0006', product: 'Mango Wood Bookshelf', manufacturer: 'Channapatna Toys KA', status: 'Fumigation ISPM 15', qty: 300, unit: 'units', cost: 90000, date: '2025-07-10' },
  { id: 'HWL-0007', product: 'Bamboo Cane Furniture Set', manufacturer: 'Tamil Nadu Woodcraft TN', status: 'GI Woodcraft Certified', qty: 80, unit: 'sets', cost: 240000, date: '2025-07-11' },
  { id: 'HWL-0008', product: ' Walnut Wood Jewelry Box', manufacturer: 'Assam Bamboo Cane', status: 'IS 13296 Moisture QC', qty: 500, unit: 'pieces', cost: 100000, date: '2025-07-13' },
  { id: 'HWL-0009', product: 'Rosewood Carved Elephant', manufacturer: 'Saharanpur Woodcraft UP', status: 'Crate Packed', qty: 180, unit: 'pieces', cost: 360000, date: '2025-07-14' },
  { id: 'HWL-0010', product: 'Sandalwood Mini Temple', manufacturer: 'Jaipur Wood Carving Rajasthan', status: 'In Transit Flatbed', qty: 45, unit: 'pieces', cost: 315000, date: '2025-07-15' },
  { id: 'HWL-0011', product: 'Teak Wood Panel Screen', manufacturer: 'Kerala Wooden Handicraft', status: 'Yard Climate Store', qty: 110, unit: 'units', cost: 264000, date: '2025-07-16' },
  { id: 'HWL-0012', product: 'Sheesham Dining Table Set', manufacturer: 'Jodhpur Furniture Cluster', status: 'Fumigation ISPM 15', qty: 35, unit: 'sets', cost: 420000, date: '2025-07-17' },
  { id: 'HWL-0013', product: 'Ebony Inlay Chess Board', manufacturer: 'Mysore Sandalwood KA', status: 'GI Woodcraft Certified', qty: 140, unit: 'pieces', cost: 210000, date: '2025-07-18' },
  { id: 'HWL-0014', product: 'Mango Wood Bookshelf', manufacturer: 'Channapatna Toys KA', status: 'IS 13296 Moisture QC', qty: 280, unit: 'units', cost: 84000, date: '2025-07-19' },
  { id: 'HWL-0015', product: 'Bamboo Cane Furniture Set', manufacturer: 'Tamil Nadu Woodcraft TN', status: 'Crate Packed', qty: 75, unit: 'sets', cost: 225000, date: '2025-07-20' },
  { id: 'HWL-0016', product: ' Walnut Wood Jewelry Box', manufacturer: 'Assam Bamboo Cane', status: 'In Transit Flatbed', qty: 460, unit: 'pieces', cost: 92000, date: '2025-07-21' },
  { id: 'HWL-0017', product: 'Rosewood Carved Elephant', manufacturer: 'Saharanpur Woodcraft UP', status: 'Yard Climate Store', qty: 160, unit: 'pieces', cost: 320000, date: '2025-07-22' },
  { id: 'HWL-0018', product: 'Sandalwood Mini Temple', manufacturer: 'Jaipur Wood Carving Rajasthan', status: 'Fumigation ISPM 15', qty: 40, unit: 'pieces', cost: 280000, date: '2025-07-23' },
  { id: 'HWL-0019', product: 'Teak Wood Panel Screen', manufacturer: 'Kerala Wooden Handicraft', status: 'GI Woodcraft Certified', qty: 100, unit: 'units', cost: 240000, date: '2025-07-24' },
  { id: 'HWL-0020', product: 'Sheesham Dining Table Set', manufacturer: 'Jodhpur Furniture Cluster', status: 'IS 13296 Moisture QC', qty: 30, unit: 'sets', cost: 360000, date: '2025-07-25' },
]



export default function HandicraftWoodworkLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...woodRecords, ...genRecords(21), ...genRecords(41)]

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

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 8 + i * 5, cost: 80000 + i * 35000 }))
  const mfgChart = MANUFACTURERS.slice(0, 6).map((m, i) => ({ name: m.split(' ').slice(0, 2).join(' '), volume: 80 + i * 70, revenue: 6 + i * 4 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 7 + i * 3 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="hwl-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Handicraft Woodwork' }]} />
      <PageHeader title="Handicraft Woodwork Logistics" description="Track carved wood handicrafts, sandalwood artifacts, bamboo furniture, and inlay woodwork from India's artisan clusters to global markets" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-yellow-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🪵" label="Total Shipments" value={String(allRecords.length)} />
            <KpiTile icon="🏭" label="Artisan Clusters" value={String(MANUFACTURERS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile icon="📈" label="Avg Cost" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="hwl-health-grid">
            <CardHeader><CardTitle>Operational Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={88} label="GI Cert" />
                <HealthRing value={82} label="Moisture" />
                <HealthRing value={76} label="Crate" />
                <HealthRing value={85} label="Flatbed" />
                <HealthRing value={80} label="Climate" />
                <HealthRing value={90} label="ISPM 15" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Saharanpur Stock" value="380 pieces" />
            <ValueTile label="Fumigated" value="18 Lots" />
            <ValueTile label="Climate Stored" value="24 Batches" />
            <ValueTile label="Export Ready" value="68%" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filteredRecords.length} onRefresh={() => {}} placeholder="Search by ID, product, cluster, or lot..." />

          <Card className="hwl-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-yellow-50">
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
            <Card className="hwl-insight"><CardHeader><CardTitle>Saharanpur Woodcraft Heritage</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Saharanpur in Uttar Pradesh is India's largest woodcraft cluster, employing 2 lakh artisans across 400+ workshops producing ₹2,500 crore of carved furniture and handicrafts annually. Sheesham (Indian rosewood) is the primary raw material sourced from sustainable farm forestry in Punjab and Haryana. GI-tagged Saharanpur wood carving features intricate floral, geometrical, and lattice jali patterns recognized under the Geographical Indications Act 1999.</p></CardContent></Card>
            <Card className="hwl-insight"><CardHeader><CardTitle>Mysore Sandalwood & Karnataka Craft</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Karnataka's sandalwood carving tradition spans 2,000 years with Mysore and Channapatna as key clusters. Channapatna lacquer-ware toys use ivory-wood (Wrightia tinctoria) with vegetable-dye lacquer finishes. Sandalwood oil extraction yields ₹8,000 per kg of oil from government-controlled trees. The Karnataka forest department manages 32 lakh sandalwood trees under strict conservation regulations with sustainable harvest quotas.</p></CardContent></Card>
            <Card className="hwl-insight"><CardHeader><CardTitle>Wood Moisture & ISPM 15 Fumigation</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">IS 13296 mandates moisture content below 12% for wooden handicrafts to prevent warping and fungal growth. ISPM 15 international phytosanitary regulations require heat treatment at 56°C for 30 minutes or methyl bromide fumigation for all wood packaging material in export shipments. India's wood handicraft exports of ₹25,000 crore face 15% EU and US customs duty. Proper kiln-drying reduces shipping weight by 20% through moisture removal.</p></CardContent></Card>
            <Card className="hwl-insight"><CardHeader><CardTitle>AI Wood Grain Analysis & CNC Integration</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Computer vision wood grain analysis classifies timber species with 97% accuracy, preventing illegal logging substitution. CNC routers complement traditional hand-carving, handling rough-shaping in 40% of production time while artisans finish fine details. AI-powered demand forecasting for Jaipur and Jodhpur furniture uses social media trend data with 72% accuracy. Blockchain provenance from raw timber to finished export ensures legal sustainability compliance.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
