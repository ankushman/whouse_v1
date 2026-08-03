'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface WHRRecord {
  id: string; projectId: string; city: string; operator: string; sourceIndustry: string
  recoveryMW: number; investmentCr: number; savingsCr: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2', '#fef2f2', '#fff1f2']

const records: WHRRecord[] = [
  { id: 'WHR-001', projectId: 'WHR-001', city: 'Jamshedpur', operator: 'Tata Steel Energy Recovery', sourceIndustry: 'Steel Smelting',
    recoveryMW: 85, investmentCr: 680, savingsCr: 320, status: 'Delivered', priority: 'Critical', origin: 'Tata Steel Works', destination: 'Adityapur Industrial', shipDate: '2024-01-15', transitDays: 10, state: 'Jharkhand',
    remarks: 'Flagship 85 MW waste heat recovery from blast furnace and coke oven off-gas at Tata Steel Jamshedpur, the largest WHR installation in Indian steel sector' },
  { id: 'WHR-002', projectId: 'WHR-002', city: 'Mumbai', operator: 'Reliance Industries Green', sourceIndustry: 'Petrochemical Refining',
    recoveryMW: 65, investmentCr: 520, savingsCr: 245, status: 'Delivered', priority: 'Critical', origin: 'Jamnagar Refinery', destination: 'Hazira Petrochem', shipDate: '2024-02-10', transitDays: 8, state: 'Gujarat',
    remarks: '65 MW organic Rankine cycle recovering heat from FCC unit and reformer flue gas at Reliance Jamnagar refinery, generating 520 GWh annually' },
  { id: 'WHR-003', projectId: 'WHR-003', city: 'Bhilai', operator: 'SAIL Energy Systems', sourceIndustry: 'Steel Rolling',
    recoveryMW: 55, investmentCr: 410, savingsCr: 195, status: 'Delivered', priority: 'High', origin: 'Bhilai Steel Plant', destination: 'Raipur Industrial', shipDate: '2024-03-05', transitDays: 12, state: 'Chhattisgarh',
    remarks: 'Bhilai Steel Plant WHR on sintering plant and blast furnace gas, 55 MW ORC-based recovery reducing specific energy consumption by 18%' },
  { id: 'WHR-004', projectId: 'WHR-004', city: 'Bengaluru', operator: 'JSW Steel Power', sourceIndustry: 'Steel Making',
    recoveryMW: 48, investmentCr: 365, savingsCr: 172, status: 'Delivered', priority: 'High', origin: 'JSW Vijayanagar', destination: 'Toranagallu Works', shipDate: '2024-01-25', transitDays: 7, state: 'Karnataka',
    remarks: 'JSW Vijayanagar WHR from electric arc furnace and ladle furnace exhaust, 48 MW steam turbine generating power for Karnataka grid' },
  { id: 'WHR-005', projectId: 'WHR-005', city: 'Vizag', operator: 'Vizag Steel Recovery', sourceIndustry: 'Steel Smelting',
    recoveryMW: 42, investmentCr: 310, savingsCr: 148, status: 'In Transit', priority: 'High', origin: 'RINL Vizag Plant', destination: 'Visakhapatnam Port', shipDate: '2024-05-15', transitDays: 14, state: 'Andhra Pradesh',
    remarks: 'RINL Vizag recovering waste heat from blast furnace top gas and sinter cooler, 42 MW capacity with potential expansion to 60 MW by 2026' },
  { id: 'WHR-006', projectId: 'WHR-006', city: 'Rourkela', operator: 'SAIL Rourkela Energy', sourceIndustry: 'Steel Rolling',
    recoveryMW: 38, investmentCr: 275, savingsCr: 130, status: 'Delivered', priority: 'Medium', origin: 'Rourkela Steel Plant', destination: 'Rajgangpur Industrial', shipDate: '2024-02-20', transitDays: 11, state: 'Odisha',
    remarks: 'Rourkela WHR on reheating furnace and coke oven gas, 38 MW steam Rankine cycle with heat storage for peak shaving during power demand spikes' },
  { id: 'WHR-007', projectId: 'WHR-007', city: 'Nagpur', operator: 'Adani Cement Power', sourceIndustry: 'Cement Clinkering',
    recoveryMW: 35, investmentCr: 250, savingsCr: 118, status: 'Delivered', priority: 'Medium', origin: 'Ambuja Cement Works', destination: 'Nagpur Industrial', shipDate: '2024-03-18', transitDays: 9, state: 'Maharashtra',
    remarks: 'Preheater and clinker cooler WHR at Ambuja Nagpur, 35 MW generating power for captive use and surplus fed to Maharashtra state grid' },
  { id: 'WHR-008', projectId: 'WHR-008', city: 'Durgapur', operator: 'Durgapur Steel WHR', sourceIndustry: 'Steel Smelting',
    recoveryMW: 28, investmentCr: 205, savingsCr: 97, status: 'In Transit', priority: 'Medium', origin: 'Durgapur Steel Plant', destination: 'Asansol Industrial', shipDate: '2024-06-01', transitDays: 13, state: 'West Bengal',
    remarks: 'Durgapur Steel recovering heat from sinter plant exhaust and blast furnace gas, 28 MW steam turbine with waste heat boiler and economizer' },
  { id: 'WHR-009', projectId: 'WHR-009', city: 'Jodhpur', operator: 'JK Cement Green', sourceIndustry: 'Cement Kiln',
    recoveryMW: 22, investmentCr: 165, savingsCr: 78, status: 'Delivered', priority: 'Medium', origin: 'JK Lakshmi Cement', destination: 'Jodhpur Industrial', shipDate: '2024-04-10', transitDays: 15, state: 'Rajasthan',
    remarks: 'Cement kiln WHR at Jodhpur, 22 MW from preheater exit and clinker cooler, reducing specific power consumption by 28 kWh/tonne clinker' },
  { id: 'WHR-010', projectId: 'WHR-010', city: 'Salem', operator: 'SAIL Salem WHR', sourceIndustry: 'Steel Making',
    recoveryMW: 18, investmentCr: 135, savingsCr: 64, status: 'Delivered', priority: 'Low', origin: 'SAIL Salem Plant', destination: 'Salem Industrial', shipDate: '2024-03-28', transitDays: 10, state: 'Tamil Nadu',
    remarks: 'Salem Steel Plant WHR on electric furnace off-gas, 18 MW organic Rankine cycle providing 60% of plant electricity demand from recovered waste heat' },
  { id: 'WHR-011', projectId: 'WHR-011', city: 'Kota', operator: 'Kota Thermal Recovery', sourceIndustry: 'Power Generation',
    recoveryMW: 32, investmentCr: 230, savingsCr: 108, status: 'In Transit', priority: 'High', origin: 'Kota Thermal Plant', destination: 'Kota Industrial Zone', shipDate: '2024-05-20', transitDays: 12, state: 'Rajasthan',
    remarks: 'Flue gas WHR from 660 MW supercritical unit at Kota, 32 MW ORC bottoming cycle using organic working fluid at 150-300&#176;C range' },
  { id: 'WHR-012', projectId: 'WHR-012', city: 'Singrauli', operator: 'NTPC Waste Heat Corp', sourceIndustry: 'Power Generation',
    recoveryMW: 45, investmentCr: 340, savingsCr: 160, status: 'Processing', priority: 'High', origin: 'NTPC Singrauli', destination: 'Rihand Industrial', shipDate: '2024-07-05', transitDays: 16, state: 'UP',
    remarks: 'Large-scale WHR from 2x500 MW coal units at Singrauli, 45 MW ORC recovering heat from boiler exhaust and condenser cooling water' },
  { id: 'WHR-013', projectId: 'WHR-013', city: 'Mangalore', operator: 'MRPL Heat Recovery', sourceIndustry: 'Oil Refining',
    recoveryMW: 30, investmentCr: 220, savingsCr: 104, status: 'Delivered', priority: 'Medium', origin: 'MRPL Refinery', destination: 'Mangalore SEZ', shipDate: '2024-02-28', transitDays: 8, state: 'Karnataka',
    remarks: 'Mangalore Refinery WHR on crude distillation unit and hydrocracker reactor, 30 MW steam turbine with 85% availability over 12 months' },
  { id: 'WHR-014', projectId: 'WHR-014', city: 'Burnpur', operator: 'IISCO Steel WHR', sourceIndustry: 'Steel Smelting',
    recoveryMW: 20, investmentCr: 150, savingsCr: 71, status: 'Delayed', priority: 'Low', origin: 'IISCO Burnpur Plant', destination: 'Asansol Railway Works', shipDate: '2024-06-15', transitDays: 18, state: 'West Bengal',
    remarks: 'Delayed due to plant modernization scope expansion, WHR on modernized blast furnace at IISCO Burnpur, designed for 20 MW with future upgrade path to 30 MW' },
]

export default function WasteHeatRecoveryView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof WHRRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'sourceIndustry', label: 'Industry', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.sourceIndustry] = (m[r.sourceIndustry] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Recovery Capacity', value: `${filtered.reduce((a: number, r) => a + r.recoveryMW, 0).toLocaleString()} MW` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Annual Savings', value: `&#8377;${filtered.reduce((a: number, r) => a + r.savingsCr, 0).toLocaleString()} Cr` },
    { label: 'Payback Ratio', value: `${(filtered.reduce((a: number, r) => a + r.investmentCr, 0) / Math.max(1, filtered.reduce((a: number, r) => a + r.savingsCr, 0))).toFixed(1)} yrs` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: WHRRecord) => string, val: (r: WHRRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.recoveryMW)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const indBar = grp(r => r.sourceIndustry, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const roiData = filtered.map(r => ({ name: r.city.slice(0, 12), value: +(r.savingsCr / r.investmentCr * 100).toFixed(0) }))
    const lm = filtered.reduce((a: Record<string, { recoveryMW: number; savingsCr: number }>, r) => {
      if (!a[r.state]) a[r.state] = { recoveryMW: 0, savingsCr: 0 }
      a[r.state].recoveryMW += r.recoveryMW; a[r.state].savingsCr += r.savingsCr; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, recoveryMW: v.recoveryMW, savingsCr: v.savingsCr }))
    return { barState, pieState, statusPie, indBar, priorityPie, totalInvest, roiData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="whr-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Waste Heat Recovery' }]} />
      <PageHeader title="Waste Heat Recovery Logistics" description="Track industrial waste heat recovery installations, energy savings, and investment returns across Indian industrial zones" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="whr-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`whr-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-red-700 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="whr-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="whr-kpi-card"><CardContent className="p-4"><p className="whr-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="whr-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="whr-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="whr-chart-title text-sm">Recovery Capacity (MW) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#dc2626" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="whr-chart-title text-sm">Projects by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="whr-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="whr-chart-title text-sm">ROI by Facility (%)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.roiData}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="whr-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="whr-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`whr-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-red-700'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.sourceIndustry} | {r.state}</p>
              <p className="text-xs mt-1">{r.recoveryMW} MW | &#8377;{r.investmentCr} Cr invest | &#8377;{r.savingsCr} Cr/yr savings | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="whr-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="whr-chart-title text-sm">Recovery MW vs Annual Savings</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="recoveryMW" stroke="#dc2626" name="Recovery MW" /><Line yAxisId="right" type="monotone" dataKey="savingsCr" stroke="#f59e0b" name="Savings &#8377;Cr" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="whr-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#f87171" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="whr-chart-title text-sm">Industry Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.indBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#fca5a5" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="whr-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="whr-insights grid grid-cols-2 gap-4">
        <Card className="whr-insight-card border-l-4 border-l-red-700"><CardContent className="p-5">
          <h4 className="whr-insight-title font-semibold text-base">India&apos;s 70 GW Untapped Waste Heat Potential</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Indian industry generates over 70 GW of recoverable waste heat, primarily from steel, cement, and petrochemical sectors. Currently only 5-7% is captured, representing a massive opportunity for energy efficiency improvement and carbon reduction.</p>
        </CardContent></Card>
        <Card className="whr-insight-card border-l-4 border-l-red-700"><CardContent className="p-5">
          <h4 className="whr-insight-title font-semibold text-base">ORC vs Steam Rankine Technology</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Organic Rankine Cycle (ORC) systems excel at low-to-medium temperatures (150-400&#176;C), making them ideal for cement and refinery waste heat. Steam Rankine dominates high-temperature steel applications above 400&#176;C with higher thermal efficiency of 25-32%.</p>
        </CardContent></Card>
        <Card className="whr-insight-card border-l-4 border-l-red-700"><CardContent className="p-5">
          <h4 className="whr-insight-title font-semibold text-base">PAT Scheme Driving WHR Adoption</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Bureau of Energy Efficiency&apos;s Perform Achieve Trade (PAT) scheme mandates energy intensity reduction for large industries. WHR is the most cost-effective compliance pathway, with average payback of 2-3 years versus 5-7 years for other efficiency measures.</p>
        </CardContent></Card>
        <Card className="whr-insight-card border-l-4 border-l-red-700"><CardContent className="p-5">
          <h4 className="whr-insight-title font-semibold text-base">Carbon Abatement via Waste Heat</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Each MW of waste heat recovery avoids approximately 6,500 tonnes of CO2 annually by displacing coal-based power generation. India&apos;s existing 500+ MW WHR capacity already prevents 3.25 MT CO2 per year, with potential to reach 25 MT CO2 abatement at full deployment.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
