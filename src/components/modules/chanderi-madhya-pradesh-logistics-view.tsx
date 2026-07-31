import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#854d0e', '#a16207', '#ca8a04', '#eab308', '#facc15', '#713f12', '#422006', '#fef9c3']
const PRODUCTS = ['Chanderi Silk Butidar Saree', 'Chanderi Cotton-Ikat Wrap', 'Chanderi Gold Zari Pallu', 'Chanderi Butis Mulmul Dupatta', 'Chanderi Floral Tissue Silk', 'Chanderi Peacock Motif Stole', 'Chanderi Temple Border Shawl', 'Chanderi Royal Navratan Fabric']
const ARTISANS = ['Chanderi Weavers MP Cluster', 'Ashoknagar Silk Society MP', 'Isagarh Handloom Guild MP', 'Mungaoli Textile Art MP', 'Guna Chanderi Cooperative MP', 'Shivpuri Heritage Weave MP', 'Vidisha Silk Cluster MP', 'Sironj Craft Workshop MP']
const STATUSES = ['GI MP Chanderi Mark', 'Silk Thread Purity QC', 'Zari Gold Plating Test', 'Buti Weave Density Check', 'Pallu Drape Tension Test', 'Traditional Motif Fidelity Audit']

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
  <Card className="p-4 border-l-4" style={{ borderLeftColor: COLORS[2] }}><p className="text-sm text-muted-foreground">{label}</p><p className="text-lg font-semibold mt-1" style={{ color: COLORS[2] }}>{value}</p></Card>
)

const genRecords = (offset: number) =>
  Array.from({ length: 20 }, (_, i) => ({
    id: `CHD-${String(offset + i + 1).padStart(4, '0')}`,
    artisan: ARTISANS[(offset + i) % ARTISANS.length], design: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 6, ((offset + i) * 19) % 6) + 1,
    cost: ri(8000, 200000, ((offset + i) * 11307) % 192000) + 8000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const chanderirecords = [
  { id: 'CHD-0001', artisan: 'Chanderi Weavers MP Cluster', design: 'Chanderi Silk Butidar Saree', status: 'GI MP Chanderi Mark', qty: 3, cost: 195000, date: '2024-01-11' },
  { id: 'CHD-0002', artisan: 'Ashoknagar Silk Society MP', design: 'Chanderi Cotton-Ikat Wrap', status: 'Silk Thread Purity QC', qty: 4, cost: 45000, date: '2024-01-24' },
  { id: 'CHD-0003', artisan: 'Isagarh Handloom Guild MP', design: 'Chanderi Gold Zari Pallu', status: 'Zari Gold Plating Test', qty: 2, cost: 180000, date: '2024-02-06' },
  { id: 'CHD-0004', artisan: 'Mungaoli Textile Art MP', design: 'Chanderi Butis Mulmul Dupatta', status: 'Buti Weave Density Check', qty: 5, cost: 28000, date: '2024-02-19' },
  { id: 'CHD-0005', artisan: 'Guna Chanderi Cooperative MP', design: 'Chanderi Floral Tissue Silk', status: 'Pallu Drape Tension Test', qty: 3, cost: 150000, date: '2024-03-04' },
  { id: 'CHD-0006', artisan: 'Shivpuri Heritage Weave MP', design: 'Chanderi Peacock Motif Stole', status: 'Traditional Motif Fidelity Audit', qty: 4, cost: 55000, date: '2024-03-17' },
  { id: 'CHD-0007', artisan: 'Vidisha Silk Cluster MP', design: 'Chanderi Temple Border Shawl', status: 'GI MP Chanderi Mark', qty: 2, cost: 200000, date: '2024-03-30' },
  { id: 'CHD-0008', artisan: 'Sironj Craft Workshop MP', design: 'Chanderi Royal Navratan Fabric', status: 'Silk Thread Purity QC', qty: 6, cost: 18000, date: '2024-04-12' },
  { id: 'CHD-0009', artisan: 'Chanderi Weavers MP Cluster', design: 'Chanderi Silk Butidar Saree', status: 'Zari Gold Plating Test', qty: 3, cost: 168000, date: '2024-04-25' },
  { id: 'CHD-0010', artisan: 'Ashoknagar Silk Society MP', design: 'Chanderi Cotton-Ikat Wrap', status: 'Buti Weave Density Check', qty: 4, cost: 52000, date: '2024-05-08' },
  { id: 'CHD-0011', artisan: 'Isagarh Handloom Guild MP', design: 'Chanderi Gold Zari Pallu', status: 'Pallu Drape Tension Test', qty: 2, cost: 175000, date: '2024-05-21' },
  { id: 'CHD-0012', artisan: 'Mungaoli Textile Art MP', design: 'Chanderi Butis Mulmul Dupatta', status: 'Traditional Motif Fidelity Audit', qty: 5, cost: 25000, date: '2024-06-03' },
  { id: 'CHD-0013', artisan: 'Guna Chanderi Cooperative MP', design: 'Chanderi Floral Tissue Silk', status: 'GI MP Chanderi Mark', qty: 3, cost: 145000, date: '2024-06-16' },
  { id: 'CHD-0014', artisan: 'Shivpuri Heritage Weave MP', design: 'Chanderi Peacock Motif Stole', status: 'Silk Thread Purity QC', qty: 4, cost: 48000, date: '2024-06-29' },
  { id: 'CHD-0015', artisan: 'Vidisha Silk Cluster MP', design: 'Chanderi Temple Border Shawl', status: 'Zari Gold Plating Test', qty: 2, cost: 192000, date: '2024-07-12' },
  { id: 'CHD-0016', artisan: 'Sironj Craft Workshop MP', design: 'Chanderi Royal Navratan Fabric', status: 'Buti Weave Density Check', qty: 6, cost: 15000, date: '2024-07-25' },
  { id: 'CHD-0017', artisan: 'Chanderi Weavers MP Cluster', design: 'Chanderi Silk Butidar Saree', status: 'Pallu Drape Tension Test', qty: 3, cost: 160000, date: '2024-08-07' },
  { id: 'CHD-0018', artisan: 'Ashoknagar Silk Society MP', design: 'Chanderi Cotton-Ikat Wrap', status: 'Traditional Motif Fidelity Audit', qty: 4, cost: 38000, date: '2024-08-20' },
  { id: 'CHD-0019', artisan: 'Isagarh Handloom Guild MP', design: 'Chanderi Gold Zari Pallu', status: 'GI MP Chanderi Mark', qty: 5, cost: 22000, date: '2024-09-02' },
  { id: 'CHD-0020', artisan: 'Mungaoli Textile Art MP', design: 'Chanderi Butis Mulmul Dupatta', status: 'Silk Thread Purity QC', qty: 3, cost: 155000, date: '2024-09-15' },
]

export default function ChanderiMadhyaPradeshLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...chanderirecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.design.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'design', label: 'Design', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.design === p).length })) },
    { key: 'artisan', label: 'Artisan', options: ARTISANS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.artisan === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(2, 12, allRecords.length * 0.10 + i * 2) }))
  const artisanChart = ARTISANS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.artisan === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="chd-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Chanderi Art' }]} />
      <PageHeader title="Chanderi Madhya Pradesh Logistics" description="Madhya Pradesh Chanderi silk and cotton handloom supply chain with GI MP Chanderi Mark certification silk thread purity quality control zari gold plating testing buti weave density verification pallu drape tension testing and traditional motif fidelity audit across 8 Chanderi weaving clusters in Ashoknagar Isagarh and Mungaoli" />
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
            <KpiTile label="Active Designs" value={PRODUCTS.length} />
            <KpiTile label="Weaving Clusters" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={95} />
            <HealthRing label="Silk" value={92} />
            <HealthRing label="Zari" value={89} />
            <HealthRing label="Buti" value={94} />
            <HealthRing label="Drape" value={87} />
            <HealthRing label="Motif" value={91} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Master Weavers" value="10 Active" />
            <ValueTile label="Tradition" value="Since 700 AD" />
            <ValueTile label="Export Markets" value="6 Countries" />
            <ValueTile label="Annual Revenue" value="₹3.2 Crore" />
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
            placeholder="Search Chanderi art shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-yellow-100">
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
                  <tr key={record.id} className="border-t hover:bg-yellow-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.design} /></td>
                    <td className="p-3">{record.artisan}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['sarees', 'wraps', 'stoles', 'shawls'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Chanderi Madhya Pradesh — Thirteenth Century Royal Silk Weaving Heritage</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Chanderi represents one of the most prestigious and historically celebrated handloom silk weaving traditions of India originating in the ancient town of Chanderi located in the Ashoknagar district of Madhya Pradesh state where the master weaver communities have maintained an unbroken tradition of producing extraordinarily fine silk and cotton textiles for over thirteen centuries since approximately seven hundred AD making Chanderi one of the oldest continuously practised fine silk weaving traditions in the Indian subcontinent where the town of Chanderi is situated on the banks of the Betwa River surrounded by the historical fortifications and monuments of the medieval Bundela kingdom that patronised the Chanderi weaving tradition as a royal court art form supplying fine silk fabrics to the Rajput courts of central India and the Mughal imperial courts where the term Chanderi derives from the name of the ancient town itself reflecting the geographic origin and cultural identity of this distinguished textile tradition where the Chanderi weaving technique produces textiles of extraordinary fineness and translucency with the finest Chanderi silk sarees achieving fabric weights as light as sixty grams per square metre producing a fabric so sheer and delicate that it can be passed through a small finger ring demonstrating the extraordinary skill and precision of the Chanderi master weavers where the characteristic Chanderi fabric is distinguished by three primary structural features being the buti or buta which are small decorative motifs woven into the fabric surface using extra-weft supplementary weft technique creating delicate raised pattern elements that catch the light with a subtle shimmering effect the zari or metallic thread work that incorporates fine gold and silver metallic threads into the border and pallu designs of Chanderi sarees creating ornate geometric and floral pattern bands and the characteristic sheer transparency of the Chanderi silk fabric that produces a gossamer-light textile with a distinctive crisp hand feel and elegant drape quality that is unmatched by any other Indian silk weaving tradition where the traditional Chanderi weaving process employs the finest quality mulberry silk yarn from Karnataka for the warps and local cotton yarn or silk yarn for the wefts with the supplementary buti patterns created using an additional extra-weft insertion technique that requires the weaver to manually pick up individual warp threads to create each decorative motif producing an estimated fifteen thousand to twenty-five thousand individual thread manipulations per saree and requiring two to four months of concentrated daily weaving work by a single master weaver.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Silk Thread Purity QC and Zari Gold Plating Standards</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The silk thread purity quality control and zari gold plating testing protocols for Madhya Pradesh Chanderi establish the primary technical quality assurance framework for the traditional silk weaving process ensuring the material quality and decorative durability of authentic GI-certified Chanderi products where the silk thread purity QC evaluates the quality characteristics of the mulberry silk yarn used in the Chanderi weaving process measuring the filament diameter uniformity tensile strength elongation at break and sericin content of the silk yarn to confirm it meets the established quality benchmarks for Chanderi-grade silk where the silk yarn purity test uses the standard spectrophotometric analysis method to evaluate the colour consistency and lustre uniformity of the silk yarn confirming the colour difference delta E value between yarn batches is less than one point five ensuring visually consistent fabric appearance across the full length of the woven saree where the silk yarn tensile test evaluates the minimum breaking force of the silk yarn confirming it exceeds four grams force per denier with elongation at break between eighteen and twenty-four percent of the original yarn length which are the established quality benchmarks for premium mulberry silk suitable for the fine Chanderi weaving technique where the zari gold plating test evaluates the metallic thread quality and gold content of the zari threads used in the border and pallu decorative patterns of Chanderi sarees where the test uses X-ray fluorescence spectroscopy to measure the elemental composition of the metallic thread confirming the gold content meets the minimum standard of twenty percent gold by weight for genuine Chanderi gold zari thread and the silver content meets the minimum standard of sixty percent silver by weight where the zari thread durability test evaluates the resistance of the zari metallic thread to tarnishing and mechanical wear using the standard accelerated tarnishing test at forty degrees Celsius and eighty percent relative humidity for ninety-six hours confirming the zari thread shows no visible tarnishing or surface degradation that would compromise the ornamental quality of the finished Chanderi saree border and pallu design.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Buti Weave Density Check and Pallu Drape Tension Verification</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The buti weave density check and pallu drape tension verification protocols ensure the structural quality and aesthetic performance of authentic Madhya Pradesh Chanderi silk and cotton textiles where the buti weave density test evaluates the precision and consistency of the extra-weft supplementary weft technique that creates the characteristic buti or decorative motif patterns on the Chanderi fabric surface where the test measures the buti density defined as the number of buti motifs per square decimetre of fabric surface confirming the buti density meets the minimum standard of twelve butis per square decimetre for the dense buti pattern sarees and eight butis per square decimetre for the standard buti pattern sarees without significant density variation across the fabric surface where the buti density uniformity test measures the variation in buti density across ten standardised sampling areas distributed across the full fabric surface confirming the density variation is within plus or minus fifteen percent of the mean density value ensuring a uniform pattern distribution without areas of sparse or clustered buti placement that would indicate inconsistent weaving technique where the buti execution quality test evaluates the clarity and precision of each individual buti motif confirming the extra-weft pattern produces clean sharp motif outlines with consistent thread tension without the loose thread ends or irregular pattern edges that indicate technique inconsistency where the pallu drape tension test evaluates the mechanical drape quality of the pallu section of the Chanderi saree which is the most heavily ornamented section and therefore the section with the greatest potential for drape stiffness due to the concentration of zari and supplementary weft work where the test uses the standard cantilever drape measurement method clamping the pallu section at one end and measuring the drape length under its own weight confirming the pallu drape length exceeds eighty-five percent of the total pallu length indicating acceptable drape fluidity where the pallu fabric stiffness test uses the standard flexural rigidity measurement confirming the flexural rigidity of the pallu section does not exceed one point five milligram-force centimetre squared ensuring the pallu drapes naturally without stiffness that would impair the elegant drape quality that is the hallmark of authentic Chanderi silk sarees.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Traditional Motif Fidelity Audit and Chanderi Heritage Market Expansion</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The traditional motif fidelity audit and Chanderi heritage market expansion framework provides the artistic quality assurance and commercial market infrastructure for the Madhya Pradesh Chanderi handloom supply chain ensuring that all GI-certified Chanderi products demonstrate the authentic traditional motif vocabulary and cultural design integrity that defines the thirteen-century Chanderi royal silk weaving heritage while connecting the active Chanderi weaver communities across Chanderi Ashoknagar Isagarh Mungaoli Guna Shivpuri Vidisha and Sironj with growing institutional and international collector market demand for authentic Madhya Pradesh Chanderi silk textiles where the traditional motif fidelity audit evaluates the presence and accuracy of the characteristic Chanderi design vocabulary elements that distinguish authentic Chanderi weaving from non-traditional reproductions and power-loom imitations including the suraj buta or sun motif representing divine radiance and cosmic order the chandra buta or moon motif representing feminine grace and nocturnal beauty the naina buta or eye motif representing spiritual perception and divine vigilance the phool buta or flower motif representing natural abundance and seasonal renewal the panna or emerald motif representing prosperity and royal authority and the characteristic Chanderi border patterns featuring geometric and floral pattern bands in the traditional Chanderi colour palette of gold on white or gold on pastel where the motif execution test verifies the sharpness and clarity of each buti motif confirming the extra-weft supplementary weft technique produces clean crisp motif outlines without the characteristic blur or feathering that indicates inconsistent thread tension or incorrect pick-up sequence where the traditional Chanderi fabric transparency test confirms the fabric achieves the characteristic Chanderi sheer quality measured as the fabric opacity percentage under standard backlight conditions confirming the fabric opacity is less than forty percent for the pure silk Chanderi and less than twenty-five percent for the tissue silk Chanderi varieties where the Chanderi heritage market expansion initiative led by the Madhya Pradesh State Handloom and Handicrafts Development Corporation in collaboration with the Chanderi Weavers Cooperative Society the Ashoknagar District Handloom Office and the National Handloom Development Corporation has established institutional patronage connecting the active Chanderi weavers with the MP State Emporium and international cultural exhibitions with projected annual revenue growth of thirty-eight percent.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



