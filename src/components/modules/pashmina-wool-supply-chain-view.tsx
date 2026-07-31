import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#374151', '#4b5563', '#6b7280', '#9ca3af', '#d1d5db', '#1f2937', '#111827', '#f3f4f6']
const PRODUCTS = ['Pure Pashmina Shawl', 'Kani Woven Pashmina Stole', 'Sozni Embroidered Shawl', 'Pashmina Jamawar', 'Changthangi Wool Scarf', 'Pashmina Blanket Throw', 'Hand-Spun Pashmina Yarn', 'Semi-Pashmina Blend Wrap']
const WEAVERS = ['Leh Pashmina Cooperative', 'Changthang Pastoral Group', 'Kargil Handloom Cluster', 'Srinagar Shawl Emporium', 'Zanskar Weaving Unit', 'Nubra Valley Wool', 'Pulwama Pashmina House', 'Ganderbal Craft Society']
const STATUSES = ['GI Pashmina Mark', 'ISI Handloom Certified', 'Silk-Lined Box Transit', 'Humidity 30-40%', 'Mothproof Storage', 'Fibre Micron QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="pws-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="pws-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="pws-costbar w-full bg-gray-200 rounded h-2"><div className="h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%`, backgroundColor: COLORS[0] }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="pws-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={COLORS[0]} strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="pws-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="pws-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['pcs', 'yards', 'm', 'sets']
  return {
    id: `PWS-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], weaver: WEAVERS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(10, 1000, 50 + idx * 46), unit: units[idx % 4],
    cost: ri(20000, 800000, 40000 + idx * 16000), date: `2025-02-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const pashminaRecords = [
  { id: 'PWS-0001', product: 'Pure Pashmina Shawl', weaver: 'Leh Pashmina Cooperative', status: 'GI Pashmina Mark', qty: 120, unit: 'pcs', cost: 960000, date: '2025-02-04' },
  { id: 'PWS-0002', product: 'Kani Woven Pashmina Stole', weaver: 'Changthang Pastoral Group', status: 'ISI Handloom Certified', qty: 80, unit: 'pcs', cost: 1200000, date: '2025-02-06' },
  { id: 'PWS-0003', product: 'Sozni Embroidered Shawl', weaver: 'Kargil Handloom Cluster', status: 'Silk-Lined Box Transit', qty: 45, unit: 'pcs', cost: 2250000, date: '2025-02-08' },
  { id: 'PWS-0004', product: 'Pashmina Jamawar', weaver: 'Srinagar Shawl Emporium', status: 'Humidity 30-40%', qty: 60, unit: 'pcs', cost: 1800000, date: '2025-02-10' },
  { id: 'PWS-0005', product: 'Changthangi Wool Scarf', weaver: 'Zanskar Weaving Unit', status: 'Mothproof Storage', qty: 200, unit: 'pcs', cost: 600000, date: '2025-02-11' },
  { id: 'PWS-0006', product: 'Pashmina Blanket Throw', weaver: 'Nubra Valley Wool', status: 'Fibre Micron QC', qty: 30, unit: 'pcs', cost: 750000, date: '2025-02-13' },
  { id: 'PWS-0007', product: 'Hand-Spun Pashmina Yarn', weaver: 'Pulwama Pashmina House', status: 'GI Pashmina Mark', qty: 500, unit: 'm', cost: 400000, date: '2025-02-14' },
  { id: 'PWS-0008', product: 'Semi-Pashmina Blend Wrap', weaver: 'Ganderbal Craft Society', status: 'Silk-Lined Box Transit', qty: 150, unit: 'pcs', cost: 375000, date: '2025-02-16' },
  { id: 'PWS-0009', product: 'Pure Pashmina Shawl', weaver: 'Leh Pashmina Cooperative', status: 'ISI Handloom Certified', qty: 95, unit: 'pcs', cost: 1140000, date: '2025-02-17' },
  { id: 'PWS-0010', product: 'Kani Woven Pashmina Stole', weaver: 'Changthang Pastoral Group', status: 'Humidity 30-40%', qty: 70, unit: 'pcs', cost: 1050000, date: '2025-02-18' },
  { id: 'PWS-0011', product: 'Sozni Embroidered Shawl', weaver: 'Kargil Handloom Cluster', status: 'Mothproof Storage', qty: 35, unit: 'pcs', cost: 2100000, date: '2025-02-19' },
  { id: 'PWS-0012', product: 'Pashmina Jamawar', weaver: 'Srinagar Shawl Emporium', status: 'Fibre Micron QC', qty: 50, unit: 'pcs', cost: 1500000, date: '2025-02-20' },
  { id: 'PWS-0013', product: 'Changthangi Wool Scarf', weaver: 'Zanskar Weaving Unit', status: 'GI Pashmina Mark', qty: 250, unit: 'pcs', cost: 500000, date: '2025-02-21' },
  { id: 'PWS-0014', product: 'Pashmina Blanket Throw', weaver: 'Nubra Valley Wool', status: 'Silk-Lined Box Transit', qty: 25, unit: 'pcs', cost: 625000, date: '2025-02-22' },
  { id: 'PWS-0015', product: 'Hand-Spun Pashmina Yarn', weaver: 'Pulwama Pashmina House', status: 'Humidity 30-40%', qty: 400, unit: 'm', cost: 320000, date: '2025-02-23' },
  { id: 'PWS-0016', product: 'Semi-Pashmina Blend Wrap', weaver: 'Ganderbal Craft Society', status: 'Mothproof Storage', qty: 180, unit: 'pcs', cost: 270000, date: '2025-02-24' },
  { id: 'PWS-0017', product: 'Pure Pashmina Shawl', weaver: 'Leh Pashmina Cooperative', status: 'Fibre Micron QC', qty: 110, unit: 'pcs', cost: 1320000, date: '2025-02-25' },
  { id: 'PWS-0018', product: 'Kani Woven Pashmina Stole', weaver: 'Changthang Pastoral Group', status: 'Silk-Lined Box Transit', qty: 55, unit: 'pcs', cost: 825000, date: '2025-02-26' },
  { id: 'PWS-0019', product: 'Sozni Embroidered Shawl', weaver: 'Kargil Handloom Cluster', status: 'GI Pashmina Mark', qty: 40, unit: 'pcs', cost: 2400000, date: '2025-02-27' },
  { id: 'PWS-0020', product: 'Pashmina Jamawar', weaver: 'Srinagar Shawl Emporium', status: 'ISI Handloom Certified', qty: 65, unit: 'pcs', cost: 1625000, date: '2025-02-28' },
]




export default function PashminaWoolSupplyChainView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...pashminaRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.product.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string))
    })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'product', label: 'Pashmina Type', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.product === p).length })) },
    { key: 'status', label: 'Status', options: STATUSES.map(s => ({ value: s, label: s, count: allRecords.filter(r => r.status === s).length })) },
  ]

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 10 + i * 5, cost: 200000 + i * 100000 }))
  const weaverChart = WEAVERS.slice(0, 6).map((w, i) => ({ name: w.split(' ').slice(0, 2).join(' '), volume: 60 + i * 40, revenue: 4 + i * 3 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 10 + i * 4 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="pws-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Pashmina Wool Supply' }]} />
      <PageHeader title="Pashmina Wool Supply Chain" description="Track Changthangi pashmina from Ladakh's Changthang plateau through fibre sorting, hand-spinning, hand-weaving, and finishing to luxury shawl markets worldwide" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-gray-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🏔️" label="Total Shipments" value={String(allRecords.length)} />
            <KpiTile icon="🧶" label="Weaver Clusters" value={String(WEAVERS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 10000000).toFixed(2)}Cr`} />
            <KpiTile icon="📈" label="Avg Cost" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="pws-health-grid">
            <CardHeader><CardTitle>Operational Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={78} label="Fibre Quality" />
                <HealthRing value={72} label="GI Certified" />
                <HealthRing value={85} label="Handloom" />
                <HealthRing value={65} label="Humidity" />
                <HealthRing value={90} label="Export" />
                <HealthRing value={68} label="Weaver Pay" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Pure Pashmina" value="310 pcs" />
            <ValueTile label="Kani Woven" value="215 pcs" />
            <ValueTile label="In Transit" value="36 Lots" />
            <ValueTile label="GI Marked" value="58 Lots" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filteredRecords.length} onRefresh={() => {}} placeholder="Search by ID, pashmina type, weaver, or lot..." />

          <Card className="pws-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-100">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Pashmina Type</th>
                    <th className="p-3 text-left">Weaver Cluster</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Cost</th>
                    <th className="p-3 text-left">Cost Bar</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.slice(0, 15).map(r => (
                    <tr key={r.id} className="border-b hover:bg-gray-50/50">
                      <td className="p-3 font-mono text-xs">{r.id}</td>
                      <td className="p-3"><ProductBadge name={r.product} /></td>
                      <td className="p-3 text-xs">{r.weaver}</td>
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
              <CardHeader><CardTitle>Weaver Cluster Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={250} data={weaverChart}>
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
            <Card className="pws-insight">
              <CardHeader><CardTitle>Ladakh Changthang — Source of the World's Finest Cashmere</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Changthangi goats at 12,000-15,000 ft in Ladakh's Changthang plateau produce pashmina fibres at 12-15 microns diameter (vs 19-23 microns for standard cashmere). Each goat yields only 80-120g of pashmina per year. Ladakh produces 50 tonnes of raw pashmina annually, supporting 2,500 Changpa nomadic families. GI-tagged Kashmir Pashmina registered 2022. Global pashmina market valued at $3.2 billion (2025) with India producing only 10% of raw material (rest from Mongolia/China Inner Mongolia goats). The Changpa nomads have herded these goats for centuries across the high-altitude desert, migrating seasonally between summer and winter pastures. Climate change is reducing winter pasture availability, threatening both goat populations and the traditional pastoral lifestyle that has sustained generations. The Ladakh UT administration has initiated a pashmina dehairing centre in Leh to reduce reliance on Srinagar-based processing, shortening the supply chain by weeks and improving artisan income retention by approximately 30%. India's pashmina industry employs over 50,000 artisans across Jammu and Kashmir and Ladakh, with women constituting 65% of the hand-spinning workforce.</p></CardContent>
            </Card>
            <Card className="pws-insight">
              <CardHeader><CardTitle>Pashmina Fibre Grading & Handloom Standards</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">ISI 15405 certifies handloom pashmina products. Fibre diameter must be 16 microns or below for genuine pashmina (IS 15797). Tensile strength minimum 2.5 cN/tex. Hand-spinning produces yarn at 30-40 counts versus machine-spun 60-80 counts, making hand-spun inherently softer but slower, with one shawl requiring 15-30 days of spinning alone. Power loom products cannot legally be sold as pure pashmina under Indian law. Sozni embroidery, the finest needlework tradition in Kashmir, takes 2-12 months per shawl depending on pattern complexity. Kani weaving uses wooden loom sticks called toji to create complex jacquard-like patterns entirely by hand. The Bureau of Indian Standards has established stringent testing protocols requiring each lot to pass microscopic fibre analysis before receiving the handloom certification mark. Kashmir's handloom sector includes approximately 35,000 pit looms, of which only 12,000 are currently operational due to competition from machine-made alternatives. A single Kani shawl requiring 500 to 1,500 coloured threads and 3 to 18 months of weaving commands premium prices internationally.</p></CardContent>
            </Card>
            <Card className="pws-insight">
              <CardHeader><CardTitle>Pashmina Storage & Climate Requirements</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Pashmina requires storage at 30-40% humidity, below 25 degrees Celsius, protected from moths with cedar and neem sachets. Silk-lined presentation boxes for luxury export prevent fibre compression during transit. From Leh to Delhi covering 1,030 km requires 2-3 days via Manali-Leh highway (June-October only) or 3-4 days via Srinagar route. Winter closure of high passes means 5-6 months of inventory must be transported before October each year. Only 8% of Ladakh's pashmina is exported with proper climate-controlled packaging. The Manali-Leh highway traverses five high-altitude passes above 13,000 ft, subject to landslides and sudden weather changes that can delay shipments. Temperature fluctuations during transit can cause condensation inside packaging, risking fungal growth on natural fibres. Modern cold chain solutions including humidity-indicating cards, silica gel desiccants, and vacuum-sealed inner packaging have improved transit survival rates from 78% to 96% for GI-certified pashmina exports. Delhi airport and Mumbai port handle the majority of export shipments, with air freight preferred for high-value finished shawls.</p></CardContent>
            </Card>
            <Card className="pws-insight">
              <CardHeader><CardTitle>Counterfeit Crisis & Blockchain Traceability</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">70% of products sold globally as pashmina are counterfeit, typically polyester-viscose blends masquerading as luxury cashmere. GI registration in 2022 enables legal action but enforcement remains limited. Blockchain traceability from Changthang goat to consumer shawl combats fraud through immutable records. AI-powered microscopy authenticates fibre diameter in 30 seconds. India's genuine pashmina export is valued at 450 crore rupees (2025) with potential to reach 2,000 crore with proper authentication. EU and US luxury markets pay 500 to 5,000 dollars for authenticated pieces. Several pilot blockchain projects in Kashmir have tagged individual goats with RFID chips, recording fibre yield, processing stages, and artisan identities on distributed ledgers. The handicrafts department has partnered with technology firms to develop AI-based fibre authentication kiosks at airports and luxury retail outlets using machine learning and high-resolution microscopy. International luxury brands source authenticated Ladakhi pashmina at premium rates, but smaller artisans lack access to similar traceability platforms, limiting their market reach and pricing power. The proposed National Pashmina Authentication Authority aims to consolidate testing, certification, and blockchain tracking under a single regulatory framework.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

