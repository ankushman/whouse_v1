import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#7c3aed', '#6d28d9', '#8b5cf6', '#a78bfa', '#c4b5fd', '#5b21b6', '#4c1d95', '#ddd6fe']

const GEM_TYPES = ['Diamonds', 'Gold Bullion', 'Ruby', 'Emerald', 'Sapphire', 'Pearls', 'Platinum', 'Kundan Sets']
const JEWELLERS = ['Tanishq Bangalore', 'Kalyan Chennai', 'Malabar Kochi', 'PC Jeweller Delhi', 'Titan Caratlane', 'Senco Kolkata', 'TBZ Mumbai', 'Gitanjali Surat']
const CUSTODY_STATUS = ['BIS Hallmarked', 'Under Assay', 'In Transit', 'Vault Stored', 'Customs Cleared', 'Pending Audit']

const gemRecords = [
  { id: 'GJL-0001', gem: 'Diamonds', description: 'Round Brilliant Cut 2.5ct VVS1 D IF GIA Cert', jeweller: 'Tanishq Bangalore', quantity: 150, unit: 'carats', custody_status: 'BIS Hallmarked', lot: 'LOT-GJL-9041', destination: 'Tanishq Hub Bengaluru', received: '2026-07-30', batch: 'GJL-B2026-0721', cost_inr: 285000000, clarity_grade: 'VVS1', karat_purity: 99.9 },
  { id: 'GJL-0002', gem: 'Gold Bullion', description: '24K London Good Delivery Bar 999.9 Fine 12.5kg', jeweller: 'Malabar Kochi', quantity: 42, unit: 'bars', custody_status: 'Vault Stored', lot: 'LOT-GJL-9038', destination: 'Malabar Vault Ernakulam', received: '2026-07-30', batch: 'GJL-B2026-0720', cost_inr: 780000000, clarity_grade: 'N/A', karat_purity: 99.9 },
  { id: 'GJL-0003', gem: 'Ruby', description: 'Natural Burma Ruby 3.8ct Pigeon Blood Unheated GRS', jeweller: 'Kalyan Chennai', quantity: 85, unit: 'carats', custody_status: 'Under Assay', lot: 'LOT-GJL-9012', destination: 'Kalyan Gem Lab Chennai', received: '2026-07-29', batch: 'GJL-B2026-0719', cost_inr: 142000000, clarity_grade: 'VS1', karat_purity: 0 },
  { id: 'GJL-0004', gem: 'Emerald', description: 'Colombian Emerald 5.2ct Grass Green Gubelin Cert', jeweller: 'PC Jeweller Delhi', quantity: 60, unit: 'carats', custody_status: 'Customs Cleared', lot: 'LOT-GJL-9027', destination: 'PC Jeweller Vault Noida', received: '2026-07-29', batch: 'GJL-B2026-0718', cost_inr: 98000000, clarity_grade: 'VS2', karat_purity: 0 },
  { id: 'GJL-0005', gem: 'Sapphire', description: 'Sri Lanka Blue Sapphire 4.1ct Royal Blue Untreated', jeweller: 'Titan Caratlane', quantity: 45, unit: 'carats', custody_status: 'BIS Hallmarked', lot: 'LOT-GJL-9031', destination: 'Caratlane Safe Hyderabad', received: '2026-07-28', batch: 'GJL-B2026-0716', cost_inr: 67000000, clarity_grade: 'VVS2', karat_purity: 0 },
  { id: 'GJL-0006', gem: 'Pearls', description: 'South Sea Pearl 14mm Golden AAA Grade Strand', jeweller: 'Senco Kolkata', quantity: 320, unit: 'pieces', custody_status: 'In Transit', lot: 'LOT-GJL-9040', destination: 'Senco Gallery Kolkata', received: '2026-07-28', batch: 'GJL-B2026-0715', cost_inr: 45000000, clarity_grade: 'AAA', karat_purity: 0 },
  { id: 'GJL-0007', gem: 'Platinum', description: '950 Pt Platinum Bar 1kg London Platinum Fix', jeweller: 'TBZ Mumbai', quantity: 28, unit: 'bars', custody_status: 'Vault Stored', lot: 'LOT-GJL-9008', destination: 'TBZ Strongroom Mumbai', received: '2026-07-27', batch: 'GJL-B2026-0714', cost_inr: 195000000, clarity_grade: 'N/A', karat_purity: 95.0 },
  { id: 'GJL-0008', gem: 'Kundan Sets', description: 'Rajasthani Kundan Polki Bridal Set 22K 180g', jeweller: 'Gitanjali Surat', quantity: 12, unit: 'sets', custody_status: 'Pending Audit', lot: 'LOT-GJL-9037', destination: 'Gitanjali Workshop Surat', received: '2026-07-27', batch: 'GJL-B2026-0713', cost_inr: 58000000, clarity_grade: 'N/A', karat_purity: 91.6 },
  { id: 'GJL-0009', gem: 'Diamonds', description: 'Princess Cut 1.8ct E VS2 IGI Certified Loose', jeweller: 'Malabar Kochi', quantity: 200, unit: 'carats', custody_status: 'BIS Hallmarked', lot: 'LOT-GJL-9039', destination: 'Malabar Hub Trivandrum', received: '2026-07-26', batch: 'GJL-B2026-0711', cost_inr: 168000000, clarity_grade: 'VS2', karat_purity: 0 },
  { id: 'GJL-0010', gem: 'Gold Bullion', description: '22K Gold Biscuit 10g BIS Hallmark 916', jeweller: 'Kalyan Chennai', quantity: 15000, unit: 'units', custody_status: 'In Transit', lot: 'LOT-GJL-9026', destination: 'Kalyan Vault Coimbatore', received: '2026-07-26', batch: 'GJL-B2026-0710', cost_inr: 920000000, clarity_grade: 'N/A', karat_purity: 91.6 },
  { id: 'GJL-0011', gem: 'Ruby', description: 'Thai Ruby 2.4ct Heated SI GRS Bangkok Cert', jeweller: 'Titan Caratlane', quantity: 120, unit: 'carats', custody_status: 'Under Assay', lot: 'LOT-GJL-9011', destination: 'Caratlane Lab Bengaluru', received: '2026-07-25', batch: 'GJL-B2026-0708', cost_inr: 72000000, clarity_grade: 'SI1', karat_purity: 0 },
  { id: 'GJL-0012', gem: 'Emerald', description: 'Zambian Emerald 3.1ct Green GIA Certified', jeweller: 'PC Jeweller Delhi', quantity: 75, unit: 'carats', custody_status: 'Customs Cleared', lot: 'LOT-GJL-9007', destination: 'PC Jeweller Hub Jaipur', received: '2026-07-25', batch: 'GJL-B2026-0707', cost_inr: 56000000, clarity_grade: 'SI2', karat_purity: 0 },
  { id: 'GJL-0013', gem: 'Sapphire', description: 'Madagascar Yellow Sapphire 4.5ct Unheated', jeweller: 'Senco Kolkata', quantity: 35, unit: 'carats', custody_status: 'BIS Hallmarked', lot: 'LOT-GJL-9030', destination: 'Senco Vault Howrah', received: '2026-07-24', batch: 'GJL-B2026-0705', cost_inr: 41000000, clarity_grade: 'VVS1', karat_purity: 0 },
  { id: 'GJL-0014', gem: 'Pearls', description: 'Japanese Akoya Pearl 8mm AAA White Strand 18inch', jeweller: 'TBZ Mumbai', quantity: 480, unit: 'pieces', custody_status: 'In Transit', lot: 'LOT-GJL-9025', destination: 'TBZ Gallery Pune', received: '2026-07-24', batch: 'GJL-B2026-0704', cost_inr: 32000000, clarity_grade: 'AAA', karat_purity: 0 },
  { id: 'GJL-0015', gem: 'Platinum', description: 'Pt950 Wedding Band Set 18g Engraved', jeweller: 'Tanishq Bangalore', quantity: 85, unit: 'sets', custody_status: 'Vault Stored', lot: 'LOT-GJL-9036', destination: 'Tanishq Vault Mysore', received: '2026-07-23', batch: 'GJL-B2026-0702', cost_inr: 24000000, clarity_grade: 'N/A', karat_purity: 95.0 },
  { id: 'GJL-0016', gem: 'Kundan Sets', description: 'Jadau Meenakari Temple Set 22K 220g Rajasthan', jeweller: 'Gitanjali Surat', quantity: 8, unit: 'sets', custody_status: 'Pending Audit', lot: 'LOT-GJL-9024', destination: 'Gitanjali Showroom Jaipur', received: '2026-07-23', batch: 'GJL-B2026-0701', cost_inr: 62000000, clarity_grade: 'N/A', karat_purity: 91.6 },
  { id: 'GJL-0017', gem: 'Diamonds', description: 'Emerald Cut 3.2ct G VS1 GIA Excellent Polish', jeweller: 'Kalyan Chennai', quantity: 95, unit: 'carats', custody_status: 'BIS Hallmarked', lot: 'LOT-GJL-9023', destination: 'Kalyan Hub Madurai', received: '2026-07-22', batch: 'GJL-B2026-0629', cost_inr: 210000000, clarity_grade: 'VS1', karat_purity: 0 },
  { id: 'GJL-0018', gem: 'Gold Bullion', description: '24K Gold Coin 1oz BIS Hallmark 999.9', jeweller: 'Malabar Kochi', quantity: 8000, unit: 'coins', custody_status: 'Vault Stored', lot: 'LOT-GJL-9022', destination: 'Malabar Safe Calicut', received: '2026-07-22', batch: 'GJL-B2026-0628', cost_inr: 580000000, clarity_grade: 'N/A', karat_purity: 99.9 },
  { id: 'GJL-0019', gem: 'Ruby', description: 'Mozambique Ruby 2.8ct Heated VVS1 GRS', jeweller: 'Senco Kolkata', quantity: 55, unit: 'carats', custody_status: 'Under Assay', lot: 'LOT-GJL-9010', destination: 'Senco Lab Guwahati', received: '2026-07-21', batch: 'GJL-B2026-0625', cost_inr: 49000000, clarity_grade: 'VVS1', karat_purity: 0 },
  { id: 'GJL-0020', gem: 'Emerald', description: 'Brazilian Emerald 4.0ct Green IGI Certified', jeweller: 'Titan Caratlane', quantity: 40, unit: 'carats', custody_status: 'Customs Cleared', lot: 'LOT-GJL-9021', destination: 'Caratlane Hub Mumbai', received: '2026-07-21', batch: 'GJL-B2026-0624', cost_inr: 38000000, clarity_grade: 'VS1', karat_purity: 0 },
]

const genRecords = (start: number) => {
  const statuses = ['BIS Hallmarked', 'Under Assay', 'In Transit', 'Vault Stored', 'Customs Cleared', 'Pending Audit']
  const destinations = ['Tanishq Hub Bengaluru', 'Malabar Vault Ernakulam', 'Kalyan Gem Lab Chennai', 'PC Jeweller Vault Noida', 'Caratlane Safe Hyderabad', 'Senco Gallery Kolkata', 'TBZ Strongroom Mumbai', 'Gitanjali Workshop Surat']
  return Array.from({ length: 40 }, (_, i) => ({
    id: `GJL-${String(start + i).padStart(4, '0')}`,
    gem: GEM_TYPES[(start + i) % 8],
    description: `${GEM_TYPES[(start + i) % 8]} Lot ${String((start + i) % 99 + 1).padStart(3, '0')}`,
    jeweller: JEWELLERS[(start + i) % 8],
    quantity: Math.round(5 + Math.random() * 500),
    unit: ['carats', 'bars', 'pieces', 'sets', 'units', 'coins', 'grams', 'lots'][i % 8],
    custody_status: statuses[(start + i) % 6],
    lot: `LOT-GJL-${String(9021 + start + i)}`,
    destination: destinations[(start + i) % 8],
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    batch: `GJL-B2026-${String(624 - Math.floor((start + i) / 3)).padStart(4, '0')}`,
    cost_inr: Math.round(5000000 + Math.random() * 500000000),
    clarity_grade: ['VVS1', 'VS1', 'VS2', 'SI1', 'AAA', 'N/A', 'VVS2', 'SI2'][i % 8],
    karat_purity: GEM_TYPES[(start + i) % 8].includes('Gold') || GEM_TYPES[(start + i) % 8].includes('Platinum') || GEM_TYPES[(start + i) % 8].includes('Kundan') ? Math.round((90 + Math.random() * 10) * 10) / 10 : 0,
  }))
}

const allGem = [...gemRecords, ...genRecords(21), ...genRecords(61)]

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

const filterGroups = [
  {
    key: 'gem',
    label: 'Gem Type',
    options: GEM_TYPES.map(t => ({ label: t, value: t, count: allGem.filter(r => r.gem === t).length })),
  },
  {
    key: 'jeweller',
    label: 'Jeweller',
    options: JEWELLERS.map(j => ({ label: j, value: j, count: allGem.filter(r => r.jeweller === j).length })),
  },
  {
    key: 'custody_status',
    label: 'Custody Status',
    options: CUSTODY_STATUS.map(s => ({ label: s, value: s, count: allGem.filter(r => r.custody_status === s).length })),
  },
]

function GemBadge({ gem }: { gem: string }) {
  const colors: Record<string, string> = { Diamonds: 'bg-sky-100 text-sky-800', 'Gold Bullion': 'bg-yellow-100 text-yellow-800', Ruby: 'bg-red-100 text-red-800', Emerald: 'bg-green-100 text-green-800', Sapphire: 'bg-blue-100 text-blue-800', Pearls: 'bg-amber-100 text-amber-100', Platinum: 'bg-gray-100 text-gray-800', 'Kundan Sets': 'bg-purple-100 text-purple-800' }
  return <span className={`gjl-gem-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[gem] || 'bg-gray-100 text-gray-800'}`}>{gem}</span>
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { 'BIS Hallmarked': 'bg-green-100 text-green-800', 'Under Assay': 'bg-yellow-100 text-yellow-800', 'In Transit': 'bg-blue-100 text-blue-800', 'Vault Stored': 'bg-cyan-100 text-cyan-800', 'Customs Cleared': 'bg-indigo-100 text-indigo-800', 'Pending Audit': 'bg-gray-200 text-gray-700' }
  return <span className={`gjl-status-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
}

function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 500000000) * 100)
  const color = cost >= 300000000 ? 'bg-violet-600' : cost >= 100000000 ? 'bg-violet-500' : cost >= 50000000 ? 'bg-violet-400' : 'bg-violet-300'
  return <div className="gjl-cost-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`gjl-cost-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{'₹' + (cost / 10000000).toFixed(1) + 'Cr'}</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return <div className="gjl-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="gjl-ring-path" strokeLinecap="round" /></svg><span className="gjl-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="gjl-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="gjl-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="gjl-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
}

export default function GemJewelleryLogisticsView() {
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

  const filtered = allGem.filter(g => {
    const q = searchQuery.toLowerCase()
    if (q && !g.id.toLowerCase().includes(q) && !g.gem.toLowerCase().includes(q) && !g.description.toLowerCase().includes(q) && !g.jeweller.toLowerCase().includes(q) && !g.destination.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(g[key as keyof typeof g] as string))
  })

  const totalCost = allGem.reduce((s, g) => s + g.cost_inr, 0)
  const hallmarked = allGem.filter(g => g.custody_status === 'BIS Hallmarked').length
  const inAssay = allGem.filter(g => g.custody_status === 'Under Assay').length

  const monthlyData = [
    { month: 'Jan', shipments: 42, value_cr: 180, purity: 99 },
    { month: 'Feb', shipments: 58, value_cr: 245, purity: 99 },
    { month: 'Mar', shipments: 85, value_cr: 380, purity: 98 },
    { month: 'Apr', shipments: 36, value_cr: 155, purity: 99 },
    { month: 'May', shipments: 72, value_cr: 310, purity: 98 },
    { month: 'Jun', shipments: 28, value_cr: 120, purity: 99 },
    { month: 'Jul', shipments: 95, value_cr: 420, purity: 99 },
  ]
  const gemData = GEM_TYPES.map(t => ({ gem: t, count: allGem.filter(r => r.gem === t).length }))
  const jewellerData = JEWELLERS.map(j => ({ jeweller: j, count: allGem.filter(r => r.jeweller === j).length }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'inventory', label: 'Inventory' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="gjl-container space-y-4">
      <PageHeader title="Gem & Jewellery Logistics" description="High-value gemstone and precious metal logistics with BIS hallmarking compliance, GIA/IGI certification tracking, RBI gold bond integration, and secure vault chain-of-custody across India's top jewellers and bullion dealers" />
      <ModuleBreadcrumb items={[{ label: 'Valuables' }, { label: 'Gems & Jewellery' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="gjl-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="gjl-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="gjl-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Consignments" value={allGem.length.toString()} sub="Gem & precious metal lots" />
            <KpiTile title="Total Value" value={`₹${(totalCost / 10000000).toFixed(0)}Cr`} sub="Vault inventory value" />
            <KpiTile title="BIS Hallmarked" value={hallmarked.toString()} sub={`${((hallmarked / allGem.length) * 100).toFixed(0)}% certified`} />
            <KpiTile title="Under Assay" value={inAssay.toString()} sub="Pending certification" />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={99} label="Diamond Clarity" color="#7c3aed" />
            <HealthRing value={98} label="Gold Purity" color="#6d28d9" />
            <HealthRing value={96} label="Ruby Grading" color="#8b5cf6" />
            <HealthRing value={97} label="Vault Security" color="#5b21b6" />
            <HealthRing value={95} label="Customs ETA" color="#4c1d95" />
            <HealthRing value={99} label="Chain Custody" color="#a78bfa" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="gjl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Shipment Volume & Purity Index</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="shipments" stroke="#7c3aed" strokeWidth={2} /><Line type="monotone" dataKey="purity" stroke="#6d28d9" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card>
            <Card className="gjl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Inventory by Gem Type</CardTitle></CardHeader><CardContent><BarChart data={gemData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="gem" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#7c3aed" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="gjl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Jeweller Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={jewellerData} dataKey="count" nameKey="jeweller" cx="50%" cy="50%" outerRadius={70} label={({ jeweller, count }) => `${count}`}>{jewellerData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="gjl-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allGem.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, gem type, jeweller, destination, or lot..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="gjl-table w-full text-sm">
              <thead><tr className="gjl-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Gem Type</th><th className="px-3 py-2 text-left font-medium">Status</th><th className="px-3 py-2 text-left font-medium">Qty</th><th className="px-3 py-2 text-left font-medium">Value</th><th className="px-3 py-2 text-left font-medium">Jeweller</th><th className="px-3 py-2 text-left font-medium">Destination</th><th className="px-3 py-2 text-left font-medium">Lot</th><th className="px-3 py-2 text-left font-medium">Purity</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(g => (
                <tr key={g.id} className="gjl-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{g.id}</td>
                  <td className="px-3 py-2"><GemBadge gem={g.gem} /></td>
                  <td className="px-3 py-2"><StatusBadge status={g.custody_status} /></td>
                  <td className="px-3 py-2 text-xs">{g.quantity.toLocaleString('en-IN')} {g.unit}</td>
                  <td className="px-3 py-2"><CostBar cost={g.cost_inr} /></td>
                  <td className="px-3 py-2 text-xs">{g.jeweller}</td>
                  <td className="px-3 py-2 text-xs">{g.destination}</td>
                  <td className="px-3 py-2 text-xs font-mono">{g.lot}</td>
                  <td className="px-3 py-2 text-xs">{g.karat_purity > 0 ? g.karat_purity + 'K' : g.clarity_grade}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="gjl-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg Lot Value" value="₹18.5Cr" trend="+12.4% vs last quarter" />
            <ValueTile title="Diamond Yield" value="97.2%" trend="+1.1% improved" />
            <ValueTile title="Gold Recovery" value="99.6%" trend="+0.3% on target" />
            <ValueTile title="Vault Utilization" value="82.4%" trend="+5.8% optimized" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="gjl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Value by Gem Category</CardTitle></CardHeader><CardContent><BarChart data={GEM_TYPES.map(t => ({ gem: t, total: allGem.filter(r => r.gem === t).reduce((s, r) => s + r.cost_inr, 0) / 10000000 }))} width={400} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="gem" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="total" fill="#6d28d9" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="gjl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Custody Status Breakdown</CardTitle></CardHeader><CardContent><PieChart width={400} height={250}><Pie data={CUSTODY_STATUS.map(s => ({ status: s, count: allGem.filter(g => g.custody_status === s).length }))} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>{CUSTODY_STATUS.map((_, i) => <Cell key={i} fill={['#22c55e','#eab308','#3b82f6','#06b6d4','#6366f1','#9ca3af'][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="gjl-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="gjl-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">BIS Hallmarking Digital Integration</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Bureau of Indian Standards (BIS) hallmarking real-time verification across 350+ hallmarking centres in India. HUID (Hallmark Unique Identification) tracking system integrated with jewellery logistics ensuring 100% traceability from assay to retail. Automated BIS registration renewal alerts for 14,500+ registered jewellers. Integration with Jewellers Association India (GJF) compliance database for annual audit scheduling. Real-time gold karat purity verification with XRF spectrometer data feed from 42 regional assay offices.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-violet-100 px-2 py-0.5 text-violet-800">Critical</span><span className="text-gray-400">Live</span></div></CardContent></Card>
            <Card className="gjl-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">GIA/IGI Certification Blockchain Vault</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Gemological Institute of America (GIA) and International Gemological Institute (IGI) certificate verification with immutable blockchain storage. Real-time cross-referencing of 4Cs (Cut, Color, Clarity, Carat) against submitted certificates detecting 99.7% forgery attempts. Automated alert system for lab-grown vs natural diamond classification ensuring transparent disclosure. Integration with 28 Indian customs ports for duty-free gold import verification under Advance Authorization scheme. Digital twin of each gemstone with 3D scanning for insurance claim validation.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-indigo-800">Strategic</span><span className="text-gray-400">Q3 2026</span></div></CardContent></Card>
            <Card className="gjl-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">RBI Sovereign Gold Bond Supply Tracking</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Reserve Bank of India Sovereign Gold Bond (SGB) series logistics and allotment tracking across 2026 tranche calendar. Automated allocation from RBI mint to 12,500+ post office distribution centres and 340+ bank branches. Real-time SGB redemption and maturity processing with 2.5% fixed interest tracking. Integration with India Bullion and Jewellers Association (IBJA) daily gold price feed for transparent pricing. SMS-based investor notification system for bond issuance, interest payment, and premature redemption across 48 lakh registered holders.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-purple-800">Operational</span><span className="text-gray-400">FY2027</span></div></CardContent></Card>
            <Card className="gjl-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">AI Gemstone Valuation & Fraud Detection</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Machine learning gemstone valuation model trained on 2.8 million historical transactions across IBJA auction data, Christie's and Sotheby's Indian sale records. Real-time anomaly detection identifying artificially enhanced or treated gemstones with 98.4% accuracy. Computer vision integration for automated clarity and color grading reducing human assay time by 65%. Predictive pricing engine for rough gemstone procurement from African and Australian mines via Gemfields and Rio Tinto supply channels. Integration with SEBI PMVVY gold deposit scheme compliance monitoring.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-fuchsia-100 px-2 py-0.5 text-fuchsia-800">Innovation</span><span className="text-gray-400">Pilot</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
