import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#065f46', '#047857', '#059669', '#10b981', '#34d399', '#064e3b', '#022c22', '#ecfdf5']
const PRODUCTS = ['Gond Tree of Life Panel', 'Gond Deer Hunting Mural', 'Gond Fish Pond Painting', 'Gond Peacock Dance Scroll', 'Gond Snake Serpent Panel', 'Gond Bird Forest Mural', 'Gond Tortoise Earth Panel', 'Gond Elephant Procession Scroll']
const ARTISANS = ['Bhopal Gond Art Society MP', 'Pachmarhi Tribal Guild MP', 'Mandla Gond Cluster MP', 'Dindori Pardhan Art MP', 'Seoni Jungle Artist MP', 'Jabalpur Gond Collective MP', 'Hoshangabad Workshop MP', 'Chhindwara Tribal Art MP']
const STATUSES = ['GI MP Gond Art Mark', 'Natural Pigment Purity QC', 'Brush Stroke Thickness Test', 'Pattern Motif Symmetry Check', 'Canvas Bond Adhesion Test', 'Tribal Signature Fidelity Audit']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-emerald-200 rounded-full overflow-hidden"><div className="h-full bg-emerald-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ecfdf5" strokeWidth="6" />
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
  <Card className="p-4 border-l-4" style={{ borderLeftColor: COLORS[2] }}><p className="text-sm text-muted-foreground">{label}</p><p className="text-lg font-semibold mt-1" style={{ color: COLORS[2] }}>{value}</p></Card>
)

const genRecords = (offset: number) =>
  Array.from({ length: 20 }, (_, i) => ({
    id: `GOP-${String(offset + i + 1).padStart(4, '0')}`,
    artisan: ARTISANS[(offset + i) % ARTISANS.length], design: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 12, ((offset + i) * 19) % 12) + 1,
    cost: ri(4000, 52000, ((offset + i) * 11307) % 48000) + 4000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const gondrecords = [
  { id: 'GOP-0001', artisan: 'Bhopal Gond Art Society MP', design: 'Gond Tree of Life Panel', status: 'GI MP Gond Art Mark', qty: 4, cost: 48000, date: '2024-01-05' },
  { id: 'GOP-0002', artisan: 'Pachmarhi Tribal Guild MP', design: 'Gond Deer Hunting Mural', status: 'Natural Pigment Purity QC', qty: 3, cost: 44000, date: '2024-01-18' },
  { id: 'GOP-0003', artisan: 'Mandla Gond Cluster MP', design: 'Gond Fish Pond Painting', status: 'Brush Stroke Thickness Test', qty: 6, cost: 32000, date: '2024-01-31' },
  { id: 'GOP-0004', artisan: 'Dindori Pardhan Art MP', design: 'Gond Peacock Dance Scroll', status: 'Pattern Motif Symmetry Check', qty: 5, cost: 50000, date: '2024-02-13' },
  { id: 'GOP-0005', artisan: 'Seoni Jungle Artist MP', design: 'Gond Snake Serpent Panel', status: 'Canvas Bond Adhesion Test', qty: 8, cost: 18000, date: '2024-02-26' },
  { id: 'GOP-0006', artisan: 'Jabalpur Gond Collective MP', design: 'Gond Bird Forest Mural', status: 'Tribal Signature Fidelity Audit', qty: 3, cost: 52000, date: '2024-03-10' },
  { id: 'GOP-0007', artisan: 'Hoshangabad Workshop MP', design: 'Gond Tortoise Earth Panel', status: 'GI MP Gond Art Mark', qty: 7, cost: 24000, date: '2024-03-23' },
  { id: 'GOP-0008', artisan: 'Chhindwara Tribal Art MP', design: 'Gond Elephant Procession Scroll', status: 'Natural Pigment Purity QC', qty: 4, cost: 46000, date: '2024-04-05' },
  { id: 'GOP-0009', artisan: 'Bhopal Gond Art Society MP', design: 'Gond Tree of Life Panel', status: 'Brush Stroke Thickness Test', qty: 5, cost: 36000, date: '2024-04-18' },
  { id: 'GOP-0010', artisan: 'Pachmarhi Tribal Guild MP', design: 'Gond Deer Hunting Mural', status: 'Pattern Motif Symmetry Check', qty: 3, cost: 48000, date: '2024-05-01' },
  { id: 'GOP-0011', artisan: 'Mandla Gond Cluster MP', design: 'Gond Fish Pond Painting', status: 'Canvas Bond Adhesion Test', qty: 6, cost: 28000, date: '2024-05-14' },
  { id: 'GOP-0012', artisan: 'Dindori Pardhan Art MP', design: 'Gond Peacock Dance Scroll', status: 'Tribal Signature Fidelity Audit', qty: 4, cost: 42000, date: '2024-05-27' },
  { id: 'GOP-0013', artisan: 'Seoni Jungle Artist MP', design: 'Gond Snake Serpent Panel', status: 'GI MP Gond Art Mark', qty: 8, cost: 16000, date: '2024-06-09' },
  { id: 'GOP-0014', artisan: 'Jabalpur Gond Collective MP', design: 'Gond Bird Forest Mural', status: 'Natural Pigment Purity QC', qty: 3, cost: 50000, date: '2024-06-22' },
  { id: 'GOP-0015', artisan: 'Hoshangabad Workshop MP', design: 'Gond Tortoise Earth Panel', status: 'Brush Stroke Thickness Test', qty: 5, cost: 38000, date: '2024-07-05' },
  { id: 'GOP-0016', artisan: 'Chhindwara Tribal Art MP', design: 'Gond Elephant Procession Scroll', status: 'Pattern Motif Symmetry Check', qty: 7, cost: 22000, date: '2024-07-18' },
  { id: 'GOP-0017', artisan: 'Bhopal Gond Art Society MP', design: 'Gond Tree of Life Panel', status: 'Canvas Bond Adhesion Test', qty: 4, cost: 44000, date: '2024-07-31' },
  { id: 'GOP-0018', artisan: 'Pachmarhi Tribal Guild MP', design: 'Gond Deer Hunting Mural', status: 'Tribal Signature Fidelity Audit', qty: 6, cost: 26000, date: '2024-08-13' },
  { id: 'GOP-0019', artisan: 'Mandla Gond Cluster MP', design: 'Gond Fish Pond Painting', status: 'GI MP Gond Art Mark', qty: 3, cost: 48000, date: '2024-08-26' },
  { id: 'GOP-0020', artisan: 'Dindori Pardhan Art MP', design: 'Gond Peacock Dance Scroll', status: 'Natural Pigment Purity QC', qty: 5, cost: 34000, date: '2024-09-08' },
]

export default function GondArtMadhyaPradeshLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...gondrecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.design.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'design', label: 'Design', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.design === p).length })) },
    { key: 'artisan', label: 'Artisan', options: ARTISANS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.artisan === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(4, 20, allRecords.length * 0.10 + i * 3) }))
  const artisanChart = ARTISANS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.artisan === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="gop-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Gond Art' }]} />
      <PageHeader title="Gond Art Madhya Pradesh Logistics" description="Madhya Pradesh Gond tribal painting supply chain with GI MP Gond Art Mark certification natural pigment purity quality control brush stroke thickness testing pattern motif symmetry verification canvas bond adhesion assessment and tribal signature fidelity audit across 8 Gond artisan clusters in Bhopal Pachmarhi Mandla Dindori and Seoni" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-emerald-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Shipments" value={allRecords.length} />
            <KpiTile label="Active Designs" value={PRODUCTS.length} />
            <KpiTile label="Tribal Clusters" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={92} />
            <HealthRing label="Pigment" value={85} />
            <HealthRing label="Brush" value={90} />
            <HealthRing label="Motif" value={88} />
            <HealthRing label="Canvas" value={93} />
            <HealthRing label="Signature" value={91} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Gond Families" value="22 Active" />
            <ValueTile label="Tradition" value="Since 2000 BC" />
            <ValueTile label="Export Markets" value="4 Countries" />
            <ValueTile label="Annual Revenue" value="₹0.8 Crore" />
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
            placeholder="Search Gond art shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-emerald-100">
                <tr>
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Design</th>
                  <th className="p-3 text-left font-medium">Artisan</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Qty</th>
                  <th className="p-3 text-left font-medium">Cost</th>
                  <th className="p-3 text-left font-medium">Cost Bar</th>
                  <th className="p-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(record => (
                  <tr key={record.id} className="border-t hover:bg-emerald-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.design} /></td>
                    <td className="p-3">{record.artisan}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['panels', 'murals', 'paintings', 'scrolls'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Gond Art — Four Thousand Year Old Madhya Pradesh Tribal Painting Tradition</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Gond art represents one of the oldest and most culturally significant tribal painting traditions of India having originated among the Gond tribal communities of the Mandla Dindori and Seoni districts in the central Madhya Pradesh region approximately four thousand years ago with archaeological evidence of Gond-style rock paintings found in the Bhimbetka rock shelters dating to the Mesolithic period where the Gond tribal painting tradition is deeply rooted in the animistic spiritual beliefs of the Gond people who regard the forest trees rivers hills and animals as sacred living entities interconnected through a complex web of spiritual relationships that are expressed through their art where the traditional Gond painting technique uses fine brush strokes made from chewed twigs of the palash tree or handmade bamboo brushes to create intricate designs filled with vibrant natural colours derived from charcoal for black cow dung yellow for yellow chui mitti red clay for red mahua flower petals for orange and leaves for green producing a distinctive palette of earthy vivid colours that are applied in dense patterns of dots dashes and fine parallel lines creating a textured painterly surface quality that gives each Gond painting a sense of rhythmic movement and organic energy where the characteristic Gond art design vocabulary features elaborate Tree of Life compositions depicting the sacred mahua or sal tree as the central axis of the natural world surrounded by stylised animal forms including deer peacocks fish snakes tortoises elephants and birds rendered in flowing interconnected lines suggesting the unity of all living creatures in the forest ecosystem where the human figures in Gond paintings depict tribal dancers hunters musicians and ritual performers shown in dynamic poses reflecting the ceremonial and daily life traditions of the Gond community where the Gond painting tradition gained national and international recognition through the pioneering work of late Jangarh Singh Shyam a Pardhan Gond artist from the Patangarh village in Mandla district whose innovative Gond paintings on paper canvas and fabric attracted worldwide acclaim in the nineteen eighties and established Gond art as a recognised contemporary Indian tribal art form with a growing collector market and institutional patronage.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Natural Pigment Purity QC and Brush Stroke Thickness Standards</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The natural pigment purity quality control and brush stroke thickness testing protocols for Gond art establish the primary technical quality assurance framework for the traditional Madhya Pradesh tribal painting process that determines the colour authenticity and visual quality of authentic Gond art products where the natural pigment purity test evaluates the chemical composition of each natural colour batch used in the Gond painting process using thin-layer chromatography and UV-Vis spectrophotometry confirming the primary colourant compounds match the expected natural pigment profiles including carbon black for charcoal yellow iron oxide for cow dung yellow red iron oxide for chui mitti red and anthocyanin pigments for mahua flower orange ensuring no synthetic artificial pigments or non-traditional colourants have been introduced that would compromise the authenticity and cultural integrity of the Gond art product where the pigment purity test also screens for toxic heavy metal contaminants including lead cadmium mercury and arsenic that may be present in commercially sourced mineral pigments confirming all colourants meet the ASTM D4236 standard for art material safety ensuring Gond art products are safe for international shipping and consumer handling where the brush stroke thickness test measures the line width and consistency of the fine brush strokes that define the characteristic Gond art texture using digital microscopy at fifteen-times magnification confirming fine line strokes measure between zero point three and zero point eight millimetres in width with stroke-to-stroke width variation within plus or minus zero point two millimetres ensuring the dense dot-dash-fill patterns that characterise Gond art demonstrate consistent texture and visual rhythm across the entire painted surface without visible variations in line quality that would indicate uneven brush loading tool fatigue or inadequate artist skill in executing the precise fine-line brush technique that defines master-level Gond tribal painting.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Pattern Motif Symmetry and Canvas Bond Adhesion Verification</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The pattern motif symmetry check and canvas bond adhesion verification protocols ensure the visual quality and physical durability of authentic Gond tribal paintings where the pattern motif symmetry test evaluates the bilateral and radial symmetry of characteristic Gond design elements including the Tree of Life trunk and branch structure peacock feather eye patterns fish scale arrangements tortoise shell geometric patterns and floral motif repetitions using digital scanning and automated symmetry analysis software comparing left-right and top-bottom design elements confirming symmetry accuracy within plus or minus two millimetres for all repeated pattern elements ensuring the characteristic rhythmic repetition and balanced composition quality of authentic Gond art where the motif consistency test examines the uniformity of repeated design elements across the painting surface confirming that the dot size dash length and line spacing of the fill patterns remain visually consistent within each design zone without gradual enlargement or reduction of pattern elements across the painted area that would indicate scaling drift or artist fatigue during the painting process where the canvas bond adhesion test evaluates the adhesion strength of the natural pigment colours to the painting substrate whether handmade paper canvas or fabric using the standard cross-hatch adhesion test method where a lattice pattern of six parallel cuts in each direction is made through the painted surface to the substrate using a calibrated blade and the amount of pigment dislodged from the grid area is assessed against the five-point adhesion rating scale where a rating of four or above is the minimum acceptable standard for GI-certified Gond art products confirming the natural pigment colours remain firmly bonded to the substrate surface without flaking peeling or powdering during normal handling rolling and transport of the finished Gond painting where the humidity resistance adhesion test subjects the painted sample to accelerated humidity cycling at eighty-five percent relative humidity for seventy-two hours measuring any pigment adhesion deterioration confirming the natural pigment binder system provides adequate moisture resistance for the tropical Indian climate conditions.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Tribal Signature Fidelity Audit and Gond Heritage Market Development</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The tribal signature fidelity audit and Gond heritage market development framework provides the artistic quality assurance and commercial market infrastructure for the Gond art supply chain ensuring that all GI-certified Gond art products demonstrate the authentic tribal artistic signature and cultural integrity that defines the Madhya Pradesh Gond tribal painting tradition while connecting the twenty-two active Gond and Pardhan artisan families across Bhopal Pachmarhi Mandla Dindori Seoni Jabalpur Hoshangabad and Chhindwara with growing institutional and international collector market demand for authentic Gond tribal paintings where the tribal signature fidelity audit evaluates the presence and authenticity of the characteristic Gond artistic signature elements that distinguish authentic tribal Gond art from non-tribal reproductions including the distinctive dot-dash fill pattern technique the earthy natural colour palette derived from traditional forest materials the flowing interconnected line style depicting animals and trees in organic contoured forms and the animistic spiritual narrative content reflecting Gond tribal cosmology and forest spirituality confirming these signature elements are genuinely present and executed with the characteristic tribal artistic sensibility rather than mechanically reproduced by non-tribal artists where the tribal artist authentication system verifies each painting is genuinely created by a registered Gond or Pardhan tribal artist through a combination of artist signature on the painting certificate of authenticity issued by the Madhya Pradesh Gond Art Association and photographic documentation of the artist at work creating the specific painting where the Gond heritage market development initiative led by the Madhya Pradesh State Tribal Welfare Department in collaboration with TRIFED the Tribal Cooperative Marketing Development Federation and the Indira Gandhi Rashtriya Manav Sangrahalaya National Museum of Mankind Bhopal has established institutional procurement and exhibition programmes connecting the active Gond artisan communities with the TRIFED Tribes India retail network the Madhya Pradesh State Emporium and international cultural exhibitions with projected annual revenue growth of twenty percent.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



