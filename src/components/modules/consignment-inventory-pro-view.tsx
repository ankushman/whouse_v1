import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#059669', '#047857', '#065f46', '#10b981', '#34d399', '#064e3b', '#022c22', '#d1fae5']
const PRODUCTS = ['FIFO Lot Inventory', 'LIFO Batch Stock', 'FEFO Perishable Lot', 'Serial Tracked Unit', 'Consignment Owner Stock', 'Cross-Docked Shipment', 'Safety Reserve Buffer', 'Seasonal Demand Buffer']
const ARTISANS = ['Mumbai Central WH MH', 'Delhi NCR Hub DL', 'Bangalore South DC KA', 'Chennai East Port TN', 'Hyderabad West DC TS', 'Pune MIDC Warehouse MH', 'Kolkata North WB', 'Ahmedabad GIDC GJ']
const STATUSES = ['Inventory Certified', 'Stock Accuracy QC Check', 'Lot Traceability Test', 'Expiry Monitoring Verified', 'Bin Location Audit', 'Consignment Owner Agreement Verified']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-emerald-200 rounded-full overflow-hidden"><div className="h-full bg-emerald-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#d1fae5" strokeWidth="6" />
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
    id: `CIP-${String(offset + i + 1).padStart(4, '0')}`,
    warehouse: ARTISANS[(offset + i) % ARTISANS.length], lot: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 6, ((offset + i) * 19) % 6) + 1,
    cost: ri(10000, 500000, ((offset + i) * 11307) % 490000) + 10000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const ciprecords = [
  { id: 'CIP-0001', warehouse: 'Mumbai Central WH MH', lot: 'FIFO Lot Inventory', status: 'Inventory Certified', qty: 4, cost: 480000, date: '2024-01-12' },
  { id: 'CIP-0002', warehouse: 'Delhi NCR Hub DL', lot: 'LIFO Batch Stock', status: 'Stock Accuracy QC Check', qty: 3, cost: 320000, date: '2024-01-25' },
  { id: 'CIP-0003', warehouse: 'Bangalore South DC KA', lot: 'FEFO Perishable Lot', status: 'Lot Traceability Test', qty: 5, cost: 85000, date: '2024-02-07' },
  { id: 'CIP-0004', warehouse: 'Chennai East Port TN', lot: 'Serial Tracked Unit', status: 'Expiry Monitoring Verified', qty: 2, cost: 500000, date: '2024-02-20' },
  { id: 'CIP-0005', warehouse: 'Hyderabad West DC TS', lot: 'Consignment Owner Stock', status: 'Bin Location Audit', qty: 6, cost: 45000, date: '2024-03-05' },
  { id: 'CIP-0006', warehouse: 'Pune MIDC Warehouse MH', lot: 'Cross-Docked Shipment', status: 'Consignment Owner Agreement Verified', qty: 4, cost: 260000, date: '2024-03-18' },
  { id: 'CIP-0007', warehouse: 'Kolkata North WB', lot: 'Safety Reserve Buffer', status: 'Inventory Certified', qty: 3, cost: 420000, date: '2024-03-31' },
  { id: 'CIP-0008', warehouse: 'Ahmedabad GIDC GJ', lot: 'Seasonal Demand Buffer', status: 'Stock Accuracy QC Check', qty: 5, cost: 95000, date: '2024-04-13' },
  { id: 'CIP-0009', warehouse: 'Mumbai Central WH MH', lot: 'FIFO Lot Inventory', status: 'Lot Traceability Test', qty: 2, cost: 460000, date: '2024-04-26' },
  { id: 'CIP-0010', warehouse: 'Delhi NCR Hub DL', lot: 'LIFO Batch Stock', status: 'Expiry Monitoring Verified', qty: 4, cost: 180000, date: '2024-05-09' },
  { id: 'CIP-0011', warehouse: 'Bangalore South DC KA', lot: 'FEFO Perishable Lot', status: 'Bin Location Audit', qty: 6, cost: 55000, date: '2024-05-22' },
  { id: 'CIP-0012', warehouse: 'Chennai East Port TN', lot: 'Serial Tracked Unit', status: 'Consignment Owner Agreement Verified', qty: 3, cost: 390000, date: '2024-06-04' },
  { id: 'CIP-0013', warehouse: 'Hyderabad West DC TS', lot: 'Consignment Owner Stock', status: 'Inventory Certified', qty: 4, cost: 220000, date: '2024-06-17' },
  { id: 'CIP-0014', warehouse: 'Pune MIDC Warehouse MH', lot: 'Cross-Docked Shipment', status: 'Stock Accuracy QC Check', qty: 2, cost: 475000, date: '2024-06-30' },
  { id: 'CIP-0015', warehouse: 'Kolkata North WB', lot: 'Safety Reserve Buffer', status: 'Lot Traceability Test', qty: 5, cost: 70000, date: '2024-07-13' },
  { id: 'CIP-0016', warehouse: 'Ahmedabad GIDC GJ', lot: 'Seasonal Demand Buffer', status: 'Expiry Monitoring Verified', qty: 3, cost: 350000, date: '2024-07-26' },
  { id: 'CIP-0017', warehouse: 'Mumbai Central WH MH', lot: 'FIFO Lot Inventory', status: 'Bin Location Audit', qty: 4, cost: 240000, date: '2024-08-08' },
  { id: 'CIP-0018', warehouse: 'Delhi NCR Hub DL', lot: 'LIFO Batch Stock', status: 'Consignment Owner Agreement Verified', qty: 6, cost: 60000, date: '2024-08-21' },
  { id: 'CIP-0019', warehouse: 'Bangalore South DC KA', lot: 'FEFO Perishable Lot', status: 'Inventory Certified', qty: 2, cost: 490000, date: '2024-09-03' },
  { id: 'CIP-0020', warehouse: 'Chennai East Port TN', lot: 'Serial Tracked Unit', status: 'Stock Accuracy QC Check', qty: 3, cost: 310000, date: '2024-09-16' },
]

export default function ConsignmentInventoryProView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...ciprecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.lot.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'lot', label: 'Lot Type', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.lot === p).length })) },
    { key: 'warehouse', label: 'Warehouse', options: ARTISANS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.warehouse === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(2, 12, allRecords.length * 0.10 + i * 2) }))
  const warehouseChart = ARTISANS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.warehouse === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="cip-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Inventory' }]} />
      <PageHeader title="Consignment Inventory Pro" description="Consignment inventory management with inventory certification stock accuracy QC checking lot traceability testing expiry monitoring verification bin location auditing and consignment owner agreement verification across 8 Indian warehouse hubs in Mumbai Delhi Bangalore Chennai Hyderabad Pune Kolkata and Ahmedabad" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-emerald-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Lots" value={allRecords.length} />
            <KpiTile label="Lot Types" value={PRODUCTS.length} />
            <KpiTile label="Active Warehouses" value={ARTISANS.length} />
            <KpiTile label="Avg Value" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`}/>
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="Accuracy" value={96} />
            <HealthRing label="Trace" value={93} />
            <HealthRing label="Expiry" value={91} />
            <HealthRing label="Bin Loc" value={88} />
            <HealthRing label="Owner" value={95} />
            <HealthRing label="Util" value={82} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="FIFO Lots" value="2,400 Active" />
            <ValueTile label="Turn Rate" value="8.2x/Year" />
            <ValueTile label="Shrinkage" value="0.34%" />
            <ValueTile label="SKUs Managed" value="18,500" />
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
            placeholder="Search consignment inventory lots..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-emerald-100">
                <tr>
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Lot Type</th>
                  <th className="p-3 text-left font-medium">Warehouse</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Qty</th>
                  <th className="p-3 text-left font-medium">Value</th>
                  <th className="p-3 text-left font-medium">Value Bar</th>
                  <th className="p-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(record => (
                  <tr key={record.id} className="border-t hover:bg-emerald-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.lot} /></td>
                    <td className="p-3">{record.warehouse}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['lots', 'batches', 'units', 'pallets'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Lot Movement Trend</CardTitle></CardHeader>
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
              <CardHeader><CardTitle>Warehouse Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={warehouseChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]}>
                    {warehouseChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
              <CardHeader><CardTitle>Consignment Inventory Pro — Multi-Warehouse Stock Management Framework</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The Consignment Inventory Pro system provides a comprehensive multi-warehouse stock management framework for the Indian logistics network operating across eight regional distribution centres in Mumbai Delhi Bangalore Chennai Hyderabad Pune Kolkata and Ahmedabad managing over eighteen thousand individual SKUs across seven distinct inventory lot types including FIFO first-in-first-out lot inventory for standard consumer goods with shelf life considerations LIFO last-in-first-out batch stock for bulk commodity materials with price fluctuation exposure FEFO first-expired-first-out perishable lot inventory for temperature-sensitive and date-coded products including pharmaceuticals food and beverage items and cosmetics serial tracked unit inventory for high-value individual items including electronics jewellery and luxury goods requiring unique item-level identification and full lifecycle traceability consignment owner stock for third-party inventory held at warehouse facilities under consignment agreement terms where the inventory ownership remains with the supplier until the goods are sold or consumed by the consignee cross-docked shipment inventory for goods that arrive at the warehouse and are immediately transferred to outbound transport without intermediate storage reducing warehouse handling costs and accelerating delivery timelines safety reserve buffer inventory for maintaining minimum stock levels to prevent stockout conditions during demand spikes or supply chain disruptions and seasonal demand buffer inventory for pre-positioned stock accumulation ahead of predictable seasonal demand peaks including Diwali festival period monsoon emergency supply readiness and financial year-end procurement cycles where the system maintains real-time stock visibility across all eight warehouses through the centralised warehouse management platform with automated lot tracking expiry monitoring and stock accuracy verification ensuring the total network inventory visibility supports the procurement planning and demand forecasting operations across the full Indian logistics network.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Stock Accuracy QC and Lot Traceability Testing Standards</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The stock accuracy quality control and lot traceability testing protocols establish the inventory accuracy verification framework for the Consignment Inventory Pro system ensuring that the recorded stock levels in the warehouse management system accurately reflect the physical stock positions across all eight warehouse facilities where the stock accuracy QC check employs a three-tier verification methodology comprising the system-to-physical count reconciliation that compares the system-recorded stock quantities against the physical count results from cycle counting operations confirming the stock accuracy rate meets the minimum standard of ninety-eight percent accuracy at the SKU level and ninety-five percent accuracy at the individual item level the variance analysis that identifies and classifies stock discrepancies into four categories being receiving variances caused by supplier short-ship or over-ship conditions putaway variances caused by incorrect bin location assignment during warehouse intake operations picking variances caused by incorrect item selection during order fulfilment operations and shrinkage variances caused by unaccounted stock losses from theft damage or administrative error and the root cause investigation that analyses the variance patterns to identify systematic process failures and implement corrective actions where the lot traceability test evaluates the completeness and accuracy of the lot tracking records for each inventory lot confirming that every lot movement from receiving through putaway picking packing and shipping is recorded with the lot number quantity timestamp operator identification and warehouse location enabling full forward and backward traceability from the point of sale back to the original supplier shipment and from the original supplier shipment forward to the final consumer delivery point where the lot traceability test uses a standard sample trace methodology selecting twenty random lots from each warehouse facility and tracing each lot through the complete chain of custody verifying that every movement event is recorded within the warehouse management system with complete and accurate data fields confirming the lot traceability completeness rate exceeds ninety-nine percent across the entire network.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Expiry Monitoring and Bin Location Audit Verification</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The expiry monitoring verification and bin location audit protocols provide the product safety assurance and warehouse spatial accuracy frameworks for the Consignment Inventory Pro system where the expiry monitoring system tracks the remaining shelf life of all date-sensitive inventory items across the eight warehouse facilities using the FEFO first-expired-first-out lot rotation methodology that prioritises the picking and shipment of items approaching their expiration dates ensuring minimum product waste from expiry-related disposal where the expiry monitoring test verifies the accuracy of the system-recorded expiry dates against the physical product labelling and packaging date stamps using a standard sample of fifty items per warehouse per month confirming the expiry date accuracy rate exceeds ninety-nine point five percent where the test also evaluates the effectiveness of the automated expiry alert system confirming that alerts are generated at the specified trigger points of ninety days sixty days thirty days and seven days before expiration and that the alert recipients acknowledge and action the alerts within the specified response time of twenty-four hours for the ninety-day and sixty-day alerts four hours for the thirty-day alert and one hour for the seven-day critical alert where the bin location audit verifies the accuracy of the recorded bin location assignments in the warehouse management system against the actual physical locations of inventory items using the standard bin accuracy sampling methodology where a random sample of two hundred bin locations per warehouse facility is physically checked to confirm the system-recorded contents match the actual physical contents of each bin location confirming the bin location accuracy rate exceeds ninety-seven percent across all warehouse facilities where the bin location audit also evaluates the physical condition and labelling quality of each bin location confirming that all bin locations have legible and accurate location labels that all bins are maintained within the specified weight and volume capacity limits and that all bins containing hazardous or regulated materials display the required safety labelling and segregation compliance markers.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Consignment Owner Agreement and Network Expansion Planning</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The consignment owner agreement verification and network expansion planning framework provides the contractual compliance assurance and strategic growth infrastructure for the Consignment Inventory Pro system ensuring that all third-party consignment inventory arrangements comply with the specified agreement terms regarding stock ownership transfer conditions liability allocation insurance requirements and payment settlement timelines while planning the expansion of the warehouse network to support the projected twenty-eight percent annual growth in e-commerce fulfilment volume across the Indian logistics market where the consignment owner agreement verification evaluates the compliance of each consignment stock arrangement against the standard agreement template covering the stock ownership terms confirming the consignment stock remains the property of the supplier until the stock is either sold to the end consumer or explicitly purchased by the consignee at the agreed transfer price the liability terms confirming the insurance coverage for consignment stock meets the minimum coverage level of one hundred ten percent of the declared consignment stock value with named perils including fire flood theft and transit damage the payment settlement terms confirming the consignee remits payment to the supplier within the agreed settlement period of fifteen days from the date of sale with automatic deduction of the agreed consignment fee of eight to twelve percent of the sale price and the stock return terms confirming the conditions under which unsold consignment stock may be returned to the supplier including the minimum consignment period of ninety days the return notification period of thirty days and the return logistics cost allocation between supplier and consignee where the network expansion initiative under the warehouse modernisation programme plans to establish four additional consignment-capable warehouse facilities at Jaipur Lucknow Kochi and Indore by the end of the current fiscal year increasing the total network capacity from eight to twelve facilities with projected combined inventory capacity of twenty-four thousand pallet positions supporting the target stock accuracy rate of ninety-nine percent across the expanded network.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



