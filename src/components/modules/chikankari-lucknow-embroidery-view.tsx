import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#be185d', '#db2777', '#ec4899', '#f472b6', '#f9a8d4', '#9d174d', '#831843', '#fce7f3']
const PRODUCTS = ['Chikankari Cotton Kurta', 'Shadow Work Saree', 'White-on-White Dupatta', 'Embroidered Linen Shirt', 'Zardozi Chikan Panel', 'Phanda Work Pillow Set', 'Lucknowi Anarkali Suit', 'Chikan Lace Trim Set']
const ARTISANS = ['Old City Lucknow Cluster', 'Aminabad Craft Guild', 'Chowk Embroidery Centre', 'Hazratganj Atelier', 'Aliganj Stitch House', 'Indiranagar Chikan Hub', 'Gomti Nagar Design Studio', 'Rajajipuram Artisan Colony']
const STATUSES = ['GI Chikankari Craft', 'IS 17285 Textile Grade A', 'Tissue Paper Flat Wrap', 'Palletised Truck Transit', 'Mothproof Storage Room', 'Stitch Density QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="clk-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="clk-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-pink-100 text-pink-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="clk-costbar w-full bg-pink-100 rounded h-2"><div className="bg-pink-700 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="clk-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#be185d" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="clk-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="clk-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['pcs', 'sets', 'm', 'boxes']
  return {
    id: `CLK-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], artisan: ARTISANS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(10, 300, 15 + idx * 12), unit: units[idx % 4],
    cost: ri(5000, 200000, 8000 + idx * 6000), date: `2025-07-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const chikankariRecords = [
  { id: 'CLK-0001', product: 'Chikankari Cotton Kurta', artisan: 'Old City Lucknow Cluster', status: 'GI Chikankari Craft', qty: 50, unit: 'pcs', cost: 45000, date: '2025-07-02' },
  { id: 'CLK-0002', product: 'Shadow Work Saree', artisan: 'Aminabad Craft Guild', status: 'IS 17285 Textile Grade A', qty: 20, unit: 'pcs', cost: 72000, date: '2025-07-04' },
  { id: 'CLK-0003', product: 'White-on-White Dupatta', artisan: 'Chowk Embroidery Centre', status: 'Tissue Paper Flat Wrap', qty: 80, unit: 'pcs', cost: 32000, date: '2025-07-05' },
  { id: 'CLK-0004', product: 'Embroidered Linen Shirt', artisan: 'Hazratganj Atelier', status: 'Palletised Truck Transit', qty: 35, unit: 'pcs', cost: 28000, date: '2025-07-07' },
  { id: 'CLK-0005', product: 'Zardozi Chikan Panel', artisan: 'Aliganj Stitch House', status: 'Mothproof Storage Room', qty: 15, unit: 'sets', cost: 52000, date: '2025-07-08' },
  { id: 'CLK-0006', product: 'Phanda Work Pillow Set', artisan: 'Indiranagar Chikan Hub', status: 'Stitch Density QC', qty: 40, unit: 'sets', cost: 24000, date: '2025-07-10' },
  { id: 'CLK-0007', product: 'Lucknowi Anarkali Suit', artisan: 'Gomti Nagar Design Studio', status: 'GI Chikankari Craft', qty: 25, unit: 'pcs', cost: 87500, date: '2025-07-11' },
  { id: 'CLK-0008', product: 'Chikan Lace Trim Set', artisan: 'Rajajipuram Artisan Colony', status: 'IS 17285 Textile Grade A', qty: 60, unit: 'm', cost: 18000, date: '2025-07-13' },
  { id: 'CLK-0009', product: 'Chikankari Cotton Kurta', artisan: 'Old City Lucknow Cluster', status: 'Tissue Paper Flat Wrap', qty: 45, unit: 'pcs', cost: 40500, date: '2025-07-14' },
  { id: 'CLK-0010', product: 'Shadow Work Saree', artisan: 'Aminabad Craft Guild', status: 'Palletised Truck Transit', qty: 18, unit: 'pcs', cost: 64800, date: '2025-07-15' },
  { id: 'CLK-0011', product: 'White-on-White Dupatta', artisan: 'Chowk Embroidery Centre', status: 'Mothproof Storage Room', qty: 70, unit: 'pcs', cost: 28000, date: '2025-07-16' },
  { id: 'CLK-0012', product: 'Embroidered Linen Shirt', artisan: 'Hazratganj Atelier', status: 'Stitch Density QC', qty: 30, unit: 'pcs', cost: 24000, date: '2025-07-17' },
  { id: 'CLK-0013', product: 'Zardozi Chikan Panel', artisan: 'Aliganj Stitch House', status: 'GI Chikankari Craft', qty: 12, unit: 'sets', cost: 41600, date: '2025-07-18' },
  { id: 'CLK-0014', product: 'Phanda Work Pillow Set', artisan: 'Indiranagar Chikan Hub', status: 'IS 17285 Textile Grade A', qty: 36, unit: 'sets', cost: 21600, date: '2025-07-19' },
  { id: 'CLK-0015', product: 'Lucknowi Anarkali Suit', artisan: 'Gomti Nagar Design Studio', status: 'Tissue Paper Flat Wrap', qty: 22, unit: 'pcs', cost: 77000, date: '2025-07-20' },
  { id: 'CLK-0016', product: 'Chikan Lace Trim Set', artisan: 'Rajajipuram Artisan Colony', status: 'Palletised Truck Transit', qty: 55, unit: 'm', cost: 16500, date: '2025-07-21' },
  { id: 'CLK-0017', product: 'Chikankari Cotton Kurta', artisan: 'Old City Lucknow Cluster', status: 'Mothproof Storage Room', qty: 42, unit: 'pcs', cost: 37800, date: '2025-07-22' },
  { id: 'CLK-0018', product: 'Shadow Work Saree', artisan: 'Aminabad Craft Guild', status: 'Stitch Density QC', qty: 16, unit: 'pcs', cost: 57600, date: '2025-07-23' },
  { id: 'CLK-0019', product: 'White-on-White Dupatta', artisan: 'Chowk Embroidery Centre', status: 'GI Chikankari Craft', qty: 65, unit: 'pcs', cost: 26000, date: '2025-07-24' },
  { id: 'CLK-0020', product: 'Embroidered Linen Shirt', artisan: 'Hazratganj Atelier', status: 'IS 17285 Textile Grade A', qty: 28, unit: 'pcs', cost: 22400, date: '2025-07-25' },
]

export default function ChikankariLucknowEmbroideryView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...chikankariRecords, ...genRecords(21), ...genRecords(41)]

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

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 20 + i * 6, cost: 12000 + i * 8000 }))
  const artisanChart = ARTISANS.slice(0, 6).map((a, i) => ({ name: a.split(' ').slice(0, 2).join(' '), volume: 60 + i * 30, revenue: 4 + i * 3 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 8 + i * 3 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="clk-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Chikankari Lucknow Embroidery' }]} />
      <PageHeader title="Chikankari Lucknow Embroidery Logistics" description="Track Lucknow's world-famous chikankari embroidery from artisan workshops through shadow-work stitching, cutwork finishing, and quality certification to domestic fashion and international luxury apparel markets" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-pink-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🪡" label="Total Batches" value={String(allRecords.length)} />
            <KpiTile icon="🏭" label="Artisan Clusters" value={String(ARTISANS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile icon="📈" label="Avg Batch" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="clk-health-grid">
            <CardHeader><CardTitle>Quality Compliance</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={94} label="GI Tag" />
                <HealthRing value={90} label="IS 17285" />
                <HealthRing value={86} label="Tissue" />
                <HealthRing value={82} label="Transit" />
                <HealthRing value={91} label="Mothproof" />
                <HealthRing value={88} label="Stitch QC" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="2.5 Lakh" />
            <ValueTile label="Annual Production" value="50 Lakh pcs" />
            <ValueTile label="Export Markets" value="28 Countries" />
            <ValueTile label="Stitch Types" value="32 Styles" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearSearch={() => setSearchQuery('')}
            activeFilters={activeFilters}
            filterGroups={filterGroups}
            onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))}
            onClearAllFilters={() => setActiveFilters({})}
            totalItems={allRecords.length}
            filteredCount={filteredRecords.length}
            onRefresh={() => {}}
            placeholder="Search by batch ID, product, or artisan..."
          />

          <Card className="clk-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-pink-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-left">Artisan</th>
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
                      <td className="p-3 text-xs">{r.artisan}</td>
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
              <CardHeader><CardTitle>Artisan Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={250} data={artisanChart}>
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
            <Card className="clk-insight"><CardHeader><CardTitle>Lucknow — The City of Nawabi Chikankari</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Lucknow's chikankari embroidery tradition dates to the Mughal era (17th century) when Nur Jehan, wife of Emperor Jahangir, patronised this delicate white-on-white shadow-work technique. The craft employs 2.5 lakh artisan families across Lucknow's Old City, Aminabad, Chowk, and Hazratganj clusters, making it one of India's largest embroidery-based livelihood sectors. GI-tagged Lucknow Chikankari was registered in 2008, protecting 32 distinct stitch types including murri (grain shape), phanda (dot), tepchi (running), and jali (flat cutwork). Annual production exceeds 50 lakh pieces valued at Rs 1,500 crore with exports to 28 countries including UAE, UK, USA, and Japan. The art form was inscribed on UNESCO's Intangible Cultural Heritage list in 2021.</p></CardContent></Card>
            <Card className="clk-insight"><CardHeader><CardTitle>IS 17285 Textile &amp; Stitch Quality Standards</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">IS 17285 covers embroidery textile quality including stitch density (minimum 120 stitches per square inch for Grade A chikankari), thread tensile strength (minimum 0.8 N/tex for cotton embroidery thread), and colour fastness (minimum Grade 4 on ISO 105-C06 wash fastness scale). Shadow work requires reverse-side stitch length between 2-4mm with maximum 0.5mm deviation. Jali (cutwork) must have clean edges with thread count below 40 threads per inch. Fabric base must be 100% cotton or linen with thread count 60-80 for kurta-grade and 100-120 for saree-grade. Ironing temperature must not exceed 180 degrees Celsius to prevent fabric scorching. BIS certification required for exported textile products with mandatory testing every 12 months.</p></CardContent></Card>
            <Card className="clk-insight"><CardHeader><CardTitle>Fragile Fabric Packaging &amp; Transit Care</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Chikankari embroidery on fine cotton and linen requires tissue paper flat wrapping to prevent stitch distortion, followed by polyethylene moisture barrier and corrugated carton with 5-ply construction. Maximum stack height is 8 cartons (5 kg each). From Lucknow to Delhi (550 km) takes 10-12 hours via NH45 in air-conditioned transport maintaining 20-25 degrees Celsius. Storage humidity must stay between 45-55% to prevent fungal growth on cotton threads. White-on-white embroidery is particularly susceptible to yellowing — UV-protective packaging and dark storage extends display life to 3+ years. Breakage rate reduced from 8% to 1.2% under UP Chikan Cluster Development Programme since 2019, covering 15,000 artisans across Lucknow district.</p></CardContent></Card>
            <Card className="clk-insight"><CardHeader><CardTitle>AI Pattern Design &amp; Global Fashion Growth</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">AI-powered CAD tools generate chikankari pattern stencils in 30 minutes versus 8 hours for hand-drawn designs, preserving traditional motifs while enabling rapid prototyping for fashion brands. Machine learning classifies stitch quality from high-resolution fabric scans at 96% accuracy, detecting irregular murri and phanda that human inspectors miss 12% of the time. India's chikankari export grew 190% from Rs 85 crore (2019) to Rs 247 crore (2025), targeting Rs 500 crore by 2028. International luxury brands (Dior, Hermes) source Lucknow chikankari panels for haute couture collections. Blockchain provenance from artisan workshop to retail shelf combats machine-embroidered fakes estimated at Rs 300 crore annually. E-commerce platforms account for 40% of new orders.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
