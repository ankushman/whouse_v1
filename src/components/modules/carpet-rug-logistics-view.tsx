import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#7c2d12', '#9a3412', '#c2410c', '#ea580c', '#f97316', '#431407', '#6b2f10', '#fff7ed']
const PRODUCTS = ['Handknotted Silk 6x9', 'Kashmir Woollen Rug 5x8', 'Jute Braided Mat 8x10', 'Dhurrie Cotton Flatweave', 'Moroccan Tufted 4x6', 'Prayer Namaz Mat', 'Carpet Runner 2.5x12', 'Shaggy Polyester 6x6']
const MANUFACTURERS = ['Mirzapur Bhadohi UP', 'Srinagar Kashmir', 'Agra Carpet Hub', 'Jaipur Handknotted', 'Panipat Haryana', 'Eluru Andhra Pradesh', 'Gurgaon NCR Workshop', 'Nepal Border Export']
const STATUSES = ['GI Carpet Mark', 'IS 1541 Certified', 'In Transit Pallet', 'Warehouse Stacked', 'GST 12% Pending', 'Knot Density QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="crl-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="crl-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="crl-costbar w-full bg-orange-100 rounded h-2"><div className="bg-orange-700 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="crl-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#7c2d12" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="crl-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="crl-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['sqft', 'pieces', 'rolls', 'sets']
  return {
    id: `CRL-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], manufacturer: MANUFACTURERS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(50, 2000, 100 + idx * 60), unit: units[idx % 4],
    cost: ri(25000, 800000, 40000 + idx * 22000), date: `2025-07-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const carpetRecords = [
  { id: 'CRL-0001', product: 'Handknotted Silk 6x9', manufacturer: 'Mirzapur Bhadohi UP', status: 'GI Carpet Mark', qty: 200, unit: 'sqft', cost: 480000, date: '2025-07-02' },
  { id: 'CRL-0002', product: 'Kashmir Woollen Rug 5x8', manufacturer: 'Srinagar Kashmir', status: 'IS 1541 Certified', qty: 150, unit: 'pieces', cost: 375000, date: '2025-07-04' },
  { id: 'CRL-0003', product: 'Jute Braided Mat 8x10', manufacturer: 'Agra Carpet Hub', status: 'In Transit Pallet', qty: 800, unit: 'sqft', cost: 96000, date: '2025-07-05' },
  { id: 'CRL-0004', product: 'Dhurrie Cotton Flatweave', manufacturer: 'Jaipur Handknotted', status: 'Warehouse Stacked', qty: 500, unit: 'pieces', cost: 125000, date: '2025-07-07' },
  { id: 'CRL-0005', product: 'Moroccan Tufted 4x6', manufacturer: 'Panipat Haryana', status: 'GST 12% Pending', qty: 300, unit: 'pieces', cost: 90000, date: '2025-07-08' },
  { id: 'CRL-0006', product: 'Prayer Namaz Mat', manufacturer: 'Eluru Andhra Pradesh', status: 'Knot Density QC', qty: 1200, unit: 'pieces', cost: 60000, date: '2025-07-10' },
  { id: 'CRL-0007', product: 'Carpet Runner 2.5x12', manufacturer: 'Gurgaon NCR Workshop', status: 'GI Carpet Mark', qty: 100, unit: 'rolls', cost: 150000, date: '2025-07-11' },
  { id: 'CRL-0008', product: 'Shaggy Polyester 6x6', manufacturer: 'Nepal Border Export', status: 'IS 1541 Certified', qty: 250, unit: 'pieces', cost: 62500, date: '2025-07-13' },
  { id: 'CRL-0009', product: 'Handknotted Silk 6x9', manufacturer: 'Mirzapur Bhadohi UP', status: 'In Transit Pallet', qty: 180, unit: 'sqft', cost: 432000, date: '2025-07-14' },
  { id: 'CRL-0010', product: 'Kashmir Woollen Rug 5x8', manufacturer: 'Srinagar Kashmir', status: 'Warehouse Stacked', qty: 130, unit: 'pieces', cost: 325000, date: '2025-07-15' },
  { id: 'CRL-0011', product: 'Jute Braided Mat 8x10', manufacturer: 'Agra Carpet Hub', status: 'GST 12% Pending', qty: 750, unit: 'sqft', cost: 90000, date: '2025-07-16' },
  { id: 'CRL-0012', product: 'Dhurrie Cotton Flatweave', manufacturer: 'Jaipur Handknotted', status: 'Knot Density QC', qty: 480, unit: 'pieces', cost: 120000, date: '2025-07-17' },
  { id: 'CRL-0013', product: 'Moroccan Tufted 4x6', manufacturer: 'Panipat Haryana', status: 'GI Carpet Mark', qty: 280, unit: 'pieces', cost: 84000, date: '2025-07-18' },
  { id: 'CRL-0014', product: 'Prayer Namaz Mat', manufacturer: 'Eluru Andhra Pradesh', status: 'IS 1541 Certified', qty: 1100, unit: 'pieces', cost: 55000, date: '2025-07-19' },
  { id: 'CRL-0015', product: 'Carpet Runner 2.5x12', manufacturer: 'Gurgaon NCR Workshop', status: 'In Transit Pallet', qty: 90, unit: 'rolls', cost: 135000, date: '2025-07-20' },
  { id: 'CRL-0016', product: 'Shaggy Polyester 6x6', manufacturer: 'Nepal Border Export', status: 'Warehouse Stacked', qty: 230, unit: 'pieces', cost: 57500, date: '2025-07-21' },
  { id: 'CRL-0017', product: 'Handknotted Silk 6x9', manufacturer: 'Mirzapur Bhadohi UP', status: 'GST 12% Pending', qty: 160, unit: 'sqft', cost: 384000, date: '2025-07-22' },
  { id: 'CRL-0018', product: 'Kashmir Woollen Rug 5x8', manufacturer: 'Srinagar Kashmir', status: 'Knot Density QC', qty: 120, unit: 'pieces', cost: 300000, date: '2025-07-23' },
  { id: 'CRL-0019', product: 'Jute Braided Mat 8x10', manufacturer: 'Agra Carpet Hub', status: 'GI Carpet Mark', qty: 700, unit: 'sqft', cost: 84000, date: '2025-07-24' },
  { id: 'CRL-0020', product: 'Dhurrie Cotton Flatweave', manufacturer: 'Jaipur Handknotted', status: 'IS 1541 Certified', qty: 450, unit: 'pieces', cost: 112500, date: '2025-07-25' },
]



export default function CarpetRugLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...carpetRecords, ...genRecords(21), ...genRecords(41)]

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

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 8 + i * 5, cost: 60000 + i * 35000 }))
  const mfgChart = MANUFACTURERS.slice(0, 6).map((m, i) => ({ name: m.split(' ').slice(0, 2).join(' '), volume: 100 + i * 80, revenue: 7 + i * 5 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 6 + i * 3 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="crl-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Carpet & Rug' }]} />
      <PageHeader title="Carpet & Rug Logistics" description="Track handknotted silk carpets, Kashmir woollen rugs, dhurries, and tufted floor coverings from India's carpet capitals to global markets" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-orange-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🧶" label="Total Shipments" value={String(allRecords.length)} />
            <KpiTile icon="🏭" label="Manufacturing Clusters" value={String(MANUFACTURERS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile icon="📈" label="Avg Cost" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="crl-health-grid">
            <CardHeader><CardTitle>Operational Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={87} label="GI Mark" />
                <HealthRing value={80} label="IS 1541" />
                <HealthRing value={74} label="Pallet" />
                <HealthRing value={90} label="Stack" />
                <HealthRing value={85} label="GST 12%" />
                <HealthRing value={78} label="Knot QC" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Silk Carpet Stock" value="540 sqft" />
            <ValueTile label="Kashmir Rugs" value="520 pieces" />
            <ValueTile label="In Pallet Transit" value="14 Lots" />
            <ValueTile label="Export Certified" value="32 Batches" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filteredRecords.length} onRefresh={() => {}} placeholder="Search by ID, product, manufacturer, or lot..." />

          <Card className="crl-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-orange-50">
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
                    <tr key={r.id} className="border-b hover:bg-orange-50/50">
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
            <Card className="crl-insight"><CardHeader><CardTitle>Bhadohi-Mirzapur Carpet Capital</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Bhadohi in Uttar Pradesh is the world's largest carpet manufacturing cluster, producing 90% of India's carpets across 500+ units employing 2.5 lakh artisans. The cluster exports ₹5,200 crore worth of handknotted and tufted carpets annually to USA (35%), Germany (15%), and UK (10%). A single 9x12-foot handknotted silk carpet takes 4-6 months with 400-1,000 knots per square inch, commanding ₹5-20 lakh per piece.</p></CardContent></Card>
            <Card className="crl-insight"><CardHeader><CardTitle>Kashmir Silk Carpet Tradition</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Kashmir silk carpets are renowned for Persian-inspired designs with 2,000-4,000 knots per square inch using pure mulberry silk on cotton warp. A single 6x9-foot carpet employs 3-4 weavers for 12-18 months. The ₹800 crore Kashmir carpet industry supports 40,000 artisan families. GI registration since 2008 protects against counterfeit imports. Walnut-tree dye extraction produces signature red and navy colourfast pigments.</p></CardContent></Card>
            <Card className="crl-insight"><CardHeader><CardTitle>Carpet Storage & Moth Prevention</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">IS 1541 classifies carpets into handknotted, handtufted, and flatweave categories with specific storage norms. Wool carpets require naphthalene or cedar-chip moth repellent sachets every 2 sqm. Warehouse stacking limited to 8-roll height with carpet-core PVC tubes preventing crush damage. Silk carpets stored in nitrogen-flushed containers prevent oxidation yellowing. Transit packaging requires multi-wall corrugated boxes with 200 GSM inner lining.</p></CardContent></Card>
            <Card className="crl-insight"><CardHeader><CardTitle>AI Knot Count & Design Verification</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Digital knot-counting cameras achieve 99.2% accuracy by analyzing carpet back patterns at 200x magnification. AI design-matching algorithms compare finished carpet patterns against CAD templates with pixel-level precision. Blockchain-based provenance tracking from Bhadohi looms to US retail floors ensures authenticity. Predictive demand analytics using seasonal colour-trend data from Instagram and Pinterest optimize production planning.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
