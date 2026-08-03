'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Crown } from 'lucide-react'

interface ZirconiaCeramicRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  ceramicType: string
  application: string
  fractureToughnessMPaM05: number
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

const zirconiaRecords: ZirconiaCeramicRecord[] = [
  { id: 'ZRC-0001', batchNo: 'ZRC-B2401', city: 'Bengaluru', manufacturer: 'Bharat Ceramics', ceramicType: '3Y-TZP (3mol% Y2O3)', application: 'Knee Joint Femoral Component (SCTIMST)', fractureToughnessMPaM05: 10, maxTempCelsius: 500, investmentCr: 95, status: 'Delivered', priority: 'High', origin: 'Bharat Ceramics Bengaluru (KA)', destination: 'SCTIMST Trivandrum (KL)', shipDate: '2026-07-20', transitDays: 2, zone: 'South', remarks: '3Y-TZP zirconia femoral component for total knee arthroplasty &#8594; 10 MPa&#8730;m fracture toughness with transformation toughening &#8594; &#8377;95Cr for 6 tonnes biomedical-grade zirconia blanks &#8594; SCTIMST performing 15,000 knee replacements/year &#8594; Y-TZP 3x wear resistance vs alumina in joint simulation &#8594; India importing 65% orthopaedic zirconia from Japan (Toshiba) &#8594; &#8377;7,200Cr Indian orthopaedic zirconia market' },
  { id: 'ZRC-0002', batchNo: 'ZRC-B2402', city: 'Hyderabad', manufacturer: 'MIDHANI Hyderabad', ceramicType: 'Mg-PSZ', application: 'Thermal Barrier Coating (HAL Aero Engines)', fractureToughnessMPaM05: 8, maxTempCelsius: 1200, investmentCr: 245, status: 'In Transit', priority: 'Critical', origin: 'MIDHANI Hyderabad (TS)', destination: 'HAL Engine Div Bengaluru (KA)', shipDate: '2026-07-22', transitDays: 1, zone: 'South', remarks: 'Mg-PSZ zirconia thermal barrier coating for GE F414 engine combustor &#8594; 8 MPa&#8730;m toughness with MgO partial stabilization &#8594; &#8377;245Cr for 28 tonnes APS spray powder &#8594; HAL producing 150 Tejas Mk2 engines/year with TBC &#8594; Mg-PSZ coating thermal conductivity 1.5 W/mK vs 2.3 for YSZ &#8594; India targeting 100% indigenous TBC powder by 2028 &#8594; &#8377;18,500Cr Indian aerospace zirconia demand' },
  { id: 'ZRC-0003', batchNo: 'ZRC-B2403', city: 'Mumbai', manufacturer: 'Saint-Gobain India', ceramicType: '8Y-FSZ', application: 'Oxygen Sensor Electrolyte (Mahindra EV)', fractureToughnessMPaM05: 2, maxTempCelsius: 1000, investmentCr: 78, status: 'Delivered', priority: 'High', origin: 'Saint-Gobain Mumbai (MH)', destination: 'Mahindra EV Pune (MH)', shipDate: '2026-07-19', transitDays: 1, zone: 'West', remarks: '8Y-FSZ zirconia oxygen sensor for battery thermal management &#8594; 2 MPa&#8730;m toughness with 8mol% Y2O3 full stabilization &#8594; &#8377;78Cr for 14 tonnes FSZ sensor tubes &#8594; Mahindra producing 50,000 XUV400 EVs/year &#8594; FSZ O2 sensor response time 10ms for real-time thermal monitoring &#8594; India EV market 8 million units/year by 2030 &#8594; &#8377;5,800Cr Indian EV zirconia sensor market' },
  { id: 'ZRC-0004', batchNo: 'ZRC-B2404', city: 'Pune', manufacturer: 'DRDO DMRL', ceramicType: 'Ce-TZP (10CeO2-TZP)', application: 'Armour Plate Insert (TASL Defence)', fractureToughnessMPaM05: 15, maxTempCelsius: 600, investmentCr: 185, status: 'Delayed', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TS)', destination: 'TASL Pune (MH)', shipDate: '2026-07-13', transitDays: 2, zone: 'West', remarks: 'Ce-TZP zirconia armour insert for BMP-II modernization programme &#8594; 15 MPa&#8730;m highest fracture toughness in zirconia family &#8594; &#8377;185Cr for 22 tonnes Ce-TZP armour tiles &#8594; Indian Army modernizing 2,500 BMP-II infantry fighting vehicles &#8594; Ce-TZP absorbs 3x kinetic energy vs alumina at same thickness &#8594; Delayed 10 days awaiting CeO2 precursor from Indian Rare Earths &#8594; &#8377;14,200Cr Indian defence zirconia market' },
  { id: 'ZRC-0005', batchNo: 'ZRC-B2405', city: 'Chennai', manufacturer: 'Tata Advanced Materials', ceramicType: 'ZTA (Zirconia-Toughened Alumina)', application: 'Cutting Tool Insert (Bharat Forge)', fractureToughnessMPaM05: 7, maxTempCelsius: 800, investmentCr: 128, status: 'Processing', priority: 'High', origin: 'TAM Chennai (TN)', destination: 'Bharat Forge Pune (MH)', shipDate: '2026-07-25', transitDays: 2, zone: 'South', remarks: 'ZTA composite cutting tool for automotive crankshaft machining &#8594; 7 MPa&#8730;m toughness with 20% zirconia dispersed in alumina matrix &#8594; &#8377;128Cr for 16 tonnes ZTA cutting inserts &#8594; Bharat Forge world largest forging company machining 3 million crankshafts/year &#8594; ZTA tool life 4x vs WC-Co at cutting speed 250m/min &#8594; India importing 55% ceramic cutting tools from Sandvik and Kyocera &#8594; &#8377;9,800Cr Indian cutting tool zirconia market' },
  { id: 'ZRC-0006', batchNo: 'ZRC-B2406', city: 'Noida', manufacturer: 'Bharat Electronics', ceramicType: 'Sc-Stabilized ZrO2', application: 'Solid Oxide Fuel Cell Electrolyte (BHEL)', fractureToughnessMPaM05: 3, maxTempCelsius: 1000, investmentCr: 215, status: 'Delivered', priority: 'Critical', origin: 'BEL Noida (UP)', destination: 'BHEL R&amp;D Hyderabad (TS)', shipDate: '2026-07-17', transitDays: 3, zone: 'North', remarks: 'ScSZ electrolyte membrane for 5kW SOFC power module &#8594; 3 MPa&#8730;m toughness with scandia stabilization &#8594; &#8377;215Cr for 8 tonnes ScSZ tape-cast membranes &#8594; BHEL developing 250kW SOFC for distributed power generation &#8594; ScSZ conductivity 0.1 S/cm at 800&#176;C vs 0.01 for YSZ &#8594; India targeting 2GW fuel cell capacity by 2030 &#8594; &#8377;16,500Cr Indian SOFC zirconia market' },
  { id: 'ZRC-0007', batchNo: 'ZRC-B2407', city: 'Kolkata', manufacturer: 'CGCRI Kolkata', ceramicType: 'Bioglass-Zirconia Composite', application: 'Dental Implant Abutment (Dental Labs India)', fractureToughnessMPaM05: 6, maxTempCelsius: 350, investmentCr: 48, status: 'In Transit', priority: 'Medium', origin: 'CGCRI Kolkata (WB)', destination: 'Dental Labs Mumbai (MH)', shipDate: '2026-07-21', transitDays: 3, zone: 'East', remarks: 'Bioglass-zirconia composite for single-piece dental implant &#8594; 6 MPa&#8730;m toughness with bioactive glass bonding to zirconia &#8594; &#8377;48Cr for 3.5 tonnes dental implant blanks &#8594; India 1.4 billion population with 400 million needing dental implants &#8594; Bioglass-zirconia osseointegration rate 95% at 6 weeks vs 78% for pure titanium &#8594; CGCRI patent on sol-gel Bioglass-zirconia process &#8594; &#8377;3,800Cr Indian dental zirconia market' },
  { id: 'ZRC-0008', batchNo: 'ZRC-B2408', city: 'Ahmedabad', manufacturer: 'Reliance SBR', ceramicType: 'TZP-3Y Grinding Media', application: 'Mineral Processing Media (NMDC)', fractureToughnessMPaM05: 10, maxTempCelsius: 400, investmentCr: 56, status: 'Delivered', priority: 'Medium', origin: 'Reliance SBR Ahmedabad (GJ)', destination: 'NMDC Bailadila (CG)', shipDate: '2026-07-16', transitDays: 3, zone: 'West', remarks: '3Y-TZP zirconia grinding media for iron ore slurry processing &#8594; 10 MPa&#8730;m toughness with 0.5mm bead size for fine grinding &#8594; &#8377;56Cr for 22 tonnes zirconia grinding media &#8594; NMDC processing 45 MT iron ore/year requiring ultrafine grinding &#8594; TZP media wear rate 1/20th of alumina at same slurry velocity &#8594; India 4th largest iron ore producer globally &#8594; &#8377;4,200Cr Indian mining zirconia media market' },
  { id: 'ZRC-0009', batchNo: 'ZRC-B2409', city: 'Jaipur', manufacturer: 'Rajasthan State Mines', ceramicType: 'Calcined Zircon (ZrSiO4)', application: 'Refractory Lining (JSW Steel)', fractureToughnessMPaM05: 4, maxTempCelsius: 1600, investmentCr: 88, status: 'Processing', priority: 'High', origin: 'RSM Processing Jaipur (RJ)', destination: 'JSW Steel Vijayanagar (KA)', shipDate: '2026-07-24', transitDays: 2, zone: 'North', remarks: 'Calcined zircon refractory brick for BOF steel furnace lining &#8594; 4 MPa&#8730;m toughness with ZrSiO4 sintered at 1750&#176;C &#8594; &#8377;88Cr for 85 tonnes zircon refractory shapes &#8594; JSW Vijayanagar India largest steel plant 12 MTPA &#8594; Zircon refractory life 2,500 heats vs 1,500 for magnesia-chrome &#8594; RSM India largest zircon sand producer from Kerala deposits &#8594; &#8377;6,800Cr Indian steel zirconia refractory market' },
  { id: 'ZRC-0010', batchNo: 'ZRC-B2410', city: 'Coimbatore', manufacturer: 'IIT Madras Research', ceramicType: 'Y-TZP Filled PEEK', application: 'Spine Fusion Cage (Apollo Hospitals)', fractureToughnessMPaM05: 9, maxTempCelsius: 200, investmentCr: 135, status: 'Delivered', priority: 'High', origin: 'IIT Madras (TN)', destination: 'Apollo Hospitals Chennai (TN)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: 'Y-TZP/PEEK composite for lumbar interbody fusion cage &#8594; 9 MPa&#8730;m effective toughness with 40% zirconia in PEEK matrix &#8594; &#8377;135Cr for 5 tonnes composite implant stock &#8594; Apollo Hospitals performing 25,000 spine surgeries/year &#8594; TZP-PEEK modulus 18 GPa close to cortical bone 20 GPa reducing stress shielding &#8594; IIT Madras developing injection-moulded zirconia-PEEK process &#8594; &#8377;10,200Cr Indian spinal zirconia implant market' },
  { id: 'ZRC-0011', batchNo: 'ZRC-B2411', city: 'Bhubaneswar', manufacturer: 'Indian Rare Earths', ceramicType: 'Fused Zirconia (CaO-stab)', application: 'Foundry Coating (Larsen &amp; Toubro)', fractureToughnessMPaM05: 5, maxTempCelsius: 1400, investmentCr: 72, status: 'In Transit', priority: 'Medium', origin: 'IRE Chavara (KL)', destination: 'L&amp;T Heavy Eng Hazira (GJ)', shipDate: '2026-07-23', transitDays: 4, zone: 'East', remarks: 'CaO-stabilized fused zirconia for steel casting mould facing &#8594; 5 MPa&#8730;m toughness with CaO partial stabilization &#8594; &#8377;72Cr for 32 tonnes fused zirconia facing compound &#8594; L&amp;T Heavy Engineering casting 500-tonne steel components for nuclear &#8594; Fused zirconia mold surface finish Ra 3.2 micron vs 6.3 for silica sand &#8594; India 2nd largest casting producer globally 14 MTPA &#8594; &#8377;5,400Cr Indian foundry zirconia market' },
  { id: 'ZRC-0012', batchNo: 'ZRC-B2412', city: 'Guwahati', manufacturer: 'Oil India Ltd', ceramicType: 'TZP Valve Seat', application: 'Pipeline Control Valve (GAIL Assam)', fractureToughnessMPaM05: 10, maxTempCelsius: 350, investmentCr: 42, status: 'Delayed', priority: 'Medium', origin: 'Oil India Jorhat (AS)', destination: 'GAIL Duliajan (AS)', shipDate: '2026-07-11', transitDays: 1, zone: 'East', remarks: '3Y-TZP zirconia valve seat for natural gas pipeline control &#8594; 10 MPa&#8730;m toughness with zero cold-flow deformation &#8594; &#8377;42Cr for 8 tonnes TZP valve seat inserts &#8594; GAIL operating 13,000 km natural gas pipeline network &#8594; TZP valve seat seal life 500,000 cycles vs 50,000 for PEEK &#8594; Delayed 12 days due to monsoon flooding in Assam &#8594; &#8377;3,200Cr Indian pipeline zirconia market' },
  { id: 'ZRC-0013', batchNo: 'ZRC-B2413', city: 'Gandhinagar', manufacturer: 'Gujarat Fluorochemicals', ceramicType: 'Nano-ZrO2 (8nm)', application: 'Catalyst Support (Reliance Jamnagar)', fractureToughnessMPaM05: 1, maxTempCelsius: 600, investmentCr: 165, status: 'Processing', priority: 'Critical', origin: 'GFCL Gandhinagar (GJ)', destination: 'RIL Jamnagar Refinery (GJ)', shipDate: '2026-07-26', transitDays: 1, zone: 'West', remarks: 'Nano-zirconia 8nm powder for FCC catalyst support matrix &#8594; 1 MPa&#8730;m toughness as nano powder with 200 m2/g surface area &#8594; &#8377;165Cr for 12 tonnes nano-ZrO2 catalyst support &#8594; RIL Jamnagar world largest refinery 1.24 million bpd &#8594; Nano-ZrO2 FCC catalyst gives 3% gasoline yield improvement &#8594; India consuming 500 tonnes nano-zirconia/year for refining &#8594; &#8377;12,800Cr Indian refinery zirconia catalyst market' },
  { id: 'ZRC-0014', batchNo: 'ZRC-B2414', city: 'Lucknow', manufacturer: 'Tata Advanced Systems', ceramicType: 'ZrO2-WC Composite', application: 'Machining Centre Spindle Bearing (BHEL Bhopal)', fractureToughnessMPaM05: 12, maxTempCelsius: 450, investmentCr: 108, status: 'In Transit', priority: 'High', origin: 'TASL Lucknow (UP)', destination: 'BHEL Bhopal (MP)', shipDate: '2026-07-23', transitDays: 2, zone: 'North', remarks: 'Zirconia-tungsten carbide hybrid bearing for CNC machining spindle &#8594; 12 MPa&#8730;m toughness with 30% WC reinforcement in Y-TZP &#8594; &#8377;108Cr for 6 tonnes hybrid bearing balls and races &#8594; BHEL manufacturing 500 CNC machining centres/year &#8594; ZrO2-WC hybrid bearing speed rating 50% higher than all-steel at same load &#8594; TASL-BHEL JV for hybrid ceramic bearings &#8594; &#8377;8,500Cr Indian machine tool zirconia bearing market' },
]

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const
type TabType = typeof tabs[number]

export default function ZirconiaCeramicLogisticsView() {
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
    return zirconiaRecords.filter(r => {
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

  const uniqueCities = useMemo(() => [...new Set(zirconiaRecords.map(r => r.city))].sort(), [])
  const uniqueManufacturers = useMemo(() => [...new Set(zirconiaRecords.map(r => r.manufacturer))].sort(), [])
  const uniqueStatuses = useMemo(() => [...new Set(zirconiaRecords.map(r => r.status))].sort(), [])
  const uniqueZones = useMemo(() => [...new Set(zirconiaRecords.map(r => r.zone))].sort(), [])

  const totalInvestment = useMemo(() => zirconiaRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])
  const avgToughness = useMemo(() => (zirconiaRecords.reduce((s: number, r) => s + r.fractureToughnessMPaM05, 0) / zirconiaRecords.length).toFixed(1), [])
  const deliveredCount = useMemo(() => zirconiaRecords.filter(r => r.status === 'Delivered').length, [])
  const delayedCount = useMemo(() => zirconiaRecords.filter(r => r.status === 'Delayed').length, [])

  const cityInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of zirconiaRecords) { map[r.city] = (map[r.city] || 0) + r.investmentCr }
    return map
  }, [])

  const typeToughnessMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of zirconiaRecords) { map[r.ceramicType] = (map[r.ceramicType] || 0) + r.fractureToughnessMPaM05 }
    return map
  }, [])

  const statusCountMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of zirconiaRecords) { map[r.status] = (map[r.status] || 0) + 1 }
    return map
  }, [])

  const zoneInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of zirconiaRecords) { map[r.zone] = (map[r.zone] || 0) + r.investmentCr }
    return map
  }, [])

  const maxCity = useMemo(() => {
    const entries = (Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [cityInvestmentMap])

  const maxToughness = useMemo(() => {
    const entries = (Object.entries(typeToughnessMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [typeToughnessMap])

  return (
    <div className="space-y-6">
      <PageHeader title="Zirconia Ceramic Logistics" description="Advanced zirconia ceramic supply chain tracking for biomedical implants, aerospace coatings, SOFC electrolytes and industrial ceramics" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-rose-500 bg-rose-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Total Investment</div><div className="text-2xl font-bold text-rose-700">&#8377;{totalInvestment.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across {zirconiaRecords.length} batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-rose-500 bg-rose-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Avg Fracture Toughness</div><div className="text-2xl font-bold text-rose-700">{avgToughness} MPa&#8730;m</div><div className="text-xs text-muted-foreground mt-1">Across all ceramic types</div></CardContent></Card>
        <Card className="border-l-4 border-l-rose-500 bg-rose-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Delivered</div><div className="text-2xl font-bold text-rose-700">{deliveredCount}</div><div className="text-xs text-muted-foreground mt-1">{delayedCount} delayed</div></CardContent></Card>
        <Card className="border-l-4 border-l-rose-500 bg-rose-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Top City</div><div className="text-2xl font-bold text-rose-700">{maxCity[0]}</div><div className="text-xs text-muted-foreground mt-1">&#8377;{maxCity[1].toLocaleString()} Cr invested</div></CardContent></Card>
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
          <button key={tab} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-rose-500 text-rose-700' : 'text-muted-foreground'}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by City</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([city, val]) => (<div key={city} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{city}</span><div className="flex-1 bg-rose-100 rounded-full h-3"><div className="bg-rose-500 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Fracture Toughness by Ceramic Type</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(typeToughnessMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([type, tough]) => (<div key={type} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{type}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-500 h-3 rounded-full" style={{ width: `${(tough / maxToughness[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-24 text-right">{tough} MPa&#8730;m</span></div>))}</CardContent></Card>
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
              <thead><tr className="border-b"><th className="text-left p-2">Batch</th><th className="text-left p-2">City</th><th className="text-left p-2">Manufacturer</th><th className="text-left p-2">Ceramic Type</th><th className="text-left p-2">Application</th><th className="text-left p-2">K_IC</th><th className="text-left p-2">Max Temp</th><th className="text-left p-2">&#8377;Cr</th><th className="text-left p-2">Status</th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className={`border-b ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                    <td className="p-2 font-mono text-xs">{r.batchNo}</td>
                    <td className="p-2">{r.city}</td>
                    <td className="p-2">{r.manufacturer}</td>
                    <td className="p-2">{r.ceramicType}</td>
                    <td className="p-2 max-w-[200px] truncate">{r.application}</td>
                    <td className="p-2">{r.fractureToughnessMPaM05}</td>
                    <td className="p-2">{r.maxTempCelsius}&#176;C</td>
                    <td className="p-2 font-medium">&#8377;{r.investmentCr}</td>
                    <td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : r.status === 'Delayed' ? 'destructive' : 'secondary'}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-sm">Fracture Toughness Ranking</CardTitle></CardHeader><CardContent className="space-y-2">{zirconiaRecords.slice().sort((a, b) => b.fractureToughnessMPaM05 - a.fractureToughnessMPaM05).slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{r.ceramicType}</span><div className="flex-1 bg-pink-100 rounded-full h-3"><div className="bg-pink-500 h-3 rounded-full" style={{ width: `${(r.fractureToughnessMPaM05 / 15) * 100}%` }}></div></div><span className="text-xs font-medium w-24 text-right">{r.fractureToughnessMPaM05} MPa&#8730;m</span></div>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(zoneInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-violet-100 rounded-full h-3"><div className="bg-violet-500 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(statusCountMap) as [string, number][]).map(([status, count]) => (<div key={status} className="flex items-center gap-2"><span className="text-xs w-24">{status}</span><div className="flex-1 bg-gray-100 rounded-full h-3"><div className="bg-rose-500 h-3 rounded-full" style={{ width: `${(count / zirconiaRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of zirconiaRecords) { map[r.priority] = (map[r.priority] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([pri, count]) => (<div key={pri} className="flex items-center gap-2"><span className="text-xs w-20">{pri}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-500 h-3 rounded-full" style={{ width: `${(count / zirconiaRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipment Volume by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of zirconiaRecords) { map[r.zone] = (map[r.zone] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([zone, count]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-blue-100 rounded-full h-3"><div className="bg-blue-500 h-3 rounded-full" style={{ width: `${(count / zirconiaRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Temperature Range Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const ranges: Record<string, number> = { '200-500&#176;C': 0, '500-800&#176;C': 0, '800-1200&#176;C': 0, '1200-1600&#176;C': 0 }; for (const r of zirconiaRecords) { if (r.maxTempCelsius >= 1200) ranges['1200-1600&#176;C']++; else if (r.maxTempCelsius >= 800) ranges['800-1200&#176;C']++; else if (r.maxTempCelsius >= 500) ranges['500-800&#176;C']++; else ranges['200-500&#176;C']++ } return (Object.entries(ranges) as [string, number][]).map(([range, count]) => (<div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 bg-red-100 rounded-full h-3"><div className="bg-red-500 h-3 rounded-full" style={{ width: `${(count / zirconiaRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-rose-500"><CardHeader><CardTitle className="text-sm">Biomedical Zirconia Revolution</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India&apos;s orthopaedic implant market (&#8377;25,000Cr) is rapidly shifting from titanium to zirconia ceramics. Y-TZP offers 3x wear resistance, superior biocompatibility and radiolucency for post-operative imaging. SCTIMST Trivandrum and Apollo Hospitals are leading adopters, performing 40,000+ joint replacements annually using zirconia components. The domestic zirconia biomedical industry meets only 35% of demand, with Bharat Ceramics Bengaluru and CGCRI Kolkata being primary producers. CGCRI&apos;s patented sol-gel Bioglass-zirconia composite achieves 95% osseointegration at 6 weeks.</p></CardContent></Card>
          <Card className="border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm">Defence Armour Ceramics</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Ce-TZP zirconia represents the highest-performance armour ceramic with fracture toughness of 15 MPa&#8730;m, absorbing 3x kinetic energy versus alumina at equal thickness. DRDO DMRL and TASL are jointly developing Ce-TZP armour tiles for the BMP-II modernization programme covering 2,500 vehicles. The current ZRC-B2404 batch delay of 10 days highlights supply chain vulnerability for cerium oxide precursors sourced from Indian Rare Earths. India&apos;s defence ceramic market is projected at &#8377;14,200Cr by 2028, with zirconia-based systems accounting for 40%.</p></CardContent></Card>
          <Card className="border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm">SOFC Energy Transition</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Scandia-stabilized zirconia (ScSZ) electrolytes are critical for India&apos;s 2GW fuel cell target by 2030. ScSZ conductivity of 0.1 S/cm at 800&#176;C is 10x higher than conventional YSZ, enabling lower operating temperatures and longer stack life. BHEL is developing 250kW SOFC modules for distributed power generation with BEL supplying ScSZ tape-cast membranes. The scandium-zirconia supply chain is India&apos;s weakest link — scandium is imported 100% from China and Russia, costing &#8377;45,000/kg.</p></CardContent></Card>
          <Card className="border-l-4 border-l-blue-500"><CardHeader><CardTitle className="text-sm">Foundry &amp; Refractory Demand</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India is the world&apos;s 2nd largest casting producer at 14 MTPA, driving massive demand for zircon-based foundry coatings and refractories. Rajasthan State Mines (RSM) controls India&apos;s zircon sand resources sourced from Kerala&apos;s Chavara and Manavalakurichi deposits. Calcined zircon refractories offer 2,500 heat life in BOF furnaces versus 1,500 for magnesia-chrome, providing JSW Steel and Tata Steel significant cost savings. Indian Rare Earths supplies both fused zirconia for foundry facing and calcined zircon for refractory shapes.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
