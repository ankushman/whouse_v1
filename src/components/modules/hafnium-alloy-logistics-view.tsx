'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck } from 'lucide-react'

interface HafniumAlloyRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  alloyGrade: string
  application: string
  hafniumPercent: number
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

const hafniumRecords: HafniumAlloyRecord[] = [
  { id: 'HAF-0001', batchNo: 'HAF-B2401', city: 'Mumbai', manufacturer: 'MIDHANI Mumbai', alloyGrade: 'Hf-10Nb-Zr (C-103 mod)', application: 'Rocket Nozzle Extension (ISRO PSLV)', hafniumPercent: 45, maxTempCelsius: 1650, investmentCr: 385, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Mumbai (MH)', destination: 'ISRO LPSC Thiruvananthapuram (KL)', shipDate: '2026-07-20', transitDays: 3, zone: 'West', remarks: 'Hf-10Nb-Zr alloy nozzle extension for PSLV fourth stage Vikas engine &#8594; 45% Hf with 10% Nb and balance Zr &#8594; &#8377;385Cr for 12 tonnes nozzle forgings &#8594; ISRO launching 12 PSLV missions/year &#8594; Hf-Nb-Zr retains 85% strength at 1650&#176;C in hydrogen atmosphere &#8594; India importing 95% nuclear-grade hafnium from France and Russia &#8594; &#8377;28,500Cr Indian space Hf alloy programme' },
  { id: 'HAF-0002', batchNo: 'HAF-B2402', city: 'Hyderabad', manufacturer: 'IGCAR Kalpakkam', alloyGrade: 'Hf-Nb (Hf-2.5Nb)', application: 'Nuclear Reactor Control Blade (BHAVINI PFBR)', hafniumPercent: 97, maxTempCelsius: 800, investmentCr: 420, status: 'In Transit', priority: 'Critical', origin: 'IGCAR Kalpakkam (TN)', destination: 'BHAVINI Kalpakkam (TN)', shipDate: '2026-07-22', transitDays: 1, zone: 'South', remarks: 'Hf-2.5Nb alloy control blade for 500MW Prototype Fast Breeder Reactor &#8594; 97% Hf with 2.5% Nb for neutron absorption and high-temp strength &#8594; &#8377;420Cr for 6 tonnes Hf alloy blade stock &#8594; PFBR uses 42 control blades requiring 1.2 tonnes Hf each &#8594; Hf thermal neutron cross-section 104 barns ideal for reactor control &#8594; India has 8 reactors under construction worth &#8377;2.4 lakh Cr &#8594; &#8377;32,000Cr Indian nuclear Hf demand' },
  { id: 'HAF-0003', batchNo: 'HAF-B2403', city: 'Bengaluru', manufacturer: 'HAL Aero Engines', alloyGrade: 'HfC-Coated C103', application: 'Turbine Blade Thermal Barrier (LCA Tejas Mk2)', hafniumPercent: 18, maxTempCelsius: 1400, investmentCr: 265, status: 'Delivered', priority: 'High', origin: 'HAL Engine Division Bengaluru (KA)', destination: 'DRDO GTRE Bengaluru (KA)', shipDate: '2026-07-19', transitDays: 1, zone: 'South', remarks: 'HfC EB-PVD thermal barrier coating on C103 turbine blade &#8594; 18% Hf as hafnium carbide in YSZ-HfC multilayer &#8594; &#8377;265Cr for 28 tonnes coated blade blanks &#8594; Tejas Mk2 F414-GE-INS6 engine requiring 200+ coated blades &#8594; HfC layer raises TBC life from 10,000 to 25,000 thermal cycles &#8594; India importing 80% TBC coating powders from USA &#8594; &#8377;18,200Cr Indian aerospace HfC coating market' },
  { id: 'HAF-0004', batchNo: 'HAF-B2404', city: 'Pune', manufacturer: 'DRDO DMRL', alloyGrade: 'Hf-Ta-C (Hf-15Ta-5C)', application: 'Hypersonic Vehicle Nose Cap (DRDO HSTDV)', hafniumPercent: 80, maxTempCelsius: 2200, investmentCr: 510, status: 'Delayed', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TS)', destination: 'DRDO TBRL Chandigarh (PB)', shipDate: '2026-07-12', transitDays: 4, zone: 'West', remarks: 'Hf-Ta-C ultra-high temp ceramic matrix composite for Mach 7 nose cap &#8594; 80% Hf with 15% Ta and 5% C forming HfC-TaC solid solution &#8594; &#8377;510Cr for 4.5 tonnes nose cap preforms &#8594; HSTDV scramjet demonstrator achieving Mach 6.5 flight &#8594; HfC-TaC melting point 3900&#176;C highest of all binary compounds &#8594; Delayed 10 days due to hafnium sponge import quarantine &#8594; &#8377;38,000Cr Indian hypersonic Hf programme' },
  { id: 'HAF-0005', batchNo: 'HAF-B2405', city: 'Chennai', manufacturer: 'Tata Advanced Materials', alloyGrade: 'Hf-Ni-Al (Hf-12Ni-8Al)', application: 'Aero Engine Combustor (GE Aerospace TAL)', hafniumPercent: 80, maxTempCelsius: 1200, investmentCr: 198, status: 'Processing', priority: 'High', origin: 'TAM Chennai (TN)', destination: 'GE TAL Pune (MH)', shipDate: '2026-07-25', transitDays: 2, zone: 'South', remarks: 'Hf-Ni-Al superalloy combustor liner for LEAP-1C turbofan &#8594; 80% Hf with 12% Ni and 8% Al forming gamma-prime Hf3NiAl &#8594; &#8377;198Cr for 35 tonnes sheet and plate stock &#8594; TAL manufacturing 160 LEAP engines/year for Airbus A320neo &#8594; Hf-based gamma-prime stable to 1200&#176;C vs 1050&#176;C for Ni-based &#8594; &#8377;15,600Cr Indian aero engine Hf alloy demand' },
  { id: 'HAF-0006', batchNo: 'HAF-B2406', city: 'Noida', manufacturer: 'Bharat Electronics', alloyGrade: 'HfO2 Thin Film', application: 'DRAM Capacitor Dielectric (SCL Chandigarh)', hafniumPercent: 52, maxTempCelsius: 450, investmentCr: 145, status: 'Delivered', priority: 'High', origin: 'BEL Noida (UP)', destination: 'SCL Mohali (PB)', shipDate: '2026-07-17', transitDays: 1, zone: 'North', remarks: 'HfO2 high-K dielectric thin film for 28nm DRAM node &#8594; 52% Hf as HfO2 with ZrO2 interface layer &#8594; &#8377;145Cr for 200 ALD wafer batches &#8594; SCL producing 5000 wafer starts/month for defence electronics &#8594; HfO2 dielectric constant K=25 vs K=3.9 for SiO2 enabling 6x capacitor density &#8594; India targeting 28nm fab under semiconductor mission &#85377;76,000Cr &#8594; &#8377;11,200Cr Indian semiconductor Hf market' },
  { id: 'HAF-0007', batchNo: 'HAF-B2407', city: 'Kolkata', manufacturer: 'Hindalco Industries', alloyGrade: 'Hf-Zr Sponge (Hf-3Zr)', application: 'Welding Electrode Core (DAV Nagpur)', hafniumPercent: 97, maxTempCelsius: 400, investmentCr: 88, status: 'In Transit', priority: 'Medium', origin: 'Hindalco R&amp;D Kolkata (WB)', destination: 'DAV Nagpur (MH)', shipDate: '2026-07-21', transitDays: 3, zone: 'East', remarks: 'Crystal bar Hf-3Zr sponge for nuclear-grade welding electrodes &#8594; 97% Hf with 3% Zr to prevent grain growth &#8594; &#8377;88Cr for 8 tonnes hafnium sponge &#8594; DAV Defence Alloy producing 200 tonnes nuclear welding consumables/year &#8594; Hf added to prevent cracking in Zr-Nb alloy nuclear welds &#8594; India consuming 45 tonnes hafnium sponge/year for nuclear programme &#8594; &#8377;7,500Cr Indian nuclear hafnium market' },
  { id: 'HAF-0008', batchNo: 'HAF-B2408', city: 'Ahmedabad', manufacturer: 'PRL Ahmedabad', alloyGrade: 'Hf-B (HfB2)', application: 'Re-Entry Vehicle Heat Shield (ISRO Gaganyaan)', hafniumPercent: 67, maxTempCelsius: 2500, investmentCr: 345, status: 'Delivered', priority: 'Critical', origin: 'PRL Ahmedabad (GJ)', destination: 'ISRO VSSC Thiruvananthapuram (KL)', shipDate: '2026-07-16', transitDays: 3, zone: 'West', remarks: 'HfB2 ultra-high temp ceramic for Gaganyaan crew module heat shield &#8594; 67% Hf as hafnium diboride with SiC reinforcement &#8594; &#8377;345Cr for 5.5 tonnes HfB2-SiC tiles &#8594; Gaganyaan crew module experiencing 2700&#176;C during re-entry &#8594; HfB2 oxidation onset 1400&#176;C in air vs 800&#176;C for ZrB2 &#8594; India first crewed mission targeted for 2027 &#8594; &#8377;26,000Cr Indian crewed space Hf programme' },
  { id: 'HAF-0009', batchNo: 'HAF-B2409', city: 'Jaipur', manufacturer: 'Rajasthan State Mines', alloyGrade: 'Hf-Ti (Hf-20Ti)', application: 'Marine Desalination Heater Tube (WAP Delhi)', hafniumPercent: 80, maxTempCelsius: 350, investmentCr: 72, status: 'Processing', priority: 'Medium', origin: 'RSM Processing Jaipur (RJ)', destination: 'WAP Delhi (DL)', shipDate: '2026-07-24', transitDays: 1, zone: 'North', remarks: 'Hf-20Ti alloy tube for naval desalination plant flash evaporator &#8594; 80% Hf with 20% Ti for seawater corrosion resistance &#8594; &#8377;72Cr for 18 tonnes seamless tubes &#8594; Indian Navy operating 150+ warships with desalination plants &#8594; Hf-Ti corrosion rate in seawater 0.001mm/year vs 0.05mm for Ti-6Al-4V &#8594; India importing 100% hafnium tube stock &#8594; &#8377;5,800Cr Indian naval Hf alloy market' },
  { id: 'HAF-0010', batchNo: 'HAF-B2410', city: 'Coimbatore', manufacturer: 'IIT Madras Research', alloyGrade: 'Hf-Si-C (HfSiC)', application: 'Gas Turbine Shroud Insert (BHEL Tiruchy)', hafniumPercent: 35, maxTempCelsius: 1350, investmentCr: 165, status: 'Delivered', priority: 'High', origin: 'IIT Madras (TN)', destination: 'BHEL Trichy (TN)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: 'HfSiC CMC shroud insert for 800MW gas turbine &#8594; 35% Hf as hafnium silicide carbide with SiC fiber reinforcement &#8594; &#8377;165Cr for 14 tonnes CMC shroud segments &#8594; BHEL Trichy manufacturing 42 gas turbines/year &#8594; HfSiC CMC density 5.8 g/cc vs 8.0 for Inconel giving 28% weight saving &#8594; IIT Madras developing indigenous Hf-Si-C precursor route &#8594; &#8377;12,400Cr Indian turbine Hf-CMC programme' },
  { id: 'HAF-0011', batchNo: 'HAF-B2411', city: 'Bhubaneswar', manufacturer: 'NALCO Smelter', alloyGrade: 'Hf-Cr (Hf-5Cr)', application: 'Petrochemical Cracker Tube (Indian Oil Paradip)', hafniumPercent: 95, maxTempCelsius: 1100, investmentCr: 128, status: 'In Transit', priority: 'High', origin: 'NALCO Angul (OD)', destination: 'Indian Oil Paradip (OD)', shipDate: '2026-07-23', transitDays: 1, zone: 'East', remarks: 'Hf-5Cr alloy centrifugal casting for ethylene cracker furnace tube &#8594; 95% Hf with 5% Cr for carburization resistance &#8594; &#8377;128Cr for 22 tonnes tube castings &#8594; Indian Oil Paradip 1.1 MMTPA ethylene cracker &#8594; Hf-Cr tube life 100,000 hours vs 40,000 for HP-modified alloy &#8594; NALCO leveraging zirconium byproduct to produce hafnium &#8594; &#8377;9,800Cr Indian petrochemical Hf alloy demand' },
  { id: 'HAF-0012', batchNo: 'HAF-B2412', city: 'Guwahati', manufacturer: 'Oil India Ltd', alloyGrade: 'Hf-W (Hf-10W)', application: 'Geothermal Well Casing (ONGC Jorhat)', hafniumPercent: 90, maxTempCelsius: 450, investmentCr: 56, status: 'Delayed', priority: 'Medium', origin: 'Oil India Jorhat (AS)', destination: 'ONGC Geothermal Surajkund (JH)', shipDate: '2026-07-11', transitDays: 5, zone: 'East', remarks: 'Hf-10W alloy casing for Puga Valley geothermal well 350&#176;C &#8594; 90% Hf with 10% W for high-temp corrosion resistance &#8594; &#8377;56Cr for 6 tonnes casing pipe &#8594; ONGC drilling 5 geothermal wells in Ladakh at 350&#176;C &#8594; Hf-W resists H2S-CO2-Cl brine at 350&#176;C for 30-year life &#8594; Delayed 12 days due to transport restrictions to Ladakh &#8594; &#8377;4,200Cr Indian geothermal Hf alloy demand' },
  { id: 'HAF-0013', batchNo: 'HAF-B2413', city: 'Gandhinagar', manufacturer: 'Gujarat Fluorochemicals', alloyGrade: 'HfN Sputter Target', application: 'Gate Electrode (Tata Electronics fab)', hafniumPercent: 50, maxTempCelsius: 500, investmentCr: 178, status: 'Processing', priority: 'Critical', origin: 'GFCL Gandhinagar (GJ)', destination: 'Tata Electronics Hosur (TN)', shipDate: '2026-07-26', transitDays: 2, zone: 'West', remarks: 'HfN sputtering target for 28nm FinFET metal gate electrode &#8594; 50% Hf as hafnium nitride with TiN capping layer &#8594; &#8377;178Cr for 150 sputtering targets &#8594; Tata Electronics fab targeting 30,000 WSPM by 2027 &#8594; HfN work function 4.6eV ideal for NMOS threshold tuning &#8594; India importing all semiconductor-grade HfN targets &#8594; &#8377;13,500Cr Indian semiconductor Hf target market' },
  { id: 'HAF-0014', batchNo: 'HAF-B2414', city: 'Lucknow', manufacturer: 'Tata Advanced Systems', alloyGrade: 'Hf-Mo (Hf-15Mo)', application: 'Missile Radome (DRDO BrahMos II)', hafniumPercent: 85, maxTempCelsius: 1800, investmentCr: 298, status: 'In Transit', priority: 'Critical', origin: 'TASL Lucknow (UP)', destination: 'DRDO DL Hyderabad (TS)', shipDate: '2026-07-23', transitDays: 2, zone: 'North', remarks: 'Hf-15Mo alloy radome for Mach 8 hypersonic cruise missile &#8594; 85% Hf with 15% Mo for high-temp strength and radar transparency &#8594; &#8377;298Cr for 8 tonnes radome blanks &#8594; BrahMos II hypersonic missile Mach 8 speed requiring 1800&#176;C radome &#8594; Hf-Mo dielectric constant 12 at 10GHz enabling low-loss radome &#8594; TASL-DRDO JV for hypersonic material development &#8594; &#8377;22,800Cr Indian missile Hf alloy programme' },
]

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const
type TabType = typeof tabs[number]

export default function HafniumAlloyLogisticsView() {
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
    return hafniumRecords.filter(r => {
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

  const uniqueCities = useMemo(() => [...new Set(hafniumRecords.map(r => r.city))].sort(), [])
  const uniqueManufacturers = useMemo(() => [...new Set(hafniumRecords.map(r => r.manufacturer))].sort(), [])
  const uniqueStatuses = useMemo(() => [...new Set(hafniumRecords.map(r => r.status))].sort(), [])
  const uniqueZones = useMemo(() => [...new Set(hafniumRecords.map(r => r.zone))].sort(), [])

  const totalInvestment = useMemo(() => hafniumRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])
  const avgTemp = useMemo(() => Math.round(hafniumRecords.reduce((s: number, r) => s + r.maxTempCelsius, 0) / hafniumRecords.length), [])
  const deliveredCount = useMemo(() => hafniumRecords.filter(r => r.status === 'Delivered').length, [])
  const delayedCount = useMemo(() => hafniumRecords.filter(r => r.status === 'Delayed').length, [])

  const cityInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of hafniumRecords) { map[r.city] = (map[r.city] || 0) + r.investmentCr }
    return map
  }, [])

  const alloyTempMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of hafniumRecords) { map[r.alloyGrade] = (map[r.alloyGrade] || 0) + r.maxTempCelsius }
    return map
  }, [])

  const statusCountMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of hafniumRecords) { map[r.status] = (map[r.status] || 0) + 1 }
    return map
  }, [])

  const zoneInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of hafniumRecords) { map[r.zone] = (map[r.zone] || 0) + r.investmentCr }
    return map
  }, [])

  const maxCity = useMemo(() => {
    const entries = (Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [cityInvestmentMap])

  const maxTempGrade = useMemo(() => {
    const entries = (Object.entries(alloyTempMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [alloyTempMap])

  return (
    <div className="space-y-6">
      <PageHeader title="Hafnium Alloy Logistics" description="Strategic hafnium alloy supply chain tracking for nuclear reactors, space vehicles, hypersonic systems and semiconductor fabrication" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-emerald-500 bg-emerald-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Total Investment</div><div className="text-2xl font-bold text-emerald-700">&#8377;{totalInvestment.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across {hafniumRecords.length} batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-emerald-500 bg-emerald-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Avg Max Temperature</div><div className="text-2xl font-bold text-emerald-700">{avgTemp.toLocaleString()}&#176;C</div><div className="text-xs text-muted-foreground mt-1">Across all alloy grades</div></CardContent></Card>
        <Card className="border-l-4 border-l-emerald-500 bg-emerald-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Delivered</div><div className="text-2xl font-bold text-emerald-700">{deliveredCount}</div><div className="text-xs text-muted-foreground mt-1">{delayedCount} delayed</div></CardContent></Card>
        <Card className="border-l-4 border-l-emerald-500 bg-emerald-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Top City</div><div className="text-2xl font-bold text-emerald-700">{maxCity[0]}</div><div className="text-xs text-muted-foreground mt-1">&#8377;{maxCity[1].toLocaleString()} Cr invested</div></CardContent></Card>
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
          <button key={tab} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-emerald-500 text-emerald-700' : 'text-muted-foreground'}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by City</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([city, val]) => (<div key={city} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{city}</span><div className="flex-1 bg-emerald-100 rounded-full h-3"><div className="bg-emerald-500 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Temperature Rating by Alloy Grade</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(alloyTempMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([grade, temp]) => (<div key={grade} className="flex items-center gap-2"><span className="text-xs w-32 truncate">{grade}</span><div className="flex-1 bg-orange-100 rounded-full h-3"><div className="bg-orange-500 h-3 rounded-full" style={{ width: `${(temp / maxTempGrade[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{temp}&#176;C</span></div>))}</CardContent></Card>
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
              <thead><tr className="border-b"><th className="text-left p-2">Batch</th><th className="text-left p-2">City</th><th className="text-left p-2">Manufacturer</th><th className="text-left p-2">Alloy Grade</th><th className="text-left p-2">Application</th><th className="text-left p-2">Hf%</th><th className="text-left p-2">Max Temp</th><th className="text-left p-2">&#8377;Cr</th><th className="text-left p-2">Status</th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className={`border-b ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                    <td className="p-2 font-mono text-xs">{r.batchNo}</td>
                    <td className="p-2">{r.city}</td>
                    <td className="p-2">{r.manufacturer}</td>
                    <td className="p-2">{r.alloyGrade}</td>
                    <td className="p-2 max-w-[200px] truncate">{r.application}</td>
                    <td className="p-2">{r.hafniumPercent}%</td>
                    <td className="p-2">{r.maxTempCelsius}&#176;C</td>
                    <td className="p-2 font-medium">&#8377;{r.investmentCr}</td>
                    <td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : r.status === 'Delayed' ? 'destructive' : 'secondary'}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-sm">Hafnium % by Alloy Grade</CardTitle></CardHeader><CardContent className="space-y-2">{hafniumRecords.slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-32 truncate">{r.alloyGrade}</span><div className="flex-1 bg-cyan-100 rounded-full h-3"><div className="bg-cyan-500 h-3 rounded-full" style={{ width: `${r.hafniumPercent}%` }}></div></div><span className="text-xs font-medium w-12 text-right">{r.hafniumPercent}%</span></div>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(zoneInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-violet-100 rounded-full h-3"><div className="bg-violet-500 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(statusCountMap) as [string, number][]).map(([status, count]) => (<div key={status} className="flex items-center gap-2"><span className="text-xs w-24">{status}</span><div className="flex-1 bg-gray-100 rounded-full h-3"><div className="bg-emerald-500 h-3 rounded-full" style={{ width: `${(count / hafniumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of hafniumRecords) { map[r.priority] = (map[r.priority] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([pri, count]) => (<div key={pri} className="flex items-center gap-2"><span className="text-xs w-20">{pri}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-500 h-3 rounded-full" style={{ width: `${(count / hafniumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipment Volume by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of hafniumRecords) { map[r.zone] = (map[r.zone] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([zone, count]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-blue-100 rounded-full h-3"><div className="bg-blue-500 h-3 rounded-full" style={{ width: `${(count / hafniumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Temperature Range Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const ranges: Record<string, number> = { '400-800&#176;C': 0, '800-1200&#176;C': 0, '1200-1600&#176;C': 0, '1600-2500&#176;C': 0 }; for (const r of hafniumRecords) { if (r.maxTempCelsius >= 1600) ranges['1600-2500&#176;C']++; else if (r.maxTempCelsius >= 1200) ranges['1200-1600&#176;C']++; else if (r.maxTempCelsius >= 800) ranges['800-1200&#176;C']++; else ranges['400-800&#176;C']++ } return (Object.entries(ranges) as [string, number][]).map(([range, count]) => (<div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 bg-red-100 rounded-full h-3"><div className="bg-red-500 h-3 rounded-full" style={{ width: `${(count / hafniumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm">Strategic Hafnium Sourcing</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India imports 95% of nuclear-grade hafnium from France (Areva) and Russia (TVEL). The DAE&amp;NPCIL hafnium strategic reserve programme targets 200 tonnes stockpile by 2028. NALCO Angul is developing zirconium-hafnium separation technology leveraging existing zircon processing capability, potentially reducing import dependency to 60% by 2030. Hafnium demand is projected to grow 18% annually driven by nuclear power expansion (10 reactors under construction) and semiconductor fab investments (&#8377;76,000Cr semiconductor mission).</p></CardContent></Card>
          <Card className="border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm">Hypersonic Material Challenge</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Hf-Ta-C and HfB2 ultra-high temperature ceramics represent India&apos;s most critical hypersonic material gap. DRDO HSTDV achieved Mach 6.5 in 2020 but sustained Mach 8+ flight (BrahMos II target) requires HfC-TaC composites with melting points above 3900&#176;C. DRDO DMRL Hyderabad is establishing a dedicated Hf-UHTC pilot plant costing &#8377;850Cr, expected operational by 2028. Current HAF-B2404 batch delayed 10 days due to hafnium sponge import quarantine from Kazakhstan.</p></CardContent></Card>
          <Card className="border-l-4 border-l-blue-500"><CardHeader><CardTitle className="text-sm">Semiconductor Hafnium Opportunity</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Tata Electronics Hosur fab and SCL Mohali are the primary consumers of semiconductor-grade HfO2 and HfN targets. India&apos;s &#8377;76,000Cr semiconductor mission includes dedicated hafnium precursor and ALD target production at Gujarat Fluorochemicals Gandhinagar. Current domestic production meets only 8% of demand. HfO2 high-K dielectrics (K=25) are mandatory for sub-45nm nodes. GFCL&apos;s HAF-B2413 batch of 150 sputtering targets worth &#8377;178Cr represents the largest single domestic HfN target order.</p></CardContent></Card>
          <Card className="border-l-4 border-l-rose-500"><CardHeader><CardTitle className="text-sm">Space &amp; Nuclear Convergence</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Hafnium uniquely serves both space vehicle thermal protection (Gaganyaan HfB2 heat shield, PSLV Hf-Nb-Zr nozzle) and nuclear reactor control systems (PFBR Hf-2.5Nb control blades). This dual-use creates supply chain complexity as nuclear-grade purity (Zr &lt; 3%) differs from aerospace-grade requirements (Nb-Ta alloying). India&apos;s combined space and nuclear hafnium demand is 62 tonnes/year, projected to reach 110 tonnes by 2030. MIDHANI and IGCAR joint development programme targeting integrated Hf alloy production facility at Visakhapatnam by 2029.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
