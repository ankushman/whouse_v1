#!/usr/bin/env python3
"""Generate R411b: Beryllium Oxide Logistics View"""
content = r""""use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Shield } from 'lucide-react';

interface BerylliumOxideRecord {
  id: string;
  batchNo: string;
  city: string;
  manufacturer: string;
  ceramicGrade: string;
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

const berylliumOxideRecords: BerylliumOxideRecord[] = [
  { id: 'BRO-0001', batchNo: 'BRO-B2401', city: 'Bengaluru', manufacturer: 'Bharat Electronics', ceramicGrade: 'BeO 99.5% Substrate', application: 'RF Power Transistor (BEL)', purityPercent: 99.5, thermalCondWmK: 285, investmentCr: 610, status: 'Delivered', priority: 'Critical', origin: 'BEL Bengaluru (KA)', destination: 'BEL Ghaziabad (UP)', shipDate: '2026-07-15', transitDays: 2, zone: 'South', remarks: 'BeO ceramic substrate for BEL military GaN RF power transistor baseplate &#8594; 99.5% BeO &#8594; &#8377;610Cr for 0.3 tonnes &#8594; India &#8377;18,300Cr defence BeO &#8594; BEL 10K modules &#8594; 285 W/mK &#8594; &#8594; GaN &#8594; 6 GHz &#8594; radar' },
  { id: 'BRO-0002', batchNo: 'BRO-B2402', city: 'Hyderabad', manufacturer: 'DRDO DMRL', ceramicGrade: 'BeO 99.9% Nuclear Grade', application: 'Nuclear Moderator (IGCAR)', purityPercent: 99.9, thermalCondWmK: 330, investmentCr: 780, status: 'Delivered', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TG)', destination: 'IGCAR Kalpakkam (TN)', shipDate: '2026-07-16', transitDays: 1, zone: 'South', remarks: 'Ultra-pure BeO for IGCAR PHWR nuclear reactor moderator reflector &#8594; 99.9% BeO &#8594; &#8377;780Cr for 0.5 tonnes &#8594; India &#8377;23,400Cr nuclear BeO &#8594; IGCAR 22 PHWR &#8594; 330 W/mK &#8594; &#8594; neutron &#8594; 300&#176;C &#8594; reflector' },
  { id: 'BRO-0003', batchNo: 'BRO-B2403', city: 'Mumbai', manufacturer: 'Sterlite Technologies', ceramicGrade: 'BeO 99.0% Laser Window', application: 'High-Power Laser CO2 (L&amp;T)', purityPercent: 99.0, thermalCondWmK: 270, investmentCr: 450, status: 'Delivered', priority: 'High', origin: 'Sterlite Pune (MH)', destination: 'L&amp;T Mumbai (MH)', shipDate: '2026-07-17', transitDays: 1, zone: 'West', remarks: 'BeO optical window for L&amp;T 10kW CO2 industrial cutting laser &#8594; 99% BeO polycrystal &#8594; &#8377;450Cr for 0.15 tonnes &#8594; India &#8377;13,500Cr industrial BeO &#8594; L&amp;T 200 lasers &#8594; 270 W/mK &#8594; &#8594; 10.6um &#8594; 500W &#8594; ZnSe-coated' },
  { id: 'BRO-0004', batchNo: 'BRO-B2404', city: 'Pune', manufacturer: 'Bharat Forge', ceramicGrade: 'BeO 99.5% Heat Sink', application: 'LED Power Driver (Dixon)', purityPercent: 99.5, thermalCondWmK: 285, investmentCr: 320, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'Dixon Noida (UP)', shipDate: '2026-07-18', transitDays: 2, zone: 'West', remarks: 'BeO heat sink for Dixon 200W LED street light power driver &#8594; 99.5% BeO &#8594; &#8377;320Cr for 1 tonne &#8594; India &#8377;9,600Cr lighting BeO &#8594; Dixon 1M drivers &#8594; 285 W/mK &#8594; &#8594; AlN comp &#8594; 150&#176;C &#8594; 50K hr' },
  { id: 'BRO-0005', batchNo: 'BRO-B2405', city: 'Chennai', manufacturer: 'IGCAR', ceramicGrade: 'BeO 99.8% Neutron Shield', application: 'Spent Fuel Cask (NPCIL)', purityPercent: 99.8, thermalCondWmK: 310, investmentCr: 520, status: 'Delivered', priority: 'Critical', origin: 'IGCAR Kalpakkam (TN)', destination: 'NPCIL Tarapur (MH)', shipDate: '2026-07-19', transitDays: 2, zone: 'South', remarks: 'BeO neutron shield liner for NPCIL dry spent fuel storage cask &#8594; 99.8% BeO &#8594; &#8377;520Cr for 2 tonnes &#8594; India &#8377;15,600Cr nuclear BeO &#8594; NPCIL 22 reactors &#8594; 310 W/mK &#8594; &#8594; gamma &#8594; 200&#176;C &#8594; &#8594; cask' },
  { id: 'BRO-0006', batchNo: 'BRO-B2406', city: 'Ahmedabad', manufacturer: 'Gujarat BeO Ceramics', ceramicGrade: 'BeO 99.0% Insulator', application: 'Klystron Tube (ISRO)', purityPercent: 99.0, thermalCondWmK: 275, investmentCr: 430, status: 'Delivered', priority: 'Critical', origin: 'Gujarat BeO Ceramics Ahmedabad (GJ)', destination: 'ISRO Sriharikota (AP)', shipDate: '2026-07-20', transitDays: 2, zone: 'West', remarks: 'BeO ceramic insulator for ISRO S-band high-power klystron transmitter &#8594; 99% BeO &#8594; &#8377;430Cr for 0.2 tonnes &#8594; India &#8377;12,900Cr space BeO &#8594; ISRO 12 GSLV &#8594; 275 W/mK &#8594; &#8594; 2.5 GHz &#8594; &#8594; 50kW &#8594; S-band' },
  { id: 'BRO-0007', batchNo: 'BRO-B2407', city: 'Jaipur', manufacturer: 'Rajasthan BeO Tech', ceramicGrade: 'BeO/Cu 60/40 Composite', application: 'Power IGBT Baseplate (BHEL)', purityPercent: 60.0, thermalCondWmK: 220, investmentCr: 380, status: 'Delivered', priority: 'High', origin: 'Rajasthan BeO Tech Jaipur (RJ)', destination: 'BHEL Bhopal (MP)', shipDate: '2026-07-21', transitDays: 2, zone: 'North', remarks: 'BeO/Cu metal-matrix composite for BHEL 3.3kV IGBT traction inverter baseplate &#8594; 60% BeO 40% Cu &#8594; &#8377;380Cr for 0.8 tonnes &#8594; India &#8377;11,400Cr power BeO &#8594; BHEL 500 loco &#8594; 220 W/mK &#8594; &#8594; CTE match &#8594; 150&#176;C &#8594; Si3N4 DBC' },
  { id: 'BRO-0008', batchNo: 'BRO-B2408', city: 'Bhubaneswar', manufacturer: 'NALCO', ceramicGrade: 'BeO 99.95% Sputtering Target', application: 'X-Ray Tube Window (HLL)', purityPercent: 99.95, thermalCondWmK: 320, investmentCr: 560, status: 'Delivered', priority: 'High', origin: 'NALCO Bhubaneswar (OD)', destination: 'HLL Hyderabad (TG)', shipDate: '2026-07-22', transitDays: 3, zone: 'East', remarks: 'BeO sputtering target for HLL medical CT X-ray tube window assembly &#8594; 99.95% BeO &#8594; &#8377;560Cr for 0.1 tonnes &#8594; India &#8377;16,800Cr medical BeO &#8594; HLL 3000 CT &#8594; 320 W/mK &#8594; &#8594; 80kVp &#8594; &#8594; low Z &#8594; transmission' },
  { id: 'BRO-0009', batchNo: 'BRO-B2409', city: 'Coimbatore', manufacturer: 'Tamil Nadu BeO Ceramics', ceramicGrade: 'BeO 99.5% Microwave PCB', application: 'Satcom Module (Viasat)', purityPercent: 99.5, thermalCondWmK: 280, investmentCr: 340, status: 'Delivered', priority: 'High', origin: 'Tamil Nadu BeO Coimbatore (TN)', destination: 'Viasat Bengaluru (KA)', shipDate: '2026-07-23', transitDays: 1, zone: 'South', remarks: 'BeO thick-film PCB for Viasat Ka-band satellite communication module &#8594; 99.5% BeO &#8594; &#8377;340Cr for 0.3 tonnes &#8594; India &#8377;10,200Cr satcom BeO &#8594; Viasat 2000 modules &#8594; 280 W/mK &#8594; &#8594; 26 GHz &#8594; &#8594; Au thick &#8594; HTCC' },
  { id: 'BRO-0010', batchNo: 'BRO-B2410', city: 'Surat', manufacturer: 'Gujarat BeO Products', ceramicGrade: 'BeO 99.0% Crucible', application: 'Silicon Crystal Growth (Tata Power)', purityPercent: 99.0, thermalCondWmK: 260, investmentCr: 290, status: 'Delivered', priority: 'Medium', origin: 'Gujarat BeO Products Surat (GJ)', destination: 'Tata Power Solar Bengaluru (KA)', shipDate: '2026-07-24', transitDays: 2, zone: 'West', remarks: 'BeO crucible for Tata Power Solar silicon ingot CZ crystal growth &#8594; 99% BeO &#8594; &#8377;290Cr for 1.5 tonnes &#8594; India &#8377;8,700Cr solar BeO &#8594; Tata 10 GW &#8594; 260 W/mK &#8594; &#8594; 1420&#176;C &#8594; &#8594; 200kg &#8594; Si melt' },
  { id: 'BRO-0011', batchNo: 'BRO-B2411', city: 'Guwahati', manufacturer: 'Assam BeO Industries', ceramicGrade: 'BeO 99.5% TIG Nozzle', application: 'Welding Torch (SAIL)', purityPercent: 99.5, thermalCondWmK: 285, investmentCr: 180, status: 'Delivered', priority: 'Medium', origin: 'Assam BeO Industries Guwahati (AS)', destination: 'SAIL Rourkela (OD)', shipDate: '2026-07-25', transitDays: 4, zone: 'East', remarks: 'BeO plasma nozzle for SAIL TIG welding torch arc constriction &#8594; 99.5% BeO &#8594; &#8377;180Cr for 0.5 tonnes &#8594; India &#8377;5,400Cr welding BeO &#8594; SAIL 35 MT &#8594; 285 W/mK &#8594; &#8594; 15000K &#8594; &#8594; 500A &#8594; &#8594; nozzle' },
  { id: 'BRO-0012', batchNo: 'BRO-B2412', city: 'Lucknow', manufacturer: 'UP BeO Ceramics', ceramicGrade: 'BeO 99.8% Space Insulator', application: 'Satellite Thermal Shield (ISRO)', purityPercent: 99.8, thermalCondWmK: 300, investmentCr: 470, status: 'Delayed', priority: 'Critical', origin: 'UP BeO Ceramics Lucknow (UP)', destination: 'ISRO Bengaluru (KA)', shipDate: '2026-07-01', transitDays: 27, zone: 'North', remarks: 'BeO thermal strap insulator for ISRO GSAT-5N satellite radiator panel &#8594; 99.8% BeO &#8594; &#8377;470Cr for 0.2 tonnes &#8594; monsoon delay &#8594; India &#8377;14,100Cr space BeO &#8594; ISRO 18 sats &#8594; 300 W/mK &#8594; &#8594; &#8594; 15K hot &#8594; thermal &#8594; strap' },
  { id: 'BRO-0013', batchNo: 'BRO-B2413', city: 'Noida', manufacturer: 'SAIL', ceramicGrade: 'BeO/Be 85/15 Cermet', application: 'Missile Radome (DRDO)', purityPercent: 85.0, thermalCondWmK: 180, investmentCr: 510, status: 'Delivered', priority: 'Critical', origin: 'SAIL Rourkela (OD)', destination: 'DRDO Hyderabad (TG)', shipDate: '2026-07-26', transitDays: 3, zone: 'East', remarks: 'BeO/Be cermet for DRDO BrahMos hypersonic missile radome nose tip &#8594; 85% BeO 15% Be &#8594; &#8377;510Cr for 0.15 tonnes &#8594; India &#8377;15,300Cr defence BeO &#8594; DRDO 300 missiles &#8594; 180 W/mK &#8594; &#8594; Mach 7 &#8594; &#8594; 1500&#176;C &#8594; radome' },
  { id: 'BRO-0014', batchNo: 'BRO-B2414', city: 'Bhopal', manufacturer: 'BHEL', ceramicGrade: 'BeO 99.5% Spark Plug', application: 'Gas Turbine Igniter (GE India)', purityPercent: 99.5, thermalCondWmK: 285, investmentCr: 350, status: 'Delivered', priority: 'High', origin: 'BHEL Bhopal (MP)', destination: 'GE India Pune (MH)', shipDate: '2026-07-27', transitDays: 1, zone: 'North', remarks: 'BeO insulator for GE India 9HA gas turbine spark igniter plug &#8594; 99.5% BeO &#8594; &#8377;350Cr for 0.4 tonnes &#8594; India &#8377;10,500Cr power BeO &#8594; GE 42 turbines &#8594; 285 W/mK &#8594; &#8594; 30kV &#8594; &#8594; 1400&#176;C &#8594; &#8594; igniter' }
];

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const;
type Tab = typeof tabs[number];
const priorityColors: Record<string, string> = { Critical: 'bg-red-100 text-red-800', High: 'bg-amber-100 text-amber-800', Medium: 'bg-green-100 text-green-800', Low: 'bg-slate-100 text-slate-600' };
const delayedSet = new Set(berylliumOxideRecords.filter(r => r.status === 'Delayed').map(r => r.id));

export default function BerylliumOxideLogisticsView() {
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const toggleFilter = (k: string, v: string) => { setFilters(p => { const s = { ...p }; const a = s[k] || []; const i = a.indexOf(v); if (i > -1) { a.splice(i, 1); if (!a.length) delete s[k]; } else s[k] = [...a, v]; return s; }); };
  const filtered = useMemo(() => {
    let d = berylliumOxideRecords;
    if (search) { const q = search.toLowerCase(); d = d.filter(r => r.id.toLowerCase().includes(q) || r.batchNo.toLowerCase().includes(q) || r.ceramicGrade.toLowerCase().includes(q) || r.application.toLowerCase().includes(q) || r.city.toLowerCase().includes(q) || r.manufacturer.toLowerCase().includes(q)); }
    Object.entries(filters).forEach(([k, vs]) => { if (vs.length) d = d.filter(r => { const v = String((r as unknown as Record<string, unknown>)[k] ?? ''); return vs.some(x => v.toLowerCase().includes(x.toLowerCase())); }); });
    return d;
  }, [search, filters]);
  const totalCr = filtered.reduce((s: number, r) => s + r.investmentCr, 0);
  const avgThermal = filtered.length ? filtered.reduce((s: number, r) => s + r.thermalCondWmK, 0) / filtered.length : 0;
  const delayedCount = filtered.filter(r => r.status === 'Delayed').length;

  return (
    <div className="space-y-6">
      <PageHeader title="Beryllium Oxide Logistics" description="Indian beryllium oxide ceramic supply chain tracking for RF substrates, nuclear reactors, laser windows, IGBT baseplates, satellite insulators and defence radome applications" />
      <div className="flex gap-2 border-b">
        {tabs.map(t => (<button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 text-sm font-medium ${activeTab === t ? 'border-b-2 border-emerald-500 text-emerald-700' : 'text-muted-foreground hover:text-foreground'}`}>{t}</button>))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-emerald-600">{filtered.length}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-emerald-600">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-emerald-600">{avgThermal.toFixed(0)} W/mK</div><div className="text-xs text-muted-foreground">Avg Thermal Cond.</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-red-500">{delayedCount}</div><div className="text-xs text-muted-foreground">Delayed Shipments</div></CardContent></Card>
      </div>
      {(activeTab === 'Dashboard' || activeTab === 'Registry') && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <input placeholder="Search ID, grade, application, city..." value={search} onChange={e => setSearch(e.target.value)} className="border rounded-md px-3 py-1.5 text-sm flex-1 min-w-48" />
            {['status', 'priority', 'zone'].map(f => { const opts = [...new Set(berylliumOxideRecords.map(r => (r as unknown as Record<string, unknown>)[f] as string))]; return (<div key={f} className="flex flex-wrap gap-1">{opts.map(o => (<Badge key={o} variant={(filters[f] || []).includes(o) ? 'default' : 'outline'} className="cursor-pointer text-xs" onClick={() => toggleFilter(f, o)}>{o}</Badge>))}</div>); })}
          </div>
          <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">W/mK</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.ceramicGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.thermalCondWmK}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Analytics') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipments by Zone</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([z, c]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Defence and Space</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.application.toLowerCase().includes('defence') || r.application.toLowerCase().includes('drdo') || r.application.toLowerCase().includes('space') || r.application.toLowerCase().includes('isro') || r.application.toLowerCase().includes('missile') || r.application.toLowerCase().includes('nuclear') || r.application.toLowerCase().includes('military') || r.application.toLowerCase().includes('igcar') || r.application.toLowerCase().includes('npcil')).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.ceramicGrade}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">By Priority</CardTitle></CardHeader><CardContent><div className="space-y-2">{Object.entries(filtered.reduce((m, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {} as Record<string, number>)).map(([p, c]) => (<div key={p} className="flex justify-between text-sm"><span className={priorityColors[p] || ''}>{p}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Thermal Conductivity Range</CardTitle></CardHeader><CardContent><div className="space-y-2">{[{ l: 'Ultra-High (300+ W/mK)', f: filtered.filter(r => r.thermalCondWmK >= 300).length }, { l: 'High (280-300)', f: filtered.filter(r => r.thermalCondWmK >= 280 && r.thermalCondWmK < 300).length }, { l: 'Medium (220-280)', f: filtered.filter(r => r.thermalCondWmK >= 220 && r.thermalCondWmK < 280).length }, { l: 'Standard (&lt;220)', f: filtered.filter(r => r.thermalCondWmK < 220).length }].map(b => (<div key={b.l} className="flex justify-between text-sm"><span>{b.l}</span><span className="font-medium">{b.f}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Manufacturers</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([m, v]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Avg Transit Days</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.length ? (Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || [] as number[]).concat(r.transitDays); return m }, {} as Record<string, number[]>)) as [string, number[]][]).map(([z, d]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{(d.reduce((s, n) => s + n, 0) / d.length).toFixed(1)}d</span></div>)) : []}</div></CardContent></Card>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Insights') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardContent><div className="text-sm font-medium text-emerald-600 mb-2">BEL GaN RF Power Transistor BeO</div><div className="text-xs text-muted-foreground">BEL producing 10K GaN-on-BeO RF power modules for Indian military radar replacing imported alumina substrates. BeO at 285 W/mK provides 10x thermal conductivity vs Al2O3 enabling 6 GHz 100W/mm GaN power density. DRDO DMRL co-developing BeO substrate tape-casting under &#8377;2,800Cr programme.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-emerald-600 mb-2">IGCAR Nuclear Moderator BeO Reflector</div><div className="text-xs text-muted-foreground">IGCAR qualifying 99.9% BeO reflector blocks for Indian PHWR fleet upgrading 22 reactors. BeO provides superior neutron economy vs heavy water allowing 5% fuel cycle extension saving &#8377;1,200Cr annually. DRDO DMRL co-developing BeO powder synthesis from indigenous beryl ore reducing US import dependency.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-emerald-600 mb-2">BHEL IGBT BeO/Cu Baseplate</div><div className="text-xs text-muted-foreground">BHEL deploying BeO/Cu 60/40 MMC baseplates for 3.3kV traction inverter IGBT replacing AlN with 15% lower thermal resistance. BeO/Cu CTE matches Si3N4 DBC preventing solder fatigue under 150&#176;C rail service. Rajasthan BeO Tech scaling hot-pressing to 200 TPA under &#8377;1,500Cr Make in India initiative.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-emerald-600 mb-2">DRDO BrahMos BeO/Be Cermet Radome</div><div className="text-xs text-muted-foreground">DRDO qualifying BeO/Be 85/15 cermet nose tip for BrahMos-II hypersonic missile radome surviving Mach 7 thermal shock at 1500&#176;C. BeO provides high thermal conductivity while Be metal adds fracture toughness. SAIL developing BeO/Be powder metallurgy under &#8377;3,200Cr programme targeting 300 radome sets.</div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
"""

with open("/home/z/my-project/src/components/modules/beryllium-oxide-logistics-view.tsx", "w") as f:
    f.write(content)
print("Generated beryllium-oxide-logistics-view.tsx")
