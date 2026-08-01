import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#991b1b', '#b91c1c', '#dc2626', '#ef4444', '#fee2e2', '#7f1d1d', '#450a0a', '#fff1f2']
const PRODUCTS = ['Tagore Batik Wall Hanging', 'Baul Singer Batik Panel', 'Santiniketan Tree of Life Saree', 'Bolpur Landscape Batik Scroll', 'Visva-Bharati Floral Batik', 'Khoai Forest Batik Curtain', 'Tribal Motif Batik Bedspread', 'Bengali Village Batik Table Runner']
const DYERS = ['Santiniketan Visva-Bharati Batik Studio', 'Bolpur Rural Batik Centre', 'Sriniketan Wax Art Guild', 'Birbhum Hand-Dye Society', 'Rampurhat Batik Artists', 'Illambazar Textile Collective', 'Khowai Forest Craft Colony', 'Nanoor Traditional Batik Centre']
const STATUSES = ['GI Santiniketan Batik Mark', 'IS 16803 Wax Resist Dye Grade A', 'Acid-Free Fabric Roll Bundle', 'Enclosed Truck Transit', 'Moisture-Free Vault 20-28C', 'Wax Pattern Clarity QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">{status}</span>
)

const CostBar = ({ cost, maxCost }: { cost: number; maxCost: number }) => (
  <div className="w-full bg-red-100 rounded-full h-2"><div className="bg-red-700 h-2 rounded-full" style={{ width: `${ri(0, 100, (cost / maxCost) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value }: { label: string; value: number }) => {
  const r = 40, c = 2 * Math.PI * r, offset = c - (value / 100) * c
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="100" height="100" className="-rotate-90"><circle cx="50" cy="50" r={r} fill="none" stroke="#e5e7eb" strokeWidth="8" /><circle cx="50" cy="50" r={r} fill="none" stroke={COLORS[0]} strokeWidth="8" strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" /></svg>
      <span className="text-sm font-semibold" style={{ color: COLORS[0] }}>{value}%</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  )
}



const KpiTile = ({ title, value }: { title: string; value: string }) => (
  <Card><CardContent className="p-4"><p className="text-sm text-gray-500">{title}</p><p className="text-2xl font-bold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)
const ValueTile = ({ title, value }: { title: string; value: string }) => (
  <Card><CardContent className="p-4"><p className="text-sm text-gray-500">{title}</p><p className="text-2xl font-bold" style={{ color: COLORS[1] }}>{value}</p></CardContent></Card>
)


const genRecords = () => batikRecords

const filterRecords = (records: typeof batikRecords, activeFilters: Record<string, string[]>) =>
  records.filter(r => Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)))

const UNITS = ['panels', 'sarees', 'sets', 'yards']




const batikRecords = [
  { id: 'SBK-0001', fabric: 'Tagore Batik Wall Hanging', dyer: 'Santiniketan Visva-Bharati Batik Studio', status: 'GI Santiniketan Batik Mark', qty: 12, cost: 18500, date: '2025-01-15' },
  { id: 'SBK-0002', fabric: 'Baul Singer Batik Panel', dyer: 'Bolpur Rural Batik Centre', status: 'IS 16803 Wax Resist Dye Grade A', qty: 8, cost: 24500, date: '2025-01-22' },
  { id: 'SBK-0003', fabric: 'Santiniketan Tree of Life Saree', dyer: 'Sriniketan Wax Art Guild', status: 'Acid-Free Fabric Roll Bundle', qty: 15, cost: 45000, date: '2025-02-03' },
  { id: 'SBK-0004', fabric: 'Bolpur Landscape Batik Scroll', dyer: 'Birbhum Hand-Dye Society', status: 'Enclosed Truck Transit', qty: 6, cost: 62000, date: '2025-02-10' },
  { id: 'SBK-0005', fabric: 'Visva-Bharati Floral Batik', dyer: 'Rampurhat Batik Artists', status: 'Moisture-Free Vault 20-28C', qty: 20, cost: 12000, date: '2025-02-18' },
  { id: 'SBK-0006', fabric: 'Khoai Forest Batik Curtain', dyer: 'Illambazar Textile Collective', status: 'Wax Pattern Clarity QC', qty: 10, cost: 38000, date: '2025-02-25' },
  { id: 'SBK-0007', fabric: 'Tribal Motif Batik Bedspread', dyer: 'Khowai Forest Craft Colony', status: 'GI Santiniketan Batik Mark', qty: 18, cost: 55000, date: '2025-03-05' },
  { id: 'SBK-0008', fabric: 'Bengali Village Batik Table Runner', dyer: 'Nanoor Traditional Batik Centre', status: 'IS 16803 Wax Resist Dye Grade A', qty: 25, cost: 8000, date: '2025-03-12' },
  { id: 'SBK-0009', fabric: 'Tagore Batik Wall Hanging', dyer: 'Sriniketan Wax Art Guild', status: 'Acid-Free Fabric Roll Bundle', qty: 14, cost: 195000, date: '2025-03-20' },
  { id: 'SBK-0010', fabric: 'Baul Singer Batik Panel', dyer: 'Birbhum Hand-Dye Society', status: 'Enclosed Truck Transit', qty: 9, cost: 32000, date: '2025-03-28' },
  { id: 'SBK-0011', fabric: 'Santiniketan Tree of Life Saree', dyer: 'Rampurhat Batik Artists', status: 'Moisture-Free Vault 20-28C', qty: 22, cost: 68000, date: '2025-04-05' },
  { id: 'SBK-0012', fabric: 'Bolpur Landscape Batik Scroll', dyer: 'Illambazar Textile Collective', status: 'Wax Pattern Clarity QC', qty: 7, cost: 85000, date: '2025-04-12' },
  { id: 'SBK-0013', fabric: 'Visva-Bharati Floral Batik', dyer: 'Khowai Forest Craft Colony', status: 'GI Santiniketan Batik Mark', qty: 16, cost: 15500, date: '2025-04-20' },
  { id: 'SBK-0014', fabric: 'Khoai Forest Batik Curtain', dyer: 'Nanoor Traditional Batik Centre', status: 'IS 16803 Wax Resist Dye Grade A', qty: 11, cost: 42000, date: '2025-04-28' },
  { id: 'SBK-0015', fabric: 'Tribal Motif Batik Bedspread', dyer: 'Santiniketan Visva-Bharati Batik Studio', status: 'Acid-Free Fabric Roll Bundle', qty: 19, cost: 72000, date: '2025-05-05' },
  { id: 'SBK-0016', fabric: 'Bengali Village Batik Table Runner', dyer: 'Bolpur Rural Batik Centre', status: 'Enclosed Truck Transit', qty: 30, cost: 9500, date: '2025-05-13' },
  { id: 'SBK-0017', fabric: 'Tagore Batik Wall Hanging', dyer: 'Birbhum Hand-Dye Society', status: 'Moisture-Free Vault 20-28C', qty: 13, cost: 165000, date: '2025-05-20' },
  { id: 'SBK-0018', fabric: 'Baul Singer Batik Panel', dyer: 'Illambazar Textile Collective', status: 'Wax Pattern Clarity QC', qty: 10, cost: 28000, date: '2025-05-28' },
  { id: 'SBK-0019', fabric: 'Santiniketan Tree of Life Saree', dyer: 'Khowai Forest Craft Colony', status: 'GI Santiniketan Batik Mark', qty: 17, cost: 58000, date: '2025-06-03' },
  { id: 'SBK-0020', fabric: 'Bolpur Landscape Batik Scroll', dyer: 'Rampurhat Batik Artists', status: 'IS 16803 Wax Resist Dye Grade A', qty: 5, cost: 92000, date: '2025-06-10' },
]

export default function SantiniketanBatikBengalLogisticsView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = useMemo(() => genRecords(), [])
  const filteredRecords = useMemo(() => filterRecords(allRecords, activeFilters).filter(r => r.fabric.toLowerCase().includes(searchQuery.toLowerCase()) || r.dyer.toLowerCase().includes(searchQuery.toLowerCase())), [searchQuery, activeFilters, allRecords])
  const filterGroups = useMemo(() => [
    { key: 'fabric', label: 'Fabric', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.fabric === p).length })) },
    { key: 'dyer', label: 'Dyer', options: DYERS.map(d => ({ value: d, label: d, count: allRecords.filter(r => r.dyer === d).length })) },
    { key: 'status', label: 'Status', options: STATUSES.map(s => ({ value: s, label: s, count: allRecords.filter(r => r.status === s).length })) },
  ], [allRecords])
  const maxCost = Math.max(...allRecords.map(r => r.cost))
  const charts = useMemo(() => ({
    line: allRecords.map(r => ({ month: r.date.slice(0, 7), cost: r.cost })),
    bar: PRODUCTS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), qty: allRecords.filter(r => r.fabric === p).reduce((s, r) => s + r.qty, 0) })),
    pie: DYERS.map(d => ({ name: d.split(' ').slice(0, 2).join(' '), value: allRecords.filter(r => r.dyer === d).length })),
  }), [allRecords])
  const handleToggleFilter = (key: string, value: string) => {
    setActiveFilters(prev => ({ ...prev, [key]: prev[key]?.includes(value) ? prev[key].filter(v => v !== value) : [...(prev[key] || []), value] }))
  }



  return (
    <div className="space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Santiniketan Batik Bengal' }]} />
      <PageHeader title="Santiniketan Batik Bengal Logistics" description="Wax-resist fabric dyeing logistics management from Santiniketan, West Bengal" />
      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile title="Total Shipments" value={String(allRecords.length)} />
            <KpiTile title="Total Value" value={`₹${allRecords.reduce((s, r) => s + r.cost, 0).toLocaleString()}`} />
            <KpiTile title="Active Dyers" value={String(DYERS.length)} />
            <KpiTile title="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Mark" value={96} />
            <HealthRing label="IS 16803" value={92} />
            <HealthRing label="Fabric Roll" value={89} />
            <HealthRing label="Truck" value={83} />
            <HealthRing label="Storage" value={90} />
            <HealthRing label="Wax QC" value={94} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile title="Dyeing Workshops" value="10 Ateliers" />
            <ValueTile title="Annual Output" value="4,500 Pieces" />
            <ValueTile title="Export Markets" value="18 Countries" />
            <ValueTile title="Heritage Legacy" value="100 Years" />
          </div>
        </TabsContent>
        <TabsContent value="shipments" className="space-y-4">
          <SearchFilterToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearSearch={() => setSearchQuery('')}
            activeFilters={activeFilters}
            filterGroups={filterGroups}
            onToggleFilter={handleToggleFilter}
            onClearAllFilters={() => setActiveFilters({})}
            totalItems={allRecords.length}
            filteredCount={filteredRecords.length}
            onRefresh={() => {}}
            placeholder="Search fabrics, dyers..."
          />
          <Card>
            <CardHeader>
              <CardTitle>Batik Shipment Records</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">ID</th>
                    <th className="text-left py-2 px-2">Fabric</th>
                    <th className="text-left py-2 px-2">Dyer</th>
                    <th className="text-left py-2 px-2">Status</th>
                    <th className="text-left py-2 px-2">Qty</th>
                    <th className="text-left py-2 px-2">Cost</th>
                    <th className="text-left py-2 px-2">Cost Bar</th>
                    <th className="text-left py-2 px-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map(r => (
                    <tr key={r.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-2 font-mono text-xs">{r.id}</td>
                      <td className="py-2 px-2"><ProductBadge name={r.fabric} /></td>
                      <td className="py-2 px-2 text-xs">{r.dyer}</td>
                      <td className="py-2 px-2"><StatusBadge status={r.status} /></td>
                      <td className="py-2 px-2">{r.qty}</td>
                      <td className="py-2 px-2">₹{r.cost.toLocaleString()}</td>
                      <td className="py-2 px-2 w-24"><CostBar cost={r.cost} maxCost={maxCost} /></td>
                      <td className="py-2 px-2 text-xs">{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader><CardTitle>Cost Trend</CardTitle></CardHeader>
              <CardContent>
                <LineChart width={600} height={300} data={charts.line}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="cost" stroke={COLORS[0]} />
                </LineChart>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Quantity by Product</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={600} height={300} data={charts.bar}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="qty" fill={COLORS[1]} />
                </BarChart>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Shipments by Dyer</CardTitle></CardHeader>
              <CardContent>
                <PieChart width={400} height={300}>
                  <Pie data={charts.pie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {charts.pie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader><CardTitle>Santiniketan Batik — 100 Years of Tagore's Wax-Resist Fabric Art Heritage</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-gray-600">Santiniketan Batik represents a century-old artistic tradition pioneered at Visva-Bharati University by Rabindranath Tagore, who introduced Indonesian wax-resist dyeing techniques to Bengal in the 1920s. Artisans hand-draw intricate wax patterns using the traditional canting tool on premium cotton and silk fabric, applying a meticulous multi-dye immersion technique that uses a carefully calibrated blend of paraffin wax and beeswax as the resist medium. The distinctive motifs of Santiniketan Batik draw deeply from the cultural landscape of Bolpur-Sriniketan, featuring Baul singer silhouettes, Khoai forest landscapes, Santhal tribal art forms, and the iconic Tree of Life pattern. Each piece requires multiple cycles of wax application, dyeing, and wax removal, creating the characteristic crackle effect that makes every batik textile unique. This living heritage continues through dedicated artisan families and institutional training programs across Birbhum district.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16803 Wax Resist Dye Quality Standards for Santiniketan Batik Fabric</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-gray-600">The IS 16803 standard establishes rigorous quality benchmarks for Santiniketan Batik fabric production. Substrate requirements mandate cotton fabric with 140-180 thread count per inch or premium silk-cotton blends meeting specific tensile strength parameters. The wax resist composition must maintain a precise ratio of 60% paraffin wax to 40% beeswax, applied at controlled temperatures between 110-120 degrees Celsius to ensure optimal penetration and crack pattern formation. Dye penetration depth must achieve a minimum of 0.8mm per IS 16803 specifications, with colour fastness rated at Grade 4 or higher on the ISO 105-B02 wash fastness scale. Wax crack pattern uniformity must remain within 15% deviation across the entire fabric surface, ensuring consistent aesthetic quality. These standards preserve the authenticity and commercial viability of genuine Santiniketan Batik in domestic and international markets.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Acid-Free Fabric Roll Packaging & Moisture-Controlled Transit for Batik Textile</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-gray-600">Proper packaging and transit protocols are critical for preserving Santiniketan Batik textile integrity during logistics operations. Each finished batik piece undergoes acid-free tissue interleaving, preventing wax transfer between fabric layers during storage and transport. Fabric is wound flat onto rigid cardboard tubes with minimum 6cm diameter to prevent creasing and wax cracking. Each roll is sealed within a polyethylene liner containing 180g of silica gel desiccant per panel to maintain moisture-free conditions during transit. Enclosed truck transportation maintains ambient temperature between 20-28 degrees Celsius throughout the journey, protecting the wax resist patterns from thermal degradation. Birbhum district logistics networks currently handle over 4,500 batik shipments annually, routed through the Bolpur-Sriniketan railway corridor and Burdwan highway distribution network to ensure timely delivery to galleries, museums, and retail partners across India and abroad.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Wax Pattern Verification & Santiniketan Batik International Collector Market</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-gray-600">Artificial intelligence is revolutionizing authentication of Santiniketan Batik in the international collector market. A convolutional neural network trained on 14,000 authenticated batik pieces achieves 94% accuracy in distinguishing genuine hand-drawn wax patterns from machine-printed reproductions, analyzing subtle characteristics including wax crack pattern randomness, dye penetration gradients at resist boundaries, and the natural irregularity of hand-drawn canting lines. This technology has become essential as export revenue from Santiniketan Batik has surged from Rs 8 crore in 2019 to Rs 24 crore in 2025, with projections targeting Rs 50 crore by 2028. The international collector market now spans 18 countries, with strong demand in Japan, Germany, the United States, and Southeast Asian nations. AI-powered verification systems are being deployed at major auction houses and online platforms to protect collectors from counterfeit batik textiles and preserve the market value of genuine Santiniketan handcrafted pieces.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

