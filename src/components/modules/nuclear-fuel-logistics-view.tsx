import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#a16207', '#854d0e', '#ca8a04', '#eab308', '#facc15', '#713f12', '#92400e', '#fef3c7']

const FUEL_TYPES = ['UO2 Fuel Assemblies', 'LEU Pellets', 'MOX Fuel Rods', 'Spent Fuel Casks', 'Heavy Water', 'Zirconium Cladding', 'Control Rod Assemblies', 'Decommission Waste']
const FACILITIES = ['NPCIL Tarapur', 'NPCIL Rawatbhata', 'NPCIL Kalpakkam', 'NPCIL Kudankulam', 'BARC Trombay', 'BHAVINI Kalpakkam', 'DAE Hyderabad', 'IGCAR Kalpakkam']
const RADIATION_STATUS = ['AERB Approved', 'IAEA Safeguard', 'Under Inspection', 'Quarantined', 'Decommissioning', 'Pending Review']

const fuelRecords = [
  { id: 'NFL-0001', fuel: 'UO2 Fuel Assemblies', description: '17x17 PWR Fuel Bundle Enriched 4.2%', facility: 'NPCIL Kudankulam', quantity: 48, unit: 'assemblies', radiation: 'IAEA Safeguard', shipment: 'KS-2026-0041', origin: 'TVEL Russia', received: '2026-07-30', batch: 'NFL-B2026-0721', cost_inr: 285000000, half_life: 'N/A', dose_msv: 0.02 },
  { id: 'NFL-0002', fuel: 'LEU Pellets', description: 'UO2 Sintered Pellets 3.2% U-235', facility: 'NPCIL Tarapur', quantity: 12000, unit: 'pellets', radiation: 'AERB Approved', shipment: 'TP-2026-0038', origin: 'NPCIL Hyderabad', received: '2026-07-30', batch: 'NFL-B2026-0720', cost_inr: 42000000, half_life: '7.04E8 years', dose_msv: 0.01 },
  { id: 'NFL-0003', fuel: 'MOX Fuel Rods', description: 'Mixed Oxide PuO2+UO2 PHWR Bundle', facility: 'BARC Trombay', quantity: 12, unit: 'rods', radiation: 'Under Inspection', shipment: 'BR-2026-0012', origin: 'BARC Reprocessing', received: '2026-07-29', batch: 'NFL-B2026-0719', cost_inr: 156000000, half_life: '24,110 years', dose_msv: 0.85 },
  { id: 'NFL-0004', fuel: 'Spent Fuel Casks', description: 'TN-12 Spent Fuel Transport Cask DTF', facility: 'NPCIL Rawatbhata', quantity: 4, unit: 'casks', radiation: 'AERB Approved', shipment: 'RB-2026-0027', origin: 'RAPS Spent Fuel Pool', received: '2026-07-29', batch: 'NFL-B2026-0718', cost_inr: 98000000, half_life: 'N/A', dose_msv: 2.5 },
  { id: 'NFL-0005', fuel: 'Heavy Water', description: 'D2O Moderator Grade 99.9% Purity', facility: 'NPCIL Kalpakkam', quantity: 8000, unit: 'litres', radiation: 'IAEA Safeguard', shipment: 'KP-2026-0031', origin: 'HWB Kota', received: '2026-07-28', batch: 'NFL-B2026-0716', cost_inr: 32000000, half_life: 'N/A', dose_msv: 0.001 },
  { id: 'NFL-0006', fuel: 'Zirconium Cladding', description: 'Zircaloy-4 Tube 9.5mm OD x 0.57mm Wall', facility: 'NPCIL Kudankulam', quantity: 600, unit: 'tubes', radiation: 'AERB Approved', shipment: 'KS-2026-0040', origin: 'NFC Hyderabad', received: '2026-07-28', batch: 'NFL-B2026-0715', cost_inr: 18500000, half_life: 'N/A', dose_msv: 0.005 },
  { id: 'NFL-0007', fuel: 'Control Rod Assemblies', description: 'Ag-In-Cd Absorber Rod Cluster PHWR', facility: 'BHAVINI Kalpakkam', quantity: 6, unit: 'assemblies', radiation: 'Under Inspection', shipment: 'BV-2026-0008', origin: 'BARC Engineering', received: '2026-07-27', batch: 'NFL-B2026-0714', cost_inr: 72000000, half_life: 'N/A', dose_msv: 0.12 },
  { id: 'NFL-0008', fuel: 'Decommission Waste', description: 'Activiated Steel I-131 Low Level Waste', facility: 'NPCIL Tarapur', quantity: 2, unit: 'drums', radiation: 'Quarantined', shipment: 'TP-2026-0037', origin: 'TAPS Unit-1 Decom', received: '2026-07-27', batch: 'NFL-B2026-0713', cost_inr: 12500000, half_life: '8.02 days', dose_msv: 5.2 },
  { id: 'NFL-0009', fuel: 'UO2 Fuel Assemblies', description: '19x19 PWR Fuel Bundle Enriched 3.8%', facility: 'NPCIL Kudankulam', quantity: 36, unit: 'assemblies', radiation: 'IAEA Safeguard', shipment: 'KS-2026-0039', origin: 'TVEL Russia', received: '2026-07-26', batch: 'NFL-B2026-0711', cost_inr: 225000000, half_life: 'N/A', dose_msv: 0.02 },
  { id: 'NFL-0010', fuel: 'LEU Pellets', description: 'UO2 Sintered Pellets 4.1% U-235', facility: 'NPCIL Rawatbhata', quantity: 15000, unit: 'pellets', radiation: 'Pending Review', shipment: 'RB-2026-0026', origin: 'NFC Hyderabad', received: '2026-07-26', batch: 'NFL-B2026-0710', cost_inr: 55000000, half_life: '7.04E8 years', dose_msv: 0.01 },
  { id: 'NFL-0011', fuel: 'MOX Fuel Rods', description: 'Mixed Oxide Fast Breeder Core Sub-Assembly', facility: 'IGCAR Kalpakkam', quantity: 8, unit: 'sub-assemblies', radiation: 'AERB Approved', shipment: 'IG-2026-0005', origin: 'BARC Reprocessing', received: '2026-07-25', batch: 'NFL-B2026-0708', cost_inr: 192000000, half_life: '24,110 years', dose_msv: 0.95 },
  { id: 'NFL-0012', fuel: 'Spent Fuel Casks', description: 'BAK-500 Concrete Shielded Cask', facility: 'NPCIL Kalpakkam', quantity: 3, unit: 'casks', radiation: 'Decommissioning', shipment: 'KP-2026-0030', origin: 'MAPS Spent Fuel Pool', received: '2026-07-25', batch: 'NFL-B2026-0707', cost_inr: 62000000, half_life: 'N/A', dose_msv: 3.1 },
  { id: 'NFL-0013', fuel: 'Heavy Water', description: 'D2O Coolant Grade 99.75% Purity', facility: 'DAE Hyderabad', quantity: 5000, unit: 'litres', radiation: 'IAEA Safeguard', shipment: 'DAE-2026-0014', origin: 'HWB Baroda', received: '2026-07-24', batch: 'NFL-B2026-0705', cost_inr: 20000000, half_life: 'N/A', dose_msv: 0.001 },
  { id: 'NFL-0014', fuel: 'Zirconium Cladding', description: 'Zircaloy-2 Pressure Tube 103mm OD', facility: 'NPCIL Rawatbhata', quantity: 24, unit: 'tubes', radiation: 'AERB Approved', shipment: 'RB-2026-0025', origin: 'NFC Hyderabad', received: '2026-07-24', batch: 'NFL-B2026-0704', cost_inr: 14400000, half_life: 'N/A', dose_msv: 0.005 },
  { id: 'NFL-0015', fuel: 'Control Rod Assemblies', description: 'B4C Absorber Rod Baffle PHWR', facility: 'BARC Trombay', quantity: 4, unit: 'assemblies', radiation: 'Quarantined', shipment: 'BR-2026-0011', origin: 'NPCIL Workshop', received: '2026-07-23', batch: 'NFL-B2026-0702', cost_inr: 48000000, half_life: 'N/A', dose_msv: 0.18 },
  { id: 'NFL-0016', fuel: 'Decommission Waste', description: 'Co-60 Source Disposal Shielded Container', facility: 'NPCIL Tarapur', quantity: 1, unit: 'container', radiation: 'Pending Review', shipment: 'TP-2026-0036', origin: 'Waste Immobilization Plant', received: '2026-07-23', batch: 'NFL-B2026-0701', cost_inr: 8900000, half_life: '5.27 years', dose_msv: 8.4 },
  { id: 'NFL-0017', fuel: 'UO2 Fuel Assemblies', description: 'Natural Uranium PHWR Bundle 37-rod', facility: 'NPCIL Kalpakkam', quantity: 72, unit: 'bundles', radiation: 'AERB Approved', shipment: 'KP-2026-0029', origin: 'NFC Hyderabad', received: '2026-07-22', batch: 'NFL-B2026-0629', cost_inr: 86000000, half_life: 'N/A', dose_msv: 0.03 },
  { id: 'NFL-0018', fuel: 'LEU Pellets', description: 'UO2 Sintered Pellets 3.5% U-235', facility: 'NPCIL Kudankulam', quantity: 9500, unit: 'pellets', radiation: 'AERB Approved', shipment: 'KS-2026-0038', origin: 'NFC Hyderabad', received: '2026-07-22', batch: 'NFL-B2026-0628', cost_inr: 33000000, half_life: '7.04E8 years', dose_msv: 0.01 },
  { id: 'NFL-0019', fuel: 'MOX Fuel Rods', description: 'Mixed Oxide Reprocessed Pu from Tarapur', facility: 'BARC Trombay', quantity: 16, unit: 'rods', radiation: 'Under Inspection', shipment: 'BR-2026-0010', origin: 'Tarapur Reprocessing', received: '2026-07-21', batch: 'NFL-B2026-0625', cost_inr: 208000000, half_life: '24,110 years', dose_msv: 0.78 },
  { id: 'NFL-0020', fuel: 'Spent Fuel Casks', description: 'HI-STAR 100 Dual Purpose Storage Cask', facility: 'NPCIL Rawatbhata', quantity: 2, unit: 'casks', radiation: 'AERB Approved', shipment: 'RB-2026-0024', origin: 'RAPS Dry Storage', received: '2026-07-21', batch: 'NFL-B2026-0624', cost_inr: 115000000, half_life: 'N/A', dose_msv: 2.8 },
]

const genRecords = (start: number) => {
  const statuses = ['AERB Approved', 'IAEA Safeguard', 'Under Inspection', 'Quarantined', 'Decommissioning', 'Pending Review']
  const facilities = ['NPCIL Tarapur', 'NPCIL Rawatbhata', 'NPCIL Kalpakkam', 'NPCIL Kudankulam', 'BARC Trombay', 'BHAVINI Kalpakkam', 'DAE Hyderabad', 'IGCAR Kalpakkam']
  return Array.from({ length: 40 }, (_, i) => ({
    id: `NFL-${String(start + i).padStart(4, '0')}`,
    fuel: FUEL_TYPES[(start + i) % 8],
    description: `${FUEL_TYPES[(start + i) % 8]} Unit ${String((start + i) % 99 + 1).padStart(3, '0')}`,
    facility: facilities[(start + i) % 8],
    quantity: Math.round(1 + Math.random() * 999),
    unit: ['assemblies', 'pellets', 'rods', 'casks', 'litres', 'tubes', 'assemblies', 'drums'][i % 8],
    radiation: statuses[(start + i) % 6],
    shipment: `SH-${String(28470 + start + i).padStart(5, '0')}`,
    origin: facilities[(start + i + 3) % 8],
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    batch: `NFL-B2026-${String(624 - Math.floor((start + i) / 3)).padStart(4, '0')}`,
    cost_inr: Math.round(5000000 + Math.random() * 250000000),
    half_life: ['N/A', '7.04E8 years', '24,110 years', '5.27 years', '8.02 days', '30.17 years'][(start + i) % 6],
    dose_msv: Math.round((Math.random() * 10) * 100) / 100,
  }))
}

const allFuel = [...fuelRecords, ...genRecords(21), ...genRecords(61)]

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

const filterGroups = [
  {
    key: 'fuel',
    label: 'Fuel Type',
    options: FUEL_TYPES.map(f => ({ label: f, value: f, count: allFuel.filter(r => r.fuel === f).length })),
  },
  {
    key: 'facility',
    label: 'Facility',
    options: FACILITIES.map(f => ({ label: f, value: f, count: allFuel.filter(r => r.facility === f).length })),
  },
  {
    key: 'radiation',
    label: 'Radiation Status',
    options: RADIATION_STATUS.map(s => ({ label: s, value: s, count: allFuel.filter(r => r.radiation === s).length })),
  },
]

function FuelBadge({ fuel }: { fuel: string }) {
  const colors: Record<string, string> = { 'UO2 Fuel Assemblies': 'bg-yellow-100 text-yellow-800', 'LEU Pellets': 'bg-amber-100 text-amber-800', 'MOX Fuel Rods': 'bg-orange-100 text-orange-800', 'Spent Fuel Casks': 'bg-red-100 text-red-800', 'Heavy Water': 'bg-sky-100 text-sky-800', 'Zirconium Cladding': 'bg-gray-100 text-gray-800', 'Control Rod Assemblies': 'bg-purple-100 text-purple-800', 'Decommission Waste': 'bg-rose-100 text-rose-800' }
  return <span className={`nfl-fuel-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[fuel] || 'bg-gray-100 text-gray-800'}`}>{fuel}</span>
}

function RadiationBadge({ radiation }: { radiation: string }) {
  const colors: Record<string, string> = { 'AERB Approved': 'bg-green-100 text-green-800', 'IAEA Safeguard': 'bg-blue-100 text-blue-800', 'Under Inspection': 'bg-yellow-100 text-yellow-800', Quarantined: 'bg-red-100 text-red-800', Decommissioning: 'bg-gray-200 text-gray-700', 'Pending Review': 'bg-orange-100 text-orange-800' }
  return <span className={`nfl-radiation-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[radiation] || 'bg-gray-100 text-gray-700'}`}>{radiation}</span>
}

function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 300000000) * 100)
  const color = cost >= 150000000 ? 'bg-yellow-600' : cost >= 50000000 ? 'bg-yellow-500' : cost >= 20000000 ? 'bg-yellow-400' : 'bg-yellow-300'
  return <div className="nfl-cost-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`nfl-cost-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{'₹' + (cost / 10000000).toFixed(1) + 'Cr'}</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return <div className="nfl-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="nfl-ring-path" strokeLinecap="round" /></svg><span className="nfl-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="nfl-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="nfl-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="nfl-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
}

export default function NuclearFuelLogisticsView() {
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

  const filtered = allFuel.filter(f => {
    const q = searchQuery.toLowerCase()
    if (q && !f.id.toLowerCase().includes(q) && !f.fuel.toLowerCase().includes(q) && !f.description.toLowerCase().includes(q) && !f.facility.toLowerCase().includes(q) && !f.origin.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(f[key as keyof typeof f] as string))
  })

  const totalCost = allFuel.reduce((s, f) => s + f.cost_inr, 0)
  const aerbApproved = allFuel.filter(f => f.radiation === 'AERB Approved').length
  const quarantined = allFuel.filter(f => f.radiation === 'Quarantined').length

  const monthlyData = [
    { month: 'Jan', shipments: 18, value_cr: 85, safety: 99 },
    { month: 'Feb', shipments: 22, value_cr: 110, safety: 98 },
    { month: 'Mar', shipments: 15, value_cr: 72, safety: 99 },
    { month: 'Apr', shipments: 28, value_cr: 140, safety: 97 },
    { month: 'May', shipments: 20, value_cr: 95, safety: 99 },
    { month: 'Jun', shipments: 12, value_cr: 58, safety: 98 },
    { month: 'Jul', shipments: 25, value_cr: 125, safety: 99 },
  ]
  const fuelData = FUEL_TYPES.map(f => ({ fuel: f, count: allFuel.filter(r => r.fuel === f).length }))
  const facData = FACILITIES.map(f => ({ facility: f, count: allFuel.filter(r => r.facility === f).length }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'shipments', label: 'Shipments' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="nfl-container space-y-4">
      <PageHeader title="Nuclear Fuel Logistics" description="Radioactive material transport with AERB/IAEA safeguards compliance, radiation dose tracking, spent fuel management, and nuclear supply chain operations across Indian atomic energy facilities" />
      <ModuleBreadcrumb items={[{ label: 'Specialized Logistics' }, { label: 'Nuclear Fuel' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="nfl-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="nfl-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="nfl-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Shipments" value={allFuel.length.toString()} sub="Fuel consignments" />
            <KpiTile title="Total Value" value={`₹${(totalCost / 10000000).toFixed(0)}Cr`} sub="Inventory value" />
            <KpiTile title="AERB Approved" value={aerbApproved.toString()} sub={`${((aerbApproved / allFuel.length) * 100).toFixed(0)}% cleared`} />
            <KpiTile title="Quarantined" value={quarantined.toString()} sub="Held items" />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={99} label="Radiation Safe" color="#a16207" />
            <HealthRing value={98} label="AERB Compliant" color="#854d0e" />
            <HealthRing value={97} label="IAEA Safeguard" color="#ca8a04" />
            <HealthRing value={96} label="Chain Custody" color="#eab308" />
            <HealthRing value={95} label="Containment" color="#713f12" />
            <HealthRing value={99} label="Emergency Prep" color="#92400e" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="nfl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Shipment Volume & Safety Index</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="shipments" stroke="#a16207" strokeWidth={2} /><Line type="monotone" dataKey="safety" stroke="#854d0e" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card>
            <Card className="nfl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Shipments by Fuel Type</CardTitle></CardHeader><CardContent><BarChart data={fuelData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="fuel" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#a16207" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="nfl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Facility Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={facData} dataKey="count" nameKey="facility" cx="50%" cy="50%" outerRadius={70} label={({ facility, count }) => `${count}`}>{facData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="nfl-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allFuel.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, fuel type, facility, origin, or shipment..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="nfl-table w-full text-sm">
              <thead><tr className="nfl-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Fuel Type</th><th className="px-3 py-2 text-left font-medium">Radiation</th><th className="px-3 py-2 text-left font-medium">Qty</th><th className="px-3 py-2 text-left font-medium">Cost</th><th className="px-3 py-2 text-left font-medium">Facility</th><th className="px-3 py-2 text-left font-medium">Origin</th><th className="px-3 py-2 text-left font-medium">Shipment</th><th className="px-3 py-2 text-left font-medium">Dose (mSv)</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(f => (
                <tr key={f.id} className="nfl-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{f.id}</td>
                  <td className="px-3 py-2"><FuelBadge fuel={f.fuel} /></td>
                  <td className="px-3 py-2"><RadiationBadge radiation={f.radiation} /></td>
                  <td className="px-3 py-2 text-xs">{f.quantity.toLocaleString('en-IN')} {f.unit}</td>
                  <td className="px-3 py-2"><CostBar cost={f.cost_inr} /></td>
                  <td className="px-3 py-2 text-xs">{f.facility}</td>
                  <td className="px-3 py-2 text-xs">{f.origin}</td>
                  <td className="px-3 py-2 text-xs font-mono">{f.shipment}</td>
                  <td className="px-3 py-2 text-xs">{f.dose_msv} mSv</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="nfl-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg Shipment Value" value="₹12.5Cr" trend="+8.3% vs last quarter" />
            <ValueTile title="AERB Approval Rate" value="96.2%" trend="+1.4% improved" />
            <ValueTile title="Radiation Incidents" value="0" trend="Zero incidents" />
            <ValueTile title="IAEA Safeguard" value="100%" trend="Full compliance" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="nfl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Value by Fuel Category</CardTitle></CardHeader><CardContent><BarChart data={FUEL_TYPES.map(f => ({ fuel: f, total: allFuel.filter(r => r.fuel === f).reduce((s, r) => s + r.cost_inr, 0) / 10000000 }))} width={400} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="fuel" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="total" fill="#854d0e" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="nfl-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Radiation Status Breakdown</CardTitle></CardHeader><CardContent><PieChart width={400} height={250}><Pie data={RADIATION_STATUS.map(s => ({ status: s, count: allFuel.filter(f => f.radiation === s).length }))} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>{RADIATION_STATUS.map((_, i) => <Cell key={i} fill={['#22c55e','#3b82f6','#eab308','#ef4444','#9ca3af','#f97316'][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="nfl-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="nfl-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">AERB Licensing & Permit Automation</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Automated compliance with Atomic Energy Regulatory Board (AERB) Type A, B, and C transport license requirements. Real-time radiation dose monitoring with Geiger-Muller counter integration across all 28 transport casks. Automated RS-1 and RS-3 safety analysis reports generated for each shipment. Zero license violations in FY2026 with 100% on-time renewal processing.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-yellow-800">Critical</span><span className="text-gray-400">Live</span></div></CardContent></Card>
            <Card className="nfl-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">IAEA Safeguards Containment & Surveillance</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Full integration with International Atomic Energy Agency (IAEA) Department of Safeguards for NPT non-proliferation compliance. 47 surveillance cameras and 23 tamper-indicating seals monitored in real-time across Kudankulam and Tarapur facilities. Automated INV-3 inventory change reports submitted within 24 hours. India-specific Item 5.1(b) facility inspection scheduling optimized with AI.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">Operational</span><span className="text-gray-400">Q3 2026</span></div></CardContent></Card>
            <Card className="nfl-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">D2O Heavy Water Supply Chain Network</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>End-to-end heavy water logistics from Heavy Water Board (HWB) production plants at Kota, Baroda, and Talcher to 22 PHWR reactors across India. Real-time purity monitoring at 8 checkpoints ensuring 99.9% D2O grade compliance. Predictive loss modeling reducing tritium contamination risk by 34%. Temperature-controlled tanker fleet of 64 vehicles with GPS-tracked routes.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-orange-800">Strategic</span><span className="text-gray-400">FY2027</span></div></CardContent></Card>
            <Card className="nfl-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">AI-Powered Spent Fuel Pool Optimization</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Machine learning model predicting optimal spent fuel rack placement for 3,200+ assemblies in wet storage pools at Rawatbhata and Kalpakkam. Thermal hydraulics simulation reducing decay heat hotspots by 28%. Automated criticality safety calculations ensuring k-effective below 0.95 at all times. Integration with Dry Cask Storage program for Phase-2 loading optimization by 2028.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-purple-800">Innovation</span><span className="text-gray-400">Pilot</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
