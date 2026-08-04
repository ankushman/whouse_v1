#!/usr/bin/env python3
"""Generate R414a: Tantalum Powder Logistics View (tap-*)"""
import os

content = r'''"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Diamond } from 'lucide-react';

interface TantalumPowderRecord {
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

const tantalumPowderRecords: TantalumPowderRecord[] = [
  { id: 'TAP-0001', batchNo: 'TAP-B2401', city: 'Mumbai', manufacturer: 'MIDHANI', powderGrade: 'Ta 99.95% Spherical', application: 'Capacitor Anode (BEL)', purityPercent: 99.95, particleSizeUm: 150, investmentCr: 740, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-15', transitDays: 1, zone: 'South', remarks: 'Ta spherical powder for BEL tantalum electrolytic capacitor anode sintering &#8594; 99.95% Ta &#8594; &#8377;740Cr for 2 tonnes &#8594; India &#8377;22,200Cr electronic Ta &#8594; BEL 50M capacitors &#8594; 150 um &#8594; &#8594; 200K CV/g &#8594; &#8594; 30V &#8594; &#8594; MLCC' },
  { id: 'TAP-0002', batchNo: 'TAP-B2402', city: 'Hyderabad', manufacturer: 'DRDO DMRL', powderGrade: 'Ta-10W 99.8% Alloy', application: 'Missile Fin (DRDO)', purityPercent: 99.8, particleSizeUm: 45, investmentCr: 820, status: 'Delivered', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TG)', destination: 'DRDO Pune (MH)', shipDate: '2026-07-16', transitDays: 1, zone: 'South', remarks: 'Ta-10W heavy alloy powder for DRDO BrahMos hypersonic missile stabilizer fin &#8594; 99.8% Ta-10W &#8594; &#8377;820Cr for 0.8 tonnes &#8594; India &#8377;24,600Cr defence Ta &#8594; DRDO 300 fins &#8594; 45 um &#8594; &#8594; LEBM &#8594; &#8594; 16.6 g/cm3 &#8594; &#8594; Mach 7' },
  { id: 'TAP-0003', batchNo: 'TAP-B2403', city: 'Bengaluru', manufacturer: 'Bharat Forge', powderGrade: 'TaC 99.5% Nano Carbide', application: 'Cutting Tool (Sandvik)', purityPercent: 99.5, particleSizeUm: 0.3, investmentCr: 480, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'Sandvik Pune (MH)', shipDate: '2026-07-17', transitDays: 0, zone: 'West', remarks: 'TaC nano carbide for Sandvik India WC-TaC-Co cermet cutting tool inserts &#8594; 99.5% TaC &#8594; &#8377;480Cr for 0.3 tonnes &#8594; India &#8377;14,400Cr tool Ta &#8594; Sandvik 30M inserts &#8594; 0.3 um &#8594; &#8594; WC-8TaC &#8594; &#8594; 3880&#176;C &#8594; &#8594; cermet' },
  { id: 'TAP-0004', batchNo: 'TAP-B2404', city: 'Pune', manufacturer: 'IGCAR', powderGrade: 'Ta-2.5W 99.9% Nuclear', application: 'Corrosion Liner (NPCIL)', purityPercent: 99.9, particleSizeUm: 75, investmentCr: 690, status: 'Delivered', priority: 'Critical', origin: 'IGCAR Kalpakkam (TN)', destination: 'NPCIL Tarapur (MH)', shipDate: '2026-07-18', transitDays: 2, zone: 'South', remarks: 'Ta-2.5W alloy powder for NPCIL Tarapur BWR spent fuel pool corrosion liner &#8594; 99.9% Ta-2.5W &#8594; &#8377;690Cr for 1.5 tonnes &#8594; India &#8377;20,700Cr nuclear Ta &#8594; NPCIL 2 pools &#8594; 75 um &#8594; &#8594; EB weld &#8594; &#8594; 300&#176;C &#8594; &#8594; liner' },
  { id: 'TAP-0005', batchNo: 'TAP-B2405', city: 'Chennai', manufacturer: 'Tata Advanced Materials', powderGrade: 'Ta 99.9% HDH Powder', application: 'Sputtering Target (Tata Steel)', purityPercent: 99.9, particleSizeUm: 100, investmentCr: 560, status: 'Delivered', priority: 'High', origin: 'Tata Advanced Materials Bengaluru (KA)', destination: 'Tata Steel Jamshedpur (JH)', shipDate: '2026-07-19', transitDays: 2, zone: 'South', remarks: 'Ta HDH powder for Tata Steel architectural glass PVD sputtering target &#8594; 99.9% Ta &#8594; &#8377;560Cr for 2.5 tonnes &#8594; India &#8377;16,800Cr coating Ta &#8594; Tata Steel 15M m2 &#8594; 100 um &#8594; &#8594; magnetron &#8594; &#8594; low-e &#8594; &#8594; PVD' },
  { id: 'TAP-0006', batchNo: 'TAP-B2406', city: 'Ahmedabad', manufacturer: 'Gujarat Tantalum Tech', powderGrade: 'Ta2O5 99.99% Optical', application: 'Lens Coating (Zeiss)', purityPercent: 99.99, particleSizeUm: 0.05, investmentCr: 400, status: 'Delivered', priority: 'High', origin: 'Gujarat Tantalum Tech Ahmedabad (GJ)', destination: 'Carl Zeiss Bengaluru (KA)', shipDate: '2026-07-20', transitDays: 2, zone: 'West', remarks: 'Ta2O5 nano powder for Zeiss India high-refractive-index lens e-beam coating &#8594; 99.99% Ta2O5 &#8594; &#8377;400Cr for 0.2 tonnes &#8594; India &#8377;12,000Cr optical Ta &#8594; Zeiss 5M lenses &#8594; 0.05 um &#8594; &#8594; n=2.1 &#8594; &#8594; AR &#8594; &#8594; coating' },
  { id: 'TAP-0007', batchNo: 'TAP-B2407', city: 'Jaipur', manufacturer: 'Rajasthan Tantalum Corp', powderGrade: 'Ta-10Nb-10W 99.5% Aero', application: 'Turbine Blade (HAL)', purityPercent: 99.5, particleSizeUm: 30, investmentCr: 750, status: 'Delivered', priority: 'Critical', origin: 'Rajasthan Tantalum Corp Jaipur (RJ)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-21', transitDays: 2, zone: 'North', remarks: 'Ta-10Nb-10W refractory powder for HAL Tejas LCA turbine blade CMC tip &#8594; 99.5% Ta-Nb-W &#8594; &#8377;750Cr for 0.4 tonnes &#8594; India &#8377;22,500Cr aero Ta &#8594; HAL 400 blades &#8594; 30 um &#8594; &#8594; SPS &#8594; &#8594; 1800&#176;C &#8594; &#8594; CMC' },
  { id: 'TAP-0008', batchNo: 'TAP-B2408', city: 'Bhubaneswar', manufacturer: 'NALCO', powderGrade: 'K2TaF7 99.9% Precursor', application: 'Capacitor Grade (BEL)', purityPercent: 99.9, particleSizeUm: 5, investmentCr: 370, status: 'Delivered', priority: 'High', origin: 'NALCO Bhubaneswar (OD)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-22', transitDays: 3, zone: 'East', remarks: 'K2TaF7 fluorotantalate precursor for BEL tantalum capacitor sodium reduction process &#8594; 99.9% K2TaF7 &#8594; &#8377;370Cr for 1 tonne &#8594; India &#8377;11,100Cr electronic Ta &#8594; BEL 20M units &#8594; 5 um &#8594; &#8594; Na reduction &#8594; &#8594; 50K CV/g &#8594; &#8594; MLCC' },
  { id: 'TAP-0009', batchNo: 'TAP-B2409', city: 'Coimbatore', manufacturer: 'Tamil Nadu Tantalum Corp', powderGrade: 'Ta 99.95% Plasma Atomized', application: 'Orthopedic Implant (Stryker)', purityPercent: 99.95, particleSizeUm: 25, investmentCr: 520, status: 'Delivered', priority: 'High', origin: 'Tamil Nadu Tantalum Corp Coimbatore (TN)', destination: 'Stryker Gurgaon (HR)', shipDate: '2026-07-23', transitDays: 2, zone: 'South', remarks: 'Ta plasma atomized powder for Stryker India porous tantalum orthopedic hip implant &#8594; 99.95% Ta &#8594; &#8377;520Cr for 0.3 tonnes &#8594; India &#8377;15,600Cr medical Ta &#8594; Stryker 50K implants &#8594; 25 um &#8594; &#8594; trabecular &#8594; &#8594; 80% porosity &#8594; &#8594; implant' },
  { id: 'TAP-0010', batchNo: 'TAP-B2410', city: 'Surat', manufacturer: 'Gujarat Ta Products', powderGrade: 'Ta 99.99% Wire Stock', application: 'Filament Lamp (Philips)', purityPercent: 99.99, particleSizeUm: 500, investmentCr: 280, status: 'Delivered', priority: 'Medium', origin: 'Gujarat Ta Products Surat (GJ)', destination: 'Philips Pune (MH)', shipDate: '2026-07-24', transitDays: 2, zone: 'West', remarks: 'Ta wire stock powder for Philips India halogen lamp filament mandrel drawing &#8594; 99.99% Ta &#8594; &#8377;280Cr for 0.5 tonnes &#8594; India &#8377;8,400Cr lighting Ta &#8594; Philips 10M lamps &#8594; 500 um rod &#8594; &#8594; drawing &#8594; &#8594; 3000&#176;C &#8594; &#8594; filament' },
  { id: 'TAP-0011', batchNo: 'TAP-B2411', city: 'Guwahati', manufacturer: 'Assam Tantalum Metals', powderGrade: 'Ta-Nb 60/40 Alloy', application: 'Chemical Valve (Reliance)', purityPercent: 99.7, particleSizeUm: 60, investmentCr: 430, status: 'Delivered', priority: 'High', origin: 'Assam Tantalum Metals Guwahati (AS)', destination: 'Reliance Jamnagar (GJ)', shipDate: '2026-07-25', transitDays: 4, zone: 'East', remarks: 'Ta-Nb alloy powder for Reliance refinery HF alkylation unit corrosion-resistant valve &#8594; 99.7% Ta-Nb &#8594; &#8377;430Cr for 1 tonne &#8594; India &#8377;12,900Cr petro Ta &#8594; Reliance 50 valves &#8594; 60 um &#8594; &#8594; MIM &#8594; &#8594; HF &#8594; &#8594; valve' },
  { id: 'TAP-0012', batchNo: 'TAP-B2412', city: 'Lucknow', manufacturer: 'UP Tantalum Industries', powderGrade: 'Ta 99.95% Plate Stock', application: 'Heat Shield (ISRO)', purityPercent: 99.95, particleSizeUm: 800, investmentCr: 590, status: 'Delayed', priority: 'Critical', origin: 'UP Tantalum Industries Lucknow (UP)', destination: 'ISRO Sriharikota (AP)', shipDate: '2026-07-01', transitDays: 28, zone: 'North', remarks: 'Ta plate stock for ISRO PSLV Mk-4 rocket nozzle throat heat shield &#8594; 99.95% Ta &#8594; &#8377;590Cr for 2 tonnes &#8594; monsoon delay &#8594; India &#8377;17,700Cr space Ta &#8594; ISRO 8 launches &#8594; 800 um plate &#8594; &#8594; spinning &#8594; &#8594; 3000&#176;C &#8594; &#8594; shield' },
  { id: 'TAP-0013', batchNo: 'TAP-B2413', city: 'Noida', manufacturer: 'SAIL', powderGrade: 'TaSi2 99.5% Silicide', application: 'Heating Element (BHEL)', purityPercent: 99.5, particleSizeUm: 10, investmentCr: 340, status: 'Delivered', priority: 'Medium', origin: 'SAIL Rourkela (OD)', destination: 'BHEL Bhopal (MP)', shipDate: '2026-07-26', transitDays: 2, zone: 'East', remarks: 'TaSi2 disilicide powder for BHEL high-temp furnace MoSi2-TaSi2 heating element &#8594; 99.5% TaSi2 &#8594; &#8377;340Cr for 0.5 tonnes &#8594; India &#8377;10,200Cr industrial Ta &#8594; BHEL 100 elements &#8594; 10 um &#8594; &#8594; PLS &#8594; &#8594; 1700&#176;C &#8594; &#8594; furnace' },
  { id: 'TAP-0014', batchNo: 'TAP-B2414', city: 'Bhopal', manufacturer: 'BHEL', powderGrade: 'Ta 99.9% Medical Grade', application: 'X-Ray Tube (HLL)', purityPercent: 99.9, particleSizeUm: 200, investmentCr: 470, status: 'Delivered', priority: 'High', origin: 'BHEL Bhopal (MP)', destination: 'HLL Hyderabad (TG)', shipDate: '2026-07-27', transitDays: 1, zone: 'North', remarks: 'Ta medical grade powder for HLL rotating anode X-ray tube target disc &#8594; 99.9% Ta &#8594; &#8377;470Cr for 0.6 tonnes &#8594; India &#8377;14,100Cr medical Ta &#8594; HLL 2K tubes &#8594; 200 um &#8594; &#8594; HIP &#8594; &#8594; 2500&#176;C &#8594; &#8594; X-ray' }
];

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const;
type Tab = typeof tabs[number];
const priorityColors: Record<string, string> = { Critical: 'bg-red-100 text-red-800', High: 'bg-amber-100 text-amber-800', Medium: 'bg-green-100 text-green-800', Low: 'bg-slate-100 text-slate-600' };
const delayedSet = new Set(tantalumPowderRecords.filter(r => r.status === 'Delayed').map(r => r.id));

export default function TantalumPowderLogisticsView() {
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const toggleFilter = (k: string, v: string) => { setFilters(p => { const s = { ...p }; const a = s[k] || []; const i = a.indexOf(v); if (i > -1) { a.splice(i, 1); if (!a.length) delete s[k]; } else s[k] = [...a, v]; return s; }); };
  const filtered = useMemo(() => {
    let d = tantalumPowderRecords;
    if (search) { const q = search.toLowerCase(); d = d.filter(r => r.id.toLowerCase().includes(q) || r.batchNo.toLowerCase().includes(q) || r.powderGrade.toLowerCase().includes(q) || r.application.toLowerCase().includes(q) || r.city.toLowerCase().includes(q) || r.manufacturer.toLowerCase().includes(q)); }
    Object.entries(filters).forEach(([k, vs]) => { if (vs.length) d = d.filter(r => { const v = String((r as unknown as Record<string, unknown>)[k] ?? ''); return vs.some(x => v.toLowerCase().includes(x.toLowerCase())); }); });
    return d;
  }, [search, filters]);
  const totalCr = filtered.reduce((s: number, r) => s + r.investmentCr, 0);
  const avgPurity = filtered.length ? filtered.reduce((s: number, r) => s + r.purityPercent, 0) / filtered.length : 0;
  const delayedCount = filtered.filter(r => r.status === 'Delayed').length;

  return (
    <div className="space-y-6">
      <PageHeader title="Tantalum Powder Logistics" description="Indian tantalum powder supply chain tracking for capacitor anodes, defence hypersonic fins, nuclear corrosion liners, medical implants, optical coatings, and aerospace turbine blades" />
      <div className="flex gap-2 border-b">
        {tabs.map(t => (<button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 text-sm font-medium ${activeTab === t ? 'border-b-2 border-cyan-500 text-cyan-700' : 'text-muted-foreground hover:text-foreground'}`}>{t}</button>))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-cyan-600">{filtered.length}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-cyan-600">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-cyan-600">{avgPurity.toFixed(2)}%</div><div className="text-xs text-muted-foreground">Avg Purity</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-red-500">{delayedCount}</div><div className="text-xs text-muted-foreground">Delayed Shipments</div></CardContent></Card>
      </div>
      {(activeTab === 'Dashboard' || activeTab === 'Registry') && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <input placeholder="Search ID, grade, application, city..." value={search} onChange={e => setSearch(e.target.value)} className="border rounded-md px-3 py-1.5 text-sm flex-1 min-w-48" />
            {['status', 'priority', 'zone'].map(f => { const opts = [...new Set(tantalumPowderRecords.map(r => (r as unknown as Record<string, unknown>)[f] as string))]; return (<div key={f} className="flex flex-wrap gap-1">{opts.map(o => (<Badge key={o} variant={(filters[f] || []).includes(o) ? 'default' : 'outline'} className="cursor-pointer text-xs" onClick={() => toggleFilter(f, o)}>{o}</Badge>))}</div>); })}
          </div>
          <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">Purity%</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.powderGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.purityPercent}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Analytics') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipments by Zone</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([z, c]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Electronic &amp; Medical</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.application.toLowerCase().includes('capacitor') || r.application.toLowerCase().includes('medical') || r.application.toLowerCase().includes('implant') || r.application.toLowerCase().includes('x-ray') || r.application.toLowerCase().includes('lamp')).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.powderGrade}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">By Priority</CardTitle></CardHeader><CardContent><div className="space-y-2">{Object.entries(filtered.reduce((m, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {} as Record<string, number>)).map(([p, c]) => (<div key={p} className="flex justify-between text-sm"><span className={priorityColors[p] || ''}>{p}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Powder Type Distribution</CardTitle></CardHeader><CardContent><div className="space-y-2">{[{ l: 'Pure Ta', f: filtered.filter(r => r.powderGrade.startsWith('Ta 99')).length }, { l: 'Ta Alloy', f: filtered.filter(r => r.powderGrade.includes('W') || r.powderGrade.includes('Nb') || r.powderGrade.includes('Si2')).length }, { l: 'Ta Compound', f: filtered.filter(r => r.powderGrade.includes('O5') || r.powderGrade.includes('C ') || r.powderGrade.includes('F7')).length }, { l: 'Ta Silicide', f: filtered.filter(r => r.powderGrade.includes('Si2')).length }].map(b => (<div key={b.l} className="flex justify-between text-sm"><span>{b.l}</span><span className="font-medium">{b.f}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Manufacturers</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([m, v]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Avg Transit Days</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.length ? (Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || [] as number[]).concat(r.transitDays); return m }, {} as Record<string, number[]>)) as [string, number[]][]).map(([z, d]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{(d.reduce((s, n) => s + n, 0) / d.length).toFixed(1)}d</span></div>)) : []}</div></CardContent></Card>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Insights') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardContent><div className="text-sm font-medium text-cyan-600 mb-2">BEL Tantalum Capacitor Domestic Production</div><div className="text-xs text-muted-foreground">BEL establishing indigenous tantalum capacitor anode production from MIDHANI spherical Ta powder, targeting 50 million units by 2027. Currently 85% imported from Kemet/Samsung. K2TaF7 precursor from NALCO converted via sodium reduction to 200K CV/g high-capacitance powder under &#8377;3,800Cr MEITY Electronic Components Mission.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-cyan-600 mb-2">DRDO Ta-10W BrahMos Hypersonic Fin</div><div className="text-xs text-muted-foreground">DRDO DMRL qualifying Ta-10W heavy alloy powder LEBM-processed stabilizer fins for BrahMos-II Mach 7 hypersonic cruise missile. Ta-10W provides 16.6 g/cm3 density enabling compact fin geometry with superior thermal shock resistance vs tungsten at 1800&#176;C. Programme under &#8377;2,600Cr DRDO Hypersonic Materials Mission.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-cyan-600 mb-2">Stryker Porous Tantalum Orthopaedic Implants</div><div className="text-xs text-muted-foreground">Stryker India manufacturing porous tantalum trabecular metal hip and knee implants from Tamil Nadu plasma-atomized Ta powder. Ta achieves 80% porosity with bone-like modulus eliminating stress shielding. India targeting 200K joint replacements by 2028 under &#8377;5,400Cr National Medical Devices Programme replacing Zimmer/Stryker imports.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-cyan-600 mb-2">ISRO Ta Heat Shield Re-entry Technology</div><div className="text-xs text-muted-foreground">ISRO LPSC developing Ta plate stock spun-formed nozzle throat heat shields for PSLV Mk-4 upper stage and future Gaganyaan crew module thermal protection. Ta maintains structural integrity at 3000&#176;C with 4x weight saving over C103 niobium alloy. Programme under &#8377;4,200Cr ISRO Advanced Propulsion Materials Initiative.</div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
'''

outpath = '/home/z/my-project/src/components/modules/tantalum-powder-logistics-view.tsx'
with open(outpath, 'w', encoding='utf-8') as f:
    f.write(content)
print(f"Generated: {outpath}")
print(f"Size: {len(content)} bytes")
