'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Hammer } from 'lucide-react'

interface TitaniumAlloyRecord {
  id: string
  batchNo: string
  city: string
  facility: string
  alloyGrade: string
  application: string
  tensileStrengthMPa: number
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

const titaniumAlloyRecords: TitaniumAlloyRecord[] = [
  { id: 'TAL-0001', batchNo: 'TAL-B2401', city: 'Bengaluru', facility: 'HAL Aerospace Forge', alloyGrade: 'Ti-6Al-4V', application: 'LCA Tejas Airframe', tensileStrengthMPa: 950, densityGcc: 4.43, investmentCr: 420, status: 'In Transit', priority: 'Critical', origin: 'MIDC Bengaluru (HAL)', destination: 'Bengaluru (ADA)', shipDate: '2026-07-22', transitDays: 1, zone: 'South', remarks: 'Ti-6Al-4V ELI forged wing spar blanks for Tejas Mk1A &#8594; &#8377;420Cr consignment &#8594; 950MPa UTS meets AMS 4911. HAL forging 200 blanks on 10,000T hydraulic press &#8594; ADA requires 800 spares annually for LCA production line at &#8377;65Cr/unit' },
  { id: 'TAL-0002', batchNo: 'TAL-B2402', city: 'Hyderabad', facility: 'Mishra Dhatu Nigam', alloyGrade: 'Ti-6Al-4V', application: 'Ariane Rocket Nozzle', tensileStrengthMPa: 895, densityGcc: 4.43, investmentCr: 310, status: 'Delivered', priority: 'Critical', origin: 'MIDC Hyderabad (MIDHANI)', destination: 'Sriharikota (ISRO)', shipDate: '2026-07-18', transitDays: 2, zone: 'South', remarks: 'MIDHANI supplied Ti-6Al-4V rocket nozzle extension for GSLV Mk-III &#8594; ISRO qualifying 3D-printed titanium variant &#8594; 40% weight reduction vs Inconel &#8594; &#8377;310Cr batch covering 12 nozzle assemblies &#8594; MIDHANI expanding TIMET joint venture capacity' },
  { id: 'TAL-0003', batchNo: 'TAL-B2403', city: 'Mumbai', facility: 'BARC Nuclear Division', alloyGrade: 'Ti-5Al-2.5Sn', application: 'PHWR Reactor Internals', tensileStrengthMPa: 830, densityGcc: 4.48, investmentCr: 285, status: 'Processing', priority: 'High', origin: 'BARC Trombay (DAE)', destination: 'Kakrapar (NPCIL)', shipDate: '2026-07-24', transitDays: 3, zone: 'West', remarks: 'Alpha titanium Ti-5Al-2.5Sn for PHWR coolant channel internals &#8594; superior corrosion resistance in hot heavy water &#8594; BARC developed indigenous sponge titanium route reducing cost 60% &#8594; &#8377;285Cr for Kakrapar Unit-3 and -4 &#8594; NPCIL ordering 200t over 3 years' },
  { id: 'TAL-0004', batchNo: 'TAL-B2404', city: 'Coimbatore', facility: 'Lakshmi Machine Works', alloyGrade: 'Ti-3Al-8V-6Cr-4Mo-4Zr', application: 'Aero Engine Compressor Blade', tensileStrengthMPa: 1100, densityGcc: 4.52, investmentCr: 540, status: 'In Transit', priority: 'Critical', origin: 'LMW Coimbatore (HAL sub)', destination: 'Koraput (HAL Engine)', shipDate: '2026-07-20', transitDays: 3, zone: 'South', remarks: 'Near-beta Ti-Beta-21S compressor blades for Adour Mk811 engine overhaul &#8594; 1100MPa UTS with 300&#176;C creep resistance &#8594; LMW imported 5-axis CNC from Germany &#8594; &#8377;540Cr for 600 blades &#8594; HAL Koraput depot level overhaul capacity 50 engines/year' },
  { id: 'TAL-0005', batchNo: 'TAL-B2405', city: 'Ranchi', facility: 'SAIL Alloy Steel Plant', alloyGrade: 'Ti-6Al-7Nb', application: 'Orthopedic Hip Implant', tensileStrengthMPa: 900, densityGcc: 4.41, investmentCr: 180, status: 'Delivered', priority: 'High', origin: 'SASP Ranchi (SAIL)', destination: 'Chennai (Stryker India)', shipDate: '2026-07-17', transitDays: 4, zone: 'East', remarks: 'Ti-6Al-7Nb biomedical alloy replacing CoCr in hip stems &#8594; vanadium-free eliminates allergic reactions &#8594; SAIL scaling from 50t to 200t annual biomedical titanium &#8594; &#8377;180Cr for 5,000 hip stems &#8594; Stryker and Zimmer Biomet qualifying ASP as India&apos;s first Ti-6Al-7Nb source' },
  { id: 'TAL-0006', batchNo: 'TAL-B2406', city: 'Vishakapatnam', facility: 'HSL Shipyard Forge', alloyGrade: 'Ti-6Al-4V', application: 'Submarine Pressure Hull', tensileStrengthMPa: 950, densityGcc: 4.43, investmentCr: 680, status: 'Delayed', priority: 'Critical', origin: 'HSL Vizag (IN)', destination: 'Mazagon (MDL)', shipDate: '2026-07-12', transitDays: 8, zone: 'South', remarks: 'Ti-6Al-4V plate for Scorpene-class pressure hull penetration sleeves &#8594; 8-day delay due to custom 150mm thick plate rolling at SAIL Rourkela &#8594; MDL urgently needs 48 sleeves for Kalvari-class hull welding &#8594; &#8377;680Cr order &#8594; Navy adding titanium components in next-generation SSN program' },
  { id: 'TAL-0007', batchNo: 'TAL-B2407', city: 'Ahmedabad', facility: 'Torrent Pharmaceuticals', alloyGrade: 'CP Grade 4', application: 'Pharma Reactor Vessel', tensileStrengthMPa: 550, densityGcc: 4.51, investmentCr: 95, status: 'Processing', priority: 'Medium', origin: 'Vatva Ahmedabad (Torrent)', destination: 'Dahej SEZ (API Maker)', shipDate: '2026-07-23', transitDays: 1, zone: 'West', remarks: 'Commercially pure Grade 4 titanium reactor vessel for API synthesis &#8594; exceptional chloride corrosion resistance &#8594; replacing Hastelloy C-276 at 30% lower cost &#8594; &#8377;95Cr for 8 vessels &#8594; Torrent qualifying titanium for GMP-grade acid chloride reactions &#8594; 20-year vessel life vs 12 for Hastelloy' },
  { id: 'TAL-0008', batchNo: 'TAL-B2408', city: 'New Delhi', facility: 'DRDO DMRL', alloyGrade: 'Ti-6Al-2Sn-4Zr-2Mo', application: 'AMCA Fighter Airframe', tensileStrengthMPa: 985, densityGcc: 4.54, investmentCr: 890, status: 'In Transit', priority: 'Critical', origin: 'DRDO Hyderabad (DMRL)', destination: 'ADA Bengaluru (AMCA)', shipDate: '2026-07-21', transitDays: 2, zone: 'North', remarks: 'High-temperature Ti-6242 for AMCA 5th-gen fighter rear fuselage bulkheads &#8594; DMRL developed vacuum arc remelting process for 4-ton ingots &#8594; 985MPa UTS at 500&#176;C &#8594; &#8377;890Cr for prototype structural test articles &#8594; AMCA titanium share 20% by weight &#8594; first flight targeted 2028' },
  { id: 'TAL-0009', batchNo: 'TAL-B2409', city: 'Kolkata', facility: 'IIT Kharagpur Research', alloyGrade: 'Ti-48Al-2Cr-2Nb', application: 'Turbocharger Turbine Wheel', tensileStrengthMPa: 780, densityGcc: 3.91, investmentCr: 145, status: 'Delivered', priority: 'High', origin: 'IIT KGP (Met Engg)', destination: 'Pune (Cummins Turbo)', shipDate: '2026-07-16', transitDays: 3, zone: 'East', remarks: 'Gamma TiAl intermetallic turbocharger wheel &#8594; 45% lighter than Inconel 713C &#8594; IIT KGP powder metallurgy route eliminates forging &#8594; &#8377;145Cr for 2,000 wheels &#8594; Cummins testing for Bharat Stage VI truck engines &#8594; 15% faster spool-up improving fuel economy 3%' },
  { id: 'TAL-0010', batchNo: 'TAL-B2410', city: 'Thiruvananthapuram', facility: 'VSSC ISRO Titanium', alloyGrade: 'Ti-6Al-4V', application: 'Satellite Propellant Tank', tensileStrengthMPa: 950, densityGcc: 4.43, investmentCr: 265, status: 'In Transit', priority: 'High', origin: 'VSSC (ISRO)', destination: 'ISAC Bengaluru (ISRO)', shipDate: '2026-07-19', transitDays: 2, zone: 'South', remarks: 'Spin-formed titanium propellant tank for GSAT-N2 communication satellite &#8594; 500mm diameter 3mm wall &#8594; VSSC developed flow-forming tech reducing weld joints from 8 to 1 &#8594; &#8377;265Cr for 6 tanks &#8594; ISRO targeting all-titanium tank fleet by 2028 replacing stainless steel &#8594; 40% mass saving per satellite' },
  { id: 'TAL-0011', batchNo: 'TAL-B2411', city: 'Chennai', facility: 'IIT Madras Metallurgy', alloyGrade: 'Ti-Nb-Zr-Sn', application: 'Bio-compatible Bone Screw', tensileStrengthMPa: 720, densityGcc: 4.30, investmentCr: 110, status: 'Processing', priority: 'Medium', origin: 'IIT-M (Met Lab)', destination: 'Chennai (Polymed India)', shipDate: '2026-07-25', transitDays: 1, zone: 'South', remarks: 'Low-modulus beta titanium Ti-Nb-Zr-Sn (TNZS) for cortical bone screws &#8594; elastic modulus 55GPa closer to bone 18GPa reducing stress shielding &#8594; IIT-M additively manufacturing patient-specific screws &#8594; &#8377;110Cr pilot for 500 screws &#8594; DCGI approval expected Q1 2027 &#8594; Polymed planning &#8377;450Cr commercial scale by 2028' },
  { id: 'TAL-0012', batchNo: 'TAL-B2412', city: 'Nagpur', facility: 'MIHAN Aerospace Park', alloyGrade: 'Ti-10V-2Fe-3Al', application: 'Landing Gear Actuator Rod', tensileStrengthMPa: 1240, densityGcc: 4.65, investmentCr: 510, status: 'In Transit', priority: 'Critical', origin: 'MIHAN Nagpur (Boeing JV)', destination: 'Hyderabad (Boeing India)', shipDate: '2026-07-20', transitDays: 2, zone: 'West', remarks: 'High-strength beta Ti-10-2-3 landing gear actuator for Boeing 737 MAX &#8594; 1240MPa UTS with excellent fracture toughness &#8594; Boeing-Tata joint venture at MIHAN forging 3,000 rods/year &#8594; &#8377;510Cr order &#8594; replacing 4340 steel with 40% weight saving &#8594; FAA and DGCA dual certification' },
  { id: 'TAL-0013', batchNo: 'TAL-B2413', city: 'Jaipur', facility: 'RajasthanRare Earth Ltd', alloyGrade: 'CP Grade 2', application: 'Solar Desalination Panel', tensileStrengthMPa: 345, densityGcc: 4.51, investmentCr: 75, status: 'Delivered', priority: 'Low', origin: 'Udaipur (Raj Rare Earth)', destination: 'Jodhpur (PHED)', shipDate: '2026-07-15', transitDays: 2, zone: 'North', remarks: 'Commercially pure Grade 2 titanium absorber plates for solar thermal desalination &#8594; 20% higher thermal conductivity than copper in saline environment &#8594; zero corrosion in 20-year exposure test &#8594; &#8377;75Cr for 200 panels supplying 100KL/day fresh water &#8594; Rajasthan PHED scaling across 12 desert districts &#8594; NITI Aayog pilot under Jal Jeevan Mission' },
  { id: 'TAL-0014', batchNo: 'TAL-B2414', city: 'Pune', facility: 'Tata Advanced Systems', alloyGrade: 'Ti-6Al-4V ELI', application: 'Artillery Gun Barrel Liner', tensileStrengthMPa: 895, densityGcc: 4.43, investmentCr: 340, status: 'Delayed', priority: 'Critical', origin: 'TASL Pune (DRDO)', destination: 'Khamaria OFB (Ordnance)', shipDate: '2026-07-10', transitDays: 12, zone: 'West', remarks: 'Ti-6Al-4V ELI barrel liner for 155mm Bofors howitzer upgrade &#8594; 12-day delay: MIDHANI ingot quality issue &#8594; oxygen content 0.22% exceeded 0.20% spec &#8594; ingot re-melted at extra &#8377;18Cr &#8594; &#8377;340Cr total for 120 liners &#8594; DRDO targeting 50% lighter howitzer barrel &#8594; Ordnance Factory Khamria awaiting urgent Army order' },
]

const filters = [
  { label: 'Alloy Grade', key: 'alloyGrade', options: ['Ti-6Al-4V', 'Ti-6Al-7Nb', 'Ti-5Al-2.5Sn', 'CP Grade 4', 'CP Grade 2', 'Ti-3Al-8V-6Cr-4Mo-4Zr', 'Ti-6Al-2Sn-4Zr-2Mo', 'Ti-48Al-2Cr-2Nb', 'Ti-Nb-Zr-Sn', 'Ti-10V-2Fe-3Al', 'Ti-6Al-4V ELI'] },
  { label: 'Application', key: 'application', options: ['Aero Engine Compressor Blade', 'Ariane Rocket Nozzle', 'Artillery Gun Barrel Liner', 'Bio-compatible Bone Screw', 'Hip Implant', 'Landing Gear Actuator Rod', 'LCA Tejas Airframe', 'Satellite Propellant Tank', 'Solar Desalination Panel', 'Submarine Pressure Hull', 'Turbocharger Turbine Wheel'] },
  { label: 'Zone', key: 'zone', options: ['North', 'South', 'East', 'West'] },
  { label: 'Status', key: 'status', options: ['In Transit', 'Delivered', 'Processing', 'Delayed'] },
]

export default function TitaniumAlloyLogisticsView() {
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
    return titaniumAlloyRecords.filter(r => {
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.alloyGrade} ${r.application} ${r.origin} ${r.destination} ${r.facility}`.toLowerCase().includes(searchQuery.toLowerCase())) return false
      for (const [key, values] of Object.entries(activeFilters)) {
        if (values.length > 0 && !values.includes(String(r[key as keyof TitaniumAlloyRecord]))) return false
      }
      return true
    })
  }, [searchQuery, activeFilters])

  const kpis = useMemo(() => {
    const total = titaniumAlloyRecords.length
    const totalInvestment = titaniumAlloyRecords.reduce((s: number, r) => s + r.investmentCr, 0)
    const avgStrength = Math.round(titaniumAlloyRecords.reduce((s: number, r) => s + r.tensileStrengthMPa, 0) / total)
    const delayed = titaniumAlloyRecords.filter(r => r.status === 'Delayed').length
    return [
      { label: 'Total Shipments', value: total, suffix: ' batches', color: 'text-slate-700' },
      { label: 'Total Investment', value: `${(totalInvestment / 1000).toFixed(1)}K`, suffix: ` Cr`, color: 'text-slate-700' },
      { label: 'Avg Tensile Strength', value: avgStrength, suffix: ' MPa', color: 'text-slate-700' },
      { label: 'Delayed', value: delayed, suffix: ' batches', color: 'text-red-600' },
    ]
  }, [])

  const gradeDistribution = useMemo(() => {
    const map = new Map<string, number>()
    titaniumAlloyRecords.forEach(r => { const k = r.alloyGrade.split('-').slice(0, 2).join('-'); map.set(k, (map.get(k) || 0) + 1) })
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1])
  }, [])

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>()
    titaniumAlloyRecords.forEach(r => { map.set(r.zone, (map.get(r.zone) || 0) + 1) })
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1])
  }, [])

  const appDistribution = useMemo(() => {
    const map = new Map<string, number>()
    titaniumAlloyRecords.forEach(r => { map.set(r.application.split(' ')[0], (map.get(r.application.split(' ')[0]) || 0) + 1) })
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8)
  }, [])

  const investmentByZone = useMemo(() => {
    const map: Record<string, number> = {}
    titaniumAlloyRecords.forEach(r => { map[r.zone] = (map[r.zone] || 0) + r.investmentCr })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const strengthByGrade = useMemo(() => {
    const map: Record<string, number> = {}
    titaniumAlloyRecords.forEach(r => { const k = r.alloyGrade.split('-').slice(0, 2).join('-'); map[k] = (map[k] || 0) + r.tensileStrengthMPa })
    const count: Record<string, number> = {}
    titaniumAlloyRecords.forEach(r => { const k = r.alloyGrade.split('-').slice(0, 2).join('-'); count[k] = (count[k] || 0) + 1 })
    return (Object.entries(map) as [string, number][]).map(([k, v]) => [k, Math.round(v / count[k])] as [string, number]).sort((a, b) => b[1] - a[1])
  }, [])

  const statusBreakdown = useMemo(() => {
    const map = new Map<string, number>()
    titaniumAlloyRecords.forEach(r => { map.set(r.status, (map.get(r.status) || 0) + 1) })
    return Array.from(map.entries())
  }, [])

  const transitByZone = useMemo(() => {
    const map: Record<string, number> = {}
    const cnt: Record<string, number> = {}
    titaniumAlloyRecords.forEach(r => { map[r.zone] = (map[r.zone] || 0) + r.transitDays; cnt[r.zone] = (cnt[r.zone] || 0) + 1 })
    return (Object.entries(map) as [string, number][]).map(([k, v]) => [k, Math.round(v / cnt[k])] as [string, number]).sort((a, b) => b[1] - a[1])
  }, [])

  const tabs = ['dashboard', 'registry', 'analytics', 'insights'] as const

  return (
    <div className="space-y-4 p-4">
      <PageHeader title="Titanium Alloy Logistics" description="Indian titanium alloy supply chain &#8212; Ti-6Al-4V, Ti-6Al-7Nb, TiAl intermetallic for aerospace, defence, biomedical, nuclear and marine applications" />

      <div className="flex gap-2 border-b pb-2">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 text-sm rounded-t-lg capitalize tal-tab-btn ${activeTab === tab ? 'bg-slate-700 text-white tal-tab-active' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{tab}</button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {kpis.map(kpi => <Card key={kpi.label} className="tal-kpi-card border-l-4 border-l-slate-600"><CardContent className="p-3"><p className="text-xs text-muted-foreground">{kpi.label}</p><p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}<span className="text-xs font-normal ml-1">{kpi.suffix}</span></p></CardContent></Card>)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="tal-chart-card"><CardHeader><CardTitle className="text-sm">Shipments by Alloy Grade</CardTitle></CardHeader><CardContent className="space-y-2">{gradeDistribution.map(([grade, count]) => <div key={grade} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{grade}</span><div className="flex-1 bg-slate-100 rounded-full h-2"><div className="bg-slate-600 h-2 rounded-full tal-bar" style={{ width: `${(count / 14) * 100}%` }}></div></div><span className="text-xs font-medium">{count}</span></div>)}</CardContent></Card>
            <Card className="tal-chart-card"><CardHeader><CardTitle className="text-sm">Investment by Zone (&#8377; Cr)</CardTitle></CardHeader><CardContent className="space-y-2">{investmentByZone.map(([zone, inv]) => <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-slate-100 rounded-full h-2"><div className="bg-slate-500 h-2 rounded-full tal-bar" style={{ width: `${(inv / 5000) * 100}%` }}></div></div><span className="text-xs font-medium">{inv}</span></div>)}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Input placeholder="Search ID, batch, grade, facility..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="h-8 text-sm tal-search-input" />
            {filters.map(f => (
              <div key={f.key} className="flex gap-1 flex-wrap tal-filter-group">
                {f.options.slice(0, 4).map(opt => (
                  <Badge key={opt} variant={activeFilters[f.key]?.includes(opt) ? 'default' : 'outline'} className="cursor-pointer text-xs tal-filter-badge" onClick={() => toggleFilter(f.key, opt)}>{opt}</Badge>
                ))}
              </div>
            ))}
          </div>
          <div className="overflow-x-auto tal-table-wrap">
            <table className="w-full text-xs tal-data-table">
              <thead><tr className="border-b tal-table-header"><th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Batch</th><th className="px-2 py-2 text-left">Facility</th><th className="px-2 py-2 text-left">Alloy</th><th className="px-2 py-2 text-left">Application</th><th className="px-2 py-2 text-right">UTS (MPa)</th><th className="px-2 py-2 text-right">Invest (&#8377; Cr)</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-right">Days</th></tr></thead>
              <tbody>
                {filteredRecords.map(r => (
                  <tr key={r.id} className={`border-b tal-table-row ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-slate-500'}`}>
                    <td className="px-2 py-2 font-mono">{r.id}</td>
                    <td className="px-2 py-2">{r.batchNo}</td>
                    <td className="px-2 py-2 truncate max-w-[120px]">{r.facility}</td>
                    <td className="px-2 py-2 truncate max-w-[100px]">{r.alloyGrade.split('-').slice(0, 3).join('-')}</td>
                    <td className="px-2 py-2 truncate max-w-[120px]">{r.application}</td>
                    <td className="px-2 py-2 text-right font-medium">{r.tensileStrengthMPa}</td>
                    <td className="px-2 py-2 text-right">{r.investmentCr}</td>
                    <td className="px-2 py-2"><Badge variant={r.status === 'Delayed' ? 'destructive' : r.status === 'Delivered' ? 'default' : 'secondary'} className="text-xs tal-status-badge">{r.status}</Badge></td>
                    <td className="px-2 py-2 truncate max-w-[100px]">{r.origin.split('(')[0].trim().split(' ').slice(-1)[0]} &#8594; {r.destination.split('(')[0].trim().split(' ').slice(-1)[0]}</td>
                    <td className="px-2 py-2 text-right">{r.transitDays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="tal-chart-card"><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{statusBreakdown.map(([s, c]) => <div key={s} className="flex items-center gap-2"><span className="text-xs w-20">{s}</span><div className="flex-1 bg-slate-100 rounded-full h-2"><div className={`h-2 rounded-full tal-bar ${s === 'Delayed' ? 'bg-red-500' : s === 'Delivered' ? 'bg-green-500' : s === 'In Transit' ? 'bg-blue-500' : 'bg-yellow-500'}`} style={{ width: `${(c / 14) * 100}%` }}></div></div><span className="text-xs font-medium">{c}</span></div>)}</CardContent></Card>
            <Card className="tal-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{zoneDistribution.map(([zone, count]) => <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-slate-100 rounded-full h-2"><div className="bg-slate-600 h-2 rounded-full tal-bar" style={{ width: `${(count / 14) * 100}%` }}></div></div><span className="text-xs font-medium">{count}</span></div>)}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="tal-chart-card"><CardHeader><CardTitle className="text-sm">Avg Tensile Strength by Grade (MPa)</CardTitle></CardHeader><CardContent className="space-y-2">{strengthByGrade.map(([grade, str]) => <div key={grade} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{grade}</span><div className="flex-1 bg-slate-100 rounded-full h-2"><div className="bg-slate-700 h-2 rounded-full tal-bar" style={{ width: `${(str / 1300) * 100}%` }}></div></div><span className="text-xs font-medium">{str}</span></div>)}</CardContent></Card>
          <Card className="tal-chart-card"><CardHeader><CardTitle className="text-sm">Application Sector Split</CardTitle></CardHeader><CardContent className="space-y-2">{appDistribution.map(([app, count]) => <div key={app} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{app}</span><div className="flex-1 bg-slate-100 rounded-full h-2"><div className="bg-slate-500 h-2 rounded-full tal-bar" style={{ width: `${(count / 4) * 100}%` }}></div></div><span className="text-xs font-medium">{count}</span></div>)}</CardContent></Card>
          <Card className="tal-chart-card"><CardHeader><CardTitle className="text-sm">Avg Transit Days by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{transitByZone.map(([zone, days]) => <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-slate-100 rounded-full h-2"><div className="bg-slate-600 h-2 rounded-full tal-bar" style={{ width: `${(days / 8) * 100}%` }}></div></div><span className="text-xs font-medium">{days}d</span></div>)}</CardContent></Card>
          <Card className="tal-chart-card"><CardHeader><CardTitle className="text-sm">Density Comparison (g/cc)</CardTitle></CardHeader><CardContent className="space-y-2">{titaniumAlloyRecords.slice(0, 8).map(r => <div key={r.id} className="flex items-center gap-2"><span className="text-xs w-20 truncate">{r.alloyGrade.split('-').slice(0, 2).join('-')}</span><div className="flex-1 bg-slate-100 rounded-full h-2"><div className="bg-slate-400 h-2 rounded-full tal-bar" style={{ width: `${(r.densityGcc / 5) * 100}%` }}></div></div><span className="text-xs font-medium">{r.densityGcc}</span></div>)}</CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="tal-insight-card border-l-4 border-l-slate-700"><CardHeader><CardTitle className="text-sm text-slate-800">MIDHANI: India&apos;s Titanium Backbone</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Mishra Dhatu Nigam (MIDHANI) Hyderabad remains India&apos;s sole integrated titanium producer with sponge-to-finished-product capability. Current capacity: 500t/year titanium sponge expanding to 1,200t by 2028 under &#8377;2,800Cr expansion. MIDHANI supplied Ti-6Al-4V for ISRO rocket nozzles (TAL-0002), and is now developing Ti-6242 for AMCA fighter program. Critical bottleneck: India imports 70% of titanium sponge from Ukraine and Japan &#8594; MIDHANI expansion reduces strategic vulnerability. Joint venture with TIMET (USA) for aerospace-grade billets approved &#8594; technology transfer covering VAR and PAM melting processes.</p></CardContent></Card>
          <Card className="tal-insight-card border-l-4 border-l-slate-600"><CardHeader><CardTitle className="text-sm text-slate-800">DRDO DMRL: AMCA Titanium Program</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">DRDO DMRL Hyderabad is developing indigenous high-temperature titanium alloys for the AMCA 5th-gen fighter (TAL-0008). Ti-6242 (Ti-6Al-2Sn-4Zr-2Mo) achieves 985MPa at 500&#176;C for rear fuselage bulkheads &#8594; 20% of AMCA airframe weight will be titanium. DMRL developed 4-ton ingot vacuum arc remelting process, previously imported. Total titanium requirement for AMCA prototype: 800t over 4 years at &#8377;3,600Cr. ADA placed initial order of &#8377;890Cr for structural test articles. First flight target 2028 &#8594; serial production titanium share to reach 25% by 2032.</p></CardContent></Card>
          <Card className="tal-insight-card border-l-4 border-l-red-500"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Consignments: TAL-0006 and TAL-0014</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">TAL-0006 (HSL Vizag to Mazagon, 8-day delay): 150mm thick Ti-6Al-4V plate rolling at SAIL Rourkela failed dimensional tolerance on first attempt &#8594; plate crown exceeded 0.5mm spec &#8594; second rolling pass successful after roll gap adjustment. MDL Mazagon needs 48 penetration sleeves for Kalvari-class submarine hull welding by August deadline &#8594; Navy projected &#8377;2.4Cr/day penalty. TAL-0014 (TASL Pune to Khamaria OFB, 12-day delay): MIDHANI ingot oxygen content 0.22% exceeded 0.20% specification for ELI grade &#8594; ingot triple-remelted at &#8377;18Cr extra cost. Ordnance Factory urgently needs 120 barrel liners for Army&apos;s Bofors howitzer upgrade program.</p></CardContent></Card>
          <Card className="tal-insight-card border-l-4 border-l-slate-500"><CardHeader><CardTitle className="text-sm text-slate-700">IIT-M Low-Modulus TNZS: Bone-Friendly Titanium</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">IIT Madras developed metastable beta titanium Ti-Nb-Zr-Sn (TNZS) with elastic modulus of only 55GPa &#8594; significantly closer to cortical bone (18GPa) than conventional Ti-6Al-4V (110GPa). Lower modulus eliminates stress shielding phenomenon that causes bone resorption around stiff implants. IIT-M uses additively manufactured patient-specific screw geometries via selective laser melting &#8594; &#8377;110Cr pilot for 500 screws. DCGI clinical trial approval expected Q1 2027. Polymed India planning &#8377;450Cr commercial facility by 2028 &#8594; targeting 30,000 screws/year. Indian orthopedic implant market growing 18% CAGR &#8594; TNZS poised to capture premium biomedical titanium segment.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
