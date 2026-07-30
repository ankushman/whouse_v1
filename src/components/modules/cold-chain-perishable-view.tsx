import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#0891b2', '#0e7490', '#06b6d4', '#22d3ee', '#67e8f9', '#155e75', '#164e63', '#cffafe']

const COMMODITY_TYPES = ['Ice Cream & Desserts', 'Marine Seafood', 'Fresh Berries', 'Processed Meat', 'Dairy Butter Ghee', 'Pharma Biologics', 'Cut Flowers Orchids', 'Frozen Vegetables']
const COLD_FACILITIES = ['Snowman Logistics Chennai', 'Crystal Cold Pune', 'Fresh & Cool Delhi NCR', 'Kwik Cold Mumbai', 'ColdStar Bengaluru', 'Blue Ice Kolkata', 'Polar Warehousing Kochi', 'IceBerg Storage Hyderabad']
const STORAGE_STATUS = ['Temp Compliant', 'Minor Excursion', 'In Transit', 'Flash Frozen', 'Pending QA', 'Transfer In Progress']

const coldChainRecords = [
  { id: 'CCP-0001', commodity: 'Ice Cream & Desserts', description: 'Amul Gulab Jamun 50MT lot maintained at -25C continuous chain from Anand GCMMF plant to Delhi distribution hub with real-time IoT monitoring', facility: 'Fresh & Cool Delhi NCR', quantity: 50000, unit: 'kg', storage_status: 'Temp Compliant', lot: 'LOT-CCP-9051', destination: 'Amul Depot Noida UP', received: '2026-07-30', batch: 'CCP-B2026-0730', cost_inr: 8500000, temp_c: -25.1, shelf_life_days: 365 },
  { id: 'CCP-0002', commodity: 'Marine Seafood', description: 'Fresh shrimp Black Tiger 30MT IQF blast frozen at -40C exported from Visakhapatnam fishing harbor to Japan JAFIC certified', facility: 'Polar Warehousing Kochi', quantity: 30000, unit: 'kg', storage_status: 'Temp Compliant', lot: 'LOT-CCP-9048', destination: 'MPEDA Export Vizag AP', received: '2026-07-30', batch: 'CCP-B2026-0729', cost_inr: 42000000, temp_c: -40.0, shelf_life_days: 180 },
  { id: 'CCP-0003', commodity: 'Fresh Berries', description: 'Strawberry 12MT Mahabaleshwar export-grade maintained 2-4C air freight to Dubai Al Aweer market UAE phytosanitary certified', facility: 'ColdStar Bengaluru', quantity: 12000, unit: 'kg', storage_status: 'In Transit', lot: 'LOT-CCP-9045', destination: 'APEDA Export Mumbai', received: '2026-07-29', batch: 'CCP-B2026-0728', cost_inr: 14400000, temp_c: 3.2, shelf_life_days: 7 },
  { id: 'CCP-0004', commodity: 'Processed Meat', description: 'Al Kabeer buffalo meat 80MT halal certified frozen at -18C for Saudi Arabia Rabigh processing plant GCC import compliant', facility: 'Kwik Cold Mumbai', quantity: 80000, unit: 'kg', storage_status: 'Flash Frozen', lot: 'LOT-CCP-9042', destination: 'Al Kabeer AP Export', received: '2026-07-29', batch: 'CCP-B2026-0727', cost_inr: 64000000, temp_c: -18.5, shelf_life_days: 540 },
  { id: 'CCP-0005', commodity: 'Dairy Butter Ghee', description: 'Amul butter 25MT lot 4C refrigerated from GCMMF Anand to Mother Dairy Delhi distribution depot with FSSAI compliance', facility: 'Fresh & Cool Delhi NCR', quantity: 25000, unit: 'kg', storage_status: 'Temp Compliant', lot: 'LOT-CCP-9039', destination: 'Mother Dairy Delhi', received: '2026-07-28', batch: 'CCP-B2026-0726', cost_inr: 18750000, temp_c: 4.1, shelf_life_days: 90 },
  { id: 'CCP-0006', commodity: 'Pharma Biologics', description: 'Biocon insulin glargine 5MT 2-8C cold chain to Cipla Mumbai warehouse WHO-GMP certified GDP compliant temperature excursion report', facility: 'Crystal Cold Pune', quantity: 5000, unit: 'kg', storage_status: 'Temp Compliant', lot: 'LOT-CCP-9036', destination: 'Cipla Warehouse Mumbai', received: '2026-07-28', batch: 'CCP-B2026-0725', cost_inr: 95000000, temp_c: 5.8, shelf_life_days: 730 },
  { id: 'CCP-0007', commodity: 'Cut Flowers Orchids', description: 'Assam purple orchids 8MT 10-13C cold chain for Netherlands Aalsmeer auction VBN certified cut flower export logistics', facility: 'Blue Ice Kolkata', quantity: 8000, unit: 'kg', storage_status: 'In Transit', lot: 'LOT-CCP-9033', destination: 'APEDA Export Kolkata', received: '2026-07-27', batch: 'CCP-B2026-0724', cost_inr: 24000000, temp_c: 12.0, shelf_life_days: 14 },
  { id: 'CCP-0008', commodity: 'Frozen Vegetables', description: 'Green pea flash frozen 40MT from Azadpur mandi to McCain Foods India Mumbai processing facility IQF -35C with BRC certification', facility: 'Kwik Cold Mumbai', quantity: 40000, unit: 'kg', storage_status: 'Flash Frozen', lot: 'LOT-CCP-9030', destination: 'McCain Foods Mumbai', received: '2026-07-27', batch: 'CCP-B2026-0723', cost_inr: 16000000, temp_c: -35.2, shelf_life_days: 365 },
  { id: 'CCP-0009', commodity: 'Ice Cream & Desserts', description: 'Havmor premium ice cream 35MT -22C from Ahmedabad plant to Reliance Retail freezer cabinets across 450 stores in Gujarat', facility: 'IceBerg Storage Hyderabad', quantity: 35000, unit: 'kg', storage_status: 'Temp Compliant', lot: 'LOT-CCP-9027', destination: 'Reliance Retail Ahmedabad', received: '2026-07-26', batch: 'CCP-B2026-0722', cost_inr: 5250000, temp_c: -22.3, shelf_life_days: 365 },
  { id: 'CCP-0010', commodity: 'Marine Seafood', description: 'Indian mackerel 20MT blast frozen -38C for domestic modern trade DMart BigBasket supply chain from Cochin fisheries', facility: 'Polar Warehousing Kochi', quantity: 20000, unit: 'kg', storage_status: 'Temp Compliant', lot: 'LOT-CCP-9024', destination: 'DMart Supply Chain Pan-India', received: '2026-07-26', batch: 'CCP-B2026-0721', cost_inr: 18000000, temp_c: -38.0, shelf_life_days: 240 },
  { id: 'CCP-0011', commodity: 'Fresh Berries', description: 'Blueberry import 6MT from Chile reefer container maintained 1-3C JNPT Mumbai customs cold examination facility APEDA clearance', facility: 'Kwik Cold Mumbai', quantity: 6000, unit: 'kg', storage_status: 'Pending QA', lot: 'LOT-CCP-9021', destination: 'Nature Basket Mumbai', received: '2026-07-25', batch: 'CCP-B2026-0720', cost_inr: 36000000, temp_c: 2.5, shelf_life_days: 14 },
  { id: 'CCP-0012', commodity: 'Processed Meat', description: 'Venkateshwara Hatcheries frozen chicken 60MT -18C for KFC India supply chain from Taloja plant FSSAI CAF number verified', facility: 'Crystal Cold Pune', quantity: 60000, unit: 'kg', storage_status: 'Temp Compliant', lot: 'LOT-CCP-9018', destination: 'KFC Distribution Pune', received: '2026-07-25', batch: 'CCP-B2026-0719', cost_inr: 42000000, temp_c: -18.2, shelf_life_days: 365 },
  { id: 'CCP-0013', commodity: 'Dairy Butter Ghee', description: 'Mother Dairy paneer 15MT 0-4C from Safal plant to organized retail BigBasket and Zepto 10-min delivery dark store Kolkata', facility: 'Blue Ice Kolkata', quantity: 15000, unit: 'kg', storage_status: 'Transfer In Progress', lot: 'LOT-CCP-9015', destination: 'BigBasket Dark Store Kolkata', received: '2026-07-24', batch: 'CCP-B2026-0718', cost_inr: 6750000, temp_c: 3.8, shelf_life_days: 10 },
  { id: 'CCP-0014', commodity: 'Pharma Biologics', description: 'SII Covishield vaccine 8MT 2-8C GDP Phase-I monitoring from Pune serum institute to state vaccine stores Bihar Patna', facility: 'Crystal Cold Pune', quantity: 8000, unit: 'kg', storage_status: 'Temp Compliant', lot: 'LOT-CCP-9012', destination: 'State Vaccine Store Patna', received: '2026-07-24', batch: 'CCP-B2026-0717', cost_inr: 112000000, temp_c: 4.2, shelf_life_days: 270 },
  { id: 'CCP-0015', commodity: 'Cut Flowers Orchids', description: 'Kolkata rose exports 10MT 8-10C for Netherlands and UK Valentine season pre-booking VBN auction with ethylene scrubber', facility: 'Blue Ice Kolkata', quantity: 10000, unit: 'kg', storage_status: 'In Transit', lot: 'LOT-CCP-9009', destination: 'Kolkata Flower Market Export', received: '2026-07-23', batch: 'CCP-B2026-0716', cost_inr: 22000000, temp_c: 9.5, shelf_life_days: 10 },
  { id: 'CCP-0016', commodity: 'Frozen Vegetables', description: 'McCain french fries 45MT -18C from Mehsana Gujarat plant to McDonalds India distribution Hub Navi Mumbai supply chain', facility: 'Kwik Cold Mumbai', quantity: 45000, unit: 'kg', storage_status: 'Temp Compliant', lot: 'LOT-CCP-9006', destination: 'McDonalds Hub Mumbai', received: '2026-07-23', batch: 'CCP-B2026-0715', cost_inr: 22500000, temp_c: -18.0, shelf_life_days: 540 },
  { id: 'CCP-0017', commodity: 'Ice Cream & Desserts', description: 'Nestle Drumstick 28MT -20C from Ponda Goa factory to Swiggy Instamart 45-min grocery delivery across Bangalore metro', facility: 'ColdStar Bengaluru', quantity: 28000, unit: 'kg', storage_status: 'Minor Excursion', lot: 'LOT-CCP-9003', destination: 'Swiggy Instamart Bengaluru', received: '2026-07-22', batch: 'CCP-B2026-0714', cost_inr: 4200000, temp_c: -19.5, shelf_life_days: 365 },
  { id: 'CCP-0018', commodity: 'Marine Seafood', description: 'Vannamei shrimp 35MT IQF -40C from Nellore aquaculture to Walmart Best Price modern wholesale cash and carry India outlets', facility: 'Polar Warehousing Kochi', quantity: 35000, unit: 'kg', storage_status: 'Temp Compliant', lot: 'LOT-CCP-9050', destination: 'Walmart Hyderabad DC', received: '2026-07-22', batch: 'CCP-B2026-0713', cost_inr: 52500000, temp_c: -40.0, shelf_life_days: 180 },
  { id: 'CCP-0019', commodity: 'Fresh Berries', description: 'Mahabaleshwar strawberry 15MT 2-4C for Godrej Nature Basket premium retail export quality temperature monitored reefer truck', facility: 'ColdStar Bengaluru', quantity: 15000, unit: 'kg', storage_status: 'Temp Compliant', lot: 'LOT-CCP-9047', destination: 'Nature Basket Bengaluru', received: '2026-07-21', batch: 'CCP-B2026-0712', cost_inr: 27000000, temp_c: 3.0, shelf_life_days: 7 },
  { id: 'CCP-0020', commodity: 'Processed Meat', description: 'Licious fresh chicken 18MT 0-4C D2C direct-to-consumer order fulfillment from Bengaluru hub to 12 cities IoT-tracked boxes', facility: 'ColdStar Bengaluru', quantity: 18000, unit: 'kg', storage_status: 'Transfer In Progress', lot: 'LOT-CCP-9044', destination: 'Licious Hub Bengaluru', received: '2026-07-21', batch: 'CCP-B2026-0711', cost_inr: 27000000, temp_c: 2.8, shelf_life_days: 5 },
]

const genRecords = (start: number) => {
  const statuses = ['Temp Compliant', 'Minor Excursion', 'In Transit', 'Flash Frozen', 'Pending QA', 'Transfer In Progress']
  const destinations = ['Amul Depot Noida', 'MPEDA Export Vizag', 'APEDA Export Mumbai', 'Al Kabeer AP', 'Mother Dairy Delhi', 'Cipla Warehouse Mumbai', 'BigBasket Dark Store', 'DMart Supply Chain', 'Nature Basket Mumbai', 'KFC Distribution Pune', 'McDonalds Hub Mumbai', 'Walmart Hyderabad DC']
  return Array.from({ length: 40 }, (_, i) => ({
    id: `CCP-${String(start + i).padStart(4, '0')}`,
    commodity: COMMODITY_TYPES[(start + i) % 8],
    description: `${COMMODITY_TYPES[(start + i) % 8]} Lot ${String((start + i) % 99 + 1).padStart(3, '0')} cold chain consignment`,
    facility: COLD_FACILITIES[(start + i) % 8],
    quantity: Math.round(2000 + Math.random() * 80000),
    unit: 'kg',
    storage_status: statuses[(start + i) % 6],
    lot: `LOT-CCP-${String(9021 + start + i)}`,
    destination: destinations[(start + i) % 12],
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    batch: `CCP-B2026-${String(710 - Math.floor((start + i) / 3)).padStart(4, '0')}`,
    cost_inr: Math.round(3000000 + Math.random() * 110000000),
    temp_c: Math.round((-45 + Math.random() * 60) * 10) / 10,
    shelf_life_days: Math.round(5 + Math.random() * 725),
  }))
}

const allColdChain = [...coldChainRecords, ...genRecords(21), ...genRecords(61)]

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

const filterGroups = [
  {
    key: 'commodity',
    label: 'Commodity Type',
    options: COMMODITY_TYPES.map(t => ({ label: t, value: t, count: allColdChain.filter(r => r.commodity === t).length })),
  },
  {
    key: 'facility',
    label: 'Cold Storage Facility',
    options: COLD_FACILITIES.map(f => ({ label: f, value: f, count: allColdChain.filter(r => r.facility === f).length })),
  },
  {
    key: 'storage_status',
    label: 'Storage Status',
    options: STORAGE_STATUS.map(s => ({ label: s, value: s, count: allColdChain.filter(r => r.storage_status === s).length })),
  },
]

function CommodityBadge({ commodity }: { commodity: string }) {
  const colors: Record<string, string> = { 'Ice Cream & Desserts': 'bg-sky-100 text-sky-800', 'Marine Seafood': 'bg-blue-100 text-blue-800', 'Fresh Berries': 'bg-pink-100 text-pink-800', 'Processed Meat': 'bg-red-100 text-red-800', 'Dairy Butter Ghee': 'bg-yellow-100 text-yellow-800', 'Pharma Biologics': 'bg-violet-100 text-violet-800', 'Cut Flowers Orchids': 'bg-fuchsia-100 text-fuchsia-800', 'Frozen Vegetables': 'bg-green-100 text-green-800' }
  return <span className={`ccp-commodity-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[commodity] || 'bg-gray-100 text-gray-800'}`}>{commodity}</span>
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { 'Temp Compliant': 'bg-green-100 text-green-800', 'Minor Excursion': 'bg-yellow-100 text-yellow-800', 'In Transit': 'bg-blue-100 text-blue-800', 'Flash Frozen': 'bg-cyan-100 text-cyan-800', 'Pending QA': 'bg-orange-100 text-orange-800', 'Transfer In Progress': 'bg-gray-200 text-gray-700' }
  return <span className={`ccp-status-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
}

function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 120000000) * 100)
  const color = cost >= 80000000 ? 'bg-cyan-600' : cost >= 40000000 ? 'bg-cyan-500' : cost >= 15000000 ? 'bg-cyan-400' : 'bg-cyan-300'
  return <div className="ccp-cost-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`ccp-cost-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{'₹' + (cost / 10000000).toFixed(1) + 'Cr'}</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return <div className="ccp-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="ccp-ring-path" strokeLinecap="round" /></svg><span className="ccp-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="ccp-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="ccp-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="ccp-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
}

export default function ColdChainPerishableView() {
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

  const filtered = allColdChain.filter(e => {
    const q = searchQuery.toLowerCase()
    if (q && !e.id.toLowerCase().includes(q) && !e.commodity.toLowerCase().includes(q) && !e.description.toLowerCase().includes(q) && !e.facility.toLowerCase().includes(q) && !e.destination.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(e[key as keyof typeof e] as string))
  })

  const totalCost = allColdChain.reduce((s, e) => s + e.cost_inr, 0)
  const compliant = allColdChain.filter(e => e.storage_status === 'Temp Compliant').length
  const inTransit = allColdChain.filter(e => e.storage_status === 'In Transit').length
  const excursions = allColdChain.filter(e => e.storage_status === 'Minor Excursion').length

  const monthlyData = [
    { month: 'Jan', tons: 850, value_cr: 42, excursions: 3 },
    { month: 'Feb', tons: 1200, value_cr: 58, excursions: 5 },
    { month: 'Mar', tons: 1450, value_cr: 72, excursions: 2 },
    { month: 'Apr', tons: 980, value_cr: 48, excursions: 8 },
    { month: 'May', tons: 1650, value_cr: 85, excursions: 12 },
    { month: 'Jun', tons: 720, value_cr: 35, excursions: 15 },
    { month: 'Jul', tons: 1800, value_cr: 92, excursions: 6 },
  ]
  const commodityData = COMMODITY_TYPES.map(t => ({ commodity: t.split(' ').slice(0, 2).join(' '), count: allColdChain.filter(r => r.commodity === t).reduce((s, r) => s + r.quantity, 0) / 1000 }))
  const facilityData = COLD_FACILITIES.map(f => ({ facility: f.split(' ').slice(-2).join(' '), count: allColdChain.filter(r => r.facility === f).length }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'shipments', label: 'Shipments' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="ccp-container space-y-4">
      <PageHeader title="Cold Chain Perishable Logistics" description="Temperature-controlled supply chain management for perishable commodities including ice cream, seafood, berries, processed meat, dairy, pharma biologics, cut flowers, and frozen vegetables with FSSAI compliance, IoT real-time temperature monitoring, FSSAI food safety tracking, APEDA export certification, and multi-zone cold storage warehousing across 8 strategic locations in India" />
      <ModuleBreadcrumb items={[{ label: 'Perishables' }, { label: 'Cold Chain' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="ccp-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="ccp-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="ccp-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Consignments" value={allColdChain.length.toString()} sub="Cold chain lots" />
            <KpiTile title="Total Volume" value={`${(allColdChain.reduce((s, e) => s + e.quantity, 0) / 1000).toFixed(0)}T`} sub="Metric tonnes handled" />
            <KpiTile title="Total Value" value={`₹${(totalCost / 10000000).toFixed(0)}Cr`} sub="Cold chain value" />
            <KpiTile title="Temp Excursions" value={excursions.toString()} sub={`${((excursions / allColdChain.length) * 100).toFixed(1)}% breach rate`} />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={97} label="FSSAI Compliant" color="#0891b2" />
            <HealthRing value={95} label="Temp Within Range" color="#0e7490" />
            <HealthRing value={92} label="IoT Uptime" color="#06b6d4" />
            <HealthRing value={98} label="Delivery SLA" color="#155e75" />
            <HealthRing value={96} label="GDP Compliance" color="#164e63" />
            <HealthRing value={94} label="Shelf Life Used" color="#22d3ee" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="ccp-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Throughput & Excursion Count</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="tons" stroke="#0891b2" strokeWidth={2} /><Line type="monotone" dataKey="excursions" stroke="#0e7490" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card>
            <Card className="ccp-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Volume by Commodity Type (Tonnes)</CardTitle></CardHeader><CardContent><BarChart data={commodityData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="commodity" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#0891b2" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="ccp-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Cold Storage Facility Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={facilityData} dataKey="count" nameKey="facility" cx="50%" cy="50%" outerRadius={70} label={({ facility, count }) => `${count}`}>{facilityData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="ccp-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allColdChain.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, commodity, facility, destination, or lot..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="ccp-table w-full text-sm">
              <thead><tr className="ccp-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Commodity</th><th className="px-3 py-2 text-left font-medium">Status</th><th className="px-3 py-2 text-left font-medium">Volume</th><th className="px-3 py-2 text-left font-medium">Value</th><th className="px-3 py-2 text-left font-medium">Facility</th><th className="px-3 py-2 text-left font-medium">Destination</th><th className="px-3 py-2 text-left font-medium">Temp</th><th className="px-3 py-2 text-left font-medium">Shelf</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(e => (
                <tr key={e.id} className="ccp-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{e.id}</td>
                  <td className="px-3 py-2"><CommodityBadge commodity={e.commodity} /></td>
                  <td className="px-3 py-2"><StatusBadge status={e.storage_status} /></td>
                  <td className="px-3 py-2 text-xs">{(e.quantity / 1000).toFixed(1)}T</td>
                  <td className="px-3 py-2"><CostBar cost={e.cost_inr} /></td>
                  <td className="px-3 py-2 text-xs">{e.facility}</td>
                  <td className="px-3 py-2 text-xs">{e.destination}</td>
                  <td className="px-3 py-2 text-xs">{e.temp_c}°C</td>
                  <td className="px-3 py-2 text-xs">{e.shelf_life_days}d</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="ccp-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg Cold Chain SLA" value="96.8%" trend="+2.1% improved" />
            <ValueTile title="Excursion Rate" value="2.4%" trend="-0.8% reduced" />
            <ValueTile title="FSSAI Score" value="4.8/5" trend="+0.2 vs Q1" />
            <ValueTile title="Pharma GDP Score" value="99.5%" trend="+1.2% compliant" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="ccp-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Value by Commodity Category</CardTitle></CardHeader><CardContent><BarChart data={COMMODITY_TYPES.map(t => ({ commodity: t.split(' ').slice(0, 2).join(' '), total: allColdChain.filter(r => r.commodity === t).reduce((s, r) => s + r.cost_inr, 0) / 10000000 }))} width={400} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="commodity" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="total" fill="#0e7490" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="ccp-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Storage Status Breakdown</CardTitle></CardHeader><CardContent><PieChart width={400} height={250}><Pie data={STORAGE_STATUS.map(s => ({ status: s, count: allColdChain.filter(e => e.storage_status === s).length }))} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>{STORAGE_STATUS.map((_, i) => <Cell key={i} fill={['#22c55e','#eab308','#3b82f6','#06b6d4','#f97316','#9ca3af'][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="ccp-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="ccp-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">FSSAI Food Safety Compliance & Traceability</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Food Safety and Standards Authority of India (FSSAI) compliance tracking for 4,800+ cold chain operators across India with real-time hygiene rating monitoring and FSSAI license renewal automation. Integration with FoSCoS (Food Safety Compliance System) portal for annual return filing, product approval, and import license management. Blockchain-based farm-to-fork traceability for perishable commodities tracking 18 data points from farm gate to retail shelf including temperature, humidity, and handling compliance at each transfer point. Automated recall management system with 2-hour alert broadcast capability across supply chain nodes for contaminated or temperature-excursion lots. IoT sensor network with 12,000+ temperature loggers providing 5-minute interval data feeds to FSSAI central dashboard for real-time compliance scoring.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-cyan-100 px-2 py-0.5 text-cyan-800">Critical</span><span className="text-gray-400">Live</span></div></CardContent></Card>
            <Card className="ccp-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">APEDA Agricultural & Processed Food Export Cold Chain</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Agricultural and Processed Food Products Export Development Authority (APEDA) cold chain export logistics management for 3,200+ registered exporters across 28 RCMC (Registration-cum-Membership Certificate) holders. Real-time export documentation automation including phytosanitary certificate, certificate of origin, and customs cold examination facility scheduling at 12 major seaports and 6 airports. Integration with Directorate General of Foreign Trade (DGFT) for MEIS/SCM export incentive tracking on temperature-sensitive agricultural products. Cold chain integrity scoring system for each export shipment based on temperature deviation, transit time, and handover compliance ensuring export quality standards for EU, USFDA, GCC, and Japan markets. Multi-modal reefer logistics optimization combining ocean reefer containers, air freight cold rooms, and road refrigerated trucks minimizing cold chain breaks at intermodal transfer points.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-sky-100 px-2 py-0.5 text-sky-800">National Mission</span><span className="text-gray-400">FY2026</span></div></CardContent></Card>
            <Card className="ccp-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Operation Greens & Integrated Cold Chain Infrastructure</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Ministry of Food Processing Industries (MoFPI) Operation Greens scheme integrated cold chain tracking covering 138 cold chain projects sanctioned under PMKSY with total investment exceeding {'₹'}4,200 crore. Real-time capacity utilization monitoring across 2,800+ cold storage chambers totaling 35 lakh MT capacity in 22 states with automated FPO (Farmer Producer Organization) booking and scheduling. Mega Food Park cold chain integration tracking inter-connected processing plants, cold storages, and ripening chambers with 48-hour delivery SLA from farm gate to retail. Integration with National Horticulture Board (NHB) for horticulture crop-specific cold chain protocols managing 42 crop varieties with unique temperature and humidity profiles. AI-powered demand forecasting reducing cold storage wastage from 18% to 8% through predictive shelf-life management and dynamic pricing for near-expiry perishable inventory.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-teal-100 px-2 py-0.5 text-teal-800">Strategic</span><span className="text-gray-400">Q4 2026</span></div></CardContent></Card>
            <Card className="ccp-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">AI IoT Temperature Excursion Prediction & Dynamic Routing</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Machine learning model predicting temperature excursion events 4 hours in advance with 94% accuracy using IoT sensor data fusion from 12,000+ monitoring points across the cold chain network. Real-time dynamic re-routing algorithm automatically diverting refrigerated shipments away from high-risk corridors during summer peak hours and congestion zones reducing excursion incidents by 42%. Digital twin simulation for each cold chain lane modeling thermal performance of reefer containers and insulated trucks under Indian weather conditions with ambient temperature, humidity, and solar radiation inputs. Integration with India Meteorological Department (IMD) weather forecast API for 7-day heat wave and monsoon disruption prediction enabling proactive cold chain contingency planning. Automated quality degradation model estimating remaining shelf life at SKU level based on cumulative temperature exposure enabling near-expiry inventory prioritization for quick-sale channels.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-lime-100 px-2 py-0.5 text-lime-800">Innovation</span><span className="text-gray-400">Pilot</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
