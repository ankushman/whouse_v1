'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Feather } from 'lucide-react'

interface MagnesiumAlloyRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  alloyGrade: string
  application: string
  densityGcc: number
  yieldStrengthMPa: number
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

const magnesiumRecords: MagnesiumAlloyRecord[] = [
  { id: 'MGA-0001', batchNo: 'MGA-B2401', city: 'Pune', manufacturer: 'Mahindra &amp; Mahindra', alloyGrade: 'AZ91D (Mg-Al-Zn)', application: 'Steering Wheel Armature (XUV700)', densityGcc: 1.81, yieldStrengthMPa: 230, investmentCr: 135, status: 'Delivered', priority: 'High', origin: 'Mahindra Die Cast Pune (MH)', destination: 'Mahindra Nashik Plant (MH)', shipDate: '2026-07-20', transitDays: 1, zone: 'West', remarks: 'AZ91D magnesium die-cast steering wheel frame for XUV700 &#8594; 1.81 g/cc density, 50% lighter than Al &#8594; &#8377;135Cr for 28 tonnes AZ91D billets &#8594; Mahindra producing 500,000 SUVs/year with Mg interior parts &#8594; AZ91D offers 3x damping capacity vs aluminium &#8594; Mahindra targeting 15% Mg content per vehicle by 2028 &#8594; &#8377;9,500Cr Indian automotive Mg alloy market' },
  { id: 'MGA-0002', batchNo: 'MGA-B2402', city: 'Bengaluru', manufacturer: 'HAL Aerospace', alloyGrade: 'WE43 (Mg-Y-RE-Zr)', application: 'Helicopter Transmission Casing (ALH Dhruv)', densityGcc: 1.85, yieldStrengthMPa: 280, investmentCr: 198, status: 'In Transit', priority: 'Critical', origin: 'HAL Foundry Bengaluru (KA)', destination: 'HAL Helicopter Div Bengaluru (KA)', shipDate: '2026-07-22', transitDays: 1, zone: 'South', remarks: 'WE43 rare-earth magnesium alloy gearbox housing for ALH Mk4 &#8594; 1.85 g/cc with 280MPa yield at 250&#176;C &#8594; &#8377;198Cr for 12 tonnes WE43 sand castings &#8594; HAL producing 60 ALH Dhruv helicopters/year &#8594; WE43 outperforms Al-7075 by 30% specific strength &#8594; India importing 90% WE43 from UK (Magnesium Elektron) &#8594; &#8377;14,200Cr Indian aerospace Mg alloy demand' },
  { id: 'MGA-0003', batchNo: 'MGA-B2403', city: 'Chennai', manufacturer: 'Hyundai Motor India', alloyGrade: 'AM60B (Mg-Al-Mn)', application: 'Instrument Panel Sub-Frame (Hyundai Creta)', densityGcc: 1.79, yieldStrengthMPa: 210, investmentCr: 112, status: 'Delivered', priority: 'High', origin: 'HMIL Die Cast Chennai (TN)', destination: 'HMIL Sriperumbudur Plant (TN)', shipDate: '2026-07-19', transitDays: 1, zone: 'South', remarks: 'AM60B magnesium IP sub-frame for Hyundai Creta facelift &#8594; 1.79 g/cc enabling 2.5kg weight saving per vehicle &#8594; &#8377;112Cr for 35 tonnes AM60B ingots &#8594; HMIL India second largest car producer 780,000 units/year &#8594; AM60B excellent crash energy absorption for IP beam &#8594; Hyundai targeting 25% Mg content across all India-made models &#8594; &#8377;11,800Cr Indian automotive Mg die-cast market' },
  { id: 'MGA-0004', batchNo: 'MGA-B2404', city: 'Hyderabad', manufacturer: 'DRDO DMRL', alloyGrade: 'ZK60A (Mg-Zn-Zr)', application: 'Missile Airframe Section (Astra Mk2)', densityGcc: 1.83, yieldStrengthMPa: 305, investmentCr: 245, status: 'Processing', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TS)', destination: 'BDL Hyderabad (TS)', shipDate: '2026-07-25', transitDays: 1, zone: 'South', remarks: 'ZK60A extruded Mg alloy for Astra Mk2 airframe structural section &#8594; 1.83 g/cc with 305MPa yield strength &#8594; &#8377;245Cr for 8 tonnes ZK60A extrusion profiles &#8594; DRDO extending Astra range by 40% via weight reduction &#8594; ZK60A offers 2x specific stiffness vs Al-6061 &#8594; BDL producing 100 Astra Mk2 missiles/year &#8594; &#8377;18,500Cr Indian missile Mg alloy programme' },
  { id: 'MGA-0005', batchNo: 'MGA-B2405', city: 'Mumbai', manufacturer: 'Tata Motors', alloyGrade: 'AZ31B (Mg-Al-Zn)', application: 'Seat Frame Assembly (Tata Nexon EV)', densityGcc: 1.78, yieldStrengthMPa: 200, investmentCr: 88, status: 'In Transit', priority: 'High', origin: 'Tata Mg Casting Pune (MH)', destination: 'Tata Motors Pune Plant (MH)', shipDate: '2026-07-21', transitDays: 2, zone: 'West', remarks: 'AZ31B magnesium seat frame for Nexon EV maximising battery range &#8594; 1.78 g/cc saving 3.2kg vs Al seat frame &#8594; &#8377;88Cr for 22 tonnes AZ31B sheet and plate &#8594; Tata Nexon EV India bestselling EV with 15,000 units/month &#8594; Every kg saved extends range by 2.5km &#8594; Tata targeting 30% Mg in EV body structures by 2029 &#8594; &#8377;8,200Cr Indian EV Mg alloy market' },
  { id: 'MGA-0006', batchNo: 'MGA-B2406', city: 'Noida', manufacturer: 'Lava International', alloyGrade: 'Mg-Li Alloy (LA103)', application: 'Laptop Chassis Frame (Lava Pro)', densityGcc: 1.45, yieldStrengthMPa: 195, investmentCr: 52, status: 'Delayed', priority: 'Medium', origin: 'Lava R&amp;D Noida (UP)', destination: 'Lava Factory Noida (UP)', shipDate: '2026-07-14', transitDays: 1, zone: 'North', remarks: 'Mg-Li ultra-light alloy laptop frame for Lava Pro enterprise laptop &#8594; 1.45 g/cc, 35% lighter than Al-Mg &#8594; &#8377;52Cr for 1.2 tonnes LA103 sheet &#8594; Lava targeting 5% enterprise laptop market share &#8594; Mg-Li alloy offers premium feel with 1.2kg total laptop weight &#8594; India importing 100% Mg-Li alloy from China &#8594; &#8377;3,800Cr Indian consumer electronics Mg market' },
  { id: 'MGA-0007', batchNo: 'MGA-B2407', city: 'Kolkata', manufacturer: 'IIT Kharagpur', alloyGrade: 'AZ61A (Mg-Al-Zn)', application: 'Railway Coach Window Frame (IRCON)', densityGcc: 1.80, yieldStrengthMPa: 225, investmentCr: 142, status: 'Delivered', priority: 'Medium', origin: 'IIT KGP Metallurgy (WB)', destination: 'IRCON Kolkata Workshop (WB)', shipDate: '2026-07-17', transitDays: 1, zone: 'East', remarks: 'AZ61A extruded window frame for Vande Bharat Express coach &#8594; 1.80 g/cc saving 5kg per window frame vs Al &#8594; &#8377;142Cr for 18 tonnes AZ61A extrusion profiles &#8594; Indian Railways operating 100+ Vande Bharat trainsets &#8594; Each trainset has 32 Mg window frames saving 160kg total &#8594; IIT KGP developing Indian railway Mg alloy standards &#8594; &#8377;7,500Cr Indian railway Mg alloy market' },
  { id: 'MGA-0008', batchNo: 'MGA-B2408', city: 'Coimbatore', manufacturer: 'TVS Motor Company', alloyGrade: 'AM50A (Mg-Al-Mn)', application: 'Motorcycle Engine Cradle (TVS Ronin)', densityGcc: 1.76, yieldStrengthMPa: 190, investmentCr: 45, status: 'Delivered', priority: 'Medium', origin: 'TVS Die Cast Hosur (TN)', destination: 'TVS Motor Mysore (KA)', shipDate: '2026-07-16', transitDays: 1, zone: 'South', remarks: 'AM50A magnesium engine cradle for TVS Ronin premium motorcycle &#8594; 1.76 g/cc saving 1.8kg vs Al cradle &#8594; &#8377;45Cr for 6 tonnes AM50A die-cast blanks &#8594; TVS Motor producing 4 million two-wheelers/year &#8594; Mg cradle improves NVH by 15% vs aluminium &#8594; TVS targeting 10% Mg parts in premium motorcycles &#8594; &#8377;4,200Cr Indian two-wheeler Mg alloy market' },
  { id: 'MGA-0009', batchNo: 'MGA-B2409', city: 'Ahmedabad', manufacturer: 'Adani Defence', alloyGrade: 'Elektron 21 (Mg-Th-Nd-Zn)', application: 'UAV Wing Spar (Adani Drishti)', densityGcc: 1.84, yieldStrengthMPa: 260, investmentCr: 175, status: 'Processing', priority: 'Critical', origin: 'Adani Defence Ahmedabad (GJ)', destination: 'Adani Aerospace Hyderabad (TS)', shipDate: '2026-07-26', transitDays: 2, zone: 'West', remarks: 'Elektron 21 rare-earth Mg alloy wing spar for Drishti MALE UAV &#8594; 1.84 g/cc with 260MPa at 200&#176;C &#8594; &#8377;175Cr for 4.5 tonnes wing spar extrusions &#8594; Adani Drishti 40h endurance 200kg payload UAV &#8594; Mg spar saves 12kg vs Al enabling 2h extra endurance &#8594; India producing 200 military UAVs/year by 2028 &#8594; &#8377;13,800Cr Indian UAV Mg alloy market' },
  { id: 'MGA-0010', batchNo: 'MGA-B2410', city: 'Jaipur', manufacturer: 'Rajasthan State Mines', alloyGrade: 'Pure Mg (99.95%)', application: 'Steel Desulfurization Reagent (SAIL Rourkela)', densityGcc: 1.74, yieldStrengthMPa: 25, investmentCr: 28, status: 'In Transit', priority: 'Medium', origin: 'RSM Smelter Jaipur (RJ)', destination: 'SAIL Rourkela Plant (OD)', shipDate: '2026-07-18', transitDays: 3, zone: 'North', remarks: 'High-purity magnesium turnings for steel ladle desulfurization &#8594; 1.74 g/cc, 25MPa yield of soft metal &#8594; &#8377;28Cr for 85 tonnes Mg turnings &#8594; SAIL Rourkela producing 4.5 MT steel/year &#8594; Mg desulfurization reduces S from 0.025% to below 0.005% &#8594; India producing 120 MT steel/year requiring 180,000 tonnes Mg reagent &#8594; &#8377;2,800Cr Indian steel desulfurization Mg market' },
  { id: 'MGA-0011', batchNo: 'MGA-B2411', city: 'Bhubaneswar', manufacturer: 'NALCO Smelter', alloyGrade: 'AZ80A (Mg-Al-Zn)', application: 'Fan Blade Hub (BHEL Bhopal)', densityGcc: 1.82, yieldStrengthMPa: 275, investmentCr: 108, status: 'Delivered', priority: 'High', origin: 'NALCO Angul (OD)', destination: 'BHEL Bhopal (MP)', shipDate: '2026-07-15', transitDays: 3, zone: 'East', remarks: 'AZ80A high-strength Mg alloy fan blade hub for 500MW steam turbine &#8594; 1.82 g/cc with 275MPa yield and 350MPa ultimate &#8594; &#8377;108Cr for 14 tonnes AZ80A forgings &#8594; BHEL India largest turbine manufacturer 42 units/year &#8594; Mg hub saves 35% weight vs Ni superalloy at 200&#176;C service &#8594; NALCO developing domestic Mg alloy production &#8594; &#8377;8,500Cr Indian power equipment Mg alloy market' },
  { id: 'MGA-0012', batchNo: 'MGA-B2412', city: 'Guwahati', manufacturer: 'Oil India Ltd', alloyGrade: 'AZ31B-F', application: 'Offshore Platform Walkway (ONGC Mumbai)', densityGcc: 1.78, yieldStrengthMPa: 200, investmentCr: 72, status: 'Delayed', priority: 'Medium', origin: 'Oil India Jorhat (AS)', destination: 'ONGC Mumbai Offshore (MH)', shipDate: '2026-07-12', transitDays: 5, zone: 'East', remarks: 'AZ31B extruded Mg alloy walkway panels for offshore platform &#8594; 1.78 g/cc with excellent corrosion resistance in marine &#8594; &#8377;72Cr for 10 tonnes walkway panels &#8594; ONGC operating 150 offshore platforms in Arabian Sea &#8594; Mg walkway saves 40% weight vs steel grating &#8594; Delayed 12 days due to monsoon shipping disruption &#8594; &#8377;5,200Cr Indian offshore Mg structural market' },
  { id: 'MGA-0013', batchNo: 'MGA-B2413', city: 'Gandhinagar', alloyGrade: 'Mg-Gd-Y-Zr (GW103)', manufacturer: 'IIT Gandhinagar', application: 'EV Battery Enclosure (Tata Nexon EV Gen2)', densityGcc: 1.90, yieldStrengthMPa: 350, investmentCr: 165, status: 'In Transit', priority: 'Critical', origin: 'IITGN Materials Lab (GJ)', destination: 'Tata Motors Pune (MH)', shipDate: '2026-07-23', transitDays: 2, zone: 'West', remarks: 'GW103 rare-earth Mg alloy battery pack enclosure for Nexon Gen2 &#8594; 1.90 g/cc with 350MPa yield, 60% stronger than AZ91 &#8594; &#8377;165Cr for 8 tonnes GW103 die-cast panels &#8594; Tata Nexon Gen2 targeting 500km range &#8594; Mg enclosure saves 12kg vs Al &#8594; IITGN developing India&amp;apos;s first GW-series pilot plant &#8594; &#8377;12,500Cr Indian EV battery enclosure Mg market' },
  { id: 'MGA-0014', batchNo: 'MGA-B2414', city: 'Lucknow', manufacturer: 'Tata Advanced Systems', alloyGrade: 'Elektron 675 (Mg-Gd-Y)', application: 'Satellite Panel Frame (ISRO GSAT-U1)', densityGcc: 1.88, yieldStrengthMPa: 320, investmentCr: 285, status: 'Processing', priority: 'Critical', origin: 'TASL Lucknow (UP)', destination: 'ISRO URSC Bengaluru (KA)', shipDate: '2026-07-27', transitDays: 2, zone: 'North', remarks: 'Elektron 675 Mg-RE alloy satellite panel frame for GSAT-U1 comsat &#8594; 1.88 g/cc with 320MPa yield at 200&#176;C &#8594; &#8377;285Cr for 3 tonnes panel frame forgings &#8594; ISRO launching 12 communication satellites by 2028 &#8594; Mg frame saves 8kg vs Al enabling 2 extra transponders &#8594; TASL ISRO JV for space-grade Mg components &#8594; &#8377;20,800Cr Indian space Mg alloy programme' },
]

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const
type TabType = typeof tabs[number]

export default function MagnesiumAlloyLogisticsView() {
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
    return magnesiumRecords.filter(r => {
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

  const totalInvestment = useMemo(() =>
    magnesiumRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])

  const cityMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of magnesiumRecords) {
      map[r.city] = (map[r.city] || 0) + r.investmentCr
    }
    return map
  }, [])

  const gradeMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of magnesiumRecords) {
      map[r.alloyGrade] = (map[r.alloyGrade] || 0) + 1
    }
    return map
  }, [])

  const statusCounts = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of magnesiumRecords) {
      map[r.status] = (map[r.status] || 0) + 1
    }
    return map
  }, [])

  const statusColorMap: Record<string, string> = {
    Delivered: 'bg-green-100 text-green-800',
    'In Transit': 'bg-blue-100 text-blue-800',
    Processing: 'bg-yellow-100 text-yellow-800',
    Delayed: 'bg-red-100 text-red-800',
  }

  const maxBarValue = Math.max(...(Object.values(cityMap) as number[]), 1)

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Magnesium Alloy Lightweight Logistics"
        description={`India lightweight magnesium alloy supply chain tracking &#8594; ${magnesiumRecords.length} shipments &#8594; ${totalInvestment.toLocaleString('en-IN')} Cr total investment &#8594; AZ91, WE43, ZK60, GW103 and more`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-teal-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-700">{magnesiumRecords.length}</div>
            <p className="text-xs text-muted-foreground">Mg alloy batches tracked</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-teal-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-700">&#8377;{totalInvestment.toLocaleString('en-IN')} Cr</div>
            <p className="text-xs text-muted-foreground">Across all manufacturers</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-teal-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Alloy Grades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-700">{Object.keys(gradeMap).length}</div>
            <p className="text-xs text-muted-foreground">Distinct Mg alloy types</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-teal-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Delayed Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{statusCounts['Delayed'] || 0}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2 border-b pb-2">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-colors ${activeTab === tab ? 'bg-teal-600 text-white shadow-sm' : 'bg-muted text-muted-foreground hover:bg-teal-100'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search magnesium alloy shipments..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        {activeTab === 'Registry' && (
          <div className="flex flex-wrap gap-2">
            {['status', 'priority', 'zone'].map(key => (
              <div key={key} className="flex flex-wrap gap-1">
                {[...new Set(magnesiumRecords.map(r => String((r as unknown as Record<string, unknown>)[key] ?? '')))].map(v => (
                  <button
                    key={v}
                    onClick={() => toggleFilter(key, v)}
                    className={`px-2 py-1 text-xs rounded-full border transition-colors ${(filters[key] || []).includes(v) ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 border-gray-300 hover:border-teal-400'}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Investment by City (&#8377; Cr)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(Object.entries(cityMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([city, val]) => (
                  <div key={city} className="flex items-center gap-3">
                    <span className="text-sm w-24 truncate text-right">{city}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 transition-all duration-500"
                        style={{ width: `${Math.max((val / maxBarValue) * 100, 1)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-16 text-right">&#8377;{val}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Alloy Grade Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {(Object.entries(gradeMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([grade, count]) => (
                  <div key={grade} className="flex items-center justify-between p-2 bg-teal-50 rounded-lg border border-teal-100">
                    <span className="text-xs font-medium truncate mr-2">{grade}</span>
                    <Badge variant="secondary" className="bg-teal-600 text-white shrink-0">{count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'Registry' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Shipment Registry ({filtered.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-teal-50">
                    <th className="text-left p-3 font-medium">Batch</th>
                    <th className="text-left p-3 font-medium">City</th>
                    <th className="text-left p-3 font-medium">Manufacturer</th>
                    <th className="text-left p-3 font-medium">Grade</th>
                    <th className="text-left p-3 font-medium">Application</th>
                    <th className="text-left p-3 font-medium">Density (g/cc)</th>
                    <th className="text-left p-3 font-medium">Yield (MPa)</th>
                    <th className="text-left p-3 font-medium">Invest (&#8377; Cr)</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.id} className={`border-b hover:bg-teal-50/50 transition-colors ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                      <td className="p-3 font-mono text-xs">{r.batchNo}</td>
                      <td className="p-3">{r.city}</td>
                      <td className="p-3 truncate max-w-[140px]">{r.manufacturer}</td>
                      <td className="p-3 text-xs">{r.alloyGrade}</td>
                      <td className="p-3 truncate max-w-[160px]">{r.application}</td>
                      <td className="p-3 text-right">{r.densityGcc}</td>
                      <td className="p-3 text-right">{r.yieldStrengthMPa}</td>
                      <td className="p-3 text-right font-medium">&#8377;{r.investmentCr}</td>
                      <td className="p-3"><Badge className={`${statusColorMap[r.status] || 'bg-gray-100'} text-xs`}>{r.status}</Badge></td>
                      <td className="p-3"><Badge variant="outline" className="text-xs">{r.priority}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(Object.entries(statusCounts) as [string, number][]).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${status === 'Delivered' ? 'bg-green-500' : status === 'In Transit' ? 'bg-blue-500' : status === 'Processing' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                      <span className="text-sm">{status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${status === 'Delivered' ? 'bg-green-500' : status === 'In Transit' ? 'bg-blue-500' : status === 'Processing' ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${(count / magnesiumRecords.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Weight Savings — Density vs Yield Strength</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {magnesiumRecords.sort((a, b) => a.densityGcc - b.densityGcc).slice(0, 8).map(r => (
                  <div key={r.id} className="flex items-center gap-3">
                    <span className="text-xs w-28 truncate">{r.alloyGrade}</span>
                    <div className="flex-1 flex gap-1 items-center">
                      <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                        <div className="h-full rounded-full bg-teal-500" style={{ width: `${(r.yieldStrengthMPa / 400) * 100}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-20 text-right">{r.yieldStrengthMPa}MPa</span>
                    </div>
                    <span className="text-xs text-muted-foreground w-14 text-right">{r.densityGcc}g/cc</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Priority Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(['Critical', 'High', 'Medium', 'Low'] as const).map(p => {
                  const count = magnesiumRecords.filter(r => r.priority === p).length
                  return (
                    <div key={p} className="flex items-center justify-between">
                      <span className="text-sm">{p}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div className="h-full rounded-full bg-teal-500" style={{ width: `${(count / magnesiumRecords.length) * 100}%` }} />
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Zone-wise Investment (&#8377; Cr)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(Object.entries(
                  magnesiumRecords.reduce((s: Record<string, number>, r) => {
                    s[r.zone] = (s[r.zone] || 0) + r.investmentCr
                    return s
                  }, {})
                ) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (
                  <div key={zone} className="flex items-center gap-3">
                    <span className="text-sm w-16">{zone}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-500" style={{ width: `${(val / totalInvestment) * 100}%` }} />
                    </div>
                    <span className="text-sm font-medium w-20 text-right">&#8377;{val}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-teal-500">
            <CardHeader>
              <CardTitle className="text-base font-semibold">EV Lightweight Revolution</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                India&amp;apos;s EV transition is creating massive magnesium alloy demand. Tata Nexon EV and Mahindra XUV700 electric variants together account for &#8377;223 Cr Mg alloy investment. AZ91D and GW103 (Mg-Gd-Y-Zr) are the key grades — GW103 offers 60% higher strength than conventional AZ91. Every kg of Mg in EV body structure extends range by 2.5km. India targeting 30 million EVs by 2030 translates to &#8377;50,000 Cr Mg alloy market.
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-teal-500">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Defence Weight Reduction Programme</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                DRDO ZK60A for Astra missile airframe and Adani Elektron 21 for UAV wing spars represent &#8377;420 Cr combined defence Mg demand. ZK60A offers 2x specific stiffness vs Al-6061, critical for missile aerodynamic performance. IIT Gandhinagar developing GW103 for EV battery enclosures. TASL and ISRO JV for Elektron 675 satellite frames targeting &#8377;20,800 Cr space Mg programme.
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-teal-500">
            <CardHeader>
              <CardTitle className="text-base font-semibold">India Mg Alloy Production Gap</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                India produces only 12% of Mg alloy consumption domestically — NALCO and Rajasthan State Mines are the primary Mg metal producers. High-value WE43 and Elektron alloys are 95% imported from UK (Magnesium Elektron) and Japan (Mitsui). DRDO DMRL developing indigenous WE43 equivalents. IIT Kharagpur establishing railway Mg alloy standards. Government&amp;apos;s Production Linked Incentive for lightweight materials offers &#8377;2,500 Cr subsidy.
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-teal-500">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Delayed Shipments Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                MGA-B2406 (Mg-Li LA103 alloy laptop frame, Noida&#8594;Noida) delayed 10 days due to Mg-Li alloy import customs hold — 100% sourced from China. MGA-B2412 (AZ31B offshore walkway, Jorhat&#8594;Mumbai) delayed 12 days due to monsoon shipping disruption in Bay of Bengal. Both shipments require urgent attention — total delayed value &#8377;124 Cr. Air freight arranged for MGA-B2406 to meet Lava Pro launch deadline.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
