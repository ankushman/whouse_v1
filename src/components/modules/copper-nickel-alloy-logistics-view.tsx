'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Layers } from 'lucide-react'

interface CopperNickelRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  alloyGrade: string
  application: string
  copperPercent: number
  nickelPercent: number
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

const copperNickelRecords: CopperNickelRecord[] = [
  { id: 'CNA-0001', batchNo: 'CNA-B2401', city: 'Mumbai', manufacturer: 'Hindalco Industries', alloyGrade: 'CuNi 90/10 (C70600)', application: 'Seawater Piping ( Mazagon Dock)', copperPercent: 88.5, nickelPercent: 10, investmentCr: 245, status: 'Delivered', priority: 'Critical', origin: 'Hindalco Renukoot (UP)', destination: 'Mazagon Dock Mumbai (MH)', shipDate: '2026-07-18', transitDays: 1, zone: 'West', remarks: 'CuNi 90/10 C70600 seamless tube for Mazagon Dock INS Vikrant carrier seawater cooling &#8594; 88.5% Cu 10% Ni 1.5% Fe &#8594; &#8377;245Cr for 12 tonnes 25mm tube &#8594; India &#8377;6,800Cr naval CuNi &#8594; MDL 6 warships &#8594; 0.05 mm/year erosion &#8594; Biofouling resistant &#8594; 40 year service life' },
  { id: 'CNA-0002', batchNo: 'CNA-B2402', city: 'Hyderabad', manufacturer: 'DRDO DMRL', alloyGrade: 'CuNi 70/30 (C71500)', application: 'Sonar Dome (GRSE)', copperPercent: 69, nickelPercent: 30, investmentCr: 180, status: 'Delivered', priority: 'Critical', origin: 'DMRL Hyderabad (TG)', destination: 'GRSE Kolkata (WB)', shipDate: '2026-07-20', transitDays: 2, zone: 'South', remarks: 'CuNi 70/30 C71500 cast sonar dome for GRSE ASW corvette bow array &#8594; 69% Cu 30% Ni &#8594; &#8377;180Cr for 8 tonnes casting &#8594; India &#8377;4,500Cr naval CuNi 70/30 &#8594; GRSE 20 warships &#8594; Acoustic transparency &#8594; Hydroelastic damping &#8594; 500 m depth rating' },
  { id: 'CNA-0003', batchNo: 'CNA-B2403', city: 'Bengaluru', manufacturer: 'Bharat Electronics', alloyGrade: 'CuNi 90/10 Sheet (C70600)', application: 'Heat Exchanger (BEL)', copperPercent: 88.5, nickelPercent: 10, investmentCr: 72, status: 'Delivered', priority: 'Medium', origin: 'Hindalco Renukoot (UP)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-15', transitDays: 2, zone: 'South', remarks: 'CuNi 90/10 sheet for BEL naval radar cooling plate HX &#8594; 88.5% Cu 10% Ni &#8594; &#8377;72Cr for 2 tonnes 1.5mm sheet &#8594; India &#8377;2,200Cr electronics CuNi &#8594; BEL 500k radars &#8594; Thermal conductivity 50 W/mK &#8594; Seawater corrosion immune' },
  { id: 'CNA-0004', batchNo: 'CNA-B2404', city: 'Pune', manufacturer: 'Bharat Forge', alloyGrade: 'CuNi 70/30 Tube (C71500)', application: 'Condenser (Tata Power)', copperPercent: 69, nickelPercent: 30, investmentCr: 195, status: 'Delivered', priority: 'High', origin: 'Hindalco Renukoot (UP)', destination: 'Tata Power Trombay (MH)', shipDate: '2026-07-22', transitDays: 1, zone: 'West', remarks: 'CuNi 70/30 C71500 tube for Tata Power Trombay condenser tube bank &#8594; 69% Cu 30% Ni &#8594; &#8377;195Cr for 6 tonnes 20mm tube &#8594; India &#8377;5,500Cr power CuNi &#8594; Tata 4 GW Trombay &#8594; Ammonia stress corrosion crack resistance &#8594; 30 year tube life' },
  { id: 'CNA-0005', batchNo: 'CNA-B2405', city: 'Chennai', manufacturer: 'IGCAR Kalpakkam', alloyGrade: 'CuNi 90/10 Tube (C70600)', application: 'Desalination (NPCIL)', copperPercent: 88.5, nickelPercent: 10, investmentCr: 165, status: 'Delivered', priority: 'High', origin: 'Hindalco Renukoot (UP)', destination: 'NPCIL Kudankulam (TN)', shipDate: '2026-07-19', transitDays: 1, zone: 'South', remarks: 'CuNi 90/10 MSF evaporator tube for NPCIL Kudankulam desal plant &#8594; 88.5% Cu 10% Ni &#8594; &#8377;165Cr for 5 tonnes 19mm tube &#8594; India &#8377;4,200Cr desal CuNi &#8594; Kudankulam 2x8,000 m3/day &#8594; Hot brine erosion resistance &#8594; Cu2O protective film' },
  { id: 'CNA-0006', batchNo: 'CNA-B2406', city: 'Noida', manufacturer: 'Sterlite Copper', alloyGrade: 'CuNi 80/20 (C71000)', application: 'Brake Pipe (DMRC)', copperPercent: 79, nickelPercent: 20, investmentCr: 45, status: 'Delivered', priority: 'Medium', origin: 'Sterlite Tuticorin (TN)', destination: 'Alstom Savli (GJ)', shipDate: '2026-07-16', transitDays: 3, zone: 'North', remarks: 'CuNi 80/20 tube for DMRC metro train pneumatic brake pipe &#8594; 79% Cu 20% Ni &#8594; &#8377;45Cr for 800 kg tube &#8594; India &#8377;1,800Cr rail CuNi &#8594; DMRC 390 km &#8594; Fatigue 2M cycles &#8594; 8 bar brake air pressure &#8594; Erosion at 45 deg joints' },
  { id: 'CNA-0007', batchNo: 'CNA-B2407', city: 'Kolkata', manufacturer: 'SAIL Durgapur', alloyGrade: 'CuNi 90/10 Plate (C70600)', application: 'Marine Platform (ONGC)', copperPercent: 88.5, nickelPercent: 10, investmentCr: 135, status: 'Delivered', priority: 'High', origin: 'SAIL Durgapur (WB)', destination: 'ONGC Mumbai (MH)', shipDate: '2026-07-21', transitDays: 1, zone: 'East', remarks: 'CuNi 90/10 sheathing plate for ONGC Mumbai High offshore platform splash zone &#8594; 88.5% Cu 10% Ni &#8594; &#8377;135Cr for 4 tonnes 6mm plate &#8594; India &#8377;3,800Cr offshore CuNi &#8594; ONGC 200+ platforms &#8594; Biofouling prevention &#8594; Tidal zone erosion 0.02 mm/year' },
  { id: 'CNA-0008', batchNo: 'CNA-B2408', city: 'Ahmedabad', manufacturer: 'Gujarat Fluorochemicals', alloyGrade: 'CuNi 70/30 Wire (C71500)', application: 'Thermocouple (Reliance)', copperPercent: 69, nickelPercent: 30, investmentCr: 28, status: 'Delivered', priority: 'Medium', origin: 'GFCL Vadodara (GJ)', destination: 'Reliance Jamnagar (GJ)', shipDate: '2026-07-17', transitDays: 1, zone: 'West', remarks: 'CuNi 70/30 (Constantan) thermocouple wire for Reliance Jamnagar refinery process temp &#8594; 69% Cu 30% Ni &#8594; &#8377;28Cr for 200 kg wire &#8594; India &#8377;1,100Cr TC wire &#8594; Reliance 35 MT refinery &#8594; Type J thermocouple &#8594; EMF 50mV at 800&#176;C &#8594; NIST traceable' },
  { id: 'CNA-0009', batchNo: 'CNA-B2409', city: 'Jaipur', manufacturer: 'Rajasthan Copper Alloys', alloyGrade: 'CuNi 90/10 Fitting (C70600)', application: 'Plumbing Fitting (Kirloskar)', copperPercent: 88.5, nickelPercent: 10, investmentCr: 38, status: 'Delivered', priority: 'Medium', origin: 'RCA Jaipur (RJ)', destination: 'Kirloskar Pune (MH)', shipDate: '2026-07-23', transitDays: 2, zone: 'North', remarks: 'CuNi 90/10 pipe fitting for Kirloskar seawater pump discharge &#8594; 88.5% Cu 10% Ni &#8594; &#8377;38Cr for 1.5 tonnes fitting &#8594; India &#8377;1,500Cr fitting CuNi &#8594; Kirloskar 40% pumps &#8594; Galvanic compatibility CuNi &#8594; Flanged 150# rating' },
  { id: 'CNA-0010', batchNo: 'CNA-B2410', city: 'Coimbatore', manufacturer: 'Tamil Nadu Copper Works', alloyGrade: 'CuNi 70/30 Strip (C71500)', application: 'Coin Blank (SPMCIL)', copperPercent: 69, nickelPercent: 30, investmentCr: 92, status: 'Delivered', priority: 'High', origin: 'TNCW Coimbatore (TN)', destination: 'SPMCIL Kolkata (WB)', shipDate: '2026-07-14', transitDays: 3, zone: 'South', remarks: 'CuNi 70/30 coinage strip for SPMCIL &#8377;10 coin blank (new series) &#8594; 69% Cu 30% Ni &#8594; &#8377;92Cr for 500 tonnes strip &#8594; India &#8377;2,800Cr coinage CuNi &#8594; SPMCIL 3,000 crore coins/year &#8594; Silver appearance &#8594; Wear-resistant 5 year circulation &#8594; Minted at 4 locations' },
  { id: 'CNA-0011', batchNo: 'CNA-B2411', city: 'Bhubaneswar', manufacturer: 'Odisha Copper Industries', alloyGrade: 'CuNi 90/10 Tube (C70600)', application: 'HVAC Coil (Blue Star)', copperPercent: 88.5, nickelPercent: 10, investmentCr: 55, status: 'Delivered', priority: 'Medium', origin: 'OCI Bhubaneswar (OD)', destination: 'Blue Star Noida (UP)', shipDate: '2026-07-25', transitDays: 3, zone: 'East', remarks: 'CuNi 90/10 inner tube for Blue Star seawater-cooled chiller evaporator &#8594; 88.5% Cu 10% Ni &#8594; &#8377;55Cr for 2 tonnes 10mm tube &#8594; India &#8377;1,800Cr HVAC CuNi &#8594; Blue Star 30% India HVAC &#8594; Enhanced surface tube &#8594; 8,000 hour salt spray test' },
  { id: 'CNA-0012', batchNo: 'CNA-B2412', city: 'Guwahati', manufacturer: 'Assam Copper Works', alloyGrade: 'CuNi 70/30 Tube (C71500)', application: 'Water Injection (Oil India)', copperPercent: 69, nickelPercent: 30, investmentCr: 78, status: 'Delayed', priority: 'High', origin: 'ACW Guwahati (AS)', destination: 'Oil India Jorhat (AS)', shipDate: '2026-07-24', transitDays: 12, zone: 'East', remarks: 'CuNi 70/30 downhole tube for Oil India Jorhat water injection well &#8594; 69% Cu 30% Ni &#8594; &#8377;78Cr for 3 tonnes 40mm tube &#8594; 12d delay monsoon logistics &#8594; India &#8377;2,500Cr O&amp;G CuNi &#8594; Oil India 100+ wells &#8594; H2S resistance &#8594; 5 year downhole life' },
  { id: 'CNA-0013', batchNo: 'CNA-B2413', city: 'Gandhinagar', manufacturer: 'Gujarat Copper Technologies', alloyGrade: 'CuNi 80/20 Sheet (C71000)', application: 'Resistor Element (ABB India)', copperPercent: 79, nickelPercent: 20, investmentCr: 32, status: 'Delivered', priority: 'Medium', origin: 'GCT Gandhinagar (GJ)', destination: 'ABB Vadodara (GJ)', shipDate: '2026-07-26', transitDays: 1, zone: 'West', remarks: 'CuNi 80/20 (Constantan) sheet for ABB neutral earthing resistor element &#8594; 79% Cu 20% Ni &#8594; &#8377;32Cr for 400 kg 0.5mm sheet &#8594; India &#8377;1,200Cr resistor CuNi &#8594; ABB 40% India NER &#8594; Resistivity 0.49 uOhm-m &#8594; 200&#176;C continuous rating' },
  { id: 'CNA-0014', batchNo: 'CNA-B2414', city: 'Lucknow', manufacturer: 'UP Copper Alloys', alloyGrade: 'CuNi 90/10 Tube (C70600)', application: 'Fish Farming Cage (RGCA)', copperPercent: 88.5, nickelPercent: 10, investmentCr: 42, status: 'Delivered', priority: 'Low', origin: 'UCA Lucknow (UP)', destination: 'RGCA Kakinada (AP)', shipDate: '2026-07-27', transitDays: 3, zone: 'North', remarks: 'CuNi 90/10 mesh cage for RGCA Kakinada offshore fish farming pen &#8594; 88.5% Cu 10% Ni &#8594; &#8377;42Cr for 1 tonne mesh &#8594; India &#8377;1,400Cr aquaculture CuNi &#8594; RGCA 200 cages &#8594; Antifouling Cu2O release &#8594; No net maintenance 5 years &#8594; 99% fish survival' }
]

export default function CopperNickelAlloyLogisticsView() {
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
    return copperNickelRecords.filter(r => {
      const matchSearch = !searchQuery || Object.values(r).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))
      const matchFilters = Object.entries(filters).every(([key, values]) => values.includes(String(r[key as keyof CopperNickelRecord])))
      return matchSearch && matchFilters
    })
  }, [searchQuery, filters])

  const totalInvestment = useMemo(() => copperNickelRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])
  const avgCu = useMemo(() => (copperNickelRecords.reduce((s: number, r) => s + r.copperPercent, 0) / copperNickelRecords.length).toFixed(1), [])
  const deliveredCount = useMemo(() => copperNickelRecords.filter(r => r.status === 'Delivered').length, [])
  const delayedCount = useMemo(() => copperNickelRecords.filter(r => r.status === 'Delayed').length, [])

  const uniqueCities = useMemo(() => [...new Set(copperNickelRecords.map(r => r.city))], [])
  const uniqueStatuses = useMemo(() => [...new Set(copperNickelRecords.map(r => r.status))], [])
  const uniqueManufacturers = useMemo(() => [...new Set(copperNickelRecords.map(r => r.manufacturer))], [])

  const cityInvestmentMap = useMemo(() => { const map: Record<string, number> = {}; for (const r of copperNickelRecords) { map[r.city] = (map[r.city] || 0) + r.investmentCr } return map }, [])
  const gradeNiMap = useMemo(() => { const map: Record<string, number> = {}; for (const r of copperNickelRecords) { map[r.alloyGrade] = r.nickelPercent } return map }, [])
  const statusCountMap = useMemo(() => { const map: Record<string, number> = {}; for (const r of copperNickelRecords) { map[r.status] = (map[r.status] || 0) + 1 } return map }, [])
  const zoneInvestmentMap = useMemo(() => { const map: Record<string, number> = {}; for (const r of copperNickelRecords) { map[r.zone] = (map[r.zone] || 0) + r.investmentCr } return map }, [])

  const maxCity = useMemo(() => { const e = (Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]); return e[0] || ['N/A', 0] }, [cityInvestmentMap])

  const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights']

  return (
    <div className="space-y-6">
      <PageHeader title="Copper Nickel Alloy Logistics" description="Copper-nickel (CuNi) alloy supply chain for naval seawater piping, sonar domes, desalination evaporators, power plant condensers, offshore platforms, coinage blanks and thermocouple elements across India" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-teal-600 bg-teal-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Total Investment</div><div className="text-2xl font-bold text-teal-800">&#8377;{totalInvestment.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across {copperNickelRecords.length} batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-teal-600 bg-teal-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Avg Cu Content</div><div className="text-2xl font-bold text-teal-800">{avgCu}%</div><div className="text-xs text-muted-foreground mt-1">Across all CuNi grades</div></CardContent></Card>
        <Card className="border-l-4 border-l-teal-600 bg-teal-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Delivered</div><div className="text-2xl font-bold text-teal-800">{deliveredCount}</div><div className="text-xs text-muted-foreground mt-1">{delayedCount} delayed</div></CardContent></Card>
        <Card className="border-l-4 border-l-teal-600 bg-teal-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Top City</div><div className="text-2xl font-bold text-teal-800">{maxCity[0]}</div><div className="text-xs text-muted-foreground mt-1">&#8377;{maxCity[1].toLocaleString()} Cr invested</div></CardContent></Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Input placeholder="Search records..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="max-w-xs" />
        {uniqueCities.map(city => (<Badge key={city} variant={filters.city?.includes(city) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('city', city)}>{city}</Badge>))}
        {uniqueStatuses.map(status => (<Badge key={status} variant={filters.status?.includes(status) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('status', status)}>{status}</Badge>))}
      </div>

      <div className="flex gap-2 border-b">
        {tabs.map(tab => (<button key={tab} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-teal-600 text-teal-800' : 'text-muted-foreground'}`} onClick={() => setActiveTab(tab)}>{tab}</button>))}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by City</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([city, val]) => (<div key={city} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{city}</span><div className="flex-1 bg-teal-100 rounded-full h-3"><div className="bg-teal-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Ni Content by Grade</CardTitle></CardHeader><CardContent className="space-y-2">{copperNickelRecords.slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{r.alloyGrade}</span><div className="flex-1 bg-cyan-100 rounded-full h-3"><div className="bg-cyan-600 h-3 rounded-full" style={{ width: `${Math.min((r.nickelPercent / 35) * 100, 100)}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{r.nickelPercent}%</span></div>))}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Registry' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {uniqueManufacturers.map(mfg => (<Badge key={mfg} variant={filters.manufacturer?.includes(mfg) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('manufacturer', mfg)}>{mfg}</Badge>))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left p-2">Batch</th><th className="text-left p-2">City</th><th className="text-left p-2">Manufacturer</th><th className="text-left p-2">Alloy Grade</th><th className="text-left p-2">Application</th><th className="text-left p-2">Cu%</th><th className="text-left p-2">Ni%</th><th className="text-left p-2">&#8377;Cr</th><th className="text-left p-2">Status</th></tr></thead>
              <tbody>
                {filtered.map(r => (<tr key={r.id} className={`border-b ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2 font-mono text-xs">{r.batchNo}</td><td className="p-2">{r.city}</td><td className="p-2">{r.manufacturer}</td><td className="p-2">{r.alloyGrade}</td><td className="p-2 max-w-[200px] truncate">{r.application}</td><td className="p-2">{r.copperPercent}%</td><td className="p-2">{r.nickelPercent}%</td><td className="p-2 font-medium">&#8377;{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : r.status === 'Delayed' ? 'destructive' : 'secondary'}>{r.status}</Badge></td></tr>))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-sm">Cu Content by Record</CardTitle></CardHeader><CardContent className="space-y-2">{copperNickelRecords.slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{r.alloyGrade}</span><div className="flex-1 bg-teal-100 rounded-full h-3"><div className="bg-teal-600 h-3 rounded-full" style={{ width: `${Math.min((r.copperPercent / 100) * 100, 100)}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{r.copperPercent}%</span></div>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(zoneInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-cyan-100 rounded-full h-3"><div className="bg-cyan-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(statusCountMap) as [string, number][]).map(([status, count]) => (<div key={status} className="flex items-center gap-2"><span className="text-xs w-24">{status}</span><div className="flex-1 bg-teal-100 rounded-full h-3"><div className="bg-teal-600 h-3 rounded-full" style={{ width: `${(count / copperNickelRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of copperNickelRecords) { map[r.priority] = (map[r.priority] || 0) + 1 } return (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([pri, count]) => (<div key={pri} className="flex items-center gap-2"><span className="text-xs w-20">{pri}</span><div className="flex-1 bg-cyan-100 rounded-full h-3"><div className="bg-cyan-600 h-3 rounded-full" style={{ width: `${(count / copperNickelRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipment Volume by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of copperNickelRecords) { map[r.zone] = (map[r.zone] || 0) + 1 } return (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, count]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-indigo-100 rounded-full h-3"><div className="bg-indigo-600 h-3 rounded-full" style={{ width: `${(count / copperNickelRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Grade Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const cats: Record<string, number> = { 'CuNi 90/10 (C70600)': 0, 'CuNi 70/30 (C71500)': 0, 'CuNi 80/20 (C71000)': 0 }; for (const r of copperNickelRecords) { if (r.alloyGrade.includes('90/10')) cats['CuNi 90/10 (C70600)']++; else if (r.alloyGrade.includes('70/30')) cats['CuNi 70/30 (C71500)']++; else cats['CuNi 80/20 (C71000)']++ } return (Object.entries(cats) as [string, number][]).map(([cat, count]) => (<div key={cat} className="flex items-center gap-2"><span className="text-xs w-28">{cat}</span><div className="flex-1 bg-teal-100 rounded-full h-3"><div className="bg-teal-600 h-3 rounded-full" style={{ width: `${(count / copperNickelRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-teal-600"><CardHeader><CardTitle className="text-sm">Naval CuNi 90/10: Mazagon Dock &#8377;6,800Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>CuNi 90/10 (C70600, 88.5% Cu 10% Ni 1.5% Fe) is the Indian Navy&apos;s standard seawater piping material for all warships built at Mazagon Dock (INS Vikrant carrier, Kolkata-class destroyers, Nilgiri-class frigates) and GRSE (ASW corvettes), with India&apos;s naval CuNi market at &#8377;6,800Cr. The 90/10 composition forms a protective Cu2O film in flowing seawater that reduces corrosion to 0.05 mm/year at 3 m/s flow velocity, enabling 40-year service life without replacement. Hindalco Industries produces 15,000 tonnes/year of CuNi 90/10 seamless tube at Renukoot, serving India&apos;s entire naval construction programme including 56 warships under the 10-year defence plan. CuNi 90/10&apos;s unique advantage is its biofouling resistance - copper ion release from the Cu2O film prevents barnacle and algae attachment on the seawater pipe internal surface, maintaining design flow coefficients (Cv) and eliminating the 20% flow reduction seen in SS316L pipes after 5 years. India&apos;s naval CuNi demand will grow 15% CAGR with INS Vishal (65,000 tonne carrier, 2028 keel), 7 Project 17B frigates and 6 Project 75I submarines.</p></CardContent></Card>
          <Card className="border-l-4 border-l-rose-500"><CardHeader><CardTitle className="text-sm">Sonar CuNi 70/30: GRSE &#8377;4,500Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>CuNi 70/30 (C71500, 69% Cu 30% Ni 0.8% Mn) is GRSE and MDL&apos;s selected material for naval sonar dome casting, where the alloy&apos;s acoustic transparency (sound velocity 4,600 m/s, close to seawater&apos;s 1,500 m/s ratio requirement) and hydroelastic damping enable optimal sonar array performance. India&apos;s naval sonar CuNi market is &#8377;4,500Cr, growing 12% CAGR with 12 new sonar-equipped warships under construction. CuNi 70/30&apos;s 30% nickel (vs 10% in 90/10) provides higher strength (UTS 450 MPa vs 350 MPa) for the 500m depth-rated sonar dome pressure hull, while the copper matrix ensures non-magnetic properties essential for bow-mounted array compatibility. DRDO DMRL developed India&apos;s CuNi 70/30 investment casting technology for the APSOH sonar dome (Project 28 ASW corvettes), achieving wall thickness uniformity of plus or minus 1mm over a 2.5m diameter dome - critical for acoustic performance within plus or minus 0.5 dB of design specification. GRSE produces 4 sonar domes/year, each requiring 8 tonnes of CuNi 70/30 casting.</p></CardContent></Card>
          <Card className="border-l-4 border-l-sky-500"><CardHeader><CardTitle className="text-sm">Power Condenser CuNi 70/30: Tata &#8377;5,500Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>CuNi 70/30 (C71500) tube is Tata Power, NTPC and Adani Power&apos;s preferred condenser tube material for steam condenser tube banks at thermal power plants using seawater cooling, with India&apos;s power CuNi market at &#8377;5,500Cr. The 70/30 grade is required for once-through seawater cooling where ammonia stress corrosion cracking (ASCC) risk is high from residual boiler water treatment chemicals. CuNi 70/30&apos;s 30% nickel provides 3x higher resistance to ammonia-induced SCC compared to CuNi 90/10, with each 5m-long condenser tube surviving 30 years at 40&#176;C inlet, 25&#176;C outlet temperature differential. India&apos;s installed thermal capacity of 220 GW includes 80 GW on coastal sites requiring seawater-cooled condensers, with NTPC alone consuming 2,500 tonnes/year of CuNi 70/30 tube. Hindalco Renukoot produces CuNi 70/30 tube to ASTM B111 specification, with eddy current and ultrasonic inspection detecting 0.2mm wall thickness deviations. India&apos;s coastal power capacity will add 30 GW by 2030, driving 15% annual growth in CuNi condenser tube demand.</p></CardContent></Card>
          <Card className="border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm">Coinage CuNi 70/30: SPMCIL &#8377;2,800Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>CuNi 70/30 (C71500) coinage strip is SPMCIL (Security Printing and Minting Corporation of India)&apos;s material for India&apos;s &#8377;10 coin, with a silver-white appearance achieved by the 30% nickel content that matches stainless steel aesthetics while providing 5-year circulation wear resistance. India&apos;s coinage CuNi market is &#8377;2,800Cr, with SPMCIL minting 3,000 crore coins/year across 4 mints (Kolkata, Mumbai, Hyderabad, Noida). CuNi 70/30 replaced cupro-nickel 75/25 for the &#8377;10 coin in 2019 to improve wear life by 40% while maintaining the silver colour that enables vending machine optical coin recognition. The 0.5mm strip is produced by Tamil Nadu Copper Works using cold rolling to 85% reduction, achieving tensile strength of 550 MPa and surface roughness Ra 0.2um for clear embossing of the Ashoka Pillar and denomination symbols. Each tonne of CuNi 70/30 strip produces approximately 3.5 lakh coins, with SPMCIL consuming 8,500 tonnes/year. India&apos;s &#8377;10 coin is the highest-denomination circulating coin, with RBI estimating 2,800 crore pieces in active circulation.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
