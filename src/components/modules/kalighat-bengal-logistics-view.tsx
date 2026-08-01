import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#be123c', '#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#881337', '#4c0519', '#ffe4e6']
const PRODUCTS = ['Kalighat Babu Bibi Painting', 'Kalighat Cat Fish Art', 'Kalighat Goddess Kali Scroll', 'Kalighat Horse Rider Mural', 'Kalighat Religious Procession', 'Kalighat Ox Cart Scene', 'Kalighat Deity Dance Panel', 'Kalighat Urban Life Canvas']
const ARTISANS = ['Kalighat Patua Guild Kolkata WB', 'Kumartuli Clay Artists WB', 'Howrah Kalighat Society WB', 'Serampore Scroll Painters WB', 'Barrackpore Kalighat Cluster WB', 'Chinsurah Heritage Artists WB', 'Hooghly Kalighat Cooperative WB', 'Chandannagar Traditional WB']
const STATUSES = ['GI West Bengal Kalighat Mark', 'Natural Pigment Binder QC', 'Handmade Paper Stretch QC', 'Acid-Free Sleeve Box Pack', 'Dehumidified Archive Storage', 'Kalighat Line Fidelity Test']

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
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ffe4e6" strokeWidth="6" />
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
    id: `KAL-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 20, ((offset + i) * 19) % 20) + 1,
    cost: ri(4000, 52000, ((offset + i) * 10707) % 48000) + 4000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const kalighatrecords = [
  { id: 'KAL-0001', painter: 'Kalighat Patua Guild Kolkata WB', ware: 'Kalighat Babu Bibi Painting', status: 'GI West Bengal Kalighat Mark', qty: 3, cost: 48000, date: '2024-01-15' },
  { id: 'KAL-0002', painter: 'Kumartuli Clay Artists WB', ware: 'Kalighat Cat Fish Art', status: 'Natural Pigment Binder QC', qty: 5, cost: 36000, date: '2024-01-28' },
  { id: 'KAL-0003', painter: 'Howrah Kalighat Society WB', ware: 'Kalighat Goddess Kali Scroll', status: 'Handmade Paper Stretch QC', qty: 2, cost: 52000, date: '2024-02-10' },
  { id: 'KAL-0004', painter: 'Serampore Scroll Painters WB', ware: 'Kalighat Horse Rider Mural', status: 'Acid-Free Sleeve Box Pack', qty: 7, cost: 22000, date: '2024-02-22' },
  { id: 'KAL-0005', painter: 'Barrackpore Kalighat Cluster WB', ware: 'Kalighat Religious Procession', status: 'Dehumidified Archive Storage', qty: 4, cost: 44000, date: '2024-03-08' },
  { id: 'KAL-0006', painter: 'Chinsurah Heritage Artists WB', ware: 'Kalighat Ox Cart Scene', status: 'Kalighat Line Fidelity Test', qty: 6, cost: 28000, date: '2024-03-20' },
  { id: 'KAL-0007', painter: 'Hooghly Kalighat Cooperative WB', ware: 'Kalighat Deity Dance Panel', status: 'GI West Bengal Kalighat Mark', qty: 2, cost: 50000, date: '2024-04-03' },
  { id: 'KAL-0008', painter: 'Chandannagar Traditional WB', ware: 'Kalighat Urban Life Canvas', status: 'Natural Pigment Binder QC', qty: 8, cost: 16000, date: '2024-04-16' },
  { id: 'KAL-0009', painter: 'Kalighat Patua Guild Kolkata WB', ware: 'Kalighat Cat Fish Art', status: 'Handmade Paper Stretch QC', qty: 4, cost: 40000, date: '2024-04-28' },
  { id: 'KAL-0010', painter: 'Kumartuli Clay Artists WB', ware: 'Kalighat Babu Bibi Painting', status: 'Acid-Free Sleeve Box Pack', qty: 3, cost: 48000, date: '2024-05-10' },
  { id: 'KAL-0011', painter: 'Howrah Kalighat Society WB', ware: 'Kalighat Goddess Kali Scroll', status: 'Dehumidified Archive Storage', qty: 5, cost: 32000, date: '2024-05-23' },
  { id: 'KAL-0012', painter: 'Serampore Scroll Painters WB', ware: 'Kalighat Horse Rider Mural', status: 'Kalighat Line Fidelity Test', qty: 6, cost: 20000, date: '2024-06-05' },
  { id: 'KAL-0013', painter: 'Barrackpore Kalighat Cluster WB', ware: 'Kalighat Religious Procession', status: 'GI West Bengal Kalighat Mark', qty: 3, cost: 46000, date: '2024-06-18' },
  { id: 'KAL-0014', painter: 'Chinsurah Heritage Artists WB', ware: 'Kalighat Ox Cart Scene', status: 'Natural Pigment Binder QC', qty: 7, cost: 24000, date: '2024-07-01' },
  { id: 'KAL-0015', painter: 'Hooghly Kalighat Cooperative WB', ware: 'Kalighat Deity Dance Panel', status: 'Handmade Paper Stretch QC', qty: 2, cost: 52000, date: '2024-07-14' },
  { id: 'KAL-0016', painter: 'Chandannagar Traditional WB', ware: 'Kalighat Urban Life Canvas', status: 'Acid-Free Sleeve Box Pack', qty: 10, cost: 12000, date: '2024-07-26' },
  { id: 'KAL-0017', painter: 'Kalighat Patua Guild Kolkata WB', ware: 'Kalighat Babu Bibi Painting', status: 'Dehumidified Archive Storage', qty: 4, cost: 42000, date: '2024-08-08' },
  { id: 'KAL-0018', painter: 'Kumartuli Clay Artists WB', ware: 'Kalighat Cat Fish Art', status: 'Kalighat Line Fidelity Test', qty: 5, cost: 30000, date: '2024-08-20' },
  { id: 'KAL-0019', painter: 'Howrah Kalighat Society WB', ware: 'Kalighat Goddess Kali Scroll', status: 'GI West Bengal Kalighat Mark', qty: 3, cost: 50000, date: '2024-09-02' },
  { id: 'KAL-0020', painter: 'Serampore Scroll Painters WB', ware: 'Kalighat Horse Rider Mural', status: 'Natural Pigment Binder QC', qty: 8, cost: 18000, date: '2024-09-14' },
]

export default function KalighatBengalLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...kalighatrecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'painter', label: 'Painter', options: ARTISANS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.painter === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(4, 20, allRecords.length * 0.10 + i * 3) }))
  const artisanChart = ARTISANS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.painter === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="kal-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Kalighat Bengal' }]} />
      <PageHeader title="Kalighat Bengal Logistics" description="West Bengal Kalighat folk art supply chain with GI West Bengal Kalighat Mark, natural pigment binder quality control, handmade paper stretch verification, acid-free sleeve box packaging, dehumidified archive storage, and Kalighat line fidelity testing across 8 artisan clusters in Kolkata, Howrah, and Hooghly" />
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
            <KpiTile label="Art Clusters" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={90} />
            <HealthRing label="Pigment" value={85} />
            <HealthRing label="Paper" value={82} />
            <HealthRing label="Pack" value={87} />
            <HealthRing label="Archive" value={89} />
            <HealthRing label="Line" value={91} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Patua Families" value="85 Active" />
            <ValueTile label="Tradition" value="Since 1800 AD" />
            <ValueTile label="Export Markets" value="7 Countries" />
            <ValueTile label="Annual Revenue" value="₹2.1 Crore" />
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
            placeholder="Search Kalighat art shipments..."
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
                    <td className="p-3">{record.qty} {['pcs', 'panels', 'scrolls', 'frames'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Kalighat Art — 225-Year Kolkata Patua Folk Painting Heritage</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Kalighat art represents one of the most historically significant and artistically influential folk painting traditions of India having originated in the early nineteenth century around eighteen hundred near the Kalighat temple in south Kolkata West Bengal as a distinctive urban folk art form created by the Patua community of scroll painters who migrated from rural Bengal to the growing metropolis of Calcutta seeking patronage from the temple visitors and the newly emerging urban middle class of colonial Bengal where the Kalighat artists developed a revolutionary new painting style that departed from the classical Indian miniature tradition by employing bold sweeping brush strokes simplified anatomical forms and vibrant flat colour areas to create quickly executed paintings on handmade paper that could be produced rapidly and sold affordably to the thousands of pilgrims visiting the Kalighat temple daily establishing Kalighat art as one of India's earliest forms of popular commercial art that bridged the gap between traditional folk painting and the emerging modern art movement in Bengal where the Kalighat painting tradition is broadly categorised into two major thematic streams the religious stream depicting Hindu deities and mythological narratives including the goddess Kali in her various forms Lord Shiva Durga Lakshmi Saraswati and episodes from the Ramayana and Mahabharata epics and the secular stream depicting contemporary urban social commentary including the famous Babu Bibi series satirising the Westernised Bengali Babu and his Bibi mistress the corruption of the zamindari landlords the hypocrisy of religious practitioners and the emerging social reform movements of nineteenth century Bengal where the Kalighat artists pioneered the use of inexpensive machine-made paper and water-based pigment washes in place of the expensive handmade paper and mineral pigment preparations required for classical Indian miniature painting creating an innovative production methodology that dramatically reduced production costs while maintaining the distinctive visual quality characterised by the bold contour lines sweeping forms and vibrant colour palette that made Kalighat paintings instantly recognisable and commercially successful where the Kalighat art tradition flourished for approximately one hundred years from eighteen hundred to nineteen hundred before declining due to the advent of cheaper printed colour lithographs and oleograph reproductions that displaced the hand-painted Kalighat paintings from the popular market though the tradition was revived in the mid-twentieth century through the efforts of cultural institutions and individual artists who preserved and perpetuated the distinctive Kalighat painting technique creating a living art tradition that continues to be practised by contemporary Patua artists in the Kalighat temple area and surrounding districts of West Bengal.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Natural Pigment Binder QC & Handmade Paper Standards</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The natural pigment binder quality control framework for Kalighat art establishes a comprehensive testing protocol for the traditional water-based pigment preparations and handmade paper substrates used in authentic Kalighat folk paintings where the traditional Kalighat pigment preparation employs natural mineral and vegetable pigments including vermilion red from cinnabar or mercuric sulphide lampblack carbon black from partially burnt mustard oil lamp soot yellow orpiment from natural arsenic sulphide mineral deposits indigo blue from Indigofera tinctoria plant extract Indian yellow from mango-fed cow urine and shell white from burned and ground conch shell mixed with a traditional binder of aged tamarind seed kernel gum providing the adhesive medium that binds the pigment particles to the handmade paper surface where the binder quality test measures the viscosity and adhesion strength of the tamarind seed gum solution using a Ford cup flow meter confirming viscosity between twenty and thirty seconds and a standardised peel test confirming pigment binder adhesion retention above ninety percent on the handmade paper substrate ensuring the Kalighat pigment application maintains crisp contour line quality without feathering bleeding or spreading beyond the intended design boundaries that would compromise the distinctive bold-line visual quality that characterises authentic Kalighat art where the pigment particle size analysis using laser diffraction methodology confirms maximum particle diameter of thirty microns for all mineral pigments ensuring smooth consistent application across the handmade paper surface without visible particle granularity that would detract from the refined sweeping brushstroke quality of the Kalighat painting technique where the handmade paper substrate quality control requires handmade paper manufactured from cotton rag pulp with minimum grammage of one hundred and twenty grams per square metre measured in accordance with IS 5915 handmade paper specifications confirming sufficient paper thickness and rigidity to support the bold brush strokes and water-based pigment washes employed in the Kalighat painting technique without paper warping cockling or fibre lifting that would compromise the painting surface quality where the paper pH test confirms acid-neutral pH value between six point five and seven point five measured in accordance with ISO 10716 permanent paper acidity testing ensuring the handmade paper substrate does not generate acidic degradation products that could cause pigment discoloration or paper fibre oxidation during extended storage and display of Kalighat paintings in museum and gallery environments.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Acid-Free Sleeve Box Packaging for Kalighat Painting Transit</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Acid-free sleeve box packaging with polyester film overlay and rigid backing board protection has been specifically designed for the Kalighat folk art painting supply chain to protect the delicate water-based pigment surfaces and handmade paper substrates from the physical abrasion moisture exposure UV light damage and mechanical compression hazards encountered during transit from the Kalighat artisan workshops in the Kolkata temple district to urban retail galleries museum collections and international exhibition venues where the packaging specification utilises acid-free four-flap archival sleeve boxes constructed from acid-free millboard with pH value between seven point five and eight point five measured in accordance with ISO 10214 permanent board acidity testing methodology ensuring the archival sleeve box material does not generate acidic degradation products that could cause pigment discoloration or paper fibre oxidation during extended storage periods where each Kalighat painting is individually mounted on acid-free museum mounting board using starch paste adhesive providing a rigid backing support that prevents flexing and creasing of the handmade paper substrate during handling and transit where the mounted painting surface is protected by an archival polyester film overlay sheet such as Melinex or Mylar providing a transparent barrier that shields the painted surface from moisture contact abrasion and direct UV exposure while allowing visual inspection of the painting without opening the archival sleeve where the rigid backing board provides physical protection against stacking compression and handling impacts measured as minimum edge crush resistance of four kilonewtons per metre confirming the sleeve box maintains structural integrity under the stacking loads encountered during road transit from the Kolkata production centres to distribution hubs and international air cargo terminals where the packaging includes a moisture indicator card within each sleeve box providing visual indication of humidity levels within the sealed archival packaging enabling quality personnel to verify that storage humidity has remained within the acceptable range of thirty to fifty percent relative humidity throughout the transit period preventing ambient moisture condensation that could cause water-based pigment softening paper cockling and mould growth on the handmade paper substrate during transit through the high-humidity monsoon climate of the Bengal delta region where relative humidity frequently exceeds eighty percent during the June through September monsoon season creating environmental conditions that pose significant risks to water-based pigment paintings on handmade paper substrates during the transit and distribution cycle.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Dehumidified Archive & Kalighat Heritage Market Development</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Dehumidified archive storage facilities with UV-filtered lighting and acid-free storage environment have been established for the Kalighat folk art painting supply chain to protect the water-based natural pigment surfaces and handmade paper substrates from the environmental degradation risks posed by the extreme monsoon humidity of Kolkata and the Bengal delta region where relative humidity exceeds eighty-five percent for four months annually creating conditions that cause handmade paper dimensional instability water-based pigment softening fungal colonisation and insect infestation by silverfish and paper mites that would irreversibly compromise the visual quality and structural integrity of authentic Kalighat paintings where the archive storage specification maintains temperature within the range of eighteen to twenty-two degrees Celsius with relative humidity between forty and fifty percent measured by calibrated digital sensors with continuous monitoring and automated dehumidification activation when humidity exceeds the fifty percent threshold providing consistent archival storage conditions throughout the annual monsoon cycle where the storage facility employs UV-filtered fluorescent lighting with maximum UV emission below seventy-five microwatts per lumen measured in accordance with ISO 10526 UV radiation testing methodology preventing photo-oxidative degradation of the natural vermilion lampblack and indigo pigments that provide the distinctive colour palette of Kalighat art where the vermilion mercury sulphide pigment is particularly susceptible to UV-induced darkening and the organic indigo pigment to UV-induced fading that would diminish the characteristic visual impact of authentic Kalighat paintings over extended storage and display periods where the archive racking system uses powder-coated steel shelving with acid-free interleaving tissue between stored paintings preventing pigment-to-pigment contact abrasion and paper fibre transfer during storage retrieval operations. The Kalighat heritage market development initiative led by the West Bengal State Handicrafts Development Corporation in collaboration with the Kalighat Patua Guild and the Victoria Memorial Hall Kolkata has established a comprehensive cultural heritage market platform connecting the remaining active Kalighat Patua artist families with institutional buyers including the National Gallery of Modern Art Mumbai the Indian Museum Kolkata the British Museum London and the Victoria and Albert Museum London where the GI West Bengal Kalighat Mark provides the cultural provenance and authenticity assurance framework essential for establishing premium market positioning for authentic Kalighat paintings in the growing global market for Indian heritage folk art where the extraordinary historical significance of Kalighat art as the bridge between classical Indian painting and modern Indian art has created exceptional institutional collector demand positioning authentic Kalighat paintings as among the most historically significant Indian folk art products in the global museum and heritage art collection market.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



