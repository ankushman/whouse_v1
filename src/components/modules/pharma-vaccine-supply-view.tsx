import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#0d9488', '#0f766e', '#14b8a6', '#5eead4', '#99f6e4', '#115e59', '#134e4a', '#ccfbf1']

const VACCINE_TYPES = ['Covid mRNA', 'BCG Tuberculosis', 'OPV Polio', 'DPT Triple', 'Hepatitis B', 'MMR Measles', 'Pentavalent', 'Rotavirus']
const MANUFACTURERS = ['SII Pune', 'Bharat Biotech Hyd', 'Biologicals E Hyd', 'Zydus Cadila', 'Panacea Biotik', 'HLL Lifecare', 'CDL Kasauli', 'BCG Lab Chennai']
const COLD_STATUS = ['2-8°C Compliant', 'Frozen Valid', 'Temp Excursion', 'In Transit Monitored', 'Quarantine Hold', 'Pending Release']

const vaccineRecords = [
  { id: 'PVS-0001', vaccine: 'Covid mRNA', description: 'Covaxin BBV152 0.5ml IM Dose Adult booster lot', manufacturer: 'Bharat Biotech Hyd', quantity: 2500000, unit: 'doses', cold_status: '2-8°C Compliant', lot: 'LOT-PVS-9041', destination: 'GoVax Hub Delhi', received: '2026-07-30', batch: 'PVS-B2026-0721', cost_inr: 62500000, shelf_months: 18, who_prequal: true },
  { id: 'PVS-0002', vaccine: 'BCG Tuberculosis', description: 'BCG Danish 1331 0.1ml ID Newborn Dose WHO', manufacturer: 'BCG Lab Chennai', quantity: 8000000, unit: 'doses', cold_status: '2-8°C Compliant', lot: 'LOT-PVS-9038', destination: 'UWIP Hub Mumbai', received: '2026-07-30', batch: 'PVS-B2026-0720', cost_inr: 48000000, shelf_months: 24, who_prequal: true },
  { id: 'PVS-0003', vaccine: 'OPV Polio', description: 'bOPV Monovalent Type 2 2 Drops Per Dose', manufacturer: 'Biologicals E Hyd', quantity: 15000000, unit: 'doses', cold_status: 'Frozen Valid', lot: 'LOT-PVS-9012', destination: 'Pulse Polio Bengaluru', received: '2026-07-29', batch: 'PVS-B2026-0719', cost_inr: 22500000, shelf_months: 6, who_prequal: true },
  { id: 'PVS-0004', vaccine: 'DPT Triple', description: 'DPT Type II Adsorbed 0.5ml IM 6wk Infant', manufacturer: 'SII Pune', quantity: 6000000, unit: 'doses', cold_status: 'In Transit Monitored', lot: 'LOT-PVS-9027', destination: 'UIP Hub Lucknow', received: '2026-07-29', batch: 'PVS-B2026-0718', cost_inr: 36000000, shelf_months: 36, who_prequal: true },
  { id: 'PVS-0005', vaccine: 'Hepatitis B', description: 'Engerix-B Recombinant 10mcg 3-Dose Schedule', manufacturer: 'Zydus Cadila', quantity: 3200000, unit: 'doses', cold_status: 'Temp Excursion', lot: 'LOT-PVS-9031', destination: 'NACO Hub Kolkata', received: '2026-07-28', batch: 'PVS-B2026-0716', cost_inr: 51200000, shelf_months: 48, who_prequal: true },
  { id: 'PVS-0006', vaccine: 'MMR Measles', description: 'Mumps Measles Rubella 0.5ml SC 9mo Child', manufacturer: 'SII Pune', quantity: 5500000, unit: 'doses', cold_status: '2-8°C Compliant', lot: 'LOT-PVS-9040', destination: 'MR Campaign Chennai', received: '2026-07-28', batch: 'PVS-B2026-0715', cost_inr: 44000000, shelf_months: 24, who_prequal: true },
  { id: 'PVS-0007', vaccine: 'Pentavalent', description: 'DPT-HepB-Hib EasyFive 0.5ml IM 6-14wk', manufacturer: 'Panacea Biotik', quantity: 4500000, unit: 'doses', cold_status: 'Quarantine Hold', lot: 'LOT-PVS-9008', destination: 'Penta Hub Jaipur', received: '2026-07-27', batch: 'PVS-B2026-0714', cost_inr: 90000000, shelf_months: 30, who_prequal: true },
  { id: 'PVS-0008', vaccine: 'Rotavirus', description: 'Rotavac 5-Dose Oral Live Attenuated 1ml Infant', manufacturer: 'Bharat Biotech Hyd', quantity: 7000000, unit: 'doses', cold_status: 'Pending Release', lot: 'LOT-PVS-9037', destination: 'Introduc Hub Patna', received: '2026-07-27', batch: 'PVS-B2026-0713', cost_inr: 42000000, shelf_months: 24, who_prequal: true },
  { id: 'PVS-0009', vaccine: 'Covid mRNA', description: 'Corbevax Recombinant Protein 0.5ml IM 12-14yr', manufacturer: 'Biologicals E Hyd', quantity: 1800000, unit: 'doses', cold_status: '2-8°C Compliant', lot: 'LOT-PVS-9039', destination: 'CoWIN Hub Hyderabad', received: '2026-07-26', batch: 'PVS-B2026-0711', cost_inr: 27000000, shelf_months: 12, who_prequal: false },
  { id: 'PVS-0010', vaccine: 'BCG Tuberculosis', description: 'BCG Russia 0.05ml ID Neonatal LTBI Prophylaxis', manufacturer: 'CDL Kasauli', quantity: 4200000, unit: 'doses', cold_status: '2-8°C Compliant', lot: 'LOT-PVS-9026', destination: 'RNTCP Hub Nagpur', received: '2026-07-26', batch: 'PVS-B2026-0710', cost_inr: 21000000, shelf_months: 18, who_prequal: true },
  { id: 'PVS-0011', vaccine: 'OPV Polio', description: 'IPV Sabin Inactivated 0.5ml IM 6wk 14wk Booster', manufacturer: 'SII Pune', quantity: 9500000, unit: 'doses', cold_status: 'In Transit Monitored', lot: 'LOT-PVS-9011', destination: 'IPV Hub Guwahati', received: '2026-07-25', batch: 'PVS-B2026-0708', cost_inr: 47500000, shelf_months: 24, who_prequal: true },
  { id: 'PVS-0012', vaccine: 'DPT Triple', description: 'DTwP Whole Cell 0.5ml IM 18mo Booster UIP', manufacturer: 'HLL Lifecare', quantity: 5800000, unit: 'doses', cold_status: 'Temp Excursion', lot: 'LOT-PVS-9007', destination: 'Mission Indradhanush Bhopal', received: '2026-07-25', batch: 'PVS-B2026-0707', cost_inr: 29000000, shelf_months: 36, who_prequal: true },
  { id: 'PVS-0013', vaccine: 'Hepatitis B', description: 'GeneVac-B Recombinant 10mcg 3-Dose Adult', manufacturer: 'Zydus Cadila', quantity: 2200000, unit: 'doses', cold_status: '2-8°C Compliant', lot: 'LOT-PVS-9030', destination: 'NACO Hub Thiruvananthapuram', received: '2026-07-24', batch: 'PVS-B2026-0705', cost_inr: 35200000, shelf_months: 48, who_prequal: true },
  { id: 'PVS-0014', vaccine: 'MMR Measles', description: 'MR Vac Measles Rubella 0.5ml SC 2nd Dose 16mo', manufacturer: 'Biologicals E Hyd', quantity: 4800000, unit: 'doses', cold_status: 'Frozen Valid', lot: 'LOT-PVS-9025', destination: 'MR Drive Chandigarh', received: '2026-07-24', batch: 'PVS-B2026-0704', cost_inr: 33600000, shelf_months: 24, who_prequal: true },
  { id: 'PVS-0015', vaccine: 'Pentavalent', description: 'Tritanrix-HepB-Hib GSK 0.5ml IM 6wk Primary', manufacturer: 'SII Pune', quantity: 3500000, unit: 'doses', cold_status: '2-8°C Compliant', lot: 'LOT-PVS-9036', destination: 'Penta Hub Bhubaneswar', received: '2026-07-23', batch: 'PVS-B2026-0702', cost_inr: 70000000, shelf_months: 30, who_prequal: true },
  { id: 'PVS-0016', vaccine: 'Rotavirus', description: 'Rotasiil 3-Dose Liquid Lyophilized 1ml 6-10-14wk', manufacturer: 'Bharat Biotech Hyd', quantity: 6200000, unit: 'doses', cold_status: 'Quarantine Hold', lot: 'LOT-PVS-9024', destination: 'Introduc Hub Indore', received: '2026-07-23', batch: 'PVS-B2026-0701', cost_inr: 37200000, shelf_months: 24, who_prequal: true },
  { id: 'PVS-0017', vaccine: 'Covid mRNA', description: 'iNCOVACC Intranasal BBV154 Booster 4th Dose', manufacturer: 'Bharat Biotech Hyd', quantity: 1200000, unit: 'doses', cold_status: '2-8°C Compliant', lot: 'LOT-PVS-9023', destination: 'Nasal Hub Ahmedabad', received: '2026-07-22', batch: 'PVS-B2026-0629', cost_inr: 18000000, shelf_months: 6, who_prequal: false },
  { id: 'PVS-0018', vaccine: 'BCG Tuberculosis', description: 'BCG Tokyo 0.05ml ID School Entry 5yr Mantoux', manufacturer: 'BCG Lab Chennai', quantity: 6500000, unit: 'doses', cold_status: 'In Transit Monitored', lot: 'LOT-PVS-9022', destination: 'School Health Hub Pune', received: '2026-07-22', batch: 'PVS-B2026-0628', cost_inr: 32500000, shelf_months: 24, who_prequal: true },
  { id: 'PVS-0019', vaccine: 'OPV Polio', description: 'mOPV2 Monovalent Sabin 2 Drops OPV Supplemental', manufacturer: 'Panacea Biotik', quantity: 11000000, unit: 'doses', cold_status: '2-8°C Compliant', lot: 'LOT-PVS-9010', destination: 'SNID Jharkhand Ranchi', received: '2026-07-21', batch: 'PVS-B2026-0625', cost_inr: 27500000, shelf_months: 6, who_prequal: true },
  { id: 'PVS-0020', vaccine: 'DPT Triple', description: 'Tdap Adult Booster 0.5ml IM 10yr Tetanus', manufacturer: 'HLL Lifecare', quantity: 1500000, unit: 'doses', cold_status: 'Pending Release', lot: 'LOT-PVS-9021', destination: 'ANM Kit Hub Vizag', received: '2026-07-21', batch: 'PVS-B2026-0624', cost_inr: 12000000, shelf_months: 36, who_prequal: true },
]

const genRecords = (start: number) => {
  const statuses = ['2-8°C Compliant', 'Frozen Valid', 'Temp Excursion', 'In Transit Monitored', 'Quarantine Hold', 'Pending Release']
  const destinations = ['GoVax Hub Delhi', 'UWIP Hub Mumbai', 'Pulse Polio Bengaluru', 'UIP Hub Lucknow', 'NACO Hub Kolkata', 'MR Campaign Chennai', 'Penta Hub Jaipur', 'Introduc Hub Patna']
  return Array.from({ length: 40 }, (_, i) => ({
    id: `PVS-${String(start + i).padStart(4, '0')}`,
    vaccine: VACCINE_TYPES[(start + i) % 8],
    description: `${VACCINE_TYPES[(start + i) % 8]} Lot ${String((start + i) % 99 + 1).padStart(3, '0')}`,
    manufacturer: MANUFACTURERS[(start + i) % 8],
    quantity: Math.round(500000 + Math.random() * 14500000),
    unit: 'doses',
    cold_status: statuses[(start + i) % 6],
    lot: `LOT-PVS-${String(9021 + start + i)}`,
    destination: destinations[(start + i) % 8],
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    batch: `PVS-B2026-${String(624 - Math.floor((start + i) / 3)).padStart(4, '0')}`,
    cost_inr: Math.round(5000000 + Math.random() * 95000000),
    shelf_months: Math.round(6 + Math.random() * 42),
    who_prequal: Math.random() > 0.15,
  }))
}

const allVaccine = [...vaccineRecords, ...genRecords(21), ...genRecords(61)]

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

const filterGroups = [
  {
    key: 'vaccine',
    label: 'Vaccine Type',
    options: VACCINE_TYPES.map(t => ({ label: t, value: t, count: allVaccine.filter(r => r.vaccine === t).length })),
  },
  {
    key: 'manufacturer',
    label: 'Manufacturer',
    options: MANUFACTURERS.map(m => ({ label: m, value: m, count: allVaccine.filter(r => r.manufacturer === m).length })),
  },
  {
    key: 'cold_status',
    label: 'Cold Chain Status',
    options: COLD_STATUS.map(s => ({ label: s, value: s, count: allVaccine.filter(r => r.cold_status === s).length })),
  },
]

function VaccineBadge({ vaccine }: { vaccine: string }) {
  const colors: Record<string, string> = { 'Covid mRNA': 'bg-rose-100 text-rose-800', 'BCG Tuberculosis': 'bg-orange-100 text-orange-800', 'OPV Polio': 'bg-green-100 text-green-800', 'DPT Triple': 'bg-blue-100 text-blue-800', 'Hepatitis B': 'bg-yellow-100 text-yellow-800', 'MMR Measles': 'bg-purple-100 text-purple-800', Pentavalent: 'bg-teal-100 text-teal-800', Rotavirus: 'bg-indigo-100 text-indigo-800' }
  return <span className={`pvs-vaccine-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[vaccine] || 'bg-gray-100 text-gray-800'}`}>{vaccine}</span>
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { '2-8°C Compliant': 'bg-green-100 text-green-800', 'Frozen Valid': 'bg-blue-100 text-blue-800', 'Temp Excursion': 'bg-red-100 text-red-800', 'In Transit Monitored': 'bg-yellow-100 text-yellow-800', 'Quarantine Hold': 'bg-orange-100 text-orange-800', 'Pending Release': 'bg-gray-200 text-gray-700' }
  return <span className={`pvs-status-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
}

function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 100000000) * 100)
  const color = cost >= 80000000 ? 'bg-teal-600' : cost >= 40000000 ? 'bg-teal-500' : cost >= 20000000 ? 'bg-teal-400' : 'bg-teal-300'
  return <div className="pvs-cost-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`pvs-cost-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{'₹' + (cost / 10000000).toFixed(1) + 'Cr'}</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return <div className="pvs-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="pvs-ring-path" strokeLinecap="round" /></svg><span className="pvs-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="pvs-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="pvs-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="pvs-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
}

export default function PharmaVaccineSupplyView() {
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

  const filtered = allVaccine.filter(v => {
    const q = searchQuery.toLowerCase()
    if (q && !v.id.toLowerCase().includes(q) && !v.vaccine.toLowerCase().includes(q) && !v.description.toLowerCase().includes(q) && !v.manufacturer.toLowerCase().includes(q) && !v.destination.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(v[key as keyof typeof v] as string))
  })

  const totalCost = allVaccine.reduce((s, v) => s + v.cost_inr, 0)
  const compliant = allVaccine.filter(v => v.cold_status === '2-8°C Compliant').length
  const excursions = allVaccine.filter(v => v.cold_status === 'Temp Excursion').length

  const monthlyData = [
    { month: 'Jan', doses: 85, value_cr: 42, cold_pct: 98 },
    { month: 'Feb', doses: 102, value_cr: 58, cold_pct: 97 },
    { month: 'Mar', doses: 145, value_cr: 82, cold_pct: 99 },
    { month: 'Apr', doses: 68, value_cr: 32, cold_pct: 96 },
    { month: 'May', doses: 128, value_cr: 70, cold_pct: 98 },
    { month: 'Jun', doses: 42, value_cr: 18, cold_pct: 95 },
    { month: 'Jul', doses: 158, value_cr: 92, cold_pct: 99 },
  ]
  const vaccineData = VACCINE_TYPES.map(t => ({ vaccine: t, count: allVaccine.filter(r => r.vaccine === t).length }))
  const mfrData = MANUFACTURERS.map(m => ({ manufacturer: m, count: allVaccine.filter(r => r.manufacturer === m).length }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'cold-chain', label: 'Cold Chain' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="pvs-container space-y-4">
      <PageHeader title="Pharma Vaccine Supply Chain" description="National immunization cold chain logistics with WHO prequalification compliance, eVIN real-time temperature monitoring, UIP Mission Indradhanush tracking, and CoWIN digital vaccination record integration across India's 28,000+ cold chain points" />
      <ModuleBreadcrumb items={[{ label: 'Healthcare' }, { label: 'Vaccine Supply' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="pvs-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="pvs-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="pvs-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Lots" value={allVaccine.length.toString()} sub="Vaccine consignments tracked" />
            <KpiTile title="Total Value" value={`₹${(totalCost / 10000000).toFixed(0)}Cr`} sub="Cold chain inventory value" />
            <KpiTile title="2-8°C Compliant" value={compliant.toString()} sub={`${((compliant / allVaccine.length) * 100).toFixed(0)}% cold compliant`} />
            <KpiTile title="Temp Excursions" value={excursions.toString()} sub="Deviation events logged" />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={98} label="Cold Chain Uptime" color="#0d9488" />
            <HealthRing value={96} label="WHO Prequal Rate" color="#0f766e" />
            <HealthRing value={94} label="VVM Stage 2" color="#14b8a6" />
            <HealthRing value={97} label="Ice Pack Valid" color="#115e59" />
            <HealthRing value={99} label="EVM Score" color="#134e4a" />
            <HealthRing value={93} label="Last Mile Reach" color="#5eead4" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="pvs-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Dose Volume & Cold Compliance %</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="doses" stroke="#0d9488" strokeWidth={2} /><Line type="monotone" dataKey="cold_pct" stroke="#0f766e" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card>
            <Card className="pvs-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Inventory by Vaccine Type</CardTitle></CardHeader><CardContent><BarChart data={vaccineData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="vaccine" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#0d9488" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="pvs-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Manufacturer Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={mfrData} dataKey="count" nameKey="manufacturer" cx="50%" cy="50%" outerRadius={70} label={({ manufacturer, count }) => `${count}`}>{mfrData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="cold-chain" className="pvs-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allVaccine.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, vaccine type, manufacturer, destination, or lot..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="pvs-table w-full text-sm">
              <thead><tr className="pvs-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Vaccine</th><th className="px-3 py-2 text-left font-medium">Cold Status</th><th className="px-3 py-2 text-left font-medium">Doses</th><th className="px-3 py-2 text-left font-medium">Value</th><th className="px-3 py-2 text-left font-medium">Manufacturer</th><th className="px-3 py-2 text-left font-medium">Destination</th><th className="px-3 py-2 text-left font-medium">Lot</th><th className="px-3 py-2 text-left font-medium">Shelf</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(v => (
                <tr key={v.id} className="pvs-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{v.id}</td>
                  <td className="px-3 py-2"><VaccineBadge vaccine={v.vaccine} /></td>
                  <td className="px-3 py-2"><StatusBadge status={v.cold_status} /></td>
                  <td className="px-3 py-2 text-xs">{(v.quantity / 1000000).toFixed(1)}M {v.unit}</td>
                  <td className="px-3 py-2"><CostBar cost={v.cost_inr} /></td>
                  <td className="px-3 py-2 text-xs">{v.manufacturer}</td>
                  <td className="px-3 py-2 text-xs">{v.destination}</td>
                  <td className="px-3 py-2 text-xs font-mono">{v.lot}</td>
                  <td className="px-3 py-2 text-xs">{v.shelf_months}mo</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="pvs-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg Lot Value" value="₹4.8Cr" trend="+7.2% vs last quarter" />
            <ValueTile title="Cold Compliance" value="98.4%" trend="+0.6% improved" />
            <ValueTile title="WHO Prequal Share" value="85.2%" trend="+2.1% on target" />
            <ValueTile title="Last Mile Delivery" value="93.6%" trend="+4.8% expanded" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="pvs-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Value by Vaccine Category</CardTitle></CardHeader><CardContent><BarChart data={VACCINE_TYPES.map(t => ({ vaccine: t, total: allVaccine.filter(r => r.vaccine === t).reduce((s, r) => s + r.cost_inr, 0) / 10000000 }))} width={400} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="vaccine" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="total" fill="#0f766e" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="pvs-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Cold Chain Status Breakdown</CardTitle></CardHeader><CardContent><PieChart width={400} height={250}><Pie data={COLD_STATUS.map(s => ({ status: s, count: allVaccine.filter(v => v.cold_status === s).length }))} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>{COLD_STATUS.map((_, i) => <Cell key={i} fill={['#22c55e','#3b82f6','#ef4444','#eab308','#f97316','#9ca3af'][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="pvs-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="pvs-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">eVIN Electronic Vaccine Intelligence Network</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Real-time eVIN temperature and stock monitoring across 28,000+ cold chain points in all 36 states and UTs. Automated SMS-based temperature alerts to 4,500+ Cold Chain Handlers (CCH) when vaccines breach 2-8°C threshold. IoT-enabled digital data loggers on 12,000+ ice-lined refrigerators (ILRs) and deep freezers with 15-minute polling interval. Integration with UNICEF Immunization Logistics Management System (iLM) for international vaccine procurement tracking. Real-time VVM (Vaccine Vial Monitor) stage monitoring with AI-predicted shelf life degradation models.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-teal-100 px-2 py-0.5 text-teal-800">Critical</span><span className="text-gray-400">Live</span></div></CardContent></Card>
            <Card className="pvs-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">CoWIN Digital Vaccination Platform Integration</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>CoWIN beneficiary registration and vaccination certificate data feed for demand forecasting across 1,500+ districts. AI-powered vaccine demand prediction model using CoWIN vaccination trends, birth registry data, and disease outbreak surveillance. Automated stockout prediction 72 hours in advance enabling proactive redistribution from surplus to deficit districts. Integration with Ayushman Bharat Health ID for universal immunization coverage tracking achieving 95% DPT3 coverage target. Real-time adverse event following immunization (AEFI) reporting linked to specific vaccine lot numbers for pharmacovigilance.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-800">Operational</span><span className="text-gray-400">Q3 2026</span></div></CardContent></Card>
            <Card className="pvs-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Mission Indradhanush Catch-Up Campaign Logistics</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Intensified Mission Indradhanush (IMI) 5.0 micro-planning logistics for 250+ high-focus districts with {'<'}40% routine immunization coverage. Mobile vaccination team deployment with GPS-tracked cold boxes serving 4,200+ hard-to-reach areas including tribal, border, and urban slum pockets. Pre-positioned vaccine buffer stocks at 850+ session sites with automated reorder triggers at 30% stock level. Integration with ASHA worker mobile app for real-time headcount and vaccine utilization reporting. Temperature excursion management with 15-minute response SLA and vaccine wastage tracking below 5% national target.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-green-800">Strategic</span><span className="text-gray-400">FY2027</span></div></CardContent></Card>
            <Card className="pvs-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">AI Cold Chain Route Optimization & Predictive Excursion</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Machine learning route optimization model for vaccine delivery vehicles across 18,000+ delivery routes reducing cold chain breach risk by 40%. Predictive temperature excursion model using weather data, road conditions, and vehicle refrigeration unit performance data achieving 92% accuracy. Integration with India Meteorological Department (IMD) heatwave alerts triggering proactive cold chain rerouting during extreme temperature events. Automated ILR defrost scheduling and cold box ice pack conditioning cycle optimization reducing energy consumption by 18%. Digital twin simulation of national cold chain network for pandemic preparedness and surge capacity planning.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-cyan-100 px-2 py-0.5 text-cyan-800">Innovation</span><span className="text-gray-400">Pilot</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
