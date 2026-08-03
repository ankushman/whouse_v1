'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Crown } from 'lucide-react'

interface VanadiumAlloyRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  alloyGrade: string
  application: string
  vanadiumPercent: number
  tensileStrengthMPa: number
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

const vanadiumRecords: VanadiumAlloyRecord[] = [
  { id: 'VAA-0001', batchNo: 'VAA-B2401', city: 'Mumbai', manufacturer: 'MIDHANI', alloyGrade: 'V-4Cr-4Ti (V-4Cr-4Ti)', application: 'Fusion Blanket (IPR Gandhinagar)', vanadiumPercent: 92, tensileStrengthMPa: 480, investmentCr: 285, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'IPR Gandhinagar (GJ)', shipDate: '2026-07-18', transitDays: 2, zone: 'West', remarks: 'V-4Cr-4Ti sheet for IPR SST-1 DEMO fusion first wall &#8594; 92% V 4Cr 4Ti &#8594; &#8377;285Cr for 10 tonnes &#8594; 480 MPa tensile 600&#176;C &#8594; India &#8377;9,800Cr fusion V market &#8594; DEMO 500 MW 2040 &#8594; Low activation after 14 MeV neutron &#8594; 10x lower waste vs SS316' },
  { id: 'VAA-0002', batchNo: 'VAA-B2402', city: 'Hyderabad', manufacturer: 'DRDO DMRL', alloyGrade: 'Ti-6Al-4V (V stabilised)', application: 'Tejas Airframe (HAL)', vanadiumPercent: 4, tensileStrengthMPa: 950, investmentCr: 420, status: 'Delivered', priority: 'Critical', origin: 'DMRL Hyderabad (TG)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'Ti-6-4 V-stabilised alpha-beta alloy for Tejas airframe forging &#8594; 4% V in Ti &#8594; &#8377;420Cr for 120 tonnes billet &#8594; 950 MPa UTS &#8594; India &#8377;15,000Cr aerospace Ti market &#8594; HAL 40 Tejas Mk-1A + 80 Mk-2 &#8594; V stabilises beta phase for forgeability &#8594; India 85% imports from VSMPO Russia' },
  { id: 'VAA-0003', batchNo: 'VAA-B2403', city: 'Bengaluru', manufacturer: 'Bharat Electronics', alloyGrade: 'Nb-V Microalloy (Nb-1Zr-0.1C)', application: 'Superconductor Wire (DAE)', vanadiumPercent: 5, tensileStrengthMPa: 300, investmentCr: 185, status: 'Delivered', priority: 'Critical', origin: 'BEL Bengaluru (KA)', destination: 'RRCAT Indore (MP)', shipDate: '2026-07-15', transitDays: 2, zone: 'South', remarks: 'Nb-1Zr-0.1C wire for DAE SRF cavity niobium &#8594; 5% V doped &#8594; &#8377;185Cr for 2 tonnes wire &#8594; 300 MPa 2K cryo &#8594; India &#8377;7,200Cr superconductor V &#8594; V raises Tc to 9.8K &#8594; 200+ SRF cavities for 3 GeV synchrotron &#8594; Q factor 10E10 at 2K' },
  { id: 'VAA-0004', batchNo: 'VAA-B2404', city: 'Pune', manufacturer: 'Bharat Forge', alloyGrade: 'V-Cr-Ti (V-5Cr-5Ti)', application: 'Fast Reactor Fuel Pin (IGCAR)', vanadiumPercent: 90, tensileStrengthMPa: 520, investmentCr: 195, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'IGCAR Kalpakkam (TN)', shipDate: '2026-07-22', transitDays: 2, zone: 'West', remarks: 'V-5Cr-5Ti cladding for IGCAR PFBR fast reactor fuel pin &#8594; 90% V &#8594; &#8377;195Cr for 6 tonnes tube &#8594; 520 MPa 700&#176;C NaK &#8594; India &#8377;6,500Cr fast reactor V &#8594; PFBR 500 MW operational 2027 &#8594; Swelling resistance 10x SS316 &#8594; 150 dpa irradiation target' },
  { id: 'VAA-0005', batchNo: 'VAA-B2405', city: 'Chennai', manufacturer: 'SAIL Salem', alloyGrade: 'HSLA V-N (V-0.12% micro)', application: 'Bridge Girder (L&amp;T)', vanadiumPercent: 0.12, tensileStrengthMPa: 550, investmentCr: 42, status: 'Delivered', priority: 'High', origin: 'SAIL Salem (TN)', destination: 'L&amp;T Mumbai (MH)', shipDate: '2026-07-19', transitDays: 1, zone: 'South', remarks: 'V-N microalloyed HSLA plate for L&amp;T Mumbai Trans-Harbour Link &#8594; 0.12% V micro &#8594; &#8377;42Cr for 5,000 tonnes plate &#8594; 550 MPa yield &#8594; India &#8377;1,800Cr HSLA V market &#8594; 22 km sea bridge 6 lanes &#8594; V(CN) precipitation strengthening &#8594; 40% weight saving vs mild steel' },
  { id: 'VAA-0006', batchNo: 'VAA-B2406', city: 'Noida', manufacturer: 'Indian Railways (IR)', alloyGrade: 'V-N Steel Rail (R350HT)', application: 'Railway Track (IR)', vanadiumPercent: 0.08, tensileStrengthMPa: 1135, investmentCr: 85, status: 'Delivered', priority: 'High', origin: 'SAIL BSP Bhilai (CG)', destination: 'IR Delhi Division (DL)', shipDate: '2026-07-16', transitDays: 3, zone: 'North', remarks: 'V-N rail steel R350HT for Indian Railways Vande Bharat route &#8594; 0.08% V micro &#8594; &#8377;85Cr for 15,000 tonnes rail &#8594; 1,135 MPa UTS &#8594; India &#8377;3,500Cr rail V market &#8594; IR 68,000 km track &#8594; V refines pearlite to 15nm &#8594; 30% longer rail life on curves' },
  { id: 'VAA-0007', batchNo: 'VAA-B2407', city: 'Kolkata', manufacturer: 'Shyam Steel', alloyGrade: 'V-Rebar (Fe-500D V)', application: 'Seismic Construction (Shapoorji)', vanadiumPercent: 0.1, tensileStrengthMPa: 540, investmentCr: 38, status: 'Delivered', priority: 'Medium', origin: 'Shyam Steel Kolkata (WB)', destination: 'Shapoorji Mumbai (MH)', shipDate: '2026-07-21', transitDays: 1, zone: 'East', remarks: 'V-microalloyed Fe-500D rebar for Shapoorji high-rise seismic zone &#8594; 0.1% V micro &#8594; &#8377;38Cr for 8,000 tonnes rebar &#8594; 540 MPa yield &#8594; India &#8377;1,500Cr rebar V &#8594; India 60 MT rebar/year &#8594; V replaces cold twisting &#8594; Bend test 180d 4d mandrel pass' },
  { id: 'VAA-0008', batchNo: 'VAA-B2408', city: 'Ahmedabad', manufacturer: 'Gujarat Fluorochemicals', alloyGrade: 'V2O5 Catalyst (98% V2O5)', application: 'SO2 Converter (Paradeep Phosphates)', vanadiumPercent: 56, tensileStrengthMPa: 0, investmentCr: 55, status: 'Delivered', priority: 'High', origin: 'GFCL Vadodara (GJ)', destination: 'PP Ltd Paradeep (OD)', shipDate: '2026-07-17', transitDays: 2, zone: 'West', remarks: 'V2O5 contact catalyst for Paradeep Phosphates sulphuric acid converter &#8594; 56% V as V2O5 &#8594; &#8377;55Cr for 4 tonnes V2O5 &#8594; India &#8377;2,200Cr sulphuric acid catalyst &#8594; India 18 MT H2SO4/year &#8594; 99.7% SO2 conversion efficiency &#8594; 5-year catalyst service life &#8594; K2O-P2O5 promoted' },
  { id: 'VAA-0009', batchNo: 'VAA-B2409', city: 'Jaipur', manufacturer: 'Rajasthan Vanadium Corp', alloyGrade: 'V-Mo Tool Steel (V-5Mo-4Cr)', application: 'Die Casting Mold (Bajaj Auto)', vanadiumPercent: 91, tensileStrengthMPa: 1550, investmentCr: 68, status: 'Delivered', priority: 'Medium', origin: 'RVC Jaipur (RJ)', destination: 'Bajaj Pune (MH)', shipDate: '2026-07-23', transitDays: 3, zone: 'North', remarks: 'V-Mo-Cr tool steel for Bajaj engine block die casting mold &#8594; 91% V &#8594; &#8377;68Cr for 800 kg forging &#8594; 1,550 MPa HRC 52 &#8594; India &#8377;2,800Cr tool steel V &#8594; Bajaj 8 million engines/year &#8594; VC carbides provide hot hardness &#8594; 100,000 shot mold life' },
  { id: 'VAA-0010', batchNo: 'VAA-B2410', city: 'Coimbatore', manufacturer: 'Tamil Nadu Vanadium Alloys', alloyGrade: 'V-N Microalloy Plate', application: 'Ship Hull Plate (GRSE)', vanadiumPercent: 0.1, tensileStrengthMPa: 390, investmentCr: 35, status: 'Delivered', priority: 'High', origin: 'TNVA Coimbatore (TN)', destination: 'GRSE Kolkata (WB)', shipDate: '2026-07-14', transitDays: 2, zone: 'South', remarks: 'V-N HSLA ship plate for GRSE Navy frigate hull &#8594; 0.1% V &#8594; &#8377;35Cr for 2,000 tonnes plate &#8594; 390 MPa yield &#8594; India &#8377;1,400Cr naval HSLA &#8594; GRSE 12 frigates for Navy &#8594; ABS LR DNV grade approved &#8594; -40&#176;C Charpy 60J' },
  { id: 'VAA-0011', batchNo: 'VAA-B2411', city: 'Bhubaneswar', manufacturer: 'Odisha Vanadium Refinery', alloyGrade: 'V-Master Alloy (Al-5V)', application: 'Al Alloy Aerospace (NAL)', vanadiumPercent: 5, tensileStrengthMPa: 580, investmentCr: 42, status: 'Delivered', priority: 'High', origin: 'OVR Bhubaneswar (OD)', destination: 'NAL Bengaluru (KA)', shipDate: '2026-07-25', transitDays: 3, zone: 'East', remarks: 'Al-5V master alloy for NAL Al-Li 2050 aerospace alloy &#8594; 5% V in Al &#8594; &#8377;42Cr for 800 kg &#8594; 580 MPa &#8594; India &#8377;1,800Cr Al-V master &#8594; NAL SARAS Mk-2 &#8594; V refines Al grain &#8594; 15% strength vs Al-Cu alone' },
  { id: 'VAA-0012', batchNo: 'VAA-B2412', city: 'Guwahati', manufacturer: 'Assam Vanadium Industries', alloyGrade: 'V-Cr-Al Oxidation', application: 'Petrochemical Furnace (BPCL)', vanadiumPercent: 85, tensileStrengthMPa: 450, investmentCr: 118, status: 'Delayed', priority: 'High', origin: 'AVI Guwahati (AS)', destination: 'BPCL Bina (MP)', shipDate: '2026-07-24', transitDays: 12, zone: 'East', remarks: 'V-Cr-Al alloy for BPCL ethylene pyrolysis furnace radiant coil &#8594; 85% V &#8594; &#8377;118Cr for 4 tonnes tube &#8594; 450 MPa 1,100&#176;C &#8594; 12d delay monsoon &#8594; India &#8377;4,200Cr petro V &#8594; BPCL 33 MMTPA refinery &#8594; 10x oxidation vs HK40 &#8594; Al2O3 protective scale' },
  { id: 'VAA-0013', batchNo: 'VAA-B2413', city: 'Gandhinagar', manufacturer: 'Gujarat Vanadium Technologies', alloyGrade: 'NaVO3 Redox (Sodium Vanadate)', application: 'VRB Battery (Reliance New Energy)', vanadiumPercent: 25, tensileStrengthMPa: 0, investmentCr: 245, status: 'Delivered', priority: 'Critical', origin: 'GVT Gandhinagar (GJ)', destination: 'RNE Jamnagar (GJ)', shipDate: '2026-07-26', transitDays: 1, zone: 'West', remarks: 'Vanadium redox flow battery electrolyte for Reliance 50 MWh grid storage &#8594; 25% V as V3+/V4+/V5+ &#8594; &#8377;245Cr for 80 tonnes VOSO4 &#8594; India &#8377;8,500Cr VRB market &#8594; Reliance 10 GWh storage 2030 &#8594; 20-year cycle life 15,000 cycles &#8594; Round-trip efficiency 80%' },
  { id: 'VAA-B2414', batchNo: 'VAA-B2414', city: 'Lucknow', manufacturer: 'UP Vanadium Alloys', alloyGrade: 'V-Steel Spring (50CrV4)', application: 'Railway Spring (IR)', vanadiumPercent: 1, tensileStrengthMPa: 1400, investmentCr: 32, status: 'Delivered', priority: 'Medium', origin: 'UVA Lucknow (UP)', destination: 'IR Rail Coach Factory (UP)', shipDate: '2026-07-27', transitDays: 1, zone: 'North', remarks: '50CrV4 spring steel for Indian Railways coil spring &#8594; 1% V &#8594; &#8377;32Cr for 800 tonnes bar &#8594; 1,400 MPa UTS &#8594; India &#8377;1,200Cr spring V &#8594; IR 75,000 coaches &#8594; V refines carbide to VC 0.5um &#8594; Shot peen 5 million cycles' }
]

export default function VanadiumAlloyLogisticsView() {
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
    return vanadiumRecords.filter(r => {
      const matchSearch = !searchQuery || Object.values(r).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))
      const matchFilters = Object.entries(filters).every(([key, values]) => values.includes(String(r[key as keyof VanadiumAlloyRecord])))
      return matchSearch && matchFilters
    })
  }, [searchQuery, filters])

  const totalInvestment = useMemo(() => vanadiumRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])
  const avgV = useMemo(() => (vanadiumRecords.reduce((s: number, r) => s + r.vanadiumPercent, 0) / vanadiumRecords.length).toFixed(1), [])
  const deliveredCount = useMemo(() => vanadiumRecords.filter(r => r.status === 'Delivered').length, [])
  const delayedCount = useMemo(() => vanadiumRecords.filter(r => r.status === 'Delayed').length, [])

  const uniqueCities = useMemo(() => [...new Set(vanadiumRecords.map(r => r.city))], [])
  const uniqueStatuses = useMemo(() => [...new Set(vanadiumRecords.map(r => r.status))], [])
  const uniqueManufacturers = useMemo(() => [...new Set(vanadiumRecords.map(r => r.manufacturer))], [])

  const cityInvestmentMap = useMemo(() => { const map: Record<string, number> = {}; for (const r of vanadiumRecords) { map[r.city] = (map[r.city] || 0) + r.investmentCr } return map }, [])
  const gradeStrengthMap = useMemo(() => { const map: Record<string, number> = {}; for (const r of vanadiumRecords) { if (r.tensileStrengthMPa > 0) map[r.alloyGrade] = r.tensileStrengthMPa } return map }, [])
  const statusCountMap = useMemo(() => { const map: Record<string, number> = {}; for (const r of vanadiumRecords) { map[r.status] = (map[r.status] || 0) + 1 } return map }, [])
  const zoneInvestmentMap = useMemo(() => { const map: Record<string, number> = {}; for (const r of vanadiumRecords) { map[r.zone] = (map[r.zone] || 0) + r.investmentCr } return map }, [])

  const maxCity = useMemo(() => { const e = (Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]); return e[0] || ['N/A', 0] }, [cityInvestmentMap])
  const maxStrength = useMemo(() => { const e = (Object.entries(gradeStrengthMap) as [string, number][]).sort((a, b) => b[1] - a[1]); return e[0] || ['N/A', 0] }, [gradeStrengthMap])

  const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights']

  return (
    <div className="space-y-6">
      <PageHeader title="Vanadium Alloy Logistics" description="Vanadium alloy and compound supply chain for fusion reactor blankets, aerospace Ti-6-4, HSLA bridge girder, railway rail steel, vanadium redox flow batteries, petrochemical furnace tubes and V2O5 sulphuric acid catalysts across India" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-violet-600 bg-violet-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Total Investment</div><div className="text-2xl font-bold text-violet-800">&#8377;{totalInvestment.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across {vanadiumRecords.length} batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-violet-600 bg-violet-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Avg V Content</div><div className="text-2xl font-bold text-violet-800">{avgV}%</div><div className="text-xs text-muted-foreground mt-1">Across all alloy grades</div></CardContent></Card>
        <Card className="border-l-4 border-l-violet-600 bg-violet-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Delivered</div><div className="text-2xl font-bold text-violet-800">{deliveredCount}</div><div className="text-xs text-muted-foreground mt-1">{delayedCount} delayed</div></CardContent></Card>
        <Card className="border-l-4 border-l-violet-600 bg-violet-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Top City</div><div className="text-2xl font-bold text-violet-800">{maxCity[0]}</div><div className="text-xs text-muted-foreground mt-1">&#8377;{maxCity[1].toLocaleString()} Cr invested</div></CardContent></Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Input placeholder="Search records..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="max-w-xs" />
        {uniqueCities.map(city => (<Badge key={city} variant={filters.city?.includes(city) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('city', city)}>{city}</Badge>))}
        {uniqueStatuses.map(status => (<Badge key={status} variant={filters.status?.includes(status) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('status', status)}>{status}</Badge>))}
      </div>

      <div className="flex gap-2 border-b">
        {tabs.map(tab => (<button key={tab} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-violet-600 text-violet-800' : 'text-muted-foreground'}`} onClick={() => setActiveTab(tab)}>{tab}</button>))}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by City</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([city, val]) => (<div key={city} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{city}</span><div className="flex-1 bg-violet-100 rounded-full h-3"><div className="bg-violet-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Tensile Strength by Grade (MPa)</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(gradeStrengthMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([grade, uts]) => (<div key={grade} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{grade}</span><div className="flex-1 bg-purple-100 rounded-full h-3"><div className="bg-purple-600 h-3 rounded-full" style={{ width: `${(uts / maxStrength[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">{uts} MPa</span></div>))}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Registry' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {uniqueManufacturers.map(mfg => (<Badge key={mfg} variant={filters.manufacturer?.includes(mfg) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('manufacturer', mfg)}>{mfg}</Badge>))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left p-2">Batch</th><th className="text-left p-2">City</th><th className="text-left p-2">Manufacturer</th><th className="text-left p-2">Alloy Grade</th><th className="text-left p-2">Application</th><th className="text-left p-2">V%</th><th className="text-left p-2">MPa</th><th className="text-left p-2">&#8377;Cr</th><th className="text-left p-2">Status</th></tr></thead>
              <tbody>
                {filtered.map(r => (<tr key={r.id} className={`border-b ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2 font-mono text-xs">{r.batchNo}</td><td className="p-2">{r.city}</td><td className="p-2">{r.manufacturer}</td><td className="p-2">{r.alloyGrade}</td><td className="p-2 max-w-[200px] truncate">{r.application}</td><td className="p-2">{r.vanadiumPercent}%</td><td className="p-2">{r.tensileStrengthMPa}</td><td className="p-2 font-medium">&#8377;{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : r.status === 'Delayed' ? 'destructive' : 'secondary'}>{r.status}</Badge></td></tr>))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-sm">V Content by Alloy</CardTitle></CardHeader><CardContent className="space-y-2">{vanadiumRecords.slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{r.alloyGrade}</span><div className="flex-1 bg-violet-100 rounded-full h-3"><div className="bg-violet-600 h-3 rounded-full" style={{ width: `${Math.min((r.vanadiumPercent / 100) * 100, 100)}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{r.vanadiumPercent}%</span></div>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(zoneInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-purple-100 rounded-full h-3"><div className="bg-purple-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(statusCountMap) as [string, number][]).map(([status, count]) => (<div key={status} className="flex items-center gap-2"><span className="text-xs w-24">{status}</span><div className="flex-1 bg-violet-100 rounded-full h-3"><div className="bg-violet-600 h-3 rounded-full" style={{ width: `${(count / vanadiumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of vanadiumRecords) { map[r.priority] = (map[r.priority] || 0) + 1 } return (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([pri, count]) => (<div key={pri} className="flex items-center gap-2"><span className="text-xs w-20">{pri}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-600 h-3 rounded-full" style={{ width: `${(count / vanadiumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipment Volume by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of vanadiumRecords) { map[r.zone] = (map[r.zone] || 0) + 1 } return (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, count]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-indigo-100 rounded-full h-3"><div className="bg-indigo-600 h-3 rounded-full" style={{ width: `${(count / vanadiumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Application Category Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const cats: Record<string, number> = { 'Fusion Reactor': 0, 'Aerospace Ti': 0, 'HSLA Struct': 0, 'Railway Steel': 0, 'Catalyst Chem': 0, 'VRB Energy': 0, 'Petro Furnace': 0, 'Tool Steel': 0 }; for (const r of vanadiumRecords) { if (r.application.includes('Fusion') || r.application.includes('Fast Reactor')) cats['Fusion Reactor']++; else if (r.application.includes('Tejas') || r.application.includes('Airframe') || r.application.includes('Superconductor')) cats['Aerospace Ti']++; else if (r.application.includes('Bridge') || r.application.includes('Ship') || r.application.includes('Construction') || r.application.includes('Rebar')) cats['HSLA Struct']++; else if (r.application.includes('Railway') || r.application.includes('Spring')) cats['Railway Steel']++; else if (r.application.includes('SO2') || r.application.includes('sulphur')) cats['Catalyst Chem']++; else if (r.application.includes('VRB') || r.application.includes('Battery') || r.application.includes('storage')) cats['VRB Energy']++; else if (r.application.includes('Petro') || r.application.includes('ethylene')) cats['Petro Furnace']++; else cats['Tool Steel']++ } return (Object.entries(cats) as [string, number][]).map(([cat, count]) => (<div key={cat} className="flex items-center gap-2"><span className="text-xs w-28">{cat}</span><div className="flex-1 bg-violet-100 rounded-full h-3"><div className="bg-violet-600 h-3 rounded-full" style={{ width: `${(count / vanadiumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-violet-600"><CardHeader><CardTitle className="text-sm">Ti-6-4 Aero: HAL Tejas &#8377;15,000Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Titanium Ti-6Al-4V (4% vanadium as beta stabiliser) is India&apos;s aerospace workhorse alloy for HAL Tejas airframe forgings, consuming 120 tonnes/year with &#8377;15,000Cr market value. Vanadium&apos;s critical role is stabilising the body-centred cubic beta phase of titanium at room temperature, enabling the alpha-beta two-phase microstructure that provides 950 MPa tensile strength with 14% elongation - far exceeding alpha-only Ti alloys (600 MPa). India currently imports 85% of its Ti-6-4 from Russia&apos;s VSMPO-Avisma, but MIDHANI is scaling domestic production using the Kroll process with Indian vanadium from Rajasthan Vanadium Corp. HAL&apos;s Tejas programme (40 Mk-1A + 80 Mk-2 + AMCA) will consume 1,000+ tonnes of Ti-6-4 over the next decade. V stabilisation also enables superplastic forming at 900&#176;C for complex airframe shapes, reducing assembly from 50 parts to 5 integrated structures.</p></CardContent></Card>
          <Card className="border-l-4 border-l-rose-500"><CardHeader><CardTitle className="text-sm">VRB Storage: Reliance 10 GWh &#8377;8,500Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Vanadium redox flow batteries (VRFB) using V3+/V4+ in sulphuric acid electrolyte are India&apos;s fastest-growing grid-scale energy storage technology at &#8377;8,500Cr, anchored by Reliance New Energy&apos;s 50 MWh pilot in Jamnagar and a planned 10 GWh gigafactory by 2030. VRFB&apos;s key advantage over Li-ion is 20-year calendar life with 15,000 full charge-discharge cycles (vs Li-ion 3,000 cycles), zero degradation, and no fire risk. Each MWh of VRFB storage requires 8 tonnes of V2O5 equivalent electrolyte. India&apos;s vanadium resource base at Rajasthan Vanadium Corp (deposits in Aravalli range) provides domestic supply, reducing dependence on Chinese V2O5 imports. Reliance&apos;s VRFB system achieves 80% round-trip efficiency at 500 kW/5 MWh container scale, with levelised cost of storage (LCOS) at &#8377;4/kWh - competitive with pumped hydro at &#8377;3/kWh for 8-hour duration applications supporting solar evening peak demand.</p></CardContent></Card>
          <Card className="border-l-4 border-l-sky-500"><CardHeader><CardTitle className="text-sm">V-N Microalloy: L&amp;T Bridge &#8377;1,800Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Vanadium-nitrogen microalloyed HSLA steel (0.12% V) is India&apos;s dominant bridge girder material, specified by L&amp;T for the 22 km Mumbai Trans-Harbour Link (MTHL), NHAI for 1,400 km Bharatmala expressways, and Indian Railways for 3,000 km new freight corridors. India&apos;s HSLA vanadium market is &#8377;1,800Cr, with SAIL Salem and JSW producing 500,000 tonnes/year of V-N HSLA plate. Vanadium&apos;s mechanism is precipitation of vanadium carbonitride V(CN) particles (5-15nm) that impede dislocation motion, raising yield strength from 250 MPa (mild steel) to 550 MPa (V-N HSLA) at only 0.12% V addition costing &#8377;8/kg steel. This 40% weight saving in girder sections translates directly to reduced foundation loads and longer spans. India&apos;s V-N microalloy rail steel (R350HT) achieves 1,135 MPa UTS, enabling 30% longer rail life on Vande Bharat curved track at 160 km/h.</p></CardContent></Card>
          <Card className="border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm">V-4Cr-4Ti Fusion: DEMO 500 MW &#8377;9,800Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Vanadium alloy V-4Cr-4Ti is IPR Gandhinagar&apos;s leading candidate for DEMO fusion reactor (500 MW, 2040) first wall and blanket structural material, operating at 600&#176;C under 14 MeV neutron irradiation from deuterium-tritium fusion plasma. V-4Cr-4Ti&apos;s advantages over competing materials are extraordinary: 10x lower long-lived radioactive waste after decommissioning vs SS316 (Class C vs Class B waste), 3x higher thermal stress limit, no swelling under neutron irradiation up to 150 dpa (vs SS316 swelling crisis at 100 dpa), and liquid lithium compatibility as the breeder coolant. India&apos;s fusion vanadium programme is &#8377;9,800Cr, with MIDHANI producing V-4Cr-4Ti sheet via electron beam melting of V-Cr-Ti master alloy followed by hot rolling. The alloy&apos;s DBTT is -120&#176;C after irradiation, meaning it remains ductile at room temperature throughout reactor life. IPR&apos;s SST-1 (1 MW, operational) and upcoming SST-2 (10 MW) serve as testbeds for V-4Cr-4Ti component qualification before DEMO scale-up.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
