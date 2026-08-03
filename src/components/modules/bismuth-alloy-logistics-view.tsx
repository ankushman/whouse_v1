'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { FlaskConical } from 'lucide-react'

interface BismuthAlloyRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  alloyGrade: string
  application: string
  bismuthPercent: number
  meltingPointC: number
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

const bismuthRecords: BismuthAlloyRecord[] = [
  { id: 'BIA-0001', batchNo: 'BIA-B2401', city: 'Mumbai', manufacturer: 'MIDHANI', alloyGrade: 'Bi-Sn-42 (42%Sn)', application: 'Lead-Free Solder (BEL Soldering)', bismuthPercent: 58, meltingPointC: 138, investmentCr: 92, status: 'Delivered', priority: 'High', origin: 'MIDHANI Hyderabad (TG)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-18', transitDays: 2, zone: 'West', remarks: 'Bi-42Sn eutectic solder for BEL radar PCB assembly &#8594; 58% Bi 42% Sn &#8594; &#8377;92Cr for 8 tonnes solder paste &#8594; 138&#176;C melting ideal for SMT reflow &#8594; India &#8377;3,200Cr lead-free solder market &#8594; BEL &#8377;18,000Cr defence electronics &#8594; RoHS compliance mandatory since 2023 &#8594; Tensile strength 55 MPa' },
  { id: 'BIA-0002', batchNo: 'BIA-B2402', city: 'Hyderabad', manufacturer: 'DRDO DMRL', alloyGrade: 'Bi-Pb-Sn Eutectic', application: 'Fuse Alloy (BEL Avionics)', bismuthPercent: 50, meltingPointC: 96, investmentCr: 38, status: 'Delivered', priority: 'Medium', origin: 'DMRL Hyderabad (TG)', destination: 'BEL Hyderabad (TG)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'Bi-Pb-Sn low-melting fuse alloy for BEL avionics thermal fuse &#8594; 50% Bi &#8594; &#8377;38Cr for 1.5 tonnes wire &#8594; 96&#176;C melting for fire-safe disconnect &#8594; India &#8377;1,500Cr fuse alloy market &#8594; Tejas LCA uses 2,400 fuses &#8594; Bi-based fuses replace toxic Pb-Hg Wood&apos;s metal &#8594; Response time under 0.5 seconds' },
  { id: 'BIA-0003', batchNo: 'BIA-B2403', city: 'Bengaluru', manufacturer: 'Bharat Electronics', alloyGrade: 'Bi-In-48 (48%In)', application: 'Thermal Interface (ISRO)', bismuthPercent: 52, meltingPointC: 72, investmentCr: 145, status: 'Delivered', priority: 'Critical', origin: 'BEL Bengaluru (KA)', destination: 'ISRO Bengaluru (KA)', shipDate: '2026-07-15', transitDays: 1, zone: 'South', remarks: 'Bi-48In thermal interface for ISRO satellite power electronics &#8594; 52% Bi 48% In &#8594; &#8377;145Cr for 500 kg TIM &#8594; 72&#176;C melting phase-change cooling &#8594; India &#8377;4,500Cr aerospace TIM market &#8594; ISRO 70+ satellite launches planned &#8594; Thermal conductivity 22 W/mK &#8594; Replaces 8 thermal pads per module' },
  { id: 'BIA-0004', batchNo: 'BIA-B2404', city: 'Pune', manufacturer: 'Kirloskar Electric', alloyGrade: 'Bi-Ag-2.5 (2.5%Ag)', application: 'Contact Alloy (ABB India)', bismuthPercent: 97.5, meltingPointC: 271, investmentCr: 68, status: 'Delivered', priority: 'High', origin: 'Kirloskar Pune (MH)', destination: 'ABB Bengaluru (KA)', shipDate: '2026-07-22', transitDays: 2, zone: 'West', remarks: 'Bi-2.5Ag electrical contact for ABB vacuum circuit breaker &#8594; 97.5% Bi &#8594; &#8377;68Cr for 3 tonnes contact strip &#8594; 271&#176;C melting high current interruption &#8594; India &#8377;2,800Cr contact alloy market &#8594; ABB 40% India VCB market &#8594; Bi contacts arc-free vs Ag-CdO toxic &#8594; 50,000 operations endurance' },
  { id: 'BIA-0005', batchNo: 'BIA-B2405', city: 'Chennai', manufacturer: 'IGCAR Kalpakkam', alloyGrade: 'Bi-208Pb (208Pb doped)', application: 'Spallation Target (BARC)', bismuthPercent: 55, meltingPointC: 125, investmentCr: 285, status: 'Delivered', priority: 'Critical', origin: 'IGCAR Kalpakkam (TN)', destination: 'BARC Trombay (MH)', shipDate: '2026-07-19', transitDays: 2, zone: 'South', remarks: 'Liquid Bi-Pb spallation target for BARC ADS neutron source &#8594; 55% Bi &#8594; &#8377;285Cr for 12 tonnes liquid metal &#8594; 125&#176;C low melting coolant-target &#8594; India &#8377;9,500Cr nuclear spallation market &#8594; ADS prototype 2028 &#8594; Bi-Pb neutron yield 25 neutrons/proton &#8594; Transmutation of long-lived fission products' },
  { id: 'BIA-0006', batchNo: 'BIA-B2406', city: 'Noida', manufacturer: 'Amrit Bismuth Industries', alloyGrade: 'Bi-Sn-Ag Ternary', application: 'Pharma Capsule Seal (Cipla)', bismuthPercent: 56, meltingPointC: 140, investmentCr: 42, status: 'Delivered', priority: 'Medium', origin: 'ABI Ghaziabad (UP)', destination: 'Cipla Mumbai (MH)', shipDate: '2026-07-16', transitDays: 3, zone: 'North', remarks: 'Bi-Sn-Ag ternary solder for Cipla capsule cold-seal band &#8594; 56% Bi &#8594; &#8377;42Cr for 4 tonnes &#8594; 140&#176;C low-temp seal preserves API &#8594; India &#8377;1,800Cr pharma solder market &#8594; Cipla 22 billion capsules/year &#8594; FDA CFR 21 compliant &#8594; Eliminates heat degradation of sensitive biologics' },
  { id: 'BIA-0007', batchNo: 'BIA-B2407', city: 'Kolkata', manufacturer: 'Hindustan Copper', alloyGrade: 'Bi-Cu-1.5 (1.5%Cu)', application: 'Free-Machining Steel (SAIL)', bismuthPercent: 98.5, meltingPointC: 269, investmentCr: 55, status: 'Delivered', priority: 'High', origin: 'HCL Kolkata (WB)', destination: 'SAIL Durgapur (WB)', shipDate: '2026-07-21', transitDays: 1, zone: 'East', remarks: 'Bi-1.5Cu free-machining additive for SAIL automotive steel billets &#8594; 98.5% Bi &#8594; &#8377;55Cr for 6 tonnes granules &#8594; 269&#176;C Bi melting lubricates tool-chip interface &#8594; India &#8377;2,200Cr free-machining market &#8594; Replaces toxic Pb machining additive &#8594; 40% faster machining speed vs Pb &#8594; Surface finish Ra 0.8 micron' },
  { id: 'BIA-0008', batchNo: 'BIA-B2408', city: 'Ahmedabad', manufacturer: 'Gujarat Fluorochemicals', alloyGrade: 'Bi-Zn-Alloy', application: 'Galvanising Anode (Hindalco)', bismuthPercent: 75, meltingPointC: 168, investmentCr: 82, status: 'Delivered', priority: 'High', origin: 'GFCL Vadodara (GJ)', destination: 'Hindalco Renukoot (UP)', shipDate: '2026-07-17', transitDays: 3, zone: 'West', remarks: 'Bi-Zn sacrificial anode for Hindalco aluminium galvanising line &#8594; 75% Bi &#8594; &#8377;82Cr for 5 tonnes anode &#8594; 168&#176;C low-melt Bi-rich phase &#8594; India &#8377;3,500Cr galvanising anode market &#8594; Hindalco 2.4 MTPA Al extrusion &#8594; Bi anode life 18 months vs Zn 12 months &#8594; Current efficiency 95%' },
  { id: 'BIA-0009', batchNo: 'BIA-B2409', city: 'Jaipur', manufacturer: 'Rajasthan Bismuth Corp', alloyGrade: 'Bi-Ag-12 (12%Ag)', application: 'Dental Casting (Dentsply)', bismuthPercent: 88, meltingPointC: 262, investmentCr: 35, status: 'Delivered', priority: 'Medium', origin: 'RBC Jaipur (RJ)', destination: 'Dentsply Mumbai (MH)', shipDate: '2026-07-23', transitDays: 3, zone: 'North', remarks: 'Bi-12Ag dental casting alloy for crown and bridge &#8594; 88% Bi &#8594; &#8377;35Cr for 800 kg &#8594; 262&#176;C casting temperature &#8594; India &#8377;1,400Cr dental alloy market &#8594; 25 million dental procedures/year &#8594; Bi alloys 60% cost vs Pd-Au &#8594; CTE match with porcelain 14 ppm/K' },
  { id: 'BIA-0010', batchNo: 'BIA-B2410', city: 'Coimbatore', manufacturer: 'Tamil Nadu Bismuth Alloys', alloyGrade: 'Bi-Sb-8 (8%Sb)', application: 'Bullet Core (Ordnance Factory)', bismuthPercent: 92, meltingPointC: 275, investmentCr: 48, status: 'Delivered', priority: 'High', origin: 'TNBA Coimbatore (TN)', destination: 'OFB Bhandara (MH)', shipDate: '2026-07-14', transitDays: 2, zone: 'South', remarks: 'Bi-8Sb non-toxic bullet core replacing lead for OFB ammunition &#8594; 92% Bi &#8594; &#8377;48Cr for 10 tonnes core billets &#8594; 275&#176;C high density 9.8 g/cc &#8594; India &#8377;2,000Cr green ammunition market &#8594; OFB 1 billion rounds/year &#8594; Bi-Sb density matches Pb 11.3 g/cc &#8594; ISO 14001 compliant production' },
  { id: 'BIA-0011', batchNo: 'BIA-B2411', city: 'Bhubaneswar', manufacturer: 'Odisha Non-Ferrous Alloys', alloyGrade: 'Bi-Tl-10 (10%Tl)', application: 'Cryogenic Valve (INOX AP)', bismuthPercent: 90, meltingPointC: 185, investmentCr: 62, status: 'Delivered', priority: 'Medium', origin: 'ONFA Bhubaneswar (OD)', destination: 'INOX AP Pune (MH)', shipDate: '2026-07-25', transitDays: 3, zone: 'East', remarks: 'Bi-Tl cryogenic valve seal for INOX liquid oxygen storage &#8594; 90% Bi &#8594; &#8377;62Cr for 2 tonnes seal rings &#8594; 185&#176;C operation at -183&#176;C LOX &#8594; India &#8377;2,500Cr cryogenic seal market &#8594; INOX 40% India industrial gas &#8594; Bi-Tl retains ductility at cryogenic temp &#8594; Leak rate below 10-9 mbar-L/s' },
  { id: 'BIA-0012', batchNo: 'BIA-B2412', city: 'Guwahati', manufacturer: 'Assam Bismuth Refinery', alloyGrade: 'Bi-Sn-Ag-Cu Quad', application: 'Solder Paste (ITI Ltd)', bismuthPercent: 42, meltingPointC: 217, investmentCr: 78, status: 'Delayed', priority: 'High', origin: 'ABR Guwahati (AS)', destination: 'ITI Bengaluru (KA)', shipDate: '2026-07-24', transitDays: 12, zone: 'East', remarks: 'Bi-Sn-Ag-Cu quaternary SAC-Bi solder for ITI telecom PCB &#8594; 42% Bi &#8594; &#8377;78Cr for 6 tonnes paste &#8594; 12d delay monsoon logistics &#8594; 217&#176;C reflow for 5G antenna assembly &#8594; India &#8377;3,000Cr telecom solder market &#8594; ITI 15 million PCBs/year &#8594; Drop shock reliability 2000 cycles' },
  { id: 'BIA-0013', batchNo: 'BIA-B2413', city: 'Gandhinagar', manufacturer: 'Gujarat Bismuth Technologies', alloyGrade: 'Bi-Li-0.3 (0.3%Li)', application: 'Radiation Shielding (BARC)', bismuthPercent: 99.7, meltingPointC: 270, investmentCr: 195, status: 'Delivered', priority: 'Critical', origin: 'GBT Gandhinagar (GJ)', destination: 'BARC Trombay (MH)', shipDate: '2026-07-26', transitDays: 2, zone: 'West', remarks: 'Li-doped Bi radiation shielding block for BARC gamma cell facility &#8594; 99.7% Bi &#8594; &#8377;195Cr for 25 tonnes cast blocks &#8594; 270&#176;C low-melt easy reshape &#8594; India &#8377;8,500Cr radiation shielding market &#8594; Bi density 9.78 g/cc 50% denser than Pb &#8594; Half-value layer 0.33 cm for Cs-137 &#8594; Non-toxic replacement for Pb bricks' },
  { id: 'BIA-0014', batchNo: 'BIA-B2414', city: 'Lucknow', manufacturer: 'UP Bismuth Works', alloyGrade: 'Bi-Te-5 (5%Te)', application: 'Thermoelectric (DRDO)', bismuthPercent: 95, meltingPointC: 270, investmentCr: 115, status: 'Delivered', priority: 'High', origin: 'UBW Lucknow (UP)', destination: 'DRDO Pune (MH)', shipDate: '2026-07-27', transitDays: 2, zone: 'North', remarks: 'Bi-5Te thermoelectric element for DRDO soldier-worn cooling vest &#8594; 95% Bi &#8594; &#8377;115Cr for 2 tonnes Te-doped Bi &#8594; Seebeck coefficient 200 uV/K &#8594; India &#8377;4,200Cr thermoelectric market &#8594; DRDO 150,000 vests per order &#8594; ZT figure of merit 0.8 at 300K &#8594; Peltier cooling 15&#176;C drop' }
]

export default function BismuthAlloyLogisticsView() {
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
    return bismuthRecords.filter(r => {
      const matchSearch = !searchQuery || Object.values(r).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))
      const matchFilters = Object.entries(filters).every(([key, values]) => values.includes(String(r[key as keyof BismuthAlloyRecord])))
      return matchSearch && matchFilters
    })
  }, [searchQuery, filters])

  const totalInvestment = useMemo(() => bismuthRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])
  const avgBi = useMemo(() => (bismuthRecords.reduce((s: number, r) => s + r.bismuthPercent, 0) / bismuthRecords.length).toFixed(1), [])
  const deliveredCount = useMemo(() => bismuthRecords.filter(r => r.status === 'Delivered').length, [])
  const delayedCount = useMemo(() => bismuthRecords.filter(r => r.status === 'Delayed').length, [])

  const uniqueCities = useMemo(() => [...new Set(bismuthRecords.map(r => r.city))], [])
  const uniqueStatuses = useMemo(() => [...new Set(bismuthRecords.map(r => r.status))], [])
  const uniqueManufacturers = useMemo(() => [...new Set(bismuthRecords.map(r => r.manufacturer))], [])

  const cityInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of bismuthRecords) { map[r.city] = (map[r.city] || 0) + r.investmentCr }
    return map
  }, [])

  const gradeMeltMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of bismuthRecords) { map[r.alloyGrade] = r.meltingPointC }
    return map
  }, [])

  const statusCountMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of bismuthRecords) { map[r.status] = (map[r.status] || 0) + 1 }
    return map
  }, [])

  const zoneInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of bismuthRecords) { map[r.zone] = (map[r.zone] || 0) + r.investmentCr }
    return map
  }, [])

  const maxCity = useMemo(() => {
    const entries = (Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [cityInvestmentMap])

  const maxMelt = useMemo(() => {
    const entries = (Object.entries(gradeMeltMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [gradeMeltMap])

  const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights']

  return (
    <div className="space-y-6">
      <PageHeader title="Bismuth Alloy Logistics" description="Bismuth alloy and compound supply chain for lead-free solders, radiation shielding, spallation targets, thermoelectric elements, dental casting and cryogenic valve seals across India" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-purple-600 bg-purple-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Total Investment</div><div className="text-2xl font-bold text-purple-800">&#8377;{totalInvestment.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across {bismuthRecords.length} batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-purple-600 bg-purple-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Avg Bi Content</div><div className="text-2xl font-bold text-purple-800">{avgBi}%</div><div className="text-xs text-muted-foreground mt-1">Across all alloy grades</div></CardContent></Card>
        <Card className="border-l-4 border-l-purple-600 bg-purple-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Delivered</div><div className="text-2xl font-bold text-purple-800">{deliveredCount}</div><div className="text-xs text-muted-foreground mt-1">{delayedCount} delayed</div></CardContent></Card>
        <Card className="border-l-4 border-l-purple-600 bg-purple-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Top City</div><div className="text-2xl font-bold text-purple-800">{maxCity[0]}</div><div className="text-xs text-muted-foreground mt-1">&#8377;{maxCity[1].toLocaleString()} Cr invested</div></CardContent></Card>
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
          <button key={tab} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-purple-600 text-purple-800' : 'text-muted-foreground'}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by City</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([city, val]) => (<div key={city} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{city}</span><div className="flex-1 bg-purple-100 rounded-full h-3"><div className="bg-purple-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Melting Point by Grade</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(gradeMeltMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([grade, mp]) => (<div key={grade} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{grade}</span><div className="flex-1 bg-fuchsia-100 rounded-full h-3"><div className="bg-fuchsia-600 h-3 rounded-full" style={{ width: `${(mp / maxMelt[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{mp}&#176;C</span></div>))}</CardContent></Card>
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
              <thead><tr className="border-b"><th className="text-left p-2">Batch</th><th className="text-left p-2">City</th><th className="text-left p-2">Manufacturer</th><th className="text-left p-2">Alloy Grade</th><th className="text-left p-2">Application</th><th className="text-left p-2">Bi%</th><th className="text-left p-2">&#176;C</th><th className="text-left p-2">&#8377;Cr</th><th className="text-left p-2">Status</th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className={`border-b ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                    <td className="p-2 font-mono text-xs">{r.batchNo}</td>
                    <td className="p-2">{r.city}</td>
                    <td className="p-2">{r.manufacturer}</td>
                    <td className="p-2">{r.alloyGrade}</td>
                    <td className="p-2 max-w-[200px] truncate">{r.application}</td>
                    <td className="p-2">{r.bismuthPercent}%</td>
                    <td className="p-2">{r.meltingPointC}&#176;C</td>
                    <td className="p-2 font-medium">&#8377;{r.investmentCr}</td>
                    <td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : r.status === 'Delayed' ? 'destructive' : 'secondary'}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-sm">Bi Content by Alloy</CardTitle></CardHeader><CardContent className="space-y-2">{bismuthRecords.slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{r.alloyGrade}</span><div className="flex-1 bg-purple-100 rounded-full h-3"><div className="bg-purple-600 h-3 rounded-full" style={{ width: `${Math.min((r.bismuthPercent / 100) * 100, 100)}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{r.bismuthPercent}%</span></div>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(zoneInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-fuchsia-100 rounded-full h-3"><div className="bg-fuchsia-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(statusCountMap) as [string, number][]).map(([status, count]) => (<div key={status} className="flex items-center gap-2"><span className="text-xs w-24">{status}</span><div className="flex-1 bg-purple-100 rounded-full h-3"><div className="bg-purple-600 h-3 rounded-full" style={{ width: `${(count / bismuthRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of bismuthRecords) { map[r.priority] = (map[r.priority] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([pri, count]) => (<div key={pri} className="flex items-center gap-2"><span className="text-xs w-20">{pri}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-600 h-3 rounded-full" style={{ width: `${(count / bismuthRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipment Volume by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of bismuthRecords) { map[r.zone] = (map[r.zone] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([zone, count]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-indigo-100 rounded-full h-3"><div className="bg-indigo-600 h-3 rounded-full" style={{ width: `${(count / bismuthRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Alloy Category Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const cats: Record<string, number> = { 'Bi-Sn Solder': 0, 'Bi-Ag Contact': 0, 'Bi-In TIM': 0, 'Bi-Pb Nuclear': 0, 'Bi-Cu FreeCut': 0, 'Bi-Zn Anode': 0, 'Bi-Te Thermo': 0, 'Bi-Li Shielding': 0 }; for (const r of bismuthRecords) { if (r.alloyGrade.includes('Sn')) cats['Bi-Sn Solder']++; else if (r.alloyGrade.includes('Ag')) cats['Bi-Ag Contact']++; else if (r.alloyGrade.includes('In')) cats['Bi-In TIM']++; else if (r.alloyGrade.includes('Pb')) cats['Bi-Pb Nuclear']++; else if (r.alloyGrade.includes('Cu')) cats['Bi-Cu FreeCut']++; else if (r.alloyGrade.includes('Zn')) cats['Bi-Zn Anode']++; else if (r.alloyGrade.includes('Te')) cats['Bi-Te Thermo']++; else cats['Bi-Li Shielding']++ } return (Object.entries(cats) as [string, number][]).map(([cat, count]) => { const pct = `${(count / bismuthRecords.length) * 100}%`; return <div key={cat} className="flex items-center gap-2"><span className="text-xs w-28">{cat}</span><div className="flex-1 bg-purple-100 rounded-full h-3"><div className="bg-purple-600 h-3 rounded-full" style={{ width: pct }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div> })})()}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-purple-600"><CardHeader><CardTitle className="text-sm">Lead-Free Solder Revolution: India &#8377;3,200Cr Bi-Sn Market</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Bismuth-tin alloys (Bi-42Sn eutectic, 138&#176;C) have become India&apos;s dominant lead-free solder solution since RoHS 2023 compliance mandates eliminated Pb-Sn (183&#176;C) solders from defence electronics, telecom and automotive PCB assembly. BEL, ISRO, ITI Ltd and Dixon Technologies collectively consume 80+ tonnes of Bi-Sn solder paste annually. India&apos;s lead-free solder market is &#8377;3,200Cr, growing at 18% CAGR driven by the 5G antenna assembly boom (ITI 15 million PCBs/year) and EV power electronics (Tata Motors, Ather Energy). Bi-42Sn&apos;s advantage is its 45&#176;C lower melting point vs Sn-37Pb, enabling lower reflow temperatures that protect temperature-sensitive components like MLCCs and organic substrates on high-density interconnect (HDI) boards.</p></CardContent></Card>
          <Card className="border-l-4 border-l-rose-500"><CardHeader><CardTitle className="text-sm">Bi-Li Shielding: Non-Toxic Lead Replacement &#8377;8,500Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Li-doped bismuth (Bi-0.3Li, density 9.78 g/cc) is India&apos;s fastest-growing radiation shielding material, replacing toxic lead bricks in BARC, NPCIL and Tata Memorial Hospital facilities. Bi&apos;s key advantage is 50% higher density than conventional concrete (2.4 g/cc) and comparable to Pb (11.3 g/cc) while being completely non-toxic - critical for hospital environments. India&apos;s radiation shielding market is &#8377;8,500Cr, with 200+ new LINAC cancer therapy machines installed annually requiring 5 tonnes of Bi shielding each. The half-value layer for Cs-137 gamma rays is only 0.33 cm of Bi vs 0.7 cm of Pb, meaning Bi achieves the same attenuation in half the thickness. Li-doping enhances neutron absorption via Li-6 (n,alpha) reaction, making Bi-Li ideal for mixed-field shielding in nuclear installations.</p></CardContent></Card>
          <Card className="border-l-4 border-l-sky-500"><CardHeader><CardTitle className="text-sm">ADS Spallation: Bi-Pb Target for BARC Accelerator</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>BARC is building an Accelerator-Driven System (ADS) prototype using liquid Bi-Pb (55% Bi, melting 125&#176;C) as the spallation target material, where a high-energy proton beam (1 GeV, 10 mA) strikes the Bi-Pb eutectic to produce 25 neutrons per proton through spallation reactions. This neutron source then drives a sub-critical reactor core for transmutation of long-lived fission products (Tc-99, I-129) and incineration of minor actinides (Np-237, Am-241). India&apos;s ADS programme, valued at &#8377;9,500Cr, targets a 2028 prototype at BARC Trombay. Bi-Pb&apos;s advantages over pure Pb are: 25% lower melting point enabling safer liquid metal handling, superior thermal conductivity (10 W/mK vs 35 W/mK for Pb at 200&#176;C), and reduced polonium-210 production (Po-210 alpha emitter hazard in Pb targets).</p></CardContent></Card>
          <Card className="border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm">Bi-Te Thermoelectrics: DRDO Cooling Vest &#8377;4,200Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Bismuth telluride (Bi-5Te) is the workhorse n-type thermoelectric material for DRDO&apos;s soldier-worn microclimate cooling vest, operating on the Peltier effect to provide 15&#176;C temperature drop at 3A current. The vest contains 200 Bi-Te/P-Sb-Te thermoelectric couples (Peltier modules), each rated at 15W cooling capacity, powered by a rechargeable Li-ion battery pack (2 kg, 4-hour mission). India&apos;s thermoelectric market is &#8377;4,200Cr, with DRDO alone ordering 150,000 vests for the Indian Army deployed in Rajasthan desert (50&#176;C ambient) and Siachen glacier (-40&#176;C). Bi-Te achieves a figure of merit ZT of 0.8 at 300K, with nanostructured Bi-Te from DRDO DMRL achieving ZT 1.1, representing a 37% improvement in cooling efficiency over conventional bulk Bi-Te crystals.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
