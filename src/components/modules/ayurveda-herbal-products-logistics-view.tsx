import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#065f46', '#047857', '#059669', '#10b981', '#34d399', '#064e3b', '#14532d', '#ecfdf5']
const PRODUCTS = ['Ashwagandha Capsules 500mg', 'Chyawanprash 500g', 'Triphala Powder 200g', 'Brahmi Memory Tablets', 'Neem Tablets Blood Purify', 'Tulsi Drops Immunity', 'Amla Vitamin C Juice', 'Shilajit Resin 15g']
const MANUFACTURERS = ['Dabur Ayur Ltd Ghaziabad', 'Himalaya Wellness Bangalore', 'Patanjali Haridwar', 'Charak Pharma Mumbai', 'Baidyanath Allahabad', 'Zandu Ayur Ahmedabad', 'Himalaya Drug Export', 'Sri Sri Tattva Bengaluru']
const STATUSES = ['AYUSH Licensed', 'IS 15944 GMP', 'In Transit Ambient', 'Herb Vault Store', 'Pending Excise Duty', 'Awaiting Lab QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="ahl-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="ahl-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="ahl-costbar w-full bg-green-100 rounded h-2"><div className="bg-green-600 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="ahl-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#065f46" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="ahl-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="ahl-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['bottles', 'kg', 'boxes', 'packs']
  return {
    id: `AHL-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], manufacturer: MANUFACTURERS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(200, 20000, 500 + idx * 480), unit: units[idx % 4],
    cost: ri(12000, 600000, 20000 + idx * 14500), date: `2025-06-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const ayurRecords = [
  { id: 'AHL-0001', product: 'Ashwagandha Capsules 500mg', manufacturer: 'Patanjali Haridwar', status: 'AYUSH Licensed', qty: 8000, unit: 'bottles', cost: 240000, date: '2025-06-04' },
  { id: 'AHL-0002', product: 'Chyawanprash 500g', manufacturer: 'Dabur Ayur Ltd Ghaziabad', status: 'IS 15944 GMP', qty: 5000, unit: 'kg', cost: 350000, date: '2025-06-06' },
  { id: 'AHL-0003', product: 'Triphala Powder 200g', manufacturer: 'Himalaya Wellness Bangalore', status: 'In Transit Ambient', qty: 12000, unit: 'packs', cost: 180000, date: '2025-06-08' },
  { id: 'AHL-0004', product: 'Brahmi Memory Tablets', manufacturer: 'Charak Pharma Mumbai', status: 'Herb Vault Store', qty: 4000, unit: 'bottles', cost: 280000, date: '2025-06-10' },
  { id: 'AHL-0005', product: 'Neem Tablets Blood Purify', manufacturer: 'Baidyanath Allahabad', status: 'Pending Excise Duty', qty: 6000, unit: 'boxes', cost: 120000, date: '2025-06-11' },
  { id: 'AHL-0006', product: 'Tulsi Drops Immunity', manufacturer: 'Zandu Ayur Ahmedabad', status: 'Awaiting Lab QC', qty: 15000, unit: 'bottles', cost: 300000, date: '2025-06-13' },
  { id: 'AHL-0007', product: 'Amla Vitamin C Juice', manufacturer: 'Himalaya Drug Export', status: 'AYUSH Licensed', qty: 10000, unit: 'bottles', cost: 500000, date: '2025-06-14' },
  { id: 'AHL-0008', product: 'Shilajit Resin 15g', manufacturer: 'Sri Sri Tattva Bengaluru', status: 'IS 15944 GMP', qty: 3000, unit: 'packs', cost: 450000, date: '2025-06-16' },
  { id: 'AHL-0009', product: 'Ashwagandha Capsules 500mg', manufacturer: 'Patanjali Haridwar', status: 'In Transit Ambient', qty: 7500, unit: 'bottles', cost: 225000, date: '2025-06-17' },
  { id: 'AHL-0010', product: 'Chyawanprash 500g', manufacturer: 'Dabur Ayur Ltd Ghaziabad', status: 'Herb Vault Store', qty: 4500, unit: 'kg', cost: 315000, date: '2025-06-18' },
  { id: 'AHL-0011', product: 'Triphala Powder 200g', manufacturer: 'Himalaya Wellness Bangalore', status: 'AYUSH Licensed', qty: 11000, unit: 'packs', cost: 165000, date: '2025-06-19' },
  { id: 'AHL-0012', product: 'Brahmi Memory Tablets', manufacturer: 'Charak Pharma Mumbai', status: 'Pending Excise Duty', qty: 3500, unit: 'bottles', cost: 245000, date: '2025-06-20' },
  { id: 'AHL-0013', product: 'Neem Tablets Blood Purify', manufacturer: 'Baidyanath Allahabad', status: 'Awaiting Lab QC', qty: 7000, unit: 'boxes', cost: 140000, date: '2025-06-21' },
  { id: 'AHL-0014', product: 'Tulsi Drops Immunity', manufacturer: 'Zandu Ayur Ahmedabad', status: 'IS 15944 GMP', qty: 13000, unit: 'bottles', cost: 260000, date: '2025-06-22' },
  { id: 'AHL-0015', product: 'Amla Vitamin C Juice', manufacturer: 'Himalaya Drug Export', status: 'In Transit Ambient', qty: 9000, unit: 'bottles', cost: 450000, date: '2025-06-23' },
  { id: 'AHL-0016', product: 'Shilajit Resin 15g', manufacturer: 'Sri Sri Tattva Bengaluru', status: 'Herb Vault Store', qty: 2500, unit: 'packs', cost: 375000, date: '2025-06-24' },
  { id: 'AHL-0017', product: 'Ashwagandha Capsules 500mg', manufacturer: 'Patanjali Haridwar', status: 'AYUSH Licensed', qty: 8500, unit: 'bottles', cost: 255000, date: '2025-06-25' },
  { id: 'AHL-0018', product: 'Chyawanprash 500g', manufacturer: 'Dabur Ayur Ltd Ghaziabad', status: 'Awaiting Lab QC', qty: 5500, unit: 'kg', cost: 385000, date: '2025-06-26' },
  { id: 'AHL-0019', product: 'Triphala Powder 200g', manufacturer: 'Himalaya Wellness Bangalore', status: 'IS 15944 GMP', qty: 10000, unit: 'packs', cost: 150000, date: '2025-06-27' },
  { id: 'AHL-0020', product: 'Brahmi Memory Tablets', manufacturer: 'Charak Pharma Mumbai', status: 'In Transit Ambient', qty: 3800, unit: 'bottles', cost: 266000, date: '2025-06-28' },
]




export default function AyurvedaHerbalProductsLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...ayurRecords, ...genRecords(21), ...genRecords(41)]

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

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 20 + i * 12, cost: 180000 + i * 45000 }))
  const mfgChart = MANUFACTURERS.slice(0, 6).map((m, i) => ({ name: m.split(' ').slice(0, 2).join(' '), volume: 150 + i * 120, revenue: 8 + i * 5 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 10 + i * 5 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="ahl-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Ayurveda & Herbal' }]} />
      <PageHeader title="Ayurveda & Herbal Products Logistics" description="Track AYUSH-licensed herbal product movement from manufacturing plants to distribution centres and export hubs" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-green-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🌿" label="Total Shipments" value={String(allRecords.length)} />
            <KpiTile icon="🏭" label="AYUSH Plants" value={String(MANUFACTURERS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile icon="📈" label="Avg Cost" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="ahl-health-grid">
            <CardHeader><CardTitle>Operational Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={88} label="GMP Compl." />
                <HealthRing value={76} label="Lab QC" />
                <HealthRing value={92} label="AYUSH" />
                <HealthRing value={81} label="Herb Source" />
                <HealthRing value={85} label="Export" />
                <HealthRing value={73} label="Cold Chain" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Ashwagandha Stock" value="24,000 bottles" />
            <ValueTile label="Chyawanprash" value="15,000 kg" />
            <ValueTile label="In Ambient Transit" value="38 Lots" />
            <ValueTile label="Lab Passed" value="52 Batches" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filteredRecords.length} onRefresh={() => {}} placeholder="Search by ID, product, manufacturer, or lot..." />

          <Card className="ahl-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-green-50">
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
                    <tr key={r.id} className="border-b hover:bg-green-50/50">
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
                  <Line type="monotone" dataKey="cost" stroke={COLORS[2]} strokeWidth={2} />
                </LineChart>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Manufacturer Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={250} data={mfgChart}>
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
            <Card className="ahl-insight"><CardHeader><CardTitle>AYUSH Regulatory Framework</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Ministry of AYUSH regulates Ayurveda, Yoga, Unani, Siddha, and Homeopathy products under the Drugs and Cosmetics Act. AYUSH manufacturing licenses require GMP certification per IS 15944, with 8,500+ licensed Ayurvedic manufacturers across India generating ₹70,000 crore annual revenue.</p></CardContent></Card>
            <Card className="ahl-insight"><CardHeader><CardTitle>Herbal Raw Material Sourcing</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">India exports 400+ medicinal plant species to 150+ countries. Major sourcing hubs include Arunachal Pradesh for taxol, Rajasthan for ashwagandha, and Kerala for turmeric. NMPB (National Medicinal Plants Board) promotes cultivation of 30 priority species covering 200,000 hectares.</p></CardContent></Card>
            <Card className="ahl-insight"><CardHeader><CardTitle>Ashwagandha Export Surge</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">India accounts for 95% of global ashwagandha supply with exports growing 28% YoY to reach $45 million. US FDA GRAS classification and EU Novel Food approval opened premium markets. KSM66 root extract from Rajasthan commands 4x price premium over raw powder.</p></CardContent></Card>
            <Card className="ahl-insight"><CardHeader><CardTitle>AI Herb Quality Verification</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">NIR spectroscopy and HPLC-based AI models verify herb authenticity and heavy metal contamination in real-time. Blockchain-traced herb supply chains from farmer to factory ensure zero adulteration with 99.7% accuracy, replacing manual organoleptic testing that had 15% error rates.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
