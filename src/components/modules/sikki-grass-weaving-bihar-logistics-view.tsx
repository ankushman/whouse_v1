import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#854d0e', '#a16207', '#ca8a04', '#eab308', '#facc15', '#713f12', '#422006', '#fef9c3']
const PRODUCTS = ['Sikki Grass Basket Set', 'Sikki Grass Toy Elephant', 'Sikki Grass Jewellery Box', 'Sikki Grass Storage Container', 'Sikki Grass Table Mat Set', 'Sikki Grass Wall Panel Art', 'Sikki Grass Flower Vase', 'Sikki Grass Gift Hamper']
const ARTISANS = ['Madhubani Sikki Weavers Bihar', 'Darbhanga Grass Art Cluster Bihar', 'Samastipur Sikki Cooperative Bihar', 'Sitamarhi Rural Craft Society Bihar', 'Muzaffarpur Sikki Guild Bihar', 'Begusarai Grass Weavers Bihar', 'Khagaria Sikki Women Collective Bihar', 'Katihar Golden Grass Artisans Bihar']
const STATUSES = ['GI Bihar Sikki Grass Mark', 'IS 16482 Golden Grass Grade A', 'Moisture Barrier Wrap QC', 'Palletised Rail Container', 'Dry Storage 18-25C', 'Sikki Grass Tensile QC']

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
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fae8ff" strokeWidth="6" />
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
    id: `SGW-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 20, ((offset + i) * 19) % 20) + 1,
    cost: ri(4000, 52000, ((offset + i) * 10707) % 48000) + 4000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const sikkirecords = [
  { id: 'SGW-0001', painter: 'Madhubani Sikki Weavers Bihar', ware: 'Sikki Grass Basket Set', status: 'GI Bihar Sikki Grass Mark', qty: 5, cost: 48000, date: '2024-01-18' },
  { id: 'SGW-0002', painter: 'Darbhanga Grass Art Cluster Bihar', ware: 'Sikki Grass Toy Elephant', status: 'IS 16482 Golden Grass Grade A', qty: 4, cost: 42000, date: '2024-01-31' },
  { id: 'SGW-0003', painter: 'Samastipur Sikki Cooperative Bihar', ware: 'Sikki Grass Jewellery Box', status: 'Moisture Barrier Wrap QC', qty: 8, cost: 18000, date: '2024-02-13' },
  { id: 'SGW-0004', painter: 'Sitamarhi Rural Craft Society Bihar', ware: 'Sikki Grass Storage Container', status: 'Palletised Rail Container', qty: 6, cost: 14000, date: '2024-02-25' },
  { id: 'SGW-0005', painter: 'Muzaffarpur Sikki Guild Bihar', ware: 'Sikki Grass Table Mat Set', status: 'Dry Storage 18-25C', qty: 10, cost: 8000, date: '2024-03-10' },
  { id: 'SGW-0006', painter: 'Begusarai Grass Weavers Bihar', ware: 'Sikki Grass Wall Panel Art', status: 'Sikki Grass Tensile QC', qty: 3, cost: 50000, date: '2024-03-23' },
  { id: 'SGW-0007', painter: 'Khagaria Sikki Women Collective Bihar', ware: 'Sikki Grass Flower Vase', status: 'GI Bihar Sikki Grass Mark', qty: 6, cost: 16000, date: '2024-04-05' },
  { id: 'SGW-0008', painter: 'Katihar Golden Grass Artisans Bihar', ware: 'Sikki Grass Gift Hamper', status: 'IS 16482 Golden Grass Grade A', qty: 12, cost: 6000, date: '2024-04-18' },
  { id: 'SGW-0009', painter: 'Madhubani Sikki Weavers Bihar', ware: 'Sikki Grass Toy Elephant', status: 'Moisture Barrier Wrap QC', qty: 4, cost: 44000, date: '2024-05-01' },
  { id: 'SGW-0010', painter: 'Darbhanga Grass Art Cluster Bihar', ware: 'Sikki Grass Basket Set', status: 'Palletised Rail Container', qty: 5, cost: 46000, date: '2024-05-13' },
  { id: 'SGW-0011', painter: 'Samastipur Sikki Cooperative Bihar', ware: 'Sikki Grass Jewellery Box', status: 'Dry Storage 18-25C', qty: 8, cost: 20000, date: '2024-05-25' },
  { id: 'SGW-0012', painter: 'Sitamarhi Rural Craft Society Bihar', ware: 'Sikki Grass Storage Container', status: 'Sikki Grass Tensile QC', qty: 6, cost: 12000, date: '2024-06-07' },
  { id: 'SGW-0013', painter: 'Muzaffarpur Sikki Guild Bihar', ware: 'Sikki Grass Table Mat Set', status: 'GI Bihar Sikki Grass Mark', qty: 10, cost: 10000, date: '2024-06-19' },
  { id: 'SGW-0014', painter: 'Begusarai Grass Weavers Bihar', ware: 'Sikki Grass Wall Panel Art', status: 'IS 16482 Golden Grass Grade A', qty: 3, cost: 52000, date: '2024-07-01' },
  { id: 'SGW-0015', painter: 'Khagaria Sikki Women Collective Bihar', ware: 'Sikki Grass Flower Vase', status: 'Moisture Barrier Wrap QC', qty: 7, cost: 18000, date: '2024-07-13' },
  { id: 'SGW-0016', painter: 'Katihar Golden Grass Artisans Bihar', ware: 'Sikki Grass Gift Hamper', status: 'Palletised Rail Container', qty: 15, cost: 5000, date: '2024-07-25' },
  { id: 'SGW-0017', painter: 'Madhubani Sikki Weavers Bihar', ware: 'Sikki Grass Basket Set', status: 'Dry Storage 18-25C', qty: 4, cost: 44000, date: '2024-08-07' },
  { id: 'SGW-0018', painter: 'Darbhanga Grass Art Cluster Bihar', ware: 'Sikki Grass Toy Elephant', status: 'Sikki Grass Tensile QC', qty: 5, cost: 40000, date: '2024-08-19' },
  { id: 'SGW-0019', painter: 'Samastipur Sikki Cooperative Bihar', ware: 'Sikki Grass Jewellery Box', status: 'GI Bihar Sikki Grass Mark', qty: 8, cost: 22000, date: '2024-08-31' },
  { id: 'SGW-0020', painter: 'Sitamarhi Rural Craft Society Bihar', ware: 'Sikki Grass Storage Container', status: 'IS 16482 Golden Grass Grade A', qty: 6, cost: 14000, date: '2024-09-12' },
]

export default function SikkiGrassWeavingBiharLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...sikkirecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'painter', label: 'Painter', options: ARTISANS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.painter === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(4, 20, allRecords.length * 0.10 + i * 3) }))
  const artisanChart = ARTISANS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.painter === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="sgw-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Sikki Grass Bihar' }]} />
      <PageHeader title="Sikki Grass Weaving Bihar Logistics" description="Bihar Sikki golden grass weaving supply chain with IS 16482 golden grass certification, sikki grass tensile quality control, moisture barrier wrap packaging, and GI Bihar Sikki Grass Mark across 8 artisan communities in Madhubani, Darbhanga, and Samastipur" />
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
            <KpiTile label="Weaving Clusters" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={93} />
            <HealthRing label="IS 16796" value={86} />
            <HealthRing label="Muslin" value={81} />
            <HealthRing label="Truck" value={77} />
            <HealthRing label="Dry" value={84} />
            <HealthRing label="Tensile" value={89} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Weaver Families" value="20+" />
            <ValueTile label="Tradition" value="Since 6th C" />
            <ValueTile label="Export Markets" value="4 Countries" />
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
            placeholder="Search Sikki grass shipments..."
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
              <CardHeader><CardTitle>Sikki Grass Weaving — 2400-Year Bihar Golden Grass Basket Heritage</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Sungudi saree represents one of the most distinctive and culturally significant traditional textile art forms of South India having been continuously practised for over fourteen centuries by the traditional Saurashtra and Devanga weaving communities of the Madurai, Sivaganga, Virudhunagar, Ramanathapuram, and Dindigul districts of Tamil Nadu where hereditary weaver families create extraordinarily beautiful cotton sarees characterised by the unique Sungudi tie-dye resist printing technique where the woven cotton fabric is decorated with distinctive small circular dot patterns and bold geometric border designs created through the traditional dhabu resist printing and direct dye application techniques that produce the characteristic Sungudi design vocabulary featuring intricate dot lattice patterns, geometric border motifs, and temple-inspired design elements executed in traditional colour combinations of deep red and maroon against a natural cotton white or off-white ground that has defined the Sungudi aesthetic tradition since its origins in the sixth century CE when the Saurashtra migrant weaver communities brought their textile art traditions from Gujarat to the Madurai region of the Pandyan kingdom establishing the Sungudi weaving tradition that flourished under the patronage of the Madurai Meenakshi Temple and the Pandyan royal courts where Sungudi sarees were worn as ceremonial and temple festival garments by the Devadasi temple dancers and the Pandyan royal women establishing the Sungudi saree as a prestigious textile tradition associated with the religious and cultural life of the Madurai region. The Sungudi tie-dye technique is distinguished from all other Indian resist-dye textile traditions by the extraordinary precision and regularity of its dot patterns where the traditional Sungudi artisan creates precise circular dot designs using a unique technique of tying small pinches of the woven cotton fabric with cotton thread before the dyeing process creating small resist areas that remain undyed producing perfectly circular white dots against the dyed ground colour after the resist ties are removed following the dyeing process where the precision and regularity of the dot spacing and sizing reflects the exceptional manual skill and years of training of the Sungudi artisan creating design effects that closely resemble printed textile patterns while being entirely hand-produced through the laborious resist-tying and dyeing process requiring the artisan to tie thousands of individual dots per saree with consistent spacing and sizing that produces the characteristic Sungudi pattern regularity and visual rhythm that distinguishes authentic Sungudi sarees from machine-printed reproductions that replicate the Sungudi dot pattern appearance through rotary screen printing at vastly lower production cost but lacking the distinctive handcrafted textile quality and natural dye colour variations of genuine Sungudi tie-dye products.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16482 Sikki Grass Standards & Golden Grass Tensile QC</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The IS 16796 standard for Sungudi sarees establishes India's first dedicated quality certification framework for the Tamil Nadu Sungudi tie-dye cotton textile tradition specifying comprehensive requirements for raw cotton yarn quality and count, handloom weave density and thread count per centimetre, tie-dye resist pattern accuracy and dot spacing regularity, natural dye colourfastness ratings, resist-tie mark quality and absence of dye bleeding at tie points, finished saree dimensional stability after washing, and overall saree quality parameters that collectively distinguish authentic Sungudi sarees hand-produced by traditional Madurai region weaver communities from the growing volume of machine-printed and screen-printed reproductions that have increasingly appeared in both the domestic Tamil Nadu textile market and national retail platforms serving the growing demand for Sungudi design cotton sarees where consumers seeking authentic Sungudi sarees face growing difficulty distinguishing hand-tie-dyed originals from machine-printed reproductions that replicate the Sungudi dot pattern design at significantly lower production costs while lacking the distinctive handcraft quality and natural textile texture of genuine Sungudi products. The raw cotton yarn requirements for IS 16796 Grade A certification mandate exclusively hand-spun or mill-spun cotton yarn with minimum 2/80s count measured in accordance with IS 1671 yarn count testing methodology confirming the fine yarn quality that characterises authentic Sungudi saree fabric producing the characteristic soft hand feel and drape quality of genuine Sungudi cotton sarees where the minimum yarn tensile strength of 12 centinewtons per tex measured by single-end yarn tensile testing in accordance with IS 1673 methodology ensures the cotton yarn possesses adequate strength for the handloom weaving process where the yarn must withstand the significant tensile stresses of the warp tension during the pit loom weaving operation without frequent yarn breakage that would compromise the weave density and surface quality of the finished Sungudi saree fabric. The tie-dye resist pattern accuracy requirements for Grade A certification mandate dot spacing variation within plus or minus 2 millimetres of the specified pattern pitch measured at ten randomly selected points across the saree surface using a calibrated measuring gauge confirming the exceptional pattern regularity and precision that characterises authentic hand-tied Sungudi dot patterns where the consistent spacing and circular dot geometry produced by the skilled Sungudi artisan creates a visually rhythmic pattern quality that distinguishes authentic Sungudi tie-dye from machine-printed reproductions where the screen-printed dots typically exhibit minor registration irregularities and mechanical repetition patterns that lack the organic quality of hand-tied Sungudi dot designs.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Moisture Barrier Packaging for Sikki Grass Product Transit</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Muslin cloth fold packaging with moisture-absorbing desiccant sachets has been specifically developed for the Sungudi saree logistics supply chain to protect the delicate handloom cotton fabric, natural dye colour integrity, and intricate tie-dye dot patterns that characterise authentic Sungudi sarees from the physical and environmental hazards encountered during transit from the Tamil Nadu weaving centres in Madurai, Sivaganga, Virudhunagar, and the surrounding districts to domestic retail distribution points across Tamil Nadu and the broader Indian market where the Sungudi saree products must maintain their quality during road transit through the South Indian highway network connecting the Tamil Nadu production centres to the major retail distribution hubs of Chennai, Coimbatore, Bangalore, and Hyderabad serving the growing market demand for authentic Sungudi cotton sarees. The packaging specification utilises unbleached muslin cotton cloth with minimum grammage of 40 grams per square metre and pH neutral buffer value between 6.5 and 7.5 measured in accordance with ISO 3071 textile pH testing methodology ensuring the muslin wrapping cloth does not generate acidic or alkaline degradation products that could cause cotton fibre hydrolysis or natural dye colour migration during the extended transit and storage cycle where the Sungudi saree may remain in packaging for periods exceeding four months during distribution through the multi-level wholesale and retail distribution network. Each Sungudi saree is inspected under standardised D65 daylight illumination verifying weave density within the IS 16796 Grade A thread count parameters using a pick glass counting method at five randomly selected points across the saree surface confirming uniform weave density without localised thin spots or weave irregularities, tie-dye dot pattern accuracy verified through calibrated measurement of dot spacing at ten reference points confirming pattern regularity within the specified tolerance parameters, natural dye colourfastness verified through standardised colour rub testing using white cotton cloth under controlled pressure conditions confirming no colour transfer exceeding Grade 4 on the ISO 105-A02 grey scale for colour staining, and dimensional accuracy confirming the saree dimensions fall within the plus or minus 2 percent tolerance of the specified finished dimensions for the saree grade and size category. The inspected saree is carefully folded in the traditional Sungudi display fold pattern that exposes the distinctive border designs on the exterior surfaces, wrapped in muslin cloth providing primary environmental protection, enclosed with silica gel desiccant sachets providing moisture absorption protection, and placed within a rigid outer shipping container constructed from 5-millimetre double-wall corrugated fibreboard designed to withstand the stacking pressures and mechanical handling forces encountered during road transit from the Tamil Nadu weaving centres to the final retail destination.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Design Archive & Bihar Sikki Grass Heritage Market Development</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and machine vision technologies are being progressively deployed to authenticate Sungudi saree products and verify the distinctive tie-dye dot pattern characteristics, handloom weave texture signatures, and natural dye colour properties that distinguish genuine hand-tie-dyed Sungudi sarees produced by traditional Madurai region weaver communities from the growing volume of machine-printed and screen-printed reproductions that replicate the visual appearance of Sungudi dot pattern designs at significantly lower production costs while lacking the distinctive handcraft material properties and cultural authenticity of genuine Sungudi products. The AI authentication system for Sungudi sarees employs high-resolution macro imaging at 300 dots per inch combined with multispectral imaging across the visible and near-infrared spectrum to capture the complete surface morphology and material composition characteristics of finished Sungudi saree products analysing the tie-dye dot pattern characteristics where hand-tied resist dyeing produces distinctive dot morphology including slight variations in dot circularity reflecting the manual resist-tying technique of the artisan, characteristic resist-tie compression marks at the tie points visible under magnification, and natural dye colour variation within each dot reflecting the hand-dyeing process that differs from the mechanically uniform dot patterns of screen-printed reproductions where the automated printing process produces perfectly circular dots with uniform colour distribution lacking the characteristic hand-tied texture variations of authentic Sungudi products. The AI-powered Sungudi heritage market development platform connects the traditional Tamil Nadu weaver cooperatives in Madurai, Sivaganga, and Virudhunagar directly with institutional buyers including the Tamil Nadu Handloom Textiles Corporation, state government emporiums in Chennai and Madurai, national-level handloom retail chains, premium ethnic fashion brands seeking authentic Indian regional textile products, and international sustainable fashion retailers where the GI Tamil Nadu Sungudi Mark and IS 16796 certification collectively provide the quality assurance and cultural provenance documentation framework needed to establish premium market positioning for authentic Sungudi hand-tie-dyed cotton sarees in both domestic and international heritage textile and sustainable fashion markets.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



