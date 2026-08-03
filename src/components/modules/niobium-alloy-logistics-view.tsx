'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Atom } from 'lucide-react'

interface NiobiumAlloyRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  alloyGrade: string
  application: string
  niobiumPercent: number
  maxTempCelsius: number
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

const niobiumRecords: NiobiumAlloyRecord[] = [
  { id: 'NBA-0001', batchNo: 'NBA-B2401', city: 'Hyderabad', manufacturer: 'MIDHANI', alloyGrade: 'C-103 (Nb-10Hf-1Ti-0.7Zr)', application: 'Rocket Nozzle Extension (ISRO PSLV', niobiumPercent: 89, maxTempCelsius: 1300, investmentCr: 265, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TS)', destination: 'ISRO LPSC Trivandrum (KL)', shipDate: '2026-07-18', transitDays: 2, zone: 'South', remarks: 'C-103 niobium alloy nozzle skirt for PSLV fourth stage &#8594; 89% Nb with 10% Hf for high-temperature ductility &#8594; &#8377;265Cr for 12 tonnes forged nozzle extensions &#8594; ISRO launching 12 PSLV missions/year &#8594; C-103 retains 80% ductility at 1300&#176;C vs pure Nb 1100&#176;C &#8594; India importing 70% C-103 from USA and Japan &#8594; &#8377;18,500Cr Indian rocket Nb alloy demand' },
  { id: 'NBA-0002', batchNo: 'NBA-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', alloyGrade: 'Nb-1Zr', application: 'Aero Engine Combustor (DRDO GTRE Kaveri)', niobiumPercent: 99, maxTempCelsius: 900, investmentCr: 320, status: 'In Transit', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TS)', destination: 'GTRE Bengaluru (KA)', shipDate: '2026-07-22', transitDays: 1, zone: 'South', remarks: 'Nb-1Zr combustor liner segment for Kaveri engine programme &#8594; 99% Nb with 1% Zr grain stabilizer &#8594; &#8377;320Cr for 18 tonnes sheet stock &#8594; Kaveri 85kN engine for AMCA 5th-gen fighter &#8594; Nb-1Zr corrosion resistance in combustion gas 50,000hr &#8594; DRDO targeting indigenous Nb-1Zr production by 2028 &#8594; &#8377;24,000Cr Indian aero Nb alloy programme' },
  { id: 'NBA-0003', batchNo: 'NBA-B2403', city: 'Mumbai', manufacturer: 'Hindalco Industries', alloyGrade: 'Ferroniobium FeNb-65', application: 'HSLA Steel Microalloying (Tata Steel)', niobiumPercent: 65, maxTempCelsius: 400, investmentCr: 142, status: 'Delivered', priority: 'High', origin: 'Hindalco R&amp;D Mumbai (MH)', destination: 'Tata Steel Jamshedpur (JH)', shipDate: '2026-07-19', transitDays: 3, zone: 'West', remarks: 'Ferroniobium FeNb-65 master alloy for HSLA steel pipeline grade &#8594; 65% Nb in Fe matrix for microalloying addition &#8594; &#8377;142Cr for 85 tonnes FeNb alloy &#8594; Tata Steel producing X80 pipeline steel for gas grid &#8594; 0.05% Nb addition raises yield strength by 200MPa &#8594; India consuming 4,500 tonnes FeNb/year for automotive and pipeline &#8594; &#8377;10,800Cr Indian steel Nb market' },
  { id: 'NBA-0004', batchNo: 'NBA-B2404', city: 'Pune', manufacturer: 'Tata Advanced Materials', alloyGrade: 'Nb-10W-1Zr-0.1C', application: 'Hypersonic Leading Edge (DRDO HSTDV)', niobiumPercent: 85, maxTempCelsius: 1500, investmentCr: 385, status: 'Delayed', priority: 'Critical', origin: 'TAM Pune (MH)', destination: 'DRDO Hyderabad (TS)', shipDate: '2026-07-12', transitDays: 2, zone: 'West', remarks: 'Nb-W-Zr-C alloy leading edge panel for hypersonic scramjet vehicle &#8594; 85% Nb with 10% W and 1% Zr for UHTC performance &#8594; &#8377;385Cr for 6 tonnes PM processed panels &#8594; HSTDV demonstrated Mach 6 scramjet flight &#8594; Nb-W-Zr-C retains 60% strength at 1500&#176;C &#8594; Delayed 10 days due to tungsten powder import clearance &#8594; &#8377;29,500Cr Indian hypersonic Nb programme' },
  { id: 'NBA-0005', batchNo: 'NBA-B2405', city: 'Chennai', manufacturer: 'IGCAR Kalpakkam', alloyGrade: 'Nb-1%Zr (Purity Nuclear Grade)', application: 'Nuclear Reactor Pressure Vessel (BHAVINI PFBR)', niobiumPercent: 99, maxTempCelsius: 550, investmentCr: 278, status: 'Processing', priority: 'High', origin: 'IGCAR Kalpakkam (TN)', destination: 'BHAVINI Kalpakkam (TN)', shipDate: '2026-07-25', transitDays: 1, zone: 'South', remarks: 'Nuclear-grade Nb-1Zr for fast breeder reactor internal components &#8594; 99% Nb purity nuclear grade low activation &#8594; &#8377;278Cr for 22 tonnes bar and plate stock &#8594; PFBR 500MW sodium-cooled fast breeder &#8594; Nb-1Zr low neutron absorption cross-section 1.1 barns &#8594; India planning 8 more FBRs by 2035 &#8594; &#8377;21,000Cr Indian nuclear Nb alloy demand' },
  { id: 'NBA-0006', batchNo: 'NBA-B2406', city: 'Noida', manufacturer: 'BHEL', alloyGrade: 'Nb-10Hf-1Ti (FSX-414)', application: 'Gas Turbine Blade (BHEL 800MW)', niobiumPercent: 89, maxTempCelsius: 1200, investmentCr: 198, status: 'Delivered', priority: 'High', origin: 'MIDHANI Hyderabad (TS)', destination: 'BHEL Hyderabad (TS)', shipDate: '2026-07-17', transitDays: 1, zone: 'North', remarks: 'FSX-414 Nb alloy nozzle vane for 800MW gas turbine &#8594; 89% Nb with 10% Hf 1% Ti for long-term creep &#8594; &#8377;198Cr for 14 tonnes investment cast vanes &#8594; BHEL manufacturing 42 gas turbines for NTPC &#8594; FSX-414 creep rupture 10,000hr at 1200&#176;C &#8594; BHEL-NTPC gas turbine programme &#8377;45,000Cr &#8594; &#8377;15,200Cr Indian turbine Nb demand' },
  { id: 'NBA-0007', batchNo: 'NBA-B2407', city: 'Kolkata', manufacturer: 'Reliance SBR', alloyGrade: 'NbTi (Nb-47Ti)', application: 'MRI Superconducting Magnet (HLL Mumbai)', niobiumPercent: 53, maxTempCelsius: 196, investmentCr: 225, status: 'In Transit', priority: 'Medium', origin: 'Reliance SBR Kolkata (WB)', destination: 'HLL Mumbai (MH)', shipDate: '2026-07-21', transitDays: 3, zone: 'East', remarks: 'NbTi superconducting wire for 3T MRI whole-body magnet &#8594; 53% Nb with 47% Ti for Type-II superconductor &#8594; &#8377;225Cr for 2,500 km of multifilament wire &#8594; India installing 800 MRI machines/year &#8594; NbTi critical current density 3,000 A/mm2 at 4.2K 5T &#8594; India importing 90% NbTi wire from EU and Japan &#8594; &#8377;17,500Cr Indian MRI NbTi market' },
  { id: 'NBA-0008', batchNo: 'NBA-B2408', city: 'Ahmedabad', manufacturer: 'Gujarat Fluorochemicals', alloyGrade: 'Nb3Sn (A15 Phase)', application: 'Fusion Reactor Magnet (IPR Gandhinagar)', niobiumPercent: 75, maxTempCelsius: 196, investmentCr: 412, status: 'Delivered', priority: 'Critical', origin: 'GFCL Ahmedabad (GJ)', destination: 'IPR Gandhinagar (GJ)', shipDate: '2026-07-16', transitDays: 1, zone: 'West', remarks: 'Nb3Sn A15 superconductor cable for SST-1 tokamak magnet &#8594; 75% Nb in A15 intermetallic phase &#8594; &#8377;412Cr for 4 tonnes reacted cable &#8594; IPR SST-1 operating at 1.5T 3-second pulse &#8594; Nb3Sn critical temperature 18.3K vs NbTi 9.2K &#8594; India contributing to ITER TF conductor production &#8594; &#8377;31,000Cr Indian fusion Nb alloy programme' },
  { id: 'NBA-0009', batchNo: 'NBA-B2409', city: 'Jaipur', manufacturer: 'Rajasthan State Mines', alloyGrade: 'Nb2O5 (Ferro-Niobium Feed)', application: 'Pyrochlore Ore Processing (RSM)', niobiumPercent: 65, maxTempCelsius: 350, investmentCr: 95, status: 'Processing', priority: 'High', origin: 'RSM Khetri (RJ)', destination: 'Hindalco Rourkela (OD)', shipDate: '2026-07-24', transitDays: 3, zone: 'North', remarks: 'Nb2O5 niobium pentoxide from pyrochlore ore processing &#8594; 65% Nb2O5 grade concentrate for FeNb production &#8594; &#8377;95Cr for 120 tonnes concentrate &#8594; RSM operating pyrochlore mine at Khetri deposit &#8594; India imports 95% niobium raw material from Brazil CBMM &#8594; RSM targeting 500 tonnes Nb2O5/year domestic production &#8594; &#8377;7,200Cr Indian Nb ore development' },
  { id: 'NBA-0010', batchNo: 'NBA-B2410', city: 'Coimbatore', manufacturer: 'IIT Madras', alloyGrade: 'NbSi2 (Silicide)', application: 'Turbocharger Rotor (Bosch India)', niobiumPercent: 66, maxTempCelsius: 1350, investmentCr: 178, status: 'Delivered', priority: 'High', origin: 'IIT Madras (TN)', destination: 'Bosch Pune (MH)', shipDate: '2026-07-18', transitDays: 2, zone: 'South', remarks: 'NbSi2 silicide coated turbocharger turbine wheel &#8594; 66% Nb in MoSi2-NbSi2 composite coating &#8594; &#8377;178Cr for 8 tonnes coated rotor blanks &#8594; India 4.5 million turbochargers/year production &#8594; NbSi2 oxidation resistance 1350&#176;C 5,000hr &#8594; IIT Madras developing pack cementation coating process &#8594; &#8377;13,800Cr Indian automotive Nb market' },
  { id: 'NBA-0011', batchNo: 'NBA-B2411', city: 'Bhubaneswar', manufacturer: 'NALCO', alloyGrade: 'Nb-V Microalloy (FeNb60V5)', application: 'Automotive Sheet Steel (Tata Motors)', niobiumPercent: 60, maxTempCelsius: 400, investmentCr: 82, status: 'In Transit', priority: 'Medium', origin: 'NALCO Smelter Angul (OD)', destination: 'Tata Steel Jamshedpur (JH)', shipDate: '2026-07-23', transitDays: 3, zone: 'East', remarks: 'FeNb60V5 complex microalloy for AHSS automotive sheet &#8594; 60% Nb with 5% V dual microalloying &#8594; &#8377;82Cr for 55 tonnes master alloy &#8594; Tata Motors producing 800,000 vehicles/year &#8594; Nb-V dual addition achieves 1200MPa DP steel &#8594; India AHSS market growing 18% annually &#8594; &#8377;6,500Cr Indian automotive Nb demand' },
  { id: 'NBA-0012', batchNo: 'NBA-B2412', city: 'Guwahati', manufacturer: 'Oil India Ltd', alloyGrade: 'Nb-28Ta-3W (NATO)', application: 'Subsea Pipeline Clad (ONGC KG Basin)', niobiumPercent: 68, maxTempCelsius: 450, investmentCr: 165, status: 'Delayed', priority: 'High', origin: 'Oil India Jorhat (AS)', destination: 'ONGC Kakinada (AP)', shipDate: '2026-07-11', transitDays: 5, zone: 'East', remarks: 'Nb-Ta-W corrosion-resistant alloy for subsea pipeline CRA clad &#8594; 68% Nb with 28% Ta 3% W for sour service &#8594; &#8377;165Cr for 15 kilometres of welded CRA clad pipe &#8594; ONGC KG-DWN-98/2 deepwater sour gas field &#8594; Nb-Ta-W pitting resistance PREN 42 in H2S/CO2 &#8594; Delayed 12 days due to monsoon offshore logistics &#8594; &#8377;12,800Cr Indian offshore Nb alloy demand' },
  { id: 'NBA-0013', batchNo: 'NBA-B2413', city: 'Gandhinagar', manufacturer: 'Adani Defence', alloyGrade: 'Nb-5Mo-1Zr (NbZrMo)', application: 'Missile Airframe Tube (DRDO Astra Mk3)', niobiumPercent: 94, maxTempCelsius: 1000, investmentCr: 298, status: 'Processing', priority: 'Critical', origin: 'Adani Defence Gandhinagar (GJ)', destination: 'DRDO Hyderabad (TS)', shipDate: '2026-07-26', transitDays: 2, zone: 'West', remarks: 'NbZrMo alloy missile airframe for BVRAAM Astra Mk3 &#8594; 94% Nb with 5% Mo 1% Zr high-strength &#8594; &#8377;298Cr for 10 tonnes extruded tube stock &#8594; Astra Mk3 150km BVR air-to-air missile &#8594; NbZrMo specific strength 2x Inconel at 1000&#176;C &#8594; DRDO targeting 500 Astra Mk3/year production &#8594; &#8377;22,500Cr Indian missile Nb programme' },
  { id: 'NBA-0014', batchNo: 'NBA-B2414', city: 'Lucknow', manufacturer: 'TASL', alloyGrade: 'Nb-10W-10Ta (Multi-Element)', application: 'Satellite Reaction Wheel (ISRO GSAT)', niobiumPercent: 80, maxTempCelsius: 600, investmentCr: 188, status: 'In Transit', priority: 'High', origin: 'TASL Lucknow (UP)', destination: 'ISRO URSC Bengaluru (KA)', shipDate: '2026-07-23', transitDays: 2, zone: 'North', remarks: 'Nb-W-Ta multi-element alloy reaction wheel housing for satellite &#8594; 80% Nb with 10% W 10% Ta &#8594; &#8377;188Cr for 4 tonnes precision machined housing &#8594; ISRO launching 12 GSAT communication satellites &#8594; Nb-W-Ta low CTE match with satellite structure &#8594; TASL-ISRO JV for space-grade Nb components &#8594; &#8377;14,500Cr Indian space Nb alloy demand' },
]

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const
type TabType = typeof tabs[number]

export default function NiobiumAlloyLogisticsView() {
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
    return niobiumRecords.filter(r => {
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

  const uniqueCities = useMemo(() => [...new Set(niobiumRecords.map(r => r.city))].sort(), [])
  const uniqueManufacturers = useMemo(() => [...new Set(niobiumRecords.map(r => r.manufacturer))].sort(), [])
  const uniqueStatuses = useMemo(() => [...new Set(niobiumRecords.map(r => r.status))].sort(), [])
  const uniqueZones = useMemo(() => [...new Set(niobiumRecords.map(r => r.zone))].sort(), [])

  const totalInvestment = useMemo(() => niobiumRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])
  const avgTemp = useMemo(() => Math.round(niobiumRecords.reduce((s: number, r) => s + r.maxTempCelsius, 0) / niobiumRecords.length), [])
  const deliveredCount = useMemo(() => niobiumRecords.filter(r => r.status === 'Delivered').length, [])
  const delayedCount = useMemo(() => niobiumRecords.filter(r => r.status === 'Delayed').length, [])

  const cityInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of niobiumRecords) { map[r.city] = (map[r.city] || 0) + r.investmentCr }
    return map
  }, [])

  const gradeTempMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of niobiumRecords) { map[r.alloyGrade] = (map[r.alloyGrade] || 0) + r.maxTempCelsius }
    return map
  }, [])

  const statusCountMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of niobiumRecords) { map[r.status] = (map[r.status] || 0) + 1 }
    return map
  }, [])

  const zoneInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of niobiumRecords) { map[r.zone] = (map[r.zone] || 0) + r.investmentCr }
    return map
  }, [])

  const maxCity = useMemo(() => {
    const entries = (Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [cityInvestmentMap])

  const maxTempGrade = useMemo(() => {
    const entries = (Object.entries(gradeTempMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [gradeTempMap])

  return (
    <div className="space-y-6">
      <PageHeader title="Niobium Alloy Logistics" description="Strategic niobium alloy supply chain tracking for rocket nozzles, superconductors, nuclear reactors, hypersonic vehicles, microalloyed steels and offshore pipelines" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-amber-700 bg-amber-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Total Investment</div><div className="text-2xl font-bold text-amber-800">&#8377;{totalInvestment.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across {niobiumRecords.length} batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-amber-700 bg-amber-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Avg Max Temperature</div><div className="text-2xl font-bold text-amber-800">{avgTemp.toLocaleString()}&#176;C</div><div className="text-xs text-muted-foreground mt-1">Across all alloy grades</div></CardContent></Card>
        <Card className="border-l-4 border-l-amber-700 bg-amber-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Delivered</div><div className="text-2xl font-bold text-amber-800">{deliveredCount}</div><div className="text-xs text-muted-foreground mt-1">{delayedCount} delayed</div></CardContent></Card>
        <Card className="border-l-4 border-l-amber-700 bg-amber-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Top City</div><div className="text-2xl font-bold text-amber-800">{maxCity[0]}</div><div className="text-xs text-muted-foreground mt-1">&#8377;{maxCity[1].toLocaleString()} Cr invested</div></CardContent></Card>
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
          <button key={tab} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-amber-700 text-amber-800' : 'text-muted-foreground'}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by City</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([city, val]) => (<div key={city} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{city}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-700 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Max Temperature by Alloy Grade</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(gradeTempMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([grade, temp]) => (<div key={grade} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{grade}</span><div className="flex-1 bg-red-100 rounded-full h-3"><div className="bg-red-500 h-3 rounded-full" style={{ width: `${(temp / maxTempGrade[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{temp}&#176;C</span></div>))}</CardContent></Card>
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
              <thead><tr className="border-b"><th className="text-left p-2">Batch</th><th className="text-left p-2">City</th><th className="text-left p-2">Manufacturer</th><th className="text-left p-2">Alloy Grade</th><th className="text-left p-2">Application</th><th className="text-left p-2">Nb%</th><th className="text-left p-2">Max Temp</th><th className="text-left p-2">&#8377;Cr</th><th className="text-left p-2">Status</th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className={`border-b ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                    <td className="p-2 font-mono text-xs">{r.batchNo}</td>
                    <td className="p-2">{r.city}</td>
                    <td className="p-2">{r.manufacturer}</td>
                    <td className="p-2">{r.alloyGrade}</td>
                    <td className="p-2 max-w-[200px] truncate">{r.application}</td>
                    <td className="p-2">{r.niobiumPercent}%</td>
                    <td className="p-2">{r.maxTempCelsius}&#176;C</td>
                    <td className="p-2 font-medium">&#8377;{r.investmentCr}</td>
                    <td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : r.status === 'Delayed' ? 'destructive' : 'secondary'}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-sm">Niobium % by Alloy</CardTitle></CardHeader><CardContent className="space-y-2">{niobiumRecords.slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{r.alloyGrade}</span><div className="flex-1 bg-orange-100 rounded-full h-3"><div className="bg-orange-500 h-3 rounded-full" style={{ width: `${(r.niobiumPercent / 99) * 100}%` }}></div></div><span className="text-xs font-medium w-12 text-right">{r.niobiumPercent}%</span></div>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(zoneInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-yellow-100 rounded-full h-3"><div className="bg-yellow-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(statusCountMap) as [string, number][]).map(([status, count]) => (<div key={status} className="flex items-center gap-2"><span className="text-xs w-24">{status}</span><div className="flex-1 bg-gray-100 rounded-full h-3"><div className="bg-amber-700 h-3 rounded-full" style={{ width: `${(count / niobiumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of niobiumRecords) { map[r.priority] = (map[r.priority] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([pri, count]) => (<div key={pri} className="flex items-center gap-2"><span className="text-xs w-20">{pri}</span><div className="flex-1 bg-red-100 rounded-full h-3"><div className="bg-red-500 h-3 rounded-full" style={{ width: `${(count / niobiumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipment Volume by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of niobiumRecords) { map[r.zone] = (map[r.zone] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([zone, count]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-teal-100 rounded-full h-3"><div className="bg-teal-500 h-3 rounded-full" style={{ width: `${(count / niobiumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Temperature Range Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const ranges: Record<string, number> = { 'Below 400&#176;C': 0, '400-800&#176;C': 0, '800-1200&#176;C': 0, '1200&#176;C+': 0 }; for (const r of niobiumRecords) { if (r.maxTempCelsius >= 1200) ranges['1200&#176;C+']++; else if (r.maxTempCelsius >= 800) ranges['800-1200&#176;C']++; else if (r.maxTempCelsius >= 400) ranges['400-800&#176;C']++; else ranges['Below 400&#176;C']++ } return (Object.entries(ranges) as [string, number][]).map(([range, count]) => (<div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 bg-indigo-100 rounded-full h-3"><div className="bg-indigo-500 h-3 rounded-full" style={{ width: `${(count / niobiumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-amber-700"><CardHeader><CardTitle className="text-sm">C-103 Rocket Nozzle: Critical Import Substitution</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>C-103 (Nb-10Hf-1Ti) is the gold standard niobium alloy for rocket nozzle extensions, used globally on Atlas, Delta, Ariane and GSLV vehicles. ISRO&apos;s PSLV programme requires 12 nozzle skirts per year at 12 tonnes each, with C-103 retaining 80% ductility at 1300&#176;C in hydrogen-rich exhaust. India currently imports 70% of its C-103 from Ultramet (USA) and JX Nippon (Japan), creating a critical supply chain vulnerability for the 2028 Gaganyaan human spaceflight programme. MIDHANI is developing indigenous C-103 VIM+ESR production, targeting 500 tonnes/year capacity by 2030 to serve ISRO, DRDO and commercial launch providers like Skyroot and Agnikul.</p></CardContent></Card>
          <Card className="border-l-4 border-l-violet-500"><CardHeader><CardTitle className="text-sm">Superconducting NbTi and Nb3Sn: MRI and Fusion</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India&apos;s medical imaging sector is one of the world&apos;s fastest-growing MRI markets, installing 800 machines per year. Each 3T MRI requires 2,500 km of NbTi (Nb-47Ti) multifilament superconducting wire, with India importing 90% from EU (Bruker) and Japan (Jastec). The fusion energy programme at IPR Gandhinagar uses Nb3Sn A15 superconductor for SST-1 tokamak magnets and contributes to ITER TF conductor production. Nb3Sn offers critical temperature 18.3K vs NbTi 9.2K, enabling higher-field magnets for compact fusion reactors. India&apos;s combined superconducting Nb market is &#8377;2,800Cr, with domestic wire production capacity targeted at 5,000 tonnes/year by 2032.</p></CardContent></Card>
          <Card className="border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm">Ferroniobium: Backbone of Indian Steel Microalloying</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Ferroniobium (FeNb-65) is the primary niobium product consumed in India, with 4,500 tonnes/year used as microalloying addition in HSLA and AHSS steels. Tata Steel, JSW, SAIL and JSPL all use FeNb to produce X80 pipeline steel for the 16,000 km National Gas Grid, automotive AHSS for 4.5 million vehicles, and construction rebar grade Fe500D. Just 0.05% Nb addition raises yield strength by 200MPa while improving weldability and toughness. India imports 95% FeNb from Brazil CBMM, which controls 88% of global niobium supply. RSM Khetri pyrochlore deposits represent India&apos;s only domestic Nb source, targeting 500 tonnes Nb2O5/year by 2028 to reduce import dependence.</p></CardContent></Card>
          <Card className="border-l-4 border-l-blue-500"><CardHeader><CardTitle className="text-sm">Hypersonic and Defence: Nb-W-Zr-C UHTC Alloys</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Niobium-based ultra-high temperature ceramics (Nb-W-Zr-C) are critical for hypersonic vehicle leading edges operating at 1500&#176;C+ in Mach 6+ flight. DRDO&apos;s HSTDV demonstrated scramjet flight at Mach 6 in 2020, with the production Hypersonic Missile planned for 2028 requiring Nb-W-Zr-C airframe panels with 60% strength retention at 1500&#176;C. The Nb-10W-1Zr-0.1C alloy (NBA-B2404) represents India&apos;s first attempt at PM-processed UHTC niobium alloy production. Combined with NbZrMo for missile airframes (Astra Mk3) and Nb-W-Ta for satellite reaction wheels, India&apos;s defence niobium alloy programme is projected at &#8377;32,000Cr by 2030.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
