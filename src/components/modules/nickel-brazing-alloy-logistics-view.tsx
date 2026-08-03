'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Cog } from 'lucide-react'

interface NickelBrazingRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  alloyGrade: string
  application: string
  nickelPercent: number
  brazingTempC: number
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

const nickelBrazingRecords: NickelBrazingRecord[] = [
  { id: 'NBA-0001', batchNo: 'NBA-B2401', city: 'Mumbai', manufacturer: 'MIDHANI', alloyGrade: 'BNi-2 (Ni-7Cr-3B-5Si)', application: 'Aero Engine Spool (HAL)', nickelPercent: 82, brazingTempC: 1030, investmentCr: 165, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-18', transitDays: 2, zone: 'West', remarks: 'BNi-2 brazing foil for HAL Su-30MKI engine spool joint &#8594; 82% Ni 7Cr 3B 5Si &#8594; &#8377;165Cr for 6 tonnes foil &#8594; 1,030&#176;C vacuum brazing &#8594; India &#8377;5,800Cr aero braze market &#8594; HAL 220 Su-30MKI fleet &#8594; Joint strength 650 MPa shear &#8594; 50um gap tolerance &#8594; Vacuum 10-4 mbar furnace' },
  { id: 'NBA-0002', batchNo: 'NBA-B2402', city: 'Hyderabad', manufacturer: 'DRDO DMRL', alloyGrade: 'BNi-5 (Ni-19Cr-10Si)', application: 'Missile Thrust Chamber (DRDO)', nickelPercent: 71, brazingTempC: 1120, investmentCr: 225, status: 'Delivered', priority: 'Critical', origin: 'DMRL Hyderabad (TG)', destination: 'DRDO Balasore (OD)', shipDate: '2026-07-20', transitDays: 3, zone: 'South', remarks: 'BNi-5 paste for DRDO Agni-V thrust chamber manifold &#8594; 71% Ni &#8594; &#8377;225Cr for 3 tonnes paste &#8594; 1,120&#176;C hydrogen furnace &#8594; India &#8377;7,500Cr missile braze &#8594; Agni-V 5,000 km range &#8594; B-free for long thin joints &#8594; 10 year cryo-service life' },
  { id: 'NBA-0003', batchNo: 'NBA-B2403', city: 'Bengaluru', manufacturer: 'Bharat Electronics', alloyGrade: 'BNi-7 (Ni-3B-5Si-4Fe)', application: 'Klystron Assembly (BEL)', nickelPercent: 88, brazingTempC: 980, investmentCr: 52, status: 'Delivered', priority: 'High', origin: 'BEL Bengaluru (KA)', destination: 'BEL Ghaziabad (UP)', shipDate: '2026-07-15', transitDays: 2, zone: 'South', remarks: 'BNi-7 brazing ring for BEL klystron electron gun assembly &#8594; 88% Ni &#8594; &#8377;52Cr for 800 kg ring &#8594; 980&#176;C low-temp brazing &#8594; India &#8377;1,800Cr defence electronics &#8594; BEL 500k klystrons/year &#8594; Low temp preserves Cu cathode &#8594; Vacuum 10-5 mbar joint leak-tight' },
  { id: 'NBA-0004', batchNo: 'NBA-B2404', city: 'Pune', manufacturer: 'Bharat Forge', alloyGrade: 'Ni-Cr-P Amorphous (Ni-Cr7P14)', application: 'Turbocharger Blade (Tata Cummins)', nickelPercent: 79, brazingTempC: 940, investmentCr: 95, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'Cummins Jamshedpur (JH)', shipDate: '2026-07-22', transitDays: 2, zone: 'West', remarks: 'Ni-Cr-P amorphous foil for Tata Cummins turbocharger blade root &#8594; 79% Ni &#8594; &#8377;95Cr for 2 tonnes 25um foil &#8594; 940&#176;C rapid thermal cycle &#8594; India &#8377;3,200Cr auto braze &#8594; 25um amorphous gap fill &#8594; Cycle time 15 min vs 45 min BNi-2 &#8594; India 3 million turbochargers/year' },
  { id: 'NBA-0005', batchNo: 'NBA-B2405', city: 'Chennai', manufacturer: 'IGCAR Kalpakkam', alloyGrade: 'BNi-1a (Ni-6Cr-3.5B-4.5Si)', application: 'Heat Exchanger (NPCIL)', nickelPercent: 84, brazingTempC: 1050, investmentCr: 178, status: 'Delivered', priority: 'Critical', origin: 'IGCAR Kalpakkam (TN)', destination: 'NPCIL Kudankulam (TN)', shipDate: '2026-07-19', transitDays: 1, zone: 'South', remarks: 'BNi-1a foil for NPCIL nuclear steam generator tube-to-tubesheet &#8594; 84% Ni &#8594; &#8377;178Cr for 8 tonnes &#8594; 1,050&#176;C vacuum furnace &#8594; India &#8377;6,200Cr nuclear braze &#8594; Kudankulam 6x1,000 MW VVER &#8594; ASME Section IX qualified &#8594; Helium leak test 10-10 mbar-L/s' },
  { id: 'NBA-0006', batchNo: 'NBA-B2406', city: 'Noida', manufacturer: 'Hindustan Aeronautics', alloyGrade: 'BNi-3 (Ni-14Cr-4B-4.5Si)', application: 'Landing Gear (HAL)', nickelPercent: 75, brazingTempC: 1065, investmentCr: 108, status: 'Delivered', priority: 'High', origin: 'HAL Bengaluru (KA)', destination: 'HAL Nasik (MH)', shipDate: '2026-07-16', transitDays: 2, zone: 'North', remarks: 'BNi-3 paste for HAL Tejas landing gear brake assembly &#8594; 75% Ni 14Cr &#8594; &#8377;108Cr for 1.5 tonnes &#8594; 1,065&#176;C argon furnace &#8594; India &#8377;4,500Cr aero structural &#8594; Tejas Mk-1A 40 aircraft order &#8594; Fatigue 100,000 cycles &#8594; High Cr for corrosion in landing environment' },
  { id: 'NBA-0007', batchNo: 'NBA-B2407', city: 'Kolkata', manufacturer: 'SAIL Durgapur', alloyGrade: 'Ni-P Eutectic (Ni-11P)', application: 'Electrical Contact (CG Power)', nickelPercent: 89, brazingTempC: 880, investmentCr: 42, status: 'Delivered', priority: 'Medium', origin: 'SAIL Durgapur (WB)', destination: 'CG Power Mumbai (MH)', shipDate: '2026-07-21', transitDays: 1, zone: 'East', remarks: 'Ni-P eutectic braze for CG Power transformer bushing contact &#8594; 89% Ni 11P &#8594; &#8377;42Cr for 500 kg &#8594; 880&#176;C lowest Ni braze temp &#8594; India &#8377;1,500Cr electrical braze &#8594; CG Power 40% India transformer &#8594; P provides self-fluxing action &#8594; No external flux needed' },
  { id: 'NBA-0008', batchNo: 'NBA-B2408', city: 'Ahmedabad', manufacturer: 'Gujarat Fluorochemicals', alloyGrade: 'Ni-Mn-Si-C (Ni-2Mn-5Si-0.5C)', application: 'Diamond Tool (Diament Gujarat)', nickelPercent: 92.5, brazingTempC: 1020, investmentCr: 35, status: 'Delivered', priority: 'Medium', origin: 'GFCL Vadodara (GJ)', destination: 'Diament Ahmedabad (GJ)', shipDate: '2026-07-17', transitDays: 1, zone: 'West', remarks: 'Ni-Mn-Si-C active braze for Diament diamond-to-carbide tool tip &#8594; 92.5% Ni &#8594; &#8377;35Cr for 300 kg paste &#8594; 1,020&#176;C C reacts with diamond &#8594; India &#8377;1,200Cr diamond tool braze &#8594; India 200 million diamond tools/year &#8594; Carbide bond strength 350 MPa &#8594; TiCr active element not needed' },
  { id: 'NBA-0009', batchNo: 'NBA-B2409', city: 'Jaipur', manufacturer: 'Rajasthan Brazing Alloys', alloyGrade: 'BNi-6 (Ni-10P)', application: 'Fuel Cell Stack (IOCL)', nickelPercent: 90, brazingTempC: 925, investmentCr: 125, status: 'Delivered', priority: 'High', origin: 'RBA Jaipur (RJ)', destination: 'IOCL Faridabad (HR)', shipDate: '2026-07-23', transitDays: 3, zone: 'North', remarks: 'BNi-6 braze foil for IOCL solid oxide fuel cell interconnect &#8594; 90% Ni 10P &#8594; &#8377;125Cr for 2 tonnes 50um foil &#8594; 925&#176;C SOFC operating temp match &#8594; India &#8377;4,800Cr fuel cell braze &#8594; IOCL 5 kW SOFC pilot &#8594; Chromium retention seal &#8594; 40,000 hour stack life target' },
  { id: 'NBA-0010', batchNo: 'NBA-B2410', city: 'Coimbatore', manufacturer: 'Tamil Nadu Brazing Industries', alloyGrade: 'Ni-Si-B Paste (Ni-3.5B-4Si)', application: 'Stainless Steel Joint (WEG India)', nickelPercent: 92.5, brazingTempC: 1010, investmentCr: 38, status: 'Delivered', priority: 'Medium', origin: 'TNBI Coimbatore (TN)', destination: 'WEG Bengaluru (KA)', shipDate: '2026-07-14', transitDays: 2, zone: 'South', remarks: 'Ni-Si-B paste for WEG motor SS304 end ring joint &#8594; 92.5% Ni &#8594; &#8377;38Cr for 1.2 tonnes &#8594; 1,010&#176;C SS-to-SS joint &#8594; India &#8377;1,400Cr motor braze &#8594; WEG 30% India IE4 motor &#8594; No post-brazing cleaning &#8594; Salt spray 500 hour ASTM B117' },
  { id: 'NBA-0011', batchNo: 'NBA-B2411', city: 'Bhubaneswar', manufacturer: 'Odisha Brazing Materials', alloyGrade: 'BNi-9 (Ni-15P)', application: 'Power Module Substrate (Tata Electronics)', nickelPercent: 85, brazingTempC: 960, investmentCr: 72, status: 'Delivered', priority: 'High', origin: 'OBM Bhubaneswar (OD)', destination: 'Tata Electronics Bengaluru (KA)', shipDate: '2026-07-25', transitDays: 3, zone: 'East', remarks: 'BNi-9 thin foil for Tata SiC power module DBC substrate &#8594; 85% Ni &#8594; &#8377;72Cr for 500 kg 25um foil &#8594; 960&#176;C SiC-to-Cu joint &#8594; India &#8377;2,800Cr semiconductor braze &#8594; Tata 5,000 modules/month &#8594; CTE mismatch accommodation &#8594; Thermal cycling 1,000 cycles -40 to 200&#176;C' },
  { id: 'NBA-0012', batchNo: 'NBA-B2412', city: 'Guwahati', manufacturer: 'Assam Nickel Brazing Works', alloyGrade: 'Ni-Cr-B-Si Ring (BNi-2)', application: 'Gas Turbine Blade (NTPC)', nickelPercent: 82, brazingTempC: 1030, investmentCr: 145, status: 'Delayed', priority: 'Critical', origin: 'ANBW Guwahati (AS)', destination: 'NTPC Sipat (CG)', shipDate: '2026-07-24', transitDays: 12, zone: 'East', remarks: 'BNi-2 brazing ring for NTPC gas turbine blade tip repair &#8594; 82% Ni &#8594; &#8377;145Cr for 2 tonnes ring &#8594; 12d delay monsoon logistics &#8594; 1,030&#176;C vacuum &#8594; India &#8377;5,200Cr power braze &#8594; NTPC 60 GW gas fleet &#8594; Blade tip 30% longer life &#8594; OEM spec GE-50M2372' },
  { id: 'NBA-0013', batchNo: 'NBA-B2413', city: 'Gandhinagar', manufacturer: 'Gujarat Brazing Technologies', alloyGrade: 'Ni-Pd-Mn Paste (Ni-20Pd-5Mn)', application: 'Brazed Plate Heat Exchanger (Alfa Laval)', nickelPercent: 75, brazingTempC: 1100, investmentCr: 88, status: 'Delivered', priority: 'High', origin: 'GBT Gandhinagar (GJ)', destination: 'Alfa Laval Pune (MH)', shipDate: '2026-07-26', transitDays: 2, zone: 'West', remarks: 'Ni-Pd-Mn high-temp paste for Alfa Laval BPHE stainless plate joint &#8594; 75% Ni 20Pd &#8594; &#8377;88Cr for 1 tonne &#8594; 1,100&#176;C 316L-to-316L &#8594; India &#8377;3,500Cr process braze &#8594; Alfa Laval 35% India HX market &#8594; Pd eliminates intergranular penetration &#8594; 10 bar pressure rating joint' },
  { id: 'NBA-0014', batchNo: 'NBA-B2414', city: 'Lucknow', manufacturer: 'UP Brazing Alloys', alloyGrade: 'Ni-Cr-Si-C (Ni-6Cr-4Si)', application: 'Cutting Tool (Sandvik India)', nickelPercent: 90, brazingTempC: 1060, investmentCr: 48, status: 'Delivered', priority: 'Medium', origin: 'UBA Lucknow (UP)', destination: 'Sandvik Pune (MH)', shipDate: '2026-07-27', transitDays: 2, zone: 'North', remarks: 'Ni-Cr-Si-C braze for Sandvik carbide insert tip clamp &#8594; 90% Ni &#8594; &#8377;48Cr for 600 kg &#8594; 1,060&#176;C WC-Co-to-steel shank &#8594; India &#8377;1,800Cr cutting tool braze &#8594; Sandvik 20% India insert &#8594; C reacts with WC for metallurgical bond &#8594; Bending strength 1,200 N/mm2' }
]

export default function NickelBrazingAlloyLogisticsView() {
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
    return nickelBrazingRecords.filter(r => {
      const matchSearch = !searchQuery || Object.values(r).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))
      const matchFilters = Object.entries(filters).every(([key, values]) => values.includes(String(r[key as keyof NickelBrazingRecord])))
      return matchSearch && matchFilters
    })
  }, [searchQuery, filters])

  const totalInvestment = useMemo(() => nickelBrazingRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])
  const avgNi = useMemo(() => (nickelBrazingRecords.reduce((s: number, r) => s + r.nickelPercent, 0) / nickelBrazingRecords.length).toFixed(1), [])
  const deliveredCount = useMemo(() => nickelBrazingRecords.filter(r => r.status === 'Delivered').length, [])
  const delayedCount = useMemo(() => nickelBrazingRecords.filter(r => r.status === 'Delayed').length, [])

  const uniqueCities = useMemo(() => [...new Set(nickelBrazingRecords.map(r => r.city))], [])
  const uniqueStatuses = useMemo(() => [...new Set(nickelBrazingRecords.map(r => r.status))], [])
  const uniqueManufacturers = useMemo(() => [...new Set(nickelBrazingRecords.map(r => r.manufacturer))], [])

  const cityInvestmentMap = useMemo(() => { const map: Record<string, number> = {}; for (const r of nickelBrazingRecords) { map[r.city] = (map[r.city] || 0) + r.investmentCr } return map }, [])
  const gradeTempMap = useMemo(() => { const map: Record<string, number> = {}; for (const r of nickelBrazingRecords) { map[r.alloyGrade] = r.brazingTempC } return map }, [])
  const statusCountMap = useMemo(() => { const map: Record<string, number> = {}; for (const r of nickelBrazingRecords) { map[r.status] = (map[r.status] || 0) + 1 } return map }, [])
  const zoneInvestmentMap = useMemo(() => { const map: Record<string, number> = {}; for (const r of nickelBrazingRecords) { map[r.zone] = (map[r.zone] || 0) + r.investmentCr } return map }, [])

  const maxCity = useMemo(() => { const e = (Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]); return e[0] || ['N/A', 0] }, [cityInvestmentMap])
  const maxTemp = useMemo(() => { const e = (Object.entries(gradeTempMap) as [string, number][]).sort((a, b) => b[1] - a[1]); return e[0] || ['N/A', 0] }, [gradeTempMap])

  const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights']

  return (
    <div className="space-y-6">
      <PageHeader title="Nickel Brazing Alloy Logistics" description="Nickel-based brazing filler metals supply chain for aerospace engine spools, nuclear steam generators, missile thrust chambers, turbocharger blades, fuel cell interconnects and cutting tool tips across India" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-orange-600 bg-orange-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Total Investment</div><div className="text-2xl font-bold text-orange-800">&#8377;{totalInvestment.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across {nickelBrazingRecords.length} batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-orange-600 bg-orange-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Avg Ni Content</div><div className="text-2xl font-bold text-orange-800">{avgNi}%</div><div className="text-xs text-muted-foreground mt-1">Across all alloy grades</div></CardContent></Card>
        <Card className="border-l-4 border-l-orange-600 bg-orange-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Delivered</div><div className="text-2xl font-bold text-orange-800">{deliveredCount}</div><div className="text-xs text-muted-foreground mt-1">{delayedCount} delayed</div></CardContent></Card>
        <Card className="border-l-4 border-l-orange-600 bg-orange-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Top City</div><div className="text-2xl font-bold text-orange-800">{maxCity[0]}</div><div className="text-xs text-muted-foreground mt-1">&#8377;{maxCity[1].toLocaleString()} Cr invested</div></CardContent></Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Input placeholder="Search records..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="max-w-xs" />
        {uniqueCities.map(city => (<Badge key={city} variant={filters.city?.includes(city) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('city', city)}>{city}</Badge>))}
        {uniqueStatuses.map(status => (<Badge key={status} variant={filters.status?.includes(status) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('status', status)}>{status}</Badge>))}
      </div>

      <div className="flex gap-2 border-b">
        {tabs.map(tab => (<button key={tab} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-orange-600 text-orange-800' : 'text-muted-foreground'}`} onClick={() => setActiveTab(tab)}>{tab}</button>))}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by City</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([city, val]) => (<div key={city} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{city}</span><div className="flex-1 bg-orange-100 rounded-full h-3"><div className="bg-orange-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Brazing Temp by Grade</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(gradeTempMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([grade, temp]) => (<div key={grade} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{grade}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-600 h-3 rounded-full" style={{ width: `${(temp / maxTemp[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{temp}&#176;C</span></div>))}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Registry' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {uniqueManufacturers.map(mfg => (<Badge key={mfg} variant={filters.manufacturer?.includes(mfg) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('manufacturer', mfg)}>{mfg}</Badge>))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left p-2">Batch</th><th className="text-left p-2">City</th><th className="text-left p-2">Manufacturer</th><th className="text-left p-2">Alloy Grade</th><th className="text-left p-2">Application</th><th className="text-left p-2">Ni%</th><th className="text-left p-2">&#176;C</th><th className="text-left p-2">&#8377;Cr</th><th className="text-left p-2">Status</th></tr></thead>
              <tbody>
                {filtered.map(r => (<tr key={r.id} className={`border-b ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2 font-mono text-xs">{r.batchNo}</td><td className="p-2">{r.city}</td><td className="p-2">{r.manufacturer}</td><td className="p-2">{r.alloyGrade}</td><td className="p-2 max-w-[200px] truncate">{r.application}</td><td className="p-2">{r.nickelPercent}%</td><td className="p-2">{r.brazingTempC}&#176;C</td><td className="p-2 font-medium">&#8377;{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : r.status === 'Delayed' ? 'destructive' : 'secondary'}>{r.status}</Badge></td></tr>))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-sm">Ni Content by Alloy</CardTitle></CardHeader><CardContent className="space-y-2">{nickelBrazingRecords.slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{r.alloyGrade}</span><div className="flex-1 bg-orange-100 rounded-full h-3"><div className="bg-orange-600 h-3 rounded-full" style={{ width: `${Math.min((r.nickelPercent / 100) * 100, 100)}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{r.nickelPercent}%</span></div>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(zoneInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(statusCountMap) as [string, number][]).map(([status, count]) => (<div key={status} className="flex items-center gap-2"><span className="text-xs w-24">{status}</span><div className="flex-1 bg-orange-100 rounded-full h-3"><div className="bg-orange-600 h-3 rounded-full" style={{ width: `${(count / nickelBrazingRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of nickelBrazingRecords) { map[r.priority] = (map[r.priority] || 0) + 1 } return (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([pri, count]) => (<div key={pri} className="flex items-center gap-2"><span className="text-xs w-20">{pri}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-600 h-3 rounded-full" style={{ width: `${(count / nickelBrazingRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipment Volume by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of nickelBrazingRecords) { map[r.zone] = (map[r.zone] || 0) + 1 } return (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, count]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-indigo-100 rounded-full h-3"><div className="bg-indigo-600 h-3 rounded-full" style={{ width: `${(count / nickelBrazingRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Alloy Category Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const cats: Record<string, number> = { 'BNi Standard': 0, 'Ni-Cr-P Amorphous': 0, 'Ni-P Eutectic': 0, 'Ni-Pd High-T': 0, 'Ni-Si-B Active': 0, 'Ni-Cr-Si-C Tool': 0 }; for (const r of nickelBrazingRecords) { if (r.alloyGrade.startsWith('BNi')) cats['BNi Standard']++; else if (r.alloyGrade.includes('Amorphous')) cats['Ni-Cr-P Amorphous']++; else if (r.alloyGrade.includes('Pd')) cats['Ni-Pd High-T']++; else if (r.alloyGrade.includes('P') && r.alloyGrade.includes('Eutectic')) cats['Ni-P Eutectic']++; else if (r.alloyGrade.includes('Mn') || r.alloyGrade.includes('Si-C')) cats['Ni-Si-B Active']++; else cats['Ni-Cr-Si-C Tool']++ } return (Object.entries(cats) as [string, number][]).map(([cat, count]) => (<div key={cat} className="flex items-center gap-2"><span className="text-xs w-28">{cat}</span><div className="flex-1 bg-orange-100 rounded-full h-3"><div className="bg-orange-600 h-3 rounded-full" style={{ width: `${(count / nickelBrazingRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-orange-600"><CardHeader><CardTitle className="text-sm">Aero BNi-2: HAL Su-30MKI Engine &#8377;5,800Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>BNi-2 (Ni-7Cr-3B-5Si) is India&apos;s primary aerospace nickel brazing alloy for HAL Su-30MKI AL-31F engine spool joint repair and new assembly, operating at 1,030&#176;C in vacuum furnaces at 10-4 mbar. MIDHANI produces 120 tonnes/year of BNi-2 foil, paste and ring forms, serving HAL&apos;s 220 Su-30MKI fleet and 40 Tejas Mk-1A order. India&apos;s aerospace braze market is &#8377;5,800Cr, growing 12% CAGR with HAL&apos;s licensed Su-30 production and AMCA fifth-generation fighter programme. BNi-2&apos;s 3% boron provides excellent fluidity for 50um gap joints, while 7% chromium ensures oxidation resistance at the 650&#176;C service temperature. Joint shear strength of 650 MPa meets GE-S400 specification. Vacuum brazing eliminates flux residues that cause foreign object damage (FOD) in turbine engines - a critical safety requirement for Indian Air Force fleet readiness of 75%.</p></CardContent></Card>
          <Card className="border-l-4 border-l-rose-500"><CardHeader><CardTitle className="text-sm">Nuclear BNi-1a: Kudankulam SG Repair &#8377;6,200Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>BNi-1a (Ni-6Cr-3.5B-4.5Si) is the sole qualified brazing alloy for NPCIL nuclear steam generator tube-to-tubesheet joint repair at Kudankulam (6x1,000 MW VVER), Rajasthan (6x700 MW PHWR) and Tarapur (2x540 MW BWR). India&apos;s nuclear brazing market is &#8377;6,200Cr, with IGCAR Kalpakkam supplying BNi-1a to ASME Section IX requirements with helium leak testing at 10-10 mbar-L/s sensitivity. BNi-1a&apos;s advantage for nuclear service is its resistance to primary water stress corrosion cracking (PWSCC) in 300&#176;C, 150 bar D2O/steam environment - a requirement no other braze alloy family meets. Each SG has 10,000+ tube joints, with brazed repair preferred over welding to avoid heat-affected zone (HAZ) sensitisation of Inconel 600 tubes. NPCIL plans 10 new reactors by 2032, driving 50 tonnes/year BNi-1a demand.</p></CardContent></Card>
          <Card className="border-l-4 border-l-sky-500"><CardHeader><CardTitle className="text-sm">Amorphous Ni-Cr-P: Turbocharger &#8377;3,200Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Ni-Cr-P amorphous brazing foil (25um thickness, 79% Ni) represents India&apos;s fastest-growing nickel braze segment at &#8377;3,200Cr, driven by Tata Cummins and Bosch turbocharger production for India&apos;s BS-VI emission standards. Amorphous foil&apos;s key advantage is 3x faster brazing cycle (15 min vs 45 min for crystalline BNi-2) due to the absence of melting point depression during heating - the foil transitions directly from solid to liquid at 940&#176;C. India produces 3 million turbochargers/year (Honeywell, BorgWarner, Cummins), with each unit requiring 2-4 brazed blade root joints. The 25um foil thickness provides precise gap filling without excessive fillet formation, critical for maintaining aerodynamic clearances in 200,000 RPM turbine wheels. Bharat Forge is establishing India&apos;s first amorphous Ni-Cr-P foil production using melt-spinning at 10E6 K/s cooling rate.</p></CardContent></Card>
          <Card className="border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm">Fuel Cell BNi-6: IOCL SOFC Pilot &#8377;4,800Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>BNi-6 (Ni-10P) thin foil (50um) is IOCL&apos;s selected brazing alloy for solid oxide fuel cell (SOFC) metallic interconnect joining at 925&#176;C, matching the SOFC operating temperature window of 800-950&#176;C. India&apos;s fuel cell brazing market is &#8377;4,800Cr, anchored by IOCL&apos;s 5 kW SOFC pilot at Faridabad and NTPC&apos;s 100 kW plan for Gujarat. BNi-6&apos;s advantage for SOFC is its low phosphorus content (10% P) forming a continuous chromia-phosphate scale at the interconnect surface that seals against gas crossover and maintains electrical conductivity. The 50um foil thickness accommodates the 0.5mm interconnect channel width. IOCL targets 40,000-hour stack life with BNi-6 brazed interconnects, validated through 5,000-hour accelerated testing at 950&#176;C in humidified hydrogen. Rajasthan Brazing Alloys produces BNi-6 using rapid solidification for ultra-thin 50um foil capability.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
