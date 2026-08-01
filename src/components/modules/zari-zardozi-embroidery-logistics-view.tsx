import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#722f37', '#88333d', '#a33a46', '#be4450', '#d94f5a', '#521e24', '#622830', '#fce7f1']
const PRODUCTS = ['Real Zari Silk Saree', 'Zardozi Bridal Lehenga', 'Kundan Zari Dupatta', 'Gold Thread Brocade Panel', 'Zari Pashmina Shawl', 'Silver Zari Embroidered Panel', 'Zardozi Clutch Bag', 'Zari Lace Trim Roll']
const ARTISANS = ['Surat Zari Mills Guild', 'Varanasi Brocade Art Society', 'Bhagalpur Silk Cluster Cooperative', 'Kanchipuram Zari Heritage Studio', 'Murshidabad Zardozi Workshop', 'Jaipur Kundan Art Centre', 'Lucknow Chikan Zari Colony', 'Mysore Palace Zari Atelier']
const STATUSES = ['GI Zari Certified', 'BIS Gold Purity 92%', 'Silk Folded Box Pack', 'Padded Truck Transit', 'Dehumid Vault Store 20-25C', 'Thread Count QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-rose-100 text-rose-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-rose-200 rounded-full overflow-hidden"><div className="h-full bg-rose-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fce7f1" strokeWidth="6" />
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
    id: `ZZE-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 32, ((offset + i) * 29) % 32) + 1,
    cost: ri(8000, 96000, ((offset + i) * 14389) % 88000) + 8000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const zariRecords = [
  { id: 'ZZE-0001', painter: 'Surat Zari Mills Guild', ware: 'Real Zari Silk Saree', status: 'GI Zari Certified', qty: 4, cost: 92000, date: '2024-01-08' },
  { id: 'ZZE-0002', painter: 'Varanasi Brocade Art Society', ware: 'Zardozi Bridal Lehenga', status: 'BIS Gold Purity 92%', qty: 2, cost: 95000, date: '2024-01-22' },
  { id: 'ZZE-0003', painter: 'Bhagalpur Silk Cluster Cooperative', ware: 'Kundan Zari Dupatta', status: 'Silk Folded Box Pack', qty: 6, cost: 38000, date: '2024-02-05' },
  { id: 'ZZE-0004', painter: 'Kanchipuram Zari Heritage Studio', ware: 'Gold Thread Brocade Panel', status: 'Padded Truck Transit', qty: 3, cost: 78000, date: '2024-02-18' },
  { id: 'ZZE-0005', painter: 'Murshidabad Zardozi Workshop', ware: 'Zari Pashmina Shawl', status: 'Dehumid Vault Store 20-25C', qty: 5, cost: 55000, date: '2024-03-02' },
  { id: 'ZZE-0006', painter: 'Jaipur Kundan Art Centre', ware: 'Silver Zari Embroidered Panel', status: 'Thread Count QC', qty: 8, cost: 28000, date: '2024-03-15' },
  { id: 'ZZE-0007', painter: 'Lucknow Chikan Zari Colony', ware: 'Zardozi Clutch Bag', status: 'GI Zari Certified', qty: 10, cost: 18000, date: '2024-03-28' },
  { id: 'ZZE-0008', painter: 'Mysore Palace Zari Atelier', ware: 'Zari Lace Trim Roll', status: 'BIS Gold Purity 92%', qty: 12, cost: 15000, date: '2024-04-10' },
  { id: 'ZZE-0009', painter: 'Surat Zari Mills Guild', ware: 'Zardozi Bridal Lehenga', status: 'Silk Folded Box Pack', qty: 2, cost: 94000, date: '2024-04-22' },
  { id: 'ZZE-0010', painter: 'Varanasi Brocade Art Society', ware: 'Real Zari Silk Saree', status: 'Padded Truck Transit', qty: 4, cost: 68000, date: '2024-05-05' },
  { id: 'ZZE-0011', painter: 'Bhagalpur Silk Cluster Cooperative', ware: 'Kundan Zari Dupatta', status: 'Dehumid Vault Store 20-25C', qty: 6, cost: 42000, date: '2024-05-18' },
  { id: 'ZZE-0012', painter: 'Kanchipuram Zari Heritage Studio', ware: 'Gold Thread Brocade Panel', status: 'Thread Count QC', qty: 3, cost: 82000, date: '2024-05-30' },
  { id: 'ZZE-0013', painter: 'Murshidabad Zardozi Workshop', ware: 'Zari Pashmina Shawl', status: 'GI Zari Certified', qty: 5, cost: 50000, date: '2024-06-12' },
  { id: 'ZZE-0014', painter: 'Jaipur Kundan Art Centre', ware: 'Silver Zari Embroidered Panel', status: 'BIS Gold Purity 92%', qty: 7, cost: 32000, date: '2024-06-24' },
  { id: 'ZZE-0015', painter: 'Lucknow Chikan Zari Colony', ware: 'Zardozi Clutch Bag', status: 'Silk Folded Box Pack', qty: 10, cost: 20000, date: '2024-07-06' },
  { id: 'ZZE-0016', painter: 'Mysore Palace Zari Atelier', ware: 'Zari Lace Trim Roll', status: 'Padded Truck Transit', qty: 12, cost: 14000, date: '2024-07-18' },
  { id: 'ZZE-0017', painter: 'Surat Zari Mills Guild', ware: 'Real Zari Silk Saree', status: 'Dehumid Vault Store 20-25C', qty: 4, cost: 88000, date: '2024-07-30' },
  { id: 'ZZE-0018', painter: 'Varanasi Brocade Art Society', ware: 'Zardozi Bridal Lehenga', status: 'Thread Count QC', qty: 2, cost: 96000, date: '2024-08-10' },
  { id: 'ZZE-0019', painter: 'Bhagalpur Silk Cluster Cooperative', ware: 'Kundan Zari Dupatta', status: 'GI Zari Certified', qty: 6, cost: 44000, date: '2024-08-22' },
  { id: 'ZZE-0020', painter: 'Kanchipuram Zari Heritage Studio', ware: 'Gold Thread Brocade Panel', status: 'BIS Gold Purity 92%', qty: 3, cost: 76000, date: '2024-09-03' },
]

export default function ZariZardoziEmbroideryLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...zariRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])


  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'painter', label: 'Painter', options: ARTISANS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.painter === p).length })) },
  ]


  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(5, 28, allRecords.length * 0.14 + i * 4) }))
  const artisanChart = ARTISANS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.painter === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))


  return (
    <div className="zem-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Zari & Zardozi Embroidery' }]} />
      <PageHeader title="Zari & Zardozi Embroidery Logistics" description="Indian Zari and Zardozi metallic thread embroidery supply chain with BIS gold purity certification, thread count QC, silk folded box packaging, and GI Zari Mark across 8 heritage artisan clusters in Surat, Varanasi, Kanchipuram, and Lucknow" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-rose-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Shipments" value={allRecords.length} />
            <KpiTile label="Active Ware" value={PRODUCTS.length} />
            <KpiTile label="Artisan Clusters" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={95} />
            <HealthRing label="BIS 92%" value={90} />
            <HealthRing label="Silk" value={87} />
            <HealthRing label="Padded" value={83} />
            <HealthRing label="Vault" value={89} />
            <HealthRing label="Thread" value={92} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="500+" />
            <ValueTile label="Tradition" value="Since Mughal Era" />
            <ValueTile label="Export Markets" value="15 Countries" />
            <ValueTile label="Annual Revenue" value="₹8.5 Crore" />
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
            placeholder="Search Zari and Zardozi embroidery shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-rose-100">
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
                  <tr key={record.id} className="border-t hover:bg-rose-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.ware} /></td>
                    <td className="p-3">{record.painter}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['pcs', 'sets', 'meters', 'rolls'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Zari & Zardozi — Mughal-Era Metallic Thread Embroidery Heritage</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Zari and Zardozi embroidery represents one of the most opulent and technically demanding textile art traditions in the Indian subcontinent, having been continuously practised for over five centuries since its introduction to India during the Mughal imperial period when Persian master embroiderers brought the technique of creating intricate metallic thread embroidery designs to the royal Mughal court workshops of Agra, Delhi, and Lahore in the sixteenth century CE, establishing an artisanal tradition that subsequently spread across the major textile production centres of India including Varanasi where the Brocade weaving community adapted the Zari technique to create the legendary Banarasi Zari silk saris that remain among the most prized bridal textiles in Indian wedding culture, Surat where the Zari thread manufacturing industry produces the finest quality metallic yarn used across India's textile embroidery sector, Kanchipuram where the temple city silk weavers incorporate Zari borders into the iconic Kanchipuram silk saris that define South Indian bridal tradition, and Lucknow where the Chikan embroidery artisans combine delicate white thread shadow work with Zari accent borders creating the elegant Lucknow Chikan Zari aesthetic that is sought after by discerning textile collectors worldwide. The Zari technique involves the creation of metallic thread from pure gold or silver that is drawn through progressively finer dies to produce extremely thin metallic wire which is then wound around a core silk or cotton yarn to create the Zari thread that forms the basis of both Zari weaving and Zardozi embroidery techniques. In authentic Zari production, the gold or silver content of the metallic wire must meet the BIS certification standard of minimum 92% precious metal purity for GI-certified Zari thread used in premium textile applications including bridal saris, temple hangings, and royal ceremonial textiles where the gold or silver content directly determines the luminosity, durability, and market value of the finished Zari embroidery work. The Zardozi embroidery technique extends the Zari weaving tradition into the domain of three-dimensional surface embroidery where the Zari thread is combined with additional decorative materials including pearl beads or moti, precious and semi-precious stones or kundan, sequins or sitara, and coiled metallic wire or dabka to create elaborate raised embroidery designs that stand above the fabric surface creating a sculptural textile art form that has been used for centuries to create the elaborate bridal lehengas, royal court costumes, temple deity garments, and ceremonial textile furnishings that characterise the highest expressions of Indian textile artistry where the Zardozi master artisan must possess extraordinary technical skill in needlework, metal thread manipulation, and decorative stone setting to produce the intricate multi-layered embroidery compositions that define the Zardozi aesthetic vocabulary derived from the Mughal court artistic tradition of floral arabesques, hunting scenes, and palace garden motifs that continue to inspire contemporary Zardozi artisans across the five hundred active artisan families working in the major Zari and Zardozi production centres of India.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>BIS Gold Purity Standards & Thread Count QC for Zari Embroidery</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The Bureau of Indian Standards gold purity certification framework for Zari metallic thread establishes the quality benchmark that distinguishes authentic Zari embroidery textiles created with genuine precious metal thread from the growing volume of imitation Zari textiles produced with synthetic metallic yarns containing no gold or silver content that have increasingly appeared in both the domestic Indian textile market and international online retail platforms serving the Indian diaspora community and global textile art collectors who seek authenticated Zari and Zardozi embroidery for bridal wear, ceremonial use, and institutional collection purposes. The BIS certification standard for GI-certified Zari thread mandates minimum gold purity of 92% for gold Zari thread and minimum silver purity of 92% for silver Zari thread verified through fire assay testing and X-ray fluorescence spectroscopy confirming the precious metal content meets the certification threshold while also verifying the absence of hazardous metal contaminants including cadmium, lead, and nickel that are prohibited in textile applications under the Indian textile safety regulations. The thread count quality control standards for Zari weaving specify minimum thread density of 120 threads per inch in the Zari border weave section and minimum of 80 threads per inch in the main body fabric section of authentic Banarasi Zari silk saris, with the Zari thread comprising no less than 15% of the total thread count in the border section ensuring sufficient metallic thread density to produce the characteristic luminous Zari border pattern that defines the Banarasi Zari silk sari aesthetic. Thread count verification is performed using a standardised linen tester magnification device at 10x magnification counting the individual thread intersections within a one-inch square area at five randomly selected positions across the Zari border section and three positions across the body fabric section, with minimum thread count compliance required at all measurement positions to achieve the GI Banarasi Zari certification status that enables premium market pricing and international collector recognition. The Zardozi embroidery thread count standards specify minimum needle density of 250 stitches per square centimetre for Grade A Zardozi embroidery where the intricate raised metal thread patterns must achieve sufficient stitch density to produce a continuous metallic surface that fully conceals the base fabric within the embroidered design area, with supplementary materials including kundan stones, sequins, and dabka coils counted as additional decorative density elements that must meet minimum per-square-centimetre density requirements specified in the IS certification standard for each Zardozi embroidery grade classification that distinguishes masterwork-level Zardozi from commercial-grade production used in fashion and bridal wear applications.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Silk Folded Box Packaging for Zari and Zardozi Textile Transit</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Silk folded box packaging with acid-free tissue interleaving has been specifically developed for the Zari and Zardozi embroidery logistics supply chain to protect the delicate metallic thread surfaces, raised Zardozi embroidery elements, Kundan stone settings, and silk fabric substrates that characterise authentic Zari and Zardozi textiles from the physical and environmental hazards encountered during transit from the artisan production centres in Varanasi, Surat, Lucknow, and Kanchipuram to domestic bridal and ceremonial textile retailers across Mumbai, Delhi, Kolkata, and Chennai, and international export destinations serving the Indian diaspora bridal market in the United States, United Kingdom, Canada, the Gulf Cooperation Council states, and Southeast Asia where Zari and Zardozi embroidery textiles are in high demand for wedding trousseau, festival ceremonial wear, and temple deity garment applications that require pristine preservation conditions during international shipping through multiple climatic zones. The packaging specification utilises acid-free tissue paper of minimum 40 GSM with pH range 6.5 to 7.5 as the primary interleaving material providing a chemically inert protective layer that prevents metallic thread tarnishing, silk fabric acid degradation, and Kundan stone setting adhesive softening during transit through the variable humidity conditions encountered along the supply chain from the artisan workshop to the end consumer. Each Zari or Zardozi textile is inspected under standardised D65 daylight illumination verifying metallic thread surface integrity and luminosity, Zardozi embroidery dimension stability and stone setting security, silk fabric colour fastness and weave quality, and overall artistic quality before being carefully folded using the traditional bias-fold technique where the textile is folded diagonally at 45 degrees to the warp-weft grain direction minimising crease stress on both the silk fabric substrate and the Zari metallic thread patterns that are particularly susceptible to kinking and breakage when folded along the warp or weft direction where the metallic thread experiences maximum tensile stress at the fold point. The folded textile with acid-free tissue interleave at each fold layer is placed within a rigid inner box constructed from 2.5-millimetre acid-free greyboard with smooth inner surface finish preventing abrasion damage to the Zardozi raised embroidery elements during transit, then sealed within a moisture-barrier outer shipping container constructed from 5-millimetre double-wall corrugated fibreboard with silica gel desiccant packets maintaining relative humidity below 45% protecting against metallic thread tarnishing caused by atmospheric sulphur compounds and humidity condensation that would compromise the gold or silver Zari thread luminosity and the Kundan stone setting adhesive stability during the extended transit periods required for international shipping to overseas markets where Zari and Zardozi bridal textiles command premium prices reflecting the extraordinary artisan skill and precious material content that defines this irreplaceable Indian textile embroidery heritage tradition.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Metallic Thread Analysis & Zari Heritage Market Expansion</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and computational image analysis technologies are being progressively deployed to authenticate Zari and Zardozi embroidery textiles and verify the distinctive metallic thread composition characteristics, embroidery stitch density patterns, and Mughal-era design vocabulary elements that distinguish genuine Zari and Zardozi textiles created by traditional artisan families from the growing volume of synthetic metallic yarn textiles and machine-embroidered imitations that have increasingly appeared in both the domestic Indian bridal textile market and international online retail platforms serving the global demand for Indian metallic thread embroidery art. The AI authentication system for Zari and Zardozi employs ultra-high-resolution scanning at 1200 dots per inch combined with energy-dispersive X-ray spectroscopy mapping to verify the metallic thread composition across the entire embroidered surface, analysing the gold or silver content distribution patterns characteristic of authentic hand-drawn Zari thread where the precious metal wire exhibits subtle diameter variations of plus or minus 2 micrometres reflecting the traditional die-drawing process that cannot be replicated by the uniform diameter of synthetic metallic yarn produced by industrial extrusion processes, the embroidery stitch density and directional pattern characteristics where hand-embroidered Zardozi exhibits subtle stitch spacing variations reflecting the individual artisan's rhythmic needlework tempo that produces distinctive density gradients across the embroidered surface that differ from the mathematically uniform stitch spacing of computerised embroidery machines, and the Kundan stone setting quality characteristics where hand-set Kundan stones exhibit subtle placement angle variations reflecting the artisan's manual stone positioning technique that differs from the precisely aligned stone placement of machine-set rhinestone imitations used on commercial-grade Zardozi reproductions. Machine learning algorithms trained on authenticated Zari and Zardozi reference samples from all major production centres including Varanasi, Surat, Lucknow, Kanchipuram, and Jaipur can verify textile authenticity with 96% accuracy by detecting subtle artisan signatures including the metallic thread surface texture characteristics where authentic gold Zari thread exhibits a microscopically granular surface texture from the traditional hand-hammering and die-drawing processes that differs fundamentally from the smooth metallic sheen of synthetic polyester metallic yarn, the Zardozi embroidery layer structure characteristics where authentic hand-embroidered Zardozi produces a three-dimensional raised surface profile with variable heights reflecting the individual artisan's stitch tension control during the multi-layer embroidery construction process where each design element may require five to eight separate embroidery passes building up the raised surface incrementally, and the overall design compositional accuracy within the established Mughal-era Zardozi design canons that define the spatial arrangement of floral motifs, geometric border patterns, and decorative dividers according to the specific visual vocabulary maintained across the approximately five hundred active artisan families in India's major Zari and Zardozi production centres where this extraordinary Mughal-era metallic thread embroidery heritage tradition continues to produce some of the world's most technically sophisticated and visually opulent textile art objects.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

