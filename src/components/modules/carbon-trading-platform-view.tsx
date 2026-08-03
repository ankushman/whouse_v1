'use client'
import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
} from 'recharts'

const COLOR = '#ca8a04'
const PIE_COLORS = ['#ca8a04', '#0d9488', '#0891b2', '#2563eb', '#7c3aed', '#c026d3', '#e11d48', '#f59e0b']

interface CTPRecord {
  id: string; projectId: string; state: string; entity: string; exchange: string; market: string
  creditsIssued: number; pricePerCredit: number; investmentCr: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; zone: string; remarks: string
}

const records: CTPRecord[] = [
  { id: 'ctp-001', projectId: 'PRJ-5101', state: 'Maharashtra', entity: 'Tata Power', exchange: 'Indian Carbon Exchange (ICX)',
    market: 'Compliance (PAT Scheme)', creditsIssued: 45.2, pricePerCredit: 850, investmentCr: 1200,
    status: 'Active', priority: 'High', origin: 'Mumbai HQ', destination: 'Delhi Registry', shipDate: '2024-01-15', transitDays: 2, zone: 'West', remarks: 'Large-scale PAT Scheme compliance trading hub' },
  { id: 'ctp-002', projectId: 'PRJ-5102', state: 'Gujarat', entity: 'Adani Green Energy', exchange: 'Power Exchange India (PXIL)',
    market: 'Voluntary (VCS)', creditsIssued: 32.8, pricePerCredit: 920, investmentCr: 890,
    status: 'Active', priority: 'High', origin: 'Ahmedabad Office', destination: 'Mumbai Exchange', shipDate: '2024-02-20', transitDays: 1, zone: 'West', remarks: 'VCS-verified renewable energy credits' },
  { id: 'ctp-003', projectId: 'PRJ-5103', state: 'Delhi', entity: 'NTPC Limited', exchange: 'National Commodity and Derivatives Exchange (NCDEX)',
    market: 'Offset (CDM)', creditsIssued: 28.5, pricePerCredit: 780, investmentCr: 750,
    status: 'Delayed', priority: 'Critical', origin: 'New Delhi HQ', destination: 'Mumbai Exchange', shipDate: '2024-04-10', transitDays: 2, zone: 'North', remarks: 'CDM transition to domestic market pending regulatory approval' },
  { id: 'ctp-004', projectId: 'PRJ-5104', state: 'Maharashtra', entity: 'Reliance Industries', exchange: 'Multi Commodity Exchange (MCX)',
    market: 'Domestic (Indian Carbon Market)', creditsIssued: 52.1, pricePerCredit: 720, investmentCr: 1450,
    status: 'Active', priority: 'High', origin: 'Mumbai HQ', destination: 'Delhi Registry', shipDate: '2024-03-05', transitDays: 2, zone: 'West', remarks: 'Largest domestic carbon credit issuer on MCX' },
  { id: 'ctp-005', projectId: 'PRJ-5105', state: 'Karnataka', entity: 'Wipro', exchange: 'Green Credit Exchange (GCX)',
    market: 'Nature-Based (Forestry)', creditsIssued: 18.6, pricePerCredit: 1250, investmentCr: 580,
    status: 'In Progress', priority: 'Medium', origin: 'Bengaluru Campus', destination: 'Chennai Registry', shipDate: '2024-06-18', transitDays: 1, zone: 'South', remarks: 'Afforestation-based green credits from Karnataka reserves' },
  { id: 'ctp-006', projectId: 'PRJ-5106', state: 'Karnataka', entity: 'JSW Steel', exchange: 'Climate Business Exchange (CBX)',
    market: 'International (EU CBAM)', creditsIssued: 38.4, pricePerCredit: 1680, investmentCr: 2100,
    status: 'Active', priority: 'High', origin: 'Vijaynagar Works', destination: 'Rotterdam Registry', shipDate: '2024-01-28', transitDays: 5, zone: 'South', remarks: 'EU CBAM-compliant steel sector carbon credits' },
  { id: 'ctp-007', projectId: 'PRJ-5107', state: 'Maharashtra', entity: 'Mahindra & Mahindra', exchange: 'Indian Carbon Exchange (ICX)',
    market: 'Compliance (PAT Scheme)', creditsIssued: 22.3, pricePerCredit: 890, investmentCr: 620,
    status: 'Active', priority: 'Medium', origin: 'Pune Office', destination: 'Delhi Registry', shipDate: '2024-05-12', transitDays: 2, zone: 'West', remarks: 'Automotive sector PAT cycle-7 compliance credits' },
  { id: 'ctp-008', projectId: 'PRJ-5108', state: 'Rajasthan', entity: 'UltraTech Cement', exchange: 'Power Exchange India (PXIL)',
    market: 'Hybrid (Compliance+Voluntary)', creditsIssued: 15.7, pricePerCredit: 1050, investmentCr: 440,
    status: 'Delayed', priority: 'Medium', origin: 'Jaipur Plant', destination: 'Mumbai Exchange', shipDate: '2024-07-20', transitDays: 2, zone: 'North', remarks: 'Hybrid credit verification delayed due to audit backlog' },
  { id: 'ctp-009', projectId: 'PRJ-5109', state: 'West Bengal', entity: 'ITC Limited', exchange: 'National Commodity and Derivatives Exchange (NCDEX)',
    market: 'Blue Carbon (Mangrove)', creditsIssued: 12.4, pricePerCredit: 1420, investmentCr: 380,
    status: 'In Progress', priority: 'Medium', origin: 'Kolkata HQ', destination: 'Chennai Registry', shipDate: '2024-08-05', transitDays: 2, zone: 'East', remarks: 'Sundarbans mangrove blue carbon credit pilot project' },
  { id: 'ctp-010', projectId: 'PRJ-5110', state: 'Telangana', entity: 'Dalmia Cement', exchange: 'Multi Commodity Exchange (MCX)',
    market: 'Voluntary (VCS)', creditsIssued: 26.9, pricePerCredit: 960, investmentCr: 720,
    status: 'Active', priority: 'Medium', origin: 'Hyderabad Plant', destination: 'Mumbai Exchange', shipDate: '2024-04-25', transitDays: 2, zone: 'South', remarks: 'VCS-certified cement sector emission reduction credits' },
  { id: 'ctp-011', projectId: 'PRJ-5111', state: 'Odisha', entity: 'Hindalco Industries', exchange: 'Green Credit Exchange (GCX)',
    market: 'Nature-Based (Forestry)', creditsIssued: 20.1, pricePerCredit: 1180, investmentCr: 560,
    status: 'Planned', priority: 'Low', origin: 'Bhubaneswar Office', destination: 'Kolkata Registry', shipDate: '2025-01-10', transitDays: 2, zone: 'East', remarks: 'Forestry credits from Odisha tribal land restoration' },
  { id: 'ctp-012', projectId: 'PRJ-5112', state: 'Gujarat', entity: 'Vedanta Limited', exchange: 'Climate Business Exchange (CBX)',
    market: 'International (EU CBAM)', creditsIssued: 35.6, pricePerCredit: 1540, investmentCr: 1850,
    status: 'Active', priority: 'High', origin: 'Ahmedabad HQ', destination: 'London Registry', shipDate: '2024-02-14', transitDays: 6, zone: 'West', remarks: 'Aluminium sector EU CBAM cross-border carbon credits' },
  { id: 'ctp-013', projectId: 'PRJ-5113', state: 'Jharkhand', entity: 'Tata Steel', exchange: 'Indian Carbon Exchange (ICX)',
    market: 'Compliance (PAT Scheme)', creditsIssued: 19.8, pricePerCredit: 830, investmentCr: 540,
    status: 'In Progress', priority: 'Medium', origin: 'Jamshedpur Works', destination: 'Delhi Registry', shipDate: '2024-09-01', transitDays: 3, zone: 'East', remarks: 'Steel sector PAT compliance credits from Jamshedpur' },
  { id: 'ctp-014', projectId: 'PRJ-5114', state: 'Kerala', entity: 'Godrej Industries', exchange: 'Power Exchange India (PXIL)',
    market: 'Offset (CDM)', creditsIssued: 14.2, pricePerCredit: 760, investmentCr: 390,
    status: 'Planned', priority: 'Low', origin: 'Kochi Plant', destination: 'Chennai Registry', shipDate: '2025-03-20', transitDays: 2, zone: 'South', remarks: 'CDM-registered offset credits from agroforestry projects' },
]

const filterGroups = [
  { key: 'status', label: 'Status', options: [
    { value: 'Active', count: 7 }, { value: 'Delayed', count: 2 }, { value: 'In Progress', count: 3 }, { value: 'Planned', count: 2 },
  ]},
  { key: 'priority', label: 'Priority', options: [
    { value: 'High', count: 5 }, { value: 'Medium', count: 6 }, { value: 'Low', count: 2 }, { value: 'Critical', count: 1 },
  ]},
  { key: 'market', label: 'Market', options: [
    { value: 'Compliance (PAT Scheme)', count: 3 }, { value: 'Voluntary (VCS)', count: 2 },
    { value: 'Offset (CDM)', count: 2 }, { value: 'Domestic (Indian Carbon Market)', count: 1 },
    { value: 'International (EU CBAM)', count: 2 }, { value: 'Hybrid (Compliance+Voluntary)', count: 1 },
    { value: 'Nature-Based (Forestry)', count: 2 }, { value: 'Blue Carbon (Mangrove)', count: 1 },
  ]},
  { key: 'zone', label: 'Zone', options: [
    { value: 'North', count: 2 }, { value: 'South', count: 4 }, { value: 'East', count: 3 }, { value: 'West', count: 5 },
  ]},
]

export default function CarbonTradingPlatformView() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [searchQuery, setSearchQuery] = useState('')

  const toggleFilter = (group: string, value: string) => setActiveFilters(prev => {
    const cur = prev[group] || []
    const next = cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]
    return next.length ? { ...prev, [group]: next } : Object.fromEntries(Object.entries(prev).filter(([k]) => k !== group))
  })

  const filtered = useMemo(() => records.filter(r => {
    if (searchQuery && !`${r.entity} ${r.exchange} ${r.state}`.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return Object.entries(activeFilters).every(([k, vs]) => !vs.length || vs.includes(r[k as keyof CTPRecord] as string))
  }), [searchQuery, activeFilters])

  const totalCredits = filtered.reduce((a: number, r) => a + r.creditsIssued, 0)
  const avgPrice = filtered.length ? filtered.reduce((a: number, r) => a + r.pricePerCredit, 0) / filtered.length : 0
  const revenue = Math.round(filtered.reduce((a: number, r) => a + r.creditsIssued * r.pricePerCredit, 0) / 100)
  const totalInv = filtered.reduce((a: number, r) => a + r.investmentCr, 0)

  const toArr = (obj: Record<string, number>) => Object.entries(obj).map(([name, value]) => ({ name, value }))
  const stateData = toArr(filtered.reduce((a: Record<string, number>, r) => { a[r.state] = (a[r.state] || 0) + r.creditsIssued; return a }, {}))
  const zoneData = toArr(filtered.reduce((a: Record<string, number>, r) => { a[r.zone] = (a[r.zone] || 0) + 1; return a }, {}))
  const statusData = toArr(filtered.reduce((a: Record<string, number>, r) => { a[r.status] = (a[r.status] || 0) + 1; return a }, {}))
  const lineData = filtered.map(r => ({ name: r.entity.slice(0, 12), credits: r.creditsIssued, price: r.pricePerCredit }))
  const excInv = toArr(filtered.reduce((a: Record<string, number>, r) => { const k = r.exchange.split(' (')[0]; a[k] = (a[k] || 0) + r.investmentCr; return a }, {}))
  const priorityData = toArr(filtered.reduce((a: Record<string, number>, r) => { a[r.priority] = (a[r.priority] || 0) + 1; return a }, {}))
  const marketData = toArr(filtered.reduce((a: Record<string, number>, r) => { const k = r.market.split(' ')[0]; a[k] = (a[k] || 0) + 1; return a }, {}))
  const zoneCredits = toArr(filtered.reduce((a: Record<string, number>, r) => { a[r.zone] = (a[r.zone] || 0) + r.creditsIssued; return a }, {}))

  return (
    <div className="space-y-4">
      <ModuleBreadcrumb items={[{ label: 'Compliance' }, { label: 'Carbon Markets' }, { label: 'Carbon Trading Platform' }]} />
      <PageHeader title="Carbon Trading Platform" description="Monitor carbon credit trading, pricing &amp; compliance across Indian exchanges" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="flex gap-2 border-b pb-2">
        {['dashboard', 'registry', 'analytics', 'insights'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-1.5 text-sm rounded-t font-medium ${activeTab === t ? 'bg-white border border-b-white -mb-[1px] text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Total Credits Issued', value: `${totalCredits.toFixed(1)} Lakh` },
              { label: 'Avg Credit Price', value: `&#8377;${avgPrice.toFixed(0)}` },
              { label: 'Revenue Generated', value: `&#8377;${revenue.toLocaleString()} Cr` },
              { label: 'Total Platform Investment', value: `&#8377;${totalInv.toLocaleString()} Cr` },
            ].map(k => (
              <Card key={k.label}><CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{k.label}</p>
                <p className="text-2xl font-bold" dangerouslySetInnerHTML={{ __html: k.value }} />
              </CardContent></Card>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Credits by State (Lakh)</CardTitle></CardHeader>
              <CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={stateData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip />
                <Bar dataKey="value" fill={COLOR} radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader>
              <CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={zoneData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label fontSize={11}>
                {zoneData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="space-y-4">
          <div className="grid gap-2">{filtered.map(r => (
            <Card key={r.id} className={`border-l-4 ${r.status === 'Delayed' ? 'border-l-red-500 bg-red-50/30' : ''}`} style={r.status !== 'Delayed' ? { borderLeftColor: COLOR } : undefined}>
              <CardContent className="p-3">
                <div className="flex justify-between items-start"><div>
                  <p className="font-medium text-sm">{r.entity} <span className="text-muted-foreground text-xs">- {r.exchange.split(' (')[0]}</span></p>
                  <p className="text-xs text-muted-foreground">{r.state} | {r.market} | {r.creditsIssued}L credits | &#8377;{r.pricePerCredit}/credit | &#8377;{r.investmentCr} Cr</p>
                  <p className="text-xs text-muted-foreground">{r.origin} &#8594; {r.destination} | {r.transitDays}d | {r.zone} | {r.remarks}</p>
                </div>
                <Badge variant={r.status === 'Delayed' ? 'destructive' : 'secondary'} className="text-xs shrink-0 ml-2">{r.status}</Badge></div>
              </CardContent>
            </Card>
          ))}</div>
          <div className="grid grid-cols-2 gap-4">
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Credits by Zone</CardTitle></CardHeader>
              <CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={zoneCredits} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip />
                <Bar dataKey="value" fill={COLOR} radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader>
              <CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label fontSize={11}>
                {statusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-2 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Credits vs Price</CardTitle></CardHeader>
            <CardContent><ResponsiveContainer width="100%" height={250}><LineChart data={lineData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} />
              <Tooltip /><Legend /><Line type="monotone" dataKey="credits" stroke={COLOR} strokeWidth={2} />
              <Line type="monotone" dataKey="price" stroke="#0891b2" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Investment per Exchange (&#8377; Cr)</CardTitle></CardHeader>
            <CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={excInv} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip />
              <Bar dataKey="value" fill="#7c3aed" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Priority Distribution</CardTitle></CardHeader>
            <CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={priorityData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip />
              <Bar dataKey="value" fill="#e11d48" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Market Distribution</CardTitle></CardHeader>
            <CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={marketData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label fontSize={10}>
              {marketData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="grid grid-cols-2 gap-4">
          <Card><CardContent className="p-4">
            <p className="font-semibold text-sm mb-1">Credits Concentration</p>
            <p className="text-xs text-muted-foreground">Maharashtra leads with {stateData.find(d => d.name === 'Maharashtra')?.value?.toFixed(1) || 0} lakh credits across 3 major entities (Tata Power, Reliance, Mahindra), dominating the western trading corridor.</p>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <p className="font-semibold text-sm mb-1">Price Premium Analysis</p>
            <p className="text-xs text-muted-foreground">International (EU CBAM) credits command the highest premium at &#8377;1,540-1,680 per credit, 2x the domestic compliance average of &#8377;830-890, reflecting cross-border regulatory demand.</p>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <p className="font-semibold text-sm mb-1">Market Diversification</p>
            <p className="text-xs text-muted-foreground">Compliance (PAT Scheme) leads with 3 listings, followed by Voluntary (VCS) and International (EU CBAM) with 2 each. Nature-based and blue carbon markets are emerging with strong pricing.</p>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <p className="font-semibold text-sm mb-1">Revenue Potential</p>
            <p className="text-xs text-muted-foreground">Estimated revenue of &#8377;{revenue.toLocaleString()} Cr from current credit issuances. Two delayed projects (NTPC NCDEX, UltraTech PXIL) are holding back an additional &#8377;350 Cr in potential revenue.</p>
          </CardContent></Card>
        </div>
      )}
    </div>
  )
}
