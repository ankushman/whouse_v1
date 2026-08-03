'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface BGLRecord {
  id: string; projectId: string; city: string; operator: string; feedstock: string
  capacityTPD: number; investmentCr: number; syngasMW: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#9a3412', '#b45309', '#ca8a04', '#d97706', '#f59e0b', '#fbbf24', '#fde68a', '#fef3c7']

const records: BGLRecord[] = [
  { id: 'BGL-001', projectId: 'BGL-001', city: 'Rajkot', operator: 'Gujarat Bio Energy Corp', feedstock: 'Rice Husk',
    capacityTPD: 800, investmentCr: 640, syngasMW: 12, status: 'Delivered', priority: 'High', origin: 'Rajkot Bio Park', destination: 'Morbi Industrial', shipDate: '2024-01-15', transitDays: 8, state: 'Gujarat',
    remarks: 'Rice husk gasification plant generating 12 MW syngas power, supplying 60% of Rajkot&apos;s rice mill cluster energy demand with carbon-negative process' },
  { id: 'BGL-002', projectId: 'BGL-002', city: 'Coimbatore', operator: 'TN Biomass Power Ltd', feedstock: 'Coir Pith',
    capacityTPD: 600, investmentCr: 480, syngasMW: 9, status: 'Delivered', priority: 'High', origin: 'Pollachi Bio Plant', destination: 'Coimbatore Textile', shipDate: '2024-02-10', transitDays: 10, state: 'Tamil Nadu',
    remarks: 'Coir pith gasification converting coconut industry waste into 9 MW power and biochar for Tirupur-Coimbatore textile dyeing units' },
  { id: 'BGL-003', projectId: 'BGL-003', city: 'Lucknow', operator: 'UP BioGas Solutions', feedstock: 'Sugarcane Bagasse',
    capacityTPD: 950, investmentCr: 720, syngasMW: 14, status: 'Delivered', priority: 'Critical', origin: 'Lakhimpur Kheri', destination: 'Lucknow Industrial', shipDate: '2024-01-28', transitDays: 12, state: 'Uttar Pradesh',
    remarks: 'Bagasse gasification at India&apos;s largest sugarcane belt, 14 MW syngas replacing coal in UP sugar mills and exporting surplus to state grid' },
  { id: 'BGL-004', projectId: 'BGL-004', city: 'Indore', operator: 'MP Green Fuels', feedstock: 'Municipal Solid Waste',
    capacityTPD: 500, investmentCr: 520, syngasMW: 8, status: 'Delivered', priority: 'High', origin: 'Indore Segregation', destination: 'Pithampur Industrial', shipDate: '2024-03-05', transitDays: 9, state: 'MP',
    remarks: 'RDF gasification from Indore&apos;s segregated municipal waste, 8 MW syngas power with plasma-assisted cleanup meeting CPCB emission norms' },
  { id: 'BGL-005', projectId: 'BGL-005', city: 'Nanded', operator: 'Maharashtra Biomass Energy', feedstock: 'Cotton Stalk',
    capacityTPD: 450, investmentCr: 380, syngasMW: 7, status: 'In Transit', priority: 'Medium', origin: 'Nanded Ginning', destination: 'Aurangabad Industrial', shipDate: '2024-05-15', transitDays: 14, state: 'Maharashtra',
    remarks: 'Cotton stalk gasification in Vidarbha region, 7 MW power and biochar byproduct sold as soil amendment to local cotton farmers' },
  { id: 'BGL-006', projectId: 'BGL-006', city: 'Bhubaneswar', operator: 'Odisha Bio Power', feedstock: 'Casuarina Wood Chips',
    capacityTPD: 700, investmentCr: 560, syngasMW: 11, status: 'Delivered', priority: 'High', origin: 'Ganjam Plantation', destination: 'Paradip Industrial', shipDate: '2024-02-20', transitDays: 15, state: 'Odisha',
    remarks: 'Dedicated energy plantation gasification with 11 MW output, casuarina grown on degraded forest land providing 4,000+ farmer livelihoods' },
  { id: 'BGL-007', projectId: 'BGL-007', city: 'Mysuru', operator: 'Karnataka BioSyngas', feedstock: 'Coffee Husk',
    capacityTPD: 400, investmentCr: 340, syngasMW: 6, status: 'Delivered', priority: 'Medium', origin: 'Chikkamagaluru', destination: 'Mysuru Industrial', shipDate: '2024-03-18', transitDays: 11, state: 'Karnataka',
    remarks: 'Coffee husk gasification in Coorg coffee belt, 6 MW power displacing furnace oil in coffee drying process, reducing processing cost by 40%' },
  { id: 'BGL-008', projectId: 'BGL-008', city: 'Bathinda', operator: 'Punjab AgriWaste Power', feedstock: 'Paddy Straw',
    capacityTPD: 1100, investmentCr: 850, syngasMW: 16, status: 'In Transit', priority: 'Critical', origin: 'Moga Collection', destination: 'Bathinda Industrial', shipDate: '2024-06-01', transitDays: 10, state: 'Punjab',
    remarks: 'Large-scale paddy straw gasification addressing Punjab stubble burning crisis, 16 MW syngas from 1,100 TPD saving &#8377;85 Cr in crop loss annually' },
  { id: 'BGL-009', projectId: 'BGL-009', city: 'Jaipur', operator: 'Rajasthan BioEnergy', feedstock: 'Mustard Stalk',
    capacityTPD: 350, investmentCr: 290, syngasMW: 5, status: 'Delivered', priority: 'Medium', origin: 'Alwar Bio Plant', destination: 'Neemrana Industrial', shipDate: '2024-04-10', transitDays: 8, state: 'Rajasthan',
    remarks: 'Mustard stalk gasification in Rajasthan&apos;s oilseed belt, 5 MW power plus 120 TPD biochar fertilizer enhancing desert soil moisture retention by 30%' },
  { id: 'BGL-010', projectId: 'BGL-010', city: 'Guwahati', operator: 'NE BioGas Corporation', feedstock: 'Bamboo Chips',
    capacityTPD: 550, investmentCr: 450, syngasMW: 8, status: 'Delivered', priority: 'Medium', origin: 'Barpeta Bamboo', destination: 'Guwahati Industrial', shipDate: '2024-03-28', transitDays: 16, state: 'Assam',
    remarks: 'Bamboo gasification in Northeast India, 8 MW syngas from sustainably harvested bamboo, supporting Assam&apos;s bamboo economy with 2,000+ grower contracts' },
  { id: 'BGL-011', projectId: 'BGL-011', city: 'Anantapur', operator: 'AP Solar Bio Fuels', feedstock: 'Groundnut Shell',
    capacityTPD: 480, investmentCr: 390, syngasMW: 7, status: 'Processing', priority: 'Medium', origin: 'Kadiri Processing', destination: 'Anantapur Industrial', shipDate: '2024-07-10', transitDays: 13, state: 'Andhra Pradesh',
    remarks: 'Groundnut shell gasification in Rayalaseema region, 7 MW power and biochar byproduct improving groundnut yields by 15% in subsequent planting cycles' },
  { id: 'BGL-012', projectId: 'BGL-012', city: 'Raipur', operator: 'Chhattisgarh Forest Waste', feedstock: 'Mahua Seedcake',
    capacityTPD: 300, investmentCr: 260, syngasMW: 5, status: 'In Transit', priority: 'Low', origin: 'Bilaspur Forest', destination: 'Raipur Industrial', shipDate: '2024-05-28', transitDays: 14, state: 'Chhattisgarh',
    remarks: 'Mahua seedcake gasification after oil extraction, 5 MW syngas providing circular economy model for tribal forest product gatherers in Chhattisgarh' },
  { id: 'BGL-013', projectId: 'BGL-013', city: 'Kochi', operator: 'Kerala Biomass Tech', feedstock: 'Coconut Shell',
    capacityTPD: 250, investmentCr: 220, syngasMW: 4, status: 'Delivered', priority: 'Low', origin: 'Thrissur Processing', destination: 'Kochi Industrial', shipDate: '2024-04-05', transitDays: 10, state: 'Kerala',
    remarks: 'Coconut shell gasification in Kerala&apos;s coconut belt, 4 MW syngas and activated carbon co-production from shell char providing premium export product' },
  { id: 'BGL-014', projectId: 'BGL-014', city: 'Ranchi', operator: 'Jharkhand Mine Reclamation', feedstock: 'Coal Mine Overburden',
    capacityTPD: 900, investmentCr: 780, syngasMW: 13, status: 'Delayed', priority: 'High', origin: 'Dhanbad Mine Site', destination: 'Ranchi Industrial', shipDate: '2024-06-15', transitDays: 18, state: 'Jharkhand',
    remarks: 'Underground coal gasification at exhausted Dhanbad coal mines, 13 MW syngas with carbon capture pilot, converting 900 TPD of deep coal seams in-situ' },
]

export default function BiomassGasificationLogisticsView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof BGLRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'feedstock', label: 'Feedstock', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.feedstock] = (m[r.feedstock] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Gasification Capacity', value: `${filtered.reduce((a: number, r) => a + r.capacityTPD, 0).toLocaleString()} TPD` },
    { label: 'Total Syngas Output', value: `${filtered.reduce((a: number, r) => a + r.syngasMW, 0).toLocaleString()} MW` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Avg Investment/MW', value: `&#8377;${(filtered.reduce((a: number, r) => a + r.investmentCr, 0) / Math.max(1, filtered.reduce((a: number, r) => a + r.syngasMW, 0))).toFixed(1)} Cr/MW` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: BGLRecord) => string, val: (r: BGLRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.capacityTPD)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const feedBar = grp(r => r.feedstock, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const effData = filtered.map(r => ({ name: r.city.slice(0, 12), value: +(r.syngasMW / r.capacityTPD * 100).toFixed(1) }))
    const lm = filtered.reduce((a: Record<string, { capacityTPD: number; syngasMW: number }>, r) => {
      if (!a[r.state]) a[r.state] = { capacityTPD: 0, syngasMW: 0 }
      a[r.state].capacityTPD += r.capacityTPD; a[r.state].syngasMW += r.syngasMW; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, capacityTPD: v.capacityTPD, syngasMW: v.syngasMW }))
    return { barState, pieState, statusPie, feedBar, priorityPie, totalInvest, effData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="bgl-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Biomass Gasification' }]} />
      <PageHeader title="Biomass Gasification Logistics" description="Track biomass gasification plants, syngas production, feedstock supply chains, and agricultural waste-to-energy operations across India" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="bgl-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`bgl-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-amber-800 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="bgl-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="bgl-kpi-card"><CardContent className="p-4"><p className="bgl-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="bgl-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="bgl-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="bgl-chart-title text-sm">Gasification Capacity (TPD) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#9a3412" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="bgl-chart-title text-sm">Plants by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="bgl-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="bgl-chart-title text-sm">Syngas Efficiency (MW per TPD)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.effData}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#b45309" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="bgl-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="bgl-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`bgl-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-amber-800'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.feedstock} | {r.state}</p>
              <p className="text-xs mt-1">{r.capacityTPD} TPD | {r.syngasMW} MW syngas | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="bgl-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="bgl-chart-title text-sm">Capacity TPD vs Syngas MW</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="capacityTPD" stroke="#9a3412" name="Capacity TPD" /><Line yAxisId="right" type="monotone" dataKey="syngasMW" stroke="#16a34a" name="Syngas MW" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="bgl-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#ca8a04" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="bgl-chart-title text-sm">Feedstock Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.feedBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#d97706" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="bgl-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="bgl-insights grid grid-cols-2 gap-4">
        <Card className="bgl-insight-card border-l-4 border-l-amber-800"><CardContent className="p-5">
          <h4 className="bgl-insight-title font-semibold text-base">India&apos;s 25 GW Biomass Gasification Potential</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India generates 750 MT of biomass waste annually. MNRE estimates 25 GW of gasification potential from agricultural residues alone. Current installed capacity is only 2.5 GW, representing massive untapped opportunity for rural energy independence.</p>
        </CardContent></Card>
        <Card className="bgl-insight-card border-l-4 border-l-amber-800"><CardContent className="p-5">
          <h4 className="bgl-insight-title font-semibold text-base">Stubble Burning Crisis Solution</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Punjab and Haryana burn 30 MT of paddy straw annually causing severe NCR pollution. Biomass gasification can process 1,100 TPD per plant, converting stubble into 16 MW syngas while eliminating 95% of open burning emissions across affected districts.</p>
        </CardContent></Card>
        <Card className="bgl-insight-card border-l-4 border-l-amber-800"><CardContent className="p-5">
          <h4 className="bgl-insight-title font-semibold text-base">Biochar: Carbon-Negative Byproduct</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Biomass gasification produces 20-30% biochar by weight, a stable carbon form that sequesters carbon for 500+ years. India&apos;s gasification plants could produce 15 MT of biochar annually, sequestering 25 MT CO2 equivalent while improving soil fertility.</p>
        </CardContent></Card>
        <Card className="bgl-insight-card border-l-4 border-l-amber-800"><CardContent className="p-5">
          <h4 className="bgl-insight-title font-semibold text-base">Downdraft vs Fluidized Bed Gasifiers</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Downdraft gasifiers dominate small-scale (1-5 MW) with 75% efficiency on dry biomass. Fluidized bed systems handle 5-20 MW with higher moisture tolerance. India&apos;s diverse feedstock mix requires both types: downdraft for woody biomass, fluidized bed for wet agricultural residues.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
