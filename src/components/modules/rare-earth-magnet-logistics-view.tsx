'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Flame } from 'lucide-react'

interface RareEarthMagnetRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  magnetType: string
  application: string
  fluxDensityT: number
  maxTempCelsius: number
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

const rareEarthRecords: RareEarthMagnetRecord[] = [
  { id: 'REM-0001', batchNo: 'REM-B2401', city: 'Hyderabad', manufacturer: 'REEH Magnetics', magnetType: 'NdFeB N52', application: 'EV Traction Motor (Ola Electric)', fluxDensityT: 1.45, maxTempCelsius: 80, investmentCr: 245, status: 'Delivered', priority: 'Critical', origin: 'REEH Hyderabad (TS)', destination: 'Ola Electric Pune (MH)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: 'REEH NdFeB N52 magnet for Ola S1 Pro traction motor &#8594; 1.45T flux density enabling 98.5% motor efficiency &#8594; &#8377;245Cr for 120 tonnes NdFeB magnet block &#8594; Ola producing 500,000 electric scooters/year &#8594; REEH &#8377;3,200Cr Hyderabad NdFeB sintering and machining &#8594; India importing 90% NdFeB from China &#8594; REEH targeting 30% import substitution by 2028 &#8594; N52 grade highest energy product (BHmax 52 MGOe) &#8594; magnet block dimensions 80x40x20mm for 48-slot motor &#8594; &#8377;15,000Cr India EV motor magnet market' },
  { id: 'REM-0002', batchNo: 'REM-B2402', city: 'Mumbai', manufacturer: 'Tata Rare Earth', magnetType: 'SmCo 1:5', application: 'Satellite Reaction Wheel (ISRO)', fluxDensityT: 1.05, maxTempCelsius: 250, investmentCr: 195, status: 'In Transit', priority: 'Critical', origin: 'TRE Mumbai (MH)', destination: 'SCEB Bengaluru (KA)', shipDate: '2026-07-24', transitDays: 2, zone: 'West', remarks: 'TRE SmCo 1:5 ring magnet for ISRO satellite reaction wheel &#8594; 1.05T at 250&#176;C for 15-year space qualification &#8594; &#8377;195Cr for 8 tonnes SmCo ring &#8594; SmCo chosen over NdFeB for radiation resistance and high temperature &#8594; TRE &#8377;2,800Cr Mumbai SmCo processing &#8594; ISRO launching 12 satellites/year &#8594; each satellite requires 4 reaction wheels &#8594; TRE also supplies SmCo for missile guidance gyroscope &#8594; &#8377;1,200Cr India space magnet market &#8594; SmCo 20% heavier but 3x temperature stable vs NdFeB' },
  { id: 'REM-0003', batchNo: 'REM-B2403', city: 'Pune', manufacturer: 'Aether Magnetics', magnetType: 'NdFeB N48SH', application: 'Wind Turbine Generator (Suzlon)', fluxDensityT: 1.38, maxTempCelsius: 150, investmentCr: 168, status: 'Delivered', priority: 'High', origin: 'Aether Pune (MH)', destination: 'Suzlon Pondicherry (PY)', shipDate: '2026-07-15', transitDays: 2, zone: 'West', remarks: 'Aether NdFeB N48SH for Suzlon 3MW DFIG wind turbine generator &#8594; 1.38T at 150&#176;C nacelle environment &#8594; &#8377;168Cr for 95 tonnes magnet &#8594; SH grade (super high) for thermal stability in tropical nacelle &#8594; Aether &#8377;1,600Cr Pune sintering and coating &#8594; Suzlon installing 5,000 MW wind capacity &#8594; each turbine requires 2 tonnes NdFeB magnet &#8594; direct-drive permanent magnet generator eliminates gearbox &#8594; 3% higher energy yield vs DFIG with gearbox &#8594; &#8377;4,500Cr India wind magnet market' },
  { id: 'REM-0004', batchNo: 'REM-B2404', city: 'Bengaluru', manufacturer: 'BEL Magnet Division', magnetType: 'NdFeB N42', application: 'AESA Radar TRM (DRDO)', fluxDensityT: 1.32, maxTempCelsius: 80, investmentCr: 275, status: 'In Transit', priority: 'Critical', origin: 'BEL Bengaluru (KA)', destination: 'LRDE Bengaluru (KA)', shipDate: '2026-07-23', transitDays: 0, zone: 'South', remarks: 'BEL NdFeB N42 for DRDO Uttam AESA radar T/R module circulator &#8594; 1.32T for YIG circulator isolation 25dB &#8594; &#8377;275Cr for 15 tonnes precision magnet &#8594; 4,000 TRM modules per Uttam radar &#8594; BEL &#8377;1,200Cr magnet division &#8594; DRDO qualifying Tejas Mark 2 radar with Uttam Mk2 &#8594; each TRM requires 2 NdFeB circulators &#8594; magnet must maintain flux within 1% over 15-year service life &#8594; &#8377;5,600Cr India defence radar programme &#8594; BEL also supplies magnets for Akash NG SAM seeker' },
  { id: 'REM-0005', batchNo: 'REM-B2405', city: 'Chennai', manufacturer: 'Indian Rare Earths Ltd', magnetType: 'NdFeB N48', application: 'MRI Gradient Coil (Wipro GE)', fluxDensityT: 1.40, maxTempCelsius: 80, investmentCr: 185, status: 'Delivered', priority: 'High', origin: 'IREL Chennai (TN)', destination: 'Wipro GE Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 1, zone: 'South', remarks: 'IREL NdFeB N48 for Wipro GE 3T MRI gradient coil &#8594; 1.40T enabling 45 mT/m gradient strength &#8594; &#8377;185Cr for 65 tonnes magnet block &#8594; India has 800 MRI machines with 200 installed/year &#8594; IREL &#8377;4,200Cr integrated rare earth processing &#8594; beach sand monazite to NdFeB full value chain &#8594; Wipro GE manufacturing 200 MRI systems/year &#8594; NdFeB gradient coil 20% stronger than ferrite &#8594; &#8377;8,000Cr India medical imaging market &#8594; IREL monazite processing 12,000 tonnes/year from Kerala TN Odisha beaches' },
  { id: 'REM-0006', batchNo: 'REM-B2406', city: 'Noida', manufacturer: 'Magneto India', magnetType: 'NdFeB N45EH', application: 'EV Motor Rotor (Mahindra)', fluxDensityT: 1.36, maxTempCelsius: 200, investmentCr: 132, status: 'Processing', priority: 'High', origin: 'Magneto Noida (UP)', destination: 'Mahindra Nashik (MH)', shipDate: '2026-07-25', transitDays: 2, zone: 'North', remarks: 'Magneto NdFeB N45EH for Mahindra XUV400 EV interior permanent magnet motor &#8594; 1.36T at 200&#176;C for 150kW peak power &#8594; &#8377;132Cr for 55 tonnes magnet &#8594; EH grade for elevated temperature in IPM motor rotor &#8594; Magneto &#8377;580Cr Noida magnet factory &#8594; Mahindra producing 100,000 EVs/year &#8594; IPM motor with V-shaped magnet arrangement &#8594; NdFeB enables 15% higher power density vs ferrite IPM &#8594; &#8377;10,000Cr India EV magnet market by 2028 &#8594; Dysprosium added to N45EH for coercivity at high temperature' },
  { id: 'REM-0007', batchNo: 'REM-B2407', city: 'Bhubaneswar', manufacturer: 'IREL Odisha Unit', magnetType: 'Sm2Co17', application: 'Hypersonic Missile (DRDO)', fluxDensityT: 1.10, maxTempCelsius: 350, investmentCr: 310, status: 'Delivered', priority: 'Critical', origin: 'IREL Odisha (OD)', destination: 'DRDO Hyderabad (TS)', shipDate: '2026-07-12', transitDays: 2, zone: 'East', remarks: 'IREL Sm2Co17 for DRDO BrahMos-II hypersonic missile guidance actuator &#8594; 1.10T at 350&#176;C Mach 7 airframe temperature &#8594; &#8377;310Cr for 4 tonnes SmCo magnet &#8594; Sm2Co17 highest temperature rare earth magnet grade &#8594; IREL &#8377;4,200Cr Odisha samarium processing &#8594; DRDO qualifying for BrahMos-II and PDV hypersonic interceptor &#8594; magnet actuator controls canard deflection at Mach 7 &#8594; &#8377;8,500Cr India hypersonic missile programme &#8594; IREL also supplies SmCo for nuclear submarine electric motor &#8594; 100% import substitution for strategic SmCo magnets' },
  { id: 'REM-0008', batchNo: 'REM-B2408', city: 'Ahmedabad', manufacturer: 'Gujarat Magnet Park', magnetType: 'NdFeB N35', application: 'Magnetic Separator (NALCO)', fluxDensityT: 1.21, maxTempCelsius: 80, investmentCr: 38, status: 'In Transit', priority: 'Standard', origin: 'GMP Ahmedabad (GJ)', destination: 'NALCO Damanjodi (OD)', shipDate: '2026-07-22', transitDays: 2, zone: 'West', remarks: 'GMP NdFeB N35 for NALCO aluminium smelter magnetic separator &#8594; 1.21T for 1.2m drum separator &#8594; &#8377;38Cr for 40 tonnes N35 block &#8594; removes ferrous contamination to &lt;0.01% in alumina &#8594; GMP &#8377;320Cr Gujarat magnet park &#8594; NALCO producing 2 MTPA aluminium &#8594; magnetic separator critical for aluminium purity &#8594; N35 grade economical for bulk industrial use &#8594; also for mineral processing and coal washing &#8594; &#8377;800Cr India industrial magnet separator market &#8594; N35 40% cheaper than N48 for low-spec applications' },
  { id: 'REM-0009', batchNo: 'REM-B2409', city: 'Jaipur', manufacturer: 'Rajasthan Rare Earth', magnetType: 'NdFeB N50', application: 'Audio Speaker Driver (BoAt)', fluxDensityT: 1.42, maxTempCelsius: 80, investmentCr: 52, status: 'Delivered', priority: 'Standard', origin: 'RRE Jaipur (RJ)', destination: 'BoAt Noida (UP)', shipDate: '2026-07-14', transitDays: 2, zone: 'North', remarks: 'RRE NdFeB N50 for BoAt speaker driver ring magnet &#8594; 1.42T for 98dB SPL at 1W &#8594; &#8377;52Cr for 25 tonnes ring magnet &#8594; N50 highest flux density for consumer audio &#8594; RRE &#8377;280Cr Rajasthan processing &#8594; India consuming 50 million speaker magnets/year &#8594; BoAt producing 5 million TWS earbuds/year &#8594; NdFeB ring magnet 3x sensitivity vs ferrite ring &#8594; &#8377;1,200Cr India consumer electronics magnet market &#8594; also for mobile phone haptic motor and camera autofocus (VCM)' },
  { id: 'REM-0010', batchNo: 'REM-B2410', city: 'Coimbatore', manufacturer: 'Tamil Nadu Magnet Works', magnetType: 'NdFeB N42UH', application: 'Elevator Traction (Kone India)', fluxDensityT: 1.32, maxTempCelsius: 180, investmentCr: 68, status: 'Processing', priority: 'Standard', origin: 'TNMW Coimbatore (TN)', destination: 'Kone Chennai (TN)', shipDate: '2026-07-26', transitDays: 0, zone: 'South', remarks: 'TNMW NdFeB N42UH for Kone elevator traction motor &#8594; 1.32T at 180&#176;C machine room &#8594; &#8377;68Cr for 22 tonnes UH grade magnet &#8594; UH (ultra high) coercivity for demagnetization resistance &#8594; TNMW &#8377;350Cr Coimbatore factory &#8594; India installing 200,000 elevators/year &#8594; permanent magnet gearless traction 30% energy saving vs AC geared &#8594; Kone India &#8377;2,400Cr elevator production &#8594; NdFeB UH grade with Dy addition for coercivity at 180&#176;C &#8594; &#8377;800Cr India elevator magnet market' },
  { id: 'REM-0011', batchNo: 'REM-B2411', city: 'Guwahati', manufacturer: 'NE Rare Earth Hub', magnetType: 'NdFeB N48', application: 'EV Charger PFC (Ather Energy)', fluxDensityT: 1.40, maxTempCelsius: 100, investmentCr: 45, status: 'Delivered', priority: 'High', origin: 'NEREH Guwahati (AS)', destination: 'Ather Bengaluru (KA)', shipDate: '2026-07-17', transitDays: 4, zone: 'East', remarks: 'NEREH NdFeB N48 for Ather 3.3kW home charger PFC inductor &#8594; 1.40T enabling 10x inductance vs ferrite core at same size &#8594; &#8377;45Cr for 18 tonnes magnetic core &#8594; Ather producing 200,000 chargers/year &#8594; NEREH &#8377;450Cr Assam magnet hub &#8594; charger size reduced 60% with NdFeB PFC inductor &#8594; also for Ola Hypercharger 15kW DC fast charger &#8594; &#8377;3,500Cr India EV charger component market &#8594; strategic NE location leveraging ASEAN rare earth trade corridor' },
  { id: 'REM-0012', batchNo: 'REM-B2412', city: 'Srinagar', manufacturer: 'Kashmir Mineral Corp', magnetType: 'AlNiCo 5', application: 'Compass and Sensor (BEL)', fluxDensityT: 1.25, maxTempCelsius: 500, investmentCr: 28, status: 'Delayed', priority: 'High', origin: 'KMC Srinagar (JK)', destination: 'BEL Ghaziabad (UP)', shipDate: '2026-07-09', transitDays: 8, zone: 'North', remarks: 'KMC AlNiCo 5 for BEL military compass and heading sensor &#8594; 1.25T at 500&#176;C desert operation &#8594; &#8377;28Cr for 6 tonnes AlNiCo cast magnet &#8594; 8-day delay: casting furnace transformer failure halted production &#8594; AlNiCo highest temperature tolerance of all magnet types &#8594; KMC &#8377;120Cr Srinagar casting &#8594; BEL supplying 50,000 military compasses/year &#8594; AlNiCo irreplaceable for high-temperature heading sensor &#8594; also for aircraft magneto and tachometer &#8594; &#8377;400Cr India military sensor magnet market' },
  { id: 'REM-0013', batchNo: 'REM-B2413', city: 'Gandhinagar', manufacturer: 'Gujarat NdFeB Cluster', magnetType: 'NdFeB N48SH Plated', application: 'EV Battery BMS (Exide)', fluxDensityT: 1.40, maxTempCelsius: 150, investmentCr: 92, status: 'In Transit', priority: 'High', origin: 'GNFC Gandhinagar (GJ)', destination: 'Exide Kolkata (WB)', shipDate: '2026-07-21', transitDays: 3, zone: 'West', remarks: 'GNFC NdFeB N48SH Ni-Cu-Ni plated for Exide Li-ion battery BMS current sensor &#8594; 1.40T for Hall effect current sensing 500A &#8594; &#8377;92Cr for 28 tonnes plated magnet &#8594; Ni-Cu-Ni coating prevents corrosion in battery pack &#8594; GNFC &#8377;880Cr Gandhinagar NdFeB cluster &#8594; Exide producing 5 GWh battery cells/year &#8594; Hall sensor with NdFeB concentrator 10x sensitivity vs air core &#8594; also for EV motor rotor position encoder &#8594; &#8377;2,200Cr India BMS component market' },
  { id: 'REM-0014', batchNo: 'REM-B2414', city: 'Kolkata', manufacturer: 'Bengal Magnet Works', magnetType: 'Ferrite Y30 (Rare Earth Doped)', application: '5G Antenna Isolator (Jio)', fluxDensityT: 0.48, maxTempCelsius: 200, investmentCr: 42, status: 'Delayed', priority: 'Critical', origin: 'BMW Kolkata (WB)', destination: 'Jio Telecom Mumbai (MH)', shipDate: '2026-07-05', transitDays: 14, zone: 'East', remarks: 'BMW rare-earth doped ferrite Y30 for Jio 5G base station circulator &#8594; 0.48T at 200&#176;C mast-top environment &#8594; &#8377;42Cr for 35 tonnes ferrite ceramic &#8594; 14-day delay: La-doped ferrite sintering cycle extended for grain uniformity &#8594; La doping increases 4piMs from 3,800 to 4,200 Gauss &#8594; BMW &#8377;180Cr Kolkata ferrite mill &#8594; Jio deploying 150,000 5G base stations &#8594; each requires 2 circulators per sector &#8594; rare-earth doped ferrite 15% cheaper than SmCo for circulator &#8594; &#8377;4,000Cr India 5G passive component market' }
]

const remKpis = [
  { label: 'In Transit / Shipped', value: rareEarthRecords.filter(r => r.status === 'In Transit' || r.status === 'Shipped').length, suffix: ' batches', color: 'text-emerald-700 bg-emerald-50' },
  { label: 'Processing / Sintering', value: rareEarthRecords.filter(r => r.status === 'Processing' || r.status === 'Sintering').length, suffix: ' batches', color: 'text-amber-700 bg-amber-50' },
  { label: 'Delivered / Inspected', value: rareEarthRecords.filter(r => r.status === 'Delivered' || r.status === 'Inspected').length, suffix: ' batches', color: 'text-blue-700 bg-blue-50' },
  { label: 'Total Investment', value: rareEarthRecords.reduce((s: number, r) => s + r.investmentCr, 0), suffix: ' Cr', color: 'text-rose-700 bg-rose-50' }
]

export default function RareEarthMagnetLogisticsView() {
  const [activeTab, setActiveTab] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights']

  const statusCounts = useMemo(() => {
    const map: Record<string, number> = {}
    rareEarthRecords.forEach(r => { map[r.status] = (map[r.status] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const mfrCounts = useMemo(() => {
    const map: Record<string, number> = {}
    rareEarthRecords.forEach(r => { map[r.manufacturer] = (map[r.manufacturer] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const appCounts = useMemo(() => {
    const map: Record<string, number> = {}
    rareEarthRecords.forEach(r => { map[r.application] = (map[r.application] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const zoneCounts = useMemo(() => {
    const map: Record<string, number> = {}
    rareEarthRecords.forEach(r => { map[r.zone] = (map[r.zone] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const filtered = useMemo(() => {
    return rareEarthRecords.filter(r => {
      if (searchTerm && !Object.values(r).some(v => String(v).toLowerCase().includes(searchTerm.toLowerCase()))) return false
      for (const [key, values] of Object.entries(activeFilters)) {
        if (values.length === 0) continue
        const val = String((r as unknown as Record<string, unknown>)[key] || '')
        if (!values.some(v => val.includes(v))) return false
      }
      return true
    })
  }, [searchTerm, activeFilters])

  const toggleFilter = (key: string, value: string) => {
    setActiveFilters(prev => {
      const current = prev[key] || []
      if (current.includes(value)) {
        const next = current.filter(v => v !== value)
        return next.length === 0 ? (() => { const n = { ...prev }; delete n[key]; return n })() : { ...prev, [key]: next }
      }
      return { ...prev, [key]: [...current, value] }
    })
  }

  return (
    <div className="rem-logistics-container p-4 space-y-4">
      <PageHeader title="Rare Earth Magnet Logistics" description="Rare Earth and Permanent Magnet Supply Chain Tracking &#8212; NdFeB, SmCo, AlNiCo and ferrite magnets for EV motors, wind turbines, defence radar, satellite systems, MRI, 5G and consumer electronics across India" />

      <div className="rem-kpi-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {remKpis.map((kpi, i) => (
          <Card key={i} className="rem-kpi-card border-l-4 border-l-emerald-500"><CardContent className="p-4"><p className="text-xs text-muted-foreground">{kpi.label}</p><p className={`text-2xl font-bold ${kpi.color.split(' ')[0]}`}>{kpi.value.toLocaleString()}<span className="text-sm font-normal">{kpi.suffix}</span></p></CardContent></Card>
        ))}
      </div>

      <div className="rem-tab-bar flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)} className={`rem-tab-btn px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === i ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-muted-foreground hover:bg-emerald-50 border'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && (
        <div className="rem-dashboard space-y-4">
          <div className="rem-chart-row grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="rem-chart-card"><CardHeader><CardTitle className="text-sm">Batch Status</CardTitle></CardHeader><CardContent>
              <div className="rem-bar-chart space-y-2">
                {statusCounts.map(([s, c]) => (
                  <div key={s} className="flex items-center gap-2"><span className="text-xs w-20 text-right truncate">{s}</span><div className="flex-1 bg-emerald-100 rounded-full h-4 overflow-hidden"><div className="rem-bar-fill h-full bg-emerald-500 rounded-full" style={{ width: `${(c / rareEarthRecords.length) * 100}%` }} /></div><span className="text-xs font-medium w-6">{c}</span></div>
                ))}
              </div>
            </CardContent></Card>
            <Card className="rem-chart-card"><CardHeader><CardTitle className="text-sm">Manufacturer Volume</CardTitle></CardHeader><CardContent>
              <div className="rem-bar-chart space-y-2">
                {mfrCounts.slice(0, 8).map(([m, c]) => (
                  <div key={m} className="flex items-center gap-2"><span className="text-xs w-28 text-right truncate">{m}</span><div className="flex-1 bg-emerald-100 rounded-full h-4 overflow-hidden"><div className="rem-bar-fill h-full bg-emerald-400 rounded-full" style={{ width: `${(c / rareEarthRecords.length) * 100}%` }} /></div><span className="text-xs font-medium w-6">{c}</span></div>
                ))}
              </div>
            </CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 1 && (
        <div className="rem-registry space-y-3">
          <div className="rem-filter-bar flex flex-wrap gap-2 items-center">
            <Input placeholder="Search batches..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="max-w-xs h-8 text-sm" />
            {['status', 'zone', 'priority'].map(key => (
              <div key={key} className="rem-filter-group flex flex-wrap gap-1">
                {Array.from(new Set(rareEarthRecords.map(r => r[key as keyof RareEarthMagnetRecord] as string))).filter(Boolean).slice(0, 4).map(val => (
                  <button key={val} onClick={() => toggleFilter(key, val)} className={`rem-filter-btn px-2 py-1 text-xs rounded-md border transition-all ${activeFilters[key]?.includes(val) ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-muted-foreground hover:bg-emerald-50'}`}>
                    {val}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <Card><CardContent className="p-0">
            <div className="rem-table-wrap overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="border-b bg-emerald-50/50">
                  <th className="p-2 text-left font-medium">Batch ID</th><th className="p-2 text-left font-medium">Manufacturer</th><th className="p-2 text-left font-medium">Type</th><th className="p-2 text-left font-medium">Application</th><th className="p-2 text-left font-medium">Flux(T)</th><th className="p-2 text-left font-medium">MaxTemp</th><th className="p-2 text-left font-medium">Investment</th><th className="p-2 text-left font-medium">Status</th><th className="p-2 text-left font-medium">Origin</th><th className="p-2 text-left font-medium">Dest</th>
                </tr></thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.id} className={`rem-table-row border-b hover:bg-emerald-50/30 transition-colors ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                      <td className="p-2"><Badge variant="outline" className="text-emerald-700 border-emerald-300 font-mono">{r.id}</Badge></td>
                      <td className="p-2">{r.manufacturer}</td><td className="p-2">{r.magnetType}</td><td className="p-2">{r.application}</td>
                      <td className="p-2">{r.fluxDensityT}T</td><td className="p-2">{r.maxTempCelsius}&#176;C</td><td className="p-2">{r.investmentCr}Cr</td>
                      <td className="p-2"><Badge className={`${r.status === 'Delayed' ? 'bg-red-100 text-red-800' : r.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : r.status === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>{r.status}</Badge></td>
                      <td className="p-2 truncate max-w-28">{r.origin}</td><td className="p-2 truncate max-w-28">{r.destination}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent></Card>
        </div>
      )}

      {activeTab === 2 && (
        <div className="rem-analytics space-y-4">
          <div className="rem-chart-row grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="rem-chart-card"><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent>
              <div className="rem-bar-chart space-y-2">
                {(Object.entries(zoneCounts.reduce((acc: Record<string, number>, [z]) => { acc[z] = rareEarthRecords.filter(r => r.zone === z).reduce((s: number, rr) => s + rr.investmentCr, 0); return acc }, {})) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([z, v]) => (
                  <div key={z} className="flex items-center gap-2"><span className="text-xs w-16 text-right">{z}</span><div className="flex-1 bg-emerald-100 rounded-full h-4 overflow-hidden"><div className="rem-bar-fill h-full bg-emerald-500 rounded-full" style={{ width: `${(v / 400) * 100}%` }} /></div><span className="text-xs font-medium w-14 text-right">{v}Cr</span></div>
                ))}
              </div>
            </CardContent></Card>
            <Card className="rem-chart-card"><CardHeader><CardTitle className="text-sm">Application Distribution</CardTitle></CardHeader><CardContent>
              <div className="rem-bar-chart space-y-2">
                {appCounts.slice(0, 8).map(([a, c]) => (
                  <div key={a} className="flex items-center gap-2"><span className="text-xs w-36 text-right truncate">{a}</span><div className="flex-1 bg-emerald-100 rounded-full h-4 overflow-hidden"><div className="rem-bar-fill h-full bg-emerald-400 rounded-full" style={{ width: `${(c / rareEarthRecords.length) * 100}%` }} /></div><span className="text-xs font-medium w-6">{c}</span></div>
                ))}
              </div>
            </CardContent></Card>
            <Card className="rem-chart-card"><CardHeader><CardTitle className="text-sm">Flux Density by Magnet Type</CardTitle></CardHeader><CardContent>
              <div className="rem-bar-chart space-y-2">
                {rareEarthRecords.sort((a, b) => b.fluxDensityT - a.fluxDensityT).slice(0, 8).map(r => (
                  <div key={r.id} className="flex items-center gap-2"><span className="text-xs w-28 text-right truncate">{r.magnetType.split(' ')[0]}</span><div className="flex-1 bg-emerald-100 rounded-full h-4 overflow-hidden"><div className="rem-bar-fill h-full bg-emerald-300 rounded-full" style={{ width: `${(r.fluxDensityT / 1.5) * 100}%` }} /></div><span className="text-xs font-medium w-16 text-right">{r.fluxDensityT}T / {r.maxTempCelsius}&#176;C</span></div>
                ))}
              </div>
            </CardContent></Card>
            <Card className="rem-chart-card"><CardHeader><CardTitle className="text-sm">Avg Transit Days by Status</CardTitle></CardHeader><CardContent>
              <div className="rem-bar-chart space-y-2">
                {(Object.entries(rareEarthRecords.reduce((acc: Record<string, { sum: number; count: number }>, r) => { if (!acc[r.status]) acc[r.status] = { sum: 0, count: 0 }; acc[r.status].sum += r.transitDays; acc[r.status].count += 1; return acc }, {})) as [string, { sum: number; count: number }][]).map(([s, v]) => (
                  <div key={s} className="flex items-center gap-2"><span className="text-xs w-20 text-right truncate">{s}</span><div className="flex-1 bg-emerald-100 rounded-full h-4 overflow-hidden"><div className="rem-bar-fill h-full bg-emerald-500 rounded-full" style={{ width: `${(v.sum / v.count / 16) * 100}%` }} /></div><span className="text-xs font-medium w-12 text-right">{(v.sum / v.count).toFixed(1)}d</span></div>
                ))}
              </div>
            </CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 3 && (
        <div className="rem-insights space-y-3">
          <Card className="rem-insight-card border-l-4 border-l-emerald-600"><CardHeader><CardTitle className="text-sm text-emerald-800">India Rare Earth Magnet: &#8377;18,000Cr Critical Supply Chain</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">India&apos;s rare earth magnet market is valued at &#8377;18,000Cr with 14 manufacturers across 13 cities &#8594; NdFeB dominates EV and wind (70% by volume) while SmCo leads defence and space (20%) &#8594; AlNiCo serves high-temperature military sensors (5%) and ferrite covers 5G passive components (5%) &#8594; India imports 90% of rare earth magnet material from China &#8594; IREL Chennai Odisha operating India&apos;s only integrated rare earth processing &#8594; beach sand monazite to separated Nd Pr Dy Sm oxides &#8594; &#8377;12,000Cr total investment across Indian magnet facilities &#8594; India targeting 30% import substitution by 2028 &#8594; critical vulnerability: China controls 90% NdFeB global supply &#8594; Japanese and Australian Lynas rare earth as alternate supply.</p></CardContent></Card>
          <Card className="rem-insight-card border-l-4 border-l-red-500"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Batches: REM-0012 and REM-0014</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">REM-0012 (KMC Srinagar to BEL Ghaziabad, 8-day delay): AlNiCo 5 cast magnet for military compass &#8594; casting furnace transformer failure halted production &#8594; 6 tonnes AlNiCo at &#8377;28Cr &#8594; AlNiCo requires precision casting in magnetic field alignment &#8594; KMC replacing transformer and realigning mould with Helmholtz coil &#8594; 50,000 military compasses/year at risk. REM-0014 (BMW Kolkata to Jio Mumbai, 14-day delay): La-doped Y30 ferrite for 5G circulator &#8594; sintering cycle extended for grain boundary uniformity &#8594; La doping targets 4,200 Gauss vs 3,800 standard Y30 &#8594; 35 tonnes ferrite at &#8377;42Cr &#8594; Jio 150,000 base station deployment delayed &#8594; &#8377;4,000Cr 5G passive component market import-dependent &#8594; BMW Kolkata now targeting sintered density 4.85 g/cc.</p></CardContent></Card>
          <Card className="rem-insight-card border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm text-emerald-700">NdFeB for EV: India&apos;s Largest Magnet Consumer</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">NdFeB permanent magnets are the fastest-growing segment in India driven by EV adoption &#8594; REEH Hyderabad N52 for Ola Electric 500K scooters/year &#8594; Magneto Noida N45EH for Mahindra 100K EVs/year &#8594; each EV motor requires 2-5kg NdFeB magnet &#8594; &#8377;15,000Cr India EV motor magnet market &#8594; India EV production targeting 10 million units/year by 2030 &#8594; NdFeB demand projected 50,000 tonnes/year by 2028 &#8594; IREL Odisha developing Nd-Pr separation from monazite &#8594; heavy rare earths Dy and Tb added to EH/UH grades for high-temperature coercivity &#8594; Dy and Tb 95% imported from China &#8594; &#8377;4,500Cr India heavy rare earth import bill &#8594; critical vulnerability for EV national mission.</p></CardContent></Card>
          <Card className="rem-insight-card border-l-4 border-l-indigo-500"><CardHeader><CardTitle className="text-sm text-indigo-700">SmCo: Strategic Defence and Space Magnet</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Samarium cobalt magnets are indispensable for Indian defence and space &#8594; Tata Rare Earth SmCo 1:5 for ISRO satellite reaction wheel &#8594; IREL Odisha Sm2Co17 for DRDO BrahMos-II hypersonic missile &#8594; SmCo operates to 250-350&#176;C vs 80-200&#176;C for NdFeB &#8594; radiation resistance superior to NdFeB in space environment &#8594; &#8377;5,600Cr India defence magnet programme &#8594; IREL Odisha operating India&apos;s only samarium processing facility &#8594; samarium extracted from monazite at Chavara Kerala &#8594; SmCo also for nuclear submarine propulsion motor &#8594; 100% import substitution achieved for strategic SmCo &#8594; DRDO developing SmCo-free motor using advanced NdFeB with Tb-Dy diffusion &#8594; &#8377;8,500Cr India hypersonic missile programme.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
