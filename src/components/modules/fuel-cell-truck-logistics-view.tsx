'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Truck } from 'lucide-react'

interface FuelCellTruckRecord {
  id: string
  fleetId: string
  city: string
  operator: string
  truckModel: string
  fuelCellType: string
  route: string
  rangeKm: number
  payloadTonnes: number
  investmentCr: number
  status: string
  priority: string
  origin: string
  destination: string
  deployDate: string
  transitDays: number
  zone: string
  remarks: string
}

const fuelCellTruckRecords: FuelCellTruckRecord[] = [
  { id: 'FCT-0001', fleetId: 'FCT-FL2401', city: 'Delhi NCR', operator: 'Tata Motors Green', truckModel: 'Tata Prima HFC 40T', fuelCellType: 'PEM 150kW', route: 'Delhi-Jaipur Freight Corridor', rangeKm: 480, payloadTonnes: 26, investmentCr: 125, status: 'In Transit', priority: 'Critical', origin: 'Gurgaon Depot (NCR)', destination: 'Jaipur ICD (Rajasthan)', deployDate: '2026-07-22', transitDays: 1, zone: 'North', remarks: 'Tata Prima hydrogen fuel cell 40-tonne truck on Delhi-Jaipur NH8 &#8594; 150kW PEM stack from Plug Power &#8594; 480km range with 35kg H2 at 700 bar &#8594; &#8377;125Cr for 10-truck pilot fleet &#8594; replacing diesel trucks saving 340t CO2/year &#8594; Tata Motors targeting 500 FCT trucks on golden quadrilateral by 2028' },
  { id: 'FCT-0002', fleetId: 'FCT-FL2402', city: 'Mumbai', operator: 'Ashok Leyland H2', truckModel: 'AVTR 44T HFC', fuelCellType: 'PEM 180kW', route: 'Mumbai-Pune Industrial', rangeKm: 420, payloadTonnes: 28, investmentCr: 110, status: 'Delivered', priority: 'High', origin: 'JNPT Mumbai (Port)', destination: 'Chakan MIDC (Pune)', deployDate: '2026-07-18', transitDays: 1, zone: 'West', remarks: 'Ashok Leyland AVTR hydrogen 44-tonner on Mumbai-Pune express freight &#8594; 180kW PEM fuel cell Ballard FCmove &#8594; 420km range 40kg H2 &#8594; &#8377;110Cr for 8 trucks &#8594; JNPT to Chakan auto parts corridor &#8594; 2,200 trips/month replacing 16 diesel trucks &#8594; Ashok Leyland JV with Ballard for India FCT manufacturing' },
  { id: 'FCT-0003', fleetId: 'FCT-FL2403', city: 'Chennai', operator: 'Blue Star Logistics', truckModel: 'Hyundai H2 Xcient', fuelCellType: 'PEM 350kW Dual', route: 'Chennai-Bengaluru Express', rangeKm: 650, payloadTonnes: 32, investmentCr: 210, status: 'In Transit', priority: 'Critical', origin: 'Kattupalli Port (Chennai)', destination: 'Peenya IAP (Bengaluru)', deployDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'Hyundai H2 Xcient 350kW dual-fuel cell heavy truck &#8594; 650km range largest in India &#8594; 32 tonne payload for auto components &#8594; &#8377;210Cr for 6 trucks &#8594; Chennai-Bengaluru 350km route with reserve range &#8594; refueling at HPCL Hosur H2 station &#8594; Hyundai India assembling Xcient at Sri City plant from 2027 &#8594; targeting 1,000 FCT units by 2030' },
  { id: 'FCT-0004', fleetId: 'FCT-FL2404', city: 'Kolkata', operator: 'DFDS Logistics H2', truckModel: 'Eicher H2 28T', fuelCellType: 'PEM 120kW', route: 'Kolkata-Siliguri Tea Route', rangeKm: 580, payloadTonnes: 18, investmentCr: 85, status: 'Processing', priority: 'Medium', origin: 'Kolkata Port (Haldia)', destination: 'Siliguri ICD (Phuentsholing)', deployDate: '2026-07-25', transitDays: 3, zone: 'East', remarks: 'Eicher hydrogen 28-tonne truck for Kolkata-Bhutan tea and garment corridor &#8594; 580km range via NH31 &#8594; 120kW PEM stack from Advent Technologies &#8594; &#8377;85Cr for 5 trucks &#8594; hill terrain requires extra power reserve &#8594; refueling at IOCL Siliguri green H2 station &#8594; Bhutan bilateral FCT corridor &#8594; DFDS expanding to 30 trucks on east-bengal corridor' },
  { id: 'FCT-0005', fleetId: 'FCT-FL2405', city: 'Gandhinagar', operator: 'Adani Transport Green', truckModel: 'Adani-Cummins H2 49T', fuelCellType: 'SOFC 200kW', route: 'Mundra-Kandla Port Shuttle', rangeKm: 300, payloadTonnes: 35, investmentCr: 165, status: 'Delivered', priority: 'High', origin: 'Mundra Port (Adani)', destination: 'Kandla Special Zone', deployDate: '2026-07-16', transitDays: 1, zone: 'West', remarks: 'Adani-Cummins solid oxide fuel cell 49-tonne port drayage truck &#8594; 200kW SOFC running on ammonia-to-hydrogen &#8594; 300km range sufficient for 150km port shuttle &#8594; &#8377;165Cr for 12 trucks &#8594; Mundra-Kandla high-frequency 6 trips/day &#8594; SOFC advantage: 60% efficiency vs PEM 45% &#8594; Adani building 50t/day green NH3 cracker at Mundra for fuel supply' },
  { id: 'FCT-0006', fleetId: 'FCT-FL2406', city: 'Hyderabad', operator: 'TVS Supply Chain H2', truckModel: 'Daimler GenH2 44T', fuelCellType: 'PEM 300kW', route: 'Hyderabad-Chennai Pharma', rangeKm: 550, payloadTonnes: 29, investmentCr: 195, status: 'Delayed', priority: 'Critical', origin: 'Hyderabad Pharma Hub ( Genome Valley)', destination: 'Chennai Port (Export)', deployDate: '2026-07-12', transitDays: 2, zone: 'South', remarks: 'Daimler GenH2 300kW for Hyderabad-Chennai pharma cold chain &#8594; 10-day delay: 700 bar H2 tank certification pending ARAI &#8594; &#8377;195Cr for 8 trucks &#8594; pharma temperature-controlled cargo at 2-8&#176;C &#8594; Daimler India assembling GenH2 at Oragam plant &#8594; TVS targeting 200 FCT trucks for pharma logistics by 2029 &#8594; daily penalty &#8377;8L for delayed API shipments' },
  { id: 'FCT-0007', fleetId: 'FCT-FL2407', city: 'Bengaluru', operator: 'DHL Express Green H2', truckModel: 'Volvo FM H2 40T', fuelCellType: 'PEM 250kW', route: 'Bengaluru-Coimbatore Auto', rangeKm: 380, payloadTonnes: 24, investmentCr: 140, status: 'In Transit', priority: 'High', origin: 'Bengaluru Electronic City', destination: 'Coimbatore SIDCO', deployDate: '2026-07-21', transitDays: 1, zone: 'South', remarks: 'Volvo FM hydrogen 40-tonne for Bengaluru-Coimbatore electronics and textile corridor &#8594; 250kW PEM from PowerCell Sweden &#8594; 380km range &#8594; &#8377;140Cr for 7 trucks &#8594; time-sensitive express cargo 24h guaranteed &#8594; Volvo India sourcing fuel cells through Tata PowerCell JV &#8594; DHL India targeting carbon-neutral logistics by 2030 with 500 FCT trucks' },
  { id: 'FCT-0008', fleetId: 'FCT-FL2408', city: 'Pune', operator: 'Blue Dart H2 Express', truckModel: 'Scania R450 HFC', fuelCellType: 'PEM 200kW', route: 'Pune-Mumbai Airport Cargo', rangeKm: 180, payloadTonnes: 15, investmentCr: 95, status: 'Delivered', priority: 'High', origin: 'Chakan MIDC (Pune)', destination: 'Mumbai CSIA Cargo', deployDate: '2026-07-17', transitDays: 1, zone: 'West', remarks: 'Scania R450 hydrogen 15-tonne express cargo for Pune-Mumbai airport &#8594; 200kW PEM 180km range &#8594; &#8377;95Cr for 5 trucks &#8594; Blue Dart premium same-day air cargo feeder &#8594; refueling at BPCL Mumbai airport H2 station &#8594; 4 trips/day 6am-midnight &#8594; replacing CNG trucks on express route &#8594; Scania India planning FCT assembly at Narasapura plant 2028' },
  { id: 'FCT-0009', fleetId: 'FCT-FL2409', city: 'Ahmedabad', operator: 'Reliance Green Freight', truckModel: 'Reliance-Cummins H2 55T', fuelCellType: 'SOFC 250kW', route: 'Jamnagar Refinery-Pipeline', rangeKm: 350, payloadTonnes: 38, investmentCr: 230, status: 'Processing', priority: 'Critical', origin: 'Jamnagar Refinery (Reliance)', destination: 'Kandla Pipeline Terminal', deployDate: '2026-07-26', transitDays: 1, zone: 'West', remarks: 'Reliance-Cummins SOFC 250kW 55-tonne for Jamnagar-Kandla petrochemical shuttle &#8594; 38 tonne petrochemical payload &#8594; &#8377;230Cr for 10 trucks &#8594; SOFC using refinery by-product hydrogen &#8594; world&apos;s first refinery-to-transport H2 circular economy &#8594; Reliance producing 10,000t grey H2 at Jamnagar &#8594; repurposing 500t/year for FCT fleet &#8594; 60% cost advantage vs green H2' },
  { id: 'FCT-0010', fleetId: 'FCT-FL2410', city: 'Lucknow', operator: 'ITC Logistics Green', truckModel: 'Tata Signa H2 28T', fuelCellType: 'PEM 120kW', route: 'Lucknow-Kanpur FMCG', rangeKm: 130, payloadTonnes: 16, investmentCr: 65, status: 'Delivered', priority: 'Medium', origin: 'ITC Saharanpur (Lucknow)', destination: 'Kanpur ICD (UP)', deployDate: '2026-07-15', transitDays: 1, zone: 'North', remarks: 'Tata Signa hydrogen 28-tonne for ITC FMCG distribution Lucknow-Kanpur &#8594; 120kW PEM 130km range for short-haul &#8594; &#8377;65Cr for 4 trucks &#8594; ITC converting 100% UP fleet to H2 by 2028 &#8594; FMCG last-mile distribution with green credentials &#8594; refueling at ITC in-house H2 station from biomass gasifier &#8594; 6 trips/day each truck 16 tonnes &#8594; saving &#8377;2.4Cr/year diesel cost' },
  { id: 'FCT-0011', fleetId: 'FCT-FL2411', city: 'Bhubaneswar', operator: 'NALCO Green Freight', truckModel: 'Eicher H2 40T', fuelCellType: 'PEM 180kW', route: 'Damanjodi-Paradip Alumina', rangeKm: 400, payloadTonnes: 27, investmentCr: 155, status: 'In Transit', priority: 'High', origin: 'Damanjodi (NALCO)', destination: 'Paradip Port (Odisha)', deployDate: '2026-07-19', transitDays: 2, zone: 'East', remarks: 'Eicher hydrogen 40-tonne for NALCO alumina transport Damanjodi-Paradip &#8594; 180kW PEM 400km range &#8594; &#8377;155Cr for 8 trucks &#8594; 27 tonne alumina per trip 4 trips/week &#8594; replacing 12 diesel dumpers &#8594; refueling at Paradip IOCL green H2 from PEL electrolyzer &#8594; NALCO targeting 80% green logistics by 2028 &#8594; odisha mining corridor electrification pioneer' },
  { id: 'FCT-0012', fleetId: 'FCT-FL2412', city: 'Kochi', operator: 'Kitex Garments Green', truckModel: 'Tata Ace H2 7.5T', fuelCellType: 'PEM 60kW', route: 'Kochi-Coimbatore Textile', rangeKm: 220, payloadTonnes: 4.5, investmentCr: 38, status: 'Delayed', priority: 'Low', origin: 'Kitex Kerala (Kochi)', destination: 'Tirupur (Tamil Nadu)', deployDate: '2026-07-11', transitDays: 2, zone: 'South', remarks: 'Tata Ace hydrogen 7.5-tonne light truck for Kochi-Tirupur garment shuttle &#8594; 60kW PEM smallest Indian FCT &#8594; &#8377;38Cr for 6 trucks &#8594; 12-day delay: H2 fueling infrastructure not ready at Tirupur &#8594; Kitex targeting carbon-neutral textile supply chain &#8594; Kerala-TN interstate green freight corridor &#8594; 220km range via NH544 &#8594; Tirupur H2 station commissioning delayed by IOC contractor issue' },
  { id: 'FCT-0013', fleetId: 'FCT-FL2413', city: 'Guwahati', operator: 'Numaligarh Refinery Green', truckModel: 'Ashok Leyland H2 35T', fuelCellType: 'PEM 150kW', route: 'Guwahati-Silchar Corridor', rangeKm: 340, payloadTonnes: 22, investmentCr: 90, status: 'Processing', priority: 'Medium', origin: 'Guwahati ICD (Assam)', destination: 'Silchar (Barak Valley)', deployDate: '2026-07-24', transitDays: 1, zone: 'East', remarks: 'Ashok Leyland hydrogen 35-tonne for Assam NE freight corridor &#8594; 150kW PEM 340km range &#8594; &#8377;90Cr for 5 trucks &#8594; Numaligarh refinery green H2 supply from 20MW electrolyzer &#8594; Northeast India first FCT deployment &#8594; hill section requires gradeability 22% &#8594; Ashok Leyland customizing motor controller for gradient &#8594; Assam govt subsidy &#8377;15L per truck under EV policy' },
  { id: 'FCT-0014', fleetId: 'FCT-FL2414', city: 'Indore', operator: 'Mahindra H2 Logistics', truckModel: 'Mahindra Blazo H2 40T', fuelCellType: 'PEM 160kW', route: 'Indore-Bhopal Pinnacle', rangeKm: 350, payloadTonnes: 25, investmentCr: 105, status: 'In Transit', priority: 'High', origin: 'Pithampur Indore (MP)', destination: 'Mandideep Bhopal (MP)', deployDate: '2026-07-20', transitDays: 1, zone: 'North', remarks: 'Mahindra Blazo hydrogen 40-tonne for Indore-Bhopal auto-industrial corridor &#8594; 160kW PEM from Mahindra-SaaS Edart joint development &#8594; 350km range &#8594; &#8377;105Cr for 7 trucks &#8594; Pithampur to Mandideep 190km industrial shuttle &#8594; Mahindra first indigenous FCT truck platform &#8594; MP government green freight incentive &#8377;10L/truck &#8594; targeting 150 FCT trucks across MP by 2029' },
]

const filters = [
  { label: 'Truck Model', key: 'truckModel', options: ['Tata Prima HFC 40T', 'AVTR 44T HFC', 'Hyundai H2 Xcient', 'Eicher H2 28T', 'Adani-Cummins H2 49T', 'Daimler GenH2 44T', 'Volvo FM H2 40T', 'Scania R450 HFC', 'Reliance-Cummins H2 55T', 'Tata Signa H2 28T', 'Tata Ace H2 7.5T', 'Ashok Leyland H2 35T', 'Mahindra Blazo H2 40T'] },
  { label: 'Fuel Cell Type', key: 'fuelCellType', options: ['PEM 60kW', 'PEM 120kW', 'PEM 150kW', 'PEM 160kW', 'PEM 180kW', 'PEM 200kW', 'PEM 250kW', 'PEM 300kW', 'PEM 350kW Dual', 'SOFC 200kW', 'SOFC 250kW'] },
  { label: 'Zone', key: 'zone', options: ['North', 'South', 'East', 'West'] },
  { label: 'Status', key: 'status', options: ['In Transit', 'Delivered', 'Processing', 'Delayed'] },
]

export default function FuelCellTruckLogisticsView() {
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
    return fuelCellTruckRecords.filter(r => {
      if (searchQuery && !`${r.id} ${r.fleetId} ${r.truckModel} ${r.route} ${r.operator} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false
      for (const [key, values] of Object.entries(activeFilters)) {
        if (values.length > 0 && !values.includes(String(r[key as keyof FuelCellTruckRecord]))) return false
      }
      return true
    })
  }, [searchQuery, activeFilters])

  const kpis = useMemo(() => {
    const total = fuelCellTruckRecords.length
    const totalInvestment = fuelCellTruckRecords.reduce((s: number, r) => s + r.investmentCr, 0)
    const avgRange = Math.round(fuelCellTruckRecords.reduce((s: number, r) => s + r.rangeKm, 0) / total)
    const delayed = fuelCellTruckRecords.filter(r => r.status === 'Delayed').length
    return [
      { label: 'Total Fleet', value: total, suffix: ' trucks', color: 'text-orange-700' },
      { label: 'Total Investment', value: `${(totalInvestment / 1000).toFixed(1)}K`, suffix: ` Cr`, color: 'text-orange-700' },
      { label: 'Avg Range', value: avgRange, suffix: ' km', color: 'text-orange-700' },
      { label: 'Delayed', value: delayed, suffix: ' trucks', color: 'text-red-600' },
    ]
  }, [])

  const modelDistribution = useMemo(() => {
    const map = new Map<string, number>()
    fuelCellTruckRecords.forEach(r => { map.set(r.truckModel.split(' ')[0], (map.get(r.truckModel.split(' ')[0]) || 0) + 1) })
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1])
  }, [])

  const fcTypeDistribution = useMemo(() => {
    const map = new Map<string, number>()
    fuelCellTruckRecords.forEach(r => { map.set(r.fuelCellType.split(' ')[0], (map.get(r.fuelCellType.split(' ')[0]) || 0) + 1) })
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1])
  }, [])

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>()
    fuelCellTruckRecords.forEach(r => { map.set(r.zone, (map.get(r.zone) || 0) + 1) })
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1])
  }, [])

  const payloadByModel = useMemo(() => {
    const map: Record<string, number> = {}
    const cnt: Record<string, number> = {}
    fuelCellTruckRecords.forEach(r => { const k = r.truckModel.split(' ')[0]; map[k] = (map[k] || 0) + r.payloadTonnes; cnt[k] = (cnt[k] || 0) + 1 })
    return (Object.entries(map) as [string, number][]).map(([k, v]) => [k, Math.round(v / cnt[k])] as [string, number]).sort((a, b) => b[1] - a[1])
  }, [])

  const rangeByModel = useMemo(() => {
    const map: Record<string, number> = {}
    const cnt: Record<string, number> = {}
    fuelCellTruckRecords.forEach(r => { const k = r.truckModel.split(' ')[0]; map[k] = (map[k] || 0) + r.rangeKm; cnt[k] = (cnt[k] || 0) + 1 })
    return (Object.entries(map) as [string, number][]).map(([k, v]) => [k, Math.round(v / cnt[k])] as [string, number]).sort((a, b) => b[1] - a[1])
  }, [])

  const investmentByZone = useMemo(() => {
    const map: Record<string, number> = {}
    fuelCellTruckRecords.forEach(r => { map[r.zone] = (map[r.zone] || 0) + r.investmentCr })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const statusBreakdown = useMemo(() => {
    const map = new Map<string, number>()
    fuelCellTruckRecords.forEach(r => { map.set(r.status, (map.get(r.status) || 0) + 1) })
    return Array.from(map.entries())
  }, [])

  const operatorCount = useMemo(() => {
    const map = new Map<string, number>()
    fuelCellTruckRecords.forEach(r => { map.set(r.operator.split(' ')[0], (map.get(r.operator.split(' ')[0]) || 0) + 1) })
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8)
  }, [])

  const tabs = ['dashboard', 'registry', 'analytics', 'insights'] as const

  return (
    <div className="space-y-4 p-4">
      <PageHeader title="Fuel Cell Truck Logistics" description="Indian hydrogen fuel cell heavy-duty trucking &#8212; PEM and SOFC trucks from Tata, Ashok Leyland, Hyundai, Daimler, Volvo, Scania for freight, port drayage, pharma and FMCG corridors" />

      <div className="flex gap-2 border-b pb-2">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 text-sm rounded-t-lg capitalize fct-tab-btn ${activeTab === tab ? 'bg-orange-700 text-white fct-tab-active' : 'bg-orange-50 text-orange-700 hover:bg-orange-100'}`}>{tab}</button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {kpis.map(kpi => <Card key={kpi.label} className="fct-kpi-card border-l-4 border-l-orange-600"><CardContent className="p-3"><p className="text-xs text-muted-foreground">{kpi.label}</p><p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}<span className="text-xs font-normal ml-1">{kpi.suffix}</span></p></CardContent></Card>)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="fct-chart-card"><CardHeader><CardTitle className="text-sm">Trucks by Manufacturer</CardTitle></CardHeader><CardContent className="space-y-2">{modelDistribution.map(([model, count]) => <div key={model} className="flex items-center gap-2"><span className="text-xs w-20 truncate">{model}</span><div className="flex-1 bg-orange-50 rounded-full h-2"><div className="bg-orange-600 h-2 rounded-full fct-bar" style={{ width: `${(count / 4) * 100}%` }}></div></div><span className="text-xs font-medium">{count}</span></div>)}</CardContent></Card>
            <Card className="fct-chart-card"><CardHeader><CardTitle className="text-sm">Investment by Zone (&#8377; Cr)</CardTitle></CardHeader><CardContent className="space-y-2">{investmentByZone.map(([zone, inv]) => <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-orange-50 rounded-full h-2"><div className="bg-orange-500 h-2 rounded-full fct-bar" style={{ width: `${(inv / 1200) * 100}%` }}></div></div><span className="text-xs font-medium">{inv}</span></div>)}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Input placeholder="Search ID, fleet, model, operator, route..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="h-8 text-sm fct-search-input" />
            {filters.map(f => (
              <div key={f.key} className="flex gap-1 flex-wrap fct-filter-group">
                {f.options.slice(0, 4).map(opt => (
                  <Badge key={opt} variant={activeFilters[f.key]?.includes(opt) ? 'default' : 'outline'} className="cursor-pointer text-xs fct-filter-badge" onClick={() => toggleFilter(f.key, opt)}>{opt.split(' ').slice(0, 3).join(' ')}</Badge>
                ))}
              </div>
            ))}
          </div>
          <div className="overflow-x-auto fct-table-wrap">
            <table className="w-full text-xs fct-data-table">
              <thead><tr className="border-b fct-table-header"><th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Fleet</th><th className="px-2 py-2 text-left">Operator</th><th className="px-2 py-2 text-left">Model</th><th className="px-2 py-2 text-left">FC Type</th><th className="px-2 py-2 text-right">Range (km)</th><th className="px-2 py-2 text-right">Invest (&#8377; Cr)</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-right">Days</th></tr></thead>
              <tbody>
                {filteredRecords.map(r => (
                  <tr key={r.id} className={`border-b fct-table-row ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-orange-500'}`}>
                    <td className="px-2 py-2 font-mono">{r.id}</td>
                    <td className="px-2 py-2">{r.fleetId}</td>
                    <td className="px-2 py-2 truncate max-w-[120px]">{r.operator}</td>
                    <td className="px-2 py-2 truncate max-w-[100px]">{r.truckModel.split(' ').slice(0, 2).join(' ')}</td>
                    <td className="px-2 py-2 truncate max-w-[80px]">{r.fuelCellType.split(' ')[0]}</td>
                    <td className="px-2 py-2 text-right font-medium">{r.rangeKm}</td>
                    <td className="px-2 py-2 text-right">{r.investmentCr}</td>
                    <td className="px-2 py-2"><Badge variant={r.status === 'Delayed' ? 'destructive' : r.status === 'Delivered' ? 'default' : 'secondary'} className="text-xs fct-status-badge">{r.status}</Badge></td>
                    <td className="px-2 py-2 truncate max-w-[100px]">{r.route.split('-')[0]}</td>
                    <td className="px-2 py-2 text-right">{r.transitDays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="fct-chart-card"><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{statusBreakdown.map(([s, c]) => <div key={s} className="flex items-center gap-2"><span className="text-xs w-20">{s}</span><div className="flex-1 bg-orange-50 rounded-full h-2"><div className={`h-2 rounded-full fct-bar ${s === 'Delayed' ? 'bg-red-500' : s === 'Delivered' ? 'bg-green-500' : s === 'In Transit' ? 'bg-blue-500' : 'bg-yellow-500'}`} style={{ width: `${(c / 14) * 100}%` }}></div></div><span className="text-xs font-medium">{c}</span></div>)}</CardContent></Card>
            <Card className="fct-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{zoneDistribution.map(([zone, count]) => <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-orange-50 rounded-full h-2"><div className="bg-orange-600 h-2 rounded-full fct-bar" style={{ width: `${(count / 6) * 100}%` }}></div></div><span className="text-xs font-medium">{count}</span></div>)}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="fct-chart-card"><CardHeader><CardTitle className="text-sm">Avg Payload by Make (tonnes)</CardTitle></CardHeader><CardContent className="space-y-2">{payloadByModel.map(([make, payload]) => <div key={make} className="flex items-center gap-2"><span className="text-xs w-20 truncate">{make}</span><div className="flex-1 bg-orange-50 rounded-full h-2"><div className="bg-orange-700 h-2 rounded-full fct-bar" style={{ width: `${(payload / 40) * 100}%` }}></div></div><span className="text-xs font-medium">{payload}</span></div>)}</CardContent></Card>
          <Card className="fct-chart-card"><CardHeader><CardTitle className="text-sm">Avg Range by Make (km)</CardTitle></CardHeader><CardContent className="space-y-2">{rangeByModel.map(([make, range]) => <div key={make} className="flex items-center gap-2"><span className="text-xs w-20 truncate">{make}</span><div className="flex-1 bg-orange-50 rounded-full h-2"><div className="bg-orange-500 h-2 rounded-full fct-bar" style={{ width: `${(range / 700) * 100}%` }}></div></div><span className="text-xs font-medium">{range}</span></div>)}</CardContent></Card>
          <Card className="fct-chart-card"><CardHeader><CardTitle className="text-sm">Fuel Cell Type Split</CardTitle></CardHeader><CardContent className="space-y-2">{fcTypeDistribution.map(([type, count]) => <div key={type} className="flex items-center gap-2"><span className="text-xs w-16">{type}</span><div className="flex-1 bg-orange-50 rounded-full h-2"><div className="bg-orange-600 h-2 rounded-full fct-bar" style={{ width: `${(count / 14) * 100}%` }}></div></div><span className="text-xs font-medium">{count}</span></div>)}</CardContent></Card>
          <Card className="fct-chart-card"><CardHeader><CardTitle className="text-sm">Operator Fleet Size</CardTitle></CardHeader><CardContent className="space-y-2">{operatorCount.map(([op, count]) => <div key={op} className="flex items-center gap-2"><span className="text-xs w-20 truncate">{op}</span><div className="flex-1 bg-orange-50 rounded-full h-2"><div className="bg-orange-400 h-2 rounded-full fct-bar" style={{ width: `${(count / 3) * 100}%` }}></div></div><span className="text-xs font-medium">{count}</span></div>)}</CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="fct-insight-card border-l-4 border-l-orange-700"><CardHeader><CardTitle className="text-sm text-orange-800">India&apos;s FCT Ambition: 10,000 Hydrogen Trucks by 2030</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Under National Green Hydrogen Mission, India targeting 10,000 fuel cell trucks on major freight corridors by 2030. Current pipeline: Tata Motors (500 trucks), Ashok Leyland (300), Hyundai India (1,000 Xcient), Daimler India (500 GenH2), Volvo (200), Scania (200), Mahindra (150), Eicher (100). Combined &#8377;18,000Cr investment creating 25,000 direct jobs. Key enabler: 300 green H2 refueling stations planned on golden quadrilateral and Delhi-Mumbai industrial corridor at &#8377;12Cr each. PEM fuel cell stacks sourced from Plug Power, Ballard, PowerCell until Indian manufacturers (Tata PowerCell, Aditya Birla SaaS) reach 1 GW annual capacity by 2028. H2 cost target: &#8377;180/kg by 2030 making FCT TCO competitive with diesel.</p></CardContent></Card>
          <Card className="fct-insight-card border-l-4 border-l-orange-600"><CardHeader><CardTitle className="text-sm text-orange-800">SOFC Advantage: Adani and Reliance Leading</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Solid oxide fuel cells (SOFC) offer 60% efficiency vs PEM 45% at higher temperature operation &#8594; Adani-Cummins 200kW SOFC at Mundra port (FCT-0005) and Reliance-Cummins 250kW SOFC at Jamnagar (FCT-0009) pioneering this technology. SOFC can run on ammonia-to-hydrogen or direct natural gas reforming &#8594; eliminates need for ultra-pure H2 infrastructure. Adani building 50t/day ammonia cracker at Mundra port. Reliance using refinery by-product hydrogen at near-zero fuel cost &#8594; TCO advantage of 40% over PEM FCT. SOFC challenge: 30-minute startup time vs PEM 2-minute &#8594; suited for scheduled port and refinery shuttle routes. Cummins India localizing SOFC stack manufacturing at Pune by 2028.</p></CardContent></Card>
          <Card className="fct-insight-card border-l-4 border-l-red-500"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Deployments: FCT-0006 and FCT-0012</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">FCT-0006 (TVS Hyderabad-Chennai, 10-day delay): Daimler GenH2 700 bar Type-IV H2 tank ARAI certification pending &#8594; India&apos;s first 700 bar onboard storage approval &#8594; ARAI conducting additional crash test simulation after Euro NCAP updated side-impact protocol. TVS losing &#8377;8L/day on delayed API shipments for Dr. Reddy&apos;s and Biocon. Workaround: using diesel backup trucks with carbon offset credits. FCT-0012 (Kitex Kochi-Tirupur, 12-day delay): IOCL Tirupur green H2 station contractor scaffolding collapse delayed commissioning &#8594; Tata Ace H2 trucks idle at Kochi depot &#8594; Kitex rerouting garments via conventional trucks through Salem &#8594; adding 180km detour and &#8377;45Cr annual freight cost increase.</p></CardContent></Card>
          <Card className="fct-insight-card border-l-4 border-l-orange-500"><CardHeader><CardTitle className="text-sm text-orange-700">Hyundai Xcient: India&apos;s Longest-Range FCT at 650km</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Hyundai H2 Xcient 350kW dual-fuel cell (FCT-0003) achieves India&apos;s longest FCT range at 650km &#8594; enabling Chennai-Bengaluru 350km corridor with full reserve range. 350kW dual-stack architecture: two 175kW PEM stacks with independent operation &#8594; if one stack fails, second provides 50% power for limp-home. 32 tonne payload highest in Indian FCT fleet. Blue Star Logistics operating 6 Xcient trucks on premium auto components route &#8594; Hyundai assembling Xcient at Sri City Andhra Pradesh from 2027 with 60% local content &#8594; targeting 1,000 units by 2030. Each Xcient displaces 140t CO2/year vs diesel &#8594; 6-truck fleet saves 840t CO2 annually. Price target: &#8377;1.2Cr per truck by 2029 with Indian assembly.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
