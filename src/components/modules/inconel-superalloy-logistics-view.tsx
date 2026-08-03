'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Factory } from 'lucide-react'

interface InconelRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  alloyGrade: string
  application: string
  nickelPercent: number
  maxTempC: number
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

const inconelRecords: InconelRecord[] = [
  { id: 'ISA-0001', batchNo: 'ISA-B2401', city: 'Mumbai', manufacturer: 'MIDHANI', alloyGrade: 'Inconel 718 (Ni-19Cr-18Fe-5Nb)', application: 'Turbine Disc (HAL)', nickelPercent: 52.5, maxTempC: 700, investmentCr: 320, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-18', transitDays: 2, zone: 'West', remarks: 'Inconel 718 forged disc for HAL Su-30MKI AL-31F HPT disc &#8594; 52.5% Ni &#8594; &#8377;320Cr for 6 tonnes forging &#8594; India &#8377;9,500Cr aero Inconel &#8594; HAL 220 Su-30 fleet &#8594; 700&#176;C capability &#8594; Gamma double prime 650 MPa &#8594; LCF 10,000 cycles' },
  { id: 'ISA-0002', batchNo: 'ISA-B2402', city: 'Hyderabad', manufacturer: 'DRDO DMRL', alloyGrade: 'Inconel 625 (Ni-22Cr-9Mo-3.5Nb)', application: 'Rocket Chamber (ISRO)', nickelPercent: 62, maxTempC: 980, investmentCr: 265, status: 'Delivered', priority: 'Critical', origin: 'DMRL Hyderabad (TG)', destination: 'ISRO Sriharikota (AP)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'Inconel 625 sheet for ISRO PSLV URSC engine thrust chamber &#8594; 62% Ni &#8594; &#8377;265Cr for 3 tonnes 3mm sheet &#8594; India &#8377;7,200Cr space Inconel &#8594; ISRO 12 launches/year &#8594; 980&#176;C UHTRE &#8594; Regenerative cooling channels &#8594; 50 flight cycles per chamber' },
  { id: 'ISA-0003', batchNo: 'ISA-B2403', city: 'Bengaluru', manufacturer: 'Bharat Electronics', alloyGrade: 'Inconel 600 (Ni-16Cr-8Fe)', application: 'Furnace Wire (BEL)', nickelPercent: 72, maxTempC: 1100, investmentCr: 42, status: 'Delivered', priority: 'Medium', origin: 'BEL Bengaluru (KA)', destination: 'BHEL Bhopal (MP)', shipDate: '2026-07-15', transitDays: 2, zone: 'South', remarks: 'Inconel 600 heating element wire for BHEL vacuum furnace &#8594; 72% Ni &#8594; &#8377;42Cr for 800 kg wire &#8594; India &#8377;1,800Cr furnace Inconel &#8594; BHEL 50 furnaces &#8594; 1,100&#176;C air &#8594; 10,000 hour life &#8594; No spalling in oxidising cycle' },
  { id: 'ISA-0004', batchNo: 'ISA-B2404', city: 'Pune', manufacturer: 'Bharat Forge', alloyGrade: 'Inconel 713C (Ni-13Cr-6Al-4.5Mo)', application: 'Turbine Blade (GE India)', nickelPercent: 74, maxTempC: 950, investmentCr: 380, status: 'Delivered', priority: 'Critical', origin: 'Bharat Forge Pune (MH)', destination: 'GE Energy Daman (DD)', shipDate: '2026-07-22', transitDays: 2, zone: 'West', remarks: 'Inconel 713C investment cast blade for GE 9FA gas turbine row 1 bucket &#8594; 74% Ni &#8594; &#8377;380Cr for 2 tonnes cast &#8594; India &#8377;10,500Cr GT blade Inconel &#8594; GE 50+ units India &#8594; 950&#176;C class H &#8594; Gamma prime 30% vol &#8594; DS casting eliminates grain boundary' },
  { id: 'ISA-0005', batchNo: 'ISA-B2405', city: 'Chennai', manufacturer: 'IGCAR Kalpakkam', alloyGrade: 'Inconel 690 (Ni-30Cr-10Fe)', application: 'Steam Generator (NPCIL)', nickelPercent: 60, maxTempC: 650, investmentCr: 290, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'NPCIL Kudankulam (TN)', shipDate: '2026-07-19', transitDays: 1, zone: 'South', remarks: 'Inconel 690 tube for NPCIL Kudankulam SG tube replacement &#8594; 60% Ni &#8594; &#8377;290Cr for 8 tonnes 20mm OD tube &#8594; India &#8377;6,800Cr nuclear Inconel &#8594; Kudankulam 6x1,000 MW &#8594; 650&#176;C PWSCC resistance &#8594; 60 year design life &#8594; Replaces Alloy 800' },
  { id: 'ISA-0006', batchNo: 'ISA-B2406', city: 'Noida', manufacturer: 'Hindustan Aeronautics', alloyGrade: 'Inconel 825 (Ni-22Cr-3Mo-2Cu)', application: 'Exhaust System (HAL)', nickelPercent: 40, maxTempC: 550, investmentCr: 95, status: 'Delivered', priority: 'High', origin: 'HAL Bengaluru (KA)', destination: 'HAL Nasik (MH)', shipDate: '2026-07-16', transitDays: 2, zone: 'North', remarks: 'Inconel 825 sheet for HAL Dhruv helicopter exhaust duct &#8594; 40% Ni &#8594; &#8377;95Cr for 1.5 tonnes 2mm &#8594; India &#8377;3,200Cr helicopter Inconel &#8594; Dhruv 350+ fleet &#8594; 550&#176;C exhaust &#8594; H2SO4 resistance &#8594; 15,000 flight hours life' },
  { id: 'ISA-0007', batchNo: 'ISA-B2407', city: 'Kolkata', manufacturer: 'SAIL Durgapur', alloyGrade: 'Inconel X-750 (Ni-15Cr-7Fe-2.5Ti)', application: 'Spring (BHEL)', nickelPercent: 73, maxTempC: 600, investmentCr: 68, status: 'Delivered', priority: 'High', origin: 'SAIL Durgapur (WB)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-21', transitDays: 1, zone: 'East', remarks: 'Inconel X-750 spring wire for BHEL steam turbine governor valve &#8594; 73% Ni &#8594; &#8377;68Cr for 500 kg wire &#8594; India &#8377;2,500Cr spring Inconel &#8594; BHEL 55% India &#8594; 600&#176;C no relaxation &#8594; 100,000 cycles &#8594; Gamma prime precipitation' },
  { id: 'ISA-0008', batchNo: 'ISA-B2408', city: 'Ahmedabad', manufacturer: 'Gujarat Fluorochemicals', alloyGrade: 'Inconel 601 (Ni-23Cr-1.4Al)', application: 'Petrochemical Reactor (Reliance)', nickelPercent: 60, maxTempC: 1175, investmentCr: 245, status: 'Delivered', priority: 'Critical', origin: 'GFCL Vadodara (GJ)', destination: 'Reliance Jamnagar (GJ)', shipDate: '2026-07-17', transitDays: 1, zone: 'West', remarks: 'Inconel 601 thick plate for Reliance Jamnagar ethylene cracker furnace &#8594; 60% Ni &#8594; &#8377;245Cr for 10 tonnes 50mm plate &#8594; India &#8377;5,800Cr petro Inconel &#8594; Reliance 35 MT refinery &#8594; 1,175&#176;C carburising &#8594; Al2O3 scale protection &#8594; 100,000 hour creep' },
  { id: 'ISA-0009', batchNo: 'ISA-B2409', city: 'Jaipur', manufacturer: 'Rajasthan Nickel Alloys', alloyGrade: 'Inconel 718 Bar (Ni-19Cr-18Fe)', application: 'Fastener (NPCIL)', nickelPercent: 52.5, maxTempC: 700, investmentCr: 55, status: 'Delivered', priority: 'High', origin: 'RNA Jaipur (RJ)', destination: 'NPCIL Rawatbhata (RJ)', shipDate: '2026-07-23', transitDays: 1, zone: 'North', remarks: 'Inconel 718 stud bolt for NPCIL PHWR reactor vessel flange &#8594; 52.5% Ni &#8594; &#8377;55Cr for 2 tonnes bar &#8594; India &#8377;2,200Cr nuclear fastener &#8594; Rawatbhata 6x700 MW &#8594; 700&#176;C bolt-up &#8594; Stress corrosion resistant &#8594; 40 year design life' },
  { id: 'ISA-0010', batchNo: 'ISA-B2410', city: 'Coimbatore', manufacturer: 'Tamil Nadu Nickel Alloys', alloyGrade: 'Inconel 617 (Ni-22Cr-12.5Co-9Mo)', application: 'Reformer Tube (Indian Oil)', nickelPercent: 52, maxTempC: 1100, investmentCr: 310, status: 'Delivered', priority: 'Critical', origin: 'TNNA Coimbatore (TN)', destination: 'Indian Oil Panipat (HR)', shipDate: '2026-07-14', transitDays: 3, zone: 'South', remarks: 'Inconel 617 centrifugal cast tube for Indian Oil Panipat reformer &#8594; 52% Ni 12.5Co &#8594; &#8377;310Cr for 5 tonnes 150mm ID tube &#8594; India &#8377;7,500Cr reformer Inconel &#8594; IOCL 15 refineries &#8594; 1,100&#176;C outlet &#8594; 100,000 hour rupture &#8594; Carburisation resistant' },
  { id: 'ISA-0011', batchNo: 'ISA-B2411', city: 'Bhubaneswar', manufacturer: 'Odisha Nickel Refinery', alloyGrade: 'Inconel 718 Plate (Ni-19Cr-18Fe)', application: 'Aerospace Panel (DRDO)', nickelPercent: 52.5, maxTempC: 700, investmentCr: 88, status: 'Delivered', priority: 'High', origin: 'ONR Bhubaneswar (OD)', destination: 'DRDO Bengaluru (KA)', shipDate: '2026-07-25', transitDays: 3, zone: 'East', remarks: 'Inconel 718 plate for DRDO AMCA fifth-gen fighter engine bay panel &#8594; 52.5% Ni &#8594; &#8377;88Cr for 1.5 tonnes 6mm plate &#8594; India &#8377;3,800Cr aero panel Inconel &#8594; AMCA 2028 first flight &#8594; 700&#176;C engine bay &#8594; Fatigue crack growth &lt;5mm/1,000 cycles &#8594; Friction stir welded' },
  { id: 'ISA-0012', batchNo: 'ISA-B2412', city: 'Guwahati', manufacturer: 'Assam Nickel Works', alloyGrade: 'Inconel 625 Wire (Ni-22Cr-9Mo)', application: 'Overlay (L&amp;T Heavy)', nickelPercent: 62, maxTempC: 980, investmentCr: 125, status: 'Delayed', priority: 'High', origin: 'ANW Guwahati (AS)', destination: 'L&amp;T Hazira (GJ)', shipDate: '2026-07-24', transitDays: 14, zone: 'East', remarks: 'Inconel 625 GTAW wire for L&amp;T offshore platform flare system overlay &#8594; 62% Ni &#8594; &#8377;125Cr for 1.5 tonnes wire &#8594; 14d delay monsoon logistics &#8594; India &#8377;4,200Cr offshore Inconel &#8594; L&amp;T 35% India offshore &#8594; 980&#176;C flare tip &#8594; NACE MR0175 sour service' },
  { id: 'ISA-0013', batchNo: 'ISA-B2413', city: 'Gandhinagar', manufacturer: 'Gujarat Nickel Technologies', alloyGrade: 'Inconel HX (Ni-22Cr-9Mo-18Fe)', application: 'Furnace Bell (Tata Steel)', nickelPercent: 44, maxTempC: 1200, investmentCr: 185, status: 'Delivered', priority: 'High', origin: 'GNT Gandhinagar (GJ)', destination: 'Tata Steel Jamshedpur (JH)', shipDate: '2026-07-26', transitDays: 2, zone: 'West', remarks: 'Inconel HX (Haynes 230) sheet for Tata Steel continuous annealing furnace bell &#8594; 44% Ni &#8594; &#8377;185Cr for 4 tonnes 3mm sheet &#8594; India &#8377;4,800Cr furnace bell Inconel &#8594; Tata 35 MTPA &#8594; 1,200&#176;C reducing &#8594; 50,000 hour cyclic &#8594; Excellent formability vs 600' },
  { id: 'ISA-0014', batchNo: 'ISA-B2414', city: 'Lucknow', manufacturer: 'UP Nickel Alloys', alloyGrade: 'Inconel 276 (Hastelloy C276)', application: 'Scrubber (NTPC)', nickelPercent: 57, maxTempC: 800, investmentCr: 165, status: 'Delivered', priority: 'High', origin: 'UNA Lucknow (UP)', destination: 'NTPC Singrauli (MP)', shipDate: '2026-07-27', transitDays: 2, zone: 'North', remarks: 'Inconel 276 (Hastelloy C276) plate for NTPC FGD wet scrubber &#8594; 57% Ni 16Mo 16Cr &#8594; &#8377;165Cr for 4 tonnes 8mm plate &#8594; India &#8377;5,200Cr FGD Inconel &#8594; NTPC 60 GW coal &#8594; 800&#176;C SO2/Cl &#8594; Pitting resistance 80+ PREN &#8594; Weldable no PWHT' }
]

export default function InconelLogisticsView() {
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
    return inconelRecords.filter(r => {
      const matchSearch = !searchQuery || Object.values(r).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))
      const matchFilters = Object.entries(filters).every(([key, values]) => values.includes(String(r[key as keyof InconelRecord])))
      return matchSearch && matchFilters
    })
  }, [searchQuery, filters])

  const totalInvestment = useMemo(() => inconelRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])
  const avgNi = useMemo(() => (inconelRecords.reduce((s: number, r) => s + r.nickelPercent, 0) / inconelRecords.length).toFixed(1), [])
  const deliveredCount = useMemo(() => inconelRecords.filter(r => r.status === 'Delivered').length, [])
  const delayedCount = useMemo(() => inconelRecords.filter(r => r.status === 'Delayed').length, [])

  const uniqueCities = useMemo(() => [...new Set(inconelRecords.map(r => r.city))], [])
  const uniqueStatuses = useMemo(() => [...new Set(inconelRecords.map(r => r.status))], [])
  const uniqueManufacturers = useMemo(() => [...new Set(inconelRecords.map(r => r.manufacturer))], [])

  const cityInvestmentMap = useMemo(() => { const map: Record<string, number> = {}; for (const r of inconelRecords) { map[r.city] = (map[r.city] || 0) + r.investmentCr } return map }, [])
  const gradeTempMap = useMemo(() => { const map: Record<string, number> = {}; for (const r of inconelRecords) { map[r.alloyGrade] = r.maxTempC } return map }, [])
  const statusCountMap = useMemo(() => { const map: Record<string, number> = {}; for (const r of inconelRecords) { map[r.status] = (map[r.status] || 0) + 1 } return map }, [])
  const zoneInvestmentMap = useMemo(() => { const map: Record<string, number> = {}; for (const r of inconelRecords) { map[r.zone] = (map[r.zone] || 0) + r.investmentCr } return map }, [])

  const maxCity = useMemo(() => { const e = (Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]); return e[0] || ['N/A', 0] }, [cityInvestmentMap])
  const maxTemp = useMemo(() => { const e = (Object.entries(gradeTempMap) as [string, number][]).sort((a, b) => b[1] - a[1]); return e[0] || ['N/A', 0] }, [gradeTempMap])

  const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights']

  return (
    <div className="space-y-6">
      <PageHeader title="Inconel Superalloy Logistics" description="Nickel-based Inconel superalloy supply chain for gas turbine blades and discs, rocket thrust chambers, nuclear steam generators, petrochemical reformers, FGD scrubbers, offshore overlays and furnace components across India" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-emerald-600 bg-emerald-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Total Investment</div><div className="text-2xl font-bold text-emerald-800">&#8377;{totalInvestment.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across {inconelRecords.length} batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-emerald-600 bg-emerald-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Avg Ni Content</div><div className="text-2xl font-bold text-emerald-800">{avgNi}%</div><div className="text-xs text-muted-foreground mt-1">Across all Inconel grades</div></CardContent></Card>
        <Card className="border-l-4 border-l-emerald-600 bg-emerald-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Delivered</div><div className="text-2xl font-bold text-emerald-800">{deliveredCount}</div><div className="text-xs text-muted-foreground mt-1">{delayedCount} delayed</div></CardContent></Card>
        <Card className="border-l-4 border-l-emerald-600 bg-emerald-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Top City</div><div className="text-2xl font-bold text-emerald-800">{maxCity[0]}</div><div className="text-xs text-muted-foreground mt-1">&#8377;{maxCity[1].toLocaleString()} Cr invested</div></CardContent></Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Input placeholder="Search records..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="max-w-xs" />
        {uniqueCities.map(city => (<Badge key={city} variant={filters.city?.includes(city) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('city', city)}>{city}</Badge>))}
        {uniqueStatuses.map(status => (<Badge key={status} variant={filters.status?.includes(status) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('status', status)}>{status}</Badge>))}
      </div>

      <div className="flex gap-2 border-b">
        {tabs.map(tab => (<button key={tab} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-emerald-600 text-emerald-800' : 'text-muted-foreground'}`} onClick={() => setActiveTab(tab)}>{tab}</button>))}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by City</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([city, val]) => (<div key={city} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{city}</span><div className="flex-1 bg-emerald-100 rounded-full h-3"><div className="bg-emerald-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Max Temp by Grade</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(gradeTempMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([grade, temp]) => (<div key={grade} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{grade}</span><div className="flex-1 bg-green-100 rounded-full h-3"><div className="bg-green-600 h-3 rounded-full" style={{ width: `${(temp / maxTemp[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{temp}&#176;C</span></div>))}</CardContent></Card>
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
                {filtered.map(r => (<tr key={r.id} className={`border-b ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2 font-mono text-xs">{r.batchNo}</td><td className="p-2">{r.city}</td><td className="p-2">{r.manufacturer}</td><td className="p-2">{r.alloyGrade}</td><td className="p-2 max-w-[200px] truncate">{r.application}</td><td className="p-2">{r.nickelPercent}%</td><td className="p-2">{r.maxTempC}&#176;C</td><td className="p-2 font-medium">&#8377;{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : r.status === 'Delayed' ? 'destructive' : 'secondary'}>{r.status}</Badge></td></tr>))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-sm">Ni Content by Grade</CardTitle></CardHeader><CardContent className="space-y-2">{inconelRecords.slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{r.alloyGrade}</span><div className="flex-1 bg-emerald-100 rounded-full h-3"><div className="bg-emerald-600 h-3 rounded-full" style={{ width: `${Math.min((r.nickelPercent / 100) * 100, 100)}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{r.nickelPercent}%</span></div>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(zoneInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-green-100 rounded-full h-3"><div className="bg-green-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(statusCountMap) as [string, number][]).map(([status, count]) => (<div key={status} className="flex items-center gap-2"><span className="text-xs w-24">{status}</span><div className="flex-1 bg-emerald-100 rounded-full h-3"><div className="bg-emerald-600 h-3 rounded-full" style={{ width: `${(count / inconelRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of inconelRecords) { map[r.priority] = (map[r.priority] || 0) + 1 } return (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([pri, count]) => (<div key={pri} className="flex items-center gap-2"><span className="text-xs w-20">{pri}</span><div className="flex-1 bg-green-100 rounded-full h-3"><div className="bg-green-600 h-3 rounded-full" style={{ width: `${(count / inconelRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipment Volume by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of inconelRecords) { map[r.zone] = (map[r.zone] || 0) + 1 } return (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, count]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-indigo-100 rounded-full h-3"><div className="bg-indigo-600 h-3 rounded-full" style={{ width: `${(count / inconelRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Alloy Category Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const cats: Record<string, number> = { 'IN 718/713C Aero': 0, 'IN 625/617 High-T': 0, 'IN 600/601/690 Nuclear': 0, 'IN 825/X-750 Utility': 0, 'IN HX Furnace': 0, 'IN 276 C276 Chem': 0 }; for (const r of inconelRecords) { if (r.alloyGrade.includes('718') || r.alloyGrade.includes('713')) cats['IN 718/713C Aero']++; else if (r.alloyGrade.includes('625') || r.alloyGrade.includes('617')) cats['IN 625/617 High-T']++; else if (r.alloyGrade.includes('600') || r.alloyGrade.includes('601') || r.alloyGrade.includes('690')) cats['IN 600/601/690 Nuclear']++; else if (r.alloyGrade.includes('825') || r.alloyGrade.includes('X-750')) cats['IN 825/X-750 Utility']++; else if (r.alloyGrade.includes('HX') || r.alloyGrade.includes('230')) cats['IN HX Furnace']++; else cats['IN 276 C276 Chem']++ } return (Object.entries(cats) as [string, number][]).map(([cat, count]) => (<div key={cat} className="flex items-center gap-2"><span className="text-xs w-28">{cat}</span><div className="flex-1 bg-emerald-100 rounded-full h-3"><div className="bg-emerald-600 h-3 rounded-full" style={{ width: `${(count / inconelRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-emerald-600"><CardHeader><CardTitle className="text-sm">IN 718 Disc: HAL Su-30MKI &#8377;9,500Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Inconel 718 (Ni-19Cr-18Fe-5Nb-3Mo, 52.5% Ni) is India&apos;s dominant nickel superalloy for HAL Su-30MKI AL-31F high-pressure turbine disc, operating at 700&#176;C with gamma-double-prime precipitation strengthening to 650 MPa yield. MIDHANI is India&apos;s sole qualified IN 718 disc producer, supplying 120 tonnes/year of triple-melted (VIM+ESR+VAR) forgings to HAL for 220 Su-30MKI engine overhauls and 40 Tejas Mk-1A engines. India&apos;s aerospace Inconel 718 market is &#8377;9,500Cr, growing 18% CAGR with GE&apos;s T408 engine for AMCA, Snecma M88 for Rafale and Rolls-Royce Adour for Jaguar all requiring IN 718 discs. IN 718&apos;s advantage is its weldability and 700&#176;C strength - higher than IN 600 (550&#176;C) but lower than single-crystal CMSX-4 (1,150&#176;C). MIDHANI&apos;s triple melting achieves less than 20 ppm oxygen and 10 ppm sulphur, critical for low-cycle fatigue life of 10,000 cycles at 650&#176;C, 800 MPa stress range. HAL&apos;s Su-30 engine overhaul rate is 40 units/year, each consuming 800 kg of IN 718 in disc, blade and seal components.</p></CardContent></Card>
          <Card className="border-l-4 border-l-rose-500"><CardHeader><CardTitle className="text-sm">IN 625 Rocket: ISRO PSLV &#8377;7,200Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Inconel 625 (Ni-22Cr-9Mo-3.5Nb, 62% Ni) sheet is ISRO&apos;s material of choice for PSLV and GSLV Mk-III URSC liquid engine thrust chamber, where regenerative cooling channels are milled into 3mm IN 625 sheet and then diffusion-bonded into a monolithic structure. India&apos;s space Inconel market is &#8377;7,200Cr, with ISRO conducting 12 launches/year (PSLV + GSLV) consuming 8 tonnes/year of IN 625. The 22% chromium and 9% molybdenum provide exceptional oxidation resistance at the 980&#176;C combustion gas temperature, while the niobium (3.5%) strengthens the grain boundaries to resist creep during the 600-second burn time. DRDO DMRL developed India&apos;s IN 625 sheet rolling capability in 2020, enabling 2.5m wide sheets for GSLV Mk-III S200 solid booster nozzle. The upcoming Gaganyaan crewed mission requires 3 tonnes of IN 625 for the crew escape motor thrust chamber, operating at 1,100&#176;C for 3 seconds. ISRO&apos;s IN 625 consumption will reach 15 tonnes/year by 2028 with the Next Generation Launch Vehicle (NGLV).</p></CardContent></Card>
          <Card className="border-l-4 border-l-sky-500"><CardHeader><CardTitle className="text-sm">IN 690 Nuclear: NPCIL Kudankulam &#8377;6,800Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Inconel 690 (Ni-30Cr-10Fe, 60% Ni) tubing is the gold standard for nuclear steam generator (SG) tubes at NPCIL Kudankulam, replacing Alloy 600 that suffered primary water stress corrosion cracking (PWSCC) in early VVER units. India&apos;s nuclear Inconel market is &#8377;6,800Cr, with NPCIL operating 22 reactors (7,500 MW) and building 10 more (10,000 MW by 2032). IN 690&apos;s 30% chromium (vs 16% in Alloy 600) forms a thicker, more protective Cr2O3 layer that resists PWSCC in 300&#176;C, 150 bar D2O/steam environment for 60 years - a requirement no other alloy meets. Each VVER-1000 SG contains 55,000 IN 690 U-bend tubes (20mm OD, 1.2mm wall), with NPCIL ordering 100 tonnes of IN 690 tube per reactor replacement cycle. MIDHANI produces IN 690 tube to ASTM B163/B166 specifications, with surface finish Ra &lt;0.4um and eddy-current inspection detecting 0.2mm deep defects. India&apos;s nuclear fleet will require 2,000 tonnes of IN 690 tube by 2035.</p></CardContent></Card>
          <Card className="border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm">IN 601 Petro: Reliance Jamnagar &#8377;5,800Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Inconel 601 (Ni-23Cr-1.4Al, 60% Ni) thick plate is Reliance Industries&apos; selected material for ethylene cracker furnace tubes and pyrolysis coils at Jamnagar, the world&apos;s largest refinery (35 MTPA). India&apos;s petrochemical Inconel market is &#8377;5,800Cr, with Reliance, Indian Oil, Nayara Energy and BPCL operating 15 refineries consuming 30 tonnes/year of IN 601. The 1.4% aluminium addition forms a continuous Al2O3 scale at 1,175&#176;C that protects against carburisation in hydrocarbon atmospheres - unlike IN 600 which suffers carbon uptake and embrittlement. Each cracker furnace contains 200 IN 601 centrifugal cast tubes (150mm ID, 12mm wall) operating at 1,175&#176;C outlet temperature and 2 bar ethylene. Gujarat Fluorochemicals produces IN 601 plate up to 50mm thickness by hot rolling MIDHANI-provided slabs, serving Reliance&apos;s Jamnagar and Vadodara complexes. Reliance&apos;s new cracker unit (ethanol-to-ethylene) requires 5 tonnes of IN 601 at 1,200&#176;C - beyond the capability of any other nickel alloy. India&apos;s IN 601 demand will grow 12% CAGR with new petrochemical crackers planned by Haldia Petrochemical and ONGC Mangalore.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
