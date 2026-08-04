r"""Generate Rhenium Alloy Logistics View module (R409a)"""
COMPONENT = r"""'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Sun } from 'lucide-react';

interface RheniumAlloyRecord {
  id: string;
  batchNo: string;
  city: string;
  manufacturer: string;
  alloyGrade: string;
  application: string;
  rheniumPercent: number;
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

const rheniumAlloyRecords: RheniumAlloyRecord[] = [
  { id: 'RHA-0001', batchNo: 'RHA-B2401', city: 'Bengaluru', manufacturer: 'HAL Aero Engines', alloyGrade: 'Re-Ni 50/50 Super', application: 'Turbine Blade Single Crystal (HAL)', rheniumPercent: 50.0, meltingPointC: 1450, investmentCr: 890, status: 'Delivered', priority: 'Critical', origin: 'HAL Aero Engines Bengaluru (KA)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-15', transitDays: 1, zone: 'South', remarks: 'Re-Ni superalloy for HAL Tejas Mk2 HPT single crystal blade &#8594; 50% Re with 50% Ni &#8594; &#8377;890Cr for 0.5 tonnes &#8594; India &#8377;26,700Cr aero Re &#8594; HAL 123 Tejas &#8594; 1450&#176;C service &#8594; SX &#8594; creep' },
  { id: 'RHA-0002', batchNo: 'RHA-B2402', city: 'Hyderabad', manufacturer: 'DRDO DMRL', alloyGrade: 'Re-Mo 47/53 Heater', application: 'Spacecraft Thruster Heater (ISRO)', rheniumPercent: 47.0, meltingPointC: 2440, investmentCr: 720, status: 'Delivered', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TG)', destination: 'ISRO Ahmedabad (GJ)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'Re-Mo alloy heater element for ISRO satellite arcjet thruster &#8594; 47% Re with 53% Mo &#8594; &#8377;720Cr for 0.2 tonnes &#8594; India &#8377;21,600Cr space Re &#8594; ISRO 12 sats &#8594; 2440&#176;C melt &#8594; arcjet &#8594; 2000&#176;C service' },
  { id: 'RHA-0003', batchNo: 'RHA-B2403', city: 'Mumbai', manufacturer: 'MIDHANI', alloyGrade: 'Re-W 25/75 Contact', application: 'Circuit Breaker Contact (BHEL)', rheniumPercent: 25.0, meltingPointC: 3000, investmentCr: 340, status: 'Delivered', priority: 'High', origin: 'MIDHANI Hyderabad (TG)', destination: 'BHEL Bhopal (MP)', shipDate: '2026-07-17', transitDays: 2, zone: 'West', remarks: 'Re-W electrical contact for BHEL 765 kV GIS vacuum circuit breaker &#8594; 25% Re with 75% W &#8594; &#8377;340Cr for 0.3 tonnes &#8594; India &#8377;10,200Cr power Re &#8594; BHEL 150 GW &#8594; 3000&#176;C arc &#8594; 100K cycles &#8594; vacuum' },
  { id: 'RHA-0004', batchNo: 'RHA-B2404', city: 'Chennai', manufacturer: 'IGCAR', alloyGrade: 'Re-Pt 40/60 Catalyst', application: 'Naphtha Reformer (BPCL)', rheniumPercent: 40.0, meltingPointC: 1800, investmentCr: 560, status: 'Delivered', priority: 'High', origin: 'IGCAR Kalpakkam (TN)', destination: 'BPCL Mumbai (MH)', shipDate: '2026-07-18', transitDays: 2, zone: 'South', remarks: 'Re-Pt bimetallic for BPCL catalytic reformer naphtha octane boost &#8594; 40% Re with 60% Pt &#8594; &#8377;560Cr for 0.8 tonnes &#8594; India &#8377;16,800Cr petro Re &#8594; BPCL 35 MT &#8594; 1800&#176;C service &#8594; 95 RON &#8594; Pt-Re' },
  { id: 'RHA-0005', batchNo: 'RHA-B2405', city: 'Pune', manufacturer: 'Bharat Forge', alloyGrade: 'Re-Cr 30/70 Exhaust', application: 'Gas Turbine Exhaust Nozzle (GE India)', rheniumPercent: 30.0, meltingPointC: 2100, investmentCr: 410, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'GE India Pune (MH)', shipDate: '2026-07-19', transitDays: 1, zone: 'West', remarks: 'Re-Cr high-temp alloy for GE 9HA gas turbine exhaust nozzle flap &#8594; 30% Re with 70% Cr &#8594; &#8377;410Cr for 1 tonne &#8594; India &#8377;12,300Cr power Re &#8594; GE 42 turbines &#8594; 2100&#176;C service &#8594; oxidation &#8594; flap' },
  { id: 'RHA-0006', batchNo: 'RHA-B2406', city: 'Ahmedabad', manufacturer: 'Gujarat Rhenium Tech', alloyGrade: 'Re 99.95% Spherical AM', application: 'Rocket Nozzle Throat (ISRO)', rheniumPercent: 99.95, meltingPointC: 3180, investmentCr: 980, status: 'Delivered', priority: 'Critical', origin: 'Gujarat Rhenium Tech Ahmedabad (GJ)', destination: 'ISRO Sriharikota (AP)', shipDate: '2026-07-20', transitDays: 2, zone: 'West', remarks: 'Pure Re LPBF powder for ISRO PSLV rocket nozzle throat insert &#8594; 99.95% Re &#8594; &#8377;980Cr for 0.15 tonnes &#8594; India &#8377;29,400Cr space Re &#8594; ISRO 12 PSLV &#8594; 3180&#176;C melt &#8594; LPBF &#8594; CVD Ir liner' },
  { id: 'RHA-0007', batchNo: 'RHA-B2407', city: 'Jaipur', manufacturer: 'Rajasthan Rhenium Metals', alloyGrade: 'Re-Ta 10/90 Filament', application: 'Incandescent Filament (Philips)', rheniumPercent: 10.0, meltingPointC: 3000, investmentCr: 145, status: 'Delivered', priority: 'Medium', origin: 'Rajasthan Rhenium Metals Jaipur (RJ)', destination: 'Philips Aurangabad (MH)', shipDate: '2026-07-21', transitDays: 2, zone: 'North', remarks: 'Re-Ta alloy filament for Philips halogen lamp high-temp coil &#8594; 10% Re with 90% Ta &#8594; &#8377;145Cr for 0.5 tonnes &#8594; India &#8377;4,350Cr lighting Re &#8594; Philips 100M lamps &#8594; 3000&#176;C &#8594; non-sag &#8594; filament' },
  { id: 'RHA-0008', batchNo: 'RHA-B2408', city: 'Coimbatore', manufacturer: 'Tamil Nadu Rhenium Corp', alloyGrade: 'Re-Co 20/80 Magnetic', application: 'Hard Disk Write Head (Seagate)', rheniumPercent: 20.0, meltingPointC: 1500, investmentCr: 320, status: 'Delivered', priority: 'High', origin: 'Tamil Nadu Rhenium Corp Hosur (TN)', destination: 'Seagate Bengaluru (KA)', shipDate: '2026-07-22', transitDays: 1, zone: 'South', remarks: 'Re-Co magnetic alloy for Seagate HDD write head pole tip &#8594; 20% Re with 80% Co &#8594; &#8377;320Cr for 0.1 tonnes &#8594; India &#8377;9,600Cr storage Re &#8594; Seagate 50M HDD &#8594; 1500&#176;C service &#8594; high Bs &#8594; pole tip' },
  { id: 'RHA-0009', batchNo: 'RHA-B2409', city: 'Bhubaneswar', manufacturer: 'NALCO', alloyGrade: 'Re-Nb 5/95 Superconductor', application: 'MRI Magnet Wire (HLL)', rheniumPercent: 5.0, meltingPointC: 2470, investmentCr: 480, status: 'Delivered', priority: 'High', origin: 'NALCO Bhubaneswar (OD)', destination: 'HLL Hyderabad (TG)', shipDate: '2026-07-23', transitDays: 3, zone: 'East', remarks: 'Re-doped Nb wire for HLL 3T MRI superconducting magnet coil &#8594; 5% Re with 95% Nb &#8594; &#8377;480Cr for 2 tonnes &#8594; India &#8377;14,400Cr medical Re &#8594; HLL 5000 MRI &#8594; 2470&#176;C melt &#8594; 4.2K service &#8594; Nb3Sn' },
  { id: 'RHA-0010', batchNo: 'RHA-B2410', city: 'Guwahati', manufacturer: 'Assam Rhenium Metals', alloyGrade: 'Re-Cr-Ni 3/20/77 Bond', application: 'Turbine Blade TBC Bond (Wipro Aero)', rheniumPercent: 3.0, meltingPointC: 1400, investmentCr: 390, status: 'Delivered', priority: 'Medium', origin: 'Assam Rhenium Metals Guwahati (AS)', destination: 'Wipro Aero Bengaluru (KA)', shipDate: '2026-07-24', transitDays: 4, zone: 'East', remarks: 'Re-doped NiCrAlY bond coat for Wipro Aerospace LPT blade TBC &#8594; 3% Re with 20% Cr 77% Ni &#8594; &#8377;390Cr for 1 tonne &#8594; India &#8377;11,700Cr aero Re &#8594; Wipro 500 modules &#8594; 1400&#176;C service &#8594; TBC &#8594; bond' },
  { id: 'RHA-0011', batchNo: 'RHA-B2411', city: 'Surat', manufacturer: 'Gujarat Rhenium Products', alloyGrade: 'Re 99.9% Thermocouple', application: 'Furnace Probe (Tata Steel)', rheniumPercent: 99.9, meltingPointC: 3180, investmentCr: 265, status: 'Delivered', priority: 'Medium', origin: 'Gujarat Rhenium Products Surat (GJ)', destination: 'Tata Steel Jamshedpur (JH)', shipDate: '2026-07-25', transitDays: 3, zone: 'West', remarks: 'W-Re thermocouple for Tata Steel blast furnace 2000&#176;C temp profiling &#8594; 99.9% Re &#8594; &#8377;265Cr for 0.05 tonnes &#8594; India &#8377;7,950Cr steel Re &#8594; Tata 35 MT &#8594; 3180&#176;C melt &#8594; 2300&#176;C service &#8594; Type C' },
  { id: 'RHA-0012', batchNo: 'RHA-B2412', city: 'Lucknow', manufacturer: 'UP Rhenium Industries', alloyGrade: 'Re-Ir 60/40 Spark', application: 'Aero Igniter Plug (DRDO)', rheniumPercent: 60.0, meltingPointC: 2450, investmentCr: 520, status: 'Delayed', priority: 'Critical', origin: 'UP Rhenium Industries Lucknow (UP)', destination: 'DRDO Hyderabad (TG)', shipDate: '2026-07-01', transitDays: 27, zone: 'North', remarks: 'Re-Ir igniter electrode for DRDO AMCA fighter engine start system &#8594; 60% Re with 40% Ir &#8594; &#8377;520Cr for 0.1 tonnes &#8594; monsoon delay &#8594; India &#8377;15,600Cr defence Re &#8594; DRDO 200 AMCA &#8594; 2450&#176;C melt &#8594; ignition &#8594; 1500&#176;C' },
  { id: 'RHA-0013', batchNo: 'RHA-B2413', city: 'Noida', manufacturer: 'SAIL', alloyGrade: 'Re-Mo-Ni 10/15/75 Turbine', application: 'HPT Blade DS (BEL)', rheniumPercent: 10.0, meltingPointC: 1350, investmentCr: 440, status: 'Delivered', priority: 'High', origin: 'SAIL Rourkela (OD)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-26', transitDays: 2, zone: 'North', remarks: 'Re-Mo-Ni superalloy for BEL naval gas turbine HPT directionally solidified blade &#8594; 10% Re with 15% Mo 75% Ni &#8594; &#8377;440Cr for 0.8 tonnes &#8594; India &#8377;13,200Cr naval Re &#8594; BEL 12 warships &#8594; 1350&#176;C service &#8594; DS &#8594; GTG' },
  { id: 'RHA-0014', batchNo: 'RHA-B2414', city: 'Bhopal', manufacturer: 'BHEL', alloyGrade: 'Re-W-Th 5/90/5 Emitter', application: 'X-Ray Tube Anode (HLL)', rheniumPercent: 5.0, meltingPointC: 3100, investmentCr: 380, status: 'Delivered', priority: 'High', origin: 'BHEL Bhopal (MP)', destination: 'HLL Hyderabad (TG)', shipDate: '2026-07-27', transitDays: 1, zone: 'North', remarks: 'Re-doped W-Th rotating anode for HLL medical CT X-ray tube &#8594; 5% Re with 90% W 5% Th &#8594; &#8377;380Cr for 0.3 tonnes &#8594; India &#8377;11,400Cr medical Re &#8594; HLL 3000 CT &#8594; 3100&#176;C service &#8594; rotating &#85854; focal track' }
];

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const;
type Tab = typeof tabs[number];
const priorityColors: Record<string, string> = { Critical: 'bg-red-100 text-red-800', High: 'bg-amber-100 text-amber-800', Medium: 'bg-green-100 text-green-800', Low: 'bg-slate-100 text-slate-600' };
const delayedSet = new Set(rheniumAlloyRecords.filter(r => r.status === 'Delayed').map(r => r.id));

export default function RheniumAlloyLogisticsView() {
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const toggleFilter = (k: string, v: string) => { setFilters(p => { const s = { ...p }; const a = s[k] || []; const i = a.indexOf(v); if (i > -1) { a.splice(i, 1); if (!a.length) delete s[k]; } else s[k] = [...a, v]; return s; }); };
  const filtered = useMemo(() => {
    let d = rheniumAlloyRecords;
    if (search) { const q = search.toLowerCase(); d = d.filter(r => r.id.toLowerCase().includes(q) || r.batchNo.toLowerCase().includes(q) || r.alloyGrade.toLowerCase().includes(q) || r.application.toLowerCase().includes(q) || r.city.toLowerCase().includes(q) || r.manufacturer.toLowerCase().includes(q)); }
    Object.entries(filters).forEach(([k, vs]) => { if (vs.length) d = d.filter(r => { const v = String((r as unknown as Record<string, unknown>)[k] ?? ''); return vs.some(x => v.toLowerCase().includes(x.toLowerCase())); }); });
    return d;
  }, [search, filters]);
  const totalCr = filtered.reduce((s: number, r) => s + r.investmentCr, 0);
  const avgRe = filtered.length ? filtered.reduce((s: number, r) => s + r.rheniumPercent, 0) / filtered.length : 0;
  const delayedCount = filtered.filter(r => r.status === 'Delayed').length;

  return (
    <div className="space-y-6">
      <PageHeader title="Rhenium Alloy Logistics" description="Indian rhenium alloy supply chain tracking for aerospace turbine blades, rocket nozzles, petrochemical reforming, medical MRI and power generation sectors" />
      <div className="flex gap-2 border-b">
        {tabs.map(t => (<button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 text-sm font-medium ${activeTab === t ? 'border-b-2 border-orange-500 text-orange-700' : 'text-muted-foreground hover:text-foreground'}`}>{t}</button>))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-orange-600">{filtered.length}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-orange-600">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-orange-600">{avgRe.toFixed(1)}%</div><div className="text-xs text-muted-foreground">Avg Re Content</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-red-500">{delayedCount}</div><div className="text-xs text-muted-foreground">Delayed Shipments</div></CardContent></Card>
      </div>
      {(activeTab === 'Dashboard' || activeTab === 'Registry') && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <input placeholder="Search ID, grade, application, city..." value={search} onChange={e => setSearch(e.target.value)} className="border rounded-md px-3 py-1.5 text-sm flex-1 min-w-48" />
            {['status', 'priority', 'zone'].map(f => { const opts = [...new Set(rheniumAlloyRecords.map(r => (r as unknown as Record<string, unknown>)[f] as string))]; return (<div key={f} className="flex flex-wrap gap-1">{opts.map(o => (<Badge key={o} variant={(filters[f] || []).includes(o) ? 'default' : 'outline'} className="cursor-pointer text-xs" onClick={() => toggleFilter(f, o)}>{o}</Badge>))}</div>); })}
          </div>
          <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">Re%</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.alloyGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.rheniumPercent}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Analytics') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipments by Zone</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([z, c]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Aerospace and Space</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.application.toLowerCase().includes('aero') || r.application.toLowerCase().includes('turbine') || r.application.toLowerCase().includes('rocket') || r.application.toLowerCase().includes('space') || r.application.toLowerCase().includes('engine') || r.application.toLowerCase().includes('blade')).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.alloyGrade}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">By Priority</CardTitle></CardHeader><CardContent><div className="space-y-2">{Object.entries(filtered.reduce((m, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {} as Record<string, number>)).map(([p, c]) => (<div key={p} className="flex justify-between text-sm"><span className={priorityColors[p] || ''}>{p}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Re Content Distribution</CardTitle></CardHeader><CardContent><div className="space-y-2">{[{ l: 'Ultra-High (50%+)', f: filtered.filter(r => r.rheniumPercent >= 50).length }, { l: 'High (20-50%)', f: filtered.filter(r => r.rheniumPercent >= 20 && r.rheniumPercent < 50).length }, { l: 'Medium (5-20%)', f: filtered.filter(r => r.rheniumPercent >= 5 && r.rheniumPercent < 20).length }, { l: 'Trace (<5%)', f: filtered.filter(r => r.rheniumPercent < 5).length }].map(b => (<div key={b.l} className="flex justify-between text-sm"><span>{b.l}</span><span className="font-medium">{b.f}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Manufacturers</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([m, v]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Avg Transit Days</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.length ? (Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || [] as number[]).concat(r.transitDays); return m }, {} as Record<string, number[]>)) as [string, number[]][]).map(([z, d]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{(d.reduce((s, n) => s + n, 0) / d.length).toFixed(1)}d</span></div>)) : []}</div></CardContent></Card>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Insights') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardContent><div className="text-sm font-medium text-orange-600 mb-2">HAL Tejas Re-Ni Single Crystal Blade</div><div className="text-xs text-muted-foreground">HAL producing 123 Tejas Mk2 with Re-Ni 50/50 single crystal HPT blades replacing directionally solidified IN718. 50% Re addition increases creep life 4x at 1450&#176;C enabling higher TET for 15% thrust gain. MIDHANI and Gujarat Rhenium Tech co-developing domestic Re-Ni master alloy under &#8377;6,500Cr DRDO programme.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-orange-600 mb-2">ISRO Re Nozzle Throat CVD-Ir</div><div className="text-xs text-muted-foreground">ISRO qualifying LPBF 3D-printed Re rocket nozzle throat with CVD Ir liner for PSLV and GSLV upper stage engines. Re has 3180&#176;C melting point, highest of all metals. Gujarat Rhenium Tech supplying spherical Re powder. 60% weight reduction vs conventionally machined C103 niobium alloy nozzle extension.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-orange-600 mb-2">BPCL Re-Pt Naphtha Reformer</div><div className="text-xs text-muted-foreground">BPCL upgrading all 3 refineries with Re-Pt bimetallic reforming catalyst replacing mono-metallic Pt. Re stabilizes Pt dispersion at 540&#176;C extending catalyst life from 12 to 24 months. IGCAR developing indigenous Re-Pt catalyst synthesis from molybdenite Re recovery under &#8377;3,800Cr programme reducing South Africa import dependency.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-orange-600 mb-2">HLL MRI Re-Nb Superconductor</div><div className="text-xs text-muted-foreground">HLL expanding 3T MRI production to 5000 units annually requiring Re-doped Nb3Sn superconducting wire with 5% Re addition for 4.2K magnet operation. 5% Re increases upper critical field from 25T to 30T enabling more compact magnet design. NALCO developing Re-Nb alloy from Indian copper smelter anode slime recovery.</div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
"""

outpath = "/home/z/my-project/src/components/modules/rhenium-alloy-logistics-view.tsx"
with open(outpath, "w") as f:
    f.write(COMPONENT)
print(f"Written {outpath} ({len(COMPONENT)} bytes)")
