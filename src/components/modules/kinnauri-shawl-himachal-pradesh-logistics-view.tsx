import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#0f766e', '#115e59', '#134e4a', '#042f2e', '#0d9488', '#14b8a6', '#2dd4bf', '#ccfbf1']
const PRODUCTS = ['Kinnauri Angora Wool Shawl', 'Kinnauri Handloom Stole', 'Kinnauri Border Pattern Wrap', 'Kinnauri Kullu Cap Pair Set', 'Kinnauri Pure Wool Blanket', 'Kinnauri Pati Design Scarf', 'Kinnauri Temple Motif Dupal', 'Kinnauri Floral Tweed Muffler']
const ARTISANS = ['Rampur Bushahr Shawl Weavers HP', 'Kullu Kinnauri Shawl Guild', 'Kinnaur Valley Weaving Centre', 'Shimla Heritage Handloom Society', 'Sangla Valley Weaver Cooperative', 'Kalpa Kinnauri Artisan Cluster', 'Rohru Traditional Weaving HP', 'Nirmand Shawl Collective HP']
const STATUSES = ['GI Himachal Kinnauri Mark', 'IS 16792 Kinnauri Weave Grade A', 'Acid-Free Tissue Fold Pack', 'Palletised Truck Transit', 'Dry Storage 15-25C', 'Wool Fibre Tensile QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-teal-100 text-teal-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-teal-200 rounded-full overflow-hidden"><div className="h-full bg-teal-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ccfbf1" strokeWidth="6" />
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
    id: `KSH-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 28, ((offset + i) * 27) % 28) + 1,
    cost: ri(6000, 92000, ((offset + i) * 13107) % 86000) + 6000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const kinnauriRecords = [
  { id: 'KSH-0001', painter: 'Rampur Bushahr Shawl Weavers HP', ware: 'Kinnauri Angora Wool Shawl', status: 'GI Himachal Kinnauri Mark', qty: 3, cost: 78000, date: '2024-01-12' },
  { id: 'KSH-0002', painter: 'Kullu Kinnauri Shawl Guild', ware: 'Kinnauri Handloom Stole', status: 'IS 16792 Kinnauri Weave Grade A', qty: 5, cost: 52000, date: '2024-01-25' },
  { id: 'KSH-0003', painter: 'Kinnaur Valley Weaving Centre', ware: 'Kinnauri Border Pattern Wrap', status: 'Acid-Free Tissue Fold Pack', qty: 2, cost: 88000, date: '2024-02-08' },
  { id: 'KSH-0004', painter: 'Shimla Heritage Handloom Society', ware: 'Kinnauri Kullu Cap Pair Set', status: 'Palletised Truck Transit', qty: 6, cost: 34000, date: '2024-02-20' },
  { id: 'KSH-0005', painter: 'Sangla Valley Weaver Cooperative', ware: 'Kinnauri Pure Wool Blanket', status: 'Dry Storage 15-25C', qty: 8, cost: 22000, date: '2024-03-05' },
  { id: 'KSH-0006', painter: 'Kalpa Kinnauri Artisan Cluster', ware: 'Kinnauri Pati Design Scarf', status: 'Wool Fibre Tensile QC', qty: 4, cost: 62000, date: '2024-03-18' },
  { id: 'KSH-0007', painter: 'Rohru Traditional Weaving HP', ware: 'Kinnauri Temple Motif Dupal', status: 'GI Himachal Kinnauri Mark', qty: 3, cost: 85000, date: '2024-03-30' },
  { id: 'KSH-0008', painter: 'Nirmand Shawl Collective HP', ware: 'Kinnauri Floral Tweed Muffler', status: 'IS 16792 Kinnauri Weave Grade A', qty: 5, cost: 48000, date: '2024-04-12' },
  { id: 'KSH-0009', painter: 'Rampur Bushahr Shawl Weavers HP', ware: 'Kinnauri Handloom Stole', status: 'Acid-Free Tissue Fold Pack', qty: 4, cost: 56000, date: '2024-04-24' },
  { id: 'KSH-0010', painter: 'Kullu Kinnauri Shawl Guild', ware: 'Kinnauri Angora Wool Shawl', status: 'Palletised Truck Transit', qty: 3, cost: 72000, date: '2024-05-06' },
  { id: 'KSH-0011', painter: 'Kinnaur Valley Weaving Centre', ware: 'Kinnauri Border Pattern Wrap', status: 'Dry Storage 15-25C', qty: 6, cost: 38000, date: '2024-05-18' },
  { id: 'KSH-0012', painter: 'Shimla Heritage Handloom Society', ware: 'Kinnauri Kullu Cap Pair Set', status: 'Wool Fibre Tensile QC', qty: 2, cost: 90000, date: '2024-05-30' },
  { id: 'KSH-0013', painter: 'Sangla Valley Weaver Cooperative', ware: 'Kinnauri Pure Wool Blanket', status: 'GI Himachal Kinnauri Mark', qty: 7, cost: 26000, date: '2024-06-12' },
  { id: 'KSH-0014', painter: 'Kalpa Kinnauri Artisan Cluster', ware: 'Kinnauri Pati Design Scarf', status: 'IS 16792 Kinnauri Weave Grade A', qty: 4, cost: 58000, date: '2024-06-24' },
  { id: 'KSH-0015', painter: 'Rohru Traditional Weaving HP', ware: 'Kinnauri Temple Motif Dupal', status: 'Acid-Free Tissue Fold Pack', qty: 3, cost: 82000, date: '2024-07-06' },
  { id: 'KSH-0016', painter: 'Nirmand Shawl Collective HP', ware: 'Kinnauri Floral Tweed Muffler', status: 'Palletised Truck Transit', qty: 5, cost: 44000, date: '2024-07-18' },
  { id: 'KSH-0017', painter: 'Rampur Bushahr Shawl Weavers HP', ware: 'Kinnauri Pure Wool Blanket', status: 'Dry Storage 15-25C', qty: 4, cost: 68000, date: '2024-07-30' },
  { id: 'KSH-0018', painter: 'Kullu Kinnauri Shawl Guild', ware: 'Kinnauri Angora Wool Shawl', status: 'Wool Fibre Tensile QC', qty: 3, cost: 76000, date: '2024-08-10' },
  { id: 'KSH-0019', painter: 'Kinnaur Valley Weaving Centre', ware: 'Kinnauri Border Pattern Wrap', status: 'GI Himachal Kinnauri Mark', qty: 6, cost: 42000, date: '2024-08-22' },
  { id: 'KSH-0020', painter: 'Shimla Heritage Handloom Society', ware: 'Kinnauri Kullu Cap Pair Set', status: 'IS 16792 Kinnauri Weave Grade A', qty: 2, cost: 92000, date: '2024-09-03' },
]

export default function KinnauriShawlHimachalPradeshLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...kinnauriRecords, ...genRecords(21), ...genRecords(41)]


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
    <div className="ksh-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Kinnauri Shawl Himachal' }]} />
      <PageHeader title="Kinnauri Shawl Himachal Pradesh Logistics" description="Himachal Pradesh Kinnauri wool shawl and handloom textile supply chain with IS 16792 certification, wool fibre tensile QC, acid-free tissue fold packaging, and GI Himachal Kinnauri Mark across 8 heritage weaving communities in Kinnaur, Kullu, Rampur, and Shimla" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-teal-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Shipments" value={allRecords.length} />
            <KpiTile label="Active Ware" value={PRODUCTS.length} />
            <KpiTile label="Weaving Clusters" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={93} />
            <HealthRing label="IS 16792" value={89} />
            <HealthRing label="Tissue" value={85} />
            <HealthRing label="Truck" value={81} />
            <HealthRing label="Dry" value={87} />
            <HealthRing label="Tensile" value={91} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Weaver Families" value="25+" />
            <ValueTile label="Tradition" value="Since 10th C" />
            <ValueTile label="Export Markets" value="8 Countries" />
            <ValueTile label="Annual Revenue" value="₹3.2 Crore" />
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
            placeholder="Search Kinnauri shawl shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-teal-100">
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
                  <tr key={record.id} className="border-t hover:bg-teal-50/50">
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
              <CardHeader><CardTitle>Kinnauri Shawl — 1000-Year Himachal Himalayan Handloom Weaving Tradition</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Kinnauri shawl weaving represents one of the most technically sophisticated and visually distinctive handloom textile traditions of the Indian Himalayas, having been continuously practised for over a millennium by the traditional weaving communities of the Kinnaur, Kullu, Shimla, and Rampur Bushahr districts of Himachal Pradesh where hereditary weaver families create extraordinarily intricate woollen shawls characterised by distinctive geometric border patterns executed in multiple coloured woollen yarns on traditional pit looms using a technique that has remained substantially unchanged since the tenth century CE when the Kinnauri weaving tradition was first documented in the historical records of the Bushahr kingdom that governed the Kinnaur region as an independent Himalayan princely state until its incorporation into the Indian Union in 1947. The Kinnauri shawl is distinguished from all other Indian woollen textile traditions by the extraordinary complexity of its border pattern weaving technique where the weaver simultaneously manipulates multiple coloured woollen weft yarns in a supplementary weft patterning technique creating geometric motifs including the iconic Kinnauri diamond, triangle, and zigzag border patterns that frame the central field of the shawl with bands of precisely executed multi-coloured geometric designs that require the weaver to maintain simultaneous control of five to eight separate coloured yarn threads during the border weaving operation making the Kinnauri border technique one of the most technically demanding handloom weaving methods practised anywhere in the world requiring years of apprenticeship and exceptional manual dexterity to execute the complex colour changes and geometric pattern sequences that characterise the finest quality Kinnauri shawls produced by the master weavers of the Rampur Bushahr, Sangla Valley, and Kalpa artisan clusters. The raw material foundation of the Kinnauri shawl tradition is the exceptionally fine wool obtained from the local Himalayan sheep breeds reared by the Gaddi and Kinnauri pastoral communities of the Himachal Himalayan ranges where the high-altitude grazing pastures above 3,000 metres elevation produce wool with average fibre diameter of 22 to 26 microns and staple length of 60 to 80 millimetres providing the ideal combination of fineness, strength, and thermal insulation properties required for the premium quality Kinnauri shawl where the hand-spun woollen yarn produced on traditional spinning wheels by the weaver family women maintains the characteristic hand-spun texture and natural loft that distinguishes authentic Kinnauri shawls from machine-spun woollen reproductions that lack the distinctive surface texture and thermal warmth of hand-spun Himalayan wool yarn. The natural dye colouring tradition of Kinnauri shawls employs locally sourced plant-based dyes including the deep red obtained from the Ratanjyot shrub root bark that produces the distinctive Kinnauri red colour considered the most ritually and aesthetically significant colour in the Kinnauri weaving palette where the traditional colour scheme of red, white, black, yellow, and green carries symbolic significance rooted in the Kinnauri animist and Hindu devotional traditions where specific colour combinations are prescribed for different social occasions including wedding shawls, ceremonial wraps, and everyday wearing shawls each with their distinctive colour configuration governed by the established Kinnauri weaving conventions transmitted across generations of weaver families in the Kinnaur, Kullu, and Rampur Bushahr weaving districts of Himachal Pradesh where this extraordinary thousand-year Himalayan handloom tradition continues to produce some of the finest woollen textiles in the Indian subcontinent.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16792 Kinnauri Weave Standards & Wool Fibre Tensile QC</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The IS 16792 standard for Kinnauri shawl weaving establishes India's first dedicated quality certification framework for the Himachal Pradesh Kinnauri woollen handloom textile tradition, specifying comprehensive requirements for raw wool fibre quality and fineness, hand-spun yarn count and tensile strength, weave density and thread count per centimetre, border pattern accuracy within the established Kinnauri design canons, natural dye colourfastness ratings, dimensional stability after washing, and overall shawl quality parameters that collectively distinguish authentic Kinnauri shawls handwoven by traditional Himachali weaver communities from the growing volume of machine-woven and power-loom produced imitations that have increasingly appeared in both the domestic Himachali handicraft market and national retail platforms serving the growing demand for Kinnauri design woollen products where consumers seeking authentic Kinnauri shawls face growing difficulty distinguishing handloom originals from machine reproductions that replicate the visual appearance of Kinnauri patterns at significantly lower production costs but lack the distinctive material quality and handcraft authenticity of genuine Kinnauri handloom products. The raw wool fibre quality requirements for IS 16792 Grade A certification mandate exclusively hand-spun yarn from Himalayan sheep wool with average fibre diameter between 22 and 26 microns measured by wool fibre fineness analyser in accordance with IWTO standard test methodology confirming the fine wool quality that characterises authentic Kinnauri shawl material producing the characteristic soft hand feel and thermal insulation properties of genuine Kinnauri handloom products where the minimum wool fibre tensile strength of 12 centinewtons per tex ensures the hand-spun yarn possesses adequate strength for the complex supplementary weft patterning technique used in the Kinnauri border weaving operation where the weaver must subject the multiple coloured weft yarns to significant lateral tension during the pattern weaving process requiring yarn tensile strength exceeding the minimum threshold to prevent yarn breakage during the complex multi-shuttle border weaving operation that defines the Kinnauri weaving technique. The weave density requirements for Grade A certification mandate minimum 28 ends per centimetre in the warp direction and minimum 24 picks per centimetre in the weft direction measured under standard tension conditions using a pick glass and counting glass in accordance with IS 16792 Annexure A testing methodology ensuring the shawl possesses the characteristic tight weave density and structural integrity of authentic Kinnauri handloom products where the high weave density produces the characteristic firm drape and dimensional stability that distinguishes handloom Kinnauri shawls from the looser weave density of power-loom reproductions where lower weave density produces inferior drape, reduced thermal insulation, and poor dimensional stability during washing and use conditions that compromise the functional quality and service life of the finished product.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Acid-Free Tissue Fold Packaging for Kinnauri Shawls Transit</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Acid-free tissue fold packaging with moisture-barrier outer wrap has been specifically developed for the Kinnauri shawl logistics supply chain to protect the delicate handloom woollen fabric, natural dye colour integrity, and intricate geometric border patterns that characterise authentic Kinnauri shawls from the physical and environmental hazards encountered during transit from the Himachal Pradesh artisan weaving centres in the Kinnaur, Kullu, Rampur, and Shimla districts to domestic retail distribution points across Himachal Pradesh and the broader Indian market, and international export destinations serving the global demand for Indian luxury handloom woollen textiles in the United States, United Kingdom, Europe, Japan, and the Middle Eastern markets where Kinnauri shawls are positioned as premium artisanal luxury textile products commanding significant price premiums in the international handloom textile market. The packaging specification utilises acid-free tissue paper with minimum grammage of 30 grams per square metre and pH neutral buffer value between 7.0 and 7.5 measured in accordance with ISO 10716 acid-free paper testing methodology ensuring the tissue paper does not generate acidic degradation products that could cause wool fibre hydrolysis or natural dye colour fading during the extended storage and transit cycle where the Kinnauri shawl product may remain in packaging for periods exceeding six months during international export shipping logistics. Each Kinnauri shawl is inspected under standardised D65 daylight illumination verifying weave density within the IS 16792 Grade A thread count parameters using a pick glass counting method at five randomly selected points across the shawl surface confirming uniform weave density without localised thin spots or weave irregularities that would indicate quality defects requiring rejection, natural dye colourfastness verified through standardised colour rub testing using white cotton cloth under controlled pressure and humidity conditions confirming no colour transfer exceeding Grade 4 on the ISO 105-A02 grey scale for colour staining, and dimensional accuracy confirming the shawl dimensions fall within the plus or minus 2% tolerance of the specified finished dimensions for the product grade and size category. The inspected shawl is carefully folded in the traditional Kinnauri display fold pattern that exposes the distinctive geometric border patterns on the exterior surfaces, then individually wrapped in three layers of acid-free tissue paper providing initial cushioning and moisture barrier protection, followed by placement within a moisture-barrier polyethylene liner bag with desiccant silica gel sachets providing supplementary moisture protection, and finally enclosed within a rigid outer shipping container constructed from 5-millimetre double-wall corrugated fibreboard designed to withstand the stacking pressures and mechanical handling forces encountered during road transport through the mountainous road corridors of Himachal Pradesh connecting the Kinnaur valley production centres to the plains distribution hubs of Chandigarh and Delhi where the winding hill roads with numerous hairpin bends and gradient changes subject the packaged shawls to significant vibration and compression forces requiring robust outer container construction to maintain package integrity and protect the delicate handloom woollen contents throughout the transit and logistics chain from the Himalayan artisan workshop to the final retail destination.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Pattern Verification & Kinnauri Heritage Market Development</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and machine vision technologies are being progressively deployed to authenticate Kinnauri shawl products and verify the distinctive geometric border pattern characteristics, handloom weave texture signatures, and natural dye spectral properties that distinguish genuine handloom Kinnauri shawls produced by traditional Himachali weaver communities from the growing volume of machine-woven and power-loom reproductions that replicate the visual appearance of Kinnauri border patterns at significantly lower production costs while lacking the distinctive material properties and handcraft quality of authentic handloom products. The AI authentication system for Kinnauri shawls employs high-resolution macro imaging at 300 dots per inch combined with multispectral imaging across the visible and near-infrared spectrum from 400 to 1100 nanometres wavelength range to capture the complete surface morphology and material composition characteristics of finished Kinnauri shawl products, analysing the weave texture characteristics where handloom weaving on traditional pit looms produces a distinctive surface texture with characteristic hand-beat marks and minor thread alignment irregularities reflecting the manual weft insertion technique of the handloom weaver that differs from the mechanically uniform weave texture of power-loom production where the automated fly-shuttle mechanism produces a perfectly regular thread spacing pattern lacking the characteristic hand-woven texture variations, the border pattern geometric accuracy measured through automated digital image analysis comparing the geometric parameters of the captured border pattern against the established Kinnauri design canon reference database where the AI system measures the diamond, triangle, and zigzag pattern angles, proportions, and colour sequence accuracy within the tolerance parameters established by the traditional master weavers of the Rampur Bushahr and Kinnaur Valley weaving clusters, and the natural dye spectral signature obtained through reflectance spectroscopy analysis where the distinctive absorption spectra of Ratanjyot red, indigo blue, turmeric yellow, and pomegranate rind black natural dyes produce characteristic spectral signatures that differ from the synthetic dye absorption spectra of machine-woven reproductions where azo, anthraquinone, and reactive synthetic dyes produce spectral absorption patterns that are clearly distinguishable from the natural dye spectra of authentic handloom Kinnauri products providing a reliable authentication method for distinguishing genuine from imitation Kinnauri shawls. The AI-powered Kinnauri heritage market development platform connects the traditional Himachali weaver cooperatives in the Kinnaur, Kullu, Rampur, and Shimla districts directly with institutional buyers including the Himachal Pradesh Handloom and Handicraft Corporation, state government emporiums in Shimla, Chandigarh, and Delhi, national-level handloom retail chains, premium lifestyle brands seeking authentic Indian artisanal textile products, and international luxury textile importers where the GI Himachal Kinnauri Mark and IS 16792 certification collectively provide the quality assurance and provenance documentation framework needed to establish premium market positioning for authentic Kinnauri handloom shawls in both domestic and international luxury textile markets.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

