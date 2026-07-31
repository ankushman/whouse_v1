import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#be185d', '#db2777', '#ec4899', '#f472b6', '#fce7f3', '#9d174d', '#831843', '#fdf2f8']
const PRODUCTS = ['Kashmir Floral Box Set', 'Shikarga Hunting Scene Vase', 'Srinagar Mughal Miniature Tray', 'Papier-Mache Christmas Ornament', 'Saffron Rose Wall Panel', 'Gulab-Gulabi Rose Bowl Set', 'Chinar Leaf Pendant Collection', 'Badam-Shaped Almond Box']
const PAINTERS = ['Srinagar Old City Papier-Mache Guild', 'Zadibal Craft Cluster', 'Khanqah-e-Moula Art Centre', 'Hazratbal Decorative Arts', 'Nigeen Lake Painter Colony', 'Downtown Srinagar Studio', 'Rajbagh Papier-Mache Society', 'Jawahar Nagar Artisan Workshop']
const STATUSES = ['GI Kashmir Papier-Mache Mark', 'IS 16804 Papier-Mache Grade A', 'Cotton-Wool Padded Box', 'Enclosed Truck Transit', 'Humidity-Free Vault 20-25C', 'Naqash Paint Finish QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

function ProductBadge({ name }: { name: string }) {
  return <span className="kpa-product-badge bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs font-medium">{name}</span>
}
function StatusBadge({ status }: { status: string }) {
  return <span className="kpa-status-badge bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap">{status}</span>
}
function CostBar({ cost, maxCost }: { cost: number; maxCost: number }) {
  return <div className="kpa-cost-bar w-24 h-2 bg-pink-100 rounded-full overflow-hidden"><div className="h-full bg-pink-700 rounded-full" style={{ width: `${ri(0, 100, (cost / maxCost) * 100)}%` }} /></div>
}
function HealthRing({ label, value }: { label: string; value: number }) {
  return (
    <div className="kpa-health-ring flex flex-col items-center gap-1">
      <div className="relative w-16 h-16"><svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#fce7f3" strokeWidth="3" /><circle cx="18" cy="18" r="15.9" fill="none" stroke="#be185d" strokeWidth="3" strokeDasharray={`${value} ${100 - value}`} strokeLinecap="round" />
      </svg><span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color: '#be185d' }}>{value}%</span></div>
      <span className="text-[10px] text-muted-foreground text-center leading-tight">{label}</span>
    </div>
  )
}
function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <Card className="kpa-kpi-tile"><CardContent className="p-4">
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold" style={{ color: '#be185d' }}>{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{sub}</p>
    </CardContent></Card>) }
function ValueTile({ label, value }: { label: string; value: string }) {
  return (
    <Card className="kpa-value-tile"><CardContent className="p-3 text-center">
      <p className="text-lg font-bold" style={{ color: '#be185d' }}>{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </CardContent></Card>) }

function genRecords(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `KPA-${String(i + 1).padStart(4, '0')}`, painter: PAINTERS[i % PAINTERS.length],
    ornament: PRODUCTS[i % PRODUCTS.length], status: STATUSES[i % STATUSES.length],
    qty: ri(10, 500, Math.floor(Math.random() * 500)), cost: ri(3000, 180000, Math.floor(Math.random() * 180000)),
    unit: ['pcs', 'sets', 'pairs', 'boxes'][i % 4],
    date: `2025-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`
  }))
}

const papierRecords = [
  { id: 'KPA-0001', painter: 'Srinagar Old City Papier-Mache Guild', ornament: 'Kashmir Floral Box Set', status: 'GI Kashmir Papier-Mache Mark', qty: 120, cost: 85000, unit: 'sets', date: '2025-01-15' },
  { id: 'KPA-0002', painter: 'Zadibal Craft Cluster', ornament: 'Shikarga Hunting Scene Vase', status: 'IS 16804 Papier-Mache Grade A', qty: 80, cost: 142000, unit: 'pcs', date: '2025-02-03' },
  { id: 'KPA-0003', painter: 'Khanqah-e-Moula Art Centre', ornament: 'Srinagar Mughal Miniature Tray', status: 'Cotton-Wool Padded Box', qty: 200, cost: 67000, unit: 'pcs', date: '2025-02-18' },
  { id: 'KPA-0004', painter: 'Hazratbal Decorative Arts', ornament: 'Papier-Mache Christmas Ornament', status: 'Enclosed Truck Transit', qty: 500, cost: 34000, unit: 'boxes', date: '2025-03-01' },
  { id: 'KPA-0005', painter: 'Nigeen Lake Painter Colony', ornament: 'Saffron Rose Wall Panel', status: 'Humidity-Free Vault 20-25C', qty: 60, cost: 178000, unit: 'pcs', date: '2025-03-12' },
  { id: 'KPA-0006', painter: 'Downtown Srinagar Studio', ornament: 'Gulab-Gulabi Rose Bowl Set', status: 'Naqash Paint Finish QC', qty: 150, cost: 52000, unit: 'sets', date: '2025-03-25' },
  { id: 'KPA-0007', painter: 'Rajbagh Papier-Mache Society', ornament: 'Chinar Leaf Pendant Collection', status: 'GI Kashmir Papier-Mache Mark', qty: 300, cost: 28000, unit: 'pairs', date: '2025-04-08' },
  { id: 'KPA-0008', painter: 'Jawahar Nagar Artisan Workshop', ornament: 'Badam-Shaped Almond Box', status: 'IS 16804 Papier-Mache Grade A', qty: 90, cost: 115000, unit: 'boxes', date: '2025-04-20' },
  { id: 'KPA-0009', painter: 'Srinagar Old City Papier-Mache Guild', ornament: 'Shikarga Hunting Scene Vase', status: 'Cotton-Wool Padded Box', qty: 45, cost: 163000, unit: 'pcs', date: '2025-05-02' },
  { id: 'KPA-0010', painter: 'Zadibal Craft Cluster', ornament: 'Srinagar Mughal Miniature Tray', status: 'Enclosed Truck Transit', qty: 180, cost: 73000, unit: 'pcs', date: '2025-05-15' },
  { id: 'KPA-0011', painter: 'Khanqah-e-Moula Art Centre', ornament: 'Papier-Mache Christmas Ornament', status: 'Humidity-Free Vault 20-25C', qty: 600, cost: 19000, unit: 'boxes', date: '2025-05-28' },
  { id: 'KPA-0012', painter: 'Hazratbal Decorative Arts', ornament: 'Saffron Rose Wall Panel', status: 'Naqash Paint Finish QC', qty: 35, cost: 180000, unit: 'pcs', date: '2025-06-10' },
  { id: 'KPA-0013', painter: 'Nigeen Lake Painter Colony', ornament: 'Gulab-Gulabi Rose Bowl Set', status: 'GI Kashmir Papier-Mache Mark', qty: 110, cost: 48000, unit: 'sets', date: '2025-06-22' },
  { id: 'KPA-0014', painter: 'Downtown Srinagar Studio', ornament: 'Chinar Leaf Pendant Collection', status: 'IS 16804 Papier-Mache Grade A', qty: 250, cost: 32000, unit: 'pairs', date: '2025-07-05' },
  { id: 'KPA-0015', painter: 'Rajbagh Papier-Mache Society', ornament: 'Badam-Shaped Almond Box', status: 'Cotton-Wool Padded Box', qty: 75, cost: 98000, unit: 'boxes', date: '2025-07-18' },
  { id: 'KPA-0016', painter: 'Jawahar Nagar Artisan Workshop', ornament: 'Kashmir Floral Box Set', status: 'Enclosed Truck Transit', qty: 160, cost: 61000, unit: 'sets', date: '2025-08-01' },
  { id: 'KPA-0017', painter: 'Srinagar Old City Papier-Mache Guild', ornament: 'Shikarga Hunting Scene Vase', status: 'Humidity-Free Vault 20-25C', qty: 40, cost: 156000, unit: 'pcs', date: '2025-08-14' },
  { id: 'KPA-0018', painter: 'Zadibal Craft Cluster', ornament: 'Saffron Rose Wall Panel', status: 'Naqash Paint Finish QC', qty: 55, cost: 172000, unit: 'pcs', date: '2025-08-27' },
  { id: 'KPA-0019', painter: 'Khanqah-e-Moula Art Centre', ornament: 'Gulab-Gulabi Rose Bowl Set', status: 'GI Kashmir Papier-Mache Mark', qty: 130, cost: 45000, unit: 'sets', date: '2025-09-09' },
  { id: 'KPA-0020', painter: 'Hazratbal Decorative Arts', ornament: 'Chinar Leaf Pendant Collection', status: 'IS 16804 Papier-Mache Grade A', qty: 280, cost: 26000, unit: 'pairs', date: '2025-09-22' },
]

export default function KashmirPapierMacheLogisticsView() {
const [searchQuery, setSearchQuery] = useState('')
const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
const allRecords = papierRecords
const filteredRecords = useMemo(() => {
  const filterRecords = (r: typeof papierRecords[number]) =>
    Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string))
  return allRecords.filter(filterRecords)
}, [activeFilters, allRecords])
const maxCost = Math.max(...papierRecords.map(r => r.cost))
const filterGroups = [
  { key: 'painter', label: 'Painter', options: PAINTERS.map(p => ({ value: p, label: p, count: papierRecords.filter(r => r.painter === p).length })) },
  { key: 'ornament', label: 'Ornament', options: PRODUCTS.map(p => ({ value: p, label: p, count: papierRecords.filter(r => r.ornament === p).length })) },
  { key: 'status', label: 'Status', options: STATUSES.map(s => ({ value: s, label: s, count: papierRecords.filter(r => r.status === s).length })) },
]
const painterChart = PAINTERS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), value: papierRecords.filter(r => r.painter === p).reduce((a, b) => a + b.cost, 0) }))
const monthlyChart = papierRecords.reduce((acc, r) => { const m = r.date.slice(5, 7); const existing = acc.find(x => x.month === m); if (existing) { existing.cost += r.cost; existing.qty += r.qty } else { acc.push({ month: m, cost: r.cost, qty: r.qty }) } return acc }, [] as { month: string; cost: number; qty: number }[])
const statusPie = STATUSES.map(s => ({ name: s.split(' ').slice(0, 3).join(' '), value: papierRecords.filter(r => r.status === s).length }))
const productBar = PRODUCTS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), qty: papierRecords.filter(r => r.ornament === p).reduce((a, b) => a + b.qty, 0) }))
const onToggleFilter = (key: string, value: string) => {
  setActiveFilters(prev => ({ ...prev, [key]: prev[key]?.includes(value) ? prev[key].filter(v => v !== value) : [...(prev[key] || []), value] }))
}

return (
<div className="kpa-module space-y-4 p-4">
<ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Kashmir Papier Mache' }]} />
<PageHeader title="Kashmir Papier Mache Logistics" description="Ornamental papier-mache from Srinagar — recycled paper pulp, suhgun coating, naqash hand-painted floral & Mughal patterns" />
<Tabs defaultValue="dashboard">
<TabsList>
<TabsTrigger value="dashboard">Dashboard</TabsTrigger>
<TabsTrigger value="shipments">Shipments</TabsTrigger>
<TabsTrigger value="analytics">Analytics</TabsTrigger>
<TabsTrigger value="insights">Insights</TabsTrigger>
</TabsList>
<TabsContent value="dashboard">
<div className="grid grid-cols-4 gap-3">
<KpiTile title="Total Pieces" value={String(papierRecords.reduce((a, b) => a + b.qty, 0))} sub="Across all artisans" />
<KpiTile title="Total Value" value={`₹${(papierRecords.reduce((a, b) => a + b.cost, 0) / 100000).toFixed(1)}L`} sub="Combined shipment value" />
<KpiTile title="Active Artisans" value={String(PAINTERS.length)} sub="Papier-mache guilds" />
<KpiTile title="Avg Cost/Shipment" value={`₹${Math.round(papierRecords.reduce((a, b) => a + b.cost, 0) / papierRecords.length).toLocaleString()}`} sub="Per shipment average" />
</div>
<div className="grid grid-cols-6 gap-3 mt-4">
<HealthRing label="GI Mark" value={97} />
<HealthRing label="IS 16804" value={93} />
<HealthRing label="Suhgun Coat" value={90} />
<HealthRing label="Truck Transit" value={81} />
<HealthRing label="Storage" value={89} />
<HealthRing label="Paint QC" value={95} />
</div>
<div className="grid grid-cols-4 gap-3 mt-4">
<ValueTile label="Naqash Workshops" value="18" />
<ValueTile label="Annual Pieces" value="5,500" />
<ValueTile label="Export Countries" value="28" />
<ValueTile label="Heritage Years" value="600" />
</div>
</TabsContent>
<TabsContent value="shipments">
<SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={onToggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allRecords.length} filteredCount={filteredRecords.length} onRefresh={() => {}} placeholder="Search papier-mache shipments..." />
<Card>
<CardHeader><CardTitle>Shipment Records</CardTitle></CardHeader>
<CardContent>
<div className="overflow-x-auto">
<table className="w-full text-sm">
<thead><tr className="border-b">
<th className="text-left p-2">ID</th>
<th className="text-left p-2">Ornament</th>
<th className="text-left p-2">Painter</th>
<th className="text-left p-2">Status</th>
<th className="text-right p-2">Qty</th>
<th className="text-right p-2">Cost</th>
<th className="text-left p-2">Cost Bar</th>
<th className="text-left p-2">Date</th>
</tr></thead>
<tbody>
{filteredRecords.map(r => (
<tr key={r.id} className="border-b bg-pink-50 hover:bg-pink-100 transition-colors">
<td className="p-2 font-mono text-xs">{r.id}</td>
<td className="p-2"><ProductBadge name={r.ornament} /></td>
<td className="p-2 text-xs">{r.painter}</td>
<td className="p-2"><StatusBadge status={r.status} /></td>
<td className="p-2 text-right">{r.qty} {r.unit}</td>
<td className="p-2 text-right font-medium">₹{r.cost.toLocaleString()}</td>
<td className="p-2"><CostBar cost={r.cost} maxCost={maxCost} /></td>
<td className="p-2 text-xs text-muted-foreground">{r.date}</td>
</tr>
))}
</tbody>
</table>
</div>
</CardContent>
</Card>
</TabsContent>
<TabsContent value="analytics">
<div className="grid grid-cols-2 gap-4">
<Card>
<CardHeader><CardTitle>Monthly Shipment Trends</CardTitle></CardHeader>
<CardContent>
<LineChart width={500} height={250} data={monthlyChart}>
<CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="month" />
<YAxis />
<Tooltip />
<Legend />
<Line type="monotone" dataKey="cost" stroke="#be185d" strokeWidth={2} />
</LineChart>
</CardContent>
</Card>
<Card>
<CardHeader><CardTitle>Ornament Quantity Distribution</CardTitle></CardHeader>
<CardContent>
<BarChart width={500} height={250} data={productBar}>
<CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="name" />
<YAxis />
<Tooltip />
<Legend />
<Bar dataKey="qty" fill="#be185d" radius={[4, 4, 0, 0]} />
</BarChart>
</CardContent>
</Card>
<Card>
<CardHeader><CardTitle>Painter Cost Contribution</CardTitle></CardHeader>
<CardContent>
<LineChart width={500} height={250} data={painterChart}>
<CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="name" />
<YAxis />
<Tooltip />
<Legend />
<Line type="monotone" dataKey="value" stroke="#db2777" strokeWidth={2} />
</LineChart>
</CardContent>
</Card>
<Card>
<CardHeader><CardTitle>Status Distribution</CardTitle></CardHeader>
<CardContent>
<PieChart width={400} height={250}>
<Pie data={statusPie} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
{statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
</Pie>
<Tooltip />
<Legend />
</PieChart>
</CardContent>
</Card>
</div>
</TabsContent>
<TabsContent value="insights">
<div className="grid grid-cols-1 gap-4">
<Card>
<CardHeader><CardTitle>Kashmir Papier-Mache — 600 Years of Srinagar Ornamental Paper Art Heritage</CardTitle></CardHeader>
<CardContent><p className="text-sm text-muted-foreground leading-relaxed">Kashmir papier-mache represents one of the most exquisite decorative craft traditions in the Indian subcontinent, with a rich heritage spanning over 600 years. This ornamental art form was introduced to the Kashmir Valley by Sultan Zain-ul-Abidin in the 15th century, who invited skilled artisans from Central Asia to teach local craftsmen. The process begins with recycled paper pulp that is meticulously moulded over wooden forms, then coated with a smooth layer of suhgun — a traditional mixture of gypsum, chalk, and river silt from the Jhelum. Master naqash artists then hand-paint elaborate floral motifs, shikarga hunting scenes depicting Mughal court life, and intricate miniature patterns inspired by Mughal palace architecture. Each piece receives delicate gold leaf detailing applied by specialist artisans. The craft remains concentrated in the old city quarters of Srinagar, where guilds of artisans preserve techniques passed down through generations, making every papier-mache object a unique testament to Kashmir's living artistic legacy.</p></CardContent>
</Card>
<Card>
<CardHeader><CardTitle>IS 16804 Papier-Mache Quality Standards for Kashmir Ornamental Paper Art</CardTitle></CardHeader>
<CardContent><p className="text-sm text-muted-foreground leading-relaxed">The IS 16804 standard establishes comprehensive quality benchmarks for Kashmir papier-mache products, ensuring consistency and authenticity across the craft industry. The specification mandates paper pulp composition ratios of 70 percent recycled paper combined with 30 percent rice straw for optimal structural integrity and surface smoothness. Suhgun coating thickness must maintain a precise range of 0.5 to 1.5 millimeters, providing the ideal substrate for naqash hand-painting. Surface smoothness measurements must achieve Ra values below 3.2 micrometers to meet Grade A classification, verified through calibrated profilometer testing at certified laboratories. The standard further requires naqash hand-paint resolution of a minimum 120 strokes per centimeter, ensuring the intricate floral and miniature patterns meet traditional artisan quality benchmarks. Gold leaf adhesion testing must achieve 95 percent coverage as measured by ASTM D3359 tape test methodology, preventing premature flaking during transit and storage. These standards collectively safeguard the reputation of Kashmir papier-mache in international markets.</p></CardContent>
</Card>
<Card>
<CardHeader><CardTitle>Cotton-Wool Padded Box Packaging & Humidity-Controlled Transit for Papier-Mache</CardTitle></CardHeader>
<CardContent><p className="text-sm text-muted-foreground leading-relaxed">Proper packaging and transit protocols are critical for preserving the delicate surface quality of Kashmir papier-mache during logistics operations. Each finished piece undergoes individual cotton-wool wrapping to prevent surface abrasion and micro-scratching that could damage the naqash hand-painted motifs and gold leaf detailing. Items are then placed in partitioned cardboard boxes with custom foam inserts that prevent movement during transport. Temperature control is paramount: maintaining the 20 to 25 degrees Celsius range prevents paper pulp expansion and paint cracking that occur at temperature extremes. Humidity-free storage environments below 40 percent relative humidity protect against fungal growth and suhgun coating deterioration. The Srinagar logistics network handles over 5,500 papier-mache shipments annually through enclosed truck transit systems equipped with humidity monitoring sensors. Refrigerator-grade climate control units ensure consistent environmental conditions from artisan workshop to final destination, maintaining the pristine quality that international collectors expect from authenticated Kashmir papier-mache art pieces.</p></CardContent>
</Card>
<Card>
<CardHeader><CardTitle>AI Naqash Pattern Authentication & Kashmir Papier-Mache International Market Expansion</CardTitle></CardHeader>
<CardContent><p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence is revolutionizing the authentication and market expansion of Kashmir papier-mache through sophisticated pattern recognition technology. A convolutional neural network trained on a dataset of 16,000 authenticated papier-mache pieces achieves 95 percent accuracy in distinguishing genuine hand-painted naqash work from screen-printed reproductions and machine-assisted forgeries. The system analyzes brushstroke micro-variation patterns, gold leaf density distribution, and paint layer composition using advanced computer vision algorithms. Export revenue has demonstrated remarkable growth trajectory, increasing from Rs 22 crore in 2019 to Rs 65 crore in 2025, reflecting expanding international demand for authenticated Kashmir crafts. Industry projections target Rs 120 crore in annual export revenue by 2028, with market penetration expanding across 28 countries spanning Europe, North America, East Asia, and the Middle East. This technological intervention protects artisan livelihoods while enabling scalable market access for genuine Kashmir papier-mache products worldwide.</p></CardContent>
</Card>
</div>
</TabsContent>

</Tabs>
</div>
)
}
