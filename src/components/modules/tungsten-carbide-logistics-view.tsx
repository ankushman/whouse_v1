'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Target } from 'lucide-react'

interface TungstenCarbideRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  grade: string
  application: string
  hardnessHRA: number
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

const tungstenCarbideRecords: TungstenCarbideRecord[] = [
  { id: 'TCB-0001', batchNo: 'TCB-B2401', city: 'Pune', manufacturer: 'Sandvik Asia Pune', grade: 'WC-6%Co (K10)', application: 'Milling Cutter Insert (Bharat Forge)', hardnessHRA: 92.5, densityGcc: 14.95, investmentCr: 128, status: 'Delivered', priority: 'High', origin: 'Sandvik Pune (MH)', destination: 'Bharat Forge Pune (MH)', shipDate: '2026-07-18', transitDays: 0, zone: 'West', remarks: 'Sandvik K10 grade WC-6%Co milling insert for Bharat Forge crankshaft milling &#8594; HRA 92.5 hardness enables 800m/min cutting speed &#8594; &#8377;128Cr for 45,000 inserts &#8594; 40% longer tool life vs uncoated carbide &#8594; Sandvik &#8377;2,200Cr Pune plant with WC powder metallurgy and CVD coating &#8594; supplies aerospace defence and automotive sectors &#8594; sub-micron WC grain size 0.6um for superior edge strength' },
  { id: 'TCB-0002', batchNo: 'TCB-B2402', city: 'Bengaluru', manufacturer: 'Kennametal India', grade: 'WC-10%Co (K20)', application: 'Drill Button (NMDC Mining)', hardnessHRA: 90.8, densityGcc: 14.50, investmentCr: 95, status: 'In Transit', priority: 'Critical', origin: 'Kennametal Bengaluru (KA)', destination: 'NMDC Donimalai (KA)', shipDate: '2026-07-24', transitDays: 1, zone: 'South', remarks: 'Kennametal K20 grade drill button for NMDC iron ore mining &#8594; 90.8 HRA for high-impact rotary drilling &#8594; &#8377;95Cr for 28,000 buttons &#8594; 3x penetration rate vs steel bits &#8594; Kennametal India &#8377;1,800Cr Bengaluru facility with hot isostatic pressing &#8594; also supplies tunnel boring and foundation drilling &#8594; NMDC ramping to 67 MT iron ore production &#8594; drill button consumption 15,000/month' },
  { id: 'TCB-0003', batchNo: 'TCB-B2403', city: 'Mumbai', manufacturer: 'Iscar India', grade: 'WC-TiC-TaC (P25)', application: 'Turning Insert (Mahindra)', hardnessHRA: 91.5, densityGcc: 12.80, investmentCr: 72, status: 'Delivered', priority: 'Standard', origin: 'Iscar Mumbai (MH)', destination: 'Mahindra Nashik (MH)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: 'Iscar P25 coated carbide turning insert for Mahindra SUV engine block &#8594; multi-layer TiCN+Al2O3+TiN CVD coating &#8594; &#8377;72Cr for 32,000 inserts &#8594; enables dry machining reducing coolant cost 60% &#8594; Iscar India &#8377;900Cr Mumbai trading and regrind facility &#8594; parent Iscar IMC Group Israel &#8594; supplies top 20 Indian OEMs &#8594; chipbreaker geometry optimized for cast iron turning' },
  { id: 'TCB-0004', batchNo: 'TCB-B2404', city: 'Hyderabad', manufacturer: 'DMRL WC Facility', grade: 'WC-Ni-Cr (Anti-Corrosion)', application: 'Valve Seat Ring (HAL Engine)', hardnessHRA: 89.2, densityGcc: 14.20, investmentCr: 156, status: 'In Transit', priority: 'Critical', origin: 'DMRL Hyderabad (TS)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-23', transitDays: 1, zone: 'South', remarks: 'DMRL WC-Ni-Cr binderless carbide for HAL Tejas engine valve seat &#8594; replaces Stellite with 50% weight saving &#8594; &#8377;156Cr for 6,000 rings &#8594; Ni-Cr binder eliminates cobalt embrittlement at 700&#176;C &#8594; DMRL Defence Metallurgical Research Lab &#8377;1,600Cr WC programme &#8594; critical for Tejas Mark 2 GE F414 engine qualification &#8594; also qualified for LCA Mark 1A &#8594; 100% import substitution from Seco Tools Sweden' },
  { id: 'TCB-0005', batchNo: 'TCB-B2405', city: 'Coimbatore', manufacturer: 'Carborundum Universal', grade: 'WC-8%Co (M15)', application: 'Wire Drawing Die (Sterlite Copper)', hardnessHRA: 91.0, densityGcc: 14.70, investmentCr: 48, status: 'Processing', priority: 'High', origin: 'Carborundum Coimbatore (TN)', destination: 'Sterlite Silvassa (DH)', shipDate: '2026-07-25', transitDays: 1, zone: 'South', remarks: 'Carborundum M15 wire drawing die for Sterlite copper rod production &#8594; ultra-fine 0.3um WC grain for mirror-finish bore &#8594; &#8377;48Cr for 12,000 dies &#8594; die life 500,000m vs 200,000m steel die &#8594; Murugappa Group Carborundum &#8377;600Cr WC facility &#8594; also produces WC cutting tools and wear parts &#8594; supplies electrical cable and fastener industries &#8594; diamond wire drawing die partnership with Element Six' },
  { id: 'TCB-0006', batchNo: 'TCB-B2406', city: 'Jamshedpur', manufacturer: 'Tata Tungsten Works', grade: 'WC-12%Co (K40)', application: 'Coal Mining Picks (Coal India)', hardnessHRA: 88.5, densityGcc: 14.10, investmentCr: 82, status: 'Delayed', priority: 'Critical', origin: 'TTW Jamshedpur (JH)', destination: 'CIL Ranchi (JH)', shipDate: '2026-07-10', transitDays: 8, zone: 'East', remarks: 'TTW K40 grade coal mining pick for Coal India underground longwall &#8594; 88.5 HRA optimized for high-impact coal cutting &#8594; &#8377;82Cr for 35,000 picks &#8594; 8-day delay: WC powder supply disrupted from Jiangxi China &#8594; Tata sourcing alternate from Wolfram Bergbau Austria &#8594; TTW &#8377;450Cr legacy WC plant &#8594; Coal India world&apos;s largest coal producer 700 MT/year &#8594; pick consumption 80,000/month across 350 mines' },
  { id: 'TCB-0007', batchNo: 'TCB-B2407', city: 'Chennai', manufacturer: 'VSSC Carbide Lab', grade: 'WC-6%Ni (Aerospace)', application: 'Nozzle Throat Insert (ISRO)', hardnessHRA: 91.8, densityGcc: 14.80, investmentCr: 210, status: 'Delivered', priority: 'Critical', origin: 'VSSC Thiruvananthapuram (KL)', destination: 'Satish Dhawan SHAR (AP)', shipDate: '2026-07-12', transitDays: 1, zone: 'South', remarks: 'VSSC WC-6%Ni nozzle throat for ISRO PSLV Vikas engine &#8594; 91.8 HRA with 2,800&#176;C erosion resistance &#8594; &#8377;210Cr for 1,200 throat segments &#8594; 40% longer nozzle life vs graphite &#8594; VSSC &#8377;320Cr WC machining and sintering facility &#8594; qualified for 50+ PSLV missions &#8594; enabling 3D-printed WC nozzle via binder jetting &#8594; also for GSLV Mk-3 SCE nozzle extension' },
  { id: 'TCB-0008', batchNo: 'TCB-B2408', city: 'Kolkata', manufacturer: 'Minex WC India', grade: 'WC-20%Co (G30)', application: 'Cold Heading Die (Sona BLW)', hardnessHRA: 86.5, densityGcc: 13.60, investmentCr: 58, status: 'In Transit', priority: 'Standard', origin: 'Minex Kolkata (WB)', destination: 'Sona BLW Gurgaon (HR)', shipDate: '2026-07-22', transitDays: 3, zone: 'East', remarks: 'Minex G30 cold heading die for Sona BLW EV motor rotor shaft &#8594; 20% Co binder for maximum toughness &#8594; &#8377;86.5 HRA with TRS 2,800 MPa &#8594; &#8377;58Cr for 8,000 dies &#8594; die life 500,000 parts vs 150,000 D2 steel &#8594; Minex &#8377;280Cr Kolkata WC sintering &#8594; serves EV automotive and fastener industries &#8594; Sona BLW &#8377;5,000Cr EV motor plant targeting Tesla supply &#8594; growing demand for carbide cold forging dies' },
  { id: 'TCB-0009', batchNo: 'TCB-B2409', city: 'Ahmedabad', manufacturer: 'Ceratizit India', grade: 'WC-TiCN (C20)', application: 'Gear Hobbing Cutter (Amul Dairy)', hardnessHRA: 92.0, densityGcc: 13.40, investmentCr: 32, status: 'Delivered', priority: 'Standard', origin: 'Ceratizit Gandhinagar (GJ)', destination: 'Amul Anand (GJ)', shipDate: '2026-07-16', transitDays: 1, zone: 'West', remarks: 'Ceratizit C20 gear hob for Amul dairy processing equipment gearbox &#8594; TiCN coated for wet machining stainless steel &#8594; &#8377;32Cr for 5,000 hobs &#8594; module 2-6 range for M2 to M6 gears &#8594; Ceratizit India &#8377;450Cr Gandhinagar plant &#8594; parent Ceratizit Group Luxembourg &#8594; supplies food processing pharma and chemical gear industry &#8594; ReGrind programme extends hob life 3x' },
  { id: 'TCB-0010', batchNo: 'TCB-B2410', city: 'Ranchi', manufacturer: 'HIL Limited WC', grade: 'WC-15%Co (H20)', application: 'Crusher Cone Liner (NMDC)', hardnessHRA: 87.8, densityGcc: 13.90, investmentCr: 142, status: 'Processing', priority: 'High', origin: 'HIL Ranchi (JH)', destination: 'NMDC Bailadila (CG)', shipDate: '2026-07-26', transitDays: 2, zone: 'East', remarks: 'HIL H20 crusher liner for NMDC Bailadila iron ore gyratory crusher &#8594; 15% Co for maximum impact toughness &#8594; &#8377;142Cr for 4,000 liner segments &#8594; 6x wear life vs manganese steel &#8594; HIL (formerly Hindustan Insulations) &#8377;380Cr Ranchi WC plant &#8594; also supplies cement kiln roller and slurry pump liner &#8594; NMDC Bailadila producing 30 MT/year high-grade ore &#8594; liner replacement cycle 18 months vs 3 months manganese steel' },
  { id: 'TCB-0011', batchNo: 'TCB-B2411', city: 'Jaipur', manufacturer: 'Rajasthan WC Works', grade: 'WC-6%Co Ultra-Fine', application: 'PCB Micro Drill (DPI Rajasthan)', hardnessHRA: 93.2, densityGcc: 15.00, investmentCr: 38, status: 'Delivered', priority: 'Standard', origin: 'RWW Jaipur (RJ)', destination: 'DPI Jaipur (RJ)', shipDate: '2026-07-14', transitDays: 0, zone: 'North', remarks: 'RWW ultra-fine 0.2um WC grain micro drill for PCB via drilling &#8594; 93.2 HRA for 0.1mm diameter hole accuracy &#8594; &#8377;38Cr for 25,000 micro drills &#8594; &#177;2um hole position accuracy at 200K rpm &#8594; Rajasthan WC Works &#8377;220Cr Jaipur sintering &#8594; growing 5G and smartphone PCB demand &#8594; DPI &#8377;1,200Cr PCB fab for defence electronics &#8594; also supplies semiconductor package substrate drilling' },
  { id: 'TCB-0012', batchNo: 'TCB-B2412', city: 'Nagpur', manufacturer: 'WIDIA India', grade: 'WC-TiAlN (P40)', application: 'End Mill (L&T Defence)', hardnessHRA: 92.8, densityGcc: 13.00, investmentCr: 115, status: 'In Transit', priority: 'Critical', origin: 'WIDIA Nagpur (MH)', destination: 'L&T Armoured Systems MP', shipDate: '2026-07-21', transitDays: 2, zone: 'West', remarks: 'WIDIA P40 TiAlN coated end mill for L&T K9 Vajra howitzer barrel bore &#8594; 92.8 HRA with 3,500 HV coating hardness &#8594; &#8377;115Cr for 8,000 end mills &#8594; precision deep-hole boring to &#177;5um tolerance &#8594; WIDIA India &#8377;1,400Cr Nagpur plant &#8594; originally Indian HSS brand acquired by Kennametal &#8594; supplies Indian Ordnance Factories and L&amp;T Defence &#8594; critical for Pinaka MBRL and BrahMos launcher machining' },
  { id: 'TCB-0013', batchNo: 'TCB-B2413', city: 'Bhubaneswar', manufacturer: 'NALCO Tungsten Div', grade: 'WC-8%Ni-0.5%Cr3C2', application: 'Thermal Spray Powder (NTPC)', hardnessHRA: 90.0, densityGcc: 14.30, investmentCr: 85, status: 'Delivered', priority: 'High', origin: 'NALCO Bhubaneswar (OD)', destination: 'NTPC Talcher (OD)', shipDate: '2026-07-17', transitDays: 0, zone: 'East', remarks: 'NALCO WC thermal spray powder for NTPC boiler tube anti-erosion coating &#8594; 8%Ni+0.5%Cr3C2 binder resists high-temp oxidation at 600&#176;C &#8594; &#8377;85Cr for 10,000 kg spray powder &#8594; 5x coating life vs uncoated tube &#8594; NALCO &#8377;560Cr tungsten division &#8594; ammonium paratungstate (APT) production from tungsten ore &#8594; backward integration from Rajasthani tungsten mines &#8594; NTPC 3.2 GW Talcher largest power plant in India &#8594; boiler tube erosion costs &#8377;800Cr/year' },
  { id: 'TCB-0014', batchNo: 'TCB-B2414', city: 'Thiruvananthapuram', manufacturer: 'VSSC Nano-WC Lab', grade: 'Nano-WC Composite', application: 'Satellite Reaction Wheel (ISRO)', hardnessHRA: 94.0, densityGcc: 15.20, investmentCr: 265, status: 'Delayed', priority: 'Critical', origin: 'VSSC Thiruvananthapuram (KL)', destination: 'ISAC Bengaluru (KA)', shipDate: '2026-07-08', transitDays: 10, zone: 'South', remarks: 'VSSC nano-WC composite for ISRO GSAT-N2 reaction wheel bearing &#8594; 94.0 HRA with nano-grain 50nm WC &#8594; &#8377;265Cr for 800 bearing sets &#8594; 10-day delay: spark plasma sintering (SPS) cycle extended &#8594; bearing life 15 years vs 7 years conventional WC &#8594; VSSC &#8377;480Cr nano-WC programme &#8594; critical for satellite attitude control precision &#8594; ISAC integration for GSAT-N2 thermal vacuum test &#8594; &#8377;12,000Cr GSAT-N2 satellite at stake' }
]

const tcbKpis = [
  { label: 'In Transit / Shipped', value: tungstenCarbideRecords.filter(r => r.status === 'In Transit' || r.status === 'Shipped').length, suffix: ' batches', color: 'text-blue-700 bg-blue-50' },
  { label: 'Processing / Sintering', value: tungstenCarbideRecords.filter(r => r.status === 'Processing' || r.status === 'Sintering').length, suffix: ' batches', color: 'text-amber-700 bg-amber-50' },
  { label: 'Delivered / Installed', value: tungstenCarbideRecords.filter(r => r.status === 'Delivered' || r.status === 'Installed').length, suffix: ' batches', color: 'text-emerald-700 bg-emerald-50' },
  { label: 'Total Investment', value: tungstenCarbideRecords.reduce((s: number, r) => s + r.investmentCr, 0), suffix: ' Cr', color: 'text-orange-700 bg-orange-50' }
]

export default function TungstenCarbideLogisticsView() {
  const [activeTab, setActiveTab] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights']

  const statusCounts = useMemo(() => {
    const map: Record<string, number> = {}
    tungstenCarbideRecords.forEach(r => { map[r.status] = (map[r.status] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const mfrCounts = useMemo(() => {
    const map: Record<string, number> = {}
    tungstenCarbideRecords.forEach(r => { map[r.manufacturer] = (map[r.manufacturer] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const appCounts = useMemo(() => {
    const map: Record<string, number> = {}
    tungstenCarbideRecords.forEach(r => { map[r.application] = (map[r.application] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const zoneCounts = useMemo(() => {
    const map: Record<string, number> = {}
    tungstenCarbideRecords.forEach(r => { map[r.zone] = (map[r.zone] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const filtered = useMemo(() => {
    return tungstenCarbideRecords.filter(r => {
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
    <div className="tcb-logistics-container p-4 space-y-4">
      <PageHeader title="Tungsten Carbide Logistics" description="Tungsten Carbide Industrial Tooling Supply Chain &#8212; WC-Co cutting tools, mining picks, wear parts, aerospace components, thermal spray powder and nano-WC composites for Indian manufacturing" />

      <div className="tcb-kpi-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {tcbKpis.map((kpi, i) => (
          <Card key={i} className="tcb-kpi-card border-l-4 border-l-orange-500"><CardContent className="p-4"><p className="text-xs text-muted-foreground">{kpi.label}</p><p className={`text-2xl font-bold ${kpi.color.split(' ')[0]}`}>{kpi.value.toLocaleString()}<span className="text-sm font-normal">{kpi.suffix}</span></p></CardContent></Card>
        ))}
      </div>

      <div className="tcb-tab-bar flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)} className={`tcb-tab-btn px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === i ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-muted-foreground hover:bg-orange-50 border'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && (
        <div className="tcb-dashboard space-y-4">
          <div className="tcb-chart-row grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="tcb-chart-card"><CardHeader><CardTitle className="text-sm">Batch Status Distribution</CardTitle></CardHeader><CardContent>
              <div className="tcb-bar-chart space-y-2">
                {statusCounts.map(([s, c]) => (
                  <div key={s} className="flex items-center gap-2"><span className="text-xs w-20 text-right truncate">{s}</span><div className="flex-1 bg-orange-100 rounded-full h-4 overflow-hidden"><div className="tcb-bar-fill h-full bg-orange-500 rounded-full" style={{ width: `${(c / tungstenCarbideRecords.length) * 100}%` }} /></div><span className="text-xs font-medium w-6">{c}</span></div>
                ))}
              </div>
            </CardContent></Card>
            <Card className="tcb-chart-card"><CardHeader><CardTitle className="text-sm">Manufacturer Volume</CardTitle></CardHeader><CardContent>
              <div className="tcb-bar-chart space-y-2">
                {mfrCounts.slice(0, 8).map(([m, c]) => (
                  <div key={m} className="flex items-center gap-2"><span className="text-xs w-28 text-right truncate">{m}</span><div className="flex-1 bg-orange-100 rounded-full h-4 overflow-hidden"><div className="tcb-bar-fill h-full bg-orange-400 rounded-full" style={{ width: `${(c / tungstenCarbideRecords.length) * 100}%` }} /></div><span className="text-xs font-medium w-6">{c}</span></div>
                ))}
              </div>
            </CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 1 && (
        <div className="tcb-registry space-y-3">
          <div className="tcb-filter-bar flex flex-wrap gap-2 items-center">
            <Input placeholder="Search batches..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="max-w-xs h-8 text-sm" />
            {['status', 'zone', 'priority'].map(key => (
              <div key={key} className="tcb-filter-group flex flex-wrap gap-1">
                {Array.from(new Set(tungstenCarbideRecords.map(r => r[key as keyof TungstenCarbideRecord] as string))).filter(Boolean).slice(0, 4).map(val => (
                  <button key={val} onClick={() => toggleFilter(key, val)} className={`tcb-filter-btn px-2 py-1 text-xs rounded-md border transition-all ${activeFilters[key]?.includes(val) ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-muted-foreground hover:bg-orange-50'}`}>
                    {val}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <Card><CardContent className="p-0">
            <div className="tcb-table-wrap overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="border-b bg-orange-50/50">
                  <th className="p-2 text-left font-medium">Batch ID</th><th className="p-2 text-left font-medium">Manufacturer</th><th className="p-2 text-left font-medium">Grade</th><th className="p-2 text-left font-medium">Application</th><th className="p-2 text-left font-medium">HRA</th><th className="p-2 text-left font-medium">Investment</th><th className="p-2 text-left font-medium">Status</th><th className="p-2 text-left font-medium">Origin</th><th className="p-2 text-left font-medium">Dest</th><th className="p-2 text-left font-medium">Days</th>
                </tr></thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={r.id} className={`tcb-table-row border-b hover:bg-orange-50/30 transition-colors ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                      <td className="p-2"><Badge variant="outline" className="text-orange-700 border-orange-300 font-mono">{r.id}</Badge></td>
                      <td className="p-2">{r.manufacturer}</td><td className="p-2">{r.grade}</td><td className="p-2">{r.application}</td>
                      <td className="p-2">{r.hardnessHRA}</td><td className="p-2">{r.investmentCr}Cr</td>
                      <td className="p-2"><Badge className={`${r.status === 'Delayed' ? 'bg-red-100 text-red-800' : r.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : r.status === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>{r.status}</Badge></td>
                      <td className="p-2 truncate max-w-28">{r.origin}</td><td className="p-2 truncate max-w-28">{r.destination}</td><td className="p-2">{r.transitDays}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent></Card>
        </div>
      )}

      {activeTab === 2 && (
        <div className="tcb-analytics space-y-4">
          <div className="tcb-chart-row grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="tcb-chart-card"><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent>
              <div className="tcb-bar-chart space-y-2">
                {(Object.entries(zoneCounts.reduce((acc: Record<string, number>, [z]) => {
                  const total = tungstenCarbideRecords.filter(r => r.zone === z).reduce((s: number, rr) => s + rr.investmentCr, 0)
                  acc[z] = total
                  return acc
                }, {})) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([z, v]) => (
                  <div key={z} className="flex items-center gap-2"><span className="text-xs w-16 text-right">{z}</span><div className="flex-1 bg-orange-100 rounded-full h-4 overflow-hidden"><div className="tcb-bar-fill h-full bg-orange-500 rounded-full" style={{ width: `${(v / 300) * 100}%` }} /></div><span className="text-xs font-medium w-14 text-right">{v}Cr</span></div>
                ))}
              </div>
            </CardContent></Card>
            <Card className="tcb-chart-card"><CardHeader><CardTitle className="text-sm">Application Distribution</CardTitle></CardHeader><CardContent>
              <div className="tcb-bar-chart space-y-2">
                {appCounts.slice(0, 8).map(([a, c]) => (
                  <div key={a} className="flex items-center gap-2"><span className="text-xs w-36 text-right truncate">{a}</span><div className="flex-1 bg-orange-100 rounded-full h-4 overflow-hidden"><div className="tcb-bar-fill h-full bg-orange-400 rounded-full" style={{ width: `${(c / tungstenCarbideRecords.length) * 100}%` }} /></div><span className="text-xs font-medium w-6">{c}</span></div>
                ))}
              </div>
            </CardContent></Card>
            <Card className="tcb-chart-card"><CardHeader><CardTitle className="text-sm">Hardness (HRA) Range</CardTitle></CardHeader><CardContent>
              <div className="tcb-bar-chart space-y-2">
                {tungstenCarbideRecords.sort((a, b) => b.hardnessHRA - a.hardnessHRA).slice(0, 8).map(r => (
                  <div key={r.id} className="flex items-center gap-2"><span className="text-xs w-28 text-right truncate">{r.grade.split('(')[0].trim()}</span><div className="flex-1 bg-orange-100 rounded-full h-4 overflow-hidden"><div className="tcb-bar-fill h-full bg-orange-300 rounded-full" style={{ width: `${(r.hardnessHRA / 95) * 100}%` }} /></div><span className="text-xs font-medium w-12 text-right">{r.hardnessHRA}</span></div>
                ))}
              </div>
            </CardContent></Card>
            <Card className="tcb-chart-card"><CardHeader><CardTitle className="text-sm">Avg Transit Days by Status</CardTitle></CardHeader><CardContent>
              <div className="tcb-bar-chart space-y-2">
                {(Object.entries(tungstenCarbideRecords.reduce((acc: Record<string, { sum: number; count: number }>, r) => {
                  if (!acc[r.status]) acc[r.status] = { sum: 0, count: 0 }
                  acc[r.status].sum += r.transitDays
                  acc[r.status].count += 1
                  return acc
                }, {})) as [string, { sum: number; count: number }][]).map(([s, v]) => (
                  <div key={s} className="flex items-center gap-2"><span className="text-xs w-20 text-right truncate">{s}</span><div className="flex-1 bg-orange-100 rounded-full h-4 overflow-hidden"><div className="tcb-bar-fill h-full bg-orange-500 rounded-full" style={{ width: `${(v.sum / v.count / 12) * 100}%` }} /></div><span className="text-xs font-medium w-12 text-right">{(v.sum / v.count).toFixed(1)}d</span></div>
                ))}
              </div>
            </CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 3 && (
        <div className="tcb-insights space-y-3">
          <Card className="tcb-insight-card border-l-4 border-l-orange-600"><CardHeader><CardTitle className="text-sm text-orange-800">India Tungsten Carbide Industry: &#8377;12,500Cr Market</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">India&apos;s tungsten carbide tooling market is valued at &#8377;12,500Cr &#8594; 14 manufacturers across 13 cities serving mining, automotive, aerospace, defence, energy and electronics sectors &#8594; domestic production meets only 25% of demand with 75% imported from China (Jiangxi), Israel (Iscar), Luxembourg (Ceratizit) and Sweden (Sandvik) &#8594; PLI scheme for speciality alloys targeting 60% self-sufficiency by 2028 &#8594; NALCO Bhubaneswar developing APT-to-WC backward integration &#8594; key grades: K-series (straight WC-Co for machining), P-series (WC-TiC-TaC for steel), G-series (WC-Co for mining) &#8594; &#8377;3,200Cr total investment across Indian WC plants.</p></CardContent></Card>
          <Card className="tcb-insight-card border-l-4 border-l-red-500"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Batches: TCB-0006 and TCB-0014</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">TCB-0006 (Tata Tungsten Works Jamshedpur to Coal India Ranchi, 8-day delay): K40 mining pick WC powder supply disrupted from Jiangxi China due to export controls &#8594; 35,000 picks worth &#8377;82Cr for CIL underground longwall operations &#8594; Tata sourcing alternate from Wolfram Bergbau Austria at 30% premium &#8594; CIL mining operations at 3 longwall faces impacted &#8594; alternate WC powder from NALCO Bhubaneswar APT plant being tested. TCB-0014 (VSSC to ISAC Bengaluru, 10-day delay): Nano-WC composite for GSAT-N2 reaction wheel bearing &#8594; spark plasma sintering cycle extended from 20min to 45min for grain uniformity &#8594; 800 bearing sets at &#8377;265Cr &#8594; ISRO GSAT-N2 thermal vacuum test integration delayed &#8594; satellite launch pushed &#8594; &#8377;12,000Cr mission at risk.</p></CardContent></Card>
          <Card className="tcb-insight-card border-l-4 border-l-orange-500"><CardHeader><CardTitle className="text-sm text-orange-700">Defence-Grade WC: Strategic Material for Ordnance</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Tungsten carbide is classified as a strategic defence material in India &#8594; DMRL Hyderabad developing cobalt-free WC-Ni-Cr grades for Tejas Mark 2 GE F414 engine &#8594; eliminates 100% import dependency on Seco Tools Sweden &#8594; WIDIA Nagpur (formerly Indian brand, now Kennametal) supplying Pinaka MBRL and BrahMos launcher machining end mills &#8594; VSSC nano-WC for satellite reaction wheels achieving 15-year life vs 7-year conventional &#8594; Indian Ordnance Factory Board consuming &#8377;800Cr/year of WC tooling &#8594; DDP (Department of Defence Production) targeting 50% indigenous WC for defence by 2029 &#8594; cobalt-free binder research critical to avoid DRC conflict mineral supply chain.</p></CardContent></Card>
          <Card className="tcb-insight-card border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm text-emerald-700">NALCO Backward Integration: India&apos;s Tungsten Ambition</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">NALCO Bhubaneswar is leading India&apos;s tungsten value chain integration &#8594; operating &#8377;560Cr ammonium paratungstate (APT) plant converting tungsten ore to APT &#8594; Rajasthan tungsten mines (Degana, Zawar) supplying scheelite and wolframite ore &#8594; NALCO scaling to APT-to-WC conversion reducing import dependency from 75% to 40% &#8594; &#8377;2,200Cr integrated tungsten complex approved by Ministry of Mines &#8594; thermal spray powder for NTPC boiler tube protection saving &#8377;800Cr/year erosion losses &#8594; also producing WC wear parts for steel plants and cement mills &#8594; India has 12.5 million tonnes tungsten reserves (4th largest globally) &#8594; only 2% currently exploited.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
