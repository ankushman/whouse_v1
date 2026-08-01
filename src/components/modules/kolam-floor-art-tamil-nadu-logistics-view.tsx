import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#7e22ce', '#6b21a8', '#581c87', '#3b0764', '#9333ea', '#a855f7', '#c084fc', '#f3e8ff']
const PRODUCTS = ['Kolam Rice Flour Powder Kit', 'Padi Kolam Dot Grid Stencil Set', 'Pulli Kolam Thread Frame Tool', 'Muggu Kolam Chalk Powder Set', 'Kolam Design Transfer Template Book', 'Kolam Rice Paste Floor Sticker Roll', 'Kambi Kolam Line Drawing Tool Kit', 'Kolam Color Powder Festival Kit']
const ARTISANS = ['Mylapore Kolam Artist Guild Chennai', 'Kancheepuram Traditional Kolam Society', 'Madurai Temple Kolam Collective', 'Thanjavur Kolam Heritage Centre', 'Srirangam Kolam Women Cooperative', 'Coimbatore Kolam Art Association', 'Tirunelveli Floor Art Community', 'Pondicherry Kolam Cultural Group']
const STATUSES = ['GI Tamil Nadu Kolam Mark', 'IS 16789 Kolam Art Grade A', 'Moisture-Proof Pouch Pack', 'Enclosed Van Transit', 'Climate Storage 20-28C', 'Rice Flour Purity QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-purple-200 rounded-full overflow-hidden"><div className="h-full bg-purple-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f3e8ff" strokeWidth="6" />
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
    id: `KOL-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 28, ((offset + i) * 27) % 28) + 1,
    cost: ri(6000, 92000, ((offset + i) * 13107) % 86000) + 6000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const kolamRecords = [
  { id: 'KOL-0001', painter: 'Mylapore Kolam Artist Guild Chennai', ware: 'Kolam Rice Flour Powder Kit', status: 'GI Tamil Nadu Kolam Mark', qty: 3, cost: 78000, date: '2024-01-12' },
  { id: 'KOL-0002', painter: 'Kancheepuram Traditional Kolam Society', ware: 'Padi Kolam Dot Grid Stencil Set', status: 'IS 16789 Kolam Art Grade A', qty: 5, cost: 52000, date: '2024-01-25' },
  { id: 'KOL-0003', painter: 'Madurai Temple Kolam Collective', ware: 'Pulli Kolam Thread Frame Tool', status: 'Moisture-Proof Pouch Pack', qty: 2, cost: 88000, date: '2024-02-08' },
  { id: 'KOL-0004', painter: 'Thanjavur Kolam Heritage Centre', ware: 'Muggu Kolam Chalk Powder Set', status: 'Enclosed Van Transit', qty: 6, cost: 34000, date: '2024-02-20' },
  { id: 'KOL-0005', painter: 'Srirangam Kolam Women Cooperative', ware: 'Kolam Design Transfer Template Book', status: 'Climate Storage 20-28C', qty: 8, cost: 22000, date: '2024-03-05' },
  { id: 'KOL-0006', painter: 'Coimbatore Kolam Art Association', ware: 'Kolam Rice Paste Floor Sticker Roll', status: 'Rice Flour Purity QC', qty: 4, cost: 62000, date: '2024-03-18' },
  { id: 'KOL-0007', painter: 'Tirunelveli Floor Art Community', ware: 'Kambi Kolam Line Drawing Tool Kit', status: 'GI Tamil Nadu Kolam Mark', qty: 3, cost: 85000, date: '2024-03-30' },
  { id: 'KOL-0008', painter: 'Pondicherry Kolam Cultural Group', ware: 'Kolam Color Powder Festival Kit', status: 'IS 16789 Kolam Art Grade A', qty: 5, cost: 48000, date: '2024-04-12' },
  { id: 'KOL-0009', painter: 'Mylapore Kolam Artist Guild Chennai', ware: 'Padi Kolam Dot Grid Stencil Set', status: 'Moisture-Proof Pouch Pack', qty: 4, cost: 56000, date: '2024-04-24' },
  { id: 'KOL-0010', painter: 'Kancheepuram Traditional Kolam Society', ware: 'Kolam Rice Flour Powder Kit', status: 'Enclosed Van Transit', qty: 3, cost: 72000, date: '2024-05-06' },
  { id: 'KOL-0011', painter: 'Madurai Temple Kolam Collective', ware: 'Pulli Kolam Thread Frame Tool', status: 'Climate Storage 20-28C', qty: 6, cost: 38000, date: '2024-05-18' },
  { id: 'KOL-0012', painter: 'Thanjavur Kolam Heritage Centre', ware: 'Muggu Kolam Chalk Powder Set', status: 'Rice Flour Purity QC', qty: 2, cost: 90000, date: '2024-05-30' },
  { id: 'KOL-0013', painter: 'Srirangam Kolam Women Cooperative', ware: 'Kolam Design Transfer Template Book', status: 'GI Tamil Nadu Kolam Mark', qty: 7, cost: 26000, date: '2024-06-12' },
  { id: 'KOL-0014', painter: 'Coimbatore Kolam Art Association', ware: 'Kolam Rice Paste Floor Sticker Roll', status: 'IS 16789 Kolam Art Grade A', qty: 4, cost: 58000, date: '2024-06-24' },
  { id: 'KOL-0015', painter: 'Tirunelveli Floor Art Community', ware: 'Kambi Kolam Line Drawing Tool Kit', status: 'Moisture-Proof Pouch Pack', qty: 3, cost: 82000, date: '2024-07-06' },
  { id: 'KOL-0016', painter: 'Pondicherry Kolam Cultural Group', ware: 'Kolam Color Powder Festival Kit', status: 'Enclosed Van Transit', qty: 5, cost: 44000, date: '2024-07-18' },
  { id: 'KOL-0017', painter: 'Mylapore Kolam Artist Guild Chennai', ware: 'Kolam Rice Paste Floor Sticker Roll', status: 'Climate Storage 20-28C', qty: 4, cost: 68000, date: '2024-07-30' },
  { id: 'KOL-0018', painter: 'Kancheepuram Traditional Kolam Society', ware: 'Kolam Rice Flour Powder Kit', status: 'Rice Flour Purity QC', qty: 3, cost: 76000, date: '2024-08-10' },
  { id: 'KOL-0019', painter: 'Madurai Temple Kolam Collective', ware: 'Pulli Kolam Thread Frame Tool', status: 'GI Tamil Nadu Kolam Mark', qty: 6, cost: 42000, date: '2024-08-22' },
  { id: 'KOL-0020', painter: 'Thanjavur Kolam Heritage Centre', ware: 'Muggu Kolam Chalk Powder Set', status: 'IS 16789 Kolam Art Grade A', qty: 2, cost: 92000, date: '2024-09-03' },
]

export default function KolamFloorArtTamilNaduLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...kolamRecords, ...genRecords(21), ...genRecords(41)]


  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])


  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'painter', label: 'Painter', options: ARTISANS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.painter === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(4, 26, allRecords.length * 0.12 + i * 3) }))
  const artisanChart = ARTISANS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.painter === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))


  return (
    <div className="kol-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Kolam Floor Art Tamil Nadu' }]} />
      <PageHeader title="Kolam Floor Art Tamil Nadu Logistics" description="Tamil Nadu Kolam rice flour floor art supply chain with IS 16789 certification, rice flour purity QC, moisture-proof pouch packaging, and GI Tamil Nadu Kolam Mark across 8 heritage artisan communities in Chennai, Kancheepuram, Madurai, and Thanjavur" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-purple-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Shipments" value={allRecords.length} />
            <KpiTile label="Active Ware" value={PRODUCTS.length} />
            <KpiTile label="Kolam Clusters" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={93} />
            <HealthRing label="IS 16789" value={89} />
            <HealthRing label="Moisture" value={85} />
            <HealthRing label="Van" value={81} />
            <HealthRing label="Climate" value={87} />
            <HealthRing label="Purity QC" value={91} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="45+" />
            <ValueTile label="Tradition" value="Since 5th BCE" />
            <ValueTile label="Export Markets" value="5 Countries" />
            <ValueTile label="Annual Revenue" value="₹1.8 Crore" />
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
            placeholder="Search Kolam floor art shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-purple-100">
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
                  <tr key={record.id} className="border-t hover:bg-purple-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.ware} /></td>
                    <td className="p-3">{record.painter}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['pcs', 'sets', 'units', 'kits'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Artisan Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={artisanChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]}>
                    {artisanChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
              <CardHeader><CardTitle>Kolam Floor Art — 2500-Year Tamil Nadu Threshold Drawing Tradition</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Kolam is one of the most ancient, mathematically sophisticated, and culturally significant visual art traditions practised continuously across the Tamil-speaking regions of the Indian subcontinent for over two and a half millennia, representing a daily domestic ritual practice where women of Tamil Hindu households create intricate geometric and curvilinear floor drawings using finely ground white rice flour at the threshold entrance of their homes each morning before sunrise, transforming the domestic threshold into a sacred decorative boundary between the profane exterior world and the sanctified interior domestic space in accordance with the Agama Shastra prescriptive texts that govern Tamil Brahminical domestic ritual practice where the kolam serves simultaneously as a decorative embellishment, a devotional offering to the household deity and guardian spirits, a mathematical meditation exercise demanding precise spatial reasoning and pattern memorisation skills, and a community bonding ritual where the quality and complexity of each woman's daily kolam drawing reflects her artistic skill, mathematical aptitude, and devotion to the domestic ritual tradition that has been transmitted matrilineally from mother to daughter across uncounted generations of Tamil women maintaining one of the world's oldest continuously practised domestic visual art traditions whose geometric vocabulary encompasses hundreds of documented base patterns classified into the major kolam typologies including the Sikku Kolam or interlocking-loop kolam where continuous single-line looping patterns are drawn without lifting the finger from the floor surface producing mathematically complex closed-loop topologies that have attracted the attention of computational mathematicians studying the topological properties of knot theory and graph theory as they relate to the traditional kolam vocabulary, the Padi Kolam or dot-matrix kolam where the artist first establishes a reference grid of dots arranged in specific numerical sequences and then draws curvilinear or straight-line patterns connecting the dots to produce symmetrical geometric compositions whose mathematical regularity reflects the Kolam artist's mastery of symmetry operations including rotational symmetry, translational symmetry, and reflectional symmetry that produce the visually striking kolam compositions seen at temple festival kolam competitions held annually at major Hindu temple complexes across Tamil Nadu including the Kapaleeswarar Temple at Mylapore in Chennai, the Meenakshi Sundareswarar Temple at Madurai, the Brihadeeswarar Temple at Thanjavur, and the Ranganathaswamy Temple at Srirangam where the most accomplished kolam artists from across the Tamil Nadu kolam community gather during major festival periods to demonstrate their mastery of the kolam art form before large public audiences of devotees and cultural heritage enthusiasts who appreciate both the mathematical complexity and the devotional significance of the kolam tradition that defines the cultural identity of Tamil Nadu and the Tamil diaspora communities worldwide where the kolam practice continues to thrive as a powerful symbol of Tamil cultural heritage and feminine artistic expression.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16789 Kolam Art Standards & Rice Flour Purity QC</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The IS 16789 standard for Kolam art establishes India's first dedicated quality certification framework for the Tamil Nadu kolam floor art supply chain, specifying comprehensive requirements for rice flour raw material quality and fineness, kolam powder particle size distribution, moisture content tolerance, colour additive purity for coloured kolam powder kits, stencil and template dimensional accuracy, and overall kolam product safety standards that collectively distinguish authentic kolam art materials produced by traditional Tamil Nadu kolam artisan cooperatives from the growing volume of industrially manufactured rice flour substitutes and synthetic powder imitations that have increasingly appeared in both domestic Indian festival supply markets and international retail platforms serving the global Tamil diaspora community's demand for authentic kolam drawing materials. The rice flour raw material requirements for IS 16789 Grade A certification mandate exclusively hand-ground single-polished rice flour derived from traditional short-grain or medium-grain paddy rice varieties cultivated in the Kaveri delta region of Tamil Nadu with minimum amylose content of 22% ensuring the flour produces the characteristic smooth-flowing kolam line quality when pinched between the thumb and forefinger during the traditional kolam drawing technique where the artist uses a thumb-forefinger pinching motion to release a thin continuous stream of rice flour onto the floor surface tracing the intricate geometric patterns from memory without reference to any printed or digital template in the traditional daily domestic kolam practice. The particle size distribution requirements for Grade A certification mandate that minimum 95% of the kolam flour particles pass through a 150-micron mesh sieve and minimum 80% pass through a 75-micron mesh sieve verified through laser diffraction particle size analysis ensuring the flour flows smoothly through the artist's fingers without clumping, clogging, or irregular discharge that would compromise the visual quality and geometric precision of the kolam drawing where line width consistency within plus or minus 0.5 millimetres across the full drawing is considered the minimum acceptable quality threshold for authenticated kolam flour produced under the IS 16789 certification framework. The moisture content tolerance for Grade A certification mandates maximum moisture content of 10% by weight verified through Karl Fischer titration ensuring the kolam flour remains free-flowing during storage and resistant to fungal growth and insect contamination during the typical six-month shelf life period for sealed kolam flour packets stored under ambient conditions in Tamil Nadu's tropical climate where ambient humidity levels regularly exceed 75% relative humidity during the monsoon season months from June through September creating challenging storage conditions for hygroscopic rice flour products that require meticulous moisture-proof packaging and controlled distribution logistics to maintain product quality from the artisan production centres in the Kancheepuram, Thanjavur, and Madurai districts to the retail distribution points serving the kolam artist communities across Tamil Nadu, the broader Indian domestic market, and the international Tamil diaspora communities in Singapore, Malaysia, Sri Lanka, South Africa, and other countries with significant Tamil population settlements where the kolam tradition continues to be practised as a defining element of Tamil cultural identity and domestic ritual observance.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Moisture-Proof Pouch Packaging for Kolam Rice Flour Transit</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Moisture-proof pouch packaging with multi-layer barrier film construction has been specifically developed for the Kolam floor art logistics supply chain to protect the hygroscopic rice flour kolam powder products from the ambient humidity conditions encountered during transit from the Tamil Nadu artisan production centres in the Chennai, Kancheepuram, Madurai, and Thanjavur districts to domestic retail distribution points across Tamil Nadu and the broader Indian market, and international export destinations serving the Tamil diaspora communities in Singapore, Malaysia, Sri Lanka, and other countries where the kolam tradition is actively maintained as a daily domestic ritual practice requiring consistent quality kolam flour products. The packaging specification utilises a three-layer barrier film construction comprising an outer layer of 12-micron biaxially oriented polyester film providing mechanical strength and puncture resistance, a middle layer of 9-micron aluminium foil providing near-absolute moisture barrier performance with water vapour transmission rate below 0.01 grams per square metre per day at 38 degrees Celsius and 90% relative humidity test conditions, and an inner layer of 50-micron low-density polyethylene providing heat-sealability and food-contact safety compliance ensuring the packaged kolam flour remains protected from ambient moisture ingress throughout the transit and storage cycle from the artisan cooperative packing facilities to the end-user kolam artist who opens the pouch to extract the flour for daily kolam drawing practice. Each kolam flour product is inspected under standardised quality control protocols verifying rice flour particle size distribution within the IS 16789 Grade A specification parameters, moisture content below 10% by weight, absence of insect contamination and fungal growth indicators through visual inspection under 10x magnification, and colour additive purity for coloured kolam powder products through thin-layer chromatography verifying the absence of synthetic dye adulterants and heavy metal contaminants including lead, cadmium, and arsenic that would pose food-contact safety risks during the traditional kolam drawing practice where the artist's fingers repeatedly contact the flour and subsequently touch the mouth, eyes, or food items during the domestic ritual context. The inspected and approved kolam flour product is filled into the moisture-proof barrier pouch in a controlled atmosphere packing environment maintaining relative humidity below 40% and temperature below 25 degrees Celsius to prevent moisture absorption during the filling operation that could compromise the product's moisture content and shelf life parameters before the pouch is heat-sealed and placed within a rigid outer shipping container constructed from 5-millimetre single-wall corrugated fibreboard with desiccant silica gel sachets providing additional moisture protection during transit through the high-humidity corridors of peninsular India where ambient humidity conditions during the monsoon season months from June through September regularly exceed 85% relative humidity creating challenging logistics conditions for hygroscopic kolam flour products that require the highest standards of moisture-proof packaging and climate-controlled transit to maintain the product quality and shelf life specifications demanded by kolam artist communities and institutional cultural heritage organisations across India and the global Tamil diaspora.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Pattern Verification & Kolam Heritage Market Development</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and computational geometry analysis technologies are being progressively deployed to document, classify, and verify the distinctive geometric pattern vocabulary of the Tamil Nadu Kolam floor art tradition, analysing the mathematical properties of traditional kolam patterns including the topological characteristics of Sikku Kolam continuous-loop patterns where the single unbroken line creates complex closed-loop topologies that challenge computational graph theorists studying the mathematical properties of knot theory and Eulerian path traversal, the symmetry properties of Padi Kolam dot-matrix patterns where the artist's mastery of rotational, translational, and reflectional symmetry operations produces the visually striking symmetrical compositions that define the Kolam aesthetic, and the fractal self-similarity properties found in nested kolam patterns where larger kolam compositions contain smaller copies of themselves at decreasing scale levels reflecting the recursive mathematical thinking embedded in the traditional kolam drawing practice that has attracted significant academic attention from researchers in computational mathematics, cognitive science, and cultural informatics studying the mathematical reasoning processes of traditional kolam artists who generate complex geometric compositions entirely from memory without reference to external templates during the daily domestic kolam drawing ritual. The AI documentation system employs high-resolution digital image capture at 300 dots per inch combined with automated geometric analysis algorithms that identify and classify the kolam pattern type, extract the mathematical symmetry group classification, measure the topological complexity using graph-theoretic metrics including cyclomatic number, Euler characteristic, and Betti numbers, and compare the captured pattern against the established database of documented traditional kolam patterns maintained by the Tamil Nadu Kolam Art Heritage Preservation Society which catalogues over three thousand distinct kolam base patterns and their recognised variations documented from active kolam artist communities across the twenty-five districts of Tamil Nadu where the kolam tradition continues to thrive as a daily domestic ritual practice maintained by millions of Tamil women who create kolam drawings at the threshold entrance of their homes each morning before sunrise in accordance with the prescriptive texts of the Agama Shastra tradition governing Tamil Brahminical domestic ritual observance. The AI-powered kolam market development platform connects traditional kolam artisan cooperatives in the Chennai, Kancheepuram, Madurai, and Thanjavur districts directly with institutional buyers including museum gift shops, cultural heritage organisations, Tamil diaspora community centres in Singapore, Malaysia, Sri Lanka, and South Africa, educational institutions teaching Indian cultural studies, and international retail platforms serving the growing global demand for authentic kolam art materials, kolam stencil design tools, kolam template books, and kolam instructional kits that enable kolam practice among diaspora Tamil communities and cultural enthusiasts worldwide who seek to maintain and propagate this extraordinary twenty-five-century visual art tradition that represents one of the oldest, most mathematically sophisticated, and most culturally significant domestic art practices in human civilisation.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

