'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { CircuitBoard } from 'lucide-react'

interface CarbonBrushRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  brushGrade: string
  application: string
  currentDensityAcM2: number
  brushLifeHours: number
  investmentCr: number
  status: string
  priority: string
  origin: string
  destination: string
  shipDate: string
  transitDays: number
  zone: string
  remarks: string
}

const carbonBrushRecords: CarbonBrushRecord[] = [
  { id: 'CBL-0001', batchNo: 'CBL-B2401', city: 'Bengaluru', manufacturer: 'Morgan Advanced Materials', brushGrade: 'EG-214D Electrographitic', application: 'Traction Motor (BHEL Bhopal)', currentDensityAcM2: 12, brushLifeHours: 8000, investmentCr: 185, status: 'Delivered', priority: 'Critical', origin: 'Morgan Bengaluru (KA)', destination: 'BHEL Bhopal (MP)', shipDate: '2026-07-18', transitDays: 2, zone: 'South', remarks: 'EG-214D electrographitic brush for BHEL 6300kW WAG-9 locomotive traction motor &#8594; 12 A/cm2 current density rated &#8594; 8,000 hrs brush life at 120km/h &#8594; &#8377;185Cr for 25,000 brush sets &#8594; Indian Railways 9,000 locomotive fleet &#8594; 4 brushes per motor 3 motors per loco = 12 brushes/loco &#8594; India &#8377;8,500Cr carbon brush market &#8594; Annual replacement 1.08 crore brushes' },
  { id: 'CBL-0002', batchNo: 'CBL-B2402', city: 'Hyderabad', manufacturer: 'Helwig Carbon Products', brushGrade: 'CM-5 Metal-Graphite', application: 'EV Motor Controller (Mahindra)', currentDensityAcM2: 25, brushLifeHours: 5000, investmentCr: 142, status: 'Delivered', priority: 'High', origin: 'Helwig Hyderabad (TG)', destination: 'Mahindra EV Hyderabad (TG)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'CM-5 metal-graphite brush for Mahindra XUV400 DC commutator motor &#8594; 25 A/cm2 high current density &#8594; 5,000 hrs life at 60V motor &#8594; &#8377;142Cr for 15,000 brush pairs &#8594; India 5 million EV target 2030 &#8594; 2 brushes per DC motor &#8594; India &#8377;3,200Cr EV brush market &#8594; Mahindra 400,000 annual EV capacity' },
  { id: 'CBL-0003', batchNo: 'CBL-B2403', city: 'Mumbai', manufacturer: 'Schunk Carbon Technology', brushGrade: 'SA-45 Resin-Bonded', application: 'Wind Turbine Generator (Suzlon)', currentDensityAcM2: 10, brushLifeHours: 12000, investmentCr: 168, status: 'Delivered', priority: 'High', origin: 'Schunk Mumbai (MH)', destination: 'Suzlon Energy Pune (MH)', shipDate: '2026-07-15', transitDays: 2, zone: 'West', remarks: 'SA-45 resin-bonded brush for Suzlon S-120 wind turbine ring generator &#8594; 10 A/cm2 slip ring brush &#8594; 12,000 hrs life at 1,500 RPM &#8594; &#8377;168Cr for 8,000 brushes &#8594; India 65 GW wind installed capacity &#8594; 2 brushes per slip ring &#8594; India &#8377;4,100Cr wind brush market &#8594; Suzlon 4,000 turbine fleet' },
  { id: 'CBL-0004', batchNo: 'CBL-B2404', city: 'Pune', manufacturer: 'Nippon Carbon India', brushGrade: 'EG-375 Natural Graphite', application: 'Industrial Alternator (Cummins)', currentDensityAcM2: 15, brushLifeHours: 6000, investmentCr: 95, status: 'Delayed', priority: 'Medium', origin: 'Nippon Pune (MH)', destination: 'Cummins India Pune (MH)', shipDate: '2026-07-22', transitDays: 10, zone: 'West', remarks: 'EG-375 natural graphite brush for Cummins 500kVA diesel alternator &#8594; 15 A/cm2 brush density &#8594; 6,000 hrs life at 1,500 RPM &#8594; &#8377;95Cr for 12,000 brushes &#8594; India 200 GW diesel genset installed &#8594; 10d delay due to graphite import from China &#8594; India &#8377;2,800Cr genset brush market &#8594; Cummins 35% genset market share' },
  { id: 'CBL-0005', batchNo: 'CBL-B2405', city: 'Chennai', manufacturer: 'Carbon brushes India', brushGrade: 'DC-8 Dark Electrographitic', application: 'Steel Mill Motor (SAIL)', currentDensityAcM2: 18, brushLifeHours: 4000, investmentCr: 128, status: 'Delivered', priority: 'Critical', origin: 'CBI Chennai (TN)', destination: 'SAIL Salem (TN)', shipDate: '2026-07-19', transitDays: 1, zone: 'South', remarks: 'DC-8 dark electrographitic for SAIL 2,500kW reversing mill motor &#8594; 18 A/cm2 heavy-duty rating &#8594; 4,000 hrs life under vibration &#8594; &#8377;128Cr for 6,000 brushes &#8594; India 140 MT steel annual capacity &#8594; 8 brushes per reversing mill motor &#8594; India &#8377;5,500Cr steel mill brush market &#8594; SAIL 5 integrated steel plants' },
  { id: 'CBL-0006', batchNo: 'CBL-B2406', city: 'Noida', manufacturer: 'Hindustan Carbon Ltd', brushGrade: 'CM-2 Copper-Graphite', application: 'Elevator Motor (KONE India)', currentDensityAcM2: 22, brushLifeHours: 7000, investmentCr: 62, status: 'Delivered', priority: 'Medium', origin: 'HCL Noida (UP)', destination: 'KONE Noida (UP)', shipDate: '2026-07-16', transitDays: 1, zone: 'North', remarks: 'CM-2 copper-graphite brush for KONE MonoSpace gearless elevator motor &#8594; 22 A/cm2 brush density &#8594; 7,000 hrs life 24/7 operation &#8594; &#8377;62Cr for 4,000 brushes &#8594; India 800,000 elevator installed base &#8594; 2 brushes per traction motor &#8594; India &#8377;1,500Cr elevator brush market &#8594; KONE 25% India elevator market' },
  { id: 'CBL-0007', batchNo: 'CBL-B2407', city: 'Kolkata', manufacturer: 'Bengal Carbon Products', brushGrade: 'EG-345F Electrographitic', application: 'Textile Spinning Motor (LMW)', currentDensityAcM2: 8, brushLifeHours: 10000, investmentCr: 48, status: 'Delivered', priority: 'Medium', origin: 'BCP Kolkata (WB)', destination: 'LMW Coimbatore (TN)', shipDate: '2026-07-21', transitDays: 3, zone: 'East', remarks: 'EG-345F electrographitic for LMW ring frame spinning motor &#8594; 8 A/cm2 low current density &#8594; 10,000 hrs continuous running &#8594; &#8377;48Cr for 8,000 brushes &#8594; India 50 million spindles installed &#8594; 4 brushes per ring frame motor &#8594; India &#8377;1,200Cr textile brush market &#8594; Textile sector 4% GDP contribution' },
  { id: 'CBL-0008', batchNo: 'CBL-B2408', city: 'Ahmedabad', manufacturer: 'Gujarat Carbon Industries', brushGrade: 'SA-32 Resin-Bonded', application: 'Cement Kiln Motor (UltraTech)', currentDensityAcM2: 14, brushLifeHours: 5000, investmentCr: 85, status: 'Delivered', priority: 'High', origin: 'GCI Ahmedabad (GJ)', destination: 'UltraTech Cement Ahmedabad (GJ)', shipDate: '2026-07-17', transitDays: 1, zone: 'West', remarks: 'SA-32 resin-bonded for UltraTech 1,000kW cement kiln drive &#8594; 14 A/cm2 rated &#8594; 5,000 hrs dusty environment &#8594; &#8377;85Cr for 5,000 brushes &#8594; India 600 MT cement capacity &#8594; 4 brushes per kiln drive motor &#8594; India &#8377;2,200Cr cement brush market &#8594; UltraTech 140 MT annual capacity' },
  { id: 'CBL-0009', batchNo: 'CBL-B2409', city: 'Jaipur', manufacturer: 'Rajasthan Carbon Works', brushGrade: 'CM-8 Metal-Graphite', application: 'Mining Winder Motor (Hindustan Zinc)', currentDensityAcM2: 20, brushLifeHours: 4500, investmentCr: 55, status: 'Delivered', priority: 'High', origin: 'RCW Jaipur (RJ)', destination: 'HZL Rampura Agucha (RJ)', shipDate: '2026-07-23', transitDays: 1, zone: 'North', remarks: 'CM-8 metal-graphite for HZL underground mine winder motor &#8594; 20 A/cm2 high-torque brush &#8594; 4,500 hrs life underground &#8594; &#8377;55Cr for 3,000 brushes &#8594; India 400 underground mines &#8594; 6 brushes per winder motor &#8594; India &#8377;1,800Cr mining brush market &#8594; HZL world&apos;s largest zinc mine' },
  { id: 'CBL-0010', batchNo: 'CBL-B2410', city: 'Coimbatore', manufacturer: 'Coimbatore Carbon Industries', brushGrade: 'EG-214 Electrographitic', application: 'Pump Set Motor (Crompton)', currentDensityAcM2: 11, brushLifeHours: 9000, investmentCr: 38, status: 'Delivered', priority: 'Medium', origin: 'CCI Coimbatore (TN)', destination: 'Crompton Greaves Coimbatore (TN)', shipDate: '2026-07-14', transitDays: 1, zone: 'South', remarks: 'EG-214 electrographitic for Crompton 7.5kW agricultural pump motor &#8594; 11 A/cm2 standard duty &#8594; 9,000 hrs life monsoon seasonal &#8594; &#8377;38Cr for 20,000 brushes &#8594; India 30 million agricultural pumps &#8594; 2 brushes per pump motor &#8594; India &#8377;900Cr pump brush market &#8594; CG 25% pumpset market share' },
  { id: 'CBL-0011', batchNo: 'CBL-B2411', city: 'Bhubaneswar', manufacturer: 'Odisha Carbon Industries', brushGrade: 'DC-7 Dark Carbon', application: 'Port Crane Motor (Adani Ports)', currentDensityAcM2: 16, brushLifeHours: 6000, investmentCr: 92, status: 'Delivered', priority: 'High', origin: 'OCI Bhubaneswar (OD)', destination: 'Adani Ports Paradip (OD)', shipDate: '2026-07-25', transitDays: 1, zone: 'East', remarks: 'DC-7 dark carbon for Adani 50-tonne quay crane DC motor &#8594; 16 A/cm2 heavy-duty &#8594; 6,000 hrs salt-air environment &#8594; &#8377;92Cr for 4,000 brushes &#8594; India 12 major ports 200 minor &#8594; 8 brushes per crane motor &#8594; India &#8377;1,600Cr port brush market &#8594; Adani 10 port terminals' },
  { id: 'CBL-0012', batchNo: 'CBL-B2412', city: 'Guwahati', manufacturer: 'Assam Carbon Products', brushGrade: 'SA-45 Resin-Bonded', application: 'Tea Estate Generator (Tata Tea)', currentDensityAcM2: 9, brushLifeHours: 8000, investmentCr: 18, status: 'Delayed', priority: 'Low', origin: 'ACP Guwahati (AS)', destination: 'Tata Tea Dibrugarh (AS)', shipDate: '2026-07-24', transitDays: 12, zone: 'East', remarks: 'SA-45 resin-bonded for Tata Tea 250kVA tea estate generator &#8594; 9 A/cm2 light duty &#8594; 8,000 hrs remote estate &#8594; &#8377;18Cr for 1,500 brushes &#8594; India 8,000 tea estates &#8594; 4 brushes per genset &#8594; 12d delay monsoon road disruption &#8594; India &#8377;400Cr plantation brush market' },
  { id: 'CBL-0013', batchNo: 'CBL-B2413', city: 'Gandhinagar', manufacturer: 'Gujarat Fluorochemicals', brushGrade: 'CM-15 High-Metal Graphite', application: 'Petrochemical Motor (Reliance Jamnagar)', currentDensityAcM2: 20, brushLifeHours: 5500, investmentCr: 145, status: 'Delivered', priority: 'Critical', origin: 'GFCL Gandhinagar (GJ)', destination: 'Reliance Jamnagar (GJ)', shipDate: '2026-07-26', transitDays: 1, zone: 'West', remarks: 'CM-15 high-metal graphite for Reliance 1,500kW petrochemical compressor motor &#8594; 20 A/cm2 Zone II hazardous area &#8594; 5,500 hrs intrinsically safe brush &#8594; &#8377;145Cr for 6,000 brushes &#8594; Jamnagar 60 MT refinery complex &#8594; 6 brushes per compressor motor &#8594; India &#8377;6,000Cr petrochemical brush market &#8594; Reliance 35% India refining capacity' },
  { id: 'CBL-0014', batchNo: 'CBL-B2414', city: 'Lucknow', manufacturer: 'UP Carbon Industries', brushGrade: 'EG-375 Natural Graphite', application: 'Sugar Mill Motor (Balrampur Chini)', currentDensityAcM2: 13, brushLifeHours: 7000, investmentCr: 32, status: 'Delivered', priority: 'Medium', origin: 'UPCI Lucknow (UP)', destination: 'Balrampur Chini UP (UP)', shipDate: '2026-07-27', transitDays: 1, zone: 'North', remarks: 'EG-375 natural graphite for Balrampur 500kW sugar cane crusher motor &#8594; 13 A/cm2 seasonal duty &#8594; 7,000 hrs crushing season &#8594; &#8377;32Cr for 5,000 brushes &#8594; India 750 sugar mills &#8594; 4 brushes per crusher motor &#8594; India &#8377;1,100Cr sugar mill brush market &#8594; UP 150 sugar mills largest state' }
]

export default function CarbonBrushLogisticsView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Record<string, string[]>>({})
  const [activeTab, setActiveTab] = useState('Dashboard')

  const toggleFilter = (key: string, value: string) => {
    setFilters(prev => {
      const current = prev[key] || []
      const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value]
      if (updated.length === 0) {
        const next = { ...prev }
        delete next[key]
        return next
      }
      return { ...prev, [key]: updated }
    })
  }

  const filtered = useMemo(() => {
    return carbonBrushRecords.filter(r => {
      const matchSearch = !searchQuery || Object.values(r).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))
      const matchFilters = Object.entries(filters).every(([key, values]) => values.includes(String(r[key as keyof CarbonBrushRecord])))
      return matchSearch && matchFilters
    })
  }, [searchQuery, filters])

  const totalInvestment = useMemo(() => carbonBrushRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])
  const avgCurrentDensity = useMemo(() => (carbonBrushRecords.reduce((s: number, r) => s + r.currentDensityAcM2, 0) / carbonBrushRecords.length).toFixed(1), [])
  const deliveredCount = useMemo(() => carbonBrushRecords.filter(r => r.status === 'Delivered').length, [])
  const delayedCount = useMemo(() => carbonBrushRecords.filter(r => r.status === 'Delayed').length, [])

  const uniqueCities = useMemo(() => [...new Set(carbonBrushRecords.map(r => r.city))], [])
  const uniqueStatuses = useMemo(() => [...new Set(carbonBrushRecords.map(r => r.status))], [])
  const uniqueManufacturers = useMemo(() => [...new Set(carbonBrushRecords.map(r => r.manufacturer))], [])

  const cityInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of carbonBrushRecords) { map[r.city] = (map[r.city] || 0) + r.investmentCr }
    return map
  }, [])

  const gradeLifeMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of carbonBrushRecords) { map[r.brushGrade] = r.brushLifeHours }
    return map
  }, [])

  const statusCountMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of carbonBrushRecords) { map[r.status] = (map[r.status] || 0) + 1 }
    return map
  }, [])

  const zoneInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of carbonBrushRecords) { map[r.zone] = (map[r.zone] || 0) + r.investmentCr }
    return map
  }, [])

  const maxCity = useMemo(() => {
    const entries = (Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [cityInvestmentMap])

  const maxGradeLife = useMemo(() => {
    const entries = (Object.entries(gradeLifeMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [gradeLifeMap])

  const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights']

  return (
    <div className="space-y-6">
      <PageHeader title="Carbon Brush Logistics" description="Carbon brush, graphite contact and commutator material supply chain for railway traction motors, EV controllers, wind turbine generators, steel mill drives, mining winders and industrial alternators" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-amber-600 bg-amber-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Total Investment</div><div className="text-2xl font-bold text-amber-800">&#8377;{totalInvestment.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across {carbonBrushRecords.length} batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-amber-600 bg-amber-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Avg Current Density</div><div className="text-2xl font-bold text-amber-800">{avgCurrentDensity} A/cm2</div><div className="text-xs text-muted-foreground mt-1">Across all brush grades</div></CardContent></Card>
        <Card className="border-l-4 border-l-amber-600 bg-amber-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Delivered</div><div className="text-2xl font-bold text-amber-800">{deliveredCount}</div><div className="text-xs text-muted-foreground mt-1">{delayedCount} delayed</div></CardContent></Card>
        <Card className="border-l-4 border-l-amber-600 bg-amber-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Top City</div><div className="text-2xl font-bold text-amber-800">{maxCity[0]}</div><div className="text-xs text-muted-foreground mt-1">&#8377;{maxCity[1].toLocaleString()} Cr invested</div></CardContent></Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Input placeholder="Search records..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="max-w-xs" />
        {uniqueCities.map(city => (
          <Badge key={city} variant={filters.city?.includes(city) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('city', city)}>{city}</Badge>
        ))}
        {uniqueStatuses.map(status => (
          <Badge key={status} variant={filters.status?.includes(status) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('status', status)}>{status}</Badge>
        ))}
      </div>

      <div className="flex gap-2 border-b">
        {tabs.map(tab => (
          <button key={tab} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-amber-600 text-amber-800' : 'text-muted-foreground'}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by City</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([city, val]) => (<div key={city} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{city}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Brush Life by Grade</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(gradeLifeMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([grade, hrs]) => (<div key={grade} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{grade}</span><div className="flex-1 bg-orange-100 rounded-full h-3"><div className="bg-orange-600 h-3 rounded-full" style={{ width: `${(hrs / maxGradeLife[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{hrs.toLocaleString()}h</span></div>))}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Registry' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {uniqueManufacturers.map(mfg => (
              <Badge key={mfg} variant={filters.manufacturer?.includes(mfg) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('manufacturer', mfg)}>{mfg}</Badge>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left p-2">Batch</th><th className="text-left p-2">City</th><th className="text-left p-2">Manufacturer</th><th className="text-left p-2">Brush Grade</th><th className="text-left p-2">Application</th><th className="text-left p-2">A/cm2</th><th className="text-left p-2">Life(h)</th><th className="text-left p-2">&#8377;Cr</th><th className="text-left p-2">Status</th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className={`border-b ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                    <td className="p-2 font-mono text-xs">{r.batchNo}</td>
                    <td className="p-2">{r.city}</td>
                    <td className="p-2">{r.manufacturer}</td>
                    <td className="p-2">{r.brushGrade}</td>
                    <td className="p-2 max-w-[200px] truncate">{r.application}</td>
                    <td className="p-2">{r.currentDensityAcM2}</td>
                    <td className="p-2">{r.brushLifeHours.toLocaleString()}</td>
                    <td className="p-2 font-medium">&#8377;{r.investmentCr}</td>
                    <td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : r.status === 'Delayed' ? 'destructive' : 'secondary'}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-sm">Current Density by Brush</CardTitle></CardHeader><CardContent className="space-y-2">{carbonBrushRecords.slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{r.brushGrade}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-600 h-3 rounded-full" style={{ width: `${Math.min((r.currentDensityAcM2 / 25) * 100, 100)}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{r.currentDensityAcM2} A/cm2</span></div>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(zoneInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-orange-100 rounded-full h-3"><div className="bg-orange-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(statusCountMap) as [string, number][]).map(([status, count]) => (<div key={status} className="flex items-center gap-2"><span className="text-xs w-24">{status}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-600 h-3 rounded-full" style={{ width: `${(count / carbonBrushRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of carbonBrushRecords) { map[r.priority] = (map[r.priority] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([pri, count]) => (<div key={pri} className="flex items-center gap-2"><span className="text-xs w-20">{pri}</span><div className="flex-1 bg-rose-100 rounded-full h-3"><div className="bg-rose-600 h-3 rounded-full" style={{ width: `${(count / carbonBrushRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipment Volume by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of carbonBrushRecords) { map[r.zone] = (map[r.zone] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([zone, count]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-teal-100 rounded-full h-3"><div className="bg-teal-600 h-3 rounded-full" style={{ width: `${(count / carbonBrushRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Current Density Range Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const ranges: Record<string, number> = { 'Low (&#60;12 A/cm2)': 0, 'Medium (12-17 A/cm2)': 0, 'High (17-22 A/cm2)': 0, 'Very High (22+ A/cm2)': 0 }; for (const r of carbonBrushRecords) { if (r.currentDensityAcM2 >= 22) ranges['Very High (22+ A/cm2)']++; else if (r.currentDensityAcM2 >= 17) ranges['High (17-22 A/cm2)']++; else if (r.currentDensityAcM2 >= 12) ranges['Medium (12-17 A/cm2)']++; else ranges['Low (&#60;12 A/cm2)']++ } return (Object.entries(ranges) as [string, number][]).map(([range, count]) => (<div key={range} className="flex items-center gap-2"><span className="text-xs w-32">{range}</span><div className="flex-1 bg-indigo-100 rounded-full h-3"><div className="bg-indigo-600 h-3 rounded-full" style={{ width: `${(count / carbonBrushRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-amber-600"><CardHeader><CardTitle className="text-sm">Railway Traction: 10 Crore Brushes Per Year</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Indian Railways operates 9,000+ locomotives (5,000 electric WAG/WAP series + 3,000 diesel + 1,000 dual-mode), consuming approximately 108 million carbon brushes annually at 12 brushes per locomotive replaced quarterly. BHEL Bhopal is the largest domestic carbon brush manufacturer for traction motors, producing EG-214D electrographitic brushes rated at 12 A/cm2 and 8,000 hours life for 6,300kW WAG-9 freight locomotives. The Vande Bharat Express uses 3-phase AC traction with regenerative braking, reducing brush wear by 40% compared to conventional DC commutator motors. India&apos;s railway carbon brush market is valued at &#8377;8,500Cr, with Morgan Advanced Materials (UK), Schunk (Germany) and Helwig (USA) supplying premium grades, while BHEL and HCL manufacture 60% of domestic demand under Make in India.</p></CardContent></Card>
          <Card className="border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm">EV Carbon Brush: DC Motor Transition Phase</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>While BLDC motors are replacing DC commutator motors in most EVs, carbon brushes remain critical for the existing 4 million two-wheelers and 800,000 three-wheelers in India that use brushed DC motors. Mahindra XUV400, Tata Nexon EV (early models) and TVS iQube all used carbon brushes in their first-generation powertrains. India&apos;s EV brush market is &#8377;3,200Cr, declining at 15% annually as BLDC adoption accelerates. However, new demand is emerging from EV charging station power electronics (SiC inverter cooling pumps use brushed motors for reliability) and hydrogen fuel cell air compressors. Mahindra, Cummins and Crompton collectively consume 15,000 brush pairs per quarter for EV motor production and aftermarket spares.</p></CardContent></Card>
          <Card className="border-l-4 border-l-blue-500"><CardHeader><CardTitle className="text-sm">Wind Turbine Slip Ring: 12,000 Hour Service Life</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India&apos;s 65 GW installed wind capacity requires approximately 130,000 carbon brushes for slip ring assemblies on both gear-driven and direct-drive generators. Suzlon Energy&apos;s S-120 2.1MW turbine uses SA-45 resin-bonded brushes rated at 10 A/cm2 with a 12,000-hour service life at 1,500 RPM generator speed. The harsh offshore and mountain environments at Gujarat coast and Tamil Nadu wind farms accelerate brush wear by 30-50%, requiring condition-based monitoring with vibration sensors. Schunk Carbon Technology supplies 40% of India&apos;s wind turbine brushes, with Coimbatore Carbon Industries and Gujarat Carbon Industries manufacturing domestically. India&apos;s wind brush market is &#8377;4,100Cr, growing at 10% CAGR aligned with the 140 GW wind capacity target by 2030.</p></CardContent></Card>
          <Card className="border-l-4 border-l-purple-500"><CardHeader><CardTitle className="text-sm">Steel Mill: Harshest Brush Environment</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Steel reversing mill motors represent the most severe operating environment for carbon brushes: 18 A/cm2 current density under extreme vibration (5G), dust (iron oxide particulates), heat (200&#176;C ambient near furnace) and frequent reversals (200 per hour). SAIL Salem, Tata Steel Jamshedpur and JSW Vijayanagar collectively operate 150 reversing mill motors consuming &#8377;5,500Cr worth of DC-8 dark electrographitic brushes annually at 4,000-hour life. BHEL and Carbon Brushes India are the primary suppliers, with Morgan Advanced Materials supplying DC-7 grade for the most demanding applications. The transition to AC vector-controlled drives is reducing carbon brush demand in new mills by 60%, but India&apos;s 140 MT steel capacity still operates 800+ DC mill motors requiring regular brush replacement.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
