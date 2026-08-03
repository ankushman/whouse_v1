'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Atom } from 'lucide-react'

interface GreenAmmoniaShippingRecord {
  id: string
  voyageId: string
  port: string
  vessel: string
  ammoniaType: string
  carrier: string
  volumeMT: number
  energyDensityKWh: number
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

const greenAmmoniaRecords: GreenAmmoniaShippingRecord[] = [
  { id: 'GAS-0001', voyageId: 'GAS-V2401', port: 'Kandla', vessel: 'MV Green Horizon', ammoniaType: 'Green NH3 (Electrolysis)', carrier: 'Adani Green Gas', volumeMT: 25000, energyDensityKWh: 4250, investmentCr: 420, status: 'In Transit', priority: 'Critical', origin: 'Kandla Port (Gujarat)', destination: 'Rotterdam (Netherlands)', shipDate: '2026-07-22', transitDays: 18, zone: 'West', remarks: 'India&apos;s first green ammonia export to Europe &#8594; 25,000 MT from Adani electrolysis plant at Kandla &#8594; &#8377;420Cr voyage &#8594; Rotterdam receiving terminal operated by Yara &#8594; EU Green Deal qualifying as renewable fuel of non-biological origin (RFNBO) &#8594; carbon intensity 0.4 kg CO2/kg NH3 vs grey ammonia 1.8 kg' },
  { id: 'GAS-0002', voyageId: 'GAS-V2402', port: 'Ennore', vessel: 'MT Ammonia Pioneer', ammoniaType: 'Blue NH3 (SMR+CCS)', carrier: 'NTPC Green', volumeMT: 18000, energyDensityKWh: 4180, investmentCr: 310, status: 'Delivered', priority: 'High', origin: 'Ennore Port (Tamil Nadu)', destination: 'Mumbai (RIL Refinery)', shipDate: '2026-07-16', transitDays: 5, zone: 'South', remarks: 'Blue ammonia from NTPC Tuticorin SMR plant with 90% CCS &#8594; 18,000 MT coastal shipment to Reliance Jamnagar &#8594; RIL using as hydrogen carrier for FCC unit &#8594; &#8377;310Cr contract &#8594; replacing grey ammonia reducing refinery emissions by 320,000t CO2/year &#8594; NTPC scaling blue ammonia to 1 MTPA by 2028' },
  { id: 'GAS-0003', voyageId: 'GAS-V2403', port: 'Paradip', vessel: 'MV NH3 Freedom', ammoniaType: 'Green NH3 (Electrolysis)', carrier: 'IOC Green Energy', volumeMT: 12000, energyDensityKWh: 4320, investmentCr: 285, status: 'Processing', priority: 'High', origin: 'Paradip Port (Odisha)', destination: 'Fujairah (UAE)', shipDate: '2026-07-25', transitDays: 8, zone: 'East', remarks: 'IOC Paradip green ammonia from 100MW electrolyzer powered by offshore wind &#8594; 12,000 MT to Fujairah for ADNOC fertilizer plant &#8594; &#8377;285Cr &#8594; urea production using green NH3 reduces UAE Scope 1 emissions &#8594; IOC joint venture with AM Green for green molecule exports &#8594; targeting 500,000t/year by 2029 from Paradip' },
  { id: 'GAS-0004', voyageId: 'GAS-V2404', port: 'Mundra', vessel: 'MT Green Wave', ammoniaType: 'Turquoise NH3 (Methane Pyrolysis)', carrier: 'GAIL Green', volumeMT: 20000, energyDensityKWh: 4100, investmentCr: 350, status: 'In Transit', priority: 'Critical', origin: 'Mundra Port (Gujarat)', destination: 'Yokohama (Japan)', shipDate: '2026-07-20', transitDays: 22, zone: 'West', remarks: 'Turquoise ammonia via methane pyrolysis producing hydrogen + solid carbon black &#8594; GAIL Hazira plant converting 200,000t methane/year &#8594; 20,000 MT shipment to JERA Yokohama &#8594; &#8377;350Cr &#8594; Japan targeting 3 MTPA ammonia imports as hydrogen carrier by 2030 &#8594; GAIL carbon black byproduct sold to tire manufacturers at &#8377;45Cr/year' },
  { id: 'GAS-0005', voyageId: 'GAS-V2405', port: 'Vizag', vessel: 'MV Ammonia Queen', ammoniaType: 'Green NH3 (Solid Oxide)', carrier: 'L&T Green Hydrogen', volumeMT: 15000, energyDensityKWh: 4280, investmentCr: 265, status: 'Delivered', priority: 'High', origin: 'Vizag Port (AP)', destination: 'Incheon (South Korea)', shipDate: '2026-07-14', transitDays: 14, zone: 'South', remarks: 'L&T Vizag solid oxide electrolyzer green ammonia &#8594; 85% efficiency at 800&#176;C &#8594; 15,000 MT to South Korea&apos;s Samsung Engineering &#8594; &#8377;265Cr &#8594; Samsung converting to hydrogen for fuel cell buses in Seoul &#8594; India-SK green ammonia MoU targets 1 MTPA bilateral trade by 2030 &#8594; L&T building 300,000t/year plant at Vizag' },
  { id: 'GAS-0006', voyageId: 'GAS-V2406', port: 'Haldia', vessel: 'MT NH3 Express', ammoniaType: 'Green NH3 (Electrolysis)', carrier: 'AM Green Agri', volumeMT: 8000, energyDensityKWh: 4350, investmentCr: 180, status: 'Delayed', priority: 'Medium', origin: 'Haldia Port (West Bengal)', destination: 'Kakinada (Fertilizer Corp)', shipDate: '2026-07-10', transitDays: 7, zone: 'East', remarks: 'Green ammonia barge from AM Green Haldia to Kakinada &#8594; 7-day delay: barge ballast pump failure in Hooghly river &#8594; 8,000 MT for IFFCO Kakinada urea plant &#8594; &#8377;180Cr &#8594; IFFCO targeting 30% green ammonia in fertilizer production by 2028 &#8594; replacement barge dispatched from Kolkata &#8594; expected arrival +3 days' },
  { id: 'GAS-0007', voyageId: 'GAS-V2407', port: 'Tuticorin', vessel: 'MV Green Clipper', ammoniaType: 'Blue NH3 (ATR+CCS)', carrier: 'Tata Chemicals', volumeMT: 22000, energyDensityKWh: 4150, investmentCr: 410, status: 'In Transit', priority: 'Critical', origin: 'Tuticorin Port (TN)', destination: 'Hamburg (Germany)', shipDate: '2026-07-21', transitDays: 20, zone: 'South', remarks: 'Tata Blue ammonia from Mithapur ATR plant with 95% carbon capture &#8594; 22,000 MT to HAPAG-Lloyd Hamburg terminal &#8594; &#8377;410Cr &#8594; Germany&apos;s ammonia terminal serving European green fertilizer market &#8594; Tata scaling to 800,000t/year blue NH3 by 2029 &#8594; EU CBAM credits worth &#8377;85Cr annually &#8594; captured CO2 stored in Deccan basalt formations' },
  { id: 'GAS-0008', voyageId: 'GAS-V2408', port: 'Mormugao', vessel: 'MT Ammonia Spirit', ammoniaType: 'Green NH3 (Biomass Gasification)', carrier: 'JSW Green Energy', volumeMT: 5000, energyDensityKWh: 3900, investmentCr: 95, status: 'Processing', priority: 'Low', origin: 'Mormugao Port (Goa)', destination: 'Mangalore (MRPL)', shipDate: '2026-07-24', transitDays: 2, zone: 'West', remarks: 'Biomass-derived green ammonia from JSW Vijaynagar gasification plant &#8594; 5,000 MT short-haul to MRPL Mangalore refinery &#8594; &#8377;95Cr &#8594; biomass feedstock: rice husk and cotton stalk from Raichur farmers &#8594; lower energy density 3,900 kWh/MT due to biomass impurities &#8594; JSW piloting 50,000t/year plant expansion &#8594; rural farmer co-operative supplying 200,000t biomass/year' },
  { id: 'GAS-0009', voyageId: 'GAS-V2409', port: 'Chennai', vessel: 'MV NH3 Challenger', ammoniaType: 'Green NH3 (Electrolysis)', carrier: 'ReNew Green Molecules', volumeMT: 10000, energyDensityKWh: 4400, investmentCr: 225, status: 'Delivered', priority: 'High', origin: 'Chennai Port (TN)', destination: 'Singapore', shipDate: '2026-07-17', transitDays: 7, zone: 'South', remarks: 'ReNew Power green ammonia from 200MW dedicated electrolyzer in Cuddalore &#8594; 10,000 MT to Singapore&apos;s Keppel terminal &#8594; &#8377;225Cr &#8594; Singapore using as marine bunker fuel in ammonia-powered tankers &#8594; maritime ammonia bunkering market worth &#8377;12,000Cr by 2030 &#8594; ReNew planning 1 MTPA green ammonia at Cuddalore SEZ by 2030' },
  { id: 'GAS-0010', voyageId: 'GAS-V2410', port: 'Cochin', vessel: 'MT Ammonia Sunrise', ammoniaType: 'Green NH3 (Anion Exchange)', carrier: 'Kerala Green Fuel', volumeMT: 3000, energyDensityKWh: 4450, investmentCr: 75, status: 'In Transit', priority: 'Medium', origin: 'Cochin Port (Kerala)', destination: 'Colombo (Sri Lanka)', shipDate: '2026-07-19', transitDays: 1, zone: 'South', remarks: 'AEM electrolysis green ammonia &#8594; 3,000 MT from Kochi Refinery pilot to Colombo Port &#8594; &#8377;75Cr &#8594; highest energy density 4,450 kWh/MT due to pure water electrolysis &#8594; Kerala targeting 200,000t/year green ammonia by 2029 &#8594; bilateral green fuel corridor India-Sri Lanka-Maldives &#8594; Cochin Shipyard building ammonia-fueled coastal vessels' },
  { id: 'GAS-0011', voyageId: 'GAS-V2411', port: 'Nagpur', vessel: 'Rail Tank Wagons', ammoniaType: 'Green NH3 (Pipeline)', carrier: 'GreenCell Mobility', volumeMT: 1500, energyDensityKWh: 4300, investmentCr: 55, status: 'Delivered', priority: 'Medium', origin: 'Nagpur (GreenCell Hub)', destination: 'Bhopal (MP Fertilizer)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: 'Pipeline-delivered green ammonia via Nagpur-Bhopal product pipeline &#8594; 1,500 MT for MP State Fertilizer Cooperative &#8594; &#8377;55Cr &#8594; pipeline transport 80% cheaper than road tankers &#8594; GreenCell blending 15% green NH3 with grey for urea production &#8594; MP government subsidy &#8377;8/kg green ammonia premium &#8594; rural ammonia distribution network via cooperative society' },
  { id: 'GAS-0012', voyageId: 'GAS-V2412', port: 'Dahej', vessel: 'MV NH3 Voyager', ammoniaType: 'Turquoise NH3 (Plasma)', carrier: 'Reliance Green', volumeMT: 30000, energyDensityKWh: 4200, investmentCr: 580, status: 'Delayed', priority: 'Critical', origin: 'Dahej Port (Gujarat)', destination: 'Pohang (South Korea)', shipDate: '2026-07-08', transitDays: 16, zone: 'West', remarks: 'Reliance plasma methane pyrolysis turquoise ammonia &#8594; 30,000 MT to POSCO Pohang steel mill for hydrogen-based DRI &#8594; &#8377;580Cr &#8594; 16-day delay: plasma reactor maintenance at Jamnagar &#8594; POSCO urgently needs green hydrogen for 2 MTPA DRI plant &#8594; daily penalty &#8377;3.5Cr &#8594; Reliance building world&apos;s largest turquoise ammonia plant: 2 MTPA by 2029 &#8594; plasma technology licensed from Monolith' },
  { id: 'GAS-0013', voyageId: 'GAS-V2413', port: 'Dhamra', vessel: 'MV Green Mariner', ammoniaType: 'Green NH3 (Electrolysis)', carrier: 'JSPL Green Hydrogen', volumeMT: 14000, energyDensityKWh: 4250, investmentCr: 295, status: 'Processing', priority: 'High', origin: 'Dhamra Port (Odisha)', destination: 'Busan (South Korea)', shipDate: '2026-07-26', transitDays: 15, zone: 'East', remarks: 'JSPL Angul green ammonia from 150MW electrolyzer powered by captive renewable &#8594; 14,000 MT to Hyundai Heavy Busan &#8594; &#8377;295Cr &#8594; Hyundai using for ammonia-fueled ship engine testing &#8594; JSPL targeting steel decarbonization: replacing coke ovens with green hydrogen &#8594; Dhamra emerging as India&apos;s east coast green ammonia export hub &#8594; port constructing dedicated 100,000m3 NH3 storage tank' },
  { id: 'GAS-0014', voyageId: 'GAS-V2414', port: 'Hazira', vessel: 'MT Ammonia Endeavour', ammoniaType: 'Blue NH3 (Partial Oxidation)', carrier: 'ONGC Green', volumeMT: 16000, energyDensityKWh: 4050, investmentCr: 330, status: 'In Transit', priority: 'High', origin: 'Hazira Port (Gujarat)', destination: 'Kobe (Japan)', shipDate: '2026-07-18', transitDays: 19, zone: 'West', remarks: 'ONGC Hazira blue ammonia from natural gas partial oxidation with 88% CCS &#8594; 16,000 MT to Mitsubishi Kobe &#8594; &#8377;330Cr &#8594; Japan&apos;s GX (Green Transformation) policy mandating ammonia co-firing at 20% in coal power plants by 2030 &#8594; ONGC expanding blue ammonia capacity from 200,000t to 600,000t/year &#8594; CO2 captured and piped to ONGC Mumbai High for enhanced oil recovery' },
]

const filters = [
  { label: 'Ammonia Type', key: 'ammoniaType', options: ['Green NH3 (Electrolysis)', 'Blue NH3 (SMR+CCS)', 'Turquoise NH3 (Methane Pyrolysis)', 'Green NH3 (Solid Oxide)', 'Blue NH3 (ATR+CCS)', 'Green NH3 (Biomass Gasification)', 'Green NH3 (Anion Exchange)', 'Green NH3 (Pipeline)', 'Turquoise NH3 (Plasma)', 'Blue NH3 (Partial Oxidation)'] },
  { label: 'Carrier', key: 'carrier', options: ['Adani Green Gas', 'NTPC Green', 'IOC Green Energy', 'GAIL Green', 'L&T Green Hydrogen', 'AM Green Agri', 'Tata Chemicals', 'JSW Green Energy', 'ReNew Green Molecules', 'Reliance Green'] },
  { label: 'Zone', key: 'zone', options: ['North', 'South', 'East', 'West'] },
  { label: 'Status', key: 'status', options: ['In Transit', 'Delivered', 'Processing', 'Delayed'] },
]

export default function GreenAmmoniaShippingLogisticsView() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'registry' | 'analytics' | 'insights'>('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const toggleFilter = (key: string, value: string) => {
    setActiveFilters(prev => {
      const current = prev[key] || []
      if (current.includes(value)) {
        const next = current.filter(v => v !== value)
        if (next.length === 0) { const { [key]: _, ...rest } = prev; return rest }
        return { ...prev, [key]: next }
      }
      return { ...prev, [key]: [...current, value] }
    })
  }

  const filteredRecords = useMemo(() => {
    return greenAmmoniaRecords.filter(r => {
      if (searchQuery && !`${r.id} ${r.voyageId} ${r.ammoniaType} ${r.carrier} ${r.vessel} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false
      for (const [key, values] of Object.entries(activeFilters)) {
        if (values.length > 0 && !values.includes(String(r[key as keyof GreenAmmoniaShippingRecord]))) return false
      }
      return true
    })
  }, [searchQuery, activeFilters])

  const kpis = useMemo(() => {
    const total = greenAmmoniaRecords.length
    const totalVolume = greenAmmoniaRecords.reduce((s: number, r) => s + r.volumeMT, 0)
    const totalInvestment = greenAmmoniaRecords.reduce((s: number, r) => s + r.investmentCr, 0)
    const delayed = greenAmmoniaRecords.filter(r => r.status === 'Delayed').length
    return [
      { label: 'Total Voyages', value: total, suffix: ' shipments', color: 'text-cyan-700' },
      { label: 'Total Volume', value: `${(totalVolume / 1000).toFixed(0)}K`, suffix: ' MT', color: 'text-cyan-700' },
      { label: 'Total Investment', value: `${(totalInvestment / 1000).toFixed(1)}K`, suffix: ' Cr', color: 'text-cyan-700' },
      { label: 'Delayed', value: delayed, suffix: ' voyages', color: 'text-red-600' },
    ]
  }, [])

  const typeDistribution = useMemo(() => {
    const map = new Map<string, number>()
    greenAmmoniaRecords.forEach(r => { const k = r.ammoniaType.split('(')[0].trim(); map.set(k, (map.get(k) || 0) + 1) })
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1])
  }, [])

  const carrierVolume = useMemo(() => {
    const map: Record<string, number> = {}
    greenAmmoniaRecords.forEach(r => { map[r.carrier] = (map[r.carrier] || 0) + r.volumeMT })
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 8)
  }, [])

  const destinationMap = useMemo(() => {
    const map = new Map<string, number>()
    greenAmmoniaRecords.forEach(r => { map.set(r.destination.split('(')[0].trim(), (map.get(r.destination.split('(')[0].trim()) || 0) + 1) })
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8)
  }, [])

  const statusBreakdown = useMemo(() => {
    const map = new Map<string, number>()
    greenAmmoniaRecords.forEach(r => { map.set(r.status, (map.get(r.status) || 0) + 1) })
    return Array.from(map.entries())
  }, [])

  const zoneVolume = useMemo(() => {
    const map: Record<string, number> = {}
    greenAmmoniaRecords.forEach(r => { map[r.zone] = (map[r.zone] || 0) + r.volumeMT })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const energyByType = useMemo(() => {
    const map: Record<string, number> = {}
    const cnt: Record<string, number> = {}
    greenAmmoniaRecords.forEach(r => { const k = r.ammoniaType.split('(')[0].trim(); map[k] = (map[k] || 0) + r.energyDensityKWh; cnt[k] = (cnt[k] || 0) + 1 })
    return (Object.entries(map) as [string, number][]).map(([k, v]) => [k, Math.round(v / cnt[k])] as [string, number]).sort((a, b) => b[1] - a[1])
  }, [])

  const transitByCarrier = useMemo(() => {
    const map: Record<string, number> = {}
    const cnt: Record<string, number> = {}
    greenAmmoniaRecords.forEach(r => { map[r.carrier] = (map[r.carrier] || 0) + r.transitDays; cnt[r.carrier] = (cnt[r.carrier] || 0) + 1 })
    return (Object.entries(map) as [string, number][]).map(([k, v]) => [k, Math.round(v / cnt[k])] as [string, number]).sort((a, b) => b[1] - a[1])
  }, [])

  const tabs = ['dashboard', 'registry', 'analytics', 'insights'] as const

  return (
    <div className="space-y-4 p-4">
      <PageHeader title="Green Ammonia Shipping Logistics" description="Indian green ammonia export and domestic shipping &#8212; Electrolysis green, SMR+CCS blue, methane pyrolysis turquoise NH3 for maritime, fertilizer, and hydrogen carrier applications" />

      <div className="flex gap-2 border-b pb-2">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 text-sm rounded-t-lg capitalize gasl-tab-btn ${activeTab === tab ? 'bg-cyan-700 text-white gasl-tab-active' : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100'}`}>{tab}</button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {kpis.map(kpi => <Card key={kpi.label} className="gasl-kpi-card border-l-4 border-l-cyan-600"><CardContent className="p-3"><p className="text-xs text-muted-foreground">{kpi.label}</p><p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}<span className="text-xs font-normal ml-1">{kpi.suffix}</span></p></CardContent></Card>)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="gasl-chart-card"><CardHeader><CardTitle className="text-sm">Shipments by Ammonia Type</CardTitle></CardHeader><CardContent className="space-y-2">{typeDistribution.map(([type, count]) => <div key={type} className="flex items-center gap-2"><span className="text-xs w-32 truncate">{type}</span><div className="flex-1 bg-cyan-50 rounded-full h-2"><div className="bg-cyan-600 h-2 rounded-full gasl-bar" style={{ width: `${(count / 6) * 100}%` }}></div></div><span className="text-xs font-medium">{count}</span></div>)}</CardContent></Card>
            <Card className="gasl-chart-card"><CardHeader><CardTitle className="text-sm">Volume by Zone (MT)</CardTitle></CardHeader><CardContent className="space-y-2">{zoneVolume.map(([zone, vol]) => <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-cyan-50 rounded-full h-2"><div className="bg-cyan-500 h-2 rounded-full gasl-bar" style={{ width: `${(vol / 100000) * 100}%` }}></div></div><span className="text-xs font-medium">{(vol / 1000).toFixed(0)}K</span></div>)}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Input placeholder="Search voyage, carrier, vessel, port..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="h-8 text-sm gasl-search-input" />
            {filters.map(f => (
              <div key={f.key} className="flex gap-1 flex-wrap gasl-filter-group">
                {f.options.slice(0, 4).map(opt => (
                  <Badge key={opt} variant={activeFilters[f.key]?.includes(opt) ? 'default' : 'outline'} className="cursor-pointer text-xs gasl-filter-badge" onClick={() => toggleFilter(f.key, opt)}>{opt.split('(')[0].trim()}</Badge>
                ))}
              </div>
            ))}
          </div>
          <div className="overflow-x-auto gasl-table-wrap">
            <table className="w-full text-xs gasl-data-table">
              <thead><tr className="border-b gasl-table-header"><th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Voyage</th><th className="px-2 py-2 text-left">Port</th><th className="px-2 py-2 text-left">Vessel</th><th className="px-2 py-2 text-left">Type</th><th className="px-2 py-2 text-right">Volume (MT)</th><th className="px-2 py-2 text-right">Invest (&#8377; Cr)</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-right">Days</th></tr></thead>
              <tbody>
                {filteredRecords.map(r => (
                  <tr key={r.id} className={`border-b gasl-table-row ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-cyan-500'}`}>
                    <td className="px-2 py-2 font-mono">{r.id}</td>
                    <td className="px-2 py-2">{r.voyageId}</td>
                    <td className="px-2 py-2 truncate max-w-[80px]">{r.port}</td>
                    <td className="px-2 py-2 truncate max-w-[120px]">{r.vessel}</td>
                    <td className="px-2 py-2 truncate max-w-[100px]">{r.ammoniaType.split('(')[0].trim()}</td>
                    <td className="px-2 py-2 text-right font-medium">{r.volumeMT.toLocaleString()}</td>
                    <td className="px-2 py-2 text-right">{r.investmentCr}</td>
                    <td className="px-2 py-2"><Badge variant={r.status === 'Delayed' ? 'destructive' : r.status === 'Delivered' ? 'default' : 'secondary'} className="text-xs gasl-status-badge">{r.status}</Badge></td>
                    <td className="px-2 py-2 truncate max-w-[100px]">{r.origin.split('(')[0].trim().split(' ').slice(-1)[0]} &#8594; {r.destination.split('(')[0].trim()}</td>
                    <td className="px-2 py-2 text-right">{r.transitDays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="gasl-chart-card"><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{statusBreakdown.map(([s, c]) => <div key={s} className="flex items-center gap-2"><span className="text-xs w-20">{s}</span><div className="flex-1 bg-cyan-50 rounded-full h-2"><div className={`h-2 rounded-full gasl-bar ${s === 'Delayed' ? 'bg-red-500' : s === 'Delivered' ? 'bg-green-500' : s === 'In Transit' ? 'bg-blue-500' : 'bg-yellow-500'}`} style={{ width: `${(c / 14) * 100}%` }}></div></div><span className="text-xs font-medium">{c}</span></div>)}</CardContent></Card>
            <Card className="gasl-chart-card"><CardHeader><CardTitle className="text-sm">Top Destinations</CardTitle></CardHeader><CardContent className="space-y-2">{destinationMap.map(([dest, count]) => <div key={dest} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{dest}</span><div className="flex-1 bg-cyan-50 rounded-full h-2"><div className="bg-cyan-600 h-2 rounded-full gasl-bar" style={{ width: `${(count / 4) * 100}%` }}></div></div><span className="text-xs font-medium">{count}</span></div>)}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="gasl-chart-card"><CardHeader><CardTitle className="text-sm">Volume by Carrier (MT)</CardTitle></CardHeader><CardContent className="space-y-2">{carrierVolume.map(([carrier, vol]) => <div key={carrier} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{carrier}</span><div className="flex-1 bg-cyan-50 rounded-full h-2"><div className="bg-cyan-600 h-2 rounded-full gasl-bar" style={{ width: `${(vol / 35000) * 100}%` }}></div></div><span className="text-xs font-medium">{(vol / 1000).toFixed(0)}K</span></div>)}</CardContent></Card>
          <Card className="gasl-chart-card"><CardHeader><CardTitle className="text-sm">Energy Density by Type (kWh/MT)</CardTitle></CardHeader><CardContent className="space-y-2">{energyByType.map(([type, energy]) => <div key={type} className="flex items-center gap-2"><span className="text-xs w-28 truncate">{type}</span><div className="flex-1 bg-cyan-50 rounded-full h-2"><div className="bg-cyan-700 h-2 rounded-full gasl-bar" style={{ width: `${(energy / 5000) * 100}%` }}></div></div><span className="text-xs font-medium">{energy}</span></div>)}</CardContent></Card>
          <Card className="gasl-chart-card"><CardHeader><CardTitle className="text-sm">Avg Transit Days by Carrier</CardTitle></CardHeader><CardContent className="space-y-2">{transitByCarrier.map(([carrier, days]) => <div key={carrier} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{carrier}</span><div className="flex-1 bg-cyan-50 rounded-full h-2"><div className="bg-cyan-500 h-2 rounded-full gasl-bar" style={{ width: `${(days / 25) * 100}%` }}></div></div><span className="text-xs font-medium">{days}d</span></div>)}</CardContent></Card>
          <Card className="gasl-chart-card"><CardHeader><CardTitle className="text-sm">Investment per MT (&#8377; Cr/MT)</CardTitle></CardHeader><CardContent className="space-y-2">{greenAmmoniaRecords.slice(0, 8).map(r => <div key={r.id} className="flex items-center gap-2"><span className="text-xs w-20 truncate">{r.carrier.split(' ')[0]}</span><div className="flex-1 bg-cyan-50 rounded-full h-2"><div className="bg-cyan-400 h-2 rounded-full gasl-bar" style={{ width: `${((r.investmentCr / r.volumeMT) * 100) / 5}%` }}></div></div><span className="text-xs font-medium">{(r.investmentCr / r.volumeMT).toFixed(2)}</span></div>)}</CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="gasl-insight-card border-l-4 border-l-cyan-700"><CardHeader><CardTitle className="text-sm text-cyan-800">India&apos;s Green Ammonia Export Ambition: 10 MTPA by 2035</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">India targeting 10 million tonnes per annum green ammonia exports by 2035 under National Green Hydrogen Mission. Current pipeline: Adani Kandla (1 MTPA), Reliance Jamnagar (2 MTPA turquoise), NTPC Tuticorin (1 MTPA blue), L&T Vizag (500K tpa green), JSPL Angul (500K tpa), JSW Vijaynagar (200K tpa biomass). Combined investment: &#8377;85,000Cr across electrolyzer manufacturing, port storage, and pipeline infrastructure. Key advantage: India&apos;s 300 GW renewable energy potential enables lowest-cost green hydrogen globally at &#8377;180/kg vs &#8377;350/kg in Europe. AM Green and Acme Solar already exporting pilot quantities to Japan and South Korea.</p></CardContent></Card>
          <Card className="gasl-insight-card border-l-4 border-l-cyan-600"><CardHeader><CardTitle className="text-sm text-cyan-800">Ammonia as Hydrogen Carrier: Maritime Revolution</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Green ammonia shipping represents India&apos;s gateway to the global hydrogen economy. Ammonia stores hydrogen at -33&#176;C (vs LNG -162&#176;C or liquid H2 -253&#176;C) &#8594; significantly lower boil-off and energy penalty. Energy density: 4,250 kWh/MT, 108x higher than compressed hydrogen at 700 bar. India&apos;s 7,500 km coastline with 12 major ports provides natural export infrastructure &#8594; Kandla, Dahej, and Dhamra building dedicated 100,000m3 ammonia storage tanks. Singapore, Japan, South Korea, Germany, and UAE as primary importers. Maritime ammonia co-fueling market projected at &#8377;45,000Cr by 2035 &#8594; Cochin Shipyard designing India&apos;s first ammonia-fueled bulk carrier.</p></CardContent></Card>
          <Card className="gasl-insight-card border-l-4 border-l-red-500"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Voyages: GAS-0006 and GAS-0012</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">GAS-0006 (Haldia to Kakinada, 7-day delay): barge ballast pump failure in Hooghly River estuary &#8594; silty water ingress damaged pump seals &#8594; replacement barge dispatched from Kolkata but facing monsoon headwinds &#8594; IFFCO Kakinada urea plant fertilizer production affected at 200t/day &#8594; &#8377;12Cr revenue loss. GAS-0012 (Dahej to Pohang, 16-day delay): Reliance Jamnagar plasma reactor 30kW torch electrode replacement &#8594; plasma methane pyrolysis at 1,500&#176;C requires specialized tungsten-copper electrodes imported from Germany &#8594; spare procurement took 12 days &#8594; POSCO Pohang DRI plant facing green hydrogen shortage &#8594; daily penalty &#8377;3.5Cr &#8594; cumulative &#8377;56Cr exposure.</p></CardContent></Card>
          <Card className="gasl-insight-card border-l-4 border-l-cyan-500"><CardHeader><CardTitle className="text-sm text-cyan-700">Turquoise Ammonia: Monolith Plasma Technology in India</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Reliance Jamnagar and GAIL Hazira are pioneering turquoise ammonia production in India via methane pyrolysis. Unlike green electrolysis (water &#8594; H2 + O2), methane pyrolysis cracks natural gas (CH4 &#8594; C + 2H2) without CO2 emissions &#8594; solid carbon black byproduct has commercial value in tire, ink, and battery industries at &#8377;45/kg. Reliance licensed Monolith&apos;s plasma torch technology for 2 MTPA turquoise ammonia plant &#8594; world&apos;s largest when complete in 2029. Energy density slightly lower at 4,100-4,200 kWh/MT vs electrolysis green NH3 at 4,300+ due to methane impurities. Key advantage: leverages India&apos;s existing natural gas pipeline infrastructure without requiring new renewable capacity.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
