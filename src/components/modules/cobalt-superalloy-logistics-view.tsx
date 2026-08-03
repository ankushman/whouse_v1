'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Flame } from 'lucide-react'

interface CobaltSuperalloyRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  alloyGrade: string
  application: string
  cobaltPercent: number
  serviceTempC: number
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

const cobaltSuperalloyRecords: CobaltSuperalloyRecord[] = [
  { id: 'CSB-0001', batchNo: 'CSB-B2401', city: 'Mumbai', manufacturer: 'MIDHANI', alloyGrade: 'L-605 (Co-20Cr-15W-10Ni)', application: 'Gas Turbine Blade (HAL)', cobaltPercent: 55, serviceTempC: 980, investmentCr: 245, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-18', transitDays: 2, zone: 'West', remarks: 'L-605 wrought Co superalloy for HAL Su-30MKI AL-31F HPT blade &amp; vane &#8594; 55% Co 20Cr 15W &#8594; &#8377;245Cr for 4 tonnes bar &#8594; 980&#176;C service limit &#8594; India &#8377;8,200Cr aero Co superalloy &#8594; HAL 220 Su-30MKI fleet overhaul &#8594; 50,000 hour creep life &#8594; L-605 replaces imported Haynes 25' },
  { id: 'CSB-0002', batchNo: 'CSB-B2402', city: 'Hyderabad', manufacturer: 'DRDO DMRL', alloyGrade: 'Mar-M509 (Co-24Cr-10Ni-7W)', application: 'Missile Nozzle (DRDO)', cobaltPercent: 58, serviceTempC: 1090, investmentCr: 320, status: 'Delivered', priority: 'Critical', origin: 'DMRL Hyderabad (TG)', destination: 'DRDO Balasore (OD)', shipDate: '2026-07-20', transitDays: 3, zone: 'South', remarks: 'Mar-M509 cast Co superalloy for DRDO Agni-V nozzle throat insert &#8594; 58% Co &#8594; &#8377;320Cr for 2 tonnes investment cast &#8594; 1,090&#176;C nozzle temp &#8594; India &#8377;6,500Cr missile Co superalloy &#8594; Agni-V 5,000 km range &#8594; 120 second burn time capability &#8594; Erosion rate &lt;1 mil/s in Al2O3 particulate' },
  { id: 'CSB-0003', batchNo: 'CSB-B2403', city: 'Bengaluru', manufacturer: 'Bharat Electronics', alloyGrade: 'Stellite 6 (Co-28Cr-4.5W)', application: 'Valve Seat (BEL)', cobaltPercent: 62, serviceTempC: 850, investmentCr: 85, status: 'Delivered', priority: 'High', origin: 'BEL Bengaluru (KA)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-15', transitDays: 1, zone: 'South', remarks: 'Stellite 6 weld overlay for BHEL 800 MW steam turbine valve seat &#8594; 62% Co &#8594; &#8377;85Cr for 1.5 tonnes PTAW wire &#8594; 850&#176;C steam &#8594; India &#8377;2,800Cr valve Co alloy &#8594; BHEL 200 GW installed &#8594; Hardness 38-45 HRC &#8594; Cavitation erosion 10x SS316' },
  { id: 'CSB-0004', batchNo: 'CSB-B2404', city: 'Pune', manufacturer: 'Bharat Forge', alloyGrade: 'Stellite 21 (Co-27Cr-5Mo-2Ni)', application: 'Turbine Bucket (GE India)', cobaltPercent: 60, serviceTempC: 950, investmentCr: 195, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'GE Energy Daman (DD)', shipDate: '2026-07-22', transitDays: 2, zone: 'West', remarks: 'Stellite 21 cobalt investment casting for GE 9FA gas turbine bucket &#8594; 60% Co 27Cr 5Mo &#8594; &#8377;195Cr for 3 tonnes &#8594; 950&#176;C class H bucket &#8594; India &#8377;7,200Cr power Co superalloy &#8594; GE 50+ 9FA units India &#8594; 30,000 hour life &#8594; Superior hot corrosion vs In738LC' },
  { id: 'CSB-0005', batchNo: 'CSB-B2405', city: 'Chennai', manufacturer: 'IGCAR Kalpakkam', alloyGrade: 'Haynes 188 (Co-22Cr-14W-3Fe)', application: 'PFBR Component (IGCAR)', cobaltPercent: 39, serviceTempC: 1095, investmentCr: 280, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'IGCAR Kalpakkam (TN)', shipDate: '2026-07-19', transitDays: 1, zone: 'South', remarks: 'Haynes 188 sheet for IGCAR 500 MW PFBR intermediate heat exchanger &#8594; 39% Co &#8594; &#8377;280Cr for 6 tonnes 2mm sheet &#8594; 1,095&#176;C NaK outlet &#8594; India &#8377;4,800Cr nuclear Co &#8594; PFBR 2027 commissioning &#8594; 200,000 hour creep rupture &#8594; LBE corrosion resistance' },
  { id: 'CSB-0006', batchNo: 'CSB-B2406', city: 'Noida', manufacturer: 'Hindustan Aeronautics', alloyGrade: 'CoCrMo F75 (Co-28Cr-6Mo)', application: 'Hip Implant (Stryker India)', cobaltPercent: 64, serviceTempC: 37, investmentCr: 120, status: 'Delivered', priority: 'High', origin: 'MIDHANI Hyderabad (TG)', destination: 'Stryker Gurgaon (HR)', shipDate: '2026-07-16', transitDays: 1, zone: 'North', remarks: 'CoCrMo F75 investment cast for Stryker hip femoral head &#8594; 64% Co 28Cr 6Mo &#8594; &#8377;120Cr for 500 kg &#8594; 37&#176;C body temp (not thermal) &#8594; India &#8377;3,500Cr medical Co &#8594; Stryker 30% India joint replacement &#8594; 15 year wear life &#8594; ASTM F75 bio-compatibility' },
  { id: 'CSB-0007', batchNo: 'CSB-B2407', city: 'Kolkata', manufacturer: 'SAIL Durgapur', alloyGrade: 'Stellite 12 (Co-29Cr-8W)', application: 'Saw Blade (Tata Tools)', cobaltPercent: 58, serviceTempC: 600, investmentCr: 32, status: 'Delivered', priority: 'Medium', origin: 'SAIL Durgapur (WB)', destination: 'Tata Tools Jamshedpur (JH)', shipDate: '2026-07-21', transitDays: 1, zone: 'East', remarks: 'Stellite 12 tipped circular saw for Tata Steel hot rolling slitting &#8594; 58% Co &#8594; &#8377;32Cr for 200 tips &#8594; 600&#176;C red-hot steel &#8594; India &#8377;1,100Cr saw Co &#8594; Tata Steel 35 MTPA &#8594; 20x carbide blade life &#8594; Edge retention 3,000 cuts' },
  { id: 'CSB-0008', batchNo: 'CSB-B2408', city: 'Ahmedabad', manufacturer: 'Gujarat Fluorochemicals', alloyGrade: 'UMCo-50 (Co-28Cr-0.5C)', application: 'Glass Mould (Asahi India)', cobaltPercent: 71, serviceTempC: 750, investmentCr: 55, status: 'Delivered', priority: 'Medium', origin: 'GFCL Vadodara (GJ)', destination: 'Asahi India Mumbai (MH)', shipDate: '2026-07-17', transitDays: 1, zone: 'West', remarks: 'UMCo-50 cobalt cast for Asahi India glass bottle blow mould &#8594; 71% Co 28Cr &#8594; &#8377;55Cr for 2 tonnes cast &#8594; 750&#176;C glass contact &#8594; India &#8377;1,800Cr glass Co &#8594; Asahi 2 billion bottles/year &#8594; 100,000 cycle mould life &#8594; No glass wetting/sticking' },
  { id: 'CSB-0009', batchNo: 'CSB-B2409', city: 'Jaipur', manufacturer: 'Rajasthan Cobalt Industries', alloyGrade: 'Stellite 706 (Co-25Cr-6W-3Fe)', application: 'Pump Shaft (Kirloskar)', cobaltPercent: 56, serviceTempC: 450, investmentCr: 48, status: 'Delivered', priority: 'High', origin: 'RCI Jaipur (RJ)', destination: 'Kirloskar Pune (MH)', shipDate: '2026-07-23', transitDays: 2, zone: 'North', remarks: 'Stellite 706 overlay for Kirloskar boiler feed pump shaft &#8594; 56% Co &#8594; &#8377;48Cr for 800 kg wire &#8594; 450&#176;C boiler water &#8594; India &#8377;2,200Cr pump Co overlay &#8594; Kirloskar 40% India pumps &#8594; Galling resistance &#8594; 5,000 hour MTBF improvement' },
  { id: 'CSB-0010', batchNo: 'CSB-B2410', city: 'Coimbatore', manufacturer: 'Tamil Nadu Cobalt Alloys', alloyGrade: 'L-605 Tube (Co-20Cr-15W)', application: 'Chemical Reactor (Linde India)', cobaltPercent: 55, serviceTempC: 900, investmentCr: 168, status: 'Delivered', priority: 'High', origin: 'TNCA Coimbatore (TN)', destination: 'Linde India Mumbai (MH)', shipDate: '2026-07-14', transitDays: 2, zone: 'South', remarks: 'L-605 seamless tube for Linde India HCl reformer furnace &#8594; 55% Co &#8594; &#8377;168Cr for 4 tonnes 25mm OD tube &#8594; 900&#176;C HCl off-gas &#8594; India &#8377;3,800Cr chemical Co &#8594; Linde 25% India industrial gas &#8594; Carburisation resistance &#8594; 25 year tube life' },
  { id: 'CSB-0011', batchNo: 'CSB-B2411', city: 'Bhubaneswar', manufacturer: 'Odisha Cobalt Refinery', alloyGrade: 'CoNiCrAlY (Co-32Ni-21Cr-8Al-Y)', application: 'Thermal Barrier (NTPC)', cobaltPercent: 38, serviceTempC: 1050, investmentCr: 220, status: 'Delivered', priority: 'Critical', origin: 'OCR Bhubaneswar (OD)', destination: 'NTPC Ramagundam (TG)', shipDate: '2026-07-25', transitDays: 3, zone: 'East', remarks: 'CoNiCrAlY bond coat powder for NTPC gas turbine TBC system &#8594; 38% Co 32Ni &#8594; &#8377;220Cr for 1.5 tonnes APS powder &#8594; 1,050&#176;C bond coat temp &#8594; India &#8377;4,500Cr TBC bond coat &#8594; NTPC 60 GW gas fleet &#8594; TGO growth &lt;2um/1,000h &#8594; YSZ top coat 200um' },
  { id: 'CSB-0012', batchNo: 'CSB-B2412', city: 'Guwahati', manufacturer: 'Assam Cobalt Works', alloyGrade: 'Stellite 6B (Co-28Cr-4.5W-1.2C)', application: 'Wire Guide (Bajaj Steel)', cobaltPercent: 62, serviceTempC: 500, investmentCr: 42, status: 'Delayed', priority: 'Medium', origin: 'ACW Guwahati (AS)', destination: 'Bajaj Steel Pune (MH)', shipDate: '2026-07-24', transitDays: 14, zone: 'East', remarks: 'Stellite 6B wear-resistant guide for Bajaj steel wire drawing &#8594; 62% Co &#8594; &#8377;42Cr for 300 kg cast block &#8594; 500&#176;C friction zone &#8594; 14d delay monsoon logistics &#8594; India &#8377;1,400Cr wire guide Co &#8594; Bajaj 15 MTPA steel &#8594; 100x D2 tool steel wear &#8594; Surface finish Ra 0.2um maintained' },
  { id: 'CSB-0013', batchNo: 'CSB-B2413', city: 'Gandhinagar', manufacturer: 'Gujarat Cobalt Technologies', alloyGrade: 'Haynes 25 (L-605) Wire', application: 'Springs (BHEL Bhopal)', cobaltPercent: 55, serviceTempC: 815, investmentCr: 75, status: 'Delivered', priority: 'High', origin: 'GCT Gandhinagar (GJ)', destination: 'BHEL Bhopal (MP)', shipDate: '2026-07-26', transitDays: 2, zone: 'West', remarks: 'Haynes 25 (L-605) spring wire for BHEL steam turbine governor valve &#8594; 55% Co &#8594; &#8377;75Cr for 600 kg 3mm wire &#8594; 815&#176;C spring service &#8594; India &#8377;2,500Cr spring Co &#8594; BHEL 55% India steam turbines &#8594; No relaxation at 815&#176;C/80 MPa &#8594; 100,000 cycle fatigue life' },
  { id: 'CSB-0014', batchNo: 'CSB-B2414', city: 'Lucknow', manufacturer: 'UP Cobalt Alloys', alloyGrade: 'CoCrW F90 (Co-20Cr-15W-10Ni)', application: 'Weld Overlay (L&amp;T Heavy)', cobaltPercent: 55, serviceTempC: 850, investmentCr: 95, status: 'Delivered', priority: 'Medium', origin: 'UCA Lucknow (UP)', destination: 'L&amp;T Hazira (GJ)', shipDate: '2026-07-27', transitDays: 3, zone: 'North', remarks: 'CoCrW F90 weld overlay for L&amp;T offshore platform riser flange &#8594; 55% Co &#8594; &#8377;95Cr for 1.2 tonnes GTAW rod &#8594; 850&#176;C sour service &#8594; India &#8377;2,800Cr offshore Co &#8594; L&amp;T 35% India offshore &#8594; NACE MR0175 H2S resistance &#8594; Overlay hardness 320 HV minimum' }
]

export default function CobaltSuperalloyLogisticsView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Record<string, string[]>>({})
  const [activeTab, setActiveTab] = useState('Dashboard')

  const toggleFilter = (key: string, value: string) => {
    setFilters(prev => {
      const current = prev[key] || []
      const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value]
      if (updated.length === 0) { const next = { ...prev }; delete next[key]; return next }
      return { ...prev, [key]: updated }
    })
  }

  const filtered = useMemo(() => {
    return cobaltSuperalloyRecords.filter(r => {
      const matchSearch = !searchQuery || Object.values(r).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))
      const matchFilters = Object.entries(filters).every(([key, values]) => values.includes(String(r[key as keyof CobaltSuperalloyRecord])))
      return matchSearch && matchFilters
    })
  }, [searchQuery, filters])

  const totalInvestment = useMemo(() => cobaltSuperalloyRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])
  const avgCo = useMemo(() => (cobaltSuperalloyRecords.reduce((s: number, r) => s + r.cobaltPercent, 0) / cobaltSuperalloyRecords.length).toFixed(1), [])
  const deliveredCount = useMemo(() => cobaltSuperalloyRecords.filter(r => r.status === 'Delivered').length, [])
  const delayedCount = useMemo(() => cobaltSuperalloyRecords.filter(r => r.status === 'Delayed').length, [])

  const uniqueCities = useMemo(() => [...new Set(cobaltSuperalloyRecords.map(r => r.city))], [])
  const uniqueStatuses = useMemo(() => [...new Set(cobaltSuperalloyRecords.map(r => r.status))], [])
  const uniqueManufacturers = useMemo(() => [...new Set(cobaltSuperalloyRecords.map(r => r.manufacturer))], [])

  const cityInvestmentMap = useMemo(() => { const map: Record<string, number> = {}; for (const r of cobaltSuperalloyRecords) { map[r.city] = (map[r.city] || 0) + r.investmentCr } return map }, [])
  const gradeTempMap = useMemo(() => { const map: Record<string, number> = {}; for (const r of cobaltSuperalloyRecords) { map[r.alloyGrade] = r.serviceTempC } return map }, [])
  const statusCountMap = useMemo(() => { const map: Record<string, number> = {}; for (const r of cobaltSuperalloyRecords) { map[r.status] = (map[r.status] || 0) + 1 } return map }, [])
  const zoneInvestmentMap = useMemo(() => { const map: Record<string, number> = {}; for (const r of cobaltSuperalloyRecords) { map[r.zone] = (map[r.zone] || 0) + r.investmentCr } return map }, [])

  const maxCity = useMemo(() => { const e = (Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]); return e[0] || ['N/A', 0] }, [cityInvestmentMap])
  const maxTemp = useMemo(() => { const e = (Object.entries(gradeTempMap) as [string, number][]).sort((a, b) => b[1] - a[1]); return e[0] || ['N/A', 0] }, [gradeTempMap])

  const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights']

  return (
    <div className="space-y-6">
      <PageHeader title="Cobalt Superalloy Logistics" description="Cobalt-based superalloy supply chain for gas turbine blades, missile nozzle throats, nuclear reactor components, hip implants, valve seats, thermal barrier coatings and offshore weld overlays across India" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-600 bg-red-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Total Investment</div><div className="text-2xl font-bold text-red-800">&#8377;{totalInvestment.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across {cobaltSuperalloyRecords.length} batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-red-600 bg-red-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Avg Co Content</div><div className="text-2xl font-bold text-red-800">{avgCo}%</div><div className="text-xs text-muted-foreground mt-1">Across all alloy grades</div></CardContent></Card>
        <Card className="border-l-4 border-l-red-600 bg-red-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Delivered</div><div className="text-2xl font-bold text-red-800">{deliveredCount}</div><div className="text-xs text-muted-foreground mt-1">{delayedCount} delayed</div></CardContent></Card>
        <Card className="border-l-4 border-l-red-600 bg-red-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Top City</div><div className="text-2xl font-bold text-red-800">{maxCity[0]}</div><div className="text-xs text-muted-foreground mt-1">&#8377;{maxCity[1].toLocaleString()} Cr invested</div></CardContent></Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Input placeholder="Search records..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="max-w-xs" />
        {uniqueCities.map(city => (<Badge key={city} variant={filters.city?.includes(city) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('city', city)}>{city}</Badge>))}
        {uniqueStatuses.map(status => (<Badge key={status} variant={filters.status?.includes(status) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('status', status)}>{status}</Badge>))}
      </div>

      <div className="flex gap-2 border-b">
        {tabs.map(tab => (<button key={tab} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-red-600 text-red-800' : 'text-muted-foreground'}`} onClick={() => setActiveTab(tab)}>{tab}</button>))}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by City</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([city, val]) => (<div key={city} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{city}</span><div className="flex-1 bg-red-100 rounded-full h-3"><div className="bg-red-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Service Temp by Grade</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(gradeTempMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([grade, temp]) => (<div key={grade} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{grade}</span><div className="flex-1 bg-orange-100 rounded-full h-3"><div className="bg-orange-600 h-3 rounded-full" style={{ width: `${(temp / maxTemp[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{temp}&#176;C</span></div>))}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Registry' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {uniqueManufacturers.map(mfg => (<Badge key={mfg} variant={filters.manufacturer?.includes(mfg) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('manufacturer', mfg)}>{mfg}</Badge>))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left p-2">Batch</th><th className="text-left p-2">City</th><th className="text-left p-2">Manufacturer</th><th className="text-left p-2">Alloy Grade</th><th className="text-left p-2">Application</th><th className="text-left p-2">Co%</th><th className="text-left p-2">&#176;C</th><th className="text-left p-2">&#8377;Cr</th><th className="text-left p-2">Status</th></tr></thead>
              <tbody>
                {filtered.map(r => (<tr key={r.id} className={`border-b ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2 font-mono text-xs">{r.batchNo}</td><td className="p-2">{r.city}</td><td className="p-2">{r.manufacturer}</td><td className="p-2">{r.alloyGrade}</td><td className="p-2 max-w-[200px] truncate">{r.application}</td><td className="p-2">{r.cobaltPercent}%</td><td className="p-2">{r.serviceTempC}&#176;C</td><td className="p-2 font-medium">&#8377;{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : r.status === 'Delayed' ? 'destructive' : 'secondary'}>{r.status}</Badge></td></tr>))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-sm">Co Content by Alloy</CardTitle></CardHeader><CardContent className="space-y-2">{cobaltSuperalloyRecords.slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{r.alloyGrade}</span><div className="flex-1 bg-red-100 rounded-full h-3"><div className="bg-red-600 h-3 rounded-full" style={{ width: `${Math.min((r.cobaltPercent / 100) * 100, 100)}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{r.cobaltPercent}%</span></div>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(zoneInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-orange-100 rounded-full h-3"><div className="bg-orange-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(statusCountMap) as [string, number][]).map(([status, count]) => (<div key={status} className="flex items-center gap-2"><span className="text-xs w-24">{status}</span><div className="flex-1 bg-red-100 rounded-full h-3"><div className="bg-red-600 h-3 rounded-full" style={{ width: `${(count / cobaltSuperalloyRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of cobaltSuperalloyRecords) { map[r.priority] = (map[r.priority] || 0) + 1 } return (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([pri, count]) => (<div key={pri} className="flex items-center gap-2"><span className="text-xs w-20">{pri}</span><div className="flex-1 bg-orange-100 rounded-full h-3"><div className="bg-orange-600 h-3 rounded-full" style={{ width: `${(count / cobaltSuperalloyRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipment Volume by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of cobaltSuperalloyRecords) { map[r.zone] = (map[r.zone] || 0) + 1 } return (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, count]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-indigo-100 rounded-full h-3"><div className="bg-indigo-600 h-3 rounded-full" style={{ width: `${(count / cobaltSuperalloyRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Alloy Category Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const cats: Record<string, number> = { 'Stellite Wear': 0, 'L-605/Haynes Wrought': 0, 'CoNiCrAlY TBC': 0, 'CoCrMo Medical': 0, 'Mar-M Cast': 0, 'UMCo Cast': 0 }; for (const r of cobaltSuperalloyRecords) { if (r.alloyGrade.startsWith('Stellite')) cats['Stellite Wear']++; else if (r.alloyGrade.includes('L-605') || r.alloyGrade.includes('Haynes')) cats['L-605/Haynes Wrought']++; else if (r.alloyGrade.includes('CoNiCrAlY')) cats['CoNiCrAlY TBC']++; else if (r.alloyGrade.includes('CoCrMo')) cats['CoCrMo Medical']++; else if (r.alloyGrade.includes('Mar-M')) cats['Mar-M Cast']++; else cats['UMCo Cast']++ } return (Object.entries(cats) as [string, number][]).map(([cat, count]) => (<div key={cat} className="flex items-center gap-2"><span className="text-xs w-28">{cat}</span><div className="flex-1 bg-red-100 rounded-full h-3"><div className="bg-red-600 h-3 rounded-full" style={{ width: `${(count / cobaltSuperalloyRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-red-600"><CardHeader><CardTitle className="text-sm">L-605 HPT Blade: HAL Su-30MKI &#8377;8,200Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>L-605 (Co-20Cr-15W-10Ni) is India&apos;s primary cobalt superalloy for HAL Su-30MKI AL-31F high-pressure turbine blade overhaul, operating at 980&#176;C service temperature with 50,000 hour creep life. MIDHANI produces 80 tonnes/year of L-605 in bar, sheet and tube forms, replacing imported Haynes 25 (same composition) from Special Metals Corporation. India&apos;s aerospace cobalt superalloy market is &#8377;8,200Cr, growing 15% CAGR with HAL&apos;s licensed Su-30 production (220 aircraft), Tejas Mk-1A (40) and the AMCA fifth-generation fighter programme requiring L-605 combustor liners. L-605&apos;s 15% tungsten provides solid-solution strengthening while 20% chromium ensures hot corrosion resistance in marine environments for Indian Navy carrier-based operations. HAL&apos;s Sukhoi engine overhaul facility in Bengaluru processes 40 engines/year, each requiring 200 kg of L-605 blades.</p></CardContent></Card>
          <Card className="border-l-4 border-l-rose-500"><CardHeader><CardTitle className="text-sm">Mar-M509 Missile Nozzle: DRDO Agni-V &#8377;6,500Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Mar-M509 (Co-24Cr-10Ni-7W) investment cast cobalt superalloy is DRDO&apos;s selected material for Agni-V intercontinental ballistic missile nozzle throat inserts, operating at 1,090&#176;C with 120 second burn time capability. India&apos;s missile cobalt superalloy market is &#8377;6,500Cr, with DRDO DMRL developing directionally solidified Mar-M509 castings to eliminate grain boundary failure that limits polycrystalline versions to 90 seconds. The 7% tungsten and 0.5% carbon form M6C carbides that resist erosion from Al2O3 particulate in solid propellant exhaust at Mach 7+ velocities. Mar-M509&apos;s cobalt matrix provides superior thermal fatigue life compared to nickel superalloys (Inconel 718) in cyclic heating-cooling during multi-pulse ignition sequences. DRDO&apos;s Agni programme (Agni-I to Agni-V) consumes 25 tonnes/year of cast Mar-M509, with future Agni-VI and K-4 submarine-launched ballistic missile driving 40% growth.</p></CardContent></Card>
          <Card className="border-l-4 border-l-sky-500"><CardHeader><CardTitle className="text-sm">CoCrMo F75: Stryker Hip Implant &#8377;3,500Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>CoCrMo F75 (Co-28Cr-6Mo) investment cast cobalt superalloy is the gold standard material for hip joint femoral heads and knee condyles in India&apos;s &#8377;3,500Cr orthopaedic implant market. Stryker India (30% market share) sources MIDHANI-produced F75 castings to ASTM F75 specification, with 64% cobalt providing the combination of high wear resistance (Vickers hardness 350 HV), corrosion resistance in body fluids (0.01 mm/year corrosion rate), and biocompatibility certified by ISO 10993. India performs 1.2 million joint replacement surgeries/year, growing 18% CAGR with an aging population and expanding insurance coverage under Ayushman Bharat. F75&apos;s unique advantage over titanium (Ti-6Al-4V) is 100x lower wear volume in hip simulator testing at 3 million cycles, translating to 15-20 year implant survivorship versus 10-12 years for titanium heads. MIDHANI is India&apos;s sole qualified F75 producer for medical implants.</p></CardContent></Card>
          <Card className="border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm">CoNiCrAlY TBC: NTPC Gas Turbine &#8377;4,500Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>CoNiCrAlY (Co-32Ni-21Cr-8Al-0.5Y) bond coat powder is NTPC&apos;s selected atmospheric plasma spray (APS) material for gas turbine thermal barrier coating systems on GE 9FA and Siemens V94.3 fleet, operating at 1,050&#176;C bond coat interface temperature. India&apos;s TBC bond coat market is &#8377;4,500Cr, serving NTPC&apos;s 60 GW gas turbine fleet and Reliance Industries&apos; 35 GW refinery gas turbines. CoNiCrAlY&apos;s 8% aluminium forms a continuous Al2O3 thermally grown oxide (TGO) layer that bonds the YSZ ceramic top coat (200um) to the nickel superalloy substrate, with TGO growth rate controlled below 2um per 1,000 hours to prevent coating spallation. The 0.5% yttrium addition (reactive element effect) improves Al2O3 scale adhesion by 5x during thermal cycling. NTPC&apos;s hot gas path overhaul interval of 48,000 hours depends directly on TBC system integrity - CoNiCrAlY bond coat quality is the determining factor.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
