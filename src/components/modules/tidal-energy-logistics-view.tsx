'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface TELRecord {
  id: string; projectId: string; site: string; operator: string; turbineType: string
  capacityMW: number; investmentCr: number; tideRange: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#0e7490', '#0891b2', '#06b6d4', '#22d3ee', '#67e8f9', '#a5f3fc', '#cffafe', '#ecfeff']

const records: TELRecord[] = [
  { id: 'TEL-001', projectId: 'TEL-001', site: 'Gulf of Kutch Bhavnagar', operator: 'Adani Tidal Energy', turbineType: 'Bulb Turbine',
    capacityMW: 120, investmentCr: 1200, tideRange: 6.5, status: 'Delivered', priority: 'Critical', origin: 'Bhavnagar Port', destination: 'Kutch Grid', shipDate: '2024-01-10', transitDays: 20, state: 'Gujarat',
    remarks: 'India&apos;s largest tidal barrage at Gulf of Kutch with 40 bulb turbines, 6.5m tidal range generating 120 MW with 42% capacity factor throughout the year' },
  { id: 'TEL-002', projectId: 'TEL-002', site: 'Sundarbans Hooghly Estuary', operator: 'WB Tidal Power Corp', turbineType: 'Straflo Turbine',
    capacityMW: 50, investmentCr: 550, tideRange: 4.2, status: 'Delivered', priority: 'High', origin: 'Haldia Port', destination: 'Kolkata Grid', shipDate: '2024-02-20', transitDays: 25, state: 'West Bengal',
    remarks: 'Eco-sensitive tidal stream installation in Sundarbans mangrove delta, 50 MW straflow turbines with fish-friendly blade design and zero chemical lubricants' },
  { id: 'TEL-003', projectId: 'TEL-003', site: 'Gulf of Khambhat', operator: 'Gujarat Marine Energy', turbineType: 'Rim Turbine',
    capacityMW: 200, investmentCr: 2100, tideRange: 8.5, status: 'In Transit', priority: 'Critical', origin: 'Dahej Port', destination: 'Vadodara Grid', shipDate: '2024-05-15', transitDays: 22, state: 'Gujarat',
    remarks: 'Mega tidal barrage at Gulf of Khambhat with 8.5m tidal range, the highest in India, 200 MW with 160 rim turbines and dedicated 220kV transmission line' },
  { id: 'TEL-004', projectId: 'TEL-004', site: 'Vembanad Lake Kayamkulam', operator: 'Kerala Tidal Systems', turbineType: 'Kaplan Turbine',
    capacityMW: 15, investmentCr: 180, tideRange: 1.8, status: 'Delivered', priority: 'Medium', origin: 'Alappuza Boat Yard', destination: 'Kochi Grid', shipDate: '2024-01-28', transitDays: 15, state: 'Kerala',
    remarks: 'Low-head tidal barrage across Vembanad Lake backwaters, 15 MW Kaplan turbines operating on 1.8m range with minimal impact on lake ecology and houseboat tourism' },
  { id: 'TEL-005', projectId: 'TEL-005', site: 'Kanyakumari Coast', operator: 'TN Tidal Energy Ltd', turbineType: 'Horizontal Axis Tidal',
    capacityMW: 65, investmentCr: 700, tideRange: 5.0, status: 'Delivered', priority: 'High', origin: 'Tuticorin Port', destination: 'Madurai Grid', shipDate: '2024-03-05', transitDays: 18, state: 'Tamil Nadu',
    remarks: 'Tidal stream array off Kanyakumari coast where Indian Ocean and Arabian Sea meet, 65 MW horizontal axis turbines in 5m/s tidal currents with 95% availability' },
  { id: 'TEL-006', projectId: 'TEL-006', site: 'Minicoy Laccadive Sea', operator: 'Lakshadweep Tidal Corp', turbineType: 'Vertical Axis Tidal',
    capacityMW: 12, investmentCr: 150, tideRange: 1.5, status: 'In Transit', priority: 'Medium', origin: 'Kochi Shipyard', destination: 'Minicoy Island', shipDate: '2024-06-01', transitDays: 35, state: 'Lakshadweep',
    remarks: 'Vertical axis tidal turbines around Minicoy atoll, 12 MW replacing 100% diesel power for island communities with predictable tidal currents of 3.5 m/s' },
  { id: 'TEL-007', projectId: 'TEL-007', site: 'Diu Coast Arabian Sea', operator: 'Diu Marine Power', turbineType: 'Oscillating Hydrofoil',
    capacityMW: 20, investmentCr: 220, tideRange: 2.5, status: 'Delivered', priority: 'Medium', origin: 'Diu Jetty', destination: 'Diu Grid', shipDate: '2024-03-18', transitDays: 16, state: 'Diu',
    remarks: 'Oscillating hydrofoil tidal generators along Diu coast, 20 MW with biofouling-resistant titanium alloy hydrofoils designed for tropical Arabian Sea conditions' },
  { id: 'TEL-008', projectId: 'TEL-008', site: 'Mumbai Harbour Thane Creek', operator: 'Maharashtra Tidal Corp', turbineType: 'Bulb Turbine',
    capacityMW: 35, investmentCr: 380, tideRange: 3.8, status: 'Delivered', priority: 'Medium', origin: 'Mumbai Port', destination: 'Navi Mumbai Grid', shipDate: '2024-04-10', transitDays: 12, state: 'Maharashtra',
    remarks: 'Tidal barrage at Thane Creek estuary, 35 MW bulb turbines with automated gate control for flood management during monsoon and power generation during neap tides' },
  { id: 'TEL-009', projectId: 'TEL-009', site: 'Puducherry Coast Bay of Bengal', operator: 'Puducherry Tidal Power', turbineType: 'Horizontal Axis Tidal',
    capacityMW: 18, investmentCr: 200, tideRange: 2.0, status: 'Processing', priority: 'Low', origin: 'Puducherry Port', destination: 'Cuddalore Grid', shipDate: '2024-07-10', transitDays: 20, state: 'Puducherry',
    remarks: 'Tidal stream installation off Puducherry coast, 18 MW horizontal axis turbines with monsoon-season auto-buoy system for equipment protection during cyclone conditions' },
  { id: 'TEL-010', projectId: 'TEL-010', site: 'Ganjam Chilika Lake', operator: 'Odisha Coastal Energy', turbineType: 'Kaplan Turbine',
    capacityMW: 22, investmentCr: 240, tideRange: 2.8, status: 'Delivered', priority: 'Medium', origin: 'Gopalpur Port', destination: 'Berhampur Grid', shipDate: '2024-02-28', transitDays: 18, state: 'Odisha',
    remarks: 'Low-head tidal installation at Chilika Lake mouth, 22 MW Kaplan turbines with fish ladders and bird migration corridors preserving Ramsar wetland ecosystem integrity' },
  { id: 'TEL-011', projectId: 'TEL-011', site: 'Goa Panaji Mandovi Estuary', operator: 'Goa Marine Energy', turbineType: 'Oscillating Hydrofoil',
    capacityMW: 10, investmentCr: 120, tideRange: 1.6, status: 'Delivered', priority: 'Low', origin: 'Mormugao Port', destination: 'Panaji Grid', shipDate: '2024-04-05', transitDays: 14, state: 'Goa',
    remarks: 'Compact oscillating hydrofoil tidal generators in Mandovi estuary, 10 MW with zero noise footprint and aesthetic integration with Goa&apos;s coastal tourism landscape' },
  { id: 'TEL-012', projectId: 'TEL-012', site: 'Andaman Ross Island', operator: 'Andaman Tidal Systems', turbineType: 'Vertical Axis Tidal',
    capacityMW: 8, investmentCr: 100, tideRange: 2.2, status: 'In Transit', priority: 'Low', origin: 'Port Blair', destination: 'Ross Island Grid', shipDate: '2024-05-28', transitDays: 38, state: 'Andaman',
    remarks: 'Vertical axis tidal turbines near Ross Island, 8 MW powering tourism infrastructure and research stations in the Andaman archipelago with underwater noise below marine life thresholds' },
  { id: 'TEL-013', projectId: 'TEL-013', site: 'Malvan Coast Sindhudurg', operator: 'Konkan Tidal Energy', turbineType: 'Horizontal Axis Tidal',
    capacityMW: 25, investmentCr: 280, tideRange: 3.2, status: 'Delivered', priority: 'Medium', origin: 'Malvan Jetty', destination: 'Ratnagiri Grid', shipDate: '2024-03-28', transitDays: 16, state: 'Maharashtra',
    remarks: 'Horizontal axis tidal stream array off Malvan coast in Konkan region, 25 MW leveraging 3.2m tidal range with seabed-mounted tripods and rock-anchored foundations' },
  { id: 'TEL-014', projectId: 'TEL-014', site: 'Vishakapatnam Bay', operator: 'AP Coastal Power', turbineType: 'Straflo Turbine',
    capacityMW: 40, investmentCr: 440, tideRange: 4.5, status: 'Delayed', priority: 'High', origin: 'Vizag Port', destination: 'Vizag Industrial', shipDate: '2024-06-15', transitDays: 22, state: 'Andhra Pradesh',
    remarks: 'Delayed due to naval clearance requirements, 40 MW straflow tidal barrage in Vizag Bay with dual-use technology for power generation and harbor flushing during slack tide periods' },
]

export default function TidalEnergyLogisticsView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof TELRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'turbineType', label: 'Turbine Type', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.turbineType] = (m[r.turbineType] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Tidal Capacity', value: `${filtered.reduce((a: number, r) => a + r.capacityMW, 0).toLocaleString()} MW` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Avg Tide Range', value: `${(filtered.reduce((a: number, r) => a + r.tideRange, 0) / Math.max(1, filtered.length)).toFixed(1)} m` },
    { label: 'Avg Investment/MW', value: `&#8377;${(filtered.reduce((a: number, r) => a + r.investmentCr, 0) / Math.max(1, filtered.reduce((a: number, r) => a + r.capacityMW, 0))).toFixed(1)} Cr/MW` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: TELRecord) => string, val: (r: TELRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.capacityMW)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const turbBar = grp(r => r.turbineType, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const tideData = filtered.map(r => ({ name: r.site.split(' ').slice(0, 2).join(' ').slice(0, 14), value: r.tideRange }))
    const lm = filtered.reduce((a: Record<string, { capacityMW: number; investmentCr: number }>, r) => {
      if (!a[r.state]) a[r.state] = { capacityMW: 0, investmentCr: 0 }
      a[r.state].capacityMW += r.capacityMW; a[r.state].investmentCr += r.investmentCr; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, capacityMW: v.capacityMW, investmentCr: v.investmentCr }))
    return { barState, pieState, statusPie, turbBar, priorityPie, totalInvest, tideData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="tel-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Tidal Energy' }]} />
      <PageHeader title="Tidal Energy Logistics" description="Monitor tidal barrage and tidal stream energy installations, turbine deployments, and coastal power infrastructure across Indian tidal zones" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="tel-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`tel-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-cyan-700 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="tel-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="tel-kpi-card"><CardContent className="p-4"><p className="tel-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="tel-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="tel-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="tel-chart-title text-sm">Capacity (MW) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#0e7490" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="tel-chart-title text-sm">Sites by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="tel-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="tel-chart-title text-sm">Tide Range by Site (m)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.tideData}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#0891b2" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="tel-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="tel-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`tel-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-cyan-700'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.site}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.turbineType} | {r.state}</p>
              <p className="text-xs mt-1">{r.capacityMW} MW | {r.tideRange}m tide | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="tel-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="tel-chart-title text-sm">Capacity MW vs Investment</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="capacityMW" stroke="#0e7490" name="Capacity MW" /><Line yAxisId="right" type="monotone" dataKey="investmentCr" stroke="#f59e0b" name="Investment &#8377;Cr" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="tel-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="tel-chart-title text-sm">Turbine Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.turbBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#22d3ee" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="tel-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="tel-insights grid grid-cols-2 gap-4">
        <Card className="tel-insight-card border-l-4 border-l-cyan-700"><CardContent className="p-5">
          <h4 className="tel-insight-title font-semibold text-base">India&apos;s 12 GW Tidal Energy Potential</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">MNRE estimates 12 GW of tidal energy potential along India&apos;s 7,500 km coastline. Gulf of Khambhat (8.5m range) and Gulf of Kutch (6.5m range) alone offer 7 GW. Tidal energy&apos;s predictability makes it ideal for baseload renewable power.</p>
        </CardContent></Card>
        <Card className="tel-insight-card border-l-4 border-l-cyan-700"><CardContent className="p-5">
          <h4 className="tel-insight-title font-semibold text-base">Bulb vs Straflo Turbine Technologies</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Bulb turbines dominate Indian tidal barrages for their high-flow efficiency and bidirectional capability in estuaries. Straflo turbines excel at low-head sites with variable flow directions. Horizontal axis tidal stream turbines suit open coast deployments at 3+ m/s current speeds.</p>
        </CardContent></Card>
        <Card className="tel-insight-card border-l-4 border-l-cyan-700"><CardContent className="p-5">
          <h4 className="tel-insight-title font-semibold text-base">Ecological Impact Mitigation</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Indian tidal installations near Ramsar wetlands (Chilika, Sundarbans) require fish ladders, marine mammal deflectors, and bioacoustic monitoring. New blade designs reduce fish strike mortality to below 1% while maintaining 92% hydrodynamic efficiency.</p>
        </CardContent></Card>
        <Card className="tel-insight-card border-l-4 border-l-cyan-700"><CardContent className="p-5">
          <h4 className="tel-insight-title font-semibold text-base">Island Diesel Displacement</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s 1,200+ inhabited islands spend &#8377;2,500 Cr annually on diesel imports. Tidal energy at Lakshadweep, Andaman, and Diu can displace 80% of diesel consumption with predictable generation matching island load profiles at &#8377;6-8 per kWh versus &#8377;18 diesel.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
