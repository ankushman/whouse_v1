import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#1e3a5f', '#1e40af', '#3b82f6', '#60a5fa', '#bfdbfe', '#1e3a8a', '#172554', '#dbeafe']
const PRODUCTS = ['Jaipur Blue Pottery Bowl', 'Mughal Floral Tile Set', 'Blue Pottery Vase', 'Rajasthani Door Handle Set', 'Blue Ceramic Dinner Set', 'Handpainted Coaster Collection', 'Blue Pottery Lamp Base', 'Geometric Mosaic Panel']
const POTTERS = ['Jaipur Blue Pottery Guild', 'Tripolia Gate Craft Centre', 'Johari Bazaar Ceramic Studio', 'Chandpole Potter Colony', 'Nahargarh Road Artisan Society', 'Sanganer Ceramic Workshop', 'Amer Pottery Collective', 'Kishanpol Blue Art Centre']
const STATUSES = ['GI Jaipur Blue Pottery Mark', 'IS 16907 Ceramic Grade A', 'Foam-Wrapped Ceramic Crate', 'Palletised Truck Transit', 'Dry Storage 20-28C', 'Glaze Adhesion QC']

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
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#dbeafe" strokeWidth="6" />
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
    id: `RBP-${String(offset + i + 1).padStart(4, '0')}`,
    potter: POTTERS[(offset + i) % POTTERS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 400, ((offset + i) * 37) % 400) + 1,
    cost: ri(800, 18000, ((offset + i) * 13097) % 17200) + 800,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const blueRecords = [
  { id: 'RBP-0001', potter: 'Jaipur Blue Pottery Guild', ware: 'Jaipur Blue Pottery Bowl', status: 'GI Jaipur Blue Pottery Mark', qty: 85, cost: 3200, date: '2024-01-15' },
  { id: 'RBP-0002', potter: 'Tripolia Gate Craft Centre', ware: 'Mughal Floral Tile Set', status: 'IS 16907 Ceramic Grade A', qty: 40, cost: 9600, date: '2024-01-22' },
  { id: 'RBP-0003', potter: 'Johari Bazaar Ceramic Studio', ware: 'Blue Pottery Vase', status: 'Foam-Wrapped Ceramic Crate', qty: 65, cost: 5400, date: '2024-02-03' },
  { id: 'RBP-0004', potter: 'Chandpole Potter Colony', ware: 'Rajasthani Door Handle Set', status: 'Palletised Truck Transit', qty: 120, cost: 1800, date: '2024-02-14' },
  { id: 'RBP-0005', potter: 'Nahargarh Road Artisan Society', ware: 'Blue Ceramic Dinner Set', status: 'Dry Storage 20-28C', qty: 30, cost: 14000, date: '2024-02-28' },
  { id: 'RBP-0006', potter: 'Sanganer Ceramic Workshop', ware: 'Handpainted Coaster Collection', qty: 200, cost: 900, date: '2024-03-05', status: 'Glaze Adhesion QC' },
  { id: 'RBP-0007', potter: 'Amer Pottery Collective', ware: 'Blue Pottery Lamp Base', status: 'GI Jaipur Blue Pottery Mark', qty: 55, cost: 7200, date: '2024-03-18' },
  { id: 'RBP-0008', potter: 'Kishanpol Blue Art Centre', ware: 'Geometric Mosaic Panel', status: 'IS 16907 Ceramic Grade A', qty: 20, cost: 16500, date: '2024-03-25' },
  { id: 'RBP-0009', potter: 'Tripolia Gate Craft Centre', ware: 'Jaipur Blue Pottery Bowl', status: 'Foam-Wrapped Ceramic Crate', qty: 110, cost: 2800, date: '2024-04-02' },
  { id: 'RBP-0010', potter: 'Johari Bazaar Ceramic Studio', ware: 'Mughal Floral Tile Set', status: 'Palletised Truck Transit', qty: 35, cost: 10200, date: '2024-04-10' },
  { id: 'RBP-0011', potter: 'Chandpole Potter Colony', ware: 'Blue Pottery Vase', status: 'Dry Storage 20-28C', qty: 75, cost: 4800, date: '2024-04-22' },
  { id: 'RBP-0012', potter: 'Nahargarh Road Artisan Society', ware: 'Rajasthani Door Handle Set', status: 'Glaze Adhesion QC', qty: 150, cost: 1600, date: '2024-05-01' },
  { id: 'RBP-0013', potter: 'Sanganer Ceramic Workshop', ware: 'Blue Ceramic Dinner Set', status: 'GI Jaipur Blue Pottery Mark', qty: 28, cost: 13200, date: '2024-05-15' },
  { id: 'RBP-0014', potter: 'Amer Pottery Collective', ware: 'Handpainted Coaster Collection', status: 'IS 16907 Ceramic Grade A', qty: 240, cost: 750, date: '2024-05-28' },
  { id: 'RBP-0015', potter: 'Kishanpol Blue Art Centre', ware: 'Blue Pottery Lamp Base', status: 'Foam-Wrapped Ceramic Crate', qty: 60, cost: 6800, date: '2024-06-05' },
  { id: 'RBP-0016', potter: 'Jaipur Blue Pottery Guild', ware: 'Geometric Mosaic Panel', status: 'Palletised Truck Transit', qty: 22, cost: 15800, date: '2024-06-18' },
  { id: 'RBP-0017', potter: 'Sanganer Ceramic Workshop', ware: 'Jaipur Blue Pottery Bowl', status: 'Dry Storage 20-28C', qty: 95, cost: 3000, date: '2024-06-25' },
  { id: 'RBP-0018', potter: 'Amer Pottery Collective', ware: 'Mughal Floral Tile Set', status: 'Glaze Adhesion QC', qty: 48, cost: 8800, date: '2024-07-03' },
  { id: 'RBP-0019', potter: 'Kishanpol Blue Art Centre', ware: 'Blue Pottery Vase', status: 'GI Jaipur Blue Pottery Mark', qty: 70, cost: 5200, date: '2024-07-12' },
  { id: 'RBP-0020', potter: 'Jaipur Blue Pottery Guild', ware: 'Rajasthani Door Handle Set', status: 'IS 16907 Ceramic Grade A', qty: 130, cost: 2100, date: '2024-07-20' },
]

export default function RajasthanBluePotteryLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...blueRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'potter', label: 'Potter', options: POTTERS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.potter === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(20, 80, allRecords.length * 0.3 + i * 12) }))
  const potterChart = POTTERS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.potter === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="rbp-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Rajasthan Blue Pottery' }]} />
      <PageHeader title="Rajasthan Blue Pottery Logistics" description="Jaipur Turko-Persian blue pottery supply chain with IS 16907 ceramic compliance, foam-wrapped ceramic packaging, quartz-frit glaze QC tracking, and GI Jaipur Blue Pottery Mark certification across 8 heritage craft clusters in the Pink City" />
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
            <KpiTile label="Potter Clusters" value={POTTERS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={96} />
            <HealthRing label="IS 16907" value={92} />
            <HealthRing label="Foam" value={87} />
            <HealthRing label="Truck" value={83} />
            <HealthRing label="Storage" value={91} />
            <HealthRing label="Glaze" value={94} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Artisan Families" value="8,000+" />
            <ValueTile label="Export Markets" value="35 Countries" />
            <ValueTile label="Heritage Age" value="300 Years" />
            <ValueTile label="Annual Revenue" value="₹42 Crore" />
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
            placeholder="Search blue pottery shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-blue-100">
                <tr>
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Ware</th>
                  <th className="p-3 text-left font-medium">Potter</th>
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
                    <td className="p-3">{record.potter}</td>
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
              <CardHeader><CardTitle>Potter Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={potterChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]}>
                    {potterChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
              <CardHeader><CardTitle>Jaipur Blue Pottery — 300 Years of Turko-Persian Ceramic Heritage</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Jaipur Blue Pottery traces its magnificent origins to the early 18th century when Maharaja Ram Singh I of Jaipur invited Persian ceramic artisans from Central Asia to establish pottery workshops within the walled Pink City. Unlike conventional clay pottery found across India, Jaipur Blue Pottery uses a unique quartz-based dough mixture combining powdered quartz, powdered glass, multani mitti fuller's earth, and gum, which is then hand-moulded and coated with a distinctive cobalt oxide and copper oxide glaze that produces the signature blue and green patterns after firing at temperatures between 800-900 degrees Celsius in traditional wood-fired kilns. The craft flourished under Mughal patronage, with designs evolving to incorporate Rajasthani floral motifs alongside the original Persian geometric patterns, creating a distinctive Indo-Islamic aesthetic that is found nowhere else in the world. Today approximately 8,000 artisan families across eight heritage clusters in Jaipur continue this tradition, producing over 200 product categories ranging from decorative bowls and vases to architectural tiles and functional dinnerware sets that grace both royal palaces and contemporary homes across 35 export countries worldwide.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16907 Ceramic Standards for Jaipur Blue Pottery Quality Assurance</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">The IS 16907 standard for blue ceramic pottery products establishes comprehensive quality specifications specifically tailored to the unique quartz-based composition and cobalt-glaze finishing process that distinguishes Jaipur Blue Pottery from conventional ceramic traditions. The standard mandates strict compositional requirements: the quartz-based body must contain minimum 60% powdered quartz with controlled proportions of powdered glass between 15-20%, ensuring the characteristic translucency and chip resistance that defines authentic Jaipur pottery. Cobalt oxide glaze concentration must fall within specified PPM ranges to achieve consistent colour development during the critical 800-900 degree firing cycle, with colour fastness testing requiring pieces to withstand 500 hours of direct sunlight exposure without measurable fading. IS 16907 Grade A certification demands glaze surface uniformity within 0.3mm tolerance, ensuring the hand-painted designs maintain consistent depth and clarity across production batches. Each certified piece undergoes water absorption testing, requiring absorption rates below 5% to guarantee food-safety compliance for dinnerware products, alongside lead and cadmium leach testing conducted by NABL-accredited laboratories to meet both Indian FSSAI standards and international FDA food-contact regulations.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Foam-Wrapped Ceramic Packaging & Temperature-Controlled Logistics</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Foam-wrapped ceramic crate packaging has been specifically engineered for the fragile quartz-based Jaipur Blue Pottery, which is significantly more brittle than conventional clay ceramics due to its unique composition lacking plastic clay minerals. Each individual piece undergoes a multi-layer protective wrapping process: first wrapped in acid-free tissue paper to prevent surface glaze abrasion, then encased in custom-cut polyethylene foam inserts moulded to the exact piece profile, and finally secured within a rigid corrugated cardboard crate using additional foam corner blocks and suspended cradle inserts that prevent any contact between adjacent pieces during transit. The packaging system has been extensively tested using ISTA 3A transit simulation protocols, demonstrating capability to withstand drops from 60 centimetres and vibration frequencies encountered during truck, rail, and air transport without breakage. Temperature-controlled logistics maintain a strict 20-28 degree Celsius range throughout the supply chain, as thermal shock from rapid temperature fluctuations poses the greatest risk to the quartz-glaze bond integrity, potentially causing micro-cracking that compromises both structural integrity and the waterproof glaze surface essential for functional dinnerware products destined for international luxury retail markets.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Glaze Pattern Verification & Blue Pottery Global Market Strategy</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and machine learning technologies are transforming quality assurance and market positioning for Jaipur Blue Pottery in the competitive global artisanal ceramics marketplace. Advanced computer vision systems employing convolutional neural networks can now verify the authenticity and precision of hand-painted cobalt oxide glaze patterns by analysing high-resolution images against authenticated master design databases, detecting deviations as small as 0.2mm in brush stroke width, pattern symmetry, and colour density uniformity across the glazed surface. This AI-powered authentication system has reduced quality rejection rates from 18% to under 4% since its pilot deployment in Q2 2025 across five Jaipur craft clusters, while simultaneously accelerating the grading process from manual inspection averaging 8 minutes per piece to automated scanning completing 12 pieces per minute. India's ongoing UNESCO Intangible Cultural Heritage application for Jaipur Blue Pottery has generated unprecedented international visibility, with export revenue growing 28% year-over-year as luxury department stores in London, Tokyo, New York, and Dubai increasingly stock authenticated collections. Blockchain-based digital certificates linked to each piece through embedded NFC chips provide complete provenance documentation from the specific artisan workshop through every logistics touchpoint to the final retail destination.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
