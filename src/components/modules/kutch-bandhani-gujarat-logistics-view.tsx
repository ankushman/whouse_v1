import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#9a3412', '#c2410c', '#ea580c', '#f97316', '#fb923c', '#7c2d12', '#431407', '#fff7ed']
const PRODUCTS = ['Kutch Bandhani Silk Saree', 'Gharcholu Wedding Bandhani', 'Kutch Ajrakh Bandhani Dupatta', 'Bandhani Tie-Dye Cotton Suit', 'Kutch Mundani Bandhani Stole', 'Traditional Bandhani Lehenga Set', 'Kutch Chandrakala Bandhani Panel', 'Bandhani Cotton Fabric Roll']
const DYERS = ['Kutch Bandhani Artisan Guild', 'Bhuj Tie-Dye Heritage Society', 'Anjar Bandhani Cooperative', 'Mandvi Traditional Dyers Colony', 'Nakhatrana Bandhani Workshop', 'Rapar Bandhani Art Centre', 'Khavda Kutch Bandhani Studio', 'Gandhidham Bandhani Collective']
const STATUSES = ['GI Kutch Bandhani Mark', 'IS 16917 Bandhani Textile Grade A', 'Cotton Bag with Sawdust Cushion', 'Enclosed Truck Transit', 'Dry Storage 18-30C', 'Dye Penetration QC']

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
    id: `KBN-${String(offset + i + 1).padStart(4, '0')}`,
    dyer: DYERS[(offset + i) % DYERS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 250, ((offset + i) * 37) % 250) + 1,
    cost: ri(600, 38000, ((offset + i) * 13097) % 37400) + 600,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const kutchRecords = [
  { id: 'KBN-0001', dyer: 'Kutch Bandhani Artisan Guild', ware: 'Kutch Bandhani Silk Saree', status: 'GI Kutch Bandhani Mark', qty: 30, cost: 22000, date: '2024-01-10' },
  { id: 'KBN-0002', dyer: 'Bhuj Tie-Dye Heritage Society', ware: 'Gharcholu Wedding Bandhani', status: 'IS 16917 Bandhani Textile Grade A', qty: 18, cost: 32000, date: '2024-01-22' },
  { id: 'KBN-0003', dyer: 'Anjar Bandhani Cooperative', ware: 'Kutch Ajrakh Bandhani Dupatta', status: 'Cotton Bag with Sawdust Cushion', qty: 80, cost: 2800, date: '2024-02-06' },
  { id: 'KBN-0004', dyer: 'Mandvi Traditional Dyers Colony', ware: 'Bandhani Tie-Dye Cotton Suit', status: 'Enclosed Truck Transit', qty: 55, cost: 4500, date: '2024-02-18' },
  { id: 'KBN-0005', dyer: 'Nakhatrana Bandhani Workshop', ware: 'Kutch Mundani Bandhani Stole', status: 'Dry Storage 18-30C', qty: 90, cost: 1800, date: '2024-03-04' },
  { id: 'KBN-0006', dyer: 'Rapar Bandhani Art Centre', ware: 'Traditional Bandhani Lehenga Set', qty: 12, cost: 28000, date: '2024-03-16', status: 'Dye Penetration QC' },
  { id: 'KBN-0007', dyer: 'Khavda Kutch Bandhani Studio', ware: 'Kutch Chandrakala Bandhani Panel', status: 'GI Kutch Bandhani Mark', qty: 20, cost: 15000, date: '2024-03-28' },
  { id: 'KBN-0008', dyer: 'Gandhidham Bandhani Collective', ware: 'Bandhani Cotton Fabric Roll', status: 'IS 16917 Bandhani Textile Grade A', qty: 120, cost: 3200, date: '2024-04-08' },
  { id: 'KBN-0009', dyer: 'Kutch Bandhani Artisan Guild', ware: 'Kutch Ajrakh Bandhani Dupatta', status: 'Cotton Bag with Sawdust Cushion', qty: 70, cost: 2600, date: '2024-04-20' },
  { id: 'KBN-0010', dyer: 'Bhuj Tie-Dye Heritage Society', ware: 'Kutch Bandhani Silk Saree', status: 'Enclosed Truck Transit', qty: 25, cost: 25000, date: '2024-05-02' },
  { id: 'KBN-0011', dyer: 'Anjar Bandhani Cooperative', ware: 'Gharcholu Wedding Bandhani', status: 'Dry Storage 18-30C', qty: 15, cost: 35000, date: '2024-05-15' },
  { id: 'KBN-0012', dyer: 'Mandvi Traditional Dyers Colony', ware: 'Traditional Bandhani Lehenga Set', status: 'Dye Penetration QC', qty: 10, cost: 30000, date: '2024-05-28' },
  { id: 'KBN-0013', dyer: 'Nakhatrana Bandhani Workshop', ware: 'Kutch Chandrakala Bandhani Panel', status: 'GI Kutch Bandhani Mark', qty: 22, cost: 16000, date: '2024-06-10' },
  { id: 'KBN-0014', dyer: 'Rapar Bandhani Art Centre', ware: 'Kutch Mundani Bandhani Stole', status: 'IS 16917 Bandhani Textile Grade A', qty: 100, cost: 1500, date: '2024-06-22' },
  { id: 'KBN-0015', dyer: 'Khavda Kutch Bandhani Studio', ware: 'Bandhani Tie-Dye Cotton Suit', status: 'Cotton Bag with Sawdust Cushion', qty: 60, cost: 4200, date: '2024-07-05' },
  { id: 'KBN-0016', dyer: 'Gandhidham Bandhani Collective', ware: 'Bandhani Cotton Fabric Roll', status: 'Enclosed Truck Transit', qty: 110, cost: 2800, date: '2024-07-16' },
  { id: 'KBN-0017', dyer: 'Kutch Bandhani Artisan Guild', ware: 'Traditional Bandhani Lehenga Set', status: 'Dry Storage 18-30C', qty: 8, cost: 34000, date: '2024-07-24' },
  { id: 'KBN-0018', dyer: 'Bhuj Tie-Dye Heritage Society', ware: 'Gharcholu Wedding Bandhani', status: 'Dye Penetration QC', qty: 14, cost: 36000, date: '2024-08-01' },
  { id: 'KBN-0019', dyer: 'Anjar Bandhani Cooperative', ware: 'Kutch Bandhani Silk Saree', status: 'GI Kutch Bandhani Mark', qty: 28, cost: 24000, date: '2024-08-10' },
  { id: 'KBN-0020', dyer: 'Mandvi Traditional Dyers Colony', ware: 'Kutch Chandrakala Bandhani Panel', status: 'IS 16917 Bandhani Textile Grade A', qty: 18, cost: 18000, date: '2024-08-20' },
]

export default function KutchBandhaniGujaratLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...kutchRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'dyer', label: 'Dyer', options: DYERS.map(d => ({ value: d, label: d, count: allRecords.filter(r => r.dyer === d).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(22, 80, allRecords.length * 0.35 + i * 10) }))
  const dyerChart = DYERS.map(d => ({ name: d.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.dyer === d).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="kbn-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Kutch Bandhani Gujarat' }]} />
      <PageHeader title="Kutch Bandhani Gujarat Logistics" description="Gujarat Kutch bandhani tie-dye supply chain with IS 16917 bandhani textile compliance, dye penetration QC, cotton bag packaging, and GI Kutch Bandhani Mark certification across 8 heritage artisan clusters in Kutch and Bhuj districts" />
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
            <KpiTile label="Dyer Clusters" value={DYERS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={90} />
            <HealthRing label="IS 16917" value={86} />
            <HealthRing label="Cotton" value={82} />
            <HealthRing label="Truck" value={78} />
            <HealthRing label="Storage" value={88} />
            <HealthRing label="Dye" value={93} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="4,000+" />
            <ValueTile label="Kutch District" value="Since 12th C" />
            <ValueTile label="Export Markets" value="22 Countries" />
            <ValueTile label="Annual Revenue" value="₹28 Crore" />
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
            placeholder="Search Kutch bandhani shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-orange-100">
                <tr>
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Ware</th>
                  <th className="p-3 text-left font-medium">Dyer</th>
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
                    <td className="p-3">{record.dyer}</td>
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
              <CardHeader><CardTitle>Dyer Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={dyerChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]}>
                    {dyerChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
              <CardHeader><CardTitle>Kutch Bandhani — 800-Year Gujarati Tie-Dye Art of Bhuj</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Kutch bandhani is one of India's oldest and most vibrant textile dyeing traditions, originating from the Kutch district of Gujarat where the Khatri community of tie-dye artisans has practised this extraordinary craft for over 800 years, creating the distinctive dotted patterns that have become synonymous with Gujarati textile heritage and the colourful cultural identity of the Kutch region. The term bandhani derives from the Hindi word bandhan meaning tying, referring to the labour-intensive resist-dyeing technique where skilled artisans pinch and tightly bind thousands of individual points on the fabric with fine cotton thread before immersing the bundled fabric into dye baths, creating patterns of undyed dots and circles that form elaborate geometric designs, floral motifs, and figurative compositions when the bindings are removed after the dyeing process is complete. A single high-quality bandhani saree can require between 10,000 to 50,000 individual tie points, each tied by hand with remarkable speed and precision by experienced bandhani artisans who develop extraordinary finger dexterity after years of daily practice, with the finest wedding gharcholu pieces featuring up to 75,000 tiny tie points across the full fabric surface creating patterns so intricate they appear like delicate lace work rather than resist-dyed cotton or silk. The traditional bandhani colour palette features deep red, bright yellow, royal blue, emerald green, and stark black against white or cream fabric backgrounds, with multi-coloured pieces requiring multiple tying-and-dyeing cycles where the fabric is progressively tied at different points for each colour application, creating layered patterns of extraordinary complexity and visual richness that are immediately recognisable as authentic Kutch bandhani work. Today approximately 4,000 artisan families across eight heritage clusters in Bhuj, Anjar, Mandvi, Nakhatrana, and surrounding Kutch district villages sustain this tradition, generating an estimated 28 crore rupees annually through domestic bridal and festive markets, government handicraft emporiums, and international demand from fashion designers and textile collectors who value authentic Kutch bandhani as one of India's most iconic and culturally significant textile art forms.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16917 Bandhani Textile Standards & Dye Penetration QC</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">The IS 16917 standard for Kutch bandhani textiles establishes India's first comprehensive quality certification framework for this ancient Gujarati tie-dye craft, ensuring the exceptional dye penetration quality, pattern precision, and colour fastness that distinguish genuine Kutch bandhani from machine-printed dot imitations and lower-quality tie-dye reproductions produced outside the traditional Kutch artisan clusters. The standard specifies detailed requirements for the fabric substrate, mandating fine cotton muslin with minimum thread count of 80 ends per inch for standard bandhani products and 100 ends per inch for premium silk variants, ensuring the fabric accepts the resist-dyeing process without excessive dye bleeding at tie points while maintaining the structural integrity necessary to withstand the extensive pulling and tightening forces applied during the hand-tying of thousands of individual bandhani dot points. Dye quality requirements for Grade A certification mandate direct reactive dyes for cotton and acid dyes for silk with minimum colourfastness ratings of 4 on the ISO 105-C06 washing scale and 5 on the ISO 105-B02 lightfastness scale, ensuring the vibrant bandhani colours resist fading and bleeding through normal wear, washing, and exposure conditions throughout the expected garment lifespan. The critical quality parameter for IS 16917 certification is the dye penetration quality at each tied point, where Grade A certification requires complete dye penetration through the fabric thickness at every dot point with sharp resist boundaries measuring less than 0.3 millimetres of dye feathering beyond the tie point edge, verified through microscopic inspection at 40x magnification at NABL-accredited textile testing laboratories. Any dye feathering exceeding 0.5 millimetres at more than five percent of sampled tie points results in automatic downgrade to Grade B classification, as excessive dye penetration beyond the intended dot boundaries causes the characteristic crisp bandhani pattern to appear blurred and muddied, significantly diminishing both the aesthetic value and market price of the finished bandhani textile product.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Cotton Bag with Sawdust Cushion for Bandhani Textile Transit</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Cotton bag with sawdust cushion packaging has been specifically engineered for Kutch bandhani textiles to protect the delicate tie-dye patterns, fine cotton and silk fabric surfaces, and vibrant resist-dyed colours from physical abrasion, compression damage, and environmental moisture during transit from Kutch district artisan workshops to retail destinations across India and international export markets worldwide. Each individual bandhani textile piece undergoes a careful packaging protocol where the fabric is first inspected for loose threads and untied knots, then gently stuffed with clean, dry sawdust cushioning material that is evenly distributed throughout the fabric length to prevent the thousands of tied bandhani points from being crushed or flattened against each other during transit stacking and compression, preserving the three-dimensional texture of the tie dots that is essential to the visual appeal of premium Kutch bandhani products. The sawdust-stuffed fabric is placed inside a breathable unbleached cotton drawstring bag that provides a protective enclosure while allowing air circulation to prevent moisture buildup within the packaging that could cause dye bleeding or fungal growth on the untreated fabric surfaces. The cotton bags are packed in layers within corrugated shipping cartons with additional sawdust-filled cushion bags between layers to prevent compression damage when multiple bandhani pieces are stacked for transit, and silica gel desiccant packets rated for 50 gram absorption capacity per carton are included to maintain relative humidity below 40% during transit, particularly critical during the Kutch monsoon season from June through September when atmospheric humidity routinely exceeds 85% and poses significant risk to the reactive dye stability in freshly produced bandhani textiles. This cotton bag and sawdust cushion packaging system has been validated to ISTA 3A transit simulation protocols, demonstrating capability to withstand stacking compression of 200 kilograms and road vibration equivalent to 3,000 kilometres of transit without any bandhani pattern damage, reducing the historical transit damage rate for Kutch bandhani textiles from 13% to under 2% since its adoption across the certified supply chain.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Dot Pattern Verification & Kutch Bandhani Market Expansion</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and advanced imaging technologies are introducing transformative quality assurance capabilities to the Kutch bandhani craft, where the precision of individual tie-dot patterns, dye penetration consistency, and overall design symmetry that define the highest quality bandhani pieces have traditionally required decades of master artisan experience to evaluate and grade consistently across the diverse production workshops spread across the vast Kutch district. The AI bandhani verification system employs high-resolution flatbed scanning at 2400 dots per inch to capture detailed images of finished bandhani textiles, analysing every individual tie-dot point across the fabric surface with precision to 0.02 millimetres, measuring dot circularity, diameter uniformity, dye penetration sharpness, and pattern spacing consistency to detect irregularities such as uneven dot sizes, incomplete dye penetration at tie points, excessive dye feathering at pattern boundaries, or symmetry deviations that indicate either substandard tying technique or improper dyeing conditions during the production process. Computer vision algorithms trained on over 22,000 authenticated Kutch bandhani pattern compositions can verify design authenticity by comparing dot pattern density, colour palette accuracy, traditional motif geometry, and overall compositional symmetry against a reference database of master artisan works from each of the eight Kutch heritage clusters, providing objective quality grading that supplements traditional assessment by experienced bandhani craft evaluators who have historically relied on subjective visual inspection to determine quality grades for this intricate tie-dye textile art. The Gujarat State Khadi and Village Industries Board has piloted this AI verification in its export certification pipeline for Kutch bandhani, reducing quality rejection rates at government Gurjari emporiums from 18% to under 4% while accelerating the certification process from 7 working days to under 36 hours for qualifying bandhani shipments. India's GI protection for Kutch bandhani combined with digital authentication has expanded export partnerships with international fashion houses and textile galleries in the United Kingdom, France, the United States, Japan, and Australia who demand verifiable provenance certificates and quality grading documentation for authentic Kutch bandhani pieces that command premium pricing from 8,000 to over 50,000 rupees per saree depending on dot density, colour complexity, and pattern intricacy.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
