'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface FESRecord {
  id: string; projectId: string; city: string; operator: string; flywheelType: string
  storageCapacityMWh: number; investmentCr: number; rpmMax: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#166534', '#15803d', '#16a34a', '#22c55e', '#4ade80', '#14532d', '#052e16', '#365314']

const records: FESRecord[] = [
  { id: 'FES-0001', projectId: 'FES-001', city: 'Mumbai', operator: 'Kinetic Storage India', flywheelType: 'Steel Rotor 15,000 RPM',
    storageCapacityMWh: 80, investmentCr: 420, rpmMax: 15000, status: 'Delivered', priority: 'Critical', origin: 'Mumbai Port', destination: 'Tata Power Trombay', shipDate: '2025-03-10', transitDays: 2, state: 'Maharashtra',
    remarks: 'Steel rotor flywheel at 15,000 RPM for Tata Power Trombay grid frequency regulation. 80 MWh storage capacity provides 15-minute ride-through for 200 MW thermal plant. &#8377;420 Cr installation supports Mumbai&apos;s critical power infrastructure with sub-second response time for grid stabilization.' },
  { id: 'FES-0002', projectId: 'FES-002', city: 'Delhi', operator: 'BRPL Grid Storage', flywheelType: 'Carbon Composite 30,000 RPM',
    storageCapacityMWh: 120, investmentCr: 680, rpmMax: 30000, status: 'Delivered', priority: 'Critical', origin: 'Noida Factory', destination: 'BRPL Raja Garden', shipDate: '2025-03-15', transitDays: 1, state: 'Delhi',
    remarks: 'Carbon composite flywheel at 30,000 RPM for BSES Rajdhani Palace (BRPL) grid load leveling in Delhi. 120 MWh capacity with 95% round-trip efficiency handling peak demand swings. &#8377;680 Cr project integrates with Delhi smart grid for frequency regulation and solar ramping support.' },
  { id: 'FES-0003', projectId: 'FES-003', city: 'Bengaluru', operator: 'Karnataka Flywheel Systems', flywheelType: 'Magnetic Levitation 45,000 RPM',
    storageCapacityMWh: 60, investmentCr: 520, rpmMax: 45000, status: 'Delivered', priority: 'High', origin: 'Peenya Industrial', destination: 'KPTC Hebbal Substation', shipDate: '2025-03-05', transitDays: 3, state: 'Karnataka',
    remarks: 'Magnetic levitation flywheel at 45,000 RPM for Karnataka Power Transmission Corporation substation. Zero-friction magnetic bearings enable 97% round-trip efficiency with 20-year operational life. &#8377;520 Cr system handles Bengaluru&apos;s IT corridor demand fluctuations with millisecond response time.' },
  { id: 'FES-0004', projectId: 'FES-004', city: 'Chennai', operator: 'TANGEDCO Storage Div', flywheelType: 'Steel Rotor 20,000 RPM',
    storageCapacityMWh: 150, investmentCr: 750, rpmMax: 20000, status: 'Delivered', priority: 'Critical', origin: 'Ennore Port', destination: 'TANGEDCO TNEB Complex', shipDate: '2025-02-28', transitDays: 2, state: 'Tamil Nadu',
    remarks: 'High-capacity steel rotor flywheel at 20,000 RPM for TANGEDCO wind-solar balancing. 150 MWh storage absorbs excess renewable generation during peak wind hours. &#8377;750 Cr installation at Chennai enables 400 MW renewable smoothing for Tamil Nadu&apos;s 10 GW wind fleet integration.' },
  { id: 'FES-0005', projectId: 'FES-005', city: 'Hyderabad', operator: 'Telangana Grid Solutions', flywheelType: 'Superconducting 60,000 RPM',
    storageCapacityMWh: 45, investmentCr: 580, rpmMax: 60000, status: 'In Transit', priority: 'High', origin: 'Mumbai Port', destination: 'TS Transco Jubilee Hills', shipDate: '2025-03-20', transitDays: 4, state: 'Telangana',
    remarks: 'Superconducting magnetic bearing flywheel at 60,000 RPM en route to Telangana Transco grid station. World-class energy density of 500 Wh/kg with near-zero standby losses. &#8377;580 Cr investment in cutting-edge technology for Hyderabad&apos;s data center cluster UPS and telecom tower backup power.' },
  { id: 'FES-0006', projectId: 'FES-006', city: 'Kolkata', operator: 'CESC Flywheel Unit', flywheelType: 'Steel Rotor 12,000 RPM',
    storageCapacityMWh: 90, investmentCr: 380, rpmMax: 12000, status: 'Delivered', priority: 'Medium', origin: 'Kolkata Dock', destination: 'CESC Titagarh Station', shipDate: '2025-03-12', transitDays: 2, state: 'West Bengal',
    remarks: 'Steel rotor flywheel at 12,000 RPM for CESC utility grid stabilization in Kolkata. 90 MWh capacity provides voltage regulation for eastern grid corridor. &#8377;380 Cr lower-cost steel design optimized for 25,000 cycle lifetime with minimal maintenance requirements for utility-scale deployment.' },
  { id: 'FES-0007', projectId: 'FES-007', city: 'Pune', operator: 'Maharashtra Kinetic Storage', flywheelType: 'Carbon Composite 35,000 RPM',
    storageCapacityMWh: 70, investmentCr: 460, rpmMax: 35000, status: 'Delivered', priority: 'High', origin: 'Chakan Industrial', destination: 'MSEDCL Hadapsar', shipDate: '2025-03-08', transitDays: 1, state: 'Maharashtra',
    remarks: 'Carbon composite flywheel at 35,000 RPM for MSEDCL substation load management in Pune. 70 MWh capacity handles rapid demand changes from Pune&apos;s automotive and IT industries. &#8377;460 Cr system achieves 96% round-trip efficiency with carbon fiber rotor technology from indigenous manufacturing.' },
  { id: 'FES-0008', projectId: 'FES-008', city: 'Jaipur', operator: 'Rajasthan Kinetic Power', flywheelType: 'Steel Rotor 18,000 RPM',
    storageCapacityMWh: 110, investmentCr: 440, rpmMax: 18000, status: 'Delivered', priority: 'Medium', origin: 'Kandla Port', destination: 'JVVNL Heerapura', shipDate: '2025-03-18', transitDays: 3, state: 'Rajasthan',
    remarks: 'Steel rotor flywheel at 18,000 RPM for Jaipur Vidyut Vitran Nigam solar smoothing. 110 MWh capacity handles Rajasthan&apos;s 25 GW solar ramping during cloud transients. &#8377;440 Cr installation provides critical grid services for Bhadla and Fatehpur solar park energy integration.' },
  { id: 'FES-0009', projectId: 'FES-009', city: 'Ahmedabad', operator: 'Gujarat Grid Flywheel', flywheelType: 'Magnetic Levitation 50,000 RPM',
    storageCapacityMWh: 55, investmentCr: 620, rpmMax: 50000, status: 'Delayed', priority: 'Critical', origin: 'Hazira Port', destination: 'GETCO Substation', shipDate: '2025-02-20', transitDays: 2, state: 'Gujarat',
    remarks: 'Maglev flywheel at 50,000 RPM for Gujarat Energy Transmission Corporation grid balancing delayed by port congestion. 55 MWh high-energy-density system for Adani and Tata Power renewable integration. &#8377;620 Cr project critical for handling 30 GW renewable fleet intermittency in Gujarat&apos;s western grid.' },
  { id: 'FES-0010', projectId: 'FES-010', city: 'Kochi', operator: 'Kerala Grid Storage', flywheelType: 'Steel Rotor 15,000 RPM',
    storageCapacityMWh: 40, investmentCr: 240, rpmMax: 15000, status: 'Delivered', priority: 'Medium', origin: 'Cochin Port', destination: 'KSEB Ernakulam', shipDate: '2025-03-22', transitDays: 1, state: 'Kerala',
    remarks: 'Steel rotor flywheel at 15,000 RPM for Kerala State Electricity Board frequency regulation. 40 MWh capacity handles Kerala&apos;s hydro-solar complementarity with fast response. &#8377;240 Cr cost-effective steel design providing 20-year lifecycle for Kerala&apos;s growing renewable energy grid balancing needs.' },
  { id: 'FES-0011', projectId: 'FES-011', city: 'Lucknow', operator: 'UP Kinetic Solutions', flywheelType: 'Carbon Composite 25,000 RPM',
    storageCapacityMWh: 85, investmentCr: 390, rpmMax: 25000, status: 'In Transit', priority: 'High', origin: 'Delhi ICD', destination: 'UPPCL Kanpur Road', shipDate: '2025-03-25', transitDays: 3, state: 'Uttar Pradesh',
    remarks: 'Carbon composite flywheel at 25,000 RPM en route to UPPCL substation in Lucknow. 85 MWh capacity for Uttar Pradesh grid load management and solar integration. &#8377;390 Cr investment covers NCR region power quality improvement with flywheel-diesel hybrid UPS for critical facilities.' },
  { id: 'FES-0012', projectId: 'FES-012', city: 'Bhubaneswar', operator: 'Odisha Renewable Storage', flywheelType: 'Superconducting 55,000 RPM',
    storageCapacityMWh: 35, investmentCr: 510, rpmMax: 55000, status: 'Delivered', priority: 'High', origin: 'Paradip Port', destination: 'OPTCL Bhubaneswar', shipDate: '2025-03-02', transitDays: 2, state: 'Odisha',
    remarks: 'Superconducting flywheel at 55,000 RPM for Odisha Power Transmission Corporation renewable integration. 35 MWh capacity handling Odisha&apos;s aluminum smelter load fluctuations. &#8377;510 Cr investment in superconducting technology enables 98% round-trip efficiency with negligible standby power draw.' },
  { id: 'FES-0013', projectId: 'FES-013', city: 'Guwahati', operator: 'NE Grid Balancing', flywheelType: 'Steel Rotor 10,000 RPM',
    storageCapacityMWh: 25, investmentCr: 160, rpmMax: 10000, status: 'Processing', priority: 'Low', origin: 'Kolkata Port', destination: 'ASEB Guwahati', shipDate: '2025-03-28', transitDays: 5, state: 'Assam',
    remarks: 'Low-speed steel rotor flywheel at 10,000 RPM for Assam State Electricity Board grid support. 25 MWh capacity providing basic frequency regulation for Northeast grid stability. &#8377;160 Cr cost-effective solution for Northeast India&apos;s growing renewable capacity including 3 GW hydro and 500 MW solar.' },
  { id: 'FES-0014', projectId: 'FES-014', city: 'Indore', operator: 'MP Kinetic Energy Ltd', flywheelType: 'Carbon Composite 40,000 RPM',
    storageCapacityMWh: 65, investmentCr: 410, rpmMax: 40000, status: 'Delayed', priority: 'High', origin: 'Mandideep Factory', destination: 'MPPTCL Indore East', shipDate: '2025-02-15', transitDays: 2, state: 'Madhya Pradesh',
    remarks: 'Carbon composite flywheel at 40,000 RPM for Madhya Pradesh Power Transmission grid delayed by manufacturing quality hold. 65 MWh capacity for MP&apos;s 5 GW renewable fleet balancing including solar, wind and small hydro. &#8377;410 Cr project undergoing additional rotor balance testing before final shipment clearance.' },
]

export default function FlywheelEnergyStorageView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof FESRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'flywheelType', label: 'Flywheel Type', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.flywheelType] = (m[r.flywheelType] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Storage', value: `${filtered.reduce((a: number, r) => a + r.storageCapacityMWh, 0).toLocaleString()} MWh` },
    { label: 'Avg Max RPM', value: `${(filtered.reduce((a: number, r) => a + r.rpmMax, 0) / Math.max(1, filtered.length)).toLocaleString()} RPM` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Avg Cost/MWh', value: `&#8377;${(filtered.reduce((a: number, r) => a + r.investmentCr, 0) * 100 / Math.max(1, filtered.reduce((a: number, r) => a + r.storageCapacityMWh, 0))).toFixed(0)} L` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: FESRecord) => string, val: (r: FESRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.storageCapacityMWh)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const matBar = grp(r => r.flywheelType, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const effData = filtered.map(r => ({ name: r.flywheelType.split(' ').slice(0, 2).join(' '), value: r.rpmMax }))
    const lm = filtered.reduce((a: Record<string, { storageCapacityMWh: number; investmentCr: number }>, r) => {
      if (!a[r.state]) a[r.state] = { storageCapacityMWh: 0, investmentCr: 0 }
      a[r.state].storageCapacityMWh += r.storageCapacityMWh; a[r.state].investmentCr += r.investmentCr; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, storageCapacityMWh: v.storageCapacityMWh, investmentCr: v.investmentCr }))
    return { barState, pieState, statusPie, matBar, priorityPie, totalInvest, effData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="fes-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Flywheel Energy Storage' }]} />
      <PageHeader title="Flywheel Energy Storage Logistics" description="Track flywheel energy storage systems, kinetic energy storage logistics, high-speed rotor distribution, and grid-scale mechanical energy storage for frequency regulation and renewable smoothing across India" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="fes-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`fes-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-green-900 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="fes-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="fes-kpi-card"><CardContent className="p-4"><p className="fes-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="fes-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="fes-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="fes-chart-title text-sm">Storage Capacity (MWh) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#166534" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="fes-chart-title text-sm">Installations by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="fes-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="fes-chart-title text-sm">Max RPM by Flywheel Type</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.effData}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#15803d" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="fes-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="fes-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`fes-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-green-900'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.flywheelType} | {r.state}</p>
              <p className="text-xs mt-1">{r.storageCapacityMWh.toLocaleString()} MWh | {r.rpmMax.toLocaleString()} RPM | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="fes-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="fes-chart-title text-sm">Storage vs Investment by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="storageCapacityMWh" stroke="#166534" name="Storage MWh" /><Line yAxisId="right" type="monotone" dataKey="investmentCr" stroke="#4ade80" name="Investment &#8377; Cr" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="fes-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#14532d" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="fes-chart-title text-sm">Flywheel Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.matBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#15803d" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="fes-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="fes-insights grid grid-cols-2 gap-4">
        <Card className="fes-insight-card border-l-4 border-l-green-900"><CardContent className="p-5">
          <h4 className="fes-insight-title font-semibold text-base">India&apos;s &#8377;12,000 Cr Flywheel Storage Market by 2030</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s flywheel energy storage market growing at 32% CAGR, targeting &#8377;12,000 Cr by 2030. Grid-scale flywheels uniquely suited for India&apos;s frequency regulation needs with 15-minute storage at 95%+ efficiency. Ministry of Power mandating 500 MW flywheel capacity for all regional load dispatch centres by 2028 under National Energy Storage Mission.</p>
        </CardContent></Card>
        <Card className="fes-insight-card border-l-4 border-l-green-900"><CardContent className="p-5">
          <h4 className="fes-insight-title font-semibold text-base">Renewable Smoothing: Solar + Wind Integration</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s 175 GW renewable target requires 40 GW of short-duration storage for ramping support. Flywheel systems provide sub-second response for cloud transients on solar farms and wind gust smoothing. SECI and NTPC installing flywheel arrays at Bhadla (Rajasthan) and Kanyakumari (TN) wind farms for 800 MW renewable smoothing capacity.</p>
        </CardContent></Card>
        <Card className="fes-insight-card border-l-4 border-l-green-900"><CardContent className="p-5">
          <h4 className="fes-insight-title font-semibold text-base">High-Speed Carbon Composite: Indigenous Manufacturing</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India developing indigenous carbon composite flywheel rotor manufacturing at &#8377;2,500 Cr investment under Make in India. HAL and NAL collaborating on aerospace-grade carbon fiber rotors achieving 40,000 RPM. CSIR-NAL carbon fiber composite technology transferred to 5 private manufacturers for commercial flywheel production by 2027.</p>
        </CardContent></Card>
        <Card className="fes-insight-card border-l-4 border-l-green-900"><CardContent className="p-5">
          <h4 className="fes-insight-title font-semibold text-base">Data Center UPS: Flywheel-Diesel Hybrid</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s 1,000+ data centers consuming 8 GW power require reliable UPS systems. Flywheel-diesel hybrid UPS eliminates lead-acid battery dependency with 20-year flywheel life vs 3-year battery replacement. &#8377;3,000 Cr market opportunity for flywheel UPS in NCR, Mumbai, Bengaluru and Hyderabad data center clusters through 2030.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
