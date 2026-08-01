import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#854d0e', '#a16207', '#ca8a04', '#eab308', '#facc15', '#713f12', '#422006', '#fefce8']
const PRODUCTS = ['Muga Silk Mekhela Chador', 'Eri Silk Shawl', 'Pat Silk Saree', 'Muga Silk Stole', 'Eri Silk Scarf', 'Golden Muga Duppatta', 'Assam Silk Curtain Panel', 'Muga Silk Trousers Fabric']
const WEAVERS = ['Sualkuchi Silk Village', 'Boko Weaving Centre', 'Nalbari Handloom Cluster', 'Jorhat Silk Farm', 'Dibrugarh Eri Unit', 'Kamrup Muga Rearers', 'Goalpara Silk Society', 'Tezpur Weaving Artisans']
const STATUSES = ['GI Muga Silk Mark', 'IS 15266 Silk Grade A', 'Acid-Free Tissue Wrap', 'Humidity-Controlled Transit', 'Mothproof Silo', 'Tensile Strength QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="asm-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="asm-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="asm-costbar w-full bg-yellow-100 rounded h-2"><div className="bg-yellow-700 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="asm-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#854d0e" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="asm-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="asm-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['m', 'pcs', 'sets', 'kg']
  return {
    id: `ASM-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], weaver: WEAVERS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(5, 200, 10 + idx * 8), unit: units[idx % 4],
    cost: ri(10000, 500000, 15000 + idx * 15000), date: `2025-07-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const assamSilkRecords = [
  { id: 'ASM-0001', product: 'Muga Silk Mekhela Chador', weaver: 'Sualkuchi Silk Village', status: 'GI Muga Silk Mark', qty: 12, unit: 'pcs', cost: 240000, date: '2025-07-02' },
  { id: 'ASM-0002', product: 'Eri Silk Shawl', weaver: 'Boko Weaving Centre', status: 'IS 15266 Silk Grade A', qty: 25, unit: 'pcs', cost: 87500, date: '2025-07-04' },
  { id: 'ASM-0003', product: 'Pat Silk Saree', weaver: 'Nalbari Handloom Cluster', status: 'Acid-Free Tissue Wrap', qty: 18, unit: 'pcs', cost: 162000, date: '2025-07-05' },
  { id: 'ASM-0004', product: 'Muga Silk Stole', weaver: 'Jorhat Silk Farm', status: 'Humidity-Controlled Transit', qty: 40, unit: 'pcs', cost: 120000, date: '2025-07-07' },
  { id: 'ASM-0005', product: 'Eri Silk Scarf', weaver: 'Dibrugarh Eri Unit', status: 'Mothproof Silo', qty: 60, unit: 'pcs', cost: 72000, date: '2025-07-08' },
  { id: 'ASM-0006', product: 'Golden Muga Duppatta', weaver: 'Kamrup Muga Rearers', status: 'Tensile Strength QC', qty: 30, unit: 'pcs', cost: 96000, date: '2025-07-10' },
  { id: 'ASM-0007', product: 'Assam Silk Curtain Panel', weaver: 'Goalpara Silk Society', status: 'GI Muga Silk Mark', qty: 8, unit: 'sets', cost: 56000, date: '2025-07-11' },
  { id: 'ASM-0008', product: 'Muga Silk Trousers Fabric', weaver: 'Tezpur Weaving Artisans', status: 'IS 15266 Silk Grade A', qty: 45, unit: 'm', cost: 135000, date: '2025-07-13' },
  { id: 'ASM-0009', product: 'Muga Silk Mekhela Chador', weaver: 'Sualkuchi Silk Village', status: 'Acid-Free Tissue Wrap', qty: 10, unit: 'pcs', cost: 200000, date: '2025-07-14' },
  { id: 'ASM-0010', product: 'Eri Silk Shawl', weaver: 'Boko Weaving Centre', status: 'Humidity-Controlled Transit', qty: 22, unit: 'pcs', cost: 77000, date: '2025-07-15' },
  { id: 'ASM-0011', product: 'Pat Silk Saree', weaver: 'Nalbari Handloom Cluster', status: 'Mothproof Silo', qty: 15, unit: 'pcs', cost: 135000, date: '2025-07-16' },
  { id: 'ASM-0012', product: 'Muga Silk Stole', weaver: 'Jorhat Silk Farm', status: 'Tensile Strength QC', qty: 35, unit: 'pcs', cost: 105000, date: '2025-07-17' },
  { id: 'ASM-0013', product: 'Eri Silk Scarf', weaver: 'Dibrugarh Eri Unit', status: 'GI Muga Silk Mark', qty: 55, unit: 'pcs', cost: 66000, date: '2025-07-18' },
  { id: 'ASM-0014', product: 'Golden Muga Duppatta', weaver: 'Kamrup Muga Rearers', status: 'IS 15266 Silk Grade A', qty: 28, unit: 'pcs', cost: 89600, date: '2025-07-19' },
  { id: 'ASM-0015', product: 'Assam Silk Curtain Panel', weaver: 'Goalpara Silk Society', status: 'Acid-Free Tissue Wrap', qty: 6, unit: 'sets', cost: 42000, date: '2025-07-20' },
  { id: 'ASM-0016', product: 'Muga Silk Trousers Fabric', weaver: 'Tezpur Weaving Artisans', status: 'Humidity-Controlled Transit', qty: 40, unit: 'm', cost: 120000, date: '2025-07-21' },
  { id: 'ASM-0017', product: 'Muga Silk Mekhela Chador', weaver: 'Sualkuchi Silk Village', status: 'Mothproof Silo', qty: 11, unit: 'pcs', cost: 220000, date: '2025-07-22' },
  { id: 'ASM-0018', product: 'Eri Silk Shawl', weaver: 'Boko Weaving Centre', status: 'Tensile Strength QC', qty: 20, unit: 'pcs', cost: 70000, date: '2025-07-23' },
  { id: 'ASM-0019', product: 'Pat Silk Saree', weaver: 'Nalbari Handloom Cluster', status: 'GI Muga Silk Mark', qty: 16, unit: 'pcs', cost: 144000, date: '2025-07-24' },
  { id: 'ASM-0020', product: 'Muga Silk Stole', weaver: 'Jorhat Silk Farm', status: 'IS 15266 Silk Grade A', qty: 38, unit: 'pcs', cost: 114000, date: '2025-07-25' },
]

export default function AssamSilkMugaWeavingSupplyChainView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...assamSilkRecords, ...genRecords(21), ...genRecords(41)]

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

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 12 + i * 5, cost: 18000 + i * 12000 }))
  const weaverChart = WEAVERS.slice(0, 6).map((w, i) => ({ name: w.split(' ').slice(0, 2).join(' '), volume: 80 + i * 40, revenue: 6 + i * 4 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 6 + i * 4 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="asm-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Assam Silk & Muga Weaving' }]} />
      <PageHeader title="Assam Silk & Muga Weaving Supply Chain" description="Track Assam's legendary muga (golden), eri (castor), and pat (mulberry) silk from Brahmaputra valley rearing farms through reeling, hand-spinning, handloom weaving, and finishing to domestic textile and luxury export markets" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-yellow-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🧵" label="Total Batches" value={String(allRecords.length)} />
            <KpiTile icon="🏠" label="Weaver Clusters" value={String(WEAVERS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 10000000).toFixed(2)}Cr`} />
            <KpiTile icon="📈" label="Avg Batch" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="asm-health-grid">
            <CardHeader><CardTitle>Quality Compliance</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={93} label="GI Tag" />
                <HealthRing value={89} label="IS 15266" />
                <HealthRing value={85} label="Tissue" />
                <HealthRing value={80} label="Transit" />
                <HealthRing value={92} label="Mothproof" />
                <HealthRing value={87} label="Tensile" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Annual Muga Output" value="120 Tonnes" />
            <ValueTile label="Sualkuchi Village" value="8,000 Looms" />
            <ValueTile label="Export Markets" value="32 Countries" />
            <ValueTile label="Rearer Households" value="25,000" />
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
            placeholder="Search by batch ID, product, or weaver..."
          />

          <Card className="asm-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-yellow-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-left">Weaver</th>
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
                  <Line type="monotone" dataKey="cost" stroke={COLORS[3]} strokeWidth={2} />
                </LineChart>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Weaver Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={250} data={weaverChart}>
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
            <Card className="asm-insight"><CardHeader><CardTitle>Assam — India's Golden Muga Silk Treasure</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Assam is the world's sole producer of muga silk (Antheraea assamensis), a golden-hued semi-stitched silk found nowhere else, produced exclusively in the Brahmaputra valley. Muga silk has tensile strength of 4.5 g/denier and natural golden lustre that increases with each wash. Annual muga production is 120 tonnes (2025) from 25,000 rearing households across Lakhimpur, Dhemaji, Jorhat, and Sivasagar. Eri silk production at 3,000 tonnes makes Assam India's largest eri silk producer. GI-tagged Muga Silk registered 2007. The combined Assam silk industry employs 2.5 lakh weavers with annual turnover of Rs 1,200 crore, of which muga alone contributes Rs 400 crore at premium pricing of Rs 8,000-15,000 per kg.</p></CardContent></Card>
            <Card className="asm-insight"><CardHeader><CardTitle>IS 15266 Silk Grading &amp; Reeling Standards</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">IS 15266 grades silk yarn by denier (2.5-3.0 for muga, 2.0-2.5 for eri), tensile strength (minimum 4.0 g/denier for Grade A muga), elongation at break (minimum 18%), and defect count (below 3 per 100m for Grade A). Muga reeling uses traditional thigh-reeling at 200-300 rpm producing non-uniform yarn that commands premium for organic texture. Machine-reeled muga achieves uniformity but loses artisan value. Moisture content for storage must stay between 11-14%. Silver test detects artificial yellowing as genuine muga turns more golden while artificial turns grey. Suali cocoon grading requires cocoon weight above 6g and shell ratio above 24% for premium reeling quality.</p></CardContent></Card>
            <Card className="asm-insight"><CardHeader><CardTitle>Silk Storage &amp; Assam's Monsoon Logistics</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Muga silk requires storage at 20-25 degrees Celsius, 55-65% humidity with camphor or neem sachets for moth prevention. Acid-free tissue paper interleaving prevents discolouration over long storage. During Assam's monsoon season (June-September), road transport from Sualkuchi to Guwahati (30 km) faces frequent flooding of Brahmaputra tributaries, requiring 2-3 day buffer inventory. From Guwahati to Delhi (2,000 km) via NH27 takes 36-48 hours. Rail transport via New Bongaigaon to Kolkata (1,100 km) provides monsoon-resilient alternative with 60-hour transit. Silk products in transit require sealed polyethylene wrapping to prevent moisture absorption above 14%. Only 22% of Assam's muga production reaches export markets due to fragmented supply chains.</p></CardContent></Card>
            <Card className="asm-insight"><CardHeader><CardTitle>AI Defect Detection &amp; Global Muga Demand</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">AI-powered vision inspection detects weaving defects (missing picks, float errors, broken warp) at 99.5% accuracy on handloom products, replacing manual inspection that misses 15-20% of defects. Blockchain traceability from rearing farm cocoon to finished fabric ensures GI authenticity, combating Rs 200 crore annual counterfeit muga trade in India. India's muga silk export grew 180% from Rs 45 crore (2019) to Rs 126 crore (2025), targeting Rs 300 crore by 2028. USA, Japan, and France are primary markets with retail pricing of $80-500 per muga stole and $500-5,000 per mekhela chador. AI-driven demand forecasting using Google Trends and social media analytics achieves 72% accuracy for seasonal Bihu festival demand planning.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
