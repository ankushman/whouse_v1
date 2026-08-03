import os

content = r"""'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Hammer } from 'lucide-react'

interface LeadAlloyRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  alloyGrade: string
  application: string
  leadPercent: number
  hardnessBH: number
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

const leadAlloyRecords: LeadAlloyRecord[] = [
  { id: 'LDA-0001', batchNo: 'LDA-B2401', city: 'Mumbai', manufacturer: 'Exide Industries', alloyGrade: 'Pb-Ca-Sn 99.7% Battery', application: 'Automotive Battery (Exide)', leadPercent: 99.7, hardnessBH: 12, investmentCr: 420, status: 'Delivered', priority: 'Critical', origin: 'Exide Kolkata (WB)', destination: 'Exide Mumbai (MH)', shipDate: '2026-07-15', transitDays: 2, zone: 'West', remarks: 'Pb-Ca-Sn lead-calcium-tin battery grid alloy for Exide 12V automotive &#8594; 99.7% Pb &#8594; &#8377;420Cr for 25 tonnes &#8594; India &#8377;12,600Cr battery Pb &#8594; Exide 40M batteries/yr &#8594; 12 BH hardness &#8594; low maintenance &#8594; 5yr design life' },
  { id: 'LDA-0002', batchNo: 'LDA-B2402', city: 'Bengaluru', manufacturer: 'Amararaja Batteries', alloyGrade: 'Pb-Sb 94/6 Hard', application: 'Inverter Battery (Amararaja)', leadPercent: 94.0, hardnessBH: 18, investmentCr: 310, status: 'Delivered', priority: 'High', origin: 'Amararaja Tirunelveli (TN)', destination: 'Amararaja Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 1, zone: 'South', remarks: 'Pb-6%Sb lead-antimony alloy for Amararaja tubular inverter battery &#8594; 94% Pb &#8594; &#8377;310Cr for 20 tonnes &#8594; India &#8377;9,300Cr battery Pb &#8594; Amararaja 20M inverters &#8594; 18 BH hardness &#8594; deep cycle &#8594; 1200 cycles' },
  { id: 'LDA-0003', batchNo: 'LDA-B2403', city: 'Hyderabad', manufacturer: 'IGCAR', alloyGrade: 'Pb-Bi Eutectic 44.5%', application: 'Nuclear Coolant (IGCAR)', leadPercent: 55.5, hardnessBH: 8, investmentCr: 680, status: 'Delivered', priority: 'Critical', origin: 'IGCAR Kalpakkam (TN)', destination: 'IGCAR Hyderabad (TG)', shipDate: '2026-07-17', transitDays: 1, zone: 'South', remarks: 'Pb-44.5%Bi eutectic alloy for IGCAR fast reactor coolant loop &#8594; 55.5% Pb &#8594; &#8377;680Cr for 8 tonnes &#8594; India &#8377;20,400Cr nuclear Pb &#8594; IGCAR 700 MWe PFBR &#8594; 8 BH hardness &#8594; 125&#176;C melting &#8594; 2 m/s flow' },
  { id: 'LDA-0004', batchNo: 'LDA-B2404', city: 'Chennai', manufacturer: 'BEL', alloyGrade: 'Pb-Sn 60/40 Solder', application: 'PCB Assembly (BEL)', leadPercent: 60.0, hardnessBH: 14, investmentCr: 195, status: 'Delivered', priority: 'High', origin: 'BEL Bengaluru (KA)', destination: 'BEL Chennai (TN)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: 'Pb-Sn 60/40 solder bar for BEL defence electronics PCB wave soldering &#8594; 60% Pb &#8594; &#8377;195Cr for 12 tonnes &#8594; India &#8377;5,850Cr defence Pb &#8594; BEL 100K PCBs/yr &#8594; 14 BH hardness &#8594; 183&#176;C melting &#8594; 63/37 eutectic' },
  { id: 'LDA-0005', batchNo: 'LDA-B2405', city: 'Pune', manufacturer: 'Bharat Forge', alloyGrade: 'Pb-2%Sn Soft', application: 'Axle Bearing (Indian Railways)', leadPercent: 98.0, hardnessBH: 6, investmentCr: 145, status: 'Delivered', priority: 'Medium', origin: 'Bharat Forge Pune (MH)', destination: 'IRIEM Chennai (TN)', shipDate: '2026-07-19', transitDays: 2, zone: 'West', remarks: 'Soft Pb-2%Sn bearing alloy for Indian Railways locomotive axle journal &#8594; 98% Pb &#8594; &#8377;145Cr for 15 tonnes &#8594; India &#8377;4,350Cr rail Pb &#8594; IR 13K locos &#8594; 6 BH hardness &#8594; self-lubricating &#8594; 120 km/h rated' },
  { id: 'LDA-0006', batchNo: 'LDA-B2406', city: 'Kolkata', manufacturer: 'Hindustan Copper', alloyGrade: 'Pb-Brass 70/30 Cable', application: 'Submarine Cable (TCIL)', leadPercent: 30.0, hardnessBH: 22, investmentCr: 265, status: 'Delivered', priority: 'High', origin: 'Hindustan Copper Khetri (RJ)', destination: 'TCIL Kolkata (WB)', shipDate: '2026-07-20', transitDays: 1, zone: 'East', remarks: 'Pb-brass sheath alloy for TCIL undersea telecom cable armour &#8594; 30% Pb &#8594; &#8377;265Cr for 10 tonnes &#8594; India &#8377;7,950Cr cable Pb &#8594; TCIL 5000 km &#8594; 22 BH hardness &#8594; 4000m depth &#8594; corrosion-proof' },
  { id: 'LDA-0007', batchNo: 'LDA-B2407', city: 'Ahmedabad', manufacturer: 'Gujarat Lead Industries', alloyGrade: 'Pb 99.99% Shield', application: 'X-ray Room Shielding (HCG)', leadPercent: 99.99, hardnessBH: 4, investmentCr: 380, status: 'Delivered', priority: 'Critical', origin: 'Gujarat Lead Ahmedabad (GJ)', destination: 'HCG Hospital Bengaluru (KA)', shipDate: '2026-07-21', transitDays: 2, zone: 'West', remarks: 'Ultra-pure Pb sheet for HCG cancer centre CT/PET room radiation shielding &#8594; 99.99% Pb &#8594; &#8377;380Cr for 18 tonnes &#8594; India &#8377;11,400Cr medical Pb &#8594; HCG 25 centres &#8594; 4 BH hardness &#8594; 2mm equivalent &#8594; 0.5 mmPb @ 100 kV' },
  { id: 'LDA-0008', batchNo: 'LDA-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Lead Smelters', alloyGrade: 'Pb-Sb 88/12 Bullet', application: 'Ammunition Core (OFB)', leadPercent: 88.0, hardnessBH: 24, investmentCr: 175, status: 'Delivered', priority: 'High', origin: 'Rajasthan Lead Jaipur (RJ)', destination: 'OFB Bhopal (MP)', shipDate: '2026-07-22', transitDays: 2, zone: 'North', remarks: 'Pb-12%Sb hard lead alloy for OFB small arms bullet core &#8594; 88% Pb &#8594; &#8377;175Cr for 8 tonnes &#8594; India &#8377;5,250Cr defence Pb &#8594; OFB 500M rounds/yr &#8594; 24 BH hardness &#8594; 850 m/s velocity &#8594; 9mm parabellum' },
  { id: 'LDA-0009', batchNo: 'LDA-B2409', city: 'Coimbatore', manufacturer: 'Tamil Nadu Lead Works', alloyGrade: 'Pb-Ca 99.85% VRLA', application: 'Telecom Battery (Amara Raja)', leadPercent: 99.85, hardnessBH: 10, investmentCr: 285, status: 'Delivered', priority: 'Medium', origin: 'Tamil Nadu Lead Coimbatore (TN)', destination: 'Airtel Chennai (TN)', shipDate: '2026-07-23', transitDays: 1, zone: 'South', remarks: 'Pb-Ca lead-calcium alloy for Airtel VRLA telecom tower battery &#8594; 99.85% Pb &#8594; &#8377;285Cr for 14 tonnes &#8594; India &#8377;8,550Cr telecom Pb &#8594; Airtel 300K towers &#8594; 10 BH hardness &#8594; 10yr float life &#8594; sealed maintenance-free' },
  { id: 'LDA-0010', batchNo: 'LDA-B2410', city: 'Bhubaneswar', manufacturer: 'Odisha Lead Refinery', alloyGrade: 'Pb-Ag 99.5% Anode', application: 'Zinc Electrowinning (Hindustan Zinc)', leadPercent: 99.5, hardnessBH: 5, investmentCr: 340, status: 'Delivered', priority: 'High', origin: 'Odisha Lead Bhubaneswar (OD)', destination: 'Hindustan Zinc Udaipur (RJ)', shipDate: '2026-07-24', transitDays: 3, zone: 'East', remarks: 'Pb-0.5%Ag lead-silver anode for Hindustan Zinc electrowinning cell &#8594; 99.5% Pb &#8594; &#8377;340Cr for 20 tonnes &#8594; India &#8377;10,200Cr zinc Pb &#8594; HZL 1 MT Zn &#8594; 5 BH hardness &#8594; 2yr life &#8594; 99.995% Zn cathode' },
  { id: 'LDA-0011', batchNo: 'LDA-B2411', city: 'Guwahati', manufacturer: 'Assam Lead Works', alloyGrade: 'Pb-Sn 40/60 Soft', application: 'Transformer Solder (ABB India)', leadPercent: 40.0, hardnessBH: 11, investmentCr: 155, status: 'Delivered', priority: 'Medium', origin: 'Assam Lead Guwahati (AS)', destination: 'ABB Vadodara (GJ)', shipDate: '2026-07-25', transitDays: 4, zone: 'East', remarks: 'Pb-Sn 40/60 solder for ABB India power transformer winding joint &#8594; 40% Pb &#8594; &#8377;155Cr for 6 tonnes &#8594; India &#8377;4,650Cr power Pb &#8594; ABB 800 transformers/yr &#8594; 11 BH hardness &#8594; 183-232&#176;C range &#8594; 2% Ag added' },
  { id: 'LDA-0012', batchNo: 'LDA-B2412', city: 'Surat', manufacturer: 'Gujarat Lead Technologies', alloyGrade: 'Pb-Ca-Sn 99.6% Solar', application: 'Solar Battery (Luminous)', leadPercent: 99.6, hardnessBH: 13, investmentCr: 220, status: 'Delayed', priority: 'High', origin: 'Gujarat Lead Technologies Surat (GJ)', destination: 'Luminous Noida (UP)', shipDate: '2026-07-10', transitDays: 11, zone: 'West', remarks: 'Pb-Ca-Sn alloy for Luminous off-grid solar tubular battery &#8594; 99.6% Pb &#8594; &#8377;220Cr for 16 tonnes &#8594; India &#8377;6,600Cr solar Pb &#8594; monsoon delay &#8594; 13 BH hardness &#8594; 1500 cycle life &#8594; 5yr warranty' },
  { id: 'LDA-0013', batchNo: 'LDA-B2413', city: 'Noida', manufacturer: 'UP Lead Alloys', alloyGrade: 'Pb-Li 99% Alloy', application: 'Fusion Blanket (IPR)', leadPercent: 99.0, hardnessBH: 4, investmentCr: 460, status: 'Delivered', priority: 'Critical', origin: 'UP Lead Alloys Noida (UP)', destination: 'IPR Gandhinagar (GJ)', shipDate: '2026-07-26', transitDays: 2, zone: 'North', remarks: 'Pb-Li alloy for IPR Indian DEMO fusion reactor tritium breeding blanket &#8594; 99% Pb &#8594; &#8377;460Cr for 4 tonnes &#8594; India &#8377;13,800Cr fusion Pb &#8594; IPR 2028 DEMO &#8594; 4 BH hardness &#8594; 340&#176;C operating &#8594; neutron multiplier' },
  { id: 'LDA-0014', batchNo: 'LDA-B2414', city: 'Bhopal', manufacturer: 'BHEL', alloyGrade: 'Pb-Eutectic 63/37', application: 'Power Module Assembly (BHEL)', leadPercent: 63.0, hardnessBH: 14, investmentCr: 190, status: 'Delivered', priority: 'Medium', origin: 'BHEL Bhopal (MP)', destination: 'BHEL Haridwar (UK)', shipDate: '2026-07-27', transitDays: 2, zone: 'North', remarks: 'Pb-Sn 63/37 eutectic solder paste for BHEL thyristor power module die-attach &#8594; 63% Pb &#8594; &#8377;190Cr for 5 tonnes &#8594; India &#8377;5,700Cr power Pb &#8594; BHEL 150 GW fleet &#8594; 14 BH hardness &#8594; 183&#176;C exact &#8594; reflow SMT' }
]

const delayedSet = new Set(leadAlloyRecords.filter(r => r.status === 'Delayed').map(r => r.id))

export default function LeadAlloyLogisticsView() {
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
    let data = leadAlloyRecords
    if (search) data = data.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase())))
    Object.entries(filters).forEach(([k, vals]) => { if (vals.length) data = data.filter(r => vals.includes(String((r as any)[k]))) })
    return data
  }, [search, filters])

  const total = leadAlloyRecords.length
  const delivered = leadAlloyRecords.filter(r => r.status === 'Delivered').length
  const totalCr = leadAlloyRecords.reduce((s: number, r) => s + r.investmentCr, 0)
  const avgPb = +(leadAlloyRecords.reduce((s: number, r) => s + r.leadPercent, 0) / total).toFixed(1)

  const manufacturers = [...new Set(leadAlloyRecords.map(r => r.manufacturer))]
  const zones = [...new Set(leadAlloyRecords.map(r => r.zone))]

  return (
    <div className="space-y-6">
      <PageHeader title="Lead Alloy Logistics" description="Indian lead alloy supply chain tracking across automotive battery, nuclear coolant, defence ammunition, radiation shielding, telecom battery, fusion blanket and soldering sectors" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-slate-600">{total}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-slate-600">{delivered}</div><div className="text-xs text-muted-foreground">Delivered</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-slate-600">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-slate-600">{avgPb}%</div><div className="text-xs text-muted-foreground">Avg Pb Content</div></CardContent></Card>
      </div>

      <div className="flex gap-2 border-b">
        {tabs.map((t, i) => (<button key={t} className={`px-4 py-2 ${activeTab === i ? 'border-b-2 border-slate-600 text-slate-600 font-semibold' : 'text-muted-foreground'}`} onClick={() => setActiveTab(i)}>{t}</button>))}
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
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">Pb%</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.alloyGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.leadPercent}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
      </div>)}

      {activeTab === 1 && (<div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {manufacturers.map(m => <Badge key={m} variant={filters.manufacturer?.includes(m) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleFilter('manufacturer', m)}>{m}</Badge>)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">By Manufacturer</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([m, c]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Hardness Profile</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const s = r.hardnessBH <= 6 ? 'Soft (0-6 BH)' : r.hardnessBH <= 14 ? 'Medium (7-14 BH)' : r.hardnessBH <= 20 ? 'Hard (15-20 BH)' : 'Extra Hard (21+ BH)'; m[s] = (m[s] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        </div>
        <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Manufacturer</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Origin</th><th className="p-2 text-left">Destination</th><th className="p-2 text-right">Transit</th><th className="p-2 text-left">Zone</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.manufacturer}</td><td className="p-2">{r.alloyGrade}</td><td className="p-2">{r.origin}</td><td className="p-2">{r.destination}</td><td className="p-2 text-right">{r.transitDays}d</td><td className="p-2">{r.zone}</td></tr>))}</tbody></table></div></div>
      </div>)}

      {activeTab === 2 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Lead Purity Distribution</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { const n = r.leadPercent >= 99 ? 'Pure (99%+)' : r.leadPercent >= 90 ? 'High (90-99%)' : r.leadPercent >= 60 ? 'Medium (60-90%)' : 'Low (<60%)'; m[n] = (m[n] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).map(([k, c]) => (<div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Battery-Grade Alloys</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.application.toLowerCase().includes('battery')).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.alloyGrade} ({r.hardnessBH} BH)</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
      </div>)}

      {activeTab === 3 && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardContent><div className="text-sm font-medium text-slate-600 mb-2">India Lead-Acid Battery Market</div><div className="text-xs text-muted-foreground">Indian lead-acid battery market at &#8377;45,000Cr, growing 8% CAGR. Exide, Amararaja and Luminous collectively consuming 120 TPA lead alloys for automotive, inverter and solar batteries. Pb-Ca-Sn replacing Pb-Sb for low-maintenance designs. EV slowdown benefitting lead-acid segment.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-slate-600 mb-2">Pb-Bi Nuclear Coolant for PFBR</div><div className="text-xs text-muted-foreground">IGCAR Pb-Bi eutectic loop for 700 MWe Prototype Fast Breeder Reactor at Kalpakkam. India only country besides Russia operating Pb-Bi coolant at industrial scale. 8 tonnes delivered July 2026 for secondary loop, with 20 tonnes more planned for 2027.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-slate-600 mb-2">Monsoon Disrupts Solar Battery Supply</div><div className="text-xs text-muted-foreground">LDA-B2412 Pb-Ca-Sn alloy for Luminous solar off-grid battery delayed 11 days due to Gujarat monsoon flooding on NH-48. Luminous Noida factory at risk of stockout during peak Q3 solar demand. Recommend pre-positioning 20-tonne buffer at Delhi warehouse.</div></CardContent></Card>
        <Card><CardContent><div className="text-sm font-medium text-slate-600 mb-2">Fusion Blanket Pb-Li Breeding</div><div className="text-xs text-muted-foreground">IPR Gandhinagar developing Pb-Li alloy for Indian DEMO fusion reactor tritium breeding blanket. Lead as neutron multiplier, lithium as tritium breeder. First 4-tonne batch delivered July 2026. India targeting DEMO by 2035, requiring 200 TPA Pb-Li alloy.</div></CardContent></Card>
      </div>)}
    </div>
  )
}
"""

outpath = '/home/z/my-project/src/components/modules/lead-alloy-logistics-view.tsx'
with open(outpath, 'w') as f:
    f.write(content)
print(f"Written {len(content)} bytes to {outpath}")
