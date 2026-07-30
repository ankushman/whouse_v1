import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#991b1b', '#b91c1c', '#dc2626', '#ef4444', '#f87171', '#7f1d1d', '#450a0a', '#fef2f2']
const PRODUCTS = ['Sparklers 12 Pack', 'Flower Pots 5 Inch', 'Rockets 100gm', 'Chakra Ground Spinner', 'Fountain 500 Shot', 'Atom Bombs 3 Pack', 'Roman Candles 10', 'Sky Shots 250gm']
const MANUFACTURERS = ['Sivakasi Pyro Works', 'Kalisyam Fireworks', 'Standard Fireworks', 'Cock Brand Sivakasi', 'Radha Cracker Industries', 'Sri Kaliswari Fireworks', 'Coronation Fireworks', 'Rajapalayam Crackers']
const STATUSES = ['PESO Licensed', 'Petroleum Act', 'In Transit Hazmat', 'Explosive Store', 'Pending Central Excise', 'Awaiting QC Blast Test']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="fwl-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="fwl-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="fwl-costbar w-full bg-red-100 rounded h-2"><div className="bg-red-600 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="fwl-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#991b1b" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="fwl-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="fwl-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['boxes', 'cartons', 'cases', 'lots']
  return {
    id: `FWL-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], manufacturer: MANUFACTURERS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(50, 5000, 200 + idx * 95), unit: units[idx % 4],
    cost: ri(8000, 350000, 15000 + idx * 6200), date: `2025-10-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const fireRecords = [
  { id: 'FWL-0001', product: 'Sparklers 12 Pack', manufacturer: 'Sivakasi Pyro Works', status: 'PESO Licensed', qty: 2000, unit: 'boxes', cost: 80000, date: '2025-10-04' },
  { id: 'FWL-0002', product: 'Flower Pots 5 Inch', manufacturer: 'Kalisyam Fireworks', status: 'In Transit Hazmat', qty: 800, unit: 'cartons', cost: 120000, date: '2025-10-06' },
  { id: 'FWL-0003', product: 'Rockets 100gm', manufacturer: 'Standard Fireworks', status: 'Petroleum Act', qty: 400, unit: 'cases', cost: 200000, date: '2025-10-08' },
  { id: 'FWL-0004', product: 'Chakra Ground Spinner', manufacturer: 'Cock Brand Sivakasi', status: 'Explosive Store', qty: 1500, unit: 'boxes', cost: 95000, date: '2025-10-10' },
  { id: 'FWL-0005', product: 'Fountain 500 Shot', manufacturer: 'Radha Cracker Industries', status: 'Pending Central Excise', qty: 600, unit: 'lots', cost: 180000, date: '2025-10-11' },
  { id: 'FWL-0006', product: 'Atom Bombs 3 Pack', manufacturer: 'Sri Kaliswari Fireworks', status: 'Awaiting QC Blast Test', qty: 3000, unit: 'boxes', cost: 150000, date: '2025-10-13' },
  { id: 'FWL-0007', product: 'Roman Candles 10', manufacturer: 'Coronation Fireworks', status: 'PESO Licensed', qty: 700, unit: 'cartons', cost: 210000, date: '2025-10-14' },
  { id: 'FWL-0008', product: 'Sky Shots 250gm', manufacturer: 'Rajapalayam Crackers', status: 'In Transit Hazmat', qty: 500, unit: 'cases', cost: 250000, date: '2025-10-16' },
  { id: 'FWL-0009', product: 'Sparklers 12 Pack', manufacturer: 'Sivakasi Pyro Works', status: 'Petroleum Act', qty: 3500, unit: 'boxes', cost: 140000, date: '2025-10-17' },
  { id: 'FWL-0010', product: 'Flower Pots 5 Inch', manufacturer: 'Kalisyam Fireworks', status: 'Explosive Store', qty: 1200, unit: 'cartons', cost: 180000, date: '2025-10-18' },
  { id: 'FWL-0011', product: 'Rockets 100gm', manufacturer: 'Standard Fireworks', status: 'PESO Licensed', qty: 350, unit: 'cases', cost: 175000, date: '2025-10-19' },
  { id: 'FWL-0012', product: 'Chakra Ground Spinner', manufacturer: 'Cock Brand Sivakasi', status: 'Awaiting QC Blast Test', qty: 1800, unit: 'boxes', cost: 108000, date: '2025-10-20' },
  { id: 'FWL-0013', product: 'Fountain 500 Shot', manufacturer: 'Radha Cracker Industries', status: 'In Transit Hazmat', qty: 550, unit: 'lots', cost: 165000, date: '2025-10-21' },
  { id: 'FWL-0014', product: 'Atom Bombs 3 Pack', manufacturer: 'Sri Kaliswari Fireworks', status: 'Pending Central Excise', qty: 4200, unit: 'boxes', cost: 210000, date: '2025-10-22' },
  { id: 'FWL-0015', product: 'Roman Candles 10', manufacturer: 'Coronation Fireworks', status: 'Petroleum Act', qty: 650, unit: 'cartons', cost: 195000, date: '2025-10-23' },
  { id: 'FWL-0016', product: 'Sky Shots 250gm', manufacturer: 'Rajapalayam Crackers', status: 'Explosive Store', qty: 450, unit: 'cases', cost: 225000, date: '2025-10-24' },
  { id: 'FWL-0017', product: 'Sparklers 12 Pack', manufacturer: 'Sivakasi Pyro Works', status: 'PESO Licensed', qty: 2800, unit: 'boxes', cost: 112000, date: '2025-10-25' },
  { id: 'FWL-0018', product: 'Flower Pots 5 Inch', manufacturer: 'Kalisyam Fireworks', status: 'Awaiting QC Blast Test', qty: 900, unit: 'cartons', cost: 135000, date: '2025-10-26' },
  { id: 'FWL-0019', product: 'Rockets 100gm', manufacturer: 'Standard Fireworks', status: 'In Transit Hazmat', qty: 500, unit: 'cases', cost: 250000, date: '2025-10-27' },
  { id: 'FWL-0020', product: 'Chakra Ground Spinner', manufacturer: 'Cock Brand Sivakasi', status: 'Petroleum Act', qty: 2200, unit: 'boxes', cost: 132000, date: '2025-10-28' },
]




export default function FireworksCrackersLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...fireRecords, ...genRecords(21), ...genRecords(41)]

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

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 12 + i * 8, cost: 80000 + i * 25000 }))
  const mfgChart = MANUFACTURERS.slice(0, 6).map((m, i) => ({ name: m.split(' ').slice(0, 2).join(' '), volume: 120 + i * 80, revenue: 8 + i * 4 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 10 + i * 5 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="fwl-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Fireworks & Crackers' }]} />
      <PageHeader title="Fireworks & Crackers Logistics" description="Track hazardous fireworks shipments from Sivakasi factories across India during festival seasons" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-red-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🧨" label="Total Shipments" value={String(allRecords.length)} />
            <KpiTile icon="🏭" label="Sivakasi Units" value={String(MANUFACTURERS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile icon="📈" label="Avg Cost" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="fwl-health-grid">
            <CardHeader><CardTitle>Operational Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={82} label="Safety" />
                <HealthRing value={74} label="Hazmat Compl." />
                <HealthRing value={91} label="Diwali Stock" />
                <HealthRing value={68} label="PESO License" />
                <HealthRing value={85} label="Storage" />
                <HealthRing value={77} label="Transport" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Sparklers Stock" value="5,100 boxes" />
            <ValueTile label="In Hazmat Transit" value="42 Lots" />
            <ValueTile label="Pending Excise" value="₹4.8L" />
            <ValueTile label="QC Passed" value="28 Batches" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filteredRecords.length} onRefresh={() => {}} placeholder="Search by ID, product, manufacturer, or lot..." />

          <Card className="fwl-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-red-50">
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
                    <tr key={r.id} className="border-b hover:bg-red-50/50">
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
              <CardHeader><CardTitle>Seasonal Shipment Trend</CardTitle></CardHeader>
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
            <Card className="fwl-insight"><CardHeader><CardTitle>Sivakasi Fireworks Capital</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Sivakasi in Tamil Nadu produces 90% of India's fireworks, employing over 300,000 workers across 800+ licensed units. The cluster generates ₹6,000 crore annual revenue with peak demand during Diwali, accounting for 70% of yearly sales in just 60 days.</p></CardContent></Card>
            <Card className="fwl-insight"><CardHeader><CardTitle>PESO Safety Regulations</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Petroleum and Explosives Safety Organisation (PESO) under Petroleum Act 1934 governs fireworks manufacturing, storage, and transport. All units require NOC from District Explosives Officer, with Class-D explosives limited to 25kg per transport vehicle.</p></CardContent></Card>
            <Card className="fwl-insight"><CardHeader><CardTitle>Green Crackers Initiative</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">CSIR-NEERI developed certified green crackers reducing particulate emissions by 30-40% with formulations using potassium nitrate instead of barium salts. Supreme Court mandates green crackers in NCR and cities with poor AQI, creating new compliance logistics chains.</p></CardContent></Card>
            <Card className="fwl-insight"><CardHeader><CardTitle>Hazmat Transport Protocol</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Fireworks transport requires ADR-certified vehicles, explosive storage magazines with 30m exclusion zones, and armed escort for Class-3 shipments. GPS-tracked convoys with real-time temperature monitoring prevent accidental ignition during India's extreme summer heat.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
