import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#ca8a04', '#a16207', '#eab308', '#facc15', '#fde047', '#713f12', '#422006', '#fefce8']
const PRODUCTS = ['Gold Bar 24K', 'Silver Bar 999', 'Diamond Solitaire', 'Polished Emerald', 'Ruby Burmese', 'South Sea Pearl', 'Platinum 950', 'Kundan Polki Set']
const DEALERS = ['Mumbai Zaveri Bazaar', 'Delhi Dariba Kalan', 'Jaipur Johari Bazaar', 'Chennai T Nagar', 'Kolkata Bowbazar', 'Surat Diamond Hub', 'Thrissur Gold Market', 'Coimbatore Jewellery']
const STATUSES = ['BIS Hallmarked', 'KDM Certified', 'In Transit Armed', 'Vault Stored', 'Pending GST 3%', 'Awaiting Assay']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="gjs-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="gjs-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="gjs-costbar w-full bg-yellow-100 rounded h-2"><div className="bg-yellow-600 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="gjs-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#ca8a04" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="gjs-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="gjs-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['grams', 'pieces', 'carats', 'sets']
  return {
    id: `GJS-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], dealer: DEALERS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(5, 500, 20 + idx * 11), unit: units[idx % 4],
    cost: ri(50000, 5000000, 150000 + idx * 145000), date: `2025-01-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const handRecords = [
  { id: 'GJS-0001', product: 'Gold Bar 24K', dealer: 'Mumbai Zaveri Bazaar', status: 'In Transit Armed', qty: 500, unit: 'grams', cost: 2850000, date: '2025-01-04' },
  { id: 'GJS-0002', product: 'Silver Bar 999', dealer: 'Delhi Dariba Kalan', status: 'Vault Stored', qty: 2500, unit: 'grams', cost: 187500, date: '2025-01-06' },
  { id: 'GJS-0003', product: 'Diamond Solitaire', dealer: 'Surat Diamond Hub', status: 'BIS Hallmarked', qty: 12, unit: 'carats', cost: 2400000, date: '2025-01-08' },
  { id: 'GJS-0004', product: 'Polished Emerald', dealer: 'Jaipur Johari Bazaar', status: 'Awaiting Assay', qty: 8, unit: 'pieces', cost: 960000, date: '2025-01-10' },
  { id: 'GJS-0005', product: 'Ruby Burmese', dealer: 'Kolkata Bowbazar', status: 'KDM Certified', qty: 15, unit: 'carats', cost: 2250000, date: '2025-01-11' },
  { id: 'GJS-0006', product: 'South Sea Pearl', dealer: 'Chennai T Nagar', status: 'Pending GST 3%', qty: 200, unit: 'pieces', cost: 600000, date: '2025-01-13' },
  { id: 'GJS-0007', product: 'Platinum 950', dealer: 'Mumbai Zaveri Bazaar', status: 'In Transit Armed', qty: 100, unit: 'grams', cost: 350000, date: '2025-01-14' },
  { id: 'GJS-0008', product: 'Kundan Polki Set', dealer: 'Jaipur Johari Bazaar', status: 'Vault Stored', qty: 35, unit: 'sets', cost: 1750000, date: '2025-01-16' },
  { id: 'GJS-0009', product: 'Gold Bar 24K', dealer: 'Thrissur Gold Market', status: 'BIS Hallmarked', qty: 1000, unit: 'grams', cost: 5700000, date: '2025-01-17' },
  { id: 'GJS-0010', product: 'Silver Bar 999', dealer: 'Coimbatore Jewellery', status: 'Awaiting Assay', qty: 4000, unit: 'grams', cost: 300000, date: '2025-01-18' },
  { id: 'GJS-0011', product: 'Diamond Solitaire', dealer: 'Mumbai Zaveri Bazaar', status: 'In Transit Armed', qty: 25, unit: 'carats', cost: 5000000, date: '2025-01-19' },
  { id: 'GJS-0012', product: 'Polished Emerald', dealer: 'Surat Diamond Hub', status: 'Pending GST 3%', qty: 20, unit: 'pieces', cost: 2400000, date: '2025-01-20' },
  { id: 'GJS-0013', product: 'Ruby Burmese', dealer: 'Delhi Dariba Kalan', status: 'KDM Certified', qty: 10, unit: 'carats', cost: 1500000, date: '2025-01-21' },
  { id: 'GJS-0014', product: 'South Sea Pearl', dealer: 'Kolkata Bowbazar', status: 'Vault Stored', qty: 150, unit: 'pieces', cost: 450000, date: '2025-01-22' },
  { id: 'GJS-0015', product: 'Platinum 950', dealer: 'Chennai T Nagar', status: 'BIS Hallmarked', qty: 200, unit: 'grams', cost: 700000, date: '2025-01-23' },
  { id: 'GJS-0016', product: 'Kundan Polki Set', dealer: 'Jaipur Johari Bazaar', status: 'In Transit Armed', qty: 50, unit: 'sets', cost: 2500000, date: '2025-01-24' },
  { id: 'GJS-0017', product: 'Gold Bar 24K', dealer: 'Thrissur Gold Market', status: 'Pending GST 3%', qty: 750, unit: 'grams', cost: 4275000, date: '2025-01-25' },
  { id: 'GJS-0018', product: 'Silver Bar 999', dealer: 'Mumbai Zaveri Bazaar', status: 'Awaiting Assay', qty: 3000, unit: 'grams', cost: 225000, date: '2025-01-26' },
  { id: 'GJS-0019', product: 'Diamond Solitaire', dealer: 'Surat Diamond Hub', status: 'KDM Certified', qty: 18, unit: 'carats', cost: 3600000, date: '2025-01-27' },
  { id: 'GJS-0020', product: 'Polished Emerald', dealer: 'Delhi Dariba Kalan', status: 'Vault Stored', qty: 6, unit: 'pieces', cost: 720000, date: '2025-01-28' },
]




export default function GemsJewellerySupplyChainView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...handRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.product.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string))
    })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'product', label: 'Product Type', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.product === p).length })) },
    { key: 'status', label: 'Status', options: STATUSES.map(s => ({ value: s, label: s, count: allRecords.filter(r => r.status === s).length })) },
  ]

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ')[0], shipments: 8 + i * 7, cost: 300000 + i * 180000 }))
  const dealerChart = DEALERS.slice(0, 6).map((d, i) => ({ name: d.split(' ').slice(0, 2).join(' '), volume: 50 + i * 40, revenue: 25 + i * 8 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 12 + i * 5 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="gjs-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Supply Chain' }, { label: 'Gems & Jewellery' }]} />
      <PageHeader title="Gems & Jewellery Supply Chain" description="Track precious metals, gemstones and jewellery logistics across India" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-yellow-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="💎" label="Total Shipments" value={String(allRecords.length)} />
            <KpiTile icon="🏪" label="Active Dealers" value={String(DEALERS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 10000000).toFixed(2)}Cr`} />
            <KpiTile icon="📈" label="Avg Cost" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="gjs-health-grid">
            <CardHeader><CardTitle>Operational Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={94} label="Security" />
                <HealthRing value={97} label="Purity" />
                <HealthRing value={88} label="Vault" />
                <HealthRing value={99} label="Compliance" />
                <HealthRing value={76} label="Transit" />
                <HealthRing value={91} label="Appraisal" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Gold Transited" value="4.2 kg" />
            <ValueTile label="Diamonds Cut" value="72 carats" />
            <ValueTile label="Pending GST 3%" value="₹18.5L" />
            <ValueTile label="BIS Hallmarked" value="48 Lots" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filteredRecords.length} onRefresh={() => {}} placeholder="Search by ID, product, dealer, or lot..." />

          <Card className="gjs-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-yellow-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-left">Dealer</th>
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
                      <td className="p-3 text-xs">{r.dealer}</td>
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
              <CardHeader><CardTitle>Dealer Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={250} data={dealerChart}>
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
            <Card className="gjs-insight"><CardHeader><CardTitle>BIS Hallmarking Mandatory</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">BIS hallmarking is mandatory for gold jewellery since June 2021 under Hallmarking of Gold Jewellery Order 2020. Hallmarking centres are BIS-recognized and assay purity against IS 1417 grades across 22K, 18K, and 14K.</p></CardContent></Card>
            <Card className="gjs-insight"><CardHeader><CardTitle>IS 1417 Gold Purity Standards</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">BIS IS 1417 defines gold purity grades: 24K (99.9%), 22K (91.6%), 18K (75%), 14K (58.3%). Each hallmarked piece carries a BIS logo, purity mark, assay centre mark, and year of marking for consumer protection.</p></CardContent></Card>
            <Card className="gjs-insight"><CardHeader><CardTitle>Surat Diamond Laser Grading</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Surat Diamond Bourse handles 90% of world diamond cutting. Laser-inscribed grading with GIA-style 4C assessment ensures traceability from rough to polished. KP (Kimberley Process) compliance mandatory for conflict-free certification.</p></CardContent></Card>
            <Card className="gjs-insight"><CardHeader><CardTitle>AI Jewellery Appraisal</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Automated gemstone identification using spectroscopy and AI vision achieves 98% accuracy in ruby-emerald-sapphire classification. Real-time market price integration ensures fair valuation for insurance and trade across Indian bazaars.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
