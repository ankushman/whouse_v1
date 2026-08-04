#!/usr/bin/env python3
"""Generate R416b: Boron Nitride Logistics View (bnm-*)"""
import os

content = r'''"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Orbit } from 'lucide-react';

interface BoronNitrideRecord {
  id: string;
  batchNo: string;
  city: string;
  manufacturer: string;
  bnGrade: string;
  application: string;
  purityPercent: number;
  thermalCondWmK: number;
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

const boronNitrideRecords: BoronNitrideRecord[] = [
  { id: 'BNM-0001', batchNo: 'BNM-B2401', city: 'Bengaluru', manufacturer: 'CSIR-NAL', bnGrade: 'h-BN 99.9% Platelet', application: 'Thermal Interface (BEL)', purityPercent: 99.9, thermalCondWmK: 300, investmentCr: 680, status: 'Delivered', priority: 'Critical', origin: 'CSIR-NAL Bengaluru (KA)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-15', transitDays: 0, zone: 'South', remarks: 'h-BN platelet thermal grease filler for BEL GaN RF power amplifier TIM &#8594; 99.9% h-BN &#8594; &#8377;680Cr for 0.5 tonnes &#8594; India &#8377;20,400Cr defence BN &#8594; BEL 100K amplifiers &#8594; 300 W/mK &#8594; &#8594; platelet &#8594; &#8594; 5um &#8594; &#8594; TIM' },
  { id: 'BNM-0002', batchNo: 'BNM-B2402', city: 'Hyderabad', manufacturer: 'DRDO DMRL', bnGrade: 'c-BN 99.8% Cubic', application: 'Cutting Tool (Sandvik)', purityPercent: 99.8, thermalCondWmK: 13, investmentCr: 820, status: 'Delivered', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TG)', destination: 'Sandvik Pune (MH)', shipDate: '2026-07-16', transitDays: 1, zone: 'South', remarks: 'c-BN second-hardest material for Sandvik India nickel-superalloy aerospace turning insert &#8594; 99.8% c-BN &#8594; &#8377;820Cr for 0.2 tonnes &#8594; India &#8377;24,600Cr tool BN &#8594; Sandvik 5M inserts &#8594; 13 W/mK &#8594; &#8594; 50 GPa &#8594; &#8594; Inconel &#8594; &#8594; CBN' },
  { id: 'BNM-0003', batchNo: 'BNM-B2403', city: 'Mumbai', manufacturer: 'Bharat Forge', bnGrade: 'h-BN 99.5% Spray', application: 'Mould Release (Mahindra)', purityPercent: 99.5, thermalCondWmK: 30, investmentCr: 340, status: 'Delivered', priority: 'Medium', origin: 'Bharat Forge Pune (MH)', destination: 'Mahindra Pune (MH)', shipDate: '2026-07-17', transitDays: 0, zone: 'West', remarks: 'h-BN spray lubricant for Mahindra die-casting aluminium engine block mould release &#8594; 99.5% h-BN &#8594; &#8377;340Cr for 2 tonnes &#8594; India &#8377;10,200Cr auto BN &#8594; Mahindra 50K castings &#8594; 30 W/mK &#8594; &#8594; aerosol &#8594; &#8594; 600&#176;C &#8594; &#8594; release' },
  { id: 'BNM-0004', batchNo: 'BNM-B2404', city: 'Pune', manufacturer: 'IGCAR', bnGrade: 'h-BN 99.99% Nuclear', application: 'Neutron Moderator (BHAVINI)', purityPercent: 99.99, thermalCondWmK: 33, investmentCr: 760, status: 'Delivered', priority: 'Critical', origin: 'IGCAR Kalpakkam (TN)', destination: 'BHAVINI Kalpakkam (TN)', shipDate: '2026-07-18', transitDays: 0, zone: 'South', remarks: 'h-BN ultra-pure for BHAVINI PFBR control rod neutron moderator poison liner &#8594; 99.99% h-BN &#8594; &#8377;760Cr for 0.3 tonnes &#8594; India &#8377;22,800Cr nuclear BN &#8594; BHAVINI PFBR &#8594; 33 W/mK &#8594; &#8594; hot-press &#8594; &#8594; thermal &#8594; &#8594; moderator' },
  { id: 'BNM-0005', batchNo: 'BNM-B2405', city: 'Chennai', manufacturer: 'Tata Advanced Materials', bnGrade: 'h-BN 99.9% Cosmetic', application: 'Lipstick Base (Lakme)', purityPercent: 99.9, thermalCondWmK: 30, investmentCr: 260, status: 'Delivered', priority: 'Medium', origin: 'Tata Advanced Materials Bengaluru (KA)', destination: 'Lakme Mumbai (MH)', shipDate: '2026-07-19', transitDays: 1, zone: 'South', remarks: 'h-BN platelet for Lakme India premium lipstick glide and silk texture enhancer &#8594; 99.9% h-BN &#8594; &#8377;260Cr for 0.1 tonnes &#8594; India &#8377;7,800Cr cosmetic BN &#8594; Lakme 20M units &#8594; 30 W/mK &#8594; &#8594; platelet &#8594; &#8594; 15um &#8594; &#8594; cosmetic' },
  { id: 'BNM-0006', batchNo: 'BNM-B2406', city: 'Ahmedabad', manufacturer: 'Gujarat BN Tech', bnGrade: 'h-BN 99.7% Crucible', application: 'Metal Melting (MIDHANI)', purityPercent: 99.7, thermalCondWmK: 60, investmentCr: 420, status: 'Delivered', priority: 'High', origin: 'Gujarat BN Tech Ahmedabad (GJ)', destination: 'MIDHANI Hyderabad (TG)', shipDate: '2026-07-20', transitDays: 2, zone: 'West', remarks: 'h-BN hot-pressed crucible for MIDHANI titanium alloy vacuum induction skull melting &#8594; 99.7% h-BN &#8594; &#8377;420Cr for 0.4 tonnes &#8594; India &#8377;12,600Cr metal BN &#8594; MIDHANI 100 melts &#8594; 60 W/mK &#8594; &#8594; hot-press &#8594; &#8594; 1800&#176;C &#8594; &#8594; crucible' },
  { id: 'BNM-0007', batchNo: 'BNM-B2407', city: 'Jaipur', manufacturer: 'Rajasthan BN Corp', bnGrade: 'h-BN 99.9% Polymer Additive', application: 'Thermal Plastic (Reliance)', purityPercent: 99.9, thermalCondWmK: 250, investmentCr: 380, status: 'Delivered', priority: 'High', origin: 'Rajasthan BN Corp Jaipur (RJ)', destination: 'Reliance Jamnagar (GJ)', shipDate: '2026-07-21', transitDays: 2, zone: 'North', remarks: 'h-BN filler for Reliance polymer LED heat sink thermal conductive compound &#8594; 99.9% h-BN &#8594; &#8377;380Cr for 1 tonne &#8594; India &#8377;11,400Cr polymer BN &#8594; Reliance 5M parts &#8594; 250 W/mK &#8594; &#8594; masterbatch &#8594; &#8594; 15 W/mK &#8594; &#8594; TC' },
  { id: 'BNM-0008', batchNo: 'BNM-B2408', city: 'Bhubaneswar', manufacturer: 'NALCO', bnGrade: 'B4C-hBN 99.5% Composite', application: 'Armour Plate (BEL)', purityPercent: 99.5, thermalCondWmK: 45, investmentCr: 540, status: 'Delivered', priority: 'High', origin: 'NALCO Bhubaneswar (OD)', destination: 'BEL Pune (MH)', shipDate: '2026-07-22', transitDays: 3, zone: 'East', remarks: 'B4C-hBN ceramic composite for BEL personnel ballistic armour plate lightweight insert &#8594; 99.5% B4C-hBN &#8594; &#8377;540Cr for 1 tonne &#8594; India &#8377;16,200Cr defence BN &#8594; BEL 50K plates &#8594; 45 W/mK &#8594; &#8594; hot-press &#8594; &#8594; NIJ III &#8594; &#8594; armour' },
  { id: 'BNM-0009', batchNo: 'BNM-B2409', city: 'Coimbatore', manufacturer: 'Tamil Nadu BN Corp', bnGrade: 'h-BN 99.8% Coating', application: 'EVA Encapsulant (Vikram Solar)', purityPercent: 99.8, thermalCondWmK: 35, investmentCr: 320, status: 'Delivered', priority: 'High', origin: 'Tamil Nadu BN Corp Coimbatore (TN)', destination: 'Vikram Solar Kolkata (WB)', shipDate: '2026-07-23', transitDays: 2, zone: 'South', remarks: 'h-BN filler for Vikram Solar PV module EVA encapsulant thermal conductivity enhancement &#8594; 99.8% h-BN &#8594; &#8377;320Cr for 0.8 tonnes &#8594; India &#8377;9,600Cr solar BN &#8594; Vikram 100MW &#8594; 35 W/mK &#8594; &#8594; film &#8594; &#8594; 1.2 W/mK &#8594; &#8594; PV' },
  { id: 'BNM-0010', batchNo: 'BNM-B2410', city: 'Surat', manufacturer: 'Gujarat BN Products', bnGrade: 'h-BN 99.9% Lubricant', application: 'High-Temp Bearing (Wipro)', purityPercent: 99.9, thermalCondWmK: 28, investmentCr: 290, status: 'Delivered', priority: 'Medium', origin: 'Gujarat BN Products Surat (GJ)', destination: 'Wipro Bengaluru (KA)', shipDate: '2026-07-24', transitDays: 2, zone: 'West', remarks: 'h-BN solid lubricant for Wipro aerospace turbine bearing high-temperature greese replacement &#8594; 99.9% h-BN &#8594; &#8377;290Cr for 1 tonne &#8594; India &#8377;8,700Cr aero BN &#8594; Wipro 50K bearings &#8594; 28 W/mK &#8594; &#8594; powder &#8594; &#8594; 1000&#176;C &#8594; &#8594; lube' },
  { id: 'BNM-0011', batchNo: 'BNM-B2411', city: 'Guwahati', manufacturer: 'Assam BN Metals', bnGrade: 'h-BN 99.7% RF Window', application: 'Microwave Radome (BEL)', purityPercent: 99.7, thermalCondWmK: 40, investmentCr: 480, status: 'Delivered', priority: 'High', origin: 'Assam BN Metals Guwahati (AS)', destination: 'BEL Ghaziabad (UP)', shipDate: '2026-07-25', transitDays: 4, zone: 'East', remarks: 'h-BN radome window for BEL missile seeker microwave K-band transparent radome &#8594; 99.7% h-BN &#8594; &#8377;480Cr for 0.3 tonnes &#8594; India &#8377;14,400Cr defence BN &#8594; BEL 2000 radomes &#8594; 40 W/mK &#8594; &#8594; HIP &#8594; &#8594; 18-40GHz &#8594; &#8594; radome' },
  { id: 'BNM-0012', batchNo: 'BNM-B2412', city: 'Lucknow', manufacturer: 'UP BN Industries', bnGrade: 'h-BN 99.9% Substrate', application: 'GaN-on-SiC Epitaxy (ISRO)', purityPercent: 99.9, thermalCondWmK: 60, investmentCr: 580, status: 'Delayed', priority: 'Critical', origin: 'UP BN Industries Lucknow (UP)', destination: 'ISRO Ahmedabad (GJ)', shipDate: '2026-07-01', transitDays: 28, zone: 'North', remarks: 'h-BN insulating substrate for ISRO satellite GaN-on-SiC MMIC power amplifier MOCVD epitaxy &#8594; 99.9% h-BN &#8594; &#8377;580Cr for 0.2 tonnes &#8594; monsoon delay &#8594; India &#8377;17,400Cr space BN &#8594; ISRO 12 sats &#8594; 60 W/mK &#8594; &#8594; CVD &#8594; &#8594; 900&#176;C &#8594; &#8594; epitaxy' },
  { id: 'BNM-0013', batchNo: 'BNM-B2413', city: 'Noida', manufacturer: 'SAIL', bnGrade: 'h-BN 99.5% Foundry', application: 'Steel Casting (Tata Steel)', purityPercent: 99.5, thermalCondWmK: 25, investmentCr: 310, status: 'Delivered', priority: 'Medium', origin: 'SAIL Rourkela (OD)', destination: 'Tata Steel Jamshedpur (JH)', shipDate: '2026-07-26', transitDays: 2, zone: 'East', remarks: 'h-BN casting wash coat for Tata Steel continuous slab caster nozzle anti-stick &#8594; 99.5% h-BN &#8594; &#8377;310Cr for 3 tonnes &#8594; India &#8377;9,300Cr steel BN &#8594; Tata Steel 500 tundishes &#8594; 25 W/mK &#8594; &#8594; wash &#8594; &#8594; 1550&#176;C &#8594; &#8594; casting' },
  { id: 'BNM-0014', batchNo: 'BNM-B2414', city: 'Bhopal', manufacturer: 'BHEL', bnGrade: 'h-BN 99.8% Gasket', application: 'Transformer Gasket (ABB)', purityPercent: 99.8, thermalCondWmK: 32, investmentCr: 280, status: 'Delivered', priority: 'Medium', origin: 'BHEL Bhopal (MP)', destination: 'ABB Bengaluru (KA)', shipDate: '2026-07-27', transitDays: 1, zone: 'North', remarks: 'h-BN filler gasket for ABB India 765kV HVDC converter transformer high-voltage insulation &#8594; 99.8% h-BN &#8594; &#8377;280Cr for 1.5 tonnes &#8594; India &#8377;8,400Cr electrical BN &#8594; ABB 500 transformers &#8594; 32 W/mK &#8594; &#8594; sheet &#8594; &#8594; 30kV/mm &#8594; &#8594; gasket' }
];

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const;
type Tab = typeof tabs[number];
const priorityColors: Record<string, string> = { Critical: 'bg-red-100 text-red-800', High: 'bg-amber-100 text-amber-800', Medium: 'bg-green-100 text-green-800', Low: 'bg-slate-100 text-slate-600' };
const delayedSet = new Set(boronNitrideRecords.filter(r => r.status === 'Delayed').map(r => r.id));

export default function BoronNitrideLogisticsView() {
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const toggleFilter = (k: string, v: string) => { setFilters(p => { const s = { ...p }; const a = s[k] || []; const i = a.indexOf(v); if (i > -1) { a.splice(i, 1); if (!a.length) delete s[k]; } else s[k] = [...a, v]; return s; }); };
  const filtered = useMemo(() => {
    let d = boronNitrideRecords;
    if (search) { const q = search.toLowerCase(); d = d.filter(r => r.id.toLowerCase().includes(q) || r.batchNo.toLowerCase().includes(q) || r.bnGrade.toLowerCase().includes(q) || r.application.toLowerCase().includes(q) || r.city.toLowerCase().includes(q) || r.manufacturer.toLowerCase().includes(q)); }
    Object.entries(filters).forEach(([k, vs]) => { if (vs.length) d = d.filter(r => { const v = String((r as unknown as Record<string, unknown>)[k] ?? ''); return vs.some(x => v.toLowerCase().includes(x.toLowerCase())); }); });
    return d;
  }, [search, filters]);
  const totalCr = filtered.reduce((s: number, r) => s + r.investmentCr, 0);
  const avgPurity = filtered.length ? filtered.reduce((s: number, r) => s + r.purityPercent, 0) / filtered.length : 0;
  const delayedCount = filtered.filter(r => r.status === 'Delayed').length;

  return (
    <div className="space-y-6">
      <PageHeader title="Boron Nitride Logistics" description="Indian boron nitride supply chain tracking for thermal interface materials, CBN cutting tools, nuclear moderators, high-temperature crucibles, cosmetics, polymer additives, ballistic armour, and space epitaxy substrates" />
      <div className="flex gap-2 border-b">
        {tabs.map(t => (<button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 text-sm font-medium ${activeTab === t ? 'border-b-2 border-pink-500 text-pink-700' : 'text-muted-foreground hover:text-foreground'}`}>{t}</button>))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-pink-600">{filtered.length}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-pink-600">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-pink-600">{avgPurity.toFixed(2)}%</div><div className="text-xs text-muted-foreground">Avg Purity</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-red-500">{delayedCount}</div><div className="text-xs text-muted-foreground">Delayed Shipments</div></CardContent></Card>
      </div>
      {(activeTab === 'Dashboard' || activeTab === 'Registry') && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <input placeholder="Search ID, grade, application, city..." value={search} onChange={e => setSearch(e.target.value)} className="border rounded-md px-3 py-1.5 text-sm flex-1 min-w-48" />
            {['status', 'priority', 'zone'].map(f => { const opts = [...new Set(boronNitrideRecords.map(r => (r as unknown as Record<string, unknown>)[f] as string))]; return (<div key={f} className="flex flex-wrap gap-1">{opts.map(o => (<Badge key={o} variant={(filters[f] || []).includes(o) ? 'default' : 'outline'} className="cursor-pointer text-xs" onClick={() => toggleFilter(f, o)}>{o}</Badge>))}</div>); })}
          </div>
          <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">Purity%</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.bnGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.purityPercent}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Analytics') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipments by Zone</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([z, c]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Defence &amp; Nuclear</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.application.toLowerCase().includes('drdo') || r.application.toLowerCase().includes('bel') || r.application.toLowerCase().includes('nuclear') || r.application.toLowerCase().includes('defence') || r.application.toLowerCase().includes('armour') || r.application.toLowerCase().includes('bhavini') || r.application.toLowerCase().includes('isro')).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.bnGrade}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">By Priority</CardTitle></CardHeader><CardContent><div className="space-y-2">{Object.entries(filtered.reduce((m, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {} as Record<string, number>)).map(([p, c]) => (<div key={p} className="flex justify-between text-sm"><span className={priorityColors[p] || ''}>{p}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">BN Crystal Type</CardTitle></CardHeader><CardContent><div className="space-y-2">{[{ l: 'Hexagonal (h-BN)', f: filtered.filter(r => r.bnGrade.includes('h-BN')).length }, { l: 'Cubic (c-BN)', f: filtered.filter(r => r.bnGrade.includes('c-BN')).length }, { l: 'Composite (B4C-hBN)', f: filtered.filter(r => r.bnGrade.includes('B4C')).length }].map(b => (<div key={b.l} className="flex justify-between text-sm"><span>{b.l}</span><span className="font-medium">{b.f}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Manufacturers</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([m, v]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Avg Transit Days</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.length ? (Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || [] as number[]).concat(r.transitDays); return m }, {} as Record<string, number[]>)) as [string, number[]][]).map(([z, d]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{(d.reduce((s, n) => s + n, 0) / d.length).toFixed(1)}d</span></div>)) : []}</div></CardContent></Card>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Insights') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardContent><div className="text-sm font-medium text-pink-600 mb-2">DRDO c-BN Superalloy Cutting Tools</div><div className="text-xs text-muted-foreground">DRDO DMRL developing cubic boron nitride (c-BN) polycrystalline inserts for machining Inconel-718 and Nimonic-90 superalloy aerospace components at Sandvik India. c-BN at 50 GPa is second only to diamond, enabling 3x cutting speed vs WC-Co on Ni-alloys. Programme under &#8377;3,800Cr DRDO Advanced Tooling Mission targeting 80% import substitution.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-pink-600 mb-2">ISRO h-BN GaN-on-SiC Epitaxy Substrate</div><div className="text-xs text-muted-foreground">ISRO SAC qualifying h-BN insulating buffer layers for GaN-on-SiC MMIC power amplifiers in satellite X-band phased array. h-BN enables lattice-matched MOCVD epitaxy at 900&#176;C with superior thermal conductivity vs GaN-on-Si. Programme under &#8377;4,600Cr ISRO Space Communications Mission for next-gen 20kW SSPA.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-pink-600 mb-2">BHAVINI h-BN Nuclear Moderator</div><div className="text-xs text-muted-foreground">BHAVINI deploying ultra-pure h-BN as neutron reflector and moderator poison liner in Prototype Fast Breeder Reactor control rod assemblies. h-BN provides 33 W/mK thermal conductivity at 550&#176;C with low neutron absorption cross-section. India planning 4 additional FBRs by 2035 under &#8377;45,000Cr nuclear expansion programme.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-pink-600 mb-2">BEL B4C-hBN Ballistic Armour</div><div className="text-xs text-muted-foreground">BEL qualifying B4C-hBN ceramic composite armour plates achieving NIJ Level III+ protection at 25% weight vs pure alumina. Boron nitride additive improves fracture toughness by 40% preventing catastrophic spalling. Programme under &#8377;2,800Cr DRDO Advanced Armour Materials Mission for Indian Army CRPF/CISF modernization.</div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
'''

outpath = '/home/z/my-project/src/components/modules/boron-nitride-logistics-view.tsx'
with open(outpath, 'w', encoding='utf-8') as f:
    f.write(content)
print(f"Generated: {outpath}")
print(f"Size: {len(content)} bytes")
