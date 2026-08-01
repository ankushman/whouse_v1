import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#9a3412', '#7c2d12', '#431407', '#1c1917', '#c2410c', '#ea580c', '#f97316', '#fff7ed']
const PRODUCTS = ['Rajasthani Katputli String Puppet', 'Channapatna Lacquer Wood Toy', 'Thanjavur Dancing Doll', 'Benaras Hand-Painted Toy Set', 'Kondapalli Bommalu Wood Toy', 'Nimmu Paper Kite Assorted', 'Ganjifa Hand-Painted Cards', 'Assamese Bihu Bamboo Doll']
const ARTISANS = ['Jodhpur Puppet Cluster RJ', 'Channapatna Lacquer Guild KA', 'Thanjavur Doll Artisans TN', 'Varanasi Woodcraft UP', 'Kondapalli Toy Society AP', 'Ahmedabad Kite Crafters GJ', 'Sawantwadi Lacquer MH', 'Guwahati Bamboo Craft AS']
const STATUSES = ['GI Traditional Toys Mark', 'IS 16793 Hand Toy Grade A', 'Bubble Wrap Foam Pack', 'Palletised Truck Transit', 'Dry Storage 18-30C', 'Paint Safety Lead QC']

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
    id: `PTT-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 28, ((offset + i) * 27) % 28) + 1,
    cost: ri(6000, 92000, ((offset + i) * 13107) % 86000) + 6000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const puppetryRecords = [
  { id: 'PTT-0001', painter: 'Jodhpur Puppet Cluster RJ', ware: 'Rajasthani Katputli String Puppet', status: 'GI Traditional Toys Mark', qty: 3, cost: 78000, date: '2024-01-12' },
  { id: 'PTT-0002', painter: 'Channapatna Lacquer Guild KA', ware: 'Channapatna Lacquer Wood Toy', status: 'IS 16793 Hand Toy Grade A', qty: 5, cost: 52000, date: '2024-01-25' },
  { id: 'PTT-0003', painter: 'Thanjavur Doll Artisans TN', ware: 'Thanjavur Dancing Doll', status: 'Bubble Wrap Foam Pack', qty: 2, cost: 88000, date: '2024-02-08' },
  { id: 'PTT-0004', painter: 'Varanasi Woodcraft UP', ware: 'Benaras Hand-Painted Toy Set', status: 'Palletised Truck Transit', qty: 6, cost: 34000, date: '2024-02-20' },
  { id: 'PTT-0005', painter: 'Kondapalli Toy Society AP', ware: 'Kondapalli Bommalu Wood Toy', status: 'Dry Storage 18-30C', qty: 8, cost: 22000, date: '2024-03-05' },
  { id: 'PTT-0006', painter: 'Ahmedabad Kite Crafters GJ', ware: 'Nimmu Paper Kite Assorted', status: 'Paint Safety Lead QC', qty: 4, cost: 62000, date: '2024-03-18' },
  { id: 'PTT-0007', painter: 'Sawantwadi Lacquer MH', ware: 'Ganjifa Hand-Painted Cards', status: 'GI Traditional Toys Mark', qty: 3, cost: 85000, date: '2024-03-30' },
  { id: 'PTT-0008', painter: 'Guwahati Bamboo Craft AS', ware: 'Assamese Bihu Bamboo Doll', status: 'IS 16793 Hand Toy Grade A', qty: 5, cost: 48000, date: '2024-04-12' },
  { id: 'PTT-0009', painter: 'Jodhpur Puppet Cluster RJ', ware: 'Channapatna Lacquer Wood Toy', status: 'Bubble Wrap Foam Pack', qty: 4, cost: 56000, date: '2024-04-24' },
  { id: 'PTT-0010', painter: 'Channapatna Lacquer Guild KA', ware: 'Rajasthani Katputli String Puppet', status: 'Palletised Truck Transit', qty: 3, cost: 72000, date: '2024-05-06' },
  { id: 'PTT-0011', painter: 'Thanjavur Doll Artisans TN', ware: 'Thanjavur Dancing Doll', status: 'Dry Storage 18-30C', qty: 6, cost: 38000, date: '2024-05-18' },
  { id: 'PTT-0012', painter: 'Varanasi Woodcraft UP', ware: 'Benaras Hand-Painted Toy Set', status: 'Paint Safety Lead QC', qty: 2, cost: 90000, date: '2024-05-30' },
  { id: 'PTT-0013', painter: 'Kondapalli Toy Society AP', ware: 'Kondapalli Bommalu Wood Toy', status: 'GI Traditional Toys Mark', qty: 7, cost: 26000, date: '2024-06-12' },
  { id: 'PTT-0014', painter: 'Ahmedabad Kite Crafters GJ', ware: 'Nimmu Paper Kite Assorted', status: 'IS 16793 Hand Toy Grade A', qty: 4, cost: 58000, date: '2024-06-24' },
  { id: 'PTT-0015', painter: 'Sawantwadi Lacquer MH', ware: 'Ganjifa Hand-Painted Cards', status: 'Bubble Wrap Foam Pack', qty: 3, cost: 82000, date: '2024-07-06' },
  { id: 'PTT-0016', painter: 'Guwahati Bamboo Craft AS', ware: 'Assamese Bihu Bamboo Doll', status: 'Palletised Truck Transit', qty: 5, cost: 44000, date: '2024-07-18' },
  { id: 'PTT-0017', painter: 'Jodhpur Puppet Cluster RJ', ware: 'Kondapalli Bommalu Wood Toy', status: 'Dry Storage 18-30C', qty: 4, cost: 68000, date: '2024-07-30' },
  { id: 'PTT-0018', painter: 'Channapatna Lacquer Guild KA', ware: 'Rajasthani Katputli String Puppet', status: 'Paint Safety Lead QC', qty: 3, cost: 76000, date: '2024-08-10' },
  { id: 'PTT-0019', painter: 'Thanjavur Doll Artisans TN', ware: 'Thanjavur Dancing Doll', status: 'GI Traditional Toys Mark', qty: 6, cost: 42000, date: '2024-08-22' },
  { id: 'PTT-0020', painter: 'Varanasi Woodcraft UP', ware: 'Benaras Hand-Painted Toy Set', status: 'IS 16793 Hand Toy Grade A', qty: 2, cost: 92000, date: '2024-09-03' },
]

export default function PuppetryTraditionalToysLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...puppetryRecords, ...genRecords(21), ...genRecords(41)]


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
    <div className="ptt-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Puppetry & Traditional Toys' }]} />
      <PageHeader title="Puppetry & Traditional Toys Logistics" description="India traditional puppetry and handcrafted toys supply chain with IS 16793 certification, lead-safe paint QC, bubble wrap foam packaging, and GI Traditional Toys Mark across 8 heritage artisan clusters in Rajasthan, Karnataka, Tamil Nadu, Andhra Pradesh, and Gujarat" />
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
            <KpiTile label="Artisan Clusters" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={93} />
            <HealthRing label="IS 16793" value={89} />
            <HealthRing label="Bubble" value={85} />
            <HealthRing label="Truck" value={81} />
            <HealthRing label="Dry" value={87} />
            <HealthRing label="Lead QC" value={91} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="50+" />
            <ValueTile label="Tradition" value="Since 5th C" />
            <ValueTile label="Export Markets" value="15 Countries" />
            <ValueTile label="Annual Revenue" value="₹12 Crore" />
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
            placeholder="Search puppetry and traditional toy shipments..."
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
              <CardHeader><CardTitle>Indian Puppetry & Traditional Toys — 1500-Year Performance Art Heritage</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Indian puppetry and traditional toy crafts represent one of the most culturally diverse and historically ancient handicraft traditions of the Indian subcontinent spanning over fifteen centuries of continuous artistic production across virtually every region of India from the iconic Rajasthani Katputli string puppet tradition of the Jodhpur, Jaipur, and Bikaner districts of Rajasthan where hereditary Bhat puppeteer communities create elaborately costumed marionette puppets depicting characters from the Ramayana, Mahabharata, and local folk narratives performing travelling puppet theatre shows at village festivals, wedding celebrations, and temple fair gatherings that have been a central feature of Rajasthani cultural life for over a millennium, to the intricate Channapatna lacquer-turned wooden toy tradition of Karnataka's Ramanagara district where traditional artisan families create brightly coloured wooden toys, educational learning aids, and decorative objects using the distinctive lacquer-turning technique on locally sourced hale wood and ivory wood that has earned the Geographical Indication tag from the Government of India recognising the unique Channapatna lacquerware craftsmanship, to the Thanjavur dancing doll tradition of Tamil Nadu where the iconic bobble-head rolangi dolls depicting classical Bharatanatyam dance postures are hand-crafted from clay, papier-mache, and painted plaster using techniques documented in the Chola dynasty court workshops of the ninth through thirteenth centuries CE when the Thanjavur Nayak kingdom patronised the classical arts producing the iconic dancing doll form that remains one of the most recognisable Indian craft products in the international market. The Indian traditional toy sector encompasses an extraordinary diversity of regional craft traditions each with distinctive materials, techniques, and visual vocabularies including the Kondapalli Bommalu lightweight wood toy tradition of Andhra Pradesh's Krishna district where the tella poniki wood sourced from the nearby Kondapalli forest reserves is carved into vividly coloured animal figures, mythological characters, and village scene tableaux using a distinctive combination of wood carving, sawdust paste modelling, and vegetable dye painting techniques that have been practised by the traditional Kondapalli artisan families for over four hundred years, the Sawantwadi lacquerware and Ganjifa playing card tradition of Maharashtra's Sindhudurg district where the unique Ganjifa round playing cards hand-painted with mythological miniature paintings on lacquered stiffened cloth or cardboard represent one of the most technically demanding miniature painting traditions in Indian craft where each card requires hours of meticulous hand-painting work to produce the detailed figural compositions depicting the ten avatars of Lord Vishnu or the twelve houses of the Navagraha astrological tradition that characterise the Ganjifa card decks used in the traditional noble court pastime that has been preserved as a living craft tradition in the Sawantwadi royal workshops, and the Assamese Bihu bamboo and cloth doll tradition of Guwahati where the vibrant bamboo-frame dolls depicting the energetic Bihu dance postures of Assamese folk culture are hand-crafted using locally sourced bamboo, cotton cloth, and hand-woven Assamese silk textiles creating a distinctive regional doll art form that combines bamboo structural engineering with textile artistry in a uniquely Assamese craft tradition that represents the cultural identity and artistic heritage of the Assamese people of Northeastern India.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16793 Hand Toy Standards & Lead-Safe Paint QC</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The IS 16793 standard for Indian traditional toys and puppetry craft products establishes India's comprehensive quality and safety certification framework for the traditional handcrafted toy sector covering all categories of traditional Indian toys including wooden toys, cloth dolls, paper-mache figures, lacquerware toys, and string puppets produced across the major Indian toy craft clusters specifying rigorous safety requirements for surface coating paint heavy metal content, structural integrity and mechanical safety for children under thirty-six months, flammability resistance for cloth and papier-mache toy components, and microbiological safety for toys using natural materials including cotton stuffing, sawdust filler, and plant-based adhesive compounds that collectively ensure traditional Indian toy products meet the same safety standards required for internationally manufactured toy products while preserving the distinctive handcraft quality, natural material authenticity, and cultural design vocabulary that distinguishes Indian traditional toys from mass-market plastic and electronic toy products. The surface coating paint heavy metal requirements for IS 16793 certification mandate compliance with the globally harmonised toy safety limits for soluble heavy metal content including maximum lead content of 90 parts per million, maximum cadmium content of 75 parts per million, maximum mercury content of 60 parts per million, and maximum chromium content of 60 parts per million measured by atomic absorption spectroscopy following the standardised acid extraction methodology specified in IS 16793 Annexure B where the toy surface coating paint is subjected to hydrochloric acid extraction at pH 0.07 for two hours at 37 degrees Celsius simulating the gastric acid solubilisation conditions that would occur if a child ingested paint flakes from the toy surface during the normal mouthing and biting behaviour that characterises children under thirty-six months of age who represent the highest-risk user group for toy paint heavy metal exposure. The traditional Indian toy sector faces particular challenges in meeting lead-safe paint requirements because many traditional artisan toy-makers continue to use commercial enamel and lacquer paints containing lead-based pigments that provide the bright durable colour finish preferred by consumers but pose serious lead exposure risks to young children who may ingest paint flakes during normal play and handling activities creating an urgent need for the IS 16793 certification framework to drive the transition from lead-containing traditional paint formulations to certified lead-free alternatives that maintain the bright colour aesthetics and durability that consumers expect from Indian traditional toy products while eliminating the lead exposure risk that has historically been the most significant safety concern for traditional Indian handcrafted toys in both the domestic Indian market and international toy safety regulatory frameworks including the European Union Toy Safety Directive, the United States Consumer Product Safety Improvement Act, and the Indian Toys Safety Regulation administered by the Bureau of Indian Standards where compliance with IS 16793 heavy metal limits is mandatory for all toy products sold in the Indian market.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Bubble Wrap Foam Packaging for Traditional Toy Transit</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Bubble wrap foam packaging with custom-fitted insert compartments has been specifically developed for the Indian traditional toy logistics supply chain to protect the delicate painted surfaces, carved wooden components, textile costume elements, and articulated string mechanisms that characterise authentic Indian traditional toys and puppets from the physical and environmental hazards encountered during transit from the artisan production centres in the Jodhpur, Channapatna, Thanjavur, Kondapalli, Varanasi, Ahmedabad, Sawantwadi, and Guwahati craft clusters to domestic retail distribution points across India and international export destinations serving the growing global demand for authenticated Indian traditional toy products where the fragile handcrafted nature of traditional toys requires specialised packaging solutions that differ significantly from the standardised corrugated box packaging used for mass-market plastic toy products. The packaging specification utilises closed-cell polyethylene foam sheeting with minimum density of 20 kilograms per cubic metre and bubble height of 10 millimetres as the primary cushioning material providing shock-absorbing protection against the impact and vibration forces encountered during road transport along the national highway network connecting the artisan production centres to the major urban distribution hubs, supplemented by custom-fitted corrugated fibreboard compartment inserts that separate individual toy items within the shipping box preventing surface-to-surface contact friction damage between adjacent items that could scratch painted surfaces, snag textile costume elements, or tangle the delicate string mechanisms of Rajasthani Katputli puppets and Channapatna lacquerware toys where the articulated components and surface finishes require individual compartment isolation to prevent transit damage. Each traditional toy product undergoes pre-packaging quality inspection verifying paint safety compliance through portable X-ray fluorescence screening confirming soluble heavy metal content within the IS 16793 certification limits, structural integrity verification confirming absence of loose components, sharp edges, or mechanical hazards that would present safety risks during consumer use, and visual quality verification confirming paint finish quality, colour consistency, and overall cosmetic quality meeting the Grade A standard requirements before the approved product proceeds to the packaging stage where it is individually wrapped in acid-free tissue paper, placed within its custom-fitted foam compartment insert, and sealed within the rigid outer shipping container with moisture-barrier polyethylene liner protecting against humidity condensation during transit through the variable climate zones of the Indian subcontinent where temperature and humidity conditions can change dramatically during multi-day road transit journeys from the Himalayan north to the peninsular south requiring robust moisture barrier protection to prevent warping of wooden toy components, mould growth on organic material elements, and deterioration of natural adhesive compounds that could compromise the structural integrity and cosmetic quality of traditional toy products during extended transit periods.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Craft Verification & Traditional Toy Heritage Market Development</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and computer vision technologies are being progressively deployed to verify the authenticity and quality of Indian traditional toy products and distinguish genuine handcrafted items produced by traditional artisan communities from the growing volume of machine-manufactured plastic toy imitations and factory-painted wooden toy reproductions that have increasingly appeared in both domestic Indian retail markets and international online platforms where consumers seeking authentic Indian traditional toys face growing difficulty distinguishing handcrafted originals from mass-produced imitations that replicate the visual appearance of traditional designs at significantly lower prices but lack the distinctive material quality, handcraft authenticity, and cultural heritage value of genuine artisan products. The AI verification system for Indian traditional toys employs high-resolution three-dimensional scanning combined with multispectral surface analysis to capture the complete geometric form, surface texture, and material composition characteristics of each toy product, analysing the surface texture signatures where hand-carved wooden toys from Channapatna, Kondapalli, and Varanasi exhibit distinctive hand-tool marks including chisel impressions, knife carving grooves, and hand-sanding patterns that differ from the uniform machine-carved surface texture of CNC-routed wooden toy reproductions where the automated tool paths produce mechanically regular surface patterns lacking the characteristic hand-craft irregularities, the paint application signatures where hand-painted traditional toys exhibit brush stroke patterns, paint thickness variations, and colour boundary characteristics that differ from the uniform spray-painted finish of factory-produced toy reproductions where the automated spray application process produces a mechanically consistent paint layer lacking the distinctive manual brush application characteristics of authentic hand-painted traditional toys, and the material composition signatures obtained through portable X-ray fluorescence spectroscopy where the distinctive elemental composition profiles of traditional natural material ingredients including locally sourced wood species, vegetable-based colourants, natural lacquer compositions, and hand-spun cotton textile elements produce material fingerprints that differ from the synthetic material compositions of factory-produced toy reproductions where petroleum-derived plastics, synthetic lacquers, and factory-spun textile materials produce elemental composition profiles clearly distinguishable from the natural material signatures of genuine traditional handcrafted toys providing a reliable authentication framework for distinguishing authentic Indian traditional toy products from machine-manufactured imitations across all major Indian traditional toy craft traditions. The AI-powered market development platform connects traditional toy artisan cooperatives directly with institutional buyers including the National Handloom and Handicraft Museum, state government handicraft emporiums, international toy museums seeking authentic Indian craft objects for their collections, premium children's brands seeking ethically sourced artisanal toys, and cultural heritage organisations promoting traditional craft preservation and sustainable livelihood development for the approximately five hundred thousand artisan families engaged in traditional toy production across India where the GI Traditional Toys Mark and IS 16793 certification provide the quality assurance framework needed to establish premium market positioning in both domestic and international markets.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

