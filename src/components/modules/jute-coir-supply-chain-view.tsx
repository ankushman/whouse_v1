import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#365314', '#3f6212', '#4d7c0f', '#65a30d', '#84cc16', '#1a2e05', '#4338ca', '#f7fee7']
const PRODUCTS = ['Gunny Bags HS 5301', 'Jute Hessian Cloth', 'Jute Twine 3-Ply', 'Coir Mattress Fibre', 'Coir Pith Blocks', 'Jute Carpet Backing', 'Coir Geo-Textiles', 'Jute Shopping Bags']
const MANUFACTURERS = ['Hooghly Jute Mill Kolkata', 'Naihati Jute Co Ltd', 'Alexandra Jute Mill', 'Budge Budge Jute Works', 'National Jute Mfg Corp', 'Kerala Coir Federation', 'Alleppey Coir Industries', 'Pollachi Coir Cluster']
const STATUSES = ['Jute Commissioner', 'IS 1729 Certified', 'In Transit Rail', 'Yard Stored', 'Pending Jute PMU', 'Awaiting Export QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="jcs-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="jcs-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="jcs-costbar w-full bg-green-100 rounded h-2"><div className="bg-green-600 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="jcs-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#365314" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="jcs-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="jcs-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['bales', 'tons', 'rolls', 'bags']
  return {
    id: `JCS-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], manufacturer: MANUFACTURERS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(20, 3000, 100 + idx * 62), unit: units[idx % 4],
    cost: ri(5000, 280000, 10000 + idx * 5800), date: `2025-03-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const juteRecords = [
  { id: 'JCS-0001', product: 'Gunny Bags HS 5301', manufacturer: 'Hooghly Jute Mill Kolkata', status: 'Jute Commissioner', qty: 1200, unit: 'bales', cost: 96000, date: '2025-03-04' },
  { id: 'JCS-0002', product: 'Jute Hessian Cloth', manufacturer: 'Naihati Jute Co Ltd', status: 'IS 1729 Certified', qty: 800, unit: 'rolls', cost: 64000, date: '2025-03-06' },
  { id: 'JCS-0003', product: 'Jute Twine 3-Ply', manufacturer: 'Alexandra Jute Mill', status: 'In Transit Rail', qty: 2000, unit: 'bales', cost: 100000, date: '2025-03-08' },
  { id: 'JCS-0004', product: 'Coir Mattress Fibre', manufacturer: 'Kerala Coir Federation', status: 'Yard Stored', qty: 500, unit: 'tons', cost: 125000, date: '2025-03-10' },
  { id: 'JCS-0005', product: 'Coir Pith Blocks', manufacturer: 'Alleppey Coir Industries', status: 'Pending Jute PMU', qty: 1500, unit: 'bags', cost: 75000, date: '2025-03-11' },
  { id: 'JCS-0006', product: 'Jute Carpet Backing', manufacturer: 'Budge Budge Jute Works', status: 'Awaiting Export QC', qty: 600, unit: 'rolls', cost: 180000, date: '2025-03-13' },
  { id: 'JCS-0007', product: 'Coir Geo-Textiles', manufacturer: 'Pollachi Coir Cluster', status: 'IS 1729 Certified', qty: 300, unit: 'tons', cost: 210000, date: '2025-03-14' },
  { id: 'JCS-0008', product: 'Jute Shopping Bags', manufacturer: 'National Jute Mfg Corp', status: 'In Transit Rail', qty: 2500, unit: 'bags', cost: 50000, date: '2025-03-16' },
  { id: 'JCS-0009', product: 'Gunny Bags HS 5301', manufacturer: 'Hooghly Jute Mill Kolkata', status: 'Jute Commissioner', qty: 1800, unit: 'bales', cost: 144000, date: '2025-03-17' },
  { id: 'JCS-0010', product: 'Jute Hessian Cloth', manufacturer: 'Naihati Jute Co Ltd', status: 'Yard Stored', qty: 700, unit: 'rolls', cost: 56000, date: '2025-03-18' },
  { id: 'JCS-0011', product: 'Jute Twine 3-Ply', manufacturer: 'Alexandra Jute Mill', status: 'IS 1729 Certified', qty: 2200, unit: 'bales', cost: 110000, date: '2025-03-19' },
  { id: 'JCS-0012', product: 'Coir Mattress Fibre', manufacturer: 'Kerala Coir Federation', status: 'Pending Jute PMU', qty: 450, unit: 'tons', cost: 112500, date: '2025-03-20' },
  { id: 'JCS-0013', product: 'Coir Pith Blocks', manufacturer: 'Alleppey Coir Industries', status: 'In Transit Rail', qty: 1800, unit: 'bags', cost: 90000, date: '2025-03-21' },
  { id: 'JCS-0014', product: 'Jute Carpet Backing', manufacturer: 'Budge Budge Jute Works', status: 'Jute Commissioner', qty: 550, unit: 'rolls', cost: 165000, date: '2025-03-22' },
  { id: 'JCS-0015', product: 'Coir Geo-Textiles', manufacturer: 'Pollachi Coir Cluster', status: 'Awaiting Export QC', qty: 350, unit: 'tons', cost: 245000, date: '2025-03-23' },
  { id: 'JCS-0016', product: 'Jute Shopping Bags', manufacturer: 'National Jute Mfg Corp', status: 'IS 1729 Certified', qty: 3000, unit: 'bags', cost: 60000, date: '2025-03-24' },
  { id: 'JCS-0017', product: 'Gunny Bags HS 5301', manufacturer: 'Hooghly Jute Mill Kolkata', status: 'In Transit Rail', qty: 1400, unit: 'bales', cost: 112000, date: '2025-03-25' },
  { id: 'JCS-0018', product: 'Jute Hessian Cloth', manufacturer: 'Naihati Jute Co Ltd', status: 'Awaiting Export QC', qty: 650, unit: 'rolls', cost: 52000, date: '2025-03-26' },
  { id: 'JCS-0019', product: 'Jute Twine 3-Ply', manufacturer: 'Alexandra Jute Mill', status: 'Pending Jute PMU', qty: 1900, unit: 'bales', cost: 95000, date: '2025-03-27' },
  { id: 'JCS-0020', product: 'Coir Mattress Fibre', manufacturer: 'Kerala Coir Federation', status: 'Yard Stored', qty: 520, unit: 'tons', cost: 130000, date: '2025-03-28' },
]




export default function JuteCoirSupplyChainView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...juteRecords, ...genRecords(21), ...genRecords(41)]

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

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 15 + i * 6, cost: 60000 + i * 18000 }))
  const mfgChart = MANUFACTURERS.slice(0, 6).map((m, i) => ({ name: m.split(' ').slice(0, 2).join(' '), volume: 100 + i * 70, revenue: 6 + i * 3 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 10 + i * 4 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="jcs-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Jute & Coir' }]} />
      <PageHeader title="Jute & Coir Products Supply Chain" description="Track eco-friendly jute and coir product movement from mills and clusters across India" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-green-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🌾" label="Total Shipments" value={String(allRecords.length)} />
            <KpiTile icon="🏭" label="Mills & Clusters" value={String(MANUFACTURERS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile icon="📈" label="Avg Cost" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="jcs-health-grid">
            <CardHeader><CardTitle>Operational Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={78} label="Mill Output" />
                <HealthRing value={86} label="Quality IS" />
                <HealthRing value={72} label="Rail Link" />
                <HealthRing value={94} label="Export QC" />
                <HealthRing value={81} label="Eco Cert" />
                <HealthRing value={69} label="PMU Fund" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Gunny Bags Stock" value="2,800 bales" />
            <ValueTile label="Coir Export" value="380 tons" />
            <ValueTile label="Rail Wagons" value="24 Loaded" />
            <ValueTile label="IS Certified" value="42 Lots" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filteredRecords.length} onRefresh={() => {}} placeholder="Search by ID, product, mill, or lot..." />

          <Card className="jcs-table-card">
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
              <CardHeader><CardTitle>Mill Production Volume</CardTitle></CardHeader>
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
            <Card className="jcs-insight"><CardHeader><CardTitle>Jute Packaging Mandatory Act</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Jute Packaging Materials (JPM) Act 1987 mandates 100% food grain and sugar packing in jute bags through the Jute Commissioner Office in Kolkata. India produces 1.6 million tonnes of jute annually with 70% consumed domestically for government food supply chain packaging.</p></CardContent></Card>
            <Card className="jcs-insight"><CardHeader><CardTitle>Kerala Coir Export Hub</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Kerala accounts for 60% of global coir production with Alleppey as the coir capital. Coir Board India promotes export of coir pith, geo-textiles, and mattress fibre to 100+ countries. Coir geo-textiles replace synthetic alternatives in road construction and erosion control.</p></CardContent></Card>
            <Card className="jcs-insight"><CardHeader><CardTitle>IS 1729 Quality Standards</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">IS 1729 specifies grading and testing methods for jute yarn, hessian, and sacking cloth. BIS certification ensures tensile strength, moisture content, and weave density meet procurement norms for FCI, CWC, and state food procurement agencies requiring gunny bags.</p></CardContent></Card>
            <Card className="jcs-insight"><CardHeader><CardTitle>PMU Wage Modernisation</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Jute PMU (Price Modernisation Unit) under Ministry of Textiles fixes minimum wages and raw jute prices. Digital jute procurement platforms and blockchain-traced supply chains are replacing manual auction systems at 70+ jute mills in West Bengal's Hooghly belt.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
