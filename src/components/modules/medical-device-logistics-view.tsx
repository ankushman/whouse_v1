import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#dc2626', '#ef4444', '#b91c1c', '#f87171', '#fca5a5', '#991b1b', '#7f1d1d', '#fee2e2']
const PRODUCTS = ['Surgical Instruments', 'Diagnostic Imaging', 'Implants and Prosthetics', 'IVD Kits', 'Patient Monitors', 'Ventilators', 'Sterilization Units', 'Lab Equipment']
const MANUFACTURERS = ['TransAsia Biomedicals', 'Trivitron Healthcare', 'BPL Medical', 'Philips India', 'GE Healthcare India', 'Siemens Healthineers', 'Polymed', 'Narang Medical']
const STATUSES = ['CDSCO Approved', 'FDA 510(k)', 'CE Marked', 'Under Review', 'Recalled', 'Pending Certification']

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
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fee2e2" strokeWidth="6" />
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
    id: `MDL-${String(offset + i + 1).padStart(4, '0')}`,
    manufacturer: MANUFACTURERS[(offset + i) % MANUFACTURERS.length], device: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 50, ((offset + i) * 31) % 50) + 1,
    cost: ri(50000, 12000000, ((offset + i) * 17031) % 11950000) + 50000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const medicalrecords = [
  { id: 'MDL-0001', manufacturer: 'TransAsia Biomedicals', device: 'Surgical Instruments', status: 'CDSCO Approved', qty: 200, cost: 3200000, date: '2024-01-15' },
  { id: 'MDL-0002', manufacturer: 'BPL Medical', device: 'Diagnostic Imaging', status: 'CE Marked', qty: 5, cost: 8750000, date: '2024-01-28' },
  { id: 'MDL-0003', manufacturer: 'Narang Medical', device: 'Implants and Prosthetics', status: 'CDSCO Approved', qty: 50, cost: 4500000, date: '2024-02-10' },
  { id: 'MDL-0004', manufacturer: 'TransAsia Biomedicals', device: 'IVD Kits', status: 'CDSCO Approved', qty: 1000, cost: 2500000, date: '2024-02-22' },
  { id: 'MDL-0005', manufacturer: 'Philips India', device: 'Patient Monitors', status: 'FDA 510(k)', qty: 25, cost: 6250000, date: '2024-03-08' },
  { id: 'MDL-0006', manufacturer: 'Trivitron Healthcare', device: 'Ventilators', status: 'CDSCO Approved', qty: 12, cost: 5400000, date: '2024-03-20' },
  { id: 'MDL-0007', manufacturer: 'GE Healthcare India', device: 'Sterilization Units', status: 'CE Marked', qty: 30, cost: 2100000, date: '2024-04-03' },
  { id: 'MDL-0008', manufacturer: 'Siemens Healthineers', device: 'Lab Equipment', status: 'FDA 510(k)', qty: 8, cost: 12000000, date: '2024-04-16' },
  { id: 'MDL-0009', manufacturer: 'Polymed', device: 'Surgical Instruments', status: 'CDSCO Approved', qty: 500, cost: 750000, date: '2024-04-28' },
  { id: 'MDL-0010', manufacturer: 'Philips India', device: 'Diagnostic Imaging', status: 'CE Marked', qty: 15, cost: 3375000, date: '2024-05-10' },
  { id: 'MDL-0011', manufacturer: 'Narang Medical', device: 'Implants and Prosthetics', status: 'Under Review', qty: 80, cost: 6400000, date: '2024-05-23' },
  { id: 'MDL-0012', manufacturer: 'TransAsia Biomedicals', device: 'IVD Kits', status: 'CDSCO Approved', qty: 2000, cost: 600000, date: '2024-06-05' },
  { id: 'MDL-0013', manufacturer: 'BPL Medical', device: 'Patient Monitors', status: 'Pending Certification', qty: 40, cost: 4800000, date: '2024-06-18' },
  { id: 'MDL-0014', manufacturer: 'Trivitron Healthcare', device: 'Ventilators', status: 'Recalled', qty: 6, cost: 1800000, date: '2024-07-01' },
  { id: 'MDL-0015', manufacturer: 'GE Healthcare India', device: 'Sterilization Units', status: 'CDSCO Approved', qty: 10, cost: 4500000, date: '2024-07-14' },
  { id: 'MDL-0016', manufacturer: 'Siemens Healthineers', device: 'Lab Equipment', status: 'FDA 510(k)', qty: 4, cost: 9800000, date: '2024-07-26' },
  { id: 'MDL-0017', manufacturer: 'Polymed', device: 'Surgical Instruments', status: 'CDSCO Approved', qty: 300, cost: 1200000, date: '2024-08-08' },
  { id: 'MDL-0018', manufacturer: 'Philips India', device: 'Diagnostic Imaging', status: 'CE Marked', qty: 10, cost: 7600000, date: '2024-08-20' },
  { id: 'MDL-0019', manufacturer: 'Narang Medical', device: 'Implants and Prosthetics', status: 'CDSCO Approved', qty: 60, cost: 5200000, date: '2024-09-02' },
  { id: 'MDL-0020', manufacturer: 'TransAsia Biomedicals', device: 'IVD Kits', status: 'Under Review', qty: 1500, cost: 1800000, date: '2024-09-14' },
]

export default function MedicalDeviceLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...medicalrecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.device.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'device', label: 'Device', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.device === p).length })) },
    { key: 'manufacturer', label: 'Manufacturer', options: MANUFACTURERS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.manufacturer === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(4, 20, allRecords.length * 0.10 + i * 3) }))
  const mfgChart = MANUFACTURERS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.manufacturer === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="mdl-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'Medical Devices' }]} />
      <PageHeader title="Medical Device Logistics" description="Indian medical device supply chain with CDSCO SUGAM portal integration FDA 510(k) and CE Mark certification tracking sterilization validation IVD kit cold chain management and UDI blockchain traceability across 8 leading Indian medical device manufacturers and distribution facilities" />
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
            <KpiTile label="Device Categories" value={PRODUCTS.length} />
            <KpiTile label="Manufacturers" value={MANUFACTURERS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="CDSCO" value={95} />
            <HealthRing label="FDA" value={88} />
            <HealthRing label="CE" value={91} />
            <HealthRing label="Review" value={76} />
            <HealthRing label="Sterile" value={93} />
            <HealthRing label="UDI" value={89} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="CDSCO Licenses" value="222 Active" />
            <ValueTile label="Market Size" value="INR 85K Cr" />
            <ValueTile label="Facilities" value="24 DCs" />
            <ValueTile label="Compliance Rate" value="99.6%" />
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
            placeholder="Search medical device shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-red-100">
                <tr>
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Device</th>
                  <th className="p-3 text-left font-medium">Manufacturer</th>
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
                    <td className="p-3"><ProductBadge name={record.device} /></td>
                    <td className="p-3">{record.manufacturer}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['units', 'sets', 'kits', 'pcs'][parseInt(record.id.slice(4)) % 4]}</td>
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
              <CardHeader><CardTitle>Manufacturer Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={mfgChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]}>
                    {mfgChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader><CardTitle>Regulation Status Distribution</CardTitle></CardHeader>
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
              <CardHeader><CardTitle>CDSCO SUGAM Digital Portal Integration and Regulatory Compliance</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The CDSCO SUGAM digital portal integration framework establishes the primary regulatory compliance management system for Indian medical device logistics tracking all device registrations import licenses manufacturing licences and clinical trial approvals through the Central Drugs Standard Control Organisation online regulatory platform where the SUGAM portal integration automates the submission and tracking of MD-3 import licence applications MD-4 manufacturing licence renewals MD-5 clinical investigation approvals and MD-7 MD-8 MD-9 form submissions reducing compliance processing time by seventy-two percent compared to the previous manual paper-based regulatory filing workflow where the integration monitors all two hundred twenty-two active device licences across the logistics network generating automated ninety-day pre-expiry alerts for licence renewal preventing regulatory non-compliance and supply chain disruption caused by lapsed licences where the SUGAM portal API integration provides real-time visibility into CDSCO application status including pending applications under review applications approved applications and rejected applications enabling proactive licence management and timely resubmission of deficient applications where the regulatory intelligence dashboard tracks all CDSCO circulars gazette notifications and Medical Devices Rules 2017 amendments ensuring the logistics operation maintains continuous awareness of evolving regulatory requirements and implements necessary process changes within the mandated compliance timelines where the zero regulatory non-compliance incidents achieved in financial year twenty twenty-six across all tracked medical device shipments demonstrates the effectiveness of the automated CDSCO SUGAM integration framework in maintaining full regulatory compliance for the Indian medical device supply chain.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>IoT-Enabled Sterility Monitoring and Refrigerator Cold Chain Validation</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The IoT-enabled sterility monitoring and Refrigerator cold chain validation system provides real-time environmental quality assurance for temperature-sensitive medical device storage and transportation across the Indian logistics network where the sterility monitoring subsystem tracks biological indicator BI and chemical indicator CI results for over three hundred fifty sterilization cycles per month across four distribution centres recording autoclave class B cycle parameters including temperature pressure and exposure duration for each cycle confirming all parameters remain within the validated sterilization range of one hundred thirty-four degrees Celsius at two point one bar for four minutes minimum exposure where the IoT sensor network deploys calibrated temperature and humidity sensors at fifteen-second intervals throughout sterile storage zones cold rooms and quarantine areas with automated quarantine triggers activating when any sensor reading exceeds the validated storage temperature range of two to eight degrees Celsius for IVD kits and vaccines twenty to twenty-five degrees Celsius for surgical instruments and minus twenty to minus ten degrees Celsius for temperature-sensitive implants where the Refrigerator cold chain validation subsystem monitors transport refrigeration unit performance during medical device shipment from manufacturer to distribution centre to hospital recording continuous temperature profiles using GPS-enabled data loggers that transmit real-time location and temperature data to the central monitoring dashboard ensuring that all cold chain shipments maintain validated temperature ranges throughout the entire transit journey where the automated quarantine management system isolates any medical device batch that has experienced a temperature excursion during storage or transit preventing release of potentially compromised sterile or temperature-sensitive medical devices until a formal deviation investigation and revalidation assessment confirms product quality has not been affected by the temperature excursion event.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Ayushman Bharat Device Pool and PMJAY Hospital Network Allocation</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The Ayushman Bharat medical device pool management system provides dedicated device inventory allocation and logistics support for the Pradhan Mantri Jan Arogya Yojana PMJAY empanelled hospital network which covers over one thousand five hundred Tier-2 and Tier-3 government and private hospitals across India serving the bottom forty percent of the Indian population through the world's largest government-funded health insurance programme covering over five hundred million beneficiary families where the dedicated device pool maintains priority stock reserves of critical care medical devices including mechanical ventilators multipara patient monitors defibrillators pulse oximeters surgical instrument sets and diagnostic imaging equipment specifically allocated for PMJAY hospital supply ensuring uninterrupted availability of life-saving medical devices at empanelled hospitals regardless of general market supply fluctuations or seasonal demand surges where the dynamic reallocation engine uses real-time ICU bed occupancy data from the National Health System NHS dashboard to predict device demand by hospital and region enabling proactive redistribution of critical care devices from low-utilisation facilities to high-demand areas reducing average device delivery time from forty-eight hours to twelve hours for emergency PMJAY hospital requests where the system tracks device utilisation rates and replacement schedules across the entire PMJAY hospital network generating automated procurement recommendations based on predicted device lifecycle completion dates and projected demand growth ensuring the PMJAY device pool maintains optimal inventory levels without overstocking or stockout situations across the geographically diverse hospital network spanning all thirty-six states and union territories of India.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Blockchain UDI Track-and-Trace and Medical Device Recall Management</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The blockchain-based Unique Device Identification UDI track-and-trace system provides immutable end-to-end supply chain visibility for all tracked medical devices from manufacturer through distributor to hospital through to patient administration recording every device movement custody transfer and quality event on a permissioned blockchain ledger where each medical device carries a unique UDI code compliant with the CDSCO UDI framework and international IMDRF UDI standards that is scanned and recorded at eight mandatory checkpoints including manufacturer dispatch warehouse receiving quality inspection staging distribution centre dispatch hospital receiving hospital pharmacy dispensing clinical department administration and patient administration where the blockchain ledger records the device identifier product identifier lot batch number serial number manufacture date and expiry date at each checkpoint creating an unalterable chain of custody that enables three-second recall traceability across the entire supply chain allowing immediate identification of all affected devices and their current locations during a medical device recall event where the recall management subsystem automates the Class-1 Class-2 and Class-3 recall execution process issuing automated hold-and-return notifications to all downstream recipients of affected devices tracking recall response rates and confirmation of device return or destruction and generating compliance reports for CDSCO recall submission within the mandatory twenty-four-hour notification timeline where the pilot programme involving five Indian medical device manufacturers and twelve empanelled hospitals has demonstrated one hundred percent UDI tracking accuracy across over fifty thousand tracked device movements since programme inception confirming the scalability and reliability of the blockchain-based UDI track-and-trace system for pan-India medical device supply chain management.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



