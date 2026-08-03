'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Hammer } from 'lucide-react'

interface BoronCarbideRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  productForm: string
  application: string
  hardnessGPa: number
  densityGcc: number
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

const boronRecords: BoronCarbideRecord[] = [
  { id: 'BRC-0001', batchNo: 'BRC-B2401', city: 'Pune', manufacturer: 'DRDO DMRL', productForm: 'Hot Pressed B4C Plate', application: 'Body Armour Panel (TASL Infantry)', hardnessGPa: 30, densityGcc: 2.52, investmentCr: 225, status: 'Delivered', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TS)', destination: 'TASL Pune (MH)', shipDate: '2026-07-20', transitDays: 2, zone: 'West', remarks: 'Hot pressed B4C ceramic armour plate for infantry body armour vest &#8594; 30 GPa Vickers hardness with 2.52 g/cc density &#8594; &#8377;225Cr for 18 tonnes B4C plates &#8594; Indian Army modernizing 2 million soldier body armour sets &#8594; B4C NIJ Level IV stops 7.62mm AP at 15mm thickness &#8594; India importing 70% B4C armour plates from China and Germany &#8594; &#8377;18,000Cr Indian body armour B4C market' },
  { id: 'BRC-0002', batchNo: 'BRC-B2402', city: 'Hyderabad', manufacturer: 'MIDHANI Hyderabad', productForm: 'B4C-RX (Reaction Bonded)', application: 'Aircraft Brake Disc (HAL Tejas)', hardnessGPa: 28, densityGcc: 2.45, investmentCr: 195, status: 'In Transit', priority: 'Critical', origin: 'MIDHANI Hyderabad (TS)', destination: 'HAL Aero Division Bengaluru (KA)', shipDate: '2026-07-22', transitDays: 1, zone: 'South', remarks: 'B4C-SiC reaction bonded brake disc for Tejas Mk2 main gear &#8594; 28 GPa hardness with SiC reinforcement 2.45 g/cc &#8594; &#8377;195Cr for 14 tonnes brake disc blanks &#8594; HAL Tejas Mk2 carbon-carbon brake upgrade to B4C-SiC ceramic &#8594; B4C-SiC brake wear rate 1/5th of C-C at 1200&#176;C &#8594; India targeting 100% indigenous fighter brakes &#8594; &#8377;15,500Cr Indian aero brake B4C market' },
  { id: 'BRC-0003', batchNo: 'BRC-B2403', city: 'Mumbai', manufacturer: 'Saint-Gobain India', productForm: 'B4C Nozzle (Slip Cast)', application: 'Sandblasting Nozzle (Shot Blasters India)', hardnessGPa: 32, densityGcc: 2.50, investmentCr: 28, status: 'Delivered', priority: 'Medium', origin: 'Saint-Gobain Chennai (TN)', destination: 'Shot Blasters India Mumbai (MH)', shipDate: '2026-07-19', transitDays: 2, zone: 'West', remarks: 'Slip cast B4C sandblasting nozzle for industrial surface preparation &#8594; 32 GPa hardness for extreme erosion resistance &#8594; &#8377;28Cr for 4 tonnes B4C nozzle blanks &#8594; India 500,000 sandblasting operations/year in shipbuilding and construction &#8594; B4C nozzle life 800 hours vs 200 hours for WC &#8594; India importing 50% B4C nozzles from Japan &#8594; &#8377;2,200Cr Indian industrial B4C nozzle market' },
  { id: 'BRC-0004', batchNo: 'BRC-B2404', city: 'Bengaluru', manufacturer: 'ISRO LPSC', productForm: 'B4C Neutron Absorber Pellet', application: 'Nuclear Reactor Shield (IGCAR PFBR)', hardnessGPa: 0, densityGcc: 2.52, investmentCr: 310, status: 'Delayed', priority: 'Critical', origin: 'IGCAR Kalpakkam (TN)', destination: 'BHAVINI PFBR Kalpakkam (TN)', shipDate: '2026-07-12', transitDays: 1, zone: 'South', remarks: 'B4C neutron absorber pellet for PFBR reactor shielding control system &#8594; Boron-10 enriched B4C for thermal neutron absorption &#8594; &#8377;310Cr for 8 tonnes B4C shield pellets &#8594; PFBR 500MW fast reactor requiring 42 B4C shield assemblies &#8594; B4C neutron cross-section 3837 barns for B-10 isotope &#8594; Delayed 10 days due to enriched boron import delay &#8594; &#8377;25,000Cr Indian nuclear B4C programme' },
  { id: 'BRC-0005', batchNo: 'BRC-B2405', city: 'Chennai', manufacturer: 'Tata Advanced Materials', productForm: 'B4C Vehicle Armour Tile', application: 'APC Hull Armour (Tata Motors Defence)', hardnessGPa: 30, densityGcc: 2.52, investmentCr: 178, status: 'Processing', priority: 'High', origin: 'TAM Chennai (TN)', destination: 'Tata Motors Defence Pune (MH)', shipDate: '2026-07-25', transitDays: 2, zone: 'South', remarks: 'B4C ceramic tile for wheeled APC hull armour upgrade &#8594; 30 GPa hardness with alumina backing composite &#8594; &#8377;178Cr for 16 tonnes B4C armour tiles &#8594; Indian Army 4,600 BMP-II/ICV modernization &#8594; B4C-alumina composite stops 30mm APFSDS at 500m &#8594; Tata Motors defence division supplying 200 APC/year &#8594; &#8377;14,200Cr Indian vehicle armour B4C market' },
  { id: 'BRC-0006', batchNo: 'BRC-B2406', city: 'Noida', manufacturer: 'Bharat Electronics', productForm: 'B4C Lens Dome', application: 'IR Seeker Dome (DRDO Astra Mk3)', hardnessGPa: 0, densityGcc: 2.52, investmentCr: 88, status: 'Delivered', priority: 'Critical', origin: 'BEL Noida (UP)', destination: 'DRDO IRDE Dehradun (UK)', shipDate: '2026-07-17', transitDays: 1, zone: 'North', remarks: 'B4C infrared transparent dome for Astra Mk3 BVR missile seeker &#8594; B4C transmits 3-5 micron IR band for InSb detector &#8594; &#8377;88Cr for 2 tonnes B4C dome blanks &#8594; DRDO Astra Mk3 350km range with imaging IR seeker &#8594; B4C IR dome hardness 10x sapphire enabling supersonic flight without erosion &#8594; India developing indigenous missile seeker domes &#8594; &#8377;6,800Cr Indian missile B4C market' },
  { id: 'BRC-0007', batchNo: 'BRC-B2407', city: 'Kolkata', manufacturer: 'CGCRI Kolkata', productForm: 'B4C Substrate (CVD)', application: 'Thermoelectric Generator (BARC)', hardnessGPa: 0, densityGcc: 2.52, investmentCr: 65, status: 'In Transit', priority: 'High', origin: 'CGCRI Kolkata (WB)', destination: 'BARC Trombay (MH)', shipDate: '2026-07-21', transitDays: 3, zone: 'East', remarks: 'CVD B4C substrate for high-temperature thermoelectric module &#8594; B4C Seebeck coefficient 200 microV/K at 1000K &#8594; &#8377;65Cr for 1.5 tonnes B4C substrate &#8594; BARC developing 500W RTG for deep space missions &#8594; B4C thermoelectric figure of merit ZT=0.6 at 1300K &#8594; CGCRI patented CVD B4C thin film process &#8594; &#8377;5,200Cr Indian space nuclear B4C programme' },
  { id: 'BRC-0008', batchNo: 'BRC-B2408', city: 'Ahmedabad', manufacturer: 'Reliance SBR', productForm: 'B4C Abrasive Grain', application: 'Lapping Compound (Hindustan Bearings)', hardnessGPa: 32, densityGcc: 2.52, investmentCr: 35, status: 'Delivered', priority: 'Medium', origin: 'Reliance SBR Ahmedabad (GJ)', destination: 'Hindustan Bearings Pune (MH)', shipDate: '2026-07-16', transitDays: 2, zone: 'West', remarks: 'B4C abrasive grain for precision bearing lapping compound &#8594; 32 GPa hardness second only to diamond/cBN &#8594; &#8377;35Cr for 5 tonnes B4C abrasive &#8594; India 3 billion bearings/year requiring precision finishing &#8594; B4C lapping achieves Ra 0.02 micron surface finish &#8594; India importing 40% B4C abrasive from China &#8594; &#8377;2,800Cr Indian bearing abrasive B4C market' },
  { id: 'BRC-0009', batchNo: 'BRC-B2409', city: 'Jaipur', manufacturer: 'Rajasthan State Mines', productForm: 'Boron Carbide Powder (B4C)', application: 'Defence Ceramics Feed (DRDO TBRL)', hardnessGPa: 30, densityGcc: 2.52, investmentCr: 92, status: 'Processing', priority: 'High', origin: 'RSM Processing Jaipur (RJ)', destination: 'DRDO TBRL Chandigarh (PB)', shipDate: '2026-07-24', transitDays: 2, zone: 'North', remarks: 'B4C powder for defence ceramics hot pressing feedstock &#8594; 30 GPa target hardness submicron B4C powder 1.5 micron &#8594; &#8377;92Cr for 8 tonnes B4C powder &#8594; DRDO TBRL armour testing facility 200 test campaigns/year &#8594; Indigenous B4C powder reduces import from 70% to 40% &#8594; Rajasthan borax deposits as indigenous boron source &#8594; &#8377;7,500Cr Indian B4C powder market' },
  { id: 'BRC-0010', batchNo: 'BRC-B2410', city: 'Coimbatore', manufacturer: 'IIT Madras Research', productForm: 'B4C Nano Coating (PVD)', application: 'Turbine Blade Coating (BHEL)', hardnessGPa: 35, densityGcc: 3.2, investmentCr: 145, status: 'Delivered', priority: 'High', origin: 'IIT Madras (TN)', destination: 'BHEL Trichy (TN)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: 'PVD B4C-SiC nano composite coating for gas turbine blade erosion shield &#8594; 35 GPa nanostructured hardness with SiC nanofiller &#8594; &#8377;145Cr for 3 tonnes B4C coating target material &#8594; BHEL 42 gas turbines suffering blade erosion in fly ash service &#8594; B4C nano coating erosion rate 1/20th of standard TBC &#8594; IIT Madras developing multi-target magnetron sputtering process &#8594; &#8377;11,500Cr Indian turbine B4C coating market' },
  { id: 'BRC-0011', batchNo: 'BRC-B2411', city: 'Bhubaneswar', manufacturer: 'NALCO Smelter', productForm: 'Boric Acid to B2O3 Precursor', application: 'B4C Synthesis (IRE Chavara)', hardnessGPa: 0, densityGcc: 0, investmentCr: 55, status: 'In Transit', priority: 'High', origin: 'NALCO Angul (OD)', destination: 'IRE Chavara (KL)', shipDate: '2026-07-23', transitDays: 4, zone: 'East', remarks: 'Boric acid precursor from NALCO for B4C carbothermal synthesis &#8594; H3BO3 calcined to B2O3 then reduced with carbon at 1800&#176;C &#8594; &#8377;55Cr for 25 tonnes boric acid &#8594; IRE producing 500 tonnes B4C/year at Chavara &#8594; India importing 60% boron raw material from Turkey &#8594; NALCO leveraging aluminium byproduct for boron chemicals &#8594; &#8377;4,200Cr Indian boron precursor market' },
  { id: 'BRC-0012', batchNo: 'BRC-B2412', city: 'Guwahati', manufacturer: 'Oil India Ltd', productForm: 'B4C Wear Liner', application: 'Drilling Rig Mud Pump (ONGC Jorhat)', hardnessGPa: 30, densityGcc: 2.52, investmentCr: 38, status: 'Delayed', priority: 'Medium', origin: 'IRE Chavara (KL)', destination: 'ONGC Jorhat (AS)', shipDate: '2026-07-11', transitDays: 6, zone: 'East', remarks: 'B4C ceramic wear liner for mud pump cylinder &#8594; 30 GPa hardness for abrasive drilling mud resistance &#8594; &#8377;38Cr for 4 tonnes B4C liner segments &#8594; ONGC drilling 200 wells/year in Assam basin &#8594; B4C liner life 5x alumina in abrasive mud service &#8594; Delayed 12 days due to monsoon logistics to Assam &#8594; &#8377;2,800Cr Indian oilfield B4C market' },
  { id: 'BRC-0013', batchNo: 'BRC-B2413', city: 'Gandhinagar', manufacturer: 'Gujarat Fluorochemicals', productForm: 'B4C Thermocouple Sheath', application: 'Melt Temperature Sensor (Adani Steel)', hardnessGPa: 28, densityGcc: 2.52, investmentCr: 42, status: 'Processing', priority: 'Medium', origin: 'GFCL Gandhinagar (GJ)', destination: 'Adani Steel Hazira (GJ)', shipDate: '2026-07-26', transitDays: 1, zone: 'West', remarks: 'B4C sheath for Type K thermocouple in steel melt &#8594; 28 GPa hardness for molten steel corrosion and erosion resistance &#8594; &#8377;42Cr for 3 tonnes B4C sheath tubes &#8594; Adani Steel 10 MTPA steel requiring 500 thermocouples/heat &#8594; B4C sheath life 200 heats vs 50 for alumina &#8594; GFCL expanding into advanced ceramics &#8594; &#8377;3,200Cr Indian steel B4C sensor market' },
  { id: 'BRC-0014', batchNo: 'BRC-B2414', city: 'Lucknow', manufacturer: 'Tata Advanced Systems', productForm: 'B4C Helicopter Armour Tile', application: 'ALH Dhruv Floor Armour (HAL)', hardnessGPa: 30, densityGcc: 2.52, investmentCr: 152, status: 'In Transit', priority: 'High', origin: 'TASL Lucknow (UP)', destination: 'HAL Rotary Wing Bengaluru (KA)', shipDate: '2026-07-23', transitDays: 2, zone: 'North', remarks: 'B4C-alumina composite floor armour for ALH Dhruv Mk3 &#8594; 30 GPa B4C face with alumina energy absorber backing &#8594; &#8377;152Cr for 12 tonnes B4C floor tiles &#8594; HAL producing 60 ALH helicopters/year &#8594; B4C-alumina composite stops 7.62mm API at 10mm total thickness 2.2 kg/m2 &#8594; Indian Army and IAF operating 350+ Dhruv helicopters &#8594; &#8377;12,000Cr Indian helicopter armour B4C market' },
]

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const
type TabType = typeof tabs[number]

export default function BoronCarbideLogisticsView() {
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
    return boronRecords.filter(r => {
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

  const uniqueCities = useMemo(() => [...new Set(boronRecords.map(r => r.city))].sort(), [])
  const uniqueManufacturers = useMemo(() => [...new Set(boronRecords.map(r => r.manufacturer))].sort(), [])
  const uniqueStatuses = useMemo(() => [...new Set(boronRecords.map(r => r.status))].sort(), [])
  const uniqueZones = useMemo(() => [...new Set(boronRecords.map(r => r.zone))].sort(), [])

  const totalInvestment = useMemo(() => boronRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])
  const structuralRecords = useMemo(() => boronRecords.filter(r => r.hardnessGPa > 0), [])
  const avgHardness = useMemo(() => structuralRecords.length > 0 ? Math.round(structuralRecords.reduce((s: number, r) => s + r.hardnessGPa, 0) / structuralRecords.length) : 0, [])
  const deliveredCount = useMemo(() => boronRecords.filter(r => r.status === 'Delivered').length, [])
  const delayedCount = useMemo(() => boronRecords.filter(r => r.status === 'Delayed').length, [])

  const cityInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of boronRecords) { map[r.city] = (map[r.city] || 0) + r.investmentCr }
    return map
  }, [])

  const formInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of boronRecords) { map[r.productForm] = (map[r.productForm] || 0) + r.investmentCr }
    return map
  }, [])

  const statusCountMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of boronRecords) { map[r.status] = (map[r.status] || 0) + 1 }
    return map
  }, [])

  const zoneInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of boronRecords) { map[r.zone] = (map[r.zone] || 0) + r.investmentCr }
    return map
  }, [])

  const maxCity = useMemo(() => {
    const entries = (Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [cityInvestmentMap])

  const maxForm = useMemo(() => {
    const entries = (Object.entries(formInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [formInvestmentMap])

  return (
    <div className="space-y-6">
      <PageHeader title="Boron Carbide Logistics" description="Advanced boron carbide ceramic supply chain tracking for body armour, vehicle protection, nuclear shielding, aerospace brakes and industrial abrasives" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-indigo-500 bg-indigo-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Total Investment</div><div className="text-2xl font-bold text-indigo-700">&#8377;{totalInvestment.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across {boronRecords.length} batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-indigo-500 bg-indigo-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Avg Hardness</div><div className="text-2xl font-bold text-indigo-700">{avgHardness} GPa</div><div className="text-xs text-muted-foreground mt-1">Structural B4C grades</div></CardContent></Card>
        <Card className="border-l-4 border-l-indigo-500 bg-indigo-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Delivered</div><div className="text-2xl font-bold text-indigo-700">{deliveredCount}</div><div className="text-xs text-muted-foreground mt-1">{delayedCount} delayed</div></CardContent></Card>
        <Card className="border-l-4 border-l-indigo-500 bg-indigo-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Top City</div><div className="text-2xl font-bold text-indigo-700">{maxCity[0]}</div><div className="text-xs text-muted-foreground mt-1">&#8377;{maxCity[1].toLocaleString()} Cr invested</div></CardContent></Card>
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
          <button key={tab} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-indigo-500 text-indigo-700' : 'text-muted-foreground'}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by City</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([city, val]) => (<div key={city} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{city}</span><div className="flex-1 bg-indigo-100 rounded-full h-3"><div className="bg-indigo-500 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Investment by Product Form</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(formInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([form, val]) => (<div key={form} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{form}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-500 h-3 rounded-full" style={{ width: `${(val / maxForm[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
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
              <thead><tr className="border-b"><th className="text-left p-2">Batch</th><th className="text-left p-2">City</th><th className="text-left p-2">Manufacturer</th><th className="text-left p-2">Product Form</th><th className="text-left p-2">Application</th><th className="text-left p-2">HV (GPa)</th><th className="text-left p-2">Density</th><th className="text-left p-2">&#8377;Cr</th><th className="text-left p-2">Status</th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className={`border-b ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                    <td className="p-2 font-mono text-xs">{r.batchNo}</td>
                    <td className="p-2">{r.city}</td>
                    <td className="p-2">{r.manufacturer}</td>
                    <td className="p-2">{r.productForm}</td>
                    <td className="p-2 max-w-[200px] truncate">{r.application}</td>
                    <td className="p-2">{r.hardnessGPa > 0 ? r.hardnessGPa : 'N/A'}</td>
                    <td className="p-2">{r.densityGcc > 0 ? r.densityGcc : 'N/A'}</td>
                    <td className="p-2 font-medium">&#8377;{r.investmentCr}</td>
                    <td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : r.status === 'Delayed' ? 'destructive' : 'secondary'}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-sm">Hardness by Grade</CardTitle></CardHeader><CardContent className="space-y-2">{structuralRecords.slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{r.productForm}</span><div className="flex-1 bg-red-100 rounded-full h-3"><div className="bg-red-500 h-3 rounded-full" style={{ width: `${(r.hardnessGPa / 35) * 100}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{r.hardnessGPa} GPa</span></div>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(zoneInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-violet-100 rounded-full h-3"><div className="bg-violet-500 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(statusCountMap) as [string, number][]).map(([status, count]) => (<div key={status} className="flex items-center gap-2"><span className="text-xs w-24">{status}</span><div className="flex-1 bg-gray-100 rounded-full h-3"><div className="bg-indigo-500 h-3 rounded-full" style={{ width: `${(count / boronRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of boronRecords) { map[r.priority] = (map[r.priority] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([pri, count]) => (<div key={pri} className="flex items-center gap-2"><span className="text-xs w-20">{pri}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-500 h-3 rounded-full" style={{ width: `${(count / boronRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipment Volume by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of boronRecords) { map[r.zone] = (map[r.zone] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([zone, count]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-blue-100 rounded-full h-3"><div className="bg-blue-500 h-3 rounded-full" style={{ width: `${(count / boronRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Application Domain Split</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of boronRecords) { const d = r.application.includes('Armour') || r.application.includes('armour') ? 'Defence Armour' : r.application.includes('Nuclear') || r.application.includes('neutron') ? 'Nuclear Shielding' : r.application.includes('Aerospace') || r.application.includes('Brake') || r.application.includes('Turbine') ? 'Aerospace/Turbine' : r.application.includes('Sandblast') || r.application.includes('Abrasive') || r.application.includes('Lapping') || r.application.includes('Drilling') || r.application.includes('Wear') ? 'Industrial Abrasive' : r.application.includes('Thermo') || r.application.includes('Sensor') || r.application.includes('Seeker') ? 'Specialty/Sensor' : 'Feedstock'; map[d] = (map[d] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([domain, count]) => (<div key={domain} className="flex items-center gap-2"><span className="text-xs w-28">{domain}</span><div className="flex-1 bg-emerald-100 rounded-full h-3"><div className="bg-emerald-500 h-3 rounded-full" style={{ width: `${(count / boronRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-indigo-500"><CardHeader><CardTitle className="text-sm">Body Armour: Strategic Imperative</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India is modernizing 2 million soldier body armour sets, each requiring 4.5 kg of B4C ceramic plates for NIJ Level IV protection against 7.62mm AP rounds. At 30 GPa hardness and 2.52 g/cc density, B4C offers the best weight-to-protection ratio of any ceramic armour material — 15mm B4C stops what requires 22mm alumina or 18mm SiC. India imports 70% of B4C armour plates from China and Germany. DRDO DMRL and TASL are establishing indigenous hot-pressing capacity to meet 500 tonnes/year demand by 2028, targeting 60% import substitution. Total Indian body armour B4C market is &#8377;18,000Cr by 2030.</p></CardContent></Card>
          <Card className="border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm">Nuclear Shielding: B4C Neutron Control</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Boron carbide&apos;s Boron-10 isotope has the highest thermal neutron cross-section of any element (3,837 barns), making it indispensable for nuclear reactor shielding and control systems. IGCAR&apos;s PFBR 500MW fast reactor requires 42 B4C shield assemblies enriched to 90% B-10. BHAVINI&apos;s delayed BRC-B2404 batch of 8 tonnes enriched B4C pellets highlights the supply chain vulnerability for enriched boron — India imports 80% from Russia. BARC is developing indigenous enriched B4C production using laser isotope separation. India&apos;s nuclear B4C programme is &#8377;25,000Cr with 10 reactors under construction.</p></CardContent></Card>
          <Card className="border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm">Vehicle Armour Modernization</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Indian Army&apos;s 4,600 BMP-II/ICV infantry fighting vehicles require hull armour upgrade to defeat 30mm APFSDS rounds. B4C-alumina composite tiles stop 30mm AP at 500m with total thickness of only 25mm and areal density 55 kg/m2. Tata Motors Defence and TASL are jointly producing 200 upgraded APCs/year. Additionally, HAL&apos;s ALH Dhruv helicopter fleet (350+ aircraft) needs B4C floor armour against ground fire. India&apos;s combined vehicle and helicopter armour B4C market is &#8377;26,200Cr by 2030.</p></CardContent></Card>
          <Card className="border-l-4 border-l-blue-500"><CardHeader><CardTitle className="text-sm">Industrial and Aerospace Growth</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Beyond defence, B4C serves critical roles in industrial abrasives (32 GPa hardness second only to diamond/cBN), aerospace brakes (B4C-SiC for HAL Tejas), turbine erosion coatings (IIT Madras nanostructured B4C-SiC), and oilfield wear liners. Saint-Gobain India is the largest domestic B4C producer at Chavara with 500 tonnes/year capacity, meeting 40% of demand. NALCO and Rajasthan State Mines are developing indigenous boron precursor routes from Indian borax and colemanite deposits. India&apos;s non-defence B4C market is &#8377;17,500Cr growing at 12% CAGR driven by Make in India manufacturing expansion.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
