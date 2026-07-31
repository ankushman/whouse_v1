import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#1e293b', '#334155', '#475569', '#64748b', '#e2e8f0', '#0f172a', '#020617', '#f1f5f9']
const PRODUCTS = ['Bidriware Hookah Base', 'Silver Inlay Vase', 'Bidriware Spice Box Set', 'Decorative Tray Collection', 'Bidriware Jewelry Casket', 'Silver Flower Vase', 'Bidriware Paan Dan Box', 'Ornamental Bowl Ensemble']
const CRAFTSMEN = ['Bidar City Craft Guild', 'Bidri Artisans Colony', 'Kalaburagi Metal Workers', 'Bidar Heritage Workshop', 'Hyderabad Nizam Bidri Studio', 'Gulbarga Traditional Crafters', 'Yadgir Silver Inlay Art', 'Zaheerabad Bidri Centre']
const STATUSES = ['GI Bidriware Mark', 'IS 16797 Metal Inlay Grade A', 'Velvet-Lined Protective Box', 'Enclosed Truck Transit', 'Dry Storage 22-28C', 'Silver Purity QC']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-slate-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="6" />
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
    id: `BMC-${String(offset + i + 1).padStart(4, '0')}`,
    craftsman: CRAFTSMEN[(offset + i) % CRAFTSMEN.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 500, ((offset + i) * 37) % 500) + 1,
    cost: ri(25000, 450000, ((offset + i) * 13097) % 425000) + 25000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const bidriRecords = [
  { id: 'BMC-0001', craftsman: 'Bidar City Craft Guild', ware: 'Bidriware Hookah Base', status: 'GI Bidriware Mark', qty: 24, cost: 185000, date: '2024-01-15' },
  { id: 'BMC-0002', craftsman: 'Bidri Artisans Colony', ware: 'Silver Inlay Vase', status: 'IS 16797 Metal Inlay Grade A', qty: 18, cost: 95000, date: '2024-01-22' },
  { id: 'BMC-0003', craftsman: 'Kalaburagi Metal Workers', ware: 'Bidriware Spice Box Set', status: 'Velvet-Lined Protective Box', qty: 42, cost: 156000, date: '2024-02-03' },
  { id: 'BMC-0004', craftsman: 'Bidar Heritage Workshop', ware: 'Decorative Tray Collection', status: 'Enclosed Truck Transit', qty: 15, cost: 275000, date: '2024-02-14' },
  { id: 'BMC-0005', craftsman: 'Hyderabad Nizam Bidri Studio', ware: 'Bidriware Jewelry Casket', status: 'Dry Storage 22-28C', qty: 36, cost: 340000, date: '2024-02-28' },
  { id: 'BMC-0006', craftsman: 'Gulbarga Traditional Crafters', ware: 'Silver Flower Vase', status: 'Silver Purity QC', qty: 28, cost: 125000, date: '2024-03-05' },
  { id: 'BMC-0007', craftsman: 'Yadgir Silver Inlay Art', ware: 'Bidriware Paan Dan Box', status: 'GI Bidriware Mark', qty: 20, cost: 210000, date: '2024-03-18' },
  { id: 'BMC-0008', craftsman: 'Zaheerabad Bidri Centre', ware: 'Ornamental Bowl Ensemble', status: 'IS 16797 Metal Inlay Grade A', qty: 32, cost: 175000, date: '2024-03-25' },
  { id: 'BMC-0009', craftsman: 'Bidar City Craft Guild', ware: 'Silver Inlay Vase', status: 'Velvet-Lined Protective Box', qty: 50, cost: 420000, date: '2024-04-02' },
  { id: 'BMC-0010', craftsman: 'Bidri Artisans Colony', ware: 'Bidriware Hookah Base', status: 'Enclosed Truck Transit', qty: 12, cost: 295000, date: '2024-04-10' },
  { id: 'BMC-0011', craftsman: 'Kalaburagi Metal Workers', ware: 'Bidriware Jewelry Casket', status: 'Dry Storage 22-28C', qty: 8, cost: 385000, date: '2024-04-22' },
  { id: 'BMC-0012', craftsman: 'Bidar Heritage Workshop', ware: 'Decorative Tray Collection', status: 'Silver Purity QC', qty: 25, cost: 145000, date: '2024-05-01' },
  { id: 'BMC-0013', craftsman: 'Hyderabad Nizam Bidri Studio', ware: 'Ornamental Bowl Ensemble', status: 'GI Bidriware Mark', qty: 40, cost: 265000, date: '2024-05-15' },
  { id: 'BMC-0014', craftsman: 'Gulbarga Traditional Crafters', ware: 'Bidriware Spice Box Set', status: 'IS 16797 Metal Inlay Grade A', qty: 30, cost: 198000, date: '2024-05-28' },
  { id: 'BMC-0015', craftsman: 'Yadgir Silver Inlay Art', ware: 'Silver Flower Vase', status: 'Velvet-Lined Protective Box', qty: 22, cost: 310000, date: '2024-06-05' },
  { id: 'BMC-0016', craftsman: 'Zaheerabad Bidri Centre', ware: 'Bidriware Paan Dan Box', status: 'Enclosed Truck Transit', qty: 16, cost: 445000, date: '2024-06-18' },
  { id: 'BMC-0017', craftsman: 'Bidar City Craft Guild', ware: 'Bidriware Jewelry Casket', status: 'Dry Storage 22-28C', qty: 10, cost: 395000, date: '2024-06-25' },
  { id: 'BMC-0018', craftsman: 'Bidri Artisans Colony', ware: 'Decorative Tray Collection', status: 'Silver Purity QC', qty: 35, cost: 228000, date: '2024-07-03' },
  { id: 'BMC-0019', craftsman: 'Kalaburagi Metal Workers', ware: 'Ornamental Bowl Ensemble', status: 'GI Bidriware Mark', qty: 45, cost: 162000, date: '2024-07-12' },
  { id: 'BMC-0020', craftsman: 'Bidar Heritage Workshop', ware: 'Silver Inlay Vase', status: 'Velvet-Lined Protective Box', qty: 14, cost: 350000, date: '2024-07-20' },
]

export default function BidriwareMetalCraftKarnatakaLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const allRecords = [...bidriRecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'craftsman', label: 'Craftsman', options: CRAFTSMEN.map(c => ({ value: c, label: c, count: allRecords.filter(r => r.craftsman === c).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(20, 80, allRecords.length * 0.3 + i * 12) }))
  const craftsmanChart = CRAFTSMEN.map(c => ({ name: c.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.craftsman === c).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="bmc-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Bidriware Metal Craft Karnataka' }]} />
      <PageHeader title="Bidriware Metal Craft Karnataka Logistics" description="Comprehensive logistics management for Bidar's 600-year Persian silver inlay Bidriware tradition — zinc-copper alloy casting with silver wire inlay technique, Bidar fort soil oxidization process, GI certification compliance, velvet-lined protective packaging, and dry transit for oxidized metal art export across 22 countries" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Shipments" value={allRecords.length} />
            <KpiTile label="Active Ware" value={PRODUCTS.length} />
            <KpiTile label="Craft Clusters" value={CRAFTSMEN.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="GI Tag" value={98} />
            <HealthRing label="IS 16797" value={94} />
            <HealthRing label="Velvet" value={91} />
            <HealthRing label="Truck" value={86} />
            <HealthRing label="Storage" value={93} />
            <HealthRing label="Silver" value={96} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Craft Clusters" value="10 Centres" />
            <ValueTile label="Annual Production" value="4200 Pieces" />
            <ValueTile label="Export Markets" value="22 Countries" />
            <ValueTile label="Heritage Age" value="600 Years" />
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
            placeholder="Search Bidriware shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Ware</th>
                  <th className="p-3 text-left font-medium">Craftsman</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Qty</th>
                  <th className="p-3 text-left font-medium">Cost</th>
                  <th className="p-3 text-left font-medium">Cost Bar</th>
                  <th className="p-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(record => (
                  <tr key={record.id} className="border-t hover:bg-slate-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.ware} /></td>
                    <td className="p-3">{record.craftsman}</td>
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
              <CardHeader><CardTitle>Craftsman Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={craftsmanChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]}>
                    {craftsmanChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
              <CardHeader><CardTitle>Bidar Bidriware — 600 Years of Persian Silver Inlay Heritage</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Bidriware traces its magnificent origins to the 14th century Bahmani Sultanate when Persian craftsmen brought their sophisticated metal inlay techniques to the ancient city of Bidar in Karnataka. The craft begins with preparing a unique zinc-copper alloy, containing 85-95% zinc and 5-15% copper, which is cast into molds using the lost-wax method to form the base object. Skilled artisans then meticulously engrave intricate Islamic geometric patterns, floral motifs, and calligraphic designs into the metal surface using sharp steel chisels. Pure silver wire is carefully hammered into these engraved grooves, creating stunning contrasting patterns against the dark metal. The signature blackened appearance is achieved through a secret oxidization process using special soil collected exclusively from the grounds of Bidar Fort, which contains unique chemical properties that react with the zinc alloy to produce the deep black patina while leaving the silver inlay brilliantly shining. This UNESCO-eligible craft represents one of India's most sophisticated metalworking traditions, with each piece requiring weeks of painstaking handwork by master craftsmen who inherit their skills through generations of family apprenticeship, preserving techniques virtually unchanged since the medieval period.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IS 16797 Metal Inlay Quality Standards for Bidriware Craft</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">The Bureau of Indian Standards established IS 16797 as the comprehensive quality specification for Bidriware metal inlay craft products, ensuring consistency and authenticity across all production centers in Karnataka. The standard mandates strict alloy composition requirements: the base metal must contain between 85% to 95% zinc with the remainder being copper, creating the characteristic malleable yet durable foundation essential for precise inlay work. Silver inlay purity must meet sterling silver standards at minimum 92.5% purity, with certified assaying required for all export-grade pieces. IS 16797 Grade A certification demands inlay depth uniformity within 0.5mm tolerance across the entire pattern surface, ensuring silver wires sit flush without gaps or protrusions. Surface finish grading evaluates the blackened patina for evenness, the silver inlay for brilliance and smoothness, and the overall polish quality under standardized lighting conditions. Each certified piece bears the IS 16797 hallmark along with the Geographical Indication tag, providing buyers with verifiable proof of authentic Bidar origin and quality assurance standards compliance.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Velvet-Lined Protective Packaging & Dry Transit for Oxidized Metal Art</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Bidriware requires exceptionally careful packaging and controlled logistics due to the delicate nature of both the silver inlay work and the sensitive oxidized black surface finish that defines this ancient craft. Each individual piece is first wrapped in soft anti-tarnish cotton cloth before being placed in a custom-fitted velvet-lined protective box with foam padding that prevents movement during transit. For sets and collections, partitioned presentation boxes with individual velvet compartments ensure pieces cannot scratch or impact each other. Silica gel desiccant packets are included in every package to maintain humidity below 40%, as excess moisture can potentially affect the patina over extended periods. Temperature-controlled logistics maintain a consistent 22-28°C range throughout the supply chain, preventing thermal stress that could cause micro-cracking in the zinc-copper alloy substrate. The Karnataka logistics network utilizes enclosed trucks with air-suspension systems for domestic distribution from Bidar craft workshops to major urban centers including Bengaluru, Mumbai, and Delhi for onward international shipping.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI Silver Inlay Pattern Analysis & Bidriware Global Market Expansion</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Artificial intelligence and computer vision technologies are revolutionizing quality control and market positioning for Bidriware in the global handicraft marketplace. Advanced pattern recognition algorithms can now verify the authenticity and precision of silver inlay designs by analyzing high-resolution photographs against authenticated master pattern databases, detecting deviations as small as 0.1mm in inlay depth or alignment. This technological integration has helped boost export revenue growth significantly, with Bidriware now reaching collectors and markets in twenty-two countries across Europe, North America, the Middle East, and East Asia. E-commerce platforms specializing in artisanal luxury goods have created new direct-to-consumer channels, bypassing traditional wholesale distribution networks that often compressed artisan margins. India's ongoing UNESCO Intangible Cultural Heritage bid for Bidriware has further elevated international visibility, generating increased demand from museum gift shops, interior design firms, and luxury lifestyle brands seeking authentic heritage craftsmanship backed by digital documentation and government artisan certification programs.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
