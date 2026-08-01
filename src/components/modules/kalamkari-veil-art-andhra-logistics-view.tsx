import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#b45309', '#d97706', '#f59e0b', '#fbbf24', '#fef3c7', '#92400e', '#78350f', '#fffbeb']
const PRODUCTS = ['Tree of Life Kalamkari Panel', 'Ramayana Kalamkari Scroll', 'Mahabharata Veil Curtain', 'Srikalahasti Temple Panel', 'Machilipatnam Wall Hanging', 'Kalamkari Bedspread Set', 'Pattachitra Kalamkari Saree', 'Kalamkari Table Runner Ensemble']
const DYERS = ['Srikalahasti Pen Art Guild', 'Machilipatnam Block Printers', 'Pedana Kalamkari Centre', 'Nellore Traditional Dyers', 'Tirupati Temple Art Studio', 'Vijayawada Craft Collective', 'Guntur Veil Art Colony', 'Kurnool Natural Dye Society']
const STATUSES = ['GI Kalamkari Textile Mark', 'IS 16798 Handpaint Textile Grade A', 'Muslin Cotton Roll Bundle', 'Enclosed Truck Transit', 'Moisture-Free Vault 20-28C', 'Natural Mordant QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ text }: { text: string }) => (
  <span className="inline-block rounded-full px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{text}</span>
)

const StatusBadge = ({ text }: { text: string }) => (
  <span className="inline-block rounded-full px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800">{text}</span>
)

const CostBar = ({ value, max }: { value: number; max: number }) => (
  <div className="w-24 h-2 rounded-full bg-amber-100"><div className="h-2 rounded-full bg-amber-700" style={{ width: `${ri(0, 100, (value / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value }: { label: string; value: number }) => {
  const r = 28
  const c = 2 * Math.PI * r
  return (<div className="flex flex-col items-center gap-1">
    <svg width="68" height="68" viewBox="0 0 68 68">
      <circle cx="34" cy="34" r={r} fill="none" stroke="#e5e7eb" strokeWidth="6" />
      <circle cx="34" cy="34" r={r} fill="none" stroke={COLORS[0]} strokeWidth="6" strokeDasharray={`${c}`} strokeDashoffset={c * (1 - ri(0, 1, value))} strokeLinecap="round" transform="rotate(-90 34 34)" />
    </svg>
    <span className="text-xs font-medium" style={{ color: COLORS[0] }}>{Math.round(value * 100)}%</span>
    <span className="text-[10px] text-muted-foreground">{label}</span>
  </div>)
}

const KpiTile = ({ title, value, sub }: { title: string; value: string; sub: string }) => (
  <Card className="p-4"><p className="text-sm text-muted-foreground">{title}</p><p className="text-2xl font-bold" style={{ color: COLORS[0] }}>{value}</p><p className="text-xs text-muted-foreground">{sub}</p></Card>
)

const ValueTile = ({ label, value, unit }: { label: string; value: number; unit: string }) => (
  <Card className="p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="text-xl font-bold" style={{ color: COLORS[1] }}>{value.toLocaleString()}</p><p className="text-xs text-muted-foreground">{unit}</p></Card>
)

const genRecords = () =>
  Array.from({ length: 20 }, (_, i) => ({
    id: `KVA-${String(i + 1).padStart(4, '0')}`,
    textile: PRODUCTS[i % PRODUCTS.length],
    dyer: DYERS[i % DYERS.length], status: STATUSES[i % STATUSES.length],
    quantity: ri(5, 200, Math.random() * 200),
    cost: ri(12000, 220000, Math.random() * 220000),
    date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
  }))

const kalamkariRecords = [
  { id: 'KVA-0001', textile: 'Tree of Life Kalamkari Panel', dyer: 'Srikalahasti Pen Art Guild', status: 'GI Kalamkari Textile Mark', quantity: 45, cost: 85000, date: '1/15/2024' },
  { id: 'KVA-0002', textile: 'Ramayana Kalamkari Scroll', dyer: 'Machilipatnam Block Printers', status: 'IS 16798 Handpaint Textile Grade A', quantity: 28, cost: 125000, date: '2/20/2024' },
  { id: 'KVA-0003', textile: 'Mahabharata Veil Curtain', dyer: 'Pedana Kalamkari Centre', status: 'Muslin Cotton Roll Bundle', quantity: 120, cost: 195000, date: '3/10/2024' },
  { id: 'KVA-0004', textile: 'Srikalahasti Temple Panel', dyer: 'Nellore Traditional Dyers', status: 'Enclosed Truck Transit', quantity: 60, cost: 72000, date: '4/5/2024' },
  { id: 'KVA-0005', textile: 'Machilipatnam Wall Hanging', dyer: 'Tirupati Temple Art Studio', status: 'Moisture-Free Vault 20-28C', quantity: 85, cost: 45000, date: '5/18/2024' },
  { id: 'KVA-0006', textile: 'Kalamkari Bedspread Set', dyer: 'Vijayawada Craft Collective', status: 'Natural Mordant QC', quantity: 35, cost: 168000, date: '6/22/2024' },
  { id: 'KVA-0007', textile: 'Pattachitra Kalamkari Saree', dyer: 'Guntur Veil Art Colony', status: 'GI Kalamkari Textile Mark', quantity: 50, cost: 210000, date: '7/14/2024' },
  { id: 'KVA-0008', textile: 'Kalamkari Table Runner Ensemble', dyer: 'Kurnool Natural Dye Society', status: 'IS 16798 Handpaint Textile Grade A', quantity: 92, cost: 38000, date: '8/3/2024' },
  { id: 'KVA-0009', textile: 'Tree of Life Kalamkari Panel', dyer: 'Vijayawada Craft Collective', status: 'Enclosed Truck Transit', quantity: 40, cost: 92000, date: '9/1/2024' },
  { id: 'KVA-0010', textile: 'Ramayana Kalamkari Scroll', dyer: 'Srikalahasti Pen Art Guild', status: 'Moisture-Free Vault 20-28C', quantity: 18, cost: 155000, date: '10/12/2024' },
  { id: 'KVA-0011', textile: 'Mahabharata Veil Curtain', dyer: 'Machilipatnam Block Printers', status: 'Natural Mordant QC', quantity: 75, cost: 220000, date: '11/8/2024' },
  { id: 'KVA-0012', textile: 'Srikalahasti Temple Panel', dyer: 'Pedana Kalamkari Centre', status: 'Muslin Cotton Roll Bundle', quantity: 55, cost: 68000, date: '12/1/2024' },
  { id: 'KVA-0013', textile: 'Machilipatnam Wall Hanging', dyer: 'Nellore Traditional Dyers', status: 'GI Kalamkari Textile Mark', quantity: 100, cost: 42000, date: '1/25/2024' },
  { id: 'KVA-0014', textile: 'Kalamkari Bedspread Set', dyer: 'Tirupati Temple Art Studio', status: 'IS 16798 Handpaint Textile Grade A', quantity: 30, cost: 185000, date: '2/14/2024' },
  { id: 'KVA-0015', textile: 'Pattachitra Kalamkari Saree', dyer: 'Vijayawada Craft Collective', status: 'Enclosed Truck Transit', quantity: 22, cost: 200000, date: '3/28/2024' },
  { id: 'KVA-0016', textile: 'Kalamkari Table Runner Ensemble', dyer: 'Guntur Veil Art Colony', status: 'Moisture-Free Vault 20-28C', quantity: 150, cost: 12000, date: '4/15/2024' },
  { id: 'KVA-0017', textile: 'Tree of Life Kalamkari Panel', dyer: 'Kurnool Natural Dye Society', status: 'Natural Mordant QC', quantity: 65, cost: 78000, date: '5/30/2024' },
  { id: 'KVA-0018', textile: 'Ramayana Kalamkari Scroll', dyer: 'Srikalahasti Pen Art Guild', status: 'Muslin Cotton Roll Bundle', quantity: 15, cost: 145000, date: '6/18/2024' },
  { id: 'KVA-0019', textile: 'Mahabharata Veil Curtain', dyer: 'Machilipatnam Block Printers', status: 'GI Kalamkari Textile Mark', quantity: 48, cost: 190000, date: '7/22/2024' },
  { id: 'KVA-0020', textile: 'Srikalahasti Temple Panel', dyer: 'Pedana Kalamkari Centre', status: 'Enclosed Truck Transit', quantity: 80, cost: 55000, date: '8/10/2024' },
]

export default function KalamkariVeilArtAndhraLogisticsView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [selectedTab, setSelectedTab] = useState('dashboard')
  const allRecords = kalamkariRecords

  const filteredRecords = useMemo(() =>
    allRecords.filter(r =>
      Object.entries(activeFilters).every(([key, vals]) =>
        vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)
      )
    ), [activeFilters, allRecords])

  const filterGroups = [
    { key: 'textile', label: 'Textile', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.textile === p).length })) },
    { key: 'dyer', label: 'Dyer', options: DYERS.map(d => ({ value: d, label: d, count: allRecords.filter(r => r.dyer === d).length })) },
  ]

  const chartData = allRecords.slice(0, 10).map(r => ({ name: r.textile.split(' ').slice(0, 2).join(' '), cost: r.cost, quantity: r.quantity, status: r.status }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))
  const minCost = Math.min(...allRecords.map(r => r.cost))
  const avgCost = Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length)

  return (<div className="kva-root space-y-6 p-6">
    <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Kalamkari Veil Art Andhra' }]} />
    <PageHeader title="Kalamkari Veil Art Andhra Logistics" description="Hand-painted textile art logistics from Andhra Pradesh — 3,000-year Kalamkari tradition" />
    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
      <TabsList className="bg-amber-50">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="shipments">Shipments</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="insights">Insights</TabsTrigger>
      </TabsList>
      <TabsContent value="dashboard" className="space-y-6">

        <div className="grid grid-cols-4 gap-4">
          <KpiTile title="Total Shipments" value={allRecords.length.toString()} sub="Kalamkari consignments" />
          <KpiTile title="Active Transit" value={allRecords.filter(r => r.status.includes('Transit')).length.toString()} sub="In movement now" />
          <KpiTile title="GI Certified" value={allRecords.filter(r => r.status.includes('GI')).length.toString()} sub="Kalamkari GI mark" />
          <KpiTile title="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} sub="Per shipment" />
        </div>
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Kalamkari Quality Health</h3>
          <div className="flex justify-around">
            <HealthRing label="GI Mark" value={0.92} />
            <HealthRing label="Grade A" value={0.85} />
            <HealthRing label="Muslin Roll" value={0.88} />
            <HealthRing label="Transit" value={0.76} />
            <HealthRing label="Moisture" value={0.94} />
            <HealthRing label="Dye QC" value={0.90} />
          </div>
        </Card>
        <div className="grid grid-cols-4 gap-4">
          <ValueTile label="Total Value" value={allRecords.reduce((s, r) => s + r.cost, 0)} unit="INR" />
          <ValueTile label="Avg Cost" value={Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length)} unit="INR avg" />
          <ValueTile label="Total Qty" value={allRecords.reduce((s, r) => s + r.quantity, 0)} unit="units" />
          <ValueTile label="Dyers" value={new Set(allRecords.map(r => r.dyer)).size} unit="guilds" />
        </div>
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-2">Kalamkari Supply Chain</h3>
          <p className="text-xs text-muted-foreground">Monitoring {allRecords.length} shipments across Andhra Pradesh</p>
          <p className="text-xs text-muted-foreground">Srikalahasti, Machilipatnam, Pedana production centres active</p>
        </Card>
      </TabsContent>

      <TabsContent value="shipments" className="space-y-4">
        <SearchFilterToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearSearch={() => setSearchQuery('')}
          activeFilters={activeFilters}
          filterGroups={filterGroups}
          onToggleFilter={(key, val) => setActiveFilters(prev => {
            const cur = prev[key] || []
            return { ...prev, [key]: cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val] }
          })}
          onClearAllFilters={() => setActiveFilters({})}
          totalItems={allRecords.length}
          filteredCount={filteredRecords.length}
          onRefresh={() => window.location.reload()}
          placeholder="Search Kalamkari shipments..."
        />
        <Card className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-amber-50">
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Textile</th>
                <th className="p-2 text-left">Dyer</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-right">Qty</th>
                <th className="p-2 text-right">Cost</th>
                <th className="p-2 text-left">Cost Bar</th>
                <th className="p-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map(r => (
                <tr key={r.id} className="border-b hover:bg-amber-50/50">
                  <td className="p-2 font-mono text-xs">{r.id}</td>
                  <td className="p-2"><ProductBadge text={r.textile} /></td>
                  <td className="p-2 text-xs">{r.dyer}</td>
                  <td className="p-2"><StatusBadge text={r.status} /></td>
                  <td className="p-2 text-right">{r.quantity}</td>
                  <td className="p-2 text-right font-mono">₹{r.cost.toLocaleString()}</td>
                  <td className="p-2"><CostBar value={r.cost} max={maxCost} /></td>
                  <td className="p-2 text-xs text-muted-foreground">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </TabsContent>

      <TabsContent value="analytics" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Cost Trend</h3>
            <LineChart width={400} height={200} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="cost" stroke={COLORS[0]} strokeWidth={2} />
            </LineChart>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Quantity by Textile</h3>
            <BarChart width={400} height={200} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantity" fill={COLORS[1]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </Card>
        </div>
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Kalamkari Status Distribution</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={chartData.reduce((a, r) => {
                const e = a.find(x => x.name === r.status)
                if (e) e.value += r.quantity; else a.push({ name: r.status, value: r.quantity })
                return a
              }, [] as { name: string; value: number }[])}
              cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
              {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </Card>
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-3"><p className="text-xs text-muted-foreground">Data: {chartData.length} points | Max: ₹{maxCost.toLocaleString()}</p></Card>
        </div>
      </TabsContent>

      <TabsContent value="insights" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4"><h3 className="text-sm font-semibold mb-2">Srikalahasti Temple Kalamkari — 3,000 Years of Pen-and-Dye Textile Heritage</h3><p className="text-xs text-muted-foreground">The 3,000-year pen art tradition from Srikalahasti temple town in Andhra Pradesh represents one of India's most revered and ancient textile art forms. Master artisans craft the kalam (pen) from carefully selected tamarind twigs wrapped with absorbent cotton wicks, using exclusively natural dyes extracted from pomegranate rind for yellow, indigo for blue, alum for red, and iron rust for black to create intricate mythological narratives on hand-woven cotton fabric. The temple-style Kalamkari exclusively depicts Ramayana and Mahabharata epics with extraordinary detail, with each large panel requiring several weeks of meticulous freehand painting. This living heritage received the prestigious GI (Geographical Indication) tag recognition from the Government of India, protecting the authentic Srikalahasti pen-kalam technique from commercial imitations and ensuring the continuation of this sacred textile tradition for future generations across India and expanding global export markets.</p></Card>
          <Card className="p-4"><h3 className="text-sm font-semibold mb-2">IS 16798 Hand-Painted Textile Quality Standards for Kalamkari Cotton Art</h3><p className="text-xs text-muted-foreground">Under IS 16798 standards governing hand-painted textile quality for Kalamkari cotton art, the substrate must be pre-washed unbleached cotton fabric maintaining 120-160 thread count per inch, ensuring optimal natural dye absorption and long-term fabric integrity for intricate hand-painted designs. Natural mordant fixation using alum (potassium aluminum sulfate) and myrobalan (terminalia chebula) is strictly mandatory for achieving permanent color bonding with the cotton fibers. Color fastness must achieve Grade 4 or higher per ISO 105-B02 light fastness testing, while wash fastness must reach Grade 3-4 minimum per ISO 105-C06 standardized wash testing protocols. Spectrophotometer measurements require Delta E color difference values below 3.0 for consistent batch-to-batch color reproduction across production runs. Heavy metal compliance follows stringent REACH regulation requirements for international textile safety certification. These rigorous quality assurance standards ensure every certified Kalamkari textile piece meets demanding global benchmarks for premium hand-painted art exports to international markets.</p></Card>
          <Card className="p-4"><h3 className="text-sm font-semibold mb-2">Muslin Cotton Roll Packaging & Moisture-Controlled Transit for Dyed Textile Art</h3><p className="text-xs text-muted-foreground">Kalamkari textile art requires highly specialized packaging protocols with interleaf acid-free tissue paper placed carefully between each fabric layer to prevent dye transfer, chemical migration, and friction damage during handling and transit operations. Finished hand-painted textiles are systematically rolled onto rigid cardboard cores of precisely 5cm diameter, then hermetically sealed in industrial-grade polyethylene moisture barrier wrapping with activated silica gel desiccant packets distributed at 150g per metre of rolled fabric length. Enclosed truck transit maintains strict temperature control between 20-28°C throughout the extensive Andhra Pradesh logistics network connecting production centres. Meanwhile climate-controlled dry storage warehouses maintain relative humidity consistently below 45% to prevent fungal growth, mold formation, and gradual natural dye degradation. This comprehensive multi-layered handling and storage protocol supports the regional logistics network processing over 8,000 individual Kalamkari textile shipments annually from Srikalahasti, Machilipatnam, and Pedana production centres to domestic and international destinations.</p></Card>
          <Card className="p-4"><h3 className="text-sm font-semibold mb-2">AI Natural Dye Pattern Authentication & Kalamkari Global Export Market Growth</h3><p className="text-xs text-muted-foreground">Advanced convolutional neural networks trained on curated datasets of 20,000 authenticated Kalamkari textile samples achieve remarkable 94% accuracy in distinguishing genuine hand-painted pen-kalam textiles from machine-produced block-printed imitations. Sophisticated computer vision algorithms precisely measure pen stroke width variation ranging between 0.2-0.8mm, a distinctive hallmark of authentic kalam (pen) work that mechanical reproduction processes cannot replicate. The Kalamkari export market revenue has demonstrated exceptional growth trajectory, expanding from Rs 12 crore in 2019 to Rs 35 crore in 2025, with ambitious projections targeting Rs 75 crore by 2028 as international collector demand continues to surge across premium textile art segments. Blockchain-based provenance tracking systems for GI-certified Kalamkari pieces now span 25 countries worldwide, providing complete supply chain transparency from the individual artisan workshop to the final collector across the global textile art market, thereby strengthening consumer confidence and supporting fair trade practices for traditional Kalamkari artisan communities.</p></Card>
        </div>
      </TabsContent>

    </Tabs>
  </div>)
}
