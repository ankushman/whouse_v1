import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#1e3a5f', '#1e40af', '#2563eb', '#3b82f6', '#60a5fa', '#172554', '#0c4a6e', '#eff6ff']
const PRODUCTS = ['Cotton Khadi Muslin', 'Banarasi Cotton Saree', 'Ikat Handloom Fabric', 'Chanderi Cotton Dupatta', 'Kalamkari Yardage', 'Mangalagiri Cotton', 'Tant Bengal Saree', 'Kota Doria Fabric']
const CLUSTERS = ['Pochampally Telangana', 'Sualkuchi Assam', 'Panchgani Maharashtra', 'Sanganer Rajasthan', 'Kanchipuram Tamil Nadu', 'Varanasi UP', 'Bhagalpur Bihar', 'Kozhikode Kerala']
const STATUSES = ['Handloom Mark Certified', 'GI Handloom Tag', 'In Transit Rolled', 'Climate Store', 'GST 5% Applied', 'Weave Count QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="hlc-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="hlc-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="hlc-costbar w-full bg-blue-100 rounded h-2"><div className="bg-blue-700 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="hlc-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e3a5f" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="hlc-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="hlc-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['meters', 'pieces', 'yards', 'lots']
  return {
    id: `HLC-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], manufacturer: CLUSTERS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(100, 6000, 250 + idx * 140), unit: units[idx % 4],
    cost: ri(20000, 500000, 30000 + idx * 16000), date: `2025-07-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const cottonRecords = [
  { id: 'HLC-0001', product: 'Cotton Khadi Muslin', manufacturer: 'Pochampally Telangana', status: 'Handloom Mark Certified', qty: 3000, unit: 'meters', cost: 180000, date: '2025-07-02' },
  { id: 'HLC-0002', product: 'Banarasi Cotton Saree', manufacturer: 'Sualkuchi Assam', status: 'GI Handloom Tag', qty: 500, unit: 'pieces', cost: 350000, date: '2025-07-04' },
  { id: 'HLC-0003', product: 'Ikat Handloom Fabric', manufacturer: 'Panchgani Maharashtra', status: 'In Transit Rolled', qty: 2000, unit: 'yards', cost: 120000, date: '2025-07-05' },
  { id: 'HLC-0004', product: 'Chanderi Cotton Dupatta', manufacturer: 'Sanganer Rajasthan', status: 'Climate Store', qty: 800, unit: 'pieces', cost: 160000, date: '2025-07-07' },
  { id: 'HLC-0005', product: 'Kalamkari Yardage', manufacturer: 'Kanchipuram Tamil Nadu', status: 'GST 5% Applied', qty: 1500, unit: 'meters', cost: 225000, date: '2025-07-08' },
  { id: 'HLC-0006', product: 'Mangalagiri Cotton', manufacturer: 'Varanasi UP', status: 'Weave Count QC', qty: 4000, unit: 'meters', cost: 100000, date: '2025-07-10' },
  { id: 'HLC-0007', product: 'Tant Bengal Saree', manufacturer: 'Bhagalpur Bihar', status: 'Handloom Mark Certified', qty: 600, unit: 'pieces', cost: 300000, date: '2025-07-11' },
  { id: 'HLC-0008', product: 'Kota Doria Fabric', manufacturer: 'Kozhikode Kerala', status: 'GI Handloom Tag', qty: 2500, unit: 'yards', cost: 175000, date: '2025-07-13' },
  { id: 'HLC-0009', product: 'Cotton Khadi Muslin', manufacturer: 'Pochampally Telangana', status: 'In Transit Rolled', qty: 2800, unit: 'meters', cost: 168000, date: '2025-07-14' },
  { id: 'HLC-0010', product: 'Banarasi Cotton Saree', manufacturer: 'Sualkuchi Assam', status: 'Climate Store', qty: 450, unit: 'pieces', cost: 315000, date: '2025-07-15' },
  { id: 'HLC-0011', product: 'Ikat Handloom Fabric', manufacturer: 'Panchgani Maharashtra', status: 'GST 5% Applied', qty: 1800, unit: 'yards', cost: 108000, date: '2025-07-16' },
  { id: 'HLC-0012', product: 'Chanderi Cotton Dupatta', manufacturer: 'Sanganer Rajasthan', status: 'Weave Count QC', qty: 750, unit: 'pieces', cost: 150000, date: '2025-07-17' },
  { id: 'HLC-0013', product: 'Kalamkari Yardage', manufacturer: 'Kanchipuram Tamil Nadu', status: 'Handloom Mark Certified', qty: 1400, unit: 'meters', cost: 210000, date: '2025-07-18' },
  { id: 'HLC-0014', product: 'Mangalagiri Cotton', manufacturer: 'Varanasi UP', status: 'GI Handloom Tag', qty: 3800, unit: 'meters', cost: 95000, date: '2025-07-19' },
  { id: 'HLC-0015', product: 'Tant Bengal Saree', manufacturer: 'Bhagalpur Bihar', status: 'In Transit Rolled', qty: 550, unit: 'pieces', cost: 275000, date: '2025-07-20' },
  { id: 'HLC-0016', product: 'Kota Doria Fabric', manufacturer: 'Kozhikode Kerala', status: 'Climate Store', qty: 2200, unit: 'yards', cost: 154000, date: '2025-07-21' },
  { id: 'HLC-0017', product: 'Cotton Khadi Muslin', manufacturer: 'Pochampally Telangana', status: 'GST 5% Applied', qty: 2600, unit: 'meters', cost: 156000, date: '2025-07-22' },
  { id: 'HLC-0018', product: 'Banarasi Cotton Saree', manufacturer: 'Sualkuchi Assam', status: 'Weave Count QC', qty: 420, unit: 'pieces', cost: 294000, date: '2025-07-23' },
  { id: 'HLC-0019', product: 'Ikat Handloom Fabric', manufacturer: 'Panchgani Maharashtra', status: 'Handloom Mark Certified', qty: 1600, unit: 'yards', cost: 96000, date: '2025-07-24' },
  { id: 'HLC-0020', product: 'Chanderi Cotton Dupatta', manufacturer: 'Sanganer Rajasthan', status: 'GI Handloom Tag', qty: 700, unit: 'pieces', cost: 140000, date: '2025-07-25' },
]



export default function HandloomCottonSupplyChainView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...cottonRecords, ...genRecords(21), ...genRecords(41)]

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

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 14 + i * 9, cost: 120000 + i * 28000 }))
  const mfgChart = CLUSTERS.slice(0, 6).map((m, i) => ({ name: m.split(' ').slice(0, 2).join(' '), volume: 180 + i * 130, revenue: 9 + i * 6 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 9 + i * 5 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="hlc-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Supply Chain' }, { label: 'Handloom Cotton' }]} />
      <PageHeader title="Handloom Cotton Supply Chain" description="Track handloom cotton fabrics, sarees, and muslin from India's GI-tagged weaving clusters to domestic boutiques and export markets" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-blue-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🧵" label="Total Shipments" value={String(allRecords.length)} />
            <KpiTile icon="🏭" label="Weaving Clusters" value={String(CLUSTERS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile icon="📈" label="Avg Cost" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="hlc-health-grid">
            <CardHeader><CardTitle>Operational Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={90} label="HLM Cert" />
                <HealthRing value={84} label="GI Tags" />
                <HealthRing value={77} label="Roll Pack" />
                <HealthRing value={92} label="Climate" />
                <HealthRing value={88} label="GST 5%" />
                <HealthRing value={81} label="Weave QC" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Khadi Muslin Stock" value="8,400 meters" />
            <ValueTile label="Sarees Ready" value="2,020 pieces" />
            <ValueTile label="Export Ready" value="35 Lots" />
            <ValueTile label="Climate Controlled" value="82%" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filteredRecords.length} onRefresh={() => {}} placeholder="Search by ID, product, cluster, or lot..." />

          <Card className="hlc-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-blue-50">
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
                    <tr key={r.id} className="border-b hover:bg-blue-50/50">
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
            <Card className="hlc-insight"><CardHeader><CardTitle>India Handloom Heritage Capital</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">India's handloom sector is the world's second largest after China, employing 43 lakh weaver families across 2,378 clusters. The sector produces 6.5 billion sqm of fabric annually valued at ₹68,000 crore. Andhra Pradesh, Telangana, and Uttar Pradesh lead production with Pochampally ikat and Banarasi cotton commanding premium GI-tagged pricing at 3-5x mill-made alternatives in global markets.</p></CardContent></Card>
            <Card className="hlc-insight"><CardHeader><CardTitle>Handloom Mark Certification</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">The Handloom Mark (HLMA) certification by the Office of Development Commissioner for Handlooms guarantees genuine handwoven products. Over 3.2 lakh handloom products carry this mark. India has 28 lakh handlooms including 4.3 lakh in Andhra Pradesh, 3.8 lakh in UP, and 2.9 lakh in Tamil Nadu. National Handloom Day on August 7 commemorates the Swadeshi movement's khadi legacy.</p></CardContent></Card>
            <Card className="hlc-insight"><CardHeader><CardTitle>Climate-Controlled Fabric Storage</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Cotton handloom fabrics require 18-24°C and 55-65% relative humidity to prevent fungal growth and colour fading. IS 1528 specifies rolled fabric storage on wooden racks with minimum 10cm floor clearance. Silica gel sachets and camphor tablets are standard moth-prevention measures. Transit packaging uses acid-free tissue interleaving between fabric layers for premium saree shipments.</p></CardContent></Card>
            <Card className="hlc-insight"><CardHeader><CardTitle>AI Weave Defect Detection</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Machine learning vision systems detect weaving defects including missing picks, double ends, and broken weft patterns at 96% accuracy using 8-megapixel line-scan cameras. Real-time loom monitoring IoT sensors track warp tension, pick density, and shuttle speed. AI-powered pattern matching ensures GI-design authenticity verification within 2 seconds per fabric sample, combating counterfeit handloom products.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
