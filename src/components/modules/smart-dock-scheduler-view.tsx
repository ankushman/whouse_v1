import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#1e40af', '#1e3a8a', '#2563eb', '#3b82f6', '#60a5fa', '#1d4ed8', '#172554', '#eff6ff']
const PRODUCTS = ['Loading Bay Alpha', 'Unloading Bay Bravo', 'Cross Dock Charlie', 'Cold Storage Delta', 'Hazardous Bay Echo', 'Bulk Platform Foxtrot', 'Drive-In Rack Golf', 'Yard Marshalling Hotel']
const ARTISANS = ['Mumbai ICD Warehouse MH', 'Delhi TIS Freight Terminal DL', 'Chennai Container Port TN', 'Kolkata Dock System WB', 'Bangalore Distribution KA', 'Hyderabad Hub TS', 'Pune Sorting Centre MH', 'Ahmedabad Logistics GJ']
const STATUSES = ['Bay Operations Certified', 'Dock Leveler QC Check', 'Appointment Scheduler Active', 'Carrier Allocation Verified', 'Vehicle Turnaround Valid', 'Safety Compliance Audit']

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
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eff6ff" strokeWidth="6" />
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
    id: `SDK-${String(offset + i + 1).padStart(4, '0')}`,
    dock: ARTISANS[(offset + i) % ARTISANS.length], equipment: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(2, 18, ((offset + i) * 19) % 17) + 2,
    cost: ri(8000, 95000, ((offset + i) * 11307) % 87000) + 8000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const dockrecords = [
  { id: 'SDK-0001', dock: 'Mumbai ICD Warehouse MH', equipment: 'Loading Bay Alpha', status: 'Bay Operations Certified', qty: 8, cost: 85000, date: '2024-01-05' },
  { id: 'SDK-0002', dock: 'Delhi TIS Freight Terminal DL', equipment: 'Unloading Bay Bravo', status: 'Dock Leveler QC Check', qty: 6, cost: 72000, date: '2024-01-18' },
  { id: 'SDK-0003', dock: 'Chennai Container Port TN', equipment: 'Cross Dock Charlie', status: 'Appointment Scheduler Active', qty: 10, cost: 56000, date: '2024-01-31' },
  { id: 'SDK-0004', dock: 'Kolkata Dock System WB', equipment: 'Cold Storage Delta', status: 'Carrier Allocation Verified', qty: 4, cost: 92000, date: '2024-02-13' },
  { id: 'SDK-0005', dock: 'Bangalore Distribution KA', equipment: 'Hazardous Bay Echo', status: 'Vehicle Turnaround Valid', qty: 12, cost: 34000, date: '2024-02-26' },
  { id: 'SDK-0006', dock: 'Hyderabad Hub TS', equipment: 'Bulk Platform Foxtrot', status: 'Safety Compliance Audit', qty: 7, cost: 88000, date: '2024-03-10' },
  { id: 'SDK-0007', dock: 'Pune Sorting Centre MH', equipment: 'Drive-In Rack Golf', status: 'Bay Operations Certified', qty: 14, cost: 28000, date: '2024-03-23' },
  { id: 'SDK-0008', dock: 'Ahmedabad Logistics GJ', equipment: 'Yard Marshalling Hotel', status: 'Dock Leveler QC Check', qty: 5, cost: 94000, date: '2024-04-05' },
  { id: 'SDK-0009', dock: 'Mumbai ICD Warehouse MH', equipment: 'Loading Bay Alpha', status: 'Appointment Scheduler Active', qty: 9, cost: 64000, date: '2024-04-18' },
  { id: 'SDK-0010', dock: 'Delhi TIS Freight Terminal DL', equipment: 'Unloading Bay Bravo', status: 'Carrier Allocation Verified', qty: 11, cost: 42000, date: '2024-05-01' },
  { id: 'SDK-0011', dock: 'Chennai Container Port TN', equipment: 'Cross Dock Charlie', status: 'Vehicle Turnaround Valid', qty: 6, cost: 80000, date: '2024-05-14' },
  { id: 'SDK-0012', dock: 'Kolkata Dock System WB', equipment: 'Cold Storage Delta', status: 'Safety Compliance Audit', qty: 13, cost: 30000, date: '2024-05-27' },
  { id: 'SDK-0013', dock: 'Bangalore Distribution KA', equipment: 'Hazardous Bay Echo', status: 'Bay Operations Certified', qty: 4, cost: 90000, date: '2024-06-09' },
  { id: 'SDK-0014', dock: 'Hyderabad Hub TS', equipment: 'Bulk Platform Foxtrot', status: 'Dock Leveler QC Check', qty: 8, cost: 68000, date: '2024-06-22' },
  { id: 'SDK-0015', dock: 'Pune Sorting Centre MH', equipment: 'Drive-In Rack Golf', status: 'Appointment Scheduler Active', qty: 10, cost: 52000, date: '2024-07-05' },
  { id: 'SDK-0016', dock: 'Ahmedabad Logistics GJ', equipment: 'Yard Marshalling Hotel', status: 'Carrier Allocation Verified', qty: 6, cost: 82000, date: '2024-07-18' },
  { id: 'SDK-0017', dock: 'Mumbai ICD Warehouse MH', equipment: 'Loading Bay Alpha', status: 'Vehicle Turnaround Valid', qty: 15, cost: 24000, date: '2024-07-31' },
  { id: 'SDK-0018', dock: 'Delhi TIS Freight Terminal DL', equipment: 'Unloading Bay Bravo', status: 'Safety Compliance Audit', qty: 7, cost: 95000, date: '2024-08-13' },
  { id: 'SDK-0019', dock: 'Chennai Container Port TN', equipment: 'Cross Dock Charlie', status: 'Bay Operations Certified', qty: 9, cost: 60000, date: '2024-08-26' },
  { id: 'SDK-0020', dock: 'Kolkata Dock System WB', equipment: 'Cold Storage Delta', status: 'Dock Leveler QC Check', qty: 11, cost: 38000, date: '2024-09-08' },
]

export default function SmartDockSchedulerView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...dockrecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.equipment.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'equipment', label: 'Equipment', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.equipment === p).length })) },
    { key: 'dock', label: 'Dock', options: ARTISANS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.dock === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(6, 25, allRecords.length * 0.10 + i * 4) }))
  const dockChart = ARTISANS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.dock === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="sds-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Warehouse' }, { label: 'Dock Scheduling' }]} />
      <PageHeader title="Smart Dock Scheduler" description="Indian warehouse dock scheduling and bay management with bay operations certification dock leveler quality control appointment scheduling optimisation carrier allocation verification vehicle turnaround tracking and safety compliance audit across 8 logistics hubs in Mumbai Delhi Chennai Kolkata Bangalore Hyderabad Pune and Ahmedabad" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-blue-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Docks" value={allRecords.length} />
            <KpiTile label="Bay Types" value={PRODUCTS.length} />
            <KpiTile label="Warehouse Hubs" value={ARTISANS.length} />
            <KpiTile label="Avg Throughput" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="Operations" value={91} />
            <HealthRing label="Leveler" value={88} />
            <HealthRing label="Scheduler" value={94} />
            <HealthRing label="Carrier" value={86} />
            <HealthRing label="Turnaround" value={89} />
            <HealthRing label="Safety" value={95} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="Active Bays" value="42 Bays" />
            <ValueTile label="Peak Capacity" value="1,200/hr" />
            <ValueTile label="Avg Wait" value="18 min" />
            <ValueTile label="Utilisation" value="78%" />
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
            placeholder="Search dock scheduling records..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-blue-100">
                <tr>
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Equipment</th>
                  <th className="p-3 text-left font-medium">Dock</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Throughput</th>
                  <th className="p-3 text-left font-medium">Cost</th>
                  <th className="p-3 text-left font-medium">Cost Bar</th>
                  <th className="p-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(record => (
                  <tr key={record.id} className="border-t hover:bg-blue-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.equipment} /></td>
                    <td className="p-3">{record.dock}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} pallets/hr</td>
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
              <CardHeader><CardTitle>Dock Throughput Trend</CardTitle></CardHeader>
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
              <CardHeader><CardTitle>Hub Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={dockChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]}>
                    {dockChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
              <CardHeader><CardTitle>Smart Dock Scheduling — Indian Warehouse Bay Management System</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">Smart dock scheduling represents the application of AI-powered optimisation algorithms and real-time sensor technology to the management of warehouse loading and unloading bay operations across the Indian logistics and supply chain industry where modern Indian warehouses and inland container depots ICDs operated by major logistics operators including the Container Corporation of India CONCOR DP World Adani Ports and Special Economic Zones the National Industrial Corridor Development Corporation and private third-party logistics providers face increasing pressure to maximise dock throughput while minimising vehicle wait times and turnaround delays that cost the Indian logistics industry an estimated twelve thousand crore rupees annually in demurrage charges and delayed shipment penalties where the smart dock scheduling system integrates with existing warehouse management systems WMS and enterprise resource planning ERP platforms to provide real-time visibility into dock bay availability appointment scheduling carrier allocation vehicle turnaround tracking and equipment utilisation across the eight major Indian logistics hub cities of Mumbai with the Nhava Sheva ICD and JNPT port complexes Delhi with the TIS freight terminal and ICD Patparganj Chennai with the Chennai Container Terminal and Kamarajar Port Kolkata with the Syama Prasad Mookerjee Port facilities Bangalore with the Karnataka logistics distribution centre Hyderabad with the FMCG and pharmaceutical distribution hub Pune with the Chakan Talegaon industrial warehousing zone and Ahmedabad with the Gujarat logistics corridor terminal where the scheduling system manages six distinct dock bay types including the loading bay for outbound shipment staging the unloading bay for inbound goods receiving the cross dock for transfer of goods directly from inbound to outbound vehicles without intermediate storage the cold storage dock for temperature-controlled perishable goods handling the hazardous materials bay for chemicals and dangerous goods with safety compliance protocols and the bulk platform for high-volume commodity handling operations each with specialised equipment configurations scheduling requirements and safety protocols.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Bay Operations Certification and Dock Leveler Quality Control Standards</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The bay operations certification and dock leveler quality control standards establish the primary operational quality assurance framework for Indian warehouse dock scheduling systems that ensures safe efficient and compliant dock bay operations across all facility types and cargo categories where the bay operations certification evaluates the operational readiness of each dock bay through a comprehensive twelve-point inspection checklist covering bay floor condition confirming flatness within plus or minus five millimetres across the entire bay surface area dock door functionality confirming automatic or manual doors open and close within specified time limits dock lighting levels confirming minimum three hundred lux illumination across the working zone dock ventilation confirming adequate air exchange rates for enclosed bay areas safety barrier systems confirming bumper guards wheel chocks and dock locks are present and functional floor marking and signage confirming designated pedestrian walkways vehicle approach zones and cargo staging areas are clearly marked and visible emergency equipment confirming fire extinguishers spill containment kits and first aid stations are accessible and within expiry date where the dock leveler quality control test evaluates the mechanical performance and safety compliance of the hydraulic or mechanical dock levelers that bridge the gap between the warehouse dock platform and the delivery vehicle cargo bed where the leveler capacity test verifies the rated load capacity of each dock leveler by subjecting it to the full rated load for sixty seconds confirming the platform deflection remains within the manufacturer specified maximum deflection limit and the hydraulic system maintains stable platform height without drift or settling during the loaded hold period where the leveler operation test measures the cycle time for complete platform extension lip deployment and retraction confirming the full cycle completes within the manufacturer specified time typically eight to twelve seconds for hydraulic units where the lip extension test verifies the lip extends to the full designed length and the lip angle is within the acceptable range for safe vehicle transition.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Appointment Scheduler Optimisation and Carrier Allocation Verification</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The appointment scheduler optimisation and carrier allocation verification protocols manage the advanced booking scheduling and real-time optimisation of dock appointment slots for incoming carrier vehicles ensuring maximum dock utilisation while preventing congestion conflicts and excessive wait times where the appointment scheduling system uses a constraint-based optimisation algorithm that considers dock bay type compatibility with cargo category required equipment availability at each bay skilled labour availability for specialised cargo handling time-window constraints for time-sensitive perishable or pharmaceutical shipments carrier preference and priority tier level historical carrier punctuality performance scores and real-time dock congestion levels across the facility to generate optimised appointment time slots that minimise total vehicle wait time while maximising throughput across all available dock bays where the appointment slot management system provides dynamic slot allocation based on real-time demand patterns adjusting slot duration and bay assignment as conditions change throughout the operating day where the carrier allocation verification protocol confirms that each dock appointment is matched to the correct carrier based on the carrier identification number vehicle registration plate and driver credentials verified against the pre-registered carrier database confirming the carrier has valid insurance documentation current fitness certificate for the vehicle and appropriate dangerous goods handling certification for hazardous material shipments where the allocation verification also confirms the assigned dock bay is compatible with the vehicle type and cargo dimensions ensuring adequate clearance height width and weight capacity at the assigned bay and that all required unloading or loading equipment including forklifts pallet jacks conveyors and specialised handling attachments is available and pre-staged at the assigned dock bay at least fifteen minutes before the scheduled appointment time reducing the vehicle turnaround time by eliminating equipment preparation delays.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Vehicle Turnaround Tracking and Safety Compliance Audit Framework</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The vehicle turnaround tracking and safety compliance audit framework provides the performance measurement and regulatory compliance infrastructure for the Indian warehouse dock scheduling system ensuring all dock operations meet the operational efficiency targets mandated by the facility management and the safety compliance requirements mandated by the Indian Factory Act the Occupational Safety Health and Welfare Act and the Goods and Services Tax GST e-way bill regulations for goods movement documentation where the vehicle turnaround tracking system measures the complete turnaround time for each vehicle from the moment the vehicle arrives at the facility gate and receives a gate pass to the moment the vehicle departs after completing loading or unloading broken down into four measurable time segments including the gate-to-dock travel time measured from gate pass issuance to vehicle arrival at the assigned dock bay the check-in processing time measured from vehicle arrival at the dock to completion of documentation verification and cargo inspection the loading or unloading time measured from the start of cargo operations to completion and the check-out and departure time measured from completion of cargo operations to vehicle departure through the facility gate where the turnaround tracking system calculates real-time turnaround performance metrics including the average turnaround time per dock bay per shift and per carrier the turnaround time distribution histogram showing the spread of individual turnaround times the percentage of vehicles meeting the target turnaround time of forty-five minutes for standard cargo and sixty minutes for temperature-controlled cargo and the demurrage exposure calculation showing the financial risk from vehicles exceeding the maximum allowed turnaround time where the safety compliance audit protocol conducts systematic inspections of dock safety practices including verification that all dock personnel are wearing required personal protective equipment including safety vests hard hats and steel-toed boots confirmation that dock lighting provides adequate illumination for safe cargo handling operations in all operating conditions verification that fire suppression equipment is accessible and functional at each dock bay and confirmation that hazardous material handling procedures including spill containment and emergency shutdown protocols are being followed at hazardous materials dock bays.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



