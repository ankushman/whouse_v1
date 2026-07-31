import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#365314', '#3f6212', '#4d7c0f', '#65a30d', '#a3e635', '#1a2e05', '#052e16', '#f7fee7']
const PRODUCTS = ['Kantha Queen Size Bedspread', 'Nakshi Kantha Wall Hanging', 'Kantha Silk Saree', 'Kantha Embroidered Shawl', 'Kantha Cushion Cover Set', 'Kantha Stole Dupatta', 'Kantha Quilted Jacket', 'Nakshi Pitha Kantha Panel']
const ARTISANS = ['Bolpur Santiniketan Cluster', 'Shantiniketan Rural Art', 'Bishnupur Kantha Centre', 'Krishnanagar Embroidery Guild', 'Nadia Handicraft Society', 'Murshidabad Kantha Unit', 'Bardhaman Stitch Collective', 'Howrah Rural Women Artisans']
const STATUSES = ['GI Kantha Embroidery Mark', 'IS 16789 Textile Grade A', 'Cotton Muslin Wrap', 'Flatbed Truck Transit', 'Moisture-Free Storage 20-25C', 'Stitch Count QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="keb-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="keb-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-lime-100 text-lime-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="keb-costbar w-full bg-lime-100 rounded h-2"><div className="bg-lime-700 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="keb-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#365314" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="keb-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="keb-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['pcs', 'sets', 'm', 'boxes']
  return {
    id: `KEB-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], artisan: ARTISANS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(10, 300, 15 + idx * 12), unit: units[idx % 4],
    cost: ri(5000, 200000, 8000 + idx * 6000), date: `2025-07-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const kanthaRecords = [
  { id: 'KEB-0001', product: 'Kantha Queen Size Bedspread', artisan: 'Bolpur Santiniketan Cluster', status: 'GI Kantha Embroidery Mark', qty: 30, unit: 'pcs', cost: 45000, date: '2025-07-02' },
  { id: 'KEB-0002', product: 'Nakshi Kantha Wall Hanging', artisan: 'Shantiniketan Rural Art', status: 'IS 16789 Textile Grade A', qty: 18, unit: 'pcs', cost: 72000, date: '2025-07-04' },
  { id: 'KEB-0003', product: 'Kantha Silk Saree', artisan: 'Bishnupur Kantha Centre', status: 'Cotton Muslin Wrap', qty: 45, unit: 'pcs', cost: 67500, date: '2025-07-05' },
  { id: 'KEB-0004', product: 'Kantha Embroidered Shawl', artisan: 'Krishnanagar Embroidery Guild', status: 'Flatbed Truck Transit', qty: 60, unit: 'pcs', cost: 24000, date: '2025-07-07' },
  { id: 'KEB-0005', product: 'Kantha Cushion Cover Set', artisan: 'Nadia Handicraft Society', status: 'Moisture-Free Storage 20-25C', qty: 100, unit: 'sets', cost: 18000, date: '2025-07-08' },
  { id: 'KEB-0006', product: 'Kantha Stole Dupatta', artisan: 'Murshidabad Kantha Unit', status: 'Stitch Count QC', qty: 75, unit: 'pcs', cost: 30000, date: '2025-07-10' },
  { id: 'KEB-0007', product: 'Kantha Quilted Jacket', artisan: 'Bardhaman Stitch Collective', status: 'GI Kantha Embroidery Mark', qty: 25, unit: 'pcs', cost: 87500, date: '2025-07-11' },
  { id: 'KEB-0008', product: 'Nakshi Pitha Kantha Panel', artisan: 'Howrah Rural Women Artisans', status: 'IS 16789 Textile Grade A', qty: 12, unit: 'pcs', cost: 36000, date: '2025-07-13' },
  { id: 'KEB-0009', product: 'Kantha Queen Size Bedspread', artisan: 'Bolpur Santiniketan Cluster', status: 'Cotton Muslin Wrap', qty: 28, unit: 'pcs', cost: 42000, date: '2025-07-14' },
  { id: 'KEB-0010', product: 'Nakshi Kantha Wall Hanging', artisan: 'Shantiniketan Rural Art', status: 'Flatbed Truck Transit', qty: 15, unit: 'pcs', cost: 60000, date: '2025-07-15' },
  { id: 'KEB-0011', product: 'Kantha Silk Saree', artisan: 'Bishnupur Kantha Centre', status: 'Moisture-Free Storage 20-25C', qty: 40, unit: 'pcs', cost: 60000, date: '2025-07-16' },
  { id: 'KEB-0012', product: 'Kantha Embroidered Shawl', artisan: 'Krishnanagar Embroidery Guild', status: 'Stitch Count QC', qty: 55, unit: 'pcs', cost: 22000, date: '2025-07-17' },
  { id: 'KEB-0013', product: 'Kantha Cushion Cover Set', artisan: 'Nadia Handicraft Society', status: 'GI Kantha Embroidery Mark', qty: 90, unit: 'sets', cost: 16200, date: '2025-07-18' },
  { id: 'KEB-0014', product: 'Kantha Stole Dupatta', artisan: 'Murshidabad Kantha Unit', status: 'IS 16789 Textile Grade A', qty: 70, unit: 'pcs', cost: 28000, date: '2025-07-19' },
  { id: 'KEB-0015', product: 'Kantha Quilted Jacket', artisan: 'Bardhaman Stitch Collective', status: 'Cotton Muslin Wrap', qty: 22, unit: 'pcs', cost: 77000, date: '2025-07-20' },
  { id: 'KEB-0016', product: 'Nakshi Pitha Kantha Panel', artisan: 'Howrah Rural Women Artisans', status: 'Flatbed Truck Transit', qty: 10, unit: 'pcs', cost: 30000, date: '2025-07-21' },
  { id: 'KEB-0017', product: 'Kantha Queen Size Bedspread', artisan: 'Bolpur Santiniketan Cluster', status: 'Moisture-Free Storage 20-25C', qty: 35, unit: 'pcs', cost: 52500, date: '2025-07-22' },
  { id: 'KEB-0018', product: 'Nakshi Kantha Wall Hanging', artisan: 'Shantiniketan Rural Art', status: 'Stitch Count QC', qty: 16, unit: 'pcs', cost: 57600, date: '2025-07-23' },
  { id: 'KEB-0019', product: 'Kantha Silk Saree', artisan: 'Bishnupur Kantha Centre', status: 'GI Kantha Embroidery Mark', qty: 38, unit: 'pcs', cost: 57000, date: '2025-07-24' },
  { id: 'KEB-0020', product: 'Kantha Embroidered Shawl', artisan: 'Krishnanagar Embroidery Guild', status: 'IS 16789 Textile Grade A', qty: 50, unit: 'pcs', cost: 20000, date: '2025-07-25' },
]

export default function KanthaEmbroideryBengalLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...kanthaRecords, ...genRecords(21), ...genRecords(41)]

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

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 18 + i * 5, cost: 15000 + i * 7000 }))
  const artisanChart = ARTISANS.slice(0, 6).map((a, i) => ({ name: a.split(' ').slice(0, 2).join(' '), volume: 50 + i * 25, revenue: 3 + i * 4 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 7 + i * 4 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="keb-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Kantha Embroidery Bengal' }]} />
      <PageHeader title="Kantha Embroidery Bengal Logistics" description="Track West Bengal's ancient kantha embroidery craft logistics — from Santiniketan's artisan clusters through running-stitch quilting, nakshi kantha panel work, and GI-certified textile quality to domestic heritage markets and global export destinations" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-lime-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🧵" label="Total Batches" value={String(allRecords.length)} />
            <KpiTile icon="🏡" label="Artisan Clusters" value={String(ARTISANS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile icon="📈" label="Avg Batch" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="keb-health-grid">
            <CardHeader><CardTitle>Quality Compliance</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={92} label="GI Tag" />
                <HealthRing value={87} label="IS 16789" />
                <HealthRing value={84} label="Muslin" />
                <HealthRing value={80} label="Transit" />
                <HealthRing value={89} label="Storage" />
                <HealthRing value={85} label="Stitch QC" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="1.8 Lakh" />
            <ValueTile label="Annual Production" value="35 Lakh pcs" />
            <ValueTile label="Export Markets" value="22 Countries" />
            <ValueTile label="Stitch Traditions" value="12 Styles" />
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

          <Card className="keb-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-lime-50">
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
                    <tr key={r.id} className="border-b hover:bg-lime-50/50">
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
            <Card className="keb-insight"><CardHeader><CardTitle>Kantha — Bengal's 1,000-Year Running Stitch Legacy</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Kantha embroidery is among the oldest textile art forms of the Indian subcontinent, originating in Bengal over a thousand years ago. Traditionally, rural women repurposed old cotton saris and dhotis by layering them and stitching intricate patterns with the simple running stitch (kantha in Sanskrit). The craft centres on Bolpur-Santiniketan, Bishnupur, Krishnanagar, and Nadia in West Bengal, with an estimated 1.8 lakh artisan families. In 2023, GI Kantha Embroidery was registered protecting this heritage. Nakshi kantha — the most elaborate form — features pictorial narratives of folk tales, rituals, and daily Bengali life, with a single queen-size bedspread requiring 3-6 months of handwork by 2-3 artisans.</p></CardContent></Card>
            <Card className="keb-insight"><CardHeader><CardTitle>IS 16789 Textile Embroidery Quality Standards</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">IS 16789 defines quality benchmarks for hand-embroidered textiles including kantha: minimum stitch density of 80 running stitches per square inch for Grade A certification, thread tensile strength of 0.6 N/tex for cotton embroidery floss, and colour fastness minimum Grade 4 on ISO 105-C06 wash fastness scale. Kantha running stitch length must be 3-5mm with maximum 1mm deviation. Fabric layers for quilting must use minimum 3-ply cotton with GSM 120-180 for bedspreads. Thread colour must be verified against Pantone reference swatches with Delta E below 2.0. BIS mandatory testing every 18 months for certified kantha export products, with documentation maintained across all 8 West Bengal artisan clusters.</p></CardContent></Card>
            <Card className="keb-insight"><CardHeader><CardTitle>Cotton Muslin Wrapping &amp; Transport Logistics</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Kantha textiles require cotton muslin wrapping to allow fabric breathability while protecting embroidered surfaces from dust and friction during transit. Each wrapped piece is placed in acid-free tissue with silica gel sachets, then packed in corrugated cartons with 5-ply construction. From Santiniketan to Kolkata port (165 km) takes 4-6 hours via flatbed truck on NH12. Moisture-free storage at 20-25 degrees Celsius with 45-55% relative humidity prevents fungal growth on cotton layers and thread discolouration. Maximum stack height is 6 cartons (8 kg each). Breakage rate reduced from 6% to 1.5% under the West Bengal Kantha Cluster Development Programme since 2020, covering 12,000 artisans across Bolpur, Bishnupur, and Nadia districts.</p></CardContent></Card>
            <Card className="keb-insight"><CardHeader><CardTitle>AI Pattern Digitisation &amp; Global Export Growth</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">AI-powered digitisation converts traditional nakshi kantha patterns into scalable design templates in 45 minutes versus 40 hours of manual tracing, preserving Santiniketan's signature motifs — lotus scrolls, fish ponds, tree of life — while enabling rapid prototyping for international buyers. Machine learning classifies stitch quality from high-resolution fabric scans at 94% accuracy, detecting irregular running stitch density that human inspectors miss 15% of the time. India's kantha export grew 160% from Rs 62 crore (2019) to Rs 161 crore (2025), targeting Rs 350 crore by 2028. Markets include USA, UK, Germany, Japan, and Australia. Blockchain provenance tracks artisan workshops to retail shelves, combating machine-embroidered fakes estimated at Rs 180 crore annually.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
