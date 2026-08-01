import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#b45309', '#d97706', '#f59e0b', '#fbbf24', '#fcd34d', '#92400e', '#78350f', '#fef3c7']
const PRODUCTS = ['Kashmir Mogra Grade I', 'Pampore Super Negin', 'Kishtwar Organic Saffron', 'Budgam Saffron Extract Liquid', 'Saffron Infused Honey', 'Saffron Kumkum Powder', 'Saffron Tea Blend', 'Saffron Face Serum']
const FARMERS = ['Pampore Saffron Growers', 'Kishtwar Highland Farms', 'Budgam Kesar Cooperative', 'Srinagar Spice House', 'Pulwama Organic Saffron', 'Anantnag Farm Direct', 'Shopian Highland Estate', 'Kulgam Saffron Fields']
const STATUSES = ['GI Kashmir Saffron', 'ISO 3632 Grade I', 'Moisture-Sealed Pouch', 'Temperature Transit', 'Dehumid Vault 15-20C', 'Crocin Content QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="skp-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="skp-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="skp-costbar w-full bg-amber-100 rounded h-2"><div className="bg-amber-700 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="skp-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#b45309" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="skp-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="skp-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['kg', 'packs', 'units', 'boxes']
  return {
    id: `SKP-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], farmer: FARMERS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(1, 100, 2 + idx * 3), unit: units[idx % 4],
    cost: ri(50000, 5000000, 80000 + idx * 125000), date: `2025-07-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const saffronRecords = [
  { id: 'SKP-0001', product: 'Kashmir Mogra Grade I', farmer: 'Pampore Saffron Growers', status: 'GI Kashmir Saffron', qty: 5, unit: 'kg', cost: 750000, date: '2025-07-02' },
  { id: 'SKP-0002', product: 'Pampore Super Negin', farmer: 'Kishtwar Highland Farms', status: 'ISO 3632 Grade I', qty: 3, unit: 'kg', cost: 540000, date: '2025-07-04' },
  { id: 'SKP-0003', product: 'Kishtwar Organic Saffron', farmer: 'Budgam Kesar Cooperative', status: 'Moisture-Sealed Pouch', qty: 8, unit: 'packs', cost: 960000, date: '2025-07-05' },
  { id: 'SKP-0004', product: 'Budgam Saffron Extract Liquid', farmer: 'Srinagar Spice House', status: 'Temperature Transit', qty: 25, unit: 'units', cost: 375000, date: '2025-07-07' },
  { id: 'SKP-0005', product: 'Saffron Infused Honey', farmer: 'Pulwama Organic Saffron', status: 'Dehumid Vault 15-20C', qty: 40, unit: 'boxes', cost: 320000, date: '2025-07-08' },
  { id: 'SKP-0006', product: 'Saffron Kumkum Powder', farmer: 'Anantnag Farm Direct', status: 'Crocin Content QC', qty: 15, unit: 'packs', cost: 225000, date: '2025-07-10' },
  { id: 'SKP-0007', product: 'Saffron Tea Blend', farmer: 'Shopian Highland Estate', status: 'GI Kashmir Saffron', qty: 60, unit: 'units', cost: 180000, date: '2025-07-11' },
  { id: 'SKP-0008', product: 'Saffron Face Serum', farmer: 'Kulgam Saffron Fields', status: 'ISO 3632 Grade I', qty: 35, unit: 'boxes', cost: 490000, date: '2025-07-13' },
  { id: 'SKP-0009', product: 'Kashmir Mogra Grade I', farmer: 'Pampore Saffron Growers', status: 'Moisture-Sealed Pouch', qty: 4, unit: 'kg', cost: 600000, date: '2025-07-14' },
  { id: 'SKP-0010', product: 'Pampore Super Negin', farmer: 'Kishtwar Highland Farms', status: 'Temperature Transit', qty: 2, unit: 'kg', cost: 360000, date: '2025-07-15' },
  { id: 'SKP-0011', product: 'Kishtwar Organic Saffron', farmer: 'Budgam Kesar Cooperative', status: 'Dehumid Vault 15-20C', qty: 7, unit: 'packs', cost: 840000, date: '2025-07-16' },
  { id: 'SKP-0012', product: 'Budgam Saffron Extract Liquid', farmer: 'Srinagar Spice House', status: 'Crocin Content QC', qty: 20, unit: 'units', cost: 300000, date: '2025-07-17' },
  { id: 'SKP-0013', product: 'Saffron Infused Honey', farmer: 'Pulwama Organic Saffron', status: 'GI Kashmir Saffron', qty: 35, unit: 'boxes', cost: 280000, date: '2025-07-18' },
  { id: 'SKP-0014', product: 'Saffron Kumkum Powder', farmer: 'Anantnag Farm Direct', status: 'ISO 3632 Grade I', qty: 12, unit: 'packs', cost: 180000, date: '2025-07-19' },
  { id: 'SKP-0015', product: 'Saffron Tea Blend', farmer: 'Shopian Highland Estate', status: 'Moisture-Sealed Pouch', qty: 50, unit: 'units', cost: 150000, date: '2025-07-20' },
  { id: 'SKP-0016', product: 'Saffron Face Serum', farmer: 'Kulgam Saffron Fields', status: 'Temperature Transit', qty: 30, unit: 'boxes', cost: 420000, date: '2025-07-21' },
  { id: 'SKP-0017', product: 'Kashmir Mogra Grade I', farmer: 'Pampore Saffron Growers', status: 'Dehumid Vault 15-20C', qty: 6, unit: 'kg', cost: 900000, date: '2025-07-22' },
  { id: 'SKP-0018', product: 'Pampore Super Negin', farmer: 'Kishtwar Highland Farms', status: 'Crocin Content QC', qty: 2, unit: 'kg', cost: 380000, date: '2025-07-23' },
  { id: 'SKP-0019', product: 'Kishtwar Organic Saffron', farmer: 'Budgam Kesar Cooperative', status: 'GI Kashmir Saffron', qty: 9, unit: 'packs', cost: 1080000, date: '2025-07-24' },
  { id: 'SKP-0020', product: 'Budgam Saffron Extract Liquid', farmer: 'Srinagar Spice House', status: 'ISO 3632 Grade I', qty: 22, unit: 'units', cost: 330000, date: '2025-07-25' },
]

export default function SaffronKesarProcessingLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...saffronRecords, ...genRecords(21), ...genRecords(41)]

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

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 5 + i * 3, cost: 200000 + i * 180000 }))
  const farmerChart = FARMERS.slice(0, 6).map((f, i) => ({ name: f.split(' ').slice(0, 2).join(' '), volume: 10 + i * 8, revenue: 8 + i * 5 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 7 + i * 4 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="skp-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Saffron & Kesar Processing' }]} />
      <PageHeader title="Saffron Kesar Processing Logistics" description="Track premium Kashmir saffron (kesar) from Pampore and Kishtwar fields through stigma separation, drying, ISO 3632 grading, and secure vault storage to domestic luxury spice and export markets" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-amber-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🌸" label="Total Batches" value={String(allRecords.length)} />
            <KpiTile icon="🏔" label="Farm Clusters" value={String(FARMERS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 10000000).toFixed(2)}Cr`} />
            <KpiTile icon="📈" label="Avg Cost" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="skp-health-grid">
            <CardHeader><CardTitle>Quality Compliance</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={95} label="GI Tag" />
                <HealthRing value={91} label="ISO 3632" />
                <HealthRing value={87} label="Sealed" />
                <HealthRing value={82} label="Transit" />
                <HealthRing value={96} label="Vault" />
                <HealthRing value={89} label="Crocin" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Pampore Area" value="3,500 ha" />
            <ValueTile label="Annual Yield" value="15 Tonnes" />
            <ValueTile label="Export Markets" value="45 Countries" />
            <ValueTile label="Crocin Avg" value="230+" />
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
            placeholder="Search by batch ID, product, or farm..."
          />

          <Card className="skp-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-amber-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-left">Farm</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Cost</th>
                    <th className="p-3 text-left">Cost Bar</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.slice(0, 15).map(r => (
                    <tr key={r.id} className="border-b hover:bg-amber-50/50">
                      <td className="p-3 font-mono text-xs">{r.id}</td>
                      <td className="p-3"><ProductBadge name={r.product} /></td>
                      <td className="p-3 text-xs">{r.farmer}</td>
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
              <CardHeader><CardTitle>Farm Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={250} data={farmerChart}>
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
            <Card className="skp-insight"><CardHeader><CardTitle>Kashmir — World's Finest Saffron Heritage</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Kashmir Valley produces India's entire saffron crop (~15 tonnes/year) from 3,500 hectares in Pampore, Kishtwar, and Budgam. Iran dominates global production at 430 tonnes, but Kashmir saffron commands 3-5x premium due to higher crocin (230+ vs 180), safranal (40+ vs 30), and picrocrocin content. GI-tagged Kashmir Saffron was registered in 2020 under the Geographical Indications Act. India imports 30 tonnes despite producing only 15 tonnes annually, creating a Rs 1,200 crore trade gap that domestic growers are working to close through organic expansion and yield improvement programmes.</p></CardContent></Card>
            <Card className="skp-insight"><CardHeader><CardTitle>ISO 3632 Saffron Grading &amp; Quality Standards</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">ISO 3632 grades saffron by crocin (colour strength), safranal (aroma intensity), and picrocrocin (bitterness). Grade I requires crocin 220 or above, safranal 40 or above, moisture below 10%, floral waste below 5%, and foreign matter below 0.5%. NMR spectroscopy detects adulteration with tartrazine, corn silk, or safflower. Each flower yields only 3 stigmas weighing 0.03g, requiring 150,000-200,000 flowers for 1 kg of finished saffron. Shelf life is 2-3 years in sealed dark containers stored at 15-20 degrees Celsius with humidity below 40%. UV-Vis spectrophotometry is the standard lab method for crocin analysis, with absorbance measured at 440 nm wavelength providing reliable quantitative assessment of colouring strength.</p></CardContent></Card>
            <Card className="skp-insight"><CardHeader><CardTitle>Saffron Storage &amp; Temperature-Controlled Logistics</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Saffron requires storage at 15-20 degrees Celsius and below 40% humidity. Light and oxygen exposure cause rapid crocin degradation, losing 15-20% potency per month in open air. Nitrogen-flushed aluminium foil pouches extend shelf life to 5 years. From Kashmir to Delhi (870 km), transport requires 18-24 hours in insulated refrigerated vans maintaining 10-15 degrees. India's saffron is primarily sold loose in unbranded packets, reducing brand value significantly. Only 12% of Kashmir saffron reaches export-grade packaging standards. APEDA provides export subsidies under the Agriculture Export Policy, supporting cold chain infrastructure investment of Rs 200 crore across Jammu and Kashmir for saffron-specific storage and transport facilities.</p></CardContent></Card>
            <Card className="skp-insight"><CardHeader><CardTitle>AI Quality Testing &amp; Saffron Export Potential</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">AI-powered spectrophotometry tests crocin content in 90 seconds versus 4 hours for traditional lab methods, enabling real-time quality certification at farm gates. Blockchain traceability tracks each batch from field to consumer, combating Rs 800 crore annual saffron fraud in India where 40% of retail saffron is adulterated. India's saffron export value grew 180% from Rs 85 crore (2019) to Rs 238 crore (2025), targeting Rs 500 crore by 2028. Persian Gulf, EU, and US are primary export markets with retail pricing of $8-15 per gram. The National Mission on Saffron has distributed 1.5 lakh corms to farmers, while AI yield prediction using satellite NDVI data achieves 85% accuracy for bloom timing forecasts.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
