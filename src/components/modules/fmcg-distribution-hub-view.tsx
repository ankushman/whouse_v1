import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#059669', '#047857', '#10b981', '#34d399', '#6ee7b7', '#065f46', '#064e3b', '#a7f3d0']

const PRODUCT_TYPES = ['Dairy Products', 'Snacks & Chips', 'Beverages', 'Personal Care', 'Household Cleaners', 'Packaged Foods', 'Baby Care', 'Confectionery']
const RETAIL_CHAINS = ['Reliance Fresh', 'DMart', 'Big Bazaar', 'Spencer\'s', 'More Supermarket', 'Vijetha', 'Star Bazaar', 'Natures Basket']
const DISTRIBUTION_STATUS = ['Allocated', 'In Transit', 'Delivered', 'Short Supply', 'Excess Stock', 'Damaged']

const products = [
  { id: 'FMG-0001', product: 'Dairy Products', description: 'Amul Taaza Toned Milk 500ml', retailer: 'Reliance Fresh', quantity: 5000, unit: 'cartons', status: 'Allocated', dc: 'Mumbai DC-West', route: 'MUM-W-Route-12', received: '2026-07-30', shelf_life_days: 7, cost_inr: 625000, temperature: '2-8°C' },
  { id: 'FMG-0002', product: 'Snacks & Chips', description: 'Lay\'s Magic Masala 90g Family Pack', retailer: 'DMart', quantity: 12000, unit: 'cartons', status: 'In Transit', dc: 'Pune DC-South', route: 'PUN-S-Route-08', received: '2026-07-30', shelf_life_days: 90, cost_inr: 1080000, temperature: 'Ambient' },
  { id: 'FMG-0003', product: 'Beverages', description: 'Coca-Cola 2L PET Bottle', retailer: 'Big Bazaar', quantity: 8000, unit: 'crates', status: 'Delivered', dc: 'Delhi DC-North', route: 'DEL-N-Route-15', received: '2026-07-29', shelf_life_days: 180, cost_inr: 1440000, temperature: 'Ambient' },
  { id: 'FMG-0004', product: 'Personal Care', description: 'Dove Cream Beauty Bar 100g', retailer: 'Spencer\'s', quantity: 3000, unit: 'cartons', status: 'Allocated', dc: 'Chennai DC-East', route: 'CHE-E-Route-06', received: '2026-07-29', shelf_life_days: 730, cost_inr: 585000, temperature: 'Ambient' },
  { id: 'FMG-0005', product: 'Household Cleaners', description: 'Lizol Floor Cleaner 1L', retailer: 'More Supermarket', quantity: 6000, unit: 'cartons', status: 'Short Supply', dc: 'Hyderabad DC-SE', route: 'HYD-SE-Route-09', received: '2026-07-28', shelf_life_days: 730, cost_inr: 720000, temperature: 'Ambient' },
  { id: 'FMG-0006', product: 'Packaged Foods', description: 'Maggi 2-Minute Noodles Family Pack', retailer: 'Vijetha', quantity: 15000, unit: 'cartons', status: 'In Transit', dc: 'Bengaluru DC-S', route: 'BLR-S-Route-11', received: '2026-07-28', shelf_life_days: 270, cost_inr: 1800000, temperature: 'Ambient' },
  { id: 'FMG-0007', product: 'Baby Care', description: 'Pampers Premium Care M Size', retailer: 'Star Bazaar', quantity: 2500, unit: 'cartons', status: 'Delivered', dc: 'Kolkata DC-East', route: 'KOL-E-Route-04', received: '2026-07-27', shelf_life_days: 1095, cost_inr: 1125000, temperature: 'Ambient' },
  { id: 'FMG-0008', product: 'Confectionery', description: 'Cadbury Dairy Milk Silk 150g', retailer: 'Natures Basket', quantity: 4000, unit: 'cartons', status: 'Excess Stock', dc: 'Mumbai DC-West', route: 'MUM-W-Route-03', received: '2026-07-27', shelf_life_days: 365, cost_inr: 960000, temperature: '18-22°C' },
  { id: 'FMG-0009', product: 'Dairy Products', description: 'Mother Dairy Mishti Doi 400g', retailer: 'Big Bazaar', quantity: 3500, unit: 'pcs', status: 'Allocated', dc: 'Delhi DC-North', route: 'DEL-N-Route-18', received: '2026-07-26', shelf_life_days: 14, cost_inr: 490000, temperature: '2-8°C' },
  { id: 'FMG-0010', product: 'Snacks & Chips', description: 'Kurkure Masala Munch 75g', retailer: 'Reliance Fresh', quantity: 18000, unit: 'cartons', status: 'Delivered', dc: 'Ahmedabad DC-West', route: 'AMD-W-Route-07', received: '2026-07-26', shelf_life_days: 90, cost_inr: 1440000, temperature: 'Ambient' },
  { id: 'FMG-0011', product: 'Beverages', description: 'Paper Boat Aamras 200ml Tetra', retailer: 'Spencer\'s', quantity: 10000, unit: 'cartons', status: 'Damaged', dc: 'Chennai DC-East', route: 'CHE-E-Route-02', received: '2026-07-25', shelf_life_days: 180, cost_inr: 350000, temperature: 'Ambient' },
  { id: 'FMG-0012', product: 'Personal Care', description: 'Colgate MaxFresh Toothpaste 150g', retailer: 'DMart', quantity: 7000, unit: 'cartons', status: 'In Transit', dc: 'Jaipur DC-North', route: 'JPR-N-Route-14', received: '2026-07-25', shelf_life_days: 730, cost_inr: 630000, temperature: 'Ambient' },
  { id: 'FMG-0013', product: 'Household Cleaners', description: 'Vim Dishwash Liquid 750ml', retailer: 'More Supermarket', quantity: 9000, unit: 'cartons', status: 'Delivered', dc: 'Hyderabad DC-SE', route: 'HYD-SE-Route-05', received: '2026-07-24', shelf_life_days: 730, cost_inr: 810000, temperature: 'Ambient' },
  { id: 'FMG-0014', product: 'Packaged Foods', description: 'Tata Salt Plus 1kg', retailer: 'Vijetha', quantity: 20000, unit: 'bags', status: 'Allocated', dc: 'Bengaluru DC-S', route: 'BLR-S-Route-16', received: '2026-07-24', shelf_life_days: 1095, cost_inr: 400000, temperature: 'Ambient' },
  { id: 'FMG-0015', product: 'Baby Care', description: 'Himalaya Baby Lotion 400ml', retailer: 'Star Bazaar', quantity: 1800, unit: 'cartons', status: 'Delivered', dc: 'Kolkata DC-East', route: 'KOL-E-Route-10', received: '2026-07-23', shelf_life_days: 730, cost_inr: 324000, temperature: 'Ambient' },
  { id: 'FMG-0016', product: 'Confectionery', description: 'KitKat 4-Finger Wafer 48.5g', retailer: 'Natures Basket', quantity: 11000, unit: 'cartons', status: 'In Transit', dc: 'Mumbai DC-West', route: 'MUM-W-Route-19', received: '2026-07-23', shelf_life_days: 365, cost_inr: 1320000, temperature: '18-22°C' },
  { id: 'FMG-0017', product: 'Dairy Products', description: 'Epigamia Greek Yogurt 100g', retailer: 'Natures Basket', quantity: 2000, unit: 'cartons', status: 'Short Supply', dc: 'Mumbai DC-West', route: 'MUM-W-Route-01', received: '2026-07-22', shelf_life_days: 21, cost_inr: 280000, temperature: '2-8°C' },
  { id: 'FMG-0018', product: 'Snacks & Chips', description: 'Haldiram Bhujia 200g', retailer: 'Big Bazaar', quantity: 8000, unit: 'cartons', status: 'Delivered', dc: 'Delhi DC-North', route: 'DEL-N-Route-13', received: '2026-07-22', shelf_life_days: 120, cost_inr: 1120000, temperature: 'Ambient' },
  { id: 'FMG-0019', product: 'Beverages', description: 'Tropicana 100% Orange 1L', retailer: 'Reliance Fresh', quantity: 5500, unit: 'cartons', status: 'Allocated', dc: 'Pune DC-South', route: 'PUN-S-Route-20', received: '2026-07-21', shelf_life_days: 60, cost_inr: 825000, temperature: '2-8°C' },
  { id: 'FMG-0020', product: 'Personal Care', description: 'Nivea Body Lotion 400ml', retailer: 'Spencer\'s', quantity: 4200, unit: 'cartons', status: 'Delivered', dc: 'Chennai DC-East', route: 'CHE-E-Route-17', received: '2026-07-21', shelf_life_days: 730, cost_inr: 714000, temperature: 'Ambient' },
]

const genRecords = (start: number) => {
  const statuses = ['Allocated', 'In Transit', 'Delivered', 'Short Supply', 'Excess Stock', 'Damaged']
  const dcs = ['Mumbai DC-West', 'Delhi DC-North', 'Chennai DC-East', 'Bengaluru DC-S', 'Hyderabad DC-SE', 'Kolkata DC-East', 'Pune DC-South', 'Ahmedabad DC-West']
  const temps = ['Ambient', '2-8°C', '18-22°C', 'Ambient', 'Ambient']
  return Array.from({ length: 40 }, (_, i) => ({
    id: `FMG-${String(start + i).padStart(4, '0')}`,
    product: PRODUCT_TYPES[(start + i) % 8],
    description: `${PRODUCT_TYPES[(start + i) % 8]} SKU ${String((start + i) % 99 + 1).padStart(3, '0')}`,
    retailer: RETAIL_CHAINS[(start + i) % 8],
    quantity: Math.round(100 + Math.random() * 19900),
    unit: ['cartons', 'crates', 'bags', 'pcs', 'units'][i % 5],
    status: statuses[(start + i) % 6],
    dc: dcs[(start + i) % 8],
    route: `RT-${String((start + i) % 25).padStart(2, '0')}-${String((start + i) % 99 + 1).padStart(3, '0')}`,
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    shelf_life_days: Math.round(7 + Math.random() * 1093),
    cost_inr: Math.round(20000 + Math.random() * 2000000),
    temperature: temps[(start + i) % 5],
  }))
}

const allProducts = [...products, ...genRecords(21), ...genRecords(61)]

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

const filterGroups = [
  {
    key: 'product',
    label: 'Product Type',
    options: PRODUCT_TYPES.map(p => ({ label: p, value: p, count: allProducts.filter(d => d.product === p).length })),
  },
  {
    key: 'retailer',
    label: 'Retail Chain',
    options: RETAIL_CHAINS.map(r => ({ label: r, value: r, count: allProducts.filter(d => d.retailer === r).length })),
  },
  {
    key: 'status',
    label: 'Distribution Status',
    options: DISTRIBUTION_STATUS.map(s => ({ label: s, value: s, count: allProducts.filter(d => d.status === s).length })),
  },
]

function ProductBadge({ product }: { product: string }) {
  const colors: Record<string, string> = { 'Dairy Products': 'bg-emerald-100 text-emerald-800', 'Snacks & Chips': 'bg-amber-100 text-amber-800', Beverages: 'bg-sky-100 text-sky-800', 'Personal Care': 'bg-pink-100 text-pink-800', 'Household Cleaners': 'bg-teal-100 text-teal-800', 'Packaged Foods': 'bg-orange-100 text-orange-800', 'Baby Care': 'bg-blue-100 text-blue-800', Confectionery: 'bg-rose-100 text-rose-800' }
  return <span className={`fmcg-product-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[product] || 'bg-gray-100 text-gray-800'}`}>{product}</span>
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { Allocated: 'bg-blue-100 text-blue-800', 'In Transit': 'bg-cyan-100 text-cyan-800', Delivered: 'bg-green-100 text-green-800', 'Short Supply': 'bg-red-100 text-red-800', 'Excess Stock': 'bg-amber-100 text-amber-800', Damaged: 'bg-gray-200 text-gray-600' }
  return <span className={`fmcg-status-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
}

function ShelfBar({ days }: { days: number }) {
  const pct = ri(0, 100, (days / 1095) * 100)
  const color = days <= 14 ? 'bg-red-500' : days <= 30 ? 'bg-amber-500' : days <= 90 ? 'bg-green-400' : 'bg-emerald-500'
  return <div className="fmcg-shelf-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`fmcg-shelf-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{days}d</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return <div className="fmcg-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="fmcg-ring-path" strokeLinecap="round" /></svg><span className="fmcg-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="fmcg-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="fmcg-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="fmcg-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
}

export default function FmcgDistributionHubView() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const toggleFilter = (key: string, value: string) => {
    setActiveFilters(prev => {
      const curr = prev[key] || []
      const next = curr.includes(value) ? curr.filter(v => v !== value) : [...curr, value]
      return next.length > 0 ? { ...prev, [key]: next } : Object.fromEntries(Object.entries(prev).filter(([k]) => k !== key))
    })
  }

  const filtered = allProducts.filter(d => {
    const q = searchQuery.toLowerCase()
    if (q && !d.id.toLowerCase().includes(q) && !d.product.toLowerCase().includes(q) && !d.description.toLowerCase().includes(q) && !d.retailer.toLowerCase().includes(q) && !d.dc.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(d[key as keyof typeof d] as string))
  })

  const totalCost = allProducts.reduce((s, d) => s + d.cost_inr, 0)
  const delivered = allProducts.filter(d => d.status === 'Delivered').length
  const coldChain = allProducts.filter(d => d.temperature !== 'Ambient').length
  const shortSupply = allProducts.filter(d => d.status === 'Short Supply').length

  const monthlyData = [
    { month: 'Jan', skus: 450, value_cr: 28, fill_rate: 96 },
    { month: 'Feb', skus: 480, value_cr: 31, fill_rate: 94 },
    { month: 'Mar', skus: 520, value_cr: 35, fill_rate: 97 },
    { month: 'Apr', skus: 490, value_cr: 33, fill_rate: 93 },
    { month: 'May', skus: 440, value_cr: 29, fill_rate: 95 },
    { month: 'Jun', skus: 410, value_cr: 26, fill_rate: 92 },
    { month: 'Jul', skus: 550, value_cr: 38, fill_rate: 96 },
  ]
  const productData = PRODUCT_TYPES.map(p => ({ product: p, count: allProducts.filter(d => d.product === p).length }))
  const retailerData = RETAIL_CHAINS.map(r => ({ retailer: r, count: allProducts.filter(d => d.retailer === r).length }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'products', label: 'Products' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="fmcg-container space-y-4">
      <PageHeader title="FMCG Distribution Hub" description="Fast-moving consumer goods distribution, shelf-life management, cold chain tracking, and retailer fulfillment across Indian modern trade" />
      <ModuleBreadcrumb items={[{ label: 'Distribution' }, { label: 'FMCG Hub' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="fmcg-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="fmcg-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="fmcg-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total SKUs" value={allProducts.length.toString()} sub="Active distribution" />
            <KpiTile title="Total Value" value={`₹${(totalCost / 10000000).toFixed(1)}Cr`} sub="Inventory at DC" />
            <KpiTile title="Delivered" value={delivered.toString()} sub={`${((delivered / allProducts.length) * 100).toFixed(0)}% fulfillment`} />
            <KpiTile title="Cold Chain" value={coldChain.toString()} sub="Temp-sensitive items" />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={95} label="Fill Rate" color="#059669" />
            <HealthRing value={92} label="OTIF Delivery" color="#047857" />
            <HealthRing value={88} label="Shelf Compliance" color="#10b981" />
            <HealthRing value={96} label="Cold Chain" color="#065f46" />
            <HealthRing value={90} label="Stock Accuracy" color="#064e3b" />
            <HealthRing value={93} label="Route Efficiency" color="#34d399" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="fmcg-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly SKU Volume & Fill Rate</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="skus" stroke="#059669" strokeWidth={2} /><Line type="monotone" dataKey="fill_rate" stroke="#047857" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card>
            <Card className="fmcg-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">SKUs by Product Category</CardTitle></CardHeader><CardContent><BarChart data={productData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="product" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#059669" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="fmcg-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Retail Chain Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={retailerData} dataKey="count" nameKey="retailer" cx="50%" cy="50%" outerRadius={70} label={({ retailer, count }) => `${count}`}>{retailerData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="fmcg-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allProducts.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, product, description, retailer, or DC..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="fmcg-table w-full text-sm">
              <thead><tr className="fmcg-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Product</th><th className="px-3 py-2 text-left font-medium">Retailer</th><th className="px-3 py-2 text-left font-medium">Status</th><th className="px-3 py-2 text-left font-medium">Qty</th><th className="px-3 py-2 text-left font-medium">Shelf Life</th><th className="px-3 py-2 text-left font-medium">Temp</th><th className="px-3 py-2 text-left font-medium">DC</th><th className="px-3 py-2 text-left font-medium">Route</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(d => (
                <tr key={d.id} className="fmcg-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{d.id}</td>
                  <td className="px-3 py-2"><ProductBadge product={d.product} /></td>
                  <td className="px-3 py-2 text-xs">{d.retailer}</td>
                  <td className="px-3 py-2"><StatusBadge status={d.status} /></td>
                  <td className="px-3 py-2 text-xs">{d.quantity.toLocaleString('en-IN')} {d.unit}</td>
                  <td className="px-3 py-2"><ShelfBar days={d.shelf_life_days} /></td>
                  <td className="px-3 py-2 text-xs">{d.temperature}</td>
                  <td className="px-3 py-2 text-xs">{d.dc}</td>
                  <td className="px-3 py-2 text-xs">{d.route}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="fmcg-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg SKU Value" value="₹1.8L" trend="+11.2% vs last quarter" />
            <ValueTile title="Fill Rate" value="96.1%" trend="+2.4% improved" />
            <ValueTile title="Short Supply" value="4.8%" trend="-1.6% reduced" />
            <ValueTile title="Damage Rate" value="0.8%" trend="-0.3% reduced" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="fmcg-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Revenue by Product Category</CardTitle></CardHeader><CardContent><BarChart data={PRODUCT_TYPES.map(p => ({ product: p, total: allProducts.filter(d => d.product === p).reduce((s, d) => s + d.cost_inr, 0) / 10000000 }))} width={400} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="product" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="total" fill="#047857" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="fmcg-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Distribution Status Breakdown</CardTitle></CardHeader><CardContent><PieChart width={400} height={250}><Pie data={DISTRIBUTION_STATUS.map(s => ({ status: s, count: allProducts.filter(d => d.status === s).length }))} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>{DISTRIBUTION_STATUS.map((_, i) => <Cell key={i} fill={['#3b82f6','#06b6d4','#22c55e','#ef4444','#f59e0b','#9ca3af'][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="fmcg-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="fmcg-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Reliance Retail Direct-to-Store Delivery</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Integration with Reliance Retail JioMart and Fresh platforms for 4-hour D2D delivery from 8 dark stores across Mumbai, Delhi, and Bengaluru. Real-time shelf-life monitoring with automated markdown pricing for items within 48 hours of expiry. 97% on-shelf availability target achieved for top 200 SKUs.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-800">Critical</span><span className="text-gray-400">Live</span></div></CardContent></Card>
            <Card className="fmcg-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Cold Chain IoT for Dairy & Fresh</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Temperature sensors on 1,200+ refrigerated trucks and cold storage units across 6 DCs. Real-time alerts for temperature excursions exceeding 2 degrees from set point. Automated shelf-life recalculation based on cumulative temperature exposure. Reduced dairy wastage from 6.2% to 1.8% in Q2 2026.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-green-800">Operational</span><span className="text-gray-400">Q3 2026</span></div></CardContent></Card>
            <Card className="fmcg-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Kirana Store Last-Mile Expansion</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Partnering with 15,000 kirana stores across Tier-2 and Tier-3 cities for FMCG distribution via UDMART and udaan platforms. Route optimization engine serving 250 routes daily with 92% delivery completion. Enabling mom-and-pop stores to compete with modern trade on pricing and freshness.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-teal-100 px-2 py-0.5 text-teal-800">Growth</span><span className="text-gray-400">FY2027</span></div></CardContent></Card>
            <Card className="fmcg-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">AI-Powered Demand Sensing</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Deep learning model processing 12 months of POS data from 8 retail chains plus weather, festival calendar, and IPL match schedules. Predicts demand spikes with 91% accuracy at SKU-store-day level. Auto-generates replenishment orders 5 days ahead, reducing stockouts by 34% and excess inventory by 22%.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-lime-100 px-2 py-0.5 text-lime-800">Innovation</span><span className="text-gray-400">Pilot</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
