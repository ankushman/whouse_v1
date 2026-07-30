import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#e11d48', '#be123c', '#f43f5e', '#fb7185', '#fda4af', '#9f1239', '#881337', '#fff1f2']
const PRODUCTS = ['White Crystal Sugar', 'Raw Sugar', 'Ethanol Anhydrous', 'Molasses', 'Jaggery Gur', 'Brown Sugar Organic', 'Candy Sugar', 'Sugar Cane Bagasse']
const MILLS = ['Balrampur Chini UP', 'Shree Renuka Sugars Pune', 'Bajaj Hindusthan Sugar UP', 'EID Parry Chennai', 'Triveni Sugar Noida', 'Mawana Sugars Meerut', 'Dhampur Sugar Delhi', 'Dalmia Sugar Odisha']
const CITIES = ['Lucknow', 'Mumbai', 'Pune', 'Chennai', 'Bangalore', 'Noida', 'Meerut', 'Bhubaneswar', 'Hyderabad', 'Kolkata']
const STATUSES = ['FSSAI Tested', 'Excise Cleared', 'In Transit Bulk', 'Godown Stored', 'Pending Ration Card', 'Awaiting Blending']


const productRecords = [
  { id: 'SEL-0001', product: 'White Crystal Sugar', description: 'UP sugar belt dispatch to Delhi PDS via NH-24 logistics corridor', mill: 'Balrampur Chini UP', quantity: 450, unit: 'tons', move_status: 'In Transit Bulk', lot: 'LOT-SEL-1001', destination: 'Lucknow', received: '2026-07-18', batch: 'SEL-B2026-0718', cost_inr: 3200000, weight_mt: 45.0, icms_pct: 8.5 },
  { id: 'SEL-0002', product: 'Ethanol Anhydrous', description: 'Maharashtra ethanol blending supply for OMC depots targeting 20% EBP', mill: 'Shree Renuka Sugars Pune', quantity: 120, unit: 'kl', move_status: 'Excise Cleared', lot: 'LOT-SEL-1002', destination: 'Pune', received: '2026-07-17', batch: 'SEL-B2026-0717', cost_inr: 1800000, weight_mt: 95.2, icms_pct: 6.0 },
  { id: 'SEL-0003', product: 'Molasses', description: 'Karnataka co-generation molasses transport to distillery Mysore road', mill: 'EID Parry Chennai', quantity: 800, unit: 'quintals', move_status: 'Godown Stored', lot: 'LOT-SEL-1003', destination: 'Chennai', received: '2026-07-16', batch: 'SEL-B2026-0716', cost_inr: 640000, weight_mt: 40.0, icms_pct: 7.2 },
  { id: 'SEL-0004', product: 'Raw Sugar', description: 'Tamil Nadu raw sugar export shipment via Chennai port terminal', mill: 'EID Parry Chennai', quantity: 320, unit: 'tons', move_status: 'FSSAI Tested', lot: 'LOT-SEL-1004', destination: 'Chennai', received: '2026-07-15', batch: 'SEL-B2026-0715', cost_inr: 2560000, weight_mt: 320.0, icms_pct: 5.5 },
  { id: 'SEL-0005', product: 'Jaggery Gur', description: 'UP jaggery retail supply chain for festive season Rama Navami', mill: 'Balrampur Chini UP', quantity: 1200, unit: 'bags', move_status: 'Pending Ration Card', lot: 'LOT-SEL-1005', destination: 'Meerut', received: '2026-07-14', batch: 'SEL-B2026-0714', cost_inr: 480000, weight_mt: 18.0, icms_pct: 9.0 },
  { id: 'SEL-0006', product: 'Brown Sugar Organic', description: 'Maharashtra organic certified sugar for export to EU markets', mill: 'Shree Renuka Sugars Pune', quantity: 85, unit: 'tons', move_status: 'Awaiting Blending', lot: 'LOT-SEL-1006', destination: 'Mumbai', received: '2026-07-13', batch: 'SEL-B2026-0713', cost_inr: 4250000, weight_mt: 85.0, icms_pct: 6.8 },
  { id: 'SEL-0007', product: 'Candy Sugar', description: 'Noida confectionery grade candy sugar for pharma manufacturing', mill: 'Triveni Sugar Noida', quantity: 60, unit: 'tons', move_status: 'FSSAI Tested', lot: 'LOT-SEL-1007', destination: 'Noida', received: '2026-07-12', batch: 'SEL-B2026-0712', cost_inr: 3600000, weight_mt: 60.0, icms_pct: 7.5 },
  { id: 'SEL-0008', product: 'Sugar Cane Bagasse', description: 'UP bagasse co-generation biomass feedstock for sugar mill boiler', mill: 'Bajaj Hindusthan Sugar UP', quantity: 5000, unit: 'bags', move_status: 'Godown Stored', lot: 'LOT-SEL-1008', destination: 'Lucknow', received: '2026-07-11', batch: 'SEL-B2026-0711', cost_inr: 750000, weight_mt: 250.0, icms_pct: 5.0 },
  { id: 'SEL-0009', product: 'Ethanol Anhydrous', description: 'UP ethanol supply for HPCL depot Kanpur under EBP 2025-26 target', mill: 'Bajaj Hindusthan Sugar UP', quantity: 200, unit: 'kl', move_status: 'Excise Cleared', lot: 'LOT-SEL-1009', destination: 'Meerut', received: '2026-07-10', batch: 'SEL-B2026-0710', cost_inr: 3000000, weight_mt: 158.0, icms_pct: 8.0 },
  { id: 'SEL-0010', product: 'White Crystal Sugar', description: 'Karnataka sugar levy quota for PDS Bangalore urban distribution', mill: 'Dhampur Sugar Delhi', quantity: 600, unit: 'quintals', move_status: 'In Transit Bulk', lot: 'LOT-SEL-1010', destination: 'Bangalore', received: '2026-07-09', batch: 'SEL-B2026-0709', cost_inr: 1080000, weight_mt: 30.0, icms_pct: 6.5 },
  { id: 'SEL-0011', product: 'Molasses', description: 'Maharashtra molasses feedstock for cattle feed pellet plant Nashik', mill: 'Shree Renuka Sugars Pune', quantity: 950, unit: 'quintals', move_status: 'Pending Ration Card', lot: 'LOT-SEL-1011', destination: 'Pune', received: '2026-07-08', batch: 'SEL-B2026-0708', cost_inr: 570000, weight_mt: 47.5, icms_pct: 7.8 },
  { id: 'SEL-0012', product: 'Raw Sugar', description: 'Odisha raw sugar for local refinery processing Paradip port route', mill: 'Dalmia Sugar Odisha', quantity: 280, unit: 'tons', move_status: 'Godown Stored', lot: 'LOT-SEL-1012', destination: 'Bhubaneswar', received: '2026-07-07', batch: 'SEL-B2026-0707', cost_inr: 1960000, weight_mt: 280.0, icms_pct: 5.2 },
  { id: 'SEL-0013', product: 'Ethanol Anhydrous', description: 'Tamil Nadu ethanol blending for IOCL Chennai refinery EBP programme', mill: 'EID Parry Chennai', quantity: 150, unit: 'kl', move_status: 'Awaiting Blending', lot: 'LOT-SEL-1013', destination: 'Chennai', received: '2026-07-06', batch: 'SEL-B2026-0706', cost_inr: 2250000, weight_mt: 118.5, icms_pct: 6.3 },
  { id: 'SEL-0014', product: 'Jaggery Gur', description: 'Meerut jaggery block supply for wholesale mandi seasonal demand', mill: 'Mawana Sugars Meerut', quantity: 800, unit: 'bags', move_status: 'FSSAI Tested', lot: 'LOT-SEL-1014', destination: 'Meerut', received: '2026-07-05', batch: 'SEL-B2026-0705', cost_inr: 320000, weight_mt: 12.0, icms_pct: 8.8 },
  { id: 'SEL-0015', product: 'Candy Sugar', description: 'Hyderabad pharma grade candy sugar for Ayurvedic formulation units', mill: 'Dhampur Sugar Delhi', quantity: 45, unit: 'tons', move_status: 'Excise Cleared', lot: 'LOT-SEL-1015', destination: 'Hyderabad', received: '2026-07-04', batch: 'SEL-B2026-0704', cost_inr: 2700000, weight_mt: 45.0, icms_pct: 7.0 },
  { id: 'SEL-0016', product: 'White Crystal Sugar', description: 'Kolkata sugar supply for eastern India PDS levy sugar distribution', mill: 'Dalmia Sugar Odisha', quantity: 380, unit: 'tons', move_status: 'In Transit Bulk', lot: 'LOT-SEL-1016', destination: 'Kolkata', received: '2026-07-03', batch: 'SEL-B2026-0703', cost_inr: 2660000, weight_mt: 380.0, icms_pct: 6.1 },
  { id: 'SEL-0017', product: 'Brown Sugar Organic', description: 'Bangalore organic sugar for premium retail outlet Nature Basket chain', mill: 'Triveni Sugar Noida', quantity: 70, unit: 'tons', move_status: 'Godown Stored', lot: 'LOT-SEL-1017', destination: 'Bangalore', received: '2026-07-02', batch: 'SEL-B2026-0702', cost_inr: 3500000, weight_mt: 70.0, icms_pct: 5.8 },
  { id: 'SEL-0018', product: 'Sugar Cane Bagasse', description: 'UP biomass bagasse for paper mill feedstock Lakhimpur Kheri', mill: 'Balrampur Chini UP', quantity: 3500, unit: 'bags', move_status: 'Pending Ration Card', lot: 'LOT-SEL-1018', destination: 'Lucknow', received: '2026-07-01', batch: 'SEL-B2026-0701', cost_inr: 525000, weight_mt: 175.0, icms_pct: 4.5 },
  { id: 'SEL-0019', product: 'Ethanol Anhydrous', description: 'Bharat Petroleum ethanol supply Noida depot 20% blending mandate', mill: 'Triveni Sugar Noida', quantity: 180, unit: 'kl', move_status: 'FSSAI Tested', lot: 'LOT-SEL-1019', destination: 'Noida', received: '2026-06-30', batch: 'SEL-B2026-0630', cost_inr: 2700000, weight_mt: 142.2, icms_pct: 7.4 },
  { id: 'SEL-0020', product: 'Raw Sugar', description: 'Maharashtra raw sugar pipeline to Mumbai refinery for white conversion', mill: 'Shree Renuka Sugars Pune', quantity: 420, unit: 'tons', move_status: 'Awaiting Blending', lot: 'LOT-SEL-1020', destination: 'Mumbai', received: '2026-06-29', batch: 'SEL-B2026-0629', cost_inr: 3360000, weight_mt: 420.0, icms_pct: 5.9 },
]


const genRecords = (start: number) => {
  const statuses = STATUSES
  const mills = MILLS
  return Array.from({ length: 20 }, (_, i) => ({
    id: `SEL-${String(start + i).padStart(4, '0')}`,
    product: PRODUCTS[(start + i) % 8],
    description: `${PRODUCTS[(start + i) % 8]} supply for batch ${String((start + i) % 99 + 1).padStart(3, '0')}`,
    mill: mills[(start + i) % 8],
    quantity: Math.round(5 + Math.random() * 500),
    unit: ['tons', 'kl', 'bags', 'quintals'][i % 4],
    move_status: statuses[(start + i) % 6],
    lot: `LOT-SEL-${String(1000 + start + i).padStart(4, '0')}`,
    destination: CITIES[(start + i) % 10],
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    batch: `SEL-B2026-${String(710 - Math.floor((start + i) / 3)).padStart(4, '0')}`,
    cost_inr: Math.round(100000 + Math.random() * 5000000),
    weight_mt: Math.round((2 + Math.random() * 80) * 10) / 10,
    icms_pct: Math.round((5 + Math.random() * 10) * 10) / 10,
  }))
}

const allProduct = [...productRecords, ...genRecords(21), ...genRecords(41)]


function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}


const filterGroups = [
  {
    key: 'product',
    label: 'Product',
    options: PRODUCTS.map(p => ({ label: p, value: p, count: allProduct.filter(r => r.product === p).length })),
  },
  {
    key: 'mill',
    label: 'Mill / Company',
    options: MILLS.map(m => ({ label: m, value: m, count: allProduct.filter(r => r.mill === m).length })),
  },
  {
    key: 'move_status',
    label: 'Status',
    options: STATUSES.map(s => ({ label: s, value: s, count: allProduct.filter(r => r.move_status === s).length })),
  },
]


function ProductBadge({ product }: { product: string }) {
  const colors: Record<string, string> = { 'White Crystal Sugar': 'bg-rose-100 text-rose-800', 'Raw Sugar': 'bg-amber-100 text-amber-800', 'Ethanol Anhydrous': 'bg-violet-100 text-violet-800', Molasses: 'bg-yellow-100 text-yellow-800', 'Jaggery Gur': 'bg-orange-100 text-orange-800', 'Brown Sugar Organic': 'bg-green-100 text-green-800', 'Candy Sugar': 'bg-pink-100 text-pink-800', 'Sugar Cane Bagasse': 'bg-lime-100 text-lime-800' }
  return <span className={`sel-product-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[product] || 'bg-gray-100 text-gray-800'}`}>{product}</span>
}


function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { 'FSSAI Tested': 'bg-green-100 text-green-800', 'Excise Cleared': 'bg-blue-100 text-blue-800', 'In Transit Bulk': 'bg-cyan-100 text-cyan-800', 'Godown Stored': 'bg-amber-100 text-amber-800', 'Pending Ration Card': 'bg-red-100 text-red-800', 'Awaiting Blending': 'bg-purple-100 text-purple-800' }
  return <span className={`sel-status-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
}


function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 5000000) * 100)
  const color = cost >= 3000000 ? 'bg-rose-600' : cost >= 1500000 ? 'bg-rose-500' : cost >= 500000 ? 'bg-rose-400' : 'bg-rose-300'
  return <div className="sel-cost-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`sel-cost-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{'₹' + (cost / 100000).toFixed(1) + 'L'}</span></div>
}


function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return <div className="sel-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="sel-ring-path" strokeLinecap="round" /></svg><span className="sel-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}


function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="sel-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="sel-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}


function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="sel-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
}


export default function SugarEthanolLogisticsView() {
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

  const filtered = useMemo(() => allProduct.filter(r => {
    const q = searchQuery.toLowerCase()
    if (q && !r.id.toLowerCase().includes(q) && !r.product.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.mill.toLowerCase().includes(q) && !r.destination.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string))
  }), [searchQuery, activeFilters])

  const totalCost = allProduct.reduce((s, r) => s + r.cost_inr, 0)
  const fssaiOk = allProduct.filter(r => r.move_status === 'FSSAI Tested').length
  const inTransit = allProduct.filter(r => r.move_status === 'In Transit Bulk').length

  const monthlyData = [
    { month: 'Jan', shipments: 220, volume_mt: 620, icms: 7.2 },
    { month: 'Feb', shipments: 198, volume_mt: 580, icms: 6.8 },
    { month: 'Mar', shipments: 245, volume_mt: 710, icms: 7.5 },
    { month: 'Apr', shipments: 210, volume_mt: 650, icms: 6.9 },
    { month: 'May', shipments: 185, volume_mt: 520, icms: 7.1 },
    { month: 'Jun', shipments: 260, volume_mt: 740, icms: 7.8 },
    { month: 'Jul', shipments: 275, volume_mt: 810, icms: 7.4 },
  ]
  const productData = PRODUCTS.map(p => ({ product: p, count: allProduct.filter(r => r.product === p).length }))
  const statusData = STATUSES.map(s => ({ status: s, count: allProduct.filter(r => r.move_status === s).length }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'shipments', label: 'Shipments' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]


  return (
    <div className="sel-container space-y-4">
      <PageHeader title="Sugar & Ethanol Logistics" description="Indian sugar belt and ethanol blending programme tracking with FSSAI compliance, excise management, and mill-wise logistics across UP, Maharashtra, Karnataka, and Tamil Nadu" />
      <ModuleBreadcrumb items={[{ label: 'Agri Logistics' }, { label: 'Sugar & Ethanol' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="sel-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="sel-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>


        <TabsContent value="dashboard" className="sel-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Shipments" value={allProduct.length.toString()} sub="Sugar & ethanol consignments" />
            <KpiTile title="Total Value" value={`₹${(totalCost / 10000000).toFixed(0)}Cr`} sub="Inventory value INR" />
            <KpiTile title="FSSAI Tested" value={fssaiOk.toString()} sub={`${((fssaiOk / allProduct.length) * 100).toFixed(0)}% verified`} />
            <KpiTile title="In Transit" value={inTransit.toString()} sub="Bulk movement active" />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={87} label="FSSAI" color="#e11d48" />
            <HealthRing value={72} label="Excise" color="#be123c" />
            <HealthRing value={91} label="Transit" color="#f43f5e" />
            <HealthRing value={65} label="Godown" color="#fb7185" />
            <HealthRing value={78} label="PDS Levy" color="#fda4af" />
            <HealthRing value={83} label="Blending" color="#9f1239" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="sel-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Shipment Volume & ICMS</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="shipments" stroke="#e11d48" strokeWidth={2} /><Line type="monotone" dataKey="icms" stroke="#be123c" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card>
            <Card className="sel-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Shipments by Product</CardTitle></CardHeader><CardContent><BarChart data={productData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="product" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#e11d48" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="sel-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={statusData} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={70} label={({ status, count }) => `${count}`}>{statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>


        <TabsContent value="shipments" className="sel-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allProduct.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, product, mill, destination, or lot..." />
          <div className="flex gap-2 mb-2">
            <ProductBadge product={PRODUCTS[0]} />
            <ProductBadge product={PRODUCTS[2]} />
            <StatusBadge status={STATUSES[0]} />
          </div>
          <div className="overflow-x-auto rounded-lg border">
            <table className="sel-table w-full text-sm">
              <thead><tr className="sel-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Product</th><th className="px-3 py-2 text-left font-medium">Status</th><th className="px-3 py-2 text-left font-medium">Qty</th><th className="px-3 py-2 text-left font-medium">Cost</th><th className="px-3 py-2 text-left font-medium">Mill</th><th className="px-3 py-2 text-left font-medium">Destination</th><th className="px-3 py-2 text-left font-medium">Lot</th><th className="px-3 py-2 text-left font-medium">Weight MT</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(r => (
                <tr key={r.id} className="sel-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-3 py-2"><ProductBadge product={r.product} /></td>
                  <td className="px-3 py-2"><StatusBadge status={r.move_status} /></td>
                  <td className="px-3 py-2 text-xs">{r.quantity.toLocaleString('en-IN')} {r.unit}</td>
                  <td className="px-3 py-2"><CostBar cost={r.cost_inr} /></td>
                  <td className="px-3 py-2 text-xs">{r.mill}</td>
                  <td className="px-3 py-2 text-xs">{r.destination}</td>
                  <td className="px-3 py-2 text-xs font-mono">{r.lot}</td>
                  <td className="px-3 py-2 text-xs">{r.weight_mt}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="sel-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg Shipment Weight" value="42.3 MT" trend="+11.2% vs last quarter" />
            <ValueTile title="Ethanol Blending Rate" value="17.8%" trend="+2.5% improved" />
            <ValueTile title="FSSAI Pass Rate" value="94.6%" trend="+0.8% improved" />
            <ValueTile title="Avg Mill Recovery" value="9.8%" trend="+0.3% improved" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="sel-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Cost by Product Category</CardTitle></CardHeader><CardContent><BarChart data={PRODUCTS.map(p => ({ product: p, total: allProduct.filter(r => r.product === p).reduce((s, r) => s + r.cost_inr, 0) / 100000 }))} width={400} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="product" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="total" fill="#be123c" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="sel-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Move Status Breakdown</CardTitle></CardHeader><CardContent><PieChart width={400} height={250}><Pie data={STATUSES.map(s => ({ status: s, count: allProduct.filter(r => r.move_status === s).length }))} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>{STATUSES.map((_, i) => <Cell key={i} fill={['#e11d48','#be123c','#f43f5e','#fb7185','#fda4af','#9f1239'][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="sel-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="sel-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">CACP FRP Sugarcane Pricing & Policy</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Commission for Agricultural Costs and Prices (CACP) recommends Fair and Remunerative Price (FRP) for sugarcane annually. The 2025-26 FRP fixed at INR 315 per quintal for 10% recovery baseline directly impacts mill procurement costs and logistics planning across UP, Maharashtra, and Karnataka sugar belts. Sugar mills must pay FRP within 14 days of cane delivery, creating cash flow pressures that affect transportation scheduling and warehouse inventory decisions. State-advised prices in UP (SAP) at INR 350/quintal further elevate cost structures for western UP mills.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-rose-800">Critical</span><span className="text-gray-400">Live</span></div></CardContent></Card>
            <Card className="sel-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">NITI Aayog 20% Ethanol Blending Target EBP</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>The Ethanol Blended Petrol (EBP) programme under NITI Aayog targets 20% ethanol blending in petrol by 2025-26, requiring approximately 1016 crore litres of ethanol. Oil Marketing Companies (IOCL, HPCL, BPCL) require coordinated logistics from 300+ distilleries across UP, Maharashtra, and Tamil Nadu to 55,000+ fuel depots nationwide. Supply chain challenges include rail rack availability, tanker truck fleet capacity during peak sugarcane crushing season (October-March), and inter-state excise duty variations affecting mill-level ethanol pricing from INR 56-65 per litre.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-rose-800">Operational</span><span className="text-gray-400">Q3 2026</span></div></CardContent></Card>
            <Card className="sel-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">FCI Sugar Buffer Stock & PDS Levy Quota</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Food Corporation of India (FCI) manages a buffer stock of 30 LMT (Lakh Metric Tonnes) of sugar for domestic price stabilization under the Sugar Control Order. The PDS (Public Distribution System) levy sugar quota of 2.5 LMT per month requires coordinated mill-to-FCI-warehouse logistics across major sugar-consuming states. Mills contribute approximately 20% of production as levy sugar at government-fixed rates (INR 44.75/quintal for 2025-26), creating dual-track logistics for levy and free-sale sugar movements. Buffer stock release decisions by the Department of Food and Public Distribution directly impact warehouse capacity and transportation demand.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-rose-800">Strategic</span><span className="text-gray-400">FY2027</span></div></CardContent></Card>
            <Card className="sel-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">AI Sugarcane Crushing Season Forecasting</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>AI-powered sugarcane crushing season forecasting models optimize mill recovery rates and logistics scheduling across India's 500+ sugar mills. Machine learning algorithms process satellite imagery, weather data, soil moisture indices, and historical yield patterns to predict cane availability at village level with 92% accuracy. These forecasts enable mills to plan crushing schedules 6-8 weeks in advance, optimizing boiler operations, bagasse co-generation capacity, and ethanol distillery feedstock logistics. Integration with ISRO's remote sensing data and IMD weather forecasts further improves prediction of seasonal logistics peaks for Uttar Pradesh (180+ mills), Maharashtra (190+ mills), and Karnataka (80+ mills) sugar belts.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-rose-800">Innovation</span><span className="text-gray-400">Pilot</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
