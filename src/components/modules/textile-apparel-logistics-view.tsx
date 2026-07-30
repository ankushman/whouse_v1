import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#db2777', '#be185d', '#ec4899', '#f472b6', '#f9a8d4', '#9d174d', '#831843', '#fce7f3']

const GARMENT_TYPES = ['Cotton Sarees', 'Silk sarees', 'Ready-Made Garments', 'Denim Jeans', 'Knitwear', 'Handloom Fabrics', 'Technical Textiles', 'Home Textiles']
const MANUFACTURERS = ['Arvind Mills Ahmedabad', 'Welspun Mumbai', 'Raymond Thane', 'Gokaldas Exports Bengaluru', 'Orient Craft Noida', 'KPR Mill Coimbatore', 'Nahar Spinning Ludhiana', 'JCT Phagwara']
const DISPATCH_STATUS = ['Quality Certified', 'Under QC', 'Dispatched', 'In Warehouse', 'Label Pending', 'Pending Inspection']

const textileRecords = [
  { id: 'TAL-0001', garment: 'Cotton Sarees', description: 'Tant Baluchari Handloom 6.3m with Zari Border UNIDO certified', manufacturer: 'Nahar Spinning Ludhiana', quantity: 15000, unit: 'pieces', dispatch_status: 'Quality Certified', lot: 'LOT-TAL-9041', destination: 'NCUI Emporium Delhi', received: '2026-07-30', batch: 'TAL-B2026-0721', cost_inr: 28000000, dye_cert: 'OEKO-TEX 100', fabric_weight_gsm: 120 },
  { id: 'TAL-0002', garment: 'Ready-Made Garments', description: 'Men Cotton Polo Shirt 180 GSM Export to Zara EU FOB Mumbai', manufacturer: 'Orient Craft Noida', quantity: 45000, unit: 'pieces', dispatch_status: 'Dispatched', lot: 'LOT-TAL-9038', destination: 'APEDA Port Mumbai', received: '2026-07-30', batch: 'TAL-B2026-0720', cost_inr: 67500000, dye_cert: 'GOTS Organic', fabric_weight_gsm: 180 },
  { id: 'TAL-0003', garment: 'Silk sarees', description: 'Kanchipuram Pure Mulberry Silk 6.3m Temple Border GI Tagged', manufacturer: 'KPR Mill Coimbatore', quantity: 5000, unit: 'pieces', dispatch_status: 'Under QC', lot: 'LOT-TAL-9012', destination: 'Cooptex Chennai', received: '2026-07-29', batch: 'TAL-B2026-0719', cost_inr: 85000000, dye_cert: 'Silk Mark', fabric_weight_gsm: 85 },
  { id: 'TAL-0004', garment: 'Denim Jeans', description: 'Slim Fit Stretch Denim 12oz Indigo Wash for Levi\'s India Market', manufacturer: 'Arvind Mills Ahmedabad', quantity: 60000, unit: 'pieces', dispatch_status: 'Quality Certified', lot: 'LOT-TAL-9027', destination: 'Arvind Retail Bengaluru', received: '2026-07-29', batch: 'TAL-B2026-0718', cost_inr: 54000000, dye_cert: 'OEKO-TEX 100', fabric_weight_gsm: 340 },
  { id: 'TAL-0005', garment: 'Knitwear', description: 'Merino Wool Blend Sweater Gauge 12 Export to Marks & Spencer UK', manufacturer: 'Gokaldas Exports Bengaluru', quantity: 25000, unit: 'pieces', dispatch_status: 'Label Pending', lot: 'LOT-TAL-9031', destination: 'BGMEA Port Kolkata', received: '2026-07-28', batch: 'TAL-B2026-0716', cost_inr: 82000000, dye_cert: 'WRAP Certified', fabric_weight_gsm: 280 },
  { id: 'TAL-0006', garment: 'Handloom Fabrics', description: 'Ikat Pochampally Tie-Dye Cotton 2.5m Width GI Registration AP', manufacturer: 'JCT Phagwara', quantity: 8000, unit: 'meters', dispatch_status: 'In Warehouse', lot: 'LOT-TAL-9040', destination: 'Tribes India Hyd', received: '2026-07-28', batch: 'TAL-B2026-0715', cost_inr: 18000000, dye_cert: 'Handloom Mark', fabric_weight_gsm: 110 },
  { id: 'TAL-0007', garment: 'Technical Textiles', description: 'Aramid Fire Retardant Fabric 280gsm IS 15748 BIS Certified', manufacturer: 'Welspun Mumbai', quantity: 12000, unit: 'meters', dispatch_status: 'Pending Inspection', lot: 'LOT-TAL-9008', destination: 'CRPF Uniform Ghaziabad', received: '2026-07-27', batch: 'TAL-B2026-0714', cost_inr: 64000000, dye_cert: 'BIS IS 15748', fabric_weight_gsm: 280 },
  { id: 'TAL-0008', garment: 'Home Textiles', description: '1000TC Egyptian Cotton Bed Sheet King Size Export US Walmart', manufacturer: 'Welspun Mumbai', quantity: 35000, unit: 'sets', dispatch_status: 'Quality Certified', lot: 'LOT-TAL-9037', destination: 'DP World Nhava Sheva', received: '2026-07-27', batch: 'TAL-B2026-0713', cost_inr: 45000000, dye_cert: 'OEKO-TEX 100', fabric_weight_gsm: 150 },
  { id: 'TAL-0009', garment: 'Cotton Sarees', description: 'Chanderi Silk-Cotton 5.5m Gold Butti Handloom MP GI Tag', manufacturer: 'Raymond Thane', quantity: 8000, unit: 'pieces', dispatch_status: 'Under QC', lot: 'LOT-TAL-9039', destination: 'MP State Emporium Bhopal', received: '2026-07-26', batch: 'TAL-B2026-0711', cost_inr: 36000000, dye_cert: 'Handloom Mark', fabric_weight_gsm: 95 },
  { id: 'TAL-0010', garment: 'Ready-Made Garments', description: 'Women Rayon Palazzo Pants Export H&M EU AEO Certified', manufacturer: 'Orient Craft Noida', quantity: 70000, unit: 'pieces', dispatch_status: 'Dispatched', lot: 'LOT-TAL-9026', destination: 'AEPL JNPT Mumbai', received: '2026-07-26', batch: 'TAL-B2026-0710', cost_inr: 49000000, dye_cert: 'SA8000 Social', fabric_weight_gsm: 130 },
  { id: 'TAL-0011', garment: 'Denim Jeans', description: 'Baggy Fit Non-Stretch 14oz Raw Denim Selvedge Japan Style', manufacturer: 'Arvind Mills Ahmedabad', quantity: 30000, unit: 'pieces', dispatch_status: 'Quality Certified', lot: 'LOT-TAL-9011', destination: ' Numero Uno Ludhiana', received: '2026-07-25', batch: 'TAL-B2026-0708', cost_inr: 27000000, dye_cert: 'OEKO-TEX 100', fabric_weight_gsm: 400 },
  { id: 'TAL-0012', garment: 'Silk sarees', description: 'Banarasi Organza Jangla Jaal Pure Silk Bridal 6.3m GI GI Tag', manufacturer: 'KPR Mill Coimbatore', quantity: 2500, unit: 'pieces', dispatch_status: 'Pending Inspection', lot: 'LOT-TAL-9007', destination: 'UP Handloom Varanasi', received: '2026-07-25', batch: 'TAL-B2026-0707', cost_inr: 95000000, dye_cert: 'Silk Mark', fabric_weight_gsm: 78 },
  { id: 'TAL-0013', garment: 'Knitwear', description: 'Organic Cotton Baby Onesie 160 GSM GOTS Certified Mothercare', manufacturer: 'Gokaldas Exports Bengaluru', quantity: 85000, unit: 'pieces', dispatch_status: 'In Warehouse', lot: 'LOT-TAL-9030', destination: 'Mothercare Port Chennai', received: '2026-07-24', batch: 'TAL-B2026-0705', cost_inr: 38000000, dye_cert: 'GOTS Organic', fabric_weight_gsm: 160 },
  { id: 'TAL-0014', garment: 'Handloom Fabrics', description: 'Kashmir Pashmina Wool Shawl GI 100% Pashmina 2m x 1m', manufacturer: 'JCT Phagwara', quantity: 4000, unit: 'pieces', dispatch_status: 'Quality Certified', lot: 'LOT-TAL-9025', destination: 'Kashmir Government Srinagar', received: '2026-07-24', batch: 'TAL-B2026-0704', cost_inr: 68000000, dye_cert: 'GI Certified', fabric_weight_gsm: 75 },
  { id: 'TAL-0015', garment: 'Technical Textiles', description: 'Agriculture Shade Net 75% UV Stabilized HDPE 50m Roll IS 15867', manufacturer: 'Welspun Mumbai', quantity: 20000, unit: 'meters', dispatch_status: 'Dispatched', lot: 'LOT-TAL-9036', destination: 'NINAM Bhubaneswar', received: '2026-07-23', batch: 'TAL-B2026-0702', cost_inr: 22000000, dye_cert: 'BIS IS 15867', fabric_weight_gsm: 200 },
  { id: 'TAL-0016', garment: 'Home Textiles', description: 'Bath Towel Zero Twist 700GSM Ring Spun Cotton Taj Hotels Supply', manufacturer: 'Welspun Mumbai', quantity: 50000, unit: 'pieces', dispatch_status: 'Under QC', lot: 'LOT-TAL-9024', destination: 'Taj Group Mumbai', received: '2026-07-23', batch: 'TAL-B2026-0701', cost_inr: 32000000, dye_cert: 'Hygiene Certified', fabric_weight_gsm: 700 },
  { id: 'TAL-0017', garment: 'Cotton Sarees', description: 'Patola Double Ikat Rajkot Handloom 5m 4-Seli GI Tag Gujarat', manufacturer: 'Raymond Thane', quantity: 3000, unit: 'pieces', dispatch_status: 'Label Pending', lot: 'LOT-TAL-9023', destination: 'Garvi Gujarat Gandhinagar', received: '2026-07-22', batch: 'TAL-B2026-0629', cost_inr: 72000000, dye_cert: 'Handloom Mark', fabric_weight_gsm: 100 },
  { id: 'TAL-0018', garment: 'Ready-Made Garments', description: 'Kids School Uniform Cotton Polyester Blend 140 GSM CBSE 500 Schools', manufacturer: 'Nahar Spinning Ludhiana', quantity: 120000, unit: 'pieces', dispatch_status: 'Dispatched', lot: 'LOT-TAL-9022', destination: 'EPA Uniform Hub Delhi', received: '2026-07-22', batch: 'TAL-B2026-0628', cost_inr: 42000000, dye_cert: 'Azo-Free Dyes', fabric_weight_gsm: 140 },
  { id: 'TAL-0019', garment: 'Knitwear', description: 'Sports Dri-FIT Polyester Mesh Jersey FIFA Licensed Team Kit', manufacturer: 'KPR Mill Coimbatore', quantity: 40000, unit: 'pieces', dispatch_status: 'Quality Certified', lot: 'LOT-TAL-9010', destination: 'Nivia Sports Jalandhar', received: '2026-07-21', batch: 'TAL-B2026-0625', cost_inr: 56000000, dye_cert: 'OEKO-TEX 100', fabric_weight_gsm: 140 },
  { id: 'TAL-0020', garment: 'Denim Jeans', description: 'Women High-Rise Bootcut Stretch 10oz Stone Wash for Myntra', manufacturer: 'Arvind Mills Ahmedabad', quantity: 55000, unit: 'pieces', dispatch_status: 'In Warehouse', lot: 'LOT-TAL-9021', destination: 'Myntra Hub Bengaluru', received: '2026-07-21', batch: 'TAL-B2026-0624', cost_inr: 33000000, dye_cert: 'OEKO-TEX 100', fabric_weight_gsm: 300 },
]

const genRecords = (start: number) => {
  const statuses = ['Quality Certified', 'Under QC', 'Dispatched', 'In Warehouse', 'Label Pending', 'Pending Inspection']
  const destinations = ['NCUI Emporium Delhi', 'APEDA Port Mumbai', 'Cooptex Chennai', 'Arvind Retail Bengaluru', 'BGMEA Port Kolkata', 'Tribes India Hyd', 'CRPF Uniform Ghaziabad', 'DP World Nhava Sheva']
  return Array.from({ length: 40 }, (_, i) => ({
    id: `TAL-${String(start + i).padStart(4, '0')}`,
    garment: GARMENT_TYPES[(start + i) % 8],
    description: `${GARMENT_TYPES[(start + i) % 8]} Lot ${String((start + i) % 99 + 1).padStart(3, '0')}`,
    manufacturer: MANUFACTURERS[(start + i) % 8],
    quantity: Math.round(1000 + Math.random() * 99000),
    unit: ['pieces', 'meters', 'sets', 'rolls', 'bales', 'yards', 'reams', 'units'][i % 8],
    dispatch_status: statuses[(start + i) % 6],
    lot: `LOT-TAL-${String(9021 + start + i)}`,
    destination: destinations[(start + i) % 8],
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    batch: `TAL-B2026-${String(624 - Math.floor((start + i) / 3)).padStart(4, '0')}`,
    cost_inr: Math.round(5000000 + Math.random() * 95000000),
    dye_cert: ['OEKO-TEX 100', 'GOTS Organic', 'Silk Mark', 'WRAP Certified', 'Handloom Mark', 'BIS Certified', 'Azo-Free', 'GI Certified'][i % 8],
    fabric_weight_gsm: Math.round(60 + Math.random() * 640),
  }))
}

const allTextile = [...textileRecords, ...genRecords(21), ...genRecords(61)]

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

const filterGroups = [
  {
    key: 'garment',
    label: 'Garment Type',
    options: GARMENT_TYPES.map(t => ({ label: t, value: t, count: allTextile.filter(r => r.garment === t).length })),
  },
  {
    key: 'manufacturer',
    label: 'Manufacturer',
    options: MANUFACTURERS.map(m => ({ label: m, value: m, count: allTextile.filter(r => r.manufacturer === m).length })),
  },
  {
    key: 'dispatch_status',
    label: 'Dispatch Status',
    options: DISPATCH_STATUS.map(s => ({ label: s, value: s, count: allTextile.filter(r => r.dispatch_status === s).length })),
  },
]

function GarmentBadge({ garment }: { garment: string }) {
  const colors: Record<string, string> = { 'Cotton Sarees': 'bg-pink-100 text-pink-800', 'Silk sarees': 'bg-rose-100 text-rose-800', 'Ready-Made Garments': 'bg-fuchsia-100 text-fuchsia-800', 'Denim Jeans': 'bg-blue-100 text-blue-800', Knitwear: 'bg-orange-100 text-orange-800', 'Handloom Fabrics': 'bg-amber-100 text-amber-800', 'Technical Textiles': 'bg-green-100 text-green-800', 'Home Textiles': 'bg-purple-100 text-purple-800' }
  return <span className={`tal-garment-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[garment] || 'bg-gray-100 text-gray-800'}`}>{garment}</span>
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { 'Quality Certified': 'bg-green-100 text-green-800', 'Under QC': 'bg-yellow-100 text-yellow-800', Dispatched: 'bg-blue-100 text-blue-800', 'In Warehouse': 'bg-cyan-100 text-cyan-800', 'Label Pending': 'bg-orange-100 text-orange-800', 'Pending Inspection': 'bg-gray-200 text-gray-700' }
  return <span className={`tal-status-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
}

function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 100000000) * 100)
  const color = cost >= 80000000 ? 'bg-pink-600' : cost >= 40000000 ? 'bg-pink-500' : cost >= 20000000 ? 'bg-pink-400' : 'bg-pink-300'
  return <div className="tal-cost-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`tal-cost-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{'₹' + (cost / 10000000).toFixed(1) + 'Cr'}</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return <div className="tal-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="tal-ring-path" strokeLinecap="round" /></svg><span className="tal-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="tal-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="tal-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="tal-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
}

export default function TextileApparelLogisticsView() {
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

  const filtered = allTextile.filter(t => {
    const q = searchQuery.toLowerCase()
    if (q && !t.id.toLowerCase().includes(q) && !t.garment.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q) && !t.manufacturer.toLowerCase().includes(q) && !t.destination.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(t[key as keyof typeof t] as string))
  })

  const totalCost = allTextile.reduce((s, t) => s + t.cost_inr, 0)
  const certified = allTextile.filter(t => t.dispatch_status === 'Quality Certified').length
  const underQC = allTextile.filter(t => t.dispatch_status === 'Under QC').length

  const monthlyData = [
    { month: 'Jan', lots: 95, value_cr: 52, quality: 97 },
    { month: 'Feb', lots: 118, value_cr: 68, quality: 96 },
    { month: 'Mar', lots: 155, value_cr: 92, quality: 98 },
    { month: 'Apr', lots: 82, value_cr: 42, quality: 95 },
    { month: 'May', lots: 140, value_cr: 78, quality: 97 },
    { month: 'Jun', lots: 58, value_cr: 32, quality: 94 },
    { month: 'Jul', lots: 168, value_cr: 98, quality: 98 },
  ]
  const garmentData = GARMENT_TYPES.map(t => ({ garment: t, count: allTextile.filter(r => r.garment === t).length }))
  const mfrData = MANUFACTURERS.map(m => ({ manufacturer: m, count: allTextile.filter(r => r.manufacturer === m).length }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'shipments', label: 'Shipments' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="tal-container space-y-4">
      <PageHeader title="Textile & Apparel Logistics" description="India textile and apparel supply chain with Handloom Mark GI tagging, OEKO-TEX dye certification tracking, APEDA export documentation, and SAMARTH capacity building integration across 32 handloom clusters and 450+ textile mills" />
      <ModuleBreadcrumb items={[{ label: 'Apparel' }, { label: 'Textile Logistics' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="tal-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="tal-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="tal-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Lots" value={allTextile.length.toString()} sub="Textile consignments" />
            <KpiTile title="Total Value" value={`₹${(totalCost / 10000000).toFixed(0)}Cr`} sub="Inventory value" />
            <KpiTile title="Quality Certified" value={certified.toString()} sub={`${((certified / allTextile.length) * 100).toFixed(0)}% certified`} />
            <KpiTile title="Under QC" value={underQC.toString()} sub="Pending lab results" />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={97} label="OEKO-TEX Rate" color="#db2777" />
            <HealthRing value={94} label="GI Tag Coverage" color="#be185d" />
            <HealthRing value={92} label="Export Readiness" color="#ec4899" />
            <HealthRing value={96} label="Handloom Share" color="#9d174d" />
            <HealthRing value={91} label="Dye Compliance" color="#831843" />
            <HealthRing value={98} label="Label Accuracy" color="#f472b6" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="tal-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Lot Volume & Quality Index</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="lots" stroke="#db2777" strokeWidth={2} /><Line type="monotone" dataKey="quality" stroke="#be185d" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card>
            <Card className="tal-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Inventory by Garment Type</CardTitle></CardHeader><CardContent><BarChart data={garmentData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="garment" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#db2777" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="tal-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Manufacturer Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={mfrData} dataKey="count" nameKey="manufacturer" cx="50%" cy="50%" outerRadius={70} label={({ manufacturer, count }) => `${count}`}>{mfrData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="tal-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allTextile.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, garment type, manufacturer, destination, or lot..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="tal-table w-full text-sm">
              <thead><tr className="tal-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Garment</th><th className="px-3 py-2 text-left font-medium">Status</th><th className="px-3 py-2 text-left font-medium">Qty</th><th className="px-3 py-2 text-left font-medium">Value</th><th className="px-3 py-2 text-left font-medium">Manufacturer</th><th className="px-3 py-2 text-left font-medium">Destination</th><th className="px-3 py-2 text-left font-medium">Lot</th><th className="px-3 py-2 text-left font-medium">GSM</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(t => (
                <tr key={t.id} className="tal-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{t.id}</td>
                  <td className="px-3 py-2"><GarmentBadge garment={t.garment} /></td>
                  <td className="px-3 py-2"><StatusBadge status={t.dispatch_status} /></td>
                  <td className="px-3 py-2 text-xs">{t.quantity.toLocaleString('en-IN')} {t.unit}</td>
                  <td className="px-3 py-2"><CostBar cost={t.cost_inr} /></td>
                  <td className="px-3 py-2 text-xs">{t.manufacturer}</td>
                  <td className="px-3 py-2 text-xs">{t.destination}</td>
                  <td className="px-3 py-2 text-xs font-mono">{t.lot}</td>
                  <td className="px-3 py-2 text-xs">{t.fabric_weight_gsm}g</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="tal-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg Lot Value" value="₹5.8Cr" trend="+11.2% vs last quarter" />
            <ValueTile title="Handloom Share" value="32.4%" trend="+4.6% growing" />
            <ValueTile title="Export FOB" value="₹2.8Cr/day" trend="+8.5% increased" />
            <ValueTile title="GI Tagged SKUs" value="1,240" trend="+18.2% registered" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="tal-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Value by Garment Category</CardTitle></CardHeader><CardContent><BarChart data={GARMENT_TYPES.map(t => ({ garment: t, total: allTextile.filter(r => r.garment === t).reduce((s, r) => s + r.cost_inr, 0) / 10000000 }))} width={400} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="garment" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="total" fill="#be185d" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="tal-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Dispatch Status Breakdown</CardTitle></CardHeader><CardContent><PieChart width={400} height={250}><Pie data={DISPATCH_STATUS.map(s => ({ status: s, count: allTextile.filter(t => t.dispatch_status === s).length }))} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>{DISPATCH_STATUS.map((_, i) => <Cell key={i} fill={['#22c55e','#eab308','#3b82f6','#06b6d4','#f97316','#9ca3af'][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="tal-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="tal-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Handloom Mark & GI Tag Digital Registry</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>National Handloom Mark Authority (NHMA) digital registry tracking 32 handloom clusters across India with GI-tagged product authentication. Real-time Geographical Indication verification for Banarasi, Kanchipuram, Pochampally, Chanderi, Patola, and Pashmina ensuring 100% genuine provenance. Blockchain-based weaver identity authentication linking 2.8 lakh handloom weavers to their products via NFC-enabled tags. Integration with India Handloom Brand (IHB) portal for e-commerce marketplace direct-to-consumer traceability. AI-powered counterfeit detection model scanning marketplace listings for fake GI-tagged products with 94% accuracy across 12 platforms.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-pink-100 px-2 py-0.5 text-pink-800">Critical</span><span className="text-gray-400">Live</span></div></CardContent></Card>
            <Card className="tal-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">SAMARTH Textile Skill & Technology Upgradation</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Ministry of Textiles SAMARTH scheme monitoring 412 textile clusters with real-time technology upgradation tracking across spinning, weaving, and processing segments. Automated capital subsidy disbursement tracking for 1,850+ approved units under Technology Upgradation Fund Scheme (TUFS) with DBT integration. Real-time production capacity utilization monitoring across 450+ mills with IoT-enabled loom counting and energy metering. Integration with textile research associations (TRA) including BTRA, SITRA, MANTRA, and NITRA for standardized testing and certification workflows. AI-driven demand forecasting for RMG exports using US/EU retail inventory data and fashion trend analysis covering 85% of India textile export destinations.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-rose-800">Operational</span><span className="text-gray-400">Q3 2026</span></div></CardContent></Card>
            <Card className="tal-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">APEDA Export Documentation & AEO Integration</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Agricultural and Processed Food Products Export Development Authority (APEDA) RCMS integration for textile export documentation across 8,500+ registered exporters. Automated Export Obligation (EO) fulfillment tracking under Advance Authorization and EPCG schemes via DGFT portal. Authorized Economic Operator (AEO) certified factory fast-lane customs clearance reducing export container dwell time from 72 hours to 18 hours. Integration with Indian Merchandise Exports from India (MEIS) / RoDTEP scheme for real-time duty credit tracking and scrip utilization. Blockchain-based Certificate of Origin issuance reducing document preparation time by 65% for 3,800+ exporters.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-fuchsia-100 px-2 py-0.5 text-fuchsia-800">Strategic</span><span className="text-gray-400">FY2027</span></div></CardContent></Card>
            <Card className="tal-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">AI Fabric Defect Detection & Zero-Waste Pattern Cutting</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Computer vision fabric defect detection system scanning 480 meters of fabric per hour across 42 inspection stations detecting weaving, dyeing, and printing defects with 99.1% accuracy. AI-driven zero-waste pattern cutting algorithm reducing fabric utilization waste from 15% to 8% across 6,200+ garment styles saving 180 lakh meters annually. Integration with CAD/CAM systems (Gerber AccuMark, Lectra Modaris) for automated marker efficiency optimization achieving 92% fabric utilization. Predictive color matching engine reducing dye lab trial-and-error time by 55% using spectrophotometer data and historical shade libraries. Real-time production tracking via RFID-tagged fabric rolls from greige to finished garment maintaining 100% material traceability.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-purple-800">Innovation</span><span className="text-gray-400">Pilot</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
