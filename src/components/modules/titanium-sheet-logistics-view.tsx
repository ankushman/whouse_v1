'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Hammer } from 'lucide-react'

interface TitaniumSheetRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  sheetType: string
  application: string
  titaniumPercent: number
  thicknessMm: number
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

const titaniumSheetRecords: TitaniumSheetRecord[] = [
  { id: 'TSA-0001', batchNo: 'TSA-B2401', city: 'Mumbai', manufacturer: 'MIDHANI', sheetType: 'Ti-6Al-4V Plate 12mm', application: 'Aircraft Frame (HAL)', titaniumPercent: 90, thicknessMm: 12, investmentCr: 285, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-18', transitDays: 2, zone: 'West', remarks: 'Ti-6Al-4V Grade 5 plate for HAL Tejas Mk-1A wing spar &#8594; 90% Ti 6Al 4V &#8594; &#8377;285Cr for 5 tonnes 12mm plate &#8594; &#8377;15,000Cr India aero Ti &#8594; Tejas Mk-1A 40 aircraft &#8594; UTS 950 MPa &#8594; Specific strength 220 kNm/kg &#8594; Replacing Al 7075-T6 saves 30% weight' },
  { id: 'TSA-0002', batchNo: 'TSA-B2402', city: 'Hyderabad', manufacturer: 'DRDO DMRL', sheetType: 'Ti-15V-3Cr-3Al-3Sn Sheet 1.5mm', application: 'Missile Airframe (DRDO)', titaniumPercent: 76, thicknessMm: 1.5, investmentCr: 340, status: 'Delivered', priority: 'Critical', origin: 'DMRL Hyderabad (TG)', destination: 'DRDO Hyderabad (TG)', shipDate: '2026-07-20', transitDays: 0, zone: 'South', remarks: 'Ti-15-3-3-3 beta alloy sheet for DRDO Nirbhay cruise missile wing &#8594; 76% Ti &#8594; &#8377;340Cr for 2 tonnes 1.5mm sheet &#8594; India &#8377;5,500Cr missile Ti sheet &#8594; Nirbhay 1,000 km range &#8594; Superplastic forming 900&#176;C &#8594; Room temp formability vs alpha-beta grade' },
  { id: 'TSA-0003', batchNo: 'TSA-B2403', city: 'Bengaluru', manufacturer: 'Bharat Electronics', sheetType: 'Cp-Ti Grade 2 Foil 0.1mm', application: 'Chemical Filter (BEL)', titaniumPercent: 99.2, thicknessMm: 0.1, investmentCr: 18, status: 'Delivered', priority: 'Medium', origin: 'BEL Bengaluru (KA)', destination: 'BEL Panchkula (HR)', shipDate: '2026-07-15', transitDays: 3, zone: 'South', remarks: 'Commercially pure Ti Grade 2 foil for BEL chemical warfare filter mesh &#8594; 99.2% Ti &#8594; &#8377;18Cr for 100 kg 0.1mm foil &#8594; India &#8377;800Cr Ti foil &#8594; BEL 50,000 filters/year &#8594; Corrosion resistance in HCl/H2SO4 &#8594; Pore size 0.5um uniform' },
  { id: 'TSA-0004', batchNo: 'TSA-B2404', city: 'Pune', manufacturer: 'Bharat Forge', sheetType: 'Ti-6Al-4V ELI Plate 25mm', application: 'Armour Panel (OFB)', titaniumPercent: 90, thicknessMm: 25, investmentCr: 165, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'OFB Kanpur (UP)', shipDate: '2026-07-22', transitDays: 2, zone: 'West', remarks: 'Ti-6Al-4V ELI extra-low interstitial plate for OFB Bhim infantry fighting vehicle armour &#8594; 90% Ti &#8594; &#8377;165Cr for 3 tonnes 25mm plate &#8594; India &#8377;3,800Cr defence Ti armour &#8594; OFB 1,500 BMP-II &#8594; V50 ballistic 600 m/s &#8594; 40% lighter than RHA steel' },
  { id: 'TSA-0005', batchNo: 'TSA-B2405', city: 'Chennai', manufacturer: 'IGCAR Kalpakkam', sheetType: 'Ti-5Al-2.5Sn Grade 6 Sheet 3mm', application: 'Desalination (NPCIL)', titaniumPercent: 92.5, thicknessMm: 3, investmentCr: 210, status: 'Delivered', priority: 'High', origin: 'MIDHANI Hyderabad (TG)', destination: 'Nikkiso Chennai (TN)', shipDate: '2026-07-19', transitDays: 1, zone: 'South', remarks: 'Ti-5Al-2.5Sn alpha alloy sheet for NPCIL Kudankulam desalination plant heat exchanger &#8594; 92.5% Ti &#8594; &#8377;210Cr for 8 tonnes 3mm sheet &#8594; India &#8377;4,200Cr desal Ti &#8594; Kudankulam 2x8,000 m3/day &#8594; Sea water corrosion &lt;0.01 mm/year &#8594; 40 year plant life' },
  { id: 'TSA-0006', batchNo: 'TSA-B2406', city: 'Noida', manufacturer: 'Hindustan Aeronautics', sheetType: 'Ti-3Al-2.5V Tube 1mm wall', application: 'Hydraulic Line (HAL)', titaniumPercent: 94.5, thicknessMm: 1, investmentCr: 95, status: 'Delivered', priority: 'High', origin: 'HAL Bengaluru (KA)', destination: 'HAL Nasik (MH)', shipDate: '2026-07-16', transitDays: 2, zone: 'North', remarks: 'Ti-3Al-2.5V seamless tube for HAL Su-30MKI flight control hydraulic line &#8594; 94.5% Ti &#8594; &#8377;95Cr for 600 kg tube &#8594; India &#8377;2,800Cr aero Ti tube &#8594; 220 Su-30MKI fleet &#8594; 210 bar hydraulic pressure &#8594; 50% lighter than SS321 tubing' },
  { id: 'TSA-0007', batchNo: 'TSA-B2407', city: 'Kolkata', manufacturer: 'SAIL Durgapur', sheetType: 'Cp-Ti Grade 1 Plate 6mm', application: 'Anode Basket (Hindalco)', titaniumPercent: 99.5, thicknessMm: 6, investmentCr: 52, status: 'Delivered', priority: 'Medium', origin: 'SAIL Durgapur (WB)', destination: 'Hindalco Renukoot (UP)', shipDate: '2026-07-21', transitDays: 1, zone: 'East', remarks: 'Commercially pure Ti Grade 1 plate for Hindalco copper electrowinning anode basket &#8594; 99.5% Ti &#8594; &#8377;52Cr for 2 tonnes 6mm &#8594; India &#8377;1,500Cr Ti anode &#8594; Hindalco 600 kta Cu &#8594; H2SO4 bath resistance &#8594; 10 year basket life' },
  { id: 'TSA-0008', batchNo: 'TSA-B2408', city: 'Ahmedabad', manufacturer: 'Gujarat Fluorochemicals', sheetType: 'Ti-6Al-7Nb Sheet 2mm', application: 'Bone Plate (Zimmer India)', titaniumPercent: 87, thicknessMm: 2, investmentCr: 72, status: 'Delivered', priority: 'High', origin: 'GFCL Vadodara (GJ)', destination: 'Zimmer Mumbai (MH)', shipDate: '2026-07-17', transitDays: 1, zone: 'West', remarks: 'Ti-6Al-7Nb (V-free) sheet for Zimmer India orthopaedic bone plate &#8594; 87% Ti 6Al 7Nb &#8594; &#8377;72Cr for 300 kg 2mm &#8594; India &#8377;2,200Cr medical Ti &#8594; Zimmer 25% India implant &#8594; Nb replaces V (V cytotoxicity concern) &#8594; ISO 5832-11 biocompatible' },
  { id: 'TSA-0009', batchNo: 'TSA-B2409', city: 'Jaipur', manufacturer: 'Rajasthan Titanium Industries', sheetType: 'Ti-6Al-4V Sheet 0.5mm', application: 'Solar Frame (Vikram Solar)', titaniumPercent: 90, thicknessMm: 0.5, investmentCr: 128, status: 'Delivered', priority: 'High', origin: 'RTI Jaipur (RJ)', destination: 'Vikram Solar Kolkata (WB)', shipDate: '2026-07-23', transitDays: 2, zone: 'North', remarks: 'Ti-6Al-4V thin sheet for Vikram Solar space-grade PV panel frame &#8594; 90% Ti &#8594; &#8377;128Cr for 1.5 tonnes 0.5mm &#8594; India &#8377;2,500Cr space solar Ti &#8594; ISRO 50 kW array &#8594; CTE match GaAs cell &#8594; 15 year LEO radiation stability' },
  { id: 'TSA-0010', batchNo: 'TSA-B2410', city: 'Coimbatore', manufacturer: 'Tamil Nadu Titanium Alloys', sheetType: 'Ti-13Cu Sheet 1mm', application: 'Marine Propeller (GRSE)', titaniumPercent: 88, thicknessMm: 1, investmentCr: 145, status: 'Delivered', priority: 'High', origin: 'TNTA Coimbatore (TN)', destination: 'GRSE Kolkata (WB)', shipDate: '2026-07-14', transitDays: 3, zone: 'South', remarks: 'Ti-13Cu copper-alloyed Ti sheet for GRSE naval frigate propeller blade &#8594; 88% Ti 13Cu &#8594; &#8377;145Cr for 2 tonnes &#8594; India &#8377;3,500Cr naval Ti &#8594; GRSE 20 warships &#8594; Cavitation erosion 50x bronze &#8594; 30 year propeller life' },
  { id: 'TSA-0011', batchNo: 'TSA-B2411', city: 'Bhubaneswar', manufacturer: 'Odisha Titanium Refinery', sheetType: 'Ti-6Al-2Mo-2Fe Sheet 4mm', application: 'Heat Shield (ISRO)', titaniumPercent: 86, thicknessMm: 4, investmentCr: 265, status: 'Delivered', priority: 'Critical', origin: 'OTR Bhubaneswar (OD)', destination: 'ISRO Sriharikota (AP)', shipDate: '2026-07-25', transitDays: 3, zone: 'East', remarks: 'Ti-6Al-2Mo-2Fe sheet for ISRO Gaganyaan crew module thermal shield &#8594; 86% Ti &#8594; &#8377;265Cr for 3 tonnes 4mm &#8594; India &#8377;5,800Cr space Ti &#8594; Gaganyaan 2027 crewed &#8594; Re-entry 1,650&#176;C peak &#8594; Ti-622 shields underlying ablative at 650&#176;C interface' },
  { id: 'TSA-0012', batchNo: 'TSA-B2412', city: 'Guwahati', manufacturer: 'Assam Titanium Works', sheetType: 'Cp-Ti Grade 3 Sheet 2mm', application: 'Pulp Bleach (JK Paper)', titaniumPercent: 99, thicknessMm: 2, investmentCr: 38, status: 'Delayed', priority: 'Medium', origin: 'ATW Guwahati (AS)', destination: 'JK Paper Rayagada (OD)', shipDate: '2026-07-24', transitDays: 13, zone: 'East', remarks: 'Cp-Ti Grade 3 sheet for JK Paper pulp bleaching washer drum &#8594; 99% Ti &#8594; &#8377;38Cr for 1.2 tonnes 2mm &#8594; 13d delay monsoon logistics &#8594; India &#8377;1,100Cr pulp Ti &#8594; ClO2/NaClO resistance &#8594; 25 year drum life &#8594; JK Paper 400 kta pulp' },
  { id: 'TSA-0013', batchNo: 'TSA-B2413', city: 'Gandhinagar', manufacturer: 'Gujarat Titanium Technologies', sheetType: 'Ti-8Al-1Mo-1V Sheet 3mm', application: 'Compressor Disc (BHEL)', titaniumPercent: 88, thicknessMm: 3, investmentCr: 185, status: 'Delivered', priority: 'Critical', origin: 'GTT Gandhinagar (GJ)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-26', transitDays: 2, zone: 'West', remarks: 'Ti-811 sheet for BHEL 800 MW steam turbine compressor disc &#8594; 88% Ti 8Al 1Mo 1V &#8594; &#8377;185Cr for 2.5 tonnes 3mm &#8594; India &#8377;4,000Cr power Ti &#8594; BHEL 200 GW installed &#8594; Creep strength 550&#176;C &#8594; 40% lighter than Ni superalloy disc' },
  { id: 'TSA-0014', batchNo: 'TSA-B2414', city: 'Lucknow', manufacturer: 'UP Titanium Alloys', sheetType: 'Ti-6Al-4V Sheet 1mm', application: 'Architectural Panel (L&amp;T)', titaniumPercent: 90, thicknessMm: 1, investmentCr: 92, status: 'Delivered', priority: 'Medium', origin: 'UTA Lucknow (UP)', destination: 'L&amp;T Mumbai (MH)', shipDate: '2026-07-27', transitDays: 3, zone: 'North', remarks: 'Ti-6Al-4V anodised sheet for L&amp;T Mumbai iconic tower facade panel &#8594; 90% Ti &#8594; &#8377;92Cr for 800 kg 1mm &#8594; India &#8377;1,800Cr arch Ti &#8594; L&amp;T 35% India high-rise &#8594; Anodised blue/gold finish &#8594; 60 year zero maintenance exterior' }
]

export default function TitaniumSheetLogisticsView() {
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
    return titaniumSheetRecords.filter(r => {
      const matchSearch = !searchQuery || Object.values(r).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))
      const matchFilters = Object.entries(filters).every(([key, values]) => values.includes(String(r[key as keyof TitaniumSheetRecord])))
      return matchSearch && matchFilters
    })
  }, [searchQuery, filters])

  const totalInvestment = useMemo(() => titaniumSheetRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])
  const avgTi = useMemo(() => (titaniumSheetRecords.reduce((s: number, r) => s + r.titaniumPercent, 0) / titaniumSheetRecords.length).toFixed(1), [])
  const deliveredCount = useMemo(() => titaniumSheetRecords.filter(r => r.status === 'Delivered').length, [])
  const delayedCount = useMemo(() => titaniumSheetRecords.filter(r => r.status === 'Delayed').length, [])

  const uniqueCities = useMemo(() => [...new Set(titaniumSheetRecords.map(r => r.city))], [])
  const uniqueStatuses = useMemo(() => [...new Set(titaniumSheetRecords.map(r => r.status))], [])
  const uniqueManufacturers = useMemo(() => [...new Set(titaniumSheetRecords.map(r => r.manufacturer))], [])

  const cityInvestmentMap = useMemo(() => { const map: Record<string, number> = {}; for (const r of titaniumSheetRecords) { map[r.city] = (map[r.city] || 0) + r.investmentCr } return map }, [])
  const sheetThicknessMap = useMemo(() => { const map: Record<string, number> = {}; for (const r of titaniumSheetRecords) { map[r.sheetType] = r.thicknessMm } return map }, [])
  const statusCountMap = useMemo(() => { const map: Record<string, number> = {}; for (const r of titaniumSheetRecords) { map[r.status] = (map[r.status] || 0) + 1 } return map }, [])
  const zoneInvestmentMap = useMemo(() => { const map: Record<string, number> = {}; for (const r of titaniumSheetRecords) { map[r.zone] = (map[r.zone] || 0) + r.investmentCr } return map }, [])

  const maxCity = useMemo(() => { const e = (Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]); return e[0] || ['N/A', 0] }, [cityInvestmentMap])
  const maxThick = useMemo(() => { const e = (Object.entries(sheetThicknessMap) as [string, number][]).sort((a, b) => b[1] - a[1]); return e[0] || ['N/A', 0] }, [sheetThicknessMap])

  const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights']

  return (
    <div className="space-y-6">
      <PageHeader title="Titanium Sheet Alloy Logistics" description="Titanium sheet, plate and foil supply chain for aircraft airframes, missile wings, naval propellers, nuclear desalination, hip implants, architectural panels and space heat shields across India" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-amber-600 bg-amber-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Total Investment</div><div className="text-2xl font-bold text-amber-800">&#8377;{totalInvestment.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across {titaniumSheetRecords.length} batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-amber-600 bg-amber-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Avg Ti Content</div><div className="text-2xl font-bold text-amber-800">{avgTi}%</div><div className="text-xs text-muted-foreground mt-1">Across all sheet types</div></CardContent></Card>
        <Card className="border-l-4 border-l-amber-600 bg-amber-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Delivered</div><div className="text-2xl font-bold text-amber-800">{deliveredCount}</div><div className="text-xs text-muted-foreground mt-1">{delayedCount} delayed</div></CardContent></Card>
        <Card className="border-l-4 border-l-amber-600 bg-amber-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Top City</div><div className="text-2xl font-bold text-amber-800">{maxCity[0]}</div><div className="text-xs text-muted-foreground mt-1">&#8377;{maxCity[1].toLocaleString()} Cr invested</div></CardContent></Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Input placeholder="Search records..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="max-w-xs" />
        {uniqueCities.map(city => (<Badge key={city} variant={filters.city?.includes(city) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('city', city)}>{city}</Badge>))}
        {uniqueStatuses.map(status => (<Badge key={status} variant={filters.status?.includes(status) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('status', status)}>{status}</Badge>))}
      </div>

      <div className="flex gap-2 border-b">
        {tabs.map(tab => (<button key={tab} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-amber-600 text-amber-800' : 'text-muted-foreground'}`} onClick={() => setActiveTab(tab)}>{tab}</button>))}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by City</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([city, val]) => (<div key={city} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{city}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Thickness by Sheet Type</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(sheetThicknessMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([sheet, thick]) => (<div key={sheet} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{sheet}</span><div className="flex-1 bg-yellow-100 rounded-full h-3"><div className="bg-yellow-600 h-3 rounded-full" style={{ width: `${(thick / maxThick[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{thick}mm</span></div>))}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Registry' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {uniqueManufacturers.map(mfg => (<Badge key={mfg} variant={filters.manufacturer?.includes(mfg) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('manufacturer', mfg)}>{mfg}</Badge>))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left p-2">Batch</th><th className="text-left p-2">City</th><th className="text-left p-2">Manufacturer</th><th className="text-left p-2">Sheet Type</th><th className="text-left p-2">Application</th><th className="text-left p-2">Ti%</th><th className="text-left p-2">mm</th><th className="text-left p-2">&#8377;Cr</th><th className="text-left p-2">Status</th></tr></thead>
              <tbody>
                {filtered.map(r => (<tr key={r.id} className={`border-b ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2 font-mono text-xs">{r.batchNo}</td><td className="p-2">{r.city}</td><td className="p-2">{r.manufacturer}</td><td className="p-2">{r.sheetType}</td><td className="p-2 max-w-[200px] truncate">{r.application}</td><td className="p-2">{r.titaniumPercent}%</td><td className="p-2">{r.thicknessMm}mm</td><td className="p-2 font-medium">&#8377;{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : r.status === 'Delayed' ? 'destructive' : 'secondary'}>{r.status}</Badge></td></tr>))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-sm">Ti Content by Sheet Type</CardTitle></CardHeader><CardContent className="space-y-2">{titaniumSheetRecords.slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{r.sheetType}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-600 h-3 rounded-full" style={{ width: `${Math.min((r.titaniumPercent / 100) * 100, 100)}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{r.titaniumPercent}%</span></div>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(zoneInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-yellow-100 rounded-full h-3"><div className="bg-yellow-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(statusCountMap) as [string, number][]).map(([status, count]) => (<div key={status} className="flex items-center gap-2"><span className="text-xs w-24">{status}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-600 h-3 rounded-full" style={{ width: `${(count / titaniumSheetRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of titaniumSheetRecords) { map[r.priority] = (map[r.priority] || 0) + 1 } return (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([pri, count]) => (<div key={pri} className="flex items-center gap-2"><span className="text-xs w-20">{pri}</span><div className="flex-1 bg-yellow-100 rounded-full h-3"><div className="bg-yellow-600 h-3 rounded-full" style={{ width: `${(count / titaniumSheetRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipment Volume by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of titaniumSheetRecords) { map[r.zone] = (map[r.zone] || 0) + 1 } return (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, count]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-indigo-100 rounded-full h-3"><div className="bg-indigo-600 h-3 rounded-full" style={{ width: `${(count / titaniumSheetRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Thickness Category Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const cats: Record<string, number> = { 'Foil (<0.5mm)': 0, 'Thin (0.5-2mm)': 0, 'Medium (2-6mm)': 0, 'Thick (6-12mm)': 0, 'Plate (12-25mm)': 0, 'Heavy (>25mm)': 0 }; for (const r of titaniumSheetRecords) { const t = r.thicknessMm; if (t < 0.5) cats['Foil (<0.5mm)']++; else if (t < 2) cats['Thin (0.5-2mm)']++; else if (t < 6) cats['Medium (2-6mm)']++; else if (t < 12) cats['Thick (6-12mm)']++; else if (t <= 25) cats['Plate (12-25mm)']++; else cats['Heavy (>25mm)']++ } return (Object.entries(cats) as [string, number][]).map(([cat, count]) => (<div key={cat} className="flex items-center gap-2"><span className="text-xs w-28">{cat}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-600 h-3 rounded-full" style={{ width: `${(count / titaniumSheetRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-amber-600"><CardHeader><CardTitle className="text-sm">Ti-6Al-4V Aero: HAL Tejas &#8377;15,000Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Ti-6Al-4V (Grade 5) is India&apos;s most widely used titanium alloy for HAL Tejas Mk-1A wing spar, fuselage frame and landing gear components, with 90% titanium content and 950 MPa ultimate tensile strength. MIDHANI is India&apos;s sole qualified producer of Ti-6Al-4V plate, bar and sheet for aerospace applications, supplying 120 tonnes/year to HAL, DRDO and ISRO. India&apos;s aerospace titanium market is &#8377;15,000Cr, growing 18% CAGR driven by HAL&apos;s 40 Tejas Mk-1A order (joining 32 already delivered), 220 Su-30MKI fleet overhaul, and the AMCA fifth-generation fighter requiring 8 tonnes of titanium per aircraft. Ti-6Al-4V&apos;s specific strength of 220 kNm/kg is 40% higher than Al-7075-T6 and 60% higher than maraging steel, enabling the Tejas to achieve a 1.6:1 thrust-to-weight ratio. India&apos;s titanium sponge capacity of 12,000 tonnes/year (KMMML Kerala) is being expanded to 20,000 tonnes by 2028, reducing import dependency from 70% to 40%.</p></CardContent></Card>
          <Card className="border-l-4 border-l-rose-500"><CardHeader><CardTitle className="text-sm">Ti-15-3 Beta: DRDO Nirbhay &#8377;5,500Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Ti-15V-3Cr-3Al-3Sn (Ti-15-3) is a metastable beta titanium alloy selected for DRDO&apos;s Nirbhay subsonic cruise missile wing skin and fuel tank, with 76% titanium and exceptional room-temperature formability (bend radius 3T vs 6T for Ti-6Al-4V). India&apos;s missile titanium market is &#8377;5,500Cr, with Ti-15-3 enabling single-piece superplastically formed wing panels at 900&#176;C that replace 12 riveted alpha-beta alloy segments, reducing assembly weight by 25% and manufacturing time by 60%. Ti-15-3&apos;s beta-stabilised microstructure provides deep drawability at room temperature (elongation 15% vs 10% for Ti-6-4), enabling complex curvature missile airframe shapes without hot forming. DRDO DMRL developed India&apos;s Ti-15-3 sheet production capability in 2022, ending dependence on imports from TIMET (USA) and VSMPO-AVISMA (Russia). The Nirbhay programme consumes 50 tonnes/year of Ti-15-3 sheet in 0.8-2.0mm thickness range, with future Long Range Land Attack Missile (LRLAM) extending demand.</p></CardContent></Card>
          <Card className="border-l-4 border-l-sky-500"><CardHeader><CardTitle className="text-sm">Cp-Ti Desalination: Kudankulam &#8377;4,200Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Commercially pure titanium Grade 2 sheet (99.2% Ti, 3mm thickness) is the standard material for nuclear desalination plant heat exchanger tubing at NPCIL Kudankulam, with India&apos;s desalination titanium market at &#8377;4,200Cr. Kudankulam&apos;s two 8,000 m3/day multi-stage flash (MSF) units use 120 tonnes of Ti Grade 2 tubes and sheets, chosen for their corrosion rate of less than 0.01 mm/year in hot seawater (85&#176;C, 35,000 ppm chlorides) - 100x better than Cu-Ni 90/10 alloy. India&apos;s desalination capacity is growing from 700 MLD to 3,000 MLD by 2030, driven by water stress in Chennai, Mumbai and Gujarat, with each MLD requiring approximately 15 tonnes of titanium. The NPCIL-DAE partnership operates India&apos;s largest nuclear desalination demonstration at Kudankulam, with Ti Grade 2 selected over Grade 7 (Pd-stabilised) for cost efficiency where crevice corrosion risk is manageable through design. MIDHANI produces 2,000 tonnes/year of CP-Ti Grades 1-4 for industrial applications.</p></CardContent></Card>
          <Card className="border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm">Ti-6Al-7Nb Medical: Zimmer India &#8377;2,200Cr</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Ti-6Al-7Nb (ISO 5832-11) vanadium-free titanium alloy sheet is India&apos;s preferred medical implant material, replacing Ti-6Al-4V over cytotoxicity concerns with vanadium ions in long-term body contact. Zimmer India (25% market share) sources 2mm Ti-6Al-7Nb sheet from Gujarat Fluorochemicals for fracture fixation plates and surgical instrument components, with India&apos;s medical titanium market at &#8377;2,200Cr. The 7% niobium provides beta-phase strengthening equivalent to vanadium, achieving 900 MPa UTS and 10% elongation meeting ASTM F136 requirements. India&apos;s orthopaedic implant market is growing 20% CAGR to 1.2 million procedures/year, with the Make in India programme targeting 80% domestic implant manufacturing by 2028 (currently 45%). Ti-6Al-7Nb&apos;s advantage extends beyond biocompatibility - its elastic modulus (110 GPa) is 50% lower than CoCrMo (210 GPa), reducing stress shielding and preventing periprosthetic bone resorption that leads to aseptic loosening in 8-12% of hip replacements with stiffer implants.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
