'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Shield } from 'lucide-react'

interface AluminiumBronzeRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  alloyGrade: string
  application: string
  aluminiumPercent: number
  utsMPa: number
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

const aluminiumBronzeRecords: AluminiumBronzeRecord[] = [
  { id: 'ABA-0001', batchNo: 'ABA-B2401', city: 'Mumbai', manufacturer: 'Mazagon Dock Shipbuilders', alloyGrade: 'CuAl10Fe5Ni5 (C95500)', application: 'Propeller Hub (MDL Warship)', aluminiumPercent: 10.0, utsMPa: 650, investmentCr: 340, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'Mazagon Dock Mumbai (MH)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: 'C95500 AB5 propeller hub for MDL P15B Visakhapatnam-class destroyer \u2192 10.0% Al \u2192 \u20b9340Cr for 8 tonnes \u2192 India \u20b98,500Cr naval AlBr \u2192 MDL 7 warships \u2192 650 MPa UTS \u2192 seawater resistant \u2192 15 yr service' },
  { id: 'ABA-0002', batchNo: 'ABA-B2402', city: 'Kolkata', manufacturer: 'GRSE', alloyGrade: 'CuAl9Fe4Ni4 (C95700)', application: 'Pump Shaft (GRSE Corvette)', aluminiumPercent: 9.0, utsMPa: 580, investmentCr: 220, status: 'Delivered', priority: 'Critical', origin: 'SAIL Bhilai (CG)', destination: 'GRSE Kolkata (WB)', shipDate: '2026-07-16', transitDays: 1, zone: 'East', remarks: 'C95700 pump shaft for GRSE ASW corvette seawater pump \u2192 9.0% Al \u2192 \u20b9220Cr for 5 tonnes \u2192 India \u20b95,500Cr naval AlBr \u2192 GRSE 100+ vessels \u2192 580 MPa UTS \u2192 cavitation resistant \u2192 25 yr life' },
  { id: 'ABA-0003', batchNo: 'ABA-B2403', city: 'Visakhapatnam', manufacturer: 'Hindustan Shipyard', alloyGrade: 'CuAl8Fe3 (C61400)', application: 'Sea Water Valve (HSL)', aluminiumPercent: 8.0, utsMPa: 520, investmentCr: 175, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'HSL Visakhapatnam (AP)', shipDate: '2026-07-17', transitDays: 2, zone: 'South', remarks: 'C61400 sea valve for HSL fleet support ship ballast system \u2192 8.0% Al \u2192 \u20b9175Cr for 4 tonnes \u2192 India \u20b94,375Cr marine AlBr \u2192 HSL 200+ ships repaired \u2192 520 MPa UTS \u2192 biofouling resistant \u2192 DN200 size' },
  { id: 'ABA-0004', batchNo: 'ABA-B2404', city: 'Bengaluru', manufacturer: 'BEL', alloyGrade: 'CuAl10Ni5Fe4 (C63000)', application: 'Radar Mast Mount (BEL)', aluminiumPercent: 10.5, utsMPa: 680, investmentCr: 145, status: 'Delivered', priority: 'High', origin: 'MIDHANI Hyderabad (TG)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: 'C63000 mast mount for BEL coastal surveillance radar \u2192 10.5% Al \u2192 \u20b9145Cr for 3 tonnes \u2192 India \u20b93,625Cr defence AlBr \u2192 BEL 100+ radar sites \u2192 680 MPa UTS \u2192 salt spray resistant \u2192 welded fabrication' },
  { id: 'ABA-0005', batchNo: 'ABA-B2405', city: 'Kochi', manufacturer: 'Cochin Shipyard', alloyGrade: 'CuAl6Si2Fe (C95200)', application: 'Bearing Bush (CSL LNG)', aluminiumPercent: 6.0, utsMPa: 450, investmentCr: 260, status: 'Delivered', priority: 'High', origin: 'IGCAR Kalpakkam (TN)', destination: 'Cochin Shipyard Kochi (KL)', shipDate: '2026-07-19', transitDays: 1, zone: 'South', remarks: 'C95200 bearing for CSL LNG carrier cryogenic pump \u2192 6.0% Al \u2192 \u20b9260Cr for 6 tonnes \u2192 India \u20b96,500Cr marine AlBr \u2192 CSL 50 LNG vessels \u2192 450 MPa UTS \u2192 cryo-thermal stable \u2192 -196\u00b0C rated' },
  { id: 'ABA-0006', batchNo: 'ABA-B2406', city: 'Mumbai', manufacturer: 'L&T Shipbuilding', alloyGrade: 'CuAl10Fe3 (C95400)', application: 'Impeller (L&T Pump)', aluminiumPercent: 10.0, utsMPa: 620, investmentCr: 185, status: 'Delivered', priority: 'Medium', origin: 'SAIL Bokaro (JH)', destination: 'L&T Mumbai (MH)', shipDate: '2026-07-20', transitDays: 1, zone: 'West', remarks: 'C95400 impeller for L&T seawater desalination pump \u2192 10.0% Al \u2192 \u20b9185Cr for 4.5 tonnes \u2192 India \u20b94,625Cr pump AlBr \u2192 L&T 50 desal plants \u2192 620 MPa UTS \u2192 erosion resistant \u2192 8,000 hr MTBF' },
  { id: 'ABA-0007', batchNo: 'ABA-B2407', city: 'New Delhi', manufacturer: 'Indian Navy', alloyGrade: 'CuAl11Fe6Ni6 (C95800)', application: 'Submarine Fitting (Navy)', aluminiumPercent: 11.0, utsMPa: 700, investmentCr: 420, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'Naval Dockyard Mumbai (MH)', shipDate: '2026-07-21', transitDays: 1, zone: 'West', remarks: 'C95800 submarine hull fitting for INS Kalvari-class \u2192 11.0% Al \u2192 \u20b9420Cr for 10 tonnes \u2192 India \u20b910,500Cr subsea AlBr \u2192 Navy 16 submarines \u2192 700 MPa UTS \u2192 deep pressure rated \u2192 DEFSTAN 02-834' },
  { id: 'ABA-0008', batchNo: 'ABA-B2408', city: 'Ahmedabad', manufacturer: 'Reliance Petrochemical', alloyGrade: 'CuAl9Ni5Fe3 (C62300)', application: 'HEx Tube (Reliance Jamnagar)', aluminiumPercent: 9.0, utsMPa: 550, investmentCr: 310, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'Reliance Jamnagar (GJ)', shipDate: '2026-07-22', transitDays: 1, zone: 'West', remarks: 'C62300 tube for Reliance refinery heat exchanger \u2192 9.0% Al \u2192 \u20b9310Cr for 8 tonnes \u2192 India \u20b97,750Cr refinery AlBr \u2192 Reliance 35 refineries \u2192 550 MPa UTS \u2192 H2S resistant \u2192 350\u00b0C rated' },
  { id: 'ABA-0009', batchNo: 'ABA-B2409', city: 'Jaipur', manufacturer: 'Rajasthan Bronze Industries', alloyGrade: 'CuAl7Si3 (C94000)', application: 'Architectural Casting (L&T)', aluminiumPercent: 7.0, utsMPa: 480, investmentCr: 95, status: 'Delivered', priority: 'Low', origin: 'Rajasthan Bronze Jaipur (RJ)', destination: 'L&T Noida (UP)', shipDate: '2026-07-23', transitDays: 2, zone: 'North', remarks: 'C94000 casting for L&T Metro gate brackets \u2192 7.0% Al \u2192 \u20b995Cr for 2 tonnes \u2192 India \u20b92,375Cr arch AlBr \u2192 L&T 12 metro lines \u2192 480 MPa UTS \u2192 golden patina \u2192 sand cast' },
  { id: 'ABA-0010', batchNo: 'ABA-B2410', city: 'Coimbatore', manufacturer: 'Tamil Nadu Bronze Works', alloyGrade: 'CuAl10Fe5 (C95500)', application: 'Marine Fastener (Adani Ports)', aluminiumPercent: 10.0, utsMPa: 650, investmentCr: 140, status: 'Delivered', priority: 'Medium', origin: 'Tamil Nadu Bronze Coimbatore (TN)', destination: 'Adani Mundra (GJ)', shipDate: '2026-07-24', transitDays: 3, zone: 'South', remarks: 'C95500 bolts for Adani Mundra port crane \u2192 10.0% Al \u2192 \u20b9140Cr for 3 tonnes \u2192 India \u20b93,500Cr port AlBr \u2192 Adani 12 ports \u2192 650 MPa UTS \u2192 galvanic corrosion free \u2192 M48 thread' },
  { id: 'ABA-0011', batchNo: 'ABA-B2411', city: 'Bhubaneswar', manufacturer: 'Odisha Copper Industries', alloyGrade: 'CuAl9Fe4Ni5 (C95700)', application: 'Offshore Riser (ONGC)', aluminiumPercent: 9.0, utsMPa: 580, investmentCr: 390, status: 'Delivered', priority: 'Critical', origin: 'Odisha Copper Bhubaneswar (OD)', destination: 'ONGC Mumbai Offshore (MH)', shipDate: '2026-07-25', transitDays: 3, zone: 'East', remarks: 'C95700 riser for ONGC Mumbai High deep water production \u2192 9.0% Al \u2192 \u20b9390Cr for 9 tonnes \u2192 India \u20b99,750Cr ONGC AlBr \u2192 ONGC 200 wells \u2192 580 MPa UTS \u2192 2000m depth \u2192 cathodic protected' },
  { id: 'ABA-0012', batchNo: 'ABA-B2412', city: 'Guwahati', manufacturer: 'Assam Copper Works', alloyGrade: 'CuAl8Fe3 (C61400) Plate', application: 'Dam Gate Fitting (NHPC)', aluminiumPercent: 8.0, utsMPa: 520, investmentCr: 165, status: 'Delayed', priority: 'High', origin: 'Assam Copper Guwahati (AS)', destination: 'NHPC Itanagar (AR)', shipDate: '2026-07-11', transitDays: 9, zone: 'East', remarks: 'C61400 plate for NHPC dam spillway gate bearing \u2192 8.0% Al \u2192 \u20b9165Cr for 4 tonnes \u2192 India \u20b94,125Cr hydro AlBr \u2192 monsoon delay \u2192 520 MPa UTS \u2192 silt erosion resistant \u2192 50 yr dam life' },
  { id: 'ABA-0013', batchNo: 'ABA-B2413', city: 'Surat', manufacturer: 'Gujarat Bronze Technologies', alloyGrade: 'CuAl10Fe5Ni5 (C95500) Bar', application: 'Valve Stem (Kirloskar)', aluminiumPercent: 10.0, utsMPa: 650, investmentCr: 125, status: 'Delivered', priority: 'Medium', origin: 'Gujarat Bronze Surat (GJ)', destination: 'Kirloskar Pune (MH)', shipDate: '2026-07-26', transitDays: 2, zone: 'West', remarks: 'C95500 valve stem for Kirloskar marine sea valve \u2192 10.0% Al \u2192 \u20b9125Cr for 2.5 tonnes \u2192 India \u20b93,125Cr pump AlBr \u2192 Kirloskar 10K valves \u2192 650 MPa UTS \u2192 dezincification proof \u2192 410 SS seat pair' },
  { id: 'ABA-0014', batchNo: 'ABA-B2414', city: 'Noida', manufacturer: 'UP Bronze Alloys', alloyGrade: 'CuAl10Fe3 (C95400) Gear', application: 'Winch Gear (BHEL)', aluminiumPercent: 10.0, utsMPa: 620, investmentCr: 195, status: 'Delivered', priority: 'High', origin: 'UP Bronze Noida (UP)', destination: 'BHEL Bhopal (MP)', shipDate: '2026-07-27', transitDays: 3, zone: 'North', remarks: 'C95400 gear for BHEL 800 MW turbine hoist winch \u2192 10.0% Al \u2192 \u20b9195Cr for 3.5 tonnes \u2192 India \u20b94,875Cr power AlBr \u2192 BHEL 150 GW \u2192 620 MPa UTS \u2192 non-sparking \u2192 30,000 hr gear life' }
]

const delayedSet = new Set(aluminiumBronzeRecords.filter(r => r.status === 'Delayed').map(r => r.id))

export default function AluminiumBronzeLogisticsView() {
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
    let data = aluminiumBronzeRecords
    if (search) data = data.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase())))
    Object.entries(filters).forEach(([k, vals]) => { if (vals.length) data = data.filter(r => vals.includes(String((r as any)[k]))) })
    return data
  }, [search, filters])

  const total = aluminiumBronzeRecords.length
  const delivered = aluminiumBronzeRecords.filter(r => r.status === 'Delivered').length
  const totalCr = aluminiumBronzeRecords.reduce((s: number, r) => s + r.investmentCr, 0)
  const avgAl = +(aluminiumBronzeRecords.reduce((s: number, r) => s + r.aluminiumPercent, 0) / total).toFixed(1)

  const manufacturers = [...new Set(aluminiumBronzeRecords.map(r => r.manufacturer))]
  const zones = [...new Set(aluminiumBronzeRecords.map(r => r.zone))]

  return (
    <div className="space-y-6">
      <PageHeader title="Aluminium Bronze Logistics" description="Indian aluminium bronze alloy supply chain tracking across naval defence, marine, offshore, refinery and hydropower sectors" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-orange-700">{total}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-orange-700">{delivered}</div><div className="text-xs text-muted-foreground">Delivered</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-orange-700">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-orange-700">{avgAl}%</div><div className="text-xs text-muted-foreground">Avg Al Content</div></CardContent></Card>
      </div>

      <div className="flex gap-2 border-b">
        {tabs.map((t, i) => (<button key={t} className={`px-4 py-2 ${activeTab === i ? 'border-b-2 border-orange-700 text-orange-700 font-semibold' : 'text-muted-foreground'}`} onClick={() => setActiveTab(i)}>{t}</button>))}
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
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">Al%</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.alloyGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.aluminiumPercent}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
      </div>)}

      {activeTab === 1 && (<div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {manufacturers.map(m => <Badge key={m} variant={filters.manufacturer?.includes(m) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('manufacturer', m)}>{m}</Badge>)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">By Manufacturer</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([m, c]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">UTS Range</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const u = r.utsMPa < 500 ? 'Standard (<500 MPa)' : r.utsMPa < 600 ? 'Medium (500-600 MPa)' : r.utsMPa < 680 ? 'High (600-680 MPa)' : 'Ultra-High (>=680 MPa)'; m[u] = (m[u] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        </div>
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Manufacturer</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Origin</th><th className="p-2 text-left">Destination</th><th className="p-2 text-right">Transit</th><th className="p-2 text-left">Zone</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.manufacturer}</td><td className="p-2">{r.alloyGrade}</td><td className="p-2">{r.origin}</td><td className="p-2">{r.destination}</td><td className="p-2 text-right">{r.transitDays}d</td><td className="p-2">{r.zone}</td></tr>))}</tbody></table></div></div>
      </div>)}

      {activeTab === 2 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Al Content Distribution</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const a = r.aluminiumPercent < 8 ? 'Low (<8%)' : r.aluminiumPercent < 10 ? 'Medium (8-10%)' : 'High (>=10%)'; m[a] = (m[a] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">High-Strength Alloys (650+ MPa)</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.utsMPa >= 650).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.alloyGrade} ({r.utsMPa} MPa)</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
      </div>)}

      {activeTab === 3 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardContent><div className="text-sm font-medium text-orange-700 mb-2">Naval AlBr Programme Expansion</div><div className="text-xs text-muted-foreground">Indian Navy aluminium bronze consumption growing at 20% CAGR driven by P15B destroyers, P17A frigates and Scorpene submarines. MIDHANI is sole qualified supplier for submarine-grade C95800. Navy targets 200 warships by 2035, doubling AlBr demand.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-orange-700 mb-2">Offshore Deep Water Demand</div><div className="text-xs text-muted-foreground">ONGC and Reliance expanding deepwater production requiring high-strength AlBr risers and fittings. C95700 with 580 MPa UTS is preferred for 2000m depth applications. India deepwater market growing at 15% CAGR to 2030.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-orange-700 mb-2">Monsoon Dam Gate Delay</div><div className="text-xs text-muted-foreground">ABA-B2412 C61400 dam gate plate for NHPC delayed 9 days due to Assam-Brahmaputra monsoon corridor. This &#8377;165Cr shipment critical for Itanagar hydro project before flood season. Recommend Guwahati pre-stocking.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-orange-700 mb-2">MIDHANI Capacity Ramp-Up</div><div className="text-xs text-muted-foreground">MIDHANI expanding aluminium bronze capacity from 120 to 250 TPA by 2028 to meet naval and refinery demand. Currently importing 65% of C95500 grade from China and Japan. Defence procurement policy mandating 70% indigenous AlBr by 2027.</div></CardContent></Card>
      </div>)}
    </div>
  )
}
