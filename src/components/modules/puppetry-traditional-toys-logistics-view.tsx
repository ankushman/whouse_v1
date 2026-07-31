import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#3b0764', '#4c1d95', '#5b21b6', '#6d28d9', '#7c3aed', '#2e1065', '#3730a3', '#ede9fe']
const PRODUCTS = ['Rajasthani Katputli Puppet', 'Channapatna Wooden Toy', 'Thanjavur Dancing Doll', 'Benaras Wooden Toy Set', 'Nimmu Kite Assorted Pack', 'Ganjifa Playing Cards', 'Assamese Bihu Doll', 'Kondapalli Bommalu Toy']
const MANUFACTURERS = ['Jodhpur Puppet Cluster RJ', 'Channapatna Toys KA', 'Thanjavur Artisans TN', 'Varanasi Lacquer UP', 'Ahmedabad Kite Guild GJ', 'Sawantwadi Crafts MH', 'Guwahati Doll Makers AS', 'Kondapalli Toys AP']
const STATUSES = ['GI Toy Certified', 'IS 9873 Toy Safety', 'Poly Bubble Wrap', 'Corrugated Box Transit', 'Rack Dry Store', 'Paint Lead QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="ptt-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="ptt-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-violet-100 text-violet-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="ptt-costbar w-full bg-violet-100 rounded h-2"><div className="bg-violet-700 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="ptt-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#3b0764" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="ptt-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="ptt-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['sets', 'pieces', 'packs', 'units']
  return {
    id: `PTT-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], manufacturer: MANUFACTURERS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(25, 2000, 50 + idx * 55), unit: units[idx % 4],
    cost: ri(3000, 120000, 5000 + idx * 4200), date: `2025-07-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const toyRecords = [
  { id: 'PTT-0001', product: 'Rajasthani Katputli Puppet', manufacturer: 'Jodhpur Puppet Cluster RJ', status: 'GI Toy Certified', qty: 500, unit: 'pieces', cost: 15000, date: '2025-07-02' },
  { id: 'PTT-0002', product: 'Channapatna Wooden Toy', manufacturer: 'Channapatna Toys KA', status: 'IS 9873 Toy Safety', qty: 800, unit: 'sets', cost: 24000, date: '2025-07-03' },
  { id: 'PTT-0003', product: 'Thanjavur Dancing Doll', manufacturer: 'Thanjavur Artisans TN', status: 'Poly Bubble Wrap', qty: 200, unit: 'pieces', cost: 48000, date: '2025-07-05' },
  { id: 'PTT-0004', product: 'Benaras Wooden Toy Set', manufacturer: 'Varanasi Lacquer UP', status: 'Corrugated Box Transit', qty: 350, unit: 'sets', cost: 18200, date: '2025-07-06' },
  { id: 'PTT-0005', product: 'Nimmu Kite Assorted Pack', manufacturer: 'Ahmedabad Kite Guild GJ', status: 'Rack Dry Store', qty: 3000, unit: 'packs', cost: 9000, date: '2025-07-08' },
  { id: 'PTT-0006', product: 'Ganjifa Playing Cards', manufacturer: 'Sawantwadi Crafts MH', status: 'Paint Lead QC', qty: 150, unit: 'sets', cost: 36000, date: '2025-07-10' },
  { id: 'PTT-0007', product: 'Assamese Bihu Doll', manufacturer: 'Guwahati Doll Makers AS', status: 'GI Toy Certified', qty: 250, unit: 'pieces', cost: 12000, date: '2025-07-11' },
  { id: 'PTT-0008', product: 'Kondapalli Bommalu Toy', manufacturer: 'Kondapalli Toys AP', status: 'IS 9873 Toy Safety', qty: 400, unit: 'units', cost: 20000, date: '2025-07-12' },
  { id: 'PTT-0009', product: 'Rajasthani Katputli Puppet', manufacturer: 'Jodhpur Puppet Cluster RJ', status: 'Poly Bubble Wrap', qty: 480, unit: 'pieces', cost: 14400, date: '2025-07-13' },
  { id: 'PTT-0010', product: 'Channapatna Wooden Toy', manufacturer: 'Channapatna Toys KA', status: 'Corrugated Box Transit', qty: 750, unit: 'sets', cost: 22500, date: '2025-07-14' },
  { id: 'PTT-0011', product: 'Thanjavur Dancing Doll', manufacturer: 'Thanjavur Artisans TN', status: 'Rack Dry Store', qty: 190, unit: 'pieces', cost: 45600, date: '2025-07-15' },
  { id: 'PTT-0012', product: 'Benaras Wooden Toy Set', manufacturer: 'Varanasi Lacquer UP', status: 'Paint Lead QC', qty: 330, unit: 'sets', cost: 17200, date: '2025-07-16' },
  { id: 'PTT-0013', product: 'Nimmu Kite Assorted Pack', manufacturer: 'Ahmedabad Kite Guild GJ', status: 'GI Toy Certified', qty: 2800, unit: 'packs', cost: 8400, date: '2025-07-17' },
  { id: 'PTT-0014', product: 'Ganjifa Playing Cards', manufacturer: 'Sawantwadi Crafts MH', status: 'IS 9873 Toy Safety', qty: 140, unit: 'sets', cost: 33600, date: '2025-07-18' },
  { id: 'PTT-0015', product: 'Assamese Bihu Doll', manufacturer: 'Guwahati Doll Makers AS', status: 'Poly Bubble Wrap', qty: 230, unit: 'pieces', cost: 11040, date: '2025-07-19' },
  { id: 'PTT-0016', product: 'Kondapalli Bommalu Toy', manufacturer: 'Kondapalli Toys AP', status: 'Corrugated Box Transit', qty: 380, unit: 'units', cost: 19000, date: '2025-07-20' },
  { id: 'PTT-0017', product: 'Rajasthani Katputli Puppet', manufacturer: 'Jodhpur Puppet Cluster RJ', status: 'Rack Dry Store', qty: 460, unit: 'pieces', cost: 13800, date: '2025-07-21' },
  { id: 'PTT-0018', product: 'Channapatna Wooden Toy', manufacturer: 'Channapatna Toys KA', status: 'Paint Lead QC', qty: 700, unit: 'sets', cost: 21000, date: '2025-07-22' },
  { id: 'PTT-0019', product: 'Thanjavur Dancing Doll', manufacturer: 'Thanjavur Artisans TN', status: 'GI Toy Certified', qty: 180, unit: 'pieces', cost: 43200, date: '2025-07-23' },
  { id: 'PTT-0020', product: 'Benaras Wooden Toy Set', manufacturer: 'Varanasi Lacquer UP', status: 'IS 9873 Toy Safety', qty: 310, unit: 'sets', cost: 16100, date: '2025-07-24' },
]


export default function PuppetryTraditionalToysLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...toyRecords, ...genRecords(21), ...genRecords(41)]

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

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 20 + i * 8, cost: 30000 + i * 12000 }))
  const mfgChart = MANUFACTURERS.slice(0, 6).map((m, i) => ({ name: m.split(' ').slice(0, 2).join(' '), volume: 150 + i * 90, revenue: 10 + i * 4 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 9 + i * 3 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="ptt-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Puppetry & Traditional Toys' }]} />
      <PageHeader title="Puppetry & Traditional Toys Logistics" description="Monitor Rajasthani katputli puppets, Channapatna lacquer toys, Thanjavur dancing dolls, traditional kite crafts, and heritage toy products from India's folk art clusters to domestic and export markets" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-violet-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🧸" label="Total Shipments" value={String(allRecords.length)} />
            <KpiTile icon="🏭" label="Artisan Clusters" value={String(MANUFACTURERS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile icon="📈" label="Avg Cost" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="ptt-health-grid">
            <CardHeader><CardTitle>Operational Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={84} label="GI Toy" />
                <HealthRing value={78} label="IS 9873" />
                <HealthRing value={90} label="Bubble" />
                <HealthRing value={82} label="Box Ship" />
                <HealthRing value={88} label="Dry Store" />
                <HealthRing value={73} label="Lead QC" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Jodhpur Stock" value="1,440 pcs" />
            <ValueTile label="QC Passed" value="28 Lots" />
            <ValueTile label="Festival SKUs" value="96 Types" />
            <ValueTile label="Export Ready" value="62%" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filteredRecords.length} onRefresh={() => {}} placeholder="Search by ID, product, cluster, or lot..." />

          <Card className="ptt-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-violet-50">
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
                    <tr key={r.id} className="border-b hover:bg-violet-50/50">
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
            <Card className="ptt-insight"><CardHeader><CardTitle>Rajasthani Katputli String Puppetry</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Rajasthan's katputli (string puppet) tradition dates back 1,000 years with mentions in the 2nd century BC Patanjali text. Jodhpur, Jaipur, and Bikaner host 25,000 puppeteer families producing 15 lakh puppets annually worth ₹45 crore. The craft uses mango wood heads, cotton-stuffed bodies, and hand-painted Rajasthani costumes. UNESCO inscribed Rajasthani puppetry on the Intangible Cultural Heritage list in 2010. Modern logistics require anti-crush packaging for painted wooden heads and tangle-free cord management for string mechanisms during transit to export markets in Europe and Japan.</p></CardContent></Card>
            <Card className="ptt-insight"><CardHeader><CardTitle>Channapatna, Thanjavur & Kondapalli Traditions</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Channapatna in Karnataka produces lacquerware toys from Hale wood with EN-71 compliant vegetable-dye finishes under GI registration since 2005, employing 6,000 artisans. Thanjavur dancing dolls (thalaiyatti bommai) are 300-year-old bobbing-head roly-poly toys made from papier-mache and terracotta, GI-tagged in 2018. Kondapalli Bommalu in Andhra Pradesh uses Tella Poniki wood with natural mineral dyes. Together these three clusters generate ₹180 crore annually, with 40% exported. IS 9873 toy safety certification is mandatory for all children's toys since 2021 BIS regulation.</p></CardContent></Card>
            <Card className="ptt-insight"><CardHeader><CardTitle>IS 9873 Toy Safety & Lead Paint QC</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">BIS IS 9873 mandates maximum 90 ppm soluble lead in toy surface coatings, aligned with EU EN-71 Part 3 and US CPSIA standards. Post-2021 regulation requires mandatory BIS certification mark (ISI mark) on all toys sold in India. X-ray fluorescence (XRF) spectrometry tests detect lead and cadmium in painted toy surfaces within 60 seconds per sample. Non-compliant toy shipments face CBIC customs seizure at ports. Traditional toy clusters have transitioned to lead-free azo-dye formulations costing ₹120-180 per kg versus ₹60 for lead-based paints, reducing artisan margins by 15%.</p></CardContent></Card>
            <Card className="ptt-insight"><CardHeader><CardTitle>AI Defect Detection & Festival Demand</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Computer vision inspection detects paint chips, loose joints, and dimensional defects in wooden toys at 200 units per minute with 96.5% accuracy. AI demand forecasting for Diwali and Navratri festival toy sales achieves 82% precision using 3-year historical data and social media sentiment analysis. Smart warehouse IoT sensors monitor temperature and humidity in toy storage zones to prevent wood warping and colour fading. India's toy industry has grown 250% from ₹2,500 crore (2019) to ₹8,750 crore (2025) after mandatory BIS certification drove out cheap imports from 60% to 30% market share.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
