import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#dc2626', '#b91c1c', '#ef4444', '#f87171', '#fca5a5', '#7f1d1d', '#450a0a', '#fee2e2']

const ORDNANCE_TYPES = ['155mm artillery shells', 'PKT 7.62mm ammo', 'INSAS 5.56mm rounds', 'T-90 tank ammo', 'Akash SAM missiles', 'BrahMos cruise missiles', 'Pinaka guided rockets', 'RPG-7 anti-tank']
const DEPOTS = ['CFC Jabalpur', 'ASC Delhi', 'AOC Nagpur', 'ORD Khadki Pune', 'EME Bengaluru', 'EDC Ambala Cantt', 'MGO Kolkata', 'FOB Leh Ladakh']
const ISSUE_STATUS = ['IAF Cleared', 'QA Passed', 'In Transit', 'Arsenal Stored', 'Pending DGQA', 'Awaiting Allocation']

const ordnanceRecords = [
  { id: 'ORD-0001', ordnance: '155mm artillery shells', description: 'Bofors FH-77B 155mm HE shell lot DGQA inspected OFB Varangaon batch for Northern Command Artillery Division forward deployment', depot: 'CFC Jabalpur', quantity: 8000, unit: 'rounds', issue_status: 'IAF Cleared', lot: 'LOT-ORD-9051', destination: 'X Corps Artillery Rajasthan', received: '2026-07-30', batch: 'ORD-B2026-0730', cost_inr: 240000000, hazard_class: '1.1D', shelf_life_years: 25 },
  { id: 'ORD-0002', ordnance: 'PKT 7.62mm ammo', description: 'T-72/T-90 PKT coaxial machine gun 7.62x54R ball ammunition lot OFB Ambernath DGQA batch certified', depot: 'ASC Delhi', quantity: 500000, unit: 'rounds', issue_status: 'QA Passed', lot: 'LOT-ORD-9048', destination: 'Mechanised Inf J&K', received: '2026-07-30', batch: 'ORD-B2026-0729', cost_inr: 75000000, hazard_class: '1.1D', shelf_life_years: 20 },
  { id: 'ORD-0003', ordnance: 'INSAS 5.56mm rounds', description: 'INSAS LMG/AR 5.56x45mm ball ammunition lot for CRPF and Indian Army counter-insurgency operations Rashtriya Rifles units', depot: 'AOC Nagpur', quantity: 1200000, unit: 'rounds', issue_status: 'In Transit', lot: 'LOT-ORD-9045', destination: 'RR Bn Srinagar Kmr', received: '2026-07-29', batch: 'ORD-B2026-0728', cost_inr: 48000000, hazard_class: '1.4S', shelf_life_years: 15 },
  { id: 'ORD-0004', ordnance: 'T-90 tank ammo', description: 'T-90 Bhishma 125mm APFSDS fin-stabilised discarding sabot Armour Piercing round OFB Ordnance Factory Kanpur', depot: 'ORD Khadki Pune', quantity: 2000, unit: 'rounds', issue_status: 'IAF Cleared', lot: 'LOT-ORD-9042', destination: '1 Armoured Div Jaisalmer', received: '2026-07-29', batch: 'ORD-B2026-0727', cost_inr: 360000000, hazard_class: '1.1D', shelf_life_years: 30 },
  { id: 'ORD-0005', ordnance: 'Akash SAM missiles', description: 'Akash NG surface-to-air missile lot DRDO-BDL Hyderabad integrated for IAF Western Air Command squadron deployment', depot: 'EME Bengaluru', quantity: 48, unit: 'missiles', issue_status: 'QA Passed', lot: 'LOT-ORD-9039', destination: 'WAC IAF Squadron', received: '2026-07-28', batch: 'ORD-B2026-0726', cost_inr: 480000000, hazard_class: '1.1J', shelf_life_years: 10 },
  { id: 'ORD-0006', ordnance: 'BrahMos cruise missiles', description: 'BrahMos Block-III supersonic cruise missile lot BrahMos Aerospace Thiruvananthapuram for Navy Western Fleet INS Vikrant', depot: 'MGO Kolkata', quantity: 24, unit: 'missiles', issue_status: 'Arsenal Stored', lot: 'LOT-ORD-9036', destination: 'Western Naval Fleet', received: '2026-07-28', batch: 'ORD-B2026-0725', cost_inr: 840000000, hazard_class: '1.1J', shelf_life_years: 8 },
  { id: 'ORD-0007', ordnance: 'Pinaka guided rockets', description: 'Pinaka Mk-I guided rocket artillery 214mm extended range lot DRDO Armament Research Board RCI Hyderabad', depot: 'EDC Ambala Cantt', quantity: 3600, unit: 'rockets', issue_status: 'Pending DGQA', lot: 'LOT-ORD-9033', destination: 'XII Corps Artillery', received: '2026-07-27', batch: 'ORD-B2026-0724', cost_inr: 216000000, hazard_class: '1.1D', shelf_life_years: 15 },
  { id: 'ORD-0008', ordnance: 'RPG-7 anti-tank', description: 'RPG-7 40mm HEAT anti-tank rocket launcher ammunition lot imported from Rosoboronexport under Inter-Governmental Agreement', depot: 'FOB Leh Ladakh', quantity: 5000, unit: 'rounds', issue_status: 'Awaiting Allocation', lot: 'LOT-ORD-9030', destination: 'XIV Corps Leh Ladakh', received: '2026-07-27', batch: 'ORD-B2026-0723', cost_inr: 45000000, hazard_class: '1.4S', shelf_life_years: 12 },
  { id: 'ORD-0009', ordnance: '155mm artillery shells', description: 'M777 ultralight howitzer 155mm Excalibur guided projectile lot Kalyani Strategic Systems for mountain strike corps', depot: 'CFC Jabalpur', quantity: 1200, unit: 'rounds', issue_status: 'QA Passed', lot: 'LOT-ORD-9027', destination: 'XVII Mtn Strike Arunachal', received: '2026-07-26', batch: 'ORD-B2026-0722', cost_inr: 180000000, hazard_class: '1.1D', shelf_life_years: 25 },
  { id: 'ORD-0010', ordnance: 'PKT 7.62mm ammo', description: 'MiG-29/Gajendra 7.62x54R aircraft machine gun ammunition lot IAF No.1 Squadron HAL Nashik linked belt', depot: 'ASC Delhi', quantity: 200000, unit: 'rounds', issue_status: 'IAF Cleared', lot: 'LOT-ORD-9024', destination: 'IAF No.1 Sqn Ambala', received: '2026-07-26', batch: 'ORD-B2026-0721', cost_inr: 30000000, hazard_class: '1.4S', shelf_life_years: 20 },
  { id: 'ORD-0011', ordnance: 'INSAS 5.56mm rounds', description: 'Garud Commando Force special operations 5.56mm tracer and AP mixed lot NSG and SPG counter-terror rapid deployment', depot: 'AOC Nagpur', quantity: 600000, unit: 'rounds', issue_status: 'In Transit', lot: 'LOT-ORD-9021', destination: 'NSG Manesar Haryana', received: '2026-07-25', batch: 'ORD-B2026-0720', cost_inr: 24000000, hazard_class: '1.4S', shelf_life_years: 15 },
  { id: 'ORD-0012', ordnance: 'T-90 tank ammo', description: 'T-90S Bhishma 125mm HE-FRAG high explosive fragmentation round for desert warfare doctrine anti-personnel engagement', depot: 'ORD Khadki Pune', quantity: 4000, unit: 'rounds', issue_status: 'QA Passed', lot: 'LOT-ORD-9018', destination: 'II Armoured Bhatinda', received: '2026-07-25', batch: 'ORD-B2026-0719', cost_inr: 280000000, hazard_class: '1.1D', shelf_life_years: 30 },
  { id: 'ORD-0013', ordnance: 'Akash SAM missiles', description: 'Akash Mk-1S squadron deployment lot for Eastern Army Corps air defence umbrella covering Assam Arunachal Pradesh sector', depot: 'EME Bengaluru', quantity: 72, unit: 'missiles', issue_status: 'IAF Cleared', lot: 'LOT-ORD-9015', destination: 'EAC IAF Tezpur', received: '2026-07-24', batch: 'ORD-B2026-0718', cost_inr: 720000000, hazard_class: '1.1J', shelf_life_years: 10 },
  { id: 'ORD-0014', ordnance: 'BrahMos cruise missiles', description: 'BrahMos-A air-launched cruise missile Su-30MKI integration lot for IAF No.222 Squadron Tigershark maritime strike role', depot: 'MGO Kolkata', quantity: 12, unit: 'missiles', issue_status: 'Pending DGQA', lot: 'LOT-ORD-9012', destination: 'IAF No.222 Sqn Thanjavur', received: '2026-07-24', batch: 'ORD-B2026-0717', cost_inr: 480000000, hazard_class: '1.1J', shelf_life_years: 8 },
  { id: 'ORD-0015', ordnance: 'Pinaka guided rockets', description: 'Pinaka Mk-II ER 290mm guided rocket for area saturation bombardment Northern Command integrated fire support system', depot: 'EDC Ambala Cantt', quantity: 2400, unit: 'rockets', issue_status: 'In Transit', lot: 'LOT-ORD-9009', destination: 'IX Corps Artillery', received: '2026-07-23', batch: 'ORD-B2026-0716', cost_inr: 168000000, hazard_class: '1.1D', shelf_life_years: 15 },
  { id: 'ORD-0016', ordnance: 'RPG-7 anti-tank', description: 'RPG-7V2 40mm anti-tank rocket for ITBP and SSB border security forward posts China border Arunachal sector', depot: 'FOB Leh Ladakh', quantity: 3000, unit: 'rounds', issue_status: 'IAF Cleared', lot: 'LOT-ORD-9006', destination: 'ITBP Arunachal', received: '2026-07-23', batch: 'ORD-B2026-0715', cost_inr: 27000000, hazard_class: '1.4S', shelf_life_years: 12 },
  { id: 'ORD-0017', ordnance: '155mm artillery shells', description: 'K9 Vajra-T 155mm SP gun compatible shell lot Hanwha Defence OFB cooperative production Make in India DPSU', depot: 'CFC Jabalpur', quantity: 6000, unit: 'rounds', issue_status: 'Arsenal Stored', lot: 'LOT-ORD-9003', destination: 'K9 Regt Rajasthan', received: '2026-07-22', batch: 'ORD-B2026-0714', cost_inr: 180000000, hazard_class: '1.1D', shelf_life_years: 25 },
  { id: 'ORD-0018', ordnance: 'PKT 7.62mm ammo', description: 'Paramilitary CRPF/BSF 7.62mm standard ball ammunition lot for anti-Naxal operations Chhattisgarh and Left Wing Extremism zones', depot: 'ASC Delhi', quantity: 800000, unit: 'rounds', issue_status: 'QA Passed', lot: 'LOT-ORD-9050', destination: 'CRPF Bn Raipur CG', received: '2026-07-22', batch: 'ORD-B2026-0713', cost_inr: 120000000, hazard_class: '1.4S', shelf_life_years: 20 },
  { id: 'ORD-0019', ordnance: 'INSAS 5.56mm rounds', description: 'Coast Guard OPV/offshore patrol vessel boarding party 5.56mm ammunition for anti-piracy maritime security Indian EEZ', depot: 'AOC Nagpur', quantity: 150000, unit: 'rounds', issue_status: 'IAF Cleared', lot: 'LOT-ORD-9047', destination: 'Coast Guard Mumbai', received: '2026-07-21', batch: 'ORD-B2026-0712', cost_inr: 6000000, hazard_class: '1.4S', shelf_life_years: 15 },
  { id: 'ORD-0020', ordnance: 'T-90 tank ammo', description: 'T-90S 125mm HEAT-MP multi-purpose anti-tank round for combined arms exercise Shatrujeet 2026 desert warfare validation', depot: 'ORD Khadki Pune', quantity: 3000, unit: 'rounds', issue_status: 'In Transit', lot: 'LOT-ORD-9044', destination: 'Pune Armoured Centre', received: '2026-07-21', batch: 'ORD-B2026-0711', cost_inr: 210000000, hazard_class: '1.1D', shelf_life_years: 30 },
]

const genRecords = (start: number) => {
  const statuses = ['IAF Cleared', 'QA Passed', 'In Transit', 'Arsenal Stored', 'Pending DGQA', 'Awaiting Allocation']
  const destinations = ['X Corps Rajasthan', 'Mechanised Inf J&K', 'RR Bn Srinagar', '1 Armoured Div', 'WAC IAF', 'Western Naval Fleet', 'XII Corps', 'XIV Corps Leh', 'XVII Mtn Arunachal', 'IAF No.1 Sqn', 'NSG Manesar', 'Coast Guard Mumbai']
  return Array.from({ length: 40 }, (_, i) => ({
    id: `ORD-${String(start + i).padStart(4, '0')}`,
    ordnance: ORDNANCE_TYPES[(start + i) % 8],
    description: `${ORDNANCE_TYPES[(start + i) % 8]} Lot ${String((start + i) % 99 + 1).padStart(3, '0')} ordnance consignment`,
    depot: DEPOTS[(start + i) % 8],
    quantity: Math.round(50 + Math.random() * 500000),
    unit: ['rounds', 'missiles', 'rockets'][i % 3],
    issue_status: statuses[(start + i) % 6],
    lot: `LOT-ORD-${String(9021 + start + i)}`,
    destination: destinations[(start + i) % 12],
    received: `2026-07-${String(20 - Math.floor((start + i) / 10)).padStart(2, '0')}`,
    batch: `ORD-B2026-${String(710 - Math.floor((start + i) / 3)).padStart(4, '0')}`,
    cost_inr: Math.round(5000000 + Math.random() * 400000000),
    hazard_class: ['1.1D', '1.4S', '1.1J', '1.1D', '1.4S', '1.1J'][i % 6],
    shelf_life_years: Math.round(5 + Math.random() * 25),
  }))
}

const allOrdnance = [...ordnanceRecords, ...genRecords(21), ...genRecords(61)]

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

const filterGroups = [
  {
    key: 'ordnance',
    label: 'Ordnance Type',
    options: ORDNANCE_TYPES.map(t => ({ label: t, value: t, count: allOrdnance.filter(r => r.ordnance === t).length })),
  },
  {
    key: 'depot',
    label: 'Ordnance Depot',
    options: DEPOTS.map(d => ({ label: d, value: d, count: allOrdnance.filter(r => r.depot === d).length })),
  },
  {
    key: 'issue_status',
    label: 'Issue Status',
    options: ISSUE_STATUS.map(s => ({ label: s, value: s, count: allOrdnance.filter(r => r.issue_status === s).length })),
  },
]

function OrdnanceBadge({ ordnance }: { ordnance: string }) {
  const colors: Record<string, string> = { '155mm artillery shells': 'bg-red-100 text-red-800', 'PKT 7.62mm ammo': 'bg-orange-100 text-orange-800', 'INSAS 5.56mm rounds': 'bg-amber-100 text-amber-800', 'T-90 tank ammo': 'bg-rose-100 text-rose-800', 'Akash SAM missiles': 'bg-yellow-100 text-yellow-800', 'BrahMos cruise missiles': 'bg-pink-100 text-pink-800', 'Pinaka guided rockets': 'bg-fuchsia-100 text-fuchsia-800', 'RPG-7 anti-tank': 'bg-stone-100 text-stone-800' }
  return <span className={`dos-ordnance-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[ordnance] || 'bg-gray-100 text-gray-800'}`}>{ordnance}</span>
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { 'IAF Cleared': 'bg-green-100 text-green-800', 'QA Passed': 'bg-blue-100 text-blue-800', 'In Transit': 'bg-red-100 text-red-800', 'Arsenal Stored': 'bg-slate-100 text-slate-800', 'Pending DGQA': 'bg-yellow-100 text-yellow-800', 'Awaiting Allocation': 'bg-gray-200 text-gray-700' }
  return <span className={`dos-status-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
}

function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 500000000) * 100)
  const color = cost >= 300000000 ? 'bg-red-600' : cost >= 100000000 ? 'bg-red-500' : cost >= 30000000 ? 'bg-red-400' : 'bg-red-300'
  return <div className="dos-cost-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`dos-cost-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{'₹' + (cost / 10000000).toFixed(1) + 'Cr'}</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return <div className="dos-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="dos-ring-path" strokeLinecap="round" /></svg><span className="dos-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="dos-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="dos-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="dos-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
}

export default function DefenceOrdnanceSupplyView() {
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

  const filtered = allOrdnance.filter(e => {
    const q = searchQuery.toLowerCase()
    if (q && !e.id.toLowerCase().includes(q) && !e.ordnance.toLowerCase().includes(q) && !e.description.toLowerCase().includes(q) && !e.depot.toLowerCase().includes(q) && !e.destination.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(e[key as keyof typeof e] as string))
  })

  const totalCost = allOrdnance.reduce((s, e) => s + e.cost_inr, 0)
  const iafCleared = allOrdnance.filter(e => e.issue_status === 'IAF Cleared').length
  const inTransit = allOrdnance.filter(e => e.issue_status === 'In Transit').length
  const pendingDGQA = allOrdnance.filter(e => e.issue_status === 'Pending DGQA').length

  const monthlyData = [
    { month: 'Jan', units: 85000, value_cr: 120, issues: 42 },
    { month: 'Feb', units: 125000, value_cr: 185, issues: 58 },
    { month: 'Mar', units: 180000, value_cr: 265, issues: 72 },
    { month: 'Apr', units: 95000, value_cr: 142, issues: 35 },
    { month: 'May', units: 220000, value_cr: 325, issues: 88 },
    { month: 'Jun', units: 68000, value_cr: 98, issues: 28 },
    { month: 'Jul', units: 250000, value_cr: 380, issues: 95 },
  ]
  const ordnanceData = ORDNANCE_TYPES.map(t => ({ ordnance: t.split(' ').slice(0, 2).join(' '), count: allOrdnance.filter(r => r.ordnance === t).length }))
  const depotData = DEPOTS.map(d => ({ depot: d.split(' ').slice(-2).join(' '), count: allOrdnance.filter(r => r.depot === d).length }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'inventory', label: 'Inventory' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="dos-container space-y-4">
      <PageHeader title="Defence Ordnance Supply Chain" description="Indian Army Ordnance Corps and DPSU (Defence Public Sector Undertaking) ammunition supply chain management for artillery shells, small arms ammunition, tank rounds, surface-to-air missiles, cruise missiles, guided rockets, and anti-tank munitions with DGQA quality assurance, Ministry of Defence procurement tracking, OFB/PSU production monitoring, and strategic depot allocation across 41 ordnance depots under the Army Ordnance Directorate" />
      <ModuleBreadcrumb items={[{ label: 'Defence' }, { label: 'Ordnance Supply' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="dos-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="dos-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="dos-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Lots" value={allOrdnance.length.toString()} sub="Ordnance consignments" />
            <KpiTile title="Total Value" value={`₹${(totalCost / 10000000).toFixed(0)}Cr`} sub="Defence procurement value" />
            <KpiTile title="DGQA Cleared" value={iafCleared.toString()} sub={`${((iafCleared / allOrdnance.length) * 100).toFixed(0)}% certified` } />
            <KpiTile title="In Transit" value={inTransit.toString()} sub={`${((inTransit / allOrdnance.length) * 100).toFixed(0)}% pipeline`} />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={99} label="DGQA Compliance" color="#dc2626" />
            <HealthRing value={97} label="Security Audit" color="#b91c1c" />
            <HealthRing value={95} label="Stock Accuracy" color="#ef4444" />
            <HealthRing value={98} label="Shelf Life OK" color="#7f1d1d" />
            <HealthRing value={96} label="Ready Issue" color="#f87171" />
            <HealthRing value={94} label="Depot Capacity" color="#fca5a5" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="dos-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Issues & Issue Count</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="units" stroke="#dc2626" strokeWidth={2} /><Line type="monotone" dataKey="issues" stroke="#b91c1c" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card>
            <Card className="dos-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Inventory by Ordnance Type</CardTitle></CardHeader><CardContent><BarChart data={ordnanceData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="ordnance" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#dc2626" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="dos-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Depot Allocation Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={depotData} dataKey="count" nameKey="depot" cx="50%" cy="50%" outerRadius={70} label={({ depot, count }) => `${count}`}>{depotData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="dos-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allOrdnance.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, ordnance type, depot, destination, or lot..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="dos-table w-full text-sm">
              <thead><tr className="dos-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Ordnance</th><th className="px-3 py-2 text-left font-medium">Status</th><th className="px-3 py-2 text-left font-medium">Qty</th><th className="px-3 py-2 text-left font-medium">Value</th><th className="px-3 py-2 text-left font-medium">Depot</th><th className="px-3 py-2 text-left font-medium">Destination</th><th className="px-3 py-2 text-left font-medium">Haz</th><th className="px-3 py-2 text-left font-medium">Life</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(e => (
                <tr key={e.id} className="dos-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{e.id}</td>
                  <td className="px-3 py-2"><OrdnanceBadge ordnance={e.ordnance} /></td>
                  <td className="px-3 py-2"><StatusBadge status={e.issue_status} /></td>
                  <td className="px-3 py-2 text-xs">{e.quantity.toLocaleString()}</td>
                  <td className="px-3 py-2"><CostBar cost={e.cost_inr} /></td>
                  <td className="px-3 py-2 text-xs">{e.depot}</td>
                  <td className="px-3 py-2 text-xs">{e.destination}</td>
                  <td className="px-3 py-2 text-xs font-mono">{e.hazard_class}</td>
                  <td className="px-3 py-2 text-xs">{e.shelf_life_years}yr</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="dos-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg Issue Time" value="4.2 days" trend="-12% faster" />
            <ValueTile title="DGQA Pass Rate" value="99.1%" trend="+0.4% improved" />
            <ValueTile title="Make-in-India %" value="72.5%" trend="+8.3% YoY" />
            <ValueTile title="Emergency Issue SLA" value="98.8%" trend="+2.1% critical" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="dos-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Procurement Value by Ordnance Category</CardTitle></CardHeader><CardContent><BarChart data={ORDNANCE_TYPES.map(t => ({ ordnance: t.split(' ').slice(0, 2).join(' '), total: allOrdnance.filter(r => r.ordnance === t).reduce((s, r) => s + r.cost_inr, 0) / 10000000 }))} width={400} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="ordnance" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="total" fill="#b91c1c" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="dos-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Issue Status Breakdown</CardTitle></CardHeader><CardContent><PieChart width={400} height={250}><Pie data={ISSUE_STATUS.map(s => ({ status: s, count: allOrdnance.filter(e => e.issue_status === s).length }))} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>{ISSUE_STATUS.map((_, i) => <Cell key={i} fill={['#22c55e','#3b82f6','#ef4444','#64748b','#eab308','#9ca3af'][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="dos-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="dos-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">DGQA Quality Assurance & Certification System</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Directorate General of Quality Assurance (DGQA) digital certification and inspection workflow automation for 41 ordnance factories, 7 DPSUs, and 120+ private defence manufacturers under Make in India defence production policy. Real-time DGQA inspection scheduling and lot acceptance tracking with 72-hour turnaround SLA for critical munitions during operational emergencies. Integration with CQA (Controller of Quality Assurance) for each DPSU including OFB, BEL, HAL, BDL, MDL, GSL, and GRSE ensuring 100% lot-by-lot inspection compliance. Automated proof firing and ballistic test result capture from Field Gun Factory, Ordnance Factory Khamaria, and Proof Range Balasore with statistical process control dashboards. Digital shelf-life monitoring and lot numbering system with 15-year advance expiry warning for proactive condemnation board scheduling and replacement procurement initiation.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-red-800">Critical</span><span className="text-gray-400">Live</span></div></CardContent></Card>
            <Card className="dos-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">MoD Defence Procurement & Capital Acquisition Tracking</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Ministry of Defence (MoD) capital acquisition procurement tracking under Defence Acquisition Procedure (DAP) 2020 for all ammunition categories from Acceptance of Necessity (AoN) to contract signature and delivery completion. Real-time monitoring of 142 active procurement cases across Buy Indian, Buy & Make Indian, and Buy Global categories with milestone tracking for TTC (Technical Evaluation Committee), CNC (Contract Negotiation Committee), and SCC (Supply Chain Controller) stages. Integration with Integrated Financial Advisor (IFA) Defence budget allocation and expenditure tracking for {'₹'}6.22 lakh crore defence capital outlay FY2026-27. Automated indent management system connecting user commands (Northern/Western/Southern/Eastern/Central/South Western/Training) with Army HQ Ordnance Directorate and production agencies ensuring demand-supply matching. Make in India indigenization tracking monitoring 72.5% domestic content requirement with vendor development dashboard for 340+ Indian MSME defence suppliers.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-rose-800">Strategic</span><span className="text-gray-400">FY2027</span></div></CardContent></Card>
            <Card className="dos-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Strategic Ordnance Depot Network & War Reserves</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Army Ordnance Corps 41 ordnance depots strategic capacity monitoring with real-time stock-level tracking across 8 Commands for 40 days war reserve ammunition (WRA) maintenance mandate. Automated replenishment trigger system based on minimum operating level (MOL) and war reserve wastage norm (WRWN) calculations for each ammunition nomenclature at depot level. Multi-tier security and surveillance integration with military police, CISF, and CCTV monitoring ensuring ammunition safety protocols under Ordnance Factory safety rules and DGMS (Directorate General of Mines Safety) compliance for explosive hazard classes 1.1D, 1.1J, and 1.4S. Environmental monitoring system for temperature and humidity in explosive storage buildings (ESB) and ammunition bunkers with 24-hour automated alerts for conditions exceeding 60% RH and 35C limits. Integration with military railway and road transport dispatch planning optimizing ammunition movement from production factories to forward depots during peacetime and wartime surge operations.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-orange-800">Operational</span><span className="text-gray-400">Q3 2026</span></div></CardContent></Card>
            <Card className="dos-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">AI Predictive Ammunition Demand & Supply Analytics</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Machine learning model predicting ammunition consumption patterns based on training exercise schedules, operational deployments, and seasonal firing ranges with 91% accuracy for quarterly demand forecasting 6 months ahead. Integration with Army Training Command (ARTRAC) annual training calendar for all Corps and Divisions enabling proactive production scheduling alignment with OFB and private manufacturers. Historical consumption analytics covering 75 years of ammunition usage data from 1962 Sino-Indian war to 2026 military exercises correlating expenditure with operational intensity and terrain type. Predictive shelf-life management using lot-level environmental exposure data and accelerated aging models to forecast lot condemnation schedules 5 years ahead enabling budgetary provisioning. AI-powered supply chain risk assessment monitoring geopolitical disruptions, raw material shortages (TNT, RDX, HMX, propellant), and production capacity constraints across 7 DPSU factories with automated escalation alerts.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">Innovation</span><span className="text-gray-400">Pilot</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
