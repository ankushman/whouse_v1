'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Snowflake } from 'lucide-react';

interface RareEarthOxideRecord {
  id: string;
  batchNo: string;
  city: string;
  manufacturer: string;
  oxideGrade: string;
  application: string;
  reoPercent: number;
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

const rareEarthOxideRecords: RareEarthOxideRecord[] = [
  { id: 'REO-0001', batchNo: 'REO-B2401', city: 'Mumbai', manufacturer: 'IREL', oxideGrade: 'Nd2O3 99.9% Magnet', application: 'Permanent Magnet Motor (Tata Motors)', reoPercent: 99.9, particleSizeUm: 5, investmentCr: 620, status: 'Delivered', priority: 'Critical', origin: 'IREL Mumbai (MH)', destination: 'Tata Motors Pune (MH)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: 'Neodymium oxide for Tata Motors Nexon EV BLDC motor NdFeB magnet &#8594; 99.9% Nd2O3 &#8594; &#8377;620Cr for 20 tonnes &#8594; India &#8377;18,600Cr EV REO &#8594; Tata 500K EVs &#8594; 5 um PSD &#8594; 1.4T magnet &#8594; sintered' },
  { id: 'REO-0002', batchNo: 'REO-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', oxideGrade: 'Y2O3 99.99% YSZ', application: 'Turbine Thermal Barrier (HAL)', reoPercent: 99.99, particleSizeUm: 1, investmentCr: 480, status: 'Delivered', priority: 'Critical', origin: 'DRDO DMRL Hyderabad (TG)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 1, zone: 'South', remarks: 'Yttria-stabilized zirconia for HAL Tejas Mk2 HPT blade EB-PVD coating &#8594; 99.99% Y2O3 &#8594; &#8377;480Cr for 3 tonnes &#8594; India &#8377;14,400Cr aero REO &#8594; HAL 123 Tejas &#8594; 1 um nano &#8594; 7-8YSZ &#8594; TBC' },
  { id: 'REO-0003', batchNo: 'REO-B2403', city: 'Chennai', manufacturer: 'IGCAR', oxideGrade: 'CeO2 99.9% Polish', application: 'Windshield Polish (Saint-Gobain)', reoPercent: 99.9, particleSizeUm: 0.5, investmentCr: 195, status: 'Delivered', priority: 'Medium', origin: 'IGCAR Kalpakkam (TN)', destination: 'Saint-Gobain Chennai (TN)', shipDate: '2026-07-17', transitDays: 1, zone: 'South', remarks: 'Cerium oxide nano-polish for Saint-Gobain automotive windshield CMP &#8594; 99.9% CeO2 &#8594; &#8377;195Cr for 4 tonnes &#8594; India &#8377;5,850Cr auto REO &#8594; Saint-Gobain 10M windshields &#8594; 0.5 um nano &#8594; colloidal &#8594; CMP' },
  { id: 'REO-0004', batchNo: 'REO-B2404', city: 'Hyderabad', manufacturer: 'MIDHANI', oxideGrade: 'La2O3 99.9% Optical', application: 'Camera Lens Glass (Carl Zeiss)', reoPercent: 99.9, particleSizeUm: 10, investmentCr: 310, status: 'Delivered', priority: 'High', origin: 'MIDHANI Hyderabad (TG)', destination: 'Carl Zeiss Bengaluru (KA)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: 'Lanthanum oxide for Carl Zeiss high-index camera lens glass &#8594; 99.9% La2O3 &#8594; &#8377;310Cr for 2 tonnes &#8594; India &#8377;9,300Cr optics REO &#8594; Zeiss 20M lenses &#8594; 10 um PSD &#8594; n=1.85 &#8594; flint glass' },
  { id: 'REO-0005', batchNo: 'REO-B2405', city: 'Pune', manufacturer: 'Bharat Forge', oxideGrade: 'Pr6O11 99.9% Pigment', application: 'Ceramic Glaze (Kajaria Ceramics)', reoPercent: 99.9, particleSizeUm: 3, investmentCr: 145, status: 'Delivered', priority: 'Medium', origin: 'Bharat Forge Pune (MH)', destination: 'Kajaria Ceramics Noida (UP)', shipDate: '2026-07-19', transitDays: 2, zone: 'West', remarks: 'Praseodymium oxide pigment for Kajaria premium ceramic tile glaze &#8594; 99.9% Pr6O11 &#8594; &#8377;145Cr for 1 tonne &#8594; India &#8377;4,350Cr ceramic REO &#8594; Kajaria 100M m2 tiles &#8594; 3 um PSD &#8594; yellow pigment &#8594; zircon glaze' },
  { id: 'REO-0006', batchNo: 'REO-B2406', city: 'Ahmedabad', manufacturer: 'Gujarat RE Oxides', oxideGrade: 'Dy2O3 99.99% Magnet', application: 'High-Temp NdFeB (BHEL)', reoPercent: 99.99, particleSizeUm: 2, investmentCr: 560, status: 'Delivered', priority: 'Critical', origin: 'Gujarat RE Oxides Ahmedabad (GJ)', destination: 'BHEL Bhopal (MP)', shipDate: '2026-07-20', transitDays: 1, zone: 'West', remarks: 'Dysprosium oxide for BHEL 800 MW wind turbine generator Dy-NdFeB magnet &#8594; 99.99% Dy2O3 &#8594; &#8377;560Cr for 0.5 tonnes &#8594; India &#8377;16,800Cr wind REO &#8594; BHEL 5 GW wind &#8594; 2 um PSD &#8594; coercivity boost &#8594; 200&#176;C' },
  { id: 'REO-0007', batchNo: 'REO-B2407', city: 'Jaipur', manufacturer: 'Rajasthan Rare Earth', oxideGrade: 'Eu2O3 99.99% Phosphor', application: 'LED Phosphor (Dixon LED)', reoPercent: 99.99, particleSizeUm: 3, investmentCr: 420, status: 'Delivered', priority: 'High', origin: 'Rajasthan Rare Earth Jaipur (RJ)', destination: 'Dixon LED Noida (UP)', shipDate: '2026-07-21', transitDays: 2, zone: 'North', remarks: 'Europium oxide for Dixon high-CRI LED red phosphor YAG:Ce+Eu &#8594; 99.99% Eu2O3 &#8594; &#8377;420Cr for 0.2 tonnes &#8594; India &#8377;12,600Cr LED REO &#8594; Dixon 500M LEDs &#8594; 3 um PSD &#8594; 611 nm emission &#8594; warm white' },
  { id: 'REO-0008', batchNo: 'REO-B2408', city: 'Coimbatore', manufacturer: 'Tamil Nadu Rare Earth', oxideGrade: 'Sm2O3 99.9% Capacitor', application: 'MLCC Dielectric (Murata)', reoPercent: 99.9, particleSizeUm: 0.8, investmentCr: 385, status: 'Delivered', priority: 'High', origin: 'Tamil Nadu Rare Earth Hosur (TN)', destination: 'Murata Bengaluru (KA)', shipDate: '2026-07-22', transitDays: 1, zone: 'South', remarks: 'Samarium oxide for Murata multilayer ceramic capacitor Class II dielectric &#8594; 99.9% Sm2O3 &#8594; &#8377;385Cr for 1.5 tonnes &#8594; India &#8377;11,550Cr electronic REO &#8594; Murata 10B MLCC &#8594; 0.8 um nano &#8594; X7R &#8594; dielectric' },
  { id: 'REO-0009', batchNo: 'REO-B2409', city: 'Bhubaneswar', manufacturer: 'NALCO', oxideGrade: 'Nd2O3 99.5% Battery', application: 'Nd-Fe-B Battery (Exicom)', reoPercent: 99.5, particleSizeUm: 8, investmentCr: 290, status: 'Delivered', priority: 'Medium', origin: 'NALCO Bhubaneswar (OD)', destination: 'Exicom Gurgaon (HR)', shipDate: '2026-07-23', transitDays: 3, zone: 'East', remarks: 'Neodymium oxide for Exicom EV battery thermal management NdFeB pump magnet &#8594; 99.5% Nd2O3 &#8594; &#8377;290Cr for 5 tonnes &#8594; India &#8377;8,700Cr battery REO &#8594; Exicom 500K BMS &#8594; 8 um PSD &#8594; 1.2T &#8594; bonded' },
  { id: 'REO-0010', batchNo: 'REO-B2410', city: 'Guwahati', manufacturer: 'Assam Rare Earth Metals', oxideGrade: 'Gd2O3 99.99% MRI', application: 'MRI Contrast Agent (HLL)', reoPercent: 99.99, particleSizeUm: 20, investmentCr: 510, status: 'Delivered', priority: 'High', origin: 'Assam Rare Earth Metals Guwahati (AS)', destination: 'HLL Hyderabad (TG)', shipDate: '2026-07-24', transitDays: 4, zone: 'East', remarks: 'Gadolinium oxide for HLL 3T MRI Gd-DTPA contrast agent chelation &#8594; 99.99% Gd2O3 &#8594; &#8377;510Cr for 0.3 tonnes &#8594; India &#8377;15,300Cr medical REO &#8594; HLL 5000 MRI &#8594; 20 um PSD &#8594; T1 relaxivity &#8594; chelate' },
  { id: 'REO-0011', batchNo: 'REO-B2411', city: 'Surat', manufacturer: 'Gujarat RE Products', oxideGrade: 'Tb4O7 99.99% Green Phosphor', application: 'OLED Display (Dixon OLED)', reoPercent: 99.99, particleSizeUm: 2, investmentCr: 470, status: 'Delivered', priority: 'High', origin: 'Gujarat RE Products Surat (GJ)', destination: 'Dixon OLED Noida (UP)', shipDate: '2026-07-25', transitDays: 2, zone: 'West', remarks: 'Terbium oxide for Dixon OLED green phosphor high-efficiency emitter &#8594; 99.99% Tb4O7 &#8594; &#8377;470Cr for 0.1 tonnes &#8594; India &#8377;14,100Cr display REO &#8594; Dixon 30M OLED &#8594; 2 um PSD &#8594; 545 nm &#8594; phosphor' },
  { id: 'REO-0012', batchNo: 'REO-B2412', city: 'Lucknow', manufacturer: 'UP Rare Earth Industries', oxideGrade: 'Er2O3 99.99% Fiber', application: 'Fiber Amplifier (RailTel)', reoPercent: 99.99, particleSizeUm: 10, investmentCr: 340, status: 'Delayed', priority: 'High', origin: 'UP Rare Earth Industries Lucknow (UP)', destination: 'RailTel New Delhi (DL)', shipDate: '2026-07-02', transitDays: 26, zone: 'North', remarks: 'Erbium oxide for RailTel EDFA optical fiber amplifier C-band 1550nm &#8594; 99.99% Er2O3 &#8594; &#8377;340Cr for 0.5 tonnes &#8594; monsoon delay &#8594; India &#8377;10,200Cr telecom REO &#8594; RailTel 60K km &#8594; 10 um PSD &#8594; C-band &#8594; EDFA' },
  { id: 'REO-0013', batchNo: 'REO-B2413', city: 'Noida', manufacturer: 'SAIL', oxideGrade: 'Yb2O3 99.99% Laser', application: 'Fiber Laser Cutter (Jindal Steel)', reoPercent: 99.99, particleSizeUm: 3, investmentCr: 445, status: 'Delivered', priority: 'High', origin: 'SAIL Rourkela (OD)', destination: 'Jindal Steel Raipur (CG)', shipDate: '2026-07-26', transitDays: 2, zone: 'North', remarks: 'Ytterbium oxide for Jindal Steel 20 kW fiber laser steel plate cutter &#8594; 99.99% Yb2O3 &#8594; &#8377;445Cr for 0.3 tonnes &#8594; India &#8377;13,350Cr industrial REO &#8594; Jindal 50 laser &#8594; 3 um PSD &#8594; 1064 nm &#8594; doped fiber' },
  { id: 'REO-0014', batchNo: 'REO-B2414', city: 'Bhopal', manufacturer: 'BHEL', oxideGrade: 'Sc2O3 99.99% Fuel Cell', application: 'SOFC Electrolyte (BHEL)', reoPercent: 99.99, particleSizeUm: 1, investmentCr: 720, status: 'Delivered', priority: 'Critical', origin: 'BHEL Bhopal (MP)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-27', transitDays: 1, zone: 'North', remarks: 'Scandia-stabilized zirconia for BHEL 5 kW solid oxide fuel cell electrolyte &#8594; 99.99% Sc2O3 &#8594; &#8377;720Cr for 0.5 tonnes &#8594; India &#8377;21,600Cr energy REO &#8594; BHEL 100 MW SOFC &#8594; 1 um nano &#8594; 10ScSZ &#8594; ionic conductor' }
];

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const;
type Tab = typeof tabs[number];
const priorityColors: Record<string, string> = { Critical: 'bg-red-100 text-red-800', High: 'bg-amber-100 text-amber-800', Medium: 'bg-green-100 text-green-800', Low: 'bg-slate-100 text-slate-600' };
const delayedSet = new Set(rareEarthOxideRecords.filter(r => r.status === 'Delayed').map(r => r.id));

export default function RareEarthOxideLogisticsView() {
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const toggleFilter = (k: string, v: string) => { setFilters(p => { const s = { ...p }; const a = s[k] || []; const i = a.indexOf(v); if (i > -1) { a.splice(i, 1); if (!a.length) delete s[k]; } else s[k] = [...a, v]; return s; }); };
  const filtered = useMemo(() => {
    let d = rareEarthOxideRecords;
    if (search) { const q = search.toLowerCase(); d = d.filter(r => r.id.toLowerCase().includes(q) || r.batchNo.toLowerCase().includes(q) || r.oxideGrade.toLowerCase().includes(q) || r.application.toLowerCase().includes(q) || r.city.toLowerCase().includes(q) || r.manufacturer.toLowerCase().includes(q)); }
    Object.entries(filters).forEach(([k, vs]) => { if (vs.length) d = d.filter(r => { const v = String((r as unknown as Record<string, unknown>)[k] ?? ''); return vs.some(x => v.toLowerCase().includes(x.toLowerCase())); }); });
    return d;
  }, [search, filters]);
  const totalCr = filtered.reduce((s: number, r) => s + r.investmentCr, 0);
  const avgReo = filtered.length ? filtered.reduce((s: number, r) => s + r.reoPercent, 0) / filtered.length : 0;
  const delayedCount = filtered.filter(r => r.status === 'Delayed').length;

  return (
    <div className="space-y-6">
      <PageHeader title="Rare Earth Oxide Logistics" description="Indian rare earth oxide supply chain tracking for EV magnets, aerospace thermal barrier, LED phosphor, MRI contrast and fiber laser sectors" />
      <div className="flex gap-2 border-b">
        {tabs.map(t => (<button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 text-sm font-medium ${activeTab === t ? 'border-b-2 border-lime-500 text-lime-700' : 'text-muted-foreground hover:text-foreground'}`}>{t}</button>))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-lime-600">{filtered.length}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-lime-600">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-lime-600">{avgReo.toFixed(2)}%</div><div className="text-xs text-muted-foreground">Avg REO Purity</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-red-500">{delayedCount}</div><div className="text-xs text-muted-foreground">Delayed Shipments</div></CardContent></Card>
      </div>
      {(activeTab === 'Dashboard' || activeTab === 'Registry') && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <input placeholder="Search ID, grade, application, city..." value={search} onChange={e => setSearch(e.target.value)} className="border rounded-md px-3 py-1.5 text-sm flex-1 min-w-48" />
            {['status', 'priority', 'zone'].map(f => { const opts = [...new Set(rareEarthOxideRecords.map(r => (r as unknown as Record<string, unknown>)[f] as string))]; return (<div key={f} className="flex flex-wrap gap-1">{opts.map(o => (<Badge key={o} variant={(filters[f] || []).includes(o) ? 'default' : 'outline'} className="cursor-pointer text-xs" onClick={() => toggleFilter(f, o)}>{o}</Badge>))}</div>); })}
          </div>
          <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">REO%</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.oxideGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.reoPercent}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Analytics') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipments by Zone</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([z, c]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">EV and Clean Energy</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.application.toLowerCase().includes('ev') || r.application.toLowerCase().includes('motor') || r.application.toLowerCase().includes('wind') || r.application.toLowerCase().includes('fuel cell') || r.application.toLowerCase().includes('magnet')).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.oxideGrade}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">By Priority</CardTitle></CardHeader><CardContent><div className="space-y-2">{Object.entries(filtered.reduce((m, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {} as Record<string, number>)).map(([p, c]) => (<div key={p} className="flex justify-between text-sm"><span className={priorityColors[p] || ''}>{p}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">REO Purity Distribution</CardTitle></CardHeader><CardContent><div className="space-y-2">{[{ l: 'Ultra-Pure (99.99%+)', f: filtered.filter(r => r.reoPercent >= 99.99).length }, { l: 'High (99.9-99.99%)', f: filtered.filter(r => r.reoPercent >= 99.9 && r.reoPercent < 99.99).length }, { l: 'Standard (99.5-99.9%)', f: filtered.filter(r => r.reoPercent >= 99.5 && r.reoPercent < 99.9).length }, { l: 'Lower (<99.5%)', f: filtered.filter(r => r.reoPercent < 99.5).length }].map(b => (<div key={b.l} className="flex justify-between text-sm"><span>{b.l}</span><span className="font-medium">{b.f}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Manufacturers</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([m, v]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Avg Transit Days</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.length ? (Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || [] as number[]).concat(r.transitDays); return m }, {} as Record<string, number[]>)) as [string, number[]][]).map(([z, d]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{(d.reduce((s, n) => s + n, 0) / d.length).toFixed(1)}d</span></div>)) : []}</div></CardContent></Card>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Insights') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardContent><div className="text-sm font-medium text-lime-600 mb-2">Tata EV NdFeB Magnet Demand</div><div className="text-xs text-muted-foreground">Tata Motors expanding Nexon EV and Curvv EV production to 500K units annually requiring 200 tonnes of Nd2O3 for NdFeB BLDC motor magnets. India currently imports 95% of Nd2O3 from China. IREL scaling monazite processing at Chavara Kerala to 10 TPA Nd oxide under &#8377;4,200Cr critical minerals mission targeting 30% domestic supply by 2028.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-lime-600 mb-2">HAL Tejas YSZ Thermal Barrier</div><div className="text-xs text-muted-foreground">HAL adopting 7-8YSZ EB-PVD thermal barrier coating for Tejas Mk2 HPT blades increasing service temperature by 150&#176;C. DRDO DMRL developing 10ScSZ next-gen coating with scandia additive for 200&#176;C improvement. BHEL SOFC division supplying Sc2O3 from indigenous monazite. India allocating &#8377;8,500Cr for aero TBC research under iDEX.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-lime-600 mb-2">BHEL Wind Turbine Dy-NdFeB</div><div className="text-xs text-muted-foreground">BHEL commissioning 5 GW of direct-drive wind turbines using Dy-added NdFeB permanent magnets for 200&#176;C demagnetization resistance. Gujarat RE Oxides supplying Dy2O3 from beach sand processing at Chavara and Manavalakurichi. Each MW requires 0.6 tonnes of Nd-Fe-B with 3-5% Dy addition. India wind capacity targeting 140 GW by 2030.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-lime-600 mb-2">HLL MRI Gd Contrast Agent</div><div className="text-xs text-muted-foreground">HLL scaling Gd-DTPA contrast agent production for 3T MRI systems deployed at 5000+ government hospitals. Gd2O3 imported 90% from China. Assam Rare Earth Metals developing ion-exchange purification from indigenous bastnasite concentrate. India medical imaging market projected &#8377;25,000Cr by 2028 with Gd agent demand at 15 TPA.</div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
