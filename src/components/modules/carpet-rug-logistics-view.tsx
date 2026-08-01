import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#7c2d12', '#9a3412', '#c2410c', '#ea580c', '#f97316', '#431407', '#6b2f10', '#fff7ed']
const PRODUCTS = ['Handknotted Silk 6x9', 'Kashmir Woollen Rug 5x8', 'Jute Braided Mat 8x10', 'Dhurrie Cotton Flatweave', 'Moroccan Tufted 4x6', 'Prayer Namaz Mat', 'Carpet Runner 2.5x12', 'Shaggy Polyester 6x6']
const ARTISANS = ['Mirzapur Bhadohi UP', 'Srinagar Kashmir', 'Agra Carpet Hub', 'Jaipur Handknotted RJ', 'Panipat Haryana', 'Eluru Andhra Pradesh', 'Gurgaon NCR Workshop', 'Nepal Border Export']
const STATUSES = ['GI Carpet Mark', 'IS 1541 Certified', 'Rolled Pallet Transit', 'Warehouse Stacked', 'GST 12% Pending', 'Knot Density QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-orange-100 text-orange-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-orange-200 rounded-full overflow-hidden"><div className="h-full bg-orange-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fff7ed" strokeWidth="6" />
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
    id: `CRP-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 20, ((offset + i) * 19) % 20) + 1,
    cost: ri(8000, 120000, ((offset + i) * 14051) % 112000) + 8000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const carpetRecords = [
  { id: 'CRP-0001', painter: 'Mirzapur Bhadohi UP', ware: 'Handknotted Silk 6x9', status: 'GI Carpet Mark', qty: 4, cost: 115000, date: '2024-01-17' },
  { id: 'CRP-0002', painter: 'Srinagar Kashmir', ware: 'Kashmir Woollen Rug 5x8', status: 'IS 1541 Certified', qty: 6, cost: 88000, date: '2024-01-30' },
  { id: 'CRP-0003', painter: 'Agra Carpet Hub', ware: 'Jute Braided Mat 8x10', status: 'Rolled Pallet Transit', qty: 8, cost: 24000, date: '2024-02-12' },
  { id: 'CRP-0004', painter: 'Jaipur Handknotted RJ', ware: 'Dhurrie Cotton Flatweave', status: 'Warehouse Stacked', qty: 10, cost: 18000, date: '2024-02-24' },
  { id: 'CRP-0005', painter: 'Panipat Haryana', ware: 'Moroccan Tufted 4x6', status: 'GST 12% Pending', qty: 5, cost: 52000, date: '2024-03-09' },
  { id: 'CRP-0006', painter: 'Eluru Andhra Pradesh', ware: 'Prayer Namaz Mat', qty: 12, cost: 12000, date: '2024-03-22', status: 'Knot Density QC' },
  { id: 'CRP-0007', painter: 'Gurgaon NCR Workshop', ware: 'Carpet Runner 2.5x12', status: 'GI Carpet Mark', qty: 3, cost: 68000, date: '2024-04-04' },
  { id: 'CRP-0008', painter: 'Nepal Border Export', ware: 'Shaggy Polyester 6x6', status: 'IS 1541 Certified', qty: 4, cost: 42000, date: '2024-04-17' },
  { id: 'CRP-0009', painter: 'Mirzapur Bhadohi UP', ware: 'Handknotted Silk 6x9', status: 'Rolled Pallet Transit', qty: 3, cost: 108000, date: '2024-04-30' },
  { id: 'CRP-0010', painter: 'Srinagar Kashmir', ware: 'Kashmir Woollen Rug 5x8', status: 'Warehouse Stacked', qty: 5, cost: 92000, date: '2024-05-12' },
  { id: 'CRP-0011', painter: 'Agra Carpet Hub', ware: 'Jute Braided Mat 8x10', status: 'GST 12% Pending', qty: 8, cost: 22000, date: '2024-05-24' },
  { id: 'CRP-0012', painter: 'Jaipur Handknotted RJ', ware: 'Dhurrie Cotton Flatweave', status: 'Knot Density QC', qty: 10, cost: 16000, date: '2024-06-06' },
  { id: 'CRP-0013', painter: 'Panipat Haryana', ware: 'Moroccan Tufted 4x6', status: 'GI Carpet Mark', qty: 4, cost: 58000, date: '2024-06-18' },
  { id: 'CRP-0014', painter: 'Eluru Andhra Pradesh', ware: 'Prayer Namaz Mat', status: 'IS 1541 Certified', qty: 15, cost: 10000, date: '2024-06-30' },
  { id: 'CRP-0015', painter: 'Gurgaon NCR Workshop', ware: 'Carpet Runner 2.5x12', status: 'Rolled Pallet Transit', qty: 3, cost: 64000, date: '2024-07-12' },
  { id: 'CRP-0016', painter: 'Nepal Border Export', ware: 'Shaggy Polyester 6x6', status: 'Warehouse Stacked', qty: 4, cost: 40000, date: '2024-07-24' },
  { id: 'CRP-0017', painter: 'Mirzapur Bhadohi UP', ware: 'Handknotted Silk 6x9', status: 'GST 12% Pending', qty: 2, cost: 120000, date: '2024-08-06' },
  { id: 'CRP-0018', painter: 'Srinagar Kashmir', ware: 'Kashmir Woollen Rug 5x8', status: 'Knot Density QC', qty: 6, cost: 84000, date: '2024-08-18' },
  { id: 'CRP-0019', painter: 'Agra Carpet Hub', ware: 'Jute Braided Mat 8x10', status: 'GI Carpet Mark', qty: 8, cost: 26000, date: '2024-08-30' },
  { id: 'CRP-0020', painter: 'Jaipur Handknotted RJ', ware: 'Dhurrie Cotton Flatweave', status: 'IS 1541 Certified', qty: 10, cost: 20000, date: '2024-09-11' },
]

export default function CarpetRugLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...carpetRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'painter', label: 'Painter', options: ARTISANS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.painter === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(4, 24, allRecords.length * 0.11 + i * 3) }))
  const artisanChart = ARTISANS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.painter === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="crp-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Carpet & Rug' }]} />
      <PageHeader title="Carpet Rug Logistics" description="Indian carpet and rug supply chain with IS 1541 certification, knot density QC, rolled pallet transit packaging, GI Carpet Mark, and GST compliance across 8 weaving centres in Bhadohi, Kashmir, Agra, Jaipur, and Panipat" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-orange-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Shipments" value={allRecords.length} />
            <KpiTile label="Active Ware" value={PRODUCTS.length} />
            <KpiTile label="Weaving Centres" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={92} />
            <HealthRing label="IS 1541" value={88} />
            <HealthRing label="Rolled" value={85} />
            <HealthRing label="Stacked" value={80} />
            <HealthRing label="GST" value={76} />
            <HealthRing label="Knot" value={90} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Weaver Families" value="2000+" />
            <ValueTile label="Tradition" value="Since 16th C" />
            <ValueTile label="Export Markets" value="40+ Countries" />
            <ValueTile label="Annual Revenue" value="₹85 Crore" />
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
            placeholder="Search carpet rug shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-orange-100">
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
                  <tr key={record.id} className="border-t hover:bg-orange-50/50">
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
              <CardHeader><CardTitle>Indian Carpet Weaving — 500-Year Bhadohi Kashmir Mirzapur Handknotted Heritage</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Indian carpet weaving represents one of the most economically significant and culturally celebrated textile handicraft traditions of the Indian subcontinent having been continuously practised for over five centuries across the major carpet weaving centres of Bhadohi and Mirzapur in Uttar Pradesh, Srinagar and Anantnag in Kashmir, Agra in Uttar Pradesh, Jaipur in Rajasthan, Panipat in Haryana, Eluru in Andhra Pradesh, and the Nepal-India border production clusters where hereditary weaving communities create extraordinarily diverse handknotted, hand-tufted, flatweave, and pile-woven carpets and rugs serving both the premium international luxury carpet market and the domestic Indian home furnishing market where Indian carpets command significant global market share across all product categories from the finest Kashmir silk handknotted carpets to the mass-market Panipat tufted and woven rugs used in residential and commercial flooring applications throughout India and exported to over forty countries worldwide. The Indian carpet weaving tradition is distinguished by its extraordinary regional diversity where the Kashmir carpet tradition produces the finest quality silk and woollen handknotted carpets using the traditional Persian Senneh and Jufti knot techniques on vertical looms creating carpets with knot densities exceeding 400 knots per square inch in the premium silk carpet category producing intricate floral medallion, tree-of-life, and hunting scene designs in silk pile on cotton or silk foundations that represent the pinnacle of Indian handknotted carpet craftsmanship requiring individual carpet weaving times of 12 to 24 months for a single 6 by 9 foot silk carpet, while the Bhadohi-Mirzapur carpet cluster produces the largest volume of Indian handknotted and hand-tufted woollen carpets serving the mid-range and export market categories where the traditional Indo-Nepalese knot technique and the modern hand-tufted technique produce carpets with knot densities ranging from 60 to 200 knots per square inch in a wide range of Persian, Turkish, and contemporary geometric designs providing the primary carpet export production base of the Indian carpet industry accounting for over 80 percent of total Indian carpet export volume. The Bhadohi-Mirzapur carpet cluster in Uttar Pradesh is the largest carpet production concentration in the world employing over two hundred thousand weaver families across approximately five hundred villages in the Bhadohi, Mirzapur, Varanasi, and Jaunpur districts where the carpet weaving tradition has been the primary economic activity for over five hundred years creating an extraordinarily concentrated production ecosystem with complete supply chain integration from raw wool and silk sourcing through dyeing, spinning, weaving, finishing, and export logistics that produces carpets for all major international market segments from the premium handknotted category through the mass-market hand-tufted and machine-woven categories.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 1541 Carpet Standards & Knot Density QC</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The IS 1541 standard for handknotted carpets and rugs establishes India's comprehensive quality certification framework for the handknotted carpet industry specifying requirements for raw material quality including wool fibre fineness and tensile strength, silk yarn denier and lustre rating, cotton foundation yarn quality, dye colourfastness ratings, knot density per square inch measured by standardised pick glass counting methodology, pile height uniformity across the carpet surface, selvedge construction quality, dimensional stability after wet cleaning, and overall carpet quality grading parameters that collectively distinguish certified Indian handknotted carpets from machine-woven and power-loom reproductions that increasingly compete with handknotted products in both domestic and international markets. The knot density requirements for IS 1541 Grade A certification mandate minimum 200 knots per square inch measured by counting knots within a one-inch by one-inch area at five randomly selected points across the carpet surface using a standardised pick glass and counting lens in accordance with IS 1541 Annexure A testing methodology where the measured knot density at all five test points must fall within plus or minus 10 percent of the declared knot density for the product grade ensuring consistent weaving quality across the entire carpet surface without localised areas of reduced knot density that indicate quality defects or substandard weaving technique that would compromise the carpet quality, durability, and aesthetic appearance where consistent knot density is the primary quality indicator of handknotted carpet craftsmanship reflecting the skill and precision of the individual weaver in maintaining uniform knot spacing and tension across the entire carpet surface during the weaving process that may extend over 12 to 24 months for premium quality carpets. The dye colourfastness requirements for Grade A certification mandate minimum colourfastness rating of Grade 4 on the ISO 105-C06 wash fastness scale and Grade 4 on the ISO 105-B02 light fastness scale measured by standardised colourfastness testing methodology ensuring the carpet dyes maintain their colour intensity and do not exhibit significant fading, bleeding, or colour transfer under normal use and cleaning conditions where dye quality is a critical quality parameter for handknotted carpets where the premium pricing of handknotted products relative to machine-woven alternatives is substantially dependent on the dye quality and colourfastness performance as carpets with poor dye colourfastness exhibit colour fading and bleeding during use significantly reducing the aesthetic value and service life of the finished carpet product.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Rolled Pallet Transit Packaging for Carpet & Rug Logistics</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Rolled pallet transit packaging with moisture-barrier outer wrapping and industrial strapping has been specifically developed for the Indian carpet and rug logistics supply chain to protect the diverse range of handknotted, hand-tufted, and flatweave carpet products from the physical, environmental, and contamination hazards encountered during transit from the Bhadohi, Mirzapur, Kashmir, Agra, Jaipur, and Panipat weaving centres to domestic distribution hubs across India and international export destinations serving over forty countries worldwide where Indian carpets are exported as containerised shipments through the major Indian port gateways of Nhava Sheva, Mundra, and Chennai connecting the carpet production centres to the global carpet market through established sea freight logistics corridors. The packaging specification utilises a rolled carpet packaging technique where each carpet is tightly rolled around a rigid cardboard core tube with minimum diameter of 10 centimetres providing structural support for the rolled carpet and enabling efficient handling and stacking during warehouse storage and transit operations where the rolled format minimises the carpet footprint and maximises container utilisation efficiency in export shipments achieving average container loading densities of 2500 to 3500 square metres of carpet per standard 20-foot container depending on carpet thickness and pile height. Each carpet is inspected under standardised D65 daylight illumination verifying knot density meets the IS 1541 Grade A parameters using the pick glass counting method at five randomly selected points confirming uniform knot density across the entire carpet surface, pile height uniformity verified through digital thickness gauge measurement at eight reference points confirming pile height falls within the specified tolerance parameters for the product grade ensuring consistent surface texture and appearance across the carpet surface, selvedge construction quality verified through visual inspection and manual tension testing confirming the selvedge edges are securely bound and possess adequate tensile strength to prevent selvedge unravelling during the rolling and handling operations, and dimensional accuracy confirmed through calibrated tape measurement at three width and three length reference points ensuring the finished carpet dimensions fall within the plus or minus 2 percent tolerance of the specified finished dimensions. The inspected carpet is rolled tightly around the core tube with the pile surface facing inward to protect the pile from abrasion during handling and transit, wrapped in polyethylene moisture-barrier film providing primary environmental protection against humidity and moisture exposure during the transit cycle, wrapped in protective Kraft paper providing secondary cushioning and abrasion protection, and finally secured with polyester strapping at three points along the rolled length providing structural stability during handling and transit operations where the strapped roll is placed on wooden pallets for containerised export shipments enabling efficient fork-lift handling and secure stacking within the shipping container.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Knot Analysis & Indian Carpet Heritage Market Development</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and machine vision technologies are being progressively deployed to authenticate Indian handknotted carpets and verify the knot construction characteristics, pile surface quality parameters, and design execution accuracy that distinguish genuine handknotted carpets produced by traditional Indian weaving communities from machine-woven and power-loom reproductions that replicate the visual appearance of handknotted carpet designs at significantly lower production costs while lacking the distinctive material quality, structural characteristics, and handcraft authenticity of genuine handknotted products. The AI authentication system for Indian carpets employs high-resolution macro imaging at 200 dots per inch combined with structured light three-dimensional surface profiling to capture the complete surface morphology and structural characteristics of finished carpet products analysing the knot construction signatures where handknotted carpets on traditional looms produce distinctive surface characteristics including individual knot asymmetry reflecting the manual knot-tying technique of the weaver, minor row spacing irregularities reflecting the hand-beat weft insertion technique, and natural pile height variation across the carpet surface reflecting the manual pile trimming process that differs from the mechanically uniform surface texture of machine-woven carpets where the automated jacquard and power-loom mechanisms produce perfectly regular knot patterns, row spacing, and pile height that lack the characteristic handcrafted surface variations of genuine handknotted products. The AI-powered Indian carpet heritage market development platform connects the traditional weaving communities in Bhadohi, Mirzapur, Kashmir, and the other major carpet weaving centres directly with institutional buyers including the Carpet Export Promotion Council, state government handicraft emporiums, international carpet wholesalers and retailers in the United States, Germany, United Kingdom, Saudi Arabia, and Australia, premium interior design firms seeking authentic Indian handknotted carpets for luxury residential and hospitality projects, and online carpet marketplaces where the GI Carpet Mark and IS 1541 certification collectively provide the quality assurance and provenance documentation framework needed to establish premium market positioning for authentic Indian handknotted carpets in both domestic and international carpet markets where growing consumer awareness of handknotted craftsmanship quality and preference for sustainable artisanal products creates significant market opportunities for genuine Indian handknotted carpet products from the traditional weaving communities of Bhadohi, Mirzapur, Kashmir, and the other established Indian carpet weaving centres.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



