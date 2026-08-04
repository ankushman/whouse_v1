'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { ShieldAlert } from 'lucide-react';

interface AntimonyAlloyRecord {
  id: string;
  batchNo: string;
  city: string;
  manufacturer: string;
  alloyGrade: string;
  application: string;
  antimonyPercent: number;
  meltTempC: number;
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

const antimonyAlloyRecords: AntimonyAlloyRecord[] = [
  { id: 'ATA-0001', batchNo: 'ATA-B2401', city: 'Mumbai', manufacturer: 'Hindustan Lead', alloyGrade: 'Pb-Sb 6% Grid Alloy', application: 'Automotive Battery (Exide)', antimonyPercent: 6.0, meltTempC: 320, investmentCr: 280, status: 'Delivered', priority: 'Critical', origin: 'Hindustan Lead Mumbai (MH)', destination: 'Exide Kolkata (WB)', shipDate: '2026-07-15', transitDays: 2, zone: 'West', remarks: 'Pb-Sb 6% lead-antimony grid alloy for Exide automotive battery plates &#8594; 6% Sb with 94% Pb &#8594; &#8377;280Cr for 80 tonnes &#8594; India &#8377;8,400Cr battery Sb &#8594; Exide 20M batteries &#8594; 320&#176;C melt &#8594; gravity cast &#8594; IS 7472 spec' },
  { id: 'ATA-0002', batchNo: 'ATA-B2402', city: 'Bengaluru', manufacturer: 'MIDHANI', alloyGrade: 'Sn-Sb 5% Babbitt', application: 'Turbine Bearing (BHEL)', antimonyPercent: 5.0, meltTempC: 245, investmentCr: 320, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-16', transitDays: 1, zone: 'South', remarks: 'Sn-Sb 5% white metal Babbitt for BHEL 800MW steam turbine journal bearing &#8594; 5% Sb with Cu-Sn &#8594; &#8377;320Cr for 12 tonnes &#8594; India &#8377;9,600Cr power Sb &#8594; BHEL 42 turbines &#8594; 245&#176;C &#8594; centrifugal cast &#8594; ASTM B23' },
  { id: 'ATA-0003', batchNo: 'ATA-B2403', city: 'Chennai', manufacturer: 'DRDO DMRL', alloyGrade: 'Pb-Sb 3% Low-Maintenance', application: 'Submarine Battery (MDL)', antimonyPercent: 3.0, meltTempC: 310, investmentCr: 410, status: 'Delivered', priority: 'Critical', origin: 'DRDO NMRL Visakhapatnam (AP)', destination: 'MDL Mumbai (MH)', shipDate: '2026-07-17', transitDays: 2, zone: 'South', remarks: 'Pb-Sb 3% low-Sb valve-regulated battery for Scorpene submarine propulsion &#8594; 3% Sb with Ca-Sn &#8594; &#8377;410Cr for 25 tonnes &#8594; India &#8377;12,300Cr defence Sb &#8594; MDL 6 submarines &#8594; 310&#176;C &#8594; VRLA &#8594; mil-spec' },
  { id: 'ATA-0004', batchNo: 'ATA-B2404', city: 'Hyderabad', manufacturer: 'Bharat Electronics', alloyGrade: 'Sb2O3 99.5% Flame Retardant', application: 'Defence Equipment (BEL)', antimonyPercent: 83.5, meltTempC: 655, investmentCr: 185, status: 'Delivered', priority: 'High', origin: 'BEL Bengaluru (KA)', destination: 'BEL Ghaziabad (UP)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: 'Sb2O3 trioxide for BEL defence electronics FR plastic casings &#8594; 83.5% Sb as Sb2O3 &#8594; &#8377;185Cr for 8 tonnes &#8594; India &#8377;5,550Cr defence Sb &#8594; BEL 10K units &#8594; 655&#176;C sublimation &#8594; UL 94 V-0 &#8594; halogen-free' },
  { id: 'ATA-0005', batchNo: 'ATA-B2405', city: 'Kolkata', manufacturer: 'SAIL', alloyGrade: 'Pb-Sb 11% Hard', application: 'Cable Sheathing (Havells)', antimonyPercent: 11.0, meltTempC: 300, investmentCr: 195, status: 'Delivered', priority: 'Medium', origin: 'Hindustan Lead Kolkata (WB)', destination: 'Havells Noida (UP)', shipDate: '2026-07-19', transitDays: 2, zone: 'East', remarks: 'Pb-Sb 11% hard lead alloy for Havells power cable sheathing &#8594; 11% Sb with Pb &#8594; &#8377;195Cr for 40 tonnes &#8594; India &#8377;5,850Cr cable Sb &#8594; Havells 5M cables &#8594; 300&#176;C &#8594; extruded &#8594; IS 8390' },
  { id: 'ATA-0006', batchNo: 'ATA-B2406', city: 'Pune', manufacturer: 'Tata Advanced Materials', alloyGrade: 'Sn-Sb 8% Hard Solder', application: 'Electronics Solder (Dixon Tech)', antimonyPercent: 8.0, meltTempC: 245, investmentCr: 220, status: 'Delivered', priority: 'High', origin: 'TAM Bengaluru (KA)', destination: 'Dixon Noida (UP)', shipDate: '2026-07-20', transitDays: 2, zone: 'West', remarks: 'Sn-Sb 8% hard solder alloy for Dixon LED TV SMT wave soldering &#8594; 8% Sb with Sn &#8594; &#8377;220Cr for 6 tonnes &#8594; India &#8377;6,600Cr solder Sb &#8594; Dixon 10M TVs &#8594; 245&#176;C &#8594; no-Pb alternative &#8594; J-STD-006' },
  { id: 'ATA-0007', batchNo: 'ATA-B2407', city: 'Ahmedabad', manufacturer: 'Gujarat Antimony', alloyGrade: 'Sb 99.65% Regulus', application: 'PET Catalyst (Reliance)', antimonyPercent: 99.65, meltTempC: 630, investmentCr: 350, status: 'Delivered', priority: 'Critical', origin: 'Gujarat Antimony Vadodara (GJ)', destination: 'Reliance Hazira (GJ)', shipDate: '2026-07-21', transitDays: 1, zone: 'West', remarks: 'Pure antimony regulus for Reliance PET polymerisation catalyst &#8594; 99.65% Sb &#8594; &#8377;350Cr for 10 tonnes &#8594; India &#8377;10,500Cr petrochem Sb &#8594; Reliance 5 MTPA PET &#8594; 630&#176;C &#8594; Sb2O3 glycol &#8594; 200 mesh' },
  { id: 'ATA-0008', batchNo: 'ATA-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Antimony', alloyGrade: 'Pb-Sb 2% Low-Sb Battery', application: 'Inverter Battery (Luminous)', antimonyPercent: 2.0, meltTempC: 315, investmentCr: 145, status: 'Delivered', priority: 'Medium', origin: 'Rajasthan Antimony Jaipur (RJ)', destination: 'Luminous Noida (UP)', shipDate: '2026-07-22', transitDays: 2, zone: 'North', remarks: 'Pb-Sb 2% deep-cycle inverter battery for Luminous home UPS &#8594; 2% Sb with Ca-Pb &#8594; &#8377;145Cr for 50 tonnes &#8594; India &#8377;4,350Cr battery Sb &#8594; Luminous 8M inverters &#8594; 315&#176;C &#8594; flat plate &#8594; IS 13369' },
  { id: 'ATA-0009', batchNo: 'ATA-B2409', city: 'Coimbatore', manufacturer: 'Tamil Nadu Antimony', alloyGrade: 'Sn-Sb-Cu 4-4-0.5 Babbit', application: 'Marine Engine (Cochin Shipyard)', antimonyPercent: 4.0, meltTempC: 240, investmentCr: 280, status: 'Delivered', priority: 'High', origin: 'Tamil Nadu Antimony Hosur (TN)', destination: 'Cochin Shipyard (KL)', shipDate: '2026-07-23', transitDays: 1, zone: 'South', remarks: 'SAE Grade 11 Babbitt for Cochin Shipyard marine diesel engine main bearing &#8594; 4% Sb with Sn-Cu &#8594; &#8377;280Cr for 8 tonnes &#8594; India &#8377;8,400Cr marine Sb &#8594; Cochin 200 ships &#8594; 240&#176;C &#8594; chill cast &#8594; SAE 11' },
  { id: 'ATA-0010', batchNo: 'ATA-B2410', city: 'Bhubaneswar', manufacturer: 'NALCO', alloyGrade: 'Sb2S3 98% Stibnite', application: 'Safety Match (Wimco)', antimonyPercent: 71.4, meltTempC: 550, investmentCr: 95, status: 'Delivered', priority: 'Low', origin: 'NALCO Bhubaneswar (OD)', destination: 'Wimco Chennai (TN)', shipDate: '2026-07-24', transitDays: 2, zone: 'East', remarks: 'Stibnite antimony trisulfide for Wimco safety match head composition &#8594; 71.4% Sb as Sb2S3 &#8594; &#8377;95Cr for 5 tonnes &#8594; India &#8377;2,850Cr match Sb &#8594; Wimco 500M matches &#8594; 550&#176;C &#8594; friction &#8594; IS 1838' },
  { id: 'ATA-0011', batchNo: 'ATA-B2411', city: 'Guwahati', manufacturer: 'Assam Antimony', alloyGrade: 'Pb-Sb 9% Semi-Hard', application: 'Bullet Projectile (OFB)', antimonyPercent: 9.0, meltTempC: 305, investmentCr: 265, status: 'Delivered', priority: 'High', origin: 'Assam Antimony Guwahati (AS)', destination: 'OFB Bhopal (MP)', shipDate: '2026-07-25', transitDays: 4, zone: 'East', remarks: 'Pb-Sb 9% bullet core alloy for OFB small arms ammunition &#8594; 9% Sb with Pb &#8594; &#8377;265Cr for 15 tonnes &#8594; India &#8377;7,950Cr defence Sb &#8594; OFB 500M rounds &#8594; 305&#176;C &#8594; extruded &#8594; mil-spec' },
  { id: 'ATA-0012', batchNo: 'ATA-B2412', city: 'Surat', manufacturer: 'Gujarat Antimony Tech', alloyGrade: 'Sb2O3 99.9% Nano Grade', application: 'Solar Glass (Vikram Solar)', antimonyPercent: 83.5, meltTempC: 655, investmentCr: 210, status: 'Delayed', priority: 'High', origin: 'Gujarat Antimony Tech Surat (GJ)', destination: 'Vikram Solar Kolkata (WB)', shipDate: '2026-07-01', transitDays: 22, zone: 'West', remarks: 'Nano-Sb2O3 opacifier for Vikram Solar tempered glass &#8594; 83.5% Sb as nano Sb2O3 &#8594; &#8377;210Cr for 6 tonnes &#8594; monsoon delay &#8594; India &#8377;6,300Cr solar Sb &#8594; Vikram 5 GW &#8594; 655&#176;C &#8594; 100nm &#8594; float glass' },
  { id: 'ATA-0013', batchNo: 'ATA-B2413', city: 'Noida', manufacturer: 'UP Antimony', alloyGrade: 'In-Sb 5% Thermoelectric', application: 'IR Detector (BEL)', antimonyPercent: 5.0, meltTempC: 525, investmentCr: 480, status: 'Delivered', priority: 'Critical', origin: 'UP Antimony Noida (UP)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-26', transitDays: 2, zone: 'North', remarks: 'In-Sb 5% single crystal for BEL infrared seeker focal plane array &#8594; 5% Sb with In &#8594; &#8377;480Cr for 200 kg &#8594; India &#8377;14,400Cr defence Sb &#8594; BEL 1000 seekers &#8594; 525&#176;C &#8594; CZ grown &#8594; 3-5um IR band' },
  { id: 'ATA-0014', batchNo: 'ATA-B2414', city: 'Bhopal', manufacturer: 'BHEL', alloyGrade: 'Pb-Sb 7% Cable Sheath', application: 'Power Cable (KEC)', antimonyPercent: 7.0, meltTempC: 308, investmentCr: 165, status: 'Delivered', priority: 'Medium', origin: 'BHEL Bhopal (MP)', destination: 'KEC Jaipur (RJ)', shipDate: '2026-07-27', transitDays: 2, zone: 'North', remarks: 'Pb-Sb 7% sheathing alloy for KEC EHV power cable armouring &#8594; 7% Sb with Pb &#8594; &#8377;165Cr for 35 tonnes &#8594; India &#8377;4,950Cr cable Sb &#8594; KEC 10K km &#8594; 308&#176;C &#8594; extruded &#8594; IS 7098' }
];

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const;
type Tab = typeof tabs[number];
const priorityColors: Record<string, string> = { Critical: 'bg-red-100 text-red-800', High: 'bg-amber-100 text-amber-800', Medium: 'bg-green-100 text-green-800', Low: 'bg-slate-100 text-slate-600' };
const delayedSet = new Set(antimonyAlloyRecords.filter(r => r.status === 'Delayed').map(r => r.id));

export default function AntimonyAlloyLogisticsView() {
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const toggleFilter = (k: string, v: string) => { setFilters(p => { const s = { ...p }; const a = s[k] || []; const i = a.indexOf(v); if (i > -1) { a.splice(i, 1); if (!a.length) delete s[k]; } else s[k] = [...a, v]; return s; }); };
  const filtered = useMemo(() => {
    let d = antimonyAlloyRecords;
    if (search) { const q = search.toLowerCase(); d = d.filter(r => r.id.toLowerCase().includes(q) || r.batchNo.toLowerCase().includes(q) || r.alloyGrade.toLowerCase().includes(q) || r.application.toLowerCase().includes(q) || r.city.toLowerCase().includes(q) || r.manufacturer.toLowerCase().includes(q)); }
    Object.entries(filters).forEach(([k, vs]) => { if (vs.length) d = d.filter(r => { const v = String((r as unknown as Record<string, unknown>)[k] ?? ''); return vs.some(x => v.toLowerCase().includes(x.toLowerCase())); }); });
    return d;
  }, [search, filters]);
  const totalCr = filtered.reduce((s: number, r) => s + r.investmentCr, 0);
  const avgSb = filtered.length ? filtered.reduce((s: number, r) => s + r.antimonyPercent, 0) / filtered.length : 0;
  const delayedCount = filtered.filter(r => r.status === 'Delayed').length;

  return (
    <div className="space-y-6">
      <PageHeader title="Antimony Alloy Logistics" description="Indian antimony alloy supply chain tracking for batteries, bearings, flame retardants, solders and defence applications" />
      <div className="flex gap-2 border-b">
        {tabs.map(t => (<button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 text-sm font-medium ${activeTab === t ? 'border-b-2 border-violet-500 text-violet-700' : 'text-muted-foreground hover:text-foreground'}`}>{t}</button>))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent><div className="text-2xl font-bold text-violet-600">{filtered.length}</div><div className="text-xs text-muted-foreground">Total Shipments</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-violet-600">&#8377;{totalCr.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground">Total Investment</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-violet-600">{avgSb.toFixed(1)}%</div><div className="text-xs text-muted-foreground">Avg Sb Content</div></CardContent></Card>
        <Card><CardContent><div className="text-2xl font-bold text-red-500">{delayedCount}</div><div className="text-xs text-muted-foreground">Delayed Shipments</div></CardContent></Card>
      </div>
      {(activeTab === 'Dashboard' || activeTab === 'Registry') && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <input placeholder="Search ID, grade, application, city..." value={search} onChange={e => setSearch(e.target.value)} className="border rounded-md px-3 py-1.5 text-sm flex-1 min-w-48" />
            {['status', 'priority', 'zone'].map(f => { const opts = [...new Set(antimonyAlloyRecords.map(r => (r as unknown as Record<string, unknown>)[f] as string))]; return (<div key={f} className="flex flex-wrap gap-1">{opts.map(o => (<Badge key={o} variant={(filters[f] || []).includes(o) ? 'default' : 'outline'} className="cursor-pointer text-xs" onClick={() => toggleFilter(f, o)}>{o}</Badge>))}</div>); })}
          </div>
          <div className="rounded-md border"><div className="max-h-96 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background"><tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Batch</th><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Application</th><th className="p-2 text-right">Sb%</th><th className="p-2 text-right">&#8377;Cr</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{filtered.map(r => (<tr key={r.id} className={`border-t ${delayedSet.has(r.id) ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}><td className="p-2">{r.id}</td><td className="p-2">{r.batchNo}</td><td className="p-2">{r.alloyGrade}</td><td className="p-2">{r.application}</td><td className="p-2 text-right">{r.antimonyPercent}</td><td className="p-2 text-right">{r.investmentCr}</td><td className="p-2"><Badge variant={r.status === 'Delivered' ? 'default' : 'destructive'}>{r.status}</Badge></td></tr>))}</tbody></table></div></div>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Analytics') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Investment by Application</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.application] = (m[r.application] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([a, v]) => (<div key={a} className="flex justify-between text-sm"><span>{a}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Shipments by Zone</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || 0) + 1; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([z, c]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Routes by Value</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 7).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.origin.split('(')[0]} &#8594; {r.destination.split('(')[0]}</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Defence Grade Alloys</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.filter(r => r.application.toLowerCase().includes('defence') || r.application.toLowerCase().includes('submarine') || r.application.toLowerCase().includes('bullet') || r.application.toLowerCase().includes('seeker') || r.application.toLowerCase().includes('ir detector')).sort((a, b) => b.investmentCr - a.investmentCr).map(r => (<div key={r.id} className="flex justify-between text-sm"><span>{r.alloyGrade} ({r.meltTempC}&#176;C)</span><span className="font-medium">&#8377;{r.investmentCr}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">By Priority</CardTitle></CardHeader><CardContent><div className="space-y-2">{Object.entries(filtered.reduce((m, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {} as Record<string, number>)).map(([p, c]) => (<div key={p} className="flex justify-between text-sm"><span className={priorityColors[p] || ''}>{p}</span><span className="font-medium">{c}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Sb Content Distribution</CardTitle></CardHeader><CardContent><div className="space-y-2">{[{ l: 'Pure/Compound (70%+)', f: filtered.filter(r => r.antimonyPercent >= 70).length }, { l: 'Medium Alloy (5-15%)', f: filtered.filter(r => r.antimonyPercent >= 5 && r.antimonyPercent < 70).length }, { l: 'Low Alloy (2-5%)', f: filtered.filter(r => r.antimonyPercent >= 2 && r.antimonyPercent < 5).length }, { l: 'Trace (<2%)', f: filtered.filter(r => r.antimonyPercent < 2).length }].map(b => (<div key={b.l} className="flex justify-between text-sm"><span>{b.l}</span><span className="font-medium">{b.f}</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Top Manufacturers</CardTitle></CardHeader><CardContent><div className="space-y-2">{(Object.entries(filtered.reduce((m, r) => { m[r.manufacturer] = (m[r.manufacturer] || 0) + r.investmentCr; return m }, {} as Record<string, number>)) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([m, v]) => (<div key={m} className="flex justify-between text-sm"><span>{m}</span><span className="font-medium">&#8377;{v}Cr</span></div>))}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Avg Transit Days</CardTitle></CardHeader><CardContent><div className="space-y-2">{filtered.length ? (Object.entries(filtered.reduce((m, r) => { m[r.zone] = (m[r.zone] || [] as number[]).concat(r.transitDays); return m }, {} as Record<string, number[]>)) as [string, number[]][]).map(([z, d]) => (<div key={z} className="flex justify-between text-sm"><span>{z}</span><span className="font-medium">{(d.reduce((s, n) => s + n, 0) / d.length).toFixed(1)}d</span></div>)) : []}</div></CardContent></Card>
        </div>
      )}
      {(activeTab === 'Dashboard' || activeTab === 'Insights') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardContent><div className="text-sm font-medium text-violet-600 mb-2">Pb-Sb Battery Alloy Transition</div><div className="text-xs text-muted-foreground">India automotive battery industry consuming 15,000 TPA Pb-Sb alloy. Exide and Amara Raja transitioning from 6-11% Sb to 2-3% low-Sb calcium-maintenance-free batteries. Gujarat Antimony expanding regulus production to 500 TPA pure Sb. India targeting &#8377;18,000Cr battery alloy market by 2030.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-violet-600 mb-2">BEL In-Sb IR Seeker Programme</div><div className="text-xs text-muted-foreground">BEL developing indigenous In-Sb single-crystal focal plane arrays for Astra BVR air-to-air missile seeker. Currently importing 95% In-Sb crystal from US and Israel. UP Antimony commissioning 2 TPA In-Sb CZ growth facility at Noida with DRDO funding of &#8377;850Cr.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-violet-600 mb-2">Sb2O3 Flame Retardant Demand</div><div className="text-xs text-muted-foreground">India electronics and defence equipment FR market requiring 8,000 TPA Sb2O3. BEL, Havells and Dixon major consumers. Gujarat Antimony Tech scaling nano-Sb2O3 for solar PV glass opacifier. Nano grade achieving 50% better dispersion vs bulk at same loading level.</div></CardContent></Card>
          <Card><CardContent><div className="text-sm font-medium text-violet-600 mb-2">Babbitt Bearing Supply Chain</div><div className="text-xs text-muted-foreground">BHEL, Cochin Shipyard and Wipro Aero consuming 2,500 TPA tin-antimony Babbitt for steam turbine, marine diesel and aero-engine bearings. Tamil Nadu Antimony and MIDHANI primary suppliers. SAE 11 and ASTM B23 specifications critical for 30-year turbine bearing life.</div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
