import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#be123c', '#e11d48', '#f43f5e', '#fb7185', '#fecdd3', '#9f1239', '#881337', '#fff1f2']
const PRODUCTS = ['Roghan Tree of Life Panel', 'Roghan Peacock Motif Art', 'Kutch Roghan Camel Caravan Scene', 'Roghan Floral Border Textile', 'Sacred Bull Roghan Fabric Art', 'Roghan Desert Village Landscape', 'Mirror Work Roghan Frame Panel', 'Roghan Royal Procession Textile']
const ARTISANS = ['Nirona Roghan Art Village', 'Bhuj Roghan Craft Centre', 'Anjar Traditional Roghan Guild', 'Mandvi Roghan Handprint Studio', 'Nakhatrana Artisan Cooperative', 'Bhachau Folk Art Cluster', 'Rapar Desert Artists Society', 'Khavda Roghan Heritage Collective']
const STATUSES = ['GI Roghan Paint Mark', 'IS 16794 Fabric Grade A', 'Cotton Fabric Flat Wrap', 'Palletised Truck Transit', 'Dry Storage 20-28C', 'Oil Pigment Adhesion QC']

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
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fff1f2" strokeWidth="6" />
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
    id: `RPG-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 35, ((offset + i) * 31) % 35) + 1,
    cost: ri(5000, 98000, ((offset + i) * 14173) % 93000) + 5000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const roghanRecords = [
  { id: 'RPG-0001', painter: 'Nirona Roghan Art Village', ware: 'Roghan Tree of Life Panel', status: 'GI Roghan Paint Mark', qty: 3, cost: 88000, date: '2024-01-10' },
  { id: 'RPG-0002', painter: 'Bhuj Roghan Craft Centre', ware: 'Roghan Peacock Motif Art', status: 'IS 16794 Fabric Grade A', qty: 5, cost: 72000, date: '2024-01-22' },
  { id: 'RPG-0003', painter: 'Anjar Traditional Roghan Guild', ware: 'Kutch Roghan Camel Caravan Scene', status: 'Cotton Fabric Flat Wrap', qty: 7, cost: 55000, date: '2024-02-04' },
  { id: 'RPG-0004', painter: 'Mandvi Roghan Handprint Studio', ware: 'Roghan Floral Border Textile', status: 'Palletised Truck Transit', qty: 4, cost: 82000, date: '2024-02-16' },
  { id: 'RPG-0005', painter: 'Nakhatrana Artisan Cooperative', ware: 'Sacred Bull Roghan Fabric Art', status: 'Dry Storage 20-28C', qty: 6, cost: 65000, date: '2024-02-28' },
  { id: 'RPG-0006', painter: 'Bhachau Folk Art Cluster', ware: 'Roghan Desert Village Landscape', status: 'Oil Pigment Adhesion QC', qty: 8, cost: 48000, date: '2024-03-12' },
  { id: 'RPG-0007', painter: 'Rapar Desert Artists Society', ware: 'Mirror Work Roghan Frame Panel', status: 'GI Roghan Paint Mark', qty: 2, cost: 95000, date: '2024-03-24' },
  { id: 'RPG-0008', painter: 'Khavda Roghan Heritage Collective', ware: 'Roghan Royal Procession Textile', status: 'IS 16794 Fabric Grade A', qty: 9, cost: 35000, date: '2024-04-06' },
  { id: 'RPG-0009', painter: 'Nirona Roghan Art Village', ware: 'Roghan Peacock Motif Art', status: 'Cotton Fabric Flat Wrap', qty: 5, cost: 70000, date: '2024-04-18' },
  { id: 'RPG-0010', painter: 'Bhuj Roghan Craft Centre', ware: 'Roghan Tree of Life Panel', status: 'Palletised Truck Transit', qty: 4, cost: 85000, date: '2024-05-01' },
  { id: 'RPG-0011', painter: 'Anjar Traditional Roghan Guild', ware: 'Kutch Roghan Camel Caravan Scene', status: 'Dry Storage 20-28C', qty: 7, cost: 52000, date: '2024-05-13' },
  { id: 'RPG-0012', painter: 'Mandvi Roghan Handprint Studio', ware: 'Roghan Floral Border Textile', status: 'Oil Pigment Adhesion QC', qty: 6, cost: 68000, date: '2024-05-26' },
  { id: 'RPG-0013', painter: 'Nakhatrana Artisan Cooperative', ware: 'Sacred Bull Roghan Fabric Art', status: 'GI Roghan Paint Mark', qty: 3, cost: 92000, date: '2024-06-08' },
  { id: 'RPG-0014', painter: 'Bhachau Folk Art Cluster', ware: 'Roghan Desert Village Landscape', status: 'IS 16794 Fabric Grade A', qty: 8, cost: 40000, date: '2024-06-20' },
  { id: 'RPG-0015', painter: 'Rapar Desert Artists Society', ware: 'Mirror Work Roghan Frame Panel', status: 'Cotton Fabric Flat Wrap', qty: 10, cost: 28000, date: '2024-07-03' },
  { id: 'RPG-0016', painter: 'Khavda Roghan Heritage Collective', ware: 'Roghan Royal Procession Textile', status: 'Palletised Truck Transit', qty: 5, cost: 75000, date: '2024-07-15' },
  { id: 'RPG-0017', painter: 'Nirona Roghan Art Village', ware: 'Roghan Floral Border Textile', status: 'Dry Storage 20-28C', qty: 4, cost: 80000, date: '2024-07-28' },
  { id: 'RPG-0018', painter: 'Bhuj Roghan Craft Centre', ware: 'Roghan Tree of Life Panel', status: 'Oil Pigment Adhesion QC', qty: 7, cost: 58000, date: '2024-08-09' },
  { id: 'RPG-0019', painter: 'Anjar Traditional Roghan Guild', ware: 'Roghan Peacock Motif Art', status: 'GI Roghan Paint Mark', qty: 6, cost: 62000, date: '2024-08-22' },
  { id: 'RPG-0020', painter: 'Mandvi Roghan Handprint Studio', ware: 'Kutch Roghan Camel Caravan Scene', status: 'IS 16794 Fabric Grade A', qty: 4, cost: 87000, date: '2024-09-03' },
]

export default function RoghanPaintingGujaratLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...roghanRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'painter', label: 'Painter', options: ARTISANS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.painter === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(5, 30, allRecords.length * 0.14 + i * 4) }))
  const artisanChart = ARTISANS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.painter === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="rpg-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Roghan Painting Gujarat' }]} />
      <PageHeader title="Roghan Painting Gujarat Logistics" description="Roghan hand-printed fabric art supply chain with IS 16794 fabric grade compliance, oil pigment adhesion QC, cotton fabric flat wrap packaging, and GI Roghan Paint Mark certification across 8 heritage artisan clusters in Kutch district, Gujarat" />
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
            <HealthRing label="IS 16794" value={90} />
            <HealthRing label="Fabric" value={87} />
            <HealthRing label="Truck" value={84} />
            <HealthRing label="Dry Store" value={91} />
            <HealthRing label="Pigment" value={93} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="15+" />
            <ValueTile label="Roghan Tradition" value="Since 17th C" />
            <ValueTile label="Export Markets" value="12 Countries" />
            <ValueTile label="Annual Revenue" value="₹3.5 Crore" />
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
            placeholder="Search Roghan painting shipments..."
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
              <CardHeader><CardTitle>Roghan Painting — 400-Year Kutch Hand-Printed Fabric Art Tradition</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Roghan painting is one of India's most rare and visually stunning textile art traditions, practised exclusively by the Khatri Muslim artisan community of the Nirona village in the Kutch district of Gujarat, where this extraordinary freehand fabric painting technique has been transmitted through generations of master artisan families for over four centuries since the technique was brought to Kutch by the Khatri community's ancestors who migrated from the Sindh region of present-day Pakistan during the medieval period carrying with them the secret knowledge of castor oil-based pigment preparation and metal stylus application that remains the distinguishing technical hallmark of genuine Roghan painting and cannot be replicated by any mechanical or digital printing process developed in modern textile manufacturing. The Roghan technique involves the preparation of a unique pigment medium by boiling castor oil over a low flame for approximately twelve hours until it achieves a thick honey-like consistency, then mixing this castor oil base with natural mineral pigments sourced from the mineral-rich Kutch terrain including red ochre from the Rann of Kutch salt flats, yellow orpiment from the Bhuj geological formations, indigo blue from cultivated indigo plantations in the region, and genuine 22-carat gold powder for premium gilded Roghan pieces that command the highest prices in both domestic and international art markets. The artisan applies this pigment medium onto cotton or silk fabric surfaces using a specially crafted metal stylus known as a kalam that features an extremely fine blunt tip capable of depositing pigment threads of extraordinary fineness measuring less than 0.3 millimetres in width, creating the intricate floral, animal, and geometric patterns that characterise the Roghan painting vocabulary through a unique technique where the artisan picks up wet pigment threads from the prepared pigment palette using the stylus tip and transfers them onto the fabric surface in continuous flowing lines that produce the distinctive thick raised texture of genuine Roghan painted designs that can be both seen and felt on the fabric surface creating a three-dimensional quality unique among Indian textile art traditions.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16794 Fabric Standards & Oil Pigment Adhesion QC</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">The IS 16794 standard for Roghan painted fabric establishes India's quality certification framework for this unique Kutch textile art tradition, specifying requirements for castor oil pigment medium preparation, metal stylus application technique verification, fabric substrate quality, pigment adhesion durability, and colour fastness testing that collectively distinguish genuine hand-applied Roghan painted textiles from block-printed, screen-printed, and digital-printed imitations that have increasingly attempted to replicate the distinctive raised texture and intricate pattern work of genuine Roghan art in both domestic Indian textile retail markets and international online fashion and home decor marketplaces targeting consumers seeking authentic Indian handcraft textile products. The castor oil pigment medium requirements for IS 16794 Grade A certification mandate exclusively cold-pressed castor oil extracted from Ricinus communis seeds sourced from the Gujarat castor cultivation belt, boiled to specified viscosity range measured at 12,000 to 18,000 centipoise at 25 degrees Celsius using calibrated Brookfield viscometer, with minimum pigment concentration of 35% by weight for the final pigment medium ensuring adequate colour intensity and opacity on fabric substrates. Oil pigment adhesion testing for Grade A certification mandates crocking resistance testing per AATCC TM8 with minimum dry crocking rating of 4 and wet crocking rating of 3 on the 1-5 classification scale, ensuring that the raised Roghan pigment patterns maintain structural integrity and colour transfer resistance under both dry rubbing conditions encountered during normal handling and wet exposure conditions that may occur during cleaning or transit through humid tropical conditions. Additional colour fastness requirements include light fastness minimum rating of 5 on the 1-8 blue wool scale per AATCC TM16, wash fastness minimum rating of 4 per AATCC TM61, and perspiration fastness minimum rating of 4 per AATCC TM15, confirming that genuine Roghan painted textiles maintain their visual quality and raised pigment texture through the full range of environmental exposures encountered during normal use, display, cleaning, and transit operations in the Roghan art logistics supply chain.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Cotton Fabric Flat Wrap Packaging for Roghan Painted Textiles</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Cotton fabric flat wrap packaging has been specifically developed for the Roghan painted textile logistics supply chain to protect the extraordinarily delicate raised castor oil pigment surfaces, intricate metal stylus-applied patterns, and fine cotton or silk fabric substrates that characterise genuine Roghan painted textiles from the physical and environmental hazards encountered during transit from the Nirona village artisan workshops in Kutch district to domestic retail destinations across Gujarat, Rajasthan, and Maharashtra and international export markets in North America, Europe, Japan, and Australia where Roghan painted textiles are increasingly sought by museum textile curators, fashion designers, and collectors of Indian heritage textile art for their unique raised texture and extraordinary hand-crafted quality that cannot be replicated by any mechanical printing technology available in the global textile manufacturing industry. The flat wrap packaging specification employs unbleached cotton muslin fabric with minimum grammage of 120 GSM and pH range 6.5 to 7.5 providing a soft non-abrasive wrapping material that protects the raised Roghan pigment surfaces from friction damage during transit while allowing the fabric to breathe preventing moisture condensation that could cause castor oil pigment softening or fabric substrate degradation during extended storage or transit through the humid coastal conditions of the Kutch and Saurashtra regions of Gujarat where relative humidity regularly exceeds 80% during the monsoon season from June through September. Each Roghan painted textile is first inspected under standardised lighting conditions to verify pigment surface integrity, raised pattern completeness, fabric substrate condition, and overall compositional quality before being rolled around a custom-cut acid-free cardboard tube with the painted surface facing outward to prevent pigment-to-pigment contact that could cause sticking or smudging, then wrapped in the protective cotton muslin flat wrap with additional acid-free tissue interleaving at the overlap point and secured with cotton tying tape avoiding any synthetic adhesive materials that could cause chemical interaction with the castor oil pigment medium during extended transit or storage periods.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Stylus Pattern Verification & Roghan Heritage Market Development</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and advanced surface topography analysis technologies are being deployed to authenticate Roghan painted textiles and verify the distinctive metal stylus application patterns, castor oil pigment thread characteristics, and raised texture profile that distinguish genuine hand-applied Roghan painted textiles from the growing volume of block-printed, screen-printed, and digitally printed imitations that have increasingly attempted to replicate the visual appearance of Roghan art without achieving its characteristic three-dimensional raised texture and hand-crafted pattern irregularities that are the hallmark signatures of genuine Roghan painting produced by the few remaining master artisans of the Nirona village Khatri community in Kutch district. The AI verification system for Roghan art employs three-dimensional laser surface profilometry at 10-micron lateral resolution to capture the complete surface topography of finished Roghan painted textiles, analysing the raised pigment profile height distribution, pattern line width variation characteristics, castor oil pigment thread continuity patterns, and surface roughness parameters against a comprehensive reference database containing authenticated Roghan masterworks from the seven surviving master artisan families of Nirona village whose collective output represents the entire production capacity of genuine Roghan painting worldwide estimated at approximately 200 to 300 pieces per year across all working artisans. Machine learning algorithms trained on this reference database can verify Roghan painting authenticity with 97% accuracy by detecting the characteristic hand-application signatures including the subtle height variation along pigment threads reflecting the artisan's finger pressure changes during kalam stylus application, the natural slight wavering of pattern lines that distinguishes hand-drawn metal stylus work from the mechanically uniform lines produced by block or screen printing processes, and the specific surface roughness parameters of the castor oil pigment medium that differ measurably from synthetic polymer-based printing inks used in textile reproduction processes through quantitative profilometry analysis comparing sample surface measurements against authenticated reference surface profiles maintained in the IS 16794 standard appendix.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
