'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Gem } from 'lucide-react'

interface PalladiumAlloyRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  alloyGrade: string
  application: string
  palladiumPercent: number
  meltingPointC: number
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

const palladiumAlloyRecords: PalladiumAlloyRecord[] = [
  { id: 'PDA-0001', batchNo: 'PDA-B2401', city: 'Mumbai', manufacturer: 'Hindustan Platinum', alloyGrade: 'Pd-Ag 75/25 Dental', application: 'Dental Crown Alloy (Dentworks)', palladiumPercent: 75.0, meltingPointC: 1050, investmentCr: 310, status: 'Delivered', priority: 'High', origin: 'Hindustan Platinum Mumbai (MH)', destination: 'Dentworks Bengaluru (KA)', shipDate: '2026-07-15', transitDays: 2, zone: 'West', remarks: 'Pd-Ag 75/25 dental casting alloy for Dentworks CAD/CAM crown &#8594; 75% Pd &#8594; &#8377;310Cr for 6 tonnes &#8594; India &#8377;9,300Cr dental Pd &#8594; Dentworks 500K crowns/yr &#8594; 1050&#176;C melting &#8594; biocompatible &#8594; CTE matched porcelain' },
  { id: 'PDA-0002', batchNo: 'PDA-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', alloyGrade: 'Pd-H 65/35 Membrane', application: 'H2 Purification (IOCL)', palladiumPercent: 65.0, meltingPointC: 1550, investmentCr: 780, status: 'Delivered', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TG)', destination: 'IOCL Panipat (HR)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'Pd-H alloy membrane tube for IOCL refinery H2 purification &#8594; 65% Pd &#8594; &#8377;780Cr for 4 tonnes &#8594; India &#8377;23,400Cr refinery Pd &#8594; IOCL 30 MT/day H2 &#8594; 1550&#176;C sinter &#8594; 99.999% H2 purity &#8594; 200um wall' },
  { id: 'PDA-0003', batchNo: 'PDA-B2403', city: 'Hyderabad', manufacturer: 'BEL', alloyGrade: 'Pd-Ni 50/50 Contact', application: 'Relay Contact (BEL)', palladiumPercent: 50.0, meltingPointC: 1300, investmentCr: 195, status: 'Delivered', priority: 'High', origin: 'BEL Bengaluru (KA)', destination: 'BEL Ghaziabad (UP)', shipDate: '2026-07-17', transitDays: 3, zone: 'South', remarks: 'Pd-Ni 50/50 electrical contact rivet for BEL defence relay &#8594; 50% Pd &#8594; &#8377;195Cr for 8 tonnes &#8594; India &#8377;5,850Cr defence Pd &#8594; BEL 100K relays/yr &#8594; 1300&#176;C forge &#8594; low contact resistance &#8594; 10M cycle life' },
  { id: 'PDA-0004', batchNo: 'PDA-B2404', city: 'Chennai', manufacturer: 'IGCAR', alloyGrade: 'Pd-Ag 60/40 Neutron', application: 'Nuclear Control Rod (IGCAR)', palladiumPercent: 60.0, meltingPointC: 1200, investmentCr: 520, status: 'Delivered', priority: 'Critical', origin: 'IGCAR Kalpakkam (TN)', destination: 'NPCIL Kakrapar (GJ)', shipDate: '2026-07-18', transitDays: 2, zone: 'South', remarks: 'Pd-Ag 60/40 alloy sheet for PFBR fast neutron absorber &#8594; 60% Pd &#8594; &#8377;520Cr for 3 tonnes &#8594; India &#8377;15,600Cr nuclear Pd &#8594; NPCIL 700 MWe PFBR &#8594; 1200&#176;C service &#8594; high neutron cross-section &#8594; 5mm sheet' },
  { id: 'PDA-0005', batchNo: 'PDA-B2405', city: 'Pune', manufacturer: 'Bharat Forge', alloyGrade: 'Pd-Ru 95/5 Catalyst', application: 'Catalytic Converter (Bharat Forge)', palladiumPercent: 95.0, meltingPointC: 1550, investmentCr: 640, status: 'Delivered', priority: 'Critical', origin: 'Bharat Forge Pune (MH)', destination: 'Bharat Forge Aurangabad (MH)', shipDate: '2026-07-19', transitDays: 1, zone: 'West', remarks: 'Pd-Ru 95/5 washcoat catalyst for Bharat Forge BS-VI catalytic converter &#8594; 95% Pd &#8594; &#8377;640Cr for 2 tonnes &#8594; India &#8377;19,200Cr auto Pd &#8594; Bharat Forge 5M converters/yr &#8594; 1550&#176;C calcine &#8594; 95% CO conversion &#8594; gamma-alumina' },
  { id: 'PDA-0006', batchNo: 'PDA-B2406', city: 'Kolkata', manufacturer: 'SAIL', alloyGrade: 'Pd 99.95% Wire 0.1mm', application: 'Jewellery Solder (Titan)', palladiumPercent: 99.95, meltingPointC: 1555, investmentCr: 275, status: 'Delivered', priority: 'Medium', origin: 'Hindustan Platinum Mumbai (MH)', destination: 'Titan Hosur (TN)', shipDate: '2026-07-20', transitDays: 2, zone: 'East', remarks: 'High-purity Pd fine wire for Titan jewellery laser welding solder &#8594; 99.95% Pd &#8594; &#8377;275Cr for 1.5 tonnes &#8594; India &#8377;8,250Cr jewellery Pd &#8594; Titan 300K pieces/yr &#8594; 1555&#176;C melting &#8594; white gold solder &#8594; 0.1mm diameter' },
  { id: 'PDA-0007', batchNo: 'PDA-B2407', city: 'Ahmedabad', manufacturer: 'Gujarat Pd Industries', alloyGrade: 'Pd-Cu 40/60 Wire', application: 'H2 Sensor (Drager India)', palladiumPercent: 40.0, meltingPointC: 1200, investmentCr: 185, status: 'Delivered', priority: 'High', origin: 'Gujarat Pd Ahmedabad (GJ)', destination: 'Drager Mumbai (MH)', shipDate: '2026-07-21', transitDays: 1, zone: 'West', remarks: 'Pd-Cu 40/60 alloy wire for Drager India industrial H2 leak sensor &#8594; 40% Pd &#8594; &#8377;185Cr for 5 tonnes &#8594; India &#8377;5,550Cr sensor Pd &#8594; Drager 100K sensors/yr &#8594; 1200&#176;C anneal &#8594; resistive sensing &#8594; 0.05mm wire' },
  { id: 'PDA-0008', batchNo: 'PDA-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Pd Alloys', alloyGrade: 'Pd-Ag 70/30 Brazing', application: 'Aero Brazing (HAL)', palladiumPercent: 70.0, meltingPointC: 1100, investmentCr: 430, status: 'Delivered', priority: 'Critical', origin: 'Rajasthan Pd Jaipur (RJ)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-22', transitDays: 2, zone: 'North', remarks: 'Pd-Ag 70/30 brazing foil for HAL Su-30MKI engine turbine blade &#8594; 70% Pd &#8594; &#8377;430Cr for 3 tonnes &#8594; India &#8377;12,900Cr aero Pd &#8594; HAL 220 Su-30 fleet &#8594; 1100&#176;C braze &#8594; vacuum furnace &#8594; 50um foil' },
  { id: 'PDA-0009', batchNo: 'PDA-B2409', city: 'Coimbatore', manufacturer: 'Tamil Nadu Pd Works', alloyGrade: 'Pd-Co 50/50 Plating', application: 'Connector Plating (Molex)', palladiumPercent: 50.0, meltingPointC: 1400, investmentCr: 165, status: 'Delivered', priority: 'Medium', origin: 'Tamil Nadu Pd Coimbatore (TN)', destination: 'Molex Bengaluru (KA)', shipDate: '2026-07-23', transitDays: 1, zone: 'South', remarks: 'Pd-Co 50/50 plating anode for Molex India PCB connector &#8594; 50% Pd &#8594; &#8377;165Cr for 6 tonnes &#8594; India &#8377;4,950Cr electronics Pd &#8594; Molex 500M connectors/yr &#8594; 1400&#176;C cast &#8594; 2um plate &#8594; 0.08 ohm/sq' },
  { id: 'PDA-0010', batchNo: 'PDA-B2410', city: 'Bhubaneswar', manufacturer: 'Odisha Pd Refinery', alloyGrade: 'Pd-Au 80/20 Spark', application: 'Spark Plug (Mico Bosch)', palladiumPercent: 80.0, meltingPointC: 1300, investmentCr: 210, status: 'Delivered', priority: 'Medium', origin: 'Odisha Pd Bhubaneswar (OD)', destination: 'Mico Bosch Bengaluru (KA)', shipDate: '2026-07-24', transitDays: 3, zone: 'East', remarks: 'Pd-Au 80/20 fine wire for Mico Bosch iridium-tipped spark plug electrode &#8594; 80% Pd &#8594; &#8377;210Cr for 2 tonnes &#8594; India &#8377;6,300Cr auto Pd &#8594; Bosch 50M plugs/yr &#8594; 1300&#176;C arc &#8594; 100K km life &#8594; 0.05mm wire' },
  { id: 'PDA-0011', batchNo: 'PDA-B2411', city: 'Guwahati', manufacturer: 'Assam Pd Works', alloyGrade: 'Pd 99.9% Sponge', application: 'Pharma Catalyst (Sun Pharma)', palladiumPercent: 99.9, meltingPointC: 1554, investmentCr: 340, status: 'Delivered', priority: 'High', origin: 'Assam Pd Guwahati (AS)', destination: 'Sun Pharma Ahmedabad (GJ)', shipDate: '2026-07-25', transitDays: 4, zone: 'East', remarks: 'Pure Pd sponge catalyst for Sun Pharma API hydrogenation reactor &#8594; 99.9% Pd &#8594; &#8377;340Cr for 1.5 tonnes &#8594; India &#8377;10,200Cr pharma Pd &#8594; Sun Pharma $5B revenue &#8594; 1554&#176;C melting &#8594; 5% Pd/C &#8594; 95% recovery' },
  { id: 'PDA-0012', batchNo: 'PDA-B2412', city: 'Surat', manufacturer: 'Gujarat Pd Technologies', alloyGrade: 'Pd-Ag 50/50 Clad', application: 'Fuel Cell Electrode (Reliance)', palladiumPercent: 50.0, meltingPointC: 1150, investmentCr: 580, status: 'Delayed', priority: 'Critical', origin: 'Gujarat Pd Technologies Surat (GJ)', destination: 'Reliance Jamnagar (GJ)', shipDate: '2026-07-10', transitDays: 10, zone: 'West', remarks: 'Pd-Ag 50/50 clad sheet for Reliance PEM fuel cell cathode &#8594; 50% Pd &#8594; &#8377;580Cr for 4 tonnes &#8594; India &#8377;17,400Cr fuel cell Pd &#8594; monsoon delay &#8594; 1150&#176;C roll bond &#8594; 0.1mm clad &#8594; 1.2 V stack' },
  { id: 'PDA-0013', batchNo: 'PDA-B2413', city: 'Noida', manufacturer: 'UP Pd Alloys', alloyGrade: 'Pd 99.99% Evap', application: 'Electronics Evaporation (SCL)', palladiumPercent: 99.99, meltingPointC: 1555, investmentCr: 290, status: 'Delivered', priority: 'High', origin: 'UP Pd Alloys Noida (UP)', destination: 'SCL Mohali (PB)', shipDate: '2026-07-26', transitDays: 1, zone: 'North', remarks: 'Ultra-pure Pd evaporation pellet for SCL semiconductor metallization &#8594; 99.99% Pd &#8594; &#8377;290Cr for 0.5 tonnes &#8594; India &#8377;8,700Cr semi Pd &#8594; SCL 28nm line &#8594; 1555&#176;C melting &#8594; e-beam grade &#8594; 6N purity' },
  { id: 'PDA-0014', batchNo: 'PDA-B2414', city: 'Bhopal', manufacturer: 'BHEL', alloyGrade: 'Pd-Cr 60/40 Trimetal', application: 'Chemical Reactor (Larsen Toubro)', palladiumPercent: 60.0, meltingPointC: 1350, investmentCr: 245, status: 'Delivered', priority: 'High', origin: 'BHEL Bhopal (MP)', destination: 'L&T Vadodara (GJ)', shipDate: '2026-07-27', transitDays: 2, zone: 'North', remarks: 'Pd-Cr 60/40 trimetallic gasket sheet for L&T polyethylene reactor &#8594; 60% Pd &#8594; &#8377;245Cr for 8 tonnes &#8594; India &#8377;7,350Cr process Pd &#8594; L&T 500 reactors &#8594; 1350&#176;C service &#8594; 20 MPa rated &#8594; 2mm sheet' }
]

const delayedSet = new Set(palladiumAlloyRecords.filter(r => r.status === 'Delayed').map(r => r.id))

export default function PalladiumAlloyLogisticsView() {
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
    let data = palladiumAlloyRecords
    if (search) data = data.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase())))
    Object.entries(filters).forEach(([k, vals]) => { if (vals.length) data = data.filter(r => vals.includes(String((r as any)[k]))) })
    return data
  }, [search, filters])

  const total = palladiumAlloyRecords.length
  const delivered = palladiumAlloyRecords.filter(r => r.status === 'Delivered').length
  const totalCr = palladiumAlloyRecords.reduce((s: number, r) => s + r.investmentCr, 0)
  const avgPd = +(palladiumAlloyRecords.reduce((s: number, r) => s + r.palladiumPercent, 0) / total).toFixed(1)

  const manufacturers = [...new Set(palladiumAlloyRecords.map(r => r.manufacturer))]
  const zones = [...new Set(palladiumAlloyRecords.map(r => r.zone))]

  return (
    <div className="space-y-6">
      <PageHeader title="Palladium Alloy Logistics" description="Indian palladium alloy supply chain tracking across dental, hydrogen purification, nuclear, catalytic converter, jewellery, fuel cell and pharmaceutical sectors" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-rose-600">{total}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-rose-600">{delivered}</div><div className="text-xs text-muted-foreground">Delivered</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-rose-600">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-rose-600">{avgPd}%</div><div className="text-xs text-muted-foreground">Avg Pd Content</div></CardContent></Card>
      </div>

      <div className="flex gap-2 border-b">
        {tabs.map((t, i) => (<button key={t} className={`px-4 py-2 ${activeTab === i ? 'border-b-2 border-rose-600 text-rose-600 font-semibold' : 'text-muted-foreground'}`} onClick={() => setActiveTab(i)}>{t}</button>))}
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
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">Pd%</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.alloyGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.palladiumPercent}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
      </div>)}

      {activeTab === 1 && (<div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {manufacturers.map(m => <Badge key={m} variant={filters.manufacturer?.includes(m) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('manufacturer', m)}>{m}</Badge>)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">By Manufacturer</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([m, c]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Purity Classification</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const n = r.palladiumPercent >= 95 ? 'Pure (95%+)' : r.palladiumPercent >= 70 ? 'High (70-95%)' : r.palladiumPercent >= 50 ? 'Medium (50-70%)' : 'Low (<50%)'; m[n] = (m[n] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        </div>
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Manufacturer</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Origin</th><th className="p-2 text-left">Destination</th><th className="p-2 text-right">Transit</th><th className="p-2 text-left">Zone</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.manufacturer}</td><td className="p-2">{r.alloyGrade}</td><td className="p-2">{r.origin}</td><td className="p-2">{r.destination}</td><td className="p-2 text-right">{r.transitDays}d</td><td className="p-2">{r.zone}</td></tr>))}</tbody></table></div></div>
      </div>)}

      {activeTab === 2 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Melting Point Range</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const n = r.meltingPointC >= 1500 ? 'Ultra-High (1500+ C)' : r.meltingPointC >= 1300 ? 'High (1300-1500 C)' : r.meltingPointC >= 1100 ? 'Medium (1100-1300 C)' : 'Low (<1100 C)'; m[n] = (m[n] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Critical Applications (Pd 60%+)</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.palladiumPercent >= 60).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.alloyGrade} ({r.palladiumPercent}% Pd)</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
      </div>)}

      {activeTab === 3 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardContent><div className="text-sm font-medium text-rose-600 mb-2">H2 Purification Pd Membrane Boom</div><div className="text-xs text-muted-foreground">India targeting 10 GW green hydrogen by 2030, driving massive Pd membrane demand for refinery H2 purification. IOCL, HPCL and BPCL collectively need 15 TPA Pd-H alloy tubes. DRDO DMRL and Hindustan Platinum establishing 5 TPA Pd membrane tube manufacturing by 2027.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-rose-600 mb-2">BS-VI Pd Catalyst Demand</div><div className="text-xs text-muted-foreground">Indian automotive catalyst market at &#8377;8,500Cr, with Pd-Ru and Pd-Pt formulations replacing Pt-heavy Euro-5 designs. Bharat Forge, Uno Minda and Bosch India consuming 8 TPA Pd for BS-VI catalytic converters. 2-wheeler segment growing fastest at 45% CAGR.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-rose-600 mb-2">Monsoon Disrupts Fuel Cell Pd Supply</div><div className="text-xs text-muted-foreground">PDA-B2412 Pd-Ag 50/50 clad sheet for Reliance PEM fuel cell delayed 10 days due to Gujarat monsoon. Reliance Jamnagar 1 GW green hydrogen electrolyzer commissioning at risk. Recommend pre-positioning 5-tonne Pd clad buffer at Reliance warehouse.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-rose-600 mb-2">Pharma Pd Catalyst Recovery</div><div className="text-xs text-muted-foreground">Sun Pharma, Dr Reddys and Cipla consuming 6 TPA Pd catalyst for API hydrogenation. Circular economy push by Indian Pharma Alliance targeting 95% Pd recovery. Gujarat and Hyderabad setting up 3 Pd recycling plants by 2027, saving &#8377;2,000Cr/yr in import.</div></CardContent></Card>
      </div>)}
    </div>
  )
}
