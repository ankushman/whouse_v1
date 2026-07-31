import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#1e1b4b', '#312e81', '#4338ca', '#6366f1', '#a5b4fc', '#1e1a4b', '#0f0e2a', '#eef2ff']
const PRODUCTS = ['Srikalahasti Tree of Life Panel', 'Machilipatnam Mythological Scroll', 'Ramayana Block Print Yard', 'Aranya Nature Motif Saree', 'Bhagavata Purana Hanging', 'Panchatantra Story Panel', 'Dashavatara Kalamkari Mural', 'Kalamkari Temple Canopy']
const ARTISTS = ['Srikalahasti Pen Art Guild', 'Machilipatnam Block Studio', 'Pedana Kalamkari Centre', 'Tirupati Temple Art Unit', 'Nellore Hand-Paint Cluster', 'Rajahmundry Pen Art Studio', 'Kakinada Textile Hub', 'Eluru Natural Dye Unit']
const STATUSES = ['GI Kalamkari Craft Mark', 'IS 16794 Textile Print Grade A', 'Acid-Free Tissue Roll', 'Humidity-Controlled Truck', 'Dark Dry Storage 18-22C', 'Dye Colourfast QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="kpa-badge inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="kpa-status inline-block px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="kpa-costbar w-full bg-indigo-100 rounded h-2"><div className="bg-indigo-700 h-2 rounded" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ value, label, size = 64 }: { value: number; label: string; size?: number }) => {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return (
    <div className="kpa-health-ring flex flex-col items-center">
      <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e1b4b" strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} /></svg>
      <span className="text-xs font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}

const KpiTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <Card className="kpa-kpi"><CardContent className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{icon}</span><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[0] }}>{value}</p></div></div></CardContent></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="kpa-value"><CardContent className="p-4"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-semibold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)

const genRecords = (startIdx: number) => Array.from({ length: 20 }, (_, i) => {
  const idx = startIdx + i
  const units = ['pcs', 'm', 'yards', 'panels']
  return {
    id: `KPA-${String(idx).padStart(4, '0')}`, product: PRODUCTS[idx % 8], artist: ARTISTS[idx % 8],
    status: STATUSES[idx % 6], qty: ri(3, 50, 5 + idx * 2), unit: units[idx % 4],
    cost: ri(8000, 250000, 12000 + idx * 12000), date: `2025-07-${String(ri(1, 28, idx % 28 + 1)).padStart(2, '0')}`,
  }
})

const kalamkariRecords = [
  { id: 'KPA-0001', product: 'Srikalahasti Tree of Life Panel', artist: 'Srikalahasti Pen Art Guild', status: 'GI Kalamkari Craft Mark', qty: 5, unit: 'pcs', cost: 35000, date: '2025-07-02' },
  { id: 'KPA-0002', product: 'Machilipatnam Mythological Scroll', artist: 'Machilipatnam Block Studio', status: 'IS 16794 Textile Print Grade A', qty: 18, unit: 'm', cost: 72000, date: '2025-07-04' },
  { id: 'KPA-0003', product: 'Ramayana Block Print Yard', artist: 'Pedana Kalamkari Centre', status: 'Acid-Free Tissue Roll', qty: 12, unit: 'yards', cost: 48000, date: '2025-07-05' },
  { id: 'KPA-0004', product: 'Aranya Nature Motif Saree', artist: 'Tirupati Temple Art Unit', status: 'Humidity-Controlled Truck', qty: 25, unit: 'panels', cost: 125000, date: '2025-07-07' },
  { id: 'KPA-0005', product: 'Bhagavata Purana Hanging', artist: 'Nellore Hand-Paint Cluster', status: 'Dark Dry Storage 18-22C', qty: 3, unit: 'pcs', cost: 180000, date: '2025-07-08' },
  { id: 'KPA-0006', product: 'Panchatantra Story Panel', artist: 'Rajahmundry Pen Art Studio', status: 'Dye Colourfast QC', qty: 15, unit: 'm', cost: 65000, date: '2025-07-10' },
  { id: 'KPA-0007', product: 'Dashavatara Kalamkari Mural', artist: 'Kakinada Textile Hub', status: 'GI Kalamkari Craft Mark', qty: 8, unit: 'yards', cost: 95000, date: '2025-07-11' },
  { id: 'KPA-0008', product: 'Kalamkari Temple Canopy', artist: 'Eluru Natural Dye Unit', status: 'IS 16794 Textile Print Grade A', qty: 4, unit: 'panels', cost: 210000, date: '2025-07-13' },
  { id: 'KPA-0009', product: 'Srikalahasti Tree of Life Panel', artist: 'Srikalahasti Pen Art Guild', status: 'Acid-Free Tissue Roll', qty: 20, unit: 'pcs', cost: 28000, date: '2025-07-14' },
  { id: 'KPA-0010', product: 'Machilipatnam Mythological Scroll', artist: 'Machilipatnam Block Studio', status: 'Humidity-Controlled Truck', qty: 30, unit: 'm', cost: 88000, date: '2025-07-15' },
  { id: 'KPA-0011', product: 'Ramayana Block Print Yard', artist: 'Pedana Kalamkari Centre', status: 'Dark Dry Storage 18-22C', qty: 10, unit: 'yards', cost: 55000, date: '2025-07-16' },
  { id: 'KPA-0012', product: 'Aranya Nature Motif Saree', artist: 'Tirupati Temple Art Unit', status: 'Dye Colourfast QC', qty: 35, unit: 'panels', cost: 145000, date: '2025-07-17' },
  { id: 'KPA-0013', product: 'Bhagavata Purana Hanging', artist: 'Nellore Hand-Paint Cluster', status: 'GI Kalamkari Craft Mark', qty: 6, unit: 'pcs', cost: 195000, date: '2025-07-18' },
  { id: 'KPA-0014', product: 'Panchatantra Story Panel', artist: 'Rajahmundry Pen Art Studio', status: 'IS 16794 Textile Print Grade A', qty: 22, unit: 'm', cost: 78000, date: '2025-07-19' },
  { id: 'KPA-0015', product: 'Dashavatara Kalamkari Mural', artist: 'Kakinada Textile Hub', status: 'Acid-Free Tissue Roll', qty: 7, unit: 'yards', cost: 88000, date: '2025-07-20' },
  { id: 'KPA-0016', product: 'Kalamkari Temple Canopy', artist: 'Eluru Natural Dye Unit', status: 'Humidity-Controlled Truck', qty: 4, unit: 'panels', cost: 240000, date: '2025-07-21' },
  { id: 'KPA-0017', product: 'Srikalahasti Tree of Life Panel', artist: 'Srikalahasti Pen Art Guild', status: 'Dark Dry Storage 18-22C', qty: 14, unit: 'pcs', cost: 42000, date: '2025-07-22' },
  { id: 'KPA-0018', product: 'Machilipatnam Mythological Scroll', artist: 'Machilipatnam Block Studio', status: 'Dye Colourfast QC', qty: 28, unit: 'm', cost: 96000, date: '2025-07-23' },
  { id: 'KPA-0019', product: 'Ramayana Block Print Yard', artist: 'Pedana Kalamkari Centre', status: 'GI Kalamkari Craft Mark', qty: 16, unit: 'yards', cost: 62000, date: '2025-07-24' },
  { id: 'KPA-0020', product: 'Aranya Nature Motif Saree', artist: 'Tirupati Temple Art Unit', status: 'IS 16794 Textile Print Grade A', qty: 40, unit: 'panels', cost: 168000, date: '2025-07-25' },
]

export default function KalamkariPenArtLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...kalamkariRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.product.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string))
    })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'product', label: 'Product', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.product === p).length })) },
    { key: 'artist', label: 'Artist', options: ARTISTS.map(a => ({ value: a, label: a, count: allRecords.filter(r => r.artist === a).length })) },
  ]

  const trendData = PRODUCTS.slice(0, 6).map((p, i) => ({ name: p.split(' ').slice(0, 2).join(' '), shipments: 4 + i * 3, cost: 80000 + i * 65000 }))
  const artistChart = ARTISTS.slice(0, 6).map((a, i) => ({ name: a.split(' ').slice(0, 2).join(' '), volume: 15 + i * 8, revenue: 10 + i * 5 }))
  const statusPie = STATUSES.map((s, i) => ({ name: s.split(' ').slice(0, 2).join(' '), value: 5 + i * 4 }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="kpa-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Kalamkari Pen Art' }]} />
      <PageHeader title="Kalamkari Pen Art Logistics" description="Track Andhra Pradesh's 3,000-year kalamkari pen-work tradition from Srikalahasti and Machilipatnam through vegetable dye preparation, hand-painting, GI-tagged quality certification, and light-sensitive packaging for heritage textile export markets" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-indigo-50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile icon="🎨" label="Total Panels" value={String(allRecords.length)} />
            <KpiTile icon="🏭" label="Artist Clusters" value={String(ARTISTS.length)} />
            <KpiTile icon="💰" label="Total Value" value={`₹${(allRecords.reduce((a, r) => a + r.cost, 0) / 10000000).toFixed(2)}Cr`} />
            <KpiTile icon="📈" label="Avg Panel" value={`₹${Math.round(allRecords.reduce((a, r) => a + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>

          <Card className="kpa-health-grid">
            <CardHeader><CardTitle>Quality Compliance</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <HealthRing value={96} label="GI Tag" />
                <HealthRing value={92} label="IS 16794" />
                <HealthRing value={88} label="Acid-Free" />
                <HealthRing value={81} label="HC Truck" />
                <HealthRing value={90} label="Dark Store" />
                <HealthRing value={94} label="Dye QC" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="5,000+" />
            <ValueTile label="Annual Production" value="8 Lakh m" />
            <ValueTile label="Export Markets" value="35 Countries" />
            <ValueTile label="Heritage Age" value="3,000 Years" />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearSearch={() => setSearchQuery('')}
            activeFilters={activeFilters}
            filterGroups={filterGroups}
            onToggleFilter={(key, value) => setActiveFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter((v: string) => v !== value) : [...(p[key] || []), value] }))}
            onClearAllFilters={() => setActiveFilters({})}
            totalItems={allRecords.length}
            filteredCount={filteredRecords.length}
            onRefresh={() => {}}
            placeholder="Search by ID, product, or artist..."
          />

          <Card className="kpa-table-card">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-indigo-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-left">Artist</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Cost</th>
                    <th className="p-3 text-left">Cost Bar</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.slice(0, 15).map(r => (
                    <tr key={r.id} className="border-b hover:bg-indigo-50/50">
                      <td className="p-3 font-mono text-xs">{r.id}</td>
                      <td className="p-3"><ProductBadge name={r.product} /></td>
                      <td className="p-3 text-xs">{r.artist}</td>
                      <td className="p-3"><StatusBadge status={r.status} /></td>
                      <td className="p-3 text-right">{r.qty} {r.unit}</td>
                      <td className="p-3 text-right">₹{r.cost.toLocaleString()}</td>
                      <td className="p-3 w-28"><CostBar cost={r.cost} max={maxCost} /></td>
                      <td className="p-3 text-xs text-gray-500">{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Shipment Trend</CardTitle></CardHeader>
              <CardContent>
                <LineChart width={500} height={250} data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="shipments" stroke={COLORS[0]} strokeWidth={2} />
                  <Line type="monotone" dataKey="cost" stroke={COLORS[3]} strokeWidth={2} />
                </LineChart>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Artist Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={250} data={artistChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={10} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]} />
                  <Bar dataKey="revenue" fill={COLORS[3]} />
                </BarChart>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Status Distribution</CardTitle></CardHeader>
            <CardContent>
              <PieChart width={500} height={300}>
                <Pie data={statusPie} cx={200} cy={150} outerRadius={100} dataKey="value" label>
                  {statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="kpa-insight"><CardHeader><CardTitle>Srikalahasti — India's 3,000-Year Pen Art Tradition</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Srikalahasti in Andhra Pradesh's Tirupati district is the birthplace of kalamkari (pen-work), one of India's oldest textile art forms dating to 3,000 years when temple painters narrated Hindu epics on fabric using a bamboo pen (kalam) dipped in fermented vegetable dyes. Two distinct traditions exist: Srikalahasti style uses freehand pen drawing depicting mythological scenes from Ramayana, Mahabharata, and Bhagavata Purana on cotton fabric; Machilipatnam style combines hand-block printing with pen detailing for repetitive patterns. GI-tagged Kalamkari was registered in 2010 covering both traditions. The craft supports 5,000 artisan families across Srikalahasti, Machilipatnam, Pedana, and Tirupati clusters. Annual production reaches 8 lakh metres of kalamkari fabric valued at Rs 180 crore with exports to 35 countries including USA, UK, Japan, and Australia. UNESCO listed kalamkari among India's Intangible Cultural Heritage in 2023.</p></CardContent></Card>
            <Card className="kpa-insight"><CardHeader><CardTitle>IS 16794 Textile Print &amp; Vegetable Dye Standards</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">IS 16794 covers hand-printed and pen-drawn textile quality including colour fastness to washing (minimum Grade 4 on ISO 105-C06), light fastness (minimum Grade 5 on ISO 105-B02 for vegetable-dyed textiles), and rubbing fastness (minimum Grade 3 dry, Grade 2 wet on ISO 105-X12). Vegetable dye preparation requires minimum 72-hour fermentation for alizarin red (from madder root, Rubia tinctorum), 48-hour oxidation for indigo blue (from Indigofera tinctoria), and 24-hour boiling for myrobalan yellow (from Terminalia chebula). Fabric base is 100% cotton handloom with thread count 60-80 counts for panel-grade and 80-120 counts for saree-grade. pH of finished fabric must be 5.5-7.0 to prevent skin irritation. Heavy metal content below 50 ppm for lead, 25 ppm for cadmium, and 10 ppm for arsenic per IS 16474 eco-textile standard. Tensile strength minimum 180 N in warp and 140 N in weft direction.</p></CardContent></Card>
            <Card className="kpa-insight"><CardHeader><CardTitle>Light-Sensitive Artwork Packaging &amp; Transport</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Kalamkari artwork uses natural vegetable dyes extremely sensitive to UV light and humidity. Acid-free tissue paper (pH 7.5-8.5, lignin-free) wrapping prevents dye migration during 48-72 hour transit. Each panel is rolled on acid-free cardboard tube (diameter 5cm) with outer polyester protective sleeve. From Srikalahasti to Chennai port (380 km) takes 8-9 hours via NH16 in humidity-controlled trucks maintaining 18-22 degrees Celsius and 40-50% relative humidity. Storage must be in dark, dry conditions (below 200 lux light) to prevent indigo blue and alizarin red from fading. Exposure to direct sunlight for 4+ hours causes irreversible colour degradation. Damage rate reduced from 18% to 3% under AP Handicrafts Export Promotion packaging programme since 2019, covering 2,500 artisans across Chittoor, Krishna, and East Godavari districts.</p></CardContent></Card>
            <Card className="kpa-insight"><CardHeader><CardTitle>AI Motif Digitisation &amp; Heritage Textile Market</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">AI-powered digital scanning of heritage kalamkari motifs creates production-ready block templates in 4 hours versus 15 days for hand-carved teak blocks, while machine learning classifies dye colour accuracy from spectrophotometer readings at 97% precision. Automated pattern matching detects counterfeit machine-printed kalamkari with 91% accuracy by analysing brush stroke irregularities unique to hand-drawn art. India's kalamkari export grew 220% from Rs 42 crore (2019) to Rs 135 crore (2025), targeting Rs 300 crore by 2028. International fashion houses (Gucci, Alexander McQueen) source Srikalahasti panels for luxury collections priced at $800-5,000 per metre. Online platforms account for 45% of new export orders with USA (35%), UK (20%), and Japan (15%) as top buyers. Blockchain provenance from dye preparation to finished artwork combats machine-printed fakes estimated at Rs 50 crore annually.</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
