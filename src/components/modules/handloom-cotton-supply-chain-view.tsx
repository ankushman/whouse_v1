import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#1e40af', '#3b5fc0', '#587ed1', '#759de2', '#92bcf3', '#152d7a', '#0f1f5a', '#bfdbfe']
const PRODUCTS = ['Handloom Cotton Khadi Fabric', 'Handloom Muslin Dhoti', 'Handloom Cotton Bed Sheet', 'Handloom Linen Salwar Suit', 'Handloom Cotton Table Runner', 'Handloom Ikat Stole', 'Handloom Jamdani Saree', 'Handloom Cotton Napkin Set']
const ARTISANS = ['Varanasi Handloom Weavers UP', 'Pochampally Ikat Society Telangana', 'Sualkuchi Silk Cluster Assam', 'Chanderi Weavers MP', 'Kanchipuram Cotton Guild TN', 'Phulia Handloom Society Odisha', 'Kotpad Tribal Weavers Odisha', 'Bhagalpur Tussar Cluster Bihar']
const STATUSES = ['GI Handloom Mark Certified', 'IS 16784 Handloom Grade A', 'Neem-treated Storage Pack', 'Palletised Truck Transit', 'Climate Controlled 22-28C', 'Cotton Count Tensile QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-blue-200 rounded-full overflow-hidden"><div className="h-full bg-blue-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fae8ff" strokeWidth="6" />
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
    id: `HCL-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 20, ((offset + i) * 19) % 20) + 1,
    cost: ri(4000, 52000, ((offset + i) * 10707) % 48000) + 4000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const handloomRecords = [
  { id: 'HCL-0001', painter: 'Varanasi Handloom Weavers UP', ware: 'Handloom Cotton Khadi Fabric', status: 'GI Handloom Mark Certified', qty: 5, cost: 48000, date: '2024-01-18' },
  { id: 'HCL-0002', painter: 'Pochampally Ikat Society Telangana', ware: 'Handloom Muslin Dhoti', status: 'IS 16784 Handloom Grade A', qty: 4, cost: 42000, date: '2024-01-31' },
  { id: 'HCL-0003', painter: 'Sualkuchi Silk Cluster Assam', ware: 'Handloom Cotton Bed Sheet', status: 'Neem-treated Storage Pack', qty: 8, cost: 18000, date: '2024-02-13' },
  { id: 'HCL-0004', painter: 'Chanderi Weavers MP', ware: 'Handloom Linen Salwar Suit', status: 'Palletised Truck Transit', qty: 6, cost: 14000, date: '2024-02-25' },
  { id: 'HCL-0005', painter: 'Kanchipuram Cotton Guild TN', ware: 'Handloom Cotton Table Runner', status: 'Climate Controlled 22-28C', qty: 10, cost: 8000, date: '2024-03-10' },
  { id: 'HCL-0006', painter: 'Phulia Handloom Society Odisha', ware: 'Handloom Ikat Stole', status: 'Cotton Count Tensile QC', qty: 3, cost: 50000, date: '2024-03-23' },
  { id: 'HCL-0007', painter: 'Kotpad Tribal Weavers Odisha', ware: 'Handloom Jamdani Saree', status: 'GI Handloom Mark Certified', qty: 6, cost: 16000, date: '2024-04-05' },
  { id: 'HCL-0008', painter: 'Bhagalpur Tussar Cluster Bihar', ware: 'Handloom Cotton Napkin Set', status: 'IS 16784 Handloom Grade A', qty: 12, cost: 6000, date: '2024-04-18' },
  { id: 'HCL-0009', painter: 'Varanasi Handloom Weavers UP', ware: 'Handloom Muslin Dhoti', status: 'Neem-treated Storage Pack', qty: 4, cost: 44000, date: '2024-05-01' },
  { id: 'HCL-0010', painter: 'Pochampally Ikat Society Telangana', ware: 'Handloom Cotton Khadi Fabric', status: 'Palletised Truck Transit', qty: 5, cost: 46000, date: '2024-05-13' },
  { id: 'HCL-0011', painter: 'Sualkuchi Silk Cluster Assam', ware: 'Handloom Cotton Bed Sheet', status: 'Climate Controlled 22-28C', qty: 8, cost: 20000, date: '2024-05-25' },
  { id: 'HCL-0012', painter: 'Chanderi Weavers MP', ware: 'Handloom Linen Salwar Suit', status: 'Cotton Count Tensile QC', qty: 6, cost: 12000, date: '2024-06-07' },
  { id: 'HCL-0013', painter: 'Kanchipuram Cotton Guild TN', ware: 'Handloom Cotton Table Runner', status: 'GI Handloom Mark Certified', qty: 10, cost: 10000, date: '2024-06-19' },
  { id: 'HCL-0014', painter: 'Phulia Handloom Society Odisha', ware: 'Handloom Ikat Stole', status: 'IS 16784 Handloom Grade A', qty: 3, cost: 52000, date: '2024-07-01' },
  { id: 'HCL-0015', painter: 'Kotpad Tribal Weavers Odisha', ware: 'Handloom Jamdani Saree', status: 'Neem-treated Storage Pack', qty: 7, cost: 18000, date: '2024-07-13' },
  { id: 'HCL-0016', painter: 'Bhagalpur Tussar Cluster Bihar', ware: 'Handloom Cotton Napkin Set', status: 'Palletised Truck Transit', qty: 15, cost: 5000, date: '2024-07-25' },
  { id: 'HCL-0017', painter: 'Varanasi Handloom Weavers UP', ware: 'Handloom Cotton Khadi Fabric', status: 'Climate Controlled 22-28C', qty: 4, cost: 44000, date: '2024-08-07' },
  { id: 'HCL-0018', painter: 'Pochampally Ikat Society Telangana', ware: 'Handloom Muslin Dhoti', status: 'Cotton Count Tensile QC', qty: 5, cost: 40000, date: '2024-08-19' },
  { id: 'HCL-0019', painter: 'Sualkuchi Silk Cluster Assam', ware: 'Handloom Cotton Bed Sheet', status: 'GI Handloom Mark Certified', qty: 8, cost: 22000, date: '2024-08-31' },
  { id: 'HCL-0020', painter: 'Chanderi Weavers MP', ware: 'Handloom Linen Salwar Suit', status: 'IS 16784 Handloom Grade A', qty: 6, cost: 14000, date: '2024-09-12' },
]

export default function HandloomCottonSupplyChainView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...handloomRecords, ...genRecords(21), ...genRecords(41)]

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
    <div className="hcl-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Handloom Cotton' }]} />
      <PageHeader title="Handloom Cotton Supply Chain" description="Indian handloom cotton fabric and textile supply chain with IS 16784 handloom certification, cotton count tensile quality control, neem-treated storage packaging, and GI Handloom Mark across 8 weaving communities in Varanasi, Pochampally, and Chanderi" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-blue-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Shipments" value={allRecords.length} />
            <KpiTile label="Active Ware" value={PRODUCTS.length} />
            <KpiTile label="Weaving Clusters" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={93} />
            <HealthRing label="IS 16796" value={86} />
            <HealthRing label="Muslin" value={81} />
            <HealthRing label="Truck" value={77} />
            <HealthRing label="Dry" value={84} />
            <HealthRing label="Tensile" value={89} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Weaver Families" value="20+" />
            <ValueTile label="Tradition" value="Since 6th C" />
            <ValueTile label="Export Markets" value="4 Countries" />
            <ValueTile label="Annual Revenue" value="₹1.8 Crore" />
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
            placeholder="Search Handloom cotton shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-blue-100">
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
                  <tr key={record.id} className="border-t hover:bg-blue-50/50">
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
              <CardHeader><CardTitle>Handloom Cotton — 5000-Year Vedic Era Indian Textile Heritage</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Handloom cotton weaving represents the oldest and most culturally significant textile manufacturing tradition of the Indian subcontinent having been continuously practised for over five millennia from the Vedic era through successive civilisational periods by the hereditary weaver communities of every Indian state where traditional handloom weavers operating pit looms frame looms and jacquard handlooms create an extraordinary diversity of cotton textile products ranging from the finest muslin fabrics known as the legendary woven wind of Dhaka to the robust khadi cotton fabrics that became synonymous with the Indian independence movement under Mahatma Gandhi who transformed the traditional handloom spinning and weaving activity into a powerful symbol of Indian self-reliance and cultural identity establishing khadi as the fabric of Indian nationalism that continues to hold profound cultural and political significance in contemporary India where the Indian handloom cotton textile tradition encompasses an extraordinary range of regional weaving specialities including the Varanasi brocade technique with its intricate zari metallic thread work the Pochampally ikat tie-dye technique of Telangana producing geometric resist-dyed patterns of extraordinary precision the Chanderi sheer fabric tradition of Madhya Pradesh combining silk and cotton in gossamer-light fabrics the Sualkuchi muga silk and cotton weaving tradition of Assam the Kanchipuram cotton and silk weaving tradition of Tamil Nadu and hundreds of additional regional specialities each producing distinctive textile designs colour palettes weave structures and surface qualities that reflect the unique cultural aesthetic and technical innovation of their respective weaving communities.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16784 Handloom Certification & Cotton Count Tensile QC Standards</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The IS 16784 standard for Indian handloom cotton textiles establishes the national quality certification framework specifying comprehensive requirements for cotton yarn quality and count including minimum thread count per centimetre requirements for each handloom textile grade handloom weave density and pick insertion regularity requirements measured across the fabric width at five reference points ensuring uniform weave density without localised thin spots or weave irregularities that would compromise fabric quality and durability natural dye and chemical dye colourfastness ratings tested in accordance with ISO 105-C06 wash fastness and ISO 105-B02 light fastness testing methodology confirming the dye quality meets minimum Grade 3 colourfastness on the ISO grey scale for both wash and light exposure ensuring the handloom cotton textile maintains its colour quality throughout the expected service life of the finished product where the cotton count tensile quality control requirements for IS 16784 Grade A certification mandate minimum cotton yarn count of 2/60s for fine handloom fabrics and 2/40s for medium handloom fabrics measured in accordance with IS 1671 yarn count testing methodology and minimum yarn tensile strength of 10 centinewtons per tex for 2/60s count and 14 centinewtons per tex for 2/40s count measured by single-end yarn tensile testing in accordance with IS 1673 methodology ensures the cotton yarn possesses adequate strength for the handloom weaving operation where the yarn must withstand the significant tensile stresses of warp tension during the pit loom and frame loom weaving process without frequent yarn breakage that would compromise the weave density and surface quality of the finished handloom cotton fabric.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Neem-treated Storage Packaging for Handloom Cotton Transit</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Neem-treated storage packaging combining neem leaf and neem oil natural insect repellent treatment with breathable cotton fabric wrapping and corrugated outer shipping containers has been developed specifically for the handloom cotton textile logistics supply chain to protect the natural cotton fibre integrity handloom weave quality and dye colour properties of handloom cotton products from the biological and environmental hazards encountered during transit and storage from the Indian handloom weaving centres across Varanasi Pochampally Chanderi and other production regions to domestic retail distribution points throughout India and international export destinations where the neem treatment specification utilises dried neem Azadirachta indica leaf material at minimum 50 grams per cubic metre of packaging volume combined with neem oil-impregnated cotton strips providing sustained natural insect repellent protection effective against the primary textile pest species including Anthrenus verbasci varied carpet beetle Tineola bisselliella webbing clothes moth and Tribolium castaneum red flour beetle that represent the most common biological hazards to stored cotton textile products and each handloom cotton textile product undergoes a comprehensive pre-shipping quality inspection verifying weave density within the IS 16784 Grade A thread count parameters handloom surface quality verified through tactile and visual inspection confirming smooth fabric hand feel without weaving defects including missing picks double picks float stitches or selvedge irregularities dye colourfastness verified through standardised colour rub testing confirming no colour transfer exceeding Grade 4 on the ISO 105-A02 grey scale for colour staining and dimensional accuracy confirming the product dimensions fall within the specified tolerance parameters for the product category and size classification.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Digital Loom Integration & Handloom Weavers Economic Empowerment</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Digital loom integration technologies including computer-aided design systems for handloom pattern development electronic jacquard head attachments for traditional handlooms and online marketplace platforms for direct artisan-to-consumer sales are progressively transforming the Indian handloom cotton sector enhancing both the creative capabilities and economic returns of traditional handloom weaver communities while preserving the essential handcrafted quality and cultural authenticity that distinguishes Indian handloom cotton textiles from mechanised mill-produced fabrics where the digital pattern development system enables handloom weavers to create and preview complex textile patterns including traditional regional designs contemporary adaptations and custom client designs using specialised CAD software that generates the lift plan documentation needed to set up the handloom jacquard mechanism for weaving the designed pattern and the electronic jacquard head attachment retrofits to traditional handlooms replacing the mechanical jacquard mechanism with an electronically controlled system that reads the digital lift plan from a USB memory device and controls individual warp thread lifting through solenoid-operated hooks providing precise and repeatable pattern control that eliminates the pattern registration errors and quality variations inherent in the mechanical jacquard system while maintaining the hand-weaving operation where the weaver continues to control the weft insertion beat-up and take-up operations manually preserving the handcrafted quality hand feel and drape characteristics of the finished handloom cotton fabric and the AI-powered online marketplace platform connects traditional handloom weaver cooperatives directly with domestic and international consumers bypassing the traditional multi-level wholesale distribution network that typically absorbs sixty to seventy percent of the final retail price providing significantly improved economic returns for the handloom weaver communities.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



