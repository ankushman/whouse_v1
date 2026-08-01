import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#4a1d96', '#5b21b6', '#7c3aed', '#8b5cf6', '#c4b5fd', '#3b0764', '#2e1065', '#ede9fe']
const PRODUCTS = ['Gond Tree of Life Panel', 'Tiger Motif Wall Canvas', 'Fish Pond Mural Painting', 'Bird Dance Tribal Scroll', 'Deer Forest Landscape', 'Snake Coil Folk Painting', 'Sun Moon Ritual Canvas', 'Village Festival Mural']
const PAINTERS = ['Bhopal Gond Art Centre', 'Patangarh Gond Colony', 'Dindori Tribal Art Guild', 'Mandla Forest Painter Society', 'Seoni Gond Workshop', 'Hoshangabad Folk Art Centre', 'Jabalpur Tribal Collective', 'Chhindwara Gond Heritage Studio']
const STATUSES = ['GI Gond Tribal Art Mark', 'IS 16909 Tribal Art Grade A', 'Acid-Free Paper Tube', 'Flatbed Truck Transit', 'Moisture-Free Storage 20-28C', 'Acrylic Paint Bond QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-violet-100 text-violet-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-violet-200 rounded-full overflow-hidden"><div className="h-full bg-violet-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ede9fe" strokeWidth="6" />
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
    id: `GTA-${String(offset + i + 1).padStart(4, '0')}`,
    painter: PAINTERS[(offset + i) % PAINTERS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 200, ((offset + i) * 37) % 200) + 1,
    cost: ri(1500, 45000, ((offset + i) * 13097) % 43500) + 1500,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const gondRecords = [
  { id: 'GTA-0001', painter: 'Bhopal Gond Art Centre', ware: 'Gond Tree of Life Panel', status: 'GI Gond Tribal Art Mark', qty: 35, cost: 12000, date: '2024-01-15' },
  { id: 'GTA-0002', painter: 'Patangarh Gond Colony', ware: 'Tiger Motif Wall Canvas', status: 'IS 16909 Tribal Art Grade A', qty: 18, cost: 28000, date: '2024-01-22' },
  { id: 'GTA-0003', painter: 'Dindori Tribal Art Guild', ware: 'Fish Pond Mural Painting', status: 'Acid-Free Paper Tube', qty: 50, cost: 8500, date: '2024-02-03' },
  { id: 'GTA-0004', painter: 'Mandla Forest Painter Society', ware: 'Bird Dance Tribal Scroll', status: 'Flatbed Truck Transit', qty: 25, cost: 22000, date: '2024-02-14' },
  { id: 'GTA-0005', painter: 'Seoni Gond Workshop', ware: 'Deer Forest Landscape', status: 'Moisture-Free Storage 20-28C', qty: 40, cost: 15000, date: '2024-02-28' },
  { id: 'GTA-0006', painter: 'Hoshangabad Folk Art Centre', ware: 'Snake Coil Folk Painting', qty: 60, cost: 6800, date: '2024-03-05', status: 'Acrylic Paint Bond QC' },
  { id: 'GTA-0007', painter: 'Jabalpur Tribal Collective', ware: 'Sun Moon Ritual Canvas', status: 'GI Gond Tribal Art Mark', qty: 22, cost: 35000, date: '2024-03-18' },
  { id: 'GTA-0008', painter: 'Chhindwara Gond Heritage Studio', ware: 'Village Festival Mural', status: 'IS 16909 Tribal Art Grade A', qty: 30, cost: 18000, date: '2024-03-25' },
  { id: 'GTA-0009', painter: 'Patangarh Gond Colony', ware: 'Gond Tree of Life Panel', status: 'Acid-Free Paper Tube', qty: 45, cost: 10500, date: '2024-04-02' },
  { id: 'GTA-0010', painter: 'Dindori Tribal Art Guild', ware: 'Tiger Motif Wall Canvas', status: 'Flatbed Truck Transit', qty: 20, cost: 32000, date: '2024-04-10' },
  { id: 'GTA-0011', painter: 'Mandla Forest Painter Society', ware: 'Fish Pond Mural Painting', status: 'Moisture-Free Storage 20-28C', qty: 55, cost: 7500, date: '2024-04-22' },
  { id: 'GTA-0012', painter: 'Seoni Gond Workshop', ware: 'Bird Dance Tribal Scroll', status: 'Acrylic Paint Bond QC', qty: 28, cost: 25000, date: '2024-05-01' },
  { id: 'GTA-0013', painter: 'Hoshangabad Folk Art Centre', ware: 'Deer Forest Landscape', status: 'GI Gond Tribal Art Mark', qty: 38, cost: 14000, date: '2024-05-15' },
  { id: 'GTA-0014', painter: 'Jabalpur Tribal Collective', ware: 'Snake Coil Folk Painting', status: 'IS 16909 Tribal Art Grade A', qty: 65, cost: 5800, date: '2024-05-28' },
  { id: 'GTA-0015', painter: 'Chhindwara Gond Heritage Studio', ware: 'Sun Moon Ritual Canvas', status: 'Acid-Free Paper Tube', qty: 15, cost: 38000, date: '2024-06-05' },
  { id: 'GTA-0016', painter: 'Bhopal Gond Art Centre', ware: 'Village Festival Mural', status: 'Flatbed Truck Transit', qty: 42, cost: 9500, date: '2024-06-18' },
  { id: 'GTA-0017', painter: 'Jabalpur Tribal Collective', ware: 'Gond Tree of Life Panel', status: 'Moisture-Free Storage 20-28C', qty: 48, cost: 8800, date: '2024-06-25' },
  { id: 'GTA-0018', painter: 'Chhindwara Gond Heritage Studio', ware: 'Tiger Motif Wall Canvas', status: 'Acrylic Paint Bond QC', qty: 24, cost: 30000, date: '2024-07-03' },
  { id: 'GTA-0019', painter: 'Hoshangabad Folk Art Centre', ware: 'Bird Dance Tribal Scroll', status: 'GI Gond Tribal Art Mark', qty: 32, cost: 20000, date: '2024-07-12' },
  { id: 'GTA-0020', painter: 'Bhopal Gond Art Centre', ware: 'Fish Pond Mural Painting', status: 'IS 16909 Tribal Art Grade A', qty: 52, cost: 7200, date: '2024-07-20' },
]

export default function GondTribalArtMadhyaPradeshLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...gondRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'painter', label: 'Painter', options: PAINTERS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.painter === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(20, 80, allRecords.length * 0.3 + i * 12) }))
  const painterChart = PAINTERS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.painter === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="gta-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Gond Tribal Art MP' }]} />
      <PageHeader title="Gond Tribal Art Madhya Pradesh Logistics" description="Central India Gond tribal art supply chain with IS 16909 tribal art compliance, acid-free paper tube packaging, moisture-controlled storage for acrylic-on-canvas Gond folk paintings from Patangarh, Dindori, and Mandla forest communities across 8 heritage art clusters in Madhya Pradesh" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-violet-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Shipments" value={allRecords.length} />
            <KpiTile label="Active Ware" value={PRODUCTS.length} />
            <KpiTile label="Painter Clusters" value={PAINTERS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={94} />
            <HealthRing label="IS 16909" value={90} />
            <HealthRing label="Paper" value={85} />
            <HealthRing label="Truck" value={82} />
            <HealthRing label="Storage" value={88} />
            <HealthRing label="Paint" value={93} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Gond Families" value="3,000+" />
            <ValueTile label="Forest Region" value="8 Districts" />
            <ValueTile label="Export Markets" value="22 Countries" />
            <ValueTile label="Heritage Age" value="2,000 Years" />
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
            placeholder="Search Gond tribal art shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-violet-100">
                <tr>
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Ware</th>
                  <th className="p-3 text-left font-medium">Painter</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Qty</th>
                  <th className="p-3 text-left font-medium">Cost</th>
                  <th className="p-3 text-left font-medium">Cost Bar</th>
                  <th className="p-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(record => (
                  <tr key={record.id} className="border-t hover:bg-violet-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.ware} /></td>
                    <td className="p-3">{record.painter}</td>
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
              <CardHeader><CardTitle>Painter Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={painterChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]}>
                    {painterChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
              <CardHeader><CardTitle>Gond Tribal Art — 2,000 Years of Central Indian Forest Tradition</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Gond tribal art represents one of the largest and most ancient tribal art traditions in India, originating over two millennia from the Gond tribal communities who have inhabited the dense forests of central India across present-day Madhya Pradesh, Chhattisgarh, and parts of Maharashtra and Odisha. The art form traditionally began as ritual wall and floor paintings created during weddings, harvests, and religious ceremonies, with designs depicting the Gond tribe's deep spiritual connection to nature through elaborate tree of life motifs, sacred animal forms, and celestial patterns representing the sun, moon, and stars that govern their agricultural calendar. The pioneering Gond artist Jangarh Singh Shyam from Patangarh village revolutionized the art form in the 1980s by transferring these traditional wall painting patterns onto canvas and paper using acrylic colours, creating the distinctive contemporary Gond art style characterised by intricate dot-fill patterns, bold outlines, and vibrant colours that has gained international recognition in galleries across Europe, North America, and Japan. Today over 3,000 Gond artist families across eight districts of Madhya Pradesh continue this tradition, with Patangarh village in Dindori district recognised as the epicentre of contemporary Gond art production, generating over 15 crore rupees annually through domestic and international art sales, government commissions, and luxury hospitality interior design projects.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16909 Tribal Art Quality Standards for Gond Painting Certification</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">The IS 16909 standard for tribal art products establishes the first comprehensive quality certification framework specifically designed for India's diverse tribal art traditions, with particular focus on the Gond tribal art of Madhya Pradesh that has become the benchmark for quality in this category. The standard mandates minimum acrylic paint quality specifications requiring artist-grade pigment concentration above 60% with lightfastness ratings of minimum 6 on the ASTM D4303 scale, ensuring Gond paintings maintain their characteristic vibrant colours for decades without fading when displayed under standard gallery or residential lighting conditions. Canvas and paper substrate requirements specify minimum 250 GSM acid-free cotton rag paper or primed cotton canvas with pH-neutral sizing to prevent acid degradation that causes yellowing and embrittlement over extended display periods. IS 16909 Grade A certification requires paint adhesion testing under controlled humidity cycling between 30-70% relative humidity for 500 hours without cracking, flaking, or delamination, simulating the environmental stress of transit between Madhya Pradesh's tropical climate and temperate international destinations. Each certified Gond painting receives a unique identification number linked to a digital provenance database documenting the artist's identity, tribal community affiliation, painting village, creation date, and authentication photographs taken at multiple production stages to prevent forgery and ensure chain-of-custody integrity throughout the commercial distribution process.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Acid-Free Paper Tube Packaging for Gond Painting Transit</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Acid-free paper tube packaging has been specifically designed for Gond tribal art logistics to protect delicate acrylic paintings on canvas and handmade paper from the physical and environmental hazards encountered during transit from remote forest village art centres to urban galleries and international shipping hubs. Each individual painting is first interleaved with acid-free tissue paper preventing any surface-to-surface contact that could cause paint smudging or abrasion of the fine dot-fill patterns that define Gond art's distinctive visual texture. The painting is then rolled around a custom-diameter acid-free cardboard core tube that prevents sharp flexion creases in the canvas or paper substrate, with the roll diameter calculated based on the specific substrate thickness to maintain a minimum bend radius that avoids cracking the acrylic paint layer. The rolled painting is inserted into a rigid acid-free mailing tube with foam end caps providing shock absorption protection against drops and impacts during the multi-transit journey from village art centres through regional collection hubs in Bhopal and Jabalpur to final destinations. Moisture barrier liners inside each tube maintain internal humidity between 35-55% relative humidity during transit periods of up to 14 days, preventing the excessive dryness that causes canvas warping or the moisture absorption that promotes fungal growth on both natural fibre substrates and acrylic paint surfaces during the monsoon season when humidity levels across Madhya Pradesh regularly exceed 85% in the forest districts.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Gond Pattern Authentication & Tribal Art Digital Marketplace</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and digital authentication technologies are transforming the Gond tribal art marketplace by providing verifiable provenance tracking and artist attribution systems that protect both the intellectual property rights of tribal artists and the confidence of collectors investing in authentic Gond paintings. The AI authentication system employs deep learning models trained on authenticated works by over 500 documented Gond artists to identify distinctive brush stroke patterns, dot-fill density signatures, and compositional structures that serve as individual artistic fingerprints unique to each painter. Pattern recognition algorithms analyse high-resolution photographs of paintings with 97.8% accuracy in attributing works to specific artists and detecting machine-printed or digitally copied forgeries that lack the subtle hand-painted irregularities characteristic of genuine Gond art created using traditional techniques passed down through generations of tribal families. The Madhya Pradesh Tribal Welfare Department's digital marketplace platform now integrates this AI authentication directly into the listing process, requiring each painting to pass automated verification before publication. Since its launch in Q2 2025, the platform has facilitated over 12,000 authenticated Gond art transactions worth 18 crore rupees, with blockchain-based provenance certificates providing immutable records of each painting's journey from the village art centre to the final collector, ensuring transparent royalty distribution to the original tribal artist through smart contract-based micro-payment systems that guarantee fair compensation.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
