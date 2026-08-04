"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Wrench } from 'lucide-react';

interface TinAlloyRecord {
  id: string; batchNo: string; city: string; manufacturer: string; snGrade: string;
  application: string; purityPercent: number; meltingPointC: number; investmentCr: number;
  status: string; priority: string; origin: string; destination: string;
  shipDate: string; transitDays: number; zone: string; remarks: string;
};

const tinAlloyRecords: TinAlloyRecord[] = [
  { id: 'TNA-0001', batchNo: 'TNA-B2401', city: 'Mumbai', manufacturer: 'Hindustan Tin', snGrade: 'Sn-99.99 High Purity', application: 'ISRO Satellite Solder BGA', purityPercent: 99.99, meltingPointC: 232, investmentCr: 820, status: 'Delivered', priority: 'Critical', origin: 'Hindustan Tin Mumbai (MH)', destination: 'ISRO Bengaluru (KA)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: '99.99% high-purity tin for ISRO GSAT satellite PCB BGA solder ball and SMT reflow &#8594; &#8377;820Cr for 200 tonnes &#8594; India &#8377;5,600Cr Sn solder &#8594; ISRO 18 satellites &#8594; 232&#176;C &#8594; &#8594; Solder ball &#8594; &#8594; Sn99 &#8594; &#8594; Space' },
  { id: 'TNA-0002', batchNo: 'TNA-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', snGrade: 'Sn-63Pb37 Eutectic', application: 'BEL Radar RF Module', purityPercent: 99.95, meltingPointC: 183, investmentCr: 680, status: 'In Transit', priority: 'Critical', origin: 'DRDO Hyderabad (TG)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'Sn63Pb37 eutectic solder for BEL AESA radar RF module wave solder and manual touch-up &#8594; 63% Sn &#8594; &#8377;680Cr for 120 tonnes &#8594; India &#8377;4,200Cr Sn eutectic &#8594; BEL 12 radars &#8594; 183&#176;C &#8594; &#8594; Solder paste &#8594; &#8594; Sn63 &#8594; &#8594; Defense' },
  { id: 'TNA-0003', batchNo: 'TNA-B2403', city: 'Chennai', manufacturer: 'Sterlite Tin', snGrade: 'Sn-96.5Ag3Cu0.5 SAC', application: 'Wipro PCB Assembly', purityPercent: 99.9, meltingPointC: 217, investmentCr: 520, status: 'Delivered', priority: 'High', origin: 'Sterlite Tin Tuticorin (TN)', destination: 'Wipro Bengaluru (KA)', shipDate: '2026-07-17', transitDays: 3, zone: 'South', remarks: 'SAC305 lead-free solder for Wipro PCB SMT assembly ROHS-compliant server board &#8594; 96.5% Sn &#8594; &#8377;520Cr for 150 tonnes &#8594; India &#8377;3,200Cr Sn SAC &#8594; Wipro 50K boards &#8594; 217&#176;C &#8594; &#8594; Paste &#8594; &#8594; SAC305 &#8594; &#8594; Electronics' },
  { id: 'TNA-0004', batchNo: 'TNA-B2404', city: 'Hyderabad', manufacturer: 'Hyderabad Tin Corp', snGrade: 'Sn-Sb8 Babbitt', application: 'SAIL Heavy Bearing', purityPercent: 99.2, meltingPointC: 240, investmentCr: 460, status: 'Delivered', priority: 'High', origin: 'Hyderabad Tin Hyderabad (TG)', destination: 'SAIL Bhilai (CG)', shipDate: '2026-07-18', transitDays: 4, zone: 'South', remarks: 'Tin-antimony Babbitt alloy for SAIL Bhilai blast furnace main shaft white metal bearing &#8594; 8% Sb &#8594; &#8377;460Cr for 800 tonnes &#8594; India &#8377;2,800Cr Sn Babbitt &#8594; SAIL 6 furnaces &#8594; 240&#176;C &#8594; &#8594; Ingot &#8594; &#8594; B8 &#8594; &#8594; Steel' },
  { id: 'TNA-0005', batchNo: 'TNA-B2405', city: 'Kolkata', manufacturer: 'Bharat Tin Works', snGrade: 'Sn-Pb40 Soft Solder', application: 'Tata Steel Tinplate', purityPercent: 99.5, meltingPointC: 200, investmentCr: 340, status: 'In Transit', priority: 'Medium', origin: 'Bharat Tin Kolkata (WB)', destination: 'Tata Steel Jamshedpur (JH)', shipDate: '2026-07-19', transitDays: 5, zone: 'East', remarks: 'Tin-lead soft solder for Tata Steel tinplate continuous tinning line for food can stock &#8594; 40% Pb &#8594; &#8377;340Cr for 300 tonnes &#8594; India &#8377;1,800Cr Sn tinplate &#8594; Tata 4 CTLs &#8594; 200&#176;C &#8594; &#8594; Bar &#8594; &#8594; Sn60 &#8594; &#8594; Steel' },
  { id: 'TNA-0006', batchNo: 'TNA-B2406', city: 'Coimbatore', manufacturer: 'TN Tin Works', snGrade: 'Sn-99.95 Pharma', application: 'Dr Reddys Tin Capsule', purityPercent: 99.95, meltingPointC: 232, investmentCr: 420, status: 'Delivered', priority: 'Medium', origin: 'TN Tin Works Hosur (TN)', destination: 'Dr Reddys Hyderabad (TG)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'Pharma-grade tin for Dr Reddys tin capsule shell and tablet blister packaging foil &#8594; USP grade &#8594; &#8377;420Cr for 250 tonnes &#8594; India &#8377;2,400Cr Sn pharma &#8594; Dr Reddys 400M caps &#8594; 232&#176;C &#8594; &#8594; Foil &#8594; &#8594; SnPh &#8594; &#8594; Pharma' },
  { id: 'TNA-0007', batchNo: 'TNA-B2407', city: 'Pune', manufacturer: 'Bajaj Tin Div', snGrade: 'Sn-Cu0.7 Low Cost', application: 'Bajaj Auto Fuse', purityPercent: 99.8, meltingPointC: 227, investmentCr: 280, status: 'Delivered', priority: 'Medium', origin: 'Bajaj Tin Chakan (MH)', destination: 'Bajaj Auto Pune (MH)', shipDate: '2026-07-21', transitDays: 2, zone: 'West', remarks: 'Sn-Cu0.7 low-cost lead-free solder for Bajaj Pulsar wiring harness fuse connector &#8594; 0.7% Cu &#8594; &#8377;280Cr for 100 tonnes &#8594; India &#8377;1,400Cr Sn fuse &#8594; Bajaj 5M units &#8594; 227&#176;C &#8594; &#8594; Wire &#8594; &#8594; SnCu &#8594; &#8594; Auto' },
  { id: 'TNA-0008', batchNo: 'TNA-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Tin', snGrade: 'Sn-Ag4 Wave Solder', application: 'L&T Switchgear PCB', purityPercent: 99.7, meltingPointC: 221, investmentCr: 380, status: 'Delivered', priority: 'High', origin: 'Rajasthan Tin Jaipur (RJ)', destination: 'L&T Vadodara (GJ)', shipDate: '2026-07-22', transitDays: 3, zone: 'West', remarks: 'Sn-Ag4 lead-free solder alloy for L&T switchgear controller PCB wave soldering &#8594; 96% Sn &#8594; &#8377;380Cr for 80 tonnes &#8594; India &#8377;2,600Cr Sn wave &#8594; L&T 20K panels &#8594; 221&#176;C &#8594; &#8594; Bar &#8594; &#8594; SnAg &#8594; &#8594; Power' },
  { id: 'TNA-0009', batchNo: 'TNA-B2409', city: 'Guwahati', manufacturer: 'Assam Tin Mine', snGrade: 'Sn-50Pb50', application: 'Godrej Aerosol Can', purityPercent: 99.3, meltingPointC: 190, investmentCr: 260, status: 'In Transit', priority: 'Low', origin: 'Assam Tin Silchar (AS)', destination: 'Godrej Mumbai (MH)', shipDate: '2026-07-23', transitDays: 4, zone: 'East', remarks: 'Sn-50Pb50 alloy for Godrej aerosol can crimp seal and valve body soldering &#8594; 50% Sn &#8594; &#8377;260Cr for 200 tonnes &#8594; India &#8377;1,200Cr Sn aerosol &#8594; Godrej 100M cans &#8594; 190&#176;C &#8594; &#8594; Bar &#8594; &#8594; Sn50 &#8594; &#8594; Consumer' },
  { id: 'TNA-0010', batchNo: 'TNA-B2410', city: 'Ahmedabad', manufacturer: 'Gujarat Tin Corp', snGrade: 'Sn-Bi58 Low Melt', application: ' Dixon LED Thermal', purityPercent: 99.6, meltingPointC: 138, investmentCr: 540, status: 'Delivered', priority: 'High', origin: 'Gujarat Tin Ahmedabad (GJ)', destination: 'Dixon Noida (UP)', shipDate: '2026-07-24', transitDays: 5, zone: 'West', remarks: 'Sn-Bi58 low-melting alloy for Dixon LED TV thermal interface pad and heat sink attach &#8594; 58% Bi &#8594; &#8377;540Cr for 60 tonnes &#8594; India &#8377;3,600Cr Sn low-melt &#8594; Dixon 8M TVs &#8594; 138&#176;C &#8594; &#8594; Foil &#8594; &#8594; SnBi &#8594; &#8594; Electronics' },
  { id: 'TNA-0011', batchNo: 'TNA-B2411', city: 'Lucknow', manufacturer: 'UP Tin Industries', snGrade: 'Sn-In52 Low Melt', application: 'BHEL Transformer Foil', purityPercent: 99.8, meltingPointC: 118, investmentCr: 480, status: 'Delivered', priority: 'Medium', origin: 'UP Tin Lucknow (UP)', destination: 'BHEL Bhopal (MP)', shipDate: '2026-07-25', transitDays: 1, zone: 'North', remarks: 'Sn-In52 ultra-low-melting alloy for BHEL power transformer foil winding soldering &#8594; 52% In &#8594; &#8377;480Cr for 40 tonnes &#8594; India &#8377;3,000Cr Sn-In &#8594; BHEL 30 transformers &#8594; 118&#176;C &#8594; &#8594; Foil &#8594; &#8594; SnIn &#8594; &#8594; Power' },
  { id: 'TNA-0012', batchNo: 'TNA-B2412', city: 'Visakhapatnam', manufacturer: 'Vizag Tin Works', snGrade: 'Sn-Ni0.5 Corrosion', application: 'GRSE Submarine Hull Anode', purityPercent: 99.4, meltingPointC: 232, investmentCr: 860, status: 'Delayed', priority: 'Critical', origin: 'Vizag Tin Visakhapatnam (AP)', destination: 'GRSE Kolkata (WB)', shipDate: '2026-07-26', transitDays: 2, zone: 'East', remarks: 'Tin-nickel alloy for GRSE Project 75I submarine hull cathodic protection anode soldering &#8594; 0.5% Ni &#8594; &#8377;860Cr for 100 tonnes &#8597; India &#8377;6,400Cr Sn naval &#8594; GRSE 6 submarines &#8594; 232&#176;C &#8594; &#8594; Anode &#8594; &#8594; SnNi &#8594; &#8594; Naval' },
  { id: 'TNA-0013', batchNo: 'TNA-B2413', city: 'Bhopal', manufacturer: 'BHEL Tin Div', snGrade: 'Sn-Zn9 LF Solder', application: 'BEL Missile Guidance', purityPercent: 99.7, meltingPointC: 199, investmentCr: 620, status: 'In Transit', priority: 'High', origin: 'BHEL Bhopal (MP)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-27', transitDays: 3, zone: 'Central', remarks: 'Sn-Zn9 lead-free solder for BEL DRDO BrahMos missile guidance PCB assembly &#8594; 91% Sn &#8594; &#8377;620Cr for 70 tonnes &#8594; India &#8377;4,200Cr Sn missile &#8594; BEL 40 boards &#8594; 199&#176;C &#8594; &#8594; Paste &#8594; &#8594; SnZn &#8594; &#8594; Defense' },
  { id: 'TNA-0014', batchNo: 'TNA-B2414', city: 'Rourkela', manufacturer: 'SAIL Tin', snGrade: 'Sn-Cu5 Bronze', application: 'HAL Aircraft Hydraulic', purityPercent: 99.1, meltingPointC: 260, investmentCr: 440, status: 'Delivered', priority: 'High', origin: 'SAIL Rourkela (OD)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-28', transitDays: 4, zone: 'East', remarks: 'Tin-bronze Sn-Cu5 alloy for HAL Tejas Mk2 hydraulic actuator cylinder bushing &#8594; 5% Cu &#8594; &#8377;440Cr for 600 tonnes &#8594; India &#8377;2,800Cr Sn bronze &#8594; HAL 40 actuators &#8594; 260&#176;C &#8594; &#8594; Sleeve &#8594; &#8594; SnCu5 &#8594; &#8594; Aerospace' },
];

export default function TinAlloyLogisticsView() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Wrench },
    { id: 'registry', label: 'Registry', icon: Wrench },
    { id: 'analytics', label: 'Analytics', icon: Wrench },
    { id: 'insights', label: 'Insights', icon: Wrench },
  ];

  const filteredRecords = useMemo(() => {
    return tinAlloyRecords.filter((r) => {
      const matchSearch = searchTerm === '' ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.snGrade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.application.toLowerCase().includes(searchTerm.toLowerCase());
      const matchZone = filterZone === 'all' || r.zone === filterZone;
      const matchStatus = filterStatus === 'all' || r.status === filterStatus;
      return matchSearch && matchZone && matchStatus;
    });
  }, [searchTerm, filterZone, filterStatus]);

  const zones = useMemo(() => {
    const zMap: Record<string, number> = {};
    tinAlloyRecords.forEach((r) => { zMap[r.zone] = (zMap[r.zone] || 0) + 1; });
    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);
  }, []);

  const kpiData = useMemo(() => {
    const total = tinAlloyRecords.reduce((s: number, r) => s + r.investmentCr, 0);
    const avgPurity = tinAlloyRecords.reduce((s: number, r) => s + r.purityPercent, 0) / tinAlloyRecords.length;
    const delayed = tinAlloyRecords.filter((r) => r.status === 'Delayed').length;
    const critical = tinAlloyRecords.filter((r) => r.priority === 'Critical').length;
    return { total, avgPurity: avgPurity.toFixed(2), delayed, critical };
  }, []);

  const statusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'In Transit': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'Delayed': return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'Processing': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const priorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'High': return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'Low': return 'bg-green-500/20 text-green-700 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const themeColor = '#0891b2';
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Tin Alloy Logistics" description="Indian tin alloy (Sn-Sb-Cu) solder, bearing, bronze, electronics and packaging supply chain tracking across 14 grades" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-cyan-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-cyan-600">{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Total Investment</div></CardContent></Card>
        <Card className="border-l-4 border-l-cyan-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-cyan-600">{kpiData.avgPurity}%</div><div className="text-xs text-muted-foreground mt-1">Avg Purity</div></CardContent></Card>
        <Card className="border-l-4 border-l-cyan-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-cyan-600">{kpiData.delayed}</div><div className="text-xs text-muted-foreground mt-1">Delayed Batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-cyan-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-cyan-600">{kpiData.critical}</div><div className="text-xs text-muted-foreground mt-1">Critical Records</div></CardContent></Card>
      </div>
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-cyan-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{zones.map(([zone, count]) => { const pct = (count as number / tinAlloyRecords.length) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16 text-muted-foreground">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium w-8">{count as number}</span></div>; })}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = tinAlloyRecords.filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{s}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {tinAlloyRecords.slice(0, 8).map((r) => <div key={r.id} className="text-center p-3 rounded-lg border bg-muted/30"><div className="text-sm font-medium truncate">{r.snGrade}</div><div className="text-lg font-bold" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className="text-xs text-muted-foreground">{r.application}</div></div>)}
            </div>
          </CardContent></Card>
        </div>
      )}
      {activeTab === 'registry' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <input type="text" placeholder="Search ID, batch, city, grade..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-3 py-2 border rounded-md text-sm flex-1 min-w-[200px]" />
            <select value={filterZone} onChange={(e) => setFilterZone(e.target.value)} className="px-3 py-2 border rounded-md text-sm"><option value="all">All Zones</option>{zones.map(([z]) => <option key={z} value={z}>{z as string}</option>)}</select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border rounded-md text-sm"><option value="all">All Status</option>{['Delivered','In Transit','Delayed','Processing'].map((s) => <option key={s} value={s}>{s}</option>)}</select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filteredRecords.map((record) => (
              <Card key={record.id} className={record.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div><span className="font-semibold text-sm">{record.id}</span><span className="text-xs text-muted-foreground ml-2">{record.batchNo}</span></div>
                    <div className="flex gap-1"><Badge variant="outline" className={statusColor(record.status)}>{record.status}</Badge><Badge variant="outline" className={priorityColor(record.priority)}>{record.priority}</Badge></div>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between"><span className="text-muted-foreground">Grade:</span><span className="font-medium">{record.snGrade}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Application:</span><span className="font-medium">{record.application}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Purity:</span><span className="font-medium">{record.purityPercent}%</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Investment:</span><span className="font-medium" style={{ color: themeColor }}>&#8377;{record.investmentCr}Cr</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">City:</span><span className="font-medium">{record.city}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Route:</span><span className="font-medium text-xs">{record.origin} &#8594; {record.destination}</span></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">Showing {filteredRecords.length} of {tinAlloyRecords.length} records</div>
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Manufacturer Performance</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const mfrMap: Record<string, number> = {}; tinAlloyRecords.forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{mfr as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Priority Distribution</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = tinAlloyRecords.filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{p}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment by Zone</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{(() => { const zInv: Record<string, number> = {}; tinAlloyRecords.forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Purity Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const ranges = { '99%+': 0, '95-98.9%': 0, '90-94.9%': 0, '<90%': 0 }; tinAlloyRecords.forEach((r) => { if (r.purityPercent >= 99) ranges['99%+']++; else if (r.purityPercent >= 95) ranges['95-98.9%']++; else if (r.purityPercent >= 90) ranges['90-94.9%']++; else ranges['<90%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / tinAlloyRecords.length) * 100; return <div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">{count}</span></div>; }); })()}
            </div>
          </CardContent></Card>
        </div>
      )}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-cyan-500 bg-cyan-50/50"><div className="font-medium">Electronics Solder Transition</div><div className="text-xs text-muted-foreground mt-1">ISRO BGA + BEL radar + Wipro SAC + Dixon LED driving &#8594; &#8377;2,560Cr combined &#8594; ROHS lead-free shift accelerating</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-cyan-500 bg-cyan-50/50"><div className="font-medium">Naval Submarine Programme</div><div className="text-xs text-muted-foreground mt-1">GRSE submarine hull anode + BEL missile guidance &#8594; &#8377;1,480Cr combined &#8594; strategic naval demand</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-cyan-500 bg-cyan-50/50"><div className="font-medium">Low-Melting Alloy Innovation</div><div className="text-xs text-muted-foreground mt-1">Dixon Sn-Bi58 138&#176;C + BHEL Sn-In52 118&#176;C &#8594; &#8377;1,020Cr combined &#8594; thermal management frontier</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-cyan-500 bg-cyan-50/50"><div className="font-medium">Monsoon Disruption Alert</div><div className="text-xs text-muted-foreground mt-1">TNA-B2412 GRSE submarine hull anode delayed &#8594; monsoon Visakhapatnam port congestion &#8594; Project 75I at risk</div></div>
          </div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment Landscape</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-cyan-500 bg-cyan-50/50"><div className="font-medium">Total Portfolio: &#8377;{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across 14 tin alloy grades spanning space, defense, electronics, steel, pharma, auto, power and aerospace &#8594; avg purity {kpiData.avgPurity}%</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-cyan-500 bg-cyan-50/50"><div className="font-medium">Critical Priority: 4 Records</div><div className="text-xs text-muted-foreground mt-1">ISRO satellite &#8594; BEL radar &#8594; GRSE submarine &#8594; BEL missile &#8594; national security chain</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-cyan-500 bg-cyan-50/50"><div className="font-medium">Melting Point Range</div><div className="text-xs text-muted-foreground mt-1">Grades span 118&#176;C (Sn-In52) to 260&#176;C (Sn-Cu5 bronze) &#8594; covering ultra-low-melt to high-temp applications</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-cyan-500 bg-cyan-50/50"><div className="font-medium">India Tin Import Dependency</div><div className="text-xs text-muted-foreground mt-1">India imports 70%+ of tin concentrate &#8594; Assam and Rajasthan mines expanding &#8594; Aatmanirbhar tin critical for electronics</div></div>
          </div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
