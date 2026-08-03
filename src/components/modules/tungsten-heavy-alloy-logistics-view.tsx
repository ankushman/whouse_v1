'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Hammer } from 'lucide-react'

interface TungstenHeavyAlloyRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  alloyGrade: string
  application: string
  tungstenPercent: number
  densityGcm3: number
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

const tungstenRecords: TungstenHeavyAlloyRecord[] = [
  { id: 'WHA-0001', batchNo: 'WHA-B2401', city: 'Hyderabad', manufacturer: 'MIDHANI', alloyGrade: 'D178 (90W-6Ni-4Fe)', application: 'Kinetic Energy Penetrator (DRDO OFB)', tungstenPercent: 90, densityGcm3: 17.0, investmentCr: 295, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TS)', destination: 'OFB Varangaon (MH)', shipDate: '2026-07-18', transitDays: 2, zone: 'South', remarks: 'D178 WHA rod for 125mm FSAPDS kinetic energy penetrator &#8594; 90% W with 6% Ni 4% Fe liquid phase sintered &#8594; &#8377;295Cr for 12 tonnes D178 rod stock &#8594; Indian Army T-90 Bhishma and Arjun Mk2 tank ammunition &#8594; D178 density 17.0 g/cm3 vs DU 19.1 g/cm3 &#8594; India 3rd largest tank fleet 4,600 tanks &#8594; &#8377;22,000Cr Indian KE penetrator WHA demand' },
  { id: 'WHA-0002', batchNo: 'WHA-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', alloyGrade: 'W-Ni-Cu (97W-2Ni-1Cu)', application: 'Counterweight Balance (ISRO PSLV)', tungstenPercent: 97, densityGcm3: 18.5, investmentCr: 185, status: 'In Transit', priority: 'High', origin: 'DRDO DMRL Hyderabad (TS)', destination: 'ISRO SDSC Sriharikota (AP)', shipDate: '2026-07-22', transitDays: 1, zone: 'South', remarks: '97W-Ni-Cu counterweight for PSLV satellite deployment mechanism &#8594; 97% W ultra-high density precision machined &#8594; &#8377;185Cr for 8 tonnes counterweight assemblies &#8594; ISRO launching 12 PSLV missions/year &#8594; 97W density 18.5 g/cm3 for compact counterweight design &#8594; DRDO developing powder metallurgy 97W for space programme &#8594; &#8377;14,500Cr Indian space WHA demand' },
  { id: 'WHA-0003', batchNo: 'WHA-B2403', city: 'Mumbai', manufacturer: 'Tata Advanced Materials', alloyGrade: 'W-Ni-Fe (93W-4.5Ni-2.5Fe)', application: 'Radiation Shielding (BARC Mumbai)', tungstenPercent: 93, densityGcm3: 17.5, investmentCr: 340, status: 'Delivered', priority: 'Critical', origin: 'TAM Mumbai (MH)', destination: 'BARC Trombay Mumbai (MH)', shipDate: '2026-07-19', transitDays: 1, zone: 'West', remarks: '93W-Ni-Fe WHA radiation shielding for nuclear research reactor &#8594; 93% W for gamma radiation attenuation &#8594; &#8377;340Cr for 25 tonnes shielding blocks &#8594; BARC Dhruva and upcoming PBFR research reactors &#8594; W-Ni-Fe shielding 1.4x denser than lead at same thickness &#8594; India 22 nuclear reactors operational 10 under construction &#8594; &#8377;28,000Cr Indian nuclear shielding WHA demand' },
  { id: 'WHA-0004', batchNo: 'WHA-B2404', city: 'Pune', manufacturer: 'Bharat Forge Ltd', alloyGrade: 'W-Cu (80W-20Cu)', application: 'EDM Electrode (Bharat Forge)', tungstenPercent: 80, densityGcm3: 15.0, investmentCr: 128, status: 'Delayed', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'Kirloskar Pune (MH)', shipDate: '2026-07-12', transitDays: 1, zone: 'West', remarks: 'W-Cu 80:20 EDM electrode for aerospace turbine disc machining &#8594; 80% W with 20% Cu for thermal conductivity &#8594; &#8377;128Cr for 4 tonnes W-Cu electrode stock &#8594; Bharat Forge producing 2,000 turbine discs/year &#8594; W-Cu EDM wear rate 0.02 mm3/min vs Cu 0.08 mm3/min &#8594; Delayed 10 days due to tungsten powder import delay &#8594; &#8377;9,500Cr Indian EDM WHA demand' },
  { id: 'WHA-0005', batchNo: 'WHA-B2405', city: 'Chennai', manufacturer: 'IGCAR Kalpakkam', alloyGrade: 'W-Re (95W-5Re)', application: 'Fusion Reactor First Wall (IPR SST-2)', tungstenPercent: 95, densityGcm3: 19.3, investmentCr: 420, status: 'Processing', priority: 'Critical', origin: 'IGCAR Kalpakkam (TN)', destination: 'IPR Gandhinagar (GJ)', shipDate: '2026-07-25', transitDays: 2, zone: 'South', remarks: 'W-Re 95:5 for SST-2 tokamak divertor plasma-facing component &#8594; 95% W with 5% Re for recrystallization resistance &#8594; &#8377;420Cr for 6 tonnes W-Re plate stock &#8594; IPR SST-2 upgraded tokamak divertor design &#8594; W-Re retains 80% ductility after 10 dpa neutron damage &#8594; India contributing ITER divertor tungsten qualification &#8594; &#8377;35,000Cr Indian fusion WHA demand' },
  { id: 'WHA-0006', batchNo: 'WHA-B2406', city: 'Noida', manufacturer: 'BEL', alloyGrade: 'W-Ni-Fe (91W-6Ni-3Fe)', application: 'Missile Fin Assembly (DRDO BrahMos)', tungstenPercent: 91, densityGcm3: 17.2, investmentCr: 198, status: 'Delivered', priority: 'Critical', origin: 'BEL Bengaluru (KA)', destination: 'BrahMos Aerospace Hyderabad (TS)', shipDate: '2026-07-17', transitDays: 2, zone: 'North', remarks: '91W-Ni-Fe WHA for BrahMos missile control fin mass balance &#8594; 91% W precision investment cast fin weight &#8594; &#8377;198Cr for 3.5 tonnes fin assemblies &#8594; BrahMos producing 100 missiles/year &#8594; WHA fin weight optimizes Mach 3 aerodynamic stability &#8594; India exporting BrahMos to Philippines and Indonesia &#8594; &#8377;15,200Cr Indian missile WHA demand' },
  { id: 'WHA-0007', batchNo: 'WHA-B2407', city: 'Kolkata', manufacturer: 'SAIL Bhilai', alloyGrade: 'W-Heavy Metal (95W)', application: 'Crusher Mill Liner (SAIL BSP Mining)', tungstenPercent: 95, densityGcm3: 18.0, investmentCr: 86, status: 'In Transit', priority: 'Medium', origin: 'MIDHANI Hyderabad (TS)', destination: 'SAIL BSP Bhilai (CG)', shipDate: '2026-07-21', transitDays: 3, zone: 'East', remarks: '95W heavy metal wear liner for cone crusher grinding chamber &#8594; 95% W sintered liner for iron ore crushing &#8594; &#8377;86Cr for 8 tonnes liner segments &#8594; SAIL Bhilai 7 MT steel plant iron ore processing &#8594; W liner wear life 18 months vs Mn steel 8 months &#8594; India 250 MT crude steel mining crusher demand &#8594; &#8377;6,800Cr Indian mining WHA demand' },
  { id: 'WHA-0008', batchNo: 'WHA-B2408', city: 'Ahmedabad', manufacturer: 'Gujarat Fluorochemicals Ltd', alloyGrade: 'W-Ni-Cu (90W-7Ni-3Cu)', application: 'X-Ray Tube Target (HLL Ahmedabad)', tungstenPercent: 90, densityGcm3: 16.8, investmentCr: 165, status: 'Delivered', priority: 'High', origin: 'GFCL Ahmedabad (GJ)', destination: 'HLL Ahmedabad (GJ)', shipDate: '2026-07-16', transitDays: 0, zone: 'West', remarks: 'W-Ni-Cu 90-7-3 rotating anode target for CT X-ray tube &#8594; 90% W target disc 200mm diameter &#8594; &#8377;165Cr for 500 target discs &#8594; HLL supplying 5,000 CT tubes/year &#8594; W-Ni-Cu thermal conductivity 100 W/mK &#8594; India installing 15,000 CT scanners by 2030 &#8594; &#8377;12,500Cr Indian medical imaging WHA demand' },
  { id: 'WHA-0009', batchNo: 'WHA-B2409', city: 'Jaipur', manufacturer: 'Rajasthan State Mines', alloyGrade: 'W-Ni-Mn (95W-3Ni-2Mn)', application: 'Ordnance Fragmentation Shell (OFB Jaipur)', tungstenPercent: 95, densityGcm3: 18.2, investmentCr: 145, status: 'Processing', priority: 'High', origin: 'OFB Jaipur (RJ)', destination: 'Indian Army Jaisalmer (RJ)', shipDate: '2026-07-24', transitDays: 1, zone: 'North', remarks: 'W-Ni-Mn 95:3:2 pre-fragmented warhead shell casing &#8594; 95% W controlled fragmentation pattern &#8594; &#8377;145Cr for 6 tonnes WHA shell casings &#8594; Indian Artillery 155mm Bofors ammunition &#8594; WHA fragmentation lethality 2.5x steel at same velocity &#8594; OFB producing 50,000 shells/year &#8594; &#8377;11,200Cr Indian ordnance WHA demand' },
  { id: 'WHA-0010', batchNo: 'WHA-B2410', city: 'Coimbatore', manufacturer: 'IIT Madras', alloyGrade: 'W-Cr (70W-30Cr)', application: 'Plasma Spray Coating (GE Aviation)', tungstenPercent: 70, densityGcm3: 14.0, investmentCr: 72, status: 'Delivered', priority: 'Medium', origin: 'IIT Madras (TN)', destination: 'GE TIL Bengaluru (KA)', shipDate: '2026-07-18', transitDays: 2, zone: 'South', remarks: 'W-Cr 70:30 plasma spray powder for turbine blade coating &#8594; 70% W with 30% Cr thermal barrier &#8594; &#8377;72Cr for 2 tonnes W-Cr spray powder &#8594; GE TIL maintaining 800 LEAP engines/year &#8594; W-Cr coating service life 25,000hr at 1200&#176;C &#8594; IIT Madras developing nano-structured W-Cr HVOF process &#8594; &#8377;5,500Cr Indian aerospace coating WHA demand' },
  { id: 'WHA-0011', batchNo: 'WHA-B2411', city: 'Bhubaneswar', manufacturer: 'NALCO', alloyGrade: 'W-Heavy Alloy (92W-5Ni-3Fe)', application: 'Oil Well Logging Tool (ONGC Mumbai)', tungstenPercent: 92, densityGcm3: 17.4, investmentCr: 108, status: 'In Transit', priority: 'High', origin: 'NALCO Angul (OD)', destination: 'ONGC Mumbai (MH)', shipDate: '2026-07-23', transitDays: 3, zone: 'East', remarks: '92W-5Ni-3Fe WHA for MWD/LWD logging tool housing &#8594; 92% W pressure housing for 15,000 psi downhole &#8594; &#8377;108Cr for 5 tonnes WHA housings &#8594; ONGC operating 350 offshore wells KG Basin &#8594; WHA housing 2.7x denser than steel for compact MWD tool &#8594; India drilling 1,000 new wells/year upstream &#8594; &#8377;8,200Cr Indian oilfield WHA demand' },
  { id: 'WHA-0012', batchNo: 'WHA-B2412', city: 'Guwahati', manufacturer: 'Oil India Ltd', alloyGrade: 'W-Ag (50W-50Ag)', application: 'Electrical Contact (Assam Power Grid)', tungstenPercent: 50, densityGcm3: 14.5, investmentCr: 42, status: 'Delayed', priority: 'Medium', origin: 'Oil India Jorhat (AS)', destination: 'APGCL Guwahati (AS)', shipDate: '2026-07-11', transitDays: 1, zone: 'East', remarks: 'W-Ag 50:50 electrical contact for high-voltage switchgear &#8594; 50% W with 50% Ag for arc resistance &#8594; &#8377;42Cr for 1.5 tonnes W-Ag contact rivets &#8594; Assam Power Grid 400kV substation upgrade &#8594; W-Ag contact life 100,000 operations at 400A &#8594; Delayed 12 days due to monsoon road flooding &#8594; &#8377;3,200Cr Indian power grid WHA demand' },
  { id: 'WHA-0013', batchNo: 'WHA-B2413', city: 'Gandhinagar', manufacturer: 'Adani Defence', alloyGrade: 'W-Ni-Co (94W-4Ni-2Co)', application: 'Smart Munition Casing (DRDO Smart Shell)', tungstenPercent: 94, densityGcm3: 17.8, investmentCr: 310, status: 'Processing', priority: 'Critical', origin: 'MIDHANI Hyderabad (TS)', destination: 'Adani Defence Gandhinagar (GJ)', shipDate: '2026-07-26', transitDays: 2, zone: 'West', remarks: 'W-Ni-Co 94:4:2 for GPS-guided smart munition terminal trajectory &#8594; 94% W for precision machined guidance kit housing &#8594; &#8377;310Cr for 4 tonnes WHA guidance housing &#8594; DRDO smart shell programme 155mm GPS-guided &#8594; W-Ni-Co tensile strength 950 MPa at RT &#8594; India 2028 smart munition production target 20,000/year &#8594; &#8377;24,000Cr Indian smart munition WHA demand' },
  { id: 'WHA-0014', batchNo: 'WHA-B2414', city: 'Lucknow', manufacturer: 'TASL', alloyGrade: 'W-Re-Os (96W-3Re-1Os)', application: 'Satellite Thruster Nozzle (ISRO GSAT)', tungstenPercent: 96, densityGcm3: 19.5, investmentCr: 245, status: 'Delivered', priority: 'Critical', origin: 'TASL Lucknow (UP)', destination: 'ISRO LPSC Trivandrum (KL)', shipDate: '2026-07-23', transitDays: 3, zone: 'North', remarks: 'W-Re-Os 96:3:1 thruster nozzle for satellite apogee motor &#8594; 96% W ultra-refractory nozzle for 3000&#176;C exhaust &#8594; &#8377;245Cr for 2 tonnes W-Re-Os nozzle blanks &#8594; ISRO 12 GSAT satellites requiring apogee motors &#8594; W-Re-Os creep rupture 1000hr at 2000&#176;C &#8594; TASL-ISRO JV for space-grade tungsten alloy &#8594; &#8377;18,500Cr Indian space thruster WHA demand' },
]

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const
type TabType = typeof tabs[number]

export default function TungstenHeavyAlloyLogisticsView() {
  const [activeTab, setActiveTab] = useState<TabType>('Dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Record<string, string[]>>({})

  const toggleFilter = (key: string, value: string) => {
    setFilters(prev => {
      const current = prev[key] || []
      if (current.includes(value)) {
        const updated = current.filter(v => v !== value)
        if (updated.length === 0) {
          const next = { ...prev }
          delete next[key]
          return next
        }
        return { ...prev, [key]: updated }
      }
      return { ...prev, [key]: [...current, value] }
    })
  }

  const filtered = useMemo(() => {
    return tungstenRecords.filter(r => {
      const matchesSearch = searchQuery === '' ||
        Object.values(r).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))
      if (!matchesSearch) return false
      for (const [key, values] of Object.entries(filters)) {
        if (values.length === 0) continue
        const rv = String((r as unknown as Record<string, unknown>)[key] ?? '')
        if (!values.some(v => rv.toLowerCase().includes(v.toLowerCase()))) return false
      }
      return true
    })
  }, [searchQuery, filters])

  const uniqueCities = useMemo(() => [...new Set(tungstenRecords.map(r => r.city))].sort(), [])
  const uniqueManufacturers = useMemo(() => [...new Set(tungstenRecords.map(r => r.manufacturer))].sort(), [])
  const uniqueStatuses = useMemo(() => [...new Set(tungstenRecords.map(r => r.status))].sort(), [])
  const uniqueZones = useMemo(() => [...new Set(tungstenRecords.map(r => r.zone))].sort(), [])

  const totalInvestment = useMemo(() => tungstenRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])
  const avgDensity = useMemo(() => (tungstenRecords.reduce((s: number, r) => s + r.densityGcm3, 0) / tungstenRecords.length).toFixed(1), [])
  const deliveredCount = useMemo(() => tungstenRecords.filter(r => r.status === 'Delivered').length, [])
  const delayedCount = useMemo(() => tungstenRecords.filter(r => r.status === 'Delayed').length, [])

  const cityInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of tungstenRecords) { map[r.city] = (map[r.city] || 0) + r.investmentCr }
    return map
  }, [])

  const alloyDensityMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of tungstenRecords) { map[r.alloyGrade] = (map[r.alloyGrade] || 0) + r.densityGcm3 }
    return map
  }, [])

  const statusCountMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of tungstenRecords) { map[r.status] = (map[r.status] || 0) + 1 }
    return map
  }, [])

  const zoneInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of tungstenRecords) { map[r.zone] = (map[r.zone] || 0) + r.investmentCr }
    return map
  }, [])

  const maxCity = useMemo(() => {
    const entries = (Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [cityInvestmentMap])

  const maxDensityAlloy = useMemo(() => {
    const entries = (Object.entries(alloyDensityMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [alloyDensityMap])

  return (
    <div className="space-y-6">
      <PageHeader title="Tungsten Heavy Alloy Logistics" description="Tungsten heavy alloy supply chain for kinetic energy penetrators, radiation shielding, fusion reactors, counterweights, oil well tools and satellite thrusters" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-orange-700 bg-orange-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Total Investment</div><div className="text-2xl font-bold text-orange-800">&#8377;{totalInvestment.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across {tungstenRecords.length} batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-orange-700 bg-orange-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Avg Density</div><div className="text-2xl font-bold text-orange-800">{avgDensity} g/cm3</div><div className="text-xs text-muted-foreground mt-1">Heavy alloy range</div></CardContent></Card>
        <Card className="border-l-4 border-l-orange-700 bg-orange-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Delivered</div><div className="text-2xl font-bold text-orange-800">{deliveredCount}</div><div className="text-xs text-muted-foreground mt-1">{delayedCount} delayed</div></CardContent></Card>
        <Card className="border-l-4 border-l-orange-700 bg-orange-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Top City</div><div className="text-2xl font-bold text-orange-800">{maxCity[0]}</div><div className="text-xs text-muted-foreground mt-1">&#8377;{maxCity[1].toLocaleString()} Cr invested</div></CardContent></Card>
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
          <button key={tab} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-orange-700 text-orange-800' : 'text-muted-foreground'}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by City</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([city, val]) => (<div key={city} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{city}</span><div className="flex-1 bg-orange-100 rounded-full h-3"><div className="bg-orange-700 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Density by Alloy Grade</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(alloyDensityMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([grade, density]) => (<div key={grade} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{grade}</span><div className="flex-1 bg-red-100 rounded-full h-3"><div className="bg-red-500 h-3 rounded-full" style={{ width: `${(density / maxDensityAlloy[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">{density} g/cm3</span></div>))}</CardContent></Card>
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
              <thead><tr className="border-b"><th className="text-left p-2">Batch</th><th className="text-left p-2">City</th><th className="text-left p-2">Manufacturer</th><th className="text-left p-2">Alloy Grade</th><th className="text-left p-2">Application</th><th className="text-left p-2">W%</th><th className="text-left p-2">Density</th><th className="text-left p-2">&#8377;Cr</th><th className="text-left p-2">Status</th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className={`border-b ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                    <td className="p-2 font-mono text-xs">{r.batchNo}</td>
                    <td className="p-2">{r.city}</td>
                    <td className="p-2">{r.manufacturer}</td>
                    <td className="p-2">{r.alloyGrade}</td>
                    <td className="p-2 max-w-[200px] truncate">{r.application}</td>
                    <td className="p-2">{r.tungstenPercent}%</td>
                    <td className="p-2">{r.densityGcm3}</td>
                    <td className="p-2 font-medium">&#8377;{r.investmentCr}</td>
                    <td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : r.status === 'Delayed' ? 'destructive' : 'secondary'}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-sm">W Content by Alloy</CardTitle></CardHeader><CardContent className="space-y-2">{tungstenRecords.slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{r.alloyGrade}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-500 h-3 rounded-full" style={{ width: `${(r.tungstenPercent / 97) * 100}%` }}></div></div><span className="text-xs font-medium w-12 text-right">{r.tungstenPercent}%</span></div>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(zoneInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-yellow-100 rounded-full h-3"><div className="bg-yellow-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(statusCountMap) as [string, number][]).map(([status, count]) => (<div key={status} className="flex items-center gap-2"><span className="text-xs w-24">{status}</span><div className="flex-1 bg-gray-100 rounded-full h-3"><div className="bg-orange-700 h-3 rounded-full" style={{ width: `${(count / tungstenRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of tungstenRecords) { map[r.priority] = (map[r.priority] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([pri, count]) => (<div key={pri} className="flex items-center gap-2"><span className="text-xs w-20">{pri}</span><div className="flex-1 bg-red-100 rounded-full h-3"><div className="bg-red-500 h-3 rounded-full" style={{ width: `${(count / tungstenRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipment Volume by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of tungstenRecords) { map[r.zone] = (map[r.zone] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([zone, count]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-teal-100 rounded-full h-3"><div className="bg-teal-500 h-3 rounded-full" style={{ width: `${(count / tungstenRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Density Range Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const ranges: Record<string, number> = { 'Below 15 g/cm3': 0, '15-17 g/cm3': 0, '17-18 g/cm3': 0, '18+ g/cm3': 0 }; for (const r of tungstenRecords) { if (r.densityGcm3 >= 18) ranges['18+ g/cm3']++; else if (r.densityGcm3 >= 17) ranges['17-18 g/cm3']++; else if (r.densityGcm3 >= 15) ranges['15-17 g/cm3']++; else ranges['Below 15 g/cm3']++ } return (Object.entries(ranges) as [string, number][]).map(([range, count]) => (<div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 bg-indigo-100 rounded-full h-3"><div className="bg-indigo-500 h-3 rounded-full" style={{ width: `${(count / tungstenRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-orange-700"><CardHeader><CardTitle className="text-sm">D178 Kinetic Energy Penetrator: Anti-Armour Ammunition</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>D178 (90W-6Ni-4Fe) is the standard tungsten heavy alloy for kinetic energy penetrator ammunition, used globally in 120mm and 125mm FSAPDS tank rounds. India&apos;s 4,600-tank fleet (T-90 Bhishma, Arjun Mk2, T-72) requires 50,000+ penetrator rods per year for training and combat readiness. D178 achieves density 17.0 g/cm3 through liquid phase sintering at 1470&#176;C, providing penetration 2.5x greater than equivalent steel projectiles. MIDHANI is India&apos;s sole D178 producer at 15 tonnes/year, targeting 50 tonnes by 2028 to replace depleted uranium imports banned under environmental regulations. The Indian Army&apos;s modernisation programme projects &#8377;22,000Cr KE penetrator WHA demand by 2030.</p></CardContent></Card>
          <Card className="border-l-4 border-l-red-500"><CardHeader><CardTitle className="text-sm">W-Re Fusion Divertor: SST-2 and ITER Programme</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Tungsten-rhenium (W-Re 95:5) is the gold standard material for fusion reactor divertor plasma-facing components, with ITER selecting full-tungsten divertor in 2015. IPR Gandhinagar&apos;s SST-2 upgraded tokamak requires W-Re divertor tiles retaining 80% ductility after 10 dpa (displacements per atom) neutron damage at 800&#176;C. India contributes to ITER TF conductor production and is qualifying domestic W-Re manufacturing at MIDHANI and IGCAR. The W-Re-Os 96:3:1 variant (WHA-B2414) achieves even higher creep resistance for satellite thruster nozzles at 3000&#176;C. India&apos;s fusion WHA programme is projected at &#8377;35,000Cr by 2035 for DEMO reactor qualification.</p></CardContent></Card>
          <Card className="border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm">Radiation Shielding: W-Ni-Fe for Nuclear and Medical</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Tungsten heavy alloys have become the preferred radiation shielding material over lead due to 1.4x higher density at equivalent thickness, superior mechanical strength and non-toxicity. BARC&apos;s Dhruva and upcoming PBFR research reactors use 93W-Ni-Fe shielding blocks to protect personnel from gamma and neutron radiation. India&apos;s medical imaging sector is installing 15,000 CT scanners by 2030, each requiring W-Ni-Cu rotating anode targets with 100 W/mK thermal conductivity for high-resolution imaging. The combined nuclear shielding and medical imaging WHA market in India is &#8377;40,500Cr, with BARC and HLL as the primary domestic consumers driving MIDHANI capacity expansion.</p></CardContent></Card>
          <Card className="border-l-4 border-l-blue-500"><CardHeader><CardTitle className="text-sm">Oilfield and Defence: MWD Tools to Smart Munitions</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Tungsten heavy alloys serve critical roles in India&apos;s oilfield and defence sectors as high-density structural materials for extreme environments. ONGC and Oil India use 92W-5Ni-3Fe housings for MWD/LWD logging tools operating at 15,000 psi and 200&#176;C in KG Basin deepwater wells, where 2.7x density vs steel enables compact tool designs for slimhole drilling. In defence, DRDO&apos;s smart munition programme uses 94W-Ni-Co guidance housings for GPS-guided 155mm shells, while W-Ni-Mn pre-fragmented casings provide 2.5x lethality vs steel for artillery warheads. India&apos;s combined oilfield and defence WHA demand is &#8377;47,400Cr, growing 18% annually.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
