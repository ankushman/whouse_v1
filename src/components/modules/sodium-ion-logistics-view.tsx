'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface SIRRecord {
  id: string; projectId: string; city: string; operator: string; cellType: string
  capacityMWh: number; investmentCr: number; energyDensity: number; cycles: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#7e22ce', '#9333ea', '#a855f7', '#c084fc', '#d8b4fe', '#6b21a8', '#581c87', '#3b0764']

const records: SIRRecord[] = [
  { id: 'SIR-0001', projectId: 'SIR-001', city: 'Bengaluru', operator: 'Tata Sodium Ion Bengaluru', cellType: 'Layered Oxide NaCrO2 150Wh/kg',
    capacityMWh: 60, investmentCr: 180, energyDensity: 150, cycles: 3000, status: 'Delivered', priority: 'Critical', origin: 'Tata Chemicals Soda Ash', destination: 'Bengaluru EV Assembly', shipDate: '2025-10-05', transitDays: 1, state: 'Karnataka',
    remarks: 'NaCrO2 layered oxide sodium-ion battery cell manufacturing at Tata Chemicals Bengaluru with 60 MWh annual capacity at 150 Wh/kg energy density. Sodium sourced from Tata Chemicals Mithapur soda ash plant in Gujarat eliminating lithium import dependency. &#8377;180 Cr facility supplies cells for Tata Motors electric three-wheeler and entry-level EV range achieving &#8377;1.5 lakh battery pack cost 50% cheaper than equivalent lithium iron phosphate for Indian mass-market electric mobility segment.' },
  { id: 'SIR-0002', projectId: 'SIR-002', city: 'Ahmedabad', operator: 'Reliance Na-Ion Gigafactory', cellType: 'Prussian Blue NaFeHCF 120Wh/kg',
    capacityMWh: 200, investmentCr: 520, energyDensity: 120, cycles: 5000, status: 'Delivered', priority: 'Critical', origin: 'Reliance Jamnagar Salt', destination: 'Ahmedabad Grid Storage', shipDate: '2025-10-10', transitDays: 1, state: 'Gujarat',
    remarks: 'Prussian blue analogue NaFeHCF sodium-ion battery gigafactory at Reliance Jamnagar with 200 MWh annual capacity using Prussian blue cathode chemistry. Ultra-low-cost sodium from seawater desalination plant achieving 120 Wh/kg at &#8377;800/kWh cell cost. &#8377;520 Cr project is India&apos;s largest sodium-ion factory supplying stationary storage batteries for Reliance Jio 5G tower power backup replacing lead-acid at 200,000 telecom sites across India under Digital India Green Telecom initiative.' },
  { id: 'SIR-0003', projectId: 'SIR-003', city: 'Hyderabad', operator: 'Amara Raja Na-Ion', cellType: 'Hard Carbon HC-Na 135Wh/kg',
    capacityMWh: 80, investmentCr: 240, energyDensity: 135, cycles: 4000, status: 'Delivered', priority: 'High', origin: 'Amara Raja Tirupati', destination: 'Hyderabad Auto OEM', shipDate: '2025-10-02', transitDays: 2, state: 'Telangana',
    remarks: 'Hard carbon anode sodium-ion cells at Amara Raja Hyderabad with 80 MWh capacity at 135 Wh/kg using bio-mass derived hard carbon from coconut shell and rice husk. Hard carbon anode eliminates graphite import dependency using abundant Indian agricultural waste feedstock. &#8377;240 Cr facility supplies sodium-ion battery packs to Mahindra and Hyundai for Indian market entry-level EVs at &#8377;2 lakh per pack enabling &#8377;6 lakh electric car price point achieving mass EV adoption parity with ICE vehicles for Indian middle-class consumers.' },
  { id: 'SIR-0004', projectId: 'SIR-004', city: 'Pune', operator: 'Exicom Na-Ion Telecom', cellType: 'Polyanionic Na3V2(PO4)3 100Wh/kg',
    capacityMWh: 45, investmentCr: 130, energyDensity: 100, cycles: 8000, status: 'Delivered', priority: 'High', origin: 'Exicom Gandhinagar Plant', destination: 'Pune Telecom Hub', shipDate: '2025-09-28', transitDays: 2, state: 'Maharashtra',
    remarks: 'Polyanionic sodium vanadium phosphate cells at Exicom Pune with 45 MWh capacity at 100 Wh/kg achieving 8,000 cycle life ideal for telecom tower backup. Na3V2(PO4)3 cathode offers exceptional cycle stability with zero capacity degradation over 8 years continuous operation. &#8377;130 Cr deployment replaces 50,000 lead-acid telecom batteries across Airtel Vodafone-Idea and Jio towers in Maharashtra saving &#8377;40 Cr annual battery replacement cost while enabling 48-hour power backup at 5G sites under DoT green telecom infrastructure mandate.' },
  { id: 'SIR-0005', projectId: 'SIR-005', city: 'Chennai', operator: 'TVS Na-Ion Two Wheeler', cellType: 'Layered Oxide NaNiMnO2 140Wh/kg',
    capacityMWh: 55, investmentCr: 165, energyDensity: 140, cycles: 2500, status: 'In Transit', priority: 'High', origin: 'TVS Hosur Plant', destination: 'Chennai TVS Export', shipDate: '2025-10-15', transitDays: 2, state: 'Tamil Nadu',
    remarks: 'NaNiMnO2 layered oxide sodium-ion cells en route to TVS Chennai for electric two-wheeler battery packs with 55 MWh annual capacity at 140 Wh/kg. Nickel-manganese cathode avoids cobalt dependency achieving cost parity with lead-acid at 5x longer cycle life. &#8377;165 Cr facility under TVS-Kyocera sodium-ion JV supplies battery packs for TVS iQube electric scooter export to Southeast Asian markets targeting 100,000 units annually at &#8377;25,000 pack cost making electric scooters affordable for price-sensitive Indian two-wheeler market of 20 million annual sales.' },
  { id: 'SIR-0006', projectId: 'SIR-006', city: 'Kolkata', operator: 'Exide Na-Ion Storage', cellType: 'NaTi2(PO4)3 Titanate 90Wh/kg',
    capacityMWh: 100, investmentCr: 280, energyDensity: 90, cycles: 10000, status: 'Delivered', priority: 'Medium', origin: 'Exide Kolkata Works', destination: 'WB Grid Storage', shipDate: '2025-10-08', transitDays: 2, state: 'West Bengal',
    remarks: 'Sodium titanium phosphate NaTi2(PO4)3 cells at Exide Kolkata with 100 MWh capacity at 90 Wh/kg achieving 10,000 cycle life for 25-year grid storage applications. Zero-strain titanate anode eliminates dendrite formation risk enabling safe deep discharge to 0% SOC. &#8377;280 Cr facility upgrades Exide&apos;s legacy lead-acid production line to sodium-ion manufacturing under National Battery Energy Storage Mission serving WBSEDCL distribution transformer peak load management for 500 substations across West Bengal electricity grid.' },
  { id: 'SIR-0007', projectId: 'SIR-007', city: 'Bhubaneswar', operator: 'NALCO Na-Ion Alumina', cellType: 'Na3V2(SO4)3 Sulfate 130Wh/kg',
    capacityMWh: 70, investmentCr: 210, energyDensity: 130, cycles: 3500, status: 'Delivered', priority: 'Medium', origin: 'NALCO Damanjodi Alumina', destination: 'Bhubaneswar Grid Hub', shipDate: '2025-09-25', transitDays: 2, state: 'Odisha',
    remarks: 'Sodium vanadium sulfate Na3V2(SO4)3 cells at NALCO Bhubaneswar with 70 MWh capacity at 130 Wh/kg using vanadium sourced from NALCO alumina refinery byproduct stream. Integrated sodium-vanadium supply from captive alumina refining operations. &#8377;210 Cr project under NALCO diversification programme produces sodium-ion cells using company&apos;s own soda ash and vanadium feedstock achieving &#8377;900/kWh fully integrated cell cost supplying GRIDCO Odisha grid peak storage requirements for coastal wind and solar integration in eastern India transmission network.' },
  { id: 'SIR-0008', projectId: 'SIR-008', city: 'Noida', operator: 'Log9 Na-Ion Rapid Charge', cellType: 'Hard Carbon Fast-Charge 110Wh/kg',
    capacityMWh: 35, investmentCr: 105, energyDensity: 110, cycles: 3000, status: 'Delivered', priority: 'Medium', origin: 'Log9 Noida Lab', destination: 'NCR EV Fleet', shipDate: '2025-10-12', transitDays: 1, state: 'Uttar Pradesh',
    remarks: 'Fast-charge hard carbon sodium-ion cells at Log9 Materials Noida with 35 MWh capacity at 110 Wh/kg supporting 15-minute 80% charge rate. Patented hard carbon nanostructure achieves 3C charge rate without capacity loss enabling rapid electric bus depot charging. &#8377;105 Cr project supplies sodium-ion packs to Delhi Transport Corporation for 200 electric buses enabling single-shift depot overnight charging replacing expensive lithium-ion packs at &#8377;1.2 lakh per kWh savings for DTC&apos;s electric bus fleet expansion under FAME II scheme Phase-2 procurement.' },
  { id: 'SIR-0009', projectId: 'SIR-009', city: 'Jaipur', operator: 'Rajasthan Na-Ion Solar', cellType: 'Prussian Blue NaMnHCF 115Wh/kg',
    capacityMWh: 90, investmentCr: 260, energyDensity: 115, cycles: 6000, status: 'Delayed', priority: 'High', origin: 'Sambhar Lake Sodium', destination: 'Jaipur Solar Storage', shipDate: '2025-09-15', transitDays: 4, state: 'Rajasthan',
    remarks: 'NaMnHCF Prussian blue sodium-ion cells at Rajasthan solar storage hub with 90 MWh capacity delayed by Sambhar Lake sodium extraction plant commissioning. Sodium sourced directly from Sambhar Lake brine eliminating synthetic soda ash conversion cost. &#8377;260 Cr project provides 90 MW for 1 hour evening storage for Rajasthan&apos;s 15,000 MW solar fleet at &#8377;1,200/kWh installed cost under Rajasthan Solar Energy Policy enabling 24x7 solar power dispatch through RVPN transmission network replacing gas turbine evening peakers.' },
  { id: 'SIR-0010', projectId: 'SIR-010', city: 'Lucknow', operator: 'UPPCL Na-Ion Rural', cellType: 'Hard Carbon NaVPO4F 105Wh/kg',
    capacityMWh: 40, investmentCr: 115, energyDensity: 105, cycles: 4500, status: 'Delivered', priority: 'Medium', origin: 'UPPCL Lucknow', destination: 'UP Rural Substations', shipDate: '2025-10-01', transitDays: 3, state: 'Uttar Pradesh',
    remarks: 'Sodium fluorophosphate NaVPO4F cells at UPPCL Lucknow with 40 MWh capacity at 105 Wh/kg for rural electrification energy storage. Fluorophosphate cathode achieves excellent thermal stability at 60&#176;C ambient for northern India summer conditions. &#8377;115 Cr deployment provides 4-hour battery storage for 500 rural substations in Purvanchal region eliminating evening load shedding for 2 million rural households under Saubhagya Har Ghar Bijli scheme providing 24x7 power access to UP&apos;s 75 million rural population.' },
  { id: 'SIR-0011', projectId: 'SIR-011', city: 'Gandhinagar', operator: 'IITRAM Na-Ion Research', cellType: 'Organic NaC6H4O2 80Wh/kg',
    capacityMWh: 10, investmentCr: 85, energyDensity: 80, cycles: 2000, status: 'Delivered', priority: 'Low', origin: 'IITRAM Ahmedabad', destination: 'Gandhinagar Pilot', shipDate: '2025-10-18', transitDays: 1, state: 'Gujarat',
    remarks: 'Organic sodium-ion battery research at IITRAM Gandhinagar with 10 MWh pilot capacity using bio-inspired organic cathode NaC6H4O2 disodium terephthalate. Fully organic sodium-ion cell eliminates all metal mining dependency using petrochemical industry byproduct para-xylene as precursor. &#8377;85 Cr research-to-pilot facility under DST Technology Development Board demonstrates India&apos;s first metal-free battery chemistry achieving &#8377;500/kWh theoretical cell cost for future ultra-low-cost energy storage enabling 100% domestically sourced battery materials production by 2035.' },
  { id: 'SIR-0012', projectId: 'SIR-012', city: 'Guwahati', operator: 'Assam Na-Ion River', cellType: 'Layered Na0.67MnO2 125Wh/kg',
    capacityMWh: 25, investmentCr: 72, energyDensity: 125, cycles: 3500, status: 'Processing', priority: 'Low', origin: 'Brahmaputra Sodium', destination: 'Guwahati Distribution', shipDate: '2025-10-22', transitDays: 3, state: 'Assam',
    remarks: 'Sodium layered oxide cells at Guwahati with 25 MWh capacity extracting sodium directly from Brahmaputra river water electrolysis. Na0.67MnO2 cathode uses Assam tea garden manganese ore byproduct for low-cost cathode precursor. &#8377;72 Cr pilot under Assam Bio-Economy Mission evaluates river-sourced sodium for battery production creating rural battery manufacturing jobs while providing 4-hour evening storage for Guwahati distribution network serving Assam&apos;s petroleum refining and tea processing industries with reliable power supply.' },
  { id: 'SIR-0013', projectId: 'SIR-013', city: 'Mysuru', operator: 'Mahindra Na-Ion 3W', cellType: 'Hard Carbon HC-Na 145Wh/kg',
    capacityMWh: 65, investmentCr: 195, energyDensity: 145, cycles: 2800, status: 'Delivered', priority: 'High', origin: 'Mahindra Mysuru Plant', destination: 'Mysuru EV Assembly', shipDate: '2025-10-06', transitDays: 2, state: 'Karnataka',
    remarks: 'High-energy hard carbon sodium-ion cells at Mahindra Mysuru with 65 MWh capacity at 145 Wh/kg optimized for electric three-wheeler application. Mysuru facility produces integrated battery-to-pack systems with 45-minute full charge capability for Mahindra Treo and Alito electric three-wheelers. &#8377;195 Cr plant under Mahindra-Everstone Na-Ion partnership supplies 150,000 three-wheeler battery packs annually targeting India&apos;s 6 million three-wheeler fleet electrification at &#8377;35,000 per pack achieving sub-&#8377;1 per km operating cost versus &#8377;2.5 per km for CNG auto-rickshaws.' },
  { id: 'SIR-0014', projectId: 'SIR-014', city: 'Vadodara', operator: 'GSFC Na-Ion Chemical', cellType: 'Na3Fe2(PO4)2 108Wh/kg',
    capacityMWh: 110, investmentCr: 310, energyDensity: 108, cycles: 5500, status: 'Delayed', priority: 'High', origin: 'GSFC Soda Ash Plant', destination: 'Vadodara Grid Hub', shipDate: '2025-09-20', transitDays: 3, state: 'Gujarat',
    remarks: 'Sodium iron phosphate cells at GSFC Vadodara with 110 MWh capacity delayed by iron phosphate precursor supply chain disruption. Na3Fe2(PO4)2 cathode uses GSFC captive soda ash and imported iron phosphate with 5,500 cycle target for grid storage applications. &#8377;310 Cr facility under GSFC non-fertiliser diversification programme serves Gujarat state grid with 110 MW peak capacity for 1 hour at GETCO transmission substations replacing gas peaker plants at 70% lower levelized cost for Gujarat&apos;s 35,000 MW renewable-heavy grid integration requirements.' },
]

export default function SodiumIonLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const toggleFilter = (group: string, value: string) => {
    setActiveFilters(prev => {
      const arr = prev[group] || []
      const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]
      if (!next.length) { const { [group]: _, ...rest } = prev; return rest }
      return { ...prev, [group]: next }
    })
  }

  const filtered = useMemo(() => {
    let result = records
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(q)))
    }
    result = result.filter(r =>
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof SIRRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'cellType', label: 'Cell Type', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.cellType] = (m[r.cellType] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Capacity', value: `${filtered.reduce((a: number, r) => a + r.capacityMWh, 0).toLocaleString()} MWh` },
    { label: 'Avg Energy Density', value: `${(filtered.reduce((a: number, r) => a + r.energyDensity, 0) / Math.max(1, filtered.length)).toFixed(0)} Wh/kg` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Avg Cycles', value: `${(filtered.reduce((a: number, r) => a + r.cycles, 0) / Math.max(1, filtered.length)).toLocaleString()}` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: SIRRecord) => string, val: (r: SIRRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.capacityMWh)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const matBar = grp(r => r.cellType, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const effData = filtered.map(r => ({ name: r.cellType.split(' ').slice(0, 2).join(' '), value: r.energyDensity }))
    const lm = filtered.reduce((a: Record<string, { capacityMWh: number; investmentCr: number }>, r) => {
      if (!a[r.state]) a[r.state] = { capacityMWh: 0, investmentCr: 0 }
      a[r.state].capacityMWh += r.capacityMWh; a[r.state].investmentCr += r.investmentCr; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, capacityMWh: v.capacityMWh, investmentCr: v.investmentCr }))
    return { barState, pieState, statusPie, matBar, priorityPie, totalInvest, effData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="sir-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Sodium Ion Battery' }]} />
      <PageHeader title="Sodium Ion Battery Logistics" description="Track sodium-ion battery supply chains, Na-ion cell manufacturing logistics, cathode and anode material distribution, and sodium battery deployment for EVs, telecom and grid storage across India" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="sir-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`sir-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-purple-800 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="sir-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="sir-kpi-card"><CardContent className="p-4"><p className="sir-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="sir-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="sir-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="sir-chart-title text-sm">Cell Capacity (MWh) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#7e22ce" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="sir-chart-title text-sm">Installations by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="sir-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="sir-chart-title text-sm">Energy Density (Wh/kg) by Cell Type</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.effData}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#9333ea" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="sir-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="sir-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`sir-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-purple-800'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.cellType} | {r.state}</p>
              <p className="text-xs mt-1">{r.capacityMWh} MWh | {r.energyDensity} Wh/kg | {r.cycles.toLocaleString()} cycles | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="sir-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="sir-chart-title text-sm">Capacity vs Investment by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="capacityMWh" stroke="#7e22ce" name="Capacity MWh" /><Line yAxisId="right" type="monotone" dataKey="investmentCr" stroke="#d8b4fe" name="Investment &#8377; Cr" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="sir-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#6b21a8" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="sir-chart-title text-sm">Cell Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.matBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#9333ea" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="sir-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="sir-insights grid grid-cols-2 gap-4">
        <Card className="sir-insight-card border-l-4 border-l-purple-800"><CardContent className="p-5">
          <h4 className="sir-insight-title font-semibold text-base">India&apos;s Sodium-Ion: Zero Lithium Dependency by 2028</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India imports 100% of lithium for EV batteries creating critical supply chain vulnerability with China controlling 80% of global lithium refining. Sodium-ion technology uses abundant soda ash available from Sambhar Lake Gujarat and Tuticorin Tamil Nadu. NITI Aayog estimates India needs 500 GWh battery capacity by 2030 with sodium-ion serving 30% of stationary and entry-level EV segments at &#8377;2,500 Cr versus &#8377;50,000 Cr lithium-ion equivalent saving &#8377;47,500 Cr in lithium import bills annually under Atmanirbhar Bharat battery independence mission.</p>
        </CardContent></Card>
        <Card className="sir-insight-card border-l-4 border-l-purple-800"><CardContent className="p-5">
          <h4 className="sir-insight-title font-semibold text-base">Reliance Gigafactory: 10 GWh Na-Ion by 2027</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Reliance Industries converting Jamnagar refinery waste sodium into 10 GWh sodium-ion gigafactory at &#8377;25,000 Cr investment. Seawater desalination plant producing 500,000 tonnes annually of battery-grade sodium chloride feeding Prussian blue cathode manufacturing. India&apos;s largest Na-ion factory targeting 200,000 Jio 5G towers, 500,000 electric three-wheelers and 50,000 grid storage installations by 2027 under Mukesh Ambani green energy transition commitment converting 60% of Reliance&apos;s legacy petrochemical capacity to battery materials production.</p>
        </CardContent></Card>
        <Card className="sir-insight-card border-l-4 border-l-purple-800"><CardContent className="p-5">
          <h4 className="sir-insight-title font-semibold text-base">Hard Carbon from Rice Husk: India&apos;s Billion-Tonne Advantage</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India generates 200 million tonnes of rice husk and coconut shell annually containing 20% hard carbon precursor by weight. CSIR-IIT Kharagpur developing patented hard carbon nanostructure achieving 300 mAh/g capacity from agricultural waste biomass. &#8377;1,500 Cr National Hard Carbon Programme targeting 100,000 tonnes annual biomass-to-anode conversion by 2028 creating rural income of &#8377;3,000 Cr for 5 million farming families while eliminating graphite import dependency worth &#8377;8,000 Cr annually from China for battery anode materials supply chain security.</p>
        </CardContent></Card>
        <Card className="sir-insight-card border-l-4 border-l-purple-800"><CardContent className="p-5">
          <h4 className="sir-insight-title font-semibold text-base">Na-Ion for Telecom: India&apos;s 1.2 Million Tower Opportunity</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s 1.2 million telecom towers consuming &#8377;35,000 Cr annual diesel expenditure transitioning to sodium-ion battery backup at &#8377;12,000 Cr total investment. Na-ion&apos;s 8,000 cycle life provides 15-year service matching telecom tower lease duration with zero maintenance. DoT mandating sodium-ion replacement of lead-acid at 200,000 tower sites annually under Green Telecom Policy saving operators &#8377;5,000 Cr cumulative by 2030 while reducing 2.5 million tonnes CO2 emissions from diesel generators across India&apos;s 700,000 off-grid telecom sites.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
