import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#7c2d12', '#92400e', '#b45309', '#d97706', '#fbbf24', '#78350f', '#451a03', '#fef3c7']
const PRODUCTS = ['Kanchipuram Temple Border Saree', 'Mukkuvam Silk Bridal Saree', 'Chinnalapatti Silk Saree', 'Peacock Motif Kanjivaram', 'Mango Pallu Temple Saree', 'Corridor Temple Border Saree', 'Checkered Magham Pattu Saree', 'Diamond Buttis Kanjivaram Saree']
const WEAVERS = ['Kanchipuram Silk Weavers Guild', 'Wright Street Weaving Centre', 'Natham Silk Art Society', 'Thirumalai Temple Weavers', 'Andarkuppam Silk Colony', 'Perumal Puram Handloom Society', 'Kanchipuram Zari Weaving Centre', 'Eleventh Street Silk Cooperative']
const STATUSES = ['GI Kanchipuram Silk Mark', 'IS 16908 Silk Textile Grade A', 'Muslin Silk Roll Bundle', 'Enclosed Truck Transit', 'Humidity-Free Vault 20-25C', 'Zari Thread Tension QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-amber-200 rounded-full overflow-hidden"><div className="h-full bg-amber-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fef3c7" strokeWidth="6" />
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
    id: `KSL-${String(offset + i + 1).padStart(4, '0')}`,
    weaver: WEAVERS[(offset + i) % WEAVERS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 300, ((offset + i) * 37) % 300) + 1,
    cost: ri(5000, 200000, ((offset + i) * 13097) % 195000) + 5000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const silkRecords = [
  { id: 'KSL-0001', weaver: 'Kanchipuram Silk Weavers Guild', ware: 'Kanchipuram Temple Border Saree', status: 'GI Kanchipuram Silk Mark', qty: 24, cost: 125000, date: '2024-01-15' },
  { id: 'KSL-0002', weaver: 'Wright Street Weaving Centre', ware: 'Mukkuvam Silk Bridal Saree', status: 'IS 16908 Silk Textile Grade A', qty: 12, cost: 185000, date: '2024-01-22' },
  { id: 'KSL-0003', weaver: 'Natham Silk Art Society', ware: 'Chinnalapatti Silk Saree', status: 'Muslin Silk Roll Bundle', qty: 45, cost: 68000, date: '2024-02-03' },
  { id: 'KSL-0004', weaver: 'Thirumalai Temple Weavers', ware: 'Peacock Motif Kanjivaram', status: 'Enclosed Truck Transit', qty: 18, cost: 155000, date: '2024-02-14' },
  { id: 'KSL-0005', weaver: 'Andarkuppam Silk Colony', ware: 'Mango Pallu Temple Saree', status: 'Humidity-Free Vault 20-25C', qty: 30, cost: 92000, date: '2024-02-28' },
  { id: 'KSL-0006', weaver: 'Perumal Puram Handloom Society', ware: 'Corridor Temple Border Saree', qty: 60, cost: 78000, date: '2024-03-05', status: 'Zari Thread Tension QC' },
  { id: 'KSL-0007', weaver: 'Kanchipuram Zari Weaving Centre', ware: 'Checkered Magham Pattu Saree', status: 'GI Kanchipuram Silk Mark', qty: 22, cost: 142000, date: '2024-03-18' },
  { id: 'KSL-0008', weaver: 'Eleventh Street Silk Cooperative', ware: 'Diamond Buttis Kanjivaram Saree', status: 'IS 16908 Silk Textile Grade A', qty: 35, cost: 110000, date: '2024-03-25' },
  { id: 'KSL-0009', weaver: 'Wright Street Weaving Centre', ware: 'Kanchipuram Temple Border Saree', status: 'Muslin Silk Roll Bundle', qty: 28, cost: 95000, date: '2024-04-02' },
  { id: 'KSL-0010', weaver: 'Natham Silk Art Society', ware: 'Mukkuvam Silk Bridal Saree', status: 'Enclosed Truck Transit', qty: 15, cost: 195000, date: '2024-04-10' },
  { id: 'KSL-0011', weaver: 'Thirumalai Temple Weavers', ware: 'Chinnalapatti Silk Saree', status: 'Humidity-Free Vault 20-25C', qty: 50, cost: 72000, date: '2024-04-22' },
  { id: 'KSL-0012', weaver: 'Andarkuppam Silk Colony', ware: 'Peacock Motif Kanjivaram', status: 'Zari Thread Tension QC', qty: 20, cost: 168000, date: '2024-05-01' },
  { id: 'KSL-0013', weaver: 'Perumal Puram Handloom Society', ware: 'Mango Pallu Temple Saree', status: 'GI Kanchipuram Silk Mark', qty: 40, cost: 88000, date: '2024-05-15' },
  { id: 'KSL-0014', weaver: 'Kanchipuram Zari Weaving Centre', ware: 'Corridor Temple Border Saree', status: 'IS 16908 Silk Textile Grade A', qty: 55, cost: 65000, date: '2024-05-28' },
  { id: 'KSL-0015', weaver: 'Eleventh Street Silk Cooperative', ware: 'Checkered Magham Pattu Saree', status: 'Muslin Silk Roll Bundle', qty: 25, cost: 135000, date: '2024-06-05' },
  { id: 'KSL-0016', weaver: 'Kanchipuram Silk Weavers Guild', ware: 'Diamond Buttis Kanjivaram Saree', status: 'Enclosed Truck Transit', qty: 32, cost: 102000, date: '2024-06-18' },
  { id: 'KSL-0017', weaver: 'Kanchipuram Zari Weaving Centre', ware: 'Kanchipuram Temple Border Saree', status: 'Humidity-Free Vault 20-25C', qty: 42, cost: 85000, date: '2024-06-25' },
  { id: 'KSL-0018', weaver: 'Eleventh Street Silk Cooperative', ware: 'Mukkuvam Silk Bridal Saree', status: 'Zari Thread Tension QC', qty: 16, cost: 188000, date: '2024-07-03' },
  { id: 'KSL-0019', weaver: 'Perumal Puram Handloom Society', ware: 'Peacock Motif Kanjivaram', status: 'GI Kanchipuram Silk Mark', qty: 38, cost: 96000, date: '2024-07-12' },
  { id: 'KSL-0020', weaver: 'Kanchipuram Silk Weavers Guild', ware: 'Mango Pallu Temple Saree', status: 'IS 16908 Silk Textile Grade A', qty: 48, cost: 78000, date: '2024-07-20' },
]

export default function KanchipuramSilkSareeLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...silkRecords, ...genRecords(21), ...genRecords(41)]

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
    <div className="ksl-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Kanchipuram Silk Saree' }]} />
      <PageHeader title="Kanchipuram Silk Saree Logistics" description="Tamil Nadu Kanjivaram silk saree supply chain with IS 16908 silk textile compliance, muslin roll bundling, humidity-controlled vault storage for pure mulberry silk with real gold zari temple border weaving across 8 heritage handloom clusters in the Silk City of Kanchipuram" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-amber-100">
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
            <HealthRing label="GI Tag" value={98} />
            <HealthRing label="IS 16908" value={95} />
            <HealthRing label="Muslin" value={89} />
            <HealthRing label="Truck" value={85} />
            <HealthRing label="Vault" value={92} />
            <HealthRing label="Zari" value={97} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Weaver Families" value="5,000+" />
            <ValueTile label="Looms Active" value="12,000" />
            <ValueTile label="Export Markets" value="45 Countries" />
            <ValueTile label="Heritage Age" value="400 Years" />
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
            placeholder="Search silk saree shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-amber-100">
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
                  <tr key={record.id} className="border-t hover:bg-amber-50/50">
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
              <CardHeader><CardTitle>Kanchipuram Kanjivaram — 400 Years of Temple Silk Heritage</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Kanchipuram silk sarees, known as Kanjivaram, represent the pinnacle of Indian textile artistry with a magnificent heritage spanning over 400 years to the reign of Krishnadevaraya of the Vijayanagara Empire when silk weaving communities from Saurashtra were settled in the temple town of Kanchipuram near Chennai. Each authentic Kanjivaram saree uses pure mulberry silk for both the warp and weft, interwoven with real gold-dipped silver zari threads that create the distinctive temple border patterns inspired by the gopuram architecture of Kanchipuram's ancient Dravidian temples. A single bridal saree can require 25-30 days of continuous handloom weaving by a master weaver, with the most elaborate designs incorporating over 5000 individual weft interlocks to create complex figurative motifs of peacocks, elephants, mangoes, and divine chariots. The town's approximately 5,000 weaver families operate over 12,000 pit looms across eight heritage clusters, making Kanchipuram one of the most concentrated handloom textile ecosystems in the world. The GI Kanchipuram Silk Mark certification guarantees that each saree contains minimum 80% pure mulberry silk and real zari with 40% minimum silver content and gold plating, distinguishing authentic Kanjivaram from machine-made synthetic imitations that have increasingly flooded global e-commerce platforms.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16908 Silk Textile Quality Standards for Kanjivaram Sarees</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">The IS 16908 standard for pure silk textile products establishes the most rigorous quality benchmarks for Kanchipuram Kanjivaram sarees, ensuring the silk textile industry maintains its reputation as India's premier luxury handloom product. The standard mandates minimum 80% pure mulberry silk content for both warp and weft threads, with silk filament denier counts between 20-22 denier for the fine warp and 26-34 denier for the stronger weft, creating the characteristic body and drape that distinguishes genuine Kanjivaram from lighter weight imitations. Zari thread specifications require minimum 40% silver content with certified gold plating thickness between 0.2-0.4 microns, verified through X-ray fluorescence spectroscopy testing at NABL-accredited textile laboratories. IS 16908 Grade A certification demands colour fastness ratings of minimum 4 on the ISO 105-C06 wash fastness scale and minimum 5 on the ISO 105-B02 light fastness scale, ensuring the rich temple border colours maintain their brilliance through decades of wear and careful dry-cleaning preservation. Each certified saree receives a unique holographic GI tag with QR code linking to a blockchain-verified provenance record documenting the weaver identity, handloom location, silk lot number, and zari batch certification from the Bureau of Indian Standards approved testing centres.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Muslin Roll Bundling & Humidity-Controlled Silk Vault Storage</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Muslin silk roll bundling has been specifically engineered for Kanchipuram Kanjivaram sarees to protect the delicate silk-zari interweave structure during transit across India and international export destinations. Each individual saree undergoes a meticulous multi-layer wrapping protocol: first folded along the traditional three-fold method that prevents permanent creasing of the zari borders, then wrapped in acid-free unbleached muslin cloth treated with natural neem oil repellent to prevent silverfish and insect damage during extended storage periods. The muslin-wrapped saree is placed on a acid-free tissue paper base and rolled around a lightweight wooden dowel to prevent any sharp fold lines that could stress the silk fibres or displace the gold zari threads. Humidity-controlled vault storage maintains a precise 20-25 degree Celsius temperature range with 45-55% relative humidity, as silk is hygroscopic and can absorb excess moisture that weakens the fibre tensile strength or promotes fungal growth on the natural gum sericin coating that gives Kanjivaram sarees their characteristic crisp body and rustling drape. The Kanchipuram Silk Saree logistics network operates dedicated climate-controlled Refrigerated trucks with GPS-enabled temperature monitoring for high-value bridal and export shipments valued above 5 lakh rupees per piece, ensuring continuous chain-of-custody quality assurance from the handloom workshop to the retail showroom or international shipping hub.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Zari Thread Authentication & Kanjivaram Global Market Expansion</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and advanced spectroscopy technologies are revolutionizing authentication and quality assurance for Kanchipuram Kanjivaram sarees in the global luxury textile marketplace where counterfeit machine-made imitations have proliferated across major e-commerce platforms. The AI authentication system employs X-ray fluorescence spectroscopy to analyse zari thread composition in real-time, verifying the 40% minimum silver content and certified gold plating thickness that distinguishes genuine handloom zari from synthetic metallic thread substitutes used in machine-made replicas costing a fraction of authentic Kanjivaram prices. Computer vision algorithms trained on over 200,000 authenticated Kanjivaram design patterns can now verify weave density, selvage structure, and temple border precision with 99.2% accuracy, detecting deviations as small as 0.05mm in interlock spacing that indicate machine rather than handloom production. Since its deployment across Kanchipuram certification centres in Q1 2026, the system has identified over 8,500 counterfeit sarees, preventing an estimated 125 crore rupees in fraudulent sales that would have damaged the Kanjivaram brand reputation among international luxury consumers. India's ongoing Geographical Indication enforcement campaign has strengthened legal protections, with customs authorities in 12 countries now trained to use the AI authentication database to screen imported Indian silk products at border checkpoints.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
