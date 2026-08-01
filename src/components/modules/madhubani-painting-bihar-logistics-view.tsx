import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#6b21a8', '#7e22ce', '#9333ea', '#a855f7', '#c084fc', '#581c87', '#3b0764', '#f3e8ff']
const PRODUCTS = ['Madhubani Kohbar Vivah Panel', 'Bihar Mithila Tree of Life', 'Madhubani Sun God Surya Painting', 'Bihar Bharni Style Fish Motif', 'Madhubani Katchni Line Art Panel', 'Mithila Godna Tattoo Art Painting', 'Madhubani Tantric Yantra Canvas', 'Bihar Mithila Peacock Courtship Panel']
const PAINTERS = ['Madhubani Traditional Art Guild', 'Jitwarpur Mithila Painters Society', 'Ranti Village Art Cooperative', 'Darbhanga Heritage Painters', 'Saharsa Mithila Art Centre', 'Madhubani Town Folk Artists', 'Laukahi Village Painting Colony', 'Benipatti Mithila Craft Studio']
const STATUSES = ['GI Madhubani Painting Mark', 'IS 16921 Mithila Art Grade A', 'Hardboard Case with Bubble Wrap', 'Enclosed Truck Transit', 'Dry Storage 18-30C', 'Natural Dye Colourfastness QC']

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
    id: `MBI-${String(offset + i + 1).padStart(4, '0')}`,
    painter: PAINTERS[(offset + i) % PAINTERS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 55, ((offset + i) * 43) % 55) + 1,
    cost: ri(2500, 78000, ((offset + i) * 11731) % 75500) + 2500,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const madhubaniRecords = [
  { id: 'MBI-0001', painter: 'Madhubani Traditional Art Guild', ware: 'Madhubani Kohbar Vivah Panel', status: 'GI Madhubani Painting Mark', qty: 5, cost: 65000, date: '2024-01-10' },
  { id: 'MBI-0002', painter: 'Jitwarpur Mithila Painters Society', ware: 'Bihar Mithila Tree of Life', status: 'IS 16921 Mithila Art Grade A', qty: 8, cost: 42000, date: '2024-01-22' },
  { id: 'MBI-0003', painter: 'Ranti Village Art Cooperative', ware: 'Madhubani Sun God Surya Painting', status: 'Hardboard Case with Bubble Wrap', qty: 12, cost: 28000, date: '2024-02-05' },
  { id: 'MBI-0004', painter: 'Darbhanga Heritage Painters', ware: 'Bihar Bharni Style Fish Motif', status: 'Enclosed Truck Transit', qty: 6, cost: 55000, date: '2024-02-18' },
  { id: 'MBI-0005', painter: 'Saharsa Mithila Art Centre', ware: 'Madhubani Katchni Line Art Panel', status: 'Dry Storage 18-30C', qty: 10, cost: 35000, date: '2024-03-02' },
  { id: 'MBI-0006', painter: 'Madhubani Town Folk Artists', ware: 'Mithila Godna Tattoo Art Painting', status: 'Natural Dye Colourfastness QC', qty: 7, cost: 48000, date: '2024-03-15' },
  { id: 'MBI-0007', painter: 'Laukahi Village Painting Colony', ware: 'Madhubani Tantric Yantra Canvas', status: 'GI Madhubani Painting Mark', qty: 4, cost: 72000, date: '2024-03-28' },
  { id: 'MBI-0008', painter: 'Benipatti Mithila Craft Studio', ware: 'Bihar Mithila Peacock Courtship Panel', status: 'IS 16921 Mithila Art Grade A', qty: 15, cost: 18000, date: '2024-04-10' },
  { id: 'MBI-0009', painter: 'Madhubani Traditional Art Guild', ware: 'Bihar Mithila Tree of Life', status: 'Hardboard Case with Bubble Wrap', qty: 9, cost: 38000, date: '2024-04-22' },
  { id: 'MBI-0010', painter: 'Jitwarpur Mithila Painters Society', ware: 'Madhubani Kohbar Vivah Panel', status: 'Enclosed Truck Transit', qty: 6, cost: 62000, date: '2024-05-05' },
  { id: 'MBI-0011', painter: 'Ranti Village Art Cooperative', ware: 'Madhubani Sun God Surya Painting', status: 'Dry Storage 18-30C', qty: 11, cost: 30000, date: '2024-05-18' },
  { id: 'MBI-0012', painter: 'Darbhanga Heritage Painters', ware: 'Bihar Bharni Style Fish Motif', status: 'Natural Dye Colourfastness QC', qty: 8, cost: 52000, date: '2024-05-30' },
  { id: 'MBI-0013', painter: 'Saharsa Mithila Art Centre', ware: 'Madhubani Katchni Line Art Panel', status: 'GI Madhubani Painting Mark', qty: 14, cost: 22000, date: '2024-06-12' },
  { id: 'MBI-0014', painter: 'Madhubani Town Folk Artists', ware: 'Mithila Godna Tattoo Art Painting', status: 'IS 16921 Mithila Art Grade A', qty: 5, cost: 70000, date: '2024-06-25' },
  { id: 'MBI-0015', painter: 'Laukahi Village Painting Colony', ware: 'Madhubani Tantric Yantra Canvas', status: 'Hardboard Case with Bubble Wrap', qty: 18, cost: 15000, date: '2024-07-08' },
  { id: 'MBI-0016', painter: 'Benipatti Mithila Craft Studio', ware: 'Bihar Mithila Peacock Courtship Panel', status: 'Enclosed Truck Transit', qty: 7, cost: 58000, date: '2024-07-20' },
  { id: 'MBI-0017', painter: 'Madhubani Traditional Art Guild', ware: 'Mithila Godna Tattoo Art Painting', status: 'Dry Storage 18-30C', qty: 10, cost: 40000, date: '2024-08-01' },
  { id: 'MBI-0018', painter: 'Jitwarpur Mithila Painters Society', ware: 'Madhubani Sun God Surya Painting', status: 'Natural Dye Colourfastness QC', qty: 3, cost: 75000, date: '2024-08-12' },
  { id: 'MBI-0019', painter: 'Ranti Village Art Cooperative', ware: 'Bihar Mithila Tree of Life', status: 'GI Madhubani Painting Mark', qty: 8, cost: 45000, date: '2024-08-24' },
  { id: 'MBI-0020', painter: 'Darbhanga Heritage Painters', ware: 'Madhubani Kohbar Vivah Panel', status: 'IS 16921 Mithila Art Grade A', qty: 6, cost: 68000, date: '2024-09-05' },
]

export default function MadhubaniPaintingBiharLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...madhubaniRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'painter', label: 'Painter', options: PAINTERS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.painter === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(10, 42, allRecords.length * 0.22 + i * 7) }))
  const painterChart = PAINTERS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.painter === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="mbi-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Madhubani Painting Bihar' }]} />
      <PageHeader title="Madhubani Painting Bihar Logistics" description="Madhubani painting supply chain with IS 16921 Mithila art compliance, natural dye colourfastness QC, hardboard case bubble wrap packaging, and GI Madhubani Painting Mark certification across 8 heritage artisan clusters in Madhubani, Darbhanga, and Saharsa districts" />
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
            <KpiTile label="Painter Clusters" value={PAINTERS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={95} />
            <HealthRing label="IS 16921" value={90} />
            <HealthRing label="Bubble" value={88} />
            <HealthRing label="Truck" value={83} />
            <HealthRing label="Storage" value={91} />
            <HealthRing label="Dye" value={94} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="2,500+" />
            <ValueTile label="Mithila Tradition" value="Since 7th C BCE" />
            <ValueTile label="Export Markets" value="30 Countries" />
            <ValueTile label="Annual Revenue" value="₹42 Crore" />
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
            placeholder="Search Madhubani painting shipments..."
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
              <CardHeader><CardTitle>Madhubani Painting — 3,000-Year Mithila Civilisation Art Tradition</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Madhubani painting is one of the oldest surviving art traditions in the world, originating in the ancient Mithila region of what is now northern Bihar state, with documented artistic continuity stretching back over three millennia to the seventh century BCE when the tradition was first referenced in classical Sanskrit literature describing the elaborate wall paintings and floor decorations created by women of the Mithila kingdom during marriage ceremonies, religious festivals, and royal court celebrations that defined the cultural life of this remarkably sophisticated ancient Indian civilisation. The tradition is believed to have been formally codified during the reign of King Janaka, the father of Sita from the Ramayana epic, whose royal court at ancient Mithila (near modern Janakpur in Nepal and Darbhanga in Bihar) was renowned as a centre of artistic and intellectual excellence where the finest painters and scholars of the ancient world were gathered under royal patronage to create the magnificent wall paintings and manuscript illustrations that established the foundational aesthetic vocabulary of the Madhubani tradition that persists with remarkable continuity to the present day. The Madhubani painting tradition encompasses five distinct stylistic sub-schools each associated with specific social communities and artistic purposes within the Mithila cultural context: the Bharni style characterised by bold filled shapes and vibrant colour blocking used primarily by Brahmin women for religious and ceremonial wall paintings, the Katchni style distinguished by fine hatched line patterns and minimal colour using primarily black ink on cream backgrounds favoured by Kayastha community artists for depicting intricate narrative scenes, the Tantrik style reserved for esoteric and spiritual themes featuring bold geometric patterns and mystical symbols associated with Shakta and Shaivite tantric traditions, the Godna style inspired by traditional Mithila tattoo art adapted to painted format featuring repetitive body art motifs transferred from skin to canvas, and the Modern style that incorporates contemporary themes and experimental techniques while maintaining the fundamental Madhubani aesthetic principles of bold outlines, flat perspective, and densely packed narrative compositions. Today approximately 2,500 artisan families across eight heritage clusters in Madhubani district, Darbhanga, Saharsa, and surrounding villages sustain this extraordinary tradition, with an estimated 42 crore rupees annual revenue driven by growing international demand from museums, art collectors, and lifestyle brands who recognise Madhubani painting as a UNESCO Intangible Cultural Heritage tradition worthy of preservation and promotion on the global cultural stage.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16921 Mithila Art Standards & Natural Dye Colourfastness QC</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">The IS 16921 standard for Madhubani painting establishes India's first dedicated quality certification framework for this ancient Mithila civilisation art tradition, specifying requirements for authentic natural dye usage, traditional painting technique execution, substrate quality standards, and colour fastness performance that collectively distinguish genuine Madhubani work from mass-produced printed reproductions and non-authentic painted imitations produced using synthetic colours and mechanical techniques that cannot replicate the authentic handmade character and natural dye aesthetics of certified Madhubani art. The standard mandates the use of exclusively natural and traditionally prepared colour materials for Grade A certification: black pigment derived from kajal soot mixed with cow dung or rice paste, yellow from haldi turmeric powder or peeli mitti yellow earth, red from geru red ochre or kumkum vermilion prepared from traditional mineral sources, green from peeli mitti mixed with mehndi henna leaf paste, blue from neel indigo fermented from Indigofera tinctoria plant material, white from rice paste or khadiya chalk, and orange from a mixture of haldi and geru pigments following specific traditional recipes documented in the Madhubani painting artisan knowledge base maintained by the National Handicrafts Development Corporation. Substrate requirements for Grade A Madhubani certification mandate handmade paper with minimum 180 GSM grammage and pH range between 6.5 and 7.5, or traditional hand-pressed cotton fabric treated with cow dung wash and sun-bleached following traditional Mithila fabric preparation techniques, or specially prepared wall surfaces using multani mitti Fuller's earth base coat with rice starch sizing layer providing a smooth absorbent painting surface that replicates the traditional mud-and-cow-dung wall preparation method used for authentic ceremonial Madhubani wall paintings. Colour fastness requirements for IS 16921 Grade A certification mandate minimum rating of 4 on the ISO 105-C06 wash fastness scale ensuring natural dye colours maintain their intensity through normal handling and display conditions, minimum rating of 5 on the ISO 105-B02 light fastness scale ensuring the natural pigments resist fading under standard gallery and museum lighting conditions for periods exceeding 25 years without significant colour degradation, and minimum rating of 4 on the ISO 105-X12 rub fastness scale verifying the painted surface resists smudging and pigment transfer during handling, framing, and installation procedures that certified Madhubani paintings undergo throughout their commercial lifecycle from artisan workshop to gallery exhibition and ultimately to collector installation.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Hardboard Case Bubble Wrap Packaging for Madhubani Paintings</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Hardboard case packaging with bubble wrap cushioning has been specifically designed for Madhubani paintings to protect the delicate natural pigment surfaces, traditional handmade paper or cotton substrates, and fine brushwork details from the physical and environmental damage risks encountered during transit from Bihar artisan village workshops to domestic art galleries, government handicraft emporiums across India, and international export destinations spanning over thirty countries that currently import certified Madhubani paintings for museum collections, boutique retail, and private art collector markets worldwide. Each individual Madhubani painting undergoes a careful preparation sequence before packaging: first inspected under natural daylight to verify pigment surface integrity and detect any areas of natural dye lifting, cracking, or insect damage that could worsen during transit, then interleaved with acid-free tissue paper sheets separating any multi-panel or multi-layer works, before being wrapped in a minimum 10-millimetre thick polyethylene bubble wrap sheet providing point-impact cushioning rated to absorb impacts from 60-centimetre drops onto hard surfaces without transmitting damaging compression forces to the enclosed painting surface. The bubble-wrapped painting is secured within a custom-built hardboard case constructed from 5-millimetre high-density fibreboard with reinforced corner protectors and internal cushioning pads of 20-millimetre closed-cell polyethylene foam lining all four interior surfaces, creating a protective envelope that maintains the painting in a flat, undisturbed position throughout transit operations regardless of stacking pressure, vehicle vibration, or handling orientation changes that occur during multi-modal transportation from Bihar artisan workshops through road, rail, and air cargo networks. Moisture barrier protection is achieved through inclusion of waterproof polyethylene inner liner bags sealed around the bubble-wrapped painting within the hardboard case, supplemented by silica gel desiccant packets rated for 80 gram absorption capacity that maintain relative humidity below 45% during transit, critical for protecting the natural dye pigments used in authentic Madhubani painting which can exhibit colour instability under high humidity conditions particularly during the monsoon season that affects Bihar and transit corridor regions from June through September when ambient humidity routinely exceeds 85% in the Gangetic plain climate zone.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Motif Pattern Verification & Madhubani Global Market Expansion</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and machine learning technologies are now being deployed to authenticate and quality-grade Madhubani paintings, addressing the growing challenge of mass-produced digital printed reproductions and machine-painted imitations that have increasingly infiltrated both domestic Indian retail markets and international e-commerce platforms, undermining the market positioning and premium pricing power of genuine handmade Madhubani paintings produced by certified artisan families in the Bihar heritage clusters. The AI authentication system employs ultra-high-resolution digital scanning at 8,000 dots per inch to capture every brush stroke, pigment texture, and compositional detail of finished Madhubani paintings, analysing over 400 distinctive feature parameters including brush stroke direction variance, pigment particle distribution patterns characteristic of hand-ground natural dyes, compositional symmetry alignment within the traditional Madhubani geometric framework, line weight variation patterns consistent with hand-drawn bamboo stick brushes, and colour hue consistency within the natural dye spectral range documented through extensive laboratory spectrophotometry of authenticated Madhubani painting samples spanning all five sub-schools and eight heritage cluster production centres. Machine learning classification algorithms trained on a comprehensive reference dataset of over 22,000 authenticated Madhubani paintings can distinguish genuine hand-painted works from printed reproductions and machine-painted imitations with 99.5% accuracy by detecting subtle material and technique signatures invisible to human visual inspection, including the microscopic brush hair texture patterns left by traditional bamboo stick and cotton wrapped brushes, the natural variation in hand-ground pigment particle sizes that creates the characteristic matte surface finish of authentic Madhubani paintings, and the slight compositional irregularities inherent in hand-executed works that represent the authentic artistic character valued by knowledgeable collectors and museum curators. The Bihar State Handicrafts Development Corporation has integrated this AI verification into its GI certification pipeline for Madhubani paintings, reducing the rejection rate of non-authentic works at government emporium quality checkpoints from an estimated 18% to under 2% since implementation, while simultaneously reducing the authentication processing time from 20 working days to under 36 hours for qualifying pieces, enabling Bihar's Madhubani painting artisan community to respond more rapidly to international market demand and maintain competitive positioning against lower-cost imitation products from overseas manufacturing sources.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
