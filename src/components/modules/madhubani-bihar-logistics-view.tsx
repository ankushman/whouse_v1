import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#b91c1c', '#991b1b', '#dc2626', '#ef4444', '#f87171', '#7f1d1d', '#450a0a', '#fef2f2']
const PRODUCTS = ['Madhubani Fish Pair', 'Madhubani Sun and Moon', 'Madhubani Kohbar Wedding', 'Madhubani Tree of Life', 'Madhubani Peacock Courtship', 'Madhubani Serpent Pair', 'Madhubani Goddess Lakshmi', 'Madhubani Elephant Procession']
const ARTISANS = ['Madhubani Village Artists BR', 'Darbhanga Folk Art BR', 'Sitamarhi Painting Guild BR', 'Ranti Devi Collective BR', 'Jitwarpur Workshop BR', 'Sahrai Village Cluster BR', 'Laukahi Art Society BR', 'Benipatti Craft Cooperative BR']
const STATUSES = ['GI Bihar Madhubani Mark', 'Paper Canvas Prep QC', 'Natural Dye Pigment Test', 'Geometric Pattern Symmetry', 'Border Motif Precision', 'Folk Narrative Fidelity Audit']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-red-200 rounded-full overflow-hidden"><div className="h-full bg-red-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fef2f2" strokeWidth="6" />
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
    id: `MDB-${String(offset + i + 1).padStart(4, '0')}`,
    artisan: ARTISANS[(offset + i) % ARTISANS.length], design: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 12, ((offset + i) * 19) % 12) + 1,
    cost: ri(3500, 48000, ((offset + i) * 11307) % 44500) + 3500,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const madhubanirecords = [
  { id: 'MDB-0001', artisan: 'Madhubani Village Artists BR', design: 'Madhubani Fish Pair', status: 'GI Bihar Madhubani Mark', qty: 5, cost: 42000, date: '2024-01-08' },
  { id: 'MDB-0002', artisan: 'Darbhanga Folk Art BR', design: 'Madhubani Sun and Moon', status: 'Paper Canvas Prep QC', qty: 4, cost: 38000, date: '2024-01-21' },
  { id: 'MDB-0003', artisan: 'Sitamarhi Painting Guild BR', design: 'Madhubani Kohbar Wedding', status: 'Natural Dye Pigment Test', qty: 6, cost: 28000, date: '2024-02-03' },
  { id: 'MDB-0004', artisan: 'Ranti Devi Collective BR', design: 'Madhubani Tree of Life', status: 'Geometric Pattern Symmetry', qty: 3, cost: 46000, date: '2024-02-16' },
  { id: 'MDB-0005', artisan: 'Jitwarpur Workshop BR', design: 'Madhubani Peacock Courtship', status: 'Border Motif Precision', qty: 7, cost: 15000, date: '2024-03-01' },
  { id: 'MDB-0006', artisan: 'Sahrai Village Cluster BR', design: 'Madhubani Serpent Pair', status: 'Folk Narrative Fidelity Audit', qty: 4, cost: 44000, date: '2024-03-14' },
  { id: 'MDB-0007', artisan: 'Laukahi Art Society BR', design: 'Madhubani Goddess Lakshmi', status: 'GI Bihar Madhubani Mark', qty: 8, cost: 12000, date: '2024-03-27' },
  { id: 'MDB-0008', artisan: 'Benipatti Craft Cooperative BR', design: 'Madhubani Elephant Procession', status: 'Paper Canvas Prep QC', qty: 3, cost: 48000, date: '2024-04-09' },
  { id: 'MDB-0009', artisan: 'Madhubani Village Artists BR', design: 'Madhubani Fish Pair', status: 'Natural Dye Pigment Test', qty: 5, cost: 34000, date: '2024-04-22' },
  { id: 'MDB-0010', artisan: 'Darbhanga Folk Art BR', design: 'Madhubani Sun and Moon', status: 'Geometric Pattern Symmetry', qty: 6, cost: 22000, date: '2024-05-05' },
  { id: 'MDB-0011', artisan: 'Sitamarhi Painting Guild BR', design: 'Madhubani Kohbar Wedding', status: 'Border Motif Precision', qty: 4, cost: 40000, date: '2024-05-18' },
  { id: 'MDB-0012', artisan: 'Ranti Devi Collective BR', design: 'Madhubani Tree of Life', status: 'Folk Narrative Fidelity Audit', qty: 7, cost: 18000, date: '2024-05-31' },
  { id: 'MDB-0013', artisan: 'Jitwarpur Workshop BR', design: 'Madhubani Peacock Courtship', status: 'GI Bihar Madhubani Mark', qty: 3, cost: 46000, date: '2024-06-13' },
  { id: 'MDB-0014', artisan: 'Sahrai Village Cluster BR', design: 'Madhubani Serpent Pair', status: 'Paper Canvas Prep QC', qty: 5, cost: 32000, date: '2024-06-26' },
  { id: 'MDB-0015', artisan: 'Laukahi Art Society BR', design: 'Madhubani Goddess Lakshmi', status: 'Natural Dye Pigment Test', qty: 6, cost: 24000, date: '2024-07-09' },
  { id: 'MDB-0016', artisan: 'Benipatti Craft Cooperative BR', design: 'Madhubani Elephant Procession', status: 'Geometric Pattern Symmetry', qty: 4, cost: 38000, date: '2024-07-22' },
  { id: 'MDB-0017', artisan: 'Madhubani Village Artists BR', design: 'Madhubani Fish Pair', status: 'Border Motif Precision', qty: 8, cost: 14000, date: '2024-08-04' },
  { id: 'MDB-0018', artisan: 'Darbhanga Folk Art BR', design: 'Madhubani Sun and Moon', status: 'Folk Narrative Fidelity Audit', qty: 3, cost: 48000, date: '2024-08-17' },
  { id: 'MDB-0019', artisan: 'Sitamarhi Painting Guild BR', design: 'Madhubani Kohbar Wedding', status: 'GI Bihar Madhubani Mark', qty: 5, cost: 36000, date: '2024-08-30' },
  { id: 'MDB-0020', artisan: 'Ranti Devi Collective BR', design: 'Madhubani Tree of Life', status: 'Paper Canvas Prep QC', qty: 7, cost: 20000, date: '2024-09-12' },
]

export default function MadhubaniBiharLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...madhubanirecords, ...genRecords(21), ...genRecords(41)]

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
    <div className="mdb-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Madhubani Art' }]} />
      <PageHeader title="Madhubani Bihar Logistics" description="Bihar Madhubani folk painting supply chain with GI Bihar Madhubani Mark certification paper canvas preparation quality control natural dye pigment purity testing geometric pattern symmetry verification border motif precision inspection and folk narrative fidelity audit across 8 Madhubani artisan clusters in Madhubani Darbhanga Sitamarhi Ranti and Jitwarpur" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-red-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Shipments" value={allRecords.length} />
            <KpiTile label="Active Designs" value={PRODUCTS.length} />
            <KpiTile label="Artisan Clusters" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={94} />
            <HealthRing label="Dye" value={87} />
            <HealthRing label="Pattern" value={91} />
            <HealthRing label="Border" value={89} />
            <HealthRing label="Narrative" value={93} />
            <HealthRing label="Canvas" value={96} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Madhubani Families" value="30 Active" />
            <ValueTile label="Tradition" value="Since 700 BC" />
            <ValueTile label="Export Markets" value="6 Countries" />
            <ValueTile label="Annual Revenue" value="₹1.2 Crore" />
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
            placeholder="Search Madhubani art shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-red-100">
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
                  <tr key={record.id} className="border-t hover:bg-red-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.design} /></td>
                    <td className="p-3">{record.artisan}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['paintings', 'murals', 'scrolls', 'panels'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Madhubani Bihar — Ancient Mithila Folk Painting Tradition of Bihar</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Madhubani painting represents one of the most ancient and culturally vibrant folk art traditions of India originating in the Mithila region of Bihar spanning the Madhubani Darbhanga Sitamarhi and Ranti districts with documented history dating back over two thousand seven hundred years to the time of King Janaka father of Sita from the ancient Indian epic Ramayana where the tradition holds that King Janaka commissioned the first Madhubani-style paintings to decorate the walls of his palace for the divine wedding ceremony of his daughter Sita to Prince Rama of Ayodhya establishing Madhubani painting as a sacred ritual art form intimately connected to the great Hindu wedding ceremony tradition that continues to this day where the traditional Madhubani painting technique uses exclusively natural materials including handmade paper or cloth canvas prepared with a coating of cow dung and mud paste that creates a distinctive warm earthy background colour and natural pigments derived from local plant mineral and organic sources including rice paste for white turmeric for yellow indigo for blue palash flower juice for red-orange kajal soot for black and sandalwood paste for amber creating a rich earth-toned colour palette that reflects the agrarian natural environment of the Bihar Mithila plains where the five distinct Madhubani painting styles are Bharni which uses vibrant solid colour fills within bold black outlines Katchni which uses fine hatching and parallel line patterns in monochrome or limited colour Tantri which focuses on geometric patterns and ritual mandala compositions Godna which incorporates tattoo-inspired repetitive motif designs and Kohbar which specialises in the elaborate fertility and wedding chamber wall paintings that are the most ceremonially significant Madhubani art form traditionally painted on the walls of the bridal room by the women of the family to bless the newly married couple with fertility prosperity and happiness where the characteristic Madhubani design vocabulary includes the sacred lotus flower fish pair representing fertility sun and moon representing cosmic harmony peacock representing beauty serpent pair representing eternal guardianship elephant procession representing royal authority the sacred Tree of Life and the Goddess Lakshmi representing wealth and divine feminine grace each rendered in bold geometric stylised forms with intricate repetitive pattern fills of dots dashes cross-hatching and parallel lines creating dense flat-patterned compositions that fill every inch of the painting surface without any negative space reflecting the traditional Madhubani artistic principle that the entire surface must be activated with decorative pattern energy.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Natural Dye Pigment Purity QC and Paper Canvas Preparation Standards</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The natural dye pigment purity quality control and paper canvas preparation protocols for Madhubani Bihar folk painting establish the primary technical quality assurance framework for the traditional Bihar Mithila painting process that ensures the colour authenticity and substrate quality of authentic GI-certified Madhubani art products where the natural dye pigment purity test evaluates the chemical composition of each natural colour batch prepared by Madhubani artisan families using thin-layer chromatography and UV-Vis spectrophotometry confirming the primary colourant compounds match the expected natural pigment profiles including rice starch for white turmeric curcuminoids for yellow natural indigo indigotin for blue palash flower anthocyanins for red-orange carbon black from kajal soot and sandalwood santalol derivatives for amber ensuring no synthetic artificial pigments chemical dyes or non-traditional colourants have been introduced that would compromise the authenticity and GI certification status of the Madhubani art product where the pigment purity test also screens for toxic heavy metal contaminants including lead cadmium mercury and arsenic that may be present in commercially sourced mineral pigments or contaminated organic colourant sources confirming all colourants meet the ASTM D4236 standard for art material safety ensuring Madhubani art products are safe for international shipping and consumer handling in overseas markets where the paper canvas preparation test evaluates the quality of the traditional Madhubani substrate preparation process where handmade paper or cotton fabric is first treated with a thin coating of fresh cow dung mixed with local Mithila soil creating the characteristic warm beige-cream background colour that is the signature substrate of authentic Madhubani painting and then coated with a thin layer of lacquer or gum arabic to seal the surface and provide a smooth painting ground where the canvas preparation QC test measures the coating uniformity surface smoothness and adhesive strength of the cow dung base layer using digital microscopy confirming the coating thickness is between fifty and one hundred micrometres across the entire surface without visible lumps cracks or uneven areas that would affect the painting quality and pigment adhesion where the pH test confirms the substrate pH is between six point five and seven point five ensuring the canvas surface is neither too acidic nor too alkaline for stable long-term pigment adhesion without chemical degradation.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Geometric Pattern Symmetry and Border Motif Precision Verification</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The geometric pattern symmetry check and border motif precision verification protocols ensure the visual quality and artistic authenticity of authentic Madhubani Bihar folk paintings where the geometric pattern symmetry test evaluates the bilateral and radial symmetry of characteristic Madhubani design elements including the lotus petal arrangements fish body curves sun ray patterns mandala circle compositions and the repetitive geometric fill patterns that define the Katchni and Tantri Madhubani styles using high-resolution digital scanning at three hundred dots per inch and automated symmetry analysis software comparing left-right and rotational design elements confirming symmetry accuracy within plus or minus one point five millimetres for all repeated pattern elements ensuring the characteristic mirror-symmetry balance and geometric precision of authentic Madhubani art where the pattern density test measures the number of fill elements including dots dashes lines and cross-hatching strokes per square centimetre in the pattern-fill zones confirming the density remains within the traditional Madhubani range of twenty to fifty fill elements per square centimetre without areas of insufficient density that would appear sparse or areas of excessive density that would appear cluttered and muddy where the border motif precision test evaluates the quality and consistency of the decorative border patterns that frame the central composition in Madhubani paintings which traditionally feature elaborate repeated flower vine or geometric border designs that serve as a compositional frame for the central painting subject where the border precision test measures the spacing regularity between repeated border elements confirming the element-to-element spacing variation is within plus or minus one millimetre across the entire border length and that the border pattern maintains consistent line weight and colour density from start to finish without visible thinning thickening or fading that would indicate brush fatigue or pigment inconsistency during the border painting process where the corner mitre test evaluates the precision of the border pattern corners where the horizontal and vertical border patterns meet confirming the corner joins are clean tight and visually seamless without visible gaps overlaps or pattern discontinuities at the four corners of the Madhubani painting frame.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Folk Narrative Fidelity Audit and Madhubani Heritage Market Development</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The folk narrative fidelity audit and Madhubani heritage market development framework provides the artistic quality assurance and commercial market infrastructure for the Madhubani art supply chain ensuring that all GI-certified Madhubani art products demonstrate the authentic folk narrative content and cultural storytelling integrity that defines the Bihar Mithila folk painting tradition while connecting the thirty active Madhubani artisan families across Madhubani Darbhanga Sitamarhi Ranti Jitwarpur Sahrai and Laukahi with growing institutional and international collector market demand for authentic Bihar folk paintings where the folk narrative fidelity audit evaluates the presence and authenticity of the characteristic Madhubani storytelling narrative elements that distinguish authentic folk Madhubani art from non-traditional reproductions including the sacred Hindu mythological content drawn from the Ramayana Mahabharata and local Mithila folklore traditions the ceremonial wedding and fertility symbolism of the Kohbar painting tradition the agrarian nature motifs reflecting the rice-paddy landscape of the Bihar plains the ritual geometric mandala compositions used in Tantri ceremonial paintings and the tattoo-inspired repetitive patterns of the Godna style confirming these narrative elements are genuinely present and executed with the characteristic Madhubani folk artistic sensibility where the story content authentication system verifies each painting genuinely depicts a recognised Madhubani narrative subject through iconographic analysis confirming the figures animals plants and symbolic elements are consistent with the established Madhubani visual vocabulary and are not arbitrary modern compositions that lack the traditional folk narrative foundation where the Madhubani heritage market development initiative led by the Bihar State Art and Culture Department in collaboration with the National Handicrafts Development Corporation and the Bihar State Handicrafts Corporation has established institutional procurement and exhibition programmes connecting the active Madhubani artisan communities with the Tribes India retail network the Bihar State Emporium Patna and international cultural exhibitions at the India International Centre New Delhi the Crafts Museum New Delhi and overseas cultural festivals with projected annual revenue growth of twenty-five percent and expanding GI certification coverage to include the five distinct Madhubani painting styles.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



