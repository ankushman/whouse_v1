import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#7c2d12', '#92400e', '#b45309', '#d97706', '#f59e0b', '#78350f', '#451a03', '#fffbeb']
const PRODUCTS = ['Jaipur Miniature Radha Krishna', 'Udaipur Mewar Court Scene', 'Jodhpur Marwar Hunting Panel', 'Bundi Ragamala Painting', 'Kishangarh Bani Thani Portrait', 'Jaipur Royal Procession Scroll', 'Rajasthani Pichwai Miniature', 'Jaisalmer Desert Life Panel']
const PAINTERS = ['Jaipur Miniature Art Guild', 'Udaipur Mewar Painters Society', 'Jodhpur Marwar Heritage Artists', 'Bundi Ragamala Art Centre', 'Kishangarh Bani Thani Studio', 'Nathdwara Pichwai Painters', 'Jaisalmer Desert Art Cooperative', 'Sawai Madhopur Miniature Colony']
const STATUSES = ['GI Rajasthan Miniature Mark', 'IS 16918 Miniature Art Grade A', 'Foam-Lined Wooden Crate', 'Temperature-Controlled Van Transit', 'Dry Storage 20-28C', 'Natural Pigment Adhesion QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-amber-200 rounded-full overflow-hidden"><div className="h-full bg-amber-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fffbeb" strokeWidth="6" />
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
    id: `MPR-${String(offset + i + 1).padStart(4, '0')}`,
    painter: PAINTERS[(offset + i) % PAINTERS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 60, ((offset + i) * 37) % 60) + 1,
    cost: ri(4500, 95000, ((offset + i) * 13097) % 90500) + 4500,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const miniatureRecords = [
  { id: 'MPR-0001', painter: 'Jaipur Miniature Art Guild', ware: 'Jaipur Miniature Radha Krishna', status: 'GI Rajasthan Miniature Mark', qty: 8, cost: 65000, date: '2024-01-12' },
  { id: 'MPR-0002', painter: 'Udaipur Mewar Painters Society', ware: 'Udaipur Mewar Court Scene', status: 'IS 16918 Miniature Art Grade A', qty: 5, cost: 85000, date: '2024-01-24' },
  { id: 'MPR-0003', painter: 'Jodhpur Marwar Heritage Artists', ware: 'Jodhpur Marwar Hunting Panel', status: 'Foam-Lined Wooden Crate', qty: 12, cost: 28000, date: '2024-02-08' },
  { id: 'MPR-0004', painter: 'Bundi Ragamala Art Centre', ware: 'Bundi Ragamala Painting', status: 'Temperature-Controlled Van Transit', qty: 6, cost: 72000, date: '2024-02-20' },
  { id: 'MPR-0005', painter: 'Kishangarh Bani Thani Studio', ware: 'Kishangarh Bani Thani Portrait', status: 'Dry Storage 20-28C', qty: 10, cost: 55000, date: '2024-03-05' },
  { id: 'MPR-0006', painter: 'Nathdwara Pichwai Painters', ware: 'Jaipur Royal Procession Scroll', qty: 4, cost: 92000, date: '2024-03-18', status: 'Natural Pigment Adhesion QC' },
  { id: 'MPR-0007', painter: 'Jaisalmer Desert Art Cooperative', ware: 'Rajasthani Pichwai Miniature', status: 'GI Rajasthan Miniature Mark', qty: 15, cost: 22000, date: '2024-03-30' },
  { id: 'MPR-0008', painter: 'Sawai Madhopur Miniature Colony', ware: 'Jaisalmer Desert Life Panel', status: 'IS 16918 Miniature Art Grade A', qty: 18, cost: 18000, date: '2024-04-10' },
  { id: 'MPR-0009', painter: 'Jaipur Miniature Art Guild', ware: 'Udaipur Mewar Court Scene', status: 'Foam-Lined Wooden Crate', qty: 7, cost: 78000, date: '2024-04-22' },
  { id: 'MPR-0010', painter: 'Udaipur Mewar Painters Society', ware: 'Jaipur Miniature Radha Krishna', status: 'Temperature-Controlled Van Transit', qty: 10, cost: 68000, date: '2024-05-04' },
  { id: 'MPR-0011', painter: 'Jodhpur Marwar Heritage Artists', ware: 'Bundi Ragamala Painting', status: 'Dry Storage 20-28C', qty: 8, cost: 75000, date: '2024-05-16' },
  { id: 'MPR-0012', painter: 'Bundi Ragamala Art Centre', ware: 'Kishangarh Bani Thani Portrait', status: 'Natural Pigment Adhesion QC', qty: 6, cost: 58000, date: '2024-05-28' },
  { id: 'MPR-0013', painter: 'Kishangarh Bani Thani Studio', ware: 'Jodhpur Marwar Hunting Panel', status: 'GI Rajasthan Miniature Mark', qty: 14, cost: 25000, date: '2024-06-10' },
  { id: 'MPR-0014', painter: 'Nathdwara Pichwai Painters', ware: 'Rajasthani Pichwai Miniature', status: 'IS 16918 Miniature Art Grade A', qty: 12, cost: 20000, date: '2024-06-22' },
  { id: 'MPR-0015', painter: 'Jaisalmer Desert Art Cooperative', ware: 'Jaisalmer Desert Life Panel', status: 'Foam-Lined Wooden Crate', qty: 20, cost: 15000, date: '2024-07-05' },
  { id: 'MPR-0016', painter: 'Sawai Madhopur Miniature Colony', ware: 'Jaipur Royal Procession Scroll', status: 'Temperature-Controlled Van Transit', qty: 5, cost: 88000, date: '2024-07-16' },
  { id: 'MPR-0017', painter: 'Jaipur Miniature Art Guild', ware: 'Kishangarh Bani Thani Portrait', status: 'Dry Storage 20-28C', qty: 9, cost: 52000, date: '2024-07-24' },
  { id: 'MPR-0018', painter: 'Udaipur Mewar Painters Society', ware: 'Rajasthani Pichwai Miniature', status: 'Natural Pigment Adhesion QC', qty: 11, cost: 24000, date: '2024-08-01' },
  { id: 'MPR-0019', painter: 'Jodhpur Marwar Heritage Artists', ware: 'Jaipur Miniature Radha Krishna', status: 'GI Rajasthan Miniature Mark', qty: 7, cost: 70000, date: '2024-08-10' },
  { id: 'MPR-0020', painter: 'Bundi Ragamala Art Centre', ware: 'Udaipur Mewar Court Scene', status: 'IS 16918 Miniature Art Grade A', qty: 4, cost: 90000, date: '2024-08-20' },
]

export default function MiniaturePaintingRajasthanLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...miniatureRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'painter', label: 'Painter', options: PAINTERS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.painter === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(8, 40, allRecords.length * 0.2 + i * 6) }))
  const painterChart = PAINTERS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.painter === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="mpr-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Miniature Painting Rajasthan' }]} />
      <PageHeader title="Miniature Painting Rajasthan Logistics" description="Rajasthan miniature painting supply chain with IS 16918 miniature art compliance, natural pigment adhesion QC, foam-lined wooden crate packaging, and GI Rajasthan Miniature Mark certification across 8 heritage artisan clusters in Jaipur, Udaipur, and Jodhpur districts" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-amber-100">
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
            <HealthRing label="GI Tag" value={94} />
            <HealthRing label="IS 16918" value={91} />
            <HealthRing label="Foam" value={87} />
            <HealthRing label="Van" value={84} />
            <HealthRing label="Storage" value={90} />
            <HealthRing label="Pigment" value={96} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="1,200+" />
            <ValueTile label="Jaipur Schools" value="Since 16th C" />
            <ValueTile label="Export Markets" value="25 Countries" />
            <ValueTile label="Annual Revenue" value="₹35 Crore" />
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
            placeholder="Search Rajasthan miniature shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-amber-100">
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
                  <tr key={record.id} className="border-t hover:bg-amber-50/50">
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
              <CardHeader><CardTitle>Rajasthan Miniature Painting — 500-Year Rajput Court Art Tradition</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Rajasthan miniature painting is one of India's most celebrated and historically rich classical art traditions, originating in the sixteenth century when Rajput kings of the various princely states across Rajasthan established dedicated painting ateliers within their royal palaces, commissioning master artists to create intricately detailed manuscript illustrations, court scene paintings, devotional panels, and portrait miniatures that documented the grandeur of Rajput royal life and Hindu mythological narratives with extraordinary precision and artistic sophistication. The Rajasthan miniature tradition encompasses several distinct sub-schools each bearing the unique aesthetic character of its patron kingdom: the Mewar school of Udaipur known for its bold compositions and vibrant colour palette depicting royal court ceremonies and festival scenes, the Bundi school celebrated for its graceful Ragamala musical mode paintings featuring aristocratic figures in lush garden settings, the Kishangarh school renowned for the idealised Bani Thani portrait style with distinctive elongated eyes and serpentine curves that became an iconic Rajasthani aesthetic motif, the Marwar school of Jodhpur distinguished by its powerful equestrian portraits and hunting scenes capturing the martial spirit of the Rathore Rajput dynasty, and the Jaipur school recognised for its systematic court documentation paintings blending Mughal precision with indigenous Rajput devotional themes. The painting technique employs natural mineral and vegetable-derived pigments including laal mitti red clay for vermilion, neel pani indigo for blue, harital orpiment for yellow, and kajal carbon black for outlines, all ground by hand and mixed with gum arabic binder to create the vivid opaque colours that have maintained their brilliance across centuries of preserved miniature paintings housed in museums worldwide. Each miniature painting requires weeks to months of concentrated work by a single master artist using handcrafted squirrel-hair brushes that can produce impossibly fine detail lines measuring less than 0.2 millimetres in width, enabling the extraordinary precision that characterises authentic Rajasthan miniature work. Today approximately 1,200 artisan families across eight heritage clusters in Jaipur, Udaipur, Jodhpur, Bundi, Kishangarh, Nathdwara, Jaisalmer, and Sawai Madhopur sustain this tradition, generating an estimated 35 crore rupees annually through domestic heritage art collectors, government emporiums, temple commissions, and growing international demand from museum curators and private collectors who value authentic Rajasthan miniature paintings as museum-quality Indian fine art.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16918 Miniature Art Standards & Natural Pigment Certification</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">The IS 16918 standard for Rajasthan miniature paintings establishes India's first dedicated quality certification framework for this classical Rajput court painting tradition, ensuring the use of authentic natural pigments, traditional preparation techniques, and fine craftsmanship that distinguish genuine Rajasthan miniature art from mass-produced commercial reproductions and machine-printed imitations that flood both domestic and international art markets. The standard specifies detailed requirements for the painting substrate, mandating handmade Sanganer or Wasli paper prepared from multiple layers of handmade rag paper bonded with wheat starch paste and burnished with agate stone to create a smooth ivory-toned surface with minimum grammage of 200 GSM and surface roughness not exceeding 3 microns Ra, providing the ideal substrate for the ultra-fine squirrel-hair brush strokes that define authentic miniature painting technique. Pigment quality requirements for Grade A certification mandate exclusively natural mineral and vegetable-derived pigments with minimum lightfastness ratings of 5 on the ASTM D4303 scale for all colour applications, with mandatory use of laal mitti natural red earth for vermilion areas, neel pani fermented indigo for blue sections, harital natural orpiment for yellow zones, and genuine 22-carat gold leaf for gilded areas verified through X-ray fluorescence spectroscopy at NABL-accredited laboratories. Brush stroke precision requirements for IS 16918 Grade A certification mandate line width consistency within 0.15 millimetres across all outlined elements, verified through 50x magnification digital measurement at certified testing facilities, ensuring the extraordinary fine-line precision that distinguishes master-level Rajasthan miniature work from apprentice-quality or commercially produced miniature-style paintings. Adhesion testing mandates all pigment layers maintain 97% surface coverage after 150 cycles of standard abrasion testing using the Taber Abraser method with CS-10 wheels, simulating decades of careful handling that miniature paintings experience in museum display, private collection, and gallery exhibition environments throughout their expected 200-year plus lifespan as heritage art objects.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Foam-Lined Wooden Crate Packaging for Miniature Paintings</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Foam-lined wooden crate packaging has been specifically engineered for Rajasthan miniature paintings to protect the delicate natural pigment surfaces, ultra-fine brush stroke details, gold leaf gilding areas, and handmade Wasli paper substrate from the numerous physical and environmental hazards encountered during transit from Rajasthan artisan workshops to gallery showrooms, museum collections, government emporiums, and international export destinations across the globe. Each individual miniature painting undergoes a meticulous multi-layer wrapping protocol: first wrapped in acid-free tissue paper to prevent any chemical interaction between the painting surface and packaging materials, then placed in a custom-cut high-density polyethylene foam cavity block precisely moulded to the painting dimensions providing 360-degree cushioning around all four edges, with additional 25-millimetre foam clearance above the painted surface preventing any pressure contact with the delicate pigment layers during stacking and transit. The foam-cradled painting is secured within a custom-built wooden crate constructed from seasoned teak or mango wood with tongue-and-groove corner joints, eliminating nail penetration that could cause vibration damage to the enclosed artwork during road and rail transit across India's diverse terrain and climate zones. Silica gel desiccant packets rated for 100 gram absorption capacity are enclosed within each crate to maintain relative humidity below 35% during transit, as the traditional gum arabic pigment binder used in authentic Rajasthan miniature painting is hygroscopic and can soften under high humidity conditions, potentially causing pigment lifting and surface cracking if exposed to prolonged moisture during the monsoon season that affects Rajasthan and northern India from July through September. The packaging system has been validated to ISTA 3A transit simulation protocols and demonstrates capability to withstand drops from 90 centimetres and vibration equivalent to 2,500 kilometres of road transit without any pigment damage or surface deterioration, reducing the historical transit damage rate for Rajasthan miniature paintings from 6% to under 1% since adoption across the certified miniature art supply chain.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Brush Stroke Analysis & Rajasthan Miniature Market Expansion</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and advanced imaging technologies are transforming quality assurance and authentication for the Rajasthan miniature painting craft, where the ultra-fine brush stroke precision, natural pigment colour consistency, and compositional accuracy that define the highest quality master-level pieces have traditionally required decades of connoisseur expertise and subjective visual assessment to evaluate and certify consistently across the diverse Rajasthan miniature painting sub-schools and production workshops. The AI authentication system employs macroscopic digital scanning at 4800 dots per inch to capture extremely detailed images of finished miniature paintings, analysing every brush stroke contour, pigment layer boundary, and gold leaf application edge with precision to 0.01 millimetres, detecting irregularities such as inconsistent line width variation indicating digital tracing rather than hand-painting, synthetic pigment spectral signatures differing from certified natural mineral and vegetable pigment reference profiles, or compositional proportion deviations from the established stylistic canons of each Rajasthan sub-school that indicate either substandard craftsmanship or non-authentic reproduction work. Computer vision algorithms trained on over 28,000 authenticated Rajasthan miniature paintings spanning all major sub-schools can verify artistic authenticity by comparing brush stroke pressure patterns, pigment layering sequences visible through infrared reflectography, gold leaf application techniques, and overall compositional balance against a comprehensive reference database of master artist works from each heritage cluster, providing objective quality grading that supplements the traditional assessment by senior miniature art connoisseurs and museum curators. The Rajasthan State Department of Art and Culture has piloted this AI verification in its export certification pipeline for Rajasthan miniature paintings, reducing quality rejection rates at government art emporiums from 22% to under 3% while accelerating the certification timeline from 12 working days to under 48 hours for qualifying miniature paintings. India's GI protection for Rajasthan miniature painting combined with digital authentication infrastructure has expanded export partnerships with major international museums and auction houses in London, New York, Paris, Tokyo, and Dubai who now require verifiable digital provenance certificates and AI-authenticated quality grading for authentic Rajasthan miniature paintings that command premium prices ranging from 50,000 to over 500,000 rupees per piece depending on sub-school, complexity, painter reputation, and historical period inspiration.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
