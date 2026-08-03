'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Sun } from 'lucide-react'

interface SiliconMetalRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  gradeType: string
  application: string
  siliconPercent: number
  purityPercent: number
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

const siliconRecords: SiliconMetalRecord[] = [
  { id: 'SIM-0001', batchNo: 'SIM-B2401', city: 'Bengaluru', manufacturer: 'Wacker Chemie India', gradeType: 'Polysilicon 9N (Semiconductor)', application: 'Solar Cell Wafer (Tata Power Solar)', siliconPercent: 99.9999999, purityPercent: 99.9999999, investmentCr: 425, status: 'Delivered', priority: 'Critical', origin: 'Wacker Noida (UP)', destination: 'Tata Power Solar Bengaluru (KA)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: '9N polysilicon for monocrystalline solar PV wafer ingot pulling &#8594; 99.9999999% Si purity semiconductor grade &#8594; &#8377;425Cr for 200 tonnes 9N polysilicon &#8594; India 12 GW solar cell 9N Si demand 3,600 tonnes/year &#8594; Czochralski process 300mm ingot 200kg &#8594; India importing 95% polysilicon from China and Germany &#8594; &#8377;32,000Cr Indian solar Si demand' },
  { id: 'SIM-0002', batchNo: 'SIM-B2402', city: 'Hyderabad', manufacturer: 'Hindalco Novelis', gradeType: 'MG-Si 98.5% (Metallurgical)', application: 'Aluminium Alloying (Hindalco Rourkela)', siliconPercent: 98.5, purityPercent: 98.5, investmentCr: 65, status: 'In Transit', priority: 'High', origin: 'RSMS Jaipur (RJ)', destination: 'Hindalco Rourkela (OD)', shipDate: '2026-07-22', transitDays: 3, zone: 'South', remarks: '98.5% metallurgical grade silicon for aluminium alloy 3003/3004 &#8594; 98.5% Si content for Al-Si master alloy &#8594; &#8377;65Cr for 120 tonnes MG-Si &#8594; Hindalco 2.1 MT aluminium using 0.3% Si &#8594; MG-Si consumption 8 kg/t aluminium &#8594; India 4.1 MT aluminium MG-Si demand 33,000 tonnes &#8594; &#8377;5,000Cr Indian Al-Si demand' },
  { id: 'SIM-0003', batchNo: 'SIM-B2403', city: 'Mumbai', manufacturer: 'Tata Steel', gradeType: 'FeSi 75% (Ferrosilicon)', application: 'BOF Steelmaking (Tata Steel Jamshedpur)', siliconPercent: 75, purityPercent: 95, investmentCr: 42, status: 'Delivered', priority: 'High', origin: 'IMFA Choudwar (OD)', destination: 'Tata Steel Jamshedpur (JH)', shipDate: '2026-07-19', transitDays: 4, zone: 'West', remarks: '75% FeSi ferrosilicon for BOF hot metal deoxidation &#8594; 75% Si in Fe-Si alloy &#8594; &#8377;42Cr for 180 tonnes FeSi 75 &#8594; Tata Steel 15 MT crude steel &#8594; FeSi consumption 4 kg/t crude steel &#8594; India 300 MT crude steel FeSi demand 1.2 MT &#8594; &#8377;3,500Cr Indian steel FeSi demand' },
  { id: 'SIM-0004', batchNo: 'SIM-B2404', city: 'Pune', manufacturer: 'Bharat Forge Ltd', gradeType: 'FeSi 45% (Inoculant)', application: 'Ductile Iron Casting (Bharat Forge)', siliconPercent: 45, purityPercent: 92, investmentCr: 18, status: 'Delayed', priority: 'Medium', origin: 'IMFA Choudwar (OD)', destination: 'Bharat Forge Pune (MH)', shipDate: '2026-07-12', transitDays: 4, zone: 'West', remarks: '45% FeSi inoculant for ductile iron graphite spheroidizing &#8594; 45% Si for Mg-treated ductile iron &#8594; &#8377;18Cr for 25 tonnes FeSi 45 &#8594; Bharat Forge 300,000 forgings requiring 5,000 tonnes ductile iron &#8594; FeSi inoculant addition 0.5% for nodule count &#8594; Delayed 10 days due to quartzite allocation delay &#8594; &#8377;1,500Cr Indian foundry FeSi demand' },
  { id: 'SIM-0005', batchNo: 'SIM-B2405', city: 'Chennai', manufacturer: 'Vedanta Ltd', gradeType: 'Silicon Metal 99% (Solar Grade)', application: 'Silicone Polymer (Dow Chennai)', siliconPercent: 99, purityPercent: 99, investmentCr: 145, status: 'Processing', priority: 'High', origin: 'RSMS Jaipur (RJ)', destination: 'Dow Chemical Chennai (TN)', shipDate: '2026-07-25', transitDays: 3, zone: 'South', remarks: '99% silicon metal for silicone polymer (PDMS) synthesis &#8594; 99% Si Rochow process feedstock &#8594; &#8377;145Cr for 85 tonnes 99% Si metal &#8594; Dow Chennai 200 KTPY silicone production &#8594; Si metal to silicone conversion yield 85% &#8594; India silicone market &#8377;12,000Cr growing 12% &#8594; &#8377;11,500Cr Indian silicone Si demand' },
  { id: 'SIM-0006', batchNo: 'SIM-B2406', city: 'Noida', manufacturer: 'HAL', gradeType: 'SiC Powder (Reaction Bonded)', application: 'Ceramic Armour Plate (DRDO CMET)', siliconPercent: 63, purityPercent: 97, investmentCr: 195, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TS)', destination: 'DRDO Pune (MH)', shipDate: '2026-07-17', transitDays: 3, zone: 'North', remarks: 'Reaction-bonded SiC ceramic for body armour plate insert &#8594; 63% Si in RBSC matrix &#8594; &#8377;195Cr for 12 tonnes RBSC plate blanks &#8594; DRDO CMET supplying 50,000 BIS plates for CRPF &#8594; RBSC NIJ Level IV stops 7.62mm AP &#8594; India 3.5 million body armour plates by 2030 &#8594; &#8377;15,000Cr Indian armour SiC demand' },
  { id: 'SIM-0007', batchNo: 'SIM-B2407', city: 'Kolkata', manufacturer: 'Dalmia Cement', gradeType: 'Silica Fume (Microsilica)', application: 'HPC Concrete (Larsen Toubro)', siliconPercent: 92, purityPercent: 85, investmentCr: 8, status: 'In Transit', priority: 'Medium', origin: 'Dalmia Kolkata (WB)', destination: 'L&amp;T Mumbai (MH)', shipDate: '2026-07-21', transitDays: 1, zone: 'East', remarks: '92% SiO2 silica fume for ultra-high-performance concrete &#8594; 92% amorphous SiO2 pozzolan &#8594; &#8377;8Cr for 800 tonnes silica fume &#8594; L&amp;T Metro tunnels requiring M80 UHPC &#8594; Silica fume 8% replacement for 100 MPa strength &#8594; India metro tunnel 800 km by 2030 &#8594; &#8377;650Cr Indian concrete silica demand' },
  { id: 'SIM-0008', batchNo: 'SIM-B2408', city: 'Ahmedabad', manufacturer: 'Gujarat Fluorochemicals Ltd', gradeType: 'Fumed Silica (Nano SiO2)', application: 'Rubber Reinforcement (CEAT Ahmedabad)', siliconPercent: 99.8, purityPercent: 99.8, investmentCr: 12, status: 'Delivered', priority: 'Medium', origin: 'Cabot Gujarat (GJ)', destination: 'CEAT Ahmedabad (GJ)', shipDate: '2026-07-16', transitDays: 1, zone: 'West', remarks: 'Fumed silica 200 m2/g for tyre rubber reinforcement &#8594; 99.8% SiO2 nano-particle &#8594; &#8377;12Cr for 400 tonnes fumed silica &#8594; CEAT 1,50,000 tyres/day &#8594; Fumed silica reduces rolling resistance 15% &#8594; India 200 million tyres/year &#8594; &#8377;950Cr Indian tyre silica demand' },
  { id: 'SIM-0009', batchNo: 'SIM-B2409', city: 'Jaipur', manufacturer: 'Rajasthan State Mines', gradeType: 'Quartzite 99% (High Purity)', application: 'Glass Container (RSMS Jaipur)', siliconPercent: 99, purityPercent: 99, investmentCr: 25, status: 'Processing', priority: 'Low', origin: 'RSMS Jaipur (RJ)', destination: 'Hindustan Glass Mumbai (MH)', shipDate: '2026-07-24', transitDays: 3, zone: 'North', remarks: '99% SiO2 quartzite for soda-lime glass batch &#8594; 99% SiO2 high-purity quartz &#8594; &#8377;25Cr for 2,000 tonnes quartzite &#8594; India 12 MT glass container production &#8594; SiO2 72% of glass batch composition &#8594; India glass industry &#8377;65,000Cr &#8594; &#8377;2,000Cr Indian glass SiO2 demand' },
  { id: 'SIM-0010', batchNo: 'SIM-B2410', city: 'Coimbatore', manufacturer: 'IIT Madras', gradeType: 'Silicon Wafer 11N (Monocrystal)', application: 'MEMS Pressure Sensor (IIT Madras)', siliconPercent: 99.999999999, purityPercent: 99.999999999, investmentCr: 320, status: 'Delivered', priority: 'Critical', origin: 'Wacker Noida (UP)', destination: 'IIT Madras (TN)', shipDate: '2026-07-18', transitDays: 2, zone: 'South', remarks: '11N monocrystalline Si wafer for MEMS pressure sensor fabrication &#8594; 99.999999999% purity electronic grade &#8594; &#8377;320Cr for 50,000 200mm wafers &#8594; IIT Madras fab-less MEMS prototype &#8594; 200mm wafer 400 die/wafer &#8594; India semiconductor fab &#8377;76,000Cr PLI &#8594; &#8377;25,000Cr Indian semiconductor Si demand' },
  { id: 'SIM-0011', batchNo: 'SIM-B2411', city: 'Bhubaneswar', manufacturer: 'NALCO', gradeType: 'FeSiMg (Nodulizer)', application: 'Ductile Iron Pipe (NALCO Angul)', siliconPercent: 46, purityPercent: 90, investmentCr: 22, status: 'In Transit', priority: 'Medium', origin: 'IMFA Choudwar (OD)', destination: 'Jindal Saw Raipur (CG)', shipDate: '2026-07-23', transitDays: 2, zone: 'East', remarks: 'FeSiMg nodulizer for DI pipe spheroidal graphite &#8594; 46% Si 5% Mg 1% RE nodulizer &#8594; &#8377;22Cr for 35 tonnes FeSiMg &#8594; India 2 MT ductile iron pipe production &#8594; FeSiMg addition 1.5% for nodule count 150/mm2 &#8594; India Jal Jeevan Mission 100M pipe connections &#8594; &#8377;1,800Cr Indian pipe FeSiMg demand' },
  { id: 'SIM-0012', batchNo: 'SIM-B2412', city: 'Guwahati', manufacturer: 'Oil India Ltd', gradeType: 'Silica Gel (SiO2 Desiccant)', application: 'Gas Pipeline Drying (OIL Jorhat)', siliconPercent: 99.5, purityPercent: 99.5, investmentCr: 5, status: 'Delayed', priority: 'Low', origin: 'Sorbead India Mumbai (MH)', destination: 'OIL Jorhat (AS)', shipDate: '2026-07-11', transitDays: 4, zone: 'East', remarks: 'Silica gel desiccant for natural gas pipeline dehydration &#8594; 99.5% SiO2 indicating gel &#8594; &#8377;5Cr for 60 tonnes silica gel &#8594; OIL 800km gas pipeline network &#8594; Silica gel dew point to -40&#176;C &#8594; Delayed 12 days due to monsoon &#8594; &#8377;420Cr Indian gas dehydration demand' },
  { id: 'SIM-0013', batchNo: 'SIM-B2413', city: 'Gandhinagar', manufacturer: 'Adani Defence', gradeType: 'SiAION (Si3N4-Al2O3)', application: 'Radar Dome Radome (Adani Defence)', siliconPercent: 36, purityPercent: 95, investmentCr: 165, status: 'Processing', priority: 'Critical', origin: 'MIDHANI Hyderabad (TS)', destination: 'Adani Defence Gandhinagar (GJ)', shipDate: '2026-07-26', transitDays: 2, zone: 'West', remarks: 'SiAlON ceramic for radar dome radome application &#8594; 36% Si in SiAlON (Si3N4-AlON) &#8594; &#8377;165Cr for 6 tonnes SiAlON radome blanks &#8594; Adani Defence Astra Mk3 seeker radome &#8594; SiAlON dielectric constant 7.5 at 10 GHz &#8594; India missile radome programme &#8377;12,000Cr &#8594; &#8377;13,000Cr Indian defence SiAlON demand' },
  { id: 'SIM-0014', batchNo: 'SIM-B2414', city: 'Lucknow', manufacturer: 'TASL', gradeType: 'Polysilicon 11N (Electronic)', application: 'CMOS Logic Fab (TASL-ISRO)', siliconPercent: 99.999999999, purityPercent: 99.999999999, investmentCr: 480, status: 'Delivered', priority: 'Critical', origin: 'Wacker Noida (UP)', destination: 'SCL Mohali (PB)', shipDate: '2026-07-23', transitDays: 2, zone: 'North', remarks: '11N electronic grade polysilicon for CMOS logic wafer fab &#8594; 99.999999999% Si for 28nm node &#8594; &#8377;480Cr for 150 tonnes 11N polysilicon &#8594; SCL Mohali semiconductor fab 40,000 wafers/month &#8594; Siemens 28nm CMOS technology transfer &#8594; India fab PLI &#8377;76,000Cr &#8594; &#8377;38,000Cr Indian electronic Si demand' },
]

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const
type TabType = typeof tabs[number]

export default function SiliconMetalLogisticsView() {
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
    return siliconRecords.filter(r => {
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

  const uniqueCities = useMemo(() => [...new Set(siliconRecords.map(r => r.city))].sort(), [])
  const uniqueManufacturers = useMemo(() => [...new Set(siliconRecords.map(r => r.manufacturer))].sort(), [])
  const uniqueStatuses = useMemo(() => [...new Set(siliconRecords.map(r => r.status))].sort(), [])
  const uniqueZones = useMemo(() => [...new Set(siliconRecords.map(r => r.zone))].sort(), [])

  const totalInvestment = useMemo(() => siliconRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])
  const industrialRecords = useMemo(() => siliconRecords.filter(r => r.purityPercent < 100), [])
  const avgPurity = useMemo(() => {
    return industrialRecords.length > 0 ? Math.round(industrialRecords.reduce((s: number, r) => s + r.purityPercent, 0) / industrialRecords.length) : 99
  }, [])
  const deliveredCount = useMemo(() => siliconRecords.filter(r => r.status === 'Delivered').length, [])
  const delayedCount = useMemo(() => siliconRecords.filter(r => r.status === 'Delayed').length, [])

  const cityInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of siliconRecords) { map[r.city] = (map[r.city] || 0) + r.investmentCr }
    return map
  }, [])

  const gradeSiMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of siliconRecords) { map[r.gradeType] = (map[r.gradeType] || 0) + r.siliconPercent }
    return map
  }, [])

  const statusCountMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of siliconRecords) { map[r.status] = (map[r.status] || 0) + 1 }
    return map
  }, [])

  const zoneInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of siliconRecords) { map[r.zone] = (map[r.zone] || 0) + r.investmentCr }
    return map
  }, [])

  const maxCity = useMemo(() => {
    const entries = (Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [cityInvestmentMap])

  const maxSiGrade = useMemo(() => {
    const entries = (Object.entries(gradeSiMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [gradeSiMap])

  return (
    <div className="space-y-6">
      <PageHeader title="Silicon Metal Logistics" description="Silicon metal, polysilicon, ferrosilicon and silica material supply chain for solar PV, semiconductors, aluminium alloying, steelmaking, silicone polymers and ceramic armour" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-amber-600 bg-amber-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Total Investment</div><div className="text-2xl font-bold text-amber-800">&#8377;{totalInvestment.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across {siliconRecords.length} batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-amber-600 bg-amber-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Avg Purity (Industrial)</div><div className="text-2xl font-bold text-amber-800">{avgPurity}%</div><div className="text-xs text-muted-foreground mt-1">Excluding electronic grade</div></CardContent></Card>
        <Card className="border-l-4 border-l-amber-600 bg-amber-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Delivered</div><div className="text-2xl font-bold text-amber-800">{deliveredCount}</div><div className="text-xs text-muted-foreground mt-1">{delayedCount} delayed</div></CardContent></Card>
        <Card className="border-l-4 border-l-amber-600 bg-amber-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Top City</div><div className="text-2xl font-bold text-amber-800">{maxCity[0]}</div><div className="text-xs text-muted-foreground mt-1">&#8377;{maxCity[1].toLocaleString()} Cr invested</div></CardContent></Card>
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
          <button key={tab} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-amber-600 text-amber-800' : 'text-muted-foreground'}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by City</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([city, val]) => (<div key={city} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{city}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Si Content by Grade</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(gradeSiMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([grade, si]) => (<div key={grade} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{grade}</span><div className="flex-1 bg-yellow-100 rounded-full h-3"><div className="bg-yellow-600 h-3 rounded-full" style={{ width: `${Math.min((si / maxSiGrade[1]) * 100, 100)}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{si}%</span></div>))}</CardContent></Card>
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
              <thead><tr className="border-b"><th className="text-left p-2">Batch</th><th className="text-left p-2">City</th><th className="text-left p-2">Manufacturer</th><th className="text-left p-2">Grade</th><th className="text-left p-2">Application</th><th className="text-left p-2">Si%</th><th className="text-left p-2">Purity</th><th className="text-left p-2">&#8377;Cr</th><th className="text-left p-2">Status</th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className={`border-b ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                    <td className="p-2 font-mono text-xs">{r.batchNo}</td>
                    <td className="p-2">{r.city}</td>
                    <td className="p-2">{r.manufacturer}</td>
                    <td className="p-2">{r.gradeType}</td>
                    <td className="p-2 max-w-[200px] truncate">{r.application}</td>
                    <td className="p-2">{r.siliconPercent >= 99.99 ? '9N+' : r.siliconPercent + '%'}</td>
                    <td className="p-2">{r.purityPercent >= 99.99 ? 'Ultra' : r.purityPercent + '%'}</td>
                    <td className="p-2 font-medium">&#8377;{r.investmentCr}</td>
                    <td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : r.status === 'Delayed' ? 'destructive' : 'secondary'}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-sm">Purity by Grade</CardTitle></CardHeader><CardContent className="space-y-2">{industrialRecords.slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{r.gradeType}</span><div className="flex-1 bg-orange-100 rounded-full h-3"><div className="bg-orange-500 h-3 rounded-full" style={{ width: `${(r.purityPercent / 99.8) * 100}%` }}></div></div><span className="text-xs font-medium w-14 text-right">{r.purityPercent}%</span></div>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(zoneInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-yellow-100 rounded-full h-3"><div className="bg-yellow-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(statusCountMap) as [string, number][]).map(([status, count]) => (<div key={status} className="flex items-center gap-2"><span className="text-xs w-24">{status}</span><div className="flex-1 bg-gray-100 rounded-full h-3"><div className="bg-amber-600 h-3 rounded-full" style={{ width: `${(count / siliconRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of siliconRecords) { map[r.priority] = (map[r.priority] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([pri, count]) => (<div key={pri} className="flex items-center gap-2"><span className="text-xs w-20">{pri}</span><div className="flex-1 bg-red-100 rounded-full h-3"><div className="bg-red-500 h-3 rounded-full" style={{ width: `${(count / siliconRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipment Volume by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of siliconRecords) { map[r.zone] = (map[r.zone] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([zone, count]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-teal-100 rounded-full h-3"><div className="bg-teal-500 h-3 rounded-full" style={{ width: `${(count / siliconRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Si Grade Category Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const ranges: Record<string, number> = { 'Electronic Grade (9N+)': 0, 'Solar Grade (6N-9N)': 0, 'Industrial 99%': 0, 'Ferro/Alloy Si': 0, 'Silica/SiO2': 0 }; for (const r of siliconRecords) { if (r.siliconPercent >= 99.99999) ranges['Electronic Grade (9N+)']++; else if (r.siliconPercent >= 99.999) ranges['Solar Grade (6N-9N)']++; else if (r.siliconPercent >= 99) ranges['Industrial 99%']++; else if (r.siliconPercent >= 36) ranges['Ferro/Alloy Si']++; else ranges['Silica/SiO2']++ } return (Object.entries(ranges) as [string, number][]).map(([range, count]) => (<div key={range} className="flex items-center gap-2"><span className="text-xs w-32">{range}</span><div className="flex-1 bg-indigo-100 rounded-full h-3"><div className="bg-indigo-500 h-3 rounded-full" style={{ width: `${(count / siliconRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-amber-600"><CardHeader><CardTitle className="text-sm">Polysilicon: India 95% Import Dependent</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India&apos;s 12 GW solar PV cell manufacturing capacity requires 3,600 tonnes of 9N (99.9999999%) polysilicon annually, with 95% imported from China (Tongwei, GCL, Daqo) and Germany (Wacker Chemie). India&apos;s only polysilicon effort is a 500 TPD pilot plant by Rajasthan State Mines under the PLI scheme for semiconductors and solar. The polysilicon chain (quartzite &#8594; metallurgical Si &#8594; trichlorosilane &#8594; Siemens deposition) requires 100 kWh/kg at $15/kg production cost vs China $8/kg. India&apos;s semiconductor fab programme (SCL Mohali, Tata Electronics Assam) will need additional 600 tonnes of 11N polysilicon by 2028, driving total polysilicon demand to &#8377;70,000Cr and making domestic production a strategic imperative.</p></CardContent></Card>
          <Card className="border-l-4 border-l-orange-500"><CardHeader><CardTitle className="text-sm">MG-Si and FeSi: Backbone of Steel and Aluminium</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Metallurgical grade silicon (MG-Si 98.5%) and ferrosilicon (FeSi 75% and 45%) are the workhorse silicon alloys for India&apos;s steel and aluminium industries. India produces 1.2 million tonnes of FeSi annually (world&apos;s 2nd largest), with Indian Metals and Ferro Alloys (IMFA), NALCO and JSWL operating 18 submerged arc furnaces across Odisha and Chhattisgarh. FeSi 75% consumes 4 kg/t in BOF steelmaking (300 MT), while FeSi 45% serves as ductile iron inoculant for India&apos;s 2 MT pipe casting industry. MG-Si 98.5% at 33,000 tonnes/year goes to aluminium alloying (0.3% Si in 3003/3004 can sheet). India&apos;s combined FeSi/MG-Si demand is valued at &#8377;10,000Cr, growing at 6% annually with infrastructure construction.</p></CardContent></Card>
          <Card className="border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm">Silicone Polymer: India Fastest Growing Si Consumer</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India&apos;s silicone polymer market at &#8377;12,000Cr is growing at 12% annually, driven by construction sealants, automotive coolants, medical devices and personal care products. The Rochow process converts 99% silicon metal with methanol to produce dimethyl dichlorosilane, the precursor for polydimethylsiloxane (PDMS) silicone fluids, gels and elastomers. Dow Chennai, Wacker Noida and Momentive Gujarat operate 5 silicone synthesis plants with 200 KTPY combined capacity. India imports 60% of its silicon metal feedstock, with RSMS Jaipur and NALCO&apos;s Si metal expansion to 100 KTPY by 2028 partially addressing the gap. India&apos;s silicone-to-silicon consumption ratio of 8:1 makes it the most value-added silicon user per tonne.</p></CardContent></Card>
          <Card className="border-l-4 border-l-blue-500"><CardHeader><CardTitle className="text-sm">SiC Ceramic Armour: DRDO Protection Technology</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Silicon carbide ceramic armour (reaction-bonded SiC with 63% Si matrix) represents India&apos;s frontline protection technology for CRPF and Indian Army body armour plates. DRDO CMET Pune has developed RBSC ceramic inserts achieving NIJ Level IV protection (stops 7.62mm AP at 2,750 fps), weighing only 2.8 kg per plate vs 6.5 kg for equivalent steel plates. The SiC ceramic shatters incoming projectiles through hard-face defeat, backed by UHMWPE fibre catch layers. India&apos;s 3.5 million body armour plate target by 2030 requires 10,000 tonnes of SiC ceramic, with MIDHANI and DRDO scaling RBSC production to 5 KTPY. Combined with SiAlON radar domes (36% Si) for missile seekers, India&apos;s defence silicon ceramics programme is valued at &#8377;28,000Cr.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
