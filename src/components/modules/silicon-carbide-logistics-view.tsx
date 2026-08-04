'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { CircuitBoard } from 'lucide-react'

interface SiliconCarbideRecord {
  id: string
  batchNo: string
  city: string
  foundry: string
  deviceType: string
  application: string
  voltageClassV: number
  efficiency: number
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

const siliconCarbideRecords: SiliconCarbideRecord[] = [
  { id: 'SIC-0001', batchNo: 'SIC-B2401', city: 'Bengaluru', foundry: 'Moser Baer SiC', deviceType: 'SiC MOSFET 1200V', application: 'EV Inverter (Tata Nexon)', voltageClassV: 1200, efficiency: 99.2, investmentCr: 185, status: 'In Transit', priority: 'Critical', origin: 'Mosergate Bengaluru (KA)', destination: 'Tata Motors Pune (MH)', shipDate: '2026-07-22', transitDays: 1, zone: 'South', remarks: 'Moser Baer 1200V SiC MOSFET module for Tata Nexon EV Gen3 inverter &#8594; 99.2% efficiency vs 97.5% IGBT &#8594; &#8377;185Cr for 25,000 modules &#8594; 8% range improvement on Nexon &#8594; Moser Baer India&apos;s first SiC foundry at 100,000 wafer/year &#8594; JV with Infineon for 200mm SiC epitaxy &#8594; targeting &#8377;2,200Cr SiC revenue by 2029' },
  { id: 'SIC-0002', batchNo: 'SIC-B2402', city: 'Gandhinagar', foundry: 'Sarda Energy SiC', deviceType: 'SiC Schottky 650V', application: 'Solar Inverter (Adani Solar)', voltageClassV: 650, efficiency: 98.8, investmentCr: 120, status: 'Delivered', priority: 'High', origin: 'Sarda Gandhinagar (GJ)', destination: 'Adani Solar Mundra (GJ)', shipDate: '2026-07-18', transitDays: 1, zone: 'West', remarks: 'Sarda Energy 650V SiC Schottky diode for Adani solar string inverter &#8594; 98.8% efficiency reduces inverter losses by 30% &#8594; &#8377;120Cr for 50,000 diodes &#8594; deployed at 2 GW Bhadla solar farm &#8594; Sarda SiC from indigenous carbothermic reduction of Gujarat silica sand &#8594; 40% cheaper than imported Wolfspeed &#8594; Adani ordering 200,000 diodes for 10 GW pipeline' },
  { id: 'SIC-0003', batchNo: 'SIC-B2403', city: 'Hyderabad', foundry: 'IIT-H SiC Lab', deviceType: 'SiC MOSFET 3300V', application: 'Railway Traction (Medha)', voltageClassV: 3300, efficiency: 99.5, investmentCr: 245, status: 'In Transit', priority: 'Critical', origin: 'IIT-H Research Park (TS)', destination: 'Medha servo Chennai (TN)', shipDate: '2026-07-20', transitDays: 2, zone: 'South', remarks: 'IIT Hyderabad 3300V SiC MOSFET for Medha railway traction converter &#8594; 99.5% efficiency vs 98% GTO thyristor &#8594; &#8377;245Cr for 500 converter modules &#8594; Indian Railways Vande Bharat Express regenerative braking &#8594; 15% energy recovery improvement &#8594; IIT-H developed 4H-SiC epitaxy on indigenous boules &#8594; DRDO funding &#8377;350Cr for national SiC foundry at Hyderabad' },
  { id: 'SIC-0004', batchNo: 'SIC-B2404', city: 'Pune', foundry: 'L&T Semiconductor', deviceType: 'SiC MOSFET 1700V', application: 'Wind Turbine Converter (Suzlon)', voltageClassV: 1700, efficiency: 99.3, investmentCr: 195, status: 'Processing', priority: 'High', origin: 'L&T Semiconductor Pune (MH)', destination: 'Suzlon Wind Pune (MH)', shipDate: '2026-07-25', transitDays: 1, zone: 'West', remarks: 'L&T Semiconductor 1700V SiC MOSFET for Suzlon S128 4 MW wind turbine full-scale converter &#8594; 99.3% efficiency enables 98.5% system efficiency &#8594; &#8377;195Cr for 2,000 modules &#8594; L&T fab at Dholera producing 150mm SiC wafers &#8594; Suzlon ordering for next 5 GW wind installation &#8594; &#8377;2,500Cr total SiC content &#8594; targeting 99.5% with Gen-2 module' },
  { id: 'SIC-0005', batchNo: 'SIC-B2405', city: 'Noida', foundry: 'STMicroelectronics India', deviceType: 'SiC Diode 1200V', application: 'EV Charger (ABB India)', voltageClassV: 1200, efficiency: 98.5, investmentCr: 160, status: 'Delivered', priority: 'High', origin: 'STM Noida Greater (UP)', destination: 'ABB Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 2, zone: 'North', remarks: 'STMicroelectronics 1200V SiC bipolar diode for ABB 150kW DC fast charger &#8594; 98.5% efficiency enables 96% charger efficiency &#8594; &#8377;160Cr for 30,000 diodes &#8594; STM Noida fab using 150mm SiC wafers from Norstel &#8594; ABB deploying 10,000 chargers under FAME III &#8594; SiC reduces charger size 40% vs silicon IGBT &#8594; STM targeting &#8377;3,500Cr India SiC revenue by 2028' },
  { id: 'SIC-0006', batchNo: 'SIC-B2406', city: 'Chennai', foundry: 'Tata PowerSiC', deviceType: 'SiC MOSFET 900V', application: 'Datacenter UPS (CtrlS)', voltageClassV: 900, efficiency: 99.1, investmentCr: 88, status: 'Delayed', priority: 'Medium', origin: 'Tata PowerSiC Chennai (TN)', destination: 'CtrlS Mumbai (MH)', shipDate: '2026-07-10', transitDays: 6, zone: 'South', remarks: 'Tata PowerSiC 900V MOSFET for CtrlS datacenter UPS power factor correction &#8594; 99.1% efficiency reduces UPS losses by 25% &#8594; &#8377;88Cr for 8,000 modules &#8594; 6-day delay: 900V SiC wafer yield at 72% below 85% target &#8594; Tata PowerSiC adjusting epitaxy temperature profile &#8594; CtrlS Mumbai datacenter expanding 50 MW &#8594; Tata PowerSiC JV with onsemi for India fab &#8594; commissioning 200mm line by Q2 2027' },
  { id: 'SIC-0007', batchNo: 'SIC-B2407', city: 'Mumbai', foundry: 'Godrej Power Electronics', deviceType: 'SiC JFET 1200V', application: 'Industrial Motor Drive (ABB)', voltageClassV: 1200, efficiency: 99.4, investmentCr: 135, status: 'In Transit', priority: 'High', origin: 'Godrej Mumbai (MH)', destination: 'ABB Baroda (GJ)', shipDate: '2026-07-21', transitDays: 2, zone: 'West', remarks: 'Godrej 1200V SiC JFET cascode for ABB industrial motor drive ACS880 &#8594; 99.4% efficiency reduces motor energy consumption 8% &#8594; &#8377;135Cr for 15,000 modules &#8594; deployed at Reliance Jamnagar petrochemical plant &#8594; 500 HP motor drive applications &#8594; Godrey developed indigenous SiC JFET fabrication process &#8594; no normally-on gate oxide reliability issue &#8594; targeting &#8377;800Cr annual SiC motor drive revenue by 2028' },
  { id: 'SIC-0008', batchNo: 'SIC-B2408', city: 'Kolkata', foundry: 'CESC PowerSiC', deviceType: 'SiC MOSFET 3300V', application: 'HVDC Converter (PowerGrid)', voltageClassV: 3300, efficiency: 99.6, investmentCr: 310, status: 'Processing', priority: 'Critical', origin: 'CESC Kolkata (WB)', destination: 'PGCIL Vizag (AP)', shipDate: '2026-07-26', transitDays: 4, zone: 'East', remarks: 'CESC 3300V SiC MOSFET for PowerGrid Vizag HVDC converter station &#8594; 99.6% efficiency world-record for HVDC &#8594; &#8377;310Cr for 200 converter valves &#8594; enabling 3,200 MW +/- 500kV HVDC link &#8594; reduces converter station footprint 50% vs silicon thyristor &#8594; PowerGrid India targeting 25 GW HVDC by 2030 with SiC conversion &#8594; CESC developing from DRDO SiC program &#8594; first indigenous 3300V SiC device' },
  { id: 'SIC-0009', batchNo: 'SIC-B2409', city: 'Jaipur', foundry: 'Rajasthan Rare Earth SiC', deviceType: 'SiC Schottky 1200V', application: 'EV Charging Pile (CharIN)', voltageClassV: 1200, efficiency: 98.6, investmentCr: 72, status: 'Delivered', priority: 'Medium', origin: 'RRE Jaipur (RJ)', destination: 'Exicom Noida (UP)', shipDate: '2026-07-15', transitDays: 2, zone: 'North', remarks: 'RRE 1200V SiC Schottky for Exicom 30kW EV AC wallbox charger &#8594; 98.6% efficiency &#8594; &#8377;72Cr for 20,000 diodes &#8594; Exicom deploying 50,000 wallbox chargers under PM EDRIVE &#8594; SiC enables fanless charger design &#8594; RRE sourcing SiC wafers from US-based II-VI India subsidiary &#8594; targeting 100,000 wafer/year SiC polishing facility at Udaipur &#8594; &#8377;450Cr investment' },
  { id: 'SIC-0010', batchNo: 'SIC-B2410', city: 'Coimbatore', foundry: 'ELGi SiC Drives', deviceType: 'SiC MOSFET 650V', application: 'Compressor VFD (ELGi)', voltageClassV: 650, efficiency: 98.9, investmentCr: 55, status: 'In Transit', priority: 'Medium', origin: 'ELGi Coimbatore (TN)', destination: 'ELGi Pantnagar (UK)', shipDate: '2026-07-19', transitDays: 2, zone: 'South', remarks: 'ELGi 650V SiC MOSFET for ELGi air compressor variable frequency drive &#8594; 98.9% efficiency vs 97.2% silicon IGBT &#8594; &#8377;55Cr for 10,000 modules &#8594; 12% energy saving on 100HP compressor &#8594; ELGi India&apos;s largest compressor OEM &#8594; VFD retrofit market worth &#8377;1,200Cr &#8594; SiC VFD enabling IE5 super-premium efficiency &#8594; ELGi targeting 30% SiC VFD share by 2029' },
  { id: 'SIC-0011', batchNo: 'SIC-B2411', city: 'Bhubaneswar', foundry: 'NALCO SiC Materials', deviceType: 'SiC Substrate 150mm', application: 'Foundry Wafer Supply (Moser)', voltageClassV: 0, efficiency: 0, investmentCr: 420, status: 'In Transit', priority: 'Critical', origin: 'NALCO Bhubaneswar (OD)', destination: 'Moser Baer Bengaluru (KA)', shipDate: '2026-07-20', transitDays: 3, zone: 'East', remarks: 'NALCO 150mm semi-insulating 4H-SiC substrate boule for Moser Baer epitaxy &#8594; India&apos;s first indigenous SiC substrate &#8594; &#8377;420Cr for 5,000 wafers &#8594; NALCO carbothermic reduction of aluminium-smelter-grade SiO2 &#8594; PVT crystal growth at 2,200&#176;C &#8594; eliminating 100% import dependency from Wolfspeed/CoorsTek &#8594; NALCO targeting 100,000 wafer/year SiC substrate plant at Angul by 2029 &#8594; &#8377;4,500Cr investment approved' },
  { id: 'SIC-0012', batchNo: 'SIC-B2412', city: 'Ahmedabad', foundry: 'eInfochips SiC Design', deviceType: 'SiC Gate Driver ASIC', application: 'SiC Module Driver (Infineon)', voltageClassV: 1200, efficiency: 99.0, investmentCr: 65, status: 'Delivered', priority: 'High', origin: 'eInfochips Ahmedabad (GJ)', destination: 'Infineon Bangalore (KA)', shipDate: '2026-07-17', transitDays: 2, zone: 'West', remarks: 'eInfochips designed 1200V SiC gate driver ASIC for Infineon HybridPACK Drive &#8594; 99.0% driver efficiency &#8594; &#8377;65Cr design fee for IP license &#8594; ASIC fabricated at TSMC 28nm &#8594; gate driver critical for SiC MOSFET switching performance &#8594; eInfochips 50-person SiC design team &#8594; Infineon using in Indian EV inverter modules &#8594; eInfochips targeting SiC IP portfolio of 15 patents by 2028' },
  { id: 'SIC-0013', batchNo: 'SIC-B2413', city: 'Guwahati', foundry: 'IOCL Green SiC', deviceType: 'SiC Heating Element', application: 'High-Temp Furnace (CSIR)', voltageClassV: 0, efficiency: 95.0, investmentCr: 42, status: 'Processing', priority: 'Low', origin: 'IOCL Guwahati (Assam)', destination: 'CSIR-NPL New Delhi (DL)', shipDate: '2026-07-24', transitDays: 3, zone: 'East', remarks: 'IOCL Guwahati producing SiC heating elements from petroleum coke by-product &#8594; 95% heating efficiency at 1,600&#176;C &#8594; &#8377;42Cr for 2,000 elements &#8594; CSIR-NPL high-temperature materials testing furnace &#8594; SiC heating elements last 3x longer than metallic elements &#8594; IOCL leveraging Assam refinery coke for SiC sintering &#8594; novel petroleum-industry-to-semiconductor pathway &#8594; IOCL targeting 50,000 element/year plant by 2028' },
  { id: 'SIC-0014', batchNo: 'SIC-B2414', city: 'Thiruvananthapuram', foundry: 'VSSC ISRO SiC', deviceType: 'SiC MOSFET 1700V Radiation', application: 'Satellite Power System (ISRO)', voltageClassV: 1700, efficiency: 99.3, investmentCr: 280, status: 'Delayed', priority: 'Critical', origin: 'VSSC Thiruvananthapuram (KL)', destination: 'ISAC Bengaluru (KA)', shipDate: '2026-07-08', transitDays: 10, zone: 'South', remarks: 'VSSC radiation-hardened 1700V SiC MOSFET for GSAT-N2 satellite power management unit &#8594; 99.3% efficiency with TID tolerance 300 krad &#8594; &#8377;280Cr for 200 flight-qualified modules &#8594; 10-day delay: proton irradiation at Pelletron revealed single-event burnout at 125MeV &#8594; VSSC redesigning epitaxial buffer thickness from 5um to 10um &#8594; ISRO qualifying for 15-year GEO mission &#8594; VSSC SiC fab at Vikram Sarabhai Space Centre &#8594; first space-grade SiC from India' },
]

const filters = [
  { label: 'Device Type', key: 'deviceType', options: ['SiC MOSFET 1200V', 'SiC Schottky 650V', 'SiC MOSFET 3300V', 'SiC MOSFET 1700V', 'SiC Diode 1200V', 'SiC MOSFET 900V', 'SiC JFET 1200V', 'SiC MOSFET 650V', 'SiC Substrate 150mm', 'SiC Gate Driver ASIC', 'SiC Heating Element', 'SiC MOSFET 1700V Radiation'] },
  { label: 'Application', key: 'application', options: ['EV Inverter', 'Solar Inverter', 'Railway Traction', 'Wind Turbine Converter', 'EV Charger', 'Datacenter UPS', 'Industrial Motor Drive', 'HVDC Converter', 'EV Charging Pile', 'Compressor VFD', 'Foundry Wafer Supply', 'Satellite Power System'] },
  { label: 'Zone', key: 'zone', options: ['North', 'South', 'East', 'West'] },
  { label: 'Status', key: 'status', options: ['In Transit', 'Delivered', 'Processing', 'Delayed'] },
]

export default function SiliconCarbideLogisticsView() {
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
    return siliconCarbideRecords.filter(r => {
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.deviceType} ${r.application} ${r.foundry} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false
      for (const [key, values] of Object.entries(activeFilters)) {
        if (values.length > 0 && !values.includes(String(r[key as keyof SiliconCarbideRecord]))) return false
      }
      return true
    })
  }, [searchQuery, activeFilters])

  const kpis = useMemo(() => {
    const total = siliconCarbideRecords.length
    const totalInvestment = siliconCarbideRecords.reduce((s: number, r) => s + r.investmentCr, 0)
    const powerRecords = siliconCarbideRecords.filter(r => r.efficiency > 0)
    const avgEfficiency = powerRecords.length > 0 ? (powerRecords.reduce((s: number, r) => s + r.efficiency, 0) / powerRecords.length).toFixed(1) : '0'
    const delayed = siliconCarbideRecords.filter(r => r.status === 'Delayed').length
    return [
      { label: 'Total Batches', value: total, suffix: ' shipments', color: 'text-emerald-700' },
      { label: 'Total Investment', value: `${(totalInvestment / 1000).toFixed(1)}K`, suffix: ` Cr`, color: 'text-emerald-700' },
      { label: 'Avg Efficiency', value: avgEfficiency, suffix: ' %', color: 'text-emerald-700' },
      { label: 'Delayed', value: delayed, suffix: ' batches', color: 'text-red-600' },
    ]
  }, [])

  const deviceDistribution = useMemo(() => {
    const map = new Map<string, number>()
    siliconCarbideRecords.forEach(r => { map.set(r.deviceType.split(' ').slice(0, 3).join(' '), (map.get(r.deviceType.split(' ').slice(0, 3).join(' ')) || 0) + 1) })
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1])
  }, [])

  const appDistribution = useMemo(() => {
    const map = new Map<string, number>()
    siliconCarbideRecords.forEach(r => { map.set(r.application.split(' ')[0], (map.get(r.application.split(' ')[0]) || 0) + 1) })
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8)
  }, [])

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>()
    siliconCarbideRecords.forEach(r => { map.set(r.zone, (map.get(r.zone) || 0) + 1) })
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1])
  }, [])

  const efficiencyByApp = useMemo(() => {
    const map: Record<string, number> = {}
    const cnt: Record<string, number> = {}
    siliconCarbideRecords.filter(r => r.efficiency > 0).forEach(r => { const k = r.application.split(' ')[0]; map[k] = (map[k] || 0) + r.efficiency; cnt[k] = (cnt[k] || 0) + 1 })
    return (Object.entries(map) as [string, number][]).map(([k, v]) => [k, parseFloat((v / cnt[k]).toFixed(1))] as [string, number]).sort((a, b) => b[1] - a[1])
  }, [])

  const investmentByZone = useMemo(() => {
    const map: Record<string, number> = {}
    siliconCarbideRecords.forEach(r => { map[r.zone] = (map[r.zone] || 0) + r.investmentCr })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const statusBreakdown = useMemo(() => {
    const map = new Map<string, number>()
    siliconCarbideRecords.forEach(r => { map.set(r.status, (map.get(r.status) || 0) + 1) })
    return Array.from(map.entries())
  }, [])

  const voltageByType = useMemo(() => {
    const map: Record<string, number> = {}
    siliconCarbideRecords.filter(r => r.voltageClassV > 0).forEach(r => { const k = r.deviceType.split(' ')[1]; map[k] = Math.max(map[k] || 0, r.voltageClassV) })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const transitByZone = useMemo(() => {
    const map: Record<string, number> = {}
    const cnt: Record<string, number> = {}
    siliconCarbideRecords.forEach(r => { map[r.zone] = (map[r.zone] || 0) + r.transitDays; cnt[r.zone] = (cnt[r.zone] || 0) + 1 })
    return (Object.entries(map) as [string, number][]).map(([k, v]) => [k, Math.round(v / cnt[k])] as [string, number]).sort((a, b) => b[1] - a[1])
  }, [])

  const tabs = ['dashboard', 'registry', 'analytics', 'insights'] as const

  return (
    <div className="space-y-4 p-4">
      <PageHeader title="Silicon Carbide Logistics" description="Indian SiC semiconductor supply chain &#8212; MOSFET, Schottky diode, JFET, substrate and gate driver ASIC for EV inverters, solar, railway traction, wind, HVDC and satellite power" />

      <div className="flex gap-2 border-b pb-2">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 text-sm rounded-t-lg capitalize sic-tab-btn ${activeTab === tab ? 'bg-emerald-700 text-white sic-tab-active' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}>{tab}</button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {kpis.map(kpi => <Card key={kpi.label} className="sic-kpi-card border-l-4 border-l-emerald-600"><CardContent className="p-3"><p className="text-xs text-muted-foreground">{kpi.label}</p><p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}<span className="text-xs font-normal ml-1">{kpi.suffix}</span></p></CardContent></Card>)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="sic-chart-card"><CardHeader><CardTitle className="text-sm">Shipments by Device Type</CardTitle></CardHeader><CardContent className="space-y-2">{deviceDistribution.map(([device, count]) => <div key={device} className="flex items-center gap-2"><span className="text-xs w-28 truncate">{device}</span><div className="flex-1 bg-emerald-50 rounded-full h-2"><div className="bg-emerald-600 h-2 rounded-full sic-bar" style={{ width: `${(count / 3) * 100}%` }}></div></div><span className="text-xs font-medium">{count}</span></div>)}</CardContent></Card>
            <Card className="sic-chart-card"><CardHeader><CardTitle className="text-sm">Investment by Zone (&#8377; Cr)</CardTitle></CardHeader><CardContent className="space-y-2">{investmentByZone.map(([zone, inv]) => <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-emerald-50 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full sic-bar" style={{ width: `${(inv / 1500) * 100}%` }}></div></div><span className="text-xs font-medium">{inv}</span></div>)}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Input placeholder="Search ID, batch, device, foundry, application..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="h-8 text-sm sic-search-input" />
            {filters.map(f => (
              <div key={f.key} className="flex gap-1 flex-wrap sic-filter-group">
                {f.options.slice(0, 4).map(opt => (
                  <Badge key={opt} variant={activeFilters[f.key]?.includes(opt) ? 'default' : 'outline'} className="cursor-pointer text-xs sic-filter-badge" onClick={() => toggleFilter(f.key, opt)}>{opt}</Badge>
                ))}
              </div>
            ))}
          </div>
          <div className="overflow-x-auto sic-table-wrap">
            <table className="w-full text-xs sic-data-table">
              <thead><tr className="border-b sic-table-header"><th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Batch</th><th className="px-2 py-2 text-left">Foundry</th><th className="px-2 py-2 text-left">Device</th><th className="px-2 py-2 text-left">Application</th><th className="px-2 py-2 text-right">Voltage</th><th className="px-2 py-2 text-right">Eff %</th><th className="px-2 py-2 text-right">Invest</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-right">Days</th></tr></thead>
              <tbody>
                {filteredRecords.map(r => (
                  <tr key={r.id} className={`border-b sic-table-row ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-emerald-500'}`}>
                    <td className="px-2 py-2 font-mono">{r.id}</td>
                    <td className="px-2 py-2">{r.batchNo}</td>
                    <td className="px-2 py-2 truncate max-w-[100px]">{r.foundry}</td>
                    <td className="px-2 py-2 truncate max-w-[120px]">{r.deviceType.split(' ').slice(0, 3).join(' ')}</td>
                    <td className="px-2 py-2 truncate max-w-[120px]">{r.application}</td>
                    <td className="px-2 py-2 text-right font-medium">{r.voltageClassV || '-'}</td>
                    <td className="px-2 py-2 text-right">{r.efficiency || '-'}</td>
                    <td className="px-2 py-2 text-right">{r.investmentCr}</td>
                    <td className="px-2 py-2"><Badge variant={r.status === 'Delayed' ? 'destructive' : r.status === 'Delivered' ? 'default' : 'secondary'} className="text-xs sic-status-badge">{r.status}</Badge></td>
                    <td className="px-2 py-2 text-right">{r.transitDays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="sic-chart-card"><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{statusBreakdown.map(([s, c]) => <div key={s} className="flex items-center gap-2"><span className="text-xs w-20">{s}</span><div className="flex-1 bg-emerald-50 rounded-full h-2"><div className={`h-2 rounded-full sic-bar ${s === 'Delayed' ? 'bg-red-500' : s === 'Delivered' ? 'bg-green-500' : s === 'In Transit' ? 'bg-blue-500' : 'bg-yellow-500'}`} style={{ width: `${(c / 14) * 100}%` }}></div></div><span className="text-xs font-medium">{c}</span></div>)}</CardContent></Card>
            <Card className="sic-chart-card"><CardHeader><CardTitle className="text-sm">Voltage Class by Device</CardTitle></CardHeader><CardContent className="space-y-2">{voltageByType.map(([type, volt]) => <div key={type} className="flex items-center gap-2"><span className="text-xs w-20 truncate">{type}</span><div className="flex-1 bg-emerald-50 rounded-full h-2"><div className="bg-emerald-600 h-2 rounded-full sic-bar" style={{ width: `${(volt / 3500) * 100}%` }}></div></div><span className="text-xs font-medium">{volt}V</span></div>)}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="sic-chart-card"><CardHeader><CardTitle className="text-sm">Efficiency by Application (%)</CardTitle></CardHeader><CardContent className="space-y-2">{efficiencyByApp.map(([app, eff]) => <div key={app} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{app}</span><div className="flex-1 bg-emerald-50 rounded-full h-2"><div className="bg-emerald-700 h-2 rounded-full sic-bar" style={{ width: `${(eff / 100) * 100}%` }}></div></div><span className="text-xs font-medium">{eff}%</span></div>)}</CardContent></Card>
          <Card className="sic-chart-card"><CardHeader><CardTitle className="text-sm">Application Sector Split</CardTitle></CardHeader><CardContent className="space-y-2">{appDistribution.map(([app, count]) => <div key={app} className="flex items-center gap-2"><span className="text-xs w-24 truncate">{app}</span><div className="flex-1 bg-emerald-50 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full sic-bar" style={{ width: `${(count / 3) * 100}%` }}></div></div><span className="text-xs font-medium">{count}</span></div>)}</CardContent></Card>
          <Card className="sic-chart-card"><CardHeader><CardTitle className="text-sm">Avg Transit Days by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{transitByZone.map(([zone, days]) => <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-emerald-50 rounded-full h-2"><div className="bg-emerald-600 h-2 rounded-full sic-bar" style={{ width: `${(days / 10) * 100}%` }}></div></div><span className="text-xs font-medium">{days}d</span></div>)}</CardContent></Card>
          <Card className="sic-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{zoneDistribution.map(([zone, count]) => <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-emerald-50 rounded-full h-2"><div className="bg-emerald-400 h-2 rounded-full sic-bar" style={{ width: `${(count / 6) * 100}%` }}></div></div><span className="text-xs font-medium">{count}</span></div>)}</CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="sic-insight-card border-l-4 border-l-emerald-700"><CardHeader><CardTitle className="text-sm text-emerald-800">India&apos;s SiC Ambition: 10% Global Wafer Supply by 2030</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">India targeting 10% of global SiC wafer production by 2030 under Semicon India Program. Current pipeline: Moser Baer Bengaluru (100K wafers/year with Infineon JV), L&T Dholera (150mm fab), Tata PowerSiC Chennai (200mm with onsemi JV), NALCO Angul (100K 4H-SiC substrates), Sarda Energy Gujarat (50K Schottky diodes). Combined &#8377;18,500Cr investment creating 12,000 direct jobs. Key enabler: domestic 4H-SiC substrate production from NALCO eliminating 100% import from Wolfspeed USA and CoorsTek. SiC device market in India &#8377;8,500Cr by 2030 driven by EV, solar, railway, and datacenter demand. Government incentive: 50% capital subsidy under SEMICON scheme plus 30% R&D subsidy for indigenous epitaxy.</p></CardContent></Card>
          <Card className="sic-insight-card border-l-4 border-l-emerald-600"><CardHeader><CardTitle className="text-sm text-emerald-800">SiC in EV: 8% Range Improvement Critical for FAME III</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Silicon carbide MOSFETs deliver 8% range improvement in EVs by raising inverter efficiency from 97.5% (Si IGBT) to 99.2% (SiC) &#8594; Tata Nexon Gen3 (SIC-0001) first Indian EV with SiC inverter &#8594; translates to 40km extra range on same battery &#8594; critical for meeting FAME III efficiency targets. SiC also reduces inverter size 40% and weight 30% &#8594; enables 400V-to-800V architecture transition. Moser Baer supplying 25,000 SiC modules to Tata Motors at &#8377;185Cr &#8594; Mahindra and Ola Electric also qualifying SiC inverters for 2027 models. Global SiC EV inverter market: &#8377;45,000Cr by 2030 &#8594; India targeting &#8377;5,000Cr domestic production.</p></CardContent></Card>
          <Card className="sic-insight-card border-l-4 border-l-red-500"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Batches: SIC-0006 and SIC-0014</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">SIC-0006 (Tata PowerSiC Chennai to CtrlS Mumbai, 6-day delay): 900V SiC MOSFET wafer yield at 72% below 85% target &#8594; micropipe density in 4H-SiC epitaxy at 0.8/cm2 vs 0.3/cm2 spec &#8594; Tata PowerSiC adjusting CVD epitaxy temperature ramp from 1,600&#176;C to 1,580&#176;C to reduce basal plane dislocations &#8594; CtrlS Mumbai datacenter expansion on hold awaiting SiC UPS modules. SIC-0014 (VSSC to ISAC Bengaluru, 10-day delay): radiation-hardened 1700V SiC MOSFET failed single-event burnout test at Pelletron facility &#8594; 125MeV proton triggered gate oxide rupture &#8594; VSSC redesigning epitaxial buffer from 5um to 10um thickness &#8594; ISRO GSAT-N2 launch delayed pending SiC qualification &#8594; 200 flight modules at &#8377;280Cr affected.</p></CardContent></Card>
          <Card className="sic-insight-card border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm text-emerald-700">NALCO: India&apos;s First Indigenous SiC Substrate</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">NALCO Bhubaneswar (SIC-0011) producing India&apos;s first indigenous 150mm 4H-SiC semi-insulating substrate boules &#8594; carbothermic reduction of high-purity SiO2 from NALCO aluminium smelter by-product &#8594; physical vapour transport (PVT) crystal growth at 2,200&#176;C in argon atmosphere &#8594; boule size: 200mm length with 4-degree off-axis cut. Critical achievement: eliminates 100% import dependency costing &#8377;1,800Cr/year from Wolfspeed (USA) and CoorsTek (USA). NALCO scaling to 100,000 wafer/year SiC substrate plant at Angul Odisha &#8594; &#8377;4,500Cr investment approved by Cabinet Committee on Economic Affairs &#8594; commissioning Q4 2028 &#8594; will supply Moser Baer, L&T, and Tata PowerSiC at 50% below import cost.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
