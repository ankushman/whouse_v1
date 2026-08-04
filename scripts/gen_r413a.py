#!/usr/bin/env python3
"""Generate R413a: Niobium Powder Logistics View (nbp-*)"""
import os

content = r'''"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Hexagon } from 'lucide-react';

interface NiobiumPowderRecord {
  id: string;
  batchNo: string;
  city: string;
  manufacturer: string;
  powderGrade: string;
  application: string;
  purityPercent: number;
  particleSizeUm: number;
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

const niobiumPowderRecords: NiobiumPowderRecord[] = [
  { id: 'NBP-0001', batchNo: 'NBP-B2401', city: 'Mumbai', manufacturer: 'MIDHANI', powderGrade: 'Nb 99.9% Spherical Powder', application: 'Additive Manufacturing (ISRO)', purityPercent: 99.9, particleSizeUm: 45, investmentCr: 720, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'ISRO Bengaluru (KA)', shipDate: '2026-07-15', transitDays: 1, zone: 'South', remarks: 'Nb spherical powder for ISRO satellite LPS AM engine injector &#8594; 99.9% Nb &#8594; &#8377;720Cr for 2 tonnes &#8594; India &#8377;21,600Cr aerospace Nb &#8594; ISRO 12 sats &#8594; 45 um D50 &#8594; &#8594; EBM &#8594; &#8594; 2480&#176;C mp &#8594; &#8594; AM' },
  { id: 'NBP-0002', batchNo: 'NBP-B2402', city: 'Hyderabad', manufacturer: 'DRDO DMRL', powderGrade: 'Nb-1Zr 99.8% Atomized', application: 'Rocket Nozzle Liner (DRDO)', purityPercent: 99.8, particleSizeUm: 63, investmentCr: 680, status: 'Delivered', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TG)', destination: 'DRDO Chandipur (OD)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'Nb-1Zr atomized powder for DRDO Agni nose cone rocket nozzle throat liner &#8594; 99.8% Nb-1Zr &#8594; &#8377;680Cr for 1.5 tonnes &#8594; India &#8377;20,400Cr defence Nb &#8594; DRDO 200 nozzles &#8594; 63 um &#8594; &#8594; HIP &#8594; &#8594; 2650&#176;C &#8594; &#8594; nozzle' },
  { id: 'NBP-0003', batchNo: 'NBP-B2403', city: 'Bengaluru', manufacturer: 'Bharat Forge', powderGrade: 'NbC 99.5% Nano Carbide', application: 'Cutting Tool Insert (SANDVIK)', purityPercent: 99.5, particleSizeUm: 0.5, investmentCr: 440, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'Sandvik Bengaluru (KA)', shipDate: '2026-07-17', transitDays: 1, zone: 'West', remarks: 'NbC nano carbide for Sandvik India coated WC-NbC cutting tool inserts &#8594; 99.5% NbC &#8594; &#8377;440Cr for 0.5 tonnes &#8594; India &#8377;13,200Cr tool Nb &#8594; Sandvik 50M inserts &#8594; 0.5 um &#8594; &#8594; CVD &#8594; &#8594; 3610&#176;C mp &#8594; &#8594; machining' },
  { id: 'NBP-0004', batchNo: 'NBP-B2404', city: 'Pune', manufacturer: 'IGCAR', powderGrade: 'Nb3Sn 99.7% Superconductor', application: 'Fusion Magnet Coil (IGCAR)', purityPercent: 99.7, particleSizeUm: 150, investmentCr: 890, status: 'Delivered', priority: 'Critical', origin: 'IGCAR Kalpakkam (TN)', destination: 'ITER Cadarache via IGCAR', shipDate: '2026-07-18', transitDays: 3, zone: 'South', remarks: 'Nb3Sn superconducting powder for IGCAR SST-1 tokamak TF magnet winding &#8594; 99.7% Nb3Sn &#8594; &#8377;890Cr for 0.8 tonnes &#8594; India &#8377;26,700Cr fusion Nb &#8594; IGCAR SST-1 &#8594; 150 um wire &#8594; &#8594; 18K Tc &#8594; &#8594; 15T &#8594; &#8594; magnet' },
  { id: 'NBP-0005', batchNo: 'NBP-B2405', city: 'Chennai', manufacturer: 'Tata Advanced Materials', powderGrade: 'Nb 99.95% Hydride-Dehydride', application: 'Sputtering Target (Tata Steel)', purityPercent: 99.95, particleSizeUm: 75, investmentCr: 530, status: 'Delivered', priority: 'High', origin: 'Tata Advanced Materials Bengaluru (KA)', destination: 'Tata Steel Jamshedpur (JH)', shipDate: '2026-07-19', transitDays: 2, zone: 'South', remarks: 'Nb HDH powder for Tata Steel PVD architectural glass sputtering target &#8594; 99.95% Nb &#8594; &#8377;530Cr for 3 tonnes &#8594; India &#8377;15,900Cr coating Nb &#8594; Tata Steel 20M m2 &#8594; 75 um &#8594; &#8594; magnetron &#8594; &#8594; AR coating &#8594; &#8594; PVD' },
  { id: 'NBP-0006', batchNo: 'NBP-B2406', city: 'Ahmedabad', manufacturer: 'Gujarat Niobium Tech', powderGrade: 'Nb2O5 99.99% Optical', application: 'Lens Coating (Carl Zeiss)', purityPercent: 99.99, particleSizeUm: 0.1, investmentCr: 380, status: 'Delivered', priority: 'High', origin: 'Gujarat Niobium Tech Ahmedabad (GJ)', destination: 'Carl Zeiss Bengaluru (KA)', shipDate: '2026-07-20', transitDays: 2, zone: 'West', remarks: 'Nb2O5 nano powder for Carl Zeiss India anti-reflection lens coating evaporation &#8594; 99.99% Nb2O5 &#8594; &#8377;380Cr for 0.3 tonnes &#8594; India &#8377;11,400Cr optical Nb &#8594; Zeiss 5M lenses &#8594; 0.1 um &#8594; &#8594; e-beam &#8594; &#8594; n=2.4 &#8594; &#8594; coating' },
  { id: 'NBP-0007', batchNo: 'NBP-B2407', city: 'Jaipur', manufacturer: 'Rajasthan Niobium Corp', powderGrade: 'Nb-Ti 47/53 Wire Powder', application: 'MRI Magnet (HLL)', purityPercent: 99.8, particleSizeUm: 200, investmentCr: 760, status: 'Delivered', priority: 'Critical', origin: 'Rajasthan Niobium Corp Jaipur (RJ)', destination: 'HLL Hyderabad (TG)', shipDate: '2026-07-21', transitDays: 2, zone: 'North', remarks: 'Nb-Ti alloy powder for HLL 1.5T MRI superconducting magnet coil winding &#8594; 99.8% Nb-Ti &#8594; &#8377;760Cr for 1.2 tonnes &#8594; India &#8377;22,800Cr medical Nb &#8594; HLL 300 MRI &#8594; 200 um filament &#8594; &#8594; 10K Tc &#8594; &#8594; 3T &#8594; &#8594; MRI' },
  { id: 'NBP-0008', batchNo: 'NBP-B2408', city: 'Bhubaneswar', manufacturer: 'NALCO', powderGrade: 'Nb 99.85% Ferro Niobium', application: 'HSLA Steel (SAIL)', purityPercent: 99.85, particleSizeUm: 500, investmentCr: 420, status: 'Delivered', priority: 'Medium', origin: 'NALCO Bhubaneswar (OD)', destination: 'SAIL Rourkela (OD)', shipDate: '2026-07-22', transitDays: 1, zone: 'East', remarks: 'Ferro-niobium powder additive for SAIL Rourkela HSLA micro-alloyed pipeline steel &#8594; 65% Nb &#8594; &#8377;420Cr for 5 tonnes &#8594; India &#8377;12,600Cr steel Nb &#858594; SAIL 2M tonne &#8594; 500 um &#8594; &#8594; ladle &#8594; &#8594; X80 &#8594; &#8594; pipeline' },
  { id: 'NBP-0009', batchNo: 'NBP-B2409', city: 'Coimbatore', manufacturer: 'Tamil Nadu Niobium Corp', powderGrade: 'Nb 99.9% Plasma Spherical', application: '3D-Print Heat Exchanger (L&amp;T)', purityPercent: 99.9, particleSizeUm: 30, investmentCr: 560, status: 'Delivered', priority: 'High', origin: 'Tamil Nadu Niobium Corp Coimbatore (TN)', destination: 'L&amp;T Mumbai (MH)', shipDate: '2026-07-23', transitDays: 2, zone: 'South', remarks: 'Nb plasma-spherical powder for L&amp;T SLM 3D-printed chemical process heat exchanger &#8594; 99.9% Nb &#8594; &#8377;560Cr for 1 tonne &#8594; India &#8377;16,800Cr industrial Nb &#8594; L&amp;T 50 units &#8594; 30 um &#8594; &#8594; SLM &#8594; &#8594; corrosion &#8594; &#8594; AM' },
  { id: 'NBP-0010', batchNo: 'NBP-B2410', city: 'Surat', manufacturer: 'Gujarat Nb Products', powderGrade: 'K2NbF7 99.9% Precursor', application: 'Capacitor Grade Nb (BEL)', purityPercent: 99.9, particleSizeUm: 1, investmentCr: 340, status: 'Delivered', priority: 'Medium', origin: 'Gujarat Nb Products Surat (GJ)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-24', transitDays: 2, zone: 'West', remarks: 'K2NbF7 fluoroniobate precursor for BEL tantalum-niobium capacitor anode powder &#8594; 99.9% K2NbF7 &#8594; &#8377;340Cr for 0.5 tonnes &#8594; India &#8377;10,200Cr electronic Nb &#8594; BEL 10M capacitors &#8594; 1 um &#8594; &#8594; Na reduction &#8594; &#8594; 200K CV/g &#8594; &#8594; MLCC' },
  { id: 'NBP-0011', batchNo: 'NBP-B2411', city: 'Guwahati', manufacturer: 'Assam Niobium Metals', powderGrade: 'Nb-10W-1Zr 99.7% Alloy', application: 'Space Thruster (ISRO)', purityPercent: 99.7, particleSizeUm: 45, investmentCr: 650, status: 'Delivered', priority: 'High', origin: 'Assam Niobium Metals Guwahati (AS)', destination: 'ISRO Thiruvananthapuram (KL)', shipDate: '2026-07-25', transitDays: 4, zone: 'East', remarks: 'Nb-10W-1Zr refractory alloy powder for ISRO satellite electric propulsion thruster grid &#8594; 99.7% Nb-W-Zr &#8594; &#8377;650Cr for 0.3 tonnes &#8594; India &#8377;19,500Cr space Nb &#8594; ISRO 24 thrusters &#8594; 45 um &#8594; &#8594; LEBM &#8594; &#8594; 2800&#176;C &#8594; &#8594; EP' },
  { id: 'NBP-0012', batchNo: 'NBP-B2412', city: 'Lucknow', manufacturer: 'UP Niobium Industries', powderGrade: 'Nb 99.95% Rod Stock', application: 'Welding Electrode (BHEL)', purityPercent: 99.95, particleSizeUm: 1000, investmentCr: 480, status: 'Delayed', priority: 'High', origin: 'UP Niobium Industries Lucknow (UP)', destination: 'BHEL Haridwar (UK)', shipDate: '2026-07-01', transitDays: 27, zone: 'North', remarks: 'Nb rod stock for BHEL nuclear boiler Nb-stabilized stainless steel welding electrode &#8594; 99.95% Nb &#8594; &#8377;480Cr for 4 tonnes &#8594; monsoon delay &#8594; India &#8377;14,400Cr nuclear Nb &#8594; BHEL 100 welds &#8594; 1000 um rod &#8594; &#8594; GTAW &#8594; &#8594; 347 SS &#8594; &#8594; welding' },
  { id: 'NBP-0013', batchNo: 'NBP-B2413', city: 'Noida', manufacturer: 'SAIL', powderGrade: 'Nb5Si3 99.5% Silicide', application: 'Gas Turbine Blade (HAL)', purityPercent: 99.5, particleSizeUm: 10, investmentCr: 570, status: 'Delivered', priority: 'High', origin: 'SAIL Rourkela (OD)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-26', transitDays: 2, zone: 'East', remarks: 'Nb5Si3 silicide powder for HAL Tejas LCA next-gen turbine blade CMC &#8594; 99.5% Nb5Si3 &#8594; &#8377;570Cr for 0.4 tonnes &#8594; India &#8377;17,100Cr aero Nb &#8594; HAL 500 blades &#8594; 10 um &#8594; &#8594; SPS &#8594; &#8594; 1600&#176;C &#8594; &#8594; CMC' },
  { id: 'NBP-0014', batchNo: 'NBP-B2414', city: 'Bhopal', manufacturer: 'BHEL', powderGrade: 'Nb 99.9% Plate Powder', application: 'Corrosion Liner (Reliance)', purityPercent: 99.9, particleSizeUm: 150, investmentCr: 390, status: 'Delivered', priority: 'Medium', origin: 'BHEL Bhopal (MP)', destination: 'Reliance Jamnagar (GJ)', shipDate: '2026-07-27', transitDays: 2, zone: 'North', remarks: 'Nb plate powder for Reliance refinery HF alkylation unit corrosion-resistant liner &#8594; 99.9% Nb &#8594; &#8377;390Cr for 2 tonnes &#8594; India &#8377;11,700Cr petro Nb &#8594; Reliance 5 units &#8594; 150 um &#8594; &#8594; explosive bond &#8594; &#8594; HF &#8594; &#8594; liner' }
];

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const;
type Tab = typeof tabs[number];
const priorityColors: Record<string, string> = { Critical: 'bg-red-100 text-red-800', High: 'bg-amber-100 text-amber-800', Medium: 'bg-green-100 text-green-800', Low: 'bg-slate-100 text-slate-600' };
const delayedSet = new Set(niobiumPowderRecords.filter(r => r.status === 'Delayed').map(r => r.id));

export default function NiobiumPowderLogisticsView() {
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const toggleFilter = (k: string, v: string) => { setFilters(p => { const s = { ...p }; const a = s[k] || []; const i = a.indexOf(v); if (i > -1) { a.splice(i, 1); if (!a.length) delete s[k]; } else s[k] = [...a, v]; return s; }); };
  const filtered = useMemo(() => {
    let d = niobiumPowderRecords;
    if (search) { const q = search.toLowerCase(); d = d.filter(r => r.id.toLowerCase().includes(q) || r.batchNo.toLowerCase().includes(q) || r.powderGrade.toLowerCase().includes(q) || r.application.toLowerCase().includes(q) || r.city.toLowerCase().includes(q) || r.manufacturer.toLowerCase().includes(q)); }
    Object.entries(filters).forEach(([k, vs]) => { if (vs.length) d = d.filter(r => { const v = String((r as unknown as Record<string, unknown>)[k] ?? ''); return vs.some(x => v.toLowerCase().includes(x.toLowerCase())); }); });
    return d;
  }, [search, filters]);
  const totalCr = filtered.reduce((s: number, r) => s + r.investmentCr, 0);
  const avgPurity = filtered.length ? filtered.reduce((s: number, r) => s + r.purityPercent, 0) / filtered.length : 0;
  const delayedCount = filtered.filter(r => r.status === 'Delayed').length;

  return (
    <div className="space-y-6">
      <PageHeader title="Niobium Powder Logistics" description="Indian niobium powder supply chain tracking for aerospace additive manufacturing, superconducting magnets, cutting tools, optical coatings, nuclear steel, and defence applications" />
      <div className="flex gap-2 border-b">
        {tabs.map(t => (<button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 text-sm font-medium ${activeTab === t ? 'border-b-2 border-slate-500 text-slate-700' : 'text-muted-foreground hover:text-foreground'}`}>{t}</button>))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-slate-600">{filtered.length}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-slate-600">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-slate-600">{avgPurity.toFixed(2)}%</div><div className="text-xs text-muted-foreground">Avg Purity</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-red-500">{delayedCount}</div><div className="text-xs text-muted-foreground">Delayed Shipments</div></CardContent></Card>
      </div>
      {(activeTab === 'Dashboard' || activeTab === 'Registry') && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <input placeholder="Search ID, grade, application, city..." value={search} onChange={e => setSearch(e.target.value)} className="border rounded-md px-3 py-1.5 text-sm flex-1 min-w-48" />
            {['status', 'priority', 'zone'].map(f => { const opts = [...new Set(niobiumPowderRecords.map(r => (r as unknown as Record<string, unknown>)[f] as string))]; return (<div key={f} className="flex flex-wrap gap-1">{opts.map(o => (<Badge key={o} variant={(filters[f] || []).includes(o) ? 'default' : 'outline'} className="cursor-pointer text-xs" onClick={() => toggleFilter(f, o)}>{o}</Badge>))}</div>); })}
          </div>
          <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">Purity%</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.powderGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.purityPercent}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Analytics') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipments by Zone</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([z, c]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Superconducting &amp; Aerospace</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.application.toLowerCase().includes('super') || r.application.toLowerCase().includes('magnet') || r.application.toLowerCase().includes('isro') || r.application.toLowerCase().includes('space') || r.application.toLowerCase().includes('aero') || r.application.toLowerCase().includes('fusion')).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.powderGrade}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">By Priority</CardTitle></CardHeader><CardContent><div className="space-y-2">{Object.entries(filtered.reduce((m, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {} as Record<string, number>)).map(([p, c]) => (<div key={p} className="flex justify-between text-sm"><span className={priorityColors[p] || ''}>{p}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Powder Type Distribution</CardTitle></CardHeader><CardContent><div className="space-y-2">{[{ l: 'Pure Nb', f: filtered.filter(r => r.powderGrade.startsWith('Nb 99')).length }, { l: 'Nb Alloy', f: filtered.filter(r => r.powderGrade.includes('Zr') || r.powderGrade.includes('W-1Zr') || r.powderGrade.includes('Ti')).length }, { l: 'Nb Compound', f: filtered.filter(r => r.powderGrade.includes('C') || r.powderGrade.includes('O5') || r.powderGrade.includes('Si3') || r.powderGrade.includes('F7')).length }, { l: 'Ferro-Niobium', f: filtered.filter(r => r.powderGrade.includes('Ferro')).length }].map(b => (<div key={b.l} className="flex justify-between text-sm"><span>{b.l}</span><span className="font-medium">{b.f}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Manufacturers</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([m, v]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Avg Transit Days</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.length ? (Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || [] as number[]).concat(r.transitDays); return m }, {} as Record<string, number[]>)) as [string, number[]][]).map(([z, d]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{(d.reduce((s, n) => s + n, 0) / d.length).toFixed(1)}d</span></div>)) : []}</div></CardContent></Card>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Insights') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardContent><div className="text-sm font-medium text-slate-600 mb-2">ISRO Niobium AM Engine Injectors</div><div className="text-xs text-muted-foreground">ISRO LPSC adopting niobium spherical powder laser powder bed fusion for satellite thruster injector manufacture, replacing conventional CNC-machined Inconel. Nb provides superior high-temperature creep resistance at 1200&#176;C enabling 30% weight reduction. India targeting 50% AM content in PSLV upper stage by 2028 under &#8377;3,200Cr ISRO Digital Manufacturing Initiative.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-slate-600 mb-2">IGCAR Nb3Sn Fusion Magnet Programme</div><div className="text-xs text-muted-foreground">IGCAR developing Nb3Sn superconducting wire from powder-in-tube process for SST-1 tokamak upgrade and future Indian DEMO fusion reactor. Nb3Sn achieves 18K critical temperature generating 15T fields vs 10T for Nb-Ti, enabling compact reactor designs. Programme budget &#8377;4,500Cr under DST National Fusion Mission.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-slate-600 mb-2">HLL MRI Nb-Ti Magnet Domestic Production</div><div className="text-xs text-muted-foreground">HLL establishing domestic Nb-Ti superconducting wire production for 1.5T and 3T MRI magnets under &#8377;2,800Cr National Medical Imaging Programme. Currently 90% imported from Bruker/Eurocoils. Rajasthan Niobium Corp supplying Nb-Ti 47/53 alloy powder enabling wire drawing to 0.5mm filament diameter.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-slate-600 mb-2">DRDO Hypersonic Nozzle Nb-1Zr</div><div className="text-xs text-muted-foreground">DRDO DMRL qualifying Nb-1Zr powder HIP-formed rocket nozzle throat liners for Agni-V and future hypersonic missile programmes. Nb-1Zr maintains structural integrity at 2000&#176;C+ with 40% weight saving over C103 niobium alloy. Programme under &#8377;1,800Cr DRDO Advanced Materials Mission targeting Mach 8+ flight.</div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
'''

outpath = '/home/z/my-project/src/components/modules/niobium-powder-logistics-view.tsx'
with open(outpath, 'w', encoding='utf-8') as f:
    f.write(content)
print(f"Generated: {outpath}")
print(f"Size: {len(content)} bytes")
