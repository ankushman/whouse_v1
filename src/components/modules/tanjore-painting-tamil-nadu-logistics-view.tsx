import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#7c2d12', '#9a3412', '#c2410c', '#ea580c', '#f97316', '#431407', '#2c0a03', '#fff7ed']
const PRODUCTS = ['Tanjore Marigold Lakshmi Panel', 'TN Tanjore Krishna Gopal Painting', 'Tanjore Gold Leaf Ganesha Board', 'Tanjore Dasavathara Set Panel', 'Tanjore Nataraja Dancing Shiva', 'TN Tanjore Saraswati Veena Panel', 'Tanjore Royal Court Scene Board', 'Tanjore Rama Pattabhishekam Panel']
const PAINTERS = ['Tanjore Traditional Artists Guild', 'Kumbakonam Tanjore Painters Society', 'Thanjavur Heritage Art Cooperative', 'Tiruchirappalli Tanjore Studio', 'Mayavaram Tanjore Art Centre', 'Srivilliputhur Tanjore Workshop', 'Madurai Tanjore Craft Colony', 'Pudukkottai Tanjore Heritage Society']
const STATUSES = ['GI Tanjore Painting Mark', 'IS 16927 Tanjore Art Grade A', 'Pine Wood Crate with Foam', 'Air-Conditioned Truck Transit', 'Humidity-Free Vault 20-25C', 'Gold Leaf Fidelity QC']

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
    id: `TJP-${String(offset + i + 1).padStart(4, '0')}`,
    painter: PAINTERS[(offset + i) % PAINTERS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 35, ((offset + i) * 31) % 35) + 1,
    cost: ri(5000, 98000, ((offset + i) * 14173) % 93000) + 5000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const tanjoreRecords = [
  { id: 'TJP-0001', painter: 'Tanjore Traditional Artists Guild', ware: 'Tanjore Marigold Lakshmi Panel', status: 'GI Tanjore Painting Mark', qty: 3, cost: 95000, date: '2024-01-12' },
  { id: 'TJP-0002', painter: 'Kumbakonam Tanjore Painters Society', ware: 'TN Tanjore Krishna Gopal Painting', status: 'IS 16927 Tanjore Art Grade A', qty: 5, cost: 82000, date: '2024-01-25' },
  { id: 'TJP-0003', painter: 'Thanjavur Heritage Art Cooperative', ware: 'Tanjore Gold Leaf Ganesha Board', status: 'Pine Wood Crate with Foam', qty: 4, cost: 78000, date: '2024-02-08' },
  { id: 'TJP-0004', painter: 'Tiruchirappalli Tanjore Studio', ware: 'Tanjore Dasavathara Set Panel', status: 'Air-Conditioned Truck Transit', qty: 6, cost: 65000, date: '2024-02-20' },
  { id: 'TJP-0005', painter: 'Mayavaram Tanjore Art Centre', ware: 'Tanjore Nataraja Dancing Shiva', status: 'Humidity-Free Vault 20-25C', qty: 2, cost: 98000, date: '2024-03-05' },
  { id: 'TJP-0006', painter: 'Srivilliputhur Tanjore Workshop', ware: 'TN Tanjore Saraswati Veena Panel', status: 'Gold Leaf Fidelity QC', qty: 7, cost: 55000, date: '2024-03-18' },
  { id: 'TJP-0007', painter: 'Madurai Tanjore Craft Colony', ware: 'Tanjore Royal Court Scene Board', status: 'GI Tanjore Painting Mark', qty: 4, cost: 88000, date: '2024-03-30' },
  { id: 'TJP-0008', painter: 'Pudukkottai Tanjore Heritage Society', ware: 'Tanjore Rama Pattabhishekam Panel', status: 'IS 16927 Tanjore Art Grade A', qty: 8, cost: 42000, date: '2024-04-12' },
  { id: 'TJP-0009', painter: 'Tanjore Traditional Artists Guild', ware: 'TN Tanjore Krishna Gopal Painting', status: 'Pine Wood Crate with Foam', qty: 3, cost: 92000, date: '2024-04-24' },
  { id: 'TJP-0010', painter: 'Kumbakonam Tanjore Painters Society', ware: 'Tanjore Marigold Lakshmi Panel', status: 'Air-Conditioned Truck Transit', qty: 5, cost: 75000, date: '2024-05-06' },
  { id: 'TJP-0011', painter: 'Thanjavur Heritage Art Cooperative', ware: 'Tanjore Gold Leaf Ganesha Board', status: 'Humidity-Free Vault 20-25C', qty: 6, cost: 60000, date: '2024-05-18' },
  { id: 'TJP-0012', painter: 'Tiruchirappalli Tanjore Studio', ware: 'Tanjore Dasavathara Set Panel', status: 'Gold Leaf Fidelity QC', qty: 4, cost: 84000, date: '2024-05-30' },
  { id: 'TJP-0013', painter: 'Mayavaram Tanjore Art Centre', ware: 'Tanjore Nataraja Dancing Shiva', status: 'GI Tanjore Painting Mark', qty: 9, cost: 38000, date: '2024-06-12' },
  { id: 'TJP-0014', painter: 'Srivilliputhur Tanjore Workshop', ware: 'TN Tanjore Saraswati Veena Panel', status: 'IS 16927 Tanjore Art Grade A', qty: 3, cost: 91000, date: '2024-06-24' },
  { id: 'TJP-0015', painter: 'Madurai Tanjore Craft Colony', ware: 'Tanjore Royal Court Scene Board', status: 'Pine Wood Crate with Foam', qty: 7, cost: 48000, date: '2024-07-06' },
  { id: 'TJP-0016', painter: 'Pudukkottai Tanjore Heritage Society', ware: 'Tanjore Rama Pattabhishekam Panel', status: 'Air-Conditioned Truck Transit', qty: 5, cost: 72000, date: '2024-07-18' },
  { id: 'TJP-0017', painter: 'Tanjore Traditional Artists Guild', ware: 'Tanjore Gold Leaf Ganesha Board', status: 'Humidity-Free Vault 20-25C', qty: 4, cost: 86000, date: '2024-07-30' },
  { id: 'TJP-0018', painter: 'Kumbakonam Tanjore Painters Society', ware: 'Tanjore Marigold Lakshmi Panel', status: 'Gold Leaf Fidelity QC', qty: 6, cost: 58000, date: '2024-08-10' },
  { id: 'TJP-0019', painter: 'Thanjavur Heritage Art Cooperative', ware: 'TN Tanjore Krishna Gopal Painting', status: 'GI Tanjore Painting Mark', qty: 3, cost: 94000, date: '2024-08-22' },
  { id: 'TJP-0020', painter: 'Tiruchirappalli Tanjore Studio', ware: 'Tanjore Nataraja Dancing Shiva', status: 'IS 16927 Tanjore Art Grade A', qty: 8, cost: 45000, date: '2024-09-03' },
]

export default function TanjorePaintingTamilNaduLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...tanjoreRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'painter', label: 'Painter', options: PAINTERS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.painter === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(5, 30, allRecords.length * 0.14 + i * 4) }))
  const painterChart = PAINTERS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.painter === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="tjp-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Tanjore Painting Tamil Nadu' }]} />
      <PageHeader title="Tanjore Painting Tamil Nadu Logistics" description="Tanjore gilded temple painting supply chain with IS 16927 Tanjore art compliance, gold leaf fidelity QC, pine wood crate foam packaging, and GI Tanjore Painting Mark certification across 8 heritage artisan clusters in Thanjavur, Kumbakonam, and Madurai districts" />
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
            <KpiTile label="Painter Clusters" value={PAINTERS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={98} />
            <HealthRing label="IS 16927" value={94} />
            <HealthRing label="Pine Crate" value={91} />
            <HealthRing label="AC Truck" value={88} />
            <HealthRing label="Vault" value={93} />
            <HealthRing label="Gold Leaf" value={96} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="180+" />
            <ValueTile label="Tanjore Tradition" value="Since 16th C" />
            <ValueTile label="Export Markets" value="22 Countries" />
            <ValueTile label="Annual Revenue" value="₹18 Crore" />
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
            placeholder="Search Tanjore painting shipments..."
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
              <CardHeader><CardTitle>Tanjore Painting — 400-Year South Indian Gilded Temple Art Tradition</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Tanjore painting is one of India's most visually spectacular and culturally significant classical art forms, originating in the Thanjavur district of Tamil Nadu during the late sixteenth century under the patronage of the Nayak dynasty rulers and subsequently reaching its artistic zenith under the Maratha rulers of Thanjavur who established royal painting ateliers that produced the magnificent gilded and gem-set panel paintings that remain the defining visual vocabulary of this extraordinary South Indian temple art tradition. The Tanjore painting technique is distinguished by its characteristic use of a layered gesso preparation technique where a paste made from unboiled tamarind seed paste, powdered limestone from the Trichy limestone belt, and Arabic gum binder is applied onto a waterproof plywood or palmyra palm leaf base board to create a raised relief surface that is then covered with genuine 22-carat gold leaf creating the luminous golden backgrounds, ornamental arches, jewellery embellishments, and decorative border patterns that give Tanjore paintings their distinctive rich and opulent appearance unlike any other Indian painting tradition. The colour palette employs traditional natural pigments including kumkum vermilion for red areas, charcoal black for outlines, natural ultramarine for blue sections, and turmeric-derived yellow for golden yellow zones, with the gold leaf areas created by laying thin sheets of genuine 22-carat gold foil over the dried gesso relief work and burnishing with an agate stone to achieve the characteristic mirror-bright gold finish that catches and reflects light creating a living luminosity that animates the painted deities and temple scenes depicted in the Tanjore painting compositional canon. The typical Tanjore painting depicts Hindu deities in the central position surrounded by elaborate architectural arches, decorative pillars, and ornamental borders filled with gold leaf and semi-precious gemstone inlays including kundan-set rubies, emeralds, and sapphires that transform each painting into both a devotional artwork and a piece of wearable religious art that adorns the puja rooms and temple walls of Tamil Brahmin households across South India and the global Tamil diaspora community.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16927 Tanjore Art Standards & Gold Leaf Fidelity QC</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">The IS 16927 standard for Tanjore painting establishes India's first dedicated quality certification framework for this iconic South Indian gilded temple art tradition, specifying comprehensive requirements for authentic 22-carat gold leaf quality, traditional gesso preparation technique, natural pigment composition, plywood substrate specifications, and semi-precious gemstone inlay standards that collectively distinguish genuine Tanjore paintings from the mass-produced imitations and gold-painted reproductions that have increasingly flooded both domestic Indian art markets and international online retail platforms targeting the global Hindu diaspora community and collectors of Indian devotional art worldwide. The gold leaf fidelity requirements for IS 16927 Grade A certification mandate exclusively genuine 22-carat gold foil with minimum gold purity of 91.6% verified through fire assay testing per IS 1418 and X-ray fluorescence spectroscopy confirming the absence of base metal alloy adulterants including copper, zinc, and nickel that are commonly used in cheaper gold-painted reproductions and produce noticeably different visual appearance, surface reflectivity, and long-term tarnishing characteristics compared to genuine 22-carat gold leaf that maintains its luminous mirror-bright finish for decades under normal indoor display conditions. Gesso preparation standards for IS 16927 Grade A certification require the traditional tamarind seed paste and limestone powder formulation with specific particle size distribution not exceeding 45 microns for the limestone component ensuring smooth gesso relief surfaces, pH range between 6.0 and 7.5 preventing acidic degradation of the gold leaf adhesion layer, and minimum gesso adhesion strength of 2.5 megapascals measured per ASTM D4541 pull-off testing confirming that the raised relief work maintains structural integrity through transit, handling, and long-term display conditions without cracking, chipping, or delamination that would compromise both the visual appearance and the market value of the finished Tanjore painting. Semi-precious gemstone inlay requirements for Grade A certification mandate genuine natural gemstones with minimum clarity grade of slightly included as per GIA standards, set in traditional kundan gold foil bezel settings without any adhesive backing, and positioned within the compositional framework according to the established Tanjore painting iconographic canons that specify gemstone placement for specific deity attributes and ornamental elements.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Pine Wood Crate Packaging with Foam Cushioning for Tanjore Paintings</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Pine wood crate packaging with custom-cut polyethylene foam cushioning has been specifically engineered for the Tanjore painting logistics supply chain to protect the delicate 22-carat gold leaf surfaces, raised gesso relief work, semi-precious gemstone inlays, and natural pigment painted areas from the numerous physical and environmental hazards encountered during transit from the Thanjavur, Kumbakonam, and Madurai artisan workshops to domestic destinations across India and international export markets in Southeast Asia, North America, Europe, and Australia where Tanjore paintings command significant premium pricing among the global Hindu diaspora community and international collectors of Indian classical art. The pine wood crate construction utilises seasoned kiln-dried southern yellow pine with moisture content not exceeding 12% preventing warping or dimensional changes that could exert pressure on the enclosed painting during transit through the humid tropical conditions of coastal Tamil Nadu and the varying climatic zones encountered during road and air cargo transport to international destinations. Each Tanjore painting undergoes meticulous pre-packaging preparation including inspection under D65 standard daylight illumination verifying gold leaf integrity, gesso relief condition, gemstone inlay security, and overall compositional stability before being interleaved with acid-free glassine tissue protecting the gold leaf surface from any friction contact, then positioned within a custom-cut high-density polyethylene foam bed precisely moulded to accommodate the painting dimensions including the protruding gesso relief elements that can extend up to 5 millimetres above the painting surface plane, with additional foam padding strips securing all edges and preventing any lateral movement within the crate during multi-modal transit operations. The crate interior is lined with moisture-barrier polyethylene film maintaining relative humidity within the 40 to 55 percent range optimal for Tanjore painting preservation, with silica gel desiccant packets included for long-duration sea freight shipments to international destinations where transit periods may extend to 30 or more days through multiple climate zones with potentially damaging humidity and temperature fluctuations.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Gold Leaf Thickness Verification & Tanjore Heritage Market Development</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and advanced materials analysis technologies are being progressively integrated into the Tanjore painting authentication and quality verification pipeline to verify the 22-carat gold leaf thickness, gesso relief dimensions, natural pigment composition, and overall structural integrity that distinguish genuine Tanjore heritage paintings from the growing volume of gold-painted reproductions and factory-produced imitations that have increasingly entered both domestic Indian retail markets and international online art marketplaces, particularly on e-commerce platforms serving the global Hindu diaspora community where Tanjore-style devotional artworks command premium prices among collectors and devotees seeking authentic temple art for religious and cultural purposes. The AI verification system for Tanjore paintings employs non-destructive X-ray fluorescence spectroscopy to measure gold leaf thickness and purity across the complete painted surface, analysing gold foil thickness at multiple sample points with precision of plus or minus 0.5 microns against the IS 16927 Grade A standard requirement of minimum 1.5 microns genuine 22-carat gold leaf, detecting the thinner gold paint coatings typically measuring 0.1 to 0.3 microns that characterise mass-produced reproductions and cannot replicate the luminous depth and reflective quality of genuine gold leaf applied over traditional gesso relief work. The Tamil Nadu Handicrafts Development Corporation has piloted this AI verification technology at its Thanjavur regional office and three government emporiums in Chennai, Coimbatore, and Madurai, reporting verification accuracy exceeding 97% in distinguishing authentic IS 16927 Grade A certified Tanjore paintings from non-certified reproductions, with corresponding reduction in customer complaints regarding authenticity from 12% to under 2% since pilot implementation while enabling authenticated Tanjore paintings to access premium international auction house channels and museum procurement programmes that require verified certification documentation for Indian classical art acquisitions valued above the 5000 USD threshold that characterises the institutional collector market segment for Tanjore painting heritage art.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
