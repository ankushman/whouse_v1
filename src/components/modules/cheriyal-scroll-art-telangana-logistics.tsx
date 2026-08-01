import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#78350f', '#92400e', '#a16207', '#ca8a04', '#facc15', '#451a03', '#365314', '#fefce8']
const PRODUCTS = ['Cheriyal Puranic Scroll', 'Narasimha Avatar Scroll', 'Ramayana Story Panel', 'Markandeya Legend Scroll', 'Shiva Tandava Narrative', 'Goddess Durga Battle Scroll', 'Krishna Gopashtami Scroll', 'Cheriyal Masks Set']
const PAINTERS = ['Cheriyal Nakashi Guild', 'Jangaon Scroll Art Society', 'Warangal Heritage Painters', 'Siddipet Nakashi Colony', 'Yadadri Cheriyal Workshop', 'Karimnagar Folk Art Centre', 'Nalgonda Scroll Collective', 'Medak Cheriyal Heritage Studio']
const STATUSES = ['GI Cheriyal Scroll Art Mark', 'IS 16911 Nakashi Art Grade A', 'Cloth-Rolled Scroll Tube', 'Flatbed Truck Transit', 'Dry Storage 18-28C', 'Natural Dye Fastness QC']

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
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fefce8" strokeWidth="6" />
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
    id: `CSA-${String(offset + i + 1).padStart(4, '0')}`,
    painter: PAINTERS[(offset + i) % PAINTERS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 150, ((offset + i) * 37) % 150) + 1,
    cost: ri(2000, 50000, ((offset + i) * 13097) % 48000) + 2000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const cheriyalRecords = [
  { id: 'CSA-0001', painter: 'Cheriyal Nakashi Guild', ware: 'Cheriyal Puranic Scroll', status: 'GI Cheriyal Scroll Art Mark', qty: 15, cost: 28000, date: '2024-01-15' },
  { id: 'CSA-0002', painter: 'Jangaon Scroll Art Society', ware: 'Narasimha Avatar Scroll', status: 'IS 16911 Nakashi Art Grade A', qty: 10, cost: 42000, date: '2024-01-22' },
  { id: 'CSA-0003', painter: 'Warangal Heritage Painters', ware: 'Ramayana Story Panel', status: 'Cloth-Rolled Scroll Tube', qty: 25, cost: 18000, date: '2024-02-03' },
  { id: 'CSA-0004', painter: 'Siddipet Nakashi Colony', ware: 'Markandeya Legend Scroll', status: 'Flatbed Truck Transit', qty: 12, cost: 35000, date: '2024-02-14' },
  { id: 'CSA-0005', painter: 'Yadadri Cheriyal Workshop', ware: 'Shiva Tandava Narrative', status: 'Dry Storage 18-28C', qty: 18, cost: 32000, date: '2024-02-28' },
  { id: 'CSA-0006', painter: 'Karimnagar Folk Art Centre', ware: 'Goddess Durga Battle Scroll', qty: 40, cost: 5200, date: '2024-03-05', status: 'Natural Dye Fastness QC' },
  { id: 'CSA-0007', painter: 'Nalgonda Scroll Collective', ware: 'Krishna Gopashtami Scroll', status: 'GI Cheriyal Scroll Art Mark', qty: 14, cost: 38000, date: '2024-03-18' },
  { id: 'CSA-0008', painter: 'Medak Cheriyal Heritage Studio', ware: 'Cheriyal Masks Set', status: 'IS 16911 Nakashi Art Grade A', qty: 30, cost: 8500, date: '2024-03-25' },
  { id: 'CSA-0009', painter: 'Jangaon Scroll Art Society', ware: 'Cheriyal Puranic Scroll', status: 'Cloth-Rolled Scroll Tube', qty: 20, cost: 25000, date: '2024-04-02' },
  { id: 'CSA-0010', painter: 'Warangal Heritage Painters', ware: 'Narasimha Avatar Scroll', status: 'Flatbed Truck Transit', qty: 8, cost: 45000, date: '2024-04-10' },
  { id: 'CSA-0011', painter: 'Siddipet Nakashi Colony', ware: 'Ramayana Story Panel', status: 'Dry Storage 18-28C', qty: 28, cost: 15000, date: '2024-04-22' },
  { id: 'CSA-0012', painter: 'Yadadri Cheriyal Workshop', ware: 'Markandeya Legend Scroll', status: 'Natural Dye Fastness QC', qty: 16, cost: 33000, date: '2024-05-01' },
  { id: 'CSA-0013', painter: 'Karimnagar Folk Art Centre', ware: 'Shiva Tandava Narrative', status: 'GI Cheriyal Scroll Art Mark', qty: 22, cost: 22000, date: '2024-05-15' },
  { id: 'CSA-0014', painter: 'Nalgonda Scroll Collective', ware: 'Goddess Durga Battle Scroll', status: 'IS 16911 Nakashi Art Grade A', qty: 35, cost: 6800, date: '2024-05-28' },
  { id: 'CSA-0015', painter: 'Medak Cheriyal Heritage Studio', ware: 'Krishna Gopashtami Scroll', status: 'Cloth-Rolled Scroll Tube', qty: 11, cost: 40000, date: '2024-06-05' },
  { id: 'CSA-0016', painter: 'Cheriyal Nakashi Guild', ware: 'Cheriyal Masks Set', status: 'Flatbed Truck Transit', qty: 45, cost: 7200, date: '2024-06-18' },
  { id: 'CSA-0017', painter: 'Nalgonda Scroll Collective', ware: 'Cheriyal Puranic Scroll', status: 'Dry Storage 18-28C', qty: 17, cost: 26000, date: '2024-06-25' },
  { id: 'CSA-0018', painter: 'Medak Cheriyal Heritage Studio', ware: 'Narasimha Avatar Scroll', status: 'Natural Dye Fastness QC', qty: 9, cost: 48000, date: '2024-07-03' },
  { id: 'CSA-0019', painter: 'Karimnagar Folk Art Centre', ware: 'Ramayana Story Panel', status: 'GI Cheriyal Scroll Art Mark', qty: 32, cost: 14000, date: '2024-07-12' },
  { id: 'CSA-0020', painter: 'Cheriyal Nakashi Guild', ware: 'Markandeya Legend Scroll', status: 'IS 16911 Nakashi Art Grade A', qty: 13, cost: 36000, date: '2024-07-20' },
]

export default function CheriyalScrollArtTelanganaLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...cheriyalRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'painter', label: 'Painter', options: PAINTERS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.painter === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(20, 80, allRecords.length * 0.3 + i * 12) }))
  const painterChart = PAINTERS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.painter === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="csa-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Cheriyal Scroll Art' }]} />
      <PageHeader title="Cheriyal Scroll Art Telangana Logistics" description="Telangana Cheriyal Nakashi scroll painting supply chain with IS 16911 certification, cloth-rolled scroll tube packaging, natural dye fastness QC, and GI Cheriyal Scroll Art Mark for traditional narrative scroll storytelling art across 8 Nakashi painter communities in Telangana" />
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
            <KpiTile label="Active Ware" value={PRODUCTS.length} />
            <KpiTile label="Painter Clusters" value={PAINTERS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={91} />
            <HealthRing label="IS 16911" value={87} />
            <HealthRing label="Cloth" value={83} />
            <HealthRing label="Truck" value={80} />
            <HealthRing label="Storage" value={86} />
            <HealthRing label="Dye" value={92} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Nakashi Families" value="200+" />
            <ValueTile label="Cheriyal Village" value="Since 12th C" />
            <ValueTile label="Export Markets" value="10 Countries" />
            <ValueTile label="Scroll Length" value="3-60 Feet" />
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
            placeholder="Search Cheriyal scroll art shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-yellow-100">
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
                  <tr key={record.id} className="border-t hover:bg-yellow-50/50">
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
              <CardHeader><CardTitle>Cheriyal Nakashi Scroll — 800-Year Telangana Narrative Art</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Cheriyal scroll painting is one of the oldest and most endangered narrative art forms of India, originating from Cheriyal village in the Jangaon district of Telangana with a continuous tradition spanning over 800 years to the Kakatiya era of the 12th century. The Nakashi community of scroll painters traditionally created elaborate narrative scrolls ranging from 3 to 60 feet in length, which were used by itinerant storytellers known as picchugundlu or perini performers who would travel from village to village unrolling their scrolls while narrating epic tales from Hindu mythology, local folk legends, and the Puranas. Each scroll depicted a complete narrative cycle with up to 50 individual panels arranged in sequential order, using bold outlines filled with vibrant natural vegetable and mineral-derived colours including deep reds from tamarind seed, bright yellows from turmeric and myrobalan, rich blues from indigo, and striking whites from sea shell powder. The Cheriyal art style is characterised by its distinctive two-dimensional profile representations of human figures with large expressive eyes, ornate headdresses, and elaborate jewellery, set against flat backgrounds with decorative floral borders framing each narrative panel. Today fewer than 200 Nakashi painter families remain active across Telangana, with Cheriyal village serving as the last major concentration of this art form, making Cheriyal scroll painting one of India's most critically endangered intangible cultural heritage traditions requiring urgent preservation and economic sustainability interventions.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16911 Nakashi Art Quality Standards for Cheriyal Scroll Certification</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">The IS 16911 standard for Nakashi scroll art products establishes a dedicated quality certification framework specifically designed to preserve the authenticity and material integrity of Cheriyal scroll painting as one of India's most endangered narrative art traditions. The standard mandates strict requirements for the traditional khadi cotton canvas substrate, specifying minimum 180 GSM hand-woven unbleached khadi cotton treated with the traditional tamarind seed paste primer known as gesso, which creates the characteristic smooth white painting surface essential for the fine brushwork and bold colour application that defines Cheriyal style. Natural dye requirements mandate the exclusive use of traditional vegetable and mineral-based colourants including tamarind-derived reds, turmeric-yellows, indigo-blues, charcoal-blacks, and sea-shell whites, with synthetic pigments permitted only for touch-up restoration work on antique pieces under certified conservation supervision. IS 16911 Grade A certification requires natural dye fastness ratings of minimum 4 on the ISO 105-C06 wash fastness scale and minimum 5 on the ISO 105-B02 light fastness scale, ensuring the scroll colours maintain their vibrancy through decades of display, rolling, and storage cycles. Canvas weave integrity testing demands the khadi substrate withstand minimum 500 rolling and unrolling cycles without visible fibre degradation, cracking of the primer layer, or separation of painted colour from the surface, simulating the operational stress that traditional storytelling performers subjected these scrolls to during centuries of itinerant narrative performances across Telangana villages.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Cloth-Rolled Scroll Tube Packaging for Cheriyal Art Transit</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Cloth-rolled scroll tube packaging has been specifically designed for Cheriyal Nakashi scroll paintings to protect the delicate khadi cotton canvas substrate, traditional natural dye pigments, and hand-applied gesso primer from the physical and environmental hazards of transit from Cheriyal village to urban galleries and museum collections across India and international destinations. Each Cheriyal scroll is first carefully rolled around a custom-diameter lightweight cardboard tube core, with the painted surface facing outward to prevent compression creasing of the gesso primer layer that could cause cracking of the natural pigments. The rolled scroll is then wrapped in unbleached muslin cloth treated with natural neem oil to provide insect and fungal repellent protection during the monsoon season when humidity levels in Telangana regularly exceed 80%, creating conditions that promote fungal growth on the organic canvas substrate. The muslin-wrapped scroll is inserted into a rigid PVC mailing tube with custom foam end caps providing shock absorption and moisture barrier protection during the multi-stage journey from Cheriyal village workshops through Hyderabad distribution hubs to final destination galleries and museums. For scrolls exceeding 10 feet in length, segmented packaging with multiple interconnected tubes allows flexible transit while maintaining continuous protection along the entire scroll length, with each segment joined by specially designed watertight connector rings that maintain the internal microclimate. The packaging system has reduced transit damage rates for Cheriyal scrolls from a historically unacceptable 18% to under 3% since its introduction, with the dramatic improvement attributed to the elimination of sharp fold creases and compression points that previously damaged the fragile gesso primer layer during conventional flat packaging methods.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Natural Dye Authentication & Cheriyal Art Heritage Preservation</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and non-invasive spectroscopic analysis technologies are playing an increasingly critical role in preserving and authenticating Cheriyal Nakashi scroll art, where verifying the use of traditional natural dyes versus modern synthetic substitutes has become essential for maintaining the art form's GI certification integrity and cultural heritage value. The AI authentication system employs portable X-ray fluorescence spectroscopy and multispectral imaging to analyse the chemical composition of colour pigments directly on the scroll surface without requiring any destructive sampling that could damage the delicate khadi canvas or painted surface. Machine learning models trained on spectral data from over 500 authenticated Cheriyal scrolls can identify the specific mineral and vegetable sources of traditional pigments with 96.4% accuracy, detecting synthetic substitutes such as azo dyes, phthalocyanine blues, or titanium dioxide whites that compromise the traditional character and GI certification eligibility of the artwork. The system also analyses brush stroke patterns, figure proportions, and compositional structures characteristic of the Nakashi painting style to verify artistic authenticity and attribute works to specific painter families or individual master artisans based on documented style variations across the approximately 200 active Nakashi painter families. The Telangana Department of Language and Culture has deployed this AI authentication at state museum conservation laboratories, creating a comprehensive digital archive of authenticated Cheriyal scrolls with complete provenance documentation, high-resolution multispectral images, and chemical composition profiles that serve both as a reference database for future authentication and as a permanent record of this endangered art form for cultural heritage researchers and future generations.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
