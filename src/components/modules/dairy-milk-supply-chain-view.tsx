import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#0d9488', '#0f766e', '#14b8a6', '#2dd4bf', '#5eead4', '#115e59', '#134e4a', '#ccfbf1']

const DAIRY_TYPES = ['Liquid Milk', 'Curd/Yoghurt', 'Butter/Ghee', 'Cheese', 'Paneer', 'Ice Cream', 'Skimmed Milk Powder', 'Cream']
const DAIRIES = ['Amul Anand GCMMF', 'Mother Dairy Delhi', 'Nandini KMF Bengaluru', 'Aavin Chennai', 'Saras Jaipur RCDF', 'Vijaya Vijayawada', 'Milma Thiruvananthapuram', 'Gokul Kolhapur']
const COLLECTION_STATUS = ['Cold Chain Verified', 'Lab Tested', 'Dispatched', 'In Chilling', 'Held for Test', 'Pending Collection']

const dairyRecords = [
  { id: 'DMC-0001', dairy: 'Liquid Milk', description: 'Full Cream Milk 6.5% Fat Toned 500ml Tetra', plant: 'Amul Anand GCMMF', quantity: 85000, unit: 'litres', collection_status: 'Cold Chain Verified', tanker: 'BT-2026-0841', destination: 'Amul Delhi DC', received: '2026-07-30', batch: 'DMC-B2026-0721', cost_inr: 42500000, fat_pct: 6.5, snf_pct: 8.5 },
  { id: 'DMC-0002', dairy: 'Curd/Yoghurt', description: 'Mishti Doi Traditional Earthen Pot 400g', plant: 'Mother Dairy Delhi', quantity: 25000, unit: 'cups', collection_status: 'Dispatched', tanker: 'MD-2026-0038', destination: 'Safal Outlet Delhi', received: '2026-07-30', batch: 'DMC-B2026-0720', cost_inr: 7500000, fat_pct: 3.5, snf_pct: 8.0 },
  { id: 'DMC-0003', dairy: 'Butter/Ghee', description: 'Amul Ghee Carton 1L Poly Pouch 920g', plant: 'Amul Anand GCMMF', quantity: 15000, unit: 'cartons', collection_status: 'Lab Tested', tanker: 'BT-2026-0012', destination: 'Amul Mumbai Hub', received: '2026-07-29', batch: 'DMC-B2026-0719', cost_inr: 135000000, fat_pct: 99.5, snf_pct: 0.2 },
  { id: 'DMC-0004', dairy: 'Cheese', description: 'Amul Cheese Block 200g Processed', plant: 'Amul Anand GCMMF', quantity: 8000, unit: 'blocks', collection_status: 'Cold Chain Verified', tanker: 'BT-2026-0027', destination: 'Amul Bengaluru DC', received: '2026-07-29', batch: 'DMC-B2026-0718', cost_inr: 32000000, fat_pct: 26.0, snf_pct: 20.0 },
  { id: 'DMC-0005', dairy: 'Paneer', description: 'Amul Paneer 200g Fresh Vacuum Packed', plant: 'Nandini KMF Bengaluru', quantity: 35000, unit: 'packets', collection_status: 'In Chilling', tanker: 'KM-2026-0031', destination: 'Nandini Hub Mysore', received: '2026-07-28', batch: 'DMC-B2026-0716', cost_inr: 15750000, fat_pct: 18.0, snf_pct: 14.0 },
  { id: 'DMC-0006', dairy: 'Ice Cream', description: 'Amul Kulfi Matka 120ml National Winner', plant: 'Amul Anand GCMMF', quantity: 60000, unit: 'units', collection_status: 'Cold Chain Verified', tanker: 'BT-2026-0040', destination: 'Amul Kolkata DC', received: '2026-07-28', batch: 'DMC-B2026-0715', cost_inr: 24000000, fat_pct: 12.0, snf_pct: 7.5 },
  { id: 'DMC-0007', dairy: 'Skimmed Milk Powder', description: 'SMP Grade-A WMP 26% Fat ISO 9001', plant: 'Mother Dairy Delhi', quantity: 5000, unit: 'bags_25kg', collection_status: 'Lab Tested', tanker: 'MD-2026-0008', destination: 'NDDB Export Mumbai', received: '2026-07-27', batch: 'DMC-B2026-0714', cost_inr: 175000000, fat_pct: 1.5, snf_pct: 36.0 },
  { id: 'DMC-0008', dairy: 'Cream', description: 'Amul Fresh Cream 200ml 25% Fat Table', plant: 'Nandini KMF Bengaluru', quantity: 18000, unit: 'packets', collection_status: 'Dispatched', tanker: 'KM-2026-0037', destination: 'Nandini Hub Chennai', received: '2026-07-27', batch: 'DMC-B2026-0713', cost_inr: 9000000, fat_pct: 25.0, snf_pct: 6.5 },
  { id: 'DMC-0009', dairy: 'Liquid Milk', description: 'Double Toned Milk 1.5% Fat 500ml Pouch', plant: 'Aavin Chennai', quantity: 95000, unit: 'litres', collection_status: 'Cold Chain Verified', tanker: 'AV-2026-0039', destination: 'Aavin Madurai', received: '2026-07-26', batch: 'DMC-B2026-0711', cost_inr: 28500000, fat_pct: 1.5, snf_pct: 9.0 },
  { id: 'DMC-0010', dairy: 'Curd/Yoghurt', description: 'Nandini Curd 400g Set Cup Cardamom', plant: 'Nandini KMF Bengaluru', quantity: 42000, unit: 'cups', collection_status: 'Lab Tested', tanker: 'KM-2026-0026', destination: 'Nandini Hub Hyderabad', received: '2026-07-26', batch: 'DMC-B2026-0710', cost_inr: 14700000, fat_pct: 4.0, snf_pct: 8.5 },
  { id: 'DMC-0011', dairy: 'Butter/Ghee', description: 'Saras Ghee 1L Tin Carton GCMMF Spec', plant: 'Saras Jaipur RCDF', quantity: 10000, unit: 'cartons', collection_status: 'Held for Test', tanker: 'SR-2026-0011', destination: 'Saras Delhi Hub', received: '2026-07-25', batch: 'DMC-B2026-0708', cost_inr: 85000000, fat_pct: 99.7, snf_pct: 0.1 },
  { id: 'DMC-0012', dairy: 'Cheese', description: 'Amul Cheese Slice 100g Process 20-Slice', plant: 'Amul Anand GCMMF', quantity: 22000, unit: 'packs', collection_status: 'Dispatched', tanker: 'BT-2026-0025', destination: 'Amul Pune DC', received: '2026-07-25', batch: 'DMC-B2026-0707', cost_inr: 19800000, fat_pct: 25.0, snf_pct: 18.0 },
  { id: 'DMC-0013', dairy: 'Paneer', description: 'Mother Dairy Paneer 200g Chilled', plant: 'Mother Dairy Delhi', quantity: 28000, unit: 'packets', collection_status: 'Pending Collection', tanker: 'MD-2026-0030', destination: 'Mother Dairy Noida', received: '2026-07-24', batch: 'DMC-B2026-0705', cost_inr: 14000000, fat_pct: 17.0, snf_pct: 13.0 },
  { id: 'DMC-0014', dairy: 'Ice Cream', description: 'Amul Ice Cream Cup 150ml Butter Scotch', plant: 'Vijaya Vijayawada', quantity: 40000, unit: 'cups', collection_status: 'Cold Chain Verified', tanker: 'VJ-2026-0039', destination: 'Amul Secunderabad', received: '2026-07-24', batch: 'DMC-B2026-0704', cost_inr: 16000000, fat_pct: 11.0, snf_pct: 7.0 },
  { id: 'DMC-0015', dairy: 'Skimmed Milk Powder', description: 'Nandini SMP 500g Pouch ISO', plant: 'Nandini KMF Bengaluru', quantity: 12000, unit: 'pouches', collection_status: 'Lab Tested', tanker: 'KM-2026-0036', destination: 'KMF Mysore Factory', received: '2026-07-23', batch: 'DMC-B2026-0702', cost_inr: 96000000, fat_pct: 1.2, snf_pct: 36.5 },
  { id: 'DMC-0016', dairy: 'Cream', description: 'Amul Whipping Cream 250ml UHT 35% Fat', plant: 'Amul Anand GCMMF', quantity: 12000, unit: 'packets', collection_status: 'Cold Chain Verified', tanker: 'BT-2026-0037', destination: 'Amul Mumbai Bakery', received: '2026-07-23', batch: 'DMC-B2026-0701', cost_inr: 9600000, fat_pct: 35.0, snf_pct: 5.5 },
  { id: 'DMC-0017', dairy: 'Liquid Milk', description: 'Standardized Milk 4.5% Fat 500ml Pouch', plant: 'Milma Thiruvananthapuram', quantity: 62000, unit: 'litres', collection_status: 'Dispatched', tanker: 'ML-2026-0029', destination: 'Milma Kochi', received: '2026-07-22', batch: 'DMC-B2026-0629', cost_inr: 24800000, fat_pct: 4.5, snf_pct: 8.5 },
  { id: 'DMC-0018', dairy: 'Curd/Yoghurt', description: 'Milma Sambharam Buttermilk 200ml Pouch', plant: 'Milma Thiruvananthapuram', quantity: 150000, unit: 'pouches', collection_status: 'Cold Chain Verified', tanker: 'ML-2026-0028', destination: 'Milma Trivandrum Retail', received: '2026-07-22', batch: 'DMC-B2026-0628', cost_inr: 6000000, fat_pct: 2.0, snf_pct: 8.0 },
  { id: 'DMC-0019', dairy: 'Butter/Ghee', description: 'Gokul Ghee 1L Tin A2 Cow Ghee', plant: 'Gokul Kolhapur', quantity: 8000, unit: 'cartons', collection_status: 'Lab Tested', tanker: 'GK-2026-0010', destination: 'Gokul Pune Hub', received: '2026-07-21', batch: 'DMC-B2026-0625', cost_inr: 104000000, fat_pct: 99.8, snf_pct: 0.1 },
  { id: 'DMC-0020', dairy: 'Cheese', description: 'Gokul Cheddar 200g Block Aged 6-month', plant: 'Gokul Kolhapur', quantity: 5000, unit: 'blocks', collection_status: 'Cold Chain Verified', tanker: 'GK-2026-0024', destination: 'Gokul Delhi DC', received: '2026-07-21', batch: 'DMC-B2026-0624', cost_inr: 27500000, fat_pct: 32.0, snf_pct: 22.0 },
]

const genRecords = (start: number) => {
  const statuses = ['Cold Chain Verified', 'Lab Tested', 'Dispatched', 'In Chilling', 'Held for Test', 'Pending Collection']
  const destinations = ['Amul Delhi DC', 'Amul Mumbai Hub', 'Nandini Hub Mysore', 'Mother Dairy Noida', 'Saras Delhi Hub', 'Aavin Madurai', 'Milma Kochi', 'Gokul Pune Hub']
  return Array.from({ length: 40 }, (_, i) => ({
    id: `DMC-${String(start + i).padStart(4, '0')}`,
    dairy: DAIRY_TYPES[(start + i) % 8],
    description: `${DAIRY_TYPES[(start + i) % 8]} Batch ${String((start + i) % 99 + 1).padStart(3, '0')}`,
    plant: DAIRIES[(start + i) % 8],
    quantity: Math.round(500 + Math.random() * 99950),
    unit: ['litres', 'cups', 'cartons', 'blocks', 'packets', 'units', 'bags_25kg', 'pouches'][i % 8],
    collection_status: statuses[(start + i) % 6],
    tanker: `TK-${String(28470 + start + i).padStart(5, '0')}`,
    destination: destinations[(start + i) % 8],
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    batch: `DMC-B2026-${String(624 - Math.floor((start + i) / 3)).padStart(4, '0')}`,
    cost_inr: Math.round(2000000 + Math.random() * 200000000),
    fat_pct: Math.round((Math.random() * 40) * 10) / 10,
    snf_pct: Math.round((3 + Math.random() * 35) * 10) / 10,
  }))
}

const allDairy = [...dairyRecords, ...genRecords(21), ...genRecords(61)]

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

const filterGroups = [
  {
    key: 'dairy',
    label: 'Dairy Product',
    options: DAIRY_TYPES.map(d => ({ label: d, value: d, count: allDairy.filter(r => r.dairy === d).length })),
  },
  {
    key: 'plant',
    label: 'Plant / Dairy',
    options: DAIRIES.map(d => ({ label: d, value: d, count: allDairy.filter(r => r.plant === d).length })),
  },
  {
    key: 'collection_status',
    label: 'Collection Status',
    options: COLLECTION_STATUS.map(s => ({ label: s, value: s, count: allDairy.filter(r => r.collection_status === s).length })),
  },
]

function DairyBadge({ dairy }: { dairy: string }) {
  const colors: Record<string, string> = { 'Liquid Milk': 'bg-blue-100 text-blue-800', 'Curd/Yoghurt': 'bg-purple-100 text-purple-800', 'Butter/Ghee': 'bg-amber-100 text-amber-800', Cheese: 'bg-orange-100 text-orange-800', Paneer: 'bg-pink-100 text-pink-800', 'Ice Cream': 'bg-rose-100 text-rose-800', 'Skimmed Milk Powder': 'bg-gray-100 text-gray-800', Cream: 'bg-yellow-100 text-yellow-800' }
  return <span className={`dmc-dairy-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[dairy] || 'bg-gray-100 text-gray-800'}`}>{dairy}</span>
}

function CollectionBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { 'Cold Chain Verified': 'bg-teal-100 text-teal-800', 'Lab Tested': 'bg-green-100 text-green-800', Dispatched: 'bg-blue-100 text-blue-800', 'In Chilling': 'bg-cyan-100 text-cyan-800', 'Held for Test': 'bg-red-100 text-red-800', 'Pending Collection': 'bg-gray-200 text-gray-700' }
  return <span className={`dmc-collection-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
}

function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 200000000) * 100)
  const color = cost >= 100000000 ? 'bg-teal-600' : cost >= 50000000 ? 'bg-teal-500' : cost >= 10000000 ? 'bg-teal-400' : 'bg-teal-300'
  return <div className="dmc-cost-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`dmc-cost-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{'₹' + (cost / 10000000).toFixed(1) + 'Cr'}</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return <div className="dmc-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="dmc-ring-path" strokeLinecap="round" /></svg><span className="dmc-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="dmc-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="dmc-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="dmc-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
}

export default function DairyMilkSupplyChainView() {
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

  const filtered = allDairy.filter(d => {
    const q = searchQuery.toLowerCase()
    if (q && !d.id.toLowerCase().includes(q) && !d.dairy.toLowerCase().includes(q) && !d.description.toLowerCase().includes(q) && !d.plant.toLowerCase().includes(q) && !d.destination.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(d[key as keyof typeof d] as string))
  })

  const totalCost = allDairy.reduce((s, d) => s + d.cost_inr, 0)
  const coldChainOk = allDairy.filter(d => d.collection_status === 'Cold Chain Verified').length
  const inChilling = allDairy.filter(d => d.collection_status === 'In Chilling').length

  const monthlyData = [
    { month: 'Jan', collections: 320, volume_kl: 850, quality: 98 },
    { month: 'Feb', collections: 298, volume_kl: 790, quality: 97 },
    { month: 'Mar', collections: 345, volume_kl: 920, quality: 98 },
    { month: 'Apr', collections: 310, volume_kl: 830, quality: 96 },
    { month: 'May', collections: 285, volume_kl: 760, quality: 97 },
    { month: 'Jun', collections: 260, volume_kl: 690, quality: 95 },
    { month: 'Jul', collections: 355, volume_kl: 960, quality: 98 },
  ]
  const dairyData = DAIRY_TYPES.map(d => ({ dairy: d, count: allDairy.filter(r => r.dairy === d).length }))
  const plantData = DAIRIES.map(p => ({ plant: p, count: allDairy.filter(r => r.plant === p).length }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'collection', label: 'Collection' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="dmc-container space-y-4">
      <PageHeader title="Dairy & Milk Supply Chain" description="End-to-end milk and dairy product cold chain logistics with FSSAI compliance, village-level BMC collection, bulk chilling center monitoring, and multi-product distribution across Indian dairy cooperatives" />
      <ModuleBreadcrumb items={[{ label: 'Food Logistics' }, { label: 'Dairy & Milk' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="dmc-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="dmc-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="dmc-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Collections" value={allDairy.length.toString()} sub="Dairy consignments" />
            <KpiTile title="Total Value" value={`₹${(totalCost / 10000000).toFixed(0)}Cr`} sub="Inventory value" />
            <KpiTile title="Cold Chain OK" value={coldChainOk.toString()} sub={`${((coldChainOk / allDairy.length) * 100).toFixed(0)}% verified`} />
            <KpiTile title="In Chilling" value={inChilling.toString()} sub="At chilling centers" />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={98} label="Cold Chain" color="#0d9488" />
            <HealthRing value={97} label="FSSAI Compliant" color="#0f766e" />
            <HealthRing value={96} label="Fat Accuracy" color="#14b8a6" />
            <HealthRing value={95} label="BMC Collection" color="#115e59" />
            <HealthRing value={99} label="SNF Quality" color="#134e4a" />
            <HealthRing value={94} label="Shelf Life" color="#2dd4bf" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="dmc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Collection Volume & Quality</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="collections" stroke="#0d9488" strokeWidth={2} /><Line type="monotone" dataKey="quality" stroke="#0f766e" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card>
            <Card className="dmc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Shipments by Dairy Product</CardTitle></CardHeader><CardContent><BarChart data={dairyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="dairy" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#0d9488" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="dmc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Plant Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={plantData} dataKey="count" nameKey="plant" cx="50%" cy="50%" outerRadius={70} label={({ plant, count }) => `${count}`}>{plantData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="collection" className="dmc-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allDairy.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, product, plant, destination, or tanker..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="dmc-table w-full text-sm">
              <thead><tr className="dmc-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Product</th><th className="px-3 py-2 text-left font-medium">Status</th><th className="px-3 py-2 text-left font-medium">Qty</th><th className="px-3 py-2 text-left font-medium">Cost</th><th className="px-3 py-2 text-left font-medium">Plant</th><th className="px-3 py-2 text-left font-medium">Destination</th><th className="px-3 py-2 text-left font-medium">Tanker</th><th className="px-3 py-2 text-left font-medium">Fat%</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(d => (
                <tr key={d.id} className="dmc-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{d.id}</td>
                  <td className="px-3 py-2"><DairyBadge dairy={d.dairy} /></td>
                  <td className="px-3 py-2"><CollectionBadge status={d.collection_status} /></td>
                  <td className="px-3 py-2 text-xs">{d.quantity.toLocaleString('en-IN')} {d.unit}</td>
                  <td className="px-3 py-2"><CostBar cost={d.cost_inr} /></td>
                  <td className="px-3 py-2 text-xs">{d.plant}</td>
                  <td className="px-3 py-2 text-xs">{d.destination}</td>
                  <td className="px-3 py-2 text-xs font-mono">{d.tanker}</td>
                  <td className="px-3 py-2 text-xs">{d.fat_pct}%</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="dmc-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg Collection Vol" value="42,300 L" trend="+11.2% vs last quarter" />
            <ValueTile title="Cold Chain Compliance" value="97.8%" trend="+1.5% improved" />
            <ValueTile title="FSSAI Pass Rate" value="99.4%" trend="+0.3% improved" />
            <ValueTile title="Farmer Price" value="₹32.5/L" trend="+₹4.2 higher" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="dmc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Value by Dairy Category</CardTitle></CardHeader><CardContent><BarChart data={DAIRY_TYPES.map(d => ({ dairy: d, total: allDairy.filter(r => r.dairy === d).reduce((s, r) => s + r.cost_inr, 0) / 10000000 }))} width={400} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="dairy" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="total" fill="#0f766e" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="dmc-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Collection Status Breakdown</CardTitle></CardHeader><CardContent><PieChart width={400} height={250}><Pie data={COLLECTION_STATUS.map(s => ({ status: s, count: allDairy.filter(d => d.collection_status === s).length }))} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>{COLLECTION_STATUS.map((_, i) => <Cell key={i} fill={['#14b8a6','#22c55e','#3b82f6','#06b6d4','#ef4444','#9ca3af'][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="dmc-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="dmc-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">NDDB Village-Level BMC Collection Network</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>National Dairy Development Board managed Bulk Milk Cooler network across 1,96,000+ village-level Dairy Cooperative Societies (DCS). Real-time milk collection tracking from 18.5 lakh farmer members with automated fat/SNF testing via Lactometer and MilkoScan integration. Blockchain-enabled transparent farmer payment system ensuring 80% farm-gate price realization within 6 hours of collection. AI mastitis detection reducing rejected milk by 34%.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-teal-100 px-2 py-0.5 text-teal-800">Critical</span><span className="text-gray-400">Live</span></div></CardContent></Card>
            <Card className="dmc-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Amul-GCMMF Multi-Product Cold Chain Hub</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>GCMMF (Gujarat Cooperative Milk Marketing Federation) operating India's largest integrated dairy supply chain with 82 dairy plants processing 280 lakh litres/day. Real-time temperature monitoring across 4,200+ refrigerated milk tankers using IoT sensors ensuring sub-4C maintenance from village to processing plant. 18 mega distribution hubs with automated storage and retrieval systems (ASRS) handling 8,500+ SKUs. Last-mile delivery network of 10 lakh+ retail outlets across India.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-cyan-100 px-2 py-0.5 text-cyan-800">Operational</span><span className="text-gray-400">Q3 2026</span></div></CardContent></Card>
            <Card className="dmc-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">FSSAI Safe & Nutritious Milk Programme</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>FSSAI milk safety surveillance covering 12,000+ samples monthly from 700+ districts across India. Real-time compliance dashboard tracking A1/A2 milk type verification, adulteration detection (urea, starch, detergent, glucose), and antibiotic residue screening. Integration with state food safety authorities enabling automated recall triggers within 4 hours of non-compliance detection. 99.4% sample pass rate in FY2026, up from 92.1% in FY2024.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-800">Strategic</span><span className="text-gray-400">FY2027</span></div></CardContent></Card>
            <Card className="dmc-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">AI-Powered Demand Forecasting for Perishables</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Machine learning demand sensing model processing 85+ data streams including festival calendars (Pongal/Onam/Ganesh Chaturthi), school reopening dates, temperature forecasts, and regional consumption patterns. Forecast accuracy of 96.8% for liquid milk and 92.4% for curd/yoghurt across 7-day rolling windows. Dynamic production planning reducing milk wastage from 4.2% to 1.1% saving approximately USD 220M annually. Integration with Amul's real-time procurement app enabling instant farmer procurement adjustment.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-purple-800">Innovation</span><span className="text-gray-400">Pilot</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
