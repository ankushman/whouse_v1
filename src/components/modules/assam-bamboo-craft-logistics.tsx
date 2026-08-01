import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#166534', '#15803d', '#22c55e', '#4ade80', '#bbf7d0', '#14532d', '#052e16', '#dcfce7']
const PRODUCTS = ['Japi Bamboo Hat', 'Assam Bamboo Chair', 'Suali Basket Set', 'Bamboo Fishing Rod', 'Naga Bamboo Hut Model', 'Bamboo Wind Chime', 'Tamul Betel Nut Tray', 'Bamboo Bridge Replica']
const WEAVERS = ['Jorhat Bamboo Craft Guild', 'Guwahati Cane Art Centre', 'Silchar Bamboo Weavers', 'Nagaon Rural Craft Society', 'Tezpur Valley Bamboo Studio', 'Dibrugarh Cane Collective', 'Tinsukia Forest Craft Colony', 'Goalpara Traditional Weavers']
const STATUSES = ['GI Assam Bamboo Mark', 'IS 16906 Bamboo Grade A', 'Rattan-Wrapped Bundle', 'Open Truck Transit', 'Dry Storage 18-30C', 'Bamboo Moisture QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-emerald-200 rounded-full overflow-hidden"><div className="h-full bg-emerald-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#dcfce7" strokeWidth="6" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={COLORS[0]} strokeWidth="6" strokeDasharray={`${c}`} strokeDashoffset={c - (value / 100) * c} strokeLinecap="round" />
      </svg>
      <span className="text-xs font-medium" style={{ color: COLORS[0] }}>{label} {value}%</span>
    </div>
  )
}

const KpiTile = ({ label, value }: { label: string; value: string | number }) => (
  <Card className="p-4"><p className="text-sm text-muted-foreground">{label}</p><p className="text-2xl font-bold mt-1">{value}</p></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="p-4 border-l-4" style={{ borderLeftColor: COLORS[1] }}><p className="text-sm text-muted-foreground">{label}</p><p className="text-lg font-semibold mt-1" style={{ color: COLORS[1] }}>{value}</p></Card>
)

const genRecords = (offset: number) =>
  Array.from({ length: 20 }, (_, i) => ({
    id: `ABM-${String(offset + i + 1).padStart(4, '0')}`,
    weaver: WEAVERS[(offset + i) % WEAVERS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 500, ((offset + i) * 37) % 500) + 1,
    cost: ri(600, 15000, ((offset + i) * 13097) % 14400) + 600,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const bambooRecords = [
  { id: 'ABM-0001', weaver: 'Jorhat Bamboo Craft Guild', ware: 'Japi Bamboo Hat', status: 'GI Assam Bamboo Mark', qty: 120, cost: 2400, date: '2024-01-15' },
  { id: 'ABM-0002', weaver: 'Guwahati Cane Art Centre', ware: 'Assam Bamboo Chair', status: 'IS 16906 Bamboo Grade A', qty: 45, cost: 8900, date: '2024-01-22' },
  { id: 'ABM-0003', weaver: 'Silchar Bamboo Weavers', ware: 'Suali Basket Set', status: 'Rattan-Wrapped Bundle', qty: 200, cost: 1800, date: '2024-02-03' },
  { id: 'ABM-0004', weaver: 'Nagaon Rural Craft Society', ware: 'Bamboo Fishing Rod', status: 'Open Truck Transit', qty: 80, cost: 3200, date: '2024-02-14' },
  { id: 'ABM-0005', weaver: 'Tezpur Valley Bamboo Studio', ware: 'Naga Bamboo Hut Model', status: 'Dry Storage 18-30C', qty: 25, cost: 12500, date: '2024-02-28' },
  { id: 'ABM-0006', weaver: 'Dibrugarh Cane Collective', ware: 'Bamboo Wind Chime', status: 'Bamboo Moisture QC', qty: 350, cost: 600, date: '2024-03-05' },
  { id: 'ABM-0007', weaver: 'Tinsukia Forest Craft Colony', ware: 'Tamul Betel Nut Tray', status: 'GI Assam Bamboo Mark', qty: 150, cost: 1200, date: '2024-03-18' },
  { id: 'ABM-0008', weaver: 'Goalpara Traditional Weavers', ware: 'Bamboo Bridge Replica', status: 'IS 16906 Bamboo Grade A', qty: 15, cost: 15000, date: '2024-03-25' },
  { id: 'ABM-0009', weaver: 'Guwahati Cane Art Centre', ware: 'Japi Bamboo Hat', status: 'Rattan-Wrapped Bundle', qty: 95, cost: 2100, date: '2024-04-02' },
  { id: 'ABM-0010', weaver: 'Silchar Bamboo Weavers', ware: 'Assam Bamboo Chair', status: 'Open Truck Transit', qty: 60, cost: 9200, date: '2024-04-10' },
  { id: 'ABM-0011', weaver: 'Nagaon Rural Craft Society', ware: 'Suali Basket Set', status: 'Dry Storage 18-30C', qty: 180, cost: 1600, date: '2024-04-22' },
  { id: 'ABM-0012', weaver: 'Tezpur Valley Bamboo Studio', ware: 'Bamboo Fishing Rod', status: 'Bamboo Moisture QC', qty: 110, cost: 2800, date: '2024-05-01' },
  { id: 'ABM-0013', weaver: 'Dibrugarh Cane Collective', ware: 'Naga Bamboo Hut Model', status: 'GI Assam Bamboo Mark', qty: 30, cost: 11800, date: '2024-05-15' },
  { id: 'ABM-0014', weaver: 'Tinsukia Forest Craft Colony', ware: 'Bamboo Wind Chime', status: 'IS 16906 Bamboo Grade A', qty: 280, cost: 550, date: '2024-05-28' },
  { id: 'ABM-0015', weaver: 'Goalpara Traditional Weavers', ware: 'Tamul Betel Nut Tray', status: 'Rattan-Wrapped Bundle', qty: 160, cost: 1350, date: '2024-06-05' },
  { id: 'ABM-0016', weaver: 'Jorhat Bamboo Craft Guild', ware: 'Bamboo Bridge Replica', status: 'Open Truck Transit', qty: 18, cost: 14200, date: '2024-06-18' },
  { id: 'ABM-0017', weaver: 'Dibrugarh Cane Collective', ware: 'Japi Bamboo Hat', status: 'Dry Storage 18-30C', qty: 140, cost: 2000, date: '2024-06-25' },
  { id: 'ABM-0018', weaver: 'Tinsukia Forest Craft Colony', ware: 'Assam Bamboo Chair', status: 'Bamboo Moisture QC', qty: 55, cost: 8600, date: '2024-07-03' },
  { id: 'ABM-0019', weaver: 'Goalpara Traditional Weavers', ware: 'Suali Basket Set', status: 'GI Assam Bamboo Mark', qty: 220, cost: 1900, date: '2024-07-12' },
  { id: 'ABM-0020', weaver: 'Jorhat Bamboo Craft Guild', ware: 'Bamboo Fishing Rod', status: 'IS 16906 Bamboo Grade A', qty: 90, cost: 3100, date: '2024-07-20' },
]

export default function AssamBambooCraftLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...bambooRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'weaver', label: 'Weaver', options: WEAVERS.map(w => ({ value: w, label: w, count: allRecords.filter(r => r.weaver === w).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(20, 80, allRecords.length * 0.3 + i * 12) }))
  const weaverChart = WEAVERS.map(w => ({ name: w.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.weaver === w).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="abm-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Assam Bamboo Craft' }]} />
      <PageHeader title="Assam Bamboo Craft Logistics" description="Northeast India bamboo and cane craft supply chain with IS 16906 compliance, rattan-wrapped packaging, moisture-controlled transit through the Siliguri corridor, and GI Assam Bamboo Mark certification for 50,000 artisan families across 27 districts" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-emerald-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Shipments" value={allRecords.length} />
            <KpiTile label="Active Ware" value={PRODUCTS.length} />
            <KpiTile label="Weaver Clusters" value={WEAVERS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={97} />
            <HealthRing label="IS 16906" value={93} />
            <HealthRing label="Rattan" value={88} />
            <HealthRing label="Truck" value={84} />
            <HealthRing label="Storage" value={90} />
            <HealthRing label="Moisture" value={95} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="50,000+" />
            <ValueTile label="Bamboo Forest" value="10,000 km2" />
            <ValueTile label="Export Markets" value="18 Countries" />
            <ValueTile label="Heritage Age" value="200 Years" />
          </div>
        </TabsContent>
        <TabsContent value="shipments" className="space-y-6">
          <SearchFilterToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearSearch={() => setSearchQuery('')}
            activeFilters={activeFilters}
            filterGroups={filterGroups}
            onToggleFilter={(group, val) => setActiveFilters(prev => ({ ...prev, [group]: prev[group]?.includes(val) ? prev[group].filter(v => v !== val) : [...(prev[group] || []), val] }))}
            onClearAllFilters={() => setActiveFilters({})}
            totalItems={allRecords.length}
            filteredCount={filteredRecords.length}
            onRefresh={() => {}}
            placeholder="Search bamboo craft shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-emerald-100">
                <tr>
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Ware</th>
                  <th className="p-3 text-left font-medium">Weaver</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Qty</th>
                  <th className="p-3 text-left font-medium">Cost</th>
                  <th className="p-3 text-left font-medium">Cost Bar</th>
                  <th className="p-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(record => (
                  <tr key={record.id} className="border-t hover:bg-emerald-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.ware} /></td>
                    <td className="p-3">{record.weaver}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['pcs', 'sets', 'pairs', 'units'][parseInt(record.id.slice(4)) % 4]}</td>
                    <td className="p-3 font-mono">₹{record.cost.toLocaleString()}</td>
                    <td className="p-3"><CostBar cost={record.cost} max={maxCost} /></td>
                    <td className="p-3">{record.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Shipment Trend</CardTitle></CardHeader>
              <CardContent>
                <LineChart width={500} height={300} data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="shipments" stroke={COLORS[0]} strokeWidth={2} />
                </LineChart>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Weaver Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={weaverChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]}>
                    {weaverChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader><CardTitle>Status Distribution</CardTitle></CardHeader>
            <CardContent>
              <PieChart width={500} height={300}>
                <Pie data={statusPie} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                  {statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Assam Bamboo Heritage — 200 Years of Northeast Craft Tradition</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Assam bamboo and cane craft represents one of Northeast India's oldest artisanal traditions, dating back over two centuries to the Ahom dynasty era when bamboo craftsmanship was central to daily life across the Brahmaputra Valley. The state's abundant bamboo forests, covering approximately 10,000 square kilometres across 27 districts, provide sustainable raw materials for over 50,000 artisan families who depend on this craft for their livelihood. The famous Japi ceremonial hat, once reserved for Ahom royalty and nobility, remains the most iconic symbol of Assamese bamboo artistry, requiring 72 distinct weaving steps from harvest to finished product using the Bambusa balcooa species native to the region. Modern GI tagging under the Assam Bamboo Mark ensures authenticity and protects against counterfeit mass-produced alternatives flooding the market from Southeast Asian imports, with each certified product carrying a unique QR code linking to the artisan cluster and harvest location. The tradition encompasses over 200 distinct product categories ranging from everyday household items like baskets and furniture to specialized ceremonial objects used during Bihu festivals and religious ceremonies at Satra institutions across Assam.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16906 Bamboo Craft Quality Standards & Compliance Framework</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">The IS 16906 standard for bamboo and cane craft products establishes rigorous quality benchmarks that every Assam bamboo logistics operator must comply with for both domestic and international trade. The framework specifies three distinct moisture content zones: Zone A for indoor decorative items requiring 12-15% moisture, Zone B for structural furniture demanding 14-18% moisture tolerance, and Zone C for outdoor installations permitting up to 22% moisture with mandatory additional weatherproofing treatments including borax-boric acid pressure treatment. Each bamboo shipment must carry a Batch Certificate documenting the harvest location within Assam's 27 districts, the processing date, the treatment method employed, whether smoke-cured, borax-treated, or air-dried, and the final moisture content percentage as verified by NABL-accredited testing laboratories. Non-compliant batches face mandatory quarantine holds averaging 5-7 business days at Guwahati distribution centres, significantly impacting delivery timelines for time-sensitive export orders destined for European and North American markets that require phytosanitary certification under the International Plant Protection Convention alongside the IS 16906 compliance documentation.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Rattan-Wrapped Bamboo Packaging & Siliguri Corridor Transit</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Rattan-wrapped bamboo bundle packaging represents a significant innovation in sustainable logistics for the Assam bamboo corridor connecting craft clusters to national and international markets. Traditional jute wrapping caused persistent fibre shedding and moisture retention problems during the monsoon season, leading to an unacceptable 15% product rejection rate during June-September transit through the critical Siliguri corridor, the only viable land route connecting Northeast India to the rest of the country. The new rattan-wrapped system uses locally sourced Assam rattan cane as structural binding material, providing superior ventilation while maintaining bundle integrity across the challenging 1,400-kilometre journey from Jorhat craft centres to Kolkata port facilities. Each bundle accommodates up to 50 units of finished bamboo craft items, with individual product separation using banana fibre dividers that naturally absorb ambient moisture and prevent surface abrasion during the multi-day journey. This packaging innovation has reduced transit damage rates from 12% to under 3% since its introduction in 2025, while simultaneously decreasing packaging material costs by 22% compared to the previous foam-insert system that was imported from suppliers in Maharashtra and contributed to higher carbon footprint metrics across the supply chain.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Bamboo Authentication & Northeast Artisan Digital Supply Chain</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">The AI bamboo authentication system deployed across Assam's major craft clusters uses computer vision and near-infrared spectroscopy to verify bamboo species authenticity and treatment compliance in real-time during the logistics sorting and grading process. The system maintains a spectral database of 47 bamboo species commonly used in Assamese craft, including Bambusa balcooa, Dendrocalamus hamiltonii, and Bambusa tulda, each possessing unique optical signatures that serve as digital fingerprints for verification. At receiving centres in Guwahati and Jorhat, AI scanners process each incoming shipment within 90 seconds, comparing the bamboo spectral profile against the authenticated database to confirm species identity and detect potential adulteration with cheaper bamboo varieties sometimes sourced from Myanmar and Bangladesh border regions. Since deployment in Q3 2025, the system has identified over 2,400 non-compliant shipments, preventing an estimated 18 crore rupees in counterfeit products from entering the certified supply chain. Full integration with blockchain-based provenance tracking ensures every authenticated product carries a verifiable digital certificate accessible via QR code scanning, connecting consumers directly to the individual artisan workshop and the specific bamboo grove where the raw material was sustainably harvested.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
