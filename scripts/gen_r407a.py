r"""Generate Indium Alloy Logistics View module (R407a)"""
import os

COMPONENT = r"""'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Gem } from 'lucide-react';

interface IndiumAlloyRecord {
  id: string;
  batchNo: string;
  city: string;
  manufacturer: string;
  alloyGrade: string;
  application: string;
  indiumPercent: number;
  meltingPointC: number;
  investmentCr: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const indiumAlloyRecords: IndiumAlloyRecord[] = [
  { id: 'IDA-0001', batchNo: 'IDA-B2401', city: 'Hyderabad', manufacturer: 'MIDHANI', alloyGrade: 'In-48Sn Solder', application: 'Semiconductor Die Attach (SCL)', indiumPercent: 52.0, meltingPointC: 118, investmentCr: 480, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'SCL Mohali (PB)', shipDate: '2026-07-15', transitDays: 2, zone: 'South', remarks: 'In-48Sn eutectic solder paste for SCL 28nm die attach &#8594; 52% In with 48% Sn &#8594; &#8377;480Cr for 1.5 tonnes &#8594; India &#8377;14,400Cr semi solder &#8594; SCL 5000 wafer starts &#8594; 118&#176;C melt &#8594; 3 um bump &#8594; fluxless' },
  { id: 'IDA-0002', batchNo: 'IDA-B2402', city: 'Bengaluru', manufacturer: 'DRDO NMRL', alloyGrade: 'In-97% Pure', application: 'IR Detector Array (BEL)', indiumPercent: 99.99, meltingPointC: 157, investmentCr: 620, status: 'Delivered', priority: 'Critical', origin: 'DRDO NMRL Visakhapatnam (AP)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 1, zone: 'South', remarks: 'Ultra-pure In bump for BEL 640x512 IR focal plane array &#8594; 99.99% In &#8594; &#8377;620Cr for 0.8 tonnes &#8594; India &#8377;18,600Cr defence In &#8594; BEL 200 IR detectors &#8594; 157&#176;C melt &#8594; 25 um bump &#8594; mil-spec' },
  { id: 'IDA-0003', batchNo: 'IDA-B2403', city: 'Chennai', manufacturer: 'IGCAR', alloyGrade: 'In-Ag 80/20 Solder', application: 'Nuclear Fuel Rod Seal (NPCIL)', indiumPercent: 80.0, meltingPointC: 141, investmentCr: 390, status: 'Delivered', priority: 'Critical', origin: 'IGCAR Kalpakkam (TN)', destination: 'NPCIL Mumbai (MH)', shipDate: '2026-07-17', transitDays: 1, zone: 'South', remarks: 'In-Ag alloy for NPCIL PHWR fuel rod end cap hermetic seal &#8594; 80% In with 20% Ag &#8594; &#8377;390Cr for 2 tonnes &#8594; India &#8377;11,700Cr nuclear In &#8594; NPCIL 22 reactors &#8594; 141&#176;C melt &#8594; neutron transparent &#8594; high temp' },
  { id: 'IDA-0004', batchNo: 'IDA-B2404', city: 'Mumbai', manufacturer: 'Tata Advanced Materials', alloyGrade: 'In-Sn-Bi 57/42/1', application: 'Flexible Display Bond (Reliance)', indiumPercent: 57.0, meltingPointC: 98, investmentCr: 510, status: 'Delivered', priority: 'High', origin: 'TAM Bengaluru (KA)', destination: 'Reliance Jamnagar (GJ)', shipDate: '2026-07-18', transitDays: 2, zone: 'West', remarks: 'In-Sn-Bi low-temp solder for Reliance flexible OLED display lamination &#8594; 57% In &#8594; &#8377;510Cr for 1.2 tonnes &#8594; India &#8377;15,300Cr display In &#8594; Reliance 50M panels &#8594; 98&#176;C melt &#8594; polymer safe &#8594; roll-to-roll' },
  { id: 'IDA-0005', batchNo: 'IDA-B2405', city: 'Pune', manufacturer: 'Bharat Forge', alloyGrade: 'In-Cu 30/70 Seal', application: 'EV Battery Thermal Interface (Mahindra)', indiumPercent: 30.0, meltingPointC: 165, investmentCr: 340, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'Mahindra Pune (MH)', shipDate: '2026-07-19', transitDays: 1, zone: 'West', remarks: 'In-Cu TIM foil for Mahindra XUV400 battery pack thermal management &#8594; 30% In with 70% Cu &#8594; &#8377;340Cr for 5 tonnes &#8594; India &#8377;10,200Cr EV In &#8594; Mahindra 100K EVs &#8594; 165&#176;C melt &#8594; 8 W/mK &#8594; compressible' },
  { id: 'IDA-0006', batchNo: 'IDA-B2406', city: 'Ahmedabad', manufacturer: 'Gujarat Indium Tech', alloyGrade: 'In-Ga 75/25 FPCA', application: 'Foldable Phone Hinge (Lava)', indiumPercent: 75.0, meltingPointC: 15, investmentCr: 420, status: 'Delivered', priority: 'High', origin: 'Gujarat Indium Tech Ahmedabad (GJ)', destination: 'Lava Noida (UP)', shipDate: '2026-07-20', transitDays: 1, zone: 'West', remarks: 'In-Ga liquid metal FPCA for Lava foldable smartphone hinge connector &#8594; 75% In with 25% Ga &#8594; &#8377;420Cr for 0.5 tonnes &#8594; India &#8377;12,600Cr mobile In &#8594; Lava 10M foldables &#8594; 15&#176;C liquid &#8594; &#8212;196 to 1000&#176;C &#8594; flexible' },
  { id: 'IDA-0007', batchNo: 'IDA-B2407', city: 'Jaipur', manufacturer: 'Rajasthan Indium Alloys', alloyGrade: 'In-Sn 60/40 Thermal', application: '5G Baseplate Solder (Jio)', indiumPercent: 60.0, meltingPointC: 120, investmentCr: 295, status: 'Delivered', priority: 'Medium', origin: 'Rajasthan Indium Alloys Jaipur (RJ)', destination: 'Jio Mumbai (MH)', shipDate: '2026-07-21', transitDays: 2, zone: 'North', remarks: 'In-Sn thermal interface for Jio 5G base station power amplifier &#8594; 60% In with 40% Sn &#8594; &#8377;295Cr for 3 tonnes &#8594; India &#8377;8,850Cr telecom In &#8594; Jio 500K sites &#8594; 120&#176;C melt &#8594; 86 W/mK &#8594; 5G PA' },
  { id: 'IDA-0008', batchNo: 'IDA-B2408', city: 'Coimbatore', manufacturer: 'Tamil Nadu Indium Corp', alloyGrade: 'In-Ag 90/10 TCO', application: 'Touch Panel ITO Solder (Dixon)', indiumPercent: 90.0, meltingPointC: 144, investmentCr: 185, status: 'Delivered', priority: 'Medium', origin: 'Tamil Nadu Indium Corp Hosur (TN)', destination: 'Dixon Noida (UP)', shipDate: '2026-07-22', transitDays: 2, zone: 'South', remarks: 'In-Ag solder for Dixon touchscreen ITO glass edge seal &#8594; 90% In with 10% Ag &#8594; &#8377;185Cr for 1 tonne &#8594; India &#8377;5,550Cr consumer In &#8594; Dixon 30M panels &#8594; 144&#176;C melt &#8594; moisture barrier &#8594; edge seal' },
  { id: 'IDA-0009', batchNo: 'IDA-B2409', city: 'Bhubaneswar', manufacturer: 'NALCO', alloyGrade: 'In-Pb 50/50 Radiation', application: 'X-Ray Shield Gasket (HLL)', indiumPercent: 50.0, meltingPointC: 165, investmentCr: 260, status: 'Delivered', priority: 'High', origin: 'NALCO Bhubaneswar (OD)', destination: 'HLL Hyderabad (TG)', shipDate: '2026-07-23', transitDays: 2, zone: 'East', remarks: 'In-Pb alloy gasket for HLL medical X-ray tube shield &#8594; 50% In with 50% Pb &#8594; &#8377;260Cr for 4 tonnes &#8594; India &#8377;7,800Cr medical In &#8594; HLL 5000 tubes &#8594; 165&#176;C melt &#8594; radiation opaque &#8594; soft seal' },
  { id: 'IDA-0010', batchNo: 'IDA-B2410', city: 'Guwahati', manufacturer: 'Assam Indium Metals', alloyGrade: 'In 99.999% Ultra-Pure', application: 'CIGS Solar Cell (Adani Solar)', indiumPercent: 99.999, meltingPointC: 157, investmentCr: 710, status: 'Delivered', priority: 'High', origin: 'Assam Indium Metals Guwahati (AS)', destination: 'Adani Solar Mundra (GJ)', shipDate: '2026-07-24', transitDays: 4, zone: 'East', remarks: 'Five-nines In for Adani CIGS thin-film PV cell target material &#8594; 99.999% In &#8594; &#8377;710Cr for 0.3 tonnes &#8594; India &#8377;21,300Cr solar In &#8594; Adani 10 GW CIGS &#8594; 157&#176;C melt &#8594; sputter target &#8594; 22% eff' },
  { id: 'IDA-0011', batchNo: 'IDA-B2411', city: 'Surat', manufacturer: 'Gujarat Indium Products', alloyGrade: 'In-Zn 80/20 Brazing', application: 'Satellite Thermal Pipe (ISRO)', indiumPercent: 80.0, meltingPointC:108, investmentCr: 560, status: 'Delivered', priority: 'Critical', origin: 'Gujarat Indium Products Surat (GJ)', destination: 'ISRO Ahmedabad (GJ)', shipDate: '2026-07-25', transitDays: 1, zone: 'West', remarks: 'In-Zn brazing for ISRO satellite heat pipe hermetic seal &#8594; 80% In with 20% Zn &#8594; &#8377;560Cr for 0.6 tonnes &#8594; India &#8377;16,800Cr space In &#8594; ISRO 12 sats &#8594; 108&#176;C melt &#8594; vacuum rated &#8594; cryo compatible' },
  { id: 'IDA-0012', batchNo: 'IDA-B2412', city: 'Lucknow', manufacturer: 'UP Indium Industries', alloyGrade: 'In-Sn-Ag 52/46/6 Solder', application: 'Quantum Chip Flip-Chip (TCS)', indiumPercent: 52.0, meltingPointC: 115, investmentCr: 680, status: 'Delayed', priority: 'Critical', origin: 'UP Indium Industries Lucknow (UP)', destination: 'TCS Chennai (TN)', shipDate: '2026-07-02', transitDays: 23, zone: 'North', remarks: 'In-Sn-Ag ternary for TCS quantum computing qubit chip flip-chip interconnect &#8594; 52% In &#8594; &#8377;680Cr for 0.2 tonnes &#8594; monsoon delay &#8594; India &#8377;20,400Cr quantum In &#8594; TCS 100 qubit &#8594; 115&#176;C melt &#8594; 5 um bump &#8594; indium bump' },
  { id: 'IDA-0013', batchNo: 'IDA-B2413', city: 'Noida', manufacturer: 'BHEL', alloyGrade: 'In-Bi 33/67 Low-Melt', application: 'Thermal Fuse Assembly (Exicom)', indiumPercent: 33.0, meltingPointC: 72, investmentCr: 225, status: 'Delivered', priority: 'Medium', origin: 'BHEL Bhopal (MP)', destination: 'Exicom Gurgaon (HR)', shipDate: '2026-07-26', transitDays: 1, zone: 'North', remarks: 'In-Bi low-melt alloy for Exicom EV battery thermal fuse disconnect &#8594; 33% In with 67% Bi &#8594; &#8377;225Cr for 2 tonnes &#8594; India &#8377;6,750Cr safety In &#8594; Exicom 500K BMS &#8594; 72&#176;C melt &#8594; one-shot fuse &#8594; IP67' },
  { id: 'IDA-0014', batchNo: 'IDA-B2414', city: 'Bhopal', manufacturer: 'DRDO DMRL', alloyGrade: 'In-Ni 60/40 Seal', application: 'Aero-Engine Thrust Bearing (HAL)', indiumPercent: 60.0, meltingPointC: 153, investmentCr: 445, status: 'Delivered', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TG)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-27', transitDays: 1, zone: 'South', remarks: 'In-Ni anti-seal for HAL HTFE-2200 engine main shaft bearing &#8594; 60% In with 40% Ni &#8594; &#8377;445Cr for 0.8 tonnes &#8594; India &#8377;13,350Cr aero In &#8594; HAL 99 engines &#8594; 153&#176;C melt &#8594; anti-seize &#8594; 850&#176;C service' }
];

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const;
type Tab = typeof tabs[number];
const priorityColors: Record<string, string> = { Critical: 'bg-red-100 text-red-800', High: 'bg-amber-100 text-amber-800', Medium: 'bg-green-100 text-green-800', Low: 'bg-slate-100 text-slate-600' };
const delayedSet = new Set(indiumAlloyRecords.filter(r => r.status === 'Delayed').map(r => r.id));

export default function IndiumAlloyLogisticsView() {
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const toggleFilter = (k: string, v: string) => { setFilters(p => { const s = { ...p }; const a = s[k] || []; const i = a.indexOf(v); if (i > -1) { a.splice(i, 1); if (!a.length) delete s[k]; } else s[k] = [...a, v]; return s; }); };
  const filtered = useMemo(() => {
    let d = indiumAlloyRecords;
    if (search) { const q = search.toLowerCase(); d = d.filter(r => r.id.toLowerCase().includes(q) || r.batchNo.toLowerCase().includes(q) || r.alloyGrade.toLowerCase().includes(q) || r.application.toLowerCase().includes(q) || r.city.toLowerCase().includes(q) || r.manufacturer.toLowerCase().includes(q)); }
    Object.entries(filters).forEach(([k, vs]) => { if (vs.length) d = d.filter(r => { const v = String((r as unknown as Record<string, unknown>)[k] ?? ''); return vs.some(x => v.toLowerCase().includes(x.toLowerCase())); }); });
    return d;
  }, [search, filters]);
  const totalCr = filtered.reduce((s: number, r) => s + r.investmentCr, 0);
  const avgIn = filtered.length ? filtered.reduce((s: number, r) => s + r.indiumPercent, 0) / filtered.length : 0;
  const delayedCount = filtered.filter(r => r.status === 'Delayed').length;

  return (
    <div className="space-y-6">
      <PageHeader title="Indium Alloy Logistics" description="Indian indium alloy supply chain tracking for semiconductor packaging, defence IR, solar CIGS and quantum computing sectors" />
      <div className="flex gap-2 border-b">
        {tabs.map(t => (<button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 text-sm font-medium ${activeTab === t ? 'border-b-2 border-teal-500 text-teal-700' : 'text-muted-foreground hover:text-foreground'}`}>{t}</button>))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-teal-600">{filtered.length}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-teal-600">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-teal-600">{avgIn.toFixed(1)}%</div><div className="text-xs text-muted-foreground">Avg In Content</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-red-500">{delayedCount}</div><div className="text-xs text-muted-foreground">Delayed Shipments</div></CardContent></Card>
      </div>
      {(activeTab === 'Dashboard' || activeTab === 'Registry') && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <input placeholder="Search ID, grade, application, city..." value={search} onChange={e => setSearch(e.target.value)} className="border rounded-md px-3 py-1.5 text-sm flex-1 min-w-48" />
            {['status', 'priority', 'zone'].map(f => { const opts = [...new Set(indiumAlloyRecords.map(r => (r as unknown as Record<string, unknown>)[f] as string))]; return (<div key={f} className="flex flex-wrap gap-1">{opts.map(o => (<Badge key={o} variant={(filters[f] || []).includes(o) ? 'default' : 'outline'} className="cursor-pointer text-xs" onClick={() => toggleFilter(f, o)}>{o}</Badge>))}</div>); })}
          </div>
          <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">In%</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.alloyGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.indiumPercent}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Analytics') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipments by Zone</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([z, c]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Semiconductor and Quantum</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.application.toLowerCase().includes('semi') || r.application.toLowerCase().includes('quantum') || r.application.toLowerCase().includes('display') || r.application.toLowerCase().includes('touch') || r.application.toLowerCase().includes('solar')).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.alloyGrade} ({r.meltingPointC}&#176;C)</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">By Priority</CardTitle></CardHeader><CardContent><div className="space-y-2">{Object.entries(filtered.reduce((m, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {} as Record<string, number>)).map(([p, c]) => (<div key={p} className="flex justify-between text-sm"><span className={priorityColors[p] || ''}>{p}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">In Content Distribution</CardTitle></CardHeader><CardContent><div className="space-y-2">{[{ l: 'Ultra-High (99%+)', f: filtered.filter(r => r.indiumPercent >= 99).length }, { l: 'High (80-99%)', f: filtered.filter(r => r.indiumPercent >= 80 && r.indiumPercent < 99).length }, { l: 'Medium (50-80%)', f: filtered.filter(r => r.indiumPercent >= 50 && r.indiumPercent < 80).length }, { l: 'Standard (<50%)', f: filtered.filter(r => r.indiumPercent < 50).length }].map(b => (<div key={b.l} className="flex justify-between text-sm"><span>{b.l}</span><span className="font-medium">{b.f}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Manufacturers</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([m, v]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Avg Transit Days</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.length ? (Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || [] as number[]).concat(r.transitDays); return m }, {} as Record<string, number[]>)) as [string, number[]][]).map(([z, d]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{(d.reduce((s, n) => s + n, 0) / d.length).toFixed(1)}d</span></div>)) : []}</div></CardContent></Card>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Insights') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardContent><div className="text-sm font-medium text-teal-600 mb-2">TCS Quantum Chip Indium Bump</div><div className="text-xs text-muted-foreground">TCS building 100-qubit superconducting quantum processor at Chennai requiring ultra-pure In bump interconnect at 5 um pitch. UP Indium Industries scaling five-nines In production. India investing &#8377;8,000Cr in National Quantum Mission. In bump preferred over Au for lower superconducting transition temperature.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-teal-600 mb-2">CIGS Thin-Film Solar Indium Demand</div><div className="text-xs text-muted-foreground">Adani Solar expanding CIGS thin-film line to 10 GW by 2028 with In-Ga-Se sputtering targets consuming 50 tonnes of 99.999% In annually. India targeting 500 GW solar by 2030. Assam Indium Metals developing primary In recovery from zinc smelter residue to reduce 95% import dependency on China and South Korea.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-teal-600 mb-2">BEL IR Detector Array Scaling</div><div className="text-xs text-muted-foreground">BEL ramping 640x512 and 1280x1024 IRFPA production for fighter aircraft, missile seekers and thermal imaging. Ultra-pure 99.99% In required for indium bump flip-chip interconnect with 25 um pitch. DRDO NMRL developing domestic In purification from sphalerite concentrate under &#8377;2,500Cr programme.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-teal-600 mb-2">Low-Melt In-Ga FPCA for Foldables</div><div className="text-xs text-muted-foreground">In-Ga liquid metal alloy enabling foldable phone hinge FPCA connections that remain conductive through 200K+ fold cycles. Gujarat Indium Tech supplying Lava, Micromax and OnePlus with In-75Ga FPCA ribbons. India foldable market projected 30M units by 2028 with each unit using 0.5g In-Ga alloy.</div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
"""

outpath = "/home/z/my-project/src/components/modules/indium-alloy-logistics-view.tsx"
with open(outpath, "w") as f:
    f.write(COMPONENT)
print(f"Written {outpath} ({len(COMPONENT)} bytes)")
