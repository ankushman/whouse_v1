#!/usr/bin/env python3
"""Generate tungsten-powder-logistics-view.tsx (R405b)"""

code = r"""'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Hammer } from 'lucide-react';

interface TungstenPowderRecord {
  id: string;
  batchNo: string;
  city: string;
  manufacturer: string;
  powderGrade: string;
  application: string;
  tungstenPercent: number;
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

const tungstenPowderRecords: TungstenPowderRecord[] = [
  { id: 'TWP-0001', batchNo: 'TWP-B2401', city: 'Mumbai', manufacturer: 'MIDHANI', powderGrade: 'W-Ni-Fe 90/6/4 Heavy Alloy', application: 'Kinetic Penetrator (DRDO)', tungstenPercent: 90.0, particleSizeUm: 5, investmentCr: 620, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'DRDO TBRL Chandigarh (PB)', shipDate: '2026-07-15', transitDays: 2, zone: 'West', remarks: 'W-Ni-Fe 90/6/4 heavy alloy powder for DRDO anti-tank kinetic energy penetrator &#8594; 90% W with Ni-Fe binder &#8594; &#8377;620Cr for 8 tonnes &#8594; India &#8377;18,600Cr defence W &#8594; DRDO 50K rounds &#8594; 5um PSD &#8594; 17.5 g/cc &#8594; liquid phase sintered' },
  { id: 'TWP-0002', batchNo: 'TWP-B2402', city: 'Bengaluru', manufacturer: 'HAL Aero Engines', powderGrade: 'WC-Co 88/12 Tungsten Carbide', application: 'Turbine Blade Tip (HAL)', tungstenPercent: 77.5, particleSizeUm: 1, investmentCr: 540, status: 'Delivered', priority: 'Critical', origin: 'HAL Engine Div Bengaluru (KA)', destination: 'DRDO GTRE Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 1, zone: 'South', remarks: 'WC-12%Co cemented carbide for HAL Tejas Mk2 engine turbine blade tip shroud &#8594; 77.5% W as WC &#8594; &#8377;540Cr for 4 tonnes &#8594; India &#8377;16,200Cr aero W &#8594; HAL 123 Tejas &#8594; 1um WC &#8594; 1500 HV30 &#8594; hot pressed' },
  { id: 'TWP-0003', batchNo: 'TWP-B2403', city: 'Chennai', manufacturer: 'IGCAR', powderGrade: 'W-5Re Tungsten Rhenium', application: 'Nuclear Reactor Target (IGCAR)', tungstenPercent: 95.0, particleSizeUm: 50, investmentCr: 380, status: 'Delivered', priority: 'Critical', origin: 'IGCAR Kalpakkam (TN)', destination: 'IGCAR FBTR (TN)', shipDate: '2026-07-17', transitDays: 1, zone: 'South', remarks: 'W-5%Re alloy for IGCAR fast breeder reactor spallation neutron target &#8594; 95% W with 5% Re &#8594; &#8377;380Cr for 3 tonnes &#8594; India &#8377;11,400Cr nuclear W &#8594; IGCAR 500 MW &#8594; 50um PSD &#8594; 3400&#176;C &#8594; PM+HIP' },
  { id: 'TWP-0004', batchNo: 'TWP-B2404', city: 'Hyderabad', manufacturer: 'DRDO DMRL', powderGrade: 'W-Cu 80/20 Heat Sink', application: 'Radar Module (BEL)', tungstenPercent: 80.0, particleSizeUm: 10, investmentCr: 290, status: 'Delivered', priority: 'High', origin: 'DRDO DMRL Hyderabad (TG)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: 'W-Cu 80/20 composite for BEL AESA radar T/R module heat sink baseplate &#8594; 80% W with Cu &#8594; &#8377;290Cr for 5 tonnes &#8594; India &#8377;8,700Cr defence W &#8594; BEL 100+ radars &#8594; 10um PSD &#8594; 180 W/mK &#8594; infiltration sintered' },
  { id: 'TWP-0005', batchNo: 'TWP-B2405', city: 'Kolkata', manufacturer: 'SAIL', powderGrade: 'W 99.95% Pure Tungsten', application: 'Lighting Electrode (Philips India)', tungstenPercent: 99.95, particleSizeUm: 25, investmentCr: 145, status: 'Delivered', priority: 'Medium', origin: 'SAIL Durgapur (WB)', destination: 'Philips Kolkata (WB)', shipDate: '2026-07-19', transitDays: 2, zone: 'East', remarks: 'Pure tungsten powder for Philips India LED sapphire substrate growth heater filament &#8594; 99.95% W &#8594; &#8377;145Cr for 1 tonne &#8594; India &#8377;4,350Cr lighting W &#8594; Philips 50M LEDs &#8594; 25um PSD &#8594; 3422&#176;C &#8594; plasma spray' },
  { id: 'TWP-0006', batchNo: 'TWP-B2406', city: 'Pune', manufacturer: 'Bharat Forge', powderGrade: 'WC-Ni 94/6 Wear Resistant', application: 'Diesel Engine Valve (Cummins)', tungstenPercent: 82.8, particleSizeUm: 2, investmentCr: 310, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'Cummins Jamshedpur (JH)', shipDate: '2026-07-20', transitDays: 2, zone: 'West', remarks: 'WC-6%Ni binderless carbide for Cummins B-series diesel engine exhaust valve seat insert &#8594; 82.8% W as WC &#8594; &#8377;310Cr for 6 tonnes &#8594; India &#8377;9,300Cr auto W &#8594; Cummins 1M engines &#8594; 2um WC &#8594; 1400 HV30 &#8594; sinter-HIP' },
  { id: 'TWP-0007', batchNo: 'TWP-B2407', city: 'Ahmedabad', manufacturer: 'Gujarat Tungsten', powderGrade: 'W-Cr-V High Speed Steel', application: 'Cutting Tool (Sandvik India)', tungstenPercent: 6.0, particleSizeUm: 75, investmentCr: 195, status: 'Delivered', priority: 'High', origin: 'Gujarat Tungsten Ahmedabad (GJ)', destination: 'Sandvik Pune (MH)', shipDate: '2026-07-21', transitDays: 1, zone: 'West', remarks: 'Tungsten HSS M2 powder for Sandvik India indexable cutting tool inserts &#8594; 6% W in Fe-Cr-V-W-Mo &#8594; &#8377;195Cr for 10 tonnes &#8594; India &#8377;5,850Cr tool W &#8594; Sandvik 200K inserts &#8594; 75um &#8594; 1200&#176;C &#8594; water atomized' },
  { id: 'TWP-0008', batchNo: 'TWP-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Tungsten', powderGrade: 'W 99.9% Spherical AM', application: 'Spacecraft Thruster (ISRO)', tungstenPercent: 99.9, particleSizeUm: 30, investmentCr: 520, status: 'Delivered', priority: 'Critical', origin: 'Rajasthan Tungsten Jaipur (RJ)', destination: 'ISRO LPSC Thiruvananthapuram (KL)', shipDate: '2026-07-22', transitDays: 3, zone: 'North', remarks: 'Spherical W powder for ISRO GSAT-4400N satellite electric propulsion thruster grid &#8594; 99.9% W &#8594; &#8377;520Cr for 2 tonnes &#8594; India &#8377;15,600Cr space W &#8594; ISRO 12 sats &#8594; 30um PSD &#8594; LPBF grade &#8594; xenon ion sputter resistant' },
  { id: 'TWP-0009', batchNo: 'TWP-B2409', city: 'Coimbatore', manufacturer: 'Tamil Nadu Tungsten', powderGrade: 'WC-Co 83/17 Mining', application: 'Drill Bit (Hindustan Zinc)', tungstenPercent: 73.2, particleSizeUm: 3, investmentCr: 260, status: 'Delivered', priority: 'High', origin: 'Tamil Nadu Tungsten Hosur (TN)', destination: 'Hindustan Zinc Udaipur (RJ)', shipDate: '2026-07-23', transitDays: 1, zone: 'South', remarks: 'WC-17%Co mining grade for Hindustan Zinc underground mine rock drill buttons &#8594; 73.2% W as WC &#8594; &#8377;260Cr for 8 tonnes &#8594; India &#8377;7,800Cr mining W &#8594; HZL 10M rods &#8594; 3um WC &#8594; 1400 HV30 &#8594; hot pressed' },
  { id: 'TWP-0010', batchNo: 'TWP-B2410', city: 'Bhubaneswar', manufacturer: 'NALCO', powderGrade: 'WO3 99.9% Tungsten Oxide', application: 'Cemented Carbide Precursor (Sandvik)', tungstenPercent: 79.3, particleSizeUm: 500, investmentCr: 175, status: 'Delivered', priority: 'Medium', origin: 'NALCO Bhubaneswar (OD)', destination: 'Sandvik Kolkata (WB)', shipDate: '2026-07-24', transitDays: 2, zone: 'East', remarks: 'Yellow tungsten oxide for Sandvik India APT to WC conversion &#8594; 79.3% W as WO3 &#8594; &#8377;175Cr for 20 tonnes &#8594; India &#8377;5,250Cr carbide W &#8594; Sandvik 200 TPA &#8594; 500um &#8594; calcined &#8594; hydrogen reduced' },
  { id: 'TWP-0011', batchNo: 'TWP-B2411', city: 'Guwahati', manufacturer: 'Assam Tungsten', powderGrade: 'W-Cu 75/25 Electrical Contact', application: 'HV Switchgear (ABB India)', tungstenPercent: 75.0, particleSizeUm: 15, investmentCr: 340, status: 'Delivered', priority: 'High', origin: 'Assam Tungsten Guwahati (AS)', destination: 'ABB Vadodara (GJ)', shipDate: '2026-07-25', transitDays: 4, zone: 'East', remarks: 'W-Cu 75/25 contact material for ABB India 400kV GIS arc-resistant contacts &#8594; 75% W with Cu &#8594; &#8377;340Cr for 6 tonnes &#8594; India &#8377;10,200Cr power W &#8594; ABB 500 switchgear &#8594; 15um PSD &#8594; 150 W/mK &#8594; infiltrated' },
  { id: 'TWP-0012', batchNo: 'TWP-B2412', city: 'Surat', manufacturer: 'Gujarat Tungsten Tech', powderGrade: 'WC 99% Nano Tungsten Carbide', application: 'PCB Micro-Drill (Syrma SGS)', tungstenPercent: 93.8, particleSizeUm: 0.08, investmentCr: 450, status: 'Delayed', priority: 'Critical', origin: 'Gujarat Tungsten Tech Surat (GJ)', destination: 'Syrma SGS Chennai (TN)', shipDate: '2026-07-03', transitDays: 23, zone: 'West', remarks: 'Nano-WC 80nm for Syrma SGS semiconductor PCB micro-via laser drill &#8594; 93.8% W as WC &#8594; &#8377;450Cr for 1.5 tonnes &#8594; monsoon delay &#8594; India &#8377;13,500Cr semi W &#8594; Syrma 5000 wafers &#8594; 80nm WC &#8594; 2000 HV30 &#8594; SPS sintered' },
  { id: 'TWP-0013', batchNo: 'TWP-B2413', city: 'Noida', manufacturer: 'UP Tungsten', powderGrade: 'W-La2O3 Doped Wire', application: 'Welding Electrode (ESAB India)', tungstenPercent: 97.5, particleSizeUm: 0, investmentCr: 210, status: 'Delivered', priority: 'Medium', origin: 'UP Tungsten Noida (UP)', destination: 'ESAB Kolkata (WB)', shipDate: '2026-07-26', transitDays: 2, zone: 'North', remarks: 'Lanthanum-doped tungsten TIG welding electrode for ESAB India stainless steel welding &#8594; 97.5% W with La2O3 &#8594; &#8377;210Cr for 10 tonnes rod stock &#8594; India &#8377;6,300Cr welding W &#8594; ESAB 200K electrodes &#8594; swaged rod &#8594; 3422&#176;C &#8594; non-thoriated' },
  { id: 'TWP-0014', batchNo: 'TWP-B2414', city: 'Bhopal', manufacturer: 'BHEL', powderGrade: 'WC-Co-Cr 86/10/4 HVOF', application: 'Steam Turbine Coating (BHEL)', tungstenPercent: 68.1, particleSizeUm: 20, investmentCr: 380, status: 'Delivered', priority: 'High', origin: 'BHEL Bhopal (MP)', destination: 'BHEL Trichy (TN)', shipDate: '2026-07-27', transitDays: 2, zone: 'North', remarks: 'WC-Co-Cr 86/10/4 HVOF powder for BHEL 800MW steam turbine blade erosion-resistant coating &#8594; 68.1% W as WC &#8594; &#8377;380Cr for 6 tonnes &#8594; India &#8377;11,400Cr power W &#8594; BHEL 42 turbines &#8594; 20um agglomerated &#8594; 1100 HV30 &#8594; HVOF spray' }
];

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const;
type Tab = typeof tabs[number];
const priorityColors: Record<string, string> = { Critical: 'bg-red-100 text-red-800', High: 'bg-amber-100 text-amber-800', Medium: 'bg-green-100 text-green-800', Low: 'bg-slate-100 text-slate-600' };
const delayedSet = new Set(tungstenPowderRecords.filter(r => r.status === 'Delayed').map(r => r.id));

export default function TungstenPowderLogisticsView() {
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const toggleFilter = (k: string, v: string) => { setFilters(p => { const s = { ...p }; const a = s[k] || []; const i = a.indexOf(v); if (i > -1) { a.splice(i, 1); if (!a.length) delete s[k]; } else s[k] = [...a, v]; return s; }); };
  const filtered = useMemo(() => {
    let d = tungstenPowderRecords;
    if (search) { const q = search.toLowerCase(); d = d.filter(r => r.id.toLowerCase().includes(q) || r.batchNo.toLowerCase().includes(q) || r.powderGrade.toLowerCase().includes(q) || r.application.toLowerCase().includes(q) || r.city.toLowerCase().includes(q) || r.manufacturer.toLowerCase().includes(q)); }
    Object.entries(filters).forEach(([k, vs]) => { if (vs.length) d = d.filter(r => { const v = String((r as unknown as Record<string, unknown>)[k] ?? ''); return vs.some(x => v.toLowerCase().includes(x.toLowerCase())); }); });
    return d;
  }, [search, filters]);
  const totalCr = filtered.reduce((s: number, r) => s + r.investmentCr, 0);
  const avgW = filtered.length ? filtered.reduce((s: number, r) => s + r.tungstenPercent, 0) / filtered.length : 0;
  const delayedCount = filtered.filter(r => r.status === 'Delayed').length;

  return (
    <div className="space-y-6">
      <PageHeader title="Tungsten Powder Logistics" description="Indian tungsten powder and heavy alloy supply chain tracking for defence penetrators, cutting tools, cemented carbide, nuclear and aerospace applications" />
      <div className="flex gap-2 border-b">
        {tabs.map(t => (<button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 text-sm font-medium ${activeTab === t ? 'border-b-2 border-rose-500 text-rose-700' : 'text-muted-foreground hover:text-foreground'}`}>{t}</button>))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-rose-600">{filtered.length}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-rose-600">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-rose-600">{avgW.toFixed(1)}%</div><div className="text-xs text-muted-foreground">Avg W Content</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-red-500">{delayedCount}</div><div className="text-xs text-muted-foreground">Delayed Shipments</div></CardContent></Card>
      </div>
      {(activeTab === 'Dashboard' || activeTab === 'Registry') && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <input placeholder="Search ID, grade, application, city..." value={search} onChange={e => setSearch(e.target.value)} className="border rounded-md px-3 py-1.5 text-sm flex-1 min-w-48" />
            {['status', 'priority', 'zone'].map(f => { const opts = [...new Set(tungstenPowderRecords.map(r => (r as unknown as Record<string, unknown>)[f] as string))]; return (<div key={f} className="flex flex-wrap gap-1">{opts.map(o => (<Badge key={o} variant={(filters[f] || []).includes(o) ? 'default' : 'outline'} className="cursor-pointer text-xs" onClick={() => toggleFilter(f, o)}>{o}</Badge>))}</div>); })}
          </div>
          <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">W%</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.powderGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.tungstenPercent}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Analytics') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipments by Zone</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([z, c]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Defence and Aerospace</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.application.toLowerCase().includes('defence') || r.application.toLowerCase().includes('kinetic') || r.application.toLowerCase().includes('radar') || r.application.toLowerCase().includes('nuclear') || r.application.toLowerCase().includes('spacecraft') || r.application.toLowerCase().includes('aero')).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.powderGrade} ({r.particleSizeUm || 'rod'}um)</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">By Priority</CardTitle></CardHeader><CardContent><div className="space-y-2">{Object.entries(filtered.reduce((m, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {} as Record<string, number>)).map(([p, c]) => (<div key={p} className="flex justify-between text-sm"><span className={priorityColors[p] || ''}>{p}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">W Content Distribution</CardTitle></CardHeader><CardContent><div className="space-y-2">{[{ l: 'Pure/Heavy (90%+)', f: filtered.filter(r => r.tungstenPercent >= 90).length }, { l: 'WC Carbide (68-85%)', f: filtered.filter(r => r.tungstenPercent >= 68 && r.tungstenPercent < 90).length }, { l: 'Medium Alloy (40-68%)', f: filtered.filter(r => r.tungstenPercent >= 40 && r.tungstenPercent < 68).length }, { l: 'Low/HSS (<10%)', f: filtered.filter(r => r.tungstenPercent < 10).length }].map(b => (<div key={b.l} className="flex justify-between text-sm"><span>{b.l}</span><span className="font-medium">{b.f}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Manufacturers</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([m, v]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Avg Transit Days</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.length ? (Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || [] as number[]).concat(r.transitDays); return m }, {} as Record<string, number[]>)) as [string, number[]][]).map(([z, d]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{(d.reduce((s, n) => s + n, 0) / d.length).toFixed(1)}d</span></div>)) : []}</div></CardContent></Card>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Insights') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardContent><div className="text-sm font-medium text-rose-600 mb-2">DRDO Kinetic Energy Penetrator</div><div className="text-xs text-muted-foreground">DRDO TBRL developing indigenous W-Ni-Fe 90/6/4 heavy alloy for anti-tank FSAPDS rounds replacing imported DU penetrators. MIDHANI commissioning 50 TPA W heavy alloy powder plant at Hyderabad with &#8377;2,200Cr investment. India producing 50,000 rounds annually for Army and IAF under Make-in-India.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-rose-600 mb-2">Nano-WC Semiconductor PCB Drilling</div><div className="text-xs text-muted-foreground">Syrma SGS and Dixon adopting 80nm WC micro-drill bits for semiconductor PCB micro-via and HDI substrate drilling. Gujarat Tungsten Tech scaling SPS nano-WC production to 5 TPA. India importing 85% tungsten carbide powder &#8594; local nano WC capacity targeting 15 TPA by 2029 under semiconductor mission.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-rose-600 mb-2">BHEL HVOF Turbine Coating</div><div className="text-xs text-muted-foreground">BHEL Trichy using WC-Co-Cr 86/10/4 HVOF powder for 800MW steam turbine blade and shroud erosion-resistant coating. 6 tonnes/year for 42 turbine annual production. WC-Co-Cr extends blade life from 40,000 to 120,000 hours in corrosive coal-fired steam. BHEL developing indigenous HVOF grade with DRDO DMRL.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-rose-600 mb-2">ISRO Electric Propulsion Thruster</div><div className="text-xs text-muted-foreground">ISRO LPSC developing next-gen 200mN Hall-effect and gridded ion thrusters for GSAT and NAVSAT satellites. W-99.9% spherical powder for ion grid and Hall channel erosion-resistant components. Rajasthan Tungsten commissioning LPBF-grade W powder plant. India targeting 30 satellite launches/year by 2030.</div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
"""

import os
outpath = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src', 'components', 'modules', 'tungsten-powder-logistics-view.tsx')
outpath = os.path.normpath(outpath)
with open(outpath, 'w') as f:
    f.write(code.strip() + '\n')
print(f"Generated: {outpath}")
print(f"Size: {os.path.getsize(outpath)} bytes")
