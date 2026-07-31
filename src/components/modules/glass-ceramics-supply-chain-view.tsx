import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#14532d', '#166534', '#15803d', '#16a34a', '#22c55e', '#052e16', '#0a4a20', '#f0fdf4']
const PRODUCTS = ['Soda Lime Glassware Set', 'Borosilicate Lab Beakers', 'Ceramic Dinnerware 24pc', 'Terracotta Glazed Vase', 'Pyrex Oven Dish Set', 'Bone China Tea Set', 'Stoneware Baking Bowl', 'Fused Glass Panel Art']
const MANUFACTURERS = ['Firozabad Glass UP', 'Khurja Ceramics UP', 'Jaipur Blue Pottery Rajasthan', 'Bangalore Glass House', 'Mumbai Ceramic Studio', 'Thanjavur Bronze Art TN', 'Moradabad Brass Glass UP', 'Kolkata Clay Studio WB']
const STATUSES = ['BIS IS 2829 Certified', 'Lead-Free Glaze QC', 'Fragile Foam Wrapped', 'In Transit Cushion', 'Yard Shelved', 'Thermal Shock Test']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="gcc-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="gcc-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="gcc-costbar w-full bg-green-100 rounded h-2"><div className="bg-green-700 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="gcc-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#14532d" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="gcc-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="gcc-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['sets', 'pieces', 'boxes', 'crates']
  return {
    id: `GCC-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], manufacturer: MANUFACTURERS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(50, 5000, 200 + idx * 120), unit: units[idx % 4],
    cost: ri(18000, 450000, 28000 + idx * 15000), date: `2025-07-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const glassRecords = [
  { id: 'GCC-0001', product: 'Soda Lime Glassware Set', manufacturer: 'Firozabad Glass UP', status: 'BIS IS 2829 Certified', qty: 1500, unit: 'sets', cost: 225000, date: '2025-07-02' },
  { id: 'GCC-0002', product: 'Borosilicate Lab Beakers', manufacturer: 'Khurja Ceramics UP', status: 'Lead-Free Glaze QC', qty: 3000, unit: 'pieces', cost: 180000, date: '2025-07-04' },
  { id: 'GCC-0003', product: 'Ceramic Dinnerware 24pc', manufacturer: 'Jaipur Blue Pottery Rajasthan', status: 'Fragile Foam Wrapped', qty: 600, unit: 'boxes', cost: 360000, date: '2025-07-05' },
  { id: 'GCC-0004', product: 'Terracotta Glazed Vase', manufacturer: 'Bangalore Glass House', status: 'In Transit Cushion', qty: 400, unit: 'pieces', cost: 120000, date: '2025-07-07' },
  { id: 'GCC-0005', product: 'Pyrex Oven Dish Set', manufacturer: 'Mumbai Ceramic Studio', status: 'Yard Shelved', qty: 800, unit: 'sets', cost: 200000, date: '2025-07-08' },
  { id: 'GCC-0006', product: 'Bone China Tea Set', manufacturer: 'Thanjavur Bronze Art TN', status: 'Thermal Shock Test', qty: 250, unit: 'sets', cost: 375000, date: '2025-07-10' },
  { id: 'GCC-0007', product: 'Stoneware Baking Bowl', manufacturer: 'Moradabad Brass Glass UP', status: 'BIS IS 2829 Certified', qty: 2000, unit: 'pieces', cost: 100000, date: '2025-07-11' },
  { id: 'GCC-0008', product: 'Fused Glass Panel Art', manufacturer: 'Kolkata Clay Studio WB', status: 'Lead-Free Glaze QC', qty: 100, unit: 'pieces', cost: 280000, date: '2025-07-13' },
  { id: 'GCC-0009', product: 'Soda Lime Glassware Set', manufacturer: 'Firozabad Glass UP', status: 'Fragile Foam Wrapped', qty: 1400, unit: 'sets', cost: 210000, date: '2025-07-14' },
  { id: 'GCC-0010', product: 'Borosilicate Lab Beakers', manufacturer: 'Khurja Ceramics UP', status: 'In Transit Cushion', qty: 2800, unit: 'pieces', cost: 168000, date: '2025-07-15' },
  { id: 'GCC-0011', product: 'Ceramic Dinnerware 24pc', manufacturer: 'Jaipur Blue Pottery Rajasthan', status: 'Yard Shelved', qty: 550, unit: 'boxes', cost: 330000, date: '2025-07-16' },
  { id: 'GCC-0012', product: 'Terracotta Glazed Vase', manufacturer: 'Bangalore Glass House', status: 'Thermal Shock Test', qty: 380, unit: 'pieces', cost: 114000, date: '2025-07-17' },
  { id: 'GCC-0013', product: 'Pyrex Oven Dish Set', manufacturer: 'Mumbai Ceramic Studio', status: 'BIS IS 2829 Certified', qty: 750, unit: 'sets', cost: 187500, date: '2025-07-18' },
  { id: 'GCC-0014', product: 'Bone China Tea Set', manufacturer: 'Thanjavur Bronze Art TN', status: 'Lead-Free Glaze QC', qty: 230, unit: 'sets', cost: 345000, date: '2025-07-19' },
  { id: 'GCC-0015', product: 'Stoneware Baking Bowl', manufacturer: 'Moradabad Brass Glass UP', status: 'Fragile Foam Wrapped', qty: 1800, unit: 'pieces', cost: 90000, date: '2025-07-20' },
  { id: 'GCC-0016', product: 'Fused Glass Panel Art', manufacturer: 'Kolkata Clay Studio WB', status: 'In Transit Cushion', qty: 90, unit: 'pieces', cost: 252000, date: '2025-07-21' },
  { id: 'GCC-0017', product: 'Soda Lime Glassware Set', manufacturer: 'Firozabad Glass UP', status: 'Yard Shelved', qty: 1300, unit: 'sets', cost: 195000, date: '2025-07-22' },
  { id: 'GCC-0018', product: 'Borosilicate Lab Beakers', manufacturer: 'Khurja Ceramics UP', status: 'Thermal Shock Test', qty: 2600, unit: 'pieces', cost: 156000, date: '2025-07-23' },
  { id: 'GCC-0019', product: 'Ceramic Dinnerware 24pc', manufacturer: 'Jaipur Blue Pottery Rajasthan', status: 'BIS IS 2829 Certified', qty: 500, unit: 'boxes', cost: 300000, date: '2025-07-24' },
  { id: 'GCC-0020', product: 'Terracotta Glazed Vase', manufacturer: 'Bangalore Glass House', status: 'Lead-Free Glaze QC', qty: 360, unit: 'pieces', cost: 108000, date: '2025-07-25' },
]



export default function GlassCeramicsSupplyChainView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...glassRecords, ...genRecords(21), ...genRecords(41)]

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

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 10 + i * 7, cost: 100000 + i * 30000 }))
  const mfgChart = MANUFACTURERS.slice(0, 6).map((m, i) => ({ name: m.split(' ').slice(0, 2).join(' '), volume: 130 + i * 110, revenue: 8 + i * 5 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 8 + i * 4 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="gcc-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Supply Chain' }, { label: 'Glass & Ceramics' }]} />
      <PageHeader title="Glass & Ceramics Supply Chain" description="Track glassware, ceramic dinnerware, bone china, and art glass from India's Firozabad and Khurja clusters to domestic and export markets" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-green-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🏺" label="Total Shipments" value={String(allRecords.length)} />
            <KpiTile icon="🏭" label="Manufacturing Clusters" value={String(MANUFACTURERS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 100000).toFixed(1)}L`} />
            <KpiTile icon="📈" label="Avg Cost" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="gcc-health-grid">
            <CardHeader><CardTitle>Operational Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={86} label="BIS 2829" />
                <HealthRing value={91} label="Lead-Free" />
                <HealthRing value={78} label="Foam" />
                <HealthRing value={83} label="Cushion" />
                <HealthRing value={89} label="Shelf" />
                <HealthRing value={75} label="Thermal" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Glassware Stock" value="2,900 sets" />
            <ValueTile label="Foam Wrapped" value="22 Lots" />
            <ValueTile label="BIS Certified" value="38 Batches" />
            <ValueTile label="Shelf Utilization" value="74%" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filteredRecords.length} onRefresh={() => {}} placeholder="Search by ID, product, manufacturer, or lot..." />

          <Card className="gcc-table-card">
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
            <Card className="gcc-insight"><CardHeader><CardTitle>Firozabad Glass Capital of India</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Firozabad in Uttar Pradesh produces 90% of India's glass products across 500+ units employing 1.5 lakh workers. The cluster generates ₹12,000 crore annually from glass bangles, tableware, and laboratory glassware. Soda lime glass manufacturing uses 70% recycled glass cullet, making India one of the world's highest glass recycling economies at 45% recovery rate. Natural gas-fired regenerative furnaces operate at 1,450-1,550°C continuously.</p></CardContent></Card>
            <Card className="gcc-insight"><CardHeader><CardTitle>Khurja Ceramics GI Cluster</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Khurja in Bulandshahr district is India's largest ceramics cluster with 450+ units producing ₹3,500 crore of ceramic tableware annually. BIS IS 2829 governs ceramic food-contact safety including lead and cadmium leaching limits below 0.1 mg/dm2. The GI-tagged Khurja pottery uses locally sourced red clay fired at 1,100°C in coal and gas kilns. Export markets include USA, UK, and UAE with premium pricing at 2.5x domestic rates.</p></CardContent></Card>
            <Card className="gcc-insight"><CardHeader><CardTitle>Fragile Ware Packaging Standards</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">IS 14544 mandates double-wall corrugated boxes with minimum 15mm polyethylene foam inserts for glass and ceramic shipments under 10kg. Breakage rate for properly packaged ceramic shipments is 1.2% versus 8.5% for unstandardized packaging. Vacuum-formed PET trays with individual cell compartments reduce glass-to-glass contact damage by 92%. Impact-absorbing honeycomb paper pallet inserts handle drops from 80cm without damage.</p></CardContent></Card>
            <Card className="gcc-insight"><CardHeader><CardTitle>AI Glass Defect & Thermal Analysis</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Machine learning vision systems detect glass defects including bubbles, seeds, stones, and cord marks at 99.1% accuracy using polarized light cameras at 500 frames per second. Thermal shock testing AI predicts glassware failure at -20 to 150°C temperature differential with 94% accuracy from composition analysis. Digital twin kiln simulations optimize firing curves for ceramic glazes, reducing energy consumption by 18% and defect rates by 30%.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
