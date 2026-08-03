'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Battery } from 'lucide-react'

interface LithiumRefiningRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  processType: string
  application: string
  lithiumPurity: number
  capacityTpa: number
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

const lithiumRecords: LithiumRefiningRecord[] = [
  { id: 'LTR-0001', batchNo: 'LTR-B2401', city: 'Bengaluru', manufacturer: 'Karnataka Mineral Corp', processType: 'Hard Rock Spodumene', application: 'Li-ion Battery Cell (Exicom)', lithiumPurity: 99.5, capacityTpa: 5000, investmentCr: 285, status: 'Delivered', priority: 'Critical', origin: 'KMC Bengaluru (KA)', destination: 'Exicom Bengaluru (KA)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: 'Spodumene concentrate to battery-grade Li2CO3 for Exicom EV battery cell &#8594; 99.5% purity &#8594; &#8377;285Cr for 5,000 TPA &#8594; India 5 million EV target 2030 &#8594; Li2CO3 50% of cell cathode cost &#8594; India &#8377;18,000Cr lithium refining market &#8594; Exicom 35% India EV battery market &#8594; 1 tonne Li2CO3 per 100 kWh battery pack' },
  { id: 'LTR-0002', batchNo: 'LTR-B2402', city: 'Hyderabad', manufacturer: 'MAN Industries', processType: 'Brine Extraction Salar', application: 'EV Battery Pack (Ola Electric)', lithiumPurity: 99.7, capacityTpa: 10000, investmentCr: 420, status: 'Delivered', priority: 'Critical', origin: 'MAN Industries Hyderabad (TG)', destination: 'Ola Futurefactory Krishnagiri (TN)', shipDate: '2026-07-20', transitDays: 2, zone: 'South', remarks: 'Brine extraction to battery-grade LiOH for Ola S1 Ultra EV battery &#8594; 99.7% purity &#8594; &#8377;420Cr for 10,000 TPA &#8594; Ola 10 million scooter target &#8594; LiOH preferred for NMC811 high-Ni cathode &#8594; India &#8377;22,000Cr battery lithium market &#8594; Ola &#8377;7,600Cr battery gigafactory &#8594; LiOH vs Li2CO3 for NMC trade-off' },
  { id: 'LTR-0003', batchNo: 'LTR-B2403', city: 'Mumbai', manufacturer: 'Hindustan Copper Ltd', processType: 'Brine Extraction Continental', application: 'Grid Storage (Tata Power)', lithiumPurity: 99.2, capacityTpa: 8000, investmentCr: 350, status: 'Delivered', priority: 'High', origin: 'HCL Mumbai (MH)', destination: 'Tata Power Mumbai (MH)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: 'Continental brine to technical-grade Li2CO3 for Tata Power grid storage &#8594; 99.2% purity &#8594; &#8377;350Cr for 8,000 TPA &#8594; India 40 GWh grid storage target &#8594; LFP chemistry uses cheaper Li2CO3 &#8594; India &#8377;12,500Cr grid storage lithium &#8594; Tata Power 5 GWh storage pipeline &#8594; Li2CO3 70% cost advantage vs LiOH for LFP' },
  { id: 'LTR-0004', batchNo: 'LTR-B2404', city: 'Pune', manufacturer: 'Indian Rare Earths (IRE)', processType: 'Pegmatite Lepidolite', application: 'Glass and Ceramic (Saint-Gobain)', lithiumPurity: 98.5, capacityTpa: 3000, investmentCr: 95, status: 'Delayed', priority: 'Medium', origin: 'IRE Chavara (KL)', destination: 'Saint-Gobain Chennai (TN)', shipDate: '2026-07-22', transitDays: 10, zone: 'West', remarks: 'Lepidolite mica to Li2CO3 for Saint-Gobain glass-ceramic cooktop &#8594; 98.5% purity &#8594; &#8377;95Cr for 3,000 TPA &#8594; 10d delay lepidolite ore import &#8594; India &#8377;2,200Cr glass lithium market &#8594; 0.5% Li2O lowers glass melting point &#8594; Saint-Gobain 30M m2 glass/year India &#8594; Lepidolite secondary Li source after spodumene' },
  { id: 'LTR-0005', batchNo: 'LTR-B2405', city: 'Chennai', manufacturer: 'Dalmia Cement', processType: 'Clay Li Recovery', application: 'Cement Additive (Ramco Cements)', lithiumPurity: 95, capacityTpa: 2000, investmentCr: 42, status: 'Delivered', priority: 'Low', origin: 'Dalmia Chennai (TN)', destination: 'Ramco Cements Chennai (TN)', shipDate: '2026-07-19', transitDays: 1, zone: 'South', remarks: 'Li-enriched clay to Li2CO3 byproduct from cement kiln &#8594; 95% purity &#8594; &#8377;42Cr for 2,000 TPA &#8594; India 1,400 MT cement &#8594; Li2CO3 byproduct revenue offsets cement cost &#8594; India &#8377;800Cr cement lithium byproduct &#8594; Dalmia 45 MT cement capacity &#8594; Li content 0.02% in some clays &#8594; Emerging recovery technology' },
  { id: 'LTR-0006', batchNo: 'LTR-B2406', city: 'Noida', manufacturer: 'Rajasthan State Mines', processType: 'Pegmatite Petalite', application: 'Heat-Resistant Glass (Asahi India)', lithiumPurity: 97, capacityTpa: 4000, investmentCr: 125, status: 'Delivered', priority: 'Medium', origin: 'RSM Ajmer (RJ)', destination: 'Asahi India Noida (UP)', shipDate: '2026-07-16', transitDays: 1, zone: 'North', remarks: 'Petalite concentrate to Li2CO3 for Asahi Pyroceram cooktop glass &#8594; 97% purity &#8594; &#8377;125Cr for 4,000 TPA &#8594; Petalite 4.2% Li2O content &#8594; India &#8377;2,800Cr specialty glass lithium &#8594; Asahi 30% India automotive glass &#8594; Li2O thermal expansion coefficient control &#8594; Petalite from Rajasthan pegmatite belt' },
  { id: 'LTR-0007', batchNo: 'LTR-B2407', city: 'Kolkata', manufacturer: 'West Bengal Mineral Dev', processType: 'Brine Extraction Geothermal', application: 'Li-ion Cell (Amara Raja)', lithiumPurity: 99.5, capacityTpa: 6000, investmentCr: 310, status: 'Delivered', priority: 'Critical', origin: 'WBMD Kolkata (WB)', destination: 'Amara Raja Tirupati (AP)', shipDate: '2026-07-21', transitDays: 2, zone: 'East', remarks: 'Geothermal brine to battery-grade Li2CO3 for Amara Raja GWh factory &#8594; 99.5% purity &#8594; &#8377;310Cr for 6,000 TPA &#8594; Amara Raja &#8377;9,500Cr 10 GWh cell factory &#8594; India &#8377;15,000Cr cell-grade lithium &#8594; Amara Raja 25% India battery market &#8594; Purgatory Lake Rajasthan brine potential &#8594; Geothermal brine 200 ppm Li' },
  { id: 'LTR-0008', batchNo: 'LTR-B2408', city: 'Ahmedabad', manufacturer: 'Gujarat Fluorochemicals', processType: 'Hard Rock Spodumene', application: 'Grease Lubricant (Castrol)', lithiumPurity: 99.9, capacityTpa: 2500, investmentCr: 68, status: 'Delivered', priority: 'Medium', origin: 'GFCL Vadodara (GJ)', destination: 'Castrol India Pune (MH)', shipDate: '2026-07-17', transitDays: 2, zone: 'West', remarks: 'High-purity Li2CO3 to lithium stearate for Castrol LEP grease &#8594; 99.9% purity &#8594; &#8377;68Cr for 2,500 TPA &#8594; India &#8377;1,500Cr lithium grease market &#8594; Li 12-HSA thickener for multi-purpose grease &#8594; Castrol 35% India grease market &#8594; Lithium grease 200&#176;C drop point &#8594; 8% Li content in 12-HSA soap' },
  { id: 'LTR-0009', batchNo: 'LTR-B2409', city: 'Jaipur', manufacturer: 'Rajasthan Lithium Corp', processType: 'Hard Rock Spodumene', application: 'Aerospace Alloy (HAL)', lithiumPurity: 99.8, capacityTpa: 1500, investmentCr: 145, status: 'Delivered', priority: 'High', origin: 'RLC Udaipur (RJ)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-23', transitDays: 2, zone: 'North', remarks: 'Ultra-pure Li metal for HAL Al-Li alloy aerospace forging &#8594; 99.8% Li purity &#8594; &#8377;145Cr for 1,500 TPA &#8594; Al-Li 2090 alloy 10% Li &#8594; India &#8377;3,200Cr aerospace lithium market &#8594; HAL Tejas wing skin uses Al-Li &#8594; 8% density reduction vs Al 7075 &#8594; Li metal produced by electrolysis of LiCl-KCl melt' },
  { id: 'LTR-0010', batchNo: 'LTR-B2410', city: 'Coimbatore', manufacturer: 'Tamil Nadu Mineral Ltd', processType: 'Brine Extraction Salar', application: 'Consumer Electronics Battery (Lava)', lithiumPurity: 99.5, capacityTpa: 4000, investmentCr: 175, status: 'Delivered', priority: 'High', origin: 'TNML Chennai (TN)', destination: 'Lava Electronics Noida (UP)', shipDate: '2026-07-14', transitDays: 2, zone: 'South', remarks: 'Salar brine to Li2CO3 for Lava smartphone battery cell &#8594; 99.5% purity &#8594; &#8377;175Cr for 4,000 TPA &#8594; India 300 million smartphones/year &#8594; NMC622 cathode for phone battery &#8594; India &#8377;8,500Cr consumer lithium market &#8594; Lava 8% India smartphone &#8594; Li-ion 260 Wh/kg energy density' },
  { id: 'LTR-0011', batchNo: 'LTR-B2411', city: 'Bhubaneswar', manufacturer: 'Odisha Lithium Project', processType: 'Hard Rock Spodumene', application: 'EV Battery Cell (Mahindra)', lithiumPurity: 99.5, capacityTpa: 8000, investmentCr: 380, status: 'Delivered', priority: 'Critical', origin: 'OLP Koraput (OD)', destination: 'Mahindra EV Pune (MH)', shipDate: '2026-07-25', transitDays: 3, zone: 'East', remarks: 'Spodumene to Li2CO3 for Mahindra XUV400 EV cell &#8594; 99.5% purity &#8594; &#8377;380Cr for 8,000 TPA &#8594; Mahindra 500,000 EV target &#8594; LFP vs NMC chemistry choice &#8594; India &#8377;25,000Cr EV lithium market &#8594; Mahindra &#8377;8,000Cr cell JV with LG &#8594; Odisha spodumene 1.2% Li2O grade confirmed' },
  { id: 'LTR-0012', batchNo: 'LTR-B2412', city: 'Guwahati', manufacturer: 'Assam Lithium Explorations', processType: 'Brine Extraction Salar', application: 'Grid Storage LFP (NTPC)', lithiumPurity: 99.2, capacityTpa: 5000, investmentCr: 220, status: 'Delayed', priority: 'High', origin: 'ALE Guwahati (AS)', destination: 'NTPC New Delhi (DL)', shipDate: '2026-07-24', transitDays: 12, zone: 'East', remarks: 'Salar brine to Li2CO3 for NTPC 2.5 GWh grid storage &#8594; 99.2% purity &#8594; &#8377;220Cr for 5,000 TPA &#8594; 12d delay monsoon &#8594; NTPC 10 GWh storage target 2030 &#8594; India &#8377;12,500Cr storage lithium &#8594; LFP uses Li2CO3 cheaper chemistry &#8594; Assam brine potential 500 ppm Li in salt lakes' },
  { id: 'LTR-0013', batchNo: 'LTR-B2413', city: 'Gandhinagar', manufacturer: 'Gujarat Lithium Technologies', processType: 'Direct Lithium Extraction', application: 'Semiconductor Li Battery (Tata Electronics)', lithiumPurity: 99.9, capacityTpa: 3000, investmentCr: 265, status: 'Delivered', priority: 'Critical', origin: 'GLT Gandhinagar (GJ)', destination: 'Tata Electronics Hosur (TN)', shipDate: '2026-07-26', transitDays: 2, zone: 'West', remarks: 'DLE to ultra-high purity LiOH for Tata semiconductor-grade battery &#8594; 99.9% purity &#8594; &#8377;265Cr for 3,000 TPA &#8594; DLE technology reduces water use 90% vs evaporation &#8594; India &#8377;5,500Cr DLE lithium market &#8594; Tata &#8377;15,000Cr semiconductor battery plant &#8594; DLE adsorbent: Li-selective ion exchange resin &#8594; 24-hour extraction vs 18-month evaporation pond' },
  { id: 'LTR-0014', batchNo: 'LTR-B2414', city: 'Lucknow', manufacturer: 'UP New Energy Ltd', processType: 'Brine Extraction Continental', application: 'Two-Wheeler Battery (Hero MotoCorp)', lithiumPurity: 99.5, capacityTpa: 6000, investmentCr: 195, status: 'Delivered', priority: 'High', origin: 'UPNE Lucknow (UP)', destination: 'Hero MotoCorp Delhi (DL)', shipDate: '2026-07-27', transitDays: 1, zone: 'North', remarks: 'Continental brine to Li2CO3 for Hero Vida electric scooter &#8594; 99.5% purity &#8594; &#8377;195Cr for 6,000 TPA &#8594; India 30 million two-wheelers EV shift &#8594; 3.5 kWh per scooter &#8594; India &#8377;8,200Cr 2W lithium &#8594; Hero 37% India 2W market &#8594; LFP preferred for cost 30% lower than NMC &#8594; Hero &#8377;2,000Cr cell JV' }
]

export default function LithiumRefiningLogisticsView() {
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
    return lithiumRecords.filter(r => {
      const matchSearch = !searchQuery || Object.values(r).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))
      const matchFilters = Object.entries(filters).every(([key, values]) => values.includes(String(r[key as keyof LithiumRefiningRecord])))
      return matchSearch && matchFilters
    })
  }, [searchQuery, filters])

  const totalInvestment = useMemo(() => lithiumRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])
  const avgPurity = useMemo(() => (lithiumRecords.reduce((s: number, r) => s + r.lithiumPurity, 0) / lithiumRecords.length).toFixed(2), [])
  const deliveredCount = useMemo(() => lithiumRecords.filter(r => r.status === 'Delivered').length, [])
  const delayedCount = useMemo(() => lithiumRecords.filter(r => r.status === 'Delayed').length, [])

  const uniqueCities = useMemo(() => [...new Set(lithiumRecords.map(r => r.city))], [])
  const uniqueStatuses = useMemo(() => [...new Set(lithiumRecords.map(r => r.status))], [])
  const uniqueManufacturers = useMemo(() => [...new Set(lithiumRecords.map(r => r.manufacturer))], [])

  const cityInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of lithiumRecords) { map[r.city] = (map[r.city] || 0) + r.investmentCr }
    return map
  }, [])

  const processCapacityMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of lithiumRecords) { map[r.processType] = (map[r.processType] || 0) + r.capacityTpa }
    return map
  }, [])

  const statusCountMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of lithiumRecords) { map[r.status] = (map[r.status] || 0) + 1 }
    return map
  }, [])

  const zoneInvestmentMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of lithiumRecords) { map[r.zone] = (map[r.zone] || 0) + r.investmentCr }
    return map
  }, [])

  const maxCity = useMemo(() => {
    const entries = (Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [cityInvestmentMap])

  const maxProcess = useMemo(() => {
    const entries = (Object.entries(processCapacityMap) as [string, number][]).sort((a, b) => b[1] - a[1])
    return entries[0] || ['N/A', 0]
  }, [processCapacityMap])

  const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights']

  return (
    <div className="space-y-6">
      <PageHeader title="Lithium Refining Logistics" description="Lithium refining and extraction supply chain for Li-ion EV batteries, grid energy storage, consumer electronics, aerospace Al-Li alloys, lithium grease lubricants and specialty glass/ceramic applications" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-lime-600 bg-lime-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Total Investment</div><div className="text-2xl font-bold text-lime-800">&#8377;{totalInvestment.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across {lithiumRecords.length} batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-lime-600 bg-lime-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Avg Li Purity</div><div className="text-2xl font-bold text-lime-800">{avgPurity}%</div><div className="text-xs text-muted-foreground mt-1">Across all processes</div></CardContent></Card>
        <Card className="border-l-4 border-l-lime-600 bg-lime-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Delivered</div><div className="text-2xl font-bold text-lime-800">{deliveredCount}</div><div className="text-xs text-muted-foreground mt-1">{delayedCount} delayed</div></CardContent></Card>
        <Card className="border-l-4 border-l-lime-600 bg-lime-50/30"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Top City</div><div className="text-2xl font-bold text-lime-800">{maxCity[0]}</div><div className="text-xs text-muted-foreground mt-1">&#8377;{maxCity[1].toLocaleString()} Cr invested</div></CardContent></Card>
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
          <button key={tab} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-lime-600 text-lime-800' : 'text-muted-foreground'}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by City</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(cityInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([city, val]) => (<div key={city} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{city}</span><div className="flex-1 bg-lime-100 rounded-full h-3"><div className="bg-lime-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Capacity by Process Type</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(processCapacityMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([proc, tpa]) => (<div key={proc} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{proc}</span><div className="flex-1 bg-green-100 rounded-full h-3"><div className="bg-green-600 h-3 rounded-full" style={{ width: `${(tpa / maxProcess[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">{tpa.toLocaleString()} TPA</span></div>))}</CardContent></Card>
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
              <thead><tr className="border-b"><th className="text-left p-2">Batch</th><th className="text-left p-2">City</th><th className="text-left p-2">Manufacturer</th><th className="text-left p-2">Process</th><th className="text-left p-2">Application</th><th className="text-left p-2">Purity%</th><th className="text-left p-2">TPA</th><th className="text-left p-2">&#8377;Cr</th><th className="text-left p-2">Status</th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className={`border-b ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                    <td className="p-2 font-mono text-xs">{r.batchNo}</td>
                    <td className="p-2">{r.city}</td>
                    <td className="p-2">{r.manufacturer}</td>
                    <td className="p-2">{r.processType}</td>
                    <td className="p-2 max-w-[200px] truncate">{r.application}</td>
                    <td className="p-2">{r.lithiumPurity}%</td>
                    <td className="p-2">{r.capacityTpa.toLocaleString()}</td>
                    <td className="p-2 font-medium">&#8377;{r.investmentCr}</td>
                    <td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : r.status === 'Delayed' ? 'destructive' : 'secondary'}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-sm">Purity by Batch</CardTitle></CardHeader><CardContent className="space-y-2">{lithiumRecords.slice(0, 8).map(r => (<div key={r.id} className="flex items-center gap-2"><span className="text-xs w-36 truncate">{r.processType}</span><div className="flex-1 bg-lime-100 rounded-full h-3"><div className="bg-lime-600 h-3 rounded-full" style={{ width: `${Math.min((r.lithiumPurity / 100) * 100, 100)}%` }}></div></div><span className="text-xs font-medium w-16 text-right">{r.lithiumPurity}%</span></div>))}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(zoneInvestmentMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-green-100 rounded-full h-3"><div className="bg-green-600 h-3 rounded-full" style={{ width: `${(val / maxCity[1]) * 100}%` }}></div></div><span className="text-xs font-medium w-20 text-right">&#8377;{val} Cr</span></div>))}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(Object.entries(statusCountMap) as [string, number][]).map(([status, count]) => (<div key={status} className="flex items-center gap-2"><span className="text-xs w-24">{status}</span><div className="flex-1 bg-lime-100 rounded-full h-3"><div className="bg-lime-600 h-3 rounded-full" style={{ width: `${(count / lithiumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of lithiumRecords) { map[r.priority] = (map[r.priority] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([pri, count]) => (<div key={pri} className="flex items-center gap-2"><span className="text-xs w-20">{pri}</span><div className="flex-1 bg-amber-100 rounded-full h-3"><div className="bg-amber-600 h-3 rounded-full" style={{ width: `${(count / lithiumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipment Volume by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const map: Record<string, number> = {}; for (const r of lithiumRecords) { map[r.zone] = (map[r.zone] || 0) + 1 } const sorted = (Object.entries(map) as [string, number][]).sort((a, b) => b[1] - a[1]); return sorted.map(([zone, count]) => (<div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-indigo-100 rounded-full h-3"><div className="bg-indigo-600 h-3 rounded-full" style={{ width: `${(count / lithiumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Process Technology Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{(() => { const cats: Record<string, number> = { 'Hard Rock Spodumene': 0, 'Brine Salar': 0, 'Brine Continental': 0, 'Brine Geothermal': 0, 'Pegmatite Lepidolite': 0, 'Pegmatite Petalite': 0, 'Clay Recovery': 0, 'DLE Technology': 0 }; for (const r of lithiumRecords) { if (r.processType.includes('DLE')) cats['DLE Technology']++; else if (r.processType.includes('Clay')) cats['Clay Recovery']++; else if (r.processType.includes('Spodumene')) cats['Hard Rock Spodumene']++; else if (r.processType.includes('Salar')) cats['Brine Salar']++; else if (r.processType.includes('Geothermal')) cats['Brine Geothermal']++; else if (r.processType.includes('Continental')) cats['Brine Continental']++; else if (r.processType.includes('Lepidolite')) cats['Pegmatite Lepidolite']++; else if (r.processType.includes('Petalite')) cats['Pegmatite Petalite']++ } return (Object.entries(cats) as [string, number][]).map(([proc, count]) => (<div key={proc} className="flex items-center gap-2"><span className="text-xs w-32">{proc}</span><div className="flex-1 bg-lime-100 rounded-full h-3"><div className="bg-lime-600 h-3 rounded-full" style={{ width: `${(count / lithiumRecords.length) * 100}%` }}></div></div><span className="text-xs font-medium w-8 text-right">{count}</span></div>))})()}</CardContent></Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-lime-600"><CardHeader><CardTitle className="text-sm">India Lithium: 100% Import to Domestic Refining Ambition</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India currently imports 100% of its lithium requirements (approximately 30,000 tonnes of LCE - Lithium Carbonate Equivalent annually), primarily from Australia (spodumene concentrate), Chile (brine Li2CO3) and China (refined LiOH). India&apos;s lithium import bill exceeds &#8377;18,000Cr, with EV batteries consuming 60%, consumer electronics 20%, grid storage 10% and industrial applications 10%. The Geological Survey of India (GSI) has discovered 5.9 million tonnes of inferred lithium resources at Reasi district in Jammu and Kashmir, and preliminary surveys show lithium potential in Rajasthan pegmatite belts and Assam salar deposits. The PLI scheme for advanced chemistry cells (ACC) mandates 50% domestic value addition, driving &#8377;18,000Cr investment in 5 lithium refining clusters at Gujarat, Rajasthan, Tamil Nadu, Karnataka and Odisha by 2028.</p></CardContent></Card>
          <Card className="border-l-4 border-l-sky-500"><CardHeader><CardTitle className="text-sm">DLE Technology: 90% Water Reduction Game-Changer</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Direct Lithium Extraction (DLE) is revolutionizing India&apos;s lithium refining landscape by reducing water consumption by 90% compared to conventional evaporation ponds (which require 500,000 gallons of water per tonne of Li recovered) and cutting extraction time from 18 months to 24 hours. Gujarat Lithium Technologies (Gandhinagar) operates India&apos;s first commercial DLE plant using Li-selective ion exchange adsorbent resin, processing continental brine at 3,000 TPA capacity with 99.9% LiOH purity. India&apos;s DLE market is &#8377;5,500Cr, growing at 35% CAGR as 8 new DLE plants are under construction. DLE technology also enables lithium recovery from lower-grade brines (200-500 ppm Li vs 1,000+ ppm required for evaporation), opening up Rajasthan geothermal and Assam salar deposits that were previously uneconomic.</p></CardContent></Card>
          <Card className="border-l-4 border-l-orange-500"><CardHeader><CardTitle className="text-sm">EV Battery Lithium: &#8377;25,000Cr by 2030</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>India&apos;s EV battery lithium demand is projected to reach &#8377;25,000Cr by 2030, driven by 5 million electric vehicles (3 million two-wheelers, 1.5 million three-wheelers, 500,000 cars) consuming 60 GWh of battery cells annually. Exicom (Bengaluru), Ola Electric (Krishnagiri), Mahindra (Pune), Amara Raja (Tirupati) and Tata AutoComp (Pune) are building a combined 80 GWh cell manufacturing capacity requiring 80,000 tonnes of LCE. The chemistry mix is shifting from NMC532 (5:3:2 nickel-manganese-cobalt) to LFP (lithium iron phosphate) for two-wheelers and grid storage due to 30% lower cost, while premium EVs retain NMC811 (8:1:1) for higher energy density. India&apos;s lithium refining must produce both Li2CO3 (for LFP) and LiOH (for NMC) to serve the full chemistry spectrum.</p></CardContent></Card>
          <Card className="border-l-4 border-l-purple-500"><CardHeader><CardTitle className="text-sm">Beyond Batteries: Aerospace Al-Li, Grease and Glass</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground"><p>Lithium&apos;s applications beyond batteries account for &#8377;7,700Cr of India&apos;s lithium market. In aerospace, 99.8% pure lithium metal is electrolysed from LiCl-KCl melt for Al-Li 2090 alloy used in HAL Tejas wing skins, providing 8% density reduction vs conventional Al 7075 while maintaining 95% of fatigue life. In industrial lubricants, lithium 12-hydroxystearic acid (12-HSA) soap thickener produces the world&apos;s most widely used multi-purpose grease with 200&#176;C drop point, consuming &#8377;1,500Cr of Li2CO3 through Castrol, Shell and IOCL. In specialty glass, Li2O (0.5% addition) reduces melting temperature by 40&#176;C for Saint-Gobain and Asahi India, saving &#8377;800Cr in energy costs across 200 glass furnaces. These non-battery segments provide stable demand independent of EV cycle volatility.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
