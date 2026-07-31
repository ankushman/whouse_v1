import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#78350f', '#92400e', '#a16207', '#ca8a04', '#eab308', '#451a03', '#713f12', '#fef08a']
const PRODUCTS = ['Molela Terracotta Devi Panel', 'Molela Clay Horse Figure', 'Molela Terracotta Elephant Idol', 'Molela Clay Village Scene Relief', 'Molela Terracotta Snake Spiral', 'Molela Clay Sun God Plaque', 'Molela Terracotta Bullock Cart Toy', 'Molela Clay Tree of Life Panel']
const ARTISANS = ['Molela Terracotta Artisan Guild RJ', 'Udaipur Clay Craft Society', 'Rajsamand Murtikar Colony RJ', 'Nathdwara Terracotta Cluster', 'Kumbhalgarh Clay Workers RJ', 'Chittorgarh Terracotta Cooperative', 'Bhilwara Clay Mould Society RJ', 'Bali Terracotta Artisan Centre RJ']
const STATUSES = ['GI Rajasthan Terracotta Mark', 'IS 16795 Molela Clay Grade A', 'Foam Wrap Corrugated Box', 'Palletised Truck Transit', 'Dry Storage 20-30C', 'Clay Firing Strength QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-yellow-200 rounded-full overflow-hidden"><div className="h-full bg-yellow-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fef08a" strokeWidth="6" />
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
    id: `MTR-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 22, ((offset + i) * 21) % 22) + 1,
    cost: ri(3500, 68000, ((offset + i) * 11111) % 64500) + 3500,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const molelaRecords = [
  { id: 'MTR-0001', painter: 'Molela Terracotta Artisan Guild RJ', ware: 'Molela Terracotta Devi Panel', status: 'GI Rajasthan Terracotta Mark', qty: 3, cost: 62000, date: '2024-01-16' },
  { id: 'MTR-0002', painter: 'Udaipur Clay Craft Society', ware: 'Molela Clay Horse Figure', status: 'IS 16795 Molela Clay Grade A', qty: 5, cost: 38000, date: '2024-01-29' },
  { id: 'MTR-0003', painter: 'Rajsamand Murtikar Colony RJ', ware: 'Molela Terracotta Elephant Idol', status: 'Foam Wrap Corrugated Box', qty: 2, cost: 68000, date: '2024-02-11' },
  { id: 'MTR-0004', painter: 'Nathdwara Terracotta Cluster', ware: 'Molela Clay Village Scene Relief', status: 'Palletised Truck Transit', qty: 4, cost: 48000, date: '2024-02-23' },
  { id: 'MTR-0005', painter: 'Kumbhalgarh Clay Workers RJ', ware: 'Molela Terracotta Snake Spiral', status: 'Dry Storage 20-30C', qty: 6, cost: 24000, date: '2024-03-08' },
  { id: 'MTR-0006', painter: 'Chittorgarh Terracotta Cooperative', ware: 'Molela Clay Sun God Plaque', status: 'Clay Firing Strength QC', qty: 3, cost: 52000, date: '2024-03-21' },
  { id: 'MTR-0007', painter: 'Bhilwara Clay Mould Society RJ', ware: 'Molela Terracotta Bullock Cart Toy', status: 'GI Rajasthan Terracotta Mark', qty: 4, cost: 44000, date: '2024-04-03' },
  { id: 'MTR-0008', painter: 'Bali Terracotta Artisan Centre RJ', ware: 'Molela Clay Tree of Life Panel', status: 'IS 16795 Molela Clay Grade A', qty: 2, cost: 66000, date: '2024-04-16' },
  { id: 'MTR-0009', painter: 'Molela Terracotta Artisan Guild RJ', ware: 'Molela Clay Horse Figure', status: 'Foam Wrap Corrugated Box', qty: 5, cost: 34000, date: '2024-04-29' },
  { id: 'MTR-0010', painter: 'Udaipur Clay Craft Society', ware: 'Molela Terracotta Devi Panel', status: 'Palletised Truck Transit', qty: 3, cost: 60000, date: '2024-05-11' },
  { id: 'MTR-0011', painter: 'Rajsamand Murtikar Colony RJ', ware: 'Molela Terracotta Elephant Idol', status: 'Dry Storage 20-30C', qty: 6, cost: 28000, date: '2024-05-23' },
  { id: 'MTR-0012', painter: 'Nathdwara Terracotta Cluster', ware: 'Molela Clay Village Scene Relief', status: 'Clay Firing Strength QC', qty: 2, cost: 70000, date: '2024-06-05' },
  { id: 'MTR-0013', painter: 'Kumbhalgarh Clay Workers RJ', ware: 'Molela Terracotta Snake Spiral', status: 'GI Rajasthan Terracotta Mark', qty: 4, cost: 40000, date: '2024-06-17' },
  { id: 'MTR-0014', painter: 'Chittorgarh Terracotta Cooperative', ware: 'Molela Clay Sun God Plaque', status: 'IS 16795 Molela Clay Grade A', qty: 3, cost: 56000, date: '2024-06-29' },
  { id: 'MTR-0015', painter: 'Bhilwara Clay Mould Society RJ', ware: 'Molela Terracotta Bullock Cart Toy', status: 'Foam Wrap Corrugated Box', qty: 5, cost: 32000, date: '2024-07-11' },
  { id: 'MTR-0016', painter: 'Bali Terracotta Artisan Centre RJ', ware: 'Molela Clay Tree of Life Panel', status: 'Palletised Truck Transit', qty: 2, cost: 64000, date: '2024-07-23' },
  { id: 'MTR-0017', painter: 'Molela Terracotta Artisan Guild RJ', ware: 'Molela Terracotta Devi Panel', status: 'Dry Storage 20-30C', qty: 3, cost: 58000, date: '2024-08-05' },
  { id: 'MTR-0018', painter: 'Udaipur Clay Craft Society', ware: 'Molela Clay Horse Figure', status: 'Clay Firing Strength QC', qty: 4, cost: 36000, date: '2024-08-17' },
  { id: 'MTR-0019', painter: 'Rajsamand Murtikar Colony RJ', ware: 'Molela Terracotta Elephant Idol', status: 'GI Rajasthan Terracotta Mark', qty: 6, cost: 22000, date: '2024-08-29' },
  { id: 'MTR-0020', painter: 'Nathdwara Terracotta Cluster', ware: 'Molela Clay Village Scene Relief', status: 'IS 16795 Molela Clay Grade A', qty: 2, cost: 68000, date: '2024-09-10' },
]

export default function MolelaTerracottaRajasthanLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...molelaRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'painter', label: 'Painter', options: ARTISANS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.painter === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(4, 22, allRecords.length * 0.10 + i * 3) }))
  const artisanChart = ARTISANS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.painter === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="mol-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Molela Terracotta RJ' }]} />
      <PageHeader title="Molela Terracotta Rajasthan Logistics" description="Rajasthan Molela terracotta clay craft and deity panel supply chain with IS 16795 certification, clay firing strength QC, foam wrap corrugated box packaging, and GI Rajasthan Terracotta Mark across 8 artisan communities in Udaipur, Rajsamand, and Nathdwara" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-yellow-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Shipments" value={allRecords.length} />
            <KpiTile label="Active Ware" value={PRODUCTS.length} />
            <KpiTile label="Clay Clusters" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={95} />
            <HealthRing label="IS 16795" value={87} />
            <HealthRing label="Foam" value={83} />
            <HealthRing label="Truck" value={78} />
            <HealthRing label="Dry" value={85} />
            <HealthRing label="Firing" value={91} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="35+" />
            <ValueTile label="Tradition" value="Since 7th C" />
            <ValueTile label="Export Markets" value="5 Countries" />
            <ValueTile label="Annual Revenue" value="₹2.4 Crore" />
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
            placeholder="Search Molela terracotta shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-yellow-100">
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
                  <tr key={record.id} className="border-t hover:bg-yellow-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.ware} /></td>
                    <td className="p-3">{record.painter}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['pcs', 'sets', 'units', 'pairs'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Molela Terracotta — 1300-Year Rajasthan Mewar Region Clay Craft Heritage</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Molela terracotta craft represents one of the most ancient and culturally significant clay art traditions of the Indian subcontinent, having been continuously practised for over thirteen centuries by the traditional Kumhar potter communities of the Molela village in the Rajsamand district of Rajasthan and the surrounding Mewar region artisan clusters in Udaipur, Nathdwara, Kumbhalgarh, Chittorgarh, and Bhilwara districts where hereditary Terrakarta artisan families create extraordinary terracotta clay relief panels and freestanding clay figures depicting Hindu deities including Devi Durga in her nine Durga forms, local folk deities of the Mewar region, and village life scenes using a distinctive hand-moulded clay relief technique that has remained substantially unchanged since the seventh century CE when the Molela terracotta tradition was first documented in the historical records of the Mewar kingdom that governed the region as an independent Rajput princely state for over fourteen centuries until its merger with the Indian Union in 1949. The Molela terracotta tradition is distinguished from all other Indian clay craft traditions by the extraordinary specificity of its religious narrative relief panels where the Molela artisans create large-format terracotta plaque panels depicting complete mythological narratives including the Durga Saptashati seven hundred verse Devi narrative cycle rendered as continuous narrative relief panels measuring up to 1.5 metres in height and 2 metres in width where multiple scenes from the Devi mythology are arranged in a narrative sequence across the panel surface creating a comprehensive visual retelling of the sacred text in fired clay that serves as both a devotional object for household worship and a narrative teaching aid for transmitting the Devi mythology across generations of the Mewar region communities. The raw material foundation of the Molela terracotta tradition is the exceptionally fine-grained red alluvial clay obtained from specific clay deposits in the Molela and Gogunda regions of Rajsamand district where the traditional Kumhar potter families hold hereditary rights to excavate clay from designated clay pits that have been continuously worked by the same artisan families for over twenty generations providing a consistent raw material supply of clay with specific plasticity, firing temperature range, iron oxide content, and post-firing colour characteristics that are uniquely suited to the Molela terracotta relief technique where the fine clay particle size enables the creation of intricate surface detail in the hand-moulded relief work while the natural iron oxide content produces the distinctive deep red to orange fired colour that characterises authentic Molela terracotta products distinguishing them from terracotta products produced using clay from other regions that produce different fired colours and texture characteristics. The traditional Molela firing technique employs open-pit kiln firing at temperatures between 800 and 900 degrees Celsius where the dried clay panels are carefully arranged in the firing pit with charcoal fuel distributed evenly around the panels and the firing temperature controlled through the skillful management of fuel addition and air flow by the experienced kiln master who monitors the firing process through visual observation of the kiln gases and flame colour to achieve the optimal firing temperature range that produces the characteristic deep red fired colour and adequate structural strength without causing thermal cracking or warping of the delicate relief panels.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16795 Molela Clay Standards & Clay Firing Strength QC</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The IS 16795 standard for Molela terracotta craft establishes India's first dedicated quality certification framework for the Rajasthan Mewar region terracotta clay relief panel tradition specifying comprehensive requirements for raw clay material quality including clay mineral composition and plasticity index, natural iron oxide content and fired colour parameters, drying shrinkage rate and firing temperature range, hand-moulded relief detail accuracy and depth consistency, panel structural integrity and handling strength, kiln firing temperature control and fired colour consistency, and overall product quality parameters that collectively distinguish authentic Molela terracotta products hand-moulded by traditional Mewar region Kumhar artisan communities from the growing volume of press-moulded and slip-cast reproductions that have increasingly appeared in both the domestic Rajasthan handicraft market and national retail platforms serving the growing demand for terracotta wall art and decorative clay products where consumers seeking authentic Molela terracotta panels face growing difficulty distinguishing hand-moulded originals from machine-produced reproductions that replicate the visual appearance of Molela relief designs at significantly lower production costs but lack the distinctive material quality and handcraft authenticity of genuine Molela hand-moulded terracotta products. The raw clay mineral composition requirements for IS 16795 Grade A certification mandate exclusively hand-excavated alluvial clay from the designated Molela region clay deposits in Rajsamand district with minimum kaolinite content of 35 percent measured by X-ray diffraction analysis in accordance with IS 16795 Annexure A testing methodology confirming the fine-grained clay quality that characterises authentic Molela terracotta raw material producing the characteristic plasticity properties of genuine Molela clay where the minimum plasticity index of 18 percent ensures the clay possesses adequate workability for the intricate hand-moulded relief technique employed in the Molela tradition where the artisan must hand-form fine detail features including facial features, decorative ornamentation, and narrative scene elements in wet clay requiring clay with sufficient plasticity to maintain sharp detail definition during the hand-moulding and drying process without cracking or deformation. The clay firing strength requirements for Grade A certification mandate minimum compressive strength of 15 megapascals measured in accordance with IS 16795 Annexure B three-point flexural strength testing methodology on standardised fired clay test specimens produced from the same clay batch as the finished product ensuring the fired terracotta panel possesses adequate structural strength to withstand handling during packaging, transit, installation, and display without chipping, cracking, or structural failure where the minimum compressive strength threshold ensures the fired clay body provides adequate resistance to mechanical impact and point loading forces that the finished terracotta panel may encounter during its service life from the artisan workshop to the final installation and display location.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Foam Wrap Corrugated Box Packaging for Molela Terracotta Transit</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Foam wrap corrugated box packaging with shock-absorbing inner cushioning has been specifically developed for the Molela terracotta logistics supply chain to protect the delicate hand-moulded clay relief panels, freestanding clay figures, and intricate surface details that characterise authentic Molela terracotta products from the physical, vibration, and impact hazards encountered during transit from the Rajasthan Mewar region artisan workshops in Molela, Udaipur, Rajsamand, and Nathdwara to domestic retail distribution points across Rajasthan and the broader Indian market, and international export destinations serving the growing demand for Indian terracotta art collectibles in the United States, United Kingdom, European Union, and Japanese markets where Molela terracotta panels are positioned as premium heritage art products commanding significant price premiums in the international terracotta and folk art collectibles market. The packaging specification utilises expanded polyethylene foam sheet with minimum density of 20 kilograms per cubic metre and thickness of 15 millimetres providing comprehensive cushioning protection against mechanical impact and vibration transmission during road transport where the winding hill roads connecting the Mewar region production centres to the national highway network at Udaipur subject the packaged terracotta products to significant vibration and shock loading requiring robust multi-layer cushioning to prevent damage to the delicate hand-moulded relief details and protruding decorative elements that characterise Molela terracotta panels where even minor impact damage to the relief surface can significantly reduce the artistic value and market price of the finished product. Each Molela terracotta panel is inspected under standardised D65 daylight illumination verifying surface relief detail accuracy meets the IS 16795 Grade A requirements through visual inspection at 500 lux minimum intensity confirming absence of chipping, cracking, handling damage, and manufacturing defects including air bubbles, surface cracking, underfiring colour variation, and structural weakness that would compromise product quality, dimensional accuracy verified through digital caliper measurement at specified reference points confirming the finished panel dimensions fall within the plus or minus 2 percent tolerance parameters for the product grade and size category, and kiln firing colour consistency confirmed through colour comparison against the approved Molela terracotta colour reference standard ensuring the fired clay colour falls within the specified colour range for authentic Molela region clay products. The inspected terracotta panel is individually wrapped in polyethylene foam sheet providing primary impact cushioning, enclosed within a custom-sized rigid inner box constructed from 3-millimetre single-wall corrugated fibreboard providing secondary structural protection, and finally placed within a 5-millimetre double-wall corrugated outer shipping container designed to withstand the stacking pressures and mechanical handling forces encountered during road and rail transport from the Mewar region artisan workshops to the final retail destination.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Firing Analysis & Molela Heritage Market Development</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and machine vision technologies are being progressively deployed to authenticate Molela terracotta products and verify the distinctive hand-moulded clay relief surface characteristics, fired clay colour composition signatures, and kiln firing quality parameters that distinguish genuine hand-moulded Molela terracotta products produced by traditional Mewar region Kumhar artisan communities from the growing volume of press-moulded and slip-cast reproductions that replicate the visual appearance of Molela relief panel designs at significantly lower production costs while lacking the distinctive handcrafted material properties and cultural authenticity of authentic Molela hand-moulded terracotta products. The AI authentication system for Molela terracotta employs high-resolution three-dimensional surface scanning combined with thermal imaging spectroscopy to capture the complete surface morphology and material composition characteristics of finished Molela terracotta products, analysing the hand-moulded surface texture signatures where traditional hand-moulding on clay using wooden and metal modelling tools produces distinctive surface characteristics including finger-impressed texture patterns, tool marks from the modelling implements, minor surface irregularities reflecting the manual clay-forming technique, and natural drying crack patterns that reflect the handcraft process of the Molela artisan that differ from the mechanically uniform surface texture of press-moulded reproductions where the automated die-pressing and slip-casting processes produce perfectly regular surface textures lacking the characteristic hand-moulded surface variations that distinguish authentic Molela products. The fired clay colour spectral signature obtained through visible-range spectroscopy analysis where the distinctive absorption spectra of the Molela region alluvial clay fired at 800 to 900 degrees Celsius produces characteristic spectral absorption patterns in the 400 to 700 nanometres visible wavelength range reflecting the specific iron oxide content and firing temperature parameters of authentic Molela terracotta products where the natural iron oxide concentration of 6 to 9 percent by weight in the Molela region clay produces the distinctive deep red to orange fired colour that differs from the fired colour of press-moulded reproductions using commercial clay bodies from other regions with different iron oxide concentrations producing fired colour values that fall outside the specified Molela terracotta colour range providing a reliable colour-based authentication parameter for distinguishing genuine from imitation Molela products. The AI-powered Molela heritage market development platform connects the traditional Mewar region Kumhar artisan cooperatives in Molela, Udaipur, Rajsamand, and Nathdwara directly with institutional buyers including the Rajasthan Handicrafts Promotion Council, state government emporiums in Udaipur and Jaipur, national-level folk art galleries, international terracotta art collectors and museums, and premium heritage home decor brands seeking authentic Indian terracotta art products where the GI Rajasthan Terracotta Mark and IS 16795 certification collectively provide the quality assurance and cultural provenance documentation framework needed to establish premium market positioning for authentic Molela hand-moulded terracotta products in both domestic and international heritage art and folk craft collectibles markets.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



