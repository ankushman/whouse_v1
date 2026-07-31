import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#dc2626', '#991b1b', '#b91c1c', '#ef4444', '#f87171', '#7f1d1d', '#450a0a', '#fef2f2']
const PRODUCTS = ['Banjara Mirror Ludi Panel', 'Banjara Katori Shoulder Bag', 'Banjara Indigo Back Panel', 'Banjara Kotla Wallet Embroidery', 'Banjara Bakra Braid Trim', 'Banjara Tikki Pouch Necklace', 'Banjara Phool Karchob Border', 'Banjara Patti Ghagra Skirt Panel']
const ARTISANS = ['Wanaparthy Banjara Colony TG', 'Mahabubnagar Lambani Cluster TG', 'Nalgonda Tribal Embroidery TG', 'Khammam Banjara Art Society TG', 'Nizamabad Rural Craft TG', 'Adilabad Lambani Workshop TG', 'Warangal Heritage Cluster TG', 'Karimnagar Banjara Collective TG']
const STATUSES = ['GI Telangana Banjara Mark', 'Mirror Stitch Precision QC', 'Thread Colour Fastness Test', 'Pattern Geometric Symmetry', 'Fabric Tension Uniformity Check', 'Traditional Motif Fidelity Audit']

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
    id: `BEL-${String(offset + i + 1).padStart(4, '0')}`,
    artisan: ARTISANS[(offset + i) % ARTISANS.length], design: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 6, ((offset + i) * 19) % 6) + 1,
    cost: ri(3000, 120000, ((offset + i) * 11307) % 117000) + 3000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const banjararecords = [
  { id: 'BEL-0001', artisan: 'Wanaparthy Banjara Colony TG', design: 'Banjara Mirror Ludi Panel', status: 'GI Telangana Banjara Mark', qty: 3, cost: 95000, date: '2024-01-09' },
  { id: 'BEL-0002', artisan: 'Mahabubnagar Lambani Cluster TG', design: 'Banjara Katori Shoulder Bag', status: 'Mirror Stitch Precision QC', qty: 4, cost: 42000, date: '2024-01-22' },
  { id: 'BEL-0003', artisan: 'Nalgonda Tribal Embroidery TG', design: 'Banjara Indigo Back Panel', status: 'Thread Colour Fastness Test', qty: 2, cost: 110000, date: '2024-02-04' },
  { id: 'BEL-0004', artisan: 'Khammam Banjara Art Society TG', design: 'Banjara Kotla Wallet Embroidery', status: 'Pattern Geometric Symmetry', qty: 5, cost: 28000, date: '2024-02-17' },
  { id: 'BEL-0005', artisan: 'Nizamabad Rural Craft TG', design: 'Banjara Bakra Braid Trim', status: 'Fabric Tension Uniformity Check', qty: 3, cost: 85000, date: '2024-03-02' },
  { id: 'BEL-0006', artisan: 'Adilabad Lambani Workshop TG', design: 'Banjara Tikki Pouch Necklace', status: 'Traditional Motif Fidelity Audit', qty: 4, cost: 35000, date: '2024-03-15' },
  { id: 'BEL-0007', artisan: 'Warangal Heritage Cluster TG', design: 'Banjara Phool Karchob Border', status: 'GI Telangana Banjara Mark', qty: 2, cost: 120000, date: '2024-03-28' },
  { id: 'BEL-0008', artisan: 'Karimnagar Banjara Collective TG', design: 'Banjara Patti Ghagra Skirt Panel', status: 'Mirror Stitch Precision QC', qty: 6, cost: 18000, date: '2024-04-10' },
  { id: 'BEL-0009', artisan: 'Wanaparthy Banjara Colony TG', design: 'Banjara Mirror Ludi Panel', status: 'Thread Colour Fastness Test', qty: 3, cost: 78000, date: '2024-04-23' },
  { id: 'BEL-0010', artisan: 'Mahabubnagar Lambani Cluster TG', design: 'Banjara Katori Shoulder Bag', status: 'Pattern Geometric Symmetry', qty: 4, cost: 55000, date: '2024-05-06' },
  { id: 'BEL-0011', artisan: 'Nalgonda Tribal Embroidery TG', design: 'Banjara Indigo Back Panel', status: 'Fabric Tension Uniformity Check', qty: 2, cost: 105000, date: '2024-05-19' },
  { id: 'BEL-0012', artisan: 'Khammam Banjara Art Society TG', design: 'Banjara Kotla Wallet Embroidery', status: 'Traditional Motif Fidelity Audit', qty: 5, cost: 22000, date: '2024-06-01' },
  { id: 'BEL-0013', artisan: 'Nizamabad Rural Craft TG', design: 'Banjara Braid Braid Trim', status: 'GI Telangana Banjara Mark', qty: 3, cost: 90000, date: '2024-06-14' },
  { id: 'BEL-0014', artisan: 'Adilabad Lambani Workshop TG', design: 'Banjara Tikki Pouch Necklace', status: 'Mirror Stitch Precision QC', qty: 4, cost: 40000, date: '2024-06-27' },
  { id: 'BEL-0015', artisan: 'Warangal Heritage Cluster TG', design: 'Banjara Phool Karchob Border', status: 'Thread Colour Fastness Test', qty: 6, cost: 15000, date: '2024-07-10' },
  { id: 'BEL-0016', artisan: 'Karimnagar Banjara Collective TG', design: 'Banjara Patti Ghagra Skirt Panel', status: 'Pattern Geometric Symmetry', qty: 2, cost: 115000, date: '2024-07-23' },
  { id: 'BEL-0017', artisan: 'Wanaparthy Banjara Colony TG', design: 'Banjara Mirror Ludi Panel', status: 'Fabric Tension Uniformity Check', qty: 3, cost: 65000, date: '2024-08-05' },
  { id: 'BEL-0018', artisan: 'Mahabubnagar Lambani Cluster TG', design: 'Banjara Katori Shoulder Bag', status: 'Traditional Motif Fidelity Audit', qty: 4, cost: 48000, date: '2024-08-18' },
  { id: 'BEL-0019', artisan: 'Nalgonda Tribal Embroidery TG', design: 'Banjara Indigo Back Panel', status: 'GI Telangana Banjara Mark', qty: 5, cost: 10000, date: '2024-08-31' },
  { id: 'BEL-0020', artisan: 'Khammam Banjara Art Society TG', design: 'Banjara Kotla Wallet Embroidery', status: 'Mirror Stitch Precision QC', qty: 3, cost: 88000, date: '2024-09-13' },
]

export default function BanjaraEmbroideryTelanganaLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...banjararecords, ...genRecords(21), ...genRecords(41)]

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
    <div className="bel-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Banjara Art' }]} />
      <PageHeader title="Banjara Embroidery Telangana Logistics" description="Telangana Banjara Lambani mirror-work embroidery supply chain with GI Telangana Banjara Mark certification mirror stitch precision quality control thread colour fastness testing pattern geometric symmetry verification fabric tension uniformity testing and traditional motif fidelity audit across 8 Banjara Lambani embroidery clusters in Wanaparthy Mahabubnagar and Nalgonda" />
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
            <KpiTile label="Lambani Clusters" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={93} />
            <HealthRing label="Mirror" value={89} />
            <HealthRing label="Colour" value={91} />
            <HealthRing label="Pattern" value={88} />
            <HealthRing label="Tension" value={92} />
            <HealthRing label="Motif" value={87} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Lambani Families" value="15 Active" />
            <ValueTile label="Tradition" value="Since 400 BC" />
            <ValueTile label="Export Markets" value="7 Countries" />
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
            placeholder="Search Banjara art shipments..."
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
                    <td className="p-3">{record.qty} {['panels', 'bags', 'pouches', 'borders'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Banjara Embroidery Telangana — Ancient Lambani Nomadic Mirror-Work Tradition</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Banjara embroidery represents one of the most visually vibrant and culturally rich textile art traditions of the Indian subcontinent originating from the Banjara Lambani nomadic communities of Telangana and surrounding Deccan Plateau regions where the Lambani women have maintained this extraordinary mirror-work and counted-stitch embroidery tradition for over two thousand four hundred years since approximately four hundred before the common era making Banjara embroidery one of the oldest continuously practised textile art forms in South Asia where the term Banjara derives from the Sanskrit word vanijya meaning trade or commerce reflecting the historical role of the Banjara communities as itinerant traders and salt-carriers who transported goods across the vast Deccan plateau between the western coastal ports of Gujarat and the eastern Coromandel Coast ports of Andhra Pradesh and Tamil Nadu where the Banjara Lambani embroidery technique is distinguished by its extensive use of small circular shisha or abhala mirrors of two to eight millimetres diameter that are incorporated into the embroidery design at regular intervals creating a shimmering reflective surface that catches and scatters light producing the characteristic sparkling visual effect that is the signature quality of authentic Banjara Lambani textile art where the mirrors are secured to the fabric using a framework of interlocking counted-stitches including the herringbone stitch the buttonhole stitch and the chain stitch that form tight geometric frames around each mirror ensuring secure attachment while creating decorative pattern elements between the mirror positions where the traditional Banjara colour palette uses bold saturated colours including deep red from alizarin madder dye bright yellow from turmeric and marigold vibrant orange from kumkum and sindur preparations royal blue from indigo leaf dye and bright green from pomegranate rind and eucalyptus bark mixtures producing textiles of extraordinary visual intensity and chromatic richness that immediately distinguish Banjara embroidery from all other Indian textile embroidery traditions where the characteristic Banjara design vocabulary features bold geometric patterns including triangles diamonds zigzag borders lozenge chains and cross-hatched squares interspersed with stylized floral and animal motifs including the peacock the parrot the elephant and the sacred cow that reflect the nomadic pastoral lifestyle and the spiritual beliefs of the Lambani community where each Banjara textile piece typically requires one to three months of concentrated daily embroidery work by skilled Lambani women artisans producing an estimated thirty thousand to sixty thousand individual stitches and incorporating between two hundred and five hundred small mirrors per completed piece depending on the size and complexity of the design.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Mirror Stitch Precision QC and Thread Colour Fastness Standards</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The mirror stitch precision quality control and thread colour fastness testing protocols for Telangana Banjara embroidery establish the primary technical quality assurance framework for the traditional mirror-work embroidery process that ensures the mirror attachment accuracy and colour durability of authentic GI-certified Banjara Lambani textile products where the mirror stitch precision QC evaluates the accuracy and security of the interlocking stitch framework that secures each small circular mirror to the base fabric where the test measures the number of anchoring stitch points per mirror confirming each mirror is secured by a minimum of eight interlocking stitch points evenly distributed around the mirror circumference with consistent stitch tension within plus or minus twelve percent around each mirror ensuring the mirror sits flat against the fabric surface without any rocking movement or edge lifting that would indicate insufficient stitch anchoring where the mirror frame symmetry test evaluates the geometric regularity of the stitch framework surrounding each mirror confirming the stitch pattern forms a symmetrical geometric shape around the mirror centre with positional accuracy within plus or minus zero point three millimetres at each corner point of the frame where the mirror edge coverage test confirms that the stitch frame completely covers the mirror edge without any exposed mirror edge visible from the front surface ensuring the mirror appears to be set into the fabric rather than sitting on top of it where the thread colour fastness test evaluates the resistance of the embroidery thread colours to fading under exposure to light washing and perspiration using the standard ISO colour fastness testing methodology where test specimens are subjected to accelerated xenon-arc light exposure at seven hundred kilolux for seventy-two hours simulating approximately two years of normal indoor light exposure and the colour change is measured using spectrophotometric colour difference analysis confirming the colour difference delta E value remains below three point five for all primary Banjara thread colours including the characteristic red yellow blue and green threads where the wash fastness test subjects specimens to five standard wash cycles at forty degrees Celsius with a mild detergent solution and evaluates the colour transfer to adjacent white fabric squares and the colour change of the specimen itself confirming the staining rating is grade four or higher on the ISO grey scale for staining and the colour change rating is grade four or higher on the ISO grey scale for colour change ensuring the embroidery colours remain vibrant and distinguishable after repeated washing.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Pattern Geometric Symmetry and Fabric Tension Uniformity Verification</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The pattern geometric symmetry verification and fabric tension uniformity testing protocols ensure the visual quality and structural integrity of authentic Telangana Banjara Lambani embroidery pieces where the pattern geometric symmetry test evaluates the bilateral and rotational symmetry of the embroidered geometric patterns that are the defining visual characteristic of traditional Banjara embroidery where the characteristic Banjara geometric patterns include the triangle or singti motif the diamond or heera motif the zigzag or kikri border pattern the lozenge chain or makdi jala pattern and the cross-hatch or jali grid pattern each of which must demonstrate precise geometric symmetry to maintain the distinctive Banjara visual aesthetic where the test uses digital scanning at four hundred dots per inch followed by automated symmetry analysis confirming the geometric symmetry deviation is less than zero point four millimetres for any pair of corresponding pattern elements across the entire embroidered area where symmetry deviations exceeding this tolerance produce a visibly asymmetrical pattern that disrupts the characteristic rhythmic geometric quality of Banjara design and significantly reduces the artistic and commercial value of the piece where the inter-pattern spacing test measures the consistency of spacing between repeated geometric pattern elements confirming the spacing variation is within plus or minus six percent of the mean value across the full fabric surface ensuring the geometric patterns maintain a uniform visual density and regular rhythmic repetition without progressive spacing drift that would indicate counting fatigue or technique inconsistency by the embroiderer where the fabric tension uniformity test evaluates the consistency of the base fabric tension across the entire embroidery area where uneven fabric tension during the embroidery process causes pattern distortion visible as wavy or curved stitch lines that should be straight and regular geometric shapes that appear elongated or compressed in areas of varying fabric tension where the test measures the fabric thread density in both warp and weft directions at twenty-five measurement points distributed across the fabric surface confirming the thread density variation is within plus or minus four percent of the mean density value in both directions ensuring uniform fabric tension that supports precise stitch placement and consistent pattern geometry across the entire embroidery surface without tension-related pattern distortion.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Traditional Motif Fidelity Audit and Banjara Heritage Market Development</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The traditional motif fidelity audit and Banjara heritage market development framework provides the artistic quality assurance and commercial market infrastructure for the Telangana Banjara Lambani embroidery supply chain ensuring that all GI-certified Banjara products demonstrate the authentic traditional motif vocabulary and cultural design integrity that defines the two-thousand-four-hundred-year-old Lambani nomadic mirror-work embroidery tradition while connecting the active Banjara Lambani embroiderer communities across Wanaparthy Mahabubnagar Nalgonda Khammam Nizamabad Adilabad Warangal and Karimnagar with growing institutional and international collector market demand for authentic Telangana Banjara mirror-work textiles where the traditional motif fidelity audit evaluates the presence and accuracy of the characteristic Banjara design vocabulary elements that distinguish authentic Lambani Banjara embroidery from non-traditional reproductions and factory-made mirror-work imitations including the singti triangle motif in its three traditional size variants the heera diamond chain pattern the katori or bowl motif the phool or stylized floral motif the makhi or fly pattern and the characteristic Banjara border compositions featuring interlocking geometric mirror-and-stitch bands that frame the central field design where the motif execution test verifies the precision and clarity of each geometric pattern element confirming the counted-stitch embroidery produces clean sharp pattern edges with consistent stitch directionality without the irregular stitch direction changes that indicate counting errors or inconsistent technique where the traditional mirror density test confirms the mirror coverage density meets the minimum standard of fifteen mirrors per square decimetre for the main field embroidery and twenty mirrors per square decimetre for border patterns without mirror clustering or sparse areas that would indicate non-traditional design adaptation where the traditional Banjara colour palette test confirms the exclusive use of the authentic five-colour Banjara palette of deep alizarin red turmeric yellow indigo blue pomegranate green and kumkum orange without any synthetic or pastel colour additions that would compromise the heritage authenticity of the GI-certified Banjara product where the Banjara heritage market development initiative led by the Telangana State Handloom and Textiles Department in collaboration with the National Handloom Development Corporation the Telangana Tribal Welfare Department and the Lambani Banjara Artisans Cooperative Society has established institutional patronage and exhibition programmes connecting the active Lambani embroiderer communities with the Telangana State Emporium and international cultural exhibitions with projected annual revenue growth of thirty-two percent.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



