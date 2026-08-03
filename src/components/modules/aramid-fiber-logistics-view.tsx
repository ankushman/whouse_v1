'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Layers } from 'lucide-react'

interface AramidFiberRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  fiberType: string
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

const aramidFiberRecords: AramidFiberRecord[] = [
  { id: 'ARF-0001', batchNo: 'ARF-B2401', city: 'Pune', manufacturer: 'Garware Defence', fiberType: 'Para-Aramid Kevlar 29', application: 'CRPF Bulletproof Vest', tensileStrengthMPa: 2860, densityGcc: 1.44, investmentCr: 145, status: 'In Transit', priority: 'Critical', origin: 'Garware Pune (Maharashtra)', destination: 'CRPF Jhansi (UP)', shipDate: '2026-07-22', transitDays: 3, zone: 'West', remarks: 'Garware Defence para-aramid Kevlar 29 woven fabric for CRPF anti-riot body armor &#8594; 2860 MPa tensile 1.44 g/cc &#8594; &#8377;145Cr for 50,000 vest panels &#8594; BIS Level IIIA NIJ certification &#8594; Garware only Indian para-aramid producer &#8594; replacing DuPont Kevlar import saving &#8377;85Cr forex &#8594; CRPF ordering 200,000 vests under MHA modernization' },
  { id: 'ARF-0002', batchNo: 'ARF-B2402', city: 'Bengaluru', manufacturer: 'Hexa Defence Tech', fiberType: 'Meta-Aramid Nomex', application: 'Firefighter turnout gear', tensileStrengthMPa: 690, densityGcc: 1.38, investmentCr: 95, status: 'Delivered', priority: 'High', origin: 'Hexa Bengaluru (Karnataka)', destination: 'Kolkata Fire Dept (WB)', shipDate: '2026-07-18', transitDays: 3, zone: 'South', remarks: 'Meta-aramid Nomex woven fabric for Kolkata firefighter turnout coats &#8594; 690 MPa tensile with LOI 29 &#8594; &#8377;95Cr for 5,000 sets &#8594; thermal resistance up to 370&#176;C continuous &#8594; Hexa Defence licensed by DuPont for Nomex &#8594; Kolkata replacing asbestos-based legacy gear &#8594; NDMA mandating Nomex for all state fire services by 2028' },
  { id: 'ARF-0003', batchNo: 'ARF-B2403', city: 'Chennai', manufacturer: 'SRF Technical Textiles', fiberType: 'Para-Aramid Twaron', application: 'Tyre reinforcement cord', tensileStrengthMPa: 3000, densityGcc: 1.44, investmentCr: 210, status: 'In Transit', priority: 'Critical', origin: 'SRF Chennai (Tamil Nadu)', destination: 'MRF Chennai (Tamil Nadu)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'SRF para-aramid Twaron cord for MRF tyre belt reinforcement &#8594; 3000 MPa highest tensile in Indian production &#8594; &#8377;210Cr for 800 tonnes &#8594; replacing steel belt in radial tyres &#8594; 15% weight reduction improves fuel efficiency 2.5% &#8594; SRF expanding capacity from 500t to 2,000t/year at Manali plant &#8594; MRF and CEAT major customers &#8594; India tyre aramid cord market &#8377;2,500Cr by 2030' },
  { id: 'ARF-0004', batchNo: 'ARF-B2404', city: 'Hyderabad', manufacturer: 'DRDO HEMRL', fiberType: 'Para-Aramid Ultra-HMW', application: 'Blast-resistant vehicle armour', tensileStrengthMPa: 3200, densityGcc: 1.43, investmentCr: 320, status: 'Processing', priority: 'Critical', origin: 'DRDO Pune (HEMRL)', destination: 'Avadi CVRDE (Chennai)', shipDate: '2026-07-25', transitDays: 2, zone: 'South', remarks: 'DRDO HEMRL ultra-high molecular weight para-aramid for ICV blast-resistant floor plates &#8594; 3200 MPa highest-grade Indian aramid &#8594; &#8377;320Cr for BMP-2/3 upgrade kits &#8594; Avadi CVRDE integrating into infantry combat vehicle &#8594; 40% lighter than RHA steel with equivalent STANAG 4569 Level 4 protection &#8594; DRDO scaling to 200t/year at Pune facility &#8594; Army ordering 1,500 vehicle kits worth &#8377;4,800Cr' },
  { id: 'ARF-0005', batchNo: 'ARF-B2405', city: 'Mumbai', manufacturer: 'Teijin Aramid India', fiberType: 'Technora HM Aramid', application: 'Submarine towed array cable', tensileStrengthMPa: 3400, densityGcc: 1.39, investmentCr: 185, status: 'Delivered', priority: 'High', origin: 'Teijin Mumbai JV (Maharashtra)', destination: 'Mazagon Dock (Mumbai)', shipDate: '2026-07-16', transitDays: 1, zone: 'West', remarks: 'Teijin Technora high-modulus aramid for Scorpene submarine towed sonar array jacketing &#8594; 3400 MPa with 1.39 g/cc &#8594; &#8377;185Cr for 200km of cable reinforcement &#8594; superior fatigue resistance for 10-year submerged service &#8594; Teijin-Mazagon joint development replacing polyester braid &#8594; navy ordering cable for all 6 Scorpene-class + 3 Project-75I &#8594; &#8377;1,200Cr total towed array program' },
  { id: 'ARF-0006', batchNo: 'ARF-B2406', city: 'Kanpur', manufacturer: 'IIT Kanpur Spinneret', fiberType: 'Para-Aramid PPTA Lab', application: 'UAV composite spar cap', tensileStrengthMPa: 2650, densityGcc: 1.44, investmentCr: 78, status: 'In Transit', priority: 'High', origin: 'IIT-K (Textile Tech)', destination: 'ADE Bengaluru (DRDO)', shipDate: '2026-07-21', transitDays: 2, zone: 'North', remarks: 'IIT Kanpur lab-scale PPTA para-aramid for Nishant UAV composite wing spar caps &#8594; 2650 MPa lab-grade &#8594; &#8377;78Cr for pilot 500kg fibre batch &#8594; ADE substituting carbon fiber with aramid for bird-strike resilience &#8594; IIT-K developed indigenous p-phenylenediamine route avoiding DuPont patent &#8594; DRDO funding &#8377;120Cr for scale-up to 5t/year pilot plant &#8594; targeting production grade by 2028' },
  { id: 'ARF-0007', batchNo: 'ARF-B2407', city: 'Surat', manufacturer: 'Vardhman Aramid', fiberType: 'Meta-Aramid AP Fiber', application: 'Industrial filtration bag', tensileStrengthMPa: 620, densityGcc: 1.38, investmentCr: 55, status: 'Delivered', priority: 'Medium', origin: 'Vardhman Surat (Gujarat)', destination: 'NTPC Vindhyachal (MP)', shipDate: '2026-07-17', transitDays: 3, zone: 'West', remarks: 'Vardhman meta-aramid needle felt for NTPC Vindhyachal coal-fired boiler bag filter &#8594; 620 MPa acid and alkali resistant &#8594; &#8377;55Cr for 12,000 filter bags &#8594; operating at 180&#176;C flue gas &#8594; replacing fiberglass bags with 3x longer service life &#8594; NTPC mandating aramid bags across 50 GW fleet &#8594; India industrial filtration aramid market &#8377;850Cr by 2028 &#8594; Vardhman targeting 30% market share' },
  { id: 'ARF-0008', batchNo: 'ARF-B2408', city: 'Cochin', manufacturer: 'Kitex-Aramid JV', fiberType: 'Para-Aramid Kevlar KM2', application: 'Helicopter rotor blade edge', tensileStrengthMPa: 3100, densityGcc: 1.44, investmentCr: 245, status: 'Delayed', priority: 'Critical', origin: 'Kitex Cochin (Kerala)', destination: 'HAL Bengaluru (Karnataka)', shipDate: '2026-07-10', transitDays: 12, zone: 'South', remarks: 'Kitex-DuPont JV Kevlar KM2 for HAL Dhruv helicopter rotor blade leading edge protection &#8594; 12-day delay: DuPont quality hold on yarn filament diameter 12 micron vs 11.8 micron spec &#8594; &#8377;245Cr for 3,000 rotor sets &#8594; HAL Dhruv production line idle &#8594; Army aviation losing &#8377;2.8Cr/day &#8594; HAL sourcing emergency lot from Russian SVM &#8594; Kitex JV commissioning new spinneret to meet tighter tolerance' },
  { id: 'ARF-0009', batchNo: 'ARF-B2409', city: 'Ahmedabad', manufacturer: 'Reliance Aramid Tech', fiberType: 'Para-Aramid E-Glass Hybrid', application: 'Wind turbine blade spar', tensileStrengthMPa: 2400, densityGcc: 1.52, investmentCr: 165, status: 'In Transit', priority: 'High', origin: 'Reliance Ahmedabad (Gujarat)', destination: 'Suzlon Pune (Maharashtra)', shipDate: '2026-07-19', transitDays: 1, zone: 'West', remarks: 'Reliance para-aramid E-glass hybrid fabric for Suzlon S128 wind turbine blade spar caps &#8594; 2400 MPa hybrid with 20% lower weight than pure E-glass &#8594; &#8377;165Cr for 400 tonnes &#8594; enabling 80m+ blade length for 4 MW turbines &#8594; Reliance converting PET plant surplus to aramid precursor &#8594; &#8377;45/kg vs imported &#8377;90/kg &#8594; Suzlon ordering 2,000t/year for next-gen turbine &#8594; India wind aramid market &#8377;2,200Cr by 2030' },
  { id: 'ARF-0010', batchNo: 'ARF-B2410', city: 'Lucknow', manufacturer: 'UPTRON Aramid Div', application: 'Optical fiber cable armor', fiberType: 'Meta-Aramid X-Fiber', tensileStrengthMPa: 580, densityGcc: 1.36, investmentCr: 42, status: 'Delivered', priority: 'Medium', origin: 'UPTRON Lucknow (UP)', destination: 'BSNL Lucknow (UP)', shipDate: '2026-07-15', transitDays: 1, zone: 'North', remarks: 'UPTRON meta-aramid X-Fiber sheath for BSNL FTTH optical fiber cable armor &#8594; 580 MPa rodent-proof and moisture resistant &#8594; &#8377;42Cr for 5,000 km cable &#8594; replacing steel wire armor with 30% lighter aramid &#8594; BSNL deploying 500,000 FTTH connections across UP &#8594; UPTRON scaling to 200t/year meta-aramid &#8594; DoT mandating aramid-armored cable for all BharatNet rural fiber &#8594; market &#8377;1,500Cr by 2029' },
  { id: 'ARF-0011', batchNo: 'ARF-B2411', city: 'Visakhapatnam', manufacturer: 'HSL Shipyard Textile', fiberType: 'Para-Aramid Twaron 2200', application: 'Naval vessel hull wrap', tensileStrengthMPa: 2800, densityGcc: 1.44, investmentCr: 275, status: 'Processing', priority: 'Critical', origin: 'Teijin Vizag Depot', destination: 'GRSE Kolkata (West Bengal)', shipDate: '2026-07-24', transitDays: 4, zone: 'South', remarks: 'Twaron 2200 aramid fiber wrap for Indian Navy GSAT corvette hull impact protection &#8594; 2800 MPa para-aramid unidirectional tape &#8594; &#8377;275Cr for 4 vessels &#8594; GRSE applying vacuum-infused aramid sandwich laminate on hull below waterline &#8594; 60% lighter than Kevlar-29 equivalent protection &#8594; Navy qualifying for 25-year hull life without dry-dock repair &#8594; Teijin supplying from Netherlands with Vizag buffer stock &#8594; GRSE ordering for 8 additional corvettes' },
  { id: 'ARF-0012', batchNo: 'ARF-B2412', city: 'Bhopal', manufacturer: 'Eicher Aramid Brake', fiberType: 'Para-Aramid Short Cut', application: 'Brake pad friction material', tensileStrengthMPa: 2400, densityGcc: 1.44, investmentCr: 68, status: 'In Transit', priority: 'Medium', origin: 'Eicher Bhopal (MP)', destination: 'Brembo Pune (Maharashtra)', shipDate: '2026-07-20', transitDays: 2, zone: 'North', remarks: 'Short-cut para-aramid fiber for Eicher truck brake pad friction compound &#8594; 2400 MPa chopped 6mm fiber &#8594; &#8377;68Cr for 120 tonnes &#8594; replacing asbestos in commercial vehicle brakes &#8594; aramid provides 40% higher fade resistance at 350&#176;C vs steel fiber &#8594; Brembo India supplying premium pads using Garware aramid &#8594; India CV brake aramid market &#8377;600Cr by 2028 &#8594; MoRTH banning asbestos in all brake pads from 2027' },
  { id: 'ARF-0013', batchNo: 'ARF-B2413', city: 'Guwahati', manufacturer: 'NE Aramid Products', fiberType: 'Meta-Aramid Needle Felt', application: 'Asbestos cement pipe liner', tensileStrengthMPa: 610, densityGcc: 1.38, investmentCr: 35, status: 'Delivered', priority: 'Low', origin: 'NE Aramid Guwahati (Assam)', destination: 'Assam PWD (Guwahati)', shipDate: '2026-07-14', transitDays: 1, zone: 'East', remarks: 'Meta-aramid needle felt liner for Assam PWD water pipeline rehabilitation &#8594; 610 MPa with chemical resistance &#8594; &#8377;35Cr for 200km of pipe liner &#8594; replacing corroded asbestos-cement pipes in Brahmaputra flood zone &#8594; 30-year design life vs 15 for asbestos &#8594; NE Aramid startup with CSIR-NPL technology transfer &#8594; Assam government &#8377;12Cr subsidy under Jal Jeevan &#8594; targeting 1,000km rural pipeline rehabilitation by 2029' },
  { id: 'ARF-0014', batchNo: 'ARF-B2414', city: 'Jaipur', manufacturer: 'JSL Aramid Aerospace', fiberType: 'Para-Aramid Zylon-PBO Blend', application: 'LCA Tejas radome', tensileStrengthMPa: 3600, densityGcc: 1.56, investmentCr: 195, status: 'Delayed', priority: 'Critical', origin: 'JSL Jaipur (Rajasthan)', destination: 'HAL Bengaluru (Karnataka)', shipDate: '2026-07-09', transitDays: 14, zone: 'North', remarks: 'Zylon-PBO blended para-aramid for Tejas Mk2 AESA radome &#8594; 3600 MPa highest in Indian aramid portfolio &#8594; &#8377;195Cr for 200 radome blanks &#8594; 14-day delay: PBO fiber import from Japan Toyobo held at Nhava Sheva customs &#8594; HAL production halt on Mk2 wing-root radome assembly &#8594; ADA advancing to composite radome qualification &#8594; JSL developing indigenous PBO route to eliminate Japan dependency &#8594; DRDO funding &#8377;350Cr for PBO-Aramid pilot plant at JSL Jaipur' },
]

const filters = [
  { label: 'Fiber Type', key: 'fiberType', options: ['Para-Aramid Kevlar 29', 'Meta-Aramid Nomex', 'Para-Aramid Twaron', 'Para-Aramid Ultra-HMW', 'Technora HM Aramid', 'Para-Aramid PPTA Lab', 'Meta-Aramid AP Fiber', 'Para-Aramid Kevlar KM2', 'Para-Aramid E-Glass Hybrid', 'Meta-Aramid X-Fiber', 'Para-Aramid Twaron 2200', 'Para-Aramid Short Cut', 'Meta-Aramid Needle Felt', 'Para-Aramid Zylon-PBO Blend'] },
  { label: 'Application', key: 'application', options: ['Bulletproof Vest', 'Firefighter gear', 'Tyre cord', 'Vehicle armour', 'Submarine cable', 'UAV spar cap', 'Filtration bag', 'Helicopter blade', 'Wind turbine blade', 'Fiber cable armor', 'Naval hull wrap', 'Brake pad friction', 'Pipe liner', 'Radome'] },
  { label: 'Zone', key: 'zone', options: ['North', 'South', 'East', 'West'] },
  { label: 'Status', key: 'status', options: ['In Transit', 'Delivered', 'Processing', 'Delayed'] },
]

export default function AramidFiberLogisticsView() {
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
    return aramidFiberRecords.filter(r => {
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.fiberType} ${r.application} ${r.manufacturer} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false
      for (const [key, values] of Object.entries(activeFilters)) {
        if (values.length > 0 && !values.includes(String(r[key as keyof AramidFiberRecord]))) return false
      }
      return true
    })
  }, [searchQuery, activeFilters])

  const kpis = useMemo(() => {
    const total = aramidFiberRecords.length
    const totalInvestment = aramidFiberRecords.reduce((s: number, r) => s + r.investmentCr, 0)
    const avgStrength = Math.round(aramidFiberRecords.reduce((s: number, r) => s + r.tensileStrengthMPa, 0) / total)
    const delayed = aramidFiberRecords.filter(r => r.status === 'Delayed').length
    return [
      { label: 'Total Batches', value: total, suffix: ' shipments', color: 'text-amber-700' },
      { label: 'Total Investment', value: `${(totalInvestment / 1000).toFixed(1)}K`, suffix: ` Cr`, color: 'text-amber-700' },
      { label: 'Avg Tensile', value: avgStrength, suffix: ' MPa', color: 'text-amber-700' },
      { label: 'Delayed', value: delayed, suffix: ' batches', color: 'text-red-600' },
    ]
  }, [])

  const typeDistribution = useMemo(() => {
    const map = new Map<string, number>()
    aramidFiberRecords.forEach(r => { const k = r.fiberType.split(' ')[0]; map.set(k, (map.get(k) || 0) + 1) })
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1])
  }, [])

  const applicationDistribution = useMemo(() => {
    const map = new Map<string, number>()
    aramidFiberRecords.forEach(r => { map.set(r.application.split(' ')[0], (map.get(r.application.split(' ')[0]) || 0) + 1) })
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8)
  }, [])

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>()
    aramidFiberRecords.forEach(r => { map.set(r.zone, (map.get(r.zone) || 0) + 1) })
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1])
  }, [])

  const strengthByType = useMemo(() => {
    const map: Record<string, number> = {}
    const cnt: Record<string, number> = {}
    aramidFiberRecords.forEach(r => { const k = r.fiberType.split(' ')[0]; map[k] = (map[k] || 0) + r.tensileStrengthMPa; cnt[k] = (cnt[k] || 0) + 1 })
    return (Object.entries(map) as [string, number][]).map(([k, v]) => [k, Math.round(v / cnt[k])] as [string, number]).sort((a, b) => b[1] - a[1])
  }, [])

  const investmentByZone = useMemo(() => {
    const map: Record<string, number> = {}
    aramidFiberRecords.forEach(r => { map[r.zone] = (map[r.zone] || 0) + r.investmentCr })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const statusBreakdown = useMemo(() => {
    const map = new Map<string, number>()
    aramidFiberRecords.forEach(r => { map.set(r.status, (map.get(r.status) || 0) + 1) })
    return Array.from(map.entries())
  }, [])

  const densityByApp = useMemo(() => {
    const map: Record<string, number> = {}
    const cnt: Record<string, number> = {}
    aramidFiberRecords.forEach(r => { const k = r.application.split(' ')[0]; map[k] = (map[k] || 0) + r.densityGcc; cnt[k] = (cnt[k] || 0) + 1 })
    return (Object.entries(map) as [string, number][]).map(([k, v]) => [k, parseFloat((v / cnt[k]).toFixed(2))] as [string, number]).sort((a, b) => a[1] - b[1]).slice(0, 8)
  }, [])

  const transitByZone = useMemo(() => {
    const map: Record<string, number> = {}
    const cnt: Record<string, number> = {}
    aramidFiberRecords.forEach(r => { map[r.zone] = (map[r.zone] || 0) + r.transitDays; cnt[r.zone] = (cnt[r.zone] || 0) + 1 })
    return (Object.entries(map) as [string, number][]).map(([k, v]) => [k, Math.round(v / cnt[k])] as [string, number]).sort((a, b) => b[1] - a[1])
  }, [])

  const tabs = ['dashboard', 'registry', 'analytics', 'insights'] as const

  return (
    <div className="space-y-4 p-4">
      <PageHeader title="Aramid Fiber Logistics" description="Indian aramid fiber supply chain &#8212; Para-aramid Kevlar/Twaron/Technora and Meta-aramid Nomex for defence, aerospace, tyre, marine, filtration and telecom applications" />

      <div className="flex gap-2 border-b pb-2">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 text-sm rounded-t-lg capitalize arf-tab-btn ${activeTab === tab ? 'bg-amber-700 text-white arf-tab-active' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}`}>{tab}</button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {kpis.map(kpi => <Card key={kpi.label} className="arf-kpi-card border-l-4 border-l-amber-600"><CardContent className="p-3"><p className="text-xs text-muted-foreground">{kpi.label}</p><p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}<span className="text-xs font-normal ml-1">{kpi.suffix}</span></p></CardContent></Card>)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="arf-chart-card"><CardHeader><CardTitle className="text-sm">Shipments by Fiber Type</CardTitle></CardHeader><CardContent className="space-y-2">{typeDistribution.map(([type, count]) => <div key={type} className="flex items-center gap-2"><span className="text-xs w-28 truncate">{type}</span><div className="flex-1 bg-amber-50 rounded-full h-2"><div className="bg-amber-600 h-2 rounded-full arf-bar" style={{ width: `${(count / 8) * 100}%` }}></div></div><span className="text-xs font-medium">{count}</span></div>)}</CardContent></Card>
            <Card className="arf-chart-card"><CardHeader><CardTitle className="text-sm">Investment by Zone (&#8377; Cr)</CardTitle></CardHeader><CardContent className="space-y-2">{investmentByZone.map(([zone, inv]) => <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-amber-50 rounded-full h-2"><div className="bg-amber-500 h-2 rounded-full arf-bar" style={{ width: `${(inv / 1000) * 100}%` }}></div></div><span className="text-xs font-medium">{inv}</span></div>)}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Input placeholder="Search ID, batch, fiber, application, manufacturer..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="h-8 text-sm arf-search-input" />
            {filters.map(f => (
              <div key={f.key} className="flex gap-1 flex-wrap arf-filter-group">
                {f.options.slice(0, 4).map(opt => (
                  <Badge key={opt} variant={activeFilters[f.key]?.includes(opt) ? 'default' : 'outline'} className="cursor-pointer text-xs arf-filter-badge" onClick={() => toggleFilter(f.key, opt)}>{opt.split(' ').slice(0, 3).join(' ')}</Badge>
                ))}
              </div>
            ))}
          </div>
          <div className="overflow-x-auto arf-table-wrap">
            <table className="w-full text-xs arf-data-table">
              <thead><tr className="border-b arf-table-header"><th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Batch</th><th className="px-2 py-2 text-left">Manufacturer</th><th className="px-2 py-2 text-left">Fiber Type</th><th className="px-2 py-2 text-left">Application</th><th className="px-2 py-2 text-right">UTS (MPa)</th><th className="px-2 py-2 text-right">Invest (&#8377; Cr)</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-right">Days</th></tr></thead>
              <tbody>
                {filteredRecords.map(r => (
                  <tr key={r.id} className={`border-b arf-table-row ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-amber-500'}`}>
                    <td className="px-2 py-2 font-mono">{r.id}</td>
                    <td className="px-2 py-2">{r.batchNo}</td>
                    <td className="px-2 py-2 truncate max-w-[120px]">{r.manufacturer}</td>
                    <td className="px-2 py-2 truncate max-w-[120px]">{r.fiberType.split(' ').slice(0, 3).join(' ')}</td>
                    <td className="px-2 py-2 truncate max-w-[100px]">{r.application}</td>
                    <td className="px-2 py-2 text-right font-medium">{r.tensileStrengthMPa}</td>
                    <td className="px-2 py-2 text-right">{r.investmentCr}</td>
                    <td className="px-2 py-2"><Badge variant={r.status === 'Delayed' ? 'destructive' : r.status === 'Delivered' ? 'default' : 'secondary'} className="text-xs arf-status-badge">{r.status}</Badge></td>
                    <td className="px-2 py-2 truncate max-w-[100px]">{r.origin.split('(')[0].trim().split(' ').slice(-1)[0]} &#8594; {r.destination.split('(')[0].trim().split(' ').slice(-1)[0]}</td>
                    <td className="px-2 py-2 text-right">{r.transitDays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="arf-chart-card"><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{statusBreakdown.map(([s, c]) => <div key={s} className="flex items-center gap-2"><span className="text-xs w-20">{s}</span><div className="flex-1 bg-amber-50 rounded-full h-2"><div className={`h-2 rounded-full arf-bar ${s === 'Delayed' ? 'bg-red-500' : s === 'Delivered' ? 'bg-green-500' : s === 'In Transit' ? 'bg-blue-500' : 'bg-yellow-500'}`} style={{ width: `${(c / 14) * 100}%` }}></div></div><span className="text-xs font-medium">{c}</span></div>)}</CardContent></Card>
            <Card className="arf-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{zoneDistribution.map(([zone, count]) => <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-amber-50 rounded-full h-2"><div className="bg-amber-600 h-2 rounded-full arf-bar" style={{ width: `${(count / 6) * 100}%` }}></div></div><span className="text-xs font-medium">{count}</span></div>)}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="arf-chart-card"><CardHeader><CardTitle className="text-sm">Avg Tensile Strength by Type (MPa)</CardTitle></CardHeader><CardContent className="space-y-2">{strengthByType.map(([type, str]) => <div key={type} className="flex items-center gap-2"><span className="text-xs w-20 truncate">{type}</span><div className="flex-1 bg-amber-50 rounded-full h-2"><div className="bg-amber-700 h-2 rounded-full arf-bar" style={{ width: `${(str / 4000) * 100}%` }}></div></div><span className="text-xs font-medium">{str}</span></div>)}</CardContent></Card>
          <Card className="arf-chart-card"><CardHeader><CardTitle className="text-sm">Application Sector Split</CardTitle></CardHeader><CardContent className="space-y-2">{applicationDistribution.map(([app, count]) => <div key={app} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{app}</span><div className="flex-1 bg-amber-50 rounded-full h-2"><div className="bg-amber-500 h-2 rounded-full arf-bar" style={{ width: `${(count / 3) * 100}%` }}></div></div><span className="text-xs font-medium">{count}</span></div>)}</CardContent></Card>
          <Card className="arf-chart-card"><CardHeader><CardTitle className="text-sm">Avg Transit Days by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{transitByZone.map(([zone, days]) => <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-amber-50 rounded-full h-2"><div className="bg-amber-600 h-2 rounded-full arf-bar" style={{ width: `${(days / 8) * 100}%` }}></div></div><span className="text-xs font-medium">{days}d</span></div>)}</CardContent></Card>
          <Card className="arf-chart-card"><CardHeader><CardTitle className="text-sm">Density by Application (g/cc)</CardTitle></CardHeader><CardContent className="space-y-2">{densityByApp.map(([app, density]) => <div key={app} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{app}</span><div className="flex-1 bg-amber-50 rounded-full h-2"><div className="bg-amber-400 h-2 rounded-full arf-bar" style={{ width: `${(density / 2) * 100}%` }}></div></div><span className="text-xs font-medium">{density}</span></div>)}</CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="arf-insight-card border-l-4 border-l-amber-700"><CardHeader><CardTitle className="text-sm text-amber-800">Garware Defence: India&apos;s Sole Para-Aramid Producer</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Garware Defence Systems Pune is India&apos;s only commercial para-aramid fibre producer with 500t/year capacity at their Hinjewadi plant. Current product: Kevlar-29 equivalent at 2860 MPa tensile for CRPF and state police body armor &#8594; &#8377;145Cr order for 50,000 vest panels. Garware licensed DuPont PPTA polymerisation technology adapted for Indian monomer supply from Coromandel International. Import substitution savings: &#8377;400Cr/year replacing US and Dutch imports. Expansion: 2,000t/year plant at Shirwal Maharashtra approved at &#8377;1,800Cr &#8594; commissioning Q2 2028. Garware targeting tyre cord (40%), defence (30%), marine (20%), industrial (10%) split &#8594; customers include MRF, CEAT, Indian Navy, CRPF, BSNL, NTPC.</p></CardContent></Card>
          <Card className="arf-insight-card border-l-4 border-l-amber-600"><CardHeader><CardTitle className="text-sm text-amber-800">Aramid in Indian Tyre Industry: Steel Cord Replacement</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Indian tyre aramid cord market projected at &#8377;2,500Cr by 2030 driven by steel belt replacement. SRF Chennai producing para-aramid Twaron cord (ARF-0003) for MRF and CEAT &#8594; 3000 MPa tensile at 1.44 g/cc provides 15% weight reduction vs steel. Advantage: lighter tyre improves fuel efficiency 2.5% and reduces rolling resistance &#8594; critical for EV tyre range optimization. SRF expanding from 500t to 2,000t/year at Manali plant with &#8377;850Cr investment. Reliance Ahmedabad (ARF-0009) developing E-glass hybrid aramid for Suzlon wind turbine blades &#8594; technology transferable to tyre hybrid cords. India imports 80% of tyre aramid cord from Teijin Netherlands &#8594; SRF targeting 40% domestic market share by 2028.</p></CardContent></Card>
          <Card className="arf-insight-card border-l-4 border-l-red-500"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Batches: ARF-0008 and ARF-0014</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">ARF-0008 (Kitex Cochin to HAL Bengaluru, 12-day delay): DuPont quality hold on Kevlar KM2 yarn filament diameter &#8594; 12.0 micron vs 11.8 micron specification &#8594; DuPont Wilmington lab found 0.2 micron deviation exceeding aerospace tolerance &#8594; HAL Dhruv helicopter rotor blade production line idle &#8594; Army aviation &#8377;2.8Cr/day penalty &#8594; HAL emergency-sourcing from Russian SVM at 40% premium. ARF-0014 (JSL Jaipur to HAL Bengaluru, 14-day delay): Toyobo Zylon PBO fiber import held at Nhava Sheva customs &#8594; DGFT dual-use technology review triggered &#8594; PBO classified as strategic material requiring MEA clearance &#8594; Tejas Mk2 radome assembly halted &#8594; ADA requesting Defence Ministry fast-track &#8594; JSL developing indigenous PBO route at &#8377;350Cr to eliminate Japan dependency.</p></CardContent></Card>
          <Card className="arf-insight-card border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm text-amber-700">DRDO HEMRL Ultra-HMW Para-Aramid: 3200 MPa</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">DRDO HEMRL Pune developed ultra-high molecular weight para-aramid at 3200 MPa &#8594; India&apos;s highest-strength domestically produced aramid &#8594; developed under Project Bharat Kavach for ICV blast-resistant armour. 40% lighter than rolled homogeneous armour (RHA) steel with equivalent STANAG 4569 Level 4 protection against 14.5mm API at 30m. Key innovation: extended chain alignment during wet-spinning using proprietary solvent system &#8594; 15% higher tensile than imported Kevlar-49. DRDO scaling from lab 100t to 200t/year at Pune &#8594; &#8377;320Cr initial order for BMP-2/3 upgrade kits. Army ordering 1,500 vehicle protection kits worth &#8377;4,800Cr &#8594; technology transfer to Garware and SRF for commercial production by 2029.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
