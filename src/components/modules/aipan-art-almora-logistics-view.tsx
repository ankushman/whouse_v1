import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#991b1b', '#7f1d1d', '#450a0a', '#2a0404', '#b91c1c', '#dc2626', '#ef4444', '#fef2f2']
const PRODUCTS = ['Aipan Swastik Threshold Art', 'Aipan Lakshmi Feet Door Panel', 'Aipan Marriage Vivah Board', 'Aipan Floral Wall Frame', 'Aipan Peacock Motif Haldi Platter', 'Aipan Geometric Floor Stencil', 'Aipan Sun God Surya Panel', 'Aipan Kalash Ceremonial Art']
const ARTISANS = ['Almora Aipan Artisan Guild', 'Kumaon Floor Art Society', 'Nainital Traditional Aipan Centre', 'Ranikhet Aipan Heritage Studio', 'Bageshwar Aipan Women Collective', 'Pithoragarh Kumaoni Art Group', 'Champawat Aipan Cooperative', 'Udham Singh Nagar Aipan Society']
const STATUSES = ['GI Uttarakhand Aipan Mark', 'IS 16791 Aipan Art Grade A', 'Foam Board Flat Pack', 'Enclosed Truck Transit', 'Dry Storage 15-25C', 'Rice Paste Purity QC']

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
  <Card className="p-4 border-l-4" style={{ borderLeftColor: COLORS[1] }}><p className="text-sm text-muted-foreground">{label}</p><p className="text-lg font-semibold mt-1" style={{ color: COLORS[1] }}>{value}</p></Card>
)

const genRecords = (offset: number) =>
  Array.from({ length: 20 }, (_, i) => ({
    id: `AIP-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 28, ((offset + i) * 27) % 28) + 1,
    cost: ri(6000, 92000, ((offset + i) * 13107) % 86000) + 6000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const aipanRecords = [
  { id: 'AIP-0001', painter: 'Almora Aipan Artisan Guild', ware: 'Aipan Swastik Threshold Art', status: 'GI Uttarakhand Aipan Mark', qty: 3, cost: 78000, date: '2024-01-12' },
  { id: 'AIP-0002', painter: 'Kumaon Floor Art Society', ware: 'Aipan Lakshmi Feet Door Panel', status: 'IS 16791 Aipan Art Grade A', qty: 5, cost: 52000, date: '2024-01-25' },
  { id: 'AIP-0003', painter: 'Nainital Traditional Aipan Centre', ware: 'Aipan Marriage Vivah Board', status: 'Foam Board Flat Pack', qty: 2, cost: 88000, date: '2024-02-08' },
  { id: 'AIP-0004', painter: 'Ranikhet Aipan Heritage Studio', ware: 'Aipan Floral Wall Frame', status: 'Enclosed Truck Transit', qty: 6, cost: 34000, date: '2024-02-20' },
  { id: 'AIP-0005', painter: 'Bageshwar Aipan Women Collective', ware: 'Aipan Peacock Motif Haldi Platter', status: 'Dry Storage 15-25C', qty: 8, cost: 22000, date: '2024-03-05' },
  { id: 'AIP-0006', painter: 'Pithoragarh Kumaoni Art Group', ware: 'Aipan Geometric Floor Stencil', status: 'Rice Paste Purity QC', qty: 4, cost: 62000, date: '2024-03-18' },
  { id: 'AIP-0007', painter: 'Champawat Aipan Cooperative', ware: 'Aipan Sun God Surya Panel', status: 'GI Uttarakhand Aipan Mark', qty: 3, cost: 85000, date: '2024-03-30' },
  { id: 'AIP-0008', painter: 'Udham Singh Nagar Aipan Society', ware: 'Aipan Kalash Ceremonial Art', status: 'IS 16791 Aipan Art Grade A', qty: 5, cost: 48000, date: '2024-04-12' },
  { id: 'AIP-0009', painter: 'Almora Aipan Artisan Guild', ware: 'Aipan Lakshmi Feet Door Panel', status: 'Foam Board Flat Pack', qty: 4, cost: 56000, date: '2024-04-24' },
  { id: 'AIP-0010', painter: 'Kumaon Floor Art Society', ware: 'Aipan Swastik Threshold Art', status: 'Enclosed Truck Transit', qty: 3, cost: 72000, date: '2024-05-06' },
  { id: 'AIP-0011', painter: 'Nainital Traditional Aipan Centre', ware: 'Aipan Marriage Vivah Board', status: 'Dry Storage 15-25C', qty: 6, cost: 38000, date: '2024-05-18' },
  { id: 'AIP-0012', painter: 'Ranikhet Aipan Heritage Studio', ware: 'Aipan Floral Wall Frame', status: 'Rice Paste Purity QC', qty: 2, cost: 90000, date: '2024-05-30' },
  { id: 'AIP-0013', painter: 'Bageshwar Aipan Women Collective', ware: 'Aipan Peacock Motif Haldi Platter', status: 'GI Uttarakhand Aipan Mark', qty: 7, cost: 26000, date: '2024-06-12' },
  { id: 'AIP-0014', painter: 'Pithoragarh Kumaoni Art Group', ware: 'Aipan Geometric Floor Stencil', status: 'IS 16791 Aipan Art Grade A', qty: 4, cost: 58000, date: '2024-06-24' },
  { id: 'AIP-0015', painter: 'Champawat Aipan Cooperative', ware: 'Aipan Sun God Surya Panel', status: 'Foam Board Flat Pack', qty: 3, cost: 82000, date: '2024-07-06' },
  { id: 'AIP-0016', painter: 'Udham Singh Nagar Aipan Society', ware: 'Aipan Kalash Ceremonial Art', status: 'Enclosed Truck Transit', qty: 5, cost: 44000, date: '2024-07-18' },
  { id: 'AIP-0017', painter: 'Almora Aipan Artisan Guild', ware: 'Aipan Geometric Floor Stencil', status: 'Dry Storage 15-25C', qty: 4, cost: 68000, date: '2024-07-30' },
  { id: 'AIP-0018', painter: 'Kumaon Floor Art Society', ware: 'Aipan Swastik Threshold Art', status: 'Rice Paste Purity QC', qty: 3, cost: 76000, date: '2024-08-10' },
  { id: 'AIP-0019', painter: 'Nainital Traditional Aipan Centre', ware: 'Aipan Marriage Vivah Board', status: 'GI Uttarakhand Aipan Mark', qty: 6, cost: 42000, date: '2024-08-22' },
  { id: 'AIP-0020', painter: 'Ranikhet Aipan Heritage Studio', ware: 'Aipan Floral Wall Frame', status: 'IS 16791 Aipan Art Grade A', qty: 2, cost: 92000, date: '2024-09-03' },
]

export default function AipanArtAlmoraLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...aipanRecords, ...genRecords(21), ...genRecords(41)]


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
    <div className="aip-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Aipan Art Almora' }]} />
      <PageHeader title="Aipan Art Almora Logistics" description="Uttarakhand Aipan rice paste floor and wall art supply chain with IS 16791 certification, rice paste purity QC, foam board flat packaging, and GI Uttarakhand Aipan Mark across 8 heritage artisan communities in Almora, Nainital, Ranikhet, and Kumaon" />
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
            <KpiTile label="Active Ware" value={PRODUCTS.length} />
            <KpiTile label="Aipan Clusters" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={93} />
            <HealthRing label="IS 16791" value={89} />
            <HealthRing label="Foam" value={85} />
            <HealthRing label="Truck" value={81} />
            <HealthRing label="Dry" value={87} />
            <HealthRing label="Paste QC" value={91} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="30+" />
            <ValueTile label="Tradition" value="Since 8th C" />
            <ValueTile label="Export Markets" value="4 Countries" />
            <ValueTile label="Annual Revenue" value="₹1.5 Crore" />
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
            placeholder="Search Aipan art shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-red-100">
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
                  <tr key={record.id} className="border-t hover:bg-red-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.ware} /></td>
                    <td className="p-3">{record.painter}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['pcs', 'sets', 'units', 'panels'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Aipan Art — 1200-Year Kumaon Geometric Threshold Tradition</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Aipan is one of the most geometrically precise and ritually significant visual art traditions practised continuously across the Kumaon region of Uttarakhand in the Indian Himalayas for over twelve centuries, representing a sacred domestic and ceremonial art form where women of Kumaoni Brahmin and Rajput households create intricate geometric and figurative designs using a white rice paste mixture applied onto a red ochre ground surface prepared from naturally occurring geru clay mixed with water and applied to the walls, floors, thresholds, and ceremonial surfaces of traditional Kumaoni homes, temples, and community gathering spaces throughout the Almora, Nainital, Pithoragarh, Bageshwar, Champawat, and Udham Singh Nagar districts of the Kumaon division where the Aipan tradition serves as the primary visual marker of Kumaoni cultural identity and feminine artistic expression. The Aipan art vocabulary encompasses hundreds of documented base patterns classified into the major typologies including the Swastik Aipan where the sacred swastika motif is rendered in white rice paste lines on the geru red ground as a threshold blessing at the main entrance of Kumaoni homes during festival occasions including Diwali, Holi, Makar Sankranti, and the traditional Kumaoni festival of Harela celebrating the agricultural cycle where fresh Aipan designs are created at every threshold and ceremonial surface of the household as offerings to the household deities and guardian spirits presiding over the domestic prosperity and familial well-being of the Kumaoni household in accordance with the prescriptive traditions of the Kumaoni ritual practice codified in the local oral traditions transmitted matrilineally from mother to daughter across generations of Kumaoni women who maintain the Aipan drawing practice as a daily and seasonal domestic ritual obligation that defines the cultural rhythm of Kumaoni household life across the six districts of the Kumaon division where the tradition continues to thrive despite the modernisation pressures that have diminished many other Indian domestic art traditions in the post-industrial era. The Lakshmi Padya Aipan is the most ritually significant pattern variant where the footprints of the goddess Lakshmi are drawn in rice paste on the threshold entrance during Diwali celebrations inviting the goddess of prosperity and abundance to enter the household and bestow her blessings upon the family members for the coming year, while the Vivah Aipan or marriage Aipan represents the most elaborate form of the art where entire walls and ceremonial spaces are covered with complex interconnected geometric patterns celebrating the union of the bride and groom during the multi-day Kumaoni wedding ceremony that follows the traditional Kumaoni marriage customs where the Aipan designs serve both as decorative embellishment and as ritual mediators connecting the ceremonial participants with the divine presences invoked during the wedding rituals performed according to the Kumaoni Pandit tradition that governs the liturgical and ceremonial aspects of Hindu ritual practice throughout the Kumaon region of Uttarakhand where the Aipan art tradition has been recognised by the Government of India with the Geographical Indication tag confirming the distinctive Kumaoni origin and cultural significance of this extraordinary geometric art form that represents one of the most technically demanding and ritually important domestic art traditions in the Indian Himalayan cultural landscape.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16791 Aipan Art Standards & Rice Paste Purity QC</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The IS 16791 standard for Aipan art establishes India's first dedicated quality certification framework for the Uttarakhand Kumaon Aipan geometric floor and wall art tradition, specifying comprehensive requirements for rice paste raw material quality, geru red ochre ground composition, line precision and symmetry parameters, colour contrast ratio between white paste and red ground, dimensional accuracy for transfer stencil products, and overall Aipan product durability standards that collectively distinguish authentic Aipan art materials and finished products created by traditional Kumaoni Aipan artisan communities from the growing volume of machine-printed Aipan design imitations and synthetic powder substitutes that have increasingly appeared in both the domestic Uttarakhand handicraft market and national retail platforms serving the growing demand for Kumaoni cultural products among tourists visiting the popular hill station destinations of Nainital, Almora, Ranikhet, and Kausani in the Kumaon region where Aipan art represents the most sought-after authentic cultural souvenir product. The rice paste raw material requirements for IS 16791 Grade A certification mandate exclusively hand-ground fine rice flour derived from traditional Himalayan paddy rice varieties cultivated in the Tarai and Bhabhar belt of Uttarakhand with minimum amylose content of 20% ensuring the rice paste produces the characteristic smooth-flowing white line quality when applied through the traditional fingernail technique where the Aipan artist uses the thumbnail edge to draw continuous fine lines of rice paste onto the geru red ground surface tracing the intricate geometric patterns from memory without reference to any printed or digital template in the traditional domestic Aipan practice. The particle size requirements for Grade A certification mandate minimum 90% of the rice flour particles pass through a 200-micron mesh sieve verified through laser diffraction particle size analysis ensuring the flour produces a smooth homogeneous paste when mixed with water at the traditional ratio of one part rice flour to two parts water producing a paste viscosity between 800 and 1200 centipoise measured by Brookfield viscometer at 25 degrees Celsius that produces the ideal line consistency for the fingernail application technique where the paste must flow smoothly from the fingertip without dripping, clotting, or producing irregular line widths that would compromise the geometric precision and visual quality of the finished Aipan design where line width consistency within plus or minus 0.3 millimetres across the full design is considered the minimum acceptable quality threshold for authenticated Aipan products produced under the IS 16791 certification framework. The geru red ochre ground material requirements for Grade A certification mandate exclusively naturally occurring red ochre clay sourced from the Kumaon Himalayan geological formations with minimum iron oxide content of 65% verified through X-ray fluorescence spectroscopy ensuring the distinctive deep red colour tone that provides the characteristic high-contrast background against the white rice paste Aipan designs where the minimum colour contrast ratio between the white rice paste lines and the red geru ground must exceed 7:1 measured by spectrophotometric analysis under standardised D65 daylight illumination conditions ensuring the Aipan design maintains the striking visual contrast that defines the Kumaoni Aipan aesthetic and distinguishes authentic handcrafted Aipan from machine-printed reproductions where the synthetic red printing ink backgrounds typically produce lower contrast ratios and lack the characteristic matte texture of natural geru clay that contributes to the authentic visual quality of handcrafted Aipan products.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Foam Board Flat Packaging for Aipan Art Panels Transit</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Foam board flat packaging with rigid backing support has been specifically developed for the Aipan art logistics supply chain to protect the delicate rice paste surfaces, geru clay ground layers, and geometric line precision that characterise authentic Aipan art products from the physical and environmental hazards encountered during transit from the Kumaoni artisan production centres in the Almora, Nainital, Ranikhet, and Bageshwar districts to domestic distribution points across Uttarakhand, the broader Indian market, and international destinations serving the global demand for Indian geometric art products. The packaging specification utilises 5-millimetre rigid polystyrene foam board with smooth white surface finish providing structural rigidity and surface protection for the Aipan panel where the foam board backing prevents flexural deformation that could crack the dried rice paste lines and geru clay ground layer during the vibration and impact forces encountered during road transport along the mountainous road networks connecting the Kumaon production centres to the plains distribution hubs of Haldwani and subsequently to the major urban markets of Delhi, Mumbai, and Bengaluru through the national highway network. Each Aipan art panel is inspected under standardised D65 daylight illumination verifying rice paste line precision within the IS 16791 Grade A symmetry tolerance parameters where the bilateral and rotational symmetry of the geometric design is measured through digital image analysis confirming maximum asymmetry deviation below 2% of the total design dimensions, rice paste line continuity verifying absence of breaks, gaps, or discontinuities in the white paste lines that would indicate quality defects requiring rejection before the inspected panel proceeds to the packaging stage. The inspected Aipan panel is placed face-up on a sheet of acid-free tissue paper and then mounted onto the rigid polystyrene foam board backing using archival-quality adhesive tape securing the panel edges without contact with the front surface, then wrapped in a clear polyethylene protective sleeve providing moisture barrier protection against the high-humidity conditions encountered during the monsoon season transit and the variable humidity conditions of the Himalayan foothills transport corridor where ambient humidity regularly exceeds 80% relative humidity during the July-September monsoon period creating condensation risk conditions that could cause rice paste line swelling, geru ground softening, or fungal growth on inadequately protected Aipan panels during the multi-day transit from the Kumaon hill districts to the plains distribution centres. The foam board mounted and sleeved Aipan panel is then placed within a rigid outer shipping container constructed from 5-millimetre double-wall corrugated fibreboard with desiccant silica gel sachets providing supplementary moisture protection during the transit and storage cycle ensuring the Aipan panel arrives at the destination in the same pristine condition as at the point of artisan production where the geometric precision, colour contrast, and surface quality of the finished Aipan design represents the culmination of hours of meticulous hand-drawing work by the traditional Kumaoni Aipan artist whose skill and devotion to the geometric art tradition produces these extraordinary decorative objects that carry the sacred visual vocabulary of twelve centuries of Kumaoni cultural heritage.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Symmetry Verification & Aipan Heritage Market Development</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and computational geometry analysis technologies are being progressively deployed to authenticate Aipan art products and verify the distinctive geometric pattern characteristics, rice paste line properties, and symmetry parameters that distinguish genuine handcrafted Aipan art created by traditional Kumaoni artisan communities from the growing volume of machine-printed reproductions, digital print transfers, and synthetic powder imitations that have increasingly appeared in both the Uttarakhand tourist retail market and national online platforms serving the growing demand for Kumaoni cultural art products where consumers seeking authentic Aipan face growing difficulty distinguishing handcrafted rice paste Aipan from the increasingly sophisticated machine-printed imitations that replicate the visual appearance of Aipan at casual inspection but lack the distinctive material and geometric properties of genuine handcrafted products. The AI authentication system for Aipan art employs high-resolution digital image capture at 600 dots per inch combined with multispectral imaging across the visible and near-infrared spectrum from 400 to 1000 nanometres wavelength range to capture the complete surface morphology and material composition characteristics of finished Aipan panels, analysing the rice paste line texture characteristics where hand-applied rice paste using the traditional fingernail technique produces distinctive micro-texture patterns including the characteristic thumbnail edge width variations of plus or minus 0.2 millimetres reflecting the artisan's individual hand pressure and finger angle that cannot be replicated by the uniform line width of digital printing or stencil-based reproduction techniques, the rice paste-geru interface characteristics where hand-applied paste produces a distinctive micro-penetration zone at the paste-ground interface where the liquid rice paste partially absorbs into the porous geru clay surface creating a gradual edge transition that differs from the sharp edge boundary of printed lines where the ink sits on the surface without absorption, and the overall geometric symmetry analysis using the full bilateral, rotational, and translational symmetry group classification of the Aipan pattern where the AI system measures the deviation from perfect symmetry across all symmetry axes and quantifies the characteristic minor asymmetries of hand-drawn geometric patterns that distinguish authentic Aipan from the mathematically perfect symmetries of digitally generated reproductions where the computer-generated patterns produce zero asymmetry deviation that is itself an indicator of non-authentic production. The AI-powered Aipan market development platform connects traditional Kumaoni Aipan artisan cooperatives in the Almora, Nainital, Ranikhet, and Bageshwar districts directly with institutional buyers including the Uttarakhand Handloom and Handicraft Development Board, state government emporiums, museum gift shops at the Kumaon Museum in Almora and the Uttarakhand Cultural Centre in Dehradun, national-level handicraft emporium chains, and international cultural art importers serving the growing global demand for authenticated Indian geometric art products where the GI Uttarakhand Aipan Mark and IS 16791 certification collectively provide the quality assurance framework needed to establish premium market positioning for authentic Kumaoni Aipan products in both domestic and international markets.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

