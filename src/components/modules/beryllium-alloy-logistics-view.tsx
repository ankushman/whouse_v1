'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Atom } from 'lucide-react'

interface BerylliumRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  alloyGrade: string
  application: string
  berylliumPercent: number
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

const berylliumRecords: BerylliumRecord[] = [
  { id: 'BEA-0001', batchNo: 'BEA-B2401', city: 'Hyderabad', manufacturer: 'MIDHANI', alloyGrade: 'Be-Cu C17200 (Cu-1.9Be)', application: 'Satellite Gimbal (ISRO)', berylliumPercent: 1.9, densityGcc: 8.25, investmentCr: 280, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'ISRO Bengaluru (KA)', shipDate: '2026-07-15', transitDays: 1, zone: 'South', remarks: 'Be-Cu C17200 strip for ISRO GSAT-7R reaction wheel gimbal → 1.9% Be → ₹280Cr for 2 tonnes → India ₹8,400Cr space BeCu → ISRO 72 satellite fleet → 8.25 g/cc density → 1300 MPa UTS → conductivity 22% IACS' },
  { id: 'BEA-0002', batchNo: 'BEA-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', alloyGrade: 'Be-Cu C17510 (Cu-0.4Be-Ni)', application: 'Radar Waveguide (BEL)', berylliumPercent: 0.4, densityGcc: 8.75, investmentCr: 195, status: 'Delivered', priority: 'High', origin: 'DRDO DMRL Hyderabad (TG)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 1, zone: 'South', remarks: 'Be-Cu C17510 forging for BEL Ashoka AESA radar waveguide → 0.4% Be → ₹195Cr for 3 tonnes → India ₹5,850Cr defence BeCu → BEL 100+ radar systems → 8.75 g/cc density → 690 MPa yield → thermal conductivity 260 W/mK' },
  { id: 'BEA-0003', batchNo: 'BEA-B2403', city: 'Mumbai', manufacturer: 'Bharat Forge', alloyGrade: 'Be-Cu C17200 HT', application: 'Fuel Injection Nozzle (Cummins)', berylliumPercent: 1.9, densityGcc: 8.25, investmentCr: 145, status: 'Delivered', priority: 'Medium', origin: 'Bharat Forge Pune (MH)', destination: 'Cummins Jamshedpur (JH)', shipDate: '2026-07-17', transitDays: 2, zone: 'West', remarks: 'Be-Cu C17200 forged nozzle for Cummins B6.7 injector → 1.9% Be → ₹145Cr for 1.5 tonnes → India ₹4,350Cr auto BeCu → Cummins 500K engines/yr → fatigue 450 MPa → Rockwell 38 HRC → non-sparking grade' },
  { id: 'BEA-0004', batchNo: 'BEA-B2404', city: 'Pune', manufacturer: 'HAL', alloyGrade: 'Be Metal S-200F', application: 'Chopper Disc (DRDO)', berylliumPercent: 98.5, densityGcc: 1.85, investmentCr: 520, status: 'Delivered', priority: 'Critical', origin: 'HAL Bengaluru (KA)', destination: 'DRDO Hyderabad (TG)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: 'S-200F pure Be chopper for DRDO LCA-Mk2 flywheel → 98.5% Be → ₹520Cr for 800 kg → India ₹15,600Cr defence Be metal → 1.85 g/cc ultra-light → elastic 303 GPa → specific stiffness 3x Al → nuclear grade purity' },
  { id: 'BEA-0005', batchNo: 'BEA-B2405', city: 'Chennai', manufacturer: 'IGCAR', alloyGrade: 'Be-Cu C17400 Strip', application: 'Neutron Reflector (IGCAR)', berylliumPercent: 0.6, densityGcc: 8.45, investmentCr: 310, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'IGCAR Kalpakkam (TN)', shipDate: '2026-07-19', transitDays: 1, zone: 'South', remarks: 'Be-Cu C17400 strip for PFBR fast breeder reflector → 0.6% Be → ₹310Cr for 4 tonnes → India ₹9,300Cr nuclear BeCu → IGCAR 500 MW FBR → neutron cross-section low → 8.45 g/cc → 600 MPa yield → irradiation resistant' },
  { id: 'BEA-0006', batchNo: 'BEA-B2406', city: 'Kolkata', manufacturer: 'SAIL', alloyGrade: 'Be-Cu C17200 Wire', application: 'Connector Contact (BEL)', berylliumPercent: 1.9, densityGcc: 8.25, investmentCr: 98, status: 'Delivered', priority: 'Medium', origin: 'SAIL Bhilai (CG)', destination: 'BEL Ghaziabad (UP)', shipDate: '2026-07-20', transitDays: 3, zone: 'East', remarks: 'Be-Cu C17200 wire for BEL 4K connector contacts → 1.9% Be → ₹98Cr for 500 kg → India ₹2,940Cr connector BeCu → BEL 10M connectors/yr → spring temper → 1100 MPa tensile → MIL-DTL-83521 grade' },
  { id: 'BEA-0007', batchNo: 'BEA-B2407', city: 'Bengaluru', manufacturer: 'ISRO ISTRAC', alloyGrade: 'Be Metal S-65C', application: 'Optical Bench (ISRO)', berylliumPercent: 99.0, densityGcc: 1.85, investmentCr: 640, status: 'Delivered', priority: 'Critical', origin: 'Bhabha BARC Mumbai (MH)', destination: 'ISRO Ahmedabad (GJ)', shipDate: '2026-07-21', transitDays: 2, zone: 'West', remarks: 'S-65C Be optical bench for NISAR SAR payload → 99.0% Be → ₹640Cr for 600 kg → ₹19,200Cr space optics → ISRO-NASA joint → thermal stability 6 ppm/K → 1.85 g/cc → CTE 11.3 ppm/K → mirror grade' },
  { id: 'BEA-0008', batchNo: 'BEA-B2408', city: 'Mumbai', manufacturer: 'Gujarat Fluorochemicals', alloyGrade: 'Be-Cu C17500 Bar', application: 'Welding Electrode (L&T)', berylliumPercent: 0.5, densityGcc: 8.80, investmentCr: 125, status: 'Delivered', priority: 'Medium', origin: 'Gujarat Fluorochemicals Vadodara (GJ)', destination: 'L&T Mumbai (MH)', shipDate: '2026-07-22', transitDays: 1, zone: 'West', remarks: 'Be-Cu C17500 bar for L&T shipyard welding electrode → 0.5% Be → ₹125Cr for 2 tonnes → India ₹3,750Cr welding BeCu → L&T 40 warships → non-sparking tools → 480 MPa yield → conductivity 45% IACS' },
  { id: 'BEA-0009', batchNo: 'BEA-B2409', city: 'Jaipur', manufacturer: 'Rajasthan Beryllium Industries', alloyGrade: 'Be-Cu C17200 Sheet', application: 'Spring Contact (TE Connectivity)', berylliumPercent: 1.9, densityGcc: 8.25, investmentCr: 88, status: 'Delivered', priority: 'Low', origin: 'Rajasthan Beryllium Jaipur (RJ)', destination: 'TE Connectivity Pune (MH)', shipDate: '2026-07-23', transitDays: 2, zone: 'North', remarks: 'Be-Cu C17200 sheet for TE relay spring contacts → 1.9% Be → ₹88Cr for 800 kg → ₹2,640Cr telecom BeCu → TE 50M relays → fatigue 540 MPa → Rockwell 40 HRC → AT strip 0.15mm' },
  { id: 'BEA-0010', batchNo: 'BEA-B2410', city: 'Coimbatore', manufacturer: 'Tamil Nadu Beryllium Alloys', alloyGrade: 'Be-Cu C17410 Plate', application: 'Switchgear Contact (ABB)', berylliumPercent: 0.4, densityGcc: 8.62, investmentCr: 165, status: 'Delivered', priority: 'High', origin: 'Tamil Nadu Beryllium Coimbatore (TN)', destination: 'ABB Bengaluru (KA)', shipDate: '2026-07-24', transitDays: 1, zone: 'South', remarks: 'Be-Cu C17410 plate for ABB 420 kV GIS contact → 0.4% Be → ₹165Cr for 2.5 tonnes → ₹4,950Cr power BeCu → ABB 200 substations → arc resistance → 520 MPa yield → conductivity 55% IACS' },
  { id: 'BEA-0011', batchNo: 'BEA-B2411', city: 'Bhubaneswar', manufacturer: 'Odisha Beryllium Refinery', alloyGrade: 'BeO Ceramic Grade', application: 'Heat Sink (BHEL)', berylliumPercent: 64.8, densityGcc: 3.01, investmentCr: 210, status: 'Delivered', priority: 'High', origin: 'Odisha Beryllium Bhubaneswar (OD)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-25', transitDays: 2, zone: 'East', remarks: 'BeO ceramic for BHEL 800 MW turbine heat sink → 64.8% Be → ₹210Cr for 1.2 tonnes → ₹6,300Cr power BeO → BHEL 150 GW fleet → thermal conductivity 330 W/mK → 3.01 g/cc → dielectric 7.8 → RF grade' },
  { id: 'BEA-0012', batchNo: 'BEA-B2412', city: 'Guwahati', manufacturer: 'Assam Beryllium Works', alloyGrade: 'Be-Cu C17200 Tube', application: 'Undersea Cable (Telecom India)', berylliumPercent: 1.9, densityGcc: 8.25, investmentCr: 175, status: 'Delayed', priority: 'High', origin: 'Assam Beryllium Guwahati (AS)', destination: 'Telecom India Chennai (TN)', shipDate: '2026-07-12', transitDays: 8, zone: 'East', remarks: 'Be-Cu C17200 tube for Telecom India submarine repeater housing → 1.9% Be → ₹175Cr for 3 tonnes → ₹5,250Cr telecom BeCu → monsoon delay Brahmaputra → 800 MPa yield → 8000m depth rating → saltwater resistant' },
  { id: 'BEA-0013', batchNo: 'BEA-B2413', city: 'Ahmedabad', manufacturer: 'Gujarat Beryllium Technologies', alloyGrade: 'Be Metal S-200F Block', application: 'Particle Accelerator (BARC)', berylliumPercent: 98.0, densityGcc: 1.85, investmentCr: 450, status: 'Delivered', priority: 'Critical', origin: 'Gujarat Beryllium Ahmedabad (GJ)', destination: 'BARC Trombay (MH)', shipDate: '2026-07-26', transitDays: 2, zone: 'West', remarks: 'S-200F Be beam window for BARC DAE cyclotron → 98.0% Be → ₹450Cr for 500 kg → ₹13,500Cr nuclear Be → BARC 3 cyclotrons → radiation transparent → 1.85 g/cc → thermal 216 W/mK → Z=4 ultra-light' },
  { id: 'BEA-0014', batchNo: 'BEA-B2414', city: 'Noida', manufacturer: 'UP Beryllium Alloys', alloyGrade: 'Be-Cu C17500 Tube', application: 'Oilfield Tool (ONGC)', berylliumPercent: 0.5, densityGcc: 8.80, investmentCr: 135, status: 'Delivered', priority: 'Medium', origin: 'UP Beryllium Noida (UP)', destination: 'ONGC Mumbai Offshore (MH)', shipDate: '2026-07-27', transitDays: 2, zone: 'North', remarks: 'Be-Cu C17500 tube for ONGC Mumbai High drill tool → 0.5% Be → ₹135Cr for 1.8 tonnes → ₹4,050Cr oilfield BeCu → ONGC 200 wells → non-sparking → 480 MPa → H2S resistant → NACE MR0175 compliant' }
]

const delayedSet = new Set(berylliumRecords.filter(r => r.status === 'Delayed').map(r => r.id))

export default function BerylliumAlloyLogisticsView() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const [filters, setFilters] = useState<Record<string, string[]>>({})

  const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights']
  const toggleFilter = (group: string, val: string) => {
    setFilters(prev => {
      const arr = prev[group] || []
      const next = arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]
      if (!next.length) { const n = { ...prev }; delete n[group]; return n }
      return { ...prev, [group]: next }
    })
  }

  const filtered = useMemo(() => {
    let data = berylliumRecords
    if (search) data = data.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase())))
    Object.entries(filters).forEach(([k, vals]) => { if (vals.length) data = data.filter(r => vals.includes(String((r as any)[k]))) })
    return data
  }, [search, filters])

  const total = berylliumRecords.length
  const delivered = berylliumRecords.filter(r => r.status === 'Delivered').length
  const totalCr = berylliumRecords.reduce((s: number, r) => s + r.investmentCr, 0)
  const avgBe = +(berylliumRecords.reduce((s: number, r) => s + r.berylliumPercent, 0) / total).toFixed(1)

  const manufacturers = [...new Set(berylliumRecords.map(r => r.manufacturer))]
  const zones = [...new Set(berylliumRecords.map(r => r.zone))]

  return (
    <div className="space-y-6">
      <PageHeader title="Beryllium Alloy Logistics" description="Indian beryllium-copper and pure beryllium supply chain tracking across aerospace, nuclear, defence and telecom sectors" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-emerald-600">{total}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-emerald-600">{delivered}</div><div className="text-xs text-muted-foreground">Delivered</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-emerald-600">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-emerald-600">{avgBe}%</div><div className="text-xs text-muted-foreground">Avg Be Content</div></CardContent></Card>
      </div>

      <div className="flex gap-2 border-b">
        {tabs.map((t, i) => (<button key={t} className={`px-4 py-2 ${activeTab === i ? 'border-b-2 border-emerald-600 text-emerald-600 font-semibold' : 'text-muted-foreground'}`} onClick={() => setActiveTab(i)}>{t}</button>))}
      </div>

      {activeTab === 0 && (<div className="space-y-4">
        <div className="flex gap-2"><Input placeholder="Search shipments..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        <div className="flex gap-2 flex-wrap">
          {zones.map(z => <Badge key={z} variant={filters.zone?.includes(z) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('zone', z)}>{z}</Badge>)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([z, c]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Priority Mix</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([p, c]) => (<div key={p} className="flex justify-between text-sm"><span>{p}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        </div>
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">Be%</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.alloyGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.berylliumPercent}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
      </div>)}

      {activeTab === 1 && (<div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {manufacturers.map(m => <Badge key={m} variant={filters.manufacturer?.includes(m) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('manufacturer', m)}>{m}</Badge>)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">By Manufacturer</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([m, c]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Density Range</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const d = r.densityGcc < 2 ? 'Ultra-light (<2)' : r.densityGcc < 8.5 ? 'Medium (8.25-8.5)' : 'High (>8.5)'; m[d] = (m[d] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        </div>
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Manufacturer</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Origin</th><th className="p-2 text-left">Destination</th><th className="p-2 text-right">Transit</th><th className="p-2 text-left">Zone</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.manufacturer}</td><td className="p-2">{r.alloyGrade}</td><td className="p-2">{r.origin}</td><td className="p-2">{r.destination}</td><td className="p-2 text-right">{r.transitDays}d</td><td className="p-2">{r.zone}</td></tr>))}</tbody></table></div></div>
      </div>)}

      {activeTab === 2 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Be Content Distribution</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const b = r.berylliumPercent < 1 ? 'Low (<1%)' : r.berylliumPercent < 2 ? 'Medium (1-2%)' : r.berylliumPercent < 65 ? 'High (2-65%)' : 'Pure Be (>65%)'; m[b] = (m[b] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Be% vs Investment</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.berylliumPercent > 50).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.alloyGrade} ({r.berylliumPercent}%)</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
      </div>)}

      {activeTab === 3 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardContent><div className="text-sm font-medium text-emerald-600 mb-2">Pure Beryllium Surge</div><div className="text-xs text-muted-foreground">S-200F and S-65C pure Be demand growing at 28% CAGR driven by ISRO optics and BARC nuclear programs. India imported &#8377;680Cr Be metal in FY26, up from &#8377;420Cr in FY24. Indigenous Be extraction from beryl ore remains limited to Gujarat Fluorochemicals pilot plant.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-emerald-600 mb-2">Be-Cu Dominates Connector Market</div><div className="text-xs text-muted-foreground">Be-Cu C17200 accounts for 72% of Indian high-reliability connector demand. BEL and TE Connectivity consume 800 tonnes/year for defence and telecom relay springs. MIDHANI expanding capacity from 45 to 120 TPA by 2028 to reduce 85% import dependence.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-emerald-600 mb-2">Monsoon Disruption Risk</div><div className="text-xs text-muted-foreground">BEA-B2412 delayed 8 days due to Brahmaputra flooding impacting Assam-Guwahati corridor. This route historically faces 15-20 days delay during July-September monsoon. Recommend pre-positioning inventory at Chennai hub for East-North transit during Q3.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-emerald-600 mb-2">BeO Ceramic Growth</div><div className="text-xs text-muted-foreground">Beryllium oxide ceramics growing at 22% CAGR for power electronics heat sinks. Odisha Beryllium Refinery targeting 50 TPA BeO capacity by 2027. Applications expanding from BHEL turbine to EV inverter and 5G RF components across India.</div></CardContent></Card>
      </div>)}
    </div>
  )
}
