import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#1e3a5f', '#1e4d7b', '#2368a0', '#2d82c4', '#4b9de0', '#0f2440', '#162d50', '#dbeafe']
const PRODUCTS = ['Organic Raw Makhana', 'Roasted Makhana Pack', 'Flavoured Peri Peri Makhana', 'Makhana Flour Powder', 'Makhana Kheer Mix', 'Sugar-Free Makhana Bites', 'Makhana Raita Premix', 'Frozen Lotus Seed']
const MANUFACTURERS = ['Mithila Makhana Darbhanga', 'Madhubani Fox Nut Cluster', 'Samastipur Lotus Pond BR', 'Purnia Makhana Unit BR', 'Kanti Makhana Industries BR', 'Darbhanga Organic Farms', 'Katihar Makhana Process BR', 'Saharsa Lotus Growers']
const STATUSES = ['FSSAI Certified', 'FPO Makhana Grade A', 'Vacuum Sealed', 'Temp-Controlled Transit', 'Cold Store 5-8 C', 'Moisture < 5% QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="mfn-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="mfn-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-sky-100 text-sky-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="mfn-costbar w-full bg-sky-100 rounded h-2"><div className="bg-sky-700 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="mfn-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e3a5f" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="mfn-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="mfn-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['kg', 'packs', 'units', 'boxes']
  return {
    id: `MFN-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], manufacturer: MANUFACTURERS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(50, 5000, 80 + idx * 120), unit: units[idx % 4],
    cost: ri(5000, 300000, 8000 + idx * 9200), date: `2025-07-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const makhanaRecords = [
  { id: 'MFN-0001', product: 'Organic Raw Makhana', manufacturer: 'Mithila Makhana Darbhanga', status: 'FSSAI Certified', qty: 500, unit: 'kg', cost: 45000, date: '2025-07-02' },
  { id: 'MFN-0002', product: 'Roasted Makhana Pack', manufacturer: 'Madhubani Fox Nut Cluster', status: 'FPO Makhana Grade A', qty: 2000, unit: 'packs', cost: 60000, date: '2025-07-04' },
  { id: 'MFN-0003', product: 'Flavoured Peri Peri Makhana', manufacturer: 'Samastipur Lotus Pond BR', status: 'Vacuum Sealed', qty: 1500, unit: 'packs', cost: 52500, date: '2025-07-05' },
  { id: 'MFN-0004', product: 'Makhana Flour Powder', manufacturer: 'Purnia Makhana Unit BR', status: 'Temp-Controlled Transit', qty: 800, unit: 'kg', cost: 32000, date: '2025-07-07' },
  { id: 'MFN-0005', product: 'Makhana Kheer Mix', manufacturer: 'Kanti Makhana Industries BR', status: 'Cold Store 5-8 C', qty: 600, unit: 'units', cost: 48000, date: '2025-07-08' },
  { id: 'MFN-0006', product: 'Sugar-Free Makhana Bites', manufacturer: 'Darbhanga Organic Farms', status: 'Moisture < 5% QC', qty: 1200, unit: 'packs', cost: 42000, date: '2025-07-10' },
  { id: 'MFN-0007', product: 'Makhana Raita Premix', manufacturer: 'Katihar Makhana Process BR', status: 'FSSAI Certified', qty: 400, unit: 'boxes', cost: 18000, date: '2025-07-11' },
  { id: 'MFN-0008', product: 'Frozen Lotus Seed', manufacturer: 'Saharsa Lotus Growers', status: 'FPO Makhana Grade A', qty: 300, unit: 'kg', cost: 27000, date: '2025-07-13' },
  { id: 'MFN-0009', product: 'Organic Raw Makhana', manufacturer: 'Mithila Makhana Darbhanga', status: 'Vacuum Sealed', qty: 480, unit: 'kg', cost: 43200, date: '2025-07-14' },
  { id: 'MFN-0010', product: 'Roasted Makhana Pack', manufacturer: 'Madhubani Fox Nut Cluster', status: 'Temp-Controlled Transit', qty: 1900, unit: 'packs', cost: 57000, date: '2025-07-15' },
  { id: 'MFN-0011', product: 'Flavoured Peri Peri Makhana', manufacturer: 'Samastipur Lotus Pond BR', status: 'Cold Store 5-8 C', qty: 1400, unit: 'packs', cost: 49000, date: '2025-07-16' },
  { id: 'MFN-0012', product: 'Makhana Flour Powder', manufacturer: 'Purnia Makhana Unit BR', status: 'Moisture < 5% QC', qty: 750, unit: 'kg', cost: 30000, date: '2025-07-17' },
  { id: 'MFN-0013', product: 'Makhana Kheer Mix', manufacturer: 'Kanti Makhana Industries BR', status: 'FSSAI Certified', qty: 570, unit: 'units', cost: 45600, date: '2025-07-18' },
  { id: 'MFN-0014', product: 'Sugar-Free Makhana Bites', manufacturer: 'Darbhanga Organic Farms', status: 'FPO Makhana Grade A', qty: 1150, unit: 'packs', cost: 40250, date: '2025-07-19' },
  { id: 'MFN-0015', product: 'Makhana Raita Premix', manufacturer: 'Katihar Makhana Process BR', status: 'Vacuum Sealed', qty: 380, unit: 'boxes', cost: 17100, date: '2025-07-20' },
  { id: 'MFN-0016', product: 'Frozen Lotus Seed', manufacturer: 'Saharsa Lotus Growers', status: 'Temp-Controlled Transit', qty: 280, unit: 'kg', cost: 25200, date: '2025-07-21' },
  { id: 'MFN-0017', product: 'Organic Raw Makhana', manufacturer: 'Mithila Makhana Darbhanga', status: 'Cold Store 5-8 C', qty: 460, unit: 'kg', cost: 41400, date: '2025-07-22' },
  { id: 'MFN-0018', product: 'Roasted Makhana Pack', manufacturer: 'Madhubani Fox Nut Cluster', status: 'Moisture < 5% QC', qty: 1800, unit: 'packs', cost: 54000, date: '2025-07-23' },
  { id: 'MFN-0019', product: 'Flavoured Peri Peri Makhana', manufacturer: 'Samastipur Lotus Pond BR', status: 'FSSAI Certified', qty: 1350, unit: 'packs', cost: 47250, date: '2025-07-24' },
  { id: 'MFN-0020', product: 'Makhana Flour Powder', manufacturer: 'Purnia Makhana Unit BR', status: 'FPO Makhana Grade A', qty: 720, unit: 'kg', cost: 28800, date: '2025-07-25' },
]


export default function MakhanaFoxNutProcessingLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...makhanaRecords, ...genRecords(21), ...genRecords(41)]

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

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 18 + i * 7, cost: 35000 + i * 15000 }))
  const mfgChart = MANUFACTURERS.slice(0, 6).map((m, i) => ({ name: m.split(' ').slice(0, 2).join(' '), volume: 200 + i * 120, revenue: 12 + i * 6 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 8 + i * 3 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="mfn-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Makhana & Fox Nut Processing' }]} />
      <PageHeader title="Makhana Fox Nut Processing Logistics" description="Track organic makhana (fox nuts/lotus seeds) from Bihar's Mithila ponds through grading, roasting, flavouring, and cold-chain distribution to domestic and export health food markets" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-sky-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🪷" label="Total Shipments" value={String(allRecords.length)} />
            <KpiTile icon="🏭" label="Processing Units" value={String(MANUFACTURERS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile icon="📈" label="Avg Cost" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="mfn-health-grid">
            <CardHeader><CardTitle>Operational Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={92} label="FSSAI" />
                <HealthRing value={88} label="FPO Gr A" />
                <HealthRing value={85} label="Vacuum" />
                <HealthRing value={80} label="Temp Ship" />
                <HealthRing value={94} label="Cold Store" />
                <HealthRing value={83} label="Moisture" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Mithila Pond Area" value="15,000 ha" />
            <ValueTile label="Cold Chain Lots" value="32 Batches" />
            <ValueTile label="Export Shipments" value="18 Tons" />
            <ValueTile label="Organic Certified" value="78%" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filteredRecords.length} onRefresh={() => {}} placeholder="Search by ID, product, processor, or lot..." />

          <Card className="mfn-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-sky-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-left">Processor</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Cost</th>
                    <th className="p-3 text-left">Cost Bar</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.slice(0, 15).map(r => (
                    <tr key={r.id} className="border-b hover:bg-sky-50/50">
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
              <CardHeader><CardTitle>Processor Volume</CardTitle></CardHeader>
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
            <Card className="mfn-insight"><CardHeader><CardTitle>Bihar Mithila — India's Makhana Capital</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Bihar produces 90% of the world's makhana (fox nut/lotus seed), with Mithila region (Darbhanga, Madhubani, Samastipur, Saharsa) cultivating 15,000 hectares of lotus ponds. India's annual makhana production is 1.2 lakh tonnes valued at ₹2,500 crore, with exports to 45 countries including US, UK, UAE, and Australia. The crop provides livelihood to 5 lakh farming families in North Bihar. GI-tagged Mithila Makhana was registered in 2016 under the Geographical Indications Act, ensuring authenticity and premium pricing of ₹200-400 per kg for organic grade versus ₹80-120 for conventional.</p></CardContent></Card>
            <Card className="mfn-insight"><CardHeader><CardTitle>FSSAI & FPO Makhana Grading Standards</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">FSSAI mandates makhana processing under FSSC 22000 certification with HACCP-based food safety management. FPO (Food Products Order) grades makhana into Grade A (large, white, uniform 12mm+), Grade B (medium 10-12mm), and Grade C (small below 10mm). Moisture content must remain below 5% to prevent fungal growth during storage. Vacuum sealing with nitrogen flushing extends shelf life from 3 months (open pack) to 12 months. IS 14544 specifies packaging requirements for processed makhana including nitrogen-flushed multi-layer pouches with mandatory FSSAI licence number printing.</p></CardContent></Card>
            <Card className="mfn-insight"><CardHeader><CardTitle>Cold Chain & Temperature-Controlled Logistics</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Raw makhana requires temperature-controlled logistics at 5-8°C immediately after harvesting from lotus ponds to prevent enzymatic browning and rancidity. Cold chain from farm gate to processing unit must maintain temperature within 2°C variance. Refrigerated trucks carry 2-5 tonnes per trip from Darbhanga to Delhi NCR (1,100 km) in 24-30 hours. Storage humidity must stay below 60% relative humidity. Frozen lotus seeds maintain viability for 18 months at -18°C. India's cold chain infrastructure for makhana covers only 35% of production volume, with ₹450 crore investment planned under the PM Kisan SAMPADA Yojana.</p></CardContent></Card>
            <Card className="mfn-insight"><CardHeader><CardTitle>AI Sorting & Makhana Export Growth</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">AI-powered optical sorters grade makhana by size, colour, and shape at 500 kg per hour with 99.2% accuracy, replacing manual sorting that processes only 50 kg per hour. Machine learning predicts pond yield based on satellite NDVI vegetation indices with 78% accuracy 6 weeks before harvest. India's makhana exports have grown 340% from ₹180 crore (2019) to ₹790 crore (2025), driven by global vegan and plant-based protein trends. Makhana contains 9.7% protein, low glycemic index of 50, and is gluten-free, positioning it as a superfood in international health food markets with premium pricing of $12-18 per kg in US retail.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
