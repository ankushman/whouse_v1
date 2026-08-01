import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#c2410c', '#9a3412', '#ea580c', '#f97316', '#fb923c', '#7c2d12', '#431407', '#fff7ed']

const PRODUCTS = ['Radial Truck Tyre', 'Bias Truck Tyre', 'Passenger Car Radial', 'LCV Radial', 'Two-Wheeler Tyre', 'OTR Mining Tyre', 'Agricultural Tractor Tyre', 'Natural Rubber Sheet RSS3']
const MANUFACTURERS = ['MRF Chennai', 'Apollo Tyres Gurgaon', 'CEAT Mumbai', 'JK Tyre Delhi', 'Balkrishna Industries Pune', 'Birla Tyres Hyderabad', 'TVS Tyres Madurai', 'Goodyear India Kolkata']
const STATUSES = ['BIS IS Tested', 'DOT Certified', 'In Transit Freight', 'Warehouse Stored', 'Pending E-Way Bill', 'Awaiting OE Dispatch']
const CITIES = ['Chennai', 'Mumbai', 'Delhi NCR', 'Pune', 'Hyderabad', 'Kolkata', 'Bangalore', 'Ahmedabad', 'Jaipur', 'Coimbatore']
const SIZE_GRADES = ['295/80R22.5', '10.00-20', '205/65R16', '185/80R14', '100/90-17', '40.00-57', '13.6-28', 'RSS3 Grade']

const productRecords = [
  { id: 'RTL-0001', product: 'Radial Truck Tyre', description: 'NHAI fleet 295/80R22.5 radial truck tyre supply for Golden Quadrilateral highway maintenance convoy via Mumbai-Pune Expressway logistics hub', manufacturer: 'MRF Chennai', quantity: 2400, unit: 'units', move_status: 'In Transit Freight', lot: 'LOT-RTL-1001', destination: 'Mumbai', received: '2026-07-30', batch: 'RTL-B2026-0730', cost_inr: 4200000, weight_mt: 48.0, size_grade: '295/80R22.5' },
  { id: 'RTL-0002', product: 'OTR Mining Tyre', description: 'Coal India Ltd 40.00-57 OTR mining tyre dispatch for Jharkhand Dhanbad open cast mine heavy hauler fleet operation', manufacturer: 'Balkrishna Industries Pune', quantity: 120, unit: 'units', move_status: 'BIS IS Tested', lot: 'LOT-RTL-1002', destination: 'Delhi NCR', received: '2026-07-30', batch: 'RTL-B2026-0729', cost_inr: 18500000, weight_mt: 36.0, size_grade: '40.00-57' },
  { id: 'RTL-0003', product: 'Passenger Car Radial', description: 'Maruti Suzuki OEM plant Manesar 205/65R16 PCR tyre consignment for Alto K10 and Baleno assembly line Just-In-Time delivery', manufacturer: 'Apollo Tyres Gurgaon', quantity: 4800, unit: 'units', move_status: 'Awaiting OE Dispatch', lot: 'LOT-RTL-1003', destination: 'Delhi NCR', received: '2026-07-29', batch: 'RTL-B2026-0728', cost_inr: 2880000, weight_mt: 19.2, size_grade: '205/65R16' },
  { id: 'RTL-0004', product: 'Natural Rubber Sheet RSS3', description: 'Rubber Board Kottayam RSS3 grade natural rubber sheet shipment for CEAT Mumbai radial tyre compounding and tread mixing department', manufacturer: 'CEAT Mumbai', quantity: 850, unit: 'sheets', move_status: 'Warehouse Stored', lot: 'LOT-RTL-1004', destination: 'Mumbai', received: '2026-07-29', batch: 'RTL-B2026-0727', cost_inr: 1275000, weight_mt: 42.5, size_grade: 'RSS3 Grade' },
  { id: 'RTL-0005', product: 'LCV Radial', description: 'Tata Motors Lucknow plant 185/80R14 LCV radial tyre supply for Ace and Yodha pickup trucks OEM fitment programme', manufacturer: 'JK Tyre Delhi', quantity: 3200, unit: 'units', move_status: 'DOT Certified', lot: 'LOT-RTL-1005', destination: 'Pune', received: '2026-07-28', batch: 'RTL-B2026-0726', cost_inr: 2240000, weight_mt: 16.0, size_grade: '185/80R14' },
  { id: 'RTL-0006', product: 'Agricultural Tractor Tyre', description: 'Mahindra & Mahindra tractor assembly Nagpur 13.6-28 rear tyre set supply for 575 DI and Yuvo Tech+ farm equipment', manufacturer: 'Birla Tyres Hyderabad', quantity: 960, unit: 'sets', move_status: 'Pending E-Way Bill', lot: 'LOT-RTL-1006', destination: 'Hyderabad', received: '2026-07-28', batch: 'RTL-B2026-0725', cost_inr: 1440000, weight_mt: 28.8, size_grade: '13.6-28' },
  { id: 'RTL-0007', product: 'Two-Wheeler Tyre', description: 'Hero MotoCorp Chakan plant 100/90-17 two-wheeler radial tyre for Splendor+ and Xtreme 160R motorcycle OEM production line', manufacturer: 'TVS Tyres Madurai', quantity: 12000, unit: 'units', move_status: 'BIS IS Tested', lot: 'LOT-RTL-1007', destination: 'Pune', received: '2026-07-27', batch: 'RTL-B2026-0724', cost_inr: 1800000, weight_mt: 24.0, size_grade: '100/90-17' },
  { id: 'RTL-0008', product: 'Bias Truck Tyre', description: 'Indian Army EME corps 10.00-20 bias truck tyre procurement for Bhuj and Jaisalmer border logistics depot heavy vehicle fleet', manufacturer: 'MRF Chennai', quantity: 1800, unit: 'units', move_status: 'In Transit Freight', lot: 'LOT-RTL-1008', destination: 'Jaipur', received: '2026-07-27', batch: 'RTL-B2026-0723', cost_inr: 2160000, weight_mt: 54.0, size_grade: '10.00-20' },
  { id: 'RTL-0009', product: 'Radial Truck Tyre', description: 'Ashok Leyland Hosur plant 295/80R22.5 radial truck tyre for AVTR 4420 tipper truck mining and infrastructure project dispatch', manufacturer: 'CEAT Mumbai', quantity: 1600, unit: 'units', move_status: 'Warehouse Stored', lot: 'LOT-RTL-1009', destination: 'Bangalore', received: '2026-07-26', batch: 'RTL-B2026-0722', cost_inr: 3200000, weight_mt: 32.0, size_grade: '295/80R22.5' },
  { id: 'RTL-0010', product: 'OTR Mining Tyre', description: 'NMDC Bailadila iron ore mine 40.00-57 OTR giant tyre for Komatsu HD785 dump truck fleet Chhattisgarh ore transport', manufacturer: 'Balkrishna Industries Pune', quantity: 80, unit: 'units', move_status: 'BIS IS Tested', lot: 'LOT-RTL-1010', destination: 'Hyderabad', received: '2026-07-26', batch: 'RTL-B2026-0721', cost_inr: 24000000, weight_mt: 24.0, size_grade: '40.00-57' },
  { id: 'RTL-0011', product: 'Passenger Car Radial', description: 'Hyundai Motor India Sriperumbudur 205/65R16 PCR tyre supply for Creta and Verna sedan production line OEM daily consignment', manufacturer: 'MRF Chennai', quantity: 5600, unit: 'units', move_status: 'Awaiting OE Dispatch', lot: 'LOT-RTL-1011', destination: 'Chennai', received: '2026-07-25', batch: 'RTL-B2026-0720', cost_inr: 3360000, weight_mt: 22.4, size_grade: '205/65R16' },
  { id: 'RTL-0012', product: 'Natural Rubber Sheet RSS3', description: 'Rubber Board India Kottayam RSS3 natural rubber sheet export quality lot for JK Tyre Mysore radial plant tread compound mixing', manufacturer: 'JK Tyre Delhi', quantity: 1200, unit: 'sheets', move_status: 'In Transit Freight', lot: 'LOT-RTL-1012', destination: 'Coimbatore', received: '2026-07-25', batch: 'RTL-B2026-0719', cost_inr: 1800000, weight_mt: 60.0, size_grade: 'RSS3 Grade' },
  { id: 'RTL-0013', product: 'LCV Radial', description: 'Daimler BharatBenz Oragadam plant 185/80R14 LCV tyre for 917R and 1017R truck series from warehouse to assembly line', manufacturer: 'Apollo Tyres Gurgaon', quantity: 2800, unit: 'units', move_status: 'DOT Certified', lot: 'LOT-RTL-1013', destination: 'Chennai', received: '2026-07-24', batch: 'RTL-B2026-0718', cost_inr: 1960000, weight_mt: 14.0, size_grade: '185/80R14' },
  { id: 'RTL-0014', product: 'Two-Wheeler Tyre', description: 'Bajaj Auto Chakan 100/90-17 tyre for Pulsar N160 and Dominar 400 motorcycle OE fitment with tubeless radial supply chain', manufacturer: 'TVS Tyres Madurai', quantity: 8000, unit: 'units', move_status: 'Pending E-Way Bill', lot: 'LOT-RTL-1014', destination: 'Pune', received: '2026-07-24', batch: 'RTL-B2026-0717', cost_inr: 1200000, weight_mt: 16.0, size_grade: '100/90-17' },
  { id: 'RTL-0015', product: 'Bias Truck Tyre', description: 'State Transport Undertaking UPSRTC 10.00-20 bias truck tyre for Lucknow and Kanpur intercity bus fleet retreading programme', manufacturer: 'CEAT Mumbai', quantity: 2200, unit: 'units', move_status: 'Warehouse Stored', lot: 'LOT-RTL-1015', destination: 'Delhi NCR', received: '2026-07-23', batch: 'RTL-B2026-0716', cost_inr: 2640000, weight_mt: 66.0, size_grade: '10.00-20' },
  { id: 'RTL-0016', product: 'Agricultural Tractor Tyre', description: 'Escorts Kubota Faridabad 13.6-28 tractor tyre for Farmtrac and Kubota MU5501 OEM assembly with E-Way Bill GST compliance', manufacturer: 'Birla Tyres Hyderabad', quantity: 640, unit: 'pairs', move_status: 'Pending E-Way Bill', lot: 'LOT-RTL-1016', destination: 'Jaipur', received: '2026-07-23', batch: 'RTL-B2026-0715', cost_inr: 1280000, weight_mt: 19.2, size_grade: '13.6-28' },
  { id: 'RTL-0017', product: 'Radial Truck Tyre', description: 'Tata Motors Jamshedpur 295/80R22.5 radial tyre for Prima 5528.S heavy haul truck fleet NH-31 corridor logistics support', manufacturer: 'JK Tyre Delhi', quantity: 2000, unit: 'units', move_status: 'BIS IS Tested', lot: 'LOT-RTL-1017', destination: 'Kolkata', received: '2026-07-22', batch: 'RTL-B2026-0714', cost_inr: 3800000, weight_mt: 40.0, size_grade: '295/80R22.5' },
  { id: 'RTL-0018', product: 'Passenger Car Radial', description: 'Kia India Anantapur 205/65R16 PCR tyre for Seltos and Carens SUV production Just-In-Sequence logistics from Chennai port', manufacturer: 'Goodyear India Kolkata', quantity: 4000, unit: 'units', move_status: 'In Transit Freight', lot: 'LOT-RTL-1018', destination: 'Hyderabad', received: '2026-07-22', batch: 'RTL-B2026-0713', cost_inr: 2400000, weight_mt: 16.0, size_grade: '205/65R16' },
  { id: 'RTL-0019', product: 'OTR Mining Tyre', description: 'Hindalco bauxite mining Odisha 40.00-57 OTR tyre for Caterpillar 793F mining truck fleet NALCO alumina project supply', manufacturer: 'MRF Chennai', quantity: 48, unit: 'units', move_status: 'Awaiting OE Dispatch', lot: 'LOT-RTL-1019', destination: 'Kolkata', received: '2026-07-21', batch: 'RTL-B2026-0712', cost_inr: 14400000, weight_mt: 14.4, size_grade: '40.00-57' },
  { id: 'RTL-0020', product: 'Natural Rubber Sheet RSS3', description: 'Automotive Tyre Manufacturers Association ATMA pooled RSS3 rubber procurement from Kerala plantations for monsoon quarter stockpile', manufacturer: 'Apollo Tyres Gurgaon', quantity: 2000, unit: 'sheets', move_status: 'DOT Certified', lot: 'LOT-RTL-1020', destination: 'Ahmedabad', received: '2026-07-21', batch: 'RTL-B2026-0711', cost_inr: 3000000, weight_mt: 100.0, size_grade: 'RSS3 Grade' },
]

const genRecords = (start: number) => {
  const statuses = STATUSES
  const manufacturers = MANUFACTURERS
  return Array.from({ length: 20 }, (_, i) => ({
    id: `RTL-${String(start + i).padStart(4, '0')}`,
    product: PRODUCTS[(start + i) % 8],
    description: `${PRODUCTS[(start + i) % 8]} supply for fleet batch ${String((start + i) % 99 + 1).padStart(3, '0')}`,
    manufacturer: manufacturers[(start + i) % 8],
    quantity: Math.round(5 + Math.random() * 500),
    unit: ['units', 'sets', 'pairs', 'sheets'][i % 4],
    move_status: statuses[(start + i) % 6],
    lot: `LOT-RTL-${String(1000 + start + i).padStart(4, '0')}`,
    destination: CITIES[(start + i) % 10],
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    batch: `RTL-B2026-${String(710 - Math.floor((start + i) / 3)).padStart(4, '0')}`,
    cost_inr: Math.round(200000 + Math.random() * 6000000),
    weight_mt: Math.round((1 + Math.random() * 50) * 10) / 10,
    size_grade: SIZE_GRADES[(start + i) % 8],
  }))
}

const allProduct = [...productRecords, ...genRecords(21), ...genRecords(41)]

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

const filterGroups = [
  {
    key: 'product',
    label: 'Product Type',
    options: PRODUCTS.map(t => ({ label: t, value: t, count: allProduct.filter(r => r.product === t).length })),
  },
  {
    key: 'manufacturer',
    label: 'Manufacturer',
    options: MANUFACTURERS.map(m => ({ label: m, value: m, count: allProduct.filter(r => r.manufacturer === m).length })),
  },
  {
    key: 'move_status',
    label: 'Move Status',
    options: STATUSES.map(s => ({ label: s, value: s, count: allProduct.filter(r => r.move_status === s).length })),
  },
]

function TyreBadge({ product }: { product: string }) {
  const colors: Record<string, string> = { 'Radial Truck Tyre': 'bg-orange-100 text-orange-800', 'Bias Truck Tyre': 'bg-amber-100 text-amber-800', 'Passenger Car Radial': 'bg-yellow-100 text-yellow-800', 'LCV Radial': 'bg-lime-100 text-lime-800', 'Two-Wheeler Tyre': 'bg-green-100 text-green-800', 'OTR Mining Tyre': 'bg-red-100 text-red-800', 'Agricultural Tractor Tyre': 'bg-emerald-100 text-emerald-800', 'Natural Rubber Sheet RSS3': 'bg-teal-100 text-teal-800' }
  return <span className={`rtl-tyre-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[product] || 'bg-gray-100 text-gray-800'}`}>{product}</span>
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { 'BIS IS Tested': 'bg-green-100 text-green-800', 'DOT Certified': 'bg-blue-100 text-blue-800', 'In Transit Freight': 'bg-cyan-100 text-cyan-800', 'Warehouse Stored': 'bg-purple-100 text-purple-800', 'Pending E-Way Bill': 'bg-yellow-100 text-yellow-800', 'Awaiting OE Dispatch': 'bg-orange-100 text-orange-800' }
  return <span className={`rtl-status-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
}

function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 24000000) * 100)
  const color = cost >= 15000000 ? 'bg-orange-600' : cost >= 5000000 ? 'bg-orange-500' : cost >= 2000000 ? 'bg-orange-400' : 'bg-orange-300'
  return <div className="rtl-cost-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`rtl-cost-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{'\u20B9' + (cost / 100000).toFixed(1) + 'L'}</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return <div className="rtl-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="rtl-ring-path" strokeLinecap="round" /></svg><span className="rtl-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="rtl-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="rtl-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="rtl-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
}

export default function RubberTyreLogisticsView() {
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
    if (q && !r.id.toLowerCase().includes(q) && !r.product.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.manufacturer.toLowerCase().includes(q) && !r.destination.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string))
  }), [searchQuery, activeFilters])

  const totalCost = allProduct.reduce((s, r) => s + r.cost_inr, 0)
  const bisTested = allProduct.filter(r => r.move_status === 'BIS IS Tested').length
  const inTransit = allProduct.filter(r => r.move_status === 'In Transit Freight').length

  const monthlyData = [
    { month: 'Jan', shipments: 180, value_cr: 12, compliance: 94 },
    { month: 'Feb', shipments: 220, value_cr: 16, compliance: 96 },
    { month: 'Mar', shipments: 310, value_cr: 22, compliance: 93 },
    { month: 'Apr', shipments: 165, value_cr: 11, compliance: 97 },
    { month: 'May', shipments: 280, value_cr: 19, compliance: 95 },
    { month: 'Jun', shipments: 140, value_cr: 9, compliance: 98 },
    { month: 'Jul', shipments: 350, value_cr: 25, compliance: 96 },
  ]
  const productData = PRODUCTS.map(t => ({ product: t, count: allProduct.filter(r => r.product === t).length }))
  const mfgData = MANUFACTURERS.map(m => ({ mfg: m, count: allProduct.filter(r => r.manufacturer === m).length }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'shipments', label: 'Shipments' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="rtl-container space-y-4">
      <PageHeader title="Rubber & Tyre Logistics" description="End-to-end Indian rubber and tyre logistics management covering BIS IS 6274 safety compliance, NHAI fleet tyre supply chain, OTR mining tyre dispatch, OEM plant Just-In-Time delivery, natural rubber RSS3 procurement from Rubber Board Kottayam, and E-Way Bill GST freight tracking across Indian highways" />
      <ModuleBreadcrumb items={[{ label: 'Automotive' }, { label: 'Rubber & Tyre' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="rtl-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="rtl-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="rtl-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Shipments" value={allProduct.length.toString()} sub="Tyre & rubber consignments" />
            <KpiTile title="Total Value" value={`\u20B9${(totalCost / 10000000).toFixed(1)}Cr`} sub="Inventory INR value" />
            <KpiTile title="BIS IS Tested" value={bisTested.toString()} sub={`${((bisTested / allProduct.length) * 100).toFixed(0)}% certified`} />
            <KpiTile title="In Transit" value={inTransit.toString()} sub="Freight on Indian highways" />
          </div>

          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={96} label="BIS Compliance" color="#c2410c" />
            <HealthRing value={94} label="DOT Cert" color="#9a3412" />
            <HealthRing value={91} label="OTR Delivery" color="#ea580c" />
            <HealthRing value={97} label="Warehouse Util" color="#f97316" />
            <HealthRing value={93} label="OE Dispatch" color="#fb923c" />
            <HealthRing value={95} label="E-Way Bill" color="#7c2d12" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="rtl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Shipment Volume & Compliance</CardTitle></CardHeader>
            <CardContent><LineChart data={monthlyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="shipments" stroke="#c2410c" strokeWidth={2} /><Line type="monotone" dataKey="compliance" stroke="#9a3412" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card>
            <Card className="rtl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Inventory by Product Type</CardTitle></CardHeader>
            <CardContent><BarChart data={productData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="product" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#c2410c" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="rtl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Manufacturer Distribution</CardTitle></CardHeader>
            <CardContent><PieChart width={300} height={200}><Pie data={mfgData} dataKey="count" nameKey="mfg" cx="50%" cy="50%" outerRadius={70} label={({ mfg, count }) => `${count}`}>{mfgData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>

        </TabsContent>

        <TabsContent value="shipments" className="rtl-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allProduct.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, product, manufacturer, destination, or lot..." />

          <div className="overflow-x-auto rounded-lg border">
            <table className="rtl-table w-full text-sm">
              <thead><tr className="rtl-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Product</th><th className="px-3 py-2 text-left font-medium">Status</th><th className="px-3 py-2 text-left font-medium">Qty</th><th className="px-3 py-2 text-left font-medium">Value</th><th className="px-3 py-2 text-left font-medium">Manufacturer</th><th className="px-3 py-2 text-left font-medium">Destination</th><th className="px-3 py-2 text-left font-medium">Lot</th><th className="px-3 py-2 text-left font-medium">Size</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(r => (
                <tr key={r.id} className="rtl-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-3 py-2"><TyreBadge product={r.product} /></td>
                  <td className="px-3 py-2"><StatusBadge status={r.move_status} /></td>
                  <td className="px-3 py-2 text-xs">{r.quantity.toLocaleString('en-IN')} {r.unit}</td>
                  <td className="px-3 py-2"><CostBar cost={r.cost_inr} /></td>
                  <td className="px-3 py-2 text-xs">{r.manufacturer}</td>
                  <td className="px-3 py-2 text-xs">{r.destination}</td>
                  <td className="px-3 py-2 text-xs font-mono">{r.lot}</td>
                  <td className="px-3 py-2"><TyreBadge product={r.size_grade} /></td>
                </tr>
              ))}</tbody>
            </table>
          </div>

        </TabsContent>

        <TabsContent value="analytics" className="rtl-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg Shipment Value" value={'\u20B938.6L'} trend="+8.2% vs last quarter" />
            <ValueTile title="Tyre Utilization" value="94.1%" trend="+2.3% improved" />
            <ValueTile title="Rubber Yield" value="91.7%" trend="+1.5% on target" />
            <ValueTile title="OTR Availability" value="87.3%" trend="-3.1% shortage" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="rtl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Cost by Product Category</CardTitle></CardHeader>
            <CardContent><BarChart data={PRODUCTS.map(t => ({ product: t, total: allProduct.filter(r => r.product === t).reduce((s, r) => s + r.cost_inr, 0) / 100000 }))} width={400} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="product" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="total" fill="#9a3412" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="rtl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader>
            <CardContent><PieChart width={400} height={250}><Pie data={STATUSES.map(s => ({ status: s, count: allProduct.filter(r => r.move_status === s).length }))} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>{STATUSES.map((_, i) => <Cell key={i} fill={['#22c55e','#3b82f6','#06b6d4','#a855f7','#eab308','#f97316'][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>

        </TabsContent>

        <TabsContent value="insights" className="rtl-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="rtl-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">BIS IS 6274 Tyre Safety Standards & AIS 098 Compliance</CardTitle></CardHeader>
            <CardContent className="text-xs text-gray-600 space-y-2"><p>Bureau of Indian Standards IS 6274 governs automotive tyre safety requirements including bead unseating resistance, strength test, and endurance test for all pneumatic tyres sold in India. AIS 098 regulation mandates bus tyre specifications covering load-speed rating, tread depth minimums, and sidewall marking requirements enforced by Automotive Research Association of India (ARAI) Pune. Real-time compliance tracking across 8,500+ tyre dealers and 380 retreading units. Integration with CMVR Type Approval database for tyre homologation certificates and BIS CRS registration renewal automation for 45+ domestic and international tyre manufacturers operating in India.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-orange-800">Critical</span><span className="text-gray-400">Live</span></div></CardContent></Card>
            <Card className="rtl-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Rubber Board India Natural Rubber Production & Import Duty</CardTitle></CardHeader>
            <CardContent className="text-xs text-gray-600 space-y-2"><p>Rubber Board of India headquartered in Kottayam Kerala monitors natural rubber production across 12 lakh hectares of plantations in Kerala, Karnataka, and Northeast states. Current RSS3 (Ribbed Smoked Sheet Grade 3) benchmark price tracked daily with import duty at 25% plus 5% GST on natural rubber imports. India produces approximately 8.5 lakh MT annually meeting 40% domestic demand. Strategic stockpile management for monsoon season supply disruptions with warehouse network across Kochi, Kottayam, and Calicut ports. Integration with International Rubber Study Group (IRSG) data for global price forecasting and hedging recommendations for tyre manufacturers.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">Strategic</span><span className="text-gray-400">Q3 2026</span></div></CardContent></Card>
            <Card className="rtl-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Fleet Retreading Ecosystem & NHAI Heavy Axle Norms</CardTitle></CardHeader>
            <CardContent className="text-xs text-gray-600 space-y-2"><p>Indian commercial fleet retreading ecosystem valued at {'\u20B9'}12,000 crore annually with 2,800+ retreading plants across NHAI highway corridor network. ARAI and IRC approved retread process for 295/80R22.5 and 10.00-20 truck tyres extending tyre life by 60-70% at 40% cost of new tyre. NHAI toll-free heavy axle load norms (44 tonnes for 6-axle) impact tyre wear patterns and replacement cycles monitored via fleet TPMS data. Integration with FASTag toll plaza data for route-wise tyre wear analytics. Retread tyre E-Way Bill tracking under GST with Reverse Charge Mechanism for unorganized sector compliance.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-yellow-800">Operational</span><span className="text-gray-400">FY2027</span></div></CardContent></Card>
            <Card className="rtl-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">AI Tyre Wear Prediction & Fleet TPMS Sensor Analytics</CardTitle></CardHeader>
            <CardContent className="text-xs text-gray-600 space-y-2"><p>Machine learning tyre wear prediction models trained on 15 million km of Indian highway driving data from 45,000+ fleet vehicles equipped with TPMS sensors. Real-time tyre pressure and temperature monitoring via IoT TPMS sensors deployed across NH-44, NH-48, and NH-2 golden quadrilateral corridors. Predictive replacement scheduling reducing fleet downtime by 32% and fuel consumption by 4.8% through optimal pressure maintenance. Computer vision tyre tread depth scanning at 120 warehouse checkpoints across India. Integration with vehicle telematics for driver behaviour-based wear analytics and route-specific load mapping for Indian road conditions including pothole impact indexing on NHAI and state highway networks.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-red-800">Innovation</span><span className="text-gray-400">Pilot</span></div></CardContent></Card>
          </div>

        </TabsContent>
      </Tabs>
    </div>
  )
}
