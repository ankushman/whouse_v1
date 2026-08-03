'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Zap } from 'lucide-react'

interface TantalumCapacitorRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  capacitorType: string
  application: string
  capacitanceuF: number
  voltageRatingV: number
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

const tantalumRecords: TantalumCapacitorRecord[] = [
  { id: 'TAC-0001', batchNo: 'TAC-B2401', city: 'Pune', manufacturer: ' BEL Defence Pune', capacitorType: 'Wet Tantalum (Ta-MnO2)', application: 'Avionics Power Supply (HAL Tejas)', capacitanceuF: 470, voltageRatingV: 50, investmentCr: 185, status: 'Delivered', priority: 'Critical', origin: 'BEL Capacitor Div Pune (MH)', destination: 'HAL Tejas Production (KA)', shipDate: '2026-07-20', transitDays: 2, zone: 'West', remarks: 'Wet tantalum MIL-PRF-39006/25 for Tejas Mk1A flight control power supply &#8594; 470uF 50V with ultra-low ESR 15 m&#937; &#8594; &#8377;185Cr for 320,000 capacitors &#8594; HAL producing 24 Tejas Mk1A fighters/year &#8594; Wet Ta offers 10x reliability vs Al electrolytic at 125&#176;C &#8594; India importing 80% defence-grade Ta caps from USA (Kemet/Vishay) &#8594; &#8377;14,500Cr Indian defence Ta capacitor market' },
  { id: 'TAC-0002', batchNo: 'TAC-B2402', city: 'Bengaluru', manufacturer: 'DRDO LRDE', capacitorType: 'Solid Tantalum Chip (MnO2)', application: 'Phased Array Radar Module (BEL AESA)', capacitanceuF: 100, voltageRatingV: 25, investmentCr: 220, status: 'In Transit', priority: 'Critical', origin: 'DRDO LRDE Bengaluru (KA)', destination: 'BEL AESA Radar Div (KA)', shipDate: '2026-07-22', transitDays: 1, zone: 'South', remarks: 'Solid Ta chip MIL-PRF-55365 for Uttam AESA TRM decoupling &#8594; 100uF 25V 0603 case with CAGR &lt;5% &#8594; &#8377;220Cr for 850,000 chip capacitors &#8594; BEL delivering 150 Uttam AESA radars for Tejas Mk1A &#8594; Each AESA array uses 2,400 Ta chip capacitors &#8594; Solid Ta zero ignition failure mode vs wet Ta &#8594; &#8377;18,200Cr Indian AESA radar capacitor demand' },
  { id: 'TAC-0003', batchNo: 'TAC-B2403', city: 'Chennai', manufacturer: 'ISRO VSSC', capacitorType: 'Solid Tantalum (Conductive Polymer)', application: 'Satellite Reaction Wheel Driver (GSAT-N2)', capacitanceuF: 330, voltageRatingV: 35, investmentCr: 165, status: 'Delivered', priority: 'High', origin: 'ISRO VSSC Thiruvananthapuram (KL)', destination: 'ISRO URSC Bengaluru (KA)', shipDate: '2026-07-19', transitDays: 2, zone: 'South', remarks: 'Polymer Ta cap for GSAT-N2 reaction wheel motor driver &#8594; 330uF 35V with ESR 8m&#937; &#8594; &#8377;165Cr for 180,000 capacitors &#8594; ISRO launching 12 communication satellites by 2028 &#8594; Polymer Ta offers 3x lower ESR vs MnO2 types &#8594; Space-grade rated 15-year orbital life &#8594; &#8377;12,800Cr Indian space Ta capacitor demand' },
  { id: 'TAC-0004', batchNo: 'TAC-B2404', city: 'Hyderabad', manufacturer: 'Qualcomm India', capacitorType: 'Tantalum Chip (0402)', application: '5G Smartphone Power Management (Samsung Noida)', capacitanceuF: 22, voltageRatingV: 16, investmentCr: 245, status: 'In Transit', priority: 'High', origin: 'Qualcomm Hyderabad (TS)', destination: 'Samsung R&amp;D Noida (UP)', shipDate: '2026-07-21', transitDays: 2, zone: 'South', remarks: '0402 miniature Ta chip for 5G phone PMIC output filter &#8594; 22uF 16V 0402 case for &#8594; &#8377;245Cr for 12 million capacitors &#8594; India producing 320 million smartphones/year &#8594; 0402 Ta enables 40% smaller footprint vs MLCC &#8594; Samsung, Vivo, Oppo all sourcing Ta chips from Indian assembly &#8594; &#8377;22,000Cr Indian smartphone Ta capacitor market' },
  { id: 'TAC-0005', batchNo: 'TAC-B2405', city: 'Noida', manufacturer: 'Bharat Semi Noida', capacitorType: 'Tantalum Film (Sputtered)', application: 'SSD Power Rail Filter (Micron JV)', capacitanceuF: 10, voltageRatingV: 10, investmentCr: 178, status: 'Processing', priority: 'Critical', origin: 'Bharat Semi Noida (UP)', destination: 'Micron JV Pune (MH)', shipDate: '2026-07-25', transitDays: 2, zone: 'North', remarks: 'Sputtered Ta thin-film capacitor for NVMe SSD power rail &#8594; 10uF 10V with ESR &lt;50m&#937; at 1MHz &#8594; &#8377;178Cr for 4.5 million units &#8594; Micron JV targeting 500,000 SSD controllers/year &#8594; Ta thin-film integrates directly on PCB eliminating SMD assembly &#8594; Bharat Semi developing indigenous Ta sputtering &#8594; &#8377;15,500Cr Indian semiconductor Ta capacitor demand' },
  { id: 'TAC-0006', batchNo: 'TAC-B2406', city: 'Mumbai', manufacturer: 'Tata Power SED', capacitorType: 'Wet Tantalum (Hermetic)', application: 'Torpedo Fire Control (Naval Armament)', capacitanceuF: 680, voltageRatingV: 75, investmentCr: 138, status: 'Delivered', priority: 'Critical', origin: 'Tata Power SED Mumbai (MH)', destination: 'Naval Dockyard Mumbai (MH)', shipDate: '2026-07-17', transitDays: 1, zone: 'West', remarks: 'Hermetic wet Ta for torpedo fire control computer PSU &#8594; 680uF 75V MIL-PRF-39006/22 &#8594; &#8377;138Cr for 45,000 capacitors &#8594; Indian Navy operating 150+ warships and submarines &#8594; Hermetic Ta rated for 25-year submarine service &#8594; Tata Power SED sole Indian naval electronics integrator &#8594; &#8377;10,800Cr Indian naval Ta capacitor market' },
  { id: 'TAC-0007', batchNo: 'TAC-B2407', city: 'Kolkata', manufacturer: 'HIL Kolkata', capacitorType: 'Tantalum Powder (NaK Reduced)', application: 'Medical Defibrillator Energy Store (BPL Medical)', capacitanceuF: 2200, voltageRatingV: 100, investmentCr: 92, status: 'Delayed', priority: 'High', origin: 'HIL Factory Kolkata (WB)', destination: 'BPL Medical Bengaluru (KA)', shipDate: '2026-07-14', transitDays: 3, zone: 'East', remarks: 'High-energy Ta capacitor bank for hospital defibrillator &#8594; 2200uF 100V with ESR &lt;20m&#937; &#8594; &#8377;92Cr for 28,000 capacitor banks &#8594; India 80,000 hospitals with 15% defibrillator penetration &#8594; Ta capacitor delivers 360J in &lt;5ms vs 12s recharge &#8594; Delayed 10 days due to Ta powder quality issue &#8594; &#8377;6,500Cr Indian medical Ta capacitor market' },
  { id: 'TAC-0008', batchNo: 'TAC-B2408', city: 'Ahmedabad', manufacturer: 'eInfochips Torent', capacitorType: 'Solid Tantalum (Low Profile)', application: 'IoT Gateway Power Filter (Jio Platforms)', capacitanceuF: 47, voltageRatingV: 20, investmentCr: 115, status: 'Delivered', priority: 'Medium', origin: 'eInfochips Ahmedabad (GJ)', destination: 'Jio Platforms Mumbai (MH)', shipDate: '2026-07-16', transitDays: 2, zone: 'West', remarks: 'Low-profile solid Ta for Jio IoT gateway broadband modem &#8594; 47uF 20V 1.2mm profile &#8594; &#8377;115Cr for 3.2 million capacitors &#8594; Jio deploying 100 million IoT devices by 2028 &#8594; Low-profile Ta enables ultra-thin modem design &#8594; eInfochips Tata Group designing IoT reference platforms &#8594; &#8377;8,200Cr Indian IoT Ta capacitor demand' },
  { id: 'TAC-0009', batchNo: 'TAC-B2409', city: 'Coimbatore', manufacturer: 'Elgi Ultra Electronics', capacitorType: 'Tantalum Electrolytic (Axial)', application: 'Industrial UPS Filter (L&amp;T Electrical)', capacitanceuF: 1000, voltageRatingV: 50, investmentCr: 68, status: 'In Transit', priority: 'Medium', origin: 'Elgi Electronics Coimbatore (TN)', destination: 'L&amp;T Electrical Mumbai (MH)', shipDate: '2026-07-23', transitDays: 3, zone: 'South', remarks: 'Axial lead Ta electrolytic for industrial UPS input filter &#8594; 1000uF 50V 10,000h rated at 85&#176;C &#8594; &#8377;68Cr for 95,000 capacitors &#8594; L&amp;T India largest UPS manufacturer for datacenters &#8594; Ta electrolytic offers 3x ripple current vs Al electrolytic &#8594; India 500+ new datacenters by 2028 &#8594; &#8377;5,800Cr Indian UPS Ta capacitor market' },
  { id: 'TAC-0010', batchNo: 'TAC-B2410', city: 'Jaipur', manufacturer: 'Genus Power Infra', capacitorType: 'Tantalum Ceramic Hybrid', application: 'Smart Meter Filter (Genus Power)', capacitanceuF: 4.7, voltageRatingV: 50, investmentCr: 42, status: 'Delivered', priority: 'Low', origin: 'Genus Power Jaipur (RJ)', destination: 'Genus Smart Meter Plant (RJ)', shipDate: '2026-07-18', transitDays: 1, zone: 'North', remarks: 'Ta-ceramic hybrid for smart prepaid electricity meter &#8594; 4.7uF 50V with CAGR &lt;1% over 15 years &#8594; &#8377;42Cr for 28 million capacitors &#8594; India deploying 250 million smart meters by 2026 &#8594; Ta-ceramic hybrid 10x lifetime vs pure ceramic MLCC &#8594; Genus India third largest smart meter manufacturer &#8594; &#8377;3,200Cr Indian smart meter Ta capacitor market' },
  { id: 'TAC-0011', batchNo: 'TAC-B2411', city: 'Bhubaneswar', manufacturer: 'NALCO Smelter', capacitorType: 'Tantalum Powder (Sodium Reduced)', application: 'EV Inverter DC-Link (Tata Nexon EV)', capacitanceuF: 470, voltageRatingV: 63, investmentCr: 198, status: 'Processing', priority: 'Critical', origin: 'NALCO Tantalum Div (OD)', destination: 'Tata Motors Pune (MH)', shipDate: '2026-07-26', transitDays: 3, zone: 'East', remarks: 'Ta powder for EV inverter DC-link polymer Ta capacitor &#8594; 470uF 63V rated 200,000 cycle ripple &#8594; &#8377;198Cr for 8 tonnes high-CV Ta powder &#8594; Tata Nexon EV India bestselling EV 15,000/month &#8594; Polymer Ta DC-link 40% smaller than Al electrolytic bank &#8594; NALCO developing India&amp;apos;s first Ta powder reduction plant &#8594; &#8377;16,500Cr Indian EV Ta capacitor market' },
  { id: 'TAC-0012', batchNo: 'TAC-B2412', city: 'Guwahati', manufacturer: 'Oil India Ltd', capacitorType: 'Wet Tantalum (Oil-Filled)', application: 'Downhole Logging Tool (ONGC Assam)', capacitanceuF: 100, voltageRatingV: 35, investmentCr: 38, status: 'Delayed', priority: 'Medium', origin: 'Oil India Jorhat (AS)', destination: 'ONGC Nazira (AS)', shipDate: '2026-07-13', transitDays: 1, zone: 'East', remarks: 'Oil-filled wet Ta for MWD/LWD downhole logging tool &#8594; 100uF 35V rated 200&#176;C / 20,000 psi &#8594; &#8377;38Cr for 8,500 capacitors &#8594; ONGC drilling 6,000m+ wells in Assam basin &#8594; Oil-filled Ta survives 200&#176;C where MLCC derates to zero &#8594; Delayed 11 days due to monsoon logistics &#8594; &#8377;3,800Cr Indian oilfield Ta capacitor market' },
  { id: 'TAC-0013', batchNo: 'TAC-B2413', city: 'Gandhinagar', capacitorType: 'Tantalum OxiCap (NbO)', manufacturer: 'Reliance Jio Semiconductor', application: 'Server Board Bypass (Microsoft Hyderabad DC)', capacitanceuF: 22, voltageRatingV: 10, investmentCr: 155, status: 'In Transit', priority: 'High', origin: 'Jio Semiconductor Gandhinagar (GJ)', destination: 'Microsoft DC Hyderabad (TS)', shipDate: '2026-07-23', transitDays: 2, zone: 'West', remarks: 'NbO OxiCap for Azure server board power rail bypass &#8594; 22uF 10V 0201 case with zero ignition &#8594; &#8377;155Cr for 8.5 million capacitors &#8594; Microsoft Azure operating 6 datacenters in India &#8594; OxiCap 50% cheaper than Ta with comparable reliability &#8594; Jio Semiconductor developing NbO production &#8594; &#8377;12,200Cr Indian datacenter Ta capacitor market' },
  { id: 'TAC-0014', batchNo: 'TAC-B2414', city: 'Lucknow', manufacturer: 'DRDO TBRL', capacitorType: 'Tantalum Energy Bank', application: 'EMP Weapon Simulator (DRDO INRSA)', capacitanceuF: 10000, voltageRatingV: 500, investmentCr: 285, status: 'Processing', priority: 'Critical', origin: 'DRDO TBRL Chandigarh (PB)', destination: 'DRDO INRSA Hyderabad (TS)', shipDate: '2026-07-27', transitDays: 2, zone: 'North', remarks: 'High-energy Ta capacitor bank for EMP hardness testing facility &#8594; 10,000uF 500V bank storing 1.25kJ per module &#8594; &#8377;285Cr for 12 energy bank modules &#8594; DRDO testing Indian military systems to MIL-STD-188-125 EMP &#8594; Ta energy bank delivers microsecond pulse vs Al electrolytic millisecond &#8594; India first EMP test facility outside Russia and USA &#8594; &#8377;22,800Cr Indian defence EMP capacitor programme' },
]

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const
type TabType = typeof tabs[number]

export default function TantalumCapacitorLogisticsView() {
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
    return tantalumRecords.filter(r => {
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
    tantalumRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])

  const cityMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of tantalumRecords) {
      map[r.city] = (map[r.city] || 0) + r.investmentCr
    }
    return map
  }, [])

  const typeMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of tantalumRecords) {
      map[r.capacitorType] = (map[r.capacitorType] || 0) + 1
    }
    return map
  }, [])

  const statusCounts = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of tantalumRecords) {
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
        title="Tantalum Capacitor Electronics Logistics"
        description={`India tantalum capacitor supply chain tracking &#8594; ${tantalumRecords.length} shipments &#8594; ${totalInvestment.toLocaleString('en-IN')} Cr total investment &#8594; Defence, 5G, space, EV and more`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{tantalumRecords.length}</div>
            <p className="text-xs text-muted-foreground">Ta capacitor batches tracked</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">&#8377;{totalInvestment.toLocaleString('en-IN')} Cr</div>
            <p className="text-xs text-muted-foreground">Across all manufacturers</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Capacitor Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{Object.keys(typeMap).length}</div>
            <p className="text-xs text-muted-foreground">Distinct Ta capacitor types</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-600">
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
            className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-colors ${activeTab === tab ? 'bg-red-600 text-white shadow-sm' : 'bg-muted text-muted-foreground hover:bg-red-100'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search tantalum capacitor shipments..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        {activeTab === 'Registry' && (
          <div className="flex flex-wrap gap-2">
            {['status', 'priority', 'zone'].map(key => (
              <div key={key} className="flex flex-wrap gap-1">
                {[...new Set(tantalumRecords.map(r => String((r as unknown as Record<string, unknown>)[key] ?? '')))].map(v => (
                  <button
                    key={v}
                    onClick={() => toggleFilter(key, v)}
                    className={`px-2 py-1 text-xs rounded-full border transition-colors ${(filters[key] || []).includes(v) ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-600 border-gray-300 hover:border-red-400'}`}
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
                        className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-600 transition-all duration-500"
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
              <CardTitle className="text-lg">Capacitor Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {(Object.entries(typeMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between p-2 bg-red-50 rounded-lg border border-red-100">
                    <span className="text-xs font-medium truncate mr-2">{type}</span>
                    <Badge variant="secondary" className="bg-red-600 text-white shrink-0">{count}</Badge>
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
                  <tr className="border-b bg-red-50">
                    <th className="text-left p-3 font-medium">Batch</th>
                    <th className="text-left p-3 font-medium">City</th>
                    <th className="text-left p-3 font-medium">Manufacturer</th>
                    <th className="text-left p-3 font-medium">Type</th>
                    <th className="text-left p-3 font-medium">Application</th>
                    <th className="text-left p-3 font-medium">Cap (uF)</th>
                    <th className="text-left p-3 font-medium">Voltage (V)</th>
                    <th className="text-left p-3 font-medium">Invest (&#8377; Cr)</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.id} className={`border-b hover:bg-red-50/50 transition-colors ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                      <td className="p-3 font-mono text-xs">{r.batchNo}</td>
                      <td className="p-3">{r.city}</td>
                      <td className="p-3 truncate max-w-[140px]">{r.manufacturer}</td>
                      <td className="p-3 text-xs truncate max-w-[140px]">{r.capacitorType}</td>
                      <td className="p-3 truncate max-w-[160px]">{r.application}</td>
                      <td className="p-3 text-right">{r.capacitanceuF.toLocaleString()}</td>
                      <td className="p-3 text-right">{r.voltageRatingV}</td>
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
                          style={{ width: `${(count / tantalumRecords.length) * 100}%` }}
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
              <CardTitle className="text-lg">Capacitance Range Distribution (uF)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tantalumRecords.sort((a, b) => b.capacitanceuF - a.capacitanceuF).slice(0, 8).map(r => (
                  <div key={r.id} className="flex items-center gap-3">
                    <span className="text-xs w-28 truncate">{r.capacitorType}</span>
                    <div className="flex-1 flex gap-1 items-center">
                      <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                        <div className="h-full rounded-full bg-red-500" style={{ width: `${Math.min((r.capacitanceuF / 10000) * 100, 100)}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-16 text-right">{r.capacitanceuF.toLocaleString()}uF</span>
                    </div>
                    <span className="text-xs text-muted-foreground w-14 text-right">{r.voltageRatingV}V</span>
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
                  const count = tantalumRecords.filter(r => r.priority === p).length
                  return (
                    <div key={p} className="flex items-center justify-between">
                      <span className="text-sm">{p}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div className="h-full rounded-full bg-red-500" style={{ width: `${(count / tantalumRecords.length) * 100}%` }} />
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
                  tantalumRecords.reduce((s: Record<string, number>, r) => {
                    s[r.zone] = (s[r.zone] || 0) + r.investmentCr
                    return s
                  }, {})
                ) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (
                  <div key={zone} className="flex items-center gap-3">
                    <span className="text-sm w-16">{zone}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-red-400 to-rose-500" style={{ width: `${(val / totalInvestment) * 100}%` }} />
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
          <Card className="border-l-4 border-l-red-600">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Defence Tantalum Dependency</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                India imports 80% of defence-grade tantalum capacitors from USA (Kemet/Sunlord) and Japan (Panasonic). BEL Pune and DRDO LRDE together account for &#8377;405 Cr of &#8377;2,332 Cr total Ta capacitor demand. Tejas Mk1A AESA radar alone needs 2,400 Ta chip capacitors per unit across 150 aircraft. Establishing indigenous MIL-spec Ta capacitor line at BEL is critical — estimated &#8377;1,200 Cr investment for 60% import substitution by 2029.
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-600">
            <CardHeader>
              <CardTitle className="text-base font-semibold">5G and Smartphone Boom</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                India producing 320 million smartphones/year creates &#8377;22,000 Cr tantalum chip capacitor demand. Qualcomm India and Samsung R&amp;D Noida drive miniaturization to 0402 and 0201 cases. Each 5G smartphone uses 80-120 Ta chip capacitors for RF and PMIC filtering. Jio Semiconductor&amp;apos;s OxiCap (NbO) development offers 50% cost reduction path with comparable reliability.
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-600">
            <CardHeader>
              <CardTitle className="text-base font-semibold">NALCO Tantalum Powder Ambition</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                NALCO Odisha is developing India&amp;apos;s first indigenous sodium-reduced tantalum powder plant, leveraging domestic ore from Bastar (Chhattisgarh). Current &#8377;198 Cr EV inverter capacitor programme depends entirely on imported Ta powder from Cabot Corp (USA) and Showa Denko (Japan). NALCO pilot plant targeting 50 tonnes/year high-CV powder by Q4 2028, sufficient for 30% EV capacitor demand.
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-600">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Delayed Shipments Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                TAC-B2407 (medical defibrillator Ta cap bank, Kolkata&#8594;Bengaluru) delayed 10 days due to tantalum powder quality rejection — CV value below MIL spec. TAC-B2412 (downhole oil-filled wet Ta, Jorhat&#8594;Nazira) delayed 11 days due to monsoon flooding blocking NH-37. Total delayed value &#8377;130 Cr. Defibrillator shipment escalated to air freight to meet hospital installation deadline.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
