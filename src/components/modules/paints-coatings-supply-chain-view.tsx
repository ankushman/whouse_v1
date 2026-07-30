import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const PRODUCTS = ['Emulsion Interior Paint', 'Exterior Weathercoat', 'Primer Anti-Corrosive', 'PU Wood Finish', 'Powder Coating', 'Industrial Epoxy', 'Road Marking Paint', 'Automotive Basecoat']
const MANUFACTURERS = ['Asian Paints Mumbai', 'Berger Paints Kolkata', 'Nerolac Paints Mumbai (Kansai)', 'Dulux India Gurgaon', 'Shalimar Paints Delhi', 'Indigo Paints Pune', 'Snowcem Paints Mumbai', 'AkzoNobel India Bengaluru']
const STATUSES = ['BIS IS 15489 Tested', 'Green Label Certified', 'In Transit Hazmat', 'Warehouse Climate Ctrl', 'Pending GPCB', 'Awaiting Project Site']
const CITIES = ['Mumbai', 'Delhi NCR', 'Chennai', 'Kolkata', 'Bangalore', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow']
const COLORS = ['#a21caf', '#86198f', '#c026d3', '#d946ef', '#e879f9', '#701a75', '#4a044e', '#fdf4ff']

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}


const productRecords = [
  { id: 'PCS-0001', product: 'Emulsion Interior Paint', description: 'Emulsion interior paint for Delhi Metro Phase-4 Mukherjee Nagar station platform and concourse area wall finishing work', manufacturer: 'Asian Paints Mumbai', quantity: 2500, unit: 'liters', move_status: 'BIS IS 15489 Tested', lot: 'LOT-PCS-1001', destination: 'Delhi NCR', received: '2026-07-12', batch: 'PCS-B2026-0712', cost_inr: 875000, weight_mt: 3.2, voc_g_l: 50.0 },
  { id: 'PCS-0002', product: 'Exterior Weathercoat', description: 'Exterior weathercoat for Mumbai Metro Line-3 Aarey Colony viaduct pier painting and anti-carbonation coating', manufacturer: 'Berger Paints Kolkata', quantity: 1800, unit: 'liters', move_status: 'In Transit Hazmat', lot: 'LOT-PCS-1002', destination: 'Mumbai', received: '2026-07-11', batch: 'PCS-B2026-0711', cost_inr: 1260000, weight_mt: 2.4, voc_g_l: 85.0 },
  { id: 'PCS-0003', product: 'Primer Anti-Corrosive', description: 'Anti-corrosive primer for Kolkata East-West Metro underwater tunnel segment steel reinforcement coating', manufacturer: 'Nerolac Paints Mumbai (Kansai)', quantity: 3200, unit: 'kg', move_status: 'Green Label Certified', lot: 'LOT-PCS-1003', destination: 'Kolkata', received: '2026-07-10', batch: 'PCS-B2026-0710', cost_inr: 2240000, weight_mt: 3.2, voc_g_l: 120.0 },
  { id: 'PCS-0004', product: 'Road Marking Paint', description: 'Road marking thermoplastic paint for NHAI Delhi-Mumbai Expressway Package-4 lane marking and signage', manufacturer: 'Dulux India Gurgaon', quantity: 5000, unit: 'kg', move_status: 'Warehouse Climate Ctrl', lot: 'LOT-PCS-1004', destination: 'Ahmedabad', received: '2026-07-09', batch: 'PCS-B2026-0709', cost_inr: 675000, weight_mt: 5.0, voc_g_l: 45.0 },
  { id: 'PCS-0005', product: 'Industrial Epoxy', description: 'Industrial epoxy floor coating for Indian Railways Vande Bharat coach maintenance depot at Bangalore', manufacturer: 'Shalimar Paints Delhi', quantity: 1200, unit: 'liters', move_status: 'Pending GPCB', lot: 'LOT-PCS-1005', destination: 'Bangalore', received: '2026-07-08', batch: 'PCS-B2026-0708', cost_inr: 1440000, weight_mt: 1.8, voc_g_l: 150.0 },
  { id: 'PCS-0006', product: 'PU Wood Finish', description: 'PU wood finish for Pune Smart City heritage Wada house restoration and wooden frame polishing', manufacturer: 'Indigo Paints Pune', quantity: 800, unit: 'liters', move_status: 'Awaiting Project Site', lot: 'LOT-PCS-1006', destination: 'Pune', received: '2026-07-07', batch: 'PCS-B2026-0707', cost_inr: 640000, weight_mt: 1.0, voc_g_l: 180.0 },
  { id: 'PCS-0007', product: 'Powder Coating', description: 'Powder coating for Chennai Smart City smart pole and solar street light pole metal finishing', manufacturer: 'Snowcem Paints Mumbai', quantity: 6000, unit: 'kg', move_status: 'BIS IS 15489 Tested', lot: 'LOT-PCS-1007', destination: 'Chennai', received: '2026-07-06', batch: 'PCS-B2026-0706', cost_inr: 1260000, weight_mt: 6.0, voc_g_l: 0.0 },
  { id: 'PCS-0008', product: 'Automotive Basecoat', description: 'Automotive basecoat for Tata Motors Pune plant Nexon EV body panel OEM paint supply chain', manufacturer: 'AkzoNobel India Bengaluru', quantity: 3500, unit: 'liters', move_status: 'In Transit Hazmat', lot: 'LOT-PCS-1008', destination: 'Hyderabad', received: '2026-07-05', batch: 'PCS-B2026-0705', cost_inr: 2100000, weight_mt: 4.2, voc_g_l: 200.0 },
  { id: 'PCS-0009', product: 'Emulsion Interior Paint', description: 'Emulsion paint for Navi Mumbai International Airport terminal 1 interior wall and ceiling finishing', manufacturer: 'Asian Paints Mumbai', quantity: 8000, unit: 'liters', move_status: 'Green Label Certified', lot: 'LOT-PCS-1009', destination: 'Mumbai', received: '2026-07-04', batch: 'PCS-B2026-0704', cost_inr: 3200000, weight_mt: 10.4, voc_g_l: 35.0 },
  { id: 'PCS-0010', product: 'Exterior Weathercoat', description: 'Exterior weathercoat for Lucknow Smart City Hazratganj heritage zone building facade restoration', manufacturer: 'Berger Paints Kolkata', quantity: 2000, unit: 'liters', move_status: 'Warehouse Climate Ctrl', lot: 'LOT-PCS-1010', destination: 'Lucknow', received: '2026-07-03', batch: 'PCS-B2026-0703', cost_inr: 1400000, weight_mt: 2.6, voc_g_l: 75.0 },
  { id: 'PCS-0011', product: 'Primer Anti-Corrosive', description: 'Anti-corrosive primer for Dedicated Freight Corridor Western Rail steel bridge girder protection', manufacturer: 'Nerolac Paints Mumbai (Kansai)', quantity: 4500, unit: 'kg', move_status: 'Pending GPCB', lot: 'LOT-PCS-1011', destination: 'Delhi NCR', received: '2026-07-02', batch: 'PCS-B2026-0702', cost_inr: 3150000, weight_mt: 4.5, voc_g_l: 110.0 },
  { id: 'PCS-0012', product: 'Industrial Epoxy', description: 'Industrial epoxy coating for Bharat Petroleum Mumbai refinery storage tank internal lining work', manufacturer: 'Dulux India Gurgaon', quantity: 2800, unit: 'liters', move_status: 'BIS IS 15489 Tested', lot: 'LOT-PCS-1012', destination: 'Mumbai', received: '2026-07-01', batch: 'PCS-B2026-0701', cost_inr: 2520000, weight_mt: 3.8, voc_g_l: 140.0 },
  { id: 'PCS-0013', product: 'Road Marking Paint', description: 'Thermoplastic road marking paint for Jaipur Smart City heritage walkway and cycle track marking', manufacturer: 'Shalimar Paints Delhi', quantity: 3000, unit: 'kg', move_status: 'Awaiting Project Site', lot: 'LOT-PCS-1013', destination: 'Jaipur', received: '2026-06-30', batch: 'PCS-B2026-0630', cost_inr: 405000, weight_mt: 3.0, voc_g_l: 40.0 },
  { id: 'PCS-0014', product: 'Powder Coating', description: 'Powder coating for Tata Steel Jamshedpur structural steel profile and API pipeline coating', manufacturer: 'Indigo Paints Pune', quantity: 7500, unit: 'kg', move_status: 'Green Label Certified', lot: 'LOT-PCS-1014', destination: 'Kolkata', received: '2026-06-29', batch: 'PCS-B2026-0629', cost_inr: 1500000, weight_mt: 7.5, voc_g_l: 0.0 },
  { id: 'PCS-0015', product: 'PU Wood Finish', description: 'PU wood finish for Bangalore Namma Metro station teakwood bench and panel interior furnishing', manufacturer: 'Snowcem Paints Mumbai', quantity: 600, unit: 'cans', move_status: 'In Transit Hazmat', lot: 'LOT-PCS-1015', destination: 'Bangalore', received: '2026-06-28', batch: 'PCS-B2026-0628', cost_inr: 720000, weight_mt: 0.9, voc_g_l: 165.0 },
  { id: 'PCS-0016', product: 'Automotive Basecoat', description: 'Automotive basecoat for Hyundai Chennai plant Creta SUV body panel OEM painting production line', manufacturer: 'AkzoNobel India Bengaluru', quantity: 4000, unit: 'liters', move_status: 'Warehouse Climate Ctrl', lot: 'LOT-PCS-1016', destination: 'Chennai', received: '2026-06-27', batch: 'PCS-B2026-0627', cost_inr: 2800000, weight_mt: 4.8, voc_g_l: 190.0 },
  { id: 'PCS-0017', product: 'Emulsion Interior Paint', description: 'Emulsion paint for Central Vista new Parliament building committee room wall finishing Delhi', manufacturer: 'Asian Paints Mumbai', quantity: 6000, unit: 'liters', move_status: 'BIS IS 15489 Tested', lot: 'LOT-PCS-1017', destination: 'Delhi NCR', received: '2026-06-26', batch: 'PCS-B2026-0626', cost_inr: 2400000, weight_mt: 7.8, voc_g_l: 40.0 },
  { id: 'PCS-0018', product: 'Exterior Weathercoat', description: 'Exterior weathercoat for Statue of Unity viewing gallery and museum dome protective coating', manufacturer: 'Berger Paints Kolkata', quantity: 1500, unit: 'liters', move_status: 'Pending GPCB', lot: 'LOT-PCS-1018', destination: 'Ahmedabad', received: '2026-06-25', batch: 'PCS-B2026-0625', cost_inr: 1350000, weight_mt: 2.0, voc_g_l: 80.0 },
  { id: 'PCS-0019', product: 'Primer Anti-Corrosive', description: 'Anti-corrosive zinc primer for Kochi Metro viaduct expansion joint and pier cap protection work', manufacturer: 'Nerolac Paints Mumbai (Kansai)', quantity: 2200, unit: 'kg', move_status: 'Green Label Certified', lot: 'LOT-PCS-1019', destination: 'Hyderabad', received: '2026-06-24', batch: 'PCS-B2026-0624', cost_inr: 1760000, weight_mt: 2.2, voc_g_l: 105.0 },
  { id: 'PCS-0020', product: 'Industrial Epoxy', description: 'Industrial epoxy floor coating for IIT Bombay research lab and cleanroom anti-static flooring', manufacturer: 'Dulux India Gurgaon', quantity: 1800, unit: 'liters', move_status: 'Awaiting Project Site', lot: 'LOT-PCS-1020', destination: 'Pune', received: '2026-06-23', batch: 'PCS-B2026-0623', cost_inr: 1620000, weight_mt: 2.4, voc_g_l: 135.0 },
]

const genRecords = (start: number) => {
  const statuses = STATUSES
  const manufacturers = MANUFACTURERS
  return Array.from({ length: 20 }, (_, i) => ({
    id: `PCS-${String(start + i).padStart(4, '0')}`,
    product: PRODUCTS[(start + i) % 8],
    description: `${PRODUCTS[(start + i) % 8]} supply for project batch ${String((start + i) % 99 + 1).padStart(3, '0')}`,
    manufacturer: manufacturers[(start + i) % 8],
    quantity: Math.round(10 + Math.random() * 1000),
    unit: ['liters', 'kg', 'cans', 'drums'][i % 4],
    move_status: statuses[(start + i) % 6],
    lot: `LOT-PCS-${String(1000 + start + i).padStart(4, '0')}`,
    destination: CITIES[(start + i) % 10],
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    batch: `PCS-B2026-${String(710 - Math.floor((start + i) / 3)).padStart(4, '0')}`,
    cost_inr: Math.round(80000 + Math.random() * 4000000),
    weight_mt: Math.round((0.5 + Math.random() * 30) * 10) / 10,
    voc_g_l: Math.round((10 + Math.random() * 200) * 10) / 10,
  }))
}

const allProduct = [...productRecords, ...genRecords(21), ...genRecords(41)]

const filterGroups = [
  {
    key: 'product',
    label: 'Product Type',
    options: PRODUCTS.map(p => ({ label: p, value: p, count: allProduct.filter(r => r.product === p).length })),
  },
  {
    key: 'move_status',
    label: 'Status',
    options: STATUSES.map(s => ({ label: s, value: s, count: allProduct.filter(r => r.move_status === s).length })),
  },
  {
    key: 'manufacturer',
    label: 'Manufacturer',
    options: MANUFACTURERS.map(m => ({ label: m, value: m, count: allProduct.filter(r => r.manufacturer === m).length })),
  },
]

function PaintBadge({ product }: { product: string }) {
  return <span className="pcs-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: COLORS[0], color: '#fff' }}>{product}</span>
}

function StatusBadge({ status }: { status: string }) {
  const c = status === 'BIS IS 15489 Tested' ? '#16a34a' : status === 'Green Label Certified' ? '#059669' : status === 'In Transit Hazmat' ? '#dc2626' : status === 'Warehouse Climate Ctrl' ? '#2563eb' : status === 'Pending GPCB' ? '#d97706' : '#6b7280'
  return <span className="pcs-status-badge inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: c + '22', color: c, border: `1px solid ${c}44` }}>{status}</span>
}

function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 4000000) * 100)
  return <div className="pcs-cost-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${COLORS[1]}, ${COLORS[0]})` }} /></div><span className="text-xs text-gray-500">{'\u20B9' + (cost / 100000).toFixed(1) + 'L'}</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="pcs-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" /></svg><span className="mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
  )
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <Card className="pcs-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="pcs-kpi-value mt-1 text-2xl font-bold" style={{ color: COLORS[0] }}>{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
  )
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return (
    <Card className="pcs-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
  )
}


export default function PaintsCoatingsSupplyChainView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const filtered = useMemo(() => {
    return allProduct.filter(r => {
      const q = searchQuery.toLowerCase()
      if (q && !r.id.toLowerCase().includes(q) && !r.product.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.manufacturer.toLowerCase().includes(q) && !r.destination.toLowerCase().includes(q)) return false
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(String(r[key as keyof typeof r])))
    })
  }, [searchQuery, activeFilters])

  const totalCost = allProduct.reduce((s, r) => s + r.cost_inr, 0)
  const totalWeight = allProduct.reduce((s, r) => s + r.weight_mt, 0)
  const bisTested = allProduct.filter(r => r.move_status === 'BIS IS 15489 Tested').length
  const greenLabel = allProduct.filter(r => r.move_status === 'Green Label Certified').length

  const pieData = STATUSES.map(s => ({ name: s, value: allProduct.filter(r => r.move_status === s).length }))
  const barData = PRODUCTS.slice(0, 6).map(p => ({ name: p.split(' ')[0], cost: allProduct.filter(r => r.product === p).reduce((a, r) => a + r.cost_inr, 0) / 10000000 }))
  const lineData = PRODUCTS.slice(0, 6).map(p => ({ name: p.split(' ')[0], voc: allProduct.filter(r => r.product === p).reduce((a, r) => a + r.voc_g_l, 0) / allProduct.filter(r => r.product === p).length }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'inventory', label: 'Inventory' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="pcs-container space-y-4">
      <PageHeader title="Paints & Coatings Supply Chain" description="Track paints, coatings, primers, and industrial finishes across Indian infrastructure projects with BIS IS 15489 and GPCB compliance" />
      <ModuleBreadcrumb items={[{ label: 'Supply Chain' }, { label: 'Paints & Coatings' }]} />
      <Tabs defaultValue="dashboard">
        <TabsList className="pcs-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="pcs-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="pcs-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Shipments" value={allProduct.length.toString()} sub="Paint consignments" />
            <KpiTile title="Total Value" value={`\u20B9${(totalCost / 10000000).toFixed(0)}Cr`} sub="Cargo value in INR" />
            <KpiTile title="BIS Tested" value={bisTested.toString()} sub={`${((bisTested / allProduct.length) * 100).toFixed(0)}% certified`} />
            <KpiTile title="Green Label" value={greenLabel.toString()} sub={`${((greenLabel / allProduct.length) * 100).toFixed(0)}% eco-certified`} />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={94} label="BIS Compliance" color="#16a34a" />
            <HealthRing value={78} label="Hazmat Safety" color="#dc2626" />
            <HealthRing value={85} label="Climate Ctrl" color="#2563eb" />
            <HealthRing value={62} label="GPCB Clear" color="#d97706" />
            <HealthRing value={91} label="VOC Standards" color="#a21caf" />
            <HealthRing value={73} label="Site Delivery" color="#701a75" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Top Product Types</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2"><PaintBadge product="Emulsion Interior Paint" /><PaintBadge product="Exterior Weathercoat" /></div>
                <ValueTile title="Avg Cost per Shipment" value={`\u20B9${Math.round(totalCost / allProduct.length).toLocaleString('en-IN')}`} trend="+5.2% vs Q1" />
                <ValueTile title="Avg Weight per Lot" value={`${(totalWeight / allProduct.length).toFixed(1)} MT`} trend="+3.1% vs Q1" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Shipment Cost Overview</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 mb-1"><StatusBadge status="BIS IS 15489 Tested" /></div>
                <CostBar cost={totalCost / 3} />
                <ValueTile title="Highest Cost" value={`\u20B9${Math.max(...allProduct.map(r => r.cost_inr)).toLocaleString('en-IN')}`} trend="PCS-0009" />
                <ValueTile title="Pending GPCB" value={`\u20B9${allProduct.filter(r => r.move_status === 'Pending GPCB').reduce((a, r) => a + r.cost_inr, 0).toLocaleString('en-IN')}`} trend="-2.4% vs Q1" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="pcs-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups}
            onToggleFilter={(key, val) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(val) ? p[key].filter(v => v !== val) : [...(p[key] || []), val] }))} onClearAllFilters={() => setActiveFilters({})} totalItems={allProduct.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, product, manufacturer, destination, or lot..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="pcs-table w-full text-sm">
              <thead><tr className="pcs-table-header bg-gray-50">
                <th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Product</th><th className="px-3 py-2 text-left font-medium">Status</th><th className="px-3 py-2 text-left font-medium">Qty</th><th className="px-3 py-2 text-left font-medium">Cost</th><th className="px-3 py-2 text-left font-medium">Manufacturer</th><th className="px-3 py-2 text-left font-medium">Destination</th><th className="px-3 py-2 text-left font-medium">Lot</th><th className="px-3 py-2 text-left font-medium">VOC</th>
              </tr></thead>
              <tbody>{filtered.slice(0, 20).map(r => (
                <tr key={r.id} className="pcs-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-3 py-2"><PaintBadge product={r.product} /></td>
                  <td className="px-3 py-2"><StatusBadge status={r.move_status} /></td>
                  <td className="px-3 py-2 text-xs">{r.quantity.toLocaleString('en-IN')} {r.unit}</td>
                  <td className="px-3 py-2"><CostBar cost={r.cost_inr} /></td>
                  <td className="px-3 py-2 text-xs">{r.manufacturer}</td>
                  <td className="px-3 py-2 text-xs">{r.destination}</td>
                  <td className="px-3 py-2 text-xs font-mono">{r.lot}</td>
                  <td className="px-3 py-2 text-xs">{r.voc_g_l} g/L</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="pcs-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="pcs-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>{pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent>
            </Card>
            <Card className="pcs-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Cost by Product Type (Cr)</CardTitle></CardHeader><CardContent><BarChart width={300} height={200} data={barData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="cost" fill={COLORS[0]} radius={[4,4,0,0]} /></BarChart></CardContent>
            </Card>
            <Card className="pcs-chart-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Avg VOC by Product (g/L)</CardTitle></CardHeader><CardContent><LineChart width={300} height={200} data={lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="voc" stroke={COLORS[1]} strokeWidth={2} /></LineChart></CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="pcs-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="pcs-insight-card hover:shadow-md transition-shadow">
              <CardHeader><CardTitle className="text-sm" style={{ color: COLORS[0] }}>BIS IS 15489 Paint Quality Standards {'&'} GREENPRO Eco-Label</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Bureau of Indian Standards IS 15489 specifies requirements for interior and exterior emulsion paints including fineness, opacity, drying time, and washability. GREENPRO certification by CII-IGBC validates eco-friendly paint formulations with low VOC {'<'} 50 g/L, zero heavy metals, and lead-free composition. All paints and coatings for government infrastructure projects must comply with BIS quality orders and carry ISI marking for structural and environmental safety.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-green-800">Regulatory</span><span className="text-gray-400">Mandatory</span></div></CardContent>
            </Card>
            <Card className="pcs-insight-card hover:shadow-md transition-shadow">
              <CardHeader><CardTitle className="text-sm" style={{ color: COLORS[0] }}>CPCB VOC Emission Limits {'&'} Hazardous Waste Rules</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Central Pollution Control Board CPCB VOC emission limits for industrial coatings restrict solvent-borne paints to 200-400 g/L VOC depending on application. Hazardous and Other Wastes Management Rules 2016 classify paint sludge and solvent waste as Schedule-I hazardous waste requiring authorized GPCB disposal. Gujarat GPCB and MPCB mandate effluent treatment plant compliance for paint manufacturing units with real-time VOC monitoring at factory stacks.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">Compliance</span><span className="text-gray-400">Active</span></div></CardContent>
            </Card>
            <Card className="pcs-insight-card hover:shadow-md transition-shadow">
              <CardHeader><CardTitle className="text-sm" style={{ color: COLORS[0] }}>Smart Cities Mission Paint Procurement {'&'} Swachh Bharat</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Smart Cities Mission covers 100 cities with urban renewal paint procurement for building facades, public spaces, and heritage zone restoration through GeM portal e-tendering. Swachh Bharat Mission-Urban 2.0 allocates {'\u20B91,41,600 crore'} for city beautification including anti-graffiti coatings and public toilet hygiene paint. State-level paint procurement aggregators streamline bulk emulsion and weathercoat purchasing for government buildings.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-blue-800">Strategic</span><span className="text-gray-400">Live</span></div></CardContent>
            </Card>
            <Card className="pcs-insight-card hover:shadow-md transition-shadow">
              <CardHeader><CardTitle className="text-sm" style={{ color: COLORS[0] }}>AI Color Matching Analytics {'&'} Festive Season Demand Forecasting</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>AI-powered color matching analytics using computer vision and spectrophotometer data enable precise shade formulation for Indian infrastructure projects with 99.5% delta-E accuracy. Predictive inventory models analyze Diwali, Navratri, and Eid festive season demand surges 120 days ahead, optimizing warehouse stock levels across distribution centers. Machine learning algorithms reduce paint wastage by 18% through automated tinting machine calibration and real-time demand sensing.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-purple-800">Innovation</span><span className="text-gray-400">Pilot</span></div></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

