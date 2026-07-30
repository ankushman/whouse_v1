import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#7c3aed', '#6d28d9', '#8b5cf6', '#a78bfa', '#c4b5fd', '#5b21b6', '#4c1d95', '#ddd6fe']

const LUXURY_CATEGORIES = ['Diamonds', 'Gold Jewelry', 'Watches', 'Designer Bags', 'Fine Art', 'Luxury Fragrances', 'Premium Wine', 'Silk Fabrics']
const SECURITY_LEVELS = ['Vault Grade A', 'Vault Grade B', 'High Security', 'Standard', 'Transit']
const HANDLING_STATUS = ['Authenticated', 'In Vault', 'In Transit', 'Customs Cleared', 'Delivered', 'Pending Inspection']

const consignments = [
  { id: 'LUX-0001', category: 'Diamonds', description: '3.5ct Solitaire Ring GIA Certified', value_inr: 4850000, security: 'Vault Grade A', status: 'Authenticated', origin: 'Antwerp Belgium', destination: 'Mumbai HQ', handler: 'Brink\'s India', insured: true, received: '2026-07-30', weight_kg: 0.12, serial: 'GIA-7823491' },
  { id: 'LUX-0002', category: 'Gold Jewelry', description: '22K Temple Set 85g Bridal', value_inr: 6200000, security: 'Vault Grade A', status: 'In Vault', origin: 'Kolkata Workshop', destination: 'Delhi Boutique', handler: 'SecureIndia', insured: true, received: '2026-07-30', weight_kg: 0.085, serial: 'GJ-KOL-0042' },
  { id: 'LUX-0003', category: 'Watches', description: 'Rolex Submariner Date 41mm', value_inr: 1450000, security: 'High Security', status: 'In Transit', origin: 'Geneva Switzerland', destination: 'Bengaluru Client', handler: 'Malca-Amit', insured: true, received: '2026-07-29', weight_kg: 0.15, serial: 'RLX-4018529' },
  { id: 'LUX-0004', category: 'Designer Bags', description: 'Hermes Birkin 30 Togo Gold', value_inr: 2800000, security: 'High Security', status: 'Customs Cleared', origin: 'Paris France', destination: 'Mumbai Client', handler: 'DHL Express', insured: true, received: '2026-07-29', weight_kg: 1.2, serial: 'H-B30-68421' },
  { id: 'LUX-0005', category: 'Fine Art', description: 'MF Husain Oil on Canvas 48x36', value_inr: 12500000, security: 'Vault Grade A', status: 'Authenticated', origin: 'London Sotheby\'s', destination: 'Delhi Museum', handler: 'Crown Relocations', insured: true, received: '2026-07-28', weight_kg: 8.5, serial: 'FA-HUS-0182' },
  { id: 'LUX-0006', category: 'Luxury Fragrances', description: 'Creed Aventus 500ml Batch L01', value_inr: 185000, security: 'Standard', status: 'Delivered', origin: 'London UK', destination: 'Hyderabad Client', handler: 'FedEx India', insured: false, received: '2026-07-28', weight_kg: 0.6, serial: 'CR-AV-50192' },
  { id: 'LUX-0007', category: 'Premium Wine', description: 'Chateau Margaux 2015 Magnum', value_inr: 320000, security: 'High Security', status: 'In Transit', origin: 'Bordeaux France', destination: 'Mumbai Cellar', handler: 'TemperatureGuard', insured: true, received: '2026-07-27', weight_kg: 1.8, serial: 'CM-2015-M0045' },
  { id: 'LUX-0008', category: 'Silk Fabrics', description: 'Kanchipuram Bridal Sari 9yd Gold', value_inr: 450000, security: 'Standard', status: 'Pending Inspection', origin: 'Kanchipuram TN', destination: 'Chennai Boutique', handler: 'BlueDart', insured: false, received: '2026-07-27', weight_kg: 0.95, serial: 'SK-BR-20873' },
  { id: 'LUX-0009', category: 'Diamonds', description: '2.1ct Emerald Cut D-VVS1', value_inr: 3200000, security: 'Vault Grade A', status: 'In Vault', origin: 'Surat Workshop', destination: 'Jaipur Store', handler: 'Brink\'s India', insured: true, received: '2026-07-26', weight_kg: 0.04, serial: 'GIA-9234156' },
  { id: 'LUX-0010', category: 'Watches', description: 'Patek Philippe Nautilus 5711', value_inr: 8900000, security: 'Vault Grade A', status: 'Authenticated', origin: 'Geneva Switzerland', destination: 'Delhi Collector', handler: 'Malca-Amit', insured: true, received: '2026-07-26', weight_kg: 0.08, serial: 'PP-5711-8423' },
  { id: 'LUX-0011', category: 'Gold Jewelry', description: '18K Rose Gold Necklace 42g', value_inr: 3100000, security: 'High Security', status: 'Customs Cleared', origin: 'Dubai Gold Souk', destination: 'Mumbai Client', handler: 'SecureIndia', insured: true, received: '2026-07-25', weight_kg: 0.042, serial: 'RG-DXB-0156' },
  { id: 'LUX-0012', category: 'Designer Bags', description: 'Chanel Classic Flap Caviar Black', value_inr: 420000, security: 'Standard', status: 'Delivered', origin: 'Milan Italy', destination: 'Pune Client', handler: 'DHL Express', insured: false, received: '2026-07-25', weight_kg: 0.45, serial: 'CH-CF-98234' },
  { id: 'LUX-0013', category: 'Fine Art', description: 'Raza Bindu Acrylic 36x36', value_inr: 8700000, security: 'Vault Grade A', status: 'In Vault', origin: 'Mumbai Auction', destination: 'Delhi Gallery', handler: 'Crown Relocations', insured: true, received: '2026-07-24', weight_kg: 5.2, serial: 'FA-RZA-0045' },
  { id: 'LUX-0014', category: 'Premium Wine', description: 'Dom Perignon 2012 Case of 6', value_inr: 480000, security: 'High Security', status: 'In Transit', origin: 'Champagne France', destination: 'Gurgaon Cellar', handler: 'TemperatureGuard', insured: true, received: '2026-07-24', weight_kg: 7.8, serial: 'DP-2012-C0081' },
  { id: 'LUX-0015', category: 'Silk Fabrics', description: 'Banarasi Brocade Mekap Sari', value_inr: 280000, security: 'Standard', status: 'Pending Inspection', origin: 'Varanasi UP', destination: 'Lucknow Client', handler: 'India Post EMS', insured: false, received: '2026-07-23', weight_kg: 0.82, serial: 'BN-MK-51246' },
  { id: 'LUX-0016', category: 'Luxury Fragrances', description: 'Clive Christian No.1 100ml', value_inr: 650000, security: 'High Security', status: 'Authenticated', origin: 'London UK', destination: 'Mumbai VIP Client', handler: 'FedEx India', insured: true, received: '2026-07-23', weight_kg: 0.35, serial: 'CC-N1-23451' },
  { id: 'LUX-0017', category: 'Diamonds', description: '5.2ct Cushion Cut F-VS2', value_inr: 7800000, security: 'Vault Grade B', status: 'In Transit', origin: 'Antwerp Belgium', destination: 'Surat Processing', handler: 'Brink\'s India', insured: true, received: '2026-07-22', weight_kg: 0.18, serial: 'GIA-1045287' },
  { id: 'LUX-0018', category: 'Gold Jewelry', description: '24K Gold Bar 100g LBMA', value_inr: 920000, security: 'Vault Grade A', status: 'In Vault', origin: 'Mumbai Refinery', destination: 'Kochi Client', handler: 'SecureIndia', insured: true, received: '2026-07-22', weight_kg: 0.1, serial: 'LBMA-100G-389' },
  { id: 'LUX-0019', category: 'Watches', description: 'Audemars Piguet Royal Oak 15500', value_inr: 5600000, security: 'Vault Grade A', status: 'Customs Cleared', origin: 'Geneva Switzerland', destination: 'Chennai Collector', handler: 'Malca-Amit', insured: true, received: '2026-07-21', weight_kg: 0.12, serial: 'AP-RO-59102' },
  { id: 'LUX-0020', category: 'Fine Art', description: 'Anish Kapoor Mirror Steel 60in', value_inr: 18500000, security: 'Vault Grade A', status: 'Authenticated', origin: 'London Gallery', destination: 'Museum Mumbai', handler: 'Crown Relocations', insured: true, received: '2026-07-21', weight_kg: 42.0, serial: 'FA-KAP-0071' },
]

const genRecords = (start: number) => {
  const statuses = ['Authenticated', 'In Vault', 'In Transit', 'Customs Cleared', 'Delivered', 'Pending Inspection']
  const handlers = ['Brink\'s India', 'SecureIndia', 'Malca-Amit', 'DHL Express', 'Crown Relocations', 'FedEx India', 'TemperatureGuard', 'BlueDart']
  const origins = ['Antwerp Belgium', 'Surat Workshop', 'Geneva Switzerland', 'Paris France', 'London UK', 'Dubai Gold Souk', 'Mumbai Auction', 'Kolkata Workshop', 'Kanchipuram TN', 'Bordeaux France']
  const destinations = ['Mumbai HQ', 'Delhi Boutique', 'Bengaluru Client', 'Chennai Boutique', 'Jaipur Store', 'Hyderabad Client', 'Pune Client', 'Kochi Client']
  return Array.from({ length: 40 }, (_, i) => ({
    id: `LUX-${String(start + i).padStart(4, '0')}`,
    category: LUXURY_CATEGORIES[(start + i) % 8],
    description: `${LUXURY_CATEGORIES[(start + i) % 8]} Item ${(start + i) % 99 + 1}`,
    value_inr: Math.round(50000 + Math.random() * 15000000),
    security: SECURITY_LEVELS[(start + i) % 5],
    status: statuses[(start + i) % 6],
    origin: origins[(start + i) % 10],
    destination: destinations[(start + i) % 8],
    handler: handlers[(start + i) % 8],
    insured: Math.random() > 0.2,
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    weight_kg: Math.round((0.01 + Math.random() * 10) * 100) / 100,
    serial: `SN-${String(start + i).padStart(6, '0')}`,
  }))
}

const allConsignments = [...consignments, ...genRecords(21), ...genRecords(61)]

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

const filterGroups = [
  {
    key: 'category',
    label: 'Category',
    options: LUXURY_CATEGORIES.map(c => ({ label: c, value: c, count: allConsignments.filter(d => d.category === c).length })),
  },
  {
    key: 'security',
    label: 'Security Level',
    options: SECURITY_LEVELS.map(s => ({ label: s, value: s, count: allConsignments.filter(d => d.security === s).length })),
  },
  {
    key: 'status',
    label: 'Status',
    options: HANDLING_STATUS.map(s => ({ label: s, value: s, count: allConsignments.filter(d => d.status === s).length })),
  },
]

function CategoryBadge({ category }: { category: string }) {
  const colors: Record<string, string> = { Diamonds: 'bg-violet-100 text-violet-800', 'Gold Jewelry': 'bg-amber-100 text-amber-800', Watches: 'bg-slate-200 text-slate-800', 'Designer Bags': 'bg-pink-100 text-pink-800', 'Fine Art': 'bg-indigo-100 text-indigo-800', 'Luxury Fragrances': 'bg-purple-100 text-purple-800', 'Premium Wine': 'bg-red-100 text-red-800', 'Silk Fabrics': 'bg-orange-100 text-orange-800' }
  return <span className={`lux-category-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[category] || 'bg-gray-100 text-gray-800'}`}>{category}</span>
}

function SecurityBadge({ security }: { security: string }) {
  const colors: Record<string, string> = { 'Vault Grade A': 'bg-violet-200 text-violet-900', 'Vault Grade B': 'bg-indigo-200 text-indigo-900', 'High Security': 'bg-amber-200 text-amber-900', Standard: 'bg-gray-200 text-gray-700', Transit: 'bg-blue-200 text-blue-800' }
  return <span className={`lux-security-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${colors[security] || 'bg-gray-100 text-gray-700'}`}>{security}</span>
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { Authenticated: 'bg-green-100 text-green-800', 'In Vault': 'bg-violet-100 text-violet-800', 'In Transit': 'bg-blue-100 text-blue-800', 'Customs Cleared': 'bg-cyan-100 text-cyan-800', Delivered: 'bg-emerald-100 text-emerald-800', 'Pending Inspection': 'bg-amber-100 text-amber-800' }
  return <span className={`lux-status-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
}

function ValueBar({ value }: { value: number }) {
  const pct = ri(0, 100, (value / 20000000) * 100)
  const color = value >= 5000000 ? 'bg-violet-600' : value >= 1000000 ? 'bg-purple-500' : value >= 500000 ? 'bg-violet-400' : 'bg-violet-300'
  return <div className="lux-value-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`lux-value-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{'₹' + (value / 100000).toFixed(1) + 'L'}</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return <div className="lux-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="lux-ring-path" strokeLinecap="round" /></svg><span className="lux-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="lux-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="lux-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="lux-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
}

export default function LuxuryGoodsLogisticsView() {
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

  const filtered = allConsignments.filter(d => {
    const q = searchQuery.toLowerCase()
    if (q && !d.id.toLowerCase().includes(q) && !d.category.toLowerCase().includes(q) && !d.description.toLowerCase().includes(q) && !d.origin.toLowerCase().includes(q) && !d.destination.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(d[key as keyof typeof d] as string))
  })

  const totalValue = allConsignments.reduce((s, d) => s + d.value_inr, 0)
  const vaultCount = allConsignments.filter(d => d.status === 'In Vault').length
  const insuredCount = allConsignments.filter(d => d.insured).length
  const authenticatedCount = allConsignments.filter(d => d.status === 'Authenticated').length

  const monthlyData = [
    { month: 'Jan', shipments: 28, value_cr: 145, vault: 18 },
    { month: 'Feb', shipments: 35, value_cr: 198, vault: 22 },
    { month: 'Mar', shipments: 42, value_cr: 265, vault: 28 },
    { month: 'Apr', shipments: 38, value_cr: 220, vault: 25 },
    { month: 'May', shipments: 30, value_cr: 175, vault: 20 },
    { month: 'Jun', shipments: 25, value_cr: 152, vault: 16 },
    { month: 'Jul', shipments: 45, value_cr: 310, vault: 30 },
  ]
  const categoryData = LUXURY_CATEGORIES.map(c => ({ category: c, count: allConsignments.filter(d => d.category === c).length }))
  const securityData = SECURITY_LEVELS.map(s => ({ level: s, count: allConsignments.filter(d => d.security === s).length }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'consignments', label: 'Consignments' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="lux-container space-y-4">
      <PageHeader title="Luxury Goods Logistics" description="High-value consignment tracking with vault-grade security, insurance management, and chain-of-custody for diamonds, jewelry, art, and premium goods" />
      <ModuleBreadcrumb items={[{ label: 'Specialized Logistics' }, { label: 'Luxury Goods' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="lux-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="lux-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="lux-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Consignments" value={allConsignments.length.toString()} sub="All categories" />
            <KpiTile title="Total Value" value={`₹${(totalValue / 10000000).toFixed(1)}Cr`} sub="Insured + uninsured" />
            <KpiTile title="In Vault" value={vaultCount.toString()} sub="Secure storage" />
            <KpiTile title="Insured" value={`${insuredCount}`} sub={`${((insuredCount / allConsignments.length) * 100).toFixed(0)}% coverage`} />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={98} label="Vault Security" color="#7c3aed" />
            <HealthRing value={95} label="Chain of Custody" color="#6d28d9" />
            <HealthRing value={92} label="Authentication" color="#8b5cf6" />
            <HealthRing value={88} label="Insurance Coverage" color="#5b21b6" />
            <HealthRing value={96} label="GPS Tracking" color="#4c1d95" />
            <HealthRing value={91} label="Customs Clearance" color="#a78bfa" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lux-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Shipments & Value</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="shipments" stroke="#7c3aed" strokeWidth={2} /><Line type="monotone" dataKey="vault" stroke="#6d28d9" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card>
            <Card className="lux-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Consignments by Category</CardTitle></CardHeader><CardContent><BarChart data={categoryData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="category" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#7c3aed" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="lux-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Security Level Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={securityData} dataKey="count" nameKey="level" cx="50%" cy="50%" outerRadius={70} label={({ level, count }) => `${count}`}>{securityData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="consignments" className="lux-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allConsignments.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, category, description, origin, or destination..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="lux-table w-full text-sm">
              <thead><tr className="lux-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Category</th><th className="px-3 py-2 text-left font-medium">Security</th><th className="px-3 py-2 text-left font-medium">Status</th><th className="px-3 py-2 text-left font-medium">Value</th><th className="px-3 py-2 text-left font-medium">Insured</th><th className="px-3 py-2 text-left font-medium">Handler</th><th className="px-3 py-2 text-left font-medium">Origin</th><th className="px-3 py-2 text-left font-medium">Destination</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(d => (
                <tr key={d.id} className="lux-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{d.id}</td>
                  <td className="px-3 py-2"><CategoryBadge category={d.category} /></td>
                  <td className="px-3 py-2"><SecurityBadge security={d.security} /></td>
                  <td className="px-3 py-2"><StatusBadge status={d.status} /></td>
                  <td className="px-3 py-2"><ValueBar value={d.value_inr} /></td>
                  <td className="px-3 py-2 text-xs">{d.insured ? 'Yes' : 'No'}</td>
                  <td className="px-3 py-2 text-xs">{d.handler}</td>
                  <td className="px-3 py-2 text-xs">{d.origin}</td>
                  <td className="px-3 py-2 text-xs">{d.destination}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="lux-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg Consignment" value="₹32.5L" trend="+12.8% vs last quarter" />
            <ValueTile title="Vault Utilization" value="78.4%" trend="+5.2% busier" />
            <ValueTile title="Authentication Rate" value="94.1%" trend="+1.5% improved" />
            <ValueTile title="Insurance Claims" value="0.02%" trend="-0.01% reduced" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="lux-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Category Value Distribution</CardTitle></CardHeader><CardContent><BarChart data={LUXURY_CATEGORIES.map(c => ({ category: c, total: allConsignments.filter(d => d.category === c).reduce((s, d) => s + d.value_inr, 0) / 10000000 }))} width={400} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="category" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="total" fill="#6d28d9" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="lux-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Status Breakdown</CardTitle></CardHeader><CardContent><PieChart width={400} height={250}><Pie data={HANDLING_STATUS.map(s => ({ status: s, count: allConsignments.filter(d => d.status === s).length }))} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>{HANDLING_STATUS.map((_, i) => <Cell key={i} fill={['#22c55e','#7c3aed','#3b82f6','#06b6d4','#10b981','#f59e0b'][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="lux-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="lux-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">GIA Diamond Blockchain Authentication</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Integration with GIA (Gemological Institute of America) for real-time diamond certificate verification via blockchain. Each stone carries a tamper-proof digital passport from mine to retail. Reduces counterfeit risk from 4% to near-zero. 3,200+ stones verified in Q2 2026.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-violet-100 px-2 py-0.5 text-violet-800">Critical</span><span className="text-gray-400">Live</span></div></CardContent></Card>
            <Card className="lux-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Biometric Vault Access Control</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Multi-factor biometric access to Grade A vaults: retina scan + palm vein + time-based OTP. Zero unauthorized access attempts in 18 months of operation. Real-time audit trail with video surveillance. RBI-compliant cash handling for gold bar storage and high-value jewelry.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-purple-800">Operational</span><span className="text-gray-400">Q3 2026</span></div></CardContent></Card>
            <Card className="lux-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Temperature-Controlled Wine Logistics</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Dedicated 12-14 degree Celsius supply chain for premium wine and champagne from European vineyards to Indian cellars. IoT temperature logging with 0.1 degree accuracy and automatic deviation alerts. Partnership with 8 Michelin-star restaurants for white-glove last-mile delivery.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-indigo-800">Growth</span><span className="text-gray-400">FY2027</span></div></CardContent></Card>
            <Card className="lux-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">AI Art Provenance Verification</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Machine learning models trained on 500,000+ auction records to verify artwork provenance and detect potential forgeries. Spectral analysis integration for pigment authentication on paintings older than 100 years. Used by 3 major Indian museums and 12 private collectors.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-fuchsia-100 px-2 py-0.5 text-fuchsia-800">Innovation</span><span className="text-gray-400">Pilot</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
