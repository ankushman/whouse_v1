import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#722f37', '#88333d', '#a33a46', '#be4450', '#d94f5a', '#521e24', '#622830', '#fce7f1']
const PRODUCTS = ['Real Zari Silk Saree', 'Zardozi Bridal Lehenga', 'Kundan Zari Dupatta', 'Gold Thread Brocade', 'Zari Pashmina Shawl', 'Silver Zari Embroidered Panel', 'Zardozi Clutch Bag', 'Zari Lace Trim Roll']
const MANUFACTURERS = ['Surat Zari Mills GJ', 'Varanasi Brocade UP', 'Bhagalpur Silk Cluster', 'Kanchipuram Zari TN', 'Murshidabad Zardozi WB', 'Jaipur Kundan RJ', 'Lucknow Chikan Zari UP', 'Mysore Zari Palace KA']
const STATUSES = ['GI Zari Certified', 'BIS Gold Purity 92%', 'Silk Folded', 'Padded Box Transit', 'Dehumid Vault Store', 'Thread Count QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="zze-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="zze-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="zze-costbar w-full bg-rose-100 rounded h-2"><div className="bg-rose-700 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="zze-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#722f37" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="zze-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="zze-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['pieces', 'sets', 'meters', 'rolls']
  return {
    id: `ZZE-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], manufacturer: MANUFACTURERS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(10, 500, 15 + idx * 12), unit: units[idx % 4],
    cost: ri(50000, 800000, 75000 + idx * 28000), date: `2025-07-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const zariRecords = [
  { id: 'ZZE-0001', product: 'Real Zari Silk Saree', manufacturer: 'Surat Zari Mills GJ', status: 'GI Zari Certified', qty: 120, unit: 'pieces', cost: 480000, date: '2025-07-02' },
  { id: 'ZZE-0002', product: 'Zardozi Bridal Lehenga', manufacturer: 'Varanasi Brocade UP', status: 'BIS Gold Purity 92%', qty: 30, unit: 'pieces', cost: 720000, date: '2025-07-04' },
  { id: 'ZZE-0003', product: 'Kundan Zari Dupatta', manufacturer: 'Bhagalpur Silk Cluster', status: 'Silk Folded', qty: 200, unit: 'pieces', cost: 180000, date: '2025-07-05' },
  { id: 'ZZE-0004', product: 'Gold Thread Brocade', manufacturer: 'Kanchipuram Zari TN', status: 'Padded Box Transit', qty: 80, unit: 'meters', cost: 350000, date: '2025-07-07' },
  { id: 'ZZE-0005', product: 'Zari Pashmina Shawl', manufacturer: 'Murshidabad Zardozi WB', status: 'Dehumid Vault Store', qty: 60, unit: 'pieces', cost: 420000, date: '2025-07-08' },
  { id: 'ZZE-0006', product: 'Silver Zari Embroidered Panel', manufacturer: 'Jaipur Kundan RJ', status: 'Thread Count QC', qty: 150, unit: 'meters', cost: 195000, date: '2025-07-10' },
  { id: 'ZZE-0007', product: 'Zardozi Clutch Bag', manufacturer: 'Lucknow Chikan Zari UP', status: 'GI Zari Certified', qty: 250, unit: 'pieces', cost: 125000, date: '2025-07-11' },
  { id: 'ZZE-0008', product: 'Zari Lace Trim Roll', manufacturer: 'Mysore Zari Palace KA', status: 'BIS Gold Purity 92%', qty: 400, unit: 'rolls', cost: 88000, date: '2025-07-13' },
  { id: 'ZZE-0009', product: 'Real Zari Silk Saree', manufacturer: 'Surat Zari Mills GJ', status: 'Silk Folded', qty: 110, unit: 'pieces', cost: 440000, date: '2025-07-14' },
  { id: 'ZZE-0010', product: 'Zardozi Bridal Lehenga', manufacturer: 'Varanasi Brocade UP', status: 'Padded Box Transit', qty: 25, unit: 'pieces', cost: 600000, date: '2025-07-15' },
  { id: 'ZZE-0011', product: 'Kundan Zari Dupatta', manufacturer: 'Bhagalpur Silk Cluster', status: 'Dehumid Vault Store', qty: 180, unit: 'pieces', cost: 162000, date: '2025-07-16' },
  { id: 'ZZE-0012', product: 'Gold Thread Brocade', manufacturer: 'Kanchipuram Zari TN', status: 'Thread Count QC', qty: 75, unit: 'meters', cost: 328000, date: '2025-07-17' },
  { id: 'ZZE-0013', product: 'Zari Pashmina Shawl', manufacturer: 'Murshidabad Zardozi WB', status: 'GI Zari Certified', qty: 55, unit: 'pieces', cost: 385000, date: '2025-07-18' },
  { id: 'ZZE-0014', product: 'Silver Zari Embroidered Panel', manufacturer: 'Jaipur Kundan RJ', status: 'BIS Gold Purity 92%', qty: 140, unit: 'meters', cost: 182000, date: '2025-07-19' },
  { id: 'ZZE-0015', product: 'Zardozi Clutch Bag', manufacturer: 'Lucknow Chikan Zari UP', status: 'Silk Folded', qty: 230, unit: 'pieces', cost: 115000, date: '2025-07-20' },
  { id: 'ZZE-0016', product: 'Zari Lace Trim Roll', manufacturer: 'Mysore Zari Palace KA', status: 'Padded Box Transit', qty: 380, unit: 'rolls', cost: 83600, date: '2025-07-21' },
  { id: 'ZZE-0017', product: 'Real Zari Silk Saree', manufacturer: 'Surat Zari Mills GJ', status: 'Dehumid Vault Store', qty: 100, unit: 'pieces', cost: 400000, date: '2025-07-22' },
  { id: 'ZZE-0018', product: 'Zardozi Bridal Lehenga', manufacturer: 'Varanasi Brocade UP', status: 'Thread Count QC', qty: 22, unit: 'pieces', cost: 528000, date: '2025-07-23' },
  { id: 'ZZE-0019', product: 'Kundan Zari Dupatta', manufacturer: 'Bhagalpur Silk Cluster', status: 'GI Zari Certified', qty: 165, unit: 'pieces', cost: 148500, date: '2025-07-24' },
  { id: 'ZZE-0020', product: 'Gold Thread Brocade', manufacturer: 'Kanchipuram Zari TN', status: 'BIS Gold Purity 92%', qty: 70, unit: 'meters', cost: 306000, date: '2025-07-25' },
]


export default function ZariZardoziEmbroideryLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...zariRecords, ...genRecords(21), ...genRecords(41)]

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

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 6 + i * 4, cost: 120000 + i * 45000 }))
  const mfgChart = MANUFACTURERS.slice(0, 6).map((m, i) => ({ name: m.split(' ').slice(0, 2).join(' '), volume: 40 + i * 35, revenue: 8 + i * 5 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 6 + i * 3 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="zze-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Zari & Zardozi Embroidery' }]} />
      <PageHeader title="Zari & Zardozi Embroidery Logistics" description="Track gold and silver zari thread textiles, zardozi hand-embroidered bridal couture, kundan work, and brocade fabrics from India's legendary weaving clusters to luxury retail markets" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-rose-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="✨" label="Total Shipments" value={String(allRecords.length)} />
            <KpiTile icon="🏭" label="Weaving Clusters" value={String(MANUFACTURERS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile icon="📈" label="Avg Cost" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="zze-health-grid">
            <CardHeader><CardTitle>Operational Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={90} label="GI Zari" />
                <HealthRing value={85} label="Gold 92%" />
                <HealthRing value={88} label="Silk Fold" />
                <HealthRing value={82} label="Box Ship" />
                <HealthRing value={93} label="Vault" />
                <HealthRing value={78} label="Thread QC" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Surat Output" value="240 units" />
            <ValueTile label="Vault Stored" value="18 Lots" />
            <ValueTile label="Wedding Season" value="85%" />
            <ValueTile label="Export Ready" value="70%" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filteredRecords.length} onRefresh={() => {}} placeholder="Search by ID, product, cluster, or lot..." />

          <Card className="zze-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-rose-50">
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
                    <tr key={r.id} className="border-b hover:bg-rose-50/50">
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
            <Card className="zze-insight"><CardHeader><CardTitle>Surat & Varanasi Zari Heritage</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Surat in Gujarat produces 70% of India's zari thread, drawing fine gold and silver wire through diamond dies to create filigree threads as thin as 0.02mm. Varanasi's Banarasi brocade weaves real zari into silk sarees using 5,600 traditional pit looms across 4 lakh weavers. A single Banarasi zari saree takes 15-45 days to complete. The GI tag for Banarasi Zari Sarees and Brocades was registered in 2009 under the Geographical Indications Act. India's zari industry is valued at ₹15,000 crore with exports to 45 countries including UAE, US, and UK.</p></CardContent></Card>
            <Card className="zze-insight"><CardHeader><CardTitle>Zardozi & Kundan Craft Traditions</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Zardozi, a Mughal-era hand-embroidery technique using gold-coated metallic thread, pearls, and semi-precious stones, is practiced in Lucknow, Bhopal, and Agra. A single zardozi bridal lehenga requires 30-60 days of handwork by 4-6 artisans. Kundan zari work combines glass-setting (kundan) with gold thread embroidery, originating in Rajasthan's royal courts. Murshidabad in West Bengal produces silver zari on tussar silk. The craft supports 8 lakh artisans nationally with annual production worth ₹6,500 crore across bridal couture, home decor, and luxury accessories.</p></CardContent></Card>
            <Card className="zze-insight"><CardHeader><CardTitle>BIS Gold Purity & Vault Storage</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">BIS IS 1417 certifies gold purity in zari thread: real zari must contain minimum 92% gold (22 karat) for premium grade, while imitation zari uses metallic polyester. Surat's zari testing lab processes 15,000 samples annually. Luxury zari textiles require dehumidified vault storage at 45-55% relative humidity to prevent silver tarnishing and gold thread oxidation. Silk-zari products must be acid-free tissue wrapped with silica gel packs. Insurance valuation for a bridal lehenga shipment can exceed ₹1 crore per lot, requiring armed transit security.</p></CardContent></Card>
            <Card className="zze-insight"><CardHeader><CardTitle>AI Thread Quality & Blockchain Provenance</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">AI-powered machine vision inspects zari thread uniformity and detects counterfeit metallic-coated polyester versus real gold wire with 98.7% accuracy. Blockchain provenance tracks raw gold from refinery to finished zari saree, ensuring ethical sourcing and purity verification. Machine learning forecasts wedding-season demand for zardozi lehenga with 88% accuracy based on social media trend analysis. Smart RFID tags embedded in luxury zari packaging enable real-time location tracking and anti-theft monitoring across the supply chain from artisan workshop to retail boutique.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
