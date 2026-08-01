import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#a16207', '#854d0e', '#713f12', '#422006', '#ca8a04', '#eab308', '#facc15', '#fef9c3']
const PRODUCTS = ['Rajasthan Lac Bangles Set', 'Hyderabad Lacquer Turning Toy', 'Channapatna Lac Wood Bowl', 'Etikoppaka Lacquer Art Pen Stand', 'Mysore Sandalwood Lac Bangles', 'Jaipur Meenakari Lac Bracelet', 'Saharanpur Lac Wood Box', 'Nagaland Bamboo Lac Ornament']
const ARTISANS = ['Jaipur Lac Bangles Cluster RJ', 'Hyderabad Lacquer Artisans AP', 'Channapatna Lac Wood Guild KA', 'Etikoppaka Lac Craft Society AP', 'Mysore Lac Industry Centre KA', 'Jodhpur Lac Works Studio RJ', 'Varanasi Lac Unit UP', 'Sivasagar Lac Craft Group AS']
const STATUSES = ['GI Lacquerware Lac Mark', 'IS 16790 Lac Craft Grade A', 'Cotton Wrap Padded Box', 'Palletised Truck Transit', 'Dry Storage 18-28C', 'Lac Adhesion Finish QC']

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
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fef9c3" strokeWidth="6" />
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
    id: `LAC-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 28, ((offset + i) * 27) % 28) + 1,
    cost: ri(6000, 92000, ((offset + i) * 13107) % 86000) + 6000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const lacquerwareRecords = [
  { id: 'LAC-0001', painter: 'Jaipur Lac Bangles Cluster RJ', ware: 'Rajasthan Lac Bangles Set', status: 'GI Lacquerware Lac Mark', qty: 3, cost: 78000, date: '2024-01-12' },
  { id: 'LAC-0002', painter: 'Hyderabad Lacquer Artisans AP', ware: 'Hyderabad Lacquer Turning Toy', status: 'IS 16790 Lac Craft Grade A', qty: 5, cost: 52000, date: '2024-01-25' },
  { id: 'LAC-0003', painter: 'Channapatna Lac Wood Guild KA', ware: 'Channapatna Lac Wood Bowl', status: 'Cotton Wrap Padded Box', qty: 2, cost: 88000, date: '2024-02-08' },
  { id: 'LAC-0004', painter: 'Etikoppaka Lac Craft Society AP', ware: 'Etikoppaka Lacquer Art Pen Stand', status: 'Palletised Truck Transit', qty: 6, cost: 34000, date: '2024-02-20' },
  { id: 'LAC-0005', painter: 'Mysore Lac Industry Centre KA', ware: 'Mysore Sandalwood Lac Bangles', status: 'Dry Storage 18-28C', qty: 8, cost: 22000, date: '2024-03-05' },
  { id: 'LAC-0006', painter: 'Jodhpur Lac Works Studio RJ', ware: 'Jaipur Meenakari Lac Bracelet', status: 'Lac Adhesion Finish QC', qty: 4, cost: 62000, date: '2024-03-18' },
  { id: 'LAC-0007', painter: 'Varanasi Lac Unit UP', ware: 'Saharanpur Lac Wood Box', status: 'GI Lacquerware Lac Mark', qty: 3, cost: 85000, date: '2024-03-30' },
  { id: 'LAC-0008', painter: 'Sivasagar Lac Craft Group AS', ware: 'Nagaland Bamboo Lac Ornament', status: 'IS 16790 Lac Craft Grade A', qty: 5, cost: 48000, date: '2024-04-12' },
  { id: 'LAC-0009', painter: 'Jaipur Lac Bangles Cluster RJ', ware: 'Hyderabad Lacquer Turning Toy', status: 'Cotton Wrap Padded Box', qty: 4, cost: 56000, date: '2024-04-24' },
  { id: 'LAC-0010', painter: 'Hyderabad Lacquer Artisans AP', ware: 'Rajasthan Lac Bangles Set', status: 'Palletised Truck Transit', qty: 3, cost: 72000, date: '2024-05-06' },
  { id: 'LAC-0011', painter: 'Channapatna Lac Wood Guild KA', ware: 'Channapatna Lac Wood Bowl', status: 'Dry Storage 18-28C', qty: 6, cost: 38000, date: '2024-05-18' },
  { id: 'LAC-0012', painter: 'Etikoppaka Lac Craft Society AP', ware: 'Etikoppaka Lacquer Art Pen Stand', status: 'Lac Adhesion Finish QC', qty: 2, cost: 90000, date: '2024-05-30' },
  { id: 'LAC-0013', painter: 'Mysore Lac Industry Centre KA', ware: 'Mysore Sandalwood Lac Bangles', status: 'GI Lacquerware Lac Mark', qty: 7, cost: 26000, date: '2024-06-12' },
  { id: 'LAC-0014', painter: 'Jodhpur Lac Works Studio RJ', ware: 'Jaipur Meenakari Lac Bracelet', status: 'IS 16790 Lac Craft Grade A', qty: 4, cost: 58000, date: '2024-06-24' },
  { id: 'LAC-0015', painter: 'Varanasi Lac Unit UP', ware: 'Saharanpur Lac Wood Box', status: 'Cotton Wrap Padded Box', qty: 3, cost: 82000, date: '2024-07-06' },
  { id: 'LAC-0016', painter: 'Sivasagar Lac Craft Group AS', ware: 'Nagaland Bamboo Lac Ornament', status: 'Palletised Truck Transit', qty: 5, cost: 44000, date: '2024-07-18' },
  { id: 'LAC-0017', painter: 'Jaipur Lac Bangles Cluster RJ', ware: 'Hyderabad Lacquer Turning Toy', status: 'Dry Storage 18-28C', qty: 4, cost: 68000, date: '2024-07-30' },
  { id: 'LAC-0018', painter: 'Hyderabad Lacquer Artisans AP', ware: 'Rajasthan Lac Bangles Set', status: 'Lac Adhesion Finish QC', qty: 3, cost: 76000, date: '2024-08-10' },
  { id: 'LAC-0019', painter: 'Channapatna Lac Wood Guild KA', ware: 'Channapatna Lac Wood Bowl', status: 'GI Lacquerware Lac Mark', qty: 6, cost: 42000, date: '2024-08-22' },
  { id: 'LAC-0020', painter: 'Etikoppaka Lac Craft Society AP', ware: 'Etikoppaka Lacquer Art Pen Stand', status: 'IS 16790 Lac Craft Grade A', qty: 2, cost: 92000, date: '2024-09-03' },
]

export default function LacquerwareLacBanglesLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...lacquerwareRecords, ...genRecords(21), ...genRecords(41)]


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
    <div className="llb-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Lacquerware & Lac Bangles' }]} />
      <PageHeader title="Lacquerware & Lac Bangles Logistics" description="India lacquerware and lac bangles supply chain with IS 16790 certification, lac adhesion finish QC, cotton wrap padded box packaging, and GI Lacquerware Lac Mark across 8 heritage artisan clusters in Jaipur, Hyderabad, Channapatna, and Etikoppaka" />
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
            <KpiTile label="Lac Clusters" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={93} />
            <HealthRing label="IS 16790" value={89} />
            <HealthRing label="Cotton" value={85} />
            <HealthRing label="Truck" value={81} />
            <HealthRing label="Dry Store" value={87} />
            <HealthRing label="Lac QC" value={91} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="35+" />
            <ValueTile label="Tradition" value="Since 16th C" />
            <ValueTile label="Export Markets" value="6 Countries" />
            <ValueTile label="Annual Revenue" value="₹2.2 Crore" />
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
            placeholder="Search lacquerware and lac bangle shipments..."
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
              <CardHeader><CardTitle>Lacquerware & Lac Bangles — 500-Year Indian Lac Craft Tradition</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Indian lacquerware and lac bangles represent one of the most technically demanding and visually luminous handicraft traditions in the Indian subcontinent, having been continuously practised for over five centuries across multiple artisan clusters spanning the length and breadth of India from the lac bangle workshops of Rajasthan's Jaipur and Jodhpur districts where hereditary Muslim lac bangle artisan families create extraordinarily thin and delicately coloured lac bangles worn by millions of Indian women as essential wedding and festival adornment, to the lacquer-turned wooden toy workshops of Karnataka's Channapatna town where the traditional lacquering technique transforms locally sourced hale wood and ivory wood into brightly coloured children's toys and household articles that have been recognised as a Geographical Indication craft product by the Government of India, and the Etikoppaka lacquer craft village of Andhra Pradesh's Visakhapatnam district where the unique Ankudu wood lacquerware tradition produces exquisitely finished lac-coated wooden articles including combs, jewelry boxes, candle stands, and decorative objets d'art that combine the natural wood grain beauty of locally sourced Ankudu wood with the vibrant gloss finish of traditional lacquer coating applied through the unique hand-turned lathe lacquering technique that distinguishes the Etikoppaka lacquer tradition from all other Indian lacquer craft practices. The lac bangle tradition of Rajasthan represents the largest single product category within the Indian lacquerware sector with an estimated annual production exceeding twelve crore pairs of lac bangles consumed primarily by the domestic Indian market where lac bangles are considered essential adornment for married Hindu women across North India and are worn daily as symbols of marital status and domestic prosperity in accordance with the traditional Hindu stridhan customs governing women's personal adornment that mandate lac bangles as essential components of the solah shringar or sixteen traditional adornments prescribed for Hindu brides during wedding ceremonies and subsequent festival observances including Karva Chauth, Teej, and Diwali where new lac bangles in auspicious colours are traditionally gifted to married women by their mothers-in-law and husbands as symbols of conjugal affection and domestic harmony. The lac bangle manufacturing process in Rajasthan follows a sophisticated multi-stage sequence beginning with the preparation of the lac base material through the melting and purification of raw lac resin obtained from the lac insect Kerria lacca cultured on the host trees of the Indian lac-growing regions including the palash, kusum, and ber trees of the Chhattisgarh, Jharkhand, and West Bengal tribal forest areas where traditional lac cultivation provides essential supplementary income for tribal lac farmers who harvest the crude lac resin from the tree branches and sell it through established lac market channels to the Jaipur lac bangle manufacturing clusters where the refined lac is combined with natural mineral colourants including synthetic equivalents of traditional kumkum vermillion, turmeric yellow, indigo blue, and mineral green to produce the distinctive bright colour palette that characterises Rajasthani lac bangles favoured by consumers across North India for their vivid colour intensity and glass-like surface gloss that distinguishes handcrafted lac bangles from the machine-manufactured plastic bangle imitations that have increasingly appeared in the mass-market bangle retail sector.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16790 Lacquerware Standards & Lac Adhesion Finish QC</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The IS 16790 standard for Indian lacquerware and lac craft products establishes India's first comprehensive quality certification framework for the traditional lacquerware sector covering lac bangles, lacquer-turned wooden toys, lac-coated household articles, and decorative lacquer art objects produced across the major Indian lacquer craft clusters including the Jaipur lac bangle workshops of Rajasthan, the Channapatna lacquer-turned toy workshops of Karnataka, the Etikoppaka lacquer craft village of Andhra Pradesh, the Hyderabad lacquerware artisan workshops of Telangana, and the Saharanpur lac-coated wooden furniture and articles cluster of Uttar Pradesh. The standard specifies comprehensive quality requirements for lac raw material purity and composition, lac colourant safety and toxicity compliance, lac coating adhesion strength and durability, lac surface finish gloss and uniformity, dimensional accuracy for turned lacquerware objects, and overall product safety requirements that collectively distinguish authentic handcrafted Indian lacquerware produced by traditional artisan communities from the growing volume of machine-manufactured plastic and synthetic-resin coated imitations that have increasingly appeared in both domestic Indian handicraft retail markets and international online platforms serving the global demand for Indian decorative art objects. The lac raw material requirements for IS 16790 Grade A certification mandate exclusively hand-refined lac resin derived from the Kerria lacca lac insect with minimum purity of 85% shellac content verified through standardised hot alcohol solubility testing confirming the absence of synthetic resin adulterants including urea-formaldehyde, melamine-formaldehyde, and polyester resins that are commonly used as lac substitutes in machine-manufactured bangle production to reduce material costs while compromising the distinctive natural gloss, thermal properties, and skin-contact safety of genuine handcrafted lac products that have been traditionally worn by Indian women for centuries without adverse dermatological effects due to the natural hypoallergenic properties of purified shellac resin that distinguishes genuine lac from the synthetic resin coatings used in mass-market bangle manufacturing where skin irritation and allergic contact dermatitis reactions have been increasingly reported by consumers purchasing inexpensive machine-manufactured bangles from unregulated retail channels. The lac coating adhesion requirements for Grade A certification mandate minimum adhesion strength of 3.5 newtons per millimetre cross-cut tape test in accordance with IS 16790 Annexure B testing methodology where a standardised lattice pattern of six parallel cuts in each of two perpendicular directions is incised through the lac coating to the substrate surface and adhesive tape is applied over the lattice pattern and then rapidly removed at 90 degrees angle verifying that the lac coating remains adhered to the substrate without flaking, peeling, or delamination across the lattice intersection points confirming the lac-substrate bond strength exceeds the minimum threshold required for the expected service life of authenticated lacquerware products during normal consumer handling, cleaning, and storage conditions.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Cotton Wrap Padded Box Packaging for Lac Bangles Transit</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Cotton wrap padded box packaging with individual compartment dividers has been specifically developed for the Indian lacquerware logistics supply chain to protect the delicate lac surface finish, thin lac bangle walls, and ornamental surface decorations that characterise authentic handcrafted lac bangles and lacquerware objects from the physical and environmental hazards encountered during transit from the artisan production centres in Jaipur, Channapatna, Etikoppaka, Hyderabad, and Saharanpur to domestic retail distribution points across India and international export destinations serving the global Indian diaspora community and international decorative art market. The packaging specification utilises unbleached cotton fabric wrapping material with minimum thread count of 120 threads per square inch providing soft, non-abrasive surface contact protection for the lac coating that prevents the scratching, scuffing, and surface marking that can occur when lac bangles come into contact with harder packaging materials including plastic film wraps, tissue paper, and cardboard surfaces during the vibration and impact forces encountered during road transport along the national highway network connecting the Rajasthan lac bangle production clusters to the major urban distribution hubs of Delhi NCR, Mumbai, Bengaluru, and Chennai. Each lac bangle set is inspected under standardised D65 daylight illumination verifying lac coating surface gloss measured by glossmeter at 60-degree geometry confirming minimum gloss units of 85 GU for Grade A certification, lac coating colour consistency within the established colour tolerance parameters using spectrophotometric measurement with Delta E values below 2.0 CIELAB units, and absence of surface defects including bubbling, peeling, chipping, crazing, or discolouration that would indicate lac quality issues or production defects requiring rejection before the inspected bangle set proceeds to the packaging stage where each individual bangle is wrapped in acid-free tissue paper and placed within a moulded cotton-padded compartment in the multi-compartment bangle box that separates each bangle from adjacent bangles preventing surface-to-surface contact friction damage during transit. The cotton-padded bangle box is then placed within a rigid outer shipping container constructed from 5-millimetre double-wall corrugated fibreboard with thermal insulation bubble wrap liner providing protection against the temperature fluctuations encountered during the Rajasthan-to-Delhi transport corridor where summer temperatures can exceed 45 degrees Celsius in the open cargo compartments of long-distance road transport vehicles creating thermal stress conditions that can cause lac softening, surface tackiness, and colour migration in inadequately protected lac bangle products that require the thermal insulation protection of the cotton wrap padded box packaging system to maintain product quality from the artisan workshop to the retail point of sale where the lac bangle consumer expects the same glossy surface finish and vivid colour intensity that characterises freshly manufactured lac bangles at the point of artisan production.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Lac Surface Authentication & Lacquerware Heritage Market Development</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and optical inspection technologies are being progressively deployed to authenticate Indian lacquerware products and verify the distinctive lac coating characteristics, surface gloss properties, and colour composition signatures that distinguish genuine handcrafted lac bangles and lacquerware objects produced by traditional artisan communities from the growing volume of machine-manufactured plastic and synthetic-resin coated imitations that have increasingly appeared in both domestic Indian handicraft markets and international online retail platforms where consumers seeking authentic Indian lac products face growing difficulty in distinguishing genuine handcrafted lac from synthetic imitations that closely resemble the visual appearance of lac at casual inspection but lack the distinctive material properties of genuine shellac-coated artisan products. The AI authentication system for Indian lacquerware employs high-resolution macro imaging at 200 times magnification combined with polarised light microscopy and Fourier-transform infrared spectroscopy to capture the complete surface morphology and material composition characteristics of lac-coated objects, analysing the lac coating surface texture characteristics where hand-applied lac produces a distinctive micro-texture with characteristic brush application marks and natural surface irregularities reflecting the artisan's hand lacquering technique that differs from the perfectly uniform surface texture of machine-spray-coated synthetic resin imitations where the automated spray application process produces a mechanically uniform coating texture lacking the characteristic hand-applied micro-irregularities of genuine lacquerwork, the lac coating thermal response characteristics where genuine shellac exhibits a characteristic glass transition temperature of 65 to 70 degrees Celsius producing measurable softening behaviour under controlled thermal testing that differs from the higher thermal response temperatures of polyester and polyurethane synthetic resin coatings used in machine-manufactured bangle production, and the lac coating biopolymer spectral signature obtained through FTIR analysis where the distinctive ester carbonyl absorption peak at 1740 reciprocal centimetres and the broad hydroxyl absorption band at 3400 reciprocal centimetres characterise the shellac biopolymer composition and distinguish it from the petroleum-derived synthetic resin compositions used in mass-market bangle manufacturing where the FTIR spectral signature reveals aliphatic hydrocarbon absorption patterns characteristic of polyethylene, polypropylene, and polyester synthetic polymers that have no equivalent in the natural biopolymer composition of genuine shellac lac. The AI-powered lacquerware market development platform connects traditional lacquerware artisan cooperatives in the Jaipur, Channapatna, Etikoppaka, Hyderabad, and Saharanpur clusters directly with institutional buyers including Indian handicraft emporium chains, museum gift shops, ethnic fashion retailers, international decorative art importers, and e-commerce platforms serving the global demand for authentic Indian lacquerware products where the growing consumer awareness of genuine versus synthetic lac distinctions creates premium market positioning opportunities for authenticated artisan lacquerware products bearing the GI Lacquerware Lac Mark and IS 16790 certification that collectively provide the quality assurance framework needed to sustain and expand the market for traditional Indian lac craft in both the domestic and international decorative art markets.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

